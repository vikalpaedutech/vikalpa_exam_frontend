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
  Alert,
  Pagination,
} from "react-bootstrap";
import { GetWrongAadharData } from "../../services/StudentVerificationServices/StudentVerificationSerivce.js";
import { UserContext } from "../NewContextApis/UserContext.js";
import { StudentContext } from "../NewContextApis/StudentContextApi.js";
import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi.js";
import { updateStudentAadhar } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

export const StudentAadharCorrecition = () => {
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // row-level validation messages keyed by _id
  const [rowErrors, setRowErrors] = useState({});

  // Summary statistics
  const [summaryStats, setSummaryStats] = useState({
    totalPending: 0,
    totalVerified: 0,
    totalRejected: 0,
  });

  // Total count from API
  const [totalCount, setTotalCount] = useState(0);

  // utility to extract blockIds from userData
  const blockIds =
    userData?.userAccess?.region?.flatMap((r) =>
      r.blockIds?.map((b) => b.blockId)
    ) || [];

  const districtIds = [
    ...(userData?.userAccess?.region?.map((r) => r.districtId) || []),
  ];

  // helper to identify invalid aadhar (last 6 digits exactly zeros)
  const isInvalidAadhar = (raw) => {
    if (!raw) return false;
    const digits = String(raw).replace(/\D/g, "");
    if (digits.length < 6) return false;
    return digits.slice(-6) === "000000";
  };

  // safe accessor for aadhar field (try multiple common keys)
  const getAadharValue = (stu) => {
    return (
      stu?.aadhar || 
      stu?.aadharNumber || 
      stu?.aadhar_no || 
      stu?.uid || 
      stu?.aadhaar || 
      ""
    );
  };

  // Check if row is already corrected by someone
  const isAlreadyCorrected = (row) => {
    return row.formCorrectionBy && row.formCorrectionBy.trim() !== "";
  };

  // Calculate summary statistics from rows
  const calculateSummaryStats = (students) => {
    const stats = {
      totalPending: 0,
      totalVerified: 0,
      totalRejected: 0,
    };

    students.forEach((student) => {
      const status = student.isVerified || "Pending";
      if (status === "Pending") stats.totalPending++;
      else if (status === "Verified") stats.totalVerified++;
      else if (status === "Rejected") stats.totalRejected++;
    });

    return stats;
  };

  // Format phone number for display and create clickable link
  const formatPhoneLink = (phoneNumber) => {
    if (!phoneNumber) return "";
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.toString().replace(/\D/g, "");
    return cleanNumber;
  };

  // Fetch function
  const fetchStudents = async (page = 1) => {
    setError(null);
    setSuccessMsg(null);
    setRowErrors({});

    if (!blockIds || blockIds.length === 0) {
      setError("No block IDs available for this user.");
      return;
    }

    const reqBody = {
      schoolDistrictCode: districtIds,
      page: page,
      limit: 100,
    };

    setLoadingFetch(true);
    try {
      const resp = await GetWrongAadharData(reqBody);
      const data = resp?.data ?? resp;

      const arr = Array.isArray(data) ? data : data?.data ?? [];

      // Build UI rows state with aadhar input value
      const uiRows = arr.map((stu) => {
        const aadharValue = getAadharValue(stu);
        return {
          ...stu,
          ui_aadhar: aadharValue, // Store aadhar value for editing
          _modified: false,
          // Check if already corrected
          _alreadyCorrected: isAlreadyCorrected(stu),
        };
      });

      setRows(uiRows);

      // Set total count from API response
      setTotalCount(resp.totalCount || 0);

      // Set pagination info
      setCurrentPage(resp.currentPage || 1);
      setTotalPages(resp.totalPages || 1);
      setHasNextPage(resp.hasNextPage || false);
      setHasPrevPage(resp.hasPrevPage || false);

      // Calculate and set summary statistics
      const stats = calculateSummaryStats(arr);
      setSummaryStats(stats);

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
    setCurrentPage(1); // Reset to first page when filter changes
    fetchStudents(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.userAccess]);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchStudents(newPage);
  };

  const handleFirstPage = () => handlePageChange(1);
  const handleLastPage = () => handlePageChange(totalPages);
  const handlePrevPage = () => handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);

  // Handle aadhar input change
  const handleAadharChange = (rowId, newValue) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r._id === rowId && !r._alreadyCorrected) {
          return { 
            ...r, 
            ui_aadhar: newValue, 
            _modified: true 
          };
        }
        return r;
      })
    );
    setRowErrors((prev) => {
      const copy = { ...prev };
      delete copy[rowId];
      return copy;
    });
  };

  // Validate aadhar number
  const validateAadhar = (aadhar) => {
    if (!aadhar) return "Aadhar number is required";
    
    // Remove any non-digit characters
    const digits = String(aadhar).replace(/\D/g, "");
    
    // Check if it's 12 digits
    if (digits.length !== 12) {
      return "Aadhar number must be exactly 12 digits";
    }
    
    // Check if it contains only numbers
    if (!/^\d+$/.test(digits)) {
      return "Aadhar number must contain only digits";
    }
    
    // Check if it's a valid aadhar (not all zeros, not starting with 0 or 1)
    if (digits === "000000000000") {
      return "Invalid Aadhar number";
    }
    
    if (digits.startsWith('0') || digits.startsWith('1')) {
      return "Aadhar number cannot start with 0 or 1";
    }
    
    return null; // No error
  };

  // Format aadhar for display (XXXX-XXXX-XXXX)
  const formatAadhar = (aadhar) => {
    if (!aadhar) return "";
    const digits = String(aadhar).replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
  };

  // Parse formatted aadhar back to digits
  const parseAadhar = (formatted) => {
    return formatted.replace(/\D/g, "");
  };

  // Save single row (aadhar update)
  const saveRow = async (row) => {
    setError(null);
    setSuccessMsg(null);
    if (!row || !row._id) return;

    // Check if already corrected
    if (row._alreadyCorrected) {
      setError("This record has already been corrected by someone else.");
      return;
    }

    // Validate aadhar
    const validationError = validateAadhar(row.ui_aadhar);
    if (validationError) {
      setRowErrors((prev) => ({ ...prev, [row._id]: validationError }));
      return;
    }

    const originalAadhar = getAadharValue(row);
    const newAadhar = row.ui_aadhar ? String(row.ui_aadhar).replace(/\D/g, "") : "";

    // Check if aadhar actually changed
    if (newAadhar === originalAadhar) {
      setError("No changes detected for this row.");
      return;
    }

    const payload = {
      _id: row._id,
      aadhar: newAadhar,
      correctedBy: userData?.user?._id || "Admin"
    };

    try {
      setSavingIds((s) => [...s, row._id]);
      
      // Call the real update API
      const resp = await updateStudentAadhar(payload);
      
      if (resp.success) {
        setSuccessMsg(`Aadhar updated successfully for ${row.name}`);
        
        // Immediately refresh data to get updated formCorrectionBy from backend
        await fetchStudents(currentPage);
        
        // Clear errors
        setRowErrors((prev) => {
          const copy = { ...prev };
          delete copy[row._id];
          return copy;
        });
      } else {
        throw new Error(resp.message || "Failed to update Aadhar");
      }
    } catch (err) {
      console.error("❌ Error updating aadhar:", err);
      setError(err.message || "Failed to update Aadhar");
    } finally {
      setSavingIds((s) => s.filter((id) => id !== row._id));
    }
  };

  // Save all modified rows
  const saveAllModified = async () => {
    setError(null);
    setSuccessMsg(null);
    
    // Filter out rows that are already corrected
    const modifiedRows = rows.filter((r) => r._modified && !r._alreadyCorrected);
    
    if (modifiedRows.length === 0) {
      const alreadyCorrectedCount = rows.filter(r => r._alreadyCorrected && r._modified).length;
      if (alreadyCorrectedCount > 0) {
        setError("Some rows have already been corrected by someone else.");
      } else {
        setError("No modified rows to save.");
      }
      return;
    }

    // Validate all rows first
    const validationErrors = {};
    modifiedRows.forEach((row) => {
      const error = validateAadhar(row.ui_aadhar);
      if (error) {
        validationErrors[row._id] = error;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setRowErrors(validationErrors);
      setError("Some rows have validation errors. Fix them before saving.");
      return;
    }

    try {
      let successCount = 0;
      let failedCount = 0;
      
      for (const row of modifiedRows) {
        try {
          await saveRow(row);
          successCount++;
        } catch (err) {
          console.error(`Failed to save row ${row._id}:`, err);
          failedCount++;
        }
      }
      
      if (successCount > 0) {
        setSuccessMsg(`${successCount} row(s) updated successfully${failedCount > 0 ? `, ${failedCount} failed` : ''}`);
      }
      
      if (failedCount > 0 && successCount === 0) {
        setError(`Failed to update ${failedCount} row(s). Check console for details.`);
      }
    } catch (err) {
      console.error("❌ Error saving multiple rows:", err);
      setError("Error saving some rows. See console for details.");
    }
  };

  // Reset single row
  const resetRow = (rowId) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r._id === rowId && !r._alreadyCorrected) {
          const originalAadhar = getAadharValue(r);
          return {
            ...r,
            ui_aadhar: originalAadhar,
            _modified: false
          };
        }
        return r;
      })
    );
    setRowErrors((prev) => {
      const copy = { ...prev };
      delete copy[rowId];
      return copy;
    });
  };

  // Reset all rows
  const resetAllRows = () => {
    setRows((prev) =>
      prev.map((r) => {
        if (!r._alreadyCorrected) {
          const originalAadhar = getAadharValue(r);
          return {
            ...r,
            ui_aadhar: originalAadhar,
            _modified: false
          };
        }
        return r;
      })
    );
    setRowErrors({});
    setSuccessMsg("All editable rows reset to original values");
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    return items;
  };

  // Get corrected by user info if available
  const getCorrectedByInfo = (row) => {
    if (!row.formCorrectionBy) return null;
    
    // In a real app, you might want to fetch user details based on ID
    return `Corrected by: ${row.formCorrectionBy}`;
  };

  // Handle phone number click
  const handlePhoneClick = (phoneNumber) => {
    const cleanNumber = formatPhoneLink(phoneNumber);
    if (cleanNumber && cleanNumber.length >= 10) {
      window.open(`tel:${cleanNumber}`, '_blank');
    }
  };

  // Handle WhatsApp click
  const handleWhatsAppClick = (phoneNumber) => {
    const cleanNumber = formatPhoneLink(phoneNumber);
    if (cleanNumber && cleanNumber.length >= 10) {
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  // Count statistics
  const totalAlreadyCorrected = rows.filter(r => r._alreadyCorrected).length;
  const totalEditable = rows.length - totalAlreadyCorrected;
  const totalModified = rows.filter(r => r._modified && !r._alreadyCorrected).length;

  return (
    <Container fluid className="mt-4">
      <h3 className="mb-3">Student Aadhaar Correction Panel</h3>

      {/* Stats Summary */}
      <Card className="p-3 mb-3 bg-light">
        <Row className="text-center">
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title className="text-primary">{totalCount}</Card.Title>
                <Card.Text>Total Records</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title className="text-success">{totalEditable}</Card.Title>
                <Card.Text>Editable Records</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title className="text-warning">{totalAlreadyCorrected}</Card.Title>
                <Card.Text>Already Corrected</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title className="text-info">{totalModified}</Card.Title>
                <Card.Text>Modified</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Filters Card */}
      <Card className="p-3 mb-3">
        <Row className="align-items-end gy-2">
          <Col md={4} className="text-center">
            <Button 
              variant="warning" 
              onClick={resetAllRows}
              disabled={totalModified === 0}
              className="mt-2"
            >
              Reset All Changes ({totalModified})
            </Button>
          </Col>

          <Col md={4} className="text-center">
            <Button 
              variant="secondary" 
              onClick={() => fetchStudents(currentPage)}
              disabled={loadingFetch}
            >
              {loadingFetch ? <Spinner animation="border" size="sm" /> : "Refresh Current Page"}
            </Button>
          </Col>

          <Col md={4} className="text-end">
            <Button variant="primary" onClick={() => fetchStudents(1)} disabled={loadingFetch}>
              {loadingFetch ? <Spinner animation="border" size="sm" /> : "Refresh All Data"}
            </Button>
          </Col>
        </Row>
      </Card>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)} dismissible>{successMsg}</Alert>}

      {/* Table Section */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <div style={{ display: "inline-block", minWidth: 1000 }}>
          <Card className="p-3">
            <div style={{ width: "100%" }}>
              <Table striped bordered hover size="sm" className="align-middle" style={{ minWidth: 1000, tableLayout: "auto" }}>
                <thead>
                  <tr>
                    <th style={{ width: 36, whiteSpace: "nowrap" }}>#</th>
                    <th style={{ whiteSpace: "nowrap" }}>SRN</th>
                    <th style={{ whiteSpace: "nowrap" }}>Name</th>
                    <th style={{ whiteSpace: "nowrap" }}>Father</th>
                    <th style={{ whiteSpace: "nowrap" }}>School</th>
                    <th style={{ whiteSpace: "nowrap" }}>Mobile</th>
                    <th style={{ whiteSpace: "nowrap" }}>WhatsApp</th>
                    <th style={{ width: 220, whiteSpace: "nowrap" }}>Aadhaar Number (Editable)</th>
                    <th style={{ width: 170, whiteSpace: "nowrap" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center">
                        {loadingFetch ? "Loading..." : "No records found"}
                      </td>
                    </tr>
                  )}

                  {rows.map((row, idx) => {
                    const isInvalid = isInvalidAadhar(row.ui_aadhar);
                    const isModified = row._modified;
                    const isSaving = savingIds.includes(row._id);
                    const alreadyCorrected = row._alreadyCorrected;
                    const correctedByInfo = getCorrectedByInfo(row);
                    const mobileNumber = formatPhoneLink(row.mobile);
                    const whatsappNumber = formatPhoneLink(row.whatsapp);
                    
                    return (
                      <tr 
                        key={row._id} 
                        style={{ 
                          minHeight: 80,
                          backgroundColor: alreadyCorrected ? '#f8f9fa' : 'inherit',
                        }}
                      >
                        <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                          {((currentPage - 1) * 100) + idx + 1}
                          {alreadyCorrected && <span className="badge bg-success ms-1">✓</span>}
                        </td>
                        <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>{row.srn}</td>
                        <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>{row.name}</td>
                        <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>{row.father}</td>
                             <td
                          style={{
                            verticalAlign: "middle",
                            maxWidth: "150px",      // limit width
                            whiteSpace: "normal",   // allow wrapping
                            overflowWrap: "break-word" // wrap long words
                          }}
                        >
                          {row.school}
                        </td>
                        <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                          {mobileNumber ? (
                            <a 
                              href={`tel:${mobileNumber}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePhoneClick(row.mobile);
                              }}
                              style={{ 
                                textDecoration: 'none', 
                                color: '#0d6efd',
                                cursor: 'pointer',
                                fontWeight: '500'
                              }}
                              title={`Call ${mobileNumber}`}
                            >
                              {row.mobile}
                              <i className="fas fa-phone ms-2" style={{ fontSize: '0.8em' }}></i>
                            </a>
                          ) : (
                            row.mobile || "-"
                          )}
                        </td>
                        <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                          {whatsappNumber ? (
                            <a 
                              href={`https://wa.me/${whatsappNumber}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleWhatsAppClick(row.whatsapp);
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ 
                                textDecoration: 'none', 
                                color: '#25D366',
                                cursor: 'pointer',
                                fontWeight: '500'
                              }}
                              title={`WhatsApp ${whatsappNumber}`}
                            >
                              {row.whatsapp}
                              <i className="fab fa-whatsapp ms-2" style={{ fontSize: '0.8em' }}></i>
                            </a>
                          ) : (
                            row.whatsapp || "-"
                          )}
                        </td>

                        {/* Aadhaar column with editable input */}
                        <td style={{ verticalAlign: "middle", padding: 8 }}>
                          <Form.Group controlId={`aadhar-${row._id}`}>
                            <Form.Control
                              type="text"
                              value={formatAadhar(row.ui_aadhar)}
                              onChange={(e) => {
                                const rawValue = parseAadhar(e.target.value);
                                handleAadharChange(row._id, rawValue);
                              }}
                              isInvalid={!!rowErrors[row._id] || isInvalid}
                              placeholder="Enter 12-digit Aadhaar"
                              maxLength={14} // 12 digits + 2 hyphens
                              className={
                                alreadyCorrected 
                                  ? "bg-success bg-opacity-10" 
                                  : isModified 
                                    ? "bg-warning bg-opacity-25" 
                                    : ""
                              }
                              disabled={alreadyCorrected || isSaving}
                              readOnly={alreadyCorrected}
                            />
                            {rowErrors[row._id] && (
                              <Form.Control.Feedback type="invalid">
                                {rowErrors[row._id]}
                              </Form.Control.Feedback>
                            )}
                            {isInvalid && !rowErrors[row._id] && !alreadyCorrected && (
                              <Form.Text className="text-danger">
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                Invalid: Last 6 digits are 000000
                              </Form.Text>
                            )}
                            {isModified && !rowErrors[row._id] && !isInvalid && !alreadyCorrected && (
                              <Form.Text className="text-warning">
                                <i className="fas fa-edit me-1"></i>
                                Modified - Click Save to update
                              </Form.Text>
                            )}
                            {alreadyCorrected && (
                              <Form.Text className="text-success">
                                <i className="fas fa-check-circle me-1"></i>
                                Already corrected {correctedByInfo && `(${correctedByInfo})`}
                              </Form.Text>
                            )}
                            {!alreadyCorrected && (
                              <Form.Text className="text-muted">
                                <i className="fas fa-history me-1"></i>
                                Original: {formatAadhar(getAadharValue(row))}
                              </Form.Text>
                            )}
                          </Form.Group>
                        </td>

                        {/* Actions column */}
                        <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                          <div className="d-flex flex-column gap-2">
                            <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant={isModified ? "warning" : "outline-secondary"}
                                onClick={() => resetRow(row._id)}
                                disabled={alreadyCorrected || !isModified || isSaving}
                              >
                                <i className="fas fa-undo me-1"></i>
                                Reset
                              </Button>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => saveRow(row)}
                                disabled={alreadyCorrected || !isModified || isSaving || !!rowErrors[row._id]}
                              >
                                {isSaving ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <>
                                    <i className="fas fa-save me-1"></i>
                                    Save
                                  </>
                                )}
                              </Button>
                            </div>
                            <div className="text-center">
                              <small className={
                                alreadyCorrected ? "text-success" : 
                                isModified ? "text-warning" : "text-secondary"
                              }>
                                {alreadyCorrected ? (
                                  <><i className="fas fa-check me-1"></i>Already corrected</>
                                ) : isModified ? (
                                  <><i className="fas fa-exclamation-triangle me-1"></i>Unsaved changes</>
                                ) : (
                                  <><i className="fas fa-check-circle me-1"></i>No changes</>
                                )}
                              </small>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span className="text-muted">
                    Page {currentPage} of {totalPages} • Showing {rows.length} records
                    {totalAlreadyCorrected > 0 && ` (${totalAlreadyCorrected} already corrected)`}
                  </span>
                </div>
                <Pagination>
                  <Pagination.First onClick={handleFirstPage} disabled={!hasPrevPage} />
                  <Pagination.Prev onClick={handlePrevPage} disabled={!hasPrevPage} />
                  {renderPaginationItems()}
                  <Pagination.Next onClick={handleNextPage} disabled={!hasNextPage} />
                  <Pagination.Last onClick={handleLastPage} disabled={!hasNextPage} />
                </Pagination>
              </div>
            )}

            <div className="d-flex justify-content-between mt-3">
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-warning" 
                  onClick={resetAllRows}
                  disabled={totalModified === 0}
                >
                  <i className="fas fa-undo me-1"></i>
                  Reset All ({totalModified})
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => fetchStudents(currentPage)}
                  disabled={loadingFetch}
                >
                  <i className="fas fa-sync me-1"></i>
                  Refresh Page
                </Button>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="text-muted">
                  <i className="fas fa-edit me-1"></i>
                  {totalModified} editable row(s) modified • 
                  <i className="fas fa-check ms-2 me-1"></i>
                  {totalAlreadyCorrected} already corrected
                </div>
                <Button 
                  variant="primary" 
                  onClick={saveAllModified} 
                  disabled={savingIds.length > 0 || totalModified === 0}
                >
                  {savingIds.length > 0 ? (
                    <>
                      <Spinner animation="border" size="sm" /> Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-1"></i>
                      Save All ({totalModified} modified)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};