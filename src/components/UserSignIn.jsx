// import React, { useState, useContext, useEffect } from "react";
// import UserService from "../services/UserService";
// import { Link, Navigate, useLocation } from "react-router-dom";

// import { UserContext } from "./ContextApi/UserContextAPI/UserContext";
// import { Button, Card, Container, Col, Nav, Row } from "react-bootstrap";

// import Navbar from "./Navbar";
// import Footer from "./Footer";

// export default function UserSignIn() {
//   const location = useLocation();

//   const { user } = useContext(UserContext);
//   const { setUser } = useContext(UserContext);
//   const [mobile, setMobile] = useState(null);
//   const [password, setPassword] = useState(null);
//   const [isUserMatched, setIsUserMatched] = useState(false);
//   const [errorRedirect, setErrorRedirect] = useState(false);

//   useEffect(() => {
//     // Check if we're landing on the /user-signin page
//     if (location.pathname === "/user-signin") {
//       setUser("");

//       console.log(
//         "UserContext api set to 0 so that user can't use forward navigation for loggin in"
//       );

//       // Perform the action you want when returning to /user-signin
//       // For example, you could reset a state, call an API, or redirect
//     }
//   }, [location.pathname]); // Triggers whenever the path changes

//   const handleSubmit = async function (e) {
//     e.preventDefault();

//     try {
//       const response = await UserService.GetUser(mobile);
//       // console.log(response.data.data.mobile)
//       // console.log(response.data.data.password)
//       const dbMobile = response.data.data.mobile;
//       const dbPassword = response.data.data.password;

//       if (dbMobile === mobile && dbPassword === password) {
//         setIsUserMatched(true);
//         const userData = response.data.data;
//         setUser(userData); // Update context state
//         localStorage.setItem("user", JSON.stringify(userData)); // Store user data in localStorage

//         alert("You are logged in");
//         // onMobileSubmit(mobile)
//         // onPasswordSubmit(password)
//       } else {
//         setIsUserMatched(false);
//         if (dbMobile === mobile) {
//           setErrorRedirect(true);
//         }
//       }
//     } catch (error) {
//       console.error(error);

//       setErrorRedirect(true);
//     }
//   };

//   //   state={{mobile:mobile}}

//   if (isUserMatched === true) {
//     return <Navigate to="/userprofile" />;
//   }

//   return (
//     <Container fluid>
//       <Row>
//         <Navbar />

//         <Nav defaultActiveKey="/userprofile" as="ul">
//           {/* <Nav.Item as="li">
//             <Nav.Link href="/">Go To Main Page</Nav.Link>
//           </Nav.Item> */}
//         </Nav>

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center", // Center vertically
//             justifyContent: "center", // Center horizontally
//             height: "65vh", // Full viewport height
//             textAlign: "center", // Center text
//           }}
//         >
//           <div>
//             <form
//               style={{
//                 display: "",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 textAlign: "center",
//                 width: "500px",
//                 height: "100%",
//                 border: "solid",
//                 borderRadius: "20px",
//               }}
//               onSubmit={handleSubmit}
//             >
//               <div>
//                 <h1>OFFICIALS LOGIN</h1>
//                 <hr />
//               </div>
//               <label>Enter Your Registered Mobile Number: </label>
//               <br />
//               <input
//                 type="text"
//                 name="mobile"
//                 placeholder="Enter Your Mobile"
//                 onChange={(e) => setMobile(e.target.value)}
//               />
//               <br />
//               <label>Enter Password: </label>
//               <br />
//               <input
//                 type="text"
//                 name="password"
//                 placeholder="Enter Your Mobile"
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <br />
//               <br />
//               <Button onClick={handleSubmit} style={{ width: 200 }}>
//                 Login
//               </Button>

//               {errorRedirect && (
//                 <div>
//                   <p>Your Id and Password is Wrong.</p>

//                   <p>
//                     {" "}
//                     SignUp first:{" "}
//                     <Link to="/user-signup">Go to signup Page</Link>
//                   </p>
//                 </div>
//               )}
//               <br />
//               <br />
//               <Link to={"/user-signup"}>
//                 <Button style={{ width: 200 }}>Create your account</Button>
//               </Link>
//               <br />
//               <br />
//             </form>
//           </div>
//         </div>
//       </Row>
//       <br></br>
//       <br></br>
//       <Footer />
//     </Container>
//   );
// }







