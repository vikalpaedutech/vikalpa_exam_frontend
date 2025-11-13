// import React, { useState, useMemo } from "react";
// import {
//   Form,
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Spinner,
//   Alert,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select";
// import { createOrUpdateUser } from "../../services/UserServices/UserService";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import { useNavigate } from "react-router-dom";
// import { MainNavBar } from "../NavbarsAndFooters/MainNavBar";
// import { sendOtp } from "../../services/OtpService/SendOtpService";
// export const UserSignup = () => {
//   const { districtBlockSchoolData, loadingDBS } =
//     useDistrictBlockSchool() || {};
//   const dbsData = Array.isArray(districtBlockSchoolData)
//     ? districtBlockSchoolData
//     : [];

//   const navigate = useNavigate();

//   const [userName, setUserName] = useState("");
//   const [designation, setDesignation] = useState(null);
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [generatedOtp, setGeneratedOtp] = useState("");
//   const [enteredOtp, setEnteredOtp] = useState("");

//   const [selectedDistricts, setSelectedDistricts] = useState([]);
//   const [selectedBlocks, setSelectedBlocks] = useState([]);
//   const [selectedSchools, setSelectedSchools] = useState([]);

//   // NEW: manual school entry states (for Teacher/Principal/School Staff)
//   const [manualSchoolChecked, setManualSchoolChecked] = useState(false);
//   const [manualSchoolName, setManualSchoolName] = useState("");
//   const [manualSchoolCode, setManualSchoolCode] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState(null);
//   const [error, setError] = useState(null);

//   const [showModal, setShowModal] = useState(false); // ✅ new modal state

//   const designationOptions = [
//     { value: "ACI", label: "ACI" },
//     { value: "Center Coordinator", label: "Center Coordinator" },
//     { value: "HKRN", label: "HKRN" },
//     { value: "ABRC", label: "ABRC" },
//     { value: "Principal", label: "Principal" },
//     { value: "Teacher", label: "Teacher" },
//     { value: "School Staff", label: "School Staff" },
//     { value: "Vikalpa Staff", label: "Vikalpa Staff" },
//   ];

//   // ✅ District options
//   const districtOptions = useMemo(() => {
//     const map = new Map();
//     (dbsData || []).forEach((r) => {
//       if (!r) return;
//       const id = String(r.districtId);
//       const name = r.districtName || id;
//       if (!map.has(id)) map.set(id, { value: id, label: `${name} (${id})` });
//     });
//     return Array.from(map.values());
//   }, [dbsData]);

//   // ✅ Block options
//   const blockOptions = useMemo(() => {
//     const blocksMap = new Map();
//     const selectedDistrictIds = new Set(selectedDistricts.map((d) => d.value));
//     (dbsData || []).forEach((r) => {
//       if (
//         !r ||
//         (selectedDistrictIds.size &&
//           !selectedDistrictIds.has(String(r.districtId)))
//       )
//         return;
//       const id = String(r.blockId);
//       const name = r.blockName || id;
//       if (!blocksMap.has(id))
//         blocksMap.set(id, { value: id, label: `${name} (${id})` });
//     });
//     return Array.from(blocksMap.values());
//   }, [dbsData, selectedDistricts]);

//   // ✅ School options
//   const schoolOptions = useMemo(() => {
//     const map = new Map();
//     const selectedBlockIds = new Set(selectedBlocks.map((b) => b.value));
//     (dbsData || []).forEach((r) => {
//       if (
//         !r ||
//         (selectedBlockIds.size &&
//           !selectedBlockIds.has(String(r.blockId)))
//       )
//         return;
//       const id = String(r.centerId);
//       const name = r.centerName || id;
//       if (!map.has(id))
//         map.set(id, { value: id, label: `${name} (${id})` });
//     });
//     return Array.from(map.values());
//   }, [dbsData, selectedBlocks]);

//   // ---------- UPDATED buildAccessPayload: matches backend schema ----------
//   // backend expects:
//   // region: [
//   //   {
//   //     districtId: String,
//   //     blockIds: [
//   //       { blockId: String, schoolIds: [ { schoolId: String } ] }
//   //     ]
//   //   }
//   // ]
//   const buildAccessPayload = () => {
//     const regions = [];
//     const allData = Array.isArray(dbsData) ? dbsData : [];

//     // For each selected district build its blockIds array (only blocks selected that belong to district)
//     selectedDistricts.forEach((d) => {
//       const districtId = String(d.value);
//       const validBlockIdsForDistrict = new Set(
//         allData
//           .filter((r) => String(r.districtId) === districtId)
//           .map((r) => String(r.blockId))
//       );

//       // filter selectedBlocks to those that belong to this district
//       const blocksForThisDistrict = selectedBlocks.filter((b) =>
//         validBlockIdsForDistrict.has(String(b.value))
//       );

//       const blockIds = blocksForThisDistrict.map((b) => {
//         // schoolIds must be array of objects { schoolId: String }
//         const schoolIdsArr = [];

//         // include selectedSchools which belong to this block
//         // We try to filter selectedSchools by matching dbsData center->block relationship.
//         // Build set of centerIds that belong to this block:
//         const centersForBlock = new Set(
//           allData
//             .filter((r) => String(r.blockId) === String(b.value))
//             .map((r) => String(r.centerId))
//         );

//         // Add dropdown-selected schools that belong to this block
//         selectedSchools.forEach((s) => {
//           const centerId = String(s?.value ?? s);
//           if (centersForBlock.has(centerId)) {
//             schoolIdsArr.push({ schoolId: centerId });
//           }
//         });

//         // If manual entry present, add it as a single string wrapped in object
//         if (manualSchoolChecked && manualSchoolName && manualSchoolCode) {
//           const combined = `${String(manualSchoolName).trim()}-${String(
//             manualSchoolCode
//           ).trim()}`;
//           schoolIdsArr.push({ schoolId: combined });
//         }

//         return {
//           blockId: String(b.value),
//           schoolIds: schoolIdsArr,
//         };
//       });

//       // Only push district if it has blockIds (optional: you can push even empty if needed)
//       if (blockIds.length > 0) {
//         regions.push({ districtId, blockIds });
//       } else {
//         // If user selected district but didn't select blocks for it, push empty blockIds array
//         regions.push({ districtId, blockIds: [] });
//       }
//     });

//     return { region: regions };
//   };

//   // Dummy OTP send
//   const handleSendOtp = () => {
//     if (!/^\d{10}$/.test(mobile)) {
//       setError("Please enter a valid 10-digit mobile number.");
//       return;
//     }
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     setGeneratedOtp(otp);
//     setOtpSent(true);
//     alert(`📱 Your OTP is ${otp}`); // Dummy alert (simulate SMS)
//   };

//   // Dummy OTP verify
//   const handleVerifyOtp = () => {
//     if (enteredOtp === generatedOtp) {
//       setOtpVerified(true);
//       setError(null);
//       alert("✅ OTP Verified!");
//     } else {
//       setError("Invalid OTP. Please try again.");
//     }
//   };

//   // Submit after OTP verified
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate manual school fields when manual is checked AND role needs schools
//     const desigValLocal = designation?.value ?? "";
//     const showAllThreeLocal =
//       desigValLocal === "Teacher" ||
//       desigValLocal === "Principal" ||
//       desigValLocal === "School Staff";

//     if (showAllThreeLocal && manualSchoolChecked) {
//       if (
//         !manualSchoolName ||
//         !manualSchoolName.trim() ||
//         !manualSchoolCode ||
//         !manualSchoolCode.trim()
//       ) {
//         setError("Please fill both manual school name and code.");
//         return;
//       }
//     }

//     if (!otpVerified) {
//       setError("Please verify your mobile number first.");
//       return;
//     }
//     if (!/^\d{4}$/.test(password)) {
//       setError("Password must be a 4-digit number.");
//       return;
//     }

//     const payloadUser = {
//       userName,
//       designation: designation?.value,
//       mobile,
//       password,
//     };

//     const userAccess = buildAccessPayload();

//     // debug log (optional)
//     console.log("Payload userAccess:", JSON.stringify(userAccess, null, 2));

//     setLoading(true);
//     try {
//       await createOrUpdateUser({ user: payloadUser, userAccess });
//       setMsg(" Account created successfully!");
//       setShowModal(true); // ✅ show modal here
//       setUserName("");
//       setDesignation(null);
//       setMobile("");
//       setPassword("");
//       setSelectedDistricts([]);
//       setSelectedBlocks([]);
//       setSelectedSchools([]);
//       setManualSchoolChecked(false);
//       setManualSchoolName("");
//       setManualSchoolCode("");
//       setOtpSent(false);
//       setOtpVerified(false);
//       setEnteredOtp("");
//       setGeneratedOtp("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to register user.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     navigate("/exam-user-signin");
//   };

//   // Determine what to show based on designation.value
//   const desigVal = designation?.value ?? "";
//   const showAllThree =
//     desigVal === "Teacher" ||
//     desigVal === "Principal" ||
//     desigVal === "School Staff";
//   const showDistrictBlock =
//     desigVal === "Center Coordinator" || desigVal === "HKRN" || desigVal === "ABRC";
//   const showDistrictOnly = desigVal === "ACI";

//   // only ACI should be allowed multi-district and multi at other levels
//   const isFullMulti = designation?.value === "ACI";

