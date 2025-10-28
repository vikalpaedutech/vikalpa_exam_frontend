

import axios from 'axios';
const BaseURL = process.env.REACT_APP_API_BASE_URL;

// class PrincipalSchoolsAbrcDataCollectionSerivce {
//     PostUser(formData) {
//         const url =`${BaseURL}/api/user`
//         const config = {
//             headers: {
//                 'content-type':'multipart/form-data',
//             }
//         };
//         return axios.post(url, formData, config);

//     }

//     GetUser (mobile) {
//      const  url = `${BaseURL}/api/userByMobile/${mobile}`
        
//         return axios.get(url)

//     } 
// }

// export default new UserService();


export const CreateData = (reqBody) =>{


    try {
        const response =  axios.post(`${BaseURL}/api/create-principal-abrc`, reqBody)

        return response;
    } catch (error) {
        console.log("Error occured::::>", error)
    }
}