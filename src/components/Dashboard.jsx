import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState(null); // For dashboard mock data
  const [prs, setPrs] = useState([]); // For real PRs
  const [actions, setActions] = useState(null); // For GitHub Actions (CI/CD)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commitInfo, setCommitInfo] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardRes = await axios.get("/api/dashboard");
        setData(dashboardRes.data);

        const prsRes = await axios.get("/api/github/prs");
        setPrs(prsRes.data);

        const actionsRes = await axios.get("/api/github/actions");
        setActions(actionsRes.data.workflow_runs[0]); // Latest run
        setCommitInfo(actionsRes.data.latestCommit); // Commit info
      } catch (err) {
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      {/* CI/CD Pipeline Status */}
      <Card title="CI/CD Pipeline Status">
        {actions ? (
          <div>
            <p>
              <strong>Status:</strong>{" "}
              {actions.conclusion === "success" ? (
                <span style={{ color: "green" }}>✅ Success</span>
              ) : actions.conclusion === "failure" ? (
                <span style={{ color: "red" }}>❌ Failed</span>
              ) : (
                <span>⏳ In Progress</span>
              )}
            </p>
            <p>
              <strong>Workflow:</strong> {actions.name}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(actions.updated_at).toLocaleString()}
            </p>
            {commitInfo && (
              <>
                <p>
                  <strong>Commit:</strong> {commitInfo.message}
                </p>
                <p>
                  <strong>Author:</strong> {commitInfo.author}
                </p>
              </>
            )}
          </div>
        ) : (
          <p>No workflow data</p>
        )}
      </Card>

      {/* Recent Pull Requests */}
      <Card title="Recent Pull Requests">
        <ul>
          {prs.length === 0 ? (
            <li>No open PRs</li>
          ) : (
            prs.map((pr) => (
              <li key={pr.id}>
                <a href={pr.html_url} target="_blank" rel="noreferrer">
                  {pr.title}
                </a>
              </li>
            ))
          )}
        </ul>
      </Card>

      {/* Deployment Logs */}
      <Card title="Deployment Logs">
        <ul>
          {data.deployments.map((deploy, index) => (
            <li key={index}>{deploy}</li>
          ))}
        </ul>
      </Card>

      {/* Service Health */}
      <Card title="Service Health">
        <p>{data.serviceHealth}</p>
      </Card>

      {/* Error Logs */}
      <Card title="Error Logs">
        <p>{data.errorLogs}</p>
      </Card>
    </div>
  );
};

export default Dashboard;
