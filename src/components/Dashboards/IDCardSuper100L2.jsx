
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
  
//   const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("all");
//   const [updatingAttendance, setUpdatingAttendance] = useState(false);
//   const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const batchOptions = [
//     { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01 - (19-April-2026 - 21-April-2026)" },
//     { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02 - (22-April-2026 - 24-April-2026)" },
//     { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03 - (25-April-2026 - 27-April-2026)" },
//     { value: "Batch 04 - (29-April-2026 - 01-May-2026)", label: "Batch 04 - (29-April-2026 - 01-May-2026)" },
//   ];

//   const [selectedSelectionStatus, setSelectedSelectionStatus] = useState(null);
//   const selectionStatusOptions = [
//     { value: "Selected", label: "Selected" },
//     { value: "Waitinglist", label: "Waitinglist" },
//   ];

//   const [selectedGender, setSelectedGender] = useState(null);
//   const genderOptions = [
//     { value: "MALE", label: "MALE" },
//     { value: "FEMALE", label: "FEMALE" },
//   ];

//   const [generatingIDCards, setGeneratingIDCards] = useState(false);

//   const logo = "/haryana.png";
//   const logo3 = "/vikalpalogonotitle.png";

//   const cleanDistrictName = (districtName) => {
//     if (!districtName || districtName === "Unassigned") return districtName;
//     const hyphenIndex = districtName.indexOf('-');
//     if (hyphenIndex !== -1) {
//       return districtName.substring(0, hyphenIndex).trim();
//     }
//     return districtName;
//   };

//   // SIRF STUDENT NAME SE SORT - NO FATHER NAME
//   const sortDataByDistrictAndStudentName = (data) => {
//     if (!data || data.length === 0) return [];
    
//     return [...data].sort((a, b) => {
//       // First: District se sort
//       const districtA = (cleanDistrictName(a.L2ExaminationDistrict) || "Unassigned").toUpperCase().trim();
//       const districtB = (cleanDistrictName(b.L2ExaminationDistrict) || "Unassigned").toUpperCase().trim();
      
//       if (districtA < districtB) return -1;
//       if (districtA > districtB) return 1;
      
//       // Second: SIRF STUDENT NAME se sort - KOI FATHER NAME NAHI
//       const studentNameA = (a.name || "").toUpperCase().trim();
//       const studentNameB = (b.name || "").toUpperCase().trim();
      
//       if (studentNameA < studentNameB) return -1;
//       if (studentNameA > studentNameB) return 1;
      
//       return 0; // Agar naam same hai toh jaisa hai waisa rahne do
//     });
//   };

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

//   const groupStudentsByDistrict = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       const districtName = cleanDistrictName(student.L2ExaminationDistrict) || "Unassigned";
//       if (!grouped[districtName]) {
//         grouped[districtName] = [];
//       }
//       grouped[districtName].push(student);
//     });
    
//     // SIRF STUDENT NAME SE SORT - NO FATHER NAME
//     Object.keys(grouped).forEach(district => {
//       grouped[district].sort((a, b) => {
//         const nameA = (a.name || "").toUpperCase().trim();
//         const nameB = (b.name || "").toUpperCase().trim();
        
//         if (nameA < nameB) return -1;
//         if (nameA > nameB) return 1;
//         return 0;
//       });
//     });
    
//     const sortedGrouped = {};
//     Object.keys(grouped)
//       .sort((a, b) => {
//         if (a === "Unassigned") return 1;
//         if (b === "Unassigned") return -1;
//         const districtA = a.toUpperCase().trim();
//         const districtB = b.toUpperCase().trim();
//         if (districtA < districtB) return -1;
//         if (districtA > districtB) return 1;
//         return 0;
//       })
//       .forEach(key => {
//         sortedGrouped[key] = grouped[key];
//       });
    
//     return sortedGrouped;
//   };

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

//       const sortedData = sortDataByDistrictAndStudentName(res.data || []);
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

//   const getFilteredData = () => {
//     if (selectedDistrictFilter === "all") {
//       return studentData;
//     }
//     return groupedStudentData[selectedDistrictFilter] || [];
//   };

//   const getDistrictOptions = () => {
//     const districts = Object.keys(groupedStudentData);
//     return [
//       { value: "all", label: `📋 All Districts (${studentData.length} students)` },
//       ...districts.map(district => ({
//         value: district,
//         label: `🏢 ${district} (${groupedStudentData[district].length} students)`
//       }))
//     ];
//   };

