import React, { useState, useEffect, useContext } from "react";
import RegistrationFormService from "../services/RegistrationFormService";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import DependentDropComponent from "./DependentDropComponent";
import { UserContext } from "./ContextApi/UserContextAPI/UserContext";
import AcknowledgementSlip from "./AcknowledgementSlip";
import "../index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StudentContext } from "./ContextApi/StudentContextAPI/StudentContext";
import registrationServiceInstance from "../services/RegistrationFormService";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

//React boottrap css-------------------
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  CardFooter,
  Nav,
} from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";
import StudentNavbar from "./StudentNavbar";
//_____________________________

//-----------------------------------W

export default function Manualentry() {
  const { user } = useContext(UserContext);
  const { setStudent } = useContext(StudentContext); // it updates, on the basis of SlipData

  const navigate = useNavigate();
  const location = useLocation();

  //this below code dynamically updates the isRegisteredBy schema in the db on the basis of url.

  let isRegisteredBy = "manualEntry";

  //Dynamically sets the header in the form
  let FormHeader1;
  let FormHeader2;
  let FormHeader3;
  if (location.pathname === "/Manualentry") {
    FormHeader1 = "Registration Form";
    FormHeader2 = "Mission Buniyaad and Super 100";
    FormHeader3 = "Batch 2025-27";
  } else if (location.pathname === "/Manualentry") {
    FormHeader1 = "Registration Form";
    FormHeader2 = "Haryana Super 100";
    FormHeader3 = "Batch 2025-27";
  }
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //---------------------------------------------------------------------------------------------------
  const [userObj, setUserObj] = useState(null);
  const [srn, setSrn] = useState("");
  const [name, setName] = useState("");
  const [father, setFather] = useState("");
  const [mother, setMother] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
//   const [aadhar, setAadhar] = useState("");

  const aadhar = "manualEntry"
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  //below hooks added new on 7th of November and for house address
  const [houseNumber, setHouseNumber] = useState("");
  const [cityTownVillage, setCityTownVillage] = useState("");
  const [addressBlock, setAddressBlock] = useState("");
  const [addressDistrict, setAddressDistrict] = useState("");
  const [addressState, setAddressState] = useState("");

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [school, setSchool] = useState("");
  // const [grade, setGrade] = useState('');

  //Added on 7 nov
  const [
    previousClassAnnualExamPercentage,
    setPreviousClassAnnualExamPercentage,
  ] = useState("");

  //^^^^^^^^^^^^^^^^^^^^^
  const [image, setImage] = useState(""); // For file uploads
  // const [isRegisteredBy] = useState('Self')
  const [message, setMessage] = useState("");
  const [manualSchool, setshowManualSchool] = useState(false);
  //School code from manual entry
  const [schoolCode, setSchoolCode] = useState("");

  //For managing AcknowledgementSlip
  const [showAck, setShowAck] = useState(false);
  //For managing the data of student on slip
  const [slipData, setSlipData] = useState({});

  const [errors, setErrors] = useState("");
  const [grade, setGrade] = useState("");

  // if (user) {
  //   isRegisteredBy = user.mobile;
  // } else {
  //   isRegisteredBy = "Self";
  // }

  //Acknowledgement id generation logic below.

  //Logic goes: slicing three digits of name and slicing last 5 digits of srn and then combining it to create SlipID

  let slicedName = name.slice(0, 3);
  let slicedSrn = srn.slice(5);

  let slipId = (slicedName + slicedSrn).toUpperCase();

  console.log(slipId);
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  useEffect(() => {
    setUserObj(user);
  }, [user]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("srn", srn);
      formData.append("name", name);
      formData.append("father", father);
      formData.append("mother", mother);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("category", category);
      formData.append("aadhar", aadhar);
      formData.append("mobile", mobile);
      formData.append("whatsapp", whatsapp);
      //new on 7th nov
      formData.append("houseNumber", houseNumber);
      formData.append("cityTownVillage", cityTownVillage);
      formData.append("addressBlock", addressBlock);
      formData.append("addressDistrict", addressDistrict);
      formData.append("addressState", addressState);

      //^^^^^^^^^^^^

      //   formData.append("address", address);
      formData.append("district", district);
      formData.append("block", block);
      formData.append("school", school);
      formData.append(
        "previousClassAnnualExamPercentage",
        previousClassAnnualExamPercentage
      );
      formData.append("grade", grade);
      formData.append("image", image);
      formData.append("isRegisteredBy", isRegisteredBy);
      formData.append("schoolCode", schoolCode);
      formData.append("slipId", slipId);

      // console.log(slipId);

      //Below piece of code converts the formData into JSON Object to show it in a Slip
      const SlipData = {};
      formData.forEach((value, key) => {
        SlipData[key] = value;
      });

      // console.log(SlipData);
      setSlipData(SlipData);
      setStudent(SlipData);
      console.log(slipData); //It will not directly log the data but, yes it will store the data in slipData hook(It is something related to useEffect hook)
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

      const response = await RegistrationFormService.RegistrationCreate(
        formData
      );
     

      

      // console.log('below is the response.data.success')
      // console.log(response.data.data);
      // console.log(slipData);

      if (response.data.success === true) {
        setDistrict("");
        setBlock("");
        setSchool("");
       
        alert('Entry done')
        navigate('/manualentryinputsrn')

        // Below reloads the page
        //window.location.assign("/Manualentry");
     
         //after successfull updation of data it routes back to the inputsrn page
      } else {
        setMessage("Post not created");
        alert("Entry Not Done: Either Dupllicate or Already Registered ");
      }
      setImage("");
      setDistrict("");
      setBlock("");
      setSchool("");

    

      e.target.reset();
    } catch (error) {
      console.log("Some error occured");
      
    }
  };

  return (
    <div>
     
      <hr></hr>

      <Nav defaultActiveKey="/userprofile" as="ul">
        <Nav.Item as="li">
          <Nav.Link href="/manualentryinputsrn">Home</Nav.Link>
        </Nav.Item>
     
      </Nav>
      <Container>
        <hr></hr>

        <Form onSubmit={handleSubmit}>
          <Row className="border mb-3 rounded-2">
            <Col xs={12}>
              <Form.Group className="mb-3" controlId="srnInput">
                <Form.Label>SRN (एस.आर.एन.) :</Form.Label>
                <Form.Control
                  type="text"
                  name="srn"
                  placeholder="SRN (एस.आर.एन.)"
                  maxLength={10}
                  onChange={(e) => setSrn(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="border mb-3 rounded-2">
            <Col xs={12} md={6} className="border-end p-3">
              <h2>Personal Details (व्यक्तिगत विवरण) :</h2>
              <hr></hr>
              <Form.Group className="mb-3" controlId="nameInput">
                <Form.Label>Student Name (विद्यार्थी का नाम) :</Form.Label>
                <p style={{ fontSize: "12px" }}>
                  (स्कूल में पंजीकृत नाम दर्ज करें)
                </p>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Student Name (विद्यार्थी का नाम)"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="fatherInput">
                <Form.Label>Father's Name (पिता का नाम) :</Form.Label>
                <p style={{ fontSize: "12px" }}>(Mr/श्री का प्रयोग न करें)</p>
                <Form.Control
                  type="text"
                  name="father"
                  placeholder="Father's Name (पिता का नाम)"
                  onChange={(e) => setFather(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="motherInput">
                <Form.Label>Mother's Name (माता का नाम) :</Form.Label>
                <p style={{ fontSize: "12px" }}>
                  (Mrs/श्रीमती का प्रयोग न करें)
                </p>
                <Form.Control
                  type="text"
                  name="mother"
                  placeholder="Mother's Name (माता का नाम)"
                  onChange={(e) => setMother(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="gradeSelect">
                <Form.Label>Class (कक्षा) :</Form.Label>
                <Form.Select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                >
                  <option value="">Select Class</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="dobInput">
                <Form.Label>D.O.B (जन्म तिथि) :</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  onChange={(e) => setDob(e.target.value)}
                  max="2020-12-31"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="genderSelect">
                <Form.Label>Gender (लिंग) :</Form.Label>
                <Form.Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Your Gender: Male/Female</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="categorySelect">
                <Form.Label>Category (वर्ग) :</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Your Category</option>
                  <option value="BCA">BCA</option>
                  <option value="BCB">BCB</option>
                  <option value="GEN">GEN</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </Form.Select>
              </Form.Group>

              {/* <Form.Group className="mb-3" controlId="aadharInput">
                <Form.Label>Aadhar Number (आधार नंबर) :</Form.Label>
                <Form.Control
                  type="text"
                  name="aadhar"
                  placeholder="Aadhar Number (आधार नंबर)"
                  maxLength={12}
                  onChange={(e) => setAadhar(e.target.value)}
                />
              </Form.Group> */}
            </Col>

            {/* Second Column inside the Second Row */}
            <Col className="border-end p-3">
              <h2>Contact Details (संपर्क विवरण) :</h2>
              <hr></hr>
              <Form.Group className="mb-3" controlId="mobileInput">
                <Form.Label>Mobile Number (मोबाइल नंबर) :</Form.Label>

                <Form.Control
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number (मोबाइल नंबर)"
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="whatsappInput">
                <Form.Label>Whatsapp Number (व्हाट्सएप नंबर) :</Form.Label>
                <p style={{ fontSize: "12px" }}>
                  (केवल अपने माता या पिता का मोबाइल नंबर भरें)
                </p>
                <Form.Control
                  type="text"
                  name="whatsapp"
                  placeholder="Whatsapp Number (व्हाट्सएप नंबर)"
                  onChange={(e) => setWhatsapp(e.target.value)}
                  maxLength={10}
                  required
                />
              </Form.Group>

              {/* BELOW FIELDS ADDED ON 7TH NOV AND ARE NEW */}
              <Form.Group className="mb-3" controlId="addressInput">
                <Form.Label>H. No. (मकान नंबर) :</Form.Label>
                <p style={{ fontSize: "12px" }}>Optional. (वैकल्पिक)</p>
                <Form.Control
                  type="text"
                  name="houseNumber"
                  placeholder="H. No. (मकान नंबर)"
                  onChange={(e) => setHouseNumber(e.target.value)}
                  
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="addressInput">
                <Form.Label>City/Town/Village (शहर/कस्बा/गाँव) :</Form.Label>
                <Form.Control
                  type="text"
                  name="cityTownVillage"
                  placeholder="City/Town/Village (शहर/कस्बा/गाँव)"
                  onChange={(e) => setCityTownVillage(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="addressInput">
                <Form.Label>Block (ब्लॉक) :</Form.Label>
                <Form.Control
                  type="text"
                  name="addressBlock"
                  placeholder="Block (ब्लॉक)"
                  onChange={(e) => setAddressBlock(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="addressInput">
                <Form.Label>District (ज़िला) :</Form.Label>
                <Form.Control
                  type="text"
                  name="addressDistrict"
                  placeholder="District (ज़िला)"
                  onChange={(e) => setAddressDistrict(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="addressInput">
                <Form.Label>State (राज्य) :</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="State (राज्य)"
                  onChange={(e) => setAddressState(e.target.value)}
                  required
                />
              </Form.Group>

              {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}

              {/* Nested Row inside a second column of the second Row    */}

              <h2>Academic Details (शैक्षिक विवरण) :</h2>
              <hr></hr>
              <DependentDropComponent
                district={district}
                block={block}
                school={school}
                setDistrict={setDistrict}
                setBlock={setBlock}
                setSchool={setSchool}
                setshowManualSchool={setshowManualSchool}
                setSchoolCode={setSchoolCode}
              />

              <Form.Group className="mb-3" controlId="addressInput">
                <Form.Label>
                  {location.pathname === "/Registration-form/MB" ||
                  location.pathname === "/Registration-form/put/MB"
                    ? "Class 7th Annual Examination Per% (कक्षा 7वीं की वार्षिक परीक्षा का प्रतिशत)"
                    : "Class th Annual Examination Per% (कक्षा 9वीं की वार्षिक परीक्षा का प्रतिशत.)"}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="previousClassAnnualExamPercentage"
                  placeholder="Enter Percentage"
                  maxLength={2}
                  onChange={(e) =>
                    setPreviousClassAnnualExamPercentage(e.target.value)
                  }
                  
                />
              </Form.Group>

              {/* ^^^^^Nested Row inside a second column of the second Row ^^^^*/}
            </Col>
            {/*^^^ Second Column inside the Second Row^^^*/}
          </Row>

          <Row className="border mb-3 rounded-2">
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="photoInput">
                <Form.Label>
                  Upload Your Passport Size Photo (अपनी पासपोर्ट साइज फोटो अपलोड
                  करें) :
                </Form.Label>
                <p style={{ fontSize: "12px" }}>
                  Note: You can register without a passport photo, but please
                  upload it within 2 to 3 days. <br />
                  नोट: आप बिना पासपोर्ट फोटो के भी रजिस्टर कर सकते हैं, लेकिन
                  कृपया 48 घंटे के भीतर इसे अपलोड कर दें।
                </p>

                <Form.Control
                  type="file"
                  name="image"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Form.Group>
            </Col>
            <p>
              Note / नोट: Submitting incorrect details may lead to form
              rejection. (गलत जानकारी देने पर फॉर्म अस्वीकार हो सकता है।)
            </p>
          </Row>
          <Row>
            <Button type="submit">Register</Button>
          </Row>
        </Form>

        <p>{message}</p>
        {/* {manualSchool ? <div>Data found</div> : <p>Not found data</p>} */}

        {/* {showAck ? (
        <AcknowledgementSlip showAck={showAck} slipData={slipData} />
      ) : null} */}
      </Container>
      <Footer />
    </div>
  );
}
