import React, { useState, useEffect } from "react";
import DistrictBlockCentersService from "../../services/DistrictBlockCentersService";
import Select from "react-select";
import { Row, Col, Container, Table, Button, Card } from "react-bootstrap";
import DashBoardServices from "../../services/DashBoardServices";
import { jsPDF } from "jspdf";
import registrationServiceInstance from "../../services/RegistrationFormService";
import districtAndCenter from "../districtAndCenter.json";
import NavbarCounselling from "../NavbarCounselling";

export const CounsellingDocumentation = () => {
    const [srn, setSrn] = useState("");
    const [attendanceMarkedStatus, setAttendanceMarkedStatus] = useState("");
    const [token, setToken] = useState("");
    const [studentData, setStudentData] = useState([]);

    const [examinationCentersList, setExaminationCentersList] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedCenters, setSelectedCenters] = useState("");
    const [allData, setAllData] = useState([]);
    const [filterApplied, setFilterApplied] = useState(false);
    const [showBox, setShowBox] = useState(false); 
    const [inputSrnOrToken, setInputSrnOrToken] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");

    const [updatedDistance, setUpdatedDistance] = useState("");
    
    const [documents, setDocuments] = useState("");
    const [formattedDoc, setFormattedDoc] = useState("")
    const [docSubMsg, setDocSumbissionMsg] = useState(false)

    const [dashboardCount, setDashboardCount] = useState([])

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


    
    const CounselingStudentsData = async () => {

  

      if(inputSrnOrToken.length === 0){
        alert("Please insert SRN or Token")
        return;
      }
        

        let counsellingAttendance = true;
        let isPresentInL3Examination = true;

        let query;

        if (!selectedDistrict){
            console.log("Please select district first")
            return;
        } else {
            query = `srn=${inputSrnOrToken}&counsellingToken=${inputSrnOrToken.toUpperCase()}&district=${selectedDistrict}`.trim();
            console.log('i got')
        }

        try {
            const response = await registrationServiceInstance.getStudentDataBySrnTokenDistrict(query);
            console.log(response.data.data)
            setStudentData(response.data.data)

            if(response.data.data.length === 0){
                alert('Srn not found')
                return;
            }

            setUpdatedDistance(response.data.data?.[0]?.homeToSchoolDistance || "");

            // Automatically select default school if available
            const defaultSchool = response.data.data?.[0]?.selectedSchool;
            if (defaultSchool) {
                setSelectedSchool({
                    value: defaultSchool,
                    label: defaultSchool
                });
            } else {
                setSelectedSchool("");
            }

        } catch (error) {
            console.error("Fetch Failed:", error);
        }
    }

    // useEffect(() => {
    //     CounselingStudentsData()
    // }, [])

    // const handleAttendanceUpdate = async (e) => {
    //     e.preventDefault()
        
    //     if(!selectedDistrict){
    //         alert ('please select district first')
    //         return;
    //     }

    //     const counsellingToken = {counsellingToken: token};
    //     alert(selectedDistrict)
    //     console.log(counsellingToken)
    //     try {
    //         const response = await registrationServiceInstance.patchCounsellingBySrn(srn, selectedDistrict, counsellingToken);
    //         console.log(response.status)

    //         if (response.status === 200) {
    //             setAttendanceMarkedStatus("Attendance Marked ✅")
    //             setTimeout (() => {
    //                 setAttendanceMarkedStatus("")
    //             }, 2000)
    //         }

    //     } catch (error) {
    //         console.error("Patch failed:", error);
    //         if (error.response && error.response.status === 500) {
    //             alert("Either this student doesn't belong to selected district or Attendance Already Marked");
    //         } else  {
    //             alert("Student Not Found");
    //         }
    //     }
    // }


    const filteredSchools = districtAndCenter.filter(
        (school) => school?.district.toLowerCase() === studentData?.[0]?.district.toLowerCase()
    );


//DASHBOARDDD
// Add this right after `const filteredSchools = ...`
const matchedDistrictData = dashboardCount.find(
  (item) => item.district.trim().toLowerCase() === studentData?.[0]?.district.trim().toLowerCase()
);

const centerCounts = {};

if (matchedDistrictData) {
  matchedDistrictData.centers.forEach((center) => {
    const centerName = center.counsellingCenterAllocation?.trim() || "Unallocated";
    if (centerCounts[centerName]) {
      centerCounts[centerName] += center.totalStudents || 0;
    } else {
      centerCounts[centerName] = center.totalStudents || 0;
    }
  });
}//________________________



    const docSubmission = async (e) => {

// alert(selectedSchool.length)
      if (documents.length === 0 ){
        alert('Fill Documents')
        return;
 
      } else if(
        selectedSchool.length === 0
      ) { alert('Select Center')}

        setTimeout(()=>{
            setStudentData([])
            setDocSumbissionMsg(false)
        }, 5000)
        

        e.preventDefault()

        const formData = {
            documents: documents.split('').map(Number).filter(n => !isNaN(n)),
            selectedSchool: selectedSchool.value || studentData?.[0]?.selectedBoard,
            homeToSchoolDistance: updatedDistance ||  studentData?.[0]?.homeToSchoolDistance
        }
        
        const query = `srn=${studentData?.[0]?.srn}&district=${selectedDistrict}`

        try {
            const response = await registrationServiceInstance.patchCounsellingDocumentationBySrn(query, formData)

            setDocSumbissionMsg(true)
        } catch (error) {
            console.log("Error occured", error)
        }


    }
   
    useEffect(()=>{
        console.log(selectedSchool.value)
    },[selectedSchool])

