import React, { useState, useEffect } from "react";

import Select from "react-select";
import { Row, Col, Container, Table, Button } from "react-bootstrap";
import DistrictBlockCentersService from "../../services/DistrictBlockCentersService";
import DashBoardServices from "../../services/DashBoardServices";
import { jsPDF } from "jspdf";
import registrationServiceInstance from "../../services/RegistrationFormService";
import roomServiceInstance from "../../services/RoomAndBedService";


export const Super100L2Attendance = () => {
  const [examinationCentersList, setExaminationCentersList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedCenters, setSelectedCenters] = useState("");
  const [allData, setAllData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  // Track attendance state individually for each student using an object.
  const [attendanceState, setAttendanceState] = useState({});

  //Triggering fetchrooms and fetchstat
  const [trigger, setTrigger] = useState(false)


  //Below hook for level 2;
  const [filteredGender, setFilteredGENDER] = useState("")
  const [filteredBatch, setFilteredBatch] = useState("")

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

  const [availableRooms, setAvailableRooms] = useState({ maleRoom: null, femaleRoom: null });

  const [dbRoomStats, setDbRoomStats] = useState({})

   // Fetch available rooms by gender
   const fetchAvailableRooms = async () => {
    try {
      const response = await roomServiceInstance.getAvailableRoomsByGender();
      setAvailableRooms(response.data.data);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  };

  

  const fetchRoomadnBedStatInStudentDb = async () => {
    try {
        const response = await DashBoardServices.GetRoomStatisticsByBatchDivision("1");
        setDbRoomStats(response.data);
      } catch (error) {
        console.error("Error fetching available rooms:", error);
      }

  }

  useEffect(() => {
    // console.log(availableRooms?.maleRoom?.roomNo)

    // console.log(availableRooms)



    console.log(availableRooms?.maleRoom?.occupied)

 


    console.log(dbRoomStats?.roomStatistics?.male?.[0]?.count !== undefined ? dbRoomStats.roomStatistics.male[0].count + 1 : 1);


    


    console.log(dbRoomStats)
    fetchAvailableRooms();
    fetchRoomadnBedStatInStudentDb()
  }, [filteredGender, filteredBatch, trigger]);

  //___________________________________________________________







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



    if ( filteredBatch) {
      setFilterApplied(true);
    } else {
      setFilterApplied(false);
    }
    // For Level 3 query
    let query = `L2examinationCenter=Haryana Super 100 Campus, Vill. Barna, Dhand Road, Near Teri College, Kurukshetra&super100L2ExamBatchDivision=${filteredBatch.value}&gender=Male&grade=10`.trim();

    try {
      const response = await DashBoardServices.GetAllStudentData(query);
      setAllData(response.data || []);

      // Initialize attendanceState based on the data from the API
      // Updated: use 'srn' (assuming API returns 'srn') for consistency
      const initialAttendanceState = {};
      response.data.forEach((item) => {
        initialAttendanceState[item.srn] = item.isPresentInL2Examination;
      });
      setAttendanceState(initialAttendanceState);
    } catch (error) {
      console.log("Error fetching data: ", error);
      setAllData([]);
    }
  };

  const sortAllData = allData.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleAttendanceUpdate = async (srn, isMarked) => {
    try {
      // Fetch the student's current data
      const studentQuery = `srn=${srn}`;
      const studentResponse = await DashBoardServices.GetAllStudentData(studentQuery);
      const studentData = studentResponse?.data?.[0];
      const roomNumber = studentData?.roomNo;
  
      // Fetch the latest room availability data
      const roomsResponse = await roomServiceInstance.getAvailableRoomsByGender();
      const latestAvailableRooms = roomsResponse.data.data;
      
      if (isMarked) {
        // Marking absent - free up the room/bed
        const updateData = {
          isPresentInL2Examination: false,
          roomNo: null,
          bedNo: null
        };
  
        // Update local state first
        setAttendanceState(prev => ({ ...prev, [srn]: false }));
        
        // Update student record
        await registrationServiceInstance.patchAttendanceById(srn, updateData);
  
        // Update room occupancy (decrement)
        if (roomNumber) {
          const currentOccupancy = latestAvailableRooms.maleRoom.occupied;
          const updatedOccupancy = {
            occupied: currentOccupancy - 1,
            logic: false
          };
          await roomServiceInstance.putOccupancyOfRooms(roomNumber, updatedOccupancy);
        }
      } else {
        // Marking present - assign room/bed
        const selectedRoomNo = latestAvailableRooms.maleRoom.roomNo;
        const newBedNo = latestAvailableRooms.maleRoom.occupied + 1;
  
        const updateData = {
          isPresentInL2Examination: true,
          roomNo: selectedRoomNo,
          bedNo: newBedNo
        };
  
        // Update local state first
        setAttendanceState(prev => ({ ...prev, [srn]: true }));
        
        // Update student record
        await registrationServiceInstance.patchAttendanceById(srn, updateData);
  
        // Update room occupancy (increment)
        const updatedOccupancy = {
          occupied: newBedNo
        };
        await roomServiceInstance.putOccupancyOfRooms(selectedRoomNo, updatedOccupancy);
      }
  
      // Refresh the room data after update
      fetchAvailableRooms();
      fetchRoomadnBedStatInStudentDb();
      
    } catch (error) {
      console.error("Error updating attendance", error);
    }
  };

  useEffect(()=>{
    console.log(allData)
    console.log(filteredGender)
    console.log(filteredBatch)

  }, [filteredGender, filteredBatch])

  return (
    <>
      <Container fluid>
        <h1>Haryana Super 100 Level 2 Attendance: Boys</h1>
        <hr></hr>
        <div id="content-to-pdf">
          <Row>
            {/* <Col>
              <label>District</label>
              <Select
                placeholder="District"
                options={unqDistricts.map((district) => ({
                  value: district,
                  label: district,
                }))}
                onChange={handleDistrictChange}
              />
            </Col> */}

            {/* Dropdown for Block (if needed) */}
            {/* <Col>
              <label>Block</label>
              <Select
                placeholder="Block"
                options={unqFilteredBlock.map((block) => ({ value: block, label: block }))}
                onChange={handleBlockChange}
              />
            </Col> */}

            {/* <Col>
              <label>Center</label>
              <Select
                placeholder="Center"
                options={filteredCenters.map((center) => ({
                  value: center.examinationCenters,
                  label: center.examinationCenters,
                }))}
                onChange={handleCenterChange}
              />
            </Col> */}

            {/* <Col>
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
            </Col> */}





            {/* <Col>
                        <label>Select Gender</label>
                                <Select
                                
                                    options ={
                                        [{value: "Female", label: "Female"},
                                        {value: "Male", label: "Male"}]
                                    }
                                onChange={(selectedOption)=>setFilteredGENDER(selectedOption)}
                                
                                />
                        </Col> */}

                        <Col>
                        <label>Select Batch</label>
                                <Select
                                
                                    options ={
                                        [{value: "1", label: "1"},
                                        {value: "2", label: "2"},
                                        {value:"3", label:"3"}
                                    ]
                                    }
                                onChange={(selectedOption)=>setFilteredBatch(selectedOption)}
                                
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
                           
                            <td>{eachStudent.father.toUpperCase()}</td>
                            {/* <td>{eachStudent.gender}</td>
                            <td>{eachStudent.category}</td>
                            <td>{eachStudent.school}</td> */}
                             <td>{eachStudent.name.toUpperCase()}</td>
                            <td>{eachStudent.rollNumber}</td>
                            <td>
                              {/* Toggle button for attendance */}
                              <div
                                className={`toggle-button ${
                                  attendanceState[eachStudent.srn] ? "on" : "off"
                                }`}
                                onClick={() =>
                                  handleAttendanceUpdate(eachStudent.srn, attendanceState[eachStudent.srn], eachStudent.roomNo)
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
                  Kindly filter batch and start marking attendance.
                </h1>
              </div>
            )}
          </Row>
        </div>
      </Container>
    </>
  );
};
