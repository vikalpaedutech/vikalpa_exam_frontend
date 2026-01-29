
// //Attendance sheet...


// import React, { useEffect, useState, useMemo } from "react";
// import {
//     Card,
//     Table,
//     Spinner,
//     Alert,
//     Badge,
//     Container,
//     Row,
//     Col,
//     Form,
//     Button,
//     FormControl,
// } from "react-bootstrap";
// import Select from "react-select";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { GetCentersDataByExaminationAndExamType } from "../../services/ExaminationVenue/ExaminationVenueServices.js";
// import { FaDownload, FaFileExcel, FaInfoCircle, FaQuestionCircle } from "react-icons/fa";
// import { GetAttendanceSheetData } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

// export const AttendanceSheet = () => {

//     const [centers, setCenters] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [selectedDistrict, setSelectedDistrict] = useState(null);
//     const [csvData, setCsvData] = useState([]);
//     const [parsedData, setParsedData] = useState([]);
//     const [allocationResults, setAllocationResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [step, setStep] = useState(1); // 1: Select District, 2: Upload CSV, 3: View Results
//     const [districtBlocks, setDistrictBlocks] = useState({}); // Store blocks for selected district


//     // Fetch centers data


//     //Logos
// const logo = "/haryana.png";
// const logo2 = "/admitBuniyaLogo.png";

//     const fetchCenters = async () => {

//         try {

//             const response = await GetCentersDataByExaminationAndExamType();


//             console.log(response.data)


//         } catch (error) {
//             console.error("Error fetching centers", error);

//         }
//     };


//     // Fetch centers data
//     const FetchAttendanceData = async () => {

//         try {

//             const reqBody = {
//                 L1ExaminationCenter: L1ExaminationCenter
//             }

//             const response = await GetAttendanceSheetData();


//             console.log(response.data)


//         } catch (error) {
//             console.error("Error fetching centers", error);

//         }
//     };

//     useEffect(() => {

//         fetchCenters();
//     }, []);





//     return (
//         <h1>
//             hellooo
//         </h1>
//     )
// }




// import React, { useEffect, useState, useMemo } from "react";
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
//   FormControl,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import JSZip from "jszip";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { GetCentersDataByExaminationAndExamType } from "../../services/ExaminationVenue/ExaminationVenueServices.js";
// import { FaDownload, FaFileExcel, FaInfoCircle, FaQuestionCircle, FaFilter } from "react-icons/fa";
// import { GetAttendanceSheetData } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

// export const AttendanceSheet = () => {
//   const [centers, setCenters] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [blocks, setBlocks] = useState([]);
//   const [filteredCenters, setFilteredCenters] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [studentsPerRoom, setStudentsPerRoom] = useState(24);

//   //Logos
//   const logo = "/haryana.png";
//   const logo2 = "/admitBuniyaLogo.png";

//   // Fetch centers data
//   const fetchCenters = async () => {
//     setLoading(true);
//     try {
//       const response = await GetCentersDataByExaminationAndExamType();
//       if (response.data) {
//         setCenters(response.data);
        
//         // Extract unique districts
//         const uniqueDistricts = Array.from(
//           new Set(response.data.map(item => item.districtId))
//         ).map(id => {
//           const center = response.data.find(item => item.districtId === id);
//           return {
//             value: center.districtId,
//             label: center.districtName,
//             districtId: center.districtId
//           };
//         });
        
//         setDistricts(uniqueDistricts);
//       }
//     } catch (error) {
//       console.error("Error fetching centers", error);
//       setError("Failed to fetch centers data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch attendance data based on selected center
//   const fetchAttendanceData = async () => {
//     if (!selectedCenter) {
//       setError("Please select a center first");
//       return;
//     }
    
//     setLoadingData(true);
//     try {
//       const reqBody = {
//         L1ExaminationCenter: selectedCenter.label
//       };
      
//       const response = await GetAttendanceSheetData(reqBody);
//       if (response.data) {
//         // Sort by rollNumber
//         const sortedData = response.data.sort((a, b) => {
//           const rollA = a.rollNumber || "";
//           const rollB = b.rollNumber || "";
//           return rollA.localeCompare(rollB);
//         });
        
//         setAttendanceData(sortedData);
//         setShowPreview(true);
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data", error);
//       setError("Failed to fetch attendance data");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   // Handle district selection
//   const handleDistrictChange = (selectedOption) => {
//     setSelectedDistrict(selectedOption);
//     setSelectedBlock(null);
//     setSelectedCenter(null);
    
//     if (selectedOption) {
//       // Filter blocks for selected district
//       const districtBlocks = centers
//         .filter(center => center.districtId === selectedOption.value)
//         .map(center => ({
//           value: center.blockId,
//           label: center.blockName,
//           blockId: center.blockId
//         }));
      
//       // Remove duplicate blocks
//       const uniqueBlocks = Array.from(
//         new Map(districtBlocks.map(item => [item.value, item])).values()
//       );
      
//       setBlocks(uniqueBlocks);
//     } else {
//       setBlocks([]);
//       setFilteredCenters([]);
//     }
//   };

//   // Handle block selection
//   const handleBlockChange = (selectedOption) => {
//     setSelectedBlock(selectedOption);
//     setSelectedCenter(null);
    
//     if (selectedOption && selectedDistrict) {
//       // Filter centers for selected block and district
//       const blockCenters = centers
//         .filter(center => 
//           center.districtId === selectedDistrict.value && 
//           center.blockId === selectedOption.value
//         )
//         .map(center => ({
//           value: center._id,
//           label: center.examinationVenue,
//           venueCode: center.examinationVenueCode,
//           capacity: center.capacity,
//           venueSequence: center.examinationVenueSequenceInBlock
//         }));
      
//       setFilteredCenters(blockCenters);
//     } else {
//       setFilteredCenters([]);
//     }
//   };

//   // Generate attendance PDFs
//   const generateAttendancePDFs = async () => {
//     if (attendanceData.length === 0) {
//       setError("No attendance data available");
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const zip = new JSZip();
//       const centerName = selectedCenter.label.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
      
//       // Group students into rooms (24 students per room)
//       const rooms = [];
//       for (let i = 0; i < attendanceData.length; i += studentsPerRoom) {
//         rooms.push(attendanceData.slice(i, i + studentsPerRoom));
//       }
      
//       // Generate PDF for each room
//       for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
//         const roomStudents = rooms[roomIndex];
//         const roomNumber = roomIndex + 1;
        
//         // Create PDF
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const pageWidth = pdf.internal.pageSize.getWidth();
        
//         // Add logos
//         if (logo) {
//           pdf.addImage(logo, 'PNG', 10, 10, 20, 20);
//         }
        
