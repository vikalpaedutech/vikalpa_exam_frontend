

// import React, {useState, useEffect, useContext} from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import { Container, Row, Col, Card, Button, ListGroup, Badge, Table, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { GetStudentsRegisteredByUserCount } from "../../services/DashBoardServices/DashboardService";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// export const PrincipalAbrcBeoDeoCalling = () =>{
//   const { userData, setUserData } = useContext(UserContext); // ✅ use context


//  const { districtBlockSchoolData = [], loadingDBS } = useDistrictBlockSchool() || {};


//   const navigate = useNavigate();

// console.log(districtBlockSchoolData)

// console.log(userData)

//   return(
//     <Container fluid className="py-4">
     
// <h1>Hello callings</h1>
//     </Container>
//   )
// }






// import React, { useMemo, useContext } from "react";
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
//   Accordion,
//   Spinner,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";

// export const PrincipalAbrcBeoDeoCalling = () => {
//   const { userData } = useContext(UserContext); // ✅ use context

//   // districtBlockSchoolData is the large array of objects you logged
//   const { districtBlockSchoolData = [], loadingDBS } =
//     useDistrictBlockSchool() || {};

//   const navigate = useNavigate();

//   // derive user's accessible district+block pairs
//   const userBlocks = useMemo(() => {
//     // safe guards if userData or userAccess missing
//     if (!userData || !userData.userAccess || !Array.isArray(userData.userAccess.region)) {
//       return [];
//     }
//     const pairs = [];
//     for (const region of userData.userAccess.region) {
//       const districtId = region.districtId;
//       if (!region.blockIds || !Array.isArray(region.blockIds)) continue;
//       for (const b of region.blockIds) {
//         // b could be either object { blockId } or a plain id depending on backend shape
//         const blockId = b.blockId ?? b;
//         if (districtId && blockId) pairs.push({ districtId: String(districtId), blockId: String(blockId) });
//       }
//     }
//     return pairs;
//   }, [userData]);

//   // Filter schools to those that belong to user's blocks
//   const filteredSchools = useMemo(() => {
//     if (!Array.isArray(districtBlockSchoolData) || userBlocks.length === 0) return [];
//     const blockSet = new Set(userBlocks.map(p => `${p.districtId}||${p.blockId}`));
//     return districtBlockSchoolData.filter((s) => {
//       // ensure strings for matching
//       const d = String(s.districtId ?? "");
//       const b = String(s.blockId ?? "");
//       return blockSet.has(`${d}||${b}`);
//     });
//   }, [districtBlockSchoolData, userBlocks]);

//   // Group by ABRC name + contact (so ABRC with same name but different contact remain separate)
//   const abrcGroups = useMemo(() => {
//     const map = new Map(); // key -> {abrc, abrcContact, schools: []}
//     for (const school of filteredSchools) {
//       const abrc = school.abrc ?? "Unknown ABRC";
//       const abrcContact = school.abrcContact ?? "";
//       const key = `${abrc}||${abrcContact}`;
//       if (!map.has(key)) {
//         map.set(key, {
//           abrc,
//           abrcContact,
//           schools: [],
//         });
//       }
//       map.get(key).schools.push(school);
//     }
//     // convert to array and sort optionally by abrc name
//     return Array.from(map.values()).sort((a, b) =>
//       (a.abrc || "").localeCompare(b.abrc || "")
//     );
//   }, [filteredSchools]);

//   // debug logs (optional)
//   console.log("userBlocks:", userBlocks);
//   console.log("filteredSchools length:", filteredSchools.length);
//   console.log("abrcGroups count:", abrcGroups.length);

//   return (
//     <Container fluid className="py-4">
//       <Row className="mb-3">
//         <Col>
//           <h3>ABRC Calling Sheet</h3>
//           <p className="text-muted">
//             Showing ABRCs for blocks that match the logged-in user's access.
//           </p>
//         </Col>
//       </Row>

//       {loadingDBS ? (
//         <Row>
//           <Col className="text-center">
//             <Spinner animation="border" role="status" />
//             <div>Loading centers...</div>
//           </Col>
//         </Row>
//       ) : abrcGroups.length === 0 ? (
//         <Row>
//           <Col>
//             <Card>
//               <Card.Body>
//                 <Card.Text>No ABRC data found for your assigned blocks.</Card.Text>
//                 <Card.Text>
//                   Make sure your user access (district/block) is configured correctly.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       ) : (
//         <Row>
//           <Col>
//             <Accordion defaultActiveKey={abrcGroups.length ? "0" : null}>
//               {abrcGroups.map((group, idx) => {
//                 const headerLabel = group.abrc || "Unknown ABRC";
//                 const contact = group.abrcContact || "";
//                 return (
//                   <Accordion.Item eventKey={String(idx)} key={`${headerLabel}-${contact}-${idx}`}>
//                     <Accordion.Header>
//                       <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <div>
//                           <strong>{headerLabel}</strong>
//                           <div style={{ fontSize: "0.85rem", color: "#666" }}>
//                             {group.schools.length} school{group.schools.length > 1 ? "s" : ""}
//                           </div>
//                         </div>
//                         <div style={{ textAlign: "right" }}>
//                           {contact ? (
//                             <a href={`tel:${contact}`} onClick={(e) => { /* optionally track click */ }}>
//                               {contact}
//                             </a>
//                           ) : (
//                             <small className="text-muted">No contact</small>
//                           )}
//                         </div>
//                       </div>
//                     </Accordion.Header>

