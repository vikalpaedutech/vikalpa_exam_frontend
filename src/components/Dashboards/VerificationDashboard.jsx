// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Table,
//   Button,
//   Spinner,
//   Alert,
//   Badge
// } from "react-bootstrap";
// import { getVerificationSummary } from "../../services/DashBoardServices/DashboardService";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// export const VerificationSummary = () => {
//   const [summaryData, setSummaryData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchVerificationSummary();
//   }, []);

//   const fetchVerificationSummary = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await getVerificationSummary();
//       setSummaryData(data);
//     } catch (err) {
//       setError("Failed to fetch verification summary");
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPDF = () => {
//     if (!summaryData) return;

//     const doc = new jsPDF();
    
//     // Title
//     doc.setFontSize(16);
//     doc.text("Student Verification Summary Report", 14, 15);
    
//     // Overall Summary
//     doc.setFontSize(12);
//     doc.text(`Total Students: ${summaryData.overallSummary.totalStudents}`, 14, 25);
//     doc.text(`Verified: ${summaryData.overallSummary.totalVerified}`, 14, 32);
//     doc.text(`Pending: ${summaryData.overallSummary.totalPending}`, 14, 39);
//     doc.text(`Rejected: ${summaryData.overallSummary.totalRejected}`, 14, 46);

//     // Table data
//     const tableColumn = ["District", "Verified", "Pending", "Rejected", "Total"];
//     const tableRows = summaryData.districtWiseSummary.map(district => [
//       district.district || "Not Specified",
//       district.verified,
//       district.pending,
//       district.rejected,
//       district.total
//     ]);

//     // Add table
//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 55,
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [41, 128, 185] }
//     });

//     // Save the PDF
//     doc.save("verification-summary-report.pdf");
//   };

//   const downloadExcel = () => {
//     if (!summaryData) return;

//     // Overall summary worksheet
//     const overallData = [
//       ["Metric", "Count"],
//       ["Total Students", summaryData.overallSummary.totalStudents],
//       ["Total Verified", summaryData.overallSummary.totalVerified],
//       ["Total Pending", summaryData.overallSummary.totalPending],
//       ["Total Rejected", summaryData.overallSummary.totalRejected],
//       ["Total Districts", summaryData.totalDistricts]
//     ];

//     // District-wise data worksheet
//     const districtData = summaryData.districtWiseSummary.map(district => ({
//       "District": district.district || "Not Specified",
//       "Verified": district.verified,
//       "Pending": district.pending,
//       "Rejected": district.rejected,
//       "Total": district.total
//     }));

//     // Create workbook
//     const wb = XLSX.utils.book_new();
    
//     // Add overall summary sheet
//     const overallWS = XLSX.utils.aoa_to_sheet(overallData);
//     XLSX.utils.book_append_sheet(wb, overallWS, "Overall Summary");
    
//     // Add district-wise sheet
//     const districtWS = XLSX.utils.json_to_sheet(districtData);
//     XLSX.utils.book_append_sheet(wb, districtWS, "District Wise Summary");

//     // Save file
//     XLSX.writeFile(wb, "verification-summary-report.xlsx");
//   };

//   const getVerificationRate = (verified, total) => {
//     return total > 0 ? ((verified / total) * 100).toFixed(1) : 0;
//   };

//   if (loading) {
//     return (
//       <Container fluid className="py-4">
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-2">Loading verification summary...</p>
//         </div>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container fluid className="py-4">
//         <Alert variant="danger">
//           {error}
//           <Button variant="outline-danger" size="sm" className="ms-3" onClick={fetchVerificationSummary}>
//             Retry
//           </Button>
//         </Alert>
//       </Container>
//     );
//   }

