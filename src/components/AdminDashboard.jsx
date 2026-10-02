function AdminDashboard({ goTo, patientCount, pendingCount }) {
  return (
    <div className="page">
      <h2>Admin Dashboard</h2>
      <p className="muted">Manage hospitals, patients and incoming emergency requests.</p>

      <div className="stat-row">
        <div className="stat-box">
          <span className="stat-number">{patientCount}</span>
          <span>Registered Patients</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{pendingCount}</span>
          <span>Pending Requests</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <button className="dashboard-card" onClick={() => goTo('managePatients')}>
          <h3>Manage Patients</h3>
          <p>View registered patients and their details.</p>
        </button>

        <button className="dashboard-card" onClick={() => goTo('manageHospitals')}>
          <h3>Manage Hospitals</h3>
          <p>Update bed availability for each hospital.</p>
        </button>

        <button className="dashboard-card emergency" onClick={() => goTo('adminRequests')}>
          <h3>🚨 Emergency Requests</h3>
          <p>View and resolve incoming emergency requests.</p>
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard
