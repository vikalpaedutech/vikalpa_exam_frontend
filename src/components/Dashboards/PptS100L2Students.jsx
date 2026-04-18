// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Spinner,
//   Alert,
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Accordion,
// } from "react-bootstrap";
// import Select from "react-select";
// import { FaArrowLeft, FaArrowRight, FaFilter, FaUserGraduate, FaSchool, FaMapMarkerAlt, FaVenusMars, FaIdCard, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { GetCentersDataByExaminationAndExamTypes100 } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataS100 } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// export const PptS100L2Students = () => {
//   const [centers, setCenters] = useState([]);
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [currentIndex, setCurrentIndex] = useState(0);

//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [selectedGender, setSelectedGender] = useState(null);
//   const [selectedStatus, setSelectedStatus] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [districtOptions, setDistrictOptions] = useState([]);
  
//   const [showFilters, setShowFilters] = useState(true);

//   const logo1 = "/haryana.png";
//   const logo3 = "/vikalpalogonotitle.png";

//   const batchOptions = [
//     { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01" },
//     { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02" },
//     { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03" },
//   ];

//   const genderOptions = [
//     { value: "MALE", label: "MALE" },
//     { value: "FEMALE", label: "FEMALE" },
//     { value: "BOTH", label: "BOTH" },
//   ];

//   const statusOptions = [
//     { value: "Selected", label: "Selected" },
//     { value: "Waitinglist", label: "Waitinglist" },
//   ];

//   // TWO-LEVEL SORTING FUNCTION: First by Father Name, then by Student Name
//   const sortDataByFatherAndStudent = (data) => {
//     if (!data || data.length === 0) return [];
    
//     return [...data].sort((a, b) => {
//       // First level: Sort by Father Name
//       const fatherNameA = (a.father || "").toUpperCase();
//       const fatherNameB = (b.father || "").toUpperCase();
      
//       if (fatherNameA < fatherNameB) return -1;
//       if (fatherNameA > fatherNameB) return 1;
      
//       // Second level: If Father Names are same, sort by Student Name
//       const studentNameA = (a.name || "").toUpperCase();
//       const studentNameB = (b.name || "").toUpperCase();
      
//       if (studentNameA < studentNameB) return -1;
//       if (studentNameA > studentNameB) return 1;
      
//       return 0;
//     });
//   };

//   /* ---------------- FETCH CENTERS ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamTypes100();
//         setCenters(res.data || []);
//       } catch {
//         setError("Failed to fetch centers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCenters();
//   }, []);

//   /* ---------------- EXTRACT DISTRICTS FROM DATA ---------------- */
//   useEffect(() => {
//     if (attendanceData.length > 0) {
//       const districts = [...new Set(attendanceData.map(item => item.L2ExaminationDistrict).filter(Boolean))];
//       const districtOpts = districts.map(district => ({
//         value: district,
//         label: district
//       }));
//       setDistrictOptions(districtOpts);
//     }
//   }, [attendanceData]);

//   /* ---------------- FILTER & SORT DATA ---------------- */
//   useEffect(() => {
//     if (attendanceData.length === 0) return;

//     let filtered = [...attendanceData];

//     // Apply batch filter
//     if (selectedBatch) {
//       filtered = filtered.filter(item => item.batchDivisionForL2Examination === selectedBatch.value);
//     }

//     // Apply gender filter
//     if (selectedGender && selectedGender.value !== "BOTH") {
//       filtered = filtered.filter(item => item.gender === selectedGender.value);
//     }

//     // Apply status filter
//     if (selectedStatus) {
//       filtered = filtered.filter(item => item.selectionStatusForL2 === selectedStatus.value);
//     }

//     // Apply district filter
//     if (selectedDistrict) {
//       filtered = filtered.filter(item => item.L2ExaminationDistrict === selectedDistrict.value);
//     }

//     // TWO-LEVEL SORTING: Father Name -> Student Name
//     const sortedFiltered = sortDataByFatherAndStudent(filtered);
    
//     setFilteredData(sortedFiltered);
//     setCurrentIndex(0);
//   }, [attendanceData, selectedBatch, selectedGender, selectedStatus, selectedDistrict]);

//   /* ---------------- FETCH DATA FROM API ---------------- */
//   const fetchData = async () => {
//     if (!selectedCenter) return;

//     setLoading(true);
//     try {
//       const payload = {
//         L2ExaminationCenter: selectedCenter.label,
//         ...(selectedBatch && selectedBatch.value !== "BOTH" && { batchDivisionForL2Examination: selectedBatch.value }),
//         ...(selectedGender  && { gender: selectedGender.value }),
//         ...(selectedStatus && { selectionStatusForL2: selectedStatus.value }),
//         ...(selectedDistrict && { L2ExaminationDistrict: selectedDistrict.value }),
//       };

//       const res = await GetAttendanceSheetDataS100(payload);

//       // Apply TWO-LEVEL SORTING on fetched data
//       const sortedData = sortDataByFatherAndStudent(res.data || []);
      
//       setAttendanceData(sortedData);
//       setFilteredData(sortedData);
//       setCurrentIndex(0);
      
//       // Collapse filters after loading
//       setShowFilters(false);
//     } catch {
//       setError("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- RESET FILTERS ---------------- */
//   const resetFilters = () => {
//     setSelectedBatch(null);
//     setSelectedGender(null);
//     setSelectedStatus(null);
//     setSelectedDistrict(null);
//     // Reset to original sorted data
//     if (attendanceData.length > 0) {
//       const sortedData = sortDataByFatherAndStudent(attendanceData);
//       setFilteredData(sortedData);
//     }
//     setCurrentIndex(0);
//   };

//   /* ---------------- NAVIGATION ---------------- */
//   const nextStudent = () => {
//     if (currentIndex < filteredData.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const prevStudent = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   const student = filteredData[currentIndex];

//   const centerOptions = centers.map((c) => ({
//     label: c.examinationVenue,
//     value: c._id,
//   }));

//   // Helper function to get gender icon
//   const getGenderIcon = (gender) => {
//     if (gender === "MALE") return <FaVenusMars style={{ color: "#3498db" }} />;
//     if (gender === "FEMALE") return <FaVenusMars style={{ color: "#e74c3c" }} />;
//     return null;
//   };

