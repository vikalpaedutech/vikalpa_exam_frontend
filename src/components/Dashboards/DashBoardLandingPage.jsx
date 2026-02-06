// src/components/Dashboards/DashboardLandingPage.jsx



//Level 1 Registration landing page


// import React, { useEffect, useState, useMemo } from "react";
// import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const DashboardLandingPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboard, setDashboard] = useState(null);

//   // generic totals map (string keys like "8","9","10" => numeric totals)
//   const [totals, setTotals] = useState({});
//   const [mainDashboardData, setMainDashboardData] = useState([]);

//   const fetchMainDashboardCount = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await MainDashBoard();
//       setMainDashboardData(response.data);
      
//       // Calculate totals from mainDashboardData
//       const accum = {};
      
//       for (const school of response.data || []) {
//         const class8 = Number(school?.registrationCount8 || 0);
//         const class10 = Number(school?.registrationCount10 || 0);
        
//         accum["8"] = (accum["8"] || 0) + class8;
//         accum["10"] = (accum["10"] || 0) + class10;
//       }
      
//       setTotals(accum);
//       console.debug("Computed totals by class:", accum);
      
//     } catch (error) {
//       console.error("Error", error);
//       setError(error?.message || "Failed to fetch dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const fetchDashboardCounts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const resp = await DashboardCounts();
//       const data = resp?.data || resp;
//       setDashboard(data);

//       console.log(data)

//       console.log("Dashboard response:", resp);

//       const centersArr = data?.centers || data?.data?.centers || [];
//       if (!Array.isArray(centersArr)) {
//         console.warn("centers is not an array:", centersArr);
//       }

//       // accumulate totals by class (string keys)
//       const accum = {};

//       for (const c of centersArr || []) {
//         const schoolCounts = c?.dashboardCounts?.school || c?.dashboardCounts || {};
//         // try common variants for per-class buckets
//         const byClass =
//           schoolCounts?.byClass ||
//           schoolCounts?.by_class ||
//           schoolCounts?.classes ||
//           schoolCounts?.class_counts ||
//           {};

//         // If byClass is not an object, try to skip
//         if (!byClass || typeof byClass !== "object") continue;

//         for (const clsKey of Object.keys(byClass || {})) {
//           try {
//             const clsObj = byClass[clsKey];

//             // clsObj may be a number, or an object containing registered/count/total
//             let value = 0;
//             if (clsObj == null) {
//               value = 0;
//             } else if (typeof clsObj === "number") {
//               value = clsObj;
//             } else if (typeof clsObj === "string") {
//               // sometimes value is string "12"
//               value = Number(clsObj) || 0;
//             } else if (typeof clsObj === "object") {
//               // prefer canonical keys
//               value =
//                 Number(clsObj.registered ?? clsObj.count ?? clsObj.total ?? clsObj.registeredCount ?? clsObj.students ?? 0) ||
//                 0;
//             } else {
//               value = 0;
//             }

//             const key = String(clsKey);
//             accum[key] = (accum[key] || 0) + value;
//           } catch (e) {
//             console.warn("Failed to process class key", clsKey, e);
//           }
//         }
//       }

//       // Save full accum map into totals so UI can use any class key
//       setTotals(accum);

//       console.debug("Computed totals by class:", accum);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError(err?.message || "Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMainDashboardCount();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Derived totals for common classes you display
//   const totalClass8 = useMemo(() => Number(totals["8"] || 0), [totals]);
//   const totalClass9 = useMemo(() => Number(totals["9"] || 0), [totals]);
//   const totalClass10 = useMemo(() => Number(totals["10"] || 0), [totals]);

//   // compute total sum of 8 and 10 for display
//   const totalSum8and10 = useMemo(() => totalClass8 + totalClass10, [totalClass8, totalClass10]);

//   if (loading)
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status" />
//         <div className="mt-3">Loading dashboard summary...</div>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container className="py-5">
//         <Alert variant="danger">
//           <strong>Error:</strong> {error}
//         </Alert>
//       </Container>
//     );

//   return (
//     <Container className="py-4">
//       <h3 className="mb-4 text-center" style={{color:'red', fontSize:'40px', fontWeight:'bold'}}>
//         Dashboards: 
//       </h3>
//       <hr></hr>

//       {/* {totalSum8and10} */}

//       <Row className="g-4">
//         {/* optional: Class 8 card (shows only when there's any data for class 8) */}
//         {typeof totals["8"] !== "undefined" && (
//           <Col md={6}>
//             <Card className="shadow-sm h-100">
//               <Card.Body>
//                 <h5 className="mb-2 text-primary">Mission Buniyaad (Class 8)</h5>
               
