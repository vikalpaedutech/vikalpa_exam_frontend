//For 'Other Schools' where there are school code present in a collections of students registration, those schools will be counted in 'other schols'. According to my logic.

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import StudentSignIn from "../components/StudentSignIn";
import { Nav, Col, Row, Container } from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";


export default function LandingPage() {
  const [ShowStudentSignIn, setShowStudentSignIn] = useState(false);

  const handleClickforStudentSignin = () => {
    // setShowStudentSignIn(true);
    // 
  };
  return (
    <div>
      <Navbar /> 
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
            {/* <Link  to="/srn" style={{textDecoration:'none', fontSize:'25px'}}>
            <p><BsArrowRight className="blinking-link" />Mission Buniyaad Registration Class 8th <br/>(मिशन बुनियाद परीक्षा के लिए, कक्षा 8 के विद्यार्थी यहाँ क्लिक करें)</p> 
            </Link>
            <br /> */}


             {/* <Link  to="" style={{textDecoration:'none', fontSize:'25px', color:'red', fontWeight:'bold'}}>
            <p><BsArrowRight className="blinking-link" />Mission Buniyaad Entrance Examination Level-2 Result Coming Soon.<br/>(मिशन बुनियाद प्रवेश परीक्षा लेवल-2 परिणाम जल्द आ रहा है।)</p> 
            </Link>
            <br /> */}

            <Link  to="/student-signin" style={{textDecoration:'none', fontSize:'25px', color:'red', fontWeight:'bold'}}>
            <p><BsArrowRight className="blinking-link" />Click here for Mission Buniyaad Entrance Examination Level-3 Result.<br/>(मिशन बुनियाद प्रवेश परीक्षा लेवल 3 परिणाम के लिए यहां क्लिक करें।)</p> 
            </Link>
            <hr></hr>
            <br />

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

            <Link to="/user-signin" style={{textDecoration:'none', fontSize:'25px'}}>
           <p><BsArrowRight className="blinking-link" />SCHOOL/ABRC/BRP/Officials Login (स्कूल/ABRC/BRP/अन्य अधिकारी यहाँ क्लिक करे)</p>
            </Link>

            <br />


            
           
            {/* //Below Student Login is just for testing purpose right now. I will place it at it's right place in future. */}
            </Col>
          </Row>
        </Container>
      </Container>
      <br />
      <br />
      <Footer />
      {ShowStudentSignIn ? (
        <div>
          <StudentSignIn />
        </div>
      ) : null}

    </div>
  );
}
