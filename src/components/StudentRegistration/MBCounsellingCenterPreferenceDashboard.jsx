import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
import { getCenterPreferenceDashboard } from "../../services/StudentRegistrationServices/StudentRegistrationService";
import MBCenters from "../StudentRegistration/MBCenters.json";

export const CenterPreferenceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [centersData, setCentersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [summary, setSummary] = useState({
    totalCenters: 0,
    totalCp1: 0,
    totalCp2: 0,
    totalPreferences: 0
  });

  const STATIC_CENTERS_DATA = MBCenters;

  // Process the dashboard data and merge with center info
  const processDashboardData = (dashboardData) => {
    console.log("Dashboard data:", dashboardData);
    console.log("Static centers data:", STATIC_CENTERS_DATA);

    // Create a map for quick lookup of CP1 and CP2 counts
    const cp1CountMap = new Map();
    const cp2CountMap = new Map();

    // Process CP1 data
    if (dashboardData.preference1 && Array.isArray(dashboardData.preference1)) {
      dashboardData.preference1.forEach(item => {
        if (item._id && item._id.center && item._id.status) {
          const centerName = item._id.center;
          const count = item.count;
          
          if (!cp1CountMap.has(centerName)) {
            cp1CountMap.set(centerName, { selected: 0, waiting: 0, total: 0 });
          }
          
          const current = cp1CountMap.get(centerName);
          if (item._id.status === "Selected") {
            current.selected += count;
          } else if (item._id.status === "Waiting") {
            current.waiting += count;
          }
          current.total += count;
          cp1CountMap.set(centerName, current);
        }
      });
    }

    // Process CP2 data
    if (dashboardData.preference2 && Array.isArray(dashboardData.preference2)) {
      dashboardData.preference2.forEach(item => {
        if (item._id && item._id.center && item._id.status) {
          const centerName = item._id.center;
          const count = item.count;
          
          if (!cp2CountMap.has(centerName)) {
            cp2CountMap.set(centerName, { selected: 0, waiting: 0, total: 0 });
          }
          
          const current = cp2CountMap.get(centerName);
          if (item._id.status === "Selected") {
            current.selected += count;
          } else if (item._id.status === "Waiting") {
            current.waiting += count;
          }
          current.total += count;
          cp2CountMap.set(centerName, current);
        }
      });
    }

    // Merge with static centers data
    const mergedData = STATIC_CENTERS_DATA.map(center => {
      const centerName = center.centerName;
      const cp1Data = cp1CountMap.get(centerName) || { selected: 0, waiting: 0, total: 0 };
      const cp2Data = cp2CountMap.get(centerName) || { selected: 0, waiting: 0, total: 0 };
      
      return {
        ...center,
        cp1Selected: cp1Data.selected || 0,
        cp1Waiting: cp1Data.waiting || 0,
        cp1Total: cp1Data.total || 0,
        cp2Selected: cp2Data.selected || 0,
        cp2Waiting: cp2Data.waiting || 0,
        cp2Total: cp2Data.total || 0,
        totalPreferences: (cp1Data.total || 0) + (cp2Data.total || 0)
      };
    });

    // Calculate summary
    const totalCenters = mergedData.length;
    const totalCp1 = mergedData.reduce((sum, center) => sum + center.cp1Total, 0);
    const totalCp2 = mergedData.reduce((sum, center) => sum + center.cp2Total, 0);
    const totalPreferences = totalCp1 + totalCp2;

    setSummary({
      totalCenters,
      totalCp1,
      totalCp2,
      totalPreferences
    });

    // Extract unique districts and blocks for filters
    const uniqueDistricts = [...new Map(mergedData.map(center => [center.districtId, center.districtName])).entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    setDistricts(uniqueDistricts);
    setCentersData(mergedData);
    setFilteredData(mergedData);
  };

  const fetchCenterPreferenceDash = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCenterPreferenceDashboard();
      console.log("API Response:", response);
      
      if (response && response.success && response.data) {
        processDashboardData(response.data);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Error fetching dashboard data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenterPreferenceDash();
  }, []);

  // Handle district filter change
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedBlock(""); // Reset block when district changes
    
    if (districtId === "") {
      setFilteredData(centersData);
      // Update blocks list
      const uniqueBlocks = [...new Map(centersData.map(center => [center.blockId, center.blockName])).entries()]
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setBlocks(uniqueBlocks);
    } else {
      const filtered = centersData.filter(center => center.districtId === districtId);
      setFilteredData(filtered);
      
      // Update blocks list based on selected district
      const uniqueBlocks = [...new Map(filtered.map(center => [center.blockId, center.blockName])).entries()]
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setBlocks(uniqueBlocks);
    }
  };

  // Handle block filter change
  const handleBlockChange = (e) => {
    const blockId = e.target.value;
    setSelectedBlock(blockId);
    
    if (blockId === "") {
      if (selectedDistrict === "") {
        setFilteredData(centersData);
      } else {
        const filtered = centersData.filter(center => center.districtId === selectedDistrict);
        setFilteredData(filtered);
      }
    } else {
      let filtered = centersData.filter(center => center.blockId === blockId);
      if (selectedDistrict !== "") {
        filtered = filtered.filter(center => center.districtId === selectedDistrict);
      }
      setFilteredData(filtered);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedDistrict("");
    setSelectedBlock("");
    setFilteredData(centersData);
    // Reset blocks to all blocks
    const uniqueBlocks = [...new Map(centersData.map(center => [center.blockId, center.blockName])).entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    setBlocks(uniqueBlocks);
  };

  // Get badge for count display
  const getCountBadge = (count, type) => {
    if (count === 0) return <Badge bg="secondary">0</Badge>;
    if (type === "cp1") return <Badge bg="primary">{count}</Badge>;
    if (type === "cp2") return <Badge bg="success">{count}</Badge>;
    return <Badge bg="info">{count}</Badge>;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchCenterPreferenceDash}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">

        <Row className="mb-4">
  <Col>
    <div className="d-flex flex-wrap gap-3 align-items-center">
      <a 
        href="https://registration.buniyaadhry.com/mb-counselling-attendance" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
        style={{ color: '#0d6efd', fontWeight: '500' }}
      >
        <i className="bi bi-calendar-check me-1"></i>
        Attendance
      </a>
      
      <span className="text-muted">|</span>
      
      <a 
        href="https://registration.buniyaadhry.com/mb-center-allocation-counselling" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
        style={{ color: '#0d6efd', fontWeight: '500' }}
      >
        <i className="bi bi-building me-1"></i>
        Center Allocation & Distance
      </a>
      
      <span className="text-muted">|</span>
      
      <a 
        href="https://registration.buniyaadhry.com/mb-doc-verfication-counselling" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
        style={{ color: '#0d6efd', fontWeight: '500' }}
      >
        <i className="bi bi-file-earmark-check me-1"></i>
        Doc Verification
      </a>
      
      <span className="text-muted">|</span>
      
      <a 
        href="https://registration.buniyaadhry.com/mb-provisional-selected-counselling" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
        style={{ color: '#0d6efd', fontWeight: '500' }}
      >
        <i className="bi bi-person-check me-1"></i>
        Admission Status
      </a>
      
      <span className="text-muted">|</span>
      
      <a 
        href="https://registration.buniyaadhry.com/center-preference-dashboard" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
        style={{ color: '#0d6efd', fontWeight: '500' }}
      >
        <i className="bi bi-speedometer2 me-1"></i>
        All Dashboard
      </a>
      
      <span className="text-muted">|</span>
      
      <a 
        href="https://registration.buniyaadhry.com/mb-l3-attendance-pdf" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
        style={{ color: '#0d6efd', fontWeight: '500' }}
      >
        <i className="bi bi-file-pdf me-1"></i>
        Attendance Pdf
      </a>
    </div>
  </Col>
</Row>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">
            <i className="bi bi-bar-chart-steps me-2"></i>
            Center Preference Dashboard
          </h2>
          <p className="text-muted">
            Track center preferences (CP1 and CP2) across all districts and blocks
          </p>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <i className="bi bi-building fs-1 text-primary"></i>
              <h3 className="mt-2">{summary.totalCenters}</h3>
              <p className="text-muted mb-0">Total Centers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <i className="bi bi-check-circle fs-1 text-primary"></i>
              <h3 className="mt-2">{summary.totalCp1}</h3>
              <p className="text-muted mb-0">Total CP1 Preferences</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <i className="bi bi-star fs-1 text-success"></i>
              <h3 className="mt-2">{summary.totalCp2}</h3>
              <p className="text-muted mb-0">Total CP2 Preferences</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <i className="bi bi-pie-chart fs-1 text-info"></i>
              <h3 className="mt-2">{summary.totalPreferences}</h3>
              <p className="text-muted mb-0">Total Preferences</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={5}>
              <Form.Group>
                <Form.Label>
                  <i className="bi bi-geo-alt me-1"></i> District
                </Form.Label>
                <Form.Select value={selectedDistrict} onChange={handleDistrictChange}>
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>
                  <i className="bi bi-grid me-1"></i> Block
                </Form.Label>
                <Form.Select value={selectedBlock} onChange={handleBlockChange}>
                  <option value="">All Blocks</option>
                  {blocks.map(block => (
                    <option key={block.id} value={block.id}>
                      {block.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={handleResetFilters} className="w-100">
                <i className="bi bi-arrow-repeat me-1"></i> Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Centers Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-table me-2"></i>
              Center-wise Preference Details
            </h5>
            <Badge bg="info">
              {filteredData.length} Centers Found
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
              <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <tr>
                  <th>#</th>
                  <th>District</th>
                  <th>Block</th>
                  <th>Center Name</th>
                  <th>Center ID</th>
                  <th colSpan="2" className="text-center">CP1 Count</th>
                  <th colSpan="2" className="text-center">CP2 Count</th>
                  <th>Total</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th className="text-center" style={{ background: '#5a67d8' }}>Selected</th>
                  <th className="text-center" style={{ background: '#5a67d8' }}>Waiting</th>
                  <th className="text-center" style={{ background: '#38a169' }}>Selected</th>
                  <th className="text-center" style={{ background: '#38a169' }}>Waiting</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((center, index) => (
                    <tr key={center._id}>
                      <td>{index + 1}</td>
                      <td>{center.districtName}</td>
                      <td>{center.blockName}</td>
                      <td className="fw-bold">{center.centerName}</td>
                      <td>{center.centerId}</td>
                      <td className="text-center">
                        {getCountBadge(center.cp1Selected, "cp1")}
                      </td>
                      <td className="text-center">
                        <Badge bg="warning" text="dark">{center.cp1Waiting}</Badge>
                      </td>
                      <td className="text-center">
                        {getCountBadge(center.cp2Selected, "cp2")}
                      </td>
                      <td className="text-center">
                        <Badge bg="warning" text="dark">{center.cp2Waiting}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg="info" pill>
                          {center.totalPreferences}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-5">
                      <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                      <p className="mt-2 text-muted">No centers found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Showing {filteredData.length} out of {centersData.length} centers
            </small>
            <div>
              <Badge bg="primary" className="me-2">CP1</Badge>
              <Badge bg="success" className="me-2">CP2</Badge>
              <Badge bg="warning" text="dark">Waiting Count</Badge>
            </div>
          </div>
        </Card.Footer>
      </Card>

      <style jsx>{`
        .table-responsive {
          overflow-x: auto;
        }
        
        table th, table td {
          vertical-align: middle;
        }
        
        .fw-bold {
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .table-responsive {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </Container>
  );
};