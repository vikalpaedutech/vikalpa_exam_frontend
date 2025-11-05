import React from "react";
import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const MainStudentNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally clear auth or localStorage here
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <footer
        style={{
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
          height: "10vh",
        }}
      >
        <Container fluid>
          <Row >
            <Col md="auto">
              <Nav className="d-flex justify-content-center gap-3">
                <Button
                  variant="outline-danger"
                  
                  onClick={() => navigate("/")}
                >
                  Go Home
                </Button>
                {/* <Button variant="outline-danger"  onClick={handleLogout}>
                  Logout
                </Button> */}
                
              </Nav>
            </Col>
          </Row>
          <hr></hr>
        </Container>
      </footer>


      <style>
        {`
          @media (max-width: 600px) {
            footer {
              flex-direction: column; 
              align-items: center; 
              height: auto;
            }
            button {
              width: 80%;
              margin: 5px 0;
            }
          }
        `}
      </style>
    </div>
  );
};
