import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import UserNavBar from "../components/UserNavBar";

export default function UserRegistrationPage100 () {
    
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
        <h3>Super 100 Registrations Batch 2025-27</h3>
        <hr></hr>
      </Row>
      <br></br>
    <Row >
      
      <Col >
      <Link to="/srn-100"><Button style={{width:'300px'}} >Super 100 Individual</Button></Link>
      <br></br>
      <br></br>
      <Link to ='/userprofile/bulkregister-100'> <Button style={{width:'300px'}}>Super 100 Bulk Registrations</Button></Link>
      <br></br>
      <br></br>
      
      </Col>
      
    </Row>
    
    
    
    </Container>
    </div>
    
    )



}