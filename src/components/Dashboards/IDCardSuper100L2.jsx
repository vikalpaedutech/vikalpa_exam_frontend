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

// export const IDCardSuper100L2 = () => {
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
//         ...(selectedGender && selectedGender.value !== "BOTH" && { gender: selectedGender.value }),
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
//   Table,
//   Spinner,
//   Alert,
//   Badge,
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   ToggleButton,
// } from "react-bootstrap";
// import Select from "react-select";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { FaDownload, FaInfoCircle, FaFilter, FaToggleOn, FaToggleOff } from "react-icons/fa";
// import { GetCentersDataByExaminationAndExamTypes100 } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataS100, markL3AttendanceOfStudents } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// /* ---------------- IMAGE LOADER ---------------- */
// const loadImage = (url) =>
//   new Promise((resolve) => {
//     if (!url) return resolve(null);
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => resolve(img);
//     img.onerror = () => resolve(null);
//     img.src = url;
//   });

// /* ---------------- CACHE FOR IMAGES ---------------- */
// const imageCache = new Map();

// const getCachedImage = async (url) => {
//   if (!url || !url.startsWith("http")) return null;
  
//   if (imageCache.has(url)) {
//     return imageCache.get(url);
//   }
  
//   try {
//     const response = await fetch(url, { mode: "cors" });
//     const blob = await response.blob();
//     const reader = new FileReader();
    
//     return new Promise((resolve) => {
//       reader.onloadend = () => {
//         const base64data = reader.result;
//         imageCache.set(url, base64data);
//         resolve(base64data);
//       };
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error("Failed to load image:", url, error);
//     return null;
//   }
// };

// export const IDCardSuper100L2 = () => {
//   const [centers, setCenters] = useState([]);
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
  
//   // States for attendance marking
//   const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");
//   const [updatingAttendance, setUpdatingAttendance] = useState(false);
//   const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

//   // State for batch filter
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const batchOptions = [
//     { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01 - (19-April-2026 - 21-April-2026)" },
//     { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02 - (22-April-2026 - 24-April-2026)" },
//     { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03 - (25-April-2026 - 27-April-2026)" },
//   ];

//   // State for selection status filter
//   const [selectedSelectionStatus, setSelectedSelectionStatus] = useState(null);
//   const selectionStatusOptions = [
//     { value: "Selected", label: "Selected" },
//     { value: "Waitinglist", label: "Waitinglist" },
//   ];

//   // State for gender filter
//   const [selectedGender, setSelectedGender] = useState(null);
//   const genderOptions = [
//     { value: "MALE", label: "MALE" },
//     { value: "FEMALE", label: "FEMALE" },
//   ];

//   // State for ID card generation
//   const [generatingIDCards, setGeneratingIDCards] = useState(false);

//   const logo = "/haryana.png";
//   const logo2 = "/admitBuniyaLogo.png";
//   const logo3 = "/vikalpalogonotitle.png";

//   // Helper function to clean district name (remove everything after hyphen)
//   const cleanDistrictName = (districtName) => {
//     if (!districtName || districtName === "Unassigned") return districtName;
//     const hyphenIndex = districtName.indexOf('-');
//     if (hyphenIndex !== -1) {
//       return districtName.substring(0, hyphenIndex).trim();
//     }
//     return districtName;
//   };

//   // Helper function to get batch label for header
//   const getBatchLabel = () => {
//     if (selectedBatch) {
//       const batchMatch = selectedBatch.value.match(/Batch\s\d+/i);
//       return batchMatch ? batchMatch[0] : selectedBatch.value;
//     }
//     return null;
//   };

//   /* ---------------- FETCH CENTERS ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamTypes100();
//         const uniqueCentersMap = new Map();
//         (res.data || []).forEach(center => {
//           const key = center.examinationVenue;
//           if (!uniqueCentersMap.has(key)) {
//             uniqueCentersMap.set(key, center);
//           }
//         });
//         const uniqueCenters = Array.from(uniqueCentersMap.values());
//         setCenters(uniqueCenters || []);
//         console.log(uniqueCenters)
//       } catch {
//         setError("Failed to fetch centers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCenters();
//   }, []);

//   /* ---------------- GROUP STUDENTS BY DISTRICT ---------------- */
//   const groupStudentsByDistrict = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       const districtName = student.L2ExaminationDistrict || "Unassigned";
//       if (!grouped[districtName]) {
//         grouped[districtName] = [];
//       }
//       grouped[districtName].push(student);
//     });
    
//     // Sort students within each district
//     Object.keys(grouped).forEach(district => {
//       grouped[district].sort((a, b) => {
//         const fatherCompare = (a.father || "").localeCompare(b.father || "");
//         if (fatherCompare !== 0) return fatherCompare;
//         return (a.name || "").localeCompare(b.name || "");
//       });
//     });
    
//     // Sort district names alphabetically
//     const sortedGrouped = {};
//     Object.keys(grouped)
//       .sort((a, b) => {
//         if (a === "Unassigned") return 1;
//         if (b === "Unassigned") return -1;
//         return a.localeCompare(b);
//       })
//       .forEach(key => {
//         sortedGrouped[key] = grouped[key];
//       });
    
//     return sortedGrouped;
//   };

//   /* ---------------- FETCH ATTENDANCE ---------------- */
//   const fetchAttendanceData = async () => {
//     if (!selectedCenter) return setError("Please select a center");
//     setLoadingData(true);
//     setError(null);
//     try {
//       const payload = {
//         L2ExaminationCenter: selectedCenter.label,
//       };
//       if (selectedBatch) {
//         payload.batchDivisionForL2Examination = selectedBatch.value;
//       }
//       if (selectedSelectionStatus) {
//         payload.selectionStatusForL2 = selectedSelectionStatus.value;
//       }
//       if (selectedGender) {
//         payload.gender = selectedGender.value;
//       }
//       const res = await GetAttendanceSheetDataS100(payload);

//       const sortedData = (res.data || []).sort((a, b) => {
//         const fatherCompare = (a.father || "").localeCompare(b.father || "");
//         if (fatherCompare !== 0) return fatherCompare;
//         return (a.name || "").localeCompare(b.name || "");
//       });

//       setAttendanceData(sortedData);
//       const grouped = groupStudentsByDistrict(sortedData);
//       setGroupedAttendanceData(grouped);
//       setSelectedRoomFilter("all");
//       setAttendanceUpdateStatus({});
//       setShowPreview(true);
//     } catch {
//       setError("Failed to fetch attendance data");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   /* ---------------- HANDLE ATTENDANCE TOGGLE ---------------- */
//   const handleAttendanceToggle = async (studentId, currentStatus) => {
//     setUpdatingAttendance(true);
    
//     setAttendanceData(prevData => 
//       prevData.map(student => 
//         student._id === studentId 
//           ? { ...student, isPresentInL3Examination: !currentStatus }
//           : student
//       )
//     );
    
//     setGroupedAttendanceData(prevGrouped => {
//       const newGrouped = { ...prevGrouped };
//       Object.keys(newGrouped).forEach(district => {
//         newGrouped[district] = newGrouped[district].map(student =>
//           student._id === studentId
//             ? { ...student, isPresentInL3Examination: !currentStatus }
//             : student
//         );
//       });
//       return newGrouped;
//     });
    
//     setAttendanceUpdateStatus(prev => ({ 
//       ...prev, 
//       [studentId]: { loading: true, error: null } 
//     }));
    
//     try {
//       const response = await markL3AttendanceOfStudents({
//         _id: studentId,
//         isPresentInL3Examination: !currentStatus
//       });
      
//       if (response.status === 'OK') {
//         setAttendanceUpdateStatus(prev => ({ 
//           ...prev, 
//           [studentId]: { loading: false, success: true, error: null } 
//         }));
        
//         setTimeout(() => {
//           setAttendanceUpdateStatus(prev => {
//             const newStatus = { ...prev };
//             delete newStatus[studentId];
//             return newStatus;
//           });
//         }, 2000);
//       } else {
//         throw new Error(response.message || 'Update failed');
//       }
//     } catch (error) {
//       console.error("Failed to update attendance:", error);
      
//       setAttendanceData(prevData => 
//         prevData.map(student => 
//           student._id === studentId 
//             ? { ...student, isPresentInL3Examination: currentStatus }
//             : student
//         )
//       );
      
//       setGroupedAttendanceData(prevGrouped => {
//         const newGrouped = { ...prevGrouped };
//         Object.keys(newGrouped).forEach(district => {
//           newGrouped[district] = newGrouped[district].map(student =>
//             student._id === studentId
//               ? { ...student, isPresentInL3Examination: currentStatus }
//               : student
//           );
//         });
//         return newGrouped;
//       });
      
//       setAttendanceUpdateStatus(prev => ({ 
//         ...prev, 
//         [studentId]: { loading: false, success: false, error: error.message } 
//       }));
      
//       setTimeout(() => {
//         setAttendanceUpdateStatus(prev => {
//           const newStatus = { ...prev };
//           delete newStatus[studentId];
//           return newStatus;
//         });
//       }, 3000);
//     } finally {
//       setUpdatingAttendance(false);
//     }
//   };

//   /* ---------------- GET FILTERED DATA FOR DISPLAY ---------------- */
//   const getFilteredData = () => {
//     if (selectedRoomFilter === "all") {
//       return attendanceData;
//     }
//     return groupedAttendanceData[selectedRoomFilter] || [];
//   };

//   /* ---------------- GET UNIQUE DISTRICTS FOR FILTER ---------------- */
//   const getDistrictOptions = () => {
//     const districts = Object.keys(groupedAttendanceData);
//     return [
//       { value: "all", label: `📋 All Districts (${attendanceData.length} students)` },
//       ...districts.map(district => ({
//         value: district,
//         label: `🏢 ${district} (${groupedAttendanceData[district].length} students)`
//       }))
//     ];
//   };

//   const drawDocVerificationTable = async (pdf, students, startY = 45) => {
//     const imagePromises = students.map((student) =>
//       student.imageUrl ? getCachedImage(student.imageUrl) : Promise.resolve(null)
//     );
//     const imageData = await Promise.all(imagePromises);

//     const body = students.map((s, i) => [
//       i + 1,
//       s.srn || "",
//       s.name || "",
//       s.father || "",
//       s.L2ExaminationBlock || "",
//       s.school || "",
//       "",
//       "",
//       "",
//       "",
//       "",
//     ]);

//     pdf.autoTable({
//       startY,
//       head: [[
//         "S.No","SRN","Name","Father","Block","School",
//         "Photo","Doc","Room","Bed","Remark"
//       ]],
//       body,
//       theme: "grid",
//       margin: { top: 10, bottom: 15, left: 10, right: 10 },
//       styles: {
//         fontSize: 9,
//         cellPadding: 2,
//         overflow: "linebreak",
//         cellWidth: "wrap",
//       },
//       headStyles: {
//         fillColor: [41, 128, 185],
//         textColor: 255,
//         fontStyle: "bold",
//         minCellHeight: 15,
//         cellPadding: 2,
//       },
//       bodyStyles: {
//         minCellHeight: 25,
//       },
//       showHead: "everyPage",
//       columnStyles: {
//         0: { cellWidth: 12 },
//         1: { cellWidth: 25 },
//         2: { cellWidth: 30 },
//         3: { cellWidth: 30 },
//         4: { cellWidth: 25 },
//         5: { cellWidth: 35 },
//         6: { cellWidth: 20 },
//         7: { cellWidth: 15 },
//         8: { cellWidth: 15 },
//         9: { cellWidth: 15 },
//         10: { cellWidth: 55 },
//       },
//       didDrawPage: (data) => {
//         const pageCount = pdf.internal.getNumberOfPages();
//         pdf.setFontSize(10);
//         pdf.text(
//           `Page ${data.pageNumber} of ${pageCount}`,
//           data.settings.margin.left,
//           pdf.internal.pageSize.height - 10
//         );
//       },
//       didParseCell: (data) => {
//         if (data.section === "body" && data.column.index === 6) {
//           data.cell.imageData = imageData[data.row.index];
//         }
//       },
//       willDrawCell: (data) => {
//         if (data.section === "body" && data.column.index === 6) {
//           data.cell.text = "";
//         }
//       },
//       didDrawCell: (data) => {
//         if (data.section === "body" && data.column.index === 6 && data.cell.imageData) {
//           try {
//             const imgSize = Math.min(data.cell.width, data.cell.height) - 4;
//             pdf.addImage(
//               data.cell.imageData,
//               "JPEG",
//               data.cell.x + (data.cell.width - imgSize) / 2,
//               data.cell.y + (data.cell.height - imgSize) / 2,
//               imgSize,
//               imgSize
//             );
//           } catch {
//             pdf.text("No Image", data.cell.x + 5, data.cell.y + data.cell.height / 2);
//           }
//         }
//       }
//     });
//   };

//   const drawAttendanceTable = async (pdf, students, startY = 45) => {
//     const body = students.map((s, i) => [
//       i + 1,
//       s.srn || "",
//       s.name || "",
//       s.father || "",
//       s.L2ExaminationBlock || "",
//       s.school || "",
//       s.orientationRoomNumber || "",
//       "",
//       "",
//     ]);

//     pdf.autoTable({
//       startY,
//       head: [[
//         "S.No","SRN","Name","Father","Block","School",
//         "Room No","Bed No","Remark"
//       ]],
//       body,
//       theme: "grid",
//       margin: { top: 10, bottom: 15, left: 10, right: 10 },
//       styles: {
//         fontSize: 9,
//         cellPadding: 2,
//         overflow: "linebreak",
//         cellWidth: "wrap",
//       },
//       headStyles: {
//         fillColor: [41, 128, 185],
//         textColor: 255,
//         fontStyle: "bold",
//         minCellHeight: 15,
//         cellPadding: 2,
//       },
//       bodyStyles: {
//         minCellHeight: 25,
//       },
//       showHead: "everyPage",
//       columnStyles: {
//         0: { cellWidth: 12 },
//         1: { cellWidth: 25 },
//         2: { cellWidth: 30 },
//         3: { cellWidth: 30 },
//         4: { cellWidth: 25 },
//         5: { cellWidth: 35 },
//         6: { cellWidth: 20 },
//         7: { cellWidth: 20 },
//         8: { cellWidth: 65 },
//       },
//       didDrawPage: (data) => {
//         const pageCount = pdf.internal.getNumberOfPages();
//         pdf.setFontSize(10);
//         pdf.text(
//           `Page ${data.pageNumber} of ${pageCount}`,
//           data.settings.margin.left,
//           pdf.internal.pageSize.height - 10
//         );
//       }
//     });
//   };

//   /* ---------------- GENERATE ID CARDS ---------------- */
//   const generateIDCardsPDF = async () => {
//     if (!attendanceData.length) {
//       setError("No data available for ID cards");
//       return;
//     }

//     setGeneratingIDCards(true);
//     setError(null);
    
//     try {
//       const zip = new JSZip();
      
//       // Clear image cache for fresh images
//       imageCache.clear();

//       // Group students by district
//       const groupedByDistrict = {};
//       attendanceData.forEach(student => {
//         const district = student.L2ExaminationDistrict || "Unassigned";
//         if (!groupedByDistrict[district]) {
//           groupedByDistrict[district] = [];
//         }
//         groupedByDistrict[district].push(student);
//       });

//       // Generate PDF for each district
//       for (const [districtName, students] of Object.entries(groupedByDistrict)) {
//         const pdf = new jsPDF({
//           orientation: 'portrait',
//           unit: 'mm',
//           format: 'a4'
//         });
        
//         const cardsPerPage = 6; // 2 columns x 3 rows (better size for this layout)
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();
        
//         // Card dimensions
//         const cardWidth = 90; // mm
//         const cardHeight = 110; // mm (taller to accommodate left photo + right content)
//         const marginX = (pageWidth - (2 * cardWidth) - 10) / 2; // Centered with spacing
//         const marginY = 15;
//         const spacingX = 10;
//         const spacingY = 10;
        
//         let cardCount = 0;
//         let currentPage = 1;
        
//         for (let i = 0; i < students.length; i++) {
//           const student = students[i];
//           const positionInPage = cardCount % cardsPerPage;
//           const row = Math.floor(positionInPage / 2);
//           const col = positionInPage % 2;
          
//           const x = marginX + (col * (cardWidth + spacingX));
//           const y = marginY + (row * (cardHeight + spacingY));
          
//           // Draw card border (black)
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.5);
//           pdf.rect(x, y, cardWidth, cardHeight);
          
//           // ============ HEADER SECTION ============
//           const headerY = y + 8;
          
//           // Left Logo
//           if (logo) {
//             try {
//               const leftLogoX = x + 5;
//               const leftLogoY = y + 3;
//               pdf.addImage(logo, "PNG", leftLogoX, leftLogoY, 10, 10);
//             } catch (e) {
//               console.warn("Could not load left logo");
//             }
//           }
          
//           // Right Logo
//           if (logo3) {
//             try {
//               const rightLogoX = x + cardWidth - 15;
//               const rightLogoY = y + 3;
//               pdf.addImage(logo3, "PNG", rightLogoX, rightLogoY, 10, 10);
//             } catch (e) {
//               console.warn("Could not load right logo");
//             }
//           }
          