//   return (
//     <div style={{ 
//       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//       minHeight: "100vh",
//       padding: "20px"
//     }}>
//       <Container fluid className="py-4">
//         <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
//           <Card.Header style={{ 
//             background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
//             color: "white",
//             borderBottom: "3px solid #f39c12"
//           }}>
//             <div className="d-flex align-items-center justify-content-between">
//               <div>
//                 <FaFilter className="me-2" />
//                 <strong>HARYANA SUPER 100 (Level 1 Qualified Students) - STUDENT PRESENTATION</strong>
//               </div>
//               <div className="text-end">
//                 <small>Official Presentation</small>
//               </div>
//             </div>
//           </Card.Header>

//           <Card.Body style={{ background: "#f8f9fa" }}>
//             {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

//             {/* FILTERS SECTION WITH ACCORDION */}
//             <Accordion activeKey={showFilters ? "0" : null} className="mb-4">
//               <Accordion.Item eventKey="0" style={{ borderRadius: "15px", overflow: "hidden" }}>
//                 <Accordion.Header onClick={() => setShowFilters(!showFilters)}>
//                   <div className="d-flex align-items-center gap-2">
//                     <FaFilter />
//                     <strong>Filter Options</strong>
//                     {showFilters ? <FaChevronUp className="ms-2" /> : <FaChevronDown className="ms-2" />}
//                   </div>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <Card className="border-0 shadow-sm" style={{ borderRadius: "15px" }}>
//                     <Card.Body>
//                       <Row className="g-3">
//                         <Col md={3}>
//                           <Form.Label className="fw-bold">Center *</Form.Label>
//                           <Select
//                             placeholder="Select Center..."
//                             options={centerOptions}
//                             onChange={setSelectedCenter}
//                             className="react-select-container"
//                             classNamePrefix="react-select"
//                             isClearable
//                           />
//                         </Col>

//                         <Col md={3}>
//                           <Form.Label className="fw-bold">Batch</Form.Label>
//                           <Select 
//                             placeholder="Select Batch..." 
//                             options={batchOptions} 
//                             onChange={setSelectedBatch}
//                             isClearable
//                           />
//                         </Col>

//                         <Col md={3}>
//                           <Form.Label className="fw-bold">Gender</Form.Label>
//                           <Select 
//                             placeholder="Select Gender..." 
//                             options={genderOptions} 
//                             onChange={setSelectedGender}
//                             isClearable
//                           />
//                         </Col>

//                         <Col md={3}>
//                           <Form.Label className="fw-bold">Status</Form.Label>
//                           <Select 
//                             placeholder="Select Status..." 
//                             options={statusOptions} 
//                             onChange={setSelectedStatus}
//                             isClearable
//                           />
//                         </Col>

//                         <Col md={3}>
//                           <Form.Label className="fw-bold">District</Form.Label>
//                           <Select 
//                             placeholder="Select District..." 
//                             options={districtOptions} 
//                             onChange={setSelectedDistrict}
//                             isClearable
//                             isDisabled={attendanceData.length === 0}
//                           />
//                         </Col>

//                         <Col md={3}>
//                           <Form.Label className="fw-bold">Actions</Form.Label>
//                           <div>
//                             <Button 
//                               variant="outline-secondary" 
//                               onClick={resetFilters}
//                               size="sm"
//                               className="me-2"
//                             >
//                               Reset Filters
//                             </Button>
//                           </div>
//                         </Col>
//                       </Row>

//                       <div className="text-center mt-4">
//                         <Button 
//                           onClick={fetchData} 
//                           disabled={loading || !selectedCenter}
//                           style={{
//                             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                             border: "none",
//                             padding: "10px 40px",
//                             borderRadius: "50px",
//                             fontWeight: "bold"
//                           }}
//                         >
//                           {loading ? <Spinner size="sm" /> : "🎯 LOAD STUDENTS"}
//                         </Button>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Accordion>

//             {/* PPT SLIDE */}
//             {student && (
//               <div
//                 style={{
//                   background: "white",
//                   borderRadius: "20px",
//                   boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
//                   overflow: "hidden",
//                   position: "relative",
//                 }}
//               >
//                 {/* PowerPoint Style Header */}
//                 <div style={{
//                   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                   padding: "20px",
//                   color: "white",
//                   position: "relative"
//                 }}>
//                   <div className="text-center">
//                     <div className="mb-3">
//                       <img src={logo1} height="60" alt="Haryana Logo" style={{ margin: "0 15px" }} />
//                       <img src={logo3} height="60" alt="Vikalp Logo" style={{ margin: "0 15px" }} />
//                     </div>
//                     <h3 className="fw-bold mb-2">HARYANA SUPER 100 (Level 1 Qualified Students)</h3>
//                     <p className="mb-0">Student Information Dashboard</p>
//                     {selectedDistrict && (
//                       <p className="mb-0 mt-2" style={{ fontSize: "14px", opacity: 0.9 }}>
//                         <FaMapMarkerAlt /> District: {selectedDistrict.label}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Main Content */}
//                 <div style={{ padding: "30px" }}>
//                   <Row className="g-4">
//                     {/* PHOTO SECTION */}
//                     <Col md={4}>
//                       <div
//                         style={{
//                           background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
//                           borderRadius: "15px",
//                           padding: "20px",
//                           textAlign: "center",
//                           minHeight: "300px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
//                         }}
//                       >
//                         {student.imageUrl ? (
//                           <img
//                             src={student.imageUrl}
//                             alt="Student"
//                             style={{ 
//                               maxHeight: "250px", 
//                               maxWidth: "100%",
//                               borderRadius: "10px",
//                               boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
//                             }}
//                           />
//                         ) : (
//                           <div style={{ textAlign: "center" }}>
//                             <FaUserGraduate size={80} color="#95a5a6" />
//                             <p className="mt-2 text-muted">No Image Available</p>
//                           </div>
//                         )}
//                       </div>
//                     </Col>

//                     {/* DETAILS SECTION */}
//                     <Col md={8}>
//                       <div style={{
//                         background: "#f8f9fa",
//                         borderRadius: "15px",
//                         padding: "20px",
//                         height: "100%"
//                       }}>
//                         <h3 style={{ 
//                           color: "#2c3e50", 
//                           borderLeft: "4px solid #f39c12",
//                           paddingLeft: "15px",
//                           marginBottom: "20px"
//                         }}>
//                           Student Details
//                         </h3>
                        
//                         <div className="mb-3">
//                           <div className="d-flex align-items-center mb-3">
//                             <FaUserGraduate style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
//                             <strong style={{ minWidth: "120px" }}>NAME:</strong>
//                             <span style={{ fontSize: "18px", fontWeight: "500" }}>{student.name}</span>
//                           </div>
                          
