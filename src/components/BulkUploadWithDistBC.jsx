//BulkUploadWithDistBC stands for Bulk Upload With District, Block & School.
// This component will allow user to reigster students in bulk after selecting District, block and school.

import React, {useState} from 'react';

import DependentDropComponent from './DependentDropComponent';
import BulkUpload from './BulkUpload';
import BulkUploadTemplate from './BulkUploadTemplate';
import {Col, Row, Container} from 'react-bootstrap';
import UserNavBar from './UserNavBar';

//Below react-router-dom functions uses the routes for conditionally setting the student...
//... grade dynamically in the BulkUploadTemplate.jsx

import { useLocation } from 'react-router-dom';


export default function BulkUploadWithDistBC () {

    //Below logic will set the grade in templatee dynamically.
    const location = useLocation(); //location will be used to get current location
    let grade;

    if (location.pathname === '/userprofile/bulkregister-mb' ){
        
        grade = '8'

        
    } else if (location.pathname === '/userprofile/bulkregister-100') {
        grade = '10'
    }

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


    const [district, setDistrict] = useState('');
    const [block , setBlock] = useState('');
    const [school , setSchool] =  useState('');
    const [schoolCode, setSchoolCode]= useState('');

    //below hooks passes the manual school checked prop as true false here.

    const [manualSchoolNameIsChecked, setManualSchoolNameIsChecked] = useState(false)


    return (
        <div>
        <UserNavBar/>
       
        <Container>
            <Row className="border border-dark rounded p-3 my-3">
                <h4>Select Your District, Block, and School for Bulk Uploading Studetns:</h4>
                <hr/>
            <div>
                <DependentDropComponent
                setDistrict={setDistrict}
                setBlock={setBlock}
                setSchool={setSchool}
                setSchoolCode={setSchoolCode}
                setManualSchoolNameIsChecked = {setManualSchoolNameIsChecked}
                />
                <br/>
            </div>
            


{/* Below ternary operators checks for manualSchoolNameIsChecked state to be true which is coming form DependentDropDown.jsx
if it is true then without filling the school code user can't bulk upload, if it is not ture then user will have to chose 
values form drop down only which are district, block, school.  */}


{manualSchoolNameIsChecked ? (
    district && block && school && schoolCode ? (
      <>
        <Row>
        <BulkUploadTemplate
          district={district}
          block={block}
          school={school}
          grade={grade}
          manualSchoolNameIsChecked={manualSchoolNameIsChecked}
          schoolCode={schoolCode}
        />
        <br></br>
        <br></br>
        <BulkUpload />
        </Row>
      </>
    ) : null
  ) : (
    !manualSchoolNameIsChecked && district && block && school ? (
      <>
       <Row > 
       <BulkUploadTemplate
          district={district}
          block={block}
          school={school}
          grade={grade}
          manualSchoolNameIsChecked={manualSchoolNameIsChecked}
          schoolCode={schoolCode}
        />
        <br></br>
        <br></br>
        <BulkUpload />
        </Row>
      </>
    ) : null
  )}
  
  </Row>
  <small>How to bulk upload video goes here</small>
  </Container>
  </div>
)}