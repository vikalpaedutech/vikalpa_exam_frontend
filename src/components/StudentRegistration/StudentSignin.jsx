// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import { StudentContext } from "../NewContextApis/StudentContextApi";
// import { Form, Container, Card, Button, Alert, Spinner } from "react-bootstrap";
// import { getStudentBySrnNumberOrSlipId } from "../../services/StudentRegistrationServices/StudentRegistrationService";
// import { useNavigate, useLocation } from "react-router-dom";
// export const StudentSignin = () => {

//     const navigate = useNavigate();
//     const location = useLocation();

//     const { studentData, setStudentData } = useContext(StudentContext);

//     // Local state for the input and loading / error
//     const [srnOrSlip, setSrnOrSlip] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);



//     //Below useffect sets the studentData to empty object so that as soon as...
//     //...user comes on this page state gets empty
//     useEffect(() => {
//         setStudentData({})
//     }, [])


//     //-------------------------

//     // Log studentData whenever it changes (console log once it's set)
//     useEffect(() => {
//         if (studentData) {
//             console.log("✅ Student stored in context:", studentData);
//         }
//     }, [studentData]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);

//         // Basic guard
//         if (!srnOrSlip || srnOrSlip.trim() === "") {
//             setError("Please enter SRN number or Slip-Id.");
//             return;
//         }

//         setLoading(true);
//         try {
//             // Try as SRN first; backend supports either srn or slipId, adjust as needed
//             const rqBody = { srn: srnOrSlip.trim() };
//             const res = await getStudentBySrnNumberOrSlipId(rqBody);

//             if (res && res.ok && res.student) {
//                 // store returned object in StudentContext
//                 setStudentData(res.student);



//                 // console.log the response student immediately too
//                 console.log("✅ Student fetched from API:", res.student);



//                 // keep your original alert behavior

//                 //Below validates if the clicked route belongs to 8 or 10

//                 if (location.pathname === "/exam-student-signin-mb" && res.student.classOfStudent === "8") {

//                     //handling the case if student is not registered
//                     if (res.student.isRegisteredBy === "" || res.student.isRegisteredBy === undefined 
//                         || res.student.isRegisteredBy === null){
//                              alert('ho')
//                             alert("Login successfully!");
//                     if (location.pathname === "/user-student-signin-mb") {
//                         navigate('/user-registration-form-mb')
//                     } else if (location.pathname === "/user-student-signin-s100") {
//                         navigate('/user-registration-form-s100')
//                     } else if (location.pathname === "/exam-student-signin-mb") {
//                         navigate('/exam-registration-form-mb')

//                     } else if (location.pathname === "/exam-student-signin-s100") {
//                         navigate('/exam-registration-form-s100')

//                     }

//                     } else {
//                         alert('ho')
//                         if (location.pathname === "/exam-student-signin-mb"){
//                             navigate('/exam-acknowledgement-slip-mb')
//                         } else if (location.pathname === "/exam-student-signin-s100") {
//                              navigate('/exam-acknowledgement-slip-s100')
//                         } else if (location.pathname === "/user-student-signin-mb"){
//                                 alert("Student is alrady registered!")
//                                  navigate('/user-student-signin-mb')
//                         } else if (location.pathname === "/user-student-signin-s100"){
//                                 alert("Student is alrady registered!")
//                                  navigate('/user-student-signin-s100')
//                         }
                        
                        



//                     }
                    

//                 } else if (location.pathname === "/exam-student-signin-s100" && res.student.classOfStudent === "10") {

//                     alert("Login successfully!");
//                     if (location.pathname === "/user-student-signin-mb") {
//                         navigate('/user-registration-form-mb')
//                     } else if (location.pathname === "/user-student-signin-s100") {
//                         navigate('/user-registration-form-s100')
//                     } else if (location.pathname === "/exam-student-signin-mb") {
//                         navigate('/exam-registration-form-mb')

//                     } else if (location.pathname === "/exam-student-signin-s100") {
//                         navigate('/exam-registration-form-s100')

//                     }


//                 } else if (location.pathname === "/user-student-signin-mb" && res.student.classOfStudent === "8") {

