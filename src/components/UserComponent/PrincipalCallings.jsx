import React, { useMemo, useContext, useState, useEffect } from "react";
import { UserContext } from "../NewContextApis/UserContext";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Form,
  Button,
  Alert,
  Table
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
import Select from 'react-select';

import { CreateCallLogs, GetCallLogsCurrentData, GetCallLeadsByUserObjectId, UpdateCallLeads } from "../../services/UserServices/UserService";
import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";

export const PrincipalCallings = () => {
  const { userData } = useContext(UserContext);

  const { districtBlockSchoolData = [], loadingDBS } =
    useDistrictBlockSchool() || {};

  const [dashboardMap, setDashboardMap] = useState({});
  const fetchDashboarcount = async () => {
    try {
      const resp = await DashboardCounts();
      const data = resp?.data ?? resp;

      const centers = data?.centers ?? [];
      const map = {};
      for (const c of centers) {
        if (c && c.centerId) {
          map[String(c.centerId)] = c.dashboardCounts ?? {};
        }
      }
      setDashboardMap(map);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboarcount();
  }, []);

  const navigate = useNavigate();

  const [groups, setGroups] = useState([]); // grouped leads
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState(new Set()); // set of _id being submitted
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // React-select options
  const CALL_STATUS = [
    { value: "Connected", label: "Connected" },
    { value: "Not connected", label: "Not connected" }
  ];

  const CALLING_REMARKS = [
    { value: "Low registration count calling", label: "Low registration count calling" },
    { value: "Daily calling", label: "Daily calling" },
    { value: "Other", label: "Other" }
  ];

  const fmt = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  };

  const isoToLocalDatetime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    const y = d.getFullYear();
    const mo = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hr = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${y}-${mo}-${day}T${hr}:${min}`;
  };

  const localDatetimeToISO = (localVal) => {
    if (!localVal) return null;
    const d = new Date(localVal);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  };

  const headerClassSnippets = (centerId) => {
    const centerStats = dashboardMap[String(centerId)];
    const byClass = (centerStats && centerStats.school && centerStats.school.byClass) ? centerStats.school.byClass : {};
    const getCount = (cls) => {
      if (!byClass) return 0;
      const v = byClass[String(cls)];
      return (v && (v.registered ?? 0)) || 0;
    };
    const sn8 = `Class 8: ${getCount(8)}`;
    const sn10 = `Class 10: ${getCount(10)}`;
    return [sn8, sn10];
  };

  const fetchCallLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const reqBody = {
        objectIdOfCaller: userData?.user?._id,
        callMadeTo: "Principal"
      };
      const response = await GetCallLeadsByUserObjectId(reqBody);
      const data = response?.data ?? [];

      const map = new Map();
      for (const item of data || []) {
        const callerId = item.callerUser && item.callerUser._id ? String(item.callerUser._id) : "nullcaller";
        const key = [
          callerId,
          item.callMadeTo ?? "",
          item.districtId ?? "",
          item.blockId ?? "",
          item.centerId ?? ""
        ].join("|");

        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
      }

      const groupsArr = [];
      for (const [key, rows] of map.entries()) {
        const sorted = rows.slice().sort((a, b) => {
          const da = a.callingDate ? new Date(a.callingDate).getTime() : 0;
          const db = b.callingDate ? new Date(b.callingDate).getTime() : 0;
          if (db !== da) return db - da;
          const ca = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const cb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return cb - ca;
        });

        const current = sorted[0];
        const history = sorted.slice(1);

        const withEdit = {
          ...current,
          _edit: {
            callingStatus: current.callingStatus ?? null,
            callingRemark1: current.callingRemark1 ?? "",
            mannualRemark: current.mannualRemark ?? "",
            callingDateLocal: isoToLocalDatetime(current.callingDate)
          }
        };

        groupsArr.push({
          key,
          current: withEdit,
          history
        });
      }

      setGroups(groupsArr);
    } catch (err) {
      console.error("Fetch leads error", err);
      setError("Failed to load call leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallLeads();
  }, []);

  const handleFieldChange = (groupKey, field, value) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.key === groupKey ? { ...g, current: { ...g.current, _edit: { ...g.current._edit, [field]: value } } } : g
      )
    );
  };

  const updateLead = async (group) => {
    setError(null);
    setSuccessMsg(null);
    const id = group.current._id;
    setSavingIds((s) => new Set(s).add(id));

    const reqBody = {
      _id: id,
      callingStatus: group.current._edit.callingStatus,
      callingRemark1: group.current._edit.callingRemark1 || null,
      mannualRemark: group.current._edit.mannualRemark || null,
      callingDate: group.current._edit.callingDateLocal
        ? localDatetimeToISO(group.current._edit.callingDateLocal)
        : null
    };

    try {
      const resp = await UpdateCallLeads(reqBody);
      const returned = resp?.data ?? resp;

      setGroups((prev) => {
        // mark current group as submitted (disable)
        const updated = prev.map((g) =>
          g.key === group.key
            ? { ...g, current: { ...returned, _edit: { ...g.current._edit }, _submitted: true } }
            : g
        );
        // sort: uncalled first, called last
        updated.sort((a, b) => {
          const as = a.current._submitted ? 1 : 0;
          const bs = b.current._submitted ? 1 : 0;
          return as - bs;
        });
        return updated;
      });

      setSuccessMsg("Call submitted successfully");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err) {
      console.error("UpdateCallLeads error", err);
      setError("Failed to submit lead");
    } finally {
      setSavingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <Container className="py-3">
      <h3 className="mb-3">Principal Callings</h3>

      {loading && (
        <div className="mb-3">
          <Spinner animation="border" size="sm" /> Loading leads...
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {!loading && groups.length === 0 && (
        <Alert variant="info">No call leads found for you.</Alert>
      )}

      <Row xs={1} md={2} lg={2} className="g-3">
        {groups.map((g) => {
          const lead = g.current;
          const edit = lead._edit || {};
          const saving = savingIds.has(lead._id);
          const submitted = lead._submitted;

          const snippets = headerClassSnippets(lead.centerId);

          return (
            <Col key={g.key}>
              <Card className={submitted ? "border-success" : ""} style={submitted ? { backgroundColor: "#d4edda" } : {}}>
                <Card.Header className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{lead.calledPerson?.centerName ?? "Unknown School"}</strong>
                    <div className="small text-muted">
                      {lead.calledPerson?.districtName} — {lead.calledPerson?.blockName}
                    </div>
                    <div className="small">Principal: {lead.calledPerson?.principal ?? "N/A"}</div>

                    {snippets.length > 0 && (
                      <div className="small text-muted mt-1">
                        {snippets.map((s, idx) => (
                          <span key={s}>
                            {s}{idx < snippets.length - 1 ? " · " : ""}
                          </span>
                        ))}
                      </div>
                    )}

                    {lead.calledPerson?.princiaplContact ? (
                      <div className="small mt-1">
                        Contact: <a href={`tel:${lead.calledPerson.princiaplContact}`}>{lead.calledPerson.princiaplContact}</a>
                      </div>
                    ) : (
                      <div className="small mt-1">Contact: N/A</div>
                    )}
                  </div>

                  <div className="text-end">
                    <Badge bg="primary" className="mb-1">{lead.callMadeTo}</Badge>
                    <div className="small text-muted">CenterId: {lead.centerId}</div>
                    <div className="small text-muted">Last: {fmt(lead.callingDate ?? lead.createdAt)}</div>
                    <div className="small text-muted">History: {g.history.length}</div>
                  </div>
                </Card.Header>

                <Card.Body>
                  <Row className="mb-2">
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="small">Status</Form.Label>
                        <Select
                          value={CALL_STATUS.find(o => o.value === edit.callingStatus) || null}
                          onChange={(sel) => handleFieldChange(g.key, "callingStatus", sel ? sel.value : null)}
                          options={CALL_STATUS}
                          placeholder="— select —"
                          isClearable
                          isDisabled={submitted}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="small">Calling Remark</Form.Label>
                        <Select
                          value={CALLING_REMARKS.find(o => o.value === edit.callingRemark1) || null}
                          onChange={(sel) => handleFieldChange(g.key, "callingRemark1", sel ? sel.value : null)}
                          options={CALLING_REMARKS}
                          placeholder="— select —"
                          isClearable
                          isDisabled={submitted}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="small">Manual Remark</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={edit.mannualRemark ?? ""}
                          onChange={(e) => handleFieldChange(g.key, "mannualRemark", e.target.value)}
                          disabled={submitted}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="small">Calling Date</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={edit.callingDateLocal ?? ""}
                          onChange={(e) => handleFieldChange(g.key, "callingDateLocal", e.target.value)}
                          disabled={submitted}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Card className="mt-3">
                    <Card.Header>
                      <strong>Calling History</strong>
                    </Card.Header>
                    <Card.Body style={{ padding: 0 }}>
                      <Table striped bordered hover size="sm" className="mb-0">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          {g.history.length === 0 && (
                            <tr>
                              <td colSpan={2} className="text-center small text-muted">No history</td>
                            </tr>
                          )}
                          {g.history.map((h) => (
                            <tr key={h._id}>
                              <td className="small">{fmt(h.callingDate ?? h.createdAt)}</td>
                              <td className="small">{h.callingRemark1 ?? "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Card.Body>

                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <div className="small text-muted">
                    Current record created: {fmt(lead.createdAt)}
                  </div>
                  {!submitted && (
                    <div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="me-2"
                        onClick={() => {
                          setGroups((prev) =>
                            prev.map((gg) =>
                              gg.key === g.key
                                ? {
                                    ...gg,
                                    current: {
                                      ...gg.current,
                                      _edit: {
                                        callingStatus: gg.current.callingStatus,
                                        callingRemark1: gg.current.callingRemark1,
                                        mannualRemark: gg.current.mannualRemark,
                                        callingDateLocal: isoToLocalDatetime(gg.current.callingDate)
                                      }
                                    }
                                  }
                                : gg
                            )
                          );
                        }}
                      >
                        Reset
                      </Button>

                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => updateLead(g)}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Spinner animation="border" size="sm" /> Submitting...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </div>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};
