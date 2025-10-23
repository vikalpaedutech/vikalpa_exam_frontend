import React, { useEffect, useState, Component, useContext } from "react";
import Select from "react-select";
import DistrictBlockSchoolService from "../services/DistrictBlockSchoolService";
import { StudentContext } from "./ContextApi/StudentContextAPI/StudentContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

export default function DependentDropComponent({
district,
block,
school,
  setDistrict = () => {},
  setBlock = () => {},
  setSchool = () => {},
  setshowManualSchool = () => {},
  setSchoolCode = () => {},
}) {
  const [districtList, setDistrictList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  // const [manualSchool, setManualSchool] = useState(false)

  const [showSchoolDropDown, setShowSchoolDropDonw] = useState(true);

  // Getting student object from StudentContext.js Api.
  const { student } = useContext(StudentContext);

  //Fetching district by calling the api in DistricBlockSchoolService which in return calls the api in  backend.
  const fetchDistrict = async () => {
    try {
      const response = await DistrictBlockSchoolService.getDistricts();
      setDistrictList(response.data.data);
    } catch (error) {
      console.log("Error Occured fetching districts from the db", error);
    }
  };

  //Fetching blocks by calling the api in DistrictBlockSchoolService.js

  const fetchBlock = async () => {
    try {
      const response = await DistrictBlockSchoolService.getBlocks();
      setBlockList(response.data.data);
    } catch (error) {
      console.log("Error fetching Posts", error);
    }
  };

  const fetchSchool = async () => {
    try {
      const response = await DistrictBlockSchoolService.getSchools();
      setSchoolList(response.data.data);
    } catch (error) {
      console.log("Error fetching Posts", error);
    }
  };

  useEffect(() => {
    fetchDistrict();
    fetchBlock();
    fetchSchool();
  }, []);

  //_____________________________________________________________________________________________________________________________________
  // Below logic prefilledDistrict, prefilledBlock, and prefilledShool are for prefilledRegsitrationForm component...
  // where user inserts an srn and it fetches the prefilled form..............................................
  // Setting the prefilled district using StudentContext api using following logic.

  const prefilledDistrict = () => {
    if (student && student.district) {
      return {
        value: student.district,
        label: student.district,
      };
    }
  };

  // Setting the prefilled district using StudentContext api using following logic

  const prefilledBlock = () => {
    if (student && student.school) {
      return {
        value: student.block,
        label: student.block,
      };
    }
  };

  // setting the prefilled school using StudentContext api using following logic.

  const prefilledSchool = () => {
    if (student && student.school) {
      return {
        value: student.school,
        label: student.school,
      };
    }
  };

  //^________________________________________________________________________________________________________^

  // Convert district data into the format that react-select expects
  //    object = [
  //     {value: id_1, label: name1},
  //     {value: id_2, label: name2}
  //    ]

  const handleDistirctChange = (selectedOption) => {
    setSelectedDistrict(selectedOption.value);
    setDistrict(selectedOption.label);
    // Reset block selection
  }; //this is one of the method of getting selected value from react-select tage

  const handleBlockChange = (selectedOption) => {
    setSelectedBlock(selectedOption.value);
    setBlock(selectedOption.label);
  };

  const handleSchoolChange = (selectedOption) => {
    setSchool(selectedOption.label);
  };

  const filteredBlock = blockList.filter(
    (eachBlock) => eachBlock.d_id === selectedDistrict
  );
  //   console.log(filteredBlock) //this logic gives the new filtered array from the block array for the dynamic change in drop down after the user has selected the district.

  const filteredSchool = schoolList.filter(
    (eachSchool) => eachSchool.b_id === selectedBlock
  );
  //   console.log(filteredSchool);//this logic gives the new filtered array from the school array for the dynamic change in drop down after the user has selected the block.

  const handleSubmit = () => {
    alert("helllo");
  };

  

  //below is the logic for showing and hiding manual school input on the basis of marked check or not.

  const [handleClickCount, setHandleClickCount] = useState(0);

  const handleOnClilck = (e) => {
    setHandleClickCount(handleClickCount + 1);

    if (handleClickCount % 2 === 0) {
      setshowManualSchool(true);
      setShowSchoolDropDonw(false);
    } else {
      setshowManualSchool(false);
      setShowSchoolDropDonw(true);
    }
  };

  const styles = {
    control: (base) => ({
      ...base,
      minHeight: 32,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    clearIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
  };

  return (
    <>
      <Form>
        <Container>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="districtSelect">
                <Form.Label>Select District</Form.Label>

                <Select
                  placeholder="Select District"
                  // value={district ? { label: district, value: district } : null}
                  options={districtList.map((d) => ({
                    value: d.d_id,
                    label: d.d_name,
                  }))}
                  onChange={handleDistirctChange}
                   styles={styles}              />
              </Form.Group>
            </Col>

            <Col>

            <Form.Group className="mb-3" controlId="blockSelect">
              <Form.Label>Select Block</Form.Label>

              <Select
                placeholder="Select Block"
                // value = {block ? {label: block, value: block}: null}
               
                onChange={handleBlockChange}
                options={filteredBlock.map((b) => ({
                  value: b.b_id,
                  label: b.b_name,
                }))}
             
              />
            </Form.Group>
            </Col>
            
            <Col>
            {showSchoolDropDown ? (
              <>
                <Form.Group className="mb-3" controlId="schoolSelect">
                  <Form.Label>Select School</Form.Label>

                  <Select
                    placeholder="Selct School"
                    // value = {school ? {label: school, value: school}:null}
                    onChange={handleSchoolChange}
                    options={filteredSchool.map((s) => ({
                      value: s.b_id,
                      label: s.s_name,
                    }))}
                   
                  />
                </Form.Group>
              </>
            ) : (
              <div>
                <Form.Group className="mb-3">
                  <Form.Label>Enter School Manually</Form.Label>
                  <Form.Control
                    type="text"
                    name="school"
                    placeholder="Type Your School Name"
                    onChange={(e) => setSchool(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Enter School Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="schoolCode"
                    placeholder="Type Your School Code"
                    onChange={(e) => setSchoolCode(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            )}
            </Col>

            {/* <div className="checkbox" id="DependentLabel">
              <div>
                <label htmlFor="myCheckbox">
                  Agar aapka school upr list m nhi h to yaha:
                </label>
              </div>

              <div className="checkbox" id="DependentCheckbox">
                <input
                  type="checkbox"
                  id="myCheckbox"
                  onClick={handleOnClilck}
                />
              </div>
            </div> */}
          </Row>
        </Container>
      </Form>
    </>
  );
}
