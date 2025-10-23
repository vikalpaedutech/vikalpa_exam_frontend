import React, { useState, useEffect, useRef } from "react";
import DistrictBlockCentersService from "../../services/DistrictBlockCentersService";
import Select from "react-select";
import { Row, Col, Container, Table, Button, Card } from "react-bootstrap";
import DashBoardServices from "../../services/DashBoardServices";
import { jsPDF } from "jspdf";
import registrationServiceInstance from "../../services/RegistrationFormService";
import Navbar from "../Navbar";
import NavbarCounselling from "../NavbarCounselling";

export const CounsellingAttendance = () => {
    const [srn, setSrn] = useState("");
    const [attendanceMarkedStatus, setAttendanceMarkedStatus] = useState("");
    const [token, setToken] = useState("");
    const [tokenWaiting, setTokenWating] = useState("");
    const [studentData, setStudentData] = useState([]);

    const [examinationCentersList, setExaminationCentersList] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedCenters, setSelectedCenters] = useState("");
    const [allData, setAllData] = useState([]);
    const [filterApplied, setFilterApplied] = useState(false);

    const [changedTokenType, setChangedTokenType] = useState("");

    const [finalToken, setFinalToken] = useState("")

    const prevSelectedLength = useRef(0);
    const prevWaitingLength = useRef(0);

    const fetchExaminationCentersData = async () => {
        try {
            const response = await DistrictBlockCentersService.getDistrictBlockCenters();
            setExaminationCentersList(response.data.data);
        } catch (error) {
            console.error("Error fetching examination centers:", error);
        }
    };

    useEffect(() => {
        fetchExaminationCentersData();
    }, []);

    const unqDistricts = [
        ...new Set(examinationCentersList.map((item) => item.district)),
    ];

    const handleDistrictChange = (selectedOption) => {
        setSelectedDistrict(selectedOption.value);
        setStudentData([]);
    };

    const CounselingStudentsData = async () => {
        let counsellingAttendance = true;
        let isPresentInL3Examination = true;

        let query;

        if (!selectedDistrict) {
            console.log("Select District");
            return;
        } else {
            query = `district=${selectedDistrict}&isPresentInL3Examination=${isPresentInL3Examination}&grade=8&counsellingAttendance=${counsellingAttendance}`.trim();
        }

        try {
            const response = await DashBoardServices.GetAllStudentData(query);
            setStudentData(response.data);
            setSrn("");
        } catch (error) {
            console.error("Fetch Failed:", error);
            if (error.response && error.response.status === 404) {
                setToken(1);
            }
        }
    };

    useEffect(() => {
        if (selectedDistrict) {
            CounselingStudentsData();
        }

        CounselingStudentsData();
    }, [selectedDistrict, attendanceMarkedStatus]);

    const handleAttendanceUpdate = async (e) => {
        e.preventDefault();

        if (!selectedDistrict) {
            alert("Select District");
            return;
        }

        const formData = {
            selectedBoard: "", // Add values if needed
            selectedSchool: "",
            homeToSchoolDistance: ""
        };

        try {
            const response = await registrationServiceInstance.patchCounsellingBySrn(
                srn,
                selectedDistrict,
                formData
            );

            setFinalToken(response.data.tokenIssued)

            if (response.status === 200) {
                setAttendanceMarkedStatus(`Attendance Marked ✅.`); //Token: ${response.data.tokenIssued}
                setTimeout(() => {
                    setAttendanceMarkedStatus("");
                }, 3000);
            }
        } catch (error) {
            console.error("Patch failed:", error);
            if (error.response && error.response.status === 500) {
                alert("Either this student doesn't belong to selected district or Attendance Already Marked");
            } else {
                alert("Student Not Found");
            }
        }
    };

    const selectedStudents = studentData.filter(
        (student) => student.finalShortListOrWaitListStudents === "Selected"
    );
    const waitingStudents = studentData.filter(
        (student) => student.finalShortListOrWaitListStudents === "Waiting"
    );

    useEffect(() => {
        setToken(selectedStudents.length + 1);
        setTokenWating(waitingStudents.length + 1);

        if (selectedStudents.length !== prevSelectedLength.current) {
            setChangedTokenType("selected");
        } else if (waitingStudents.length !== prevWaitingLength.current) {
            setChangedTokenType("waiting");
        }

        prevSelectedLength.current = selectedStudents.length;
        prevWaitingLength.current = waitingStudents.length;
    }, [studentData, attendanceMarkedStatus]);

    return (
        <Container fluid>
            <NavbarCounselling />
            <div className="counselling-attendance-main">
                <Row>
                    <Col>
                        <label>District</label>
                        <Select
                            className="attendance-select"
                            placeholder="District"
                            options={unqDistricts.map((district) => ({
                                value: district,
                                label: district,
                            }))}
                            onChange={handleDistrictChange}
                        />
                        <br />
                    </Col>
                </Row>

                

                <h3>{attendanceMarkedStatus}</h3>
             
                    <h3>Token Number: {finalToken}</h3>
                

                <Card className="counselling-attendance-card">
                    <div className="counselling-logo">
                        <Card.Img variant="top" src="./Buniyaad.png" style={{ width: '4rem', height: '5rem' }} />
                        <Card.Img variant="top" src="./haryana.png" style={{ width: '4rem', height: '5rem' }} />
                    </div>

                    <Card.Body>
                        <Card.Title style={{ textAlign: 'center' }}>Attendance</Card.Title>
                        <hr />
                        <Card.Text>
                            <label htmlFor="srn">SRN Number</label>
                            <input
                                type="text"
                                name="srn"
                                value={srn}
                                onChange={(e) => setSrn(e.target.value)}
                            />
                        </Card.Text>
                    </Card.Body>
                    <br />

                    <Button onClick={handleAttendanceUpdate} variant="primary">
                        Submit
                    </Button>
                    <br />
                    <br />
                    <br />
                </Card>
            </div>
        </Container>
    );
};