//                 <h4 style={{color:'red', fontWeight:'bold'}}>Total Registrations: {totalClass8} </h4>
//                 <hr />
//                 <ul className="list-unstyled mb-0">
//                   <li>🔹 <a href="/district-block-mb"><strong >Click to see District–Block Dashboard</strong></a></li>
//                   <li className="mt-2">🔹<a href="/block-school-mb"> <strong>Click to see Block–School Dashboard</strong></a></li>
//                   <li className="mt-2">🔹<a href="/school-dashboard-mb"> <strong>Click to see School Dashboard</strong></a></li>
//                 </ul>
//               </Card.Body>
//             </Card>
//           </Col>
//         )}

//         {/* Haryana Super 100 (Class 10) */}
//         <Col md={6}>
//           <Card className="shadow-sm h-100">
//             <Card.Body>
//               <h5 className="mb-2 text-primary">Haryana Super 100 (Class 10)</h5>
//               <h4 style={{color:'red', fontWeight:'bold'}}>Total Registrations: {totalClass10} </h4>
//               <hr />
//               <ul className="list-unstyled mb-0">
//                 <li>🔹 <a href="/district-block-sh"><strong>Click to see District–Block Dashboard</strong></a></li>
//                 <li className="mt-2">🔹 <a href="/block-school-sh"><strong>Click to see Block–School Dashboard</strong></a></li>
//                 <li className="mt-2">🔹<a href="/school-dashboard-sh"> <strong>Click to see School Dashboard</strong></a></li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };













// //Level 1 Admit card


// import React, { useEffect, useState, useMemo } from "react";
// import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const DashboardLandingPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboard, setDashboard] = useState(null);

//   // generic totals map (string keys like "8","9","10" => numeric totals)
//   const [totals, setTotals] = useState({});
//   const [admitCardTotals, setAdmitCardTotals] = useState({});
//   const [mainDashboardData, setMainDashboardData] = useState([]);

//   const fetchMainDashboardCount = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await MainDashBoard();
//       setMainDashboardData(response.data);
      
//       // Calculate totals from mainDashboardData
//       const accum = {};
//       const admitCardAccum = {};
      
//       for (const school of response.data || []) {
//         const class8 = Number(school?.registrationCount8 || 0);
//         const class10 = Number(school?.registrationCount10 || 0);
//         const admitCard8 = Number(school?.admitCardCount8 || 0);
//         const admitCard10 = Number(school?.admitCardCount10 || 0);
        
//         accum["8"] = (accum["8"] || 0) + class8;
//         accum["10"] = (accum["10"] || 0) + class10;
//         admitCardAccum["8"] = (admitCardAccum["8"] || 0) + admitCard8;
//         admitCardAccum["10"] = (admitCardAccum["10"] || 0) + admitCard10;
//       }
      
//       setTotals(accum);
//       setAdmitCardTotals(admitCardAccum);
//       console.debug("Computed totals by class:", accum);
//       console.debug("Computed admit card totals by class:", admitCardAccum);
      
//     } catch (error) {
//       console.error("Error", error);
//       setError(error?.message || "Failed to fetch dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const fetchDashboardCounts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const resp = await DashboardCounts();
//       const data = resp?.data || resp;
//       setDashboard(data);

//       console.log(data)

//       console.log("Dashboard response:", resp);

//       const centersArr = data?.centers || data?.data?.centers || [];
//       if (!Array.isArray(centersArr)) {
//         console.warn("centers is not an array:", centersArr);
//       }

//       // accumulate totals by class (string keys)
//       const accum = {};
//       const admitCardAccum = {};

//       for (const c of centersArr || []) {
//         const schoolCounts = c?.dashboardCounts?.school || c?.dashboardCounts || {};
//         // try common variants for per-class buckets
//         const byClass =
//           schoolCounts?.byClass ||
//           schoolCounts?.by_class ||
//           schoolCounts?.classes ||
//           schoolCounts?.class_counts ||
//           {};

//         // If byClass is not an object, try to skip
//         if (!byClass || typeof byClass !== "object") continue;

//         for (const clsKey of Object.keys(byClass || {})) {
//           try {
//             const clsObj = byClass[clsKey];

//             // clsObj may be a number, or an object containing registered/count/total
//             let value = 0;
//             if (clsObj == null) {
//               value = 0;
//             } else if (typeof clsObj === "number") {
//               value = clsObj;
//             } else if (typeof clsObj === "string") {
//               // sometimes value is string "12"
//               value = Number(clsObj) || 0;
//             } else if (typeof clsObj === "object") {
//               // prefer canonical keys
//               value =
//                 Number(clsObj.registered ?? clsObj.count ?? clsObj.total ?? clsObj.registeredCount ?? clsObj.students ?? 0) ||
//                 0;
//             } else {
//               value = 0;
//             }

//             const key = String(clsKey);
//             accum[key] = (accum[key] || 0) + value;
            
//             // For admit card counts, we might need to extract from a different field
//             // This depends on your data structure
//             if (typeof clsObj === "object") {
//               const admitCardValue = Number(clsObj.admitCardCount ?? clsObj.admitCard ?? clsObj.admitCardDownloaded ?? 0) || 0;
//               admitCardAccum[key] = (admitCardAccum[key] || 0) + admitCardValue;
//             }
//           } catch (e) {
//             console.warn("Failed to process class key", clsKey, e);
//           }
//         }
//       }

//       // Save full accum map into totals so UI can use any class key
//       setTotals(accum);
//       setAdmitCardTotals(admitCardAccum);

//       console.debug("Computed totals by class:", accum);
//       console.debug("Computed admit card totals by class:", admitCardAccum);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError(err?.message || "Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMainDashboardCount();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Derived totals for common classes you display
//   const totalClass8 = useMemo(() => Number(totals["8"] || 0), [totals]);
//   const totalClass9 = useMemo(() => Number(totals["9"] || 0), [totals]);
//   const totalClass10 = useMemo(() => Number(totals["10"] || 0), [totals]);
  
//   // Admit card totals
//   const totalAdmitCard8 = useMemo(() => Number(admitCardTotals["8"] || 0), [admitCardTotals]);
//   const totalAdmitCard10 = useMemo(() => Number(admitCardTotals["10"] || 0), [admitCardTotals]);

//   // compute total sum of 8 and 10 for display
//   const totalSum8and10 = useMemo(() => totalClass8 + totalClass10, [totalClass8, totalClass10]);

//   if (loading)
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status" />
//         <div className="mt-3">Loading dashboard summary...</div>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container className="py-5">
//         <Alert variant="danger">
//           <strong>Error:</strong> {error}
//         </Alert>
//       </Container>
//     );

//   return (
//     <Container className="py-4">
//       <h3 className="mb-4 text-center" style={{color:'red', fontSize:'40px', fontWeight:'bold'}}>
//         Dashboards: 
//       </h3>
//       <hr></hr>

//       <Row className="g-4">
        


//         {typeof totals["8"] !== "undefined" && (
//           <Col md={6}>
//             <Card className="shadow-sm h-100">
//               <Card.Body>
//                 <h5 className="mb-2 text-primary">Mission Buniyaad (Class 8)</h5>
               
//                 <h4 style={{color:'red', fontWeight:'bold'}}>Total Registrations: {totalClass8} </h4>
                
//                 {/* Admit Card Count for Class 8 */}
//                 <div className="mt-3" style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
//                   <h5 style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '5px' }}>
//                     Admit Card Downloaded: {totalAdmitCard8}
//                   </h5>
//                   {/* {totalClass8 > 0 && (
//                     <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
//                       {Math.round((totalAdmitCard8 / totalClass8) * 100)}% of students
//                     </div>
//                   )} */}
//                 </div>
                
//                 <hr />
//                 <ul className="list-unstyled mb-0">
//                   <li>🔹 <a href="/district-block-mb"><strong >Click to see District–Block Dashboard</strong></a></li>
//                   <li className="mt-2">🔹<a href="/block-school-mb"> <strong>Click to see Block–School Dashboard</strong></a></li>
//                   <li className="mt-2">🔹<a href="/school-dashboard-mb"> <strong>Click to see School Dashboard</strong></a></li>
//                 </ul>
//               </Card.Body>
//             </Card>
//           </Col>
//         )}


//         {/* Haryana Super 100 (Class 10) */}
//         <Col md={6}>
//           <Card className="shadow-sm h-100">
//             <Card.Body>
//               <h5 className="mb-2 text-primary">Haryana Super 100 (Class 10)</h5>
//               <h4 style={{color:'red', fontWeight:'bold'}}>Total Registrations: {totalClass10} </h4>
              
//               {/* Admit Card Count for Class 10 */}
//               <div className="mt-3" style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
//                 {/* <h5 style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '5px' }}>
//                   Admit Card Downloaded: {totalAdmitCard10}
//                 </h5> */}
//                 {/* {totalClass10 > 0 && (
//                   <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
//                     {Math.round((totalAdmitCard10 / totalClass10) * 100)}% of students
//                   </div>
//                 )} */}
//               </div>
              
//               <hr />
//               <ul className="list-unstyled mb-0">
//                 <li>🔹 <a href="/district-block-sh"><strong>Click to see District–Block Dashboard</strong></a></li>
//                 <li className="mt-2">🔹 <a href="/block-school-sh"><strong>Click to see Block–School Dashboard</strong></a></li>
//                 <li className="mt-2">🔹<a href="/school-dashboard-sh"> <strong>Click to see School Dashboard</strong></a></li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };








//Level 1 Admit card

// import React, { useEffect, useState, useMemo } from "react";
// import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const DashboardLandingPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboard, setDashboard] = useState(null);

//   // generic totals map (string keys like "8","9","10" => numeric totals)
//   const [totals, setTotals] = useState({});
//   const [admitCardTotals, setAdmitCardTotals] = useState({});
//   const [mainDashboardData, setMainDashboardData] = useState([]);

//   // New state variables for Level 1 and Level 2 data
//   const [l1QualifiedTotals, setL1QualifiedTotals] = useState({});
//   const [l2AdmitCardTotals, setL2AdmitCardTotals] = useState({});
//   const [l2QualifiedTotals, setL2QualifiedTotals] = useState({});

//   const fetchMainDashboardCount = async () => {

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await MainDashBoard();
//       setMainDashboardData(response.data);

//       console.log(response.data)
      
//       // Calculate totals from mainDashboardData
//       const accum = {};
//       const admitCardAccum = {};
//       const l1QualifiedAccum = {};
//       const l2AdmitCardAccum = {};
//       const l2QualifiedAccum = {};
      
//       for (const school of response.data || []) {
//         const class8 = Number(school?.registrationCount8 || 0);
//         const class10 = Number(school?.registrationCount10 || 0);
//         const admitCard8 = Number(school?.admitCardCount8 || 0);
//         const admitCard10 = Number(school?.admitCardCount10 || 0);
        
//         // New fields for Level 1 and Level 2
//         const l1Qualified8 = Number(school?.L1QualifiedCount8 || 0);
//         const l1Qualified10 = Number(school?.L1QualifiedCount10 || 0);
//         const l2AdmitCard8 = Number(school?.isL2AdmitCardDownloadedCount8 || 0);
//         const l2AdmitCard10 = Number(school?.isL2AdmitCardDownloadedCount10 || 0);
//         const l2Qualified8 = Number(school?.totalL2QualifiedCount8 || 0);
//         const l2Qualified10 = Number(school?.totalL2QualifiedCount10 || 0);
        
//         accum["8"] = (accum["8"] || 0) + class8;
//         accum["10"] = (accum["10"] || 0) + class10;
//         admitCardAccum["8"] = (admitCardAccum["8"] || 0) + admitCard8;
//         admitCardAccum["10"] = (admitCardAccum["10"] || 0) + admitCard10;
        
//         // Accumulate new Level 1 and Level 2 data
//         l1QualifiedAccum["8"] = (l1QualifiedAccum["8"] || 0) + l1Qualified8;
//         l1QualifiedAccum["10"] = (l1QualifiedAccum["10"] || 0) + l1Qualified10;
//         l2AdmitCardAccum["8"] = (l2AdmitCardAccum["8"] || 0) + l2AdmitCard8;
//         l2AdmitCardAccum["10"] = (l2AdmitCardAccum["10"] || 0) + l2AdmitCard10;
//         l2QualifiedAccum["8"] = (l2QualifiedAccum["8"] || 0) + l2Qualified8;
//         l2QualifiedAccum["10"] = (l2QualifiedAccum["10"] || 0) + l2Qualified10;
//       }
      
//       setTotals(accum);
//       setAdmitCardTotals(admitCardAccum);
//       setL1QualifiedTotals(l1QualifiedAccum);
//       setL2AdmitCardTotals(l2AdmitCardAccum);
//       setL2QualifiedTotals(l2QualifiedAccum);
      
//       console.debug("Computed totals by class:", accum);
//       console.debug("Computed admit card totals by class:", admitCardAccum);
//       console.debug("Computed L1 qualified totals:", l1QualifiedAccum);
//       console.debug("Computed L2 admit card totals:", l2AdmitCardAccum);
//       console.debug("Computed L2 qualified totals:", l2QualifiedAccum);
      
