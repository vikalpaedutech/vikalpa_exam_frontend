// import React, { useContext, useState, useEffect, useRef } from "react";
// import {
//   Container,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Card,
//   Row,
//   Col,
//   CardFooter,
// } from "react-bootstrap";
// import Select from "react-select";
// import imageCompression from "browser-image-compression";
// import axios from "axios";
// import { createStudent, updateStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";
// import { FileUploadContext, StudentContext } from "../NewContextApis/StudentContextApi.js";
// import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
// import { FileUpload } from "../utils/fileUploadUtils.jsx";
// import { UserContext } from "../NewContextApis/UserContext.js";
// import {
//   DistrictBlockSchoolDependentDropDownContext,
// } from "../NewContextApis/District_block_schoolsCotextApi.js";
// import { AcknowledgementSlipComponent } from "./AcknowledgementSlip.jsx";


// import { useLocation, useNavigate } from "react-router-dom";

// export const StudentRegistrationForm = () => {


//   const navigate = useNavigate();
//  const location = useLocation();
 

//  console.log(location.pathname)
//  //----------------------------------------

//   // Contexts
//   const { studentData, setStudentData } = useContext(StudentContext);
//   const { userData } = useContext(UserContext);
//   const { fileUploadData, setFileUploadData } = useContext(FileUploadContext);
//   // const context = useContext(DistrictBlockSchoolDependentDropDownContext);


//     const context = useContext(DistrictBlockSchoolDependentDropDownContext);
//     const {
//       districtContext,
//       setDistrictContext,
//       blockContext,
//       setBlockContext,
//       schoolContext,
//       setSchoolContext,
//     } = context || {};
  
// //------------------------------------------------
//   // Local controlled state (all fields)
//   const [srn, setSrn] = useState("");
//   const [name, setName] = useState("");
//   const [father, setFather] = useState("");
//   const [mother, setMother] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");
//   const [category, setCategory] = useState("");
//   const [aadhar, setAadhar] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [whatsapp, setWhatsapp] = useState("");

//   const [houseNumber, setHouseNumber] = useState("");
//   const [cityTownVillage, setCityTownVillage] = useState("");
//   const [addressBlock, setAddressBlock] = useState("");
//   const [addressDistrict, setAddressDistrict] = useState("");
//   const [addressState, setAddressState] = useState("");

//   const [schoolDistrict, setSchoolDistrict] = useState("");
//   const [schoolDistrictCode, setSchoolDistrictCode] = useState("");
//   const [schoolBlock, setSchoolBlock] = useState("");
//   const [schoolBlockCode, setSchoolBlockCode] = useState("");
//   const [school, setSchool] = useState("");
//   const [schoolCode, setSchoolCode] = useState("");

//   const [previousClassAnnualExamPercentage, setPreviousClassAnnualExamPercentage] = useState("");
//   const [classOfStudent, setClassOfStudent] = useState("");

//   const [image, setImage] = useState(null); // File
//   const [imageUrl, setImageUrl] = useState(""); // preview / existing url

//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);

//   // validation state
//   const [errors, setErrors] = useState({});

//   // Keep a ref of the currently loaded student _id to avoid overwriting local edits unintentionally
//   const loadedStudentIdRef = useRef(null);



//   //Dunamically setting the state of classOfStudent if form is of class 8 or 10th
//  useEffect(() => {
//   if (location.pathname === "/user-registration-form-mb" && classOfStudent !== "8") {
//     setClassOfStudent("8");
//   } else if (location.pathname === "/user-registration-form-s100" && classOfStudent !== "10") {
//     setClassOfStudent("10");
//   } else if (location.pathname === "/exam-registration-form-mb" && classOfStudent !== "8"){
//     setClassOfStudent("8");
//   } else if ((location.pathname === "/exam-registration-form-s100" && classOfStudent !== "10")){
//     setClassOfStudent("8");
//   }
// }, [location.pathname, classOfStudent, setClassOfStudent]);



//   // Options for react-select
//   const genderOptions = [
//     { value: "Male", label: "Male" },
//     { value: "Female", label: "Female" },
//   ];

//   const categoryOptions = [
//     { value: "BCA", label: "BCA" },
//     { value: "GEN", label: "GEN" },
//     { value: "SC", label: "SC" },
//     { value: "ST", label: "ST" },
//     { value: "OBC", label: "OBC" },
//   ];

//   const classOptions = [
//     { value: "8", label: "8" },
//     { value: "10", label: "10" },
//   ];

//   // -----------------------
//   // Sanitizers & validators
//   // -----------------------
//   const trim = (s) => (typeof s === "string" ? s.trim() : s);
//   const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();

//   // only digits, limited length
//   const onlyDigits = (value, maxLen = 10) => {
//     const digits = String(value || "").replace(/\D+/g, "").slice(0, maxLen);
//     return digits;
//   };

//   // only alphabets and spaces (for names). We will allow only A-Z and space.
//   const onlyAlphaSpace = (value) => {
//     const v = String(value || "");
//     // allow letters and spaces, remove other chars
//     const cleaned = v.replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
//     return cleaned;
//   };

//   // alphanumeric uppercase and trimmed (for address fields)
//   const alphaNumUpper = (value, maxLen = 100) => {
//     const v = String(value || "");
//     // allow letters, numbers and spaces and some punctuation if needed (here keep alnum + space + -/), then uppercase
//     const cleaned = v.replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen);
//     return cleaned.trim().toUpperCase();
//   };

//   // previous class percent: allow up to 3 digits or decimals upto 2 places
//   const sanitizePercentage = (value) => {
//     const v = String(value || "").trim();
//     // remove invalid chars except digits and dot
//     const cleaned = v.replace(/[^0-9.]/g, "");
//     // enforce single dot
//     const parts = cleaned.split(".");
//     if (parts.length <= 1) return parts[0].slice(0, 3);
//     const integer = parts[0].slice(0, 3);
//     const decimal = parts[1].slice(0, 2);
//     return `${integer}.${decimal}`;
//   };

//   // mapToOption helper for react-select
//   const mapToOption = (value, options) => {
//     if (!value) return null;
//     return options.find((o) => String(o.value) === String(value)) || null;
//   };

//   // -----------------------
//   // Seed local state from studentData
//   // -----------------------
//   useEffect(() => {
//     if (!studentData) {
//       // if clearing the form, reset ref and local state
//       loadedStudentIdRef.current = null;
//       return;
//     }

//     // Only seed when the incoming studentData._id differs from currently loaded one
//     if (studentData._id && loadedStudentIdRef.current !== studentData._id) {
//       loadedStudentIdRef.current = studentData._id;

//       setSrn(studentData.srn ?? "");
//       setName(studentData.name ?? "");
//       setFather(studentData.father ?? "");
//       setMother(studentData.mother ?? "");
//       setDob(studentData.dob ? new Date(studentData.dob).toISOString().split("T")[0] : "");
//       setGender(studentData.gender ?? "");
//       setCategory(studentData.category ?? "");
//       setAadhar(studentData.aadhar ?? "");
//       setMobile(studentData.mobile ?? "");
//       setWhatsapp(studentData.whatsapp ?? "");

//       setHouseNumber(studentData.houseNumber ?? "");
//       setCityTownVillage(studentData.cityTownVillage ?? "");
//       setAddressBlock(studentData.addressBlock ?? "");
//       setAddressDistrict(studentData.addressDistrict ?? "");
//       setAddressState(studentData.addressState ?? "");

//       setSchoolDistrict(studentData.schoolDistrict ?? "");
//       setSchoolDistrictCode(studentData.schoolDistrictCode ?? "");
//       setSchoolBlock(studentData.schoolBlock ?? "");
//       setSchoolBlockCode(studentData.schoolBlockCode ?? "");
//       setSchool(studentData.school ?? "");
//       setSchoolCode(studentData.schoolCode ?? "");

//       setPreviousClassAnnualExamPercentage(studentData.previousClassAnnualExamPercentage ?? "");
//       setClassOfStudent(studentData.classOfStudent ?? "");

//       // image fields
//       setImage(null); // don't try to set File object for security; user can re-upload
//       setImageUrl(studentData.imageUrl ?? "");
//     }
//   }, [studentData]);

//   // React to FileUploadContext changes (if FileUpload component writes file there)
//   useEffect(() => {
//     const fileFromContext = fileUploadData && fileUploadData[0] && fileUploadData[0].file;
//     if (fileFromContext) {
//       setImage(fileFromContext);
//       // create local preview URL for immediate display
//       try {
//         const previewUrl = URL.createObjectURL(fileFromContext);
//         setImageUrl(previewUrl);
//         // revoke on cleanup: optional - we won't manage this here because user may navigate away
//       } catch (err) {
//         // ignore
//       }
//     }
//   }, [fileUploadData]);

//   // -----------------------
//   // Input change handlers with sanitization
//   // -----------------------
//   const handleSrnChange = (e) => {
//     setSrn(onlyDigits(e.target.value, 10));
//     setErrors((p) => ({ ...p, srn: null }));
//   };

//   const handleAadharChange = (e) => {
//     // allow digits only (aadhar unique), not enforced length here but we will validate on submit
//     setAadhar(onlyDigits(e.target.value, 20));
//     setErrors((p) => ({ ...p, aadhar: null }));
//   };

//   const handleMobileChange = (setter) => (e) => {
//     setter(onlyDigits(e.target.value, 10));
//     setErrors((p) => ({ ...p, mobile: null, whatsapp: null }));
//   };

//   const handleNameChange = (setter) => (e) => {
//     setter(onlyAlphaSpace(e.target.value));
//     // clear specific error
//     setErrors((p) => ({ ...p, name: null, father: null, mother: null }));
//   };

//   const handleAddressChangeUpper = (setter) => (e) => {
//     setter(alphaNumUpper(e.target.value));
//   };

//   const handlePrevPercentChange = (e) => {
//     setPreviousClassAnnualExamPercentage(sanitizePercentage(e.target.value));
//   };

//   // -----------------------
//   // Validation function (returns boolean)
//   // -----------------------
//   const validateAll = () => {
//     const newErrors = {};

//     // required fields (everything except file upload)
//     const requiredFields = {
//       srn,
//       name,
//       father,
//       mother,
//       dob,
//       gender,
//       category,
//       aadhar,
//       mobile,
//       whatsapp,
//       cityTownVillage,
//       addressBlock,
//       addressDistrict,
//       addressState,
//       // Depending on create vs update: include school fields only for CREATE mode.
//       previousClassAnnualExamPercentage,
//       classOfStudent,
//     };

//     Object.entries(requiredFields).forEach(([k, v]) => {
//       if (v === undefined || v === null || String(v).trim() === "") {
//         newErrors[k] = "This field is required.";
//       }
//     });

//     // srn: exactly 10 digits
//     if (srn && !/^\d{10}$/.test(srn)) {
//       newErrors.srn = "SRN must be exactly 10 digits.";
//     }

//     // names: only alphabets and spaces & not empty
//     ["name", "father", "mother"].forEach((f) => {
//       const val = (f === "name" ? name : f === "father" ? father : mother) || "";
//       if (val && !/^[A-Za-z\s]+$/.test(val)) {
//         newErrors[f] = "Only alphabets and spaces allowed.";
//       }
//     });

//     // contact numbers 10 digits
//     if (mobile && !/^\d{10}$/.test(mobile)) {
//       newErrors.mobile = "Mobile must be 10 digits.";
//     }
//     if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
//       newErrors.whatsapp = "WhatsApp must be 10 digits.";
//     }

//     // aadhar basic check - digits (length may vary depending on your rule; enforce at least 8 here)
//     if (aadhar && !/^\d{8,20}$/.test(aadhar)) {
//       newErrors.aadhar = "Aadhar must be numeric (min 8 digits).";
//     }

//     // percentage validation: allow up to 3 digits or decimal upto 2 places
//     if (previousClassAnnualExamPercentage) {
//       if (!/^\d{1,3}(\.\d{1,2})?$/.test(previousClassAnnualExamPercentage)) {
//         newErrors.previousClassAnnualExamPercentage = "Enter a valid percent (up to 3 digits or up to 2 decimals).";
//       }
//     }

//     // House/City/Block/District: must be alphanumeric (we sanitized to uppercase already)
//     const alphaNumFields = {
//       cityTownVillage,
//       addressBlock,
//       addressDistrict,
//       addressState,
//     };
//     Object.entries(alphaNumFields).forEach(([k, v]) => {
//       if (v && !/^[A-Z0-9\s\-\/]+$/.test(v)) {
//         newErrors[k] = "Only alphanumeric characters, spaces, - or / are allowed (will be uppercased).";
//       }
//     });

//     // Explicit checks for dependent dropdown contexts: ensure districtContext, blockContext and schoolContext are present with label/value.
//     // If any are empty/null/blank, set the corresponding error key so the UI will show exactly that field as required.
//     // ---------- CHANGED BEHAVIOR ----------
//     // For update case (studentData && studentData._id) we will NOT require schoolDistrict / schoolBlock / school fields.
//     // For create case (no studentData._id) we require them via districtContext/blockContext/schoolContext presence.

//     const isUpdateMode = !!(studentData && studentData._id);

//     if (!isUpdateMode) {
//       // CREATE mode: enforce dropdowns
//       if (!districtContext || !districtContext.label || String(districtContext.label).trim() === "") {
//         newErrors.schoolDistrict = "This field is required.";
//       }
//       if (!blockContext || !blockContext.label || String(blockContext.label).trim() === "") {
//         newErrors.schoolBlock = "This field is required.";
//       }
//       if (!schoolContext || !schoolContext.label || String(schoolContext.label).trim() === "") {
//         newErrors.school = "This field is required.";
//       }
//     } else {
//       // UPDATE mode: if all of districtContext/blockContext/schoolContext are empty BUT the existing studentData
//       // ALSO has none of the school fields filled, we will NOT throw validation error (user may keep them empty).
//       // So do nothing here (skip adding errors in update mode).
//       // This preserves the user's request: "if studentData's school fields are empty, don't show validation error on update".
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // -----------------------
//   // Submit handler
//   // -----------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();


