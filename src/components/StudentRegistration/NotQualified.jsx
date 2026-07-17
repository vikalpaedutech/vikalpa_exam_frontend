import React from "react";
import { Container, Card } from "react-bootstrap";

export const StudentNotFound = ({ studentName = "Student" }) => {
  const cardStyle = { 
    borderRadius: "12px", 
    padding: "14px", 
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    maxWidth: "800px",
    margin: "40px auto"
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm" style={cardStyle}>
        <Card.Header className="bg-white text-center border-0 py-2">
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "35px", 
              fontWeight: 700, 
              color: "#555",
              marginBottom: "10px"
            }}>
              NOT QUALIFIED!
            </div>
          </div>
        </Card.Header>

        <hr style={{ margin: "20px 0" }} />

        <Card.Body style={{ padding: "20px" }}>
          <p style={{
            color: "#444",
            fontWeight: "bold",
            lineHeight: "1.7",
            fontSize: "18px",
            textAlign: "center"
          }}>
            Dear {studentName},<br /><br />
            
            You have Not Qualified the Haryana Super 100 Entrance Examination Level-1 (Extended 100 Seats). 
            We encourage you to continue your academic efforts and wish you success in your future endeavors.
            <br /><br />
            
            <span style={{ 
              fontWeight: "normal", 
              fontSize: "16px",
              display: "block",
              marginTop: "15px"
            }}>
              (आप हरियाणा सुपर 100 प्रवेश परीक्षा स्तर-2 (100 अतिरिक्त सीटें) उत्तीर्ण नहीं कर पाए हैं। 
              हम आपको आपके शैक्षणिक प्रयास जारी रखने के लिए प्रोत्साहित करते हैं और 
              आपके भविष्य के प्रयासों में आपकी सफलता की कामना करते हैं।)
            </span>
          </p>
        </Card.Body>

        <Card.Footer className="bg-white text-center border-0 py-3">
          <div style={{ 
            fontSize: "14px", 
            color: "#666",
            fontWeight: "500"
          }}>
            Result Session 2026-28
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

