## 1. Setup & Variables

```cpp
// --- Imports (Includes) ---
#include <iostream>
#include <string>
#include <regex>
#include <cstring>

// --- Macros & DLL Export ---
#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

// --- Variables, Constants, and Scope ---
const int MAX_BUFFER = 1024;    // Constant integer

// Global scope
int global_count = 0;

void scope_example() {
    int local_var = 10;         // Local scope
    // Memory allocated on heap (must be freed manually)
    char* dynamic_var = new char[50]; 
    delete[] dynamic_var;
}
```

## 2. All Control Flows

```cpp
// --- If-else Conditions ---
int status = 200;
if (status == 200) {
    std::cout << "OK" << std::endl;
} else if (status == 404) {
    std::cout << "Not Found" << std::endl;
} else {
    std::cout << "Error" << std::endl;
}

// --- Ternary Operator ---
// Syntax: (condition) ? true_value : false_value;
std::string mode = (status == 200) ? "Dev" : "Prod";

// --- Loops: For ---
for (int i = 0; i < 5; i++) {
    std::cout << i << std::endl;
}

// --- Loops: Range-Based For-Each ---
std::string intents[] = {"GREETING", "GOODBYE"};
for (const std::string& intent : intents) {
    std::cout << intent << std::endl;
}

// --- Loops: While ---
int count = 0;
while (count < 3) {
    count++;
    if (count == 2) continue;
    if (count == 5) break;
}

// --- Switch Cases (Only works with integers/enums/chars) ---
switch (status) {
    case 200:
        std::cout << "Success";
        break;
    case 404:
        std::cout << "Missing";
        break;
    default:
        std::cout << "Unknown";
}
```

## 3. Functions & Methods

```cpp
// --- Standard Function ---
std::string get_greeting(std::string name) {
    return "Hello " + name;
}

// --- Default Parameters ---
void print_log(std::string msg, bool error = false) {
    if (error) std::cerr << msg;
    else std::cout << msg;
}

// --- Lambda/Anonymous Function ---
// Syntax: [capture_clause](parameters) -> return_type { body }
auto add = [](int a, int b) -> int {
    return a + b;
};
int sum = add(5, 10);

// --- Extern "C" (Exposing C++ functions to Python/Ctypes) ---
extern "C" {
    EXPORT void process_data(const char* input, char* output, int max_len) {
        // Function logic here
    }
}
```

## 4. Data Handling & Manipulation

```cpp
// --- Strings (std::string) ---
std::string text = "Hello World";
int len = text.length();                    // String length
text.append("!");                           // "Hello World!"
std::string sub = text.substr(0, 5);        // "Hello"

// Transform / Lowercase
#include <algorithm>
#include <cctype>
std::transform(text.begin(), text.end(), text.begin(), 
    [](unsigned char c) { return std::tolower(c); });

// --- C-Strings (char array for DLL interop) ---
const char* c_str = text.c_str();           // std::string to const char*
char buffer[1024];
strncpy(buffer, c_str, 1024 - 1);           // Safe string copy
buffer[1024 - 1] = '\0';                    // Ensure null termination

// --- Regex (std::regex) ---
std::string message = "how are you today?";
std::regex pattern("\\b(how are you)\\b", std::regex_constants::icase);

// Match Check
if (std::regex_search(message, pattern)) {
    std::cout << "Matches pattern!" << std::endl;
}

// Regex Replace
std::regex whitespace("\\s+");
std::string clean = std::regex_replace(message, whitespace, " ");

// --- Vectors (Dynamic Arrays) ---
#include <vector>
std::vector<int> numbers;
numbers.push_back(10);                      // Add element
numbers.pop_back();                         // Remove last element
```

## 5. Advanced & Project Essentials

```cpp
// --- Error Handling Try-Catch ---
try {
    throw std::runtime_error("Something went wrong");
} catch (const std::exception& e) {
    std::cerr << "Caught exception: " << e.what() << std::endl;
}

// --- Pointers and Memory (Project Specific C-Interop) ---
extern "C" {
    EXPORT void detect_intent(const char* message, char* output, int max_len) {
        // 1. Guard against null pointers
        if (!message) {
            strncpy(output, "UNKNOWN", max_len);
            return;
        }
        
        // 2. Safely convert to std::string for easy manipulation
        std::string text(message);
        
        // 3. Process Logic
        if (text == "hi") {
            // 4. Safely write back to the output buffer allocated by Python
            strncpy(output, "GREETING", max_len);
            return;
        }
        
        strncpy(output, "UNKNOWN", max_len);
    }
}
```
