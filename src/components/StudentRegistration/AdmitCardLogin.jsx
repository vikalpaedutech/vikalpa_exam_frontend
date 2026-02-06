
// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import { StudentContext } from "../NewContextApis/StudentContextApi";
// import { Form, Container, Card, Button, Alert, Spinner } from "react-bootstrap";
// import { getStudentBySrnNumberOrSlipId } from "../../services/StudentRegistrationServices/StudentRegistrationService";
// import { useNavigate, useLocation } from "react-router-dom";
// export const AdmitCardStudentSignin = () => {

//     const navigate = useNavigate();
//     const location = useLocation();

//     const { studentData, setStudentData } = useContext(StudentContext);

//     // Local state for the input and loading / error
//     const [srnOrSlip, setSrnOrSlip] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);



//     //Below useffect sets the studentData to empty object so that as soon as...
//     //...user comes on this page state gets empty
//     useEffect(() => {
//         setStudentData({})
//     }, [])


//     //-------------------------

//     // Log studentData whenever it changes (console log once it's set)
//     useEffect(() => {
//         if (studentData) {
//             console.log("✅ Student stored in context:", studentData);
//         }
//     }, [studentData]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);

//         // Basic guard
//         if (!srnOrSlip || srnOrSlip.trim() === "") {
//             setError("Please enter SRN number or Slip-Id.");
//             return;
//         }

//         setLoading(true);
//         try {
//             // Try as SRN first; backend supports either srn or slipId, adjust as needed
//             const rqBody = { srn: srnOrSlip.trim() };
//             const res = await getStudentBySrnNumberOrSlipId(rqBody);

//             if (res && res.ok && res.student) {
//                 // store returned object in StudentContext
//                 setStudentData(res.student);

//                 // console.log the response student immediately too
//                 console.log("✅ Student fetched from API:", res.student);

//                 //What to do if student logged in
//                 navigate('/mb-level1-admit-card')


//             }
//         } catch (err) {
//             console.error("Error fetching student:", err);

//             //If srn not matched with db then show empty form to fill

//             setError(err?.message || "An error occurred while logging in.");

//             if (location.pathname === "/exam-student-signin-mb" ||
//                 location.pathname === "/exam-student-signin-sh"
//             ) {
//                 navigate(`/exam-registration-form-${location.pathname.slice(-2)}`)
//             } else if (location.pathname === "/user-student-signin-mb" ||
//                 location.pathname === "/user-student-signin-sh"
//             ) {
//                 navigate(`/user-registration-form-${location.pathname.slice(-2)}`)
//             } 


//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
// <>


//         <Container
//             fluid
//             className="d-flex justify-content-center align-items-center bg-light"
         
//         >
//             <Card className="p-4 shadow-lg" style={{ width: "350px", borderRadius: "16px" }}>
//                 <Card.Header style={{ textAlign: 'center' }}>
//                     <span style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>  ENTER SRN
//                         (एसआरएन भरे)</span>
//                     <br></br>
//                     <hr></hr>
//                     <span style={{ fontSize: '80%', fontWeight:'bold' }}>(नोट: एसआरएन नंबर के बारे में जानकारी न होने पर विद्यालय में संपर्क करें।)</span>
//                 </Card.Header>
//                 <Card.Body>
//                     {/* <h3 className="text-center mb-4">Login</h3> */}

//                     <Form onSubmit={handleSubmit}>
//                         {error && <Alert variant="danger">{error}</Alert>}

//                         <Form.Group className="mb-3" controlId="formBasicMobile">
//                             <Form.Control
//                                 type="text"
//                                 placeholder="SRN Number"
//                                 value={srnOrSlip}
//                                 onChange={(e) => {
//                                     const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//                                     setSrnOrSlip(value);
//                                 }}
//                                 required
//                             />
//                         </Form.Group>

//                         <div className="d-grid">
//                             <Button variant="primary" type="submit" disabled={loading || srnOrSlip.length !== 10}>
//                                 {loading ? (
//                                     <>
//                                         <Spinner
//                                             as="span"
//                                             animation="border"
//                                             size="sm"
//                                             role="status"
//                                             aria-hidden="true"
//                                             className="me-2"
//                                         />
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     "Submit"
//                                 )}
//                             </Button>
//                         </div>
//                     </Form>
//                 </Card.Body>
//             </Card>
//         </Container>

// <br></br>
// </>
//     );
// };







