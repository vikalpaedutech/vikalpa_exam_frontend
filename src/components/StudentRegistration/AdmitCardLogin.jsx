
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../NewContextApis/UserContext";
import { StudentContext } from "../NewContextApis/StudentContextApi";
import { Form, Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { getStudentBySrnNumberOrSlipId } from "../../services/StudentRegistrationServices/StudentRegistrationService";
import { useNavigate, useLocation } from "react-router-dom";
export const AdmitCardStudentSignin = () => {

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
                navigate('/mb-level1-admit-card')


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
<>


        <Container
            fluid
            className="d-flex justify-content-center align-items-center bg-light"
         
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
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setSrnOrSlip(value);
                                }}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading || srnOrSlip.length !== 10}>
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

<br></br>
</>
    );
};
