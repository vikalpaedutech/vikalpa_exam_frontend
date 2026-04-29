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















// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, ToggleButton, Accordion } from "react-bootstrap";
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
  
//   // Loading state for individual student attendance marking
//   const [markingAttendance, setMarkingAttendance] = useState({});
  
//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all"); // all, selected, waiting
//   const [filterBlock, setFilterBlock] = useState("");
//   const [uniqueBlocks, setUniqueBlocks] = useState([]);
  
//   // Attendance toggle states
//   const [attendanceToggle, setAttendanceToggle] = useState({});

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchTerm("");
//     setFilterStatus("all");
//     setFilterBlock("");
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
        
//         // Auto collapse the main accordion after successful data fetch
//         setMainAccordionOpen([]);
        
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
//           {/* Main Form Accordion */}
//           <Accordion activeKey={mainAccordionOpen} onSelect={(eventKey) => setMainAccordionOpen(eventKey)}>
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>
//                 <div className="d-flex justify-content-between align-items-center w-100 me-3">
//                   <span>
//                     <i className="bi bi-person-check me-2"></i>
//                     MB Counselling Attendance
//                   </span>
//                   {selectedVenue && accessCodeVerified && (
//                     <Badge bg="success" className="ms-2">
//                       ✓ Verified
//                     </Badge>
//                   )}
//                   {attendanceData.length > 0 && (
//                     <Badge bg="info" className="ms-2">
//                       {attendanceData.length} Students Loaded
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
//                             /> Fetching Data...
//                           </>
//                         ) : (
//                           "Fetch Attendance Sheet"
//                         )}
//                       </Button>
//                     </Col>
//                   </Row>
                  
//                   {/* Display verification status */}
//                   {accessCodeVerified && selectedVenue && (
//                     <Alert variant="success" className="mt-3">
//                       ✓ Access code verified successfully!
//                     </Alert>
//                   )}
//                 </Form>
//               </Accordion.Body>
//             </Accordion.Item>
//           </Accordion>
//         </Col>
//       </Row>
      
//       {/* Filters Section - Accordion */}
//       {attendanceData.length > 0 && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <Accordion defaultActiveKey={["0"]}>
//               <Accordion.Item eventKey="0">
//                 <Accordion.Header>
//                   <div className="d-flex justify-content-between align-items-center w-100 me-3">
//                     <span>
//                       <i className="bi bi-funnel me-2"></i>
//                       Filters & Search
//                     </span>
//                     <Badge bg="info" className="ms-2">
//                       {filteredData.length} / {attendanceData.length} Students
//                     </Badge>
//                   </div>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <Row>
//                     <Col md={4}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Search by SRN or Name</Form.Label>
//                         <InputGroup>
//                           <InputGroup.Text>🔍</InputGroup.Text>
//                           <Form.Control
//                             type="text"
//                             placeholder="Enter SRN or Name..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                           />
//                         </InputGroup>
//                       </Form.Group>
//                     </Col>
                    
//                     <Col md={3}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Filter by Selection Status</Form.Label>
//                         <Form.Select
//                           value={filterStatus}
//                           onChange={(e) => setFilterStatus(e.target.value)}
//                         >
//                           <option value="all">All Students</option>
//                           <option value="Selected">Selected Only</option>
//                           <option value="Waiting">Waiting Only</option>
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
                    
//                     <Col md={3}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Filter by Block</Form.Label>
//                         <Form.Select
//                           value={filterBlock}
//                           onChange={(e) => setFilterBlock(e.target.value)}
//                         >
//                           <option value="">All Blocks</option>
//                           {uniqueBlocks.map((block, index) => (
//                             <option key={index} value={block}>
//                               {block}
//                             </option>
//                           ))}
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
                    
//                     <Col md={2}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>&nbsp;</Form.Label>
//                         <Button 
//                           variant="outline-secondary" 
//                           onClick={clearFilters}
//                           className="w-100"
//                         >
//                           <i className="bi bi-eraser me-2"></i>
//                           Clear Filters
//                         </Button>
//                       </Form.Group>
//                     </Col>
//                   </Row>
                  
//                   {(searchTerm || filterStatus !== "all" || filterBlock) && (
//                     <Row>
//                       <Col md={12}>
//                         <Alert variant="info" className="mb-0">
//                           <i className="bi bi-info-circle me-2"></i>
//                           Active filters: Showing {filteredData.length} of {attendanceData.length} students
//                           <Button 
//                             variant="link" 
//                             onClick={clearFilters}
//                             className="p-0 ms-3"
//                             style={{ textDecoration: 'none' }}
//                           >
//                             Clear all filters
//                           </Button>
//                         </Alert>
//                       </Col>
//                     </Row>
//                   )}
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Accordion>
//           </Col>
//         </Row>
//       )}
      
