

import React, { useState } from "react";
import { Container, Card, Table, Modal, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const MBL3OrientationDates = () => {

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    // Haryana districts
    const districts = [
        
        { sno: 1, name: "Sirsa", status: "Exam Done" },
        { sno: 2, name: "Kurukshetra", status: "Exam Done" },
        { sno: 3, name: "Sonipat", status: "Exam Done" },
        { sno: 4, name: "Bhiwani", status: "Exam Done" },
        { sno: 5, name: "Panchkula", status: "Exam Done" },
        { sno: 6, name: "Rewari", status: "Exam Done" },
        { sno: 7, name: "Yamunanagar", status: "Exam Done" },
        { sno: 8, name: "Charkhi Dadri", status: "Coming Soon" },
        { sno: 9, name: "Ambala", status: "Coming Soon" },
        
        { sno: 10, name: "Palwal", status: "Exam Done" },
        { sno: 11, name: "Kaithal", status: "Exam Done" },
        { sno: 12, name: "Panipat", status: "Exam Done" },
        { sno: 13, name: "Faridabad", status: "Coming Soon" },
        { sno: 14, name: "Jhajjar", status: "Exam Done" },
        { sno: 15, name: "Mahendergarh", status: "Exam Done" },
        { sno: 16, name: "Rohtak", status: "Exam Done" },
        { sno: 17, name: "Fatehabad", status: "Exam Done" },
        { sno: 18, name: "Hisar", status: "Exam Done" },
        { sno: 19, name: "Jind", status: "Exam Done" },
        { sno: 20, name: "Karnal", status: "Download Admit Card" },
        { sno: 21, name: "Gurugram", status: "Download Admit Card" },
        { sno: 22, name: "Nuh", status: "Coming Soon" }
    ];

    const handleLinkClick = (district, status) => {

        setSelectedDistrict(district);

        if (status === "Download Admit Card") {

            // Navigate to admit card login
            navigate("/mb-l2-result");

        } else if (status === "Coming Soon") {

            setModalMessage(
                `Admit card for ${district} district will be available soon. Please check again later.`
            );
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDistrict("");
        setModalMessage("");
    };

    const tableStyles = {

        tableContainer: {
            marginTop: "20px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        },
        headerCell: {
            backgroundColor: "#4CAF50",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "12px",
            textAlign: "center"
        },
        cell: {
            padding: "10px",
            verticalAlign: "middle",
            textAlign: "center"
        },
        availableLink: {
            color: "#28a745",
            fontWeight: "bold",
            cursor: "pointer",
            textDecoration: "underline"
        },
        comingSoonLink: {
            color: "#ffc107",
            fontWeight: "bold",
            cursor: "pointer",
            textDecoration: "underline"
       
        }
    };

    return (
        <>
            <Container fluid className="py-4">
                <Card className="shadow-sm">
                    <Card.Header className="bg-primary text-white">
                        <h4 className="mb-0">Mission Buniyaad Level 3 - Admit Card</h4>
                    </Card.Header>

                    <Card.Body>

                        <div style={tableStyles.tableContainer}>
                            <Table striped bordered hover responsive>

                                <thead>
                                    <tr>
                                        <th style={tableStyles.headerCell}>S. No.</th>
                                        <th style={tableStyles.headerCell}>District</th>
                                        <th style={tableStyles.headerCell}>Status / Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {districts.map((district) => (

                                        <tr key={district.sno}>
                                            <td style={tableStyles.cell}>{district.sno}</td>
                                            <td style={tableStyles.cell}>{district.name}</td>

                                            <td style={tableStyles.cell}>

                                                {district.status === "Download Admit Card" && (
                                                    <a
                                                        onClick={() =>
                                                            handleLinkClick(
                                                                district.name,
                                                                district.status
                                                            )
                                                        }
                                                        style={tableStyles.availableLink}
                                                    >
                                                        Download Admit Card
                                                    </a>
                                                )}

                                                {district.status === "Coming Soon" && (
                                                    <a
                                                        onClick={() =>
                                                            handleLinkClick(
                                                                district.name,
                                                                district.status
                                                            )
                                                        }
                                                        style={tableStyles.comingSoonLink}
                                                    >
                                                        Coming Soon
                                                    </a>
                                                )}

                                                {district.status === "Exam Done" && (
                                                    <Badge bg="secondary">
                                                        Exam Conducted
                                                    </Badge>
                                                )}

                                            </td>
                                        </tr>

                                    ))}
                                </tbody>

                            </Table>
                        </div>

                    </Card.Body>
                </Card>
            </Container>

            {/* Modal */}

            <Modal show={showModal} onHide={handleCloseModal} centered>

                <Modal.Header closeButton>
                    <Modal.Title>{selectedDistrict} District</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    );
};