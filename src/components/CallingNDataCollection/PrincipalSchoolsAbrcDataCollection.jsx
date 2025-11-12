


// import React, {useState, useEffect, useContext} from "react";
// import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi";
// import { UserContext } from "../NewContextApis/UserContext";
// import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns";

// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import { updateAbrcPrincipal } from "../../services/DistrictBLockSchoolServices/DistrictBlockSchoolService";

// export const PrincipalSchoolsAbrcDataCollection = ()=>{

//   //Context api----------------------------------
// const {userData, setUserData}  =  useContext(UserContext)

//   const { districtBlockSchoolData, loadingDBS } =
//     useDistrictBlockSchool() || {};
//   const dbsData = Array.isArray(districtBlockSchoolData)
//     ? districtBlockSchoolData
//     : [];

//     //-------------------------------------------------------


// console.log(districtBlockSchoolData)


// return(





//   <>
  

//   </>
// )
// }



// // src/components/PrincipalSchoolsAbrcDataCollection.jsx
// import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
// import { UserContext } from "../NewContextApis/UserContext";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import { updateAbrcPrincipal as updateAbrcPrincipalService } from "../../services/DistrictBLockSchoolServices/DistrictBlockSchoolService";

// /**
//  * PrincipalSchoolsAbrcDataCollection
//  * - Uses react-select for dropdowns
//  * - Validates contact numbers to exactly 10 digits
//  * - Single Submit button which updates:
//  *    - cluster record (isCluster: true + abrc fields)
//  *    - each school row (isCluster true WHEN schoolRecordId === selectedCluster, otherwise false)
//  * - Shows loader while submitting, clears form on success
//  */

// const phoneIsValid = (val) => {
//   if (!val && val !== "") return false;
//   const str = String(val).trim();
//   return /^\d{10}$/.test(str);
// };

// export const PrincipalSchoolsAbrcDataCollection = () => {
//   const { userData } = useContext(UserContext) || {};
//   const { districtBlockSchoolData = [], loadingDBS } = useDistrictBlockSchool() || {};

//   // selected options state (react-select values)
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedCluster, setSelectedCluster] = useState(null);

//   // ABRC inputs (for selected cluster)
//   const [abrcName, setAbrcName] = useState("");
//   const [abrcContact, setAbrcContact] = useState("");

//   // rows: each row { schoolRecordId, centerName, principal, princiaplContact }
//   const [rows, setRows] = useState([]);
//   const [submitting, setSubmitting] = useState(false);

//   // Derived option lists for react-select
//   const districtOptions = React.useMemo(() => {
//     const map = new Map();
//     (districtBlockSchoolData || []).forEach(item => {
//       if (!map.has(item.districtId)) {
//         map.set(item.districtId, { value: item.districtId, label: item.districtName });
//       }
//     });
//     return Array.from(map.values());
//   }, [districtBlockSchoolData]);

//   const blockOptions = React.useMemo(() => {
//     if (!selectedDistrict) return [];
//     const map = new Map();
//     districtBlockSchoolData.forEach(item => {
//       if (item.districtId === selectedDistrict.value && !map.has(item.blockId)) {
//         map.set(item.blockId, { value: item.blockId, label: item.blockName });
//       }
//     });
//     return Array.from(map.values());
//   }, [districtBlockSchoolData, selectedDistrict]);

//   const clusterOptions = React.useMemo(() => {
//     if (!selectedDistrict || !selectedBlock) return [];
//     const map = new Map();
//     districtBlockSchoolData.forEach(item => {
//       if (item.districtId === selectedDistrict.value && item.blockId === selectedBlock.value) {
//         if (!map.has(item._id)) {
//           map.set(item._id, { value: item._id, label: `${item.centerName} (${item.centerId})` });
//         }
//       }
//     });
//     return Array.from(map.values());
//   }, [districtBlockSchoolData, selectedDistrict, selectedBlock]);

//   const schoolsInBlockOptions = React.useMemo(() => {
//     if (!selectedDistrict || !selectedBlock) return [];
//     return districtBlockSchoolData
//       .filter(item => item.districtId === selectedDistrict.value && item.blockId === selectedBlock.value)
//       .map(item => ({
//         value: item._id,
//         label: `${item.centerName} (${item.centerId})`,
//         meta: item
//       }));
//   }, [districtBlockSchoolData, selectedDistrict, selectedBlock]);

//   // Reset dependent selects / fields when higher-level selection changes
//   useEffect(() => {
//     setSelectedBlock(null);
//     setSelectedCluster(null);
//     setAbrcName("");
//     setAbrcContact("");
//     setRows([]);
//   }, [selectedDistrict]);

//   useEffect(() => {
//     setSelectedCluster(null);
//     setAbrcName("");
//     setAbrcContact("");
//     setRows([]);
//   }, [selectedBlock]);

//   // When cluster chosen, prefill ABRC fields from that record and create initial row for that cluster
//   useEffect(() => {
//     if (!selectedCluster) {
//       setAbrcName("");
//       setAbrcContact("");
//       setRows([]);
//       return;
//     }
//     const rec = districtBlockSchoolData.find(r => r._id === selectedCluster.value);
//     if (rec) {
//       setAbrcName(rec.abrc || "");
//       setAbrcContact(rec.abrcContact || "");
//       setRows([{
//         schoolRecordId: rec._id,
//         centerName: rec.centerName,
//         principal: rec.principal || "",
//         princiaplContact: rec.princiaplContact || ""
//       }]);
//     }
//   }, [selectedCluster, districtBlockSchoolData]);

//   // Add a new empty row (default selects first school in block)
//   const handleAddRow = () => {
//     const first = schoolsInBlockOptions[0];
//     setRows(prev => [
//       ...prev,
//       {
//         schoolRecordId: first ? first.value : "",
//         centerName: first ? first.label : "",
//         principal: "",
//         princiaplContact: ""
//       }
//     ]);
//   };

//   const handleRemoveRow = (index) => {
//     setRows(prev => prev.filter((_, i) => i !== index));
//   };

//   const updateRow = (index, field, value) => {
//     setRows(prev => {
//       const n = prev.map(r => ({ ...r }));
//       n[index][field] = value;
//       if (field === "schoolRecordId") {
//         // update centerName and optionally prefill principal/contact from source
//         const meta = schoolsInBlockOptions.find(s => s.value === value)?.meta;
//         n[index].centerName = meta ? meta.centerName : "";
//         n[index].principal = meta ? (meta.principal || "") : "";
//         n[index].princiaplContact = meta ? (meta.princiaplContact || "") : "";
//       }
//       return n;
//     });
//   };

//   // Validate entire form before submit
//   const validateForm = () => {
//     if (!selectedDistrict) return { ok: false, message: "Select district." };
//     if (!selectedBlock) return { ok: false, message: "Select block." };
//     if (!selectedCluster) return { ok: false, message: "Select cluster (school as cluster)." };
//     if (!abrcName || !abrcName.trim()) return { ok: false, message: "Enter ABRC name." };
//     if (!phoneIsValid(abrcContact)) return { ok: false, message: "ABRC contact must be exactly 10 digits." };
//     if (!rows.length) return { ok: false, message: "Add at least one school row." };

//     for (let i = 0; i < rows.length; i++) {
//       const r = rows[i];
//       if (!r.schoolRecordId) return { ok: false, message: `Select school in row ${i + 1}.` };
//       if (!r.principal || !r.principal.trim()) return { ok: false, message: `Enter principal name in row ${i + 1}.` };
//       if (!phoneIsValid(r.princiaplContact)) return { ok: false, message: `Principal contact must be exactly 10 digits in row ${i + 1}.` };
//     }

//     return { ok: true };
//   };

//   // Submit handler: update cluster and each row (schools)
//   const handleSubmit = async () => {
//     const check = validateForm();
//     if (!check.ok) {
//       alert(check.message);
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const updater = userData?. _id || userData?.email || userData?.name || null;

//       const requests = [];

//       // 1) update cluster record (isCluster true + abrc fields)
//       if (selectedCluster) {
//         const clusterPayload = {
//           _id: selectedCluster.value,
//           isCluster: true,
//           abrc: abrcName || null,
//           abrcContact: abrcContact || null,
//           principalAbrcDataUpdatedBy: updater
//         };
//         requests.push(updateAbrcPrincipalService(clusterPayload));
//       }

