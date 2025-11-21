// // src/components/Dashboards/DownloadDashboardReports.jsx
// import React, { useState } from "react";
// import { Container, Card, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const DownloadDashboardReports = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Process main dashboard data for reports
//   const processDashboardData = (mainData, classType) => {
//     if (!mainData || !Array.isArray(mainData)) return { districts: {}, blocks: {} };

//     const districtsMap = {};
//     const blocksMap = {};

//     mainData.forEach(school => {
//       const districtId = String(school?.districtId || "").trim();
//       const districtName = school?.districtName || `District ${districtId}`;
//       const blockId = String(school?.blockId || "").trim();
//       const blockName = school?.blockName || `Block ${blockId}`;
//       const schoolId = String(school?.centerId || "").trim();
//       const schoolName = school?.centerName || `School ${schoolId}`;
      
//       const registrationCount = classType === '8' 
//         ? Number(school?.registrationCount8 || 0)
//         : Number(school?.registrationCount10 || 0);

//       if (!districtId || !blockId) return;

//       // Process districts
//       if (!districtsMap[districtId]) {
//         districtsMap[districtId] = {
//           districtId,
//           districtName,
//           totalRegistered: 0,
//           blocks: {}
//         };
//       }

//       districtsMap[districtId].totalRegistered += registrationCount;

//       // Process blocks within districts
//       if (!districtsMap[districtId].blocks[blockId]) {
//         districtsMap[districtId].blocks[blockId] = {
//           blockId,
//           blockName,
//           registered: 0,
//           lowRegistrationSchools: []
//         };
//       }

//       districtsMap[districtId].blocks[blockId].registered += registrationCount;

//       // Track schools with low registration (<= 5)
//       if (registrationCount <= 5) {
//         districtsMap[districtId].blocks[blockId].lowRegistrationSchools.push({
//           schoolName,
//           registrationCount
//         });
//       }

//       // Process blocks independently for block-school reports
//       if (!blocksMap[blockId]) {
//         blocksMap[blockId] = {
//           blockId,
//           blockName,
//           totalRegistered: 0,
//           schools: {}
//         };
//       }

//       blocksMap[blockId].totalRegistered += registrationCount;

//       if (!blocksMap[blockId].schools[schoolId]) {
//         blocksMap[blockId].schools[schoolId] = {
//           schoolId,
//           schoolName,
//           registered: 0
//         };
//       }

//       blocksMap[blockId].schools[schoolId].registered += registrationCount;
//     });

//     // Convert maps to sorted arrays
//     const districts = Object.values(districtsMap).map(district => ({
//       ...district,
//       blocks: Object.values(district.blocks).sort((a, b) => b.registered - a.registered)
//     })).sort((a, b) => b.totalRegistered - a.totalRegistered);

//     const blocks = Object.values(blocksMap).map(block => ({
//       ...block,
//       schools: Object.values(block.schools).sort((a, b) => b.registered - a.registered)
//     })).sort((a, b) => b.totalRegistered - a.totalRegistered);

//     return { districts, blocks };
//   };

//   // Generate District-Block PDF
//   const generateDistrictBlockPDF = (district, classType) => {
//     const pdf = new jsPDF();
//     const pageWidth = pdf.internal.pageSize.getWidth();
    
//     // Title
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(`District: ${district.districtName}`, pageWidth / 2, 15, { align: "center" });
    
//     // Total Registration
//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`Total Registrations (Class ${classType}): ${district.totalRegistered}`, pageWidth / 2, 25, { align: "center" });
    
//     // Header for blocks table
//     pdf.autoTable({
//       startY: 35,
//       head: [['#', 'Block Name', 'Registration Count']],
//       body: district.blocks.map((block, index) => [
//         index + 1,
//         block.blockName,
//         block.registered.toString()
//       ]),
//       theme: 'grid',
//       headStyles: { fillColor: [66, 139, 202] },
//       styles: { fontSize: 10 }
//     });

//     let finalY = pdf.lastAutoTable.finalY + 10;

//     // Low registration schools section
//     const lowRegistrationBlocks = district.blocks.filter(block => 
//       block.lowRegistrationSchools && block.lowRegistrationSchools.length > 0
//     );

//     if (lowRegistrationBlocks.length > 0) {
//       pdf.setFontSize(12);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("Schools with 5 or fewer registrations:", 14, finalY);
//       finalY += 8;

//       lowRegistrationBlocks.forEach(block => {
//         // Check if we need a new page
//         if (finalY > 250) {
//           pdf.addPage();
//           finalY = 20;
//         }

//         pdf.setFontSize(10);
//         pdf.setFont("helvetica", "bold");
//         pdf.text(`Block: ${block.blockName}`, 14, finalY);
//         finalY += 6;

//         const lowSchoolsData = block.lowRegistrationSchools.map((school, idx) => [
//           (idx + 1).toString(),
//           school.schoolName,
//           school.registrationCount.toString()
//         ]);

//         pdf.autoTable({
//           startY: finalY,
//           head: [['#', 'School Name', 'Count']],
//           body: lowSchoolsData,
//           theme: 'grid',
//           headStyles: { fillColor: [220, 53, 69] },
//           styles: { fontSize: 8 },
//           margin: { left: 20 }
//         });

//         finalY = pdf.lastAutoTable.finalY + 5;
//       });
//     }

//     // Footer
//     pdf.setFontSize(8);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 20, 290, { align: "right" });

//     return pdf;
//   };

//   // Generate Block-School PDF
//   const generateBlockSchoolPDF = (block, classType) => {
//     const pdf = new jsPDF();
//     const pageWidth = pdf.internal.pageSize.getWidth();
    
