

import axios from 'axios';
const BaseURL = process.env.REACT_APP_API_BASE_URL;


export const CreateData = (reqBody) =>{


    try {
        const response =  axios.post(`${BaseURL}/api/create-principal-abrc`, reqBody)

        return response;
    } catch (error) {
        console.log("Error occured::::>", error)
    }
}





export const GetData = (reqBody) =>{


    try {
        const response =  axios.post(`${BaseURL}/api/get-principal-abrc`, reqBody)

        return response;
    } catch (error) {
        console.log("Error occured::::>", error)
    }
}






export const UpdateData = (reqBody) =>{

    console.log(reqBody)
    alert('hi')

    try {
        const response =  axios.patch(`${BaseURL}/api/update-principal-abrc`, reqBody)

        return response;
    } catch (error) {
        console.log("Error occured::::>", error)
    }
}