//       // 2) update each school row
//       rows.forEach(r => {
//         const isRowCluster = selectedCluster && r.schoolRecordId === selectedCluster.value;
//         const body = {
//           _id: r.schoolRecordId,
//           isCluster: !!isRowCluster, // true when this row is the selected cluster school
//           principal: r.principal || null,
//           princiaplContact: r.princiaplContact || null,
//           // also attach same ABRC/contact to school records
//           abrc: abrcName || null,
//           abrcContact: abrcContact || null,
//           principalAbrcDataUpdatedBy: userData?.user?._id
//         };
//         requests.push(updateAbrcPrincipalService(body));
//       });

//       const results = await Promise.allSettled(requests);

//       const rejected = results.filter(r => r.status === "rejected");
//       const failedResponses = results.filter(r => r.status === "fulfilled" && r.value && r.value.status !== "Success");

//       if (rejected.length || failedResponses.length) {
//         console.error("Some requests failed", { rejected, failedResponses });
//         alert("Submission completed with some errors. Check console for details.");
//       } else {
//         alert("Submitted successfully.");
//         // Clear form so user can add new entry
//         setSelectedDistrict(null);
//         setSelectedBlock(null);
//         setSelectedCluster(null);
//         setAbrcName("");
//         setAbrcContact("");
//         setRows([]);
//       }
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert("Error submitting data. Check console.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div style={{ padding: 16 }}>
//       <h4>Cluster, ABRC, Principal Details</h4>
//       <hr></hr>

//       <div style={{ marginBottom: 12 }}>
//         <label style={{ display: "block", marginBottom: 6 }}>District</label>
//         <Select
//           options={districtOptions}
//           value={selectedDistrict}
//           onChange={setSelectedDistrict}
//           placeholder="Select district..."
//           isClearable
//         />
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <label style={{ display: "block", marginBottom: 6 }}>Block</label>
//         <Select
//           options={blockOptions}
//           value={selectedBlock}
//           onChange={setSelectedBlock}
//           placeholder="Select block..."
//           isClearable
//           isDisabled={!selectedDistrict}
//         />
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <label style={{ display: "block", marginBottom: 6 }}>Cluster (school as cluster)</label>
//         <Select
//           options={clusterOptions}
//           value={selectedCluster}
//           onChange={setSelectedCluster}
//           placeholder="Select cluster..."
//           isClearable
//           isDisabled={!selectedBlock}
//         />
//       </div>

//       {/* ABRC inputs */}
//       <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }}>
//         <h5 style={{ marginTop: 0 }}>ABRC Name (for selected cluster)</h5>

//         <div style={{ marginBottom: 8 }}>
//           <label style={{ display: "block", marginBottom: 6 }}>ABRC Name</label>
//           <input
//             value={abrcName}
//             onChange={(e) => setAbrcName(e.target.value)}
//             placeholder="Enter ABRC name"
//             style={{ width: "100%", padding: 8, borderRadius: 6 }}
//             disabled={!selectedCluster}
//           />
//         </div>

//         <div style={{ marginBottom: 8 }}>
//           <label style={{ display: "block", marginBottom: 6 }}>ABRC Contact</label>
//           <input
//             value={abrcContact}
//             onChange={(e) => setAbrcContact(e.target.value.replace(/\D/g, ""))} // only digits
//             placeholder="10 digit contact"
//             style={{ width: "100%", padding: 8, borderRadius: 6 }}
//             disabled={!selectedCluster}
//             maxLength={10}
//           />
//           {!phoneIsValid(abrcContact) && abrcContact !== "" && (
//             <div style={{ color: "red", marginTop: 6 }}>Contact must be exactly 10 digits.</div>
//           )}
//         </div>
//       </div>

//       {/* Rows section */}
//       <div style={{ marginBottom: 12 }}>
//         <h5>Schools & Principals and their contact details.</h5>
//         {rows.map((row, idx) => (
//           <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
//             <div style={{ flex: 2 }}>
//               <Select
//                 options={schoolsInBlockOptions}
//                 value={schoolsInBlockOptions.find(o => o.value === row.schoolRecordId) || null}
//                 onChange={(opt) => updateRow(idx, "schoolRecordId", opt ? opt.value : "")}
//                 placeholder="Select school..."
//                 isClearable
//                 isDisabled={!selectedBlock}
//               />
//             </div>
//             <div style={{ flex: 1 }}>
//               <input
//                 value={row.principal}
//                 onChange={(e) => updateRow(idx, "principal", e.target.value)}
//                 placeholder="Principal name"
//                 style={{ width: "100%", padding: 8, borderRadius: 6 }}
//               />
//             </div>
//             <div style={{ width: 160 }}>
//               <input
//                 value={row.princiaplContact}
//                 onChange={(e) => updateRow(idx, "princiaplContact", e.target.value.replace(/\D/g, ""))}
//                 placeholder="10 digit contact"
//                 style={{ width: "100%", padding: 8, borderRadius: 6 }}
//                 maxLength={10}
//               />
//               {!phoneIsValid(row.princiaplContact) && row.princiaplContact !== "" && (
//                 <div style={{ color: "red", fontSize: 12 }}>10 digits required</div>
//               )}
//             </div>

//             <div>
//               <button type="button" onClick={() => handleRemoveRow(idx)} style={{ padding: "8px 12px" }}>
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}

//         <div style={{ marginTop: 8 }}>
//           <button
//             type="button"
//             onClick={handleAddRow}
//             disabled={!selectedBlock}
//             style={{ padding: "8px 12px", marginRight: 8 }}
//           >
//             + Add row
//           </button>

//           {/* Submit button (the only save action) */}
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={submitting || !selectedCluster}
//             style={{ padding: "8px 12px", background: submitting ? "#ccc" : "#2b6cff", color: "#fff", border: "none", borderRadius: 4 }}
//           >
//             {submitting ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//       </div>

//       {loadingDBS && <div>Loading schools...</div>}
//     </div>
//   );
// };

// export default PrincipalSchoolsAbrcDataCollection;






// // src/components/PrincipalSchoolsAbrcDataCollection.jsx
// import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
// import { UserContext } from "../NewContextApis/UserContext";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import { updateAbrcPrincipal as updateAbrcPrincipalService } from "../../services/DistrictBLockSchoolServices/DistrictBlockSchoolService";

// /**
//  * PrincipalSchoolsAbrcDataCollection
//  * - Uses react-select for dropdowns
//  * - Allows manual school entry per row when checkbox checked
//  * - Validates contact numbers to exactly 10 digits
//  * - Single Submit button updates cluster and each row (existing or manual-created)
//  */

// const phoneIsValid = (val) => {
//   if (!val && val !== "") return false;
//   const str = String(val).trim();
//   return /^\d{10}$/.test(str);
// };

// export const PrincipalSchoolsAbrcDataCollection = () => {
//   const { userData } = useContext(UserContext) || {};
//   const { districtBlockSchoolData = [], loadingDBS } = useDistrictBlockSchool() || {};

//   // selected options state (react-select values)
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedCluster, setSelectedCluster] = useState(null);

//   // ABRC inputs (for selected cluster)
//   const [abrcName, setAbrcName] = useState("");
//   const [abrcContact, setAbrcContact] = useState("");

//   // rows: each row { schoolRecordId, centerName, principal, princiaplContact, manual:bool, manualCenterName, manualCenterId }
//   const [rows, setRows] = useState([]);
//   const [submitting, setSubmitting] = useState(false);

//   // Derived option lists for react-select
//   const districtOptions = React.useMemo(() => {
//     const map = new Map();
//     (districtBlockSchoolData || []).forEach(item => {
//       if (!map.has(item.districtId)) {
//         map.set(item.districtId, { value: item.districtId, label: item.districtName });
//       }
//     });
//     return Array.from(map.values());
//   }, [districtBlockSchoolData]);

//   const blockOptions = React.useMemo(() => {
//     if (!selectedDistrict) return [];
//     const map = new Map();
//     districtBlockSchoolData.forEach(item => {
//       if (item.districtId === selectedDistrict.value && !map.has(item.blockId)) {
//         map.set(item.blockId, { value: item.blockId, label: item.blockName });
//       }
//     });
//     return Array.from(map.values());
//   }, [districtBlockSchoolData, selectedDistrict]);

