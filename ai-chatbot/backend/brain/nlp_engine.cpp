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

    EXPORT void detect_intent(const char* message, char* output, int max_len) {
        if (!message) {
            strncpy(output, "UNKNOWN", max_len);
            return;
        }
        std::string text(message);

        // GREETING
        if (std::regex_search(text, std::regex("^(hi|hy|hello|hey|howdy|sup|yo|hiya)\\b", std::regex_constants::icase)) ||
            std::regex_search(text, std::regex("\\bgood (morning|afternoon|evening)\\b", std::regex_constants::icase))) {
            strncpy(output, "GREETING", max_len); return;
        }

        // WELLBEING
        if (std::regex_search(text, std::regex("\\b(how are you|how are u|how r you|how you doing|how do you do)\\b", std::regex_constants::icase)) ||
            std::regex_search(text, std::regex("\\b(whats up|what's up)\\b", std::regex_constants::icase))) {
            strncpy(output, "WELLBEING", max_len); return;
        }

        // GOODBYE
        if (std::regex_search(text, std::regex("\\b(bye|goodbye|good bye|see you|see ya|later|take care)\\b", std::regex_constants::icase))) {
            strncpy(output, "GOODBYE", max_len); return;
        }

        // HELP
        if (std::regex_search(text, std::regex("\\b(help|assist|support)\\b", std::regex_constants::icase)) ||
            std::regex_search(text, std::regex("\\b(can you help|need help)\\b", std::regex_constants::icase))) {
            strncpy(output, "HELP", max_len); return;
        }

        // BOT_NAME
        if (std::regex_search(text, std::regex("\\b(what is your name|whats your name|what's your name)\\b", std::regex_constants::icase)) ||
            std::regex_search(text, std::regex("\\b(who are you|your name)\\b", std::regex_constants::icase))) {
            strncpy(output, "BOT_NAME", max_len); return;
        }

        // THANKS
        if (std::regex_search(text, std::regex("\\b(thanks|thank you|thx|appreciate it)\\b", std::regex_constants::icase))) {
            strncpy(output, "THANKS", max_len); return;
        }

        strncpy(output, "UNKNOWN", max_len);
    }

    EXPORT void detect_intent2(const char* message, char* output, int max_len) {
        if (!message) {
            strncpy(output, "UNKNOWN", max_len);
            return;
        }
        std::string text(message);

        // BADWORDS
        if (std::regex_search(text, std::regex("\\b(fuck[-\\s]*you|fuck|shit|bitch|asshole)\\b", std::regex_constants::icase)) ||
            std::regex_search(text, std::regex("\\b(shut[-\\s]*up|shutup|idiot|stupid)\\b", std::regex_constants::icase))) {
            strncpy(output, "BADWORDS", max_len); return;
        }

        strncpy(output, "UNKNOWN", max_len);
    }

}
