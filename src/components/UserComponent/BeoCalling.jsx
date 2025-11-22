// import React, { useMemo, useContext, useState, useEffect } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Badge,
//   Spinner,
//   Form,
//   Button,
//   Alert,
//   Table
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import Select from 'react-select';

// import { GetCallLeadsByUserObjectId, UpdateCallLeads } from "../../services/UserServices/UserService";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";
// import { GetDistrictBlockSchoolsByContact } from "../../services/UserServices/UserService";


// export const BeoCallings = () => {
//   const { userData } = useContext(UserContext);
//   const { districtBlockSchoolData = [] } = useDistrictBlockSchool() || {};

//   const [dashboardMap, setDashboardMap] = useState({});
//   const [mainDashboardData, setMainDashboardData] = useState([]);

//   const fetchMainDashboardCount = async () => {
//     try {
//       const response = await MainDashBoard();
//       setMainDashboardData(response.data);
      
//       // Create a map of centerId to registration counts
//       const map = {};
//       for (const school of response.data || []) {
//         if (school && school.centerId) {
//           map[String(school.centerId)] = {
//             school: {
//               byClass: {
//                 "8": { registered: Number(school.registrationCount8 || 0) },
//                 "10": { registered: Number(school.registrationCount10 || 0) }
//               }
//             }
//           };
//         }
//       }
//       setDashboardMap(map);
//     } catch (error) {
//       console.error("Error fetching main dashboard data", error);
//     }
//   }

//   const fetchDashboarcount = async () => {
//     try {
//       const resp = await DashboardCounts();
//       const data = resp?.data ?? resp;
//       const centers = data?.centers ?? [];
//       const map = {};
//       for (const c of centers) {
//         if (c && c.centerId) map[String(c.centerId)] = c.dashboardCounts ?? {};
//       }
//       setDashboardMap(map);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//     }
//   };

//   useEffect(() => { 
//     fetchMainDashboardCount();
//   }, []);




//   const navigate = useNavigate();
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [savingIds, setSavingIds] = useState(new Set());
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);

//   const CALL_STATUS = [
//     { value: "Connected", label: "Connected" },
//     { value: "Not connected", label: "Not connected" }
//   ];

//   const CONNECTED_REMARKS = [
//     { value: "Low Registration Count Calling", label: "Low Registration Count Calling" },
//     { value: "Follow up calling", label: "Follow up calling" },
//     { value: "Other", label: "Other" }
//   ];

//   const NOT_CONNECTED_REMARKS = [
//     { value: "Wrong number", label: "Wrong number" },
//     { value: "Call not picked", label: "Call not picked" }
//   ];

//   const fmt = (iso) => iso ? new Date(iso).toLocaleString() : "-";

//   // UPDATED: Function to calculate total block sums for Class 8 and Class 10
//   const getBlockTotalSnippets = (schools) => {
//     let totalClass8 = 0;
//     let totalClass10 = 0;
    
//     schools.forEach(school => {
//       const mainData = mainDashboardData.find(item => 
//         item.centerId && school.centerId && 
//         String(item.centerId) === String(school.centerId)
//       );
      
//       const count8 = mainData ? Number(mainData.registrationCount8 || 0) : 0;
//       const count10 = mainData ? Number(mainData.registrationCount10 || 0) : 0;
      
//       totalClass8 += count8;
//       totalClass10 += count10;
//     });
    
//     return [`Class 8: ${totalClass8}`, `Class 10: ${totalClass10}`];
//   };

//   const fetchCallLeads = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const reqBody = { objectIdOfCaller: userData?.user?._id, callMadeTo: "BEO" };
//       const response = await GetCallLeadsByUserObjectId(reqBody);
//       const data = response?.data ?? [];

//       console.log(data)
// console.log(data)
//       const map = new Map();
//       for (const item of data) {
//         const callerId = item.callerUser?._id ?? "nullcaller";
//         const key = [callerId, item.callMadeTo ?? "", item.districtId ?? "", item.blockId ?? "", item.centerId ?? ""].join("|");
//         if (!map.has(key)) map.set(key, []);
//         map.get(key).push(item);
//       }

//       const groupsArr = [];
//       for (const [key, rows] of map.entries()) {
//         const sorted = rows.slice().sort((a, b) => new Date(b.callingDate ?? b.createdAt) - new Date(a.callingDate ?? a.createdAt));
//         const current = sorted[0];
//         const history = sorted.slice(1);

//         // check if today callStatus is Connected or Not connected
//         const todayStatus = ["Connected", "Not connected"].includes(current.callingStatus);

//         groupsArr.push({
//           key,
//           current: {
//             ...current,
//             _edit: {
//               callingStatus: current.callingStatus ?? null,
//               callingRemark1: current.callingRemark1 ?? "",
//               mannualRemark: current.mannualRemark ?? ""
//             },
//             calledPerson: current.calledPerson || {
//               centerName: current.centerName || "Unknown School",
//               beo: current.beo || "N/A",
//               beoContact: current.beoContact || null,
//               districtName: current.districtName || null,
//               blockName: current.blockName || null
//             },
//             _submitted: todayStatus,
//             calledPersonRegion: current.calledPersonRegion || []
//           },
//           history
//         });
//       }
//       setGroups(groupsArr);
//     } catch (err) {
//       console.error("Fetch leads error", err);
//       setError("Failed to load call leads");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCallLeads(); }, []);

//   const handleFieldChange = (groupKey, field, value) => {
//     setGroups(prev => prev.map(g => {
//       if (g.key === groupKey) {
//         const updatedEdit = { ...g.current._edit, [field]: value };
//         // If calling status is changed, reset calling remark
//         if (field === "callingStatus") {
//           updatedEdit.callingRemark1 = "";
//         }
//         return { ...g, current: { ...g.current, _edit: updatedEdit } };
//       }
//       return g;
//     }));
//   };

//   const updateLead = async (group) => {
//     setError(null);
//     setSuccessMsg(null);
//     const id = group.current._id;
//     setSavingIds(s => new Set(s).add(id));

//     const reqBody = {
//       _id: id,
//       callingStatus: group.current._edit.callingStatus,
//       callingRemark1: group.current._edit.callingRemark1 || null,
//       mannualRemark: group.current._edit.mannualRemark || null
//     };

//     try {
//       const resp = await UpdateCallLeads(reqBody);
//       const returned = resp?.data ?? {};

