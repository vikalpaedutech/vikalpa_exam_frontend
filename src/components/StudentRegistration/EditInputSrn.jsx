import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../NewContextApis/UserContext";
import { StudentContext } from "../NewContextApis/StudentContextApi";
import { Form, Container, Card, Button, Alert, Spinner, Modal } from "react-bootstrap";
import { getStudentBySrnNumberOrSlipId } from "../../services/StudentRegistrationServices/StudentRegistrationService";
import { useNavigate, useLocation } from "react-router-dom";

export const EditStudentSignin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { studentData, setStudentData } = useContext(StudentContext);

    // Local state for the input and loading / error
    const [srnOrSlip, setSrnOrSlip] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showNotFoundModal, setShowNotFoundModal] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);

    // Below useEffect sets the studentData to empty object so that as soon as...
    // ...user comes on this page state gets empty
    useEffect(() => {
        setStudentData({});
    }, []);

    // Log studentData whenever it changes (console log once it's set)
    useEffect(() => {
        if (studentData && Object.keys(studentData).length > 0) {
            console.log("✅ Student stored in context:", studentData);
        }
    }, [studentData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setApiResponse(null);

        // Basic guard
        if (!srnOrSlip || srnOrSlip.trim() === "") {
            setError("Please enter SRN number or Slip-Id.");
            return;
        }

        if (srnOrSlip.length !== 10) {
            setError("SRN must be exactly 10 digits.");
            return;
        }

        setLoading(true);
        try {
            // Try as SRN first; backend supports either srn or slipId, adjust as needed
            const rqBody = { srn: srnOrSlip.trim() };
            const res = await getStudentBySrnNumberOrSlipId(rqBody);

            if (res && res.ok && res.student) {
                // Store returned object in StudentContext
                setStudentData(res.student);
                setApiResponse(res);

                // console.log the response student immediately too
                console.log("✅ Student fetched from API:", res.student);

                // If student found in DB, navigate to edit form
                navigate(`/edit-student-registration-form`);
                
            } else {
                // If no student found, show modal
                setApiResponse(res);
                setShowNotFoundModal(true);
            }
        } catch (err) {
            console.error("Error fetching student:", err);
            
            // If API error or student not found, show modal
            setApiResponse(null);
            setShowNotFoundModal(true);
            
            // Also show error in form
            setError(err?.message || "An error occurred while fetching student data.");
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowNotFoundModal(false);
        // Clear the input field
        setSrnOrSlip("");
        // Focus back to input field
        setTimeout(() => {
            document.getElementById("formBasicMobile")?.focus();
        }, 100);
    };

    const handleTryAgain = () => {
        setShowNotFoundModal(false);
        setSrnOrSlip("");
        setError(null);
        setTimeout(() => {
            document.getElementById("formBasicMobile")?.focus();
        }, 100);
    };

    return (
        <>
            <Container
                fluid
                className="d-flex justify-content-center align-items-center bg-light"
            >
                <Card className="p-4 shadow-lg" style={{ width: "350px", borderRadius: "16px" }}>
                    <Card.Header style={{ textAlign: 'center' }}>
                        <span style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                            ENTER SRN (एसआरएन भरे)
                        </span>
                        <br />
                        <hr />
                        <span style={{ fontSize: '80%', fontWeight: 'bold' }}>
                            (नोट: एसआरएन नंबर के बारे में जानकारी न होने पर विद्यालय में संपर्क करें।)
                        </span>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form.Group className="mb-3" controlId="formBasicMobile">
                                <Form.Label>SRN Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter 10-digit SRN"
                                    value={srnOrSlip}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setSrnOrSlip(value);
                                    }}
                                    required
                                    isInvalid={error && error.includes("SRN must be")}
                                />
                                <Form.Text className="text-muted">
                                    Enter exactly 10 digits
                                </Form.Text>
                            </Form.Group>

                            <div className="d-grid">
                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    disabled={loading || srnOrSlip.length !== 10}
                                >
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

            {/* Student Not Found Modal */}
            <Modal
                show={showNotFoundModal}
                onHide={handleModalClose}
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">
                        Student Not Found
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleTryAgain}>
                        Try Again
                    </Button>
                </Modal.Footer>
            </Modal>

            <br />
        </>
    );
};