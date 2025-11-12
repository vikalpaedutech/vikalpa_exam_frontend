// import React, { useContext, useState, useEffect } from "react";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Button,
//   Alert,
//   Spinner,
//   Table,
//   Form,
// } from "react-bootstrap";
// import Select from "react-select";
// import { saveAs } from "file-saver";
// import { createStudent, updateStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";
// import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
// import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi.js";
// import { UserContext } from "../NewContextApis/UserContext.js";


// export const BulkRegistrations = () => {


//   // Context
//   const context = useContext(DistrictBlockSchoolDependentDropDownContext);
//   const {
//     districtContext,
//     blockContext,
//     schoolContext,
//   } = context || {};

//     const { userData, setUserData } = useContext(UserContext); // ✅ use context


//   // State for form selections
//   const [selectedClass, setSelectedClass] = useState("");
//   const [csvFile, setCsvFile] = useState(null);
//   const [uploadResults, setUploadResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);

//   // Options
//   const classOptions = [
//     { value: "8", label: "Class 8" },
//     { value: "10", label: "Class 10" },
//   ];

//   // Check if download template should be enabled
//   const isDownloadEnabled = selectedClass && districtContext && blockContext && schoolContext;

//   // Generate and download CSV template
//   const downloadTemplate = () => {
//     if (!isDownloadEnabled) return;

//     const headers = [
//       "srn",
//       "name",
//       "father",
//       "mother",
//       "dob",
//       "gender",
//       "category",
//       "aadhar",
//       "mobile",
//       "whatsapp",
//       "houseNumber",
//       "cityTownVillage",
//       "addressBlock",
//       "addressDistrict",
//       "addressState",
//       "previousClassAnnualExamPercentage",
//     ];

//     // Sample data row with selected values
//     const sampleData = [
//       "1234567890", // srn
//       "STUDENT_NAME", // name
//       "FATHER_NAME", // father
//       "MOTHER_NAME", // mother
//       "2008-01-01", // dob
//       "Male", // gender
//       "GEN", // category
//       "123456789012", // aadhar
//       "9876543210", // mobile
//       "9876543210", // whatsapp
//       "HNO-123", // houseNumber
//       "CITY_NAME", // cityTownVillage
//       "BLOCK_NAME", // addressBlock
//       "DISTRICT_NAME", // addressDistrict
//       "STATE_NAME", // addressState
//       "85.50", // previousClassAnnualExamPercentage
//     ];

//     let csvContent = headers.join(",") + "\n";
//     csvContent += sampleData.join(",") + "\n";

//     // Add note about school details
//     csvContent += "\n# NOTE: School details will be automatically filled from your selection:\n";
//     csvContent += `# Class: ${selectedClass}\n`;
//     csvContent += `# School District: ${districtContext?.label} (Code: ${districtContext?.value})\n`;
//     csvContent += `# School Block: ${blockContext?.label} (Code: ${blockContext?.value})\n`;
//     csvContent += `# School: ${schoolContext?.label} (Code: ${schoolContext?.value})\n`;

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
//     saveAs(blob, `bulk_registration_template_${selectedClass}.csv`);
//   };

//   // Parse CSV file
//   const parseCSV = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const csvText = e.target.result;
//         const lines = csvText.split("\n").filter(line => line.trim() && !line.startsWith("#"));

//         if (lines.length < 2) {
//           reject(new Error("CSV file must contain headers and at least one data row"));
//           return;
//         }

//         const headers = lines[0].split(",").map(h => h.trim());
//         const data = [];

//         for (let i = 1; i < lines.length; i++) {
//           const values = lines[i].split(",");
//           const row = {};

//           headers.forEach((header, index) => {
//             row[header] = values[index] ? values[index].trim() : "";
//           });

//           data.push(row);
//         }

//         resolve(data);
//       };
//       reader.onerror = () => reject(new Error("Failed to read file"));
//       reader.readAsText(file);
//     });
//   };

//   // Handle file upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setCsvFile(file);
//     }
//   };

//   // Sanitization functions (from original component)
//   const trim = (s) => (typeof s === "string" ? s.trim() : s);
//   const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();
//   const onlyDigits = (value, maxLen = 10) => String(value || "").replace(/\D+/g, "").slice(0, maxLen);
//   const onlyAlphaSpace = (value) => String(value || "").replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
//   const alphaNumUpper = (value, maxLen = 100) => String(value || "").replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen).trim().toUpperCase();
//   const sanitizePercentage = (value) => {
//     const v = String(value || "").trim();
//     const cleaned = v.replace(/[^0-9.]/g, "");
//     const parts = cleaned.split(".");
//     if (parts.length <= 1) return parts[0].slice(0, 3);
//     const integer = parts[0].slice(0, 3);
//     const decimal = parts[1].slice(0, 2);
//     return `${integer}.${decimal}`;
//   };

//   // Validate row data
//   const validateRow = (row, index) => {
//     const errors = [];

//     // Required fields validation
//     const requiredFields = ["srn", "name", "father", "mother", "dob", "gender", "category", "aadhar", "mobile", "whatsapp"];
//     requiredFields.forEach(field => {
//       if (!row[field] || String(row[field]).trim() === "") {
//         errors.push(`${field} is required`);
//       }
//     });

//     // SRN validation
//     if (row.srn && !/^\d{10}$/.test(row.srn)) {
//       errors.push("SRN must be exactly 10 digits");
//     }

//     // Name validations
//     ["name", "father", "mother"].forEach(field => {
//       if (row[field] && !/^[A-Za-z\s]+$/.test(row[field])) {
//         errors.push(`${field} must contain only alphabets and spaces`);
//       }
//     });

//     // Contact validation
//     if (row.mobile && !/^\d{10}$/.test(row.mobile)) {
//       errors.push("Mobile must be 10 digits");
//     }
//     if (row.whatsapp && !/^\d{10}$/.test(row.whatsapp)) {
//       errors.push("WhatsApp must be 10 digits");
//     }

//     // Aadhar validation
//     if (row.aadhar && !/^\d{8,20}$/.test(row.aadhar)) {
//       errors.push("Aadhar must be numeric (8-20 digits)");
//     }

//     // Percentage validation
//     if (row.previousClassAnnualExamPercentage && !/^\d{1,3}(\.\d{1,2})?$/.test(row.previousClassAnnualExamPercentage)) {
//       errors.push("Percentage must be valid (up to 3 digits with 2 decimals)");
//     }

//     return {
//       rowIndex: index + 1,
//       isValid: errors.length === 0,
//       errors: errors,
//       data: row
//     };
//   };

//   // Process bulk upload
//   const processBulkUpload = async () => {
//     if (!csvFile) {
//       setAlert({ type: "danger", message: "Please select a CSV file first." });
//       return;
//     }

//     setLoading(true);
//     setUploadResults([]);
//     setAlert(null);

//     try {
//       const csvData = await parseCSV(csvFile);
//       const validationResults = csvData.map((row, index) => validateRow(row, index));

//       // Show validation results immediately
//       setUploadResults(validationResults);

//       // Check if any rows are invalid
//       const invalidRows = validationResults.filter(result => !result.isValid);
//       if (invalidRows.length > 0) {
//         setAlert({ 
//           type: "warning", 
//           message: `${invalidRows.length} rows have validation errors. Please fix them before proceeding.` 
//         });
//         setLoading(false);
//         return;
//       }

//       // Process valid rows
//       const processResults = [];

//       for (let i = 0; i < validationResults.length; i++) {
//         const result = validationResults[i];

//         try {
//           const formData = new FormData();
//           const row = result.data;

//           // Generate slipId and registrationDate
//           const slipId = row.name.slice(0, 3).toUpperCase() + row.srn.slice(-5);
//           const registrationDate = new Date();

//           // Append basic student data
//           formData.append("slipId", trim(slipId));
//           formData.append("srn", trim(row.srn));
//           formData.append("name", toUpperTrim(row.name));
//           formData.append("father", toUpperTrim(row.father));
//           formData.append("mother", toUpperTrim(row.mother));
//           formData.append("dob", trim(row.dob));
//           formData.append("gender", trim(row.gender).toUpperCase());
//           formData.append("category", trim(row.category).toUpperCase());
//           formData.append("aadhar", trim(row.aadhar));
//           formData.append("mobile", trim(row.mobile));
//           formData.append("whatsapp", trim(row.whatsapp));
//           formData.append("registrationDate", registrationDate);
//           formData.append("isRegisteredBy", "Bulk Upload");

//           // Address data
//           formData.append("houseNumber", alphaNumUpper(row.houseNumber || ""));
//           formData.append("cityTownVillage", alphaNumUpper(row.cityTownVillage));
//           formData.append("addressBlock", alphaNumUpper(row.addressBlock));
//           formData.append("addressDistrict", alphaNumUpper(row.addressDistrict));
//           formData.append("addressState", alphaNumUpper(row.addressState));

//           // School data from context
//           formData.append("schoolDistrict", toUpperTrim(districtContext?.label));
//           formData.append("schoolDistrictCode", trim(districtContext?.value));
//           formData.append("schoolBlock", toUpperTrim(blockContext?.label));
//           formData.append("schoolBlockCode", trim(blockContext?.value));
//           formData.append("school", toUpperTrim(schoolContext?.label));
//           formData.append("schoolCode", trim(schoolContext?.value));

//           // Academic data
//           formData.append("previousClassAnnualExamPercentage", trim(row.previousClassAnnualExamPercentage));
//           formData.append("classOfStudent", trim(selectedClass));

//           // Create student
//           const response = await createStudent(formData);

//           processResults.push({
//             ...result,
//             status: "success",
//             message: "Student created successfully",
//             studentId: response.data?._id
//           });

//         } catch (error) {
//           processResults.push({
//             ...result,
//             status: "error",
//             message: error.response?.data?.message || error.message || "Failed to create student"
//           });
//         }

//         // Update results progressively
//         setUploadResults([...processResults]);
//       }

//       // Final summary
//       const successful = processResults.filter(r => r.status === "success").length;
//       const failed = processResults.filter(r => r.status === "error").length;

//       setAlert({
//         type: failed === 0 ? "success" : "warning",
//         message: `Bulk upload completed: ${successful} successful, ${failed} failed`
//       });

//     } catch (error) {
//       console.error("Bulk upload error:", error);
//       setAlert({
//         type: "danger",
//         message: error.message || "Failed to process CSV file"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container fluid className="py-3">
//       {alert && (
//         <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
//           {alert.message}
//         </Alert>
//       )}

//       <Row>
//         <Col lg={12}>
//           <Card className="mb-4">
//             <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//               Bulk Student Registration
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Select Class:</Form.Label>
//                     <Select
//                       value={classOptions.find(opt => opt.value === selectedClass)}
//                       options={classOptions}
//                       onChange={(opt) => setSelectedClass(opt ? opt.value : "")}
//                       placeholder="Choose class..."
//                     />
//                   </Form.Group>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>School Details:</Form.Label>
//                     <District_block_school_manual_school_name_dependentDropdown />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Row className="mt-3">
//                 <Col md={6}>
//                   <Button
//                     variant="outline-primary"
//                     onClick={downloadTemplate}
//                     disabled={!isDownloadEnabled}
//                     className="w-100"
//                   >
//                     Download CSV Template
//                   </Button>
//                   <small className="text-muted d-block mt-1">
//                     {!isDownloadEnabled && "Select class and school details to enable download"}
//                   </small>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Upload CSV File:</Form.Label>
//                     <Form.Control
//                       type="file"
//                       accept=".csv"
//                       onChange={handleFileUpload}
//                       disabled={loading}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               {csvFile && (
//                 <Row className="mt-3">
//                   <Col>
//                     <Button
//                       variant="primary"
//                       onClick={processBulkUpload}
//                       disabled={loading}
//                       className="w-100"
//                     >
//                       {loading ? (
//                         <>
//                           <Spinner animation="border" size="sm" /> Processing...
//                         </>
//                       ) : (
//                         "Start Bulk Upload"
//                       )}
//                     </Button>
//                   </Col>
//                 </Row>
//               )}
//             </Card.Body>
//           </Card>

//           {/* Results Table */}
//           {uploadResults.length > 0 && (
//             <Card>
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Upload Results
//               </Card.Header>
//               <Card.Body>
//                 <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                   <Table striped bordered hover size="sm">
//                     <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
//                       <tr>
//                         <th>Row</th>
//                         <th>SRN</th>
//                         <th>Name</th>
//                         <th>Status</th>
//                         <th>Message</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {uploadResults.map((result, index) => (
//                         <tr key={index}>
//                           <td>{result.rowIndex}</td>
//                           <td>{result.data.srn}</td>
//                           <td>{result.data.name}</td>
//                           <td>
//                             <span
//                               className={`badge ${
//                                 result.status === "success"
//                                   ? "bg-success"
//                                   : result.status === "error"
//                                   ? "bg-danger"
//                                   : result.isValid
//                                   ? "bg-warning"
//                                   : "bg-danger"
//                               }`}
//                             >
//                               {result.status === "success"
//                                 ? "Success"
//                                 : result.status === "error"
//                                 ? "Error"
//                                 : result.isValid
//                                 ? "Valid"
//                                 : "Invalid"}
//                             </span>
//                           </td>
//                           <td>
//                             {result.status === "success" && "Student created successfully"}
//                             {result.status === "error" && result.message}
//                             {!result.status && !result.isValid && result.errors.join(", ")}
//                             {!result.status && result.isValid && "Ready for upload"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               </Card.Body>
//             </Card>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };












// import React, { useContext, useState } from "react";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Button,
//   Alert,
//   Spinner,
//   Table,
//   Form,
// } from "react-bootstrap";
// import Select from "react-select";
// import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
// import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi.js";
// import { createStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

// export const BulkRegistrations = () => {
//   // Context
//   const context = useContext(DistrictBlockSchoolDependentDropDownContext);
//   const {
//     districtContext,
//     blockContext,
//     schoolContext,
//   } = context || {};

//   // State for form selections
//   const [selectedClass, setSelectedClass] = useState("");
//   const [csvFile, setCsvFile] = useState(null);
//   const [uploadResults, setUploadResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);

