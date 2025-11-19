// import React, {useState, useEffect, useContext} from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import { Container, Row, Col, Card, Button, ListGroup, Badge, Table, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { GetStudentsRegisteredByUserCount } from "../../services/DashBoardServices/DashboardService";

// export const UserDashBoard = () =>{
//   const { userData, setUserData } = useContext(UserContext); // ✅ use context
//   const navigate = useNavigate();

//   // Small helpers / placeholders — you can replace with real data later
//   const [search, setSearch] = useState("");
//   const recentRegs = userData?.recentRegistrations || []; // optional array if you populate it
//   const stats = {
//     totalRegistered: userData?.stats?.totalRegistered ?? "-",
//     class8: userData?.stats?.class8 ?? "-",
//     class10: userData?.stats?.class10 ?? "-",
//     pending: userData?.stats?.pending ?? "-",
//   };

//   useEffect(() => {
//     // Example: you may fetch dashboard-specific data here later
//   }, []);


//   console.log(userData)

//   //Functions for showing logged in user registrations count

//   const fetchUserRegisteredCounts = async () =>{

//     const reqBody = {
//         _id: userData?.user?._id
//     }

//     try {
//         const response = await GetStudentsRegisteredByUserCount(reqBody)
//         console.log(response.data)
//     } catch (error) {
//         console.log("Error fetching count", error)
//     }
//   }
//   useEffect(()=>{
//     fetchUserRegisteredCounts()
//   }, [])

//   return(
//     <Container fluid className="py-4">
     

//       {/* Stats row */}
//       <Row className="mb-4 g-3">
//         <Col sm={6} md={3}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-start">
//                 <div>
//                   <small className="text-muted">Total Registered</small>
//                   <h4 className="mt-2">{stats.totalRegistered}</h4>
//                 </div>
//                 <Badge bg="primary" pill style={{ fontSize: 14, padding: "10px 12px" }}>
//                   All
//                 </Badge>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col sm={6} md={3}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-start">
//                 <div>
//                   <small className="text-muted">Class 8</small>
//                   <h4 className="mt-2">{stats.class8}</h4>
//                 </div>
//                 <Badge bg="success" pill style={{ fontSize: 14, padding: "10px 12px" }}>
//                   8
//                 </Badge>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col sm={6} md={3}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-start">
//                 <div>
//                   <small className="text-muted">Class 10</small>
//                   <h4 className="mt-2">{stats.class10}</h4>
//                 </div>
//                 <Badge bg="info" pill style={{ fontSize: 14, padding: "10px 12px" }}>
//                   10
//                 </Badge>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col sm={6} md={3}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-start">
//                 <div>
//                   <small className="text-muted">Pending Verifications</small>
//                   <h4 className="mt-2">{stats.pending}</h4>
//                 </div>
//                 <Badge bg="warning" pill style={{ fontSize: 14, padding: "10px 12px", color: "#212529" }}>
//                   Pending
//                 </Badge>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Main content: actions + recent */}
//       <Row className="g-4">
//         {/* Left: Actions */}
//         <Col lg={4}>
//           <Card className="shadow-sm h-100" style={{width:'95vw'}}>
//             <Card.Header className="bg-white">
//               <h5 style={{ margin: 0 }}>Registration For Session 2026-28</h5>
//               <small className="text-muted">Use Below Links for Registrations</small>
//             </Card.Header>
//             <Card.Body>
//               <ListGroup variant="flush">
//                 <ListGroup.Item className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <strong>Class 8 Individual Students Registration. (कक्षा 8 के विद्यार्थियों का लेवल 1 परीक्षा पंजीकरण करने के लिए फ़ॉर्म खोलें।)</strong>
                    
//                   </div>
//                   <div>
//                     <Button size="sm" variant="outline-primary" onClick={() => navigate("/user-student-signin-mb")}>Open</Button>
//                   </div>
//                 </ListGroup.Item>

//                 <ListGroup.Item className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <strong>Class 10 Individual Students Registration. (कक्षा 10 के विद्यार्थियों का लेवल 1 परीक्षा पंजीकरण करने के लिए फ़ॉर्म खोलें।)</strong>
                    
//                   </div>
//                   <div>
//                     <Button size="sm" variant="outline-primary" onClick={() => navigate("/user-student-signin-sh")}>Open</Button>
//                   </div>
//                 </ListGroup.Item>

