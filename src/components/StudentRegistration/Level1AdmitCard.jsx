// import React, { useContext, useState } from "react";
// import {
//   Container,
//   Card,
//   Button,
//   Row,
//   Col,
//   Modal,
// } from "react-bootstrap";
// import jsPDF from "jspdf";
// import { useNavigate, useLocation } from "react-router-dom";
// import { StudentContext } from "../NewContextApis/StudentContextApi.js";
// import { UserContext } from "../NewContextApis/UserContext.js";










// export const Level1AdmitCard = () => {


    
//   const { studentData } = useContext(StudentContext);
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [showError, setShowError] = useState(false);

//   console.log(studentData);

//   // ✅ Check if studentData is empty/null/undefined
//   if (!studentData || Object.keys(studentData).length === 0) {
//     return (
//       <Modal show centered onHide={() => navigate("/registration-form")}>
//         <Modal.Header closeButton>
//           <Modal.Title>Registration Required</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Please register first to generate your acknowledgment slip.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={() => navigate("/registration-form")}>
//             Go to Registration Form
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   }

//   const student = studentData;
//   const isVerified = student.isVerified;
//   const verificationRemark = student.registrationFormVerificationRemark;

//   const examLevel =
//     student.classOfStudent === "8"
//       ? "Mission Buniyaad"
//       : "Haryana Super 100";
//   const examLevelSlip = "Acknowledgement Slip";
//   const examLevelBatch = "Batch 2026-28";

//   // ✅ Helper: format date to dd-mm-yyyy
//   const formatDateToDDMMYYYY = (dateStr) => {
//     if (!dateStr) return "-";
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const formattedDate = student.dob
//     ? formatDateToDDMMYYYY(student.dob)
//     : formatDateToDDMMYYYY(new Date());


// // helper: fetch URL and convert to dataURL
// async function urlToDataURL(url) {
//   const resp = await fetch(url, { mode: "cors" });
//   if (!resp.ok) throw new Error("Failed to fetch image: " + resp.status);
//   const blob = await resp.blob();
//   return await new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result); // data:image/png;base64,...
//     reader.onerror = reject;
//     reader.readAsDataURL(blob);
//   });
// }



//  const logo = "/haryana.png";
//  const logo2 = "/admitBuniyaLogo.png"
  

//     const level1admitinstructions = "/level1admitinstructions.png";




//      const arrayBufferToBase64 = (buffer) => {
//     let binary = "";
//     const bytes = new Uint8Array(buffer);
//     for (let i = 0; i < bytes.byteLength; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return btoa(binary);
//   };



// // 🧾 Function to download PDF
// const DownloadPDF = async () => {

    
//     //Hindi font setup
//     const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf"; // after rename

//     const response = await fetch(fontUrl);
//     const fontArrayBuffer = await response.arrayBuffer();
//     const fontBase64 = arrayBufferToBase64(fontArrayBuffer);


 
//     //-----------------------------------------------------


// var doc = new jsPDF()
// doc.setFont('helvetica', 'normal');  // family, style
// doc.setFontSize(12);


// // stroke (outline only)
// doc.rect(5, 5, 200, 285);  // x, y, width, height


// doc.addImage(logo, 'PNG', 10, 8, 20, 20); // x,y,width,height


// doc.addImage(logo2, 'PNG', 180, 8, 20, 20); // x,y,width,height

// // align options (pass an object as 4th param)
// doc.text('Directorate of School Education (DSE) Shiksha Sadan, Haryana', doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
// doc.text('Mission Buniyaad Level 1 Exam (2026-28)', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
// doc.text('E – Admit Card', doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });
// doc.text('Examination Date: 30th January', doc.internal.pageSize.getWidth() / 2, 27, { align: 'center' });
// doc.text('Reporting Time: 10:30 AM, Exam Time: 11:30 AM', doc.internal.pageSize.getWidth() / 2, 32, { align: 'center' });



// //Table formation

// // sample data (array of objects)
//       const data = [
//           { id: 1, field: "Student Name", name: student.name },
//           { id: 1, field: "Father's Name", name: student.name },
//           { id: 1, field: "Date of Birth", name: formattedDate },
//           { id: 1, field: "Category", name: student.category },
//           { id: 1, field: "SRN Number", name: student.srn },
//           { id: 1, field: "Exam Roll Number", name: student.rollNumber },
//           { id: 1, field: "Aadhar Number", name: student.aadhar },
//           { id: 1, field: "Mobile NUmber", name: student.mobile },
//           { id: 1, field: "District", name: student.schoolDistrict +"-" + "("+student.schoolDistrictCode+")" },
//           { id: 1, field: "Block", name: student.schoolBlock +"-" + "("+student.schoolBlockCode+")" },
//           { id: 1, field: "Examination Center", name: student.L1ExaminationCenter },
//       ];

// // define columns
// // const columns = [
// //   { header: 'ID', dataKey: 'id' },
// //   { header: 'Name', dataKey: 'name' },
// //   { header: 'Score', dataKey: 'score' }
// // ];

// doc.autoTable({
//   startY: 40,            // vertical position to start table
//   //head: [['ID', 'Name']],   // header row
//   body: data.map(row => [row.field, row.name]),
//   theme: 'grid',         // 👈 adds borders around all cells
//   styles: {
//     lineWidth: 0.2,      // border thickness
//     lineColor: [0, 0, 0],// black border
//     fillColor: false,    // no background color
//     textColor: [0, 0, 0],// black text
//   },
//   headStyles: {
//     fillColor: false,    // no header background
//     textColor: [0, 0, 0],
//     fontStyle: 'bold'
//   },

//   columnStyles: {
//     0: { cellWidth: 45 },   // "Field" column width
//     1: { cellWidth: 80 },  // "Name" column width
//   },
//   tableWidth: 'wrap', // fits table to defined widths
// });



// //addming student's image

// if (student.imageUrl){
//     doc.addImage(student.imageUrl, 'PNG', 150, 40, 50, 50)
// } else {
//     doc.rect(150, 40, 50, 50)  // x, y, width, height
//     doc.text('If no photo,', 155, 60)   
//     doc.text('please attach passport ', 155, 65)   
//     doc.text('size photo', 155, 70)   
// }


// //adding line after table

// // line from (x1,y1) to (x2,y2)
// doc.setLineWidth(0.5);
// doc.line(10, 130,  doc.internal.pageSize.getWidth()  - 10, 130); // horizontal


// //General instructions

// doc.addImage(level1admitinstructions, 'PNG', 15, 132, 180, 155 )




// doc.save('a4.pdf')
//   };

//   return (
//     <Container className="py-4">
//       <Card
//         className="shadow"
//         style={{ borderRadius: "12px", padding: "20px" }}
//       >
//         <Card.Header className="bg-white text-center border-0">
//           <img
//             src="/haryana.png"
//             alt="Haryana Logo"
//             style={{ width: "60px", marginBottom: "10px" }}
//           />
//           <h5 className="fw-bold">{examLevel}</h5>
//           <h6>{examLevelSlip}</h6>
//           <h6>{examLevelBatch}</h6>
//           <p className="mt-2">
//             Registration Status:{" "}
//             <strong>
//               {isVerified === "Verified"
//                 ? "Registration Successful"
//                 : isVerified === "Rejected"
//                 ? "Rejected"
//                 : "Pending"}
//             </strong>
//           </p>
//           {isVerified === "Verified" ? (
//             <p className="text-success">
//               Your form is verified for Level 1 Examination.
//             </p>
//           ) : isVerified === "Rejected" ? (
//             <p className="text-danger">
//               Rejection Reason: {verificationRemark || "Not specified."}
//             </p>
//           ) : (
//             <div>
//               <p>
//                 Your Registration form is under verification. Please check again
//                 after 3 days.
//               </p>
//               <hr></hr>
//             </div>
//           )}
//         </Card.Header>

//         <Card.Body>
//           <Container>
//             <Row xs={1} md={2} className="g-3">
//               <Col><b>Slip ID:</b> {student.slipId}</Col>
//               <Col><b>SRN:</b> {student.srn}</Col>
//               <Col><b>Name:</b> {student.name}</Col>
//               <Col><b>Father's Name:</b> {student.father}</Col>
//               <Col><b>Mother's Name:</b> {student.mother}</Col>
//               <Col><b>D.O.B:</b> {formatDateToDDMMYYYY(student.dob)}</Col>
//               <Col><b>Gender:</b> {student.gender}</Col>
//               <Col><b>Category:</b> {student.category}</Col>
//               <Col><b>Class:</b> {student.classOfStudent}</Col>
//               <Col><b>District:</b> {student.schoolDistrict}</Col>
//               <Col><b>Block:</b> {student.schoolBlock}</Col>
//               <Col><b>School:</b> {student.school}</Col>
//               <Col><b>Registration Date:</b> {formattedDate}</Col>
//             </Row>
//           </Container>
//         </Card.Body>

//         <Card.Footer className="bg-white text-center border-0">
//           <h5>General Instructions / सामान्य निर्देश:</h5>
//           <hr />
//           <ol style={{ textAlign: "left" }}>
//             <li>
//               Use your SRN number or Slip ID to check registration status and Download admit card. (पंजीकरण की स्थिति जांचने और प्रवेश पत्र डाउनलोड करने के लिए अपने स्लिप आईडी या एसआरएन नंबर का उपयोग करें।)
//             </li>
//             <li>
//               Check your registration status after three days, if accepted, it will show “Registration Successful”. (तीन दिनों के बाद अपनी पंजीकरण स्थिति जांचें। यदि आपका पंजीकरण स्वीकृत किया जाता है, तो यह “पंजीकरण सफल” दिखाएगा।)
//             </li>
//             <li>
//               Submission of wrong details can lead to rejection of registration form. (गलत फ़ॉर्म भरने पर आपका पंजीकृत फ़ॉर्म अस्वीकार किया जा सकता है।)
//             </li>
//           </ol>
//           <hr></hr>
//           <p style={{ fontWeight: "bold" }}>
//             Note: If you have any doubts regarding registration, then contact us (यदि आपको पंजीकरण से संबंधित कोई भी समस्या आती है, तो दिए गए सहायता नंबरों पर संपर्क करें। संपर्क करने का समय सुबह 10 बजे से शाम 5 बजे तक रहेगा।): 7982109054, 7982109215, 7982108494
//           </p>

//           <div className="d-flex justify-content-center gap-3 mt-3">
//             <Button onClick={DownloadPDF}>Download Acknowledgement Slip</Button>
          
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };











// import React, { useContext, useState } from "react";
// import { Container, Card, Button, Row, Col, Modal } from "react-bootstrap";
// import jsPDF from "jspdf";
// import "jspdf-autotable"; // ensure plugin is available in your build
// import { useNavigate, useLocation } from "react-router-dom";
// import { StudentContext } from "../NewContextApis/StudentContextApi.js";
// import { UserContext } from "../NewContextApis/UserContext.js";

// import { IsAdmitCardDownloaded } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

// export const Level1AdmitCard = () => {
//   const { studentData } = useContext(StudentContext);
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [showError, setShowError] = useState(false);

//   // If no student data -> modal to guide to registration
//   if (!studentData || Object.keys(studentData).length === 0) {
//     return (
//       <Modal show centered onHide={() => navigate("/registration-form")}>
//         <Modal.Header closeButton>
//           <Modal.Title>Registration Required</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Please register first to generate your acknowledgment slip.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={() => navigate("/registration-form")}>
//             Go to Registration Form
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   }

//   const student = studentData;
//   const isVerified = student.isVerified;
//   const verificationRemark = student.registrationFormVerificationRemark;

//   const examLevel =
//     student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";
//   const examLevelSlip = "Acknowledgement Slip";
//   const examLevelBatch = "Batch 2026-28";

//   // date formatter
//   const formatDateToDDMMYYYY = (dateStr) => {
//     if (!dateStr) return "-";
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const formattedDate = student.dob
//     ? formatDateToDDMMYYYY(student.dob)
//     : formatDateToDDMMYYYY(new Date());

//   // logos & static images (same as in your DownloadPDF)
//   const logo = "/haryana.png";
//   const logo2 = "/admitBuniyaLogo.png";
//   const level1admitinstructions = "/level1admitinstructions.png";

//   // helper: convert ArrayBuffer to base64 (used for embedding font if needed)
//   const arrayBufferToBase64 = (buffer) => {
//     let binary = "";
//     const bytes = new Uint8Array(buffer);
//     for (let i = 0; i < bytes.byteLength; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return btoa(binary);
//   };

//   // DownloadPDF: (full working implementation from your earlier code, unchanged behavior + font fetch)
//   const DownloadPDF = async () => {
//     try {
//       // Hindi font setup (if you placed font at public/fonts)
//       const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf"; // ensure this file exists in public/fonts
//       let fontBase64 = null;
//       try {
//         const response = await fetch(fontUrl);
//         if (response.ok) {
//           const fontArrayBuffer = await response.arrayBuffer();
//           fontBase64 = arrayBufferToBase64(fontArrayBuffer);
//           // Add font to jspdf (if you want to use it later)
//           // Note: addFileToVFS and addFont names depend on jspdf version
//           if (jsPDF.API && jsPDF.API.addFileToVFS) {
//             jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", fontBase64);
//             jsPDF.API.addFont("NotoSansDevanagari-Regular.ttf", "NotoDeva", "normal");
//           }
//         }
//       } catch (errFont) {
//         // font fetch failed — continue without Hindi font
//         console.warn("Could not load Devanagari font:", errFont);
//       }

//       // Create doc
//       var doc = new jsPDF();
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(11);

//       // stroke (outline only)
//       doc.rect(5, 5, 200, 285); // x, y, width, height

//       // logos (these are path strings — ensure public folder serves them)
//       try {
//         doc.addImage(logo, "PNG", 10, 8, 20, 20);
//       } catch (e) {
//         // ignore if logo not found
//       }
//       try {
//         doc.addImage(logo2, "PNG", 180, 8, 20, 20);
//       } catch (e) {}

//       // headings (centered)
//       const pageWidth = doc.internal.pageSize.getWidth();
//       doc.setFontSize(12);
//       doc.text(
//         "Directorate of School Education (DSE) Shiksha Sadan, Haryana",
//         pageWidth / 2,
//         10,
//         { align: "center" }
//       );
//       doc.setFontSize(13);
//       doc.text("Mission Buniyaad Level 1 Exam (2026-28)", pageWidth / 2, 15, {
//         align: "center",
//       });
//       doc.setFontSize(12);
//       doc.text("E – Admit Card", pageWidth / 2, 22, { align: "center" });
//       doc.setFontSize(10);
//       doc.text("Examination Date: 30th January", pageWidth / 2, 27, {
//         align: "center",
//       });
//       doc.text("Reporting Time: 10:30 AM, Exam Time: 11:30 AM", pageWidth / 2, 32, {
//         align: "center",
//       });

//       // Table formation data
//       const data = [
//         { id: 1, field: "Student Name", name: student.name },
//         { id: 1, field: "Father's Name", name: student.father },
//         { id: 1, field: "Date of Birth", name: formatDateToDDMMYYYY(student.dob) },
//         { id: 1, field: "Category", name: student.category },
//         { id: 1, field: "SRN Number", name: student.srn },
//         { id: 1, field: "Exam Roll Number", name: student.rollNumber },
//         { id: 1, field: "Aadhar Number", name: student.aadhar },
//         { id: 1, field: "Mobile Number", name: student.mobile },
//         {
//           id: 1,
//           field: "District",
//           name: student.schoolDistrict + "-" + "(" + student.schoolDistrictCode + ")",
//         },
//         {
//           id: 1,
//           field: "Block",
//           name: student.schoolBlock + "-" + "(" + student.schoolBlockCode + ")",
//         },
//         { id: 1, field: "Examination Center", name: student.L1ExaminationCenter },
//       ];

//       doc.autoTable({
//         startY: 40,
//         body: data.map((row) => [row.field, row.name]),
//         theme: "grid",
//         styles: {
//           lineWidth: 0.2,
//           lineColor: [0, 0, 0],
//           fillColor: false,
//           textColor: [0, 0, 0],
//           fontSize: 10,
//         },
//         headStyles: {
//           fillColor: false,
//           textColor: [0, 0, 0],
//           fontStyle: "bold",
//         },
//         columnStyles: {
//           0: { cellWidth: 50 },
//           1: { cellWidth: 120 },
//         },
//         tableWidth: "wrap",
//       });

//       // adding student's image
//       if (student.imageUrl) {
//         try {
//           doc.addImage(student.imageUrl, "PNG", 150, 40, 50, 50);
//         } catch (e) {
//           // image might be cross-origin; ignore if fails
//           doc.rect(150, 40, 50, 50);
//           doc.text("Photo unavailable", 153, 65);
//         }
//       } else {
//         doc.rect(150, 40, 50, 50); // x, y, width, height
//         doc.text("If no photo,", 155, 60);
//         doc.text("please attach passport", 155, 65);
//         doc.text("size photo", 155, 70);
//       }

//       // adding line after table
//       doc.setLineWidth(0.5);
//       doc.line(10, 130, doc.internal.pageSize.getWidth() - 10, 130); // horizontal

//       // General instructions image (fallback to image if present)
//       try {
//         doc.addImage(level1admitinstructions, "PNG", 15, 132, 180, 155);
//       } catch (e) {
//         // ignore if not found; you may want to draw text instead
//       }

//       doc.save("a4.pdf");


//       if (doc.save){

//         const reqBOdy = {

//             _id: studentData._id,
//             admitCardDownloadStatus: {
//                 isL1AdmitCardDownloaded:true
//             }
//         }

//         const response = await IsAdmitCardDownloaded(reqBOdy)
//       } else {
//         alert("Pdf not downloaded")
//       }


//     } catch (err) {
//       console.error("PDF generation error:", err);
//       setShowError(true);
//     }
//   };

//   // Data shown on PDF -> use same rows for frontend table
//   const data = [
//     { field: "Student Name", value: student.name || "-" },
//     { field: "Father's Name", value: student.father || "-" },
//     { field: "Date of Birth", value: formattedDate || "-" },
//     { field: "Category", value: student.category || "-" },
//     { field: "SRN Number", value: student.srn || "-" },
//     { field: "Exam Roll Number", value: student.rollNumber || "-" },
//     { field: "Aadhar Number", value: student.aadhar || "-" },
//     { field: "Mobile Number", value: student.mobile || "-" },
//     {
//       field: "District",
//       value:
//         (student.schoolDistrict ? student.schoolDistrict : "-") +
//         (student.schoolDistrictCode ? " (" + student.schoolDistrictCode + ")" : ""),
//     },
//     {
//       field: "Block",
//       value:
//         (student.schoolBlock ? student.schoolBlock : "-") +
//         (student.schoolBlockCode ? " (" + student.schoolBlockCode + ")" : ""),
//     },
//     { field: "Examination Center", value: student.L1ExaminationCenter || "-" },
//   ];

