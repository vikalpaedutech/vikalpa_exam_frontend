
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../NewContextApis/UserContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { GetStudentsRegisteredByUser } from "../../services/DashBoardServices/DashboardService";
import { BulkDownloadContext } from "../ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi";
import { Level1AdmitCard } from "../StudentRegistration/Level1AdmitCard";
import { AcknowledgementSlipComponent } from "../StudentRegistration/AcknowledgementSlip";

export const RegisteredStudentsByUsers = () => {
  const { userData } = useContext(UserContext);
  const { bulkDownload, setBulkDownload } = useContext(BulkDownloadContext);
  const navigate = useNavigate();
  const location = useLocation();

  let studentClass;
  if (location.pathname === "/user-registered-students-mb") studentClass = "8";
  else if (location.pathname === "/user-registered-students-sh") studentClass = "10";

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showSingleAdmitRunner, setShowSingleAdmitRunner] = useState(null); // student obj
  const [showSingleAckRunner, setShowSingleAckRunner] = useState(null); // student obj

  // Bulk orchestration:
  // bulkMode: 'idle' | 'admit' | 'ack' | 'admit-both' | 'ack-after-admit'
  const [bulkMode, setBulkMode] = useState("idle");
  const [bulkRows, setBulkRows] = useState(null); // local copy for re-using in "both" flow
  const [showBulkRunner, setShowBulkRunner] = useState(false);
  const [rightSelectAllToggle, setRightSelectAllToggle] = useState(false);

  // NEW: Separate states for single downloads
  const [singleAdmitDownload, setSingleAdmitDownload] = useState(null);
  const [singleAckDownload, setSingleAckDownload] = useState(null);

  // fetch
  const fetchRegisteredStudentsData = async () => {
    if (!userData?.user?._id) return;
    setLoading(true);
    setError(null);
    const reqBody = { _id: userData.user._id, classOfStudent: studentClass };
    try {
      const response = await GetStudentsRegisteredByUser(reqBody);
      let payload = null;
      if (Array.isArray(response)) payload = response;
      else if (response && Array.isArray(response.data)) payload = response.data;
      else if (response && response.data && Array.isArray(response.data.data)) payload = response.data.data;
      setStudents(payload || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredStudentsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.user?._id, location.pathname]);

  const filtered = students.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(s.name || "").toLowerCase().includes(q) ||
      String(s.srn || "").toLowerCase().includes(q) ||
      String(s.mobile || "").toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
    setRightSelectAllToggle(false);
  };

  const setSelectAllVisible = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filtered.map((s) => s._id)));
      setRightSelectAllToggle(true);
    } else {
      setSelectedIds(new Set());
      setRightSelectAllToggle(false);
    }
  };

  const toggleRightHeaderSelectAll = () => {
    const shouldSelect = !rightSelectAllToggle;
    setSelectAllVisible(shouldSelect);
  };

  // per-row single downloads - UPDATED to use bulk download mechanism
  const startSingleAdmitDownload = (student) => {
    // Set single download data to trigger auto-download
    setSingleAdmitDownload([student]);
    setShowSingleAdmitRunner(true);
  };

  const startSingleAckDownload = (student) => {
    // Set single download data to trigger auto-download
    setSingleAckDownload([student]);
    setShowSingleAckRunner(true);
  };

  // Bulk actions
  const handleBulkAdmitClick = () => {
    if (selectedIds.size === 0) {
      alert("Select at least one student to bulk download.");
      return;
    }
    const rows = students.filter((s) => selectedIds.has(s._id));
    setBulkRows(rows);
    setBulkMode("admit");
    setBulkDownload(rows); // context used by Level1AdmitCard to auto-run
    setShowBulkRunner(true);
  };

  const handleBulkAckClick = () => {
    if (selectedIds.size === 0) {
      alert("Select at least one student to bulk generate acknowledgement slip.");
      return;
    }
    const rows = students.filter((s) => selectedIds.has(s._id));
    setBulkRows(rows);
    setBulkMode("ack");
    setBulkDownload(rows); // context used by AcknowledgementSlipBulk to auto-run
    setShowBulkRunner(true);
  };

  // run both: admit first then ack
  const handleBulkBothClick = () => {
    if (selectedIds.size === 0) {
      alert("Select at least one student to bulk download both files.");
      return;
    }
    const rows = students.filter((s) => selectedIds.has(s._id));
    setBulkRows(rows);
    setBulkMode("admit-both");
    setBulkDownload(rows); // Level1AdmitCard will run first
    setShowBulkRunner(true);
  };

  // called when Level1AdmitCard finishes (onDone) in bulk flows
  const onAdmitBulkDone = () => {
    if (bulkMode === "admit-both") {
      // now run ack: re-inject rows into context and render ack runner
      setBulkMode("ack-after-admit");
      // re-inject
      setBulkDownload(bulkRows);
      // render will switch to AcknowledgementSlipBulk (see render below)
    } else {
      // normal admit-only finish
      setBulkMode("idle");
      setShowBulkRunner(false);
      setSelectedIds(new Set());
      setBulkRows(null);
      setBulkDownload(null);
      setRightSelectAllToggle(false);
    }
  };

  const onAckBulkDone = () => {
    // after ack run (either ack-only or ack-after-admit)
    setBulkMode("idle");
    setShowBulkRunner(false);
    setSelectedIds(new Set());
    setBulkRows(null);
    setBulkDownload(null);
    setRightSelectAllToggle(false);
  };

  const clearBulk = () => {
    setBulkRows(null);
    setBulkMode("idle");
    setShowBulkRunner(false);
    setBulkDownload(null);
    setSelectedIds(new Set());
    setRightSelectAllToggle(false);
    alert("Bulk queue cleared.");
  };

  return (
    <Container fluid className="py-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h4 style={{ margin: 0 }}>{studentClass ? `Class ${studentClass} Data` : "Registered Students"}</h4>
          <small className="text-muted">List of registered students you created</small>
        </Col>

        {/* Top controls: Refresh + Bulk Downloads */}
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={fetchRegisteredStudentsData}>Refresh</Button>

          {/* <Button
            variant="success"
            size="sm"
            onClick={handleBulkAdmitClick}
            disabled={selectedIds.size === 0}
            title="Download selected students' admit cards as ZIP"
          >
            {selectedIds.size === 0 ? "Bulk Admit" : `Bulk Admit (${selectedIds.size})`}
          </Button> */}

          <Button
            variant="info"
            size="sm"
            onClick={handleBulkAckClick}
            disabled={selectedIds.size === 0}
            title="Download selected students' acknowledgement slips as ZIP"
          >
            {selectedIds.size === 0 ? "Bulk Ack" : `Bulk Ack (${selectedIds.size})`}
          </Button>

          {/* <Button
            variant="primary"
            size="sm"
            onClick={handleBulkBothClick}
            disabled={selectedIds.size === 0}
            title="Generate admit cards and acknowledgement slips (both) as ZIPs sequentially"
          >
            {selectedIds.size === 0 ? "Bulk Both" : `Bulk Both (${selectedIds.size})`}
          </Button> */}

          <Button variant="outline-danger" size="sm" onClick={clearBulk}>Clear Bulk</Button>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-2 align-items-center">
            <Col md={6}>
              <InputGroup>
                <Form.Control placeholder="Search by name, SRN or mobile..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button variant="outline-secondary" onClick={() => setSearch("")}>Clear</Button>
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="primary" pill style={{ fontSize: 14 }}>Total: {students.length}</Badge>{" "}
              {/* <Badge bg="success" pill style={{ fontSize: 14 }}>Showing: {filtered.length}</Badge> */}
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer />
      </Card>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : error ? (
        <Card className="mb-3"><Card.Body><p className="text-danger">Error: {error}</p></Card.Body></Card>
      ) : filtered.length === 0 ? (
        <Card className="mb-3"><Card.Body><p className="mb-0">No registered students found.</p></Card.Body></Card>
      ) : (
        <Card>
          <Card.Body style={{ overflowX: "auto" }}>
            <Table striped bordered hover responsive className="align-middle">
              <thead>
                <tr>
                  <th style={{ width: 40, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      onChange={(e) => setSelectAllVisible(e.target.checked)}
                      checked={filtered.length > 0 && selectedIds.size === filtered.length}
                      title="Select / deselect all visible"
                    />
                  </th>
                  <th style={{ width: 40 }}>#</th>
                  <th style={{ minWidth: 140 }}>SRN</th>
                  <th style={{ minWidth: 220 }}>Name</th>
                  <th style={{ minWidth: 160 }}>Father</th>
                  <th style={{ width: 110 }}>DOB</th>
                  <th style={{ width: 120 }}>Mobile</th>
                  <th style={{ minWidth: 220 }}>School</th>
                  <th style={{ width: 90 }}>Verified</th>
                  <th style={{ width: 100 }}>Photo</th>
                  {/* <th style={{ width: 150 }}>Admit Card</th> */}
                  <th style={{ width: 160 }}>Acknowledgement Slip</th>
                  <th style={{ width: 90, textAlign: "center" }}>
                    <Button size="sm" variant="outline-primary" onClick={toggleRightHeaderSelectAll}>
                      {rightSelectAllToggle || (filtered.length > 0 && selectedIds.size === filtered.length) ? "Deselect" : "Select All"}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={s._id || idx}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(s._id)}
                        onChange={() => toggleSelect(s._id)}
                        title="Select student"
                      />
                    </td>

                    <td>{idx + 1}</td>
                    <td>{s.srn ?? "-"}</td>
                    <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{s.name ?? "-"}</td>
                    <td>{s.father ?? "-"}</td>
                    <td>{s.dob ? new Date(s.dob).toLocaleDateString() : "-"}</td>
                    <td>{s.mobile ?? "-"}</td>
                    <td style={{ maxWidth: 220, whiteSpace: "normal", wordBreak: "break-word" }}>{s.school ?? "-"}</td>
                    <td>{s.isVerified ?? s.ui_isVerified ?? "-"}</td>
                    <td>
                      {s.imageUrl ? (
                        <img src={s.imageUrl} alt={s.name || "photo"} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} />
                      ) : (s.image ? <span>{s.image}</span> : "-")}
                    </td>

                    {/* <td>
                      <Button size="sm" variant="primary" onClick={() => startSingleAdmitDownload(s)}>Download Admit Card</Button>
                    </td> */}

                    <td>
                      <Button size="sm" variant="info" onClick={() => startSingleAckDownload(s)}>Download Acknowledgement</Button>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(s._id)}
                        onChange={() => toggleSelect(s._id)}
                        title="Select student (right)"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* ---------- Bulk runner area (admit / ack / both) ---------- */}
      {showBulkRunner && bulkMode !== "idle" && (
        <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
          <Card className="p-2 shadow">
            <div style={{ minWidth: 360 }}>
              <div>
                <strong>{(bulkRows && bulkRows.length) || (bulkDownload && bulkDownload.length) || 0}</strong>
                {" "}students queued — running <strong>{bulkMode === "admit" ? "Admit" : bulkMode === "ack" ? "Acknowledgement" : bulkMode === "admit-both" ? "Admit → Ack (both)" : bulkMode === "ack-after-admit" ? "Acknowledgement (second pass)" : bulkMode}</strong>
              </div>
              <div className="mt-2">
                {/* Render Level1AdmitCard when bulkMode is admit OR when starting admit-both */}
                {(bulkMode === "admit" || bulkMode === "admit-both") && (
                  <Level1AdmitCard
                    // Level1AdmitCard auto-runs on mount when bulkDownload context is present
                    onDone={() => {
                      // Level1AdmitCard clears bulkDownload on its own — we orchestrate next step
                      onAdmitBulkDone();
                    }}
                  />
                )}

                {/* Render acknowledgement runner when bulkMode is ack OR ack-after-admit */}
                {(bulkMode === "ack" || bulkMode === "ack-after-admit") && (
                  <AcknowledgementSlipComponent
                    onDone={() => {
                      onAckBulkDone();
                    }}
                  />
                )}
              </div>

              <div className="d-flex gap-2 mt-2">
                <Button size="sm" variant="outline-secondary" onClick={() => { setShowBulkRunner(false); }}>
                  Hide
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => { clearBulk(); setShowBulkRunner(false); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ---------- Single-runner area (hidden but functional) ---------- */}
      {/* Single Admit Card Runner - Hidden but functional */}
      {showSingleAdmitRunner && (
        <div style={{ position: "absolute", left: -9999, opacity: 0 }}>
          <Level1AdmitCard
            bulkDownload={singleAdmitDownload}
            onDone={() => {
              setShowSingleAdmitRunner(false);
              setSingleAdmitDownload(null);
            }}
          />
        </div>
      )}

      {/* Single Acknowledgement Runner - Hidden but functional */}
      {showSingleAckRunner && (
        <div style={{ position: "absolute", left: -9999, opacity: 0 }}>
          <AcknowledgementSlipComponent
            bulkDownload={singleAckDownload}
            onDone={() => {
              setShowSingleAckRunner(false);
              setSingleAckDownload(null);
            }}
          />
        </div>
      )}
    </Container>
  );
};