// const slipId = name.slice(0, 3).toUpperCase() + srn.slice(-5);

// const registrationDate =  new Date();

//     setAlert(null);
//     setLoading(true);

//     try {
//       // client validation
//       const ok = validateAll();
//       if (!ok) {
//         setAlert({ type: "danger", message: "Please fix the highlighted errors before submitting." });
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();

//       // Append transformed values: trimmed + uppercase as required

//       if (studentData){

        
//       if (studentData?.registrationDate === null || studentData?.registrationDate === ""
//         || studentData?.registrationDate === undefined
//       ){
//         formData.append("registrationDate", registrationDate);
//       } else {
//         formData.append("registrationDate", registrationDate);
//       }

//       } else {
//         formData.append("registrationDate", registrationDate);
//       }

       

   

//       if (userData
//        ) {
      

//          formData.append("isRegisteredBy", userData?.user._id);
//        } else {
//          formData.append("isRegisteredBy", "Self");
//        }

        
    

//       formData.append("slipId", trim(slipId));
//       formData.append("srn", trim(srn));
//       formData.append("name", toUpperTrim(name));
//       formData.append("father", toUpperTrim(father));
//       formData.append("mother", toUpperTrim(mother));
//       formData.append("dob", trim(dob));
//       formData.append("gender", trim(gender).toUpperCase());
//       formData.append("category", trim(category).toUpperCase());
//       formData.append("aadhar", trim(aadhar));
//       formData.append("mobile", trim(mobile));
//       formData.append("whatsapp", trim(whatsapp));

//       // Personal address (alpha numeric fields uppercase)
//       formData.append("houseNumber", alphaNumUpper(houseNumber));
//       formData.append("cityTownVillage", alphaNumUpper(cityTownVillage));
//       formData.append("addressBlock", alphaNumUpper(addressBlock));
//       formData.append("addressDistrict", alphaNumUpper(addressDistrict));
//       formData.append("addressState", alphaNumUpper(addressState));

//       // School details using districtContext/blockContext/schoolContext if present
//       formData.append("schoolDistrict", toUpperTrim(districtContext?.label ?? schoolDistrict));
//       formData.append("schoolDistrictCode", trim(districtContext?.value ?? schoolDistrictCode));
//       formData.append("schoolBlock", toUpperTrim(blockContext?.label ?? schoolBlock));
//       formData.append("schoolBlockCode", trim(blockContext?.value ?? schoolBlockCode));
//       formData.append("school", toUpperTrim(schoolContext?.label ?? school));
//       formData.append("schoolCode", trim(schoolContext?.value ?? schoolCode));

//       // Additional fields
//       formData.append("previousClassAnnualExamPercentage", trim(previousClassAnnualExamPercentage));
//       formData.append("classOfStudent", trim(classOfStudent));

//       // Image file (prefer file from context, then local image state)
//       const fileFromContext = fileUploadData && fileUploadData[0] && fileUploadData[0].file;
//       const fileToAppend = fileFromContext || image;
//       if (fileToAppend) {
//         formData.append("image", fileToAppend);
//       }

//       // imageUrl (if existing) — server will typically ignore and use uploaded file if provided
//       if (imageUrl) formData.append("imageUrl", imageUrl);

//       let response;
//       if (studentData && studentData._id) {
//         // For update, include the student's id (server should accept multipart/form-data update)
//         formData.append("_id", studentData._id);
//         response = await updateStudent(formData);
       
//            console.log(response?.updatedStudent)

//         setStudentData(response?.updatedStudent)
//       } else {
//         response = await createStudent(formData);

//         console.log(response?.data)

//         setStudentData(response?.data)
        
//       }

//       // Expect that your service returns a sensible response object. Show success.
//       // Per request, show the specific message after submit/update
//       setAlert({ type: "success", message: "form submitted or updated successfully" });

//       // Clear all fields right after successful submit/update
//       setSrn("");
//       setName("");
//       setFather("");
//       setMother("");
//       setDob("");
//       setGender("");
//       setCategory("");
//       setAadhar("");
//       setMobile("");
//       setWhatsapp("");

//       setHouseNumber("");
//       setCityTownVillage("");
//       setAddressBlock("");
//       setAddressDistrict("");
//       setAddressState("");

//       setSchoolDistrict("");
//       setSchoolDistrictCode("");
//       setSchoolBlock("");
//       setSchoolBlockCode("");
//       setSchool("");
//       setSchoolCode("");

//       setPreviousClassAnnualExamPercentage("");
//       setClassOfStudent("");

//       setImage(null);
//       setImageUrl("");

//       // reset loaded student reference so future edits seed correctly
//       loadedStudentIdRef.current = null;

//       // clear contexts where appropriate
//       try {
//         // if (setStudentData) setStudentData(null);
//       } catch (err) {
//         // ignore
//       }
//       try {
//         if (setFileUploadData) setFileUploadData([]);
//       } catch (err) {
//         // ignore
//       }

//       // Optionally update StudentContext with returned student (if you still want to keep it)..
//       //...This will help in generating acknowledgement slip.
//       if (response?.data) {
//       console.log("hi")
//         setStudentData(response.data);
//         loadedStudentIdRef.current = response.data._id || loadedStudentIdRef.current;



//         //Handling for user and self case
//         if(userData){
          
//           setStudentData({})

//           if (location.pathname === "/user-registration-form-mb"){

//             navigate('/user-student-signin-mb')
//           } else if (location.pathname === "/user-registration-form-s100"){

//             navigate('/user-student-signin-s100')
//           } else if (location.pathname === "/exam-registration-form-mb"){
//                navigate('/exam-acknowledgement-slip-mb')

//           } else if (location.pathname === "/exam-registration-form-s100"){
//               navigate('/exam-acknowledgement-slip-s100')

//           }
         
          
//         } else{
//           if (location.pathname === "/exam-registration-form-mb"){
//               navigate('/exam-acknowledgement-slip-mb')


//           } else if (location.pathname === "/exam-registration-form-s100"){
//               navigate('/exam-acknowledgement-slip-s100')

//           }
//         }
        
//       } else{console.log("jelllo")
//         console.log(studentData)
//     //Handling for user and self case
//         if(userData){
//  setStudentData({})

//           if (location.pathname === "/user-registration-form-mb"){

//             navigate('/user-student-signin-mb')
//           } else if (location.pathname === "/user-registration-form-s100"){

//             navigate('/user-student-signin-s100')
//           } 
          
//           // else if (location.pathname === "/exam-registration-form-mb"){
//           //      navigate('/exam-acknowledgement-slip-mb')

//           // } else if (location.pathname === "/exam-registration-form-s100"){
//           //     navigate('/exam-acknowledgement-slip-s100')

//           // }
//         } else{
//          if (location.pathname === "/exam-registration-form-mb"){
//               navigate('/exam-acknowledgement-slip-mb')


//           } else if (location.pathname === "/exam-registration-form-s100"){
//               navigate('/exam-acknowledgement-slip-s100')

//           }
      
//         }
    
//       }

      
   


//     } catch (err) {
//       console.error("Submit error:", err);
//       // if axios error, try to extract message
//       const msg = err?.response?.data?.message || err?.message || "Something went wrong.";
//       setAlert({ type: "danger", message: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Small helper to show image preview (existing remote url or blob url)
//   const renderImagePreview = () => {
//     if (!imageUrl) return null;
//     return (
//       <div style={{ marginBottom: 12 }}>
//         <div style={{ fontSize: 12, marginBottom: 6 }}>Image preview:</div>
//         <img src={imageUrl} alt="preview" style={{ maxWidth: 160, maxHeight: 160, objectFit: "cover" }} />
//       </div>
//     );
//   };

//   // Layout: split into sections with cards & grid
//   return (
//     <Container fluid className="py-3">
//       {alert && (
//         <Alert variant={alert.type === "danger" ? "danger" : "success"} onClose={() => setAlert(null)} dismissible>
//           {alert.message}
//         </Alert>
//       )}

//       <Form onSubmit={handleSubmit} noValidate>
//         {/* SRN top bar */}
//         <Card className="mb-3">
//           <Card.Body>
//             <Form.Group controlId="formSrn">
//               <Form.Label><strong>SRN (एस.आर.एन.) :</strong></Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="SRN (एस.आर.एन.)"
//                 value={srn}
//                 onChange={handleSrnChange}
//                 isInvalid={!!errors.srn}
//               />
//               <Form.Control.Feedback type="invalid">{errors.srn}</Form.Control.Feedback>
//             </Form.Group>
//           </Card.Body>
//         </Card>

//         <Row>
//           {/* Left column: Personal Details */}
//           <Col lg={7}>
//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700, fontSize:'25px' }}>
//                 Personal Details (व्यक्तिगत विवरण)
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formName">
//                       <Form.Label>Student Name (विद्यार्थी का नाम) :</Form.Label> 
//                       <br></br>
//                       <small>(स्कूल में पंजीकृत नाम दर्ज करें)</small>
//                       <Form.Control
//                         type="text"
//                         placeholder="Student Name (विद्यार्थी का नाम)"
//                         value={name}
//                         onChange={handleNameChange(setName)}
//                         isInvalid={!!errors.name}
//                       />
//                       <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formFather">
//                       <Form.Label>Father's Name (पिता का नाम) :</Form.Label>
//                       <br></br>
//                       <small>(Mr/श्री का प्रयोग न करें)</small>
//                       <Form.Control
//                         type="text"
//                         placeholder="Father's Name (पिता का नाम)"
//                         value={father}
//                         onChange={handleNameChange(setFather)}
//                         isInvalid={!!errors.father}
//                       />
//                       <Form.Control.Feedback type="invalid">{errors.father}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formMother">
//                       <Form.Label>Mother's Name (माता का नाम) :</Form.Label>
//                       <br></br>
//                       <small>(Mrs/श्रीमती का प्रयोग न करें)</small>
//                       <Form.Control
//                         type="text"
//                         placeholder="Mother's Name (माता का नाम)"
//                         value={mother}
//                         onChange={handleNameChange(setMother)}
//                         isInvalid={!!errors.mother}
//                       />
//                       <Form.Control.Feedback type="invalid">{errors.mother}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   {/* <Col md={12} className="mb-3">
//                     <Form.Group controlId="formClassOfStudent">
//                       <Form.Label>Class (कक्षा) :</Form.Label>
//                       <Select
//                         value={mapToOption(classOfStudent, classOptions)}
//                         options={classOptions}
//                         onChange={(opt) => {
//                           setClassOfStudent(opt ? opt.value : "");
//                           setErrors((p) => ({ ...p, classOfStudent: null }));
//                         }}
//                       />
//                       {errors.classOfStudent && <div className="text-danger small mt-1">{errors.classOfStudent}</div>}
//                     </Form.Group>
//                   </Col> */}

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formDob">
//                       <Form.Label>D.O.B (जन्म तिथि) :</Form.Label>
//                       <Form.Control type="date" value={dob} onChange={(e) => { setDob(e.target.value); setErrors((p) => ({ ...p, dob: null })); }} isInvalid={!!errors.dob} />
//                       <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formGender">
//                       <Form.Label>Gender (लिंग) :</Form.Label>
//                       <Select
//                         value={mapToOption(gender, genderOptions)}
//                         options={genderOptions}
//                         onChange={(opt) => { setGender(opt ? opt.value : ""); setErrors((p) => ({ ...p, gender: null })); }}
//                       />
//                       {errors.gender && <div className="text-danger small mt-1">{errors.gender}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formCategory">
//                       <Form.Label>Category (वर्ग) :</Form.Label>
//                       <Select
//                         value={mapToOption(category, categoryOptions)}
//                         options={categoryOptions}
//                         onChange={(opt) => { setCategory(opt ? opt.value : ""); setErrors((p) => ({ ...p, category: null })); }}
//                       />
//                       {errors.category && <div className="text-danger small mt-1">{errors.category}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formAadhar">
//                       <Form.Label>Aadhar Number (आधार संख्या) :</Form.Label>
//                       <Form.Control type="text" placeholder="Aadhar Number (आधार संख्या)" value={aadhar} onChange={handleAadharChange} isInvalid={!!errors.aadhar} />
//                       <Form.Control.Feedback type="invalid">{errors.aadhar}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Address Details
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formHouseNumber">
//                       <Form.Label>H. No (मकान नंबर) :</Form.Label>
//                       <br></br>
//                       <small>Optional. (वैकल्पिक)</small>
//                       <Form.Control type="text" placeholder="H. No" value={houseNumber} onChange={handleAddressChangeUpper(setHouseNumber)} isInvalid={!!errors.houseNumber} />
//                       <Form.Control.Feedback type="invalid">{errors.houseNumber}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={8} className="mb-3">
//                     <Form.Group controlId="formCityTownVillage">
//                       <Form.Label>City/Town/Village :</Form.Label>
//                       <Form.Control type="text" placeholder="City/Town/Village" value={cityTownVillage} onChange={handleAddressChangeUpper(setCityTownVillage)} isInvalid={!!errors.cityTownVillage} />
//                       <Form.Control.Feedback type="invalid">{errors.cityTownVillage}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formAddressBlock">
//                       <Form.Label>Block (ब्लॉक) :</Form.Label>
//                       <Form.Control type="text" placeholder="Block" value={addressBlock} onChange={handleAddressChangeUpper(setAddressBlock)} isInvalid={!!errors.addressBlock} />
//                       <Form.Control.Feedback type="invalid">{errors.addressBlock}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formAddressDistrict">
//                       <Form.Label>District (ज़िला) :</Form.Label>
//                       <Form.Control type="text" placeholder="District" value={addressDistrict} onChange={handleAddressChangeUpper(setAddressDistrict)} isInvalid={!!errors.addressDistrict} />
//                       <Form.Control.Feedback type="invalid">{errors.addressDistrict}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formAddressState">
//                       <Form.Label>State (राज्य) :</Form.Label>
//                       <Form.Control type="text" placeholder="State" value={addressState} onChange={handleAddressChangeUpper(setAddressState)} isInvalid={!!errors.addressState} />
//                       <Form.Control.Feedback type="invalid">{errors.addressState}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>

//           {/* Right column: Contact & Academic */}
//           <Col lg={5}>
//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Contact Details (संपर्क विवरण)
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formMobile">
//                       <Form.Label>Mobile Number (मोबाइल नंबर) :</Form.Label>
//                       <Form.Control type="text" placeholder="Mobile Number" value={mobile} onChange={handleMobileChange(setMobile)} isInvalid={!!errors.mobile} />
//                       <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formWhatsapp">
//                       <Form.Label>Whatsapp Number (व्हाट्सएप नंबर) :</Form.Label>
//                       <br></br>
//                       <small>(केवल अपने माता या पिता का मोबाइल नंबर भरें)</small>
//                       <Form.Control type="text" placeholder="Whatsapp Number" value={whatsapp} onChange={handleMobileChange(setWhatsapp)} isInvalid={!!errors.whatsapp} />
//                       <Form.Control.Feedback type="invalid">{errors.whatsapp}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Academic Details (शैक्षिक विवरण)
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formDistrictSchoolDropdown">
                   
//                       <District_block_school_manual_school_name_dependentDropdown />
//                       {/* validation messages */}
//                       {errors.schoolDistrict && <div className="text-danger small mt-1">{errors.schoolDistrict}</div>}
//                       {errors.schoolBlock && <div className="text-danger small mt-1">{errors.schoolBlock}</div>}
//                       {errors.school && <div className="text-danger small mt-1">{errors.school}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formPrevClassPercent">
//                       <Form.Label>Class 7th Annual Examination Per% :</Form.Label>
//                       <Form.Control type="text" placeholder="Enter Percentage" value={previousClassAnnualExamPercentage} onChange={handlePrevPercentChange} isInvalid={!!errors.previousClassAnnualExamPercentage} />
//                       <Form.Control.Feedback type="invalid">{errors.previousClassAnnualExamPercentage}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formClassSelect">
//                       <Form.Label>Class of Student :</Form.Label>
//                       <Select
//                         value={mapToOption(classOfStudent, classOptions)}
//                         options={classOptions}
//                         onChange={(opt) => { setClassOfStudent(opt ? opt.value : ""); setErrors((p) => ({ ...p, classOfStudent: null })); }}
//                       />
//                       {errors.classOfStudent && <div className="text-danger small mt-1">{errors.classOfStudent}</div>}
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Upload Your Passport Size Photo (अपनी पासपोर्ट साइज फोटो अपलोड करें)
//               </Card.Header>
//               <Card.Body>
//                 {renderImagePreview()}
//                 <FileUpload />
           
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         <Row>
//           <Col lg={12}>

//             <Card className="mb-3">

//               <Card.Body>
//                 <Button style={{width:'100%'}} variant="primary" type="submit" disabled={loading}>
//                   {loading ? <><Spinner animation="border" size="sm" /> Saving...</> : (studentData && studentData._id ? "Update Student" : "Register")}
//                 </Button>

//               </Card.Body>
//               <CardFooter>
//                         Note / नोट: Submitting incorrect details may lead to form rejection. (गलत जानकारी देने पर फॉर्म अस्वीकार हो सकता है)
//               </CardFooter>
//             </Card>
//           </Col>

          

//         </Row>

//         <div className="text-end mt-2">
          
//         </div>
//       </Form>
//     </Container>
//   );
// };




















// import React, { useContext, useState, useEffect, useRef } from "react";
// import {
//   Container,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Card,
//   Row,
//   Col,
//   CardFooter,
// } from "react-bootstrap";
// import Select from "react-select";
// import imageCompression from "browser-image-compression";
// import axios from "axios";
// import { createStudent, updateStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";
// import { FileUploadContext, StudentContext } from "../NewContextApis/StudentContextApi.js";
// import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
// import { FileUpload } from "../utils/fileUploadUtils.jsx";
// import { UserContext } from "../NewContextApis/UserContext.js";
// import {
//   DistrictBlockSchoolDependentDropDownContext,
// } from "../NewContextApis/District_block_schoolsCotextApi.js";
// import { AcknowledgementSlipComponent } from "./AcknowledgementSlip.jsx";


// import { useLocation, useNavigate } from "react-router-dom";

// export const StudentRegistrationForm = () => {


//   const navigate = useNavigate();
//  const location = useLocation();
 

//  console.log(location.pathname)
//  //----------------------------------------

//   // Contexts
//   const { studentData, setStudentData } = useContext(StudentContext);
//   const { userData } = useContext(UserContext);
//   const { fileUploadData, setFileUploadData } = useContext(FileUploadContext);
//   // const context = useContext(DistrictBlockSchoolDependentDropDownContext);


//     const context = useContext(DistrictBlockSchoolDependentDropDownContext);
//     const {
//       districtContext,
//       setDistrictContext,
//       blockContext,
//       setBlockContext,
//       schoolContext,
//       setSchoolContext,
//     } = context || {};
  
// //------------------------------------------------
//   // Local controlled state (all fields)
//   const [srn, setSrn] = useState("");
//   const [name, setName] = useState("");
//   const [father, setFather] = useState("");
//   const [mother, setMother] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");
//   const [category, setCategory] = useState("");
//   const [aadhar, setAadhar] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [whatsapp, setWhatsapp] = useState("");

//   const [houseNumber, setHouseNumber] = useState("");
//   const [cityTownVillage, setCityTownVillage] = useState("");
//   const [addressBlock, setAddressBlock] = useState("");
//   const [addressDistrict, setAddressDistrict] = useState("");
//   const [addressState, setAddressState] = useState("");

//   const [schoolDistrict, setSchoolDistrict] = useState("");
//   const [schoolDistrictCode, setSchoolDistrictCode] = useState("");
//   const [schoolBlock, setSchoolBlock] = useState("");
//   const [schoolBlockCode, setSchoolBlockCode] = useState("");
//   const [school, setSchool] = useState("");
//   const [schoolCode, setSchoolCode] = useState("");

//   const [previousClassAnnualExamPercentage, setPreviousClassAnnualExamPercentage] = useState("");
//   const [classOfStudent, setClassOfStudent] = useState("");

//   const [image, setImage] = useState(null); // File
//   const [imageUrl, setImageUrl] = useState(""); // preview / existing url

//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);

//   // validation state
//   const [errors, setErrors] = useState({});

//   // Keep a ref of the currently loaded student _id to avoid overwriting local edits unintentionally
//   const loadedStudentIdRef = useRef(null);



//   //Dunamically setting the state of classOfStudent if form is of class 8 or 10th
//  useEffect(() => {
//   if (location.pathname === "/user-registration-form-mb" && classOfStudent !== "8") {
//     setClassOfStudent("8");
//   } else if (location.pathname === "/user-registration-form-s100" && classOfStudent !== "10") {
//     setClassOfStudent("10");
//   } else if (location.pathname === "/exam-registration-form-mb" && classOfStudent !== "8"){
//     setClassOfStudent("8");
//   } else if ((location.pathname === "/exam-registration-form-s100" && classOfStudent !== "10")){
//     setClassOfStudent("8");
//   }
// }, [location.pathname, classOfStudent, setClassOfStudent]);



//   // Options for react-select
//   const genderOptions = [
//     { value: "Male", label: "Male" },
//     { value: "Female", label: "Female" },
//   ];

//   const categoryOptions = [
//     { value: "BCA", label: "BCA" },
//     { value: "GEN", label: "GEN" },
//     { value: "SC", label: "SC" },
//     { value: "ST", label: "ST" },
//     { value: "OBC", label: "OBC" },
//   ];

//   const classOptions = [
//     { value: "8", label: "8" },
//     { value: "10", label: "10" },
//   ];

//   // -----------------------
//   // Sanitizers & validators
//   // -----------------------
//   const trim = (s) => (typeof s === "string" ? s.trim() : s);
//   const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();

//   // only digits, limited length
//   const onlyDigits = (value, maxLen = 10) => {
//     const digits = String(value || "").replace(/\D+/g, "").slice(0, maxLen);
//     return digits;
//   };

//   // only alphabets and spaces (for names). We will allow only A-Z and space.
//   const onlyAlphaSpace = (value) => {
//     const v = String(value || "");
//     // allow letters and spaces, remove other chars
//     const cleaned = v.replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
//     return cleaned;
//   };

//   // alphanumeric uppercase and trimmed (for address fields)
//   const alphaNumUpper = (value, maxLen = 100) => {
//     const v = String(value || "");
//     // allow letters, numbers and spaces and some punctuation if needed (here keep alnum + space + -/), then uppercase
//     const cleaned = v.replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen);
//     return cleaned.trim().toUpperCase();
//   };

//   // previous class percent: allow up to 3 digits or decimals upto 2 places
//   const sanitizePercentage = (value) => {
//     const v = String(value || "").trim();
//     // remove invalid chars except digits and dot
//     const cleaned = v.replace(/[^0-9.]/g, "");
//     // enforce single dot
//     const parts = cleaned.split(".");
//     if (parts.length <= 1) return parts[0].slice(0, 3);
//     const integer = parts[0].slice(0, 3);
//     const decimal = parts[1].slice(0, 2);
//     return `${integer}.${decimal}`;
//   };

//   // mapToOption helper for react-select
//   const mapToOption = (value, options) => {
//     if (!value) return null;
//     return options.find((o) => String(o.value) === String(value)) || null;
//   };

//   // -----------------------
//   // Seed local state from studentData
//   // -----------------------
//   useEffect(() => {
//     if (!studentData) {
//       // if clearing the form, reset ref and local state
//       loadedStudentIdRef.current = null;
//       return;
//     }

//     // Only seed when the incoming studentData._id differs from currently loaded one
//     if (studentData._id && loadedStudentIdRef.current !== studentData._id) {
//       loadedStudentIdRef.current = studentData._id;

//       setSrn(studentData.srn ?? "");
//       setName(studentData.name ?? "");
//       setFather(studentData.father ?? "");
//       setMother(studentData.mother ?? "");
//       setDob(studentData.dob ? new Date(studentData.dob).toISOString().split("T")[0] : "");
//       setGender(studentData.gender ?? "");
//       setCategory(studentData.category ?? "");
//       setAadhar(studentData.aadhar ?? "");
//       setMobile(studentData.mobile ?? "");
//       setWhatsapp(studentData.whatsapp ?? "");

//       setHouseNumber(studentData.houseNumber ?? "");
//       setCityTownVillage(studentData.cityTownVillage ?? "");
//       setAddressBlock(studentData.addressBlock ?? "");
//       setAddressDistrict(studentData.addressDistrict ?? "");
//       setAddressState(studentData.addressState ?? "");

//       setSchoolDistrict(studentData.schoolDistrict ?? "");
//       setSchoolDistrictCode(studentData.schoolDistrictCode ?? "");
//       setSchoolBlock(studentData.schoolBlock ?? "");
//       setSchoolBlockCode(studentData.schoolBlockCode ?? "");
//       setSchool(studentData.school ?? "");
//       setSchoolCode(studentData.schoolCode ?? "");

//       setPreviousClassAnnualExamPercentage(studentData.previousClassAnnualExamPercentage ?? "");
//       setClassOfStudent(studentData.classOfStudent ?? "");

//       // image fields
//       setImage(null); // don't try to set File object for security; user can re-upload
//       setImageUrl(studentData.imageUrl ?? "");
//     }
//   }, [studentData]);

//   // React to FileUploadContext changes (if FileUpload component writes file there)
//   useEffect(() => {
//     const fileFromContext = fileUploadData && fileUploadData[0] && fileUploadData[0].file;
//     if (fileFromContext) {
//       setImage(fileFromContext);
//       // create local preview URL for immediate display
//       try {
//         const previewUrl = URL.createObjectURL(fileFromContext);
//         setImageUrl(previewUrl);
//         // revoke on cleanup: optional - we won't manage this here because user may navigate away
//       } catch (err) {
//         // ignore
//       }
//     }
//   }, [fileUploadData]);

//   // -----------------------
//   // Input change handlers with sanitization
//   // -----------------------
//   const handleSrnChange = (e) => {
//     setSrn(onlyDigits(e.target.value, 10));
//     setErrors((p) => ({ ...p, srn: null }));
//   };

//   const handleAadharChange = (e) => {
//     // allow digits only (aadhar unique), not enforced length here but we will validate on submit
//     setAadhar(onlyDigits(e.target.value, 20));
//     setErrors((p) => ({ ...p, aadhar: null }));
//   };

//   const handleMobileChange = (setter) => (e) => {
//     setter(onlyDigits(e.target.value, 10));
//     setErrors((p) => ({ ...p, mobile: null, whatsapp: null }));
//   };

//   const handleNameChange = (setter) => (e) => {
//     setter(onlyAlphaSpace(e.target.value));
//     // clear specific error
//     setErrors((p) => ({ ...p, name: null, father: null, mother: null }));
//   };

