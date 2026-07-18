

// // //Level 1 Attendance sheet code

// // import React, { useEffect, useState } from "react";
// // import {
// //   Card,
// //   Table,
// //   Spinner,
// //   Alert,
// //   Badge,
// //   Container,
// //   Row,
// //   Col,
// //   Form,
// //   Button,
// //   ToggleButton,
// // } from "react-bootstrap";
// // import Select from "react-select";
// // import JSZip from "jszip";
// // import { saveAs } from "file-saver";
// // import jsPDF from "jspdf";
// // import "jspdf-autotable";
// // import { FaDownload, FaInfoCircle, FaFilter, FaToggleOn, FaToggleOff } from "react-icons/fa";
// // import { GetCentersDataByExaminationAndExamTypes100 } from "../../services/ExaminationVenue/ExaminationVenueServices";
// // import { GetAttendanceSheetDataS100, markL3AttendanceOfStudents } from "../../services/StudentRegistrationServices/StudentRegistrationService";

// // /* ---------------- IMAGE LOADER ---------------- */
// // const loadImage = (url) =>
// //   new Promise((resolve) => {
// //     if (!url) return resolve(null);
// //     const img = new Image();
// //     img.crossOrigin = "anonymous";
// //     img.onload = () => resolve(img);
// //     img.onerror = () => resolve(null);
// //     img.src = url;
// //   });

// // /* ---------------- CACHE FOR IMAGES ---------------- */
// // const imageCache = new Map();

// // const getCachedImage = async (url) => {
// //   if (!url || !url.startsWith("http")) return null;
  
// //   if (imageCache.has(url)) {
// //     return imageCache.get(url);
// //   }
  
// //   try {
// //     const response = await fetch(url, { mode: "cors" });
// //     const blob = await response.blob();
// //     const reader = new FileReader();
    
// //     return new Promise((resolve) => {
// //       reader.onloadend = () => {
// //         const base64data = reader.result;
// //         imageCache.set(url, base64data);
// //         resolve(base64data);
// //       };
// //       reader.readAsDataURL(blob);
// //     });
// //   } catch (error) {
// //     console.error("Failed to load image:", url, error);
// //     return null;
// //   }
// // };

// // export const S100AttendanceSheet = () => {
// //   const [centers, setCenters] = useState([]);
// //   const [selectedCenter, setSelectedCenter] = useState(null);
// //   const [attendanceData, setAttendanceData] = useState([]);
// //   const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
// //   const [loading, setLoading] = useState(false);
// //   const [loadingData, setLoadingData] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [showPreview, setShowPreview] = useState(false);
  
// //   // New states for attendance marking
// //   const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");
// //   const [updatingAttendance, setUpdatingAttendance] = useState(false);
// //   const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

// //   // New state for batch filter
// //   const [selectedBatch, setSelectedBatch] = useState(null);
// //   const batchOptions = [
// //     { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01 - (19-April-2026 - 21-April-2026)" },
// //     { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02 - (22-April-2026 - 24-April-2026)" },
// //     { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03 - (25-April-2026 - 27-April-2026)" },
// //   ];

// //   // New state for selection status filter
// //   const [selectedSelectionStatus, setSelectedSelectionStatus] = useState(null);
// //   const selectionStatusOptions = [
// //     { value: "Selected", label: "Selected" },
// //     { value: "Waitinglist", label: "Waitinglist" },
// //   ];

// //   // New state for gender filter
// //   const [selectedGender, setSelectedGender] = useState(null);
// //   const genderOptions = [
// //     { value: "MALE", label: "MALE" },
// //     { value: "FEMALE", label: "FEMALE" },
// //     { value: "BOTH", label: "BOTH" },
// //   ];

// //   const logo = "/haryana.png";
// //   const logo2 = "/admitBuniyaLogo.png";
// //   const logo3 = "/vikalpalogonotitle.png";

// //   // Helper function to clean district name (remove everything after hyphen)
// //   const cleanDistrictName = (districtName) => {
// //     if (!districtName || districtName === "Unassigned") return districtName;
// //     const hyphenIndex = districtName.indexOf('-');
// //     if (hyphenIndex !== -1) {
// //       return districtName.substring(0, hyphenIndex).trim();
// //     }
// //     return districtName;
// //   };

// //   // Helper function to get batch label for header
// //   const getBatchLabel = () => {
// //     if (selectedBatch) {
// //       // Extract just "Batch 01", "Batch 02", or "Batch 03" from the full string
// //       const batchMatch = selectedBatch.value.match(/Batch\s\d+/i);
// //       return batchMatch ? batchMatch[0] : selectedBatch.value;
// //     }
// //     return null;
// //   };

// //   /* ---------------- FETCH CENTERS ---------------- */
// //   useEffect(() => {
// //     const fetchCenters = async () => {
// //       setLoading(true);
// //       try {
// //         const res = await GetCentersDataByExaminationAndExamTypes100();
// //         // Ensure unique centers based on examinationVenue name
// //         const uniqueCentersMap = new Map();
// //         (res.data || []).forEach(center => {
// //           const key = center.examinationVenue;
// //           if (!uniqueCentersMap.has(key)) {
// //             uniqueCentersMap.set(key, center);
// //           }
// //         });
// //         const uniqueCenters = Array.from(uniqueCentersMap.values());
// //         setCenters(uniqueCenters || []);
// //         console.log(uniqueCenters)
// //       } catch {
// //         setError("Failed to fetch centers");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchCenters();
// //   }, []);

// //   /* ---------------- GROUP STUDENTS BY DISTRICT ---------------- */
// //   const groupStudentsByDistrict = (students) => {
// //     const grouped = {};
    
// //     students.forEach(student => {
// //       const districtName = student.L2ExaminationDistrict || "Unassigned";
// //       if (!grouped[districtName]) {
// //         grouped[districtName] = [];
// //       }
// //       grouped[districtName].push(student);
// //     });
    
// //     // Sort students within each district: first by father name, then by student name
// //     Object.keys(grouped).forEach(district => {
// //       grouped[district].sort((a, b) => {
// //         // First sort by father name
// //         const fatherCompare = (a.father || "").localeCompare(b.father || "");
// //         if (fatherCompare !== 0) return fatherCompare;
// //         // Then sort by student name
// //         return (a.name || "").localeCompare(b.name || "");
// //       });
// //     });
    
// //     // Sort district names alphabetically
// //     const sortedGrouped = {};
// //     Object.keys(grouped)
// //       .sort((a, b) => {
// //         if (a === "Unassigned") return 1;
// //         if (b === "Unassigned") return -1;
// //         return a.localeCompare(b);
// //       })
// //       .forEach(key => {
// //         sortedGrouped[key] = grouped[key];
// //       });
    
// //     return sortedGrouped;
// //   };

// //   /* ---------------- FETCH ATTENDANCE ---------------- */
// //   const fetchAttendanceData = async () => {
// //     if (!selectedCenter) return setError("Please select a center");
// //     setLoadingData(true);
// //     setError(null);
// //     try {
// //       const payload = {
// //         L2ExaminationCenter: selectedCenter.label,
// //       };
// //       // Add batch filter if selected - send the complete value as is
// //       if (selectedBatch) {
// //         payload.batchDivisionForL2Examination = selectedBatch.value;
// //       }
// //       // Add selection status filter if selected
// //       if (selectedSelectionStatus) {
// //         payload.selectionStatusForL2 = selectedSelectionStatus.value;
// //       }
// //       // Add gender filter if selected
// //       if (selectedGender) {
// //         payload.gender = selectedGender.value;
// //       }
// //       const res = await GetAttendanceSheetDataS100(payload);

// //       // First sort all data by father name then by student name
// //       const sortedData = (res.data || []).sort((a, b) => {
// //         const fatherCompare = (a.father || "").localeCompare(b.father || "");
// //         if (fatherCompare !== 0) return fatherCompare;
// //         return (a.name || "").localeCompare(b.name || "");
// //       });

// //       setAttendanceData(sortedData);
      
// //       // Group students by district
// //       const grouped = groupStudentsByDistrict(sortedData);
// //       setGroupedAttendanceData(grouped);
      
// //       // Reset filters and update status
// //       setSelectedRoomFilter("all");
// //       setAttendanceUpdateStatus({});
// //       setShowPreview(true);
// //     } catch {
// //       setError("Failed to fetch attendance data");
// //     } finally {
// //       setLoadingData(false);
// //     }
// //   };