//       setGroups(prev => prev.map(g =>
//         g.key === group.key
//           ? {
//               ...g,
//               current: {
//                 ...g.current,
//                 ...returned,
//                 _edit: { ...g.current._edit },
//                 _submitted: ["Connected", "Not connected"].includes(returned.callingStatus)
//               },
//               history: [returned, ...g.history]
//             }
//           : g
//       ));

//       setSuccessMsg("Call submitted successfully");
//       setTimeout(() => setSuccessMsg(null), 2000);
//     } catch (err) {
//       console.error("UpdateCallLeads error", err);
//       setError("Failed to submit lead");
//     } finally {
//       setSavingIds(s => { const next = new Set(s); next.delete(id); return next; });
//     }
//   };

//   // Calculate call statistics
//   const callStats = useMemo(() => {
//     const totalCalls = groups.length;
//     const completedCalls = groups.filter(g => g.current._submitted).length;
//     const pendingCalls = totalCalls - completedCalls;
    
//     return {
//       totalCalls,
//       completedCalls,
//       pendingCalls
//     };
//   }, [groups]);

//   // Function to aggregate school data by district and block
//   const getAggregatedSchoolData = (schools) => {
//     const aggregationMap = new Map();
    
//     schools.forEach(school => {
//       const key = `${school.districtId}-${school.blockId}`;
//       if (!aggregationMap.has(key)) {
//         aggregationMap.set(key, {
//           districtId: school.districtId,
//           districtName: school.districtName,
//           blockId: school.blockId,
//           blockName: school.blockName,
//           count8: 0,
//           count10: 0,
//           total: 0,
//           schoolCount: 0
//         });
//       }
      
//       const mainData = mainDashboardData.find(item => 
//         item.centerId && school.centerId && 
//         String(item.centerId) === String(school.centerId)
//       );
      
//       const count8 = mainData ? Number(mainData.registrationCount8 || 0) : 0;
//       const count10 = mainData ? Number(mainData.registrationCount10 || 0) : 0;
      
//       const existing = aggregationMap.get(key);
//       existing.count8 += count8;
//       existing.count10 += count10;
//       existing.total += (count8 + count10);
//       existing.schoolCount += 1;
//     });
    
//     return Array.from(aggregationMap.values());
//   };

//   return (
//     <Container className="py-3">
//       <h3 className="mb-3">BEO Callings</h3>

//       {/* Call Summary Statistics */}
//       <Row className="mb-3">
//         <Col md={4}>
//           <Card className="text-center">
//             <Card.Body>
//               <Card.Title style={{ fontSize: "2rem", fontWeight: "bold", color: "#007bff" }}>
//                 {callStats.totalCalls}
//               </Card.Title>
//               <Card.Text>Total Calls</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="text-center">
//             <Card.Body>
//               <Card.Title style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}>
//                 {callStats.completedCalls}
//               </Card.Title>
//               <Card.Text>Completed Calls</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="text-center">
//             <Card.Body>
//               <Card.Title style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc3545" }}>
//                 {callStats.pendingCalls}
//               </Card.Title>
//               <Card.Text>Pending Calls</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {loading && <div className="mb-3"><Spinner animation="border" size="sm" /> Loading leads...</div>}
//       {error && <Alert variant="danger">{error}</Alert>}
//       {successMsg && <Alert variant="success">{successMsg}</Alert>}
//       {!loading && groups.length === 0 && <Alert variant="info">No call leads found for you.</Alert>}

//       <Row xs={1} md={2} lg={2} className="g-3">
//         {groups.map(g => {
//           const lead = g.current;
//           const edit = lead._edit || {};
//           const saving = savingIds.has(lead._id);
//           const submitted = lead._submitted;
//           // UPDATED: Use getBlockTotalSnippets instead of headerClassSnippets
//           const snippets = getBlockTotalSnippets(lead.calledPersonRegion || []);

//           // Get appropriate calling remarks based on selected status
//           const callingRemarkOptions = edit.callingStatus === "Connected" 
//             ? CONNECTED_REMARKS 
//             : edit.callingStatus === "Not connected" 
//             ? NOT_CONNECTED_REMARKS 
//             : [];

//           // Get aggregated school data for this BEO
//           const aggregatedData = getAggregatedSchoolData(lead.calledPersonRegion || []);

//           return (
//             <Col key={g.key}>
//               <Card className={submitted ? "border-success" : ""} style={submitted ? { backgroundColor: "#d4edda" } : {}}>
//                 <Card.Header className="d-flex justify-content-between align-items-start">
//                   <div>
//                     <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{lead.calledPerson?.beo}</div>
//                     <div className="small text-muted">{lead.calledPerson?.districtName} — {lead.calledPerson?.blockName}</div>
//                     {snippets.length > 0 && <div className="small text-muted mt-1">{snippets.join(" · ")}</div>}
//                     {lead.calledPerson?.beoContact
//                       ? <div className="small mt-1">Contact: <a href={`tel:${lead.calledPerson.beoContact}`}>{lead.calledPerson.beoContact}</a></div>
//                       : <div className="small mt-1">Contact: N/A</div>}
//                   </div>
//                   <div className="text-end">
//                     <Badge bg="primary" className="mb-1">{lead.callMadeTo}</Badge>
//                     <div className="small text-muted">Block-Id: {lead.blockId}</div>
//                     {/* <div className="small text-muted">Last: {fmt(lead.callingDate ?? lead.createdAt)}</div> */}
//                     {/* <div className="small text-muted">History: {g.history.length}</div> */}
//                   </div>
//                 </Card.Header>

//                 <Card.Body style={{ padding: "0.5rem" }}>

