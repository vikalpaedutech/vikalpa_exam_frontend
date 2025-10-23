

import axios from 'axios';
const BaseURL = process.env.REACT_APP_API_BASE_URL;

class BulkUploadService {

    BulkPost (excelData) {
        const url = `${BaseURL}/api/bulkupload`
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        };


        return axios.post(url, excelData, config); // No need for custom headers
    }

}

export default new BulkUploadService ();