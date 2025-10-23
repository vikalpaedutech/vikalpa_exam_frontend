import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import UserNavBar from "../components/UserNavBar";

export default function UserRegistrationPageMB () {
    
    return(
        


<div
    >
    <UserNavBar />
    <Container style={{
      display: 'flex',
      flexDirection:'column',
      justifyContent: 'center',   // Centers horizontally
      alignItems: 'center',       // Centers vertically
      height: '50vh'             // Takes full viewport height
    }}>

      <Row>
        <h3>Mission Buniyaad Registrations Batch 2025-27</h3>
        <hr></hr>
      </Row>
    
    <Row >
      <Col >
      <Link to="/srn"><Button style={{width:'300px'}} >Mission Buniyaad Individual</Button></Link>
      <br></br>
      <br></br>
      <Link to ='/userprofile/bulkregister-mb'> <Button style={{width:'300px'}}>Bulk Registrations</Button></Link>
      <br></br>
      <br></br>
      
      </Col>
      
    </Row>
    
    
    
    </Container>
    </div>
    
    )



}