//                   {/* BEO Schools Registration Table - Aggregated by District and Block */}
//                   {aggregatedData.length > 0 && (
//                     <Card className="mb-2">
//                       <Card.Header><strong>BEO Schools Registration Summary</strong></Card.Header>
//                       <Card.Body style={{ padding: 0 }}>
//                         <Table striped bordered hover responsive className="mb-0">
//                           <thead>
//                             <tr>
//                               <th style={{ width: "5%" }}>#</th>
//                               <th>District</th>
//                               <th>Block</th>
//                               <th style={{ textAlign: "center" }}>Schools</th>
//                               <th style={{ textAlign: "center" }}>Class 8</th>
//                               <th style={{ textAlign: "center" }}>Class 10</th>
//                               <th style={{ textAlign: "center" }}>Total</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {aggregatedData.map((item, index) => (
//                               <tr key={`${item.districtId}-${item.blockId}`}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.districtName}</td>
//                                 <td>{item.blockName}</td>
//                                 <td style={{ textAlign: "center" }}>{item.schoolCount}</td>
//                                 <td style={{ textAlign: "center" }}>{item.count8}</td>
//                                 <td style={{ textAlign: "center" }}>{item.count10}</td>
//                                 <td style={{ textAlign: "center", fontWeight: "bold" }}>
//                                   {item.total}
//                                 </td>
//                               </tr>
//                             ))}
//                             {/* Total Row */}
//                             {aggregatedData.length > 1 && (
//                               <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
//                                 <td colSpan={3} style={{ textAlign: "right" }}>Total:</td>
//                                 <td style={{ textAlign: "center" }}>
//                                   {aggregatedData.reduce((sum, item) => sum + item.schoolCount, 0)}
//                                 </td>
//                                 <td style={{ textAlign: "center" }}>
//                                   {aggregatedData.reduce((sum, item) => sum + item.count8, 0)}
//                                 </td>
//                                 <td style={{ textAlign: "center" }}>
//                                   {aggregatedData.reduce((sum, item) => sum + item.count10, 0)}
//                                 </td>
//                                 <td style={{ textAlign: "center" }}>
//                                   {aggregatedData.reduce((sum, item) => sum + item.total, 0)}
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </Table>
//                       </Card.Body>
//                     </Card>
//                   )}

//                   <Card className="mb-2">
//                     <Card.Header><strong>Calling History</strong></Card.Header>
//                     <Card.Body style={{ padding: 0 }}>
//                       <Table striped bordered hover size="sm" className="mb-0">
//                         <thead>
//                           <tr><th>Date</th><th>Remark</th><th>Comments</th></tr>
//                         </thead>
//                         <tbody>
//                           {g.history.length === 0
//                             ? <tr><td colSpan={3} className="text-center small text-muted">No history</td></tr>
//                             : g.history.map(h => (
//                                 <tr key={h._id}>
//                                   <td className="small">{fmt(h.callingDate ?? h.createdAt)}</td>
//                                   <td className="small">{h.callingRemark1 ?? "-"}</td>
//                                   <td className="small">{h.mannualRemark ?? "-"}</td>
//                                 </tr>
//                               ))
//                           }
//                         </tbody>
//                       </Table>
//                     </Card.Body>
//                   </Card>

//                   <Row className="mb-2">
//                     <Col xs={6}>
//                       <Form.Group>
//                         <Form.Label className="small">Calling Status</Form.Label>
//                         <Select
//                           value={CALL_STATUS.find(o => o.value === edit.callingStatus) || null}
//                           onChange={sel => handleFieldChange(g.key, "callingStatus", sel ? sel.value : null)}
//                           options={CALL_STATUS}
//                           placeholder="— select —"
//                           isClearable
//                           isDisabled={submitted}
//                         />
//                       </Form.Group>
//                     </Col>

//                     <Col xs={6}>
//                       <Form.Group>
//                         <Form.Label className="small">Calling Remark</Form.Label>
//                         <Select
//                           value={callingRemarkOptions.find(o => o.value === edit.callingRemark1) || null}
//                           onChange={sel => handleFieldChange(g.key, "callingRemark1", sel ? sel.value : null)}
//                           options={callingRemarkOptions}
//                           placeholder="— select —"
//                           isClearable
//                           isDisabled={submitted || !edit.callingStatus}
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>

//                   <Row className="mb-2">
//                     <Col xs={12}>
//                       <Form.Group>
//                         <Form.Label className="small">Comments</Form.Label>
//                         <Form.Control
//                           as="textarea"
//                           rows={2}
//                           value={edit.mannualRemark ?? ""}
//                           onChange={e => handleFieldChange(g.key, "mannualRemark", e.target.value)}
//                           disabled={submitted}
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                 </Card.Body>

//                 <Card.Footer className="d-flex justify-content-between align-items-center">
//                   {/* <div className="small text-muted">Current record created: {fmt(lead.createdAt)}</div> */}
//                   {!submitted && (
//                     <div>
//                       <Button
//                         size="sm"
//                         variant="secondary"
//                         className="me-2"
//                         onClick={() => {
//                           setGroups(prev =>
//                             prev.map(gg => gg.key === g.key
//                               ? { ...gg, current: { ...gg.current, _edit: { ...gg.current } } }
//                               : gg
//                             )
//                           );
//                         }}
//                       >Reset</Button>

//                       <Button size="sm" variant="primary" onClick={() => updateLead(g)} disabled={saving}>
//                         {saving ? <><Spinner animation="border" size="sm" /> Submitting...</> : "Submit"}
//                       </Button>
//                     </div>
//                   )}
//                 </Card.Footer>
//               </Card>
//             </Col>
//           );
//         })}
//       </Row>
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
//   Spinner,
//   Form,
//   Button,
//   Alert,
//   Table
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import Select from 'react-select';

// import { GetCallLeadsByUserObjectId, UpdateCallLeads } from "../../services/UserServices/UserService";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";
// import { GetDistrictBlockSchoolsByContact } from "../../services/UserServices/UserService";


// export const BeoCallings = () => {
//   const { userData } = useContext(UserContext);
//   const { districtBlockSchoolData = [] } = useDistrictBlockSchool() || {};

//   const [dashboardMap, setDashboardMap] = useState({});
//   const [mainDashboardData, setMainDashboardData] = useState([]);

//   const fetchMainDashboardCount = async () => {
//     try {
//       const response = await MainDashBoard();
//       setMainDashboardData(response.data);
      
//       // Create a map of centerId to registration counts
//       const map = {};
//       for (const school of response.data || []) {
//         if (school && school.centerId) {
//           map[String(school.centerId)] = {
//             school: {
//               byClass: {
//                 "8": { registered: Number(school.registrationCount8 || 0) },
//                 "10": { registered: Number(school.registrationCount10 || 0) }
//               }
//             }
//           };
//         }
//       }
//       setDashboardMap(map);
//     } catch (error) {
//       console.error("Error fetching main dashboard data", error);
//     }
//   }

//   const fetchDashboarcount = async () => {
//     try {
//       const resp = await DashboardCounts();
//       const data = resp?.data ?? resp;
//       const centers = data?.centers ?? [];
//       const map = {};
//       for (const c of centers) {
//         if (c && c.centerId) map[String(c.centerId)] = c.dashboardCounts ?? {};
//       }
//       setDashboardMap(map);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//     }
//   };

