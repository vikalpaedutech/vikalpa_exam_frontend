// Here we write the logic for calling on DistrictBlockSchool api in DistrictBlockSchool rout, which are linked with DistrictBlockSchoolController in the backend.



import axios from 'axios';
const BaseURL = process.env.REACT_APP_API_BASE_URL;

class DistrictBlockSchoolService {
    getDistricts () {
        const url = `${BaseURL}/api/Fetch-districts`
        return axios.get(url)
    };

    getBlocks () {
        const url = `${BaseURL}/api/Fetch-blocks`
        return axios.get(url)

    };

    getSchools () {
        const url = `${BaseURL}/api/Fetch-schools`
        return axios.get(url)

    }
}

export default new DistrictBlockSchoolService();