//                     <Accordion.Body>
//                       <Table striped bordered hover responsive size="sm" className="mb-0">
//                         <thead>
//                           <tr>
//                             <th>#</th>
//                             <th>Center ID</th>
//                             <th>Center Name</th>
//                             <th>School Type</th>
//                             <th>Principal</th>
//                             <th>Principal Contact</th>
//                             <th>Cluster</th>
//                             <th>Last Updated</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {group.schools.map((s, i) => (
//                             <tr key={`${s._id || s.centerId || i}`}>
//                               <td>{i + 1}</td>
//                               <td>{s.centerId ?? "-"}</td>
//                               <td style={{ minWidth: 200 }}>{s.centerName ?? "-"}</td>
//                               <td>{s.schoolType ?? "-"}</td>
//                               <td>{s.principal ?? "-"}</td>
//                               <td>
//                                 {s.princiaplContact ? (
//                                   <a href={`tel:${s.princiaplContact}`}>{s.princiaplContact}</a>
//                                 ) : (
//                                   <small className="text-muted">-</small>
//                                 )}
//                               </td>
//                               <td>
//                                 {s.isCluster ? (
//                                   <Badge bg="success">Cluster</Badge>
//                                 ) : (
//                                   <Badge bg="secondary">—</Badge>
//                                 )}
//                               </td>
//                               <td>
//                                 {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "-"}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//           </Col>
//         </Row>
//       )}
//     </Container>
//   );
// };













// import React, { useMemo, useContext } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Badge,
//   Table,
//   Accordion,
//   Spinner,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";

// import { CreateCallLogs } from "../../services/UserServices/UserService";

// export const PrincipalAbrcBeoDeoCalling = () => {
//   const { userData } = useContext(UserContext); // ✅ use context

//   // districtBlockSchoolData is the large array of objects you logged
//   const { districtBlockSchoolData = [], loadingDBS } =
//     useDistrictBlockSchool() || {};

//   const navigate = useNavigate();

//   // derive user's accessible district+block pairs
//   const userBlocks = useMemo(() => {
//     if (!userData || !userData.userAccess || !Array.isArray(userData.userAccess.region)) {
//       return [];
//     }
//     const pairs = [];
//     for (const region of userData.userAccess.region) {
//       const districtId = region.districtId;
//       if (!region.blockIds || !Array.isArray(region.blockIds)) continue;
//       for (const b of region.blockIds) {
//         const blockId = b.blockId ?? b;
//         if (districtId && blockId) pairs.push({ districtId: String(districtId), blockId: String(blockId) });
//       }
//     }
//     return pairs;
//   }, [userData]);

//   // Filter schools to those that belong to user's blocks AND have a non-empty abrc
//   const filteredSchools = useMemo(() => {
//     if (!Array.isArray(districtBlockSchoolData) || userBlocks.length === 0) return [];
//     const blockSet = new Set(userBlocks.map(p => `${p.districtId}||${p.blockId}`));

//     return districtBlockSchoolData.filter((s) => {
//       // ensure strings for matching
//       const d = String(s.districtId ?? "");
//       const b = String(s.blockId ?? "");
//       // require abrc to be present and not just whitespace
//       const hasAbrc = typeof s.abrc === "string" ? s.abrc.trim() !== "" : Boolean(s.abrc);
//       if (!hasAbrc) return false;
//       return blockSet.has(`${d}||${b}`);
//     });
//   }, [districtBlockSchoolData, userBlocks]);

//   // Group by ABRC name + contact (so ABRC with same name but different contact remain separate)
//   const abrcGroups = useMemo(() => {
//     const map = new Map(); // key -> {abrc, abrcContact, schools: []}
//     for (const school of filteredSchools) {
//       const abrc = (typeof school.abrc === "string" && school.abrc.trim() !== "") ? school.abrc.trim() : "Unknown ABRC";
//       const abrcContact = school.abrcContact ?? "";
//       const key = `${abrc}||${abrcContact}`;
//       if (!map.has(key)) {
//         map.set(key, {
//           abrc,
//           abrcContact,
//           schools: [],
//         });
//       }
//       map.get(key).schools.push(school);
//     }
//     return Array.from(map.values()).sort((a, b) =>
//       (a.abrc || "").localeCompare(b.abrc || "")
//     );
//   }, [filteredSchools]);

//   // debug logs (optional)
//   console.log("userBlocks:", userBlocks);
//   console.log("filteredSchools length:", filteredSchools.length);
//   console.log("abrcGroups count:", abrcGroups.length);

//   return (
//     <Container fluid className="py-4">
//       <Row className="mb-3">
//         <Col>
//           <h3>ABRC Calling Sheet</h3>
//           <p className="text-muted">
//             Showing ABRCs for blocks that match the logged-in user's access (only entries with ABRC filled).
//           </p>
//         </Col>
//       </Row>

//       {loadingDBS ? (
//         <Row>
//           <Col className="text-center">
//             <Spinner animation="border" role="status" />
//             <div>Loading centers...</div>
//           </Col>
//         </Row>
//       ) : abrcGroups.length === 0 ? (
//         <Row>
//           <Col>
//             <Card>
//               <Card.Body>
//                 <Card.Text>No ABRC data found for your assigned blocks.</Card.Text>
//                 <Card.Text>
//                   Either ABRC is missing for centers in your blocks or your user access (district/block) isn't configured.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       ) : (
//         <Row>
//           <Col>
//             <Accordion defaultActiveKey={abrcGroups.length ? "0" : null}>
//               {abrcGroups.map((group, idx) => {
//                 const headerLabel = group.abrc || "Unknown ABRC";
//                 const contact = group.abrcContact || "";
//                 return (
//                   <Accordion.Item eventKey={String(idx)} key={`${headerLabel}-${contact}-${idx}`}>
//                     <Accordion.Header>
//                       <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <div>
//                           <strong>{headerLabel}</strong>
//                           <div style={{ fontSize: "0.85rem", color: "#666" }}>
//                             {group.schools.length} school{group.schools.length > 1 ? "s" : ""}
//                           </div>
//                         </div>
//                         <div style={{ textAlign: "right" }}>
//                           {contact ? (
//                             <a href={`tel:${contact}`} onClick={(e) => { /* optionally track click */ }}>
//                               {contact}
//                             </a>
//                           ) : (
//                             <small className="text-muted">No contact</small>
//                           )}
//                         </div>
//                       </div>
//                     </Accordion.Header>

//                     <Accordion.Body>
//                       <Table striped bordered hover responsive size="sm" className="mb-0">
//                         <thead>
//                           <tr>
//                             <th>#</th>
//                             <th>Center ID</th>
//                             <th>Center Name</th>
//                             <th>School Type</th>
//                             <th>Principal</th>
//                             <th>Principal Contact</th>
//                             <th>Cluster</th>
//                             <th>Last Updated</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {group.schools.map((s, i) => (
//                             <tr key={`${s._id || s.centerId || i}`}>
//                               <td>{i + 1}</td>
//                               <td>{s.centerId ?? "-"}</td>
//                               <td style={{ minWidth: 200 }}>{s.centerName ?? "-"}</td>
//                               <td>{s.schoolType ?? "-"}</td>
//                               <td>{s.principal ?? "-"}</td>
//                               <td>
//                                 {s.princiaplContact ? (
//                                   <a href={`tel:${s.princiaplContact}`}>{s.princiaplContact}</a>
//                                 ) : (
//                                   <small className="text-muted">-</small>
//                                 )}
//                               </td>
//                               <td>
//                                 {s.isCluster ? (
//                                   <Badge bg="success">Cluster</Badge>
//                                 ) : (
//                                   <Badge bg="secondary">—</Badge>
//                                 )}
//                               </td>
//                               <td>
//                                 {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "-"}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//           </Col>
//         </Row>
//       )}
//     </Container>
//   );
// };














// import React, { useMemo, useContext, useState } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Badge,
//   Table,
//   Accordion,
//   Spinner,
//   Form,
//   Button,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import Select from 'react-select';

// import { CreateCallLogs } from "../../services/UserServices/UserService";

// export const PrincipalAbrcBeoDeoCalling = () => {
//   const { userData } = useContext(UserContext); // ✅ use context

//   // districtBlockSchoolData is the large array of objects you logged
//   const { districtBlockSchoolData = [], loadingDBS } =
//     useDistrictBlockSchool() || {};

//   const navigate = useNavigate();

//   // derive user's accessible district+block pairs
//   const userBlocks = useMemo(() => {
//     if (!userData || !userData.userAccess || !Array.isArray(userData.userAccess.region)) {
//       return [];
//     }
//     const pairs = [];
//     for (const region of userData.userAccess.region) {
//       const districtId = region.districtId;
//       if (!region.blockIds || !Array.isArray(region.blockIds)) continue;
//       for (const b of region.blockIds) {
//         const blockId = b.blockId ?? b;
//         if (districtId && blockId) pairs.push({ districtId: String(districtId), blockId: String(blockId) });
//       }
//     }
//     return pairs;
//   }, [userData]);

//   // Filter schools to those that belong to user's blocks AND have a non-empty abrc
//   const filteredSchools = useMemo(() => {
//     if (!Array.isArray(districtBlockSchoolData) || userBlocks.length === 0) return [];
//     const blockSet = new Set(userBlocks.map(p => `${p.districtId}||${p.blockId}`));

//     return districtBlockSchoolData.filter((s) => {
//       // ensure strings for matching
//       const d = String(s.districtId ?? "");
//       const b = String(s.blockId ?? "");
//       // require abrc to be present and not just whitespace
//       const hasAbrc = typeof s.abrc === "string" ? s.abrc.trim() !== "" : Boolean(s.abrc);
//       if (!hasAbrc) return false;
//       return blockSet.has(`${d}||${b}`);
//     });
//   }, [districtBlockSchoolData, userBlocks]);

//   // Group by ABRC name + contact (so ABRC with same name but different contact remain separate)
//   const abrcGroups = useMemo(() => {
//     const map = new Map(); // key -> {abrc, abrcContact, schools: []}
//     for (const school of filteredSchools) {
//       const abrc = (typeof school.abrc === "string" && school.abrc.trim() !== "") ? school.abrc.trim() : "Unknown ABRC";
//       const abrcContact = school.abrcContact ?? "";
//       const key = `${abrc}||${abrcContact}`;
//       if (!map.has(key)) {
//         map.set(key, {
//           abrc,
//           abrcContact,
//           schools: [],
//         });
//       }
//       map.get(key).schools.push(school);
//     }
//     return Array.from(map.values()).sort((a, b) =>
//       (a.abrc || "").localeCompare(b.abrc || "")
//     );
//   }, [filteredSchools]);

//   // Calling status options
//   const callingStatusOptions = [
//     { value: 'Connected', label: 'Connected' },
//     { value: 'Not-connected', label: 'Not-connected' }
//   ];

//   // Calling remark options
//   const callingRemarkOptions = [
//     { value: 'blc event updated', label: 'BLC Event Updated' },
//     { value: 'for low registration count', label: 'For Low Registration Count' },
//     { value: 'for admit card', label: 'For Admit Card' }
//   ];

//   // State for each ABRC group's form data
//   const [formData, setFormData] = useState({});

//   // Handle form input changes for each ABRC group
//   const handleInputChange = (abrcKey, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [abrcKey]: {
//         ...prev[abrcKey],
//         [field]: value
//       }
//     }));
//   };

//  // Handle form submission for a specific ABRC group
// const handleSubmit = async (abrcKey, group) => {
//   try {
//     const data = formData[abrcKey] || {};
    
//     // Basic validation
//     if (!data.callingStatus) {
//       alert('Please select calling status');
//       return;
//     }

//     if (!data.callingRemark) {
//       alert('Please select calling remark');
//       return;
//     }

//     // Validate user data
//     if (!userData?.user._id) {
//       alert('User information not found. Please login again.');
//       return;
//     }

//     // For each school in the group, create a call log
//     const promises = group.schools.map(school => {
//       const callLogData = {
//         callerId: userData?.user._id, // Use actual user ID from context
//         districtId: school.districtId,
//         districtName: school.districtName,
//         blockId: school.blockId,
//         blockName: school.blockName,
//         centerId: school.centerId,
//         centerName: school.centerName,
//         schoolType: school.schoolType,
//         isCluster: school.isCluster,
//         abrc: group.abrc,
//         abrcContact: group.abrcContact,
//         principal: school.principal,
//         princiaplContact: school.princiaplContact,
//         principalAbrcDataUpdatedBy: userData.username || userData.userId,
//         callingStatus: data.callingStatus,
//         callingRemark: data.callingRemark,
//         manualRemark: data.manualRemark || '',
//       };

//       return CreateCallLogs(callLogData);
//     });