//   useEffect(() => { 
//     fetchMainDashboardCount();
//   }, []);




//   const navigate = useNavigate();
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [savingIds, setSavingIds] = useState(new Set());
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);

//   const CALL_STATUS = [
//     { value: "Connected", label: "Connected" },
//     { value: "Not connected", label: "Not connected" }
//   ];

//   const CONNECTED_REMARKS = [
//     { value: "Low Registration Count Calling", label: "Low Registration Count Calling" },
//     { value: "Follow up calling", label: "Follow up calling" },
//     { value: "Other", label: "Other" }
//   ];

//   const NOT_CONNECTED_REMARKS = [
//     { value: "Wrong number", label: "Wrong number" },
//     { value: "Call not picked", label: "Call not picked" }
//   ];

//   const fmt = (iso) => iso ? new Date(iso).toLocaleString() : "-";

//   // UPDATED: Function to calculate total block sums for Class 8 and Class 10
//   const getBlockTotalSnippets = (schools) => {
//     let totalClass8 = 0;
//     let totalClass10 = 0;
    
//     schools.forEach(school => {
//       const mainData = mainDashboardData.find(item => 
//         item.centerId && school.centerId && 
//         String(item.centerId) === String(school.centerId)
//       );
      
//       const count8 = mainData ? Number(mainData.registrationCount8 || 0) : 0;
//       const count10 = mainData ? Number(mainData.registrationCount10 || 0) : 0;
      
//       totalClass8 += count8;
//       totalClass10 += count10;
//     });
    
//     return [`Class 8: ${totalClass8}`, `Class 10: ${totalClass10}`];
//   };

//   const fetchCallLeads = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const reqBody = { objectIdOfCaller: userData?.user?._id, callMadeTo: "BEO" };
//       const response = await GetCallLeadsByUserObjectId(reqBody);
//       const data = response?.data ?? [];

//       console.log(data)
// console.log(data)
//       const map = new Map();
//       for (const item of data) {
//         const callerId = item.callerUser?._id ?? "nullcaller";
//         const key = [callerId, item.callMadeTo ?? "", item.districtId ?? "", item.blockId ?? "", item.centerId ?? ""].join("|");
//         if (!map.has(key)) map.set(key, []);
//         map.get(key).push(item);
//       }

//       const groupsArr = [];
//       for (const [key, rows] of map.entries()) {
//         const sorted = rows.slice().sort((a, b) => new Date(b.callingDate ?? b.createdAt) - new Date(a.callingDate ?? a.createdAt));
//         const current = sorted[0];
//         const history = sorted.slice(1);

//         // check if today callStatus is Connected or Not connected
//         const todayStatus = ["Connected", "Not connected"].includes(current.callingStatus);

//         groupsArr.push({
//           key,
//           current: {
//             ...current,
//             _edit: {
//               callingStatus: current.callingStatus ?? null,
//               callingRemark1: current.callingRemark1 ?? "",
//               mannualRemark: current.mannualRemark ?? ""
//             },
//             calledPerson: current.calledPerson || {
//               centerName: current.centerName || "Unknown School",
//               beo: current.beo || "N/A",
//               beoContact: current.beoContact || null,
//               districtName: current.districtName || null,
//               blockName: current.blockName || null
//             },
//             _submitted: todayStatus,
//             calledPersonRegion: current.calledPersonRegion || []
//           },
//           history
//         });
//       }
//       setGroups(groupsArr);
//     } catch (err) {
//       console.error("Fetch leads error", err);
//       setError("Failed to load call leads");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCallLeads(); }, []);

//   const handleFieldChange = (groupKey, field, value) => {
//     setGroups(prev => prev.map(g => {
//       if (g.key === groupKey) {
//         const updatedEdit = { ...g.current._edit, [field]: value };
//         // If calling status is changed, reset calling remark
//         if (field === "callingStatus") {
//           updatedEdit.callingRemark1 = "";
//         }
//         return { ...g, current: { ...g.current, _edit: updatedEdit } };
//       }
//       return g;
//     }));
//   };

//   const updateLead = async (group) => {
//     setError(null);
//     setSuccessMsg(null);
    
//     // Check if calling status is selected
//     if (!group.current._edit.callingStatus) {
//       setError("Please select Calling Status");
//       return;
//     }
    
//     // Check if calling remark is selected
//     if (!group.current._edit.callingRemark1) {
//       setError("Please select Calling Remark");
//       return;
//     }

//     const id = group.current._id;
//     setSavingIds(s => new Set(s).add(id));

//     const reqBody = {
//       _id: id,
//       callingStatus: group.current._edit.callingStatus,
//       callingRemark1: group.current._edit.callingRemark1 || null,
//       mannualRemark: group.current._edit.mannualRemark || null
//     };

//     try {
//       const resp = await UpdateCallLeads(reqBody);
//       const returned = resp?.data ?? {};

//       setGroups(prev => prev.map(g =>
//         g.key === group.key
//           ? {
//               ...g,
//               current: {
//                 ...g.current,
//                 ...returned,
//                 _edit: { ...g.current._edit },
//                 _submitted: ["Connected", "Not connected"].includes(returned.callingStatus)
//               },
//               history: [returned, ...g.history]
//             }
//           : g
//       ));

//       setSuccessMsg("Call submitted successfully");
//       setTimeout(() => setSuccessMsg(null), 2000);
//     } catch (err) {
//       console.error("UpdateCallLeads error", err);
//       setError("Failed to submit lead");
//     } finally {
//       setSavingIds(s => { const next = new Set(s); next.delete(id); return next; });
//     }
//   };

//   // Calculate call statistics
//   const callStats = useMemo(() => {
//     const totalCalls = groups.length;
//     const completedCalls = groups.filter(g => g.current._submitted).length;
//     const pendingCalls = totalCalls - completedCalls;
    
//     return {
//       totalCalls,
//       completedCalls,
//       pendingCalls
//     };
//   }, [groups]);

//   // Function to aggregate school data by district and block
//   const getAggregatedSchoolData = (schools) => {
//     const aggregationMap = new Map();
    