//   const generateIDCardsPDF = async () => {
//     if (!studentData.length) {
//       setError("No data available for ID cards");
//       return;
//     }

//     setGeneratingIDCards(true);
//     setError(null);
    
//     try {
//       const zip = new JSZip();
//       imageCache.clear();

//       const groupedByDistrict = {};
//       studentData.forEach(student => {
//         const district = cleanDistrictName(student.L2ExaminationDistrict) || "Unassigned";
//         if (!groupedByDistrict[district]) {
//           groupedByDistrict[district] = [];
//         }
//         groupedByDistrict[district].push(student);
//       });

//       for (const [districtName, students] of Object.entries(groupedByDistrict)) {
//         const pdf = new jsPDF({
//           orientation: 'portrait',
//           unit: 'mm',
//           format: 'a4'
//         });
        
//         const cardsPerPage = 8;
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();
        
//         const cardWidth = 90;
//         const cardHeight = 62;
//         const marginX = (pageWidth - (2 * cardWidth) - 10) / 2;
//         const marginY = 10;
//         const spacingX = 10;
//         const spacingY = 8;
        
//         let cardCount = 0;
//         let currentPage = 1;
        
//         for (let i = 0; i < students.length; i++) {
//           const student = students[i];
//           const positionInPage = cardCount % cardsPerPage;
//           const row = Math.floor(positionInPage / 2);
//           const col = positionInPage % 2;
          
//           const x = marginX + (col * (cardWidth + spacingX));
//           const y = marginY + (row * (cardHeight + spacingY));
          
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.3);
//           pdf.rect(x, y, cardWidth, cardHeight);
          
//           if (logo) {
//             try {
//               pdf.addImage(logo, "PNG", x + 3, y + 2, 7, 7);
//             } catch (e) {}
//           }
          
//           if (logo3) {
//             try {
//               pdf.addImage(logo3, "PNG", x + cardWidth - 10, y + 2, 10, 7);
//             } catch (e) {}
//           }
          
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(7.5);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("HARYANA SUPER 100", x + cardWidth/2, y + 5, { align: "center" });
          
//           pdf.setFontSize(5);
//           pdf.setFont("helvetica", "normal");
//           pdf.text("Barna, Dhand Road, Kurukshetra, 7206758099", x + cardWidth/2, y + 8, { align: "center" });
          
//           pdf.setFontSize(4.5);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("Entrance Examination 2026", x + cardWidth/2, y + 11.5, { align: "center" });
          
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.2);
//           pdf.line(x + 3, y + 15.5, x + cardWidth - 3, y + 15.5);
          
//           const photoSize = 25;
//           const photoX = x + 4;
//           const photoY = y + 20;
          
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.2);
//           pdf.rect(photoX, photoY, photoSize, photoSize);
          
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
//               pdf.setFontSize(3.5);
//               pdf.setTextColor(150, 150, 150);
//               pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//             }
//           } else {
//             pdf.setFontSize(3.5);
//             pdf.setTextColor(150, 150, 150);
//             pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//           }
          
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(5.5);
          
//           const contentX = x + photoSize + 10;
//           let contentY = y + 20;
//           const lineHeight = 4.5;
          
//           pdf.setFont("helvetica", "bold");
//           pdf.text("SRN:", contentX, contentY);
//           pdf.setFont("helvetica", "normal");
//           const srnValue = student.srn || "—";
//           pdf.text(srnValue, contentX + 10, contentY);
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.1);
//           pdf.line(contentX + 9, contentY + 0.5, x + cardWidth - 4, contentY + 0.5);
//           contentY += lineHeight;
          
//           const addDetailWithUnderline = (label, value, drawUnderline = true, leaveEmpty = false) => {
//             pdf.setFont("helvetica", "bold");
//             pdf.text(`${label}:`, contentX, contentY);
            
//             const labelWidth = pdf.getStringUnitWidth(`${label}:`) * 5.5 / pdf.internal.scaleFactor;
//             const valueX = contentX + labelWidth + 2;
            
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
            
//             if (drawUnderline) {
//               const underlineStartX = valueX - 1;
//               const underlineEndX = x + cardWidth - 4;
//               pdf.setDrawColor(0, 0, 0);
//               pdf.setLineWidth(0.1);
//               pdf.line(underlineStartX, contentY + 0.5, underlineEndX, contentY + 0.5);
//             }
            
