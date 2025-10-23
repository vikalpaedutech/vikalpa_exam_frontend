//This api is the service for fetching the verifications user data from db by communication backend.


import axios from 'axios';
const BaseURL = process.env.REACT_APP_API_BASE_URL;


class VerificationService {
    getVerificationUsers (userId) {
        const url = `${BaseURL}/api/get-verificationUsers/${userId}`
        return axios.get(url)
    };

    

}

export default new VerificationService();