//     schools.forEach(school => {
//       const key = `${school.districtId}-${school.blockId}`;
//       if (!aggregationMap.has(key)) {
//         aggregationMap.set(key, {
//           districtId: school.districtId,
//           districtName: school.districtName,
//           blockId: school.blockId,
//           blockName: school.blockName,
//           count8: 0,
//           count10: 0,
//           total: 0,
//           schoolCount: 0
//         });
//       }
      
//       const mainData = mainDashboardData.find(item => 
//         item.centerId && school.centerId && 
//         String(item.centerId) === String(school.centerId)
//       );
      
//       const count8 = mainData ? Number(mainData.registrationCount8 || 0) : 0;
//       const count10 = mainData ? Number(mainData.registrationCount10 || 0) : 0;
      
//       const existing = aggregationMap.get(key);
//       existing.count8 += count8;
//       existing.count10 += count10;
//       existing.total += (count8 + count10);
//       existing.schoolCount += 1;
//     });
    
//     return Array.from(aggregationMap.values());
//   };

//   return (
//     <Container className="py-3">
//       <h3 className="mb-3">BEO Callings</h3>

//       {/* Call Summary Statistics */}
//       <Row className="mb-3">
//         <Col md={4}>
//           <Card className="text-center">
//             <Card.Body>
//               <Card.Title style={{ fontSize: "2rem", fontWeight: "bold", color: "#007bff" }}>
//                 {callStats.totalCalls}
//               </Card.Title>
//               <Card.Text>Total Calls</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="text-center">
//             <Card.Body>
//               <Card.Title style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}>
//                 {callStats.completedCalls}
//               </Card.Title>
//               <Card.Text>Completed Calls</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="text-center">
//             <Card.Body>
//               <Card.Title style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc3545" }}>
//                 {callStats.pendingCalls}
//               </Card.Title>
//               <Card.Text>Pending Calls</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {loading && <div className="mb-3"><Spinner animation="border" size="sm" /> Loading leads...</div>}
//       {error && <Alert variant="danger">{error}</Alert>}
//       {successMsg && <Alert variant="success">{successMsg}</Alert>}
//       {!loading && groups.length === 0 && <Alert variant="info">No call leads found for you.</Alert>}

//       <Row xs={1} md={2} lg={2} className="g-3">
//         {groups.map(g => {
//           const lead = g.current;
//           const edit = lead._edit || {};
//           const saving = savingIds.has(lead._id);
//           const submitted = lead._submitted;
//           // UPDATED: Use getBlockTotalSnippets instead of headerClassSnippets
//           const snippets = getBlockTotalSnippets(lead.calledPersonRegion || []);

//           // Get appropriate calling remarks based on selected status
//           const callingRemarkOptions = edit.callingStatus === "Connected" 
//             ? CONNECTED_REMARKS 
//             : edit.callingStatus === "Not connected" 
//             ? NOT_CONNECTED_REMARKS 
//             : [];

//           // Get aggregated school data for this BEO
//           const aggregatedData = getAggregatedSchoolData(lead.calledPersonRegion || []);

//           return (
//             <Col key={g.key}>
//               <Card className={submitted ? "border-success" : ""} style={submitted ? { backgroundColor: "#d4edda" } : {}}>
//                 <Card.Header className="d-flex justify-content-between align-items-start">
//                   <div>
//                     <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{lead.calledPerson?.beo}</div>
//                     <div className="small text-muted">{lead.calledPerson?.districtName} — {lead.calledPerson?.blockName}</div>
//                     {snippets.length > 0 && <div className="small text-muted mt-1">{snippets.join(" · ")}</div>}
//                     {lead.calledPerson?.beoContact
//                       ? <div className="small mt-1">Contact: <a href={`tel:${lead.calledPerson.beoContact}`}>{lead.calledPerson.beoContact}</a></div>
//                       : <div className="small mt-1">Contact: N/A</div>}
//                   </div>
//                   <div className="text-end">
//                     <Badge bg="primary" className="mb-1">{lead.callMadeTo}</Badge>
//                     <div className="small text-muted">Block-Id: {lead.blockId}</div>
//                     {/* <div className="small text-muted">Last: {fmt(lead.callingDate ?? lead.createdAt)}</div> */}
//                     {/* <div className="small text-muted">History: {g.history.length}</div> */}
//                   </div>
//                 </Card.Header>

//                 <Card.Body style={{ padding: "0.5rem" }}>

//                   {/* BEO Schools Registration Table - Aggregated by District and Block */}
//                   {aggregatedData.length > 0 && (
//                     <Card className="mb-2">
//                       <Card.Header><strong>BEO Schools Registration Summary</strong></Card.Header>
//                       <Card.Body style={{ padding: 0 }}>
//                         <Table striped bordered hover responsive className="mb-0">
//                           <thead>
//                             <tr>
//                               <th style={{ width: "5%" }}>#</th>
//                               <th>District</th>
//                               <th>Block</th>
//                               <th style={{ textAlign: "center" }}>Schools</th>
//                               <th style={{ textAlign: "center" }}>Class 8</th>
//                               <th style={{ textAlign: "center" }}>Class 10</th>
//                               <th style={{ textAlign: "center" }}>Total</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {aggregatedData.map((item, index) => (
//                               <tr key={`${item.districtId}-${item.blockId}`}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.districtName}</td>
//                                 <td>{item.blockName}</td>
//                                 <td style={{ textAlign: "center" }}>{item.schoolCount}</td>
//                                 <td style={{ textAlign: "center" }}>{item.count8}</td>
//                                 <td style={{ textAlign: "center" }}>{item.count10}</td>
//                                 <td style={{ textAlign: "center", fontWeight: "bold" }}>
//                                   {item.total}
//                                 </td>
//                               </tr>
//                             ))}
//                             {/* Total Row */}
//                             {aggregatedData.length > 1 && (
//                               <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
//                                 <td colSpan={3} style={{ textAlign: "right" }}>Total:</td>
//                                 <td style={{ textAlign: "center" }}>
//                                   {aggregatedData.reduce((sum, item) => sum + item.schoolCount, 0)}
//                                 </td>
//                                 <td style={{ textAlign: "center" }}>
//                                   {aggregatedData.reduce((sum, item) => sum + item.count8, 0)}
//                                 </td>
//                                 <td style={{ textAlign: "center" }}>
//                                   {aggregatedData.reduce((sum, item) => sum + item.count10, 0)}
//                                 </td>
//                                 <td style={{ textAlign: "center" }}>
//                                   {aggregatedData.reduce((sum, item) => sum + item.total, 0)}
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </Table>
//                       </Card.Body>
//                     </Card>
//                   )}