//   return (
//     <div>
//       <Container
//         fluid
//         className="d-flex justify-content-center align-items-center bg-light responsive-container"
//         style={{ height: "100vh" }}
//       >
//         <Card
//           className="p-4 shadow-lg"
//           style={{ width: "720px", borderRadius: "12px" }}
//         >
//           <Card.Header
//             style={{
//               fontSize: "30px",
//               textAlign: "center",
//               fontWeight: "bold",
//               background: "#C2E6F5",
//             }}
//           >
//             OFFICIALS SIGN-UP (अधिकारिक पंजीकरण) <br></br>
//             <small style={{ fontSize: "12px" }}>
//               Only for Govt. officials, ABRC/BRP/Teachers/School Staff/Vikalpa Staff.
//               <span style={{ display: "block" }}>
//                 (केवल सरकारी अधिकारी, ABRC/BRP/शिक्षक/स्कूल स्टाफ/Vikalpa स्टाफ के
//                 लिए)
//               </span>
//             </small>
//           </Card.Header>

//           <Card.Body>
//             {error && (
//               <Alert variant="danger" onClose={() => setError(null)} dismissible>
//                 {error}
//               </Alert>
//             )}
//             {msg && (
//               <Alert variant="success" onClose={() => setMsg(null)} dismissible>
//                 {msg}
//               </Alert>
//             )}

//             <Form onSubmit={handleSubmit}>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-2" controlId="userName">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control
//                       value={userName}
//                       onChange={(e) => setUserName(e.target.value)}
//                       placeholder="Enter full name"
//                     />
//                   </Form.Group>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group className="mb-2" controlId="designation">
//                     <Form.Label>Designation</Form.Label>
//                     <Select
//                       value={designation}
//                       onChange={(val) => {
//                         setDesignation(val);
//                         // reset manual/school selection when designation changes
//                         setManualSchoolChecked(false);
//                         setManualSchoolName("");
//                         setManualSchoolCode("");
//                         setSelectedDistricts([]);
//                         setSelectedBlocks([]);
//                         setSelectedSchools([]);
//                       }}
//                       options={designationOptions}
//                       placeholder="Select designation"
//                       isClearable
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <hr />

//               {/* Conditionally render district/block/school selects based on designation */}
//               {(showAllThree || showDistrictBlock || showDistrictOnly) && (
//                 <Row className="align-items-start">
//                   {/* STACKED: District */}
//                   <Col md={12}>
//                     <Form.Group className="mb-2" controlId="districtSelect">
//                       <Form.Label>District</Form.Label>
//                       <Select
//                         // only ACI gets multi-select, others get single-select
//                         isMulti={isFullMulti}
//                         options={districtOptions}
//                         value={isFullMulti ? selectedDistricts : (selectedDistricts[0] ?? null)}
//                         onChange={(v) => {
//                           // keep selectedDistricts stored as an array in state
//                           if (isFullMulti) {
//                             setSelectedDistricts(v || []);
//                           } else {
//                             // v will be single object or null
//                             setSelectedDistricts(v ? [v] : []);
//                           }
//                           setSelectedBlocks([]); // reset dependent selects when district changes
//                           setSelectedSchools([]);
//                         }}
//                         placeholder={loadingDBS ? "Loading..." : (isFullMulti ? "Select district(s)" : "Select district")}
//                         isClearable
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* STACKED: Block (when applicable) */}
//                   {(showDistrictBlock || showAllThree) && (
//                     <Col md={12}>
//                       <Form.Group className="mb-2" controlId="blockSelect">
//                         <Form.Label>BlocK</Form.Label>
//                         <Select
//                           // only ACI gets multi-select blocks; others single
//                           isMulti={isFullMulti}
//                           options={blockOptions}
//                           value={isFullMulti ? selectedBlocks : (selectedBlocks[0] ?? null)}
//                           onChange={(v) => {
//                             if (isFullMulti) {
//                               setSelectedBlocks(v || []);
//                             } else {
//                               setSelectedBlocks(v ? [v] : []);
//                             }
//                             setSelectedSchools([]);
//                           }}
//                           placeholder="Select block(s)"
//                         />
//                       </Form.Group>
//                     </Col>
//                   )}

//                   {/* STACKED: School (when applicable) */}
//                   {showAllThree && (
//                     <Col md={12}>
//                       <Form.Group className="mb-2" controlId="schoolSelect">
//                         <Form.Label>School</Form.Label>

//                         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                           <Form.Check
//                             type="checkbox"
//                             id="manualSchoolCheckbox"
//                             checked={manualSchoolChecked}
//                             onChange={(e) => {
//                               const checked = e.target.checked;
//                               setManualSchoolChecked(checked);
//                               if (checked) {
//                                 setSelectedSchools([]); // clear selection when manual entry chosen
//                               } else {
//                                 setManualSchoolName("");
//                                 setManualSchoolCode("");
//                               }
//                             }}
//                             aria-label="Toggle manual school entry"
//                             title="Check to enter school manually"
//                           />
//                           <small style={{ color: "#6c757d" }}>Manual</small>
//                         </div>

//                         {/* If manual checkbox not checked, show the multi-select */}
//                         {!manualSchoolChecked ? (
//                           <>
//                             <div style={{ marginTop: 8 }}>
//                               <Select
//                                 // only ACI gets multi-select schools; others single
//                                 isMulti={isFullMulti}
//                                 options={schoolOptions}
//                                 value={isFullMulti ? selectedSchools : (selectedSchools[0] ?? null)}
//                                 onChange={(v) => {
//                                   if (isFullMulti) {
//                                     setSelectedSchools(v || []);
//                                   } else {
//                                     setSelectedSchools(v ? [v] : []);
//                                   }
//                                 }}
//                                 placeholder="Select school(s)"
//                               />
//                             </div>
//                             <Form.Text className="text-muted d-block mt-1">
//                               यदि आपका विद्यालय ऊपर दी गई सूची में नहीं है, तो "Manual" चेकबॉक्स पर टिक करें और अपना विद्यालय नाम एवं कोड दर्ज करें।
//                             </Form.Text>
//                           </>
//                         ) : (
//                           /* When manual checked, show compact inline inputs */
//                           <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
//                             <Form.Control
//                               value={manualSchoolName}
//                               onChange={(e) => setManualSchoolName(e.target.value)}
//                               placeholder="School name"
//                             />
//                             <Form.Control
//                               value={manualSchoolCode}
//                               onChange={(e) => setManualSchoolCode(e.target.value)}
//                               placeholder="Code"
//                               style={{ maxWidth: 140 }}
//                             />
//                           </div>
//                         )}

//                         {/* {manualSchoolChecked && (
//                           <Form.Text className="text-muted d-block mt-1">
//                             Manual entry will be sent as <strong>schoolName-schoolCode</strong>.
//                           </Form.Text>
//                         )} */}
//                       </Form.Group>
//                     </Col>
//                   )}
//                 </Row>
//               )}

//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-2" controlId="mobile">
//                     <Form.Label>Mobile</Form.Label>
//                     <div className="d-flex">
//                       <Form.Control
//                         value={mobile}
//                         onChange={(e) => setMobile(e.target.value)}
//                         placeholder="10-digit mobile number"
//                         disabled={otpVerified}
//                       />
//                       {!otpSent && (
//                         <Button
//                           className="ms-2"
//                           variant="outline-primary"
//                           onClick={handleSendOtp}
//                         >
//                           Get OTP
//                         </Button>
//                       )}
//                     </div>
//                   </Form.Group>
//                 </Col>

//                 {otpSent && !otpVerified && (
//                   <Col md={6}>
//                     <Form.Group className="mb-2" controlId="otp">
//                       <Form.Label>Enter OTP</Form.Label>
//                       <div className="d-flex">
//                         <Form.Control
//                           value={enteredOtp}
//                           onChange={(e) => setEnteredOtp(e.target.value)}
//                           placeholder="4-digit OTP"
//                         />
//                         <Button
//                           className="ms-2"
//                           variant="success"
//                           onClick={handleVerifyOtp}
//                         >
//                           Verify
//                         </Button>
//                       </div>
//                     </Form.Group>
//                   </Col>
//                 )}
//               </Row>

//               {otpVerified && (
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-2" controlId="password">
//                       <Form.Label>Set 4-digit Password</Form.Label>
//                       <Form.Control
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Enter 4-digit numeric password"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               )}

//               <div className="d-flex justify-content-end mt-3" style={{gap:'3px'}} >
//                 <Button variant="primary" type="submit" disabled={loading || !otpVerified}>
//                   {loading ? (
//                     <>
//                       <Spinner animation="border" size="sm" /> Registering...
//                     </>
//                   ) : (
//                     "Register User"
//                   )}
//                 </Button>

//                       <Button variant="primary" type="submit" 
//                       onClick={()=>{
//                         navigate('/exam-user-signin')
//                       }}>
//                     Login if already have an account
//                 </Button>
//               </div>
              
//             </Form>
//           </Card.Body>
//         </Card>

//         {/* ✅ Success Modal */}
//         <Modal show={showModal} onHide={handleCloseModal} centered>
//           <Modal.Header closeButton>
//             <Modal.Title>Congratulations!</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="text-center">
//             <h5>Your account has been successfully created! <br></br>
//             आपका अकाउंट सफलतापूर्वक बन गया है। Login बटन पर क्लिक करके लॉगिन करें।</h5>
//           </Modal.Body>
//           <Modal.Footer className="d-flex justify-content-center">
//             <Button variant="primary" onClick={handleCloseModal}>
//               Go to Login
//             </Button>
//           </Modal.Footer>
//         </Modal>

//         <style>
//           {`
//       @media (max-width: 800px) {
//         .responsive-container {
//           height: 165vh !important;
//         }
//         /* make manual inputs stack nicely on small screens */
//         .responsive-container .form-control {
//           min-width: 0;
//         }
//         .responsive-container .d-flex[style] {
//           flex-direction: column;
//           gap: 8px;
//         }
//       }
//     `}
//         </style>
//       </Container>
//     </div>
//   );
// };













