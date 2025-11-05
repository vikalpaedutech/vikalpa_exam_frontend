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

    const response = await axios.post(`${API_BASE_URL}/api/student`, rqBody, {
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