//                           <div className="d-flex align-items-center mb-3">
//                             <FaIdCard style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
//                             <strong style={{ minWidth: "120px" }}>FATHER NAME:</strong>
//                             <span>{student.father}</span>
//                           </div>
                          
//                           <div className="d-flex align-items-center mb-3">
//                             <FaSchool style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
//                             <strong style={{ minWidth: "120px" }}>SCHOOL:</strong>
//                             <span>{student.school}</span>
//                           </div>
                          
//                           <div className="d-flex align-items-center mb-3">
//                             <FaMapMarkerAlt style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
//                             <strong style={{ minWidth: "120px" }}>BLOCK:</strong>
//                             <span>{student.L2ExaminationBlock}</span>
//                           </div>
                          
//                           <div className="d-flex align-items-center mb-3">
//                             <FaMapMarkerAlt style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
//                             <strong style={{ minWidth: "120px" }}>DISTRICT:</strong>
//                             <span>{student.L2ExaminationDistrict}</span>
//                           </div>
                          
//                           {student.gender && (
//                             <div className="d-flex align-items-center mb-3">
//                               {getGenderIcon(student.gender)}
//                               <strong style={{ minWidth: "120px", marginLeft: "10px" }}>GENDER:</strong>
//                               <span>{student.gender}</span>
//                             </div>
//                           )}
                          
//                           {/* {student.selectionStatusForL2 && (
//                             <div className="d-flex align-items-center">
//                               <strong style={{ minWidth: "120px" }}>STATUS:</strong>
//                               <span style={{
//                                 background: student.selectionStatusForL2 === "Selected" ? "#27ae60" : "#e74c3c",
//                                 color: "white",
//                                 padding: "5px 15px",
//                                 borderRadius: "20px",
//                                 fontSize: "12px",
//                                 fontWeight: "bold"
//                               }}>
//                                 {student.selectionStatusForL2}
//                               </span>
//                             </div>
//                           )} */}
//                         </div>
//                       </div>
//                     </Col>
//                   </Row>

//                   {/* BATCH INFORMATION */}
//                   {student.batchDivisionForL2Examination && (
//                     <div className="mt-4 text-center">
//                       <div style={{
//                         background: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
//                         color: "white",
//                         padding: "10px",
//                         borderRadius: "10px",
//                         display: "inline-block",
//                         width: "auto"
//                       }}>
//                         <strong>Batch: </strong> {student.batchDivisionForL2Examination}
//                       </div>
//                     </div>
//                   )}

//                   {/* NAVIGATION */}
//                   <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: "2px solid #e0e0e0" }}>
//                     <Button 
//                       onClick={prevStudent} 
//                       disabled={currentIndex === 0}
//                       variant="outline-primary"
//                       style={{ borderRadius: "50px", padding: "10px 30px" }}
//                     >
//                       <FaArrowLeft /> PREVIOUS
//                     </Button>

//                     <div style={{
//                       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                       color: "white",
//                       padding: "8px 20px",
//                       borderRadius: "50px",
//                       fontWeight: "bold"
//                     }}>
//                       Slide {currentIndex + 1} of {filteredData.length}
//                     </div>

//                     <Button 
//                       onClick={nextStudent} 
//                       disabled={currentIndex === filteredData.length - 1}
//                       variant="outline-primary"
//                       style={{ borderRadius: "50px", padding: "10px 30px" }}
//                     >
//                       NEXT <FaArrowRight />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div style={{
//                   background: "#2c3e50",
//                   color: "white",
//                   padding: "10px",
//                   textAlign: "center",
//                   fontSize: "12px"
//                 }}>
//                   <p className="mb-0">Haryana Super 100 (Level-2) Program | © 2026</p>
//                 </div>
//               </div>
//             )}

//             {!student && !loading && !error && (
//               <Alert variant="info" className="text-center rounded-3">
//                 <FaUserGraduate size={40} className="mb-2" />
//                 <p className="mb-0">Please select a center and load students to view the presentation</p>
//               </Alert>
//             )}
//           </Card.Body>
//         </Card>
//       </Container>

//       <style jsx="true">{`
//         .react-select-container .react-select__control {
//           border-radius: 10px;
//           border: 1px solid #ced4da;
//           min-height: 42px;
//         }
//         .react-select-container .react-select__control:hover {
//           border-color: #667eea;
//         }
//         .react-select-container .react-select__control--is-focused {
//           border-color: #667eea;
//           box-shadow: 0 0 0 1px #667eea;
//         }
//         .accordion-button:not(.collapsed) {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//         }
//         .accordion-button:focus {
//           box-shadow: none;
//           border-color: rgba(0,0,0,.125);
//         }
//       `}</style>
//     </div>
//   );
// };


















// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Spinner,
//   Alert,
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Accordion,
// } from "react-bootstrap";
// import Select from "react-select";
// import { FaArrowLeft, FaArrowRight, FaFilter, FaUserGraduate, FaSchool, FaMapMarkerAlt, FaVenusMars, FaIdCard, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { GetCentersDataByExaminationAndExamTypes100 } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataS100 } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// export const PptS100L2Students = () => {
//   const [centers, setCenters] = useState([]);
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [currentIndex, setCurrentIndex] = useState(0);

//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [selectedGender, setSelectedGender] = useState(null);
//   const [selectedStatus, setSelectedStatus] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [districtOptions, setDistrictOptions] = useState([]);
  
//   const [showFilters, setShowFilters] = useState(true);

//   const logo1 = "/haryana.png";
//   const logo3 = "/vikalpalogonotitle.png";

//   const batchOptions = [
//     { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01" },
//     { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02" },
//     { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03" },
//   ];

//   const genderOptions = [
//     { value: "MALE", label: "MALE" },
//     { value: "FEMALE", label: "FEMALE" },
//     { value: "BOTH", label: "BOTH" },
//   ];

//   const statusOptions = [
//     { value: "Selected", label: "Selected" },
//     { value: "Waitinglist", label: "Waitinglist" },
//   ];

//   // SINGLE-LEVEL SORTING FUNCTION: Only by Student Name
//   const sortDataByStudentName = (data) => {
//     if (!data || data.length === 0) return [];
    
//     return [...data].sort((a, b) => {
//       const studentNameA = (a.name || "").toUpperCase();
//       const studentNameB = (b.name || "").toUpperCase();
      
//       if (studentNameA < studentNameB) return -1;
//       if (studentNameA > studentNameB) return 1;
//       return 0;
//     });
//   };