// import React, { useState, useMemo } from "react";
// import {
//   Form,
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Spinner,
//   Alert,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select";
// import { createOrUpdateUser } from "../../services/UserServices/UserService";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import { useNavigate } from "react-router-dom";
// import { MainNavBar } from "../NavbarsAndFooters/MainNavBar";
// import { sendOtp } from "../../services/OtpService/SendOtpService";
// export const UserSignup = () => {
//   const { districtBlockSchoolData, loadingDBS } =
//     useDistrictBlockSchool() || {};
//   const dbsData = Array.isArray(districtBlockSchoolData)
//     ? districtBlockSchoolData
//     : [];

//   const navigate = useNavigate();

//   const [userName, setUserName] = useState("");
//   const [designation, setDesignation] = useState(null);
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [generatedOtp, setGeneratedOtp] = useState("");
//   const [enteredOtp, setEnteredOtp] = useState("");

//   const [selectedDistricts, setSelectedDistricts] = useState([]);
//   const [selectedBlocks, setSelectedBlocks] = useState([]);
//   const [selectedSchools, setSelectedSchools] = useState([]);

//   // NEW: manual school entry states (for Teacher/Principal/School Staff)
//   const [manualSchoolChecked, setManualSchoolChecked] = useState(false);
//   const [manualSchoolName, setManualSchoolName] = useState("");
//   const [manualSchoolCode, setManualSchoolCode] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState(null);
//   const [error, setError] = useState(null);

//   const [showModal, setShowModal] = useState(false); // ✅ new modal state

//   const designationOptions = [
//     { value: "ACI", label: "ACI" },
//     { value: "Center Coordinator", label: "Center Coordinator" },
//     { value: "HKRN", label: "HKRN" },
//     { value: "ABRC", label: "ABRC" },
//     { value: "Principal", label: "Principal" },
//     { value: "Teacher", label: "Teacher" },
//     { value: "School Staff", label: "School Staff" },
//     { value: "Vikalpa Staff", label: "Vikalpa Staff" },
//   ];

//   // ✅ District options
//   const districtOptions = useMemo(() => {
//     const map = new Map();
//     (dbsData || []).forEach((r) => {
//       if (!r) return;
//       const id = String(r.districtId);
//       const name = r.districtName || id;
//       if (!map.has(id)) map.set(id, { value: id, label: `${name} (${id})` });
//     });
//     return Array.from(map.values());
//   }, [dbsData]);

//   // ✅ Block options
//   const blockOptions = useMemo(() => {
//     const blocksMap = new Map();
//     const selectedDistrictIds = new Set(selectedDistricts.map((d) => d.value));
//     (dbsData || []).forEach((r) => {
//       if (
//         !r ||
//         (selectedDistrictIds.size &&
//           !selectedDistrictIds.has(String(r.districtId)))
//       )
//         return;
//       const id = String(r.blockId);
//       const name = r.blockName || id;
//       if (!blocksMap.has(id))
//         blocksMap.set(id, { value: id, label: `${name} (${id})` });
//     });
//     return Array.from(blocksMap.values());
//   }, [dbsData, selectedDistricts]);

//   // ✅ School options
//   const schoolOptions = useMemo(() => {
//     const map = new Map();
//     const selectedBlockIds = new Set(selectedBlocks.map((b) => b.value));
//     (dbsData || []).forEach((r) => {
//       if (
//         !r ||
//         (selectedBlockIds.size &&
//           !selectedBlockIds.has(String(r.blockId)))
//       )
//         return;
//       const id = String(r.centerId);
//       const name = r.centerName || id;
//       if (!map.has(id))
//         map.set(id, { value: id, label: `${name} (${id})` });
//     });
//     return Array.from(map.values());
//   }, [dbsData, selectedBlocks]);

//   // ---------- UPDATED buildAccessPayload: matches backend schema ----------
//   // backend expects:
//   // region: [
//   //   {
//   //     districtId: String,
//   //     blockIds: [
//   //       { blockId: String, schoolIds: [ { schoolId: String } ] }
//   //     ]
//   //   }
//   // ]
//   const buildAccessPayload = () => {
//     const regions = [];
//     const allData = Array.isArray(dbsData) ? dbsData : [];

//     // For each selected district build its blockIds array (only blocks selected that belong to district)
//     selectedDistricts.forEach((d) => {
//       const districtId = String(d.value);
//       const validBlockIdsForDistrict = new Set(
//         allData
//           .filter((r) => String(r.districtId) === districtId)
//           .map((r) => String(r.blockId))
//       );

//       // filter selectedBlocks to those that belong to this district
//       const blocksForThisDistrict = selectedBlocks.filter((b) =>
//         validBlockIdsForDistrict.has(String(b.value))
//       );

//       const blockIds = blocksForThisDistrict.map((b) => {
//         // schoolIds must be array of objects { schoolId: String }
//         const schoolIdsArr = [];

//         // include selectedSchools which belong to this block
//         // We try to filter selectedSchools by matching dbsData center->block relationship.
//         // Build set of centerIds that belong to this block:
//         const centersForBlock = new Set(
//           allData
//             .filter((r) => String(r.blockId) === String(b.value))
//             .map((r) => String(r.centerId))
//         );

//         // Add dropdown-selected schools that belong to this block
//         selectedSchools.forEach((s) => {
//           const centerId = String(s?.value ?? s);
//           if (centersForBlock.has(centerId)) {
//             schoolIdsArr.push({ schoolId: centerId });
//           }
//         });

//         // If manual entry present, add it as a single string wrapped in object
//         if (manualSchoolChecked && manualSchoolName && manualSchoolCode) {
//           const combined = `${String(manualSchoolName).trim()}-${String(
//             manualSchoolCode
//           ).trim()}`;
//           schoolIdsArr.push({ schoolId: combined });
//         }

//         return {
//           blockId: String(b.value),
//           schoolIds: schoolIdsArr,
//         };
//       });

//       // Only push district if it has blockIds (optional: you can push even empty if needed)
//       if (blockIds.length > 0) {
//         regions.push({ districtId, blockIds });
//       } else {
//         // If user selected district but didn't select blocks for it, push empty blockIds array
//         regions.push({ districtId, blockIds: [] });
//       }
//     });

//     return { region: regions };
//   };

//   // Dummy OTP send
//   const handleSendOtp = async () => {
//     if (!/^\d{10}$/.test(mobile)) {
//       setError("Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     setGeneratedOtp(otp);
//     setOtpSent(true);

//     // prepare payload matching your backend contract
//     const payload = {
//       phone: `91${mobile}`,
//       otp,
//     };

//     try {
//       const response = await sendOtp(payload);
//       // if your sendOtp returns an axios-like response with status:
//       if (response && (response.status === 200 || response.status === "200")) {
//         setError(null);
//         alert("📱 OTP Sent successfully. Test Otp:", otp);
//       } else {
//         // fallback: still show OTP in alert in case SMS gateway failed during dev
//         alert(`📱 OTP (test) is ${otp}`);
//       }
//     } catch (err) {
//       console.error("Error sending OTP:", err);
//       // fallback to show OTP for development/testing if backend failed
//       alert(`📱 OTP (test) is ${otp}`);
//     }
//   };

//   // Dummy OTP verify
//   const handleVerifyOtp = () => {
//     if (enteredOtp === generatedOtp) {
//       setOtpVerified(true);
//       setError(null);
//       alert("✅ OTP Verified!");
//     } else {
//       setError("Invalid OTP. Please try again.");
//     }
//   };

//   // Submit after OTP verified
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate manual school fields when manual is checked AND role needs schools
//     const desigValLocal = designation?.value ?? "";
//     const showAllThreeLocal =
//       desigValLocal === "Teacher" ||
//       desigValLocal === "Principal" ||
//       desigValLocal === "School Staff";

//     if (showAllThreeLocal && manualSchoolChecked) {
//       if (
//         !manualSchoolName ||
//         !manualSchoolName.trim() ||
//         !manualSchoolCode ||
//         !manualSchoolCode.trim()
//       ) {
//         setError("Please fill both manual school name and code.");
//         return;
//       }
//     }

//     if (!otpVerified) {
//       setError("Please verify your mobile number first.");
//       return;
//     }
//     if (!/^\d{4}$/.test(password)) {
//       setError("Password must be a 4-digit number.");
//       return;
//     }

//     const payloadUser = {
//       userName,
//       designation: designation?.value,
//       mobile,
//       password,
//     };

//     const userAccess = buildAccessPayload();

//     // debug log (optional)
//     console.log("Payload userAccess:", JSON.stringify(userAccess, null, 2));

//     setLoading(true);
//     try {
//       await createOrUpdateUser({ user: payloadUser, userAccess });
//       setMsg(" Account created successfully!");
//       setShowModal(true); // ✅ show modal here
//       setUserName("");
//       setDesignation(null);
//       setMobile("");
//       setPassword("");
//       setSelectedDistricts([]);
//       setSelectedBlocks([]);
//       setSelectedSchools([]);
//       setManualSchoolChecked(false);
//       setManualSchoolName("");
//       setManualSchoolCode("");
//       setOtpSent(false);
//       setOtpVerified(false);
//       setEnteredOtp("");
//       setGeneratedOtp("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to register user.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     navigate("/exam-user-signin");
//   };

//   // Determine what to show based on designation.value
//   const desigVal = designation?.value ?? "";
//   const showAllThree =
//     desigVal === "Teacher" ||
//     desigVal === "Principal" ||
//     desigVal === "School Staff";
//   const showDistrictBlock =
//     desigVal === "Center Coordinator" || desigVal === "HKRN" || desigVal === "ABRC";
//   const showDistrictOnly = desigVal === "ACI";