//                   <Card className="mb-2">
//                     <Card.Header><strong>Calling History</strong></Card.Header>
//                     <Card.Body style={{ padding: 0 }}>
//                       <Table striped bordered hover size="sm" className="mb-0">
//                         <thead>
//                           <tr><th>Date</th><th>Remark</th><th>Comments</th></tr>
//                         </thead>
//                         <tbody>
//                           {g.history.length === 0
//                             ? <tr><td colSpan={3} className="text-center small text-muted">No history</td></tr>
//                             : g.history.map(h => (
//                                 <tr key={h._id}>
//                                   <td className="small">{fmt(h.callingDate ?? h.createdAt)}</td>
//                                   <td className="small">{h.callingRemark1 ?? "-"}</td>
//                                   <td className="small">{h.mannualRemark ?? "-"}</td>
//                                 </tr>
//                               ))
//                           }
//                         </tbody>
//                       </Table>
//                     </Card.Body>
//                   </Card>

//                   <Row className="mb-2">
//                     <Col xs={6}>
//                       <Form.Group>
//                         <Form.Label className="small">Calling Status *</Form.Label>
//                         <Select
//                           value={CALL_STATUS.find(o => o.value === edit.callingStatus) || null}
//                           onChange={sel => handleFieldChange(g.key, "callingStatus", sel ? sel.value : null)}
//                           options={CALL_STATUS}
//                           placeholder="— select —"
//                           isClearable
//                           isDisabled={submitted}
//                         />
//                       </Form.Group>
//                     </Col>

//                     <Col xs={6}>
//                       <Form.Group>
//                         <Form.Label className="small">Calling Remark *</Form.Label>
//                         <Select
//                           value={callingRemarkOptions.find(o => o.value === edit.callingRemark1) || null}
//                           onChange={sel => handleFieldChange(g.key, "callingRemark1", sel ? sel.value : null)}
//                           options={callingRemarkOptions}
//                           placeholder="— select —"
//                           isClearable
//                           isDisabled={submitted || !edit.callingStatus}
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>

//                   <Row className="mb-2">
//                     <Col xs={12}>
//                       <Form.Group>
//                         <Form.Label className="small">Comments</Form.Label>
//                         <Form.Control
//                           as="textarea"
//                           rows={2}
//                           value={edit.mannualRemark ?? ""}
//                           onChange={e => handleFieldChange(g.key, "mannualRemark", e.target.value)}
//                           disabled={submitted}
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                 </Card.Body>

//                 <Card.Footer className="d-flex justify-content-between align-items-center">
//                   {/* <div className="small text-muted">Current record created: {fmt(lead.createdAt)}</div> */}
//                   {!submitted && (
//                     <div>
//                       <Button
//                         size="sm"
//                         variant="secondary"
//                         className="me-2"
//                         onClick={() => {
//                           setGroups(prev =>
//                             prev.map(gg => gg.key === g.key
//                               ? { ...gg, current: { ...gg.current, _edit: { ...gg.current } } }
//                               : gg
//                             )
//                           );
//                         }}
//                       >Reset</Button>

//                       <Button size="sm" variant="primary" onClick={() => updateLead(g)} disabled={saving}>
//                         {saving ? <><Spinner animation="border" size="sm" /> Submitting...</> : "Submit"}
//                       </Button>
//                     </div>
//                   )}
//                 </Card.Footer>
//               </Card>
//             </Col>
//           );
//         })}
//       </Row>
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
  Spinner,
  Form,
  Button,
  Alert,
  Table
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
import Select from 'react-select';

import { GetCallLeadsByUserObjectId, UpdateCallLeads } from "../../services/UserServices/UserService";
import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";
import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";
import { GetDistrictBlockSchoolsByContact } from "../../services/UserServices/UserService";


