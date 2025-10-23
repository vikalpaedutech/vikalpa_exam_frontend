import React, { useEffect, useState, Component, useContext } from "react";
import Select from "react-select";
import DistrictBlockSchoolService from "../services/DistrictBlockSchoolService";
import { StudentContext } from "./ContextApi/StudentContextAPI/StudentContext";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';


export default function DependentDropComponent({
  setDistrict = () => {},
  setBlock = () => {},
  setSchool = () => {},
  setshowManualSchool = () => {},
  setSchoolCode = () => {},
  setManualSchoolNameIsChecked = () =>{}

}) {
  const [districtList, setDistrictList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  // const [manualSchool, setManualSchool] = useState(false)

  const [showSchoolDropDown, setShowSchoolDropDonw] = useState(true)

  // Getting student object from StudentContext.js Api.
  const {student} = useContext(StudentContext);



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

const prefilledBlock = ()=>{
  if (student && student.school){
    return {
      value: student.block,
      label: student.block,
    }
  }
}

// setting the prefilled school using StudentContext api using following logic.

const prefilledSchool =()=>{
  if (student && student.school){
    return {
      value: student.school,
      label: student.school,
    }
  }
}

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

  const handleSubmit =()=>{
    alert('helllo')
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      fontSize: '1rem',
      lineHeight: '1.5',
      color: '#495057', // Default Bootstrap text color
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#86b7fe' : '#ced4da', // Bootstrap border color and focus color
      borderRadius: '0.375rem', // Match Bootstrap's rounded border
      padding: '0.375rem 0.75rem', // Bootstrap padding
      minHeight: 'calc(1.5em + 0.75rem + 2px)', // Height calculation to match
      boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none', // Match Bootstrap's focus shadow
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      '&:hover': {
        borderColor: '#86b7fe', // Hover border color
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6c757d', // Bootstrap's placeholder color
      fontSize: '1rem',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#e9ecef' : 'white', // Hover color for options
      color: 'black',
      padding: '0.375rem 0.75rem', // Match Bootstrap option padding
      fontSize: '1rem',
      '&:hover': {
        backgroundColor: '#e9ecef', // Hover background for options
        color: '#495057',
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.375rem', // Border radius to match Bootstrap
      borderColor: '#ced4da',
      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)', // Bootstrap shadow style
      marginTop: '0.25rem',
    }),
  };

  //below is the logic for showing and hiding manual school input on the basis of marked check or not.

const [handleClickCount, setHandleClickCount] = useState(0)

  const handleOnClilck =(e)=>{
    

    setHandleClickCount(handleClickCount+1)

   

    if (handleClickCount%2===0 ){
      setshowManualSchool(true)
      setShowSchoolDropDonw(false)
      setManualSchoolNameIsChecked(true) //It is a prop that checks if the checkbox clicked or not.
    } else{
      setshowManualSchool(false)
      setShowSchoolDropDonw(true)
      setManualSchoolNameIsChecked(false);//It is a prop that checks if the checkbox clicked or not.
    }

    
  }




  return (
    <>
     <Form>
      <Container>
        <Row>
          <Col>
          
    <div style={{ display: '', flexDirection: 'column', alignItems: 'center' }}>

      <Form.Group className="mb-3" controlId="districtSelect">
     
        <Form.Label>School District (स्कूल का जिला चुनें) :</Form.Label>
        
        <Select
       placeholder="School District (स्कूल का जिला चुनें)"
       //value={prefilledDistrict()} // Call the function to get the prefilled value
          
          options={districtList.map((d) => ({
            value: d.d_id,
            label: d.d_name,
            
          }))}
          onChange={handleDistirctChange} styles={customStyles}
          
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="blockSelect">
        <Form.Label>School Block (स्कूल का ब्लॉक चुनें) :</Form.Label>
    
        <Select
        placeholder="School Block (स्कूल का ब्लॉक चुनें) :"
        //value={prefilledBlock()}
          onChange={handleBlockChange}
          options={filteredBlock.map((b) => ({
            value: b.b_id,
            label: b.b_name,
          }))}
          
          styles={customStyles} />
      
      </Form.Group>
       
          {showSchoolDropDown ? (<>
            <Form.Group className="mb-3" controlId="schoolSelect">
            <Form.Label>Select School (स्कूल चुनें) :</Form.Label>

<Select
placeholder='Select School (स्कूल चुनें) :'
//value={prefilledSchool()}
  onChange={handleSchoolChange}
  options={filteredSchool.map((s) => ({
    value: s.b_id,
    label: s.s_name,
  }))}
 
  styles={customStyles}   /> 
  </Form.Group>

</> ):(
  <div >
  <Form.Group className="mb-3">
    <Form.Label>School Name (स्कूल का नाम) :</Form.Label>
    <Form.Control 
      type="text" 
      name="school" 
      placeholder="School Name (स्कूल का नाम)" 
      onChange={(e) => setSchool(e.target.value)} 
      required
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>School Code (स्कूल कोड दर्ज करें) :</Form.Label>
    <Form.Control 
      type="text" 
      name="schoolCode" 
      placeholder="School Code (स्कूल कोड दर्ज करें)" 
      onChange={(e) => setSchoolCode(e.target.value)} 
      required 
    />
  </Form.Group>
</div>)}

        
          
    </div>
    <div className="checkbox" id="DependentLabel">
      <div><label htmlFor="myCheckbox">यदि आपका विद्यालय उपर दी गई सूची में नहीं है, तो कृपया यहाँ टिक करें।</label></div>
    
    <div className="checkbox" id="DependentCheckbox"><input type="checkbox" id="myCheckbox" onClick={handleOnClilck}/></div>
      
    </div>
    </Col>
    
    </Row>
    </Container>
    </Form>
    </>
  );
}