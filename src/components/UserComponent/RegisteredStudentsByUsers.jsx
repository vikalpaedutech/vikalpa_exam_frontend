
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
















import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../NewContextApis/UserContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Badge,
  Table,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { GetStudentsRegisteredByUser } from "../../services/DashBoardServices/DashboardService";

export const RegisteredStudentsByUsers = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  let studentClass;
  if (location.pathname === "/user-registered-students-mb") {
    studentClass = "8";
  } else if (location.pathname === "/user-registered-students-sh") {
    studentClass = "10";
  }

  // UI state
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  // Derived header title
  const getHeaderTitle = () => {
    if (!students || students.length === 0) {
      return studentClass ? `Class ${studentClass} Data` : "Registered Students";
    }
    const uniqueClasses = Array.from(
      new Set(students.map((s) => s.classOfStudent).filter(Boolean))
    );
    if (uniqueClasses.length === 1) return `Class ${uniqueClasses[0]} Data`;
    if (studentClass) return `Class ${studentClass} Data`;
    return "Registered Students";
  };

  // Format date (for DOB/reg date fallback)
  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      if (isNaN(dt)) return String(d);
      return dt.toLocaleDateString();
    } catch {
      return String(d);
    }
  };

  // Fetch students
  const fetchRegisteredStudentsData = async () => {
    if (!userData?.user?._id) return;
    setLoading(true);
    setError(null);

    const reqBody = {
      _id: userData.user._id,
      classOfStudent: studentClass,
    };

    try {
      const response = await GetStudentsRegisteredByUser(reqBody);

      // Normalize response shapes:
      let payload = null;
      if (Array.isArray(response)) {
        payload = response;
      } else if (response && Array.isArray(response.data)) {
        payload = response.data;
      } else if (
        response &&
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        payload = response.data.data;
      } else if (response && Array.isArray(response?.data?.data)) {
        payload = response.data.data;
      }

      if (payload) {
        setStudents(payload);
      } else {
        if (response && response.data && Array.isArray(response.data)) {
          setStudents(response.data);
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          setStudents(response.data.data);
        } else {
          setStudents([]);
          console.warn("GetStudentsRegisteredByUser returned no array:", response);
        }
      }
    } catch (err) {
      console.error("Error fetching registered students:", err);
      setError(err.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredStudentsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.user?._id, location.pathname]);

  // client-side filtered list
  const filtered = students.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(s.name || "").toLowerCase().includes(q) ||
      String(s.srn || "").toLowerCase().includes(q) ||
      String(s.mobile || "").toLowerCase().includes(q)
    );
  });

  // Download admit card handler — simple alert for now
  const handleDownloadAdmitCard = (row) => {
    // window.alert(`Download admit card for ${row.name || row.srn || "student"}`);

    window.alert(`Available for downloading soon.`);
  };

  return (
    <Container fluid className="py-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h4 style={{ margin: 0 }}>{getHeaderTitle()}</h4>
          <small className="text-muted">List of registered students you created</small>
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" size="sm" onClick={fetchRegisteredStudentsData}>
            Refresh
          </Button>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-2 align-items-center">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Search by name, SRN or mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={() => setSearch("")}>
                  Clear
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="primary" pill style={{ fontSize: 14 }}>
                Total: {students.length}
              </Badge>{" "}
              <Badge bg="success" pill style={{ fontSize: 14 }}>
                Showing: {filtered.length}
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Card className="mb-3">
          <Card.Body>
            <p className="text-danger">Error: {error}</p>
          </Card.Body>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="mb-3">
          <Card.Body>
            <p className="mb-0">No registered students found.</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body style={{ overflowX: "auto" }}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>SRN</th>
                  <th>Name</th>
                  <th>Father</th>
                  <th>DOB</th>
                  <th>Mobile</th>
                  <th>School</th>
                  <th>Verified</th>
                  <th>Photo</th>
                  <th>Admit Card</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={s._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{s.srn ?? "-"}</td>
                    <td>{s.name ?? "-"}</td>
                    <td>{s.father ?? "-"}</td>
                    <td>{formatDate(s.dob ?? s.registrationDate ?? s.createdAt)}</td>
                    <td>{s.mobile ?? "-"}</td>
                    <td style={{ maxWidth: 220 }}>{s.school ?? "-"}</td>
                    <td>{s.isVerified ?? s.ui_isVerified ?? "-"}</td>
                    <td>
                      {s.imageUrl ? (
                        <img
                          src={s.imageUrl}
                          alt={s.name || "photo"}
                          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : s.image ? (
                        <span>{s.image}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td style={{ whiteSpace: "nowrap", minWidth: 150 }}>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleDownloadAdmitCard(s)}
                        style={{ whiteSpace: "nowrap", minWidth: 130 }}
                      >
                        Download Admit Card
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};