//   // Options
//   const classOptions = [
//     { value: "8", label: "Class 8" },
//     { value: "10", label: "Class 10" },
//   ];

//   // Check if download template should be enabled
//   const isDownloadEnabled = selectedClass && districtContext && blockContext && schoolContext;

//   // Generate and download CSV template
//   const downloadTemplate = () => {
//     if (!isDownloadEnabled) return;

//     const headers = [
//       "srn",
//       "name",
//       "father",
//       "mother",
//       "dob",
//       "gender",
//       "category",
//       "aadhar",
//       "mobile",
//       "whatsapp",
//       "houseNumber",
//       "cityTownVillage",
//       "addressBlock",
//       "addressDistrict",
//       "addressState",
//       "previousClassAnnualExamPercentage",
//     ];

//     // Sample data row with selected values (DD-MM-YYYY format for dob)
//     const sampleData = [
//       "1234567890", // srn
//       "STUDENT_NAME", // name
//       "FATHER_NAME", // father
//       "MOTHER_NAME", // mother
//       "01-01-2008", // dob in DD-MM-YYYY format
//       "Male", // gender
//       "GEN", // category
//       "123456789012", // aadhar
//       "9876543210", // mobile
//       "9876543210", // whatsapp
//       "HNO-123", // houseNumber
//       "CITY_NAME", // cityTownVillage
//       "BLOCK_NAME", // addressBlock
//       "DISTRICT_NAME", // addressDistrict
//       "STATE_NAME", // addressState
//       "85.50", // previousClassAnnualExamPercentage
//     ];

//     let csvContent = headers.join(",") + "\n";
//     csvContent += sampleData.join(",") + "\n";

//     // Add note about school details and date format
//     csvContent += "\n# NOTE: School details will be automatically filled from your selection:\n";
//     csvContent += `# Class: ${selectedClass}\n`;
//     csvContent += `# School District: ${districtContext?.label} (Code: ${districtContext?.value})\n`;
//     csvContent += `# School Block: ${blockContext?.label} (Code: ${blockContext?.value})\n`;
//     csvContent += `# School: ${schoolContext?.label} (Code: ${schoolContext?.value})\n`;
//     csvContent += "# IMPORTANT: Date of Birth (dob) must be in DD-MM-YYYY format (e.g., 01-01-2008)\n";

