//Creating api to call the backend controller api

import axios from 'axios';
const BaseURL = process.env.REACT_APP_API_BASE_URL;

export const sendNotification = async  (mobile, message) =>{
    try {
        const response = await axios.post(`${BaseURL}/api/notifications/send`, {mobile, message});
        return response.data;

        
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
        
    }
};