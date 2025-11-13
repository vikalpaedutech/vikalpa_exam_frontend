import React from "react";
import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const MainUserNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally clear auth or localStorage here
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <footer
   
      >
        <br></br>
      
        <Container fluid>
          <Row >
            <Col md="auto">
              <Nav className="d-flex justify-content-center gap-3">
                <Button
                className="user-nav-button"
                  variant="outline-danger"
                  
                  onClick={() => navigate("/exam-user-dash")}
                >
                  Go Home
                </Button>
                <Button className="user-nav-button" variant="outline-danger"  onClick={handleLogout}>
                  Logout
                </Button>
                
              </Nav>
            </Col>
          </Row>
          <hr></hr>
        </Container>
      </footer>


      {/* <style>
        {`
          @media (max-width: 600px) {
            footer {
              flex-direction: column; 
              align-items: center; 
              height: auto;
            }
            user-nav-button {
              width: 100%;
              
              margin: 5px 0;
            }
          }
        `}
      </style> */}
    </div>
  );
};



    //  style={{
    //       background: "white",
    //       display: "flex",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       padding: "10px",
    //       height: "10vh",
    //     }}