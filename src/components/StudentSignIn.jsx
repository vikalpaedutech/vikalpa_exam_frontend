//This component is the same as input srn but with a little bit of change. in future update i will try to use a single component with
// dynamic changes. so that for the student login and student input srn functionlaity we can use same component.

import React, { useEffect, useState, useContext } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import registrationServiceInstance from "../services/RegistrationFormService";
import { StudentContext } from "./ContextApi/StudentContextAPI/StudentContext";
import { Nav, Col, Row, Container, Form } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";


function StudentSignIn({}) {
  //destructuring the StudentContext api to get setStudent state from StudentContext API.
  const { setStudent } = useContext(StudentContext);
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //User useLocation to dynamically change the text content of student-sign in box(according to super 100 and mb)
  const location = useLocation()
  
  //dynamically changes the text content on the based on student grade(class 8, class 10th)
  let studentSignInBoxSubHeader;

  if (location.pathname === "/student-signin") {
    studentSignInBoxSubHeader = `Mission Buniyaad Entrance Examination Level-3 Result.
(मिशन बुनियाद प्रवेश परीक्षा लेवल-3 परिणाम।)
    `
} else if (location.pathname === "/student-signin-s100" ){
  studentSignInBoxSubHeader = `Haryana Super 100 Entrance Examination Level-2 Result.
(हरियाणा सुपर 100 प्रवेश परीक्षा स्तर-2 परिणाम।)
    `
}






  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const [inputSrn, setInputSrn] = useState(null);
  const [slipId, setSlipId] = useState(null);
  const [id, setId] = useState(""); //Gets the student Id for updation in students' data

  //   const [srn, setSrn] = useState('');
  //it checks the input srn value and matches with db using if and else condition. if value matches
  //... then renders Prefilled form other wise blank form.

  const [error, setError] = useState(null);
  const [isSrnMatched, setIsSrnMatched] = useState(false);
  const [errorRedirect, setErrorRedirect] = useState(false);
  const [RegisterFrist, setRegisterFrist] = useState(false);

  //After storing the data in setStudent ContextAPI we are updating student context
  const { student } = useContext(StudentContext);
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const handleSubmit = async function (e) {
    e.preventDefault();

    const newSrn = inputSrn;
    //    console.log(newSrn);

    try {
      const response = await registrationServiceInstance.getPostsBySrn(newSrn);
      

      const SrnSlipId = response.data.srn || inputSrn;

      if (
        response.data.data.srn === SrnSlipId &&
        response.data.data.isVerified != "" && response.data.data.grade === "8" && response.data.data.finalShortListOrWaitListStudents !== "" || response.data.data.grade === "10" && response.data.data.isQualifiedL2 === true
      ) {

         if(response.data.data.grade === "10"){
        alert('Invalid Srn')
        return;
    } 

        setIsSrnMatched(true);
        setId(response.data.data._id);
        setStudent(response.data.data);
        sessionStorage.setItem("user", JSON.stringify(response.data.data)); // Store user data in localStorage

        console.log(student);
      } else {
        setErrorRedirect(true);
        setIsSrnMatched(false);
        //alert('Your SRN is not registered on the examination portal. Please verify your SRN and try again. (आपका SRN परीक्षा पोर्टल पर पंजीकृत नहीं है। कृपया अपना SRN सत्यापित करें और पुनः प्रयास करें।)')
        alert('Invalid')
      }
    } catch (error) {
      console.error(error);
      setError("Correct SRN needed"); // Set error state for exceptions
      setErrorRedirect(true); // It gives the message if error arrives then says register first.
      setRegisterFrist(true);
      //alert('Your SRN is not registered on the examination portal. Please verify your SRN and try again. (आपका SRN परीक्षा पोर्टल पर पंजीकृत नहीं है। कृपया अपना SRN सत्यापित करें और पुनः प्रयास करें।)')
      alert("Invalid")
    }
  };

  if (isSrnMatched == true) {
   
      return <Navigate to="/Student-dash" state={{ srn: inputSrn, id: id }} />;
   
    
  } 

  return (
    <>
      <Container fluid>
        <Row>
          <Navbar />
          <div>
          <br/>
          </div>

          <Row
            style={{
              display: "flex",
              alignItems: "center", // Center vertically
              justifyContent: "center", // Center horizontally
              height: "65vh", // Full viewport height
              textAlign: "center", // Center text
            }}
          >
            <form
              id="InputSrn"
              style={{
                display: "",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                width: "500px",
                height: "100%",
                border: "solid",
                borderRadius: "20px",
              }}
              onSubmit={handleSubmit}
            >
              <div>
                <h3>
                  Student-Login. (विद्यार्थी लॉगिन|)
                </h3>
                <h6 style={{color:'red'}}>{studentSignInBoxSubHeader}</h6>
                <hr/>
              </div>
              <label>SRN Number(अपना एस.आर.एन नंबर दर्ज करें।)</label>
              <br />
              <input
                type="text"
                name="srn"
                placeholder="अपना एस.आर.एन नंबर दर्ज करें|"
                onChange={(e) => setInputSrn(e.target.value)}
              />
              <br /><br />
              {/* <label>Slip ID (अपना स्लिप आईडी नंबर दर्ज करें।)</label>
              <br/>
              <input
                type="text"
                name="slipId"
                placeholder="अपना स्लिप आई.डी दर्ज करें।"
                onChange={(e) =>{ setSlipId(e.target.value)}}
              />
              <br/><br/> */}
              <button>Submit</button>

              <br />

              {errorRedirect ? (
                <div>
                  {/* <p>If You have not registered for Level 1 examination then click below:</p>
                  <p>
                    Click here to Register yourself:{" "}
                    <Link to={"/"}>Register For L1</Link>
                  </p> */}
                </div>
              ) : null}
            </form>
            {console.log(inputSrn)}
          </Row>
        </Row>
        <div>
          <br/>
        </div>
        
      </Container>

      <Footer />
    </>
  );
}

export default StudentSignIn;