//     // Create download using Blob
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `bulk_registration_template_${selectedClass}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   // Parse CSV file with date handling
//   const parseCSV = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const csvText = e.target.result;
//           const lines = csvText.split("\n").filter(line => line.trim() && !line.startsWith("#"));

//           if (lines.length < 2) {
//             reject(new Error("CSV file must contain headers and at least one data row"));
//             return;
//           }

//           const headers = lines[0].split(",").map(h => h.trim());
//           const data = [];

//           for (let i = 1; i < lines.length; i++) {
//             const values = lines[i].split(",");
//             const row = {};

//             headers.forEach((header, index) => {
//               let value = values[index] ? values[index].trim() : "";

//               // Handle date format conversion for dob field (DD-MM-YYYY to ISO format)
//               if (header === 'dob' && value) {
//                 value = convertDDMMYYYYToISO(value);
//               }

//               row[header] = value;
//             });

//             data.push(row);
//           }

//           resolve(data);
//         } catch (error) {
//           reject(new Error("Error parsing CSV file: " + error.message));
//         }
//       };
//       reader.onerror = () => reject(new Error("Failed to read file"));
//       reader.readAsText(file);
//     });
//   };

//   // Convert DD-MM-YYYY to ISO format with T00:00:00.000+00:00
//   const convertDDMMYYYYToISO = (dateString) => {
//     try {
//       // Parse DD-MM-YYYY format
//       const parts = dateString.split('-');
//       if (parts.length !== 3) {
//         throw new Error("Invalid date format");
//       }

//       const day = parseInt(parts[0], 10);
//       const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
//       const year = parseInt(parts[2], 10);

//       // Create date in UTC to avoid timezone issues
//       const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

//       // Format to ISO string with timezone
//       const isoString = date.toISOString();

//       return isoString;
//     } catch (error) {
//       console.error("Date conversion error:", error);
//       return dateString; // Return original if conversion fails
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
//         setAlert({ type: "danger", message: "Please upload a valid CSV file" });
//         return;
//       }
//       setCsvFile(file);
//       setUploadResults([]);
//       setAlert(null);
//     }
//   };

//   // Sanitization functions
//   const trim = (s) => (typeof s === "string" ? s.trim() : s);
//   const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();
//   const onlyDigits = (value, maxLen = 10) => String(value || "").replace(/\D+/g, "").slice(0, maxLen);
//   const onlyAlphaSpace = (value) => String(value || "").replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
//   const alphaNumUpper = (value, maxLen = 100) => String(value || "").replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen).trim().toUpperCase();
//   const sanitizePercentage = (value) => {
//     const v = String(value || "").trim();
//     const cleaned = v.replace(/[^0-9.]/g, "");
//     const parts = cleaned.split(".");
//     if (parts.length <= 1) return parts[0].slice(0, 3);
//     const integer = parts[0].slice(0, 3);
//     const decimal = parts[1].slice(0, 2);
//     return `${integer}.${decimal}`;
//   };

//   // Validate row data
//   const validateRow = (row, index) => {
//     const errors = [];

//     // Required fields validation
//     const requiredFields = ["srn", "name", "father", "mother", "dob", "gender", "category", "aadhar", "mobile", "whatsapp"];
//     requiredFields.forEach(field => {
//       if (!row[field] || String(row[field]).trim() === "") {
//         errors.push(`${field} is required`);
//       }
//     });

//     // SRN validation
//     if (row.srn && !/^\d{10}$/.test(row.srn)) {
//       errors.push("SRN must be exactly 10 digits");
//     }

//     // Name validations
//     ["name", "father", "mother"].forEach(field => {
//       if (row[field] && !/^[A-Za-z\s]+$/.test(row[field])) {
//         errors.push(`${field} must contain only alphabets and spaces`);
//       }
//     });

//     // Contact validation
//     if (row.mobile && !/^\d{10}$/.test(row.mobile)) {
//       errors.push("Mobile must be 10 digits");
//     }
//     if (row.whatsapp && !/^\d{10}$/.test(row.whatsapp)) {
//       errors.push("WhatsApp must be 10 digits");
//     }

//     // Aadhar validation
//     if (row.aadhar && !/^\d{8,20}$/.test(row.aadhar)) {
//       errors.push("Aadhar must be numeric (8-20 digits)");
//     }

//     // Percentage validation
//     if (row.previousClassAnnualExamPercentage && !/^\d{1,3}(\.\d{1,2})?$/.test(row.previousClassAnnualExamPercentage)) {
//       errors.push("Percentage must be valid (up to 3 digits with 2 decimals)");
//     }

//     // Date validation
//     if (row.dob) {
//       try {
//         const date = new Date(row.dob);
//         if (isNaN(date.getTime())) {
//           errors.push("Invalid date format for DOB");
//         }
//       } catch (error) {
//         errors.push("Invalid date format for DOB");
//       }
//     }

//     return {
//       rowIndex: index + 1,
//       isValid: errors.length === 0,
//       errors: errors,
//       data: row
//     };
//   };

//   // Process bulk upload
//   const processBulkUpload = async () => {
//     if (!csvFile) {
//       setAlert({ type: "danger", message: "Please select a CSV file first." });
//       return;
//     }

//     setLoading(true);
//     setUploadResults([]);
//     setAlert(null);

//     try {
//       const csvData = await parseCSV(csvFile);
//       const validationResults = csvData.map((row, index) => validateRow(row, index));

//       // Show validation results immediately
//       setUploadResults(validationResults);

//       // Check if any rows are invalid
//       const invalidRows = validationResults.filter(result => !result.isValid);
//       if (invalidRows.length > 0) {
//         setAlert({ 
//           type: "warning", 
//           message: `${invalidRows.length} rows have validation errors. Please fix them before proceeding.` 
//         });
//         setLoading(false);
//         return;
//       }

//       // Process valid rows
//       const processResults = [];

//       for (let i = 0; i < validationResults.length; i++) {
//         const result = validationResults[i];

//         try {
//           const formData = new FormData();
//           const row = result.data;

//           // Generate slipId and registrationDate
//           const slipId = (row.name?.slice(0, 3) || "STU").toUpperCase() + (row.srn?.slice(-5) || "00000");
//           const registrationDate = new Date().toISOString();

//           // Append basic student data
//           formData.append("slipId", trim(slipId));
//           formData.append("srn", trim(row.srn));
//           formData.append("name", toUpperTrim(row.name));
//           formData.append("father", toUpperTrim(row.father));
//           formData.append("mother", toUpperTrim(row.mother));
//           formData.append("dob", row.dob); // Already converted to ISO format in parseCSV
//           formData.append("gender", trim(row.gender).toUpperCase());
//           formData.append("category", trim(row.category).toUpperCase());
//           formData.append("aadhar", trim(row.aadhar));
//           formData.append("mobile", trim(row.mobile));
//           formData.append("whatsapp", trim(row.whatsapp));
//           formData.append("registrationDate", registrationDate);
//           formData.append("isRegisteredBy", "Bulk Upload");

//           // Address data
//           formData.append("houseNumber", alphaNumUpper(row.houseNumber || ""));
//           formData.append("cityTownVillage", alphaNumUpper(row.cityTownVillage || ""));
//           formData.append("addressBlock", alphaNumUpper(row.addressBlock || ""));
//           formData.append("addressDistrict", alphaNumUpper(row.addressDistrict || ""));
//           formData.append("addressState", alphaNumUpper(row.addressState || ""));

//           // School data from context
//           formData.append("schoolDistrict", toUpperTrim(districtContext?.label || ""));
//           formData.append("schoolDistrictCode", trim(districtContext?.value || ""));
//           formData.append("schoolBlock", toUpperTrim(blockContext?.label || ""));
//           formData.append("schoolBlockCode", trim(blockContext?.value || ""));
//           formData.append("school", toUpperTrim(schoolContext?.label || ""));
//           formData.append("schoolCode", trim(schoolContext?.value || ""));

//           // Academic data
//           formData.append("previousClassAnnualExamPercentage", trim(row.previousClassAnnualExamPercentage || ""));
//           formData.append("classOfStudent", trim(selectedClass));

//           // Create student
//           const response = await createStudent(formData);

//           processResults.push({
//             ...result,
//             status: "success",
//             message: "Student created successfully",
//             studentId: response.data?._id
//           });

//         } catch (error) {
//           processResults.push({
//             ...result,
//             status: "error",
//             message: error.response?.data?.message || error.message || "Failed to create student"
//           });
//         }

//         // Update results progressively
//         setUploadResults([...processResults]);
//       }

//       // Final summary
//       const successful = processResults.filter(r => r.status === "success").length;
//       const failed = processResults.filter(r => r.status === "error").length;

//       setAlert({
//         type: failed === 0 ? "success" : failed === processResults.length ? "danger" : "warning",
//         message: `Bulk upload completed: ${successful} successful, ${failed} failed out of ${processResults.length} total rows`
//       });

//     } catch (error) {
//       console.error("Bulk upload error:", error);
//       setAlert({
//         type: "danger",
//         message: error.message || "Failed to process CSV file"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container fluid className="py-3">
//       {alert && (
//         <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
//           {alert.message}
//         </Alert>
//       )}

//       <Row>
//         <Col lg={12}>
//           <Card className="mb-4">
//             <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//               Bulk Student Registration
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Select Class:</Form.Label>
//                     <Select
//                       value={classOptions.find(opt => opt.value === selectedClass)}
//                       options={classOptions}
//                       onChange={(opt) => setSelectedClass(opt ? opt.value : "")}
//                       placeholder="Choose class..."
//                     />
//                   </Form.Group>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>School Details:</Form.Label>
//                     <District_block_school_manual_school_name_dependentDropdown />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Row className="mt-3">
//                 <Col md={6}>
//                   <Button
//                     variant="outline-primary"
//                     onClick={downloadTemplate}
//                     disabled={!isDownloadEnabled}
//                     className="w-100"
//                   >
//                     Download CSV Template
//                   </Button>
//                   <small className="text-muted d-block mt-1">
//                     {!isDownloadEnabled && "Select class and school details to enable download"}
//                     {isDownloadEnabled && "Template will include DD-MM-YYYY date format"}
//                   </small>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Upload CSV File:</Form.Label>
//                     <Form.Control
//                       type="file"
//                       accept=".csv"
//                       onChange={handleFileUpload}
//                       disabled={loading}
//                     />
//                     <Form.Text className="text-muted">
//                       CSV file must use DD-MM-YYYY format for dates
//                     </Form.Text>
//                   </Form.Group>
//                 </Col>
//               </Row>

//               {csvFile && (
//                 <Row className="mt-3">
//                   <Col>
//                     <Button
//                       variant="primary"
//                       onClick={processBulkUpload}
//                       disabled={loading}
//                       className="w-100"
//                     >
//                       {loading ? (
//                         <>
//                           <Spinner animation="border" size="sm" /> Processing...
//                         </>
//                       ) : (
//                         "Start Bulk Upload"
//                       )}
//                     </Button>
//                   </Col>
//                 </Row>
//               )}
//             </Card.Body>
//           </Card>

//           {/* Results Table */}
//           {uploadResults.length > 0 && (
//             <Card>
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Upload Results
//               </Card.Header>
//               <Card.Body>
//                 <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                   <Table striped bordered hover size="sm">
//                     <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
//                       <tr>
//                         <th>Row</th>
//                         <th>SRN</th>
//                         <th>Name</th>
//                         <th>DOB (Input)</th>
//                         <th>Status</th>
//                         <th>Message</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {uploadResults.map((result, index) => (
//                         <tr key={index}>
//                           <td>{result.rowIndex}</td>
//                           <td>{result.data.srn}</td>
//                           <td>{result.data.name}</td>
//                           <td>{result.data.dob}</td>
//                           <td>
//                             <span
//                               className={`badge ${
//                                 result.status === "success"
//                                   ? "bg-success"
//                                   : result.status === "error"
//                                   ? "bg-danger"
//                                   : result.isValid
//                                   ? "bg-warning"
//                                   : "bg-danger"
//                               }`}
//                             >
//                               {result.status === "success"
//                                 ? "Success"
//                                 : result.status === "error"
//                                 ? "Error"
//                                 : result.isValid
//                                 ? "Valid"
//                                 : "Invalid"}
//                             </span>
//                           </td>
//                           <td>
//                             {result.status === "success" && "Student created successfully"}
//                             {result.status === "error" && result.message}
//                             {!result.status && !result.isValid && result.errors.join(", ")}
//                             {!result.status && result.isValid && "Ready for upload"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               </Card.Body>
//             </Card>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };











// import React, { useContext, useState } from "react";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Button,
//   Alert,
//   Spinner,
//   Table,
//   Form,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select";
// import { useNavigate } from "react-router-dom";
// import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
// import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi.js";
// import { UserContext } from "../NewContextApis/UserContext.js";
// import { createStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

// export const BulkRegistrations = () => {
//   const navigate = useNavigate();

//   // Contexts
//   const context = useContext(DistrictBlockSchoolDependentDropDownContext);
//   const { userData } = useContext(UserContext);
//   const {
//     districtContext,
//     blockContext,
//     schoolContext,
//     setDistrictContext,
//     setBlockContext,
//     setSchoolContext,
//   } = context || {};

//   // State for form selections
//   const [selectedClass, setSelectedClass] = useState("");
//   const [csvFile, setCsvFile] = useState(null);
//   const [uploadResults, setUploadResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showSuccessAlert, setShowSuccessAlert] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   // Options
//   const classOptions = [
//     { value: "8", label: "8" },
//     { value: "10", label: "10" },
//   ];

//   // Check if download template should be enabled
//   const isDownloadEnabled = selectedClass && districtContext && blockContext && schoolContext;

//   // Check if upload file should be enabled
//   const isUploadEnabled = selectedClass && districtContext && blockContext && schoolContext && csvFile;

//   // Check if user is logged in
//   const isUserLoggedIn = userData?.user?._id;

//   // Generate and download CSV template
//   const downloadTemplate = () => {
//     if (!isDownloadEnabled) return;

//     const headers = [
//       "srn",
//       "name",
//       "father",
//       "mother",
//       "dob",
//       "gender",
//       "category",
//       "aadhar",
//       "mobile",
//       "whatsapp",
//       "houseNumber",
//       "cityTownVillage",
//       "addressBlock",
//       "addressDistrict",
//       "addressState",
//       "previousClassAnnualExamPercentage",
//     ];

//     // Sample data row with selected values (DD-MM-YYYY format for dob)
//     const sampleData = [
//       "1234567890", // srn
//       "STUDENT_NAME", // name
//       "FATHER_NAME", // father
//       "MOTHER_NAME", // mother
//       "01-01-2008", // dob in DD-MM-YYYY format
//       "Male", // gender
//       "GEN", // category
//       "123456789012", // aadhar
//       "9876543210", // mobile
//       "9876543210", // whatsapp
//       "HNO-123", // houseNumber
//       "CITY_NAME", // cityTownVillage
//       "BLOCK_NAME", // addressBlock
//       "DISTRICT_NAME", // addressDistrict
//       "STATE_NAME", // addressState
//       "85.50", // previousClassAnnualExamPercentage
//     ];

//     let csvContent = headers.join(",") + "\n";
//     csvContent += sampleData.join(",") + "\n";

//     // Create download using Blob
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `bulk_registration_template_${selectedClass}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   // Parse CSV file with date handling
//   const parseCSV = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const csvText = e.target.result;
//           const lines = csvText.split("\n").filter(line => line.trim() && !line.startsWith("#"));

//           if (lines.length < 2) {
//             reject(new Error("CSV file must contain headers and at least one data row"));
//             return;
//           }

//           const headers = lines[0].split(",").map(h => h.trim());
//           const data = [];

//           for (let i = 1; i < lines.length; i++) {
//             const values = lines[i].split(",");
//             const row = {};

//             headers.forEach((header, index) => {
//               let value = values[index] ? values[index].trim() : "";

//               // Handle date format conversion for dob field (DD-MM-YYYY to ISO format)
//               if (header === 'dob' && value) {
//                 value = convertDDMMYYYYToISO(value);
//               }

//               row[header] = value;
//             });

//             data.push(row);
//           }

//           resolve(data);
//         } catch (error) {
//           reject(new Error("Error parsing CSV file: " + error.message));
//         }
//       };
//       reader.onerror = () => reject(new Error("Failed to read file"));
//       reader.readAsText(file);
//     });
//   };

//   // Convert DD-MM-YYYY to ISO format with T00:00:00.000+00:00
//   const convertDDMMYYYYToISO = (dateString) => {
//     try {
//       // Parse DD-MM-YYYY format
//       const parts = dateString.split('-');
//       if (parts.length !== 3) {
//         throw new Error("Invalid date format");
//       }

//       const day = parseInt(parts[0], 10);
//       const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
//       const year = parseInt(parts[2], 10);

//       // Create date in UTC to avoid timezone issues
//       const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

//       // Format to ISO string with timezone
//       const isoString = date.toISOString();

//       return isoString;
//     } catch (error) {
//       console.error("Date conversion error:", error);
//       return dateString; // Return original if conversion fails
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
//         setAlert({ type: "danger", message: "Please upload a valid CSV file" });
//         return;
//       }
//       setCsvFile(file);
//       setUploadResults([]);
//       setAlert(null);
//       setShowSuccessAlert(false);
//     }
//   };

//   // Validate school details
//   const validateSchoolDetails = () => {
//     if (!districtContext || !districtContext.label || !districtContext.value) {
//       return "Please select District before uploading";
//     }
//     if (!blockContext || !blockContext.label || !blockContext.value) {
//       return "Please select Block before uploading";
//     }
//     if (!schoolContext || !schoolContext.label || !schoolContext.value) {
//       return "Please select School before uploading";
//     }
//     if (!selectedClass) {
//       return "Please select Class before uploading";
//     }
//     return null;
//   };

//   // Sanitization functions
//   const trim = (s) => (typeof s === "string" ? s.trim() : s);
//   const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();
//   const onlyDigits = (value, maxLen = 10) => String(value || "").replace(/\D+/g, "").slice(0, maxLen);
//   const onlyAlphaSpace = (value) => String(value || "").replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
//   const alphaNumUpper = (value, maxLen = 100) => String(value || "").replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen).trim().toUpperCase();
//   const sanitizePercentage = (value) => {
//     const v = String(value || "").trim();
//     const cleaned = v.replace(/[^0-9.]/g, "");
//     const parts = cleaned.split(".");
//     if (parts.length <= 1) return parts[0].slice(0, 3);
//     const integer = parts[0].slice(0, 3);
//     const decimal = parts[1].slice(0, 2);
//     return `${integer}.${decimal}`;
//   };

//   // Validate row data
//   const validateRow = (row, index) => {
//     const errors = [];

//     // Required fields validation
//     const requiredFields = ["srn", "name", "father", "mother", "dob", "gender", "category", "aadhar", "mobile", "whatsapp"];
//     requiredFields.forEach(field => {
//       if (!row[field] || String(row[field]).trim() === "") {
//         errors.push(`${field} is required`);
//       }
//     });

//     // SRN validation
//     if (row.srn && !/^\d{10}$/.test(row.srn)) {
//       errors.push("SRN must be exactly 10 digits");
//     }

//     // Name validations
//     ["name", "father", "mother"].forEach(field => {
//       if (row[field] && !/^[A-Za-z\s]+$/.test(row[field])) {
//         errors.push(`${field} must contain only alphabets and spaces`);
//       }
//     });

//     // Contact validation
//     if (row.mobile && !/^\d{10}$/.test(row.mobile)) {
//       errors.push("Mobile must be 10 digits");
//     }
//     if (row.whatsapp && !/^\d{10}$/.test(row.whatsapp)) {
//       errors.push("WhatsApp must be 10 digits");
//     }

//     // Aadhar validation
//     if (row.aadhar && !/^\d{8,20}$/.test(row.aadhar)) {
//       errors.push("Aadhar must be numeric (8-20 digits)");
//     }

//     // Percentage validation
//     if (row.previousClassAnnualExamPercentage && !/^\d{1,3}(\.\d{1,2})?$/.test(row.previousClassAnnualExamPercentage)) {
//       errors.push("Percentage must be valid (up to 3 digits with 2 decimals)");
//     }

//     // Date validation
//     if (row.dob) {
//       try {
//         const date = new Date(row.dob);
//         if (isNaN(date.getTime())) {
//           errors.push("Invalid date format for DOB");
//         }
//       } catch (error) {
//         errors.push("Invalid date format for DOB");
//       }
//     }

//     return {
//       rowIndex: index + 1,
//       isValid: errors.length === 0,
//       errors: errors,
//       data: row
//     };
//   };

//   // Clear all form data
//   const clearAllData = () => {
//     setSelectedClass("");
//     setCsvFile(null);
//     setUploadResults([]);
//     setAlert(null);
//     setShowSuccessAlert(false);

//     // Clear context states
//     if (setDistrictContext) setDistrictContext(null);
//     if (setBlockContext) setBlockContext(null);
//     if (setSchoolContext) setSchoolContext(null);

//     // Clear file input
//     const fileInput = document.querySelector('input[type="file"]');
//     if (fileInput) fileInput.value = "";
//   };

//   // Process bulk upload
//   const processBulkUpload = async () => {
//     // Check if user is logged in
//     if (!isUserLoggedIn) {
//       setShowLoginModal(true);
//       return;
//     }

//     // Validate school details
//     const schoolValidationError = validateSchoolDetails();
//     if (schoolValidationError) {
//       setAlert({ type: "danger", message: schoolValidationError });
//       return;
//     }

//     if (!csvFile) {
//       setAlert({ type: "danger", message: "Please select a CSV file first." });
//       return;
//     }

//     setLoading(true);
//     setUploadResults([]);
//     setAlert(null);
//     setShowSuccessAlert(false);

//     try {
//       const csvData = await parseCSV(csvFile);
//       const validationResults = csvData.map((row, index) => validateRow(row, index));

//       // Show validation results immediately
//       setUploadResults(validationResults);

//       // Check if any rows are invalid
//       const invalidRows = validationResults.filter(result => !result.isValid);
//       if (invalidRows.length > 0) {
//         setAlert({ 
//           type: "warning", 
//           message: `${invalidRows.length} rows have validation errors. Please fix them before proceeding.` 
//         });
//         setLoading(false);
//         return;
//       }

//       // Process valid rows
//       const processResults = [];

//       for (let i = 0; i < validationResults.length; i++) {
//         const result = validationResults[i];

//         try {
//           const formData = new FormData();
//           const row = result.data;

//           // Generate slipId and registrationDate
//           const slipId = (row.name?.slice(0, 3) || "STU").toUpperCase() + (row.srn?.slice(-5) || "00000");
//           const registrationDate = new Date().toISOString();

//           // Append basic student data
//           formData.append("slipId", trim(slipId));
//           formData.append("srn", trim(row.srn));
//           formData.append("name", toUpperTrim(row.name));
//           formData.append("father", toUpperTrim(row.father));
//           formData.append("mother", toUpperTrim(row.mother));
//           formData.append("dob", row.dob); // Already converted to ISO format in parseCSV
//           formData.append("gender", trim(row.gender).toUpperCase());
//           formData.append("category", trim(row.category).toUpperCase());
//           formData.append("aadhar", trim(row.aadhar));
//           formData.append("mobile", trim(row.mobile));
//           formData.append("whatsapp", trim(row.whatsapp));
//           formData.append("registrationDate", registrationDate);
//           formData.append("isRegisteredBy", userData.user._id); // Use actual user ID
//           formData.append("isBulkRegistered", "true"); // Add bulk registration flag

//           // Address data
//           formData.append("houseNumber", alphaNumUpper(row.houseNumber || ""));
//           formData.append("cityTownVillage", alphaNumUpper(row.cityTownVillage || ""));
//           formData.append("addressBlock", alphaNumUpper(row.addressBlock || ""));
//           formData.append("addressDistrict", alphaNumUpper(row.addressDistrict || ""));
//           formData.append("addressState", alphaNumUpper(row.addressState || ""));

//           // School data from context
//           formData.append("schoolDistrict", toUpperTrim(districtContext?.label || ""));
//           formData.append("schoolDistrictCode", trim(districtContext?.value || ""));
//           formData.append("schoolBlock", toUpperTrim(blockContext?.label || ""));
//           formData.append("schoolBlockCode", trim(blockContext?.value || ""));
//           formData.append("school", toUpperTrim(schoolContext?.label || ""));
//           formData.append("schoolCode", trim(schoolContext?.value || ""));

//           // Academic data
//           formData.append("previousClassAnnualExamPercentage", trim(row.previousClassAnnualExamPercentage || ""));
//           formData.append("classOfStudent", trim(selectedClass));

//           // Create student
//           const response = await createStudent(formData);

//           processResults.push({
//             ...result,
//             status: "success",
//             message: "Student created successfully",
//             studentId: response.data?._id
//           });

//         } catch (error) {
//           processResults.push({
//             ...result,
//             status: "error",
//             message: error.response?.data?.message || error.message || "Failed to create student"
//           });
//         }

//         // Update results progressively
//         setUploadResults([...processResults]);
//       }

//       // Final summary
//       const successful = processResults.filter(r => r.status === "success").length;
//       const failed = processResults.filter(r => r.status === "error").length;

//       // Set success message at bottom
//       const finalMessage = `Bulk upload completed: ${successful} successful, ${failed} failed out of ${processResults.length} total rows`;
//       setSuccessMessage(finalMessage);
//       setShowSuccessAlert(true);

//     } catch (error) {
//       console.error("Bulk upload error:", error);
//       setAlert({
//         type: "danger",
//         message: error.message || "Failed to process CSV file"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle login redirect
//   const handleLoginRedirect = () => {
//     setShowLoginModal(false);
//     navigate('/exam-user-login');
//   };

//   return (
//     <Container fluid className="py-3">
//       {alert && (
//         <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
//           {alert.message}
//         </Alert>
//       )}

//       {/* Login Required Modal */}
//       <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Login Required</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Please login first to perform bulk upload operations.
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleLoginRedirect}>
//             Login Now
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Row>
//         <Col lg={12}>
//           <Card className="mb-4">
//             <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//               Bulk Student Registration (बल्क छात्र पंजीकरण)
//             </Card.Header>
//             <Card.Body>
//               {/* Instructions Section */}
//               <Card className="mb-4 border-warning">
//                 <Card.Header style={{ backgroundColor: "#fff3cd", fontWeight: 600 }}>
//                   Instructions / निर्देश
//                 </Card.Header>
//                 <Card.Body>
//                   <Row>
//                     <Col md={6} >
//                       <h6>English Instructions:</h6>
//                       <ol >
//                         <li style={{textAlign:'left'}}>Select Class, District, Block, and School first (पहले कक्षा, जिला, ब्लॉक और स्कूल चुनें)</li>
//                         <li style={{textAlign:'left'}}>Download the CSV template (CSV टेम्पलेट डाउनलोड करें)</li>
//                         <li style={{textAlign:'left'}}>Fill the template with student data (टेम्पलेट में छात्र डेटा भरें)</li>
//                         <li style={{textAlign:'left'}}><strong>Date of Birth must be in DD-MM-YYYY format (e.g., 01-01-2008) (जन्म तिथि DD-MM-YYYY फॉर्मेट में होनी चाहिए (जैसे, 01-01-2008))</strong></li>
//                         <li style={{textAlign:'left'}}>School details will be automatically filled from your selection (स्कूल का विवरण आपके चयन से स्वचालित रूप से भर जाएगा)</li>

//                       </ol>
//                     </Col>

//                   </Row>
//                 </Card.Body>
//               </Card>

//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Select Class (कक्षा चुनें):</Form.Label>
//                     <Select
//                       value={classOptions.find(opt => opt.value === selectedClass)}
//                       options={classOptions}
//                       onChange={(opt) => setSelectedClass(opt ? opt.value : "")}
//                       placeholder="Choose class..."
//                     />
//                   </Form.Group>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>School Details (स्कूल का विवरण):</Form.Label>
//                     <District_block_school_manual_school_name_dependentDropdown />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Row className="mt-3">
//                 <Col md={6}>
//                   <Button
//                     variant="outline-primary"
//                     onClick={downloadTemplate}
//                     disabled={!isDownloadEnabled}
//                     className="w-100"
//                   >
//                     Download CSV Template
//                   </Button>
//                   <small className="text-muted d-block mt-1">
//                     {!isDownloadEnabled && "Select class and school details to enable download"}
//                     {isDownloadEnabled && "Template will include DD-MM-YYYY date format"}
//                   </small>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Upload CSV File (CSV फ़ाइल अपलोड करें):</Form.Label>
//                     <Form.Control
//                       type="file"
//                       accept=".csv"
//                       onChange={handleFileUpload}
//                       disabled={!selectedClass || !districtContext || !blockContext || !schoolContext || loading}
//                     />
//                     <Form.Text className="text-muted">
//                       {!selectedClass || !districtContext || !blockContext || !schoolContext 
//                         ? "Please select Class, District, Block and School first" 
//                         : "CSV file must use DD-MM-YYYY format for dates"}
//                     </Form.Text>
//                   </Form.Group>
//                 </Col>
//               </Row>

//               {csvFile && (
//                 <Row className="mt-3">
//                   <Col>
//                     <Button
//                       variant="primary"
//                       onClick={processBulkUpload}
//                       disabled={loading || !isUploadEnabled}
//                       className="w-100"
//                     >
//                       {loading ? (
//                         <>
//                           <Spinner animation="border" size="sm" /> Processing...
//                         </>
//                       ) : (
//                         "Start Bulk Upload"
//                       )}
//                     </Button>
//                     {!isUploadEnabled && (
//                       <small className="text-danger d-block mt-1">
//                         Please ensure all fields are selected and CSV file is uploaded
//                       </small>
//                     )}
//                   </Col>
//                 </Row>
//               )}
//             </Card.Body>
//           </Card>

//           {/* Results Table */}
//           {uploadResults.length > 0 && (
//             <Card>
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Upload Results (अपलोड परिणाम)
//               </Card.Header>
//               <Card.Body>
//                 {/* Success Alert at Bottom */}
//                 {showSuccessAlert && (
//                   <Alert variant="success" className="mb-3">
//                     {successMessage}
//                   </Alert>
//                 )}

//                 {/* Bulk Upload Again Button */}
//                 <div className="mb-3">
//                   <Button
//                     variant="outline-primary"
//                     onClick={clearAllData}
//                     className="w-100"
//                   >
//                     Bulk Upload Again
//                   </Button>
//                 </div>

//                 <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                   <Table striped bordered hover size="sm">
//                     <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
//                       <tr>
//                         <th>Row</th>
//                         <th>SRN</th>
//                         <th>Name</th>
//                         <th>DOB (Input)</th>
//                         <th>Status</th>
//                         <th>Message</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {uploadResults.map((result, index) => (
//                         <tr key={index}>
//                           <td>{result.rowIndex}</td>
//                           <td>{result.data.srn}</td>
//                           <td>{result.data.name}</td>
//                           <td>{result.data.dob}</td>
//                           <td>
//                             <span
//                               className={`badge ${
//                                 result.status === "success"
//                                   ? "bg-success"
//                                   : result.status === "error"
//                                   ? "bg-danger"
//                                   : result.isValid
//                                   ? "bg-warning"
//                                   : "bg-danger"
//                               }`}
//                             >
//                               {result.status === "success"
//                                 ? "Success"
//                                 : result.status === "error"
//                                 ? "Error"
//                                 : result.isValid
//                                 ? "Valid"
//                                 : "Invalid"}
//                             </span>
//                           </td>
//                           <td>
//                             {result.status === "success" && "Student created successfully"}
//                             {result.status === "error" && result.message}
//                             {!result.status && !result.isValid && result.errors.join(", ")}
//                             {!result.status && result.isValid && "Ready for upload"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               </Card.Body>
//             </Card>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };

























// import React, { useContext, useState } from "react";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Button,
//   Alert,
//   Spinner,
//   Table,
//   Form,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select";
// import { useNavigate } from "react-router-dom";
// import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
// import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi.js";
// import { UserContext } from "../NewContextApis/UserContext.js";
// import { createStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

// export const BulkRegistrations = () => {
//   const navigate = useNavigate();

//   // Contexts
//   const context = useContext(DistrictBlockSchoolDependentDropDownContext);
//   const { userData } = useContext(UserContext);
//   const {
//     districtContext,
//     blockContext,
//     schoolContext,
//     setDistrictContext,
//     setBlockContext,
//     setSchoolContext,
//   } = context || {};

//   // State for form selections
//   const [selectedClass, setSelectedClass] = useState("");
//   const [csvFile, setCsvFile] = useState(null);
//   const [uploadResults, setUploadResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showSuccessAlert, setShowSuccessAlert] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   // Options
//   const classOptions = [
//     { value: "8", label: "8" },
//     { value: "10", label: "10" },
//   ];

//   // Check if download template should be enabled
//   const isDownloadEnabled = selectedClass && districtContext && blockContext && schoolContext;

//   // Check if upload file should be enabled
//   const isUploadEnabled = selectedClass && districtContext && blockContext && schoolContext && csvFile;

//   // Check if user is logged in
//   const isUserLoggedIn = userData?.user?._id;

//   // Generate and download CSV template
//   const downloadTemplate = () => {
//     if (!isDownloadEnabled) return;

//     const headers = [
//       "srn",
//       "name",
//       "father",
//       "mother",
//       "dob",
//       "gender",
//       "category",
//       "aadhar",
//       "mobile",
//       "whatsapp",
//       "houseNumber",
//       "cityTownVillage",
//       "addressBlock",
//       "addressDistrict",
//       "addressState",
//       "previousClassAnnualExamPercentage",
//     ];

//     // Sample data row with selected values (DD-MM-YYYY format for dob)
//     const sampleData = [
//       "1234567890", // srn
//       "STUDENT_NAME", // name
//       "FATHER_NAME", // father
//       "MOTHER_NAME", // mother
//       "01-01-2008", // dob in DD-MM-YYYY format
//       "Male", // gender
//       "GEN", // category
//       "123456789012", // aadhar
//       "9876543210", // mobile
//       "9876543210", // whatsapp
//       "HNO-123", // houseNumber
//       "CITY_NAME", // cityTownVillage
//       "BLOCK_NAME", // addressBlock
//       "DISTRICT_NAME", // addressDistrict
//       "STATE_NAME", // addressState
//       "85.50", // previousClassAnnualExamPercentage
//     ];

//     let csvContent = headers.join(",") + "\n";
//     csvContent += sampleData.join(",") + "\n";

//     // Create download using Blob
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `bulk_registration_template_${selectedClass}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   // Parse CSV file with date handling
//   const parseCSV = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const csvText = e.target.result;
//           const lines = csvText.split("\n").filter(line => line.trim() && !line.startsWith("#"));

//           if (lines.length < 2) {
//             reject(new Error("CSV file must contain headers and at least one data row"));
//             return;
//           }

//           const headers = lines[0].split(",").map(h => h.trim());
//           const data = [];

//           for (let i = 1; i < lines.length; i++) {
//             const values = lines[i].split(",");
//             const row = {};

//             headers.forEach((header, index) => {
//               let value = values[index] ? values[index].trim() : "";

//               // Handle date format conversion for dob field (DD-MM-YYYY to ISO format)
//               if (header === 'dob' && value) {
//                 value = convertDDMMYYYYToISO(value);
//               }

//               row[header] = value;
//             });

//             data.push(row);
//           }

//           resolve(data);
//         } catch (error) {
//           reject(new Error("Error parsing CSV file: " + error.message));
//         }
//       };
//       reader.onerror = () => reject(new Error("Failed to read file"));
//       reader.readAsText(file);
//     });
//   };

//   // Convert DD-MM-YYYY to ISO format with T00:00:00.000+00:00
//   const convertDDMMYYYYToISO = (dateString) => {
//     try {
//       // Parse DD-MM-YYYY format
//       const parts = dateString.split('-');
//       if (parts.length !== 3) {
//         throw new Error("Invalid date format");
//       }

//       const day = parseInt(parts[0], 10);
//       const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
//       const year = parseInt(parts[2], 10);

//       // Create date in UTC to avoid timezone issues
//       const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

//       // Format to ISO string with timezone
//       const isoString = date.toISOString();

//       return isoString;
//     } catch (error) {
//       console.error("Date conversion error:", error);
//       return dateString; // Return original if conversion fails
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
//         setAlert({ type: "danger", message: "Please upload a valid CSV file" });
//         return;
//       }
//       setCsvFile(file);
//       setUploadResults([]);
//       setAlert(null);
//       setShowSuccessAlert(false);
//     }
//   };

//   // Validate school details
//   const validateSchoolDetails = () => {
//     if (!districtContext || !districtContext.label || !districtContext.value) {
//       return "Please select District before uploading";
//     }
//     if (!blockContext || !blockContext.label || !blockContext.value) {
//       return "Please select Block before uploading";
//     }
//     if (!schoolContext || !schoolContext.label || !schoolContext.value) {
//       return "Please select School before uploading";
//     }
//     if (!selectedClass) {
//       return "Please select Class before uploading";
//     }
//     return null;
//   };

//   // Sanitization functions
//   const trim = (s) => (typeof s === "string" ? s.trim() : s);
//   const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();
//   const onlyDigits = (value, maxLen = 10) => String(value || "").replace(/\D+/g, "").slice(0, maxLen);
//   const onlyAlphaSpace = (value) => String(value || "").replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
//   const alphaNumUpper = (value, maxLen = 100) => String(value || "").replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen).trim().toUpperCase();
//   const sanitizePercentage = (value) => {
//     const v = String(value || "").trim();
//     const cleaned = v.replace(/[^0-9.]/g, "");
//     const parts = cleaned.split(".");
//     if (parts.length <= 1) return parts[0].slice(0, 3);
//     const integer = parts[0].slice(0, 3);
//     const decimal = parts[1].slice(0, 2);
//     return `${integer}.${decimal}`;
//   };

//   // Validate row data
//   const validateRow = (row, index) => {
//     const errors = [];

//     // Required fields validation
//     const requiredFields = ["srn", "name", "father", "mother", "dob", "gender", "category", "aadhar", "mobile", "whatsapp"];
//     requiredFields.forEach(field => {
//       if (!row[field] || String(row[field]).trim() === "") {
//         errors.push(`${field} is required`);
//       }
//     });

//     // SRN validation
//     if (row.srn && !/^\d{10}$/.test(row.srn)) {
//       errors.push("SRN must be exactly 10 digits");
//     }

//     // Name validations
//     ["name", "father", "mother"].forEach(field => {
//       if (row[field] && !/^[A-Za-z\s]+$/.test(row[field])) {
//         errors.push(`${field} must contain only alphabets and spaces`);
//       }
//     });

//     // Contact validation
//     if (row.mobile && !/^\d{10}$/.test(row.mobile)) {
//       errors.push("Mobile must be 10 digits");
//     }
//     if (row.whatsapp && !/^\d{10}$/.test(row.whatsapp)) {
//       errors.push("WhatsApp must be 10 digits");
//     }

//     // Aadhar validation
//     if (row.aadhar && !/^\d{8,20}$/.test(row.aadhar)) {
//       errors.push("Aadhar must be numeric (8-20 digits)");
//     }

//     // Percentage validation
//     if (row.previousClassAnnualExamPercentage && !/^\d{1,3}(\.\d{1,2})?$/.test(row.previousClassAnnualExamPercentage)) {
//       errors.push("Percentage must be valid (up to 3 digits with 2 decimals)");
//     }

//     // Date validation
//     if (row.dob) {
//       try {
//         const date = new Date(row.dob);
//         if (isNaN(date.getTime())) {
//           errors.push("Invalid date format for DOB");
//         }
//       } catch (error) {
//         errors.push("Invalid date format for DOB");
//       }
//     }

//     return {
//       rowIndex: index + 1,
//       isValid: errors.length === 0,
//       errors: errors,
//       data: row
//     };
//   };

//   // Clear all form data
//   const clearAllData = () => {
//     setSelectedClass("");
//     setCsvFile(null);
//     setUploadResults([]);
//     setAlert(null);
//     setShowSuccessAlert(false);

//     // Clear context states
//     if (setDistrictContext) setDistrictContext(null);
//     if (setBlockContext) setBlockContext(null);
//     if (setSchoolContext) setSchoolContext(null);

//     // Clear file input
//     const fileInput = document.querySelector('input[type="file"]');
//     if (fileInput) fileInput.value = "";
//   };

//   // Process bulk upload
//   const processBulkUpload = async () => {
//     // Check if user is logged in
//     if (!isUserLoggedIn) {
//       setShowLoginModal(true);
//       return;
//     }

//     // Validate school details
//     const schoolValidationError = validateSchoolDetails();
//     if (schoolValidationError) {
//       setAlert({ type: "danger", message: schoolValidationError });
//       return;
//     }

//     if (!csvFile) {
//       setAlert({ type: "danger", message: "Please select a CSV file first." });
//       return;
//     }

//     setLoading(true);
//     setUploadResults([]);
//     setAlert(null);
//     setShowSuccessAlert(false);

//     try {
//       const csvData = await parseCSV(csvFile);
//       const validationResults = csvData.map((row, index) => validateRow(row, index));

//       // Show validation results immediately
//       setUploadResults(validationResults);

//       // Check if any rows are invalid
//       const invalidRows = validationResults.filter(result => !result.isValid);
//       if (invalidRows.length > 0) {
//         setAlert({ 
//           type: "warning", 
//           message: `${invalidRows.length} rows have validation errors. Please fix them before proceeding.` 
//         });
//         setLoading(false);
//         return;
//       }

//       // Process valid rows
//       const processResults = [];

//       for (let i = 0; i < validationResults.length; i++) {
//         const result = validationResults[i];

//         try {
//           const formData = new FormData();
//           const row = result.data;

//           // Generate slipId and registrationDate
//           const slipId = (row.name?.slice(0, 3) || "STU").toUpperCase() + (row.srn?.slice(-5) || "00000");
//           const registrationDate = new Date().toISOString();

//           // Append basic student data
//           formData.append("slipId", trim(slipId));
//           formData.append("srn", trim(row.srn));
//           formData.append("name", toUpperTrim(row.name));
//           formData.append("father", toUpperTrim(row.father));
//           formData.append("mother", toUpperTrim(row.mother));
//           formData.append("dob", row.dob); // Already converted to ISO format in parseCSV
//           formData.append("gender", trim(row.gender).toUpperCase());
//           formData.append("category", trim(row.category).toUpperCase());
//           formData.append("aadhar", trim(row.aadhar));
//           formData.append("mobile", trim(row.mobile));
//           formData.append("whatsapp", trim(row.whatsapp));
//           formData.append("registrationDate", registrationDate);
//           formData.append("isRegisteredBy", userData.user._id); // Use actual user ID
//           formData.append("isBulkRegistered", "true"); // Add bulk registration flag

//           // Address data
//           formData.append("houseNumber", alphaNumUpper(row.houseNumber || ""));
//           formData.append("cityTownVillage", alphaNumUpper(row.cityTownVillage || ""));
//           formData.append("addressBlock", alphaNumUpper(row.addressBlock || ""));
//           formData.append("addressDistrict", alphaNumUpper(row.addressDistrict || ""));
//           formData.append("addressState", alphaNumUpper(row.addressState || ""));

//           // School data from context
//           formData.append("schoolDistrict", toUpperTrim(districtContext?.label || ""));
//           formData.append("schoolDistrictCode", trim(districtContext?.value || ""));
//           formData.append("schoolBlock", toUpperTrim(blockContext?.label || ""));
//           formData.append("schoolBlockCode", trim(blockContext?.value || ""));
//           formData.append("school", toUpperTrim(schoolContext?.label || ""));
//           formData.append("schoolCode", trim(schoolContext?.value || ""));

//           // Academic data
//           formData.append("previousClassAnnualExamPercentage", trim(row.previousClassAnnualExamPercentage || ""));
//           formData.append("classOfStudent", trim(selectedClass));

//           // Create student
//           const response = await createStudent(formData);

//           processResults.push({
//             ...result,
//             status: "success",
//             message: "Student created successfully",
//             studentId: response.data?._id
//           });

//         } catch (error) {
//           processResults.push({
//             ...result,
//             status: "error",
//             message: error.response?.data?.message || error.message || "Failed to create student"
//           });
//         }

//         // Update results progressively
//         setUploadResults([...processResults]);
//       }

//       // Final summary
//       const successful = processResults.filter(r => r.status === "success").length;
//       const failed = processResults.filter(r => r.status === "error").length;

//       // Set success message at bottom
//       const finalMessage = `Bulk upload completed: ${successful} successful, ${failed} failed out of ${processResults.length} total rows`;
//       setSuccessMessage(finalMessage);
//       setShowSuccessAlert(true);

//     } catch (error) {
//       console.error("Bulk upload error:", error);
//       setAlert({
//         type: "danger",
//         message: error.message || "Failed to process CSV file"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle login redirect
//   const handleLoginRedirect = () => {
//     setShowLoginModal(false);
//     navigate('/exam-user-login');
//   };

//   // ---------- New helper: download only failed/invalid rows as CSV ----------
//   const downloadFailedEntriesCSV = () => {
//     const failedRows = uploadResults.filter(r => (r.status === "error") || (!r.isValid));
//     if (!failedRows.length) return;

//     // Determine headers union from data keys (preserve reasonable order if present)
//     const headerSet = new Set();
//     // preferred order if keys present:
//     const preferred = ["srn","name","father","mother","dob","gender","category","aadhar","mobile","whatsapp","houseNumber","cityTownVillage","addressBlock","addressDistrict","addressState","previousClassAnnualExamPercentage"];
//     preferred.forEach(h => headerSet.add(h));
//     // add any extra keys present
//     failedRows.forEach(r => {
//       Object.keys(r.data || {}).forEach(k => headerSet.add(k));
//     });
//     const headers = Array.from(headerSet);

//     const csvEscape = (val) => {
//       if (val === null || val === undefined) return "";
//       const s = String(val);
//       if (s.includes(",") || s.includes('"') || s.includes("\n")) {
//         return `"${s.replace(/"/g, '""')}"`;
//       }
//       return s;
//     };