//   // only ACI should be allowed multi-district and multi at other levels
//   const isFullMulti = designation?.value === "ACI";

//   return (
//     <div>
//       <Container
//         fluid
//         className="d-flex justify-content-center align-items-center bg-light responsive-container"
//         style={{ height: "100vh" }}
//       >
//         <Card
//           className="p-4 shadow-lg"
//           style={{ width: "720px", borderRadius: "12px" }}
//         >
//           <Card.Header
//             style={{
//               fontSize: "30px",
//               textAlign: "center",
//               fontWeight: "bold",
//               background: "#C2E6F5",
//             }}
//           >
//             OFFICIALS SIGN-UP (अधिकारिक पंजीकरण) <br></br>
//             <small style={{ fontSize: "12px" }}>
//               Only for Govt. officials, ABRC/BRP/Teachers/School Staff/Vikalpa Staff.
//               <span style={{ display: "block" }}>
//                 (केवल सरकारी अधिकारी, ABRC/BRP/शिक्षक/स्कूल स्टाफ/Vikalpa स्टाफ के
//                 लिए)
//               </span>
//             </small>
//           </Card.Header>

//           <Card.Body>
//             {error && (
//               <Alert variant="danger" onClose={() => setError(null)} dismissible>
//                 {error}
//               </Alert>
//             )}
//             {msg && (
//               <Alert variant="success" onClose={() => setMsg(null)} dismissible>
//                 {msg}
//               </Alert>
//             )}

//             <Form onSubmit={handleSubmit}>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-2" controlId="userName">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control
//                       value={userName}
//                       onChange={(e) => setUserName(e.target.value)}
//                       placeholder="Enter full name"
//                     />
//                   </Form.Group>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group className="mb-2" controlId="designation">
//                     <Form.Label>Designation</Form.Label>
//                     <Select
//                       value={designation}
//                       onChange={(val) => {
//                         setDesignation(val);
//                         // reset manual/school selection when designation changes
//                         setManualSchoolChecked(false);
//                         setManualSchoolName("");
//                         setManualSchoolCode("");
//                         setSelectedDistricts([]);
//                         setSelectedBlocks([]);
//                         setSelectedSchools([]);
//                       }}
//                       options={designationOptions}
//                       placeholder="Select designation"
//                       isClearable
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <hr />

//               {/* Conditionally render district/block/school selects based on designation */}
//               {(showAllThree || showDistrictBlock || showDistrictOnly) && (
//                 <Row className="align-items-start">
//                   {/* STACKED: District */}
//                   <Col md={12}>
//                     <Form.Group className="mb-2" controlId="districtSelect">
//                       <Form.Label>District</Form.Label>
//                       <Select
//                         // only ACI gets multi-select, others get single-select
//                         isMulti={isFullMulti}
//                         options={districtOptions}
//                         value={isFullMulti ? selectedDistricts : (selectedDistricts[0] ?? null)}
//                         onChange={(v) => {
//                           // keep selectedDistricts stored as an array in state
//                           if (isFullMulti) {
//                             setSelectedDistricts(v || []);
//                           } else {
//                             // v will be single object or null
//                             setSelectedDistricts(v ? [v] : []);
//                           }
//                           setSelectedBlocks([]); // reset dependent selects when district changes
//                           setSelectedSchools([]);
//                         }}
//                         placeholder={loadingDBS ? "Loading..." : (isFullMulti ? "Select district(s)" : "Select district")}
//                         isClearable
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* STACKED: Block (when applicable) */}
//                   {(showDistrictBlock || showAllThree) && (
//                     <Col md={12}>
//                       <Form.Group className="mb-2" controlId="blockSelect">
//                         <Form.Label>BlocK</Form.Label>
//                         <Select
//                           // only ACI gets multi-select blocks; others single
//                           isMulti={isFullMulti}
//                           options={blockOptions}
//                           value={isFullMulti ? selectedBlocks : (selectedBlocks[0] ?? null)}
//                           onChange={(v) => {
//                             if (isFullMulti) {
//                               setSelectedBlocks(v || []);
//                             } else {
//                               setSelectedBlocks(v ? [v] : []);
//                             }
//                             setSelectedSchools([]);
//                           }}
//                           placeholder="Select block(s)"
//                         />
//                       </Form.Group>
//                     </Col>
//                   )}

//                   {/* STACKED: School (when applicable) */}
//                   {showAllThree && (
//                     <Col md={12}>
//                       <Form.Group className="mb-2" controlId="schoolSelect">
//                         <Form.Label>School</Form.Label>

//                         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                           <Form.Check
//                             type="checkbox"
//                             id="manualSchoolCheckbox"
//                             checked={manualSchoolChecked}
//                             onChange={(e) => {
//                               const checked = e.target.checked;
//                               setManualSchoolChecked(checked);
//                               if (checked) {
//                                 setSelectedSchools([]); // clear selection when manual entry chosen
//                               } else {
//                                 setManualSchoolName("");
//                                 setManualSchoolCode("");
//                               }
//                             }}
//                             aria-label="Toggle manual school entry"
//                             title="Check to enter school manually"
//                           />
//                           <small style={{ color: "#6c757d" }}>Manual</small>
//                         </div>

//                         {/* If manual checkbox not checked, show the multi-select */}
//                         {!manualSchoolChecked ? (
//                           <>
//                             <div style={{ marginTop: 8 }}>
//                               <Select
//                                 // only ACI gets multi-select schools; others single
//                                 isMulti={isFullMulti}
//                                 options={schoolOptions}
//                                 value={isFullMulti ? selectedSchools : (selectedSchools[0] ?? null)}
//                                 onChange={(v) => {
//                                   if (isFullMulti) {
//                                     setSelectedSchools(v || []);
//                                   } else {
//                                     setSelectedSchools(v ? [v] : []);
//                                   }
//                                 }}
//                                 placeholder="Select school(s)"
//                               />
//                             </div>
//                             <Form.Text className="text-muted d-block mt-1">
//                               यदि आपका विद्यालय ऊपर दी गई सूची में नहीं है, तो "Manual" चेकबॉक्स पर टिक करें और अपना विद्यालय नाम एवं कोड दर्ज करें।
//                             </Form.Text>
//                           </>
//                         ) : (
//                           /* When manual checked, show compact inline inputs */
//                           <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
//                             <Form.Control
//                               value={manualSchoolName}
//                               onChange={(e) => setManualSchoolName(e.target.value)}
//                               placeholder="School name"
//                             />
//                             <Form.Control
//                               value={manualSchoolCode}
//                               onChange={(e) => setManualSchoolCode(e.target.value)}
//                               placeholder="Code"
//                               style={{ maxWidth: 140 }}
//                             />
//                           </div>
//                         )}

//                         {/* {manualSchoolChecked && (
//                           <Form.Text className="text-muted d-block mt-1">
//                             Manual entry will be sent as <strong>schoolName-schoolCode</strong>.
//                           </Form.Text>
//                         )} */}
//                       </Form.Group>
//                     </Col>
//                   )}
//                 </Row>
//               )}

//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-2" controlId="mobile">
//                     <Form.Label>Mobile</Form.Label>
//                     <div className="d-flex">
//                       <Form.Control
//                         value={mobile}
//                         onChange={(e) => setMobile(e.target.value)}
//                         placeholder="10-digit mobile number"
//                         disabled={otpVerified}
//                       />
//                       {!otpSent && (
//                         <Button
//                           className="ms-2"
//                           variant="outline-primary"
//                           onClick={handleSendOtp}
//                         >
//                           Get OTP
//                         </Button>
//                       )}
//                     </div>
//                   </Form.Group>
//                 </Col>

//                 {otpSent && !otpVerified && (
//                   <Col md={6}>
//                     <Form.Group className="mb-2" controlId="otp">
//                       <Form.Label>Enter OTP</Form.Label>
//                       <div className="d-flex">
//                         <Form.Control
//                           value={enteredOtp}
//                           onChange={(e) => setEnteredOtp(e.target.value)}
//                           placeholder="4-digit OTP"
//                         />
//                         <Button
//                           className="ms-2"
//                           variant="success"
//                           onClick={handleVerifyOtp}
//                         >
//                           Verify
//                         </Button>
//                       </div>
//                     </Form.Group>
//                   </Col>
//                 )}
//               </Row>

//               {otpVerified && (
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-2" controlId="password">
//                       <Form.Label>Set 4-digit Password</Form.Label>
//                       <Form.Control
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Enter 4-digit numeric password"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               )}

//               <div className="d-flex justify-content-end mt-3" style={{gap:'3px'}} >
//                 <Button variant="primary" type="submit" disabled={loading || !otpVerified}>
//                   {loading ? (
//                     <>
//                       <Spinner animation="border" size="sm" /> Registering...
//                     </>
//                   ) : (
//                     "Register User"
//                   )}
//                 </Button>

//                       <Button variant="primary" type="submit" 
//                       onClick={()=>{
//                         navigate('/exam-user-signin')
//                       }}>
//                     Login if already have an account
//                 </Button>
//               </div>
              
//             </Form>
//           </Card.Body>
//         </Card>

//         {/* ✅ Success Modal */}
//         <Modal show={showModal} onHide={handleCloseModal} centered>
//           <Modal.Header closeButton>
//             <Modal.Title>Congratulations!</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="text-center">
//             <h5>Your account has been successfully created! <br></br>
//             आपका अकाउंट सफलतापूर्वक बन गया है। Login बटन पर क्लिक करके लॉगिन करें।</h5>
//           </Modal.Body>
//           <Modal.Footer className="d-flex justify-content-center">
//             <Button variant="primary" onClick={handleCloseModal}>
//               Go to Login
//             </Button>
//           </Modal.Footer>
//         </Modal>

