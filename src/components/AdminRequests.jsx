function AdminRequests({ goTo, requests, resolveRequest }) {
  return (
    <div className="page">
      <h2>🚨 Emergency Requests</h2>

      {requests.length === 0 && <p className="muted">No emergency requests yet.</p>}

      <div className="hospital-list">
        {requests.map((r) => (
          <div className="card hospital-card" key={r.id}>
            <div className="hospital-card-header">
              <h3>{r.patientName}</h3>
              <span className={r.status === 'Pending' ? 'badge badge-red' : 'badge badge-green'}>
                {r.status}
              </span>
            </div>
            <p>{r.notes || 'No details provided.'}</p>
            <p className="muted small">
              Nearest hospital suggested: {r.nearestHospital} · Location:{' '}
              {r.location?.lat.toFixed(3)}, {r.location?.lng.toFixed(3)}
            </p>
            <p className="muted small">{new Date(r.createdAt).toLocaleString()}</p>

            {r.status === 'Pending' && (
              <button className="btn btn-primary small" onClick={() => resolveRequest(r.id)}>
                Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>

      <button className="link-btn" onClick={() => goTo('adminDashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  )
}

export default AdminRequests