//   /* ---------------- FETCH CENTERS ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamTypes100();
//         setCenters(res.data || []);
//       } catch {
//         setError("Failed to fetch centers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCenters();
//   }, []);

//   /* ---------------- EXTRACT DISTRICTS FROM DATA ---------------- */
//   useEffect(() => {
//     if (attendanceData.length > 0) {
//       const districts = [...new Set(attendanceData.map(item => item.L2ExaminationDistrict).filter(Boolean))];
//       const districtOpts = districts.map(district => ({
//         value: district,
//         label: district
//       }));
//       setDistrictOptions(districtOpts);
//     }
//   }, [attendanceData]);

//   /* ---------------- FILTER & SORT DATA ---------------- */
//   useEffect(() => {
//     if (attendanceData.length === 0) return;

//     let filtered = [...attendanceData];

//     // Apply batch filter
//     if (selectedBatch) {
//       filtered = filtered.filter(item => item.batchDivisionForL2Examination === selectedBatch.value);
//     }

//     // Apply gender filter
//     if (selectedGender && selectedGender.value !== "BOTH") {
//       filtered = filtered.filter(item => item.gender === selectedGender.value);
//     }

//     // Apply status filter
//     if (selectedStatus) {
//       filtered = filtered.filter(item => item.selectionStatusForL2 === selectedStatus.value);
//     }

//     // Apply district filter
//     if (selectedDistrict) {
//       filtered = filtered.filter(item => item.L2ExaminationDistrict === selectedDistrict.value);
//     }

//     // SINGLE-LEVEL SORTING: Only by Student Name
//     const sortedFiltered = sortDataByStudentName(filtered);
    
//     setFilteredData(sortedFiltered);
//     setCurrentIndex(0);
//   }, [attendanceData, selectedBatch, selectedGender, selectedStatus, selectedDistrict]);

//   /* ---------------- FETCH DATA FROM API ---------------- */
//   const fetchData = async () => {
//     if (!selectedCenter) return;

//     setLoading(true);
//     try {
//       const payload = {
//         L2ExaminationCenter: selectedCenter.label,
//         ...(selectedBatch && selectedBatch.value !== "BOTH" && { batchDivisionForL2Examination: selectedBatch.value }),
//         ...(selectedGender  && { gender: selectedGender.value }),
//         ...(selectedStatus && { selectionStatusForL2: selectedStatus.value }),
//         ...(selectedDistrict && { L2ExaminationDistrict: selectedDistrict.value }),
//       };

//       const res = await GetAttendanceSheetDataS100(payload);

//       // Apply SINGLE-LEVEL SORTING on fetched data (only by student name)
//       const sortedData = sortDataByStudentName(res.data || []);
      
//       setAttendanceData(sortedData);
//       setFilteredData(sortedData);
//       setCurrentIndex(0);
      
//       // Collapse filters after loading
//       setShowFilters(false);
//     } catch {
//       setError("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- RESET FILTERS ---------------- */
//   const resetFilters = () => {
//     setSelectedBatch(null);
//     setSelectedGender(null);
//     setSelectedStatus(null);
//     setSelectedDistrict(null);
//     // Reset to original sorted data
//     if (attendanceData.length > 0) {
//       const sortedData = sortDataByStudentName(attendanceData);
//       setFilteredData(sortedData);
//     }
//     setCurrentIndex(0);
//   };

//   /* ---------------- NAVIGATION ---------------- */
//   const nextStudent = () => {
//     if (currentIndex < filteredData.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const prevStudent = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   const student = filteredData[currentIndex];

//   const centerOptions = centers.map((c) => ({
//     label: c.examinationVenue,
//     value: c._id,
//   }));

//   // Helper function to get gender icon
//   const getGenderIcon = (gender) => {
//     if (gender === "MALE") return <FaVenusMars style={{ color: "#3498db" }} />;
//     if (gender === "FEMALE") return <FaVenusMars style={{ color: "#e74c3c" }} />;
//     return null;
//   };

//   return (
//     <div style={{ 
//       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//       minHeight: "100vh",
//       padding: "20px"
//     }}>
//       <Container fluid className="py-4">
//         <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
//           <Card.Header style={{ 
//             background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
//             color: "white",
//             borderBottom: "3px solid #f39c12"
//           }}>
//             <div className="d-flex align-items-center justify-content-between">
//               <div>
//                 <FaFilter className="me-2" />
//                 <strong>HARYANA SUPER 100 (Level 1 Qualified Students) - STUDENT PRESENTATION</strong>
//               </div>
//               <div className="text-end">
//                 <small>Official Presentation</small>
//               </div>
//             </div>
//           </Card.Header>

//           <Card.Body style={{ background: "#f8f9fa" }}>
//             {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

//             {/* FILTERS SECTION WITH ACCORDION */}
//             <Accordion activeKey={showFilters ? "0" : null} className="mb-4">
//               <Accordion.Item eventKey="0" style={{ borderRadius: "15px", overflow: "hidden" }}>
//                 <Accordion.Header onClick={() => setShowFilters(!showFilters)}>
//                   <div className="d-flex align-items-center gap-2">
//                     <FaFilter />
//                     <strong>Filter Options</strong>
//                     {showFilters ? <FaChevronUp className="ms-2" /> : <FaChevronDown className="ms-2" />}
//                   </div>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <Card className="border-0 shadow-sm" style={{ borderRadius: "15px" }}>
//                     <Card.Body>
//                       <Row className="g-3">
//                         <Col md={3}>
//                           <Form.Label className="fw-bold">Center *</Form.Label>
//                           <Select
//                             placeholder="Select Center..."
//                             options={centerOptions}
//                             onChange={setSelectedCenter}
//                             className="react-select-container"
//                             classNamePrefix="react-select"
//                             isClearable
//                           />
//                         </Col>

//                         <Col md={3}>
//                           <Form.Label className="fw-bold">Batch</Form.Label>
//                           <Select 
//                             placeholder="Select Batch..." 
//                             options={batchOptions} 
//                             onChange={setSelectedBatch}
//                             isClearable
//                           />
//                         </Col>

//                         <Col md={3}>
//                           <Form.Label className="fw-bold">Gender</Form.Label>
//                           <Select 
//                             placeholder="Select Gender..." 
//                             options={genderOptions} 
//                             onChange={setSelectedGender}
//                             isClearable
//                           />
//                         </Col>

