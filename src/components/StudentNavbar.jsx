import React, {useState, useContext} from "react";
import { useLocation } from "react-router-dom";
// import { StudentContext } from "./ContextApi/StudentContextAPI/StudentContext";

// const customStyles ={
//     color: "black"
    
// }

// export default function StudentNavbar() {

//     //Destructruing the contexgt api to show student data dynamically on the navbar. 
//     //setStudent stae was updated in the StudentSignin already. So if user logins into his her account then the instance automatcially... 
//     //...updates here
//     const {setStudent} = useContext(StudentContext);
    
//     const {student} = useContext(StudentContext);

//     //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//     return (
//         <div style={{ textAlign: 'center' }}>
//           <nav style={{
//             background: "#079BF5",
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '00px', // Add some padding for better spacing
//             border:'solid'
            
//           }}>
//             <img src="./HRLogo.png" style={{ width: '100px', height: 'auto' }} />
//             <div>
//             <h1 style={customStyles}>
//              Welcome: {student.name}
//             </h1>
//             {student.grade === "8" ?(
//                 <h2>Mission Buinyaad L-1 Student Account</h2>
//                 ):(<h2>Haryana Super 100 L-1 Student Account</h2>)}
//           <h2>Batch 2025-27</h2>
//           </div>
//             <img src="./Buniyaad.png" style={{ width: '100px', height: 'auto' }} />
//           </nav>
          
      
//           <style>
//           <style>
//                 {`
//                   @media (max-width: 600px) {
//                     nav {
//                       flex-direction: column; 
//                       align-items: center; 
//                     }
//                     img {
//                       margin: 5px 0;
//                       width: 80px;
//                       height: auto
//                     }
//                     h1 {
//                       font-size: 24px; /* Adjust as needed */
//                     }
//                     h2 {
//                       font-size: 20px; /* Adjust as needed */
//                     }
//                     h3 {
//                       font-size: 18px; /* Adjust as needed */
//                     }
//                   }
//                 `}
//             </style>
//           </style>
//         </div>
//       );
//     }






 




export default function Navbar() {

  const location = useLocation();

  let Header1

  if (location.pathname ==='/Registration-form/MB' )
{
  Header1 = 'Mission Buniyaad'
} else if (location.pathname === '/Registration-form/put/MB') {
  Header1 = 'Mission Buniyaad' 
} else {
  Header1 = 'Haryana Super 100' 
}



    return (
      
        <div style={{ textAlign: 'center' }}>
          <nav style={{
           background: '#0F326F',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '00px', // Add some padding for better spacing
            border:''
            
          }}>
            <div>
            <img src="/haryana.png" style={{ width: '100px', height: 'auto' }} />
            </div>
            <div>
            <h5 style={{color: '#F2FFD7',
              fontWeight:'bold'
              
            }}>
              <br/>
              हरियाणा प्रतिभा खोज
            </h5>
            <h1
             style={{
              color:'#FFFFFF',
              fontWeight:'bold',
              fontSize:'50px'
          
            }}>{Header1}</h1>
            {/* <h3
             style={{
              color:'#FFFFFF',
              fontWeight:'bold',
              fontSize:'45'
          
            }}
            >Haryana Super 100</h3> */}
          <h4
           style={{
            color:'#F2FFD7',
            fontSize:'48'
       
        
          }}
          
          >Registration Form</h4>
          <h4
           style={{
            color:'#F2FFD7',
            fontSize:'40'
        
          }}
          
          >Batch 2025-27</h4>
          </div>
            <img src="/Buniyaad.png" style={{ width: '100px', height: 'auto' }} />
          </nav>
          
      
          <style>
          <style>
                {`
                  @media (max-width: 600px) {
                    nav {
                      flex-direction: column; 
                      align-items: center; 
                    }
                    img {
                      margin: 5px 0;
                      width: 80px;
                      height: auto
                    }
                    h1 {
                      font-size: 24px; /* Adjust as needed */
                    }
                    h2 {
                      font-size: 20px; /* Adjust as needed */
                    }
                    h3 {
                      font-size: 18px; /* Adjust as needed */
                    }
                  }
                `}
            </style>
          </style>
        </div>
      );
    }