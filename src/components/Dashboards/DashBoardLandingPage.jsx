// src/components/Dashboards/DashboardLandingPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { DashboardCounts } from "../../services/DashBoardServices/DashboardService";

export const DashboardLandingPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  // generic totals map (string keys like "8","9","10" => numeric totals)
  const [totals, setTotals] = useState({});

  const fetchDashboardCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await DashboardCounts();
      const data = resp?.data || resp;
      setDashboard(data);

      console.log(data)

      console.log("Dashboard response:", resp);

      const centersArr = data?.centers || data?.data?.centers || [];
      if (!Array.isArray(centersArr)) {
        console.warn("centers is not an array:", centersArr);
      }

      // accumulate totals by class (string keys)
      const accum = {};

      for (const c of centersArr || []) {
        const schoolCounts = c?.dashboardCounts?.school || c?.dashboardCounts || {};
        // try common variants for per-class buckets
        const byClass =
          schoolCounts?.byClass ||
          schoolCounts?.by_class ||
          schoolCounts?.classes ||
          schoolCounts?.class_counts ||
          {};

        // If byClass is not an object, try to skip
        if (!byClass || typeof byClass !== "object") continue;

        for (const clsKey of Object.keys(byClass || {})) {
          try {
            const clsObj = byClass[clsKey];

            // clsObj may be a number, or an object containing registered/count/total
            let value = 0;
            if (clsObj == null) {
              value = 0;
            } else if (typeof clsObj === "number") {
              value = clsObj;
            } else if (typeof clsObj === "string") {
              // sometimes value is string "12"
              value = Number(clsObj) || 0;
            } else if (typeof clsObj === "object") {
              // prefer canonical keys
              value =
                Number(clsObj.registered ?? clsObj.count ?? clsObj.total ?? clsObj.registeredCount ?? clsObj.students ?? 0) ||
                0;
            } else {
              value = 0;
            }

            const key = String(clsKey);
            accum[key] = (accum[key] || 0) + value;
          } catch (e) {
            console.warn("Failed to process class key", clsKey, e);
          }
        }
      }

      // Save full accum map into totals so UI can use any class key
      setTotals(accum);

      console.debug("Computed totals by class:", accum);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived totals for common classes you display
  const totalClass8 = useMemo(() => Number(totals["8"] || 0), [totals]);
  const totalClass9 = useMemo(() => Number(totals["9"] || 0), [totals]);
  const totalClass10 = useMemo(() => Number(totals["10"] || 0), [totals]);

  // compute total sum of 8 and 10 for display
  const totalSum8and10 = useMemo(() => totalClass8 + totalClass10, [totalClass8, totalClass10]);

  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
        <div className="mt-3">Loading dashboard summary...</div>
      </Container>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <strong>Error:</strong> {error}
        </Alert>
      </Container>
    );

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-center" style={{color:'red', fontSize:'40px', fontWeight:'bold'}}>
        Dashboards: 
      </h3>
      <hr></hr>

      {/* {totalSum8and10} */}

      <Row className="g-4">
        {/* optional: Class 8 card (shows only when there's any data for class 8) */}
        {typeof totals["8"] !== "undefined" && (
          <Col md={6}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <h5 className="mb-2 text-primary">Mission Buniyaad (Class 8)</h5>
               
                <h4 style={{color:'red', fontWeight:'bold'}}>Total Registrations: {totalClass8} </h4>
                <hr />
                <ul className="list-unstyled mb-0">
                  <li>🔹 <a href="/district-block-mb"><strong >Click to see District–Block Dashboard</strong></a></li>
                  <li className="mt-2">🔹<a href="/block-school-mb"> <strong>Click to see Block–School Dashboard</strong></a></li>
                  <li className="mt-2">🔹<a href="/school-dashboard-mb"> <strong>Click to see School Dashboard</strong></a></li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Haryana Super 100 (Class 10) */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-2 text-primary">Haryana Super 100 (Class 10)</h5>
              <h4 style={{color:'red', fontWeight:'bold'}}>Total Registrations: {totalClass10} </h4>
              <hr />
              <ul className="list-unstyled mb-0">
                <li>🔹 <a href="/district-block-sh"><strong>Click to see District–Block Dashboard</strong></a></li>
                <li className="mt-2">🔹 <a href="/block-school-sh"><strong>Click to see Block–School Dashboard</strong></a></li>
                <li className="mt-2">🔹<a href="/school-dashboard-sh"> <strong>Click to see School Dashboard</strong></a></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
