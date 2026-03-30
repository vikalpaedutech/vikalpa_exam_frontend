// import React, { useContext, useEffect, useState } from "react";
// import { Container, Card, Button, Row, Col, Modal, Spinner } from "react-bootstrap";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// import { StudentContext } from "../NewContextApis/StudentContextApi.js";
// import { UserContext } from "../NewContextApis/UserContext.js";
// import { BulkDownloadContext } from "../ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi.js";

// import { IsAdmitCardDownloaded } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";


// import { useNavigate } from "react-router-dom";
// import { rgb } from "pdf-lib";


// export const MBL3OrientationDates = () =>{




//     return(
//         <>
//         Orientation dates</>
//     )
// }









// import React, { useState } from "react";
// import { Container, Card, Table, Alert, Modal, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export const MBL3OrientationDates = () => {

//         const navigate = useNavigate();


//     const [showModal, setShowModal] = useState(false);
//     const [selectedDistrict, setSelectedDistrict] = useState("");
//     const [modalMessage, setModalMessage] = useState("");

//     // Haryana's 22 districts
//     const districts = [
//         { sno: 1, name: "Sirsa", status: "Exam Done" },
//         { sno: 2, name: "Kurukshetra", status: "Download Admit Card" },
//         { sno: 3, name: "Sonipat", status: "Coming Soon" },
//         { sno: 4, name: "Bhiwani", status: "Coming Soon" },
//         { sno: 5, name: "Ambala", status: "Coming Soon" },
//         { sno: 6, name: "Rewari", status: "Coming Soon" },
//         { sno: 7, name: "Yamunanagar", status: "Coming Soon" },
//         { sno: 8, name: "Charkhi Dadri", status: "Coming Soon" },
//         { sno: 9, name: "Panchkula", status: "Coming Soon" },
//         { sno: 10, name: "Palwal", status: "Coming Soon" },
//         { sno: 11, name: "Kaithal", status: "Coming Soon" },
//         { sno: 12, name: "Panipat", status: "Coming Soon" },
//         { sno: 13, name: "Faridabad", status: "Coming Soon" },
//         { sno: 14, name: "Jhajjar", status: "Coming Soon" },
//         { sno: 15, name: "Mahendergarh", status: "Coming Soon" },
//         { sno: 16, name: "Rohtak", status: "Coming Soon" },
//         { sno: 17, name: "Fatehabad", status: "Coming Soon" },
//         { sno: 18, name: "Hisar", status: "Coming Soon" },
//         { sno: 19, name: "Jind", status: "Coming Soon" },
//         { sno: 20, name: "Karnal", status: "Coming Soon" },
//         { sno: 21, name: "Gurugram", status: "Coming Soon" },
//         { sno: 22, name: "Nuh", status: "Coming Soon" }
//     ];

//     const handleLinkClick = (district, status) => {
//         setSelectedDistrict(district);
        
//         if (status === "Download Admit Card") {
//             // setModalMessage(`Orientation schedule for ${district} is now available. You can proceed with the registration.`);
//             // setShowModal(true);

            

//             //navigates to the admit card login
//             navigate("/mb-l2-result")
//             // You can add your custom navigation/function here
//             // Example: navigate(`/orientation/${district.toLowerCase()}`);
//         } else {
//             setModalMessage(`Orientation schedule for ${district} is coming soon. Please check back later.`);
//             setShowModal(true);
//         }
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//         setSelectedDistrict("");
//         setModalMessage("");
//     };

//     // Custom styles for the table
//     const tableStyles = {
//         tableContainer: {
//             marginTop: "20px",
//             borderRadius: "12px",
//             overflow: "hidden",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
//         },
//         headerCell: {
//             backgroundColor: "#4CAF50",
//             color: "white",
//             fontWeight: "bold",
//             fontSize: "16px",
//             padding: "12px",
//             textAlign: "center",
//             borderBottom: "2px solid #ddd"
//         },
//         cell: {
//             padding: "10px",
//             verticalAlign: "middle",
//             textAlign: "center"
//         },
//         availableLink: {
//             color: "#28a745",
//             fontWeight: "bold",
//             cursor: "pointer",
//             textDecoration: "underline"
//         },
//         comingSoonLink: {
//             color: "#ffc107",
//             fontWeight: "bold",
//             cursor: "pointer",
//             textDecoration: "underline"
//         },
//         comingSoonText: {
//             color: "#6c757d",
//             fontStyle: "italic"
//         }
//     };

