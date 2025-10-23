import React, {useState, useEffect} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import DashBoardServices from '../services/DashBoardServices';
import Table from 'react-bootstrap/Table';
import NavbarDashboard from "../components/NavbarDashaboard"
import DistrictFilterOnly from './DistrictFilterOnly';


export default function SchoolDash10 () {
    const [BlockSchoolDash, setBlockSchoolDash] = useState([]);
    const [district, setDistrict] = useState('');
    
    const fetchPosts = async()=>{
        try {
            const response = await DashBoardServices.getDashBoard10();
            setBlockSchoolDash(response.data)
            

        } catch (error) {
            
        }
     
    }
    useEffect(() =>{
        fetchPosts();
    }, []);
    console.log(BlockSchoolDash)


    console.log(BlockSchoolDash)
    const sortBlockSchoolDash = BlockSchoolDash.sort((a,b)=>a.district.localeCompare(b.district));
    console.log(BlockSchoolDash)

    
    let filterData;
 
        if (district === "") {
             filterData = BlockSchoolDash
        } else {
            //filters district wise data
         filterData = BlockSchoolDash.filter(item => item.district === district)
        }


            
    
    return(
        <div>
          <NavbarDashboard/>
          <h5 style={{textAlign:'center'}}>Haryana Super 100 Block Level Dashboard</h5>
          <hr/>
          <DistrictFilterOnly
                // on clearing filter drop down filters resets to inital value
                
                setDistrict={setDistrict}
               
               
                />
            {filterData.length > 0 ?(
                <>
                {filterData.map((eachDistrict, index)=>(
                    <Accordion key = {index} deafaultActiveKey = {['0']}alwaysOpen>
                        {eachDistrict.blocks.map((eachBlock, eachBlockIndex)=>(
                            <>
                        
                        <Accordion.Item key={eachBlockIndex} eventKey={eachBlockIndex.toString()}>
                            <Accordion.Header>
                                <div>
                                <p style={{fontWeight:'bold', color:'red'}}>{eachBlock.block}</p>
                                <p style={{fontWeight:'bold', color:'red'}}>HS-100 Level-1 Qualified: {eachBlock.totalQualifiedCount1}</p>
                                <p style={{fontWeight:'bold', color:'red'}}>HS-100 Level-1 Result Status:{eachBlock.totalResultStatusCount1}</p>
                                </div>
                                <span style={{ marginLeft: '65%' }}>Click Here</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>School</th>
                                            <th>HS-100 Level-1 Qualified</th>
                                            <th>HS-100 Level-1 Result Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eachBlock.schools.map((eachSchool, eachSchoolIndex)=>(
                                            <tr key={eachSchoolIndex}>
                                                <td>{eachSchoolIndex+1}</td>
                                                <td>{eachSchool.school}</td>
                                                <td>{eachSchool.qualifiedCount1}</td>
                                                <td>{eachSchool.resultStatusCount1}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>

                        </Accordion.Item>
                        </>
                        ))}
                    </Accordion>
                ))}
                </>
                
            ):(<p> Mo data found</p>)}
          
        </div>
    )
}