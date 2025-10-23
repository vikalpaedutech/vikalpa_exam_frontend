//Here i am writing the logic for callling districtblockcenters api in DistrictBlockCentersRoute.js which is linked with DistirictBlockCentersController.js in the backend

import axios from 'axios';

const BaseURL = process.env.REACT_APP_API_BASE_URL;

class DistrictBlockCentersService {
    getDistrictBlockCenters () {
        const url = `${BaseURL}/api/fetch-districtblockcenters`
        return axios.get(url)
    };
}

export default new DistrictBlockCentersService();