//     } catch (error) {
//       console.error("Error", error);
//       setError(error?.message || "Failed to fetch dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const fetchDashboardCounts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const resp = await DashboardCounts();
//       const data = resp?.data || resp;
//       setDashboard(data);

//       console.log(data)

//       console.log("Dashboard response:", resp);

//       const centersArr = data?.centers || data?.data?.centers || [];
//       if (!Array.isArray(centersArr)) {
//         console.warn("centers is not an array:", centersArr);
//       }

//       // accumulate totals by class (string keys)
//       const accum = {};
//       const admitCardAccum = {};

//       for (const c of centersArr || []) {
//         const schoolCounts = c?.dashboardCounts?.school || c?.dashboardCounts || {};
//         // try common variants for per-class buckets
//         const byClass =
//           schoolCounts?.byClass ||
//           schoolCounts?.by_class ||
//           schoolCounts?.classes ||
//           schoolCounts?.class_counts ||
//           {};

//         // If byClass is not an object, try to skip
//         if (!byClass || typeof byClass !== "object") continue;

//         for (const clsKey of Object.keys(byClass || {})) {
//           try {
//             const clsObj = byClass[clsKey];

//             // clsObj may be a number, or an object containing registered/count/total
//             let value = 0;
//             if (clsObj == null) {
//               value = 0;
//             } else if (typeof clsObj === "number") {
//               value = clsObj;
//             } else if (typeof clsObj === "string") {
//               // sometimes value is string "12"
//               value = Number(clsObj) || 0;
//             } else if (typeof clsObj === "object") {
//               // prefer canonical keys
//               value =
//                 Number(clsObj.registered ?? clsObj.count ?? clsObj.total ?? clsObj.registeredCount ?? clsObj.students ?? 0) ||
//                 0;
//             } else {
//               value = 0;
//             }

//             const key = String(clsKey);
//             accum[key] = (accum[key] || 0) + value;
            
//             // For admit card counts, we might need to extract from a different field
//             // This depends on your data structure
//             if (typeof clsObj === "object") {
//               const admitCardValue = Number(clsObj.admitCardCount ?? clsObj.admitCard ?? clsObj.admitCardDownloaded ?? 0) || 0;
//               admitCardAccum[key] = (admitCardAccum[key] || 0) + admitCardValue;
//             }
//           } catch (e) {
//             console.warn("Failed to process class key", clsKey, e);
//           }
//         }
//       }

//       // Save full accum map into totals so UI can use any class key
//       setTotals(accum);
//       setAdmitCardTotals(admitCardAccum);

//       console.debug("Computed totals by class:", accum);
//       console.debug("Computed admit card totals by class:", admitCardAccum);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError(err?.message || "Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMainDashboardCount();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Derived totals for common classes you display
//   const totalClass8 = useMemo(() => Number(totals["8"] || 0), [totals]);
//   const totalClass9 = useMemo(() => Number(totals["9"] || 0), [totals]);
//   const totalClass10 = useMemo(() => Number(totals["10"] || 0), [totals]);
  
//   // Admit card totals
//   const totalAdmitCard8 = useMemo(() => Number(admitCardTotals["8"] || 0), [admitCardTotals]);
//   const totalAdmitCard10 = useMemo(() => Number(admitCardTotals["10"] || 0), [admitCardTotals]);
  
//   // Level 1 and Level 2 totals
//   const totalL1Qualified8 = useMemo(() => Number(l1QualifiedTotals["8"] || 0), [l1QualifiedTotals]);
//   const totalL2AdmitCard8 = useMemo(() => Number(l2AdmitCardTotals["8"] || 0), [l2AdmitCardTotals]);
//   const totalL2Qualified8 = useMemo(() => Number(l2QualifiedTotals["8"] || 0), [l2QualifiedTotals]);

//   // compute total sum of 8 and 10 for display
//   const totalSum8and10 = useMemo(() => totalClass8 + totalClass10, [totalClass8, totalClass10]);

//   if (loading)
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status" />
//         <div className="mt-3">Loading dashboard summary...</div>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container className="py-5">
//         <Alert variant="danger">
//           <strong>Error:</strong> {error}
//         </Alert>
//       </Container>
//     );

//   return (
//     <Container className="py-4">
//       <h3 className="mb-4 text-center" style={{color:'red', fontSize:'40px', fontWeight:'bold'}}>
//         Dashboards: 
//       </h3>
//       <hr></hr>

