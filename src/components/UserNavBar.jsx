import {Container, Row, Col, Button, Nav} from 'react-bootstrap';


import React, {useContext, useEffect, userContext} from 'react';
import {UserContext} from "./ContextApi/UserContextAPI/UserContext";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function UserNavBar() {

const navigate = useNavigate();

//Only works when user logins. Entry point is from UserSignIn Component
const {user} = useContext(UserContext);
const {setUser} = useContext(UserContext);


//below useeffec
useEffect(()=>{
    if(user){
       
    }else{
        navigate('/user-signin')
    }

},[user])

function handleSignOut(){
    alert('Signed Out')
    setUser('')
    navigate('/user-signin')
}


try {

    return (
        <Container fluid>
        
        <Row style={{ backgroundColor: '#1e90ff', border:'solid black'}} >
        <Col style={{textAlign:'left'}}><img src="/haryana.png" style={{ width: '80px', height: 'auto' }} /></Col>
        <Col style={{textAlign:'center'}}>
        <p>Haryana Pratibha Khoj </p>
        <p>2025-27</p>
        </Col>
        <Col style={{textAlign:'right'}}>
        <p >Signed in as: {user.userName  }</p>
        </Col>

        
        </Row>
        <Nav defaultActiveKey="/userprofile" as="ul">
        <Nav.Item as="li">
        <Nav.Link href="/">Home Page</Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link href="/userprofile">Go Back</Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link onClick={handleSignOut}>SignOut</Nav.Link>
      </Nav.Item>
    </Nav>
         
          </Container>
        );
    
    
} catch (error) {
    console.log(error)
    
}
  
}

export default UserNavBar;