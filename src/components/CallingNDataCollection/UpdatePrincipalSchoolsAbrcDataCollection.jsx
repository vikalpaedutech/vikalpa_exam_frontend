// // PrincipalSchoolsAbrcDataCollection.jsx
// import React, { useState, useEffect, useMemo, useContext } from "react";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   Badge,
// } from "react-bootstrap";
// import Select from "react-select";
// import makeAnimated from "react-select/animated";
// import { CreateData , GetData} from "../../services/PrincipalSchoolsAbrcDataCollection";
// import { UserContext } from "../ContextApi/UserContextAPI/UserContext";
// import UserNavBar from "../UserNavBar"; // keep your navbar
// import DistrictBlockSchool from "../DistrictBlockSchool.json"; // adjust path if needed


// export const UpdatePrincipalSchoolsAbrcData = () => {

//       const { user } = useContext(UserContext);

//       console.log(user)

//     const fetchData = async () =>{
//         const reqBody = {
//             dataFilledBy: user?._id,
//             dataType: "School"
//         }
//         try {
            
//             const response = await GetData(reqBody)

//             console.log(response.data.data)
//         } catch (error) {
//             console.log("Error fetching data::::>", error)
//         }
//     }

//     useEffect(()=>{
//         fetchData()
//     }, [])

//       return(

//         <>
//         <UserNavBar/>
//         <Container>
//             <label>Select Data type</label>
//             <Select
//             options={[
//                 {value: 'ABRC', label:'ABRC'},
//                 {value: 'School', label:'School'}
//             ]}


//             />
//              <h1>
//             Hello Update data
//         </h1>
//         </Container>
       
//         </>
        
//       )


// }















// // PrincipalSchoolsAbrcDataCollection.jsx
// import React, { useState, useEffect, useMemo, useContext } from "react";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   Badge,
//   Table,
//   Spinner,
// } from "react-bootstrap";
// import Select from "react-select";
// import makeAnimated from "react-select/animated";
// import { CreateData , GetData, UpdateData} from "../../services/PrincipalSchoolsAbrcDataCollection";
// import { UserContext } from "../ContextApi/UserContextAPI/UserContext";
// import UserNavBar from "../UserNavBar"; // keep your navbar
// import DistrictBlockSchool from "../DistrictBlockSchool.json"; // adjust path if needed


// export const UpdatePrincipalSchoolsAbrcData = () => {

//       const { user } = useContext(UserContext);

//       console.log(user)

//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [selectedType, setSelectedType] = useState("ABRC");

//     const animatedComponents = makeAnimated();

//     const fetchData = async (type = selectedType) =>{
//         // build request body exactly like you used earlier
//         const reqBody = {
//             dataFilledBy: user?._id,
//             dataType: type
//         }
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await GetData(reqBody);
//             // assume backend shape: response.data.data (as you logged earlier)
//             const fetched = response?.data?.data || [];
//             console.log(fetched)
//             setData(fetched);
//         } catch (error) {
//             console.log("Error fetching data::::>", error)
//             setError(error?.message || "Failed to fetch data");
//             setData([]);
//         } finally{
//             setLoading(false);
//         }
//     }

//     // fetch when component mounts (initial selectedType is "ABRC")
//     useEffect(()=>{
//         if (user?._id) fetchData(selectedType);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [user?._id]);

//     // fetch when selectedType changes
//     useEffect(()=>{
//       if (user?._id) fetchData(selectedType);
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [selectedType]);


//       return(

//         <>
//         <UserNavBar/>
//         <Container className="py-4">
//             <label className="mb-2 d-block">Select Data type</label>
//             <Row className="align-items-center mb-3">
//               <Col xs={12} md={6} lg={4}>
//                 <Select
//                   components={animatedComponents}
//                   value={{ value: selectedType, label: selectedType }}
//                   onChange={(option) => setSelectedType(option.value)}
//                   options={[
//                       {value: 'ABRC', label:'ABRC'},
//                       {value: 'School', label:'School'}
//                   ]}
//                 />
//               </Col>
//               <Col className="text-end">
//                 <Badge bg="secondary">Showing: {selectedType}</Badge>
//               </Col>
//             </Row>

//             <Card className="mb-4">
//               <Card.Body>
//                 <h4 className="mb-0">Hello Update data</h4>
//               </Card.Body>
//             </Card>

//             {loading && (
//               <div className="d-flex justify-content-center py-4">
//                 <Spinner animation="border" role="status" />
//               </div>
//             )}

//             {error && (
//               <Alert variant="danger">{error}</Alert>
//             )}

//             {!loading && !error && data?.length === 0 && (
//               <Alert variant="info">No records found for the selected data type.</Alert>
//             )}

//             {!loading && data?.length > 0 && (
//               <Card>
//                 <Card.Body>
//                   <Table responsive bordered hover size="sm">
//                     <thead>
//                       <tr>
//                         <th>District</th>
//                         <th>Block</th>
//                         <th>School Type</th>
//                         <th>School</th>
//                         <th>Principal</th>
//                         <th>Principal Contact</th>
//                         <th>Alt. School Number</th>
//                         <th>ABRC Name</th>
//                         <th>ABRC Assigned Schools</th>
//                         <th>ABRC Contact</th>
//                         <th>ABRC Alt Contact</th>
//                         <th>Created At</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {data.map((row) => (
//                         <tr key={row._id}>
//                           <td>{row.district || 'NA'}</td>
//                           <td>{row.block || 'NA'}</td>
//                           <td>{row.scholType || 'NA'}</td>
//                           <td>{row.school || 'NA'}</td>
//                           <td>{row.principal || 'NA'}</td>
//                           <td>{row.principalContact || 'NA'}</td>
//                           <td>{row.alternateSchoolNumber || 'NA'}</td>
//                           <td>{row.abrcName || 'NA'}</td>
//                           <td style={{maxWidth: 220, overflowWrap: 'anywhere'}}>{row.abrcAssignedSchools || 'NA'}</td>
//                           <td>{row.abrcContact || 'NA'}</td>
//                           <td>{row.abrcAlternateContact || 'NA'}</td>
//                           <td>{row.createdAt ? new Date(row.createdAt).toLocaleString('en-IN') : 'NA'}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </Card.Body>
//               </Card>
//             )}

//         </Container>
       
//         </>
        
//       )


// }









// // PrincipalSchoolsAbrcDataCollection.jsx
// import React, { useState, useEffect, useMemo, useContext } from "react";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   Badge,
//   Table,
//   Spinner,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select";
// import makeAnimated from "react-select/animated";
// import { CreateData , GetData, UpdateData } from "../../services/PrincipalSchoolsAbrcDataCollection";
// import { UserContext } from "../ContextApi/UserContextAPI/UserContext";
// import UserNavBar from "../UserNavBar"; // keep your navbar
// import DistrictBlockSchool from "../DistrictBlockSchool.json"; // adjust path if needed

// export const UpdatePrincipalSchoolsAbrcData = () => {

//   const { user } = useContext(UserContext);

//   console.log(user)

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedType, setSelectedType] = useState("ABRC");

//   // modal / edit state
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingRow, setEditingRow] = useState(null);

//   const animatedComponents = makeAnimated();

