



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


// import { useNavigate } from "react-router-dom";
// import { rgb } from "pdf-lib";


// const logo = "/haryana.png";
// const logo2 = "/admitBuniyaLogo.png";
// const level1admitinstructions = "/s100admitinstructionsLevel2Using.png";

// const certificate = "/L1HSQualificationCertificateblank.png"

// const arrayBufferToBase64 = (buffer) => {
//     let binary = "";
//     const bytes = new Uint8Array(buffer);
//     for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
//     return btoa(binary);
// };

// export const ResultSuper100L1 = ({ singleStudent = null, bulkDownload = null, onDone = () => { } }) => {
//     // contexts
//     const { studentData } = useContext(StudentContext);
//     const { userData } = useContext(UserContext);
//     const { bulkDownload: contextBulkDownload, setBulkDownload } = useContext(BulkDownloadContext);

//     // local state
//     const [busy, setBusy] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [error, setError] = useState(null);


//     const navigate = useNavigate();

//     // Decide what students to process:
//     // Priority: bulkDownload prop > contextBulkDownload > singleStudent > studentData
//     const studentsToProcess = bulkDownload || contextBulkDownload;

//     // Format date helper
//     const formatDateToDDMMYYYY = (dateStr) => {
//         if (!dateStr) return "-";
//         const d = new Date(dateStr);
//         const day = String(d.getDate()).padStart(2, "0");
//         const month = String(d.getMonth() + 1).padStart(2, "0");
//         const year = d.getFullYear();
//         return `${day}-${month}-${year}`;
//     };

//     // Build single PDF blob (used by both single and bulk)
//     const buildPdfBlob = async (student) => {
//         // try load Devanagari font (optional)
//         try {
//             const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
//             const fResp = await fetch(fontUrl);
//             if (fResp.ok) {
//                 const buf = await fResp.arrayBuffer();
//                 const base64 = arrayBufferToBase64(buf);
//                 if (jsPDF.API && jsPDF.API.addFileToVFS) {
//                     jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64);
//                     jsPDF.API.addFont("NotoSansDevanagari-Regular.ttf", "NotoDeva", "normal");
//                 }
//             }
//         } catch (e) {
//             // font optional — continue
//             console.warn("Devanagari font load failed:", e);
//         }

//         const doc = new jsPDF();
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(11);

//         // border
//         doc.rect(5, 5, 200, 285);

//         // logos - best effort
//         try { doc.addImage(logo, "PNG", 10, 8, 20, 20); } catch (e) { }
//         try { doc.addImage(logo2, "PNG", 180, 8, 20, 20); } catch (e) { }

//         const pageWidth = doc.internal.pageSize.getWidth();

//         doc.setFontSize(12);
//         doc.text("Directorate of School Education (DSE) Shiksha Sadan, Haryana", pageWidth / 2, 10, { align: "center" });
//         doc.setFontSize(13);
//         const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";
//         doc.text(`${examLevel} Level 2 Exam (2026-28)`, pageWidth / 2, 15, { align: "center" });
//         doc.setFontSize(12);
//         doc.text("E – Admit Card", pageWidth / 2, 22, { align: "center" });
//         // doc.setFontSize(10);
//         // doc.text(`Examination Date: 26th December, Friday`, pageWidth / 2, 27, { align: "center" });


//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(10);
//         doc.text("Examination Date: 30th January, Friday", pageWidth / 2, 27, { align: "center" });

//         doc.setFontSize(10);
//         doc.text("Reporting Time: 12:30 PM, Exam Time: 01:30 PM to 2:45 PM", pageWidth / 2, 32, { align: "center" });

//         const dataForPdf = [
//             ["Student Name", student.name ?? "-"],
//             ["Father Name", student.father ?? "-"],
//             ["Date of Birth", student.dob ? formatDateToDDMMYYYY(student.dob) : "-"],
//             ["Category", student.category ?? "-"],
//             ["SRN Number", student.srn ?? "-"],
//             ["Exam Roll Number", student.rollNumber ?? "-"],
//             ["Aadhar Number", student.aadhar ?? "-"],
//             ["Mobile Number", student.mobile ?? "-"],

//             // ["District", (student.schoolDistrict ?? "-") + (student.schoolDistrictCode ? ` (${student.schoolDistrictCode})` : "")],
//             // ["Block", (student.schoolBlock ?? "-") + (student.schoolBlockCode ? ` (${student.schoolBlockCode})` : "")],


//             ["District", (student.L2ExaminationDistrict)],
//             ["Block", (student.L2ExaminationBlock)],
//             ["Examination Center", student.L2ExaminationCenter ?? "-"]
//         ];

//         doc.autoTable({
//             startY: 40,
//             body: dataForPdf,
//             theme: "grid",
//             styles: { lineWidth: 0.2, lineColor: [0, 0, 0], fillColor: false, textColor: [0, 0, 0], fontSize: 10 },
//             columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 80 } },
//             tableWidth: "wrap"
//         });

//         // photo area
//         if (student.imageUrl) {
//             try {
//                 doc.addImage(student.imageUrl, "PNG", 150, 40, 50, 50);
//             } catch (e) {
//                 doc.rect(150, 40, 50, 50);
//                 doc.text("Paste your passport-size", 155, 60);
//                 doc.text("photograph duly attested", 155, 65);
//                 doc.text("by the school principal.", 155, 70);
//             }
//         } else {
//             doc.rect(150, 40, 50, 50);
//             doc.text("Paste your passport-size", 155, 60);
//             doc.text("photograph duly attested", 155, 65);
//             doc.text("by the school principal.", 155, 70);
//         }


                                                                    
    

//         // dividing line and instructions
//         doc.setLineWidth(0.5);
//         doc.line(10, 130, pageWidth - 10, 130);
//         try {
//             doc.addImage(level1admitinstructions, "PNG", 15, 132, 180, 152);
//         } catch (e) {
//             doc.setFontSize(9);
//             doc.text("General Instructions: Reach 30 minutes early. Carry admit card & Aadhar. Do not carry mobile/calculators etc.", 15, 135, { maxWidth: pageWidth - 30 });
//         }

//         return doc.output("blob");
//     };

//     // Download single PDF directly
//     const downloadSinglePdf = async (student) => {
//         setError(null);
//         setBusy(true);
//         setShowModal(true);
//         try {
//             const blob = await buildPdfBlob(student);
//             const safeName = (student.srn || student.name || "admit").toString().replace(/\s+/g, "_");
//             saveAs(blob, `${safeName}_admit_card.pdf`);

//             // notify backend (best-effort)
//             try {
//                 await IsAdmitCardDownloaded({
//                     _id: student._id,
//                     admitCardDownloadStatus: { isL2AdmitCardDownloaded: true }
//                 });
//             } catch (e) {
//                 console.warn("Notify failed:", e);
//             }
//         } catch (err) {
//             console.error("Single PDF generation error:", err);
//             setError("Error generating PDF. Check console.");
//         } finally {
//             setBusy(false);
//         }
//     };

//     // Bulk runner: create PDFs for all students in array -> zip -> download
//     const runBulk = async (studentsArr) => {
//         setError(null);
//         setBusy(true);
//         setShowModal(true);
//         try {
//             // If only one student, download as single PDF directly
//             if (studentsArr.length === 1) {
//                 await downloadSinglePdf(studentsArr[0]);
//                 return;
//             }

//             // Multiple students - create ZIP
//             const zip = new JSZip();
//             for (let i = 0; i < studentsArr.length; i++) {
//                 const st = studentsArr[i];
//                 try {
//                     const b = await buildPdfBlob(st);
//                     const safeName = (st.srn || st.name || `admit_${i}`).toString().replace(/\s+/g, "_");
//                     zip.file(`${safeName}_admit_card.pdf`, b);
//                 } catch (perErr) {
//                     console.warn(`Failed to create PDF for ${st._id || st.srn || st.name}`, perErr);
//                 }
//             }
//             const content = await zip.generateAsync({ type: "blob" });
//             saveAs(content, `admit_cards_${Date.now()}.zip`);

//             // notify backend for each student (best-effort)
//             for (const st of studentsArr) {
//                 try {
//                     await IsAdmitCardDownloaded({
//                         _id: st._id,
//                         admitCardDownloadStatus: { isL2AdmitCardDownloaded: true }
//                     });
//                 } catch (e) {
//                     console.warn("Notify failed for", st._id, e);
//                 }
//             }
//         } catch (err) {
//             console.error("Bulk error:", err);
//             setError("Error generating PDFs. Check console.");
//         } finally {
//             setBusy(false);
//             // clear bulk context after done
//             setBulkDownload(null);
//             onDone();
//         }
//     };

//     // Auto-run bulk if bulkDownload present and this component is mounted
//     useEffect(() => {
//         if (Array.isArray(studentsToProcess) && studentsToProcess.length > 0) {
//             // run in next tick
//             (async () => {
//                 await runBulk(studentsToProcess);
//             })();
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [studentsToProcess]);

