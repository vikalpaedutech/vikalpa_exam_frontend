
// import React, {useState, useEffect, useContext} from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import { Container, Row, Col, Card, Button, ListGroup, Badge, Table, Form } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { GetStudentsRegisteredByUserCount, GetStudentsRegisteredByUser } from "../../services/DashBoardServices/DashboardService";

// export const RegisteredStudentsByUsers = () =>{
//   const { userData, setUserData } = useContext(UserContext); // ✅ use context
//   const navigate = useNavigate();
//     const location = useLocation();
//   let studentClass;

//   if (location.pathname === "/user-registered-students-mb"){
//     studentClass = "8"
//   } else  if (location.pathname === "/user-registered-students-sh"){
//     studentClass = "10"
//   }


//   // Small helpers / placeholders — you can replace with real data later
//   const [search, setSearch] = useState("");
//   const recentRegs = userData?.recentRegistrations || []; // optional array if you populate it

  




//   //fetching students data

//   const fetchRegisteredStudentsData = async () =>{

//     const reqBody = {
//         _id: userData?.user?._id,
//         classOfStudent:studentClass
//     }

//     try {
//         const response = await GetStudentsRegisteredByUser(reqBody);
//         console.log(response.data)
//     } catch (error) {
//         console.log("Error fetching data", error)
//     }
//   }

//   useEffect(()=>{
//     fetchRegisteredStudentsData()
//   }, [])

//     return(
//     <Container fluid >
     
// <h1>Registered Students Data</h1>
//     </Container>
//   )
// }














// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   ListGroup,
//   Badge,
//   Table,
//   Form,
//   InputGroup,
//   Spinner,
// } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { GetStudentsRegisteredByUser } from "../../services/DashBoardServices/DashboardService";

// export const RegisteredStudentsByUsers = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   let studentClass;
//   if (location.pathname === "/user-registered-students-mb") {
//     studentClass = "8";
//   } else if (location.pathname === "/user-registered-students-sh") {
//     studentClass = "10";
//   }

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState(null);

//   // Derived header title
//   const getHeaderTitle = () => {
//     if (!students || students.length === 0) {
//       return studentClass ? `Class ${studentClass} Data` : "Registered Students";
//     }
//     const uniqueClasses = Array.from(
//       new Set(students.map((s) => s.classOfStudent).filter(Boolean))
//     );
//     if (uniqueClasses.length === 1) return `Class ${uniqueClasses[0]} Data`;
//     if (studentClass) return `Class ${studentClass} Data`;
//     return "Registered Students";
//   };

//   // Format date
//   const formatDate = (d) => {
//     if (!d) return "-";
//     try {
//       const dt = new Date(d);
//       if (isNaN(dt)) return String(d);
//       return dt.toLocaleDateString();
//     } catch {
//       return String(d);
//     }
//   };

//   // Fetch students
//   const fetchRegisteredStudentsData = async () => {
//     if (!userData?.user?._id) return;
//     setLoading(true);
//     setError(null);

//     const reqBody = {
//       _id: userData.user._id,
//       classOfStudent: studentClass,
//     };

//     try {
//       const response = await GetStudentsRegisteredByUser(reqBody);

//       // Normalize response shapes:
//       // - Possible shapes:
//       //   1) { success: true, count: N, data: [...] }
//       //   2) { data: [...] }
//       //   3) [...] (direct array)
//       //   4) { success: true, data: { ...counts... } } -> no students
//       let payload = null;
//       if (Array.isArray(response)) {
//         payload = response;
//       } else if (response && Array.isArray(response.data)) {
//         payload = response.data;
//       } else if (
//         response &&
//         response.data &&
//         response.data.data &&
//         Array.isArray(response.data.data)
//       ) {
//         payload = response.data.data;
//       } else if (response && Array.isArray(response?.data?.data)) {
//         payload = response.data.data;
//       }

//       if (payload) {
//         setStudents(payload);
//       } else {
//         // no array found; try other common spots
//         if (response && response.data && Array.isArray(response.data)) {
//           setStudents(response.data);
//         } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
//           setStudents(response.data.data);
//         } else {
//           // Nothing array-like — clear students and log
//           setStudents([]);
//           console.warn("GetStudentsRegisteredByUser returned no array:", response);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching registered students:", err);
//       setError(err.message || "Failed to fetch students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRegisteredStudentsData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userData?.user?._id, location.pathname]);

//   // client-side filtered list
//   const filtered = students.filter((s) => {
//     if (!search) return true;
//     const q = search.toLowerCase();
//     return (
//       String(s.name || "").toLowerCase().includes(q) ||
//       String(s.srn || "").toLowerCase().includes(q) ||
//       String(s.mobile || "").toLowerCase().includes(q)
//     );
//   });

//   return (
//     <Container fluid className="py-3">
//       <Row className="align-items-center mb-3">
//         <Col>
//           <h4 style={{ margin: 0 }}>{getHeaderTitle()}</h4>
//           <small className="text-muted">List of registered students you created</small>
//         </Col>
//         <Col xs="auto">
//           <Button variant="outline-secondary" size="sm" onClick={fetchRegisteredStudentsData}>
//             Refresh
//           </Button>
//         </Col>
//       </Row>

//       <Card className="mb-3">
//         <Card.Body>
//           <Row className="g-2 align-items-center">
//             <Col md={6}>
//               <InputGroup>
//                 <Form.Control
//                   placeholder="Search by name, SRN or mobile..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//                 <Button variant="outline-secondary" onClick={() => setSearch("")}>
//                   Clear
//                 </Button>
//               </InputGroup>
//             </Col>
//             <Col md={6} className="text-end">
//               <Badge bg="primary" pill style={{ fontSize: 14 }}>
//                 Total: {students.length}
//               </Badge>{" "}
//               <Badge bg="success" pill style={{ fontSize: 14 }}>
//                 Showing: {filtered.length}
//               </Badge>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" />
//         </div>
//       ) : error ? (
//         <Card className="mb-3">
//           <Card.Body>
//             <p className="text-danger">Error: {error}</p>
//           </Card.Body>
//         </Card>
//       ) : filtered.length === 0 ? (
//         <Card className="mb-3">
//           <Card.Body>
//             <p className="mb-0">No registered students found.</p>
//           </Card.Body>
//         </Card>
//       ) : (
//         <Card>
//           <Card.Body style={{ overflowX: "auto" }}>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>SRN</th>
//                   <th>Name</th>
//                   <th>Father</th>
//                   <th>Class</th>
//                   <th>Mobile</th>
//                   <th>Aadhar</th>
//                   <th>School</th>
//                   <th>Slip ID</th>
//                   <th>Verified</th>
//                   <th>Reg. Date</th>
//                   <th>Photo</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((s, idx) => (
//                   <tr key={s._id || idx}>
//                     <td>{idx + 1}</td>
//                     <td>{s.srn ?? "-"}</td>
//                     <td>{s.name ?? "-"}</td>
//                     <td>{s.father ?? "-"}</td>
//                     <td>{s.classOfStudent ?? "-"}</td>
//                     <td>{s.mobile ?? "-"}</td>
//                     <td>{s.aadhar ?? "-"}</td>
//                     <td style={{ maxWidth: 180 }}>{s.school ?? "-"}</td>
//                     <td>{s.slipId ?? "-"}</td>
//                     <td>{s.isVerified ?? "-"}</td>
//                     <td>{formatDate(s.registrationDate ?? s.createdAt)}</td>
//                     <td>
//                       {s.imageUrl ? (
//                         <img
//                           src={s.imageUrl}
//                           alt={s.name || "photo"}
//                           style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
//                         />
//                       ) : s.image ? (
//                         <span>{s.image}</span>
//                       ) : (
//                         "-"
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}
//     </Container>
//   );
// };
















// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   ListGroup,
//   Badge,
//   Table,
//   Form,
//   InputGroup,
//   Spinner,
// } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { GetStudentsRegisteredByUser } from "../../services/DashBoardServices/DashboardService";

// export const RegisteredStudentsByUsers = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   let studentClass;
//   if (location.pathname === "/user-registered-students-mb") {
//     studentClass = "8";
//   } else if (location.pathname === "/user-registered-students-sh") {
//     studentClass = "10";
//   }

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState(null);

//   // Derived header title
//   const getHeaderTitle = () => {
//     if (!students || students.length === 0) {
//       return studentClass ? `Class ${studentClass} Data` : "Registered Students";
//     }
//     const uniqueClasses = Array.from(
//       new Set(students.map((s) => s.classOfStudent).filter(Boolean))
//     );
//     if (uniqueClasses.length === 1) return `Class ${uniqueClasses[0]} Data`;
//     if (studentClass) return `Class ${studentClass} Data`;
//     return "Registered Students";
//   };

//   // Format date (for DOB/reg date fallback)
//   const formatDate = (d) => {
//     if (!d) return "-";
//     try {
//       const dt = new Date(d);
//       if (isNaN(dt)) return String(d);
//       return dt.toLocaleDateString();
//     } catch {
//       return String(d);
//     }
//   };

//   // Fetch students
//   const fetchRegisteredStudentsData = async () => {
//     if (!userData?.user?._id) return;
//     setLoading(true);
//     setError(null);

//     const reqBody = {
//       _id: userData.user._id,
//       classOfStudent: studentClass,
//     };

//     try {
//       const response = await GetStudentsRegisteredByUser(reqBody);

//       console.log(response.data)
//       // Normalize response shapes:
//       let payload = null;
//       if (Array.isArray(response)) {
//         payload = response;
//       } else if (response && Array.isArray(response.data)) {
//         payload = response.data;
//       } else if (
//         response &&
//         response.data &&
//         response.data.data &&
//         Array.isArray(response.data.data)
//       ) {
//         payload = response.data.data;
//       } else if (response && Array.isArray(response?.data?.data)) {
//         payload = response.data.data;
//       }

//       if (payload) {
//         setStudents(payload);

        
//       } else {
//         if (response && response.data && Array.isArray(response.data)) {
//           setStudents(response.data);
//         } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
//           setStudents(response.data.data);
//         } else {
//           setStudents([]);
//           console.warn("GetStudentsRegisteredByUser returned no array:", response);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching registered students:", err);
//       setError(err.message || "Failed to fetch students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRegisteredStudentsData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userData?.user?._id, location.pathname]);

//   // client-side filtered list
//   const filtered = students.filter((s) => {
//     if (!search) return true;
//     const q = search.toLowerCase();
//     return (
//       String(s.name || "").toLowerCase().includes(q) ||
//       String(s.srn || "").toLowerCase().includes(q) ||
//       String(s.mobile || "").toLowerCase().includes(q)
//     );
//   });

//   // Download admit card handler — simple alert for now
//   const handleDownloadAdmitCard = (row) => {
//     // window.alert(`Download admit card for ${row.name || row.srn || "student"}`);

//     window.alert(`Available for downloading soon.`);
//   };

//   return (
//     <Container fluid className="py-3">
//       <Row className="align-items-center mb-3">
//         <Col>
//           <h4 style={{ margin: 0 }}>{getHeaderTitle()}</h4>
//           <small className="text-muted">List of registered students you created</small>
//         </Col>
//         <Col xs="auto">
//           <Button variant="outline-secondary" size="sm" onClick={fetchRegisteredStudentsData}>
//             Refresh
//           </Button>
//         </Col>
//       </Row>

//       <Card className="mb-3">
//         <Card.Body>
//           <Row className="g-2 align-items-center">
//             <Col md={6}>
//               <InputGroup>
//                 <Form.Control
//                   placeholder="Search by name, SRN or mobile..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//                 <Button variant="outline-secondary" onClick={() => setSearch("")}>
//                   Clear
//                 </Button>
//               </InputGroup>
//             </Col>
//             <Col md={6} className="text-end">
//               <Badge bg="primary" pill style={{ fontSize: 14 }}>
//                 Total: {students.length}
//               </Badge>{" "}
//               <Badge bg="success" pill style={{ fontSize: 14 }}>
//                 Showing: {filtered.length}
//               </Badge>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" />
//         </div>
//       ) : error ? (
//         <Card className="mb-3">
//           <Card.Body>
//             <p className="text-danger">Error: {error}</p>
//           </Card.Body>
//         </Card>
//       ) : filtered.length === 0 ? (
//         <Card className="mb-3">
//           <Card.Body>
//             <p className="mb-0">No registered students found.</p>
//           </Card.Body>
//         </Card>
//       ) : (
//         <Card>
//           <Card.Body style={{ overflowX: "auto" }}>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>SRN</th>
//                   <th>Name</th>
//                   <th>Father</th>
//                   <th>DOB</th>
//                   <th>Mobile</th>
//                   <th>School</th>
//                   <th>Verified</th>
//                   <th>Photo</th>
//                   <th>Admit Card</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((s, idx) => (
//                   <tr key={s._id || idx}>
//                     <td>{idx + 1}</td>
//                     <td>{s.srn ?? "-"}</td>
//                     <td>{s.name ?? "-"}</td>
//                     <td>{s.father ?? "-"}</td>
//                     <td>{formatDate(s.dob ?? s.registrationDate ?? s.createdAt)}</td>
//                     <td>{s.mobile ?? "-"}</td>
//                     <td style={{ maxWidth: 220 }}>{s.school ?? "-"}</td>
//                     <td>{s.isVerified ?? s.ui_isVerified ?? "-"}</td>
//                     <td>
//                       {s.imageUrl ? (
//                         <img
//                           src={s.imageUrl}
//                           alt={s.name || "photo"}
//                           style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
//                         />
//                       ) : s.image ? (
//                         <span>{s.image}</span>
//                       ) : (
//                         "-"
//                       )}
//                     </td>
//                     <td style={{ whiteSpace: "nowrap", minWidth: 150 }}>
//                       <Button
//                         size="sm"
//                         variant="primary"
//                         onClick={() => handleDownloadAdmitCard(s)}
//                         style={{ whiteSpace: "nowrap", minWidth: 130 }}
//                       >
//                         Download Admit Card
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}
//     </Container>
//   );
// };









// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Badge,
//   Table,
//   Form,
//   InputGroup,
//   Spinner,
//   Modal,
// } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { GetStudentsRegisteredByUser } from "../../services/DashBoardServices/DashboardService";
// import { IsAdmitCardDownloaded } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

// import jsPDF from "jspdf";
// import "jspdf-autotable"; // ensure plugin is available in your build

// export const RegisteredStudentsByUsers = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   let studentClass;
//   if (location.pathname === "/user-registered-students-mb") {
//     studentClass = "8";
//   } else if (location.pathname === "/user-registered-students-sh") {
//     studentClass = "10";
//   }

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState(null);

//   // per-row download state (id of student being downloaded)
//   const [downloadingId, setDownloadingId] = useState(null);
//   const [showPdfErrorModal, setShowPdfErrorModal] = useState(false);

//   // Derived header title
//   const getHeaderTitle = () => {
//     if (!students || students.length === 0) {
//       return studentClass ? `Class ${studentClass} Data` : "Registered Students";
//     }
//     const uniqueClasses = Array.from(
//       new Set(students.map((s) => s.classOfStudent).filter(Boolean))
//     );
//     if (uniqueClasses.length === 1) return `Class ${uniqueClasses[0]} Data`;
//     if (studentClass) return `Class ${studentClass} Data`;
//     return "Registered Students";
//   };

//   // Format date (for DOB/reg date fallback)
//   const formatDate = (d) => {
//     if (!d) return "-";
//     try {
//       const dt = new Date(d);
//       if (isNaN(dt)) return String(d);
//       return dt.toLocaleDateString();
//     } catch {
//       return String(d);
//     }
//   };

//   // helper: convert ArrayBuffer to base64 (used for embedding font if needed)
//   const arrayBufferToBase64 = (buffer) => {
//     let binary = "";
//     const bytes = new Uint8Array(buffer);
//     for (let i = 0; i < bytes.byteLength; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return btoa(binary);
//   };

//   // Fetch students
//   const fetchRegisteredStudentsData = async () => {
//     if (!userData?.user?._id) return;
//     setLoading(true);
//     setError(null);

//     const reqBody = {
//       _id: userData.user._id,
//       classOfStudent: studentClass,
//     };

//     try {
//       const response = await GetStudentsRegisteredByUser(reqBody);

//       // Normalize response shapes:
//       let payload = null;
//       if (Array.isArray(response)) {
//         payload = response;
//       } else if (response && Array.isArray(response.data)) {
//         payload = response.data;
//       } else if (
//         response &&
//         response.data &&
//         response.data.data &&
//         Array.isArray(response.data.data)
//       ) {
//         payload = response.data.data;
//       } else if (response && Array.isArray(response?.data?.data)) {
//         payload = response.data.data;
//       }

//       if (payload) {
//         setStudents(payload);
//       } else {
//         if (response && response.data && Array.isArray(response.data)) {
//           setStudents(response.data);
//         } else if (
//           response &&
//           response.data &&
//           response.data.data &&
//           Array.isArray(response.data.data)
//         ) {
//           setStudents(response.data.data);
//         } else {
//           setStudents([]);
//           console.warn("GetStudentsRegisteredByUser returned no array:", response);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching registered students:", err);
//       setError(err.message || "Failed to fetch students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRegisteredStudentsData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userData?.user?._id, location.pathname]);

//   // client-side filtered list
//   const filtered = students.filter((s) => {
//     if (!search) return true;
//     const q = search.toLowerCase();
//     return (
//       String(s.name || "").toLowerCase().includes(q) ||
//       String(s.srn || "").toLowerCase().includes(q) ||
//       String(s.mobile || "").toLowerCase().includes(q)
//     );
//   });

//   // ---------- Admit Card PDF generation logic ----------
//   // static assets (must exist in public/)
//   const logo = "/haryana.png";
//   const logo2 = "/admitBuniyaLogo.png";
//   const level1admitinstructions = "/level1admitinstructions.png";

//   // generate and download PDF for a given student object
//   const generateAdmitCard = async (student) => {
//     if (!student) return;
//     setDownloadingId(student._id ?? student.srn ?? "downloading");

//     try {
//       // Try to load Devanagari font from public/fonts — fallback gracefully if not present
//       const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
//       let fontBase64 = null;
//       try {
//         const resp = await fetch(fontUrl);
//         if (resp.ok) {
//           const fontArrayBuffer = await resp.arrayBuffer();
//           fontBase64 = arrayBufferToBase64(fontArrayBuffer);
//           if (jsPDF.API && jsPDF.API.addFileToVFS) {
//             jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", fontBase64);
//             jsPDF.API.addFont(
//               "NotoSansDevanagari-Regular.ttf",
//               "NotoDeva",
//               "normal"
//             );
//           }
//         }
//       } catch (fe) {
//         // ignore font load errors; continue without Hindi font
//         console.warn("Devanagari font not loaded:", fe);
//       }

//       // create doc
//       const doc = new jsPDF();
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(11);

//       // page frame
//       doc.rect(5, 5, 200, 285);

//       // try adding logos (these may fail for cross-origin if not served correctly)
//       try {
//         doc.addImage(logo, "PNG", 10, 8, 20, 20);
//       } catch (e) {
//         // ignore
//       }
//       try {
//         doc.addImage(logo2, "PNG", 180, 8, 20, 20);
//       } catch (e) {}

//       const pageWidth = doc.internal.pageSize.getWidth();

//       // headings
//       doc.setFontSize(12);
//       doc.text(
//         "Directorate of School Education (DSE) Shiksha Sadan, Haryana",
//         pageWidth / 2,
//         10,
//         { align: "center" }
//       );
//       doc.setFontSize(13);
//       const examLevel =
//         student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";
//       doc.text(`${examLevel} Level 1 Exam (2026-28)`, pageWidth / 2, 15, {
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

//       // build table data
//       const formatDateToDDMMYYYY = (dateStr) => {
//         if (!dateStr) return "-";
//         const d = new Date(dateStr);
//         const day = String(d.getDate()).padStart(2, "0");
//         const month = String(d.getMonth() + 1).padStart(2, "0");
//         const year = d.getFullYear();
//         return `${day}-${month}-${year}`;
//       };

//       const dataForPdf = [
//         { field: "Student Name", name: student.name ?? "-" },
//         { field: "Father's Name", name: student.father ?? "-" },
//         {
//           field: "Date of Birth",
//           name: student.dob ? formatDateToDDMMYYYY(student.dob) : "-",
//         },
//         { field: "Category", name: student.category ?? "-" },
//         { field: "SRN Number", name: student.srn ?? "-" },
//         { field: "Exam Roll Number", name: student.rollNumber ?? "-" },
//         { field: "Aadhar Number", name: student.aadhar ?? "-" },
//         { field: "Mobile Number", name: student.mobile ?? "-" },
//         {
//           field: "District",
//           name:
//             (student.schoolDistrict ? student.schoolDistrict : "-") +
//             (student.schoolDistrictCode ? " (" + student.schoolDistrictCode + ")" : ""),
//         },
//         {
//           field: "Block",
//           name:
//             (student.schoolBlock ? student.schoolBlock : "-") +
//             (student.schoolBlockCode ? " (" + student.schoolBlockCode + ")" : ""),
//         },
//         { field: "Examination Center", name: student.L1ExaminationCenter ?? "-" },
//       ];

//       doc.autoTable({
//         startY: 40,
//         body: dataForPdf.map((r) => [r.field, r.name]),
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

//       // student photo area - try to add student.imageUrl, otherwise placeholder
//       if (student.imageUrl) {
//         try {
//           doc.addImage(student.imageUrl, "PNG", 150, 40, 50, 50);
//         } catch (e) {
//           doc.rect(150, 40, 50, 50);
//           doc.text("Photo unavailable", 153, 65);
//         }
//       } else {
//         doc.rect(150, 40, 50, 50);
//         doc.text("If no photo,", 155, 60);
//         doc.text("please attach passport", 155, 65);
//         doc.text("size photo", 155, 70);
//       }

//       // dividing line
//       doc.setLineWidth(0.5);
//       doc.line(10, 130, pageWidth - 10, 130);

//       // add instructions image if available
//       try {
//         doc.addImage(level1admitinstructions, "PNG", 15, 132, 180, 155);
//       } catch (e) {
//         // fallback: small text block
//         doc.setFontSize(9);
//         doc.text(
//           "General Instructions: Reach 30 minutes early. Carry admit card & Aadhar. Do not carry mobile/calculators etc.",
//           15,
//           135,
//           { maxWidth: pageWidth - 30 }
//         );
//       }

//       // Save PDF (filename uses SRN or name)
//       const safeName = (student.srn || student.name || "admit").toString().replace(/\s+/g, "_");
//       doc.save(`${safeName}_admit_card.pdf`);

//       // After successful save attempt — call backend to mark admit-card downloaded
//       try {
//         const reqBody = {
//           _id: student._id,
//           admitCardDownloadStatus: {
//             isL1AdmitCardDownloaded: true,
//           },
//         };
//         // call service (fire-and-forget-ish but we'll await)
//         await IsAdmitCardDownloaded(reqBody);
//       } catch (svcErr) {
//         console.warn("Failed to notify server about admit-card download:", svcErr);
//         // not critical for user flow; just log
//       }
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       setShowPdfErrorModal(true);
//     } finally {
//       setDownloadingId(null);
//     }
//   };

//   // ---------- end PDF logic ----------

//   // Download admit card handler used in UI
//   const handleDownloadAdmitCard = (row) => {
//     // If already downloading for this row, ignore
//     if (downloadingId) return;
//     generateAdmitCard(row);
//   };

//   return (
//     <Container fluid className="py-3">
//       <Row className="align-items-center mb-3">
//         <Col>
//           <h4 style={{ margin: 0 }}>{getHeaderTitle()}</h4>
//           <small className="text-muted">List of registered students you created</small>
//         </Col>
//         <Col xs="auto">
//           <Button variant="outline-secondary" size="sm" onClick={fetchRegisteredStudentsData}>
//             Refresh
//           </Button>
//         </Col>
//       </Row>

//       <Card className="mb-3">
//         <Card.Body>
//           <Row className="g-2 align-items-center">
//             <Col md={6}>
//               <InputGroup>
//                 <Form.Control
//                   placeholder="Search by name, SRN or mobile..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//                 <Button variant="outline-secondary" onClick={() => setSearch("")}>
//                   Clear
//                 </Button>
//               </InputGroup>
//             </Col>
//             <Col md={6} className="text-end">
//               <Badge bg="primary" pill style={{ fontSize: 14 }}>
//                 Total: {students.length}
//               </Badge>{" "}
//               <Badge bg="success" pill style={{ fontSize: 14 }}>
//                 Showing: {filtered.length}
//               </Badge>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" />
//         </div>
//       ) : error ? (
//         <Card className="mb-3">
//           <Card.Body>
//             <p className="text-danger">Error: {error}</p>
//           </Card.Body>
//         </Card>
//       ) : filtered.length === 0 ? (
//         <Card className="mb-3">
//           <Card.Body>
//             <p className="mb-0">No registered students found.</p>
//           </Card.Body>
//         </Card>
//       ) : (
//         <Card>
//           <Card.Body style={{ overflowX: "auto" }}>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>SRN</th>
//                   <th>Name</th>
//                   <th>Father</th>
//                   <th>DOB</th>
//                   <th>Mobile</th>
//                   <th>School</th>
//                   <th>Verified</th>
//                   <th>Photo</th>
//                   <th>Admit Card</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((s, idx) => (
//                   <tr key={s._id || idx}>
//                     <td>{idx + 1}</td>
//                     <td>{s.srn ?? "-"}</td>
//                     <td>{s.name ?? "-"}</td>
//                     <td>{s.father ?? "-"}</td>
//                     <td>{formatDate(s.dob ?? s.registrationDate ?? s.createdAt)}</td>
//                     <td>{s.mobile ?? "-"}</td>
//                     <td style={{ maxWidth: 220 }}>{s.school ?? "-"}</td>
//                     <td>{s.isVerified ?? s.ui_isVerified ?? "-"}</td>
//                     <td>
//                       {s.imageUrl ? (
//                         <img
//                           src={s.imageUrl}
//                           alt={s.name || "photo"}
//                           style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
//                         />
//                       ) : s.image ? (
//                         <span>{s.image}</span>
//                       ) : (
//                         "-"
//                       )}
//                     </td>
//                     <td style={{ whiteSpace: "nowrap", minWidth: 150 }}>
//                       <Button
//                         size="sm"
//                         variant="primary"
//                         onClick={() => handleDownloadAdmitCard(s)}
//                         style={{ whiteSpace: "nowrap", minWidth: 130 }}
//                         disabled={!!downloadingId}
//                       >
//                         {downloadingId === (s._id ?? s.srn ?? "downloading") ? (
//                           <>
//                             <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
//                             Generating...
//                           </>
//                         ) : (
//                           "Download Admit Card"
//                         )}
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}

//       {/* PDF error modal */}
//       <Modal show={showPdfErrorModal} onHide={() => setShowPdfErrorModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>PDF Error</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>There was a problem generating the PDF. Please try again or contact support.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowPdfErrorModal(false)}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };











// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Badge,
//   Table,
//   Form,
//   InputGroup,
//   Spinner,
// } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { GetStudentsRegisteredByUser } from "../../services/DashBoardServices/DashboardService";
// import { BulkDownloadContext } from "../ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi";
// import { Level1AdmitCard } from "../StudentRegistration/Level1AdmitCard";

// export const RegisteredStudentsByUsers = () => {
//   const { userData } = useContext(UserContext);
//   const { bulkDownload, setBulkDownload } = useContext(BulkDownloadContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   let studentClass;
//   if (location.pathname === "/user-registered-students-mb") {
//     studentClass = "8";
//   } else if (location.pathname === "/user-registered-students-sh") {
//     studentClass = "10";
//   }

//   const [loading, setLoading] = useState(false);
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState(null);

//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [showSingleStudent, setShowSingleStudent] = useState(null); // student object for single modal

//   // fetch
//   const fetchRegisteredStudentsData = async () => {
//     if (!userData?.user?._id) return;
//     setLoading(true);
//     setError(null);
//     const reqBody = { _id: userData.user._id, classOfStudent: studentClass };
//     try {
//       const response = await GetStudentsRegisteredByUser(reqBody);
//       let payload = null;
//       if (Array.isArray(response)) payload = response;
//       else if (response && Array.isArray(response.data)) payload = response.data;
//       else if (response && response.data && Array.isArray(response.data.data)) payload = response.data.data;
//       setStudents(payload || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to fetch students");
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchRegisteredStudentsData(); }, [userData?.user?._id, location.pathname]);

//   const filtered = students.filter((s) => {
//     if (!search) return true;
//     const q = search.toLowerCase();
//     return (String(s.name || "").toLowerCase().includes(q) || String(s.srn || "").toLowerCase().includes(q) || String(s.mobile || "").toLowerCase().includes(q));
//   });

//   const toggleSelect = (id) => {
//     const copy = new Set(selectedIds);
//     if (copy.has(id)) copy.delete(id);
//     else copy.add(id);
//     setSelectedIds(copy);
//   };

//   const addSelectedToBulk = () => {
//     if (selectedIds.size === 0) {
//       alert("Select at least one student to add.");
//       return;
//     }
//     const rows = students.filter(s => selectedIds.has(s._id));
//     setBulkDownload(rows);
//     // Optionally open Level1AdmitCard automatically — our Level1AdmitCard watches bulkDownload and will auto-run.
//   };

//   const clearBulk = () => setBulkDownload(null);

//   const startSingleDownload = (student) => {
//     setShowSingleStudent(student);
//   };

//   return (
//     <Container fluid className="py-3">
//       <Row className="align-items-center mb-3">
//         <Col>
//           <h4 style={{ margin: 0 }}>{studentClass ? `Class ${studentClass} Data` : "Registered Students"}</h4>
//           <small className="text-muted">List of registered students you created</small>
//         </Col>
//         <Col xs="auto">
//           <Button variant="outline-secondary" size="sm" onClick={fetchRegisteredStudentsData}>Refresh</Button>
//         </Col>
//       </Row>

//       <Card className="mb-3">
//         <Card.Body>
//           <Row className="g-2 align-items-center">
//             <Col md={6}>
//               <InputGroup>
//                 <Form.Control placeholder="Search by name, SRN or mobile..." value={search} onChange={(e) => setSearch(e.target.value)} />
//                 <Button variant="outline-secondary" onClick={() => setSearch("")}>Clear</Button>
//               </InputGroup>
//             </Col>
//             <Col md={6} className="text-end">
//               <Badge bg="primary" pill style={{ fontSize: 14 }}>Total: {students.length}</Badge>{" "}
//               <Badge bg="success" pill style={{ fontSize: 14 }}>Showing: {filtered.length}</Badge>
//             </Col>
//           </Row>
//         </Card.Body>
//         <Card.Footer>
//           <div className="d-flex gap-2">
//             <Button variant="primary" onClick={addSelectedToBulk} disabled={selectedIds.size === 0}>Add selected to Bulk</Button>
//             <Button variant="success" onClick={() => {
//               // If bulkDownload already has data, Level1AdmitCard will auto-run; otherwise ask user to add
//               if (Array.isArray(bulkDownload) && bulkDownload.length > 0) {
//                 // show a small modal or just rely on Level1AdmitCard auto-run modal — we will render it below
//                 alert("Bulk data present — starting creation. A modal will show progress.");
//               } else {
//                 alert("No bulk data. Select students and click 'Add selected to Bulk' first.");
//               }
//             }}>Generate Bulk Admit Cards</Button>
//             <Button variant="outline-danger" onClick={clearBulk}>Clear Bulk</Button>
//           </div>
//         </Card.Footer>
//       </Card>

//       {loading ? (
//         <div className="text-center py-5"><Spinner animation="border" /></div>
//       ) : error ? (
//         <Card className="mb-3"><Card.Body><p className="text-danger">Error: {error}</p></Card.Body></Card>
//       ) : filtered.length === 0 ? (
//         <Card className="mb-3"><Card.Body><p className="mb-0">No registered students found.</p></Card.Body></Card>
//       ) : (
//         <Card>
//           <Card.Body style={{ overflowX: "auto" }}>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th style={{ width: 40 }}><input type="checkbox" onChange={(e) => {
//                     if (e.target.checked) setSelectedIds(new Set(filtered.map(s => s._id)));
//                     else setSelectedIds(new Set());
//                   }} checked={filtered.length>0 && selectedIds.size === filtered.length} /></th>
//                   <th>#</th>
//                   <th>SRN</th>
//                   <th>Name</th>
//                   <th>Father</th>
//                   <th>DOB</th>
//                   <th>Mobile</th>
//                   <th>School</th>
//                   <th>Verified</th>
//                   <th>Photo</th>
//                   <th>Admit Card</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((s, idx) => (
//                   <tr key={s._id || idx}>
//                     <td><input type="checkbox" checked={selectedIds.has(s._id)} onChange={() => toggleSelect(s._id)} /></td>
//                     <td>{idx + 1}</td>
//                     <td>{s.srn ?? "-"}</td>
//                     <td>{s.name ?? "-"}</td>
//                     <td>{s.father ?? "-"}</td>
//                     <td>{s.dob ? new Date(s.dob).toLocaleDateString() : "-"}</td>
//                     <td>{s.mobile ?? "-"}</td>
//                     <td style={{ maxWidth: 220 }}>{s.school ?? "-"}</td>
//                     <td>{s.isVerified ?? s.ui_isVerified ?? "-"}</td>
//                     <td>
//                       {s.imageUrl ? <img src={s.imageUrl} alt={s.name || "photo"} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} /> : (s.image ? <span>{s.image}</span> : "-")}
//                     </td>
//                     <td>
//                       <Button size="sm" variant="primary" onClick={() => startSingleDownload(s)}>Download Admit Card</Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}

//       {/* if bulkDownload exists, render Level1AdmitCard component which will auto-run */}
//       {Array.isArray(bulkDownload) && bulkDownload.length > 0 && (
//         <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
//           <Card className="p-2 shadow">
//             <div style={{ minWidth: 260 }}>
//               <div><strong>{bulkDownload.length}</strong> students queued for bulk download</div>
//               <div className="d-flex gap-2 mt-2">
//                 <Button size="sm" variant="success" onClick={() => {
//                   // Level1AdmitCard watches bulkDownload and will auto-run, but we ensure user knows
//                   alert("Bulk generation will start and a progress modal will appear.");
//                 }}>Start Bulk</Button>
//                 <Button size="sm" variant="outline-secondary" onClick={() => setBulkDownload(null)}>Cancel</Button>
//               </div>
//               {/* The Level1AdmitCard component will auto-run when it sees bulkDownload; render it hidden here */}
//               <div style={{ display: "none" }}>
//                 <Level1AdmitCard />
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Single-student mode: show Level1AdmitCard when requested */}
//       {showSingleStudent && (
//         <div style={{ position: "fixed", left: 20, bottom: 20, zIndex: 9999 }}>
//           <Card className="p-2 shadow">
//             <Level1AdmitCard singleStudent={showSingleStudent} onDone={() => setShowSingleStudent(null)} />
//           </Card>
//         </div>
//       )}
//     </Container>
//   );
// };



// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Badge,
//   Table,
//   Form,
//   InputGroup,
//   Spinner,
// } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { GetStudentsRegisteredByUser } from "../../services/DashBoardServices/DashboardService";
// import { BulkDownloadContext } from "../ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi";
// import { Level1AdmitCard } from "../StudentRegistration/Level1AdmitCard";

// export const RegisteredStudentsByUsers = () => {
//   const { userData } = useContext(UserContext);
//   const { bulkDownload, setBulkDownload } = useContext(BulkDownloadContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   let studentClass;
//   if (location.pathname === "/user-registered-students-mb") {
//     studentClass = "8";
//   } else if (location.pathname === "/user-registered-students-sh") {
//     studentClass = "10";
//   }

//   const [loading, setLoading] = useState(false);
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState(null);

//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [showSingleStudent, setShowSingleStudent] = useState(null); // student object for single modal
//   const [showBulkRunner, setShowBulkRunner] = useState(false); // show Level1AdmitCard for bulk run
//   const [rightSelectAllToggle, setRightSelectAllToggle] = useState(false); // tracks right-column select-all state

//   // fetch
//   const fetchRegisteredStudentsData = async () => {
//     if (!userData?.user?._id) return;
//     setLoading(true);
//     setError(null);
//     const reqBody = { _id: userData.user._id, classOfStudent: studentClass };
//     try {
//       const response = await GetStudentsRegisteredByUser(reqBody);
//       let payload = null;
//       if (Array.isArray(response)) payload = response;
//       else if (response && Array.isArray(response.data)) payload = response.data;
//       else if (response && response.data && Array.isArray(response.data.data)) payload = response.data.data;
//       setStudents(payload || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to fetch students");
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchRegisteredStudentsData(); }, [userData?.user?._id, location.pathname]);