// import React, { useState, useEffect, useContext } from "react";
// import { StudentContext } from "../NewContextApis/StudentContextApi";
// import {
//   Form,
//   Container,
//   Card,
//   Button,
//   Alert,
//   Spinner,
//   Modal
// } from "react-bootstrap";
// import { getStudentBySrnNumberOrSlipId } from "../../services/StudentRegistrationServices/StudentRegistrationService";
// import { useNavigate } from "react-router-dom";

// export const AdmitCardStudentSignin = () => {
//   const navigate = useNavigate();
//   const { studentData, setStudentData } = useContext(StudentContext);

//   const [srnOrSlip, setSrnOrSlip] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // modal state
//   const [showModal, setShowModal] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalMessage, setModalMessage] = useState("");

//   useEffect(() => {
//     setStudentData({});
//   }, []);

//   const openModal = (title, message) => {
//     setModalTitle(title);
//     setModalMessage(message);
//     setShowModal(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!srnOrSlip || srnOrSlip.trim() === "") {
//       setError("Please enter SRN number.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const rqBody = { srn: srnOrSlip.trim() };
//       const res = await getStudentBySrnNumberOrSlipId(rqBody);

//       if (res?.ok && res?.student) {
//         const student = res.student;
//         setStudentData(student);

//         console.log(student.L1ExaminationCenter)
//         // 🔴 L1ExaminationCenter NOT ASSIGNED
//         if (student?.L1ExaminationCenter === null || student?.L1ExaminationCenter === undefined ||
//             student?.L1ExaminationCenter === ""
//          ) {

          
//           if (student?.classOfStudent === "8") {

            
//             openModal(
//              "Admit Card Status",
//           `Dear Students! Your admit card for the Level 1 Examination will be available for download within the next 24 hours.
// (प्रिय विद्यार्थी, स्तर 1 परीक्षा के लिए आपका प्रवेश पत्र अगले 24 घंटों के भीतर डाउनलोड के लिए उपलब्ध होगा।)`
//             );
//             return;
//           }

//           if (student?.classOfStudent === "10") {
//             openModal(
//               "Admit Card Coming Soon",
//               `Haryana Super 100 admit card will be live soon.
// (हरियाणा सुपर 100 का प्रवेश पत्र जल्द ही जारी किया जाएगा।)`
//             );
//             return;
//           }
//         } else {
//               // ✅ All good → navigate
//         navigate("/mb-level1-admit-card");
//         }

      
//       } else {
//         // SRN not found
//         openModal(
//           "Admit Card Status",
//           `Your Admit Card will be available in three days.
// (आपका प्रवेश पत्र तीन दिनों में उपलब्ध होगा।)`
//         );
//       }
//     } catch (err) {
//       openModal(
//         "Admit Card Status",
//         `Your admit card cannot be downloaded because you have not registered for the Mission Buinyaad Level 1 Examination.
// (आपका प्रवेश पत्र डाउनलोड नहीं किया जा सकता क्योंकि आपने मिशन बुनियाद स्तर 1 परीक्षा के लिए पंजीकरण नहीं किया है।)`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Container
//         fluid
//         className="d-flex justify-content-center align-items-center bg-light"
//       >
//         <Card className="p-4 shadow-lg" style={{ width: "350px", borderRadius: "16px" }}>
//           <Card.Header className="text-center">
//             <strong style={{ fontSize: "20px" }}>
//               ENTER SRN (एसआरएन भरे)
//             </strong>
//             <hr />
//             <small style={{ fontWeight: "bold" }}>
//               (नोट: एसआरएन नंबर के बारे में जानकारी न होने पर विद्यालय में संपर्क करें।)
//             </small>
//           </Card.Header>

//           <Card.Body>
//             <Form onSubmit={handleSubmit}>
//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form.Group className="mb-3">
//                 <Form.Control
//                   type="text"
//                   placeholder="SRN Number"
//                   value={srnOrSlip}
//                   onChange={(e) =>
//                     setSrnOrSlip(e.target.value.replace(/\D/g, "").slice(0, 10))
//                   }
//                   required
//                 />
//               </Form.Group>

//               <div className="d-grid">
//                 <Button
//                   type="submit"
//                   disabled={loading || srnOrSlip.length !== 10}
//                 >
//                   {loading ? (
//                     <>
//                       <Spinner size="sm" animation="border" /> Processing...
//                     </>
//                   ) : (
//                     "Submit"
//                   )}
//                 </Button>
//               </div>
//             </Form>
//           </Card.Body>
//         </Card>
//       </Container>

