// src/components/Dashboards/BlockSchoolDashboard10.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Accordion,
//   Card,
//   Table,
//   Spinner,
//   Alert,
//   Badge,
//   Container,
//   Row,
//   Col,
//   Button,
// } from "react-bootstrap";
// import Select from "react-select";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService"; // adjust path if needed
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const BlockSchoolDashboard10 = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboard, setDashboard] = useState(null);

//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedSchool, setSelectedSchool] = useState(null);
//   const [activeKeys, setActiveKeys] = useState([]); // control accordion open/close

//   const [mainDashboardData, setMainDashboardData] = useState([]);

//   const fetchMainDashboardCount = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await MainDashBoard();
//       setMainDashboardData(response.data);
//     } catch (error) {
//       console.error("Error", error);
//       setError(error?.message || "Failed to fetch dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchMainDashboardCount();
//   }, []);

//   const fetchDashboarcount = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const resp = await DashboardCounts();
//       const data = resp?.data || resp;
//       setDashboard(data);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError(err?.message || "Failed to fetch dashboard counts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboarcount();
//   }, []);

//   // Build block list and school aggregation using mainDashboardData
//   const buildBlocksAndSchoolsFromMainData = () => {
//     const result = { blockList: [] };
//     if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

//     const blocksMap = {};

//     for (const school of mainDashboardData) {
//       const blockId = String(school?.blockId || "").trim();
//       const blockName = school?.blockName || "";
//       const schoolId = String(school?.centerId || "").trim();
//       const schoolName = school?.centerName || "";
//       const reg10 = Number(school?.registrationCount10 || 0);

//       if (!blockId) continue;
//       if (!blocksMap[blockId]) {
//         blocksMap[blockId] = {
//           blockId,
//           blockName: blockName || blockId,
//           totalRegistered: 0,
//           schools: {},
//         };
//       }

//       blocksMap[blockId].totalRegistered += reg10;

//       if (!blocksMap[blockId].schools[schoolId]) {
//         blocksMap[blockId].schools[schoolId] = {
//           schoolId: schoolId,
//           schoolName: schoolName || `School ${schoolId}`,
//           registered: 0,
//         };
//       }

//       blocksMap[blockId].schools[schoolId].registered += reg10;
//     }

//     const blockList = Object.values(blocksMap).sort(
//       (a, b) =>
//         b.totalRegistered - a.totalRegistered ||
//         (a.blockName || "").localeCompare(b.blockName || "")
//     );

//     for (const blk of blockList) {
//       blk.schools = Object.values(blk.schools).sort(
//         (a, b) =>
//           b.registered - a.registered ||
//           (a.schoolName || "").localeCompare(b.schoolName || "")
//       );
//     }

//     return { blockList };
//   };

//   const { blockList } = buildBlocksAndSchoolsFromMainData();

//   // total registrations (class 10)
//   const totalRegistrations = useMemo(
//     () => blockList.reduce((sum, b) => sum + (b.totalRegistered || 0), 0),
//     [blockList]
//   );

//   // Dropdown options
//   const blockOptions = useMemo(
//     () =>
//       blockList.map((b) => ({
//         value: b.blockId,
//         label: b.blockName,
//       })),
//     [blockList]
//   );

//   const schoolOptions = useMemo(() => {
//     if (!selectedBlock) return [];
//     const block = blockList.find((b) => b.blockId === selectedBlock.value);
//     if (!block) return [];
//     return block.schools.map((s) => ({
//       value: s.schoolId,
//       label: s.schoolName,
//     }));
//   }, [selectedBlock, blockList]);

//   // Filtered data for UI
//   const filteredBlocks = useMemo(() => {
//     if (!selectedBlock) return blockList;
//     const block = blockList.find((b) => b.blockId === selectedBlock.value);
//     if (!block) return [];

//     if (selectedSchool) {
//       const filteredSchools = block.schools.filter(
//         (s) => s.schoolId === selectedSchool.value
//       );
//       return [{ ...block, schools: filteredSchools, totalRegistered: filteredSchools.reduce((s, x) => s + (x.registered || 0), 0) }];
//     }

//     return [block];
//   }, [blockList, selectedBlock, selectedSchool]);

//   // ensure accordion active keys match filteredBlocks
//   useEffect(() => {
//     setActiveKeys(filteredBlocks.map((_, i) => String(i)));
//   }, [filteredBlocks]);

//   const toggleAccordion = () => {
//     if (activeKeys.length) {
//       setActiveKeys([]);
//     } else {
//       setActiveKeys(filteredBlocks.map((_, i) => String(i)));
//     }
//   };

//   if (loading)
//     return (
//       <Container className="py-4 text-center">
//         <Spinner animation="border" />
//         <div>Loading dashboard...</div>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container className="py-4">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );

//   if (!mainDashboardData || mainDashboardData.length === 0)
//     return (
//       <Container className="py-4">
//         <Alert variant="info">No dashboard data available.</Alert>
//       </Container>
//     );

//   return (
//     <Container className="py-3">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Block - School Dashboard (Class 10)- Level 1 Examination</h3>
       
//       </div>

//       {/* Summary */}
//       {/* <Card className="mb-4 shadow-sm">
//         <Card.Body className="text-center">
//           <h5 className="mb-0">
//             Total Registrations (Class 10):{" "}
//             <Badge bg="success" pill>
//               {totalRegistrations}
//             </Badge>
//           </h5>
//         </Card.Body>
//       </Card> */}

//       {/* Filters */}
//       <Row className="mb-3">
//         <Col md={6} lg={4}>
//           <Select
//             options={blockOptions}
//             value={selectedBlock}
//             onChange={(val) => {
//               setSelectedBlock(val);
//               setSelectedSchool(null);
//             }}
//             placeholder="Select Block..."
//             isClearable
//           />
//         </Col>
//         {/* <Col md={6} lg={4}>
//           <Select
//             options={schoolOptions}
//             value={selectedSchool}
//             onChange={setSelectedSchool}
//             placeholder="Select School..."
//             isClearable
//             isDisabled={!selectedBlock}
//           />
//         </Col> */}
//       </Row>

// <hr></hr>
//       {filteredBlocks.length === 0 ? (
//         <Alert variant="info">No data found for selected filters (block/school).</Alert>
//       ) : (
//         <Accordion activeKey={activeKeys} alwaysOpen>
//           {filteredBlocks.map((block, idx) => (
//             <Accordion.Item eventKey={String(idx)} key={block.blockId}>
//               <Accordion.Header>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     width: "100%",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//                     <Badge bg="secondary">{idx + 1}</Badge>
//                     <strong>{block.blockName}:-</strong>



