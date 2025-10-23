//FRONTEND/src/components/counselling/CounsellingDash.jsx

import React, { useState, useEffect } from "react";
import DashBoardServices from "../../services/DashBoardServices";
import { Row, Col, Table, Container, Accordion } from "react-bootstrap";
import NavbarCounselling from "../NavbarCounselling";

export const CounsellingDash = () => {
  //Hooks
  const [dashboardData, setDashBoardData] = useState([]);

  //--------------------------------------------------

  const fetchDashboardData = async () => {
    try {
      const response =
        await DashBoardServices.GetDataFor8DashboardCounselling();
      setDashBoardData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching dashboard data", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Container fluid>
        <NavbarCounselling/>
      <Table striped bordered hover>
        {/* <thead>
        <tr>
          <th>#</th>
          <th>District</th>
          <th>Enrolled</th>
          <th>Provision</th>
        </tr>
      </thead> */}
        <tbody>
          {dashboardData.length > 0
            ? dashboardData.map((eachDistrict, index) => {
                return (
                  <Accordion defaultActiveKey="0" flush>
                    <Accordion.Item eventKey={index}>
                      <Accordion.Header>
                        {/* <tr key={eachDistrict.district}>
                        <td>{index + 1}</td>
                        <td>{eachDistrict.district}</td>
                        <td>{eachDistrict.totalEnrolled}</td>
                        <td>{eachDistrict.totalProvision}</td>
                    </tr> */}
                        <div key={index} id={index}>
                          <p>District: {eachDistrict.district}</p>
                          <p>Total Student: {eachDistrict.districtTotal}</p>
                          <p>Present: {eachDistrict.totalCounsellingPresent}</p> 
                          <p>Enrolled: {eachDistrict.totalEnrolled}</p>
                          <p>Provision: {eachDistrict.totalProvision}</p>
                           
                          <hr />
                          <p>
                            Total Documented:{" "}
                            {eachDistrict.totalEnrolled +
                              eachDistrict.totalProvision}
                          </p>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Table striped bordered hover>
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Center Name</th>
                                  <th>Total Student</th>
                                  <th>Present</th>
                                  <th>Enrolled</th>
                                  <th>Provision</th>
                                  <th>Documented</th>
                                </tr>
                              </thead>
                        {eachDistrict.centers.map((eachCenter, index) => {
                          return (
                            
                              <tbody>
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>
                                    {" "}
                                    {eachCenter.counsellingCenterAllocation}
                                  </td>
                                  <td>{eachCenter.totalStudents}</td>
                                  <td>{eachCenter.counsellingPresentCount}</td>
                                  <td>{eachCenter.enrolledCount}</td>
                                  <td>{eachCenter.provisionCount}</td>
                                  <td>{eachCenter.enrolledCount + eachCenter.provisionCount}</td>
                                </tr>
                              </tbody>
                           
                          );
                          
                        })}
                         </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                );
              })
            : null}
        </tbody>
      </Table>
    </Container>
  );
};