// //   /* ---------------- HANDLE ATTENDANCE TOGGLE ---------------- */
// //   const handleAttendanceToggle = async (studentId, currentStatus) => {
// //     setUpdatingAttendance(true);
    
// //     // Optimistically update UI
// //     setAttendanceData(prevData => 
// //       prevData.map(student => 
// //         student._id === studentId 
// //           ? { ...student, isPresentInL3Examination: !currentStatus }
// //           : student
// //       )
// //     );
    
// //     // Update grouped data
// //     setGroupedAttendanceData(prevGrouped => {
// //       const newGrouped = { ...prevGrouped };
// //       Object.keys(newGrouped).forEach(district => {
// //         newGrouped[district] = newGrouped[district].map(student =>
// //           student._id === studentId
// //             ? { ...student, isPresentInL3Examination: !currentStatus }
// //             : student
// //         );
// //       });
// //       return newGrouped;
// //     });
    
// //     // Set update status for this student
// //     setAttendanceUpdateStatus(prev => ({ 
// //       ...prev, 
// //       [studentId]: { loading: true, error: null } 
// //     }));
    
// //     try {
// //       const response = await markL3AttendanceOfStudents({
// //         _id: studentId,
// //         isPresentInL3Examination: !currentStatus
// //       });
      
// //       if (response.status === 'OK') {
// //         // Update success status
// //         setAttendanceUpdateStatus(prev => ({ 
// //           ...prev, 
// //           [studentId]: { loading: false, success: true, error: null } 
// //         }));
        
// //         // Clear success message after 2 seconds
// //         setTimeout(() => {
// //           setAttendanceUpdateStatus(prev => {
// //             const newStatus = { ...prev };
// //             delete newStatus[studentId];
// //             return newStatus;
// //           });
// //         }, 2000);
// //       } else {
// //         throw new Error(response.message || 'Update failed');
// //       }
// //     } catch (error) {
// //       console.error("Failed to update attendance:", error);
      
// //       // Revert optimistic update on error
// //       setAttendanceData(prevData => 
// //         prevData.map(student => 
// //           student._id === studentId 
// //             ? { ...student, isPresentInL3Examination: currentStatus }
// //             : student
// //         )
// //       );
      
// //       setGroupedAttendanceData(prevGrouped => {
// //         const newGrouped = { ...prevGrouped };
// //         Object.keys(newGrouped).forEach(district => {
// //           newGrouped[district] = newGrouped[district].map(student =>
// //             student._id === studentId
// //               ? { ...student, isPresentInL3Examination: currentStatus }
// //               : student
// //           );
// //         });
// //         return newGrouped;
// //       });
      
// //       setAttendanceUpdateStatus(prev => ({ 
// //         ...prev, 
// //         [studentId]: { loading: false, success: false, error: error.message } 
// //       }));
      
// //       // Clear error message after 3 seconds
// //       setTimeout(() => {
// //         setAttendanceUpdateStatus(prev => {
// //           const newStatus = { ...prev };
// //           delete newStatus[studentId];
// //           return newStatus;
// //         });
// //       }, 3000);
// //     } finally {
// //       setUpdatingAttendance(false);
// //     }
// //   };

// //   /* ---------------- GET FILTERED DATA FOR DISPLAY ---------------- */
// //   const getFilteredData = () => {
// //     if (selectedRoomFilter === "all") {
// //       return attendanceData;
// //     }
// //     return groupedAttendanceData[selectedRoomFilter] || [];
// //   };

// //   /* ---------------- GET UNIQUE DISTRICTS FOR FILTER ---------------- */
// //   const getDistrictOptions = () => {
// //     const districts = Object.keys(groupedAttendanceData);
// //     return [
// //       { value: "all", label: `📋 All Districts (${attendanceData.length} students)` },
// //       ...districts.map(district => ({
// //         value: district,
// //         label: `🏢 ${district} (${groupedAttendanceData[district].length} students)`
// //       }))
// //     ];
// //   };

// //   const drawDocVerificationTable = async (pdf, students, startY = 45) => {
// //     const imagePromises = students.map((student) =>
// //       student.imageUrl ? getCachedImage(student.imageUrl) : Promise.resolve(null)
// //     );
// //     const imageData = await Promise.all(imagePromises);

// //     const body = students.map((s, i) => [
// //       i + 1,
// //       s.srn || "",
// //       s.name || "",
// //       s.father || "",
// //       s.L2ExaminationBlock || "",
// //       s.school || "",
// //       "",
// //       "",
// //       "",
// //       "",
// //       "",
// //     ]);

// //     pdf.autoTable({
// //       startY,
// //       head: [[
// //         "S.No","SRN","Name","Father","Block","School",
// //         "Photo","Doc","Room","Bed","Remark"
// //       ]],
// //       body,
// //       theme: "grid",
// //       margin: { top: 10, bottom: 15, left: 10, right: 10 },
// //       styles: {
// //         fontSize: 9,
// //         cellPadding: 2,
// //         overflow: "linebreak",
// //         cellWidth: "wrap",
// //       },
// //       headStyles: {
// //         fillColor: [41, 128, 185],
// //         textColor: 255,
// //         fontStyle: "bold",
// //         minCellHeight: 15,
// //         cellPadding: 2,
// //       },
// //       bodyStyles: {
// //         minCellHeight: 25,
// //       },
// //       showHead: "everyPage",
// //       columnStyles: {
// //         0: { cellWidth: 12 },
// //         1: { cellWidth: 25 },
// //         2: { cellWidth: 30 },
// //         3: { cellWidth: 30 },
// //         4: { cellWidth: 25 },
// //         5: { cellWidth: 35 },
// //         6: { cellWidth: 20 },
// //         7: { cellWidth: 15 },
// //         8: { cellWidth: 15 },
// //         9: { cellWidth: 15 },
// //         10: { cellWidth: 55 },
// //       },
// //       didDrawPage: (data) => {
// //         const pageCount = pdf.internal.getNumberOfPages();
// //         pdf.setFontSize(10);
// //         pdf.text(
// //           `Page ${data.pageNumber} of ${pageCount}`,
// //           data.settings.margin.left,
// //           pdf.internal.pageSize.height - 10
// //         );
// //       },
// //       didParseCell: (data) => {
// //         if (data.section === "body" && data.column.index === 6) {
// //           data.cell.imageData = imageData[data.row.index];
// //         }
// //       },
// //       willDrawCell: (data) => {
// //         if (data.section === "body" && data.column.index === 6) {
// //           data.cell.text = "";
// //         }
// //       },
// //       didDrawCell: (data) => {
// //         if (data.section === "body" && data.column.index === 6 && data.cell.imageData) {
// //           try {
// //             const imgSize = Math.min(data.cell.width, data.cell.height) - 4;
// //             pdf.addImage(
// //               data.cell.imageData,
// //               "JPEG",
// //               data.cell.x + (data.cell.width - imgSize) / 2,
// //               data.cell.y + (data.cell.height - imgSize) / 2,
// //               imgSize,
// //               imgSize
// //             );
// //           } catch {
// //             pdf.text("No Image", data.cell.x + 5, data.cell.y + data.cell.height / 2);
// //           }
// //         }
// //       }
// //     });
// //   };

// //   const drawAttendanceTable = async (pdf, students, startY = 45) => {
// //     const body = students.map((s, i) => [
// //       i + 1,
// //       s.srn || "",
// //       s.name || "",
// //       s.father || "",
// //       s.L2ExaminationBlock || "",
// //       s.school || "",
// //       s.orientationRoomNumber || "",
// //       "",
// //       "",
// //     ]);

// //     pdf.autoTable({
// //       startY,
// //       head: [[
// //         "S.No","SRN","Name","Father","Block","School",
// //         "Room No","Bed No","Remark"
// //       ]],
// //       body,
// //       theme: "grid",
// //       margin: { top: 10, bottom: 15, left: 10, right: 10 },
// //       styles: {
// //         fontSize: 9,
// //         cellPadding: 2,
// //         overflow: "linebreak",
// //         cellWidth: "wrap",
// //       },
// //       headStyles: {
// //         fillColor: [41, 128, 185],
// //         textColor: 255,
// //         fontStyle: "bold",
// //         minCellHeight: 15,
// //         cellPadding: 2,
// //       },
// //       bodyStyles: {
// //         minCellHeight: 25,
// //       },
// //       showHead: "everyPage",
// //       columnStyles: {
// //         0: { cellWidth: 12 },
// //         1: { cellWidth: 25 },
// //         2: { cellWidth: 30 },
// //         3: { cellWidth: 30 },
// //         4: { cellWidth: 25 },
// //         5: { cellWidth: 35 },
// //         6: { cellWidth: 20 },
// //         7: { cellWidth: 20 },
// //         8: { cellWidth: 65 },
// //       },
// //       didDrawPage: (data) => {
// //         const pageCount = pdf.internal.getNumberOfPages();
// //         pdf.setFontSize(10);
// //         pdf.text(
// //           `Page ${data.pageNumber} of ${pageCount}`,
// //           data.settings.margin.left,
// //           pdf.internal.pageSize.height - 10
// //         );
// //       }
// //     });
// //   };

