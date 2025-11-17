//This is Student.service.js.

//This contains all the service apis to call for backends'  student.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
/**
 * Create or update a user + userAccess in one request.
 * Expects rqBody to be:
 * {
 *   user: { userName, designation, mobile, password?, _id? },
 *   userAccess: { region: [...] }
 * }
 */

// 🧩 Create or Update User API (POST)
export const createOrUpdateUser = async (rqBody) => {
  try {
    console.log("📤 Sending createOrUpdateUser payload:", rqBody);

    // The payload should look like:
    // {
    //   user: { userName, designation, mobile, password },
    //   userAccess: { region: [...] }
    // }

    const response = await axios.post(
      `${API_BASE_URL}/api/create-update-user`,
      {
        user: rqBody.user,
        userAccess: rqBody.userAccess,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ createOrUpdateUser response:", response.data);
    return response.data;
  } catch (error) {
    // 🧠 Improved error handling
    if (error.response) {
      console.error(
        "❌ createOrUpdateUser error response:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("❌ createOrUpdateUser no response received:", error.request);
    } else {
      console.error("❌ createOrUpdateUser request error:", error.message);
    }

    throw error;
  }
};



/**
 * Get user + userAccess by user _id.
 * rqBody should be: { _id: "<userObjectId>" }
 * (Your backend expects the id in the request body.)
 */
export const getUserWithAccessById = async (rqBody) => {
  try {
    console.log("📤 Sending getUserWithAccessById payload:", rqBody);

    const response = await axios.post(
      `${API_BASE_URL}/api/getUserWithAccessById`,
      rqBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ getUserWithAccessById response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "❌ getUserWithAccessById error response:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("❌ getUserWithAccessById no response received:", error.request);
    } else {
      console.error("❌ getUserWithAccessById request error:", error.message);
    }
    throw error;
  }
};



//user login api mobile-password

export const getUserWithMobileAndPassword = async (rqBody) => {
  try {
    console.log("📤 Sending getUserWithMobileAndPassword payload:", rqBody);

    const response = await axios.post(
      `${API_BASE_URL}/api/get-user-with-mobile-password`,
      rqBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ getUserWithMobileAndPassword response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "❌ getUserWithMobileAndPassword error response:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("❌ getUserWithMobileAndPassword no response received:", error.request);
    } else {
      console.error("❌ getUserWithMobileAndPassword request error:", error.message);
    }
    throw error;
  }
};




export const changePasswordUsingMobile = async (reqBody) =>{

    try {
        const response = await axios.post(
      `${API_BASE_URL}/api/update-password`,
      reqBody,
    );
    return response.data;
    } catch (error) {
        console.log("Errror changing password", error)
    }
}














//Calling service




export const CreateCallLogs = async (reqBody) =>{

    try {
        const response = await axios.post(
      `${API_BASE_URL}/api/create-call-logs`,
      reqBody,
    );
    return response.data;
    } catch (error) {
        console.log("Errror changing password", error)
    }
}



export const GetCallLogsCurrentData = async (reqBody) =>{

    try {
        const response = await axios.post(
      `${API_BASE_URL}/api/fetch-calllogs-by-callerid`,
      reqBody,
    );
    return response.data;
    } catch (error) {
        console.log("Errror changing password", error)
    }
}







export const GetCallLeadsByUserObjectId = async (reqBody) =>{

    try {
        const response = await axios.post(
      `${API_BASE_URL}/api/get-call-leads`,
      reqBody,
    );
    return response.data;
    } catch (error) {
        console.log("Errror", error)
    }
}








export const UpdateCallLeads = async (reqBody) =>{

    try {
        const response = await axios.post(
      `${API_BASE_URL}/api/update-call-leads`,
      reqBody,
    );
    return response.data;
    } catch (error) {
        console.log("Errror", error)
    }
}





export const GetDistrictBlockSchoolsByContact = async (reqBody) =>{

    try {
        const response = await axios.post(
      `${API_BASE_URL}/api/get-district-block-schools-by-contact`,
      reqBody,
    );
    return response.data;
    } catch (error) {
        console.log("Errror", error)
    }
}

