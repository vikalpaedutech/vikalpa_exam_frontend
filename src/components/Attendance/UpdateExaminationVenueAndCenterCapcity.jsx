// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import Select from "react-select";
// import { FaSave } from "react-icons/fa";
// import {
//   GetCentersDataByExaminationAndExamType,
//   updateExaminationCentersAndCapacity,
// } from "../../services/ExaminationVenue/ExaminationVenueServices";

// export const UpdateCenterAttendanceCount = () => {
//   const [centers, setCenters] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [blocks, setBlocks] = useState([]);
//   const [filteredCenters, setFilteredCenters] = useState([]);

//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedCenter, setSelectedCenter] = useState(null);

//   const [attendanceCount, setAttendanceCount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   /* ---------------- FETCH CENTERS ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamType();
//         const data = res.data || [];
//         setCenters(data);

//         const uniqueDistricts = [
//           ...new Map(
//             data.map((d) => [
//               d.districtId,
//               { value: d.districtId, label: d.districtName },
//             ])
//           ).values(),
//         ];
//         setDistricts(uniqueDistricts);
//       } catch {
//         setError("Failed to fetch centers");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCenters();
//   }, []);

//   /* ---------------- HANDLE SAVE ---------------- */
//   const handleUpdateAttendance = async () => {
//     if (!selectedCenter || !attendanceCount) {
//       return setError("Please select center and enter attendance count");
//     }

//     setSaving(true);
//     setError(null);
//     setSuccess(null);

 

//     const reqBody  = {
//         id:selectedCenter.value,
//         attendanceCount:attendanceCount
//     }

//     try {
//       const res = await updateExaminationCentersAndCapacity(reqBody);

//       setSuccess("Attendance count updated successfully");

//       // update local centers state also
//       setCenters((prev) =>
//         prev.map((c) =>
//           c._id === selectedCenter.value
//             ? { ...c, attendanceCount }
//             : c
//         )
//       );
//     } catch {
//       setError("Failed to update attendance count");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <Container className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white">
//           <h5 className="mb-0">Update Center Attendance Count</h5>
//         </Card.Header>

//         <Card.Body>
//           {error && <Alert variant="danger">{error}</Alert>}
//           {success && <Alert variant="success">{success}</Alert>}

//           {loading ? (
//             <div className="text-center">
//               <Spinner animation="border" />
//             </div>
//           ) : (
//             <>
//               <Row className="mb-3">
//                 <Col md={4}>
//                   <Form.Label>District</Form.Label>
//                   <Select
//                     options={districts}
//                     isClearable
//                     placeholder="Select District"
//                     onChange={(d) => {
//                       setSelectedDistrict(d);
//                       setSelectedBlock(null);
//                       setSelectedCenter(null);
//                       setAttendanceCount("");
//                       setSuccess(null);

//                       if (d) {
//                         const blockData = centers
//                           .filter((c) => c.districtId === d.value)
//                           .map((c) => ({
//                             value: c.blockId,
//                             label: c.blockName,
//                           }));

//                         setBlocks([
//                           ...new Map(
//                             blockData.map((b) => [b.value, b])
//                           ).values(),
//                         ]);
//                       } else {
//                         setBlocks([]);
//                       }
//                     }}
//                     value={selectedDistrict}
//                   />
//                 </Col>

//                 <Col md={4}>
//                   <Form.Label>Block</Form.Label>
//                   <Select
//                     options={blocks}
//                     isClearable
//                     isDisabled={!selectedDistrict}
//                     placeholder="Select Block"
//                     onChange={(b) => {
//                       setSelectedBlock(b);
//                       setSelectedCenter(null);
//                       setAttendanceCount("");
//                       setSuccess(null);

//                       if (b && selectedDistrict) {
//                         const centerData = centers
//                           .filter(
//                             (c) =>
//                               c.blockId === b.value &&
//                               c.districtId === selectedDistrict.value
//                           )
//                           .map((c) => ({
//                             value: c._id,
//                             label: c.examinationVenue,
//                             attendanceCount: c.attendanceCount || "",
//                           }));

//                         setFilteredCenters(centerData);
//                       } else {
//                         setFilteredCenters([]);
//                       }
//                     }}
//                     value={selectedBlock}
//                   />
//                 </Col>

//                 <Col md={4}>
//                   <Form.Label>Examination Center</Form.Label>
//                   <Select
//                     options={filteredCenters}
//                     isClearable
//                     isDisabled={!selectedBlock}
//                     placeholder="Select Center"
//                     onChange={(center) => {
//                       setSelectedCenter(center);
//                       setAttendanceCount(center?.attendanceCount || "");
//                       setSuccess(null);
//                     }}
//                     value={selectedCenter}
//                   />
//                 </Col>
//               </Row>

//               {selectedCenter && (
//                 <Row className="mt-4">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Attendance Count</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter attendance count"
//                         value={attendanceCount}
//                         onChange={(e) =>
//                           setAttendanceCount(e.target.value)
//                         }
//                       />
//                       <Form.Text className="text-muted">
//                         Existing value (if any) is pre-filled
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>

