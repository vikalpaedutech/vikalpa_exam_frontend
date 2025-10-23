import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import registrationServiceInstance from "../services/RegistrationFormService";
import AcknowledgementSlip from "./AcknowledgementSlip";
import { StudentContext } from "./ContextApi/StudentContextAPI/StudentContext";
import { UserContext } from "./ContextApi/UserContextAPI/UserContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import UserNavBar from "./UserNavBar";
import {Container, Nav} from 'react-bootstrap';


function ManualEntryInputSrn({}) {

  const location = useLocation();
  const navigate = useNavigate();


 let direcTo;
 let PutDirectTo;

 
if (location.pathname==='/manualentryinputsrn'){
  direcTo = "manualformentry'"
  PutDirectTo = "/manualformentry"
}
//  else {

//     direcTo = "/Registration-form/MB"
//   PutDirectTo = "/Registration-form/put/MB"

// }
   
  const {setStudent} = useContext(StudentContext);
  const {student} = useContext(StudentContext);

  const [inputSrn, setInputSrn] = useState(null);
  const [id, setId] = useState('')
//   const [srn, setSrn] = useState('');
  //it checks the input srn value and matches with db using if and else condition. if value matches
  //... then renders Prefilled form other wise blank form.

  const [error, setError] = useState(null);
  const [isSrnMatched, setIsSrnMatched] = useState(false);
  const [errorRedirect, setErrorRedirect] = useState(false);


  const {user} = useContext(UserContext);

  const [ShowAck, setShowAck] = useState(false);

  const [slipData, setSlipData]= useState({});

 



  const handleSubmit = async function (e) {
    e.preventDefault();

   const newSrn = inputSrn
//    console.log(newSrn);

   
    try {
        const response = await registrationServiceInstance.getPostsBySrn(newSrn)
        console.log(response.data.data.srn)
        console.log(response.data.data._id)
        console.log(response.data.data.isVerified)
        setStudent(response.data.data)
        sessionStorage.setItem('user', JSON.stringify(response.data.data)); // Store user data in localStorage
        setSlipData(response.data.data); 

        if(response.data.data.isRegisteredBy === ""){
            
            setIsSrnMatched(true)
            setId(response.data.data._id)
        }
        else if (response.data.data.isRegisteredBy !== "") {
            setIsSrnMatched(false)
            alert('This SRN is alredy registered. Try another srn')
            
        }
        // else if {
        //     // setShowAck(true)
        //     setIsSrnMatched(false)
        //     return <Navigate to={'/manualentry'}/>

        // } 
        
        
    } catch (error) {
        console.error(error);
        setError("Correct SRN needed"); // Set error state for exceptions
        setErrorRedirect(true); // Trigger redirect on error
        navigate('/manualentry')
    }

   


  };


  if (isSrnMatched==true){
    return <Navigate to={PutDirectTo} state={{ srn: inputSrn, id:id}} />;
  } else{
    
  }
//   else if (ShowAck)  {
//       if (location.pathname === '/srn'){
//         navigate('/acknowledgementslip-mb')
//       } else if (location.pathname === '/srn-100'){
//         navigate('/acknowledgementslip-100')
//       }

//     // return <AcknowledgementSlip slipData={slipData}/>;
//   } else if (errorRedirect) {
//     return <Navigate to={direcTo}/>; // Redirect to your error page
//   } 

  
  

  // if (isSrnMatched==true) {
  //   return <Navigate to="/Registration-form/put/MB" state={{ srn: inputSrn, id:id}} />;
  // } else if (errorRedirect) {
  //   return <Navigate to="/Registration-form/MB"/>; // Redirect to your error page
  // }




  return (
    <>

    {user ? (
      <>
      <Navbar/>
        <br/><br/>
      </>
        
  
  
  ):(
  
    <>
  <Navbar/>

  <Nav defaultActiveKey="/userprofile" as="ul">
        <Nav.Item as="li">
          <Nav.Link href="/manualentryinputsrn">Home Page</Nav.Link>
        </Nav.Item>
      </Nav>
    
  
  </>)}
 
    <Container
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh", 
      
      }}
    >
      
      <form
        id="InputSrn"
        style={{
          width: "500px",
          height: "50vh",
          border: "1px solid #000",
          display: "flex",
          flexDirection: "column", // Stack elements vertically
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50px",
          borderWidth: "3px",
        }}
        onSubmit={handleSubmit}
      >
        <label style={{textAlign:'center'}}>ENTER YOUR SRN <br/>(अपना एसआरएन भरे)<br/><small style={{fontSize:'15px'}}>(नोट: यदि आपको "SRN" के बारे में जानकारी नहीं है, तो आप अपने विद्यालय के प्रधानाचार्य से SRN प्राप्त कर सकते हैं।)</small></label>
        
        <br />
        <input
        type="text" 
        maxlength="10" 
          name="srn"
          placeholder="Enter Your SRN Here"
          onChange={(e) => setInputSrn(e.target.value)}
          oninput={(e) => this.value.replace(/[^0-9]/g, '').slice(0, 10)}
        />
        <br />
        <button>Submit</button>
       
      </form>
      {console.log(inputSrn)}
      
    </Container>
    <br/>
    <Footer/>
    </>
  );
}

export default ManualEntryInputSrn;