//   // The provided bilingual General Instructions (use exactly what user gave)
//   const generalInstructions = [
//     {
//       en:
//         "Students need to reach at least 30 minutes prior to the exam centre for the proper and hassle-free seating arrangements.",
//       hi:
//         "छात्रों को उचित और परेशानी मुक्त बैठने की व्यवस्था के लिए परीक्षा केंद्र में कम से कम 30 मिनट पहले पहुंचना होगा।",
//     },
//     {
//       en:
//         "Students should carry the hard copies of the following documents on the day of your examination.\n  a. Admit Card\n  b. Aadhar Card",
//       hi:
//         "छात्रों को परीक्षा देने हेतु निम्नलिखित दस्तावेजों की हार्ड कॉपी अपने साथ लेकर जाना हैं।\n  a. Admit Card (एडमिट कार्ड)\n  b. Aadhar Card (आधार कार्ड)",
//     },
//     {
//       en:
//         "Students should carry proper stationary required for the exam like Blue Ball Pen, Pencil, Eraser etc. Carry a water bottle at the centre.",
//       hi:
//         "छात्र छात्राएं परीक्षा देने हेतु अपने साथ नीली स्याही वाले कलम, पेंसिल, रबर लेकर जाएं। साथ में एक पानी की बॉटल रख सकते हैं।",
//     },
//     {
//       en: "Students should come to exam centre in School uniform only.",
//       hi: "छात्रों को स्कूल यूनिफॉर्म में ही परीक्षा केंद्र पर आना चाहिए।",
//     },
//     {
//       en:
//         "Do not carry any personal, valuable items or any gadgets such as mobile phone, calculator etc.",
//       hi:
//         "कोई भी व्यक्तिगत, मूल्यवान वस्तु या कोई गैजेट्स जैसे मोबाइल फोन, कैलकुलेटर आदि न ले जाएं।",
//     },
//     {
//       en: "Please ensure that you fill all information properly and accurately.",
//       hi: "कृपया सुनिश्चित करें कि आप सभी जानकारी ठीक से और सही तरीके से भरें।",
//     },
//     {
//       en:
//         "Any cutting, overwriting, or the use of correction fluid is not allowed on the OMR (Optical Mark Recognition) sheet. Your OMR sheet will not be accepted in such cases.",
//       hi:
//         "ओएमआर (ऑप्टिकल मार्क रिकग्निशन) शीट पर किसी भी कटिंग, ओवरराइटिंग या करेक्शन फ्लूइड के उपयोग की अनुमति नहीं है। ऐसे मामलों में आपकी ओएमआर शीट स्वीकार नहीं की जाएगी।",
//     },
//     {
//       en:
//         "No student should indulge in any unfair examination practices. If found, there could be strict consequences to it including disqualification of student.",
//       hi:
//         "परीक्षा के समय यदि किसी छात्रा या छात्रों को अनुचित प्रयास में पकड़ा जाता है, तो इसका परिणाम सख्त हो सकता है और परीक्षा से अयोग्य घोषित किया जा सकता है।",
//     },
//     {
//       en:
//         "Students should paste a colored passport size photograph, duly attested by your school principal in-case the same is missing from your admit card.",
//       hi:
//         "एडमिट कार्ड पर छात्र या छात्रा की फोटो न होने पर, उन्हें स्कूल प्रधानाचार्य द्वारा सत्यापित रंगीन फोटो एडमिट कार्ड में संलग्न करना आवश्यक होगा।",
//     },
//     {
//       en:
//         "Please verify that all the information on this admit card is accurate. If you find any errors, kindly get them corrected by contacting us at the helpline number: 7982109054, 7982109215, 7982108494.",
//       hi:
//         "कृपया सत्यापित करें कि इस प्रवेश पत्र में दी गई सभी जानकारी सही है। यदि कोई संदेह हो, तो हेल्पलाइन से संपर्क करें। 7982109054, 7982109215, 7982108494",
//     },
//   ];

//   // Compact styles to reduce scrolling
//   const cardStyle = { borderRadius: "10px", padding: "12px" };
//   const smallText = { fontSize: "13px", marginBottom: 4 };
//   const smallField = { fontSize: "13px", fontWeight: 600 };

//   return (
//     <Container className="py-2">
//       {/* Top compact header row: left "Hello, student", center Download button, right small meta */}
//       <div className="d-flex align-items-center justify-content-between mb-2">
//         <div style={{ textAlign: "center" }}>
//           <a
//             onClick={DownloadPDF}
//             style={{
//               cursor: "pointer",
//               fontWeight: "bold",
//               fontSize: "25px",
//               animation: "blink 1s infinite",
//               alignItems: "centers",
//             }}
//             className="blinking-link"
//           >
//             Click here to download your Admit Card. <br />
//             (अपना प्रवेश पत्र डाउनलोड करने के लिए यहाँ क्लिक करें)
//           </a>

//           <style>
//             {`
// @keyframes blink {
//   0% { color: red; }
//   50% { color: blue; }
//   100% { color: red; }
// }

// .blinking-link {
//   text-decoration: underline;
// }
// `}
//           </style>
//         </div>
//       </div>

//       <Card className="shadow" style={cardStyle}>
//         {/* Header that matches PDF heading, compact */}
//         <Card.Header className="bg-white text-center border-0 py-2">
//           <div className="d-flex justify-content-between align-items-start">
//             <img src={logo} alt="Haryana Logo" style={{ width: "50px" }} />
//             <div style={{ textAlign: "center", flex: 1 }}>
//               <div style={{ fontSize: 12, }}>Directorate of School Education (DSE) Shiksha Sadan, Haryana</div>
//               <div style={{ fontSize: 14, fontWeight: 700 }}>{examLevel} Level 1 Exam (2026-28)</div>
//               <div style={{ fontSize: 12 }}>E – Admit Card</div>
//               <div style={{ fontSize: 11 }}>Examination Date: 30th January</div>
//               <div style={{ fontSize: 11 }}>Reporting Time: 10:30 AM, Exam Time: 11:30 AM</div>
//             </div>
//             <img src={logo2} alt="Exam Logo" style={{ width: "50px" }} />
//           </div>
//         </Card.Header>

//         {/* Main body: photo will appear above table on small screens (using order classes) */}
//         <Card.Body style={{ padding: "12px" }}>
//           <Row>
//             {/* Photo column: order-1 on small screens, order-md-2 on medium+ screens */}
//             <Col md={4} className="text-center order-1 order-md-2">
//               <div
//                 style={{
//                   width: "140px",
//                   height: "140px",
//                   border: "1px solid #000",
//                   margin: "0 auto 8px auto",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexDirection: "column",
//                 }}
//               >
//                 {student.imageUrl ? (
//                   <img
//                     src={student.imageUrl}
//                     alt="Student"
//                     style={{ maxWidth: "100%", maxHeight: "100%" }}
//                   />
//                 ) : (
//                   <>
//                     <div style={{ fontSize: "11px" }}>If no photo,</div>
//                     <div style={{ fontSize: "11px" }}>please attach passport</div>
//                     <div style={{ fontSize: "11px" }}>size photo</div>
//                   </>
//                 )}
//               </div>

            
//             </Col>

//             {/* Table column: order-2 on small screens, order-md-1 on medium+ screens */}
//             <Col md={8} className="order-2 order-md-1">
//               <table className="table table-borderless" style={{ width: "100%", marginBottom: 4 }}>
//                 <tbody>
//                   {data.map((row, idx) => (
//                     <tr key={idx} style={{ borderBottom: "none" }}>
//                       <td style={{ width: "40%", ...smallField, padding: "6px 8px" }}>{row.field}</td>
//                       <td style={{ width: "60%", ...smallText, padding: "6px 8px" }}>{row.value}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </Col>
//           </Row>

//           {/* horizontal separator */}
//           <hr style={{ margin: "8px 0" }} />

//           {/* Instructions: heading centered, content left-aligned and compact */}
//           <div>
//             <h5 className="text-center" style={{ fontSize: 15, marginBottom: 6 }}>General Instructions / सामान्य निर्देश</h5>

//             <ol style={{ textAlign: "left", paddingLeft: 20, marginBottom: 6 }}>
//               {generalInstructions.map((item, idx) => (
//                 <li key={idx} style={{ marginBottom: 6, fontSize: 13, textAlign:"left" }}>
//                   <div style={{ lineHeight: 1.15 }}>{item.en}</div>
//                   <div style={{ marginTop: 4, lineHeight: 1.15 }}>{item.hi}</div>
//                 </li>
//               ))}
//             </ol>

//             <p style={{ fontWeight: "bold", fontSize: 13, marginBottom: 2 }}>
//               Note: If you have any doubts regarding registration, then contact us (यदि आपको पंजीकरण से संबंधित कोई भी समस्या आती है, तो दिए गए सहायता नंबरों पर संपर्क करें।
//               संपर्क करने का समय सुबह 10 बजे से शाम 5 बजे तक रहेगा।): 7982109054, 7982109215, 7982108494
//             </p>
//           </div>
//         </Card.Body>

//         {/* Footer kept minimal (button already at top) */}
//         <Card.Footer className="bg-white text-center border-0 py-2">
//           <div style={{ fontSize: 12, color: "#666" }}>
//             <small>Keep this admit card safe. Carry required documents to exam centre.</small>
//           </div>
//         </Card.Footer>
//       </Card>

//       {/* Optional error modal if PDF generation fails */}
//       <Modal show={showError} onHide={() => setShowError(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>PDF Error</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>There was a problem generating the PDF. Please try again.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowError(false)}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };















// // Level1AdmitCard.jsx
// import React, { useContext, useEffect, useState } from "react";
// import { Container, Card, Button, Row, Col, Modal, Spinner } from "react-bootstrap";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// import { StudentContext } from "../NewContextApis/StudentContextApi.js";
// import { UserContext } from "../NewContextApis/UserContext.js";

// import { BulkDownloadContext } from "../ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi"; // adjust path

// import { IsAdmitCardDownloaded } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

// const logo = "/haryana.png";
// const logo2 = "/admitBuniyaLogo.png";
// const level1admitinstructions = "/level1admitinstructions.png";

// const arrayBufferToBase64 = (buffer) => {
//   let binary = "";
//   const bytes = new Uint8Array(buffer);
//   for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
//   return btoa(binary);
// };

// export const Level1AdmitCard = ({ singleStudent = null, onDone = () => {} }) => {
//   // contexts
//   const { studentData } = useContext(StudentContext);
//   const { userData } = useContext(UserContext);
//   const { bulkDownload, setBulkDownload } = useContext(BulkDownloadContext);

//   // local state
//   const [busy, setBusy] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState(null);

//   // Decide what students to process:
//   // - If singleStudent prop passed => single mode for that student (manual).
//   // - Else if bulkDownload present => bulk auto-run.
//   // - Else fallback to studentData (from StudentContext) and show UI for that student.
//   const activeStudent = singleStudent || studentData;

//   // Format date helper
//   const formatDateToDDMMYYYY = (dateStr) => {
//     if (!dateStr) return "-";
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Build single PDF blob (used by both single and bulk)
//   const buildPdfBlob = async (student) => {
//     // try load Devanagari font (optional)
//     try {
//       const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
//       const fResp = await fetch(fontUrl);
//       if (fResp.ok) {
//         const buf = await fResp.arrayBuffer();
//         const base64 = arrayBufferToBase64(buf);
//         if (jsPDF.API && jsPDF.API.addFileToVFS) {
//           jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64);
//           jsPDF.API.addFont("NotoSansDevanagari-Regular.ttf", "NotoDeva", "normal");
//         }
//       }
//     } catch (e) {
//       // font optional — continue
//       console.warn("Devanagari font load failed:", e);
//     }

//     const doc = new jsPDF();
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(11);

//     // border
//     doc.rect(5, 5, 200, 285);

//     // logos - best effort
//     try { doc.addImage(logo, "PNG", 10, 8, 20, 20); } catch (e) {}
//     try { doc.addImage(logo2, "PNG", 180, 8, 20, 20); } catch (e) {}

//     const pageWidth = doc.internal.pageSize.getWidth();