//             contentY += lineHeight;
//           };
          
//           addDetailWithUnderline("Name", student.name, true, false);
//           addDetailWithUnderline("Father", student.father, true, false);
//           addDetailWithUnderline("District", districtName, true, false);
          
//           const batchMatch = student.batchDivisionForL2Examination ? 
//             student.batchDivisionForL2Examination.match(/Batch\s\d+/i) : null;
//           const batchText = batchMatch ? batchMatch[0] : (student.batchDivisionForL2Examination || "");
//           addDetailWithUnderline("Batch", batchText, true, false);
          
//           addDetailWithUnderline("Room No", "", true, true);
//           addDetailWithUnderline("Bed No", "", true, true);
          
//           const contactNumber = student.mobile || student.contactNumber || student.phone || "";
//           addDetailWithUnderline("Contact", contactNumber, true, false);
          
//           pdf.setTextColor(0, 0, 0);
          
//           cardCount++;
          
//           if ((i + 1) < students.length && (cardCount % cardsPerPage === 0)) {
//             pdf.addPage();
//             currentPage++;
//           }
//         }
        
//         for (let page = 1; page <= currentPage; page++) {
//           pdf.setPage(page);
          
//           pdf.setDrawColor(180, 180, 180);
//           pdf.setLineWidth(0.2);
//           pdf.setLineDashPattern([2, 2], 0);
          
//           const cutX = marginX + cardWidth + spacingX/2;
//           pdf.line(cutX, marginY, cutX, pageHeight - marginY);
          
//           for (let row = 1; row < 4; row++) {
//             const cutY = marginY + (row * (cardHeight + spacingY)) - spacingY/2;
//             pdf.line(marginX, cutY, pageWidth - marginX, cutY);
//           }
          
//           pdf.setLineDashPattern([], 0);
//         }
        
//         const cleanDistrict = districtName.replace(/[^a-z0-9]/gi, '_');
//         const fileName = `IDCards_${cleanDistrict}.pdf`;
//         zip.file(fileName, pdf.output("blob"));
//       }
      
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
//                 Dotted cut lines are provided for easy separation. <strong>Students are sorted by District first, then by Name only (A-Z alphabetical).</strong>
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
//   const [studentData, setStudentData] = useState([]);
//   const [groupedStudentData, setGroupedStudentData] = useState({});
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
  
//   const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("all");
//   const [updatingAttendance, setUpdatingAttendance] = useState(false);
//   const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

//   // Updated filters for backend API
//   const [selectedFinalStatus, setSelectedFinalStatus] = useState(null);
//   const finalStatusOptions = [
//     { value: "Selected", label: "Selected" },
//     { value: "Waitinglist", label: "Waiting List" },
//     { value: "BOTH", label: "Both (Selected + Waiting List)" },
//   ];

//   const [selectedGender, setSelectedGender] = useState(null);
//   const genderOptions = [
//     { value: "MALE", label: "MALE" },
//     { value: "FEMALE", label: "FEMALE" },
//     { value: "BOTH", label: "BOTH" },
//   ];

//   const [generatingAdmissionSlips, setGeneratingAdmissionSlips] = useState(false);

//   const logo = "/haryana.png";
//   const logo3 = "/vikalpalogonotitle.png";

//   const cleanDistrictName = (districtName) => {
//     if (!districtName || districtName === "Unassigned") return districtName;
//     const hyphenIndex = districtName.indexOf('-');
//     if (hyphenIndex !== -1) {
//       return districtName.substring(0, hyphenIndex).trim();
//     }
//     return districtName;
//   };

//   // Sort by District then Student Name
//   const sortDataByDistrictAndStudentName = (data) => {
//     if (!data || data.length === 0) return [];
    
//     return [...data].sort((a, b) => {
//       const districtA = (cleanDistrictName(a.L2ExaminationDistrict) || "Unassigned").toUpperCase().trim();
//       const districtB = (cleanDistrictName(b.L2ExaminationDistrict) || "Unassigned").toUpperCase().trim();
      
//       if (districtA < districtB) return -1;
//       if (districtA > districtB) return 1;
      
//       const studentNameA = (a.name || "").toUpperCase().trim();
//       const studentNameB = (b.name || "").toUpperCase().trim();
      
//       if (studentNameA < studentNameB) return -1;
//       if (studentNameA > studentNameB) return 1;
      
//       return 0;
//     });
//   };