// //   /* ---------------- GENERATE DOC VERIFICATION PDFs ---------------- */
// //   const generateDocVerificationPDFs = async () => {
// //     if (!attendanceData.length) {
// //       setError("No data available");
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       const zip = new JSZip();
      
// //       // Clear image cache for new generation
// //       imageCache.clear();

// //       // Generate PDF for each district (entire district in one PDF)
// //       for (const [districtName, students] of Object.entries(groupedAttendanceData)) {
// //         const pdf = new jsPDF("l", "mm", "a4");
// //         const w = pdf.internal.pageSize.getWidth();
// //         const h = pdf.internal.pageSize.getHeight();

// //         // Add logos
// //         if (logo) {
// //           try {
// //             pdf.addImage(logo, "PNG", 10, 8, 20, 20);
// //           } catch (e) {
// //             console.warn("Could not load main logo");
// //           }
// //         }

// //         if (logo3) {
// //           try {
// //             pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
// //           } catch (e) {
// //             console.warn("Could not load secondary logo");
// //           }
// //         }

// //         // Clean district name for header (remove hyphen and everything after it)
// //         const cleanDistrict = cleanDistrictName(districtName);
// //         const batchLabel = getBatchLabel();
        
// //         // Add header text
// //         pdf.setFontSize(16);
// //         pdf.setFont("helvetica", "bold");
// //         pdf.text("HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (2026-28)", w / 2, 18, { align: "center" });
        
// //         pdf.setFontSize(16);
// //         pdf.setFont("helvetica", "bold");
// //         pdf.text("Document Verification Sheet", w / 2, 26, { align: "center" });
        
// //         pdf.setFontSize(11);
// //         pdf.setFont("helvetica", "normal");
// //         pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
        
// //         // Display district name and batch
// //         const headerLine = batchLabel ? `District: ${cleanDistrict}, ${batchLabel}` : `District: ${cleanDistrict}`;
// //         pdf.text(headerLine, w / 2, 32, { align: "center" });

// //         // Draw table with student data
// //         await drawDocVerificationTable(pdf, students);

// //         // Add footer note
// //         pdf.setFontSize(9);
// //         pdf.text(
// //           "Note: Please verify documents and mark accordingly",
// //           10,
// //           h - 5
// //         );

// //         // Clean district name for filename (remove hyphen and everything after it)
// //         const cleanDistrictForFile = cleanDistrictName(districtName).replace(/[^a-z0-9]/gi, '_');
// //         const fileName = `DocVerification_${cleanDistrictForFile}.pdf`;
// //         zip.file(fileName, pdf.output("blob"));
// //       }

// //       // Generate and download zip
// //       const zipBlob = await zip.generateAsync({ type: "blob" });
// //       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
// //       saveAs(zipBlob, `DocVerification_${centerNameForFile}.zip`);
      
// //       setError(null);
// //     } catch (error) {
// //       console.error("PDF generation failed:", error);
// //       setError("PDF generation failed: " + error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------------- GENERATE ATTENDANCE SHEET PDFs ---------------- */
// //   const generateAttendancePDFs = async () => {
// //     if (!attendanceData.length) {
// //       setError("No data available");
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       const zip = new JSZip();

// //       // Generate PDF for each district (entire district in one PDF)
// //       for (const [districtName, students] of Object.entries(groupedAttendanceData)) {
// //         const pdf = new jsPDF("l", "mm", "a4");
// //         const w = pdf.internal.pageSize.getWidth();
// //         const h = pdf.internal.pageSize.getHeight();

// //         // Add logos
// //         if (logo) {
// //           try {
// //             pdf.addImage(logo, "PNG", 10, 8, 20, 20);
// //           } catch (e) {
// //             console.warn("Could not load main logo");
// //           }
// //         }

// //         if (logo3) {
// //           try {
// //             pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
// //           } catch (e) {
// //             console.warn("Could not load secondary logo");
// //           }
// //         }

// //         // Clean district name for header (remove hyphen and everything after it)
// //         const cleanDistrict = cleanDistrictName(districtName);
// //         const batchLabel = getBatchLabel();
        
// //         // Add header text
// //         pdf.setFontSize(16);
// //         pdf.setFont("helvetica", "bold");
// //         pdf.text("HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (2026-28)", w / 2, 18, { align: "center" });
        
// //         pdf.setFontSize(16);
// //         pdf.setFont("helvetica", "bold");
// //         pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
        
// //         pdf.setFontSize(11);
// //         pdf.setFont("helvetica", "normal");
// //         pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
        
// //         // Display district name and batch
// //         const headerLine = batchLabel ? `District: ${cleanDistrict}, ${batchLabel}` : `District: ${cleanDistrict}`;
// //         pdf.text(headerLine, w / 2, 32, { align: "center" });

// //         // Draw attendance table
// //         await drawAttendanceTable(pdf, students);

// //         // Add footer note
// //         pdf.setFontSize(9);
// //         pdf.text(
// //           "Note: Please mark attendance and fill room/bed details",
// //           10,
// //           h - 5
// //         );

// //         // Clean district name for filename (remove hyphen and everything after it)
// //         const cleanDistrictForFile = cleanDistrictName(districtName).replace(/[^a-z0-9]/gi, '_');
// //         const fileName = `Attendance_${cleanDistrictForFile}.pdf`;
// //         zip.file(fileName, pdf.output("blob"));
// //       }

// //       // Generate and download zip
// //       const zipBlob = await zip.generateAsync({ type: "blob" });
// //       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
// //       saveAs(zipBlob, `AttendanceSheets_${centerNameForFile}.zip`);
      
// //       setError(null);
// //     } catch (error) {
// //       console.error("PDF generation failed:", error);
// //       setError("PDF generation failed: " + error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------------- DOWNLOAD BLANK TEMPLATE ---------------- */
// //   const downloadBlankAttendanceTemplate = async () => {
// //     try {
// //       const pdf = new jsPDF("l", "mm", "a4");
// //       const w = pdf.internal.pageSize.getWidth();

// //       // Logos
// //       if (logo) {
// //         try {
// //           pdf.addImage(logo, "PNG", 10, 8, 20, 20);
// //         } catch {}
// //       }

// //       if (logo3) {
// //         try {
// //           pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
// //         } catch {}
// //       }

// //       // Header
// //       pdf.setFontSize(16);
// //       pdf.setFont("helvetica", "bold");
// //       pdf.text(
// //         "HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (2026-28)",
// //         w / 2,
// //         18,
// //         { align: "center" }
// //       );

// //       pdf.text("Document Verification Sheet (Blank Template)", w / 2, 26, { align: "center" });

// //       pdf.setFontSize(11);
// //       pdf.setFont("helvetica", "normal");
// //       pdf.text(
// //         "Center: ________________________________",
// //         w / 2,
// //         34,
// //         { align: "center" }
// //       );

// //       // Blank rows
// //       const blankRows = Array.from({ length: 24 }).map(() => [
// //         "", // S.No
// //         "", // SRN
// //         "", // Name
// //         "", // Father
// //         "", // Block
// //         "", // School
// //         "", // Photo
// //         "", // Doc
// //         "", // Room
// //         "", // Bed
// //         "", // Remark
// //       ]);

// //       pdf.autoTable({
// //         startY: 45,
// //         head: [[
// //           "S.No",
// //           "SRN",
// //           "Name",
// //           "Father",
// //           "Block",
// //           "School",
// //           "Photo",
// //           "Doc",
// //           "Room",
// //           "Bed",
// //           "Remark",
// //         ]],
// //         body: blankRows,
// //         theme: "grid",
// //         styles: {
// //           fontSize: 9,
// //           cellPadding: 4,
// //           minCellHeight: 25,
// //         },
// //         columnStyles: {
// //           0: { cellWidth: 12 },
// //           1: { cellWidth: 25 },
// //           2: { cellWidth: 30 },
// //           3: { cellWidth: 30 },
// //           4: { cellWidth: 25 },
// //           5: { cellWidth: 35 },
// //           6: { cellWidth: 20 },
// //           7: { cellWidth: 15 },
// //           8: { cellWidth: 15 },
// //           9: { cellWidth: 15 },
// //           10: { cellWidth: 35 },
// //         },
// //       });

