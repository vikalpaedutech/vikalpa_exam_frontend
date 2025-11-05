

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
} from "react-bootstrap";
import Select from "react-select";
import { GetStudentdsDataForVerification, UpdateStudentVerification } from "../../services/StudentVerificationServices/StudentVerificationSerivce.js";
import { UserContext } from "../NewContextApis/UserContext.js";
import { StudentContext } from "../NewContextApis/StudentContextApi.js";
import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi.js";

export const StudentFormVerification = () => {
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

  const [rows, setRows] = useState([]); // local copy of fetched students with UI state
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [savingIds, setSavingIds] = useState([]); // track row ids being saved
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters (defaults)
  const [isVerifiedFilter, setIsVerifiedFilter] = useState("Pending");
  const [isBulkFilter, setIsBulkFilter] = useState(false);

  // row-level validation messages keyed by _id
  const [rowErrors, setRowErrors] = useState({});

  // remark options (multi-select)
  const remarkOptions = [
    { value: "Mobile number incorrect", label: "Mobile number incorrect" },
    { value: "Name incorrect", label: "Name incorrect" },
    { value: "Father name incorrect", label: "Father name incorrect" },
    { value: "WhatsApp number incorrect", label: "WhatsApp number incorrect" },
    { value: "Inappropriate image", label: "Inappropriate image" },
  ];

  // utility to extract blockIds from userData
  const blockIds =
    userData?.userAccess?.region?.flatMap((r) =>
      r.blockIds?.map((b) => b.blockId)
    ) || [];

  // Fetch function
  const fetchStudents = async () => {
    setError(null);
    setSuccessMsg(null);
    setRowErrors({});

    if (!blockIds || blockIds.length === 0) {
      setError("No block IDs available for this user.");
      return;
    }

    // --- BUILD REQ BODY: include isRegisteredBy ONLY when not bulk filter ---
    const reqBody = {
      schoolBlockCode: blockIds,
      isVerified: isVerifiedFilter,
      isBulkRegistered: isBulkFilter,
    };

    if (!isBulkFilter) {
      // only include isRegisteredBy when not fetching bulk-registered only
      reqBody.isRegisteredBy = "Self";
    }

    console.log("📤 Request body for fetching students:", reqBody);
    setLoadingFetch(true);
    try {
      const resp = await GetStudentdsDataForVerification(reqBody);
      // your service returns response.data as object with { ok:true, data: [...] } or similar
      const data = resp?.data ?? resp; // handle both shapes
      console.log("✅ Fetched students:", data);
      // normalize to array
      const arr = Array.isArray(data) ? data : data?.data ?? [];
      // Build UI rows state: include local fields for isVerified selection and remarks
      const uiRows = arr.map((stu) => ({
        ...stu,
        ui_isVerified: stu.isVerified || "Pending",
        ui_remarks:
          Array.isArray(stu.registrationFormVerificationRemark) &&
          stu.registrationFormVerificationRemark.length
            ? stu.registrationFormVerificationRemark.map((r) => ({ value: r, label: r }))
            : // if backend stores as string, try to split by semicolon or comma
            (typeof stu.registrationFormVerificationRemark === "string" && stu.registrationFormVerificationRemark.trim()
              ? stu.registrationFormVerificationRemark.split(/\s*;\s*|\s*,\s*/).map((r) => ({ value: r, label: r }))
              : []),
        _modified: false, // mark if user changed anything
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

  // on mount or when filters change, fetch
  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerifiedFilter, isBulkFilter, userData?.userAccess]);

  // handle change of verification select for a row
  const handleVerificationChange = (rowId, newVal) => {
    setRows((prev) =>
      prev.map((r) =>
        r._id === rowId ? { ...r, ui_isVerified: newVal, _modified: true } : r
      )
    );
    // clear row-specific error for remark when verification changes
    setRowErrors((prev) => {
      const copy = { ...prev };
      delete copy[rowId];
      return copy;
    });
  };

  // handle change of remarks multi-select
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

  // Prepare updates object per backend allowed fields
  const buildUpdates = (row) => {
    const updates = {};
    if (row.ui_isVerified && row.ui_isVerified !== row.isVerified) {
      updates.isVerified = row.ui_isVerified;
    } else if (row.ui_isVerified && !row.isVerified) {
      // if backend originally had no value but UI has one
      updates.isVerified = row.ui_isVerified;
    }

    // registrationFormVerificationRemark: send array if backend accepts array OR string if schema expects string.
    // We'll send array here (most flexible). If your schema expects string, change to join('; ')
    if (Array.isArray(row.ui_remarks) && row.ui_remarks.length > 0) {
      const labels = row.ui_remarks.map((o) => o.label || o.value);
      updates.registrationFormVerificationRemark = labels; // sending array
    } else if (row.ui_remarks && row.ui_remarks.length === 0 && row.registrationFormVerificationRemark) {
      // if cleared remarks, send empty array to clear it
      updates.registrationFormVerificationRemark = [];
    }

    // verifiedBy should be current user id when verifying/rejecting
    if (updates.isVerified) {
      updates.verifiedBy = userData?.user?._id || null;
    }

    return updates;
  };

  // Single-row client-side validation before sending
  const validateRowForSave = (row) => {
    const errors = [];
    // If rejected, remarks are required
    if (row.ui_isVerified === "Rejected") {
      if (!Array.isArray(row.ui_remarks) || row.ui_remarks.length === 0) {
        errors.push("Remarks required when marking Rejected.");
      }
    }
    return errors;
  };

  // Save single row
  const saveRow = async (row) => {
    setError(null);
    setSuccessMsg(null);
    if (!row || !row._id) return;

    // validate
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
      // After successful save, remove the row from the current list so it disappears (no longer Pending)
      setRows((prev) => prev.filter((r) => r._id !== row._id));
      // also update context storage if present
      if (setStudentData) {
        setStudentData((prevData = []) => {
          try {
            return Array.isArray(prevData) ? prevData.filter((d) => d._id !== row._id) : prevData;
          } catch {
            return prevData;
          }
        });
      }
      // clear any row error
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

  // Save all modified rows in bulk (sequentially)
  const saveAllModified = async () => {
    setError(null);
    setSuccessMsg(null);
    const modified = rows.filter((r) => r._modified);
    if (modified.length === 0) {
      setError("No modified rows to save.");
      return;
    }

    // validate all modified first
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
        // sequential saves
        // eslint-disable-next-line no-await-in-loop
        await saveRow(r);
      }
      setSuccessMsg(`${modified.length} row(s) updated`);
    } catch (err) {
      console.error("❌ Error saving multiple rows:", err);
      setError("Error saving some rows. See console for details.");
    }
  };

  return (
    <Container fluid className="mt-4">
      <h3 className="mb-3">Student Verification Panel</h3>

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

      {/* Wrap table in a full-width horizontal scroll frame */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        {/* make wrapper content inline-block so card expands to table width */}
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
                        {/* Show current value but only allow changing to Verified / Rejected */}
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
                        {/* inline validation message for this row */}
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
                              // Reset UI picks to original values
                              handleVerificationChange(row._id, row.isVerified || "Pending");
                              handleRemarksChange(
                                row._id,
                                Array.isArray(row.registrationFormVerificationRemark)
                                  ? row.registrationFormVerificationRemark.map((r) => ({ value: r, label: r }))
                                  : (typeof row.registrationFormVerificationRemark === "string" && row.registrationFormVerificationRemark.trim()
                                      ? row.registrationFormVerificationRemark.split(/\s*;\s*|\s*,\s*/).map((r) => ({ value: r, label: r }))
                                      : [])
                              );
                              // Reset modified flag
                              setRows((prev) => prev.map((rw) => (rw._id === row._id ? { ...rw, _modified: false } : rw)));
                              // Clear row error
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
    </Container>
  );
};