//         <style>
//           {`
//       @media (max-width: 800px) {
//         .responsive-container {
//           height: 165vh !important;
//         }
//         /* make manual inputs stack nicely on small screens */
//         .responsive-container .form-control {
//           min-width: 0;
//         }
//         .responsive-container .d-flex[style] {
//           flex-direction: column;
//           gap: 8px;
//         }
//       }
//     `}
//         </style>
//       </Container>
//     </div>
//   );
// };














// import React, { useState, useMemo } from "react";
// import {
//   Form,
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Spinner,
//   Alert,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select";
// import { createOrUpdateUser } from "../../services/UserServices/UserService";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import { useNavigate } from "react-router-dom";
// import { MainNavBar } from "../NavbarsAndFooters/MainNavBar";
// import { sendOtp } from "../../services/OtpService/SendOtpService";
// export const UserSignup = () => {
//   const { districtBlockSchoolData, loadingDBS } =
//     useDistrictBlockSchool() || {};
//   const dbsData = Array.isArray(districtBlockSchoolData)
//     ? districtBlockSchoolData
//     : [];

//   const navigate = useNavigate();

//   const [userName, setUserName] = useState("");
//   const [designation, setDesignation] = useState(null);
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [generatedOtp, setGeneratedOtp] = useState("");
//   const [enteredOtp, setEnteredOtp] = useState("");

//   const [selectedDistricts, setSelectedDistricts] = useState([]);
//   const [selectedBlocks, setSelectedBlocks] = useState([]);
//   const [selectedSchools, setSelectedSchools] = useState([]);

//   // NEW: manual school entry states (for Teacher/Principal/School Staff)
//   const [manualSchoolChecked, setManualSchoolChecked] = useState(false);
//   const [manualSchoolName, setManualSchoolName] = useState("");
//   const [manualSchoolCode, setManualSchoolCode] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState(null);
//   const [error, setError] = useState(null);

//   const [showModal, setShowModal] = useState(false); // ✅ new modal state

//   const designationOptions = [
//     { value: "ACI", label: "ACI" },
//     { value: "Center Coordinator", label: "Center Coordinator" },
//     { value: "HKRN", label: "HKRN" },
//     { value: "ABRC", label: "ABRC" },
//     { value: "Principal", label: "Principal" },
//     { value: "Teacher", label: "Teacher" },
//     { value: "School Staff", label: "School Staff" },
//     { value: "Vikalpa Staff", label: "Vikalpa Staff" },
//   ];

//   // ✅ District options
//   const districtOptions = useMemo(() => {
//     const map = new Map();
//     (dbsData || []).forEach((r) => {
//       if (!r) return;
//       const id = String(r.districtId);
//       const name = r.districtName || id;
//       if (!map.has(id)) map.set(id, { value: id, label: `${name} (${id})` });
//     });
//     return Array.from(map.values());
//   }, [dbsData]);

//   // ✅ Block options
//   const blockOptions = useMemo(() => {
//     const blocksMap = new Map();
//     const selectedDistrictIds = new Set(selectedDistricts.map((d) => d.value));
//     (dbsData || []).forEach((r) => {
//       if (
//         !r ||
//         (selectedDistrictIds.size &&
//           !selectedDistrictIds.has(String(r.districtId)))
//       )
//         return;
//       const id = String(r.blockId);
//       const name = r.blockName || id;
//       if (!blocksMap.has(id))
//         blocksMap.set(id, { value: id, label: `${name} (${id})` });
//     });
//     return Array.from(blocksMap.values());
//   }, [dbsData, selectedDistricts]);

//   // ✅ School options
//   const schoolOptions = useMemo(() => {
//     const map = new Map();
//     const selectedBlockIds = new Set(selectedBlocks.map((b) => b.value));
//     (dbsData || []).forEach((r) => {
//       if (
//         !r ||
//         (selectedBlockIds.size &&
//           !selectedBlockIds.has(String(r.blockId)))
//       )
//         return;
//       const id = String(r.centerId);
//       const name = r.centerName || id;
//       if (!map.has(id))
//         map.set(id, { value: id, label: `${name} (${id})` });
//     });
//     return Array.from(map.values());
//   }, [dbsData, selectedBlocks]);

//   // ---------- UPDATED buildAccessPayload: matches backend schema ----------
//   // backend expects:
//   // region: [
//   //   {
//   //     districtId: String,
//   //     blockIds: [
//   //       { blockId: String, schoolIds: [ { schoolId: String } ] }
//   //     ]
//   //   }
//   // ]
//   const buildAccessPayload = () => {
//     const regions = [];
//     const allData = Array.isArray(dbsData) ? dbsData : [];

//     // For each selected district build its blockIds array (only blocks selected that belong to district)
//     selectedDistricts.forEach((d) => {
//       const districtId = String(d.value);
//       const validBlockIdsForDistrict = new Set(
//         allData
//           .filter((r) => String(r.districtId) === districtId)
//           .map((r) => String(r.blockId))
//       );

//       // filter selectedBlocks to those that belong to this district
//       const blocksForThisDistrict = selectedBlocks.filter((b) =>
//         validBlockIdsForDistrict.has(String(b.value))
//       );

//       const blockIds = blocksForThisDistrict.map((b) => {
//         // schoolIds must be array of objects { schoolId: String }
//         const schoolIdsArr = [];

//         // include selectedSchools which belong to this block
//         // We try to filter selectedSchools by matching dbsData center->block relationship.
//         // Build set of centerIds that belong to this block:
//         const centersForBlock = new Set(
//           allData
//             .filter((r) => String(r.blockId) === String(b.value))
//             .map((r) => String(r.centerId))
//         );

//         // Add dropdown-selected schools that belong to this block
//         selectedSchools.forEach((s) => {
//           const centerId = String(s?.value ?? s);
//           if (centersForBlock.has(centerId)) {
//             schoolIdsArr.push({ schoolId: centerId });
//           }
//         });

//         // If manual entry present, add it as a single string wrapped in object
//         if (manualSchoolChecked && manualSchoolName && manualSchoolCode) {
//           const combined = `${String(manualSchoolName).trim()}-${String(
//             manualSchoolCode
//           ).trim()}`;
//           schoolIdsArr.push({ schoolId: combined });
//         }

//         return {
//           blockId: String(b.value),
//           schoolIds: schoolIdsArr,
//         };
//       });

//       // Only push district if it has blockIds (optional: you can push even empty if needed)
//       if (blockIds.length > 0) {
//         regions.push({ districtId, blockIds });
//       } else {
//         // If user selected district but didn't select blocks for it, push empty blockIds array
//         regions.push({ districtId, blockIds: [] });
//       }
//     });

//     return { region: regions };
//   };

//   // Dummy OTP send
//   const handleSendOtp = async () => {
//     if (!/^\d{10}$/.test(mobile)) {
//       setError("Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     setGeneratedOtp(otp);
//     setOtpSent(true);

//     // prepare payload matching your backend contract
//     const payload = {
//       phone: `91${mobile}`,
//       otp,
//     };

//     try {
//       const response = await sendOtp(payload);
    
//       // if your sendOtp returns an axios-like response with status:
//       if (response && (response.status === 200 || response.status === "200")) {
//         setError(null);
//         alert(`📱 OTP Sent successfully.`, );
//       } else {
//         // fallback: still show OTP in alert in case SMS gateway failed during dev
//         alert(`📱 OTP (test) is ${otp}`);
//       }
//     } catch (err) {
//       console.error("Error sending OTP:", err);
//       // fallback to show OTP for development/testing if backend failed
//       alert(`📱 OTP (test) is ${otp}`);
//     }
//   };

//   // Resend OTP handler (regenerates and sends OTP)
//   const handleResendOtp = async () => {
//     if (!/^\d{10}$/.test(mobile)) {
//       setError("Please enter a valid 10-digit mobile number.");
//       return;
//     }
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     setGeneratedOtp(otp);
//     setOtpSent(true);

//     const payload = {
//       phone: `91${mobile}`,
//       otp,
//     };

//     try {
//       const response = await sendOtp(payload);
    
//       if (response && (response.status === 200 || response.status === "200")) {

        
//         setError(null);
//         alert(`📱 OTP Resent successfully.`);
//       } else {
//         alert(`📱 OTP (test) is ${otp}`);
//       }
//     } catch (err) {
//       console.error("Error resending OTP:", err);
//       alert(`📱 OTP (test) is ${otp}`);
//     }
//   };

//   // Dummy OTP verify
//   const handleVerifyOtp = () => {
//     if (enteredOtp === generatedOtp) {
//       setOtpVerified(true);
//       setError(null);
//       alert("✅ OTP Verified!");
//     } else {
//       setError("Invalid OTP. Please try again.");
//     }
//   };

//   // Submit after OTP verified
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate manual school fields when manual is checked AND role needs schools
//     const desigValLocal = designation?.value ?? "";
//     const showAllThreeLocal =
//       desigValLocal === "Teacher" ||
//       desigValLocal === "Principal" ||
//       desigValLocal === "School Staff";

//     if (showAllThreeLocal && manualSchoolChecked) {
//       if (
//         !manualSchoolName ||
//         !manualSchoolName.trim() ||
//         !manualSchoolCode ||
//         !manualSchoolCode.trim()
//       ) {
//         setError("Please fill both manual school name and code.");
//         return;
//       }
//     }