//                   <Col
//                     md={6}
//                     className="d-flex align-items-end"
//                   >
//                     <Button
//                       variant="success"
//                       onClick={handleUpdateAttendance}
//                       disabled={saving}
//                       className="px-4"
//                     >
//                       {saving ? (
//                         <>
//                           <Spinner size="sm" className="me-2" />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <FaSave className="me-2" />
//                           Update Attendance
//                         </>
//                       )}
//                     </Button>
//                   </Col>
//                 </Row>
//               )}
//             </>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };





// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Table,
// } from "react-bootstrap";
// import Select from "react-select";
// import { FaSave, FaEye, FaDownload } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import {
//   GetCentersDataByExaminationAndExamType,
//   updateExaminationCentersAndCapacity,
// } from "../../services/ExaminationVenue/ExaminationVenueServices";

// export const UpdateCenterAttendanceCount = () => {
//   const [centers, setCenters] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [blocks, setBlocks] = useState([]);
//   const [filteredCenters, setFilteredCenters] = useState([]);

//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedCenter, setSelectedCenter] = useState(null);

//   const [attendanceCount, setAttendanceCount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const [showAttendanceTable, setShowAttendanceTable] = useState(false);

//   /* ---------------- FETCH CENTERS ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamType();
//         const data = res.data || [];
//         setCenters(data);

//         const uniqueDistricts = [
//           ...new Map(
//             data.map((d) => [
//               d.districtId,
//               { value: d.districtId, label: d.districtName },
//             ])
//           ).values(),
//         ];
//         setDistricts(uniqueDistricts);
//       } catch {
//         setError("Failed to fetch centers");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCenters();
//   }, []);

//   /* ---------------- UPDATE ATTENDANCE ---------------- */
//   const handleUpdateAttendance = async () => {
//     if (!selectedCenter || !attendanceCount) {
//       return setError("Please select center and enter attendance count");
//     }

//     setSaving(true);
//     setError(null);
//     setSuccess(null);

//     const reqBody = {
//       id: selectedCenter.value,
//       attendanceCount,
//     };

//     try {
//       await updateExaminationCentersAndCapacity(reqBody);

//       setSuccess("Attendance count updated successfully");

//       setCenters((prev) =>
//         prev.map((c) =>
//           c._id === selectedCenter.value
//             ? { ...c, attendanceCount }
//             : c
//         )
//       );
//     } catch {
//       setError("Failed to update attendance count");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ---------------- EXCEL DOWNLOAD ---------------- */
//   const downloadExcel = () => {
//     const excelData = centers.map((c, index) => ({
//       "S.No": index + 1,
//       District: c.districtName,
//       Block: c.blockName,
//       "Center Code": c.examinationVenueCode,
//       "Center Name": c.examinationVenue,
//       Capacity: c.capacity,
//       "Attendance Count": c.attendanceCount || "",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const file = new Blob([excelBuffer], {
//       type: "application/octet-stream",
//     });

//     saveAs(file, "Center_Attendance_Report.xlsx");
//   };

//   return (
//     <Container className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
//           <h5 className="mb-0">Update Center Attendance Count</h5>

//           <Button
//             variant="light"
//             size="sm"
//             onClick={() => setShowAttendanceTable(!showAttendanceTable)}
//           >
//             <FaEye className="me-2" />
//             {showAttendanceTable ? "Hide Attendance" : "View Attendance"}
//           </Button>
//         </Card.Header>

//         <Card.Body>
//           {error && <Alert variant="danger">{error}</Alert>}
//           {success && <Alert variant="success">{success}</Alert>}

//           {loading ? (
//             <div className="text-center">
//               <Spinner animation="border" />
//             </div>
//           ) : (
//             <>
//               {/* ---------------- UPDATE FORM ---------------- */}
//               <Row className="mb-3">
//                 <Col md={4}>
//                   <Form.Label>District</Form.Label>
//                   <Select
//                     options={districts}
//                     isClearable
//                     placeholder="Select District"
//                     onChange={(d) => {
//                       setSelectedDistrict(d);
//                       setSelectedBlock(null);
//                       setSelectedCenter(null);
//                       setAttendanceCount("");
//                       setSuccess(null);

//                       if (d) {
//                         const blockData = centers
//                           .filter((c) => c.districtId === d.value)
//                           .map((c) => ({
//                             value: c.blockId,
//                             label: c.blockName,
//                           }));

//                         setBlocks([
//                           ...new Map(
//                             blockData.map((b) => [b.value, b])
//                           ).values(),
//                         ]);
//                       } else {
//                         setBlocks([]);
//                       }
//                     }}
//                     value={selectedDistrict}
//                   />
//                 </Col>

//                 <Col md={4}>
//                   <Form.Label>Block</Form.Label>
//                   <Select
//                     options={blocks}
//                     isClearable
//                     isDisabled={!selectedDistrict}
//                     placeholder="Select Block"
//                     onChange={(b) => {
//                       setSelectedBlock(b);
//                       setSelectedCenter(null);
//                       setAttendanceCount("");
//                       setSuccess(null);

