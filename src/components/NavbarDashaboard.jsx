import React from "react";




export default function Navbar() {
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
          
            }}>Mission Buniyaad</h1>
            <h3
             style={{
              color:'#FFFFFF',
              fontWeight:'bold',
              fontSize:'45'
          
            }}
            >Haryana Super 100</h3>
          <h4
           style={{
            color:'#F2FFD7',
            fontSize:'48'
       
        
          }}
          
          >Dashboard</h4>
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