//   const clusterOptions = React.useMemo(() => {
//     if (!selectedDistrict || !selectedBlock) return [];
//     const map = new Map();
//     districtBlockSchoolData.forEach(item => {
//       if (item.districtId === selectedDistrict.value && item.blockId === selectedBlock.value) {
//         if (!map.has(item._id)) {
//           map.set(item._id, { value: item._id, label: `${item.centerName} (${item.centerId})` });
//         }
//       }
//     });
//     return Array.from(map.values());
//   }, [districtBlockSchoolData, selectedDistrict, selectedBlock]);

//   const schoolsInBlockOptions = React.useMemo(() => {
//     if (!selectedDistrict || !selectedBlock) return [];
//     return districtBlockSchoolData
//       .filter(item => item.districtId === selectedDistrict.value && item.blockId === selectedBlock.value)
//       .map(item => ({
//         value: item._id,
//         label: `${item.centerName} (${item.centerId})`,
//         meta: item
//       }));
//   }, [districtBlockSchoolData, selectedDistrict, selectedBlock]);

//   // Reset dependent selects / fields when higher-level selection changes
//   useEffect(() => {
//     setSelectedBlock(null);
//     setSelectedCluster(null);
//     setAbrcName("");
//     setAbrcContact("");
//     setRows([]);
//   }, [selectedDistrict]);

//   useEffect(() => {
//     setSelectedCluster(null);
//     setAbrcName("");
//     setAbrcContact("");
//     setRows([]);
//   }, [selectedBlock]);

//   // When cluster chosen, prefill ABRC fields from that record and create initial row for that cluster
//   useEffect(() => {
//     if (!selectedCluster) {
//       setAbrcName("");
//       setAbrcContact("");
//       setRows([]);
//       return;
//     }
//     const rec = districtBlockSchoolData.find(r => r._id === selectedCluster.value);
//     if (rec) {
//       setAbrcName(rec.abrc || "");
//       setAbrcContact(rec.abrcContact || "");
//       setRows([{
//         schoolRecordId: rec._id,
//         centerName: rec.centerName,
//         principal: rec.principal || "",
//         princiaplContact: rec.princiaplContact || "",
//         manual: false,
//         manualCenterName: "",
//         manualCenterId: ""
//       }]);
//     }
//   }, [selectedCluster, districtBlockSchoolData]);

//   // Add a new empty row (default selects first school in block)
//   const handleAddRow = () => {
//     const first = schoolsInBlockOptions[0];
//     setRows(prev => [
//       ...prev,
//       {
//         schoolRecordId: first ? first.value : "",
//         centerName: first ? first.label : "",
//         principal: "",
//         princiaplContact: "",
//         manual: false,
//         manualCenterName: "",
//         manualCenterId: ""
//       }
//     ]);
//   };

//   const handleRemoveRow = (index) => {
//     setRows(prev => prev.filter((_, i) => i !== index));
//   };

//   const updateRow = (index, field, value) => {
//     setRows(prev => {
//       const n = prev.map(r => ({ ...r }));
//       n[index][field] = value;
//       if (field === "schoolRecordId") {
//         // update centerName and optionally prefill principal/contact from source
//         const meta = schoolsInBlockOptions.find(s => s.value === value)?.meta;
//         n[index].centerName = meta ? meta.centerName : "";
//         n[index].principal = meta ? (meta.principal || "") : "";
//         n[index].princiaplContact = meta ? (meta.princiaplContact || "") : "";
//         // ensure manual flag false when selecting from dropdown
//         n[index].manual = false;
//         n[index].manualCenterName = "";
//         n[index].manualCenterId = "";
//       }
//       if (field === "manual") {
//         // if manual set to true, clear schoolRecordId
//         if (value === true) {
//           n[index].schoolRecordId = "";
//           n[index].centerName = "";
//         } else {
//           // turning manual off - do nothing else
//           n[index].manualCenterName = "";
//           n[index].manualCenterId = "";
//         }
//       }
//       return n;
//     });
//   };

//   // Validate entire form before submit
//   const validateForm = () => {
//     if (!selectedDistrict) return { ok: false, message: "Select district." };
//     if (!selectedBlock) return { ok: false, message: "Select block." };
//     if (!selectedCluster) return { ok: false, message: "Select cluster (school as cluster)." };
//     if (!abrcName || !abrcName.trim()) return { ok: false, message: "Enter ABRC name." };
//     if (!phoneIsValid(abrcContact)) return { ok: false, message: "ABRC contact must be exactly 10 digits." };
//     if (!rows.length) return { ok: false, message: "Add at least one school row." };

//     for (let i = 0; i < rows.length; i++) {
//       const r = rows[i];
//       if (r.manual) {
//         // manual school -> require manualCenterName & manualCenterId
//         if (!r.manualCenterName || !r.manualCenterName.trim()) return { ok: false, message: `Enter manual school name in row ${i + 1}.` };
//         if (!r.manualCenterId || !r.manualCenterId.trim()) return { ok: false, message: `Enter manual school code in row ${i + 1}.` };
//       } else {
//         if (!r.schoolRecordId) return { ok: false, message: `Select school in row ${i + 1}.` };
//       }

//       if (!r.principal || !r.principal.trim()) return { ok: false, message: `Enter principal name in row ${i + 1}.` };
//       if (!phoneIsValid(r.princiaplContact)) return { ok: false, message: `Principal contact must be exactly 10 digits in row ${i + 1}.` };
//     }

//     return { ok: true };
//   };

//   // Submit handler: update cluster and each row (existing or manual)
//   const handleSubmit = async () => {
//     const check = validateForm();
//     if (!check.ok) {
//       alert(check.message);
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const updater = userData?.user?._id || userData?.email || userData?.name || null;

//       const requests = [];

//       // 1) update cluster record (isCluster true + abrc fields) - cluster selected is existing _id
//       if (selectedCluster) {
//         const clusterPayload = {
//           _id: selectedCluster.value,
//           isCluster: true,
//           abrc: abrcName || null,
//           abrcContact: abrcContact || null,
//           principalAbrcDataUpdatedBy: updater
//         };
//         requests.push(updateAbrcPrincipalService(clusterPayload));
//       }

//       // 2) for each row - either update existing record (if not manual) OR create new record (manual)
//       rows.forEach(r => {
//         if (r.manual) {
//           // create manual school => send manualSchool object, no _id
//           const manual = {
//             districtId: selectedDistrict.value,
//             districtName: selectedDistrict.label,
//             blockId: selectedBlock.value,
//             blockName: selectedBlock.label,
//             centerId: r.manualCenterId,
//             centerName: r.manualCenterName,
//             schoolType: "Haryana School"
//           };

//           const body = {
//             // no _id -> controller will create
//             isCluster: false, // manual school by default not the selected cluster unless user selects it later
//             abrc: abrcName || null,
//             abrcContact: abrcContact || null,
//             principal: r.principal || null,
//             princiaplContact: r.princiaplContact || null,
//             principalAbrcDataUpdatedBy: updater,
//             manualSchool: manual
//           };

//           requests.push(updateAbrcPrincipalService(body));
//         } else {
//           // existing school -> update that record
//           const isRowCluster = selectedCluster && r.schoolRecordId === selectedCluster.value;
//           const body = {
//             _id: r.schoolRecordId,
//             isCluster: !!isRowCluster,
//             principal: r.principal || null,
//             princiaplContact: r.princiaplContact || null,
//             abrc: abrcName || null,
//             abrcContact: abrcContact || null,
//             principalAbrcDataUpdatedBy: updater
//           };
//           requests.push(updateAbrcPrincipalService(body));
//         }
//       });

//       const results = await Promise.allSettled(requests);

//       const rejected = results.filter(r => r.status === "rejected");
//       const failedResponses = results.filter(r => r.status === "fulfilled" && r.value && r.value.status !== "Success");