//                       if (b && selectedDistrict) {
//                         const centerData = centers
//                           .filter(
//                             (c) =>
//                               c.blockId === b.value &&
//                               c.districtId === selectedDistrict.value
//                           )
//                           .map((c) => ({
//                             value: c._id,
//                             label: c.examinationVenue,
//                             attendanceCount: c.attendanceCount || "",
//                           }));

//                         setFilteredCenters(centerData);
//                       } else {
//                         setFilteredCenters([]);
//                       }
//                     }}
//                     value={selectedBlock}
//                   />
//                 </Col>

//                 <Col md={4}>
//                   <Form.Label>Examination Center</Form.Label>
//                   <Select
//                     options={filteredCenters}
//                     isClearable
//                     isDisabled={!selectedBlock}
//                     placeholder="Select Center"
//                     onChange={(center) => {
//                       setSelectedCenter(center);
//                       setAttendanceCount(center?.attendanceCount || "");
//                       setSuccess(null);
//                     }}
//                     value={selectedCenter}
//                   />
//                 </Col>
//               </Row>

//               {selectedCenter && (
//                 <Row className="mt-3">
//                   <Col md={6}>
//                     <Form.Control
//                       type="number"
//                       placeholder="Attendance Count"
//                       value={attendanceCount}
//                       onChange={(e) =>
//                         setAttendanceCount(e.target.value)
//                       }
//                     />
//                   </Col>
//                   <Col md={6}>
//                     <Button
//                       variant="success"
//                       onClick={handleUpdateAttendance}
//                       disabled={saving}
//                     >
//                       <FaSave className="me-2" />
//                       Update Attendance
//                     </Button>
//                   </Col>
//                 </Row>
//               )}

//               {/* ---------------- ATTENDANCE TABLE ---------------- */}
//               {showAttendanceTable && (
//                 <>
//                   <hr />
//                   <div className="d-flex justify-content-between mb-2">
//                     <h6>District / Block Wise Attendance</h6>
//                     <Button
//                       variant="outline-success"
//                       size="sm"
//                       onClick={downloadExcel}
//                     >
//                       <FaDownload className="me-2" />
//                       Download Excel
//                     </Button>
//                   </div>

//                   <Table bordered hover size="sm">
//                     <thead className="table-light">
//                       <tr>
//                         <th>#</th>
//                         <th>District</th>
//                         <th>Block</th>
//                         <th>Center Code</th>
//                         <th>Center Name</th>
//                         <th>Capacity</th>
//                         <th>Attendance</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {centers.map((c, i) => (
//                         <tr key={c._id}>
//                           <td>{i + 1}</td>
//                           <td>{c.districtName}</td>
//                           <td>{c.blockName}</td>
//                           <td>{c.examinationVenueCode}</td>
//                           <td>{c.examinationVenue}</td>
//                           <td>{c.capacity}</td>
//                           <td>{c.attendanceCount || "-"}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </>
//               )}
//             </>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };











// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Card,
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Table,
// } from "react-bootstrap";
// import Select from "react-select";
// import { FaSave, FaDownload } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import {
//   GetCentersDataByExaminationAndExamType,
//   updateExaminationCentersAndCapacity,
// } from "../../services/ExaminationVenue/ExaminationVenueServices";

// export const UpdateCenterAttendanceCount = () => {
//   const [centers, setCenters] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [blocks, setBlocks] = useState([]);
//   const [filteredCenters, setFilteredCenters] = useState([]);

//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedCenter, setSelectedCenter] = useState(null);

//   const [attendanceCount, setAttendanceCount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   /* ---------------- FETCH CENTERS ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamType();
//         const data = res.data || [];
//         setCenters(data);

//         const uniqueDistricts = [
//           ...new Map(
//             data.map((d) => [
//               d.districtId,
//               { value: d.districtId, label: d.districtName },
//             ])
//           ).values(),
//         ];
//         setDistricts(uniqueDistricts);
//       } catch {
//         setError("Failed to fetch centers");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCenters();
//   }, []);

//   /* ---------------- SORTED CENTERS (DISTRICT → BLOCK) ---------------- */
//   const sortedCenters = useMemo(() => {
//     return [...centers].sort((a, b) => {
//       const districtCompare = (a.districtName || "").localeCompare(
//         b.districtName || ""
//       );
//       if (districtCompare !== 0) return districtCompare;

//       return (a.blockName || "").localeCompare(b.blockName || "");
//     });
//   }, [centers]);

//   /* ---------------- UPDATE ATTENDANCE ---------------- */
//   const handleUpdateAttendance = async () => {
//     if (!selectedCenter || !attendanceCount) {
//       return setError("Please select center and enter attendance count");
//     }

//     setSaving(true);
//     setError(null);
//     setSuccess(null);

//     const reqBody = {
//       id: selectedCenter.value,
//       attendanceCount,
//     };

//     try {
//       await updateExaminationCentersAndCapacity(reqBody);

