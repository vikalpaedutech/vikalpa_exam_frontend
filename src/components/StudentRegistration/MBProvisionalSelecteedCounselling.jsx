// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, Accordion, Modal } from "react-bootstrap";
// import { GetCentersDataByExaminationAndExamTypeCounselling } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataCounselling, updateDocumentVerification } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// export const MBProvisionalSelectedCounselling = () => {
//   const [centersData, setCentersData] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedVenue, setSelectedVenue] = useState("");
//   const [filteredVenues, setFilteredVenues] = useState([]);
//   const [currentStudent, setCurrentStudent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchingData, setFetchingData] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [accessCode, setAccessCode] = useState("");
//   const [accessCodeVerified, setAccessCodeVerified] = useState(false);
//   const [srnInput, setSrnInput] = useState("");
//   const [searchingStudent, setSearchingStudent] = useState(false);
//   const [studentNotFound, setStudentNotFound] = useState(false);
//   const [showSRNSearch, setShowSRNSearch] = useState(false);
//   const [savingDocuments, setSavingDocuments] = useState(false);
//   const [showDocVerificationAlert, setShowDocVerificationAlert] = useState(false);
  
//   // Document verification state
//   const [documents, setDocuments] = useState({
//     student3PassportSizedPhoto: false,
//     studentAadharCardPhotoCopuy: false,
//     parentsAaadhar: false,
//     preCounsellingForm: false,
//     class8MarksheetPhotoCopy: false,
//     pppPhotocopy: false,
//     slc: false
//   });
  
//   // Accordion state - main form expanded by default
//   const [mainAccordionOpen, setMainAccordionOpen] = useState(["0"]);
  
//   // Pre-defined access codes for districts
//   const districtAccessCodes = [
//     { districtId: "10", districtName: "KAITHAL", accessCode: "KTH7823" },
//     { districtId: "3", districtName: "CHARKHI DADRI", accessCode: "CHD5641" },
//     { districtId: "15", districtName: "PALWAL", accessCode: "PAL3497" },
//     { districtId: "19", districtName: "ROHTAK", accessCode: "ROH2156" },
//     { districtId: "2", districtName: "BHIWANI", accessCode: "BHW9082" },
//     { districtId: "22", districtName: "YAMUNANAGAR", accessCode: "YAM6734" },
//     { districtId: "6", districtName: "GURUGRAM", accessCode: "GUR4512" },
//     { districtId: "1", districtName: "AMBALA", accessCode: "AMB8291" },
//     { districtId: "14", districtName: "NUH MEWAT", accessCode: "NUH3675" },
//     { districtId: "4", districtName: "FARIDABAD", accessCode: "FAR1946" },
//     { districtId: "5", districtName: "FATEHABAD", accessCode: "FAT7583" },
//     { districtId: "17", districtName: "PANIPAT", accessCode: "PAN6429" },
//     { districtId: "8", districtName: "JHAJJAR", accessCode: "JHJ5178" },
//     { districtId: "7", districtName: "HISAR", accessCode: "HIS2934" },
//     { districtId: "9", districtName: "JIND", accessCode: "JIN8751" },
//     { districtId: "11", districtName: "KARNAL", accessCode: "KAR4062" },
//     { districtId: "12", districtName: "KURUKSHETRA", accessCode: "KUR1398" },
//     { districtId: "21", districtName: "SONIPAT", accessCode: "SON7546" },
//     { districtId: "16", districtName: "PANCHKULA", accessCode: "PAN2813" },
//     { districtId: "18", districtName: "REWARI", accessCode: "REW6974" },
//     { districtId: "20", districtName: "SIRSA", accessCode: "SIR4257" },
//     { districtId: "13", districtName: "MAHENDRAGARH", accessCode: "MAH8639" }
//   ];

//   // Fetch all counseling centers
//   const fetchCounsellingCenters = async () => {
//     setLoading(true);
//     try {
//       const response = await GetCentersDataByExaminationAndExamTypeCounselling();
//       console.log("Centers data:", response.data);
//       setCentersData(response.data || []);
      
//       // Extract unique districts
//       const uniqueDistricts = [];
//       const districtMap = new Map();
      
//       (response.data || []).forEach(center => {
//         if (!districtMap.has(center.districtId)) {
//           districtMap.set(center.districtId, {
//             id: center.districtId,
//             name: center.districtName
//           });
//           uniqueDistricts.push({
//             id: center.districtId,
//             name: center.districtName
//           });
//         }
//       });
      
//       setDistricts(uniqueDistricts);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error occurred while fetching counseling centers", error);
//       setError("Failed to fetch counseling centers");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCounsellingCenters();
//   }, []);

//   // Handle district selection
//   const handleDistrictChange = (e) => {
//     const districtId = e.target.value;
//     setSelectedDistrict(districtId);
//     setSelectedVenue("");
//     setAccessCode("");
//     setAccessCodeVerified(false);
//     setError("");
//     setCurrentStudent(null);
//     setShowSRNSearch(false);
//     setSrnInput("");
    
//     const venues = centersData.filter(center => center.districtId === districtId);
//     setFilteredVenues(venues);
//   };

//   // Handle venue selection
//   const handleVenueChange = (e) => {
//     setSelectedVenue(e.target.value);
//     setAccessCodeVerified(false);
//     setAccessCode("");
//     setCurrentStudent(null);
//     setShowSRNSearch(false);
//     setSrnInput("");
//   };

//   // Handle access code change
//   const handleAccessCodeChange = (e) => {
//     setAccessCode(e.target.value);
//     setAccessCodeVerified(false);
//     setError("");
//   };

//   // Get access code hint for selected district
//   const getAccessCodeHint = () => {
//     if (!selectedDistrict) return "";
//     const districtCode = districtAccessCodes.find(
//       dc => dc.districtId === selectedDistrict
//     );
    
//     if (districtCode) {
//       const code = districtCode.accessCode;
//       const maskedCode = code.substring(0, 3) + "****" + code.substring(code.length - 2);
//       return `Hint: Access code format: ${maskedCode} (${code.length} characters)`;
//     }
//     return "Contact administrator for access code";
//   };

//   // Verify access code
//   const verifyAccessCode = () => {
//     if (!selectedDistrict) {
//       setError("Please select a district first");
//       return false;
//     }

//     const selectedDistrictObj = districts.find(d => d.id === selectedDistrict);
//     if (!selectedDistrictObj) {
//       setError("District not found");
//       return false;
//     }

//     const districtCode = districtAccessCodes.find(
//       dc => dc.districtId === selectedDistrict
//     );