//         if (logo2) {
//           pdf.addImage(logo2, 'PNG', pageWidth - 30, 10, 20, 20);
//         }
        
//         // Add header
//         pdf.setFontSize(16);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("ATTENDANCE SHEET", pageWidth / 2, 20, { align: 'center' });
        
//         pdf.setFontSize(12);
//         pdf.setFont("helvetica", "normal");
//         pdf.text(`Center: ${selectedCenter.label}`, pageWidth / 2, 30, { align: 'center' });
//         pdf.text(`Room No: ${roomNumber}`, pageWidth / 2, 36, { align: 'center' });
//         pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 42, { align: 'center' });
        
//         // Prepare table data
//         const tableData = roomStudents.map((student, index) => [
//           index + 1,
//           student.rollNumber || '',
//           student.srn || '',
//           student.name || '',
//           student.father || '',
//           student.gender || '',
//           student.school || '',
//           '', // Paper code (empty)
//           '', // Signature (empty)
//         ]);
        
//         // Add table
//         pdf.autoTable({
//           startY: 50,
//           head: [['S.No', 'Roll No', 'SRN', 'Name', "Father's Name", 'Gender', 'School', 'Paper Code', 'Signature']],
//           body: tableData,
//           headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10 },
//           bodyStyles: { fontSize: 9 },
//           columnStyles: {
//             0: { cellWidth: 10 }, // S.No
//             1: { cellWidth: 20 }, // Roll No
//             2: { cellWidth: 20 }, // SRN
//             3: { cellWidth: 30 }, // Name
//             4: { cellWidth: 30 }, // Father
//             5: { cellWidth: 15 }, // Gender
//             6: { cellWidth: 40 }, // School
//             7: { cellWidth: 20 }, // Paper Code
//             8: { cellWidth: 20 }, // Signature
//           },
//           margin: { left: 10, right: 10 },
//           theme: 'grid',
//         });
        
//         // Add footer
//         const pageCount = pdf.getNumberOfPages();
//         for (let i = 1; i <= pageCount; i++) {
//           pdf.setPage(i);
//           pdf.setFontSize(10);
//           pdf.text(
//             `Page ${i} of ${pageCount}`,
//             pageWidth / 2,
//             pdf.internal.pageSize.getHeight() - 10,
//             { align: 'center' }
//           );
//         }
        
//         // Add PDF to zip
//         const pdfBlob = pdf.output('blob');
//         zip.file(`Attendance_${centerName}_Room_${roomNumber}.pdf`, pdfBlob);
//       }
      
//       // Generate zip file
//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       saveAs(zipBlob, `Attendance_Sheets_${centerName}.zip`);
      
//     } catch (error) {
//       console.error("Error generating PDFs", error);
//       setError("Failed to generate attendance sheets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Download single PDF (preview)
//   const downloadPreviewPDF = () => {
//     if (attendanceData.length === 0) return;
    
//     const pdf = new jsPDF('l', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
    
//     // Add logos
//     if (logo) {
//       pdf.addImage(logo, 'PNG', 10, 10, 20, 20);
//     }
    
//     if (logo2) {
//       pdf.addImage(logo2, 'PNG', pageWidth - 30, 10, 20, 20);
//     }
    
//     // Add header
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "bold");
//     pdf.text("ATTENDANCE SHEET - PREVIEW", pageWidth / 2, 20, { align: 'center' });
    
//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`Center: ${selectedCenter.label}`, pageWidth / 2, 30, { align: 'center' });
//     pdf.text(`Total Students: ${attendanceData.length}`, pageWidth / 2, 36, { align: 'center' });
//     pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 42, { align: 'center' });
    
//     // Prepare table data (show only first 50 for preview)
//     const previewData = attendanceData.slice(0, 50).map((student, index) => [
//       index + 1,
//       student.rollNumber || '',
//       student.srn || '',
//       student.name || '',
//       student.father || '',
//       student.gender || '',
//       student.school || '',
//       '', // Paper code
//       '', // Signature
//     ]);
    
//     // Add table
//     pdf.autoTable({
//       startY: 50,
//       head: [['S.No', 'Roll No', 'SRN', 'Name', "Father's Name", 'Gender', 'School', 'Paper Code', 'Signature']],
//       body: previewData,
//       headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10 },
//       bodyStyles: { fontSize: 9 },
//       columnStyles: {
//         0: { cellWidth: 10 },
//         1: { cellWidth: 20 },
//         2: { cellWidth: 20 },
//         3: { cellWidth: 30 },
//         4: { cellWidth: 30 },
//         5: { cellWidth: 15 },
//         6: { cellWidth: 40 },
//         7: { cellWidth: 20 },
//         8: { cellWidth: 20 },
//       },
//       margin: { left: 10, right: 10 },
//       theme: 'grid',
//     });
    
//     // Add note if data truncated
//     if (attendanceData.length > 50) {
//       pdf.setFontSize(10);
//       pdf.text(
//         `Note: Showing 50 of ${attendanceData.length} students. Full data available in zip download.`,
//         10,
//         pdf.lastAutoTable.finalY + 10
//       );
//     }
    
//     pdf.save(`Attendance_Preview_${selectedCenter.label.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.pdf`);
//   };

//   useEffect(() => {
//     fetchCenters();
//   }, []);

//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
//           <h5 className="mb-0">
//             <FaFilter className="me-2" />
//             Attendance Sheet Generator
//           </h5>
//           <Badge bg="light" text="dark">
//             Level 1 Examination
//           </Badge>
//         </Card.Header>
        
//         <Card.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               <FaInfoCircle className="me-2" />
//               {error}
//             </Alert>
//           )}
          
//           <Row className="mb-4">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Select District</Form.Label>
//                 <Select
//                   options={districts}
//                   value={selectedDistrict}
//                   onChange={handleDistrictChange}
//                   placeholder="Select District..."
//                   isClearable
//                   isLoading={loading}
//                 />
//               </Form.Group>
//             </Col>
            
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Select Block</Form.Label>
//                 <Select
//                   options={blocks}
//                   value={selectedBlock}
//                   onChange={handleBlockChange}
//                   placeholder="Select Block..."
//                   isClearable
//                   isDisabled={!selectedDistrict}
//                   isLoading={loading}
//                 />
//               </Form.Group>
//             </Col>
            
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Select Examination Center</Form.Label>
//                 <Select
//                   options={filteredCenters}
//                   value={selectedCenter}
//                   onChange={setSelectedCenter}
//                   placeholder="Select Center..."
//                   isClearable
//                   isDisabled={!selectedBlock}
//                   isLoading={loading}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
          