//       <Row className="g-4">
//         {/* Mission Buniyaad (Class 8) */}
        

//         {/* Haryana Super 100 (Class 10) */}
//         <Col md={6}>
//           <Card className="shadow-sm h-100">
//             <Card.Body>
//               <h5 className="mb-2 text-primary">Haryana Super 100 (Class 10)</h5>
//               <h4 style={{color:'red', fontWeight:'bold'}}>Total Registrations: {totalClass10} </h4>
              
//               {/* Level 1 Admit Card Count for Class 10 */}
//               <div className="mt-3" style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
//                 <h5 style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '5px' }}>
//                   {/* Level 1 Admit Card Downloaded: {totalAdmitCard10} */}
//                 </h5>
//                 {/* {totalClass10 > 0 && (
//                   <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
//                     {Math.round((totalAdmitCard10 / totalClass10) * 100)}% of students
//                   </div>
//                 )} */}
//               </div>
              
//               <hr />
//               <ul className="list-unstyled mb-0">
//                 <li>🔹 <a href="/district-block-sh"><strong>Click to see District–Block Dashboard</strong></a></li>
//                 <li className="mt-2">🔹 <a href="/block-school-sh"><strong>Click to see Block–School Dashboard</strong></a></li>
//                 <li className="mt-2">🔹<a href="/school-dashboard-sh"> <strong>Click to see School Dashboard</strong></a></li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };






import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";
import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