//   const groupStudentsByDistrict = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       const districtName = cleanDistrictName(student.L2ExaminationDistrict) || "Unassigned";
//       if (!grouped[districtName]) {
//         grouped[districtName] = [];
//       }
//       grouped[districtName].push(student);
//     });
    
//     Object.keys(grouped).forEach(district => {
//       grouped[district].sort((a, b) => {
//         const nameA = (a.name || "").toUpperCase().trim();
//         const nameB = (b.name || "").toUpperCase().trim();
        
//         if (nameA < nameB) return -1;
//         if (nameA > nameB) return 1;
//         return 0;
//       });
//     });
    
//     const sortedGrouped = {};
//     Object.keys(grouped)
//       .sort((a, b) => {
//         if (a === "Unassigned") return 1;
//         if (b === "Unassigned") return -1;
//         const districtA = a.toUpperCase().trim();
//         const districtB = b.toUpperCase().trim();
//         if (districtA < districtB) return -1;
//         if (districtA > districtB) return 1;
//         return 0;
//       })
//       .forEach(key => {
//         sortedGrouped[key] = grouped[key];
//       });
    
//     return sortedGrouped;
//   };

//   const fetchStudentData = async () => {
//     setLoadingData(true);
//     setError(null);
//     try {
//       const payload = {
//         L2Qualified: true, // Always send true by default
//       };
      
//       if (selectedFinalStatus) {
//         payload.finalShortListOrWaitListStudents = selectedFinalStatus.value;
//       }
      
//       if (selectedGender) {
//         payload.gender = selectedGender.value;
//       }
      
//       const res = await GetAttendanceSheetDataS100(payload);

//       const sortedData = sortDataByDistrictAndStudentName(res.data || []);
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

//   const getFilteredData = () => {
//     if (selectedDistrictFilter === "all") {
//       return studentData;
//     }
//     return groupedStudentData[selectedDistrictFilter] || [];
//   };

//   const getDistrictOptions = () => {
//     const districts = Object.keys(groupedStudentData);
//     return [
//       { value: "all", label: `📋 All Districts (${studentData.length} students)` },
//       ...districts.map(district => ({
//         value: district,
//         label: `🏢 ${district} (${groupedStudentData[district].length} students)`
//       }))
//     ];
//   };

//   const generateAdmissionSlipsPDF = async () => {
//     if (!studentData.length) {
//       setError("No data available for admission slips");
//       return;
//     }

//     setGeneratingAdmissionSlips(true);
//     setError(null);
    
//     try {
//       const zip = new JSZip();
//       imageCache.clear();

//       const groupedByDistrict = {};
//       studentData.forEach(student => {
//         const district = cleanDistrictName(student.L2ExaminationDistrict) || "Unassigned";
//         if (!groupedByDistrict[district]) {
//           groupedByDistrict[district] = [];
//         }
//         groupedByDistrict[district].push(student);
//       });

//       for (const [districtName, students] of Object.entries(groupedByDistrict)) {
//         const pdf = new jsPDF({
//           orientation: 'portrait',
//           unit: 'mm',
//           format: 'a4'
//         });
        
//         const cardsPerPage = 8;
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();
        
//         const cardWidth = 90;
//         const cardHeight = 62;
//         const marginX = (pageWidth - (2 * cardWidth) - 10) / 2;
//         const marginY = 10;
//         const spacingX = 10;
//         const spacingY = 8;
        
//         let cardCount = 0;
//         let currentPage = 1;
        
//         for (let i = 0; i < students.length; i++) {
//           const student = students[i];
//           const positionInPage = cardCount % cardsPerPage;
//           const row = Math.floor(positionInPage / 2);
//           const col = positionInPage % 2;
          
//           const x = marginX + (col * (cardWidth + spacingX));
//           const y = marginY + (row * (cardHeight + spacingY));
          
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.3);
//           pdf.rect(x, y, cardWidth, cardHeight);
          
//           if (logo) {
//             try {
//               pdf.addImage(logo, "PNG", x + 3, y + 2, 7, 7);
//             } catch (e) {}
//           }
          
//           if (logo3) {
//             try {
//               pdf.addImage(logo3, "PNG", x + cardWidth - 10, y + 2, 10, 7);
//             } catch (e) {}
//           }
          
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(7.5);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("HARYANA SUPER 100", x + cardWidth/2, y + 5, { align: "center" });
          