//   const handleAddressChangeUpper = (setter) => (e) => {
//     setter(alphaNumUpper(e.target.value));
//   };

//   const handlePrevPercentChange = (e) => {
//     setPreviousClassAnnualExamPercentage(sanitizePercentage(e.target.value));
//   };

//   // -----------------------
//   // Validation function (returns boolean)
//   // -----------------------
//   const validateAll = () => {
//     const newErrors = {};

//     // required fields (everything except file upload)
//     const requiredFields = {
//       srn,
//       name,
//       father,
//       mother,
//       dob,
//       gender,
//       category,
//       aadhar,
//       mobile,
//       whatsapp,
//       cityTownVillage,
//       addressBlock,
//       addressDistrict,
//       addressState,
//       // Depending on create vs update: include school fields only for CREATE mode.
//       previousClassAnnualExamPercentage,
//       classOfStudent,
//     };

//     Object.entries(requiredFields).forEach(([k, v]) => {
//       if (v === undefined || v === null || String(v).trim() === "") {
//         newErrors[k] = "This field is required.";
//       }
//     });

//     // srn: exactly 10 digits
//     if (srn && !/^\d{10}$/.test(srn)) {
//       newErrors.srn = "SRN must be exactly 10 digits.";
//     }

//     // names: only alphabets and spaces & not empty
//     ["name", "father", "mother"].forEach((f) => {
//       const val = (f === "name" ? name : f === "father" ? father : mother) || "";
//       if (val && !/^[A-Za-z\s]+$/.test(val)) {
//         newErrors[f] = "Only alphabets and spaces allowed.";
//       }
//     });

//     // contact numbers 10 digits
//     if (mobile && !/^\d{10}$/.test(mobile)) {
//       newErrors.mobile = "Mobile must be 10 digits.";
//     }
//     if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
//       newErrors.whatsapp = "WhatsApp must be 10 digits.";
//     }

//     // aadhar basic check - digits (length may vary depending on your rule; enforce at least 8 here)
//     if (aadhar && !/^\d{8,20}$/.test(aadhar)) {
//       newErrors.aadhar = "Aadhar must be numeric (min 8 digits).";
//     }

//     // percentage validation: allow up to 3 digits or decimal upto 2 places
//     if (previousClassAnnualExamPercentage) {
//       if (!/^\d{1,3}(\.\d{1,2})?$/.test(previousClassAnnualExamPercentage)) {
//         newErrors.previousClassAnnualExamPercentage = "Enter a valid percent (up to 3 digits or up to 2 decimals).";
//       }
//     }

//     // House/City/Block/District: must be alphanumeric (we sanitized to uppercase already)
//     const alphaNumFields = {
//       cityTownVillage,
//       addressBlock,
//       addressDistrict,
//       addressState,
//     };
//     Object.entries(alphaNumFields).forEach(([k, v]) => {
//       if (v && !/^[A-Z0-9\s\-\/]+$/.test(v)) {
//         newErrors[k] = "Only alphanumeric characters, spaces, - or / are allowed (will be uppercased).";
//       }
//     });

//     // Explicit checks for dependent dropdown contexts: ensure districtContext, blockContext and schoolContext are present with label/value.
//     // If any are empty/null/blank, set the corresponding error key so the UI will show exactly that field as required.
//     // ---------- CHANGED BEHAVIOR ----------
//     // For update case (studentData && studentData._id) we will NOT require schoolDistrict / schoolBlock / school fields.
//     // For create case (no studentData._id) we require them via districtContext/blockContext/schoolContext presence.

//     const isUpdateMode = !!(studentData && studentData._id);

//     if (!isUpdateMode) {
//       // CREATE mode: enforce dropdowns
//       if (!districtContext || !districtContext.label || String(districtContext.label).trim() === "") {
//         newErrors.schoolDistrict = "This field is required.";
//       }
//       if (!blockContext || !blockContext.label || String(blockContext.label).trim() === "") {
//         newErrors.schoolBlock = "This field is required.";
//       }
//       if (!schoolContext || !schoolContext.label || String(schoolContext.label).trim() === "") {
//         newErrors.school = "This field is required.";
//       }
//     } else {
//       // UPDATE mode: if all of districtContext/blockContext/schoolContext are empty BUT the existing studentData
//       // ALSO has none of the school fields filled, we will NOT throw validation error (user may keep them empty).
//       // So do nothing here (skip adding errors in update mode).
//       // This preserves the user's request: "if studentData's school fields are empty, don't show validation error on update".
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // -----------------------
//   // Submit handler
//   // -----------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();


// const slipId = name.slice(0, 3).toUpperCase() + srn.slice(-5);

// const registrationDate =  new Date();

//     setAlert(null);
//     setLoading(true);

//     try {
//       // client validation
//       const ok = validateAll();
//       if (!ok) {
//         setAlert({ type: "danger", message: "Please fix the highlighted errors before submitting." });
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();

//       // Append transformed values: trimmed + uppercase as required

//       if (studentData){

        
//       if (studentData?.registrationDate === null || studentData?.registrationDate === ""
//         || studentData?.registrationDate === undefined
//       ){
//         formData.append("registrationDate", registrationDate);
//       } else {
//         formData.append("registrationDate", registrationDate);
//       }

//       } else {
//         formData.append("registrationDate", registrationDate);
//       }

       

   

//       if (userData
//        ) {
      

//          formData.append("isRegisteredBy", userData?.user._id);
//        } else {
//          formData.append("isRegisteredBy", "Self");
//        }

        
    

//       formData.append("slipId", trim(slipId));
//       formData.append("srn", trim(srn));
//       formData.append("name", toUpperTrim(name));
//       formData.append("father", toUpperTrim(father));
//       formData.append("mother", toUpperTrim(mother));
//       formData.append("dob", trim(dob));
//       formData.append("gender", trim(gender).toUpperCase());
//       formData.append("category", trim(category).toUpperCase());
//       formData.append("aadhar", trim(aadhar));
//       formData.append("mobile", trim(mobile));
//       formData.append("whatsapp", trim(whatsapp));

//       // Personal address (alpha numeric fields uppercase)
//       formData.append("houseNumber", alphaNumUpper(houseNumber));
//       formData.append("cityTownVillage", alphaNumUpper(cityTownVillage));
//       formData.append("addressBlock", alphaNumUpper(addressBlock));
//       formData.append("addressDistrict", alphaNumUpper(addressDistrict));
//       formData.append("addressState", alphaNumUpper(addressState));

//       // School details using districtContext/blockContext/schoolContext if present
//       formData.append("schoolDistrict", toUpperTrim(districtContext?.label ?? schoolDistrict));
//       formData.append("schoolDistrictCode", trim(districtContext?.value ?? schoolDistrictCode));
//       formData.append("schoolBlock", toUpperTrim(blockContext?.label ?? schoolBlock));
//       formData.append("schoolBlockCode", trim(blockContext?.value ?? schoolBlockCode));
//       formData.append("school", toUpperTrim(schoolContext?.label ?? school));
//       formData.append("schoolCode", trim(schoolContext?.value ?? schoolCode));

//       // Additional fields
//       formData.append("previousClassAnnualExamPercentage", trim(previousClassAnnualExamPercentage));
//       formData.append("classOfStudent", trim(classOfStudent));

//       // Image file (prefer file from context, then local image state)
//       const fileFromContext = fileUploadData && fileUploadData[0] && fileUploadData[0].file;
//       const fileToAppend = fileFromContext || image;
//       if (fileToAppend) {
//         formData.append("image", fileToAppend);
//       }

//       // imageUrl (if existing) — server will typically ignore and use uploaded file if provided
//       if (imageUrl) formData.append("imageUrl", imageUrl);

//       let response;
//       if (studentData && studentData._id) {
//         // For update, include the student's id (server should accept multipart/form-data update)
//         formData.append("_id", studentData._id);
//         response = await updateStudent(formData);
       
//            console.log(response?.updatedStudent)

//         setStudentData(response?.updatedStudent)
//       } else {
//         response = await createStudent(formData);

//         console.log(response?.data)

//         setStudentData(response?.data)
        
//       }

//       // Expect that your service returns a sensible response object. Show success.
//       // Per request, show the specific message after submit/update
//       setAlert({ type: "success", message: "form submitted or updated successfully" });

//       // Clear all fields right after successful submit/update
//       setSrn("");
//       setName("");
//       setFather("");
//       setMother("");
//       setDob("");
//       setGender("");
//       setCategory("");
//       setAadhar("");
//       setMobile("");
//       setWhatsapp("");

//       setHouseNumber("");
//       setCityTownVillage("");
//       setAddressBlock("");
//       setAddressDistrict("");
//       setAddressState("");

//       setSchoolDistrict("");
//       setSchoolDistrictCode("");
//       setSchoolBlock("");
//       setSchoolBlockCode("");
//       setSchool("");
//       setSchoolCode("");

//       setPreviousClassAnnualExamPercentage("");
//       setClassOfStudent("");

//       setImage(null);
//       setImageUrl("");

//       // reset loaded student reference so future edits seed correctly
//       loadedStudentIdRef.current = null;

//       // clear contexts where appropriate
//       try {
//         // if (setStudentData) setStudentData(null);
//       } catch (err) {
//         // ignore
//       }
//       try {
//         if (setFileUploadData) setFileUploadData([]);
//       } catch (err) {
//         // ignore
//       }

//       // Optionally update StudentContext with returned student (if you still want to keep it)..
//       //...This will help in generating acknowledgement slip.
//       if (response?.data) {
//       console.log("hi")
//         setStudentData(response.data);
//         loadedStudentIdRef.current = response.data._id || loadedStudentIdRef.current;



//         //Handling for user and self case
//         if(userData){
          
//           setStudentData({})
         
//           if (location.pathname === "/user-registration-form-mb" || 
//             location.pathname === "/user-registration-form-sh"
//           ) {
          
//              navigate(`/user-student-signin-${location.pathname.slice(-2)}`)
//           } 
          
//         } else{
          
//           if (location.pathname === "/exam-registration-form-mb" || 
//             location.pathname === "/exam-registration-form-sh"
//           ) {
          
//              navigate(`/exam-acknowledgement-slip-${location.pathname.slice(-2)}`)
//           } 
//         }
        
//       } else{console.log("jelllo")
//         console.log(studentData)
//     //Handling for user and self case
//         if(userData){
//         setStudentData({})

//           setStudentData({})
         
//           if (location.pathname === "/user-registration-form-mb" || 
//             location.pathname === "/user-registration-form-sh"
//           ) {
            
//              navigate(`/user-student-signin-${location.pathname.slice(-2)}`)
//           } 
          
//         } else{
         
//           if (location.pathname === "/exam-registration-form-mb" || 
//             location.pathname === "/exam-registration-form-sh"
//           ) {
          
//              navigate(`/exam-acknowledgement-slip-${location.pathname.slice(-2)}`)
//           } 
      
//         }
    
//       }

      
   


//     } catch (err) {
//       console.error("Submit error:", err);
//       // if axios error, try to extract message
//       const msg = err?.response?.data?.message || err?.message || "Something went wrong.";
//       setAlert({ type: "danger", message: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Small helper to show image preview (existing remote url or blob url)
//   const renderImagePreview = () => {
//     if (!imageUrl) return null;
//     return (
//       <div style={{ marginBottom: 12 }}>
//         <div style={{ fontSize: 12, marginBottom: 6 }}>Image preview:</div>
//         <img src={imageUrl} alt="preview" style={{ maxWidth: 160, maxHeight: 160, objectFit: "cover" }} />
//       </div>
//     );
//   };

//   // Layout: split into sections with cards & grid
//   return (
//     <Container fluid className="py-3">
//       {alert && (
//         <Alert variant={alert.type === "danger" ? "danger" : "success"} onClose={() => setAlert(null)} dismissible>
//           {alert.message}
//         </Alert>
//       )}

//       <Form onSubmit={handleSubmit} noValidate>
//         {/* SRN top bar */}
//         <Card className="mb-3">
//           <Card.Body>
//             <Form.Group controlId="formSrn">
//               <Form.Label><strong>SRN (एस.आर.एन.) :</strong></Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="SRN (एस.आर.एन.)"
//                 value={srn}
//                 onChange={handleSrnChange}
//                 isInvalid={!!errors.srn}
//               />
//               <Form.Control.Feedback type="invalid">{errors.srn}</Form.Control.Feedback>
//             </Form.Group>
//           </Card.Body>
//         </Card>