//     // Title
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(`Block: ${block.blockName}`, pageWidth / 2, 15, { align: "center" });
    
//     // Total Registration
//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`Total Registrations (Class ${classType}): ${block.totalRegistered}`, pageWidth / 2, 25, { align: "center" });
    
//     // Schools table
//     pdf.autoTable({
//       startY: 35,
//       head: [['#', 'School Name', 'Registration Count']],
//       body: block.schools.map((school, index) => [
//         index + 1,
//         school.schoolName,
//         school.registered.toString()
//       ]),
//       theme: 'grid',
//       headStyles: { fillColor: [66, 139, 202] },
//       styles: { fontSize: 10 }
//     });

//     // Footer
//     pdf.setFontSize(8);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 20, 290, { align: "right" });

//     return pdf;
//   };

//   // Download District-Block Reports
//   const downloadDistrictBlockReports = async (classType) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const response = await MainDashBoard();
//       const mainData = response.data;
      
//       const { districts } = processDashboardData(mainData, classType);
      
//       if (districts.length === 0) {
//         setError("No district data available for download.");
//         return;
//       }

//       const zip = new JSZip();
//       const folder = zip.folder(`class-${classType}-district-block-reports`);

//       districts.forEach(district => {
//         const pdf = generateDistrictBlockPDF(district, classType);
//         const fileName = `${district.districtName.replace(/[^a-zA-Z0-9]/g, '_')}_class_${classType}.pdf`;
//         folder.file(fileName, pdf.output('blob'));
//       });

//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, `class-${classType}-district-block-reports.zip`);
      
//       setSuccess(`Successfully downloaded ${districts.length} district reports for Class ${classType}`);
      
//     } catch (err) {
//       console.error("Download error:", err);
//       setError(err?.message || "Failed to download reports");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Download Block-School Reports
//   const downloadBlockSchoolReports = async (classType) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const response = await MainDashBoard();
//       const mainData = response.data;
      
//       const { blocks } = processDashboardData(mainData, classType);
      
//       if (blocks.length === 0) {
//         setError("No block data available for download.");
//         return;
//       }

//       const zip = new JSZip();
//       const folder = zip.folder(`class-${classType}-block-school-reports`);

//       blocks.forEach(block => {
//         const pdf = generateBlockSchoolPDF(block, classType);
//         const fileName = `${block.blockName.replace(/[^a-zA-Z0-9]/g, '_')}_class_${classType}.pdf`;
//         folder.file(fileName, pdf.output('blob'));
//       });

//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, `class-${classType}-block-school-reports.zip`);
      
//       setSuccess(`Successfully downloaded ${blocks.length} block reports for Class ${classType}`);
      
//     } catch (err) {
//       console.error("Download error:", err);
//       setError(err?.message || "Failed to download reports");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="py-4">
//       <Card>
//         <Card.Header>
//           <h4 className="mb-0">Download Dashboard Reports</h4>
//         </Card.Header>
//         <Card.Body>
//           <p className="text-muted mb-4">
//             Download comprehensive PDF reports for Class 8 and Class 10 registrations. 
//             Reports will be downloaded as ZIP files containing individual PDFs for each district/block.
//           </p>

//           {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
//           {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

//           <Row className="g-3">
//             {/* Class 8 Reports */}
//             <Col md={6}>
//               <Card className="h-100 border-primary">
//                 <Card.Header className="bg-primary text-white">
//                   <h5 className="mb-0">Class 8 Reports</h5>
//                 </Card.Header>
//                 <Card.Body className="d-flex flex-column">
//                   <div className="mb-3">
//                     <h6>District-Block Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each district showing block-wise registration counts and schools with ≤5 registrations.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => downloadDistrictBlockReports('8')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download District-Block Reports'}
//                   </Button>

//                   <hr />

//                   <div className="mb-3">
//                     <h6>Block-School Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each block showing school-wise registration counts.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => downloadBlockSchoolReports('8')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download Block-School Reports'}
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Class 10 Reports */}
//             <Col md={6}>
//               <Card className="h-100 border-success">
//                 <Card.Header className="bg-success text-white">
//                   <h5 className="mb-0">Class 10 Reports</h5>
//                 </Card.Header>
//                 <Card.Body className="d-flex flex-column">
//                   <div className="mb-3">
//                     <h6>District-Block Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each district showing block-wise registration counts and schools with ≤5 registrations.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-success" 
//                     onClick={() => downloadDistrictBlockReports('10')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download District-Block Reports'}
//                   </Button>

//                   <hr />

//                   <div className="mb-3">
//                     <h6>Block-School Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each block showing school-wise registration counts.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-success" 
//                     onClick={() => downloadBlockSchoolReports('10')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download Block-School Reports'}
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* Report Format Information */}
//           <Card className="mt-4 bg-light">
//             <Card.Body>
//               <h6>Report Format Details:</h6>
//               <ul className="mb-0 small">
//                 <li><strong>District-Block Reports:</strong> Each PDF contains district summary, block-wise counts, and list of schools with ≤5 registrations</li>
//                 <li><strong>Block-School Reports:</strong> Each PDF contains block summary and school-wise registration counts</li>
//                 <li>All reports are sorted by registration count (descending)</li>
//                 <li>Files are organized in ZIP format for easy download</li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };











// // src/components/Dashboards/DownloadDashboardReports.jsx
// import React, { useState } from "react";
// import { Container, Card, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const DownloadDashboardReports = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Process main dashboard data for reports
//   const processDashboardData = (mainData, classType) => {
//     if (!mainData || !Array.isArray(mainData)) return { districts: {}, blocks: {} };

//     const districtsMap = {};
//     const blocksMap = {};

