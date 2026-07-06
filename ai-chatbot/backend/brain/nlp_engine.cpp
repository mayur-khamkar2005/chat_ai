#include <iostream>
#include <string>
#include <regex>
#include <algorithm>
#include <cctype>
#include <cstring>
#include <future>
#include <chrono>

#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

namespace {
    constexpr int MAX_PATTERN_LEN = 512;
    constexpr int MAX_INPUT_LEN   = 2048;
    constexpr auto MATCH_TIMEOUT  = std::chrono::milliseconds(150);

    // Truncate a UTF-8 string to at most max_bytes without splitting a
    // multi-byte sequence. Returns the safe length.
    size_t utf8_safe_len(const std::string& str, size_t max_bytes) {
        if (str.size() <= max_bytes) return str.size();
        size_t len = max_bytes;
        // Walk back until we're not in the middle of a multi-byte sequence.
        // Continuation bytes are 10xxxxxx (0x80-0xBF).
        while (len > 0 && (static_cast<unsigned char>(str[len]) & 0xC0) == 0x80) {
            --len;
        }
        return len;
    }
}

extern "C" {

    EXPORT void parse_message(const char* message, char* output, int max_len) {
        if (!message || !output || max_len <= 0) {
            if (output && max_len > 0) output[0] = '\0';
            return;
        }

        std::string str(message);

        try {
            // toLowerCase (ASCII-safe; leaves multi-byte UTF-8 untouched)
            std::transform(str.begin(), str.end(), str.begin(),
                           [](unsigned char c) { return std::tolower(c); });

            // replace /[\r\n\t]+/g with " "
            static const std::regex re_space("[\\r\\n\\t]+");
            str = std::regex_replace(str, re_space, " ");

            // smart quotes -> straight quotes
            static const std::regex re_sq("\xe2\x80\x98|\xe2\x80\x99");
            str = std::regex_replace(str, re_sq, "'");

            static const std::regex re_dq("\xe2\x80\x9c|\xe2\x80\x9d");
            str = std::regex_replace(str, re_dq, "\"");

            // keep only a-z0-9 whitespace apostrophe
            static const std::regex re_keep("[^a-z0-9\\s']");
            str = std::regex_replace(str, re_keep, " ");

            // collapse whitespace
            static const std::regex re_multispace("\\s+");
            str = std::regex_replace(str, re_multispace, " ");

            // trim
            auto start = str.find_first_not_of(" ");
            auto end = str.find_last_not_of(" ");
            str = (start == std::string::npos) ? "" : str.substr(start, end - start + 1);
        } catch (const std::exception&) {
            // Regex engine failure on pathological input — fail safe to empty.
            str.clear();
        }

        // Safe, UTF-8-boundary-aware truncation into the caller's buffer.
        size_t safe_len = utf8_safe_len(str, static_cast<size_t>(max_len - 1));
        std::memcpy(output, str.data(), safe_len);
        output[safe_len] = '\0';
    }

    // Returns: 1 = match, 0 = no match (or timed out / invalid pattern / error)
    EXPORT int match_pattern(const char* message, const char* pattern) {
        if (!message || !pattern) {
            return 0;
        }

        std::string text(message);
        std::string pat(pattern);

        // Cheap guards before touching the regex engine at all.
        if (text.empty() || pat.empty()) return 0;
        if (text.size() > MAX_INPUT_LEN || pat.size() > MAX_PATTERN_LEN) {
            return 0;
        }

        try {
            // Run the actual match with a hard wall-clock budget so a
            // catastrophic-backtracking pattern can't hang the caller.
            // Note: if the task times out, the underlying thread keeps
            // running in the background until it finishes/dies with the
            // process; this bounds *response* latency, it doesn't kill
            // the runaway thread. Prefer vetting patterns offline (or
            // swapping std::regex for RE2) if this becomes a resource issue.
            std::future<int> fut = std::async(std::launch::async, [&text, &pat]() -> int {
                try {
                    std::regex re(pat, std::regex_constants::icase);
                    return std::regex_search(text, re) ? 1 : 0;
                } catch (const std::regex_error&) {
                    return 0;
                }
            });

            if (fut.wait_for(MATCH_TIMEOUT) == std::future_status::ready) {
                return fut.get();
            }
            // Timed out — treat as "no match", do not block the caller.
            return 0;

        } catch (const std::exception&) {
            return 0;
        }
    }

}