import React, { useState, useContext, useEffect } from "react";
import UserService from "../services/UserService";
import { Link, Navigate, useLocation } from "react-router-dom";

import { UserContext } from "./ContextApi/UserContextAPI/UserContext";
import { Button, Container, Nav, Row, Form, Spinner, Alert } from "react-bootstrap";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function UserSignIn() {
  const location = useLocation();

  // destructure both user and setUser from context in one call
  const { user, setUser } = useContext(UserContext);

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isUserMatched, setIsUserMatched] = useState(false);
  const [errorRedirect, setErrorRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // show helpful message

  useEffect(() => {
    if (location.pathname === "/user-signin") {
      // clear user so forward navigation won't keep state
      setUser("");
      console.log(
        "UserContext api set to empty so that user can't use forward navigation for logging in"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleSubmit = async function (e) {
    e.preventDefault();
    setErrorRedirect(false);
    setMessage("");

    // basic client-side validation
    if (!mobile || !mobile.trim()) {
      setMessage("Please enter your registered mobile number.");
      return;
    }
    if (!password || !password.trim()) {
      setMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // call the service
      const response = await UserService.GetUser(mobile);

      // debug log: check what actually returned (helps to debug server vs local)
      // IMPORTANT: remove or lower logging in production if sensitive
      console.log("GetUser response:", response);

      // defensive access: response?.data?.data might be undefined
      const userData = response?.data?.data;

      if (!userData) {
        // server didn't return expected user object
        setMessage(
          `No user data returned from server. Server response: ${JSON.stringify(
            response?.data || response?.statusText || response
          )}`
        );
        setErrorRedirect(true);
        setLoading(false);
        return;
      }

      // Use optional chaining when reading fields
      const dbMobile = userData?.mobile;
      const dbPassword = userData?.password;

      // Compare strings — coerce to string to avoid undefined comparisons
      if (String(dbMobile) === String(mobile) && String(dbPassword) === String(password)) {
        setIsUserMatched(true);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setMessage("You are logged in");
      } else {
        setIsUserMatched(false);
        setErrorRedirect(true);
        setMessage("Mobile or password mismatch.");
      }
    } catch (error) {
      console.error("Error while fetching user:", error);

      // inspect axios error object
      if (error?.response) {
        // server responded with non-2xx
        console.error("Server response:", error.response.status, error.response.data);
        setMessage(
          `Server returned ${error.response.status}: ${JSON.stringify(error.response.data)}`
        );
      } else if (error?.request) {
        // request made but no response
        console.error("No response received:", error.request);
        setMessage("No response from backend. Check backend URL / CORS / server status.");
      } else {
        setMessage("Unexpected error: " + error.message);
      }

      setErrorRedirect(true);
    } finally {
      setLoading(false);
    }
  };

  if (isUserMatched === true) {
    return <Navigate to="/userprofile" />;
  }

  return (
    <Container fluid>
      <Row>
        <Navbar />

        <Nav defaultActiveKey="/userprofile" as="ul" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "65vh",
            textAlign: "center",
          }}
        >
          <div>
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                width: "500px",
                border: "solid 1px #ddd",
                borderRadius: "20px",
                padding: "20px",
              }}
              onSubmit={handleSubmit}
            >
              <div>
                <h1>OFFICIALS LOGIN</h1>
                <hr />
              </div>

              {message && (
                <Alert variant={errorRedirect ? "danger" : "success"} className="w-100">
                  {message}
                </Alert>
              )}

              <Form.Group className="w-100 mb-2">
                <Form.Label>Enter Your Registered Mobile Number:</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  placeholder="Enter Your Mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="w-100 mb-3">
                <Form.Label>Enter Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <div className="mb-3">
                <Button variant="primary" type="submit" style={{ width: 200 }} disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>

              {errorRedirect && (
                <div className="w-100">
                  <p>Your Id and Password is Wrong or user not found.</p>
                  <p>
                    SignUp first: <Link to="/user-signup">Go to signup Page</Link>
                  </p>
                </div>
              )}

              <div className="mt-2">
                <Link to={"/user-signup"}>
                  <Button style={{ width: 200 }}>Create your account</Button>
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </Row>
      <br />
      <br />
      <Footer />
    </Container>
  );
}