//                         <div>
//                     <strong style={{ fontSize: "1.05rem" }}>
//                       {block.totalRegistered}
//                     </strong>{" "}
             
//                   </div>
//                   </div>
              
//                 </div>
//               </Accordion.Header>
//               <Accordion.Body>
//                 {block.schools?.length ? (
//                   <Table bordered hover responsive>
//                     <thead>
//                       <tr>
//                         <th style={{ width: "5%" }}>S.No</th>
//                         <th>School Name</th>
//                         <th style={{ width: "20%", textAlign: "right" }}>
//                           Registered
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {block.schools.map((s, i) => (
//                         <tr key={s.schoolId || i}>
//                           <td>{i + 1}</td>
//                           <td>{s.schoolName}</td>
//                           <td style={{ textAlign: "right" }}>{s.registered}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 ) : (
//                   <Alert variant="light" className="mb-0">
//                     No schools / no Class 10 registrations in this block.
//                   </Alert>
//                 )}
//               </Accordion.Body>
//             </Accordion.Item>
//           ))}
//         </Accordion>
//       )}
//     </Container>
//   );
// };














//Working dashboard main, without downloadable repports

// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Accordion,
//   Card,
//   Table,
//   Spinner,
//   Alert,
//   Badge,
//   Container,
//   Row,
//   Col,
//   Button,
// } from "react-bootstrap";
// import Select from "react-select";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService"; // adjust path if needed
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const BlockSchoolDashboard10 = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboard, setDashboard] = useState(null);

//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedSchool, setSelectedSchool] = useState(null);
//   const [activeKeys, setActiveKeys] = useState([]); // control accordion open/close

//   const [mainDashboardData, setMainDashboardData] = useState([]);

//   const fetchMainDashboardCount = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await MainDashBoard();
//       setMainDashboardData(response.data);
//     } catch (error) {
//       console.error("Error", error);
//       setError(error?.message || "Failed to fetch dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchMainDashboardCount();
//   }, []);

//   const fetchDashboarcount = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const resp = await DashboardCounts();
//       const data = resp?.data || resp;
//       setDashboard(data);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError(err?.message || "Failed to fetch dashboard counts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboarcount();
//   }, []);

//   // Build block list and school aggregation using mainDashboardData
//   const buildBlocksAndSchoolsFromMainData = () => {
//     const result = { blockList: [] };
//     if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

//     const blocksMap = {};

//     for (const school of mainDashboardData) {
//       const blockId = String(school?.blockId || "").trim();
//       const blockName = school?.blockName || "";
//       const schoolId = String(school?.centerId || "").trim();
//       const schoolName = school?.centerName || "";
//       const reg10 = Number(school?.registrationCount10 || 0);
//       const admitCard10 = Number(school?.admitCardCount10 || 0);

//       if (!blockId) continue;
//       if (!blocksMap[blockId]) {
//         blocksMap[blockId] = {
//           blockId,
//           blockName: blockName || blockId,
//           totalRegistered: 0,
//           totalAdmitCard: 0,
//           schools: {},
//         };
//       }

//       blocksMap[blockId].totalRegistered += reg10;
//       blocksMap[blockId].totalAdmitCard += admitCard10;

//       if (!blocksMap[blockId].schools[schoolId]) {
//         blocksMap[blockId].schools[schoolId] = {
//           schoolId: schoolId,
//           schoolName: schoolName || `School ${schoolId}`,
//           registered: 0,
//           admitCard: 0,
//         };
//       }

//       blocksMap[blockId].schools[schoolId].registered += reg10;
//       blocksMap[blockId].schools[schoolId].admitCard += admitCard10;
//     }

//     const blockList = Object.values(blocksMap).sort(
//       (a, b) =>
//         b.totalRegistered - a.totalRegistered ||
//         (a.blockName || "").localeCompare(b.blockName || "")
//     );

//     for (const blk of blockList) {
//       blk.schools = Object.values(blk.schools).sort(
//         (a, b) =>
//           b.registered - a.registered ||
//           (a.schoolName || "").localeCompare(b.schoolName || "")
//       );
//     }

//     return { blockList };
//   };

//   const { blockList } = buildBlocksAndSchoolsFromMainData();

//   // total registrations (class 10)
//   const totalRegistrations = useMemo(
//     () => blockList.reduce((sum, b) => sum + (b.totalRegistered || 0), 0),
//     [blockList]
//   );

//   // Dropdown options
//   const blockOptions = useMemo(
//     () =>
//       blockList.map((b) => ({
//         value: b.blockId,
//         label: b.blockName,
//       })),
//     [blockList]
//   );

//   const schoolOptions = useMemo(() => {
//     if (!selectedBlock) return [];
//     const block = blockList.find((b) => b.blockId === selectedBlock.value);
//     if (!block) return [];
//     return block.schools.map((s) => ({
//       value: s.schoolId,
//       label: s.schoolName,
//     }));
//   }, [selectedBlock, blockList]);

//   // Filtered data for UI
//   const filteredBlocks = useMemo(() => {
//     if (!selectedBlock) return blockList;
//     const block = blockList.find((b) => b.blockId === selectedBlock.value);
//     if (!block) return [];

//     if (selectedSchool) {
//       const filteredSchools = block.schools.filter(
//         (s) => s.schoolId === selectedSchool.value
//       );
//       const totalRegistered = filteredSchools.reduce((s, x) => s + (x.registered || 0), 0);
//       const totalAdmitCard = filteredSchools.reduce((s, x) => s + (x.admitCard || 0), 0);
//       return [{ ...block, schools: filteredSchools, totalRegistered, totalAdmitCard }];
//     }

//     return [block];
//   }, [blockList, selectedBlock, selectedSchool]);

//   // ensure accordion active keys match filteredBlocks
//   useEffect(() => {
//     setActiveKeys(filteredBlocks.map((_, i) => String(i)));
//   }, [filteredBlocks]);

//   const toggleAccordion = () => {
//     if (activeKeys.length) {
//       setActiveKeys([]);
//     } else {
//       setActiveKeys(filteredBlocks.map((_, i) => String(i)));
//     }
//   };

//   if (loading)
//     return (
//       <Container className="py-4 text-center">
//         <Spinner animation="border" />
//         <div>Loading dashboard...</div>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container className="py-4">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );

//   if (!mainDashboardData || mainDashboardData.length === 0)
//     return (
//       <Container className="py-4">
//         <Alert variant="info">No dashboard data available.</Alert>
//       </Container>
//     );

//   return (
//     <Container className="py-3">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Block - School Dashboard (Class 10)- Level 1 Examination</h3>
       
//       </div>

//       {/* Summary */}
//       {/* <Card className="mb-4 shadow-sm">
//         <Card.Body className="text-center">
//           <h5 className="mb-0">
//             Total Registrations (Class 10):{" "}
//             <Badge bg="success" pill>
//               {totalRegistrations}
//             </Badge>
//           </h5>
//         </Card.Body>
//       </Card> */}

//       {/* Filters */}
//       <Row className="mb-3">
//         <Col md={6} lg={4}>
//           <Select
//             options={blockOptions}
//             value={selectedBlock}
//             onChange={(val) => {
//               setSelectedBlock(val);
//               setSelectedSchool(null);
//             }}
//             placeholder="Select Block..."
//             isClearable
//           />
//         </Col>
//         {/* <Col md={6} lg={4}>
//           <Select
//             options={schoolOptions}
//             value={selectedSchool}
//             onChange={setSelectedSchool}
//             placeholder="Select School..."
//             isClearable
//             isDisabled={!selectedBlock}
//           />
//         </Col> */}
//       </Row>

// <hr></hr>
//       {filteredBlocks.length === 0 ? (
//         <Alert variant="info">No data found for selected filters (block/school).</Alert>
//       ) : (
//         <Accordion activeKey={activeKeys} alwaysOpen>
//           {filteredBlocks.map((block, idx) => (
//             <Accordion.Item eventKey={String(idx)} key={block.blockId}>
//               <Accordion.Header>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     width: "100%",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//                     <Badge bg="secondary">{idx + 1}</Badge>
//                     <strong>{block.blockName}:-</strong>

//                     <div style={{ display: "flex", gap: "20px" }}>

//                         <div>
//                           <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
//                             Admit Card
//                           </div>
//                           <strong style={{ fontSize: "1.05rem", }}>
//                             {block.totalAdmitCard}
//                           </strong>
//                         </div>

//                         <div>
//                           <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
//                             Registered
//                           </div>
//                           <strong style={{ fontSize: "1.05rem" }}>
//                             {block.totalRegistered}
//                           </strong>
//                         </div>
                      
//                       </div>
//                   </div>
              
//                 </div>
//               </Accordion.Header>
//               <Accordion.Body>
//                 {block.schools?.length ? (
//                   <Table bordered hover responsive>
//                     <thead>
//                       <tr>
//                         <th style={{ width: "5%" }}>S.No</th>
//                         <th>School Name</th>

//                          <th style={{ width: "15%", textAlign: "right" }}>
//                           Admit Card
//                         </th>
//                         <th style={{ width: "15%", textAlign: "right" }}>
//                           Registered
//                         </th>
                       
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {block.schools.map((s, i) => (
//                         <tr key={s.schoolId || i}>
//                           <td>{i + 1}</td>
//                           <td>{s.schoolName}</td>

//                             <td style={{ textAlign: "right", fontWeight: "bold" }}>
//                             {s.admitCard}
//                           </td>
//                           <td style={{ textAlign: "right" }}>{s.registered}</td>
                        
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 ) : (
//                   <Alert variant="light" className="mb-0">
//                     No schools / no Class 10 registrations in this block.
//                   </Alert>
//                 )}
//               </Accordion.Body>
//             </Accordion.Item>
//           ))}
//         </Accordion>
//       )}
//     </Container>
//   );
// };








// //Working dashboard with downloadable reports

// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Accordion,
//   Card,
//   Table,
//   Spinner,
//   Alert,
//   Badge,
//   Container,
//   Row,
//   Col,
//   Button,
// } from "react-bootstrap";
// import Select from "react-select";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// export const BlockSchoolDashboard10 = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboard, setDashboard] = useState(null);

//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedSchool, setSelectedSchool] = useState(null);
//   const [activeKeys, setActiveKeys] = useState([]);

//   const [mainDashboardData, setMainDashboardData] = useState([]);

//   const fetchMainDashboardCount = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await MainDashBoard();
//       setMainDashboardData(response.data);
//     } catch (error) {
//       console.error("Error", error);
//       setError(error?.message || "Failed to fetch dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchMainDashboardCount();
//   }, []);

//   const fetchDashboarcount = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const resp = await DashboardCounts();
//       const data = resp?.data || resp;
//       setDashboard(data);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError(err?.message || "Failed to fetch dashboard counts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboarcount();
//   }, []);

//   // Build block list and school aggregation using mainDashboardData
//   const buildBlocksAndSchoolsFromMainData = () => {
//     const result = { blockList: [] };
//     if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

//     const blocksMap = {};

//     for (const school of mainDashboardData) {
//       const blockId = String(school?.blockId || "").trim();
//       const blockName = school?.blockName || "";
//       const districtName = school?.districtName || "";
//       const schoolId = String(school?.centerId || "").trim();
//       const schoolName = school?.centerName || "";
//       const reg10 = Number(school?.registrationCount10 || 0);
//       const admitCard10 = Number(school?.admitCardCount10 || 0);

//       if (!blockId) continue;
//       if (!blocksMap[blockId]) {
//         blocksMap[blockId] = {
//           blockId,
//           blockName: blockName || blockId,
//           districtName: districtName || "N/A",
//           totalRegistered: 0,
//           totalAdmitCard: 0,
//           schools: {},
//         };
//       }

//       blocksMap[blockId].totalRegistered += reg10;
//       blocksMap[blockId].totalAdmitCard += admitCard10;

//       if (!blocksMap[blockId].schools[schoolId]) {
//         blocksMap[blockId].schools[schoolId] = {
//           schoolId: schoolId,
//           schoolName: schoolName || `School ${schoolId}`,
//           registered: 0,
//           admitCard: 0,
//         };
//       }

//       blocksMap[blockId].schools[schoolId].registered += reg10;
//       blocksMap[blockId].schools[schoolId].admitCard += admitCard10;
//     }

//     const blockList = Object.values(blocksMap).sort(
//       (a, b) =>
//         b.totalRegistered - a.totalRegistered ||
//         (a.blockName || "").localeCompare(b.blockName || "")
//     );

//     for (const blk of blockList) {
//       blk.schools = Object.values(blk.schools).sort(
//         (a, b) =>
//           b.registered - a.registered ||
//           (a.schoolName || "").localeCompare(b.schoolName || "")
//       );
//     }

//     return { blockList };
//   };

//   const { blockList } = buildBlocksAndSchoolsFromMainData();

//   // Function to generate PDF for a single block
//   const generateBlockPDF = (block) => {
//     const doc = new jsPDF();
//     const currentDate = new Date().toLocaleDateString('en-GB');
    
//     // Add title and date
//     doc.setFontSize(16);
//     doc.text("Block School Report - Class 10", 105, 20, { align: "center" });
    
//     doc.setFontSize(12);
//     doc.text(`Date of Report: ${currentDate}`, 105, 30, { align: "center" });
    
//     // Add district and block name
//     doc.setFontSize(14);
//     doc.text(`District: ${block.districtName}`, 20, 45);
//     doc.text(`Block: ${block.blockName}`, 20, 55);
    
//     // Summary section
//     doc.setFontSize(12);
//     doc.text(`Total Registered: ${block.totalRegistered}`, 20, 70);
//     doc.text(`Total Admit Cards: ${block.totalAdmitCard}`, 20, 78);
    
//     // Prepare table data
//     const tableData = block.schools.map((school, index) => [
//       index + 1,
//       school.schoolName,
//       school.admitCard,
//       school.registered
//     ]);
    
//     // Add table
//     doc.autoTable({
//       startY: 85,
//       head: [['S.No', 'School Name', 'Admit Card', 'Registered']],
//       body: tableData,
//       theme: 'grid',
//       headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//       styles: { fontSize: 10, cellPadding: 3 },
//       columnStyles: {
//         0: { cellWidth: 15 },
//         1: { cellWidth: 100 },
//         2: { cellWidth: 30, halign: 'right' },
//         3: { cellWidth: 30, halign: 'right' }
//       }
//     });
    
//     return doc;
//   };

//   // Function to download all block PDFs as ZIP
//   // const downloadAllPDFsAsZip = async () => {
//   //   if (!blockList.length) {
//   //     alert("No data available to download");
//   //     return;
//   //   }

//   //   const zip = new JSZip();
//   //   const pdfFolder = zip.folder("block-school-reports");

//   //   blockList.forEach((block) => {
//   //     const doc = generateBlockPDF(block);
//   //     const fileName = `${block.districtName.replace(/\s+/g, '_')}_${block.blockName.replace(/\s+/g, '_')}_Class10.pdf`;
//   //     const pdfBlob = doc.output('blob');
//   //     pdfFolder.file(fileName, pdfBlob);
//   //   });

//   //   const content = await zip.generateAsync({ type: "blob" });
//   //   saveAs(content, `Block_School_Reports_Class10_${new Date().toISOString().split('T')[0]}.zip`);
//   // };

// // Function to download all block PDFs as ZIP - SIMPLIFIED VERSION
// const downloadAllPDFsAsZip = async () => {
//   if (!blockList.length) {
//     alert("No data available to download");
//     return;
//   }

//   try {
//     const zip = new JSZip();
    
//     // Generate PDFs and add to zip
//     for (const block of blockList) {
//       const doc = generateBlockPDF(block);
//       const fileName = `${block.districtName.replace(/\s+/g, '_')}_${block.blockName.replace(/\s+/g, '_')}_Class10.pdf`;
      
//       // Method 1: Try using uint8array
//       const pdfOutput = doc.output();
//       const pdfBlob = new Blob([pdfOutput], { type: 'application/pdf' });
//       zip.file(fileName, pdfBlob);
//     }
    
//     // Generate and download zip file
//     const zipBlob = await zip.generateAsync({ type: "blob" });
//     const currentDate = new Date().toISOString().split('T')[0];
//     saveAs(zipBlob, `Block_School_Reports_Class10_${currentDate}.zip`);
    
//   } catch (error) {
//     console.error("Error generating ZIP file:", error);
    
//     // Fallback: Try individual PDF downloads
//     alert("ZIP download failed. Downloading PDFs individually...");
//     downloadPDFsIndividually();
//   }
// };

// // Fallback function to download PDFs individually
// const downloadPDFsIndividually = () => {
//   blockList.forEach((block, index) => {
//     const doc = generateBlockPDF(block);
//     const fileName = `${block.districtName.replace(/\s+/g, '_')}_${block.blockName.replace(/\s+/g, '_')}_Class10.pdf`;
    
//     // Simple save as individual PDF
//     doc.save(fileName);
//   });
// };




//   // Function to download Excel
//   const downloadExcel = () => {
//     if (!blockList.length) {
//       alert("No data available to download");
//       return;
//     }

//     // Prepare data for Excel
//     const excelData = [];
    
//     // Add header
//     excelData.push(['District', 'Block', 'School Name', 'Admit Card', 'Registered']);
    
//     // Add all data
//     blockList.forEach(block => {
//       block.schools.forEach(school => {
//         excelData.push([
//           block.districtName,
//           block.blockName,
//           school.schoolName,
//           school.admitCard,
//           school.registered
//         ]);
//       });
//     });

//     // Create worksheet
//     const ws = XLSX.utils.aoa_to_sheet(excelData);
    
//     // Create workbook
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Block School Data");
    
//     // Generate and download Excel file
//     const fileName = `Block_School_Data_Class10_${new Date().toISOString().split('T')[0]}.xlsx`;
//     XLSX.writeFile(wb, fileName);
//   };

//   // total registrations (class 10)
//   const totalRegistrations = useMemo(
//     () => blockList.reduce((sum, b) => sum + (b.totalRegistered || 0), 0),
//     [blockList]
//   );

//   // Dropdown options
//   const blockOptions = useMemo(
//     () =>
//       blockList.map((b) => ({
//         value: b.blockId,
//         label: b.blockName,
//       })),
//     [blockList]
//   );

//   const schoolOptions = useMemo(() => {
//     if (!selectedBlock) return [];
//     const block = blockList.find((b) => b.blockId === selectedBlock.value);
//     if (!block) return [];
//     return block.schools.map((s) => ({
//       value: s.schoolId,
//       label: s.schoolName,
//     }));
//   }, [selectedBlock, blockList]);

//   // Filtered data for UI
//   const filteredBlocks = useMemo(() => {
//     if (!selectedBlock) return blockList;
//     const block = blockList.find((b) => b.blockId === selectedBlock.value);
//     if (!block) return [];

//     if (selectedSchool) {
//       const filteredSchools = block.schools.filter(
//         (s) => s.schoolId === selectedSchool.value
//       );
//       const totalRegistered = filteredSchools.reduce((s, x) => s + (x.registered || 0), 0);
//       const totalAdmitCard = filteredSchools.reduce((s, x) => s + (x.admitCard || 0), 0);
//       return [{ ...block, schools: filteredSchools, totalRegistered, totalAdmitCard }];
//     }

//     return [block];
//   }, [blockList, selectedBlock, selectedSchool]);

//   // ensure accordion active keys match filteredBlocks
//   useEffect(() => {
//     setActiveKeys(filteredBlocks.map((_, i) => String(i)));
//   }, [filteredBlocks]);

//   const toggleAccordion = () => {
//     if (activeKeys.length) {
//       setActiveKeys([]);
//     } else {
//       setActiveKeys(filteredBlocks.map((_, i) => String(i)));
//     }
//   };

//   if (loading)
//     return (
//       <Container className="py-4 text-center">
//         <Spinner animation="border" />
//         <div>Loading dashboard...</div>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container className="py-4">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );

//   if (!mainDashboardData || mainDashboardData.length === 0)
//     return (
//       <Container className="py-4">
//         <Alert variant="info">No dashboard data available.</Alert>
//       </Container>
//     );

//   return (
//     <Container className="py-3">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Block - School Dashboard (Class 10)- Level 1 Examination</h3>
//         <div style={{ display: "flex", gap: "10px" }}>
//           <Button 
//   variant="primary" 
//   onClick={downloadAllPDFsAsZip}
//   disabled={!blockList.length}
// >
//   <i className="fas fa-file-pdf me-2"></i>
//   Download PDF Reports (ZIP)
// </Button>
//           <Button 
//             variant="success" 
//             onClick={downloadExcel}
//             disabled={!blockList.length}
//           >
//             <i className="fas fa-file-excel me-2"></i>
//             Download Excel
//           </Button>
//         </div>
//       </div>

//       {/* Summary */}
//       {/* <Card className="mb-4 shadow-sm">
//         <Card.Body className="text-center">
//           <h5 className="mb-0">
//             Total Registrations (Class 10):{" "}
//             <Badge bg="success" pill>
//               {totalRegistrations}
//             </Badge>
//           </h5>
//         </Card.Body>
//       </Card> */}

//       {/* Filters */}
//       <Row className="mb-3">
//         <Col md={6} lg={4}>
//           <Select
//             options={blockOptions}
//             value={selectedBlock}
//             onChange={(val) => {
//               setSelectedBlock(val);
//               setSelectedSchool(null);
//             }}
//             placeholder="Select Block..."
//             isClearable
//           />
//         </Col>
//         {/* <Col md={6} lg={4}>
//           <Select
//             options={schoolOptions}
//             value={selectedSchool}
//             onChange={setSelectedSchool}
//             placeholder="Select School..."
//             isClearable
//             isDisabled={!selectedBlock}
//           />
//         </Col> */}
//       </Row>

// <hr></hr>
//       {filteredBlocks.length === 0 ? (
//         <Alert variant="info">No data found for selected filters (block/school).</Alert>
//       ) : (
//         <Accordion activeKey={activeKeys} alwaysOpen>
//           {filteredBlocks.map((block, idx) => (
//             <Accordion.Item eventKey={String(idx)} key={block.blockId}>
//               <Accordion.Header>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     width: "100%",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//                     <Badge bg="secondary">{idx + 1}</Badge>
//                     <strong>{block.blockName}:-</strong>

//                     <div style={{ display: "flex", gap: "20px" }}>

//                         <div>
//                           <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
//                             Admit Card
//                           </div>
//                           <strong style={{ fontSize: "1.05rem", }}>
//                             {block.totalAdmitCard}
//                           </strong>
//                         </div>

//                         <div>
//                           <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
//                             Registered
//                           </div>
//                           <strong style={{ fontSize: "1.05rem" }}>
//                             {block.totalRegistered}
//                           </strong>
//                         </div>
                      
//                       </div>
//                   </div>
              
//                 </div>
//               </Accordion.Header>
//               <Accordion.Body>
//                 {block.schools?.length ? (
//                   <Table bordered hover responsive>
//                     <thead>
//                       <tr>
//                         <th style={{ width: "5%" }}>S.No</th>
//                         <th>School Name</th>

//                          <th style={{ width: "15%", textAlign: "right" }}>
//                           Admit Card
//                         </th>
//                         <th style={{ width: "15%", textAlign: "right" }}>
//                           Registered
//                         </th>
                       
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {block.schools.map((s, i) => (
//                         <tr key={s.schoolId || i}>
//                           <td>{i + 1}</td>
//                           <td>{s.schoolName}</td>

//                             <td style={{ textAlign: "right", fontWeight: "bold" }}>
//                             {s.admitCard}
//                           </td>
//                           <td style={{ textAlign: "right" }}>{s.registered}</td>
                        
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 ) : (
//                   <Alert variant="light" className="mb-0">
//                     No schools / no Class 10 registrations in this block.
//                   </Alert>
//                 )}
//               </Accordion.Body>
//             </Accordion.Item>
//           ))}
//         </Accordion>
//       )}
//     </Container>
//   );
// };






//Working dashboard with downloadable reports

import React, { useEffect, useState, useMemo } from "react";
import {
  Accordion,
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import Select from "react-select";
import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";
import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const BlockSchoolDashboard10 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [activeKeys, setActiveKeys] = useState([]);

  const [mainDashboardData, setMainDashboardData] = useState([]);

  const fetchMainDashboardCount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await MainDashBoard();
      setMainDashboardData(response.data);
    } catch (error) {
      console.error("Error", error);
      setError(error?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMainDashboardCount();
  }, []);

  const fetchDashboarcount = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await DashboardCounts();
      const data = resp?.data || resp;
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err?.message || "Failed to fetch dashboard counts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboarcount();
  }, []);

  // Helper function to check if school name contains "Middle School" or "Middle Schools"
  const isMiddleSchool = (schoolName) => {
    if (!schoolName) return false;
    const name = schoolName.toLowerCase();
    return name.includes('middle school') || name.includes('middle schools');
  };

  // Build block list and school aggregation using mainDashboardData
  const buildBlocksAndSchoolsFromMainData = () => {
    const result = { blockList: [] };
    if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

    const blocksMap = {};

    for (const school of mainDashboardData) {
      const blockId = String(school?.blockId || "").trim();
      const blockName = school?.blockName || "";
      const districtName = school?.districtName || "";
      const schoolId = String(school?.centerId || "").trim();
      const schoolName = school?.centerName || "";
      const reg10 = Number(school?.registrationCount10 || 0);
      const admitCard10 = Number(school?.admitCardCount10 || 0);

      if (!blockId) continue;
      if (!blocksMap[blockId]) {
        blocksMap[blockId] = {
          blockId,
          blockName: blockName || blockId,
          districtName: districtName || "N/A",
          totalRegistered: 0,
          totalAdmitCard: 0,
          schools: {},
        };
      }

      blocksMap[blockId].totalRegistered += reg10;
      blocksMap[blockId].totalAdmitCard += admitCard10;

      if (!blocksMap[blockId].schools[schoolId]) {
        blocksMap[blockId].schools[schoolId] = {
          schoolId: schoolId,
          schoolName: schoolName || `School ${schoolId}`,
          registered: 0,
          admitCard: 0,
        };
      }

      blocksMap[blockId].schools[schoolId].registered += reg10;
      blocksMap[blockId].schools[schoolId].admitCard += admitCard10;
    }

    const blockList = Object.values(blocksMap).sort(
      (a, b) =>
        b.totalRegistered - a.totalRegistered ||
        (a.blockName || "").localeCompare(b.blockName || "")
    );

    for (const blk of blockList) {
      blk.schools = Object.values(blk.schools).sort(
        (a, b) =>
          b.registered - a.registered ||
          (a.schoolName || "").localeCompare(b.schoolName || "")
      );
    }

    return { blockList };
  };

  const { blockList } = buildBlocksAndSchoolsFromMainData();

  // Function to get filtered schools for PDF (excludes Middle Schools)
  const getFilteredSchoolsForPDF = (block) => {
    return block.schools.filter(school => !isMiddleSchool(school.schoolName));
  };

  // Function to get filtered schools for Excel (excludes Middle Schools)
  const getFilteredSchoolsForExcel = () => {
    const excelData = [];
    
    // Add header
    excelData.push(['District', 'Block', 'School Name', 'Admit Card', 'Registered']);
    
    // Add all data excluding Middle Schools
    blockList.forEach(block => {
      const filteredSchools = block.schools.filter(school => !isMiddleSchool(school.schoolName));
      filteredSchools.forEach(school => {
        excelData.push([
          block.districtName,
          block.blockName,
          school.schoolName,
          school.admitCard,
          school.registered
        ]);
      });
    });

    return excelData;
  };

  // Function to generate PDF for a single block (excludes Middle Schools)
  const generateBlockPDF = (block) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('en-GB');
    
    // Add title and date
    doc.setFontSize(16);
    doc.text("Block School Report - Class 10", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Date of Report: ${currentDate}`, 105, 30, { align: "center" });
    
    // Add district and block name
    doc.setFontSize(14);
    doc.text(`District: ${block.districtName}`, 20, 45);
    doc.text(`Block: ${block.blockName}`, 20, 55);
    
    // Get filtered schools (excluding Middle Schools)
    const filteredSchools = getFilteredSchoolsForPDF(block);
    
    // Calculate totals for filtered schools
    const totalRegisteredFiltered = filteredSchools.reduce((sum, school) => sum + school.registered, 0);
    const totalAdmitCardFiltered = filteredSchools.reduce((sum, school) => sum + school.admitCard, 0);
    
    // Summary section with filtered totals
    doc.setFontSize(12);
    doc.text(`Total Registered: ${totalRegisteredFiltered}`, 20, 70);
    doc.text(`Total Admit Cards: ${totalAdmitCardFiltered}`, 20, 78);
    // doc.text(`Note: Middle Schools have been excluded from this report`, 20, 86);
    
    // Prepare table data
    const tableData = filteredSchools.map((school, index) => [
      index + 1,
      school.schoolName,
      school.admitCard,
      school.registered
    ]);
    
    // Add table if there are filtered schools
    if (filteredSchools.length > 0) {
      doc.autoTable({
        startY: 95,
        head: [['S.No', 'School Name', 'Admit Card', 'Registered']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 100 },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 30, halign: 'right' }
        }
      });
    } else {
      doc.text("No schools found (excluding Middle Schools)", 20, 100);
    }
    
    return doc;
  };

  // Function to download all block PDFs as ZIP
  const downloadAllPDFsAsZip = async () => {
    if (!blockList.length) {
      alert("No data available to download");
      return;
    }

    setDownloadingPDF(true);

    try {
      const zip = new JSZip();
      let hasData = false;
      
      // Generate PDFs and add to zip
      for (const block of blockList) {
        const filteredSchools = getFilteredSchoolsForPDF(block);
        
        // Only generate PDF if there are schools after filtering
        if (filteredSchools.length > 0) {
          hasData = true;
          const doc = generateBlockPDF(block);
          const fileName = `${block.districtName.replace(/\s+/g, '_')}_${block.blockName.replace(/\s+/g, '_')}_Class10.pdf`;
          
          // Convert PDF to blob
          const pdfOutput = doc.output('arraybuffer');
          zip.file(fileName, pdfOutput);
        }
      }
      
      if (!hasData) {
        alert("No data available after excluding Middle Schools");
        return;
      }
      
      // Generate and download zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const currentDate = new Date().toISOString().split('T')[0];
      saveAs(zipBlob, `Block_School_Reports_Class10_${currentDate}.zip`);
      
    } catch (error) {
      console.error("Error generating ZIP file:", error);
      
      // Fallback: Try individual PDF downloads
      alert("ZIP download failed. Downloading PDFs individually...");
      
      // Download individual PDFs
      blockList.forEach((block) => {
        const filteredSchools = getFilteredSchoolsForPDF(block);
        if (filteredSchools.length > 0) {
          const doc = generateBlockPDF(block);
          const fileName = `${block.districtName.replace(/\s+/g, '_')}_${block.blockName.replace(/\s+/g, '_')}_Class10.pdf`;
          doc.save(fileName);
        }
      });
    } finally {
      setDownloadingPDF(false);
    }
  };

  // Function to download Excel (excluding Middle Schools)
  const downloadExcel = () => {
    if (!blockList.length) {
      alert("No data available to download");
      return;
    }

    setDownloadingExcel(true);

    try {
      // Get filtered data for Excel
      const excelData = getFilteredSchoolsForExcel();
      
      // Check if there's any data after filtering
      if (excelData.length <= 1) { // Only header row
        alert("No data available after excluding Middle Schools");
        return;
      }

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Block School Data");
      
      // Generate and download Excel file
      const fileName = `Block_School_Data_Class10_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      alert("Error downloading Excel file. Please try again.");
    } finally {
      setDownloadingExcel(false);
    }
  };

  // total registrations (class 10)
  const totalRegistrations = useMemo(
    () => blockList.reduce((sum, b) => sum + (b.totalRegistered || 0), 0),
    [blockList]
  );

  // Dropdown options
  const blockOptions = useMemo(
    () =>
      blockList.map((b) => ({
        value: b.blockId,
        label: b.blockName,
      })),
    [blockList]
  );

  const schoolOptions = useMemo(() => {
    if (!selectedBlock) return [];
    const block = blockList.find((b) => b.blockId === selectedBlock.value);
    if (!block) return [];
    return block.schools.map((s) => ({
      value: s.schoolId,
      label: s.schoolName,
    }));
  }, [selectedBlock, blockList]);

  // Filtered data for UI (excluding Middle Schools for UI as well if needed)
  const filteredBlocks = useMemo(() => {
    if (!selectedBlock) return blockList;
    const block = blockList.find((b) => b.blockId === selectedBlock.value);
    if (!block) return [];

    if (selectedSchool) {
      const filteredSchools = block.schools.filter(
        (s) => s.schoolId === selectedSchool.value
      );
      const totalRegistered = filteredSchools.reduce((s, x) => s + (x.registered || 0), 0);
      const totalAdmitCard = filteredSchools.reduce((s, x) => s + (x.admitCard || 0), 0);
      return [{ ...block, schools: filteredSchools, totalRegistered, totalAdmitCard }];
    }

    return [block];
  }, [blockList, selectedBlock, selectedSchool]);

  // ensure accordion active keys match filteredBlocks
  useEffect(() => {
    setActiveKeys(filteredBlocks.map((_, i) => String(i)));
  }, [filteredBlocks]);

  const toggleAccordion = () => {
    if (activeKeys.length) {
      setActiveKeys([]);
    } else {
      setActiveKeys(filteredBlocks.map((_, i) => String(i)));
    }
  };

  if (loading)
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
        <div>Loading dashboard...</div>
      </Container>
    );

  if (error)
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!mainDashboardData || mainDashboardData.length === 0)
    return (
      <Container className="py-4">
        <Alert variant="info">No dashboard data available.</Alert>
      </Container>
    );

  return (
    <Container className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Block - School Dashboard (Class 10)- Level 1 Examination</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button 
            variant="primary" 
            onClick={downloadAllPDFsAsZip}
            disabled={!blockList.length || downloadingPDF}
          >
            {downloadingPDF ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Generating ZIP...
              </>
            ) : (
              <>
                <i className="fas fa-file-pdf me-2"></i>
                Download PDF Reports (ZIP)
              </>
            )}
          </Button>
          <Button 
            variant="success" 
            onClick={downloadExcel}
            disabled={!blockList.length || downloadingExcel}
          >
            {downloadingExcel ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Generating Excel...
              </>
            ) : (
              <>
                <i className="fas fa-file-excel me-2"></i>
                Download Excel
              </>
            )}
          </Button>
        </div>
      </div>

 

      {/* Filters */}
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <Select
            options={blockOptions}
            value={selectedBlock}
            onChange={(val) => {
              setSelectedBlock(val);
              setSelectedSchool(null);
            }}
            placeholder="Select Block..."
            isClearable
          />
        </Col>
      </Row>

      <hr></hr>
      {filteredBlocks.length === 0 ? (
        <Alert variant="info">No data found for selected filters (block/school).</Alert>
      ) : (
        <Accordion activeKey={activeKeys} alwaysOpen>
          {filteredBlocks.map((block, idx) => (
            <Accordion.Item eventKey={String(idx)} key={block.blockId}>
              <Accordion.Header>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <Badge bg="secondary">{idx + 1}</Badge>
                    <strong>{block.blockName}:-</strong>

                    <div style={{ display: "flex", gap: "20px" }}>
                      <div>
                        <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                          Admit Card
                        </div>
                        <strong style={{ fontSize: "1.05rem", }}>
                          {block.totalAdmitCard}
                        </strong>
                      </div>

                      <div>
                        <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                          Registered
                        </div>
                        <strong style={{ fontSize: "1.05rem" }}>
                          {block.totalRegistered}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                {block.schools?.length ? (
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th style={{ width: "5%" }}>S.No</th>
                        <th>School Name</th>
                        <th style={{ width: "15%", textAlign: "right" }}>
                          Admit Card
                        </th>
                        <th style={{ width: "15%", textAlign: "right" }}>
                          Registered
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.schools.map((s, i) => (
                        <tr key={s.schoolId || i}>
                          <td>{i + 1}</td>
                          <td>
                            {s.schoolName}
                            {isMiddleSchool(s.schoolName) && (
                              <Badge bg="warning" className="ms-2">
                                Middle School
                              </Badge>
                            )}
                          </td>
                          <td style={{ textAlign: "right", fontWeight: "bold" }}>
                            {s.admitCard}
                          </td>
                          <td style={{ textAlign: "right" }}>{s.registered}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="light" className="mb-0">
                    No schools / no Class 10 registrations in this block.
                  </Alert>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};









//Admit card



// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Accordion,
//   Card,
//   Table,
//   Spinner,
//   Alert,
//   Badge,
//   Container,
//   Row,
//   Col,
//   Button,
// } from "react-bootstrap";
// import Select from "react-select";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService"; // adjust path if needed
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const BlockSchoolDashboard10 = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboard, setDashboard] = useState(null);

//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedSchool, setSelectedSchool] = useState(null);
//   const [activeKeys, setActiveKeys] = useState([]); // control accordion open/close

//   const [mainDashboardData, setMainDashboardData] = useState([]);

//   const fetchMainDashboardCount = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await MainDashBoard();
//       setMainDashboardData(response.data);
//     } catch (error) {
//       console.error("Error", error);
//       setError(error?.message || "Failed to fetch dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchMainDashboardCount();
//   }, []);

//   const fetchDashboarcount = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const resp = await DashboardCounts();
//       const data = resp?.data || resp;
//       setDashboard(data);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError(err?.message || "Failed to fetch dashboard counts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboarcount();
//   }, []);

//   // Build block list and school aggregation using mainDashboardData
//   const buildBlocksAndSchoolsFromMainData = () => {
//     const result = { blockList: [] };
//     if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

//     const blocksMap = {};

//     for (const school of mainDashboardData) {
//       const blockId = String(school?.blockId || "").trim();
//       const blockName = school?.blockName || "";
//       const schoolId = String(school?.centerId || "").trim();
//       const schoolName = school?.centerName || "";
//       const reg10 = Number(school?.registrationCount10 || 0);
//       const admitCard10 = Number(school?.admitCardCount10 || 0);

//       if (!blockId) continue;
//       if (!blocksMap[blockId]) {
//         blocksMap[blockId] = {
//           blockId,
//           blockName: blockName || blockId,
//           totalRegistered: 0,
//           totalAdmitCard: 0,
//           schools: {},
//         };
//       }

//       blocksMap[blockId].totalRegistered += reg10;
//       blocksMap[blockId].totalAdmitCard += admitCard10;

//       if (!blocksMap[blockId].schools[schoolId]) {
//         blocksMap[blockId].schools[schoolId] = {
//           schoolId: schoolId,
//           schoolName: schoolName || `School ${schoolId}`,
//           registered: 0,
//           admitCard: 0,
//         };
//       }

//       blocksMap[blockId].schools[schoolId].registered += reg10;
//       blocksMap[blockId].schools[schoolId].admitCard += admitCard10;
//     }

//     const blockList = Object.values(blocksMap).sort(
//       (a, b) =>
//         b.totalRegistered - a.totalRegistered ||
//         (a.blockName || "").localeCompare(b.blockName || "")
//     );

//     for (const blk of blockList) {
//       blk.schools = Object.values(blk.schools).sort(
//         (a, b) =>
//           b.registered - a.registered ||
//           (a.schoolName || "").localeCompare(b.schoolName || "")
//       );
//     }

//     return { blockList };
//   };

//   const { blockList } = buildBlocksAndSchoolsFromMainData();

//   // total registrations (class 10)
//   const totalRegistrations = useMemo(
//     () => blockList.reduce((sum, b) => sum + (b.totalRegistered || 0), 0),
//     [blockList]
//   );

//   // total admit cards (class 10)
//   const totalAdmitCards = useMemo(
//     () => blockList.reduce((sum, b) => sum + (b.totalAdmitCard || 0), 0),
//     [blockList]
//   );

//   // Dropdown options
//   const blockOptions = useMemo(
//     () =>
//       blockList.map((b) => ({
//         value: b.blockId,
//         label: b.blockName,
//       })),
//     [blockList]
//   );

//   const schoolOptions = useMemo(() => {
//     if (!selectedBlock) return [];
//     const block = blockList.find((b) => b.blockId === selectedBlock.value);
//     if (!block) return [];
//     return block.schools.map((s) => ({
//       value: s.schoolId,
//       label: s.schoolName,
//     }));
//   }, [selectedBlock, blockList]);

//   // Filtered data for UI
//   const filteredBlocks = useMemo(() => {
//     if (!selectedBlock) return blockList;
//     const block = blockList.find((b) => b.blockId === selectedBlock.value);
//     if (!block) return [];

//     if (selectedSchool) {
//       const filteredSchools = block.schools.filter(
//         (s) => s.schoolId === selectedSchool.value
//       );
//       const totalRegistered = filteredSchools.reduce((s, x) => s + (x.registered || 0), 0);
//       const totalAdmitCard = filteredSchools.reduce((s, x) => s + (x.admitCard || 0), 0);
//       return [{ ...block, schools: filteredSchools, totalRegistered, totalAdmitCard }];
//     }

//     return [block];
//   }, [blockList, selectedBlock, selectedSchool]);

//   // ensure accordion active keys match filteredBlocks
//   useEffect(() => {
//     setActiveKeys(filteredBlocks.map((_, i) => String(i)));
//   }, [filteredBlocks]);

//   const toggleAccordion = () => {
//     if (activeKeys.length) {
//       setActiveKeys([]);
//     } else {
//       setActiveKeys(filteredBlocks.map((_, i) => String(i)));
//     }
//   };

//   if (loading)
//     return (
//       <Container className="py-4 text-center">
//         <Spinner animation="border" />
//         <div>Loading dashboard...</div>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container className="py-4">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );

//   if (!mainDashboardData || mainDashboardData.length === 0)
//     return (
//       <Container className="py-4">
//         <Alert variant="info">No dashboard data available.</Alert>
//       </Container>
//     );

//   return (
//     <Container className="py-3">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Block - School Dashboard (Class 10)- Level 1 Examination</h3>
       
//       </div>

//       {/* Summary */}
//       {/* <Card className="mb-4 shadow-sm">
//         <Card.Body className="text-center">
//           <h5 className="mb-0">
//             Total Registrations (Class 10):{" "}
//             <Badge bg="success" pill>
//               {totalRegistrations}
//             </Badge>
//           </h5>
//         </Card.Body>
//       </Card> */}

//       {/* Filters */}
//       <Row className="mb-3">
//         <Col md={6} lg={4}>
//           <Select
//             options={blockOptions}
//             value={selectedBlock}
//             onChange={(val) => {
//               setSelectedBlock(val);
//               setSelectedSchool(null);
//             }}
//             placeholder="Select Block..."
//             isClearable
//           />
//         </Col>
//         {/* <Col md={6} lg={4}>
//           <Select
//             options={schoolOptions}
//             value={selectedSchool}
//             onChange={setSelectedSchool}
//             placeholder="Select School..."
//             isClearable
//             isDisabled={!selectedBlock}
//           />
//         </Col> */}
//       </Row>

// <hr></hr>
//       {filteredBlocks.length === 0 ? (
//         <Alert variant="info">No data found for selected filters (block/school).</Alert>
//       ) : (
//         <Accordion activeKey={activeKeys} alwaysOpen>
//           {filteredBlocks.map((block, idx) => (
//             <Accordion.Item eventKey={String(idx)} key={block.blockId}>
//               <Accordion.Header>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     width: "100%",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//                     <Badge bg="secondary">{idx + 1}</Badge>
//                     <strong>{block.blockName}:</strong>
//                   </div>
                  
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "24px",
//                     }}
//                   >
//                     <div style={{ textAlign: "center" }}>
//                       <div style={{ fontSize: "0.85rem", color: "#666" }}>Registered</div>
//                       <strong style={{ fontSize: "1.05rem" }}>
//                         {block.totalRegistered}
//                       </strong>
//                     </div>
//                     <div style={{ textAlign: "center" }}>
//                       <div style={{ fontSize: "0.85rem", color: "#666" }}>Admit Card</div>
//                       <strong style={{ fontSize: "1.05rem", color: "#28a745" }}>
//                         {block.totalAdmitCard}
//                       </strong>
//                     </div>
//                   </div>
//                 </div>
//               </Accordion.Header>
//               <Accordion.Body>
//                 {block.schools?.length ? (
//                   <Table bordered hover responsive>
//                     <thead>
//                       <tr>
//                         <th style={{ width: "5%" }}>S.No</th>
//                         <th>School Name</th>
//                         <th style={{ width: "15%", textAlign: "right" }}>
//                           Registered
//                         </th>
//                         <th style={{ width: "15%", textAlign: "right" }}>
//                           Admit Card
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {block.schools.map((s, i) => (
//                         <tr key={s.schoolId || i}>
//                           <td>{i + 1}</td>
//                           <td>{s.schoolName}</td>
//                           <td style={{ textAlign: "right" }}>{s.registered}</td>
//                           <td style={{ textAlign: "right", color: "#28a745" }}>{s.admitCard}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 ) : (
//                   <Alert variant="light" className="mb-0">
//                     No schools / no Class 10 registrations in this block.
//                   </Alert>
//                 )}
//               </Accordion.Body>
//             </Accordion.Item>
//           ))}
//         </Accordion>
//       )}
//     </Container>
//   );
// };