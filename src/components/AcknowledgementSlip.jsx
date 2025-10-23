//This component will hold the dynamic acknowledgment slip of the student.
//And also student will have their own acknowledgment id using which they can access in their student account.
//I am using jspdf and html2canvas library to convert the following modal into pdf directly.

import React, { useState, useEffect, useContext } from "react";
import { Card, Button, CardFooter, Container, Col, Row } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { StudentContext } from "./ContextApi/StudentContextAPI/StudentContext";
import { UserContext } from "./ContextApi/UserContextAPI/UserContext";

export default function AcknowledgementSlip({ showAck, slipData }) {
  const navigate = useNavigate();
  const location = useLocation();

  let PutDirectTo;

  if (
    location.pathname === "/srn-100" ||
    location.pathname === "/acknowledgementslip-100"
  ) {
    PutDirectTo = "/Registration-form/put/S100";
  } else {
    PutDirectTo = "/Registration-form/put/MB";
  }

  //Below UserContext checks if the User uses the ackslip and if so, then routes the user accordingly.

  const { user } = useContext(UserContext);


  const [modal, setModal] = useState(true);
  const [EditForm, setEditForm] = useState(false);
  //Below hook handles the slip data if user comes here from the student account
  const { student } = useContext(StudentContext);
  let isVerified = student.isVerified;

  // useEffect(()=>{
  //     setModal(showAck)
  // },[showAck])

  // function OpenModal () {
  //     setModal(true);
  // }

  function CloseModal() {
    setModal(false);
    // navigate('/srn');

    if (user && location.pathname === "/acknowledgementslip-mb") {
      navigate("/srn");
    } else if (user && location.pathname === "/acknowledgementslip-100") {
      navigate("/srn-100");
    } else if (user && location.pathname === "/Registration-form/put/MB"){
      navigate("/srn");
    } else if (user && location.pathname === "/Registration-form/put/s100"){
      navigate("/srn-100");
    } else if (
      location.pathname === "/acknowledgementslip-mb" ||
      location.pathname === "/acknowledgementslip-100" ||
      location.pathname === "/Registration-form/put/MB" ||
      location.pathname === "/Registration-form/put/S100"
    ) {
      navigate("/"); // Navigate after downloading
    }
  }
  const [ackStateChange, setAckStateChange] = useState("");

  //This below code directs to the prefilled from and data for prefilled form is...
  //... filled by StudentContextApi
  function UpdateForm() {
    setEditForm(true);
    setAckStateChange(
      "i-am-changing-state-of-showAck-in-registrationformputcomp"
    );
  }

  if (EditForm) {
    return <Navigate to={PutDirectTo} />;
  }

  //Hnadling below text dynamically...
  let examLevel;
  let examLevelSlip;
  let examLevelBatch;
  if (
    (student && student.grade === "8") ||
    (slipData && slipData.grade === "8") ||
    slipData
  ) {
    examLevel = "Mission Buniyaad";
    examLevelSlip = "Acknowledgement Slip";
    examLevelBatch = "Batch 2025-27";
  } else {
    examLevel = "Haryana Super 100";
    examLevelSlip = "Acknowledgement Slip";
    examLevelBatch = "Batch 2025-27";
  }

  let verificationStatusText = ""; // Initialize as an empty string
if (student.isVerified === "Verified" || isVerified === "Verified") {
  verificationStatusText = 
    "Your Registration form is verified for Level 1 Examination. ";
} else if (student.isVerified === "Pending" || isVerified === "Pending" || slipData) {
    if (student.verificationRemark === null || student.verificationRemark === "" || slipData){

      verificationStatusText = 
      "Your Registration form is under verification. Check your status after three days.";

    } else {
      verificationStatusText = `Pending Reason: ${student.verificationRemark || "Your Registration form is under verification. Check your status after three days."}`;
    }



 
} else if (student.isVerified === "Rejected" || isVerified === "Rejected") {
  verificationStatusText = `Rejection Reason: ${student.verificationRemark}`;
}   
 
  //Below logic is for downloading Acknowledgement sllip using html2canvas and jsPDF library.
  function DownloadPDF() {
    const pdf = new jsPDF("p", "mm", "a4");

    const logo = "/haryana.png";
    const instruction = "/geninstructions.png";

    const slipDataToShow = slipData || {}; // Get slip data or use empty object if not available
    const {
      srn,
      name,
      father,
      dob,
      gender,
      category,
      slipId,
      district,
      block,
      school,
    } = slipDataToShow;

    // Format the current date
    const currentDate = new Date(Date.now()).toLocaleDateString("en-US");

    // Check if `student.createdAt` exists and format accordingly
    const formattedDateCreatedat = student.createdAt
      ? new Date(student.createdAt).toLocaleDateString("en-US")
      : null;

      //For only those documents which is provided by govt for prefilled.
      const formattedDateUpdatedAt = student.createdAt
      ? new Date(student.updatedAt).toLocaleDateString("en-US")
      : null;

    // Use `formattedDate` if it exists; otherwise, use the formatted current date
    let dateToShow;
    if (student.dataByGovtForPrefilled === true){
       dateToShow = formattedDateUpdatedAt
    } else {
       dateToShow = formattedDateCreatedat || currentDate;

    }

    

    // Add logo to the PDF
    pdf.addImage(logo, "PNG", 10, 10, 20, 20);

    pdf.addImage(instruction, "PNG", 10, 158, 180, 120);

    // Set font size and styles for header
    pdf.setFontSize(14);
    pdf.text(examLevel, 105, 20, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(examLevelSlip, 105, 25, { align: "center" });
    pdf.setFontSize(10);
    pdf.text(examLevelBatch, 105, 30, { align: "center" });

    pdf.setFontSize(10);
    pdf.text(
      `Registration Status: ${isVerified || student.isVerified || "Pending"}`,
      105,
      35,
      { align: "center" }
    );

    //Below shows rejection reason
    let verificationStatusText1 = "Your Registration form is under verification. Check your status after three days."
    pdf.setFontSize(10);
    pdf.text(verificationStatusText || verificationStatusText1 , 105, 40, { align: "center" });

    //__________________________________________________________________

    // Draw underline below the header
    const headerY = 44; // Y-coordinate for the underline
    pdf.setLineWidth(1);
    pdf.line(10, headerY, 200, headerY); // Draw line from (10, headerY) to (200, headerY)

    // Add some spacing

    pdf.setFontSize(12);

    // Define a maximum label width
    const labelWidth = 70; // Adjust this value based on your needs
    const xStart = 10; // Starting X-coordinate
    const yPositionStart = 50; // Starting Y-coordinate
    const lineHeight = 10; // Height between lines

    // Draw the texts

    pdf.text(`1. Slip ID:`, xStart, yPositionStart);
    pdf.text(
      `${slipId || student.slipId}`,
      xStart + labelWidth,
      yPositionStart
    );

    pdf.text(`2. SRN:`, xStart, yPositionStart + lineHeight);
    pdf.text(
      `${srn || student.srn}`,
      xStart + labelWidth,
      yPositionStart + lineHeight
    );

    pdf.text(`3. Name:`, xStart, yPositionStart + 2 * lineHeight);
    pdf.text(
      `${name || student.name}`,
      xStart + labelWidth,
      yPositionStart + 2 * lineHeight
    );

    pdf.text(`4. Father's Name:`, xStart, yPositionStart + 3 * lineHeight);
    pdf.text(
      `${father || student.father}`,
      xStart + labelWidth,
      yPositionStart + 3 * lineHeight
    );

    pdf.text(`5. D.O.B:`, xStart, yPositionStart + 4 * lineHeight);
    pdf.text(
      `${dob || student.dob}`,
      xStart + labelWidth,
      yPositionStart + 4 * lineHeight
    );

    pdf.text(`6. Gender:`, xStart, yPositionStart + 5 * lineHeight);
    pdf.text(
      `${gender || student.gender}`,
      xStart + labelWidth,
      yPositionStart + 5 * lineHeight
    );

    pdf.text(`7. Category:`, xStart, yPositionStart + 6 * lineHeight);
    pdf.text(
      `${category || student.category}`,
      xStart + labelWidth,
      yPositionStart + 6 * lineHeight
    );

    pdf.text(`8. District:`, xStart, yPositionStart + 7 * lineHeight);
    pdf.text(
      `${district || student.district}`,
      xStart + labelWidth,
      yPositionStart + 7 * lineHeight
    );

    pdf.text(`9. Block:`, xStart, yPositionStart + 8 * lineHeight);
    pdf.text(
      `${block || student.block}`,
      xStart + labelWidth,
      yPositionStart + 8 * lineHeight
    );

    pdf.text(`10. School:`, xStart, yPositionStart + 9 * lineHeight);
    pdf.text(
      `${school || student.school}`,
      xStart + labelWidth,
      yPositionStart + 9 * lineHeight
    );

    pdf.text(
      `11. Registration Date:`,
      xStart,
      yPositionStart + 10 * lineHeight
    );
    pdf.text(
      `${dateToShow}`,
      xStart + labelWidth,
      yPositionStart + 10 * lineHeight
    );

    // Draw a gray header line
    const lineY = 155; // Y-coordinate for the header line
    pdf.setDrawColor(169, 169, 169); // Set color to gray (RGB)
    pdf.setLineWidth(1); // Set line width
    pdf.line(10, lineY, 200, lineY); // Draw line from (10, lineY) to (200, lineY)

    // Add instructions below the header line
    // pdf.setFontSize(10); // Optionally, set a smaller font size for the instructions
    // pdf.text("General Instructions:", 10, lineY + 10);
    // pdf.text("1. Use your Slip ID and SRN Number to check registration status and Download the admit card.", 10, lineY + 20);
    // pdf.text("2. Check your registration status after 3 days. If accepted, it will show 'Registration Successful'.", 10, lineY + 30);
    // pdf.text("3. Submission of wrong details can lead to rejection of registration form:", 10, lineY + 40);

    // Footer instructions
    const footerY = pdf.internal.pageSize.height - 20; // Y-coordinate for the footer
    // pdf.text("Note: If you have any doubt regarding registration, then contact us: 7982108494, 7982109268.", 10, footerY);

    // Draw line in the footer
    pdf.line(10, footerY + 5, 200, footerY + 5); // Draw line from (10, footerY + 5) to (200, footerY + 5)

    // Save the PDF
    pdf.save(
      `${name || student.name}_${srn || student.srn}_acknowledgement-slip.pdf`
    );

    //Neeche wale routes phle ye check krte hai ki slip download krne wala person user hai ya fir sel, then accordingly...
    //... user route karaya jaata hai. Agar Self registration hai, to acknowledgemen download krne k baad, user...
    //... direct landing page pr route ho jata hai. Or agar User-logged in hai to usko input srn pr route kara dete hai.

    // if (location.pathname === '/acknowledgementslip-mb'
    //     || location.pathname === '/acknowledgementslip-100' ||
    //     location.pathname === '/Registration-form/put/MB' ||
    //     location.pathname === '/Registration-form/put/S100'
    // ){
    //     navigate('/examination'); // Navigate after downloading
    // }

    if (user && location.pathname === "/acknowledgementslip-mb") {
      navigate("/srn");
    } else if (user && location.pathname === "/acknowledgementslip-100") {
      navigate("/srn-100");
    } else if (user && location.pathname ==="/Registration-form/put/S100") {
      navigate("/srn-100");
    } else if (user && location.pathname ==="/Registration-form/put/MB") {
      navigate("/srn");
    }
    
    else if (
      location.pathname === "/acknowledgementslip-mb" ||
      location.pathname === "/acknowledgementslip-100" ||
      location.pathname === "/Registration-form/put/MB" ||
      location.pathname === "/Registration-form/put/S100"
    ) {
      navigate("/"); // Navigate after downloading
    }
  }
  //^^^Acknowledgement Slip Template^^^^^^

  console.log(user);

  return (
    <Container>
      {modal ? (
        <>
          <div className="modalAck">
            <div
              className="modal-contentAck"
              style={{
                display: "grid",
                justifyContent: "center", // Centers the div horizontally
                alignItems: "center", // Centers the div vertically
                minHeight: "100%", // Ensures the div takes the full height of the viewport
                padding: "20px", // Adds some padding around the div
                flexDirection: "column",
              }}
            >
              <Card
                id="acknowledgementSlip"
                style={{
                  width: "100%", // Make the card width responsive
                  maxWidth: "1000px", // Limit the max width to 1000px
                  border: "",
                  display: "flex",
                }}
              >
                <Card.Title>
                  <header
                    className="acknowledgment-header"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px",
                    }}
                  >
                    <img
                      src="/haryana.png"
                      style={{ width: "50px", marginRight: "20px" }}
                    />

                    {/* Container for the text */}
                    <div
                      style={{
                        flexGrow: 1,
                        textAlign: "center",
                        marginRight: "20px",
                      }}
                    >
                      <h5>{examLevel}</h5>
                      <h5>{examLevelSlip}</h5>
                      <h5>{examLevelBatch}</h5>
                      <h5>{`Registration Status: ${
                        isVerified || student.isVerified || "Pending"
                      }`}</h5>

                      <h6>
                        {isVerified === "Verified" ||
                        student.isVerified === "Verified" ? (
                          <>
                            Your Registration form is verified for Level 1
                            Examination.
                            <br /> (आपका पंजीकरण फॉर्म लेवल 1 परीक्षा के लिए
                            सत्यापित है।)'
                          </>
                        ) : (
                          <>
                            {isVerified === "Pending" ||
                            student.isVerified === "Pending" ? (
                              <h6 style={{ fontSize: "12px" }}>
                                Your Registration form is under verification.
                                Registration status will update once verified.
                                <br /> (आपका फॉर्म सत्यापन में है। सत्यापन के
                                बाद आपकी पंजीकरण स्थिति अपडेट की जाएगी।)
                              </h6>
                            ) : (
                              <>
                                {isVerified === "Rejected" ||
                                student.isVerified === "Rejected" ? (
                                  <>
                                    Rejection Reason:{" "}
                                    {student.verificationRemark}
                                  </>
                                ) : <h6 style={{ fontSize: "12px" }}>
                                Your Registration form is under verification.
                                Registration status will update once verified.
                                <br /> (आपका फॉर्म सत्यापन में है। सत्यापन के
                                बाद आपकी पंजीकरण स्थिति अपडेट की जाएगी।)
                              </h6>}
                              </>
                            )}
                          </>
                        )} 
                      </h6>
                    </div>
                    <Button
                      variant="close"
                      onClick={CloseModal}
                      style={{ marginLeft: "20px" }}
                    />
                  </header>
                  <hr />
                </Card.Title>
                <Card.Body>
                  {location.pathname === "/acknowledgementslip-100" ||
                  location.pathname === "/acknowledgementslip-mb" ? (
                    <div>
                      <Container>
                        <Row xs={1} md={2} style={{ gap: "10px" }}>
                          <Col>
                            <Row>
                              <Col>1. Slip ID:</Col>
                              <Col>{student.slipId}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>2. SRN:</Col>
                              <Col>{student.srn}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>3. Name (नाम):</Col>
                              <Col>{student.name}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>4. Father's Name (पिता का नाम):</Col>
                              <Col>{student.father}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>5. D.O.B (जन्म तिथि):</Col>
                              <Col>{student.dob}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>6. Gender (लिंग):</Col>
                              <Col>{student.gender}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>7. Category (श्रेणी):</Col>
                              <Col>{student.category}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>8. Class (कक्षा):</Col>
                              <Col>{student.grade}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>9. District (जिला):</Col>
                              <Col>{student.district}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>10. Block (ब्लॉक):</Col>
                              <Col>{student.block}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>11. School (स्कूल):</Col>
                              <Col>{student.school}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>
                                Registration Status (पंजीकरण की स्थिति):
                              </Col>
                              <Col> {isVerified || student.isVerified || "Pending"}</Col>
                            </Row>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  ) : (
                    <div>
                      <Container>
                        <Row xs={1} md={2} style={{ gap: "10px" }}>
                          <Col>
                            <Row>
                              <Col>Slip ID:</Col>
                              <Col>{student.slipId}</Col>{" "}
                              {/*slipid supposed to be unq id for student so itwon't change*/}
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>SRN:</Col>
                              <Col>{slipData.srn}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>Name (नाम):</Col>
                              <Col>{slipData.name}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>Father's Name (पिता का नाम):</Col>
                              <Col>{slipData.father}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>D.O.B (जन्म तिथि):</Col>
                              <Col>{slipData.dob}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>Gender (लिंग):</Col>
                              <Col>{slipData.gender}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>Category (श्रेणी):</Col>
                              <Col>{slipData.category}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>Class (कक्षा):</Col>
                              <Col>{slipData.grade}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>District (जिला):</Col>
                              <Col>{slipData.district}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>Block (ब्लॉक):</Col>
                              <Col>{slipData.block}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>School (स्कूल):</Col>
                              <Col>{slipData.school}</Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col>
                                Registration Status (पंजीकरण की स्थिति):
                              </Col>
                              <Col> {isVerified || student.isVerified}</Col>
                            </Row>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  )}
                </Card.Body>

                <Card.Footer>
                  <footer style={{ background: "white" }}>
                    <h3>General Instructions/सामान्य निर्देश:</h3>
                    <hr />
                    <p>
                      1. Use your Slip ID and SRN Number to check registration
                      status and Download the admit card.
                      <br />
                      (पंजीकरण की स्थिति की जांच करने और प्रवेश पत्र डाउनलोड
                      करने के लिए अपनी पर्ची आईडी और एसआरएन नंबर का उपयोग करें।)
                    </p>
                    <p>
                      2. Check your registration status after 3 days. If
                      accepted, it will show "Registration Successful. <br />
                      (3 दिनों के बाद अपनी पंजीकरण स्थिति की जाँच करें। यदि
                      स्वीकार किया जाता है, तो यह "Reigstration सफल" दिखाएगा।)
                    </p>
                    <p>
                      3. If your registration still shows pending or rejected,
                      after 3 days, then either register again or call on given
                      number. <br />
                      (यदि आपका पंजीकरण 3 दिनों के बाद भी लंबित या अस्वीकार
                      दिखाता है, तो या तो फिर से पंजीकरण करें या दिए गए नंबर पर
                      कॉल करें।)
                    </p>
                    <hr />
                    <p>
                      Note: If you have any doubts regarding registration,
                      please contact us at. <br />
                      (यदि आपको पंजीकरण के संबंध में कोई संदेह है, तो कृपया हमसे
                      संपर्क करें। सुबह 10 बजे से शाम 5 बजे तक उपलब्ध।):
                      7982108494, 7982109268{" "}
                    </p>
                  </footer>
                </Card.Footer>
              </Card>
                       
              <Button onClick={DownloadPDF}>
                Download Acknowledgement Slip
              </Button>

              <br></br>
              {student.isVerified === "Verified" ? (null):( <p>
                If you entered any incorrect details, click 'Edit' to update and
                resubmit the form. <br />
                (अगर आपने फॉर्म में कोई जानकारी गलत भरी है, तो 'संपादित करें' पर
                क्लिक करके फॉर्म फिर से जमा करें।)
              </p>)} 
             
              {student.isVerified === "Verified" ? (null):(<Button onClick={UpdateForm}>Edit Details</Button>)} 
              
            </div>
          </div>
        </>
      ) : (
        <p>No data</p>
      )}
    </Container>
  );
}
