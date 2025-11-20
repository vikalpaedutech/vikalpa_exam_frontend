import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Table,
  Form,
  Image,
  Alert,
  Tabs,
  Tab,
  Badge
} from "react-bootstrap";
import Select from "react-select";
import { 
  GetStudentdsDataForVerification, 
  UpdateStudentVerification,
  BulkUploadVerification 
} from "../../services/StudentVerificationServices/StudentVerificationSerivce.js";
import { UserContext } from "../NewContextApis/UserContext.js";
import { StudentContext } from "../NewContextApis/StudentContextApi.js";
import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi.js";

export const BulkStudentFormVerification = () => {
  const { studentData, setStudentData } = useContext(StudentContext);
  const { userData } = useContext(UserContext);
  const context = useContext(DistrictBlockSchoolDependentDropDownContext);
  const {
    districtContext,
    setDistrictContext,
    blockContext,
    setBlockContext,
    schoolContext,
    setSchoolContext,
  } = context || {};

  // Individual Student Verification State
  const [rows, setRows] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [savingIds, setSavingIds] = useState([]);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isVerifiedFilter, setIsVerifiedFilter] = useState("Pending");
  const [isBulkFilter, setIsBulkFilter] = useState(false);
  const [rowErrors, setRowErrors] = useState({});

  // Bulk Verification State
  const [bulkData, setBulkData] = useState([]);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState({}); // Track verification status per school

  const remarkOptions = [
    { value: "Mobile number incorrect", label: "Mobile number incorrect" },
    { value: "Name incorrect", label: "Name incorrect" },
    { value: "Father name incorrect", label: "Father name incorrect" },
    { value: "WhatsApp number incorrect", label: "WhatsApp number incorrect" },
    { value: "Inappropriate image", label: "Inappropriate image" },
  ];

  // Utility to extract blockIds from userData
  const blockIds =
    userData?.userAccess?.region?.flatMap((r) =>
      r.blockIds?.map((b) => b.blockId)
    ) || [];

  // Individual Student Verification Functions
  const fetchStudents = async () => {
    setError(null);
    setSuccessMsg(null);
    setRowErrors({});

    if (!blockIds || blockIds.length === 0) {
      setError("No block IDs available for this user.");
      return;
    }

    const reqBody = {
      schoolBlockCode: blockIds,
      isVerified: isVerifiedFilter,
      isBulkRegistered: isBulkFilter,
    };

    if (!isBulkFilter) {
      reqBody.isRegisteredBy = "Self";
    }

    console.log("📤 Request body for fetching students:", reqBody);
    setLoadingFetch(true);
    try {
      const resp = await GetStudentdsDataForVerification(reqBody);
      const data = resp?.data ?? resp;
      console.log("✅ Fetched students:", data);
      const arr = Array.isArray(data) ? data : data?.data ?? [];
      const uiRows = arr.map((stu) => ({
        ...stu,
        ui_isVerified: stu.isVerified || "Pending",
        ui_remarks:
          Array.isArray(stu.registrationFormVerificationRemark) &&
          stu.registrationFormVerificationRemark.length
            ? stu.registrationFormVerificationRemark.map((r) => ({ value: r, label: r }))
            : (typeof stu.registrationFormVerificationRemark === "string" && stu.registrationFormVerificationRemark.trim()
              ? stu.registrationFormVerificationRemark.split(/\s*;\s*|\s*,\s*/).map((r) => ({ value: r, label: r }))
              : []),
        _modified: false,
      }));
      setRows(uiRows);
      if (setStudentData) setStudentData(arr);
    } catch (err) {
      console.error("❌ Error fetching students:", err);
      setError(err?.message || "Failed to fetch students");
    } finally {
      setLoadingFetch(false);
    }
  };

  // Bulk Verification Functions
  const fetchBulkVerificationData = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoadingBulk(true);
    
    try {
      // You can modify this to get schoolDistrictCode from user data or filters
      const reqBody = {
        // Add any required parameters for bulk verification
      };
      
      const response = await BulkUploadVerification(reqBody);
      console.log("✅ Bulk verification data:", response);
      
      if (response.status === "Ok" && Array.isArray(response.data)) {
        setBulkData(response.data);
        // Initialize verification status
        const initialStatus = {};
        response.data.forEach(school => {
          initialStatus[school.schoolCode] = "pending";

          
        });
        setVerificationStatus(initialStatus);
      } else {
        setError("Invalid response format from bulk verification API");
      }
    } catch (err) {
      console.error("❌ Error fetching bulk verification data:", err);
      setError(err?.message || "Failed to fetch bulk verification data");
    } finally {
      setLoadingBulk(false);
    }
  };

  const handleSchoolSelection = (schoolCode, isSelected) => {
    if (isSelected) {
      setSelectedSchools(prev => [...prev, schoolCode]);
    } else {
      setSelectedSchools(prev => prev.filter(code => code !== schoolCode));
    }
  };

  const updateSchoolVerificationStatus = (schoolCode, status) => {
    setVerificationStatus(prev => ({
      ...prev,
      [schoolCode]: status
    }));
  };

  const handleBulkVerification = async (schoolCode, status) => {
    try {
      // Here you would typically make an API call to update the verification status
      // For now, we'll just update the local state
      updateSchoolVerificationStatus(schoolCode, status);
      
      setSuccessMsg(`School ${schoolCode} marked as ${status}`);
      
      // You can add API call here:
      // await UpdateBulkSchoolVerification({ schoolCode, status, verifiedBy: userData?.user?._id });
      
    } catch (err) {
      console.error("❌ Error updating bulk verification:", err);
      setError(err?.message || "Failed to update verification status");
    }
  };

  const handleVerificationChange = (rowId, newVal) => {
    setRows((prev) =>
      prev.map((r) =>
        r._id === rowId ? { ...r, ui_isVerified: newVal, _modified: true } : r
      )
    );
    setRowErrors((prev) => {
      const copy = { ...prev };
      delete copy[rowId];
      return copy;
    });
  };

  const handleRemarksChange = (rowId, selected) => {
    setRows((prev) =>
      prev.map((r) =>
        r._id === rowId ? { ...r, ui_remarks: selected || [], _modified: true } : r
      )
    );
    setRowErrors((prev) => {
      const copy = { ...prev };
      delete copy[rowId];
      return copy;
    });
  };

  const buildUpdates = (row) => {
    const updates = {};
    if (row.ui_isVerified && row.ui_isVerified !== row.isVerified) {
      updates.isVerified = row.ui_isVerified;
    } else if (row.ui_isVerified && !row.isVerified) {
      updates.isVerified = row.ui_isVerified;
    }

    if (Array.isArray(row.ui_remarks) && row.ui_remarks.length > 0) {
      const labels = row.ui_remarks.map((o) => o.label || o.value);
      updates.registrationFormVerificationRemark = labels;
    } else if (row.ui_remarks && row.ui_remarks.length === 0 && row.registrationFormVerificationRemark) {
      updates.registrationFormVerificationRemark = [];
    }

    if (updates.isVerified) {
      updates.verifiedBy = userData?.user?._id || null;
    }

    return updates;
  };

  const validateRowForSave = (row) => {
    const errors = [];
    if (row.ui_isVerified === "Rejected") {
      if (!Array.isArray(row.ui_remarks) || row.ui_remarks.length === 0) {
        errors.push("Remarks required when marking Rejected.");
      }
    }
    return errors;
  };

  const saveRow = async (row) => {
    setError(null);
    setSuccessMsg(null);
    if (!row || !row._id) return;

    const validation = validateRowForSave(row);
    if (validation.length > 0) {
      setRowErrors((prev) => ({ ...prev, [row._id]: validation.join(" ") }));
      return;
    }

    const updates = buildUpdates(row);
    if (Object.keys(updates).length === 0) {
      setError("No changes to save for this row.");
      return;
    }

    const payload = { _id: row._id, updates };

    try {
      setSavingIds((s) => [...s, row._id]);
      console.log("📤 Updating student:", payload);
      const resp = await UpdateStudentVerification(payload);
      console.log("✅ Update response:", resp);
      setSuccessMsg("Row updated successfully");
      setRows((prev) => prev.filter((r) => r._id !== row._id));
      if (setStudentData) {
        setStudentData((prevData = []) => {
          try {
            return Array.isArray(prevData) ? prevData.filter((d) => d._id !== row._id) : prevData;
          } catch {
            return prevData;
          }
        });
      }
      setRowErrors((prev) => {
        const copy = { ...prev };
        delete copy[row._id];
        return copy;
      });
    } catch (err) {
      console.error("❌ Error updating student:", err);
      setError(err?.message || "Failed to update row");
    } finally {
      setSavingIds((s) => s.filter((id) => id !== row._id));
    }
  };

  const saveAllModified = async () => {
    setError(null);
    setSuccessMsg(null);
    const modified = rows.filter((r) => r._modified);
    if (modified.length === 0) {
      setError("No modified rows to save.");
      return;
    }

    const allValidationErrors = {};
    modified.forEach((r) => {
      const v = validateRowForSave(r);
      if (v.length) allValidationErrors[r._id] = v.join(" ");
    });
    if (Object.keys(allValidationErrors).length > 0) {
      setRowErrors(allValidationErrors);
      setError("Some rows have validation errors. Fix them before saving.");
      return;
    }

    try {
      for (const r of modified) {
        await saveRow(r);
      }
      setSuccessMsg(`${modified.length} row(s) updated`);
    } catch (err) {
      console.error("❌ Error saving multiple rows:", err);
      setError("Error saving some rows. See console for details.");
    }
  };

  // Bulk Verification Status Badge
  const getStatusBadge = (status) => {
    const variants = {
      pending: "secondary",
      verified: "success",
      rejected: "danger",
      confirmed: "primary"
    };
    return (
      <Badge bg={variants[status] || "secondary"}>
        {status?.toUpperCase() || "PENDING"}
      </Badge>
    );
  };

  // Effect for individual student fetching
  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerifiedFilter, isBulkFilter, userData?.userAccess]);

  // Effect for bulk data fetching
  useEffect(() => {
    fetchBulkVerificationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid className="mt-4">
      <h3 className="mb-3">Student Verification Panel</h3>

      <Tabs defaultActiveKey="individual" className="mb-3">
        {/* Individual Student Verification Tab */}
        <Tab eventKey="individual" title="Individual Verification">
          <Card className="p-3 mb-3">
            <Row className="align-items-end gy-2">
              <Col md={4}>
                <Form.Group controlId="isVerifiedFilter">
                  <Form.Label>Status Filter (isVerified)</Form.Label>
                  <Form.Select
                    value={isVerifiedFilter}
                    onChange={(e) => setIsVerifiedFilter(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="isBulkFilter">
                  <Form.Check
                    type="checkbox"
                    label="Show Bulk Registered Only"
                    checked={isBulkFilter}
                    onChange={(e) => setIsBulkFilter(e.target.checked)}
                  />
                </Form.Group>
              </Col>

              <Col md={4} className="text-end">
                <Button variant="primary" onClick={fetchStudents} disabled={loadingFetch}>
                  {loadingFetch ? <Spinner animation="border" size="sm" /> : "Fetch Data"}
                </Button>
              </Col>
            </Row>
          </Card>

          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)} dismissible>{successMsg}</Alert>}

          <div style={{ width: "100%", overflowX: "auto" }}>
            <div style={{ display: "inline-block", minWidth: 1100 }}>
              <Card className="p-3">
                <div style={{ width: "100%" }}>
                  <Table striped bordered hover size="sm" className="align-middle" style={{ minWidth: 1100, tableLayout: "auto" }}>
                    <thead>
                      <tr>
                        <th style={{ width: 36, whiteSpace: "nowrap" }}>#</th>
                        <th style={{ whiteSpace: "nowrap" }}>SRN</th>
                        <th style={{ whiteSpace: "nowrap" }}>Name</th>
                        <th style={{ whiteSpace: "nowrap" }}>Father</th>
                        <th style={{ whiteSpace: "nowrap" }}>Mobile</th>
                        <th style={{ whiteSpace: "nowrap" }}>WhatsApp</th>
                        <th style={{ width: 160, whiteSpace: "nowrap" }}>Image</th>
                        <th style={{ width: 160, whiteSpace: "nowrap" }}>Verification</th>
                        <th style={{ width: 260, whiteSpace: "nowrap" }}>Remarks</th>
                        <th style={{ width: 170, whiteSpace: "nowrap" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length === 0 && (
                        <tr>
                          <td colSpan={10} className="text-center">
                            {loadingFetch ? "Loading..." : "No records found"}
                          </td>
                        </tr>
                      )}

                      {rows.map((row, idx) => (
                        <tr key={row._id} style={{ minHeight: 110 }}>
                          <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>{idx + 1}</td>
                          <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>{row.srn}</td>
                          <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>{row.name}</td>
                          <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>{row.father}</td>
                          <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>{row.mobile}</td>
                          <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>{row.whatsapp}</td>
                          <td style={{ verticalAlign: "middle", padding: 8, whiteSpace: "nowrap" }}>
                            {row.imageUrl ? (
                              <a href={row.imageUrl} target="_blank" rel="noreferrer">
                                <Image src={row.imageUrl} thumbnail style={{ maxWidth: 140, maxHeight: 100 }} />
                              </a>
                            ) : (
                              <div style={{ width: 140, height: 100, background: "#f0f0f0" }} />
                            )}
                          </td>

                          <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                            <Select
                              value={{ value: row.ui_isVerified, label: row.ui_isVerified }}
                              options={[
                                { value: "Verified", label: "Verified" },
                                { value: "Rejected", label: "Rejected" },
                              ]}
                              onChange={(opt) => handleVerificationChange(row._id, opt?.value || row.ui_isVerified)}
                              isSearchable={false}
                              styles={{
                                container: (base) => ({ ...base, minWidth: 140 }),
                              }}
                            />
                            <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>
                              Current: {row.isVerified || "Pending"}
                            </div>
                          </td>

                          <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                            <div style={{ minWidth: 240 }}>
                              <Select
                                isMulti
                                options={remarkOptions}
                                value={row.ui_remarks || []}
                                onChange={(sel) => handleRemarksChange(row._id, sel)}
                                placeholder={row.ui_isVerified === "Rejected" ? "Choose remarks..." : "Disabled (only for Rejected)"}
                                isDisabled={row.ui_isVerified !== "Rejected"}
                              />
                            </div>
                            {rowErrors[row._id] && (
                              <div style={{ color: "#b02a37", fontSize: 12, marginTop: 6 }}>{rowErrors[row._id]}</div>
                            )}
                          </td>

                          <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                            <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant={row._modified ? "warning" : "outline-secondary"}
                                onClick={() => {
                                  handleVerificationChange(row._id, row.isVerified || "Pending");
                                  handleRemarksChange(
                                    row._id,
                                    Array.isArray(row.registrationFormVerificationRemark)
                                      ? row.registrationFormVerificationRemark.map((r) => ({ value: r, label: r }))
                                      : (typeof row.registrationFormVerificationRemark === "string" && row.registrationFormVerificationRemark.trim()
                                        ? row.registrationFormVerificationRemark.split(/\s*;\s*|\s*,\s*/).map((r) => ({ value: r, label: r }))
                                        : [])
                                  );
                                  setRows((prev) => prev.map((rw) => (rw._id === row._id ? { ...rw, _modified: false } : rw)));
                                  setRowErrors((prev) => {
                                    const cp = { ...prev };
                                    delete cp[row._id];
                                    return cp;
                                  });
                                }}
                              >
                                Reset
                              </Button>

                              <Button
                                size="sm"
                                variant="success"
                                disabled={savingIds.includes(row._id) || !row._modified}
                                onClick={() => saveRow(row)}
                              >
                                {savingIds.includes(row._id) ? <Spinner animation="border" size="sm" /> : "Save"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <Button variant="primary" onClick={saveAllModified} disabled={savingIds.length > 0 || rows.every((r) => !r._modified)}>
                    {savingIds.length > 0 ? <Spinner animation="border" size="sm" /> : "Save All Modified"}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Tab>

        {/* Bulk Verification Tab */}
        <Tab eventKey="bulk" title="Bulk Verification">
          <Card className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Bulk School Verification</h5>
              <Button 
                variant="primary" 
                onClick={fetchBulkVerificationData} 
                disabled={loadingBulk}
              >
                {loadingBulk ? <Spinner animation="border" size="sm" /> : "Refresh Data"}
              </Button>
            </div>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)} dismissible>{successMsg}</Alert>}

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>School Code</th>
                  <th>School Name</th>
                  <th>District</th>
                  <th>Block</th>
                  <th>Principal</th>
                  <th>Contact</th>
                  <th>Class 8 Registrations</th>
                  <th>Class 10 Registrations</th>
                  <th>Total</th>
                  <th>Verification Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingBulk ? (
                  <tr>
                    <td colSpan={12} className="text-center">
                      <Spinner animation="border" /> Loading bulk verification data...
                    </td>
                  </tr>
                ) : bulkData.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center">
                      No bulk verification data found
                    </td>
                  </tr>
                ) : (
                  bulkData.map((school, index) => (
                    <tr key={school.schoolCode}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{school.schoolCode}</strong>
                      </td>
                      <td>{school.centerName}</td>
                      <td>{school.districtName} ({school.districtId})</td>
                      <td>{school.blockName} ({school.blockId})</td>
                      <td>
                        {school.principal || "N/A"}
                        {school.principal && (
                          <div>
                            <small className="text-muted">
                              ({school.principalAbrcDataUpdatedBy || "Principal"})
                            </small>
                          </div>
                        )}
                      </td>
                      <td>
                        {school.principalContact ? (
                          <a href={`tel:${school.principalContact}`} className="text-decoration-none">
                            📞 {school.principalContact}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="text-center">
                        <Badge bg="info">{school.TotalRegistration8}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg="info">{school.TotalRegistration10}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg="primary">
                          {school.TotalRegistration8 + school.TotalRegistration10}
                        </Badge>
                      </td>
                      <td className="text-center">
                        {getStatusBadge(verificationStatus[school.schoolCode])}
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleBulkVerification(school.schoolCode, 'verified')}
                            disabled={verificationStatus[school.schoolCode] === 'verified'}
                          >
                            ✓ Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleBulkVerification(school.schoolCode, 'confirmed')}
                            disabled={verificationStatus[school.schoolCode] === 'confirmed'}
                          >
                            ✓ Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleBulkVerification(school.schoolCode, 'rejected')}
                            disabled={verificationStatus[school.schoolCode] === 'rejected'}
                          >
                            ✗ Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <div className="mt-3 p-3 bg-light rounded">
              <h6>Instructions for Bulk Verification:</h6>
              <ul className="mb-0">
                <li>Call the principal using the provided contact number</li>
                <li>Confirm the total number of registrations for Class 8 and Class 10</li>
                <li>Mark the school as "Verified" after confirmation</li>
                <li>Use "Reject" if there are discrepancies in the numbers</li>
                <li>Use "Confirm" for final confirmation after verification</li>
              </ul>
            </div>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};