// //       pdf.save("DocVerification_Blank_Template.pdf");
// //     } catch (err) {
// //       console.error("Blank template generation failed", err);
// //     }
// //   };

// //   /* ---------------- UI ---------------- */
// //   const filteredData = getFilteredData();
// //   const districtOptions = getDistrictOptions();

// //   // Convert centers to format for Select component
// //   const centerOptions = centers.map(center => ({
// //     value: center._id,
// //     label: center.examinationVenue,
// //     capacity: center.capacity || 0
// //   }));

// //   return (
// //     <Container fluid className="py-4">
// //       <Card className="shadow">
// //         <Card.Header className="bg-primary text-white d-flex align-items-center">
// //           <FaFilter className="me-2" /> 
// //           <h5 className="mb-0">HS 100 L-2 ATTENDANCE & DOC VERIFICATION SHEETS</h5>
// //         </Card.Header>

// //         <Card.Body>
// //           {error && (
// //             <Alert variant="danger" onClose={() => setError(null)} dismissible>
// //               <FaInfoCircle className="me-2" />
// //               {error}
// //             </Alert>
// //           )}

// //           <Row className="mb-4">
// //             <Col md={6}>
// //               <Form.Group>
// //                 <Form.Label>Examination Center</Form.Label>
// //                 <Select
// //                   placeholder="Select Examination Center"
// //                   options={centerOptions}
// //                   isClearable
// //                   onChange={(center) => {
// //                     setSelectedCenter(center);
// //                     setShowPreview(false);
// //                   }}
// //                   value={selectedCenter}
// //                 />
// //                 {selectedCenter?.capacity && (
// //                   <Form.Text className="text-muted">
// //                     Capacity: {selectedCenter.capacity} students
// //                   </Form.Text>
// //                 )}
// //               </Form.Group>
// //             </Col>
// //           </Row>

// //           {/* Filter Row */}
// //           <Row className="mb-4">
// //             <Col md={4}>
// //               <Form.Group>
// //                 <Form.Label>Batch</Form.Label>
// //                 <Select
// //                   placeholder="Select Batch"
// //                   options={batchOptions}
// //                   isClearable
// //                   onChange={(batch) => {
// //                     setSelectedBatch(batch);
// //                     setShowPreview(false);
// //                   }}
// //                   value={selectedBatch}
// //                 />
// //               </Form.Group>
// //             </Col>

// //             <Col md={4}>
// //               <Form.Group>
// //                 <Form.Label>Selection Status</Form.Label>
// //                 <Select
// //                   placeholder="Select Selection Status"
// //                   options={selectionStatusOptions}
// //                   isClearable
// //                   onChange={(status) => {
// //                     setSelectedSelectionStatus(status);
// //                     setShowPreview(false);
// //                   }}
// //                   value={selectedSelectionStatus}
// //                 />
// //               </Form.Group>
// //             </Col>

// //             <Col md={4}>
// //               <Form.Group>
// //                 <Form.Label>Gender</Form.Label>
// //                 <Select
// //                   placeholder="Select Gender"
// //                   options={genderOptions}
// //                   isClearable
// //                   onChange={(gender) => {
// //                     setSelectedGender(gender);
// //                     setShowPreview(false);
// //                   }}
// //                   value={selectedGender}
// //                 />
// //               </Form.Group>
// //             </Col>
// //           </Row>

// //           <div className="text-center mb-4">
// //             <Button 
// //               onClick={fetchAttendanceData} 
// //               disabled={loadingData || !selectedCenter}
// //               variant="primary"
// //               size="lg"
// //               className="px-5"
// //             >
// //               {loadingData ? (
// //                 <>
// //                   <Spinner animation="border" size="sm" className="me-2" />
// //                   Loading Data...
// //                 </>
// //               ) : (
// //                 "Get Student Data"
// //               )}
// //             </Button>
// //           </div>

// //           {showPreview && attendanceData.length > 0 && (
// //             <>
// //               {/* District Filter and Controls */}
// //               <Card className="mb-4">
// //                 <Card.Header className="bg-light">
// //                   <Row className="align-items-center">
// //                     <Col md={5}>
// //                       <h6 className="mb-0">
// //                         📊 Student Data Overview
// //                         <Badge bg="info" className="ms-2">
// //                           🏢 {Object.keys(groupedAttendanceData).length} Districts
// //                         </Badge>
// //                         <Badge bg="success" className="ms-2">
// //                           ✅ {attendanceData.filter(s => s.isPresentInL3Examination).length} Present
// //                         </Badge>
// //                         <Badge bg="secondary" className="ms-2">
// //                           ❌ {attendanceData.filter(s => !s.isPresentInL3Examination).length} Absent
// //                         </Badge>
// //                       </h6>
// //                     </Col>
// //                     <Col md={7}>
// //                       <Form.Group>
// //                         <Form.Label className="mb-1">
// //                           <FaFilter className="me-1" /> Filter by District
// //                         </Form.Label>
// //                         <Select
// //                           options={districtOptions}
// //                           value={districtOptions.find(opt => opt.value === selectedRoomFilter)}
// //                           onChange={(option) => setSelectedRoomFilter(option?.value || "all")}
// //                           placeholder="Select District"
// //                           isClearable={false}
// //                           styles={{
// //                             menu: (provided) => ({ ...provided, zIndex: 9999 }),
// //                             control: (provided) => ({ ...provided, backgroundColor: '#fff' })
// //                           }}
// //                         />
// //                       </Form.Group>
// //                     </Col>
// //                   </Row>
// //                 </Card.Header>
// //                 <Card.Body>
// //                   <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
// //                     <Table bordered hover size="sm" className="mb-0">
// //                       <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 5 }}>
// //                         <tr>
// //                           <th style={{ width: "50px", backgroundColor: "#0d6efd", color: "white" }}>S.No</th>
// //                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>District</th>
// //                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>SRN</th>
// //                           <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Name</th>
// //                           <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Father</th>
// //                           <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>Block</th>
// //                           <th style={{ width: "200px", backgroundColor: "#0d6efd", color: "white" }}>School</th>
// //                           <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>Room No</th>
// //                           <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {filteredData.map((s, i) => (
// //                           <tr key={s._id} className={s.isPresentInL3Examination ? "table-success" : ""}>
// //                             <td className="text-center fw-bold">{i + 1}</td>
// //                             <td className="text-center">
// //                               <Badge bg="info" pill>
// //                                 🏢 {cleanDistrictName(s.L2ExaminationDistrict) || "—"}
// //                               </Badge>
// //                             </td>
// //                             <td className="text-center">{s.srn || "—"}</td>
// //                             <td>{s.name || "—"}</td>
// //                             <td>{s.father || "—"}</td>
// //                             <td>{s.L2ExaminationBlock || "—"}</td>
// //                             <td className="small">{s.school || "—"}</td>
// //                             <td className="text-center">{s.orientationRoomNumber || "—"}</td>
// //                             <td>
// //                               <ToggleButton
// //                                 type="checkbox"
// //                                 variant={s.isPresentInL3Examination ? "success" : "outline-secondary"}
// //                                 checked={s.isPresentInL3Examination}
// //                                 value="1"
// //                                 onClick={() => {
// //                                   console.log('Toggle clicked for student:', s);
// //                                   console.log('Student ID:', s._id);
// //                                   handleAttendanceToggle(s._id, s.isPresentInL3Examination);
// //                                 }}
// //                                 disabled={updatingAttendance && attendanceUpdateStatus[s._id]?.loading}
// //                                 style={{ width: "130px" }}
// //                                 size="sm"
// //                               >
// //                                 {attendanceUpdateStatus[s._id]?.loading ? (
// //                                   <Spinner animation="border" size="sm" />
// //                                 ) : s.isPresentInL3Examination ? (
// //                                   <>
// //                                     <FaToggleOn className="me-1" /> Present
// //                                   </>
// //                                 ) : (
// //                                   <>
// //                                     <FaToggleOff className="me-1" /> Absent
// //                                   </>
// //                                 )}
// //                               </ToggleButton>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </Table>
// //                   </div>
                  