//                     alert("Login successfully!");
//                     if (location.pathname === "/user-student-signin-mb") {
//                         navigate('/user-registration-form-mb')
//                     } else if (location.pathname === "/user-student-signin-s100") {
//                         navigate('/user-registration-form-s100')
//                     } else if (location.pathname === "/exam-student-signin-mb") {
//                         navigate('/exam-registration-form-mb')

//                     } else if (location.pathname === "/exam-student-signin-s100") {
//                         navigate('/exam-registration-form-s100')

//                     }


//                 } else if (location.pathname === "/user-student-signin-s100" && res.student.classOfStudent === "10") {

//                     alert("Login successfully!");
//                     if (location.pathname === "/user-student-signin-mb") {
//                         navigate('/user-registration-form-mb')
//                     } else if (location.pathname === "/user-student-signin-s100") {
//                         navigate('/user-registration-form-s100')
//                     } else if (location.pathname === "/exam-student-signin-mb") {
//                         navigate('/exam-registration-form-mb')

//                     } else if (location.pathname === "/exam-student-signin-s100") {
//                         navigate('/exam-registration-form-s100')

//                     }


//                 } else {

//                     setStudentData({});



//                     alert('Please select the right linkg!')
//                 }





//             } else {
//                 // handle not found or other server responses
//                 const msg = (res && res.message) || "Student not found or unexpected response.";

//                 alert('jp')
//                 setError(msg);
//                 // still console log the full response for debugging
//                 console.log("API response:", res);


//             }
//         } catch (err) {
//             console.error("Error fetching student:", err);

//             setError(err?.message || "An error occurred while logging in.");

//             if (location.pathname === "/exam-student-signin-mb") {
//                 navigate('/exam-registration-form-mb')
//             } else if (location.pathname === "/exam-student-signin-s100") {
//                 navigate('/exam-registration-form-s100')
//             } else if (location.pathname === "/user-student-signin-mb") {
//                 navigate('/user-registration-form-mb')
//             } else if (location.pathname === "/user-student-signin-s100") {
//                 navigate('/user-registration-form-s100')
//             }


//         } finally {
//             setLoading(false);
//         }
//     };

//     return (

//         <Container
//             fluid
//             className="d-flex justify-content-center align-items-center bg-light"
//             style={{ height: '40vh' }}
//         >
//             <Card className="p-4 shadow-lg" style={{ width: "350px", borderRadius: "16px" }}>
//                 <Card.Header style={{ textAlign: 'center' }}>
//                     <span style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>  ENTER SRN
//                         (एसआरएन भरे)</span>
//                     <br></br>
//                     <span style={{ fontSize: '80%' }}>(नोट: यदि आपको "SRN" के बारे में जानकारी नहीं है, तो आप अपने विद्यालय के प्रधानाचार्य से SRN प्राप्त कर सकते हैं।)</span>
//                 </Card.Header>
//                 <Card.Body>
//                     {/* <h3 className="text-center mb-4">Login</h3> */}

//                     <Form onSubmit={handleSubmit}>
//                         {error && <Alert variant="danger">{error}</Alert>}

//                         <Form.Group className="mb-3" controlId="formBasicMobile">
//                             <Form.Control
//                                 type="text"
//                                 placeholder="Enter your srn"
//                                 value={srnOrSlip}
//                                 onChange={(e) => setSrnOrSlip(e.target.value)}
//                                 required
//                             />
//                         </Form.Group>

//                         <div className="d-grid">
//                             <Button variant="primary" type="submit" disabled={loading}>
//                                 {loading ? (
//                                     <>
//                                         <Spinner
//                                             as="span"
//                                             animation="border"
//                                             size="sm"
//                                             role="status"
//                                             aria-hidden="true"
//                                             className="me-2"
//                                         />
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     "Submit"
//                                 )}
//                             </Button>
//                         </div>
//                     </Form>
//                 </Card.Body>
//             </Card>
//         </Container>
//     );
// };


