//     await Promise.all(promises);
    
//     // Reset form for this ABRC group after successful submission
//     setFormData(prev => ({
//       ...prev,
//       [abrcKey]: undefined
//     }));

//     alert('Call logs created successfully!');

//   } catch (error) {
//     console.error('Error creating call logs:', error);
//     alert('Error creating call logs. Please try again.');
//   }
// };

//   // debug logs (optional)
//   console.log("userBlocks:", userBlocks);
//   console.log("filteredSchools length:", filteredSchools.length);
//   console.log("abrcGroups count:", abrcGroups.length);

//   return (
//     <Container fluid className="py-4">
//       <Row className="mb-3">
//         <Col>
//           <h3>ABRC Calling Sheet</h3>
//           <p className="text-muted">
//             Showing ABRCs for blocks that match the logged-in user's access (only entries with ABRC filled).
//           </p>
//         </Col>
//       </Row>

//       {loadingDBS ? (
//         <Row>
//           <Col className="text-center">
//             <Spinner animation="border" role="status" />
//             <div>Loading centers...</div>
//           </Col>
//         </Row>
//       ) : abrcGroups.length === 0 ? (
//         <Row>
//           <Col>
//             <Card>
//               <Card.Body>
//                 <Card.Text>No ABRC data found for your assigned blocks.</Card.Text>
//                 <Card.Text>
//                   Either ABRC is missing for centers in your blocks or your user access (district/block) isn't configured.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       ) : (
//         <Row>
//           <Col>
//             <Accordion defaultActiveKey={abrcGroups.length ? "0" : null}>
//               {abrcGroups.map((group, idx) => {
//                 const headerLabel = group.abrc || "Unknown ABRC";
//                 const contact = group.abrcContact || "";
//                 const abrcKey = `${headerLabel}-${contact}-${idx}`;
//                 const currentFormData = formData[abrcKey] || {};

//                 return (
//                   <Accordion.Item eventKey={String(idx)} key={abrcKey}>
//                     <Accordion.Header>
//                       <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <div>
//                           <strong>{headerLabel}</strong>
//                           <div style={{ fontSize: "0.85rem", color: "#666" }}>
//                             {group.schools.length} school{group.schools.length > 1 ? "s" : ""}
//                           </div>
//                         </div>
//                         <div style={{ textAlign: "right" }}>
//                           {contact ? (
//                             <a href={`tel:${contact}`} onClick={(e) => { /* optionally track click */ }}>
//                               {contact}
//                             </a>
//                           ) : (
//                             <small className="text-muted">No contact</small>
//                           )}
//                         </div>
//                       </div>
//                     </Accordion.Header>

//                     <Accordion.Body>
//                       {/* Calling Form */}
//                       <Card className="mb-3">
//                         <Card.Header>
//                           <h6 className="mb-0">Calling Information</h6>
//                         </Card.Header>
//                         <Card.Body>
//                           <Row>
//                             <Col md={6}>
//                               <Form.Group className="mb-3">
//                                 <Form.Label>Calling Status *</Form.Label>
//                                 <Select
//                                   options={callingStatusOptions}
//                                   value={callingStatusOptions.find(opt => opt.value === currentFormData.callingStatus)}
//                                   onChange={(selected) => handleInputChange(abrcKey, 'callingStatus', selected?.value)}
//                                   placeholder="Select calling status"
//                                 />
//                               </Form.Group>
//                             </Col>
//                             <Col md={6}>
//                               <Form.Group className="mb-3">
//                                 <Form.Label>Calling Remark *</Form.Label>
//                                 <Select
//                                   options={callingRemarkOptions}
//                                   value={callingRemarkOptions.find(opt => opt.value === currentFormData.callingRemark)}
//                                   onChange={(selected) => handleInputChange(abrcKey, 'callingRemark', selected?.value)}
//                                   placeholder="Select calling remark"
//                                 />
//                               </Form.Group>
//                             </Col>
//                           </Row>
//                           <Row>
//                             <Col md={12}>
//                               <Form.Group className="mb-3">
//                                 <Form.Label>Manual Remark</Form.Label>
//                                 <Form.Control
//                                   as="textarea"
//                                   rows={2}
//                                   placeholder="Enter any additional remarks..."
//                                   value={currentFormData.manualRemark || ''}
//                                   onChange={(e) => handleInputChange(abrcKey, 'manualRemark', e.target.value)}
//                                 />
//                               </Form.Group>
//                             </Col>
//                           </Row>
//                           <Row>
//                             <Col>
//                               <Button 
//                                 variant="primary" 
//                                 onClick={() => handleSubmit(abrcKey, group)}
//                                 disabled={!currentFormData.callingStatus || !currentFormData.callingRemark}
//                               >
//                                 Submit Call Logs
//                               </Button>
//                             </Col>
//                           </Row>
//                         </Card.Body>
//                       </Card>

//                       {/* Schools Table */}
//                       <Table striped bordered hover responsive size="sm" className="mb-0">
//                         <thead>
//                           <tr>
//                             <th>#</th>
//                             <th>Center ID</th>
//                             <th>Center Name</th>
//                             <th>School Type</th>
//                             <th>Principal</th>
//                             <th>Principal Contact</th>
//                             <th>Cluster</th>
//                             <th>Last Updated</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {group.schools.map((s, i) => (
//                             <tr key={`${s._id || s.centerId || i}`}>
//                               <td>{i + 1}</td>
//                               <td>{s.centerId ?? "-"}</td>
//                               <td style={{ minWidth: 200 }}>{s.centerName ?? "-"}</td>
//                               <td>{s.schoolType ?? "-"}</td>
//                               <td>{s.principal ?? "-"}</td>
//                               <td>
//                                 {s.princiaplContact ? (
//                                   <a href={`tel:${s.princiaplContact}`}>{s.princiaplContact}</a>
//                                 ) : (
//                                   <small className="text-muted">-</small>
//                                 )}
//                               </td>
//                               <td>
//                                 {s.isCluster ? (
//                                   <Badge bg="success">Cluster</Badge>
//                                 ) : (
//                                   <Badge bg="secondary">—</Badge>
//                                 )}
//                               </td>
//                               <td>
//                                 {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "-"}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//           </Col>
//         </Row>
//       )}
//     </Container>
//   );
// };











// import React, { useMemo, useContext, useState, useEffect } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Badge,
//   Table,
//   Accordion,
//   Spinner,
//   Form,
//   Button,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import Select from 'react-select';

// import { CreateCallLogs } from "../../services/UserServices/UserService";
// import { GetCallLogsCurrentData } from "../../services/UserServices/UserService";


// export const PrincipalAbrcBeoDeoCalling = () => {



//  const fetchCallLogs = async () => {

//   const reqBody = {
//     callerId: userData?.user?._id
//   }

//   try {
//     const response = await GetCallLogsCurrentData(reqBody)

//     console.log(response.data)
//   } catch (error) {
//     console.error("Error fetching cal logs", error)
//   }


//  } 
 

// useEffect(()=>{
//   fetchCallLogs()
// }, [])





//   const { userData } = useContext(UserContext); // ✅ use context

//   // districtBlockSchoolData is the large array of objects you logged
//   const { districtBlockSchoolData = [], loadingDBS } =
//     useDistrictBlockSchool() || {};

//   const navigate = useNavigate();

//   // derive user's accessible district+block pairs
//   const userBlocks = useMemo(() => {
//     if (!userData || !userData.userAccess || !Array.isArray(userData.userAccess.region)) {
//       return [];
//     }
//     const pairs = [];
//     for (const region of userData.userAccess.region) {
//       const districtId = region.districtId;
//       if (!region.blockIds || !Array.isArray(region.blockIds)) continue;
//       for (const b of region.blockIds) {
//         const blockId = b.blockId ?? b;
//         if (districtId && blockId) pairs.push({ districtId: String(districtId), blockId: String(blockId) });
//       }
//     }
//     return pairs;
//   }, [userData]);

//   // Filter schools to those that belong to user's blocks AND have a non-empty abrc
//   const filteredSchools = useMemo(() => {
//     if (!Array.isArray(districtBlockSchoolData) || userBlocks.length === 0) return [];
//     const blockSet = new Set(userBlocks.map(p => `${p.districtId}||${p.blockId}`));

//     return districtBlockSchoolData.filter((s) => {
//       // ensure strings for matching
//       const d = String(s.districtId ?? "");
//       const b = String(s.blockId ?? "");
//       // require abrc to be present and not just whitespace
//       const hasAbrc = typeof s.abrc === "string" ? s.abrc.trim() !== "" : Boolean(s.abrc);
//       if (!hasAbrc) return false;
//       return blockSet.has(`${d}||${b}`);
//     });
//   }, [districtBlockSchoolData, userBlocks]);

//   // Group by ABRC name + contact (so ABRC with same name but different contact remain separate)
//   const abrcGroups = useMemo(() => {
//     const map = new Map(); // key -> {abrc, abrcContact, schools: []}
//     for (const school of filteredSchools) {
//       const abrc = (typeof school.abrc === "string" && school.abrc.trim() !== "") ? school.abrc.trim() : "Unknown ABRC";
//       const abrcContact = school.abrcContact ?? "";
//       const key = `${abrc}||${abrcContact}`;
//       if (!map.has(key)) {
//         map.set(key, {
//           abrc,
//           abrcContact,
//           schools: [],
//         });
//       }
//       map.get(key).schools.push(school);
//     }
//     return Array.from(map.values()).sort((a, b) =>
//       (a.abrc || "").localeCompare(b.abrc || "")
//     );
//   }, [filteredSchools]);

//   // Calling status options
//   const callingStatusOptions = [
//     { value: 'Connected', label: 'Connected' },
//     { value: 'Not-connected', label: 'Not-connected' }
//   ];

//   // Calling remark options
//   const callingRemarkOptions = [
//     { value: 'blc event updated', label: 'BLC Event Updated' },
//     { value: 'for low registration count', label: 'For Low Registration Count' },
//     { value: 'for admit card', label: 'For Admit Card' }
//   ];

//   // State for each ABRC group's form data
//   const [formData, setFormData] = useState({});

//   // Handle form input changes for each ABRC group
//   const handleInputChange = (abrcKey, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [abrcKey]: {
//         ...prev[abrcKey],
//         [field]: value
//       }
//     }));
//   };

//  // replace the current handleSubmit with this function in your component
// const handleSubmit = async (abrcKey, group) => {
//   try {
//     const data = formData[abrcKey] || {};

//     // Basic validation
//     if (!data.callingStatus) {
//       alert('Please select calling status');
//       return;
//     }
//     if (!data.callingRemark) {
//       alert('Please select calling remark');
//       return;
//     }

//     // Validate user data
//     const callerId = userData?.user?._id ?? userData?._id ?? null;
//     if (!callerId) {
//       alert('User information not found. Please login again.');
//       return;
//     }

//     // Build a single block-level call log (no centerId)
//     const callLogData = {
//       callerId: callerId,
//       districtId: group.schools[0]?.districtId ?? "",
//       districtName: group.schools[0]?.districtName ?? "",
//       blockId: group.schools[0]?.blockId ?? "",
//       blockName: group.schools[0]?.blockName ?? "",
//       centerId: "",                 // intentionally empty or omit on server
//       centerName: "",               // optional
//       schoolType: "",               // optional
//       isCluster: false,             // optional
//       abrc: group.abrc ?? "",
//       abrcContact: group.abrcContact ?? "",
//       principal: group.schools[0]?.principal ?? "",           // optional
//       princiaplContact: group.schools[0]?.princiaplContact ?? "",
//       principalAbrcDataUpdatedBy: userData?.user?.userName ?? userData?.userName ?? "",
//       callingStatus: data.callingStatus,
//       callingRemark: data.callingRemark,
//       manualRemark: data.manualRemark || '',
//       calledTo: "ABRC"
//     };

//     const res = await CreateCallLogs(callLogData);

//     if (res && (res.success || res.data)) {
//       // clear form
//       setFormData(prev => ({ ...prev, [abrcKey]: undefined }));
//       alert("Call log created successfully!");
//     } else {
//       console.error("CreateCallLogs response:", res);
//       alert(res?.message || "Failed to create call log");
//     }
//   } catch (error) {
//     console.error("Error creating call log:", error);
//     alert("Error creating call log. Please try again.");
//   }
// };


//   // debug logs (optional)
//   console.log("userBlocks:", userBlocks);
//   console.log("filteredSchools length:", filteredSchools.length);
//   console.log("abrcGroups count:", abrcGroups.length);

//   return (
//     <Container fluid className="py-4">
//       <Row className="mb-3">
//         <Col>
//           <h3>ABRC Calling Sheet</h3>
//           <p className="text-muted">
//             Showing ABRCs for blocks that match the logged-in user's access (only entries with ABRC filled).
//           </p>
//         </Col>
//       </Row>

//       {loadingDBS ? (
//         <Row>
//           <Col className="text-center">
//             <Spinner animation="border" role="status" />
//             <div>Loading centers...</div>
//           </Col>
//         </Row>
//       ) : abrcGroups.length === 0 ? (
//         <Row>
//           <Col>
//             <Card>
//               <Card.Body>
//                 <Card.Text>No ABRC data found for your assigned blocks.</Card.Text>
//                 <Card.Text>
//                   Either ABRC is missing for centers in your blocks or your user access (district/block) isn't configured.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       ) : (
//         <Row>
//           <Col>
//             <Accordion defaultActiveKey={abrcGroups.length ? "0" : null}>
//               {abrcGroups.map((group, idx) => {
//                 const headerLabel = group.abrc || "Unknown ABRC";
//                 const contact = group.abrcContact || "";
//                 const abrcKey = `${headerLabel}-${contact}-${idx}`;
//                 const currentFormData = formData[abrcKey] || {};

//                 return (
//                   <Accordion.Item eventKey={String(idx)} key={abrcKey}>
//                     <Accordion.Header>
//                       <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <div>
//                           <strong>{headerLabel}</strong>
//                           <div style={{ fontSize: "0.85rem", color: "#666" }}>
//                             {group.schools.length} school{group.schools.length > 1 ? "s" : ""}
//                           </div>
//                         </div>
//                         <div style={{ textAlign: "right" }}>
//                           {contact ? (
//                             <a href={`tel:${contact}`} onClick={(e) => { /* optionally track click */ }}>
//                               {contact}
//                             </a>
//                           ) : (
//                             <small className="text-muted">No contact</small>
//                           )}
//                         </div>
//                       </div>
//                     </Accordion.Header>

//                     <Accordion.Body>
//                       {/* Calling Form */}
//                       <Card className="mb-3">
//                         <Card.Header>
//                           <h6 className="mb-0">Calling Information</h6>
//                         </Card.Header>
//                         <Card.Body>
//                           <Row>
//                             <Col md={6}>
//                               <Form.Group className="mb-3">
//                                 <Form.Label>Calling Status *</Form.Label>
//                                 <Select
//                                   options={callingStatusOptions}
//                                   value={callingStatusOptions.find(opt => opt.value === currentFormData.callingStatus) ?? null}
//                                   onChange={(selected) => handleInputChange(abrcKey, 'callingStatus', selected?.value)}
//                                   placeholder="Select calling status"
//                                 />
//                               </Form.Group>
//                             </Col>
//                             <Col md={6}>
//                               <Form.Group className="mb-3">
//                                 <Form.Label>Calling Remark *</Form.Label>
//                                 <Select
//                                   options={callingRemarkOptions}
//                                   value={callingRemarkOptions.find(opt => opt.value === currentFormData.callingRemark) ?? null}
//                                   onChange={(selected) => handleInputChange(abrcKey, 'callingRemark', selected?.value)}
//                                   placeholder="Select calling remark"
//                                 />
//                               </Form.Group>
//                             </Col>
//                           </Row>
//                           <Row>
//                             <Col md={12}>
//                               <Form.Group className="mb-3">
//                                 <Form.Label>Manual Remark</Form.Label>
//                                 <Form.Control
//                                   as="textarea"
//                                   rows={2}
//                                   placeholder="Enter any additional remarks..."
//                                   value={currentFormData.manualRemark || ''}
//                                   onChange={(e) => handleInputChange(abrcKey, 'manualRemark', e.target.value)}
//                                 />
//                               </Form.Group>
//                             </Col>
//                           </Row>
//                           <Row>
//                             <Col>
//                               <Button 
//                                 variant="primary" 
//                                 onClick={() => handleSubmit(abrcKey, group)}
//                                 disabled={!currentFormData.callingStatus || !currentFormData.callingRemark}
//                               >
//                                 Submit Call Logs
//                               </Button>
//                             </Col>
//                           </Row>
//                         </Card.Body>
//                       </Card>

//                       {/* Schools minimal list: only # and School Name */}
//                       <Table striped bordered hover responsive size="sm" className="mb-0">
//                         <thead>
//                           <tr>
//                             <th style={{ width: 60 }}>#</th>
//                             <th>School Name</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {group.schools.map((s, i) => (
//                             <tr key={`${s._id || s.centerId || i}`}>
//                               <td>{i + 1}</td>
//                               <td style={{ minWidth: 200 }}>{s.centerName ?? "-"}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//           </Col>
//         </Row>
//       )}
//     </Container>
//   );
// };
















import React, { useMemo, useContext, useState, useEffect } from "react";
import { UserContext } from "../NewContextApis/UserContext";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Table,
  Accordion,
  Spinner,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
import Select from 'react-select';

import { CreateCallLogs } from "../../services/UserServices/UserService";
import { GetCallLogsCurrentData } from "../../services/UserServices/UserService";