//       if (rejected.length || failedResponses.length) {
//         console.error("Some requests failed", { rejected, failedResponses });
//         alert("Submission completed with some errors. Check console for details.");
//       } else {
//         alert("Submitted successfully.");
//         // Clear form so user can add new entry
//         setSelectedDistrict(null);
//         setSelectedBlock(null);
//         setSelectedCluster(null);
//         setAbrcName("");
//         setAbrcContact("");
//         setRows([]);
//       }
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert("Error submitting data. Check console.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div style={{ padding: 16 }}>
//       <h4>Cluster, ABRC, Principal Details</h4>
//       <hr />

//       <div style={{ marginBottom: 12 }}>
//         <label style={{ display: "block", marginBottom: 6 }}>District</label>
//         <Select
//           options={districtOptions}
//           value={selectedDistrict}
//           onChange={setSelectedDistrict}
//           placeholder="Select district..."
//           isClearable
//         />
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <label style={{ display: "block", marginBottom: 6 }}>Block</label>
//         <Select
//           options={blockOptions}
//           value={selectedBlock}
//           onChange={setSelectedBlock}
//           placeholder="Select block..."
//           isClearable
//           isDisabled={!selectedDistrict}
//         />
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <label style={{ display: "block", marginBottom: 6 }}>Cluster (school as cluster)</label>
//         <Select
//           options={clusterOptions}
//           value={selectedCluster}
//           onChange={setSelectedCluster}
//           placeholder="Select cluster..."
//           isClearable
//           isDisabled={!selectedBlock}
//         />
//       </div>

//       {/* ABRC inputs */}
//       <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }}>
//         <h5 style={{ marginTop: 0 }}>ABRC Name (for selected cluster)</h5>

//         <div style={{ marginBottom: 8 }}>
//           <label style={{ display: "block", marginBottom: 6 }}>ABRC Name</label>
//           <input
//             value={abrcName}
//             onChange={(e) => setAbrcName(e.target.value)}
//             placeholder="Enter ABRC name"
//             style={{ width: "100%", padding: 8, borderRadius: 6 }}
//             disabled={!selectedCluster}
//           />
//         </div>

//         <div style={{ marginBottom: 8 }}>
//           <label style={{ display: "block", marginBottom: 6 }}>ABRC Contact</label>
//           <input
//             value={abrcContact}
//             onChange={(e) => setAbrcContact(e.target.value.replace(/\D/g, ""))} // only digits
//             placeholder="10 digit contact"
//             style={{ width: "100%", padding: 8, borderRadius: 6 }}
//             disabled={!selectedCluster}
//             maxLength={10}
//           />
//           {!phoneIsValid(abrcContact) && abrcContact !== "" && (
//             <div style={{ color: "red", marginTop: 6 }}>Contact must be exactly 10 digits.</div>
//           )}
//         </div>
//       </div>

//       {/* Rows section */}
//       <div style={{ marginBottom: 12 }}>
//         <h5>Schools & Principals and their contact details.</h5>
//         {rows.map((row, idx) => (
//           <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
//             <div style={{ flex: 2 }}>
//               {!row.manual ? (
//                 <Select
//                   options={schoolsInBlockOptions}
//                   value={schoolsInBlockOptions.find(o => o.value === row.schoolRecordId) || null}
//                   onChange={(opt) => updateRow(idx, "schoolRecordId", opt ? opt.value : "")}
//                   placeholder="Select school..."
//                   isClearable
//                   isDisabled={!selectedBlock}
//                 />
//               ) : (
//                 <div style={{ display: "flex", gap: 6 }}>
//                   <input
//                     value={row.manualCenterName}
//                     onChange={(e) => updateRow(idx, "manualCenterName", e.target.value)}
//                     placeholder="Manual school name"
//                     style={{ width: "100%", padding: 8, borderRadius: 6 }}
//                     disabled={!selectedBlock}
//                   />
//                   <input
//                     value={row.manualCenterId}
//                     onChange={(e) => updateRow(idx, "manualCenterId", e.target.value.replace(/\s/g, ""))}
//                     placeholder="Code"
//                     style={{ width: 140, padding: 8, borderRadius: 6 }}
//                     disabled={!selectedBlock}
//                   />
//                 </div>
//               )}
//             </div>

//             <div style={{ flex: 1 }}>
//               <input
//                 value={row.principal}
//                 onChange={(e) => updateRow(idx, "principal", e.target.value)}
//                 placeholder="Principal name"
//                 style={{ width: "100%", padding: 8, borderRadius: 6 }}
//               />
//             </div>

//             <div style={{ width: 160 }}>
//               <input
//                 value={row.princiaplContact}
//                 onChange={(e) => updateRow(idx, "princiaplContact", e.target.value.replace(/\D/g, ""))}
//                 placeholder="10 digit contact"
//                 style={{ width: "100%", padding: 8, borderRadius: 6 }}
//                 maxLength={10}
//               />
//               {!phoneIsValid(row.princiaplContact) && row.princiaplContact !== "" && (
//                 <div style={{ color: "red", fontSize: 12 }}>10 digits required</div>
//               )}
//             </div>

//             <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//               <label style={{ fontSize: 12 }}>
//                 <input
//                   type="checkbox"
//                   checked={!!row.manual}
//                   onChange={(e) => updateRow(idx, "manual", e.target.checked)}
//                 />{" "}
//                 School not in dropdown
//               </label>

//               <button type="button" onClick={() => handleRemoveRow(idx)} style={{ padding: "8px 12px" }}>
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}

//         <div style={{ marginTop: 8 }}>
//           <button
//             type="button"
//             onClick={handleAddRow}
//             disabled={!selectedBlock}
//             style={{ padding: "8px 12px", marginRight: 8 }}
//           >
//             + Add row
//           </button>

//           {/* Submit button (the only save action) */}
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={submitting || !selectedCluster}
//             style={{ padding: "8px 12px", background: submitting ? "#ccc" : "#2b6cff", color: "#fff", border: "none", borderRadius: 4 }}
//           >
//             {submitting ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//       </div>

//       {loadingDBS && <div>Loading schools...</div>}
//     </div>
//   );
// };

// export default PrincipalSchoolsAbrcDataCollection;



// // src/components/PrincipalSchoolsAbrcDataCollection.jsx
// import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
// import { UserContext } from "../NewContextApis/UserContext";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import { updateAbrcPrincipal as updateAbrcPrincipalService } from "../../services/DistrictBLockSchoolServices/DistrictBlockSchoolService";

// const phoneIsValid = (val) => /^\d{10}$/.test(String(val).trim() || "");

// export const PrincipalSchoolsAbrcDataCollection = () => {
//   const { userData } = useContext(UserContext) || {};
//   const { districtBlockSchoolData = [], loadingDBS } = useDistrictBlockSchool() || {};

//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedCluster, setSelectedCluster] = useState(null);

//   const [manualCluster, setManualCluster] = useState(false);
//   const [manualClusterName, setManualClusterName] = useState("");
//   const [manualClusterId, setManualClusterId] = useState("");

//   const [abrcName, setAbrcName] = useState("");
//   const [abrcContact, setAbrcContact] = useState("");

//   const [rows, setRows] = useState([]);
//   const [submitting, setSubmitting] = useState(false);

//   const districtOptions = React.useMemo(() => {
//     const map = new Map();
//     districtBlockSchoolData.forEach(item => {
//       if (!map.has(item.districtId)) map.set(item.districtId, { value: item.districtId, label: item.districtName });
//     });
//     return Array.from(map.values());
//   }, [districtBlockSchoolData]);

//   const blockOptions = React.useMemo(() => {
//     if (!selectedDistrict) return [];
//     const map = new Map();
//     districtBlockSchoolData.forEach(item => {
//       if (item.districtId === selectedDistrict.value && !map.has(item.blockId)) {
//         map.set(item.blockId, { value: item.blockId, label: item.blockName });
//       }
//     });
//     return Array.from(map.values());
//   }, [districtBlockSchoolData, selectedDistrict]);

//   const clusterOptions = React.useMemo(() => {
//     if (!selectedDistrict || !selectedBlock) return [];
//     const map = new Map();
//     districtBlockSchoolData.forEach(item => {
//       if (item.districtId === selectedDistrict.value && item.blockId === selectedBlock.value) {
//         if (!map.has(item._id)) {
//           map.set(item._id, { value: item._id, label: `${item.centerName} (${item.centerId})` });
//         }
//       }
//     });
//     return Array.from(map.values());
//   }, [districtBlockSchoolData, selectedDistrict, selectedBlock]);

