//This is DependentDropdowns.contextAPI.js
//It stores the drop down selected values in context apis. 
//Then those values can be used across the apps for filtering, in forms like areas.














import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {Row, Col, Container} from 'react-bootstrap'
import { GetDistrictBlockSchoolByParams } from "../../services/DependentDropDownSerivces/DependentDropDownService";

export const DistrictBlockSchoolDependentDropDownContext = createContext();

export const DistrictBlockSchoolDependentDropDownProvider = ({ children }) => {
  const [districtContext, setDistrictContext] = useState(null);
  const [blockContext, setBlockContext] = useState(null);
  const [schoolContext, setSchoolContext] = useState(null);

  return (
    <DistrictBlockSchoolDependentDropDownContext.Provider
      value={{
        districtContext,
        setDistrictContext,
        blockContext,
        setBlockContext,
        schoolContext,
        setSchoolContext,
      }}
    >
      {children}
    </DistrictBlockSchoolDependentDropDownContext.Provider>
  );
};




export const DistrictContext = createContext();

export const DistrictProvider = ({children}) => {
    const [districtContext, setDistrictContext] = useState ([]);
    // const [blockContext, setBlockContext] = useState ([]);
    // const [schoolContext, setSchoolContext] = useState ([]);

 

    return (
        <DistrictContext.Provider value={{ districtContext, setDistrictContext}}>

            {children}

        </DistrictContext.Provider>
    )


};















export const BlockContext = createContext();

export const BlockProvider = ({children}) => {

    const [blockContext, setBlockContext] = useState ([]);

    return (
        <BlockContext.Provider value={{  blockContext, setBlockContext}}>

            {children}

        </BlockContext.Provider>
    )

}



export const SchoolContext = createContext();

export const SchoolProvider = ({children}) => {

    const [schoolContext, setSchoolContext] = useState ([]);

    return (
        <SchoolContext.Provider value={{   schoolContext, setSchoolContext }}>

            {children}

        </SchoolContext.Provider>
    )

}



























// Used in login, signup, and admin creat user form form
const DistrictBlockSchoolContext = createContext(null);

// Provider
export const DistrictBlockSchoolProvider = ({ children }) => {
  const [districtBlockSchoolData, setDistrictBlockSchoolData] = useState(null);
  const [loadingDBS, setLoadingDBS] = useState(false);
  const [dbsError, setDbsError] = useState(null);

  const fetchDistrictBlockSchoolData = useCallback(async () => {
    setLoadingDBS(true);
    setDbsError(null);
    try {
      const response = await GetDistrictBlockSchoolByParams();
      // adjust according to actual response shape (response.data or response)
      setDistrictBlockSchoolData(response?.data ?? response);
    } catch (err) {
      setDbsError(err);
      console.error("Error fetching district block school data:", err);
    } finally {
      setLoadingDBS(false);
    }
  }, []);

  // fetch on mount
  useEffect(() => {
    fetchDistrictBlockSchoolData();
  }, [fetchDistrictBlockSchoolData]);

  return (
    <DistrictBlockSchoolContext.Provider
      value={{
        districtBlockSchoolData,
        loadingDBS,
        dbsError,
        refetchDistrictBlockSchoolData: fetchDistrictBlockSchoolData,
      }}
    >
      {children}
    </DistrictBlockSchoolContext.Provider>
  );
};

// Helper hook for consumers
export const useDistrictBlockSchool = () => {
  const ctx = useContext(DistrictBlockSchoolContext);
  if (!ctx) {
    throw new Error("useDistrictBlockSchool must be used inside DistrictBlockSchoolProvider");
  }
  return ctx;
};

export default DistrictBlockSchoolContext;