//     mainData.forEach(school => {
//       const districtId = String(school?.districtId || "").trim();
//       const districtName = school?.districtName || `District ${districtId}`;
//       const blockId = String(school?.blockId || "").trim();
//       const blockName = school?.blockName || `Block ${blockId}`;
//       const schoolId = String(school?.centerId || "").trim();
//       const schoolName = school?.centerName || `School ${schoolId}`;
      
//       const registrationCount = classType === '8' 
//         ? Number(school?.registrationCount8 || 0)
//         : Number(school?.registrationCount10 || 0);

//       if (!districtId || !blockId) return;

//       // Process districts
//       if (!districtsMap[districtId]) {
//         districtsMap[districtId] = {
//           districtId,
//           districtName,
//           totalRegistered: 0,
//           blocks: {}
//         };
//       }

//       districtsMap[districtId].totalRegistered += registrationCount;

//       // Process blocks within districts
//       if (!districtsMap[districtId].blocks[blockId]) {
//         districtsMap[districtId].blocks[blockId] = {
//           blockId,
//           blockName,
//           registered: 0,
//           lowRegistrationSchools: []
//         };
//       }

//       districtsMap[districtId].blocks[blockId].registered += registrationCount;

//       // Track schools with low registration (<= 5)
//       if (registrationCount <= 5) {
//         districtsMap[districtId].blocks[blockId].lowRegistrationSchools.push({
//           schoolName,
//           registrationCount
//         });
//       }

//       // Process blocks independently for block-school reports
//       if (!blocksMap[blockId]) {
//         blocksMap[blockId] = {
//           blockId,
//           blockName,
//           totalRegistered: 0,
//           schools: {}
//         };
//       }

//       blocksMap[blockId].totalRegistered += registrationCount;

//       if (!blocksMap[blockId].schools[schoolId]) {
//         blocksMap[blockId].schools[schoolId] = {
//           schoolId,
//           schoolName,
//           registered: 0
//         };
//       }

//       blocksMap[blockId].schools[schoolId].registered += registrationCount;
//     });

//     // Convert maps to sorted arrays
//     const districts = Object.values(districtsMap).map(district => ({
//       ...district,
//       blocks: Object.values(district.blocks).sort((a, b) => b.registered - a.registered)
//     })).sort((a, b) => b.totalRegistered - a.totalRegistered);

//     const blocks = Object.values(blocksMap).map(block => ({
//       ...block,
//       schools: Object.values(block.schools).sort((a, b) => b.registered - a.registered)
//     })).sort((a, b) => b.totalRegistered - a.totalRegistered);

//     return { districts, blocks };
//   };

//   // Generate District-Block PDF
//   const generateDistrictBlockPDF = (district, classType) => {
//     const pdf = new jsPDF();
//     const pageWidth = pdf.internal.pageSize.getWidth();
    
//     // Date at top
//     const currentDate = new Date().toLocaleDateString();
//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(`Report Date: ${currentDate}`, pageWidth - 20, 10, { align: "right" });
    
//     // Title
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(`District: ${district.districtName}`, pageWidth / 2, 20, { align: "center" });
    
//     // Total Registration
//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`Total Registrations (Class ${classType}): ${district.totalRegistered}`, pageWidth / 2, 30, { align: "center" });
    
//     // Header for blocks table
//     pdf.autoTable({
//       startY: 40,
//       head: [['#', 'Block Name', 'Registration Count']],
//       body: district.blocks.map((block, index) => [
//         index + 1,
//         block.blockName,
//         block.registered.toString()
//       ]),
//       theme: 'grid',
//       headStyles: { fillColor: [66, 139, 202] },
//       styles: { fontSize: 10 }
//     });

//     let finalY = pdf.lastAutoTable.finalY + 10;

//     // Low registration schools section
//     const lowRegistrationBlocks = district.blocks.filter(block => 
//       block.lowRegistrationSchools && block.lowRegistrationSchools.length > 0
//     );

//     if (lowRegistrationBlocks.length > 0) {
//       pdf.setFontSize(12);
//       pdf.setFont("helvetica", "bold");
//       pdf.text("Schools with 5 or fewer registrations:", 14, finalY);
//       finalY += 8;

//       lowRegistrationBlocks.forEach(block => {
//         // Check if we need a new page
//         if (finalY > 250) {
//           pdf.addPage();
//           finalY = 20;
//         }

//         pdf.setFontSize(10);
//         pdf.setFont("helvetica", "bold");
//         pdf.text(`Block: ${block.blockName}`, 14, finalY);
//         finalY += 6;

//         // Sort low registration schools in descending order
//         const sortedLowSchools = [...block.lowRegistrationSchools].sort((a, b) => b.registrationCount - a.registrationCount);
        
//         const lowSchoolsData = sortedLowSchools.map((school, idx) => [
//           (idx + 1).toString(),
//           school.schoolName,
//           school.registrationCount.toString()
//         ]);

//         pdf.autoTable({
//           startY: finalY,
//           head: [['#', 'School Name', 'Count']],
//           body: lowSchoolsData,
//           theme: 'grid',
//           headStyles: { fillColor: [220, 53, 69] },
//           styles: { fontSize: 8 },
//           margin: { left: 20 }
//         });

//         finalY = pdf.lastAutoTable.finalY + 5;
//       });
//     }

//     // Footer
//     pdf.setFontSize(8);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 20, 290, { align: "right" });

//     return pdf;
//   };

//   // Generate Block-School PDF
//   const generateBlockSchoolPDF = (block, classType) => {
//     const pdf = new jsPDF();
//     const pageWidth = pdf.internal.pageSize.getWidth();
    
//     // Date at top
//     const currentDate = new Date().toLocaleDateString();
//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(`Report Date: ${currentDate}`, pageWidth - 20, 10, { align: "right" });
    