//   const schoolsInBlockOptions = React.useMemo(() => {
//     if (!selectedDistrict || !selectedBlock) return [];
//     return districtBlockSchoolData
//       .filter(item => item.districtId === selectedDistrict.value && item.blockId === selectedBlock.value)
//       .map(item => ({
//         value: item._id,
//         label: `${item.centerName} (${item.centerId})`,
//         meta: item
//       }));
//   }, [districtBlockSchoolData, selectedDistrict, selectedBlock]);

//   useEffect(() => {
//     setSelectedBlock(null);
//     setSelectedCluster(null);
//     setManualCluster(false);
//     setManualClusterName("");
//     setManualClusterId("");
//     setAbrcName("");
//     setAbrcContact("");
//     setRows([]);
//   }, [selectedDistrict]);

//   useEffect(() => {
//     setSelectedCluster(null);
//     setManualCluster(false);
//     setManualClusterName("");
//     setManualClusterId("");
//     setAbrcName("");
//     setAbrcContact("");
//     setRows([]);
//   }, [selectedBlock]);

//   useEffect(() => {
//     if (!selectedCluster || manualCluster) {
//       if (!manualCluster) {
//         setAbrcName("");
//         setAbrcContact("");
//         setRows([]);
//       }
//       return;
//     }
//     const rec = districtBlockSchoolData.find(r => r._id === selectedCluster.value);
//     if (rec) {
//       setAbrcName(rec.abrc || "");
//       setAbrcContact(rec.abrcContact || "");
//       setRows([{
//         schoolRecordId: rec._id,
//         centerName: rec.centerName,
//         principal: rec.principal || "",
//         princiaplContact: rec.princiaplContact || "",
//         manual: false
//       }]);
//     }
//   }, [selectedCluster, districtBlockSchoolData, manualCluster]);

//   const handleAddRow = () => {
//     const first = schoolsInBlockOptions[0];
//     setRows(prev => [
//       ...prev,
//       {
//         schoolRecordId: first ? first.value : "",
//         centerName: first ? first.label : "",
//         principal: "",
//         princiaplContact: "",
//         manual: false,
//         manualCenterName: "",
//         manualCenterId: ""
//       }
//     ]);
//   };

//   const handleRemoveRow = (index) => {
//     setRows(prev => prev.filter((_, i) => i !== index));
//   };

//   const updateRow = (index, field, value) => {
//     setRows(prev => {
//       const n = [...prev];
//       n[index] = { ...n[index], [field]: value };

//       if (field === "schoolRecordId") {
//         const meta = schoolsInBlockOptions.find(s => s.value === value)?.meta;
//         n[index].centerName = meta ? meta.centerName : "";
//         n[index].principal = meta?.principal || "";
//         n[index].princiaplContact = meta?.princiaplContact || "";
//       }

//       if (field === "manual") {
//         if (value) {
//           n[index].schoolRecordId = "";
//           n[index].centerName = "";
//         } else {
//           n[index].manualCenterName = "";
//           n[index].manualCenterId = "";
//         }
//       }

//       return n;
//     });
//   };

//   const validateForm = () => {
//     if (!selectedDistrict) return { ok: false, message: "Select district." };
//     if (!selectedBlock) return { ok: false, message: "Select block." };
//     if (!selectedCluster && !manualCluster) return { ok: false, message: "Select or add cluster." };
//     if (manualCluster && (!manualClusterName || !manualClusterId)) return { ok: false, message: "Enter manual cluster details." };
//     if (!abrcName) return { ok: false, message: "Enter ABRC name." };
//     if (!phoneIsValid(abrcContact)) return { ok: false, message: "ABRC contact must be 10 digits." };
//     if (!rows.length) return { ok: false, message: "Add at least one school row." };

//     for (let i = 0; i < rows.length; i++) {
//       const r = rows[i];
//       if (!r.manual && !r.schoolRecordId) return { ok: false, message: `Select school in row ${i + 1}.` };
//       if (r.manual && (!r.manualCenterName || !r.manualCenterId))
//         return { ok: false, message: `Enter manual school name/code in row ${i + 1}.` };
//       if (!r.principal) return { ok: false, message: `Enter principal in row ${i + 1}.` };
//       if (!phoneIsValid(r.princiaplContact))
//         return { ok: false, message: `Principal contact must be 10 digits in row ${i + 1}.` };
//     }

//     return { ok: true };
//   };

//   const handleSubmit = async () => {
//     const check = validateForm();
//     if (!check.ok) return alert(check.message);
//     setSubmitting(true);

//     try {
//       const updater = userData?.user?._id || userData?._id || userData?.email || null;
//       const requests = [];
//       const processedCenterIds = new Set();

//       // 1️⃣ First process the cluster (manual or selected)
//       let clusterCenterId = null;
//       let clusterCenterName = null;

//       if (manualCluster) {
//         clusterCenterId = manualClusterId;
//         clusterCenterName = manualClusterName;
        
//         // Check if any manual school has same name and code as cluster
//         const sameSchoolRow = rows.find(r => 
//           r.manual && 
//           r.manualCenterId === clusterCenterId && 
//           r.manualCenterName === clusterCenterName
//         );

//         if (sameSchoolRow) {
//           // CASE 1: Cluster and school are same - single document with both ABRC + Principal
//           const combinedPayload = {
//             isCluster: true,
//             abrc: abrcName,
//             abrcContact: abrcContact,
//             principal: sameSchoolRow.principal,
//             princiaplContact: sameSchoolRow.princiaplContact,
//             principalAbrcDataUpdatedBy: updater,
//             manualSchool: {
//               districtId: selectedDistrict.value,
//               districtName: selectedDistrict.label,
//               blockId: selectedBlock.value,
//               blockName: selectedBlock.label,
//               centerId: clusterCenterId,
//               centerName: clusterCenterName,
//               schoolType: "Haryana School"
//             }
//           };
//           requests.push(updateAbrcPrincipalService(combinedPayload));
//           processedCenterIds.add(clusterCenterId);
//         } else {
//           // CASE 2: Only cluster, no matching school - create cluster only
//           const clusterPayload = {
//             isCluster: true,
//             abrc: abrcName,
//             abrcContact: abrcContact,
//             principalAbrcDataUpdatedBy: updater,
//             manualSchool: {
//               districtId: selectedDistrict.value,
//               districtName: selectedDistrict.label,
//               blockId: selectedBlock.value,
//               blockName: selectedBlock.label,
//               centerId: clusterCenterId,
//               centerName: clusterCenterName,
//               schoolType: "Haryana School"
//             }
//           };
//           requests.push(updateAbrcPrincipalService(clusterPayload));
//           processedCenterIds.add(clusterCenterId);
//         }
//       } else if (selectedCluster) {
//         const clusterRec = districtBlockSchoolData.find(r => r._id === selectedCluster.value);
//         clusterCenterId = clusterRec?.centerId;
//         clusterCenterName = clusterRec?.centerName;
        
//         const clusterPayload = {
//           _id: selectedCluster.value,
//           isCluster: true,
//           abrc: abrcName,
//           abrcContact: abrcContact,
//           principalAbrcDataUpdatedBy: updater
//         };
//         requests.push(updateAbrcPrincipalService(clusterPayload));
//         if (clusterCenterId) processedCenterIds.add(clusterCenterId);
//       }

//       // 2️⃣ Process rows - avoid duplicates for same centerId
//       rows.forEach(r => {
//         if (r.manual) {
//           // For manual schools
//           if (manualCluster && r.manualCenterId === clusterCenterId && r.manualCenterName === clusterCenterName) {
//             // This is the same as cluster - already processed above, skip
//             console.log(`Skipping duplicate manual school: ${r.manualCenterName} (${r.manualCenterId}) - same as cluster`);
//             return;
//           }
          
