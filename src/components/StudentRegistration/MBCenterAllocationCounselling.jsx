// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, Accordion, Table } from "react-bootstrap";
// import { GetCentersDataByExaminationAndExamTypeCounselling } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataCounselling, updateCenterPreference } from "../../services/StudentRegistrationServices/StudentRegistrationService";
// import MBCenters from "../StudentRegistration/MBCenters.json";

// // Static centers data
// const STATIC_CENTERS_DATA = MBCenters;

// export const MBCenterAllocationCounselling = () => {
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
//   const [availableCenters, setAvailableCenters] = useState([]);
//   const [savingPreferences, setSavingPreferences] = useState(false);
  
//   // Center preferences state
//   const [preferences, setPreferences] = useState({
//     centerPreference1: null,
//     centerPreference2: null,
//     homeToCp1Distance: "",
//     homeToCp2Distance: ""
//   });
  
//   // Accordion state - main form expanded by default
//   const [mainAccordionOpen, setMainAccordionOpen] = useState(["0"]);
  
//   // Pre-defined access codes for districts based on your data
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

//   // Handle form submission - Just verify access code and venue
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

//     // Verify access code before proceeding
//     if (!verifyAccessCode()) {
//       return;
//     }
    
//     // Clear any previous data
//     setError("");
//     setSuccessMessage("");
//     setCurrentStudent(null);
//     setStudentNotFound(false);
    
//     // Show SRN search card
//     setShowSRNSearch(true);
    
//     // Auto collapse the main accordion
//     setMainAccordionOpen([]);
    
//     setSuccessMessage("Access code verified! Please enter SRN to fetch student details.");
//     setTimeout(() => setSuccessMessage(""), 5000);
//   };

//   // Fetch centers by district ID from static data (all centers in the district)
//   const fetchCentersByDistrict = (districtId) => {
//     // Convert both to string for proper comparison
//     const districtIdStr = String(districtId).trim();
    
//     console.log("Looking for centers with districtId:", districtIdStr);
//     console.log("Total centers in STATIC_CENTERS_DATA:", STATIC_CENTERS_DATA.length);
    
//     // Filter centers that match the student's district ID and are not closed
//     const districtCenters = STATIC_CENTERS_DATA.filter(center => {
//       const centerDistrictId = String(center.districtId).trim();
//       const isMatch = centerDistrictId === districtIdStr;
//       const isOpen = !center.isCenterClosed;
      
//       if (isMatch) {
//         console.log("Found matching center:", center.centerName, "District:", center.districtId);
//       }
      
//       return isMatch && isOpen;
//     });
    
//     console.log(`Found ${districtCenters.length} centers for district ${districtIdStr}:`, districtCenters);
//     return districtCenters;
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
      
//       // Extract student data from different possible response structures
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
//         // Get student's district code - this is the key field for matching
//         const studentDistrictCode = student.schoolDistrictCode;
//         console.log("Student District Code:", studentDistrictCode, "Type:", typeof studentDistrictCode);
        
//         if (!studentDistrictCode) {
//           setError("Student district code not found");
//           setStudentNotFound(true);
//           setSearchingStudent(false);
//           return;
//         }
        
//         // Fetch available centers for this district (all centers in the district)
//         const districtCenters = fetchCentersByDistrict(studentDistrictCode);
        
//         if (districtCenters.length === 0) {
//           setError(`No centers available for district code: ${studentDistrictCode}. Please check if centers are configured for this district.`);
//           setStudentNotFound(true);
//           setSearchingStudent(false);
//           return;
//         }
        
//         setAvailableCenters(districtCenters);
//         setCurrentStudent(student);
        
//         // Load existing preferences if any
//         setPreferences({
//           centerPreference1: student.centerPreference1 || null,
//           centerPreference2: student.centerPreference2 || null,
//           homeToCp1Distance: student.homeToCp1Distance || "",
//           homeToCp2Distance: student.homeToCp2Distance || ""
//         });
        
//         setStudentNotFound(false);
//         setShowSRNSearch(false);
//         setSuccessMessage(`✓ Student found: ${student.name}`);
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//       } else {
//         console.log("No student found in response");
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

//   // Handle Enter key press in SRN input
//   const handleSRNKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSRNSearch();
//     }
//   };

//   // Handle center selection (checkbox)
//   const handleCenterSelection = (centerId, preferenceType) => {
//     if (preferenceType === 'cp1') {
//       // If CP1 is already selected, unselect it
//       if (preferences.centerPreference1 === centerId) {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference1: null,
//           homeToCp1Distance: ""
//         }));
//       } 
//       // If CP2 is selected with same center, prevent selection
//       else if (preferences.centerPreference2 === centerId) {
//         setError("This center is already selected as CP2");
//         setTimeout(() => setError(""), 3000);
//         return;
//       }
//       else {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference1: centerId
//         }));
//       }
//     } else {
//       // For CP2
//       if (preferences.centerPreference2 === centerId) {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference2: null,
//           homeToCp2Distance: ""
//         }));
//       }
//       else if (preferences.centerPreference1 === centerId) {
//         setError("This center is already selected as CP1");
//         setTimeout(() => setError(""), 3000);
//         return;
//       }
//       else {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference2: centerId
//         }));
//       }
//     }
//   };

//   // Handle distance change
//   const handleDistanceChange = (preferenceType, value) => {
//     if (preferenceType === 'cp1') {
//       setPreferences(prev => ({
//         ...prev,
//         homeToCp1Distance: value
//       }));
//     } else {
//       setPreferences(prev => ({
//         ...prev,
//         homeToCp2Distance: value
//       }));
//     }
//   };

//   // Validate preferences before saving
//   const validatePreferences = () => {
//     if (!preferences.centerPreference1) {
//       setError("Please select at least one center preference (CP1)");
//       return false;
//     }
    
//     if (!preferences.homeToCp1Distance || parseFloat(preferences.homeToCp1Distance) <= 0) {
//       setError("Please enter a valid distance for CP1");
//       return false;
//     }
    
//     if (preferences.centerPreference2 && (!preferences.homeToCp2Distance || parseFloat(preferences.homeToCp2Distance) <= 0)) {
//       setError("Please enter a valid distance for CP2");
//       return false;
//     }
    
//     return true;
//   };

//  const savePreferences = async () => {
//   console.log("=== savePreferences CALLED ===");
//   console.log("Current student:", currentStudent);
//   console.log("Current preferences:", preferences);
  
//   // Check if student exists
//   if (!currentStudent) {
//     console.error("No current student found");
//     setError("No student selected");
//     return;
//   }
  
//   // Validate preferences
//   if (!validatePreferences()) {
//     console.log("Validation failed");
//     return;
//   }
  
//   setSavingPreferences(true);
//   setError("");
//   setSuccessMessage("");
  
//   try {
//     const requestBody = {
//       _id: currentStudent._id,
//       centerPreference1: preferences.centerPreference1,
//       centerPreference2: preferences.centerPreference2 || null,
//       homeToCp1Distance: parseFloat(preferences.homeToCp1Distance),
//       homeToCp2Distance: preferences.homeToCp2Distance ? parseFloat(preferences.homeToCp2Distance) : null
//     };
    
//     console.log("Saving preferences with body:", requestBody);
//     console.log("Calling updateCenterPreference service...");
    
//     // Make sure the service function is imported correctly
//     if (typeof updateCenterPreference !== 'function') {
//       console.error("updateCenterPreference is not a function! Import might be wrong.");
//       setError("Service function not available");
//       setSavingPreferences(false);
//       return;
//     }
    
//     const response = await updateCenterPreference(requestBody);
//     console.log("Save response received:", response);
    
//     if (response && response.success) {
//       console.log("Preferences saved successfully");
//       setSuccessMessage("Center preferences updated successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
      
//       // Update current student with new preferences
//       setCurrentStudent(prev => ({
//         ...prev,
//         centerPreference1: requestBody.centerPreference1,
//         centerPreference2: requestBody.centerPreference2,
//         homeToCp1Distance: requestBody.homeToCp1Distance,
//         homeToCp2Distance: requestBody.homeToCp2Distance
//       }));
      
//       // Clear any existing errors
//       setError("");
//     } else {
//       console.error("Response success was false or missing:", response);
//       setError(response?.message || "Failed to save preferences");
//     }
//   } catch (error) {
//     console.error("Error in savePreferences catch block:", error);
    
//     // More detailed error handling
//     let errorMessage = "An error occurred while saving preferences";
    
//     if (error.response) {
//       // Server responded with error
//       errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
//       console.error("Server error response:", error.response.data);
//     } else if (error.request) {
//       // Request was made but no response
//       errorMessage = "Network error: Could not connect to server. Please check if backend is running.";
//       console.error("No response received:", error.request);
//     } else if (error.message) {
//       // Other error
//       errorMessage = error.message;
//     }
    