//                         <Col md={3}>
//                           <Form.Label className="fw-bold">Status</Form.Label>
//                           <Select 
//                             placeholder="Select Status..." 
//                             options={statusOptions} 
//                             onChange={setSelectedStatus}
//                             isClearable
//                           />
//                         </Col>

//                         <Col md={3}>
//                           <Form.Label className="fw-bold">District</Form.Label>
//                           <Select 
//                             placeholder="Select District..." 
//                             options={districtOptions} 
//                             onChange={setSelectedDistrict}
//                             isClearable
//                             isDisabled={attendanceData.length === 0}
//                           />
//                         </Col>

//                         <Col md={3}>
//                           <Form.Label className="fw-bold">Actions</Form.Label>
//                           <div>
//                             <Button 
//                               variant="outline-secondary" 
//                               onClick={resetFilters}
//                               size="sm"
//                               className="me-2"
//                             >
//                               Reset Filters
//                             </Button>
//                           </div>
//                         </Col>
//                       </Row>

//                       <div className="text-center mt-4">
//                         <Button 
//                           onClick={fetchData} 
//                           disabled={loading || !selectedCenter}
//                           style={{
//                             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                             border: "none",
//                             padding: "10px 40px",
//                             borderRadius: "50px",
//                             fontWeight: "bold"
//                           }}
//                         >
//                           {loading ? <Spinner size="sm" /> : "🎯 LOAD STUDENTS"}
//                         </Button>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Accordion>

//             {/* PPT SLIDE */}
//             {student && (
//               <div
//                 style={{
//                   background: "white",
//                   borderRadius: "20px",
//                   boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
//                   overflow: "hidden",
//                   position: "relative",
//                 }}
//               >
//                 {/* PowerPoint Style Header */}
//                 <div style={{
//                   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                   padding: "20px",
//                   color: "white",
//                   position: "relative"
//                 }}>
//                   <div className="text-center">
//                     <div className="mb-3">
//                       <img src={logo1} height="60" alt="Haryana Logo" style={{ margin: "0 15px" }} />
//                       <img src={logo3} height="60" alt="Vikalp Logo" style={{ margin: "0 15px" }} />
//                     </div>
//                     <h3 className="fw-bold mb-2">HARYANA SUPER 100 (Level 1 Qualified Students)</h3>
//                     <p className="mb-0">Student Information Dashboard</p>
//                     {selectedDistrict && (
//                       <p className="mb-0 mt-2" style={{ fontSize: "14px", opacity: 0.9 }}>
//                         <FaMapMarkerAlt /> District: {selectedDistrict.label}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Main Content */}
//                 <div style={{ padding: "30px" }}>
//                   <Row className="g-4">
//                     {/* PHOTO SECTION */}
//                     <Col md={4}>
//                       <div
//                         style={{
//                           background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
//                           borderRadius: "15px",
//                           padding: "20px",
//                           textAlign: "center",
//                           minHeight: "300px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
//                         }}
//                       >
//                         {student.imageUrl ? (
//                           <img
//                             src={student.imageUrl}
//                             alt="Student"
//                             style={{ 
//                               maxHeight: "250px", 
//                               maxWidth: "100%",
//                               borderRadius: "10px",
//                               boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
//                             }}
//                           />
//                         ) : (
//                           <div style={{ textAlign: "center" }}>
//                             <FaUserGraduate size={80} color="#95a5a6" />
//                             <p className="mt-2 text-muted">No Image Available</p>
//                           </div>
//                         )}
//                       </div>
//                     </Col>

//                     {/* DETAILS SECTION */}
//                     <Col md={8}>
//                       <div style={{
//                         background: "#f8f9fa",
//                         borderRadius: "15px",
//                         padding: "20px",
//                         height: "100%"
//                       }}>
//                         <h3 style={{ 
//                           color: "#2c3e50", 
//                           borderLeft: "4px solid #f39c12",
//                           paddingLeft: "15px",
//                           marginBottom: "20px"
//                         }}>
//                           Student Details
//                         </h3>
                        
//                         <div className="mb-3">
//                           <div className="d-flex align-items-center mb-3">
//                             <FaUserGraduate style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
//                             <strong style={{ minWidth: "120px" }}>NAME:</strong>
//                             <span style={{ fontSize: "18px", fontWeight: "500" }}>{student.name}</span>
//                           </div>
                          
//                           <div className="d-flex align-items-center mb-3">
//                             <FaIdCard style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
//                             <strong style={{ minWidth: "120px" }}>FATHER NAME:</strong>
//                             <span>{student.father}</span>
//                           </div>
                          
//                           <div className="d-flex align-items-center mb-3">
//                             <FaSchool style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
//                             <strong style={{ minWidth: "120px" }}>SCHOOL:</strong>
//                             <span>{student.school}</span>
//                           </div>
                          
//                           <div className="d-flex align-items-center mb-3">
//                             <FaMapMarkerAlt style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
//                             <strong style={{ minWidth: "120px" }}>BLOCK:</strong>
//                             <span>{student.L2ExaminationBlock}</span>
//                           </div>
                          
//                           <div className="d-flex align-items-center mb-3">
//                             <FaMapMarkerAlt style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
//                             <strong style={{ minWidth: "120px" }}>DISTRICT:</strong>
//                             <span>{student.L2ExaminationDistrict}</span>
//                           </div>
                          
//                           {student.gender && (
//                             <div className="d-flex align-items-center mb-3">
//                               {getGenderIcon(student.gender)}
//                               <strong style={{ minWidth: "120px", marginLeft: "10px" }}>GENDER:</strong>
//                               <span>{student.gender}</span>
//                             </div>
//                           )}
                          
//                           {/* {student.selectionStatusForL2 && (
//                             <div className="d-flex align-items-center">
//                               <strong style={{ minWidth: "120px" }}>STATUS:</strong>
//                               <span style={{
//                                 background: student.selectionStatusForL2 === "Selected" ? "#27ae60" : "#e74c3c",
//                                 color: "white",
//                                 padding: "5px 15px",
//                                 borderRadius: "20px",
//                                 fontSize: "12px",
//                                 fontWeight: "bold"
//                               }}>
//                                 {student.selectionStatusForL2}
//                               </span>
//                             </div>
//                           )} */}
//                         </div>
//                       </div>
//                     </Col>
//                   </Row>

//                   {/* BATCH INFORMATION */}
//                   {student.batchDivisionForL2Examination && (
//                     <div className="mt-4 text-center">
//                       <div style={{
//                         background: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
//                         color: "white",
//                         padding: "10px",
//                         borderRadius: "10px",
//                         display: "inline-block",
//                         width: "auto"
//                       }}>
//                         <strong>Batch: </strong> {student.batchDivisionForL2Examination}
//                       </div>
//                     </div>
//                   )}

