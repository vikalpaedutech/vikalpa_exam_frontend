import React, { useContext, useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Modal, Spinner } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { StudentContext } from "../NewContextApis/StudentContextApi.js";
import { UserContext } from "../NewContextApis/UserContext.js";
import { BulkDownloadContext } from "../ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi";

import { IsAdmitCardDownloaded } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

const logo = "/haryana.png";
const logo2 = "/admitBuniyaLogo.png";
const level1admitinstructions = "/level1adimitcardinstructions.png";

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const Level1AdmitCard = ({ singleStudent = null, bulkDownload = null, onDone = () => {} }) => {
  // contexts
  const { studentData } = useContext(StudentContext);
  const { userData } = useContext(UserContext);
  const { bulkDownload: contextBulkDownload, setBulkDownload } = useContext(BulkDownloadContext);

  // local state
  const [busy, setBusy] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // Decide what students to process:
  // Priority: bulkDownload prop > contextBulkDownload > singleStudent > studentData
  const studentsToProcess = bulkDownload || contextBulkDownload;

  // Format date helper
  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Build single PDF blob (used by both single and bulk)
  const buildPdfBlob = async (student) => {
    // try load Devanagari font (optional)
    try {
      const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
      const fResp = await fetch(fontUrl);
      if (fResp.ok) {
        const buf = await fResp.arrayBuffer();
        const base64 = arrayBufferToBase64(buf);
        if (jsPDF.API && jsPDF.API.addFileToVFS) {
          jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64);
          jsPDF.API.addFont("NotoSansDevanagari-Regular.ttf", "NotoDeva", "normal");
        }
      }
    } catch (e) {
      // font optional — continue
      console.warn("Devanagari font load failed:", e);
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // border
    doc.rect(5, 5, 200, 285);

    // logos - best effort
    try { doc.addImage(logo, "PNG", 10, 8, 20, 20); } catch (e) {}
    try { doc.addImage(logo2, "PNG", 180, 8, 20, 20); } catch (e) {}

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(12);
    doc.text("Directorate of School Education (DSE) Shiksha Sadan, Haryana", pageWidth / 2, 10, { align: "center" });
    doc.setFontSize(13);
    const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";
    doc.text(`${examLevel} Level 1 Exam (2026-28)`, pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("E – Admit Card", pageWidth / 2, 22, { align: "center" });
    doc.setFontSize(10);
    doc.text("Examination Date: 24th December", pageWidth / 2, 27, { align: "center" });
    doc.text("Reporting Time: 11:30 AM, Exam Time: 12:30 PM to 2:30 PM", pageWidth / 2, 32, { align: "center" });

    const dataForPdf = [
      ["Student Name", student.name ?? "-"],
      ["Father Name", student.father ?? "-"],
      ["Date of Birth", student.dob ? formatDateToDDMMYYYY(student.dob) : "-"],
      ["Category", student.category ?? "-"],
      ["SRN Number", student.srn ?? "-"],
      ["Exam Roll Number", student.rollNumber ?? "-"],
      ["Aadhar Number", student.aadhar ?? "-"],
      ["Mobile Number", student.mobile ?? "-"],
      ["District", (student.schoolDistrict ?? "-") + (student.schoolDistrictCode ? ` (${student.schoolDistrictCode})` : "")],
      ["Block", (student.schoolBlock ?? "-") + (student.schoolBlockCode ? ` (${student.schoolBlockCode})` : "")],
      ["Examination Center", student.L1ExaminationCenter ?? "-"]
    ];

    doc.autoTable({
      startY: 40,
      body: dataForPdf,
      theme: "grid",
      styles: { lineWidth: 0.2, lineColor: [0, 0, 0], fillColor: false, textColor: [0, 0, 0], fontSize: 10 },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 80 } },
      tableWidth: "wrap"
    });

    // photo area
    if (student.imageUrl) {
      try {
        doc.addImage(student.imageUrl, "PNG", 150, 40, 50, 50);
      } catch (e) {
        doc.rect(150, 40, 50, 50);
        doc.text("Photo unavailable", 153, 65);
      }
    } else {
      doc.rect(150, 40, 50, 50);
      doc.text("Paste your passport-size photograph ", 155, 60);
      doc.text("duly attested by", 155, 65);
      doc.text("the school principal.", 155, 70);
    }

    // dividing line and instructions
    doc.setLineWidth(0.5);
    doc.line(10, 130, pageWidth - 10, 130);
    try {
      doc.addImage(level1admitinstructions, "PNG", 15, 132, 180, 155);
    } catch (e) {
      doc.setFontSize(9);
      doc.text("General Instructions: Reach 30 minutes early. Carry admit card & Aadhar. Do not carry mobile/calculators etc.", 15, 135, { maxWidth: pageWidth - 30 });
    }

    return doc.output("blob");
  };

  // Download single PDF directly
  const downloadSinglePdf = async (student) => {
    setError(null);
    setBusy(true);
    setShowModal(true);
    try {
      const blob = await buildPdfBlob(student);
      const safeName = (student.srn || student.name || "admit").toString().replace(/\s+/g, "_");
      saveAs(blob, `${safeName}_admit_card.pdf`);

      // notify backend (best-effort)
      try {
        await IsAdmitCardDownloaded({
          _id: student._id,
          admitCardDownloadStatus: { isL1AdmitCardDownloaded: true }
        });
      } catch (e) {
        console.warn("Notify failed:", e);
      }
    } catch (err) {
      console.error("Single PDF generation error:", err);
      setError("Error generating PDF. Check console.");
    } finally {
      setBusy(false);
    }
  };

  // Bulk runner: create PDFs for all students in array -> zip -> download
  const runBulk = async (studentsArr) => {
    setError(null);
    setBusy(true);
    setShowModal(true);
    try {
      // If only one student, download as single PDF directly
      if (studentsArr.length === 1) {
        await downloadSinglePdf(studentsArr[0]);
        return;
      }

      // Multiple students - create ZIP
      const zip = new JSZip();
      for (let i = 0; i < studentsArr.length; i++) {
        const st = studentsArr[i];
        try {
          const b = await buildPdfBlob(st);
          const safeName = (st.srn || st.name || `admit_${i}`).toString().replace(/\s+/g, "_");
          zip.file(`${safeName}_admit_card.pdf`, b);
        } catch (perErr) {
          console.warn(`Failed to create PDF for ${st._id || st.srn || st.name}`, perErr);
        }
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `admit_cards_${Date.now()}.zip`);

      // notify backend for each student (best-effort)
      for (const st of studentsArr) {
        try {
          await IsAdmitCardDownloaded({
            _id: st._id,
            admitCardDownloadStatus: { isL1AdmitCardDownloaded: true }
          });
        } catch (e) {
          console.warn("Notify failed for", st._id, e);
        }
      }
    } catch (err) {
      console.error("Bulk error:", err);
      setError("Error generating PDFs. Check console.");
    } finally {
      setBusy(false);
      // clear bulk context after done
      setBulkDownload(null);
      onDone();
    }
  };

  // Auto-run bulk if bulkDownload present and this component is mounted
  useEffect(() => {
    if (Array.isArray(studentsToProcess) && studentsToProcess.length > 0) {
      // run in next tick
      (async () => {
        await runBulk(studentsToProcess);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentsToProcess]);

  // If we have bulk download data, don't show any UI - just process in background
  if (Array.isArray(studentsToProcess) && studentsToProcess.length > 0) {
    return (
      <Modal show={showModal} onHide={() => {}} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>
            {studentsToProcess.length === 1 ? "Downloading Admit Card" : "Downloading Admit Cards"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {busy ? (
            <>
              <Spinner animation="border" variant="primary" />
              <div className="mt-2">
                {studentsToProcess.length === 1 
                  ? "Preparing admit card..." 
                  : `Preparing ${studentsToProcess.length} admit cards...`}
              </div>
            </>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <div>
              {studentsToProcess.length === 1 
                ? "Admit card downloaded successfully!" 
                : "Admit cards downloaded successfully!"}
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  }

  // Original UI for single student mode (only shown when no bulk download)
  const renderAdmitCardUI = (student) => {
    if (!student || Object.keys(student).length === 0) {
      return (
        <Modal show centered onHide={() => {}}>
          <Modal.Header closeButton>
            <Modal.Title>Registration Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please register first to generate your acknowledgment slip.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={onDone}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }

    const formattedDate = student.dob ? formatDateToDDMMYYYY(student.dob) : formatDateToDDMMYYYY(new Date());
    const examLevel = student.classOfStudent === "8" ? "Mission Buniyaad" : "Haryana Super 100";

    const data = [
      { field: "Student Name", value: student.name || "-" },
      { field: "Father's Name", value: student.father || "-" },
      { field: "Date of Birth", value: formattedDate || "-" },
      { field: "Category", value: student.category || "-" },
      { field: "SRN Number", value: student.srn || "-" },
      { field: "Exam Roll Number", value: student.rollNumber || "-" },
      { field: "Aadhar Number", value: student.aadhar || "-" },
      { field: "Mobile Number", value: student.mobile || "-" },
      { field: "District", value: (student.schoolDistrict ? student.schoolDistrict : "-") + (student.schoolDistrictCode ? " (" + student.schoolDistrictCode + ")" : "") },
      { field: "Block", value: (student.schoolBlock ? student.schoolBlock : "-") + (student.schoolBlockCode ? " (" + student.schoolBlockCode + ")" : "") },
      { field: "Examination Center", value: student.L1ExaminationCenter || "-" },
    ];

    // NEW: Show only the basic details table and a download blinking hyperlink/button below it.
    // Kept everything else (functions, imports, comments) unchanged as requested.
    const cardStyle = { borderRadius: "12px", padding: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" };
    const smallText = { fontSize: "14px", marginBottom: 4, color: "#333" };
    const smallField = { fontSize: "14px", fontWeight: 600, color: "#222" };

    return (
      <Container className="py-3">
        {/* Top blinking download CTA */}
       

        <Card className="shadow-sm" style={cardStyle}>
          <Card.Header className="bg-white text-center border-0 py-2">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>General Details</div>
            </div>
          </Card.Header>

          <Card.Body style={{ padding: "14px" }}>
            <Row className="align-items-start">
              <Col md={8}>
                <table className="table table-borderless mb-0" style={{ width: "100%" }}>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "none" }}>
                        <td style={{ width: "45%", ...smallField, padding: "8px 6px" }}>{row.field}</td>
                        <td style={{ width: "55%", ...smallText, padding: "8px 6px" }}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>

              <Col md={4} className="text-center">
                <div style={{ width: "120px", height: "120px", borderRadius: 8, border: "1px solid #e6e6e6", margin: "0 auto 8px auto", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#fafafa" }}>
                  {student.imageUrl ? <img src={student.imageUrl} alt="Student" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ padding: 8, fontSize: 12, color: "#666" }}>Attach passport-size photo</div>}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>SRN: <strong style={{ color: "#111" }}>{student.srn || "-"}</strong></div>
              </Col>
            </Row>

          


             <div className="d-flex align-items-center justify-content-center mb-3">
          <div style={{ textAlign: "center" }}>
            <a
              onClick={() => downloadSinglePdf(student)}
              style={{ cursor: "pointer", fontWeight: "bold", fontSize: "22px", animation: "blink 1s infinite", alignItems: "center" }}
              className="blinking-link"
            >
              Click here to download your Admit Card. <br />
              (अपना प्रवेश पत्र डाउनलोड करने के लिए यहाँ क्लिक करें)
            </a>
            <style>{`@keyframes blink { 0% { color: #d33; } 50% { color: #0b5fff; } 100% { color: #d33; } } .blinking-link { text-decoration: underline; }`}</style>
          </div>
        </div>
          </Card.Body>

          <Card.Footer className="bg-white text-center border-0 py-2">
            <div style={{ fontSize: 12, color: "#666" }}>
              <small>Keep this admit card safe. Carry required documents to exam centre.</small>
            </div>
          </Card.Footer>
        </Card>

        <Modal show={showModal} onHide={() => { if (!busy) setShowModal(false); }} centered>
          <Modal.Header closeButton>
            <Modal.Title>{busy ? "Generating PDF..." : error ? "Error" : "Status"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {busy ? <div className="text-center"><Spinner animation="border" /> <div className="mt-2">Preparing PDF — please wait.</div></div> : (error ? <div className="text-danger">{error}</div> : <div>Admit Card Downloaded.</div>)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={busy}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  };

  // else render single UI (singleStudent prop if provided, otherwise studentData from context)
  return renderAdmitCardUI(singleStudent || studentData);
};