//   const filtered = students.filter((s) => {
//     if (!search) return true;
//     const q = search.toLowerCase();
//     return (String(s.name || "").toLowerCase().includes(q) || String(s.srn || "").toLowerCase().includes(q) || String(s.mobile || "").toLowerCase().includes(q));
//   });

//   const toggleSelect = (id) => {
//     setSelectedIds(prev => {
//       const copy = new Set(prev);
//       if (copy.has(id)) copy.delete(id);
//       else copy.add(id);
//       return copy;
//     });
//     // keep rightSelectAllToggle consistent
//     setRightSelectAllToggle(false);
//   };

//   // select/deselect all visible rows (left checkbox or right toggle)
//   const setSelectAllVisible = (checked) => {
//     if (checked) {
//       setSelectedIds(new Set(filtered.map((s) => s._id)));
//       setRightSelectAllToggle(true);
//     } else {
//       setSelectedIds(new Set());
//       setRightSelectAllToggle(false);
//     }
//   };

//   // right-column header button toggles select all visible
//   const toggleRightHeaderSelectAll = () => {
//     const shouldSelect = !rightSelectAllToggle;
//     setSelectAllVisible(shouldSelect);
//   };

//   const addSelectedToBulk = () => {
//     if (selectedIds.size === 0) {
//       alert("Select at least one student to add.");
//       return;
//     }
//     const rows = students.filter(s => selectedIds.has(s._id));
//     setBulkDownload(rows);
//     alert(`${rows.length} students added to bulk queue.`);
//   };

//   const clearBulk = () => {
//     setBulkDownload(null);
//     alert("Bulk queue cleared.");
//   };

//   const startSingleDownload = (student) => {
//     // open Level1AdmitCard in single mode (fixed bottom-left)
//     setShowSingleStudent(student);
//   };

//   // NEW: click Bulk Download top button -> set bulkDownload and show Level1AdmitCard runner
//   const handleBulkDownloadClick = () => {
//     if (selectedIds.size === 0) {
//       alert("Select at least one student to bulk download.");
//       return;
//     }
//     const rows = students.filter((s) => selectedIds.has(s._id));
//     setBulkDownload(rows);
//     setShowBulkRunner(true);
//     // Level1AdmitCard will auto-run when it sees bulkDownload array
//   };

//   return (
//     <Container fluid className="py-3">
//       <Row className="align-items-center mb-3">
//         <Col>
//           <h4 style={{ margin: 0 }}>{studentClass ? `Class ${studentClass} Data` : "Registered Students"}</h4>
//           <small className="text-muted">List of registered students you created</small>
//         </Col>

//         {/* Top controls: Refresh + Bulk Download */}
//         <Col xs="auto" className="d-flex gap-2">
//           <Button variant="outline-secondary" size="sm" onClick={fetchRegisteredStudentsData}>Refresh</Button>

//           {/* Bulk Download button: enabled only when at least one checkbox is selected */}
//           <Button
//             variant="success"
//             size="sm"
//             onClick={handleBulkDownloadClick}
//             disabled={selectedIds.size === 0}
//             title={selectedIds.size === 0 ? "Select students first" : "Download selected students' admit cards as ZIP"}
//           >
//             {selectedIds.size === 0 ? "Bulk Download" : `Bulk Download (${selectedIds.size})`}
//           </Button>

//           <Button variant="outline-danger" size="sm" onClick={clearBulk}>Clear Bulk</Button>
//         </Col>
//       </Row>

//       <Card className="mb-3">
//         <Card.Body>
//           <Row className="g-2 align-items-center">
//             <Col md={6}>
//               <InputGroup>
//                 <Form.Control placeholder="Search by name, SRN or mobile..." value={search} onChange={(e) => setSearch(e.target.value)} />
//                 <Button variant="outline-secondary" onClick={() => setSearch("")}>Clear</Button>
//               </InputGroup>
//             </Col>
//             <Col md={6} className="text-end">
//               <Badge bg="primary" pill style={{ fontSize: 14 }}>Total: {students.length}</Badge>{" "}
//               <Badge bg="success" pill style={{ fontSize: 14 }}>Showing: {filtered.length}</Badge>
//             </Col>
//           </Row>
//         </Card.Body>
//         <Card.Footer>
//           {/* kept minimal footer as requested */}
//         </Card.Footer>
//       </Card>

//       {loading ? (
//         <div className="text-center py-5"><Spinner animation="border" /></div>
//       ) : error ? (
//         <Card className="mb-3"><Card.Body><p className="text-danger">Error: {error}</p></Card.Body></Card>
//       ) : filtered.length === 0 ? (
//         <Card className="mb-3"><Card.Body><p className="mb-0">No registered students found.</p></Card.Body></Card>
//       ) : (
//         <Card>
//           <Card.Body style={{ overflowX: "auto" }}>
//             <Table striped bordered hover responsive className="align-middle">
//               <thead>
//                 <tr>
//                   {/* left checkbox column */}
//                   <th style={{ width: 40, verticalAlign: "middle", textAlign: "center" }}>
//                     <input
//                       type="checkbox"
//                       onChange={(e) => setSelectAllVisible(e.target.checked)}
//                       checked={filtered.length > 0 && selectedIds.size === filtered.length}
//                       title="Select / deselect all visible"
//                     />
//                   </th>

//                   <th style={{ width: 40 }}>#</th>
//                   <th style={{ minWidth: 140 }}>SRN</th>
//                   <th style={{ minWidth: 220 }}>Name</th>
//                   <th style={{ minWidth: 160 }}>Father</th>
//                   <th style={{ width: 110 }}>DOB</th>
//                   <th style={{ width: 120 }}>Mobile</th>
//                   <th style={{ minWidth: 220 }}>School</th>
//                   <th style={{ width: 90 }}>Verified</th>
//                   <th style={{ width: 100 }}>Photo</th>
//                   <th style={{ width: 150 }}>Admit Card</th>

//                   {/* right-most checkbox column with select-all toggle button */}
//                   <th style={{ width: 90, textAlign: "center" }}>
//                     <Button size="sm" variant="outline-primary" onClick={toggleRightHeaderSelectAll}>
//                       {rightSelectAllToggle || (filtered.length > 0 && selectedIds.size === filtered.length) ? "Deselect" : "Select All"}
//                     </Button>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((s, idx) => (
//                   <tr key={s._id || idx}>
//                     {/* left checkbox */}
//                     <td style={{ textAlign: "center" }}>
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.has(s._id)}
//                         onChange={() => toggleSelect(s._id)}
//                         title="Select student"
//                       />
//                     </td>

//                     <td>{idx + 1}</td>
//                     <td>{s.srn ?? "-"}</td>
//                     <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{s.name ?? "-"}</td>
//                     <td>{s.father ?? "-"}</td>
//                     <td>{s.dob ? new Date(s.dob).toLocaleDateString() : "-"}</td>
//                     <td>{s.mobile ?? "-"}</td>
//                     <td style={{ maxWidth: 220, whiteSpace: "normal", wordBreak: "break-word" }}>{s.school ?? "-"}</td>
//                     <td>{s.isVerified ?? s.ui_isVerified ?? "-"}</td>
//                     <td>
//                       {s.imageUrl ? <img src={s.imageUrl} alt={s.name || "photo"} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} /> : (s.image ? <span>{s.image}</span> : "-")}
//                     </td>

//                     <td>
//                       <Button size="sm" variant="primary" onClick={() => startSingleDownload(s)}>Download Admit Card</Button>
//                     </td>

//                     {/* right-most checkbox (same action) */}
//                     <td style={{ textAlign: "center" }}>
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.has(s._id)}
//                         onChange={() => toggleSelect(s._id)}
//                         title="Select student (right)"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}

//       {/* If bulkDownload exists and user triggered bulk run (showBulkRunner true), render Level1AdmitCard which auto-runs */}
//       {showBulkRunner && Array.isArray(bulkDownload) && bulkDownload.length > 0 && (
//         <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
//           <Card className="p-2 shadow">
//             <div style={{ minWidth: 320 }}>
//               <div><strong>{bulkDownload.length}</strong> students queued — generating ZIP...</div>
//               <div className="mt-2">
//                 <Level1AdmitCard
//                   // Level1AdmitCard will auto-run on mount when bulkDownload is present.
//                   onDone={() => {
//                     // hide runner and clear selected ids & bulk context after completion
//                     setShowBulkRunner(false);
//                     setSelectedIds(new Set());
//                     setBulkDownload(null);
//                     setRightSelectAllToggle(false);
//                     // refresh data or show toast if needed
//                   }}
//                 />
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Single-student mode: show Level1AdmitCard when requested */}
//       {showSingleStudent && (
//         <div style={{ position: "fixed", left: 20, bottom: 20, zIndex: 9999 }}>
//           <Card className="p-2 shadow">
//             <Level1AdmitCard singleStudent={showSingleStudent} onDone={() => setShowSingleStudent(null)} />
//           </Card>
//         </div>
//       )}
//     </Container>
//   );
// };














// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Badge,
//   Table,
//   Form,
//   InputGroup,
//   Spinner,
// } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { GetStudentsRegisteredByUser } from "../../services/DashBoardServices/DashboardService";
// import { BulkDownloadContext } from "../ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi";
// import { Level1AdmitCard } from "../StudentRegistration/Level1AdmitCard";
// import { AcknowledgementSlipComponent } from "../StudentRegistration/AcknowledgementSlip";

// export const RegisteredStudentsByUsers = () => {
//   const { userData } = useContext(UserContext);
//   const { bulkDownload, setBulkDownload } = useContext(BulkDownloadContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   let studentClass;
//   if (location.pathname === "/user-registered-students-mb") studentClass = "8";
//   else if (location.pathname === "/user-registered-students-sh") studentClass = "10";

//   const [loading, setLoading] = useState(false);
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState(null);

//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [showSingleAdmitRunner, setShowSingleAdmitRunner] = useState(null); // student obj
//   const [showSingleAckRunner, setShowSingleAckRunner] = useState(null); // student obj

//   // Bulk orchestration:
//   // bulkMode: 'idle' | 'admit' | 'ack' | 'admit-both' | 'ack-after-admit'
//   const [bulkMode, setBulkMode] = useState("idle");
//   const [bulkRows, setBulkRows] = useState(null); // local copy for re-using in "both" flow
//   const [showBulkRunner, setShowBulkRunner] = useState(false);
//   const [rightSelectAllToggle, setRightSelectAllToggle] = useState(false);

//   // fetch
//   const fetchRegisteredStudentsData = async () => {
//     if (!userData?.user?._id) return;
//     setLoading(true);
//     setError(null);
//     const reqBody = { _id: userData.user._id, classOfStudent: studentClass };
//     try {
//       const response = await GetStudentsRegisteredByUser(reqBody);
//       let payload = null;
//       if (Array.isArray(response)) payload = response;
//       else if (response && Array.isArray(response.data)) payload = response.data;
//       else if (response && response.data && Array.isArray(response.data.data)) payload = response.data.data;
//       setStudents(payload || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to fetch students");
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRegisteredStudentsData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userData?.user?._id, location.pathname]);

//   const filtered = students.filter((s) => {
//     if (!search) return true;
//     const q = search.toLowerCase();
//     return (
//       String(s.name || "").toLowerCase().includes(q) ||
//       String(s.srn || "").toLowerCase().includes(q) ||
//       String(s.mobile || "").toLowerCase().includes(q)
//     );
//   });

//   const toggleSelect = (id) => {
//     setSelectedIds((prev) => {
//       const copy = new Set(prev);
//       if (copy.has(id)) copy.delete(id);
//       else copy.add(id);
//       return copy;
//     });
//     setRightSelectAllToggle(false);
//   };

//   const setSelectAllVisible = (checked) => {
//     if (checked) {
//       setSelectedIds(new Set(filtered.map((s) => s._id)));
//       setRightSelectAllToggle(true);
//     } else {
//       setSelectedIds(new Set());
//       setRightSelectAllToggle(false);
//     }
//   };

//   const toggleRightHeaderSelectAll = () => {
//     const shouldSelect = !rightSelectAllToggle;
//     setSelectAllVisible(shouldSelect);
//   };

//   // per-row single downloads
//   const startSingleAdmitDownload = (student) => {
//     // open Level1AdmitCard single runner
//     setShowSingleAdmitRunner(student);
//   };

//   const startSingleAckDownload = (student) => {
//     setShowSingleAckRunner(student);
//   };

//   // Bulk actions
//   const handleBulkAdmitClick = () => {
//     if (selectedIds.size === 0) {
//       alert("Select at least one student to bulk download.");
//       return;
//     }
//     const rows = students.filter((s) => selectedIds.has(s._id));
//     setBulkRows(rows);
//     setBulkMode("admit");
//     setBulkDownload(rows); // context used by Level1AdmitCard to auto-run
//     setShowBulkRunner(true);
//   };

//   const handleBulkAckClick = () => {
//     if (selectedIds.size === 0) {
//       alert("Select at least one student to bulk generate acknowledgement slip.");
//       return;
//     }
//     const rows = students.filter((s) => selectedIds.has(s._id));
//     setBulkRows(rows);
//     setBulkMode("ack");
//     setBulkDownload(rows); // context used by AcknowledgementSlipBulk to auto-run
//     setShowBulkRunner(true);
//   };

//   // run both: admit first then ack
//   const handleBulkBothClick = () => {
//     if (selectedIds.size === 0) {
//       alert("Select at least one student to bulk download both files.");
//       return;
//     }
//     const rows = students.filter((s) => selectedIds.has(s._id));
//     setBulkRows(rows);
//     setBulkMode("admit-both");
//     setBulkDownload(rows); // Level1AdmitCard will run first
//     setShowBulkRunner(true);
//   };

//   // called when Level1AdmitCard finishes (onDone) in bulk flows
//   const onAdmitBulkDone = () => {
//     if (bulkMode === "admit-both") {
//       // now run ack: re-inject rows into context and render ack runner
//       setBulkMode("ack-after-admit");
//       // re-inject
//       setBulkDownload(bulkRows);
//       // render will switch to AcknowledgementSlipBulk (see render below)
//     } else {
//       // normal admit-only finish
//       setBulkMode("idle");
//       setShowBulkRunner(false);
//       setSelectedIds(new Set());
//       setBulkRows(null);
//       setBulkDownload(null);
//       setRightSelectAllToggle(false);
//     }
//   };

//   const onAckBulkDone = () => {
//     // after ack run (either ack-only or ack-after-admit)
//     setBulkMode("idle");
//     setShowBulkRunner(false);
//     setSelectedIds(new Set());
//     setBulkRows(null);
//     setBulkDownload(null);
//     setRightSelectAllToggle(false);
//   };

//   const clearBulk = () => {
//     setBulkRows(null);
//     setBulkMode("idle");
//     setShowBulkRunner(false);
//     setBulkDownload(null);
//     setSelectedIds(new Set());
//     setRightSelectAllToggle(false);
//     alert("Bulk queue cleared.");
//   };

//   return (
//     <Container fluid className="py-3">
//       <Row className="align-items-center mb-3">
//         <Col>
//           <h4 style={{ margin: 0 }}>{studentClass ? `Class ${studentClass} Data` : "Registered Students"}</h4>
//           <small className="text-muted">List of registered students you created</small>
//         </Col>

//         {/* Top controls: Refresh + Bulk Downloads */}
//         <Col xs="auto" className="d-flex gap-2">
//           <Button variant="outline-secondary" size="sm" onClick={fetchRegisteredStudentsData}>Refresh</Button>

//           <Button
//             variant="success"
//             size="sm"
//             onClick={handleBulkAdmitClick}
//             disabled={selectedIds.size === 0}
//             title="Download selected students' admit cards as ZIP"
//           >
//             {selectedIds.size === 0 ? "Bulk Admit" : `Bulk Admit (${selectedIds.size})`}
//           </Button>

//           <Button
//             variant="info"
//             size="sm"
//             onClick={handleBulkAckClick}
//             disabled={selectedIds.size === 0}
//             title="Download selected students' acknowledgement slips as ZIP"
//           >
//             {selectedIds.size === 0 ? "Bulk Ack" : `Bulk Ack (${selectedIds.size})`}
//           </Button>

//           <Button
//             variant="primary"
//             size="sm"
//             onClick={handleBulkBothClick}
//             disabled={selectedIds.size === 0}
//             title="Generate admit cards and acknowledgement slips (both) as ZIPs sequentially"
//           >
//             {selectedIds.size === 0 ? "Bulk Both" : `Bulk Both (${selectedIds.size})`}
//           </Button>

//           <Button variant="outline-danger" size="sm" onClick={clearBulk}>Clear Bulk</Button>
//         </Col>
//       </Row>

//       <Card className="mb-3">
//         <Card.Body>
//           <Row className="g-2 align-items-center">
//             <Col md={6}>
//               <InputGroup>
//                 <Form.Control placeholder="Search by name, SRN or mobile..." value={search} onChange={(e) => setSearch(e.target.value)} />
//                 <Button variant="outline-secondary" onClick={() => setSearch("")}>Clear</Button>
//               </InputGroup>
//             </Col>
//             <Col md={6} className="text-end">
//               <Badge bg="primary" pill style={{ fontSize: 14 }}>Total: {students.length}</Badge>{" "}
//               <Badge bg="success" pill style={{ fontSize: 14 }}>Showing: {filtered.length}</Badge>
//             </Col>
//           </Row>
//         </Card.Body>
//         <Card.Footer />
//       </Card>

