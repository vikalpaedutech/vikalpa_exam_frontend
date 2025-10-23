import React, {useState, useEffect} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import RegistratonFormService from '../services/RegistrationFormService';// I can remove this 
import DashBoardServices from '../services/DashBoardServices';
import Table from 'react-bootstrap/Table';
import NavbarDashboard from '../components/NavbarDashaboard';




export default function DistrictBlockDash10 () {

const [stateDash, setStateDash] = useState([]);

const fetchPosts = async () =>{
    try {
        
        const response = await DashBoardServices.getDashBoard10();
        setStateDash(response.data);
        console.log(response.data)
        
        
    } catch (error) {
        console.log('Error occured in fetching posts', error);
    }
};

useEffect(() =>{
    fetchPosts();
}, []);

// const sortStateDash = stateDash.sort((a, b) => a.district.localeCompare(b.district));
// console.log(sortStateDash)

 //Below variables are for shwoing total count on dashboars:
 const totalDistrictCount = stateDash.reduce((sum, eachDistrictCount) => {
  return sum + eachDistrictCount.districtCount;
}, 0);
console.log(totalDistrictCount)

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    return (
        <div>
          <NavbarDashboard/>
          <h5 style={{textAlign:'center'}}>Haryana Super 100 Dash Board-District Level</h5>
      <hr/>
      {/* <p style={{fontSize:'30', textAlign:'center'}}> Registration Count: {totalDistrictCount}</p> */}
      <hr/>
            <Table responsive>
            
           
            {stateDash.length>0 ? (
                <>
                {stateDash.map((eachDistrict, index)=>(
                 
                    
                        
                    <Accordion defaultActiveKey="0" key={index} >
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <div>
            <p style={{fontWeight:'bold', color:'red'}}>{eachDistrict.district}</p>
            <p style={{fontWeight:'bold', color:'red'}}>HS-100 L-1 Qualified: {eachDistrict.totalQualifiedCount1}</p>
            <p style={{ fontWeight:'bold', color:'red'}}>HS-100 L-1 Result Status: {eachDistrict.totalResultStatusCount1}</p>
            
        </div>
        </Accordion.Header>
        <Accordion.Body>
        <Table responsive>
      <thead>
     
        <tr>
            <th>#</th>
                          <th>Block</th>
                          <th>HS-100 Level-1 Qualified</th>
                          <th>HS-100 Level-1 Result Status</th>
                        </tr>
      </thead>
      <tbody>
         {/* Access blocks within eachDistrict */}
         {eachDistrict.blocks.map((eachBlock, blockIndex) => (
                          <tr key={blockIndex}>
                            <td>{blockIndex + 1}</td>
                            <td>{eachBlock.block}</td>
                            <td>{eachBlock.totalQualifiedCount1}</td>
                            <td>{eachBlock.totalResultStatusCount1}</td>
                          </tr>
                        ))}
        
      </tbody>
    </Table>
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
    
                    
                 
                ))}
                </>
            ):(null)}
           
              </Table>
        </div>

    )
}