// import React, { useState, useContext, useEffect } from "react";
// import { Form, Container, Card, Button, Alert, Spinner } from "react-bootstrap";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import { getUserWithMobileAndPassword } from "../../services/UserServices/UserService";
// import { UserContext } from "../NewContextApis/UserContext";
// import { useNavigate } from "react-router-dom";

// export const UserLoginForFormVerification = () => {

// const navigate = useNavigate();

//   const { districtBlockSchoolData } = useDistrictBlockSchool();
//   const { userData, setUserData } = useContext(UserContext); // ✅ use context

//   console.log("📘 districtBlockSchoolData:", districtBlockSchoolData);

//   const [formData, setFormData] = useState({
//     mobile: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   // 🔍 Watch for userData context updates
//   useEffect(() => {
//     if (userData && Object.keys(userData).length > 0) {
//       console.log("✅ UserContext updated:", userData);
//     } else {
//       console.log("🧹 UserContext cleared or empty");
//     }
//   }, [userData]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setSuccessMsg("");
//     setLoading(true);

//     try {
//       console.log("📤 Sending login request:", formData);

//       const response = await getUserWithMobileAndPassword(formData);

//       console.log("✅ Login API Response:", response);

//       if (response?.ok) {
//         setSuccessMsg("Login successful!");
//         // ✅ Store user + access in context
//         const combinedUserData = {
//           user: response.user || {},
//           userAccess: response.userAccess || {},
//         };
//         setUserData(combinedUserData);



//         console.log("🧠 Context set with user:", combinedUserData);

//         navigate('/student-form-verification')
//       } else {
//         setErrorMsg(response?.message || "Login failed");
//       }
//     } catch (error) {
//       console.error("❌ Error during login:", error);
//       setErrorMsg(error?.response?.data?.message || "Login failed due to an error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateAccount = () =>{

//         navigate('/exam-user-signup')
//   }

//   return (
//     //  vh-100
//     <Container
//       fluid
//       className="d-flex justify-content-center align-items-center  bg-light"
//       style={{height:'65vh'}}
//     >

       
//       <Card className="p-4 shadow-lg" style={{ width: "350px", borderRadius: "16px"}}>
//         <Card.Body>
//           <h3 className="text-center mb-4">Verification Login</h3>
//           <hr></hr>

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3" controlId="formBasicMobile">
//               <Form.Label>Enter Your Id:</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter mobile number"
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 autoComplete="off"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formBasicPassword">
//               <Form.Label>Password:</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Enter password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 autoComplete="off"
//                 required
//               />
//             </Form.Group>

//             {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
//             {successMsg && <Alert variant="success">{successMsg}</Alert>}

//             <div className="d-grid">
//               <Button variant="primary" type="submit" disabled={loading}>
//                 {loading ? (
//                   <>
//                     <Spinner animation="border" size="sm" /> Logging in...
//                   </>
//                 ) : (
//                   "Login"
//                 )}
//               </Button>
           
//             </div>
//           </Form>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };




