//     return (
//         <>
//             <Container fluid className="py-4">
//                 <Card className="shadow-sm">
//                     <Card.Header className="bg-primary text-white">
//                         <h4 className="mb-0">Mission Buniyaad Level 3 - Admit Card</h4>
//                     </Card.Header>
//                     <Card.Body>
//                         <div style={tableStyles.tableContainer}>
//                             <Table striped bordered hover responsive>
//                                 <thead>
//                                     <tr>
//                                         <th style={tableStyles.headerCell}>S. No.</th>
//                                         <th style={tableStyles.headerCell}>District</th>
//                                         <th style={tableStyles.headerCell}>Status / Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {districts.map((district) => (
//                                         <tr key={district.sno}>
//                                             <td style={tableStyles.cell}>{district.sno}</td>
//                                             <td style={tableStyles.cell}>{district.name}</td>
//                                             <td style={tableStyles.cell}>
//                                                 {district.status === "Download Admit Card" ? (
//                                                     <a
//                                                         onClick={() => handleLinkClick(district.name, district.status)}
//                                                         style={tableStyles.availableLink}
//                                                         className="hover-effect"
//                                                     >
//                                                         Download Admit Card
//                                                     </a>
//                                                 ) : (
//                                                     <a
//                                                         onClick={() => handleLinkClick(district.name, district.status)}
//                                                         style={tableStyles.comingSoonLink}
//                                                         className="hover-effect"
//                                                     >
//                                                         Coming Soon
//                                                     </a>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </Table>
//                         </div>
                        
                      
//                     </Card.Body>
//                 </Card>
//             </Container>

//             {/* Modal for displaying messages */}
//             <Modal show={showModal} onHide={handleCloseModal} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>{selectedDistrict} District</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <p>{modalMessage}</p>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleCloseModal}>
//                         Close
//                     </Button>
//                     {selectedDistrict && modalMessage.includes("available") && (
//                         <Button 
//                             variant="primary" 
//                             onClick={() => {
//                                 // Add your navigation logic here
//                                 // Example: navigate(`/orientation/${selectedDistrict.toLowerCase()}`);
//                                 alert(`Navigating to ${selectedDistrict} orientation page`);
//                                 handleCloseModal();
//                             }}
//                         >
//                             Proceed
//                         </Button>
//                     )}
//                 </Modal.Footer>
//             </Modal>

//             {/* Optional: Add hover effect styles */}
//             <style jsx="true">{`
//                 .hover-effect:hover {
//                     opacity: 0.8;
//                     text-decoration: underline !important;
//                     transform: scale(1.02);
//                     transition: all 0.2s ease;
//                 }
//             `}</style>
//         </>
//     );
// };









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
        { sno: 2, name: "Kurukshetra", status: "Download Admit Card" },
        { sno: 3, name: "Sonipat", status: "Coming Soon" },
        { sno: 4, name: "Bhiwani", status: "Coming Soon" },
        { sno: 5, name: "Ambala", status: "Coming Soon" },
        { sno: 6, name: "Rewari", status: "Coming Soon" },
        { sno: 7, name: "Yamunanagar", status: "Coming Soon" },
        { sno: 8, name: "Charkhi Dadri", status: "Coming Soon" },
        { sno: 9, name: "Panchkula", status: "Coming Soon" },
        { sno: 10, name: "Palwal", status: "Coming Soon" },
        { sno: 11, name: "Kaithal", status: "Coming Soon" },
        { sno: 12, name: "Panipat", status: "Coming Soon" },
        { sno: 13, name: "Faridabad", status: "Coming Soon" },
        { sno: 14, name: "Jhajjar", status: "Coming Soon" },
        { sno: 15, name: "Mahendergarh", status: "Coming Soon" },
        { sno: 16, name: "Rohtak", status: "Coming Soon" },
        { sno: 17, name: "Fatehabad", status: "Coming Soon" },
        { sno: 18, name: "Hisar", status: "Coming Soon" },
        { sno: 19, name: "Jind", status: "Coming Soon" },
        { sno: 20, name: "Karnal", status: "Coming Soon" },
        { sno: 21, name: "Gurugram", status: "Coming Soon" },
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