//                 <ListGroup.Item className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <strong>Bulk Registrations for class 8 and 10. (कक्षा 8 और 10वीं के विद्यार्थियों का लेवल 1 परीक्षा के लिए bulk में पंजीकरण करने के लिए Upload बटन पर क्लिक करें।)</strong>
//                     {/* <div className="text-muted small">Upload CSV/Excel for many students at once</div> */}
//                   </div>
//                   <div>
//                     <Button size="sm" variant="outline-success" onClick={() => navigate("/user-bulk-registrations")}>Upload</Button>
//                   </div>
//                 </ListGroup.Item>

//                 <ListGroup.Item className="d-flex justify-content-between align-items-center">
              
//                 </ListGroup.Item>
//               </ListGroup>
//             </Card.Body>

//             <Card.Footer className="bg-white">
//               <small className="text-muted">Tip: Use bulk upload to save time for many entries.</small>
//             </Card.Footer>
//           </Card>
//         </Col>

//         {/* Right: Recent registrations & search */}
        
//       </Row>
//     </Container>
//   )
// }




import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../NewContextApis/UserContext";
import { Container, Row, Col, Card, Button, ListGroup, Badge, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GetStudentsRegisteredByUserCount } from "../../services/DashBoardServices/DashboardService";

export const UserDashBoard = () =>{
  const { userData, setUserData } = useContext(UserContext); // ✅ use context
  const navigate = useNavigate();


  // Small helpers / placeholders — you can replace with real data later
  const [search, setSearch] = useState("");
  const recentRegs = userData?.recentRegistrations || []; // optional array if you populate it

  // --- ADDED: counts state to hold API response ---
  const [counts, setCounts] = useState({
    totalRegistrationCount: null,
    total8RegisteredCount: null,
    total10RegisteredCount: null,
    totalVerifiedCount: null,
    totalVerified8Count: null,
    totalVerified10Count: null
  });

  // Compute stats for display: prefer API counts, fall back to userData?.stats, then "-"
  const stats = {
    totalRegistered:
      counts.totalRegistrationCount !== null
        ? counts.totalRegistrationCount
        : userData?.stats?.totalRegistered ?? "-",
    class8:
      counts.total8RegisteredCount !== null
        ? counts.total8RegisteredCount
        : userData?.stats?.class8 ?? "-",
    class10:
      counts.total10RegisteredCount !== null
        ? counts.total10RegisteredCount
        : userData?.stats?.class10 ?? "-",
    pending:
      // pending verifications = totalRegistrationCount - totalVerifiedCount (if both available)
      (counts.totalRegistrationCount !== null && counts.totalVerifiedCount !== null)
        ? Math.max(0, counts.totalRegistrationCount - counts.totalVerifiedCount)
        : userData?.stats?.pending ?? "-"
  };

  useEffect(() => {
    // Example: you may fetch dashboard-specific data here later
  }, []);

  console.log(userData)

  //Functions for showing logged in user registrations count

  const fetchUserRegisteredCounts = async () =>{

    const reqBody = {
        _id: userData?.user?._id
    }

    // if no user id yet, skip
    if (!reqBody._id) return;

    try {
        const response = await GetStudentsRegisteredByUserCount(reqBody)
        // response shape may differ depending on service; handle both:
        // 1) response.data is the counts object (your earlier console showed that)
        // 2) response.data.data is the counts object (typical axios wrapper)
        const payload =
          (response && response.data && response.data.data) ?
            response.data.data :
            (response && response.data) ? response.data : null;

        // if payload is wrapped in success/data or is directly the object, normalize it
        // payload may already be the object like { totalRegistrationCount: 1, ... }
        if (payload) {
          setCounts({
            totalRegistrationCount: payload.totalRegistrationCount ?? null,
            total8RegisteredCount: payload.total8RegisteredCount ?? null,
            total10RegisteredCount: payload.total10RegisteredCount ?? null,
            totalVerifiedCount: payload.totalVerifiedCount ?? null,
            totalVerified8Count: payload.totalVerified8Count ?? null,
            totalVerified10Count: payload.totalVerified10Count ?? null
          });
        } else {
          console.warn("Unexpected response shape from GetStudentsRegisteredByUserCount:", response);
        }

        console.log("Fetched registration counts ->", payload);
    } catch (error) {
        console.log("Error fetching count", error)
    }
  }

  // fetch when component mounts or when user id becomes available/changes
  useEffect(()=>{
    fetchUserRegisteredCounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.user?._id])

  return(
    <Container fluid className="py-4">
     

      

      {/* Main content: actions + recent */}
      <Row className="g-4">
        {/* Left: Actions */}
        <Col lg={4}>
  <Card className="shadow-sm h-100" style={{ width: "95vw" }}>
    <Card.Header className="bg-white">
      <h5 style={{ margin: 0, }}>Registration For Session 2026-28</h5>
      <small className="text-muted">Use Below Links for Registrations</small>
    </Card.Header>

    <Card.Body>
      <ListGroup variant="flush">

        

        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <div>
            <a
              onClick={() => navigate("/user-bulk-registrations")}
              className="blink-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                  fontSize:'25px'
              }}
            >
              1. Bulk Registrations for class 8 and 10. (कक्षा 8 और 10वीं के विद्यार्थियों का
              लेवल 1 परीक्षा के लिए bulk में पंजीकरण करने के लिए Upload बटन पर क्लिक करें।)
            </a>
          </div>
        </ListGroup.Item>

