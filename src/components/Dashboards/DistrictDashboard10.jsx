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
import { MainDashBoard } from "../../services/DashBoardServices/DashboardService";

export const Districtdashboard10 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);

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

  // Build district list and block aggregation using mainDashboardData
  const buildDistrictsAndBlocksFromMainData = () => {
    const result = {
      districtList: [],
    };
    if (!mainDashboardData || !Array.isArray(mainDashboardData)) return result;

    const districtsMap = {};

    for (const school of mainDashboardData) {
      const districtId = String(school?.districtId || "").trim();
      const districtName = school?.districtName || "";
      const blockId = String(school?.blockId || "").trim();
      const blockName = school?.blockName || "";
      const reg10 = Number(school?.registrationCount10 || 0);

      if (!districtId) continue;

      if (!districtsMap[districtId]) {
        districtsMap[districtId] = {
          districtId,
          districtName: districtName || districtId,
          totalRegistered: 0,
          blocks: {},
        };
      }

      districtsMap[districtId].totalRegistered += reg10;

      if (!districtsMap[districtId].blocks[blockId]) {
        districtsMap[districtId].blocks[blockId] = {
          blockId,
          blockName: blockName || blockId,
          registered: 0,
        };
      }

      districtsMap[districtId].blocks[blockId].registered += reg10;
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

  const { districtList } = buildDistrictsAndBlocksFromMainData();

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

  if (!mainDashboardData || mainDashboardData.length === 0) {
    return (
      <Container className="py-4">
        <Alert variant="info">No dashboard data available.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <h3>District - Block Dashboard (Class 10)- Level 1 Examination</h3>
      <p className="text-muted">Filter by District or Block below.</p>

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
                  {!district.blocks || district.blocks.length === 0 ? (
                    <Alert variant="light">
                      No blocks / no Class 10 registrations in this district.
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
                            <td style={{ textAlign: "right" }}>{b.registered}</td>
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

export default Districtdashboard10;