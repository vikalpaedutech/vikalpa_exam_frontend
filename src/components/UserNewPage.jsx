import React, {useState, useEffect} from 'react';
import UserService from '../services/UserService';
import UserSignUp from './UserSignup';
import {Link, Form, Navigate, useNavigate, useLocation} from 'react-router-dom';
import UserParentComponent from './UserParentComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';
import RegistrationFormComponent from './RegistrationFormComponent';

import { useContext } from 'react';
import UserContext from './ContextApi/UserContextAPI/UserContext';




export default function UserPage () {

    const A = useContext(UserContext);
    
    console.log(A)

    const location = useLocation();
    const mobileUserSignIn = location.state?.mobile || "";

    const [userName, setUserName] =  useState('');
    const [designation, setDesignation]= useState('');
    const [mobile, setMobile] = useState('');
    const [district, setDistrict] = useState('');
    const [block, setBlock] =  useState('');
    const [school, setSchool] = useState('');
//__________________________________________________________________
//States for handling button click...
    const [registerClick, setRegisterClick] = useState(false);

    

    const fetchUser = async (mobile) =>{
        if (!mobile) return;

        try {
         setUserName(A.userName);
         setDesignation(A.designation);
         setMobile(A.mobile);
         setDistrict(A.district);
         setBlock(A.block);
         setSchool(A.school);



        } catch (error) {
            console.log("Error fetching Posts", error);
        }
    }

    useEffect(() => {
    //It will trigger the fetchUser API whenver 'mobileUserSignIn' changes.
        if (A) {
            fetchUser(A);
        }
    }, [A]);

    const handleRegisterClick = ()=>{
        setRegisterClick(true);
    }
    

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Card style={{ width: '50rem', height:'45rem' }} className="text-center">
            <Card.Body>
                <Card.Title>Hello</Card.Title>
                <Card.Text>
                  
                    
                </Card.Text>
                <hr></hr>
                <Link to='/srn'><Button variant="dark" style={{width:'20rem'}} >Register Mission Buniyaad: Class 8th Students</Button></Link> 
           <br/><br/>
            <Link><Button variant="dark" style={{width:'20rem'}} >Register Super 100: Class 10th Students</Button></Link>
            <br/><br/>
            <Link><Button variant="dark" style={{width:'20rem'}} >Bulk Upload MB/S100</Button></Link>
            <br/><br/>
            <Link><Button variant="dark" style={{width:'20rem'}}>Check Your Dashboard</Button></Link>
                <br/><br/>
            
            </Card.Body>
        </Card>

        
    </div>
);

    
};