//       {loading ? (
//         <div className="text-center py-5"><Spinner animation="border" /></div>
//       ) : error ? (
//         <Card className="mb-3"><Card.Body><p className="text-danger">Error: {error}</p></Card.Body></Card>
//       ) : filtered.length === 0 ? (
//         <Card className="mb-3"><Card.Body><p className="mb-0">No registered students found.</p></Card.Body></Card>
//       ) : (
//         <Card>
//           <Card.Body style={{ overflowX: "auto" }}>
//             <Table striped bordered hover responsive className="align-middle">
//               <thead>
//                 <tr>
//                   <th style={{ width: 40, textAlign: "center" }}>
//                     <input
//                       type="checkbox"
//                       onChange={(e) => setSelectAllVisible(e.target.checked)}
//                       checked={filtered.length > 0 && selectedIds.size === filtered.length}
//                       title="Select / deselect all visible"
//                     />
//                   </th>
//                   <th style={{ width: 40 }}>#</th>
//                   <th style={{ minWidth: 140 }}>SRN</th>
//                   <th style={{ minWidth: 220 }}>Name</th>
//                   <th style={{ minWidth: 160 }}>Father</th>
//                   <th style={{ width: 110 }}>DOB</th>
//                   <th style={{ width: 120 }}>Mobile</th>
//                   <th style={{ minWidth: 220 }}>School</th>
//                   <th style={{ width: 90 }}>Verified</th>
//                   <th style={{ width: 100 }}>Photo</th>
//                   <th style={{ width: 150 }}>Admit Card</th>
//                   <th style={{ width: 160 }}>Acknowledgement Slip</th>
//                   <th style={{ width: 90, textAlign: "center" }}>
//                     <Button size="sm" variant="outline-primary" onClick={toggleRightHeaderSelectAll}>
//                       {rightSelectAllToggle || (filtered.length > 0 && selectedIds.size === filtered.length) ? "Deselect" : "Select All"}
//                     </Button>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((s, idx) => (
//                   <tr key={s._id || idx}>
//                     <td style={{ textAlign: "center" }}>
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.has(s._id)}
//                         onChange={() => toggleSelect(s._id)}
//                         title="Select student"
//                       />
//                     </td>

//                     <td>{idx + 1}</td>
//                     <td>{s.srn ?? "-"}</td>
//                     <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{s.name ?? "-"}</td>
//                     <td>{s.father ?? "-"}</td>
//                     <td>{s.dob ? new Date(s.dob).toLocaleDateString() : "-"}</td>
//                     <td>{s.mobile ?? "-"}</td>
//                     <td style={{ maxWidth: 220, whiteSpace: "normal", wordBreak: "break-word" }}>{s.school ?? "-"}</td>
//                     <td>{s.isVerified ?? s.ui_isVerified ?? "-"}</td>
//                     <td>
//                       {s.imageUrl ? (
//                         <img src={s.imageUrl} alt={s.name || "photo"} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} />
//                       ) : (s.image ? <span>{s.image}</span> : "-")}
//                     </td>

//                     <td>
//                       <Button size="sm" variant="primary" onClick={() => startSingleAdmitDownload(s)}>Download Admit Card</Button>
//                     </td>

//                     <td>
//                       <Button size="sm" variant="info" onClick={() => startSingleAckDownload(s)}>Download Acknowledgement</Button>
//                     </td>

//                     <td style={{ textAlign: "center" }}>
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.has(s._id)}
//                         onChange={() => toggleSelect(s._id)}
//                         title="Select student (right)"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}

//       {/* ---------- Bulk runner area (admit / ack / both) ---------- */}
//       {showBulkRunner && bulkMode !== "idle" && (
//         <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
//           <Card className="p-2 shadow">
//             <div style={{ minWidth: 360 }}>
//               <div>
//                 <strong>{(bulkRows && bulkRows.length) || (bulkDownload && bulkDownload.length) || 0}</strong>
//                 {" "}students queued — running <strong>{bulkMode === "admit" ? "Admit" : bulkMode === "ack" ? "Acknowledgement" : bulkMode === "admit-both" ? "Admit → Ack (both)" : bulkMode === "ack-after-admit" ? "Acknowledgement (second pass)" : bulkMode}</strong>
//               </div>
//               <div className="mt-2">
//                 {/* Render Level1AdmitCard when bulkMode is admit OR when starting admit-both */}
//                 {(bulkMode === "admit" || bulkMode === "admit-both") && (
//                   <Level1AdmitCard
//                     // Level1AdmitCard auto-runs on mount when bulkDownload context is present
//                     onDone={() => {
//                       // Level1AdmitCard clears bulkDownload on its own — we orchestrate next step
//                       onAdmitBulkDone();
//                     }}
//                   />
//                 )}

//                 {/* Render acknowledgement runner when bulkMode is ack OR ack-after-admit */}
//                 {(bulkMode === "ack" || bulkMode === "ack-after-admit") && (
//                   <AcknowledgementSlipComponent
//                     onDone={() => {
//                       onAckBulkDone();
//                     }}
//                   />
//                 )}
//               </div>

//               <div className="d-flex gap-2 mt-2">
//                 <Button size="sm" variant="outline-secondary" onClick={() => { setShowBulkRunner(false); }}>
//                   Hide
//                 </Button>
//                 <Button size="sm" variant="outline-danger" onClick={() => { clearBulk(); setShowBulkRunner(false); }}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* ---------- Single-runner modals (only mounted when requested) ---------- */}
//       {showSingleAdmitRunner && (
//         <div style={{ position: "fixed", left: 20, bottom: 20, zIndex: 9999 }}>
//           <Card className="p-2 shadow">
//             <Level1AdmitCard
//               singleStudent={showSingleAdmitRunner}
//               onDone={() => {
//                 setShowSingleAdmitRunner(null);
//               }}
//             />
//           </Card>
//         </div>
//       )}

//       {showSingleAckRunner && (
//         <div style={{ position: "fixed", left: 20, bottom: 20, zIndex: 9999 }}>
//           <Card className="p-2 shadow">
//             <AcknowledgementSlipComponent
//               singleStudent={showSingleAckRunner}
//               onDone={() => {
//                 setShowSingleAckRunner(null);
//               }}
//             />
//           </Card>
//         </div>
//       )}
//     </Container>
//   );
// };





import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../NewContextApis/UserContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { GetStudentsRegisteredByUser } from "../../services/DashBoardServices/DashboardService";
import { BulkDownloadContext } from "../ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi";
import { Level1AdmitCard } from "../StudentRegistration/Level1AdmitCard";
import { AcknowledgementSlipComponent } from "../StudentRegistration/AcknowledgementSlip";

