// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, ToggleButton } from "react-bootstrap";
// import { GetCentersDataByExaminationAndExamTypeCounselling } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataCounselling, MarkCounsellingAttendance } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// export const MBCounsellingAttendance = () => {
//   const [centersData, setCentersData] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedVenue, setSelectedVenue] = useState("");
//   const [filteredVenues, setFilteredVenues] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchingData, setFetchingData] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
  
//   // Loading state for individual student attendance marking
//   const [markingAttendance, setMarkingAttendance] = useState({});
  
//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all"); // all, selected, waiting
//   const [filterBlock, setFilterBlock] = useState("");
//   const [uniqueBlocks, setUniqueBlocks] = useState([]);
  
//   // Attendance toggle states
//   const [attendanceToggle, setAttendanceToggle] = useState({});

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
    
//     const venues = centersData.filter(center => center.districtId === districtId);
//     setFilteredVenues(venues);
//   };

//   // Handle venue selection
//   const handleVenueChange = (e) => {
//     setSelectedVenue(e.target.value);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!selectedVenue) {
//       setError("Please select a venue");
//       return;
//     }
    
//     setFetchingData(true);
//     setError("");
//     setSuccessMessage("");
    
//     try {
//       const requestBody = {
//         counsellingVenue: selectedVenue,
//         selectionStatusForL3: "",
//         gender: ""
//       };
      
//       console.log("Request body:", requestBody);
      
//       const response = await GetAttendanceSheetDataCounselling(requestBody);
//       console.log("Attendance data:", response);
      
//       if (response.ok) {
//         const data = response.data || [];
        
//         // Sort data: Selected first, then Waiting, then by name
//         const sortedData = [...data].sort((a, b) => {
//           // First sort by selection status (Selected comes first)
//           if (a.selectionStatusForL3 === "Selected" && b.selectionStatusForL3 !== "Selected") return -1;
//           if (a.selectionStatusForL3 !== "Selected" && b.selectionStatusForL3 === "Selected") return 1;
//           // Then sort by name
//           return (a.name || "").localeCompare(b.name || "");
//         });
        
//         setAttendanceData(sortedData);
//         setFilteredData(sortedData);
        
//         // Extract unique blocks for filter
//         const blocks = [...new Set(sortedData.map(student => student.addressBlock).filter(block => block))];
//         setUniqueBlocks(blocks);
        
//         // Initialize attendance toggle states from fetched data
//         const initialToggles = {};
//         sortedData.forEach(student => {
//           initialToggles[student._id] = student.counsellingAttendance || false;
//         });
//         setAttendanceToggle(initialToggles);
        
//       } else {
//         setError(response.message || "Failed to fetch attendance data");
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data", error);
//       setError("An error occurred while fetching attendance data");
//     } finally {
//       setFetchingData(false);
//     }
//   };

//   // Apply filters and search
//   useEffect(() => {
//     let filtered = [...attendanceData];
    
//     // Filter by selection status
//     if (filterStatus !== "all") {
//       filtered = filtered.filter(student => student.selectionStatusForL3 === filterStatus);
//     }
    
//     // Filter by block
//     if (filterBlock) {
//       filtered = filtered.filter(student => student.addressBlock === filterBlock);
//     }
    