//     // Title
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(`Block: ${block.blockName}`, pageWidth / 2, 20, { align: "center" });
    
//     // Total Registration
//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`Total Registrations (Class ${classType}): ${block.totalRegistered}`, pageWidth / 2, 30, { align: "center" });
    
//     // Schools table
//     pdf.autoTable({
//       startY: 40,
//       head: [['#', 'School Name', 'Registration Count']],
//       body: block.schools.map((school, index) => [
//         index + 1,
//         school.schoolName,
//         school.registered.toString()
//       ]),
//       theme: 'grid',
//       headStyles: { fillColor: [66, 139, 202] },
//       styles: { fontSize: 10 }
//     });

//     // Footer
//     pdf.setFontSize(8);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 20, 290, { align: "right" });

//     return pdf;
//   };

//   // Download District-Block Reports
//   const downloadDistrictBlockReports = async (classType) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const response = await MainDashBoard();
//       const mainData = response.data;
      
//       const { districts } = processDashboardData(mainData, classType);
      
//       if (districts.length === 0) {
//         setError("No district data available for download.");
//         return;
//       }

//       const zip = new JSZip();
//       const folder = zip.folder(`class-${classType}-district-block-reports`);

//       districts.forEach(district => {
//         const pdf = generateDistrictBlockPDF(district, classType);
//         const fileName = `${district.districtName.replace(/[^a-zA-Z0-9]/g, '_')}_class_${classType}.pdf`;
//         folder.file(fileName, pdf.output('blob'));
//       });

//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, `class-${classType}-district-block-reports.zip`);
      
//       setSuccess(`Successfully downloaded ${districts.length} district reports for Class ${classType}`);
      
//     } catch (err) {
//       console.error("Download error:", err);
//       setError(err?.message || "Failed to download reports");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Download Block-School Reports
//   const downloadBlockSchoolReports = async (classType) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const response = await MainDashBoard();
//       const mainData = response.data;
      
//       const { blocks } = processDashboardData(mainData, classType);
      
//       if (blocks.length === 0) {
//         setError("No block data available for download.");
//         return;
//       }

//       const zip = new JSZip();
//       const folder = zip.folder(`class-${classType}-block-school-reports`);

//       blocks.forEach(block => {
//         const pdf = generateBlockSchoolPDF(block, classType);
//         const fileName = `${block.blockName.replace(/[^a-zA-Z0-9]/g, '_')}_class_${classType}.pdf`;
//         folder.file(fileName, pdf.output('blob'));
//       });

//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, `class-${classType}-block-school-reports.zip`);
      
//       setSuccess(`Successfully downloaded ${blocks.length} block reports for Class ${classType}`);
      
//     } catch (err) {
//       console.error("Download error:", err);
//       setError(err?.message || "Failed to download reports");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="py-4">
//       <Card>
//         <Card.Header>
//           <h4 className="mb-0">Download Dashboard Reports</h4>
//         </Card.Header>
//         <Card.Body>
//           <p className="text-muted mb-4">
//             Download comprehensive PDF reports for Class 8 and Class 10 registrations. 
//             Reports will be downloaded as ZIP files containing individual PDFs for each district/block.
//           </p>

//           {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
//           {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

//           <Row className="g-3">
//             {/* Class 8 Reports */}
//             <Col md={6}>
//               <Card className="h-100 border-primary">
//                 <Card.Header className="bg-primary text-white">
//                   <h5 className="mb-0">Class 8 Reports</h5>
//                 </Card.Header>
//                 <Card.Body className="d-flex flex-column">
//                   <div className="mb-3">
//                     <h6>District-Block Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each district showing block-wise registration counts and schools with ≤5 registrations.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => downloadDistrictBlockReports('8')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download District-Block Reports'}
//                   </Button>

//                   <hr />

//                   <div className="mb-3">
//                     <h6>Block-School Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each block showing school-wise registration counts.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => downloadBlockSchoolReports('8')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download Block-School Reports'}
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Class 10 Reports */}
//             <Col md={6}>
//               <Card className="h-100 border-success">
//                 <Card.Header className="bg-success text-white">
//                   <h5 className="mb-0">Class 10 Reports</h5>
//                 </Card.Header>
//                 <Card.Body className="d-flex flex-column">
//                   <div className="mb-3">
//                     <h6>District-Block Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each district showing block-wise registration counts and schools with ≤5 registrations.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-success" 
//                     onClick={() => downloadDistrictBlockReports('10')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download District-Block Reports'}
//                   </Button>

//                   <hr />

//                   <div className="mb-3">
//                     <h6>Block-School Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each block showing school-wise registration counts.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-success" 
//                     onClick={() => downloadBlockSchoolReports('10')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download Block-School Reports'}
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* Report Format Information */}
//           <Card className="mt-4 bg-light">
//             <Card.Body>
//               <h6>Report Format Details:</h6>
//               <ul className="mb-0 small">
//                 <li><strong>District-Block Reports:</strong> Each PDF contains district summary, block-wise counts, and list of schools with ≤5 registrations</li>
//                 <li><strong>Block-School Reports:</strong> Each PDF contains block summary and school-wise registration counts</li>
//                 <li>All reports are sorted by registration count (descending)</li>
//                 <li>Files are organized in ZIP format for easy download</li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

























// // src/components/Dashboards/DownloadDashboardReports.jsx
// import React, { useState } from "react";
// import { Container, Card, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

// export const DownloadDashboardReports = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Process main dashboard data for reports
//   const processDashboardData = (mainData, classType) => {
//     if (!mainData || !Array.isArray(mainData)) return { districts: {}, blocks: {} };