//           // Title
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(11);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("HARYANA SUPER 100", x + cardWidth/2, y + 8, { align: "center" });
          
//           pdf.setFontSize(7);
//           pdf.setFont("helvetica", "normal");
//           pdf.text("Village Bama, Dhand Road, Kurukshetra", x + cardWidth/2, y + 13, { align: "center" });
          
//           pdf.setFontSize(7);
//           pdf.text("Phone No: 7206758099", x + cardWidth/2, y + 18, { align: "center" });
          
//           pdf.setFontSize(8);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("Level 2 Batch (2025-27)", x + cardWidth/2, y + 23, { align: "center" });
          
//           // Divider line
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.3);
//           pdf.line(x + 3, y + 26, x + cardWidth - 3, y + 26);
          
//           // ============ PHOTO SECTION (Left) ============
//           const photoSize = 35;
//           const photoX = x + 5;
//           const photoY = y + 32;
          
//           // Photo border
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.3);
//           pdf.rect(photoX, photoY, photoSize, photoSize);
          
//           // Add photo if available
//           if (student.imageUrl) {
//             try {
//               const imageData = await getCachedImage(student.imageUrl);
//               if (imageData) {
//                 pdf.addImage(imageData, 'JPEG', photoX, photoY, photoSize, photoSize);
//               } else {
//                 pdf.setFontSize(6);
//                 pdf.setTextColor(150, 150, 150);
//                 pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//               }
//             } catch (err) {
//               console.warn("Could not load image:", err);
//               pdf.setFontSize(6);
//               pdf.setTextColor(150, 150, 150);
//               pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//             }
//           } else {
//             pdf.setFontSize(6);
//             pdf.setTextColor(150, 150, 150);
//             pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//           }
          
//           // ============ CONTENT SECTION (Right) ============
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(8);
          
//           const contentX = x + photoSize + 10;
//           let contentY = y + 35;
//           const lineHeight = 6.5;
          
//           // Helper function to add a detail line
//           const addDetail = (label, value) => {
//             if (value && value !== "—") {
//               pdf.setFont("helvetica", "bold");
//               pdf.text(`${label}:`, contentX, contentY);
//               pdf.setFont("helvetica", "normal");
              
//               const valueStr = value.toString();
//               const maxWidth = cardWidth - (contentX - x) - 5;
              
//               if (pdf.getStringUnitWidth(valueStr) * 8 / pdf.internal.scaleFactor > maxWidth) {
//                 let truncated = valueStr;
//                 while (pdf.getStringUnitWidth(truncated + "...") * 8 / pdf.internal.scaleFactor > maxWidth && truncated.length > 0) {
//                   truncated = truncated.slice(0, -1);
//                 }
//                 pdf.text(truncated + (truncated !== valueStr ? "..." : ""), contentX + 22, contentY);
//               } else {
//                 pdf.text(valueStr, contentX + 22, contentY);
//               }
//             } else {
//               pdf.setFont("helvetica", "bold");
//               pdf.text(`${label}:`, contentX, contentY);
//               pdf.setFont("helvetica", "normal");
//               pdf.text("—", contentX + 22, contentY);
//             }
//             contentY += lineHeight;
//           };
          
//           // Add all student details
//           addDetail("Name", student.name);
//           addDetail("Father Name", student.father);
          
//           const cleanDistrict = cleanDistrictName(student.L2ExaminationDistrict);
//           addDetail("District", cleanDistrict);
          
//           addDetail("Roll Number", student.srn);
          
//           const batchMatch = student.batchDivisionForL2Examination ? 
//             student.batchDivisionForL2Examination.match(/Batch\s\d+/i) : null;
//           const batchText = batchMatch ? batchMatch[0] : (student.batchDivisionForL2Examination || "—");
//           addDetail("Batch", batchText);
          
//           addDetail("Room No", student.orientationRoomNumber);
//           addDetail("Bed No", student.bedNumber);
//           addDetail("Contact", student.contactNumber);
          
//           // ============ KALPA TEXT AT BOTTOM ============
//           pdf.setFontSize(7);
//           pdf.setFont("helvetica", "italic");
//           pdf.setTextColor(100, 100, 100);
//           pdf.text("KALPA", x + cardWidth - 8, y + cardHeight - 4, { align: "right" });
          
//           // Reset text color
//           pdf.setTextColor(0, 0, 0);
          
//           cardCount++;
          
//           // Add new page if needed
//           if ((i + 1) < students.length && (cardCount % cardsPerPage === 0)) {
//             pdf.addPage();
//             currentPage++;
//           }
//         }
        
//         // Add cutting guidelines on pages
//         for (let page = 1; page <= currentPage; page++) {
//           pdf.setPage(page);
          
//           // Add cutting guidelines (dotted lines)
//           pdf.setDrawColor(180, 180, 180);
//           pdf.setLineWidth(0.2);
//           pdf.setLineDashPattern([2, 2], 0);
          
//           // Vertical cut lines between cards
//           const cutX = marginX + cardWidth + spacingX/2;
//           pdf.line(cutX, marginY, cutX, pageHeight - marginY);
          
//           // Horizontal cut lines between rows
//           for (let row = 1; row < 3; row++) {
//             const cutY = marginY + (row * (cardHeight + spacingY)) - spacingY/2;
//             pdf.line(marginX, cutY, pageWidth - marginX, cutY);
//           }
          
//           // Reset line dash
//           pdf.setLineDashPattern([], 0);
//         }
        
//         // Save PDF for this district
//         const cleanDistrict = cleanDistrictName(districtName).replace(/[^a-z0-9]/gi, '_');
//         const fileName = `IDCards_${cleanDistrict}.pdf`;
//         zip.file(fileName, pdf.output("blob"));
//       }
      
//       // Generate and download zip
//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
//       saveAs(zipBlob, `IDCards_${centerNameForFile}.zip`);
      
//       setError(null);
//     } catch (error) {
//       console.error("ID Card PDF generation failed:", error);
//       setError("ID Card PDF generation failed: " + error.message);
//     } finally {
//       setGeneratingIDCards(false);
//     }
//   };

//   /* ---------------- GENERATE DOC VERIFICATION PDFs ---------------- */
//   const generateDocVerificationPDFs = async () => {
//     if (!attendanceData.length) {
//       setError("No data available");
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const zip = new JSZip();
      
//       imageCache.clear();

//       for (const [districtName, students] of Object.entries(groupedAttendanceData)) {
//         const pdf = new jsPDF("l", "mm", "a4");
//         const w = pdf.internal.pageSize.getWidth();
//         const h = pdf.internal.pageSize.getHeight();

//         if (logo) {
//           try {
//             pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//           } catch (e) {
//             console.warn("Could not load main logo");
//           }
//         }

//         if (logo3) {
//           try {
//             pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
//           } catch (e) {
//             console.warn("Could not load secondary logo");
//           }
//         }

//         const cleanDistrict = cleanDistrictName(districtName);
//         const batchLabel = getBatchLabel();
        
//         pdf.setFontSize(16);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (2026-28)", w / 2, 18, { align: "center" });
        
//         pdf.setFontSize(16);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("Document Verification Sheet", w / 2, 26, { align: "center" });
        
//         pdf.setFontSize(11);
//         pdf.setFont("helvetica", "normal");
//         pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
        
//         const headerLine = batchLabel ? `District: ${cleanDistrict}, ${batchLabel}` : `District: ${cleanDistrict}`;
//         pdf.text(headerLine, w / 2, 32, { align: "center" });

//         await drawDocVerificationTable(pdf, students);

//         pdf.setFontSize(9);
//         pdf.text(
//           "Note: Please verify documents and mark accordingly",
//           10,
//           h - 5
//         );

//         const cleanDistrictForFile = cleanDistrictName(districtName).replace(/[^a-z0-9]/gi, '_');
//         const fileName = `DocVerification_${cleanDistrictForFile}.pdf`;
//         zip.file(fileName, pdf.output("blob"));
//       }

//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
//       saveAs(zipBlob, `DocVerification_${centerNameForFile}.zip`);
      
//       setError(null);
//     } catch (error) {
//       console.error("PDF generation failed:", error);
//       setError("PDF generation failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- GENERATE ATTENDANCE SHEET PDFs ---------------- */
//   const generateAttendancePDFs = async () => {
//     if (!attendanceData.length) {
//       setError("No data available");
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const zip = new JSZip();

//       for (const [districtName, students] of Object.entries(groupedAttendanceData)) {
//         const pdf = new jsPDF("l", "mm", "a4");
//         const w = pdf.internal.pageSize.getWidth();
//         const h = pdf.internal.pageSize.getHeight();

//         if (logo) {
//           try {
//             pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//           } catch (e) {
//             console.warn("Could not load main logo");
//           }
//         }

//         if (logo3) {
//           try {
//             pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
//           } catch (e) {
//             console.warn("Could not load secondary logo");
//           }
//         }

//         const cleanDistrict = cleanDistrictName(districtName);
//         const batchLabel = getBatchLabel();
        
//         pdf.setFontSize(16);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (2026-28)", w / 2, 18, { align: "center" });
        
//         pdf.setFontSize(16);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
        
//         pdf.setFontSize(11);
//         pdf.setFont("helvetica", "normal");
//         pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
        
//         const headerLine = batchLabel ? `District: ${cleanDistrict}, ${batchLabel}` : `District: ${cleanDistrict}`;
//         pdf.text(headerLine, w / 2, 32, { align: "center" });

//         await drawAttendanceTable(pdf, students);

//         pdf.setFontSize(9);
//         pdf.text(
//           "Note: Please mark attendance and fill room/bed details",
//           10,
//           h - 5
//         );

//         const cleanDistrictForFile = cleanDistrictName(districtName).replace(/[^a-z0-9]/gi, '_');
//         const fileName = `Attendance_${cleanDistrictForFile}.pdf`;
//         zip.file(fileName, pdf.output("blob"));
//       }

//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
//       saveAs(zipBlob, `AttendanceSheets_${centerNameForFile}.zip`);
      
//       setError(null);
//     } catch (error) {
//       console.error("PDF generation failed:", error);
//       setError("PDF generation failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- DOWNLOAD BLANK TEMPLATE ---------------- */
//   const downloadBlankAttendanceTemplate = async () => {
//     try {
//       const pdf = new jsPDF("l", "mm", "a4");
//       const w = pdf.internal.pageSize.getWidth();

//       if (logo) {
//         try {
//           pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//         } catch {}
//       }

//       if (logo3) {
//         try {
//           pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
//         } catch {}
//       }

//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text(
//         "HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (2026-28)",
//         w / 2,
//         18,
//         { align: "center" }
//       );

//       pdf.text("Document Verification Sheet (Blank Template)", w / 2, 26, { align: "center" });

//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(
//         "Center: ________________________________",
//         w / 2,
//         34,
//         { align: "center" }
//       );

//       const blankRows = Array.from({ length: 24 }).map(() => [
//         "", "", "", "", "", "", "", "", "", "", "",
//       ]);

//       pdf.autoTable({
//         startY: 45,
//         head: [[
//           "S.No",
//           "SRN",
//           "Name",
//           "Father",
//           "Block",
//           "School",
//           "Photo",
//           "Doc",
//           "Room",
//           "Bed",
//           "Remark",
//         ]],
//         body: blankRows,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 4,
//           minCellHeight: 25,
//         },
//         columnStyles: {
//           0: { cellWidth: 12 },
//           1: { cellWidth: 25 },
//           2: { cellWidth: 30 },
//           3: { cellWidth: 30 },
//           4: { cellWidth: 25 },
//           5: { cellWidth: 35 },
//           6: { cellWidth: 20 },
//           7: { cellWidth: 15 },
//           8: { cellWidth: 15 },
//           9: { cellWidth: 15 },
//           10: { cellWidth: 35 },
//         },
//       });

//       pdf.save("DocVerification_Blank_Template.pdf");
//     } catch (err) {
//       console.error("Blank template generation failed", err);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   const filteredData = getFilteredData();
//   const districtOptions = getDistrictOptions();

//   const centerOptions = centers.map(center => ({
//     value: center._id,
//     label: center.examinationVenue,
//     capacity: center.capacity || 0
//   }));

//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex align-items-center">
//           <FaFilter className="me-2" /> 
//           <h5 className="mb-0">HS 100 L-2 ATTENDANCE & DOC VERIFICATION SHEETS</h5>
//         </Card.Header>

//         <Card.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               <FaInfoCircle className="me-2" />
//               {error}
//             </Alert>
//           )}

//           <Row className="mb-4">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Examination Center</Form.Label>
//                 <Select
//                   placeholder="Select Examination Center"
//                   options={centerOptions}
//                   isClearable
//                   onChange={(center) => {
//                     setSelectedCenter(center);
//                     setShowPreview(false);
//                   }}
//                   value={selectedCenter}
//                 />
//                 {selectedCenter?.capacity && (
//                   <Form.Text className="text-muted">
//                     Capacity: {selectedCenter.capacity} students
//                   </Form.Text>
//                 )}
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Filter Row */}
//           <Row className="mb-4">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Batch</Form.Label>
//                 <Select
//                   placeholder="Select Batch"
//                   options={batchOptions}
//                   isClearable
//                   onChange={(batch) => {
//                     setSelectedBatch(batch);
//                     setShowPreview(false);
//                   }}
//                   value={selectedBatch}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Selection Status</Form.Label>
//                 <Select
//                   placeholder="Select Selection Status"
//                   options={selectionStatusOptions}
//                   isClearable
//                   onChange={(status) => {
//                     setSelectedSelectionStatus(status);
//                     setShowPreview(false);
//                   }}
//                   value={selectedSelectionStatus}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Gender</Form.Label>
//                 <Select
//                   placeholder="Select Gender"
//                   options={genderOptions}
//                   isClearable
//                   onChange={(gender) => {
//                     setSelectedGender(gender);
//                     setShowPreview(false);
//                   }}
//                   value={selectedGender}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <div className="text-center mb-4">
//             <Button 
//               onClick={fetchAttendanceData} 
//               disabled={loadingData || !selectedCenter}
//               variant="primary"
//               size="lg"
//               className="px-5"
//             >
//               {loadingData ? (
//                 <>
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Loading Data...
//                 </>
//               ) : (
//                 "Get Student Data"
//               )}
//             </Button>
//           </div>

//           {showPreview && attendanceData.length > 0 && (
//             <>
//               {/* District Filter and Controls */}
//               <Card className="mb-4">
//                 <Card.Header className="bg-light">
//                   <Row className="align-items-center">
//                     <Col md={5}>
//                       <h6 className="mb-0">
//                         📊 Student Data Overview
//                         <Badge bg="info" className="ms-2">
//                           🏢 {Object.keys(groupedAttendanceData).length} Districts
//                         </Badge>
//                         <Badge bg="success" className="ms-2">
//                           ✅ {attendanceData.filter(s => s.isPresentInL3Examination).length} Present
//                         </Badge>
//                         <Badge bg="secondary" className="ms-2">
//                           ❌ {attendanceData.filter(s => !s.isPresentInL3Examination).length} Absent
//                         </Badge>
//                       </h6>
//                     </Col>
//                     <Col md={7}>
//                       <Form.Group>
//                         <Form.Label className="mb-1">
//                           <FaFilter className="me-1" /> Filter by District
//                         </Form.Label>
//                         <Select
//                           options={districtOptions}
//                           value={districtOptions.find(opt => opt.value === selectedRoomFilter)}
//                           onChange={(option) => setSelectedRoomFilter(option?.value || "all")}
//                           placeholder="Select District"
//                           isClearable={false}
//                           styles={{
//                             menu: (provided) => ({ ...provided, zIndex: 9999 }),
//                             control: (provided) => ({ ...provided, backgroundColor: '#fff' })
//                           }}
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                 </Card.Header>
//                 <Card.Body>
//                   <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
//                     <Table bordered hover size="sm" className="mb-0">
//                       <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 5 }}>
//                         <tr>
//                           <th style={{ width: "50px", backgroundColor: "#0d6efd", color: "white" }}>S.No</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>District</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>SRN</th>
//                           <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Name</th>
//                           <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Father</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>Block</th>
//                           <th style={{ width: "200px", backgroundColor: "#0d6efd", color: "white" }}>School</th>
//                           <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>Room No</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredData.map((s, i) => (
//                           <tr key={s._id} className={s.isPresentInL3Examination ? "table-success" : ""}>
//                             <td className="text-center fw-bold">{i + 1}</td>
//                             <td className="text-center">
//                               <Badge bg="info" pill>
//                                 🏢 {cleanDistrictName(s.L2ExaminationDistrict) || "—"}
//                               </Badge>
//                             </td>
//                             <td className="text-center">{s.srn || "—"}</td>
//                             <td>{s.name || "—"}</td>
//                             <td>{s.father || "—"}</td>
//                             <td>{s.L2ExaminationBlock || "—"}</td>
//                             <td className="small">{s.school || "—"}</td>
//                             <td className="text-center">{s.orientationRoomNumber || "—"}</td>
//                             <td>
//                               <ToggleButton
//                                 type="checkbox"
//                                 variant={s.isPresentInL3Examination ? "success" : "outline-secondary"}
//                                 checked={s.isPresentInL3Examination}
//                                 value="1"
//                                 onClick={() => {
//                                   console.log('Toggle clicked for student:', s);
//                                   console.log('Student ID:', s._id);
//                                   handleAttendanceToggle(s._id, s.isPresentInL3Examination);
//                                 }}
//                                 disabled={updatingAttendance && attendanceUpdateStatus[s._id]?.loading}
//                                 style={{ width: "130px" }}
//                                 size="sm"
//                               >
//                                 {attendanceUpdateStatus[s._id]?.loading ? (
//                                   <Spinner animation="border" size="sm" />
//                                 ) : s.isPresentInL3Examination ? (
//                                   <>
//                                     <FaToggleOn className="me-1" /> Present
//                                   </>
//                                 ) : (
//                                   <>
//                                     <FaToggleOff className="me-1" /> Absent
//                                   </>
//                                 )}
//                               </ToggleButton>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
                  
