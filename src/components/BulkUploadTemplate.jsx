//This api downloads the template for BulkUpload functionality.
// User will get the prefilled district, block, school in this bulk upload functionality.

import React from 'react';  
import { Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';

//accepting th props as district, block , school coming from BulkUploadWithDistBC component

export default function BulkUploadTemplate ({district, block, school, grade, manualSchoolNameIsChecked, schoolCode}) {
    
    const TemplateData = [];

// Below loop creates a number of rows in which we need the disrict, block, school to be printed.


const DownloadTemplate =()=>{

for (let i = 0; i<1; i++){
    TemplateData.push ({
                srn: '0000000000', // Empty field for user input
                name: 'Dummy Name',
                father: 'Dummy Father',
                mother: 'Dummy Mother',
                dob: 'dd-mm-yyyy',
                gender: 'Male/Female',
                category: 'BCA/BCB/GEN/SC/ST',
                aadhar: '123456789012',
                mobile: '1234567890',
                whatsapp: '1234567890',
                // address: '',
                //below added on 7 nov
                houseNumber: 'A10',
                cityTownVillage: 'Gurugram',
                addressBlock: 'Gurgaon',
                addressDistrict: 'Gurgaon',
                addressState: 'Haryana',

                //^^^^^^^^^^^^^^^^^^^^^
                district: district || '', // Prefilled district names
                block: block || '', // Prefilled block names
                school: school || '', // Prefilled school names
                schoolCode: schoolCode, // Empty field for school code
                grade: grade,
                previousClassAnnualExamPercentage: ''

    })
}

console.log(manualSchoolNameIsChecked)
const worksheet = XLSX.utils.json_to_sheet(TemplateData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
XLSX.writeFile(workbook, 'Student_Template.xlsx')

}

    return(
        <>
        <h3>* कृपया bulk_uploading के लिए निम्नलिखित निर्देशों का पालन करें:</h3>
        <hr/>
        <p>1. dob कॉलम में DD-MM-YYYY फार्मेट का उपयोग करें (जैसे 28-07-2011)| यह भी सुनिश्चित करें कि सेल फार्मेट दिनांक पर सेट है। </p>
        <p>2. District, Block, School Name, और Grade को केवल टेम्पलेट से कॉपी-पेस्ट करें।</p>
        <p>3. Previous Class Exam Percentage" कॉलम में केवल छात्र का प्रतिशत दर्ज करें।</p>
        <p>4. कोई भी कॉलम खाली न छोड़ें।</p>
    <div>
        <Button onClick={DownloadTemplate}>DownloadTemp</Button>
    </div>
    </>
    );
}