//   const fetchData = async (type = selectedType) =>{
//       // build request body exactly like you used earlier
//       const reqBody = {
//           dataFilledBy: user?._id,
//           dataType: type
//       }
//       setLoading(true);
//       setError(null);
//       try {
//           const response = await GetData(reqBody);
//           // assume backend shape: response.data.data (as you logged earlier)
//           const fetched = response?.data?.data || [];
//           console.log(fetched)
//           setData(fetched);
//       } catch (error) {
//           console.log("Error fetching data::::>", error)
//           setError(error?.message || "Failed to fetch data");
//           setData([]);
//       } finally{
//           setLoading(false);
//       }
//   }

//   // fetch when component mounts (initial selectedType is "ABRC")
//   useEffect(()=>{
//       if (user?._id) fetchData(selectedType);
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?._id]);

//   // fetch when selectedType changes
//   useEffect(()=>{
//     if (user?._id) fetchData(selectedType);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedType]);

//   // ---------- Edit form helpers & small form component ----------
//   const onlyDigitsAndLimit = (raw, limit = 10) => {
//     const digits = (raw || "").replace(/\D/g, "");
//     return digits.slice(0, limit);
//   };

//   const phoneIsValid = (p) => {
//     if (!p) return false;
//     const onlyDigits = p.replace(/\D/g, "");
//     return onlyDigits.length === 10;
//   };

//   // Transform CSV like "6628,6635,SchoolName(123)" into select & manual rows
//   const parseAbrcAssigned = (csv = "") => {
//     if (!csv || csv === "NA") return { selectedIds: [], manualRows: [] };
//     const parts = csv.split(",").map(s => s.trim()).filter(Boolean);
//     const selectedIds = [];
//     const manualRows = [];
//     parts.forEach(p => {
//       const m = p.match(/^(.+)\((.+)\)$/); // Name(id)
//       if (m) manualRows.push({ name: m[1], id: m[2] });
//       else if (/^\d+$/.test(p)) selectedIds.push(p);
//       else manualRows.push({ name: p, id: "" });
//     });
//     return { selectedIds, manualRows };
//   };

//   // Small EditForm component embedded (prefilled, validates, calls UpdateData)
//   const EditForm = ({ initialData, onClose, onSaved }) => {
//     // initial shape
//     const init = {
//       _id: initialData?._id || "",
//       district: initialData?.district ? { value: initialData.district, label: initialData.district } : null,
//       block: initialData?.block ? { value: initialData.block, label: initialData.block } : null,
//       scholType: initialData?.scholType ? { value: initialData.scholType, label: initialData.scholType } : null,
//       school: initialData?.school ? { value: initialData.school, label: initialData.school } : null,
//       manualSchool: false,
//       manualSchoolName: "",
//       principal: initialData?.principal || "",
//       principalContact: initialData?.principalContact || "",
//       alternateSchoolNumber: initialData?.alternateSchoolNumber || "",
//       abrcName: initialData?.abrcName || "",
//       abrcAssignedSchools: [], // will fill below
//       abrcAssignedManualRows: [],
//       abrcContact: initialData?.abrcContact || "",
//       abrcAlternateContact: initialData?.abrcAlternateContact || "",
//       dataType: initialData?.dataType || "School",
//       dataFilledBy: initialData?.dataFilledBy || user?._id || "",
//     };

//     const parsed = parseAbrcAssigned(initialData?.abrcAssignedSchools);
//     init.abrcAssignedSchools = parsed.selectedIds.map(id => ({ value: id, label: id }));
//     init.abrcAssignedManualRows = parsed.manualRows;

//     const [form, setForm] = useState(init);
//     const [districtOptions, setDistrictOptions] = useState([]);
//     const [blockOptions, setBlockOptions] = useState([]);
//     const [schoolOptions, setSchoolOptions] = useState([]);
//     const [allSchoolOptionsForABRC, setAllSchoolOptionsForABRC] = useState([]);
//     const [saving, setSaving] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [alert, setAlert] = useState({ show:false, variant:"", msg:"" });

//     useEffect(() => {
//       const uniqDistricts = Array.from(
//         new Map(DistrictBlockSchool.map((d) => [d.d_name, { value: d.d_name, label: d.d_name }])).values()
//       ).sort((a,b) => a.label.localeCompare(b.label));
//       setDistrictOptions(uniqDistricts);