//     // Search by SRN or Name
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(student => 
//         (student.srn && student.srn.toLowerCase().includes(term)) ||
//         (student.name && student.name.toLowerCase().includes(term))
//       );
//     }
    
//     setFilteredData(filtered);
//   }, [searchTerm, filterStatus, filterBlock, attendanceData]);

//   // Handle attendance toggle with API integration
//   const handleAttendanceToggle = async (studentId, studentName) => {
//     const newStatus = !attendanceToggle[studentId];
//     const action = newStatus ? 'mark' : 'unmark';
    
    
//     // Set loading state for this specific student
//     setMarkingAttendance(prev => ({ ...prev, [studentId]: true }));
    
//     try {
//       const requestBody = {
//         studentId: studentId,
//         counsellingVenue: selectedVenue,
//         attendanceStatus: newStatus
//       };
      
//       console.log("Marking attendance request:", requestBody);
      
//       const response = await MarkCounsellingAttendance(requestBody);
//       console.log("Attendance marking response:", response);
      
//       if (response.ok) {
//         // Update local state with the response data
//         setAttendanceToggle(prev => ({
//           ...prev,
//           [studentId]: newStatus
//         }));
        
//         // Update the attendance data with new token if present
//         if (response.data && response.data.student) {
//           setAttendanceData(prev => prev.map(student => 
//             student._id === studentId 
//               ? { 
//                   ...student, 
//                   counsellingAttendance: response.data.student.counsellingAttendance,
//                   counsellingTokenNumber: response.data.student.counsellingTokenNumber
//                 }
//               : student
//           ));
//         }
        
//         // Show success message
//         setSuccessMessage(`${studentName} marked as ${newStatus ? 'Present' : 'Absent'}${newStatus ? ` with Token ${response.tokenNumber || 'N/A'}` : ''}`);
        
//         // Clear success message after 3 seconds
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//       } else {
//         setError(response.message || `Failed to ${action} attendance`);
//         // Revert the toggle if API fails
//         setAttendanceToggle(prev => ({
//           ...prev,
//           [studentId]: !newStatus
//         }));
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setError(error.response?.data?.message || `An error occurred while ${action}ing attendance`);
//       // Revert the toggle if API fails
//       setAttendanceToggle(prev => ({
//         ...prev,
//         [studentId]: !newStatus
//       }));
//     } finally {
//       setMarkingAttendance(prev => ({ ...prev, [studentId]: false }));
//     }
//   };

//   // Get badge color based on selection status
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

//   // Get attendance status text and color
//   const getAttendanceStatus = (studentId) => {
//     const isPresent = attendanceToggle[studentId];
//     return {
//       text: isPresent ? "Present" : "Absent",
//       color: isPresent ? "success" : "danger",
//       variant: isPresent ? "outline-success" : "outline-danger"
//     };
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Row>
//         <Col md={12}>
//           <Card>
//             <Card.Header as="h5" className="bg-primary text-white">
//               MB Counselling Attendance
//             </Card.Header>
//             <Card.Body>
//               {/* Success Message */}
//               {successMessage && (
//                 <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
//                   {successMessage}
//                 </Alert>
//               )}
              
//               {/* Error Message */}
//               {error && (
//                 <Alert variant="danger" onClose={() => setError("")} dismissible>
//                   {error}
//                 </Alert>
//               )}
              
//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>District <span className="text-danger">*</span></Form.Label>
//                       <Form.Select
//                         value={selectedDistrict}
//                         onChange={handleDistrictChange}
//                         disabled={loading}
//                         required
//                       >
//                         <option value="">Select District</option>
//                         {districts.map((district) => (
//                           <option key={district.id} value={district.id}>
//                             {district.name}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Examination Venue <span className="text-danger">*</span></Form.Label>
//                       <Form.Select
//                         value={selectedVenue}
//                         onChange={handleVenueChange}
//                         disabled={!selectedDistrict || loading}
//                         required
//                       >
//                         <option value="">Select Venue</option>
//                         {filteredVenues.map((venue) => (
//                           <option key={venue._id} value={venue.examinationVenue}>
//                             {venue.examinationVenue}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row>
//                   <Col md={12}>
//                     <Button 
//                       type="submit" 
//                       variant="primary" 
//                       disabled={fetchingData || !selectedVenue}
//                     >
//                       {fetchingData ? (
//                         <>
//                           <Spinner
//                             as="span"
//                             animation="border"
//                             size="sm"
//                             role="status"
//                             aria-hidden="true"
//                           /> Fetching Data...
//                         </>
//                       ) : (
//                         "Fetch Attendance Sheet"
//                       )}
//                     </Button>
//                   </Col>
//                 </Row>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
      
//       {/* Filters Section - Show only when data is loaded */}
//       {attendanceData.length > 0 && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Card>
//               <Card.Header as="h5" className="bg-info text-white">
//                 Filters & Search
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Search by SRN or Name</Form.Label>
//                       <InputGroup>
//                         <InputGroup.Text>🔍</InputGroup.Text>
//                         <Form.Control
//                           type="text"
//                           placeholder="Enter SRN or Name..."
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                       </InputGroup>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Filter by Selection Status</Form.Label>
//                       <Form.Select
//                         value={filterStatus}
//                         onChange={(e) => setFilterStatus(e.target.value)}
//                       >
//                         <option value="all">All Students</option>
//                         <option value="Selected">Selected Only</option>
//                         <option value="Waiting">Waiting Only</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Filter by Block</Form.Label>
//                       <Form.Select
//                         value={filterBlock}
//                         onChange={(e) => setFilterBlock(e.target.value)}
//                       >
//                         <option value="">All Blocks</option>
//                         {uniqueBlocks.map((block, index) => (
//                           <option key={index} value={block}>
//                             {block}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row>
//                   <Col md={12}>
//                     <div className="text-muted">
//                       Showing {filteredData.length} of {attendanceData.length} students
//                     </div>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}
      
//       {/* Student Cards Section */}
//       {filteredData.length > 0 && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <h4 className="mb-3">Student List</h4>
//             <div className="student-cards-container">
//               <Row>
//                 {filteredData.map((student, index) => {
//                   const attendanceStatus = getAttendanceStatus(student._id);
//                   const isMarking = markingAttendance[student._id];
//                   const tokenValue = student.counsellingTokenNumber || student.counsellingToken || "0";
                  
//                   return (
//                     <Col md={6} lg={4} xl={3} key={student._id || index} className="mb-4">
//                       <Card className="h-100 shadow-sm">
//                         <Card.Header className="d-flex justify-content-between align-items-center">
//                           <div>
//                             {getStatusBadge(student.selectionStatusForL3)}
//                           </div>
//                           <Badge 
//                             bg={attendanceStatus.color}
//                             className="p-2"
//                           >
//                             {attendanceStatus.text}
//                           </Badge>
//                         </Card.Header>
                        
//                         <Card.Body>
//                           <div className="text-center mb-3">
//                             <h5 className="mb-1">{student.name || "N/A"}</h5>
//                             <small className="text-muted">SRN: {student.srn || "N/A"}</small>
//                           </div>
                          
//                           <div className="student-details">
//                             <div className="mb-2">
//                               <strong>Father's Name:</strong> {student.father || "N/A"}
//                             </div>
//                             <div className="mb-2">
//                               <strong>District:</strong> {student.addressDistrict || student.L3ExaminationDistrict || "N/A"}
//                             </div>
//                             <div className="mb-2">
//                               <strong>Block:</strong> {student.addressBlock || student.L3ExaminationBlock || "N/A"}
//                             </div>
//                             <div className="mb-2">
//                               <strong>School:</strong> {student.school || "N/A"}
//                             </div>
//                             <div className="mb-2">
//                               <strong>Room No:</strong> {student.counsellingRoomNumber || student.orientationRoomNumber || "N/A"}
//                             </div>
//                           </div>
//                         </Card.Body>
                        
//                         <Card.Footer className="bg-white">
//                           <div className="d-flex justify-content-between align-items-center">
//                             <ToggleButton
//                               id={`toggle-attendance-${student._id}`}
//                               type="checkbox"
//                               variant={attendanceStatus.variant}
//                               checked={attendanceToggle[student._id] || false}
//                               value="1"
//                               onChange={() => handleAttendanceToggle(student._id, student.name)}
//                               className="attendance-toggle-btn"
//                               disabled={isMarking}
//                             >
//                               {isMarking ? (
//                                 <Spinner as="span" animation="border" size="sm" />
//                               ) : attendanceToggle[student._id] ? (
//                                 "✓ Marked"
//                               ) : (
//                                 "○ Mark Attendance"
//                               )}
//                             </ToggleButton>
                            
//                             {tokenValue !== "0" ? (
//                               <Badge 
//                                 bg="info" 
//                                 className="p-2 fs-6"
//                                 style={{ 
//                                   backgroundColor: '#0dcaf0',
//                                   fontSize: '1rem',
//                                   fontWeight: 'bold',
//                                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                                 }}
//                               >
//                                 🎫 Token: {tokenValue}
//                               </Badge>
//                             ) : (
//                               <span className="text-muted small">No Token</span>
//                             )}
//                           </div>
//                         </Card.Footer>
//                       </Card>
//                     </Col>
//                   );
//                 })}
//               </Row>
//             </div>
//           </Col>
//         </Row>
//       )}
      
//       {/* No Data Message */}
//       {!fetchingData && attendanceData.length === 0 && selectedVenue && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Alert variant="info">
//               No attendance data found for the selected venue.
//             </Alert>
//           </Col>
//         </Row>
//       )}
      
//       {/* No Results after filtering */}
//       {attendanceData.length > 0 && filteredData.length === 0 && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Alert variant="warning">
//               No students found matching the applied filters.
//             </Alert>
//           </Col>
//         </Row>
//       )}
      
//       <style jsx>{`
//         .student-cards-container {
//           max-height: calc(100vh - 400px);
//           overflow-y: auto;
//           padding: 10px;
//         }
//         .student-details {
//           font-size: 0.9rem;
//         }
//         .attendance-toggle-btn {
//           min-width: 120px;
//         }
//         .card-header {
//           background-color: #f8f9fa;
//         }
//       `}</style>
//     </Container>
//   );
// };








// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, ToggleButton } from "react-bootstrap";
// import { GetCentersDataByExaminationAndExamTypeCounselling } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataCounselling, MarkCounsellingAttendance } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// export const MBCounsellingAttendance = () => {
//   const [centersData, setCentersData] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedVenue, setSelectedVenue] = useState("");
//   const [filteredVenues, setFilteredVenues] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchingData, setFetchingData] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [accessCode, setAccessCode] = useState("");
//   const [accessCodeVerified, setAccessCodeVerified] = useState(false);
  
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
  
//   // Loading state for individual student attendance marking
//   const [markingAttendance, setMarkingAttendance] = useState({});
  
//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all"); // all, selected, waiting
//   const [filterBlock, setFilterBlock] = useState("");
//   const [uniqueBlocks, setUniqueBlocks] = useState([]);
  
//   // Attendance toggle states
//   const [attendanceToggle, setAttendanceToggle] = useState({});

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
    
//     const venues = centersData.filter(center => center.districtId === districtId);
//     setFilteredVenues(venues);
//   };

//   // Handle venue selection
//   const handleVenueChange = (e) => {
//     setSelectedVenue(e.target.value);
//     setAccessCodeVerified(false);
//     setAccessCode("");
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
//     const selectedDistrictObj = districts.find(d => d.id === selectedDistrict);
//     if (!selectedDistrictObj) return "";
    
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

//     // Verify access code before fetching data
//     if (!verifyAccessCode()) {
//       return;
//     }
    
//     setFetchingData(true);
//     setError("");
//     setSuccessMessage("");
    
//     try {
//       const requestBody = {
//         counsellingVenue: selectedVenue,
//         selectionStatusForL3: "",
//         gender: ""
//       };
      
//       console.log("Request body:", requestBody);
      
//       const response = await GetAttendanceSheetDataCounselling(requestBody);
//       console.log("Attendance data:", response);
      
//       if (response.ok) {
//         const data = response.data || [];
        
//         // Sort data: Selected first, then Waiting, then by name
//         const sortedData = [...data].sort((a, b) => {
//           // First sort by selection status (Selected comes first)
//           if (a.selectionStatusForL3 === "Selected" && b.selectionStatusForL3 !== "Selected") return -1;
//           if (a.selectionStatusForL3 !== "Selected" && b.selectionStatusForL3 === "Selected") return 1;
//           // Then sort by name
//           return (a.name || "").localeCompare(b.name || "");
//         });
        
//         setAttendanceData(sortedData);
//         setFilteredData(sortedData);
        
//         // Extract unique blocks for filter
//         const blocks = [...new Set(sortedData.map(student => student.addressBlock).filter(block => block))];
//         setUniqueBlocks(blocks);
        
//         // Initialize attendance toggle states from fetched data
//         const initialToggles = {};
//         sortedData.forEach(student => {
//           initialToggles[student._id] = student.counsellingAttendance || false;
//         });
//         setAttendanceToggle(initialToggles);
        
//         setSuccessMessage(`Successfully fetched ${sortedData.length} students data!`);
//         setTimeout(() => setSuccessMessage(""), 5000);
        
//       } else {
//         setError(response.message || "Failed to fetch attendance data");
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data", error);
//       setError("An error occurred while fetching attendance data");
//     } finally {
//       setFetchingData(false);
//     }
//   };

//   // Apply filters and search
//   useEffect(() => {
//     let filtered = [...attendanceData];
    
//     // Filter by selection status
//     if (filterStatus !== "all") {
//       filtered = filtered.filter(student => student.selectionStatusForL3 === filterStatus);
//     }
    
//     // Filter by block
//     if (filterBlock) {
//       filtered = filtered.filter(student => student.addressBlock === filterBlock);
//     }
    
//     // Search by SRN or Name
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(student => 
//         (student.srn && student.srn.toLowerCase().includes(term)) ||
//         (student.name && student.name.toLowerCase().includes(term))
//       );
//     }
    
//     setFilteredData(filtered);
//   }, [searchTerm, filterStatus, filterBlock, attendanceData]);

//   // Handle attendance toggle with API integration
//   const handleAttendanceToggle = async (studentId, studentName) => {
//     const newStatus = !attendanceToggle[studentId];
//     const action = newStatus ? 'mark' : 'unmark';
    
//     // Set loading state for this specific student
//     setMarkingAttendance(prev => ({ ...prev, [studentId]: true }));
    
//     try {
//       const requestBody = {
//         studentId: studentId,
//         counsellingVenue: selectedVenue,
//         attendanceStatus: newStatus
//       };
      
//       console.log("Marking attendance request:", requestBody);
      
//       const response = await MarkCounsellingAttendance(requestBody);
//       console.log("Attendance marking response:", response);
      
//       if (response.ok) {
//         // Update local state with the response data
//         setAttendanceToggle(prev => ({
//           ...prev,
//           [studentId]: newStatus
//         }));
        
//         // Update the attendance data with new token if present
//         if (response.data && response.data.student) {
//           setAttendanceData(prev => prev.map(student => 
//             student._id === studentId 
//               ? { 
//                   ...student, 
//                   counsellingAttendance: response.data.student.counsellingAttendance,
//                   counsellingTokenNumber: response.data.student.counsellingTokenNumber
//                 }
//               : student
//           ));
//         }
        
//         // Show success message
//         setSuccessMessage(`${studentName} marked as ${newStatus ? 'Present' : 'Absent'}${newStatus ? ` with Token ${response.tokenNumber || 'N/A'}` : ''}`);
        
//         // Clear success message after 3 seconds
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//       } else {
//         setError(response.message || `Failed to ${action} attendance`);
//         // Revert the toggle if API fails
//         setAttendanceToggle(prev => ({
//           ...prev,
//           [studentId]: !newStatus
//         }));
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setError(error.response?.data?.message || `An error occurred while ${action}ing attendance`);
//       // Revert the toggle if API fails
//       setAttendanceToggle(prev => ({
//         ...prev,
//         [studentId]: !newStatus
//       }));
//     } finally {
//       setMarkingAttendance(prev => ({ ...prev, [studentId]: false }));
//     }
//   };

//   // Get badge color based on selection status
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

//   // Get attendance status text and color
//   const getAttendanceStatus = (studentId) => {
//     const isPresent = attendanceToggle[studentId];
//     return {
//       text: isPresent ? "Present" : "Absent",
//       color: isPresent ? "success" : "danger",
//       variant: isPresent ? "outline-success" : "outline-danger"
//     };
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Row>
//         <Col md={12}>
//           <Card>
//             <Card.Header as="h5" className="bg-primary text-white">
//               MB Counselling Attendance
//             </Card.Header>
//             <Card.Body>
//               {/* Success Message */}
//               {successMessage && (
//                 <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
//                   {successMessage}
//                 </Alert>
//               )}
              
//               {/* Error Message */}
//               {error && (
//                 <Alert variant="danger" onClose={() => setError("")} dismissible>
//                   {error}
//                 </Alert>
//               )}
              
//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>District <span className="text-danger">*</span></Form.Label>
//                       <Form.Select
//                         value={selectedDistrict}
//                         onChange={handleDistrictChange}
//                         disabled={loading}
//                         required
//                       >
//                         <option value="">Select District</option>
//                         {districts.map((district) => (
//                           <option key={district.id} value={district.id}>
//                             {district.name}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Examination Venue <span className="text-danger">*</span></Form.Label>
//                       <Form.Select
//                         value={selectedVenue}
//                         onChange={handleVenueChange}
//                         disabled={!selectedDistrict || loading}
//                         required
//                       >
//                         <option value="">Select Venue</option>
//                         {filteredVenues.map((venue) => (
//                           <option key={venue._id} value={venue.examinationVenue}>
//                             {venue.examinationVenue}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row>
//                   <Col md={12}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Access Code <span className="text-danger">*</span></Form.Label>
//                       <InputGroup>
//                         <InputGroup.Text>🔐</InputGroup.Text>
//                         <Form.Control
//                           type="password"
//                           placeholder="Enter access code"
//                           value={accessCode}
//                           onChange={handleAccessCodeChange}
//                           disabled={!selectedVenue}
//                           required
//                           maxLength={7}
//                         />
//                         {accessCode && !accessCodeVerified && selectedVenue && (
//                           <Button 
//                             variant="outline-secondary" 
//                             onClick={verifyAccessCode}
//                             type="button"
//                           >
//                             Verify
//                           </Button>
//                         )}
//                       </InputGroup>
//                       {selectedDistrict && (
//                         <Form.Text className="text-muted">
//                           {getAccessCodeHint()}
//                         </Form.Text>
//                       )}
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row>
//                   <Col md={12}>
//                     <Button 
//                       type="submit" 
//                       variant="primary" 
//                       disabled={fetchingData || !selectedVenue || !accessCode}
//                     >
//                       {fetchingData ? (
//                         <>
//                           <Spinner
//                             as="span"
//                             animation="border"
//                             size="sm"
//                             role="status"
//                             aria-hidden="true"
//                           /> Fetching Data...
//                         </>
//                       ) : (
//                         "Fetch Attendance Sheet"
//                       )}
//                     </Button>
//                   </Col>
//                 </Row>
                
//                 {/* Display verification status */}
//                 {accessCodeVerified && selectedVenue && (
//                   <Alert variant="success" className="mt-3">
//                     ✓ Access code verified successfully!
//                   </Alert>
//                 )}
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
      
//       {/* Filters Section - Show only when data is loaded */}
//       {attendanceData.length > 0 && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Card>
//               <Card.Header as="h5" className="bg-info text-white">
//                 Filters & Search
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Search by SRN or Name</Form.Label>
//                       <InputGroup>
//                         <InputGroup.Text>🔍</InputGroup.Text>
//                         <Form.Control
//                           type="text"
//                           placeholder="Enter SRN or Name..."
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                       </InputGroup>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Filter by Selection Status</Form.Label>
//                       <Form.Select
//                         value={filterStatus}
//                         onChange={(e) => setFilterStatus(e.target.value)}
//                       >
//                         <option value="all">All Students</option>
//                         <option value="Selected">Selected Only</option>
//                         <option value="Waiting">Waiting Only</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Filter by Block</Form.Label>
//                       <Form.Select
//                         value={filterBlock}
//                         onChange={(e) => setFilterBlock(e.target.value)}
//                       >
//                         <option value="">All Blocks</option>
//                         {uniqueBlocks.map((block, index) => (
//                           <option key={index} value={block}>
//                             {block}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row>
//                   <Col md={12}>
//                     <div className="text-muted">
//                       Showing {filteredData.length} of {attendanceData.length} students
//                     </div>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}
      
//       {/* Student Cards Section */}
//       {filteredData.length > 0 && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <h4 className="mb-3">Student List</h4>
//             <div className="student-cards-container">
//               <Row>
//                 {filteredData.map((student, index) => {
//                   const attendanceStatus = getAttendanceStatus(student._id);
//                   const isMarking = markingAttendance[student._id];
//                   const tokenValue = student.counsellingTokenNumber || student.counsellingToken || "0";
                  
//                   return (
//                     <Col md={6} lg={4} xl={3} key={student._id || index} className="mb-4">
//                       <Card className="h-100 shadow-sm">
//                         <Card.Header className="d-flex justify-content-between align-items-center">
//                           <div>
//                             {getStatusBadge(student.selectionStatusForL3)}
//                           </div>
//                           <Badge 
//                             bg={attendanceStatus.color}
//                             className="p-2"
//                           >
//                             {attendanceStatus.text}
//                           </Badge>
//                         </Card.Header>
                        
//                         <Card.Body>
//                           <div className="text-center mb-3">
//                             <h5 className="mb-1">{student.name || "N/A"}</h5>
//                             <small className="text-muted">SRN: {student.srn || "N/A"}</small>
//                           </div>
                          
//                           <div className="student-details">
//                             <div className="mb-2">
//                               <strong>Father's Name:</strong> {student.father || "N/A"}
//                             </div>
//                             <div className="mb-2">
//                               <strong>District:</strong> {student.addressDistrict || student.L3ExaminationDistrict || "N/A"}
//                             </div>
//                             <div className="mb-2">
//                               <strong>Block:</strong> {student.addressBlock || student.L3ExaminationBlock || "N/A"}
//                             </div>
//                             <div className="mb-2">
//                               <strong>School:</strong> {student.school || "N/A"}
//                             </div>
//                             <div className="mb-2">
//                               <strong>Room No:</strong> {student.counsellingRoomNumber || student.orientationRoomNumber || "N/A"}
//                             </div>
//                           </div>
//                         </Card.Body>
                        
//                         <Card.Footer className="bg-white">
//                           <div className="d-flex justify-content-between align-items-center">
//                             <ToggleButton
//                               id={`toggle-attendance-${student._id}`}
//                               type="checkbox"
//                               variant={attendanceStatus.variant}
//                               checked={attendanceToggle[student._id] || false}
//                               value="1"
//                               onChange={() => handleAttendanceToggle(student._id, student.name)}
//                               className="attendance-toggle-btn"
//                               disabled={isMarking}
//                             >
//                               {isMarking ? (
//                                 <Spinner as="span" animation="border" size="sm" />
//                               ) : attendanceToggle[student._id] ? (
//                                 "✓ Marked"
//                               ) : (
//                                 "○ Mark Attendance"
//                               )}
//                             </ToggleButton>
                            
//                             {tokenValue !== "0" ? (
//                               <Badge 
//                                 bg="info" 
//                                 className="p-2 fs-6"
//                                 style={{ 
//                                   backgroundColor: '#0dcaf0',
//                                   fontSize: '1rem',
//                                   fontWeight: 'bold',
//                                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                                 }}
//                               >
//                                 🎫 Token: {tokenValue}
//                               </Badge>
//                             ) : (
//                               <span className="text-muted small">No Token</span>
//                             )}
//                           </div>
//                         </Card.Footer>
//                       </Card>
//                     </Col>
//                   );
//                 })}
//               </Row>
//             </div>
//           </Col>
//         </Row>
//       )}
      
//       {/* No Data Message */}
//       {!fetchingData && attendanceData.length === 0 && selectedVenue && accessCodeVerified && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Alert variant="info">
//               No attendance data found for the selected venue.
//             </Alert>
//           </Col>
//         </Row>
//       )}
      
//       {/* No Results after filtering */}
//       {attendanceData.length > 0 && filteredData.length === 0 && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Alert variant="warning">
//               No students found matching the applied filters.
//             </Alert>
//           </Col>
//         </Row>
//       )}
      
//       <style jsx>{`
//         .student-cards-container {
//           max-height: calc(100vh - 400px);
//           overflow-y: auto;
//           padding: 10px;
//         }
//         .student-details {
//           font-size: 0.9rem;
//         }
//         .attendance-toggle-btn {
//           min-width: 120px;
//         }
//         .card-header {
//           background-color: #f8f9fa;
//         }
//       `}</style>
//     </Container>
//   );
// };















import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, ToggleButton, Accordion } from "react-bootstrap";
import { GetCentersDataByExaminationAndExamTypeCounselling } from "../../services/ExaminationVenue/ExaminationVenueServices";
import { GetAttendanceSheetDataCounselling, MarkCounsellingAttendance } from "../../services/StudentRegistrationServices/StudentRegistrationService";

export const MBCounsellingAttendance = () => {
  const [centersData, setCentersData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [accessCodeVerified, setAccessCodeVerified] = useState(false);
  
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
  
  // Loading state for individual student attendance marking
  const [markingAttendance, setMarkingAttendance] = useState({});
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, selected, waiting
  const [filterBlock, setFilterBlock] = useState("");
  const [uniqueBlocks, setUniqueBlocks] = useState([]);
  
  // Attendance toggle states
  const [attendanceToggle, setAttendanceToggle] = useState({});

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterBlock("");
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
    
    const venues = centersData.filter(center => center.districtId === districtId);
    setFilteredVenues(venues);
  };

  // Handle venue selection
  const handleVenueChange = (e) => {
    setSelectedVenue(e.target.value);
    setAccessCodeVerified(false);
    setAccessCode("");
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
    const selectedDistrictObj = districts.find(d => d.id === selectedDistrict);
    if (!selectedDistrictObj) return "";
    
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

    // Verify access code before fetching data
    if (!verifyAccessCode()) {
      return;
    }
    
    setFetchingData(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const requestBody = {
        counsellingVenue: selectedVenue,
        selectionStatusForL3: "",
        gender: ""
      };
      
      console.log("Request body:", requestBody);
      
      const response = await GetAttendanceSheetDataCounselling(requestBody);
      console.log("Attendance data:", response);
      
      if (response.ok) {
        const data = response.data || [];
        
        // Sort data: Selected first, then Waiting, then by name
        const sortedData = [...data].sort((a, b) => {
          // First sort by selection status (Selected comes first)
          if (a.selectionStatusForL3 === "Selected" && b.selectionStatusForL3 !== "Selected") return -1;
          if (a.selectionStatusForL3 !== "Selected" && b.selectionStatusForL3 === "Selected") return 1;
          // Then sort by name
          return (a.name || "").localeCompare(b.name || "");
        });
        
        setAttendanceData(sortedData);
        setFilteredData(sortedData);
        
        // Extract unique blocks for filter
        const blocks = [...new Set(sortedData.map(student => student.addressBlock).filter(block => block))];
        setUniqueBlocks(blocks);
        
        // Initialize attendance toggle states from fetched data
        const initialToggles = {};
        sortedData.forEach(student => {
          initialToggles[student._id] = student.counsellingAttendance || false;
        });
        setAttendanceToggle(initialToggles);
        
        // Auto collapse the main accordion after successful data fetch
        setMainAccordionOpen([]);
        
        setSuccessMessage(`Successfully fetched ${sortedData.length} students data!`);
        setTimeout(() => setSuccessMessage(""), 5000);
        
      } else {
        setError(response.message || "Failed to fetch attendance data");
      }
    } catch (error) {
      console.error("Error fetching attendance data", error);
      setError("An error occurred while fetching attendance data");
    } finally {
      setFetchingData(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...attendanceData];
    
    // Filter by selection status
    if (filterStatus !== "all") {
      filtered = filtered.filter(student => student.selectionStatusForL3 === filterStatus);
    }
    
    // Filter by block
    if (filterBlock) {
      filtered = filtered.filter(student => student.addressBlock === filterBlock);
    }
    
    // Search by SRN or Name
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        (student.srn && student.srn.toLowerCase().includes(term)) ||
        (student.name && student.name.toLowerCase().includes(term))
      );
    }
    
    setFilteredData(filtered);
  }, [searchTerm, filterStatus, filterBlock, attendanceData]);

  // Handle attendance toggle with API integration
  const handleAttendanceToggle = async (studentId, studentName) => {
    const newStatus = !attendanceToggle[studentId];
    const action = newStatus ? 'mark' : 'unmark';
    
    // Set loading state for this specific student
    setMarkingAttendance(prev => ({ ...prev, [studentId]: true }));
    
    try {
      const requestBody = {
        studentId: studentId,
        counsellingVenue: selectedVenue,
        attendanceStatus: newStatus
      };
      
      console.log("Marking attendance request:", requestBody);
      
      const response = await MarkCounsellingAttendance(requestBody);
      console.log("Attendance marking response:", response);
      
      if (response.ok) {
        // Update local state with the response data
        setAttendanceToggle(prev => ({
          ...prev,
          [studentId]: newStatus
        }));
        
        // Update the attendance data with new token if present
        if (response.data && response.data.student) {
          setAttendanceData(prev => prev.map(student => 
            student._id === studentId 
              ? { 
                  ...student, 
                  counsellingAttendance: response.data.student.counsellingAttendance,
                  counsellingTokenNumber: response.data.student.counsellingTokenNumber
                }
              : student
          ));
        }
        
        // Show success message
        setSuccessMessage(`${studentName} marked as ${newStatus ? 'Present' : 'Absent'}${newStatus ? ` with Token ${response.tokenNumber || 'N/A'}` : ''}`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
        
      } else {
        setError(response.message || `Failed to ${action} attendance`);
        // Revert the toggle if API fails
        setAttendanceToggle(prev => ({
          ...prev,
          [studentId]: !newStatus
        }));
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError(error.response?.data?.message || `An error occurred while ${action}ing attendance`);
      // Revert the toggle if API fails
      setAttendanceToggle(prev => ({
        ...prev,
        [studentId]: !newStatus
      }));
    } finally {
      setMarkingAttendance(prev => ({ ...prev, [studentId]: false }));
    }
  };

  // Get badge color based on selection status
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

  // Get attendance status text and color
  const getAttendanceStatus = (studentId) => {
    const isPresent = attendanceToggle[studentId];
    return {
      text: isPresent ? "Present" : "Absent",
      color: isPresent ? "success" : "danger",
      variant: isPresent ? "outline-success" : "outline-danger"
    };
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={12}>
          {/* Main Form Accordion */}
          <Accordion activeKey={mainAccordionOpen} onSelect={(eventKey) => setMainAccordionOpen(eventKey)}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className="d-flex justify-content-between align-items-center w-100 me-3">
                  <span>
                    <i className="bi bi-person-check me-2"></i>
                    MB Counselling Attendance
                  </span>
                  {selectedVenue && accessCodeVerified && (
                    <Badge bg="success" className="ms-2">
                      ✓ Verified
                    </Badge>
                  )}
                  {attendanceData.length > 0 && (
                    <Badge bg="info" className="ms-2">
                      {attendanceData.length} Students Loaded
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
                            /> Fetching Data...
                          </>
                        ) : (
                          "Fetch Attendance Sheet"
                        )}
                      </Button>
                    </Col>
                  </Row>
                  
                  {/* Display verification status */}
                  {accessCodeVerified && selectedVenue && (
                    <Alert variant="success" className="mt-3">
                      ✓ Access code verified successfully!
                    </Alert>
                  )}
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      
      {/* Filters Section - Accordion */}
      {attendanceData.length > 0 && (
        <Row className="mt-4">
          <Col md={12}>
            <Accordion defaultActiveKey={["0"]}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-center w-100 me-3">
                    <span>
                      <i className="bi bi-funnel me-2"></i>
                      Filters & Search
                    </span>
                    <Badge bg="info" className="ms-2">
                      {filteredData.length} / {attendanceData.length} Students
                    </Badge>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Search by SRN or Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>🔍</InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Enter SRN or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Filter by Selection Status</Form.Label>
                        <Form.Select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="all">All Students</option>
                          <option value="Selected">Selected Only</option>
                          <option value="Waiting">Waiting Only</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Filter by Block</Form.Label>
                        <Form.Select
                          value={filterBlock}
                          onChange={(e) => setFilterBlock(e.target.value)}
                        >
                          <option value="">All Blocks</option>
                          {uniqueBlocks.map((block, index) => (
                            <option key={index} value={block}>
                              {block}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>&nbsp;</Form.Label>
                        <Button 
                          variant="outline-secondary" 
                          onClick={clearFilters}
                          className="w-100"
                        >
                          <i className="bi bi-eraser me-2"></i>
                          Clear Filters
                        </Button>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {(searchTerm || filterStatus !== "all" || filterBlock) && (
                    <Row>
                      <Col md={12}>
                        <Alert variant="info" className="mb-0">
                          <i className="bi bi-info-circle me-2"></i>
                          Active filters: Showing {filteredData.length} of {attendanceData.length} students
                          <Button 
                            variant="link" 
                            onClick={clearFilters}
                            className="p-0 ms-3"
                            style={{ textDecoration: 'none' }}
                          >
                            Clear all filters
                          </Button>
                        </Alert>
                      </Col>
                    </Row>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      )}
      
      {/* Student Cards Section */}
      {filteredData.length > 0 && (
        <Row className="mt-4">
          <Col md={12}>
            <h4 className="mb-3">
              Student List 
              <Badge bg="secondary" className="ms-2">
                Total: {filteredData.length}
              </Badge>
            </h4>
            <div className="student-cards-container">
              <Row>
                {filteredData.map((student, index) => {
                  const attendanceStatus = getAttendanceStatus(student._id);
                  const isMarking = markingAttendance[student._id];
                  const tokenValue = student.counsellingTokenNumber || student.counsellingToken || "0";
                  
                  return (
                    <Col md={6} lg={4} xl={3} key={student._id || index} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <div>
                            {getStatusBadge(student.selectionStatusForL3)}
                          </div>
                          <Badge 
                            bg={attendanceStatus.color}
                            className="p-2"
                          >
                            {attendanceStatus.text}
                          </Badge>
                        </Card.Header>
                        
                        <Card.Body>
                          <div className="text-center mb-3">
                            <h5 className="mb-1">{student.name || "N/A"}</h5>
                            <small className="text-muted">SRN: {student.srn || "N/A"}</small>
                          </div>
                          
                          <div className="student-details">
                            <div className="mb-2">
                              <strong>Father's Name:</strong> {student.father || "N/A"}
                            </div>
                            <div className="mb-2">
                              <strong>District:</strong> {student.addressDistrict || student.L3ExaminationDistrict || "N/A"}
                            </div>
                            <div className="mb-2">
                              <strong>Block:</strong> {student.addressBlock || student.L3ExaminationBlock || "N/A"}
                            </div>
                            <div className="mb-2">
                              <strong>School:</strong> {student.school || "N/A"}
                            </div>
                            <div className="mb-2">
                              <strong>Room No:</strong> {student.counsellingRoomNumber || student.orientationRoomNumber || "N/A"}
                            </div>
                          </div>
                        </Card.Body>
                        
                        <Card.Footer className="bg-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <ToggleButton
                              id={`toggle-attendance-${student._id}`}
                              type="checkbox"
                              variant={attendanceStatus.variant}
                              checked={attendanceToggle[student._id] || false}
                              value="1"
                              onChange={() => handleAttendanceToggle(student._id, student.name)}
                              className="attendance-toggle-btn"
                              disabled={isMarking}
                            >
                              {isMarking ? (
                                <Spinner as="span" animation="border" size="sm" />
                              ) : attendanceToggle[student._id] ? (
                                "✓ Marked"
                              ) : (
                                "○ Mark Attendance"
                              )}
                            </ToggleButton>
                            
                            {tokenValue !== "0" ? (
                              <Badge 
                                bg="info" 
                                className="p-2 fs-6"
                                style={{ 
                                  backgroundColor: '#0dcaf0',
                                  fontSize: '1rem',
                                  fontWeight: 'bold',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                              >
                                🎫 Token: {tokenValue}
                              </Badge>
                            ) : (
                              <span className="text-muted small">No Token</span>
                            )}
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Col>
        </Row>
      )}
      
      {/* No Data Message */}
      {!fetchingData && attendanceData.length === 0 && selectedVenue && accessCodeVerified && (
        <Row className="mt-4">
          <Col md={12}>
            <Alert variant="info">
              No attendance data found for the selected venue.
            </Alert>
          </Col>
        </Row>
      )}
      
      {/* No Results after filtering */}
      {attendanceData.length > 0 && filteredData.length === 0 && (
        <Row className="mt-4">
          <Col md={12}>
            <Alert variant="warning">
              No students found matching the applied filters.
            </Alert>
          </Col>
        </Row>
      )}
      
      <style jsx>{`
        .student-cards-container {
          max-height: calc(100vh - 500px);
          overflow-y: auto;
          padding: 10px;
        }
        .student-details {
          font-size: 0.9rem;
        }
        .attendance-toggle-btn {
          min-width: 120px;
        }
        .card-header {
          background-color: #f8f9fa;
        }
        .accordion-button:not(.collapsed) {
          background-color: #e7f1ff;
        }
      `}</style>
    </Container>
  );
};