//                   {filteredData.length === 0 && (
//                     <Alert variant="info" className="text-center mb-0 mt-3">
//                       <FaInfoCircle className="me-2" />
//                       No students found in selected district.
//                     </Alert>
//                   )}
//                 </Card.Body>
//               </Card>

//               <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
//                 <Button
//                   onClick={downloadBlankAttendanceTemplate}
//                   variant="outline-secondary"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   Download Blank Format
//                 </Button>

//                 <Button 
//                   onClick={generateDocVerificationPDFs} 
//                   disabled={loading || attendanceData.length === 0}
//                   variant="warning"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   {loading ? "Generating ZIP..." : "Download Doc Verification Sheets"}
//                 </Button>

//                 <Button 
//                   onClick={generateAttendancePDFs} 
//                   disabled={loading || attendanceData.length === 0}
//                   variant="success"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   {loading ? "Generating ZIP..." : "Download Attendance Sheets"}
//                 </Button>

//                 <Button 
//                   onClick={generateIDCardsPDF} 
//                   disabled={generatingIDCards || attendanceData.length === 0}
//                   variant="danger"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   {generatingIDCards ? "Generating ID Cards..." : "Download ID Cards"}
//                 </Button>
//               </div>
//             </>
//           )}

//           {showPreview && attendanceData.length === 0 && (
//             <Alert variant="warning" className="text-center">
//               <FaInfoCircle className="me-2" />
//               No data found for the selected center with applied filters.
//             </Alert>
//           )}
//         </Card.Body>
        
//         <Card.Footer className="text-muted small">
//           <div className="d-flex justify-content-between">
//             <span>Total Centers: {centers.length}</span>
//             <span>Document Verification, Attendance & ID Card Generator</span>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };\







// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Table,
//   Spinner,
//   Alert,
//   Badge,
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   ToggleButton,
// } from "react-bootstrap";
// import Select from "react-select";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { FaDownload, FaInfoCircle, FaFilter, FaToggleOn, FaToggleOff } from "react-icons/fa";
// import { GetCentersDataByExaminationAndExamTypes100 } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataS100, markL3AttendanceOfStudents } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// /* ---------------- CACHE FOR IMAGES ---------------- */
// const imageCache = new Map();

// const getCachedImage = async (url) => {
//   if (!url || !url.startsWith("http")) return null;
  
//   if (imageCache.has(url)) {
//     return imageCache.get(url);
//   }
  
//   try {
//     const response = await fetch(url, { mode: "cors" });
//     const blob = await response.blob();
//     const reader = new FileReader();
    
//     return new Promise((resolve) => {
//       reader.onloadend = () => {
//         const base64data = reader.result;
//         imageCache.set(url, base64data);
//         resolve(base64data);
//       };
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error("Failed to load image:", url, error);
//     return null;
//   }
// };

// export const IDCardSuper100L2 = () => {
//   const [centers, setCenters] = useState([]);
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [studentData, setStudentData] = useState([]);
//   const [groupedStudentData, setGroupedStudentData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
  
//   // States for attendance marking
//   const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("all");
//   const [updatingAttendance, setUpdatingAttendance] = useState(false);
//   const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

//   // State for batch filter
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const batchOptions = [
//     { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01 - (19-April-2026 - 21-April-2026)" },
//     { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02 - (22-April-2026 - 24-April-2026)" },
//     { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03 - (25-April-2026 - 27-April-2026)" },
//   ];

//   // State for selection status filter
//   const [selectedSelectionStatus, setSelectedSelectionStatus] = useState(null);
//   const selectionStatusOptions = [
//     { value: "Selected", label: "Selected" },
//     { value: "Waitinglist", label: "Waitinglist" },
//   ];

//   // State for gender filter
//   const [selectedGender, setSelectedGender] = useState(null);
//   const genderOptions = [
//     { value: "MALE", label: "MALE" },
//     { value: "FEMALE", label: "FEMALE" },
//   ];

//   // State for ID card generation
//   const [generatingIDCards, setGeneratingIDCards] = useState(false);

//   const logo = "/haryana.png";
//   const logo3 = "/vikalpalogonotitle.png";

//   // Helper function to clean district name
//   const cleanDistrictName = (districtName) => {
//     if (!districtName || districtName === "Unassigned") return districtName;
//     const hyphenIndex = districtName.indexOf('-');
//     if (hyphenIndex !== -1) {
//       return districtName.substring(0, hyphenIndex).trim();
//     }
//     return districtName;
//   };

//   /* ---------------- FETCH CENTERS ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamTypes100();
//         const uniqueCentersMap = new Map();
//         (res.data || []).forEach(center => {
//           const key = center.examinationVenue;
//           if (!uniqueCentersMap.has(key)) {
//             uniqueCentersMap.set(key, center);
//           }
//         });
//         const uniqueCenters = Array.from(uniqueCentersMap.values());
//         setCenters(uniqueCenters || []);
//       } catch {
//         setError("Failed to fetch centers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCenters();
//   }, []);

//   /* ---------------- GROUP STUDENTS BY DISTRICT ---------------- */
//   const groupStudentsByDistrict = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       const districtName = student.L2ExaminationDistrict || "Unassigned";
//       if (!grouped[districtName]) {
//         grouped[districtName] = [];
//       }
//       grouped[districtName].push(student);
//     });
    
//     // Sort students within each district
//     Object.keys(grouped).forEach(district => {
//       grouped[district].sort((a, b) => {
//         const fatherCompare = (a.father || "").localeCompare(b.father || "");
//         if (fatherCompare !== 0) return fatherCompare;
//         return (a.name || "").localeCompare(b.name || "");
//       });
//     });
    
//     // Sort district names alphabetically
//     const sortedGrouped = {};
//     Object.keys(grouped)
//       .sort((a, b) => {
//         if (a === "Unassigned") return 1;
//         if (b === "Unassigned") return -1;
//         return a.localeCompare(b);
//       })
//       .forEach(key => {
//         sortedGrouped[key] = grouped[key];
//       });
    
//     return sortedGrouped;
//   };

//   /* ---------------- FETCH STUDENT DATA ---------------- */
//   const fetchStudentData = async () => {
//     if (!selectedCenter) return setError("Please select a center");
//     setLoadingData(true);
//     setError(null);
//     try {
//       const payload = {
//         L2ExaminationCenter: selectedCenter.label,
//       };
//       if (selectedBatch) {
//         payload.batchDivisionForL2Examination = selectedBatch.value;
//       }
//       if (selectedSelectionStatus) {
//         payload.selectionStatusForL2 = selectedSelectionStatus.value;
//       }
//       if (selectedGender) {
//         payload.gender = selectedGender.value;
//       }
//       const res = await GetAttendanceSheetDataS100(payload);

//       const sortedData = (res.data || []).sort((a, b) => {
//         const fatherCompare = (a.father || "").localeCompare(b.father || "");
//         if (fatherCompare !== 0) return fatherCompare;
//         return (a.name || "").localeCompare(b.name || "");
//       });

//       setStudentData(sortedData);
//       const grouped = groupStudentsByDistrict(sortedData);
//       setGroupedStudentData(grouped);
//       setSelectedDistrictFilter("all");
//       setAttendanceUpdateStatus({});
//       setShowPreview(true);
//     } catch {
//       setError("Failed to fetch student data");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   /* ---------------- HANDLE ATTENDANCE TOGGLE ---------------- */
//   const handleAttendanceToggle = async (studentId, currentStatus) => {
//     setUpdatingAttendance(true);
    
//     setStudentData(prevData => 
//       prevData.map(student => 
//         student._id === studentId 
//           ? { ...student, isPresentInL3Examination: !currentStatus }
//           : student
//       )
//     );
    
//     setGroupedStudentData(prevGrouped => {
//       const newGrouped = { ...prevGrouped };
//       Object.keys(newGrouped).forEach(district => {
//         newGrouped[district] = newGrouped[district].map(student =>
//           student._id === studentId
//             ? { ...student, isPresentInL3Examination: !currentStatus }
//             : student
//         );
//       });
//       return newGrouped;
//     });
    
//     setAttendanceUpdateStatus(prev => ({ 
//       ...prev, 
//       [studentId]: { loading: true, error: null } 
//     }));
    
//     try {
//       const response = await markL3AttendanceOfStudents({
//         _id: studentId,
//         isPresentInL3Examination: !currentStatus
//       });
      
//       if (response.status === 'OK') {
//         setAttendanceUpdateStatus(prev => ({ 
//           ...prev, 
//           [studentId]: { loading: false, success: true, error: null } 
//         }));
        
//         setTimeout(() => {
//           setAttendanceUpdateStatus(prev => {
//             const newStatus = { ...prev };
//             delete newStatus[studentId];
//             return newStatus;
//           });
//         }, 2000);
//       } else {
//         throw new Error(response.message || 'Update failed');
//       }
//     } catch (error) {
//       console.error("Failed to update attendance:", error);
      
//       setStudentData(prevData => 
//         prevData.map(student => 
//           student._id === studentId 
//             ? { ...student, isPresentInL3Examination: currentStatus }
//             : student
//         )
//       );
      
//       setGroupedStudentData(prevGrouped => {
//         const newGrouped = { ...prevGrouped };
//         Object.keys(newGrouped).forEach(district => {
//           newGrouped[district] = newGrouped[district].map(student =>
//             student._id === studentId
//               ? { ...student, isPresentInL3Examination: currentStatus }
//               : student
//           );
//         });
//         return newGrouped;
//       });
      
//       setAttendanceUpdateStatus(prev => ({ 
//         ...prev, 
//         [studentId]: { loading: false, success: false, error: error.message } 
//       }));
      
//       setTimeout(() => {
//         setAttendanceUpdateStatus(prev => {
//           const newStatus = { ...prev };
//           delete newStatus[studentId];
//           return newStatus;
//         });
//       }, 3000);
//     } finally {
//       setUpdatingAttendance(false);
//     }
//   };

//   /* ---------------- GET FILTERED DATA FOR DISPLAY ---------------- */
//   const getFilteredData = () => {
//     if (selectedDistrictFilter === "all") {
//       return studentData;
//     }
//     return groupedStudentData[selectedDistrictFilter] || [];
//   };

//   /* ---------------- GET UNIQUE DISTRICTS FOR FILTER ---------------- */
//   const getDistrictOptions = () => {
//     const districts = Object.keys(groupedStudentData);
//     return [
//       { value: "all", label: `📋 All Districts (${studentData.length} students)` },
//       ...districts.map(district => ({
//         value: district,
//         label: `🏢 ${cleanDistrictName(district)} (${groupedStudentData[district].length} students)`
//       }))
//     ];
//   };

//   /* ---------------- GENERATE ID CARDS ---------------- */
//   const generateIDCardsPDF = async () => {
//     if (!studentData.length) {
//       setError("No data available for ID cards");
//       return;
//     }

//     setGeneratingIDCards(true);
//     setError(null);
    
//     try {
//       const zip = new JSZip();
      
//       // Clear image cache for fresh images
//       imageCache.clear();

//       // Group students by district
//       const groupedByDistrict = {};
//       studentData.forEach(student => {
//         const district = student.L2ExaminationDistrict || "Unassigned";
//         if (!groupedByDistrict[district]) {
//           groupedByDistrict[district] = [];
//         }
//         groupedByDistrict[district].push(student);
//       });

//       // Generate PDF for each district
//       for (const [districtName, students] of Object.entries(groupedByDistrict)) {
//         const pdf = new jsPDF({
//           orientation: 'portrait',
//           unit: 'mm',
//           format: 'a4'
//         });
        
//         const cardsPerPage = 8; // 2 columns x 4 rows
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();
        
//         // Card dimensions - wider than tall
//         const cardWidth = 95; // mm
//         const cardHeight = 65; // mm (shorter, wider)
//         const marginX = (pageWidth - (2 * cardWidth) - 10) / 2;
//         const marginY = 12;
//         const spacingX = 10;
//         const spacingY = 8;
        
//         let cardCount = 0;
//         let currentPage = 1;
        
//         for (let i = 0; i < students.length; i++) {
//           const student = students[i];
//           const positionInPage = cardCount % cardsPerPage;
//           const row = Math.floor(positionInPage / 2); // 2 cards per row, 4 rows
//           const col = positionInPage % 2;
          
//           const x = marginX + (col * (cardWidth + spacingX));
//           const y = marginY + (row * (cardHeight + spacingY));
          
//           // Draw card border (black)
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.3);
//           pdf.rect(x, y, cardWidth, cardHeight);
          
//           // ============ HEADER SECTION ============
//           // Left Logo
//           if (logo) {
//             try {
//               pdf.addImage(logo, "PNG", x + 3, y + 2, 8, 8);
//             } catch (e) {
//               console.warn("Could not load left logo");
//             }
//           }
          
//           // Right Logo
//           if (logo3) {
//             try {
//               pdf.addImage(logo3, "PNG", x + cardWidth - 11, y + 2, 8, 8);
//             } catch (e) {
//               console.warn("Could not load right logo");
//             }
//           }
          
//           // Title
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(8);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("HARYANA SUPER 100", x + cardWidth/2, y + 5.5, { align: "center" });
          
//           pdf.setFontSize(5.5);
//           pdf.setFont("helvetica", "normal");
//           pdf.text("Village Bama, Dhand Road, Kurukshetra", x + cardWidth/2, y + 9, { align: "center" });
          
//           pdf.setFontSize(5);
//           pdf.text("Phone No: 7206758099", x + cardWidth/2, y + 12.5, { align: "center" });
          
//           pdf.setFontSize(6);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("Level 2 Batch (2025-27)", x + cardWidth/2, y + 16, { align: "center" });
          
//           // Divider line
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.2);
//           pdf.line(x + 3, y + 18.5, x + cardWidth - 3, y + 18.5);
          
//           // ============ PHOTO SECTION (Left) ============
//           const photoSize = 28;
//           const photoX = x + 4;
//           const photoY = y + 21;
          
//           // Photo border
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.2);
//           pdf.rect(photoX, photoY, photoSize, photoSize);
          
//           // Add photo if available
//           if (student.imageUrl) {
//             try {
//               const imageData = await getCachedImage(student.imageUrl);
//               if (imageData) {
//                 pdf.addImage(imageData, 'JPEG', photoX, photoY, photoSize, photoSize);
//               } else {
//                 pdf.setFontSize(4);
//                 pdf.setTextColor(150, 150, 150);
//                 pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//               }
//             } catch (err) {
//               console.warn("Could not load image:", err);
//               pdf.setFontSize(4);
//               pdf.setTextColor(150, 150, 150);
//               pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//             }
//           } else {
//             pdf.setFontSize(4);
//             pdf.setTextColor(150, 150, 150);
//             pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//           }
          
//           // ============ CONTENT SECTION (Right) ============
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(6);
          
//           const contentX = x + photoSize + 8;
//           let contentY = y + 23;
//           const lineHeight = 5;
          
//           // Helper function to add a detail line
//           const addDetail = (label, value) => {
//             pdf.setFont("helvetica", "bold");
//             pdf.text(`${label}:`, contentX, contentY);
//             pdf.setFont("helvetica", "normal");
            
//             const valueStr = (value && value !== "—" && value !== "undefined") ? value.toString() : "—";
//             const maxWidth = cardWidth - (contentX - x) - 5;
            
//             if (pdf.getStringUnitWidth(valueStr) * 6 / pdf.internal.scaleFactor > maxWidth) {
//               let truncated = valueStr;
//               while (pdf.getStringUnitWidth(truncated + "...") * 6 / pdf.internal.scaleFactor > maxWidth && truncated.length > 0) {
//                 truncated = truncated.slice(0, -1);
//               }
//               pdf.text(truncated + (truncated !== valueStr ? "..." : ""), contentX + 18, contentY);
//             } else {
//               pdf.text(valueStr, contentX + 18, contentY);
//             }
//             contentY += lineHeight;
//           };
          