//       {/* ✅ MODAL */}
//       <Modal show={showModal} centered onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{modalTitle}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ whiteSpace: "pre-line", fontSize: "15px" }}>
//           {modalMessage}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={() => setShowModal(false)}>
//             OK
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };












import React, { useState, useEffect, useContext } from "react";
import { StudentContext } from "../NewContextApis/StudentContextApi";
import {
  Form,
  Container,
  Card,
  Button,
  Alert,
  Spinner,
  Modal
} from "react-bootstrap";
import { getStudentBySrnNumberOrSlipId } from "../../services/StudentRegistrationServices/StudentRegistrationService";
import { useNavigate } from "react-router-dom";

export const AdmitCardStudentSignin = () => {
  const navigate = useNavigate();
  const { studentData, setStudentData } = useContext(StudentContext);

  const [srnOrSlip, setSrnOrSlip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    setStudentData({});
  }, []);

  const openModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!srnOrSlip || srnOrSlip.trim() === "") {
      setError("Please enter SRN number.");
      return;
    }

    setLoading(true);
    try {
      const rqBody = { srn: srnOrSlip.trim() };
      const res = await getStudentBySrnNumberOrSlipId(rqBody);

      if (res?.ok && res?.student) {
        const student = res.student;
        setStudentData(student);

        console.log(student.L1ExaminationCenter)
        // 🔴 L1ExaminationCenter NOT ASSIGNED
        if (student?.L1ExaminationCenter === null || student?.L1ExaminationCenter === undefined ||
            student?.L1ExaminationCenter === ""
         ) {

          
          if (student?.classOfStudent === "8") {

            
            openModal(
             "Admit Card Status",
          `Dear Students! Your admit card for the Level 1 Examination will be available for download within the next 24 hours.
(प्रिय विद्यार्थी, स्तर 1 परीक्षा के लिए आपका प्रवेश पत्र अगले 24 घंटों के भीतर डाउनलोड के लिए उपलब्ध होगा।)`
            );
            return;
          }

          if (student?.classOfStudent === "10") {
            openModal(
              "Admit Card Coming Soon",
              `Haryana Super 100 admit card will be live soon.
(हरियाणा सुपर 100 का प्रवेश पत्र जल्द ही जारी किया जाएगा।)`
            );
            return;
          }
        } else {
              // ✅ All good → navigate

              if(student?.classOfStudent === "10"){
                 navigate("/s100-level1-admit-card");
              } else{
                navigate("/mb-level1-admit-card");
              }
       
        }

      
      } else {
        // SRN not found
        openModal(
          "Admit Card Status",
          `Your Admit Card will be available in three days.
(आपका प्रवेश पत्र तीन दिनों में उपलब्ध होगा।)`
        );
      }
    } catch (err) {
      openModal(
        "Admit Card Status",
        `Your admit card cannot be downloaded because you have not registered for the Mission Buinyaad Level 1 Examination.
(आपका प्रवेश पत्र डाउनलोड नहीं किया जा सकता क्योंकि आपने मिशन बुनियाद स्तर 1 परीक्षा के लिए पंजीकरण नहीं किया है।)`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
   <br></br>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center bg-light"
      >
        <Card className="p-4 shadow-lg" style={{ width: "350px", borderRadius: "16px" }}>
          <Card.Header className="text-center">
            <strong style={{ fontSize: "20px" }}>
              ENTER SRN/Slip ID (एसआरएन/स्लिप आईडी भरे)
            </strong>
            <hr />
            <small style={{ fontWeight: "bold" }}>
              (नोट: एसआरएन नंबर के बारे में जानकारी न होने पर विद्यालय में संपर्क करें।)
            </small>
          </Card.Header>

          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="SRN Number"
                  value={srnOrSlip}
                  onChange={(e) =>
                    setSrnOrSlip(
                      e.target.value
                        .replace(/[^a-zA-Z0-9]/g, "")
                        .slice(0, 10)
                    )
                  }
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button
                  type="submit"
                  disabled={loading || srnOrSlip.length <= 7 }
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" animation="border" /> Processing...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* ✅ MODAL */}
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: "pre-line", fontSize: "15px" }}>
          {modalMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <br></br>
    </>
  );
};