//           // Different manual school - create new only if not processed
//           if (!processedCenterIds.has(r.manualCenterId)) {
//             const manualBody = {
//               isCluster: false,
//               abrc: abrcName,
//               abrcContact: abrcContact,
//               principal: r.principal,
//               princiaplContact: r.princiaplContact,
//               principalAbrcDataUpdatedBy: updater,
//               manualSchool: {
//                 districtId: selectedDistrict.value,
//                 districtName: selectedDistrict.label,
//                 blockId: selectedBlock.value,
//                 blockName: selectedBlock.label,
//                 centerId: r.manualCenterId,
//                 centerName: r.manualCenterName,
//                 schoolType: "Haryana School"
//               }
//             };
//             requests.push(updateAbrcPrincipalService(manualBody));
//             processedCenterIds.add(r.manualCenterId);
//           }
//         } else {
//           // For existing schools from dropdown
//           const schoolRec = districtBlockSchoolData.find(s => s._id === r.schoolRecordId);
//           const schoolCenterId = schoolRec?.centerId;
          
//           if (!processedCenterIds.has(schoolCenterId)) {
//             const isRowCluster = !manualCluster && selectedCluster && r.schoolRecordId === selectedCluster.value;
//             const body = {
//               _id: r.schoolRecordId,
//               isCluster: !!isRowCluster,
//               abrc: abrcName,
//               abrcContact: abrcContact,
//               principal: r.principal,
//               princiaplContact: r.princiaplContact,
//               principalAbrcDataUpdatedBy: updater
//             };
//             requests.push(updateAbrcPrincipalService(body));
//             processedCenterIds.add(schoolCenterId);
//           }
//         }
//       });