<br></br>
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <div>
            <a
              onClick={() => navigate("/user-student-signin-mb")}
              className="blink-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                fontSize:'25px'
              }}
            >
              2. Class 8 Individual Students Registration.(कक्षा 8 के विद्यार्थियों का
              लेवल 1 परीक्षा पंजीकरण करने के लिए फ़ॉर्म खोलें।)
            </a>
          </div>
        </ListGroup.Item>
            <br></br>
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <div>
            <a
              onClick={() => navigate("/user-student-signin-sh")}
              className="blink-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                  fontSize:'25px'
              }}
            >
              3. Class 10 Individual Students Registration. (कक्षा 10 के विद्यार्थियों का
              लेवल 1 परीक्षा पंजीकरण करने के लिए फ़ॉर्म खोलें।)
            </a>
          </div>

      
        </ListGroup.Item>

      </ListGroup>
<hr></hr>

{userData?.user?.designation === "Center Coordinator" ? (<>
 <a 
          
              className="blink-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                  fontSize:'25px'
              }}
          href="/principal-abrc-data">➩ Update Principal/ABRC Data</a>


              <br></br>
                 <br></br>


           <a 
      
              className="blink-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                  fontSize:'25px'
              }}
          href="/callings-abrc">➩ Abrc Callings</a>




          <br></br>
                 <br></br>


           <a 
      
              className="blink-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                  fontSize:'25px'
              }}
          href="/callings-principals">➩ Principal Callings</a>
</>):(null)}





{userData?.user?.designation === "ACI" ? (<>
 


              <br></br>
                 <br></br>


           <a 
      
              className="blink-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                  fontSize:'25px'
              }}
          href="/callings-beo">➩ BEO Callings</a>




          <br></br>
                 <br></br>


           <a 
      
              className="blink-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                  fontSize:'25px'
              }}
          href="/callings-deo">➩ DEO Callings</a>
</>):(null)}
         
    </Card.Body>

    <Card.Footer className="bg-white">
      <small className="text-muted">
        Tip: Use bulk upload to save time for many entries.
      </small>
    </Card.Footer>
  </Card>



  <style>{`
    @keyframes blinkColor {
      0% { color: #0b5ed7; }
      50% { color: #d73a49; }
      100% { color: #0b5ed7; }
    }
    .blink-link {
      color: #0b5ed7;
      animation: blinkColor 1.2s linear infinite;
    }
    .blink-link:hover {
      text-decoration: underline;
    }
  `}</style>
</Col>


        {/* Right: Recent registrations & search */}




        {/* Stats row */}
      <Row className="mb-4 g-3">
        <Col sm={6} md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <small className="text-muted">Total Registered</small>
                  <h4 className="mt-2">{stats.totalRegistered}</h4>
                </div>
                <Badge bg="primary" pill style={{ fontSize: 14, padding: "10px 12px" }}>
                  All
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} md={3}>
          <Card className="h-100 shadow-sm" onClick={()=>{
            navigate('/user-registered-students-mb')
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <small className="text-muted">Class 8</small>
                  <h4 className="mt-2">{stats.class8}</h4>
                </div>
                <Badge bg="success" pill style={{ fontSize: 14, padding: "10px 12px" }}>
                  8
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} md={3}>
          <Card className="h-100 shadow-sm" onClick={()=>{
            navigate('/user-registered-students-sh')
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <small className="text-muted">Class 10</small>
                  <h4 className="mt-2">{stats.class10}</h4>
                </div>
                <Badge bg="info" pill style={{ fontSize: 14, padding: "10px 12px" }}>
                  10
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <small className="text-muted">Pending Verifications</small>
                  <h4 className="mt-2">{stats.pending}</h4>
                </div>
                <Badge bg="warning" pill style={{ fontSize: 14, padding: "10px 12px", color: "#212529" }}>
                  Pending
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
        
      </Row>
    </Container>
  )
}
