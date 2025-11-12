// src/components/Dashboards/DistrictDashboard.jsx
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

export const Districtdashboard8 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);

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

  // Build district list and block aggregation using centers array directly
  const buildDistrictsAndBlocksFromCenters = () => {
    const result = {
      districtList: [],
    };
    if (!dashboard?.centers || !Array.isArray(dashboard.centers)) return result;

    const centers = dashboard.centers;
    const districtsMap = {};

    for (const c of centers) {
      const districtId = String(c?.districtId || "").trim();
      const districtName =
        c?.districtName ||
        (c?.dashboardCounts?.school?.meta?.districtName || "") ||
        "";
      const blockId = String(c?.blockId || "").trim();
      const blockName = c?.blockName || "";
      const centerSchoolCounts = c?.dashboardCounts?.school || {};
      const reg8 = getSchoolClass8Registered(centerSchoolCounts);

      if (!districtId) continue;

      if (!districtsMap[districtId]) {
        districtsMap[districtId] = {
          districtId,
          districtName: districtName || districtId,
          totalRegistered: 0,
          blocks: {},
        };
      }

      districtsMap[districtId].totalRegistered += reg8;

      if (!districtsMap[districtId].blocks[blockId]) {
        districtsMap[districtId].blocks[blockId] = {
          blockId,
          blockName: blockName || blockId,
          registered: 0,
        };
      }

      districtsMap[districtId].blocks[blockId].registered += reg8;
    }

    const districtList = Object.values(districtsMap);

    districtList.sort(
      (a, b) =>
        b.totalRegistered - a.totalRegistered ||
        a.districtName.localeCompare(b.districtName)
    );

    for (const d of districtList) {
      const blocksArr = Object.values(d.blocks).sort((x, y) => {
        if (y.registered !== x.registered) return y.registered - x.registered;
        return (x.blockName || "").localeCompare(y.blockName || "");
      });
      d.blocks = blocksArr;
    }

    return { districtList };
  };

  const { districtList } = buildDistrictsAndBlocksFromCenters();

  // Build dependent dropdown options
  const districtOptions = useMemo(
    () =>
      districtList.map((d) => ({
        value: d.districtId,
        label: d.districtName,
      })),
    [districtList]
  );

  const blockOptions = useMemo(() => {
    if (!selectedDistrict) return [];
    const district = districtList.find(
      (d) => d.districtId === selectedDistrict.value
    );
    if (!district) return [];
    return district.blocks.map((b) => ({
      value: b.blockId,
      label: b.blockName,
    }));
  }, [selectedDistrict, districtList]);

  // Filtered list based on selected district/block
  const filteredDistricts = useMemo(() => {
    if (!selectedDistrict) return districtList;

    const district = districtList.find(
      (d) => d.districtId === selectedDistrict.value
    );
    if (!district) return [];

    if (selectedBlock) {
      const filteredBlocks = district.blocks.filter(
        (b) => b.blockId === selectedBlock.value
      );
      return [{ ...district, blocks: filteredBlocks }];
    }

    return [district];
  }, [districtList, selectedDistrict, selectedBlock]);

  const defaultActiveKeys = filteredDistricts.map((_, i) => String(i));

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
      <h3>District & Block Dashboard (Class 8)- Level 1 Examination</h3>
      <p className="text-muted">
        Filter by District or Block below.
      </p>

      {/* Filter section */}
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <Select
            options={districtOptions}
            value={selectedDistrict}
            onChange={(val) => {
              setSelectedDistrict(val);
              setSelectedBlock(null);
            }}
            placeholder="Select District..."
            isClearable
          />
        </Col>
        <Col md={6} lg={4}>
          <Select
            options={blockOptions}
            value={selectedBlock}
            onChange={setSelectedBlock}
            placeholder="Select Block..."
            isClearable
            isDisabled={!selectedDistrict}
          />
        </Col>
      </Row>
<hr></hr>
      {filteredDistricts.length === 0 ? (
        <Alert variant="info">
          No data found for selected filters (district/block).
        </Alert>
      ) : (
        <Accordion defaultActiveKey={defaultActiveKeys} alwaysOpen>
          {filteredDistricts.map((district, idx) => (
            <Card key={district.districtId}>
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
                      <strong>
                        {district.districtName ||
                          `District ${district.districtId}`}:-
                      </strong>

                          <div>
                        <strong style={{ fontSize: "1.05rem" }}>
                          {district.totalRegistered}
                        </strong>
                      
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
                  </div>
                </Accordion.Header>

                <Accordion.Body>
                  {!district.blocks || district.blocks.length === 0 ? (
                    <Alert variant="light">
                      No blocks / no Class 8 registrations in this district.
                    </Alert>
                  ) : (
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th style={{ width: "5%" }}>S.No</th>
                          <th>Block Name</th>
                          <th style={{ width: "20%", textAlign: "right" }}>
                            Registered
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {district.blocks.map((b, i) => (
                          <tr key={b.blockId || i}>
                            <td>{i + 1}</td>
                            <td>{b.blockName || `Block ${b.blockId}`}</td>
                            <td style={{ textAlign: "right" }}>
                              {b.registered}
                            </td>
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