//         <Row>
//           {/* Left column: Personal Details */}
//           <Col lg={7}>
//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700, fontSize:'25px' }}>
//                 Personal Details (व्यक्तिगत विवरण)
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formName">
//                       <Form.Label>Student Name (विद्यार्थी का नाम) :</Form.Label> 
//                       <br></br>
//                       <small>(स्कूल में पंजीकृत नाम दर्ज करें)</small>
//                       <Form.Control
//                         type="text"
//                         placeholder="Student Name (विद्यार्थी का नाम)"
//                         value={name}
//                         onChange={handleNameChange(setName)}
//                         isInvalid={!!errors.name}
//                       />
//                       <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formFather">
//                       <Form.Label>Father's Name (पिता का नाम) :</Form.Label>
//                       <br></br>
//                       <small>(Mr/श्री का प्रयोग न करें)</small>
//                       <Form.Control
//                         type="text"
//                         placeholder="Father's Name (पिता का नाम)"
//                         value={father}
//                         onChange={handleNameChange(setFather)}
//                         isInvalid={!!errors.father}
//                       />
//                       <Form.Control.Feedback type="invalid">{errors.father}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formMother">
//                       <Form.Label>Mother's Name (माता का नाम) :</Form.Label>
//                       <br></br>
//                       <small>(Mrs/श्रीमती का प्रयोग न करें)</small>
//                       <Form.Control
//                         type="text"
//                         placeholder="Mother's Name (माता का नाम)"
//                         value={mother}
//                         onChange={handleNameChange(setMother)}
//                         isInvalid={!!errors.mother}
//                       />
//                       <Form.Control.Feedback type="invalid">{errors.mother}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   {/* <Col md={12} className="mb-3">
//                     <Form.Group controlId="formClassOfStudent">
//                       <Form.Label>Class (कक्षा) :</Form.Label>
//                       <Select
//                         value={mapToOption(classOfStudent, classOptions)}
//                         options={classOptions}
//                         onChange={(opt) => {
//                           setClassOfStudent(opt ? opt.value : "");
//                           setErrors((p) => ({ ...p, classOfStudent: null }));
//                         }}
//                       />
//                       {errors.classOfStudent && <div className="text-danger small mt-1">{errors.classOfStudent}</div>}
//                     </Form.Group>
//                   </Col> */}

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formDob">
//                       <Form.Label>D.O.B (जन्म तिथि) :</Form.Label>
//                       <Form.Control type="date" value={dob} onChange={(e) => { setDob(e.target.value); setErrors((p) => ({ ...p, dob: null })); }} isInvalid={!!errors.dob} />
//                       <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formGender">
//                       <Form.Label>Gender (लिंग) :</Form.Label>
//                       <Select
//                         value={mapToOption(gender, genderOptions)}
//                         options={genderOptions}
//                         onChange={(opt) => { setGender(opt ? opt.value : ""); setErrors((p) => ({ ...p, gender: null })); }}
//                       />
//                       {errors.gender && <div className="text-danger small mt-1">{errors.gender}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formCategory">
//                       <Form.Label>Category (वर्ग) :</Form.Label>
//                       <Select
//                         value={mapToOption(category, categoryOptions)}
//                         options={categoryOptions}
//                         onChange={(opt) => { setCategory(opt ? opt.value : ""); setErrors((p) => ({ ...p, category: null })); }}
//                       />
//                       {errors.category && <div className="text-danger small mt-1">{errors.category}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formAadhar">
//                       <Form.Label>Aadhar Number (आधार संख्या) :</Form.Label>
//                       <Form.Control type="text" placeholder="Aadhar Number (आधार संख्या)" value={aadhar} onChange={handleAadharChange} isInvalid={!!errors.aadhar} />
//                       <Form.Control.Feedback type="invalid">{errors.aadhar}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Address Details
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formHouseNumber">
//                       <Form.Label>H. No (मकान नंबर) :</Form.Label>
//                       <br></br>
//                       <small>Optional. (वैकल्पिक)</small>
//                       <Form.Control type="text" placeholder="H. No" value={houseNumber} onChange={handleAddressChangeUpper(setHouseNumber)} isInvalid={!!errors.houseNumber} />
//                       <Form.Control.Feedback type="invalid">{errors.houseNumber}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={8} className="mb-3">
//                     <Form.Group controlId="formCityTownVillage">
//                       <Form.Label>City/Town/Village :</Form.Label>
//                       <Form.Control type="text" placeholder="City/Town/Village" value={cityTownVillage} onChange={handleAddressChangeUpper(setCityTownVillage)} isInvalid={!!errors.cityTownVillage} />
//                       <Form.Control.Feedback type="invalid">{errors.cityTownVillage}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formAddressBlock">
//                       <Form.Label>Block (ब्लॉक) :</Form.Label>
//                       <Form.Control type="text" placeholder="Block" value={addressBlock} onChange={handleAddressChangeUpper(setAddressBlock)} isInvalid={!!errors.addressBlock} />
//                       <Form.Control.Feedback type="invalid">{errors.addressBlock}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formAddressDistrict">
//                       <Form.Label>District (ज़िला) :</Form.Label>
//                       <Form.Control type="text" placeholder="District" value={addressDistrict} onChange={handleAddressChangeUpper(setAddressDistrict)} isInvalid={!!errors.addressDistrict} />
//                       <Form.Control.Feedback type="invalid">{errors.addressDistrict}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formAddressState">
//                       <Form.Label>State (राज्य) :</Form.Label>
//                       <Form.Control type="text" placeholder="State" value={addressState} onChange={handleAddressChangeUpper(setAddressState)} isInvalid={!!errors.addressState} />
//                       <Form.Control.Feedback type="invalid">{errors.addressState}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>

//           {/* Right column: Contact & Academic */}
//           <Col lg={5}>
//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Contact Details (संपर्क विवरण)
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formMobile">
//                       <Form.Label>Mobile Number (मोबाइल नंबर) :</Form.Label>
//                       <Form.Control type="text" placeholder="Mobile Number" value={mobile} onChange={handleMobileChange(setMobile)} isInvalid={!!errors.mobile} />
//                       <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formWhatsapp">
//                       <Form.Label>Whatsapp Number (व्हाट्सएप नंबर) :</Form.Label>
//                       <br></br>
//                       <small>(केवल अपने माता या पिता का मोबाइल नंबर भरें)</small>
//                       <Form.Control type="text" placeholder="Whatsapp Number" value={whatsapp} onChange={handleMobileChange(setWhatsapp)} isInvalid={!!errors.whatsapp} />
//                       <Form.Control.Feedback type="invalid">{errors.whatsapp}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Academic Details (शैक्षिक विवरण)
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formDistrictSchoolDropdown">
                   
//                       <District_block_school_manual_school_name_dependentDropdown />
//                       {/* validation messages */}
//                       {errors.schoolDistrict && <div className="text-danger small mt-1">{errors.schoolDistrict}</div>}
//                       {errors.schoolBlock && <div className="text-danger small mt-1">{errors.schoolBlock}</div>}
//                       {errors.school && <div className="text-danger small mt-1">{errors.school}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formPrevClassPercent">
//                       <Form.Label>Class 7th Annual Examination Per% :</Form.Label>
//                       <Form.Control type="text" placeholder="Enter Percentage" value={previousClassAnnualExamPercentage} onChange={handlePrevPercentChange} isInvalid={!!errors.previousClassAnnualExamPercentage} />
//                       <Form.Control.Feedback type="invalid">{errors.previousClassAnnualExamPercentage}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formClassSelect">
//                       <Form.Label>Class of Student :</Form.Label>
//                       <Select
//                         value={mapToOption(classOfStudent, classOptions)}
//                         options={classOptions}
//                         onChange={(opt) => { setClassOfStudent(opt ? opt.value : ""); setErrors((p) => ({ ...p, classOfStudent: null })); }}
//                       />
//                       {errors.classOfStudent && <div className="text-danger small mt-1">{errors.classOfStudent}</div>}
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Upload Your Passport Size Photo (अपनी पासपोर्ट साइज फोटो अपलोड करें)
//               </Card.Header>
//               <Card.Body>
//                 {renderImagePreview()}
//                 <FileUpload />
           
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         <Row>
//           <Col lg={12}>

//             <Card className="mb-3">

//               <Card.Body>
//                 <Button style={{width:'100%'}} variant="primary" type="submit" disabled={loading}>
//                   {loading ? <><Spinner animation="border" size="sm" /> Saving...</> : (studentData && studentData._id ? "Update Student" : "Register")}
//                 </Button>

//               </Card.Body>
//               <CardFooter>
//                         Note / नोट: Submitting incorrect details may lead to form rejection. (गलत जानकारी देने पर फॉर्म अस्वीकार हो सकता है)
//               </CardFooter>
//             </Card>
//           </Col>

          

//         </Row>

//         <div className="text-end mt-2">
          
//         </div>
//       </Form>
//     </Container>
//   );
// };












// import React, { useContext, useState, useEffect, useRef } from "react";
// import {
//   Container,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Card,
//   Row,
//   Col,
//   CardFooter,
// } from "react-bootstrap";
// import Select from "react-select";
// import imageCompression from "browser-image-compression";
// import axios from "axios";
// import { createStudent, updateStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";
// import { FileUploadContext, StudentContext } from "../NewContextApis/StudentContextApi.js";
// import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
// import { FileUpload } from "../utils/fileUploadUtils.jsx";
// import { UserContext } from "../NewContextApis/UserContext.js";
// import {
//   DistrictBlockSchoolDependentDropDownContext,
// } from "../NewContextApis/District_block_schoolsCotextApi.js";
// import { AcknowledgementSlipComponent } from "./AcknowledgementSlip.jsx";


// import { useLocation, useNavigate } from "react-router-dom";

// export const StudentRegistrationForm = () => {


//   const navigate = useNavigate();
//  const location = useLocation();
 

//  console.log(location.pathname)
//  //----------------------------------------

//   // Contexts
//   const { studentData, setStudentData } = useContext(StudentContext);
//   const { userData } = useContext(UserContext);
//   const { fileUploadData, setFileUploadData } = useContext(FileUploadContext);
//   // const context = useContext(DistrictBlockSchoolDependentDropDownContext);


//     const context = useContext(DistrictBlockSchoolDependentDropDownContext);
//     const {
//       districtContext,
//       setDistrictContext,
//       blockContext,
//       setBlockContext,
//       schoolContext,
//       setSchoolContext,
//     } = context || {};
  
// //------------------------------------------------
//   // Local controlled state (all fields)
//   const [srn, setSrn] = useState("");
//   const [name, setName] = useState("");
//   const [father, setFather] = useState("");
//   const [mother, setMother] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");
//   const [category, setCategory] = useState("");
//   const [aadhar, setAadhar] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [whatsapp, setWhatsapp] = useState("");

//   const [houseNumber, setHouseNumber] = useState("");
//   const [cityTownVillage, setCityTownVillage] = useState("");
//   const [addressBlock, setAddressBlock] = useState("");
//   const [addressDistrict, setAddressDistrict] = useState("");
//   const [addressState, setAddressState] = useState("");

//   const [schoolDistrict, setSchoolDistrict] = useState("");
//   const [schoolDistrictCode, setSchoolDistrictCode] = useState("");
//   const [schoolBlock, setSchoolBlock] = useState("");
//   const [schoolBlockCode, setSchoolBlockCode] = useState("");
//   const [school, setSchool] = useState("");
//   const [schoolCode, setSchoolCode] = useState("");

//   const [previousClassAnnualExamPercentage, setPreviousClassAnnualExamPercentage] = useState("");
//   const [classOfStudent, setClassOfStudent] = useState("");

//   const [image, setImage] = useState(null); // File
//   const [imageUrl, setImageUrl] = useState(""); // preview / existing url

//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);

//   // validation state
//   const [errors, setErrors] = useState({});

//   // Keep a ref of the currently loaded student _id to avoid overwriting local edits unintentionally
//   const loadedStudentIdRef = useRef(null);



//   //Dunamically setting the state of classOfStudent if form is of class 8 or 10th
//  useEffect(() => {
//   if (location.pathname === "/user-registration-form-mb" && classOfStudent !== "8") {
//     setClassOfStudent("8");
//   } else if (location.pathname === "/user-registration-form-s100" && classOfStudent !== "10") {
//     setClassOfStudent("10");
//   } else if (location.pathname === "/exam-registration-form-mb" && classOfStudent !== "8"){
//     setClassOfStudent("8");
//   } else if ((location.pathname === "/exam-registration-form-s100" && classOfStudent !== "10")){
//     setClassOfStudent("10");
//   }
// }, [location.pathname, classOfStudent, setClassOfStudent]);



//   // Options for react-select
//   const genderOptions = [
//     { value: "Male", label: "Male" },
//     { value: "Female", label: "Female" },
//   ];

//   const categoryOptions = [
//     { value: "BCA", label: "BCA" },
//     { value: "GEN", label: "GEN" },
//     { value: "SC", label: "SC" },
//     { value: "ST", label: "ST" },
//     { value: "OBC", label: "OBC" },
//   ];

//   const classOptions = [
//     { value: "8", label: "8" },
//     { value: "10", label: "10" },
//   ];

//   // -----------------------
//   // Sanitizers & validators
//   // -----------------------
//   const trim = (s) => (typeof s === "string" ? s.trim() : s);
//   const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();

//   // only digits, limited length
//   const onlyDigits = (value, maxLen = 10) => {
//     const digits = String(value || "").replace(/\D+/g, "").slice(0, maxLen);
//     return digits;
//   };

//   // only alphabets and spaces (for names). We will allow only A-Z and space.
//   const onlyAlphaSpace = (value) => {
//     const v = String(value || "");
//     // allow letters and spaces, remove other chars
//     const cleaned = v.replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
//     return cleaned;
//   };

//   // alphanumeric uppercase and trimmed (for address fields)
//   const alphaNumUpper = (value, maxLen = 100) => {
//     const v = String(value || "");
//     // allow letters, numbers and spaces and some punctuation if needed (here keep alnum + space + -/), then uppercase
//     const cleaned = v.replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen);
//     return cleaned.trim().toUpperCase();
//   };

//   // previous class percent: allow up to 3 digits or decimals upto 2 places
//   const sanitizePercentage = (value) => {
//     const v = String(value || "").trim();
//     // remove invalid chars except digits and dot
//     const cleaned = v.replace(/[^0-9.]/g, "");
//     // enforce single dot
//     const parts = cleaned.split(".");
//     if (parts.length <= 1) return parts[0].slice(0, 3);
//     const integer = parts[0].slice(0, 3);
//     const decimal = parts[1].slice(0, 2);
//     return `${integer}.${decimal}`;
//   };

//   // mapToOption helper for react-select
//   const mapToOption = (value, options) => {
//     if (!value) return null;
//     return options.find((o) => String(o.value) === String(value)) || null;
//   };