//     doc.setFontSize(12);
//     doc.text("Directorate of School Education (DSE) Shiksha Sadan, Haryana", pageWidth / 2, 10, { align: "center" });
//     doc.setFontSize(13);
//     const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";
//     doc.text(`${examLevel} Level 1 Exam (2026-28)`, pageWidth / 2, 15, { align: "center" });
//     doc.setFontSize(12);
//     doc.text("E – Admit Card", pageWidth / 2, 22, { align: "center" });
//     doc.setFontSize(10);
//     doc.text("Examination Date: 30th January", pageWidth / 2, 27, { align: "center" });
//     doc.text("Reporting Time: 10:30 AM, Exam Time: 11:30 AM", pageWidth / 2, 32, { align: "center" });

//     const dataForPdf = [
//       ["Student Name", student.name ?? "-"],
//       ["Father's Name", student.father ?? "-"],
//       ["Date of Birth", student.dob ? formatDateToDDMMYYYY(student.dob) : "-"],
//       ["Category", student.category ?? "-"],
//       ["SRN Number", student.srn ?? "-"],
//       ["Exam Roll Number", student.rollNumber ?? "-"],
//       ["Aadhar Number", student.aadhar ?? "-"],
//       ["Mobile Number", student.mobile ?? "-"],
//       ["District", (student.schoolDistrict ?? "-") + (student.schoolDistrictCode ? ` (${student.schoolDistrictCode})` : "")],
//       ["Block", (student.schoolBlock ?? "-") + (student.schoolBlockCode ? ` (${student.schoolBlockCode})` : "")],
//       ["Examination Center", student.L1ExaminationCenter ?? "-"]
//     ];

//     doc.autoTable({
//       startY: 40,
//       body: dataForPdf,
//       theme: "grid",
//       styles: { lineWidth: 0.2, lineColor: [0, 0, 0], fillColor: false, textColor: [0, 0, 0], fontSize: 10 },
//       columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 80 } },
//       tableWidth: "wrap"
//     });

//     // photo area
//     if (student.imageUrl) {
//       try {
//         doc.addImage(student.imageUrl, "PNG", 150, 40, 50, 50);
//       } catch (e) {
//         doc.rect(150, 40, 50, 50);
//         doc.text("Photo unavailable", 153, 65);
//       }
//     } else {
//       doc.rect(150, 40, 50, 50);
//       doc.text("If no photo,", 155, 60);
//       doc.text("please attach passport", 155, 65);
//       doc.text("size photo", 155, 70);
//     }

//     // dividing line and instructions
//     doc.setLineWidth(0.5);
//     doc.line(10, 130, pageWidth - 10, 130);
//     try {
//       doc.addImage(level1admitinstructions, "PNG", 15, 132, 180, 155);
//     } catch (e) {
//       doc.setFontSize(9);
//       doc.text("General Instructions: Reach 30 minutes early. Carry admit card & Aadhar. Do not carry mobile/calculators etc.", 15, 135, { maxWidth: pageWidth - 30 });
//     }

//     return doc.output("blob");
//   };

//   // Single PDF generation path used by UI "Click here to download"
//   const generateSingleAndSave = async (student) => {
//     setError(null);
//     setBusy(true);
//     setShowModal(true);
//     try {
//       const blob = await buildPdfBlob(student);
//       const safeName = (student.srn || student.name || "admit").toString().replace(/\s+/g, "_");
//       saveAs(blob, `${safeName}_admit_card.pdf`);

//       // notify backend (best-effort)
//       try {
//         await IsAdmitCardDownloaded({
//           _id: student._id,
//           admitCardDownloadStatus: { isL1AdmitCardDownloaded: true }
//         });
//       } catch (e) {
//         console.warn("Notify failed:", e);
//       }
//     } catch (err) {
//       console.error("Single PDF generation error:", err);
//       setError("Error generating PDF. Check console.");
//     } finally {
//       setBusy(false);
//       // leave modal open until user closes; but call onDone to let parent update UI if needed
//       onDone();
//     }
//   };

//   // Bulk runner: create PDFs for all students in array -> zip -> download
//   const runBulk = async (studentsArr) => {
//     setError(null);
//     setBusy(true);
//     setShowModal(true);
//     try {
//       const zip = new JSZip();
//       for (let i = 0; i < studentsArr.length; i++) {
//         const st = studentsArr[i];
//         try {
//           const b = await buildPdfBlob(st);
//           const safeName = (st.srn || st.name || `admit_${i}`).toString().replace(/\s+/g, "_");
//           zip.file(`${safeName}_admit_card.pdf`, b);
//         } catch (perErr) {
//           console.warn(`Failed to create PDF for ${st._id || st.srn || st.name}`, perErr);
//         }
//       }
//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, `admit_cards_${Date.now()}.zip`);

//       // notify backend for each student (best-effort)
//       for (const st of studentsArr) {
//         try {
//           await IsAdmitCardDownloaded({
//             _id: st._id,
//             admitCardDownloadStatus: { isL1AdmitCardDownloaded: true }
//           });
//         } catch (e) {
//           console.warn("Notify failed for", st._id, e);
//         }
//       }
//     } catch (err) {
//       console.error("Bulk error:", err);
//       setError("Error generating bulk PDFs. Check console.");
//     } finally {
//       setBusy(false);
//       // clear bulk context after done
//       setBulkDownload(null);
//       onDone();
//     }
//   };

//   // Auto-run bulk if bulkDownload present and this component is mounted (only when no singleStudent prop)
//   useEffect(() => {
//     if (!singleStudent && Array.isArray(bulkDownload) && bulkDownload.length > 0) {
//       // run in next tick
//       (async () => {
//         await runBulk(bulkDownload);
//       })();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [bulkDownload, singleStudent]);

//   // UI for single/studentData mode (unchanged from your original)
//   const renderAdmitCardUI = (student) => {
//     if (!student || Object.keys(student).length === 0) {
//       return (
//         <Modal show centered onHide={() => { /* no navigation here; parent handles */ }}>
//           <Modal.Header closeButton>
//             <Modal.Title>Registration Required</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <p>Please register first to generate your acknowledgment slip.</p>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="primary" onClick={() => { /* No navigate here; keep behavior simple */ }}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       );
//     }

//     const formattedDate = student.dob ? formatDateToDDMMYYYY(student.dob) : formatDateToDDMMYYYY(new Date());
//     const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";

//     const data = [
//       { field: "Student Name", value: student.name || "-" },
//       { field: "Father's Name", value: student.father || "-" },
//       { field: "Date of Birth", value: formattedDate || "-" },
//       { field: "Category", value: student.category || "-" },
//       { field: "SRN Number", value: student.srn || "-" },
//       { field: "Exam Roll Number", value: student.rollNumber || "-" },
//       { field: "Aadhar Number", value: student.aadhar || "-" },
//       { field: "Mobile Number", value: student.mobile || "-" },
//       { field: "District", value: (student.schoolDistrict ? student.schoolDistrict : "-") + (student.schoolDistrictCode ? " (" + student.schoolDistrictCode + ")" : "") },
//       { field: "Block", value: (student.schoolBlock ? student.schoolBlock : "-") + (student.schoolBlockCode ? " (" + student.schoolBlockCode + ")" : "") },
//       { field: "Examination Center", value: student.L1ExaminationCenter || "-" },
//     ];

//     const generalInstructions = [
//       { en: "Students need to reach at least 30 minutes prior to the exam centre for the proper and hassle-free seating arrangements.", hi: "छात्रों को उचित और परेशानी मुक्त बैठने की व्यवस्था के लिए परीक्षा केंद्र में कम से कम 30 मिनट पहले पहुंचना होगा।" },
//       { en: "Students should carry the hard copies of the following documents on the day of your examination.\n  a. Admit Card\n  b. Aadhar Card", hi: "छात्रों को परीक्षा देने हेतु निम्नलिखित दस्तावेजों की हार्ड कॉपी अपने साथ लेकर जाना हैं।\n  a. Admit Card (एडमिट कार्ड)\n  b. Aadhar Card (आधार कार्ड)" },
//       { en: "Students should carry proper stationary required for the exam like Blue Ball Pen, Pencil, Eraser etc. Carry a water bottle at the centre.", hi: "छात्र छात्राएं परीक्षा देने हेतु अपने साथ नीली स्याही वाले कलम, पेंसिल, रबर लेकर जाएं। साथ में एक पानी की बॉटल रख सकते हैं।" },
//       { en: "Students should come to exam centre in School uniform only.", hi: "छात्रों को स्कूल यूनिफॉर्म में ही परीक्षा केंद्र पर आना चाहिए।" },
//       { en: "Do not carry any personal, valuable items or any gadgets such as mobile phone, calculator etc.", hi: "कोई भी व्यक्तिगत, मूल्यवान वस्तु या कोई गैजेट्स जैसे मोबाइल फोन, कैलकुलेटर आदि न ले जाएं।" },
//       { en: "Please ensure that you fill all information properly and accurately.", hi: "कृपया सुनिश्चित करें कि आप सभी जानकारी ठीक से और सही तरीके से भरें।" },
//       { en: "Any cutting, overwriting, or the use of correction fluid is not allowed on the OMR (Optical Mark Recognition) sheet. Your OMR sheet will not be accepted in such cases.", hi: "ओएमआर (ऑप्टिकल मार्क रिकग्निशन) शीट पर किसी भी कटिंग, ओवरराइटिंग या करेक्शन फ्लूइड के उपयोग की अनुमति नहीं है। ऐसे मामलों में आपकी ओएमआर शीट स्वीकार नहीं की जाएगी।" },
//       { en: "No student should indulge in any unfair examination practices. If found, there could be strict consequences to it including disqualification of student.", hi: "परीक्षा के समय यदि किसी छात्रा या छात्रों को अनुचित प्रयास में पकड़ा जाता है, तो इसका परिणाम सख्त हो सकता है और परीक्षा से अयोग्य घोषित किया जा सकता है।" },
//       { en: "Students should paste a colored passport size photograph, duly attested by your school principal in-case the same is missing from your admit card.", hi: "एडमिट कार्ड पर छात्र या छात्रा की फोटो न होने पर, उन्हें स्कूल प्रधानाचार्य द्वारा सत्यापित रंगीन फोटो एडमिट कार्ड में संलग्न करना आवश्यक होगा।" },
//       { en: "Please verify that all the information on this admit card is accurate. If you find any errors, kindly get them corrected by contacting us at the helpline number: 7982109054, 7982109215, 7982108494.", hi: "कृपया सत्यापित करें कि इस प्रवेश पत्र में दी गई सभी जानकारी सही है। यदि कोई संदेह हो, तो हेल्पलाइन से संपर्क करें। 7982109054, 7982109215, 7982108494" },
//     ];

