





import React, { useState, useEffect, useContext } from "react";
import { StudentContext } from "../NewContextApis/StudentContextApi";
import {
    Form,
    Container,
    Card,
    Button,
    Alert,
    Spinner,
    Modal
} from "react-bootstrap";
import { getStudentBySrnNumberOrSlipId } from "../../services/StudentRegistrationServices/StudentRegistrationService";
import { useNavigate } from "react-router-dom";

export const AdmitCardStudentSigninLevel3 = () => {
    const navigate = useNavigate();
    const { studentData, setStudentData } = useContext(StudentContext);

    const [srnOrSlip, setSrnOrSlip] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // modal state
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        setStudentData({});
    }, []);

    const openModal = (title, message) => {
        setModalTitle(title);
        setModalMessage(message);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!srnOrSlip || srnOrSlip.trim() === "") {
            setError("Please enter SRN number.");
            return;
        }

        setLoading(true);
        try {
            const rqBody = { srn: srnOrSlip.trim() };
            const res = await getStudentBySrnNumberOrSlipId(rqBody);

            if (res?.ok && res?.student) {
                const student = res.student;
                setStudentData(student);

                
                console.log(student.L3ExaminationCenter)
                // 🔴 L1ExaminationCenter NOT ASSIGNED
                if (student?.isPresentInL3Examination === false 
                ) {

                    // alert('i am absent')

                    if (student?.classOfStudent === "8") {


//                         openModal(
//                             "MB Level-1 Result Status",
//                             `Dear Student, You were absent in the Mission Buniyaad Level-1 Entrance Examination.
// (प्रिय विद्यार्थी, आप मिशन बुनियाद लेवल-1 प्रवेश परीक्षा में अनुपस्थित थे।)`
//                         );

                        navigate('/mb-l3-result-notqualifed')
                        return;
                    }

                    if (student?.classOfStudent === "10") {
                        openModal(
                            "Result Coming Soon",
                            `Pleae! Go to Haryana Super 100 Link.
                             (कृपया हरियाणा सुपर 100 लिंक पर जाएं।)`
                        );
                        return;
                    }
                } else {

                    if(student?.L3ExaminationCenter === null){

                        //  alert('Admit card will be live soon for your district!')

                         alert('!!!!!')
                         
                         return;
                          // ✅ All good → navigate
                    
                    } else {
                      
                        // navigate('/mb-l2-result-notqualifed')

                        if ( student?.isPresentInL3Examination === true && student?.selectionStatusForL3 === "Selected" && student?.L3Qualified === true)
                        {
                            navigate("/mb-level3-result");
                        } else if (student?.isPresentInL3Examination === true && student?.selectionStatusForL3 === "Waiting" && student?.L3Qualified === true)
                        {
                            navigate("/MB-level3-waitinglist");
                        }
                    

                    }

                  
                }


            } else {
                // SRN not found
                openModal(
                    "Admit Card Status",
                    `Your Admit Card will be available in three days.
(आपका प्रवेश पत्र तीन दिनों में उपलब्ध होगा।)`
                );
            }
        } catch (err) {
//             openModal(
//                 "Admit Card Status",
//                 `Your result cannot be downloaded because you have not registered for the Mission Buinyaad Level 1 Examination.
// (आप अपना परीक्षा परिणाम डाउनलोड नहीं कर सकते हैं क्योंकि आपने मिशन बुनियाद लेवल 1 परीक्षा के लिए पंजीकरण नहीं किया है।)`
//             );


            navigate('/mb-l3-result-notqualifed')
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <br></br>
            <Container
                fluid
                className="d-flex justify-content-center align-items-center bg-light"
            >
                <Card className="p-4 shadow-lg" style={{ width: "350px", borderRadius: "16px" }}>
                    <Card.Header className="text-center">
                        <strong style={{ fontSize: "20px" }}>
                            ENTER SRN (एसआरएन भरे)
                        </strong>
                        <hr />
                        <small style={{ fontWeight: "bold" }}>
                            (नोट: एसआरएन नंबर के बारे में जानकारी न होने पर विद्यालय में संपर्क करें।)
                        </small>
                    </Card.Header>

                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="SRN Number"
                                    value={srnOrSlip}
                                    onChange={(e) =>
                                        setSrnOrSlip(
                                            e.target.value
                                                .replace(/[^a-zA-Z0-9]/g, "")
                                                .slice(0, 10)
                                        )
                                    }
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button
                                    type="submit"
                                    disabled={loading || srnOrSlip.length <= 7}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" animation="border" /> Processing...
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

            {/* ✅ MODAL */}
            <Modal show={showModal} centered onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ whiteSpace: "pre-line", fontSize: "15px" }}>
                    {modalMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            <br></br>
        </>
    );
};
