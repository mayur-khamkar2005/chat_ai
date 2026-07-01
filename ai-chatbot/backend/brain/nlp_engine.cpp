#include <iostream>
#include <string>
#include <regex>
#include <algorithm>
#include <cctype>
#include <cstring>

#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

extern "C" {

    EXPORT void parse_message(const char* message, char* output, int max_len) {
        if (!message) {
            output[0] = '\0';
            return;
        }
        std::string str(message);

        // toLowerCase
        std::transform(str.begin(), str.end(), str.begin(), [](unsigned char c) { return std::tolower(c); });

        // replace /[\r\n\t]+/g with " "
        std::regex re_space("[\\r\\n\\t]+");
        str = std::regex_replace(str, re_space, " ");

        // replace smart quotes
        // UTF-8 for \u2018 is \xe2\x80\x98, \u2019 is \xe2\x80\x99
        std::regex re_sq("\xe2\x80\x98|\xe2\x80\x99");
        str = std::regex_replace(str, re_sq, "'");

        // UTF-8 for \u201C is \xe2\x80\x9c, \u201D is \xe2\x80\x9d
        std::regex re_dq("\xe2\x80\x9c|\xe2\x80\x9d");
        str = std::regex_replace(str, re_dq, "\"");

        // replace /[^a-z0-9\s']/g with " "
        std::regex re_keep("[^a-z0-9\\s']");
        str = std::regex_replace(str, re_keep, " ");

        // replace /\s+/g with " "
        std::regex re_multispace("\\s+");
        str = std::regex_replace(str, re_multispace, " ");

        // trim
        auto start = str.find_first_not_of(" ");
        auto end = str.find_last_not_of(" ");
        if (start == std::string::npos) {
            str = "";
        } else {
            str = str.substr(start, end - start + 1);
        }

        strncpy(output, str.c_str(), max_len - 1);
        output[max_len - 1] = '\0';
    }

    EXPORT int match_pattern(const char* message, const char* pattern) {
        if (!message || !pattern) {
            return 0;
        }
        try {
            std::string text(message);
            std::regex re(pattern, std::regex_constants::icase);
            if (std::regex_search(text, re)) {
                return 1;
            }
        } catch (const std::regex_error& e) {
            // Invalid regex pattern provided from JSON
            return 0;
        }
        return 0;
    }

}