//           <div className="d-flex justify-content-center mb-4">
//             <Button 
//               variant="primary" 
//               onClick={fetchAttendanceData}
//               disabled={!selectedCenter || loadingData}
//               className="px-5"
//             >
//               {loadingData ? (
//                 <>
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Loading Attendance Data...
//                 </>
//               ) : (
//                 <>
//                   <FaFilter className="me-2" />
//                   Get Attendance Sheet
//                 </>
//               )}
//             </Button>
//           </div>
          
//           {showPreview && attendanceData.length > 0 && (
//             <>
//               <Card className="mb-4">
//                 <Card.Header className="bg-light">
//                   <h6 className="mb-0">Preview - {attendanceData.length} Students Found</h6>
//                 </Card.Header>
//                 <Card.Body>
//                   <div className="table-responsive">
//                     <Table striped bordered hover size="sm">
//                       <thead className="bg-light">
//                         <tr>
//                           <th>S.No</th>
//                           <th>Roll No</th>
//                           <th>SRN</th>
//                           <th>Name</th>
//                           <th>Father's Name</th>
//                           <th>Gender</th>
//                           <th>School</th>
//                           <th>Image</th>
//                           <th>Paper Code</th>
//                           <th>Signature</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {attendanceData.slice(0, 10).map((student, index) => (
//                           <tr key={student._id}>
//                             <td>{index + 1}</td>
//                             <td className="fw-semibold">{student.rollNumber}</td>
//                             <td>{student.srn}</td>
//                             <td>{student.name}</td>
//                             <td>{student.father}</td>
//                             <td>{student.gender}</td>
//                             <td className="small">{student.school}</td>
//                             <td>
//                               {student.imageUrl ? (
//                                 <img 
//                                   src={student.imageUrl} 
//                                   alt={student.name}
//                                   style={{ width: '50px', height: '50px', objectFit: 'cover' }}
//                                   className="rounded border"
//                                 />
//                               ) : (
//                                 <span className="text-muted">No Image</span>
//                               )}
//                             </td>
//                             <td className="text-center">
//                               <FormControl 
//                                 size="sm" 
//                                 style={{ width: '80px' }}
//                                 placeholder="Code"
//                               />
//                             </td>
//                             <td className="text-center">
//                               <div style={{ height: '30px', borderBottom: '1px solid #000' }}></div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
                  
//                   {attendanceData.length > 10 && (
//                     <div className="text-center mt-3">
//                       <Badge bg="info">
//                         Showing 10 of {attendanceData.length} students
//                       </Badge>
//                     </div>
//                   )}
//                 </Card.Body>
//               </Card>
              
//               <Row className="mb-3">
//                 <Col md={4}>
//                   <Form.Group>
//                     <Form.Label>
//                       Students per Room <FaQuestionCircle className="text-muted ms-1" title="Number of students per room in PDF" />
//                     </Form.Label>
//                     <FormControl 
//                       type="number"
//                       value={studentsPerRoom}
//                       onChange={(e) => setStudentsPerRoom(parseInt(e.target.value) || 24)}
//                       min="1"
//                       max="100"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
              
//               <div className="d-flex justify-content-between">
//                 <Button 
//                   variant="outline-primary"
//                   onClick={downloadPreviewPDF}
//                   disabled={loading}
//                 >
//                   <FaFileExcel className="me-2" />
//                   Download Preview PDF
//                 </Button>
                
//                 <Button 
//                   variant="success"
//                   onClick={generateAttendancePDFs}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <Spinner animation="border" size="sm" className="me-2" />
//                       Generating PDFs...
//                     </>
//                   ) : (
//                     <>
//                       <FaDownload className="me-2" />
//                       Download All Attendance Sheets (ZIP)
//                     </>
//                   )}
//                 </Button>
//               </div>
              
//               <Alert variant="info" className="mt-3">
//                 <FaInfoCircle className="me-2" />
//                 PDFs will be generated with {studentsPerRoom} students per room. Each PDF will contain room number and center details.
//                 Total rooms: {Math.ceil(attendanceData.length / studentsPerRoom)}
//               </Alert>
//             </>
//           )}
          
//           {showPreview && attendanceData.length === 0 && (
//             <Alert variant="warning" className="text-center">
//               <FaInfoCircle className="me-2" />
//               No attendance data found for the selected center.
//             </Alert>
//           )}
//         </Card.Body>
        
//         <Card.Footer className="text-muted small">
//           <div className="d-flex justify-content-between">
//             <div>
//               Note: Attendance sheets will be sorted by Roll Number
//             </div>
//             <div>
//               {selectedCenter && (
//                 <span>Selected: {selectedCenter.label}</span>
//               )}
//             </div>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };







//Below are the main codes..........................................

// //Level 1 Attendance sheet code

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
//   FormControl,
// } from "react-bootstrap";
// import Select from "react-select";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { FaDownload, FaFileExcel, FaInfoCircle, FaFilter } from "react-icons/fa";
// import { GetCentersDataByExaminationAndExamType } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetData } from "../../services/StudentRegistrationServices/StudentRegistrationService";
// import { updateExaminationCentersAndCapacity } from "../../services/ExaminationVenue/ExaminationVenueServices";



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

// export const AttendanceSheet = () => {
//   const [centers, setCenters] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [blocks, setBlocks] = useState([]);
//   const [filteredCenters, setFilteredCenters] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [studentsPerRoom, setStudentsPerRoom] = useState(24);

//   const logo = "/haryana.png";
//   const logo2 = "/admitBuniyaLogo.png";

//   /* ---------------- FETCH CENTERS ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamType();
//         setCenters(res.data || []);

//         const uniqueDistricts = [
//           ...new Map(
//             res.data.map((d) => [
//               d.districtId,
//               { value: d.districtId, label: d.districtName },
//             ])
//           ).values(),
//         ];
//         setDistricts(uniqueDistricts);
//       } catch {
//         setError("Failed to fetch centers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCenters();
//   }, []);

//   /* ---------------- FETCH ATTENDANCE ---------------- */
//   const fetchAttendanceData = async () => {
//     if (!selectedCenter) return setError("Please select a center");
//     setLoadingData(true);
//     setError(null);
//     try {
//       const res = await GetAttendanceSheetData({
//         L1ExaminationCenter: selectedCenter.label,
//       });

//       const sorted = (res.data || []).sort((a, b) =>
//         (a.rollNumber || "").localeCompare(b.rollNumber || "")
//       );