// //                   {filteredData.length === 0 && (
// //                     <Alert variant="info" className="text-center mb-0 mt-3">
// //                       <FaInfoCircle className="me-2" />
// //                       No students found in selected district.
// //                     </Alert>
// //                   )}
// //                 </Card.Body>
// //               </Card>

// //               <div className="d-flex justify-content-center gap-3 mb-4">
// //                 <Button
// //                   onClick={downloadBlankAttendanceTemplate}
// //                   variant="outline-secondary"
// //                   className="d-flex align-items-center"
// //                 >
// //                   <FaDownload className="me-2" />
// //                   Download Blank Format
// //                 </Button>

// //                 <Button 
// //                   onClick={generateDocVerificationPDFs} 
// //                   disabled={loading || attendanceData.length === 0}
// //                   variant="warning"
// //                   className="d-flex align-items-center"
// //                 >
// //                   <FaDownload className="me-2" />
// //                   {loading ? "Generating ZIP..." : "Download Doc Verification Sheets"}
// //                 </Button>

// //                 <Button 
// //                   onClick={generateAttendancePDFs} 
// //                   disabled={loading || attendanceData.length === 0}
// //                   variant="success"
// //                   className="d-flex align-items-center"
// //                 >
// //                   <FaDownload className="me-2" />
// //                   {loading ? "Generating ZIP..." : "Download Attendance Sheets"}
// //                 </Button>
// //               </div>

// //               {/* <Alert variant="info" className="mb-0">
// //                 <FaInfoCircle className="me-2" />
// //                 <strong>Digital Attendance Marking:</strong> Click on the toggle button to mark students as Present/Absent. 
// //                 The status will be saved immediately to the database. 
// //                 {Object.keys(groupedAttendanceData).length > 0 && (
// //                   <div className="mt-2">
// //                     <strong>📊 District-wise Summary:</strong>
// //                     <ul className="mb-0 mt-1">
// //                       {Object.entries(groupedAttendanceData).map(([district, students]) => (
// //                         <li key={district}>
// //                           <strong>{cleanDistrictName(district)}:</strong> {students.length} students 
// //                           ({students.filter(s => s.isPresentInL3Examination).length} Present, 
// //                           {students.filter(s => !s.isPresentInL3Examination).length} Absent)
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 )}
// //               </Alert> */}
// //             </>
// //           )}

// //           {showPreview && attendanceData.length === 0 && (
// //             <Alert variant="warning" className="text-center">
// //               <FaInfoCircle className="me-2" />
// //               No data found for the selected center with applied filters.
// //             </Alert>
// //           )}
// //         </Card.Body>
        
// //         <Card.Footer className="text-muted small">
// //           <div className="d-flex justify-content-between">
// //             <span>Total Centers: {centers.length}</span>
// //             <span>Document Verification & Attendance Sheet Generator</span>
// //           </div>
// //         </Card.Footer>
// //       </Card>
// //     </Container>
// //   );
// // };






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

// export const S100AttendanceSheet = () => {
//   const [centers, setCenters] = useState([]);
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
  
//   // New states for attendance marking
//   const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");
//   const [updatingAttendance, setUpdatingAttendance] = useState(false);
//   const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