export const BeoCallings = () => {
  const { userData } = useContext(UserContext);
  const { districtBlockSchoolData = [] } = useDistrictBlockSchool() || {};

  const [dashboardMap, setDashboardMap] = useState({});
  const [mainDashboardData, setMainDashboardData] = useState([]);

  const fetchMainDashboardCount = async () => {
    try {
      const response = await MainDashBoard();
      setMainDashboardData(response.data);
      
      // Create a map of centerId to registration counts
      const map = {};
      for (const school of response.data || []) {
        if (school && school.centerId) {
          map[String(school.centerId)] = {
            school: {
              byClass: {
                "8": { registered: Number(school.registrationCount8 || 0) },
                "10": { registered: Number(school.registrationCount10 || 0) }
              }
            }
          };
        }
      }
      setDashboardMap(map);
    } catch (error) {
      console.error("Error fetching main dashboard data", error);
    }
  }

  const fetchDashboarcount = async () => {
    try {
      const resp = await DashboardCounts();
      const data = resp?.data ?? resp;
      const centers = data?.centers ?? [];
      const map = {};
      for (const c of centers) {
        if (c && c.centerId) map[String(c.centerId)] = c.dashboardCounts ?? {};
      }
      setDashboardMap(map);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => { 
    fetchMainDashboardCount();
  }, []);

  // Extract all districtIds from userAccess
  const getUserDistrictIds = () => {
    if (!userData?.userAccess?.region) return [];
    
    const districtIds = [];
    userData.userAccess.region.forEach(region => {
      if (region.districtId) {
        districtIds.push(region.districtId);
      }
    });
    
    return districtIds;
  };

  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const CALL_STATUS = [
    { value: "Connected", label: "Connected" },
    { value: "Not connected", label: "Not connected" }
  ];

  const CONNECTED_REMARKS = [
    { value: "Low Registration Count Calling", label: "Low Registration Count Calling" },
    { value: "Follow up calling", label: "Follow up calling" },
    { value: "Other", label: "Other" }
  ];

  const NOT_CONNECTED_REMARKS = [
    { value: "Wrong number", label: "Wrong number" },
    { value: "Call not picked", label: "Call not picked" }
  ];

  const fmt = (iso) => iso ? new Date(iso).toLocaleString() : "-";

  // UPDATED: Function to calculate total block sums for Class 8 and Class 10
  const getBlockTotalSnippets = (schools) => {
    let totalClass8 = 0;
    let totalClass10 = 0;
    
    schools.forEach(school => {
      const mainData = mainDashboardData.find(item => 
        item.centerId && school.centerId && 
        String(item.centerId) === String(school.centerId)
      );
      
      const count8 = mainData ? Number(mainData.registrationCount8 || 0) : 0;
      const count10 = mainData ? Number(mainData.registrationCount10 || 0) : 0;
      
      totalClass8 += count8;
      totalClass10 += count10;
    });
    
    return [`Class 8: ${totalClass8}`, `Class 10: ${totalClass10}`];
  };

  const fetchCallLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all districtIds assigned to the user
      const districtIds = getUserDistrictIds();
      
      if (districtIds.length === 0) {
        setError("No districts assigned to this user");
        setLoading(false);
        return;
      }

      const reqBody = { 
        districtId: districtIds, 
        callMadeTo: "BEO" 
      };
      
      const response = await GetCallLeadsByUserObjectId(reqBody);
      const data = response?.data ?? [];

      console.log(data)
console.log(data)
      const map = new Map();
      for (const item of data) {
        const callerId = item.callerUser?._id ?? "nullcaller";
        const key = [callerId, item.callMadeTo ?? "", item.districtId ?? "", item.blockId ?? "", item.centerId ?? ""].join("|");
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
      }

      const groupsArr = [];
      for (const [key, rows] of map.entries()) {
        const sorted = rows.slice().sort((a, b) => new Date(b.callingDate ?? b.createdAt) - new Date(a.callingDate ?? a.createdAt));
        const current = sorted[0];
        const history = sorted.slice(1);

        // check if today callStatus is Connected or Not connected
        const todayStatus = ["Connected", "Not connected"].includes(current.callingStatus);

        groupsArr.push({
          key,
          current: {
            ...current,
            _edit: {
              callingStatus: current.callingStatus ?? null,
              callingRemark1: current.callingRemark1 ?? "",
              mannualRemark: current.mannualRemark ?? ""
            },
            calledPerson: current.calledPerson || {
              centerName: current.centerName || "Unknown School",
              beo: current.beo || "N/A",
              beoContact: current.beoContact || null,
              districtName: current.districtName || null,
              blockName: current.blockName || null
            },
            _submitted: todayStatus,
            calledPersonRegion: current.calledPersonRegion || []
          },
          history
        });
      }
      setGroups(groupsArr);
    } catch (err) {
      console.error("Fetch leads error", err);
      setError("Failed to load call leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCallLeads(); }, []);

  const handleFieldChange = (groupKey, field, value) => {
    setGroups(prev => prev.map(g => {
      if (g.key === groupKey) {
        const updatedEdit = { ...g.current._edit, [field]: value };
        // If calling status is changed, reset calling remark
        if (field === "callingStatus") {
          updatedEdit.callingRemark1 = "";
        }
        return { ...g, current: { ...g.current, _edit: updatedEdit } };
      }
      return g;
    }));
  };

  const updateLead = async (group) => {
    setError(null);
    setSuccessMsg(null);
    
    // Check if calling status is selected
    if (!group.current._edit.callingStatus) {
      setError("Please select Calling Status");
      return;
    }
    
    // Check if calling remark is selected
    if (!group.current._edit.callingRemark1) {
      setError("Please select Calling Remark");
      return;
    }

    const id = group.current._id;
    setSavingIds(s => new Set(s).add(id));

    const reqBody = {
      _id: id,
      objectIdOfCaller:userData?.user?._id,
      callingStatus: group.current._edit.callingStatus,
      callingRemark1: group.current._edit.callingRemark1 || null,
      mannualRemark: group.current._edit.mannualRemark || null
    };

    try {
      const resp = await UpdateCallLeads(reqBody);
      const returned = resp?.data ?? {};

      setGroups(prev => prev.map(g =>
        g.key === group.key
          ? {
              ...g,
              current: {
                ...g.current,
                ...returned,
                _edit: { ...g.current._edit },
                _submitted: ["Connected", "Not connected"].includes(returned.callingStatus)
              },
              history: [returned, ...g.history]
            }
          : g
      ));

      setSuccessMsg("Call submitted successfully");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err) {
      console.error("UpdateCallLeads error", err);
      setError("Failed to submit lead");
    } finally {
      setSavingIds(s => { const next = new Set(s); next.delete(id); return next; });
    }
  };

  // Calculate call statistics
  const callStats = useMemo(() => {
    const totalCalls = groups.length;
    const completedCalls = groups.filter(g => g.current._submitted).length;
    const pendingCalls = totalCalls - completedCalls;
    
    return {
      totalCalls,
      completedCalls,
      pendingCalls
    };
  }, [groups]);

  // Function to aggregate school data by district and block
  const getAggregatedSchoolData = (schools) => {
    const aggregationMap = new Map();
    
    schools.forEach(school => {
      const key = `${school.districtId}-${school.blockId}`;
      if (!aggregationMap.has(key)) {
        aggregationMap.set(key, {
          districtId: school.districtId,
          districtName: school.districtName,
          blockId: school.blockId,
          blockName: school.blockName,
          count8: 0,
          count10: 0,
          total: 0,
          schoolCount: 0
        });
      }
      
      const mainData = mainDashboardData.find(item => 
        item.centerId && school.centerId && 
        String(item.centerId) === String(school.centerId)
      );
      
      const count8 = mainData ? Number(mainData.registrationCount8 || 0) : 0;
      const count10 = mainData ? Number(mainData.registrationCount10 || 0) : 0;
      
      const existing = aggregationMap.get(key);
      existing.count8 += count8;
      existing.count10 += count10;
      existing.total += (count8 + count10);
      existing.schoolCount += 1;
    });
    
    return Array.from(aggregationMap.values());
  };

  return (
    <Container className="py-3">
      <h3 className="mb-3">BEO Callings</h3>

      {/* Call Summary Statistics */}
      <Row className="mb-3">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title style={{ fontSize: "2rem", fontWeight: "bold", color: "#007bff" }}>
                {callStats.totalCalls}
              </Card.Title>
              <Card.Text>Total Calls</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}>
                {callStats.completedCalls}
              </Card.Title>
              <Card.Text>Completed Calls</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc3545" }}>
                {callStats.pendingCalls}
              </Card.Title>
              <Card.Text>Pending Calls</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading && <div className="mb-3"><Spinner animation="border" size="sm" /> Loading leads...</div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {!loading && groups.length === 0 && <Alert variant="info">No call leads found for you.</Alert>}

      <Row xs={1} md={2} lg={2} className="g-3">
        {groups.map(g => {
          const lead = g.current;
          const edit = lead._edit || {};
          const saving = savingIds.has(lead._id);
          const submitted = lead._submitted;
          // UPDATED: Use getBlockTotalSnippets instead of headerClassSnippets
          const snippets = getBlockTotalSnippets(lead.calledPersonRegion || []);

          // Get appropriate calling remarks based on selected status
          const callingRemarkOptions = edit.callingStatus === "Connected" 
            ? CONNECTED_REMARKS 
            : edit.callingStatus === "Not connected" 
            ? NOT_CONNECTED_REMARKS 
            : [];

          // Get aggregated school data for this BEO
          const aggregatedData = getAggregatedSchoolData(lead.calledPersonRegion || []);

          return (
            <Col key={g.key}>
              <Card className={submitted ? "border-success" : ""} style={submitted ? { backgroundColor: "#d4edda" } : {}}>
                <Card.Header className="d-flex justify-content-between align-items-start">
                  <div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{lead.calledPerson?.beo}</div>
                    <div className="small text-muted">{lead.calledPerson?.districtName} — {lead.calledPerson?.blockName}</div>
                    {snippets.length > 0 && <div className="small text-muted mt-1">{snippets.join(" · ")}</div>}
                    {lead.calledPerson?.beoContact
                      ? <div className="small mt-1">Contact: <a href={`tel:${lead.calledPerson.beoContact}`}>{lead.calledPerson.beoContact}</a></div>
                      : <div className="small mt-1">Contact: N/A</div>}
                  </div>
                  <div className="text-end">
                    <Badge bg="primary" className="mb-1">{lead.callMadeTo}</Badge>
                    <div className="small text-muted">Block-Id: {lead.blockId}</div>
                    {/* <div className="small text-muted">Last: {fmt(lead.callingDate ?? lead.createdAt)}</div> */}
                    {/* <div className="small text-muted">History: {g.history.length}</div> */}
                  </div>
                </Card.Header>

                <Card.Body style={{ padding: "0.5rem" }}>

                  {/* BEO Schools Registration Table - Aggregated by District and Block */}
                  {aggregatedData.length > 0 && (
                    <Card className="mb-2">
                      <Card.Header><strong>BEO Schools Registration Summary</strong></Card.Header>
                      <Card.Body style={{ padding: 0 }}>
                        <Table striped bordered hover responsive className="mb-0">
                          <thead>
                            <tr>
                              <th style={{ width: "5%" }}>#</th>
                              <th>District</th>
                              <th>Block</th>
                              <th style={{ textAlign: "center" }}>Schools</th>
                              <th style={{ textAlign: "center" }}>Class 8</th>
                              <th style={{ textAlign: "center" }}>Class 10</th>
                              <th style={{ textAlign: "center" }}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {aggregatedData.map((item, index) => (
                              <tr key={`${item.districtId}-${item.blockId}`}>
                                <td>{index + 1}</td>
                                <td>{item.districtName}</td>
                                <td>{item.blockName}</td>
                                <td style={{ textAlign: "center" }}>{item.schoolCount}</td>
                                <td style={{ textAlign: "center" }}>{item.count8}</td>
                                <td style={{ textAlign: "center" }}>{item.count10}</td>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                                  {item.total}
                                </td>
                              </tr>
                            ))}
                            {/* Total Row */}
                            {aggregatedData.length > 1 && (
                              <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                                <td colSpan={3} style={{ textAlign: "right" }}>Total:</td>
                                <td style={{ textAlign: "center" }}>
                                  {aggregatedData.reduce((sum, item) => sum + item.schoolCount, 0)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {aggregatedData.reduce((sum, item) => sum + item.count8, 0)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {aggregatedData.reduce((sum, item) => sum + item.count10, 0)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {aggregatedData.reduce((sum, item) => sum + item.total, 0)}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  )}

                  <Card className="mb-2">
                    <Card.Header><strong>Calling History</strong></Card.Header>
                    <Card.Body style={{ padding: 0 }}>
                      <Table striped bordered hover size="sm" className="mb-0">
                        <thead>
                          <tr><th>Date</th><th>Remark</th><th>Comments</th></tr>
                        </thead>
                        <tbody>
                          {g.history.length === 0
                            ? <tr><td colSpan={3} className="text-center small text-muted">No history</td></tr>
                            : g.history.map(h => (
                                <tr key={h._id}>
                                  <td className="small">{fmt(h.callingDate ?? h.createdAt)}</td>
                                  <td className="small">{h.callingRemark1 ?? "-"}</td>
                                  <td className="small">{h.mannualRemark ?? "-"}</td>
                                </tr>
                              ))
                          }
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>

                  <Row className="mb-2">
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="small">Calling Status *</Form.Label>
                        <Select
                          value={CALL_STATUS.find(o => o.value === edit.callingStatus) || null}
                          onChange={sel => handleFieldChange(g.key, "callingStatus", sel ? sel.value : null)}
                          options={CALL_STATUS}
                          placeholder="— select —"
                          isClearable
                          isDisabled={submitted}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="small">Calling Remark *</Form.Label>
                        <Select
                          value={callingRemarkOptions.find(o => o.value === edit.callingRemark1) || null}
                          onChange={sel => handleFieldChange(g.key, "callingRemark1", sel ? sel.value : null)}
                          options={callingRemarkOptions}
                          placeholder="— select —"
                          isClearable
                          isDisabled={submitted || !edit.callingStatus}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="small">Comments</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={edit.mannualRemark ?? ""}
                          onChange={e => handleFieldChange(g.key, "mannualRemark", e.target.value)}
                          disabled={submitted}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>

                <Card.Footer className="d-flex justify-content-between align-items-center">
                  {/* <div className="small text-muted">Current record created: {fmt(lead.createdAt)}</div> */}
                  {!submitted && (
                    <div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="me-2"
                        onClick={() => {
                          setGroups(prev =>
                            prev.map(gg => gg.key === g.key
                              ? { ...gg, current: { ...gg.current, _edit: { ...gg.current } } }
                              : gg
                            )
                          );
                        }}
                      >Reset</Button>

                      <Button size="sm" variant="primary" onClick={() => updateLead(g)} disabled={saving}>
                        {saving ? <><Spinner animation="border" size="sm" /> Submitting...</> : "Submit"}
                      </Button>
                    </div>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};