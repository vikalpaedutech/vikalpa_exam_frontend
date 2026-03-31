

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Button, Alert, Card, Spinner, Badge } from 'react-bootstrap';

// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// import { FetchMbL2QualifiedStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService";


// export const MbL3OrientationCertificate = () => {
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [error, setError] = useState(null);
//   const [templatePdf, setTemplatePdf] = useState(null);

//   // Create lookup maps for quick access
//   const schoolMap = new Map();
//   const districtMap = new Map();
//   const blockMap = new Map();



//   const certificateOfExcellence = "/orientationcertificate.pdf"


// //Fetching L2 QUALIFIED STUDENTS

// const fetchL2QualifiedStudents = async () =>{

//     try {
//         const response = await FetchMbL2QualifiedStudent();
//         console.log(response.data)
//     } catch (error) {
//         console.log("Error fetching data")
//     }
// }




// useEffect(()=>{
//  fetchL2QualifiedStudents()
// }, [])






  



//   const loadTemplatePDF = async () => {
//     try {
//       const response = await fetch('/ame-score-card.pdf');
//       const templateBytes = await response.arrayBuffer();
//       setTemplatePdf(templateBytes);
//     } catch (error) {
//       console.error("Error loading template PDF:", error);
//       setError("Failed to load template PDF");
//     }
//   };

  

//   useEffect(() => {
//     if (selectedDistrict) {
//       const filtered = students.filter(
//         student => student.districtId === selectedDistrict
//       );
//       setFilteredStudents(filtered);
//     } else {
//       setFilteredStudents([]);
//     }
//   }, [selectedDistrict, students]);

//   // Function to generate PDF with template
//   const generateStudentPDF = async (student) => {
//     if (!templatePdf) {
//       throw new Error("Template PDF not loaded");
//     }

//     // Load the PDF document
//     const pdfDoc = await PDFDocument.load(templatePdf);
    
//     // Get all pages
//     const pages = pdfDoc.getPages();
//     const firstPage = pages[0];
//     const secondPage = pages.length > 1 ? pages[1] : null;
//     const { height } = firstPage.getSize();
    
//     // Embed standard font
//     const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
//     // Set font size and color
//     const fontSize = 10;
//     const textColor = rgb(0, 0, 0);
    
//     // ========== FIRST PAGE CONTENT ==========
    
//     // Student Information Section
//     firstPage.drawText(student.studentSrn || "-", {
//       x: 275,
//       y: height - 103,
//       size: fontSize,
//       font: helveticaFont,
//       color: textColor,
//     });
    
//     firstPage.drawText(student.firstName || "-", {
//       x: 275,
//       y: height - 123,
//       size: fontSize,
//       font: helveticaFont,
//       color: textColor,
//     });
    
//     firstPage.drawText(student.fatherName || "-", {
//       x: 275,
//       y: height - 142,
//       size: fontSize,
//       font: helveticaFont,
//       color: textColor,
//     });
    
//     firstPage.drawText(student.classofStudent || "-", {
//       x: 275,
//       y: height - 160,
//       size: fontSize,
//       font: helveticaFont,
//       color: textColor,
//     });
    
//     // Use real center name from JSON
//     const centerName = student.centerName || student.schoolId || "-";
//     firstPage.drawText(centerName, {
//       x: 275,
//       y: height - 179,
//       size: fontSize,
//       font: helveticaFont,
//       color: textColor,
//     });
    
//     // Assessment Grades
//     firstPage.drawText(student.disciplineGradeAssessment_AME || "-", {
//       x: 275,
//       y: height - 225,
//       size: 11,
//       font: helveticaBold,
//       color: textColor,
//     });
    
//     firstPage.drawText(student.academicPerformanceGradeAssessment_AME || "-", {
//       x: 275,
//       y: height - 241,
//       size: 11,
//       font: helveticaBold,
//       color: textColor,
//     });
    
//     firstPage.drawText(student.classParticipationGradeAssessment_AME || "-", {
//       x: 275,
//       y: height - 261,
//       size: 11,
//       font: helveticaBold,
//       color: textColor,
//     });
    