//           // Add all student details
//           addDetail("Name", student.name);
//           addDetail("Father", student.father);
          
//           const cleanDistrict = cleanDistrictName(student.L2ExaminationDistrict);
//           addDetail("District", cleanDistrict);
          
//           addDetail("Roll No", student.srn);
          
//           const batchMatch = student.batchDivisionForL2Examination ? 
//             student.batchDivisionForL2Examination.match(/Batch\s\d+/i) : null;
//           const batchText = batchMatch ? batchMatch[0] : (student.batchDivisionForL2Examination || "—");
//           addDetail("Batch", batchText);
          
//           addDetail("Room No", student.orientationRoomNumber);
//           addDetail("Bed No", student.bedNumber);
//           addDetail("Contact", student.contactNumber);
          
//           // ============ KALPA TEXT AT BOTTOM ============
//           pdf.setFontSize(5);
//           pdf.setFont("helvetica", "italic");
//           pdf.setTextColor(120, 120, 120);
//           pdf.text("KALPA", x + cardWidth - 6, y + cardHeight - 3, { align: "right" });
          
//           // Reset text color
//           pdf.setTextColor(0, 0, 0);
          
//           cardCount++;
          
//           // Add new page if needed
//           if ((i + 1) < students.length && (cardCount % cardsPerPage === 0)) {
//             pdf.addPage();
//             currentPage++;
//           }
//         }
        
//         // Add cutting guidelines on pages
//         for (let page = 1; page <= currentPage; page++) {
//           pdf.setPage(page);
          
//           // Add cutting guidelines (dotted lines)
//           pdf.setDrawColor(180, 180, 180);
//           pdf.setLineWidth(0.2);
//           pdf.setLineDashPattern([2, 2], 0);
          
//           // Vertical cut lines between cards
//           const cutX = marginX + cardWidth + spacingX/2;
//           pdf.line(cutX, marginY, cutX, pageHeight - marginY);
          
//           // Horizontal cut lines between rows
//           for (let row = 1; row < 4; row++) {
//             const cutY = marginY + (row * (cardHeight + spacingY)) - spacingY/2;
//             pdf.line(marginX, cutY, pageWidth - marginX, cutY);
//           }
          
//           // Reset line dash
//           pdf.setLineDashPattern([], 0);
//         }
        
//         // Save PDF for this district
//         const cleanDistrict = cleanDistrictName(districtName).replace(/[^a-z0-9]/gi, '_');
//         const fileName = `IDCards_${cleanDistrict}.pdf`;
//         zip.file(fileName, pdf.output("blob"));
//       }
      
//       // Generate and download zip
//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
//       saveAs(zipBlob, `IDCards_${centerNameForFile}.zip`);
      
//       setError(null);
//     } catch (error) {
//       console.error("ID Card PDF generation failed:", error);
//       setError("ID Card PDF generation failed: " + error.message);
//     } finally {
//       setGeneratingIDCards(false);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   const filteredData = getFilteredData();
//   const districtOptions = getDistrictOptions();

//   const centerOptions = centers.map(center => ({
//     value: center._id,
//     label: center.examinationVenue,
//     capacity: center.capacity || 0
//   }));

//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex align-items-center">
//           <FaFilter className="me-2" /> 
//           <h5 className="mb-0">HS 100 L-2 ID CARD GENERATOR</h5>
//         </Card.Header>

//         <Card.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               <FaInfoCircle className="me-2" />
//               {error}
//             </Alert>
//           )}

//           <Row className="mb-4">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Examination Center</Form.Label>
//                 <Select
//                   placeholder="Select Examination Center"
//                   options={centerOptions}
//                   isClearable
//                   onChange={(center) => {
//                     setSelectedCenter(center);
//                     setShowPreview(false);
//                   }}
//                   value={selectedCenter}
//                 />
//                 {selectedCenter?.capacity && (
//                   <Form.Text className="text-muted">
//                     Capacity: {selectedCenter.capacity} students
//                   </Form.Text>
//                 )}
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Filter Row */}
//           <Row className="mb-4">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Batch</Form.Label>
//                 <Select
//                   placeholder="Select Batch"
//                   options={batchOptions}
//                   isClearable
//                   onChange={(batch) => {
//                     setSelectedBatch(batch);
//                     setShowPreview(false);
//                   }}
//                   value={selectedBatch}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Selection Status</Form.Label>
//                 <Select
//                   placeholder="Select Selection Status"
//                   options={selectionStatusOptions}
//                   isClearable
//                   onChange={(status) => {
//                     setSelectedSelectionStatus(status);
//                     setShowPreview(false);
//                   }}
//                   value={selectedSelectionStatus}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Gender</Form.Label>
//                 <Select
//                   placeholder="Select Gender"
//                   options={genderOptions}
//                   isClearable
//                   onChange={(gender) => {
//                     setSelectedGender(gender);
//                     setShowPreview(false);
//                   }}
//                   value={selectedGender}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <div className="text-center mb-4">
//             <Button 
//               onClick={fetchStudentData} 
//               disabled={loadingData || !selectedCenter}
//               variant="primary"
//               size="lg"
//               className="px-5"
//             >
//               {loadingData ? (
//                 <>
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Loading Data...
//                 </>
//               ) : (
//                 "Get Student Data"
//               )}
//             </Button>
//           </div>

//           {showPreview && studentData.length > 0 && (
//             <>
//               {/* District Filter and Controls */}
//               <Card className="mb-4">
//                 <Card.Header className="bg-light">
//                   <Row className="align-items-center">
//                     <Col md={5}>
//                       <h6 className="mb-0">
//                         📊 Student Data Overview
//                         <Badge bg="info" className="ms-2">
//                           🏢 {Object.keys(groupedStudentData).length} Districts
//                         </Badge>
//                         <Badge bg="success" className="ms-2">
//                           ✅ {studentData.filter(s => s.isPresentInL3Examination).length} Present
//                         </Badge>
//                         <Badge bg="secondary" className="ms-2">
//                           ❌ {studentData.filter(s => !s.isPresentInL3Examination).length} Absent
//                         </Badge>
//                       </h6>
//                     </Col>
//                     <Col md={7}>
//                       <Form.Group>
//                         <Form.Label className="mb-1">
//                           <FaFilter className="me-1" /> Filter by District
//                         </Form.Label>
//                         <Select
//                           options={districtOptions}
//                           value={districtOptions.find(opt => opt.value === selectedDistrictFilter)}
//                           onChange={(option) => setSelectedDistrictFilter(option?.value || "all")}
//                           placeholder="Select District"
//                           isClearable={false}
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                 </Card.Header>
//                 <Card.Body>
//                   <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
//                     <Table bordered hover size="sm" className="mb-0">
//                       <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 5 }}>
//                         <tr>
//                           <th style={{ width: "50px", backgroundColor: "#0d6efd", color: "white" }}>S.No</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>District</th>
//                           <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>SRN</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Name</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Father</th>
//                           <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Batch</th>
//                           <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Room</th>
//                           <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Bed</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredData.map((s, i) => {
//                           const batchMatch = s.batchDivisionForL2Examination ? 
//                             s.batchDivisionForL2Examination.match(/Batch\s\d+/i) : null;
//                           const batchText = batchMatch ? batchMatch[0] : (s.batchDivisionForL2Examination || "—");
                          
//                           return (
//                             <tr key={s._id} className={s.isPresentInL3Examination ? "table-success" : ""}>
//                               <td className="text-center fw-bold">{i + 1}</td>
//                               <td className="text-center">
//                                 <Badge bg="info" pill>
//                                   🏢 {cleanDistrictName(s.L2ExaminationDistrict) || "—"}
//                                 </Badge>
//                               </td>
//                               <td className="text-center">{s.srn || "—"}</td>
//                               <td>{s.name || "—"}</td>
//                               <td>{s.father || "—"}</td>
//                               <td className="text-center">{batchText}</td>
//                               <td className="text-center">{s.orientationRoomNumber || "—"}</td>
//                               <td className="text-center">{s.bedNumber || "—"}</td>
//                               <td>
//                                 <ToggleButton
//                                   type="checkbox"
//                                   variant={s.isPresentInL3Examination ? "success" : "outline-secondary"}
//                                   checked={s.isPresentInL3Examination}
//                                   value="1"
//                                   onClick={() => handleAttendanceToggle(s._id, s.isPresentInL3Examination)}
//                                   disabled={updatingAttendance && attendanceUpdateStatus[s._id]?.loading}
//                                   style={{ width: "130px" }}
//                                   size="sm"
//                                 >
//                                   {attendanceUpdateStatus[s._id]?.loading ? (
//                                     <Spinner animation="border" size="sm" />
//                                   ) : s.isPresentInL3Examination ? (
//                                     <>
//                                       <FaToggleOn className="me-1" /> Present
//                                     </>
//                                   ) : (
//                                     <>
//                                       <FaToggleOff className="me-1" /> Absent
//                                     </>
//                                   )}
//                                 </ToggleButton>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </Table>
//                   </div>
                  
//                   {filteredData.length === 0 && (
//                     <Alert variant="info" className="text-center mb-0 mt-3">
//                       <FaInfoCircle className="me-2" />
//                       No students found in selected district.
//                     </Alert>
//                   )}
//                 </Card.Body>
//               </Card>

//               <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
//                 <Button 
//                   onClick={generateIDCardsPDF} 
//                   disabled={generatingIDCards || studentData.length === 0}
//                   variant="danger"
//                   size="lg"
//                   className="d-flex align-items-center px-5"
//                 >
//                   <FaDownload className="me-2" />
//                   {generatingIDCards ? "Generating ID Cards..." : "Download ID Cards (ZIP)"}
//                 </Button>
//               </div>

//               <Alert variant="info" className="mb-0">
//                 <FaInfoCircle className="me-2" />
//                 <strong>ID Card Features:</strong> Each page contains 8 ID cards (2 columns × 4 rows). 
//                 Cards have white background, black borders, student photo on left, and details on right. 
//                 Dotted cut lines are provided for easy separation. Cards are organized by district in separate PDF files.
//               </Alert>
//             </>
//           )}

//           {showPreview && studentData.length === 0 && (
//             <Alert variant="warning" className="text-center">
//               <FaInfoCircle className="me-2" />
//               No data found for the selected center with applied filters.
//             </Alert>
//           )}
//         </Card.Body>
        
//         <Card.Footer className="text-muted small">
//           <div className="d-flex justify-content-between">
//             <span>Total Centers: {centers.length}</span>
//             <span>ID Card Generator for HS 100 L-2 Students</span>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };



















// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Table,
//   Spinner,
//   Alert,
//   Badge,
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   ToggleButton,
// } from "react-bootstrap";
// import Select from "react-select";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { FaDownload, FaInfoCircle, FaFilter, FaToggleOn, FaToggleOff } from "react-icons/fa";
// import { GetCentersDataByExaminationAndExamTypes100 } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataS100, markL3AttendanceOfStudents } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// /* ---------------- CACHE FOR IMAGES ---------------- */
// const imageCache = new Map();

// const getCachedImage = async (url) => {
//   if (!url || !url.startsWith("http")) return null;
  
//   if (imageCache.has(url)) {
//     return imageCache.get(url);
//   }
  
//   try {
//     const response = await fetch(url, { mode: "cors" });
//     const blob = await response.blob();
//     const reader = new FileReader();
    
//     return new Promise((resolve) => {
//       reader.onloadend = () => {
//         const base64data = reader.result;
//         imageCache.set(url, base64data);
//         resolve(base64data);
//       };
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error("Failed to load image:", url, error);
//     return null;
//   }
// };

// export const IDCardSuper100L2 = () => {
//   const [centers, setCenters] = useState([]);
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [studentData, setStudentData] = useState([]);
//   const [groupedStudentData, setGroupedStudentData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
  
//   // States for attendance marking
//   const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("all");
//   const [updatingAttendance, setUpdatingAttendance] = useState(false);
//   const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

//   // State for batch filter
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const batchOptions = [
//     { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01 - (19-April-2026 - 21-April-2026)" },
//     { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02 - (22-April-2026 - 24-April-2026)" },
//     { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03 - (25-April-2026 - 27-April-2026)" },
//   ];

//   // State for selection status filter
//   const [selectedSelectionStatus, setSelectedSelectionStatus] = useState(null);
//   const selectionStatusOptions = [
//     { value: "Selected", label: "Selected" },
//     { value: "Waitinglist", label: "Waitinglist" },
//   ];

//   // State for gender filter
//   const [selectedGender, setSelectedGender] = useState(null);
//   const genderOptions = [
//     { value: "MALE", label: "MALE" },
//     { value: "FEMALE", label: "FEMALE" },
//   ];

//   // State for ID card generation
//   const [generatingIDCards, setGeneratingIDCards] = useState(false);

//   const logo = "/haryana.png";
//   const logo3 = "/vikalpalogonotitle.png";

//   // Helper function to clean district name
//   const cleanDistrictName = (districtName) => {
//     if (!districtName || districtName === "Unassigned") return districtName;
//     const hyphenIndex = districtName.indexOf('-');
//     if (hyphenIndex !== -1) {
//       return districtName.substring(0, hyphenIndex).trim();
//     }
//     return districtName;
//   };

//   /* ---------------- FETCH CENTERS ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamTypes100();
//         const uniqueCentersMap = new Map();
//         (res.data || []).forEach(center => {
//           const key = center.examinationVenue;
//           if (!uniqueCentersMap.has(key)) {
//             uniqueCentersMap.set(key, center);
//           }
//         });
//         const uniqueCenters = Array.from(uniqueCentersMap.values());
//         setCenters(uniqueCenters || []);
//       } catch {
//         setError("Failed to fetch centers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCenters();
//   }, []);

//   /* ---------------- GROUP STUDENTS BY DISTRICT ---------------- */
//   const groupStudentsByDistrict = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       const districtName = student.L2ExaminationDistrict || "Unassigned";
//       if (!grouped[districtName]) {
//         grouped[districtName] = [];
//       }
//       grouped[districtName].push(student);
//     });
    
//     // Sort students within each district by father name then student name
//     Object.keys(grouped).forEach(district => {
//       grouped[district].sort((a, b) => {
//         const fatherCompare = (a.father || "").localeCompare(b.father || "");
//         if (fatherCompare !== 0) return fatherCompare;
//         return (a.name || "").localeCompare(b.name || "");
//       });
//     });
    
//     // Sort district names alphabetically
//     const sortedGrouped = {};
//     Object.keys(grouped)
//       .sort((a, b) => {
//         if (a === "Unassigned") return 1;
//         if (b === "Unassigned") return -1;
//         return a.localeCompare(b);
//       })
//       .forEach(key => {
//         sortedGrouped[key] = grouped[key];
//       });
    
//     return sortedGrouped;
//   };

//   /* ---------------- FETCH STUDENT DATA ---------------- */
//   const fetchStudentData = async () => {
//     if (!selectedCenter) return setError("Please select a center");
//     setLoadingData(true);
//     setError(null);
//     try {
//       const payload = {
//         L2ExaminationCenter: selectedCenter.label,
//       };
//       if (selectedBatch) {
//         payload.batchDivisionForL2Examination = selectedBatch.value;
//       }
//       if (selectedSelectionStatus) {
//         payload.selectionStatusForL2 = selectedSelectionStatus.value;
//       }
//       if (selectedGender) {
//         payload.gender = selectedGender.value;
//       }
//       const res = await GetAttendanceSheetDataS100(payload);

//       // Sort by father name first, then student name
//       const sortedData = (res.data || []).sort((a, b) => {
//         const fatherCompare = (a.father || "").localeCompare(b.father || "");
//         if (fatherCompare !== 0) return fatherCompare;
//         return (a.name || "").localeCompare(b.name || "");
//       });

//       setStudentData(sortedData);
//       const grouped = groupStudentsByDistrict(sortedData);
//       setGroupedStudentData(grouped);
//       setSelectedDistrictFilter("all");
//       setAttendanceUpdateStatus({});
//       setShowPreview(true);
//     } catch {
//       setError("Failed to fetch student data");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   /* ---------------- HANDLE ATTENDANCE TOGGLE ---------------- */
//   const handleAttendanceToggle = async (studentId, currentStatus) => {
//     setUpdatingAttendance(true);
    
//     setStudentData(prevData => 
//       prevData.map(student => 
//         student._id === studentId 
//           ? { ...student, isPresentInL3Examination: !currentStatus }
//           : student
//       )
//     );
    
//     setGroupedStudentData(prevGrouped => {
//       const newGrouped = { ...prevGrouped };
//       Object.keys(newGrouped).forEach(district => {
//         newGrouped[district] = newGrouped[district].map(student =>
//           student._id === studentId
//             ? { ...student, isPresentInL3Examination: !currentStatus }
//             : student
//         );
//       });
//       return newGrouped;
//     });
    
//     setAttendanceUpdateStatus(prev => ({ 
//       ...prev, 
//       [studentId]: { loading: true, error: null } 
//     }));
    
//     try {
//       const response = await markL3AttendanceOfStudents({
//         _id: studentId,
//         isPresentInL3Examination: !currentStatus
//       });
      
//       if (response.status === 'OK') {
//         setAttendanceUpdateStatus(prev => ({ 
//           ...prev, 
//           [studentId]: { loading: false, success: true, error: null } 
//         }));
        
//         setTimeout(() => {
//           setAttendanceUpdateStatus(prev => {
//             const newStatus = { ...prev };
//             delete newStatus[studentId];
//             return newStatus;
//           });
//         }, 2000);
//       } else {
//         throw new Error(response.message || 'Update failed');
//       }
//     } catch (error) {
//       console.error("Failed to update attendance:", error);
      
//       setStudentData(prevData => 
//         prevData.map(student => 
//           student._id === studentId 
//             ? { ...student, isPresentInL3Examination: currentStatus }
//             : student
//         )
//       );
      
//       setGroupedStudentData(prevGrouped => {
//         const newGrouped = { ...prevGrouped };
//         Object.keys(newGrouped).forEach(district => {
//           newGrouped[district] = newGrouped[district].map(student =>
//             student._id === studentId
//               ? { ...student, isPresentInL3Examination: currentStatus }
//               : student
//           );
//         });
//         return newGrouped;
//       });
      
//       setAttendanceUpdateStatus(prev => ({ 
//         ...prev, 
//         [studentId]: { loading: false, success: false, error: error.message } 
//       }));
      
//       setTimeout(() => {
//         setAttendanceUpdateStatus(prev => {
//           const newStatus = { ...prev };
//           delete newStatus[studentId];
//           return newStatus;
//         });
//       }, 3000);
//     } finally {
//       setUpdatingAttendance(false);
//     }
//   };

//   /* ---------------- GET FILTERED DATA FOR DISPLAY ---------------- */
//   const getFilteredData = () => {
//     if (selectedDistrictFilter === "all") {
//       return studentData;
//     }
//     return groupedStudentData[selectedDistrictFilter] || [];
//   };

//   /* ---------------- GET UNIQUE DISTRICTS FOR FILTER ---------------- */
//   const getDistrictOptions = () => {
//     const districts = Object.keys(groupedStudentData);
//     return [
//       { value: "all", label: `📋 All Districts (${studentData.length} students)` },
//       ...districts.map(district => ({
//         value: district,
//         label: `🏢 ${cleanDistrictName(district)} (${groupedStudentData[district].length} students)`
//       }))
//     ];
//   };

//   /* ---------------- GENERATE ID CARDS ---------------- */
//   const generateIDCardsPDF = async () => {
//     if (!studentData.length) {
//       setError("No data available for ID cards");
//       return;
//     }

//     setGeneratingIDCards(true);
//     setError(null);
    
//     try {
//       const zip = new JSZip();
      
//       // Clear image cache for fresh images
//       imageCache.clear();

//       // Group students by district
//       const groupedByDistrict = {};
//       studentData.forEach(student => {
//         const district = student.L2ExaminationDistrict || "Unassigned";
//         if (!groupedByDistrict[district]) {
//           groupedByDistrict[district] = [];
//         }
//         groupedByDistrict[district].push(student);
//       });

//       // Generate PDF for each district
//       for (const [districtName, students] of Object.entries(groupedByDistrict)) {
//         const pdf = new jsPDF({
//           orientation: 'portrait',
//           unit: 'mm',
//           format: 'a4'
//         });
        
//         const cardsPerPage = 8; // 2 columns x 4 rows
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();
        
//         // Card dimensions - wider than tall
//         const cardWidth = 95; // mm
//         const cardHeight = 68; // mm (slightly taller to accommodate SRN below photo)
//         const marginX = (pageWidth - (2 * cardWidth) - 10) / 2;
//         const marginY = 12;
//         const spacingX = 10;
//         const spacingY = 8;
        
//         let cardCount = 0;
//         let currentPage = 1;
        
//         for (let i = 0; i < students.length; i++) {
//           const student = students[i];
//           const positionInPage = cardCount % cardsPerPage;
//           const row = Math.floor(positionInPage / 2); // 2 cards per row, 4 rows
//           const col = positionInPage % 2;
          
//           const x = marginX + (col * (cardWidth + spacingX));
//           const y = marginY + (row * (cardHeight + spacingY));
          
//           // Draw card border (black)
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.3);
//           pdf.rect(x, y, cardWidth, cardHeight);
          