export const DashboardLandingPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  // generic totals map (string keys like "8","9","10" => numeric totals)
  const [totals, setTotals] = useState({});
  const [admitCardTotals, setAdmitCardTotals] = useState({});
  const [mainDashboardData, setMainDashboardData] = useState([]);

  // New state variables for Level 1 and Level 2 data
  const [l1QualifiedTotals, setL1QualifiedTotals] = useState({});
  const [l2AdmitCardTotals, setL2AdmitCardTotals] = useState({});
  const [l2QualifiedTotals, setL2QualifiedTotals] = useState({});

  const fetchMainDashboardCount = async () => {

    setLoading(true);
    setError(null);

    try {
      const response = await MainDashBoard();
      setMainDashboardData(response.data);

      console.log(response.data)
      
      // Calculate totals from mainDashboardData
      const accum = {};
      const admitCardAccum = {};
      const l1QualifiedAccum = {};
      const l2AdmitCardAccum = {};
      const l2QualifiedAccum = {};
      
      for (const school of response.data || []) {
        const class8 = Number(school?.registrationCount8 || 0);
        const class10 = Number(school?.registrationCount10 || 0);
        const admitCard8 = Number(school?.admitCardCount8 || 0);
        const admitCard10 = Number(school?.admitCardCount10 || 0);
        
        // New fields for Level 1 and Level 2
        const l1Qualified8 = Number(school?.L1QualifiedCount8 || 0);
        const l1Qualified10 = Number(school?.L1QualifiedCount10 || 0);
        const l2AdmitCard8 = Number(school?.isL2AdmitCardDownloadedCount8 || 0);
        const l2AdmitCard10 = Number(school?.isL2AdmitCardDownloadedCount10 || 0);
        const l2Qualified8 = Number(school?.totalL2QualifiedCount8 || 0);
        const l2Qualified10 = Number(school?.totalL2QualifiedCount10 || 0);
        
        accum["8"] = (accum["8"] || 0) + class8;
        accum["10"] = (accum["10"] || 0) + class10;
        admitCardAccum["8"] = (admitCardAccum["8"] || 0) + admitCard8;
        admitCardAccum["10"] = (admitCardAccum["10"] || 0) + admitCard10;
        
        // Accumulate new Level 1 and Level 2 data
        l1QualifiedAccum["8"] = (l1QualifiedAccum["8"] || 0) + l1Qualified8;
        l1QualifiedAccum["10"] = (l1QualifiedAccum["10"] || 0) + l1Qualified10;
        l2AdmitCardAccum["8"] = (l2AdmitCardAccum["8"] || 0) + l2AdmitCard8;
        l2AdmitCardAccum["10"] = (l2AdmitCardAccum["10"] || 0) + l2AdmitCard10;
        l2QualifiedAccum["8"] = (l2QualifiedAccum["8"] || 0) + l2Qualified8;
        l2QualifiedAccum["10"] = (l2QualifiedAccum["10"] || 0) + l2Qualified10;
      }
      
      setTotals(accum);
      setAdmitCardTotals(admitCardAccum);
      setL1QualifiedTotals(l1QualifiedAccum);
      setL2AdmitCardTotals(l2AdmitCardAccum);
      setL2QualifiedTotals(l2QualifiedAccum);
      
      console.debug("Computed totals by class:", accum);
      console.debug("Computed admit card totals by class:", admitCardAccum);
      console.debug("Computed L1 qualified totals:", l1QualifiedAccum);
      console.debug("Computed L2 admit card totals:", l2AdmitCardAccum);
      console.debug("Computed L2 qualified totals:", l2QualifiedAccum);
      
    } catch (error) {
      console.error("Error", error);
      setError(error?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }

  const fetchDashboardCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await DashboardCounts();
      const data = resp?.data || resp;
      setDashboard(data);

      console.log(data)

      console.log("Dashboard response:", resp);

      const centersArr = data?.centers || data?.data?.centers || [];
      if (!Array.isArray(centersArr)) {
        console.warn("centers is not an array:", centersArr);
      }

      // accumulate totals by class (string keys)
      const accum = {};
      const admitCardAccum = {};

      for (const c of centersArr || []) {
        const schoolCounts = c?.dashboardCounts?.school || c?.dashboardCounts || {};
        // try common variants for per-class buckets
        const byClass =
          schoolCounts?.byClass ||
          schoolCounts?.by_class ||
          schoolCounts?.classes ||
          schoolCounts?.class_counts ||
          {};

        // If byClass is not an object, try to skip
        if (!byClass || typeof byClass !== "object") continue;

        for (const clsKey of Object.keys(byClass || {})) {
          try {
            const clsObj = byClass[clsKey];

            // clsObj may be a number, or an object containing registered/count/total
            let value = 0;
            if (clsObj == null) {
              value = 0;
            } else if (typeof clsObj === "number") {
              value = clsObj;
            } else if (typeof clsObj === "string") {
              // sometimes value is string "12"
              value = Number(clsObj) || 0;
            } else if (typeof clsObj === "object") {
              // prefer canonical keys
              value =
                Number(clsObj.registered ?? clsObj.count ?? clsObj.total ?? clsObj.registeredCount ?? clsObj.students ?? 0) ||
                0;
            } else {
              value = 0;
            }

            const key = String(clsKey);
            accum[key] = (accum[key] || 0) + value;
            
            // For admit card counts, we might need to extract from a different field
            // This depends on your data structure
            if (typeof clsObj === "object") {
              const admitCardValue = Number(clsObj.admitCardCount ?? clsObj.admitCard ?? clsObj.admitCardDownloaded ?? 0) || 0;
              admitCardAccum[key] = (admitCardAccum[key] || 0) + admitCardValue;
            }
          } catch (e) {
            console.warn("Failed to process class key", clsKey, e);
          }
        }
      }

      // Save full accum map into totals so UI can use any class key
      setTotals(accum);
      setAdmitCardTotals(admitCardAccum);

      console.debug("Computed totals by class:", accum);
      console.debug("Computed admit card totals by class:", admitCardAccum);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMainDashboardCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived totals for common classes you display
  const totalClass8 = useMemo(() => Number(totals["8"] || 0), [totals]);
  const totalClass9 = useMemo(() => Number(totals["9"] || 0), [totals]);
  const totalClass10 = useMemo(() => Number(totals["10"] || 0), [totals]);
  
  // Admit card totals
  const totalAdmitCard8 = useMemo(() => Number(admitCardTotals["8"] || 0), [admitCardTotals]);
  const totalAdmitCard10 = useMemo(() => Number(admitCardTotals["10"] || 0), [admitCardTotals]);
  
  // Level 1 and Level 2 totals
  const totalL1Qualified8 = useMemo(() => Number(l1QualifiedTotals["8"] || 0), [l1QualifiedTotals]);
  const totalL2AdmitCard8 = useMemo(() => Number(l2AdmitCardTotals["8"] || 0), [l2AdmitCardTotals]);
  const totalL2Qualified8 = useMemo(() => Number(l2QualifiedTotals["8"] || 0), [l2QualifiedTotals]);

  // compute total sum of 8 and 10 for display
  const totalSum8and10 = useMemo(() => totalClass8 + totalClass10, [totalClass8, totalClass10]);

  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
        <div className="mt-3">Loading dashboard summary...</div>
      </Container>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <strong>Error:</strong> {error}
        </Alert>
      </Container>
    );

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-center" style={{color:'red', fontSize:'40px', fontWeight:'bold'}}>
        Dashboards: 
      </h3>
      <hr></hr>

      <Row className="g-4">
        {/* Mission Buniyaad (Class 8) */}
        

        {/* Haryana Super 100 (Class 10) */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-2 text-primary">Haryana Super 100 (Class 10)</h5>
              <h4 style={{color:'red', fontWeight:'bold'}}>Total Registrations: {totalClass10} </h4>
              
              {/* Display Total Admit Card Count for Class 10 */}
              <div className="mt-3" style={{ backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                <h5 style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '5px' }}>
                  Total Admit Cards: {totalAdmitCard10}
                </h5>
                
              </div>
              
              {/* Level 1 Admit Card Count for Class 10 */}
              <div className="mt-3" style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                <h5 style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '5px' }}>
                  {/* Level 1 Admit Card Downloaded: {totalAdmitCard10} */}
                </h5>
                {/* {totalClass10 > 0 && (
                  <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                    {Math.round((totalAdmitCard10 / totalClass10) * 100)}% of students
                  </div>
                )} */}
              </div>
              
              <hr />
              <ul className="list-unstyled mb-0">
                <li>🔹 <a href="/district-block-sh"><strong>Click to see District–Block Dashboard</strong></a></li>
                <li className="mt-2">🔹 <a href="/block-school-sh"><strong>Click to see Block–School Dashboard</strong></a></li>
                <li className="mt-2">🔹<a href="/school-dashboard-sh"> <strong>Click to see School Dashboard</strong></a></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};






