import React from 'react';
import Card from './Card';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Card title="CI/CD Pipeline Status">
        <p>Status: ✅ All Green</p>
      </Card>

      <Card title="Recent Pull Requests">
        <p>PR #104 merged by Alice</p>
      </Card>

      <Card title="Deployment Logs">
        <p>No recent failures</p>
      </Card>

      <Card title="Service Health">
        <p>All services operational</p>
      </Card>

      <Card title="Error Logs">
        <p>0 errors in last 24h</p>
      </Card>
    </div>
  );
};

export default Dashboard;