//     setError(errorMessage);
//   } finally {
//     setSavingPreferences(false);
//     console.log("savePreferences completed");
//   }
// };
//   // Handle next student
//   const handleNextStudent = () => {
//     setCurrentStudent(null);
//     setSrnInput("");
//     setShowSRNSearch(true);
//     setStudentNotFound(false);
//     setError("");
//     setAvailableCenters([]);
//     setPreferences({
//       centerPreference1: null,
//       centerPreference2: null,
//       homeToCp1Distance: "",
//       homeToCp2Distance: ""
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
//     setAvailableCenters([]);
//     setPreferences({
//       centerPreference1: null,
//       centerPreference2: null,
//       homeToCp1Distance: "",
//       homeToCp2Distance: ""
//     });
//   };

//   // Get center name by ID
//   const getCenterName = (centerId) => {
//     const center = availableCenters.find(c => c.centerId === centerId);
//     return center ? center.centerName : "";
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Row>
//         <Col md={12}>
//           {/* Main Form Accordion */}
//           <Accordion activeKey={mainAccordionOpen} onSelect={(eventKey) => setMainAccordionOpen(eventKey)}>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="d-flex justify-content-between align-items-center w-100 me-3">
//                   <span>
//                     <i className="bi bi-person-check me-2"></i>
//                     MB Counselling - Center Preference
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
                  
//                   {/* Display verification status */}
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
//             <Card className="shadow-lg border-0 bg-gradient-search" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
//               <Card.Body className="p-5">
//                 <div className="text-center mb-4">
//                   <div className="search-icon mb-3">
//                     <i className="bi bi-search-heart" style={{ fontSize: '4rem', color: '#667eea' }}></i>
//                   </div>
//                   <h3 className="mb-2">Student Search</h3>
//                   <p className="text-muted">Enter SRN to view and set center preferences</p>
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
//                     <Button 
//                       variant="outline-secondary" 
//                       onClick={handleReset}
//                     >
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
      
//       {/* Student Details and Center Preference Card */}
//       {currentStudent && !showSRNSearch && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Card className="shadow-lg border-0 student-profile-card">
//               <Card.Header className="bg-gradient-success text-white" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">
//                     <i className="bi bi-person-circle me-2"></i>
//                     Student Details & Center Preferences
//                   </h5>
//                   <Badge bg="light" text="dark" className="px-3 py-2">
//                     District: {currentStudent.schoolDistrict}
//                   </Badge>
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
//                           <strong>District Code:</strong> {currentStudent.schoolDistrictCode}
//                         </Col>
//                         <Col md={3} className="mt-2">
//                           <strong>Block:</strong> {currentStudent.schoolBlock}
//                         </Col>
//                       </Row>
//                     </div>
//                   </Col>
//                 </Row>
                
//                 {/* Centers Table for Preference Selection */}
//                 <Row>
//                   <Col md={12}>
//                     <h6 className="mb-3">
//                       <i className="bi bi-building me-2"></i>
//                       Available Centers in {currentStudent.schoolDistrict} District (Total: {availableCenters.length} centers)
//                       <Badge bg="info" className="ms-2">Max 2 Preferences</Badge>
//                     </h6>
                    
//                     <div className="table-responsive">
//                       <Table striped bordered hover className="text-center">
//                         <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//                           <tr>
//                             <th>#</th>
//                             <th>Block Name</th>
//                             <th>Center Name</th>
//                             <th>Center ID</th>
//                             <th>CP1</th>
//                             <th>CP2</th>
//                             <th>CP1 Distance (km)</th>
//                             <th>CP2 Distance (km)</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {availableCenters.map((center, index) => (
//                             <tr key={center._id}>
//                               <td>{index + 1}</td>
//                               <td>{center.blockName}</td>
//                               <td className="text-start">{center.centerName}</td>
//                               <td>{center.centerId}</td>
//                               <td>
//                                 <Form.Check
//                                   type="checkbox"
//                                   checked={preferences.centerPreference1 === center.centerId}
//                                   onChange={() => handleCenterSelection(center.centerId, 'cp1')}
//                                   disabled={preferences.centerPreference2 === center.centerId}
//                                   className="d-flex justify-content-center"
//                                 />
//                               </td>
//                               <td>
//                                 <Form.Check
//                                   type="checkbox"
//                                   checked={preferences.centerPreference2 === center.centerId}
//                                   onChange={() => handleCenterSelection(center.centerId, 'cp2')}
//                                   disabled={preferences.centerPreference1 === center.centerId}
//                                   className="d-flex justify-content-center"
//                                 />
//                               </td>
//                               <td>
//                                 {preferences.centerPreference1 === center.centerId && (
//                                   <Form.Control
//                                     type="number"
//                                     size="sm"
//                                     placeholder="Distance in km"
//                                     value={preferences.homeToCp1Distance}
//                                     onChange={(e) => handleDistanceChange('cp1', e.target.value)}
//                                     min="0"
//                                     step="0.1"
//                                     style={{ width: '100px', margin: '0 auto' }}
//                                   />
//                                 )}
//                               </td>
//                               <td>
//                                 {preferences.centerPreference2 === center.centerId && (
//                                   <Form.Control
//                                     type="number"
//                                     size="sm"
//                                     placeholder="Distance in km"
//                                     value={preferences.homeToCp2Distance}
//                                     onChange={(e) => handleDistanceChange('cp2', e.target.value)}
//                                     min="0"
//                                     step="0.1"
//                                     style={{ width: '100px', margin: '0 auto' }}
//                                   />
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
                    
//                     {/* Selected Preferences Summary */}
//                     {(preferences.centerPreference1 || preferences.centerPreference2) && (
//                       <div className="mt-3 p-3" style={{ background: '#e7f3ff', borderRadius: '10px', borderLeft: '4px solid #2196f3' }}>
//                         <h6 className="mb-2">Selected Preferences:</h6>
//                         {preferences.centerPreference1 && (
//                           <div className="mb-1">
//                             <Badge bg="primary" className="me-2">CP1</Badge>
//                             <strong>{getCenterName(preferences.centerPreference1)}</strong>
//                             {preferences.homeToCp1Distance && ` - Distance: ${preferences.homeToCp1Distance} km`}
//                           </div>
//                         )}
//                         {preferences.centerPreference2 && (
//                           <div>
//                             <Badge bg="success" className="me-2">CP2</Badge>
//                             <strong>{getCenterName(preferences.centerPreference2)}</strong>
//                             {preferences.homeToCp2Distance && ` - Distance: ${preferences.homeToCp2Distance} km`}
//                           </div>
//                         )}
//                       </div>
//                     )}
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
//                       variant="success" 
//                       onClick={savePreferences}
//                       disabled={savingPreferences || !preferences.centerPreference1}
//                       className="px-4"
//                     >
//                       {savingPreferences ? (
//                         <>
//                           <Spinner as="span" animation="border" size="sm" className="me-2" />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <i className="bi bi-save me-2"></i>
//                           Save Preferences
//                         </>
//                       )}
//                     </Button>
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
        
//         .table-responsive {
//           max-height: 400px;
//           overflow-y: auto;
//         }
        
//         .table th, .table td {
//           vertical-align: middle;
//         }
        
//         @media (max-width: 768px) {
//           .student-info {
//             font-size: 0.9rem;
//           }
          
//           .table-responsive {
//             font-size: 0.8rem;
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







// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, Accordion, Table } from "react-bootstrap";
// import { GetCentersDataByExaminationAndExamTypeCounselling } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataCounselling, updateCenterPreference } from "../../services/StudentRegistrationServices/StudentRegistrationService";
// import MBCenters from "../StudentRegistration/MBCenters.json";

// import { getCenterPreferenceDashboard } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// // Static centers data
// const STATIC_CENTERS_DATA = MBCenters;

// export const MBCenterAllocationCounselling = () => {
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
//   const [availableCenters, setAvailableCenters] = useState([]);
//   const [savingPreferences, setSavingPreferences] = useState(false);
  
//   // Center preferences state
//   const [preferences, setPreferences] = useState({
//     centerPreference1: null,
//     centerPreference2: null,
//     homeToCp1Distance: "",
//     homeToCp2Distance: ""
//   });
  
//   // Accordion state - main form expanded by default
//   const [mainAccordionOpen, setMainAccordionOpen] = useState(["0"]);
  
//   // Pre-defined access codes for districts based on your data
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

//   // Handle form submission - Just verify access code and venue
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

//     // Verify access code before proceeding
//     if (!verifyAccessCode()) {
//       return;
//     }
    
//     // Clear any previous data
//     setError("");
//     setSuccessMessage("");
//     setCurrentStudent(null);
//     setStudentNotFound(false);
    
//     // Show SRN search card
//     setShowSRNSearch(true);
    
//     // Auto collapse the main accordion
//     setMainAccordionOpen([]);
    
//     setSuccessMessage("Access code verified! Please enter SRN to fetch student details.");
//     setTimeout(() => setSuccessMessage(""), 5000);
//   };

//   // Fetch centers by district ID from static data (all centers in the district)
//   const fetchCentersByDistrict = (districtId) => {
//     // Convert both to string for proper comparison
//     const districtIdStr = String(districtId).trim();
    
