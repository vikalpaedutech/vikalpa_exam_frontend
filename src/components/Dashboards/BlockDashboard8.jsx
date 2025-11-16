// src/components/Dashboards/BlockSchoolDashboard8.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Accordion,
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Select from "react-select";
import { DashboardCounts } from "../../services/DashBoardServices/DashboardService"; // adjust path if needed

export const BlockSchoolDashboard8 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const fetchDashboarcount = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await DashboardCounts();
      const data = resp?.data || resp;
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err?.message || "Failed to fetch dashboard counts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboarcount();
  }, []);

  // safe getter for class 8 registered from a center's school counts
  const getSchoolClass8Registered = (schoolCounts) => {
    try {
      if (!schoolCounts) return 0;
      const byClass = schoolCounts.byClass || {};
      const cls = byClass["8"] || byClass[8] || null;
      if (!cls) return 0;
      return Number(cls.registered || 0);
    } catch {
      return 0;
    }
  };

  // Build block list and schools aggregation using centers array directly
  const buildBlocksAndSchoolsFromCenters = () => {
    const result = {
      blockList: [],
    };
    if (!dashboard?.centers || !Array.isArray(dashboard.centers)) return result;

    const centers = dashboard.centers;
    const blocksMap = {};

    for (const c of centers) {
      const blockId = String(c?.blockId || c?.block_id || "").trim();
      const blockName =
        c?.blockName ||
        c?.block_name ||
        (c?.dashboardCounts?.school?.meta?.blockName || "") ||
        "";
      // Try to find school id/name from obvious places
      const schoolId =
        String(
          c?.schoolCode ||
            c?.schoolId ||
            c?.school_id ||
            c?.dashboardCounts?.school?.meta?.schoolCode ||
            c?.dashboardCounts?.school?.meta?.schoolId ||
            ""
        ).trim();
      const schoolName =
        c?.schoolName ||
        c?.school_name ||
        c?.dashboardCounts?.school?.meta?.schoolName ||
        c?.dashboardCounts?.school?.meta?.school_name ||
        "";

      const centerSchoolCounts = c?.dashboardCounts?.school || {};
      const reg8 = getSchoolClass8Registered(centerSchoolCounts);

      if (!blockId) continue;

      if (!blocksMap[blockId]) {
        blocksMap[blockId] = {
          blockId,
          blockName: blockName || blockId,
          totalRegistered: 0,
          schools: {},
        };
      }

      blocksMap[blockId].totalRegistered += reg8;

      // if no schoolId available, create a synthetic id to keep rows distinct
      const effectiveSchoolId = schoolId || `unknown-${Math.random().toString(36).slice(2, 8)}`;

      if (!blocksMap[blockId].schools[effectiveSchoolId]) {
        blocksMap[blockId].schools[effectiveSchoolId] = {
          schoolId: effectiveSchoolId,
          schoolName: schoolName || (c?.schoolName || `School ${effectiveSchoolId}`),
          registered: 0,
        };
      }

      blocksMap[blockId].schools[effectiveSchoolId].registered += reg8;
    }

    const blockList = Object.values(blocksMap);

    // sort blocks by totalRegistered desc, then name
    blockList.sort(
      (a, b) =>
        b.totalRegistered - a.totalRegistered ||
        (a.blockName || "").localeCompare(b.blockName || "")
    );

    // convert schools map to sorted array inside each block
    for (const blk of blockList) {
      const schoolsArr = Object.values(blk.schools).sort((x, y) => {
        if (y.registered !== x.registered) return y.registered - x.registered;
        return (x.schoolName || "").localeCompare(y.schoolName || "");
      });
      blk.schools = schoolsArr;
    }

    return { blockList };
  };

  const { blockList } = buildBlocksAndSchoolsFromCenters();

  // Build dependent dropdown options
  const blockOptions = useMemo(
    () =>
      blockList.map((d) => ({
        value: d.blockId,
        label: d.blockName,
      })),
    [blockList]
  );

  const schoolOptions = useMemo(() => {
    if (!selectedBlock) return [];
    const block = blockList.find((d) => d.blockId === selectedBlock.value);
    if (!block) return [];
    return block.schools.map((s) => ({
      value: s.schoolId,
      label: s.schoolName,
    }));
  }, [selectedBlock, blockList]);

  // Filtered list based on selected block/school
  const filteredBlocks = useMemo(() => {
    if (!selectedBlock) return blockList;

    const block = blockList.find((d) => d.blockId === selectedBlock.value);
    if (!block) return [];

    if (selectedSchool) {
      const filteredSchools = block.schools.filter(
        (s) => s.schoolId === selectedSchool.value
      );
      return [{ ...block, schools: filteredSchools }];
    }

    return [block];
  }, [blockList, selectedBlock, selectedSchool]);

  const defaultActiveKeys = filteredBlocks.map((_, i) => String(i));

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status" />
        <div className="mt-2">Loading dashboard...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <strong>Error:</strong> {error}
        </Alert>
      </Container>
    );
  }

  if (!dashboard) {
    return (
      <Container className="py-4">
        <Alert variant="info">No dashboard data available.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <h3>Block-School Dashboard (Class 8)- Level 1 Examination</h3>
      <p className="text-muted">Filter by Block or School below.</p>


      {/* Filter section */}
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <Select
            options={blockOptions}
            value={selectedBlock}
            onChange={(val) => {
              setSelectedBlock(val);
              setSelectedSchool(null);
            }}
            placeholder="Select Block..."
            isClearable
          />
        </Col>
        {/* <Col md={6} lg={4}>
          <Select
            options={schoolOptions}
            value={selectedSchool}
            onChange={setSelectedSchool}
            placeholder="Select School..."
            isClearable
            isDisabled={!selectedBlock}
          />
        </Col> */}
      </Row>
<hr></hr>
      {filteredBlocks.length === 0 ? (
        <Alert variant="info">No data found for selected filters (block/school).</Alert>
      ) : (
        <Accordion defaultActiveKey={defaultActiveKeys} alwaysOpen>
          {filteredBlocks.map((block, idx) => (
            <Card key={block.blockId}>
              <Accordion.Item eventKey={String(idx)}>
                <Accordion.Header>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <Badge bg="secondary">{idx + 1}</Badge>
                      <strong>{block.blockName || `Block ${block.blockId}`}:-</strong>



                         <div>
                        <strong style={{ fontSize: "1.05rem" }}>
                          {block.totalRegistered}
                        </strong>
                    
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                   
                    </div>
                  </div>
                </Accordion.Header>

                <Accordion.Body>
                  {!block.schools || block.schools.length === 0 ? (
                    <Alert variant="light">
                      No schools / no Class 8 registrations in this block.
                    </Alert>
                  ) : (
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th style={{ width: "5%" }}>S.No</th>
                          <th>School Name</th>
                          <th style={{ width: "20%", textAlign: "right" }}>
                            Registered
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {block.schools.map((s, i) => (
                          <tr key={s.schoolId || i}>
                            <td>{i + 1}</td>
                            <td>{s.schoolName || `School ${s.schoolId}`}</td>
                            <td style={{ textAlign: "right" }}>{s.registered}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          ))}
        </Accordion>
      )}
    </Container>
  );
};
