// src/components/Dashboards/DistrictDashboard.jsx


//Level 1 Registration dashboard

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
// } from "react-bootstrap";
// import Select from "react-select";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService"; // adjust path if needed
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const Districtdashboard10 = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboard, setDashboard] = useState(null);

//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);

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

//   // Build district list and block aggregation using mainDashboardData
//   const buildDistrictsAndBlocksFromMainData = () => {
//     const result = {
//       districtList: [],
//     };
//     if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

//     const districtsMap = {};

//     for (const school of mainDashboardData) {
//       const districtId = String(school?.districtId || "").trim();
//       const districtName = school?.districtName || "";
//       const blockId = String(school?.blockId || "").trim();
//       const blockName = school?.blockName || "";
//       const reg10 = Number(school?.registrationCount10 || 0);

//       if (!districtId) continue;

//       if (!districtsMap[districtId]) {
//         districtsMap[districtId] = {
//           districtId,
//           districtName: districtName || districtId,
//           totalRegistered: 0,
//           blocks: {},
//         };
//       }

//       districtsMap[districtId].totalRegistered += reg10;

//       if (!districtsMap[districtId].blocks[blockId]) {
//         districtsMap[districtId].blocks[blockId] = {
//           blockId,
//           blockName: blockName || blockId,
//           registered: 0,
//         };
//       }

//       districtsMap[districtId].blocks[blockId].registered += reg10;
//     }

//     const districtList = Object.values(districtsMap);

//     districtList.sort(
//       (a, b) =>
//         b.totalRegistered - a.totalRegistered ||
//         a.districtName.localeCompare(b.districtName)
//     );

//     for (const d of districtList) {
//       const blocksArr = Object.values(d.blocks).sort((x, y) => {
//         if (y.registered !== x.registered) return y.registered - x.registered;
//         return (x.blockName || "").localeCompare(y.blockName || "");
//       });
//       d.blocks = blocksArr;
//     }

//     return { districtList };
//   };

//   const { districtList } = buildDistrictsAndBlocksFromMainData();

//   // Build dependent dropdown options
//   const districtOptions = useMemo(
//     () =>
//       districtList.map((d) => ({
//         value: d.districtId,
//         label: d.districtName,
//       })),
//     [districtList]
//   );

//   const blockOptions = useMemo(() => {
//     if (!selectedDistrict) return [];
//     const district = districtList.find(
//       (d) => d.districtId === selectedDistrict.value
//     );
//     if (!district) return [];
//     return district.blocks.map((b) => ({
//       value: b.blockId,
//       label: b.blockName,
//     }));
//   }, [selectedDistrict, districtList]);

//   // Filtered list based on selected district/block
//   const filteredDistricts = useMemo(() => {
//     if (!selectedDistrict) return districtList;

//     const district = districtList.find(
//       (d) => d.districtId === selectedDistrict.value
//     );
//     if (!district) return [];

//     if (selectedBlock) {
//       const filteredBlocks = district.blocks.filter(
//         (b) => b.blockId === selectedBlock.value
//       );
//       return [{ ...district, blocks: filteredBlocks }];
//     }

//     return [district];
//   }, [districtList, selectedDistrict, selectedBlock]);

//   const defaultActiveKeys = filteredDistricts.map((_, i) => String(i));

//   if (loading) {
//     return (
//       <Container className="py-4 text-center">
//         <Spinner animation="border" role="status" />
//         <div className="mt-2">Loading dashboard...</div>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="py-4">
//         <Alert variant="danger">
//           <strong>Error:</strong> {error}
//         </Alert>
//       </Container>
//     );
//   }

//   if (!mainDashboardData || mainDashboardData.length === 0) {
//     return (
//       <Container className="py-4">
//         <Alert variant="info">No dashboard data available.</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-3">
//       <h3>District - Block Dashboard (Class 10)- Level 1 Examination</h3>
//       <p className="text-muted">Filter by District or Block below.</p>

