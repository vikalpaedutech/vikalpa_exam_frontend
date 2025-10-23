import React, {useState, useEffect, useContext} from 'react';
import DashBoardServices from '../services/DashBoardServices';
import {Table, Row, Col, Container, Button} from 'react-bootstrap';
import DependentDropsForFilter from './DependentDropsForFilter';
import NavbarDashboard from "../components/NavbarDashaboard"

const BaseURL = process.env.REACT_APP_API_BASE_URL;

const SchoolDash8 = () => {
    //Defining state hooks;

    const [allData, setAllData] = useState([]);
    const [query, setQuery] =  useState('');
    const [filterApplied, setFilterApplied] = useState(false)

    //Filter Hooks

    const [district, setDistrict] = useState('')
    const [block, setBlock] = useState('')
    const [school, setSchool] = useState('')
  


    const handleFilterSubmit = async () => {
       if(district && block && school){
        setFilterApplied(true)
       

       } else{
        setFilterApplied(false)
       }

       //below variables pulls ony those data on dashboard which were qualified in respective levels of exams.
       let isQualifiedL1 = true;
       let isQualifiedL2 = true;
       //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


       let query = `district=${district}&block=${block}&school=${school}&grade=8&isVerified=Verified&isVerified=Pending&isQualifiedL1=${isQualifiedL1}`.trim();
      
       
        try {
            const response = await DashBoardServices.GetAllStudentData(query);
            setAllData(response.data || []);

            
        } catch (error) {
            console.log('Error fetching data: ', error);
            setAllData([])// Clear all data to set an empty array if filter don't match
            
        }

      
        
    };

    // useEffect(() => {
    //     handleFilterSubmit();
    //   }, [ district, block, school]);


      function handleClearFilter () {
        setFilterApplied(false)
        setDistrict('')
        setBlock('')
        setSchool('')
      }

      console.log(filterApplied)


      return (
        <>
        <NavbarDashboard/>
        <h5 style={{textAlign:'center'}}>Mission Buniyaad School Level Dashboard</h5>
        <hr/>
        <Container>
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
                <Col className="d-flex" style={{ gap: '10px' }}>
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
                            <th>Gender</th>
                            <th>Category</th>
                            <th>District</th>
                            <th>Block</th>
                            <th>School</th>
                            <th>Class</th>
                            <th>Image</th>
                            <th>Qualified/Not-Qualified</th>

                        </tr>
                    </thead>
                    <tbody>
                        {allData.length > 0 ? (
                            allData.map((eachStudent, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{eachStudent.srn}</td>
                                    <td>{eachStudent.name}</td>
                                    <td>{eachStudent.father}</td>
                                    <td>{eachStudent.dob}</td>
                                    <td>{eachStudent.gender}</td>
                                    <td>{eachStudent.category}</td>
                                    <td>{eachStudent.district}</td>
                                    <td>{eachStudent.block}</td>
                                    <td>{eachStudent.school}</td>
                                    <td>{eachStudent.grade}</td>
                                    <td>
                                        <img
                                        src={`https://vikalpaexamination.blr1.digitaloceanspaces.com/postImages/${eachStudent.imageUrl}`}
                                        alt={eachStudent.name}
                                        style={{width:100, height:100}}/>
                                    </td>
                                    <td>
                                    {eachStudent.isQualifiedL2 ? 'Qualified' : 'Not Qualified'}
                                    </td>

                                </tr>
                            ))
                        ):(
                            <tr>
                                 <td colSpan="14" style={{ textAlign: "center" }}>This district/block/school has not registered yet.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                </Col>
            </Row>
                </>

            ):(
                <div>
                    <h1>Kinldy Apply filters to Check Your School Dashboard</h1>
                </div>
            )}
            
        

            </Row>

        </Container>
        </>
      )


}

export default SchoolDash8;