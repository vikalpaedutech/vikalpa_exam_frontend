//This component verifies the registered students data and once verified, the status on the registration slip updates to...
// registration done from pending. Enjoy the code below:

// This Page will consist User login for verification..
// I will use the same user table to store the verification team's users' data.

import React, { useState, useEffect, useContext } from "react";
import DashBoardServices from "../services/DashBoardServices";
import { Table, Row, Col, Container, Button } from "react-bootstrap";
import DependentDropsForFilter from "./DependentDropsForFilter";
import UserService from "../services/UserService";
import { Link, Navigate, useLocation } from "react-router-dom";
import { UserContext } from "./ContextApi/UserContextAPI/UserContext";
import VerificationService from "../services/VerificationService";
import registrationServiceInstance from "../services/RegistrationFormService";
import Select from "react-select";

const BaseURL = process.env.REACT_APP_API_BASE_URL;

const Verification = () => {
  //Conditionally doing something on the based on useLocaiton
  const location = useLocation();

  //Defining state hooks;

  const [allData, setAllData] = useState([]);
  const [query, setQuery] = useState("");
  const [filterApplied, setFilterApplied] = useState(false);

  //Below hooks are for letting users log in for verification.
  // const {setUser} = useContext(UserContext); // Context api

  const [userId, setUserId] = useState([]);
  const [isUerMatched, setIsUserMatched] = useState(false);
  const [errorRedirect, setErrorRedirect] = useState(false);

  //Filter Hooks

  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [school, setSchool] = useState("");

  //Below hooks are for slip remark and verificaiton status.

  const [verificationRemark, setVerificationRemark] = useState([]);

  const [isVerified, setIsVerified] = useState("");

  const [verifiedBy, setVerifiedBy] = useState('')
  // State for row-specific verification status and remarks
  const [rowData, setRowData] = useState({});


//Below state for filteredStudents data for getting only "Self" and "Pending" students
const [filteredStudents, setFilteredStudent] = useState([])

//Rerun handleSubmit

const [reRunhandleSubmit, setRerunhandlesubmit] = useState(false)

  const handleSubmit = async function (e) {
    e.preventDefault();

    try {
      const response = await VerificationService.getVerificationUsers(userId);
      // console.log(response.data.data.userId)
      const dbuserId = response.data.data.userId;

      if (dbuserId === userId) {
        setIsUserMatched(true);
        setVerifiedBy(dbuserId)
      } else {
        setIsUserMatched(false);
      }
    } catch (error) {
      setErrorRedirect(true);
    }
  };

  //Below is for filter on verification data

  const handleFilterSubmit = async () => {
    if (district || block || school) {
      setFilterApplied(true);
    } else {
      setFilterApplied(false);
    }

    let query =
      `district=${district}&block=${block}&school=${school}`.trim();

    try {
      const response = await DashBoardServices.GetAllStudentData(query);
       setAllData(response.data || []);



    } catch (error) {
      console.log("Error fetching data: ", error);
      setAllData([]); // Clear all data to set an empty array if filter don't match
    }
  };

 

  // useEffect(() => {
  //     handleFilterSubmit();
  //   }, [ district, block, school]);

  function handleClearFilter() {
    setFilterApplied(false);
    setDistrict("");
    setBlock("");
    setSchool("");
  }

  console.log(filterApplied);

  //slipRemarkOptions. Below will dynamicall show the options in the drop down on the basis of selected status.
  let slipRemarkOptions;
  if (isVerified === "Verified") {
    slipRemarkOptions = [
      { value: "Details Correct", label: "Details Correct" },
    ];
  } else if (isVerified === "Rejected") {
    slipRemarkOptions = [
      { value: "Invalid Name", label: "Invalid Name" },
      { value: "Invalid Father", label: "Invalid Father" },
      { value: "Invalid Mobile", label: "Invalid Mobile" },
      { value: "Invalid Image", label: "Invalid Image" },

    ];
  } else if (isVerified === "Pending") {
    slipRemarkOptions = [
      { value: "Image not uploaded", label: "Image not uploaded" },
    ];
  }
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //Below function sets the selected remark for react-select.
  const handleSlipRemarkChange = (selectedOptions, studentId) => {
    setRowData((prevData) => ({
      ...prevData,
      [studentId]: {
        ...prevData[studentId],
        verificationRemark: selectedOptions
          ? selectedOptions.map((option) => option.value)
          : [],
      },
    }));
    // Update the overall verificationRemark state with the array of selected values
    setVerificationRemark(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //Below function updates verification status.
  const handleVerificationStatus = (selectedOption, studentId) => {
    setRowData((prevData) => ({
      ...prevData,
      [studentId]: {
        ...prevData[studentId],
        isVerified: selectedOption ? selectedOption.value : "",
      },
    }));
    setIsVerified(selectedOption.value);
  };
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  console.log("i am verficationRemark");
  console.log(verificationRemark);

  console.log("i am isVerified status");
  console.log(isVerified);

  //Below api updates the verification status of the student


  const verifyPost = async (id, e) => {

   
    console.log(id);
    console.log(verifiedBy)
    console.log(`isVerified: ${isVerified}`)
    alert("Slip Status Updated");
    if (e) e.preventDefault();

    const formData = new FormData();
    formData.append("isVerified", isVerified);
    formData.append("verificationRemark", verificationRemark);
    formData.append("verifiedBy", verifiedBy)

    //below api will update the data in db on the based on students id

    try {
      const response = await registrationServiceInstance.patchPostById(
        id,
        formData,
        verifiedBy
      );
      console.log(response);
      setRerunhandlesubmit(true)

      setTimeout(()=>{
        handleFilterSubmit()
      },1000)
     
    } catch (error) {
      console.error("Error updating data:", error);
      setRerunhandlesubmit(false)
    }
  };



  const filterStudent = allData.filter(
    (student) => student.isVerified === "Pending" && (student.verificationRemark === "" || student.verificationRemark === null) && student.isRegisteredBy === "Self"&& student.grade === "10"

    
  );
  
//   useEffect(()=>{
//     handleFilterSubmit()
//   },[reRunhandleSubmit])
  
  console.log("i am filter student")
  console.log(allData);

  return (
    <Container>
      <Row>
        <from
          style={{
            display: "",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "",
            height: "",
            border: "",
            borderRadius: "20px",
          }}
          onSubmit={handleSubmit}
        >
          <label>ID:</label>
          <br />
          <input
            type="text"
            name="userId"
            placeholder="Your ID"
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={handleSubmit}>Login</button>
        </from>
      </Row>
      <hr/>

      {isUerMatched ? (
        <>
          <Row>
            <Col>
              <DependentDropsForFilter
                // on clearing filter drop down filters resets to inital value
                district={district}
                block={block}
                school={school}
                setDistrict={setDistrict}
                setBlock={setBlock}
                setSchool={setSchool}
              />
            </Col>

            <Row>
              <Col className="d-flex" style={{ gap: "10px" }}>
                <Button onClick={handleFilterSubmit}>Apply Filter</Button>

                <Button onClick={handleClearFilter}>Clear Filter</Button>
              </Col>
            </Row>
          </Row>

          <Row>
            {filterApplied ? (
              <>
                <Row>
                  <Col>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>SRN</th>
                          <th>Name</th>
                          <th>Father</th>
                          <th>D.O.B</th>
                          <th>Mobile</th>
                          <th>Whatsapp</th>
                          <th>District</th>
                          <th>Block</th>
                          <th>School</th>
                          <th>Class</th>
                          <th>Image</th>
                          <th>Status</th>
                          <th>Remark</th>
                          <th>Confirm</th>
                         
                        </tr>
                      </thead>
                      <tbody>
                        {filterStudent.length > 0 ? (
                          filterStudent.map((eachStudent, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{eachStudent.srn}</td>
                              <td>{eachStudent.name}</td>
                              <td>{eachStudent.father}</td>
                              <td>{eachStudent.dob}</td>
                              <td>{eachStudent.mobile}</td>
                              <td>{eachStudent.whatsapp}</td>
                              <td>{eachStudent.district}</td>
                              <td>{eachStudent.block}</td>
                              <td>{eachStudent.school}</td>
                              <td>{eachStudent.grade}</td>
                              <td>
                                <img
                                  src={`${eachStudent.imageUrl}`}
                                  alt={eachStudent.name}
                                  style={{ width: 100, height: 100 }}
                                />
                              </td>
                              {/* Below handles the verification process using multiselected dropdown */}

                              <td>
                                <Select
                                  placeholder="Select Verification status"
                                  options={[
                                    { value: "Verified", label: "Verified" },
                                    {
                                      value: "Pending",
                                      label: "Pending",
                                    },
                                    { value: "Rejected", label: "Rejected" },
                                  ]}
                                  onChange={(selectedOption) =>
                                    handleVerificationStatus(
                                      selectedOption,
                                      eachStudent._id
                                    )
                                  }
                                  value={
                                    rowData[eachStudent._id]?.verificationRemark
                                      ? {
                                          value:
                                            rowData[eachStudent._id]
                                              ?.isVerified,
                                          label:
                                            rowData[eachStudent._id]
                                              ?.isVerified,
                                        }
                                      : null
                                  }
                                />
                              </td>

                              <td>
                                <Select
                                  placeholder="Select Slip Remarks"
                                  isMulti
                                  options={
                                    rowData[eachStudent._id]?.isVerified ===
                                    "Verified"
                                      ? [
                                          {
                                            value: "Details Correct",
                                            label: "Details Correct",
                                          },
                                        ]
                                      : rowData[eachStudent._id]?.isVerified ===
                                        "Rejected"
                                      ? [
                                          {
                                            value: "Invalid Name",
                                            label: "Invalid Name",
                                          },
                                          {
                                            value: "Invalid Father",
                                            label: "Invalid Father",
                                          },
                                          {
                                            value: "Invalid Mobile",
                                            label: "Invalid Mobile",
                                          },
                                          {
                                            value: "Invalid Image",
                                            label: "Invalid Image",
                                          },
                                          
                                        ]
                                      : rowData[eachStudent._id]?.isVerified ===
                                        "Pending"
                                      ? [
                                          {
                                            value: "Image not uploaded",
                                            label: "Image not uploaded",
                                          },
                                        ]
                                      : [] // Default to empty options if no status is selected
                                  }
                                  onChange={(selectedOptions) =>
                                    handleSlipRemarkChange(
                                      selectedOptions,
                                      eachStudent._id
                                    )
                                  }
                                  value={
                                    rowData[eachStudent._id]?.verificationRemark
                                      ? rowData[
                                          eachStudent._id
                                        ]?.verificationRemark.map((value) => ({
                                          value,
                                          label: value,
                                        }))
                                      : []
                                  }
                                />
                              </td>

                              <td>
                                <button
                                  id={eachStudent._id}
                                  onClick={(e) =>
                                    verifyPost(eachStudent._id, e)
                                  }
                                >
                                  Submit
                                </button>
                              </td>
                             
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="14" style={{ textAlign: "center" }}>
                              This District or block or shool has no
                              registration yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </>
            ) : (
              <div>
                <h1>Kinldy Apply filters to Check Your School Dashboard</h1>
              </div>
            )}
          </Row>
        </>
      ) : (
        <p>Wrong User Id</p>
      )}
    </Container>
  );
};

export default Verification;