//     const cardStyle = { borderRadius: "10px", padding: "12px" };
//     const smallText = { fontSize: "13px", marginBottom: 4 };
//     const smallField = { fontSize: "13px", fontWeight: 600 };

//     return (
//       <Container className="py-2">
//         <div className="d-flex align-items-center justify-content-between mb-2">
//           <div style={{ textAlign: "center" }}>
//             <a
//               onClick={() => generateSingleAndSave(student)}
//               style={{ cursor: "pointer", fontWeight: "bold", fontSize: "25px", animation: "blink 1s infinite", alignItems: "centers" }}
//               className="blinking-link"
//             >
//               Click here to download your Admit Card. <br />
//               (अपना प्रवेश पत्र डाउनलोड करने के लिए यहाँ क्लिक करें)
//             </a>
//             <style>{`@keyframes blink { 0% { color: red; } 50% { color: blue; } 100% { color: red; } } .blinking-link { text-decoration: underline; }`}</style>
//           </div>
//         </div>

//         <Card className="shadow" style={cardStyle}>
//           <Card.Header className="bg-white text-center border-0 py-2">
//             <div className="d-flex justify-content-between align-items-start">
//               <img src={logo} alt="Haryana Logo" style={{ width: "50px" }} />
//               <div style={{ textAlign: "center", flex: 1 }}>
//                 <div style={{ fontSize: 12 }}>Directorate of School Education (DSE) Shiksha Sadan, Haryana</div>
//                 <div style={{ fontSize: 14, fontWeight: 700 }}>{examLevel} Level 1 Exam (2026-28)</div>
//                 <div style={{ fontSize: 12 }}>E – Admit Card</div>
//                 <div style={{ fontSize: 11 }}>Examination Date: 30th January</div>
//                 <div style={{ fontSize: 11 }}>Reporting Time: 10:30 AM, Exam Time: 11:30 AM</div>
//               </div>
//               <img src={logo2} alt="Exam Logo" style={{ width: "50px" }} />
//             </div>
//           </Card.Header>

//           <Card.Body style={{ padding: "12px" }}>
//             <Row>
//               <Col md={4} className="text-center order-1 order-md-2">
//                 <div style={{ width: "140px", height: "140px", border: "1px solid #000", margin: "0 auto 8px auto", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
//                   {student.imageUrl ? <img src={student.imageUrl} alt="Student" style={{ maxWidth: "100%", maxHeight: "100%" }} /> : <>
//                     <div style={{ fontSize: "11px" }}>If no photo,</div>
//                     <div style={{ fontSize: "11px" }}>please attach passport</div>
//                     <div style={{ fontSize: "11px" }}>size photo</div>
//                   </>}
//                 </div>
//               </Col>

//               <Col md={8} className="order-2 order-md-1">
//                 <table className="table table-borderless" style={{ width: "100%", marginBottom: 4 }}>
//                   <tbody>
//                     {data.map((row, idx) => (
//                       <tr key={idx} style={{ borderBottom: "none" }}>
//                         <td style={{ width: "40%", ...smallField, padding: "6px 8px" }}>{row.field}</td>
//                         <td style={{ width: "60%", ...smallText, padding: "6px 8px" }}>{row.value}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </Col>
//             </Row>

//             <hr style={{ margin: "8px 0" }} />

//             <div>
//               <h5 className="text-center" style={{ fontSize: 15, marginBottom: 6 }}>General Instructions / सामान्य निर्देश</h5>
//               <ol style={{ textAlign: "left", paddingLeft: 20, marginBottom: 6 }}>
//                 {generalInstructions.map((item, idx) => (
//                   <li key={idx} style={{ marginBottom: 6, fontSize: 13, textAlign: "left" }}>
//                     <div style={{ lineHeight: 1.15 }}>{item.en}</div>
//                     <div style={{ marginTop: 4, lineHeight: 1.15 }}>{item.hi}</div>
//                   </li>
//                 ))}
//               </ol>
//               <p style={{ fontWeight: "bold", fontSize: 13, marginBottom: 2 }}>
//                 Note: If you have any doubts regarding registration, then contact us: 7982109054, 7982109215, 7982108494
//               </p>
//             </div>
//           </Card.Body>

//           <Card.Footer className="bg-white text-center border-0 py-2">
//             <div style={{ fontSize: 12, color: "#666" }}>
//               <small>Keep this admit card safe. Carry required documents to exam centre.</small>
//             </div>
//           </Card.Footer>
//         </Card>

//         <Modal show={showModal} onHide={() => { if (!busy) setShowModal(false); }} centered>
//           <Modal.Header closeButton>
//             <Modal.Title>{busy ? "Generating PDF..." : error ? "Error" : "Status"}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {busy ? <div className="text-center"><Spinner animation="border" /> <div className="mt-2">Preparing PDF — please wait.</div></div> : (error ? <div className="text-danger">{error}</div> : <div>Admit Card Downloaded.</div>)}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)} disabled={busy}>Close</Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     );
//   };

//   // Render logic:
//   // If bulk present AND not in singleStudent prop usage => bulk run will auto-run via effect and show modal; show a small status card while busy
//   if (!singleStudent && Array.isArray(bulkDownload) && bulkDownload.length > 0) {
//     return (
//       <Container>
//         <Card className="p-3 shadow">
//           <div><strong>{bulkDownload.length}</strong> students queued for bulk admit-card generation.</div>
//           <div className="mt-2">
//             <Button onClick={() => runBulk(bulkDownload)} disabled={busy}>
//               {busy ? <><Spinner size="sm" animation="border" /> Generating...</> : "Start Bulk Now"}
//             </Button>{" "}
//             <Button variant="outline-secondary" onClick={() => { setBulkDownload(null); }}>Cancel Bulk</Button>
//           </div>
//           {error && <div className="text-danger mt-2">{error}</div>}
//         </Card>

//         <Modal show={showModal} onHide={() => { if (!busy) setShowModal(false); }}>
//           <Modal.Header closeButton>
//             <Modal.Title>{busy ? "Generating PDFs..." : error ? "Finished with errors" : "Finished"}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {busy ? <div className="text-center"><Spinner animation="border" /> <div className="mt-2">Preparing files — please wait.</div></div> : (error ? <div className="text-danger">{error}</div> : <div>Operation finished.</div>)}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)} disabled={busy}>Close</Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     );
//   }

//   // else render single UI (singleStudent prop if provided, otherwise studentData from context)
//   return renderAdmitCardUI(activeStudent);
// };




// import React, { useContext, useEffect, useState } from "react";
// import { Container, Card, Button, Row, Col, Modal, Spinner } from "react-bootstrap";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// import { StudentContext } from "../NewContextApis/StudentContextApi.js";
// import { UserContext } from "../NewContextApis/UserContext.js";
// import { BulkDownloadContext } from "../ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi";

// import { IsAdmitCardDownloaded } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

// const logo = "/haryana.png";
// const logo2 = "/admitBuniyaLogo.png";
// const level1admitinstructions = "/level1admitinstructions.png";

// const arrayBufferToBase64 = (buffer) => {
//   let binary = "";
//   const bytes = new Uint8Array(buffer);
//   for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
//   return btoa(binary);
// };

// export const Level1AdmitCard = ({ singleStudent = null, bulkDownload = null, onDone = () => {} }) => {
//   // contexts
//   const { studentData } = useContext(StudentContext);
//   const { userData } = useContext(UserContext);
//   const { bulkDownload: contextBulkDownload, setBulkDownload } = useContext(BulkDownloadContext);

//   // local state
//   const [busy, setBusy] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState(null);

//   // Decide what students to process:
//   // Priority: bulkDownload prop > contextBulkDownload > singleStudent > studentData
//   const studentsToProcess = bulkDownload || contextBulkDownload;

//   // Format date helper
//   const formatDateToDDMMYYYY = (dateStr) => {
//     if (!dateStr) return "-";
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Build single PDF blob (used by both single and bulk)
//   const buildPdfBlob = async (student) => {
//     // try load Devanagari font (optional)
//     try {
//       const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
//       const fResp = await fetch(fontUrl);
//       if (fResp.ok) {
//         const buf = await fResp.arrayBuffer();
//         const base64 = arrayBufferToBase64(buf);
//         if (jsPDF.API && jsPDF.API.addFileToVFS) {
//           jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64);
//           jsPDF.API.addFont("NotoSansDevanagari-Regular.ttf", "NotoDeva", "normal");
//         }
//       }
//     } catch (e) {
//       // font optional — continue
//       console.warn("Devanagari font load failed:", e);
//     }

//     const doc = new jsPDF();
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(11);

//     // border
//     doc.rect(5, 5, 200, 285);

//     // logos - best effort
//     try { doc.addImage(logo, "PNG", 10, 8, 20, 20); } catch (e) {}
//     try { doc.addImage(logo2, "PNG", 180, 8, 20, 20); } catch (e) {}

//     const pageWidth = doc.internal.pageSize.getWidth();

//     doc.setFontSize(12);
//     doc.text("Directorate of School Education (DSE) Shiksha Sadan, Haryana", pageWidth / 2, 10, { align: "center" });
//     doc.setFontSize(13);
//     const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";
//     doc.text(`${examLevel} Level 1 Exam (2026-28)`, pageWidth / 2, 15, { align: "center" });
//     doc.setFontSize(12);
//     doc.text("E – Admit Card", pageWidth / 2, 22, { align: "center" });
//     doc.setFontSize(10);
//     doc.text("Examination Date: 30th January", pageWidth / 2, 27, { align: "center" });
//     doc.text("Reporting Time: 10:30 AM, Exam Time: 11:30 AM", pageWidth / 2, 32, { align: "center" });

//     const dataForPdf = [
//       ["Student Name", student.name ?? "-"],
//       ["Father's Name", student.father ?? "-"],
//       ["Date of Birth", student.dob ? formatDateToDDMMYYYY(student.dob) : "-"],
//       ["Category", student.category ?? "-"],
//       ["SRN Number", student.srn ?? "-"],
//       ["Exam Roll Number", student.rollNumber ?? "-"],
//       ["Aadhar Number", student.aadhar ?? "-"],
//       ["Mobile Number", student.mobile ?? "-"],
//       ["District", (student.schoolDistrict ?? "-") + (student.schoolDistrictCode ? ` (${student.schoolDistrictCode})` : "")],
//       ["Block", (student.schoolBlock ?? "-") + (student.schoolBlockCode ? ` (${student.schoolBlockCode})` : "")],
//       ["Examination Center", student.L1ExaminationCenter ?? "-"]
//     ];