//           // ============ HEADER SECTION ============
//           // Left Logo
//           if (logo) {
//             try {
//               pdf.addImage(logo, "PNG", x + 3, y + 2, 8, 8);
//             } catch (e) {
//               console.warn("Could not load left logo");
//             }
//           }
          
//           // Right Logo
//           if (logo3) {
//             try {
//               pdf.addImage(logo3, "PNG", x + cardWidth - 11, y + 2, 8, 8);
//             } catch (e) {
//               console.warn("Could not load right logo");
//             }
//           }
          
//           // Title
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(8);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("HARYANA SUPER 100", x + cardWidth/2, y + 5.5, { align: "center" });
          
//           pdf.setFontSize(5.5);
//           pdf.setFont("helvetica", "normal");
//           pdf.text("Village Bama, Dhand Road, Kurukshetra", x + cardWidth/2, y + 9, { align: "center" });
          
//           pdf.setFontSize(5);
//           pdf.text("Phone No: 7206758099", x + cardWidth/2, y + 12.5, { align: "center" });
          
//           pdf.setFontSize(6);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("Entrance Examination Batch-2026", x + cardWidth/2, y + 16, { align: "center" });
          
//           // Divider line
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.2);
//           pdf.line(x + 3, y + 18.5, x + cardWidth - 3, y + 18.5);
          
//           // ============ PHOTO SECTION (Left) ============
//           const photoSize = 28;
//           const photoX = x + 4;
//           const photoY = y + 21;
          
//           // Photo border
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.2);
//           pdf.rect(photoX, photoY, photoSize, photoSize);
          
//           // Add photo if available
//           if (student.imageUrl) {
//             try {
//               const imageData = await getCachedImage(student.imageUrl);
//               if (imageData) {
//                 pdf.addImage(imageData, 'JPEG', photoX, photoY, photoSize, photoSize);
//               } else {
//                 pdf.setFontSize(4);
//                 pdf.setTextColor(150, 150, 150);
//                 pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//               }
//             } catch (err) {
//               console.warn("Could not load image:", err);
//               pdf.setFontSize(4);
//               pdf.setTextColor(150, 150, 150);
//               pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//             }
//           } else {
//             pdf.setFontSize(4);
//             pdf.setTextColor(150, 150, 150);
//             pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//           }
          
//           // ============ SRN below photo ============
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(5);
//           pdf.setFont("helvetica", "bold");
//           const srnText = `SRN: ${student.srn || "—"}`;
//           pdf.text(srnText, photoX + photoSize/2, photoY + 3 + photoSize + 4, { align: "center" });
          
//           // ============ CONTENT SECTION (Right) ============
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(6);
          
//           const contentX = x + photoSize + 8;
//           let contentY = y + 23;
//           const lineHeight = 5;
          
//           // Helper function to add a detail line with underline
//           const addDetailWithUnderline = (label, value, drawUnderline = true, leaveEmpty = false) => {
//             // Draw the label
//             pdf.setFont("helvetica", "bold");
//             pdf.text(`${label}:`, contentX, contentY);
            
//             // Calculate value position
//             const labelWidth = pdf.getStringUnitWidth(`${label}:`) * 6 / pdf.internal.scaleFactor;
//             const valueX = contentX + labelWidth + 2;
            
//             // Draw the value
//             pdf.setFont("helvetica", "normal");
            
//             let displayValue = "";
//             if (leaveEmpty) {
//               displayValue = "";
//             } else {
//               const valueStr = (value && value !== "—" && value !== "undefined") ? value.toString() : "";
//               displayValue = valueStr;
//             }
            
//             const maxWidth = cardWidth - (valueX - x) - 5;
            
//             if (displayValue && pdf.getStringUnitWidth(displayValue) * 6 / pdf.internal.scaleFactor > maxWidth) {
//               let truncated = displayValue;
//               while (pdf.getStringUnitWidth(truncated + "...") * 6 / pdf.internal.scaleFactor > maxWidth && truncated.length > 0) {
//                 truncated = truncated.slice(0, -1);
//               }
//               displayValue = truncated + (truncated !== displayValue ? "..." : "");
//             }
            
//             if (displayValue) {
//               pdf.text(displayValue, valueX, contentY);
//             }
            
//             // Draw underline from after label to near card border
//             if (drawUnderline) {
//               const underlineStartX = valueX - 1;
//               const underlineEndX = x + cardWidth - 4;
//               pdf.setDrawColor(0, 0, 0);
//               pdf.setLineWidth(0.1);
//               pdf.line(underlineStartX, contentY + 0.5, underlineEndX, contentY + 0.5);
//             }
            
//             contentY += lineHeight;
//           };
          
//           // Add all student details with underline
//           addDetailWithUnderline("Name", student.name, true, false);
//           addDetailWithUnderline("Father", student.father, true, false);
          
//           const cleanDistrict = cleanDistrictName(student.L2ExaminationDistrict);
//           addDetailWithUnderline("District", cleanDistrict, true, false);
          
//           // Roll number is now below photo, so skip here
          
//           const batchMatch = student.batchDivisionForL2Examination ? 
//             student.batchDivisionForL2Examination.match(/Batch\s\d+/i) : null;
//           const batchText = batchMatch ? batchMatch[0] : (student.batchDivisionForL2Examination || "");
//           addDetailWithUnderline("Batch", batchText, true, false);
          
//           // Room No and Bed No - leave empty (no dash)
//           addDetailWithUnderline("Room No", "", true, true);
//           addDetailWithUnderline("Bed No", "", true, true);
          
//           // Contact field with underline
//           const contactNumber = student.mobile || student.contactNumber || student.phone || "";
//           addDetailWithUnderline("Contact", contactNumber, true, false);
          
//           // Reset text color
//           pdf.setTextColor(0, 0, 0);
          
//           cardCount++;
          
//           // Add new page if needed
//           if ((i + 1) < students.length && (cardCount % cardsPerPage === 0)) {
//             pdf.addPage();
//             currentPage++;
//           }
//         }
        
//         // Add cutting guidelines on pages
//         for (let page = 1; page <= currentPage; page++) {
//           pdf.setPage(page);
          
//           // Add cutting guidelines (dotted lines)
//           pdf.setDrawColor(180, 180, 180);
//           pdf.setLineWidth(0.2);
//           pdf.setLineDashPattern([2, 2], 0);
          
//           // Vertical cut lines between cards
//           const cutX = marginX + cardWidth + spacingX/2;
//           pdf.line(cutX, marginY, cutX, pageHeight - marginY);
          
//           // Horizontal cut lines between rows
//           for (let row = 1; row < 4; row++) {
//             const cutY = marginY + (row * (cardHeight + spacingY)) - spacingY/2;
//             pdf.line(marginX, cutY, pageWidth - marginX, cutY);
//           }
          
//           // Reset line dash
//           pdf.setLineDashPattern([], 0);
//         }
        
//         // Save PDF for this district
//         const cleanDistrict = cleanDistrictName(districtName).replace(/[^a-z0-9]/gi, '_');
//         const fileName = `IDCards_${cleanDistrict}.pdf`;
//         zip.file(fileName, pdf.output("blob"));
//       }
      
//       // Generate and download zip
//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
//       saveAs(zipBlob, `IDCards_${centerNameForFile}.zip`);
      
//       setError(null);
//     } catch (error) {
//       console.error("ID Card PDF generation failed:", error);
//       setError("ID Card PDF generation failed: " + error.message);
//     } finally {
//       setGeneratingIDCards(false);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   const filteredData = getFilteredData();
//   const districtOptions = getDistrictOptions();

//   const centerOptions = centers.map(center => ({
//     value: center._id,
//     label: center.examinationVenue,
//     capacity: center.capacity || 0
//   }));

//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex align-items-center">
//           <FaFilter className="me-2" /> 
//           <h5 className="mb-0">HS 100 L-2 ID CARD GENERATOR</h5>
//         </Card.Header>

//         <Card.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               <FaInfoCircle className="me-2" />
//               {error}
//             </Alert>
//           )}

//           <Row className="mb-4">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Examination Center</Form.Label>
//                 <Select
//                   placeholder="Select Examination Center"
//                   options={centerOptions}
//                   isClearable
//                   onChange={(center) => {
//                     setSelectedCenter(center);
//                     setShowPreview(false);
//                   }}
//                   value={selectedCenter}
//                 />
//                 {selectedCenter?.capacity && (
//                   <Form.Text className="text-muted">
//                     Capacity: {selectedCenter.capacity} students
//                   </Form.Text>
//                 )}
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Filter Row */}
//           <Row className="mb-4">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Batch</Form.Label>
//                 <Select
//                   placeholder="Select Batch"
//                   options={batchOptions}
//                   isClearable
//                   onChange={(batch) => {
//                     setSelectedBatch(batch);
//                     setShowPreview(false);
//                   }}
//                   value={selectedBatch}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Selection Status</Form.Label>
//                 <Select
//                   placeholder="Select Selection Status"
//                   options={selectionStatusOptions}
//                   isClearable
//                   onChange={(status) => {
//                     setSelectedSelectionStatus(status);
//                     setShowPreview(false);
//                   }}
//                   value={selectedSelectionStatus}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Gender</Form.Label>
//                 <Select
//                   placeholder="Select Gender"
//                   options={genderOptions}
//                   isClearable
//                   onChange={(gender) => {
//                     setSelectedGender(gender);
//                     setShowPreview(false);
//                   }}
//                   value={selectedGender}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <div className="text-center mb-4">
//             <Button 
//               onClick={fetchStudentData} 
//               disabled={loadingData || !selectedCenter}
//               variant="primary"
//               size="lg"
//               className="px-5"
//             >
//               {loadingData ? (
//                 <>
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Loading Data...
//                 </>
//               ) : (
//                 "Get Student Data"
//               )}
//             </Button>
//           </div>

//           {showPreview && studentData.length > 0 && (
//             <>
//               {/* District Filter and Controls */}
//               <Card className="mb-4">
//                 <Card.Header className="bg-light">
//                   <Row className="align-items-center">
//                     <Col md={5}>
//                       <h6 className="mb-0">
//                         📊 Student Data Overview
//                         <Badge bg="info" className="ms-2">
//                           🏢 {Object.keys(groupedStudentData).length} Districts
//                         </Badge>
//                         <Badge bg="success" className="ms-2">
//                           ✅ {studentData.filter(s => s.isPresentInL3Examination).length} Present
//                         </Badge>
//                         <Badge bg="secondary" className="ms-2">
//                           ❌ {studentData.filter(s => !s.isPresentInL3Examination).length} Absent
//                         </Badge>
//                       </h6>
//                     </Col>
//                     <Col md={7}>
//                       <Form.Group>
//                         <Form.Label className="mb-1">
//                           <FaFilter className="me-1" /> Filter by District
//                         </Form.Label>
//                         <Select
//                           options={districtOptions}
//                           value={districtOptions.find(opt => opt.value === selectedDistrictFilter)}
//                           onChange={(option) => setSelectedDistrictFilter(option?.value || "all")}
//                           placeholder="Select District"
//                           isClearable={false}
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                 </Card.Header>
//                 <Card.Body>
//                   <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
//                     <Table bordered hover size="sm" className="mb-0">
//                       <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 5 }}>
//                         <tr>
//                           <th style={{ width: "50px", backgroundColor: "#0d6efd", color: "white" }}>S.No</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>District</th>
//                           <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>SRN</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Name</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Father</th>
//                           <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Batch</th>
//                           <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Room</th>
//                           <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Bed</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredData.map((s, i) => {
//                           const batchMatch = s.batchDivisionForL2Examination ? 
//                             s.batchDivisionForL2Examination.match(/Batch\s\d+/i) : null;
//                           const batchText = batchMatch ? batchMatch[0] : (s.batchDivisionForL2Examination || "—");
                          
//                           return (
//                             <tr key={s._id} className={s.isPresentInL3Examination ? "table-success" : ""}>
//                               <td className="text-center fw-bold">{i + 1}</td>
//                               <td className="text-center">
//                                 <Badge bg="info" pill>
//                                   🏢 {cleanDistrictName(s.L2ExaminationDistrict) || "—"}
//                                 </Badge>
//                               </td>
//                               <td className="text-center">{s.srn || "—"}</td>
//                               <td>{s.name || "—"}</td>
//                               <td>{s.father || "—"}</td>
//                               <td className="text-center">{batchText}</td>
//                               <td className="text-center">{s.orientationRoomNumber || "—"}</td>
//                               <td className="text-center">{s.bedNumber || "—"}</td>
//                               <td>
//                                 <ToggleButton
//                                   type="checkbox"
//                                   variant={s.isPresentInL3Examination ? "success" : "outline-secondary"}
//                                   checked={s.isPresentInL3Examination}
//                                   value="1"
//                                   onClick={() => handleAttendanceToggle(s._id, s.isPresentInL3Examination)}
//                                   disabled={updatingAttendance && attendanceUpdateStatus[s._id]?.loading}
//                                   style={{ width: "130px" }}
//                                   size="sm"
//                                 >
//                                   {attendanceUpdateStatus[s._id]?.loading ? (
//                                     <Spinner animation="border" size="sm" />
//                                   ) : s.isPresentInL3Examination ? (
//                                     <>
//                                       <FaToggleOn className="me-1" /> Present
//                                     </>
//                                   ) : (
//                                     <>
//                                       <FaToggleOff className="me-1" /> Absent
//                                     </>
//                                   )}
//                                 </ToggleButton>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </Table>
//                   </div>
                  