//     if (!otpVerified) {
//       setError("Please verify your mobile number first.");
//       return;
//     }
//     if (!/^\d{4}$/.test(password)) {
//       setError("Password must be a 4-digit number.");
//       return;
//     }

//     const payloadUser = {
//       userName,
//       designation: designation?.value,
//       mobile,
//       password,
//     };

//     const userAccess = buildAccessPayload();

//     // debug log (optional)
//     console.log("Payload userAccess:", JSON.stringify(userAccess, null, 2));

//     setLoading(true);
//     try {
//       await createOrUpdateUser({ user: payloadUser, userAccess });
//       setMsg(" Account created successfully!");
//       setShowModal(true); // ✅ show modal here
//       setUserName("");
//       setDesignation(null);
//       setMobile("");
//       setPassword("");
//       setSelectedDistricts([]);
//       setSelectedBlocks([]);
//       setSelectedSchools([]);
//       setManualSchoolChecked(false);
//       setManualSchoolName("");
//       setManualSchoolCode("");
//       setOtpSent(false);
//       setOtpVerified(false);
//       setEnteredOtp("");
//       setGeneratedOtp("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to register user.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     navigate("/exam-user-signin");
//   };

//   // Determine what to show based on designation.value
//   const desigVal = designation?.value ?? "";
//   const showAllThree =
//     desigVal === "Teacher" ||
//     desigVal === "Principal" ||
//     desigVal === "School Staff";
//   const showDistrictBlock =
//     desigVal === "Center Coordinator" || desigVal === "HKRN" || desigVal === "ABRC";
//   const showDistrictOnly = desigVal === "ACI";

//   // only ACI should be allowed multi-district and multi at other levels
//   const isFullMulti = designation?.value === "ACI";

//   return (
//     <div>
//         <br></br>
//       <Container
//         fluid
//         className="d-flex justify-content-center align-items-center bg-light responsive-container"
        
//       >
//         <Card
//           className="p-4 shadow-lg"
//           style={{ width: "720px", borderRadius: "12px" }}
//         >
//           <Card.Header
//             style={{
//               fontSize: "30px",
//               textAlign: "center",
//               fontWeight: "bold",
//               background: "#C2E6F5",
//             }}
//           >
//             OFFICIALS SIGN-UP (अधिकारिक पंजीकरण) <br></br>
//             <small style={{ fontSize: "12px" }}>
//               Only for Govt. officials, ABRC/BRP/Teachers/School Staff/Vikalpa Staff.
//               <span style={{ display: "block" }}>
//                 (केवल सरकारी अधिकारी, ABRC/BRP/शिक्षक/स्कूल स्टाफ/Vikalpa स्टाफ के
//                 लिए)
//               </span>
//             </small>
//           </Card.Header>

//           <Card.Body>
//             {error && (
//               <Alert variant="danger" onClose={() => setError(null)} dismissible>
//                 {error}
//               </Alert>
//             )}
//             {msg && (
//               <Alert variant="success" onClose={() => setMsg(null)} dismissible>
//                 {msg}
//               </Alert>
//             )}

//             <Form onSubmit={handleSubmit}>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-2" controlId="userName">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control
//                       value={userName}
//                       onChange={(e) => setUserName(e.target.value)}
//                       placeholder="Enter full name"
//                     />
//                   </Form.Group>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group className="mb-2" controlId="designation">
//                     <Form.Label>Designation</Form.Label>
//                     <Select
//                       value={designation}
//                       onChange={(val) => {
//                         setDesignation(val);
//                         // reset manual/school selection when designation changes
//                         setManualSchoolChecked(false);
//                         setManualSchoolName("");
//                         setManualSchoolCode("");
//                         setSelectedDistricts([]);
//                         setSelectedBlocks([]);
//                         setSelectedSchools([]);
//                       }}
//                       options={designationOptions}
//                       placeholder="Select designation"
//                       isClearable
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <hr />

//               {/* Conditionally render district/block/school selects based on designation */}
//               {(showAllThree || showDistrictBlock || showDistrictOnly) && (
//                 <Row className="align-items-start">
//                   {/* STACKED: District */}
//                   <Col md={12}>
//                     <Form.Group className="mb-2" controlId="districtSelect">
//                       <Form.Label>District</Form.Label>
//                       <Select
//                         // only ACI gets multi-select, others get single-select
//                         isMulti={isFullMulti}
//                         options={districtOptions}
//                         value={isFullMulti ? selectedDistricts : (selectedDistricts[0] ?? null)}
//                         onChange={(v) => {
//                           // keep selectedDistricts stored as an array in state
//                           if (isFullMulti) {
//                             setSelectedDistricts(v || []);
//                           } else {
//                             // v will be single object or null
//                             setSelectedDistricts(v ? [v] : []);
//                           }
//                           setSelectedBlocks([]); // reset dependent selects when district changes
//                           setSelectedSchools([]);
//                         }}
//                         placeholder={loadingDBS ? "Loading..." : (isFullMulti ? "Select district(s)" : "Select district")}
//                         isClearable
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* STACKED: Block (when applicable) */}
//                   {(showDistrictBlock || showAllThree) && (
//                     <Col md={12}>
//                       <Form.Group className="mb-2" controlId="blockSelect">
//                         <Form.Label>BlocK</Form.Label>
//                         <Select
//                           // only ACI gets multi-select blocks; others single
//                           isMulti={isFullMulti}
//                           options={blockOptions}
//                           value={isFullMulti ? selectedBlocks : (selectedBlocks[0] ?? null)}
//                           onChange={(v) => {
//                             if (isFullMulti) {
//                               setSelectedBlocks(v || []);
//                             } else {
//                               setSelectedBlocks(v ? [v] : []);
//                             }
//                             setSelectedSchools([]);
//                           }}
//                           placeholder="Select block(s)"
//                         />
//                       </Form.Group>
//                     </Col>
//                   )} 

//                   {/* STACKED: School (when applicable) */}
//                   {showAllThree && (
//                     <Col md={12}>
//                       <Form.Group className="mb-2" controlId="schoolSelect">
//                         <Form.Label>School</Form.Label>

//                         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                           <Form.Check
//                             type="checkbox"
//                             id="manualSchoolCheckbox"
//                             checked={manualSchoolChecked}
//                             onChange={(e) => {
//                               const checked = e.target.checked;
//                               setManualSchoolChecked(checked);
//                               if (checked) {
//                                 setSelectedSchools([]); // clear selection when manual entry chosen
//                               } else {
//                                 setManualSchoolName("");
//                                 setManualSchoolCode("");
//                               }
//                             }}
//                             aria-label="Toggle manual school entry"
//                             title="Check to enter school manually"
//                           />
//                           <small style={{ color: "#6c757d" }}>Manual</small>
//                         </div>

//                         {/* If manual checkbox not checked, show the multi-select */}
//                         {!manualSchoolChecked ? (
//                           <>
//                             <div style={{ marginTop: 8 }}>
//                               <Select
//                                 // only ACI gets multi-select schools; others single
//                                 isMulti={isFullMulti}
//                                 options={schoolOptions}
//                                 value={isFullMulti ? selectedSchools : (selectedSchools[0] ?? null)}
//                                 onChange={(v) => {
//                                   if (isFullMulti) {
//                                     setSelectedSchools(v || []);
//                                   } else {
//                                     setSelectedSchools(v ? [v] : []);
//                                   }
//                                 }}
//                                 placeholder="Select school(s)"
//                               />
//                             </div>
//                             <Form.Text className="text-muted d-block mt-1">
//                               यदि आपका विद्यालय ऊपर दी गई सूची में नहीं है, तो "Manual" चेकबॉक्स पर टिक करें और अपना विद्यालय नाम एवं कोड दर्ज करें।
//                             </Form.Text>
//                           </>
//                         ) : (
//                           /* When manual checked, show compact inline inputs */
//                           <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
//                             <Form.Control
//                               value={manualSchoolName}
//                               onChange={(e) => setManualSchoolName(e.target.value)}
//                               placeholder="School name"
//                             />
//                             <Form.Control
//                               value={manualSchoolCode}
//                               onChange={(e) => setManualSchoolCode(e.target.value)}
//                               placeholder="Code"
//                               style={{ maxWidth: 140 }}
//                             />
//                           </div>
//                         )}

//                         {/* {manualSchoolChecked && (
//                           <Form.Text className="text-muted d-block mt-1">
//                             Manual entry will be sent as <strong>schoolName-schoolCode</strong>.
//                           </Form.Text>
//                         )} */}
//                       </Form.Group>
//                     </Col>
//                   )}
//                 </Row>
//               )}

//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-2" controlId="mobile">
//                     <Form.Label>Mobile</Form.Label>
//                     <div className="d-flex">
//                       <Form.Control
//                         value={mobile}
//                         onChange={(e) => setMobile(e.target.value)}
//                         placeholder="10-digit mobile number"
//                         disabled={otpVerified}
//                       />
//                       {!otpSent && (
//                         <Button
//                           className="ms-2"
//                           variant="outline-primary"
//                           onClick={handleSendOtp}
//                         >
//                           Get OTP
//                         </Button>
//                       )}
//                     </div>
//                   </Form.Group>
//                 </Col>