//       const flattened = DistrictBlockSchool.map((s) => ({
//         value: String(s.s_id),
//         label: s.s_name,
//         district: s.d_name,
//         block: s.b_name,
//       }));
//       const deduped = Array.from(new Map(flattened.map((f) => [f.value, f])).values()).sort((a,b) => a.label.localeCompare(b.label));
//       setAllSchoolOptionsForABRC(deduped);
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     useEffect(() => {
//       // when district changes
//       if (!form.district) { setBlockOptions([]); setSchoolOptions([]); return; }
//       const filtered = DistrictBlockSchool.filter(d=> d.d_name === form.district.value);
//       const uniqBlocks = Array.from(new Map(filtered.map((b) => [b.b_name, { value: b.b_name, label: b.b_name }])).values())
//         .sort((a,b)=> a.label.localeCompare(b.label));
//       setBlockOptions(uniqBlocks);
//       setSchoolOptions([]);
//     }, [form.district]);

//     useEffect(() => {
//       if (!form.block || !form.scholType) { setSchoolOptions([]); return; }
//       const filtered = DistrictBlockSchool.filter(s => s.d_name === form.district?.value && s.b_name === form.block?.value);
//       const opts = filtered.map(s => ({ value: s.s_name, label: s.s_name, schoolId: String(s.s_id) }));
//       const deduped = Array.from(new Map(opts.map(o => [o.value, o])).values()).sort((a,b)=> a.label.localeCompare(b.label));
//       setSchoolOptions(deduped);
//     }, [form.block, form.district, form.scholType]);

//     const abrcOptions = useMemo(() => {
//       if (schoolOptions && schoolOptions.length > 0) return schoolOptions.map(s => ({ value: s.schoolId, label: s.label }));
//       return allSchoolOptionsForABRC;
//     }, [schoolOptions, allSchoolOptionsForABRC]);

//     const handleSelectChange = (val, meta) => {
//       const name = meta?.name;
//       if (!name) return;
//       setForm(f => ({ ...f, [name]: val }));
//       setErrors(e => ({ ...e, [name]: null }));
//     };

//     const handleInputChange = (e) => {
//       const { name, value } = e.target;
//       if (["principalContact","alternateSchoolNumber","abrcContact","abrcAlternateContact"].includes(name)) {
//         const cleaned = onlyDigitsAndLimit(value, 10);
//         setForm(f => ({ ...f, [name]: cleaned }));
//         setErrors(e => ({ ...e, [name]: null }));
//         return;
//       }
//       setForm(f => ({ ...f, [name]: value }));
//       setErrors(e => ({ ...e, [name]: null }));
//     };

//     const handleCheckbox = (e) => {
//       const { name, checked } = e.target;
//       setForm(f => ({ ...f, [name]: checked }));
//       setErrors(e => ({ ...e, [name]: null }));
//       if (!checked && name === "manualSchool") setForm(f => ({ ...f, manualSchoolName: "" }));
//     };

//     const addManualRow = () => setForm(f => ({ ...f, abrcAssignedManualRows: [...(f.abrcAssignedManualRows||[]), { name:"", id:"" }] }));
//     const removeManualRow = (i) => setForm(f => { const c=[...(f.abrcAssignedManualRows||[])]; c.splice(i,1); return { ...f, abrcAssignedManualRows: c };});
//     const updateManualRow = (i, field, val) => setForm(f => { const c=[...(f.abrcAssignedManualRows||[])]; c[i] = { ...c[i], [field]: val }; return { ...f, abrcAssignedManualRows: c }; });

//     const validate = () => {
//       const errs = {};
//       if (!form.dataType) errs.dataType = "Select Data Type";
//       if (!form.district) errs.district = "District is required";
//       if (!form.block) errs.block = "Block is required";
//       if (form.dataType === "School") {
//         if (!form.scholType) errs.scholType = "School Type is required";
//         if (!form.manualSchool) {
//           if (!form.school) errs.school = "Select a school (or enable manual entry)";
//         } else {
//           if (!form.manualSchoolName || !form.manualSchoolName.trim()) errs.manualSchoolName = "Enter school name";
//         }
//         if (!form.principal || !form.principal.trim()) errs.principal = "Principal name is required";
//         if (!form.principalContact || !phoneIsValid(form.principalContact)) errs.principalContact = "Principal contact must be 10 digits";
//         if (form.alternateSchoolNumber && !phoneIsValid(form.alternateSchoolNumber)) errs.alternateSchoolNumber = "Alternate number must be 10 digits";
//       } else {
//         if (!form.abrcName || !form.abrcName.trim()) errs.abrcName = "ABRC name is required";
//         const selectedIds = (form.abrcAssignedSchools||[]).map(o=>String(o.value));
//         const manualRows = form.abrcAssignedManualRows || [];
//         const manualFormatted = manualRows.map(r=>({ name: r.name?.trim(), id: r.id?.trim() })).filter(r=> r.name || r.id);
//         for (let i=0;i<manualFormatted.length;i++){
//           const r = manualFormatted[i];
//           if (!r.name) { errs.abrcAssignedSchools = `Manual row ${i+1}: School name required`; break;}
//           if (!r.id) { errs.abrcAssignedSchools = `Manual row ${i+1}: School id required`; break;}
//         }
//         if ((selectedIds.length === 0) && (manualFormatted.length === 0)) errs.abrcAssignedSchools = "Select at least one assigned school or add manual school rows";
//         if (!form.abrcContact || !phoneIsValid(form.abrcContact)) errs.abrcContact = "ABRC contact must be 10 digits";
//         if (form.abrcAlternateContact && !phoneIsValid(form.abrcAlternateContact)) errs.abrcAlternateContact = "ABRC alternate must be 10 digits";
//       }
//       if (!form.dataFilledBy) errs.dataFilledBy = "Logged-in user not found";
//       setErrors(errs);
//       return Object.keys(errs).length === 0;
//     };

//     const buildPayload = () => {
//       const district = form.district ? form.district.value : "";
//       const block = form.block ? form.block.value : "";
//       const scholType = form.scholType ? form.scholType.value : "";
//       const schoolNameForSchoolType = form.dataType === "School"
//         ? form.manualSchool ? form.manualSchoolName || "NA" : form.school ? form.school.value : "NA"
//         : "NA";

//       let abrcAssignedCsv = "NA";
//       if (form.dataType === "ABRC") {
//         const selectedIds = (form.abrcAssignedSchools||[]).map(o=>String(o.value));
//         const manualRows = (form.abrcAssignedManualRows||[])
//           .map(r=> ({ name: r.name?.trim(), id: r.id?.trim() }))
//           .filter(r=> r.name && r.id)
//           .map(r=> `${r.name}(${r.id})`);
//         const combined = [...selectedIds, ...manualRows].filter(Boolean);
//         abrcAssignedCsv = combined.length ? combined.join(",") : "NA";
//       }

//       return {
//         _id: form._id,
//         district,
//         block,
//         scholType,
//         school: schoolNameForSchoolType,
//         principal: form.dataType === "School" ? form.principal || "NA" : "NA",
//         principalContact: form.dataType === "School" ? form.principalContact || "NA" : "NA",
//         alternateSchoolNumber: form.alternateSchoolNumber || "NA",
//         abrcName: form.dataType === "ABRC" ? form.abrcName || "NA" : "NA",
//         abrcAssignedSchools: form.dataType === "ABRC" ? abrcAssignedCsv : "NA",
//         abrcContact: form.dataType === "ABRC" ? form.abrcContact || "NA" : "NA",
//         abrcAlternateContact: form.dataType === "ABRC" ? form.abrcAlternateContact || "NA" : "NA",
//         dataType: form.dataType,
//         dataFilledBy: form.dataFilledBy,
//       };
//     };

//     const handleSave = async (e) => {
//       e.preventDefault();
//       setAlert({ show:false, variant:"", msg:"" });
//       if (!validate()) {
//         setAlert({ show:true, variant:"danger", msg:"Fix validation errors" });
//         return;
//       }
//       const payload = buildPayload();
//       console.log(payload)

//       try {
//         setSaving(true);
//         const resp = await UpdateData(payload);
        
//         const resData = resp && resp.data ? resp.data : resp;
//         if (resData && resData.success) {
//           setAlert({ show:true, variant:"success", msg: resData.msg || "Updated" });
//           onSaved(resData.data);
//           // close after short delay
//           setTimeout(() => onClose(), 700);
//         } else {
//           setAlert({ show:true, variant:"danger", msg: (resData && resData.msg) || "Server error" });
//         }
//       } catch (err) {
//         console.error(err);
//         setAlert({ show:true, variant:"danger", msg: err?.message || "Network error" });
//       } finally {
//         setSaving(false);
//       }
//     };

//     return (
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h5 className="mb-0">Edit {form.dataType} Record</h5>
//             <Badge bg="secondary">_id: {form._id || "new"}</Badge>
//           </div>

//           {alert.show && <Alert variant={alert.variant} onClose={() => setAlert({ show:false })} dismissible>{alert.msg}</Alert>}

//           <Form onSubmit={handleSave}>
//             <Row className="g-3">
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Data Type</Form.Label>
//                   <Form.Select value={form.dataType} onChange={(e)=> setForm(f=> ({ ...f, dataType: e.target.value }))}>
//                     <option value="School">School</option>
//                     <option value="ABRC">ABRC</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               {form.dataType === "School" && (
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>School Type</Form.Label>
//                     <Select name="scholType" value={form.scholType} onChange={(v)=> handleSelectChange(v, {name:"scholType"})} options={[
//                       { value: "Middle", label: "Middle" },
//                       { value: "High", label: "High" },
//                       { value: "Model", label: "Model" },
//                       { value: "Aarohi", label: "Aarohi" },
//                       { value: "Senior Secondary", label: "Senior Secondary" },
//                     ]} isClearable />
//                     {errors.scholType && <div className="text-danger small mt-1">{errors.scholType}</div>}
//                   </Form.Group>
//                 </Col>
//               )}

//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>District</Form.Label>
//                   <Select name="district" value={form.district} onChange={(v)=> handleSelectChange(v, {name:"district"})} options={districtOptions} isClearable />
//                   {errors.district && <div className="text-danger small mt-1">{errors.district}</div>}
//                 </Form.Group>
//               </Col>

//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Block</Form.Label>
//                   <Select name="block" value={form.block} onChange={(v)=> handleSelectChange(v, {name:"block"})} options={blockOptions} isClearable isDisabled={!form.district} />
//                   {errors.block && <div className="text-danger small mt-1">{errors.block}</div>}
//                 </Form.Group>
//               </Col>

//               {form.dataType === "School" && (
//                 <Col md={6}>
//                   <Form.Group className="mb-2">
//                     <Form.Check type="checkbox" name="manualSchool" checked={form.manualSchool} onChange={handleCheckbox} label="Manual school entry (if school not in list)" />
//                   </Form.Group>

//                   {!form.manualSchool ? (
//                     <Form.Group>
//                       <Form.Label>School</Form.Label>
//                       <Select name="school" value={form.school} onChange={(v)=> handleSelectChange(v, {name:"school"})} options={schoolOptions} isClearable isDisabled={!form.block || !form.scholType} placeholder={!form.block || !form.scholType ? "Select School Type & Block first" : "Search & select school"} noOptionsMessage={()=> "No schools found"} />
//                       {errors.school && <div className="text-danger small mt-1">{errors.school}</div>}
//                     </Form.Group>
//                   ) : (
//                     <Form.Group>
//                       <Form.Label>Manual School Name</Form.Label>
//                       <Form.Control type="text" name="manualSchoolName" value={form.manualSchoolName} onChange={ (e)=> handleInputChange(e) } placeholder="Enter school name" />
//                       {errors.manualSchoolName && <div className="text-danger small mt-1">{errors.manualSchoolName}</div>}
//                     </Form.Group>
//                   )}
//                 </Col>
//               )}

//               {form.dataType === "School" && (
//                 <>
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Principal Name</Form.Label>
//                       <Form.Control type="text" name="principal" value={form.principal} onChange={handleInputChange} placeholder="Principal name" />
//                       {errors.principal && <div className="text-danger small mt-1">{errors.principal}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Principal Contact</Form.Label>
//                       <Form.Control type="text" name="principalContact" value={form.principalContact} onChange={handleInputChange} placeholder="10 digit mobile" maxLength={10} />
//                       {errors.principalContact && <div className="text-danger small mt-1">{errors.principalContact}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Alternate School Number (optional)</Form.Label>
//                       <Form.Control type="text" name="alternateSchoolNumber" value={form.alternateSchoolNumber} onChange={handleInputChange} placeholder="Alternate contact (optional)" maxLength={10} />
//                       {errors.alternateSchoolNumber && <div className="text-danger small mt-1">{errors.alternateSchoolNumber}</div>}
//                     </Form.Group>
//                   </Col>
//                 </>
//               )}

//               {form.dataType === "ABRC" && (
//                 <>
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>ABRC Name</Form.Label>
//                       <Form.Control type="text" name="abrcName" value={form.abrcName} onChange={handleInputChange} placeholder="ABRC name" />
//                       {errors.abrcName && <div className="text-danger small mt-1">{errors.abrcName}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>ABRC Contact</Form.Label>
//                       <Form.Control type="text" name="abrcContact" value={form.abrcContact} onChange={handleInputChange} placeholder="10 digit mobile" maxLength={10} />
//                       {errors.abrcContact && <div className="text-danger small mt-1">{errors.abrcContact}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>ABRC Alternate Contact (optional)</Form.Label>
//                       <Form.Control type="text" name="abrcAlternateContact" value={form.abrcAlternateContact} onChange={handleInputChange} placeholder="Alternate contact (optional)" maxLength={10} />
//                       {errors.abrcAlternateContact && <div className="text-danger small mt-1">{errors.abrcAlternateContact}</div>}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12}>
//                     <Form.Group>
//                       <Form.Label>Assigned Schools (multi-select - dropdown)</Form.Label>
//                       <Select
//                         name="abrcAssignedSchools"
//                         value={form.abrcAssignedSchools}
//                         onChange={(v)=> handleSelectChange(v, {name:"abrcAssignedSchools"})}
//                         options={abrcOptions}
//                         isMulti
//                         components={animatedComponents}
//                         isSearchable
//                         closeMenuOnSelect={false}
//                         placeholder="Search & select assigned schools (dropdown)"
//                         noOptionsMessage={() => "No schools found"}
//                         isDisabled={!form.block && !form.district}
//                       />
//                       {errors.abrcAssignedSchools && <div className="text-danger small mt-1">{errors.abrcAssignedSchools}</div>}
//                       <Form.Text className="text-muted d-block">Selected dropdown schools will send their IDs. You can add manual school rows below (name + id) if some schools are missing in dropdown.</Form.Text>
//                     </Form.Group>
//                   </Col>

//                   <Col md={12}>
//                     {(form.abrcAssignedManualRows || []).length === 0 && (<div className="text-muted mb-2">No manual schools added.</div>)}

//                     {(form.abrcAssignedManualRows || []).map((row, idx) => (
//                       <Row key={idx} className="g-2 mb-2 align-items-center">
//                         <Col md={6}>
//                           <Form.Group>
//                             <Form.Label className="small mb-1">School Name</Form.Label>
//                             <Form.Control type="text" value={row.name} onChange={(e)=> updateManualRow(idx, "name", e.target.value)} placeholder="Manual school name" />
//                           </Form.Group>
//                         </Col>
//                         <Col md={4}>
//                           <Form.Group>
//                             <Form.Label className="small mb-1">School ID (alphanumeric)</Form.Label>
//                             <Form.Control type="text" value={row.id} onChange={(e)=> updateManualRow(idx, "id", e.target.value)} placeholder="ID" />
//                           </Form.Group>
//                         </Col>
//                         <Col md={2}>
//                           <div className="d-grid">
//                             <Button variant="danger" size="sm" onClick={()=> removeManualRow(idx)}>Remove</Button>
//                           </div>
//                         </Col>
//                       </Row>
//                     ))}

//                     <div className="mt-2">
//                       <Button variant="outline-primary" size="sm" onClick={addManualRow}>+ Add manual school</Button>
//                     </div>
//                     {errors.abrcAssignedSchools && <div className="text-danger small mt-1">{errors.abrcAssignedSchools}</div>}
//                   </Col>
//                 </>
//               )}

//               <Col md={12} className="mt-3">
//                 <div className="d-flex gap-2">
//                   <Button variant="primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
//                   <Button variant="outline-secondary" type="button" onClick={onClose}>Cancel</Button>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </Card.Body>
//       </Card>
//     );
//   };

//   // ---------- end EditForm ----------

//   const onEditClick = (row) => {
//     setEditingRow(row);
//     setShowEditModal(true);
//   };

//   const handleRowUpdated = (updatedRow) => {
//     // replace the updated row in local state
//     setData(prev => prev.map(r => r._id === updatedRow._id ? updatedRow : r));
//   };

//   return (

//     <>
//     <UserNavBar/>
//     <Container className="py-4">
//         <label className="mb-2 d-block">Select Data type</label>
//         <Row className="align-items-center mb-3">
//           <Col xs={12} md={6} lg={4}>
//             <Select
//               components={animatedComponents}
//               value={{ value: selectedType, label: selectedType }}
//               onChange={(option) => setSelectedType(option.value)}
//               options={[
//                   {value: 'ABRC', label:'ABRC'},
//                   {value: 'School', label:'School'}
//               ]}
//             />
//           </Col>
//           <Col className="text-end">
//             <Badge bg="secondary">Showing: {selectedType}</Badge>
//           </Col>
//         </Row>

//         <Card className="mb-4">
//           <Card.Body>
//             <h4 className="mb-0">Update data</h4>
//           </Card.Body>
//         </Card>

//         {loading && (
//           <div className="d-flex justify-content-center py-4">
//             <Spinner animation="border" role="status" />
//           </div>
//         )}

//         {error && (
//           <Alert variant="danger">{error}</Alert>
//         )}

//         {!loading && !error && data?.length === 0 && (
//           <Alert variant="info">No records found for the selected data type.</Alert>
//         )}

//         {!loading && data?.length > 0 && (
//           <Card>
//             <Card.Body>
//               <Table responsive bordered hover size="sm">
//                 <thead>
//                   <tr>
//                     <th>District</th>
//                     <th>Block</th>
//                     <th>School Type</th>
//                     <th>School</th>
//                     <th>Principal</th>
//                     <th>Principal Contact</th>
//                     <th>Alt. School Number</th>
//                     {selectedType === 'ABRC' ? (
//                       <>
//                         <th>ABRC Name</th>
//                         <th>ABRC Assigned Schools</th>
//                         <th>ABRC Contact</th>
//                         <th>ABRC Alt Contact</th>
//                       </>
//                     ) : null}
//                     <th>Created At</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.map((row) => (
//                     <tr key={row._id}>
//                       <td>{row.district || 'NA'}</td>
//                       <td>{row.block || 'NA'}</td>
//                       <td>{row.scholType || 'NA'}</td>
//                       <td>{row.school || 'NA'}</td>
//                       <td>{row.principal || 'NA'}</td>
//                       <td>{row.principalContact || 'NA'}</td>
//                       <td>{row.alternateSchoolNumber || 'NA'}</td>
//                       {selectedType === 'ABRC' && (
//                         <>
//                           <td>{row.abrcName || 'NA'}</td>
//                           <td style={{maxWidth: 220, overflowWrap: 'anywhere'}}>{row.abrcAssignedSchools || 'NA'}</td>
//                           <td>{row.abrcContact || 'NA'}</td>
//                           <td>{row.abrcAlternateContact || 'NA'}</td>
//                         </>
//                       )}
//                       <td>{row.createdAt ? new Date(row.createdAt).toLocaleString('en-IN') : 'NA'}</td>
//                       <td>
//                         <div className="d-flex gap-2">
//                           <Button size="sm" variant="outline-primary" onClick={() => onEditClick(row)}>Edit</Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Edit modal */}
//         <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" fullscreen="md-down">
//           <Modal.Header closeButton>
//             <Modal.Title>Edit Record</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {editingRow ? (
//               <EditForm
//                 initialData={editingRow}
//                 onClose={() => setShowEditModal(false)}
//                 onSaved={(updated) => handleRowUpdated(updated)}
//               />
//             ) : (
//               <div>Loading...</div>
//             )}
//           </Modal.Body>
//         </Modal>

//     </Container>

//     </>
//   )
// }
















// PrincipalSchoolsAbrcDataCollection.jsx
import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Badge,
  Table,
  Spinner,
  Modal,
} from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { CreateData , GetData, UpdateData } from "../../services/PrincipalSchoolsAbrcDataCollection";
import { UserContext } from "../ContextApi/UserContextAPI/UserContext";
import UserNavBar from "../UserNavBar"; // keep your navbar
import DistrictBlockSchool from "../DistrictBlockSchool.json"; // adjust path if needed

export const UpdatePrincipalSchoolsAbrcData = () => {

  const { user } = useContext(UserContext);

  console.log(user)

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("ABRC");

  // modal / edit state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const animatedComponents = makeAnimated();

  // --- FILTER STATES ADDED ---
  // Filter by district dropdown (uses district name), name (regex), contact (regex)
  const [filterDistrict, setFilterDistrict] = useState(null); // will store {value, label} like Select
  const [filterName, setFilterName] = useState(""); // regex string
  const [filterContact, setFilterContact] = useState(""); // regex string
  // ---------------------------

  const fetchData = async (type = selectedType) =>{
      // build request body exactly like you used earlier
      const reqBody = {
          dataFilledBy: user?._id,
          dataType: type
      }
      setLoading(true);
      setError(null);
      try {
          const response = await GetData(reqBody);
          // assume backend shape: response.data.data (as you logged earlier)
          const fetched = response?.data?.data || [];
          console.log(fetched)
          setData(fetched);
      } catch (error) {
          console.log("Error fetching data::::>", error)
          setError(error?.message || "Failed to fetch data");
          setData([]);
      } finally{
          setLoading(false);
      }
  }

  // fetch when component mounts (initial selectedType is "ABRC")
  useEffect(()=>{
      if (user?._id) fetchData(selectedType);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // fetch when selectedType changes
  useEffect(()=>{
    if (user?._id) fetchData(selectedType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  // ---------- Edit form helpers & small form component ----------
  const onlyDigitsAndLimit = (raw, limit = 10) => {
    const digits = (raw || "").replace(/\D/g, "");
    return digits.slice(0, limit);
  };

  const phoneIsValid = (p) => {
    if (!p) return false;
    const onlyDigits = p.replace(/\D/g, "");
    return onlyDigits.length === 10;
  };

  // Transform CSV like "6628,6635,SchoolName(123)" into select & manual rows
  const parseAbrcAssigned = (csv = "") => {
    if (!csv || csv === "NA") return { selectedIds: [], manualRows: [] };
    const parts = csv.split(",").map(s => s.trim()).filter(Boolean);
    const selectedIds = [];
    const manualRows = [];
    parts.forEach(p => {
      const m = p.match(/^(.+)\((.+)\)$/); // Name(id)
      if (m) manualRows.push({ name: m[1], id: m[2] });
      else if (/^\d+$/.test(p)) selectedIds.push(p);
      else manualRows.push({ name: p, id: "" });
    });
    return { selectedIds, manualRows };
  };

  // Small EditForm component embedded (prefilled, validates, calls UpdateData)
  const EditForm = ({ initialData, onClose, onSaved }) => {
    // initial shape
    const init = {
      _id: initialData?._id || "",
      district: initialData?.district ? { value: initialData.district, label: initialData.district } : null,
      block: initialData?.block ? { value: initialData.block, label: initialData.block } : null,
      scholType: initialData?.scholType ? { value: initialData.scholType, label: initialData.scholType } : null,
      school: initialData?.school ? { value: initialData.school, label: initialData.school } : null,
      manualSchool: false,
      manualSchoolName: "",
      principal: initialData?.principal || "",
      principalContact: initialData?.principalContact || "",
      alternateSchoolNumber: initialData?.alternateSchoolNumber || "",
      abrcName: initialData?.abrcName || "",
      abrcAssignedSchools: [], // will fill below
      abrcAssignedManualRows: [],
      abrcContact: initialData?.abrcContact || "",
      abrcAlternateContact: initialData?.abrcAlternateContact || "",
      dataType: initialData?.dataType || "School",
      dataFilledBy: initialData?.dataFilledBy || user?._id || "",
    };

    const parsed = parseAbrcAssigned(initialData?.abrcAssignedSchools);
    init.abrcAssignedSchools = parsed.selectedIds.map(id => ({ value: id, label: id }));
    init.abrcAssignedManualRows = parsed.manualRows;

    const [form, setForm] = useState(init);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [blockOptions, setBlockOptions] = useState([]);
    const [schoolOptions, setSchoolOptions] = useState([]);
    const [allSchoolOptionsForABRC, setAllSchoolOptionsForABRC] = useState([]);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ show:false, variant:"", msg:"" });

    useEffect(() => {
      const uniqDistricts = Array.from(
        new Map(DistrictBlockSchool.map((d) => [d.d_name, { value: d.d_name, label: d.d_name }])).values()
      ).sort((a,b) => a.label.localeCompare(b.label));
      setDistrictOptions(uniqDistricts);

      const flattened = DistrictBlockSchool.map((s) => ({
        value: String(s.s_id),
        label: s.s_name,
        district: s.d_name,
        block: s.b_name,
      }));
      const deduped = Array.from(new Map(flattened.map((f) => [f.value, f])).values()).sort((a,b) => a.label.localeCompare(b.label));
      setAllSchoolOptionsForABRC(deduped);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      // when district changes
      if (!form.district) { setBlockOptions([]); setSchoolOptions([]); return; }
      const filtered = DistrictBlockSchool.filter(d=> d.d_name === form.district.value);
      const uniqBlocks = Array.from(new Map(filtered.map((b) => [b.b_name, { value: b.b_name, label: b.b_name }])).values())
        .sort((a,b)=> a.label.localeCompare(b.label));
      setBlockOptions(uniqBlocks);
      setSchoolOptions([]);
    }, [form.district]);

    useEffect(() => {
      if (!form.block || !form.scholType) { setSchoolOptions([]); return; }
      const filtered = DistrictBlockSchool.filter(s => s.d_name === form.district?.value && s.b_name === form.block?.value);
      const opts = filtered.map(s => ({ value: s.s_name, label: s.s_name, schoolId: String(s.s_id) }));
      const deduped = Array.from(new Map(opts.map(o => [o.value, o])).values()).sort((a,b)=> a.label.localeCompare(b.label));
      setSchoolOptions(deduped);
    }, [form.block, form.district, form.scholType]);

    const abrcOptions = useMemo(() => {
      if (schoolOptions && schoolOptions.length > 0) return schoolOptions.map(s => ({ value: s.schoolId, label: s.label }));
      return allSchoolOptionsForABRC;
    }, [schoolOptions, allSchoolOptionsForABRC]);

    const handleSelectChange = (val, meta) => {
      const name = meta?.name;
      if (!name) return;
      setForm(f => ({ ...f, [name]: val }));
      setErrors(e => ({ ...e, [name]: null }));
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (["principalContact","alternateSchoolNumber","abrcContact","abrcAlternateContact"].includes(name)) {
        const cleaned = onlyDigitsAndLimit(value, 10);
        setForm(f => ({ ...f, [name]: cleaned }));
        setErrors(e => ({ ...e, [name]: null }));
        return;
      }
      setForm(f => ({ ...f, [name]: value }));
      setErrors(e => ({ ...e, [name]: null }));
    };

    const handleCheckbox = (e) => {
      const { name, checked } = e.target;
      setForm(f => ({ ...f, [name]: checked }));
      setErrors(e => ({ ...e, [name]: null }));
      if (!checked && name === "manualSchool") setForm(f => ({ ...f, manualSchoolName: "" }));
    };

    const addManualRow = () => setForm(f => ({ ...f, abrcAssignedManualRows: [...(f.abrcAssignedManualRows||[]), { name:"", id:"" }] }));
    const removeManualRow = (i) => setForm(f => { const c=[...(f.abrcAssignedManualRows||[])]; c.splice(i,1); return { ...f, abrcAssignedManualRows: c };});
    const updateManualRow = (i, field, val) => setForm(f => { const c=[...(f.abrcAssignedManualRows||[])]; c[i] = { ...c[i], [field]: val }; return { ...f, abrcAssignedManualRows: c }; });

    const validate = () => {
      const errs = {};
      if (!form.dataType) errs.dataType = "Select Data Type";
      if (!form.district) errs.district = "District is required";
      if (!form.block) errs.block = "Block is required";
      if (form.dataType === "School") {
        if (!form.scholType) errs.scholType = "School Type is required";
        if (!form.manualSchool) {
          if (!form.school) errs.school = "Select a school (or enable manual entry)";
        } else {
          if (!form.manualSchoolName || !form.manualSchoolName.trim()) errs.manualSchoolName = "Enter school name";
        }
        if (!form.principal || !form.principal.trim()) errs.principal = "Principal name is required";
        if (!form.principalContact || !phoneIsValid(form.principalContact)) errs.principalContact = "Principal contact must be 10 digits";
        if (form.alternateSchoolNumber && !phoneIsValid(form.alternateSchoolNumber)) errs.alternateSchoolNumber = "Alternate number must be 10 digits";
      } else {
        if (!form.abrcName || !form.abrcName.trim()) errs.abrcName = "ABRC name is required";
        const selectedIds = (form.abrcAssignedSchools||[]).map(o=>String(o.value));
        const manualRows = form.abrcAssignedManualRows || [];
        const manualFormatted = manualRows.map(r=>({ name: r.name?.trim(), id: r.id?.trim() })).filter(r=> r.name || r.id);
        for (let i=0;i<manualFormatted.length;i++){
          const r = manualFormatted[i];
          if (!r.name) { errs.abrcAssignedSchools = `Manual row ${i+1}: School name required`; break;}
          if (!r.id) { errs.abrcAssignedSchools = `Manual row ${i+1}: School id required`; break;}
        }
        if ((selectedIds.length === 0) && (manualFormatted.length === 0)) errs.abrcAssignedSchools = "Select at least one assigned school or add manual school rows";
        if (!form.abrcContact || !phoneIsValid(form.abrcContact)) errs.abrcContact = "ABRC contact must be 10 digits";
        if (form.abrcAlternateContact && !phoneIsValid(form.abrcAlternateContact)) errs.abrcAlternateContact = "ABRC alternate must be 10 digits";
      }
      if (!form.dataFilledBy) errs.dataFilledBy = "Logged-in user not found";
      setErrors(errs);
      return Object.keys(errs).length === 0;
    };

    const buildPayload = () => {
      const district = form.district ? form.district.value : "";
      const block = form.block ? form.block.value : "";
      const scholType = form.scholType ? form.scholType.value : "";
      const schoolNameForSchoolType = form.dataType === "School"
        ? form.manualSchool ? form.manualSchoolName || "NA" : form.school ? form.school.value : "NA"
        : "NA";

      let abrcAssignedCsv = "NA";
      if (form.dataType === "ABRC") {
        const selectedIds = (form.abrcAssignedSchools||[]).map(o=>String(o.value));
        const manualRows = (form.abrcAssignedManualRows||[])
          .map(r=> ({ name: r.name?.trim(), id: r.id?.trim() }))
          .filter(r=> r.name && r.id)
          .map(r=> `${r.name}(${r.id})`);
        const combined = [...selectedIds, ...manualRows].filter(Boolean);
        abrcAssignedCsv = combined.length ? combined.join(",") : "NA";
      }

      return {
        _id: form._id,
        district,
        block,
        scholType,
        school: schoolNameForSchoolType,
        principal: form.dataType === "School" ? form.principal || "NA" : "NA",
        principalContact: form.dataType === "School" ? form.principalContact || "NA" : "NA",
        alternateSchoolNumber: form.alternateSchoolNumber || "NA",
        abrcName: form.dataType === "ABRC" ? form.abrcName || "NA" : "NA",
        abrcAssignedSchools: form.dataType === "ABRC" ? abrcAssignedCsv : "NA",
        abrcContact: form.dataType === "ABRC" ? form.abrcContact || "NA" : "NA",
        abrcAlternateContact: form.dataType === "ABRC" ? form.abrcAlternateContact || "NA" : "NA",
        dataType: form.dataType,
        dataFilledBy: form.dataFilledBy,
      };
    };

    const handleSave = async (e) => {
      e.preventDefault();
      setAlert({ show:false, variant:"", msg:"" });
      if (!validate()) {
        setAlert({ show:true, variant:"danger", msg:"Fix validation errors" });
        return;
      }
      const payload = buildPayload();
      console.log(payload)

      try {
        setSaving(true);
        const resp = await UpdateData(payload);
        
        const resData = resp && resp.data ? resp.data : resp;
        if (resData && resData.success) {
          setAlert({ show:true, variant:"success", msg: resData.msg || "Updated" });
          onSaved(resData.data);
          // close after short delay
          setTimeout(() => onClose(), 700);
        } else {
          setAlert({ show:true, variant:"danger", msg: (resData && resData.msg) || "Server error" });
        }
      } catch (err) {
        console.error(err);
        setAlert({ show:true, variant:"danger", msg: err?.message || "Network error" });
      } finally {
        setSaving(false);
      }
    };

    return (
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Edit {form.dataType} Record</h5>
            <Badge bg="secondary">_id: {form._id || "new"}</Badge>
          </div>

          {alert.show && <Alert variant={alert.variant} onClose={() => setAlert({ show:false })} dismissible>{alert.msg}</Alert>}

          <Form onSubmit={handleSave}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Data Type</Form.Label>
                  <Form.Select value={form.dataType} onChange={(e)=> setForm(f=> ({ ...f, dataType: e.target.value }))}>
                    <option value="School">School</option>
                    <option value="ABRC">ABRC</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {form.dataType === "School" && (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>School Type</Form.Label>
                    <Select name="scholType" value={form.scholType} onChange={(v)=> handleSelectChange(v, {name:"scholType"})} options={[
                      { value: "Middle", label: "Middle" },
                      { value: "High", label: "High" },
                      { value: "Model", label: "Model" },
                      { value: "Aarohi", label: "Aarohi" },
                      { value: "Senior Secondary", label: "Senior Secondary" },
                    ]} isClearable />
                    {errors.scholType && <div className="text-danger small mt-1">{errors.scholType}</div>}
                  </Form.Group>
                </Col>
              )}

              <Col md={6}>
                <Form.Group>
                  <Form.Label>District</Form.Label>
                  <Select name="district" value={form.district} onChange={(v)=> handleSelectChange(v, {name:"district"})} options={districtOptions} isClearable />
                  {errors.district && <div className="text-danger small mt-1">{errors.district}</div>}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Block</Form.Label>
                  <Select name="block" value={form.block} onChange={(v)=> handleSelectChange(v, {name:"block"})} options={blockOptions} isClearable isDisabled={!form.district} />
                  {errors.block && <div className="text-danger small mt-1">{errors.block}</div>}
                </Form.Group>
              </Col>

              {form.dataType === "School" && (
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Check type="checkbox" name="manualSchool" checked={form.manualSchool} onChange={handleCheckbox} label="Manual school entry (if school not in list)" />
                  </Form.Group>

                  {!form.manualSchool ? (
                    <Form.Group>
                      <Form.Label>School</Form.Label>
                      <Select name="school" value={form.school} onChange={(v)=> handleSelectChange(v, {name:"school"})} options={schoolOptions} isClearable isDisabled={!form.block || !form.scholType} placeholder={!form.block || !form.scholType ? "Select School Type & Block first" : "Search & select school"} noOptionsMessage={()=> "No schools found"} />
                      {errors.school && <div className="text-danger small mt-1">{errors.school}</div>}
                    </Form.Group>
                  ) : (
                    <Form.Group>
                      <Form.Label>Manual School Name</Form.Label>
                      <Form.Control type="text" name="manualSchoolName" value={form.manualSchoolName} onChange={ (e)=> handleInputChange(e) } placeholder="Enter school name" />
                      {errors.manualSchoolName && <div className="text-danger small mt-1">{errors.manualSchoolName}</div>}
                    </Form.Group>
                  )}
                </Col>
              )}

              {form.dataType === "School" && (
                <>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Principal Name</Form.Label>
                      <Form.Control type="text" name="principal" value={form.principal} onChange={handleInputChange} placeholder="Principal name" />
                      {errors.principal && <div className="text-danger small mt-1">{errors.principal}</div>}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Principal Contact</Form.Label>
                      <Form.Control type="text" name="principalContact" value={form.principalContact} onChange={handleInputChange} placeholder="10 digit mobile" maxLength={10} />
                      {errors.principalContact && <div className="text-danger small mt-1">{errors.principalContact}</div>}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Alternate School Number (optional)</Form.Label>
                      <Form.Control type="text" name="alternateSchoolNumber" value={form.alternateSchoolNumber} onChange={handleInputChange} placeholder="Alternate contact (optional)" maxLength={10} />
                      {errors.alternateSchoolNumber && <div className="text-danger small mt-1">{errors.alternateSchoolNumber}</div>}
                    </Form.Group>
                  </Col>
                </>
              )}

              {form.dataType === "ABRC" && (
                <>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>ABRC Name</Form.Label>
                      <Form.Control type="text" name="abrcName" value={form.abrcName} onChange={handleInputChange} placeholder="ABRC name" />
                      {errors.abrcName && <div className="text-danger small mt-1">{errors.abrcName}</div>}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>ABRC Contact</Form.Label>
                      <Form.Control type="text" name="abrcContact" value={form.abrcContact} onChange={handleInputChange} placeholder="10 digit mobile" maxLength={10} />
                      {errors.abrcContact && <div className="text-danger small mt-1">{errors.abrcContact}</div>}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>ABRC Alternate Contact (optional)</Form.Label>
                      <Form.Control type="text" name="abrcAlternateContact" value={form.abrcAlternateContact} onChange={handleInputChange} placeholder="Alternate contact (optional)" maxLength={10} />
                      {errors.abrcAlternateContact && <div className="text-danger small mt-1">{errors.abrcAlternateContact}</div>}
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Assigned Schools (multi-select - dropdown)</Form.Label>
                      <Select
                        name="abrcAssignedSchools"
                        value={form.abrcAssignedSchools}
                        onChange={(v)=> handleSelectChange(v, {name:"abrcAssignedSchools"})}
                        options={abrcOptions}
                        isMulti
                        components={animatedComponents}
                        isSearchable
                        closeMenuOnSelect={false}
                        placeholder="Search & select assigned schools (dropdown)"
                        noOptionsMessage={() => "No schools found"}
                        isDisabled={!form.block && !form.district}
                      />
                      {errors.abrcAssignedSchools && <div className="text-danger small mt-1">{errors.abrcAssignedSchools}</div>}
                      <Form.Text className="text-muted d-block">Selected dropdown schools will send their IDs. You can add manual school rows below (name + id) if some schools are missing in dropdown.</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    {(form.abrcAssignedManualRows || []).length === 0 && (<div className="text-muted mb-2">No manual schools added.</div>)}

                    {(form.abrcAssignedManualRows || []).map((row, idx) => (
                      <Row key={idx} className="g-2 mb-2 align-items-center">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small mb-1">School Name</Form.Label>
                            <Form.Control type="text" value={row.name} onChange={(e)=> updateManualRow(idx, "name", e.target.value)} placeholder="Manual school name" />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="small mb-1">School ID (alphanumeric)</Form.Label>
                            <Form.Control type="text" value={row.id} onChange={(e)=> updateManualRow(idx, "id", e.target.value)} placeholder="ID" />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <div className="d-grid">
                            <Button variant="danger" size="sm" onClick={()=> removeManualRow(idx)}>Remove</Button>
                          </div>
                        </Col>
                      </Row>
                    ))}

                    <div className="mt-2">
                      <Button variant="outline-primary" size="sm" onClick={addManualRow}>+ Add manual school</Button>
                    </div>
                    {errors.abrcAssignedSchools && <div className="text-danger small mt-1">{errors.abrcAssignedSchools}</div>}
                  </Col>
                </>
              )}

              <Col md={12} className="mt-3">
                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                  <Button variant="outline-secondary" type="button" onClick={onClose}>Cancel</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  // ---------- end EditForm ----------

  const onEditClick = (row) => {
    setEditingRow(row);
    setShowEditModal(true);
  };

  const handleRowUpdated = (updatedRow) => {
    // replace the updated row in local state
    setData(prev => prev.map(r => r._id === updatedRow._id ? updatedRow : r));
  };

  // --------------- TOP-LEVEL FILTER HELPERS & OPTIONS ----------------
  // Build district options from DistrictBlockSchool (unique district names)
  const districtOptionsTop = useMemo(() => {
    const uniqDistricts = Array.from(
      new Map(DistrictBlockSchool.map((d) => [d.d_name, { value: d.d_name, label: d.d_name }])).values()
    ).sort((a,b) => a.label.localeCompare(b.label));
    return uniqDistricts;
  }, []);

  // escape regex fallback when user enters invalid regex
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // compute filtered data using selected filters (name & contact regex + district)
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // prepare regexes
    let nameRegex = null;
    if (filterName && filterName.trim() !== "") {
      try {
        nameRegex = new RegExp(filterName, "i");
      } catch (e) {
        nameRegex = new RegExp(escapeRegex(filterName), "i");
      }
    }

    let contactRegex = null;
    if (filterContact && filterContact.trim() !== "") {
      try {
        contactRegex = new RegExp(filterContact, "i");
      } catch (e) {
        contactRegex = new RegExp(escapeRegex(filterContact), "i");
      }
    }

    return data.filter(row => {
      // filter by selectedType too (keeps behavior same)
      // the original UI already filtered by selectedType when fetching; keep it.
      // District filter: match row.district exactly with selected district value if provided
      if (filterDistrict && filterDistrict.value) {
        if ((row.district || "").trim() !== filterDistrict.value) return false;
      }

      // Name filter: check principal, abrcName, school (some possible name fields)
      if (nameRegex) {
        const nameFields = [
          row.principal || "",
          row.abrcName || "",
          row.school || "",
        ];
        const anyNameMatch = nameFields.some(n => n && nameRegex.test(String(n)));
        if (!anyNameMatch) return false;
      }

      // Contact filter: check principalContact, alternateSchoolNumber, abrcContact, abrcAlternateContact
      if (contactRegex) {
        const contactFields = [
          row.principalContact || "",
          row.alternateSchoolNumber || "",
          row.abrcContact || "",
          row.abrcAlternateContact || "",
        ];
        const anyContactMatch = contactFields.some(c => c && contactRegex.test(String(c)));
        if (!anyContactMatch) return false;
      }

      return true;
    });
  }, [data, filterDistrict, filterName, filterContact]);

  const clearFilters = () => {
    setFilterDistrict(null);
    setFilterName("");
    setFilterContact("");
  }
  // ------------------------------------------------------------------

  return (

    <>
    <UserNavBar/>
    <Container className="py-4">
        <label className="mb-2 d-block">Select Data type</label>
        <Row className="align-items-center mb-3">
          <Col xs={12} md={6} lg={4}>
            <Select
              components={animatedComponents}
              value={{ value: selectedType, label: selectedType }}
              onChange={(option) => setSelectedType(option.value)}
              options={[
                  {value: 'ABRC', label:'ABRC'},
                  {value: 'School', label:'School'}
              ]}
            />
          </Col>
          <Col className="text-end">
            <Badge bg="secondary">Showing: {selectedType}</Badge>
          </Col>
        </Row>

        {/* ------------------- FILTER UI ADDED ------------------- */}
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-2 align-items-end">
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label className="small mb-1">Filter by District</Form.Label>
                  <Select
                    name="filterDistrict"
                    value={filterDistrict}
                    onChange={(v)=> setFilterDistrict(v)}
                    options={districtOptionsTop}
                    isClearable
                    placeholder="Select district"
                    components={animatedComponents}
                  />
                  <Form.Text className="text-muted">Dropdown of districts (clear to remove filter)</Form.Text>
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label className="small mb-1">Filter by Name (regex)</Form.Label>
                  <Form.Control
                    type="text"
                    name="filterName"
                    value={filterName}
                    onChange={(e)=> setFilterName(e.target.value)}
                    placeholder='Name'
                  />
                  <Form.Text className="text-muted">Matches Principal, ABRC name or School name.</Form.Text>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group>
                  <Form.Label className="small mb-1">Filter by Contact (regex)</Form.Label>
                  <Form.Control
                    type="text"
                    name="filterContact"
                    value={filterContact}
                    onChange={(e)=> setFilterContact(e.target.value)}
                    placeholder='contact, e.g. ^9 or 9876'
                  />
                  <Form.Text className="text-muted">Matches any contact field (principal/alternate/ABRC).</Form.Text>
                </Form.Group>
              </Col>

              <Col xs={12} md={1}>
                <div className="d-grid">
                  <Button variant="outline-secondary" size="sm" onClick={clearFilters}>Clear</Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        {/* ------------------- END FILTER UI ------------------- */}

        <Card className="mb-4">
          <Card.Body>
            <h4 className="mb-0">Update data</h4>
          </Card.Body>
        </Card>

        {loading && (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {error && (
          <Alert variant="danger">{error}</Alert>
        )}

        {!loading && !error && data?.length === 0 && (
          <Alert variant="info">No records found for the selected data type.</Alert>
        )}

        {!loading && filteredData?.length === 0 && !error && data?.length > 0 && (
          <Alert variant="info">No records match your filters.</Alert>
        )}

        {!loading && filteredData?.length > 0 && (
          <Card>
            <Card.Body>
              <Table responsive bordered hover size="sm">
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Block</th>
                    <th>School Type</th>
                    <th>School</th>
                    <th>Principal</th>
                    <th>Principal Contact</th>
                    <th>Alt. School Number</th>
                    {selectedType === 'ABRC' ? (
                      <>
                        <th>ABRC Name</th>
                        <th>ABRC Assigned Schools</th>
                        <th>ABRC Contact</th>
                        <th>ABRC Alt Contact</th>
                      </>
                    ) : null}
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row._id}>
                      <td>{row.district || 'NA'}</td>
                      <td>{row.block || 'NA'}</td>
                      <td>{row.scholType || 'NA'}</td>
                      <td>{row.school || 'NA'}</td>
                      <td>{row.principal || 'NA'}</td>
                      <td>{row.principalContact || 'NA'}</td>
                      <td>{row.alternateSchoolNumber || 'NA'}</td>
                      {selectedType === 'ABRC' && (
                        <>
                          <td>{row.abrcName || 'NA'}</td>
                          <td style={{maxWidth: 220, overflowWrap: 'anywhere'}}>{row.abrcAssignedSchools || 'NA'}</td>
                          <td>{row.abrcContact || 'NA'}</td>
                          <td>{row.abrcAlternateContact || 'NA'}</td>
                        </>
                      )}
                      <td>{row.createdAt ? new Date(row.createdAt).toLocaleString('en-IN') : 'NA'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button size="sm" variant="outline-primary" onClick={() => onEditClick(row)}>Edit</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Edit modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" fullscreen="md-down">
          <Modal.Header closeButton>
            <Modal.Title>Edit Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingRow ? (
              <EditForm
                initialData={editingRow}
                onClose={() => setShowEditModal(false)}
                onSaved={(updated) => handleRowUpdated(updated)}
              />
            ) : (
              <div>Loading...</div>
            )}
          </Modal.Body>
        </Modal>

    </Container>

    </>
  )
}
