//This is Student.service.js.

//This contains all the service apis to call for backends'  student.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//Get all students data.
//Below calls the api from backend.
// Create Student API (POST)
export const GetStudentsRegisteredByUserCount = async (rqBody) => {
  try {
    console.log("📤  reqbody API:", rqBody);

    const response = await axios.post(`${API_BASE_URL}/api/get-students-registered-by-user-count`, rqBody);

 
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    throw error;
  }
};







export const DashboardCounts = async () => {
  try {
    

    const response = await axios.get(`${API_BASE_URL}/api/l1-dashboard-counts`);

 
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    throw error;
  }
};










export const GetStudentsRegisteredByUser = async (rqBody) => {
  try {
    console.log("📤  reqbody API:", rqBody);

    const response = await axios.post(`${API_BASE_URL}/api/get-students-registered-by-user`, rqBody);

 
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    throw error;
  }
};