//       {/* Student Cards Section */}
//       {filteredData.length > 0 && (
//         <Row className="mt-4">
//           <Col md={12}>
//             <h4 className="mb-3">
//               Student List 
//               <Badge bg="secondary" className="ms-2">
//                 Total: {filteredData.length}
//               </Badge>
//             </h4>
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
//           max-height: calc(100vh - 500px);
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
//         .accordion-button:not(.collapsed) {
//           background-color: #e7f1ff;
//         }
//       `}</style>
//     </Container>
//   );
// };











import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, Accordion } from "react-bootstrap";
import { GetCentersDataByExaminationAndExamTypeCounselling } from "../../services/ExaminationVenue/ExaminationVenueServices";
import { GetAttendanceSheetDataCounselling, MarkCounsellingAttendance } from "../../services/StudentRegistrationServices/StudentRegistrationService";

export const MBCounsellingAttendance = () => {
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
  const [markingAttendance, setMarkingAttendance] = useState(false);
  
  // Attendance toggle state
  const [attendanceToggle, setAttendanceToggle] = useState(false);

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
      console.log("Student data response:", response);
      
      if (response.ok && response.data && response.data.length > 0) {
        const student = response.data[0]; // Get the first matching student
        
        setCurrentStudent(student);
        setAttendanceToggle(student.counsellingAttendance || false);
        setStudentNotFound(false);
        setShowSRNSearch(false);
        setSuccessMessage(`✓ Student found: ${student.name}`);
        setTimeout(() => setSuccessMessage(""), 3000);
        
      } else {
        setStudentNotFound(true);
        setCurrentStudent(null);
        setError(`No student found with SRN: ${srnInput}`);
      }
    } catch (error) {
      console.error("Error fetching student data", error);
      setError("An error occurred while fetching student data");
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

  // Handle attendance toggle with API integration
  const handleAttendanceToggle = async () => {
    if (!currentStudent) return;
    
    const newStatus = !attendanceToggle;
    
    setMarkingAttendance(true);
    
    try {
      const requestBody = {
        studentId: currentStudent._id,
        counsellingVenue: selectedVenue,
        attendanceStatus: newStatus
      };
      
      console.log("Marking attendance request:", requestBody);
      
      const response = await MarkCounsellingAttendance(requestBody);
      console.log("Attendance marking response:", response);
      
      if (response.ok) {
        setAttendanceToggle(newStatus);
        
        // Update current student
        setCurrentStudent(prev => ({
          ...prev,
          counsellingAttendance: newStatus,
          counsellingTokenNumber: response.data?.student?.counsellingTokenNumber || prev.counsellingTokenNumber
        }));
        
        setSuccessMessage(`${currentStudent.name} marked as ${newStatus ? 'Present' : 'Absent'}${newStatus ? ` with Token ${response.tokenNumber || response.data?.student?.counsellingTokenNumber || 'N/A'}` : ''}`);
        setTimeout(() => setSuccessMessage(""), 3000);
        
      } else {
        setError(response.message || `Failed to mark attendance`);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError(error.response?.data?.message || `An error occurred while marking attendance`);
    } finally {
      setMarkingAttendance(false);
    }
  };

  // Handle next student
  const handleNextStudent = () => {
    setCurrentStudent(null);
    setSrnInput("");
    setShowSRNSearch(true);
    setStudentNotFound(false);
    setError("");
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
                  <h3 className="mb-2">Find Student</h3>
                  <p className="text-muted">Enter SRN to fetch and mark attendance</p>
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
                        Enter valid SRN to fetch student details from the selected venue.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mt-4">
                  <Col md={12} className="text-center">
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleReset}
                    >
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
      
      {/* Student Details Card */}
      {currentStudent && !showSRNSearch && (
        <Row className="mt-4">
          <Col md={12}>
            <Card className="shadow-lg border-0 student-profile-card">
              <Card.Header className="bg-gradient-success text-white" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-person-circle me-2"></i>
                    Student Profile
                  </h5>
                  {getStatusBadge(currentStudent.selectionStatusForL3)}
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <Row>
                  <Col md={12} className="text-center mb-4">
                    <div className="avatar-circle mb-3">
                      <i className="bi bi-person-fill" style={{ fontSize: '3rem', color: '#fff' }}></i>
                    </div>
                    <h3 className="mb-1">{currentStudent.name || "N/A"}</h3>
                    <p className="text-muted">
                      <i className="bi bi-hash me-1"></i>
                      SRN: {currentStudent.srn || "N/A"}
                    </p>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <div className="info-card mb-3">
                      <h6 className="text-muted mb-3">
                        <i className="bi bi-person me-2"></i>
                        Personal Information
                      </h6>
                      <div className="info-item">
                        <i className="bi bi-person-badge me-2 text-primary"></i>
                        <strong>Father's Name:</strong> {currentStudent.father || "N/A"}
                      </div>
                      <div className="info-item">
                        <i className="bi bi-book me-2 text-primary"></i>
                        <strong>School:</strong> {currentStudent.school || "N/A"}
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="info-card mb-3">
                      <h6 className="text-muted mb-3">
                        <i className="bi bi-geo me-2"></i>
                        Address Information
                      </h6>
                      <div className="info-item">
                        <i className="bi bi-building me-2 text-primary"></i>
                        <strong>District:</strong> {currentStudent.addressDistrict || currentStudent.L3ExaminationDistrict || "N/A"}
                      </div>
                      <div className="info-item">
                        <i className="bi bi-grid me-2 text-primary"></i>
                        <strong>Block:</strong> {currentStudent.addressBlock || currentStudent.L3ExaminationBlock || "N/A"}
                      </div>
                      <div className="info-item">
                        <i className="bi bi-door-closed me-2 text-primary"></i>
                        <strong>Room No:</strong> {currentStudent.counsellingRoomNumber || currentStudent.orientationRoomNumber || "N/A"}
                      </div>
                      <div className="info-item">
                        <i className="bi bi-geo-alt me-2 text-primary"></i>
                        <strong>Venue:</strong> {selectedVenue}
                      </div>
                    </div>
                  </Col>
                </Row>
                
                <hr className="my-4" />
                
                <Row>
                  <Col md={12}>
                    <div className="attendance-toggle-section text-center p-4">
                      <h6 className="mb-4">
                        <i className="bi bi-calendar-check me-2"></i>
                        Attendance Status
                      </h6>
                      
                      <div className="toggle-switch-container">
                        <div className="status-badge mb-3">
                          <Badge 
                            bg={attendanceToggle ? "success" : "secondary"}
                            className="p-3 px-4 fs-6"
                            style={{ fontSize: '1.2rem', borderRadius: '50px' }}
                          >
                            <i className={`bi bi-${attendanceToggle ? 'check-circle-fill' : 'x-circle-fill'} me-2`}></i>
                            Currently: {attendanceToggle ? "Present" : "Absent"}
                          </Badge>
                        </div>
                        
                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                          <Button
                            variant={attendanceToggle ? "outline-danger" : "success"}
                            size="lg"
                            onClick={handleAttendanceToggle}
                            disabled={markingAttendance}
                            className="px-5 py-3 toggle-btn"
                            style={{ borderRadius: '50px', fontWeight: 'bold' }}
                          >
                            {markingAttendance ? (
                              <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Processing...
                              </>
                            ) : attendanceToggle ? (
                              <>
                                <i className="bi bi-x-lg me-2"></i>
                                Mark as Absent
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-lg me-2"></i>
                                Mark as Present
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {currentStudent.counsellingTokenNumber && currentStudent.counsellingTokenNumber !== "0" && (
                        <div className="mt-4 token-card">
                          <div className="token-badge">
                            <i className="bi bi-ticket-perforated me-2"></i>
                            Token Number: {currentStudent.counsellingTokenNumber}
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="bg-light text-center">
                <Button 
                  variant="primary" 
                  onClick={handleNextStudent}
                  className="px-5 py-2 next-btn"
                  style={{ borderRadius: '50px', fontWeight: 'bold' }}
                >
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  Next Student
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      )}
      
      <style jsx>{`
        .bg-gradient-search {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .avatar-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .info-card {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 20px;
          height: 100%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .info-item {
          padding: 10px;
          margin-bottom: 8px;
          background: white;
          border-radius: 10px;
          border-left: 3px solid #667eea;
        }
        
        .attendance-toggle-section {
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
          border-radius: 20px;
        }
        
        .token-card {
          text-align: center;
        }
        
        .token-badge {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          padding: 15px 30px;
          border-radius: 50px;
          display: inline-block;
          font-weight: bold;
          font-size: 1.2rem;
          color: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .toggle-btn {
          transition: all 0.3s ease;
        }
        
        .toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .next-btn {
          transition: all 0.3s ease;
        }
        
        .next-btn:hover {
          transform: translateX(5px);
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
        
        @media (max-width: 768px) {
          .info-item {
            font-size: 0.9rem;
          }
          
          .toggle-btn {
            width: 100%;
          }
          
          .token-badge {
            font-size: 0.9rem;
            padding: 10px 20px;
          }
        }
      `}</style>
    </Container>
  );
};