//           pdf.setFontSize(5);
//           pdf.setFont("helvetica", "normal");
//           pdf.text("Barna, Dhand Road, Kurukshetra, 7206758099", x + cardWidth/2, y + 8, { align: "center" });
          
//           pdf.setFontSize(8);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("Admission Confirmation Slip", x + cardWidth/2, y + 11.5, { align: "center" });
          
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.2);
//           pdf.line(x + 3, y + 15.5, x + cardWidth - 3, y + 15.5);
          
//           const photoSize = 25;
//           const photoX = x + 4;
//           const photoY = y + 20;
          
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.2);
//           pdf.rect(photoX, photoY, photoSize, photoSize);
          
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
//               pdf.setFontSize(3.5);
//               pdf.setTextColor(150, 150, 150);
//               pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//             }
//           } else {
//             pdf.setFontSize(3.5);
//             pdf.setTextColor(150, 150, 150);
//             pdf.text("No Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
//           }
          
//           pdf.setTextColor(0, 0, 0);
//           pdf.setFontSize(5.5);
          
//           const contentX = x + photoSize + 10;
//           let contentY = y + 20;
//           const lineHeight = 4.5;
          
//           pdf.setFont("helvetica", "bold");
//           pdf.text("SRN:", contentX, contentY);
//           pdf.setFont("helvetica", "normal");
//           const srnValue = student.srn || "—";
//           pdf.text(srnValue, contentX + 10, contentY);
//           pdf.setDrawColor(0, 0, 0);
//           pdf.setLineWidth(0.1);
//           pdf.line(contentX + 9, contentY + 0.5, x + cardWidth - 4, contentY + 0.5);
//           contentY += lineHeight;
          
//           const addDetailWithUnderline = (label, value, drawUnderline = true, leaveEmpty = false) => {
//             pdf.setFont("helvetica", "bold");
//             pdf.text(`${label}:`, contentX, contentY);
            
//             const labelWidth = pdf.getStringUnitWidth(`${label}:`) * 5.5 / pdf.internal.scaleFactor;
//             const valueX = contentX + labelWidth + 2;
            
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
            
//             if (drawUnderline) {
//               const underlineStartX = valueX - 1;
//               const underlineEndX = x + cardWidth - 4;
//               pdf.setDrawColor(0, 0, 0);
//               pdf.setLineWidth(0.1);
//               pdf.line(underlineStartX, contentY + 0.5, underlineEndX, contentY + 0.5);
//             }
            
//             contentY += lineHeight;
//           };
          
//           addDetailWithUnderline("Name", student.name, true, false);
//           addDetailWithUnderline("Father", student.father, true, false);
//           addDetailWithUnderline("District", districtName, true, false);
          
//           addDetailWithUnderline("Room No", "", true, true);
//           addDetailWithUnderline("Bed No", "", true, true);
          
//           addDetailWithUnderline("Almirah No.", "", true, true);
          
//           pdf.setTextColor(0, 0, 0);
          
//           cardCount++;
          
//           if ((i + 1) < students.length && (cardCount % cardsPerPage === 0)) {
//             pdf.addPage();
//             currentPage++;
//           }
//         }
        
//         for (let page = 1; page <= currentPage; page++) {
//           pdf.setPage(page);
          
//           pdf.setDrawColor(180, 180, 180);
//           pdf.setLineWidth(0.2);
//           pdf.setLineDashPattern([2, 2], 0);
          
//           const cutX = marginX + cardWidth + spacingX/2;
//           pdf.line(cutX, marginY, cutX, pageHeight - marginY);
          
//           for (let row = 1; row < 4; row++) {
//             const cutY = marginY + (row * (cardHeight + spacingY)) - spacingY/2;
//             pdf.line(marginX, cutY, pageWidth - marginX, cutY);
//           }
          
//           pdf.setLineDashPattern([], 0);
//         }
        
//         const cleanDistrict = districtName.replace(/[^a-z0-9]/gi, '_');
//         const fileName = `AdmissionSlips_${cleanDistrict}.pdf`;
//         zip.file(fileName, pdf.output("blob"));
//       }
      
//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       saveAs(zipBlob, `AdmissionSlips.zip`);
      
//       setError(null);
//     } catch (error) {
//       console.error("Admission Slip PDF generation failed:", error);
//       setError("Admission Slip PDF generation failed: " + error.message);
//     } finally {
//       setGeneratingAdmissionSlips(false);
//     }
//   };