//   if (!summaryData) {
//     return (
//       <Container fluid className="py-4">
//         <Alert variant="warning">No data available</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="py-4">
//       <Row>
//         <Col lg={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">Student Verification Summary</h4>
//               <div>
//                 <Button 
//                   variant="outline-light" 
//                   size="sm" 
//                   className="me-2"
//                   onClick={downloadPDF}
//                 >
//                   📄 Download PDF
//                 </Button>
//                 <Button 
//                   variant="outline-light" 
//                   size="sm"
//                   onClick={downloadExcel}
//                 >
//                   📊 Download Excel
//                 </Button>
//               </div>
//             </Card.Header>
//             <Card.Body>
//               {/* Overall Summary Cards */}
//               <Row className="mb-4">
//                 <Col lg={3} md={6} className="mb-3">
//                   <Card className="border-success">
//                     <Card.Body className="text-center">
//                       <h5 className="text-success">Total Students</h5>
//                       <h3>{summaryData.overallSummary.totalStudents.toLocaleString()}</h3>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//                 <Col lg={3} md={6} className="mb-3">
//                   <Card className="border-success">
//                     <Card.Body className="text-center">
//                       <h5 className="text-success">Verified</h5>
//                       <h3>{summaryData.overallSummary.totalVerified.toLocaleString()}</h3>
//                       <small className="text-muted">
//                         {getVerificationRate(summaryData.overallSummary.totalVerified, summaryData.overallSummary.totalStudents)}% Verified
//                       </small>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//                 <Col lg={3} md={6} className="mb-3">
//                   <Card className="border-warning">
//                     <Card.Body className="text-center">
//                       <h5 className="text-warning">Pending</h5>
//                       <h3>{summaryData.overallSummary.totalPending.toLocaleString()}</h3>
//                       <small className="text-muted">
//                         {getVerificationRate(summaryData.overallSummary.totalPending, summaryData.overallSummary.totalStudents)}% Pending
//                       </small>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//                 <Col lg={3} md={6} className="mb-3">
//                   <Card className="border-danger">
//                     <Card.Body className="text-center">
//                       <h5 className="text-danger">Rejected</h5>
//                       <h3>{summaryData.overallSummary.totalRejected.toLocaleString()}</h3>
//                       <small className="text-muted">
//                         {getVerificationRate(summaryData.overallSummary.totalRejected, summaryData.overallSummary.totalStudents)}% Rejected
//                       </small>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>

//               {/* District-wise Summary Table */}
//               <Card>
//                 <Card.Header className="bg-light">
//                   <h6 className="mb-0">District-wise Verification Summary</h6>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   <div style={{ maxHeight: "600px", overflowY: "auto" }}>
//                     <Table striped bordered hover responsive className="mb-0">
//                       <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
//                         <tr>
//                           <th>District</th>
//                           <th className="text-center">Verified</th>
//                           <th className="text-center">Pending</th>
//                           <th className="text-center">Rejected</th>
//                           <th className="text-center">Total</th>
//                           <th className="text-center">Verification Rate</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {summaryData.districtWiseSummary.map((district, index) => (
//                           <tr key={index}>
//                             <td>
//                               <strong>{district.district || "Not Specified"}</strong>
//                             </td>
//                             <td className="text-center">
//                               <Badge bg="success">{district.verified.toLocaleString()}</Badge>
//                             </td>
//                             <td className="text-center">
//                               <Badge bg="warning" text="dark">{district.pending.toLocaleString()}</Badge>
//                             </td>
//                             <td className="text-center">
//                               <Badge bg="danger">{district.rejected.toLocaleString()}</Badge>
//                             </td>
//                             <td className="text-center">
//                               <Badge bg="primary">{district.total.toLocaleString()}</Badge>
//                             </td>
//                             <td className="text-center">
//                               <Badge bg="info">
//                                 {getVerificationRate(district.verified, district.total)}%
//                               </Badge>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
//                 </Card.Body>
//               </Card>

//               {/* Summary Stats */}
//               <Row className="mt-3">
//                 <Col>
//                   <small className="text-muted">
//                     Last updated: {new Date().toLocaleString()} | 
//                     Total Districts: {summaryData.totalDistricts} | 
//                     Data Source: Manual Registrations Only
//                   </small>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };







import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Alert,
  Badge
} from "react-bootstrap";
import { getVerificationSummary } from "../../services/DashBoardServices/DashboardService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const VerificationSummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVerificationSummary();
  }, []);

  const fetchVerificationSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVerificationSummary();
      setSummaryData(data);
    } catch (err) {
      setError("Failed to fetch verification summary");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!summaryData) return;

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text("Student Verification Summary Report", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report Date: ${new Date().toLocaleString()}`, 14, 22);

    // Table data with serial numbers
    const tableColumn = ["#", "District", "Verified", "Pending", "Rejected", "Total", "Verification Rate"];
    const tableRows = summaryData.districtWiseSummary.map((district, index) => [
      (index + 1).toString(),
      district.district || "Not Specified",
      district.verified.toLocaleString(),
      district.pending.toLocaleString(),
      district.rejected.toLocaleString(),
      district.total.toLocaleString(),
      getVerificationRate(district.verified, district.total) + "%"
    ]);

    // Add grand total row
    tableRows.push([
      "",
      "GRAND TOTAL",
      summaryData.overallSummary.totalVerified.toLocaleString(),
      summaryData.overallSummary.totalPending.toLocaleString(),
      summaryData.overallSummary.totalRejected.toLocaleString(),
      summaryData.overallSummary.totalStudents.toLocaleString(),
      getVerificationRate(summaryData.overallSummary.totalVerified, summaryData.overallSummary.totalStudents) + "%"
    ]);

    // Add table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { 
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      // Style the grand total row differently
      didParseCell: function (data) {
        if (data.section === 'body' && data.row.index === tableRows.length - 1) {
          data.cell.styles.fillColor = [240, 240, 240];
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [0, 0, 0];
        }
      },
      margin: { top: 30 }
    });

    // Add summary at the bottom
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    // doc.text(`Total Districts: ${summaryData.totalDistricts}`, 14, finalY);
    // doc.text(`Data Source: Manual Registrations Only`, 14, finalY + 5);

    // Save the PDF
  // Get current date for filename
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const fileName = `verification-summary_${dd}-${mm}-${yyyy}.pdf`;

  // Save the PDF
  doc.save(fileName);

  };

  const downloadExcel = () => {
    if (!summaryData) return;

    // Only district-wise data worksheet with serial numbers (removed overall summary sheet)
    const districtData = summaryData.districtWiseSummary.map((district, index) => ({
      "#": index + 1,
      "District": district.district || "Not Specified",
      "Verified": district.verified,
      "Pending": district.pending,
      "Rejected": district.rejected,
      "Total": district.total,
      "Verification Rate": getVerificationRate(district.verified, district.total) + "%"
    }));

    // Add grand total row
    districtData.push({
      "#": "",
      "District": "GRAND TOTAL",
      "Verified": summaryData.overallSummary.totalVerified,
      "Pending": summaryData.overallSummary.totalPending,
      "Rejected": summaryData.overallSummary.totalRejected,
      "Total": summaryData.overallSummary.totalStudents,
      "Verification Rate": getVerificationRate(summaryData.overallSummary.totalVerified, summaryData.overallSummary.totalStudents) + "%"
    });

    // Create workbook with only district sheet (removed overall summary sheet)
    const wb = XLSX.utils.book_new();
    
    // Add district-wise sheet only
    const districtWS = XLSX.utils.json_to_sheet(districtData);
    XLSX.utils.book_append_sheet(wb, districtWS, "Verification Summary");

    // Save file
    XLSX.writeFile(wb, "verification-summary-report.xlsx");
  };

  const getVerificationRate = (verified, total) => {
    return total > 0 ? ((verified / total) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading verification summary...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">
          {error}
          <Button variant="outline-danger" size="sm" className="ms-3" onClick={fetchVerificationSummary}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!summaryData) {
    return (
      <Container fluid className="py-4">
        <Alert variant="warning">No data available</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Student Verification Summary</h4>
              <div>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="me-2"
                  onClick={downloadPDF}
                >
                  📄 Download PDF
                </Button>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={downloadExcel}
                >
                  📊 Download Excel
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {/* Overall Summary Cards - KEPT IN COMPONENT */}
              <Row className="mb-4">
                <Col lg={3} md={6} className="mb-3">
                  <Card className="border-success">
                    <Card.Body className="text-center">
                      <h5 className="text-success">Total Students</h5>
                      <h3>{summaryData.overallSummary.totalStudents.toLocaleString()}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                  <Card className="border-success">
                    <Card.Body className="text-center">
                      <h5 className="text-success">Verified</h5>
                      <h3>{summaryData.overallSummary.totalVerified.toLocaleString()}</h3>
                      <small className="text-muted">
                        {getVerificationRate(summaryData.overallSummary.totalVerified, summaryData.overallSummary.totalStudents)}% Verified
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                  <Card className="border-warning">
                    <Card.Body className="text-center">
                      <h5 className="text-warning">Pending</h5>
                      <h3>{summaryData.overallSummary.totalPending.toLocaleString()}</h3>
                      <small className="text-muted">
                        {getVerificationRate(summaryData.overallSummary.totalPending, summaryData.overallSummary.totalStudents)}% Pending
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                  <Card className="border-danger">
                    <Card.Body className="text-center">
                      <h5 className="text-danger">Rejected</h5>
                      <h3>{summaryData.overallSummary.totalRejected.toLocaleString()}</h3>
                      <small className="text-muted">
                        {getVerificationRate(summaryData.overallSummary.totalRejected, summaryData.overallSummary.totalStudents)}% Rejected
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* District-wise Summary Table */}
              <Card>
                <Card.Header className="bg-light">
                  <h6 className="mb-0">District-wise Verification Summary</h6>
                </Card.Header>
                <Card.Body className="p-0">
                  <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                    <Table striped bordered hover responsive className="mb-0">
                      <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
                        <tr>
                          <th>#</th>
                          <th>District</th>
                          <th className="text-center">Verified</th>
                          <th className="text-center">Pending</th>
                          <th className="text-center">Rejected</th>
                          <th className="text-center">Total</th>
                          <th className="text-center">Verification Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summaryData.districtWiseSummary.map((district, index) => (
                          <tr key={index}>
                            <td>
                              <strong>{index + 1}</strong>
                            </td>
                            <td>
                              <strong>{district.district || "Not Specified"}</strong>
                            </td>
                            <td className="text-center">
                              <Badge bg="success">{district.verified.toLocaleString()}</Badge>
                            </td>
                            <td className="text-center">
                              <Badge bg="warning" text="dark">{district.pending.toLocaleString()}</Badge>
                            </td>
                            <td className="text-center">
                              <Badge bg="danger">{district.rejected.toLocaleString()}</Badge>
                            </td>
                            <td className="text-center">
                              <Badge bg="primary">{district.total.toLocaleString()}</Badge>
                            </td>
                            <td className="text-center">
                              <Badge bg="info">
                                {getVerificationRate(district.verified, district.total)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                        {/* Grand Total Row */}
                        <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                          <td colSpan="2" className="text-end">
                            GRAND TOTAL
                          </td>
                          <td className="text-center">
                            <Badge bg="success">{summaryData.overallSummary.totalVerified.toLocaleString()}</Badge>
                          </td>
                          <td className="text-center">
                            <Badge bg="warning" text="dark">{summaryData.overallSummary.totalPending.toLocaleString()}</Badge>
                          </td>
                          <td className="text-center">
                            <Badge bg="danger">{summaryData.overallSummary.totalRejected.toLocaleString()}</Badge>
                          </td>
                          <td className="text-center">
                            <Badge bg="primary">{summaryData.overallSummary.totalStudents.toLocaleString()}</Badge>
                          </td>
                          <td className="text-center">
                            <Badge bg="info">
                              {getVerificationRate(summaryData.overallSummary.totalVerified, summaryData.overallSummary.totalStudents)}%
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>

              {/* Summary Stats */}
              <Row className="mt-3">
                <Col>
                  <small className="text-muted">
                    Last updated: {new Date().toLocaleString()} | 
                    Total Districts: {summaryData.totalDistricts} | 
             
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};