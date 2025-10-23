import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarDashboard from "../components/NavbarDashaboard";

//Below Import are used to interact with ther services to fetch the count of total registraitons.
import RegistratonFormService from "../services/RegistrationFormService"; // I can remove this
import DashBoardServices from "../services/DashBoardServices";






export default function DashBoardPage () {


    const [stateDash8, setStateDash8] = useState([]);
    const [stateDash10, setStateDash10] = useState([]);


    //Below block of code fetches the class 8th dashboard to show the total registraiton count.


    const fetchPosts = async () => {
      try {
        const response = await DashBoardServices.getDashBoard8();
        setStateDash8(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error occured in fetching posts", error);
      }
    };
  
    useEffect(() => {
      fetchPosts();
    }, []);
  
    console.log(stateDash8);
  
    //Below variables are for shwoing total count on dashboars:
    const totalDistrictCount8 = stateDash8.reduce((sum, eachDistrictCount) => {
      return sum + eachDistrictCount.totalQualifiedCount1;
    }, 0);
  console.log(totalDistrictCount8)

  //made live on 20-Dec-2024 (Admit Card count class 8th)

  const totalAdmitCardCount8 = stateDash8.reduce((sum, eachAdmitCardCount) => {
    return sum + eachAdmitCardCount.totalAdmitCardCount3;
  }, 0);
console.log(totalDistrictCount8)
  
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    //Below block of code fetches the class 10th dashboard to show the total registraiton count.
  
    const fetchPosts10 = async () =>{
        try {
            
            const response = await DashBoardServices.getDashBoard10();
            setStateDash10(response.data);
            console.log(response.data)
            
            
        } catch (error) {
            console.log('Error occured in fetching posts', error);
        }
    };
    
    useEffect(() =>{
        fetchPosts10();
    }, []);
    
    console.log(stateDash10)
    
     //Below variables are for shwoing total count on dashboars:
     const totalDistrictCount10 = stateDash10.reduce((sum10, eachDistrictCount10) => {
      return sum10 + eachDistrictCount10.districtCount;
    }, 0);
    console.log(totalDistrictCount10)
    
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    
  //made live on 28-Jan-2025 (Admit Card count class 10th)
  const totalAdmitCardCount10 = stateDash10.reduce((sum10, eachAdmitCardCount10) => {
    return sum10 + eachAdmitCardCount10.totalResultStatusCount1;
  }, 0);
console.log(totalDistrictCount8)
  
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    

 const mbBack = '/Buniyaad.png'


    return (
        <>
        <NavbarDashboard/>
        <br/>
        <Container style={{textAlign:"center"}}>
            <Row>
                <Col>
                <h5 style={{fontWeight:'bold'}}>Mission Buniyaad Level-2 Qualified Students: 6672 </h5> 
                </Col>
                {/* {totalDistrictCount8} */}
                
            </Row>
            <Row>
            {/* <Col><h5 style={{fontWeight:'bold', color:'red'}}>Mission Buniyaad Level-2 Result: {totalAdmitCardCount8}</h5></Col> */}
            <Col><h5 style={{fontWeight:'bold', color:'red'}}>Mission Buniyaad Level-3 Admit Card: {totalAdmitCardCount8}</h5></Col>

            </Row> 

            <Row>
                <Col>
                <h5 style={{fontWeight:'bold'}}>Haryana Super 100 Level-1 Result: 2243</h5>
                </Col>
            </Row>

            <Row>
            <Col><h5 style={{fontWeight:'bold', color:'red'}}>Haryana Super 100 L-1 Result: {totalAdmitCardCount10}</h5></Col>

            </Row> 
        

{/* 
            <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body style={{backgroundImage:`url(${mbBack})`,
    backgroundSize: '80%', 
    backgroundPosition: 'center', 
    color: 'Black' }}>
        <Card.Title>Mission Buniyaad</Card.Title>
        <Card.Text>
        {totalDistrictCount8}
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card> */}

            <hr/>
           <Row>
            <h3>Misson Buniyaad Dashboards</h3>
            
            <Link to={'/districtblockdash-mb'}>District Dashboard MB</Link>
            <Link to={'/blockschooldash-mb'}>Block Dashboard MB</Link>
            <Link to={'/schooldash-mb'}>School Dashboard MB</Link>

            <h3>Haryana Super 100 Dashboards</h3>
            <Link to={'/districtblockdash-100'}>District Dashboard 100</Link>
            
            <Link to={'/blockschooldash-100'}>Block Dashboard 100</Link>
            
            <Link to={'/schooldash-100'}>School Dashboard Super 100</Link>
           </Row>
        
        </Container>
        </>

    )
}