//   const filteredData = getFilteredData();
//   const districtOptions = getDistrictOptions();

//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex align-items-center">
//           <FaFilter className="me-2" /> 
//           <h5 className="mb-0">HS 100 L-2 ADMISSION SLIP GENERATOR</h5>
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
//                 <Form.Label>Final Selection Status</Form.Label>
//                 <Select
//                   placeholder="Select Final Status"
//                   options={finalStatusOptions}
//                   isClearable
//                   onChange={(status) => {
//                     setSelectedFinalStatus(status);
//                     setShowPreview(false);
//                   }}
//                   value={selectedFinalStatus}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={6}>
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
//               disabled={loadingData}
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
//                           <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>L2 Qualified</th>
//                           <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>Final Status</th>
//                           <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Room</th>
//                           <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Bed</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredData.map((s, i) => {
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
//                               <td className="text-center">
//                                 <Badge bg={s.L2Qualified ? "success" : "danger"}>
//                                   {s.L2Qualified ? "Qualified" : "Not Qualified"}
//                                 </Badge>
//                               </td>
//                               <td className="text-center">
//                                 <Badge bg={s.finalShortListOrWaitListStudents === "Selected" ? "success" : "warning"}>
//                                   {s.finalShortListOrWaitListStudents || "—"}
//                                 </Badge>
//                               </td>
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
//                   onClick={generateAdmissionSlipsPDF} 
//                   disabled={generatingAdmissionSlips || studentData.length === 0}
//                   variant="danger"
//                   size="lg"
//                   className="d-flex align-items-center px-5"
//                 >
//                   <FaDownload className="me-2" />
//                   {generatingAdmissionSlips ? "Generating Admission Slips..." : "Download Admission Slips (ZIP)"}
//                 </Button>
//               </div>

//               <Alert variant="info" className="mb-0">
//                 <FaInfoCircle className="me-2" />
//                 <strong>Admission Slip Features:</strong> Each page contains 8 admission slips (2 columns × 4 rows). 
//                 Slips have white background, black borders, student photo on left, SRN at top of content area, and details on right with underlines. 
//                 Extra space provided between photo and text for photo pasting. Room No, Bed No and Almirah No are left blank for manual filling. 
//                 Dotted cut lines are provided for easy separation. <strong>Students are sorted by District first, then by Name only (A-Z alphabetical).</strong>
//               </Alert>
//             </>
//           )}

//           {showPreview && studentData.length === 0 && (
//             <Alert variant="warning" className="text-center">
//               <FaInfoCircle className="me-2" />
//               No data found for the selected filters.
//             </Alert>
//           )}
//         </Card.Body>
        
