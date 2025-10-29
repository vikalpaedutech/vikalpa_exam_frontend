
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
} from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { CreateData } from "../../services/PrincipalSchoolsAbrcDataCollection";
import { UserContext } from "../ContextApi/UserContextAPI/UserContext";
import UserNavBar from "../UserNavBar"; // keep your navbar
import DistrictBlockSchool from "../DistrictBlockSchool.json"; // adjust path if needed

const animatedComponents = makeAnimated();

const scholTypeOptions = [
  { value: "Middle", label: "Middle" },
  { value: "High", label: "High" },
  { value: "Model", label: "Model" },
  { value: "Aarohi", label: "Aarohi" },
  { value: "Senior Secondary", label: "Senior Secondary" },
];

const onlyDigitsAndLimit = (raw, limit = 10) => {
  const digits = raw.replace(/\D/g, "");
  return digits.slice(0, limit);
};

const phoneIsValid = (p) => {
  if (!p) return false;
  const onlyDigits = p.replace(/\D/g, "");
  return onlyDigits.length === 10;
};

export const PrincipalSchoolsAbrcDataCollection = () => {
  const { user } = useContext(UserContext);

  const [form, setForm] = useState({
    district: null,
    block: null,
    scholType: null,
    school: null, // single school select (for DataType = School)
    manualSchool: false,
    manualSchoolName: "",
    principal: "",
    principalContact: "",
    alternateSchoolNumber: "",
    abrcName: "",
    abrcAssignedSchools: [], // dropdown selected (each has .value = schoolId)
    abrcAssignedManualRows: [], // [{ name: '', id: '' }, ...]
    abrcContact: "",
    abrcAlternateContact: "",
    dataType: "School",
    dataFilledBy: user?._id || "",
  });

  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]); // for single school select (label=name, keep value=name)
  const [allSchoolOptionsForABRC, setAllSchoolOptionsForABRC] = useState([]); // for ABRC multi-select (value = id)
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, variant: "", msg: "" });

  // initialize lists and user id
  useEffect(() => {
    if (user && user._id) {
      setForm((f) => ({ ...f, dataFilledBy: user._id }));
    }

    // districts unique
    const uniqDistricts = Array.from(
      new Map(DistrictBlockSchool.map((d) => [d.d_name, { value: d.d_name, label: d.d_name }])).values()
    ).sort((a, b) => a.label.localeCompare(b.label));
    setDistrictOptions(uniqDistricts);

    // all schools for ABRC (value = schoolId, label = school name)
    const flattened = DistrictBlockSchool.map((s) => ({
      value: String(s.s_id),
      label: s.s_name,
      district: s.d_name,
      block: s.b_name,
    }));
    const deduped = Array.from(new Map(flattened.map((f) => [f.value, f])).values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    setAllSchoolOptionsForABRC(deduped);
  }, [user]);

  // update blocks when district changes
  useEffect(() => {
    if (!form.district) {
      setBlockOptions([]);
      setSchoolOptions([]);
      return;
    }
    const filtered = DistrictBlockSchool.filter((d) => d.d_name === form.district.value);
    const uniqBlocks = Array.from(
      new Map(filtered.map((b) => [b.b_name, { value: b.b_name, label: b.b_name }])).values()
    ).sort((a, b) => a.label.localeCompare(b.label));
    setBlockOptions(uniqBlocks);
    setSchoolOptions([]);
  }, [form.district]);

  // update schoolOptions (single-select) when block + scholType change
  useEffect(() => {
    if (!form.block || !form.scholType) {
      setSchoolOptions([]);
      return;
    }
    const filtered = DistrictBlockSchool.filter(
      (s) => s.d_name === form.district?.value && s.b_name === form.block?.value
    );

    const opts = filtered.map((s) => ({
      value: s.s_name,
      label: s.s_name,
      schoolId: String(s.s_id),
    }));
    const deduped = Array.from(new Map(opts.map((o) => [o.value, o])).values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    setSchoolOptions(deduped);
  }, [form.block, form.district, form.scholType]);

  // ABRC select options: prefer schools in chosen district+block (but value = id)
  const abrcOptions = useMemo(() => {
    if (schoolOptions && schoolOptions.length > 0) {
      // map schoolOptions => { value: id, label: name }
      return schoolOptions.map((s) => ({ value: s.schoolId, label: s.label }));
    }
    return allSchoolOptionsForABRC;
  }, [schoolOptions, allSchoolOptionsForABRC]);

  // handlers
  const handleSelectChange = (selected, meta) => {
    const name = meta?.name;
    if (!name) return;
    setForm((f) => ({ ...f, [name]: selected }));
    setErrors((e) => ({ ...e, [name]: null }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // special handling for contacts: restrict to digits and max 10
    if (
      name === "principalContact" ||
      name === "alternateSchoolNumber" ||
      name === "abrcContact" ||
      name === "abrcAlternateContact"
    ) {
      const cleaned = onlyDigitsAndLimit(value, 10);
      setForm((f) => ({ ...f, [name]: cleaned }));
      setErrors((e) => ({ ...e, [name]: null }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: null }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm((f) => ({ ...f, [name]: checked }));
    setErrors((e) => ({ ...e, [name]: null }));
    if (!checked && name === "manualSchool") {
      setForm((f) => ({ ...f, manualSchoolName: "" }));
    }
  };

  const resetAlert = () => setAlert({ show: false, variant: "", msg: "" });

  // manual rows handlers for ABRC assigned manual schools
  const addManualRow = () => {
    setForm((f) => ({ ...f, abrcAssignedManualRows: [...f.abrcAssignedManualRows, { name: "", id: "" }] }));
  };
  const removeManualRow = (index) => {
    setForm((f) => {
      const copy = [...f.abrcAssignedManualRows];
      copy.splice(index, 1);
      return { ...f, abrcAssignedManualRows: copy };
    });
  };
  const updateManualRow = (index, field, value) => {
    setForm((f) => {
      const copy = [...f.abrcAssignedManualRows];
      copy[index] = { ...copy[index], [field]: value };
      return { ...f, abrcAssignedManualRows: copy };
    });
    setErrors((e) => ({ ...e, abrcAssignedSchools: null }));
  };

  // validation
  const validate = () => {
    const errs = {};

    if (!form.dataType) errs.dataType = "Select Data Type";
    if (!form.district) errs.district = "District is required";
    if (!form.block) errs.block = "Block is required";
    // scholType required only for School
    if (form.dataType === "School") {
      if (!form.scholType) errs.scholType = "School Type is required";
    }

    if (form.dataType === "School") {
      if (!form.manualSchool) {
        if (!form.school) errs.school = "Select a school (or enable manual entry)";
      } else {
        if (!form.manualSchoolName || !form.manualSchoolName.trim()) errs.manualSchoolName = "Enter school name";
      }
      if (!form.principal || !form.principal.trim()) errs.principal = "Principal name is required";
      if (!form.principalContact || !phoneIsValid(form.principalContact)) errs.principalContact = "Principal contact must be 10 digits";
      if (form.alternateSchoolNumber && !phoneIsValid(form.alternateSchoolNumber)) errs.alternateSchoolNumber = "Alternate number must be 10 digits";
    } else {
      // ABRC
      if (!form.abrcName || !form.abrcName.trim()) errs.abrcName = "ABRC name is required";

      const selectedIds = (form.abrcAssignedSchools || []).map((o) => String(o.value));
      const manualRows = form.abrcAssignedManualRows || [];
      // validate manual rows: if any row present, both name and id must be non-empty
      const manualFormatted = manualRows
        .map((r) => ({ name: r.name?.trim(), id: r.id?.trim() }))
        .filter((r) => r.name || r.id); // keep rows with something

      // if rows exist ensure both fields filled per row
      for (let i = 0; i < manualFormatted.length; i++) {
        const r = manualFormatted[i];
        if (!r.name) {
          errs.abrcAssignedSchools = `Manual row ${i + 1}: School name required`;
          break;
        }
        if (!r.id) {
          errs.abrcAssignedSchools = `Manual row ${i + 1}: School id required`;
          break;
        }
      }

      if ((selectedIds.length === 0) && (manualFormatted.length === 0)) {
        errs.abrcAssignedSchools = "Select at least one assigned school or add manual school rows";
      }

      if (!form.abrcContact || !phoneIsValid(form.abrcContact)) errs.abrcContact = "ABRC contact must be 10 digits";
      if (form.abrcAlternateContact && !phoneIsValid(form.abrcAlternateContact)) errs.abrcAlternateContact = "ABRC alternate must be 10 digits";
    }

    if (!form.dataFilledBy) errs.dataFilledBy = "Logged-in user not found";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // build payload
  const buildPayload = () => {
    const district = form.district ? form.district.value : "";
    const block = form.block ? form.block.value : "";
    const scholType = form.scholType ? form.scholType.value : "";

    // For School dataType, school should be name (manual or selected)
    const schoolNameForSchoolType =
      form.dataType === "School"
        ? form.manualSchool
          ? form.manualSchoolName || "NA"
          : form.school
          ? form.school.value
          : "NA"
        : "NA";

    // ABRC assigned schools: combine selected ids + manual rows formatted as Name(ID)
    let abrcAssignedCsv = "NA";
    if (form.dataType === "ABRC") {
      const selectedIds = (form.abrcAssignedSchools || []).map((o) => String(o.value));
      const manualRows = (form.abrcAssignedManualRows || [])
        .map((r) => ({ name: r.name?.trim(), id: r.id?.trim() }))
        .filter((r) => r.name && r.id)
        .map((r) => `${r.name}(${r.id})`);
      const combined = [...selectedIds, ...manualRows].filter(Boolean);
      abrcAssignedCsv = combined.length ? combined.join(",") : "NA";
    }

    const payload = {
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

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlert();
    if (!validate()) {
      setAlert({ show: true, variant: "danger", msg: "Please fix validation errors." });
      return;
    }

    const payload = buildPayload();

    try {
      setLoading(true);
      const resp = await CreateData(payload);
      const data = resp && resp.data ? resp.data : resp;
      if (data && data.success) {
        setAlert({ show: true, variant: "success", msg: data.msg || "Saved successfully" });
        // reset but keep dataFilledBy
        setForm((f) => ({
          district: null,
          block: null,
          scholType: null,
          school: null,
          manualSchool: false,
          manualSchoolName: "",
          principal: "",
          principalContact: "",
          alternateSchoolNumber: "",
          abrcName: "",
          abrcAssignedSchools: [],
          abrcAssignedManualRows: [],
          abrcContact: "",
          abrcAlternateContact: "",
          dataType: "School",
          dataFilledBy: f.dataFilledBy,
        }));
        setErrors({});
      } else {
        setAlert({ show: true, variant: "danger", msg: (data && data.msg) || "Server error" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ show: true, variant: "danger", msg: err?.message || "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserNavBar />
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col lg={10} md={11}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Principal / ABRC Data Collection</h4>
                  <div>
                    <small className="text-muted me-1">Filled by:</small>
                    <Badge bg="secondary">{user?.userName || "Unknown User"}</Badge>
                  </div>
                </div>

                {alert.show && (
                  <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.msg}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    {/* NOTE: Data Filled By removed from UI but kept in payload */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Data Type</Form.Label>
                        <Form.Select
                          name="dataType"
                          value={form.dataType}
                          onChange={(e) => setForm((f) => ({ ...f, dataType: e.target.value }))}
                        >
                          <option value="School">School</option>
                          <option value="ABRC">ABRC</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    {/* Show School Type only for School entries */}
                    {form.dataType === "School" && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>School Type</Form.Label>
                          <Select
                            name="scholType"
                            value={form.scholType}
                            onChange={(val) => handleSelectChange(val, { name: "scholType" })}
                            options={scholTypeOptions}
                            isClearable
                          />
                          {errors.scholType && <div className="text-danger small mt-1">{errors.scholType}</div>}
                        </Form.Group>
                      </Col>
                    )}

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>District</Form.Label>
                        <Select
                          name="district"
                          value={form.district}
                          onChange={(val) => handleSelectChange(val, { name: "district" })}
                          options={districtOptions}
                          isClearable
                        />
                        {errors.district && <div className="text-danger small mt-1">{errors.district}</div>}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Block</Form.Label>
                        <Select
                          name="block"
                          value={form.block}
                          onChange={(val) => handleSelectChange(val, { name: "block" })}
                          options={blockOptions}
                          isClearable
                          isDisabled={!form.district}
                        />
                        {errors.block && <div className="text-danger small mt-1">{errors.block}</div>}
                      </Form.Group>
                    </Col>

                    {/* show school select/manual ONLY when Data Type = School */}
                    {form.dataType === "School" && (
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Check
                            type="checkbox"
                            label="Manual school entry (if school not in list)"
                            name="manualSchool"
                            checked={form.manualSchool}
                            onChange={handleCheckbox}
                          />
                        </Form.Group>

                        {!form.manualSchool ? (
                          <Form.Group>
                            <Form.Label>School</Form.Label>
                            <Select
                              name="school"
                              value={form.school}
                              onChange={(val) => handleSelectChange(val, { name: "school" })}
                              options={schoolOptions}
                              isClearable
                              isDisabled={!form.block || !form.scholType}
                              placeholder={!form.block || !form.scholType ? "Select School Type & Block first" : "Search & select school"}
                              noOptionsMessage={() => "No schools found"}
                            />
                            {errors.school && <div className="text-danger small mt-1">{errors.school}</div>}
                          </Form.Group>
                        ) : (
                          <Form.Group>
                            <Form.Label>Manual School Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="manualSchoolName"
                              value={form.manualSchoolName}
                              onChange={handleInputChange}
                              placeholder="Enter school name"
                            />
                            {errors.manualSchoolName && <div className="text-danger small mt-1">{errors.manualSchoolName}</div>}
                          </Form.Group>
                        )}
                      </Col>
                    )}

                    {/* SCHOOL-specific fields */}
                    {form.dataType === "School" && (
                      <>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Principal Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="principal"
                              value={form.principal}
                              onChange={handleInputChange}
                              placeholder="Principal name"
                            />
                            {errors.principal && <div className="text-danger small mt-1">{errors.principal}</div>}
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Principal Contact</Form.Label>
                            <Form.Control
                              type="text"
                              name="principalContact"
                              value={form.principalContact}
                              onChange={handleInputChange}
                              placeholder="10 digit mobile"
                              maxLength={10}
                            />
                            {errors.principalContact && <div className="text-danger small mt-1">{errors.principalContact}</div>}
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Alternate School Number (optional)</Form.Label>
                            <Form.Control
                              type="text"
                              name="alternateSchoolNumber"
                              value={form.alternateSchoolNumber}
                              onChange={handleInputChange}
                              placeholder="Alternate contact (optional)"
                              maxLength={10}
                            />
                            {errors.alternateSchoolNumber && <div className="text-danger small mt-1">{errors.alternateSchoolNumber}</div>}
                          </Form.Group>
                        </Col>
                      </>
                    )}

                    {/* ABRC-specific fields (note: school field NOT shown when ABRC) */}
                    {form.dataType === "ABRC" && (
                      <>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>ABRC Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="abrcName"
                              value={form.abrcName}
                              onChange={handleInputChange}
                              placeholder="ABRC name"
                            />
                            {errors.abrcName && <div className="text-danger small mt-1">{errors.abrcName}</div>}
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>ABRC Contact</Form.Label>
                            <Form.Control
                              type="text"
                              name="abrcContact"
                              value={form.abrcContact}
                              onChange={handleInputChange}
                              placeholder="10 digit mobile"
                              maxLength={10}
                            />
                            {errors.abrcContact && <div className="text-danger small mt-1">{errors.abrcContact}</div>}
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>ABRC Alternate Contact (optional)</Form.Label>
                            <Form.Control
                              type="text"
                              name="abrcAlternateContact"
                              value={form.abrcAlternateContact}
                              onChange={handleInputChange}
                              placeholder="Alternate contact (optional)"
                              maxLength={10}
                            />
                            {errors.abrcAlternateContact && <div className="text-danger small mt-1">{errors.abrcAlternateContact}</div>}
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          <Form.Group>
                            <Form.Label>Assigned Schools (multi-select - dropdown)</Form.Label>
                            <Select
                              name="abrcAssignedSchools"
                              value={form.abrcAssignedSchools}
                              onChange={(val) => handleSelectChange(val, { name: "abrcAssignedSchools" })}
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
                            <Form.Text className="text-muted d-block">
                              Selected dropdown schools will send their IDs. You can add manual school rows below (name + id) if some schools are missing in dropdown.
                            </Form.Text>
                          </Form.Group>
                        </Col>

                        {/* Manual rows for ABRC assigned schools */}
                        <Col md={12}>
                          {(form.abrcAssignedManualRows || []).length === 0 && (
                            <div className="text-muted mb-2">No manual schools added.</div>
                          )}

                          {(form.abrcAssignedManualRows || []).map((row, idx) => (
                            <Row key={idx} className="g-2 mb-2 align-items-center">
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label className="small mb-1">School Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={row.name}
                                    onChange={(e) => updateManualRow(idx, "name", e.target.value)}
                                    placeholder="Manual school name"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group>
                                  <Form.Label className="small mb-1">School ID (alphanumeric)</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={row.id}
                                    onChange={(e) => updateManualRow(idx, "id", e.target.value)}
                                    placeholder="ID"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <div className="d-grid">
                                  <Button variant="danger" size="sm" onClick={() => removeManualRow(idx)}>
                                    Remove
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          ))}

                          {/* Moved Add button to bottom so user doesn't scroll up */}
                          <div className="mt-2">
                            <Button variant="outline-primary" size="sm" onClick={addManualRow}>
                              + Add manual school
                            </Button>
                          </div>

                          {errors.abrcAssignedSchools && <div className="text-danger small mt-1">{errors.abrcAssignedSchools}</div>}
                        </Col>
                      </>
                    )}

                    <Col md={12} className="mt-3">
                      <div className="d-flex gap-2">
                        <Button variant="primary" type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save"}
                        </Button>

                        <Button
                          variant="outline-secondary"
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              district: null,
                              block: null,
                              scholType: null,
                              school: null,
                              manualSchool: false,
                              manualSchoolName: "",
                              principal: "",
                              principalContact: "",
                              alternateSchoolNumber: "",
                              abrcName: "",
                              abrcAssignedSchools: [],
                              abrcAssignedManualRows: [],
                              abrcContact: "",
                              abrcAlternateContact: "",
                              dataType: "School",
                              dataFilledBy: f.dataFilledBy,
                            }))
                          }
                        >
                          Reset
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Tip: For ABRC assigned schools, dropdown selections add IDs; manual rows send entries like Name(ID). These are merged into one CSV and stored in `abrcAssignedSchools`.
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};