//   // -----------------------
//   // Seed local state from studentData
//   // -----------------------
//   useEffect(() => {
//     if (!studentData) {
//       // if clearing the form, reset ref and local state
//       loadedStudentIdRef.current = null;
//       return;
//     }

//     // Only seed when the incoming studentData._id differs from currently loaded one
//     if (studentData._id && loadedStudentIdRef.current !== studentData._id) {
//       loadedStudentIdRef.current = studentData._id;

//       setSrn(studentData.srn ?? "");
//       setName(studentData.name ?? "");
//       setFather(studentData.father ?? "");
//       setMother(studentData.mother ?? "");
//       setDob(studentData.dob ? new Date(studentData.dob).toISOString().split("T")[0] : "");
//       setGender(studentData.gender ?? "");
//       setCategory(studentData.category ?? "");
//       setAadhar(studentData.aadhar ?? "");
//       setMobile(studentData.mobile ?? "");
//       setWhatsapp(studentData.whatsapp ?? "");

//       setHouseNumber(studentData.houseNumber ?? "");
//       setCityTownVillage(studentData.cityTownVillage ?? "");
//       setAddressBlock(studentData.addressBlock ?? "");
//       setAddressDistrict(studentData.addressDistrict ?? "");
//       setAddressState(studentData.addressState ?? "");

//       setSchoolDistrict(studentData.schoolDistrict ?? "");
//       setSchoolDistrictCode(studentData.schoolDistrictCode ?? "");
//       setSchoolBlock(studentData.schoolBlock ?? "");
//       setSchoolBlockCode(studentData.schoolBlockCode ?? "");
//       setSchool(studentData.school ?? "");
//       setSchoolCode(studentData.schoolCode ?? "");

//       setPreviousClassAnnualExamPercentage(studentData.previousClassAnnualExamPercentage ?? "");
//       setClassOfStudent(studentData.classOfStudent ?? "");

//       // image fields
//       setImage(null); // don't try to set File object for security; user can re-upload
//       setImageUrl(studentData.imageUrl ?? "");
//     }
//   }, [studentData]);

//   // React to FileUploadContext changes (if FileUpload component writes file there)
//   useEffect(() => {
//     const fileFromContext = fileUploadData && fileUploadData[0] && fileUploadData[0].file;
//     if (fileFromContext) {
//       setImage(fileFromContext);
//       // create local preview URL for immediate display
//       try {
//         const previewUrl = URL.createObjectURL(fileFromContext);
//         setImageUrl(previewUrl);
//         // revoke on cleanup: optional - we won't manage this here because user may navigate away
//       } catch (err) {
//         // ignore
//       }
//     }
//   }, [fileUploadData]);

//   // -----------------------
//   // Input change handlers with sanitization
//   // -----------------------
//   const handleSrnChange = (e) => {
//     setSrn(onlyDigits(e.target.value, 10));
//     setErrors((p) => ({ ...p, srn: null }));
//   };

//   const handleAadharChange = (e) => {
//     // allow digits only (aadhar unique), not enforced length here but we will validate on submit
//     setAadhar(onlyDigits(e.target.value, 12));
//     setErrors((p) => ({ ...p, aadhar: null }));
//   };

//   const handleMobileChange = (setter) => (e) => {
//     setter(onlyDigits(e.target.value, 10));
//     setErrors((p) => ({ ...p, mobile: null, whatsapp: null }));
//   };

//   const handleNameChange = (setter) => (e) => {
//     setter(onlyAlphaSpace(e.target.value));
//     // clear specific error
//     setErrors((p) => ({ ...p, name: null, father: null, mother: null }));
//   };

//   const handleAddressChangeUpper = (setter) => (e) => {
//     setter(alphaNumUpper(e.target.value));
//   };

//   const handlePrevPercentChange = (e) => {
//     setPreviousClassAnnualExamPercentage(sanitizePercentage(e.target.value));
//   };

//   // -----------------------
//   // Validation function (returns boolean)
//   // -----------------------
//   const validateAll = () => {
//     const newErrors = {};

//     // required fields (everything except file upload)
//     const requiredFields = {
//       srn,
//       name,
//       father,
//       mother,
//       dob,
//       gender,
//       category,
//       aadhar,
//       mobile,
//       whatsapp,
//       cityTownVillage,
//       addressBlock,
//       addressDistrict,
//       addressState,
//       // Depending on create vs update: include school fields only for CREATE mode.
//       previousClassAnnualExamPercentage,
//       classOfStudent,
//     };

//     Object.entries(requiredFields).forEach(([k, v]) => {
//       if (v === undefined || v === null || String(v).trim() === "") {
//         newErrors[k] = "This field is required.";
//       }
//     });

//     // srn: exactly 10 digits
//     if (srn && !/^\d{10}$/.test(srn)) {
//       newErrors.srn = "SRN must be exactly 10 digits.";
//     }

//     // names: only alphabets and spaces & not empty
//     ["name", "father", "mother"].forEach((f) => {
//       const val = (f === "name" ? name : f === "father" ? father : mother) || "";
//       if (val && !/^[A-Za-z\s]+$/.test(val)) {
//         newErrors[f] = "Only alphabets and spaces allowed.";
//       }
//     });

//     // contact numbers 10 digits
//     if (mobile && !/^\d{10}$/.test(mobile)) {
//       newErrors.mobile = "Mobile must be 10 digits.";
//     }
//     if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
//       newErrors.whatsapp = "WhatsApp must be 10 digits.";
//     }

//     // aadhar basic check - digits (length may vary depending on your rule; enforce at least 8 here)
//     if (aadhar && !/^\d{12}$/.test(aadhar)) {
//       newErrors.aadhar = "Aadhar must be exactly 12 digits.";
//     }

//     // percentage validation: allow up to 3 digits or decimal upto 2 places
//     if (previousClassAnnualExamPercentage) {
//       if (!/^\d{1,3}(\.\d{1,2})?$/.test(previousClassAnnualExamPercentage)) {
//         newErrors.previousClassAnnualExamPercentage = "Enter a valid percent (up to 3 digits or up to 2 decimals).";
//       }
//     }

//     // House/City/Block/District: must be alphanumeric (we sanitized to uppercase already)
//     const alphaNumFields = {
//       cityTownVillage,
//       addressBlock,
//       addressDistrict,
//       addressState,
//     };
//     Object.entries(alphaNumFields).forEach(([k, v]) => {
//       if (v && !/^[A-Z0-9\s\-\/]+$/.test(v)) {
//         newErrors[k] = "Only alphanumeric characters, spaces, - or / are allowed (will be uppercased).";
//       }
//     });

//     // Explicit checks for dependent dropdown contexts: ensure districtContext, blockContext and schoolContext are present with label/value.
//     // If any are empty/null/blank, set the corresponding error key so the UI will show exactly that field as required.
//     // ---------- CHANGED BEHAVIOR ----------
//     // For update case (studentData && studentData._id) we will NOT require schoolDistrict / schoolBlock / school fields.
//     // For create case (no studentData._id) we require them via districtContext/blockContext/schoolContext presence.

//     const isUpdateMode = !!(studentData && studentData._id);

//     if (!isUpdateMode) {
//       // CREATE mode: enforce dropdowns
//       if (!districtContext || !districtContext.label || String(districtContext.label).trim() === "") {
//         newErrors.schoolDistrict = "This field is required.";
//       }
//       if (!blockContext || !blockContext.label || String(blockContext.label).trim() === "") {
//         newErrors.schoolBlock = "This field is required.";
//       }
//       if (!schoolContext || !schoolContext.label || String(schoolContext.label).trim() === "") {
//         newErrors.school = "This field is required.";
//       }
//     } else {
//       // UPDATE mode: if all of districtContext/blockContext/schoolContext are empty BUT the existing studentData
//       // ALSO has none of the school fields filled, we will NOT throw validation error (user may keep them empty).
//       // So do nothing here (skip adding errors in update mode).
//       // This preserves the user's request: "if studentData's school fields are empty, don't show validation error on update".
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // -----------------------
//   // Submit handler
//   // -----------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();


// const slipId = name.slice(0, 3).toUpperCase() + srn.slice(-5);

// const registrationDate =  new Date();

//     setAlert(null);
//     setLoading(true);

//     try {
//       // client validation
//       const ok = validateAll();
//       if (!ok) {
//         setAlert({ type: "danger", message: "Please fix the highlighted errors before submitting." });
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();

//       // Append transformed values: trimmed + uppercase as required

//       if (studentData){

        
//       if (studentData?.registrationDate === null || studentData?.registrationDate === ""
//         || studentData?.registrationDate === undefined
//       ){
//         formData.append("registrationDate", registrationDate);
//       } else {
//         formData.append("registrationDate", registrationDate);
//       }

//       } else {
//         formData.append("registrationDate", registrationDate);
//       }

       

   

//       if (userData
//        ) {
      

//          formData.append("isRegisteredBy", userData?.user._id);
//        } else {
//          formData.append("isRegisteredBy", "Self");
//        }

//       // For update case, reset verification fields to Pending, null, null
//       if (studentData && studentData._id) {
//         formData.append("isVerified", "Pending");
//         formData.append("verifiedBy", null);
//         formData.append("registrationFormVerificationRemark", null);
//       }

        
    

//       formData.append("slipId", trim(slipId));
//       formData.append("srn", trim(srn));
//       formData.append("name", toUpperTrim(name));
//       formData.append("father", toUpperTrim(father));
//       formData.append("mother", toUpperTrim(mother));
//       formData.append("dob", trim(dob));
//       formData.append("gender", trim(gender).toUpperCase());
//       formData.append("category", trim(category).toUpperCase());
//       formData.append("aadhar", trim(aadhar));
//       formData.append("mobile", trim(mobile));
//       formData.append("whatsapp", trim(whatsapp));

//       // Personal address (alpha numeric fields uppercase)
//       formData.append("houseNumber", alphaNumUpper(houseNumber));
//       formData.append("cityTownVillage", alphaNumUpper(cityTownVillage));
//       formData.append("addressBlock", alphaNumUpper(addressBlock));
//       formData.append("addressDistrict", alphaNumUpper(addressDistrict));
//       formData.append("addressState", alphaNumUpper(addressState));

//       // School details using districtContext/blockContext/schoolContext if present
//       formData.append("schoolDistrict", toUpperTrim(districtContext?.label ?? schoolDistrict));
//       formData.append("schoolDistrictCode", trim(districtContext?.value ?? schoolDistrictCode));
//       formData.append("schoolBlock", toUpperTrim(blockContext?.label ?? schoolBlock));
//       formData.append("schoolBlockCode", trim(blockContext?.value ?? schoolBlockCode));
//       formData.append("school", toUpperTrim(schoolContext?.label ?? school));
//       formData.append("schoolCode", trim(schoolContext?.value ?? schoolCode));

//       // Additional fields
//       formData.append("previousClassAnnualExamPercentage", trim(previousClassAnnualExamPercentage));
//       formData.append("classOfStudent", trim(classOfStudent));

//       // Image file (prefer file from context, then local image state)
//       const fileFromContext = fileUploadData && fileUploadData[0] && fileUploadData[0].file;
//       const fileToAppend = fileFromContext || image;
//       if (fileToAppend) {
//         formData.append("image", fileToAppend);
//       }

//       // imageUrl (if existing) — server will typically ignore and use uploaded file if provided
//       if (imageUrl) formData.append("imageUrl", imageUrl);

//       let response;
//       if (studentData && studentData._id) {
//         // For update, include the student's id (server should accept multipart/form-data update)
//         formData.append("_id", studentData._id);
//         response = await updateStudent(formData);
       
//            console.log(response?.updatedStudent)

//         setStudentData(response?.updatedStudent)
//       } else {
//         response = await createStudent(formData);

//         console.log(response?.data)

//         setStudentData(response?.data)
        
//       }

//       // Expect that your service returns a sensible response object. Show success.
//       // Per request, show the specific message after submit/update
//       setAlert({ type: "success", message: "form submitted or updated successfully" });

//       // Clear all fields right after successful submit/update
//       setSrn("");
//       setName("");
//       setFather("");
//       setMother("");
//       setDob("");
//       setGender("");
//       setCategory("");
//       setAadhar("");
//       setMobile("");
//       setWhatsapp("");

//       setHouseNumber("");
//       setCityTownVillage("");
//       setAddressBlock("");
//       setAddressDistrict("");
//       setAddressState("");

//       setSchoolDistrict("");
//       setSchoolDistrictCode("");
//       setSchoolBlock("");
//       setSchoolBlockCode("");
//       setSchool("");
//       setSchoolCode("");

//       setPreviousClassAnnualExamPercentage("");
//       setClassOfStudent("");

//       setImage(null);
//       setImageUrl("");

//       // reset loaded student reference so future edits seed correctly
//       loadedStudentIdRef.current = null;

//       // clear contexts where appropriate
//       try {
//         // if (setStudentData) setStudentData(null);
//       } catch (err) {
//         // ignore
//       }
//       try {
//         if (setFileUploadData) setFileUploadData([]);
//       } catch (err) {
//         // ignore
//       }

//       // Optionally update StudentContext with returned student (if you still want to keep it)..
//       //...This will help in generating acknowledgement slip.
//       if (response?.data) {
//       console.log("hi")
//         setStudentData(response.data);
//         loadedStudentIdRef.current = response.data._id || loadedStudentIdRef.current;



//         //Handling for user and self case
//         if(userData){
          
//           setStudentData({})
         
//           if (location.pathname === "/user-registration-form-mb" || 
//             location.pathname === "/user-registration-form-sh"
//           ) {
          
//              navigate(`/user-student-signin-${location.pathname.slice(-2)}`)
//           } 
          
//         } else{
          
//           if (location.pathname === "/exam-registration-form-mb" || 
//             location.pathname === "/exam-registration-form-sh"
//           ) {
          
//              navigate(`/exam-acknowledgement-slip-${location.pathname.slice(-2)}`)
//           } 
//         }
        
//       } else{console.log("jelllo")
//         console.log(studentData)
//     //Handling for user and self case
//         if(userData){
//         setStudentData({})

//           setStudentData({})
         
//           if (location.pathname === "/user-registration-form-mb" || 
//             location.pathname === "/user-registration-form-sh"
//           ) {
            
//              navigate(`/user-student-signin-${location.pathname.slice(-2)}`)
//           } 
          
//         } else{
         
//           if (location.pathname === "/exam-registration-form-mb" || 
//             location.pathname === "/exam-registration-form-sh"
//           ) {
          
//              navigate(`/exam-acknowledgement-slip-${location.pathname.slice(-2)}`)
//           } 
      
//         }
    
//       }

      
   


//     } catch (err) {
//       console.error("Submit error:", err);
//       // if axios error, try to extract message
//       const msg = err?.response?.data?.message || err?.message || "Something went wrong.";
//       setAlert({ type: "danger", message: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Small helper to show image preview (existing remote url or blob url)
//   const renderImagePreview = () => {
//     if (!imageUrl) return null;
//     return (
//       <div style={{ marginBottom: 12 }}>
//         <div style={{ fontSize: 12, marginBottom: 6 }}>Image preview:</div>
//         <img src={imageUrl} alt="preview" style={{ maxWidth: 160, maxHeight: 160, objectFit: "cover" }} />
//       </div>
//     );
//   };

//   // Layout: split into sections with cards & grid
//   return (
//     <Container fluid className="py-3">
//       {alert && (
//         <Alert variant={alert.type === "danger" ? "danger" : "success"} onClose={() => setAlert(null)} dismissible>
//           {alert.message}
//         </Alert>
//       )}

//       <Form onSubmit={handleSubmit} noValidate>
//         {/* SRN top bar */}
//         <Card className="mb-3">
//           <Card.Body>
//             <Form.Group controlId="formSrn">
//               <Form.Label><strong>SRN (एस.आर.एन.) :</strong></Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="SRN (एस.आर.एन.)"
//                 value={srn}
//                 onChange={handleSrnChange}
//                 isInvalid={!!errors.srn}
//               />
//               <Form.Control.Feedback type="invalid">{errors.srn}</Form.Control.Feedback>
//             </Form.Group>
//           </Card.Body>
//         </Card>

//         <Row>
//           {/* Left column: Personal Details */}
//           <Col lg={7}>
//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700, fontSize:'25px' }}>
//                 Personal Details (व्यक्तिगत विवरण)
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formName">
//                       <Form.Label>Student Name (विद्यार्थी का नाम) :</Form.Label> 
//                       <br></br>
//                       <small>(स्कूल में पंजीकृत नाम दर्ज करें)</small>
//                       <Form.Control
//                         type="text"
//                         placeholder="Student Name (विद्यार्थी का नाम)"
//                         value={name}
//                         onChange={handleNameChange(setName)}
//                         isInvalid={!!errors.name}
//                       />
//                       <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formFather">
//                       <Form.Label>Father's Name (पिता का नाम) :</Form.Label>
//                       <br></br>
//                       <small>(Mr/श्री का प्रयोग न करें)</small>
//                       <Form.Control
//                         type="text"
//                         placeholder="Father's Name (पिता का नाम)"
//                         value={father}
//                         onChange={handleNameChange(setFather)}
//                         isInvalid={!!errors.father}
//                       />
//                       <Form.Control.Feedback type="invalid">{errors.father}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formMother">
//                       <Form.Label>Mother's Name (माता का नाम) :</Form.Label>
//                       <br></br>
//                       <small>(Mrs/श्रीमती का प्रयोग न करें)</small>
//                       <Form.Control
//                         type="text"
//                         placeholder="Mother's Name (माता का नाम)"
//                         value={mother}
//                         onChange={handleNameChange(setMother)}
//                         isInvalid={!!errors.mother}
//                       />
//                       <Form.Control.Feedback type="invalid">{errors.mother}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   {/* <Col md={12} className="mb-3">
//                     <Form.Group controlId="formClassOfStudent">
//                       <Form.Label>Class (कक्षा) :</Form.Label>
//                       <Select
//                         value={mapToOption(classOfStudent, classOptions)}
//                         options={classOptions}
//                         onChange={(opt) => {
//                           setClassOfStudent(opt ? opt.value : "");
//                           setErrors((p) => ({ ...p, classOfStudent: null }));
//                         }}
//                       />
//                       {errors.classOfStudent && <div className="text-danger small mt-1">{errors.classOfStudent}</div>}
//                     </Form.Group>
//                   </Col> */}

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formDob">
//                       <Form.Label>D.O.B (जन्म तिथि) :</Form.Label>
//                       <Form.Control type="date" value={dob} onChange={(e) => { setDob(e.target.value); setErrors((p) => ({ ...p, dob: null })); }} isInvalid={!!errors.dob} />
//                       <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formGender">
//                       <Form.Label>Gender (लिंग) :</Form.Label>
//                       <Select
//                         value={mapToOption(gender, genderOptions)}
//                         options={genderOptions}
//                         onChange={(opt) => { setGender(opt ? opt.value : ""); setErrors((p) => ({ ...p, gender: null })); }}
//                       />
//                       {errors.gender && <div className="text-danger small mt-1">{errors.gender}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formCategory">
//                       <Form.Label>Category (वर्ग) :</Form.Label>
//                       <Select
//                         value={mapToOption(category, categoryOptions)}
//                         options={categoryOptions}
//                         onChange={(opt) => { setCategory(opt ? opt.value : ""); setErrors((p) => ({ ...p, category: null })); }}
//                       />
//                       {errors.category && <div className="text-danger small mt-1">{errors.category}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formAadhar">
//                       <Form.Label>Aadhar Number (आधार संख्या) :</Form.Label>
//                       <Form.Control type="text" placeholder="Aadhar Number (आधार संख्या)" value={aadhar} onChange={handleAadharChange} isInvalid={!!errors.aadhar} />
//                       <Form.Control.Feedback type="invalid">{errors.aadhar}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Address Details
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formHouseNumber">
//                       <Form.Label>H. No (मकान नंबर) :</Form.Label>
//                       <br></br>
//                       <small>Optional. (वैकल्पिक)</small>
//                       <Form.Control type="text" placeholder="H. No" value={houseNumber} onChange={handleAddressChangeUpper(setHouseNumber)} isInvalid={!!errors.houseNumber} />
//                       <Form.Control.Feedback type="invalid">{errors.houseNumber}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={8} className="mb-3">
//                     <Form.Group controlId="formCityTownVillage">
//                       <Form.Label>City/Town/Village :</Form.Label>
//                       <Form.Control type="text" placeholder="City/Town/Village" value={cityTownVillage} onChange={handleAddressChangeUpper(setCityTownVillage)} isInvalid={!!errors.cityTownVillage} />
//                       <Form.Control.Feedback type="invalid">{errors.cityTownVillage}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formAddressBlock">
//                       <Form.Label>Block (ब्लॉक) :</Form.Label>
//                       <Form.Control type="text" placeholder="Block" value={addressBlock} onChange={handleAddressChangeUpper(setAddressBlock)} isInvalid={!!errors.addressBlock} />
//                       <Form.Control.Feedback type="invalid">{errors.addressBlock}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formAddressDistrict">
//                       <Form.Label>District (ज़िला) :</Form.Label>
//                       <Form.Control type="text" placeholder="District" value={addressDistrict} onChange={handleAddressChangeUpper(setAddressDistrict)} isInvalid={!!errors.addressDistrict} />
//                       <Form.Control.Feedback type="invalid">{errors.addressDistrict}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4} className="mb-3">
//                     <Form.Group controlId="formAddressState">
//                       <Form.Label>State (राज्य) :</Form.Label>
//                       <Form.Control type="text" placeholder="State" value={addressState} onChange={handleAddressChangeUpper(setAddressState)} isInvalid={!!errors.addressState} />
//                       <Form.Control.Feedback type="invalid">{errors.addressState}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>

//           {/* Right column: Contact & Academic */}
//           <Col lg={5}>
//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Contact Details (संपर्क विवरण)
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formMobile">
//                       <Form.Label>Mobile Number (मोबाइल नंबर) :</Form.Label>
//                       <Form.Control type="text" placeholder="Mobile Number" value={mobile} onChange={handleMobileChange(setMobile)} isInvalid={!!errors.mobile} />
//                       <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formWhatsapp">
//                       <Form.Label>Whatsapp Number (व्हाट्सएप नंबर) :</Form.Label>
//                       <br></br>
//                       <small>(केवल अपने माता या पिता का मोबाइल नंबर भरें)</small>
//                       <Form.Control type="text" placeholder="Whatsapp Number" value={whatsapp} onChange={handleMobileChange(setWhatsapp)} isInvalid={!!errors.whatsapp} />
//                       <Form.Control.Feedback type="invalid">{errors.whatsapp}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Academic Details (शैक्षिक विवरण)
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formDistrictSchoolDropdown">
                   
//                       <District_block_school_manual_school_name_dependentDropdown />
//                       {/* validation messages */}
//                       {errors.schoolDistrict && <div className="text-danger small mt-1">{errors.schoolDistrict}</div>}
//                       {errors.schoolBlock && <div className="text-danger small mt-1">{errors.schoolBlock}</div>}
//                       {errors.school && <div className="text-danger small mt-1">{errors.school}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formPrevClassPercent">
//                       <Form.Label>Class 7th Annual Examination Per% :</Form.Label>
//                       <Form.Control type="text" placeholder="Enter Percentage" value={previousClassAnnualExamPercentage} onChange={handlePrevPercentChange} isInvalid={!!errors.previousClassAnnualExamPercentage} />
//                       <Form.Control.Feedback type="invalid">{errors.previousClassAnnualExamPercentage}</Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="formClassSelect">
//                       <Form.Label>Class of Student :</Form.Label>
//                       <Select
//                         value={mapToOption(classOfStudent, classOptions)}
//                         options={classOptions}
//                         onChange={(opt) => { setClassOfStudent(opt ? opt.value : ""); setErrors((p) => ({ ...p, classOfStudent: null })); }}
//                       />
//                       {errors.classOfStudent && <div className="text-danger small mt-1">{errors.classOfStudent}</div>}
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             <Card className="mb-3">
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Upload Your Passport Size Photo (अपनी पासपोर्ट साइज फोटो अपलोड करें)
//               </Card.Header>
//               <Card.Body>
//                 {renderImagePreview()}
//                 <FileUpload />
           
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         <Row>
//           <Col lg={12}>

//             <Card className="mb-3">

//               <Card.Body>
//                 <Button style={{width:'100%'}} variant="primary" type="submit" disabled={loading}>
//                   {loading ? <><Spinner animation="border" size="sm" /> Saving...</> : (studentData && studentData._id ? "Update Student" : "Register")}
//                 </Button>

//               </Card.Body>
//               <CardFooter>
//                         Note / नोट: Submitting incorrect details may lead to form rejection. (गलत जानकारी देने पर फॉर्म अस्वीकार हो सकता है)
//               </CardFooter>
//             </Card>
//           </Col>

          

//         </Row>

//         <div className="text-end mt-2">
          
//         </div>
//       </Form>
//     </Container>
//   );
// };






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

