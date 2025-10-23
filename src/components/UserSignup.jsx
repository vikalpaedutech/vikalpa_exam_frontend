import React, { useState } from "react";
import UserService from "../services/UserService";

import { Navigate, useNavigate } from "react-router-dom";
import DependentDropComponent from "./DependentDropComponent";
import { Container, Row, Col, Form, Button, Nav } from "react-bootstrap";
import Navbar from "./Navbar";
//importing TwilioService for verification of numbers;

import TwilioService, { sendNotification } from "../services/TwilioService";
import Footer from "./Footer";
import DependentDropABRC from "./DependentDropABRC";


export default function UserSignUp() {
  let otp = ["858515", "774569", "997415", "476541", "116684"]

  
  
  const sentOtp = otp[Math.floor(0 + Math.random() * 4)]


  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [designation, setDesignation] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [school, setSchool] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [password, setPassword] = useState("");
  const [SuccessMessage, setSuccessMessage] = useState("");
  //dynamically showing otp input box:
  const [VerifyOtp, setVerifyOtp] = useState(false);
  //Below hook for showing or not shoiwng verify button:
  const [showVerifyButton, setShowVerifyButton] = useState(true)
  //below hook for users typed otp
  const [inputOtp, setInputOtp] = useState("");
  //below hook for sending message to user as otp
  const message = `Your OTP: ${sentOtp} for Pratibha Khoj Account Creation.`;


  const handleSubmit = async (e) => {
    e.preventDefault();

    //Generating Otp and sending to user for verification then show create password field

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    // Validation check (add your own validation logic)
    // if (
    //   !userName ||
    //   !designation ||
    //   !mobile || 
    //   !district ||
    //   !block ||
    //   !school ||
    //   !password
    // ) {
    //   setSuccessMessage("Please fill in all fields.");
    //   return;
    // }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("designation", designation);
    formData.append("mobile", mobile);
    formData.append("district", district);
    formData.append("block", block);
    formData.append("school", school);
    formData.append("schoolCode", schoolCode);
    formData.append("password", password);

    try {
      const response = await UserService.PostUser(formData);
      console.log(response);

      if (response.data.success) {
        setSuccessMessage("User Registered Successfully");
        alert("User Registered Successfully");
        navigate("/user-signin");

        setUserName("");
        setDesignation("");
        setMobile("");
        setDistrict("");
        setBlock("");
        setSchool("");
        setPassword("");
      } else {
        setSuccessMessage("User not registered");
        
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setSuccessMessage("This Number is already registered.");
      alert('User Already Registerd')

    }

    // Clear form fields

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);

    // e.target.reset();
  };

  //below function verifies the user number sending the 6 digit otp on their phones;

  async function verifyByTwilio(e) {
    e.preventDefault();

    

    try {
      const userExistInDb = await UserService.GetUser(mobile)

      if(userExistInDb){
        alert('User Already Registerd. Please Login or Contact on Helpline Numbers regarding any issue.')
        navigate('/user-signin')
        return;
      }

    } catch (error) {
      console.log('User already exist in db')
    }








    try {
      // const response = await sendNotification(mobile, message);
      // alert(`Message sent: ${response.success ? "success" : "Failed"}`);
      alert(`Your otp is: ${sentOtp}`)
      setVerifyOtp(true)
      setShowVerifyButton(false)
    } catch (error) {
      alert("Please Enter a Valid Number");
    }
  }
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //Below api uses Gooadvert api to send otp.
  const [otpStatus, setOtpStatus] = useState("");

  const handleGooadvertOtp = async () => {
    setVerifyOtp(true);
    const phoneNumber = "918191839118";
    const otpUrl = `http://sms.gooadvert.com/vendorsms/pushsms.aspx?APIKey=PupWft0zck6Q9nAYjvHCAg&msisdn=${phoneNumber}&sid=IHMBGA&msg=Dear User your OTP For Verification Is 278291.This Will Expire In 5 Min. Please Do Not Share your OTP With Anyone Regards BGroop.&fl=0&gwid=2`;

    try {
      const response = await fetch(otpUrl, {
        method: "GET",
        mode: "no-cors",
      });
      if (response.ok) {
        setOtpStatus("OTP sent successfully!");
        
      } else {
        setOtpStatus("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpStatus("An error occurred. Please try again.");
    }
  };

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  return (
    <>
      <Navbar />
      <Nav defaultActiveKey="/userprofile" as="ul">
        <Nav.Item as="li">
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link href="/user-signin">Already Registred (Sign-in)</Nav.Link>
        </Nav.Item>
      </Nav>

      <Container style={{ width: "60%" }}>
        <Form onSubmit={handleSubmit}>
          <Row className="border mb-3 rounded-2">
            <h1 style={{ textAlign: "center" }}>
              OFFICIALS SIGN-UP (अधिकारिक पंजीकरण)
            </h1>
            <small style={{ textAlign: "center" }}>
              Only for Govt. officials, ABRC/BRP/Teachers/School Staff/Vikalpa
              Staff.
              <br />
              (केवल सरकारी अधिकारी, ABRC/BRP/शिक्षक/स्कूल स्टाफ/Vikalpa स्टाफ के
              लिए)
            </small>
          </Row>
          <Row className="border mb-3 rounded-2">
            <Col>
              <Form.Group className="mb-3" controlId="userNameInput">
                <Form.Label>Name (नाम) :</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter Your Name"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Designation (पद) : </Form.Label>

                <Form.Select
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Teacher">Teacher (शिक्षक)</option>
                  <option value="Principal">Principal (प्रधानाचार्य)</option>
                  <option value="ABRC">ABRC/BRP</option>
                  <option value="Coordinator">Co-ordinator (समन्वयक)</option>
                  <option value="VikalpaStaff">Other Officials (अन्य अधिकारी)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {designation === "Teacher" || designation === "Principal" ? (
              <DependentDropComponent
                setDistrict={setDistrict}
                setBlock={setBlock}
                setSchool={setSchool}
                setSchoolCode={setSchoolCode}
              />
            ) : designation === "ABRC" ||
              designation === "Coordinator" ||
              designation === "VikalpaStaff" ? (
              <DependentDropABRC
                setDistrict={setDistrict}
                setBlock={setBlock}
              />
            ) : null}

            <Form.Group>
              <Form.Label>
                Mobile Number (अपना मोबाइल नंबर दर्ज करें) :
              </Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter Mobile Number"
                maxLength={10}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </Form.Group>
            <br/><br/>
            <Row>
              
            </Row>
            {VerifyOtp ? (
              <Form.Group>
                <Form.Label>
                  Enter OTP sent on your mobile (अपना OTP दर्ज करें) :
                </Form.Label>

                <Form.Control
                  type="tel"
                  placeholder="OTP"
                  maxLength={6}
                  onChange={(e) => setInputOtp(e.target.value)}
                  required
                />
                {otp.includes(inputOtp) ? (<>Otp Verified</>) : (
                  <small></small>
                )}
              </Form.Group>
            ) : null}

            <Col>


            {otp.includes(inputOtp) ? (

<Form.Group>
<Form.Label>
  Create Password (कृपया अपना पासवर्ड बनाएं) :
</Form.Label>
<p style={{fontSize:'18px'}}>Password should have only 6 digits. (पासवर्ड केवल 6 अंकों का होना चाहिए।)</p>

<Form.Control
  type="password"
  placeholder="Create Password"
  maxLength={6}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
{/* <small>Otp Matched</small> */}
</Form.Group>


            ): (<p>Enter valid otp</p>)}
              

              {SuccessMessage && <p>{SuccessMessage}</p>}
            </Col>
          </Row>
          <Row className="border mb-3 rounded-2">
            {showVerifyButton === false ? (<Button type="submit" style={{ width: "100%" }}>
              Submit
            </Button>):(null)}
          </Row>
          <Row>{showVerifyButton? (<Button  onClick={verifyByTwilio}>Verify Mobile Number</Button>):(null)}</Row>
          <br/>
        </Form>
        
      {/* <button onClick={handleGooadvertOtp}> Verify OTP By goadvert</button> */}
      
      </Container>
      
      <Footer />
    </>
  );
}
