import React, { useState, useEffect } from "react";
import DistrictBlockCentersService from "../../services/DistrictBlockCentersService";
import Select from "react-select";
import { Row, Col, Container, Table, Button } from "react-bootstrap";
import DashBoardServices from "../../services/DashBoardServices";
import { jsPDF } from "jspdf";
import registrationServiceInstance from "../../services/RegistrationFormService";

export const MBL3Attendance = () => {
  const [examinationCentersList, setExaminationCentersList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedCenters, setSelectedCenters] = useState("");
  const [allData, setAllData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  // Track attendance state individually for each student using an object.
  const [attendanceState, setAttendanceState] = useState({});

  //Below thing is for Level 3 room number 
  const [roomNumber, setRoomNumber] = useState("");

  const roomNumberData = [
    { "district": "Ambala", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] },
    { "district": "Bhiwani", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"] },
    { "district": "CharkhiDadri", "RoomNo": ["1", "2", "3", "4", "5", "6", "7"] },
    { "district": "Faridabad", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
    { "district": "Fatehabad", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"] },
    { "district": "Gurugram", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"] },
    { "district": "Hisar", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"] },
    { "district": "Jhajjar", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8"] },
    { "district": "Jind", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"] },
    { "district": "Kaithal", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "16"] },
    { "district": "Karnal", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] },
    { "district": "Kurukshetra", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] },
    { "district": "Mahendragarh", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
    { "district": "NuhMewat", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8"] },
    { "district": "Palwal", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8"] },
    { "district": "Panchkula", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
    { "district": "Panipat", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"] },
    { "district": "Rewari", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"] },
    { "district": "Rohtak", "RoomNo": ["1", "2", "3", "4", "5", "6", "7"] },
    { "district": "Sirsa", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"] },
    { "district": "Sonipat", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"] },
    { "district": "Yamunanagar", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8"] }
  ];

  // Fetch centers data
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
  };

  console.log("i am district selected", selectedDistrict);
  
  // To filter the object from roomNumberData based on selected district
  const newRoomObject = roomNumberData.find((obj) => obj.district === selectedDistrict);

  console.log('I AM newRoomObject', newRoomObject);
  console.log(roomNumber);

  const filteredBlock = examinationCentersList.filter(
    (eachBlock) => eachBlock.district === selectedDistrict
  );

  const unqFilteredBlock = [
    ...new Set(filteredBlock.map((item) => item.blockName)),
  ];

  const handleBlockChange = (selectedOption) => {
    setSelectedBlock(selectedOption.value);
  };

  // Activate below snippet for level 3
  const filteredCenters = examinationCentersList.filter(
    (eachCenter) =>
      eachCenter.district === selectedDistrict &&
      eachCenter.examinationLevel === "3" &&
      eachCenter.examType === "MB"
  );

  const handleCenterChange = (selectedOption) => {
    setSelectedCenters(selectedOption.value);
  };

  const admitCard1 = true;
  const attendancePdf = true;

  // Handle filter submit for level 3
  const handleFilterSubmit = async () => {
    if (selectedDistrict && selectedCenters) {
      setFilterApplied(true);
    } else {
      setFilterApplied(false);
    }
    // For Level 3 query
    let query = `district=${selectedDistrict}&L3examinationCenter=${selectedCenters}&grade=8&Level3StudentsRoomNumber=${roomNumber}`.trim();

    try {
      const response = await DashBoardServices.GetAllStudentData(query);
      setAllData(response.data || []);

      // Initialize attendanceState based on the data from the API
      // Updated: use 'srn' (assuming API returns 'srn') for consistency
      const initialAttendanceState = {};
      response.data.forEach((item) => {
        initialAttendanceState[item.srn] = item.isPresentInL3Examination;
      });
      setAttendanceState(initialAttendanceState);
    } catch (error) {
      console.log("Error fetching data: ", error);
      setAllData([]);
    }
  };

  const sortAllData = allData.sort((a, b) =>
    a.rollNumber.localeCompare(b.rollNumber)
  );

  // Function to handle attendance update (marking attendance)
  const handleAttendanceUpdate = async (srn, isMarked) => {
    
    console.log(isMarked);
    console.log(`Student SRN: ${srn}, Currently Marked: ${isMarked ? "Present" : "Absent"}`);
    
    if (isMarked === true) {
      // If currently marked as present, update to absent.
      console.log("marked absent");
      const isPresentInL3Examination = { isPresentInL3Examination: false };
      console.log(isPresentInL3Examination);
      try {
        // Update local state
        setAttendanceState((prevState) => ({
          ...prevState,
          [srn]: !isMarked,
        }));
        await registrationServiceInstance.patchAttendanceById(srn, isPresentInL3Examination);
      } catch (error) {
        console.error("Error updating attendance", error.message);
      }
    } else {
      // If currently marked as absent, update to present.
      console.log("marked present");
      const isPresentInL3Examination = { isPresentInL3Examination: true };
      try {
        // Update local state
        setAttendanceState((prevState) => ({
          ...prevState,
          [srn]: !isMarked,
        }));
        await registrationServiceInstance.patchAttendanceById(srn, isPresentInL3Examination);
      } catch (error) {
        console.error("Error updating attendance", error.message);
      }
    }
  };

  return (
    <>
      <Container fluid>
        <h1>MB Level 3 Attendance</h1>
        <hr></hr>
        <div id="content-to-pdf">
          <Row>
            <Col>
              <label>District</label>
              <Select
                placeholder="District"
                options={unqDistricts.map((district) => ({
                  value: district,
                  label: district,
                }))}
                onChange={handleDistrictChange}
              />
            </Col>

            {/* Dropdown for Block (if needed) */}
            {/* <Col>
              <label>Block</label>
              <Select
                placeholder="Block"
                options={unqFilteredBlock.map((block) => ({ value: block, label: block }))}
                onChange={handleBlockChange}
              />
            </Col> */}

            <Col>
              <label>Center</label>
              <Select
                placeholder="Center"
                options={filteredCenters.map((center) => ({
                  value: center.examinationCenters,
                  label: center.examinationCenters,
                }))}
                onChange={handleCenterChange}
              />
            </Col>

            <Col>
              <label>Room Number</label>
              <Select
                placeholder="Select Room Number"
                options={
                  newRoomObject && newRoomObject.RoomNo
                    ? newRoomObject.RoomNo.map((roomNo) => ({
                        value: roomNo,
                        label: roomNo,
                      }))
                    : [] // Return empty array if RoomNo is undefined
                }
                onChange={(selectedOption) => setRoomNumber(selectedOption.value)}
              />
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col>
              <Button onClick={handleFilterSubmit}>Submit</Button>
            </Col>
          </Row>
          <br />
          <hr />
          <Row>
            {filterApplied ? (
              <Row>
                <Col>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>SRN</th>
                        
                        <th>Father</th>
                        {/* <th>Gender</th>
                        <th>Category</th>
                        <th>School</th> */}
                        <th>Name</th>
                        <th>RollNo.</th>
                        <th>Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.length > 0 ? (
                        allData.map((eachStudent, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{eachStudent.srn}</td>
                           
                            <td>{eachStudent.father}</td>
                            {/* <td>{eachStudent.gender}</td>
                            <td>{eachStudent.category}</td>
                            <td>{eachStudent.school}</td> */}
                             <td>{eachStudent.name}</td>
                            <td>{eachStudent.rollNumber}</td>
                            <td>
                              {/* Toggle button for attendance */}
                              <div
                                className={`toggle-button ${
                                  attendanceState[eachStudent.srn] ? "on" : "off"
                                }`}
                                onClick={() =>
                                  handleAttendanceUpdate(eachStudent.srn, attendanceState[eachStudent.srn])
                                }
                              >
                                <div
                                  className={`circle ${
                                    attendanceState[eachStudent.srn] ? "move-right" : "move-left"
                                  }`}
                                ></div>
                                <span
                                  className={`toggle-text ${
                                    attendanceState[eachStudent.srn] ? "on-text" : "off-text"
                                  }`}
                                >
                                  {attendanceState[eachStudent.srn] ? "Present" : "Absent"}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" style={{ textAlign: "center" }}>
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
                <h1>
                  Kindly filter your center and download your attendance sheet.
                </h1>
              </div>
            )}
          </Row>
        </div>
      </Container>
    </>
  );
};