//                   {filteredData.length === 0 && (
//                     <Alert variant="info" className="text-center mb-0 mt-3">
//                       <FaInfoCircle className="me-2" />
//                       No students found in selected district.
//                     </Alert>
//                   )}
//                 </Card.Body>
//               </Card>

//               <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
//                 <Button 
//                   onClick={generateIDCardsPDF} 
//                   disabled={generatingIDCards || studentData.length === 0}
//                   variant="danger"
//                   size="lg"
//                   className="d-flex align-items-center px-5"
//                 >
//                   <FaDownload className="me-2" />
//                   {generatingIDCards ? "Generating ID Cards..." : "Download ID Cards (ZIP)"}
//                 </Button>
//               </div>

//               <Alert variant="info" className="mb-0">
//                 <FaInfoCircle className="me-2" />
//                 <strong>ID Card Features:</strong> Each page contains 8 ID cards (2 columns × 4 rows). 
//                 Cards have white background, black borders, student photo on left, SRN below photo, and details on right with underlines. 
//                 Room No and Bed No are left blank for manual filling. Dotted cut lines are provided for easy separation.
//               </Alert>
//             </>
//           )}

//           {showPreview && studentData.length === 0 && (
//             <Alert variant="warning" className="text-center">
//               <FaInfoCircle className="me-2" />
//               No data found for the selected center with applied filters.
//             </Alert>
//           )}
//         </Card.Body>
        
//         <Card.Footer className="text-muted small">
//           <div className="d-flex justify-content-between">
//             <span>Total Centers: {centers.length}</span>
//             <span>ID Card Generator for HS 100 L-2 Students</span>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };

















// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Table,
//   Spinner,
//   Alert,
//   Badge,
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   ToggleButton,
// } from "react-bootstrap";
// import Select from "react-select";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { FaDownload, FaInfoCircle, FaFilter, FaToggleOn, FaToggleOff } from "react-icons/fa";
// import { GetCentersDataByExaminationAndExamTypes100 } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetDataS100, markL3AttendanceOfStudents } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// /* ---------------- CACHE FOR IMAGES ---------------- */
// const imageCache = new Map();

// const getCachedImage = async (url) => {
//   if (!url || !url.startsWith("http")) return null;
  
//   if (imageCache.has(url)) {
//     return imageCache.get(url);
//   }
  
//   try {
//     const response = await fetch(url, { mode: "cors" });
//     const blob = await response.blob();
//     const reader = new FileReader();
    
//     return new Promise((resolve) => {
//       reader.onloadend = () => {
//         const base64data = reader.result;
//         imageCache.set(url, base64data);
//         resolve(base64data);
//       };
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error("Failed to load image:", url, error);
//     return null;
//   }
// };

// export const IDCardSuper100L2 = () => {
//   const [centers, setCenters] = useState([]);
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [studentData, setStudentData] = useState([]);
//   const [groupedStudentData, setGroupedStudentData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
  
//   // States for attendance marking
//   const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("all");
//   const [updatingAttendance, setUpdatingAttendance] = useState(false);
//   const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

//   // State for batch filter
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const batchOptions = [
//     { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01 - (19-April-2026 - 21-April-2026)" },
//     { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02 - (22-April-2026 - 24-April-2026)" },
//     { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03 - (25-April-2026 - 27-April-2026)" },
//   ];

//   // State for selection status filter
//   const [selectedSelectionStatus, setSelectedSelectionStatus] = useState(null);
//   const selectionStatusOptions = [
//     { value: "Selected", label: "Selected" },
//     { value: "Waitinglist", label: "Waitinglist" },
//   ];

//   // State for gender filter
//   const [selectedGender, setSelectedGender] = useState(null);
//   const genderOptions = [
//     { value: "MALE", label: "MALE" },
//     { value: "FEMALE", label: "FEMALE" },
//   ];

//   // State for ID card generation
//   const [generatingIDCards, setGeneratingIDCards] = useState(false);

//   const logo = "/haryana.png";
//   const logo3 = "/vikalpalogonotitle.png";

//   // Helper function to clean district name
//   const cleanDistrictName = (districtName) => {
//     if (!districtName || districtName === "Unassigned") return districtName;
//     const hyphenIndex = districtName.indexOf('-');
//     if (hyphenIndex !== -1) {
//       return districtName.substring(0, hyphenIndex).trim();
//     }
//     return districtName;
//   };

//   /* ---------------- FETCH CENTERS ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamTypes100();
//         const uniqueCentersMap = new Map();
//         (res.data || []).forEach(center => {
//           const key = center.examinationVenue;
//           if (!uniqueCentersMap.has(key)) {
//             uniqueCentersMap.set(key, center);
//           }
//         });
//         const uniqueCenters = Array.from(uniqueCentersMap.values());
//         setCenters(uniqueCenters || []);
//       } catch {
//         setError("Failed to fetch centers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCenters();
//   }, []);

//   /* ---------------- GROUP STUDENTS BY DISTRICT ---------------- */
//   const groupStudentsByDistrict = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       const districtName = student.L2ExaminationDistrict || "Unassigned";
//       if (!grouped[districtName]) {
//         grouped[districtName] = [];
//       }
//       grouped[districtName].push(student);
//     });
    
//     // Sort students within each district by father name then student name
//     Object.keys(grouped).forEach(district => {
//       grouped[district].sort((a, b) => {
//         const fatherCompare = (a.father || "").localeCompare(b.father || "");
//         if (fatherCompare !== 0) return fatherCompare;
//         return (a.name || "").localeCompare(b.name || "");
//       });
//     });
    
//     // Sort district names alphabetically
//     const sortedGrouped = {};
//     Object.keys(grouped)
//       .sort((a, b) => {
//         if (a === "Unassigned") return 1;
//         if (b === "Unassigned") return -1;
//         return a.localeCompare(b);
//       })
//       .forEach(key => {
//         sortedGrouped[key] = grouped[key];
//       });
    
//     return sortedGrouped;
//   };

//   /* ---------------- FETCH STUDENT DATA ---------------- */
//   const fetchStudentData = async () => {
//     if (!selectedCenter) return setError("Please select a center");
//     setLoadingData(true);
//     setError(null);
//     try {
//       const payload = {
//         L2ExaminationCenter: selectedCenter.label,
//       };
//       if (selectedBatch) {
//         payload.batchDivisionForL2Examination = selectedBatch.value;
//       }
//       if (selectedSelectionStatus) {
//         payload.selectionStatusForL2 = selectedSelectionStatus.value;
//       }
//       if (selectedGender) {
//         payload.gender = selectedGender.value;
//       }
//       const res = await GetAttendanceSheetDataS100(payload);

//       // Sort by father name first, then student name
//       const sortedData = (res.data || []).sort((a, b) => {
//         const fatherCompare = (a.father || "").localeCompare(b.father || "");
//         if (fatherCompare !== 0) return fatherCompare;
//         return (a.name || "").localeCompare(b.name || "");
//       });

//       setStudentData(sortedData);
//       const grouped = groupStudentsByDistrict(sortedData);
//       setGroupedStudentData(grouped);
//       setSelectedDistrictFilter("all");
//       setAttendanceUpdateStatus({});
//       setShowPreview(true);
//     } catch {
//       setError("Failed to fetch student data");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   /* ---------------- HANDLE ATTENDANCE TOGGLE ---------------- */
//   const handleAttendanceToggle = async (studentId, currentStatus) => {
//     setUpdatingAttendance(true);
    
//     setStudentData(prevData => 
//       prevData.map(student => 
//         student._id === studentId 
//           ? { ...student, isPresentInL3Examination: !currentStatus }
//           : student
//       )
//     );
    
//     setGroupedStudentData(prevGrouped => {
//       const newGrouped = { ...prevGrouped };
//       Object.keys(newGrouped).forEach(district => {
//         newGrouped[district] = newGrouped[district].map(student =>
//           student._id === studentId
//             ? { ...student, isPresentInL3Examination: !currentStatus }
//             : student
//         );
//       });
//       return newGrouped;
//     });
    
//     setAttendanceUpdateStatus(prev => ({ 
//       ...prev, 
//       [studentId]: { loading: true, error: null } 
//     }));
    
//     try {
//       const response = await markL3AttendanceOfStudents({
//         _id: studentId,
//         isPresentInL3Examination: !currentStatus
//       });
      
//       if (response.status === 'OK') {
//         setAttendanceUpdateStatus(prev => ({ 
//           ...prev, 
//           [studentId]: { loading: false, success: true, error: null } 
//         }));
        
//         setTimeout(() => {
//           setAttendanceUpdateStatus(prev => {
//             const newStatus = { ...prev };
//             delete newStatus[studentId];
//             return newStatus;
//           });
//         }, 2000);
//       } else {
//         throw new Error(response.message || 'Update failed');
//       }
//     } catch (error) {
//       console.error("Failed to update attendance:", error);
      
//       setStudentData(prevData => 
//         prevData.map(student => 
//           student._id === studentId 
//             ? { ...student, isPresentInL3Examination: currentStatus }
//             : student
//         )
//       );
      
//       setGroupedStudentData(prevGrouped => {
//         const newGrouped = { ...prevGrouped };
//         Object.keys(newGrouped).forEach(district => {
//           newGrouped[district] = newGrouped[district].map(student =>
//             student._id === studentId
//               ? { ...student, isPresentInL3Examination: currentStatus }
//               : student
//           );
//         });
//         return newGrouped;
//       });
      
//       setAttendanceUpdateStatus(prev => ({ 
//         ...prev, 
//         [studentId]: { loading: false, success: false, error: error.message } 
//       }));
      
//       setTimeout(() => {
//         setAttendanceUpdateStatus(prev => {
//           const newStatus = { ...prev };
//           delete newStatus[studentId];
//           return newStatus;
//         });
//       }, 3000);
//     } finally {
//       setUpdatingAttendance(false);
//     }
//   };

//   /* ---------------- GET FILTERED DATA FOR DISPLAY ---------------- */
//   const getFilteredData = () => {
//     if (selectedDistrictFilter === "all") {
//       return studentData;
//     }
//     return groupedStudentData[selectedDistrictFilter] || [];
//   };

//   /* ---------------- GET UNIQUE DISTRICTS FOR FILTER ---------------- */
//   const getDistrictOptions = () => {
//     const districts = Object.keys(groupedStudentData);
//     return [
//       { value: "all", label: `📋 All Districts (${studentData.length} students)` },
//       ...districts.map(district => ({
//         value: district,
//         label: `🏢 ${cleanDistrictName(district)} (${groupedStudentData[district].length} students)`
//       }))
//     ];
//   };

//   /* ---------------- GENERATE ID CARDS ---------------- */
//   const generateIDCardsPDF = async () => {
//     if (!studentData.length) {
//       setError("No data available for ID cards");
//       return;
//     }

//     setGeneratingIDCards(true);
//     setError(null);
    
//     try {
//       const zip = new JSZip();
      
//       // Clear image cache for fresh images
//       imageCache.clear();

//       // Group students by district
//       const groupedByDistrict = {};
//       studentData.forEach(student => {
//         const district = student.L2ExaminationDistrict || "Unassigned";
//         if (!groupedByDistrict[district]) {
//           groupedByDistrict[district] = [];
//         }
//         groupedByDistrict[district].push(student);
//       });

//       // Generate PDF for each district
//       for (const [districtName, students] of Object.entries(groupedByDistrict)) {
//         const pdf = new jsPDF({
//           orientation: 'portrait',
//           unit: 'mm',
//           format: 'a4'
//         });
        
//         const cardsPerPage = 8; // 2 columns x 4 rows
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();
        
//         // Reduced card dimensions to ensure all borders fit
//         const cardWidth = 90; // mm (reduced from 95)
//         const cardHeight = 62; // mm (reduced from 68)
//         const marginX = (pageWidth - (2 * cardWidth) - 10) / 2;
//         const marginY = 10;
//         const spacingX = 10;
//         const spacingY = 8;
        
//         let cardCount = 0;
//         let currentPage = 1;
        
//         for (let i = 0; i < students.length; i++) {
//           const student = students[i];
//           const positionInPage = cardCount % cardsPerPage;
//           const row = Math.floor(positionInPage / 2); // 2 cards per row, 4 rows
//           const col = positionInPage % 2;
          
//           const x = marginX + (col * (cardWidth + spacingX));
//           const y = marginY + (row * (cardHeight + spacingY));
          
//           // Draw card border (black)
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.3);
//           pdf.rect(x, y, cardWidth, cardHeight);
          
//           // ============ HEADER SECTION ============
//           // Left Logo
//           if (logo) {
//             try {
//               pdf.addImage(logo, "PNG", x + 3, y + 2, 7, 7);
//             } catch (e) {
//               console.warn("Could not load left logo");
//             }
//           }
          
//           // Right Logo
//           if (logo3) {
//             try {
//               pdf.addImage(logo3, "PNG", x + cardWidth - 10, y + 2, 10, 7);
//             } catch (e) {
//               console.warn("Could not load right logo");
//             }
//           }
          
//           // Title
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(7.5);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("HARYANA SUPER 100", x + cardWidth/2, y + 5, { align: "center" });
          
//           pdf.setFontSize(5);
//           pdf.setFont("helvetica", "normal");
//           pdf.text("Barna, Dhand Road, Kurukshetra, 7206758099", x + cardWidth/2, y + 8, { align: "center" });
          
//         //   pdf.setFontSize(4.5);
//         //   pdf.text("Phone No: 7206758099", x + cardWidth/2, y + 11.5, { align: "center" });
          
//           pdf.setFontSize(4.5);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("Entrance Examination 2026", x + cardWidth/2, y + 11.5, { align: "center" });
          
//           // Divider line
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.2);
//           pdf.line(x + 3, y + 15.5, x + cardWidth - 3, y + 15.5);
          
//           // ============ PHOTO SECTION (Left) ============
//           const photoSize = 25;
//           const photoX = x + 4;
//           const photoY = y + 20;
          
//           // Photo border
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.2);
//           pdf.rect(photoX, photoY, photoSize, photoSize);
          
//           // Add photo if available
//           if (student.imageUrl) {
//             try {
//               const imageData = await getCachedImage(student.imageUrl);
//               if (imageData) {
//                 pdf.addImage(imageData, 'JPEG', photoX, photoY, photoSize, photoSize);
//               } else {
//                 pdf.setFontSize(3.5);
//                 pdf.setTextColor(150, 150, 150);
//                 pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//               }
//             } catch (err) {
//               console.warn("Could not load image:", err);
//               pdf.setFontSize(3.5);
//               pdf.setTextColor(150, 150, 150);
//               pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//             }
//           } else {
//             pdf.setFontSize(3.5);
//             pdf.setTextColor(150, 150, 150);
//             pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//           }
          
//           // ============ CONTENT SECTION (Right) - SRN at top then details ============
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(5.5);
          
//           // Increased spacing between photo and text
//           const contentX = x + photoSize + 10;
//           let contentY = y + 20;
//           const lineHeight = 4.5;
          
//           // First, show SRN at the top of content area (above Name)
//           pdf.setFont("helvetica", "bold");
//           pdf.text("SRN:", contentX, contentY);
//           pdf.setFont("helvetica", "normal");
//           const srnValue = student.srn || "—";
//           pdf.text(srnValue, contentX + 10, contentY);
//           // Underline for SRN
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.1);
//           pdf.line(contentX + 9, contentY + 0.5, x + cardWidth - 4, contentY + 0.5);
//           contentY += lineHeight;
          
//           // Helper function to add a detail line with underline
//           const addDetailWithUnderline = (label, value, drawUnderline = true, leaveEmpty = false) => {
//             // Draw the label
//             pdf.setFont("helvetica", "bold");
//             pdf.text(`${label}:`, contentX, contentY);
            
//             // Calculate value position
//             const labelWidth = pdf.getStringUnitWidth(`${label}:`) * 5.5 / pdf.internal.scaleFactor;
//             const valueX = contentX + labelWidth + 2;
            
//             // Draw the value
//             pdf.setFont("helvetica", "normal");
            
//             let displayValue = "";
//             if (leaveEmpty) {
//               displayValue = "";
//             } else {
//               const valueStr = (value && value !== "—" && value !== "undefined") ? value.toString() : "";
//               displayValue = valueStr;
//             }
            
//             const maxWidth = cardWidth - (valueX - x) - 5;
            