//     console.log("Looking for centers with districtId:", districtIdStr);
//     console.log("Total centers in STATIC_CENTERS_DATA:", STATIC_CENTERS_DATA.length);
    
//     // Filter centers that match the student's district ID and are not closed
//     const districtCenters = STATIC_CENTERS_DATA.filter(center => {
//       const centerDistrictId = String(center.districtId).trim();
//       const isMatch = centerDistrictId === districtIdStr;
//       const isOpen = !center.isCenterClosed;
      
//       if (isMatch) {
//         console.log("Found matching center:", center.centerName, "District:", center.districtId);
//       }
      
//       return isMatch && isOpen;
//     });
    
//     console.log(`Found ${districtCenters.length} centers for district ${districtIdStr}:`, districtCenters);
//     return districtCenters;
//   };

//   // Get center name by centerId
//   const getCenterNameById = (centerId) => {
//     const center = availableCenters.find(c => c.centerId === centerId);
//     return center ? center.centerName : "";
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
      
//       // Extract student data from different possible response structures
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
//         // Get student's district code - this is the key field for matching
//         const studentDistrictCode = student.schoolDistrictCode;
//         console.log("Student District Code:", studentDistrictCode, "Type:", typeof studentDistrictCode);
        
//         if (!studentDistrictCode) {
//           setError("Student district code not found");
//           setStudentNotFound(true);
//           setSearchingStudent(false);
//           return;
//         }
        
//         // Fetch available centers for this district (all centers in the district)
//         const districtCenters = fetchCentersByDistrict(studentDistrictCode);
        
//         if (districtCenters.length === 0) {
//           setError(`No centers available for district code: ${studentDistrictCode}. Please check if centers are configured for this district.`);
//           setStudentNotFound(true);
//           setSearchingStudent(false);
//           return;
//         }
        
//         setAvailableCenters(districtCenters);
//         setCurrentStudent(student);
        
//         // Load existing preferences if any
//         setPreferences({
//           centerPreference1: student.centerPreference1 || null,
//           centerPreference2: student.centerPreference2 || null,
//           homeToCp1Distance: student.homeToCp1Distance || "",
//           homeToCp2Distance: student.homeToCp2Distance || ""
//         });
        
//         setStudentNotFound(false);
//         setShowSRNSearch(false);
//         setSuccessMessage(`✓ Student found: ${student.name}`);
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//       } else {
//         console.log("No student found in response");
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

//   // Handle Enter key press in SRN input
//   const handleSRNKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSRNSearch();
//     }
//   };

//   // Handle center selection (checkbox)
//   const handleCenterSelection = (center, preferenceType) => {
//     if (preferenceType === 'cp1') {
//       // If CP1 is already selected, unselect it
//       if (preferences.centerPreference1 === center.centerName) {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference1: null,
//           homeToCp1Distance: ""
//         }));
//       } 
//       // If CP2 is selected with same center, prevent selection
//       else if (preferences.centerPreference2 === center.centerName) {
//         setError("This center is already selected as CP2");
//         setTimeout(() => setError(""), 3000);
//         return;
//       }
//       else {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference1: center.centerName
//         }));
//       }
//     } else {
//       // For CP2
//       if (preferences.centerPreference2 === center.centerName) {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference2: null,
//           homeToCp2Distance: ""
//         }));
//       }
//       else if (preferences.centerPreference1 === center.centerName) {
//         setError("This center is already selected as CP1");
//         setTimeout(() => setError(""), 3000);
//         return;
//       }
//       else {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference2: center.centerName
//         }));
//       }
//     }
//   };

//   // Handle distance change
//   const handleDistanceChange = (preferenceType, value) => {
//     if (preferenceType === 'cp1') {
//       setPreferences(prev => ({
//         ...prev,
//         homeToCp1Distance: value
//       }));
//     } else {
//       setPreferences(prev => ({
//         ...prev,
//         homeToCp2Distance: value
//       }));
//     }
//   };

//   // Validate preferences before saving
//   const validatePreferences = () => {
//     if (!preferences.centerPreference1) {
//       setError("Please select at least one center preference (CP1)");
//       return false;
//     }
    
//     if (!preferences.homeToCp1Distance || parseFloat(preferences.homeToCp1Distance) <= 0) {
//       setError("Please enter a valid distance for CP1");
//       return false;
//     }
    
//     if (preferences.centerPreference2 && (!preferences.homeToCp2Distance || parseFloat(preferences.homeToCp2Distance) <= 0)) {
//       setError("Please enter a valid distance for CP2");
//       return false;
//     }
    
//     return true;
//   };

//   const savePreferences = async () => {
//     console.log("=== savePreferences CALLED ===");
//     console.log("Current student:", currentStudent);
//     console.log("Current preferences:", preferences);
    
//     // Check if student exists
//     if (!currentStudent) {
//       console.error("No current student found");
//       setError("No student selected");
//       return;
//     }
    
//     // Validate preferences
//     if (!validatePreferences()) {
//       console.log("Validation failed");
//       return;
//     }
    
//     setSavingPreferences(true);
//     setError("");
//     setSuccessMessage("");
    
//     try {
//       const requestBody = {
//         _id: currentStudent._id,
//         centerPreference1: preferences.centerPreference1,
//         centerPreference2: preferences.centerPreference2 || null,
//         homeToCp1Distance: parseFloat(preferences.homeToCp1Distance),
//         homeToCp2Distance: preferences.homeToCp2Distance ? parseFloat(preferences.homeToCp2Distance) : null
//       };
      
//       console.log("Saving preferences with body:", requestBody);
//       console.log("Calling updateCenterPreference service...");
      
//       // Make sure the service function is imported correctly
//       if (typeof updateCenterPreference !== 'function') {
//         console.error("updateCenterPreference is not a function! Import might be wrong.");
//         setError("Service function not available");
//         setSavingPreferences(false);
//         return;
//       }
      
//       const response = await updateCenterPreference(requestBody);
//       console.log("Save response received:", response);
      
//       if (response && response.success) {
//         console.log("Preferences saved successfully");
//         setSuccessMessage("Center preferences updated successfully!");
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//         // Update current student with new preferences
//         setCurrentStudent(prev => ({
//           ...prev,
//           centerPreference1: requestBody.centerPreference1,
//           centerPreference2: requestBody.centerPreference2,
//           homeToCp1Distance: requestBody.homeToCp1Distance,
//           homeToCp2Distance: requestBody.homeToCp2Distance
//         }));
        
//         // Clear any existing errors
//         setError("");
//       } else {
//         console.error("Response success was false or missing:", response);
//         setError(response?.message || "Failed to save preferences");
//       }
//     } catch (error) {
//       console.error("Error in savePreferences catch block:", error);
      
//       // More detailed error handling
//       let errorMessage = "An error occurred while saving preferences";
      
//       if (error.response) {
//         // Server responded with error
//         errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
//         console.error("Server error response:", error.response.data);
//       } else if (error.request) {
//         // Request was made but no response
//         errorMessage = "Network error: Could not connect to server. Please check if backend is running.";
//         console.error("No response received:", error.request);
//       } else if (error.message) {
//         // Other error
//         errorMessage = error.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setSavingPreferences(false);
//       console.log("savePreferences completed");
//     }
//   };

//   // Handle next student
//   const handleNextStudent = () => {
//     setCurrentStudent(null);
//     setSrnInput("");
//     setShowSRNSearch(true);
//     setStudentNotFound(false);
//     setError("");
//     setAvailableCenters([]);
//     setPreferences({
//       centerPreference1: null,
//       centerPreference2: null,
//       homeToCp1Distance: "",
//       homeToCp2Distance: ""
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
//     setAvailableCenters([]);
//     setPreferences({
//       centerPreference1: null,
//       centerPreference2: null,
//       homeToCp1Distance: "",
//       homeToCp2Distance: ""
//     });
//   };

//   // Get center name by ID
//   const getCenterName = (centerId) => {
//     const center = availableCenters.find(c => c.centerId === centerId);
//     return center ? center.centerName : "";
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Row>
//         <Col md={12}>
//           {/* Main Form Accordion */}
//           <Accordion activeKey={mainAccordionOpen} onSelect={(eventKey) => setMainAccordionOpen(eventKey)}>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="d-flex justify-content-between align-items-center w-100 me-3">
//                   <span>
//                     <i className="bi bi-person-check me-2"></i>
//                     MB Counselling - Center Preference
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
                  
//                   {/* Display verification status */}
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
//             <Card className="shadow-lg border-0 bg-gradient-search" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
//               <Card.Body className="p-5">
//                 <div className="text-center mb-4">
//                   <div className="search-icon mb-3">
//                     <i className="bi bi-search-heart" style={{ fontSize: '4rem', color: '#667eea' }}></i>
//                   </div>
//                   <h3 className="mb-2">Center Preference</h3>
//                   <p className="text-muted">Enter SRN and Start Assigning Centers</p>
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
//                     <Button 
//                       variant="outline-secondary" 
//                       onClick={handleReset}
//                     >
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
      
