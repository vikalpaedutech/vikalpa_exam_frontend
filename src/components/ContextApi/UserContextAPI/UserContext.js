// Syntax for creating context Api

import React, { createContext, useState, useEffect } from "react";

//Creating a context.
export const UserContext = createContext ();

//Creating a Provieder

const UserProvider = ({children})=>{
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null; // Load user from localStorage
    });

    useEffect(() => {
        // Update localStorage whenever user changes
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user'); // Clear from localStorage on logout
        }
    }, [user]);

    return (<UserContext.Provider value = {{user, setUser}}>
        {children}
    </UserContext.Provider>
        
    )
};


export default UserProvider;


