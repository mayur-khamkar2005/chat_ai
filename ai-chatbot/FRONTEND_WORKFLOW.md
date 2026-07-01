# Frontend Development Workflow 🎨

Ye document aapko samjhayega ki frontend (React) mein kaam karne ka workflow kya hona chahiye. Jab bhi aapko UI mein kuch naya add karna ho, toh in steps ko logically follow karein.

---

## Scenario: Ek Naya Feature (Component) Add Karna

Maan lijiye aapko chat screen par ek "Clear Chat" ka button lagana hai jo click karne par saari chat history delete kar de.

### Step 1: Component Banayein (`src/components/`)
Hamesha chhote-chhote parts mein UI ko divide karein. Agar naya button ya UI element banana hai, toh usko pehle components folder mein banayein.

**File:** `src/components/ClearButton.jsx`
```javascript
import React from 'react';

const ClearButton = ({ onClear }) => {
    return (
        <button onClick={onClear} className="clear-btn">
            Clear Chat 🗑️
        </button>
    );
};

export default ClearButton;
```

### Step 2: Styling Add karein (`src/index.css` ya CSS Modules)
Button kaisa dikhega, uska CSS add karein. Best practice hai ki classes use karein.
```css
.clear-btn {
    background-color: red;
    color: white;
    padding: 10px;
    border-radius: 5px;
}
```

### Step 3: State aur Logic Handle karein (Main Component/App.jsx)
Ab button ban gaya hai, par jab koi click kare toh history kaise delete hogi? Ye kaam React ki state (`useState`) karti hai. Isko wahan handle karein jahan messages store ho rahe hain (e.g., `ChatScreen.jsx` ya `App.jsx`).

```javascript
import ClearButton from './components/ClearButton';
import { useState } from 'react';

function ChatScreen() {
    // Ye hamari messages ki list hai
    const [messages, setMessages] = useState([]);

    // Clear function
    const clearHistory = () => {
        setMessages([]); // Saare messages array se uda diye
    };

    return (
        <div>
            {/* Component ko use kiya aur usme clear function pass kar diya */}
            <ClearButton onClear={clearHistory} />
            
            <div className="chat-box">
                {messages.map(msg => <p>{msg.text}</p>)}
            </div>
        </div>
    );
}
```

---

## Scenario 2: API Call Handle Karna (Backend se data lana)

Agar aapko backend se koi naya data (jaise user profile) lana hai, toh usko direct component ke beech mein fetch na karein. Best practice hai usko alag service file mein likhna.

### Step 1: Service Banayein (`src/services/api.js`)
```javascript
// Yahan saari network calls rahengi
export const fetchUserProfile = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/profile');
        return await response.json();
    } catch (error) {
        console.error("Data laane mein error:", error);
    }
}
```

### Step 2: Component mein usko Call karein (`useEffect` ke zariye)
```javascript
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api';

function ProfileCard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Jab component screen pe aayega, tabhi API call hogi
        const getData = async () => {
            const data = await fetchUserProfile();
            setUser(data);
        };
        getData();
    }, []); // Empty bracket matlab sirf pehli baar chalega

    if (!user) return <p>Loading...</p>;

    return <h1>Welcome, {user.name}</h1>;
}
```

---

## Golden Rules for Frontend (React)
1. **DRY (Don't Repeat Yourself):** Agar koi code 2 jagah use ho raha hai, toh uska alag component bana lo.
2. **State Management:** Jo state jahan zaroori ho wahi rakho. Agar 2 components ko same data chahiye, toh state ko unke common parent component mein rakho (jise "Lifting State Up" bolte hain).
3. **Services for API:** `fetch` calls ko component se nikal kar `services/` folder mein rakho taaki code clean lage.