//     firstPage.drawText(student.responsibilityAssessment_AME || "-", {
//       x: 275,
//       y: height - 280,
//       size: 11,
//       font: helveticaBold,
//       color: textColor,
//     });
    
//     firstPage.drawText(student.attendanceAssessment_AME || "-", {
//       x: 275,
//       y: height - 295,
//       size: 11,
//       font: helveticaBold,
//       color: textColor,
//     });
    
//     firstPage.drawText(student.coCurricularAssessment_AME || "-", {
//       x: 275,
//       y: height - 316,
//       size: 11,
//       font: helveticaBold,
//       color: textColor,
//     });
    
//     // ========== SECOND PAGE CONTENT (if exists) ==========
//     if (secondPage) {
//       const secondPageHeight = secondPage.getSize().height;
      
//       // Attendance percentages - fill in the existing table
//       const attendanceStartY = secondPageHeight - 120;
      
//       const monthsData = [
//         { month: "MAY", value: student.mayMonthAttendancePercentage, y: attendanceStartY - 10 },
//         { month: "JULY", value: student.julyMonthAttendancePercentage, y: attendanceStartY - 32 },
//         { month: "AUGUST", value: student.augustMonthAttendancePercentage, y: attendanceStartY - 57 },
//         { month: "SEPTEMBER", value: student.septemberMonthAttendancePercentage, y: attendanceStartY - 83 },
//         { month: "OCTOBER", value: student.octoberMonthAttendancePercentage, y: attendanceStartY - 107 },
//         { month: "NOVEMBER", value: student.novemberMonthAttendancePercentage, y: attendanceStartY - 133 },
//         { month: "DECEMBER", value: student.decemberMonthAttendancePercentage, y: attendanceStartY - 158 },
//         { month: "JANUARY", value: student.januaryMonthAttendancePercentage, y: attendanceStartY - 183 },
//         { month: "FEBRUARY", value: student.februaryMonthAttendancePercentage, y: attendanceStartY - 208 }
//       ];
      
//       // Fill attendance percentages
//       monthsData.forEach((item) => {
//         if (item.value && item.value !== "-") {
//           secondPage.drawText(`${item.value}%`, {
//             x: 300,
//             y: item.y,
//             size: 10,
//             font: helveticaFont,
//             color: textColor,
//           });
//         } else {
//           secondPage.drawText("-", {
//             x: 300,
//             y: item.y,
//             size: 10,
//             font: helveticaFont,
//             color: textColor,
//           });
//         }
//       });
      
//       // Calculate Overall Attendance
//       const validAttendance = [
//         student.mayMonthAttendancePercentage,
//         student.julyMonthAttendancePercentage,
//         student.augustMonthAttendancePercentage,
//         student.septemberMonthAttendancePercentage,
//         student.octoberMonthAttendancePercentage,
//         student.novemberMonthAttendancePercentage,
//         student.decemberMonthAttendancePercentage,
//         student.januaryMonthAttendancePercentage,
//         student.februaryMonthAttendancePercentage
//       ].filter(m => m && m !== "-" && !isNaN(parseFloat(m)));
      
//       let overallAttendance = "-";
//       if (validAttendance.length > 0) {
//         const sum = validAttendance.reduce((acc, val) => acc + parseFloat(val), 0);
//         overallAttendance = (sum / validAttendance.length).toFixed(2);
//       }
      
//       // Fill overall attendance
//       secondPage.drawText(`${overallAttendance}%`, {
//         x: 350,
//         y: attendanceStartY - 244,
//         size: 11,
//         font: helveticaBold,
//         color: rgb(0, 0, 0),
//       });
//     }
    
//     // Save the PDF
//     const pdfBytes = await pdfDoc.save();
//     // Updated filename to use centerName instead of schoolId
//     const safeCenterName = (student.centerName || student.schoolId || "unknown").replace(/[^a-z0-9]/gi, '_');
//     const fileName = `${student.firstName}_${student.fatherName}_${student.studentSrn}_${safeCenterName}.pdf`;
    
//     return { pdfBytes, fileName };
//   };

//   const generateAllPDFs = async () => {
//     if (filteredStudents.length === 0) {
//       setError("No students found in selected district");
//       return;
//     }
    