//         <Card.Footer className="text-muted small">
//           <div className="d-flex justify-content-between">
//             <span>Admission Slip Generator for HS 100 L-2 Students</span>
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
import { FaDownload, FaInfoCircle, FaFilter, FaToggleOn, FaToggleOff, FaFileAlt } from "react-icons/fa";
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
  const [studentData, setStudentData] = useState([]);
  const [groupedStudentData, setGroupedStudentData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("all");
  const [updatingAttendance, setUpdatingAttendance] = useState(false);
  const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

  // Updated filters for backend API
  const [selectedFinalStatus, setSelectedFinalStatus] = useState(null);
  const finalStatusOptions = [
    { value: "Selected", label: "Selected" },
    { value: "Waitinglist", label: "Waiting List" },
    { value: "BOTH", label: "Both (Selected + Waiting List)" },
  ];

  const [selectedGender, setSelectedGender] = useState(null);
  const genderOptions = [
    { value: "MALE", label: "MALE" },
    { value: "FEMALE", label: "FEMALE" },
    { value: "BOTH", label: "BOTH" },
  ];

  const [generatingAdmissionSlips, setGeneratingAdmissionSlips] = useState(false);
  const [generatingBlankTemplate, setGeneratingBlankTemplate] = useState(false);

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

  // Sort by District then Student Name
  const sortDataByDistrictAndStudentName = (data) => {
    if (!data || data.length === 0) return [];
    
    return [...data].sort((a, b) => {
      const districtA = (cleanDistrictName(a.L2ExaminationDistrict) || "Unassigned").toUpperCase().trim();
      const districtB = (cleanDistrictName(b.L2ExaminationDistrict) || "Unassigned").toUpperCase().trim();
      
      if (districtA < districtB) return -1;
      if (districtA > districtB) return 1;
      
      const studentNameA = (a.name || "").toUpperCase().trim();
      const studentNameB = (b.name || "").toUpperCase().trim();
      
      if (studentNameA < studentNameB) return -1;
      if (studentNameA > studentNameB) return 1;
      
      return 0;
    });
  };

  const groupStudentsByDistrict = (students) => {
    const grouped = {};
    
    students.forEach(student => {
      const districtName = cleanDistrictName(student.L2ExaminationDistrict) || "Unassigned";
      if (!grouped[districtName]) {
        grouped[districtName] = [];
      }
      grouped[districtName].push(student);
    });
    
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
    setLoadingData(true);
    setError(null);
    try {
      const payload = {
        L2Qualified: true, // Always send true by default
      };
      
      if (selectedFinalStatus) {
        payload.finalShortListOrWaitListStudents = selectedFinalStatus.value;
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

  // Generate blank template PDF
  const generateBlankTemplate = async () => {
    setGeneratingBlankTemplate(true);
    setError(null);
    
    try {
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
      
      // Generate 8 blank cards (one full page)
      for (let i = 0; i < cardsPerPage; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        
        const x = marginX + (col * (cardWidth + spacingX));
        const y = marginY + (row * (cardHeight + spacingY));
        
        // Draw card border
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);
        pdf.rect(x, y, cardWidth, cardHeight);
        
        // Add logos
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
        
        // Header text
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "bold");
        pdf.text("HARYANA SUPER 100", x + cardWidth/2, y + 5, { align: "center" });
        
        pdf.setFontSize(5);
        pdf.setFont("helvetica", "normal");
        pdf.text("Barna, Dhand Road, Kurukshetra, 7206758099", x + cardWidth/2, y + 8, { align: "center" });
        
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.text("Admission Confirmation Slip", x + cardWidth/2, y + 11.5, { align: "center" });
        
        // Divider line
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.2);
        pdf.line(x + 3, y + 15.5, x + cardWidth - 3, y + 15.5);
        
        // Photo placeholder
        const photoSize = 25;
        const photoX = x + 4;
        const photoY = y + 20;
        
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.2);
        pdf.rect(photoX, photoY, photoSize, photoSize);
        
        // Photo placeholder text
        pdf.setFontSize(3.5);
        pdf.setTextColor(150, 150, 150);
        pdf.text("Photo", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
        
        // Content area
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(5.5);
        
        const contentX = x + photoSize + 10;
        let contentY = y + 20;
        const lineHeight = 4.5;
        
        // SRN field
        pdf.setFont("helvetica", "bold");
        pdf.text("SRN:", contentX, contentY);
        pdf.setFont("helvetica", "normal");
        pdf.text("_______________", contentX + 10, contentY);
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.1);
        pdf.line(contentX + 9, contentY + 0.5, x + cardWidth - 4, contentY + 0.5);
        contentY += lineHeight;
        
        // Helper function to add blank fields
        const addBlankField = (label, underlineOnly = false, underlineWidth = null) => {
          pdf.setFont("helvetica", "bold");
          pdf.text(`${label}:`, contentX, contentY);
          
          const labelWidth = pdf.getStringUnitWidth(`${label}:`) * 5.5 / pdf.internal.scaleFactor;
          const valueX = contentX + labelWidth + 2;
          
          pdf.setFont("helvetica", "normal");
          
          if (underlineOnly) {
            const underlineStartX = valueX - 1;
            const underlineEndX = underlineWidth ? underlineWidth : x + cardWidth - 4;
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.1);
            pdf.line(underlineStartX, contentY + 0.5, underlineEndX, contentY + 0.5);
          } else {
            pdf.text("____________________", valueX, contentY);
          }
          
          contentY += lineHeight;
        };
        
        addBlankField("Name", false);
        addBlankField("Father", false);
        addBlankField("District", false);
        addBlankField("Room No", true, x + cardWidth - 4);
        addBlankField("Bed No", true, x + cardWidth - 4);
        addBlankField("Almirah No.", true, x + cardWidth - 4);
        
        pdf.setTextColor(0, 0, 0);
      }
      
      // Add cut lines
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
      
      // Save the PDF
      pdf.save("Blank_Admission_Slip_Template.pdf");
      
      setError(null);
    } catch (error) {
      console.error("Blank template generation failed:", error);
      setError("Blank template generation failed: " + error.message);
    } finally {
      setGeneratingBlankTemplate(false);
    }
  };

  const generateAdmissionSlipsPDF = async () => {
    if (!studentData.length) {
      setError("No data available for admission slips");
      return;
    }

    setGeneratingAdmissionSlips(true);
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
          
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "bold");
          pdf.text("Admission Confirmation Slip", x + cardWidth/2, y + 11.5, { align: "center" });
          
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
          
          addDetailWithUnderline("Room No", "", true, true);
          addDetailWithUnderline("Bed No", "", true, true);
          
          addDetailWithUnderline("Almirah No.", "", true, true);
          
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
        const fileName = `AdmissionSlips_${cleanDistrict}.pdf`;
        zip.file(fileName, pdf.output("blob"));
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `AdmissionSlips.zip`);
      
      setError(null);
    } catch (error) {
      console.error("Admission Slip PDF generation failed:", error);
      setError("Admission Slip PDF generation failed: " + error.message);
    } finally {
      setGeneratingAdmissionSlips(false);
    }
  };

  const filteredData = getFilteredData();
  const districtOptions = getDistrictOptions();

  return (
    <Container fluid className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
          <FaFilter className="me-2" /> 
          <h5 className="mb-0">HS 100 L-2 ADMISSION SLIP GENERATOR</h5>
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
                <Form.Label>Final Selection Status</Form.Label>
                <Select
                  placeholder="Select Final Status"
                  options={finalStatusOptions}
                  isClearable
                  onChange={(status) => {
                    setSelectedFinalStatus(status);
                    setShowPreview(false);
                  }}
                  value={selectedFinalStatus}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
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

          <div className="text-center mb-4 d-flex gap-3 justify-content-center">
            <Button 
              onClick={fetchStudentData} 
              disabled={loadingData}
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

            <Button 
              onClick={generateBlankTemplate} 
              disabled={generatingBlankTemplate}
              variant="secondary"
              size="lg"
              className="px-5"
            >
              {generatingBlankTemplate ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FaFileAlt className="me-2" />
                  Download Blank Template
                </>
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
                          <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>L2 Qualified</th>
                          <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>Final Status</th>
                          <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Room</th>
                          <th style={{ width: "70px", backgroundColor: "#0d6efd", color: "white" }}>Bed</th>
                          <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((s, i) => {
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
                              <td className="text-center">
                                <Badge bg={s.L2Qualified ? "success" : "danger"}>
                                  {s.L2Qualified ? "Qualified" : "Not Qualified"}
                                </Badge>
                              </td>
                              <td className="text-center">
                                <Badge bg={s.finalShortListOrWaitListStudents === "Selected" ? "success" : "warning"}>
                                  {s.finalShortListOrWaitListStudents || "—"}
                                </Badge>
                              </td>
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
                  onClick={generateAdmissionSlipsPDF} 
                  disabled={generatingAdmissionSlips || studentData.length === 0}
                  variant="danger"
                  size="lg"
                  className="d-flex align-items-center px-5"
                >
                  <FaDownload className="me-2" />
                  {generatingAdmissionSlips ? "Generating Admission Slips..." : "Download Admission Slips (ZIP)"}
                </Button>
              </div>

              <Alert variant="info" className="mb-0">
                <FaInfoCircle className="me-2" />
                <strong>Admission Slip Features:</strong> Each page contains 8 admission slips (2 columns × 4 rows). 
                Slips have white background, black borders, student photo on left, SRN at top of content area, and details on right with underlines. 
                Extra space provided between photo and text for photo pasting. Room No, Bed No and Almirah No are left blank for manual filling. 
                Dotted cut lines are provided for easy separation. <strong>Students are sorted by District first, then by Name only (A-Z alphabetical).</strong>
              </Alert>
            </>
          )}

          {showPreview && studentData.length === 0 && (
            <Alert variant="warning" className="text-center">
              <FaInfoCircle className="me-2" />
              No data found for the selected filters.
            </Alert>
          )}
        </Card.Body>
        
        <Card.Footer className="text-muted small">
          <div className="d-flex justify-content-between">
            <span>Admission Slip Generator for HS 100 L-2 Students</span>
            <Button 
              variant="link" 
              size="sm" 
              onClick={generateBlankTemplate}
              disabled={generatingBlankTemplate}
              className="text-decoration-none"
            >
              <FaFileAlt className="me-1" />
              Download Blank Template
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};