//     // If we have bulk download data, don't show any UI - just process in background
//     if (Array.isArray(studentsToProcess) && studentsToProcess.length > 0) {
//         return (
//             <Modal show={showModal} onHide={() => { }} centered backdrop="static">
//                 <Modal.Header>
//                     <Modal.Title>
//                         {studentsToProcess.length === 1 ? "Downloading Admit Card" : "Downloading Admit Cards"}
//                     </Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className="text-center">
//                     {busy ? (
//                         <>
//                             <Spinner animation="border" variant="primary" />
//                             <div className="mt-2">
//                                 {studentsToProcess.length === 1
//                                     ? "Preparing admit card..."
//                                     : `Preparing ${studentsToProcess.length} admit cards...`}
//                             </div>
//                         </>
//                     ) : error ? (
//                         <div className="text-danger">{error}</div>
//                     ) : (
//                         <div>
//                             {studentsToProcess.length === 1
//                                 ? "Admit card downloaded successfully!"
//                                 : "Admit cards downloaded successfully!"}
//                         </div>
//                     )}
//                 </Modal.Body>
//             </Modal>
//         );
//     }

//     // Original UI for single student mode (only shown when no bulk download)
//     const renderAdmitCardUI = (student) => {
//         if (!student || Object.keys(student).length === 0) {
//             return (
//                 <Modal show centered onHide={() => { }}>
//                     <Modal.Header closeButton>
//                         <Modal.Title>Registration Required</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <p>Please register first to generate your acknowledgment slip.</p>
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button variant="primary" onClick={onDone}>
//                             Close
//                         </Button>
//                     </Modal.Footer>
//                 </Modal>
//             );
//         }

//         const formattedDate = student.dob ? formatDateToDDMMYYYY(student.dob) : formatDateToDDMMYYYY(new Date());
//         const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";

//         const data = [
//             { field: "Student Name", value: student.name || "-" },
//             { field: "Father's Name", value: student.father || "-" },
//             { field: "Date of Birth", value: formattedDate || "-" },
//             { field: "Category", value: student.category || "-" },
//             { field: "SRN Number", value: student.srn || "-" },
//             { field: "Exam Roll Number", value: student.rollNumber || "-" },
//             { field: "Aadhar Number", value: student.aadhar || "-" },
//             { field: "Mobile Number", value: student.mobile || "-" },
//             { field: "District", value: (student.schoolDistrict ? student.schoolDistrict : "-") + (student.schoolDistrictCode ? " (" + student.schoolDistrictCode + ")" : "") },
//             { field: "Block", value: (student.schoolBlock ? student.schoolBlock : "-") + (student.schoolBlockCode ? " (" + student.schoolBlockCode + ")" : "") },
//             { field: "Examination Center", value: student.L1ExaminationCenter || "-" },
//         ];

//         // NEW: Show only the basic details table and a download blinking hyperlink/button below it.
//         // Kept everything else (functions, imports, comments) unchanged as requested.
//         const cardStyle = { borderRadius: "12px", padding: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" };
//         const smallText = { fontSize: "14px", marginBottom: 4, color: "#333" };
//         const smallField = { fontSize: "14px", fontWeight: 600, color: "#222" };

//         //certificate



//         const downloadCertificate = async (student) => {
//             try {
//                 const doc = new jsPDF("landscape", "mm", "a4");

//                 // Template
//                 const templatePath = "/L1HSQualificationCertificateblank.png";
//                 const response = await fetch(templatePath);
//                 const blob = await response.blob();

//                 const imgBase64 = await new Promise((resolve) => {
//                     const reader = new FileReader();
//                     reader.onload = () => resolve(reader.result);
//                     reader.readAsDataURL(blob);
//                 });

//                 doc.addImage(imgBase64, "PNG", 0, 0, 297, 210);

//                 // Safe values
//                 const name = student?.name || "";
//                 const father = student?.father || "";
//                 const district = student?.L1ExaminationDistrict || "";
//                 const block = student?.L1ExaminationBlock || "";
//                 const school = student?.school || "";
//                 const stateRank = student?.stateRank || "";
//                 const districtRank = student?.districtRankL1 || "";
//                 const blockRank = student?.blockRankL1 || "";

//                 const startX = 35;
//                 let y = 100;

//                 doc.setFont("times", "normal");
//                 doc.setFontSize(16);

//                 // ---------- LINE 1 ----------
//                 doc.text("This is to certify that", startX, y);

//                 doc.setFont("times", "bold");
//                 doc.text(name, startX + 49, y);
//                 let nameWidth = doc.getTextWidth(name);
//                 doc.line(startX + 49, y + 1.5, startX + 90 + nameWidth, y + 1.5);

//                 doc.setFont("times", "normal");
//                 doc.text(", Son/Daughter of Shri", startX + 90 + nameWidth, y);

//                 doc.setFont("times", "bold");
//                 doc.text(father, startX + 143 + nameWidth, y);
//                 let fatherWidth = doc.getTextWidth(father);
//                 doc.line(
//                     startX + 143 + nameWidth,
//                     y + 1.5,
//                     startX + 193 + nameWidth + fatherWidth,
//                     y + 1.5
//                 );


                

//                 // ---------- LINE 2 ----------
//                 // y += 12;
//                 // doc.setFont("times", "normal");
//                 // doc.text("from", startX, y);

//                 // doc.setFont("times", "bold");
//                 // const placeText = `${district}${district && block ? ", " : ""}${block}`;
//                 // doc.text(placeText, startX + 25, y);
//                 // let placeWidth = doc.getTextWidth(placeText);
//                 // doc.line(startX + 25, y + 1.5, startX + 25 + placeWidth, y + 1.5);



//                 y += 12;
//                 doc.setFont("times", "normal");
//                 doc.text("from district", startX, y);

//                 let xCursor = startX + 13;

//                 // District
//                 doc.setFont("times", "bold");
//                 doc.text(`${district.replace(/\s*-\s*\(.*?\)\s*$/, "") || ""}`, xCursor + 17, y);
//                 let districtWidth = doc.getTextWidth(district);
//                 doc.line(xCursor + 16, y + 1.5, xCursor + 32 + districtWidth, y + 1.5);
//                 doc.setFont("times", "normal");
//                 doc.text(",", xCursor + 52, y);

//                 doc.setFont("times", "normal");
//                 doc.text("block", xCursor + 54, y);


//                 xCursor += districtWidth;

//                 // // Comma between
//                 // if (district && block) {
//                 //   doc.setFont("times", "normal");
//                 //   doc.text(", ", xCursor, y);
//                 //   xCursor += doc.getTextWidth(", ");
//                 // }

//                 // Block
//                 doc.setFont("times", "bold");
//                 doc.text(`${block.replace(/\s*-\s*\(.*?\)\s*$/, "") || ""
//                     }`, xCursor + 50, y);
//                 let blockWidth = doc.getTextWidth(block);
//                 doc.line(xCursor + 50, y + 1.5, xCursor + 100, y + 1.5);






//                 // ---------- LINE 3 (School – dynamic font) ----------
//              y += 12;
//                 doc.setFont("times", "normal");
//                 doc.text("school", startX, y);

//                 let schoolFontSize = 14;
//                 doc.setFont("times", "bold");
//                 doc.setFontSize(schoolFontSize);

//                 while (doc.getTextWidth(school) > 200 && schoolFontSize > 13) {
//                     schoolFontSize--;
//                     doc.setFontSize(schoolFontSize);
//                 }

//                 doc.text(`${school}`, startX + 27, y);
//                 let schoolWidth = doc.getTextWidth(school);
//                 doc.line(startX + 20, y + 1.5, startX + 55 + schoolWidth, y + 1.5);


//                 // ---------- LINE 4 ----------
//                 y += 14;
//                 doc.setFontSize(16);
//                 doc.setFont("times", "normal");
//                 doc.text("has qualified the", startX, y);

//                 doc.setFont("times", "bold");
//                 doc.text(
//                     "Haryana Super 100 Entrance Examination Level 1 for the batch 2026–28.",
//                     startX + 39,
//                     y,
//                     { maxWidth: 220 }
//                 );

//                 // ---------- RANKS ----------
//                 y += 18;
//                 doc.setFont("times", "normal");
//                 doc.setFontSize(14);

//                 // doc.text(`State Rank : ${stateRank}`, startX, y);
//                 // doc.text(`District Rank : ${districtRank}`, startX, y + 10);
//                 // doc.text(`Block Rank : ${blockRank}`, startX, y + 20);

//                 // Save
//                 doc.save(`${name || "Student"}_HS100_Level1_Qualification_Certificate.pdf`);



//                   // notify backend (best-effort)
//             try {
//                 await IsAdmitCardDownloaded({
//                     _id: student._id,
//                     admitCardDownloadStatus: { L1ResultDownloaded: true }
//                 });
//             } catch (e) {
//                 console.warn("Notify failed:", e);
//             }
//             } catch (err) {
//                 console.error("Certificate error:", err);
//                 alert("Certificate download failed");
//             }
//         };



//         const resultChecked = async () =>{
           

