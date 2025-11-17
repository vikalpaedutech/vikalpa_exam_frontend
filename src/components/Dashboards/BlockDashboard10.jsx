// src/components/Dashboards/BlockSchoolDashboard10.jsx
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
  Button,
} from "react-bootstrap";
import Select from "react-select";
import { DashboardCounts } from "../../services/DashBoardServices/DashboardService"; // adjust path if needed
import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

export const BlockSchoolDashboard10 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [activeKeys, setActiveKeys] = useState([]); // control accordion open/close

  const [mainDashboardData, setMainDashboardData] = useState([]);

  const fetchMainDashboardCount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await MainDashBoard();
      setMainDashboardData(response.data);
    } catch (error) {
      console.error("Error", error);
      setError(error?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMainDashboardCount();
  }, []);

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

  // Build block list and school aggregation using mainDashboardData
  const buildBlocksAndSchoolsFromMainData = () => {
    const result = { blockList: [] };
    if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

    const blocksMap = {};

    for (const school of mainDashboardData) {
      const blockId = String(school?.blockId || "").trim();
      const blockName = school?.blockName || "";
      const schoolId = String(school?.centerId || "").trim();
      const schoolName = school?.centerName || "";
      const reg10 = Number(school?.registrationCount10 || 0);

      if (!blockId) continue;
      if (!blocksMap[blockId]) {
        blocksMap[blockId] = {
          blockId,
          blockName: blockName || blockId,
          totalRegistered: 0,
          schools: {},
        };
      }

      blocksMap[blockId].totalRegistered += reg10;

      if (!blocksMap[blockId].schools[schoolId]) {
        blocksMap[blockId].schools[schoolId] = {
          schoolId: schoolId,
          schoolName: schoolName || `School ${schoolId}`,
          registered: 0,
        };
      }

      blocksMap[blockId].schools[schoolId].registered += reg10;
    }

    const blockList = Object.values(blocksMap).sort(
      (a, b) =>
        b.totalRegistered - a.totalRegistered ||
        (a.blockName || "").localeCompare(b.blockName || "")
    );

    for (const blk of blockList) {
      blk.schools = Object.values(blk.schools).sort(
        (a, b) =>
          b.registered - a.registered ||
          (a.schoolName || "").localeCompare(b.schoolName || "")
      );
    }

    return { blockList };
  };

  const { blockList } = buildBlocksAndSchoolsFromMainData();

  // total registrations (class 10)
  const totalRegistrations = useMemo(
    () => blockList.reduce((sum, b) => sum + (b.totalRegistered || 0), 0),
    [blockList]
  );

  // Dropdown options
  const blockOptions = useMemo(
    () =>
      blockList.map((b) => ({
        value: b.blockId,
        label: b.blockName,
      })),
    [blockList]
  );

  const schoolOptions = useMemo(() => {
    if (!selectedBlock) return [];
    const block = blockList.find((b) => b.blockId === selectedBlock.value);
    if (!block) return [];
    return block.schools.map((s) => ({
      value: s.schoolId,
      label: s.schoolName,
    }));
  }, [selectedBlock, blockList]);

  // Filtered data for UI
  const filteredBlocks = useMemo(() => {
    if (!selectedBlock) return blockList;
    const block = blockList.find((b) => b.blockId === selectedBlock.value);
    if (!block) return [];

    if (selectedSchool) {
      const filteredSchools = block.schools.filter(
        (s) => s.schoolId === selectedSchool.value
      );
      return [{ ...block, schools: filteredSchools, totalRegistered: filteredSchools.reduce((s, x) => s + (x.registered || 0), 0) }];
    }

    return [block];
  }, [blockList, selectedBlock, selectedSchool]);

  // ensure accordion active keys match filteredBlocks
  useEffect(() => {
    setActiveKeys(filteredBlocks.map((_, i) => String(i)));
  }, [filteredBlocks]);

  const toggleAccordion = () => {
    if (activeKeys.length) {
      setActiveKeys([]);
    } else {
      setActiveKeys(filteredBlocks.map((_, i) => String(i)));
    }
  };

  if (loading)
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
        <div>Loading dashboard...</div>
      </Container>
    );

  if (error)
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!mainDashboardData || mainDashboardData.length === 0)
    return (
      <Container className="py-4">
        <Alert variant="info">No dashboard data available.</Alert>
      </Container>
    );

  return (
    <Container className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Block - School Dashboard (Class 10)- Level 1 Examination</h3>
       
      </div>

      {/* Summary */}
      {/* <Card className="mb-4 shadow-sm">
        <Card.Body className="text-center">
          <h5 className="mb-0">
            Total Registrations (Class 10):{" "}
            <Badge bg="success" pill>
              {totalRegistrations}
            </Badge>
          </h5>
        </Card.Body>
      </Card> */}

      {/* Filters */}
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
        <Accordion activeKey={activeKeys} alwaysOpen>
          {filteredBlocks.map((block, idx) => (
            <Accordion.Item eventKey={String(idx)} key={block.blockId}>
              <Accordion.Header>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <Badge bg="secondary">{idx + 1}</Badge>
                    <strong>{block.blockName}:-</strong>



                        <div>
                    <strong style={{ fontSize: "1.05rem" }}>
                      {block.totalRegistered}
                    </strong>{" "}
             
                  </div>
                  </div>
              
                </div>
              </Accordion.Header>
              <Accordion.Body>
                {block.schools?.length ? (
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
                          <td>{s.schoolName}</td>
                          <td style={{ textAlign: "right" }}>{s.registered}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="light" className="mb-0">
                    No schools / no Class 10 registrations in this block.
                  </Alert>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};