//       {/* Filter section */}
//       <Row className="mb-3">
//         <Col md={6} lg={4}>
//           <Select
//             options={districtOptions}
//             value={selectedDistrict}
//             onChange={(val) => {
//               setSelectedDistrict(val);
//               setSelectedBlock(null);
//             }}
//             placeholder="Select District..."
//             isClearable
//           />
//         </Col>
//         <Col md={6} lg={4}>
//           <Select
//             options={blockOptions}
//             value={selectedBlock}
//             onChange={setSelectedBlock}
//             placeholder="Select Block..."
//             isClearable
//             isDisabled={!selectedDistrict}
//           />
//         </Col>
//       </Row>
//       <hr></hr>

//       {filteredDistricts.length === 0 ? (
//         <Alert variant="info">
//           No data found for selected filters (district/block).
//         </Alert>
//       ) : (
//         <Accordion defaultActiveKey={defaultActiveKeys} alwaysOpen>
//           {filteredDistricts.map((district, idx) => (
//             <Card key={district.districtId}>
//               <Accordion.Item eventKey={String(idx)}>
//                 <Accordion.Header>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       width: "100%",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "12px",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Badge bg="secondary">{idx + 1}</Badge>
//                       <strong>
//                         {district.districtName ||
//                           `District ${district.districtId}`}:-
//                       </strong>

//                       <div>
//                         <strong style={{ fontSize: "1.05rem" }}>
//                           {district.totalRegistered}
//                         </strong>
                     
//                       </div>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "12px",
//                       }}
//                     >
                      
//                     </div>
//                   </div>
//                 </Accordion.Header>

