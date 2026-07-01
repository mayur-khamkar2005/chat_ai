## 1. Setup & Variables

```javascript
// --- Imports (CommonJS Backend) ---
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

// --- Imports (ES Modules Frontend) ---
import React, { useState, useEffect } from 'react';
import './App.css';

// --- Variables & Constants ---
const PORT = 5000;           // Block-scoped constant, cannot be reassigned
let messageText = "Hello";   // Block-scoped variable, can be reassigned
var legacyVar = "Old way";   // Function-scoped (avoid using)

// --- Scope Rules ---
{
  let scopedVar = "I exist only here";
  const alsoScoped = "Me too";
}
// scopedVar and alsoScoped are inaccessible here
```

## 2. All Control Flows

```javascript
// --- If-else Conditions ---
if (PORT === 5000) {
    console.log("Local server");
} else if (PORT === 8080) {
    console.log("Test server");
} else {
    console.log("Unknown port");
}

// --- Ternary Operator ---
const status = (PORT === 5000) ? 'Development' : 'Production';

// --- Loops: For ---
for (let i = 0; i < 5; i++) {
    console.log(`Index: ${i}`);
}

// --- Loops: While ---
let count = 0;
while (count < 3) {
    count++;
}

// --- Loops: For-Each (Arrays) ---
const intents = ['GREETING', 'GOODBYE'];
intents.forEach((intent, index) => {
    console.log(`${index}: ${intent}`);
});

// --- Loops: For-Of (Iterables) ---
for (const intent of intents) {
    console.log(intent);
}

// --- Loops: For-In (Object Keys) ---
const config = { host: 'localhost', port: 5000 };
for (const key in config) {
    console.log(`${key} -> ${config[key]}`);
}

// --- Switch Cases ---
switch (status) {
    case 'Development':
        console.log("Dev mode active");
        break;
    case 'Production':
        console.log("Prod mode active");
        break;
    default:
        console.log("Unknown mode");
}
```

## 3. Functions & Methods

```javascript
// --- Standard Function ---
function generateReply(message) {
    return `Reply to: ${message}`;
}

// --- Arrow/Lambda Function ---
const handleSendMessage = (message) => {
    return `Message sent: ${message}`;
};

// --- Implicit Return Arrow Function ---
const getPort = () => PORT;

// --- Default Parameters ---
function startServer(port = 5000) {
    console.log(`Starting on ${port}`);
}

// --- Anonymous Function (Passed as Callback) ---
setTimeout(function() {
    console.log("Executed after delay");
}, 1000);
```

## 4. Data Handling & Manipulation

```javascript
// --- Arrays/Lists Creation & Methods ---
let messages = ["Hello", "World"];
messages.push("!");           // Add to end
messages.pop();               // Remove from end
messages.unshift("Start");    // Add to beginning
messages.shift();             // Remove from beginning

const filtered = messages.filter(msg => msg.includes("H"));
const mapped = messages.map(msg => msg.toUpperCase());

// --- Objects/Dictionaries ---
const user = {
    id: 1,
    name: "Mayur",
    sendMessage: function(msg) {
        return `${this.name} says ${msg}`;
    }
};
console.log(user.name);
user.isActive = true;         // Adding new property

// --- Object Destructuring ---
const { id, name } = user;

// --- String Methods ---
let text = "  Hello World  ";
text = text.trim();                   // "Hello World"
const lower = text.toLowerCase();     // "hello world"
const parts = text.split(" ");        // ["Hello", "World"]
const isIncluded = text.includes("W"); // true

// --- JSON Parsing/Stringifying ---
const jsonString = JSON.stringify(user);   // Object to String
const parsedObj = JSON.parse(jsonString);  // String to Object
```

## 5. Advanced & Project Essentials

```javascript
// --- Error Handling Try-Catch ---
try {
    const data = JSON.parse("invalid json");
} catch (error) {
    console.error("Failed to parse:", error.message);
} finally {
    console.log("Execution finished");
}

// --- Promises ---
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Success!"), 1000);
});
myPromise.then(res => console.log(res)).catch(err => console.error(err));

// --- Async/Await & Fetch API Requests (Frontend) ---
const fetchChatReply = async (message) => {
    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error("API Error:", error);
    }
};

// --- Child Process (Backend) ---
const spawnPython = (message) => {
    const pythonProcess = spawn("python", ["brain.py", message]);
    
    pythonProcess.stdout.on("data", (data) => {
        console.log(data.toString());
    });
};
```
