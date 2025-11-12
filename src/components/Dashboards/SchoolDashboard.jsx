// // src/components/Dashboards/BlockSchoolDashboard8.jsx
// import React, { useEffect, useState, useMemo, useContext } from "react";
// import {
//   Accordion,
//   Card,
//   Table,
//   Spinner,
//   Alert,
//   Badge,
//   Container,
//   Row,
//   Col,
//   Form
// } from "react-bootstrap";
// import Select from "react-select";
// import { District_block_dependentDropdown, District_block_school_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns";
// import { DistrictBlockSchoolDependentDropDownContext, District_school_dependentDropdown } from "../NewContextApis/District_block_schoolsCotextApi";
// import { ClassOfStduentDropDowns } from "../DependentDropDowns/Student_Class_Related_dropdowns";
// import { StudentContext } from "../NewContextApis/StudentContextApi.js";
// import { GetRegisteredStudentsDataBySchoolAndClass } from "../../services/DashBoardServices/DashboardService";

// import { useLocation } from "react-router-dom";

// export const SchoolDashboard = () => {

//   const location = useLocation();


//   let filteredClass;
//   if (location.pathname === "/school-dashboard-mb"){
//     filteredClass = "8"
//   } else if (location.pathname === "/school-dashboard-mb"){
//     filteredClass = "10"
//   }

//   //Context api
//  const context = useContext(DistrictBlockSchoolDependentDropDownContext);
//   const {
//     districtContext,
//     setDistrictContext,
//     blockContext,
//     setBlockContext,
//     schoolContext,
//     setSchoolContext,
//   } = context || {};

  

//   //---------------------------------------------------------------------------

//   //context api

//   const [data, setData] = useState([])

//   const [selectedClass, setSelectedClass] = useState("")

//   const fetchStudentData = async () => {

    
    

//     const reqBody = {

//       schoolCode: schoolContext?.value,
//       classOfStudent: filteredClass
//     }


//     try {
//       const response = await GetRegisteredStudentsDataBySchoolAndClass(reqBody);
//       console.log(response.data)
//       setData(response.data)
//     } catch (error) {
//       console.error("error occurred in fetching data", error)
//     }
//   }


//   useEffect(()=>{

//     fetchStudentData();
//   }, [schoolContext])

//   return (

//     <>
    
// <District_block_school_dependentDropdown/>

//     </>
//   )

// }












// src/components/Dashboards/BlockSchoolDashboard8.jsx
import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  Accordion,
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Container,
  Row,
  Col,
  Form
} from "react-bootstrap";
import Select from "react-select";
import { District_block_dependentDropdown, District_block_school_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns";
import { DistrictBlockSchoolDependentDropDownContext, District_school_dependentDropdown } from "../NewContextApis/District_block_schoolsCotextApi";
import { ClassOfStduentDropDowns } from "../DependentDropDowns/Student_Class_Related_dropdowns";
import { StudentContext } from "../NewContextApis/StudentContextApi.js";
import { GetRegisteredStudentsDataBySchoolAndClass } from "../../services/DashBoardServices/DashboardService";

import { useLocation } from "react-router-dom";

export const SchoolDashboard = () => {

  const location = useLocation();


  let filteredClass;
  if (location.pathname === "/school-dashboard-mb"){
    filteredClass = "8"
  } else if (location.pathname === "/school-dashboard-mb"){
    filteredClass = "10"
  }

  //Context api
 const context = useContext(DistrictBlockSchoolDependentDropDownContext);
  const {
    districtContext,
    setDistrictContext,
    blockContext,
    setBlockContext,
    schoolContext,
    setSchoolContext,
  } = context || {};

  

  //---------------------------------------------------------------------------

  //context api

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [selectedClass, setSelectedClass] = useState("")

  const fetchStudentData = async () => {

    const reqBody = {
      schoolCode: schoolContext?.value,
      classOfStudent: filteredClass
    }

    setLoading(true)
    setError(null)

    try {
      const response = await GetRegisteredStudentsDataBySchoolAndClass(reqBody);
      console.log(response.data)
      setData(response.data || [])
    } catch (error) {
      console.error("error occurred in fetching data", error)
      setError(error)
      setData([])
    } finally {
      setLoading(false)
    }
  }


  useEffect(()=>{

    fetchStudentData();
  }, [schoolContext])

  // helper to create initials avatar as SVG data URL when no image is uploaded
  const initialsAvatar = (name = "") => {
    const initials = (name || "")
      .split(" ")
      .map(part => part[0])
      .filter(Boolean)
      .slice(0,2)
      .join("")
      .toUpperCase() || "?";
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
      <rect width='100%' height='100%' fill='#e9ecef'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='32' fill='#6c757d'>${initials}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const totalCount = data?.length || 0;

  return (

    <>

      <District_block_school_dependentDropdown/>

      <Container fluid className="mt-4">
        <Row className="mb-3">
          <Col md={8}>
            <h4>School Dashboard - (Class {filteredClass})</h4>
        
            {/* <div className="text-muted">School: {schoolContext?.label || "—"}</div> */}
            {/* <div className="text-muted">Class (filtered): {filteredClass || "—"}</div> */}

            <div>
              <div style={{fontSize: 14}} className="text-muted">Total Registration: {loading ? <Spinner animation="border" size="sm" /> : totalCount}</div>

            </div>
                <hr></hr>
          </Col>
          <Col md={4} className="d-flex align-items-center justify-content-end">
            
          </Col>
        </Row>

        <Row>
          <Col>
            {error && (
              <Alert variant="danger">
                Error fetching student data. {String(error?.message || "")}
              </Alert>
            )}

            <Card>
              <Card.Body style={{ padding: 0 }}>
                <Table responsive bordered hover className="mb-0">
                  <thead>
                    <tr>
                      <th style={{width: "60px"}}>#</th>
                      <th>SRN</th>
                      <th>Name</th>
                      <th>Father</th>
                      <th>Gender</th>
                      <th style={{width: "120px"}}>Photo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <Spinner animation="border" /> Loading students...
                        </td>
                      </tr>
                    )}

                    {!loading && data && data.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                          No students found for this school/class.
                        </td>
                      </tr>
                    )}

                    {!loading && data && data.length > 0 && data.map((stu, idx) => (
                      <tr key={stu._id || idx}>
                        <td>{idx + 1}</td>
                        <td>{stu.srn}</td>
                        <td>
                          <div style={{fontWeight:600}}>{stu.name || "—"}</div>
                          {/* <div style={{fontSize:12}} className="text-muted">SRN: {stu.srn || "—"}</div> */}
                        </td>
                        <td>{stu.father || "—"}</td>
                        <td>{stu.gender || "—"}</td>
                        <td>
                          {stu.imageUrl && stu.imageUrl !== "Not uploaded" ? (
                            // imageUrl might be relative or absolute — leave as-is
                            <img
                              src={stu.imageUrl}
                              alt={stu.name}
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 6,
                                border: "1px solid #ddd"
                              }}
                            />
                          ) : (
                            <img
                              src={initialsAvatar(stu.imageUrl)}
                              alt={stu.name}
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 6,
                                border: "1px solid #ddd"
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

<br></br>

      </Container>

    </>
  )

}
