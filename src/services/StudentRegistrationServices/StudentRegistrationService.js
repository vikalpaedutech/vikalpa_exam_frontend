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