import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../NewContextApis/UserContext";
import { StudentContext } from "../NewContextApis/StudentContextApi";
import { Form, Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { getStudentBySrnNumberOrSlipId } from "../../services/StudentRegistrationServices/StudentRegistrationService";
import { useNavigate, useLocation } from "react-router-dom";
export const StudentSignin = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { studentData, setStudentData } = useContext(StudentContext);

    // Local state for the input and loading / error
    const [srnOrSlip, setSrnOrSlip] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    //Below useffect sets the studentData to empty object so that as soon as...
    //...user comes on this page state gets empty
    useEffect(() => {
        setStudentData({})
    }, [])


    //-------------------------

    // Log studentData whenever it changes (console log once it's set)
    useEffect(() => {
        if (studentData) {
            console.log("✅ Student stored in context:", studentData);
        }
    }, [studentData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic guard
        if (!srnOrSlip || srnOrSlip.trim() === "") {
            setError("Please enter SRN number or Slip-Id.");
            return;
        }

        setLoading(true);
        try {
            // Try as SRN first; backend supports either srn or slipId, adjust as needed
            const rqBody = { srn: srnOrSlip.trim() };
            const res = await getStudentBySrnNumberOrSlipId(rqBody);

            if (res && res.ok && res.student) {
                // store returned object in StudentContext
                setStudentData(res.student);

                // console.log the response student immediately too
                console.log("✅ Student fetched from API:", res.student);

                //What to do if student logged in
                if (res.student.isRegisteredBy === "" ||
                    res.student.isRegisteredBy === null ||
                    res.student.isRegisteredBy === undefined
                ) {
         
                    //If student is not registered then, show prefilled form
                    if (location.pathname === "/exam-student-signin-mb" || 
                        location.pathname === "/exam-student-signin-sh" ){
                            navigate(`/exam-registration-form-${location.pathname.slice(-2)}`)
                        } else if (location.pathname === "/user-student-signin-mb" || 
                        location.pathname === "/user-student-signin-sh" ){
                            navigate(`/user-registration-form-${location.pathname.slice(-2)}`)
                        }
                } else if (res.student.isRegisteredBy !== "" ||
                    res.student.isRegisteredBy !== null||
                    res.student.isRegisteredBy !== undefined
                 ) {

                    //Show the ack slip for self and for user route to siginin
                    if (location.pathname === "/exam-student-signin-mb" || 
                        location.pathname === "/exam-student-signin-sh" ){
                            navigate(`/exam-acknowledgement-slip-${location.pathname.slice(-2)}`)
                        } else if (location.pathname === "/user-student-signin-mb" || 
                        location.pathname === "/user-student-signin-sh" ){
                            alert('This student is already registered! Register another student')
                            setStudentData({})
                            navigate(`/user-student-signin-${location.pathname.slice(-2)}`)
                        }
                 }


            }
        } catch (err) {
            console.error("Error fetching student:", err);

            //If srn not matched with db then show empty form to fill

            setError(err?.message || "An error occurred while logging in.");

            if (location.pathname === "/exam-student-signin-mb" ||
                location.pathname === "/exam-student-signin-sh"
            ) {
                navigate(`/exam-registration-form-${location.pathname.slice(-2)}`)
            } else if (location.pathname === "/user-student-signin-mb" ||
                location.pathname === "/user-student-signin-sh"
            ) {
                navigate(`/user-registration-form-${location.pathname.slice(-2)}`)
            } 


        } finally {
            setLoading(false);
        }
    };

    return (

        <Container
            fluid
            className="d-flex justify-content-center align-items-center bg-light"
            style={{ height: '40vh' }}
        >
            <Card className="p-4 shadow-lg" style={{ width: "350px", borderRadius: "16px" }}>
                <Card.Header style={{ textAlign: 'center' }}>
                    <span style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>  ENTER SRN
                        (एसआरएन भरे)</span>
                    <br></br>
                    <hr></hr>
                    <span style={{ fontSize: '80%', fontWeight:'bold' }}>(नोट: एसआरएन नंबर के बारे में जानकारी न होने पर विद्यालय में संपर्क करें।)</span>
                </Card.Header>
                <Card.Body>
                    {/* <h3 className="text-center mb-4">Login</h3> */}

                    <Form onSubmit={handleSubmit}>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form.Group className="mb-3" controlId="formBasicMobile">
                            <Form.Control
                                type="text"
                                placeholder="SRN Number"
                                value={srnOrSlip}
                                onChange={(e) => setSrnOrSlip(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};