//                   {/* NAVIGATION */}
//                   <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: "2px solid #e0e0e0" }}>
//                     <Button 
//                       onClick={prevStudent} 
//                       disabled={currentIndex === 0}
//                       variant="outline-primary"
//                       style={{ borderRadius: "50px", padding: "10px 30px" }}
//                     >
//                       <FaArrowLeft /> PREVIOUS
//                     </Button>

//                     <div style={{
//                       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                       color: "white",
//                       padding: "8px 20px",
//                       borderRadius: "50px",
//                       fontWeight: "bold"
//                     }}>
//                       Slide {currentIndex + 1} of {filteredData.length}
//                     </div>

//                     <Button 
//                       onClick={nextStudent} 
//                       disabled={currentIndex === filteredData.length - 1}
//                       variant="outline-primary"
//                       style={{ borderRadius: "50px", padding: "10px 30px" }}
//                     >
//                       NEXT <FaArrowRight />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div style={{
//                   background: "#2c3e50",
//                   color: "white",
//                   padding: "10px",
//                   textAlign: "center",
//                   fontSize: "12px"
//                 }}>
//                   <p className="mb-0">Haryana Super 100 (Level-2) Program | © 2026</p>
//                 </div>
//               </div>
//             )}

//             {!student && !loading && !error && (
//               <Alert variant="info" className="text-center rounded-3">
//                 <FaUserGraduate size={40} className="mb-2" />
//                 <p className="mb-0">Please select a center and load students to view the presentation</p>
//               </Alert>
//             )}
//           </Card.Body>
//         </Card>
//       </Container>

//       <style jsx="true">{`
//         .react-select-container .react-select__control {
//           border-radius: 10px;
//           border: 1px solid #ced4da;
//           min-height: 42px;
//         }
//         .react-select-container .react-select__control:hover {
//           border-color: #667eea;
//         }
//         .react-select-container .react-select__control--is-focused {
//           border-color: #667eea;
//           box-shadow: 0 0 0 1px #667eea;
//         }
//         .accordion-button:not(.collapsed) {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//         }
//         .accordion-button:focus {
//           box-shadow: none;
//           border-color: rgba(0,0,0,.125);
//         }
//       `}</style>
//     </div>
//   );
// };











import React, { useEffect, useState } from "react";
import {
  Card,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Form,
  Button,
  Accordion,
} from "react-bootstrap";
import Select from "react-select";
import { FaArrowLeft, FaArrowRight, FaFilter, FaUserGraduate, FaSchool, FaMapMarkerAlt, FaVenusMars, FaIdCard, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GetCentersDataByExaminationAndExamTypes100 } from "../../services/ExaminationVenue/ExaminationVenueServices";
import { GetAttendanceSheetDataS100 } from "../../services/StudentRegistrationServices/StudentRegistrationService";