//             if (displayValue && pdf.getStringUnitWidth(displayValue) * 5.5 / pdf.internal.scaleFactor > maxWidth) {
//               let truncated = displayValue;
//               while (pdf.getStringUnitWidth(truncated + "...") * 5.5 / pdf.internal.scaleFactor > maxWidth && truncated.length > 0) {
//                 truncated = truncated.slice(0, -1);
//               }
//               displayValue = truncated + (truncated !== displayValue ? "..." : "");
//             }
            
//             if (displayValue) {
//               pdf.text(displayValue, valueX, contentY);
//             }
            
//             // Draw underline from after label to near card border
//             if (drawUnderline) {
//               const underlineStartX = valueX - 1;
//               const underlineEndX = x + cardWidth - 4;
//               pdf.setDrawColor(0, 0, 0);
//               pdf.setLineWidth(0.1);
//               pdf.line(underlineStartX, contentY + 0.5, underlineEndX, contentY + 0.5);
//             }
            
//             contentY += lineHeight;
//           };
          
//           // Add all student details with underline
//           addDetailWithUnderline("Name", student.name, true, false);
//           addDetailWithUnderline("Father", student.father, true, false);
          
//           const cleanDistrict = cleanDistrictName(student.L2ExaminationDistrict);
//           addDetailWithUnderline("District", cleanDistrict, true, false);
          
//           const batchMatch = student.batchDivisionForL2Examination ? 
//             student.batchDivisionForL2Examination.match(/Batch\s\d+/i) : null;
//           const batchText = batchMatch ? batchMatch[0] : (student.batchDivisionForL2Examination || "");
//           addDetailWithUnderline("Batch", batchText, true, false);
          
//           // Room No and Bed No - leave empty (no dash)
//           addDetailWithUnderline("Room No", "", true, true);
//           addDetailWithUnderline("Bed No", "", true, true);
          
//           // Contact field with underline
//           const contactNumber = student.mobile || student.contactNumber || student.phone || "";
//           addDetailWithUnderline("Contact", contactNumber, true, false);
          
//           // Reset text color
//           pdf.setTextColor(0, 0, 0);
          
//           cardCount++;
          
//           // Add new page if needed
//           if ((i + 1) < students.length && (cardCount % cardsPerPage === 0)) {
//             pdf.addPage();
//             currentPage++;
//           }
//         }
        
//         // Add cutting guidelines on pages
//         for (let page = 1; page <= currentPage; page++) {
//           pdf.setPage(page);
          
//           // Add cutting guidelines (dotted lines)
//           pdf.setDrawColor(180, 180, 180);
//           pdf.setLineWidth(0.2);
//           pdf.setLineDashPattern([2, 2], 0);
          
//           // Vertical cut lines between cards
//           const cutX = marginX + cardWidth + spacingX/2;
//           pdf.line(cutX, marginY, cutX, pageHeight - marginY);
          
//           // Horizontal cut lines between rows
//           for (let row = 1; row < 4; row++) {
//             const cutY = marginY + (row * (cardHeight + spacingY)) - spacingY/2;
//             pdf.line(marginX, cutY, pageWidth - marginX, cutY);
//           }
          
//           // Reset line dash
//           pdf.setLineDashPattern([], 0);
//         }
        
//         // Save PDF for this district
//         const cleanDistrict = cleanDistrictName(districtName).replace(/[^a-z0-9]/gi, '_');
//         const fileName = `IDCards_${cleanDistrict}.pdf`;
//         zip.file(fileName, pdf.output("blob"));
//       }
      
//       // Generate and download zip
//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
//       saveAs(zipBlob, `IDCards_${centerNameForFile}.zip`);
      
//       setError(null);
//     } catch (error) {
//       console.error("ID Card PDF generation failed:", error);
//       setError("ID Card PDF generation failed: " + error.message);
//     } finally {
//       setGeneratingIDCards(false);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   const filteredData = getFilteredData();
//   const districtOptions = getDistrictOptions();

//   const centerOptions = centers.map(center => ({
//     value: center._id,
//     label: center.examinationVenue,
//     capacity: center.capacity || 0
//   }));

//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex align-items-center">
//           <FaFilter className="me-2" /> 
//           <h5 className="mb-0">HS 100 L-2 ID CARD GENERATOR</h5>
//         </Card.Header>

//         <Card.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               <FaInfoCircle className="me-2" />
//               {error}
//             </Alert>
//           )}

//           <Row className="mb-4">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Examination Center</Form.Label>
//                 <Select
//                   placeholder="Select Examination Center"
//                   options={centerOptions}
//                   isClearable
//                   onChange={(center) => {
//                     setSelectedCenter(center);
//                     setShowPreview(false);
//                   }}
//                   value={selectedCenter}
//                 />
//                 {selectedCenter?.capacity && (
//                   <Form.Text className="text-muted">
//                     Capacity: {selectedCenter.capacity} students
//                   </Form.Text>
//                 )}
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Filter Row */}
//           <Row className="mb-4">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Batch</Form.Label>
//                 <Select
//                   placeholder="Select Batch"
//                   options={batchOptions}
//                   isClearable
//                   onChange={(batch) => {
//                     setSelectedBatch(batch);
//                     setShowPreview(false);
//                   }}
//                   value={selectedBatch}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Selection Status</Form.Label>
//                 <Select
//                   placeholder="Select Selection Status"
//                   options={selectionStatusOptions}
//                   isClearable
//                   onChange={(status) => {
//                     setSelectedSelectionStatus(status);
//                     setShowPreview(false);
//                   }}
//                   value={selectedSelectionStatus}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Gender</Form.Label>
//                 <Select
//                   placeholder="Select Gender"
//                   options={genderOptions}
//                   isClearable
//                   onChange={(gender) => {
//                     setSelectedGender(gender);
//                     setShowPreview(false);
//                   }}
//                   value={selectedGender}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <div className="text-center mb-4">
//             <Button 
//               onClick={fetchStudentData} 
//               disabled={loadingData || !selectedCenter}
//               variant="primary"
//               size="lg"
//               className="px-5"
//             >
//               {loadingData ? (
//                 <>
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Loading Data...
//                 </>
//               ) : (
//                 "Get Student Data"
//               )}
//             </Button>
//           </div>

//           {showPreview && studentData.length > 0 && (
//             <>
//               {/* District Filter and Controls */}
//               <Card className="mb-4">
//                 <Card.Header className="bg-light">
//                   <Row className="align-items-center">
//                     <Col md={5}>
//                       <h6 className="mb-0">
//                         📊 Student Data Overview
//                         <Badge bg="info" className="ms-2">
//                           🏢 {Object.keys(groupedStudentData).length} Districts
//                         </Badge>
//                         <Badge bg="success" className="ms-2">
//                           ✅ {studentData.filter(s => s.isPresentInL3Examination).length} Present
//                         </Badge>
//                         <Badge bg="secondary" className="ms-2">
//                           ❌ {studentData.filter(s => !s.isPresentInL3Examination).length} Absent
//                         </Badge>
//                       </h6>
//                     </Col>
//                     <Col md={7}>
//                       <Form.Group>
//                         <Form.Label className="mb-1">
//                           <FaFilter className="me-1" /> Filter by District
//                         </Form.Label>
//                         <Select
//                           options={districtOptions}
//                           value={districtOptions.find(opt => opt.value === selectedDistrictFilter)}
//                           onChange={(option) => setSelectedDistrictFilter(option?.value || "all")}
//                           placeholder="Select District"
//                           isClearable={false}
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                 </Card.Header>
//                 <Card.Body>
//                   <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
//                     <Table bordered hover size="sm" className="mb-0">
//                       <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 5 }}>
//                         <tr>
//                           <th style={{ width: "50px", backgroundColor: "#0d6efd", color: "white" }}>S.No</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>District</th>
//                           <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>SRN</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Name</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Father</th>
//                           <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Batch</th>
//                           <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Room</th>
//                           <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Bed</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredData.map((s, i) => {
//                           const batchMatch = s.batchDivisionForL2Examination ? 
//                             s.batchDivisionForL2Examination.match(/Batch\s\d+/i) : null;
//                           const batchText = batchMatch ? batchMatch[0] : (s.batchDivisionForL2Examination || "—");
                          
//                           return (
//                             <tr key={s._id} className={s.isPresentInL3Examination ? "table-success" : ""}>
//                               <td className="text-center fw-bold">{i + 1}</td>
//                               <td className="text-center">
//                                 <Badge bg="info" pill>
//                                   🏢 {cleanDistrictName(s.L2ExaminationDistrict) || "—"}
//                                 </Badge>
//                               </td>
//                               <td className="text-center">{s.srn || "—"}</td>
//                               <td>{s.name || "—"}</td>
//                               <td>{s.father || "—"}</td>
//                               <td className="text-center">{batchText}</td>
//                               <td className="text-center">{s.orientationRoomNumber || "—"}</td>
//                               <td className="text-center">{s.bedNumber || "—"}</td>
//                               <td>
//                                 <ToggleButton
//                                   type="checkbox"
//                                   variant={s.isPresentInL3Examination ? "success" : "outline-secondary"}
//                                   checked={s.isPresentInL3Examination}
//                                   value="1"
//                                   onClick={() => handleAttendanceToggle(s._id, s.isPresentInL3Examination)}
//                                   disabled={updatingAttendance && attendanceUpdateStatus[s._id]?.loading}
//                                   style={{ width: "130px" }}
//                                   size="sm"
//                                 >
//                                   {attendanceUpdateStatus[s._id]?.loading ? (
//                                     <Spinner animation="border" size="sm" />
//                                   ) : s.isPresentInL3Examination ? (
//                                     <>
//                                       <FaToggleOn className="me-1" /> Present
//                                     </>
//                                   ) : (
//                                     <>
//                                       <FaToggleOff className="me-1" /> Absent
//                                     </>
//                                   )}
//                                 </ToggleButton>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </Table>
//                   </div>
                  
//                   {filteredData.length === 0 && (
//                     <Alert variant="info" className="text-center mb-0 mt-3">
//                       <FaInfoCircle className="me-2" />
//                       No students found in selected district.
//                     </Alert>
//                   )}
//                 </Card.Body>
//               </Card>

//               <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
//                 <Button 
//                   onClick={generateIDCardsPDF} 
//                   disabled={generatingIDCards || studentData.length === 0}
//                   variant="danger"
//                   size="lg"
//                   className="d-flex align-items-center px-5"
//                 >
//                   <FaDownload className="me-2" />
//                   {generatingIDCards ? "Generating ID Cards..." : "Download ID Cards (ZIP)"}
//                 </Button>
//               </div>

//               <Alert variant="info" className="mb-0">
//                 <FaInfoCircle className="me-2" />
//                 <strong>ID Card Features:</strong> Each page contains 8 ID cards (2 columns × 4 rows). 
//                 Cards have white background, black borders, student photo on left, SRN at top of content area, and details on right with underlines. 
//                 Extra space provided between photo and text for photo pasting. Room No and Bed No are left blank for manual filling. 
//                 Dotted cut lines are provided for easy separation.
//               </Alert>
//             </>
//           )}

//           {showPreview && studentData.length === 0 && (
//             <Alert variant="warning" className="text-center">
//               <FaInfoCircle className="me-2" />
//               No data found for the selected center with applied filters.
//             </Alert>
//           )}
//         </Card.Body>
        
//         <Card.Footer className="text-muted small">
//           <div className="d-flex justify-content-between">
//             <span>Total Centers: {centers.length}</span>
//             <span>ID Card Generator for HS 100 L-2 Students</span>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };












import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Container,
  Row,
  Col,
  Form,
  Button,
  ToggleButton,
} from "react-bootstrap";
import Select from "react-select";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload, FaInfoCircle, FaFilter, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { GetCentersDataByExaminationAndExamTypes100 } from "../../services/ExaminationVenue/ExaminationVenueServices";
import { GetAttendanceSheetDataS100, markL3AttendanceOfStudents } from "../../services/StudentRegistrationServices/StudentRegistrationService";

/* ---------------- CACHE FOR IMAGES ---------------- */
const imageCache = new Map();

const getCachedImage = async (url) => {
  if (!url || !url.startsWith("http")) return null;
  
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }
  
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve) => {
      reader.onloadend = () => {
        const base64data = reader.result;
        imageCache.set(url, base64data);
        resolve(base64data);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to load image:", url, error);
    return null;
  }
};