//              try {
//                 await IsAdmitCardDownloaded({
//                     _id: student._id,
//                     admitCardDownloadStatus: { L1ResultDownloaded: true }
//                 });
//             } catch (e) {
//                 console.warn("Notify failed:", e);
//             }
//         }

//            resultChecked()

//         return (
//             <>
            
//             {student.L1Qualified === true ? (
//                 <Container className="py-3">
//                 {/* Top blinking download CTA */}


//                 <Card className="shadow-sm" style={cardStyle}>
//                     <Card.Header className="bg-white text-center border-0 py-2">
//                         <div style={{ textAlign: "center" }}>
//                             <div style={{ fontSize: 35, fontWeight: 700, color: "MediumSeaGreen" }}>Result Status - Selected
//                           </div>
//                         </div>
//                     </Card.Header>
//                     <hr></hr>
//                     <Card.Body style={{ padding: "14px" }}>


//                         <p
//                             style={{
//                                 color: "#000000ff",
//                                 fontWeight: "bold",


//                             }}
//                         >
//                             Dear {student.name},
//                             <br /><br />
//                             We are pleased to inform you that you have successfully Qualified the {" "}
//                             <strong>Haryana Super 100 Entrance Examination Level 1 for the 2026–28 batch.</strong>.
//                             <br /><br />
                        
//                             <strong>You may now download your Haryana Super 100 Entrance Examination Level 1 Qualifying Certificate using the link provided below.</strong>
                            
//                             <br /><br />
//                             <span style={{ fontWeight: "normal" }}>
//                                 (प्प्रिय {student.name}, हमें आपको यह सूचित करते हुए अत्यंत प्रसन्नता हो रही है कि आपने सत्र 2026–28 के लिए हरियाणा सुपर 100 प्रवेश परीक्षा लेवल 1 सफलतापूर्वक उत्तीर्ण कर ली है। आप नीचे दिए गए लिंक के माध्यम से हरियाणा सुपर 100 परीक्षा लेवल 1 का उत्तीर्णता प्रमाण पत्र डाउनलोड कर सकते हैं।)
//                             </span>
//                         </p>

//                     <hr></hr>
// <p>
//      <br /><br />
//                             <span style={{ fontWeight: "normal" , fontWeight:"bold", color:'red', fontSize:'150%'}}>
//                                 Note: Students are informed that their admit cards will be available for download soon. They will be notified once the admit cards are released.

// (छात्रों को सूचित किया जाता है कि उनके एडमिट कार्ड जल्द ही डाउनलोड के लिए उपलब्ध होंगे। एडमिट कार्ड जारी होने पर उन्हें सूचित कर दिया जाएगा।)
//                             </span>
// </p>

//                         <hr></hr>

//                         <br></br>
//                         <div className="d-flex align-items-center justify-content-center mb-3">
//                             <div style={{ textAlign: "center" }}>
//                                 <a
//                                     onClick={() => downloadSinglePdf(student)}
//                                     style={{ cursor: "pointer", fontWeight: "bold", fontSize: "22px", animation: "blink 1s infinite", alignItems: "center" }}
//                                     className="blinking-link"
//                                 >
//                                     Download Haryana Super 100 Level-2 Admit Card. <br />
//                                     (अपना लेवल-2 प्रवेश पत्र डाउनलोड करें)
//                                 </a>
//                                 <style>{`@keyframes blink { 0% { color: #d33; } 50% { color: #0b5fff; } 100% { color: #d33; } } .blinking-link { text-decoration: underline; }`}</style>
//                             </div>
//                         </div>



//                         <div className="d-flex align-items-center justify-content-center mb-3">
//                             <div style={{ textAlign: "center" }}>
//                                 <a
//                                     onClick={() => downloadCertificate(student)}
//                                     style={{ cursor: "pointer", fontWeight: "bold", fontSize: "22px", animation: "blink 1s infinite", alignItems: "center" }}
//                                     className="blinking-link"
//                                 >
//                                     Download Haryana Super 100 Level-1 Qualification Certificate. <br />
//                                     (हरियाणा सुपर 100 लेवल-1 प्रमाण पत्र डाउनलोड करें)
//                                 </a>
//                                 <style>{`@keyframes blink { 0% { color: #d33; } 50% { color: #0b5fff; } 100% { color: #d33; } } .blinking-link { text-decoration: underline; }`}</style>
//                             </div>
//                         </div>



//                         {/* <Button
//                   variant="success"
//                   className="m-2"
//                   onClick={() => downloadCertificate(student)}
//                 >
//                   Download Level-1 Qualification Certificate
//                 </Button> */}
//                     </Card.Body>

//                     <Card.Footer className="bg-white text-center border-0 py-2">
//                         <div style={{ fontSize: 12, color: "#666" }}>
//                             <small>Keep this admit card safe. Carry required documents to exam centre.</small>
//                         </div>
//                     </Card.Footer>
//                 </Card>

//                 <Modal show={showModal} onHide={() => { if (!busy) setShowModal(false); }} centered>
//                     <Modal.Header closeButton>
//                         <Modal.Title>{busy ? "Generating PDF..." : error ? "Error" : "Admit Card Status!"}</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         {busy ? <div className="text-center"><Spinner animation="border" /> <div className="mt-2">Preparing PDF — please wait.</div></div> : (error ? <div className="text-danger">{error}</div> : <div>Congratulations! You have successfully downloaded your admit card. (बधाई हो! आपने अपना प्रवेश पत्र सफलतापूर्वक डाउनलोड कर लिया है।)</div>)}
//                     </Modal.Body>
//                     <Modal.Footer>
//                         {/* <Button variant="secondary" onClick={() => setShowModal(false)} disabled={busy}>Close</Button>
//              */}



//                         <Button

//                             variant="secondary"
//                             onClick={() => navigate("/")}
//                             disabled={busy}
//                         >
//                             Close
//                         </Button>


//                     </Modal.Footer>
//                 </Modal>
//             </Container>


//             ):
//             (
//                 <Container className="py-3">
//   <Card className="shadow-sm" style={cardStyle}>
//     <Card.Header className="bg-white text-center border-0 py-2">
//       <div style={{ textAlign: "center" }}>
//         <div style={{ fontSize: 35, fontWeight: 700, color: "#555" }}>
//           NOT QUALIFIED!
//         </div>
//       </div>
//     </Card.Header>

//     <hr />

//     <Card.Body style={{ padding: "14px" }}>
//       <p
//         style={{
//           color: "#444",
//           fontWeight: "bold",
//           lineHeight: "1.7",
//         }}
//       >
//         Dear {student.name},
//         <br /><br />
//         You have Not Qualified for the Mission Buniyaad Entrance Examination Level-1. We encourage you to continue your academic efforts and wish you success in your future endeavors.
//         <br></br>
//         (आप मिशन बुनियाद प्रवेश परीक्षा स्तर-1 उत्तीर्ण नहीं कर पाए हैं। हम आपको अपने शैक्षणिक प्रयास जारी रखने के लिए प्रोत्साहित करते हैं और आपके भविष्य के प्रयासों में सफलता की कामना करते हैं।)
//       </p>

//       {/* 🔕 DOWNLOAD LINKS INTENTIONALLY HIDDEN FOR FAILED STUDENTS */}
//     </Card.Body>

//     <Card.Footer className="bg-white text-center border-0 py-2">
//       <div style={{ fontSize: 12, color: "#666" }}>
//         <small>
//           Result Session 2026-28
//         </small>
//       </div>
//     </Card.Footer>
//   </Card>
// </Container>

//             )}
//             </>
            
//         );
//     };

//     // else render single UI (singleStudent prop if provided, otherwise studentData from context)
//     return renderAdmitCardUI(singleStudent || studentData);
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


// import { useNavigate } from "react-router-dom";
// import { rgb } from "pdf-lib";


// const logo = "/haryana.png";
// const logo2 = "/admitBuniyaLogo.png";
// const level1admitinstructions = "/s100admitinstructionsLevel2Using.png";

// const certificate = "/L1HSQualificationCertificateblank.png"

// const arrayBufferToBase64 = (buffer) => {
//     let binary = "";
//     const bytes = new Uint8Array(buffer);
//     for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
//     return btoa(binary);
// };

// export const ResultSuper100L1 = ({ singleStudent = null, bulkDownload = null, onDone = () => { } }) => {
//     // contexts
//     const { studentData } = useContext(StudentContext);
//     const { userData } = useContext(UserContext);
//     const { bulkDownload: contextBulkDownload, setBulkDownload } = useContext(BulkDownloadContext);

//     // local state
//     const [busy, setBusy] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [error, setError] = useState(null);


//     const navigate = useNavigate();

//     // Decide what students to process:
//     // Priority: bulkDownload prop > contextBulkDownload > singleStudent > studentData
//     const studentsToProcess = bulkDownload || contextBulkDownload;

//     // Format date helper
//     const formatDateToDDMMYYYY = (dateStr) => {
//         if (!dateStr) return "-";
//         const d = new Date(dateStr);
//         const day = String(d.getDate()).padStart(2, "0");
//         const month = String(d.getMonth() + 1).padStart(2, "0");
//         const year = d.getFullYear();
//         return `${day}-${month}-${year}`;
//     };

