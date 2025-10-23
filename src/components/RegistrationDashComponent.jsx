import React, { useState, useEffect } from "react";
import RegistrationFormService from "../services/RegistrationFormService";

function RegistrationDashComponent() {
  const [registrationAll, setRegistrationAll] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await RegistrationFormService.getPosts();
      setRegistrationAll(response.data.data);
    } catch (error) {
      console.log("Error fetching Posts", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id, e)=>{
    var response = await RegistrationFormService.deletePosts(id);
    if(response.data.success == true) {
        alert(response.data.msg);
        document.getElementById(id).parentElement.parentElement.remove();
    } else {
        alert(response.data.msg);

    }
  };

  return (
    <div>
      {/* <h2>Registration Data</h2>
            {registrationAll.length === 0 ? (
                <p>No registrations found.</p>
            ) : (
                <pre>{JSON.stringify(registrationAll, null, 2)}</pre>
            )} */}

      {registrationAll.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>SRN</th>
              <th>NAME</th>
              <th>FATHER</th>
              <th>DISTRICT</th>
              <th>Image</th>
              <th>Delte</th>
            </tr>
          </thead>
          <tbody>
            {registrationAll.map((eachStudent, index) => (
              <tr key={index}>
                <td>{eachStudent._id}</td>
                <td>{eachStudent.srn}</td>
                <td>{eachStudent.name}</td>
                <td>{eachStudent.father}</td>
                <td>{eachStudent.district}</td>
                <td>
                  <img
                    src={`http://localhost:8000/api/postimages/${eachStudent.image}`} // Correctly format the image URL
                    alt={eachStudent.name} // Use the student's name as alt text
                    style={{ width: 100, height: 100 }}
                  />
                </td>
                <td>
                    <button id={eachStudent._id} onClick={(e)=>deletePost(eachStudent._id,e)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No registrations found.</p>
      )}
    </div>
  );
}

export default RegistrationDashComponent;