import React, { useState, useContext, useEffect } from "react";
import { Form, Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
import { getUserWithMobileAndPassword } from "../../services/UserServices/UserService";
import { UserContext } from "../NewContextApis/UserContext";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../services/OtpService/SendOtpService";
import { changePasswordUsingMobile } from "../../services/UserServices/UserService";

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

  // New states for Forgot Password flow
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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
    // if forgotMode is active we shouldn't call login submit
    if (forgotMode) return;

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

        

        // if (userData?.user?.designation === "Admin"){

        //   navigate('/admin')
        // } else {

        
        // }

        
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
  };

  // ---------- Forgot password helpers ----------
  const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit

  const handleStartForgot = () => {
    // switch UI to forgot password mode and clear previous states
    setForgotMode(true);
    setErrorMsg("");
    setSuccessMsg("");
    setOtpSent(false);
    setGeneratedOtp("");
    setEnteredOtp("");
    setOtpVerified(false);
    setNewPassword("");
  };

  const handleCancelForgot = () => {
    // restore to normal login UI
    setForgotMode(false);
    setErrorMsg("");
    setSuccessMsg("");
    setOtpSent(false);
    setGeneratedOtp("");
    setEnteredOtp("");
    setOtpVerified(false);
    setNewPassword("");
  };

  const handleSendOtp = async () => {
    setErrorMsg("");
    if (!/^\d{10}$/.test(formData.mobile)) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsOtpSending(true);
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtpSent(true);

    const payload = {
      phone: `91${formData.mobile}`,
      otp,
    };

    try {
      const response = await sendOtp(payload);
      // try to be tolerant to how backend responds
      if (response && (response.status === 200 || response.status === "200" || response.ok)) {
        setErrorMsg("");
        alert("📱 OTP sent successfully.");
      } else {
        // fallback during development: show OTP in an alert so developer can test verify
        alert(`📱 OTP (test): ${otp}`);
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      // fallback to showing OTP for dev/testing
      alert(`📱 OTP (test): ${otp}`);
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyOtp = () => {
    setIsOtpVerifying(true);
    setErrorMsg("");
    // simple compare (since we generated OTP locally)
    if (enteredOtp === generatedOtp && generatedOtp !== "") {
      setOtpVerified(true);
      setErrorMsg("");
      alert("✅ OTP Verified!");
    } else {
      setOtpVerified(false);
      setErrorMsg("Invalid OTP. Please try again.");
    }
    setIsOtpVerifying(false);
  };

  const handleResendOtp = async () => {
    // allow resend: regenerate and resend
    setGeneratedOtp("");
    setEnteredOtp("");
    setOtpVerified(false);
    setOtpSent(false);
    await handleSendOtp();
  };

  const handleSetNewPassword = async () => {
    setIsUpdatingPassword(true);
    setErrorMsg("");
    // basic validation: require 4+ chars (adjust as needed)
    if (!newPassword || newPassword.length < 4) {
      setErrorMsg("Please enter a new password (at least 4 characters).");
      setIsUpdatingPassword(false);
      return;
    }

    // For now: call the service to update password by mobile
    const reqBody = {
      mobile: formData.mobile, // using mobile as identifier per your API
      password: newPassword,
    };

    try {
      const resp = await changePasswordUsingMobile(reqBody);
      // Expecting response like { message: "Password updated successfully", user: ... }
      if (resp && resp.message) {
        setSuccessMsg(resp.message);
        // reset forgot flow and show success message
        setForgotMode(false);
        setOtpSent(false);
        setGeneratedOtp("");
        setEnteredOtp("");
        setOtpVerified(false);
        setNewPassword("");
      } else {
        // handle unexpected response shape: show generic success or fallback
        setSuccessMsg("Password updated successfully.");
        setForgotMode(false);
        setOtpSent(false);
        setGeneratedOtp("");
        setEnteredOtp("");
        setOtpVerified(false);
        setNewPassword("");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setErrorMsg(err?.response?.data?.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // ---------------------------------------------------------------------

  return (
    //  vh-100
    <>
            <br></br>
        <Container
      fluid
      className="d-flex justify-content-center align-items-center  bg-light responsive-card"
      
    >

      <Card className="p-4 shadow-lg" style={{ width: "350px", borderRadius: "16px",}}>
        
        <Card.Body>
          <h3 className="text-center mb-4">Verification Login</h3>
          <hr></hr>

          <Form onSubmit={handleSubmit}>
            {/* When in forgotMode we hide the usual login fields and show the forgot flow inputs */}
            {!forgotMode && (
              <>
                <Form.Group className="mb-3" controlId="formBasicMobile">
                  <Form.Label>Enter Your Registered Mobile Number:</Form.Label>
                 
                  <br></br>
                   <br></br>
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
              </>
            )}

            {/* Forgot Password UI */}
            {forgotMode && (
              <>
                <Form.Group className="mb-3" controlId="forgotMobile">
                  <Form.Label>Enter Registered Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="10-digit mobile number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </Form.Group>

                {!otpSent && (
                  <div className="d-grid mb-2">
                    <Button
                      variant="outline-primary"
                      onClick={handleSendOtp}
                      disabled={isOtpSending || !/^\d{10}$/.test(formData.mobile)}
                    >
                      {isOtpSending ? <Spinner animation="border" size="sm" /> : "Get OTP"}
                    </Button>
                  </div>
                )}

                {otpSent && !otpVerified && (
                  <Form.Group className="mb-3" controlId="forgotOtp">
                    <Form.Label>Enter OTP</Form.Label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Form.Control
                        type="text"
                        placeholder="4-digit OTP"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                      />
                      <Button
                        variant="success"
                        onClick={handleVerifyOtp}
                        disabled={isOtpVerifying}
                      >
                        {isOtpVerifying ? <Spinner animation="border" size="sm" /> : "Verify"}
                      </Button>
                      <Button variant="link" onClick={handleResendOtp}>Resend</Button>
                    </div>
                  </Form.Group>
                )}

                {otpVerified && (
                  <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label>Create New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="d-grid mt-2">
                      <Button
                        variant="primary"
                        onClick={handleSetNewPassword}
                        disabled={isUpdatingPassword}
                      >
                        {isUpdatingPassword ? <Spinner animation="border" size="sm" /> : "Set New Password"}
                      </Button>
                    </div>
                  </Form.Group>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <Button variant="secondary" onClick={handleCancelForgot}>Back to Login</Button>
                </div>
              </>
            )}

            {!forgotMode && (
              <>
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
                  <br></br>
                  {/* <Button onClick={handleCreateAccount}>Create Account</Button> */}
                </div>

                <div style={{ marginTop: 10, textAlign: "center" }}>
                  <Button variant="link" onClick={handleStartForgot}>Forgot Password?</Button>
                </div>
              </>
            )}
          </Form>
        </Card.Body>
      </Card>

   <style>{`
    responsive-card {
      height: 100vh;
    }

    @media (max-width: 350px) {
      responsive-card {
        height: 120 !important;
      }
    }
  `}</style>
    </Container>
            <br></br>
    </>
  );
};
