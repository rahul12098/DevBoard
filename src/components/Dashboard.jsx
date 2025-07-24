import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState(null);       // For dashboard mock data
  const [prs, setPrs] = useState([]);           // For real PRs
  const [actions, setActions] = useState(null); // For GitHub Actions (CI/CD)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch mock data
        const dashboardRes = await axios.get("/api/dashboard");
        setData(dashboardRes.data);

        // Fetch real PRs
        const prsRes = await axios.get("/api/github/prs");
        setPrs(prsRes.data);

        // Fetch GitHub Actions (last workflow run)
        const actionsRes = await axios.get("/api/github/actions");
        setActions(actionsRes.data.workflow_runs[0]); // latest workflow
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error(err);
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
          <p>
            Latest Build: {actions.status === "completed" ? "✅ Success" : "⚠️ Pending"} <br />
            Workflow: {actions.name} <br />
            Updated At: {new Date(actions.updated_at).toLocaleString()}
          </p>
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