export const StudentRegistrationForm = () => {


  const navigate = useNavigate();
 const location = useLocation();
 

 console.log(location.pathname)
 //----------------------------------------

  // Contexts
  const { studentData, setStudentData } = useContext(StudentContext);
  const { userData } = useContext(UserContext);
  const { fileUploadData, setFileUploadData } = useContext(FileUploadContext);
  // const context = useContext(DistrictBlockSchoolDependentDropDownContext);


    const context = useContext(DistrictBlockSchoolDependentDropDownContext);
    const {
      districtContext,
      setDistrictContext,
      blockContext,
      setBlockContext,
      schoolContext,
      setSchoolContext,
    } = context || {};
  
//------------------------------------------------
  // Local controlled state (all fields)
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

  const [image, setImage] = useState(null); // File
  const [imageUrl, setImageUrl] = useState(""); // preview / existing url

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // validation state
  const [errors, setErrors] = useState({});

  // Keep a ref of the currently loaded student _id to avoid overwriting local edits unintentionally
  const loadedStudentIdRef = useRef(null);



  //Dunamically setting the state of classOfStudent if form is of class 8 or 10th
 useEffect(() => {
  // Do not force class when in UPDATE mode (i.e., when studentData has an _id).
  // This prevents overwriting user's selection during edit.
  if (studentData && studentData._id) return;

  if (location.pathname === "/user-registration-form-mb" && classOfStudent !== "8") {
    setClassOfStudent("8");
  } else if (location.pathname === "/user-registration-form-sh" && classOfStudent !== "10") {
    setClassOfStudent("10");
  } else if (location.pathname === "/exam-registration-form-mb" && classOfStudent !== "8"){
    setClassOfStudent("8");
  } else if ((location.pathname === "/exam-registration-form-sh" && classOfStudent !== "10")){
    setClassOfStudent("10");
  }
}, [location.pathname, classOfStudent, setClassOfStudent, studentData]);




  // Options for react-select
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const categoryOptions = [
    { value: "BCA", label: "BCA" },
    { value: "GEN", label: "GEN" },
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" },
    { value: "OBC", label: "OBC" },
  ];

  const classOptions = [
    { value: "8", label: "8" },
    { value: "10", label: "10" },
  ];

  // -----------------------
  // Sanitizers & validators
  // -----------------------
  const trim = (s) => (typeof s === "string" ? s.trim() : s);
  const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();

  // only digits, limited length
  const onlyDigits = (value, maxLen = 10) => {
    const digits = String(value || "").replace(/\D+/g, "").slice(0, maxLen);
    return digits;
  };

  // only alphabets and spaces (for names). We will allow only A-Z and space.
  const onlyAlphaSpace = (value) => {
    const v = String(value || "");
    // allow letters and spaces, remove other chars
    const cleaned = v.replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
    return cleaned;
  };

  // alphanumeric uppercase and trimmed (for address fields)
  const alphaNumUpper = (value, maxLen = 100) => {
    const v = String(value || "");
    // allow letters, numbers and spaces and some punctuation if needed (here keep alnum + space + -/), then uppercase
    const cleaned = v.replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen);
    return cleaned.trim().toUpperCase();
  };

  // previous class percent: allow up to 3 digits or decimals upto 2 places
  const sanitizePercentage = (value) => {
    const v = String(value || "").trim();
    // remove invalid chars except digits and dot
    const cleaned = v.replace(/[^0-9.]/g, "");
    // enforce single dot
    const parts = cleaned.split(".");
    if (parts.length <= 1) return parts[0].slice(0, 3);
    const integer = parts[0].slice(0, 3);
    const decimal = parts[1].slice(0, 2);
    return `${integer}.${decimal}`;
  };

  // mapToOption helper for react-select
  const mapToOption = (value, options) => {
    if (!value) return null;
    return options.find((o) => String(o.value) === String(value)) || null;
  };

  // -----------------------
  // Seed local state from studentData
  // -----------------------
  useEffect(() => {
    if (!studentData) {
      // if clearing the form, reset ref and local state
      loadedStudentIdRef.current = null;
      return;
    }

    // Only seed when the incoming studentData._id differs from currently loaded one
    if (studentData._id && loadedStudentIdRef.current !== studentData._id) {
      loadedStudentIdRef.current = studentData._id;

      setSrn(studentData.srn ?? "");
      setName(studentData.name ?? "");
      setFather(studentData.father ?? "");
      setMother(studentData.mother ?? "");
      setDob(studentData.dob ? new Date(studentData.dob).toISOString().split("T")[0] : "");
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

      // image fields
      setImage(null); // don't try to set File object for security; user can re-upload
      setImageUrl(studentData.imageUrl ?? "");
    }
  }, [studentData]);

  // React to FileUploadContext changes (if FileUpload component writes file there)
  useEffect(() => {
    const fileFromContext = fileUploadData && fileUploadData[0] && fileUploadData[0].file;
    if (fileFromContext) {
      setImage(fileFromContext);
      // create local preview URL for immediate display
      try {
        const previewUrl = URL.createObjectURL(fileFromContext);
        setImageUrl(previewUrl);
        // revoke on cleanup: optional - we won't manage this here because user may navigate away
      } catch (err) {
        // ignore
      }
    }
  }, [fileUploadData]);

  // -----------------------
  // Input change handlers with sanitization
  // -----------------------
  const handleSrnChange = (e) => {
    setSrn(onlyDigits(e.target.value, 10));
    setErrors((p) => ({ ...p, srn: null }));
  };

  const handleAadharChange = (e) => {
    // allow digits only (aadhar unique), not enforced length here but we will validate on submit
    setAadhar(onlyDigits(e.target.value, 12));
    setErrors((p) => ({ ...p, aadhar: null }));
  };

  const handleMobileChange = (setter) => (e) => {
    setter(onlyDigits(e.target.value, 10));
    setErrors((p) => ({ ...p, mobile: null, whatsapp: null }));
  };

  const handleNameChange = (setter) => (e) => {
    setter(onlyAlphaSpace(e.target.value));
    // clear specific error
    setErrors((p) => ({ ...p, name: null, father: null, mother: null }));
  };

  const handleAddressChangeUpper = (setter) => (e) => {
    setter(alphaNumUpper(e.target.value));
  };

  const handlePrevPercentChange = (e) => {
    setPreviousClassAnnualExamPercentage(sanitizePercentage(e.target.value));
  };

  // -----------------------
  // Validation function (returns boolean)
  // -----------------------
  const validateAll = () => {
    const newErrors = {};

    // required fields (everything except file upload)
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
      // Depending on create vs update: include school fields only for CREATE mode.
      previousClassAnnualExamPercentage,
      classOfStudent,
    };

    Object.entries(requiredFields).forEach(([k, v]) => {
      if (v === undefined || v === null || String(v).trim() === "") {
        newErrors[k] = "This field is required.";
      }
    });

    // srn: exactly 10 digits
    if (srn && !/^\d{10}$/.test(srn)) {
      newErrors.srn = "SRN must be exactly 10 digits.";
    }

    // names: only alphabets and spaces & not empty
    ["name", "father", "mother"].forEach((f) => {
      const val = (f === "name" ? name : f === "father" ? father : mother) || "";
      if (val && !/^[A-Za-z\s]+$/.test(val)) {
        newErrors[f] = "Only alphabets and spaces allowed.";
      }
    });

    // contact numbers 10 digits
    if (mobile && !/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile must be 10 digits.";
    }
    if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
      newErrors.whatsapp = "WhatsApp must be 10 digits.";
    }

    // aadhar basic check - digits (length may vary depending on your rule; enforce at least 8 here)
    if (aadhar && !/^\d{12}$/.test(aadhar)) {
      newErrors.aadhar = "Aadhar must be exactly 12 digits.";
    }

    // percentage validation: allow up to 3 digits or decimal upto 2 places
    if (previousClassAnnualExamPercentage) {
      if (!/^\d{1,3}(\.\d{1,2})?$/.test(previousClassAnnualExamPercentage)) {
        newErrors.previousClassAnnualExamPercentage = "Enter a valid percent (up to 3 digits or up to 2 decimals).";
      }
    }

    // House/City/Block/District: must be alphanumeric (we sanitized to uppercase already)
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

    // Explicit checks for dependent dropdown contexts: ensure districtContext, blockContext and schoolContext are present with label/value.
    // If any are empty/null/blank, set the corresponding error key so the UI will show exactly that field as required.
    // ---------- CHANGED BEHAVIOR ----------
    // For update case (studentData && studentData._id) we will NOT require schoolDistrict / schoolBlock / school fields.
    // For create case (no studentData._id) we require them via districtContext/blockContext/schoolContext presence.

    const isUpdateMode = !!(studentData && studentData._id);

    if (!isUpdateMode) {
      // CREATE mode: enforce dropdowns
      if (!districtContext || !districtContext.label || String(districtContext.label).trim() === "") {
        newErrors.schoolDistrict = "This field is required.";
      }
      if (!blockContext || !blockContext.label || String(blockContext.label).trim() === "") {
        newErrors.schoolBlock = "This field is required.";
      }
      if (!schoolContext || !schoolContext.label || String(schoolContext.label).trim() === "") {
        newErrors.school = "This field is required.";
      }
    } else {
      // UPDATE mode: if all of districtContext/blockContext/schoolContext are empty BUT the existing studentData
      // ALSO has none of the school fields filled, we will NOT throw validation error (user may keep them empty).
      // So do nothing here (skip adding errors in update mode).
      // This preserves the user's request: "if studentData's school fields are empty, don't show validation error on update".
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------
  // Submit handler
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();


const slipId = name.slice(0, 3).toUpperCase() + srn.slice(-5);

const registrationDate =  new Date();

    setAlert(null);
    setLoading(true);

    try {
      // client validation
      const ok = validateAll();
      if (!ok) {
        setAlert({ type: "danger", message: "Please fix the highlighted errors before submitting." });
        setLoading(false);
        return;
      }

      const formData = new FormData();

      // Append transformed values: trimmed + uppercase as required

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

      // For update case, reset verification fields to Pending, null, null
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

      // Personal address (alpha numeric fields uppercase)
      formData.append("houseNumber", alphaNumUpper(houseNumber));
      formData.append("cityTownVillage", alphaNumUpper(cityTownVillage));
      formData.append("addressBlock", alphaNumUpper(addressBlock));
      formData.append("addressDistrict", alphaNumUpper(addressDistrict));
      formData.append("addressState", alphaNumUpper(addressState));

      // School details using districtContext/blockContext/schoolContext if present
      formData.append("schoolDistrict", toUpperTrim(districtContext?.label ?? schoolDistrict));
      formData.append("schoolDistrictCode", trim(districtContext?.value ?? schoolDistrictCode));
      formData.append("schoolBlock", toUpperTrim(blockContext?.label ?? schoolBlock));
      formData.append("schoolBlockCode", trim(blockContext?.value ?? schoolBlockCode));
      formData.append("school", toUpperTrim(schoolContext?.label ?? school));
      formData.append("schoolCode", trim(schoolContext?.value ?? schoolCode));

      // Additional fields
      formData.append("previousClassAnnualExamPercentage", trim(previousClassAnnualExamPercentage));
      formData.append("classOfStudent", trim(classOfStudent));

      // Image file (prefer file from context, then local image state)
      const fileFromContext = fileUploadData && fileUploadData[0] && fileUploadData[0].file;
      const fileToAppend = fileFromContext || image;
      if (fileToAppend) {
        formData.append("image", fileToAppend);
      }

      // imageUrl (if existing) — server will typically ignore and use uploaded file if provided
      if (imageUrl) formData.append("imageUrl", imageUrl);

      let response;
      if (studentData && studentData._id) {
        // For update, include the student's id (server should accept multipart/form-data update)
        formData.append("_id", studentData._id);
        response = await updateStudent(formData);
       
           console.log(response?.updatedStudent)

        setStudentData(response?.updatedStudent)
      } else {
        response = await createStudent(formData);

        console.log(response?.data)

        setStudentData(response?.data)
        
      }

      // Expect that your service returns a sensible response object. Show success.
      // Per request, show the specific message after submit/update
      setAlert({ type: "success", message: "form submitted or updated successfully" });

      // Clear all fields right after successful submit/update
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

      // reset loaded student reference so future edits seed correctly
      loadedStudentIdRef.current = null;

      // clear contexts where appropriate
      try {
        // if (setStudentData) setStudentData(null);
      } catch (err) {
        // ignore
      }
      try {
        if (setFileUploadData) setFileUploadData([]);
      } catch (err) {
        // ignore
      }

      // Optionally update StudentContext with returned student (if you still want to keep it)..
      //...This will help in generating acknowledgement slip.
      if (response?.data) {
      console.log("hi")
        setStudentData(response.data);
        loadedStudentIdRef.current = response.data._id || loadedStudentIdRef.current;



        //Handling for user and self case
        if(userData){
          
          setStudentData({})
         
          if (location.pathname === "/user-registration-form-mb" || 
            location.pathname === "/user-registration-form-sh"
          ) {
          
             navigate(`/user-student-signin-${location.pathname.slice(-2)}`)
          } 
          
        } else{
          
          if (location.pathname === "/exam-registration-form-mb" || 
            location.pathname === "/exam-registration-form-sh"
          ) {
          
             navigate(`/exam-acknowledgement-slip-${location.pathname.slice(-2)}`)
          } 
        }
        
      } else{console.log("jelllo")
        console.log(studentData)
    //Handling for user and self case
        if(userData){
        setStudentData({})

          setStudentData({})
         
          if (location.pathname === "/user-registration-form-mb" || 
            location.pathname === "/user-registration-form-sh"
          ) {
            
             navigate(`/user-student-signin-${location.pathname.slice(-2)}`)
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
      // if axios error, try to extract message
      const msg = err?.response?.data?.message || err?.message || "Something went wrong.";
      setAlert({ type: "danger", message: msg });
    } finally {
      setLoading(false);
    }
  };

  // Small helper to show image preview (existing remote url or blob url)
  const renderImagePreview = () => {
    if (!imageUrl) return null;
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, marginBottom: 6 }}>Image preview:</div>
        <img src={imageUrl} alt="preview" style={{ maxWidth: 160, maxHeight: 160, objectFit: "cover" }} />
      </div>
    );
  };

  // Layout: split into sections with cards & grid
  return (
    <Container fluid className="py-3">
      {alert && (
        <Alert variant={alert.type === "danger" ? "danger" : "success"} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      <h1 style={{textAlign:'center', color:'red', fontWeight:'bold'}}>{location.pathname === "/exam-registration-form-mb" ||
      location.pathname === "/user-registration-form-mb" ? ("Class 8 - Mission Buinyaad Registraiton Form"):("Class 10 - Haryana Super 100 Registraiton Form") }</h1>
      <hr></hr>
      <Form onSubmit={handleSubmit} noValidate>
        {/* SRN top bar */}
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
          {/* Left column: Personal Details */}
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

                  {/* <Col md={12} className="mb-3">
                    <Form.Group controlId="formClassOfStudent">
                      <Form.Label>Class (कक्षा) :</Form.Label>
                      <Select
                        value={mapToOption(classOfStudent, classOptions)}
                        options={classOptions}
                        onChange={(opt) => {
                          setClassOfStudent(opt ? opt.value : "");
                          setErrors((p) => ({ ...p, classOfStudent: null }));
                        }}
                      />
                      {errors.classOfStudent && <div className="text-danger small mt-1">{errors.classOfStudent}</div>}
                    </Form.Group>
                  </Col> */}

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

          {/* Right column: Contact & Academic */}
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
                      {/* validation messages */}
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
                      />
                      {errors.classOfStudent && <div className="text-danger small mt-1">{errors.classOfStudent}</div>}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
                Upload Your Passport Size Photo (अपनी पासपोर्ट साइज फोटो अपलोड करें)
              </Card.Header>
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
