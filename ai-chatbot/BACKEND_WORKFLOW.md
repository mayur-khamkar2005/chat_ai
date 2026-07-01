# Backend Development Workflow 🚀

Ye document aapko samjhayega ki agar aapko backend mein koi naya feature, naya chat intent, ya naya API route add karna hai, toh uska exact workflow kya hoga. Kyunki hamara backend **Node.js (JavaScript)**, **Python**, aur **C++** ka combination hai, toh sab kuch ek chain ki tarah kaam karta hai.

---

## Scenario 1: Chatbot mein Naya "Intent" ya "Pattern" Add Karna (C++ ➡️ Python)

Maan lijiye aap chahte hain ki agar user bole "tell me a joke", toh bot ek joke sunaye. Isme JS ko chhedne ki zarurat nahi padegi. Niche diye gaye steps follow karein:

### Step 1: C++ mein Pattern Add karein (`backend/brain/nlp_engine.cpp`)
Sabse pehle C++ file open karein, kyunki saara heavy text processing aur regex matching yahan hota hai.
1. `detect_intent` function ke andar apna naya condition likhein:
   ```cpp
   // JOKE INTENT
   if (std::regex_search(text, std::regex("\\b(joke|funny|laugh)\\b", std::regex_constants::icase))) {
       strncpy(output, "JOKE", max_len); 
       return;
   }
   ```
2. **Crucial Step:** Code likhne ke baad DLL file ko waapis compile karna zaroori hai. Terminal open karke `backend/brain` folder mein jayein aur run karein:
   ```bash
   g++ -shared -o nlp_engine.dll nlp_engine.cpp -static
   ```

### Step 2: Python mein Logic Handle karein (`backend/brain/brain.py`)
Ab C++ ne intent ("JOKE") dhoondh liya hai. Python ka kaam hai decide karna ki us intent par kya reply dena hai.
1. `brain.py` open karein.
2. `generate_reply` function mein jakar ek nayi if-condition add karein:
   ```python
   if intent == "JOKE":
       return "Why do programmers prefer dark mode? Because light attracts bugs!"
   ```
*Bas! Ab next time jab user "joke" bolega, C++ usko identify karega, Python reply generate karega, aur Node.js usko frontend tak bhej dega.*

---

## Scenario 2: Naya API Endpoint Add Karna (JavaScript)

Maan lijiye aapko ek naya feature add karna hai, jaise user ka profile fetch karna (`/api/profile`). Yahan AI involve nahi hai, toh C++ aur Python ka koi kaam nahi.

### Step 1: Naya Route Banayein (`backend/routes/profile.route.js`)
Ek nayi route file banayein aur express router set karein.
```javascript
const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/profile.controller');

router.get('/', getProfile);

module.exports = router;
```

### Step 2: Controller Banayein (`backend/controllers/profile.controller.js`)
Yahan par actual logic likhein ki data kahan se aayega (Database se ya static).
```javascript
const getProfile = (req, res) => {
    res.json({ name: "Mayur", role: "Admin" });
};
module.exports = { getProfile };
```

### Step 3: Route ko App.js se Connect karein (`backend/app.js`)
Main `app.js` file mein jayein aur naye route ko register karein.
```javascript
const profileRoutes = require('./routes/profile.route');
app.use('/api/profile', profileRoutes);
```

---

## Quick Summary (Kaunsa Language Kab Use Karein?)

- **C++ (`nlp_engine.cpp`)**: Jab bhi kisi string/text par heavy searching, regex pattern matching, ya NLP ka core parsing karna ho.
- **Python (`brain.py`)**: Jab C++ se mile hue output par koi decision lena ho, ya chatbot ka core reply set karna ho.
- **JavaScript (`controllers/` & `routes/`)**: Jab internet se request receive karni ho (API handling), database se connect karna ho, ya Python script ko run karke result wapis UI ko bhejna ho.
