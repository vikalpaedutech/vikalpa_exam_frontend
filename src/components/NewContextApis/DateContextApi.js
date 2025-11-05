// StudentContext.js
import React, { createContext, useState, useEffect } from "react";






export const DateContext = createContext();

export const DateContextProvider = ({children}) => {

    const [dateContext, setDateContext] = useState ([]);

    return (
        <DateContext.Provider value={{   dateContext, setDateContext }}>

            {children}

        </DateContext.Provider>
    )

}






;

