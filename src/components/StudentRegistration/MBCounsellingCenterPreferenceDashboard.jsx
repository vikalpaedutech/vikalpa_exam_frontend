// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Button, Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
// import { getCenterPreferenceDashboard } from "../../services/StudentRegistrationServices/StudentRegistrationService";
// import MBCenters from "../StudentRegistration/MBCenters.json";

// export const CenterPreferenceDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [centersData, setCentersData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedBlock, setSelectedBlock] = useState("");
//   const [districts, setDistricts] = useState([]);
//   const [blocks, setBlocks] = useState([]);
//   const [summary, setSummary] = useState({
//     totalCenters: 0,
//     totalCp1: 0,
//     totalCp2: 0,
//     totalPreferences: 0
//   });

//   const STATIC_CENTERS_DATA = MBCenters;

//   // Process the dashboard data and merge with center info
//   const processDashboardData = (dashboardData) => {
//     console.log("Dashboard data:", dashboardData);
//     console.log("Static centers data:", STATIC_CENTERS_DATA);

//     // Create a map for quick lookup of CP1 and CP2 counts
//     const cp1CountMap = new Map();
//     const cp2CountMap = new Map();

//     // Process CP1 data
//     if (dashboardData.preference1 && Array.isArray(dashboardData.preference1)) {
//       dashboardData.preference1.forEach(item => {
//         if (item._id && item._id.center && item._id.status) {
//           const centerName = item._id.center;
//           const count = item.count;
          
//           if (!cp1CountMap.has(centerName)) {
//             cp1CountMap.set(centerName, { selected: 0, waiting: 0, total: 0 });
//           }
          
//           const current = cp1CountMap.get(centerName);
//           if (item._id.status === "Selected") {
//             current.selected += count;
//           } else if (item._id.status === "Waiting") {
//             current.waiting += count;
//           }
//           current.total += count;
//           cp1CountMap.set(centerName, current);
//         }
//       });
//     }

//     // Process CP2 data
//     if (dashboardData.preference2 && Array.isArray(dashboardData.preference2)) {
//       dashboardData.preference2.forEach(item => {
//         if (item._id && item._id.center && item._id.status) {
//           const centerName = item._id.center;
//           const count = item.count;
          
//           if (!cp2CountMap.has(centerName)) {
//             cp2CountMap.set(centerName, { selected: 0, waiting: 0, total: 0 });
//           }
          
//           const current = cp2CountMap.get(centerName);
//           if (item._id.status === "Selected") {
//             current.selected += count;
//           } else if (item._id.status === "Waiting") {
//             current.waiting += count;
//           }
//           current.total += count;
//           cp2CountMap.set(centerName, current);
//         }
//       });
//     }

//     // Merge with static centers data
//     const mergedData = STATIC_CENTERS_DATA.map(center => {
//       const centerName = center.centerName;
//       const cp1Data = cp1CountMap.get(centerName) || { selected: 0, waiting: 0, total: 0 };
//       const cp2Data = cp2CountMap.get(centerName) || { selected: 0, waiting: 0, total: 0 };
      
//       return {
//         ...center,
//         cp1Selected: cp1Data.selected || 0,
//         cp1Waiting: cp1Data.waiting || 0,
//         cp1Total: cp1Data.total || 0,
//         cp2Selected: cp2Data.selected || 0,
//         cp2Waiting: cp2Data.waiting || 0,
//         cp2Total: cp2Data.total || 0,
//         totalPreferences: (cp1Data.total || 0) + (cp2Data.total || 0)
//       };
//     });

//     // Calculate summary
//     const totalCenters = mergedData.length;
//     const totalCp1 = mergedData.reduce((sum, center) => sum + center.cp1Total, 0);
//     const totalCp2 = mergedData.reduce((sum, center) => sum + center.cp2Total, 0);
//     const totalPreferences = totalCp1 + totalCp2;

//     setSummary({
//       totalCenters,
//       totalCp1,
//       totalCp2,
//       totalPreferences
//     });

//     // Extract unique districts and blocks for filters
//     const uniqueDistricts = [...new Map(mergedData.map(center => [center.districtId, center.districtName])).entries()]
//       .map(([id, name]) => ({ id, name }))
//       .sort((a, b) => a.name.localeCompare(b.name));
    
//     setDistricts(uniqueDistricts);
//     setCentersData(mergedData);
//     setFilteredData(mergedData);
//   };

//   const fetchCenterPreferenceDash = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await getCenterPreferenceDashboard();
//       console.log("API Response:", response);
      
