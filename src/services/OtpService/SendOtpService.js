
import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//Get User attendance by user id

export const sendOtp = (payload) => {

    console.log("Querying id for user attendance: ", payload)

      // Prepare query parameters to send in the URL
      const queryString = new URLSearchParams(payload).toString();
    
       console.log("I am queryParams for user attendance", payload)
    try {
        
        const response = axios.post(`${API_BASE_URL}/api/send-otp`, payload)
        
        return response;

    } catch (error) {
        console.log("Error occured while fetching user attendance data", error)
    };
}