//       setSuccess("Attendance count updated successfully");

//       setCenters((prev) =>
//         prev.map((c) =>
//           c._id === selectedCenter.value
//             ? { ...c, attendanceCount }
//             : c
//         )
//       );
//     } catch {
//       setError("Failed to update attendance count");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ---------------- EXCEL DOWNLOAD ---------------- */
//   const downloadExcel = () => {
//     const excelData = sortedCenters.map((c, index) => ({
//       "S.No": index + 1,
//       District: c.districtName,
//       Block: c.blockName,
//       "Center Code": c.examinationVenueCode,
//       "Center Name": c.examinationVenue,
//       Capacity: c.capacity,
//       "Attendance Count": c.attendanceCount || "",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const file = new Blob([excelBuffer], {
//       type: "application/octet-stream",
//     });

//     saveAs(file, "Center_Attendance_Report.xlsx");
//   };

//   return (
//     <Container className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white">
//           <h5 className="mb-0">Update Center Attendance Count</h5>
//         </Card.Header>

//         <Card.Body>
//           {error && <Alert variant="danger">{error}</Alert>}
//           {success && <Alert variant="success">{success}</Alert>}

//           {loading ? (
//             <div className="text-center">
//               <Spinner animation="border" />
//             </div>
//           ) : (
//             <>
//               {/* ---------------- UPDATE FORM ---------------- */}
//               <Row className="mb-3">
//                 <Col md={4}>
//                   <Form.Label>District</Form.Label>
//                   <Select
//                     options={districts}
//                     isClearable
//                     placeholder="Select District"
//                     onChange={(d) => {
//                       setSelectedDistrict(d);
//                       setSelectedBlock(null);
//                       setSelectedCenter(null);
//                       setAttendanceCount("");
//                       setSuccess(null);

//                       if (d) {
//                         const blockData = centers
//                           .filter((c) => c.districtId === d.value)
//                           .map((c) => ({
//                             value: c.blockId,
//                             label: c.blockName,
//                           }));

//                         setBlocks([
//                           ...new Map(
//                             blockData.map((b) => [b.value, b])
//                           ).values(),
//                         ]);
//                       } else {
//                         setBlocks([]);
//                       }
//                     }}
//                     value={selectedDistrict}
//                   />
//                 </Col>

//                 <Col md={4}>
//                   <Form.Label>Block</Form.Label>
//                   <Select
//                     options={blocks}
//                     isClearable
//                     isDisabled={!selectedDistrict}
//                     placeholder="Select Block"
//                     onChange={(b) => {
//                       setSelectedBlock(b);
//                       setSelectedCenter(null);
//                       setAttendanceCount("");
//                       setSuccess(null);

//                       if (b && selectedDistrict) {
//                         const centerData = centers
//                           .filter(
//                             (c) =>
//                               c.blockId === b.value &&
//                               c.districtId === selectedDistrict.value
//                           )
//                           .map((c) => ({
//                             value: c._id,
//                             label: c.examinationVenue,
//                             attendanceCount: c.attendanceCount || "",
//                           }));

//                         setFilteredCenters(centerData);
//                       } else {
//                         setFilteredCenters([]);
//                       }
//                     }}
//                     value={selectedBlock}
//                   />
//                 </Col>

//                 <Col md={4}>
//                   <Form.Label>Examination Center</Form.Label>
//                   <Select
//                     options={filteredCenters}
//                     isClearable
//                     isDisabled={!selectedBlock}
//                     placeholder="Select Center"
//                     onChange={(center) => {
//                       setSelectedCenter(center);
//                       setAttendanceCount(center?.attendanceCount || "");
//                       setSuccess(null);
//                     }}
//                     value={selectedCenter}
//                   />
//                 </Col>
//               </Row>

//               {selectedCenter && (
//                 <Row className="mt-3">
//                   <Col md={6}>
//                     <Form.Control
//                       type="number"
//                       placeholder="Attendance Count"
//                       value={attendanceCount}
//                       onChange={(e) =>
//                         setAttendanceCount(e.target.value)
//                       }
//                     />
//                   </Col>
//                   <Col md={6}>
//                     <Button
//                       variant="success"
//                       onClick={handleUpdateAttendance}
//                       disabled={saving}
//                     >
//                       <FaSave className="me-2" />
//                       Update Attendance
//                     </Button>
//                   </Col>
//                 </Row>
//               )}

//               {/* ---------------- ATTENDANCE TABLE ---------------- */}
//               <hr />

//               <div className="d-flex justify-content-between mb-2">
//                 <h6>District / Block Wise Attendance</h6>
//                 <Button
//                   variant="outline-success"
//                   size="sm"
//                   onClick={downloadExcel}
//                 >
//                   <FaDownload className="me-2" />
//                   Download Excel
//                 </Button>
//               </div>

