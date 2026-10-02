function ManagePatients({ goTo, patients, deletePatient }) {
  return (
    <div className="page">
      <h2>Manage Patients</h2>

      {patients.length === 0 && <p className="muted">No patients registered yet.</p>}

      {patients.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Blood Group</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
                  <td>{p.medicalInfo?.bloodGroup || '—'}</td>
                  <td>
                    <button className="btn btn-outline small" onClick={() => deletePatient(p.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="link-btn" onClick={() => goTo('adminDashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  )
}

export default ManagePatients