//     if (!districtCode) {
//       setError("Access code not configured for this district. Please contact administrator.");
//       return false;
//     }

//     if (districtCode.accessCode === accessCode) {
//       setAccessCodeVerified(true);
//       setError("");
//       return true;
//     } else {
//       setError(`Invalid access code for ${selectedDistrictObj.name}. Please enter the correct access code.`);
//       setAccessCodeVerified(false);
//       return false;
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!selectedVenue) {
//       setError("Please select a venue");
//       return;
//     }

//     if (!accessCode) {
//       setError("Please enter the access code");
//       return;
//     }

//     if (!verifyAccessCode()) {
//       return;
//     }
    
//     setError("");
//     setSuccessMessage("");
//     setCurrentStudent(null);
//     setStudentNotFound(false);
//     setShowSRNSearch(true);
//     setMainAccordionOpen([]);
    
//     setSuccessMessage("Access code verified! Please enter SRN to fetch student details.");
//     setTimeout(() => setSuccessMessage(""), 5000);
//   };

//   // Check if student has completed document verification
//   const hasCompletedDocVerification = (student) => {
//     const validStatuses = ["Admission Done", "Provisional", "Waiting"];
//     return student.finalAdmissionStatus && validStatuses.includes(student.finalAdmissionStatus);
//   };

//   // Handle SRN search and fetch student data
//   const handleSRNSearch = async () => {
//     if (!srnInput.trim()) {
//       setError("Please enter SRN");
//       return;
//     }

//     setSearchingStudent(true);
//     setError("");
//     setStudentNotFound(false);
//     setCurrentStudent(null);
//     setShowDocVerificationAlert(false);
    
//     try {
//       const requestBody = {
//         counsellingVenue: selectedVenue,
//         selectionStatusForL3: "",
//         gender: "",
//         srn: srnInput.trim()
//       };
      
//       console.log("Fetching student with SRN:", requestBody);
      
//       const response = await GetAttendanceSheetDataCounselling(requestBody);
//       console.log("Full response:", response);
      
//       let student = null;
      
//       if (response && response.data) {
//         if (Array.isArray(response.data) && response.data.length > 0) {
//           student = response.data[0];
//         } else if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
//           student = response.data.data[0];
//         } else if (typeof response.data === 'object' && response.data._id) {
//           student = response.data;
//         }
//       } else if (Array.isArray(response) && response.length > 0) {
//         student = response[0];
//       } else if (response && response._id) {
//         student = response;
//       }
      
//       console.log("Extracted student:", student);
      
//       if (student) {
//         // Check if student has completed document verification
//         if (!hasCompletedDocVerification(student)) {
//           console.log("Student has not completed document verification");
//           setShowDocVerificationAlert(true);
//           setSearchingStudent(false);
//           return;
//         }
        
//         setCurrentStudent(student);
        
//         // Load existing document verification status
//         setDocuments({
//           student3PassportSizedPhoto: student.student3PassportSizedPhoto || false,
//           studentAadharCardPhotoCopuy: student.studentAadharCardPhotoCopuy || false,
//           parentsAaadhar: student.parentsAaadhar || false,
//           preCounsellingForm: student.preCounsellingForm || false,
//           class8MarksheetPhotoCopy: student.class8MarksheetPhotoCopy || false,
//           pppPhotocopy: student.pppPhotocopy || false,
//           slc: student.slc || false
//         });
        
//         setStudentNotFound(false);
//         setShowSRNSearch(false);
//         setSuccessMessage(`✓ Student found: ${student.name}`);
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//       } else {
//         setStudentNotFound(true);
//         setCurrentStudent(null);
//         setError(`No student found with SRN: ${srnInput} at venue: ${selectedVenue}`);
//       }
//     } catch (error) {
//       console.error("Error fetching student data", error);
//       setError("An error occurred while fetching student data: " + (error.message || "Unknown error"));
//       setStudentNotFound(true);
//     } finally {
//       setSearchingStudent(false);
//     }
//   };

//   // Handle Enter key press
//   const handleSRNKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSRNSearch();
//     }
//   };

//   // Handle document checkbox change
//   const handleDocumentChange = (documentName, checked) => {
//     setDocuments(prev => ({
//       ...prev,
//       [documentName]: checked
//     }));
//   };

//   // Calculate final admission status based on SLC and selection status
//   const calculateFinalAdmissionStatus = (slcStatus, selectionStatus) => {
//     // If student is not selected, status remains "Waiting"
//     if (selectionStatus !== "Selected") {
//       return "Waiting";
//     }
    
//     // If student is selected and has submitted SLC
//     if (slcStatus === true) {
//       return "Admission Done";
//     }
    
//     // If student is selected but hasn't submitted SLC
//     return "Provisional";
//   };

//   // Save document verification
//   const saveDocumentVerification = async () => {
//     console.log("=== saveDocumentVerification CALLED ===");
//     console.log("Current student:", currentStudent);
//     console.log("Documents state:", documents);
    
//     if (!currentStudent) {
//       console.error("No current student found");
//       setError("No student selected");
//       return;
//     }
    
//     setSavingDocuments(true);
//     setError("");
//     setSuccessMessage("");
    
//     try {
//       // Calculate final admission status based on SLC and selection status
//       const finalStatus = calculateFinalAdmissionStatus(
//         documents.slc,
//         currentStudent.selectionStatusForL3
//       );
      
//       console.log("Calculated final admission status:", finalStatus);
      
//       const requestBody = {
//         _id: currentStudent._id,
//         documents: documents,
//         finalAdmissionStatus: finalStatus
//       };
      
//       console.log("Saving document verification with body:", requestBody);
      
//       const response = await updateDocumentVerification(requestBody);
//       console.log("Save response received:", response);
      
//       if (response && response.success) {
//         setSuccessMessage(`Document verification updated successfully! Status: ${finalStatus}`);
        
//         // Update current student with new data
//         setCurrentStudent(prev => ({
//           ...prev,
//           ...documents,
//           finalAdmissionStatus: finalStatus
//         }));
        
//         setTimeout(() => setSuccessMessage(""), 3000);
//         setError("");
//       } else {
//         console.error("Response success was false:", response);
//         setError(response?.message || "Failed to save document verification");
//       }
//     } catch (error) {
//       console.error("Error in saveDocumentVerification:", error);
      
//       let errorMessage = "An error occurred while saving document verification";
      
//       if (error.response) {
//         errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
//         console.error("Server error response:", error.response.data);
//       } else if (error.request) {
//         errorMessage = "Network error: Could not connect to server. Please check if backend is running.";
//         console.error("No response received:", error.request);
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setSavingDocuments(false);
//     }
//   };

//   // Handle next student
//   const handleNextStudent = () => {
//     setCurrentStudent(null);
//     setSrnInput("");
//     setShowSRNSearch(true);
//     setStudentNotFound(false);
//     setError("");
//     setDocuments({
//       student3PassportSizedPhoto: false,
//       studentAadharCardPhotoCopuy: false,
//       parentsAaadhar: false,
//       preCounsellingForm: false,
//       class8MarksheetPhotoCopy: false,
//       pppPhotocopy: false,
//       slc: false
//     });
//   };

//   // Reset everything
//   const handleReset = () => {
//     setSelectedDistrict("");
//     setSelectedVenue("");
//     setAccessCode("");
//     setAccessCodeVerified(false);
//     setCurrentStudent(null);
//     setSrnInput("");
//     setError("");
//     setSuccessMessage("");
//     setStudentNotFound(false);
//     setShowSRNSearch(false);
//     setMainAccordionOpen(["0"]);
//     setDocuments({
//       student3PassportSizedPhoto: false,
//       studentAadharCardPhotoCopuy: false,
//       parentsAaadhar: false,
//       preCounsellingForm: false,
//       class8MarksheetPhotoCopy: false,
//       pppPhotocopy: false,
//       slc: false
//     });
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     switch(status) {
//       case "Selected":
//         return <Badge bg="success">Selected</Badge>;
//       case "Waiting":
//         return <Badge bg="warning" text="dark">Waiting</Badge>;
//       default:
//         return <Badge bg="secondary">{status || "N/A"}</Badge>;
//     }
//   };

//   // Get admission status badge
//   const getAdmissionStatusBadge = (status) => {
//     switch(status) {
//       case "Admission Done":
//         return <Badge bg="success">Admission Done</Badge>;
//       case "Provisional":
//         return <Badge bg="warning" text="dark">Provisional</Badge>;
//       case "Waiting":
//         return <Badge bg="secondary">Waiting</Badge>;
//       default:
//         return <Badge bg="info">{status || "Not Set"}</Badge>;
//     }
//   };

//   return (
//     <Container fluid className="mt-4">
//       {/* Modal for Document Verification Alert */}
//       <Modal show={showDocVerificationAlert} onHide={() => setShowDocVerificationAlert(false)} centered>
//         <Modal.Header closeButton style={{ background: '#dc3545', color: 'white' }}>
//           <Modal.Title>
//             <i className="bi bi-exclamation-triangle-fill me-2"></i>
//             Document Verification Required
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-center py-4">
//           <i className="bi bi-file-earmark-x" style={{ fontSize: '4rem', color: '#dc3545' }}></i>
//           <h5 className="mt-3">Please Complete Document Verification First</h5>
//           <p className="text-muted mt-2">
//             This student has not completed the document verification process.
//             <br />
//             Please go to <strong>Document Verification</strong> section and verify all documents first.
//           </p>
//           <div className="mt-3 p-3 bg-light rounded">
//             <small className="text-muted">
//               <i className="bi bi-info-circle me-1"></i>
//               Student must have one of these statuses: <strong>Admission Done</strong>, <strong>Provisional</strong>, or <strong>Waiting</strong>
//             </small>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="danger" onClick={() => setShowDocVerificationAlert(false)}>
//             <i className="bi bi-check-circle me-2"></i>
//             OK, Understood
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Row>
//         <Col md={12}>
//           {/* Main Form Accordion */}
//           <Accordion activeKey={mainAccordionOpen} onSelect={(eventKey) => setMainAccordionOpen(eventKey)}>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="d-flex justify-content-between align-items-center w-100 me-3">
//                   <span>
//                     <i className="bi bi-file-check me-2"></i>
//                     MB Counselling - Selected/Provisional/Waiting Students
//                   </span>
//                   {selectedVenue && accessCodeVerified && (
//                     <Badge bg="success" className="ms-2">
//                       ✓ Verified
//                     </Badge>
//                   )}
//                 </div>
//               </Accordion.Header>
//               <Accordion.Body>
//                 {/* Success Message */}
//                 {successMessage && (
//                   <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
//                     {successMessage}
//                   </Alert>
//                 )}
                
//                 {/* Error Message */}
//                 {error && (
//                   <Alert variant="danger" onClose={() => setError("")} dismissible>
//                     {error}
//                   </Alert>
//                 )}
                
//                 <Form onSubmit={handleSubmit}>
//                   <Row>
//                     <Col md={6}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>District <span className="text-danger">*</span></Form.Label>
//                         <Form.Select
//                           value={selectedDistrict}
//                           onChange={handleDistrictChange}
//                           disabled={loading}
//                           required
//                         >
//                           <option value="">Select District</option>
//                           {districts.map((district) => (
//                             <option key={district.id} value={district.id}>
//                               {district.name}
//                             </option>
//                           ))}
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
                    
//                     <Col md={6}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Examination Venue <span className="text-danger">*</span></Form.Label>
//                         <Form.Select
//                           value={selectedVenue}
//                           onChange={handleVenueChange}
//                           disabled={!selectedDistrict || loading}
//                           required
//                         >
//                           <option value="">Select Venue</option>
//                           {filteredVenues.map((venue) => (
//                             <option key={venue._id} value={venue.examinationVenue}>
//                               {venue.examinationVenue}
//                             </option>
//                           ))}
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
//                   </Row>
                  
//                   <Row>
//                     <Col md={12}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Access Code <span className="text-danger">*</span></Form.Label>
//                         <InputGroup>
//                           <InputGroup.Text>🔐</InputGroup.Text>
//                           <Form.Control
//                             type="password"
//                             placeholder="Enter access code"
//                             value={accessCode}
//                             onChange={handleAccessCodeChange}
//                             disabled={!selectedVenue}
//                             required
//                             maxLength={7}
//                           />
//                           {accessCode && !accessCodeVerified && selectedVenue && (
//                             <Button 
//                               variant="outline-secondary" 
//                               onClick={verifyAccessCode}
//                               type="button"
//                             >
//                               Verify
//                             </Button>
//                           )}
//                         </InputGroup>
//                         {selectedDistrict && (
//                           <Form.Text className="text-muted">
//                             {getAccessCodeHint()}
//                           </Form.Text>
//                         )}
//                       </Form.Group>
//                     </Col>
//                   </Row>
                  
//                   <Row>
//                     <Col md={12}>
//                       <Button 
//                         type="submit" 
//                         variant="primary" 
//                         disabled={fetchingData || !selectedVenue || !accessCode}
//                       >
//                         {fetchingData ? (
//                           <>
//                             <Spinner
//                               as="span"
//                               animation="border"
//                               size="sm"
//                               role="status"
//                               aria-hidden="true"
//                             /> Verifying...
//                           </>
//                         ) : (
//                           "Verify & Proceed"
//                         )}
//                       </Button>
//                     </Col>
//                   </Row>
                  
//                   {accessCodeVerified && selectedVenue && (
//                     <Alert variant="success" className="mt-3">
//                       ✓ Access code verified successfully! Click on "Verify & Proceed" to search for students.
//                     </Alert>
//                   )}
//                 </Form>
//               </Accordion.Body>
//             </Accordion.Item>
//           </Accordion>
//         </Col>
//       </Row>
      
//       {/* SRN Search Section */}
//       {showSRNSearch && accessCodeVerified && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Card className="shadow-lg border-0 bg-gradient-search">
//               <Card.Body className="p-5">
//                 <div className="text-center mb-4">
//                   <div className="search-icon mb-3">
//                     <i className="bi bi-search-heart" style={{ fontSize: '4rem', color: '#667eea' }}></i>
//                   </div>
//                   <h3 className="mb-2">Student Search</h3>
//                   <p className="text-muted">Enter SRN to view student details</p>
//                   <Badge bg="info" className="mb-3">
//                     <i className="bi bi-building me-1"></i>
//                     Venue: {selectedVenue}
//                   </Badge>
//                 </div>
                
//                 <Row className="justify-content-center">
//                   <Col md={8}>
//                     <Form.Group>
//                       <InputGroup className="shadow-lg" style={{ borderRadius: '50px', overflow: 'hidden' }}>
//                         <InputGroup.Text style={{ background: '#fff', border: 'none', padding: '12px 20px' }}>
//                           <i className="bi bi-person-badge" style={{ fontSize: '1.2rem', color: '#667eea' }}></i>
//                         </InputGroup.Text>
//                         <Form.Control
//                           type="text"
//                           placeholder="Enter Student SRN"
//                           value={srnInput}
//                           onChange={(e) => setSrnInput(e.target.value)}
//                           onKeyPress={handleSRNKeyPress}
//                           disabled={searchingStudent}
//                           autoFocus
//                           style={{ padding: '12px', border: 'none', fontSize: '1.1rem' }}
//                         />
//                         <Button 
//                           variant="primary" 
//                           onClick={handleSRNSearch}
//                           disabled={searchingStudent || !srnInput.trim()}
//                           style={{ padding: '12px 30px', borderRadius: '0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
//                         >
//                           {searchingStudent ? (
//                             <Spinner as="span" animation="border" size="sm" />
//                           ) : (
//                             <>
//                               <i className="bi bi-search me-2"></i>
//                               Search
//                             </>
//                           )}
//                         </Button>
//                       </InputGroup>
//                       <Form.Text className="text-muted d-block text-center mt-3">
//                         <i className="bi bi-info-circle me-1"></i>
//                         Enter valid SRN to fetch student details from the selected venue.
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row className="mt-4">
//                   <Col md={12} className="text-center">
//                     <Button variant="outline-secondary" onClick={handleReset}>
//                       <i className="bi bi-arrow-repeat me-2"></i>
//                       Start Over
//                     </Button>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}
      
//       {/* Student Not Found Message */}
//       {studentNotFound && showSRNSearch && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Alert variant="warning" className="border-0 shadow-lg text-center">
//               <i className="bi bi-emoji-frown" style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}></i>
//               <h5>Student Not Found</h5>
//               <p>No student found with SRN: <strong>{srnInput}</strong> at venue: <strong>{selectedVenue}</strong></p>
//               <Button variant="outline-warning" onClick={() => setSrnInput("")}>
//                 Try Again
//               </Button>
//             </Alert>
//           </Col>
//         </Row>
//       )}
      
//       {/* Student Details and Document Verification Card */}
//       {currentStudent && !showSRNSearch && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Card className="shadow-lg border-0 student-profile-card">
//               <Card.Header className="bg-gradient-success text-white">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">
//                     <i className="bi bi-person-circle me-2"></i>
//                     Student Details & Admission Status
//                   </h5>
//                   <div className="d-flex gap-2">
//                     {getStatusBadge(currentStudent.selectionStatusForL3)}
//                     {getAdmissionStatusBadge(currentStudent.finalAdmissionStatus)}
//                   </div>
//                 </div>
//               </Card.Header>
//               <Card.Body className="p-4">
//                 {/* Student Information Section */}
//                 <Row className="mb-4">
//                   <Col md={12}>
//                     <div className="student-info p-3" style={{ background: '#f8f9fa', borderRadius: '10px' }}>
//                       <Row>
//                         <Col md={3}>
//                           <strong>Name:</strong> {currentStudent.name}
//                         </Col>
//                         <Col md={3}>
//                           <strong>SRN:</strong> {currentStudent.srn}
//                         </Col>
//                         <Col md={3}>
//                           <strong>Father's Name:</strong> {currentStudent.father}
//                         </Col>
//                         <Col md={3}>
//                           <strong>Class:</strong> {currentStudent.classOfStudent}
//                         </Col>
//                         <Col md={3} className="mt-2">
//                           <strong>School:</strong> {currentStudent.school}
//                         </Col>
//                         <Col md={3} className="mt-2">
//                           <strong>District:</strong> {currentStudent.schoolDistrict}
//                         </Col>
//                         <Col md={3} className="mt-2">
//                           <strong>Block:</strong> {currentStudent.schoolBlock}
//                         </Col>
//                         <Col md={3} className="mt-2">
//                           <strong>Selection Status:</strong> {getStatusBadge(currentStudent.selectionStatusForL3)}
//                         </Col>
//                         <Col md={3} className="mt-2">
//                           <strong>Admission Status:</strong> {getAdmissionStatusBadge(currentStudent.finalAdmissionStatus)}
//                         </Col>
//                       </Row>
//                     </div>
//                   </Col>
//                 </Row>
                
//                 {/* Status Information Display */}
//                 <Row>
//                   <Col md={12}>
//                     <div className="mt-3 p-3" style={{ background: '#e7f3ff', borderRadius: '10px', borderLeft: '4px solid #2196f3' }}>
//                       <h6 className="mb-2">Student Admission Information:</h6>
//                       <div className="mb-2">
//                         <Badge bg="success" className="me-2">Admission Done</Badge>
//                         <span>Student has completed all formalities and SLC verification</span>
//                       </div>
//                       <div className="mb-2">
//                         <Badge bg="warning" text="dark" className="me-2">Provisional</Badge>
//                         <span>Student is selected but SLC verification pending</span>
//                       </div>
//                       <div>
//                         <Badge bg="secondary" className="me-2">Waiting</Badge>
//                         <span>Student is in waiting list</span>
//                       </div>
//                       <div className="mt-3 pt-2 border-top">
//                         <strong>Current Status:</strong> {getAdmissionStatusBadge(currentStudent.finalAdmissionStatus)}
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//               </Card.Body>
//               <Card.Footer className="bg-light">
//                 <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
//                   <Button 
//                     variant="danger" 
//                     onClick={handleReset}
//                     className="px-4"
//                   >
//                     <i className="bi bi-x-circle me-2"></i>
//                     Reset All
//                   </Button>
//                   <div className="d-flex gap-2">
//                     <Button 
//                       variant="primary" 
//                       onClick={handleNextStudent}
//                       className="px-4"
//                     >
//                       <i className="bi bi-arrow-right-circle me-2"></i>
//                       Next Student
//                     </Button>
//                   </div>
//                 </div>
//               </Card.Footer>
//             </Card>
//           </Col>
//         </Row>
//       )}
      
//       <style jsx>{`
//         .bg-gradient-search {
//           background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//         }
        
//         .student-profile-card {
//           animation: slideIn 0.5s ease;
//         }
        
//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @media (max-width: 768px) {
//           .student-info {
//             font-size: 0.9rem;
//           }
          
//           .btn {
//             width: 100%;
//             margin-bottom: 10px;
//           }
          
//           .d-flex.justify-content-between {
//             flex-direction: column;
//           }
//         }
//       `}</style>
//     </Container>
//   );
// };







import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, Accordion, Modal } from "react-bootstrap";
import { GetCentersDataByExaminationAndExamTypeCounselling } from "../../services/ExaminationVenue/ExaminationVenueServices";
import { GetAttendanceSheetDataCounselling, updateDocumentVerification } from "../../services/StudentRegistrationServices/StudentRegistrationService";

export const MBProvisionalSelectedCounselling = () => {
  const [centersData, setCentersData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [accessCodeVerified, setAccessCodeVerified] = useState(false);
  const [srnInput, setSrnInput] = useState("");
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [studentNotFound, setStudentNotFound] = useState(false);
  const [showSRNSearch, setShowSRNSearch] = useState(false);
  const [showDocVerificationAlert, setShowDocVerificationAlert] = useState(false);
  const [showCenterPreferenceAlert, setShowCenterPreferenceAlert] = useState(false);
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [updatingAdmission, setUpdatingAdmission] = useState(false);
  
  // Accordion state - main form expanded by default
  const [mainAccordionOpen, setMainAccordionOpen] = useState(["0"]);
  
  // Pre-defined access codes for districts
  const districtAccessCodes = [
    { districtId: "10", districtName: "KAITHAL", accessCode: "KTH7823" },
    { districtId: "3", districtName: "CHARKHI DADRI", accessCode: "CHD5641" },
    { districtId: "15", districtName: "PALWAL", accessCode: "PAL3497" },
    { districtId: "19", districtName: "ROHTAK", accessCode: "ROH2156" },
    { districtId: "2", districtName: "BHIWANI", accessCode: "BHW9082" },
    { districtId: "22", districtName: "YAMUNANAGAR", accessCode: "YAM6734" },
    { districtId: "6", districtName: "GURUGRAM", accessCode: "GUR4512" },
    { districtId: "1", districtName: "AMBALA", accessCode: "AMB8291" },
    { districtId: "14", districtName: "NUH MEWAT", accessCode: "NUH3675" },
    { districtId: "4", districtName: "FARIDABAD", accessCode: "FAR1946" },
    { districtId: "5", districtName: "FATEHABAD", accessCode: "FAT7583" },
    { districtId: "17", districtName: "PANIPAT", accessCode: "PAN6429" },
    { districtId: "8", districtName: "JHAJJAR", accessCode: "JHJ5178" },
    { districtId: "7", districtName: "HISAR", accessCode: "HIS2934" },
    { districtId: "9", districtName: "JIND", accessCode: "JIN8751" },
    { districtId: "11", districtName: "KARNAL", accessCode: "KAR4062" },
    { districtId: "12", districtName: "KURUKSHETRA", accessCode: "KUR1398" },
    { districtId: "21", districtName: "SONIPAT", accessCode: "SON7546" },
    { districtId: "16", districtName: "PANCHKULA", accessCode: "PAN2813" },
    { districtId: "18", districtName: "REWARI", accessCode: "REW6974" },
    { districtId: "20", districtName: "SIRSA", accessCode: "SIR4257" },
    { districtId: "13", districtName: "MAHENDRAGARH", accessCode: "MAH8639" }
  ];

  // Fetch all counseling centers
  const fetchCounsellingCenters = async () => {
    setLoading(true);
    try {
      const response = await GetCentersDataByExaminationAndExamTypeCounselling();
      console.log("Centers data:", response.data);
      setCentersData(response.data || []);
      
      // Extract unique districts
      const uniqueDistricts = [];
      const districtMap = new Map();
      
      (response.data || []).forEach(center => {
        if (!districtMap.has(center.districtId)) {
          districtMap.set(center.districtId, {
            id: center.districtId,
            name: center.districtName
          });
          uniqueDistricts.push({
            id: center.districtId,
            name: center.districtName
          });
        }
      });
      
      setDistricts(uniqueDistricts);
      setLoading(false);
    } catch (error) {
      console.error("Error occurred while fetching counseling centers", error);
      setError("Failed to fetch counseling centers");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounsellingCenters();
  }, []);

  // Handle district selection
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedVenue("");
    setAccessCode("");
    setAccessCodeVerified(false);
    setError("");
    setCurrentStudent(null);
    setShowSRNSearch(false);
    setSrnInput("");
    
    const venues = centersData.filter(center => center.districtId === districtId);
    setFilteredVenues(venues);
  };

  // Handle venue selection
  const handleVenueChange = (e) => {
    setSelectedVenue(e.target.value);
    setAccessCodeVerified(false);
    setAccessCode("");
    setCurrentStudent(null);
    setShowSRNSearch(false);
    setSrnInput("");
  };

  // Handle access code change
  const handleAccessCodeChange = (e) => {
    setAccessCode(e.target.value);
    setAccessCodeVerified(false);
    setError("");
  };

  // Get access code hint for selected district
  const getAccessCodeHint = () => {
    if (!selectedDistrict) return "";
    const districtCode = districtAccessCodes.find(
      dc => dc.districtId === selectedDistrict
    );
    
    if (districtCode) {
      const code = districtCode.accessCode;
      const maskedCode = code.substring(0, 3) + "****" + code.substring(code.length - 2);
      return `Hint: Access code format: ${maskedCode} (${code.length} characters)`;
    }
    return "Contact administrator for access code";
  };

  // Verify access code
  const verifyAccessCode = () => {
    if (!selectedDistrict) {
      setError("Please select a district first");
      return false;
    }

    const selectedDistrictObj = districts.find(d => d.id === selectedDistrict);
    if (!selectedDistrictObj) {
      setError("District not found");
      return false;
    }

    const districtCode = districtAccessCodes.find(
      dc => dc.districtId === selectedDistrict
    );

    if (!districtCode) {
      setError("Access code not configured for this district. Please contact administrator.");
      return false;
    }

    if (districtCode.accessCode === accessCode) {
      setAccessCodeVerified(true);
      setError("");
      return true;
    } else {
      setError(`Invalid access code for ${selectedDistrictObj.name}. Please enter the correct access code.`);
      setAccessCodeVerified(false);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedVenue) {
      setError("Please select a venue");
      return;
    }

    if (!accessCode) {
      setError("Please enter the access code");
      return;
    }

    if (!verifyAccessCode()) {
      return;
    }
    
    setError("");
    setSuccessMessage("");
    setCurrentStudent(null);
    setStudentNotFound(false);
    setShowSRNSearch(true);
    setMainAccordionOpen([]);
    setDateOfAdmission("");
    
    setSuccessMessage("Access code verified! Please enter SRN to fetch student details.");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  // Check if student has completed document verification
  const hasCompletedDocVerification = (student) => {
    const validStatuses = ["Admission Done", "Provisional", "Waiting"];
    return student.finalAdmissionStatus && validStatuses.includes(student.finalAdmissionStatus);
  };

  // Check if student has completed center preference
  const hasCompletedCenterPreference = (student) => {
    return student.centerPreference1 && student.centerPreference1 !== null && student.centerPreference1 !== "";
  };

  // Handle SRN search and fetch student data
  const handleSRNSearch = async () => {
    if (!srnInput.trim()) {
      setError("Please enter SRN");
      return;
    }

    setSearchingStudent(true);
    setError("");
    setStudentNotFound(false);
    setCurrentStudent(null);
    setShowDocVerificationAlert(false);
    setShowCenterPreferenceAlert(false);
    setDateOfAdmission("");
    
    try {
      const requestBody = {
        counsellingVenue: selectedVenue,
        selectionStatusForL3: "",
        gender: "",
        srn: srnInput.trim()
      };
      
      console.log("Fetching student with SRN:", requestBody);
      
      const response = await GetAttendanceSheetDataCounselling(requestBody);
      console.log("Full response:", response);
      
      let student = null;
      
      if (response && response.data) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          student = response.data[0];
        } else if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          student = response.data.data[0];
        } else if (typeof response.data === 'object' && response.data._id) {
          student = response.data;
        }
      } else if (Array.isArray(response) && response.length > 0) {
        student = response[0];
      } else if (response && response._id) {
        student = response;
      }
      
      console.log("Extracted student:", student);
      
      if (student) {
        // Check if student has completed document verification
        if (!hasCompletedDocVerification(student)) {
          console.log("Student has not completed document verification");
          setShowDocVerificationAlert(true);
          setSearchingStudent(false);
          return;
        }
        
        // Check if student has completed center preference
        if (!hasCompletedCenterPreference(student)) {
          console.log("Student has not completed center preference");
          setShowCenterPreferenceAlert(true);
          setSearchingStudent(false);
          return;
        }
        
        setCurrentStudent(student);
        setDateOfAdmission(student.dateOfAdmission || "");
        setStudentNotFound(false);
        setShowSRNSearch(false);
        setSuccessMessage(`✓ Student found: ${student.name}`);
        setTimeout(() => setSuccessMessage(""), 3000);
        
      } else {
        setStudentNotFound(true);
        setCurrentStudent(null);
        setError(`No student found with SRN: ${srnInput} at venue: ${selectedVenue}`);
      }
    } catch (error) {
      console.error("Error fetching student data", error);
      setError("An error occurred while fetching student data: " + (error.message || "Unknown error"));
      setStudentNotFound(true);
    } finally {
      setSearchingStudent(false);
    }
  };

  // Handle Enter key press
  const handleSRNKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSRNSearch();
    }
  };

  // Update date of admission
  const updateDateOfAdmission = async () => {
    if (!currentStudent) {
      setError("No student selected");
      return;
    }
    
    if (!dateOfAdmission) {
      setError("Please select a date");
      return;
    }
    
    setUpdatingAdmission(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const requestBody = {
        _id: currentStudent._id,
        dateOfAdmission: dateOfAdmission
      };
      
      console.log("Updating date of admission:", requestBody);
      
      const response = await updateDocumentVerification(requestBody);
      console.log("Update response:", response);
      
      if (response && response.success) {
        setSuccessMessage("Date of admission updated successfully!");
        setCurrentStudent(prev => ({
          ...prev,
          dateOfAdmission: dateOfAdmission
        }));
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response?.message || "Failed to update date of admission");
      }
    } catch (error) {
      console.error("Error updating date of admission:", error);
      setError(error.response?.data?.message || "An error occurred while updating date of admission");
    } finally {
      setUpdatingAdmission(false);
    }
  };

  // Handle next student
  const handleNextStudent = () => {
    setCurrentStudent(null);
    setSrnInput("");
    setShowSRNSearch(true);
    setStudentNotFound(false);
    setError("");
    setDateOfAdmission("");
  };

  // Reset everything
  const handleReset = () => {
    setSelectedDistrict("");
    setSelectedVenue("");
    setAccessCode("");
    setAccessCodeVerified(false);
    setCurrentStudent(null);
    setSrnInput("");
    setError("");
    setSuccessMessage("");
    setStudentNotFound(false);
    setShowSRNSearch(false);
    setMainAccordionOpen(["0"]);
    setDateOfAdmission("");
  };

  // Get center name by ID
  const getCenterName = (centerId) => {
    if (!centerId) return "Not Assigned";
    return centerId;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "Selected":
        return <Badge bg="success">Selected</Badge>;
      case "Waiting":
        return <Badge bg="warning" text="dark">Waiting</Badge>;
      default:
        return <Badge bg="secondary">{status || "N/A"}</Badge>;
    }
  };

  // Get admission status badge
  const getAdmissionStatusBadge = (status) => {
    switch(status) {
      case "Admission Done":
        return <Badge bg="success">Admission Done</Badge>;
      case "Provisional":
        return <Badge bg="warning" text="dark">Provisional</Badge>;
      case "Waiting":
        return <Badge bg="secondary">Waiting</Badge>;
      default:
        return <Badge bg="info">{status || "Not Set"}</Badge>;
    }
  };

  // Close document verification alert and reset to SRN search
  const closeDocVerificationAlert = () => {
    setShowDocVerificationAlert(false);
    setSrnInput("");
    setShowSRNSearch(true);
  };

  // Close center preference alert and reset to SRN search
  const closeCenterPreferenceAlert = () => {
    setShowCenterPreferenceAlert(false);
    setSrnInput("");
    setShowSRNSearch(true);
  };

  return (
    <Container fluid className="mt-4">
      {/* Modal for Document Verification Alert */}
      <Modal show={showDocVerificationAlert} onHide={closeDocVerificationAlert} centered>
        <Modal.Header closeButton style={{ background: '#dc3545', color: 'white' }}>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Document Verification Required
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <i className="bi bi-file-earmark-x" style={{ fontSize: '4rem', color: '#dc3545' }}></i>
          <h5 className="mt-3">Please Complete Document Verification First</h5>
          <p className="text-muted mt-2">
            This student has not completed the document verification process.
            <br />
            Please go to <strong>Document Verification</strong> section and verify all documents first.
          </p>
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Student must have one of these statuses: <strong>Admission Done</strong>, <strong>Provisional</strong>, or <strong>Waiting</strong>
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeDocVerificationAlert}>
            <i className="bi bi-check-circle me-2"></i>
            OK, Go Back
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Center Preference Alert */}
      <Modal show={showCenterPreferenceAlert} onHide={closeCenterPreferenceAlert} centered>
        <Modal.Header closeButton style={{ background: '#ffc107', color: '#000' }}>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Center Preference Required
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <i className="bi bi-building-x" style={{ fontSize: '4rem', color: '#ffc107' }}></i>
          <h5 className="mt-3">Please Complete Center Preference First</h5>
          <p className="text-muted mt-2">
            This student has not selected their center preferences yet.
            <br />
            Please go to <strong>Center Preference</strong> section and select preferred centers first.
          </p>
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Student must select at least one center preference (CP1)
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={closeCenterPreferenceAlert}>
            <i className="bi bi-check-circle me-2"></i>
            OK, Go Back
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col md={12}>
          {/* Main Form Accordion */}
          <Accordion activeKey={mainAccordionOpen} onSelect={(eventKey) => setMainAccordionOpen(eventKey)}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className="d-flex justify-content-between align-items-center w-100 me-3">
                  <span>
                    <i className="bi bi-file-check me-2"></i>
                    MB Counselling - Admission Status
                  </span>
                  {selectedVenue && accessCodeVerified && (
                    <Badge bg="success" className="ms-2">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
              </Accordion.Header>
              <Accordion.Body>
                {/* Success Message */}
                {successMessage && (
                  <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                    {successMessage}
                  </Alert>
                )}
                
                {/* Error Message */}
                {error && (
                  <Alert variant="danger" onClose={() => setError("")} dismissible>
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>District <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                          disabled={loading}
                          required
                        >
                          <option value="">Select District</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.id}>
                              {district.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Examination Venue <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          value={selectedVenue}
                          onChange={handleVenueChange}
                          disabled={!selectedDistrict || loading}
                          required
                        >
                          <option value="">Select Venue</option>
                          {filteredVenues.map((venue) => (
                            <option key={venue._id} value={venue.examinationVenue}>
                              {venue.examinationVenue}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Access Code <span className="text-danger">*</span></Form.Label>
                        <InputGroup>
                          <InputGroup.Text>🔐</InputGroup.Text>
                          <Form.Control
                            type="password"
                            placeholder="Enter access code"
                            value={accessCode}
                            onChange={handleAccessCodeChange}
                            disabled={!selectedVenue}
                            required
                            maxLength={7}
                          />
                          {accessCode && !accessCodeVerified && selectedVenue && (
                            <Button 
                              variant="outline-secondary" 
                              onClick={verifyAccessCode}
                              type="button"
                            >
                              Verify
                            </Button>
                          )}
                        </InputGroup>
                        {selectedDistrict && (
                          <Form.Text className="text-muted">
                            {getAccessCodeHint()}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={12}>
                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={fetchingData || !selectedVenue || !accessCode}
                      >
                        {fetchingData ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            /> Verifying...
                          </>
                        ) : (
                          "Verify & Proceed"
                        )}
                      </Button>
                    </Col>
                  </Row>
                  
                  {accessCodeVerified && selectedVenue && (
                    <Alert variant="success" className="mt-3">
                      ✓ Access code verified successfully! Click on "Verify & Proceed" to search for students.
                    </Alert>
                  )}
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      
      {/* SRN Search Section */}
      {showSRNSearch && accessCodeVerified && (
        <Row className="mt-4">
          <Col md={12}>
            <Card className="shadow-lg border-0 bg-gradient-search">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="search-icon mb-3">
                    <i className="bi bi-search-heart" style={{ fontSize: '4rem', color: '#667eea' }}></i>
                  </div>
                  <h3 className="mb-2">Student Admission Status</h3>
                  <p className="text-muted">Enter SRN To Check Admission Status</p>
                  <Badge bg="info" className="mb-3">
                    <i className="bi bi-building me-1"></i>
                    Venue: {selectedVenue}
                  </Badge>
                </div>
                
                <Row className="justify-content-center">
                  <Col md={8}>
                    <Form.Group>
                      <InputGroup className="shadow-lg" style={{ borderRadius: '50px', overflow: 'hidden' }}>
                        <InputGroup.Text style={{ background: '#fff', border: 'none', padding: '12px 20px' }}>
                          <i className="bi bi-person-badge" style={{ fontSize: '1.2rem', color: '#667eea' }}></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Enter Student SRN"
                          value={srnInput}
                          onChange={(e) => setSrnInput(e.target.value)}
                          onKeyPress={handleSRNKeyPress}
                          disabled={searchingStudent}
                          autoFocus
                          style={{ padding: '12px', border: 'none', fontSize: '1.1rem' }}
                        />
                        <Button 
                          variant="primary" 
                          onClick={handleSRNSearch}
                          disabled={searchingStudent || !srnInput.trim()}
                          style={{ padding: '12px 30px', borderRadius: '0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                        >
                          {searchingStudent ? (
                            <Spinner as="span" animation="border" size="sm" />
                          ) : (
                            <>
                              <i className="bi bi-search me-2"></i>
                              Search
                            </>
                          )}
                        </Button>
                      </InputGroup>
                      <Form.Text className="text-muted d-block text-center mt-3">
                        <i className="bi bi-info-circle me-1"></i>
                    
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mt-4">
                  <Col md={12} className="text-center">
                    <Button variant="outline-secondary" onClick={handleReset}>
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Start Over
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* Student Not Found Message */}
      {studentNotFound && showSRNSearch && (
        <Row className="mt-4">
          <Col md={12}>
            <Alert variant="warning" className="border-0 shadow-lg text-center">
              <i className="bi bi-emoji-frown" style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}></i>
              <h5>Student Not Found</h5>
              <p>No student found with SRN: <strong>{srnInput}</strong> at venue: <strong>{selectedVenue}</strong></p>
              <Button variant="outline-warning" onClick={() => setSrnInput("")}>
                Try Again
              </Button>
            </Alert>
          </Col>
        </Row>
      )}
      
      {/* Student Dashboard */}
      {currentStudent && !showSRNSearch && (
        <Row className="mt-4">
          <Col md={12}>
            <Card className="shadow-lg border-0 student-dashboard-card">
              <Card.Header className="bg-gradient-primary text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-person-badge me-2"></i>
                    Student Admission Dashboard
                  </h5>
                  <div className="d-flex gap-2">
                    {getStatusBadge(currentStudent.selectionStatusForL3)}
                    {getAdmissionStatusBadge(currentStudent.finalAdmissionStatus)}
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Student Details Grid */}
                <Row>
                  <Col md={12}>
                    <div className="student-details-wrapper">
                      <Row className="g-4">
                        {/* Student Name */}
                        <Col md={6} lg={4}>
                          <div className="detail-card">
                            <div className="detail-icon">
                              <i className="bi bi-person-circle"></i>
                            </div>
                            <div className="detail-content">
                              <label className="detail-label">Student Name</label>
                              <div className="detail-value">{currentStudent.name || "N/A"}</div>
                            </div>
                          </div>
                        </Col>
                        
                        {/* SRN */}
                        <Col md={6} lg={4}>
                          <div className="detail-card">
                            <div className="detail-icon">
                              <i className="bi bi-hash"></i>
                            </div>
                            <div className="detail-content">
                              <label className="detail-label">SRN</label>
                              <div className="detail-value">{currentStudent.srn || "N/A"}</div>
                            </div>
                          </div>
                        </Col>
                        
                        {/* Father's Name */}
                        <Col md={6} lg={4}>
                          <div className="detail-card">
                            <div className="detail-icon">
                              <i className="bi bi-person"></i>
                            </div>
                            <div className="detail-content">
                              <label className="detail-label">Father's Name</label>
                              <div className="detail-value">{currentStudent.father || "N/A"}</div>
                            </div>
                          </div>
                        </Col>
                        
                        {/* Mother's Name */}
                        <Col md={6} lg={4}>
                          <div className="detail-card">
                            <div className="detail-icon">
                              <i className="bi bi-person"></i>
                            </div>
                            <div className="detail-content">
                              <label className="detail-label">Mother's Name</label>
                              <div className="detail-value">{currentStudent.mother || "N/A"}</div>
                            </div>
                          </div>
                        </Col>
                        
                        {/* Mission Buniyaad Centre */}
                        <Col md={6} lg={4}>
                          <div className="detail-card">
                            <div className="detail-icon">
                              <i className="bi bi-building"></i>
                            </div>
                            <div className="detail-content">
                              <label className="detail-label">Mission Buniyaad Centre</label>
                              <div className="detail-value">
                                {currentStudent.centerPreference1 || "Not Assigned"}
                                {currentStudent.centerPreference2 && ` / ${currentStudent.centerPreference2}`}
                              </div>
                            </div>
                          </div>
                        </Col>
                        
                        {/* District */}
                        <Col md={6} lg={4}>
                          <div className="detail-card">
                            <div className="detail-icon">
                              <i className="bi bi-geo-alt"></i>
                            </div>
                            <div className="detail-content">
                              <label className="detail-label">District</label>
                              <div className="detail-value">{currentStudent.schoolDistrict || "N/A"}</div>
                            </div>
                          </div>
                        </Col>
                        
                        {/* Date of Admission */}
                        <Col md={6} lg={4}>
                          <div className="detail-card">
                            <div className="detail-icon">
                              <i className="bi bi-calendar-date"></i>
                            </div>
                            <div className="detail-content">
                              <label className="detail-label">Date of Admission</label>
                              <Form.Control
                                type="date"
                                value={dateOfAdmission}
                                onChange={(e) => setDateOfAdmission(e.target.value)}
                                className="date-input"
                                disabled={updatingAdmission}
                              />
                            </div>
                          </div>
                        </Col>
                        
                        {/* Final Admission Status */}
                        <Col md={6} lg={4}>
                          <div className="detail-card">
                            <div className="detail-icon">
                              <i className="bi bi-check-circle"></i>
                            </div>
                            <div className="detail-content">
                              <label className="detail-label">Final Admission Status</label>
                              <div className="detail-value">
                                {getAdmissionStatusBadge(currentStudent.finalAdmissionStatus)}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="bg-light">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <Button 
                    variant="danger" 
                    onClick={handleReset}
                    className="px-4"
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Reset All
                  </Button>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      onClick={updateDateOfAdmission}
                      disabled={updatingAdmission || !dateOfAdmission}
                      className="px-4"
                    >
                      {updatingAdmission ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i>
                          Update Date
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleNextStudent}
                      className="px-4"
                    >
                      <i className="bi bi-arrow-right-circle me-2"></i>
                      Next Student
                    </Button>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      )}
      
      <style jsx>{`
        .bg-gradient-search {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .student-dashboard-card {
          animation: slideIn 0.5s ease;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .student-details-wrapper {
          padding: 10px;
        }
        
        .detail-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }
        
        .detail-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          background: #fff;
        }
        
        .detail-icon {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          color: white;
          font-size: 1.5rem;
        }
        
        .detail-content {
          flex: 1;
        }
        
        .detail-label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6c757d;
          margin-bottom: 5px;
          font-weight: 600;
        }
        
        .detail-value {
          font-size: 1rem;
          font-weight: 500;
          color: #2c3e50;
        }
        
        .date-input {
          max-width: 200px;
          padding: 5px 10px;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .detail-card {
            flex-direction: column;
            text-align: center;
          }
          
          .detail-icon {
            margin-bottom: 10px;
          }
          
          .date-input {
            max-width: 100%;
          }
          
          .btn {
            width: 100%;
            margin-bottom: 10px;
          }
          
          .d-flex.justify-content-between {
            flex-direction: column;
          }
        }
      `}</style>
    </Container>
  );
};