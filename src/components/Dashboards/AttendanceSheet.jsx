

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
//   const logo3 = "/vikalpalogonotitle.png";

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
//         L3ExaminationCenter: selectedCenter.label,
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
//         6: { cellWidth: 60 },
//         7: { cellWidth: 25, cellHeight: 25 },
//         8: { cellWidth: 35 },
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

//         if (logo3) {
//           try {
//             pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
//           } catch (e) {
//             console.warn("Could not load secondary logo");
//           }
//         }

//         // Add header text
//         pdf.setFontSize(16);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("MISSION BUNIYAAD ENTRANCE EXAMINATION LEVEL-3 (2026-28)", w / 2, 18, { align: "center" });
        
//         pdf.setFontSize(16);
//         pdf.setFont("helvetica", "bold");
//         pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
        
//         pdf.setFontSize(11);
//         pdf.setFont("helvetica", "normal");
//         pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
//         pdf.text(`Room No: ${r + 1}`, w / 2, 32, { align: "center" });

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

//       if (logo3) {
//         try {
//           pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
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

//     if (logo3) {
//       try {
//         pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
//       } catch {}
//     }

//     // Header
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(
//       "HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-1 (2026-28)",
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
//         2: { cellWidth: 45 },
//         3: { cellWidth: 45 },
//         4: { cellWidth: 20 },
//         5: { cellWidth: 70 },
//         6: { cellWidth: 25 },
//         7: { cellWidth: 35 },
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
//           <h5 className="mb-0"> MB L-3 ATTENDANCE SHEETS</h5>
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
//   const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [studentsPerRoom, setStudentsPerRoom] = useState(24);

//   const logo = "/haryana.png";
//   const logo2 = "/admitBuniyaLogo.png";
//   const logo3 = "/vikalpalogonotitle.png";

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

//   /* ---------------- GROUP STUDENTS BY ROOM NUMBER ---------------- */
//   const groupStudentsByRoom = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       const roomNumber = student.orientationRoomNumber || "Unassigned";
//       if (!grouped[roomNumber]) {
//         grouped[roomNumber] = [];
//       }
//       grouped[roomNumber].push(student);
//     });
    
//     // Sort students within each room: first by name, then by roll number
//     Object.keys(grouped).forEach(room => {
//       grouped[room].sort((a, b) => {
//         // First sort by name
//         const nameCompare = (a.name || "").localeCompare(b.name || "");
//         if (nameCompare !== 0) return nameCompare;
//         // Then sort by roll number
//         return (a.rollNumber || "").localeCompare(b.rollNumber || "");
//       });
//     });
    
//     // Sort room numbers numerically
//     const sortedGrouped = {};
//     Object.keys(grouped)
//       .sort((a, b) => {
//         if (a === "Unassigned") return 1;
//         if (b === "Unassigned") return -1;
//         return parseInt(a) - parseInt(b);
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
//       const res = await GetAttendanceSheetData({
//         L3ExaminationCenter: selectedCenter.label,
//       });

//       const sorted = (res.data || []).sort((a, b) =>
//         (a.rollNumber || "").localeCompare(b.rollNumber || "")
//       );

//       setAttendanceData(sorted);
      
//       // Group students by orientationRoomNumber
//       const grouped = groupStudentsByRoom(sorted);
//       setGroupedAttendanceData(grouped);
      
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
//         6: { cellWidth: 60 },
//         7: { cellWidth: 25, cellHeight: 25 },
//         8: { cellWidth: 35 },
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
      
//       // Clear image cache for new generation
//       imageCache.clear();

//       // Generate PDF for each room based on orientationRoomNumber
//       for (const [roomNumber, students] of Object.entries(groupedAttendanceData)) {
//         // Split students into sub-rooms if there are more than studentsPerRoom in a room
//         const roomGroups = [];
//         for (let i = 0; i < students.length; i += studentsPerRoom) {
//           roomGroups.push(students.slice(i, i + studentsPerRoom));
//         }
        
//         // Generate PDF for each sub-room group
//         for (let g = 0; g < roomGroups.length; g++) {
//           const pdf = new jsPDF("l", "mm", "a4");
//           const w = pdf.internal.pageSize.getWidth();
//           const h = pdf.internal.pageSize.getHeight();

//           // Add logos
//           if (logo) {
//             try {
//               pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//             } catch (e) {
//               console.warn("Could not load main logo");
//             }
//           }

//           if (logo3) {
//             try {
//               pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
//             } catch (e) {
//               console.warn("Could not load secondary logo");
//             }
//           }

//           // Add header text
//           pdf.setFontSize(16);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("MISSION BUNIYAAD ENTRANCE EXAMINATION LEVEL-3 (2026-28)", w / 2, 18, { align: "center" });
          
//           pdf.setFontSize(16);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
          
//           pdf.setFontSize(11);
//           pdf.setFont("helvetica", "normal");
//           pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
          
//           // Display room number - use orientationRoomNumber from the data
//           const displayRoomNumber = roomNumber !== "Unassigned" ? `Room No: ${roomNumber}` : "Room: Unassigned";
//           if (roomGroups.length > 1) {
//             pdf.text(`${displayRoomNumber} (Part ${g + 1} of ${roomGroups.length})`, w / 2, 32, { align: "center" });
//           } else {
//             pdf.text(displayRoomNumber, w / 2, 32, { align: "center" });
//           }

//           // Draw table with student data
//           await drawTable(pdf, roomGroups[g], roomNumber);

//           // Add footer note
//           pdf.setFontSize(9);
//           pdf.text(
//             "Note: Students must sign in the signature column after verification",
//             10,
//             h - 5
//           );

//           // Add to zip with appropriate filename
//           const fileName = roomNumber !== "Unassigned" 
//             ? `Attendance_Room_${roomNumber}${roomGroups.length > 1 ? `_Part${g + 1}` : ''}.pdf`
//             : `Attendance_Unassigned${roomGroups.length > 1 ? `_Part${g + 1}` : ''}.pdf`;
          
//           zip.file(fileName, pdf.output("blob"));
//         }
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

//       if (logo3) {
//         try {
//           pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
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

//   /* ---------------- DOWNLOAD BLANK ATTENDANCE TEMPLATE ---------------- */
//   const downloadBlankAttendanceTemplate = async () => {
//     try {
//       const pdf = new jsPDF("l", "mm", "a4");
//       const w = pdf.internal.pageSize.getWidth();

//       // Logos
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

//       // Header
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text(
//         "HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-1 (2026-28)",
//         w / 2,
//         18,
//         { align: "center" }
//       );

//       pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });

//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(
//         "Center: ________________________________",
//         w / 2,
//         34,
//         { align: "center" }
//       );

//       // Blank rows (NO serial numbers)
//       const blankRows = Array.from({ length: studentsPerRoom }).map(() => [
//         "", // S.No (manual)
//         "", // SRN
//         "", // Name
//         "", // Father
//         "", // Gender
//         "", // School
//         "", // Photo
//         "", // Signature
//       ]);

//       pdf.autoTable({
//         startY: 45,
//         head: [[
//           "S.No",
//           "SRN",
//           "Name",
//           "Father Name",
//           "Gender",
//           "School",
//           "Photo",
//           "Signature",
//         ]],
//         body: blankRows,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 4,
//           minCellHeight: 18,
//         },
//         columnStyles: {
//           0: { cellWidth: 15 },
//           1: { cellWidth: 28 },
//           2: { cellWidth: 45 },
//           3: { cellWidth: 45 },
//           4: { cellWidth: 20 },
//           5: { cellWidth: 70 },
//           6: { cellWidth: 25 },
//           7: { cellWidth: 35 },
//         },
//       });

//       pdf.save("Attendance_Blank_Template.pdf");
//     } catch (err) {
//       console.error("Blank template generation failed", err);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex align-items-center">
//           <FaFilter className="me-2" /> 
//           <h5 className="mb-0"> MB L-3 ATTENDANCE SHEETS</h5>
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
//                       {Object.keys(groupedAttendanceData).length} rooms allocated
//                     </Badge>
//                   </h6>
//                 </Card.Header>
//                 <Card.Body>
//                   <div className="table-responsive">
//                     <Table bordered hover size="sm" className="mb-0">
//                       <thead className="table-primary">
//                         <tr>
//                           <th>S.No</th>
//                           <th>Room No</th>
//                           <th>Roll No</th>
//                           <th>SRN</th>
//                           <th>Name</th>
//                           <th>Father</th>
//                           <th>Gender</th>
//                           <th>School</th>
//                           <th>Photo</th>
//                           <th>Signature</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {attendanceData.slice(0, 10).map((s, i) => (
//                           <tr key={i}>
//                             <td className="text-center">{i + 1}</td>
//                             <td className="text-center">
//                               <Badge bg="secondary">
//                                 {s.orientationRoomNumber || "—"}
//                               </Badge>
//                             </td>
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
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
//                 </Card.Body>
//               </Card>

//               <div className="d-flex justify-content-center gap-3 mb-4">
//                 <Button
//                   onClick={downloadBlankAttendanceTemplate}
//                   variant="outline-secondary"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   Download Blank Format
//                 </Button>

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
//                 <strong>Note:</strong> The ZIP file will contain separate PDF files for each room number. 
//                 Students are sorted by Name first, then by Roll Number within each room.
//                 {Object.keys(groupedAttendanceData).length > 0 && (
//                   <div className="mt-2">
//                     <strong>Room Distribution:</strong>
//                     <ul className="mb-0 mt-1">
//                       {Object.entries(groupedAttendanceData).map(([room, students]) => (
//                         <li key={room}>
//                           Room {room}: {students.length} students
//                           {Math.ceil(students.length / studentsPerRoom) > 1 && 
//                             ` (will be split into ${Math.ceil(students.length / studentsPerRoom)} PDFs)`
//                           }
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
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
// import { markL3AttendanceOfStudents } from "../../services/StudentRegistrationServices/StudentRegistrationService";



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
//   const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [studentsPerRoom, setStudentsPerRoom] = useState(24);

//   const logo = "/haryana.png";
//   const logo2 = "/admitBuniyaLogo.png";
//   const logo3 = "/vikalpalogonotitle.png";

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

//   /* ---------------- GROUP STUDENTS BY ROOM NUMBER ---------------- */
//   const groupStudentsByRoom = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       const roomNumber = student.orientationRoomNumber || "Unassigned";
//       if (!grouped[roomNumber]) {
//         grouped[roomNumber] = [];
//       }
//       grouped[roomNumber].push(student);
//     });
    
//     // Sort students within each room: by roll number only
//     Object.keys(grouped).forEach(room => {
//       grouped[room].sort((a, b) => {
//         // Sort by roll number
//         return (a.rollNumber || "").localeCompare(b.rollNumber || "");
//       });
//     });
    
//     // Sort room numbers numerically
//     const sortedGrouped = {};
//     Object.keys(grouped)
//       .sort((a, b) => {
//         if (a === "Unassigned") return 1;
//         if (b === "Unassigned") return -1;
//         return parseInt(a) - parseInt(b);
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
//       const res = await GetAttendanceSheetData({
//         L3ExaminationCenter: selectedCenter.label,
//       });

//       // First sort all data by roll number
//       const sortedByRoll = (res.data || []).sort((a, b) =>
//         (a.rollNumber || "").localeCompare(b.rollNumber || "")
//       );

//       setAttendanceData(sortedByRoll);
      
//       // Group students by orientationRoomNumber (maintaining roll number order within each room)
//       const grouped = groupStudentsByRoom(sortedByRoll);
//       setGroupedAttendanceData(grouped);
      
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
//         6: { cellWidth: 60 },
//         7: { cellWidth: 25, cellHeight: 25 },
//         8: { cellWidth: 35 },
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
      
//       // Clear image cache for new generation
//       imageCache.clear();

//       // Generate PDF for each room based on orientationRoomNumber
//       for (const [roomNumber, students] of Object.entries(groupedAttendanceData)) {
//         // Split students into sub-rooms if there are more than studentsPerRoom in a room
//         const roomGroups = [];
//         for (let i = 0; i < students.length; i += studentsPerRoom) {
//           roomGroups.push(students.slice(i, i + studentsPerRoom));
//         }
        
//         // Generate PDF for each sub-room group
//         for (let g = 0; g < roomGroups.length; g++) {
//           const pdf = new jsPDF("l", "mm", "a4");
//           const w = pdf.internal.pageSize.getWidth();
//           const h = pdf.internal.pageSize.getHeight();

//           // Add logos
//           if (logo) {
//             try {
//               pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//             } catch (e) {
//               console.warn("Could not load main logo");
//             }
//           }

//           if (logo3) {
//             try {
//               pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
//             } catch (e) {
//               console.warn("Could not load secondary logo");
//             }
//           }

//           // Add header text
//           pdf.setFontSize(16);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("MISSION BUNIYAAD ENTRANCE EXAMINATION LEVEL-3 (2026-28)", w / 2, 18, { align: "center" });
          
//           pdf.setFontSize(16);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
          
//           pdf.setFontSize(11);
//           pdf.setFont("helvetica", "normal");
//           pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
          
//           // Display room number - use orientationRoomNumber from the data
//           const displayRoomNumber = roomNumber !== "Unassigned" ? `Room No: ${roomNumber}` : "Room: Unassigned";
//           if (roomGroups.length > 1) {
//             pdf.text(`${displayRoomNumber} (Part ${g + 1} of ${roomGroups.length})`, w / 2, 32, { align: "center" });
//           } else {
//             pdf.text(displayRoomNumber, w / 2, 32, { align: "center" });
//           }

//           // Draw table with student data
//           await drawTable(pdf, roomGroups[g], roomNumber);

//           // Add footer note
//           pdf.setFontSize(9);
//           pdf.text(
//             "Note: Students must sign in the signature column after verification",
//             10,
//             h - 5
//           );

//           // Add to zip with appropriate filename
//           const fileName = roomNumber !== "Unassigned" 
//             ? `Attendance_Room_${roomNumber}${roomGroups.length > 1 ? `_Part${g + 1}` : ''}.pdf`
//             : `Attendance_Unassigned${roomGroups.length > 1 ? `_Part${g + 1}` : ''}.pdf`;
          
//           zip.file(fileName, pdf.output("blob"));
//         }
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

//       if (logo3) {
//         try {
//           pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
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

//   /* ---------------- DOWNLOAD BLANK ATTENDANCE TEMPLATE ---------------- */
//   const downloadBlankAttendanceTemplate = async () => {
//     try {
//       const pdf = new jsPDF("l", "mm", "a4");
//       const w = pdf.internal.pageSize.getWidth();

//       // Logos
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

//       // Header
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text(
//         "HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-1 (2026-28)",
//         w / 2,
//         18,
//         { align: "center" }
//       );

//       pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });

//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(
//         "Center: ________________________________",
//         w / 2,
//         34,
//         { align: "center" }
//       );

//       // Blank rows (NO serial numbers)
//       const blankRows = Array.from({ length: studentsPerRoom }).map(() => [
//         "", // S.No (manual)
//         "", // SRN
//         "", // Name
//         "", // Father
//         "", // Gender
//         "", // School
//         "", // Photo
//         "", // Signature
//       ]);

//       pdf.autoTable({
//         startY: 45,
//         head: [[
//           "S.No",
//           "SRN",
//           "Name",
//           "Father Name",
//           "Gender",
//           "School",
//           "Photo",
//           "Signature",
//         ]],
//         body: blankRows,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 4,
//           minCellHeight: 18,
//         },
//         columnStyles: {
//           0: { cellWidth: 15 },
//           1: { cellWidth: 28 },
//           2: { cellWidth: 45 },
//           3: { cellWidth: 45 },
//           4: { cellWidth: 20 },
//           5: { cellWidth: 70 },
//           6: { cellWidth: 25 },
//           7: { cellWidth: 35 },
//         },
//       });

//       pdf.save("Attendance_Blank_Template.pdf");
//     } catch (err) {
//       console.error("Blank template generation failed", err);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex align-items-center">
//           <FaFilter className="me-2" /> 
//           <h5 className="mb-0"> MB L-3 ATTENDANCE SHEETS</h5>
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
//                       {Object.keys(groupedAttendanceData).length} rooms allocated
//                     </Badge>
//                   </h6>
//                 </Card.Header>
//                 <Card.Body>
//                   <div className="table-responsive">
//                     <Table bordered hover size="sm" className="mb-0">
//                       <thead className="table-primary">
//                         <tr>
//                           <th>S.No</th>
//                           <th>Room No</th>
//                           <th>Roll No</th>
//                           <th>SRN</th>
//                           <th>Name</th>
//                           <th>Father</th>
//                           <th>Gender</th>
//                           <th>School</th>
//                           <th>Photo</th>
//                           <th>Signature</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {attendanceData.slice(0, 10).map((s, i) => (
//                           <tr key={i}>
//                             <td className="text-center">{i + 1}</td>
//                             <td className="text-center">
//                               <Badge bg="secondary">
//                                 {s.orientationRoomNumber || "—"}
//                               </Badge>
//                             </td>
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
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
//                 </Card.Body>
//               </Card>

//               <div className="d-flex justify-content-center gap-3 mb-4">
//                 <Button
//                   onClick={downloadBlankAttendanceTemplate}
//                   variant="outline-secondary"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   Download Blank Format
//                 </Button>

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
//                 <strong>Note:</strong> The ZIP file will contain separate PDF files for each room number. 
//                 Students are sorted by Roll Number within each room (maintaining the original roll number order from the database).
//                 {Object.keys(groupedAttendanceData).length > 0 && (
//                   <div className="mt-2">
//                     <strong>Room Distribution:</strong>
//                     <ul className="mb-0 mt-1">
//                       {Object.entries(groupedAttendanceData).map(([room, students]) => (
//                         <li key={room}>
//                           Room {room}: {students.length} students
//                           {Math.ceil(students.length / studentsPerRoom) > 1 && 
//                             ` (will be split into ${Math.ceil(students.length / studentsPerRoom)} PDFs)`
//                           }
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
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















//Level 1 Attendance sheet code updated current

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
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import Select from "react-select";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload, FaFileExcel, FaInfoCircle, FaFilter, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { GetCentersDataByExaminationAndExamType } from "../../services/ExaminationVenue/ExaminationVenueServices";
import { GetAttendanceSheetData, markL3AttendanceOfStudents } from "../../services/StudentRegistrationServices/StudentRegistrationService";
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
  const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [studentsPerRoom, setStudentsPerRoom] = useState(24);
  
  // New states for attendance marking
  const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");
  const [updatingAttendance, setUpdatingAttendance] = useState(false);
  const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

  const logo = "/haryana.png";
  const logo2 = "/admitBuniyaLogo.png";
  const logo3 = "/vikalpalogonotitle.png";

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

  /* ---------------- GROUP STUDENTS BY ROOM NUMBER ---------------- */
  const groupStudentsByRoom = (students) => {
    const grouped = {};
    
    students.forEach(student => {
      const roomNumber = student.roomNo || "Unassigned";
      if (!grouped[roomNumber]) {
        grouped[roomNumber] = [];
      }
      grouped[roomNumber].push(student);
    });
    
    // Sort students within each room: by roll number only
    Object.keys(grouped).forEach(room => {
      grouped[room].sort((a, b) => {
        // Sort by roll number
        return (a.rollNumber || "").localeCompare(b.rollNumber || "");
      });
    });
    
    // Sort room numbers numerically
    const sortedGrouped = {};
    Object.keys(grouped)
      .sort((a, b) => {
        if (a === "Unassigned") return 1;
        if (b === "Unassigned") return -1;
        return parseInt(a) - parseInt(b);
      })
      .forEach(key => {
        sortedGrouped[key] = grouped[key];
      });
    
    return sortedGrouped;
  };

  /* ---------------- FETCH ATTENDANCE ---------------- */
  const fetchAttendanceData = async () => {
    if (!selectedCenter) return setError("Please select a center");
    setLoadingData(true);
    setError(null);
    try {
      const res = await GetAttendanceSheetData({
        L1ExaminationCenter: selectedCenter.label,
      });


      console.log(res.data)

      // First sort all data by roll number
      const sortedByRoll = (res.data || []).sort((a, b) =>
        (a.rollNumber || "").localeCompare(b.rollNumber || "")
      );

      setAttendanceData(sortedByRoll);
      
      // Group students by orientationRoomNumber (maintaining roll number order within each room)
      const grouped = groupStudentsByRoom(sortedByRoll);
      setGroupedAttendanceData(grouped);
      
      // Reset filters and update status
      setSelectedRoomFilter("all");
      setAttendanceUpdateStatus({});
      setShowPreview(true);
    } catch {
      setError("Failed to fetch attendance data");
    } finally {
      setLoadingData(false);
    }
  };

  /* ---------------- HANDLE ATTENDANCE TOGGLE ---------------- */
  const handleAttendanceToggle = async (studentId, currentStatus) => {
    setUpdatingAttendance(true);
    
    // Optimistically update UI
    setAttendanceData(prevData => 
      prevData.map(student => 
        student._id === studentId 
          ? { ...student, isPresentInL3Examination: !currentStatus }
          : student
      )
    );
    
    // Update grouped data
    setGroupedAttendanceData(prevGrouped => {
      const newGrouped = { ...prevGrouped };
      Object.keys(newGrouped).forEach(room => {
        newGrouped[room] = newGrouped[room].map(student =>
          student._id === studentId
            ? { ...student, isPresentInL3Examination: !currentStatus }
            : student
        );
      });
      return newGrouped;
    });
    
    // Set update status for this student
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
        // Update success status
        setAttendanceUpdateStatus(prev => ({ 
          ...prev, 
          [studentId]: { loading: false, success: true, error: null } 
        }));
        
        // Clear success message after 2 seconds
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
      
      // Revert optimistic update on error
      setAttendanceData(prevData => 
        prevData.map(student => 
          student._id === studentId 
            ? { ...student, isPresentInL3Examination: currentStatus }
            : student
        )
      );
      
      setGroupedAttendanceData(prevGrouped => {
        const newGrouped = { ...prevGrouped };
        Object.keys(newGrouped).forEach(room => {
          newGrouped[room] = newGrouped[room].map(student =>
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
      
      // Clear error message after 3 seconds
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

  /* ---------------- GET FILTERED DATA FOR DISPLAY ---------------- */
  const getFilteredData = () => {
    if (selectedRoomFilter === "all") {
      return attendanceData;
    }
    return groupedAttendanceData[selectedRoomFilter] || [];
  };

  /* ---------------- GET UNIQUE ROOMS FOR FILTER ---------------- */
  const getRoomOptions = () => {
    const rooms = Object.keys(groupedAttendanceData);
    return [
      { value: "all", label: `📋 All Rooms (${attendanceData.length} students)` },
      ...rooms.map(room => ({
        value: room,
        label: `🚪 Room ${room} (${groupedAttendanceData[room].length} students)`
      }))
    ];
  };

  /* ---------------- PDF TABLE DRAW (UNCHANGED) ---------------- */
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
        6: { cellWidth: 60 },
        7: { cellWidth: 25, cellHeight: 25 },
        8: { cellWidth: 35 },
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

  /* ---------------- DOWNLOAD ALL PDFs (UNCHANGED) ---------------- */
  const generateAttendancePDFs = async () => {
    if (!attendanceData.length) {
      setError("No attendance data available");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const zip = new JSZip();
      
      // Clear image cache for new generation
      imageCache.clear();

      // Generate PDF for each room based on orientationRoomNumber
      for (const [roomNumber, students] of Object.entries(groupedAttendanceData)) {
        // Split students into sub-rooms if there are more than studentsPerRoom in a room
        const roomGroups = [];
        for (let i = 0; i < students.length; i += studentsPerRoom) {
          roomGroups.push(students.slice(i, i + studentsPerRoom));
        }
        
        // Generate PDF for each sub-room group
        for (let g = 0; g < roomGroups.length; g++) {
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

          if (logo3) {
            try {
              pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
            } catch (e) {
              console.warn("Could not load secondary logo");
            }
          }

          // Add header text
          pdf.setFontSize(16);
          pdf.setFont("helvetica", "bold");
          // pdf.text("MISSION BUNIYAAD ENTRANCE EXAMINATION LEVEL-3 (2026-28)", w / 2, 18, { align: "center" });


           pdf.text("HARYANA SUPER 100 LEVEL 1 (EXTENDED 100 SEATS) (2026-28)", w / 2, 18, { align: "center" });
          
          pdf.setFontSize(16);
          pdf.setFont("helvetica", "bold");
          pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
          
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "normal");
          pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
          
          // Display room number - use orientationRoomNumber from the data
          const displayRoomNumber = roomNumber !== "Unassigned" ? `Room No: ${roomNumber}` : "Room: Unassigned";
          if (roomGroups.length > 1) {
            pdf.text(`${displayRoomNumber} (Part ${g + 1} of ${roomGroups.length})`, w / 2, 32, { align: "center" });
          } else {
            pdf.text(displayRoomNumber, w / 2, 32, { align: "center" });
          }

          // Draw table with student data
          await drawTable(pdf, roomGroups[g], roomNumber);

          // Add footer note
          pdf.setFontSize(9);
          pdf.text(
            "Note: Students must sign in the signature column after verification",
            10,
            h - 5
          );

          // Add to zip with appropriate filename
          const fileName = roomNumber !== "Unassigned" 
            ? `Attendance_Room_${roomNumber}${roomGroups.length > 1 ? `_Part${g + 1}` : ''}.pdf`
            : `Attendance_Unassigned${roomGroups.length > 1 ? `_Part${g + 1}` : ''}.pdf`;
          
          zip.file(fileName, pdf.output("blob"));
        }
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

  /* ---------------- PREVIEW PDF (UNCHANGED) ---------------- */
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

      if (logo3) {
        try {
          pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
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

  /* ---------------- DOWNLOAD BLANK ATTENDANCE TEMPLATE (UNCHANGED) ---------------- */
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

      if (logo3) {
        try {
          pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
        } catch {}
      }

      // Header
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        "HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-1 (2026-28)",
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
          2: { cellWidth: 45 },
          3: { cellWidth: 45 },
          4: { cellWidth: 20 },
          5: { cellWidth: 70 },
          6: { cellWidth: 25 },
          7: { cellWidth: 35 },
        },
      });

      pdf.save("Attendance_Blank_Template.pdf");
    } catch (err) {
      console.error("Blank template generation failed", err);
    }
  };

  /* ---------------- UI ---------------- */
  const filteredData = getFilteredData();
  const roomOptions = getRoomOptions();

  return (
    <Container fluid className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
          <FaFilter className="me-2" /> 
          {/* <h5 className="mb-0">MB L-3 ATTENDANCE SHEETS</h5>
           */}
           <h5 className="mb-0">HARYANA SUPER 100 LEVEL 1 (EXTENDED 100 SEATS) ATTENDANCE SHEETS</h5>
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
              {/* Room Filter and Controls */}
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <Row className="align-items-center">
                    <Col md={5}>
                      <h6 className="mb-0">
                        📊 Attendance Marking
                        <Badge bg="info" className="ms-2">
                          🚪 {Object.keys(groupedAttendanceData).length} Rooms
                        </Badge>
                        <Badge bg="success" className="ms-2">
                          ✅ {attendanceData.filter(s => s.isPresentInL3Examination).length} Present
                        </Badge>
                        <Badge bg="secondary" className="ms-2">
                          ❌ {attendanceData.filter(s => !s.isPresentInL3Examination).length} Absent
                        </Badge>
                      </h6>
                    </Col>
                    <Col md={7}>
                      <Form.Group>
                        <Form.Label className="mb-1">
                          <FaFilter className="me-1" /> Filter by Room Number
                        </Form.Label>
                        <Select
                          options={roomOptions}
                          value={roomOptions.find(opt => opt.value === selectedRoomFilter)}
                          onChange={(option) => setSelectedRoomFilter(option?.value || "all")}
                          placeholder="Select Room"
                          isClearable={false}
                          styles={{
                            menu: (provided) => ({ ...provided, zIndex: 9999 }),
                            control: (provided) => ({ ...provided, backgroundColor: '#fff' })
                          }}
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
                          <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Room No</th>
                          <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>Roll No</th>
                          <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
                        
                          <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>SRN</th>
                          <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Name</th>
                          <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Father</th>
                          <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Gender</th>
                          <th style={{ width: "200px", backgroundColor: "#0d6efd", color: "white" }}>School</th>
                          <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Photo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((s, i) => (
                          <tr key={s._id} className={s.isPresentInL3Examination ? "table-success" : ""}>
                            <td className="text-center fw-bold">{i + 1}</td>
                            <td className="text-center">
                              <Badge bg="secondary" pill>
                                🚪 {s.orientationRoomNumber || "—"}
                              </Badge>
                            </td>
                            <td className="text-center">
                              <strong>{s.rollNumber}</strong>
                            </td>
                            <ToggleButton
  type="checkbox"
  variant={s.isPresentInL3Examination ? "success" : "outline-secondary"}
  checked={s.isPresentInL3Examination}
  value="1"
  onClick={() => {
    console.log('Toggle clicked for student:', s);
    console.log('Student ID:', s._id);
    handleAttendanceToggle(s._id, s.isPresentInL3Examination);
  }}
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
                            
                            <td className="text-center">{s.srn || "—"}</td>
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
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  
                  {filteredData.length === 0 && (
                    <Alert variant="info" className="text-center mb-0 mt-3">
                      <FaInfoCircle className="me-2" />
                      No students found in selected room.
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-center gap-3 mb-4">
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
                <strong>Digital Attendance Marking:</strong> Click on the toggle button to mark students as Present/Absent. 
                The status will be saved immediately to the database. 
                {Object.keys(groupedAttendanceData).length > 0 && (
                  <div className="mt-2">
                    <strong>📊 Room-wise Summary:</strong>
                    <ul className="mb-0 mt-1">
                      {Object.entries(groupedAttendanceData).map(([room, students]) => (
                        <li key={room}>
                          <strong>Room {room}:</strong> {students.length} students 
                          ({students.filter(s => s.isPresentInL3Examination).length} Present, 
                          {students.filter(s => !s.isPresentInL3Examination).length} Absent)
                          {Math.ceil(students.length / studentsPerRoom) > 1 && 
                            ` (will be split into ${Math.ceil(students.length / studentsPerRoom)} PDFs)`
                          }
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
            <span>Attendance Sheet Generator v2.0 - Digital Marking Enabled</span>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};













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
//   ToggleButton,
//   ToggleButtonGroup,
// } from "react-bootstrap";
// import Select from "react-select";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { FaDownload, FaFileExcel, FaInfoCircle, FaFilter, FaToggleOn, FaToggleOff } from "react-icons/fa";
// import { GetCentersDataByExaminationAndExamType } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetData, markL3AttendanceOfStudents } from "../../services/StudentRegistrationServices/StudentRegistrationService";
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
//   const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [studentsPerRoom, setStudentsPerRoom] = useState(24);
  
//   // New states for attendance marking
//   const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");
//   const [updatingAttendance, setUpdatingAttendance] = useState(false);
//   const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

//   const logo = "/haryana.png";
//   const logo2 = "/admitBuniyaLogo.png";
//   const logo3 = "/vikalpalogonotitle.png";

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

//   /* ---------------- GROUP STUDENTS BY COUNSELLING ROOM NUMBER ---------------- */
//   const groupStudentsByRoom = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       // Use counsellingRoomNumber instead of orientationRoomNumber
//       const roomNumber = student.counsellingRoomNumber || "Unassigned";
//       if (!grouped[roomNumber]) {
//         grouped[roomNumber] = [];
//       }
//       grouped[roomNumber].push(student);
//     });
    
//     // Sort students within each room: by roll number only
//     Object.keys(grouped).forEach(room => {
//       grouped[room].sort((a, b) => {
//         // Sort by roll number
//         return (a.rollNumber || "").localeCompare(b.rollNumber || "");
//       });
//     });
    
//     // Sort room numbers numerically
//     const sortedGrouped = {};
//     Object.keys(grouped)
//       .sort((a, b) => {
//         if (a === "Unassigned") return 1;
//         if (b === "Unassigned") return -1;
//         return parseInt(a) - parseInt(b);
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
//       const res = await GetAttendanceSheetData({
//         counsellingVenue: selectedCenter.label,
//       });

//       // First sort all data by roll number
//       const sortedByRoll = (res.data || []).sort((a, b) =>
//         (a.rollNumber || "").localeCompare(b.rollNumber || "")
//       );

//       setAttendanceData(sortedByRoll);
      
//       // Group students by counsellingRoomNumber (maintaining roll number order within each room)
//       const grouped = groupStudentsByRoom(sortedByRoll);
//       setGroupedAttendanceData(grouped);
      
//       // Reset filters and update status
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
    
//     // Optimistically update UI
//     setAttendanceData(prevData => 
//       prevData.map(student => 
//         student._id === studentId 
//           ? { ...student, isPresentInL3Examination: !currentStatus }
//           : student
//       )
//     );
    
//     // Update grouped data
//     setGroupedAttendanceData(prevGrouped => {
//       const newGrouped = { ...prevGrouped };
//       Object.keys(newGrouped).forEach(room => {
//         newGrouped[room] = newGrouped[room].map(student =>
//           student._id === studentId
//             ? { ...student, isPresentInL3Examination: !currentStatus }
//             : student
//         );
//       });
//       return newGrouped;
//     });
    
//     // Set update status for this student
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
//         // Update success status
//         setAttendanceUpdateStatus(prev => ({ 
//           ...prev, 
//           [studentId]: { loading: false, success: true, error: null } 
//         }));
        
//         // Clear success message after 2 seconds
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
      
//       // Revert optimistic update on error
//       setAttendanceData(prevData => 
//         prevData.map(student => 
//           student._id === studentId 
//             ? { ...student, isPresentInL3Examination: currentStatus }
//             : student
//         )
//       );
      
//       setGroupedAttendanceData(prevGrouped => {
//         const newGrouped = { ...prevGrouped };
//         Object.keys(newGrouped).forEach(room => {
//           newGrouped[room] = newGrouped[room].map(student =>
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
      
//       // Clear error message after 3 seconds
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

//   /* ---------------- GET UNIQUE ROOMS FOR FILTER ---------------- */
//   const getRoomOptions = () => {
//     const rooms = Object.keys(groupedAttendanceData);
//     return [
//       { value: "all", label: `📋 All Rooms (${attendanceData.length} students)` },
//       ...rooms.map(room => ({
//         value: room,
//         label: `🚪 Room ${room} (${groupedAttendanceData[room].length} students)`
//       }))
//     ];
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
//         6: { cellWidth: 60 },
//         7: { cellWidth: 25, cellHeight: 25 },
//         8: { cellWidth: 35 },
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
      
//       // Clear image cache for new generation
//       imageCache.clear();

//       // Generate PDF for each room based on counsellingRoomNumber
//       for (const [roomNumber, students] of Object.entries(groupedAttendanceData)) {
//         // Split students into sub-rooms if there are more than studentsPerRoom in a room
//         const roomGroups = [];
//         for (let i = 0; i < students.length; i += studentsPerRoom) {
//           roomGroups.push(students.slice(i, i + studentsPerRoom));
//         }
        
//         // Generate PDF for each sub-room group
//         for (let g = 0; g < roomGroups.length; g++) {
//           const pdf = new jsPDF("l", "mm", "a4");
//           const w = pdf.internal.pageSize.getWidth();
//           const h = pdf.internal.pageSize.getHeight();

//           // Add logos
//           if (logo) {
//             try {
//               pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//             } catch (e) {
//               console.warn("Could not load main logo");
//             }
//           }

//           if (logo3) {
//             try {
//               pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
//             } catch (e) {
//               console.warn("Could not load secondary logo");
//             }
//           }

//           // Add header text
//           pdf.setFontSize(16);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("MISSION BUNIYAAD COUNSELLING (2026-28)", w / 2, 18, { align: "center" });
          
//           pdf.setFontSize(16);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
          
//           pdf.setFontSize(11);
//           pdf.setFont("helvetica", "normal");
//           pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
          
//           // Display room number - use counsellingRoomNumber from the data
//           const displayRoomNumber = roomNumber !== "Unassigned" ? `Room No: ${roomNumber}` : "Room: Unassigned";
//           if (roomGroups.length > 1) {
//             pdf.text(`${displayRoomNumber} (Part ${g + 1} of ${roomGroups.length})`, w / 2, 32, { align: "center" });
//           } else {
//             pdf.text(displayRoomNumber, w / 2, 32, { align: "center" });
//           }

//           // Draw table with student data
//           await drawTable(pdf, roomGroups[g], roomNumber);

//           // Add footer note
//           pdf.setFontSize(9);
//           pdf.text(
//             "Note: Students must sign in the signature column after verification",
//             10,
//             h - 5
//           );

//           // Add to zip with appropriate filename
//           const fileName = roomNumber !== "Unassigned" 
//             ? `Attendance_Room_${roomNumber}${roomGroups.length > 1 ? `_Part${g + 1}` : ''}.pdf`
//             : `Attendance_Unassigned${roomGroups.length > 1 ? `_Part${g + 1}` : ''}.pdf`;
          
//           zip.file(fileName, pdf.output("blob"));
//         }
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

//       if (logo3) {
//         try {
//           pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
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

//   /* ---------------- DOWNLOAD BLANK ATTENDANCE TEMPLATE ---------------- */
//   const downloadBlankAttendanceTemplate = async () => {
//     try {
//       const pdf = new jsPDF("l", "mm", "a4");
//       const w = pdf.internal.pageSize.getWidth();

//       // Logos
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

//       // Header
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text(
//         "HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-1 (2026-28)",
//         w / 2,
//         18,
//         { align: "center" }
//       );

//       pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });

//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(
//         "Center: ________________________________",
//         w / 2,
//         34,
//         { align: "center" }
//       );

//       // Blank rows (NO serial numbers)
//       const blankRows = Array.from({ length: studentsPerRoom }).map(() => [
//         "", // S.No (manual)
//         "", // SRN
//         "", // Name
//         "", // Father
//         "", // Gender
//         "", // School
//         "", // Photo
//         "", // Signature
//       ]);

//       pdf.autoTable({
//         startY: 45,
//         head: [[
//           "S.No",
//           "SRN",
//           "Name",
//           "Father Name",
//           "Gender",
//           "School",
//           "Photo",
//           "Signature",
//         ]],
//         body: blankRows,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 4,
//           minCellHeight: 18,
//         },
//         columnStyles: {
//           0: { cellWidth: 15 },
//           1: { cellWidth: 28 },
//           2: { cellWidth: 45 },
//           3: { cellWidth: 45 },
//           4: { cellWidth: 20 },
//           5: { cellWidth: 70 },
//           6: { cellWidth: 25 },
//           7: { cellWidth: 35 },
//         },
//       });

//       pdf.save("Attendance_Blank_Template.pdf");
//     } catch (err) {
//       console.error("Blank template generation failed", err);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   const filteredData = getFilteredData();
//   const roomOptions = getRoomOptions();

//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex align-items-center">
//           <FaFilter className="me-2" /> 
//           <h5 className="mb-0">MB COUNSELLING ATTENDANCE SHEETS</h5>
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
//               {/* Room Filter and Controls */}
//               <Card className="mb-4">
//                 <Card.Header className="bg-light">
//                   <Row className="align-items-center">
//                     <Col md={5}>
//                       <h6 className="mb-0">
//                         📊 Attendance Marking
//                         <Badge bg="info" className="ms-2">
//                           🚪 {Object.keys(groupedAttendanceData).length} Rooms
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
//                           <FaFilter className="me-1" /> Filter by Room Number
//                         </Form.Label>
//                         <Select
//                           options={roomOptions}
//                           value={roomOptions.find(opt => opt.value === selectedRoomFilter)}
//                           onChange={(option) => setSelectedRoomFilter(option?.value || "all")}
//                           placeholder="Select Room"
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
//                           <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Room No</th>
//                           <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>Roll No</th>
//                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>SRN</th>
//                           <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Name</th>
//                           <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Father</th>
//                           <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Gender</th>
//                           <th style={{ width: "200px", backgroundColor: "#0d6efd", color: "white" }}>School</th>
//                           <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Photo</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredData.map((s, i) => (
//                           <tr key={s._id} className={s.isPresentInL3Examination ? "table-success" : ""}>
//                             <td className="text-center fw-bold">{i + 1}</td>
//                             <td className="text-center">
//                               <Badge bg="secondary" pill>
//                                 🚪 {s.counsellingRoomNumber || "—"}
//                               </Badge>
//                             </td>
//                             <td className="text-center">
//                               <strong>{s.rollNumber}</strong>
//                             </td>
//                             <td className="text-center">
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
//                             <td className="text-center">{s.srn || "—"}</td>
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
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
                  
//                   {filteredData.length === 0 && (
//                     <Alert variant="info" className="text-center mb-0 mt-3">
//                       <FaInfoCircle className="me-2" />
//                       No students found in selected room.
//                     </Alert>
//                   )}
//                 </Card.Body>
//               </Card>

//               <div className="d-flex justify-content-center gap-3 mb-4">
//                 <Button
//                   onClick={downloadBlankAttendanceTemplate}
//                   variant="outline-secondary"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   Download Blank Format
//                 </Button>

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
//                 <strong>Digital Attendance Marking:</strong> Click on the toggle button to mark students as Present/Absent. 
//                 The status will be saved immediately to the database. 
//                 {Object.keys(groupedAttendanceData).length > 0 && (
//                   <div className="mt-2">
//                     <strong>📊 Room-wise Summary (based on Counselling Room Number):</strong>
//                     <ul className="mb-0 mt-1">
//                       {Object.entries(groupedAttendanceData).map(([room, students]) => (
//                         <li key={room}>
//                           <strong>Room {room}:</strong> {students.length} students 
//                           ({students.filter(s => s.isPresentInL3Examination).length} Present, 
//                           {students.filter(s => !s.isPresentInL3Examination).length} Absent)
//                           {Math.ceil(students.length / studentsPerRoom) > 1 && 
//                             ` (will be split into ${Math.ceil(students.length / studentsPerRoom)} PDFs)`
//                           }
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
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
//             <span>Attendance Sheet Generator v2.0 - Digital Marking Enabled | Grouped by Counselling Room Number</span>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };








//For counselling

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
// } from "react-bootstrap";
// import Select from "react-select";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { FaDownload, FaFileExcel, FaInfoCircle, FaFilter } from "react-icons/fa";
// import { GetCentersDataByExaminationAndExamType } from "../../services/ExaminationVenue/ExaminationVenueServices";
// import { GetAttendanceSheetData } from "../../services/StudentRegistrationServices/StudentRegistrationService";

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
//   const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [studentsPerRoom, setStudentsPerRoom] = useState(24);
  
//   // State for room filter
//   const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");

//   const logo = "/haryana.png";
//   const logo2 = "/admitBuniyaLogo.png";
//   const logo3 = "/vikalpalogonotitle.png";

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

//   /* ---------------- GROUP STUDENTS BY COUNSELLING ROOM NUMBER ---------------- */
//   const groupStudentsByRoom = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       const roomNumber = student.counsellingRoomNumber || "Unassigned";
//       if (!grouped[roomNumber]) {
//         grouped[roomNumber] = [];
//       }
//       grouped[roomNumber].push(student);
//     });
    
//     // Sort students within each room by roll number
//     Object.keys(grouped).forEach(room => {
//       grouped[room].sort((a, b) => {
//         return (a.rollNumber || "").localeCompare(b.rollNumber || "");
//       });
//     });
    
//     // Sort room numbers numerically
//     const sortedGrouped = {};
//     Object.keys(grouped)
//       .sort((a, b) => {
//         if (a === "Unassigned") return 1;
//         if (b === "Unassigned") return -1;
//         return parseInt(a) - parseInt(b);
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
//       const res = await GetAttendanceSheetData({
//         counsellingVenue: selectedCenter.label,
//       });

//       const sortedByRoll = (res.data || []).sort((a, b) =>
//         (a.rollNumber || "").localeCompare(b.rollNumber || "")
//       );

//       setAttendanceData(sortedByRoll);
      
//       const grouped = groupStudentsByRoom(sortedByRoll);
//       setGroupedAttendanceData(grouped);
      
//       setSelectedRoomFilter("all");
//       setShowPreview(true);
//     } catch {
//       setError("Failed to fetch attendance data");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   /* ---------------- GET FILTERED DATA FOR DISPLAY ---------------- */
//   const getFilteredData = () => {
//     if (selectedRoomFilter === "all") {
//       return attendanceData;
//     }
//     return groupedAttendanceData[selectedRoomFilter] || [];
//   };

//   /* ---------------- GET UNIQUE ROOMS FOR FILTER ---------------- */
//   const getRoomOptions = () => {
//     const rooms = Object.keys(groupedAttendanceData);
//     return [
//       { value: "all", label: `📋 All Rooms (${attendanceData.length} students)` },
//       ...rooms.map(room => ({
//         value: room,
//         label: `🚪 Room ${room} (${groupedAttendanceData[room].length} students)`
//       }))
//     ];
//   };

//   /* ---------------- PDF TABLE DRAW ---------------- */
//   const drawTable = async (pdf, students, roomNumber = null, startY = 45) => {
//     // Prepare body data - Added Status column using selectionStatusForL3
//     const body = students.map((s, i) => [
//       i + 1,
//       s.rollNumber || "",
//       s.srn || "",
//       s.name || "",
//       s.father || "",
//       s.mobile || "", // Contact 1
//       s.omrcontact1 || "", // Contact 2
//       s.selectionStatusForL3 || "", // Status field
//       "", // Empty placeholder for image
//       "",
//     ]);

//     // Preload all images
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
//         "Contact 1",
//         "Contact 2",
//         "Status",
//         "Photo",
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
//         0: { cellWidth: 10 },
//         1: { cellWidth: 22 },
//         2: { cellWidth: 25 },
//         3: { cellWidth: 32 },
//         4: { cellWidth: 32 },
//         5: { cellWidth: 25 },
//         6: { cellWidth: 25 },
//         7: { cellWidth: 20 },
//         8: { cellWidth: 22, cellHeight: 22 },
//         9: { cellWidth: 30 },
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
//         if (data.section === "body" && data.column.index === 8) {
//           const rowIndex = data.row.index;
//           data.cell.imageData = imageData[rowIndex];
//         }
//       },
//       willDrawCell: (data) => {
//         if (data.section === "body" && data.column.index === 8) {
//           data.cell.text = "";
//         }
//       },
//       didDrawCell: (data) => {
//         if (data.section === "body" && data.column.index === 8 && data.cell.imageData) {
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
//             pdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
//             pdf.text("No Image", data.cell.x + 5, data.cell.y + data.cell.height / 2);
//           }
//         } else if (data.section === "body" && data.column.index === 8) {
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
//       imageCache.clear();

//       for (const [roomNumber, students] of Object.entries(groupedAttendanceData)) {
//         const roomGroups = [];
//         for (let i = 0; i < students.length; i += studentsPerRoom) {
//           roomGroups.push(students.slice(i, i + studentsPerRoom));
//         }
        
//         for (let g = 0; g < roomGroups.length; g++) {
//           const pdf = new jsPDF("l", "mm", "a4");
//           const w = pdf.internal.pageSize.getWidth();
//           const h = pdf.internal.pageSize.getHeight();

//           if (logo) {
//             try {
//               pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//             } catch (e) {
//               console.warn("Could not load main logo");
//             }
//           }

//           if (logo3) {
//             try {
//               pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
//             } catch (e) {
//               console.warn("Could not load secondary logo");
//             }
//           }

//           pdf.setFontSize(16);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("MISSION BUNIYAAD COUNSELLING (2026-28)", w / 2, 18, { align: "center" });
          
//           pdf.setFontSize(16);
//           pdf.setFont("helvetica", "bold");
//           pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
          
//           pdf.setFontSize(11);
//           pdf.setFont("helvetica", "normal");
//           pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
          
//           const displayRoomNumber = roomNumber !== "Unassigned" ? `Room No: ${roomNumber}` : "Room: Unassigned";
//           if (roomGroups.length > 1) {
//             pdf.text(`${displayRoomNumber} (Part ${g + 1} of ${roomGroups.length})`, w / 2, 32, { align: "center" });
//           } else {
//             pdf.text(displayRoomNumber, w / 2, 32, { align: "center" });
//           }

//           await drawTable(pdf, roomGroups[g], roomNumber);

//           pdf.setFontSize(9);
//           pdf.text(
//             "Note: Students must sign in the signature column after verification",
//             10,
//             h - 5
//           );

//           const fileName = roomNumber !== "Unassigned" 
//             ? `Attendance_Room_${roomNumber}${roomGroups.length > 1 ? `_Part${g + 1}` : ''}.pdf`
//             : `Attendance_Unassigned${roomGroups.length > 1 ? `_Part${g + 1}` : ''}.pdf`;
          
//           zip.file(fileName, pdf.output("blob"));
//         }
//       }

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

//   /* ---------------- DOWNLOAD EXCEL ---------------- */
//   const downloadExcel = () => {
//     if (!attendanceData.length) {
//       setError("No attendance data available to export");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const excelData = attendanceData.map((student, index) => ({
//         "S.No": index + 1,
//         "Room No": student.counsellingRoomNumber || "—",
//         "Roll No": student.rollNumber || "",
//         "Attendance Status": student.counsellingAttendance ? "Present" : "Absent",
//         "SRN": student.srn || "",
//         "Name": student.name || "",
//         "Father": student.father || "",
//         "Contact 1": student.mobile || "",
//         "Contact 2": student.whatsapp || "",
//         "OMR Contact 1": student.omrcontact1 || "",
//         "Selection Status For L3": student.selectionStatusForL3 || "",
//       }));

//       const ws = XLSX.utils.json_to_sheet(excelData);
      
//       const colWidths = [
//         { wch: 8 },  // S.No
//         { wch: 10 }, // Room No
//         { wch: 12 }, // Roll No
//         { wch: 16 }, // Attendance Status
//         { wch: 20 }, // SRN
//         { wch: 30 }, // Name
//         { wch: 30 }, // Father
//         { wch: 20 }, // Contact 1
//         { wch: 20 }, // Contact 2
//         { wch: 20 }, // OMR Contact 1
//         { wch: 25 }, // Selection Status For L3
//       ];
//       ws['!cols'] = colWidths;

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Attendance_Data");

//       const fileName = `Attendance_Data_${selectedCenter?.label || "Center"}.xlsx`;
//       XLSX.writeFile(wb, fileName);
      
//       setError(null);
//     } catch (err) {
//       console.error("Excel export failed:", err);
//       setError("Excel export failed: " + err.message);
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

//       if (logo) {
//         try {
//           pdf.addImage(logo, "PNG", 10, 8, 20, 20);
//         } catch (e) {
//           console.warn("Could not load main logo");
//         }
//       }

//       if (logo3) {
//         try {
//           pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
//         } catch (e) {
//           console.warn("Could not load secondary logo");
//         }
//       }

//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("ATTENDANCE SHEET PREVIEW", w / 2, 18, { align: "center" });
      
//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 26, { align: "center" });
//       pdf.text(`Showing first 50 students of ${attendanceData.length}`, w / 2, 32, { align: "center" });

//       await drawTable(pdf, attendanceData.slice(0, 50));

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

//   /* ---------------- DOWNLOAD BLANK ATTENDANCE TEMPLATE ---------------- */
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
//         "MISSION BUNIYAAD COUNSELLING (2026-28)",
//         w / 2,
//         18,
//         { align: "center" }
//       );

//       pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });

//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(
//         "Center: ________________________________",
//         w / 2,
//         34,
//         { align: "center" }
//       );

//       const blankRows = Array.from({ length: studentsPerRoom }).map(() => [
//         "", // S.No
//         "", // Roll No
//         "", // SRN
//         "", // Name
//         "", // Father
//         "", // Contact 1
//         "", // Contact 2
//         "", // Status
//         "", // Photo
//         "", // Signature
//       ]);

//       pdf.autoTable({
//         startY: 45,
//         head: [[
//           "S.No",
//           "Roll No",
//           "SRN",
//           "Name",
//           "Father Name",
//           "Contact 1",
//           "Contact 2",
//           "Status",
//           "Photo",
//           "Signature",
//         ]],
//         body: blankRows,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 4,
//           minCellHeight: 18,
//         },
//         columnStyles: {
//           0: { cellWidth: 10 },
//           1: { cellWidth: 22 },
//           2: { cellWidth: 25 },
//           3: { cellWidth: 32 },
//           4: { cellWidth: 32 },
//           5: { cellWidth: 25 },
//           6: { cellWidth: 25 },
//           7: { cellWidth: 20 },
//           8: { cellWidth: 22 },
//           9: { cellWidth: 30 },
//         },
//       });

//       pdf.save("Attendance_Blank_Template.pdf");
//     } catch (err) {
//       console.error("Blank template generation failed", err);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   const filteredData = getFilteredData();
//   const roomOptions = getRoomOptions();

//   return (
//     <Container fluid className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex align-items-center">
//           <FaFilter className="me-2" /> 
//           <h5 className="mb-0">MB COUNSELLING ATTENDANCE SHEETS</h5>
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
//                   <Row className="align-items-center">
//                     <Col md={5}>
//                       <h6 className="mb-0">
//                         📊 Attendance Data
//                         <Badge bg="info" className="ms-2">
//                           🚪 {Object.keys(groupedAttendanceData).length} Rooms
//                         </Badge>
//                         <Badge bg="success" className="ms-2">
//                           ✅ {attendanceData.filter(s => s.counsellingAttendance).length} Present
//                         </Badge>
//                         <Badge bg="secondary" className="ms-2">
//                           ❌ {attendanceData.filter(s => !s.counsellingAttendance).length} Absent
//                         </Badge>
//                       </h6>
//                     </Col>
//                     <Col md={7}>
//                       <Form.Group>
//                         <Form.Label className="mb-1">
//                           <FaFilter className="me-1" /> Filter by Room Number
//                         </Form.Label>
//                         <Select
//                           options={roomOptions}
//                           value={roomOptions.find(opt => opt.value === selectedRoomFilter)}
//                           onChange={(option) => setSelectedRoomFilter(option?.value || "all")}
//                           placeholder="Select Room"
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
//                           <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Room No</th>
//                           <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>Roll No</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>SRN</th>
//                           <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Name</th>
//                           <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Father</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>Contact 1</th>
//                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>Contact 2</th>
//                           <th style={{ width: "140px", backgroundColor: "#0d6efd", color: "white" }}>OMR Contact 1</th>
//                           <th style={{ width: "160px", backgroundColor: "#0d6efd", color: "white" }}>Selection Status For L3</th>
//                           <th style={{ width: "80px", backgroundColor: "#0d6efd", color: "white" }}>Photo</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredData.map((s, i) => (
//                           <tr key={s._id} className={s.counsellingAttendance ? "table-success" : ""}>
//                             <td className="text-center fw-bold">{i + 1}</td>
//                             <td className="text-center">
//                               <Badge bg="secondary" pill>
//                                 🚪 {s.counsellingRoomNumber || "—"}
//                               </Badge>
//                             </td>
//                             <td className="text-center">
//                               <strong>{s.rollNumber}</strong>
//                             </td>
//                             <td className="text-center">
//                               <Badge bg={s.counsellingAttendance ? "success" : "danger"} pill>
//                                 {s.counsellingAttendance ? "Present" : "Absent"}
//                               </Badge>
//                             </td>
//                             <td className="text-center">{s.srn || "—"}</td>
//                             <td>{s.name || "—"}</td>
//                             <td>{s.father || "—"}</td>
//                             <td className="text-center">{s.mobile || "—"}</td>
//                             <td className="text-center">{s.whatsapp || "—"}</td>
//                             <td className="text-center">{s.omrcontact1 || "—"}</td>
//                             <td className="text-center">
//                               <Badge 
//                                 bg={
//                                   s.selectionStatusForL3 === "Selected" ? "success" : 
//                                   s.selectionStatusForL3 === "Rejected" ? "danger" : 
//                                   "warning"
//                                 } 
//                                 pill
//                               >
//                                 {s.selectionStatusForL3 || "Pending"}
//                               </Badge>
//                             </td>
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
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
                  
//                   {filteredData.length === 0 && (
//                     <Alert variant="info" className="text-center mb-0 mt-3">
//                       <FaInfoCircle className="me-2" />
//                       No students found in selected room.
//                     </Alert>
//                   )}
//                 </Card.Body>
//               </Card>

//               <div className="d-flex justify-content-center gap-3 mb-4">
//                 <Button
//                   onClick={downloadBlankAttendanceTemplate}
//                   variant="outline-secondary"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   Download Blank Format
//                 </Button>

//                 <Button 
//                   onClick={downloadExcel} 
//                   disabled={loading || attendanceData.length === 0}
//                   variant="success"
//                   className="d-flex align-items-center"
//                 >
//                   <FaFileExcel className="me-2" />
//                   {loading ? "Exporting..." : "Download as Excel"}
//                 </Button>

//                 <Button 
//                   onClick={generateAttendancePDFs} 
//                   disabled={loading || attendanceData.length === 0}
//                   variant="danger"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   {loading ? "Generating ZIP..." : "Download All PDFs as ZIP"}
//                 </Button>
//               </div>

//               <Alert variant="info" className="mb-0">
//                 <FaInfoCircle className="me-2" />
//                 <strong>Attendance Summary:</strong> The table shows attendance status from the database.
//                 {Object.keys(groupedAttendanceData).length > 0 && (
//                   <div className="mt-2">
//                     <strong>📊 Room-wise Summary (based on Counselling Room Number):</strong>
//                     <ul className="mb-0 mt-1">
//                       {Object.entries(groupedAttendanceData).map(([room, students]) => (
//                         <li key={room}>
//                           <strong>Room {room}:</strong> {students.length} students 
//                           ({students.filter(s => s.counsellingAttendance).length} Present, 
//                           {students.filter(s => !s.counsellingAttendance).length} Absent)
//                           {Math.ceil(students.length / studentsPerRoom) > 1 && 
//                             ` (will be split into ${Math.ceil(students.length / studentsPerRoom)} PDFs)`
//                           }
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
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
//             <span>Attendance Sheet Generator v4.0 | Grouped by Counselling Room Number</span>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };