// src/components/Dashboards/BlockSchoolDashboard8.jsx
import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Container,
  Row,
  Col,
  Form,
  Button,
  FormControl,
} from "react-bootstrap";
import Select from "react-select";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi.js";
import { GetCentersDataByExaminationAndExamType } from "../../services/ExaminationVenue/ExaminationVenueServices.js";
import { updateSchoolCenterPreferences } from "../../services/DistrictBLockSchoolServices/DistrictBlockSchoolService.js";
import { UserContext } from "../NewContextApis/UserContext";

export const StudentsCenterPreferenceForm = () => {
  const { districtBlockSchoolData = [], loadingDBS, dbsError } = useDistrictBlockSchool();
  const { userData, setUserData } = useContext(UserContext);
  
  const [centersData, setCentersData] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [error, setError] = useState(null);
  const [userBlocks, setUserBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [displayedSchools, setDisplayedSchools] = useState([]);
  const [centerPreferences, setCenterPreferences] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [hasInitialized, setHasInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get block options for user
  const userBlockOptions = useMemo(() => {
    if (!userData || !userData.user || !userData.userAccess || userBlocks.length === 0) return [];
    
    const options = [];
    userBlocks.forEach(blockId => {
      const blockData = districtBlockSchoolData?.find(school => school.blockId === blockId);
      if (blockData) {
        if (!options.find(opt => opt.value === blockData.blockName)) {
          options.push({
            value: blockData.blockName,
            label: `${blockData.blockName} (${blockData.districtName})`
          });
        }
      }
    });
    return options;
  }, [userBlocks, districtBlockSchoolData, userData]);

  // Function to handle auto-loading of block data
  const handleAutoLoadBlock = (blockId) => {
    if (!districtBlockSchoolData || districtBlockSchoolData.length === 0) {
      return;
    }
    
    const blockData = districtBlockSchoolData.find(school => school.blockId === blockId);
    if (blockData) {
      setSelectedBlock(blockData.blockName);
      const schools = districtBlockSchoolData.filter(
        school => school.blockId === blockId
      );
      
      const initialPreferences = {};
      schools.forEach(school => {
        initialPreferences[school._id] = {
          pref1: school.centerPreference1 || "",
          schoolId: school.centerId,
          schoolName: school.centerName,
          isAlreadyFilled: school.centerPrefrenceFilledBy !== null && school.centerPrefrenceFilledBy !== undefined
        };
      });

      setFilteredSchools(schools);
      setDisplayedSchools(schools);
      setCenterPreferences(initialPreferences);
    }
  };

  // Filtered centers for dropdowns based on selected block
  const filteredCenters = useMemo(() => {
    if (!selectedBlock || !centersData || centersData.length === 0) return [];
    return centersData.filter(center => center.blockName === selectedBlock);
  }, [centersData, selectedBlock]);

  // Center options for dropdown
  const centerOptions = useMemo(() => {
    if (!filteredCenters || filteredCenters.length === 0) return [];
    
    return filteredCenters.map(center => ({
      value: center.examinationVenue,
      label: center.examinationVenue
    }));
  }, [filteredCenters]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setDisplayedSchools(filteredSchools);
      return;
    }
    
    const filtered = filteredSchools.filter(school => 
      school.centerName.toLowerCase().includes(query) ||
      school.centerId.toLowerCase().includes(query) ||
      school.districtName.toLowerCase().includes(query)
    );
    
    setDisplayedSchools(filtered);
  };

  // Check if user is logged in and extract blocks
  useEffect(() => {
    if (!userData || !userData.user || !userData.userAccess) {
      return;
    }
    
    // Extract user's accessible blocks from userAccess
    const blocks = [];
    if (userData.userAccess && userData.userAccess.region) {
      userData.userAccess.region.forEach(district => {
        if (district.blockIds && Array.isArray(district.blockIds)) {
          district.blockIds.forEach(block => {
            if (block.blockId) {
              blocks.push(block.blockId);
            }
          });
        }
      });
    }
    setUserBlocks(blocks);
  }, [userData]);

  // Auto-select first block when data is ready
  useEffect(() => {
    if (!hasInitialized && userBlocks.length > 0 && districtBlockSchoolData && districtBlockSchoolData.length > 0) {
      // Auto-select first block if only one is available
      if (userBlocks.length === 1) {
        handleAutoLoadBlock(userBlocks[0]);
      }
      setHasInitialized(true);
    }
  }, [userBlocks, districtBlockSchoolData, hasInitialized]);

  // Update displayed schools when filtered schools change
  useEffect(() => {
    setDisplayedSchools(filteredSchools);
    setSearchQuery(""); // Reset search when schools change
  }, [filteredSchools]);

  // Fetch centers data on mount
  useEffect(() => {
    fetchCentersData();
  }, []);

  // Fetch centers data function
  const fetchCentersData = async () => {
    try {
      setLoadingCenters(true);
      setError(null);
      const response = await GetCentersDataByExaminationAndExamType();
      setCentersData(response.data || []);
    } catch (err) {
      console.error('Error fetching centers data', err);
      setError("Failed to load examination centers data");
    } finally {
      setLoadingCenters(false);
    }
  };

  // Handle block change
  const handleBlockChange = (selectedOption) => {
    const blockName = selectedOption?.value || "";
    setSelectedBlock(blockName);
    
    if (!districtBlockSchoolData || districtBlockSchoolData.length === 0) {
      return;
    }
    
    const blockData = districtBlockSchoolData.find(school => school.blockName === blockName);
    if (blockData) {
      handleAutoLoadBlock(blockData.blockId);
    }
  };

  // Handle preference change
  const handlePreferenceChange = (schoolId, selectedOption) => {
    setCenterPreferences(prev => ({
      ...prev,
      [schoolId]: {
        ...prev[schoolId],
        pref1: selectedOption?.value || ""
      }
    }));
  };

  // Submit single school preferences
  const handleSubmitSingleSchool = async (schoolId) => {
    try {
      if (!userData || !userData.user || !userData.user._id) {
        alert("Please login first to save preferences");
        return;
      }

      setSubmitting(prev => ({ ...prev, [schoolId]: true }));
      
      const schoolData = centerPreferences[schoolId];
      
      if (!schoolData?.pref1) {
        alert("Please select Center Preference");
        setSubmitting(prev => ({ ...prev, [schoolId]: false }));
        return;
      }

      const requestBody = {
        _id: schoolId,
        centerPreference1: schoolData.pref1 || null,
        centerPreference2: null,
        centerPrefrenceFilledBy: userData.user._id
      };

      const response = await updateSchoolCenterPreferences(requestBody);
      
      if (response.success) {
        // alert("Center preference saved successfully!");
        
        // Update the school in filteredSchools with new preferences
        const updatedSchools = filteredSchools.map(school => 
          school._id === schoolId 
            ? { 
                ...school, 
                centerPreference1: response.data.centerPreference1,
                centerPrefrenceFilledBy: userData.user._id
              }
            : school
        );
        
        setFilteredSchools(updatedSchools);
        
        // Update centerPreferences to mark as filled
        setCenterPreferences(prev => ({
          ...prev,
          [schoolId]: {
            ...prev[schoolId],
            pref1: schoolData.pref1,
            isAlreadyFilled: true
          }
        }));
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setSubmitting(prev => ({ ...prev, [schoolId]: false }));
    }
  };

  // Handle bulk submission for all schools
  const handleSubmitAllPreferences = async () => {
    try {
      if (!userData || !userData.user || !userData.user._id) {
        alert("Please login first to save preferences");
        return;
      }

      setSubmitting(prev => ({ ...prev, all: true }));
      
      const schoolsToUpdate = [];
      const errors = [];
      
      Object.keys(centerPreferences).forEach(schoolId => {
        const schoolData = centerPreferences[schoolId];
        
        // Skip schools that are already filled
        if (schoolData?.isAlreadyFilled) {
          return;
        }
        
        if (!schoolData?.pref1) {
          errors.push(`School ${schoolData?.schoolId || schoolId}: Center Preference is required`);
        }
        
        if (schoolData?.pref1 && !schoolData?.isAlreadyFilled) {
          schoolsToUpdate.push({
            _id: schoolId,
            centerPreference1: schoolData.pref1,
            centerPreference2: null,
            centerPrefrenceFilledBy: userData.user._id
          });
        }
      });
      
      if (errors.length > 0) {
        alert("Please fix the following errors:\n" + errors.join("\n"));
        setSubmitting(prev => ({ ...prev, all: false }));
        return;
      }
      
      let successCount = 0;
      
      for (const schoolData of schoolsToUpdate) {
        try {
          const response = await updateSchoolCenterPreferences(schoolData);
          if (response.success) {
            successCount++;
          }
        } catch (error) {
          console.error(`Error updating school ${schoolData._id}:`, error);
        }
      }
      
      alert(`Successfully saved preferences for ${successCount} out of ${schoolsToUpdate.length} schools`);
      
      // Refresh school data
      if (selectedBlock && districtBlockSchoolData) {
        const blockData = districtBlockSchoolData.find(school => school.blockName === selectedBlock);
        if (blockData) {
          const schools = districtBlockSchoolData.filter(
            school => school.blockId === blockData.blockId
          );
          setFilteredSchools(schools);
        }
      }
      
    } catch (error) {
      console.error("Error saving all preferences:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setSubmitting(prev => ({ ...prev, all: false }));
    }
  };

  // Show loading states
  if (loadingDBS || loadingCenters) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // Show login required message if user is not logged in
  if (!userData || !userData.user || !userData.userAccess) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <Alert.Heading>Authentication Required</Alert.Heading>
          <p>Please login first to access the center preference selection.</p>
          <hr />
          <p className="mb-0">
            Only authorized users can fill center preferences.
          </p>
        </Alert>
      </Container>
    );
  }

  // Show error states
  if (dbsError || error) {
    return (
      <Container>
        <Alert variant="danger">
          <Alert.Heading>Error Loading Data</Alert.Heading>
          <p>{dbsError || error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Center Preference Selection</h4>
          <small>Logged in as: {userData.user.userName} ({userData.user.designation})</small>
        </Card.Header>
        <Card.Body>
          {userBlocks.length > 1 ? (
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Your Block</Form.Label>
                  <Select
                    options={userBlockOptions}
                    value={userBlockOptions.find(b => b.value === selectedBlock)}
                    onChange={handleBlockChange}
                    placeholder="Choose your assigned block..."
                    isClearable
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-end">
                <Badge bg="info">
                  Assigned Blocks: {userBlocks.length}
                </Badge>
              </Col>
            </Row>
          ) : (
            <Row className="mb-4">
              <Col md={12}>
                <Alert variant="info">
                  <strong>Your Assigned Block:</strong> {selectedBlock || "Loading..."}
                </Alert>
              </Col>
            </Row>
          )}

          {selectedBlock && filteredSchools.length > 0 && (
            <div className="mt-4">
              <Row className="mb-3">
                <Col md={8}>
                  <h5>Schools in {selectedBlock}</h5>
                </Col>
                <Col md={4}>
                  <FormControl
                    type="text"
                    placeholder="Search schools by name, ID, or district..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <Form.Text className="text-muted">
                    Search schools to quickly find and update preferences
                  </Form.Text>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Badge bg="info">
                  Showing: {displayedSchools.length} of {filteredSchools.length} schools
                  {searchQuery && ` (search: "${searchQuery}")`}
                </Badge>
                <Badge bg="secondary">
                  Centers Available: {centerOptions.length}
                </Badge>
              </div>
              
              <Alert variant="info" className="mb-3">
                <strong>Instructions:</strong> Each school can select one center preference. 
                Once saved, the preference cannot be changed. (प्रत्येक विद्यालय एक केंद्र का चयन कर सकता है।
एक बार चयन हो जाने के बाद, इसे बदला नहीं जा सकता।)
              </Alert>
              
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>School ID</th>
                      <th>School Name</th>
                      <th>District</th>
                      <th>School Type</th>
                      <th>Center Preference *</th>
                      <th>Action</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedSchools.map((school, index) => {
                      const currentPref = centerPreferences[school._id]?.pref1 || school.centerPreference1;
                      const isAlreadyFilled = school.centerPrefrenceFilledBy !== null && school.centerPrefrenceFilledBy !== undefined;
                      const filledByCurrentUser = school.centerPrefrenceFilledBy === userData.user._id;
                      
                      return (
                        <tr key={school._id}>
                          <td>{index + 1}</td>
                          <td>
                            <Badge bg="secondary">{school.centerId}</Badge>
                          </td>
                          <td>{school.centerName}</td>
                          <td>{school.districtName}</td>
                          <td>
                            <Badge bg={school.schoolType === "Haryana School" ? "success" : "warning"}>
                              {school.schoolType}
                            </Badge>
                          </td>
                          <td>
                            <Select
                              options={centerOptions}
                              value={centerOptions.find(opt => opt.value === currentPref)}
                              onChange={(selected) => handlePreferenceChange(school._id, selected)}
                              placeholder="Select Center *"
                              isClearable
                              isSearchable
                              isDisabled={isAlreadyFilled}
                              className={isAlreadyFilled ? "bg-light" : ""}
                            />
                            <small className="text-muted d-block mt-1">
                              {isAlreadyFilled ? 
                                "Cannot be changed" : 
                                "Required - Select one center"}
                            </small>
                          </td>
                          <td>
                            <Button
                              variant={isAlreadyFilled ? "secondary" : "primary"}
                              size="sm"
                              onClick={() => handleSubmitSingleSchool(school._id)}
                              disabled={submitting[school._id] || !currentPref || isAlreadyFilled}
                            >
                              {submitting[school._id] ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-1" />
                                  Saving...
                                </>
                              ) : isAlreadyFilled ? (
                                "✓ Filled"
                              ) : (
                                "Save"
                              )}
                            </Button>
                          </td>
                          <td>
                            <div className="text-center">
                              {isAlreadyFilled ? (
                                <Badge bg="success">
                                  ✓ Filled
                                </Badge>
                              ) : (
                                <Badge bg="warning">
                                  Pending
                                </Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              {displayedSchools.length === 0 && (
                <Alert variant="warning" className="mt-3">
                  No schools match your search criteria. Try a different search term.
                </Alert>
              )}

              <div className="d-flex justify-content-between mt-4">
                <div className="text-muted">
                  <small>* Center Preference is required. Cannot be changed once saved.</small>
                </div>
                {/* <div>
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={handleSubmitAllPreferences}
                    disabled={submitting.all || displayedSchools.length === 0}
                  >
                    {submitting.all ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Saving All...
                      </>
                    ) : (
                      "Save All Unfilled Preferences"
                    )}
                  </Button>
                </div> */}
              </div>
            </div>
          )}

          {selectedBlock && filteredSchools.length === 0 && districtBlockSchoolData && districtBlockSchoolData.length > 0 && (
            <Alert variant="info" className="mt-4">
              <Alert.Heading>No Schools Found</Alert.Heading>
              <p>
                No schools found in {selectedBlock}. 
                Please contact administrator if this is incorrect.
              </p>
            </Alert>
          )}
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>
            <strong>Summary:</strong> 
            {filteredSchools.length > 0 && (
              <>
                <span className="ms-2">
                  • Total Schools: {filteredSchools.length}
                </span>
                <span className="ms-2">
                  • Filled: {filteredSchools.filter(s => s.centerPrefrenceFilledBy).length}
                </span>
                <span className="ms-2">
                  • Pending: {filteredSchools.filter(s => !s.centerPrefrenceFilledBy).length}
                </span>
              </>
            )}
          </small>
        </Card.Footer>
      </Card>

      {/* Summary Card */}
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <h6 className="mb-0">Quick Stats</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-2">
                  <div className="text-center p-2 border rounded">
                    <h6>Total Schools</h6>
                    <h4 className="text-primary">{filteredSchools.length}</h4>
                  </div>
                </Col>
                <Col md={6} className="mb-2">
                  <div className="text-center p-2 border rounded">
                    <h6>Centers Available</h6>
                    <h4 className="text-success">{centerOptions.length}</h4>
                  </div>
                </Col>
                <Col md={6} className="mb-2">
                  <div className="text-center p-2 border rounded">
                    <h6>Preferences Filled</h6>
                    <h4 className="text-warning">
                      {filteredSchools.filter(s => s.centerPrefrenceFilledBy).length}
                    </h4>
                  </div>
                </Col>
                <Col md={6} className="mb-2">
                  <div className="text-center p-2 border rounded">
                    <h6>Pending</h6>
                    <h4 className="text-danger">
                      {filteredSchools.filter(s => !s.centerPrefrenceFilledBy).length}
                    </h4>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          {/* <Card>
            <Card.Header>
              <h6 className="mb-0">Important Notes</h6>
            </Card.Header>
            <Card.Body>
              <ul className="mb-0 small">
                <li><strong>✓ Centers can be selected by multiple schools</strong> - Same center can be chosen by different schools</li>
                <li><strong>✗ Once filled, cannot be changed</strong> - After saving, preferences are locked</li>
                <li><strong>🔍 Use search</strong> - Quickly find schools by name, ID, or district</li>
                <li><strong>📊 Save individual or all</strong> - Save one school at a time or all unfilled schools</li>
                <li><strong>⚠️ No duplicate restrictions</strong> - Multiple schools can select the same examination center</li>
                <li><strong>✅ Status indicators</strong> - Green badge means filled, yellow means pending</li>
              </ul>
            </Card.Body>
          </Card> */}
        </Col>
      </Row>
    </Container>
  );
};