//       {/* Student Details and Center Preference Card */}
//       {currentStudent && !showSRNSearch && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Card className="shadow-lg border-0 student-profile-card">
//               <Card.Header className="bg-gradient-success text-white" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">
//                     <i className="bi bi-person-circle me-2"></i>
//                     Student Details & Center Preferences
//                   </h5>
//                   <Badge bg="light" text="dark" className="px-3 py-2">
//                     District: {currentStudent.schoolDistrict}
//                   </Badge>
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
//                           <strong>District Code:</strong> {currentStudent.schoolDistrictCode}
//                         </Col>
//                         <Col md={3} className="mt-2">
//                           <strong>Block:</strong> {currentStudent.schoolBlock}
//                         </Col>
//                       </Row>
//                     </div>
//                   </Col>
//                 </Row>
                
//                 {/* Centers Table for Preference Selection */}
//                 <Row>
//                   <Col md={12}>
//                     <h6 className="mb-3">
//                       <i className="bi bi-building me-2"></i>
//                       Available Centers in {currentStudent.schoolDistrict} District (Total: {availableCenters.length} centers)
//                       <Badge bg="info" className="ms-2">Max 2 Preferences</Badge>
//                     </h6>
                    
//                     <div className="table-responsive">
//                       <Table striped bordered hover className="text-center">
//                         <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//                           <tr>
//                             <th>#</th>
//                             <th>Block Name</th>
//                             <th>Center Name</th>
//                             <th>Center ID</th>
//                             <th>CP1</th>
//                             <th>CP2</th>
//                             <th>CP1 Distance (km)</th>
//                             <th>CP2 Distance (km)</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {availableCenters.map((center, index) => (
//                             <tr key={center._id}>
//                               <td>{index + 1}</td>
//                               <td>{center.blockName}</td>
//                               <td className="text-start">{center.centerName}</td>
//                               <td>{center.centerId}</td>
//                               <td>
//                                 <Form.Check
//                                   type="checkbox"
//                                   checked={preferences.centerPreference1 === center.centerName}
//                                   onChange={() => handleCenterSelection(center, 'cp1')}
//                                   disabled={preferences.centerPreference2 === center.centerName}
//                                   className="d-flex justify-content-center"
//                                 />
//                               </td>
//                               <td>
//                                 <Form.Check
//                                   type="checkbox"
//                                   checked={preferences.centerPreference2 === center.centerName}
//                                   onChange={() => handleCenterSelection(center, 'cp2')}
//                                   disabled={preferences.centerPreference1 === center.centerName}
//                                   className="d-flex justify-content-center"
//                                 />
//                               </td>
//                               <td>
//                                 {preferences.centerPreference1 === center.centerName && (
//                                   <Form.Control
//                                     type="number"
//                                     size="sm"
//                                     placeholder="Distance in km"
//                                     value={preferences.homeToCp1Distance}
//                                     onChange={(e) => handleDistanceChange('cp1', e.target.value)}
//                                     min="0"
//                                     step="0.1"
//                                     style={{ width: '100px', margin: '0 auto' }}
//                                   />
//                                 )}
//                               </td>
//                               <td>
//                                 {preferences.centerPreference2 === center.centerName && (
//                                   <Form.Control
//                                     type="number"
//                                     size="sm"
//                                     placeholder="Distance in km"
//                                     value={preferences.homeToCp2Distance}
//                                     onChange={(e) => handleDistanceChange('cp2', e.target.value)}
//                                     min="0"
//                                     step="0.1"
//                                     style={{ width: '100px', margin: '0 auto' }}
//                                   />
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
                    
//                     {/* Selected Preferences Summary */}
//                     {(preferences.centerPreference1 || preferences.centerPreference2) && (
//                       <div className="mt-3 p-3" style={{ background: '#e7f3ff', borderRadius: '10px', borderLeft: '4px solid #2196f3' }}>
//                         <h6 className="mb-2">Selected Preferences:</h6>
//                         {preferences.centerPreference1 && (
//                           <div className="mb-1">
//                             <Badge bg="primary" className="me-2">CP1</Badge>
//                             <strong>{preferences.centerPreference1}</strong>
//                             {preferences.homeToCp1Distance && ` - Distance: ${preferences.homeToCp1Distance} km`}
//                           </div>
//                         )}
//                         {preferences.centerPreference2 && (
//                           <div>
//                             <Badge bg="success" className="me-2">CP2</Badge>
//                             <strong>{preferences.centerPreference2}</strong>
//                             {preferences.homeToCp2Distance && ` - Distance: ${preferences.homeToCp2Distance} km`}
//                           </div>
//                         )}
//                       </div>
//                     )}
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
//                       variant="success" 
//                       onClick={savePreferences}
//                       disabled={savingPreferences || !preferences.centerPreference1}
//                       className="px-4"
//                     >
//                       {savingPreferences ? (
//                         <>
//                           <Spinner as="span" animation="border" size="sm" className="me-2" />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <i className="bi bi-save me-2"></i>
//                           Save Preferences
//                         </>
//                       )}
//                     </Button>
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
        
//         .table-responsive {
//           max-height: 400px;
//           overflow-y: auto;
//         }
        
//         .table th, .table td {
//           vertical-align: middle;
//         }
        
//         @media (max-width: 768px) {
//           .student-info {
//             font-size: 0.9rem;
//           }
          
//           .table-responsive {
//             font-size: 0.8rem;
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














// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, Accordion, Table } from "react-bootstrap";
// import { GetCentersDataByExaminationAndExamTypeCounselling } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataCounselling, updateCenterPreference, getCenterPreferenceDashboard } from "../../services/StudentRegistrationServices/StudentRegistrationService";
// import MBCenters from "../StudentRegistration/MBCenters.json";

// // Static centers data
// const STATIC_CENTERS_DATA = MBCenters;

// export const MBCenterAllocationCounselling = () => {
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
//   const [availableCenters, setAvailableCenters] = useState([]);
//   const [savingPreferences, setSavingPreferences] = useState(false);
//   const [preferenceCounts, setPreferenceCounts] = useState({});
  
//   // Center preferences state
//   const [preferences, setPreferences] = useState({
//     centerPreference1: null,
//     centerPreference2: null,
//     homeToCp1Distance: "",
//     homeToCp2Distance: ""
//   });
  
//   // Accordion state - main form expanded by default
//   const [mainAccordionOpen, setMainAccordionOpen] = useState(["0"]);
  
//   // Pre-defined access codes for districts based on your data
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

//   // Fetch preference counts for dashboard
//   const fetchPreferenceCounts = async () => {
//     try {
//       const response = await getCenterPreferenceDashboard();
//       console.log("Preference counts response:", response);
      
//       if (response && response.success && response.data) {
//         const counts = {};
        
//         // Process preference1 data (CP1)
//         if (response.data.preference1 && Array.isArray(response.data.preference1)) {
//           response.data.preference1.forEach(item => {
//             if (item._id && item._id.center) {
//               const centerName = item._id.center;
//               const status = item._id.status;
//               const count = item.count;
              
//               if (!counts[centerName]) {
//                 counts[centerName] = { cp1Selected: 0, cp1Waiting: 0, cp1Total: 0, cp2Selected: 0, cp2Waiting: 0, cp2Total: 0, total: 0 };
//               }
              
//               if (status === "Selected") {
//                 counts[centerName].cp1Selected += count;
//               } else if (status === "Waiting") {
//                 counts[centerName].cp1Waiting += count;
//               }
//               counts[centerName].cp1Total += count;
//             }
//           });
//         }
        
//         // Process preference2 data (CP2)
//         if (response.data.preference2 && Array.isArray(response.data.preference2)) {
//           response.data.preference2.forEach(item => {
//             if (item._id && item._id.center) {
//               const centerName = item._id.center;
//               const status = item._id.status;
//               const count = item.count;
              
//               if (!counts[centerName]) {
//                 counts[centerName] = { cp1Selected: 0, cp1Waiting: 0, cp1Total: 0, cp2Selected: 0, cp2Waiting: 0, cp2Total: 0, total: 0 };
//               }
              
//               if (status === "Selected") {
//                 counts[centerName].cp2Selected += count;
//               } else if (status === "Waiting") {
//                 counts[centerName].cp2Waiting += count;
//               }
//               counts[centerName].cp2Total += count;
//             }
//           });
//         }
        
//         // Calculate total for each center
//         Object.keys(counts).forEach(centerName => {
//           counts[centerName].total = counts[centerName].cp1Total + counts[centerName].cp2Total;
//         });
        
//         setPreferenceCounts(counts);
//         console.log("Processed counts with CP1/CP2 breakdown:", counts);
//       }
//     } catch (error) {
//       console.error("Error fetching preference counts:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCounsellingCenters();
//     fetchPreferenceCounts();
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

//   // Handle form submission - Just verify access code and venue
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

//     // Verify access code before proceeding
//     if (!verifyAccessCode()) {
//       return;
//     }
    
//     // Clear any previous data
//     setError("");
//     setSuccessMessage("");
//     setCurrentStudent(null);
//     setStudentNotFound(false);
    
//     // Show SRN search card
//     setShowSRNSearch(true);
    
