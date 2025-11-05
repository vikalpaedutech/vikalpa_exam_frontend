// StudentContext.js
import React, { createContext, useState, useEffect } from "react";

// Create the context
export const StudentContext = createContext();

// Create the provider component
export const StudentProviderV1 = ({ children }) => {
  const STORAGE_KEY = "studentData";

  // Initialize from sessionStorage (null if nothing stored)
  const stored = sessionStorage.getItem(STORAGE_KEY);
  const [studentData, setStudentData] = useState(stored ? JSON.parse(stored) : null);

  // Keep sessionStorage in sync; store when we have a non-empty object, remove when null
  useEffect(() => {
    if (studentData && Object.keys(studentData).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(studentData));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [studentData]);

  return (
    <StudentContext.Provider value={{ studentData, setStudentData }}>
      {children}
    </StudentContext.Provider>
  );
};







export const ClassContext = createContext();

export const ClassOfStudentProvider = ({children}) => {

    const [classContext, setClassContext] = useState ([]);

    return (
        <ClassContext.Provider value={{   classContext, setClassContext }}>

            {children}

        </ClassContext.Provider>
    )

}







//File-Upload holder context api

export const FileUploadContext = createContext();

export const FileUploadProvider = ({ children }) => {
  // Different variable names for state
  const [fileUploadData, setFileUploadData] = useState([]);

  return (
    <FileUploadContext.Provider value={{ fileUploadData, setFileUploadData }}>
      {children}
    </FileUploadContext.Provider>
  );
};

