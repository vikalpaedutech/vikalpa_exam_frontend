import React, { useState, useEffect, useContext } from "react";
import RegistrationFormService from "../services/RegistrationFormService";
// import InputSrn from "./InputSrn";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DependentDropComponent from "./DependentDropComponent";

import { StudentContext } from "./ContextApi/StudentContextAPI/StudentContext";
import { UserContext } from "./ContextApi/UserContextAPI/UserContext";
import { toast } from "react-toastify";
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

import AcknowledgementSlip from "./AcknowledgementSlip";
import StudentNavbar from "./StudentNavbar";

function PreFilledRegistrationForm() {
  let isRegisteredBy;

  const { user } = useContext(UserContext);
  // console.log('I am user name')
  // console.log(user.userName)


  //Below varibale is the useNavigate function of react. it is used when a condtion is true then it helps to navigate to the desired route.
  const navigate = useNavigate();
  //____________________________________________________________________

  //Below uses the useLocation state for passing the state values from other component to this component. it only happens when we come to this page immediately from previous page.
  //in this case we come to this page onl after srn value in the input box matches with the db. For the prefilled form functionlaity.
  //Well we are getting value of srn and id of that srn from inputsrn component.
  const location = useLocation();
  const srnFromInput = location.state?.srn || "";
  const idFormInput = location.state?.id || "";
  const srnFromAck = location.state?.srn || "";
  const idFromAck = location.state?.id || "";
  //______________________________________________________________

  //Dynamically sets the header in the form
  let FormHeader1;
  let FormHeader2;
  let FormHeader3;
  if (location.pathname === "/Registration-form/put/MB") {
    FormHeader1 = "Registration Form";
    FormHeader2 = "Mission Buniyaad";
    FormHeader3 = "Batch 2025-27";
  } else if (location.pathname === "/Registration-form/put/S100") {
    FormHeader1 = "Registration Form";
    FormHeader2 = "Haryana Super 100 Batch 2025-27";
    FormHeader3 = "Batch 2025-27";
  }
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //below useState hook is for setting StudentContext.js API...
  const { setStudent } = useContext(StudentContext);
  //__________________________________________________________

  //Below are the useState hook for if the user updates his values then these hooks helps to set the state and post the data to db.
  const [id, setId] = useState("");
  const [srn, setSrn] = useState("");
  const [name, setName] = useState("");
  const [father, setFather] = useState("");
  const [mother, setMother] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  // const [address, setAddress] = useState('');

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
  const [grade, setGrade] = useState("");

  //Added on 7 nov
  const [
    previousClassAnnualExamPercentage,
    setPreviousClassAnnualExamPercentage,
  ] = useState("");

  //^^^^^^^^^^^^^^^^^^^^^

  const [image, setImage] = useState(""); // For file uploads
  const [message, setMessage] = useState("");
  const [schoolCode, setSchoolCode] = useState("");

  if (user) {
    isRegisteredBy = user.mobile;
  } else {
    isRegisteredBy = "Self";
  }

  const [manualSchool, setshowManualSchool] = useState(false);

  const [slipData, setSlipData] = useState({});

  const [showAck, setShowAck] = useState(false);
  //_________________________________________________________________
  //On resubmission on form isVerified field sets to "Pending"
  const isVerified = "Pending"
  const verificationRemark = ""
  //------------------------------------


  //Below states will be used to lift the state and pass it to DependentDropDown component for prefilling of <select> object.

  //using StudentContex.js api...
  const { student } = useContext(StudentContext);
  //_______________________________________________

  //If verification status Filled then show the Ack first:
  //    setSrn(student.srn);

  //Acknowledgement id generation logic below.

  //Logic goes: slicing three digits of name and slicing last 5 digits of srn and then combining it to create SlipID

  let slicedName = name.slice(0, 3);
  let slicedSrn = srn.slice(5);

  let slipId = (slicedName + slicedSrn).toUpperCase();

  console.log(slipId);
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  // Below fetchPosts function is using the useLocation state to pass the 'srn' value in below fetchposts function.
  const fetchPosts = async (srn) => {
    if (!srn) return;

    try {
      const response = await RegistrationFormService.getPostsBySrn(srn); //here we get the object of only passed srn, in a getPostsBySrn method.
      const pull = response.data.data;
      setStudent(pull); //Here we are updating StudentContext State.
      sessionStorage.setItem("student", JSON.stringify(pull)); // Here we are storing student data (stored in pull const) in local storage.
      console.log(pull);

      // after successfully pulling the data from fetchPosts function. Now i am setting the states for prefilling the form value, it updates the useState above.
      setId(pull._id);
      setSrn(pull.srn);
      setName(pull.name);
      setFather(pull.father);
      setMother(pull.mother);
      setDob(pull.dob);
      setGender(pull.gender);
      setCategory(pull.category);
      setAadhar(pull.aadhar);
      setMobile(pull.mobile);
      setWhatsapp(pull.whatsapp);
      // setAddress(pull.address)
      //below added on 7 nov
      setHouseNumber(pull.houseNumber);
      setCityTownVillage(pull.cityTownVillage);
      setAddressBlock(pull.addressBlock);
      setAddressDistrict(pull.addressDistrict);
      setAddressState(pull.addressState);

      //^^^^^^^^^^^^

      setDistrict(pull.district);
      setBlock(pull.block);
      setSchool(pull.school);
      setGrade(pull.grade);
      setPreviousClassAnnualExamPercentage(
        pull.previousClassAnnualExamPercentage
      );
      setImage(pull.image);
      setSchoolCode(pull.setSchoolCode);
    } catch (error) {
      console.log("Error fetching Posts", error);
    }
  };

  //_______________________________________________________

  //Below useEffect only runs and fetchPosts when the srnFormInput chages.
  useEffect(() => {
    // Fetch data only if srnFromInput is available
    if (student.srn) {
      fetchPosts(student.srn);
    }
  }, [student.srn]); // Run effect when srnFromInput changes

  //Below logics puts the validation on the form.
  const [errSrn, setErrSrn] = useState(true);
  const [errName, setErrName] = useState(true);
  const [errFather, setErrFather] = useState(true);
  const [errMother, setErrMother] = useState(true);
  const [errDob, setErrDob] = useState(true);
  const [errGender, setErrGender] = useState(true);
  const [errCategory, setErrCategory] = useState(true);
  const [errAadhar, setErrAadhar] = useState(true);
  const [errMobile, setErrMobile] = useState(true);
  const [errWhatsapp, setErrWhatsapp] = useState(true);

  // const [errAddress, setErrAddress] = useState(true);
  //Below validatino for home address and added on 7 nov
  // const [errHouseNumber, setErrHouseNumber] = useState(true);
  const [errCityTownVillage, setErrCityTownVillage] = useState(true);
  const [errAddressBlock, setErrAddressBlock] = useState(true);
  const [errAddressDistrict, setErrAddressDistrict] = useState(true);
  const [errAddressState, setErrAddressState] = useState(true);

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const [errDistrict, setErrDistrict] = useState(true);
  const [errBlock, setErrBlock] = useState(true);
  const [errSchool, setErrSchool] = useState(true);

  //added on 7 nov
  const [
    errPreviousClassAnnualExamPercentage,
    setErrPreviousClassAnnualExamPercentage,
  ] = useState(true);

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //if all the validation passes then below state hook lets the send data;
  const [formValidated, setFormValidated] = useState(false);

  function formValidation() {
    if (srn.length === 10 && /[^\d]/.test(srn) == false) {
      setErrSrn(false);
    } else {
      setErrSrn(true);
      toast.error("Srn must contain only 10 digits");
    }

    if (/\d/.test(name) == false && name.length != 0) {
      setErrName(false);
    } else {
      setErrName(true);
      toast.error("Student Name must not contain any Number");
    }
    if (/\d/.test(father) == false && father.length != 0) {
      setErrFather(false);
    } else {
      setErrFather(true);
      toast.error("Father name must not contain any Number");
    }
    if (/\d/.test(mother) == false && mother.length != 0) {
      setErrMother(false);
    } else {
      setErrMother(true);
      toast.error("Mother name must not contain any Number");
    }

    //Below check is for dob.
    if (dob !== "") {
      setErrDob(false);
    } else {
      setErrDob(true);
      toast.error("Selct your D.O.B");
    }

    if (gender !== "") {
      setErrGender(false);
    } else {
      setErrGender(true);
      toast.error("Select Gender");
    }

    if (category !== "") {
      setErrCategory(false);
    } else {
      setErrCategory(true);
      toast.error("Select Category");
    }

    //checks if the srn has exact 12 digits and does not contain any apphabet.

    if (aadhar.length === 12 && /[^\d]/.test(aadhar) == false) {
      setErrAadhar(false);
    } else {
      setErrAadhar(true);
      toast.error(
        "Aadhar number should have 12 digits only and must not contain any alphabet"
      );
    }

    //below check for mobile validation
    if (mobile.length === 10 && /[^\d]/.test(mobile) == false) {
      setErrMobile(false);
    } else {
      setErrMobile(true);
      toast.error(
        "Mobile number should contain 10 digits only and must not contain any alphabet"
      );
    }

    //below check for whatsapp validation

    if (whatsapp.length === 10 && /[^\d]/.test(whatsapp) == false) {
      setErrWhatsapp(false);
    } else {
      setErrWhatsapp(true);
      toast.error(
        "Whatsapp number should contain 10 digits only and must not contain any alphabet"
      );
    }

    //below check for home address validation
    //new validation on 7 nov
    // if (houseNumber.length !== 0) {
    //   setErrHouseNumber(false);
    // } else {
    //   setErrHouseNumber(true);
    //   toast.error("Please fill your House Number");
    // }

    if (cityTownVillage.length !== 0) {
      setErrCityTownVillage(false);
    } else {
      setErrCityTownVillage(true);
      toast.error("Please fill your City/Town/Village");
    }

    if (addressBlock.length !== 0) {
      setErrAddressBlock(false);
    } else {
      setErrAddressBlock(true);
      toast.error("Please fill your Block");
    }

    if (addressDistrict.length !== 0) {
      setErrAddressDistrict(false);
    } else {
      setErrAddressDistrict(true);
      toast.error("Please fill your District");
    }

    if (addressState.length !== 0) {
      setErrAddressState(false);
    } else {
      setErrAddressState(true);
      toast.error("Please fill your state");
    }

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //below check for district validation
    if (district.length !== 0) {
      setErrDistrict(false);
    } else {
      setErrDistrict(true);
      toast.error("Please select your district");
    }

    //below check for block validation
    if (block.length !== 0) {
      setErrBlock(false);
    } else {
      setErrBlock(true);
      toast.error("Please select your block");
    }

    //below check for school validation
    if (school.length !== 0) {
      setErrSchool(false);
    } else {
      setErrSchool(true);
      toast.error("Please select your school");
    }

    if (
      previousClassAnnualExamPercentage.length === 2 &&
      /[^\d]/.test(previousClassAnnualExamPercentage) == false
    ) {
      setErrPreviousClassAnnualExamPercentage(false);
    } else {
      setErrPreviousClassAnnualExamPercentage(true);
      toast.error("Percentage must contain only 2 digits");
    }
  }

  function formValidate() {
    if (
      errSrn === false &&
      errName === false &&
      errFather === false &&
      errMother === false &&
      errDob === false &&
      errGender === false &&
      errCategory === false &&
      errAadhar === false &&
      errMobile === false &&
      errWhatsapp === false &&
      // errAddress === false &&

      //below added on 7 nov

      // errHouseNumber === false &&
      errCityTownVillage === false &&
      errAddressBlock === false &&
      errAddressDistrict === false &&
      errAddressState === false &&
      //^^^^^^^^^^^^^^^^
      errDistrict === false &&
      errBlock === false &&
      errSchool === false &&
      errPreviousClassAnnualExamPercentage === false
    ) {
      // All error states are
      setFormValidated(true);
      console.log("All error states are clear.");
    } else {
      setFormValidated(false);
      console.log("All states are not cleared.");
    }
  }

  useEffect(() => {
    formValidate();
  }, [
    errSrn,
    name,
    errFather,
    errMother,
    errDob,
    errGender,
    errCategory,
    errAadhar,
    errMobile,
    errWhatsapp,
    // errAddress,

    //Below added on 7 nov

    // errHouseNumber,
    errCityTownVillage,
    errAddressBlock,
    errAddressDistrict,
    errAddressState,

    //^^^^^^^^^^^^^^^^^^^^^^

    errDistrict,
    errBlock,
    errSchool,
    errPreviousClassAnnualExamPercentage,
  
  ]);

  console.log("Blow  if formValidated");
  console.log(formValidated);
  //Belwo useEffect only runs when formvalidated is true
  useEffect(() => {
    // Only call handleSubmit if formValidated is true
    if (formValidated) {
      handleSubmit();
    }
  }, [formValidated]);

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //Below function runs when submit button is hit on the prefilled form functionality and updates the data in db.

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    // e.preventDefault();

    // Call the formValidation function
    formValidation();

    // Check if the form is validated
    if (!formValidated) {
      //  toast.error('Please fill the form correctly')
      return; // Stop execution if validation fails
    } else {
      // toast.success("Form Filled Right");
    }

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

      // formData.append('address', address);
      formData.append("district", district);
      formData.append("block", block);
      formData.append("school", school);
      formData.append(
        "previousClassAnnualExamPercentage",
        previousClassAnnualExamPercentage
      );
      formData.append("grade", grade);
      formData.append("isRegisteredBy", isRegisteredBy);
      formData.append("schoolCode", schoolCode);
      formData.append("slipId", slipId);

      //Below field added on 23-Nov. R
      formData.append("isVerified", isVerified)
      formData.append("verificationRemark", verificationRemark)

      console.log(slipId);

      if (image) {
        formData.append("image", image);
      }

      //Below piece of code converts the formData into JSON Object to show it in a Slip
      const SlipData = {};
      formData.forEach((value, key) => {
        SlipData[key] = value;
      });

      console.log(SlipData);
      setSlipData(SlipData);
      console.log(slipData); //It will not directly log the data but, yes it will store the data in slipData hook(It is something related to useEffect hook)
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

      //Below in the try catch block we are sending the formData using our updatePostById method on the based of student id.
      // we are getting student id from InputSrn component.
      try {
        const response = await RegistrationFormService.updatePostsById(
          id,
          formData
        );
        console.log(response); // Debugging log
        if (response.data.updated_data) {
          toast.success("Form updated succesfully");
          setMessage("Data updated successfully");
          setShowAck(true); //this was for showing Acknowledgement slip dynamically.
          // if (location.pathname === '/Registration-form/put/MB'){
          //     navigate('/acknowledgementslip-mb')
          // } else if (location.pathname === '/Registration-form/put/S100'){
          //     navigate('/acknowledgementslip-100')
          // }
          setTimeout(() => {
            setShowAck(false);
            
          }, 20000);

          //navigate('/srn')  //after successfull updation of data it routes back to the inputsrn page
        } else {
          setMessage("Failed to update data.");
        }
      } catch (error) {
        console.error("Error updating data:", error);
        setMessage("An error occurred while updating the data.");
      }
    } catch (error) {
      console.log("Some error occured");
    }
  };

  let ackStateChange;
  
  if (ackStateChange){
    setShowAck(false)
  }

  return (
    <>
      <StudentNavbar />
      <hr></hr>

      <Nav defaultActiveKey="/userprofile" as="ul">
        <Nav.Item as="li">
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link href="/">How to fill form video (फॉर्म कैसे भरे)</Nav.Link>
        </Nav.Item>
      </Nav>
      <Container>
        {/* <Container fluid >
        <Row className="d-flex justify-content-center align-items-center">
          <img
            style={{
              width: 100,
              height: 100,
              textAlign: "center",
              alignContent: "center",
            }}
            src="/HRlogo.png"
          />
        </Row>
        <Row>
          <h2 style={{ textAlign: "center" }}>{FormHeader2}</h2>
        </Row>
        <Row>
          <h3 style={{ textAlign: "center" }}>{FormHeader1}</h3>
        </Row>
        <Row>
          <h4 style={{ textAlign: "center" }}>{FormHeader3}</h4>
        </Row>
        <hr></hr>

        <Nav defaultActiveKey="/userprofile" as="ul">
          <Nav.Item as="li">
            <Nav.Link href="/examination">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link href="/examination">How to fill form (फॉर्म कैसे भरे)</Nav.Link>
          </Nav.Item>
        </Nav>
        </Container> */}

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
                  value={srn}
                  onChange={(e) => setSrn(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="border mb-3 rounded-2">
            <Col xs={12} md={6} className="border-end p-3">
              <h2>Personal Details (व्यक्तिगत विवरण) :</h2>
              <Form.Group className="mb-3" controlId="nameInput">
                <Form.Label>Student Name (विद्यार्थी का नाम) :</Form.Label>

                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Student Name (विद्यार्थी का नाम)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="fatherInput">
                <Form.Label>Father's Name (पिता का नाम) :</Form.Label>
                <p style={{ fontSize: "12px" }}>(Mr/श्री का प्रयोग न करें)</p>
                <Form.Control
                  type="text"
                  name="father"
                  placeholder="Father's Name (पिता का नाम)"
                  value={father}
                  onChange={(e) => setFather(e.target.value)}
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
                  placeholder="Mother's Name (मां का नाम)"
                  value={mother}
                  onChange={(e) => setMother(e.target.value)}
                />

                <Form.Group className="mb-3" controlId="gradeSelect">
                  <Form.Label>Class (कक्षा) :</Form.Label>

                  <Form.Select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    <option value={grade}>{grade}</option>
                  </Form.Select>
                </Form.Group>
              </Form.Group>
              <Form.Group className="mb-3" controlId="dobInput">
                <Form.Label>D.O.B (जन्म तिथि) :</Form.Label>

                <Form.Control
                  type="date"
                  name="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  max= "2024-12-31"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="genderSelect">
                <Form.Label>Gender (लिंग) :</Form.Label>

                <Form.Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Your Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="categorySelect">
                <Form.Label>Category (वर्ग) :</Form.Label>

                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Your Category</option>
                  <option value="BCA">BCA</option>
                  <option value="BCB">BCB</option>
                  <option value="GEN">GEN</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="aadharInput">
                <Form.Label>Aadhar Number (आधार नंबर) :</Form.Label>
                <Form.Control
                  type="text"
                  name="aadhar"
                  placeholder="Aadhar Number (आधार नंबर)"
                  maxLength={12}
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  
                />
              </Form.Group>
            </Col>

            {/* Second Column inside the Second Row */}

            <Col className="border-end p-3">
              <h2>Contact Details (संपर्क विवरण) :</h2>
              <Form.Group className="mb-3" controlId="mobileInput">
                <Form.Label>Mobile Number (मोबाइल नंबर) :</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number (मोबाइल नंबर)"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
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
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  maxLength={10}
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
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="addressInput">
                <Form.Label>City/Town/Village (शहर/कस्बा/गाँव):</Form.Label>
                <Form.Control
                  type="text"
                  name="cityTownVillage"
                  placeholder="City/Town/Village (शहर/कस्बा/गाँव)"
                  value={cityTownVillage}
                  onChange={(e) => setCityTownVillage(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="addressInput">
                <Form.Label>Block (ब्लॉक):</Form.Label>
                <Form.Control
                  type="text"
                  name="addressBlock"
                  placeholder="Block"
                  value={addressBlock}
                  onChange={(e) => setAddressBlock(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="addressInput">
                <Form.Label>District (ज़िला):</Form.Label>
                <Form.Control
                  type="text"
                  name="addressDistrict"
                  placeholder="District (ज़िला)"
                  value={addressDistrict}
                  onChange={(e) => setAddressDistrict(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="addressInput">
                <Form.Label>State (राज्य):</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="State (राज्य)"
                  value={addressState}
                  onChange={(e) => setAddressState(e.target.value)}
                />
              </Form.Group>

              {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}

              {/* Nested Row inside a second column of the second Row    */}

              <h2>Academic Details (शैक्षिक विवरण) :</h2>

              <DependentDropComponent
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
                    ? "Class 7th Annual Examination Percentage (कक्षा 7वीं की वार्षिक परीक्षा का प्रतिशत)"
                    : "Class 9th Annual Examination Percentage (कक्षा 9वीं की वार्षिक परीक्षा का प्रतिशत.)"}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="previousClassAnnualExamPercentage"
                  placeholder="Enter Percentage"
                  maxLength={2}
                  value={previousClassAnnualExamPercentage}
                  onChange={(e) =>
                    setPreviousClassAnnualExamPercentage(e.target.value)
                  }
                />
              </Form.Group>

              {/* <label>Enter Your District: </label>
            <br/>
            <input type='text' name='district' placeholder='Enter Your District' value={district} onChange={(e) => setDistrict(e.target.value)} />
            <br/>
    
            <label>Enter Your Block: </label>
            <br/>
            <input type='text' name='block' placeholder='Enter Your Block' value={block} onChange={(e) => setBlock(e.target.value)} />
            <br/>
    
            <label>Enter Your School: </label>
            <br/>
            <input type='text' name='school' placeholder='Enter Your School' value={school} onChange={(e) => setSchool(e.target.value)} />
            <br/> */}

              {/* ^^^^^Nested Row inside a second column of the second Row ^^^^*/}

              {/* <input type='text' name='grade' placeholder='Enter Your Grade' value={grade} onChange={(e) => setGrade(e.target.value)} /> */}
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
                  upload it within 48 hours. <br />
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

        {/* <p>{message}</p>
        <p>{student.name}</p> */}
        <br></br>

        {showAck ? (
          <AcknowledgementSlip showAck={showAck} slipData={slipData} ackStateChange={ackStateChange} /> //showAck = {showAck} slipData = {slipData} <= these are the props if needed i can use from here.
        ) : null}
      </Container>
    </>
  );
}

export default PreFilledRegistrationForm;
