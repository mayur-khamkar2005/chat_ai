#include <algorithm>
#include <cctype>
#include <cstring>
#include <iostream>
#include <regex>
#include <sstream>
#include <string>
#include <unordered_set>
#include <vector>

#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

namespace
{

    std::string to_lower(std::string text)
    {
        std::transform(text.begin(), text.end(), text.begin(), [](unsigned char c)
                       { return static_cast<char>(std::tolower(c)); });
        return text;
    }

    std::string normalize_quotes(const std::string &text)
    {
        std::string value = text;
        std::regex single_quote("[\xE2\x80\x98\xE2\x80\x99]");
        std::regex double_quote("[\xE2\x80\x9C\xE2\x80\x9D]");
        value = std::regex_replace(value, single_quote, "'");
        value = std::regex_replace(value, double_quote, "\"");
        return value;
    }

    std::string replace_synonyms(const std::string &token)
    {
        std::string value = token;
        if (value == "whats" || value == "what's")
            value = "what";
        if (value == "dont" || value == "don't")
            value = "do not";
        if (value == "cant" || value == "can't")
            value = "can not";
        if (value == "you're" || value == "youre")
            value = "you are";
        if (value == "i'm" || value == "im")
            value = "i am";
        if (value == "it's" || value == "its")
            value = "it is";
        return value;
    }

    std::string stem_token(const std::string &token)
    {
        std::string value = token;
        if (value.size() > 4 && value.compare(value.size() - 3, 3, "ing") == 0)
        {
            value.erase(value.size() - 3);
        }
        else if (value.size() > 3 && value.compare(value.size() - 2, 2, "ed") == 0)
        {
            value.erase(value.size() - 2);
        }
        else if (value.size() > 2 && value.compare(value.size() - 1, 1, "s") == 0)
        {
            value.erase(value.size() - 1);
        }
        return value;
    }

    std::vector<std::string> tokenize(const std::string &text)
    {
        std::vector<std::string> tokens;
        std::istringstream stream(text);
        std::string token;
        static const std::unordered_set<std::string> stop_words = {
            "a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do", "for",
            "from", "had", "have", "how", "i", "in", "is", "it", "me", "my", "of", "on",
            "or", "our", "that", "the", "their", "this", "to", "was", "we", "were", "what",
            "when", "where", "which", "who", "will", "with", "you", "your", "yours"};

        while (stream >> token)
        {
            token = to_lower(token);
            token = normalize_quotes(token);
            token = replace_synonyms(token);
            token = stem_token(token);

            std::regex non_word(R"([^a-z0-9'])");
            token = std::regex_replace(token, non_word, "");

            if (token.empty() || token.size() < 2 || stop_words.count(token))
            {
                continue;
            }

            tokens.push_back(token);
        }

        return tokens;
    }

} // namespace

extern "C"
{

    EXPORT void parse_message(const char *message, char *output, int max_len)
    {
        if (!message || !output || max_len <= 0)
        {
            if (output && max_len > 0)
            {
                output[0] = '\0';
            }
            return;
        }

        std::string text(message);
        text = normalize_quotes(text);
        std::regex whitespace("[\\r\\n\\t]+\\s*");
        text = std::regex_replace(text, whitespace, " ");
        text = to_lower(text);

        std::regex non_word(R"([^a-z0-9'\s])");
        text = std::regex_replace(text, non_word, " ");

        std::regex multi_space("\\s+");
        text = std::regex_replace(text, multi_space, " ");

        std::vector<std::string> tokens = tokenize(text);
        std::string normalized;
        for (size_t i = 0; i < tokens.size(); ++i)
        {
            if (i > 0)
            {
                normalized += " ";
            }
            normalized += tokens[i];
        }

        if (normalized.empty())
        {
            normalized = text;
        }

        std::strncpy(output, normalized.c_str(), max_len - 1);
        output[max_len - 1] = '\0';
    }

    EXPORT int match_pattern(const char *message, const char *pattern)
    {
        if (!message || !pattern)
        {
            return 0;
        }
        try
        {
            std::string text(message);
            std::regex re(pattern, std::regex_constants::icase);
            if (std::regex_search(text, re))
            {
                return 1;
            }
        }
        catch (const std::regex_error &)
        {
            return 0;
        }
        return 0;
    }
}