//     doc.autoTable({
//       startY: 40,
//       body: dataForPdf,
//       theme: "grid",
//       styles: { lineWidth: 0.2, lineColor: [0, 0, 0], fillColor: false, textColor: [0, 0, 0], fontSize: 10 },
//       columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 80 } },
//       tableWidth: "wrap"
//     });

//     // photo area
//     if (student.imageUrl) {
//       try {
//         doc.addImage(student.imageUrl, "PNG", 150, 40, 50, 50);
//       } catch (e) {
//         doc.rect(150, 40, 50, 50);
//         doc.text("Photo unavailable", 153, 65);
//       }
//     } else {
//       doc.rect(150, 40, 50, 50);
//       doc.text("If no photo,", 155, 60);
//       doc.text("please attach passport", 155, 65);
//       doc.text("size photo", 155, 70);
//     }

//     // dividing line and instructions
//     doc.setLineWidth(0.5);
//     doc.line(10, 130, pageWidth - 10, 130);
//     try {
//       doc.addImage(level1admitinstructions, "PNG", 15, 132, 180, 155);
//     } catch (e) {
//       doc.setFontSize(9);
//       doc.text("General Instructions: Reach 30 minutes early. Carry admit card & Aadhar. Do not carry mobile/calculators etc.", 15, 135, { maxWidth: pageWidth - 30 });
//     }

//     return doc.output("blob");
//   };

//   // Bulk runner: create PDFs for all students in array -> zip -> download
//   const runBulk = async (studentsArr) => {
//     setError(null);
//     setBusy(true);
//     setShowModal(true);
//     try {
//       const zip = new JSZip();
//       for (let i = 0; i < studentsArr.length; i++) {
//         const st = studentsArr[i];
//         try {
//           const b = await buildPdfBlob(st);
//           const safeName = (st.srn || st.name || `admit_${i}`).toString().replace(/\s+/g, "_");
//           zip.file(`${safeName}_admit_card.pdf`, b);
//         } catch (perErr) {
//           console.warn(`Failed to create PDF for ${st._id || st.srn || st.name}`, perErr);
//         }
//       }
//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, `admit_cards_${Date.now()}.zip`);

//       // notify backend for each student (best-effort)
//       for (const st of studentsArr) {
//         try {
//           await IsAdmitCardDownloaded({
//             _id: st._id,
//             admitCardDownloadStatus: { isL1AdmitCardDownloaded: true }
//           });
//         } catch (e) {
//           console.warn("Notify failed for", st._id, e);
//         }
//       }
//     } catch (err) {
//       console.error("Bulk error:", err);
//       setError("Error generating bulk PDFs. Check console.");
//     } finally {
//       setBusy(false);
//       // clear bulk context after done
//       setBulkDownload(null);
//       onDone();
//     }
//   };

//   // Auto-run bulk if bulkDownload present and this component is mounted
//   useEffect(() => {
//     if (Array.isArray(studentsToProcess) && studentsToProcess.length > 0) {
//       // run in next tick
//       (async () => {
//         await runBulk(studentsToProcess);
//       })();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [studentsToProcess]);

//   // If we have bulk download data, don't show any UI - just process in background
//   if (Array.isArray(studentsToProcess) && studentsToProcess.length > 0) {
//     return (
//       <Modal show={showModal} onHide={() => {}} centered backdrop="static">
//         <Modal.Header>
//           <Modal.Title>Downloading Admit Cards</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-center">
//           {busy ? (
//             <>
//               <Spinner animation="border" variant="primary" />
//               <div className="mt-2">Preparing {studentsToProcess.length} admit card(s)...</div>
//             </>
//           ) : error ? (
//             <div className="text-danger">{error}</div>
//           ) : (
//             <div>Admit cards downloaded successfully!</div>
//           )}
//         </Modal.Body>
//       </Modal>
//     );
//   }

//   // Original UI for single student mode (only shown when no bulk download)
//   const renderAdmitCardUI = (student) => {
//     if (!student || Object.keys(student).length === 0) {
//       return (
//         <Modal show centered onHide={() => {}}>
//           <Modal.Header closeButton>
//             <Modal.Title>Registration Required</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <p>Please register first to generate your acknowledgment slip.</p>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="primary" onClick={onDone}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       );
//     }

//     const formattedDate = student.dob ? formatDateToDDMMYYYY(student.dob) : formatDateToDDMMYYYY(new Date());
//     const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";

//     const data = [
//       { field: "Student Name", value: student.name || "-" },
//       { field: "Father's Name", value: student.father || "-" },
//       { field: "Date of Birth", value: formattedDate || "-" },
//       { field: "Category", value: student.category || "-" },
//       { field: "SRN Number", value: student.srn || "-" },
//       { field: "Exam Roll Number", value: student.rollNumber || "-" },
//       { field: "Aadhar Number", value: student.aadhar || "-" },
//       { field: "Mobile Number", value: student.mobile || "-" },
//       { field: "District", value: (student.schoolDistrict ? student.schoolDistrict : "-") + (student.schoolDistrictCode ? " (" + student.schoolDistrictCode + ")" : "") },
//       { field: "Block", value: (student.schoolBlock ? student.schoolBlock : "-") + (student.schoolBlockCode ? " (" + student.schoolBlockCode + ")" : "") },
//       { field: "Examination Center", value: student.L1ExaminationCenter || "-" },
//     ];

//     const generalInstructions = [
//       { en: "Students need to reach at least 30 minutes prior to the exam centre for the proper and hassle-free seating arrangements.", hi: "छात्रों को उचित और परेशानी मुक्त बैठने की व्यवस्था के लिए परीक्षा केंद्र में कम से कम 30 मिनट पहले पहुंचना होगा।" },
//       { en: "Students should carry the hard copies of the following documents on the day of your examination.\n  a. Admit Card\n  b. Aadhar Card", hi: "छात्रों को परीक्षा देने हेतु निम्नलिखित दस्तावेजों की हार्ड कॉपी अपने साथ लेकर जाना हैं।\n  a. Admit Card (एडमिट कार्ड)\n  b. Aadhar Card (आधार कार्ड)" },
//       { en: "Students should carry proper stationary required for the exam like Blue Ball Pen, Pencil, Eraser etc. Carry a water bottle at the centre.", hi: "छात्र छात्राएं परीक्षा देने हेतु अपने साथ नीली स्याही वाले कलम, पेंसिल, रबर लेकर जाएं। साथ में एक पानी की बॉटल रख सकते हैं।" },
//       { en: "Students should come to exam centre in School uniform only.", hi: "छात्रों को स्कूल यूनिफॉर्म में ही परीक्षा केंद्र पर आना चाहिए।" },
//       { en: "Do not carry any personal, valuable items or any gadgets such as mobile phone, calculator etc.", hi: "कोई भी व्यक्तिगत, मूल्यवान वस्तु या कोई गैजेट्स जैसे मोबाइल फोन, कैलकुलेटर आदि न ले जाएं।" },
//       { en: "Please ensure that you fill all information properly and accurately.", hi: "कृपया सुनिश्चित करें कि आप सभी जानकारी ठीक से और सही तरीके से भरें।" },
//       { en: "Any cutting, overwriting, or the use of correction fluid is not allowed on the OMR (Optical Mark Recognition) sheet. Your OMR sheet will not be accepted in such cases.", hi: "ओएमआर (ऑप्टिकल मार्क रिकग्निशन) शीट पर किसी भी कटिंग, ओवरराइटिंग या करेक्शन फ्लूइड के उपयोग की अनुमति नहीं है। ऐसे मामलों में आपकी ओएमआर शीट स्वीकार नहीं की जाएगी।" },
//       { en: "No student should indulge in any unfair examination practices. If found, there could be strict consequences to it including disqualification of student.", hi: "परीक्षा के समय यदि किसी छात्रा या छात्रों को अनुचित प्रयास में पकड़ा जाता है, तो इसका परिणाम सख्त हो सकता है और परीक्षा से अयोग्य घोषित किया जा सकता है।" },
//       { en: "Students should paste a colored passport size photograph, duly attested by your school principal in-case the same is missing from your admit card.", hi: "एडमिट कार्ड पर छात्र या छात्रा की फोटो न होने पर, उन्हें स्कूल प्रधानाचार्य द्वारा सत्यापित रंगीन फोटो एडमिट कार्ड में संलग्न करना आवश्यक होगा।" },
//       { en: "Please verify that all the information on this admit card is accurate. If you find any errors, kindly get them corrected by contacting us at the helpline number: 7982109054, 7982109215, 7982108494.", hi: "कृपया सत्यापित करें कि इस प्रवेश पत्र में दी गई सभी जानकारी सही है। यदि कोई संदेह हो, तो हेल्पलाइन से संपर्क करें। 7982109054, 7982109215, 7982108494" },
//     ];

//     const cardStyle = { borderRadius: "10px", padding: "12px" };
//     const smallText = { fontSize: "13px", marginBottom: 4 };
//     const smallField = { fontSize: "13px", fontWeight: 600 };

//     return (
//       <Container className="py-2">
//         <div className="d-flex align-items-center justify-content-between mb-2">
//           <div style={{ textAlign: "center" }}>
//             <a
//               onClick={() => runBulk([student])}
//               style={{ cursor: "pointer", fontWeight: "bold", fontSize: "25px", animation: "blink 1s infinite", alignItems: "centers" }}
//               className="blinking-link"
//             >
//               Click here to download your Admit Card. <br />
//               (अपना प्रवेश पत्र डाउनलोड करने के लिए यहाँ क्लिक करें)
//             </a>
//             <style>{`@keyframes blink { 0% { color: red; } 50% { color: blue; } 100% { color: red; } } .blinking-link { text-decoration: underline; }`}</style>
//           </div>
//         </div>