// {typeof totals["8"] !== "undefined" && (
//           <Col md={6}>
//             <Card className="shadow-sm h-100">
//               <Card.Body>
//                 <h5 className="mb-2 text-primary">Mission Buniyaad (Class 8)</h5>
               
//                 <h4 style={{color:'red', fontWeight:'bold'}}>Total Registrations: {totalClass8} </h4>
                
//                 {/* Level 1 Admit Card Count for Class 8 */}
//                 <div className="mt-3" style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
//                   <h5 style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '5px' }}>
//                     Level 1 Admit Card Downloaded: {totalAdmitCard8}
//                   </h5>
//                   {/* {totalClass8 > 0 && (
//                     <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
//                       {Math.round((totalAdmitCard8 / totalClass8) * 100)}% of students
//                     </div>
//                   )} */}
//                 </div>
                
//                 {/* Level 1 Qualified Count for Class 8 */}
//                 <div className="mt-3" style={{ backgroundColor: '#e8f4fd', padding: '10px', borderRadius: '5px' }}>
//                   <h5 style={{ color: '#17a2b8', fontWeight: 'bold', marginBottom: '5px' }}>
//                     Level 1 Qualified: {totalL1Qualified8}
//                   </h5>
//                   {totalAdmitCard8 > 0 && (
//                     <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
//                       {Math.round((totalL1Qualified8 / totalAdmitCard8) * 100)}% of Level 1 appeared students
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Level 2 Admit Card Count for Class 8 */}
//                 <div className="mt-3" style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px' }}>
//                   <h5 style={{ color: '#ffc107', fontWeight: 'bold', marginBottom: '5px' }}>
//                     Level 2 Admit Card Downloaded: {totalL2AdmitCard8}
//                   </h5>
//                   {totalL1Qualified8 > 0 && (
//                     <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
//                       {Math.round((totalL2AdmitCard8 / totalL1Qualified8) * 100)}% of Level 1 qualified students
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Level 2 Qualified Count for Class 8 */}
//                 <div className="mt-3" style={{ backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px' }}>
//                   <h5 style={{ color: '#dc3545', fontWeight: 'bold', marginBottom: '5px' }}>
//                     Level 2 Qualified: {totalL2Qualified8}
//                   </h5>
//                   {totalL2AdmitCard8 > 0 && (
//                     <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
//                       {Math.round((totalL2Qualified8 / totalL2AdmitCard8) * 100)}% of Level 2 appeared students
//                     </div>
//                   )}
//                 </div>
                
//                 <hr />
//                 <ul className="list-unstyled mb-0">
//                   <li>🔹 <a href="/district-block-mb"><strong >Click to see District–Block Dashboard</strong></a></li>
//                   <li className="mt-2">🔹<a href="/block-school-mb"> <strong>Click to see Block–School Dashboard</strong></a></li>
//                   <li className="mt-2">🔹<a href="/school-dashboard-mb"> <strong>Click to see School Dashboard</strong></a></li>
//                 </ul>
//               </Card.Body>
//             </Card>
//           </Col>
//         )}