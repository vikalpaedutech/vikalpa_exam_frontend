import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { Link } from "react-router-dom";

const customStyles = {
  color: "black",
};

export default function Footer() {
  return (
    <div style={{ textAlign: "center" }}>
      <footer
        style={{
          background: "#0F326F",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px", // Adjust padding as needed
          border: "solid",
          // marginTop:'50vh',
          height: "50vh",
        }}
      >
        <Container fluid>
          <Row>
            
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
              <img
                src="/vikalpalogo.png"
                style={{ width: "100px", height: "auto" }}
              />
              <h6 style={{ color: "#F2FFD7", fontWeight: "bold",  }}>Vikalpa Foundation Trust</h6>
              </div>
             
              <h6 style={{ color: "#F2FFD7", fontWeight: "bold",  }}>
                
                पंजीकरण से संबंधित किसी भी जानकारी या समस्या के लिए, नीचे दिए गए
                नंबर पर संपर्क करें (हेल्पलाइन: सुबह 10 बजे से शाम 5 बजे तक उपलब्ध।): <br/><br/>
                7982109215, 7982108494
              </h6> 
              {/* 7982109215 ripudaman, 7982108494 Khushi */}
            
              
            </div>
           
          </Row>
          <hr></hr>
         
          <hr></hr>

        </Container>
        
        
      </footer>   
      <Container fluid> 
          <Row
          style={{
            background:'black',
            height:'50px',
            width: ''
          }} >
           <Col>
           <Link to={''}><img src="/facebook.png" style={{height:50, width:50}}/></Link>
           </Col>
           <Col>
           <Link to={''}><img src="/insta.png" style={{height:40, width:40}}/></Link>
           </Col>
           <Col>
           <Link to={''}><img src="/youtube.png" style={{height:50, width:50}}/></Link>
           </Col>
          </Row>
          </Container>

      <style>
        {`
              @media (max-width: 600px) {
                footer {
                  flex-direction: column; 
                  align-items: center; 
                }
                img {
                  margin: 5px 0;
                  width: 80px;
                  height: auto;
                }
                h1 {
                  font-size: 24px; /* Adjust as needed */
                }
                h2 {
                  font-size: 20px; /* Adjust as needed */
                }
                h3 {
                  font-size: 18px; /* Adjust as needed */
                }
              }
            `}
      </style>
    </div>
  );
}