//         <Card className="shadow" style={cardStyle}>
//           <Card.Header className="bg-white text-center border-0 py-2">
//             <div className="d-flex justify-content-between align-items-start">
//               <img src={logo} alt="Haryana Logo" style={{ width: "50px" }} />
//               <div style={{ textAlign: "center", flex: 1 }}>
//                 <div style={{ fontSize: 12 }}>Directorate of School Education (DSE) Shiksha Sadan, Haryana</div>
//                 <div style={{ fontSize: 14, fontWeight: 700 }}>{examLevel} Level 1 Exam (2026-28)</div>
//                 <div style={{ fontSize: 12 }}>E – Admit Card</div>
//                 <div style={{ fontSize: 11 }}>Examination Date: 30th January</div>
//                 <div style={{ fontSize: 11 }}>Reporting Time: 10:30 AM, Exam Time: 11:30 AM</div>
//               </div>
//               <img src={logo2} alt="Exam Logo" style={{ width: "50px" }} />
//             </div>
//           </Card.Header>

//           <Card.Body style={{ padding: "12px" }}>
//             <Row>
//               <Col md={4} className="text-center order-1 order-md-2">
//                 <div style={{ width: "140px", height: "140px", border: "1px solid #000", margin: "0 auto 8px auto", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
//                   {student.imageUrl ? <img src={student.imageUrl} alt="Student" style={{ maxWidth: "100%", maxHeight: "100%" }} /> : <>
//                     <div style={{ fontSize: "11px" }}>If no photo,</div>
//                     <div style={{ fontSize: "11px" }}>please attach passport</div>
//                     <div style={{ fontSize: "11px" }}>size photo</div>
//                   </>}
//                 </div>
//               </Col>

//               <Col md={8} className="order-2 order-md-1">
//                 <table className="table table-borderless" style={{ width: "100%", marginBottom: 4 }}>
//                   <tbody>
//                     {data.map((row, idx) => (
//                       <tr key={idx} style={{ borderBottom: "none" }}>
//                         <td style={{ width: "40%", ...smallField, padding: "6px 8px" }}>{row.field}</td>
//                         <td style={{ width: "60%", ...smallText, padding: "6px 8px" }}>{row.value}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </Col>
//             </Row>

//             <hr style={{ margin: "8px 0" }} />

//             <div>
//               <h5 className="text-center" style={{ fontSize: 15, marginBottom: 6 }}>General Instructions / सामान्य निर्देश</h5>
//               <ol style={{ textAlign: "left", paddingLeft: 20, marginBottom: 6 }}>
//                 {generalInstructions.map((item, idx) => (
//                   <li key={idx} style={{ marginBottom: 6, fontSize: 13, textAlign: "left" }}>
//                     <div style={{ lineHeight: 1.15 }}>{item.en}</div>
//                     <div style={{ marginTop: 4, lineHeight: 1.15 }}>{item.hi}</div>
//                   </li>
//                 ))}
//               </ol>
//               <p style={{ fontWeight: "bold", fontSize: 13, marginBottom: 2 }}>
//                 Note: If you have any doubts regarding registration, then contact us: 7982109054, 7982109215, 7982108494
//               </p>
//             </div>
//           </Card.Body>

//           <Card.Footer className="bg-white text-center border-0 py-2">
//             <div style={{ fontSize: 12, color: "#666" }}>
//               <small>Keep this admit card safe. Carry required documents to exam centre.</small>
//             </div>
//           </Card.Footer>
//         </Card>

//         <Modal show={showModal} onHide={() => { if (!busy) setShowModal(false); }} centered>
//           <Modal.Header closeButton>
//             <Modal.Title>{busy ? "Generating PDF..." : error ? "Error" : "Status"}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {busy ? <div className="text-center"><Spinner animation="border" /> <div className="mt-2">Preparing PDF — please wait.</div></div> : (error ? <div className="text-danger">{error}</div> : <div>Admit Card Downloaded.</div>)}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)} disabled={busy}>Close</Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     );
//   };

//   // else render single UI (singleStudent prop if provided, otherwise studentData from context)
//   return renderAdmitCardUI(singleStudent || studentData);
// };







import React, { useContext, useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Modal, Spinner } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { StudentContext } from "../NewContextApis/StudentContextApi.js";
import { UserContext } from "../NewContextApis/UserContext.js";
import { BulkDownloadContext } from "../ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi";

import { IsAdmitCardDownloaded } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

