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
import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

export const BlockSchoolDashboard8 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

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

  // Build block list and schools aggregation using mainDashboardData
  const buildBlocksAndSchoolsFromMainData = () => {
    const result = {
      blockList: [],
    };
    if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

    const blocksMap = {};

    for (const school of mainDashboardData) {
      const blockId = String(school?.blockId || "").trim();
      const blockName = school?.blockName || "";
      const schoolId = String(school?.centerId || "").trim();
      const schoolName = school?.centerName || "";
      const reg8 = Number(school?.registrationCount8 || 0);

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

      if (!blocksMap[blockId].schools[schoolId]) {
        blocksMap[blockId].schools[schoolId] = {
          schoolId: schoolId,
          schoolName: schoolName || `School ${schoolId}`,
          registered: 0,
        };
      }

      blocksMap[blockId].schools[schoolId].registered += reg8;
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

  const { blockList } = buildBlocksAndSchoolsFromMainData();

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

  if (!mainDashboardData || mainDashboardData.length === 0) {
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