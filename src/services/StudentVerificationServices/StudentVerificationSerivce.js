//This is Student.service.js.

//This contains all the service apis to call for backends'  student.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//Get all students data.
//Below calls the api from backend.
// Create Student API (POST)
export const GetStudentdsDataForVerification = async (rqBody) => {
  try {
    console.log("📤 Sending Student Data to API:", rqBody);

    const response = await axios.post(`${API_BASE_URL}/api/get-student-data-for-verification`, rqBody);

    console.log("✅ Students fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching student data for verification:", error);
    throw error;
  }
};







//Updating verification data


// Patch student verification (use PATCH)
export const UpdateStudentVerification = async (rqBody) => {
  try {
    console.log("📤 Sending Student update to API:", rqBody);

    // Use PATCH since we're updating partial resource
    const response = await axios.patch(
      `${API_BASE_URL}/api/patch-student-data-for-verification`,
      rqBody
    );

    console.log("✅ Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating student verification:", error);
    throw error;
  }
};