//     const districtsMap = {};
//     const blocksMap = {};

//     mainData.forEach(school => {
//       const districtId = String(school?.districtId || "").trim();
//       const districtName = school?.districtName || `District ${districtId}`;
//       const blockId = String(school?.blockId || "").trim();
//       const blockName = school?.blockName || `Block ${blockId}`;
//       const schoolId = String(school?.centerId || "").trim();
//       const schoolName = school?.centerName || `School ${schoolId}`;
      
//       const registrationCount = classType === '8' 
//         ? Number(school?.registrationCount8 || 0)
//         : Number(school?.registrationCount10 || 0);

//       if (!districtId || !blockId) return;

//       // Process districts
//       if (!districtsMap[districtId]) {
//         districtsMap[districtId] = {
//           districtId,
//           districtName,
//           totalRegistered: 0,
//           totalSchools: 0,
//           totalLowRegistrationSchools: 0,
//           blocks: {}
//         };
//       }

//       districtsMap[districtId].totalRegistered += registrationCount;
//       districtsMap[districtId].totalSchools += 1;

//       // Process blocks within districts
//       if (!districtsMap[districtId].blocks[blockId]) {
//         districtsMap[districtId].blocks[blockId] = {
//           blockId,
//           blockName,
//           registered: 0,
//           lowRegistrationSchools: []
//         };
//       }

//       districtsMap[districtId].blocks[blockId].registered += registrationCount;

//       // Track schools with low registration (<= 5)
//       if (registrationCount <= 5) {
//         districtsMap[districtId].blocks[blockId].lowRegistrationSchools.push({
//           schoolName,
//           registrationCount
//         });
//         districtsMap[districtId].totalLowRegistrationSchools += 1;
//       }

//       // Process blocks independently for block-school reports
//       if (!blocksMap[blockId]) {
//         blocksMap[blockId] = {
//           blockId,
//           blockName,
//           totalRegistered: 0,
//           schools: {}
//         };
//       }

//       blocksMap[blockId].totalRegistered += registrationCount;

//       if (!blocksMap[blockId].schools[schoolId]) {
//         blocksMap[blockId].schools[schoolId] = {
//           schoolId,
//           schoolName,
//           registered: 0
//         };
//       }

//       blocksMap[blockId].schools[schoolId].registered += registrationCount;
//     });

//     // Convert maps to sorted arrays
//     const districts = Object.values(districtsMap).map(district => ({
//       ...district,
//       blocks: Object.values(district.blocks).sort((a, b) => b.registered - a.registered)
//     })).sort((a, b) => b.totalRegistered - a.totalRegistered);

//     const blocks = Object.values(blocksMap).map(block => ({
//       ...block,
//       schools: Object.values(block.schools).sort((a, b) => b.registered - a.registered)
//     })).sort((a, b) => b.totalRegistered - a.totalRegistered);

//     return { districts, blocks };
//   };

//   // Generate District-Block PDF
//   const generateDistrictBlockPDF = (district, classType) => {
//     const pdf = new jsPDF();
//     const pageWidth = pdf.internal.pageSize.getWidth();
    
//     // Date at top
//     const currentDate = new Date().toLocaleDateString();
//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(`Report Date: ${currentDate}`, pageWidth - 20, 10, { align: "right" });
    
//     // Title
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(`District: ${district.districtName}`, pageWidth / 2, 20, { align: "center" });
    
//     // Total Registration
//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`Total Registrations (Class ${classType}): ${district.totalRegistered}`, pageWidth / 2, 30, { align: "center" });
    
//     // Header for blocks table
//     pdf.autoTable({
//       startY: 40,
//       head: [['#', 'Block Name', 'Registration Count']],
//       body: district.blocks.map((block, index) => [
//         index + 1,
//         block.blockName,
//         block.registered.toString()
//       ]),
//       theme: 'grid',
//       headStyles: { fillColor: [66, 139, 202] },
//       styles: { fontSize: 10 }
//     });

//     let finalY = pdf.lastAutoTable.finalY + 10;

//     // Low registration schools section
//     const lowRegistrationBlocks = district.blocks.filter(block => 
//       block.lowRegistrationSchools && block.lowRegistrationSchools.length > 0
//     );

//     if (lowRegistrationBlocks.length > 0) {
//   // Center aligned heading with counts
//   pdf.setFontSize(14);
//   pdf.setFont("helvetica", "bold");
//   const headingText1 = "Schools with 5 or less registrations";
//   const headingText2 = `(Total Schools: ${district.totalSchools}, Low Registration Schools: ${district.totalLowRegistrationSchools})`;
  
//   pdf.text(headingText1, pageWidth / 2, finalY, { align: "center" });
//   finalY += 6;
//   pdf.text(headingText2, pageWidth / 2, finalY, { align: "center" });
//   finalY += 10;

//   lowRegistrationBlocks.forEach(block => {
//     // Check if we need a new page
//     if (finalY > 250) {
//       pdf.addPage();
//       finalY = 20;
//     }

//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(`Block: ${block.blockName}`, 14, finalY);
//     finalY += 6;

//     // Sort low registration schools in descending order
//     const sortedLowSchools = [...block.lowRegistrationSchools].sort((a, b) => b.registrationCount - a.registrationCount);
    
//     const lowSchoolsData = sortedLowSchools.map((school, idx) => [
//       (idx + 1).toString(),
//       school.schoolName,
//       school.registrationCount.toString()
//     ]);

//     pdf.autoTable({
//       startY: finalY,
//       head: [['#', 'School Name', 'Count']],
//       body: lowSchoolsData,
//       theme: 'grid',
//       headStyles: { fillColor: [220, 53, 69] },
//       styles: { fontSize: 8 },
//       margin: { left: 20 }
//     });

