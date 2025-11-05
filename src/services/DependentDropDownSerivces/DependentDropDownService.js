//This is Student.service.js.

//This contains all the service apis to call for backends'  student.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//Get all students data.
//Below calls the api from backend.
// Create Student API (POST)
export const GetDistrictBlockSchoolByParams = async (rqBody) => {
  try {
   

    const response = await axios.post(`${API_BASE_URL}/api/get-district-block-schools`, rqBody);

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    throw error;
  }
};