//     // Build single PDF blob (used by both single and bulk)
//     const buildPdfBlob = async (student) => {
//         // try load Devanagari font (optional)
//         try {
//             const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
//             const fResp = await fetch(fontUrl);
//             if (fResp.ok) {
//                 const buf = await fResp.arrayBuffer();
//                 const base64 = arrayBufferToBase64(buf);
//                 if (jsPDF.API && jsPDF.API.addFileToVFS) {
//                     jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64);
//                     jsPDF.API.addFont("NotoSansDevanagari-Regular.ttf", "NotoDeva", "normal");
//                 }
//             }
//         } catch (e) {
//             // font optional — continue
//             console.warn("Devanagari font load failed:", e);
//         }

//         const doc = new jsPDF();
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(10); // Reduced from 11 to make table smaller

//         // border
//         doc.rect(5, 5, 200, 285);

//         // logos - best effort
//         try { doc.addImage(logo, "PNG", 10, 8, 20, 20); } catch (e) { }
//         try { doc.addImage(logo2, "PNG", 180, 8, 20, 20); } catch (e) { }

//         const pageWidth = doc.internal.pageSize.getWidth();

//         doc.setFontSize(11); // Reduced from 12
//         doc.text("Directorate of School Education (DSE) Shiksha Sadan, Haryana", pageWidth / 2, 10, { align: "center" });
//         doc.setFontSize(12); // Reduced from 13
//         const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";
//         doc.text(`${examLevel} Level 2 Exam (2026-28)`, pageWidth / 2, 15, { align: "center" });
//         doc.setFontSize(11); // Reduced from 12
//         doc.text("E – Admit Card", pageWidth / 2, 22, { align: "center" });

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(9); // Reduced from 10
//         doc.text("Examination Date: 30th January, Friday", pageWidth / 2, 27, { align: "center" });

//         doc.setFontSize(9); // Reduced from 10
//         doc.text("Reporting Time: 12:30 PM, Exam Time: 01:30 PM to 2:45 PM", pageWidth / 2, 32, { align: "center" });

//         // Helper function to wrap text
//         const wrapText = (text, maxWidth) => {
//             if (!text) return [""];
//             const words = text.split(' ');
//             const lines = [];
//             let currentLine = '';
            
//             for (let word of words) {
//                 const testLine = currentLine ? `${currentLine} ${word}` : word;
//                 const testWidth = doc.getStringUnitWidth(testLine) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                
//                 if (testWidth > maxWidth) {
//                     if (currentLine) lines.push(currentLine);
//                     currentLine = word;
//                 } else {
//                     currentLine = testLine;
//                 }
//             }
//             if (currentLine) lines.push(currentLine);
//             return lines;
//         };

//         const dataForPdf = [
//             ["Student Name", student.name ?? "-"],
//             ["Father Name", student.father ?? "-"],
//             ["Date of Birth", student.dob ? formatDateToDDMMYYYY(student.dob) : "-"],
//             ["Category", student.category ?? "-"],
//             ["SRN Number", student.srn ?? "-"],
//             ["Exam Roll Number", student.rollNumber ?? "-"],
//             ["Aadhar Number", student.aadhar ?? "-"],
//             ["Mobile Number", student.mobile ?? "-"],
//             ["District", (student.L2ExaminationDistrict)],
//             ["Block", (student.L2ExaminationBlock)],
//             ["School", student.school ?? "-"], // Added school field
//             ["Examination Center", student.L2ExaminationCenter ?? "-"]
//         ];

//         // Calculate available space for table
//         const startY = 40;
//         const maxTableHeight = 85; // Reduced to leave more space for instructions
        
//         doc.autoTable({
//             startY: startY,
//             body: dataForPdf,
//             theme: "grid",
//             styles: { 
//                 lineWidth: 0.1, // Thinner lines
//                 lineColor: [0, 0, 0], 
//                 fillColor: false, 
//                 textColor: [0, 0, 0], 
//                 fontSize: 8, // Reduced font size from 10 to 8
//                 cellPadding: 2, // Reduced padding
//                 overflow: 'linebreak' // Enable text wrapping
//             },
//             columnStyles: { 
//                 0: { cellWidth: 35 }, // Reduced from 50
//                 1: { cellWidth: 85, cellPadding: 2, overflow: 'linebreak' } // Reduced from 80, added wrapping
//             },
//             tableWidth: "auto",
//             margin: { left: 10, right: 10 }
//         });

//         // Get the final Y position after table
//         const finalY = doc.lastAutoTable.finalY + 5;

//         // photo area (adjusted position)
//         if (student.imageUrl) {
//             try {
//                 doc.addImage(student.imageUrl, "PNG", 150, 40, 50, 50);
//             } catch (e) {
//                 doc.rect(150, 40, 50, 50);
//                 doc.setFontSize(7);
//                 doc.text("Paste your passport-size", 155, 60);
//                 doc.text("photograph duly attested", 155, 65);
//                 doc.text("by the school principal.", 155, 70);
//             }
//         } else {
//             doc.rect(150, 40, 50, 50);
//             doc.setFontSize(7);
//             doc.text("Paste your passport-size", 155, 60);
//             doc.text("photograph duly attested", 155, 65);
//             doc.text("by the school principal.", 155, 70);
//         }

//         // dividing line and instructions
//         doc.setLineWidth(0.5);
//         doc.line(10, finalY, pageWidth - 10, finalY);
        
//         try {
//             // Adjust instruction image position and size based on available space
//             const instructionsY = finalY + 2;
//             const availableHeight = 280 - instructionsY;
//             const imageHeight = Math.min(availableHeight, 145); // Reduced from 152
//             doc.addImage(level1admitinstructions, "PNG", 15, instructionsY, 180, imageHeight);
//         } catch (e) {
//             doc.setFontSize(7); // Smaller font for instructions
//             const instructionsY = finalY + 5;
//             doc.text("General Instructions:", 15, instructionsY);
//             doc.text("1. Reach examination center 30 minutes before the scheduled time.", 15, instructionsY + 5, { maxWidth: pageWidth - 30 });
//             doc.text("2. Carry this admit card along with valid ID proof (Aadhar Card).", 15, instructionsY + 10, { maxWidth: pageWidth - 30 });
//             doc.text("3. Do not carry mobile phones, calculators, or any electronic devices.", 15, instructionsY + 15, { maxWidth: pageWidth - 30 });
//             doc.text("4. Use black/blue ballpoint pen only.", 15, instructionsY + 20, { maxWidth: pageWidth - 30 });
//             doc.text("5. No candidate will be allowed after the reporting time.", 15, instructionsY + 25, { maxWidth: pageWidth - 30 });
//         }

//         return doc.output("blob");
//     };

//     // Download single PDF directly
//     const downloadSinglePdf = async (student) => {
//         setError(null);
//         setBusy(true);
//         setShowModal(true);
//         try {
//             const blob = await buildPdfBlob(student);
//             const safeName = (student.srn || student.name || "admit").toString().replace(/\s+/g, "_");
//             saveAs(blob, `${safeName}_admit_card.pdf`);

//             // notify backend (best-effort)
//             try {
//                 await IsAdmitCardDownloaded({
//                     _id: student._id,
//                     admitCardDownloadStatus: { isL2AdmitCardDownloaded: true }
//                 });
//             } catch (e) {
//                 console.warn("Notify failed:", e);
//             }
//         } catch (err) {
//             console.error("Single PDF generation error:", err);
//             setError("Error generating PDF. Check console.");
//         } finally {
//             setBusy(false);
//         }
//     };

//     // Bulk runner: create PDFs for all students in array -> zip -> download
//     const runBulk = async (studentsArr) => {
//         setError(null);
//         setBusy(true);
//         setShowModal(true);
//         try {
//             // If only one student, download as single PDF directly
//             if (studentsArr.length === 1) {
//                 await downloadSinglePdf(studentsArr[0]);
//                 return;
//             }

//             // Multiple students - create ZIP
//             const zip = new JSZip();
//             for (let i = 0; i < studentsArr.length; i++) {
//                 const st = studentsArr[i];
//                 try {
//                     const b = await buildPdfBlob(st);
//                     const safeName = (st.srn || st.name || `admit_${i}`).toString().replace(/\s+/g, "_");
//                     zip.file(`${safeName}_admit_card.pdf`, b);
//                 } catch (perErr) {
//                     console.warn(`Failed to create PDF for ${st._id || st.srn || st.name}`, perErr);
//                 }
//             }
//             const content = await zip.generateAsync({ type: "blob" });
//             saveAs(content, `admit_cards_${Date.now()}.zip`);

//             // notify backend for each student (best-effort)
//             for (const st of studentsArr) {
//                 try {
//                     await IsAdmitCardDownloaded({
//                         _id: st._id,
//                         admitCardDownloadStatus: { isL2AdmitCardDownloaded: true }
//                     });
//                 } catch (e) {
//                     console.warn("Notify failed for", st._id, e);
//                 }
//             }
//         } catch (err) {
//             console.error("Bulk error:", err);
//             setError("Error generating PDFs. Check console.");
//         } finally {
//             setBusy(false);
//             // clear bulk context after done
//             setBulkDownload(null);
//             onDone();
//         }
//     };

