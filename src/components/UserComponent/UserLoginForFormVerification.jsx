import React, { useState, useContext, useEffect } from "react";
import { Form, Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
import { getUserWithMobileAndPassword } from "../../services/UserServices/UserService";
import { UserContext } from "../NewContextApis/UserContext";
import { useNavigate } from "react-router-dom";

export const UserLoginForFormVerification = () => {

const navigate = useNavigate();

  const { districtBlockSchoolData } = useDistrictBlockSchool();
  const { userData, setUserData } = useContext(UserContext); // ✅ use context

  console.log("📘 districtBlockSchoolData:", districtBlockSchoolData);

  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 🔍 Watch for userData context updates
  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      console.log("✅ UserContext updated:", userData);
    } else {
      console.log("🧹 UserContext cleared or empty");
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      console.log("📤 Sending login request:", formData);

      const response = await getUserWithMobileAndPassword(formData);

      console.log("✅ Login API Response:", response);

      if (response?.ok) {
        setSuccessMsg("Login successful!");
        // ✅ Store user + access in context
        const combinedUserData = {
          user: response.user || {},
          userAccess: response.userAccess || {},
        };
        setUserData(combinedUserData);



        console.log("🧠 Context set with user:", combinedUserData);

        navigate('/student-form-verification')
      } else {
        setErrorMsg(response?.message || "Login failed");
      }
    } catch (error) {
      console.error("❌ Error during login:", error);
      setErrorMsg(error?.response?.data?.message || "Login failed due to an error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () =>{

        navigate('/exam-user-signup')
  }

  return (
    //  vh-100
    <Container
      fluid
      className="d-flex justify-content-center align-items-center  bg-light"
      style={{height:'65vh'}}
    >

       
      <Card className="p-4 shadow-lg" style={{ width: "350px", borderRadius: "16px"}}>
        <Card.Body>
          <h3 className="text-center mb-4">Verification Login</h3>
          <hr></hr>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicMobile">
              <Form.Label>Enter Your Id:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mobile number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
           
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