//     if (!templatePdf) {
//       setError("Template PDF not loaded. Please check if template exists.");
//       return;
//     }
    
//     setGenerating(true);
//     setError(null);
    
//     const zip = new JSZip();
//     let generatedCount = 0;
    
//     try {
//       for (const student of filteredStudents) {
//         try {
//           const { pdfBytes, fileName } = await generateStudentPDF(student);
//           zip.file(fileName, pdfBytes);
//           generatedCount++;
//         } catch (err) {
//           console.error(`Error generating PDF for student ${student.studentSrn}:`, err);
//         }
//       }
      
//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       const district = districts.find(d => d.districtId === selectedDistrict);
//       const districtName = district?.districtName || selectedDistrict;
//       const zipFileName = `scorecards_${districtName}_${new Date().toISOString().split('T')[0]}.zip`;
      
//       saveAs(zipBlob, zipFileName);
//       setError(`Successfully generated ${generatedCount} scorecards!`);
//       setTimeout(() => setError(null), 3000);
      
//     } catch (error) {
//       console.error("Error generating ZIP:", error);
//       setError("Failed to generate PDFs. Please try again.");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   return (
//     <Container className="mt-4 mb-5">
//       <Card className="shadow-sm">
//         <Card.Header className="bg-primary text-white">
//           <h4 className="mb-0">Mission Buniyaad L3 - Certificate of Excellence</h4>
//           <small className="text-white-50">Batch: 2025-27</small>
//         </Card.Header>
        
//         <Card.Body>
//           {error && (
//             <Alert variant={error.includes("Successfully") ? "success" : "danger"} className="mb-3">
//               {error}
//             </Alert>
//           )}
          
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-2">Loading student data...</p>
//             </div>
//           ) : (
//             <>
//               <Row className="mb-4">
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label className="fw-bold">Select District</Form.Label>
//                     <Form.Select
//                       value={selectedDistrict}
//                       onChange={(e) => setSelectedDistrict(e.target.value)}
//                       className="border-primary"
//                     >
//                       <option value="">-- Select a District --</option>
//                       {districts.map((district) => (
//                         <option key={district.districtId} value={district.districtId}>
//                           {district.districtName} ({district.studentCount} students)
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                 </Col>
                
//                 <Col md={6} className="d-flex align-items-end">
//                   {selectedDistrict && filteredStudents.length > 0 && (
//                     <div className="w-100">
//                       <Button
//                         variant="success"
//                         onClick={generateAllPDFs}
//                         disabled={generating || !templatePdf}
//                         className="w-100"
//                         size="lg"
//                       >
//                         {generating ? (
//                           <>
//                             <Spinner as="span" animation="border" size="sm" className="me-2" />
//                             Generating {filteredStudents.length} Scorecards...
//                           </>
//                         ) : (
//                           `Download All Scorecards (${filteredStudents.length})`
//                         )}
//                       </Button>
//                       {!templatePdf && (
//                         <small className="text-danger d-block text-center mt-2">
//                           Loading template PDF...
//                         </small>
//                       )}
//                     </div>
//                   )}
//                 </Col>
//               </Row>
              
//               {selectedDistrict && filteredStudents.length > 0 && (
//                 <Alert variant="info" className="mt-3">
//                   <strong>District Summary:</strong>
//                   <ul className="mb-0 mt-2">
//                     <li>Total Students: <Badge bg="primary">{filteredStudents.length}</Badge></li>
//                     <li>District: {districts.find(d => d.districtId === selectedDistrict)?.districtName}</li>
//                     <li>ZIP file will contain individual PDFs for each student</li>
//                   </ul>
//                 </Alert>
//               )}
//             </>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };





























import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Spinner, Badge } from 'react-bootstrap';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FetchMbL2QualifiedStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService";

