//Syntax for creating Student Context API

//We import usefull libraries.

import React, {Children, createContext, useEffect, useState} from 'react';

//Create context.
export const StudentContext = createContext();

//Create Provider.
const StudentProvider = ({children})=>{
    const [student, setStudent] = useState(()=>{
        const savedStudent = sessionStorage.getItem('student');
        return savedStudent ? JSON.parse(savedStudent): null; //Load student from localstorage. So unless the browser or tab is closed, the data won't lost.

    });

    useEffect(()=>{
        //Update localStorage whenver student changes

        if(student) {
            sessionStorage.setItem('student', JSON.stringify(student));
        } else{
            sessionStorage.removeItem('student'); //Clear from localstorage on logout, if there is a student login
        }
    }, [student]);

    return (<StudentContext.Provider value = {{student, setStudent}}>
        {children}
    </StudentContext.Provider>
    )
};

export default StudentProvider;

//Above will be updated whenver the 