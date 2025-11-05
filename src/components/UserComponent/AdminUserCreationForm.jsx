
import React, { useState, useMemo } from "react";
import { Form, Container, Row, Col, Card, Button, Spinner, Alert, ProgressBar } from "react-bootstrap";
import Select from "react-select";
import { createOrUpdateUser } from "../../services/UserServices/UserService";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";



export const UserCreationForm = () => {
  const { districtBlockSchoolData = [], loadingDBS, dbsError } = useDistrictBlockSchool();

  // Basic user fields
  const [userName, setUserName] = useState("");
  const [designation, setDesignation] = useState(null);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  // Dependent selects (we allow multi-select)
  const [selectedDistricts, setSelectedDistricts] = useState([]); // array of { value, label }
  const [selectedBlocks, setSelectedBlocks] = useState([]); // array of { value, label }
  const [selectedSchools, setSelectedSchools] = useState([]); // array of { value, label }

  // UI state
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  // Bulk CSV upload
  const [csvProcessing, setCsvProcessing] = useState(false);
  const [csvProgress, setCsvProgress] = useState({ done: 0, total: 0, success: 0, failed: 0 });

  // designation options (react-select)
  const designationOptions = [
    { value: "ACI", label: "ACI" },
    { value: "Center Coordinator", label: "Center Coordinator" },
    { value: "HKRN", label: "HKRN" },
    { value: "ABRC", label: "ABRC" },
    { value: "Principal", label: "Principal" },
    { value: "Teacher", label: "Teacher" },
    { value: "School Staff", label: "School Staff" },
    { value: "Vikalpa Staff", label: "Vikalpa Staff" },
    { value: "Verification Team", label: "Verification Team" },
  ];

  // derive unique districts from districtBlockSchoolData
  const districtOptions = useMemo(() => {
    const map = new Map();
    (districtBlockSchoolData || []).forEach((r) => {
      if (!r) return;
      const id = String(r.districtId ?? r.districtId);
      const name = r.districtName ?? r.districtName ?? id;
      if (!map.has(id)) map.set(id, { value: id, label: `${name} (${id})` });
    });
    return Array.from(map.values());
  }, [districtBlockSchoolData]);

  // derive blocks available for selected districts
  const blockOptions = useMemo(() => {
    const blocksMap = new Map();
    const selectedDistrictIds = new Set(selectedDistricts.map((d) => d.value));
    (districtBlockSchoolData || []).forEach((r) => {
      if (!r) return;
      if (selectedDistrictIds.size === 0 || selectedDistrictIds.has(String(r.districtId))) {
        const blockId = String(r.blockId ?? r.blockId);
        const blockName = r.blockName ?? r.blockName ?? blockId;
        if (!blocksMap.has(blockId)) blocksMap.set(blockId, { value: blockId, label: `${blockName} (${blockId})`, districtId: String(r.districtId) });
      }
    });
    return Array.from(blocksMap.values());
  }, [districtBlockSchoolData, selectedDistricts]);

  // derive schools for selected blocks
  const schoolOptions = useMemo(() => {
    const schoolsMap = new Map();
    const selectedBlockIds = new Set(selectedBlocks.map((b) => b.value));
    (districtBlockSchoolData || []).forEach((r) => {
      if (!r) return;
      if (selectedBlockIds.size === 0 || selectedBlockIds.has(String(r.blockId))) {
        const centerId = String(r.centerId ?? r.centerId);
        const centerName = r.centerName ?? r.centerName ?? centerId;
        if (!schoolsMap.has(centerId)) schoolsMap.set(centerId, { value: centerId, label: `${centerName} (${centerId})`, blockId: String(r.blockId) });
      }
    });
    return Array.from(schoolsMap.values());
  }, [districtBlockSchoolData, selectedBlocks]);

  // helper to build userAccess region structure required by backend (from selects)
  const buildAccessPayload = () => {
    const allData = districtBlockSchoolData || [];

    const districtIdSet = new Set(selectedDistricts.map((d) => d.value));
    if (districtIdSet.size === 0 && selectedBlocks.length > 0) {
      selectedBlocks.forEach((b) => {
        const found = allData.find((r) => String(r.blockId) === String(b.value));
        if (found) districtIdSet.add(String(found.districtId));
      });
    }

    if (districtIdSet.size === 0 && selectedBlocks.length === 0 && selectedSchools.length === 0) return { region: [] };

    const blockIdSet = new Set(selectedBlocks.map((b) => b.value));
    const schoolIdSet = new Set(selectedSchools.map((s) => s.value));

    const regions = [];
    const districtIdsArray = Array.from(districtIdSet);
    if (districtIdsArray.length === 0 && blockIdSet.size > 0) {
      const inferredDistricts = new Set();
      allData.forEach((r) => {
        if (blockIdSet.has(String(r.blockId))) inferredDistricts.add(String(r.districtId));
      });
      districtIdsArray.push(...Array.from(inferredDistricts));
    }

    if (districtIdsArray.length === 0 && schoolIdSet.size > 0) {
      const inferredDistricts = new Set();
      allData.forEach((r) => {
        if (schoolIdSet.has(String(r.centerId))) inferredDistricts.add(String(r.districtId));
      });
      districtIdsArray.push(...Array.from(inferredDistricts));
    }

    districtIdsArray.forEach((districtId) => {
      const blocksForDistrictMap = new Map();
      allData.forEach((r) => {
        if (String(r.districtId) === String(districtId)) {
          const bId = String(r.blockId);
          if (!blocksForDistrictMap.has(bId)) blocksForDistrictMap.set(bId, { blockId: bId, schoolIds: new Set() });
          blocksForDistrictMap.get(bId).schoolIds.add(String(r.centerId));
        }
      });

      const blocksArr = [];
      if (blockIdSet.size > 0) {
        Array.from(blocksForDistrictMap.values()).forEach((blk) => {
          if (blockIdSet.has(String(blk.blockId))) {
            let schools = Array.from(blk.schoolIds);
            if (schoolIdSet.size > 0) {
              schools = schools.filter((sId) => schoolIdSet.has(String(sId)));
            }
            blocksArr.push({
              blockId: blk.blockId,
              schoolIds: schools.map((s) => ({ schoolId: String(s) })),
            });
          }
        });
      } else {
        Array.from(blocksForDistrictMap.values()).forEach((blk) => {
          let schools = Array.from(blk.schoolIds);
          if (schoolIdSet.size > 0) {
            schools = schools.filter((sId) => schoolIdSet.has(String(sId)));
          }
          blocksArr.push({
            blockId: blk.blockId,
            schoolIds: schools.map((s) => ({ schoolId: String(s) })),
          });
        });
      }

      regions.push({
        districtId: String(districtId),
        blockIds: blocksArr,
      });
    });

    return { region: regions };
  };

  // single user submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setError(null);

    // Basic validation
    if (!userName || !designation || !mobile) {
      setError("Please fill name, designation and mobile.");
      return;
    }

    const payloadUser = {
      userName: userName.trim(),
      designation: designation.value,
      mobile: String(mobile).trim(),
      password: password || "",
    };

    const userAccess = buildAccessPayload();

    setLoading(true);
    try {
      const rsp = await createOrUpdateUser({ user: payloadUser, userAccess });
      setMsg("User created/updated successfully.");
      setUserName("");
      setDesignation(null);
      setMobile("");
      setPassword("");
      setSelectedDistricts([]);
      setSelectedBlocks([]);
      setSelectedSchools([]);

    } catch (err) {

      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to create user");

    } finally {
      setLoading(false);
    }
  };

  // CSV template download
  const handleDownloadTemplate = () => {
    // Headers: name,designation,mobile,password,districtIds,blockIds,schoolIds
    // Example row with comma-separated ids in districtIds/blockIds/schoolIds
    const headers = ["name", "designation", "mobile", "password", "districtIds", "blockIds", "schoolIds"];
    const example = [
      "Ravi Kumar",
      "Teacher",
      "9876543210",
      "password123",
      "1,10", // districtIds
      "4,96", // blockIds
      "30,2665" // schoolIds (centerId)
    ];
    const csvContent = [headers.join(","), example.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_bulk_upload_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Robust CSV parsing: handles quoted fields, commas inside quotes, trims and removes surrounding quotes
  const parseCsvText = (text) => {
    // split into lines, keep empty cells but drop completely empty lines
    const rawLines = text.split(/\r\n|\n/);
    const lines = rawLines.map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) return [];

    // parse CSV line with support for quoted fields
    const parseLine = (line) => {
      const out = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"' || ch === "“" || ch === "”") {
          // toggle inQuotes (handle stray quotes)
          inQuotes = !inQuotes;
          continue;
        }
        if (ch === "," && !inQuotes) {
          out.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
      out.push(cur);
      // trim spaces and remove surrounding quotes in each cell
      return out.map((c) => {
        let s = c == null ? "" : String(c).trim();
        if (s.startsWith('"') && s.endsWith('"')) {
          s = s.slice(1, -1);
        }
        return s.trim();
      });
    };

    const headerCells = parseLine(lines[0]).map((h) => h.trim());
    const rows = lines.slice(1).map((ln) => {
      const parsed = parseLine(ln);
      const obj = {};
      headerCells.forEach((h, i) => {
        obj[h] = parsed[i] ?? "";
      });
      return obj;
    });
    return rows;
  };

  // Build region from CSV ids using districtBlockSchoolData (robust)
  const buildRegionFromCsv = (districtIds = [], blockIds = [], schoolIds = []) => {
    const allData = districtBlockSchoolData || [];

    const normalize = (arr) =>
      Array.from(new Set((arr || []).map((s) => String(s).replace(/["']/g, "").trim()).filter(Boolean)));

    const dIds = normalize(districtIds);
    const bIds = normalize(blockIds);
    const sIds = normalize(schoolIds);

    // build lookup maps
    const blocksByDistrict = new Map(); // districtId => Set(blockId)
    const schoolsByBlock = new Map(); // blockId => Set(centerId)
    const blockToDistrict = new Map(); // blockId => districtId
    const schoolToBlock = new Map(); // centerId => blockId
    const schoolToDistrict = new Map(); // centerId => districtId

    allData.forEach((r) => {
      const dist = String(r.districtId).trim();
      const blk = String(r.blockId).trim();
      const sch = String(r.centerId).trim();

      if (!blocksByDistrict.has(dist)) blocksByDistrict.set(dist, new Set());
      blocksByDistrict.get(dist).add(blk);

      if (!schoolsByBlock.has(blk)) schoolsByBlock.set(blk, new Set());
      schoolsByBlock.get(blk).add(sch);

      blockToDistrict.set(blk, dist);
      schoolToBlock.set(sch, blk);
      schoolToDistrict.set(sch, dist);
    });

    // If no districts provided, infer from blocks or schools
    let districtsToProcess = dIds.slice();
    if (districtsToProcess.length === 0) {
      const inferred = new Set();
      bIds.forEach((b) => {
        if (blockToDistrict.has(b)) inferred.add(blockToDistrict.get(b));
      });
      sIds.forEach((s) => {
        if (schoolToDistrict.has(s)) inferred.add(schoolToDistrict.get(s));
      });
      districtsToProcess = Array.from(inferred);
    }

    // Final fallback: if still empty but CSV provided blocks/schools, infer districts from allData scanning
    if (districtsToProcess.length === 0 && (bIds.length > 0 || sIds.length > 0)) {
      const inferred = new Set();
      allData.forEach((r) => {
        if (bIds.includes(String(r.blockId))) inferred.add(String(r.districtId));
        if (sIds.includes(String(r.centerId))) inferred.add(String(r.districtId));
      });
      districtsToProcess = Array.from(inferred);
    }

    if (districtsToProcess.length === 0) return []; // nothing to do

    const region = [];

    districtsToProcess.forEach((dist) => {
      const availableBlocks = Array.from(blocksByDistrict.get(dist) || []);
      // determine which blocks to use for this district
      let blocksToUse = [];
      if (bIds.length > 0) {
        // only blocks from CSV that belong to this district
        blocksToUse = availableBlocks.filter((blk) => bIds.includes(String(blk)));
      } else {
        // include all blocks for the district
        blocksToUse = availableBlocks.slice();
      }

      // if still empty but schoolIds provided, infer blocks from provided schools for this district
      if (blocksToUse.length === 0 && sIds.length > 0) {
        const inferredBlocks = new Set();
        sIds.forEach((s) => {
          if (schoolToDistrict.get(s) === dist) {
            const blk = schoolToBlock.get(s);
            if (blk) inferredBlocks.add(blk);
          }
        });
        blocksToUse.push(...Array.from(inferredBlocks));
      }

      // build block entries with their schoolIds
      const blockEntries = blocksToUse.map((blk) => {
        const availableSchools = Array.from(schoolsByBlock.get(blk) || []);
        let schoolsToUse = [];
        if (sIds.length > 0) {
          // only schools from CSV that belong to this block
          schoolsToUse = availableSchools.filter((sch) => sIds.includes(String(sch)));
        } else {
          // include all schools for block
          schoolsToUse = availableSchools.slice();
        }
        // map to expected shape
        return {
          blockId: String(blk),
          schoolIds: schoolsToUse.map((s) => ({ schoolId: String(s) })),
        };
      });

      // Only add district if there is at least one block entry (to avoid empty blocks arrays)
      region.push({
        districtId: String(dist),
        blockIds: blockEntries,
      });
    });

    // Deduplicate region entries by districtId
    const seen = new Set();
    const deduped = [];
    region.forEach((r) => {
      if (!seen.has(r.districtId)) {
        seen.add(r.districtId);
        deduped.push(r);
      } else {
        // merge blockIds if duplicate district encountered
        const existing = deduped.find((x) => x.districtId === r.districtId);
        if (existing) {
          const existingBlocksMap = new Map();
          existing.blockIds.forEach((b) => existingBlocksMap.set(b.blockId, b));
          r.blockIds.forEach((b) => {
            if (!existingBlocksMap.has(b.blockId)) existing.blockIds.push(b);
            else {
              // merge schoolIds
              const eb = existingBlocksMap.get(b.blockId);
              const existingSchoolSet = new Set(eb.schoolIds.map((s) => s.schoolId));
              b.schoolIds.forEach((s) => {
                if (!existingSchoolSet.has(s.schoolId)) {
                  eb.schoolIds.push(s);
                  existingSchoolSet.add(s.schoolId);
                }
              });
            }
          });
        }
      }
    });

    return deduped;
  };

  // Bulk CSV upload handler
  const handleCsvUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setCsvProcessing(true);
    setCsvProgress({ done: 0, total: 0, success: 0, failed: 0 });
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const text = ev.target.result;
        const rows = parseCsvText(text);
        if (!rows.length) {
          setError("CSV appears empty or malformed.");
          setCsvProcessing(false);
          return;
        }
        setCsvProgress((p) => ({ ...p, total: rows.length }));
        let done = 0, success = 0, failed = 0;

        // Changed loop to indexed for-loop with per-iteration consts to ensure each row is processed correctly
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          // Required fields: name, designation, mobile
          const name = (row.name || row.Name || "").trim();
          const desg = (row.designation || row.Designation || "").trim();
          const mob = (row.mobile || row.Mobile || "").trim();
          const pwd = (row.password || row.Password || "").trim();

          // CSV columns for ids expected to be comma-separated strings (may have trailing comma)
          const districtIdsStr = (row.districtIds || row.districtids || "").trim();
          const blockIdsStr = (row.blockIds || row.blockids || "").trim();
          const schoolIdsStr = (row.schoolIds || row.schoolids || "").trim();

          // Build user object as backend expects
          const payloadUser = {
            userName: name,
            designation: desg,
            mobile: mob,
            password: pwd,
          };

          // Convert CSV ids to arrays, handle trailing commas and quotes and empty items
          const splitIds = (str) =>
            (str || "")
              .split(",")
              .map((s) => String(s).replace(/["']/g, "").trim())
              .filter((s) => s !== "");

          const districtIds = splitIds(districtIdsStr);
          const blockIds = splitIds(blockIdsStr);
          const schoolIds = splitIds(schoolIdsStr);

          // Build nested region using districtBlockSchoolData
          const region = buildRegionFromCsv(districtIds, blockIds, schoolIds);

          const userAccess = { region };

          try {
            await createOrUpdateUser({ user: payloadUser, userAccess });
            success++;
          } catch (err) {
            console.error("Bulk row error", row, err);
            failed++;
          } finally {
            done++;
            setCsvProgress({ done, total: rows.length, success, failed });
          }
        }

        setMsg(`CSV processing finished. Success: ${success}, Failed: ${failed}`);
      } catch (err) {
        console.error(err);
        setError("Failed to parse CSV. Ensure the file is a valid comma-separated CSV (use quotes for fields with commas).");
      } finally {
        setCsvProcessing(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read CSV file.");
      setCsvProcessing(false);
    };
    reader.readAsText(file, "UTF-8");
    // reset file input value
    e.target.value = "";
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-lg" style={{ width: "720px", borderRadius: "12px" }}>
        <Card.Body>
          <h3 className="text-center mb-3">Register User</h3>

          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          {msg && <Alert variant="success" onClose={() => setMsg(null)} dismissible>{msg}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2" controlId="userName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter full name" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-2" controlId="designation">
                  <Form.Label>Designation</Form.Label>
                  <Select
                    value={designation}
                    onChange={(val) => setDesignation(val)}
                    options={designationOptions}
                    placeholder="Select designation"
                    isClearable
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2" controlId="mobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter mobile number" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-2" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password (stored as plain text)" />
                </Form.Group>
              </Col>
            </Row>

            <hr />

            <h5 className="mb-2">Access (District → Block → School)</h5>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-2" controlId="districtSelect">
                  <Form.Label>District(s)</Form.Label>
                  <Select
                    isMulti
                    options={districtOptions}
                    value={selectedDistricts}
                    onChange={(v) => {
                      setSelectedDistricts(v || []);
                      // Reset blocks & schools when districts change
                      setSelectedBlocks([]);
                      setSelectedSchools([]);
                    }}
                    placeholder={loadingDBS ? "Loading..." : "Select district(s)"}
                    isDisabled={loadingDBS || districtOptions.length === 0}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-2" controlId="blockSelect">
                  <Form.Label>Block(s)</Form.Label>
                  <Select
                    isMulti
                    options={blockOptions}
                    value={selectedBlocks}
                    onChange={(v) => {
                      setSelectedBlocks(v || []);
                      setSelectedSchools([]);
                    }}
                    placeholder="Select block(s)"
                    isDisabled={blockOptions.length === 0}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-2" controlId="schoolSelect">
                  <Form.Label>School(s) / Center(s)</Form.Label>
                  <Select
                    isMulti
                    options={schoolOptions}
                    value={selectedSchools}
                    onChange={(v) => setSelectedSchools(v || [])}
                    placeholder="Select school(s)"
                    isDisabled={schoolOptions.length === 0}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (<><Spinner animation="border" size="sm" /> Saving...</>) : "Register User"}
              </Button>
            </div>
          </Form>

          <hr />

          <h5>Bulk Upload</h5>
          <Row className="align-items-center">
            <Col md={6} className="mb-2">
              <Button variant="outline-primary" onClick={handleDownloadTemplate}>Download Bulk Upload Template</Button>
            </Col>
            <Col md={6} className="mb-2">
              <Form.Group controlId="csvUpload">
                <Form.Label className="d-block">Upload CSV</Form.Label>
                <Form.Control type="file" accept=".csv,text/csv" onChange={handleCsvUpload} />
              </Form.Group>
            </Col>
          </Row>

          {csvProcessing && (
            <>
              <p className="mt-2 mb-1">Processing CSV: {csvProgress.done}/{csvProgress.total}</p>
              <ProgressBar now={csvProgress.total ? (csvProgress.done / csvProgress.total) * 100 : 0} />
              <p className="mt-2 mb-0">Success: {csvProgress.success} | Failed: {csvProgress.failed}</p>
            </>
          )}

          <div className="text-muted mt-3">
            <small>
              <strong>CSV format:</strong> headers (first row): <code>name,designation,mobile,password,districtIds,blockIds,schoolIds</code><br />
              For multiple ids use comma separated values in the same cell (example: <code>districtIds</code> = <code>1,10</code>). The component will convert these to the backend's <code>userAccess.region</code> structure.
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