//               <Table bordered hover size="sm">
//                 <thead className="table-light">
//                   <tr>
//                     <th>#</th>
//                     <th>District</th>
//                     <th>Block</th>
//                     <th>Center Code</th>
//                     <th>Center Name</th>
//                     <th>Capacity</th>
//                     <th>Attendance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sortedCenters.map((c, i) => (
//                     <tr key={c._id}>
//                       <td>{i + 1}</td>
//                       <td>{c.districtName}</td>
//                       <td>{c.blockName}</td>
//                       <td>{c.examinationVenueCode}</td>
//                       <td>{c.examinationVenue}</td>
//                       <td>{c.capacity}</td>
//                       <td>{c.attendanceCount || "-"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };





// import React, { useEffect, useState, useMemo, useRef } from "react";
// import {
//   Card,
//   Container,
//   Row,
//   Col,
//   Form,
//   Spinner,
//   Table,
//   Button,
// } from "react-bootstrap";
// import { FaDownload } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import {
//   GetCentersDataByExaminationAndExamType,
//   updateExaminationCentersAndCapacity,
// } from "../../services/ExaminationVenue/ExaminationVenueServices";

// export const UpdateCenterAttendanceCount = () => {
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const debounceRef = useRef({});

//   const [filters, setFilters] = useState({
//     district: "",
//     block: "",
//     centerCode: "",
//     centerName: "",
//   });

//   /* ---------------- FETCH DATA ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamType();
//         setCenters(res.data || []);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCenters();
//   }, []);

//   /* ---------------- SORT + FILTER ---------------- */
//   const filteredCenters = useMemo(() => {
//     return [...centers]
//       .filter((c) => {
//         return (
//           (!filters.district ||
//             c.districtName
//               ?.toLowerCase()
//               .includes(filters.district.toLowerCase())) &&
//           (!filters.block ||
//             c.blockName
//               ?.toLowerCase()
//               .includes(filters.block.toLowerCase())) &&
//           (!filters.centerCode ||
//             c.examinationVenueCode
//               ?.toLowerCase()
//               .includes(filters.centerCode.toLowerCase())) &&
//           (!filters.centerName ||
//             c.examinationVenue
//               ?.toLowerCase()
//               .includes(filters.centerName.toLowerCase()))
//         );
//       })
//       .sort((a, b) => {
//         const d = (a.districtName || "").localeCompare(
//           b.districtName || ""
//         );
//         if (d !== 0) return d;
//         return (a.blockName || "").localeCompare(b.blockName || "");
//       });
//   }, [centers, filters]);

//   /* ---------------- REAL TIME UPDATE (DEBOUNCED) ---------------- */
//   const handleAttendanceChange = (centerId, value) => {
//     // only digits
//     if (!/^\d*$/.test(value)) return;

//     // max 999
//     if (value !== "" && Number(value) > 999) return;

//     // update UI instantly
//     setCenters((prev) =>
//       prev.map((c) =>
//         c._id === centerId ? { ...c, attendanceCount: value } : c
//       )
//     );

//     // debounce API call
//     if (debounceRef.current[centerId]) {
//       clearTimeout(debounceRef.current[centerId]);
//     }

//     debounceRef.current[centerId] = setTimeout(() => {
//       updateExaminationCentersAndCapacity({
//         id: centerId,
//         attendanceCount: value,
//       }).catch(() => {});
//     }, 600);
//   };

//   /* ---------------- EXCEL ---------------- */
//   const downloadExcel = () => {
//     const excelData = filteredCenters.map((c, i) => ({
//       "S.No": i + 1,
//       District: c.districtName,
//       Block: c.blockName,
//       "Center Code": c.examinationVenueCode,
//       "Center Name": c.examinationVenue,
//       Capacity: c.capacity,
//       Attendance: c.attendanceCount || "",
//     }));

//     const ws = XLSX.utils.json_to_sheet(excelData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Attendance");

//     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(new Blob([buffer]), "Center_Attendance_Report.xlsx");
//   };

//   return (
//     <Container className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white">
//           <h5 className="mb-0">Update Center Attendance Count</h5>
//         </Card.Header>

//         <Card.Body>
//           {/* ---------------- FILTERS ---------------- */}
//           <Row className="mb-3">
//             <Col md={3}>
//               <Form.Control
//                 placeholder="Filter District"
//                 onChange={(e) =>
//                   setFilters({ ...filters, district: e.target.value })
//                 }
//               />
//             </Col>
//             <Col md={3}>
//               <Form.Control
//                 placeholder="Filter Block"
//                 onChange={(e) =>
//                   setFilters({ ...filters, block: e.target.value })
//                 }
//               />
//             </Col>
//             <Col md={3}>
//               <Form.Control
//                 placeholder="Filter Center Code"
//                 onChange={(e) =>
//                   setFilters({ ...filters, centerCode: e.target.value })
//                 }
//               />
//             </Col>
//             <Col md={3}>
//               <Form.Control
//                 placeholder="Filter Center Name"
//                 onChange={(e) =>
//                   setFilters({ ...filters, centerName: e.target.value })
//                 }
//               />
//             </Col>
//           </Row>

