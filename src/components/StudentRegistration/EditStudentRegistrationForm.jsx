import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
  Row,
  Col,
  CardFooter,
} from "react-bootstrap";
import Select from "react-select";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { createStudent, updateStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";
import { FileUploadContext, StudentContext } from "../NewContextApis/StudentContextApi.js";
import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
import { FileUpload } from "../utils/fileUploadUtils.jsx";
import { UserContext } from "../NewContextApis/UserContext.js";
import {
  DistrictBlockSchoolDependentDropDownContext,
} from "../NewContextApis/District_block_schoolsCotextApi.js";
import { AcknowledgementSlipComponent } from "./AcknowledgementSlip.jsx";


import { useLocation, useNavigate } from "react-router-dom";

export const EditStudentRegistrationForm = () => {


  const navigate = useNavigate();
 const location = useLocation();
 

 console.log(location.pathname)

  const { studentData, setStudentData } = useContext(StudentContext);
  const { userData } = useContext(UserContext);
  const { fileUploadData, setFileUploadData } = useContext(FileUploadContext);

    const context = useContext(DistrictBlockSchoolDependentDropDownContext);
    const {
      districtContext,
      setDistrictContext,
      blockContext,
      setBlockContext,
      schoolContext,
      setSchoolContext,
    } = context || {};
  

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

  const [houseNumber, setHouseNumber] = useState("");
  const [cityTownVillage, setCityTownVillage] = useState("");
  const [addressBlock, setAddressBlock] = useState("");
  const [addressDistrict, setAddressDistrict] = useState("");
  const [addressState, setAddressState] = useState("");

  const [schoolDistrict, setSchoolDistrict] = useState("");
  const [schoolDistrictCode, setSchoolDistrictCode] = useState("");
  const [schoolBlock, setSchoolBlock] = useState("");
  const [schoolBlockCode, setSchoolBlockCode] = useState("");
  const [school, setSchool] = useState("");
  const [schoolCode, setSchoolCode] = useState("");

  const [previousClassAnnualExamPercentage, setPreviousClassAnnualExamPercentage] = useState("");
  const [classOfStudent, setClassOfStudent] = useState("");

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [errors, setErrors] = useState({});

  const loadedStudentIdRef = useRef(null);



 useEffect(() => {
  if (studentData && studentData._id) return;

  // Only set initial class if not editing existing student
  if (!studentData || !studentData._id) {
    if (location.pathname === "/user-registration-form-mb" || 
        location.pathname === "/exam-registration-form-mb") {
      setClassOfStudent("8");
    } else if (location.pathname === "/user-registration-form-sh" || 
               location.pathname === "/exam-registration-form-sh") {
      setClassOfStudent("10");
    }
  }
}, [location.pathname, classOfStudent, setClassOfStudent, studentData]);




  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const categoryOptions = [
    { value: "BCA", label: "BCA" },
    { value: "BCB", label: "BCB" },
    { value: "GEN", label: "GEN" },
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" },
    { value: "OBC", label: "OBC" },
  ];

  const classOptions = [
    { value: "8", label: "8" },
    { value: "10", label: "10" },
  ];

  const trim = (s) => (typeof s === "string" ? s.trim() : s);
  const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();

  const onlyDigits = (value, maxLen = 10) => {
    const digits = String(value || "").replace(/\D+/g, "").slice(0, maxLen);
    return digits;
  };

  const onlyAlphaSpace = (value) => {
    const v = String(value || "");
    const cleaned = v.replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
    return cleaned;
  };

  const alphaNumUpper = (value, maxLen = 100) => {
    const v = String(value || "");
    const cleaned = v.replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen);
    return cleaned.trim().toUpperCase();
  };

  const sanitizePercentage = (value) => {
    const v = String(value || "").trim();
    const cleaned = v.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length <= 1) return parts[0].slice(0, 3);
    const integer = parts[0].slice(0, 3);
    const decimal = parts[1].slice(0, 2);
    return `${integer}.${decimal}`;
  };

  const mapToOption = (value, options) => {
    if (!value) return null;
    return options.find((o) => String(o.value) === String(value)) || null;
  };

  useEffect(() => {
    if (!studentData) {
      loadedStudentIdRef.current = null;
      return;
    }

    if (studentData._id && loadedStudentIdRef.current !== studentData._id) {
      loadedStudentIdRef.current = studentData._id;

      setSrn(studentData.srn ?? "");
      setName(studentData.name ?? "");
      setFather(studentData.father ?? "");
      setMother(studentData.mother ?? "");
      
      if (studentData.dob) {
        if (typeof studentData.dob === 'string' && studentData.dob.match(/^\d{4}-\d{2}-\d{2}$/)) {
          setDob(studentData.dob);
        } else {
          const dateObj = new Date(studentData.dob);
          const year = dateObj.getUTCFullYear();
          const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getUTCDate()).padStart(2, '0');
          setDob(`${year}-${month}-${day}`);
        }
      } else {
        setDob("");
      }
      
      setGender(studentData.gender ?? "");
      setCategory(studentData.category ?? "");
      setAadhar(studentData.aadhar ?? "");
      setMobile(studentData.mobile ?? "");
      setWhatsapp(studentData.whatsapp ?? "");

      setHouseNumber(studentData.houseNumber ?? "");
      setCityTownVillage(studentData.cityTownVillage ?? "");
      setAddressBlock(studentData.addressBlock ?? "");
      setAddressDistrict(studentData.addressDistrict ?? "");
      setAddressState(studentData.addressState ?? "");

      setSchoolDistrict(studentData.schoolDistrict ?? "");
      setSchoolDistrictCode(studentData.schoolDistrictCode ?? "");
      setSchoolBlock(studentData.schoolBlock ?? "");
      setSchoolBlockCode(studentData.schoolBlockCode ?? "");
      setSchool(studentData.school ?? "");
      setSchoolCode(studentData.schoolCode ?? "");

      setPreviousClassAnnualExamPercentage(studentData.previousClassAnnualExamPercentage ?? "");
      setClassOfStudent(studentData.classOfStudent ?? "");

      setImage(null);
      setImageUrl(studentData.imageUrl ?? "");

      // Reset the context values when loading a new student
      if (setDistrictContext) {
        if (studentData.schoolDistrict && studentData.schoolDistrictCode) {
          setDistrictContext({
            value: studentData.schoolDistrictCode,
            label: studentData.schoolDistrict
          });
        } else {
          setDistrictContext(null);
        }
      }
      if (setBlockContext) {
        if (studentData.schoolBlock && studentData.schoolBlockCode) {
          setBlockContext({
            value: studentData.schoolBlockCode,
            label: studentData.schoolBlock
          });
        } else {
          setBlockContext(null);
        }
      }
      if (setSchoolContext) {
        if (studentData.school && studentData.schoolCode) {
          setSchoolContext({
            value: studentData.schoolCode,
            label: studentData.school
          });
        } else {
          setSchoolContext(null);
        }
      }
    }
  }, [studentData, setDistrictContext, setBlockContext, setSchoolContext]);

  // Clear context when component unmounts or when studentData is cleared
  useEffect(() => {
    return () => {
      // Clear context when component unmounts
      if (setDistrictContext) setDistrictContext(null);
      if (setBlockContext) setBlockContext(null);
      if (setSchoolContext) setSchoolContext(null);
    };
  }, [setDistrictContext, setBlockContext, setSchoolContext]);

  // Clear context when studentData is cleared (new form)
  useEffect(() => {
    if (!studentData || (studentData && Object.keys(studentData).length === 0)) {
      if (setDistrictContext) setDistrictContext(null);
      if (setBlockContext) setBlockContext(null);
      if (setSchoolContext) setSchoolContext(null);
    }
  }, [studentData, setDistrictContext, setBlockContext, setSchoolContext]);

  useEffect(() => {
    const fileFromContext = fileUploadData && fileUploadData[0] && fileUploadData[0].file;
    if (fileFromContext) {
      setImage(fileFromContext);
      try {
        const previewUrl = URL.createObjectURL(fileFromContext);
        setImageUrl(previewUrl);
      } catch (err) {
      }
    }
  }, [fileUploadData]);

  useEffect(() => {
    if (!districtContext) {
      setSchoolDistrict("");
      setSchoolDistrictCode("");
    }
  }, [districtContext]);

  useEffect(() => {
    if (!blockContext) {
      setSchoolBlock("");
      setSchoolBlockCode("");
    }
  }, [blockContext]);

  useEffect(() => {
    if (!schoolContext) {
      setSchool("");
      setSchoolCode("");
    }
  }, [schoolContext]);

  const handleSrnChange = (e) => {
    setSrn(onlyDigits(e.target.value, 10));
    setErrors((p) => ({ ...p, srn: null }));
  };

  const handleAadharChange = (e) => {
    setAadhar(onlyDigits(e.target.value, 12));
    setErrors((p) => ({ ...p, aadhar: null }));
  };

  const handleMobileChange = (setter) => (e) => {
    setter(onlyDigits(e.target.value, 10));
    setErrors((p) => ({ ...p, mobile: null, whatsapp: null }));
  };

  const handleNameChange = (setter) => (e) => {
    setter(onlyAlphaSpace(e.target.value));
    setErrors((p) => ({ ...p, name: null, father: null, mother: null }));
  };

  const handleAddressChangeUpper = (setter) => (e) => {
    setter(alphaNumUpper(e.target.value));
  };

  const handlePrevPercentChange = (e) => {
    setPreviousClassAnnualExamPercentage(sanitizePercentage(e.target.value));
  };

  const validateAll = () => {
    const newErrors = {};

    const requiredFields = {
      srn,
      name,
      father,
      mother,
      dob,
      gender,
      category,
      aadhar,
      mobile,
      whatsapp,
      cityTownVillage,
      addressBlock,
      addressDistrict,
      addressState,
      previousClassAnnualExamPercentage,
      classOfStudent,
    };

    Object.entries(requiredFields).forEach(([k, v]) => {
      if (v === undefined || v === null || String(v).trim() === "") {
        newErrors[k] = "This field is required.";
      }
    });

    if (srn && !/^\d{10}$/.test(srn)) {
      newErrors.srn = "SRN must be exactly 10 digits.";
    }

    ["name", "father", "mother"].forEach((f) => {
      const val = (f === "name" ? name : f === "father" ? father : mother) || "";
      if (val && !/^[A-Za-z\s]+$/.test(val)) {
        newErrors[f] = "Only alphabets and spaces allowed.";
      }
    });

    if (mobile && !/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile must be 10 digits.";
    }
    if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
      newErrors.whatsapp = "WhatsApp must be 10 digits.";
    }


    
    if (aadhar && !/^\d{12}$/.test(aadhar)) {
     
      newErrors.aadhar = "Aadhar must be exactly 12 digits.";
    }

    if (previousClassAnnualExamPercentage) {
      if (!/^\d{1,3}(\.\d{1,2})?$/.test(previousClassAnnualExamPercentage)) {
        newErrors.previousClassAnnualExamPercentage = "Enter a valid percent (up to 3 digits or up to 2 decimals).";
      }
    }

    const alphaNumFields = {
      cityTownVillage,
      addressBlock,
      addressDistrict,
      addressState,
    };
    Object.entries(alphaNumFields).forEach(([k, v]) => {
      if (v && !/^[A-Z0-9\s\-\/]+$/.test(v)) {
        newErrors[k] = "Only alphanumeric characters, spaces, - or / are allowed (will be uppercased).";
      }
    });

    const isUpdateMode = !!(studentData && studentData._id);

    if (!districtContext || !districtContext.label || String(districtContext.label).trim() === "") {
      newErrors.schoolDistrict = "This field is required.";
    }
    if (!blockContext || !blockContext.label || String(blockContext.label).trim() === "") {
      newErrors.schoolBlock = "This field is required.";
    }
    if (!schoolContext || !schoolContext.label || String(schoolContext.label).trim() === "") {
      newErrors.school = "This field is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();


const slipId = name.slice(0, 3).toUpperCase() + srn.slice(-5);

const registrationDate =  new Date();

    setAlert(null);
    setLoading(true);

    try {
      const ok = validateAll();
      if (!ok) {
        setAlert({ type: "danger", message: "Please do not leave any mandatory fields empty. (कृपया किसी भी अनिवार्य फ़ील्ड को खाली न छोड़ें।)" });
        setLoading(false);
        return;
      }

      const formData = new FormData();

      if (studentData){

        
      if (studentData?.registrationDate === null || studentData?.registrationDate === ""
        || studentData?.registrationDate === undefined
      ){
        formData.append("registrationDate", registrationDate);
      } else {
        formData.append("registrationDate", registrationDate);
      }

      } else {
        formData.append("registrationDate", registrationDate);
      }

       

   

      if (userData
       ) {
      

         formData.append("isRegisteredBy", userData?.user._id);
       } else {
         formData.append("isRegisteredBy", "Self");
       }

      if (studentData && studentData._id) {
        formData.append("isVerified", "Pending");
        formData.append("verifiedBy", null);
        formData.append("registrationFormVerificationRemark", null);
      }

        
    

      formData.append("slipId", trim(slipId));
      formData.append("srn", trim(srn));
      formData.append("name", toUpperTrim(name));
      formData.append("father", toUpperTrim(father));
      formData.append("mother", toUpperTrim(mother));
      formData.append("dob", trim(dob));
      formData.append("gender", trim(gender).toUpperCase());
      formData.append("category", trim(category).toUpperCase());
      

      formData.append("aadhar", trim(aadhar));
      formData.append("mobile", trim(mobile));
      formData.append("whatsapp", trim(whatsapp));

      formData.append("houseNumber", alphaNumUpper(houseNumber));
      formData.append("cityTownVillage", alphaNumUpper(cityTownVillage));
      formData.append("addressBlock", alphaNumUpper(addressBlock));
      formData.append("addressDistrict", alphaNumUpper(addressDistrict));
      formData.append("addressState", alphaNumUpper(addressState));

      const finalSchoolDistrict = districtContext?.label || schoolDistrict;
      const finalSchoolDistrictCode = districtContext?.value || schoolDistrictCode;
      const finalSchoolBlock = blockContext?.label || schoolBlock;
      const finalSchoolBlockCode = blockContext?.value || schoolBlockCode;
      const finalSchool = schoolContext?.label || school;
      const finalSchoolCode = schoolContext?.value || schoolCode;

      formData.append("schoolDistrict", toUpperTrim(finalSchoolDistrict));
      formData.append("schoolDistrictCode", trim(finalSchoolDistrictCode));
      formData.append("schoolBlock", toUpperTrim(finalSchoolBlock));
      formData.append("schoolBlockCode", trim(finalSchoolBlockCode));
      formData.append("school", toUpperTrim(finalSchool));
      formData.append("schoolCode", trim(finalSchoolCode));

      formData.append("previousClassAnnualExamPercentage", trim(previousClassAnnualExamPercentage));
      formData.append("classOfStudent", trim(classOfStudent));

      const fileFromContext = fileUploadData && fileUploadData[0] && fileUploadData[0].file;
      const fileToAppend = fileFromContext || image;
      if (fileToAppend) {
        formData.append("image", fileToAppend);
      }

      if (imageUrl) formData.append("imageUrl", imageUrl);

      let response;
      if (studentData && studentData._id) {
        formData.append("_id", studentData._id);
        response = await updateStudent(formData);
       
        console.log(response?.updatedStudent)

        setStudentData(response?.updatedStudent)
        
        // Clear context before navigating
        if (setDistrictContext) setDistrictContext(null);
        if (setBlockContext) setBlockContext(null);
        if (setSchoolContext) setSchoolContext(null);
        
        // After successful update, navigate back to signin
        // Determine which signin page to navigate back to based on the pathname
        const suffix = location.pathname.slice(-2); // Get "mb" or "sh"
        if (location.pathname.includes("/edit-student-registration-form")) {
          // If we're on edit page, navigate back to student signin
          navigate(`/edit-student-signin`);
        } else if (location.pathname.includes("/exam-registration-form")) {
          navigate(`/exam-student-signin`);
        } else if (location.pathname.includes("/user-registration-form")) {
          navigate(`/user-student-signin`);
        } else {
          // Default fallback
          navigate(`/edit-student-signin`);
        }
        
        return; // Exit early after navigation
      } else {
        response = await createStudent(formData);

        console.log(response?.data)

        setStudentData(response?.data)
        
      }

      setAlert({ type: "success", message: "form submitted or updated successfully" });

      setSrn("");
      setName("");
      setFather("");
      setMother("");
      setDob("");
      setGender("");
      setCategory("");
      setAadhar("");
      setMobile("");
      setWhatsapp("");

      setHouseNumber("");
      setCityTownVillage("");
      setAddressBlock("");
      setAddressDistrict("");
      setAddressState("");

      setSchoolDistrict("");
      setSchoolDistrictCode("");
      setSchoolBlock("");
      setSchoolBlockCode("");
      setSchool("");
      setSchoolCode("");

      setPreviousClassAnnualExamPercentage("");
      setClassOfStudent("");

      setImage(null);
      setImageUrl("");

      // Clear context
      if (setDistrictContext) setDistrictContext(null);
      if (setBlockContext) setBlockContext(null);
      if (setSchoolContext) setSchoolContext(null);

      loadedStudentIdRef.current = null;

      try {
      } catch (err) {
      }
      try {
        if (setFileUploadData) setFileUploadData([]);
      } catch (err) {
      }

      if (response?.data) {
      console.log("hi")
        setStudentData(response.data);
        loadedStudentIdRef.current = response.data._id || loadedStudentIdRef.current;

        if(userData){
          
          console.log('elloo')
         
          if (location.pathname === "/user-registration-form-mb" || 
            location.pathname === "/user-registration-form-sh"
          ) {

              navigate(`/user-exam-acknowledgement-slip-${location.pathname.slice(-2)}`)
          } 
          
        } else if (location.pathname === "/exam-registration-form-mb" || 
            location.pathname === "/exam-registration-form-sh"){
          
      
          
             navigate(`/exam-acknowledgement-slip-${location.pathname.slice(-2)}`)
        
        }
        
      } else{console.log("jelllo")
        console.log(studentData)
        if(userData){

         
          if (location.pathname === "/user-registration-form-mb" || 
            location.pathname === "/user-registration-form-sh"
          ) {
             navigate(`/user-exam-acknowledgement-slip-${location.pathname.slice(-2)}`)
          } 
          
        } else{
         
          if (location.pathname === "/exam-registration-form-mb" || 
            location.pathname === "/exam-registration-form-sh"
          ) {
          

             navigate(`/exam-acknowledgement-slip-${location.pathname.slice(-2)}`)
          } 
      
        }
    
      }

      
   


    } catch (err) {
      console.error("Submit error:", err);
      const msg = err?.response?.data?.message || err?.message || "Something went wrong.";
      setAlert({ type: "danger", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const renderImagePreview = () => {
    if (!imageUrl) return null;
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, marginBottom: 6 }}>Image preview:</div>
        <img src={imageUrl} alt="preview" style={{ maxWidth: 160, maxHeight: 160, objectFit: "cover" }} />
      </div>
    );
  };

  return (
    <Container fluid className="py-3">
      {alert && (
        <Alert variant={alert.type === "danger" ? "danger" : "success"} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      <h1 style={{textAlign:'center', color:'red', fontWeight:'bold'}}>{location.pathname === "/exam-registration-form-mb" ||
      location.pathname === "/user-registration-form-mb" ? ("Class 8 - Mission Buinyaad Registration Form"):("Edit Details") }</h1>
      <hr></hr>
      <Form onSubmit={handleSubmit} noValidate>
        <Card className="mb-3">
          <Card.Body>
            <Form.Group controlId="formSrn">
              <Form.Label><strong>SRN (एस.आर.एन.) :</strong></Form.Label>
              <br></br>
              <small>(नोट: एसआरएन नंबर के बारे में जानकारी न होने पर विद्यालय में संपर्क करें।)</small>
              <Form.Control
                type="text"
                placeholder="SRN (एस.आर.एन.)"
                value={srn}
                onChange={handleSrnChange}
                isInvalid={!!errors.srn}
              />
              <Form.Control.Feedback type="invalid">{errors.srn}</Form.Control.Feedback>
            </Form.Group>
          </Card.Body>
        </Card>

        <Row>
          <Col lg={7}>
            <Card className="mb-3">
              <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700, fontSize:'25px' }}>
                Personal Details (व्यक्तिगत विवरण)
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formName">
                      <Form.Label>Student Name (विद्यार्थी का नाम) :</Form.Label> 
                      <br></br>
                      <small>(स्कूल में पंजीकृत नाम दर्ज करें)</small>
                      <Form.Control
                        type="text"
                        placeholder="Student Name (विद्यार्थी का नाम)"
                        value={name}
                        onChange={handleNameChange(setName)}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formFather">
                      <Form.Label>Father's Name (पिता का नाम) :</Form.Label>
                      <br></br>
                      <small>(Mr/श्री का प्रयोग न करें)</small>
                      <Form.Control
                        type="text"
                        placeholder="Father's Name (पिता का नाम)"
                        value={father}
                        onChange={handleNameChange(setFather)}
                        isInvalid={!!errors.father}
                      />
                      <Form.Control.Feedback type="invalid">{errors.father}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formMother">
                      <Form.Label>Mother's Name (माता का नाम) :</Form.Label>
                      <br></br>
                      <small>(Mrs/श्रीमती का प्रयोग न करें)</small>
                      <Form.Control
                        type="text"
                        placeholder="Mother's Name (माता का नाम)"
                        value={mother}
                        onChange={handleNameChange(setMother)}
                        isInvalid={!!errors.mother}
                      />
                      <Form.Control.Feedback type="invalid">{errors.mother}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formDob">
                      <Form.Label>D.O.B (जन्म तिथि) :</Form.Label>
                      <Form.Control type="date" value={dob} onChange={(e) => { setDob(e.target.value); setErrors((p) => ({ ...p, dob: null })); }} isInvalid={!!errors.dob} />
                      <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formGender">
                      <Form.Label>Gender (लिंग) :</Form.Label>
                      <Select
                        value={mapToOption(gender, genderOptions)}
                        options={genderOptions}
                        onChange={(opt) => { setGender(opt ? opt.value : ""); setErrors((p) => ({ ...p, gender: null })); }}
                      />
                      {errors.gender && <div className="text-danger small mt-1">{errors.gender}</div>}
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formCategory">
                      <Form.Label>Category (वर्ग) :</Form.Label>
                      <Select
                        value={mapToOption(category, categoryOptions)}
                        options={categoryOptions}
                        onChange={(opt) => { setCategory(opt ? opt.value : ""); setErrors((p) => ({ ...p, category: null })); }}
                      />
                      {errors.category && <div className="text-danger small mt-1">{errors.category}</div>}
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formAadhar">
                      <Form.Label>Aadhar Number (आधार संख्या) :</Form.Label>
                      <Form.Control type="text" placeholder="Aadhar Number (आधार संख्या)" value={aadhar} onChange={handleAadharChange} isInvalid={!!errors.aadhar} />
                      <Form.Control.Feedback type="invalid">{errors.aadhar}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Header style={{  backgroundColor: "#f7f7f7", fontWeight: 700, fontSize:'25px'}}>
                Address Details
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group controlId="formHouseNumber">
                      <Form.Label>H. No (मकान नंबर) :</Form.Label>
                      <br></br>
                      <small>Optional. (वैकल्पिक)</small>
                      <Form.Control type="text" placeholder="H. No" value={houseNumber} onChange={handleAddressChangeUpper(setHouseNumber)} isInvalid={!!errors.houseNumber} />
                      <Form.Control.Feedback type="invalid">{errors.houseNumber}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={8} className="mb-3">
                    <Form.Group controlId="formCityTownVillage">
                      <Form.Label>City/Town/Village :</Form.Label>
                      <Form.Control type="text" placeholder="City/Town/Village" value={cityTownVillage} onChange={handleAddressChangeUpper(setCityTownVillage)} isInvalid={!!errors.cityTownVillage} />
                      <Form.Control.Feedback type="invalid">{errors.cityTownVillage}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Group controlId="formAddressBlock">
                      <Form.Label>Block (ब्लॉक) :</Form.Label>
                      <Form.Control type="text" placeholder="Block" value={addressBlock} onChange={handleAddressChangeUpper(setAddressBlock)} isInvalid={!!errors.addressBlock} />
                      <Form.Control.Feedback type="invalid">{errors.addressBlock}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Group controlId="formAddressDistrict">
                      <Form.Label>District (ज़िला) :</Form.Label>
                      <Form.Control type="text" placeholder="District" value={addressDistrict} onChange={handleAddressChangeUpper(setAddressDistrict)} isInvalid={!!errors.addressDistrict} />
                      <Form.Control.Feedback type="invalid">{errors.addressDistrict}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Group controlId="formAddressState">
                      <Form.Label>State (राज्य) :</Form.Label>
                      <Form.Control type="text" placeholder="State" value={addressState} onChange={handleAddressChangeUpper(setAddressState)} isInvalid={!!errors.addressState} />
                      <Form.Control.Feedback type="invalid">{errors.addressState}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="mb-3">
              <Card.Header style={{  backgroundColor: "#f7f7f7", fontWeight: 700, fontSize:'25px'}}>
                Contact Details (संपर्क विवरण)
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formMobile">
                      <Form.Label>Mobile Number (मोबाइल नंबर) :</Form.Label>
                      <Form.Control type="text" placeholder="Mobile Number" value={mobile} onChange={handleMobileChange(setMobile)} isInvalid={!!errors.mobile} />
                      <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formWhatsapp">
                      <Form.Label>Whatsapp Number (व्हाट्सएप नंबर) :</Form.Label>
                      <br></br>
                      <small>(केवल अपने माता या पिता का मोबाइल नंबर भरें)</small>
                      <Form.Control type="text" placeholder="Whatsapp Number" value={whatsapp} onChange={handleMobileChange(setWhatsapp)} isInvalid={!!errors.whatsapp} />
                      <Form.Control.Feedback type="invalid">{errors.whatsapp}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Header style={{  backgroundColor: "#f7f7f7", fontWeight: 700, fontSize:'25px' }}>
                Academic Details (शैक्षिक विवरण)
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formDistrictSchoolDropdown">
                   
                      <District_block_school_manual_school_name_dependentDropdown />
                      {errors.schoolDistrict && <div className="text-danger small mt-1">{errors.schoolDistrict}</div>}
                      {errors.schoolBlock && <div className="text-danger small mt-1">{errors.schoolBlock}</div>}
                      {errors.school && <div className="text-danger small mt-1">{errors.school}</div>}
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formPrevClassPercent">
                      <Form.Label>{location.pathname === "/exam-registration-form-mb" ||
                        location.pathname === "/user-registration-form-mb" ? ("Class 7th Annual Examination Percentage (कक्षा 7वीं वार्षिक परीक्षा प्रतिशत)"):("Class 9th Annual Examination Percentage (कक्षा 9वीं वार्षिक परीक्षा प्रतिशत)")
                        }</Form.Label>
                      <Form.Control type="text" placeholder="Enter Percentage" value={previousClassAnnualExamPercentage} onChange={handlePrevPercentChange} isInvalid={!!errors.previousClassAnnualExamPercentage} />
                      <Form.Control.Feedback type="invalid">{errors.previousClassAnnualExamPercentage}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group controlId="formClassSelect">
                      <Form.Label>Class of Student :</Form.Label>
                      <Select
                        value={mapToOption(classOfStudent, classOptions)}
                        options={classOptions}
                        onChange={(opt) => { setClassOfStudent(opt ? opt.value : ""); setErrors((p) => ({ ...p, classOfStudent: null })); }}
                        isDisabled={!studentData || !studentData._id} // Only enable for editing existing students
                      />
                      {errors.classOfStudent && <div className="text-danger small mt-1">{errors.classOfStudent}</div>}
                      {(!studentData || !studentData._id) && (
                        <Form.Text className="text-muted">
                          Class will be automatically set based on the form type for new registrations.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                {renderImagePreview()}
                <FileUpload />
           
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>

            <Card className="mb-3">

              <Card.Body>
                <Button style={{width:'100%'}} variant="primary" type="submit" disabled={loading}>
                  {loading ? <><Spinner animation="border" size="sm" /> Saving...</> : (studentData && studentData._id ? "Update Student" : "Register")}
                </Button>

              </Card.Body>
              <CardFooter>
                        Note / नोट: Submitting incorrect details may lead to form rejection. (गलत जानकारी देने पर फॉर्म अस्वीकार हो सकता है)
              </CardFooter>
            </Card>
          </Col>

          

        </Row>

        <div className="text-end mt-2">
          
        </div>
      </Form>
    </Container>
  );
};