//     // Auto-run bulk if bulkDownload present and this component is mounted
//     useEffect(() => {
//         if (Array.isArray(studentsToProcess) && studentsToProcess.length > 0) {
//             // run in next tick
//             (async () => {
//                 await runBulk(studentsToProcess);
//             })();
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [studentsToProcess]);

//     // If we have bulk download data, don't show any UI - just process in background
//     if (Array.isArray(studentsToProcess) && studentsToProcess.length > 0) {
//         return (
//             <Modal show={showModal} onHide={() => { }} centered backdrop="static">
//                 <Modal.Header>
//                     <Modal.Title>
//                         {studentsToProcess.length === 1 ? "Downloading Admit Card" : "Downloading Admit Cards"}
//                     </Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className="text-center">
//                     {busy ? (
//                         <>
//                             <Spinner animation="border" variant="primary" />
//                             <div className="mt-2">
//                                 {studentsToProcess.length === 1
//                                     ? "Preparing admit card..."
//                                     : `Preparing ${studentsToProcess.length} admit cards...`}
//                             </div>
//                         </>
//                     ) : error ? (
//                         <div className="text-danger">{error}</div>
//                     ) : (
//                         <div>
//                             {studentsToProcess.length === 1
//                                 ? "Admit card downloaded successfully!"
//                                 : "Admit cards downloaded successfully!"}
//                         </div>
//                     )}
//                 </Modal.Body>
//             </Modal>
//         );
//     }

//     // Original UI for single student mode (only shown when no bulk download)
//     const renderAdmitCardUI = (student) => {
//         if (!student || Object.keys(student).length === 0) {
//             return (
//                 <Modal show centered onHide={() => { }}>
//                     <Modal.Header closeButton>
//                         <Modal.Title>Registration Required</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <p>Please register first to generate your acknowledgment slip.</p>
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button variant="primary" onClick={onDone}>
//                             Close
//                         </Button>
//                     </Modal.Footer>
//                 </Modal>
//             );
//         }

//         const formattedDate = student.dob ? formatDateToDDMMYYYY(student.dob) : formatDateToDDMMYYYY(new Date());
//         const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";

//         const data = [
//             { field: "Student Name", value: student.name || "-" },
//             { field: "Father's Name", value: student.father || "-" },
//             { field: "Date of Birth", value: formattedDate || "-" },
//             { field: "Category", value: student.category || "-" },
//             { field: "SRN Number", value: student.srn || "-" },
//             { field: "Exam Roll Number", value: student.rollNumber || "-" },
//             { field: "Aadhar Number", value: student.aadhar || "-" },
//             { field: "Mobile Number", value: student.mobile || "-" },
//             { field: "District", value: (student.schoolDistrict ? student.schoolDistrict : "-") + (student.schoolDistrictCode ? " (" + student.schoolDistrictCode + ")" : "") },
//             { field: "Block", value: (student.schoolBlock ? student.schoolBlock : "-") + (student.schoolBlockCode ? " (" + student.schoolBlockCode + ")" : "") },
//             { field: "Examination Center", value: student.L1ExaminationCenter || "-" },
//         ];

//         // NEW: Show only the basic details table and a download blinking hyperlink/button below it.
//         // Kept everything else (functions, imports, comments) unchanged as requested.
//         const cardStyle = { borderRadius: "12px", padding: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" };
//         const smallText = { fontSize: "14px", marginBottom: 4, color: "#333" };
//         const smallField = { fontSize: "14px", fontWeight: 600, color: "#222" };

//         //certificate



//         const downloadCertificate = async (student) => {
//             try {
//                 const doc = new jsPDF("landscape", "mm", "a4");

//                 // Template
//                 const templatePath = "/L1HSQualificationCertificateblank.png";
//                 const response = await fetch(templatePath);
//                 const blob = await response.blob();

//                 const imgBase64 = await new Promise((resolve) => {
//                     const reader = new FileReader();
//                     reader.onload = () => resolve(reader.result);
//                     reader.readAsDataURL(blob);
//                 });

//                 doc.addImage(imgBase64, "PNG", 0, 0, 297, 210);

//                 // Safe values
//                 const name = student?.name || "";
//                 const father = student?.father || "";
//                 const district = student?.L1ExaminationDistrict || "";
//                 const block = student?.L1ExaminationBlock || "";
//                 const school = student?.school || "";
//                 const stateRank = student?.stateRank || "";
//                 const districtRank = student?.districtRankL1 || "";
//                 const blockRank = student?.blockRankL1 || "";

//                 const startX = 35;
//                 let y = 100;

//                 doc.setFont("times", "normal");
//                 doc.setFontSize(16);

//                 // ---------- LINE 1 ----------
//                 doc.text("This is to certify that", startX, y);

//                 doc.setFont("times", "bold");
//                 doc.text(name, startX + 49, y);
//                 let nameWidth = doc.getTextWidth(name);
//                 doc.line(startX + 49, y + 1.5, startX + 90 + nameWidth, y + 1.5);

//                 doc.setFont("times", "normal");
//                 doc.text(", Son/Daughter of Shri", startX + 90 + nameWidth, y);

//                 doc.setFont("times", "bold");
//                 doc.text(father, startX + 143 + nameWidth, y);
//                 let fatherWidth = doc.getTextWidth(father);
//                 doc.line(
//                     startX + 143 + nameWidth,
//                     y + 1.5,
//                     startX + 193 + nameWidth + fatherWidth,
//                     y + 1.5
//                 );


                

//                 // ---------- LINE 2 ----------
//                 // y += 12;
//                 // doc.setFont("times", "normal");
//                 // doc.text("from", startX, y);

//                 // doc.setFont("times", "bold");
//                 // const placeText = `${district}${district && block ? ", " : ""}${block}`;
//                 // doc.text(placeText, startX + 25, y);
//                 // let placeWidth = doc.getTextWidth(placeText);
//                 // doc.line(startX + 25, y + 1.5, startX + 25 + placeWidth, y + 1.5);



//                 y += 12;
//                 doc.setFont("times", "normal");
//                 doc.text("from district", startX, y);

//                 let xCursor = startX + 13;

//                 // District
//                 doc.setFont("times", "bold");
//                 doc.text(`${district.replace(/\s*-\s*\(.*?\)\s*$/, "") || ""}`, xCursor + 17, y);
//                 let districtWidth = doc.getTextWidth(district);
//                 doc.line(xCursor + 16, y + 1.5, xCursor + 32 + districtWidth, y + 1.5);
//                 doc.setFont("times", "normal");
//                 doc.text(",", xCursor + 52, y);

//                 doc.setFont("times", "normal");
//                 doc.text("block", xCursor + 54, y);


//                 xCursor += districtWidth;

//                 // // Comma between
//                 // if (district && block) {
//                 //   doc.setFont("times", "normal");
//                 //   doc.text(", ", xCursor, y);
//                 //   xCursor += doc.getTextWidth(", ");
//                 // }

//                 // Block
//                 doc.setFont("times", "bold");
//                 doc.text(`${block.replace(/\s*-\s*\(.*?\)\s*$/, "") || ""
//                     }`, xCursor + 50, y);
//                 let blockWidth = doc.getTextWidth(block);
//                 doc.line(xCursor + 50, y + 1.5, xCursor + 100, y + 1.5);






//                 // ---------- LINE 3 (School – dynamic font) ----------
//              y += 12;
//                 doc.setFont("times", "normal");
//                 doc.text("school", startX, y);

//                 let schoolFontSize = 14;
//                 doc.setFont("times", "bold");
//                 doc.setFontSize(schoolFontSize);

//                 while (doc.getTextWidth(school) > 200 && schoolFontSize > 13) {
//                     schoolFontSize--;
//                     doc.setFontSize(schoolFontSize);
//                 }

//                 doc.text(`${school}`, startX + 27, y);
//                 let schoolWidth = doc.getTextWidth(school);
//                 doc.line(startX + 20, y + 1.5, startX + 55 + schoolWidth, y + 1.5);


//                 // ---------- LINE 4 ----------
//                 y += 14;
//                 doc.setFontSize(16);
//                 doc.setFont("times", "normal");
//                 doc.text("has qualified the", startX, y);

//                 doc.setFont("times", "bold");
//                 doc.text(
//                     "Haryana Super 100 Entrance Examination Level 1 for the batch 2026–28.",
//                     startX + 39,
//                     y,
//                     { maxWidth: 220 }
//                 );

//                 // ---------- RANKS ----------
//                 y += 18;
//                 doc.setFont("times", "normal");
//                 doc.setFontSize(14);

//                 // doc.text(`State Rank : ${stateRank}`, startX, y);
//                 // doc.text(`District Rank : ${districtRank}`, startX, y + 10);
//                 // doc.text(`Block Rank : ${blockRank}`, startX, y + 20);