//       setAttendanceData(sorted);
//       setShowPreview(true);
//     } catch {
//       setError("Failed to fetch attendance data");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   /* ---------------- PDF TABLE DRAW ---------------- */
//   const drawTable = async (pdf, students, roomNumber = null, startY = 45) => {
//     // Prepare body data with placeholder for images
//     const body = students.map((s, i) => [
//       i + 1,
//       s.rollNumber || "",
//       s.srn || "",
//       s.name || "",
//       s.father || "",
//       s.gender || "",
//       s.school || "",
//       "", // Empty placeholder for image - will be added in didDrawCell
//       "",
//       "",
//     ]);

//     // Preload all images for this room
//     const imagePromises = students.map((student) => 
//       student.imageUrl ? getCachedImage(student.imageUrl) : Promise.resolve(null)
//     );
//     const imageData = await Promise.all(imagePromises);

//     pdf.autoTable({
//       startY,
//       head: [[
//         "S.No",
//         "Roll No",
//         "SRN",
//         "Name",
//         "Father",
//         "Gender",
//         "School",
//         "Photo",
//         "Paper Code",
//         "Signature",
//       ]],
//       body,
//       theme: "grid",
//       rowPageBreak: "auto",
//       margin: { top: startY, bottom: 15, left: 10, right: 10 },
//       styles: { 
//         fontSize: 9, 
//         cellPadding: 2,
//         overflow: "linebreak",
//         cellWidth: "wrap"
//       },
//       headStyles: { 
//         fillColor: [41, 128, 185], 
//         textColor: 255,
//         fontStyle: "bold"
//       },
//       columnStyles: {
//         0: { cellWidth: 12 },
//         1: { cellWidth: 25 },
//         2: { cellWidth: 25 },
//         3: { cellWidth: 35 },
//         4: { cellWidth: 35 },
//         5: { cellWidth: 18 },
//         6: { cellWidth: 55 },
//         7: { cellWidth: 25, cellHeight: 25 },
//         8: { cellWidth: 25 },
//         9: { cellWidth: 30 },
//       },
//       didDrawPage: (data) => {
//         // Add page number
//         const pageCount = pdf.internal.getNumberOfPages();
//         pdf.setFontSize(10);
//         pdf.text(
//           `Page ${data.pageNumber} of ${pageCount}`,
//           data.settings.margin.left,
//           pdf.internal.pageSize.height - 10
//         );
//       },
//       didParseCell: (data) => {
//         if (data.section === "body" && data.column.index === 7) {
//           // Store image data in cell properties
//           const rowIndex = data.row.index;
//           data.cell.imageData = imageData[rowIndex];
//         }
//       },
//       willDrawCell: (data) => {
//         // Skip drawing text for image column
//         if (data.section === "body" && data.column.index === 7) {
//           data.cell.text = "";
//         }
//       },
//       didDrawCell: (data) => {
//         // Draw image in the photo column
//         if (data.section === "body" && data.column.index === 7 && data.cell.imageData) {
//           try {
//             const imgWidth = data.cell.width - 2;
//             const imgHeight = data.cell.height - 2;
//             const xPos = data.cell.x + 2;
//             const yPos = data.cell.y + 2;
            
//             pdf.addImage(
//               data.cell.imageData,
//               "JPEG",
//               xPos,
//               yPos,
//               imgWidth,
//               imgHeight
//             );
//           } catch (error) {
//             console.error("Error adding image to PDF:", error);
//             // Draw placeholder if image fails
//             pdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
//             pdf.text("No Image", data.cell.x + 5, data.cell.y + data.cell.height / 2);
//           }
//         } else if (data.section === "body" && data.column.index === 7) {
//           // Draw empty cell border
//           pdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
//           pdf.text("No Image", data.cell.x + 5, data.cell.y + data.cell.height / 2);
//         }
//       },
//     });
//   };

//   /* ---------------- DOWNLOAD ALL PDFs ---------------- */
//   const generateAttendancePDFs = async () => {
//     if (!attendanceData.length) {
//       setError("No attendance data available");
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const zip = new JSZip();
//       const rooms = [];

//       // Split students into rooms
//       for (let i = 0; i < attendanceData.length; i += studentsPerRoom) {
//         rooms.push(attendanceData.slice(i, i + studentsPerRoom));
//       }

//       // Clear image cache for new generation
//       imageCache.clear();

//       // Generate PDF for each room
//       for (let r = 0; r < rooms.length; r++) {
//         const pdf = new jsPDF("l", "mm", "a4");
//         const w = pdf.internal.pageSize.getWidth();
//         const h = pdf.internal.pageSize.getHeight();

//         // Add logos
//         if (logo) {
//           try {
//             pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//           } catch (e) {
//             console.warn("Could not load main logo");
//           }
//         }

//         if (logo2) {
//           try {
//             pdf.addImage(logo2, "PNG", w - 30, 8, 20, 20);
//           } catch (e) {
//             console.warn("Could not load secondary logo");
//           }
//         }

//         // Add header text

//          pdf.setFontSize(16);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("MISSION BUNIYAAD ENTRANCE EXAMINATION LEVEL-1 (2026-28)", w / 2, 18, { align: "center" });
        
        

//         pdf.setFontSize(16);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
        
//         pdf.setFontSize(11);
//         pdf.setFont("helvetica", "normal");
//         pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
//         pdf.text(`Room No: ${r + 1}`, w / 2, 32, { align: "center" });
//         // pdf.text(`Total Students: ${rooms[r].length}`, w / 2, 38, { align: "center" });

//         // Draw table with student data
//         await drawTable(pdf, rooms[r], r + 1);

//         // Add footer note
//         pdf.setFontSize(9);
//         pdf.text(
//           "Note: Students must sign in the signature column after verification",
//           10,
//           h - 5
//         );

//         // Add to zip
//         zip.file(`Attendance_Room_${r + 1}.pdf`, pdf.output("blob"));
//       }

//       // Generate and download zip
//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       saveAs(zipBlob, `AttendanceSheets_${selectedCenter?.label || "Center"}.zip`);
      
//       setError(null);
//     } catch (error) {
//       console.error("PDF generation failed:", error);
//       setError("PDF generation failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- PREVIEW PDF ---------------- */
//   const downloadPreviewPDF = async () => {
//     if (!attendanceData.length) {
//       setError("No attendance data available for preview");
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const pdf = new jsPDF("l", "mm", "a4");
//       const w = pdf.internal.pageSize.getWidth();
//       const h = pdf.internal.pageSize.getHeight();

//       // Add logos
//       if (logo) {
//         try {
//           pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//         } catch (e) {
//           console.warn("Could not load main logo");
//         }
//       }

//       if (logo2) {
//         try {
//           pdf.addImage(logo2, "PNG", w - 30, 8, 20, 20);
//         } catch (e) {
//           console.warn("Could not load secondary logo");
//         }
//       }