const logo = "/haryana.png";
const logo2 = "/admitBuniyaLogo.png";
const level1admitinstructions = "/level1admitinstructions.png";

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const Level1AdmitCard = ({ singleStudent = null, bulkDownload = null, onDone = () => {} }) => {
  // contexts
  const { studentData } = useContext(StudentContext);
  const { userData } = useContext(UserContext);
  const { bulkDownload: contextBulkDownload, setBulkDownload } = useContext(BulkDownloadContext);

  // local state
  const [busy, setBusy] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // Decide what students to process:
  // Priority: bulkDownload prop > contextBulkDownload > singleStudent > studentData
  const studentsToProcess = bulkDownload || contextBulkDownload;

  // Format date helper
  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Build single PDF blob (used by both single and bulk)
  const buildPdfBlob = async (student) => {
    // try load Devanagari font (optional)
    try {
      const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
      const fResp = await fetch(fontUrl);
      if (fResp.ok) {
        const buf = await fResp.arrayBuffer();
        const base64 = arrayBufferToBase64(buf);
        if (jsPDF.API && jsPDF.API.addFileToVFS) {
          jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64);
          jsPDF.API.addFont("NotoSansDevanagari-Regular.ttf", "NotoDeva", "normal");
        }
      }
    } catch (e) {
      // font optional — continue
      console.warn("Devanagari font load failed:", e);
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // border
    doc.rect(5, 5, 200, 285);

    // logos - best effort
    try { doc.addImage(logo, "PNG", 10, 8, 20, 20); } catch (e) {}
    try { doc.addImage(logo2, "PNG", 180, 8, 20, 20); } catch (e) {}

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(12);
    doc.text("Directorate of School Education (DSE) Shiksha Sadan, Haryana", pageWidth / 2, 10, { align: "center" });
    doc.setFontSize(13);
    const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";
    doc.text(`${examLevel} Level 1 Exam (2026-28)`, pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("E – Admit Card", pageWidth / 2, 22, { align: "center" });
    doc.setFontSize(10);
    doc.text("Examination Date: 30th January", pageWidth / 2, 27, { align: "center" });
    doc.text("Reporting Time: 10:30 AM, Exam Time: 11:30 AM", pageWidth / 2, 32, { align: "center" });

    const dataForPdf = [
      ["Student Name", student.name ?? "-"],
      ["Father's Name", student.father ?? "-"],
      ["Date of Birth", student.dob ? formatDateToDDMMYYYY(student.dob) : "-"],
      ["Category", student.category ?? "-"],
      ["SRN Number", student.srn ?? "-"],
      ["Exam Roll Number", student.rollNumber ?? "-"],
      ["Aadhar Number", student.aadhar ?? "-"],
      ["Mobile Number", student.mobile ?? "-"],
      ["District", (student.schoolDistrict ?? "-") + (student.schoolDistrictCode ? ` (${student.schoolDistrictCode})` : "")],
      ["Block", (student.schoolBlock ?? "-") + (student.schoolBlockCode ? ` (${student.schoolBlockCode})` : "")],
      ["Examination Center", student.L1ExaminationCenter ?? "-"]
    ];

    doc.autoTable({
      startY: 40,
      body: dataForPdf,
      theme: "grid",
      styles: { lineWidth: 0.2, lineColor: [0, 0, 0], fillColor: false, textColor: [0, 0, 0], fontSize: 10 },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 80 } },
      tableWidth: "wrap"
    });

    // photo area
    if (student.imageUrl) {
      try {
        doc.addImage(student.imageUrl, "PNG", 150, 40, 50, 50);
      } catch (e) {
        doc.rect(150, 40, 50, 50);
        doc.text("Photo unavailable", 153, 65);
      }
    } else {
      doc.rect(150, 40, 50, 50);
      doc.text("If no photo,", 155, 60);
      doc.text("please attach passport", 155, 65);
      doc.text("size photo", 155, 70);
    }

    // dividing line and instructions
    doc.setLineWidth(0.5);
    doc.line(10, 130, pageWidth - 10, 130);
    try {
      doc.addImage(level1admitinstructions, "PNG", 15, 132, 180, 155);
    } catch (e) {
      doc.setFontSize(9);
      doc.text("General Instructions: Reach 30 minutes early. Carry admit card & Aadhar. Do not carry mobile/calculators etc.", 15, 135, { maxWidth: pageWidth - 30 });
    }

    return doc.output("blob");
  };

  // Download single PDF directly
  const downloadSinglePdf = async (student) => {
    setError(null);
    setBusy(true);
    setShowModal(true);
    try {
      const blob = await buildPdfBlob(student);
      const safeName = (student.srn || student.name || "admit").toString().replace(/\s+/g, "_");
      saveAs(blob, `${safeName}_admit_card.pdf`);

      // notify backend (best-effort)
      try {
        await IsAdmitCardDownloaded({
          _id: student._id,
          admitCardDownloadStatus: { isL1AdmitCardDownloaded: true }
        });
      } catch (e) {
        console.warn("Notify failed:", e);
      }
    } catch (err) {
      console.error("Single PDF generation error:", err);
      setError("Error generating PDF. Check console.");
    } finally {
      setBusy(false);
    }
  };

  // Bulk runner: create PDFs for all students in array -> zip -> download
  const runBulk = async (studentsArr) => {
    setError(null);
    setBusy(true);
    setShowModal(true);
    try {
      // If only one student, download as single PDF directly
      if (studentsArr.length === 1) {
        await downloadSinglePdf(studentsArr[0]);
        return;
      }

      // Multiple students - create ZIP
      const zip = new JSZip();
      for (let i = 0; i < studentsArr.length; i++) {
        const st = studentsArr[i];
        try {
          const b = await buildPdfBlob(st);
          const safeName = (st.srn || st.name || `admit_${i}`).toString().replace(/\s+/g, "_");
          zip.file(`${safeName}_admit_card.pdf`, b);
        } catch (perErr) {
          console.warn(`Failed to create PDF for ${st._id || st.srn || st.name}`, perErr);
        }
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `admit_cards_${Date.now()}.zip`);

      // notify backend for each student (best-effort)
      for (const st of studentsArr) {
        try {
          await IsAdmitCardDownloaded({
            _id: st._id,
            admitCardDownloadStatus: { isL1AdmitCardDownloaded: true }
          });
        } catch (e) {
          console.warn("Notify failed for", st._id, e);
        }
      }
    } catch (err) {
      console.error("Bulk error:", err);
      setError("Error generating PDFs. Check console.");
    } finally {
      setBusy(false);
      // clear bulk context after done
      setBulkDownload(null);
      onDone();
    }
  };

  // Auto-run bulk if bulkDownload present and this component is mounted
  useEffect(() => {
    if (Array.isArray(studentsToProcess) && studentsToProcess.length > 0) {
      // run in next tick
      (async () => {
        await runBulk(studentsToProcess);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentsToProcess]);

  // If we have bulk download data, don't show any UI - just process in background
  if (Array.isArray(studentsToProcess) && studentsToProcess.length > 0) {
    return (
      <Modal show={showModal} onHide={() => {}} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>
            {studentsToProcess.length === 1 ? "Downloading Admit Card" : "Downloading Admit Cards"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {busy ? (
            <>
              <Spinner animation="border" variant="primary" />
              <div className="mt-2">
                {studentsToProcess.length === 1 
                  ? "Preparing admit card..." 
                  : `Preparing ${studentsToProcess.length} admit cards...`}
              </div>
            </>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <div>
              {studentsToProcess.length === 1 
                ? "Admit card downloaded successfully!" 
                : "Admit cards downloaded successfully!"}
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  }

  // Original UI for single student mode (only shown when no bulk download)
  const renderAdmitCardUI = (student) => {
    if (!student || Object.keys(student).length === 0) {
      return (
        <Modal show centered onHide={() => {}}>
          <Modal.Header closeButton>
            <Modal.Title>Registration Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please register first to generate your acknowledgment slip.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={onDone}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }

    const formattedDate = student.dob ? formatDateToDDMMYYYY(student.dob) : formatDateToDDMMYYYY(new Date());
    const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";

    const data = [
      { field: "Student Name", value: student.name || "-" },
      { field: "Father's Name", value: student.father || "-" },
      { field: "Date of Birth", value: formattedDate || "-" },
      { field: "Category", value: student.category || "-" },
      { field: "SRN Number", value: student.srn || "-" },
      { field: "Exam Roll Number", value: student.rollNumber || "-" },
      { field: "Aadhar Number", value: student.aadhar || "-" },
      { field: "Mobile Number", value: student.mobile || "-" },
      { field: "District", value: (student.schoolDistrict ? student.schoolDistrict : "-") + (student.schoolDistrictCode ? " (" + student.schoolDistrictCode + ")" : "") },
      { field: "Block", value: (student.schoolBlock ? student.schoolBlock : "-") + (student.schoolBlockCode ? " (" + student.schoolBlockCode + ")" : "") },
      { field: "Examination Center", value: student.L1ExaminationCenter || "-" },
    ];

    const generalInstructions = [
      { en: "Students need to reach at least 30 minutes prior to the exam centre for the proper and hassle-free seating arrangements.", hi: "छात्रों को उचित और परेशानी मुक्त बैठने की व्यवस्था के लिए परीक्षा केंद्र में कम से कम 30 मिनट पहले पहुंचना होगा।" },
      { en: "Students should carry the hard copies of the following documents on the day of your examination.\n  a. Admit Card\n  b. Aadhar Card", hi: "छात्रों को परीक्षा देने हेतु निम्नलिखित दस्तावेजों की हार्ड कॉपी अपने साथ लेकर जाना हैं।\n  a. Admit Card (एडमिट कार्ड)\n  b. Aadhar Card (आधार कार्ड)" },
      { en: "Students should carry proper stationary required for the exam like Blue Ball Pen, Pencil, Eraser etc. Carry a water bottle at the centre.", hi: "छात्र छात्राएं परीक्षा देने हेतु अपने साथ नीली स्याही वाले कलम, पेंसिल, रबर लेकर जाएं। साथ में एक पानी की बॉटल रख सकते हैं।" },
      { en: "Students should come to exam centre in School uniform only.", hi: "छात्रों को स्कूल यूनिफॉर्म में ही परीक्षा केंद्र पर आना चाहिए।" },
      { en: "Do not carry any personal, valuable items or any gadgets such as mobile phone, calculator etc.", hi: "कोई भी व्यक्तिगत, मूल्यवान वस्तु या कोई गैजेट्स जैसे मोबाइल फोन, कैलकुलेटर आदि न ले जाएं।" },
      { en: "Please ensure that you fill all information properly and accurately.", hi: "कृपया सुनिश्चित करें कि आप सभी जानकारी ठीक से और सही तरीके से भरें।" },
      { en: "Any cutting, overwriting, or the use of correction fluid is not allowed on the OMR (Optical Mark Recognition) sheet. Your OMR sheet will not be accepted in such cases.", hi: "ओएमआर (ऑप्टिकल मार्क रिकग्निशन) शीट पर किसी भी कटिंग, ओवरराइटिंग या करेक्शन फ्लूइड के उपयोग की अनुमति नहीं है। ऐसे मामलों में आपकी ओएमआर शीट स्वीकार नहीं की जाएगी।" },
      { en: "No student should indulge in any unfair examination practices. If found, there could be strict consequences to it including disqualification of student.", hi: "परीक्षा के समय यदि किसी छात्रा या छात्रों को अनुचित प्रयास में पकड़ा जाता है, तो इसका परिणाम सख्त हो सकता है और परीक्षा से अयोग्य घोषित किया जा सकता है।" },
      { en: "Students should paste a colored passport size photograph, duly attested by your school principal in-case the same is missing from your admit card.", hi: "एडमिट कार्ड पर छात्र या छात्रा की फोटो न होने पर, उन्हें स्कूल प्रधानाचार्य द्वारा सत्यापित रंगीन फोटो एडमिट कार्ड में संलग्न करना आवश्यक होगा।" },
      { en: "Please verify that all the information on this admit card is accurate. If you find any errors, kindly get them corrected by contacting us at the helpline number: 7982109054, 7982109215, 7982108494.", hi: "कृपया सत्यापित करें कि इस प्रवेश पत्र में दी गई सभी जानकारी सही है। यदि कोई संदेह हो, तो हेल्पलाइन से संपर्क करें। 7982109054, 7982109215, 7982108494" },
    ];

    const cardStyle = { borderRadius: "10px", padding: "12px" };
    const smallText = { fontSize: "13px", marginBottom: 4 };
    const smallField = { fontSize: "13px", fontWeight: 600 };

    return (
      <Container className="py-2">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div style={{ textAlign: "center" }}>
            <a
              onClick={() => downloadSinglePdf(student)}
              style={{ cursor: "pointer", fontWeight: "bold", fontSize: "25px", animation: "blink 1s infinite", alignItems: "centers" }}
              className="blinking-link"
            >
              Click here to download your Admit Card. <br />
              (अपना प्रवेश पत्र डाउनलोड करने के लिए यहाँ क्लिक करें)
            </a>
            <style>{`@keyframes blink { 0% { color: red; } 50% { color: blue; } 100% { color: red; } } .blinking-link { text-decoration: underline; }`}</style>
          </div>
        </div>

        <Card className="shadow" style={cardStyle}>
          <Card.Header className="bg-white text-center border-0 py-2">
            <div className="d-flex justify-content-between align-items-start">
              <img src={logo} alt="Haryana Logo" style={{ width: "50px" }} />
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 12 }}>Directorate of School Education (DSE) Shiksha Sadan, Haryana</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{examLevel} Level 1 Exam (2026-28)</div>
                <div style={{ fontSize: 12 }}>E – Admit Card</div>
                <div style={{ fontSize: 11 }}>Examination Date: 30th January</div>
                <div style={{ fontSize: 11 }}>Reporting Time: 10:30 AM, Exam Time: 11:30 AM</div>
              </div>
              <img src={logo2} alt="Exam Logo" style={{ width: "50px" }} />
            </div>
          </Card.Header>

          <Card.Body style={{ padding: "12px" }}>
            <Row>
              <Col md={4} className="text-center order-1 order-md-2">
                <div style={{ width: "140px", height: "140px", border: "1px solid #000", margin: "0 auto 8px auto", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  {student.imageUrl ? <img src={student.imageUrl} alt="Student" style={{ maxWidth: "100%", maxHeight: "100%" }} /> : <>
                    <div style={{ fontSize: "11px" }}>If no photo,</div>
                    <div style={{ fontSize: "11px" }}>please attach passport</div>
                    <div style={{ fontSize: "11px" }}>size photo</div>
                  </>}
                </div>
              </Col>

              <Col md={8} className="order-2 order-md-1">
                <table className="table table-borderless" style={{ width: "100%", marginBottom: 4 }}>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "none" }}>
                        <td style={{ width: "40%", ...smallField, padding: "6px 8px" }}>{row.field}</td>
                        <td style={{ width: "60%", ...smallText, padding: "6px 8px" }}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Row>

            <hr style={{ margin: "8px 0" }} />

            <div>
              <h5 className="text-center" style={{ fontSize: 15, marginBottom: 6 }}>General Instructions / सामान्य निर्देश</h5>
              <ol style={{ textAlign: "left", paddingLeft: 20, marginBottom: 6 }}>
                {generalInstructions.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 6, fontSize: 13, textAlign: "left" }}>
                    <div style={{ lineHeight: 1.15 }}>{item.en}</div>
                    <div style={{ marginTop: 4, lineHeight: 1.15 }}>{item.hi}</div>
                  </li>
                ))}
              </ol>
              <p style={{ fontWeight: "bold", fontSize: 13, marginBottom: 2 }}>
                Note: If you have any doubts regarding registration, then contact us: 7982109054, 7982109215, 7982108494
              </p>
            </div>
          </Card.Body>

          <Card.Footer className="bg-white text-center border-0 py-2">
            <div style={{ fontSize: 12, color: "#666" }}>
              <small>Keep this admit card safe. Carry required documents to exam centre.</small>
            </div>
          </Card.Footer>
        </Card>

        <Modal show={showModal} onHide={() => { if (!busy) setShowModal(false); }} centered>
          <Modal.Header closeButton>
            <Modal.Title>{busy ? "Generating PDF..." : error ? "Error" : "Status"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {busy ? <div className="text-center"><Spinner animation="border" /> <div className="mt-2">Preparing PDF — please wait.</div></div> : (error ? <div className="text-danger">{error}</div> : <div>Admit Card Downloaded.</div>)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={busy}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  };

  // else render single UI (singleStudent prop if provided, otherwise studentData from context)
  return renderAdmitCardUI(singleStudent || studentData);
};