//                 // Save
//                 doc.save(`${name || "Student"}_HS100_Level1_Qualification_Certificate.pdf`);



//                   // notify backend (best-effort)
//             try {
//                 await IsAdmitCardDownloaded({
//                     _id: student._id,
//                     admitCardDownloadStatus: { L1ResultDownloaded: true }
//                 });
//             } catch (e) {
//                 console.warn("Notify failed:", e);
//             }
//             } catch (err) {
//                 console.error("Certificate error:", err);
//                 alert("Certificate download failed");
//             }
//         };



//         const resultChecked = async () =>{
           

//              try {
//                 await IsAdmitCardDownloaded({
//                     _id: student._id,
//                     admitCardDownloadStatus: { L1ResultDownloaded: true }
//                 });
//             } catch (e) {
//                 console.warn("Notify failed:", e);
//             }
//         }

//            resultChecked()

//         return (
//             <>
            
//             {student.L1Qualified === true ? (
//                 <Container className="py-3">
//                 {/* Top blinking download CTA */}


//                 <Card className="shadow-sm" style={cardStyle}>
//                     <Card.Header className="bg-white text-center border-0 py-2">
//                         <div style={{ textAlign: "center" }}>
//                             <div style={{ fontSize: 35, fontWeight: 700, color: "MediumSeaGreen" }}>Result Status - Selected
//                           </div>
//                         </div>
//                     </Card.Header>
//                     <hr></hr>
//                     <Card.Body style={{ padding: "14px" }}>


//                         <p
//                             style={{
//                                 color: "#000000ff",
//                                 fontWeight: "bold",


//                             }}
//                         >
//                             Dear {student.name},
//                             <br /><br />
//                             We are pleased to inform you that you have successfully Qualified the {" "}
//                             <strong>Haryana Super 100 Entrance Examination Level 1 for the 2026–28 batch.</strong>.
//                             <br /><br />
                        
//                             <strong>You may now download your Haryana Super 100 Entrance Examination Level 1 Qualifying Certificate using the link provided below.</strong>
                            
//                             <br /><br />
//                             <span style={{ fontWeight: "normal" }}>
//                                 (प्प्रिय {student.name}, हमें आपको यह सूचित करते हुए अत्यंत प्रसन्नता हो रही है कि आपने सत्र 2026–28 के लिए हरियाणा सुपर 100 प्रवेश परीक्षा लेवल 1 सफलतापूर्वक उत्तीर्ण कर ली है। आप नीचे दिए गए लिंक के माध्यम से हरियाणा सुपर 100 परीक्षा लेवल 1 का उत्तीर्णता प्रमाण पत्र डाउनलोड कर सकते हैं।)
//                             </span>
//                         </p>

//                     <hr></hr>
// <p>
//      <br /><br />
//                             <span style={{ fontWeight: "normal" , fontWeight:"bold", color:'red', fontSize:'150%'}}>
//                                 Note: Students are informed that their admit cards will be available for download soon. They will be notified once the admit cards are released.

// (छात्रों को सूचित किया जाता है कि उनके एडमिट कार्ड जल्द ही डाउनलोड के लिए उपलब्ध होंगे। एडमिट कार्ड जारी होने पर उन्हें सूचित कर दिया जाएगा।)
//                             </span>
// </p>

//                         <hr></hr>

//                         <br></br>
//                         <div className="d-flex align-items-center justify-content-center mb-3">
//                             <div style={{ textAlign: "center" }}>
//                                 <a
//                                     onClick={() => downloadSinglePdf(student)}
//                                     style={{ cursor: "pointer", fontWeight: "bold", fontSize: "22px", animation: "blink 1s infinite", alignItems: "center" }}
//                                     className="blinking-link"
//                                 >
//                                     Download Haryana Super 100 Level-2 Admit Card. <br />
//                                     (अपना लेवल-2 प्रवेश पत्र डाउनलोड करें)
//                                 </a>
//                                 <style>{`@keyframes blink { 0% { color: #d33; } 50% { color: #0b5fff; } 100% { color: #d33; } } .blinking-link { text-decoration: underline; }`}</style>
//                             </div>
//                         </div>



//                         <div className="d-flex align-items-center justify-content-center mb-3">
//                             <div style={{ textAlign: "center" }}>
//                                 <a
//                                     onClick={() => downloadCertificate(student)}
//                                     style={{ cursor: "pointer", fontWeight: "bold", fontSize: "22px", animation: "blink 1s infinite", alignItems: "center" }}
//                                     className="blinking-link"
//                                 >
//                                     Download Haryana Super 100 Level-1 Qualification Certificate. <br />
//                                     (हरियाणा सुपर 100 लेवल-1 प्रमाण पत्र डाउनलोड करें)
//                                 </a>
//                                 <style>{`@keyframes blink { 0% { color: #d33; } 50% { color: #0b5fff; } 100% { color: #d33; } } .blinking-link { text-decoration: underline; }`}</style>
//                             </div>
//                         </div>



//                         {/* <Button
//                   variant="success"
//                   className="m-2"
//                   onClick={() => downloadCertificate(student)}
//                 >
//                   Download Level-1 Qualification Certificate
//                 </Button> */}
//                     </Card.Body>

//                     <Card.Footer className="bg-white text-center border-0 py-2">
//                         <div style={{ fontSize: 12, color: "#666" }}>
//                             <small>Keep this admit card safe. Carry required documents to exam centre.</small>
//                         </div>
//                     </Card.Footer>
//                 </Card>

//                 <Modal show={showModal} onHide={() => { if (!busy) setShowModal(false); }} centered>
//                     <Modal.Header closeButton>
//                         <Modal.Title>{busy ? "Generating PDF..." : error ? "Error" : "Admit Card Status!"}</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         {busy ? <div className="text-center"><Spinner animation="border" /> <div className="mt-2">Preparing PDF — please wait.</div></div> : (error ? <div className="text-danger">{error}</div> : <div>Congratulations! You have successfully downloaded your admit card. (बधाई हो! आपने अपना प्रवेश पत्र सफलतापूर्वक डाउनलोड कर लिया है।)</div>)}
//                     </Modal.Body>
//                     <Modal.Footer>
//                         {/* <Button variant="secondary" onClick={() => setShowModal(false)} disabled={busy}>Close</Button>
//              */}



//                         <Button

//                             variant="secondary"
//                             onClick={() => navigate("/")}
//                             disabled={busy}
//                         >
//                             Close
//                         </Button>


//                     </Modal.Footer>
//                 </Modal>
//             </Container>


//             ):
//             (
//                 <Container className="py-3">
//   <Card className="shadow-sm" style={cardStyle}>
//     <Card.Header className="bg-white text-center border-0 py-2">
//       <div style={{ textAlign: "center" }}>
//         <div style={{ fontSize: 35, fontWeight: 700, color: "#555" }}>
//           NOT QUALIFIED!
//         </div>
//       </div>
//     </Card.Header>

//     <hr />

//     <Card.Body style={{ padding: "14px" }}>
//       <p
//         style={{
//           color: "#444",
//           fontWeight: "bold",
//           lineHeight: "1.7",
//         }}
//       >
//         Dear {student.name},
//         <br /><br />
//         You have Not Qualified for the Mission Buniyaad Entrance Examination Level-1. We encourage you to continue your academic efforts and wish you success in your future endeavors.
//         <br></br>
//         (आप मिशन बुनियाद प्रवेश परीक्षा स्तर-1 उत्तीर्ण नहीं कर पाए हैं। हम आपको अपने शैक्षणिक प्रयास जारी रखने के लिए प्रोत्साहित करते हैं और आपके भविष्य के प्रयासों में सफलता की कामना करते हैं।)
//       </p>

//       {/* 🔕 DOWNLOAD LINKS INTENTIONALLY HIDDEN FOR FAILED STUDENTS */}
//     </Card.Body>

//     <Card.Footer className="bg-white text-center border-0 py-2">
//       <div style={{ fontSize: 12, color: "#666" }}>
//         <small>
//           Result Session 2026-28
//         </small>
//       </div>
//     </Card.Footer>
//   </Card>
// </Container>

//             )}
//             </>
            
//         );
//     };

//     // else render single UI (singleStudent prop if otherwise, studentData from context)
//     return renderAdmitCardUI(singleStudent || studentData);
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


import { useNavigate } from "react-router-dom";
import { rgb } from "pdf-lib";


const logo = "/haryana.png";
const logo2 = "/vikalpalogonotitle.png";
const level1admitinstructions = "/s100admitinstructionsLevel2Using.png";

const certificate = "/L1HSQualificationCertificateblank.png"

const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
};