//   // New state for batch filter
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const batchOptions = [
//     // { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01 - (19-April-2026 - 21-April-2026)" },
//     // { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02 - (22-April-2026 - 24-April-2026)" },
//     // { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03 - (25-April-2026 - 27-April-2026)" },

//     { value: "s100-extended-100-seats", label: "s100-extended-100-seats" },
//   ];

//   // New state for selection status filter
//   const [selectedSelectionStatus, setSelectedSelectionStatus] = useState(null);
//   const selectionStatusOptions = [
//     { value: "Selected", label: "Selected" },
//     // { value: "Waitinglist", label: "Waitinglist" },
//   ];

//   // New state for gender filter
//   const [selectedGender, setSelectedGender] = useState(null);
//   const genderOptions = [
//     { value: "MALE", label: "MALE" },
//     { value: "FEMALE", label: "FEMALE" },
//     { value: "BOTH", label: "BOTH" },
//   ];

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
//       // Extract just "Batch 01", "Batch 02", or "Batch 03" from the full string
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
//         // Ensure unique centers based on examinationVenue name
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
    
//     // Sort students within each district: ONLY by student name
//     Object.keys(grouped).forEach(district => {
//       grouped[district].sort((a, b) => {
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
//         L2ExaminationCenter: "HARYANA SUPER 100 CAMPUS, VILLAGE BARNA, DHAND ROAD, KURUKSHETRA", //selectedCenter.label,
//       };
//       // Add batch filter if selected - send the complete value as is
//       if (selectedBatch) {
//         payload.batchDivisionForL2Examination = selectedBatch.value;
//       }
//       // Add selection status filter if selected
//       if (selectedSelectionStatus) {
//         payload.selectionStatusForL2 = selectedSelectionStatus.value;
//       }
//       // Add gender filter if selected
//       if (selectedGender) {
//         payload.gender = selectedGender.value;
//       }
//       const res = await GetAttendanceSheetDataS100(payload);

//       // First sort all data ONLY by student name
//       const sortedData = (res.data || []).sort((a, b) => {
//         return (a.name || "").localeCompare(b.name || "");
//       });

//       setAttendanceData(sortedData);
      
//       // Group students by district
//       const grouped = groupStudentsByDistrict(sortedData);
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
//       Object.keys(newGrouped).forEach(district => {
//         newGrouped[district] = newGrouped[district].map(student =>
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
//     const body = students.map((s, i) => [
//       i + 1,
//       s.srn || "",
//       s.name || "",
//       s.father || "",
//       cleanDistrictName(s.L2ExaminationDistrict) || "",
//       s.L2ExaminationBlock || "",
//       s.school || "",
//       "",
//       "",
//       "",
//     ]);

//     pdf.autoTable({
//       startY,
//       head: [[
//         "S.No","SRN","Name","Father","District","Block","School",
//         "Doc","Room","Remark"
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
//         5: { cellWidth: 25 },
//         6: { cellWidth: 35 },
//         7: { cellWidth: 15 },
//         8: { cellWidth: 15 },
//         9: { cellWidth: 55 },
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

//   const drawAttendanceTable = async (pdf, students, startY = 45) => {
//     const body = students.map((s, i) => [
//       i + 1,
//       s.srn || "",
//       s.name || "",
//       s.father || "",
//       cleanDistrictName(s.L2ExaminationDistrict) || "",
//       s.L2ExaminationBlock || "",
//       s.school || "",
//       s.orientationRoomNumber || "",
//       "",
//     ]);

//     pdf.autoTable({
//       startY,
//       head: [[
//         "S.No","SRN","Name","Father","District","Block","School",
//         "Room No","Remark"
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
//         5: { cellWidth: 25 },
//         6: { cellWidth: 35 },
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

//   /* ---------------- GENERATE DOC VERIFICATION PDF (Single PDF) ---------------- */
//   const generateDocVerificationPDF = async () => {
//     if (!attendanceData.length) {
//       setError("No data available");
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

//       const batchLabel = getBatchLabel();
      
//       // Add header text
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (2026-28)", w / 2, 18, { align: "center" });
      
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("Document Verification Sheet", w / 2, 26, { align: "center" });
      
//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
      
//       // Display batch info
//       if (batchLabel) {
//         pdf.text(batchLabel, w / 2, 32, { align: "center" });
//       }

//       // Draw table with all student data (sorted by student name)
//       await drawDocVerificationTable(pdf, attendanceData);

//       // Add footer note
//       pdf.setFontSize(9);
//       pdf.text(
//         "Note: Please verify documents and mark accordingly",
//         10,
//         h - 5
//       );

//       // Generate and download single PDF
//       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
//       pdf.save(`DocVerification_${centerNameForFile}.pdf`);
      
//       setError(null);
//     } catch (error) {
//       console.error("PDF generation failed:", error);
//       setError("PDF generation failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- GENERATE ATTENDANCE SHEET PDF (Single PDF) ---------------- */
//   const generateAttendancePDF = async () => {
//     if (!attendanceData.length) {
//       setError("No data available");
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

//       const batchLabel = getBatchLabel();
      
//       // Add header text
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (2026-28)", w / 2, 18, { align: "center" });
      
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
      
//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
      
//       // Display batch info
//       if (batchLabel) {
//         pdf.text(batchLabel, w / 2, 32, { align: "center" });
//       }

//       // Draw attendance table with all student data (sorted by student name)
//       await drawAttendanceTable(pdf, attendanceData);

//       // Add footer note
//       pdf.setFontSize(9);
//       pdf.text(
//         "Note: Please mark attendance and fill room/bed details",
//         10,
//         h - 5
//       );

//       // Generate and download single PDF
//       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
//       pdf.save(`AttendanceSheet_${centerNameForFile}.pdf`);
      
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

//       // Blank rows
//       const blankRows = Array.from({ length: 24 }).map(() => [
//         "", // S.No
//         "", // SRN
//         "", // Name
//         "", // Father
//         "", // District
//         "", // Block
//         "", // School
//         "", // Doc
//         "", // Room
//         "", // Remark
//       ]);

//       pdf.autoTable({
//         startY: 45,
//         head: [[
//           "S.No",
//           "SRN",
//           "Name",
//           "Father",
//           "District",
//           "Block",
//           "School",
//           "Doc",
//           "Room",
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
//           5: { cellWidth: 25 },
//           6: { cellWidth: 35 },
//           7: { cellWidth: 15 },
//           8: { cellWidth: 15 },
//           9: { cellWidth: 55 },
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

//   // Convert centers to format for Select component
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
//                   onClick={generateDocVerificationPDF} 
//                   disabled={loading || attendanceData.length === 0}
//                   variant="warning"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   {loading ? "Generating PDF..." : "Download Doc Verification Sheet"}
//                 </Button>

//                 <Button 
//                   onClick={generateAttendancePDF} 
//                   disabled={loading || attendanceData.length === 0}
//                   variant="success"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   {loading ? "Generating PDF..." : "Download Attendance Sheet"}
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
//             <span>Document Verification & Attendance Sheet Generator</span>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };











//Come here




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

// export const S100AttendanceSheet = () => {
//   const [centers, setCenters] = useState([]);
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
  
//   // New states for attendance marking
//   const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");
//   const [updatingAttendance, setUpdatingAttendance] = useState(false);
//   const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

//   // New state for batch filter
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const batchOptions = [
//     // { value: "Batch 01 - (19-April-2026 - 21-April-2026)", label: "Batch 01 - (19-April-2026 - 21-April-2026)" },
//     // { value: "Batch 02 - (22-April-2026 - 24-April-2026)", label: "Batch 02 - (22-April-2026 - 24-April-2026)" },
//     // { value: "Batch 03 - (25-April-2026 - 27-April-2026)", label: "Batch 03 - (25-April-2026 - 27-April-2026)" },
//     { value: "s100-extended-100-seats", label: "s100-extended-100-seats" },

//   ];

//   // New state for selection status filter
//   const [selectedSelectionStatus, setSelectedSelectionStatus] = useState(null);
//   const selectionStatusOptions = [
//     { value: "Selected", label: "Selected" },
//     // { value: "Waitinglist", label: "Waitinglist" },
//   ];

//   // New state for gender filter
//   const [selectedGender, setSelectedGender] = useState(null);
//   const genderOptions = [
//     { value: "MALE", label: "MALE" },
//     { value: "FEMALE", label: "FEMALE" },
//     { value: "BOTH", label: "BOTH" },
//   ];

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
//       // Extract just "Batch 01", "Batch 02", or "Batch 03" from the full string
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
//         // Ensure unique centers based on examinationVenue name
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

//   /* ---------------- SORT DATA BY DISTRICT AND NAME ---------------- */
//   const sortDataByDistrictAndName = (students) => {
//     if (!students || students.length === 0) return [];
    
//     return [...students].sort((a, b) => {
//       // First sort by district
//       const districtA = cleanDistrictName(a.L2ExaminationDistrict || "Unassigned");
//       const districtB = cleanDistrictName(b.L2ExaminationDistrict || "Unassigned");
      
//       if (districtA < districtB) return -1;
//       if (districtA > districtB) return 1;
      
//       // Then sort by student name within same district
//       const nameA = (a.name || "").toUpperCase();
//       const nameB = (b.name || "").toUpperCase();
      
//       if (nameA < nameB) return -1;
//       if (nameA > nameB) return 1;
      
//       return 0;
//     });
//   };

//   /* ---------------- GROUP STUDENTS BY DISTRICT ---------------- */
//   const groupStudentsByDistrict = (students) => {
//     const grouped = {};
    
//     students.forEach(student => {
//       const districtName = cleanDistrictName(student.L2ExaminationDistrict) || "Unassigned";
//       if (!grouped[districtName]) {
//         grouped[districtName] = [];
//       }
//       grouped[districtName].push(student);
//     });
    
//     // Sort students within each district by name only
//     Object.keys(grouped).forEach(district => {
//       grouped[district].sort((a, b) => {
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
//         L2ExaminationCenter: "HARYANA SUPER 100 CAMPUS, VILLAGE BARNA, DHAND ROAD, KURUKSHETRA", //selectedCenter.label

        
//       };
//       // Add batch filter if selected - send the complete value as is
//       if (selectedBatch) {
//         payload.batchDivisionForL2Examination = selectedBatch.value;
//       }
//       // Add selection status filter if selected
//       if (selectedSelectionStatus) {
//         payload.selectionStatusForL2 = selectedSelectionStatus.value;
//       }
//       // Add gender filter if selected
//       if (selectedGender) {
//         payload.gender = selectedGender.value;
//       }
//       const res = await GetAttendanceSheetDataS100(payload);

//       // Sort data by district and then by student name
//       const sortedData = sortDataByDistrictAndName(res.data || []);

//       setAttendanceData(sortedData);
      
//       // Group students by district
//       const grouped = groupStudentsByDistrict(sortedData);
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
//       Object.keys(newGrouped).forEach(district => {
//         newGrouped[district] = newGrouped[district].map(student =>
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
//     const body = students.map((s, i) => [
//       i + 1,
//       s.srn || "",
//       s.name || "",
//       s.father || "",
//       cleanDistrictName(s.L1ExaminationDistrict) || "",
//       s.L1ExaminationBlock || "",
//       s.school || "",
//       "",
//       "",
//       "",
//     ]);

//     pdf.autoTable({
//       startY,
//       head: [[
//         "S.No","SRN","Name","Father","District","Block","School",
//         "Doc","Room","Remark"
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
//       alternateRowStyles: {
//         fillColor: [240, 240, 240], // Lightest grey for alternate rows
//       },
//       showHead: "everyPage",
//       columnStyles: {
//         0: { cellWidth: 12 },
//         1: { cellWidth: 25 },
//         2: { cellWidth: 30 },
//         3: { cellWidth: 30 },
//         4: { cellWidth: 25 },
//         5: { cellWidth: 25 },
//         6: { cellWidth: 35 },
//         7: { cellWidth: 15 },
//         8: { cellWidth: 15 },
//         9: { cellWidth: 55 },
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

//   const drawAttendanceTable = async (pdf, students, startY = 45) => {
//     const body = students.map((s, i) => [
//       i + 1,
//       s.srn || "",
//       s.name || "",
//       s.father || "",
//       cleanDistrictName(s.L1ExaminationDistrict) || "",
//       s.L1ExaminationBlock || "",
//       s.school || "",
//       s.orientationRoomNumber || "",
//       "",
//     ]);

//     pdf.autoTable({
//       startY,
//       head: [[
//         "S.No","SRN","Name","Father","District","Block","School",
//         "Room No","Remark"
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
//       alternateRowStyles: {
//         fillColor: [240, 240, 240], // Lightest grey for alternate rows
//       },
//       showHead: "everyPage",
//       columnStyles: {
//         0: { cellWidth: 12 },
//         1: { cellWidth: 25 },
//         2: { cellWidth: 30 },
//         3: { cellWidth: 30 },
//         4: { cellWidth: 25 },
//         5: { cellWidth: 25 },
//         6: { cellWidth: 35 },
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

//   /* ---------------- GENERATE DOC VERIFICATION PDF (Single PDF) ---------------- */
//   const generateDocVerificationPDF = async () => {
//     if (!attendanceData.length) {
//       setError("No data available");
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

//       const batchLabel = getBatchLabel();
      
//       // Add header text
//       pdf.setFontSize(14);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (Extended 100 Seats) - 2026", w / 2, 18, { align: "center" });
      
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("Document Verification Sheet", w / 2, 26, { align: "center" });
      
//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
      
//       // Display batch info
//       if (batchLabel) {
//         pdf.text(batchLabel, w / 2, 32, { align: "center" });
//       }

//       // Draw table with all student data (sorted by district and name)
//       await drawDocVerificationTable(pdf, attendanceData);

//       // Add footer note
//       pdf.setFontSize(9);
//       pdf.text(
//         "Note: Please verify documents and mark accordingly",
//         10,
//         h - 5
//       );

//       // Generate and download single PDF
//       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
//       pdf.save(`DocVerification_${centerNameForFile}.pdf`);
      
//       setError(null);
//     } catch (error) {
//       console.error("PDF generation failed:", error);
//       setError("PDF generation failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- GENERATE ATTENDANCE SHEET PDF (Single PDF) ---------------- */
//   const generateAttendancePDF = async () => {
//     if (!attendanceData.length) {
//       setError("No data available");
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

//       const batchLabel = getBatchLabel();
      
//       // Add header text
//       pdf.setFontSize(14);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (EXTENDED 100 SEATS) - 2026", w / 2, 18, { align: "center" });
      
//       pdf.setFontSize(16);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
      
//       pdf.setFontSize(11);
//       pdf.setFont("helvetica", "normal");
//       pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
      
//       // Display batch info
//       if (batchLabel) {
//         pdf.text(batchLabel, w / 2, 32, { align: "center" });
//       }

//       // Draw attendance table with all student data (sorted by district and name)
//       await drawAttendanceTable(pdf, attendanceData);

//       // Add footer note
//       pdf.setFontSize(9);
//       pdf.text(
//         "Note: Please mark attendance and fill room/bed details",
//         10,
//         h - 5
//       );

//       // Generate and download single PDF
//       const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
//       pdf.save(`AttendanceSheet_${centerNameForFile}.pdf`);
      
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

//       // Blank rows
//       const blankRows = Array.from({ length: 24 }).map(() => [
//         "", // S.No
//         "", // SRN
//         "", // Name
//         "", // Father
//         "", // District
//         "", // Block
//         "", // School
//         "", // Doc
//         "", // Room
//         "", // Remark
//       ]);

//       pdf.autoTable({
//         startY: 45,
//         head: [[
//           "S.No",
//           "SRN",
//           "Name",
//           "Father",
//           "District",
//           "Block",
//           "School",
//           "Doc",
//           "Room",
//           "Remark",
//         ]],
//         body: blankRows,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 4,
//           minCellHeight: 25,
//         },
//         alternateRowStyles: {
//           fillColor: [240, 240, 240], // Lightest grey for alternate rows
//         },
//         columnStyles: {
//           0: { cellWidth: 12 },
//           1: { cellWidth: 25 },
//           2: { cellWidth: 30 },
//           3: { cellWidth: 30 },
//           4: { cellWidth: 25 },
//           5: { cellWidth: 25 },
//           6: { cellWidth: 35 },
//           7: { cellWidth: 15 },
//           8: { cellWidth: 15 },
//           9: { cellWidth: 55 },
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

//   // Convert centers to format for Select component
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
//                   onClick={generateDocVerificationPDF} 
//                   disabled={loading || attendanceData.length === 0}
//                   variant="warning"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   {loading ? "Generating PDF..." : "Download Doc Verification Sheet"}
//                 </Button>

//                 <Button 
//                   onClick={generateAttendancePDF} 
//                   disabled={loading || attendanceData.length === 0}
//                   variant="success"
//                   className="d-flex align-items-center"
//                 >
//                   <FaDownload className="me-2" />
//                   {loading ? "Generating PDF..." : "Download Attendance Sheet"}
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
//             <span>Document Verification & Attendance Sheet Generator</span>
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

export const S100AttendanceSheet = () => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [groupedAttendanceData, setGroupedAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // New states for attendance marking
  const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");
  const [updatingAttendance, setUpdatingAttendance] = useState(false);
  const [attendanceUpdateStatus, setAttendanceUpdateStatus] = useState({});

  // New state for batch filter
  const [selectedBatch, setSelectedBatch] = useState(null);
  const batchOptions = [
    { value: "s100-extended-100-seats", label: "s100-extended-100-seats" },
  ];

  // New state for selection status filter
  const [selectedSelectionStatus, setSelectedSelectionStatus] = useState(null);
  const selectionStatusOptions = [
    { value: "Selected", label: "Selected" },
  ];

  // New state for gender filter
  const [selectedGender, setSelectedGender] = useState(null);
  const genderOptions = [
    { value: "MALE", label: "MALE" },
    { value: "FEMALE", label: "FEMALE" },
    { value: "BOTH", label: "BOTH" },
  ];

  const logo = "/haryana.png";
  const logo2 = "/admitBuniyaLogo.png";
  const logo3 = "/vikalpalogonotitle.png";

  // Helper function to clean district name (remove everything after hyphen)
  const cleanDistrictName = (districtName) => {
    if (!districtName || districtName === "Unassigned") return districtName;
    const hyphenIndex = districtName.indexOf('-');
    if (hyphenIndex !== -1) {
      return districtName.substring(0, hyphenIndex).trim();
    }
    return districtName;
  };

  // Helper function to get batch label for header
  const getBatchLabel = () => {
    if (selectedBatch) {
      const batchMatch = selectedBatch.value.match(/Batch\s\d+/i);
      return batchMatch ? batchMatch[0] : selectedBatch.value;
    }
    return null;
  };

  /* ---------------- FETCH CENTERS ---------------- */
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
        console.log(uniqueCenters)
      } catch {
        setError("Failed to fetch centers");
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  /* ---------------- SORT DATA BY DISTRICT AND NAME ---------------- */
  const sortDataByDistrictAndName = (students) => {
    if (!students || students.length === 0) return [];
    
    return [...students].sort((a, b) => {
      const districtA = cleanDistrictName(a.L2ExaminationDistrict || "Unassigned");
      const districtB = cleanDistrictName(b.L2ExaminationDistrict || "Unassigned");
      
      if (districtA < districtB) return -1;
      if (districtA > districtB) return 1;
      
      const nameA = (a.name || "").toUpperCase();
      const nameB = (b.name || "").toUpperCase();
      
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      
      return 0;
    });
  };

  /* ---------------- GROUP STUDENTS BY DISTRICT ---------------- */
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
        return (a.name || "").localeCompare(b.name || "");
      });
    });
    
    const sortedGrouped = {};
    Object.keys(grouped)
      .sort((a, b) => {
        if (a === "Unassigned") return 1;
        if (b === "Unassigned") return -1;
        return a.localeCompare(b);
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
      const payload = {
        L2ExaminationCenter: "HARYANA SUPER 100 CAMPUS, VILLAGE BARNA, DHAND ROAD, KURUKSHETRA", //selectedCenter.label,
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

      const sortedData = sortDataByDistrictAndName(res.data || []);
      setAttendanceData(sortedData);
      
      const grouped = groupStudentsByDistrict(sortedData);
      setGroupedAttendanceData(grouped);
      
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
    
    setAttendanceData(prevData => 
      prevData.map(student => 
        student._id === studentId 
          ? { ...student, isPresentInL3Examination: !currentStatus }
          : student
      )
    );
    
    setGroupedAttendanceData(prevGrouped => {
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
      
      setAttendanceData(prevData => 
        prevData.map(student => 
          student._id === studentId 
            ? { ...student, isPresentInL3Examination: currentStatus }
            : student
        )
      );
      
      setGroupedAttendanceData(prevGrouped => {
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

  /* ---------------- GET FILTERED DATA FOR DISPLAY ---------------- */
  const getFilteredData = () => {
    if (selectedRoomFilter === "all") {
      return attendanceData;
    }
    return groupedAttendanceData[selectedRoomFilter] || [];
  };

  /* ---------------- GET UNIQUE DISTRICTS FOR FILTER ---------------- */
  const getDistrictOptions = () => {
    const districts = Object.keys(groupedAttendanceData);
    return [
      { value: "all", label: `📋 All Districts (${attendanceData.length} students)` },
      ...districts.map(district => ({
        value: district,
        label: `🏢 ${district} (${groupedAttendanceData[district].length} students)`
      }))
    ];
  };

  /* ---------------- DRAW DOC VERIFICATION TABLE ---------------- */
  const drawDocVerificationTable = async (pdf, students, startY = 45) => {
    const body = students.map((s, i) => [
      i + 1,
      s.srn || "",
      s.name || "",
      s.father || "",
      cleanDistrictName(s.L1ExaminationDistrict) || "",
      s.L1ExaminationBlock || "",
      s.school || "",
      "",
      "",
      "",
    ]);

    pdf.autoTable({
      startY,
      head: [[
        "S.No","SRN","Name","Father","District","Block","School",
        "Doc","Room","Remark"
      ]],
      body,
      theme: "grid",
      margin: { top: 10, bottom: 15, left: 10, right: 10 },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        overflow: "linebreak",
        cellWidth: "wrap",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        minCellHeight: 15,
        cellPadding: 2,
      },
      bodyStyles: {
        minCellHeight: 25,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      showHead: "everyPage",
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 35 },
        7: { cellWidth: 15 },
        8: { cellWidth: 15 },
        9: { cellWidth: 55 },
      },
      didDrawPage: (data) => {
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          pdf.internal.pageSize.height - 10
        );
      }
    });
  };

  /* ---------------- DRAW ATTENDANCE TABLE (UPDATED - ONLY SIGNATURE) ---------------- */
  const drawAttendanceTable = async (pdf, students, startY = 45) => {
    const body = students.map((s, i) => [
      i + 1,
      s.srn || "",
      s.name || "",
      s.father || "",
      cleanDistrictName(s.L1ExaminationDistrict) || "",
      s.L1ExaminationBlock || "",
      s.school || "",
      "", // Signature column (empty for manual signature)
    ]);

    pdf.autoTable({
      startY,
      head: [[
        "S.No", "SRN", "Name", "Father", "District", "Block", "School",
        "Signature"
      ]],
      body,
      theme: "grid",
      margin: { top: 10, bottom: 15, left: 10, right: 10 },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        overflow: "linebreak",
        cellWidth: "wrap",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        minCellHeight: 15,
        cellPadding: 2,
      },
      bodyStyles: {
        minCellHeight: 30,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      showHead: "everyPage",
      columnStyles: {
        0: { cellWidth: 12 },     // S.No
        1: { cellWidth: 25 },     // SRN
        2: { cellWidth: 30 },     // Name
        3: { cellWidth: 30 },     // Father
        4: { cellWidth: 25 },     // District
        5: { cellWidth: 25 },     // Block
        6: { cellWidth: 35 },     // School
        7: { cellWidth: 60 },     // Signature (increased width)
      },
      didDrawPage: (data) => {
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          pdf.internal.pageSize.height - 10
        );
      }
    });
  };

  /* ---------------- GENERATE DOC VERIFICATION PDF ---------------- */
  const generateDocVerificationPDF = async () => {
    if (!attendanceData.length) {
      setError("No data available");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const pdf = new jsPDF("l", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();

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

      const batchLabel = getBatchLabel();
      
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (Extended 100 Seats) - 2026", w / 2, 18, { align: "center" });
      
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Document Verification Sheet", w / 2, 26, { align: "center" });
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
      
      if (batchLabel) {
        pdf.text(batchLabel, w / 2, 32, { align: "center" });
      }

      await drawDocVerificationTable(pdf, attendanceData);

      pdf.setFontSize(9);
      pdf.text(
        "Note: Please verify documents and mark accordingly",
        10,
        h - 5
      );

      const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
      pdf.save(`DocVerification_${centerNameForFile}.pdf`);
      
      setError(null);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setError("PDF generation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GENERATE ATTENDANCE SHEET PDF (UPDATED) ---------------- */
  const generateAttendancePDF = async () => {
    if (!attendanceData.length) {
      setError("No data available");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const pdf = new jsPDF("l", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();

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

      const batchLabel = getBatchLabel();
      
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (EXTENDED 100 SEATS) - 2026", w / 2, 18, { align: "center" });
      
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Center: ${selectedCenter?.label || "N/A"}`, w / 2, 38, { align: "center" });
      
      if (batchLabel) {
        pdf.text(batchLabel, w / 2, 32, { align: "center" });
      }

      // Draw attendance table with only signature column
      await drawAttendanceTable(pdf, attendanceData);

      pdf.setFontSize(9);
      pdf.text(
        "Note: Please get student signature",
        10,
        h - 5
      );

      const centerNameForFile = (selectedCenter?.label || "Center").replace(/[^a-z0-9]/gi, '_');
      pdf.save(`AttendanceSheet_${centerNameForFile}.pdf`);
      
      setError(null);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setError("PDF generation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DOWNLOAD BLANK TEMPLATE ---------------- */
  const downloadBlankAttendanceTemplate = async () => {
    try {
      const pdf = new jsPDF("l", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();

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

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        "HARYANA SUPER 100 ENTRANCE EXAMINATION LEVEL-2 (Extended 100 Seats) - 2026",
        w / 2,
        18,
        { align: "center" }
      );

      pdf.text("Document Verification Sheet (Blank Template)", w / 2, 26, { align: "center" });

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "Center: ________________________________",
        w / 2,
        34,
        { align: "center" }
      );

      const blankRows = Array.from({ length: 24 }).map(() => [
        "", "", "", "", "", "", "", "", "", ""
      ]);

      pdf.autoTable({
        startY: 45,
        head: [[
          "S.No",
          "SRN",
          "Name",
          "Father",
          "District",
          "Block",
          "School",
          "Doc",
          "Room",
          "Remark",
        ]],
        body: blankRows,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          minCellHeight: 25,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 12 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 35 },
          7: { cellWidth: 15 },
          8: { cellWidth: 15 },
          9: { cellWidth: 55 },
        },
      });

      pdf.save("DocVerification_Blank_Template.pdf");
    } catch (err) {
      console.error("Blank template generation failed", err);
    }
  };

  /* ---------------- UI ---------------- */
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
          <h5 className="mb-0">HS 100 L-2 ATTENDANCE & DOC VERIFICATION SHEETS</h5>
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
              onClick={fetchAttendanceData} 
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

          {showPreview && attendanceData.length > 0 && (
            <>
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <Row className="align-items-center">
                    <Col md={5}>
                      <h6 className="mb-0">
                        📊 Student Data Overview
                        <Badge bg="info" className="ms-2">
                          🏢 {Object.keys(groupedAttendanceData).length} Districts
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
                          <FaFilter className="me-1" /> Filter by District
                        </Form.Label>
                        <Select
                          options={districtOptions}
                          value={districtOptions.find(opt => opt.value === selectedRoomFilter)}
                          onChange={(option) => setSelectedRoomFilter(option?.value || "all")}
                          placeholder="Select District"
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
                          <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>District</th>
                          <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>SRN</th>
                          <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Name</th>
                          <th style={{ width: "150px", backgroundColor: "#0d6efd", color: "white" }}>Father</th>
                          <th style={{ width: "120px", backgroundColor: "#0d6efd", color: "white" }}>Block</th>
                          <th style={{ width: "200px", backgroundColor: "#0d6efd", color: "white" }}>School</th>
                          <th style={{ width: "100px", backgroundColor: "#0d6efd", color: "white" }}>Room No</th>
                          <th style={{ width: "130px", backgroundColor: "#0d6efd", color: "white" }}>Attendance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((s, i) => (
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
                            <td>{s.L2ExaminationBlock || "—"}</td>
                            <td className="small">{s.school || "—"}</td>
                            <td className="text-center">{s.orientationRoomNumber || "—"}</td>
                            <td>
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
                            </td>
                          </tr>
                        ))}
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
                  onClick={generateDocVerificationPDF} 
                  disabled={loading || attendanceData.length === 0}
                  variant="warning"
                  className="d-flex align-items-center"
                >
                  <FaDownload className="me-2" />
                  {loading ? "Generating PDF..." : "Download Doc Verification Sheet"}
                </Button>

                <Button 
                  onClick={generateAttendancePDF} 
                  disabled={loading || attendanceData.length === 0}
                  variant="success"
                  className="d-flex align-items-center"
                >
                  <FaDownload className="me-2" />
                  {loading ? "Generating PDF..." : "Download Attendance Sheet"}
                </Button>
              </div>
            </>
          )}

          {showPreview && attendanceData.length === 0 && (
            <Alert variant="warning" className="text-center">
              <FaInfoCircle className="me-2" />
              No data found for the selected center with applied filters.
            </Alert>
          )}
        </Card.Body>
        
        <Card.Footer className="text-muted small">
          <div className="d-flex justify-content-between">
            <span>Total Centers: {centers.length}</span>
            <span>Document Verification & Attendance Sheet Generator</span>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};