//       // Add header
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("ATTENDANCE SHEET PREVIEW", w / 2, 18, { align: "center" });
      
//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 26, { align: "center" });
//       pdf.text(`Showing first 50 students of ${attendanceData.length}`, w / 2, 32, { align: "center" });

//       // Draw table with first 50 students
//       await drawTable(pdf, attendanceData.slice(0, 50));

//       // Add footer
//       pdf.setFontSize(9);
//       pdf.text(
//         "Note: This is a preview. Use Download ZIP for complete attendance sheets.",
//         10,
//         h - 5
//       );

//       pdf.save(`Attendance_Preview_${selectedCenter?.label || "Center"}.pdf`);
//       setError(null);
//     } catch (error) {
//       console.error("Preview PDF generation failed:", error);
//       setError("Preview PDF generation failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };



// //blank pdf format



// /* ---------------- DOWNLOAD BLANK ATTENDANCE TEMPLATE ---------------- */
// const downloadBlankAttendanceTemplate = async () => {
//   try {
//     const pdf = new jsPDF("l", "mm", "a4");
//     const w = pdf.internal.pageSize.getWidth();

//     // Logos
//     if (logo) {
//       try {
//         pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//       } catch {}
//     }

//     if (logo2) {
//       try {
//         pdf.addImage(logo2, "PNG", w - 30, 8, 20, 20);
//       } catch {}
//     }

//     // Header
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(
//       "MISSION BUNIYAAD ENTRANCE EXAMINATION LEVEL-1 (2026-28)",
//       w / 2,
//       18,
//       { align: "center" }
//     );

//     pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });

//     pdf.setFontSize(11);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(
//       "Center: ________________________________",
//       w / 2,
//       34,
//       { align: "center" }
//     );

//     // Blank rows (NO serial numbers)
//     const blankRows = Array.from({ length: studentsPerRoom }).map(() => [
//       "", // S.No (manual)
//       "", // SRN
//       "", // Name
//       "", // Father
//       "", // Gender
//       "", // School
//       "", // Photo
//       "", // Paper Code
//       "", // Signature
//     ]);

//     pdf.autoTable({
//       startY: 45,
//       head: [[
//         "S.No",
//         "SRN",
//         "Name",
//         "Father Name",
//         "Gender",
//         "School",
//         "Photo",
//         "Paper Code",
//         "Signature",
//       ]],
//       body: blankRows,
//       theme: "grid",
//       styles: {
//         fontSize: 9,
//         cellPadding: 4,
//         minCellHeight: 18,
//       },
//       columnStyles: {
//         0: { cellWidth: 15 },
//         1: { cellWidth: 28 },
//         2: { cellWidth: 38 },
//         3: { cellWidth: 38 },
//         4: { cellWidth: 20 },
//         5: { cellWidth: 60 },
//         6: { cellWidth: 25 },
//         7: { cellWidth: 30 },
//         8: { cellWidth: 35 },
//       },
//     });

//     pdf.save("Attendance_Blank_Template.pdf");
//   } catch (err) {
//     console.error("Blank template generation failed", err);
//   }
// };



//   /* ---------------- UI ---------------- */
//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex align-items-center">
//           <FaFilter className="me-2" /> 
//           <h5 className="mb-0">Attendance Sheet</h5>
//         </Card.Header>

//         <Card.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               <FaInfoCircle className="me-2" />
//               {error}
//             </Alert>
//           )}

//           <Row className="mb-4">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>District</Form.Label>
//                 <Select
//                   placeholder="Select District"
//                   options={districts}
//                   isClearable
//                   onChange={(d) => {
//                     setSelectedDistrict(d);
//                     setSelectedBlock(null);
//                     setSelectedCenter(null);
//                     setFilteredCenters([]);
//                     setShowPreview(false);
                    
//                     if (d) {
//                       const blockData = centers
//                         .filter((c) => c.districtId === d.value)
//                         .map((c) => ({ value: c.blockId, label: c.blockName }));
                      
//                       const uniqueBlocks = [
//                         ...new Map(
//                           blockData.map(item => [item.value, item])
//                         ).values()
//                       ];
//                       setBlocks(uniqueBlocks);
//                     } else {
//                       setBlocks([]);
//                     }
//                   }}
//                   value={selectedDistrict}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Block</Form.Label>
//                 <Select
//                   placeholder="Select Block"
//                   options={blocks}
//                   isClearable
//                   isDisabled={!selectedDistrict}
//                   onChange={(b) => {
//                     setSelectedBlock(b);
//                     setSelectedCenter(null);
//                     setShowPreview(false);
                    
//                     if (b && selectedDistrict) {
//                       const centerData = centers
//                         .filter(
//                           (c) =>
//                             c.blockId === b.value &&
//                             c.districtId === selectedDistrict.value
//                         )
//                         .map((c) => ({ 
//                           value: c._id, 
//                           label: c.examinationVenue,
//                           capacity: c.capacity || 0
//                         }));
//                       setFilteredCenters(centerData);
//                     } else {
//                       setFilteredCenters([]);
//                     }
//                   }}
//                   value={selectedBlock}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Examination Center</Form.Label>
//                 <Select
//                   placeholder="Select Center"
//                   options={filteredCenters}
//                   isClearable
//                   isDisabled={!selectedBlock}
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
//             {/* <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Students per Room</Form.Label>
//                 <FormControl
//                   type="number"
//                   min="1"
//                   max="50"
//                   value={studentsPerRoom}
//                   onChange={(e) => setStudentsPerRoom(parseInt(e.target.value) || 24)}
//                 />
//                 <Form.Text className="text-muted">
//                   Default: 24 students per room
//                 </Form.Text>
//               </Form.Group>
//             </Col> */}
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
//                   Loading Attendance Data...
//                 </>
//               ) : (
//                 "Get Attendance Data"
//               )}
//             </Button>
//           </div>

//           {showPreview && attendanceData.length > 0 && (
//             <>
//               <Card className="mb-4">
//                 <Card.Header className="bg-light">
//                   <h6 className="mb-0">
//                     Preview (Showing first 10 of {attendanceData.length} students)
//                     <Badge bg="info" className="ms-2">
//                       {Math.ceil(attendanceData.length / studentsPerRoom)} rooms needed
//                     </Badge>
//                   </h6>
//                 </Card.Header>
//                 <Card.Body>
//                   <div className="table-responsive">
//                     <Table bordered hover size="sm" className="mb-0">
//                       <thead className="table-primary">
//                         <tr>
//                           <th>S.No</th>
//                           <th>Roll No</th>
//                           <th>SRN</th>
//                           <th>Name</th>
//                           <th>Father</th>
//                           <th>Gender</th>
//                           <th>School</th>
//                           <th>Photo</th>
//                           <th>Paper Code</th>
//                           <th>Signature</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {attendanceData.slice(0, 10).map((s, i) => (
//                           <tr key={i}>
//                             <td className="text-center">{i + 1}</td>
//                             <td><strong>{s.rollNumber}</strong></td>
//                             <td>{s.srn || "—"}</td>
//                             <td>{s.name || "—"}</td>
//                             <td>{s.father || "—"}</td>
//                             <td className="text-center">
//                               <Badge bg={s.gender === "Male" ? "primary" : "danger"}>
//                                 {s.gender || "—"}
//                               </Badge>
//                             </td>
//                             <td className="small">{s.school || "—"}</td>
//                             <td className="text-center">
//                               {s.imageUrl ? (
//                                 <img
//                                   src={s.imageUrl}
//                                   alt="Student"
//                                   width={40}
//                                   height={40}
//                                   style={{ 
//                                     objectFit: "cover", 
//                                     borderRadius: "4px",
//                                     border: "1px solid #ddd"
//                                   }}
//                                   onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlZWVlZWUiLz48cGF0aCBkPSJNMjAgMTNDMjIgMjAgMjIgMjYgMjAgMzNDMTggMjYgMTggMjAgMjAgMTNaIiBmaWxsPSIjOTk5OTk5Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIxNCIgcj0iNCIgZmlsbD0iIzk5OTk5OSIvPjwvc3ZnPg==";
//                                   }}
//                                 />
//                               ) : (
//                                 <Badge bg="secondary">No Image</Badge>
//                               )}
//                             </td>
//                             <td className="text-center">—</td>
//                             <td className="text-center">—</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
//                 </Card.Body>
//               </Card>

//               <div className="d-flex justify-content-center gap-3 mb-4">
//                 {/* <Button 
//                   onClick={downloadPreviewPDF} 
//                   disabled={loading}
//                   variant="outline-primary"
//                   className="d-flex align-items-center"
//                 >
//                   <FaFileExcel className="me-2" />
//                   {loading ? "Generating..." : "Download Preview PDF"}
//                 </Button> */}

//                   <Button
//   onClick={downloadBlankAttendanceTemplate}
//   variant="outline-secondary"
//   className="d-flex align-items-center"
// >
//   <FaDownload className="me-2" />
//   Download Blank Format
// </Button>


//                 <Button 
//                   onClick={generateAttendancePDFs} 
//                   disabled={loading || attendanceData.length === 0}
//                   variant="success"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   {loading ? "Generating ZIP..." : "Download All PDFs as ZIP"}
//                 </Button>
//               </div>

//               <Alert variant="info" className="mb-0">
//                 <FaInfoCircle className="me-2" />
//                 <strong>Note:</strong> The ZIP file will contain separate PDF files for each room. 
//                 Each PDF will include student photos and be formatted for printing.
//               </Alert>
//             </>
//           )}

//           {showPreview && attendanceData.length === 0 && (
//             <Alert variant="warning" className="text-center">
//               <FaInfoCircle className="me-2" />
//               No attendance data found for the selected center.
//             </Alert>
//           )}
//         </Card.Body>
        
//         <Card.Footer className="text-muted small">
//           <div className="d-flex justify-content-between">
//             <span>Total Centers: {centers.length}</span>
//             <span>Attendance Sheet Generator v1.0</span>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };






















//Level 1 Attendance sheet code

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
  FormControl,
} from "react-bootstrap";
import Select from "react-select";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload, FaFileExcel, FaInfoCircle, FaFilter } from "react-icons/fa";
import { GetCentersDataByExaminationAndExamType } from "../../services/ExaminationVenue/ExaminationVenueServices";
import { GetAttendanceSheetData } from "../../services/StudentRegistrationServices/StudentRegistrationService";
import { updateExaminationCentersAndCapacity } from "../../services/ExaminationVenue/ExaminationVenueServices";



