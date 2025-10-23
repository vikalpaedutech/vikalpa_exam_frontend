import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Row, Col, Container, Table, Button, Spinner, Form } from 'react-bootstrap';
import DistrictBlockCentersService from "../../services/DistrictBlockCentersService";
import DashBoardServices from "../../services/DashBoardServices";
import { jsPDF } from "jspdf";
import roomData from "./roomNo.json";

export default function IdCardS100SelectAndDownload() {
    const [examinationCentersList, setExaminationCentersList] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedCenters, setSelectedCenters] = useState("");
    const [allData, setAllData] = useState([]);
    const [filterApplied, setFilterApplied] = useState(false);
    const [attendanceSheetLoading, setAttendanceSheetLoading] = useState(false);
    const [filteredGender, setFilteredGENDER] = useState("");
    const [filteredBatch, setFilteredBatch] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);

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

    useEffect(() => {
        // Filter rooms based on selected gender
        if (filteredGender && filteredGender.value) {
            const filtered = roomData.filter(room => room.gender === filteredGender.value);
            setFilteredRooms(filtered.sort((a, b) => a.roomNo - b.roomNo));
        } else {
            setFilteredRooms([]);
        }
        setRoomNumber(""); // Reset room number when gender changes
    }, [filteredGender]);

    const unqDistricts = [...new Set(examinationCentersList.map(item => item.district))];

    const handleDistrictChange = (selectedOption) => {
        setSelectedDistrict(selectedOption.value);
    };

    const filteredBlock = examinationCentersList.filter(
        (eachBlock) => eachBlock.district === selectedDistrict
    );

    const unqFilteredBlock = [...new Set(filteredBlock.map(item => item.blockName))];

    const handleBlockChange = (selectedOption) => {
        setSelectedBlock(selectedOption.value);
    };

    const filteredCenters = examinationCentersList.filter(
        (eachCenter) =>
            eachCenter.blockName === selectedBlock &&
            eachCenter.examinationLevel === "1" &&
            eachCenter.examType === "S100"
    );

    const handleCenterChange = (selectedOption) => {
        setSelectedCenters(selectedOption.value);
    };

    const handleFilterSubmit = async () => {
        if (filteredGender && filteredBatch) {
            setFilterApplied(true);
        } else {
            setFilterApplied(false);
        }

        const isPresentInL2Examination = true;

        let query = `L2examinationCenter=Haryana Super 100 Campus, Vill. Barna, Dhand Road, Near Teri College, Kurukshetra&super100L2ExamBatchDivision=${filteredBatch.value}&gender=${filteredGender.value}&grade=10&isPresentInL2Examination=${isPresentInL2Examination}`.trim();

        try {
            const response = await DashBoardServices.GetAllStudentData(query);
            setAllData(response.data || []);
            setSelectedStudents([]); // Reset selected students when new data is loaded
        } catch (error) {
            console.log('Error fetching data: ', error);
            setAllData([]);
        }
    };

    const handleClearFilter = () => {
        setFilteredGENDER("");
        setFilteredBatch("");
        setRoomNumber("");
        setFilterApplied(false);
        setAllData([]);
        setSelectedStudents([]);
    };

    const handleStudentSelection = (studentId) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const sortAllData = allData.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

    const admitHrLogo = "/admitHrLogo.png";
    const buniyaadLogo = "/admitBuniyaLogo.png";
    const viklapaLogo = "/vikalpalogo.png";

    const generatePDF = async () => {
        if (selectedStudents.length === 0) {
            alert("Please select at least one student to generate ID cards.");
            return;
        }

        setAttendanceSheetLoading(true);

        const doc = new jsPDF("p", "mm", "a4");

        const cardWidth = 100; // mm
        const cardHeight = 65; // mm
        const marginX = 4.2;
        const marginY = 5;

        const leftLogo = await toDataURL(admitHrLogo);
        const rightLogo = await toDataURL(viklapaLogo);

        // Filter students to only include selected ones
        const studentsToPrint = allData.filter(student => selectedStudents.includes(student._id));

        for (let i = 0; i < studentsToPrint.length; i++) {
            const student = studentsToPrint[i];
            const row = Math.floor((i % 8) / 2);
            const col = i % 2;

            const posX = marginX + col * (cardWidth + 2);
            const posY = marginY + row * (cardHeight + 4);

            doc.setDrawColor(0);
            doc.setLineWidth(0.5);
            doc.rect(posX, posY, cardWidth, cardHeight);

            const padding = 2;
            doc.roundedRect(posX + padding, posY + padding, cardWidth - 2 * padding, cardHeight - 2 * padding, 3, 3);

            doc.addImage(leftLogo, "PNG", posX + 3.5, posY + 2.5, 13, 13);
            doc.addImage(rightLogo, "PNG", posX + cardWidth - 16.5, posY + 2.5, 13, 13);

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("HARYANA SUPER 100", posX + cardWidth / 2, posY + 6, { align: "center" });

            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.text("Village Barna, Dhand Road, Kurukshetra", posX + cardWidth / 2, posY + 9.5, { align: "center" });
            doc.text(`Phone No: 7206758099`, posX + cardWidth / 2, posY + 12.5, { align: "center" });
            doc.text("Level 2 Batch (2025-27)", posX + cardWidth / 2, posY + 16, { align: "center" });

            const lineYPosition = posY + 18;
            doc.line(posX + 3, lineYPosition, posX + cardWidth - 3, lineYPosition);

            const imageX = posX + 4;
            const imageY = posY + 20.5;
            const imageWidth = 30;
            const imageHeight = 40;

            if (student.imageUrl) {
                try {
                    const image = await toDataURL(student.imageUrl);
                    doc.addImage(image, "JPEG", imageX, imageY, imageWidth, imageHeight);
                } catch (err) {
                    console.warn("Image load error for", student.name);
                    drawPlaceholderBox();
                }
            } else {
                drawPlaceholderBox();
            }

            function drawPlaceholderBox() {
                doc.setDrawColor(0);
                doc.rect(imageX, imageY, imageWidth, imageHeight);
                doc.setFontSize(6.5);
                doc.setFont("helvetica", "italic");
                doc.text("Fix Photo", imageX + imageWidth / 2, imageY + imageHeight / 2 - 2, { align: "center" });
                doc.text("Here", imageX + imageWidth / 2, imageY + imageHeight / 2 + 2, { align: "center" });
            }

            const textStartX = posX + 39.5;
            let currentY = posY + 24;
            const lineSpacing = 5.2;
            const underlineLength = 28;

            doc.setFontSize(7.5);

            const renderField = (label, value = "", underline = true) => {
                doc.setFont("helvetica", "bold");
                doc.text(label, textStartX, currentY);
                doc.setFont("helvetica", "normal");
                doc.text(value, textStartX + 18, currentY);
                if (underline) {
                    doc.line(textStartX + 18, currentY + 0.8, textStartX + 18 + underlineLength, currentY + 0.8);
                }
                currentY += lineSpacing;
            };

            renderField("Name:", student.name);
            renderField("Father Name:", student.father);
            renderField("District:", student.district || "");
            renderField("Roll Number:", student.s100L2RollNumber);
            renderField("Batch:", filteredBatch ? filteredBatch.label : "");
            renderField("Room No.:", student.roomNo.toString());
            renderField("Bed No.:", student.bedNo.toString());
            renderField("Contact:", student.mobile);


            if ((i + 1) % 8 === 0 && i !== studentsToPrint.length - 1) {
                doc.addPage();
            }
        }

        doc.save("Student_ID_Cards.pdf");
        setAttendanceSheetLoading(false);
        alert("ID Cards downloaded!");
    };

    const toDataURL = url =>
        fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }));

    return (
        <>
            <Container fluid>
                <div id="content-to-pdf">
                    <Row>
                        <Col>
                            <label>Select Gender</label>
                            <Select
                                options={[
                                    {value: "Female", label: "Female"},
                                    {value: "Male", label: "Male"}
                                ]}
                                onChange={(selectedOption) => setFilteredGENDER(selectedOption)}
                                value={filteredGender}
                            />
                        </Col>

                        <Col>
                            <label>Select Batch</label>
                            <Select
                                options={[
                                    {value: "1", label: "1"},
                                    {value: "2", label: "2"},
                                    {value: "3", label: "3"}
                                ]}
                                onChange={(selectedOption) => setFilteredBatch(selectedOption)}
                                value={filteredBatch}
                            />
                        </Col>

                        {filteredGender && (
                            <Col>
                                <label>Select Room Number</label>
                                <Select
                                    options={filteredRooms.map(room => ({
                                        value: room.roomNo,
                                        label: room.roomNo
                                    }))}
                                    onChange={(selectedOption) => setRoomNumber(selectedOption.value)}
                                    placeholder="Select Room"
                                    value={roomNumber ? {value: roomNumber, label: roomNumber} : null}
                                />
                            </Col>
                        )}
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Button onClick={handleFilterSubmit}>Submit</Button>
                        </Col>
                        <Col>
                            <Button variant="secondary" onClick={handleClearFilter}>Clear Filter</Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            {attendanceSheetLoading ? (
                                <h1 style={{color:'red'}}>Please Wait! Your File is Downloading...</h1>
                            ) : (
                                <Button 
                                    onClick={generatePDF} 
                                    disabled={selectedStudents.length === 0 || selectedStudents.length > 8}
                                >
                                    {selectedStudents.length > 0 ? 
                                        `Download ID Cards (${selectedStudents.length} selected)` : 
                                        "Download ID Cards (Select 1-8 students)"}
                                </Button>
                            )}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        {filterApplied ? (
                            <Row>
                                <Col>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Select</th>
                                                <th>#</th>
                                                <th>SRN</th>
                                                <th>Name</th>
                                                <th>Father</th>
                                                <th>Gender</th>
                                                <th>Category</th>
                                                <th>School</th>
                                                <th>RollNo.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allData.length > 0 ? (
                                                allData.map((eachStudent, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <Form.Check
                                                                type="checkbox"
                                                                checked={selectedStudents.includes(eachStudent._id)}
                                                                onChange={() => handleStudentSelection(eachStudent._id)}
                                                                disabled={selectedStudents.length >= 8 && !selectedStudents.includes(eachStudent._id)}
                                                            />
                                                        </td>
                                                        <td>{index + 1}</td>
                                                        <td>{eachStudent.srn}</td>
                                                        <td>{eachStudent.name}</td>
                                                        <td>{eachStudent.father}</td>
                                                        <td>{eachStudent.gender}</td>
                                                        <td>{eachStudent.category}</td>
                                                        <td>{eachStudent.school}</td>
                                                        <td>{eachStudent.rollNumber}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="14" style={{ textAlign: "center" }}>
                                                        No students found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        ) : (
                            <div>
                                <h1>Select Gender, Batch, and Room No.</h1>
                            </div>
                        )}
                    </Row>
                </div>
            </Container>
        </>
    );
}