//       const results = await Promise.allSettled(requests);
//       const failed = results.filter(r => r.status === "rejected" || r.value?.status !== "Success");
//       if (failed.length) {
//         alert("Some records failed to update. Check console.");
//         console.error("Failed updates:", failed);
//       } else {
//         alert("Submitted successfully.");
//         // Reset form
//         setSelectedDistrict(null);
//         setSelectedBlock(null);
//         setSelectedCluster(null);
//         setManualCluster(false);
//         setManualClusterName("");
//         setManualClusterId("");
//         setAbrcName("");
//         setAbrcContact("");
//         setRows([]);
//       }
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert("Error submitting data.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div style={{ padding: 16 }}>
//       <h4>Cluster, ABRC, Principal Details</h4>
//       <hr />

//       {/* district, block, cluster dropdowns */}
//       <div style={{ marginBottom: 12 }}>
//         <label>District</label>
//         <Select options={districtOptions} value={selectedDistrict} onChange={setSelectedDistrict} isClearable />
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <label>Block</label>
//         <Select options={blockOptions} value={selectedBlock} onChange={setSelectedBlock} isClearable isDisabled={!selectedDistrict} />
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <label>Cluster (School as Cluster)</label>
//         {!manualCluster ? (
//           <Select
//             options={clusterOptions}
//             value={selectedCluster}
//             onChange={setSelectedCluster}
//             isClearable
//             isDisabled={!selectedBlock}
//           />
//         ) : (
//           <div style={{ display: "flex", gap: 6 }}>
//             <input
//               value={manualClusterName}
//               onChange={e => setManualClusterName(e.target.value)}
//               placeholder="Manual cluster name"
//               style={{ flex: 1 }}
//             />
//             <input
//               value={manualClusterId}
//               onChange={e => setManualClusterId(e.target.value.replace(/\s/g, ""))}
//               placeholder="Code"
//               style={{ width: 150 }}
//             />
//           </div>
//         )}
//         <br></br>
//         <label style={{ fontSize: 12 }}>
//           <input
//             type="checkbox"
//             checked={manualCluster}
//             onChange={e => setManualCluster(e.target.checked)}
//             disabled={!selectedBlock}
//           />{" "}
//           <p>Cluster not in dropdown</p>
//         </label>
//       </div>

//       {/* ABRC section */}
//       <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }}>
//         <h5>ABRC Details</h5>
//         <input
//           value={abrcName}
//           onChange={e => setAbrcName(e.target.value)}
//           placeholder="ABRC Name"
//           style={{ width: "100%", marginBottom: 8 }}
//         />
//         <input
//           value={abrcContact}
//           onChange={e => setAbrcContact(e.target.value.replace(/\D/g, ""))}
//           placeholder="ABRC Contact (10 digits)"
//           maxLength={10}
//           style={{ width: "100%" }}
//         />
//         {!phoneIsValid(abrcContact) && abrcContact && (
//           <div style={{ color: "red" }}>Contact must be 10 digits.</div>
//         )}
//       </div>

//       {/* rows */}
//       <div>
//         <h5>Schools & Principals (within selected block)</h5>
//         {rows.map((row, i) => (
//           <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
//             <div style={{ flex: 2 }}>
//               {!row.manual ? (
//                 <Select
//                   options={schoolsInBlockOptions}
//                   value={schoolsInBlockOptions.find(o => o.value === row.schoolRecordId) || null}
//                   onChange={opt => updateRow(i, "schoolRecordId", opt ? opt.value : "")}
//                   placeholder="Select school"
//                 />
//               ) : (
//                 <div style={{ display: "flex", gap: 6 }}>
//                   <input
//                     value={row.manualCenterName}
//                     onChange={e => updateRow(i, "manualCenterName", e.target.value)}
//                     placeholder="Manual school name"
//                     style={{ flex: 1 }}
//                   />
//                   <input
//                     value={row.manualCenterId}
//                     onChange={e => updateRow(i, "manualCenterId", e.target.value.replace(/\s/g, ""))}
//                     placeholder="Code"
//                     style={{ width: 150 }}
//                   />
//                 </div>
//               )}
//             </div>
//             <input
//               value={row.principal}
//               onChange={e => updateRow(i, "principal", e.target.value)}
//               placeholder="Principal name"
//               style={{ flex: 1 }}
//             />
//             <input
//               value={row.princiaplContact}
//               onChange={e => updateRow(i, "princiaplContact", e.target.value.replace(/\D/g, ""))}
//               placeholder="10 digit contact"
//               maxLength={10}
//               style={{ width: 160 }}
//             />
//             {!phoneIsValid(row.princiaplContact) && row.princiaplContact && (
//               <div style={{ color: "red", fontSize: 12 }}>10 digits required</div>
//             )}
//             <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//               <label style={{ fontSize: 12 }}>
//                 <input
//                   type="checkbox"
//                   checked={!!row.manual}
//                   onChange={e => updateRow(i, "manual", e.target.checked)}
//                 />{" "}
//                 School not in dropdown
//               </label>
//               <button onClick={() => handleRemoveRow(i)}>Remove</button>
//             </div>
//           </div>
//         ))}

//         <button onClick={handleAddRow} disabled={!selectedBlock} style={{ marginRight: 8 }}>
//           + Add row
//         </button>

//         <button
//           onClick={handleSubmit}
//           disabled={submitting || (!selectedCluster && !manualCluster)}
//           style={{
//             background: submitting ? "#aaa" : "#2b6cff",
//             color: "#fff",
//             padding: "8px 12px",
//             border: "none",
//             borderRadius: 4
//           }}
//         >
//           {submitting ? "Submitting..." : "Submit"}
//         </button>
//       </div>

//       {loadingDBS && <div>Loading schools...</div>}
//     </div>
//   );
// };

// export default PrincipalSchoolsAbrcDataCollection;






// src/components/PrincipalSchoolsAbrcDataCollection.jsx
import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { UserContext } from "../NewContextApis/UserContext";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
import { updateAbrcPrincipal as updateAbrcPrincipalService } from "../../services/DistrictBLockSchoolServices/DistrictBlockSchoolService";

const phoneIsValid = (val) => /^\d{10}$/.test(String(val).trim() || "");

export const PrincipalSchoolsAbrcDataCollection = () => {
  const { userData } = useContext(UserContext) || {};
  const { districtBlockSchoolData = [], loadingDBS } = useDistrictBlockSchool() || {};

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);

  const [manualCluster, setManualCluster] = useState(false);
  const [manualClusterName, setManualClusterName] = useState("");
  const [manualClusterId, setManualClusterId] = useState("");

  const [abrcName, setAbrcName] = useState("");
  const [abrcContact, setAbrcContact] = useState("");

  const [rows, setRows] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const districtOptions = React.useMemo(() => {
    const map = new Map();
    districtBlockSchoolData?.forEach(item => {
      if (!map.has(item.districtId)) map.set(item.districtId, { value: item.districtId, label: item.districtName });
    });
    return Array.from(map.values());
  }, [districtBlockSchoolData]);

  const blockOptions = React.useMemo(() => {
    if (!selectedDistrict) return [];
    const map = new Map();
    districtBlockSchoolData.forEach(item => {
      if (item.districtId === selectedDistrict.value && !map.has(item.blockId)) {
        map.set(item.blockId, { value: item.blockId, label: item.blockName });
      }
    });
    return Array.from(map.values());
  }, [districtBlockSchoolData, selectedDistrict]);

  const clusterOptions = React.useMemo(() => {
    if (!selectedDistrict || !selectedBlock) return [];
    const map = new Map();
    districtBlockSchoolData.forEach(item => {
      if (item.districtId === selectedDistrict.value && item.blockId === selectedBlock.value) {
        if (!map.has(item._id)) {
          map.set(item._id, { value: item._id, label: `${item.centerName} (${item.centerId})` });
        }
      }
    });
    return Array.from(map.values());
  }, [districtBlockSchoolData, selectedDistrict, selectedBlock]);

  const schoolsInBlockOptions = React.useMemo(() => {
    if (!selectedDistrict || !selectedBlock) return [];
    return districtBlockSchoolData
      .filter(item => item.districtId === selectedDistrict.value && item.blockId === selectedBlock.value)
      .map(item => ({
        value: item._id,
        label: `${item.centerName} (${item.centerId})`,
        meta: item
      }));
  }, [districtBlockSchoolData, selectedDistrict, selectedBlock]);

  useEffect(() => {
    setSelectedBlock(null);
    setSelectedCluster(null);
    setManualCluster(false);
    setManualClusterName("");
    setManualClusterId("");
    setAbrcName("");
    setAbrcContact("");
    setRows([]);
  }, [selectedDistrict]);

  useEffect(() => {
    setSelectedCluster(null);
    setManualCluster(false);
    setManualClusterName("");
    setManualClusterId("");
    setAbrcName("");
    setAbrcContact("");
    setRows([]);
  }, [selectedBlock]);

  useEffect(() => {
    if (!selectedCluster || manualCluster) {
      if (!manualCluster) {
        setAbrcName("");
        setAbrcContact("");
        setRows([]);
      }
      return;
    }
    const rec = districtBlockSchoolData.find(r => r._id === selectedCluster.value);
    if (rec) {
      setAbrcName(rec.abrc || "");
      setAbrcContact(rec.abrcContact || "");
      setRows([{
        schoolRecordId: rec._id,
        centerName: rec.centerName,
        principal: rec.principal || "",
        princiaplContact: rec.princiaplContact || "",
        manual: false
      }]);
    }
  }, [selectedCluster, districtBlockSchoolData, manualCluster]);

  const handleAddRow = () => {
    const first = schoolsInBlockOptions[0];
    setRows(prev => [
      ...prev,
      {
        schoolRecordId: first ? first.value : "",
        centerName: first ? first.label : "",
        principal: "",
        princiaplContact: "",
        manual: false,
        manualCenterName: "",
        manualCenterId: ""
      }
    ]);
  };

  const handleRemoveRow = (index) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    setRows(prev => {
      const n = [...prev];
      n[index] = { ...n[index], [field]: value };

      if (field === "schoolRecordId") {
        const meta = schoolsInBlockOptions.find(s => s.value === value)?.meta;
        n[index].centerName = meta ? meta.centerName : "";
        n[index].principal = meta?.principal || "";
        n[index].princiaplContact = meta?.princiaplContact || "";
      }

      if (field === "manual") {
        if (value) {
          n[index].schoolRecordId = "";
          n[index].centerName = "";
        } else {
          n[index].manualCenterName = "";
          n[index].manualCenterId = "";
        }
      }

      return n;
    });
  };

  const validateForm = () => {
    if (!selectedDistrict) return { ok: false, message: "Select district." };
    if (!selectedBlock) return { ok: false, message: "Select block." };
    if (!selectedCluster && !manualCluster) return { ok: false, message: "Select or add cluster." };
    if (manualCluster && (!manualClusterName || !manualClusterId)) return { ok: false, message: "Enter manual cluster details." };
    if (!abrcName) return { ok: false, message: "Enter ABRC name." };
    if (!phoneIsValid(abrcContact)) return { ok: false, message: "ABRC contact must be 10 digits." };
    if (!rows.length) return { ok: false, message: "Add at least one school row." };

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.manual && !r.schoolRecordId) return { ok: false, message: `Select school in row ${i + 1}.` };
      if (r.manual && (!r.manualCenterName || !r.manualCenterId))
        return { ok: false, message: `Enter manual school name/code in row ${i + 1}.` };
      if (!r.principal) return { ok: false, message: `Enter principal in row ${i + 1}.` };
      if (!phoneIsValid(r.princiaplContact))
        return { ok: false, message: `Principal contact must be 10 digits in row ${i + 1}.` };
    }

    return { ok: true };
  };

  const handleSubmit = async () => {
    const check = validateForm();
    if (!check.ok) return alert(check.message);
    setSubmitting(true);

    try {
      const updater = userData?.user?._id || userData?._id || userData?.email || null;
      const requests = [];
      const processedCenterIds = new Set();

      // 1️⃣ First process the cluster (manual or selected)
      let clusterCenterId = null;
      let clusterCenterName = null;

      if (manualCluster) {
        clusterCenterId = manualClusterId;
        clusterCenterName = manualClusterName;
        
        // Check if any manual school has same name and code as cluster
        const sameSchoolRow = rows.find(r => 
          r.manual && 
          r.manualCenterId === clusterCenterId && 
          r.manualCenterName === clusterCenterName
        );

        if (sameSchoolRow) {
          // CASE 1: Cluster and school are same - single document with both ABRC + Principal
          const combinedPayload = {
            isCluster: true,
            abrc: abrcName,
            abrcContact: abrcContact,
            principal: sameSchoolRow.principal,
            princiaplContact: sameSchoolRow.princiaplContact,
            principalAbrcDataUpdatedBy: updater,
            manualSchool: {
              districtId: selectedDistrict.value,
              districtName: selectedDistrict.label,
              blockId: selectedBlock.value,
              blockName: selectedBlock.label,
              centerId: clusterCenterId,
              centerName: clusterCenterName,
              schoolType: "Haryana School"
            }
          };
          requests.push(updateAbrcPrincipalService(combinedPayload));
          processedCenterIds.add(clusterCenterId);
        } else {
          // CASE 2: Only cluster, no matching school - create cluster only
          const clusterPayload = {
            isCluster: true,
            abrc: abrcName,
            abrcContact: abrcContact,
            principalAbrcDataUpdatedBy: updater,
            manualSchool: {
              districtId: selectedDistrict.value,
              districtName: selectedDistrict.label,
              blockId: selectedBlock.value,
              blockName: selectedBlock.label,
              centerId: clusterCenterId,
              centerName: clusterCenterName,
              schoolType: "Haryana School"
            }
          };
          requests.push(updateAbrcPrincipalService(clusterPayload));
          processedCenterIds.add(clusterCenterId);
        }
      } else if (selectedCluster) {
        const clusterRec = districtBlockSchoolData.find(r => r._id === selectedCluster.value);
        clusterCenterId = clusterRec?.centerId;
        clusterCenterName = clusterRec?.centerName;
        
        const clusterPayload = {
          _id: selectedCluster.value,
          isCluster: true,
          abrc: abrcName,
          abrcContact: abrcContact,
          principalAbrcDataUpdatedBy: updater
        };
        requests.push(updateAbrcPrincipalService(clusterPayload));
        if (clusterCenterId) processedCenterIds.add(clusterCenterId);
      }

      // 2️⃣ Process rows - avoid duplicates for same centerId
      rows.forEach(r => {
        if (r.manual) {
          // For manual schools
          if (manualCluster && r.manualCenterId === clusterCenterId && r.manualCenterName === clusterCenterName) {
            // This is the same as cluster - already processed above, skip
            console.log(`Skipping duplicate manual school: ${r.manualCenterName} (${r.manualCenterId}) - same as cluster`);
            return;
          }
          
          // Different manual school - create new only if not processed
          if (!processedCenterIds.has(r.manualCenterId)) {
            const manualBody = {
              isCluster: false,
              abrc: abrcName,
              abrcContact: abrcContact,
              principal: r.principal,
              princiaplContact: r.princiaplContact,
              principalAbrcDataUpdatedBy: updater,
              manualSchool: {
                districtId: selectedDistrict.value,
                districtName: selectedDistrict.label,
                blockId: selectedBlock.value,
                blockName: selectedBlock.label,
                centerId: r.manualCenterId,
                centerName: r.manualCenterName,
                schoolType: "Haryana School"
              }
            };
            requests.push(updateAbrcPrincipalService(manualBody));
            processedCenterIds.add(r.manualCenterId);
          }
        } else {
          // For existing schools from dropdown
          const schoolRec = districtBlockSchoolData.find(s => s._id === r.schoolRecordId);
          const schoolCenterId = schoolRec?.centerId;
          
          if (!processedCenterIds.has(schoolCenterId)) {
            const isRowCluster = !manualCluster && selectedCluster && r.schoolRecordId === selectedCluster.value;
            const body = {
              _id: r.schoolRecordId,
              isCluster: !!isRowCluster,
              abrc: abrcName,
              abrcContact: abrcContact,
              principal: r.principal,
              princiaplContact: r.princiaplContact,
              principalAbrcDataUpdatedBy: updater
            };
            requests.push(updateAbrcPrincipalService(body));
            processedCenterIds.add(schoolCenterId);
          }
        }
      });

      const results = await Promise.allSettled(requests);
      const failed = results.filter(r => r.status === "rejected" || r.value?.status !== "Success");
      if (failed.length) {
        alert("Some records failed to update. Check console.");
        console.error("Failed updates:", failed);
      } else {
        alert("Submitted successfully.");
        // Reset form
        setSelectedDistrict(null);
        setSelectedBlock(null);
        setSelectedCluster(null);
        setManualCluster(false);
        setManualClusterName("");
        setManualClusterId("");
        setAbrcName("");
        setAbrcContact("");
        setRows([]);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error submitting data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      {/* Responsive styles added below - only layout/CSS changed for stacking on small screens */}
      <style>{`
        .row-flex { display: flex; gap: 12px; align-items: flex-start; }
        .row-flex > label { min-width: 90px; }
        .field { width: 100%; }
        .abrc-box input { box-sizing: border-box; }
        .school-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 8px; }
        .school-row .select-wrapper { flex: 2; }
        .school-row input { box-sizing: border-box; }
        .school-row .principal { flex: 1; }
        .school-row .contact { width: 160px; }
        .school-row .row-actions { display:flex; flex-direction:column; gap:6px; }
        .actions { margin-top: 8px; display:flex; gap:8px; }

        /* Responsive stacking for small screens */
        @media (max-width: 768px) {
          .row-flex, .school-row { flex-direction: column; align-items: stretch; }
          .row-flex > label { min-width: 0; }
          .school-row .select-wrapper, .school-row .principal, .school-row .contact, .school-row .row-actions { width: 100%; }
          .school-row .contact { width: 100%; }
          .actions { flex-direction: column; }
        }
      `}</style>

      <h4>Cluster, ABRC, Principal Details</h4>
      <hr />

      {/* district, block, cluster dropdowns */}
      <div style={{ marginBottom: 12 }} className="row-flex">
        <div style={{ flex: 1 }}>
          <label>District</label>
          <Select options={districtOptions} value={selectedDistrict} onChange={setSelectedDistrict} isClearable className="field" />
        </div>
      </div>

      <div style={{ marginBottom: 12 }} className="row-flex">
        <div style={{ flex: 1 }}>
          <label>Block</label>
          <Select options={blockOptions} value={selectedBlock} onChange={setSelectedBlock} isClearable isDisabled={!selectedDistrict} className="field" />
        </div>
      </div>

      <div style={{ marginBottom: 12 }} className="row-flex">
        <div style={{ flex: 1 }}>
          <label>Cluster Name</label>
          {!manualCluster ? (
            <Select
              options={clusterOptions}
              value={selectedCluster}
              onChange={setSelectedCluster}
              isClearable
              isDisabled={!selectedBlock}
              className="field"
            />
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <input
                value={manualClusterName}
                onChange={e => setManualClusterName(e.target.value)}
                placeholder="Cluster Name"
                style={{ flex: 1 }}
              />
              <input
                value={manualClusterId}
                onChange={e => setManualClusterId(e.target.value.replace(/\s/g, ""))}
                placeholder="Code"
                style={{ width: 150 }}
              />
            </div>
          )}
          <br></br>
          <label style={{ fontSize: 12 }}>
            <input
              type="checkbox"
              checked={manualCluster}
              onChange={e => setManualCluster(e.target.checked)}
              disabled={!selectedBlock}
            />{" "}
            <p>If cluster name is not in drop down, then mark it and write cluster name manually</p>
          </label>
        </div>
      </div>

      {/* ABRC section */}
      <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }} className="abrc-box">
        <h5>ABRC Details</h5>
        <hr></hr>
        <label>ABRC Name</label>
        <input
          value={abrcName}
          onChange={e => setAbrcName(e.target.value)}
          placeholder="ABRC Name"
          className="field"
          style={{ width: "100%", marginBottom: 8 }}
        />
        <label>ABRC Contact</label>
        <input
          value={abrcContact}
          onChange={e => setAbrcContact(e.target.value.replace(/\D/g, ""))}
          placeholder="ABRC Contact (10 digits)"
          maxLength={10}
          className="field"
          style={{ width: "100%" }}
        />
        {!phoneIsValid(abrcContact) && abrcContact && (
          <div style={{ color: "red" }}>Contact must be 10 digits.</div>
        )}
      </div>

      {/* rows */}
      <div>
        <h5>Schools & Principals Details</h5>
        {rows.map((row, i) => (
          <div key={i} className="school-row">
            <div className="select-wrapper">
              {!row.manual ? (
                <Select
                  options={schoolsInBlockOptions}
                  value={schoolsInBlockOptions.find(o => o.value === row.schoolRecordId) || null}
                  onChange={opt => updateRow(i, "schoolRecordId", opt ? opt.value : "")}
                  placeholder="Select school"
                />
              ) : (
                <div style={{ display: "flex", gap: 6 }}>
                  <label>School Name</label>
                  <input
                    value={row.manualCenterName}
                    onChange={e => updateRow(i, "manualCenterName", e.target.value)}
                    placeholder="Manual school name"
                    style={{ flex: 1 }}
                  />
                  <label>School Code</label>
                  <input
                    value={row.manualCenterId}
                    onChange={e => updateRow(i, "manualCenterId", e.target.value.replace(/\s/g, ""))}
                    placeholder="Code"
                    style={{ width: 150 }}
                  />
                </div>
              )}
            </div>
            <label>Principal Name</label>
            <input
              value={row.principal}
              onChange={e => updateRow(i, "principal", e.target.value)}
              placeholder="Principal name"
              className="principal"
            />

             <label>Principal Contact</label>
            <input
              value={row.princiaplContact}
              onChange={e => updateRow(i, "princiaplContact", e.target.value.replace(/\D/g, ""))}
              placeholder="10 digit contact"
              maxLength={10}
              className="contact"
            />
            {!phoneIsValid(row.princiaplContact) && row.princiaplContact && (
              <div style={{ color: "red", fontSize: 12 }}>10 digits required</div>
            )}
            <div className="row-actions">
              <label style={{ fontSize: 12 }}>
                <input
                  type="checkbox"
                  checked={!!row.manual}
                  onChange={e => updateRow(i, "manual", e.target.checked)}
                />{" "}
                <p>If School not in dropdown, then write manual school name</p>
              </label>
              <button onClick={() => handleRemoveRow(i)}>Remove</button>
            </div>
          </div>
        ))}

        <div className="actions">
          <button onClick={handleAddRow} disabled={!selectedBlock} style={{ marginRight: 8 }}>
            + Add row
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || (!selectedCluster && !manualCluster)}
            style={{
              background: submitting ? "#aaa" : "#2b6cff",
              color: "#fff",
              padding: "8px 12px",
              border: "none",
              borderRadius: 4
            }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {loadingDBS && <div>Loading schools...</div>}
    </div>
  );
};

export default PrincipalSchoolsAbrcDataCollection;
