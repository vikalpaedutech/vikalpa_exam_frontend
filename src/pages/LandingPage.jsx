//For 'Other Schools' where there are school code present in a collections of students registration, those schools will be counted in 'other schols'. According to my logic.

import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import StudentSignIn from "../components/StudentSignIn";
import { Nav, Col, Row, Container } from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";


import { District_block_dependentDropdownMultiSelect, 
  District_block_school_dependentDropdown, 
  District_school_dependentDropdown,
District_block_dependentDropdown,
Block_school_dependentDropdown, District_dropdown,
District_block_school_manual_school_name_dependentDropdown } from "../components/DependentDropDowns/District_block_school_dropdowns";
import { ClassOfStduentDropDowns } from "../components/DependentDropDowns/Student_Class_Related_dropdowns";
import { FileUpload } from "../components/utils/fileUploadUtils";
import { DateUtils } from "../components/utils/DateUtils";
import { UserContext } from "../components/NewContextApis/UserContext";
import { StudentContext } from "../components/NewContextApis/StudentContextApi";
import { Admitcardcomponent } from "../components/StudentRegistration/Admitcardcomponent";


export default function LandingPage() {

//context apis import

const {userData, setUserData} = useContext(UserContext);

const {studentData, setStudentData} = useContext(StudentContext);

//------------------------------------------------------------

  const [ShowStudentSignIn, setShowStudentSignIn] = useState(false);

  const handleClickforStudentSignin = () => {
    // setShowStudentSignIn(true);
    // 
  };




  return (
    <div>
  
{/* 
    <DateUtils/>

    <District_block_school_manual_school_name_dependentDropdown/>

    <FileUpload/> */}
      <br></br>
      {/* <Nav defaultActiveKey="/userprofile" as="ul">
        <Nav.Item as="li">
          <Nav.Link href="/user-signup">Officials/Stsdlfnaff Signup</Nav.Link>
        </Nav.Item>

        
        <hr/>
      </Nav> */}
      <Container fluid>
        <Row className="justify-content-right "></Row>

        <Container >
          <Row>
            <Col className="text-center">

            {/* below links are for mission bniyaad */}

            {/* <Link  to="/student-signin" style={{textDecoration:'none', fontSize:'25px', color:'red', fontWeight:'bold'}}>
            <p><BsArrowRight className="blinking-link" />Downlaod Mission Buniyaad Admit Card Class 8th<br/>(मिशन बुनियाद परीक्षा (लेवल 1) का प्रवेश पत्र डाउनलोड करने के लिए यहां क्लिक करें।)</p> 
            </Link>
            <br /> */}

            {/* <Link  to="/student-signin" style={{textDecoration:'none', fontSize:'25px', color:'red', fontWeight:'bold'}}>
            <p><BsArrowRight className="blinking-link" />Click here for Mission Buniyaad Entrance Examination Level-1 Result.<br/>(मिशन बुनियाद प्रवेश परीक्षा लेवल 1 परिणाम के लिए यहां क्लिक करें।)</p> 
            </Link>
            <br /> */}
            

            {/* Commenting below link for deactivating */}
            <Link  to="/exam-student-signin-mb" style={{textDecoration:'none', fontSize:'25px'}}>
            <p><BsArrowRight className="blinking-link" />Class 8th Registration -  Mission Buniyaad Level-1. <br/>(कक्षा 8वीं पंजीकरण - मिशन बुनियाद स्तर-1।)</p> 
            </Link>
            <br />



              <Link  to="/exam-student-signin-sh" style={{textDecoration:'none', fontSize:'25px'}}>
            <p><BsArrowRight className="blinking-link" />Class 10th Registration - Haryana Super 100 Level-1 <br/>(
                 कक्षा 10वीं पंजीकरण - हरियाणा सुपर 100 स्तर-1।)</p> 
            </Link>
            <br />

             {/* <Link  to="" style={{textDecoration:'none', fontSize:'25px', color:'red', fontWeight:'bold'}}>
            <p><BsArrowRight className="blinking-link" />Mission Buniyaad Entrance Examination Level-2 Result Coming Soon.<br/>(मिशन बुनियाद प्रवेश परीक्षा लेवल-2 परिणाम जल्द आ रहा है।)</p> 
            </Link>
            <br /> */}

            {/* <Link  to="/student-signin" style={{textDecoration:'none', fontSize:'25px', color:'red', fontWeight:'bold'}}>
            <p><BsArrowRight className="blinking-link" />Click here for Mission Buniyaad Entrance Examination Level-3 Result.<br/>(मिशन बुनियाद प्रवेश परीक्षा लेवल 3 परिणाम के लिए यहां क्लिक करें।)</p> 
            </Link>
            <hr></hr>
            <br /> */}

            {/* <Link  to="/student-signin-s100 " style={{textDecoration:'none', fontSize:'25px', color:'red', fontWeight:'bold'}}>
            <p><BsArrowRight className="blinking-link" />Click here for Haryana Super 100 Entrance Examination Level-2 Admit Card.<br/>(हरियाणा सुपर 100 प्रवेश परीक्षा लेवल 2 प्रवेश पत्र के लिए यहां क्लिक करें।)</p> 
            </Link>
            <hr></hr>
            <br /> */}

{/* 
            <Link  to="/student-signin" style={{textDecoration:'none', fontSize:'25px', color:'red', fontWeight:'bold'}}>
            <p><BsArrowRight className="blinking-link" />Click here for Mission Buniyaad Entrance Examination Level-2 Result.<br/>(मिशन बुनियाद प्रवेश परीक्षा लेवल 2 परिणाम के लिए यहां क्लिक करें।)</p> 
            </Link>
            <br />
 */}




              {/* below links are for super 100 registraion, admitcard, and result */}




                {/* HARYANA SUPER 100 ADMIT CARD */}

                {/* <Link  to="/student-signin-s100" style={{textDecoration:'none', fontSize:'25px', color:'red', fontWeight:'bold'}}>
            <p><BsArrowRight className="blinking-link" />Downlaod Haryana Super 100 Level-1 Admit Card Class 10th<br/>(हरियाणा सुपर 100 परीक्षा (लेवल 1) का प्रवेश पत्र डाउनलोड करने के लिए यहां क्लिक करें।)</p> 
            </Link> */}
            <br />


            {/* <Link  to="/student-signin-s100" style={{textDecoration:'none', fontSize:'25px', color:'red', fontWeight:'bold'}}>
            <p><BsArrowRight className="blinking-link" />Click here for Haryana Super 100 Entrance Examination Level-2 Result. <br/> (हरियाणा सुपर 100 प्रवेश परीक्षा लेवल-2 परिणाम के लिए यहां क्लिक करें।)</p> 
            </Link>
            <br /> */}



           
{/*             
            <Link to="/srn-100" style={{textDecoration:'none', fontSize:'25px'}}>
            <p><BsArrowRight className="blinking-link" /> Haryana Super 100 Registration Class 10th <br/> (हरियाणा सुपर 100 परीक्षा के लिए, कक्षा 10 के विद्यार्थी यहाँ क्लिक करें)</p>
            </Link>
            <br /> */}
            
          {/* BELOW LINKS ARE FOR ABRC/SCHOOL/CC LOGIN */}

            <Link to="/exam-user-signin" style={{textDecoration:'none', fontSize:'25px'}}>
           <p><BsArrowRight className="blinking-link" />Officials Login -
           <spapn>(Bulk Registrations)</spapn><br></br>
           <spapn>SCHOOL/ABRC/BRP</spapn>
           </p>
            </Link>


{/*             
            <Link to="/exam-user-signin" style={{textDecoration:'none', fontSize:'25px'}}>
           <p><BsArrowRight className="blinking-link" />Click here to login</p>
            </Link> */}

            <br />


            
           
            {/* //Below Student Login is just for testing purpose right now. I will place it at it's right place in future. */}
            </Col>
          </Row>
        </Container>
      </Container>
      <br />
      <br />
   
      {ShowStudentSignIn ? (
        <div>
          <StudentSignIn />
        </div>
      ) : null}

    </div>
  );
}