//                 <Accordion.Body>
//                   {!district.blocks || district.blocks.length === 0 ? (
//                     <Alert variant="light">
//                       No blocks / no Class 10 registrations in this district.
//                     </Alert>
//                   ) : (
//                     <Table bordered hover responsive>
//                       <thead>
//                         <tr>
//                           <th style={{ width: "5%" }}>S.No</th>
//                           <th>Block Name</th>
//                           <th style={{ width: "20%", textAlign: "right" }}>
//                             Registered
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {district.blocks.map((b, i) => (
//                           <tr key={b.blockId || i}>
//                             <td>{i + 1}</td>
//                             <td>{b.blockName || `Block ${b.blockId}`}</td>
//                             <td style={{ textAlign: "right" }}>{b.registered}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   )}
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Card>
//           ))}
//         </Accordion>
//       )}
//     </Container>
//   );
// };

// export default Districtdashboard10;
















//Working dashboard without downloadble reports


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
// } from "react-bootstrap";
// import Select from "react-select";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService"; // adjust path if needed
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const Districtdashboard10 = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboard, setDashboard] = useState(null);

//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);

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

//   // Build district list and block aggregation using mainDashboardData
//   const buildDistrictsAndBlocksFromMainData = () => {
//     const result = {
//       districtList: [],
//     };
//     if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

//     const districtsMap = {};

//     for (const school of mainDashboardData) {
//       const districtId = String(school?.districtId || "").trim();
//       const districtName = school?.districtName || "";
//       const blockId = String(school?.blockId || "").trim();
//       const blockName = school?.blockName || "";
//       const reg10 = Number(school?.registrationCount10 || 0);
//       const admitCard10 = Number(school?.admitCardCount10 || 0);

//       if (!districtId) continue;

//       if (!districtsMap[districtId]) {
//         districtsMap[districtId] = {
//           districtId,
//           districtName: districtName || districtId,
//           totalRegistered: 0,
//           totalAdmitCard: 0,
//           blocks: {},
//         };
//       }

//       districtsMap[districtId].totalRegistered += reg10;
//       districtsMap[districtId].totalAdmitCard += admitCard10;

//       if (!districtsMap[districtId].blocks[blockId]) {
//         districtsMap[districtId].blocks[blockId] = {
//           blockId,
//           blockName: blockName || blockId,
//           registered: 0,
//           admitCard: 0,
//         };
//       }

//       districtsMap[districtId].blocks[blockId].registered += reg10;
//       districtsMap[districtId].blocks[blockId].admitCard += admitCard10;
//     }

//     const districtList = Object.values(districtsMap);

//     districtList.sort(
//       (a, b) =>
//         b.totalRegistered - a.totalRegistered ||
//         a.districtName.localeCompare(b.districtName)
//     );

//     for (const d of districtList) {
//       const blocksArr = Object.values(d.blocks).sort((x, y) => {
//         if (y.registered !== x.registered) return y.registered - x.registered;
//         return (x.blockName || "").localeCompare(y.blockName || "");
//       });
//       d.blocks = blocksArr;
//     }

//     return { districtList };
//   };

//   const { districtList } = buildDistrictsAndBlocksFromMainData();

//   // Build dependent dropdown options
//   const districtOptions = useMemo(
//     () =>
//       districtList.map((d) => ({
//         value: d.districtId,
//         label: d.districtName,
//       })),
//     [districtList]
//   );

//   const blockOptions = useMemo(() => {
//     if (!selectedDistrict) return [];
//     const district = districtList.find(
//       (d) => d.districtId === selectedDistrict.value
//     );
//     if (!district) return [];
//     return district.blocks.map((b) => ({
//       value: b.blockId,
//       label: b.blockName,
//     }));
//   }, [selectedDistrict, districtList]);

//   // Filtered list based on selected district/block
//   const filteredDistricts = useMemo(() => {
//     if (!selectedDistrict) return districtList;

//     const district = districtList.find(
//       (d) => d.districtId === selectedDistrict.value
//     );
//     if (!district) return [];

//     if (selectedBlock) {
//       const filteredBlocks = district.blocks.filter(
//         (b) => b.blockId === selectedBlock.value
//       );
//       return [{ ...district, blocks: filteredBlocks }];
//     }

//     return [district];
//   }, [districtList, selectedDistrict, selectedBlock]);

//   const defaultActiveKeys = filteredDistricts.map((_, i) => String(i));

//   if (loading) {
//     return (
//       <Container className="py-4 text-center">
//         <Spinner animation="border" role="status" />
//         <div className="mt-2">Loading dashboard...</div>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="py-4">
//         <Alert variant="danger">
//           <strong>Error:</strong> {error}
//         </Alert>
//       </Container>
//     );
//   }

//   if (!mainDashboardData || mainDashboardData.length === 0) {
//     return (
//       <Container className="py-4">
//         <Alert variant="info">No dashboard data available.</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-3">
//       <h3>District - Block Dashboard (Class 10)- Level 1 Examination</h3>
//       <p className="text-muted">Filter by District or Block below.</p>

//       {/* Filter section */}
//       <Row className="mb-3">
//         <Col md={6} lg={4}>
//           <Select
//             options={districtOptions}
//             value={selectedDistrict}
//             onChange={(val) => {
//               setSelectedDistrict(val);
//               setSelectedBlock(null);
//             }}
//             placeholder="Select District..."
//             isClearable
//           />
//         </Col>
//         <Col md={6} lg={4}>
//           <Select
//             options={blockOptions}
//             value={selectedBlock}
//             onChange={setSelectedBlock}
//             placeholder="Select Block..."
//             isClearable
//             isDisabled={!selectedDistrict}
//           />
//         </Col>
//       </Row>
//       <hr></hr>

//       {filteredDistricts.length === 0 ? (
//         <Alert variant="info">
//           No data found for selected filters (district/block).
//         </Alert>
//       ) : (
//         <Accordion defaultActiveKey={defaultActiveKeys} alwaysOpen>
//           {filteredDistricts.map((district, idx) => (
//             <Card key={district.districtId}>
//               <Accordion.Item eventKey={String(idx)}>
//                 <Accordion.Header>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       width: "100%",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "12px",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Badge bg="secondary">{idx + 1}</Badge>
//                       <strong>
//                         {district.districtName ||
//                           `District ${district.districtId}`}:-
//                       </strong>

//                       <div style={{ display: "flex", gap: "20px" }}>

//                          <div>
//                           <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
//                             Admit Card
//                           </div>
//                           <strong style={{ fontSize: "1.05rem", }}>
//                             {district.totalAdmitCard}
//                           </strong>
//                         </div>
//                         <div>
//                           <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
//                             Registered
//                           </div>
//                           <strong style={{ fontSize: "1.05rem" }}>
//                             {district.totalRegistered}
//                           </strong>
//                         </div>
                       
//                       </div>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "12px",
//                       }}
//                     >
                      
//                     </div>
//                   </div>
//                 </Accordion.Header>

//                 <Accordion.Body>
//                   {!district.blocks || district.blocks.length === 0 ? (
//                     <Alert variant="light">
//                       No blocks / no Class 10 registrations in this district.
//                     </Alert>
//                   ) : (
//                     <Table bordered hover responsive>
//                       <thead>
//                         <tr>
//                           <th style={{ width: "5%" }}>S.No</th>
//                           <th>Block Name</th>

//                            <th style={{ width: "15%", textAlign: "right" }}>
//                             Admit Card
//                           </th>
//                           <th style={{ width: "15%", textAlign: "right" }}>
//                             Registered
//                           </th>
                         
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {district.blocks.map((b, i) => (
//                           <tr key={b.blockId || i}>
//                             <td>{i + 1}</td>
//                             <td>{b.blockName || `Block ${b.blockId}`}</td>
//                             <td style={{ textAlign: "right", fontWeight: "bold" }}>
//                               {b.admitCard}
//                             </td>
//                             <td style={{ textAlign: "right" }}>{b.registered}</td>
                            
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   )}
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Card>
//           ))}
//         </Accordion>
//       )}
//     </Container>
//   );
// };

// export default Districtdashboard10;

















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

export const Districtdashboard10 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);

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

  // Build district list and block aggregation using mainDashboardData
  const buildDistrictsAndBlocksFromMainData = () => {
    const result = {
      districtList: [],
    };
    if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

    const districtsMap = {};

    for (const school of mainDashboardData) {
      const districtId = String(school?.districtId || "").trim();
      const districtName = school?.districtName || "";
      const blockId = String(school?.blockId || "").trim();
      const blockName = school?.blockName || "";
      const reg10 = Number(school?.registrationCount10 || 0);
      const admitCard10 = Number(school?.admitCardCount10 || 0);

      if (!districtId) continue;

      if (!districtsMap[districtId]) {
        districtsMap[districtId] = {
          districtId,
          districtName: districtName || districtId,
          totalRegistered: 0,
          totalAdmitCard: 0,
          blocks: {},
        };
      }

      districtsMap[districtId].totalRegistered += reg10;
      districtsMap[districtId].totalAdmitCard += admitCard10;

      if (!districtsMap[districtId].blocks[blockId]) {
        districtsMap[districtId].blocks[blockId] = {
          blockId,
          blockName: blockName || blockId,
          registered: 0,
          admitCard: 0,
        };
      }

      districtsMap[districtId].blocks[blockId].registered += reg10;
      districtsMap[districtId].blocks[blockId].admitCard += admitCard10;
    }

    const districtList = Object.values(districtsMap);

    districtList.sort(
      (a, b) =>
        b.totalRegistered - a.totalRegistered ||
        a.districtName.localeCompare(b.districtName)
    );

    for (const d of districtList) {
      const blocksArr = Object.values(d.blocks).sort((x, y) => {
        if (y.registered !== x.registered) return y.registered - x.registered;
        return (x.blockName || "").localeCompare(y.blockName || "");
      });
      d.blocks = blocksArr;
    }

    return { districtList };
  };

  const { districtList } = buildDistrictsAndBlocksFromMainData();

  // Function to generate PDF report
  const downloadPDFReport = () => {
    if (!districtList.length) {
      alert("No data available to download");
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('en-GB');
    
    // Add title and date
    doc.setFontSize(16);
    doc.text("HARYANA SUPER 100 LEVEL 1 ENTRANCE EXAMINATION", 105, 20, { align: "center" });
    doc.text("ADMIT CARD SUMMARY", 105, 30, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Date of Report: ${currentDate}`, 105, 40, { align: "center" });
    
    let startY = 50;
    
    // Loop through districts
    districtList.forEach((district, districtIndex) => {
      // Check if we need a new page
      if (startY > 250) {
        doc.addPage();
        startY = 20;
      }
      
      // District header
      doc.setFontSize(14);
      doc.text(`#${districtIndex + 1} District: ${district.districtName}`, 20, startY);
      
      doc.setFontSize(12);
      doc.text(`Admit Card: ${district.totalAdmitCard}`, 20, startY + 8);
      doc.text(`Registered: ${district.totalRegistered}`, 20, startY + 16);
      
      // Prepare table data for blocks
      const tableData = district.blocks.map((block, blockIndex) => [
        blockIndex + 1,
        block.blockName,
        block.admitCard,
        block.registered
      ]);
      
      // Add table for blocks
      doc.autoTable({
        startY: startY + 22,
        head: [['S.No', 'Block Name', 'Admit Card', 'Registered']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 100 },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 30, halign: 'right' }
        },
        margin: { left: 20 }
      });
      
      // Update startY for next district
      startY = doc.lastAutoTable.finalY + 15;
    });
    
    // Save PDF
    const fileName = `District_Block_Report_Class10_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  // Function to download Excel report
  const downloadExcelReport = () => {
    if (!districtList.length) {
      alert("No data available to download");
      return;
    }

    // Prepare data for Excel
    const excelData = [];
    
    // Add header
    excelData.push(['S.No', 'District', 'Block', 'Admit Card Count', 'Registered']);
    
    let serialNo = 1;
    
    // Add all data sorted by registered count
    const allData = [];
    
    districtList.forEach(district => {
      district.blocks.forEach(block => {
        allData.push({
          district: district.districtName,
          block: block.blockName,
          admitCard: block.admitCard,
          registered: block.registered,
          districtTotalRegistered: district.totalRegistered
        });
      });
    });
    
    // Sort by registered count (descending)
    allData.sort((a, b) => b.registered - a.registered);
    
    // Add sorted data to Excel
    allData.forEach((item, index) => {
      excelData.push([
        index + 1,
        item.district,
        item.block,
        item.admitCard,
        item.registered
      ]);
    });
    
    // Add summary row
    const totalAdmitCard = districtList.reduce((sum, d) => sum + d.totalAdmitCard, 0);
    const totalRegistered = districtList.reduce((sum, d) => sum + d.totalRegistered, 0);
    
    excelData.push([]); // Empty row
    excelData.push(['TOTAL', '', '', totalAdmitCard, totalRegistered]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [
      { wch: 8 },   // S.No
      { wch: 30 },  // District
      { wch: 30 },  // Block
      { wch: 15 },  // Admit Card Count
      { wch: 15 }   // Registered
    ];
    ws['!cols'] = colWidths;
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "District Block Data");
    
    // Generate and download Excel file
    const fileName = `District_Block_Data_Class10_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Build dependent dropdown options
  const districtOptions = useMemo(
    () =>
      districtList.map((d) => ({
        value: d.districtId,
        label: d.districtName,
      })),
    [districtList]
  );

  const blockOptions = useMemo(() => {
    if (!selectedDistrict) return [];
    const district = districtList.find(
      (d) => d.districtId === selectedDistrict.value
    );
    if (!district) return [];
    return district.blocks.map((b) => ({
      value: b.blockId,
      label: b.blockName,
    }));
  }, [selectedDistrict, districtList]);

  // Filtered list based on selected district/block
  const filteredDistricts = useMemo(() => {
    if (!selectedDistrict) return districtList;

    const district = districtList.find(
      (d) => d.districtId === selectedDistrict.value
    );
    if (!district) return [];

    if (selectedBlock) {
      const filteredBlocks = district.blocks.filter(
        (b) => b.blockId === selectedBlock.value
      );
      return [{ ...district, blocks: filteredBlocks }];
    }

    return [district];
  }, [districtList, selectedDistrict, selectedBlock]);

  const defaultActiveKeys = filteredDistricts.map((_, i) => String(i));

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status" />
        <div className="mt-2">Loading dashboard...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <strong>Error:</strong> {error}
        </Alert>
      </Container>
    );
  }

  if (!mainDashboardData || mainDashboardData.length === 0) {
    return (
      <Container className="py-4">
        <Alert variant="info">No dashboard data available.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>District - Block Dashboard (Class 10)- Level 1 Examination</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button 
            variant="primary" 
            onClick={downloadPDFReport}
            disabled={!districtList.length}
          >
            <i className="fas fa-file-pdf me-2"></i>
            Download PDF Report
          </Button>
          <Button 
            variant="success" 
            onClick={downloadExcelReport}
            disabled={!districtList.length}
          >
            <i className="fas fa-file-excel me-2"></i>
            Download Excel
          </Button>
        </div>
      </div>
      
      <p className="text-muted">Filter by District or Block below.</p>

      {/* Filter section */}
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <Select
            options={districtOptions}
            value={selectedDistrict}
            onChange={(val) => {
              setSelectedDistrict(val);
              setSelectedBlock(null);
            }}
            placeholder="Select District..."
            isClearable
          />
        </Col>
        <Col md={6} lg={4}>
          <Select
            options={blockOptions}
            value={selectedBlock}
            onChange={setSelectedBlock}
            placeholder="Select Block..."
            isClearable
            isDisabled={!selectedDistrict}
          />
        </Col>
      </Row>
      <hr></hr>

      {filteredDistricts.length === 0 ? (
        <Alert variant="info">
          No data found for selected filters (district/block).
        </Alert>
      ) : (
        <Accordion defaultActiveKey={defaultActiveKeys} alwaysOpen>
          {filteredDistricts.map((district, idx) => (
            <Card key={district.districtId}>
              <Accordion.Item eventKey={String(idx)}>
                <Accordion.Header>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <Badge bg="secondary">{idx + 1}</Badge>
                      <strong>
                        {district.districtName ||
                          `District ${district.districtId}`}:-
                      </strong>

                      <div style={{ display: "flex", gap: "20px" }}>
                         <div>
                          <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                            Admit Card
                          </div>
                          <strong style={{ fontSize: "1.05rem", }}>
                            {district.totalAdmitCard}
                          </strong>
                        </div>
                        <div>
                          <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                            Registered
                          </div>
                          <strong style={{ fontSize: "1.05rem" }}>
                            {district.totalRegistered}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </Accordion.Header>

                <Accordion.Body>
                  {!district.blocks || district.blocks.length === 0 ? (
                    <Alert variant="light">
                      No blocks / no Class 10 registrations in this district.
                    </Alert>
                  ) : (
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th style={{ width: "5%" }}>S.No</th>
                          <th>Block Name</th>
                          <th style={{ width: "15%", textAlign: "right" }}>
                            Admit Card
                          </th>
                          <th style={{ width: "15%", textAlign: "right" }}>
                            Registered
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {district.blocks.map((b, i) => (
                          <tr key={b.blockId || i}>
                            <td>{i + 1}</td>
                            <td>{b.blockName || `Block ${b.blockId}`}</td>
                            <td style={{ textAlign: "right", fontWeight: "bold" }}>
                              {b.admitCard}
                            </td>
                            <td style={{ textAlign: "right" }}>{b.registered}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default Districtdashboard10;










//Level 1 Admit card


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
// } from "react-bootstrap";
// import Select from "react-select";
// import { DashboardCounts } from "../../services/DashBoardServices/DashboardService"; // adjust path if needed
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const Districtdashboard10 = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboard, setDashboard] = useState(null);

//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);

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

//   // Build district list and block aggregation using mainDashboardData
//   const buildDistrictsAndBlocksFromMainData = () => {
//     const result = {
//       districtList: [],
//     };
//     if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

//     const districtsMap = {};

//     for (const school of mainDashboardData) {
//       const districtId = String(school?.districtId || "").trim();
//       const districtName = school?.districtName || "";
//       const blockId = String(school?.blockId || "").trim();
//       const blockName = school?.blockName || "";
//       const reg10 = Number(school?.registrationCount10 || 0);
//       const admitCard10 = Number(school?.admitCardCount10 || 0);

//       if (!districtId) continue;

//       if (!districtsMap[districtId]) {
//         districtsMap[districtId] = {
//           districtId,
//           districtName: districtName || districtId,
//           totalRegistered: 0,
//           totalAdmitCard: 0,
//           blocks: {},
//         };
//       }

//       districtsMap[districtId].totalRegistered += reg10;
//       districtsMap[districtId].totalAdmitCard += admitCard10;

//       if (!districtsMap[districtId].blocks[blockId]) {
//         districtsMap[districtId].blocks[blockId] = {
//           blockId,
//           blockName: blockName || blockId,
//           registered: 0,
//           admitCard: 0,
//         };
//       }

//       districtsMap[districtId].blocks[blockId].registered += reg10;
//       districtsMap[districtId].blocks[blockId].admitCard += admitCard10;
//     }

//     const districtList = Object.values(districtsMap);

//     districtList.sort(
//       (a, b) =>
//         b.totalRegistered - a.totalRegistered ||
//         a.districtName.localeCompare(b.districtName)
//     );

//     for (const d of districtList) {
//       const blocksArr = Object.values(d.blocks).sort((x, y) => {
//         if (y.registered !== x.registered) return y.registered - x.registered;
//         return (x.blockName || "").localeCompare(y.blockName || "");
//       });
//       d.blocks = blocksArr;
//     }

//     return { districtList };
//   };

//   const { districtList } = buildDistrictsAndBlocksFromMainData();

//   // Build dependent dropdown options
//   const districtOptions = useMemo(
//     () =>
//       districtList.map((d) => ({
//         value: d.districtId,
//         label: d.districtName,
//       })),
//     [districtList]
//   );

//   const blockOptions = useMemo(() => {
//     if (!selectedDistrict) return [];
//     const district = districtList.find(
//       (d) => d.districtId === selectedDistrict.value
//     );
//     if (!district) return [];
//     return district.blocks.map((b) => ({
//       value: b.blockId,
//       label: b.blockName,
//     }));
//   }, [selectedDistrict, districtList]);

//   // Filtered list based on selected district/block
//   const filteredDistricts = useMemo(() => {
//     if (!selectedDistrict) return districtList;

//     const district = districtList.find(
//       (d) => d.districtId === selectedDistrict.value
//     );
//     if (!district) return [];

//     if (selectedBlock) {
//       const filteredBlocks = district.blocks.filter(
//         (b) => b.blockId === selectedBlock.value
//       );
//       const totalRegistered = filteredBlocks.reduce((sum, b) => sum + (b.registered || 0), 0);
//       const totalAdmitCard = filteredBlocks.reduce((sum, b) => sum + (b.admitCard || 0), 0);
//       return [{ ...district, blocks: filteredBlocks, totalRegistered, totalAdmitCard }];
//     }

//     return [district];
//   }, [districtList, selectedDistrict, selectedBlock]);

//   const defaultActiveKeys = filteredDistricts.map((_, i) => String(i));

//   if (loading) {
//     return (
//       <Container className="py-4 text-center">
//         <Spinner animation="border" role="status" />
//         <div className="mt-2">Loading dashboard...</div>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="py-4">
//         <Alert variant="danger">
//           <strong>Error:</strong> {error}
//         </Alert>
//       </Container>
//     );
//   }

//   if (!mainDashboardData || mainDashboardData.length === 0) {
//     return (
//       <Container className="py-4">
//         <Alert variant="info">No dashboard data available.</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-3">
//       <h3>District - Block Dashboard (Class 10)- Level 1 Examination</h3>
//       <p className="text-muted">Filter by District or Block below.</p>

//       {/* Filter section */}
//       <Row className="mb-3">
//         <Col md={6} lg={4}>
//           <Select
//             options={districtOptions}
//             value={selectedDistrict}
//             onChange={(val) => {
//               setSelectedDistrict(val);
//               setSelectedBlock(null);
//             }}
//             placeholder="Select District..."
//             isClearable
//           />
//         </Col>
//         <Col md={6} lg={4}>
//           <Select
//             options={blockOptions}
//             value={selectedBlock}
//             onChange={setSelectedBlock}
//             placeholder="Select Block..."
//             isClearable
//             isDisabled={!selectedDistrict}
//           />
//         </Col>
//       </Row>
//       <hr></hr>

//       {filteredDistricts.length === 0 ? (
//         <Alert variant="info">
//           No data found for selected filters (district/block).
//         </Alert>
//       ) : (
//         <Accordion defaultActiveKey={defaultActiveKeys} alwaysOpen>
//           {filteredDistricts.map((district, idx) => (
//             <Card key={district.districtId}>
//               <Accordion.Item eventKey={String(idx)}>
//                 <Accordion.Header>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       width: "100%",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "12px",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Badge bg="secondary">{idx + 1}</Badge>
//                       <strong>
//                         {district.districtName ||
//                           `District ${district.districtId}`}:
//                       </strong>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "24px",
//                       }}
//                     >
//                       <div style={{ textAlign: "center" }}>
//                         <div style={{ fontSize: "0.85rem", color: "#666" }}>Registered</div>
//                         <strong style={{ fontSize: "1.05rem" }}>
//                           {district.totalRegistered}
//                         </strong>
//                       </div>
//                       <div style={{ textAlign: "center" }}>
//                         <div style={{ fontSize: "0.85rem", color: "#666" }}>Admit Card</div>
//                         <strong style={{ fontSize: "1.05rem", color: "#28a745" }}>
//                           {district.totalAdmitCard}
//                         </strong>
//                       </div>
//                     </div>
//                   </div>
//                 </Accordion.Header>

//                 <Accordion.Body>
//                   {!district.blocks || district.blocks.length === 0 ? (
//                     <Alert variant="light">
//                       No blocks / no Class 10 registrations in this district.
//                     </Alert>
//                   ) : (
//                     <Table bordered hover responsive>
//                       <thead>
//                         <tr>
//                           <th style={{ width: "5%" }}>S.No</th>
//                           <th>Block Name</th>
//                           <th style={{ width: "15%", textAlign: "right" }}>
//                             Registered
//                           </th>
//                           <th style={{ width: "15%", textAlign: "right" }}>
//                             Admit Card
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {district.blocks.map((b, i) => (
//                           <tr key={b.blockId || i}>
//                             <td>{i + 1}</td>
//                             <td>{b.blockName || `Block ${b.blockId}`}</td>
//                             <td style={{ textAlign: "right" }}>{b.registered}</td>
//                             <td style={{ textAlign: "right", color: "#28a745" }}>
//                               {b.admitCard}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   )}
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Card>
//           ))}
//         </Accordion>
//       )}
//     </Container>
//   );
// };

// export default Districtdashboard10;