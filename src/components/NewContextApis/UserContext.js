// // UserContext.js
// import React, { createContext, useState, useEffect } from "react";

// // Create the context
// export const UserContext = createContext();

// // Create the provider component
// export const UserProvider = ({ children }) => {
//     const storedUser = sessionStorage.getItem("userData");
//     const [userData, setUserData] = useState(storedUser ? JSON.parse(storedUser) : []);

//     useEffect(() => {
//         if (userData && Object.keys(userData).length > 0) {
//             sessionStorage.setItem("userData", JSON.stringify(userData));
//         } else {
//             sessionStorage.removeItem("userData"); // ✅ Properly clear storage
//         }
//     }, [userData]);

//     return (
//         <UserContext.Provider value={{ userData, setUserData }}>
//             {children}
//         </UserContext.Provider>
//     );
// };














// UserContext.js
import React, { createContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const STORAGE_KEY = "userData";

  // Initialize from sessionStorage (null if nothing stored)
  const stored = sessionStorage.getItem(STORAGE_KEY);
  const [userData, setUserData] = useState(stored ? JSON.parse(stored) : null);

  // Keep sessionStorage in sync; store when we have a non-empty object, remove when null
  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