export const MbL3OrientationCertificate = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [templatePdf, setTemplatePdf] = useState(null);

  // Fetch L2 QUALIFIED STUDENTS
  const fetchL2QualifiedStudents = async () => {
    setLoading(true);
    try {
      const response = await FetchMbL2QualifiedStudent();
      console.log(response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setStudents(response.data);
        
        // Extract unique districts from the data
        const uniqueDistricts = [];
        const districtMap = new Map();
        
        response.data.forEach(student => {
          const districtName = student.addressDistrict || student.schoolDistrict;
          const districtId = student.schoolDistrictCode || districtName;
          
          if (districtName && !districtMap.has(districtId)) {
            districtMap.set(districtId, {
              districtId: districtId,
              districtName: districtName,
              studentCount: 0
            });
          }
          
          if (districtName) {
            const existing = districtMap.get(districtId);
            if (existing) {
              existing.studentCount++;
            }
          }
        });
        
        const districtsArray = Array.from(districtMap.values());
        setDistricts(districtsArray);
      }
    } catch (error) {
      console.log("Error fetching data", error);
      setError("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  // Load template PDF
  const loadTemplatePDF = async () => {
    try {
      const response = await fetch('/orientationcertificate.pdf');
      const templateBytes = await response.arrayBuffer();
      setTemplatePdf(templateBytes);
    } catch (error) {
      console.error("Error loading template PDF:", error);
      setError("Failed to load template PDF. Please ensure orientationcertificate.pdf exists in the public folder.");
    }
  };

  useEffect(() => {
    fetchL2QualifiedStudents();
    loadTemplatePDF();
  }, []);

  // Filter students when district is selected
  useEffect(() => {
    if (selectedDistrict) {
      const filtered = students.filter(student => {
        const studentDistrict = student.addressDistrict || student.schoolDistrict;
        const studentDistrictCode = student.schoolDistrictCode || studentDistrict;
        return studentDistrictCode === selectedDistrict || studentDistrict === selectedDistrict;
      });
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedDistrict, students]);

  // Function to generate individual certificate PDF
  const generateCertificatePDF = async (student) => {
    if (!templatePdf) {
      throw new Error("Template PDF not loaded");
    }

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(templatePdf);
    
    // Get the first page (assuming certificate is single page)
    const pages = pdfDoc.getPages();
    const page = pages[0];
    const { height, width } = page.getSize();
    
    // Embed standard font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set font size and color
    const fontSize = 14;
    const textColor = rgb(0, 0, 0);
    
    // Get student details
    const studentName = student.name || student.firstName || "-";
    const studentSrn = student.srn || student.studentSrn || "-";
    const schoolName = student.school || student.centerName || "-";
    
    // Adjust these coordinates based on your PDF template layout
    // You may need to adjust X and Y positions based on your actual template


    // Get district name from selectedDistrict
const districtName =
  districts.find(d => d.districtId === selectedDistrict)?.districtName || selectedDistrict;


    //  // Draw Student Name (adjust position as needed)
    // page.drawText(districtName, {
    //   x: 385, // Adjust X coordinate
    //   y: height - 160, // Adjust Y coordinate from top
    //   size: fontSize + 2,
    //   font: helveticaBold,
    //   color: textColor,

    // });
    

const districtFontSize = fontSize + 2;
const districtTextWidth = helveticaBold.widthOfTextAtSize(districtName, districtFontSize);
const districtX = (width - districtTextWidth) / 2;

page.drawText(districtName, {
  x: districtX,
  y: height - 160,
  size: districtFontSize,
  font: helveticaBold,
  color: textColor,
});

    // // Draw Student Name (adjust position as needed)
    // page.drawText(studentName, {
    //   x: 350, // Adjust X coordinate
    //   y: height - 250, // Adjust Y coordinate from top
    //   size: fontSize + 2,
    //   font: helveticaBold,
    //   color: textColor,
    // });



    const studentFontSize = fontSize + 2;
const studentTextWidth = helveticaBold.widthOfTextAtSize(studentName, studentFontSize);
const studentX = (width - studentTextWidth) / 2;

page.drawText(studentName, {
  x: studentX,
  y: height - 250,
  size: studentFontSize,
  font: helveticaBold,
  color: textColor,
});
    
    // Draw SRN
    page.drawText(studentSrn, {
      x: 160    ,
      y: height - 310, // Adjust Y coordinate
      size: fontSize,
      font: helveticaFont,
      color: textColor,
    });
    
    // Draw School Name
    page.drawText(schoolName, {
      x: 189,
      y: height - 338, // Adjust Y coordinate
      size: 12,
      font: helveticaFont,
      color: textColor,
    });
    
    // Optional: Add date of certificate generation
    const currentDate = new Date().toLocaleDateString('en-IN');
    page.drawText(`Date: ${currentDate}`, {
      x: width - 150,
      y: 50,
      size: 10,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    
    // Create filename: srn_student_schoolname
    const safeSrn = studentSrn.replace(/[^a-z0-9]/gi, '_');
    const safeStudentName = studentName.replace(/[^a-z0-9]/gi, '_');
    const safeSchoolName = schoolName.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    const fileName = `${safeSrn}_${safeStudentName}_${safeSchoolName}.pdf`;
    
    return { pdfBytes, fileName };
  };

  // Generate all certificates for selected district
  const generateAllCertificates = async () => {
    if (filteredStudents.length === 0) {
      setError("No students found in selected district");
      return;
    }
    
    if (!templatePdf) {
      setError("Template PDF not loaded. Please check if orientationcertificate.pdf exists in public folder.");
      return;
    }
    
    setGenerating(true);
    setError(null);
    
    const zip = new JSZip();
    let generatedCount = 0;
    let failedCount = 0;
    
    try {
      for (const student of filteredStudents) {
        try {
          const { pdfBytes, fileName } = await generateCertificatePDF(student);
          zip.file(fileName, pdfBytes);
          generatedCount++;
        } catch (err) {
          console.error(`Error generating certificate for student ${student.srn || student.name}:`, err);
          failedCount++;
        }
      }
      
      if (generatedCount === 0) {
        throw new Error("No certificates were generated successfully");
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const districtName = districts.find(d => d.districtId === selectedDistrict)?.districtName || selectedDistrict;
      const safeDistrictName = districtName.replace(/[^a-z0-9]/gi, '_');
      const zipFileName = `orientation_certificates_${safeDistrictName}_${new Date().toISOString().split('T')[0]}.zip`;
      
      saveAs(zipBlob, zipFileName);
      setError(`Success! Generated ${generatedCount} certificate(s)${failedCount > 0 ? ` (${failedCount} failed)` : ''}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        if (error && error.includes("Success!")) {
          setError(null);
        }
      }, 3000);
      
    } catch (error) {
      console.error("Error generating ZIP:", error);
      setError("Failed to generate certificates. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Mission Buniyaad L3 - Orientation Certificate</h4>
          <small className="text-white-50">Batch: 2026-28</small>
        </Card.Header>
        
        <Card.Body>
          {error && (
            <Alert variant={error.includes("Success!") ? "success" : "danger"} className="mb-3">
              {error}
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading student data...</p>
            </div>
          ) : (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Select District</Form.Label>
                    <Form.Select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="border-primary"
                    >
                      <option value="">-- Select a District --</option>
                      {districts.map((district) => (
                        <option key={district.districtId} value={district.districtId}>
                          {district.districtName} ({district.studentCount} students)
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6} className="d-flex align-items-end">
                  {selectedDistrict && filteredStudents.length > 0 && (
                    <div className="w-100">
                      <Button
                        variant="success"
                        onClick={generateAllCertificates}
                        disabled={generating || !templatePdf}
                        className="w-100"
                        size="lg"
                      >
                        {generating ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Generating {filteredStudents.length} Certificates...
                          </>
                        ) : (
                          `Generate All Certificates (${filteredStudents.length})`
                        )}
                      </Button>
                      {!templatePdf && (
                        <small className="text-danger d-block text-center mt-2">
                          Loading template PDF...
                        </small>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
              
              {selectedDistrict && filteredStudents.length > 0 && (
                <Alert variant="info" className="mt-3">
                  <strong>District Summary:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Total Students: <Badge bg="primary">{filteredStudents.length}</Badge></li>
                    <li>District: {districts.find(d => d.districtId === selectedDistrict)?.districtName}</li>
                    <li>File naming format: <code>SRN_StudentName_SchoolName.pdf</code></li>
                    <li>All certificates will be downloaded as a single ZIP file</li>
                  </ul>
                </Alert>
              )}
              
              {selectedDistrict && filteredStudents.length === 0 && !loading && (
                <Alert variant="warning">
                  No students found in this district.
                </Alert>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
    
  );
  
};