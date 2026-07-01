## 1. Setup & Variables

```python
# --- Imports ---
import ctypes
import os
import sys
import json

# --- Variables & Constants ---
DLL_NAME = "nlp_engine.dll"      # Constant (by convention, UPPERCASE)
is_loaded = False                # Global variable

# --- Scope Rules ---
def setup_engine():
    global is_loaded             # Declare global to modify global variable
    local_var = "Scoped to function"
    is_loaded = True
# local_var is inaccessible here
```

## 2. All Control Flows

```python
# --- If-else Conditions ---
status_code = 200
if status_code == 200:
    print("Success")
elif status_code == 404:
    print("Not Found")
else:
    print("Error")

# --- Ternary Operator ---
# Syntax: [on_true] if [expression] else [on_false]
mode = "Dev" if status_code == 200 else "Prod"

# --- Loops: For (Iterating Collections) ---
intents = ["GREETING", "GOODBYE", "HELP"]
for intent in intents:
    print(intent)

# --- Loops: For (Range) ---
for i in range(5):    # 0 to 4
    print(i)

# --- Loops: While ---
count = 0
while count < 3:
    count += 1
    if count == 2:
        continue      # Skip iteration
    if count == 5:
        break         # Exit loop

# --- Match-Case (Switch Alternative - Python 3.10+) ---
match status_code:
    case 200:
        print("OK")
    case 404:
        print("Missing")
    case _:
        print("Default case")
```

## 3. Functions & Methods

```python
# --- Standard Function ---
def generate_reply(message: str) -> str:
    """Docstring: Generates a reply based on the message."""
    return f"Reply to {message}"

# --- Default Parameters & Keyword Arguments ---
def start_server(host="localhost", port=5000):
    print(f"Starting on {host}:{port}")

start_server(port=8080) # Calling with keyword args

# --- Lambda/Anonymous Function ---
# Syntax: lambda arguments: expression
multiply = lambda x, y: x * y
print(multiply(2, 5))

# --- *args and **kwargs ---
def flexible_func(*args, **kwargs):
    # args is a tuple of positional arguments
    # kwargs is a dictionary of keyword arguments
    pass
```

## 4. Data Handling & Manipulation

```python
# --- Lists (Arrays) Creation & Methods ---
messages = ["Hi", "Hello"]
messages.append("Hey")          # Add to end
messages.pop()                  # Remove last
messages.insert(0, "Start")     # Add at index 0

# List comprehension (Filtering & Mapping)
shout = [m.upper() for m in messages if "H" in m]

# --- Dictionaries (Objects) ---
user = {
    "id": 1,
    "name": "Mayur"
}
user_name = user.get("name", "Default")  # Safe access
user["isActive"] = True                  # Add/Update property

# --- String Methods ---
text = "  Hello World  "
clean_text = text.strip()               # "Hello World"
lower_text = text.lower()               # "hello world"
parts = text.split(" ")                 # ["Hello", "World"]
is_found = "World" in text              # True
encoded_bytes = text.encode('utf-8')    # Convert string to bytes (crucial for ctypes)

# --- JSON Parsing/Stringifying ---
json_string = json.dumps(user)          # Dict to String
parsed_dict = json.loads(json_string)   # String to Dict
```

## 5. Advanced & Project Essentials

```python
# --- Error Handling Try-Catch (Try-Except) ---
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Math Error: {e}")
except Exception as e:
    print(f"Generic Error: {e}")
finally:
    print("Always executes")

# --- File I/O ---
# Read File
with open("data.txt", "r", encoding="utf-8") as file:
    content = file.read()

# Write File
with open("output.txt", "w", encoding="utf-8") as file:
    file.write("Hello Data")

# --- Ctypes DLL Integration (Project Specific) ---
# Loading a DLL
dll_path = os.path.join(os.path.dirname(__file__), 'nlp_engine.dll')
nlp = ctypes.CDLL(dll_path)

# Defining argument types
nlp.parse_message.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]

# Calling C++ Function
input_bytes = "Hello".encode('utf-8')
output_buffer = ctypes.create_string_buffer(1024)

nlp.parse_message(input_bytes, output_buffer, 1024)

# Decoding result back to Python string
result_string = output_buffer.value.decode('utf-8')
```