//           {/* ---------------- TABLE ---------------- */}
//           {loading ? (
//             <Spinner animation="border" />
//           ) : (
//             <>
//               <div className="d-flex justify-content-between mb-2">
//                 <h6>District / Block Wise Attendance</h6>
//                 <Button size="sm" onClick={downloadExcel}>
//                   <FaDownload className="me-2" />
//                   Download Excel
//                 </Button>
//               </div>

//               <Table bordered hover size="sm">
//                 <thead className="table-light">
//                   <tr>
//                     <th>#</th>
//                     <th>District</th>
//                     <th>Block</th>
//                     <th>Center Code</th>
//                     <th>Center Name</th>
//                     <th>Capacity</th>
//                     <th style={{ width: 160 }}>Attendance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCenters.map((c, i) => (
//                     <tr key={c._id}>
//                       <td>{i + 1}</td>
//                       <td>{c.districtName}</td>
//                       <td>{c.blockName}</td>
//                       <td>{c.examinationVenueCode}</td>
//                       <td>{c.examinationVenue}</td>
//                       <td>{c.capacity}</td>
//                       <td>
//                         <Form.Control
//                           type="text"
//                           size="sm"
//                           inputMode="numeric"
//                           maxLength={3}
//                           value={c.attendanceCount || ""}
//                           onChange={(e) =>
//                             handleAttendanceChange(
//                               c._id,
//                               e.target.value
//                             )
//                           }
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };






// import React, { useEffect, useState, useMemo, useRef } from "react";
// import {
//   Card,
//   Container,
//   Row,
//   Col,
//   Form,
//   Spinner,
//   Table,
//   Button,
// } from "react-bootstrap";
// import Select from "react-select";
// import { FaDownload } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import {
//   GetCentersDataByExaminationAndExamType,
//   updateExaminationCentersAndCapacity,
// } from "../../services/ExaminationVenue/ExaminationVenueServices";

// export const UpdateCenterAttendanceCount = () => {
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const debounceRef = useRef({});

//   const [filters, setFilters] = useState({
//     district: null,
//     block: null,
//     centerCode: null,
//     centerName: null,
//   });

//   /* ---------------- FETCH DATA ---------------- */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       setLoading(true);
//       try {
//         const res = await GetCentersDataByExaminationAndExamType();
//         setCenters(res.data || []);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCenters();
//   }, []);

//   /* ---------------- DROPDOWN OPTIONS ---------------- */
//   const districtOptions = useMemo(() => {
//     return [
//       ...new Map(
//         centers
//           .filter((c) => c.districtName)
//           .map((c) => [
//             c.districtName,
//             { label: c.districtName, value: c.districtName },
//           ])
//       ).values(),
//     ];
//   }, [centers]);

//   const blockOptions = useMemo(() => {
//     return [
//       ...new Map(
//         centers
//           .filter(
//             (c) =>
//               (!filters.district ||
//                 c.districtName === filters.district.value) &&
//               c.blockName
//           )
//           .map((c) => [
//             c.blockName,
//             { label: c.blockName, value: c.blockName },
//           ])
//       ).values(),
//     ];
//   }, [centers, filters.district]);

//   const centerCodeOptions = useMemo(() => {
//     return [
//       ...new Map(
//         centers
//           .filter(
//             (c) =>
//               (!filters.district ||
//                 c.districtName === filters.district.value) &&
//               (!filters.block || c.blockName === filters.block.value) &&
//               c.examinationVenueCode
//           )
//           .map((c) => [
//             c.examinationVenueCode,
//             {
//               label: c.examinationVenueCode,
//               value: c.examinationVenueCode,
//             },
//           ])
//       ).values(),
//     ];
//   }, [centers, filters.district, filters.block]);

//   const centerNameOptions = useMemo(() => {
//     return [
//       ...new Map(
//         centers
//           .filter(
//             (c) =>
//               (!filters.district ||
//                 c.districtName === filters.district.value) &&
//               (!filters.block || c.blockName === filters.block.value) &&
//               (!filters.centerCode ||
//                 c.examinationVenueCode ===
//                   filters.centerCode.value) &&
//               c.examinationVenue
//           )
//           .map((c) => [
//             c.examinationVenue,
//             {
//               label: c.examinationVenue,
//               value: c.examinationVenue,
//             },
//           ])
//       ).values(),
//     ];
//   }, [centers, filters]);

//   /* ---------------- FILTERED DATA ---------------- */
//   const filteredCenters = useMemo(() => {
//     return centers.filter((c) => {
//       return (
//         (!filters.district ||
//           c.districtName === filters.district.value) &&
//         (!filters.block || c.blockName === filters.block.value) &&
//         (!filters.centerCode ||
//           c.examinationVenueCode === filters.centerCode.value) &&
//         (!filters.centerName ||
//           c.examinationVenue === filters.centerName.value)
//       );
//     });
//   }, [centers, filters]);

//   /* ---------------- REAL TIME UPDATE (DEBOUNCED) ---------------- */
//   const handleAttendanceChange = (centerId, value) => {
//     if (!/^\d*$/.test(value)) return;
//     if (value !== "" && Number(value) > 999) return;