//     finalY = pdf.lastAutoTable.finalY + 5;
//   });
// }

//     // Footer
//     pdf.setFontSize(8);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 20, 290, { align: "right" });

//     return pdf;
//   };

//   // Generate Block-School PDF
//   const generateBlockSchoolPDF = (block, classType) => {
//     const pdf = new jsPDF();
//     const pageWidth = pdf.internal.pageSize.getWidth();
    
//     // Date at top
//     const currentDate = new Date().toLocaleDateString();
//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(`Report Date: ${currentDate}`, pageWidth - 20, 10, { align: "right" });
    
//     // Title
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(`Block: ${block.blockName}`, pageWidth / 2, 20, { align: "center" });
    
//     // Total Registration
//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(`Total Registrations (Class ${classType}): ${block.totalRegistered}`, pageWidth / 2, 30, { align: "center" });
    
//     // Schools table
//     pdf.autoTable({
//       startY: 40,
//       head: [['#', 'School Name', 'Registration Count']],
//       body: block.schools.map((school, index) => [
//         index + 1,
//         school.schoolName,
//         school.registered.toString()
//       ]),
//       theme: 'grid',
//       headStyles: { fillColor: [66, 139, 202] },
//       styles: { fontSize: 10 }
//     });

//     // Footer
//     pdf.setFontSize(8);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 20, 290, { align: "right" });

//     return pdf;
//   };

//   // Download District-Block Reports
//   const downloadDistrictBlockReports = async (classType) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const response = await MainDashBoard();
//       const mainData = response.data;
      
//       const { districts } = processDashboardData(mainData, classType);
      
//       if (districts.length === 0) {
//         setError("No district data available for download.");
//         return;
//       }

//       const zip = new JSZip();
//       const folder = zip.folder(`class-${classType}-district-block-reports`);

//       districts.forEach(district => {
//         const pdf = generateDistrictBlockPDF(district, classType);
//         const fileName = `${district.districtName.replace(/[^a-zA-Z0-9]/g, '_')}_class_${classType}.pdf`;
//         folder.file(fileName, pdf.output('blob'));
//       });

//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, `class-${classType}-district-block-reports.zip`);
      
//       setSuccess(`Successfully downloaded ${districts.length} district reports for Class ${classType}`);
      
//     } catch (err) {
//       console.error("Download error:", err);
//       setError(err?.message || "Failed to download reports");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Download Block-School Reports
//   const downloadBlockSchoolReports = async (classType) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const response = await MainDashBoard();
//       const mainData = response.data;
      
//       const { blocks } = processDashboardData(mainData, classType);
      
//       if (blocks.length === 0) {
//         setError("No block data available for download.");
//         return;
//       }

//       const zip = new JSZip();
//       const folder = zip.folder(`class-${classType}-block-school-reports`);

//       blocks.forEach(block => {
//         const pdf = generateBlockSchoolPDF(block, classType);
//         const fileName = `${block.blockName.replace(/[^a-zA-Z0-9]/g, '_')}_class_${classType}.pdf`;
//         folder.file(fileName, pdf.output('blob'));
//       });

//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, `class-${classType}-block-school-reports.zip`);
      
//       setSuccess(`Successfully downloaded ${blocks.length} block reports for Class ${classType}`);
      
//     } catch (err) {
//       console.error("Download error:", err);
//       setError(err?.message || "Failed to download reports");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="py-4">
//       <Card>
//         <Card.Header>
//           <h4 className="mb-0">Download Dashboard Reports</h4>
//         </Card.Header>
//         <Card.Body>
//           <p className="text-muted mb-4">
//             Download comprehensive PDF reports for Class 8 and Class 10 registrations. 
//             Reports will be downloaded as ZIP files containing individual PDFs for each district/block.
//           </p>

//           {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
//           {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

//           <Row className="g-3">
//             {/* Class 8 Reports */}
//             <Col md={6}>
//               <Card className="h-100 border-primary">
//                 <Card.Header className="bg-primary text-white">
//                   <h5 className="mb-0">Class 8 Reports</h5>
//                 </Card.Header>
//                 <Card.Body className="d-flex flex-column">
//                   <div className="mb-3">
//                     <h6>District-Block Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each district showing block-wise registration counts and schools with ≤5 registrations.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => downloadDistrictBlockReports('8')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download District-Block Reports'}
//                   </Button>

//                   <hr />

//                   <div className="mb-3">
//                     <h6>Block-School Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each block showing school-wise registration counts.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => downloadBlockSchoolReports('8')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download Block-School Reports'}
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Class 10 Reports */}
//             <Col md={6}>
//               <Card className="h-100 border-success">
//                 <Card.Header className="bg-success text-white">
//                   <h5 className="mb-0">Class 10 Reports</h5>
//                 </Card.Header>
//                 <Card.Body className="d-flex flex-column">
//                   <div className="mb-3">
//                     <h6>District-Block Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each district showing block-wise registration counts and schools with ≤5 registrations.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-success" 
//                     onClick={() => downloadDistrictBlockReports('10')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download District-Block Reports'}
//                   </Button>

//                   <hr />

//                   <div className="mb-3">
//                     <h6>Block-School Reports</h6>
//                     <p className="small text-muted">
//                       Individual PDFs for each block showing school-wise registration counts.
//                     </p>
//                   </div>
//                   <Button 
//                     variant="outline-success" 
//                     onClick={() => downloadBlockSchoolReports('10')}
//                     disabled={loading}
//                     className="mt-auto"
//                   >
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Download Block-School Reports'}
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* Report Format Information */}
//           <Card className="mt-4 bg-light">
//             <Card.Body>
//               <h6>Report Format Details:</h6>
//               <ul className="mb-0 small">
//                 <li><strong>District-Block Reports:</strong> Each PDF contains district summary, block-wise counts, and list of schools with ≤5 registrations</li>
//                 <li><strong>Block-School Reports:</strong> Each PDF contains block summary and school-wise registration counts</li>
//                 <li>All reports are sorted by registration count (descending)</li>
//                 <li>Files are organized in ZIP format for easy download</li>
//               </ul>
//             </Card.Body>
//           </Card>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };












// src/components/Dashboards/DownloadDashboardReports.jsx
import React, { useState } from "react";
import { Container, Card, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

export const DownloadDashboardReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Process main dashboard data for reports
  const processDashboardData = (mainData, classType) => {
    if (!mainData || !Array.isArray(mainData)) return { districts: {}, blocks: {} };

    const districtsMap = {};
    const blocksMap = {};

    mainData.forEach(school => {
      const districtId = String(school?.districtId || "").trim();
      const districtName = school?.districtName || `District ${districtId}`;
      const blockId = String(school?.blockId || "").trim();
      const blockName = school?.blockName || `Block ${blockId}`;
      const schoolId = String(school?.centerId || "").trim();
      const schoolName = school?.centerName || `School ${schoolId}`;
      
      const registrationCount = classType === '8' 
        ? Number(school?.registrationCount8 || 0)
        : Number(school?.registrationCount10 || 0);

      if (!districtId || !blockId) return;

      // Process districts
      if (!districtsMap[districtId]) {
        districtsMap[districtId] = {
          districtId,
          districtName,
          totalRegistered: 0,
          totalSchools: 0,
          totalLowRegistrationSchools: 0,
          blocks: {}
        };
      }

      districtsMap[districtId].totalRegistered += registrationCount;
      districtsMap[districtId].totalSchools += 1;

      // Process blocks within districts
      if (!districtsMap[districtId].blocks[blockId]) {
        districtsMap[districtId].blocks[blockId] = {
          blockId,
          blockName,
          registered: 0,
          lowRegistrationSchools: []
        };
      }

      districtsMap[districtId].blocks[blockId].registered += registrationCount;

      // Track schools with low registration (<= 5)
      if (registrationCount <= 5) {
        districtsMap[districtId].blocks[blockId].lowRegistrationSchools.push({
          schoolName,
          registrationCount
        });
        districtsMap[districtId].totalLowRegistrationSchools += 1;
      }

      // Process blocks independently for block-school reports
      if (!blocksMap[blockId]) {
        blocksMap[blockId] = {
          blockId,
          blockName,
          totalRegistered: 0,
          schools: {}
        };
      }

      blocksMap[blockId].totalRegistered += registrationCount;

      if (!blocksMap[blockId].schools[schoolId]) {
        blocksMap[blockId].schools[schoolId] = {
          schoolId,
          schoolName,
          registered: 0
        };
      }

      blocksMap[blockId].schools[schoolId].registered += registrationCount;
    });

    // Convert maps to sorted arrays
    const districts = Object.values(districtsMap).map(district => ({
      ...district,
      blocks: Object.values(district.blocks).sort((a, b) => b.registered - a.registered)
    })).sort((a, b) => b.totalRegistered - a.totalRegistered);

    const blocks = Object.values(blocksMap).map(block => ({
      ...block,
      schools: Object.values(block.schools).sort((a, b) => b.registered - a.registered)
    })).sort((a, b) => b.totalRegistered - a.totalRegistered);

    return { districts, blocks };
  };

  // Generate District-Block PDF
  const generateDistrictBlockPDF = (district, classType) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Title
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(`District: ${district.districtName}`, pageWidth / 2, 20, { align: "center" });
    
    // Total Registration
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Total Registrations (Class ${classType}): ${district.totalRegistered}`, pageWidth / 2, 30, { align: "center" });
    
    // Date below Total Registration
    const currentDate = new Date().toLocaleDateString();
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.text(`Report Date: ${currentDate}`, pageWidth / 2, 37, { align: "center" });
    
    // Header for blocks table
    pdf.autoTable({
      startY: 45,
      head: [['#', 'Block Name', 'Registration Count']],
      body: district.blocks.map((block, index) => [
        index + 1,
        block.blockName,
        block.registered.toString()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      styles: { fontSize: 10 }
    });

    let finalY = pdf.lastAutoTable.finalY + 10;

    // Low registration schools section
    const lowRegistrationBlocks = district.blocks.filter(block => 
      block.lowRegistrationSchools && block.lowRegistrationSchools.length > 0
    );

    if (lowRegistrationBlocks.length > 0) {
  // Center aligned heading with counts
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  const headingText1 = "Schools with 5 or less registrations";
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  const headingText2 = `(Total Schools: ${district.totalSchools}, Low Registration Schools: ${district.totalLowRegistrationSchools})`;
  
  pdf.text(headingText1, pageWidth / 2, finalY, { align: "center" });
  finalY += 6;
  pdf.text(headingText2, pageWidth / 2, finalY, { align: "center" });
  finalY += 10;

  lowRegistrationBlocks.forEach(block => {
    // Check if we need a new page
    if (finalY > 250) {
      pdf.addPage();
      finalY = 20;
    }

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Block: ${block.blockName}`, 14, finalY);
    finalY += 6;

    // Sort low registration schools in descending order
    const sortedLowSchools = [...block.lowRegistrationSchools].sort((a, b) => b.registrationCount - a.registrationCount);
    
    const lowSchoolsData = sortedLowSchools.map((school, idx) => [
      (idx + 1).toString(),
      school.schoolName,
      school.registrationCount.toString()
    ]);

    pdf.autoTable({
      startY: finalY,
      head: [['#', 'School Name', 'Count']],
      body: lowSchoolsData,
      theme: 'grid',
      headStyles: { fillColor: [220, 53, 69] },
      styles: { fontSize: 8 },
      margin: { left: 20 }
    });

    finalY = pdf.lastAutoTable.finalY + 5;
  });
}

    return pdf;
  };

  // Generate Block-School PDF
  const generateBlockSchoolPDF = (block, classType) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Title
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Block: ${block.blockName}`, pageWidth / 2, 20, { align: "center" });
    
    // Total Registration
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Total Registrations (Class ${classType}): ${block.totalRegistered}`, pageWidth / 2, 30, { align: "center" });
    
    // Date below Total Registration
    const currentDate = new Date().toLocaleDateString();
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.text(`Date: ${currentDate}`, pageWidth / 2, 37, { align: "center" });
    
    // Schools table
    pdf.autoTable({
      startY: 45,
      head: [['#', 'School Name', 'Registration Count']],
      body: block.schools.map((school, index) => [
        index + 1,
        school.schoolName,
        school.registered.toString()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      styles: { fontSize: 10 }
    });

    return pdf;
  };

  // Download District-Block Reports
  const downloadDistrictBlockReports = async (classType) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await MainDashBoard();
      const mainData = response.data;
      
      const { districts } = processDashboardData(mainData, classType);
      
      if (districts.length === 0) {
        setError("No district data available for download.");
        return;
      }

      const zip = new JSZip();
      const folder = zip.folder(`class-${classType}-district-block-reports`);

      districts.forEach(district => {
        const pdf = generateDistrictBlockPDF(district, classType);
        const fileName = `${district.districtName.replace(/[^a-zA-Z0-9]/g, '_')}_class_${classType}.pdf`;
        folder.file(fileName, pdf.output('blob'));
      });

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `class-${classType}-district-block-reports.zip`);
      
      setSuccess(`Successfully downloaded ${districts.length} district reports for Class ${classType}`);
      
    } catch (err) {
      console.error("Download error:", err);
      setError(err?.message || "Failed to download reports");
    } finally {
      setLoading(false);
    }
  };

  // Download Block-School Reports
  const downloadBlockSchoolReports = async (classType) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await MainDashBoard();
      const mainData = response.data;
      
      const { blocks } = processDashboardData(mainData, classType);
      
      if (blocks.length === 0) {
        setError("No block data available for download.");
        return;
      }

      const zip = new JSZip();
      const folder = zip.folder(`class-${classType}-block-school-reports`);

      blocks.forEach(block => {
        const pdf = generateBlockSchoolPDF(block, classType);
        const fileName = `${block.blockName.replace(/[^a-zA-Z0-9]/g, '_')}_class_${classType}.pdf`;
        folder.file(fileName, pdf.output('blob'));
      });

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `class-${classType}-block-school-reports.zip`);
      
      setSuccess(`Successfully downloaded ${blocks.length} block reports for Class ${classType}`);
      
    } catch (err) {
      console.error("Download error:", err);
      setError(err?.message || "Failed to download reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Download Dashboard Reports</h4>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-4">
            Download comprehensive PDF reports for Class 8 and Class 10 registrations. 
            Reports will be downloaded as ZIP files containing individual PDFs for each district/block.
          </p>

          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

          <Row className="g-3">
            {/* Class 8 Reports */}
            <Col md={6}>
              <Card className="h-100 border-primary">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Class 8 Reports</h5>
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  <div className="mb-3">
                    <h6>District-Block Reports</h6>
                    <p className="small text-muted">
                      Individual PDFs for each district showing block-wise registration counts and schools with ≤5 registrations.
                    </p>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => downloadDistrictBlockReports('8')}
                    disabled={loading}
                    className="mt-auto"
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Download District-Block Reports'}
                  </Button>

                  <hr />

                  <div className="mb-3">
                    <h6>Block-School Reports</h6>
                    <p className="small text-muted">
                      Individual PDFs for each block showing school-wise registration counts.
                    </p>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => downloadBlockSchoolReports('8')}
                    disabled={loading}
                    className="mt-auto"
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Download Block-School Reports'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Class 10 Reports */}
            <Col md={6}>
              <Card className="h-100 border-success">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">Class 10 Reports</h5>
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  <div className="mb-3">
                    <h6>District-Block Reports</h6>
                    <p className="small text-muted">
                      Individual PDFs for each district showing block-wise registration counts and schools with ≤5 registrations.
                    </p>
                  </div>
                  <Button 
                    variant="outline-success" 
                    onClick={() => downloadDistrictBlockReports('10')}
                    disabled={loading}
                    className="mt-auto"
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Download District-Block Reports'}
                  </Button>

                  <hr />

                  <div className="mb-3">
                    <h6>Block-School Reports</h6>
                    <p className="small text-muted">
                      Individual PDFs for each block showing school-wise registration counts.
                    </p>
                  </div>
                  <Button 
                    variant="outline-success" 
                    onClick={() => downloadBlockSchoolReports('10')}
                    disabled={loading}
                    className="mt-auto"
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Download Block-School Reports'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Report Format Information */}
          <Card className="mt-4 bg-light">
            <Card.Body>
              <h6>Report Format Details:</h6>
              <ul className="mb-0 small">
                <li><strong>District-Block Reports:</strong> Each PDF contains district summary, block-wise counts, and list of schools with ≤5 registrations</li>
                <li><strong>Block-School Reports:</strong> Each PDF contains block summary and school-wise registration counts</li>
                <li>All reports are sorted by registration count (descending)</li>
                <li>Files are organized in ZIP format for easy download</li>
              </ul>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};