//     let csv = headers.join(",") + "\n";
//     failedRows.forEach(r => {
//       const row = headers.map(h => csvEscape(r.data?.[h] ?? ""));
//       csv += row.join(",") + "\n";
//     });

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `failed_bulk_rows_${selectedClass || "class"}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };
//   // ------------------------------------------------------------------------

//   return (
//     <Container fluid className="py-3">
//       {alert && (
//         <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
//           {alert.message}
//         </Alert>
//       )}

//       {/* Login Required Modal */}
//       <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Login Required</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Please login first to perform bulk upload operations.
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleLoginRedirect}>
//             Login Now
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Row>
//         <Col lg={12}>
//           <Card className="mb-4">
//             <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//               Bulk Student Registration (बल्क छात्र पंजीकरण)
//             </Card.Header>
//             <Card.Body>
//               {/* Instructions Section */}
//               <Card className="mb-4 border-warning">
//                 <Card.Header style={{ backgroundColor: "#fff3cd", fontWeight: 600 }}>
//                   Instructions / निर्देश
//                 </Card.Header>
//                 <Card.Body>
//                   <Row>
//                     <Col md={6} >
//                       <h6>English Instructions:</h6>
//                       <ol >
//                         <li style={{textAlign:'left'}}>Select Class, District, Block, and School first (पहले कक्षा, जिला, ब्लॉक और स्कूल चुनें)</li>
//                         <li style={{textAlign:'left'}}>Download the CSV template (CSV टेम्पलेट डाउनलोड करें)</li>
//                         <li style={{textAlign:'left'}}>Fill the template with student data (टेम्पलेट में छात्र डेटा भरें)</li>
//                         <li style={{textAlign:'left'}}><strong>Date of Birth must be in DD-MM-YYYY format (e.g., 01-01-2008) (जन्म तिथि DD-MM-YYYY फॉर्मेट में होनी चाहिए (जैसे, 01-01-2008))</strong></li>
//                         <li style={{textAlign:'left'}}>School details will be automatically filled from your selection (स्कूल का विवरण आपके चयन से स्वचालित रूप से भर जाएगा)</li>

//                       </ol>
//                     </Col>

//                   </Row>
//                 </Card.Body>
//               </Card>

//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Select Class (कक्षा चुनें):</Form.Label>
//                     <Select
//                       value={classOptions.find(opt => opt.value === selectedClass)}
//                       options={classOptions}
//                       onChange={(opt) => setSelectedClass(opt ? opt.value : "")}
//                       placeholder="Choose class..."
//                     />
//                   </Form.Group>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>School Details (स्कूल का विवरण):</Form.Label>
//                     <District_block_school_manual_school_name_dependentDropdown />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Row className="mt-3">
//                 <Col md={6}>
//                   <Button
//                     variant="outline-primary"
//                     onClick={downloadTemplate}
//                     disabled={!isDownloadEnabled}
//                     className="w-100"
//                   >
//                     Download CSV Template
//                   </Button>
//                   <small className="text-muted d-block mt-1">
//                     {!isDownloadEnabled && "Select class and school details to enable download"}
//                     {isDownloadEnabled && "Template will include DD-MM-YYYY date format"}
//                   </small>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Upload CSV File (CSV फ़ाइल अपलोड करें):</Form.Label>
//                     <Form.Control
//                       type="file"
//                       accept=".csv"
//                       onChange={handleFileUpload}
//                       disabled={!selectedClass || !districtContext || !blockContext || !schoolContext || loading}
//                     />
//                     <Form.Text className="text-muted">
//                       {!selectedClass || !districtContext || !blockContext || !schoolContext 
//                         ? "Please select Class, District, Block and School first" 
//                         : "CSV file must use DD-MM-YYYY format for dates"}
//                     </Form.Text>
//                   </Form.Group>
//                 </Col>
//               </Row>

//               {csvFile && (
//                 <Row className="mt-3">
//                   <Col>
//                     <Button
//                       variant="primary"
//                       onClick={processBulkUpload}
//                       disabled={loading || !isUploadEnabled}
//                       className="w-100"
//                     >
//                       {loading ? (
//                         <>
//                           <Spinner animation="border" size="sm" /> Processing...
//                         </>
//                       ) : (
//                         "Start Bulk Upload"
//                       )}
//                     </Button>
//                     {!isUploadEnabled && (
//                       <small className="text-danger d-block mt-1">
//                         Please ensure all fields are selected and CSV file is uploaded
//                       </small>
//                     )}
//                   </Col>
//                 </Row>
//               )}
//             </Card.Body>
//           </Card>

//           {/* Results Table */}
//           {uploadResults.length > 0 && (
//             <Card>
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Upload Results (अपलोड परिणाम)
//               </Card.Header>
//               <Card.Body>
//                 {/* Success Alert at Bottom */}
//                 {showSuccessAlert && (
//                   <Alert variant="success" className="mb-3">
//                     {successMessage}
//                   </Alert>
//                 )}

//                 {/* Bulk Upload Again Button */}
//                 <div className="mb-3">
//                   <Button
//                     variant="outline-primary"
//                     onClick={clearAllData}
//                     className="w-100"
//                   >
//                     Bulk Upload Again
//                   </Button>
//                 </div>

//                 <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                   <Table striped bordered hover size="sm">
//                     <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
//                       <tr>
//                         <th>Row</th>
//                         <th>SRN</th>
//                         <th>Name</th>
//                         {/* DOB column removed as requested */}
//                         <th>Status</th>
//                         <th>Message</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {uploadResults.map((result, index) => (
//                         <tr key={index}>
//                           <td>{result.rowIndex}</td>
//                           <td>{result.data.srn}</td>
//                           <td>{result.data.name}</td>
//                           {/* DOB column removed from UI */}
//                           <td>
//                             <span
//                               className={`badge ${
//                                 result.status === "success"
//                                   ? "bg-success"
//                                   : result.status === "error"
//                                   ? "bg-danger"
//                                   : result.isValid
//                                   ? "bg-warning"
//                                   : "bg-danger"
//                               }`}
//                             >
//                               {result.status === "success"
//                                 ? "Success"
//                                 : result.status === "error"
//                                 ? "Error"
//                                 : result.isValid
//                                 ? "Valid"
//                                 : "Invalid"}
//                             </span>
//                           </td>
//                           <td>
//                             {result.status === "success" && "Student created successfully"}
//                             {result.status === "error" && result.message}
//                             {!result.status && !result.isValid && result.errors.join(", ")}
//                             {!result.status && result.isValid && "Ready for upload"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>

//                 {/* CSV download button for only failed/invalid rows (just below table) */}
//                 <div className="mt-3 d-flex gap-2">
//                   <Button
//                     variant="outline-danger"
//                     onClick={downloadFailedEntriesCSV}
//                     disabled={uploadResults.filter(r => (r.status === "error") || (!r.isValid)).length === 0}
//                   >
//                     Download Failed Entries (CSV)
//                   </Button>
//                 </div>

//               </Card.Body>
//             </Card>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };




















// import React, { useContext, useState } from "react";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Button,
//   Alert,
//   Spinner,
//   Table,
//   Form,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select";
// import { useNavigate } from "react-router-dom";
// import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
// import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi.js";
// import { UserContext } from "../NewContextApis/UserContext.js";
// import { createStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

// export const BulkRegistrations = () => {
//   const navigate = useNavigate();

//   // Contexts
//   const context = useContext(DistrictBlockSchoolDependentDropDownContext);
//   const { userData } = useContext(UserContext);
//   const {
//     districtContext,
//     blockContext,
//     schoolContext,
//     setDistrictContext,
//     setBlockContext,
//     setSchoolContext,
//   } = context || {};

//   // State for form selections
//   const [selectedClass, setSelectedClass] = useState("");
//   const [csvFile, setCsvFile] = useState(null);
//   const [uploadResults, setUploadResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showSuccessAlert, setShowSuccessAlert] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   // Options
//   const classOptions = [
//     { value: "8", label: "8" },
//     { value: "10", label: "10" },
//   ];

//   // Check if download template should be enabled
//   const isDownloadEnabled = selectedClass && districtContext && blockContext && schoolContext;

//   // Check if upload file should be enabled
//   const isUploadEnabled = selectedClass && districtContext && blockContext && schoolContext && csvFile;

//   // Check if user is logged in
//   const isUserLoggedIn = userData?.user?._id;

//   // Generate and download CSV template
//   const downloadTemplate = () => {
//     if (!isDownloadEnabled) return;

//     const headers = [
//       "srn",
//       "name",
//       "father",
//       "mother",
//       "dob",
//       "gender",
//       "category",
//       "aadhar",
//       "mobile",
//       "whatsapp",
//       "houseNumber",
//       "cityTownVillage",
//       "addressBlock",
//       "addressDistrict",
//       "addressState",
//       "previousClassAnnualExamPercentage",
//     ];

//     // Sample data row with selected values (DD-MM-YYYY format for dob)
//     const sampleData = [
//       "1234567890", // srn
//       "STUDENT_NAME", // name
//       "FATHER_NAME", // father
//       "MOTHER_NAME", // mother
//       "01-01-2008", // dob in DD-MM-YYYY format
//       "Male", // gender
//       "GEN", // category
//       "123456789012", // aadhar
//       "9876543210", // mobile
//       "9876543210", // whatsapp
//       "HNO-123", // houseNumber
//       "CITY_NAME", // cityTownVillage
//       "BLOCK_NAME", // addressBlock
//       "DISTRICT_NAME", // addressDistrict
//       "STATE_NAME", // addressState
//       "85.50", // previousClassAnnualExamPercentage
//     ];

//     let csvContent = headers.join(",") + "\n";
//     csvContent += sampleData.join(",") + "\n";

//     // Create download using Blob
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `bulk_registration_template_${selectedClass}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   // Parse CSV file with date handling
//   const parseCSV = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const csvText = e.target.result;
//           const lines = csvText.split("\n").filter(line => line.trim() && !line.startsWith("#"));

//           if (lines.length < 2) {
//             reject(new Error("CSV file must contain headers and at least one data row"));
//             return;
//           }

//           const headers = lines[0].split(",").map(h => h.trim());
//           const data = [];

//           for (let i = 1; i < lines.length; i++) {
//             const values = lines[i].split(",");
//             const row = {};

//             headers.forEach((header, index) => {
//               let value = values[index] ? values[index].trim() : "";

//               // Handle date format conversion for dob field (DD-MM-YYYY to ISO format)
//               if (header === 'dob' && value) {
//                 value = convertDDMMYYYYToISO(value);
//               }

//               row[header] = value;
//             });

//             data.push(row);
//           }

//           resolve(data);
//         } catch (error) {
//           reject(new Error("Error parsing CSV file: " + error.message));
//         }
//       };
//       reader.onerror = () => reject(new Error("Failed to read file"));
//       reader.readAsText(file);
//     });
//   };

//   // Convert DD-MM-YYYY to ISO format with T00:00:00.000+00:00
//   const convertDDMMYYYYToISO = (dateString) => {
//     try {
//       // Parse DD-MM-YYYY format
//       const parts = dateString.split('-');
//       if (parts.length !== 3) {
//         throw new Error("Invalid date format");
//       }

//       const day = parseInt(parts[0], 10);
//       const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
//       const year = parseInt(parts[2], 10);

//       // Create date in UTC to avoid timezone issues
//       const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

//       // Format to ISO string with timezone
//       const isoString = date.toISOString();

//       return isoString;
//     } catch (error) {
//       console.error("Date conversion error:", error);
//       return dateString; // Return original if conversion fails
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
//         setAlert({ type: "danger", message: "Please upload a valid CSV file" });
//         return;
//       }
//       setCsvFile(file);
//       setUploadResults([]);
//       setAlert(null);
//       setShowSuccessAlert(false);
//     }
//   };

//   // Validate school details
//   const validateSchoolDetails = () => {
//     if (!districtContext || !districtContext.label || !districtContext.value) {
//       return "Please select District before uploading";
//     }
//     if (!blockContext || !blockContext.label || !blockContext.value) {
//       return "Please select Block before uploading";
//     }
//     if (!schoolContext || !schoolContext.label || !schoolContext.value) {
//       return "Please select School before uploading";
//     }
//     if (!selectedClass) {
//       return "Please select Class before uploading";
//     }
//     return null;
//   };

//   // Sanitization functions
//   const trim = (s) => (typeof s === "string" ? s.trim() : s);
//   const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();
//   const onlyDigits = (value, maxLen = 10) => String(value || "").replace(/\D+/g, "").slice(0, maxLen);
//   const onlyAlphaSpace = (value) => String(value || "").replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
//   const alphaNumUpper = (value, maxLen = 100) => String(value || "").replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen).trim().toUpperCase();
//   const sanitizePercentage = (value) => {
//     const v = String(value || "").trim();
//     const cleaned = v.replace(/[^0-9.]/g, "");
//     const parts = cleaned.split(".");
//     if (parts.length <= 1) return parts[0].slice(0, 3);
//     const integer = parts[0].slice(0, 3);
//     const decimal = parts[1].slice(0, 2);
//     return `${integer}.${decimal}`;
//   };

//   // Validate row data
//   const validateRow = (row, index) => {
//     const errors = [];

//     // Required fields validation
//     const requiredFields = ["srn", "name", "father", "mother", "dob", "gender", "category", "aadhar", "mobile", "whatsapp"];
//     requiredFields.forEach(field => {
//       if (!row[field] || String(row[field]).trim() === "") {
//         errors.push(`${field} is required`);
//       }
//     });

//     // SRN validation
//     if (row.srn && !/^\d{10}$/.test(row.srn)) {
//       errors.push("SRN must be exactly 10 digits");
//     }

//     // Name validations
//     ["name", "father", "mother"].forEach(field => {
//       if (row[field] && !/^[A-Za-z\s]+$/.test(row[field])) {
//         errors.push(`${field} must contain only alphabets and spaces`);
//       }
//     });

//     // Contact validation
//     if (row.mobile && !/^\d{10}$/.test(row.mobile)) {
//       errors.push("Mobile must be 10 digits");
//     }
//     if (row.whatsapp && !/^\d{10}$/.test(row.whatsapp)) {
//       errors.push("WhatsApp must be 10 digits");
//     }

//     // Aadhar validation
//     if (row.aadhar && !/^\d{8,20}$/.test(row.aadhar)) {
//       errors.push("Aadhar must be numeric (8-20 digits)");
//     }

//     // Percentage validation
//     if (row.previousClassAnnualExamPercentage && !/^\d{1,3}(\.\d{1,2})?$/.test(row.previousClassAnnualExamPercentage)) {
//       errors.push("Percentage must be valid (up to 3 digits with 2 decimals)");
//     }

//     // Date validation
//     if (row.dob) {
//       try {
//         const date = new Date(row.dob);
//         if (isNaN(date.getTime())) {
//           errors.push("Invalid date format for DOB");
//         }
//       } catch (error) {
//         errors.push("Invalid date format for DOB");
//       }
//     }

//     return {
//       rowIndex: index + 1,
//       isValid: errors.length === 0,
//       errors: errors,
//       data: row
//     };
//   };

//   // Clear all form data
//   const clearAllData = () => {
//     setSelectedClass("");
//     setCsvFile(null);
//     setUploadResults([]);
//     setAlert(null);
//     setShowSuccessAlert(false);

//     // Clear context states
//     if (setDistrictContext) setDistrictContext(null);
//     if (setBlockContext) setBlockContext(null);
//     if (setSchoolContext) setSchoolContext(null);

//     // Clear file input
//     const fileInput = document.querySelector('input[type="file"]');
//     if (fileInput) fileInput.value = "";
//   };

//   // Process bulk upload
//   const processBulkUpload = async () => {
//     // Check if user is logged in
//     if (!isUserLoggedIn) {
//       setShowLoginModal(true);
//       return;
//     }

//     // Validate school details
//     const schoolValidationError = validateSchoolDetails();
//     if (schoolValidationError) {
//       setAlert({ type: "danger", message: schoolValidationError });
//       return;
//     }

//     if (!csvFile) {
//       setAlert({ type: "danger", message: "Please select a CSV file first." });
//       return;
//     }

//     setLoading(true);
//     setUploadResults([]);
//     setAlert(null);
//     setShowSuccessAlert(false);

//     try {
//       const csvData = await parseCSV(csvFile);
//       const validationResults = csvData.map((row, index) => validateRow(row, index));

//       // Show validation results immediately
//       setUploadResults(validationResults);

//       // Check if any rows are invalid
//       const invalidRows = validationResults.filter(result => !result.isValid);
//       if (invalidRows.length > 0) {
//         setAlert({ 
//           type: "warning", 
//           message: `${invalidRows.length} rows have validation errors. Please fix them before proceeding.` 
//         });
//         setLoading(false);
//         return;
//       }

//       // Process valid rows
//       const processResults = [];

//       for (let i = 0; i < validationResults.length; i++) {
//         const result = validationResults[i];

//         try {
//           const formData = new FormData();
//           const row = result.data;

//           // Generate slipId and registrationDate
//           const slipId = (row.name?.slice(0, 3) || "STU").toUpperCase() + (row.srn?.slice(-5) || "00000");
//           const registrationDate = new Date().toISOString();

//           // Append basic student data
//           formData.append("slipId", trim(slipId));
//           formData.append("srn", trim(row.srn));
//           formData.append("name", toUpperTrim(row.name));
//           formData.append("father", toUpperTrim(row.father));
//           formData.append("mother", toUpperTrim(row.mother));
//           formData.append("dob", row.dob); // Already converted to ISO format in parseCSV
//           formData.append("gender", trim(row.gender).toUpperCase());
//           formData.append("category", trim(row.category).toUpperCase());
//           formData.append("aadhar", trim(row.aadhar));
//           formData.append("mobile", trim(row.mobile));
//           formData.append("whatsapp", trim(row.whatsapp));
//           formData.append("registrationDate", registrationDate);
//           formData.append("isRegisteredBy", userData.user._id); // Use actual user ID
//           formData.append("isBulkRegistered", "true"); // Add bulk registration flag

//           // Address data
//           formData.append("houseNumber", alphaNumUpper(row.houseNumber || ""));
//           formData.append("cityTownVillage", alphaNumUpper(row.cityTownVillage || ""));
//           formData.append("addressBlock", alphaNumUpper(row.addressBlock || ""));
//           formData.append("addressDistrict", alphaNumUpper(row.addressDistrict || ""));
//           formData.append("addressState", alphaNumUpper(row.addressState || ""));

//           // School data from context
//           formData.append("schoolDistrict", toUpperTrim(districtContext?.label || ""));
//           formData.append("schoolDistrictCode", trim(districtContext?.value || ""));
//           formData.append("schoolBlock", toUpperTrim(blockContext?.label || ""));
//           formData.append("schoolBlockCode", trim(blockContext?.value || ""));
//           formData.append("school", toUpperTrim(schoolContext?.label || ""));
//           formData.append("schoolCode", trim(schoolContext?.value || ""));

//           // Academic data
//           formData.append("previousClassAnnualExamPercentage", trim(row.previousClassAnnualExamPercentage || ""));
//           formData.append("classOfStudent", trim(selectedClass));

//           // Create student
//           const response = await createStudent(formData);

//           processResults.push({
//             ...result,
//             status: "success",
//             message: "Student created successfully",
//             studentId: response.data?._id
//           });

//         } catch (error) {
//           processResults.push({
//             ...result,
//             status: "error",
//             message: error.response?.data?.message || error.message || "Failed to create student"
//           });
//         }

//         // Update results progressively
//         setUploadResults([...processResults]);
//       }

//       // Final summary
//       const successful = processResults.filter(r => r.status === "success").length;
//       const failed = processResults.filter(r => r.status === "error").length;

//       // Set success message at bottom
//       const finalMessage = `Bulk upload completed: ${successful} successful, ${failed} failed out of ${processResults.length} total rows`;
//       setSuccessMessage(finalMessage);
//       setShowSuccessAlert(true);

//     } catch (error) {
//       console.error("Bulk upload error:", error);
//       setAlert({
//         type: "danger",
//         message: error.message || "Failed to process CSV file"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle login redirect
//   const handleLoginRedirect = () => {
//     setShowLoginModal(false);
//     navigate('/exam-user-login');
//   };

//   // ---------- New helper: download only failed/invalid rows as CSV ----------
//   const downloadFailedEntriesCSV = () => {
//     const failedRows = uploadResults.filter(r => (r.status === "error") || (!r.isValid));
//     if (!failedRows.length) return;

//     // Determine headers union from data keys (preserve reasonable order if present)
//     const headerSet = new Set();
//     // preferred order if keys present:
//     const preferred = ["srn","name","father","mother","dob","gender","category","aadhar","mobile","whatsapp","houseNumber","cityTownVillage","addressBlock","addressDistrict","addressState","previousClassAnnualExamPercentage"];
//     preferred.forEach(h => headerSet.add(h));
//     // add any extra keys present
//     failedRows.forEach(r => {
//       Object.keys(r.data || {}).forEach(k => headerSet.add(k));
//     });
//     const headers = Array.from(headerSet);

//     const csvEscape = (val) => {
//       if (val === null || val === undefined) return "";
//       const s = String(val);
//       if (s.includes(",") || s.includes('"') || s.includes("\n")) {
//         return `"${s.replace(/"/g, '""')}"`;
//       }
//       return s;
//     };

//     let csv = headers.join(",") + "\n";
//     failedRows.forEach(r => {
//       const row = headers.map(h => csvEscape(r.data?.[h] ?? ""));
//       csv += row.join(",") + "\n";
//     });

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `failed_bulk_rows_${selectedClass || "class"}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };
//   // ------------------------------------------------------------------------

//   return (
//     <Container fluid className="py-3">
//       {alert && (
//         <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
//           {alert.message}
//         </Alert>
//       )}

//       {/* Login Required Modal */}
//       <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Login Required</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Please login first to perform bulk upload operations.
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleLoginRedirect}>
//             Login Now
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Row>
//         <Col lg={12}>
//           <Card className="mb-4">
//             <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//               Bulk Student Registration (बल्क छात्र पंजीकरण)
//             </Card.Header>
//             <Card.Body>
//               {/* Instructions Section */}
//               <Card className="mb-4 border-warning">
//                 <Card.Header style={{ backgroundColor: "#fff3cd", fontWeight: 600 }}>
//                   Instructions / निर्देश
//                 </Card.Header>
//                 <Card.Body>
//                   <Row>
//                     <Col md={6} >
//                       <h6>English Instructions:</h6>
//                       <ol >
//                         <li style={{textAlign:'left'}}>Select Class, District, Block, and School first (पहले कक्षा, जिला, ब्लॉक और स्कूल चुनें)</li>
//                         <li style={{textAlign:'left'}}>Download the CSV template (CSV टेम्पलेट डाउनलोड करें)</li>
//                         <li style={{textAlign:'left'}}>Fill the template with student data (टेम्पलेट में छात्र डेटा भरें)</li>
//                         <li style={{textAlign:'left'}}><strong>Date of Birth must be in DD-MM-YYYY format (e.g., 01-01-2008) (जन्म तिथि DD-MM-YYYY फॉर्मेट में होनी चाहिए (जैसे, 01-01-2008))</strong></li>
//                         <li style={{textAlign:'left'}}>School details will be automatically filled from your selection (स्कूल का विवरण आपके चयन से स्वचालित रूप से भर जाएगा)</li>

//                       </ol>
//                     </Col>

//                   </Row>
//                 </Card.Body>
//               </Card>

//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Select Class (कक्षा चुनें):</Form.Label>
//                     <Select
//                       value={classOptions.find(opt => opt.value === selectedClass)}
//                       options={classOptions}
//                       onChange={(opt) => setSelectedClass(opt ? opt.value : "")}
//                       placeholder="Choose class..."
//                     />
//                   </Form.Group>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>School Details (स्कूल का विवरण):</Form.Label>
//                     <District_block_school_manual_school_name_dependentDropdown />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Row className="mt-3">
//                 <Col md={6}>
//                   <Button
//                     variant="outline-primary"
//                     onClick={downloadTemplate}
//                     disabled={!isDownloadEnabled}
//                     className="w-100"
//                   >
//                     Download CSV Template
//                   </Button>
//                   <small className="text-muted d-block mt-1">
//                     {!isDownloadEnabled && "Select class and school details to enable download"}
//                     {isDownloadEnabled && "Template will include DD-MM-YYYY date format"}
//                   </small>
//                 </Col>

//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Upload CSV File (CSV फ़ाइल अपलोड करें):</Form.Label>
//                     <Form.Control
//                       type="file"
//                       accept=".csv"
//                       onChange={handleFileUpload}
//                       disabled={!selectedClass || !districtContext || !blockContext || !schoolContext || loading}
//                     />
//                     <Form.Text className="text-muted">
//                       {!selectedClass || !districtContext || !blockContext || !schoolContext 
//                         ? "Please select Class, District, Block and School first" 
//                         : "CSV file must use DD-MM-YYYY format for dates"}
//                     </Form.Text>
//                   </Form.Group>
//                 </Col>
//               </Row>

//               {csvFile && (
//                 <Row className="mt-3">
//                   <Col>
//                     <Button
//                       variant="primary"
//                       onClick={processBulkUpload}
//                       disabled={loading || !isUploadEnabled}
//                       className="w-100"
//                     >
//                       {loading ? (
//                         <>
//                           <Spinner animation="border" size="sm" /> Processing...
//                         </>
//                       ) : (
//                         "Start Bulk Upload"
//                       )}
//                     </Button>
//                     {!isUploadEnabled && (
//                       <small className="text-danger d-block mt-1">
//                         Please ensure all fields are selected and CSV file is uploaded
//                       </small>
//                     )}
//                   </Col>
//                 </Row>
//               )}
//             </Card.Body>
//           </Card>

//           {/* Results Table */}
//           {uploadResults.length > 0 && (
//             <Card>
//               <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
//                 Upload Results (अपलोड परिणाम)
//               </Card.Header>
//               <Card.Body>
//                 {/* Success Alert at Bottom */}
//                 {showSuccessAlert && (
//                   <Alert variant="success" className="mb-3">
//                     {successMessage}
//                   </Alert>
//                 )}

//                 {/* Bulk Upload Again Button */}
//                 <div className="mb-3">
//                   <Button
//                     variant="outline-primary"
//                     onClick={clearAllData}
//                     className="w-100"
//                   >
//                     Bulk Upload Again
//                   </Button>
//                 </div>

//                 <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                   <Table striped bordered hover size="sm">
//                     <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
//                       <tr>
//                         <th>Row</th>
//                         <th>SRN</th>
//                         <th>Name</th>
//                         {/* DOB column removed as requested */}
//                         <th>Status</th>
//                         <th>Failed Status</th>
//                         <th>Message</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {uploadResults.map((result, index) => (
//                         <tr key={index}>
//                           <td>{result.rowIndex}</td>
//                           <td>{result.data.srn}</td>
//                           <td>{result.data.name}</td>
//                           {/* DOB column removed from UI */}
//                           <td>
//                             <span
//                               className={`badge ${
//                                 result.status === "success"
//                                   ? "bg-success"
//                                   : result.status === "error"
//                                   ? "bg-danger"
//                                   : result.isValid
//                                   ? "bg-warning"
//                                   : "bg-danger"
//                               }`}
//                             >
//                               {result.status === "success"
//                                 ? "Success"
//                                 : result.status === "error"
//                                 ? "Error"
//                                 : result.isValid
//                                 ? "Valid"
//                                 : "Invalid"}
//                             </span>
//                           </td>

//                           {/* New Failed Status column showing failure messages */}
//                           <td>
//                             {result.status === "error"
//                               ? result.message
//                               : !result.isValid
//                               ? result.errors.join(", ")
//                               : ""}
//                           </td>

//                           <td>
//                             {result.status === "success" && "Student created successfully"}
//                             {result.status === "error" && result.message}
//                             {!result.status && !result.isValid && result.errors.join(", ")}
//                             {!result.status && result.isValid && "Ready for upload"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>

//                 {/* CSV download button for only failed/invalid rows (just below table) */}
//                 <div className="mt-3 d-flex gap-2">
//                   <Button
//                     variant="outline-danger"
//                     onClick={downloadFailedEntriesCSV}
//                     disabled={uploadResults.filter(r => (r.status === "error") || (!r.isValid)).length === 0}
//                   >
//                     Download Failed Entries (CSV)
//                   </Button>
//                 </div>

//               </Card.Body>
//             </Card>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };



import React, { useContext, useState } from "react";
import {
    Container,
    Card,
    Row,
    Col,
    Button,
    Alert,
    Spinner,
    Table,
    Form,
    Modal,
} from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi.js";
import { UserContext } from "../NewContextApis/UserContext.js";
import { createStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

export const BulkRegistrations = () => {
    const navigate = useNavigate();

    // Contexts
    const context = useContext(DistrictBlockSchoolDependentDropDownContext);
    const { userData } = useContext(UserContext);
    const {
        districtContext,
        blockContext,
        schoolContext,
        setDistrictContext,
        setBlockContext,
        setSchoolContext,
    } = context || {};

    // State for form selections
    const [selectedClass, setSelectedClass] = useState("");
    const [csvFile, setCsvFile] = useState(null);
    const [uploadResults, setUploadResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Options
    const classOptions = [
        { value: "8", label: "8" },
        { value: "10", label: "10" },
    ];

    // Check if download template should be enabled
    const isDownloadEnabled = selectedClass && districtContext && blockContext && schoolContext;

    // Check if upload file should be enabled
    const isUploadEnabled = selectedClass && districtContext && blockContext && schoolContext && csvFile;

    // Check if user is logged in
    const isUserLoggedIn = userData?.user?._id;

    // Generate and download CSV template
    const downloadTemplate = () => {
        if (!isDownloadEnabled) return;

        const headers = [
            "srn",
            "name",
            "father",
            "mother",
            "dob",
            "gender",
            "category",
            "aadhar",
            "mobile",
            "whatsapp",
            "houseNumber",
            "cityTownVillage",
            "addressBlock",
            "addressDistrict",
            "addressState",
            "previousClassAnnualExamPercentage",
        ];

        // Sample data row with selected values (DD-MM-YYYY format for dob)
        const sampleData = [
            "1234567890", // srn
            "STUDENT_NAME", // name
            "FATHER_NAME", // father
            "MOTHER_NAME", // mother
            "01-01-2008", // dob in DD-MM-YYYY format
            "Male", // gender
            "GEN", // category
            "123456789012", // aadhar
            "9876543210", // mobile
            "9876543210", // whatsapp
            "HNO-123", // houseNumber
            "CITY_NAME", // cityTownVillage
            "BLOCK_NAME", // addressBlock
            "DISTRICT_NAME", // addressDistrict
            "STATE_NAME", // addressState
            "85.50", // previousClassAnnualExamPercentage
        ];

        let csvContent = headers.join(",") + "\n";
        csvContent += sampleData.join(",") + "\n";

        // Create download using Blob
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `bulk_registration_template_${selectedClass}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Parse CSV file with date handling
    const parseCSV = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csvText = e.target.result;
                    const lines = csvText.split("\n").filter(line => line.trim() && !line.startsWith("#"));

                    if (lines.length < 2) {
                        reject(new Error("CSV file must contain headers and at least one data row"));
                        return;
                    }

                    const headers = lines[0].split(",").map(h => h.trim());
                    const data = [];

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(",");
                        const row = {};

                        headers.forEach((header, index) => {
                            let value = values[index] ? values[index].trim() : "";

                            // Handle date format conversion for dob field (DD-MM-YYYY to ISO format)
                            if (header === 'dob' && value) {
                                value = convertDDMMYYYYToISO(value);
                            }

                            row[header] = value;
                        });

                        data.push(row);
                    }

                    resolve(data);
                } catch (error) {
                    reject(new Error("Error parsing CSV file: " + error.message));
                }
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(file);
        });
    };

    // Convert DD-MM-YYYY to ISO format with T00:00:00.000+00:00
    const convertDDMMYYYYToISO = (dateString) => {
        try {
            // Parse DD-MM-YYYY format
            const parts = dateString.split('-');
            if (parts.length !== 3) {
                throw new Error("Invalid date format");
            }

            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
            const year = parseInt(parts[2], 10);

            // Create date in UTC to avoid timezone issues
            const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

            // Format to ISO string with timezone
            const isoString = date.toISOString();

            return isoString;
        } catch (error) {
            console.error("Date conversion error:", error);
            return dateString; // Return original if conversion fails
        }
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                setAlert({ type: "danger", message: "Please upload a valid CSV file" });
                return;
            }
            setCsvFile(file);
            setUploadResults([]);
            setAlert(null);
            setShowSuccessAlert(false);
        }
    };

    // Validate school details
    const validateSchoolDetails = () => {
        if (!districtContext || !districtContext.label || !districtContext.value) {
            return "Please select District before uploading";
        }
        if (!blockContext || !blockContext.label || !blockContext.value) {
            return "Please select Block before uploading";
        }
        if (!schoolContext || !schoolContext.label || !schoolContext.value) {
            return "Please select School before uploading";
        }
        if (!selectedClass) {
            return "Please select Class before uploading";
        }
        return null;
    };

    // Sanitization functions
    const trim = (s) => (typeof s === "string" ? s.trim() : s);
    const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();
    const onlyDigits = (value, maxLen = 10) => String(value || "").replace(/\D+/g, "").slice(0, maxLen);
    const onlyAlphaSpace = (value) => String(value || "").replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
    const alphaNumUpper = (value, maxLen = 100) => String(value || "").replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen).trim().toUpperCase();
    const sanitizePercentage = (value) => {
        const v = String(value || "").trim();
        const cleaned = v.replace(/[^0-9.]/g, "");
        const parts = cleaned.split(".");
        if (parts.length <= 1) return parts[0].slice(0, 3);
        const integer = parts[0].slice(0, 3);
        const decimal = parts[1].slice(0, 2);
        return `${integer}.${decimal}`;
    };

    // Validate row data
    const validateRow = (row, index) => {
        const errors = [];

        // Required fields validation
        const requiredFields = ["srn", "name", "father", "mother", "dob", "gender", "category", "aadhar", "mobile", "whatsapp"];
        requiredFields.forEach(field => {
            if (!row[field] || String(row[field]).trim() === "") {
                errors.push(`${field} is required`);
            }
        });

        // SRN validation
        if (row.srn && !/^\d{10}$/.test(row.srn)) {
            errors.push("SRN must be exactly 10 digits");
        }

        // Name validations
        ["name", "father", "mother"].forEach(field => {
            if (row[field] && !/^[A-Za-z\s]+$/.test(row[field])) {
                errors.push(`${field} must contain only alphabets and spaces`);
            }
        });

        // Contact validation
        if (row.mobile && !/^\d{10}$/.test(row.mobile)) {
            errors.push("Mobile must be 10 digits");
        }
        if (row.whatsapp && !/^\d{10}$/.test(row.whatsapp)) {
            errors.push("WhatsApp must be 10 digits");
        }

        // Aadhar validation
        if (row.aadhar && !/^\d{8,20}$/.test(row.aadhar)) {
            errors.push("Aadhar must be numeric (8-20 digits)");
        }

        // Percentage validation
        if (row.previousClassAnnualExamPercentage && !/^\d{1,3}(\.\d{1,2})?$/.test(row.previousClassAnnualExamPercentage)) {
            errors.push("Percentage must be valid (up to 3 digits with 2 decimals)");
        }

        // Date validation
        if (row.dob) {
            try {
                const date = new Date(row.dob);
                if (isNaN(date.getTime())) {
                    errors.push("Invalid date format for DOB");
                }
            } catch (error) {
                errors.push("Invalid date format for DOB");
            }
        }

        return {
            rowIndex: index + 1,
            isValid: errors.length === 0,
            errors: errors,
            data: row
        };
    };

    // Clear all form data
    const clearAllData = () => {
        setSelectedClass("");
        setCsvFile(null);
        setUploadResults([]);
        setAlert(null);
        setShowSuccessAlert(false);

        // Clear context states
        if (setDistrictContext) setDistrictContext(null);
        if (setBlockContext) setBlockContext(null);
        if (setSchoolContext) setSchoolContext(null);

        // Clear file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
    };

    // Process bulk upload
    const processBulkUpload = async () => {
        // Check if user is logged in
        if (!isUserLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        // Validate school details
        const schoolValidationError = validateSchoolDetails();
        if (schoolValidationError) {
            setAlert({ type: "danger", message: schoolValidationError });
            return;
        }

        if (!csvFile) {
            setAlert({ type: "danger", message: "Please select a CSV file first." });
            return;
        }

        setLoading(true);
        setUploadResults([]);
        setAlert(null);
        setShowSuccessAlert(false);

        try {
            const csvData = await parseCSV(csvFile);
            const validationResults = csvData.map((row, index) => validateRow(row, index));

            // Show validation results immediately
            setUploadResults(validationResults);

            // Check if any rows are invalid
            const invalidRows = validationResults.filter(result => !result.isValid);
            if (invalidRows.length > 0) {
                setAlert({
                    type: "warning",
                    message: `${invalidRows.length} rows have validation errors. Please fix them before proceeding.`
                });
                setLoading(false);
                return;
            }

            // Process valid rows
            const processResults = [];

            for (let i = 0; i < validationResults.length; i++) {
                const result = validationResults[i];

                try {
                    const formData = new FormData();
                    const row = result.data;

                    // Generate slipId and registrationDate
                    const slipId = (row.name?.slice(0, 3) || "STU").toUpperCase() + (row.srn?.slice(-5) || "00000");
                    const registrationDate = new Date().toISOString();

                    // Append basic student data
                    formData.append("slipId", trim(slipId));
                    formData.append("srn", trim(row.srn));
                    formData.append("name", toUpperTrim(row.name));
                    formData.append("father", toUpperTrim(row.father));
                    formData.append("mother", toUpperTrim(row.mother));
                    formData.append("dob", row.dob); // Already converted to ISO format in parseCSV
                    formData.append("gender", trim(row.gender).toUpperCase());
                    formData.append("category", trim(row.category).toUpperCase());
                    formData.append("aadhar", trim(row.aadhar));
                    formData.append("mobile", trim(row.mobile));
                    formData.append("whatsapp", trim(row.whatsapp));
                    formData.append("registrationDate", registrationDate);
                    formData.append("isRegisteredBy", userData.user._id); // Use actual user ID
                    formData.append("isBulkRegistered", "true"); // Add bulk registration flag

                    // Address data
                    formData.append("houseNumber", alphaNumUpper(row.houseNumber || ""));
                    formData.append("cityTownVillage", alphaNumUpper(row.cityTownVillage || ""));
                    formData.append("addressBlock", alphaNumUpper(row.addressBlock || ""));
                    formData.append("addressDistrict", alphaNumUpper(row.addressDistrict || ""));
                    formData.append("addressState", alphaNumUpper(row.addressState || ""));

                    // School data from context
                    formData.append("schoolDistrict", toUpperTrim(districtContext?.label || ""));
                    formData.append("schoolDistrictCode", trim(districtContext?.value || ""));
                    formData.append("schoolBlock", toUpperTrim(blockContext?.label || ""));
                    formData.append("schoolBlockCode", trim(blockContext?.value || ""));
                    formData.append("school", toUpperTrim(schoolContext?.label || ""));
                    formData.append("schoolCode", trim(schoolContext?.value || ""));

                    // Academic data
                    formData.append("previousClassAnnualExamPercentage", trim(row.previousClassAnnualExamPercentage || ""));
                    formData.append("classOfStudent", trim(selectedClass));
                    formData.append("isVerified", trim("Verified"));
                    formData.append("verifiedBy", trim("Bulk-Upload"));

                    // Create student
                    const response = await createStudent(formData);

                    processResults.push({
                        ...result,
                        status: "success",
                        message: "Student created successfully",
                        studentId: response.data?._id
                    });

                } catch (error) {
                    processResults.push({
                        ...result,
                        status: "error",
                        message: error.response?.data?.message || error.message || "Failed to create student"
                    });
                }

                // Update results progressively
                setUploadResults([...processResults]);
            }

            // Final summary
            const successful = processResults.filter(r => r.status === "success").length;
            const failed = processResults.filter(r => r.status === "error").length;

            // Set success message at bottom
            const finalMessage = `Bulk upload completed: ${successful} successful, ${failed} failed out of ${processResults.length} total rows`;
            setSuccessMessage(finalMessage);
            setShowSuccessAlert(true);

        } catch (error) {
            console.error("Bulk upload error:", error);
            setAlert({
                type: "danger",
                message: error.message || "Failed to process CSV file"
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle login redirect
    const handleLoginRedirect = () => {
        setShowLoginModal(false);
        navigate('/exam-user-login');
    };

    // ---------- New helper: download only failed/invalid rows as CSV ----------
    const downloadFailedEntriesCSV = () => {
        const failedRows = uploadResults.filter(r => (r.status === "error") || (!r.isValid));
        if (!failedRows.length) return;

        // Determine headers union from data keys (preserve reasonable order if present)
        const headerSet = new Set();
        // preferred order if keys present:
        const preferred = ["srn", "name", "father", "mother", "dob", "gender", "category", "aadhar", "mobile", "whatsapp", "houseNumber", "cityTownVillage", "addressBlock", "addressDistrict", "addressState", "previousClassAnnualExamPercentage"];
        preferred.forEach(h => headerSet.add(h));
        // add any extra keys present
        failedRows.forEach(r => {
            Object.keys(r.data || {}).forEach(k => headerSet.add(k));
        });

        // Add failureReason column to headers so it's downloaded in CSV
        headerSet.add("failureReason");

        const headers = Array.from(headerSet);

        const csvEscape = (val) => {
            if (val === null || val === undefined) return "";
            const s = String(val);
            if (s.includes(",") || s.includes('"') || s.includes("\n")) {
                return `"${s.replace(/"/g, '""')}"`;
            }
            return s;
        };

        let csv = headers.join(",") + "\n";
        failedRows.forEach(r => {
            const failureReason = r.status === "error" ? (r.message || "") : (!r.isValid ? r.errors.join(", ") : "");
            const row = headers.map(h => {
                if (h === "failureReason") return csvEscape(failureReason);
                return csvEscape(r.data?.[h] ?? "");
            });
            csv += row.join(",") + "\n";
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `failed_bulk_rows_${selectedClass || "class"}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    // ------------------------------------------------------------------------

    return (
        <Container fluid className="py-3">
            {alert && (
                <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
                    {alert.message}
                </Alert>
            )}

            {/* Login Required Modal */}
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Login Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Please login first to perform bulk upload operations.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleLoginRedirect}>
                        Login Now
                    </Button>
                </Modal.Footer>
            </Modal>

            <Row>
                <Col lg={12}>
                    <Card className="mb-4" style={{ display: 'flex' }}>
                        <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
                            Bulk Student Registration (बल्क छात्र पंजीकरण)
                        </Card.Header>
                        <Card.Body>


                            {/* Instructions Section */}
                            <Card className="mb-4 border-warning">
                                <Card.Header style={{ backgroundColor: "#fff3cd", fontWeight: 600 }}>
                                    Instructions / निर्देश
                                </Card.Header>



                                <div style={{ display: 'flex' }}>

<Row className="w-100 gx-4">
  {/* LEFT: Instructions */}
  <Col xs={12} md={6} className="d-flex flex-column" style={{ minWidth: 0 }}>
    <Card.Body className="h-100 d-flex flex-column justify-content-start">
      <ol className="mb-0" style={{ paddingLeft: '1.25rem', width: '100%' }}>
        <li style={{ textAlign: 'left' }}>
          Select Class, District, Block, and School first (पहले कक्षा, जिला, ब्लॉक और स्कूल चुनें)
        </li>
        <li style={{ textAlign: 'left' }}>Download the CSV template (CSV टेम्पलेट डाउनलोड करें)</li>
        <li style={{ textAlign: 'left' }}>Fill the template with student data (टेम्पलेट में छात्र डेटा भरें)</li>
        <li style={{ textAlign: 'left' }}>
          <strong>
            Date of Birth must be in DD-MM-YYYY format (e.g., 01-01-2008) (जन्म तिथि DD-MM-YYYY फॉर्मेट में होनी चाहिए)
          </strong>
        </li>
        <li style={{ textAlign: 'left' }}>
          School details will be automatically filled based on your dropdown selection. You do not need to fill them manually in the CSV template.(स्कूल की जानकारी आपके ड्रॉपडाउन चयन के आधार पर अपने-आप भर जाएगी। आपको इन्हें CSV टेम्पलेट में मैन्युअली भरने की आवश्यकता नहीं है।)
        </li>
      </ol>
    </Card.Body>
  </Col>

  {/* RIGHT: Upload / Form */}
  <Col xs={12} md={6} className="d-flex flex-column" style={{ minWidth: 0 }}>
    <Card.Body className="h-100 d-flex flex-column justify-content-start">
      <Row>
        <Col style={{ minWidth: 0 }}>
          <Form.Group className="mb-3">
            <Form.Label>Select Class (कक्षा चुनें):</Form.Label>
            <div style={{ minWidth: 0 }}>
              <Select
                value={classOptions.find(opt => opt.value === selectedClass)}
                options={classOptions}
                onChange={(opt) => setSelectedClass(opt ? opt.value : "")}
                placeholder="Choose class..."
                // ensure react-select uses full width
                styles={{
                  container: (provided) => ({ ...provided, width: '100%' }),
                  control: (provided) => ({ ...provided, minHeight: '38px' })
                }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <District_block_school_manual_school_name_dependentDropdown />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col style={{ minWidth: 0 }}>
          <Button
            variant="outline-primary"
            onClick={downloadTemplate}
            disabled={!isDownloadEnabled}
            className="w-100"
          >
            Download CSV Template
          </Button>
          <small className="text-muted d-block mt-1">
            {!isDownloadEnabled
              ? "Select class and school details to enable download"
              : "Template will include DD-MM-YYYY date format"}
          </small>

          <Form.Group className="mt-3">
            <Form.Label>Upload CSV File (CSV फ़ाइल अपलोड करें):</Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={!selectedClass || !districtContext || !blockContext || !schoolContext || loading}
            />
            <Form.Text className="text-muted">
              {!selectedClass || !districtContext || !blockContext || !schoolContext
                ? "Please select Class, District, Block and School first"
                : "CSV file must use DD-MM-YYYY format for dates"}
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {csvFile && (
        <Row className="mt-3">
          <Col style={{ minWidth: 0 }}>
            <Button
              variant="primary"
              onClick={processBulkUpload}
              disabled={loading || !isUploadEnabled}
              className="w-100"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Processing...
                </>
              ) : (
                "Start Bulk Upload"
              )}
            </Button>
            {!isUploadEnabled && (
              <small className="text-danger d-block mt-1">
                Please ensure all fields are selected and CSV file is uploaded
              </small>
            )}
          </Col>
        </Row>
      )}
    </Card.Body>
  </Col>
</Row>
                                </div>



                            </Card>
                            <Card>

                            </Card>

                        </Card.Body>
                    </Card>

                    {/* Results Table */}
                    {uploadResults.length > 0 && (
                        <Card>
                            <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
                                Upload Results (अपलोड परिणाम)
                            </Card.Header>
                            <Card.Body>
                                {/* Success Alert at Bottom */}
                                {showSuccessAlert && (
                                    <Alert variant="success" className="mb-3">
                                        {successMessage}
                                    </Alert>
                                )}

                                {/* Bulk Upload Again Button */}
                                <div className="mb-3">
                                    <Button
                                        variant="outline-primary"
                                        onClick={clearAllData}
                                        className="w-100"
                                    >
                                        Bulk Upload Again
                                    </Button>
                                </div>

                                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    <Table striped bordered hover size="sm">
                                        <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
                                            <tr>
                                                <th>Row</th>
                                                <th>SRN</th>
                                                <th>Name</th>
                                                {/* DOB column removed as requested */}
                                                <th>Status</th>
                                                <th>Failed Status</th>
                                                <th>Failure Reason</th>
                                                <th>Message</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {uploadResults.map((result, index) => {
                                                const failureReason = result.status === "error"
                                                    ? (result.message || "")
                                                    : (!result.isValid ? result.errors.join(", ") : "");
                                                return (
                                                    <tr key={index}>
                                                        <td>{result.rowIndex}</td>
                                                        <td>{result.data.srn}</td>
                                                        <td>{result.data.name}</td>
                                                        {/* DOB column removed from UI */}
                                                        <td>
                                                            <span
                                                                className={`badge ${result.status === "success"
                                                                    ? "bg-success"
                                                                    : result.status === "error"
                                                                        ? "bg-danger"
                                                                        : result.isValid
                                                                            ? "bg-warning"
                                                                            : "bg-danger"
                                                                    }`}
                                                            >
                                                                {result.status === "success"
                                                                    ? "Success"
                                                                    : result.status === "error"
                                                                        ? "Error"
                                                                        : result.isValid
                                                                            ? "Valid"
                                                                            : "Invalid"}
                                                            </span>
                                                        </td>

                                                        {/* Failed Status column showing failure messages */}
                                                        <td>
                                                            {result.status === "error"
                                                                ? result.message
                                                                : !result.isValid
                                                                    ? result.errors.join(", ")
                                                                    : ""}
                                                        </td>

                                                        {/* New Failure Reason column */}
                                                        <td>{failureReason}</td>

                                                        <td>
                                                            {result.status === "success" && "Student created successfully"}
                                                            {result.status === "error" && result.message}
                                                            {!result.status && !result.isValid && result.errors.join(", ")}
                                                            {!result.status && result.isValid && "Ready for upload"}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>

                                {/* CSV download button for only failed/invalid rows (just below table) */}
                                <div className="mt-3 d-flex gap-2">
                                    <Button
                                        variant="outline-danger"
                                        onClick={downloadFailedEntriesCSV}
                                        disabled={uploadResults.filter(r => (r.status === "error") || (!r.isValid)).length === 0}
                                    >
                                        Download Failed Entries (CSV)
                                    </Button>
                                </div>

                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};
