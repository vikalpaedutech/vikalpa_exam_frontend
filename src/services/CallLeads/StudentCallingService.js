//This is Student.service.js.

//This contains all the service apis to call for backends'  student.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;





export const GetTodayCallingStudents = async (reqBody) => {
  try {

    const response = await axios.post(`${API_BASE_URL}/api/get-student-calling`, reqBody);

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    throw error;
  }
};



export const UpdateCallingStatus = async (reqBody) => {
  try {

    const response = await axios.post(`${API_BASE_URL}/api/update-student-calling`, reqBody);

    return response.data;
  } catch (error) {
    console.error("❌ Error updating data:", error);
    throw error;
  }
};