//     // Auto collapse the main accordion
//     setMainAccordionOpen([]);
    
//     setSuccessMessage("Access code verified! Please enter SRN to fetch student details.");
//     setTimeout(() => setSuccessMessage(""), 5000);
//   };

//   // Fetch centers by district ID from static data (all centers in the district)
//   const fetchCentersByDistrict = (districtId) => {
//     // Convert both to string for proper comparison
//     const districtIdStr = String(districtId).trim();
    
//     console.log("Looking for centers with districtId:", districtIdStr);
//     console.log("Total centers in STATIC_CENTERS_DATA:", STATIC_CENTERS_DATA.length);
    
//     // Filter centers that match the student's district ID and are not closed
//     const districtCenters = STATIC_CENTERS_DATA.filter(center => {
//       const centerDistrictId = String(center.districtId).trim();
//       const isMatch = centerDistrictId === districtIdStr;
//       const isOpen = !center.isCenterClosed;
      
//       if (isMatch) {
//         console.log("Found matching center:", center.centerName, "District:", center.districtId);
//       }
      
//       return isMatch && isOpen;
//     });
    
//     console.log(`Found ${districtCenters.length} centers for district ${districtIdStr}:`, districtCenters);
//     return districtCenters;
//   };

//   // Get center name by centerId
//   const getCenterNameById = (centerId) => {
//     const center = availableCenters.find(c => c.centerId === centerId);
//     return center ? center.centerName : "";
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
      
//       // Extract student data from different possible response structures
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
//         // Get student's district code - this is the key field for matching
//         const studentDistrictCode = student.schoolDistrictCode;
//         console.log("Student District Code:", studentDistrictCode, "Type:", typeof studentDistrictCode);
        
//         if (!studentDistrictCode) {
//           setError("Student district code not found");
//           setStudentNotFound(true);
//           setSearchingStudent(false);
//           return;
//         }
        
//         // Fetch available centers for this district (all centers in the district)
//         const districtCenters = fetchCentersByDistrict(studentDistrictCode);
        
//         if (districtCenters.length === 0) {
//           setError(`No centers available for district code: ${studentDistrictCode}. Please check if centers are configured for this district.`);
//           setStudentNotFound(true);
//           setSearchingStudent(false);
//           return;
//         }
        
//         setAvailableCenters(districtCenters);
//         setCurrentStudent(student);
        
//         // Load existing preferences if any
//         setPreferences({
//           centerPreference1: student.centerPreference1 || null,
//           centerPreference2: student.centerPreference2 || null,
//           homeToCp1Distance: student.homeToCp1Distance || "",
//           homeToCp2Distance: student.homeToCp2Distance || ""
//         });
        
//         setStudentNotFound(false);
//         setShowSRNSearch(false);
//         setSuccessMessage(`✓ Student found: ${student.name}`);
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//       } else {
//         console.log("No student found in response");
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

//   // Handle Enter key press in SRN input
//   const handleSRNKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSRNSearch();
//     }
//   };

//   // Handle center selection (checkbox)
//   const handleCenterSelection = (center, preferenceType) => {
//     if (preferenceType === 'cp1') {
//       // If CP1 is already selected, unselect it
//       if (preferences.centerPreference1 === center.centerName) {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference1: null,
//           homeToCp1Distance: ""
//         }));
//       } 
//       // If CP2 is selected with same center, prevent selection
//       else if (preferences.centerPreference2 === center.centerName) {
//         setError("This center is already selected as CP2");
//         setTimeout(() => setError(""), 3000);
//         return;
//       }
//       else {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference1: center.centerName
//         }));
//       }
//     } else {
//       // For CP2
//       if (preferences.centerPreference2 === center.centerName) {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference2: null,
//           homeToCp2Distance: ""
//         }));
//       }
//       else if (preferences.centerPreference1 === center.centerName) {
//         setError("This center is already selected as CP1");
//         setTimeout(() => setError(""), 3000);
//         return;
//       }
//       else {
//         setPreferences(prev => ({
//           ...prev,
//           centerPreference2: center.centerName
//         }));
//       }
//     }
//   };

//   // Handle distance change
//   const handleDistanceChange = (preferenceType, value) => {
//     if (preferenceType === 'cp1') {
//       setPreferences(prev => ({
//         ...prev,
//         homeToCp1Distance: value
//       }));
//     } else {
//       setPreferences(prev => ({
//         ...prev,
//         homeToCp2Distance: value
//       }));
//     }
//   };

//   // Validate preferences before saving
//   const validatePreferences = () => {
//     if (!preferences.centerPreference1) {
//       setError("Please select at least one center preference (CP1)");
//       return false;
//     }
    
//     if (!preferences.homeToCp1Distance || parseFloat(preferences.homeToCp1Distance) <= 0) {
//       setError("Please enter a valid distance for CP1");
//       return false;
//     }
    
//     if (preferences.centerPreference2 && (!preferences.homeToCp2Distance || parseFloat(preferences.homeToCp2Distance) <= 0)) {
//       setError("Please enter a valid distance for CP2");
//       return false;
//     }
    
//     return true;
//   };

//   const savePreferences = async () => {
//     console.log("=== savePreferences CALLED ===");
//     console.log("Current student:", currentStudent);
//     console.log("Current preferences:", preferences);
    
//     // Check if student exists
//     if (!currentStudent) {
//       console.error("No current student found");
//       setError("No student selected");
//       return;
//     }
    
//     // Validate preferences
//     if (!validatePreferences()) {
//       console.log("Validation failed");
//       return;
//     }
    
//     setSavingPreferences(true);
//     setError("");
//     setSuccessMessage("");
    
//     try {
//       const requestBody = {
//         _id: currentStudent._id,
//         centerPreference1: preferences.centerPreference1,
//         centerPreference2: preferences.centerPreference2 || null,
//         homeToCp1Distance: parseFloat(preferences.homeToCp1Distance),
//         homeToCp2Distance: preferences.homeToCp2Distance ? parseFloat(preferences.homeToCp2Distance) : null
//       };
      
//       console.log("Saving preferences with body:", requestBody);
//       console.log("Calling updateCenterPreference service...");
      
//       // Make sure the service function is imported correctly
//       if (typeof updateCenterPreference !== 'function') {
//         console.error("updateCenterPreference is not a function! Import might be wrong.");
//         setError("Service function not available");
//         setSavingPreferences(false);
//         return;
//       }
      
//       const response = await updateCenterPreference(requestBody);
//       console.log("Save response received:", response);
      
//       if (response && response.success) {
//         console.log("Preferences saved successfully");
//         setSuccessMessage("Center preferences updated successfully!");
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//         // Update current student with new preferences
//         setCurrentStudent(prev => ({
//           ...prev,
//           centerPreference1: requestBody.centerPreference1,
//           centerPreference2: requestBody.centerPreference2,
//           homeToCp1Distance: requestBody.homeToCp1Distance,
//           homeToCp2Distance: requestBody.homeToCp2Distance
//         }));
        
//         // Refresh preference counts after saving
//         fetchPreferenceCounts();
        
//         // Clear any existing errors
//         setError("");
//       } else {
//         console.error("Response success was false or missing:", response);
//         setError(response?.message || "Failed to save preferences");
//       }
//     } catch (error) {
//       console.error("Error in savePreferences catch block:", error);
      
//       // More detailed error handling
//       let errorMessage = "An error occurred while saving preferences";
      
//       if (error.response) {
//         // Server responded with error
//         errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
//         console.error("Server error response:", error.response.data);
//       } else if (error.request) {
//         // Request was made but no response
//         errorMessage = "Network error: Could not connect to server. Please check if backend is running.";
//         console.error("No response received:", error.request);
//       } else if (error.message) {
//         // Other error
//         errorMessage = error.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setSavingPreferences(false);
//       console.log("savePreferences completed");
//     }
//   };

//   // Handle next student
//   const handleNextStudent = () => {
//     setCurrentStudent(null);
//     setSrnInput("");
//     setShowSRNSearch(true);
//     setStudentNotFound(false);
//     setError("");
//     setAvailableCenters([]);
//     setPreferences({
//       centerPreference1: null,
//       centerPreference2: null,
//       homeToCp1Distance: "",
//       homeToCp2Distance: ""
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
//     setAvailableCenters([]);
//     setPreferences({
//       centerPreference1: null,
//       centerPreference2: null,
//       homeToCp1Distance: "",
//       homeToCp2Distance: ""
//     });
//   };

//   // Get center name by ID
//   const getCenterName = (centerId) => {
//     const center = availableCenters.find(c => c.centerId === centerId);
//     return center ? center.centerName : "";
//   };

//   // Get CP1 count display for center
//   const getCp1CountDisplay = (centerName) => {
//     const counts = preferenceCounts[centerName];
//     if (counts && counts.cp1Total > 0) {
//       return ` (${counts.cp1Total})`;
//     }
//     return "";
//   };