export const PrincipalAbrcBeoDeoCalling = () => {
  const { userData } = useContext(UserContext); // ✅ use context

  // districtBlockSchoolData is the large array of objects you logged
  const { districtBlockSchoolData = [], loadingDBS } =
    useDistrictBlockSchool() || {};

  const navigate = useNavigate();

  // ---- helper: compute IST YYYY-MM-DD for a Date or ISO string ----
  const toIstDateString = (dateInput) => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    // convert to UTC ms then add IST offset (5:30)
    const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const ist = new Date(utcMs + IST_OFFSET_MS);
    const yyyy = ist.getFullYear();
    const mm = String(ist.getMonth() + 1).padStart(2, '0');
    const dd = String(ist.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // today's IST date string for comparison
  const todayIstString = (() => {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(utcMs + IST_OFFSET_MS);
    const yyyy = istNow.getFullYear();
    const mm = String(istNow.getMonth() + 1).padStart(2, '0');
    const dd = String(istNow.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  // derive user's accessible district+block pairs
  const userBlocks = useMemo(() => {
    if (!userData || !userData.userAccess || !Array.isArray(userData.userAccess.region)) {
      return [];
    }
    const pairs = [];
    for (const region of userData.userAccess.region) {
      const districtId = region.districtId;
      if (!region.blockIds || !Array.isArray(region.blockIds)) continue;
      for (const b of region.blockIds) {
        const blockId = b.blockId ?? b;
        if (districtId && blockId) pairs.push({ districtId: String(districtId), blockId: String(blockId) });
      }
    }
    return pairs;
  }, [userData]);

  // Filter schools to those that belong to user's blocks AND have a non-empty abrc
  const filteredSchools = useMemo(() => {
    if (!Array.isArray(districtBlockSchoolData) || userBlocks.length === 0) return [];
    const blockSet = new Set(userBlocks.map(p => `${p.districtId}||${p.blockId}`));

    return districtBlockSchoolData.filter((s) => {
      // ensure strings for matching
      const d = String(s.districtId ?? "");
      const b = String(s.blockId ?? "");
      // require abrc to be present and not just whitespace
      const hasAbrc = typeof s.abrc === "string" ? s.abrc.trim() !== "" : Boolean(s.abrc);
      if (!hasAbrc) return false;
      return blockSet.has(`${d}||${b}`);
    });
  }, [districtBlockSchoolData, userBlocks]);

  // Group by ABRC name + contact (so ABRC with same name but different contact remain separate)
  const abrcGroups = useMemo(() => {
    const map = new Map(); // key -> {abrc, abrcContact, schools: []}
    for (const school of filteredSchools) {
      const abrc = (typeof school.abrc === "string" && school.abrc.trim() !== "") ? school.abrc.trim() : "Unknown ABRC";
      const abrcContact = school.abrcContact ?? "";
      const key = `${abrc}||${abrcContact}`;
      if (!map.has(key)) {
        map.set(key, {
          abrc,
          abrcContact,
          schools: [],
        });
      }
      map.get(key).schools.push(school);
    }
    return Array.from(map.values()).sort((a, b) =>
      (a.abrc || "").localeCompare(b.abrc || "")
    );
  }, [filteredSchools]);

  // Calling status options
  const callingStatusOptions = [
    { value: 'Connected', label: 'Connected' },
    { value: 'Not-connected', label: 'Not-connected' }
  ];

  // Calling remark options
  const callingRemarkOptions = [
    { value: 'blc event updated', label: 'BLC Event Updated' },
    { value: 'for low registration count', label: 'For Low Registration Count' },
    { value: 'for admit card', label: 'For Admit Card' }
  ];

  // State for each ABRC group's form data
  const [formData, setFormData] = useState({});

  // State for call logs fetched (today + previous 5 days) and mapping per ABRC
  const [callLogsRange, setCallLogsRange] = useState([]); // raw logs array
  const [abrcCallStatusMap, setAbrcCallStatusMap] = useState({}); // { "<abrc>||<contact>": { calledToday: bool, previousRemarks: [] } }
  const [loadingCallLogs, setLoadingCallLogs] = useState(false);

  // Handle form input changes for each ABRC group
  const handleInputChange = (abrcKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      [abrcKey]: {
        ...prev[abrcKey],
        [field]: value
      }
    }));
  };

  // Fetch call logs for caller (today + 5 previous days) and build abrc map
  const fetchCallLogs = async () => {
    try {
      const callerId = userData?.user?._id ?? userData?._id ?? null;
      if (!callerId) return; // user not ready

      setLoadingCallLogs(true);

      const reqBody = { callerId };
      const response = await GetCallLogsCurrentData(reqBody);
      // Expecting response.data.data = logs array and response.data.previousRemarks maybe
      const logs = response?.data?.data ?? response?.data ?? [];

      setCallLogsRange(logs || []);

      // build map keyed by abrc||abrcContact
      const map = {};
      for (const log of logs || []) {
        const key = `${(log.abrc || "").toString().trim()}||${(log.abrcContact || "").toString().trim()}`;
        // determine if log is from today IST
        const logIstDate = toIstDateString(log.createdAt);
        const isToday = logIstDate === todayIstString;
        if (!map[key]) {
          map[key] = { calledToday: false, previousRemarks: [] };
        }
        if (isToday) {
          map[key].calledToday = true;
        } else {
          // collect previous (not-today) remark values
          if (log.callingRemark) map[key].previousRemarks.push(log.callingRemark);
        }
      }

      // dedupe previousRemarks per key
      Object.keys(map).forEach(k => {
        const arr = map[k].previousRemarks || [];
        map[k].previousRemarks = Array.from(new Set(arr.map(x => (typeof x === 'string' ? x.trim() : x))));
      });

      setAbrcCallStatusMap(map);
    } catch (err) {
      console.error("Error fetching call logs:", err);
    } finally {
      setLoadingCallLogs(false);
    }
  };

  useEffect(() => {
    fetchCallLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]); // re-fetch when userData becomes available

 // replace the current handleSubmit with this function in your component
const handleSubmit = async (abrcKey, group) => {
  try {
    const data = formData[abrcKey] || {};

    // Basic validation
    if (!data.callingStatus) {
      alert('Please select calling status');
      return;
    }
    if (!data.callingRemark) {
      alert('Please select calling remark');
      return;
    }

    // Validate user data
    const callerId = userData?.user?._id ?? userData?._id ?? null;
    if (!callerId) {
      alert('User information not found. Please login again.');
      return;
    }

    // Build a single block-level call log (no centerId)
    const callLogData = {
      callerId: callerId,
      districtId: group.schools[0]?.districtId ?? "",
      districtName: group.schools[0]?.districtName ?? "",
      blockId: group.schools[0]?.blockId ?? "",
      blockName: group.schools[0]?.blockName ?? "",
      centerId: "",                 // intentionally empty or omit on server
      centerName: "",               // optional
      schoolType: "",               // optional
      isCluster: false,             // optional
      abrc: group.abrc ?? "",
      abrcContact: group.abrcContact ?? "",
      principal: group.schools[0]?.principal ?? "",           // optional
      princiaplContact: group.schools[0]?.princiaplContact ?? "",
      principalAbrcDataUpdatedBy: userData?.user?.userName ?? userData?.userName ?? "",
      callingStatus: data.callingStatus,
      callingRemark: data.callingRemark,
      manualRemark: data.manualRemark || '',
      calledTo: "ABRC"
    };

    const res = await CreateCallLogs(callLogData);

    if (res && (res.success || res.data)) {
      // clear form
      setFormData(prev => ({ ...prev, [abrcKey]: undefined }));
      // refresh logs so UI disables group after successful call
      await fetchCallLogs();
      alert("Call log created successfully!");
    } else {
      console.error("CreateCallLogs response:", res);
      alert(res?.message || "Failed to create call log");
    }
  } catch (error) {
    console.error("Error creating call log:", error);
    alert("Error creating call log. Please try again.");
  }
};


  // debug logs (optional)
  console.log("userBlocks:", userBlocks);
  console.log("filteredSchools length:", filteredSchools.length);
  console.log("abrcGroups count:", abrcGroups.length);
  //console.log("abrcCallStatusMap:", abrcCallStatusMap);

  return (
    <Container fluid className="py-4">
      <Row className="mb-3">
        <Col>
          <h3>ABRC Calling Sheet</h3>
          <p className="text-muted">
            Showing ABRCs for blocks that match the logged-in user's access (only entries with ABRC filled).
          </p>
        </Col>
      </Row>

      {loadingDBS || loadingCallLogs ? (
        <Row>
          <Col className="text-center">
            <Spinner animation="border" role="status" />
            <div>Loading centers and call logs...</div>
          </Col>
        </Row>
      ) : abrcGroups.length === 0 ? (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>No ABRC data found for your assigned blocks.</Card.Text>
                <Card.Text>
                  Either ABRC is missing for centers in your blocks or your user access (district/block) isn't configured.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Accordion defaultActiveKey={abrcGroups.length ? "0" : null}>
              {abrcGroups.map((group, idx) => {
                const headerLabel = group.abrc || "Unknown ABRC";
                const contact = group.abrcContact || "";
                const abrcKey = `${headerLabel}-${contact}-${idx}`; // used for form state
                const simpleKey = `${headerLabel}||${contact}`; // used to lookup call status map
                const currentFormData = formData[abrcKey] || {};
                const statusEntry = abrcCallStatusMap[simpleKey] || { calledToday: false, previousRemarks: [] };
                const disabled = !!statusEntry.calledToday;

                return (
                  <Accordion.Item eventKey={String(idx)} key={abrcKey}>
                    <Accordion.Header>
                      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong>{headerLabel}</strong>
                          <div style={{ fontSize: "0.85rem", color: "#666" }}>
                            {group.schools.length} school{group.schools.length > 1 ? "s" : ""}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {contact ? (
                            <a href={`tel:${contact}`} onClick={(e) => { /* optionally track click */ }}>
                              {contact}
                            </a>
                          ) : (
                            <small className="text-muted">No contact</small>
                          )}
                        </div>
                      </div>
                    </Accordion.Header>

                    <Accordion.Body>
                      {/* If called today, show a notice */}
                      {disabled && (
                        <Alert variant="warning">
                          <strong>Already called today.</strong> Further calls are disabled for this ABRC.
                        </Alert>
                      )}

                      {/* Previous remarks (from earlier days in fetched range) */}
                      {statusEntry.previousRemarks && statusEntry.previousRemarks.length > 0 && (
                        <Card className="mb-3">
                          <Card.Header><strong>Previous remarks (last days)</strong></Card.Header>
                          <Card.Body>
                            <ul style={{ marginBottom: 0 }}>
                              {statusEntry.previousRemarks.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </Card.Body>
                        </Card>
                      )}

                      {/* Calling Form */}
                      <Card className="mb-3">
                        <Card.Header>
                          <h6 className="mb-0">Calling Information</h6>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Calling Status *</Form.Label>
                                <Select
                                  options={callingStatusOptions}
                                  value={callingStatusOptions.find(opt => opt.value === currentFormData.callingStatus) ?? null}
                                  onChange={(selected) => handleInputChange(abrcKey, 'callingStatus', selected?.value)}
                                  placeholder="Select calling status"
                                  isDisabled={disabled}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Calling Remark *</Form.Label>
                                <Select
                                  options={callingRemarkOptions}
                                  value={callingRemarkOptions.find(opt => opt.value === currentFormData.callingRemark) ?? null}
                                  onChange={(selected) => handleInputChange(abrcKey, 'callingRemark', selected?.value)}
                                  placeholder="Select calling remark"
                                  isDisabled={disabled}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Manual Remark</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  placeholder="Enter any additional remarks..."
                                  value={currentFormData.manualRemark || ''}
                                  onChange={(e) => handleInputChange(abrcKey, 'manualRemark', e.target.value)}
                                  disabled={disabled}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Button 
                                variant="primary" 
                                onClick={() => handleSubmit(abrcKey, group)}
                                disabled={disabled || !currentFormData.callingStatus || !currentFormData.callingRemark}
                              >
                                Submit Call Logs
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

                      {/* Schools minimal list: only # and School Name */}
                      <Table striped bordered hover responsive size="sm" className="mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>School Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.schools.map((s, i) => (
                            <tr key={`${s._id || s.centerId || i}`}>
                              <td>{i + 1}</td>
                              <td style={{ minWidth: 200 }}>{s.centerName ?? "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Col>
        </Row>
      )}
    </Container>
  );
};
