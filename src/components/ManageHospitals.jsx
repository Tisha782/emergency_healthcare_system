import { useState } from 'react'

function ManageHospitals({ goTo, hospitals, updateHospitalBeds }) {
  const [savedId, setSavedId] = useState(null)

  async function handleSave(id, value) {
    const beds = Math.max(0, Number(value) || 0)
    const result = await updateHospitalBeds(id, beds)
    if (result.success) {
      setSavedId(id)
      setTimeout(() => setSavedId(null), 1500)
    }
  }

  return (
    <div className="page">
      <h2>Manage Hospitals</h2>
      <p className="muted">Update available beds for each hospital.</p>

      <div className="hospital-list">
        {hospitals.map((h) => (
          <HospitalRow key={h.id} hospital={h} onSave={handleSave} justSaved={savedId === h.id} />
        ))}
      </div>

      <button className="link-btn" onClick={() => goTo('adminDashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  )
}

function HospitalRow({ hospital, onSave, justSaved }) {
  const [beds, setBeds] = useState(hospital.availableBeds)

  return (
    <div className="card hospital-card">
      <div className="hospital-card-header">
        <h3>{hospital.name}</h3>
        <span className="muted small">Total beds: {hospital.totalBeds}</span>
      </div>
      <p className="muted small">{hospital.address}</p>

      <div className="bed-editor">
        <label>Available Beds</label>
        <input
          type="number"
          min="0"
          max={hospital.totalBeds}
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
        />
        <button className="btn btn-primary small" onClick={() => onSave(hospital.id, beds)}>
          Save
        </button>
        {justSaved && <span className="success-text small">Saved ✓</span>}
      </div>
    </div>
  )
}

export default ManageHospitals