/* ---------------- IMAGE LOADER ---------------- */
const loadImage = (url) =>
  new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });

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

export const AttendanceSheet = () => {
  const [centers, setCenters] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [studentsPerRoom, setStudentsPerRoom] = useState(24);

  const logo = "/haryana.png";
  const logo2 = "/admitBuniyaLogo.png";

  /* ---------------- FETCH CENTERS ---------------- */
  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      try {
        const res = await GetCentersDataByExaminationAndExamType();
        setCenters(res.data || []);

        const uniqueDistricts = [
          ...new Map(
            res.data.map((d) => [
              d.districtId,
              { value: d.districtId, label: d.districtName },
            ])
          ).values(),
        ];
        setDistricts(uniqueDistricts);
      } catch {
        setError("Failed to fetch centers");
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  /* ---------------- FETCH ATTENDANCE ---------------- */
  const fetchAttendanceData = async () => {
    if (!selectedCenter) return setError("Please select a center");
    setLoadingData(true);
    setError(null);
    try {
      const res = await GetAttendanceSheetData({
        L2ExaminationCenter: selectedCenter.label,
      });

      const sorted = (res.data || []).sort((a, b) =>
        (a.rollNumber || "").localeCompare(b.rollNumber || "")
      );

      setAttendanceData(sorted);
      setShowPreview(true);
    } catch {
      setError("Failed to fetch attendance data");
    } finally {
      setLoadingData(false);
    }
  };

  /* ---------------- PDF TABLE DRAW ---------------- */
  const drawTable = async (pdf, students, roomNumber = null, startY = 45) => {
    // Prepare body data with placeholder for images
    const body = students.map((s, i) => [
      i + 1,
      s.rollNumber || "",
      s.srn || "",
      s.name || "",
      s.father || "",
      s.gender || "",
      s.school || "",
      "", // Empty placeholder for image - will be added in didDrawCell
      "",
      "",
    ]);

    // Preload all images for this room
    const imagePromises = students.map((student) => 
      student.imageUrl ? getCachedImage(student.imageUrl) : Promise.resolve(null)
    );
    const imageData = await Promise.all(imagePromises);

    pdf.autoTable({
      startY,
      head: [[
        "S.No",
        "Roll No",
        "SRN",
        "Name",
        "Father",
        "Gender",
        "School",
        "Photo",
        "Paper Code",
        "Signature",
      ]],
      body,
      theme: "grid",
      rowPageBreak: "auto",
      margin: { top: startY, bottom: 15, left: 10, right: 10 },
      styles: { 
        fontSize: 9, 
        cellPadding: 2,
        overflow: "linebreak",
        cellWidth: "wrap"
      },
      headStyles: { 
        fillColor: [41, 128, 185], 
        textColor: 255,
        fontStyle: "bold"
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        5: { cellWidth: 18 },
        6: { cellWidth: 55 },
        7: { cellWidth: 25, cellHeight: 25 },
        8: { cellWidth: 25 },
        9: { cellWidth: 30 },
      },
      didDrawPage: (data) => {
        // Add page number
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          pdf.internal.pageSize.height - 10
        );
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 7) {
          // Store image data in cell properties
          const rowIndex = data.row.index;
          data.cell.imageData = imageData[rowIndex];
        }
      },
      willDrawCell: (data) => {
        // Skip drawing text for image column
        if (data.section === "body" && data.column.index === 7) {
          data.cell.text = "";
        }
      },
      didDrawCell: (data) => {
        // Draw image in the photo column
        if (data.section === "body" && data.column.index === 7 && data.cell.imageData) {
          try {
            const imgWidth = data.cell.width - 2;
            const imgHeight = data.cell.height - 2;
            const xPos = data.cell.x + 2;
            const yPos = data.cell.y + 2;
            
            pdf.addImage(
              data.cell.imageData,
              "JPEG",
              xPos,
              yPos,
              imgWidth,
              imgHeight
            );
          } catch (error) {
            console.error("Error adding image to PDF:", error);
            // Draw placeholder if image fails
            pdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
            pdf.text("No Image", data.cell.x + 5, data.cell.y + data.cell.height / 2);
          }
        } else if (data.section === "body" && data.column.index === 7) {
          // Draw empty cell border
          pdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
          pdf.text("No Image", data.cell.x + 5, data.cell.y + data.cell.height / 2);
        }
      },
    });
  };

  /* ---------------- DOWNLOAD ALL PDFs ---------------- */
  const generateAttendancePDFs = async () => {
    if (!attendanceData.length) {
      setError("No attendance data available");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const zip = new JSZip();
      const rooms = [];

      // Split students into rooms
      for (let i = 0; i < attendanceData.length; i += studentsPerRoom) {
        rooms.push(attendanceData.slice(i, i + studentsPerRoom));
      }

      // Clear image cache for new generation
      imageCache.clear();

      // Generate PDF for each room
      for (let r = 0; r < rooms.length; r++) {
        const pdf = new jsPDF("l", "mm", "a4");
        const w = pdf.internal.pageSize.getWidth();
        const h = pdf.internal.pageSize.getHeight();

        // Add logos
        if (logo) {
          try {
            pdf.addImage(logo, "PNG", 10, 8, 20, 20);
          } catch (e) {
            console.warn("Could not load main logo");
          }
        }

        if (logo2) {
          try {
            pdf.addImage(logo2, "PNG", w - 30, 8, 20, 20);
          } catch (e) {
            console.warn("Could not load secondary logo");
          }
        }

        // Add header text

         pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("MISSION BUNIYAAD ENTRANCE EXAMINATION LEVEL-2 (2026-28)", w / 2, 18, { align: "center" });
        
        

        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
        pdf.text(`Room No: ${r + 1}`, w / 2, 32, { align: "center" });
        // pdf.text(`Total Students: ${rooms[r].length}`, w / 2, 38, { align: "center" });

        // Draw table with student data
        await drawTable(pdf, rooms[r], r + 1);

        // Add footer note
        pdf.setFontSize(9);
        pdf.text(
          "Note: Students must sign in the signature column after verification",
          10,
          h - 5
        );

        // Add to zip
        zip.file(`Attendance_Room_${r + 1}.pdf`, pdf.output("blob"));
      }

      // Generate and download zip
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `AttendanceSheets_${selectedCenter?.label || "Center"}.zip`);
      
      setError(null);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setError("PDF generation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PREVIEW PDF ---------------- */
  const downloadPreviewPDF = async () => {
    if (!attendanceData.length) {
      setError("No attendance data available for preview");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const pdf = new jsPDF("l", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();

      // Add logos
      if (logo) {
        try {
          pdf.addImage(logo, "PNG", 10, 8, 20, 20);
        } catch (e) {
          console.warn("Could not load main logo");
        }
      }

      if (logo2) {
        try {
          pdf.addImage(logo2, "PNG", w - 30, 8, 20, 20);
        } catch (e) {
          console.warn("Could not load secondary logo");
        }
      }

      // Add header
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("ATTENDANCE SHEET PREVIEW", w / 2, 18, { align: "center" });
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 26, { align: "center" });
      pdf.text(`Showing first 50 students of ${attendanceData.length}`, w / 2, 32, { align: "center" });

      // Draw table with first 50 students
      await drawTable(pdf, attendanceData.slice(0, 50));

      // Add footer
      pdf.setFontSize(9);
      pdf.text(
        "Note: This is a preview. Use Download ZIP for complete attendance sheets.",
        10,
        h - 5
      );

      pdf.save(`Attendance_Preview_${selectedCenter?.label || "Center"}.pdf`);
      setError(null);
    } catch (error) {
      console.error("Preview PDF generation failed:", error);
      setError("Preview PDF generation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };



//blank pdf format



/* ---------------- DOWNLOAD BLANK ATTENDANCE TEMPLATE ---------------- */
const downloadBlankAttendanceTemplate = async () => {
  try {
    const pdf = new jsPDF("l", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();

    // Logos
    if (logo) {
      try {
        pdf.addImage(logo, "PNG", 10, 8, 20, 20);
      } catch {}
    }

    if (logo2) {
      try {
        pdf.addImage(logo2, "PNG", w - 30, 8, 20, 20);
      } catch {}
    }

    // Header
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      "MISSION BUNIYAAD ENTRANCE EXAMINATION LEVEL-2 (2026-28)",
      w / 2,
      18,
      { align: "center" }
    );

    pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      "Center: ________________________________",
      w / 2,
      34,
      { align: "center" }
    );

    // Blank rows (NO serial numbers)
    const blankRows = Array.from({ length: studentsPerRoom }).map(() => [
      "", // S.No (manual)
      "", // SRN
      "", // Name
      "", // Father
      "", // Gender
      "", // School
      "", // Photo
      "", // Paper Code
      "", // Signature
    ]);

    pdf.autoTable({
      startY: 45,
      head: [[
        "S.No",
        "SRN",
        "Name",
        "Father Name",
        "Gender",
        "School",
        "Photo",
        "Paper Code",
        "Signature",
      ]],
      body: blankRows,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 4,
        minCellHeight: 18,
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 28 },
        2: { cellWidth: 38 },
        3: { cellWidth: 38 },
        4: { cellWidth: 20 },
        5: { cellWidth: 60 },
        6: { cellWidth: 25 },
        7: { cellWidth: 30 },
        8: { cellWidth: 35 },
      },
    });

    pdf.save("Attendance_Blank_Template.pdf");
  } catch (err) {
    console.error("Blank template generation failed", err);
  }
};



  /* ---------------- UI ---------------- */
  return (
    <Container fluid className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
          <FaFilter className="me-2" /> 
          <h5 className="mb-0">MB L-2 ATTENDANCE SHEETS</h5>
        </Card.Header>

        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <FaInfoCircle className="me-2" />
              {error}
            </Alert>
          )}

          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>District</Form.Label>
                <Select
                  placeholder="Select District"
                  options={districts}
                  isClearable
                  onChange={(d) => {
                    setSelectedDistrict(d);
                    setSelectedBlock(null);
                    setSelectedCenter(null);
                    setFilteredCenters([]);
                    setShowPreview(false);
                    
                    if (d) {
                      const blockData = centers
                        .filter((c) => c.districtId === d.value)
                        .map((c) => ({ value: c.blockId, label: c.blockName }));
                      
                      const uniqueBlocks = [
                        ...new Map(
                          blockData.map(item => [item.value, item])
                        ).values()
                      ];
                      setBlocks(uniqueBlocks);
                    } else {
                      setBlocks([]);
                    }
                  }}
                  value={selectedDistrict}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Block</Form.Label>
                <Select
                  placeholder="Select Block"
                  options={blocks}
                  isClearable
                  isDisabled={!selectedDistrict}
                  onChange={(b) => {
                    setSelectedBlock(b);
                    setSelectedCenter(null);
                    setShowPreview(false);
                    
                    if (b && selectedDistrict) {
                      const centerData = centers
                        .filter(
                          (c) =>
                            c.blockId === b.value &&
                            c.districtId === selectedDistrict.value
                        )
                        .map((c) => ({ 
                          value: c._id, 
                          label: c.examinationVenue,
                          capacity: c.capacity || 0
                        }));
                      setFilteredCenters(centerData);
                    } else {
                      setFilteredCenters([]);
                    }
                  }}
                  value={selectedBlock}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Examination Center</Form.Label>
                <Select
                  placeholder="Select Center"
                  options={filteredCenters}
                  isClearable
                  isDisabled={!selectedBlock}
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
            {/* <Col md={3}>
              <Form.Group>
                <Form.Label>Students per Room</Form.Label>
                <FormControl
                  type="number"
                  min="1"
                  max="50"
                  value={studentsPerRoom}
                  onChange={(e) => setStudentsPerRoom(parseInt(e.target.value) || 24)}
                />
                <Form.Text className="text-muted">
                  Default: 24 students per room
                </Form.Text>
              </Form.Group>
            </Col> */}
          </Row>

          <div className="text-center mb-4">
            <Button 
              onClick={fetchAttendanceData} 
              disabled={loadingData || !selectedCenter}
              variant="primary"
              size="lg"
              className="px-5"
            >
              {loadingData ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading Attendance Data...
                </>
              ) : (
                "Get Attendance Data"
              )}
            </Button>
          </div>

          {showPreview && attendanceData.length > 0 && (
            <>
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <h6 className="mb-0">
                    Preview (Showing first 10 of {attendanceData.length} students)
                    <Badge bg="info" className="ms-2">
                      {Math.ceil(attendanceData.length / studentsPerRoom)} rooms needed
                    </Badge>
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table bordered hover size="sm" className="mb-0">
                      <thead className="table-primary">
                        <tr>
                          <th>S.No</th>
                          <th>Roll No</th>
                          <th>SRN</th>
                          <th>Name</th>
                          <th>Father</th>
                          <th>Gender</th>
                          <th>School</th>
                          <th>Photo</th>
                          <th>Paper Code</th>
                          <th>Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.slice(0, 10).map((s, i) => (
                          <tr key={i}>
                            <td className="text-center">{i + 1}</td>
                            <td><strong>{s.rollNumber}</strong></td>
                            <td>{s.srn || "—"}</td>
                            <td>{s.name || "—"}</td>
                            <td>{s.father || "—"}</td>
                            <td className="text-center">
                              <Badge bg={s.gender === "Male" ? "primary" : "danger"}>
                                {s.gender || "—"}
                              </Badge>
                            </td>
                            <td className="small">{s.school || "—"}</td>
                            <td className="text-center">
                              {s.imageUrl ? (
                                <img
                                  src={s.imageUrl}
                                  alt="Student"
                                  width={40}
                                  height={40}
                                  style={{ 
                                    objectFit: "cover", 
                                    borderRadius: "4px",
                                    border: "1px solid #ddd"
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlZWVlZWUiLz48cGF0aCBkPSJNMjAgMTNDMjIgMjAgMjIgMjYgMjAgMzNDMTggMjYgMTggMjAgMjAgMTNaIiBmaWxsPSIjOTk5OTk5Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIxNCIgcj0iNCIgZmlsbD0iIzk5OTk5OSIvPjwvc3ZnPg==";
                                  }}
                                />
                              ) : (
                                <Badge bg="secondary">No Image</Badge>
                              )}
                            </td>
                            <td className="text-center">—</td>
                            <td className="text-center">—</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-center gap-3 mb-4">
                {/* <Button 
                  onClick={downloadPreviewPDF} 
                  disabled={loading}
                  variant="outline-primary"
                  className="d-flex align-items-center"
                >
                  <FaFileExcel className="me-2" />
                  {loading ? "Generating..." : "Download Preview PDF"}
                </Button> */}

                  <Button
  onClick={downloadBlankAttendanceTemplate}
  variant="outline-secondary"
  className="d-flex align-items-center"
>
  <FaDownload className="me-2" />
  Download Blank Format
</Button>


                <Button 
                  onClick={generateAttendancePDFs} 
                  disabled={loading || attendanceData.length === 0}
                  variant="success"
                  className="d-flex align-items-center"
                >
                  <FaDownload className="me-2" />
                  {loading ? "Generating ZIP..." : "Download All PDFs as ZIP"}
                </Button>
              </div>

              <Alert variant="info" className="mb-0">
                <FaInfoCircle className="me-2" />
                <strong>Note:</strong> The ZIP file will contain separate PDF files for each room. 
                Each PDF will include student photos and be formatted for printing.
              </Alert>
            </>
          )}

          {showPreview && attendanceData.length === 0 && (
            <Alert variant="warning" className="text-center">
              <FaInfoCircle className="me-2" />
              No attendance data found for the selected center.
            </Alert>
          )}
        </Card.Body>
        
        <Card.Footer className="text-muted small">
          <div className="d-flex justify-content-between">
            <span>Total Centers: {centers.length}</span>
            <span>Attendance Sheet Generator v1.0</span>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};