//   // Get CP2 count display for center
//   const getCp2CountDisplay = (centerName) => {
//     const counts = preferenceCounts[centerName];
//     if (counts && counts.cp2Total > 0) {
//       return ` (${counts.cp2Total})`;
//     }
//     return "";
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Row>
//         <Col md={12}>
//           {/* Main Form Accordion */}
//           <Accordion activeKey={mainAccordionOpen} onSelect={(eventKey) => setMainAccordionOpen(eventKey)}>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="d-flex justify-content-between align-items-center w-100 me-3">
//                   <span>
//                     <i className="bi bi-person-check me-2"></i>
//                     MB Counselling - Center Preference
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
//                           required>
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
//                           required>
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
//                               type="button">
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
//                         disabled={fetchingData || !selectedVenue || !accessCode}>
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
                  
//                   {/* Display verification status */}
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
//             <Card className="shadow-lg border-0 bg-gradient-search" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
//               <Card.Body className="p-5">
//                 <div className="text-center mb-4">
//                   <div className="search-icon mb-3">
//                     <i className="bi bi-search-heart" style={{ fontSize: '4rem', color: '#667eea' }}></i>
//                   </div>
//                   <h3 className="mb-2">Center Preference</h3>
//                   <p className="text-muted">Enter SRN and Start Assigning Centers</p>
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
//                           style={{ padding: '12px 30px', borderRadius: '0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
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
//                     <Button 
//                       variant="outline-secondary" 
//                       onClick={handleReset}>
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
      
//       {/* Student Details and Center Preference Card */}
//       {currentStudent && !showSRNSearch && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Card className="shadow-lg border-0 student-profile-card">
//               <Card.Header className="bg-gradient-success text-white" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">
//                     <i className="bi bi-person-circle me-2"></i>
//                     Student Details & Center Preferences
//                   </h5>
//                   <Badge bg="light" text="dark" className="px-3 py-2">
//                     District: {currentStudent.schoolDistrict}
//                   </Badge>
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
//                           <strong>District Code:</strong> {currentStudent.schoolDistrictCode}
//                         </Col>
//                         <Col md={3} className="mt-2">
//                           <strong>Block:</strong> {currentStudent.schoolBlock}
//                         </Col>
//                       </Row>
//                     </div>
//                   </Col>
//                 </Row>
                
//                 {/* Centers Table for Preference Selection */}
//                 <Row>
//                   <Col md={12}>
//                     <h6 className="mb-3">
//                       <i className="bi bi-building me-2"></i>
//                       Available Centers in {currentStudent.schoolDistrict} District (Total: {availableCenters.length} centers)
//                       <Badge bg="info" className="ms-2">Max 2 Preferences</Badge>
//                     </h6>
                    
//                     <div className="table-responsive">
//                       <Table striped bordered hover className="text-center">
//                         <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//                           <tr>
//                             <th>#</th>
//                             <th>Block Name</th>
//                             <th>Center Name</th>
//                             <th>Center ID</th>
//                             <th>CP1</th>
//                             <th>CP2</th>
//                             <th>CP1 Distance (km)</th>
//                             <th>CP2 Distance (km)</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {availableCenters.map((center, index) => (
//                             <tr key={center._id}>
//                               <td>{index + 1}</td>
//                               <td>{center.blockName}</td>
//                               <td className="text-start">
//                                 {center.centerName}
//                               </td>
//                               <td>{center.centerId}</td>
//                               <td>
//                                 <div className="d-flex flex-column align-items-center gap-1">
//                                   <Form.Check
//                                     type="checkbox"
//                                     checked={preferences.centerPreference1 === center.centerName}
//                                     onChange={() => handleCenterSelection(center, 'cp1')}
//                                     disabled={preferences.centerPreference2 === center.centerName}
//                                     className="d-flex justify-content-center"
//                                   />
//                                   <Badge bg="primary" className="mt-1">
//                                     {getCp1CountDisplay(center.centerName) || ' (0)'}
//                                   </Badge>
//                                 </div>
//                               </td>
//                               <td>
//                                 <div className="d-flex flex-column align-items-center gap-1">
//                                   <Form.Check
//                                     type="checkbox"
//                                     checked={preferences.centerPreference2 === center.centerName}
//                                     onChange={() => handleCenterSelection(center, 'cp2')}
//                                     disabled={preferences.centerPreference1 === center.centerName}
//                                     className="d-flex justify-content-center"
//                                   />
//                                   <Badge bg="success" className="mt-1">
//                                     {getCp2CountDisplay(center.centerName) || ' (0)'}
//                                   </Badge>
//                                 </div>
//                               </td>
//                               <td>
//                                 {preferences.centerPreference1 === center.centerName && (
//                                   <Form.Control
//                                     type="number"
//                                     size="sm"
//                                     placeholder="Distance in km"
//                                     value={preferences.homeToCp1Distance}
//                                     onChange={(e) => handleDistanceChange('cp1', e.target.value)}
//                                     min="0"
//                                     step="0.1"
//                                     style={{ width: '100px', margin: '0 auto' }}
//                                   />
//                                 )}
//                               </td>
//                               <td>
//                                 {preferences.centerPreference2 === center.centerName && (
//                                   <Form.Control
//                                     type="number"
//                                     size="sm"
//                                     placeholder="Distance in km"
//                                     value={preferences.homeToCp2Distance}
//                                     onChange={(e) => handleDistanceChange('cp2', e.target.value)}
//                                     min="0"
//                                     step="0.1"
//                                     style={{ width: '100px', margin: '0 auto' }}
//                                   />
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
                    
//                     {/* Selected Preferences Summary */}
//                     {(preferences.centerPreference1 || preferences.centerPreference2) && (
//                       <div className="mt-3 p-3" style={{ background: '#e7f3ff', borderRadius: '10px', borderLeft: '4px solid #2196f3' }}>
//                         <h6 className="mb-2">Selected Preferences:</h6>
//                         {preferences.centerPreference1 && (
//                           <div className="mb-1">
//                             <Badge bg="primary" className="me-2">CP1</Badge>
//                             <strong>{preferences.centerPreference1}</strong>
//                             {preferences.homeToCp1Distance && ` - Distance: ${preferences.homeToCp1Distance} km`}
//                           </div>
//                         )}
//                         {preferences.centerPreference2 && (
//                           <div>
//                             <Badge bg="success" className="me-2">CP2</Badge>
//                             <strong>{preferences.centerPreference2}</strong>
//                             {preferences.homeToCp2Distance && ` - Distance: ${preferences.homeToCp2Distance} km`}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </Col>
//                 </Row>
//               </Card.Body>
//               <Card.Footer className="bg-light">
//                 <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
//                   <Button 
//                     variant="danger" 
//                     onClick={handleReset}
//                     className="px-4">
//                     <i className="bi bi-x-circle me-2"></i>
//                     Reset All
//                   </Button>
//                   <div className="d-flex gap-2">
//                     <Button 
//                       variant="success" 
//                       onClick={savePreferences}
//                       disabled={savingPreferences || !preferences.centerPreference1}
//                       className="px-4">
//                       {savingPreferences ? (
//                         <>
//                           <Spinner as="span" animation="border" size="sm" className="me-2" />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <i className="bi bi-save me-2"></i>
//                           Save Preferences
//                         </>
//                       )}
//                     </Button>
//                     <Button 
//                       variant="primary" 
//                       onClick={handleNextStudent}
//                       className="px-4">
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
        
//         .table-responsive {
//           max-height: 400px;
//           overflow-y: auto;
//         }
        
//         .table th, .table td {
//           vertical-align: middle;
//         }
        
//         @media (max-width: 768px) {
//           .student-info {
//             font-size: 0.9rem;
//           }
          
//           .table-responsive {
//             font-size: 0.8rem;
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
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, Accordion, Table, Modal } from "react-bootstrap";
import { GetCentersDataByExaminationAndExamTypeCounselling } from "../../services/ExaminationVenue/ExaminationVenueServices";
import { GetAttendanceSheetDataCounselling, updateCenterPreference, getCenterPreferenceDashboard } from "../../services/StudentRegistrationServices/StudentRegistrationService";
import MBCenters from "../StudentRegistration/MBCenters.json";

// Static centers data
const STATIC_CENTERS_DATA = MBCenters;