export const ResultSuper100L1 = ({ singleStudent = null, bulkDownload = null, onDone = () => { } }) => {
    // contexts
    const { studentData } = useContext(StudentContext);
    const { userData } = useContext(UserContext);
    const { bulkDownload: contextBulkDownload, setBulkDownload } = useContext(BulkDownloadContext);

    // local state
    const [busy, setBusy] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);


    const navigate = useNavigate();

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
        doc.setFontSize(9); // Further reduced from 10

        // border
        doc.rect(5, 5, 200, 285);

        // logos - best effort
        try { 
            doc.addImage(logo, "PNG", 10, 8, 18, 18); 
        } catch (e) { }
        try { 
            doc.addImage(logo2, "PNG", 182, 8, 18, 18); 
        } catch (e) { }

        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(10); // Reduced from 11
        doc.text("Directorate of School Education (DSE) Shiksha Sadan, Haryana", pageWidth / 2, 10, { align: "center" });
        doc.setFontSize(11); // Reduced from 12
        const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";
        doc.text(`${examLevel} Level 2 Exam (2026-28)`, pageWidth / 2, 15, { align: "center" });
        doc.setFontSize(10); // Reduced from 11
        doc.text("E – Admit Card", pageWidth / 2, 21, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8); // Reduced from 9
        // doc.text("Examination Date: 30th January, Friday", pageWidth / 2, 26, { align: "center" });

        doc.setFontSize(8); // Reduced from 9
        doc.text(`Reporting Date: ${student.L2ExaminationDate}, Reporting Time: 09:00 AM.`, pageWidth / 2, 26, { align: "center" });

        const dataForPdf = [
            ["Student Name", student.name ?? "-"],
            ["Father Name", student.father ?? "-"],
            ["Date of Birth", student.dob ? formatDateToDDMMYYYY(student.dob) : "-"],
            ["Category", student.category ?? "-"],
            ["SRN Number", student.srn ?? "-"],
            ["Exam Roll Number", student.rollNumber ?? "-"],
            ["Aadhar Number", student.aadhar ?? "-"],
            ["Mobile Number", student.mobile ?? "-"],
            ["District", (student.L2ExaminationDistrict)],
            ["Block", (student.L2ExaminationBlock)],
            ["School", student.school ?? "-"],
            ["Examination Center", student.L2ExaminationCenter ?? "-"],
            ["Batch", student.batchDivisionForL2Examination ?? "-"] // Added new field
        ];

        // Calculate available space for table - made even smaller
        const startY = 32;
        const maxTableHeight = 70; // Reduced from 85 to leave more space
        
        doc.autoTable({
            startY: startY,
            body: dataForPdf,
            theme: "grid",
            styles: { 
                lineWidth: 0.1,
                lineColor: [0, 0, 0], 
                fillColor: false, 
                textColor: [0, 0, 0], 
                fontSize: 7, // Reduced from 8 to 7
                cellPadding: 1.5, // Reduced from 2 to 1.5
                overflow: 'linebreak'
            },
            columnStyles: { 
                0: { cellWidth: 32 }, // Reduced from 35
                1: { cellWidth: 100, cellPadding: 1.5, overflow: 'linebreak' } // Reduced from 85
            },
            tableWidth: "auto",
            margin: { left: 10, right: 10 }
        });

        // Get the final Y position after table
        const finalY = doc.lastAutoTable.finalY + 3;

        // photo area (adjusted position and size)
        if (student.imageUrl) {
            try {
                doc.addImage(student.imageUrl, "PNG", 152, 35, 45, 45); // Slightly smaller and repositioned
            } catch (e) {
                doc.rect(152, 35, 45, 45);
                doc.setFontSize(6); // Smaller font
                doc.text("Paste your", 158, 50);
                doc.text("passport-size", 158, 55);
                doc.text("photograph", 158, 60);
                doc.text("duly attested", 158, 65);
            }
        } else {
            doc.rect(152, 35, 45, 45);
            doc.setFontSize(6);
            doc.text("Paste your", 158, 50);
            doc.text("passport-size", 158, 55);
            doc.text("photograph", 158, 60);
            doc.text("duly attested", 158, 65);
        }

        // dividing line and instructions
        doc.setLineWidth(0.5);
        doc.line(10, finalY, pageWidth - 10, finalY);
        
        try {
            // Adjust instruction image position and size based on available space
            const instructionsY = finalY + 2;
            const availableHeight = 285 - instructionsY ; // Leave bottom margin
            const imageHeight = Math.min(availableHeight, 165); // Reduced from 145
            doc.addImage(level1admitinstructions, "PNG", 15, instructionsY, 168, imageHeight);
        } catch (e) {
            doc.setFontSize(6.5); // Even smaller font for instructions
            const instructionsY = finalY + 5;
            doc.text("General Instructions:", 15, instructionsY);
            doc.text("1. Reach examination center 30 minutes before the scheduled time.", 15, instructionsY + 4, { maxWidth: pageWidth - 30 });
            doc.text("2. Carry this admit card along with valid ID proof (Aadhar Card).", 15, instructionsY + 8, { maxWidth: pageWidth - 30 });
            doc.text("3. Do not carry mobile phones, calculators, or any electronic devices.", 15, instructionsY + 12, { maxWidth: pageWidth - 30 });
            doc.text("4. Use black/blue ballpoint pen only.", 15, instructionsY + 16, { maxWidth: pageWidth - 30 });
            doc.text("5. No candidate will be allowed after the reporting time.", 15, instructionsY + 20, { maxWidth: pageWidth - 30 });
            doc.text("6. Carry your own stationery items.", 15, instructionsY + 24, { maxWidth: pageWidth - 30 });
            doc.text("7. Follow all COVID-19 protocols if applicable.", 15, instructionsY + 28, { maxWidth: pageWidth - 30 });
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
                    admitCardDownloadStatus: { isL2AdmitCardDownloaded: true }
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
                        admitCardDownloadStatus: { isL2AdmitCardDownloaded: true }
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
            <Modal show={showModal} onHide={() => { }} centered backdrop="static">
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
                <Modal show centered onHide={() => { }}>
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

        // NEW: Show only the basic details table and a download blinking hyperlink/button below it.
        // Kept everything else (functions, imports, comments) unchanged as requested.
        const cardStyle = { borderRadius: "12px", padding: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" };
        const smallText = { fontSize: "14px", marginBottom: 4, color: "#333" };
        const smallField = { fontSize: "14px", fontWeight: 600, color: "#222" };

        //certificate



        const downloadCertificate = async (student) => {
            try {
                const doc = new jsPDF("landscape", "mm", "a4");

                // Template
                const templatePath = "/L1HSQualificationCertificateblank.png";
                const response = await fetch(templatePath);
                const blob = await response.blob();

                const imgBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });

                doc.addImage(imgBase64, "PNG", 0, 0, 297, 210);

                // Safe values
                const name = student?.name || "";
                const father = student?.father || "";
                const district = student?.L1ExaminationDistrict || "";
                const block = student?.L1ExaminationBlock || "";
                const school = student?.school || "";
                const stateRank = student?.stateRank || "";
                const districtRank = student?.districtRankL1 || "";
                const blockRank = student?.blockRankL1 || "";

                const startX = 35;
                let y = 100;

                doc.setFont("times", "normal");
                doc.setFontSize(16);

                // ---------- LINE 1 ----------
                doc.text("This is to certify that", startX, y);

                doc.setFont("times", "bold");
                doc.text(name, startX + 49, y);
                let nameWidth = doc.getTextWidth(name);
                doc.line(startX + 49, y + 1.5, startX + 90 + nameWidth, y + 1.5);

                doc.setFont("times", "normal");
                doc.text(", Son/Daughter of Shri", startX + 90 + nameWidth, y);

                doc.setFont("times", "bold");
                doc.text(father, startX + 143 + nameWidth, y);
                let fatherWidth = doc.getTextWidth(father);
                doc.line(
                    startX + 143 + nameWidth,
                    y + 1.5,
                    startX + 193 + nameWidth + fatherWidth,
                    y + 1.5
                );


                

                // ---------- LINE 2 ----------
                // y += 12;
                // doc.setFont("times", "normal");
                // doc.text("from", startX, y);

                // doc.setFont("times", "bold");
                // const placeText = `${district}${district && block ? ", " : ""}${block}`;
                // doc.text(placeText, startX + 25, y);
                // let placeWidth = doc.getTextWidth(placeText);
                // doc.line(startX + 25, y + 1.5, startX + 25 + placeWidth, y + 1.5);



                y += 12;
                doc.setFont("times", "normal");
                doc.text("from district", startX, y);

                let xCursor = startX + 13;

                // District
                doc.setFont("times", "bold");
                doc.text(`${district.replace(/\s*-\s*\(.*?\)\s*$/, "") || ""}`, xCursor + 17, y);
                let districtWidth = doc.getTextWidth(district);
                doc.line(xCursor + 16, y + 1.5, xCursor + 32 + districtWidth, y + 1.5);
                doc.setFont("times", "normal");
                doc.text(",", xCursor + 52, y);

                doc.setFont("times", "normal");
                doc.text("block", xCursor + 54, y);


                xCursor += districtWidth;

                // // Comma between
                // if (district && block) {
                //   doc.setFont("times", "normal");
                //   doc.text(", ", xCursor, y);
                //   xCursor += doc.getTextWidth(", ");
                // }

                // Block
                doc.setFont("times", "bold");
                doc.text(`${block.replace(/\s*-\s*\(.*?\)\s*$/, "") || ""
                    }`, xCursor + 50, y);
                let blockWidth = doc.getTextWidth(block);
                doc.line(xCursor + 50, y + 1.5, xCursor + 100, y + 1.5);






                // ---------- LINE 3 (School – dynamic font) ----------
             y += 12;
                doc.setFont("times", "normal");
                doc.text("school", startX, y);

                let schoolFontSize = 14;
                doc.setFont("times", "bold");
                doc.setFontSize(schoolFontSize);

                while (doc.getTextWidth(school) > 200 && schoolFontSize > 13) {
                    schoolFontSize--;
                    doc.setFontSize(schoolFontSize);
                }

                doc.text(`${school}`, startX + 27, y);
                let schoolWidth = doc.getTextWidth(school);
                doc.line(startX + 20, y + 1.5, startX + 55 + schoolWidth, y + 1.5);


                // ---------- LINE 4 ----------
                y += 14;
                doc.setFontSize(16);
                doc.setFont("times", "normal");
                doc.text("has qualified the", startX, y);

                doc.setFont("times", "bold");
                doc.text(
                    "Haryana Super 100 Entrance Examination Level 1 for the batch 2026–28.",
                    startX + 39,
                    y,
                    { maxWidth: 220 }
                );

                // ---------- RANKS ----------
                y += 18;
                doc.setFont("times", "normal");
                doc.setFontSize(14);

                // doc.text(`State Rank : ${stateRank}`, startX, y);
                // doc.text(`District Rank : ${districtRank}`, startX, y + 10);
                // doc.text(`Block Rank : ${blockRank}`, startX, y + 20);

                // Save
                doc.save(`${name || "Student"}_HS100_Level1_Qualification_Certificate.pdf`);



                  // notify backend (best-effort)
            try {
                await IsAdmitCardDownloaded({
                    _id: student._id,
                    admitCardDownloadStatus: { L1ResultDownloaded: true }
                });
            } catch (e) {
                console.warn("Notify failed:", e);
            }
            } catch (err) {
                console.error("Certificate error:", err);
                alert("Certificate download failed");
            }
        };



        const resultChecked = async () =>{
           

             try {
                await IsAdmitCardDownloaded({
                    _id: student._id,
                    admitCardDownloadStatus: { L1ResultDownloaded: true }
                });
            } catch (e) {
                console.warn("Notify failed:", e);
            }
        }

           resultChecked()

        return (
            <>
            
            {student.L1Qualified === true ? (
                <Container className="py-3">
                {/* Top blinking download CTA */}


                <Card className="shadow-sm" style={cardStyle}>
                    <Card.Header className="bg-white text-center border-0 py-2">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 35, fontWeight: 700, color: "MediumSeaGreen" }}>Result Status - Selected
                          </div>
                        </div>
                    </Card.Header>
                    <hr></hr>
                    <Card.Body style={{ padding: "14px" }}>


                        <p
                            style={{
                                color: "#000000ff",
                                fontWeight: "bold",


                            }}
                        >
                            Dear {student.name},
                            <br /><br />
                            We are pleased to inform you that you have successfully Qualified the {" "}
                            <strong>Haryana Super 100 Entrance Examination Level 1 for the 2026–28 batch.</strong>.
                            <br /><br />
                        
                            <strong>You may now download your Haryana Super 100 Entrance Examination Level 1 Qualifying Certificate using the link provided below.</strong>
                            
                            <br /><br />
                            <span style={{ fontWeight: "normal" }}>
                                (प्प्रिय {student.name}, हमें आपको यह सूचित करते हुए अत्यंत प्रसन्नता हो रही है कि आपने सत्र 2026–28 के लिए हरियाणा सुपर 100 प्रवेश परीक्षा लेवल 1 सफलतापूर्वक उत्तीर्ण कर ली है। आप नीचे दिए गए लिंक के माध्यम से हरियाणा सुपर 100 परीक्षा लेवल 1 का उत्तीर्णता प्रमाण पत्र डाउनलोड कर सकते हैं।)
                            </span>
                        </p>

                    <hr></hr>
{/* <p>
     <br /><br />
                            <span style={{ fontWeight: "normal" , fontWeight:"bold", color:'red', fontSize:'150%'}}>
                                Note: Students are informed that their admit cards will be available for download soon. They will be notified once the admit cards are released.

(छात्रों को सूचित किया जाता है कि उनके एडमिट कार्ड जल्द ही डाउनलोड के लिए उपलब्ध होंगे। एडमिट कार्ड जारी होने पर उन्हें सूचित कर दिया जाएगा।)
                            </span>
</p> */}

                        <hr></hr>

                        <br></br>
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <div style={{ textAlign: "center" }}>
                                <a
                                    onClick={() => downloadSinglePdf(student)}
                                    style={{ cursor: "pointer", fontWeight: "bold", fontSize: "22px", animation: "blink 1s infinite", alignItems: "center" }}
                                    className="blinking-link"
                                >
                                    Download Haryana Super 100 Level-2 Admit Card. <br />
                                    (अपना लेवल-2 प्रवेश पत्र डाउनलोड करें)
                                </a>
                                <style>{`@keyframes blink { 0% { color: #d33; } 50% { color: #0b5fff; } 100% { color: #d33; } } .blinking-link { text-decoration: underline; }`}</style>
                            </div>
                        </div>



                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <div style={{ textAlign: "center" }}>
                                <a
                                    onClick={() => downloadCertificate(student)}
                                    style={{ cursor: "pointer", fontWeight: "bold", fontSize: "22px", animation: "blink 1s infinite", alignItems: "center" }}
                                    className="blinking-link"
                                >
                                    Download Haryana Super 100 Level-1 Qualification Certificate. <br />
                                    (हरियाणा सुपर 100 लेवल-1 प्रमाण पत्र डाउनलोड करें)
                                </a>
                                <style>{`@keyframes blink { 0% { color: #d33; } 50% { color: #0b5fff; } 100% { color: #d33; } } .blinking-link { text-decoration: underline; }`}</style>
                            </div>
                        </div>



                        {/* <Button
                  variant="success"
                  className="m-2"
                  onClick={() => downloadCertificate(student)}
                >
                  Download Level-1 Qualification Certificate
                </Button> */}
                    </Card.Body>

                    <Card.Footer className="bg-white text-center border-0 py-2">
                        <div style={{ fontSize: 12, color: "#666" }}>
                            <small>Keep this admit card safe. Carry required documents to exam centre.</small>
                        </div>
                    </Card.Footer>
                </Card>

                <Modal show={showModal} onHide={() => { if (!busy) setShowModal(false); }} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{busy ? "Generating PDF..." : error ? "Error" : "Admit Card Status!"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {busy ? <div className="text-center"><Spinner animation="border" /> <div className="mt-2">Preparing PDF — please wait.</div></div> : (error ? <div className="text-danger">{error}</div> : <div>Congratulations! You have successfully downloaded your admit card. (बधाई हो! आपने अपना प्रवेश पत्र सफलतापूर्वक डाउनलोड कर लिया है।)</div>)}
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button variant="secondary" onClick={() => setShowModal(false)} disabled={busy}>Close</Button>
             */}



                        <Button

                            variant="secondary"
                            onClick={() => navigate("/")}
                            disabled={busy}
                        >
                            Close
                        </Button>


                    </Modal.Footer>
                </Modal>
            </Container>


            ):
            (
                <Container className="py-3">
  <Card className="shadow-sm" style={cardStyle}>
    <Card.Header className="bg-white text-center border-0 py-2">
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 35, fontWeight: 700, color: "#555" }}>
          NOT QUALIFIED!
        </div>
      </div>
    </Card.Header>

    <hr />

    <Card.Body style={{ padding: "14px" }}>
      <p
        style={{
          color: "#444",
          fontWeight: "bold",
          lineHeight: "1.7",
        }}
      >
        Dear {student.name},
        <br /><br />
        You have Not Qualified for the Mission Buniyaad Entrance Examination Level-1. We encourage you to continue your academic efforts and wish you success in your future endeavors.
        <br></br>
        (आप मिशन बुनियाद प्रवेश परीक्षा स्तर-1 उत्तीर्ण नहीं कर पाए हैं। हम आपको अपने शैक्षणिक प्रयास जारी रखने के लिए प्रोत्साहित करते हैं और आपके भविष्य के प्रयासों में सफलता की कामना करते हैं।)
      </p>

      {/* 🔕 DOWNLOAD LINKS INTENTIONALLY HIDDEN FOR FAILED STUDENTS */}
    </Card.Body>

    <Card.Footer className="bg-white text-center border-0 py-2">
      <div style={{ fontSize: 12, color: "#666" }}>
        <small>
          Result Session 2026-28
        </small>
      </div>
    </Card.Footer>
  </Card>
</Container>

            )}
            </>
            
        );
    };

    // else render single UI (singleStudent prop if otherwise, studentData from context)
    return renderAdmitCardUI(singleStudent || studentData);
};