export const RegisteredStudentsByUsers = () => {
  const { userData } = useContext(UserContext);
  const { bulkDownload, setBulkDownload } = useContext(BulkDownloadContext);
  const navigate = useNavigate();
  const location = useLocation();

  let studentClass;
  if (location.pathname === "/user-registered-students-mb") studentClass = "8";
  else if (location.pathname === "/user-registered-students-sh") studentClass = "10";

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showSingleAdmitRunner, setShowSingleAdmitRunner] = useState(null); // student obj
  const [showSingleAckRunner, setShowSingleAckRunner] = useState(null); // student obj

  // Bulk orchestration:
  // bulkMode: 'idle' | 'admit' | 'ack' | 'admit-both' | 'ack-after-admit'
  const [bulkMode, setBulkMode] = useState("idle");
  const [bulkRows, setBulkRows] = useState(null); // local copy for re-using in "both" flow
  const [showBulkRunner, setShowBulkRunner] = useState(false);
  const [rightSelectAllToggle, setRightSelectAllToggle] = useState(false);

  // NEW: Separate states for single downloads
  const [singleAdmitDownload, setSingleAdmitDownload] = useState(null);
  const [singleAckDownload, setSingleAckDownload] = useState(null);

  // fetch
  const fetchRegisteredStudentsData = async () => {
    if (!userData?.user?._id) return;
    setLoading(true);
    setError(null);
    const reqBody = { _id: userData.user._id, classOfStudent: studentClass };
    try {
      const response = await GetStudentsRegisteredByUser(reqBody);
      let payload = null;
      if (Array.isArray(response)) payload = response;
      else if (response && Array.isArray(response.data)) payload = response.data;
      else if (response && response.data && Array.isArray(response.data.data)) payload = response.data.data;
      setStudents(payload || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredStudentsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.user?._id, location.pathname]);

  const filtered = students.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(s.name || "").toLowerCase().includes(q) ||
      String(s.srn || "").toLowerCase().includes(q) ||
      String(s.mobile || "").toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
    setRightSelectAllToggle(false);
  };

  const setSelectAllVisible = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filtered.map((s) => s._id)));
      setRightSelectAllToggle(true);
    } else {
      setSelectedIds(new Set());
      setRightSelectAllToggle(false);
    }
  };

  const toggleRightHeaderSelectAll = () => {
    const shouldSelect = !rightSelectAllToggle;
    setSelectAllVisible(shouldSelect);
  };

  // per-row single downloads - UPDATED to use bulk download mechanism
  const startSingleAdmitDownload = (student) => {
    // Set single download data to trigger auto-download
    setSingleAdmitDownload([student]);
    setShowSingleAdmitRunner(true);
  };

  const startSingleAckDownload = (student) => {
    // Set single download data to trigger auto-download
    setSingleAckDownload([student]);
    setShowSingleAckRunner(true);
  };

  // Bulk actions
  const handleBulkAdmitClick = () => {
    if (selectedIds.size === 0) {
      alert("Select at least one student to bulk download.");
      return;
    }
    const rows = students.filter((s) => selectedIds.has(s._id));
    setBulkRows(rows);
    setBulkMode("admit");
    setBulkDownload(rows); // context used by Level1AdmitCard to auto-run
    setShowBulkRunner(true);
  };

  const handleBulkAckClick = () => {
    if (selectedIds.size === 0) {
      alert("Select at least one student to bulk generate acknowledgement slip.");
      return;
    }
    const rows = students.filter((s) => selectedIds.has(s._id));
    setBulkRows(rows);
    setBulkMode("ack");
    setBulkDownload(rows); // context used by AcknowledgementSlipBulk to auto-run
    setShowBulkRunner(true);
  };

  // run both: admit first then ack
  const handleBulkBothClick = () => {
    if (selectedIds.size === 0) {
      alert("Select at least one student to bulk download both files.");
      return;
    }
    const rows = students.filter((s) => selectedIds.has(s._id));
    setBulkRows(rows);
    setBulkMode("admit-both");
    setBulkDownload(rows); // Level1AdmitCard will run first
    setShowBulkRunner(true);
  };

  // called when Level1AdmitCard finishes (onDone) in bulk flows
  const onAdmitBulkDone = () => {
    if (bulkMode === "admit-both") {
      // now run ack: re-inject rows into context and render ack runner
      setBulkMode("ack-after-admit");
      // re-inject
      setBulkDownload(bulkRows);
      // render will switch to AcknowledgementSlipBulk (see render below)
    } else {
      // normal admit-only finish
      setBulkMode("idle");
      setShowBulkRunner(false);
      setSelectedIds(new Set());
      setBulkRows(null);
      setBulkDownload(null);
      setRightSelectAllToggle(false);
    }
  };

  const onAckBulkDone = () => {
    // after ack run (either ack-only or ack-after-admit)
    setBulkMode("idle");
    setShowBulkRunner(false);
    setSelectedIds(new Set());
    setBulkRows(null);
    setBulkDownload(null);
    setRightSelectAllToggle(false);
  };

  const clearBulk = () => {
    setBulkRows(null);
    setBulkMode("idle");
    setShowBulkRunner(false);
    setBulkDownload(null);
    setSelectedIds(new Set());
    setRightSelectAllToggle(false);
    alert("Bulk queue cleared.");
  };

  return (
    <Container fluid className="py-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h4 style={{ margin: 0 }}>{studentClass ? `Class ${studentClass} Data` : "Registered Students"}</h4>
          <small className="text-muted">List of registered students you created</small>
        </Col>

        {/* Top controls: Refresh + Bulk Downloads */}
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={fetchRegisteredStudentsData}>Refresh</Button>

          <Button
            variant="success"
            size="sm"
            onClick={handleBulkAdmitClick}
            disabled={selectedIds.size === 0}
            title="Download selected students' admit cards as ZIP"
          >
            {selectedIds.size === 0 ? "Bulk Admit" : `Bulk Admit (${selectedIds.size})`}
          </Button>

          <Button
            variant="info"
            size="sm"
            onClick={handleBulkAckClick}
            disabled={selectedIds.size === 0}
            title="Download selected students' acknowledgement slips as ZIP"
          >
            {selectedIds.size === 0 ? "Bulk Ack" : `Bulk Ack (${selectedIds.size})`}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleBulkBothClick}
            disabled={selectedIds.size === 0}
            title="Generate admit cards and acknowledgement slips (both) as ZIPs sequentially"
          >
            {selectedIds.size === 0 ? "Bulk Both" : `Bulk Both (${selectedIds.size})`}
          </Button>

          <Button variant="outline-danger" size="sm" onClick={clearBulk}>Clear Bulk</Button>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-2 align-items-center">
            <Col md={6}>
              <InputGroup>
                <Form.Control placeholder="Search by name, SRN or mobile..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button variant="outline-secondary" onClick={() => setSearch("")}>Clear</Button>
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="primary" pill style={{ fontSize: 14 }}>Total: {students.length}</Badge>{" "}
              {/* <Badge bg="success" pill style={{ fontSize: 14 }}>Showing: {filtered.length}</Badge> */}
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer />
      </Card>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : error ? (
        <Card className="mb-3"><Card.Body><p className="text-danger">Error: {error}</p></Card.Body></Card>
      ) : filtered.length === 0 ? (
        <Card className="mb-3"><Card.Body><p className="mb-0">No registered students found.</p></Card.Body></Card>
      ) : (
        <Card>
          <Card.Body style={{ overflowX: "auto" }}>
            <Table striped bordered hover responsive className="align-middle">
              <thead>
                <tr>
                  <th style={{ width: 40, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      onChange={(e) => setSelectAllVisible(e.target.checked)}
                      checked={filtered.length > 0 && selectedIds.size === filtered.length}
                      title="Select / deselect all visible"
                    />
                  </th>
                  <th style={{ width: 40 }}>#</th>
                  <th style={{ minWidth: 140 }}>SRN</th>
                  <th style={{ minWidth: 220 }}>Name</th>
                  <th style={{ minWidth: 160 }}>Father</th>
                  <th style={{ width: 110 }}>DOB</th>
                  <th style={{ width: 120 }}>Mobile</th>
                  <th style={{ minWidth: 220 }}>School</th>
                  <th style={{ width: 90 }}>Verified</th>
                  <th style={{ width: 100 }}>Photo</th>
                  <th style={{ width: 150 }}>Admit Card</th>
                  <th style={{ width: 160 }}>Acknowledgement Slip</th>
                  <th style={{ width: 90, textAlign: "center" }}>
                    <Button size="sm" variant="outline-primary" onClick={toggleRightHeaderSelectAll}>
                      {rightSelectAllToggle || (filtered.length > 0 && selectedIds.size === filtered.length) ? "Deselect" : "Select All"}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={s._id || idx}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(s._id)}
                        onChange={() => toggleSelect(s._id)}
                        title="Select student"
                      />
                    </td>

                    <td>{idx + 1}</td>
                    <td>{s.srn ?? "-"}</td>
                    <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{s.name ?? "-"}</td>
                    <td>{s.father ?? "-"}</td>
                    <td>{s.dob ? new Date(s.dob).toLocaleDateString() : "-"}</td>
                    <td>{s.mobile ?? "-"}</td>
                    <td style={{ maxWidth: 220, whiteSpace: "normal", wordBreak: "break-word" }}>{s.school ?? "-"}</td>
                    <td>{s.isVerified ?? s.ui_isVerified ?? "-"}</td>
                    <td>
                      {s.imageUrl ? (
                        <img src={s.imageUrl} alt={s.name || "photo"} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} />
                      ) : (s.image ? <span>{s.image}</span> : "-")}
                    </td>

                    <td>
                      <Button size="sm" variant="primary" onClick={() => startSingleAdmitDownload(s)}>Download Admit Card</Button>
                    </td>

                    <td>
                      <Button size="sm" variant="info" onClick={() => startSingleAckDownload(s)}>Download Acknowledgement</Button>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(s._id)}
                        onChange={() => toggleSelect(s._id)}
                        title="Select student (right)"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* ---------- Bulk runner area (admit / ack / both) ---------- */}
      {showBulkRunner && bulkMode !== "idle" && (
        <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
          <Card className="p-2 shadow">
            <div style={{ minWidth: 360 }}>
              <div>
                <strong>{(bulkRows && bulkRows.length) || (bulkDownload && bulkDownload.length) || 0}</strong>
                {" "}students queued — running <strong>{bulkMode === "admit" ? "Admit" : bulkMode === "ack" ? "Acknowledgement" : bulkMode === "admit-both" ? "Admit → Ack (both)" : bulkMode === "ack-after-admit" ? "Acknowledgement (second pass)" : bulkMode}</strong>
              </div>
              <div className="mt-2">
                {/* Render Level1AdmitCard when bulkMode is admit OR when starting admit-both */}
                {(bulkMode === "admit" || bulkMode === "admit-both") && (
                  <Level1AdmitCard
                    // Level1AdmitCard auto-runs on mount when bulkDownload context is present
                    onDone={() => {
                      // Level1AdmitCard clears bulkDownload on its own — we orchestrate next step
                      onAdmitBulkDone();
                    }}
                  />
                )}

                {/* Render acknowledgement runner when bulkMode is ack OR ack-after-admit */}
                {(bulkMode === "ack" || bulkMode === "ack-after-admit") && (
                  <AcknowledgementSlipComponent
                    onDone={() => {
                      onAckBulkDone();
                    }}
                  />
                )}
              </div>

              <div className="d-flex gap-2 mt-2">
                <Button size="sm" variant="outline-secondary" onClick={() => { setShowBulkRunner(false); }}>
                  Hide
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => { clearBulk(); setShowBulkRunner(false); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ---------- Single-runner area (hidden but functional) ---------- */}
      {/* Single Admit Card Runner - Hidden but functional */}
      {showSingleAdmitRunner && (
        <div style={{ position: "absolute", left: -9999, opacity: 0 }}>
          <Level1AdmitCard
            bulkDownload={singleAdmitDownload}
            onDone={() => {
              setShowSingleAdmitRunner(false);
              setSingleAdmitDownload(null);
            }}
          />
        </div>
      )}

      {/* Single Acknowledgement Runner - Hidden but functional */}
      {showSingleAckRunner && (
        <div style={{ position: "absolute", left: -9999, opacity: 0 }}>
          <AcknowledgementSlipComponent
            bulkDownload={singleAckDownload}
            onDone={() => {
              setShowSingleAckRunner(false);
              setSingleAckDownload(null);
            }}
          />
        </div>
      )}
    </Container>
  );
};