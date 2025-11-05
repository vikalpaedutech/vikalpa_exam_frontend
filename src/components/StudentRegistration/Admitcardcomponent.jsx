import React, { useContext, useState } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import jsPDF from "jspdf";
import { useNavigate, useLocation } from "react-router-dom";
import { StudentContext } from "../NewContextApis/StudentContextApi.js";
import { UserContext } from "../NewContextApis/UserContext.js";

export const Admitcardcomponent = () => {
  const { studentData } = useContext(StudentContext);
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [showError, setShowError] = useState(false);

  console.log(studentData);

  // ✅ Check if studentData is empty/null/undefined
  if (!studentData || Object.keys(studentData).length === 0) {
    return (
      <Modal show centered onHide={() => navigate("/registration-form")}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please register first to generate your acknowledgment slip.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate("/registration-form")}>
            Go to Registration Form
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const student = studentData;
  const isVerified = student.isVerified;
  const verificationRemark = student.registrationFormVerificationRemark;

  const examLevel =
    student.classOfStudent === "8"
      ? "Mission Buniyaad"
      : "Haryana Super 100";
  const examLevelSlip = "Acknowledgement Slip";
  const examLevelBatch = "Batch 2025-27";

  // ✅ Helper: format date to dd-mm-yyyy
  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formattedDate = student.registrationDate
    ? formatDateToDDMMYYYY(student.registrationDate)
    : formatDateToDDMMYYYY(new Date());

  // 🧾 Function to download PDF
  const DownloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    const logo = "/haryana.png";
    const instruction = "/geninstructions.png";

    // ✅ Set registration status text for PDF
    let registrationStatusText = "Pending";
    if (isVerified === "Verified") registrationStatusText = "Registration Successful";
    else if (isVerified === "Rejected") registrationStatusText = "Rejected";

    pdf.addImage(logo, "PNG", 10, 10, 20, 20);
    pdf.setFontSize(14);
    pdf.text(examLevel, 105, 20, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(examLevelSlip, 105, 26, { align: "center" });
    pdf.setFontSize(10);
    pdf.text(examLevelBatch, 105, 32, { align: "center" });
    pdf.text(
      `Registration Status: ${registrationStatusText}`,
      105,
      38,
      { align: "center" }
    );

    // 🔹 Bold and thick top underline
    pdf.setLineWidth(1.2);
    pdf.line(10, 42, 200, 42);

    const x = 10;
    let y = 50;
    const lh = 8;

    const addLine = (label, value) => {
      pdf.text(`${label}`, x, y);
      pdf.text(`${value || "-"}`, x + 70, y);
      y += lh;
    };

    addLine("1. Slip ID", student.slipId);
    addLine("2. SRN", student.srn);
    addLine("3. Name", student.name);
    addLine("4. Father's Name", student.father);
    addLine("5. Mother's Name", student.mother);
    addLine("6. D.O.B", formatDateToDDMMYYYY(student.dob)); // ✅ updated
    addLine("7. Gender", student.gender);
    addLine("8. Category", student.category);
    addLine("9. Class", student.classOfStudent);
    addLine("10. District", student.schoolDistrict);
    addLine("11. Block", student.schoolBlock);
    addLine("12. School", student.school);
    addLine("13. Registration Date", formattedDate); // ✅ updated

    // ✅ Added: Rejection Reason if rejected
    if (isVerified === "Rejected") {
      pdf.setTextColor(255, 0, 0);
      addLine("14. Rejection Reason", verificationRemark || "Not specified.");
      pdf.setTextColor(0, 0, 0);
    }

    // 🔹 Bold underline just below the table
    pdf.setLineWidth(1.2);
    pdf.line(10, y + 2, 200, y + 2);

    pdf.addImage(instruction, "PNG", 10, 160, 180, 120);
    pdf.save(`${student.name}_${student.srn}_Acknowledgement.pdf`);

    if (
      location.pathname === "/exam-acknowledgement-slip-mb" ||
      location.pathname === "/exam-acknowledgement-slip-sh"
    ) {
      navigate("/");
    }
  };

  // 🧭 Function to update/edit form
  const handleEdit = () => {
    if (location.pathname === "/exam-acknowledgement-slip-mb") {
      navigate("/exam-registration-form-mb");
    } else if (location.pathname === "/exam-acknowledgement-slip-sh") {
      navigate("/exam-registration-form-sh");
    }
  };

  return (
    <Container className="py-4">
      <Card
        className="shadow"
        style={{ borderRadius: "12px", padding: "20px" }}
      >
        <Card.Header className="bg-white text-center border-0">
          <img
            src="/haryana.png"
            alt="Haryana Logo"
            style={{ width: "60px", marginBottom: "10px" }}
          />
          <h5 className="fw-bold">{examLevel}</h5>
          <h6>{examLevelSlip}</h6>
          <h6>{examLevelBatch}</h6>
          <p className="mt-2">
            Registration Status:{" "}
            <strong>
              {isVerified === "Verified"
                ? "Registration Successful"
                : isVerified === "Rejected"
                ? "Rejected"
                : "Pending"}
            </strong>
          </p>
          {isVerified === "Verified" ? (
            <p className="text-success">
              Your form is verified for Level 1 Examination.
            </p>
          ) : isVerified === "Rejected" ? (
            <p className="text-danger">
              Rejection Reason: {verificationRemark || "Not specified."}
            </p>
          ) : (
            <div>
              <p>
                Your Registration form is under verification. Please check again
                after 3 days.
              </p>
              <hr></hr>
            </div>
          )}
        </Card.Header>

        <Card.Body>
          <Container>
            <Row xs={1} md={2} className="g-3">
              <Col><b>Slip ID:</b> {student.slipId}</Col>
              <Col><b>SRN:</b> {student.srn}</Col>
              <Col><b>Name:</b> {student.name}</Col>
              <Col><b>Father's Name:</b> {student.father}</Col>
              <Col><b>Mother's Name:</b> {student.mother}</Col>
              <Col><b>D.O.B:</b> {formatDateToDDMMYYYY(student.dob)}</Col>
              <Col><b>Gender:</b> {student.gender}</Col>
              <Col><b>Category:</b> {student.category}</Col>
              <Col><b>Class:</b> {student.classOfStudent}</Col>
              <Col><b>District:</b> {student.schoolDistrict}</Col>
              <Col><b>Block:</b> {student.schoolBlock}</Col>
              <Col><b>School:</b> {student.school}</Col>
              <Col><b>Registration Date:</b> {formattedDate}</Col>
            </Row>
          </Container>
        </Card.Body>

        <Card.Footer className="bg-white text-center border-0">
          <h5>General Instructions / सामान्य निर्देश:</h5>
          <hr />
          <ol style={{ textAlign: "left" }}>
            <li>
              Use your SRN number or Slip ID to check registration status and Download admit card. (पंजीकरण की स्थिति जांचने और प्रवेश पत्र डाउनलोड करने के लिए अपने स्लिप आईडी या एसआरएन नंबर का उपयोग करें।)
            </li>
            <li>
              Check your registration status after three days, if accepted, it will show “Registration Successful”. (तीन दिनों के बाद अपनी पंजीकरण स्थिति जांचें। यदि आपका पंजीकरण स्वीकृत किया जाता है, तो यह “पंजीकरण सफल” दिखाएगा।)
            </li>
            <li>
              Submission of wrong details can lead to rejection of registration form. (गलत फ़ॉर्म भरने पर आपका पंजीकृत फ़ॉर्म अस्वीकार किया जा सकता है।)
            </li>
          </ol>
          <hr></hr>
          <p style={{ fontWeight: "bold" }}>
            Note: If you have any doubts regarding registration, then contact us (यदि आपको पंजीकरण से संबंधित कोई भी समस्या आती है, तो दिए गए सहायता नंबरों पर संपर्क करें। संपर्क करने का समय सुबह 10 बजे से शाम 5 बजे तक रहेगा।): 7982109054, 7982109215, 7982108494
          </p>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button onClick={DownloadPDF}>Download Acknowledgement Slip</Button>
            {(isVerified === "Rejected" || !isVerified || isVerified === "Pending") && (
              <Button variant="warning" onClick={handleEdit}>
                Edit Details
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};