//                 {otpSent && !otpVerified && (
//                   <Col md={6}>
//                     <Form.Group className="mb-2" controlId="otp">
//                       <Form.Label>Enter OTP</Form.Label>
//                       <div className="d-flex">
//                         <Form.Control
//                           value={enteredOtp}
//                           onChange={(e) => setEnteredOtp(e.target.value)}
//                           placeholder="4-digit OTP"
//                         />
//                         <Button
//                           className="ms-2"
//                           variant="success"
//                           onClick={handleVerifyOtp}
//                         >
//                           Verify
//                         </Button>
//                       </div>
//                       {/* Resend button just below Enter OTP */}
//                       <div style={{ marginTop: 6 }}>
//                         <Button variant="link" onClick={handleResendOtp}>
//                           Resend OTP
//                         </Button>
//                       </div>
//                     </Form.Group>
//                   </Col>
//                 )}
//               </Row>

//               {otpVerified && (
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-2" controlId="password">
//                       <Form.Label>Set 4-digit Password</Form.Label>
//                       <Form.Control
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Enter 4-digit numeric password"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               )}

//               <div className="d-flex justify-content-end mt-3" style={{gap:'3px'}} >
//                 <Button variant="primary" type="submit" disabled={loading || !otpVerified}>
//                   {loading ? (
//                     <>
//                       <Spinner animation="border" size="sm" /> Registering...
//                     </>
//                   ) : (
//                     "Register User"
//                   )}
//                 </Button>

//                       <Button variant="primary" type="submit" 
//                       onClick={()=>{
//                         navigate('/exam-user-signin')
//                       }}>
//                     Login if already have an account
//                 </Button>
//               </div>
              
//             </Form>
//           </Card.Body>
//         </Card>

//         {/* ✅ Success Modal */}
//         <Modal show={showModal} onHide={handleCloseModal} centered>
//           <Modal.Header closeButton>
//             <Modal.Title>Congratulations!</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="text-center">
//             <h5>Your account has been successfully created! <br></br>
//             आपका अकाउंट सफलतापूर्वक बन गया है। Login बटन पर क्लिक करके लॉगिन करें।</h5>
//           </Modal.Body>
//           <Modal.Footer className="d-flex justify-content-center">
//             <Button variant="primary" onClick={handleCloseModal}>
//               Go to Login
//             </Button>
//           </Modal.Footer>
//         </Modal>

        
//       </Container>
//       <br></br>
//     </div>
//   );
// };