//       if (response && response.success && response.data) {
//         processDashboardData(response.data);
//       } else {
//         setError("Failed to fetch dashboard data");
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       setError("Error fetching dashboard data: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCenterPreferenceDash();
//   }, []);

//   // Handle district filter change
//   const handleDistrictChange = (e) => {
//     const districtId = e.target.value;
//     setSelectedDistrict(districtId);
//     setSelectedBlock(""); // Reset block when district changes
    
//     if (districtId === "") {
//       setFilteredData(centersData);
//       // Update blocks list
//       const uniqueBlocks = [...new Map(centersData.map(center => [center.blockId, center.blockName])).entries()]
//         .map(([id, name]) => ({ id, name }))
//         .sort((a, b) => a.name.localeCompare(b.name));
//       setBlocks(uniqueBlocks);
//     } else {
//       const filtered = centersData.filter(center => center.districtId === districtId);
//       setFilteredData(filtered);
      
//       // Update blocks list based on selected district
//       const uniqueBlocks = [...new Map(filtered.map(center => [center.blockId, center.blockName])).entries()]
//         .map(([id, name]) => ({ id, name }))
//         .sort((a, b) => a.name.localeCompare(b.name));
//       setBlocks(uniqueBlocks);
//     }
//   };

//   // Handle block filter change
//   const handleBlockChange = (e) => {
//     const blockId = e.target.value;
//     setSelectedBlock(blockId);
    
//     if (blockId === "") {
//       if (selectedDistrict === "") {
//         setFilteredData(centersData);
//       } else {
//         const filtered = centersData.filter(center => center.districtId === selectedDistrict);
//         setFilteredData(filtered);
//       }
//     } else {
//       let filtered = centersData.filter(center => center.blockId === blockId);
//       if (selectedDistrict !== "") {
//         filtered = filtered.filter(center => center.districtId === selectedDistrict);
//       }
//       setFilteredData(filtered);
//     }
//   };

//   // Reset all filters
//   const handleResetFilters = () => {
//     setSelectedDistrict("");
//     setSelectedBlock("");
//     setFilteredData(centersData);
//     // Reset blocks to all blocks
//     const uniqueBlocks = [...new Map(centersData.map(center => [center.blockId, center.blockName])).entries()]
//       .map(([id, name]) => ({ id, name }))
//       .sort((a, b) => a.name.localeCompare(b.name));
//     setBlocks(uniqueBlocks);
//   };

//   // Get badge for count display
//   const getCountBadge = (count, type) => {
//     if (count === 0) return <Badge bg="secondary">0</Badge>;
//     if (type === "cp1") return <Badge bg="primary">{count}</Badge>;
//     if (type === "cp2") return <Badge bg="success">{count}</Badge>;
//     return <Badge bg="info">{count}</Badge>;
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">Loading dashboard data...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="mt-5">
//         <Alert variant="danger">
//           <Alert.Heading>Error Loading Dashboard</Alert.Heading>
//           <p>{error}</p>
//           <Button variant="outline-danger" onClick={fetchCenterPreferenceDash}>
//             Retry
//           </Button>
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="mt-4">

//         <Row className="mb-4">
//   <Col>
//     <div className="d-flex flex-wrap gap-3 align-items-center">
//       <a 
//         href="https://registration.buniyaadhry.com/mb-counselling-attendance" 
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-decoration-none"
//         style={{ color: '#0d6efd', fontWeight: '500' }}
//       >
//         <i className="bi bi-calendar-check me-1"></i>
//         Attendance
//       </a>
      
//       <span className="text-muted">|</span>
      
//       <a 
//         href="https://registration.buniyaadhry.com/mb-center-allocation-counselling" 
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-decoration-none"
//         style={{ color: '#0d6efd', fontWeight: '500' }}
//       >
//         <i className="bi bi-building me-1"></i>
//         Center Allocation & Distance
//       </a>
      
//       <span className="text-muted">|</span>
      
//       <a 
//         href="https://registration.buniyaadhry.com/mb-doc-verfication-counselling" 
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-decoration-none"
//         style={{ color: '#0d6efd', fontWeight: '500' }}
//       >
//         <i className="bi bi-file-earmark-check me-1"></i>
//         Doc Verification
//       </a>
      
//       <span className="text-muted">|</span>
      
//       <a 
//         href="https://registration.buniyaadhry.com/mb-provisional-selected-counselling" 
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-decoration-none"
//         style={{ color: '#0d6efd', fontWeight: '500' }}
//       >
//         <i className="bi bi-person-check me-1"></i>
//         Admission Status
//       </a>
      
//       <span className="text-muted">|</span>
      
//       <a 
//         href="https://registration.buniyaadhry.com/center-preference-dashboard" 
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-decoration-none"
//         style={{ color: '#0d6efd', fontWeight: '500' }}
//       >
//         <i className="bi bi-speedometer2 me-1"></i>
//         All Dashboard
//       </a>
      
//       <span className="text-muted">|</span>
      
//       <a 
//         href="https://registration.buniyaadhry.com/mb-l3-attendance-pdf" 
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-decoration-none"
//         style={{ color: '#0d6efd', fontWeight: '500' }}
//       >
//         <i className="bi bi-file-pdf me-1"></i>
//         Attendance Pdf
//       </a>
//     </div>
//   </Col>
// </Row>
//       {/* Header */}
//       <Row className="mb-4">
//         <Col>
//           <h2 className="mb-3">
//             <i className="bi bi-bar-chart-steps me-2"></i>
//             Center Preference Dashboard
//           </h2>
//           <p className="text-muted">
//             Track center preferences (CP1 and CP2) across all districts and blocks
//           </p>
//         </Col>
//       </Row>

//       {/* Summary Cards */}
//       <Row className="mb-4">
//         <Col md={3}>
//           <Card className="text-center shadow-sm">
//             <Card.Body>
//               <i className="bi bi-building fs-1 text-primary"></i>
//               <h3 className="mt-2">{summary.totalCenters}</h3>
//               <p className="text-muted mb-0">Total Centers</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm">
//             <Card.Body>
//               <i className="bi bi-check-circle fs-1 text-primary"></i>
//               <h3 className="mt-2">{summary.totalCp1}</h3>
//               <p className="text-muted mb-0">Total CP1 Preferences</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm">
//             <Card.Body>
//               <i className="bi bi-star fs-1 text-success"></i>
//               <h3 className="mt-2">{summary.totalCp2}</h3>
//               <p className="text-muted mb-0">Total CP2 Preferences</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm">
//             <Card.Body>
//               <i className="bi bi-pie-chart fs-1 text-info"></i>
//               <h3 className="mt-2">{summary.totalPreferences}</h3>
//               <p className="text-muted mb-0">Total Preferences</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Filters */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Row>
//             <Col md={5}>
//               <Form.Group>
//                 <Form.Label>
//                   <i className="bi bi-geo-alt me-1"></i> District
//                 </Form.Label>
//                 <Form.Select value={selectedDistrict} onChange={handleDistrictChange}>
//                   <option value="">All Districts</option>
//                   {districts.map(district => (
//                     <option key={district.id} value={district.id}>
//                       {district.name}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={5}>
//               <Form.Group>
//                 <Form.Label>
//                   <i className="bi bi-grid me-1"></i> Block
//                 </Form.Label>
//                 <Form.Select value={selectedBlock} onChange={handleBlockChange}>
//                   <option value="">All Blocks</option>
//                   {blocks.map(block => (
//                     <option key={block.id} value={block.id}>
//                       {block.name}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={2} className="d-flex align-items-end">
//               <Button variant="outline-secondary" onClick={handleResetFilters} className="w-100">
//                 <i className="bi bi-arrow-repeat me-1"></i> Reset
//               </Button>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Centers Table */}
//       <Card className="shadow-sm">
//         <Card.Header className="bg-white">
//           <div className="d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">
//               <i className="bi bi-table me-2"></i>
//               Center-wise Preference Details
//             </h5>
//             <Badge bg="info">
//               {filteredData.length} Centers Found
//             </Badge>
//           </div>
//         </Card.Header>
//         <Card.Body className="p-0">
//           <div className="table-responsive">
//             <Table striped bordered hover className="mb-0">
//               <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//                 <tr>
//                   <th>#</th>
//                   <th>District</th>
//                   <th>Block</th>
//                   <th>Center Name</th>
//                   <th>Center ID</th>
//                   <th colSpan="2" className="text-center">CP1 Count</th>
//                   <th colSpan="2" className="text-center">CP2 Count</th>
//                   <th>Total</th>
//                 </tr>
//                 <tr>
//                   <th></th>
//                   <th></th>
//                   <th></th>
//                   <th></th>
//                   <th></th>
//                   <th className="text-center" style={{ background: '#5a67d8' }}>Selected</th>
//                   <th className="text-center" style={{ background: '#5a67d8' }}>Waiting</th>
//                   <th className="text-center" style={{ background: '#38a169' }}>Selected</th>
//                   <th className="text-center" style={{ background: '#38a169' }}>Waiting</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((center, index) => (
//                     <tr key={center._id}>
//                       <td>{index + 1}</td>
//                       <td>{center.districtName}</td>
//                       <td>{center.blockName}</td>
//                       <td className="fw-bold">{center.centerName}</td>
//                       <td>{center.centerId}</td>
//                       <td className="text-center">
//                         {getCountBadge(center.cp1Selected, "cp1")}
//                       </td>
//                       <td className="text-center">
//                         <Badge bg="warning" text="dark">{center.cp1Waiting}</Badge>
//                       </td>
//                       <td className="text-center">
//                         {getCountBadge(center.cp2Selected, "cp2")}
//                       </td>
//                       <td className="text-center">
//                         <Badge bg="warning" text="dark">{center.cp2Waiting}</Badge>
//                       </td>
//                       <td className="text-center">
//                         <Badge bg="info" pill>
//                           {center.totalPreferences}
//                         </Badge>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="10" className="text-center py-5">
//                       <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
//                       <p className="mt-2 text-muted">No centers found</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//         <Card.Footer className="bg-light">
//           <div className="d-flex justify-content-between align-items-center">
//             <small className="text-muted">
//               <i className="bi bi-info-circle me-1"></i>
//               Showing {filteredData.length} out of {centersData.length} centers
//             </small>
//             <div>
//               <Badge bg="primary" className="me-2">CP1</Badge>
//               <Badge bg="success" className="me-2">CP2</Badge>
//               <Badge bg="warning" text="dark">Waiting Count</Badge>
//             </div>
//           </div>
//         </Card.Footer>
//       </Card>

//       <style jsx>{`
//         .table-responsive {
//           overflow-x: auto;
//         }
        
//         table th, table td {
//           vertical-align: middle;
//         }
        
//         .fw-bold {
//           font-weight: 600;
//         }
        
//         @media (max-width: 768px) {
//           .table-responsive {
//             font-size: 0.85rem;
//           }
//         }
//       `}</style>
//     </Container>
//   );
// };











// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Button, Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
// import { getCenterPreferenceDashboard } from "../../services/StudentRegistrationServices/StudentRegistrationService";
// import MBCenters from "../StudentRegistration/MBCenters.json";

// export const CenterPreferenceDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [centersData, setCentersData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedBlock, setSelectedBlock] = useState("");
//   const [districts, setDistricts] = useState([]);
//   const [blocks, setBlocks] = useState([]);
//   const [summary, setSummary] = useState({
//     totalCenters: 0,
//     totalCp1Selected: 0,
//     totalCp1Waiting: 0,
//     totalCp2Selected: 0,
//     totalCp2Waiting: 0,
//     totalPreferences: 0,
//     totalAdmissionDone: 0,
//     totalProvisional: 0,
//     totalWaitingSelected: 0
//   });
//   const [filteredSummary, setFilteredSummary] = useState({
//     totalCenters: 0,
//     totalCp1Selected: 0,
//     totalCp1Waiting: 0,
//     totalCp2Selected: 0,
//     totalCp2Waiting: 0,
//     totalPreferences: 0,
//     totalAdmissionDone: 0,
//     totalProvisional: 0,
//     totalWaitingSelected: 0
//   });

//   const STATIC_CENTERS_DATA = MBCenters;

//   // Safe sort function for strings
//   const safeSort = (a, b) => {
//     const nameA = String(a.name || "").toLowerCase();
//     const nameB = String(b.name || "").toLowerCase();
//     return nameA.localeCompare(nameB);
//   };

//   // Calculate summary for filtered data
//   const calculateFilteredSummary = (data) => {
//     const totalCenters = data.length;
//     const totalCp1Selected = data.reduce((sum, center) => sum + center.cp1.selectedTotal, 0);
//     const totalCp1Waiting = data.reduce((sum, center) => sum + center.cp1.waitingTotal, 0);
//     const totalCp2Selected = data.reduce((sum, center) => sum + center.cp2.selectedTotal, 0);
//     const totalCp2Waiting = data.reduce((sum, center) => sum + center.cp2.waitingTotal, 0);
//     const totalPreferences = totalCp1Selected + totalCp1Waiting + totalCp2Selected + totalCp2Waiting;
//     const totalAdmissionDone = data.reduce((sum, center) => sum + center.cp1.admissionDone + center.cp2.admissionDone, 0);
//     const totalProvisional = data.reduce((sum, center) => sum + center.cp1.provisional + center.cp2.provisional, 0);
//     const totalWaitingSelected = data.reduce((sum, center) => sum + center.cp1.waitingSelected + center.cp2.waitingSelected, 0);

//     setFilteredSummary({
//       totalCenters,
//       totalCp1Selected,
//       totalCp1Waiting,
//       totalCp2Selected,
//       totalCp2Waiting,
//       totalPreferences,
//       totalAdmissionDone,
//       totalProvisional,
//       totalWaitingSelected
//     });
//   };

//   // Process the dashboard data and merge with center info
//   const processDashboardData = (dashboardData) => {
//     console.log("Dashboard data:", dashboardData);
//     console.log("Static centers data:", STATIC_CENTERS_DATA);

//     // Create maps for CP1 and CP2 data
//     const cp1Map = new Map();
//     const cp2Map = new Map();

//     // Process CP1 data from the new API structure
//     if (dashboardData.preference1 && Array.isArray(dashboardData.preference1)) {
//       dashboardData.preference1.forEach(item => {
//         const centerName = item.center;
//         if (centerName) {
//           if (!cp1Map.has(centerName)) {
//             cp1Map.set(centerName, {
//               selectedTotal: 0,
//               admissionDone: 0,
//               provisional: 0,
//               waitingSelected: 0,
//               waitingTotal: 0
//             });
//           }
          
//           const current = cp1Map.get(centerName);
//           current.selectedTotal += item.selected.total || 0;
//           current.admissionDone += item.selected.admissionDone || 0;
//           current.provisional += item.selected.provisional || 0;
//           current.waitingSelected += item.selected.waiting || 0;
//           current.waitingTotal += item.waiting.total || 0;
          
//           cp1Map.set(centerName, current);
//         }
//       });
//     }

//     // Process CP2 data from the new API structure
//     if (dashboardData.preference2 && Array.isArray(dashboardData.preference2)) {
//       dashboardData.preference2.forEach(item => {
//         const centerName = item.center;
//         if (centerName) {
//           if (!cp2Map.has(centerName)) {
//             cp2Map.set(centerName, {
//               selectedTotal: 0,
//               admissionDone: 0,
//               provisional: 0,
//               waitingSelected: 0,
//               waitingTotal: 0
//             });
//           }
          
//           const current = cp2Map.get(centerName);
//           current.selectedTotal += item.selected.total || 0;
//           current.admissionDone += item.selected.admissionDone || 0;
//           current.provisional += item.selected.provisional || 0;
//           current.waitingSelected += item.selected.waiting || 0;
//           current.waitingTotal += item.waiting.total || 0;
          
//           cp2Map.set(centerName, current);
//         }
//       });
//     }

//     // Handle null center data (students who selected no center or center not found)
//     const nullCenterCp1 = cp1Map.get(null) || { selectedTotal: 0, admissionDone: 0, provisional: 0, waitingSelected: 0, waitingTotal: 0 };
//     const nullCenterCp2 = cp2Map.get(null) || { selectedTotal: 0, admissionDone: 0, provisional: 0, waitingSelected: 0, waitingTotal: 0 };

//     // Merge with static centers data
//     const mergedData = STATIC_CENTERS_DATA.map(center => {
//       const centerName = center.centerName;
//       const cp1Data = cp1Map.get(centerName) || { selectedTotal: 0, admissionDone: 0, provisional: 0, waitingSelected: 0, waitingTotal: 0 };
//       const cp2Data = cp2Map.get(centerName) || { selectedTotal: 0, admissionDone: 0, provisional: 0, waitingSelected: 0, waitingTotal: 0 };
      
//       return {
//         ...center,
//         cp1: {
//           selectedTotal: cp1Data.selectedTotal,
//           admissionDone: cp1Data.admissionDone,
//           provisional: cp1Data.provisional,
//           waitingSelected: cp1Data.waitingSelected,
//           waitingTotal: cp1Data.waitingTotal
//         },
//         cp2: {
//           selectedTotal: cp2Data.selectedTotal,
//           admissionDone: cp2Data.admissionDone,
//           provisional: cp2Data.provisional,
//           waitingSelected: cp2Data.waitingSelected,
//           waitingTotal: cp2Data.waitingTotal
//         },
//         totalPreferences: cp1Data.selectedTotal + cp1Data.waitingTotal + cp2Data.selectedTotal + cp2Data.waitingTotal
//       };
//     });

//     // Add null center entry if there are students without center preference
//     if (nullCenterCp1.selectedTotal > 0 || nullCenterCp1.waitingTotal > 0 || nullCenterCp2.selectedTotal > 0 || nullCenterCp2.waitingTotal > 0) {
//       mergedData.unshift({
//         _id: "null-center",
//         districtName: "No Center Selected",
//         blockName: "No Center Selected",
//         centerName: "No Center Selected / Invalid Center",
//         districtId: "N/A",
//         blockId: "N/A",
//         cp1: nullCenterCp1,
//         cp2: nullCenterCp2,
//         totalPreferences: nullCenterCp1.selectedTotal + nullCenterCp1.waitingTotal + nullCenterCp2.selectedTotal + nullCenterCp2.waitingTotal
//       });
//     }

//     // Calculate total summary
//     const totalCenters = mergedData.length;
//     const totalCp1Selected = mergedData.reduce((sum, center) => sum + center.cp1.selectedTotal, 0);
//     const totalCp1Waiting = mergedData.reduce((sum, center) => sum + center.cp1.waitingTotal, 0);
//     const totalCp2Selected = mergedData.reduce((sum, center) => sum + center.cp2.selectedTotal, 0);
//     const totalCp2Waiting = mergedData.reduce((sum, center) => sum + center.cp2.waitingTotal, 0);
//     const totalPreferences = totalCp1Selected + totalCp1Waiting + totalCp2Selected + totalCp2Waiting;
//     const totalAdmissionDone = mergedData.reduce((sum, center) => sum + center.cp1.admissionDone + center.cp2.admissionDone, 0);
//     const totalProvisional = mergedData.reduce((sum, center) => sum + center.cp1.provisional + center.cp2.provisional, 0);
//     const totalWaitingSelected = mergedData.reduce((sum, center) => sum + center.cp1.waitingSelected + center.cp2.waitingSelected, 0);

//     setSummary({
//       totalCenters,
//       totalCp1Selected,
//       totalCp1Waiting,
//       totalCp2Selected,
//       totalCp2Waiting,
//       totalPreferences,
//       totalAdmissionDone,
//       totalProvisional,
//       totalWaitingSelected
//     });

//     // Extract unique districts for filters
//     const uniqueDistrictsMap = new Map();
//     mergedData.forEach(center => {
//       if (center.districtId && center.districtId !== "N/A" && center.districtName) {
//         const districtName = String(center.districtName).trim();
//         if (!uniqueDistrictsMap.has(center.districtId)) {
//           uniqueDistrictsMap.set(center.districtId, districtName);
//         }
//       }
//     });
    
//     const uniqueDistricts = Array.from(uniqueDistrictsMap.entries())
//       .map(([id, name]) => ({ id, name: String(name || "") }))
//       .sort(safeSort);
    
//     setDistricts(uniqueDistricts);
//     setCentersData(mergedData);
//     setFilteredData(mergedData);
//     calculateFilteredSummary(mergedData);
    
//     // Initialize blocks with all blocks (for filter dropdown)
//     const uniqueBlocksMap = new Map();
//     mergedData.forEach(center => {
//       if (center.blockId && center.blockId !== "N/A" && center.blockName) {
//         const blockName = String(center.blockName).trim();
//         if (!uniqueBlocksMap.has(center.blockId)) {
//           uniqueBlocksMap.set(center.blockId, blockName);
//         }
//       }
//     });
    
//     const uniqueBlocks = Array.from(uniqueBlocksMap.entries())
//       .map(([id, name]) => ({ id, name: String(name || "") }))
//       .sort(safeSort);
    
//     setBlocks(uniqueBlocks);
//   };

//   const fetchCenterPreferenceDash = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await getCenterPreferenceDashboard();
//       console.log("API Response:", response);
      
//       if (response && response.success && response.data) {
//         processDashboardData(response.data);
//       } else {
//         setError("Failed to fetch dashboard data");
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       setError("Error fetching dashboard data: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCenterPreferenceDash();
//   }, []);

//   // Handle district filter change
//   const handleDistrictChange = (e) => {
//     const districtId = e.target.value;
//     setSelectedDistrict(districtId);
//     setSelectedBlock(""); // Reset block when district changes
    
//     if (districtId === "") {
//       setFilteredData(centersData);
//       calculateFilteredSummary(centersData);
//       // Update blocks list
//       const uniqueBlocksMap = new Map();
//       centersData.forEach(center => {
//         if (center.blockId && center.blockId !== "N/A" && center.blockName) {
//           const blockName = String(center.blockName).trim();
//           if (!uniqueBlocksMap.has(center.blockId)) {
//             uniqueBlocksMap.set(center.blockId, blockName);
//           }
//         }
//       });
      
//       const uniqueBlocks = Array.from(uniqueBlocksMap.entries())
//         .map(([id, name]) => ({ id, name: String(name || "") }))
//         .sort(safeSort);
      
//       setBlocks(uniqueBlocks);
//     } else {
//       const filtered = centersData.filter(center => center.districtId === districtId);
//       setFilteredData(filtered);
//       calculateFilteredSummary(filtered);
      
//       // Update blocks list based on selected district
//       const uniqueBlocksMap = new Map();
//       filtered.forEach(center => {
//         if (center.blockId && center.blockId !== "N/A" && center.blockName) {
//           const blockName = String(center.blockName).trim();
//           if (!uniqueBlocksMap.has(center.blockId)) {
//             uniqueBlocksMap.set(center.blockId, blockName);
//           }
//         }
//       });
      
//       const uniqueBlocks = Array.from(uniqueBlocksMap.entries())
//         .map(([id, name]) => ({ id, name: String(name || "") }))
//         .sort(safeSort);
      
//       setBlocks(uniqueBlocks);
//     }
//   };

//   // Handle block filter change
//   const handleBlockChange = (e) => {
//     const blockId = e.target.value;
//     setSelectedBlock(blockId);
    
//     if (blockId === "") {
//       if (selectedDistrict === "") {
//         setFilteredData(centersData);
//         calculateFilteredSummary(centersData);
//       } else {
//         const filtered = centersData.filter(center => center.districtId === selectedDistrict);
//         setFilteredData(filtered);
//         calculateFilteredSummary(filtered);
//       }
//     } else {
//       let filtered = centersData.filter(center => center.blockId === blockId);
//       if (selectedDistrict !== "") {
//         filtered = filtered.filter(center => center.districtId === selectedDistrict);
//       }
//       setFilteredData(filtered);
//       calculateFilteredSummary(filtered);
//     }
//   };

//   // Reset all filters
//   const handleResetFilters = () => {
//     setSelectedDistrict("");
//     setSelectedBlock("");
//     setFilteredData(centersData);
//     calculateFilteredSummary(centersData);
//     // Reset blocks to all blocks
//     const uniqueBlocksMap = new Map();
//     centersData.forEach(center => {
//       if (center.blockId && center.blockId !== "N/A" && center.blockName) {
//         const blockName = String(center.blockName).trim();
//         if (!uniqueBlocksMap.has(center.blockId)) {
//           uniqueBlocksMap.set(center.blockId, blockName);
//         }
//       }
//     });
    
//     const uniqueBlocks = Array.from(uniqueBlocksMap.entries())
//       .map(([id, name]) => ({ id, name: String(name || "") }))
//       .sort(safeSort);
    
//     setBlocks(uniqueBlocks);
//   };

//   // Get badge for count display
//   const getCountBadge = (count, variant = "primary") => {
//     if (count === 0) return <Badge bg="secondary">0</Badge>;
//     return <Badge bg={variant}>{count}</Badge>;
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">Loading dashboard data...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="mt-5">
//         <Alert variant="danger">
//           <Alert.Heading>Error Loading Dashboard</Alert.Heading>
//           <p>{error}</p>
//           <Button variant="outline-danger" onClick={fetchCenterPreferenceDash}>
//             Retry
//           </Button>
//         </Alert>
//       </Container>
//     );
//   }

//   // Determine which summary to show (filtered or total)
//   const currentSummary = selectedDistrict || selectedBlock ? filteredSummary : summary;

//   return (
//     <Container fluid className="mt-4">
//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex flex-wrap gap-3 align-items-center">
//             <a 
//               href="https://registration.buniyaadhry.com/mb-counselling-attendance" 
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-decoration-none"
//               style={{ color: '#0d6efd', fontWeight: '500' }}
//             >
//               <i className="bi bi-calendar-check me-1"></i>
//               Attendance
//             </a>
            
//             <span className="text-muted">|</span>
            
//             <a 
//               href="https://registration.buniyaadhry.com/mb-center-allocation-counselling" 
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-decoration-none"
//               style={{ color: '#0d6efd', fontWeight: '500' }}
//             >
//               <i className="bi bi-building me-1"></i>
//               Center Allocation & Distance
//             </a>
            
//             <span className="text-muted">|</span>
            
//             <a 
//               href="https://registration.buniyaadhry.com/mb-doc-verfication-counselling" 
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-decoration-none"
//               style={{ color: '#0d6efd', fontWeight: '500' }}
//             >
//               <i className="bi bi-file-earmark-check me-1"></i>
//               Doc Verification
//             </a>
            
//             <span className="text-muted">|</span>
            
//             <a 
//               href="https://registration.buniyaadhry.com/mb-provisional-selected-counselling" 
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-decoration-none"
//               style={{ color: '#0d6efd', fontWeight: '500' }}
//             >
//               <i className="bi bi-person-check me-1"></i>
//               Admission Status
//             </a>
            
//             <span className="text-muted">|</span>
            
//             <a 
//               href="https://registration.buniyaadhry.com/center-preference-dashboard" 
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-decoration-none"
//               style={{ color: '#0d6efd', fontWeight: '500' }}
//             >
//               <i className="bi bi-speedometer2 me-1"></i>
//               All Dashboard
//             </a>
            
//             <span className="text-muted">|</span>
            
//             <a 
//               href="https://registration.buniyaadhry.com/mb-l3-attendance-pdf" 
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-decoration-none"
//               style={{ color: '#0d6efd', fontWeight: '500' }}
//             >
//               <i className="bi bi-file-pdf me-1"></i>
//               Attendance Pdf
//             </a>
//           </div>
//         </Col>
//       </Row>
      
//       {/* Header */}
//       <Row className="mb-4">
//         <Col>
//           <h2 className="mb-3">
//             <i className="bi bi-bar-chart-steps me-2"></i>
//             Center Preference Dashboard
//           </h2>
//           <p className="text-muted">
//             Track center preferences (CP1 and CP2) across all districts and blocks with detailed admission status breakdown
//           </p>
//         </Col>
//       </Row>

//       {/* Summary Cards - Shows filtered summary when filters are applied */}
//       <Row className="mb-4">
//         <Col md={3}>
//           <Card className="text-center shadow-sm">
//             <Card.Body>
//               <i className="bi bi-building fs-1 text-primary"></i>
//               <h3 className="mt-2">{currentSummary.totalCenters}</h3>
//               <p className="text-muted mb-0">
//                 {selectedDistrict || selectedBlock ? "Filtered Centers" : "Total Centers"}
//               </p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm">
//             <Card.Body>
//               <i className="bi bi-check-circle fs-1 text-primary"></i>
//               <h3 className="mt-2">{currentSummary.totalCp1Selected + currentSummary.totalCp2Selected}</h3>
//               <p className="text-muted mb-0">
//                 {selectedDistrict || selectedBlock ? "Filtered Selected Students" : "Total Selected Students"}
//               </p>
//               <small className="text-muted">
//                 <Badge bg="success" className="me-1">AD: {currentSummary.totalAdmissionDone}</Badge>
//                 <Badge bg="info">PV: {currentSummary.totalProvisional}</Badge>
//               </small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm">
//             <Card.Body>
//               <i className="bi bi-star fs-1 text-warning"></i>
//               <h3 className="mt-2">{currentSummary.totalCp1Waiting + currentSummary.totalCp2Waiting}</h3>
//               <p className="text-muted mb-0">
//                 {selectedDistrict || selectedBlock ? "Filtered Waiting Students" : "Total Waiting Students"}
//               </p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm">
//             <Card.Body>
//               <i className="bi bi-pie-chart fs-1 text-info"></i>
//               <h3 className="mt-2">{currentSummary.totalPreferences}</h3>
//               <p className="text-muted mb-0">
//                 {selectedDistrict || selectedBlock ? "Filtered Total Preferences" : "Total Preferences"}
//               </p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Filters */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Row>
//             <Col md={5}>
//               <Form.Group>
//                 <Form.Label>
//                   <i className="bi bi-geo-alt me-1"></i> District
//                 </Form.Label>
//                 <Form.Select value={selectedDistrict} onChange={handleDistrictChange}>
//                   <option value="">All Districts</option>
//                   {districts.map(district => (
//                     <option key={district.id} value={district.id}>
//                       {district.name}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={5}>
//               <Form.Group>
//                 <Form.Label>
//                   <i className="bi bi-grid me-1"></i> Block
//                 </Form.Label>
//                 <Form.Select value={selectedBlock} onChange={handleBlockChange}>
//                   <option value="">All Blocks</option>
//                   {blocks.map(block => (
//                     <option key={block.id} value={block.id}>
//                       {block.name}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={2} className="d-flex align-items-end">
//               <Button variant="outline-secondary" onClick={handleResetFilters} className="w-100">
//                 <i className="bi bi-arrow-repeat me-1"></i> Reset
//               </Button>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Centers Table */}
//       <Card className="shadow-sm">
//         <Card.Header className="bg-white">
//           <div className="d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">
//               <i className="bi bi-table me-2"></i>
//               Center-wise Preference Details
//             </h5>
//             <Badge bg="info">
//               {filteredData.length} Centers Found
//             </Badge>
//           </div>
//         </Card.Header>
//         <Card.Body className="p-0">
//           <div className="table-responsive" style={{ overflowX: 'auto' }}>
//             <Table striped bordered hover className="mb-0" style={{ minWidth: '1000px' }}>
//               <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//                 <tr>
//                   <th rowSpan="2" style={{ verticalAlign: 'middle' }}>#</th>
//                   <th rowSpan="2" style={{ verticalAlign: 'middle' }}>District</th>
//                   <th rowSpan="2" style={{ verticalAlign: 'middle' }}>Center Name</th>
//                   <th colSpan="4" className="text-center">CP1 Count</th>
//                   <th colSpan="4" className="text-center">CP2 Count</th>
//                   <th rowSpan="2" style={{ verticalAlign: 'middle' }}>Total</th>
//                 </tr>
//                 <tr>
//                   <th className="text-center" style={{ background: '#5a67d8' }}>Selected Total</th>
//                   <th className="text-center" style={{ background: '#5a67d8' }}>Admission Done</th>
//                   <th className="text-center" style={{ background: '#5a67d8' }}>Provisional</th>
//                   <th className="text-center" style={{ background: '#5a67d8' }}>Waiting</th>
//                   <th className="text-center" style={{ background: '#38a169' }}>Selected Total</th>
//                   <th className="text-center" style={{ background: '#38a169' }}>Admission Done</th>
//                   <th className="text-center" style={{ background: '#38a169' }}>Provisional</th>
//                   <th className="text-center" style={{ background: '#38a169' }}>Waiting</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((center, index) => (
//                     <tr key={center._id}>
//                       <td>{index + 1}</td>
//                       <td>{center.districtName}</td>
//                       <td className="fw-bold">{center.centerName}</td>
//                       {/* CP1 Columns */}
//                       <td className="text-center">
//                         {getCountBadge(center.cp1.selectedTotal, "primary")}
//                       </td>
//                       <td className="text-center">
//                         {getCountBadge(center.cp1.admissionDone, "success")}
//                       </td>
//                       <td className="text-center">
//                         {getCountBadge(center.cp1.provisional, "info")}
//                       </td>
//                       <td className="text-center">
//                         {getCountBadge(center.cp1.waitingSelected + center.cp1.waitingTotal, "warning")}
//                       </td>
//                       {/* CP2 Columns */}
//                       <td className="text-center">
//                         {getCountBadge(center.cp2.selectedTotal, "primary")}
//                       </td>
//                       <td className="text-center">
//                         {getCountBadge(center.cp2.admissionDone, "success")}
//                       </td>
//                       <td className="text-center">
//                         {getCountBadge(center.cp2.provisional, "info")}
//                       </td>
//                       <td className="text-center">
//                         {getCountBadge(center.cp2.waitingSelected + center.cp2.waitingTotal, "warning")}
//                       </td>
//                       <td className="text-center">
//                         <Badge bg="dark" pill>
//                           {center.totalPreferences}
//                         </Badge>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="12" className="text-center py-5">
//                       <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
//                       <p className="mt-2 text-muted">No centers found</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//         <Card.Footer className="bg-light">
//           <div className="d-flex justify-content-between align-items-center flex-wrap">
//             <small className="text-muted">
//               <i className="bi bi-info-circle me-1"></i>
//               Showing {filteredData.length} out of {centersData.length} centers
//             </small>
//             <div className="mt-2 mt-sm-0">
//               <Badge bg="primary" className="me-2">Selected Total</Badge>
//               <Badge bg="success" className="me-2">Admission Done</Badge>
//               <Badge bg="info" className="me-2">Provisional</Badge>
//               <Badge bg="warning">Waiting (Selected + Waiting List)</Badge>
//             </div>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };











import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
import { getCenterPreferenceDashboard } from "../../services/StudentRegistrationServices/StudentRegistrationService";
import MBCenters from "../StudentRegistration/MBCenters.json";

export const CenterPreferenceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [centersData, setCentersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  
  // Summary states
  const [overallSummary, setOverallSummary] = useState({
    cp1: { admissionDone: 0, provisional: 0, waiting: 0, total: 0 },
    cp2: { admissionDone: 0, provisional: 0, waiting: 0, total: 0 },
    grandTotal: 0
  });
  
  const [filteredSummary, setFilteredSummary] = useState({
    cp1: { admissionDone: 0, provisional: 0, waiting: 0, total: 0 },
    cp2: { admissionDone: 0, provisional: 0, waiting: 0, total: 0 },
    grandTotal: 0
  });

  const STATIC_CENTERS_DATA = MBCenters;

  // Safe sort function for strings
  const safeSort = (a, b) => {
    const nameA = String(a.name || "").toLowerCase();
    const nameB = String(b.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  };

  // Calculate summary for filtered data
  const calculateFilteredSummary = (data) => {
    const cp1AdmissionDone = data.reduce((sum, center) => sum + (center.cp1.admissionDone || 0), 0);
    const cp1Provisional = data.reduce((sum, center) => sum + (center.cp1.provisional || 0), 0);
    const cp1Waiting = data.reduce((sum, center) => sum + (center.cp1.waitingTotal || 0), 0);
    const cp1Total = cp1AdmissionDone + cp1Provisional + cp1Waiting;
    
    const cp2AdmissionDone = data.reduce((sum, center) => sum + (center.cp2.admissionDone || 0), 0);
    const cp2Provisional = data.reduce((sum, center) => sum + (center.cp2.provisional || 0), 0);
    const cp2Waiting = data.reduce((sum, center) => sum + (center.cp2.waitingTotal || 0), 0);
    const cp2Total = cp2AdmissionDone + cp2Provisional + cp2Waiting;
    
    const grandTotal = cp1Total + cp2Total;
    
    setFilteredSummary({
      cp1: { admissionDone: cp1AdmissionDone, provisional: cp1Provisional, waiting: cp1Waiting, total: cp1Total },
      cp2: { admissionDone: cp2AdmissionDone, provisional: cp2Provisional, waiting: cp2Waiting, total: cp2Total },
      grandTotal
    });
  };

  // Process the dashboard data and merge with center info
  const processDashboardData = (dashboardData) => {
    console.log("Dashboard data:", dashboardData);
    console.log("Static centers data:", STATIC_CENTERS_DATA);

    // Create maps for CP1 and CP2 data
    const cp1Map = new Map();
    const cp2Map = new Map();

    // Process CP1 data from the new API structure
    if (dashboardData.preference1 && Array.isArray(dashboardData.preference1)) {
      dashboardData.preference1.forEach(item => {
        const centerName = item.center;
        if (centerName && centerName !== null) {
          if (!cp1Map.has(centerName)) {
            cp1Map.set(centerName, {
              admissionDone: 0,
              provisional: 0,
              waitingTotal: 0
            });
          }
          
          const current = cp1Map.get(centerName);
          current.admissionDone += item.selected?.admissionDone || 0;
          current.provisional += item.selected?.provisional || 0;
          current.waitingTotal += item.waiting?.total || 0;
          
          cp1Map.set(centerName, current);
        }
      });
    }

    // Process CP2 data from the new API structure
    if (dashboardData.preference2 && Array.isArray(dashboardData.preference2)) {
      dashboardData.preference2.forEach(item => {
        const centerName = item.center;
        if (centerName && centerName !== null) {
          if (!cp2Map.has(centerName)) {
            cp2Map.set(centerName, {
              admissionDone: 0,
              provisional: 0,
              waitingTotal: 0
            });
          }
          
          const current = cp2Map.get(centerName);
          current.admissionDone += item.selected?.admissionDone || 0;
          current.provisional += item.selected?.provisional || 0;
          current.waitingTotal += item.waiting?.total || 0;
          
          cp2Map.set(centerName, current);
        }
      });
    }

    // Merge with static centers data
    const mergedData = STATIC_CENTERS_DATA.map(center => {
      const centerName = center.centerName;
      const cp1Data = cp1Map.get(centerName) || { admissionDone: 0, provisional: 0, waitingTotal: 0 };
      const cp2Data = cp2Map.get(centerName) || { admissionDone: 0, provisional: 0, waitingTotal: 0 };
      
      return {
        ...center,
        cp1: {
          admissionDone: cp1Data.admissionDone,
          provisional: cp1Data.provisional,
          waitingTotal: cp1Data.waitingTotal
        },
        cp2: {
          admissionDone: cp2Data.admissionDone,
          provisional: cp2Data.provisional,
          waitingTotal: cp2Data.waitingTotal
        }
      };
    });

    // Remove any centers with null/empty names and sort by districtName
    const validData = mergedData
      .filter(center => center.centerName && center.centerName !== "undefined" && center.centerName !== "null")
      .sort((a, b) => {
        // Sort by district name first
        const districtCompare = String(a.districtName || "").localeCompare(String(b.districtName || ""));
        if (districtCompare !== 0) return districtCompare;
        // Then by block name
        const blockCompare = String(a.blockName || "").localeCompare(String(b.blockName || ""));
        if (blockCompare !== 0) return blockCompare;
        // Finally by center name
        return String(a.centerName || "").localeCompare(String(b.centerName || ""));
      });

    // Calculate overall summary
    const cp1AdmissionDone = validData.reduce((sum, center) => sum + center.cp1.admissionDone, 0);
    const cp1Provisional = validData.reduce((sum, center) => sum + center.cp1.provisional, 0);
    const cp1Waiting = validData.reduce((sum, center) => sum + center.cp1.waitingTotal, 0);
    const cp1Total = cp1AdmissionDone + cp1Provisional + cp1Waiting;
    
    const cp2AdmissionDone = validData.reduce((sum, center) => sum + center.cp2.admissionDone, 0);
    const cp2Provisional = validData.reduce((sum, center) => sum + center.cp2.provisional, 0);
    const cp2Waiting = validData.reduce((sum, center) => sum + center.cp2.waitingTotal, 0);
    const cp2Total = cp2AdmissionDone + cp2Provisional + cp2Waiting;
    
    const grandTotal = cp1Total + cp2Total;

    setOverallSummary({
      cp1: { admissionDone: cp1AdmissionDone, provisional: cp1Provisional, waiting: cp1Waiting, total: cp1Total },
      cp2: { admissionDone: cp2AdmissionDone, provisional: cp2Provisional, waiting: cp2Waiting, total: cp2Total },
      grandTotal
    });

    // Extract unique districts for filters
    const uniqueDistrictsMap = new Map();
    validData.forEach(center => {
      if (center.districtId && center.districtId !== "N/A" && center.districtName) {
        const districtName = String(center.districtName).trim();
        if (!uniqueDistrictsMap.has(center.districtId)) {
          uniqueDistrictsMap.set(center.districtId, districtName);
        }
      }
    });
    
    const uniqueDistricts = Array.from(uniqueDistrictsMap.entries())
      .map(([id, name]) => ({ id, name: String(name || "") }))
      .sort(safeSort);
    
    setDistricts(uniqueDistricts);
    setCentersData(validData);
    setFilteredData(validData);
    calculateFilteredSummary(validData);
    
    // Initialize blocks with all blocks
    const uniqueBlocksMap = new Map();
    validData.forEach(center => {
      if (center.blockId && center.blockId !== "N/A" && center.blockName) {
        const blockName = String(center.blockName).trim();
        if (!uniqueBlocksMap.has(center.blockId)) {
          uniqueBlocksMap.set(center.blockId, blockName);
        }
      }
    });
    
    const uniqueBlocks = Array.from(uniqueBlocksMap.entries())
      .map(([id, name]) => ({ id, name: String(name || "") }))
      .sort(safeSort);
    
    setBlocks(uniqueBlocks);
  };

  const fetchCenterPreferenceDash = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCenterPreferenceDashboard();
      console.log("API Response:", response);
      
      if (response && response.success && response.data) {
        processDashboardData(response.data);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Error fetching dashboard data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenterPreferenceDash();
  }, []);

  // Handle district filter change
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedBlock("");
    
    if (districtId === "") {
      setFilteredData(centersData);
      calculateFilteredSummary(centersData);
      // Reset blocks list
      const uniqueBlocksMap = new Map();
      centersData.forEach(center => {
        if (center.blockId && center.blockId !== "N/A" && center.blockName) {
          const blockName = String(center.blockName).trim();
          if (!uniqueBlocksMap.has(center.blockId)) {
            uniqueBlocksMap.set(center.blockId, blockName);
          }
        }
      });
      
      const uniqueBlocks = Array.from(uniqueBlocksMap.entries())
        .map(([id, name]) => ({ id, name: String(name || "") }))
        .sort(safeSort);
      
      setBlocks(uniqueBlocks);
    } else {
      const filtered = centersData.filter(center => center.districtId === districtId);
      setFilteredData(filtered);
      calculateFilteredSummary(filtered);
      
      // Update blocks list based on selected district
      const uniqueBlocksMap = new Map();
      filtered.forEach(center => {
        if (center.blockId && center.blockId !== "N/A" && center.blockName) {
          const blockName = String(center.blockName).trim();
          if (!uniqueBlocksMap.has(center.blockId)) {
            uniqueBlocksMap.set(center.blockId, blockName);
          }
        }
      });
      
      const uniqueBlocks = Array.from(uniqueBlocksMap.entries())
        .map(([id, name]) => ({ id, name: String(name || "") }))
        .sort(safeSort);
      
      setBlocks(uniqueBlocks);
    }
  };

  // Handle block filter change
  const handleBlockChange = (e) => {
    const blockId = e.target.value;
    setSelectedBlock(blockId);
    
    if (blockId === "") {
      if (selectedDistrict === "") {
        setFilteredData(centersData);
        calculateFilteredSummary(centersData);
      } else {
        const filtered = centersData.filter(center => center.districtId === selectedDistrict);
        setFilteredData(filtered);
        calculateFilteredSummary(filtered);
      }
    } else {
      let filtered = centersData.filter(center => center.blockId === blockId);
      if (selectedDistrict !== "") {
        filtered = filtered.filter(center => center.districtId === selectedDistrict);
      }
      setFilteredData(filtered);
      calculateFilteredSummary(filtered);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedDistrict("");
    setSelectedBlock("");
    setFilteredData(centersData);
    calculateFilteredSummary(centersData);
    // Reset blocks to all blocks
    const uniqueBlocksMap = new Map();
    centersData.forEach(center => {
      if (center.blockId && center.blockId !== "N/A" && center.blockName) {
        const blockName = String(center.blockName).trim();
        if (!uniqueBlocksMap.has(center.blockId)) {
          uniqueBlocksMap.set(center.blockId, blockName);
        }
      }
    });
    
    const uniqueBlocks = Array.from(uniqueBlocksMap.entries())
      .map(([id, name]) => ({ id, name: String(name || "") }))
      .sort(safeSort);
    
    setBlocks(uniqueBlocks);
  };

  // Get badge for count display
  const getCountBadge = (count, variant = "primary") => {
    if (count === 0) return <Badge bg="secondary">0</Badge>;
    return <Badge bg={variant}>{count}</Badge>;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchCenterPreferenceDash}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  // Determine which summary to show (filtered or total)
  const currentSummary = selectedDistrict || selectedBlock ? filteredSummary : overallSummary;

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <a 
              href="https://registration.buniyaadhry.com/mb-counselling-attendance" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
              style={{ color: '#0d6efd', fontWeight: '500' }}
            >
              <i className="bi bi-calendar-check me-1"></i>
              Attendance
            </a>
            
            <span className="text-muted">|</span>
            
            <a 
              href="https://registration.buniyaadhry.com/mb-center-allocation-counselling" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
              style={{ color: '#0d6efd', fontWeight: '500' }}
            >
              <i className="bi bi-building me-1"></i>
              Center Allocation & Distance
            </a>
            
            <span className="text-muted">|</span>
            
            <a 
              href="https://registration.buniyaadhry.com/mb-doc-verfication-counselling" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
              style={{ color: '#0d6efd', fontWeight: '500' }}
            >
              <i className="bi bi-file-earmark-check me-1"></i>
              Doc Verification
            </a>
            
            <span className="text-muted">|</span>
            
            <a 
              href="https://registration.buniyaadhry.com/mb-provisional-selected-counselling" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
              style={{ color: '#0d6efd', fontWeight: '500' }}
            >
              <i className="bi bi-person-check me-1"></i>
              Admission Status
            </a>
            
            <span className="text-muted">|</span>
            
            <a 
              href="https://registration.buniyaadhry.com/center-preference-dashboard" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
              style={{ color: '#0d6efd', fontWeight: '500' }}
            >
              <i className="bi bi-speedometer2 me-1"></i>
              All Dashboard
            </a>
            
            <span className="text-muted">|</span>
            
            <a 
              href="https://registration.buniyaadhry.com/mb-l3-attendance-pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
              style={{ color: '#0d6efd', fontWeight: '500' }}
            >
              <i className="bi bi-file-pdf me-1"></i>
              Attendance Pdf
            </a>
          </div>
        </Col>
      </Row>
      
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">
            <i className="bi bi-bar-chart-steps me-2"></i>
            Center Preference Dashboard
          </h2>
          <p className="text-muted">
            Track center preferences (CP1 and CP2) across all districts and blocks with detailed admission status breakdown
          </p>
        </Col>
      </Row>

      {/* CP1 Summary Cards */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-primary">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-1-circle-fill me-2"></i>
                CP1 (First Preference) Summary
                {selectedDistrict || selectedBlock && (
                  <Badge bg="light" text="primary" className="ms-2">Filtered View</Badge>
                )}
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center p-3 border rounded">
                    <i className="bi bi-check-circle-fill fs-1 text-success"></i>
                    <h4 className="mt-2 mb-1">{currentSummary.cp1.admissionDone}</h4>
                    <p className="text-muted mb-0">Admission Done</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded">
                    <i className="bi bi-clock-history fs-1 text-info"></i>
                    <h4 className="mt-2 mb-1">{currentSummary.cp1.provisional}</h4>
                    <p className="text-muted mb-0">Provisional</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded">
                    <i className="bi bi-hourglass-split fs-1 text-warning"></i>
                    <h4 className="mt-2 mb-1">{currentSummary.cp1.waiting}</h4>
                    <p className="text-muted mb-0">Waiting List</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded bg-light">
                    <i className="bi bi-calculator-fill fs-1 text-primary"></i>
                    <h4 className="mt-2 mb-1 fw-bold">{currentSummary.cp1.total}</h4>
                    <p className="text-muted mb-0">Total</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CP2 Summary Cards */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-success">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-2-circle-fill me-2"></i>
                CP2 (Second Preference) Summary
                {selectedDistrict || selectedBlock && (
                  <Badge bg="light" text="success" className="ms-2">Filtered View</Badge>
                )}
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center p-3 border rounded">
                    <i className="bi bi-check-circle-fill fs-1 text-success"></i>
                    <h4 className="mt-2 mb-1">{currentSummary.cp2.admissionDone}</h4>
                    <p className="text-muted mb-0">Admission Done</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded">
                    <i className="bi bi-clock-history fs-1 text-info"></i>
                    <h4 className="mt-2 mb-1">{currentSummary.cp2.provisional}</h4>
                    <p className="text-muted mb-0">Provisional</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded">
                    <i className="bi bi-hourglass-split fs-1 text-warning"></i>
                    <h4 className="mt-2 mb-1">{currentSummary.cp2.waiting}</h4>
                    <p className="text-muted mb-0">Waiting List</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded bg-light">
                    <i className="bi bi-calculator-fill fs-1 text-primary"></i>
                    <h4 className="mt-2 mb-1 fw-bold">{currentSummary.cp2.total}</h4>
                    <p className="text-muted mb-0">Total</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Overall Grand Total Card */}
      {/* <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-dark">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">
                <i className="bi bi-bar-chart-steps me-2"></i>
                Overall Summary (CP1 + CP2)
                {selectedDistrict || selectedBlock && (
                  <Badge bg="light" text="dark" className="ms-2">Filtered View</Badge>
                )}
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="text-center p-3 border rounded">
                    <i className="bi bi-1-circle-fill fs-1 text-primary"></i>
                    <h4 className="mt-2 mb-1">{currentSummary.cp1.total}</h4>
                    <p className="text-muted mb-0">CP1 Total</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center p-3 border rounded">
                    <i className="bi bi-2-circle-fill fs-1 text-success"></i>
                    <h4 className="mt-2 mb-1">{currentSummary.cp2.total}</h4>
                    <p className="text-muted mb-0">CP2 Total</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center p-3 border rounded bg-gradient">
                    <i className="bi bi-star-fill fs-1 text-warning"></i>
                    <h4 className="mt-2 mb-1 fw-bold">{currentSummary.grandTotal}</h4>
                    <p className="text-muted mb-0">Grand Total (CP1 + CP2)</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={5}>
              <Form.Group>
                <Form.Label>
                  <i className="bi bi-geo-alt me-1"></i> District
                </Form.Label>
                <Form.Select value={selectedDistrict} onChange={handleDistrictChange}>
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>
                  <i className="bi bi-grid me-1"></i> Block
                </Form.Label>
                <Form.Select value={selectedBlock} onChange={handleBlockChange}>
                  <option value="">All Blocks</option>
                  {blocks.map(block => (
                    <option key={block.id} value={block.id}>
                      {block.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={handleResetFilters} className="w-100">
                <i className="bi bi-arrow-repeat me-1"></i> Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Centers Table - District Wise Sorted */}
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h5 className="mb-0">
              <i className="bi bi-table me-2"></i>
              Center-wise Preference Details (Sorted by District)
            </h5>
            <Badge bg="info" className="mt-2 mt-sm-0">
              {filteredData.length} Centers Found
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <Table striped bordered hover className="mb-0" style={{ minWidth: '1200px' }}>
              <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <tr>
                  <th rowSpan="2" style={{ verticalAlign: 'middle' }}>#</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle' }}>District</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle' }}>Block</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle' }}>Center Name</th>
                  <th colSpan="3" className="text-center">CP1</th>
                  <th colSpan="3" className="text-center">CP2</th>
                 </tr>
                 <tr>
                  <th className="text-center" style={{ background: '#5a67d8' }}>Admission Done</th>
                  <th className="text-center" style={{ background: '#5a67d8' }}>Provisional</th>
                  <th className="text-center" style={{ background: '#5a67d8' }}>Waiting</th>
                  <th className="text-center" style={{ background: '#38a169' }}>Admission Done</th>
                  <th className="text-center" style={{ background: '#38a169' }}>Provisional</th>
                  <th className="text-center" style={{ background: '#38a169' }}>Waiting</th>
                 </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((center, index) => (
                    <tr key={center._id}>
                      <td className="text-center">{index + 1}</td>
                      <td>{center.districtName}</td>
                      <td>{center.blockName}</td>
                      <td className="fw-bold">{center.centerName}</td>
                      {/* CP1 Columns */}
                      <td className="text-center">
                        {getCountBadge(center.cp1.admissionDone, "success")}
                      </td>
                      <td className="text-center">
                        {getCountBadge(center.cp1.provisional, "info")}
                      </td>
                      <td className="text-center">
                        {getCountBadge(center.cp1.waitingTotal, "warning")}
                      </td>
                      {/* CP2 Columns */}
                      <td className="text-center">
                        {getCountBadge(center.cp2.admissionDone, "success")}
                      </td>
                      <td className="text-center">
                        {getCountBadge(center.cp2.provisional, "info")}
                      </td>
                      <td className="text-center">
                        {getCountBadge(center.cp2.waitingTotal, "warning")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-5">
                      <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                      <p className="mt-2 text-muted">No centers found for selected filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="bg-light">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Showing {filteredData.length} out of {centersData.length} centers | Sorted by District, Block, and Center Name
            </small>
            <div className="mt-2 mt-sm-0">
              <Badge bg="success" className="me-2">Admission Done</Badge>
              <Badge bg="info" className="me-2">Provisional</Badge>
              <Badge bg="warning">Waiting List</Badge>
            </div>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};