export const IDCardSuper100L2 = () => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [groupedStudentData, setGroupedStudentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("all");
  const [updatingAttendance, setUpdatingAttendance] = useState(false);
  const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

  const [selectedBatch, setSelectedBatch] = useState(null);
  const batchOptions = [
    { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01 - (19-April-2026 - 21-April-2026)" },
    { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02 - (22-April-2026 - 24-April-2026)" },
    { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03 - (25-April-2026 - 27-April-2026)" },
  ];

  const [selectedSelectionStatus, setSelectedSelectionStatus] = useState(null);
  const selectionStatusOptions = [
    { value: "Selected", label: "Selected" },
    { value: "Waitinglist", label: "Waitinglist" },
  ];

  const [selectedGender, setSelectedGender] = useState(null);
  const genderOptions = [
    { value: "MALE", label: "MALE" },
    { value: "FEMALE", label: "FEMALE" },
  ];

  const [generatingIDCards, setGeneratingIDCards] = useState(false);

  const logo = "/haryana.png";
  const logo3 = "/vikalpalogonotitle.png";

  const cleanDistrictName = (districtName) => {
    if (!districtName || districtName === "Unassigned") return districtName;
    const hyphenIndex = districtName.indexOf('-');
    if (hyphenIndex !== -1) {
      return districtName.substring(0, hyphenIndex).trim();
    }
    return districtName;
  };

  // SIRF STUDENT NAME SE SORT - NO FATHER NAME
  const sortDataByDistrictAndStudentName = (data) => {
    if (!data || data.length === 0) return [];
    
    return [...data].sort((a, b) => {
      // First: District se sort
      const districtA = (cleanDistrictName(a.L2ExaminationDistrict) || "Unassigned").toUpperCase().trim();
      const districtB = (cleanDistrictName(b.L2ExaminationDistrict) || "Unassigned").toUpperCase().trim();
      
      if (districtA < districtB) return -1;
      if (districtA > districtB) return 1;
      
      // Second: SIRF STUDENT NAME se sort - KOI FATHER NAME NAHI
      const studentNameA = (a.name || "").toUpperCase().trim();
      const studentNameB = (b.name || "").toUpperCase().trim();
      
      if (studentNameA < studentNameB) return -1;
      if (studentNameA > studentNameB) return 1;
      
      return 0; // Agar naam same hai toh jaisa hai waisa rahne do
    });
  };

  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      try {
        const res = await GetCentersDataByExaminationAndExamTypes100();
        const uniqueCentersMap = new Map();
        (res.data || []).forEach(center => {
          const key = center.examinationVenue;
          if (!uniqueCentersMap.has(key)) {
            uniqueCentersMap.set(key, center);
          }
        });
        const uniqueCenters = Array.from(uniqueCentersMap.values());
        setCenters(uniqueCenters || []);
      } catch {
        setError("Failed to fetch centers");
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const groupStudentsByDistrict = (students) => {
    const grouped = {};
    
    students.forEach(student => {
      const districtName = cleanDistrictName(student.L2ExaminationDistrict) || "Unassigned";
      if (!grouped[districtName]) {
        grouped[districtName] = [];
      }
      grouped[districtName].push(student);
    });
    
    // SIRF STUDENT NAME SE SORT - NO FATHER NAME
    Object.keys(grouped).forEach(district => {
      grouped[district].sort((a, b) => {
        const nameA = (a.name || "").toUpperCase().trim();
        const nameB = (b.name || "").toUpperCase().trim();
        
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    });
    
    const sortedGrouped = {};
    Object.keys(grouped)
      .sort((a, b) => {
        if (a === "Unassigned") return 1;
        if (b === "Unassigned") return -1;
        const districtA = a.toUpperCase().trim();
        const districtB = b.toUpperCase().trim();
        if (districtA < districtB) return -1;
        if (districtA > districtB) return 1;
        return 0;
      })
      .forEach(key => {
        sortedGrouped[key] = grouped[key];
      });
    
    return sortedGrouped;
  };

  const fetchStudentData = async () => {
    if (!selectedCenter) return setError("Please select a center");
    setLoadingData(true);
    setError(null);
    try {
      const payload = {
        L2ExaminationCenter: selectedCenter.label,
      };
      if (selectedBatch) {
        payload.batchDivisionForL2Examination = selectedBatch.value;
      }
      if (selectedSelectionStatus) {
        payload.selectionStatusForL2 = selectedSelectionStatus.value;
      }
      if (selectedGender) {
        payload.gender = selectedGender.value;
      }
      const res = await GetAttendanceSheetDataS100(payload);

      const sortedData = sortDataByDistrictAndStudentName(res.data || []);
      setStudentData(sortedData);
      const grouped = groupStudentsByDistrict(sortedData);
      setGroupedStudentData(grouped);
      setSelectedDistrictFilter("all");
      setAttendanceUpdateStatus({});
      setShowPreview(true);
    } catch {
      setError("Failed to fetch student data");
    } finally {
      setLoadingData(false);
    }
  };

  const handleAttendanceToggle = async (studentId, currentStatus) => {
    setUpdatingAttendance(true);
    
    setStudentData(prevData => 
      prevData.map(student => 
        student._id === studentId 
          ? { ...student, isPresentInL3Examination: !currentStatus }
          : student
      )
    );
    
    setGroupedStudentData(prevGrouped => {
      const newGrouped = { ...prevGrouped };
      Object.keys(newGrouped).forEach(district => {
        newGrouped[district] = newGrouped[district].map(student =>
          student._id === studentId
            ? { ...student, isPresentInL3Examination: !currentStatus }
            : student
        );
      });
      return newGrouped;
    });
    
    setAttendanceUpdateStatus(prev => ({ 
      ...prev, 
      [studentId]: { loading: true, error: null } 
    }));
    
    try {
      const response = await markL3AttendanceOfStudents({
        _id: studentId,
        isPresentInL3Examination: !currentStatus
      });
      
      if (response.status === 'OK') {
        setAttendanceUpdateStatus(prev => ({ 
          ...prev, 
          [studentId]: { loading: false, success: true, error: null } 
        }));
        
        setTimeout(() => {
          setAttendanceUpdateStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[studentId];
            return newStatus;
          });
        }, 2000);
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error("Failed to update attendance:", error);
      
      setStudentData(prevData => 
        prevData.map(student => 
          student._id === studentId 
            ? { ...student, isPresentInL3Examination: currentStatus }
            : student
        )
      );
      
      setGroupedStudentData(prevGrouped => {
        const newGrouped = { ...prevGrouped };
        Object.keys(newGrouped).forEach(district => {
          newGrouped[district] = newGrouped[district].map(student =>
            student._id === studentId
              ? { ...student, isPresentInL3Examination: currentStatus }
              : student
          );
        });
        return newGrouped;
      });
      
      setAttendanceUpdateStatus(prev => ({ 
        ...prev, 
        [studentId]: { loading: false, success: false, error: error.message } 
      }));
      
      setTimeout(() => {
        setAttendanceUpdateStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[studentId];
          return newStatus;
        });
      }, 3000);
    } finally {
      setUpdatingAttendance(false);
    }
  };

  const getFilteredData = () => {
    if (selectedDistrictFilter === "all") {
      return studentData;
    }
    return groupedStudentData[selectedDistrictFilter] || [];
  };

  const getDistrictOptions = () => {
    const districts = Object.keys(groupedStudentData);
    return [
      { value: "all", label: `📋 All Districts (${studentData.length} students)` },
      ...districts.map(district => ({
        value: district,
        label: `🏢 ${district} (${groupedStudentData[district].length} students)`
      }))
    ];
  };

  const generateIDCardsPDF = async () => {
    if (!studentData.length) {
      setError("No data available for ID cards");
      return;
    }

    setGeneratingIDCards(true);
    setError(null);
    
    try {
      const zip = new JSZip();
      imageCache.clear();

      const groupedByDistrict = {};
      studentData.forEach(student => {
        const district = cleanDistrictName(student.L2ExaminationDistrict) || "Unassigned";
        if (!groupedByDistrict[district]) {
          groupedByDistrict[district] = [];
        }
        groupedByDistrict[district].push(student);
      });

      for (const [districtName, students] of Object.entries(groupedByDistrict)) {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const cardsPerPage = 8;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const cardWidth = 90;
        const cardHeight = 62;
        const marginX = (pageWidth - (2 * cardWidth) - 10) / 2;
        const marginY = 10;
        const spacingX = 10;
        const spacingY = 8;
        
        let cardCount = 0;
        let currentPage = 1;
        
        for (let i = 0; i < students.length; i++) {
          const student = students[i];
          const positionInPage = cardCount % cardsPerPage;
          const row = Math.floor(positionInPage / 2);
          const col = positionInPage % 2;
          
          const x = marginX + (col * (cardWidth + spacingX));
          const y = marginY + (row * (cardHeight + spacingY));
          
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.3);
          pdf.rect(x, y, cardWidth, cardHeight);
          
          if (logo) {
            try {
              pdf.addImage(logo, "PNG", x + 3, y + 2, 7, 7);
            } catch (e) {}
          }
          
          if (logo3) {
            try {
              pdf.addImage(logo3, "PNG", x + cardWidth - 10, y + 2, 10, 7);
            } catch (e) {}
          }
          
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(7.5);
          pdf.setFont("helvetica", "bold");
          pdf.text("HARYANA SUPER 100", x + cardWidth/2, y + 5, { align: "center" });
          
          pdf.setFontSize(5);
          pdf.setFont("helvetica", "normal");
          pdf.text("Barna, Dhand Road, Kurukshetra, 7206758099", x + cardWidth/2, y + 8, { align: "center" });
          
          pdf.setFontSize(4.5);
          pdf.setFont("helvetica", "bold");
          pdf.text("Entrance Examination 2026", x + cardWidth/2, y + 11.5, { align: "center" });
          
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.2);
          pdf.line(x + 3, y + 15.5, x + cardWidth - 3, y + 15.5);
          
          const photoSize = 25;
          const photoX = x + 4;
          const photoY = y + 20;
          
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.2);
          pdf.rect(photoX, photoY, photoSize, photoSize);
          
          if (student.imageUrl) {
            try {
              const imageData = await getCachedImage(student.imageUrl);
              if (imageData) {
                pdf.addImage(imageData, 'JPEG', photoX, photoY, photoSize, photoSize);
              } else {
                pdf.setFontSize(3.5);
                pdf.setTextColor(150, 150, 150);
                pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
              }
            } catch (err) {
              pdf.setFontSize(3.5);
              pdf.setTextColor(150, 150, 150);
              pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
            }
          } else {
            pdf.setFontSize(3.5);
            pdf.setTextColor(150, 150, 150);
            pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
          }
          
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(5.5);
          
          const contentX = x + photoSize + 10;
          let contentY = y + 20;
          const lineHeight = 4.5;
          
          pdf.setFont("helvetica", "bold");
          pdf.text("SRN:", contentX, contentY);
          pdf.setFont("helvetica", "normal");
          const srnValue = student.srn || "—";
          pdf.text(srnValue, contentX + 10, contentY);
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.1);
          pdf.line(contentX + 9, contentY + 0.5, x + cardWidth - 4, contentY + 0.5);
          contentY += lineHeight;
          
          const addDetailWithUnderline = (label, value, drawUnderline = true, leaveEmpty = false) => {
            pdf.setFont("helvetica", "bold");
            pdf.text(`${label}:`, contentX, contentY);
            
            const labelWidth = pdf.getStringUnitWidth(`${label}:`) * 5.5 / pdf.internal.scaleFactor;
            const valueX = contentX + labelWidth + 2;
            
            pdf.setFont("helvetica", "normal");
            
            let displayValue = "";
            if (leaveEmpty) {
              displayValue = "";
            } else {
              const valueStr = (value && value !== "—" && value !== "undefined") ? value.toString() : "";
              displayValue = valueStr;
            }
            
            const maxWidth = cardWidth - (valueX - x) - 5;
            
            if (displayValue && pdf.getStringUnitWidth(displayValue) * 5.5 / pdf.internal.scaleFactor > maxWidth) {
              let truncated = displayValue;
              while (pdf.getStringUnitWidth(truncated + "...") * 5.5 / pdf.internal.scaleFactor > maxWidth && truncated.length > 0) {
                truncated = truncated.slice(0, -1);
              }
              displayValue = truncated + (truncated !== displayValue ? "..." : "");
            }
            
            if (displayValue) {
              pdf.text(displayValue, valueX, contentY);
            }
            
            if (drawUnderline) {
              const underlineStartX = valueX - 1;
              const underlineEndX = x + cardWidth - 4;
              pdf.setDrawColor(0, 0, 0);
              pdf.setLineWidth(0.1);
              pdf.line(underlineStartX, contentY + 0.5, underlineEndX, contentY + 0.5);
            }
            
            contentY += lineHeight;
          };
          
          addDetailWithUnderline("Name", student.name, true, false);
          addDetailWithUnderline("Father", student.father, true, false);
          addDetailWithUnderline("District", districtName, true, false);
          
          const batchMatch = student.batchDivisionForL2Examination ? 
            student.batchDivisionForL2Examination.match(/Batch\s\d+/i) : null;
          const batchText = batchMatch ? batchMatch[0] : (student.batchDivisionForL2Examination || "");
          addDetailWithUnderline("Batch", batchText, true, false);
          
          addDetailWithUnderline("Room No", "", true, true);
          addDetailWithUnderline("Bed No", "", true, true);
          
          const contactNumber = student.mobile || student.contactNumber || student.phone || "";
          addDetailWithUnderline("Contact", contactNumber, true, false);
          
          pdf.setTextColor(0, 0, 0);
          
          cardCount++;
          
          if ((i + 1) < students.length && (cardCount % cardsPerPage === 0)) {
            pdf.addPage();
            currentPage++;
          }
        }
        
        for (let page = 1; page <= currentPage; page++) {
          pdf.setPage(page);
          
          pdf.setDrawColor(180, 180, 180);
          pdf.setLineWidth(0.2);
          pdf.setLineDashPattern([2, 2], 0);
          
          const cutX = marginX + cardWidth + spacingX/2;
          pdf.line(cutX, marginY, cutX, pageHeight - marginY);
          
          for (let row = 1; row < 4; row++) {
            const cutY = marginY + (row * (cardHeight + spacingY)) - spacingY/2;
            pdf.line(marginX, cutY, pageWidth - marginX, cutY);
          }
          
          pdf.setLineDashPattern([], 0);
        }
        
        const cleanDistrict = districtName.replace(/[^a-z0-9]/gi, '_');
        const fileName = `IDCards_${cleanDistrict}.pdf`;
        zip.file(fileName, pdf.output("blob"));
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
      saveAs(zipBlob, `IDCards_${centerNameForFile}.zip`);
      
      setError(null);
    } catch (error) {
      console.error("ID Card PDF generation failed:", error);
      setError("ID Card PDF generation failed: " + error.message);
    } finally {
      setGeneratingIDCards(false);
    }
  };

  const filteredData = getFilteredData();
  const districtOptions = getDistrictOptions();

  const centerOptions = centers.map(center => ({
    value: center._id,
    label: center.examinationVenue,
    capacity: center.capacity || 0
  }));

  return (
    <Container fluid className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
          <FaFilter className="me-2" /> 
          <h5 className="mb-0">HS 100 L-2 ID CARD GENERATOR</h5>
        </Card.Header>

        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <FaInfoCircle className="me-2" />
              {error}
            </Alert>
          )}

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Examination Center</Form.Label>
                <Select
                  placeholder="Select Examination Center"
                  options={centerOptions}
                  isClearable
                  onChange={(center) => {
                    setSelectedCenter(center);
                    setShowPreview(false);
                  }}
                  value={selectedCenter}
                />
                {selectedCenter?.capacity && (
                  <Form.Text className="text-muted">
                    Capacity: {selectedCenter.capacity} students
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Batch</Form.Label>
                <Select
                  placeholder="Select Batch"
                  options={batchOptions}
                  isClearable
                  onChange={(batch) => {
                    setSelectedBatch(batch);
                    setShowPreview(false);
                  }}
                  value={selectedBatch}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Selection Status</Form.Label>
                <Select
                  placeholder="Select Selection Status"
                  options={selectionStatusOptions}
                  isClearable
                  onChange={(status) => {
                    setSelectedSelectionStatus(status);
                    setShowPreview(false);
                  }}
                  value={selectedSelectionStatus}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Select
                  placeholder="Select Gender"
                  options={genderOptions}
                  isClearable
                  onChange={(gender) => {
                    setSelectedGender(gender);
                    setShowPreview(false);
                  }}
                  value={selectedGender}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center mb-4">
            <Button 
              onClick={fetchStudentData} 
              disabled={loadingData || !selectedCenter}
              variant="primary"
              size="lg"
              className="px-5"
            >
              {loadingData ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading Data...
                </>
              ) : (
                "Get Student Data"
              )}
            </Button>
          </div>

          {showPreview && studentData.length > 0 && (
            <>
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <Row className="align-items-center">
                    <Col md={5}>
                      <h6 className="mb-0">
                        📊 Student Data Overview
                        <Badge bg="info" className="ms-2">
                          🏢 {Object.keys(groupedStudentData).length} Districts
                        </Badge>
                        <Badge bg="success" className="ms-2">
                          ✅ {studentData.filter(s => s.isPresentInL3Examination).length} Present
                        </Badge>
                        <Badge bg="secondary" className="ms-2">
                          ❌ {studentData.filter(s => !s.isPresentInL3Examination).length} Absent
                        </Badge>
                      </h6>
                    </Col>
                    <Col md={7}>
                      <Form.Group>
                        <Form.Label className="mb-1">
                          <FaFilter className="me-1" /> Filter by District
                        </Form.Label>
                        <Select
                          options={districtOptions}
                          value={districtOptions.find(opt => opt.value === selectedDistrictFilter)}
                          onChange={(option) => setSelectedDistrictFilter(option?.value || "all")}
                          placeholder="Select District"
                          isClearable={false}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
                    <Table bordered hover size="sm" className="mb-0">
                      <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 5 }}>
                        <tr>
                          <th style={{ width: "50px", backgroundColor: "#0d6efd", color: "white" }}>S.No</th>
                          <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>District</th>
                          <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>SRN</th>
                          <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Name</th>
                          <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Father</th>
                          <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Batch</th>
                          <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Room</th>
                          <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Bed</th>
                          <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((s, i) => {
                          const batchMatch = s.batchDivisionForL2Examination ? 
                            s.batchDivisionForL2Examination.match(/Batch\s\d+/i) : null;
                          const batchText = batchMatch ? batchMatch[0] : (s.batchDivisionForL2Examination || "—");
                          
                          return (
                            <tr key={s._id} className={s.isPresentInL3Examination ? "table-success" : ""}>
                              <td className="text-center fw-bold">{i + 1}</td>
                              <td className="text-center">
                                <Badge bg="info" pill>
                                  🏢 {cleanDistrictName(s.L2ExaminationDistrict) || "—"}
                                </Badge>
                              </td>
                              <td className="text-center">{s.srn || "—"}</td>
                              <td>{s.name || "—"}</td>
                              <td>{s.father || "—"}</td>
                              <td className="text-center">{batchText}</td>
                              <td className="text-center">{s.orientationRoomNumber || "—"}</td>
                              <td className="text-center">{s.bedNumber || "—"}</td>
                              <td>
                                <ToggleButton
                                  type="checkbox"
                                  variant={s.isPresentInL3Examination ? "success" : "outline-secondary"}
                                  checked={s.isPresentInL3Examination}
                                  value="1"
                                  onClick={() => handleAttendanceToggle(s._id, s.isPresentInL3Examination)}
                                  disabled={updatingAttendance && attendanceUpdateStatus[s._id]?.loading}
                                  style={{ width: "130px" }}
                                  size="sm"
                                >
                                  {attendanceUpdateStatus[s._id]?.loading ? (
                                    <Spinner animation="border" size="sm" />
                                  ) : s.isPresentInL3Examination ? (
                                    <>
                                      <FaToggleOn className="me-1" /> Present
                                    </>
                                  ) : (
                                    <>
                                      <FaToggleOff className="me-1" /> Absent
                                    </>
                                  )}
                                </ToggleButton>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  
                  {filteredData.length === 0 && (
                    <Alert variant="info" className="text-center mb-0 mt-3">
                      <FaInfoCircle className="me-2" />
                      No students found in selected district.
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
                <Button 
                  onClick={generateIDCardsPDF} 
                  disabled={generatingIDCards || studentData.length === 0}
                  variant="danger"
                  size="lg"
                  className="d-flex align-items-center px-5"
                >
                  <FaDownload className="me-2" />
                  {generatingIDCards ? "Generating ID Cards..." : "Download ID Cards (ZIP)"}
                </Button>
              </div>

              <Alert variant="info" className="mb-0">
                <FaInfoCircle className="me-2" />
                <strong>ID Card Features:</strong> Each page contains 8 ID cards (2 columns × 4 rows). 
                Cards have white background, black borders, student photo on left, SRN at top of content area, and details on right with underlines. 
                Extra space provided between photo and text for photo pasting. Room No and Bed No are left blank for manual filling. 
                Dotted cut lines are provided for easy separation. <strong>Students are sorted by District first, then by Name only (A-Z alphabetical).</strong>
              </Alert>
            </>
          )}

          {showPreview && studentData.length === 0 && (
            <Alert variant="warning" className="text-center">
              <FaInfoCircle className="me-2" />
              No data found for the selected center with applied filters.
            </Alert>
          )}
        </Card.Body>
        
        <Card.Footer className="text-muted small">
          <div className="d-flex justify-content-between">
            <span>Total Centers: {centers.length}</span>
            <span>ID Card Generator for HS 100 L-2 Students</span>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};