//     setCenters((prev) =>
//       prev.map((c) =>
//         c._id === centerId ? { ...c, attendanceCount: value } : c
//       )
//     );

//     if (debounceRef.current[centerId]) {
//       clearTimeout(debounceRef.current[centerId]);
//     }

//     debounceRef.current[centerId] = setTimeout(() => {
//       updateExaminationCentersAndCapacity({
//         id: centerId,
//         attendanceCount: value,
//       }).catch(() => {});
//     }, 600);
//   };

//   /* ---------------- EXCEL ---------------- */
//   const downloadExcel = () => {
//     const excelData = filteredCenters.map((c, i) => ({
//       "S.No": i + 1,
//       District: c.districtName,
//       Block: c.blockName,
//       "Center Code": c.examinationVenueCode,
//       "Center Name": c.examinationVenue,
//       Capacity: c.capacity,
//       Attendance: c.attendanceCount || "",
//     }));

//     const ws = XLSX.utils.json_to_sheet(excelData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Attendance");

//     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(new Blob([buffer]), "Center_Attendance_Report.xlsx");
//   };

//   return (
//     <Container className="py-4">
//       <Card className="shadow">
//         <Card.Header className="bg-primary text-white">
//           <h5 className="mb-0">Update Center Attendance Count</h5>
//         </Card.Header>

//         <Card.Body>
//           {/* ---------------- FILTERS ---------------- */}
//           <Row className="mb-3">
//             <Col md={3}>
//               <Select
//                 placeholder="Select District"
//                 options={districtOptions}
//                 isClearable
//                 value={filters.district}
//                 onChange={(v) =>
//                   setFilters({
//                     district: v,
//                     block: null,
//                     centerCode: null,
//                     centerName: null,
//                   })
//                 }
//               />
//             </Col>

//             <Col md={3}>
//               <Select
//                 placeholder="Select Block"
//                 options={blockOptions}
//                 isClearable
//                 isDisabled={!filters.district}
//                 value={filters.block}
//                 onChange={(v) =>
//                   setFilters({
//                     ...filters,
//                     block: v,
//                     centerCode: null,
//                     centerName: null,
//                   })
//                 }
//               />
//             </Col>

//             <Col md={3}>
//               <Select
//                 placeholder="Select Center Code"
//                 options={centerCodeOptions}
//                 isClearable
//                 isDisabled={!filters.block}
//                 value={filters.centerCode}
//                 onChange={(v) =>
//                   setFilters({
//                     ...filters,
//                     centerCode: v,
//                     centerName: null,
//                   })
//                 }
//               />
//             </Col>

//             <Col md={3}>
//               <Select
//                 placeholder="Select Center Name"
//                 options={centerNameOptions}
//                 isClearable
//                 isDisabled={!filters.centerCode}
//                 value={filters.centerName}
//                 onChange={(v) =>
//                   setFilters({ ...filters, centerName: v })
//                 }
//               />
//             </Col>
//           </Row>

//           {/* ---------------- TABLE ---------------- */}
//           {loading ? (
//             <Spinner animation="border" />
//           ) : (
//             <>
//               <div className="d-flex justify-content-between mb-2">
//                 <h6>District / Block Wise Attendance</h6>
//                 <Button size="sm" onClick={downloadExcel}>
//                   <FaDownload className="me-2" />
//                   Download Excel
//                 </Button>
//               </div>

//               <Table bordered hover size="sm">
//                 <thead className="table-light">
//                   <tr>
//                     <th>#</th>
//                     <th>District</th>
//                     <th>Block</th>
//                     <th>Center Code</th>
//                     <th>Center Name</th>
//                     <th>Capacity</th>
//                     <th style={{ width: 160 }}>Attendance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCenters.map((c, i) => (
//                     <tr key={c._id}>
//                       <td>{i + 1}</td>
//                       <td>{c.districtName}</td>
//                       <td>{c.blockName}</td>
//                       <td>{c.examinationVenueCode}</td>
//                       <td>{c.examinationVenue}</td>
//                       <td>{c.capacity}</td>
//                       <td>
//                         <Form.Control
//                           type="text"
//                           size="sm"
//                           inputMode="numeric"
//                           maxLength={3}
//                           value={c.attendanceCount || ""}
//                           onChange={(e) =>
//                             handleAttendanceChange(
//                               c._id,
//                               e.target.value
//                             )
//                           }
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };








import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Table,
  Button,
} from "react-bootstrap";
import Select from "react-select";
import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  GetCentersDataByExaminationAndExamType,
  updateExaminationCentersAndCapacity,
} from "../../services/ExaminationVenue/ExaminationVenueServices";