export const PptS100L2Students = () => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtOptions, setDistrictOptions] = useState([]);
  
  const [showFilters, setShowFilters] = useState(true);

  const logo1 = "/haryana.png";
  const logo3 = "/vikalpalogonotitle.png";

  const batchOptions = [
    { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01" },
    { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02" },
    { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03" },
  ];

  const genderOptions = [
    { value: "MALE", label: "MALE" },
    { value: "FEMALE", label: "FEMALE" },
    { value: "BOTH", label: "BOTH" },
  ];

  const statusOptions = [
    { value: "Selected", label: "Selected" },
    { value: "Waitinglist", label: "Waitinglist" },
  ];

  // Helper function to clean district name (remove everything after hyphen)
  const cleanDistrictName = (districtName) => {
    if (!districtName || districtName === "Unassigned") return districtName;
    const hyphenIndex = districtName.indexOf('-');
    if (hyphenIndex !== -1) {
      return districtName.substring(0, hyphenIndex).trim();
    }
    return districtName;
  };

  // SORTING FUNCTION: First by District, then by Student Name
  const sortDataByDistrictAndName = (data) => {
    if (!data || data.length === 0) return [];
    
    return [...data].sort((a, b) => {
      // First level: Sort by District
      const districtA = cleanDistrictName(a.L2ExaminationDistrict || "Unassigned");
      const districtB = cleanDistrictName(b.L2ExaminationDistrict || "Unassigned");
      
      if (districtA < districtB) return -1;
      if (districtA > districtB) return 1;
      
      // Second level: If Districts are same, sort by Student Name
      const studentNameA = (a.name || "").toUpperCase();
      const studentNameB = (b.name || "").toUpperCase();
      
      if (studentNameA < studentNameB) return -1;
      if (studentNameA > studentNameB) return 1;
      
      return 0;
    });
  };

  /* ---------------- FETCH CENTERS ---------------- */
  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      try {
        const res = await GetCentersDataByExaminationAndExamTypes100();
        setCenters(res.data || []);
      } catch {
        setError("Failed to fetch centers");
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  /* ---------------- EXTRACT DISTRICTS FROM DATA ---------------- */
  useEffect(() => {
    if (attendanceData.length > 0) {
      const districts = [...new Set(attendanceData.map(item => cleanDistrictName(item.L2ExaminationDistrict)).filter(Boolean))];
      const districtOpts = districts.map(district => ({
        value: district,
        label: district
      }));
      setDistrictOptions(districtOpts);
    }
  }, [attendanceData]);

  /* ---------------- FILTER & SORT DATA ---------------- */
  useEffect(() => {
    if (attendanceData.length === 0) return;

    let filtered = [...attendanceData];

    // Apply batch filter
    if (selectedBatch) {
      filtered = filtered.filter(item => item.batchDivisionForL2Examination === selectedBatch.value);
    }

    // Apply gender filter
    if (selectedGender && selectedGender.value !== "BOTH") {
      filtered = filtered.filter(item => item.gender === selectedGender.value);
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(item => item.selectionStatusForL2 === selectedStatus.value);
    }

    // Apply district filter (using cleaned district name)
    if (selectedDistrict) {
      filtered = filtered.filter(item => cleanDistrictName(item.L2ExaminationDistrict) === selectedDistrict.value);
    }

    // SORTING: First by District, then by Student Name
    const sortedFiltered = sortDataByDistrictAndName(filtered);
    
    setFilteredData(sortedFiltered);
    setCurrentIndex(0);
  }, [attendanceData, selectedBatch, selectedGender, selectedStatus, selectedDistrict]);

  /* ---------------- FETCH DATA FROM API ---------------- */
  const fetchData = async () => {
    if (!selectedCenter) return;

    setLoading(true);
    try {
      const payload = {
        L2ExaminationCenter: selectedCenter.label,
        ...(selectedBatch && selectedBatch.value !== "BOTH" && { batchDivisionForL2Examination: selectedBatch.value }),
        ...(selectedGender  && { gender: selectedGender.value }),
        ...(selectedStatus && { selectionStatusForL2: selectedStatus.value }),
        ...(selectedDistrict && { L2ExaminationDistrict: selectedDistrict.value }),
      };

      const res = await GetAttendanceSheetDataS100(payload);

      // Apply SORTING on fetched data (by district then by student name)
      const sortedData = sortDataByDistrictAndName(res.data || []);
      
      setAttendanceData(sortedData);
      setFilteredData(sortedData);
      setCurrentIndex(0);
      
      // Collapse filters after loading
      setShowFilters(false);
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET FILTERS ---------------- */
  const resetFilters = () => {
    setSelectedBatch(null);
    setSelectedGender(null);
    setSelectedStatus(null);
    setSelectedDistrict(null);
    // Reset to original sorted data
    if (attendanceData.length > 0) {
      const sortedData = sortDataByDistrictAndName(attendanceData);
      setFilteredData(sortedData);
    }
    setCurrentIndex(0);
  };

  /* ---------------- NAVIGATION ---------------- */
  const nextStudent = () => {
    if (currentIndex < filteredData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevStudent = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const student = filteredData[currentIndex];

  const centerOptions = centers.map((c) => ({
    label: c.examinationVenue,
    value: c._id,
  }));

  // Helper function to get gender icon
  const getGenderIcon = (gender) => {
    if (gender === "MALE") return <FaVenusMars style={{ color: "#3498db" }} />;
    if (gender === "FEMALE") return <FaVenusMars style={{ color: "#e74c3c" }} />;
    return null;
  };

  // Get current district info for display
  const currentDistrict = student ? cleanDistrictName(student.L2ExaminationDistrict) : "";
  const totalStudentsInCurrentDistrict = filteredData.filter(s => 
    cleanDistrictName(s.L2ExaminationDistrict) === currentDistrict
  ).length;
  const currentDistrictIndex = filteredData.findIndex(s => 
    cleanDistrictName(s.L2ExaminationDistrict) === currentDistrict
  );
  const currentStudentIndexInDistrict = filteredData.filter((s, idx) => 
    cleanDistrictName(s.L2ExaminationDistrict) === currentDistrict && idx <= currentIndex
  ).length;

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <Container fluid className="py-4">
        <Card className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
          <Card.Header style={{ 
            background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
            color: "white",
            borderBottom: "3px solid #f39c12"
          }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <FaFilter className="me-2" />
                <strong>HARYANA SUPER 100 (Level 1 Qualified Students) - STUDENT PRESENTATION</strong>
              </div>
              <div className="text-end">
                <small>Official Presentation</small>
              </div>
            </div>
          </Card.Header>

          <Card.Body style={{ background: "#f8f9fa" }}>
            {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

            {/* FILTERS SECTION WITH ACCORDION */}
            <Accordion activeKey={showFilters ? "0" : null} className="mb-4">
              <Accordion.Item eventKey="0" style={{ borderRadius: "15px", overflow: "hidden" }}>
                <Accordion.Header onClick={() => setShowFilters(!showFilters)}>
                  <div className="d-flex align-items-center gap-2">
                    <FaFilter />
                    <strong>Filter Options</strong>
                    {showFilters ? <FaChevronUp className="ms-2" /> : <FaChevronDown className="ms-2" />}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: "15px" }}>
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={3}>
                          <Form.Label className="fw-bold">Center *</Form.Label>
                          <Select
                            placeholder="Select Center..."
                            options={centerOptions}
                            onChange={setSelectedCenter}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            isClearable
                          />
                        </Col>

                        <Col md={3}>
                          <Form.Label className="fw-bold">Batch</Form.Label>
                          <Select 
                            placeholder="Select Batch..." 
                            options={batchOptions} 
                            onChange={setSelectedBatch}
                            isClearable
                          />
                        </Col>

                        <Col md={3}>
                          <Form.Label className="fw-bold">Gender</Form.Label>
                          <Select 
                            placeholder="Select Gender..." 
                            options={genderOptions} 
                            onChange={setSelectedGender}
                            isClearable
                          />
                        </Col>

                        <Col md={3}>
                          <Form.Label className="fw-bold">Status</Form.Label>
                          <Select 
                            placeholder="Select Status..." 
                            options={statusOptions} 
                            onChange={setSelectedStatus}
                            isClearable
                          />
                        </Col>

                        <Col md={3}>
                          <Form.Label className="fw-bold">District</Form.Label>
                          <Select 
                            placeholder="Select District..." 
                            options={districtOptions} 
                            onChange={setSelectedDistrict}
                            isClearable
                            isDisabled={attendanceData.length === 0}
                          />
                        </Col>

                        <Col md={3}>
                          <Form.Label className="fw-bold">Actions</Form.Label>
                          <div>
                            <Button 
                              variant="outline-secondary" 
                              onClick={resetFilters}
                              size="sm"
                              className="me-2"
                            >
                              Reset Filters
                            </Button>
                          </div>
                        </Col>
                      </Row>

                      <div className="text-center mt-4">
                        <Button 
                          onClick={fetchData} 
                          disabled={loading || !selectedCenter}
                          style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            padding: "10px 40px",
                            borderRadius: "50px",
                            fontWeight: "bold"
                          }}
                        >
                          {loading ? <Spinner size="sm" /> : "🎯 LOAD STUDENTS"}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {/* PPT SLIDE */}
            {student && (
              <div
                style={{
                  background: "white",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* PowerPoint Style Header */}
                <div style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "20px",
                  color: "white",
                  position: "relative"
                }}>
                  <div className="text-center">
                    <div className="mb-3">
                      <img src={logo1} height="60" alt="Haryana Logo" style={{ margin: "0 15px" }} />
                      <img src={logo3} height="60" alt="Vikalp Logo" style={{ margin: "0 15px" }} />
                    </div>
                    <h3 className="fw-bold mb-2">HARYANA SUPER 100 (Level 1 Qualified Students)</h3>
                    <p className="mb-0">Student Information Dashboard</p>
                    {selectedDistrict ? (
                      <p className="mb-0 mt-2" style={{ fontSize: "14px", opacity: 0.9 }}>
                        <FaMapMarkerAlt /> District: {selectedDistrict.label}
                      </p>
                    ) : (
                      <p className="mb-0 mt-2" style={{ fontSize: "14px", opacity: 0.9 }}>
                        <FaMapMarkerAlt /> Current District: {currentDistrict}
                      </p>
                    )}
                  </div>
                </div>

                {/* District Progress Bar */}
                {!selectedDistrict && (
                  <div style={{
                    background: "#ecf0f1",
                    padding: "8px 20px",
                    borderBottom: "1px solid #dcdde1"
                  }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2c3e50" }}>
                        🏢 District: {currentDistrict}
                      </span>
                      <span style={{ fontSize: "12px", color: "#7f8c8d" }}>
                        Student {currentStudentIndexInDistrict} of {totalStudentsInCurrentDistrict} in this district
                      </span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "4px",
                      backgroundColor: "#bdc3c7",
                      borderRadius: "2px",
                      marginTop: "5px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${(currentStudentIndexInDistrict / totalStudentsInCurrentDistrict) * 100}%`,
                        height: "100%",
                        backgroundColor: "#f39c12",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div style={{ padding: "30px" }}>
                  <Row className="g-4">
                    {/* PHOTO SECTION */}
                    <Col md={4}>
                      <div
                        style={{
                          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                          borderRadius: "15px",
                          padding: "20px",
                          textAlign: "center",
                          minHeight: "300px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                        }}
                      >
                        {student.imageUrl ? (
                          <img
                            src={student.imageUrl}
                            alt="Student"
                            style={{ 
                              maxHeight: "250px", 
                              maxWidth: "100%",
                              borderRadius: "10px",
                              boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
                            }}
                          />
                        ) : (
                          <div style={{ textAlign: "center" }}>
                            <FaUserGraduate size={80} color="#95a5a6" />
                            <p className="mt-2 text-muted">No Image Available</p>
                          </div>
                        )}
                      </div>
                    </Col>

                    {/* DETAILS SECTION */}
                    <Col md={8}>
                      <div style={{
                        background: "#f8f9fa",
                        borderRadius: "15px",
                        padding: "20px",
                        height: "100%"
                      }}>
                        <h3 style={{ 
                          color: "#2c3e50", 
                          borderLeft: "4px solid #f39c12",
                          paddingLeft: "15px",
                          marginBottom: "20px"
                        }}>
                          Student Details
                        </h3>
                        
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-3">
                            <FaUserGraduate style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
                            <strong style={{ minWidth: "120px" }}>NAME:</strong>
                            <span style={{ fontSize: "18px", fontWeight: "500" }}>{student.name}</span>
                          </div>
                          
                          <div className="d-flex align-items-center mb-3">
                            <FaIdCard style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
                            <strong style={{ minWidth: "120px" }}>FATHER NAME:</strong>
                            <span>{student.father}</span>
                          </div>
                          
                          <div className="d-flex align-items-center mb-3">
                            <FaSchool style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
                            <strong style={{ minWidth: "120px" }}>SCHOOL:</strong>
                            <span>{student.school}</span>
                          </div>
                          
                          <div className="d-flex align-items-center mb-3">
                            <FaMapMarkerAlt style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
                            <strong style={{ minWidth: "120px" }}>BLOCK:</strong>
                            <span>{student.L2ExaminationBlock}</span>
                          </div>
                          
                          <div className="d-flex align-items-center mb-3">
                            <FaMapMarkerAlt style={{ color: "#667eea", fontSize: "20px", marginRight: "10px" }} />
                            <strong style={{ minWidth: "120px" }}>DISTRICT:</strong>
                            <span style={{ fontWeight: "bold", color: "#e67e22" }}>
                              {cleanDistrictName(student.L2ExaminationDistrict)}
                            </span>
                          </div>
                          
                          {student.gender && (
                            <div className="d-flex align-items-center mb-3">
                              {getGenderIcon(student.gender)}
                              <strong style={{ minWidth: "120px", marginLeft: "10px" }}>GENDER:</strong>
                              <span>{student.gender}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* BATCH INFORMATION */}
                  {student.batchDivisionForL2Examination && (
                    <div className="mt-4 text-center">
                      <div style={{
                        background: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
                        color: "white",
                        padding: "10px",
                        borderRadius: "10px",
                        display: "inline-block",
                        width: "auto"
                      }}>
                        <strong>Batch: </strong> {student.batchDivisionForL2Examination}
                      </div>
                    </div>
                  )}

                  {/* NAVIGATION */}
                  <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: "2px solid #e0e0e0" }}>
                    <Button 
                      onClick={prevStudent} 
                      disabled={currentIndex === 0}
                      variant="outline-primary"
                      style={{ borderRadius: "50px", padding: "10px 30px" }}
                    >
                      <FaArrowLeft /> PREVIOUS
                    </Button>

                    <div style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: "8px 20px",
                      borderRadius: "50px",
                      fontWeight: "bold"
                    }}>
                      Slide {currentIndex + 1} of {filteredData.length}
                    </div>

                    <Button 
                      onClick={nextStudent} 
                      disabled={currentIndex === filteredData.length - 1}
                      variant="outline-primary"
                      style={{ borderRadius: "50px", padding: "10px 30px" }}
                    >
                      NEXT <FaArrowRight />
                    </Button>
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  background: "#2c3e50",
                  color: "white",
                  padding: "10px",
                  textAlign: "center",
                  fontSize: "12px"
                }}>
                  <p className="mb-0">Haryana Super 100 (Level-2) Program | © 2026</p>
                </div>
              </div>
            )}

            {!student && !loading && !error && (
              <Alert variant="info" className="text-center rounded-3">
                <FaUserGraduate size={40} className="mb-2" />
                <p className="mb-0">Please select a center and load students to view the presentation</p>
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Container>

      <style jsx="true">{`
        .react-select-container .react-select__control {
          border-radius: 10px;
          border: 1px solid #ced4da;
          min-height: 42px;
        }
        .react-select-container .react-select__control:hover {
          border-color: #667eea;
        }
        .react-select-container .react-select__control--is-focused {
          border-color: #667eea;
          box-shadow: 0 0 0 1px #667eea;
        }
        .accordion-button:not(.collapsed) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .accordion-button:focus {
          box-shadow: none;
          border-color: rgba(0,0,0,.125);
        }
      `}</style>
    </div>
  );
};