export const MBCenterAllocationCounselling = () => {
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
  const [availableCenters, setAvailableCenters] = useState([]);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [preferenceCounts, setPreferenceCounts] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Center preferences state
  const [preferences, setPreferences] = useState({
    centerPreference1: null,
    centerPreference2: null,
    homeToCp1Distance: "",
    homeToCp2Distance: ""
  });
  
  // Accordion state - main form expanded by default
  const [mainAccordionOpen, setMainAccordionOpen] = useState(["0"]);
  
  // Pre-defined access codes for districts based on your data
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

  // Fetch preference counts for dashboard
  const fetchPreferenceCounts = async () => {
    try {
      const response = await getCenterPreferenceDashboard();
      console.log("Preference counts response:", response);
      
      if (response && response.success && response.data) {
        const counts = {};
        
        // Process preference1 data (CP1)
        if (response.data.preference1 && Array.isArray(response.data.preference1)) {
          response.data.preference1.forEach(item => {
            if (item._id && item._id.center) {
              const centerName = item._id.center;
              const status = item._id.status;
              const count = item.count;
              
              if (!counts[centerName]) {
                counts[centerName] = { cp1Selected: 0, cp1Waiting: 0, cp1Total: 0, cp2Selected: 0, cp2Waiting: 0, cp2Total: 0, total: 0 };
              }
              
              if (status === "Selected") {
                counts[centerName].cp1Selected += count;
              } else if (status === "Waiting") {
                counts[centerName].cp1Waiting += count;
              }
              counts[centerName].cp1Total += count;
            }
          });
        }
        
        // Process preference2 data (CP2)
        if (response.data.preference2 && Array.isArray(response.data.preference2)) {
          response.data.preference2.forEach(item => {
            if (item._id && item._id.center) {
              const centerName = item._id.center;
              const status = item._id.status;
              const count = item.count;
              
              if (!counts[centerName]) {
                counts[centerName] = { cp1Selected: 0, cp1Waiting: 0, cp1Total: 0, cp2Selected: 0, cp2Waiting: 0, cp2Total: 0, total: 0 };
              }
              
              if (status === "Selected") {
                counts[centerName].cp2Selected += count;
              } else if (status === "Waiting") {
                counts[centerName].cp2Waiting += count;
              }
              counts[centerName].cp2Total += count;
            }
          });
        }
        
        // Calculate total for each center
        Object.keys(counts).forEach(centerName => {
          counts[centerName].total = counts[centerName].cp1Total + counts[centerName].cp2Total;
        });
        
        setPreferenceCounts(counts);
        console.log("Processed counts with CP1/CP2 breakdown:", counts);
      }
    } catch (error) {
      console.error("Error fetching preference counts:", error);
    }
  };

  useEffect(() => {
    fetchCounsellingCenters();
    fetchPreferenceCounts();
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

  // Handle form submission - Just verify access code and venue
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

    // Verify access code before proceeding
    if (!verifyAccessCode()) {
      return;
    }
    
    // Clear any previous data
    setError("");
    setSuccessMessage("");
    setCurrentStudent(null);
    setStudentNotFound(false);
    
    // Show SRN search card
    setShowSRNSearch(true);
    
    // Auto collapse the main accordion
    setMainAccordionOpen([]);
    
    setSuccessMessage("Access code verified! Please enter SRN to fetch student details.");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  // Fetch centers by district ID from static data (all centers in the district)
  const fetchCentersByDistrict = (districtId) => {
    // Convert both to string for proper comparison
    const districtIdStr = String(districtId).trim();
    
    console.log("Looking for centers with districtId:", districtIdStr);
    console.log("Total centers in STATIC_CENTERS_DATA:", STATIC_CENTERS_DATA.length);
    
    // Filter centers that match the student's district ID and are not closed
    const districtCenters = STATIC_CENTERS_DATA.filter(center => {
      const centerDistrictId = String(center.districtId).trim();
      const isMatch = centerDistrictId === districtIdStr;
      const isOpen = !center.isCenterClosed;
      
      if (isMatch) {
        console.log("Found matching center:", center.centerName, "District:", center.districtId);
      }
      
      return isMatch && isOpen;
    });
    
    console.log(`Found ${districtCenters.length} centers for district ${districtIdStr}:`, districtCenters);
    return districtCenters;
  };

  // Get center name by centerId
  const getCenterNameById = (centerId) => {
    const center = availableCenters.find(c => c.centerId === centerId);
    return center ? center.centerName : "";
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
      
      // Extract student data from different possible response structures
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
        // Get student's district code - this is the key field for matching
        const studentDistrictCode = student.schoolDistrictCode;
        console.log("Student District Code:", studentDistrictCode, "Type:", typeof studentDistrictCode);
        
        if (!studentDistrictCode) {
          setError("Student district code not found");
          setStudentNotFound(true);
          setSearchingStudent(false);
          return;
        }
        
        // Fetch available centers for this district (all centers in the district)
        const districtCenters = fetchCentersByDistrict(studentDistrictCode);
        
        if (districtCenters.length === 0) {
          setError(`No centers available for district code: ${studentDistrictCode}. Please check if centers are configured for this district.`);
          setStudentNotFound(true);
          setSearchingStudent(false);
          return;
        }
        
        setAvailableCenters(districtCenters);
        setCurrentStudent(student);
        
        // Load existing preferences if any
        setPreferences({
          centerPreference1: student.centerPreference1 || null,
          centerPreference2: student.centerPreference2 || null,
          homeToCp1Distance: student.homeToCp1Distance || "",
          homeToCp2Distance: student.homeToCp2Distance || ""
        });
        
        setStudentNotFound(false);
        setShowSRNSearch(false);
        setSuccessMessage(`✓ Student found: ${student.name}`);
        setTimeout(() => setSuccessMessage(""), 3000);
        
      } else {
        console.log("No student found in response");
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

  // Handle Enter key press in SRN input
  const handleSRNKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSRNSearch();
    }
  };

  // Handle center selection (checkbox)
  const handleCenterSelection = (center, preferenceType) => {
    if (preferenceType === 'cp1') {
      // If CP1 is already selected, unselect it
      if (preferences.centerPreference1 === center.centerName) {
        setPreferences(prev => ({
          ...prev,
          centerPreference1: null,
          homeToCp1Distance: ""
        }));
      } 
      // If CP2 is selected with same center, prevent selection
      else if (preferences.centerPreference2 === center.centerName) {
        setError("This center is already selected as CP2");
        setTimeout(() => setError(""), 3000);
        return;
      }
      else {
        setPreferences(prev => ({
          ...prev,
          centerPreference1: center.centerName
        }));
      }
    } else {
      // For CP2
      if (preferences.centerPreference2 === center.centerName) {
        setPreferences(prev => ({
          ...prev,
          centerPreference2: null,
          homeToCp2Distance: ""
        }));
      }
      else if (preferences.centerPreference1 === center.centerName) {
        setError("This center is already selected as CP1");
        setTimeout(() => setError(""), 3000);
        return;
      }
      else {
        setPreferences(prev => ({
          ...prev,
          centerPreference2: center.centerName
        }));
      }
    }
  };

  // Handle distance change
  const handleDistanceChange = (preferenceType, value) => {
    if (preferenceType === 'cp1') {
      setPreferences(prev => ({
        ...prev,
        homeToCp1Distance: value
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        homeToCp2Distance: value
      }));
    }
  };

  // Validate preferences before saving
  const validatePreferences = () => {
    if (!preferences.centerPreference1) {
      setError("Please select at least one center preference (CP1)");
      return false;
    }
    
    return true;
  };

  const savePreferences = async () => {
    console.log("=== savePreferences CALLED ===");
    console.log("Current student:", currentStudent);
    console.log("Current preferences:", preferences);
    
    // Check if student exists
    if (!currentStudent) {
      console.error("No current student found");
      setError("No student selected");
      return;
    }
    
    // Validate preferences
    if (!validatePreferences()) {
      console.log("Validation failed");
      return;
    }
    
    setSavingPreferences(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const requestBody = {
        _id: currentStudent._id,
        centerPreference1: preferences.centerPreference1,
        centerPreference2: preferences.centerPreference2 || null,
        homeToCp1Distance: preferences.homeToCp1Distance ? parseFloat(preferences.homeToCp1Distance) : null,
        homeToCp2Distance: preferences.homeToCp2Distance ? parseFloat(preferences.homeToCp2Distance) : null
      };
      
      console.log("Saving preferences with body:", requestBody);
      console.log("Calling updateCenterPreference service...");
      
      // Make sure the service function is imported correctly
      if (typeof updateCenterPreference !== 'function') {
        console.error("updateCenterPreference is not a function! Import might be wrong.");
        setError("Service function not available");
        setSavingPreferences(false);
        return;
      }
      
      const response = await updateCenterPreference(requestBody);
      console.log("Save response received:", response);
      
      if (response && response.success) {
        console.log("Preferences saved successfully");
        
        // Update current student with new preferences
        setCurrentStudent(prev => ({
          ...prev,
          centerPreference1: requestBody.centerPreference1,
          centerPreference2: requestBody.centerPreference2,
          homeToCp1Distance: requestBody.homeToCp1Distance,
          homeToCp2Distance: requestBody.homeToCp2Distance
        }));
        
        // Refresh preference counts after saving
        fetchPreferenceCounts();
        
        // Show success modal
        setShowSuccessModal(true);
        
        // Clear any existing errors
        setError("");
      } else {
        console.error("Response success was false or missing:", response);
        setError(response?.message || "Failed to save preferences");
      }
    } catch (error) {
      console.error("Error in savePreferences catch block:", error);
      
      // More detailed error handling
      let errorMessage = "An error occurred while saving preferences";
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error("Server error response:", error.response.data);
      } else if (error.request) {
        // Request was made but no response
        errorMessage = "Network error: Could not connect to server. Please check if backend is running.";
        console.error("No response received:", error.request);
      } else if (error.message) {
        // Other error
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSavingPreferences(false);
      console.log("savePreferences completed");
    }
  };

  // Handle next student from modal
  const handleNextStudentFromModal = () => {
    setShowSuccessModal(false);
    handleNextStudent();
  };

  // Handle next student
  const handleNextStudent = () => {
    setCurrentStudent(null);
    setSrnInput("");
    setShowSRNSearch(true);
    setStudentNotFound(false);
    setError("");
    setAvailableCenters([]);
    setPreferences({
      centerPreference1: null,
      centerPreference2: null,
      homeToCp1Distance: "",
      homeToCp2Distance: ""
    });
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
    setAvailableCenters([]);
    setPreferences({
      centerPreference1: null,
      centerPreference2: null,
      homeToCp1Distance: "",
      homeToCp2Distance: ""
    });
  };

  // Get center name by ID
  const getCenterName = (centerId) => {
    const center = availableCenters.find(c => c.centerId === centerId);
    return center ? center.centerName : "";
  };

  // Get CP1 count display for center
  const getCp1CountDisplay = (centerName) => {
    const counts = preferenceCounts[centerName];
    if (counts && counts.cp1Total > 0) {
      return ` (${counts.cp1Total})`;
    }
    return "";
  };

  // Get CP2 count display for center
  const getCp2CountDisplay = (centerName) => {
    const counts = preferenceCounts[centerName];
    if (counts && counts.cp2Total > 0) {
      return ` (${counts.cp2Total})`;
    }
    return "";
  };

  return (
    <Container fluid className="mt-4">
      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
          <Modal.Title>
            <i className="bi bi-check-circle-fill me-2"></i>
            Success!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <i className="bi bi-save2" style={{ fontSize: '4rem', color: '#11998e' }}></i>
          <h5 className="mt-3">Preferences Saved Successfully!</h5>
          <p className="text-muted mt-2">
            Center preferences for <strong>{currentStudent?.name}</strong> have been saved.
          </p>
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              CP1: <strong>{preferences.centerPreference1}</strong>
              {preferences.centerPreference2 && ` | CP2: ${preferences.centerPreference2}`}
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button 
            variant="primary" 
            onClick={handleNextStudentFromModal}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
          >
            <i className="bi bi-arrow-right-circle me-2"></i>
            Next Student
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
                    <i className="bi bi-person-check me-2"></i>
                    MB Counselling - Center Preference
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
                          required>
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
                          required>
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
                              type="button">
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
                        disabled={fetchingData || !selectedVenue || !accessCode}>
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
                  
                  {/* Display verification status */}
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
            <Card className="shadow-lg border-0 bg-gradient-search" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="search-icon mb-3">
                    <i className="bi bi-search-heart" style={{ fontSize: '4rem', color: '#667eea' }}></i>
                  </div>
                  <h3 className="mb-2">Center Preference</h3>
                  <p className="text-muted">Enter SRN and Start Assigning Centers</p>
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
                          style={{ padding: '12px 30px', borderRadius: '0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
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
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleReset}>
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
      
      {/* Student Details and Center Preference Card */}
      {currentStudent && !showSRNSearch && (
        <Row className="mt-4">
          <Col md={12}>
            <Card className="shadow-lg border-0 student-profile-card">
              <Card.Header className="bg-gradient-success text-white" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-person-circle me-2"></i>
                    Student Details & Center Preferences
                  </h5>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    District: {currentStudent.schoolDistrict}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Student Information Section */}
                <Row className="mb-4">
                  <Col md={12}>
                    <div className="student-info p-3" style={{ background: '#f8f9fa', borderRadius: '10px' }}>
                      <Row>
                        <Col md={3}>
                          <strong>Name:</strong> {currentStudent.name}
                        </Col>
                        <Col md={3}>
                          <strong>SRN:</strong> {currentStudent.srn}
                        </Col>
                        <Col md={3}>
                          <strong>Father's Name:</strong> {currentStudent.father}
                        </Col>
                        <Col md={3}>
                          <strong>Class:</strong> {currentStudent.classOfStudent}
                        </Col>
                        <Col md={3} className="mt-2">
                          <strong>School:</strong> {currentStudent.school}
                        </Col>
                        <Col md={3} className="mt-2">
                          <strong>District:</strong> {currentStudent.schoolDistrict}
                        </Col>
                        <Col md={3} className="mt-2">
                          <strong>District Code:</strong> {currentStudent.schoolDistrictCode}
                        </Col>
                        <Col md={3} className="mt-2">
                          <strong>Block:</strong> {currentStudent.schoolBlock}
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
                
                {/* Centers Table for Preference Selection */}
                <Row>
                  <Col md={12}>
                    <h6 className="mb-3">
                      <i className="bi bi-building me-2"></i>
                      Available Centers in {currentStudent.schoolDistrict} District (Total: {availableCenters.length} centers)
                      <Badge bg="info" className="ms-2">Max 2 Preferences</Badge>
                    </h6>
                    
                    <div className="table-responsive">
                      <Table striped bordered hover className="text-center">
                        <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                          <tr>
                            <th>#</th>
                            <th>Block Name</th>
                            <th>Center Name</th>
                            <th>Center ID</th>
                            <th>CP1</th>
                            <th>CP2</th>
                            <th>CP1 Distance (km)</th>
                            <th>CP2 Distance (km)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {availableCenters.map((center, index) => (
                            <tr key={center._id}>
                              <td>{index + 1}</td>
                              <td>{center.blockName}</td>
                              <td className="text-start">
                                {center.centerName}
                              </td>
                              <td>{center.centerId}</td>
                              <td>
                                <div className="d-flex flex-column align-items-center gap-1">
                                  <Form.Check
                                    type="checkbox"
                                    checked={preferences.centerPreference1 === center.centerName}
                                    onChange={() => handleCenterSelection(center, 'cp1')}
                                    disabled={preferences.centerPreference2 === center.centerName}
                                    className="d-flex justify-content-center"
                                  />
                                  <Badge bg="primary" className="mt-1">
                                    {getCp1CountDisplay(center.centerName) || ' (0)'}
                                  </Badge>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column align-items-center gap-1">
                                  <Form.Check
                                    type="checkbox"
                                    checked={preferences.centerPreference2 === center.centerName}
                                    onChange={() => handleCenterSelection(center, 'cp2')}
                                    disabled={preferences.centerPreference1 === center.centerName}
                                    className="d-flex justify-content-center"
                                  />
                                  <Badge bg="success" className="mt-1">
                                    {getCp2CountDisplay(center.centerName) || ' (0)'}
                                  </Badge>
                                </div>
                              </td>
                              <td>
                                {preferences.centerPreference1 === center.centerName && (
                                  <Form.Control
                                    type="number"
                                    size="sm"
                                    placeholder="Distance in km (optional)"
                                    value={preferences.homeToCp1Distance}
                                    onChange={(e) => handleDistanceChange('cp1', e.target.value)}
                                    min="0"
                                    step="0.1"
                                    style={{ width: '120px', margin: '0 auto' }}
                                  />
                                )}
                              </td>
                              <td>
                                {preferences.centerPreference2 === center.centerName && (
                                  <Form.Control
                                    type="number"
                                    size="sm"
                                    placeholder="Distance in km (optional)"
                                    value={preferences.homeToCp2Distance}
                                    onChange={(e) => handleDistanceChange('cp2', e.target.value)}
                                    min="0"
                                    step="0.1"
                                    style={{ width: '120px', margin: '0 auto' }}
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    
                    {/* Selected Preferences Summary */}
                    {(preferences.centerPreference1 || preferences.centerPreference2) && (
                      <div className="mt-3 p-3" style={{ background: '#e7f3ff', borderRadius: '10px', borderLeft: '4px solid #2196f3' }}>
                        <h6 className="mb-2">Selected Preferences:</h6>
                        {preferences.centerPreference1 && (
                          <div className="mb-1">
                            <Badge bg="primary" className="me-2">CP1</Badge>
                            <strong>{preferences.centerPreference1}</strong>
                            {preferences.homeToCp1Distance && ` - Distance: ${preferences.homeToCp1Distance} km`}
                          </div>
                        )}
                        {preferences.centerPreference2 && (
                          <div>
                            <Badge bg="success" className="me-2">CP2</Badge>
                            <strong>{preferences.centerPreference2}</strong>
                            {preferences.homeToCp2Distance && ` - Distance: ${preferences.homeToCp2Distance} km`}
                          </div>
                        )}
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="bg-light">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <Button 
                    variant="danger" 
                    onClick={handleReset}
                    className="px-4">
                    <i className="bi bi-x-circle me-2"></i>
                    Reset All
                  </Button>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      onClick={savePreferences}
                      disabled={savingPreferences || !preferences.centerPreference1}
                      className="px-4">
                      {savingPreferences ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i>
                          Save Preferences
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleNextStudent}
                      className="px-4">
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
        
        .student-profile-card {
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
        
        .table-responsive {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .table th, .table td {
          vertical-align: middle;
        }
        
        @media (max-width: 768px) {
          .student-info {
            font-size: 0.9rem;
          }
          
          .table-responsive {
            font-size: 0.8rem;
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