export const UpdateCenterAttendanceCount = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef({});

  const [filters, setFilters] = useState({
    district: null,
    block: null,
    centerName: null,
  });

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      try {
        const res = await GetCentersDataByExaminationAndExamType();
        setCenters(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  /* ---------------- DROPDOWN OPTIONS ---------------- */
  const districtOptions = useMemo(() => {
    return [
      ...new Map(
        centers
          .filter((c) => c.districtName)
          .map((c) => [
            c.districtName,
            { label: c.districtName, value: c.districtName },
          ])
      ).values(),
    ];
  }, [centers]);

  const blockOptions = useMemo(() => {
    return [
      ...new Map(
        centers
          .filter(
            (c) =>
              (!filters.district ||
                c.districtName === filters.district.value) &&
              c.blockName
          )
          .map((c) => [
            c.blockName,
            { label: c.blockName, value: c.blockName },
          ])
      ).values(),
    ];
  }, [centers, filters.district]);

  const centerNameOptions = useMemo(() => {
    return [
      ...new Map(
        centers
          .filter(
            (c) =>
              (!filters.district ||
                c.districtName === filters.district.value) &&
              (!filters.block || c.blockName === filters.block.value) &&
              c.examinationVenue
          )
          .map((c) => [
            c.examinationVenue,
            {
              label: c.examinationVenue,
              value: c.examinationVenue,
            },
          ])
      ).values(),
    ];
  }, [centers, filters]);

  /* ---------------- FILTERED & SORTED DATA ---------------- */
  const filteredCenters = useMemo(() => {
    return centers
      .filter((c) => {
        return (
          (!filters.district || c.districtName === filters.district.value) &&
          (!filters.block || c.blockName === filters.block.value) &&
          (!filters.centerName || c.examinationVenue === filters.centerName.value)
        );
      })
      .sort((a, b) => {
        // Sort by district first
        if (a.districtName < b.districtName) return -1;
        if (a.districtName > b.districtName) return 1;
        // Then sort by block
        if (a.blockName < b.blockName) return -1;
        if (a.blockName > b.blockName) return 1;
        return 0;
      });
  }, [centers, filters]);

  /* ---------------- REAL TIME UPDATE (DEBOUNCED) ---------------- */
  const handleAttendanceChange = (centerId, value) => {
    if (!/^\d*$/.test(value)) return;
    if (value !== "" && Number(value) > 999) return;

    setCenters((prev) =>
      prev.map((c) =>
        c._id === centerId ? { ...c, attendanceCount: value } : c
      )
    );

    if (debounceRef.current[centerId]) {
      clearTimeout(debounceRef.current[centerId]);
    }

    debounceRef.current[centerId] = setTimeout(() => {
      updateExaminationCentersAndCapacity({
        id: centerId,
        attendanceCount: value,
      }).catch(() => {});
    }, 600);
  };

  /* ---------------- EXCEL ---------------- */
  const downloadExcel = () => {
    const excelData = filteredCenters.map((c, i) => ({
      "S.No": i + 1,
      District: c.districtName,
      Block: c.blockName,
      "Center Code": c.examinationVenueCode,
      "Center Name": c.examinationVenue,
      Capacity: c.capacity,
      Attendance: c.attendanceCount || "",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "Center_Attendance_Report.xlsx");
  };

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Update Center Attendance Count</h5>
        </Card.Header>

        <Card.Body>
          {/* ---------------- FILTERS ---------------- */}
          <Row className="mb-3">
            <Col md={4}>
              <Select
                placeholder="Select District"
                options={districtOptions}
                isClearable
                value={filters.district}
                onChange={(v) =>
                  setFilters({
                    district: v,
                    block: null,
                    centerName: null,
                  })
                }
              />
            </Col>

            <Col md={4}>
              <Select
                placeholder="Select Block"
                options={blockOptions}
                isClearable
                isDisabled={!filters.district}
                value={filters.block}
                onChange={(v) =>
                  setFilters({
                    ...filters,
                    block: v,
                    centerName: null,
                  })
                }
              />
            </Col>

            <Col md={4}>
              <Select
                placeholder="Select Center Name"
                options={centerNameOptions}
                isClearable
                isDisabled={!filters.block}
                value={filters.centerName}
                onChange={(v) =>
                  setFilters({ ...filters, centerName: v })
                }
              />
            </Col>
          </Row>

          {/* ---------------- TABLE ---------------- */}
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <div className="d-flex justify-content-between mb-2">
                <h6>District / Block Wise Attendance</h6>
                <Button size="sm" onClick={downloadExcel}>
                  <FaDownload className="me-2" />
                  Download Excel
                </Button>
              </div>

              <Table bordered hover size="sm">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>District</th>
                    <th>Block</th>
                    <th>Center Code</th>
                    <th>Center Name</th>
                    <th>Capacity</th>
                    <th style={{ width: 160 }}>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCenters.map((c, i) => (
                    <tr key={c._id}>
                      <td>{i + 1}</td>
                      <td>{c.districtName}</td>
                      <td>{c.blockName}</td>
                      <td>{c.examinationVenueCode}</td>
                      <td>{c.examinationVenue}</td>
                      <td>{c.capacity}</td>
                      <td>
                        <Form.Control
                          type="text"
                          size="sm"
                          inputMode="numeric"
                          maxLength={3}
                          value={c.attendanceCount || ""}
                          onChange={(e) =>
                            handleAttendanceChange(
                              c._id,
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
