import React, {useState, useEffect} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import DashBoardServices from '../services/DashBoardServices';
import Table from 'react-bootstrap/Table';
import NavbarDashboard from "../components/NavbarDashaboard"
import DistrictFilterOnly from './DistrictFilterOnly';


export default function SchoolDash8 () {
    const [BlockSchoolDash, setBlockSchoolDash] = useState([]);
    const [district, setDistrict] = useState('');
    const [block, setBlock] = useState('');
    const [school, setSchool]= useState('')
    
    const fetchPosts = async()=>{
        try {
            const response = await DashBoardServices.getDashBoard8();
            setBlockSchoolDash(response.data)
            

        } catch (error) {
            
        }
     
    }
    useEffect(() =>{
        fetchPosts();
    }, []);
        
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
           <h5 style={{textAlign:'center'}}>Mission Buniyaad Block Level Dashboard</h5>
           <hr/>
           <DistrictFilterOnly
                // on clearing filter drop down filters resets to inital value
                district={district}
                block={block}
                school={school}
                setDistrict={setDistrict}
                setBlock={setBlock}
                setSchool={setSchool}
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
                                <p style={{fontWeight:'bold', color:'red'}}>MB Level-2 Qualified: {eachBlock.totalQualifiedCount2}</p>
                                <p style={{fontWeight:'bold', color:'red'}}>MB Level-2 Result Status: {eachBlock.totalResultStatusCount2}</p>
                                </div>
                                <span style={{ marginLeft: '65%' }}>Click Here</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>School</th>
                                            <th>MB Level-2 Qualified</th>
                                            <th>MB Level-2 Result Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eachBlock.schools.map((eachSchool, eachSchoolIndex)=>(
                                            <tr key={eachSchoolIndex}>
                                                <td>{eachSchoolIndex+1}</td>
                                                <td>{eachSchool.school}</td>
                                                <td>{eachSchool.qualifiedCount2}</td>
                                                <td>{eachSchool.resultStatusCount2}</td>

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