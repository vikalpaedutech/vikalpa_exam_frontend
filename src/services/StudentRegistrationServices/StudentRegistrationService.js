//This is Student.service.js.

//This contains all the service apis to call for backends'  student.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//Get all students data.
//Below calls the api from backend.
// Create Student API (POST)
export const createStudent = async (rqBody) => {
  try {
    console.log("📤 Sending Student Data to API:", rqBody);

    const response = await axios.post(`${API_BASE_URL}/api/student---deactivated`, rqBody, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Student created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating student data:", error);
    throw error;
  }
};








export const updateStudent = async (rqBody) => {
  try {
    console.log("Updating Student Data to API:", rqBody);

    const response = await axios.patch(`${API_BASE_URL}/api/update-student`, rqBody, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Student created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating student data:", error);
    throw error;
  }
};







export const getStudentBySrnNumberOrSlipId = async (rqBody) => {
  try {
    console.log("student login reqbody", rqBody);

    const response = await axios.post(`${API_BASE_URL}/api/get-student`, rqBody);

    console.log("✅ Student fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating fetcnhing student data:", error);
    throw error;
  }
};




//Admit card downlowded api


export const IsAdmitCardDownloaded = async (reqBody) =>{




  try {

     const response = await axios.post(`${API_BASE_URL}/api/admit-card-downloaded`, reqBody);

      return response.data;
  } catch (error) {
     console.error("❌ Error updating admit card status:", error);
    throw error;
  }
}






//Patch aadhar number


export const updateStudentAadhar = async (reqBody) =>{




  try {

     const response = await axios.post(`${API_BASE_URL}/api/update-aadhar`, reqBody);

      return response.data;
  } catch (error) {
     console.error("❌ Error updating admit card status:", error);
    throw error;
  }
}





//Attendance sheet api

export const GetAttendanceSheetData = async (rqBody) => {
  try {
    console.log(rqBody);

    const response = await axios.post(`${API_BASE_URL}/api/get-attendance-sheet-data`, rqBody);

    console.log(response.data);
    return response.data;

  } catch (error) {

    console.error("Error fetching data", error);

    throw error;
  }
};


export const GetAttendanceSheetDataS100 = async (rqBody) => {
  try {
    console.log(rqBody);

    const response = await axios.post(`${API_BASE_URL}/api/get-attendance-sheet-data-s100`, rqBody);

    console.log(response.data);
    return response.data;

  } catch (error) {

    console.error("Error fetching data", error);

    throw error;
  }
};



export const GetAttendanceSheetDataCounselling = async (rqBody) => {
  try {
    console.log(rqBody);
 

    const response = await axios.post(`${API_BASE_URL}/api/get-attendance-sheet-counselling`, rqBody);

    console.log(response.data);
    return response.data;

  } catch (error) {

    console.error("Error fetching data", error);

    throw error;
  }
};








export const updateCounsellingFields = async (rqBody) => {
  try {
    console.log(rqBody);
 

    const response = await axios.post(`${API_BASE_URL}/api/update-counselling-fields`, rqBody);

    console.log(response.data);
    return response.data;

  } catch (error) {

    console.error("Error fetching data", error);

    throw error;
  }
};








export const MarkCounsellingAttendance = async (rqBody) => {
  try {
    console.log(rqBody);

    const response = await axios.post(`${API_BASE_URL}/api/mark-counselling-attendance`, rqBody);

    console.log(response.data);
    return response.data;

  } catch (error) {

    console.error("Error fetching data", error);

    throw error;
  }
};




// export const updateCenterPreference = async (rqBody) => {

//   alert('in service')
//   try {
//     console.log(rqBody);

  
//     const response = await axios.post(`${API_BASE_URL}/api/update-center-preference`, rqBody);

//     console.log(response.data);
//     return response.data;

//   } catch (error) {

//     console.error("Error fetching data", error);

//     throw error;
//   }
// };



export const updateCenterPreference = async (rqBody) => {
  console.log("=== updateCenterPreference SERVICE CALLED ===");
  console.log("Request body:", rqBody);
  console.log("API_BASE_URL:", API_BASE_URL);
  
  // alert('in service'); // Remove alert, use console.log instead
  
  try {
    const url = `${API_BASE_URL}/api/update-center-preference`;
    console.log("Making POST request to:", url);
    
    const response = await axios.post(url, rqBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log("Response received:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("Error in updateCenterPreference:", error);
    
    // Log detailed error information
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    
    throw error;
  }
};




// In your StudentRegistrationService.js
export const updateDocumentVerification = async (rqBody) => {
  console.log("=== updateDocumentVerification SERVICE CALLED ===");
  console.log("Request body:", rqBody);
  
  try {
    const url = `${API_BASE_URL}/api/update-document-verification`;
    console.log("Making POST request to:", url);
    
    const response = await axios.post(url, rqBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log("Response received:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("Error in updateDocumentVerification:", error);
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    }
    
    throw error;
  }
};



//Dashboard-counselling-verification

export const getCenterPreferenceDashboard = async () => {
  try {
    

    const response = await axios.post(`${API_BASE_URL}/api/dashboard-counselling-centerpreference`);

    console.log(response.data);
    return response.data;

  } catch (error) {

    console.error("Error fetching data", error);

    throw error;
  }
};





//Attendance sheet api

export const FetchMbL2QualifiedStudent = async () => {
  try {
   

    const response = await axios.post(`${API_BASE_URL}/api/fetch-mb-l2-qualified-student`);

    console.log(response.data);
    return response.data;

  } catch (error) {

    console.error("Error fetching data", error);

    throw error;
  }
};




//Updating level 3 attendance

export const markL3AttendanceOfStudents = async (reqBody) => {
  try {
   

    const response = await axios.post(`${API_BASE_URL}/api/update-level3-attendance`, reqBody);

    console.log(response.data);
    return response.data;

  } catch (error) {

    console.error("Error fetching data", error);

    throw error;
  }
};