const showInputBox = () =>{

  if(selectedDistrict.length === 0){
    alert('select district')
    return;
  }

  setShowBox(true)
}

const hideInputBox = ()=> {
  setShowBox(false)
  setSelectedDistrict('')
  setStudentData([])
}


//Dashboard Counselling

const counsellingDash = async () =>{


  try {
    const response = await DashBoardServices.GetDataFor8DashboardCounselling();
    console.log(" i am dashboard", response.data)
    setDashboardCount(response.data)
  } catch (error) {
    console.log("Error fetchind dashboard", error)
  }
}
useEffect(()=>{
  counsellingDash()
},[studentData])




    return (
        
      <div className="counselling-doc-main">
        <Container fluid className="counselling-wrapper">
            <NavbarCounselling/>

      {/* Mini Dashboard Summary */}

{matchedDistrictData && (
  <div className="center-count-table">
    <h5>Center Allocations in {studentData[0]?.district}</h5>
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Center Name</th>
          <th>Student Count</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(centerCounts).map(([centerName, count]) => (
          <tr key={centerName}>
            <td>{centerName}</td>
            <td>{count}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
)}


{matchedDistrictData && (
  <div className="district-summary-table">
    <h6>District Summary - {studentData[0]?.district}</h6>
    <Table bordered size="sm">
      <thead>
        <tr>
          <th>District Total</th>
          <th>Total Enrolled</th>
          <th>Total Provision</th>
          <th>Total Selected</th>
          <th>Total Waiting</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{matchedDistrictData.districtTotal}</td>
          <td>{matchedDistrictData.totalEnrolled}</td>
          <td>{matchedDistrictData.totalProvision}</td>
          <td>{matchedDistrictData.totalSelected}</td>
          <td>{matchedDistrictData.totalWaiting}</td>
        </tr>
      </tbody>
    </Table>
  </div>
)}

          <Row className="mb-4 justify-content-center">
            <Col xs={12} md={6}>
              <label className="form-label">District</label>
              <Select
                className="select-dropdown"
                placeholder="Select District"
                options={unqDistricts.map((district) => ({
                  value: district,
                  label: district,
                }))}
                onChange={handleDistrictChange}
              />
              {/* <Button className="mt-3 w-100" onClick={CounselingStudentsData}>
                Submit
              </Button> */}
            </Col>
            <br/><br/><br/><br/>
            
          </Row>
          <Row className="mb-4 justify-content-center">

            <Col xs={12} md={6}>
                <Button onClick={showInputBox}
           
            >Submit</Button>

              <Button onClick={hideInputBox}
           
            >Clear</Button>
            </Col>

          



          </Row>

          {studentData.length > 0 ? (
            <div className="student-details">
              <h4 className="section-title">Basic Details</h4>
              <hr />
              <div className="student-info">
                <p>
                  <strong>Name:</strong> {studentData[0].name}
                </p>
                <p>
                  <strong>Father:</strong> {studentData[0].father}
                </p>
                <p>
                  <strong>Gender:</strong> {studentData[0].gender}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {studentData[0].finalShortListOrWaitListStudents}
                </p>
                <p>
                  <strong>Selected Center:</strong>{" "}
                  {studentData[0].selectedSchool}
                </p>
                <p>
                  <strong>Home to School Distance:</strong>{" "}
                  <input
                    className="doc-distance-input"
                    type="text"
                    name="homeToSchoolDistance"
                    value={updatedDistance}
                    onChange={(e) => setUpdatedDistance(e.target.value)}
                    />
                  {/* {studentData[0].homeToSchoolDistance} */}
                </p>
              </div>

              <div className="center-checkboxes">
                {filteredSchools.map((eachObject) => (
                  <div
                    key={eachObject.schoolName}
                    className="checkbox-item-vertical"
                  >
                    <label className="form-check-label">
                      <input
                        type="checkbox"
                        value={eachObject.schoolName}
                        checked={
                          selectedSchool?.value === eachObject.schoolName
                        }
                        onChange={() =>
                          setSelectedSchool({
                            value: eachObject.schoolName,
                            label: eachObject.schoolName,
                          })
                        }
                        className="form-check-input"
                      />
                      {eachObject.schoolName}
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <br/>
                <label>Document Submission</label>
                <input 
                    name="documents"
                    type="number"
                    value={documents}
                    onChange={(e)=>setDocuments(e.target.value)}
                
                />
              </div>
              <div>
                <br/>
                {docSubMsg ? (<p style={{fontSize:'30px'}}>
                
                Document submitted succesfully ✅
                </p>):(null) }
              </div>

              <Button className="mt-4" onClick={docSubmission}>
                Submit Document
              </Button>
            </div>
          ) : (
            <>
              {showBox === true ? (
                <div className="submission-card-wrapper">
                  <h3 className="status-text">{attendanceMarkedStatus}</h3>
                  <Card className="submission-card">
                    <Card.Body>
                      <Card.Title>Documentation</Card.Title>
                      <Card.Text>
                        <label htmlFor="srn">Token/SRN Number</label>
                        <input
                          type="text"
                          name="srn"
                          className="form-control"
                          value={inputSrnOrToken}
                          onChange={(e) => setInputSrnOrToken(e.target.value)}
                        />
                      </Card.Text>
                      <Button
                        onClick={CounselingStudentsData}
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ) : (
                <p className="no-selection-text">Please select a district</p>
              )}
            </>
          )}
        </Container>
      </div>
    );
};
