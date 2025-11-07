// //Syntax for creating Student Context API

// //We import usefull libraries.

// import React, {Children, createContext, useEffect, useState} from 'react';

// //Create context.
// export const BulkDownloadContext = createContext();

// //Create Provider.
// const BulkDownloadProvider = ({children})=>{
//     const [bulkDownload, setBulkDownload] = useState(()=>{
//         const savedStudent = sessionStorage.getItem('student');
//         return savedStudent ? JSON.parse(savedStudent): null; //Load student from localstorage. So unless the browser or tab is closed, the data won't lost.

//     });

//     useEffect(()=>{
//         //Update localStorage whenver student changes

//         if(bulkDownload) {
//             sessionStorage.setItem('bulkDownload', JSON.stringify(bulkDownload));
//         } else{
//             sessionStorage.removeItem('bulkDownload'); //Clear from localstorage on logout, if there is a student login
//         }
//     }, [bulkDownload]);

//     return (<BulkDownloadContext.Provider value = {{bulkDownload, setBulkDownload}}>
//         {children}
//     </BulkDownloadContext.Provider>
//     )
// };

// export default BulkDownloadProvider;

// //Above will be updated whenver the 







import React, { createContext, useEffect, useState } from "react";

export const BulkDownloadContext = createContext();

const BulkDownloadProvider = ({ children }) => {
  const [bulkDownload, setBulkDownload] = useState(() => {
    const saved = sessionStorage.getItem("bulkDownload");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (bulkDownload && (Array.isArray(bulkDownload) ? bulkDownload.length > 0 : true)) {
      sessionStorage.setItem("bulkDownload", JSON.stringify(bulkDownload));
    } else {
      sessionStorage.removeItem("bulkDownload");
    }
  }, [bulkDownload]);

  return (
    <BulkDownloadContext.Provider value={{ bulkDownload, setBulkDownload }}>
      {children}
    </BulkDownloadContext.Provider>
  );
};

export default BulkDownloadProvider;