import React, { useState, useMemo } from "react";
import {
  Form,
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import Select from "react-select";
import { createOrUpdateUser } from "../../services/UserServices/UserService";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
import { useNavigate } from "react-router-dom";
import { MainNavBar } from "../NavbarsAndFooters/MainNavBar";
import { sendOtp } from "../../services/OtpService/SendOtpService";
export const UserSignup = () => {
  const { districtBlockSchoolData, loadingDBS } =
    useDistrictBlockSchool() || {};
  const dbsData = Array.isArray(districtBlockSchoolData)
    ? districtBlockSchoolData
    : [];

  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [designation, setDesignation] = useState(null);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);

  // NEW: manual school entry states (for Teacher/Principal/School Staff)
  const [manualSchoolChecked, setManualSchoolChecked] = useState(false);
  const [manualSchoolName, setManualSchoolName] = useState("");
  const [manualSchoolCode, setManualSchoolCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false); // ✅ new modal state

  const designationOptions = [
    { value: "ACI", label: "ACI" },
    { value: "Center Coordinator", label: "Center Coordinator" },
    { value: "HKRN", label: "HKRN" },
    { value: "ABRC", label: "ABRC" },
    { value: "Principal", label: "Principal" },
    { value: "Teacher", label: "Teacher" },
    { value: "School Staff", label: "School Staff" },
    { value: "Vikalpa Staff", label: "Vikalpa Staff" },
  ];

  // ✅ District options
  const districtOptions = useMemo(() => {
    const map = new Map();
    (dbsData || []).forEach((r) => {
      if (!r) return;
      const id = String(r.districtId);
      const name = r.districtName || id;
      if (!map.has(id)) map.set(id, { value: id, label: `${name} (${id})` });
    });
    return Array.from(map.values());
  }, [dbsData]);

  // ✅ Block options
  const blockOptions = useMemo(() => {
    const blocksMap = new Map();
    const selectedDistrictIds = new Set(selectedDistricts.map((d) => d.value));
    (dbsData || []).forEach((r) => {
      if (
        !r ||
        (selectedDistrictIds.size &&
          !selectedDistrictIds.has(String(r.districtId)))
      )
        return;
      const id = String(r.blockId);
      const name = r.blockName || id;
      if (!blocksMap.has(id))
        blocksMap.set(id, { value: id, label: `${name} (${id})` });
    });
    return Array.from(blocksMap.values());
  }, [dbsData, selectedDistricts]);

  // ✅ School options
  const schoolOptions = useMemo(() => {
    const map = new Map();
    const selectedBlockIds = new Set(selectedBlocks.map((b) => b.value));
    (dbsData || []).forEach((r) => {
      if (
        !r ||
        (selectedBlockIds.size &&
          !selectedBlockIds.has(String(r.blockId)))
      )
        return;
      const id = String(r.centerId);
      const name = r.centerName || id;
      if (!map.has(id))
        map.set(id, { value: id, label: `${name} (${id})` });
    });
    return Array.from(map.values());
  }, [dbsData, selectedBlocks]);

  // ---------- UPDATED buildAccessPayload: matches backend schema ----------
  // backend expects:
  // region: [
  //   {
  //     districtId: String,
  //     blockIds: [
  //       { blockId: String, schoolIds: [ { schoolId: String } ] }
  //     ]
  //   }
  // ]
  const buildAccessPayload = () => {
    const regions = [];
    const allData = Array.isArray(dbsData) ? dbsData : [];

    // For each selected district build its blockIds array (only blocks selected that belong to district)
    selectedDistricts.forEach((d) => {
      const districtId = String(d.value);
      const validBlockIdsForDistrict = new Set(
        allData
          .filter((r) => String(r.districtId) === districtId)
          .map((r) => String(r.blockId))
      );

      // filter selectedBlocks to those that belong to this district
      const blocksForThisDistrict = selectedBlocks.filter((b) =>
        validBlockIdsForDistrict.has(String(b.value))
      );

      const blockIds = blocksForThisDistrict.map((b) => {
        // schoolIds must be array of objects { schoolId: String }
        const schoolIdsArr = [];

        // include selectedSchools which belong to this block
        // We try to filter selectedSchools by matching dbsData center->block relationship.
        // Build set of centerIds that belong to this block:
        const centersForBlock = new Set(
          allData
            .filter((r) => String(r.blockId) === String(b.value))
            .map((r) => String(r.centerId))
        );

        // Add dropdown-selected schools that belong to this block
        selectedSchools.forEach((s) => {
          const centerId = String(s?.value ?? s);
          if (centersForBlock.has(centerId)) {
            schoolIdsArr.push({ schoolId: centerId });
          }
        });

        // If manual entry present, add it as a single string wrapped in object
        if (manualSchoolChecked && manualSchoolName && manualSchoolCode) {
          const combined = `${String(manualSchoolName).trim()}-${String(
            manualSchoolCode
          ).trim()}`;
          schoolIdsArr.push({ schoolId: combined });
        }

        return {
          blockId: String(b.value),
          schoolIds: schoolIdsArr,
        };
      });

      // Only push district if it has blockIds (optional: you can push even empty if needed)
      if (blockIds.length > 0) {
        regions.push({ districtId, blockIds });
      } else {
        // If user selected district but didn't select blocks for it, push empty blockIds array
        regions.push({ districtId, blockIds: [] });
      }
    });

    return { region: regions };
  };

  // Dummy OTP send
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);

    // prepare payload matching your backend contract
    const payload = {
      phone: `91${mobile}`,
      otp,
    };

    try {
      const response = await sendOtp(payload);
    
      // if your sendOtp returns an axios-like response with status:
      if (response && (response.status === 200 || response.status === "200")) {
        setError(null);
        alert(`📱 OTP Sent successfully.`, );
      } else {
        // fallback: still show OTP in alert in case SMS gateway failed during dev
        alert(`📱 OTP (test) is ${otp}`);
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      // fallback to show OTP for development/testing if backend failed
      alert(`📱 OTP (test) is ${otp}`);
    }
  };

  // Resend OTP handler (regenerates and sends OTP)
  const handleResendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);

    const payload = {
      phone: `91${mobile}`,
      otp,
    };

    try {
      const response = await sendOtp(payload);
    
      if (response && (response.status === 200 || response.status === "200")) {

        
        setError(null);
        alert(`📱 OTP Resent successfully.`);
      } else {
        alert(`📱 OTP (test) is ${otp}`);
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      alert(`📱 OTP (test) is ${otp}`);
    }
  };

  // Dummy OTP verify
  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      setOtpVerified(true);
      setError(null);
      alert("✅ OTP Verified!");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  // Submit after OTP verified
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate manual school fields when manual is checked AND role needs schools
    const desigValLocal = designation?.value ?? "";
    const showAllThreeLocal =
      desigValLocal === "Teacher" ||
      desigValLocal === "Principal" ||
      desigValLocal === "School Staff";

    if (showAllThreeLocal && manualSchoolChecked) {
      if (
        !manualSchoolName ||
        !manualSchoolName.trim() ||
        !manualSchoolCode ||
        !manualSchoolCode.trim()
      ) {
        setError("Please fill both manual school name and code.");
        return;
      }
    }

    if (!otpVerified) {
      setError("Please verify your mobile number first.");
      return;
    }
    if (!/^\d{4}$/.test(password)) {
      setError("Password must be a 4-digit number.");
      return;
    }

    const payloadUser = {
      userName,
      designation: designation?.value,
      mobile,
      password,
    };

    const userAccess = buildAccessPayload();

    // debug log (optional)
    console.log("Payload userAccess:", JSON.stringify(userAccess, null, 2));

    setLoading(true);
    try {
      await createOrUpdateUser({ user: payloadUser, userAccess });
      setMsg(" Account created successfully!");
      setShowModal(true); // ✅ show modal here
      setUserName("");
      setDesignation(null);
      setMobile("");
      setPassword("");
      setSelectedDistricts([]);
      setSelectedBlocks([]);
      setSelectedSchools([]);
      setManualSchoolChecked(false);
      setManualSchoolName("");
      setManualSchoolCode("");
      setOtpSent(false);
      setOtpVerified(false);
      setEnteredOtp("");
      setGeneratedOtp("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to register user.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/exam-user-signin");
  };

  // Determine what to show based on designation.value
  const desigVal = designation?.value ?? "";
  const showAllThree =
    desigVal === "Teacher" ||
    desigVal === "Principal" ||
    desigVal === "School Staff";
  const showDistrictBlock =
    desigVal === "Center Coordinator" || desigVal === "HKRN" || desigVal === "ABRC";
  const showDistrictOnly = desigVal === "ACI";

  // only ACI should be allowed multi-district and multi at other levels
  const isFullMulti = designation?.value === "ACI";

  return (
    <div>
        <br></br>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center bg-light responsive-container"
        
      >
        <Card
          className="p-4 shadow-lg"
          style={{ width: "720px", borderRadius: "12px" }}
        >
          <Card.Header
            style={{
              fontSize: "30px",
              textAlign: "center",
              fontWeight: "bold",
              background: "#C2E6F5",
            }}
          >
            OFFICIALS SIGN-UP (अधिकारिक पंजीकरण) <br></br>
            <small style={{ fontSize: "12px" }}>
              Only for Govt. officials, ABRC/BRP/Teachers/School Staff/Vikalpa Staff.
              <span style={{ display: "block" }}>
                (केवल सरकारी अधिकारी, ABRC/BRP/शिक्षक/स्कूल स्टाफ/Vikalpa स्टाफ के
                लिए)
              </span>
            </small>
          </Card.Header>

          <Card.Body>
            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}
            {msg && (
              <Alert variant="success" onClose={() => setMsg(null)} dismissible>
                {msg}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-2" controlId="userName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter full name"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-2" controlId="designation">
                    <Form.Label>Designation</Form.Label>
                    <Select
                      value={designation}
                      onChange={(val) => {
                        setDesignation(val);
                        // reset manual/school selection when designation changes
                        setManualSchoolChecked(false);
                        setManualSchoolName("");
                        setManualSchoolCode("");
                        setSelectedDistricts([]);
                        setSelectedBlocks([]);
                        setSelectedSchools([]);
                      }}
                      options={designationOptions}
                      placeholder="Select designation"
                      isClearable
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr />

              {/* Conditionally render district/block/school selects based on designation */}
              {(showAllThree || showDistrictBlock || showDistrictOnly) && (
                <Row className="align-items-start">
                  {/* STACKED: District */}
                  <Col md={12}>
                    <Form.Group className="mb-2" controlId="districtSelect">
                      <Form.Label>District</Form.Label>
                      <Select
                        // only ACI gets multi-select, others get single-select
                        isMulti={isFullMulti}
                        options={districtOptions}
                        value={isFullMulti ? selectedDistricts : (selectedDistricts[0] ?? null)}
                        onChange={(v) => {
                          // keep selectedDistricts stored as an array in state
                          if (isFullMulti) {
                            setSelectedDistricts(v || []);
                          } else {
                            // v will be single object or null
                            setSelectedDistricts(v ? [v] : []);
                          }
                          setSelectedBlocks([]); // reset dependent selects when district changes
                          setSelectedSchools([]);
                        }}
                        placeholder={loadingDBS ? "Loading..." : (isFullMulti ? "Select district(s)" : "Select district")}
                        isClearable
                      />
                    </Form.Group>
                  </Col>

                  {/* STACKED: Block (when applicable) */}
                  {(showDistrictBlock || showAllThree) && (
                    <Col md={12}>
                      <Form.Group className="mb-2" controlId="blockSelect">
                        <Form.Label>BlocK</Form.Label>
                        <Select
                          // only ACI gets multi-select blocks; others single
                          isMulti={isFullMulti}
                          options={blockOptions}
                          value={isFullMulti ? selectedBlocks : (selectedBlocks[0] ?? null)}
                          onChange={(v) => {
                            if (isFullMulti) {
                              setSelectedBlocks(v || []);
                            } else {
                              setSelectedBlocks(v ? [v] : []);
                            }
                            setSelectedSchools([]);
                          }}
                          placeholder="Select block(s)"
                        />
                      </Form.Group>
                    </Col>
                  )} 

                  {/* STACKED: School (when applicable) */}
                  {showAllThree && (
                    <Col md={12}>
                      <Form.Group className="mb-2" controlId="schoolSelect">
                        <Form.Label>School</Form.Label>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Form.Check
                            type="checkbox"
                            id="manualSchoolCheckbox"
                            checked={manualSchoolChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setManualSchoolChecked(checked);
                              if (checked) {
                                setSelectedSchools([]); // clear selection when manual entry chosen
                              } else {
                                setManualSchoolName("");
                                setManualSchoolCode("");
                              }
                            }}
                            aria-label="Toggle manual school entry"
                            title="Check to enter school manually"
                          />
                          <small style={{ color: "#6c757d" }}>Manual</small>
                        </div>

                        {/* If manual checkbox not checked, show the multi-select */}
                        {!manualSchoolChecked ? (
                          <>
                            <div style={{ marginTop: 8 }}>
                              <Select
                                // only ACI gets multi-select schools; others single
                                isMulti={isFullMulti}
                                options={schoolOptions}
                                value={isFullMulti ? selectedSchools : (selectedSchools[0] ?? null)}
                                onChange={(v) => {
                                  if (isFullMulti) {
                                    setSelectedSchools(v || []);
                                  } else {
                                    setSelectedSchools(v ? [v] : []);
                                  }
                                }}
                                placeholder="Select school(s)"
                              />
                            </div>
                            <Form.Text className="text-muted d-block mt-1">
                              यदि आपका विद्यालय ऊपर दी गई सूची में नहीं है, तो "Manual" चेकबॉक्स पर टिक करें और अपना विद्यालय नाम एवं कोड दर्ज करें।
                            </Form.Text>
                          </>
                        ) : (
                          /* When manual checked, show compact inline inputs */
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                            <Form.Control
                              value={manualSchoolName}
                              onChange={(e) => setManualSchoolName(e.target.value)}
                              placeholder="School name"
                            />
                            <Form.Control
                              value={manualSchoolCode}
                              onChange={(e) => setManualSchoolCode(e.target.value)}
                              placeholder="Code"
                              style={{ maxWidth: 140 }}
                            />
                          </div>
                        )}

                        {/* {manualSchoolChecked && (
                          <Form.Text className="text-muted d-block mt-1">
                            Manual entry will be sent as <strong>schoolName-schoolCode</strong>.
                          </Form.Text>
                        )} */}
                      </Form.Group>
                    </Col>
                  )}
                </Row>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-2" controlId="mobile">
                    <Form.Label>Mobile</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        value={mobile}
                        onChange={(e) => {
                          // allow only digits and limit to 10 characters
                          const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setMobile(onlyNums);
                          // clear error when user types valid length
                          if (/^\d{10}$/.test(onlyNums)) {
                            setError(null);
                          }
                        }}
                        placeholder="10-digit mobile number"
                        disabled={otpVerified}
                      />
                      {!otpSent && (
                        <Button
                          className="ms-2"
                          variant="outline-primary"
                          onClick={handleSendOtp}
                        >
                          Get OTP
                        </Button>
                      )}
                    </div>
                  </Form.Group>
                </Col>

                {otpSent && !otpVerified && (
                  <Col md={6}>
                    <Form.Group className="mb-2" controlId="otp">
                      <Form.Label>Enter OTP</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          value={enteredOtp}
                          onChange={(e) => {
                            // allow only digits and max 4 characters
                            const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setEnteredOtp(onlyNums);
                          }}
                          placeholder="4-digit OTP"
                        />
                        <Button
                          className="ms-2"
                          variant="success"
                          onClick={handleVerifyOtp}
                        >
                          Verify
                        </Button>
                      </div>
                      {/* Resend button just below Enter OTP */}
                      <div style={{ marginTop: 6 }}>
                        <Button variant="link" onClick={handleResendOtp}>
                          Resend OTP
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                )}
              </Row>

              {otpVerified && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2" controlId="password">
                      <Form.Label>Set 4-digit Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => {
                          // allow only digits and limit to 4 characters
                          const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setPassword(onlyNums);
                        }}
                        placeholder="Enter 4-digit numeric password"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <div className="d-flex justify-content-end mt-3" style={{gap:'3px'}} >
                <Button variant="primary" type="submit" disabled={loading || !otpVerified}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Registering...
                    </>
                  ) : (
                    "Register User"
                  )}
                </Button>

                      <Button variant="primary" type="submit" 
                      onClick={()=>{
                        navigate('/exam-user-signin')
                      }}>
                    Login if already have an account
                </Button>
              </div>
              
            </Form>
          </Card.Body>
        </Card>

        {/* ✅ Success Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Congratulations!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <h5>Your account has been successfully created! <br></br>
            आपका अकाउंट सफलतापूर्वक बन गया है। Login बटन पर क्लिक करके लॉगिन करें।</h5>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="primary" onClick={handleCloseModal}>
              Go to Login
            </Button>
          </Modal.Footer>
        </Modal>

        
      </Container>
      <br></br>
    </div>
  );
};
