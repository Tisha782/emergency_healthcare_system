import { useState } from 'react'

function MedicalInfo({ goTo, patient, updateCurrentPatient }) {
  const [bloodGroup, setBloodGroup] = useState(patient?.medicalInfo?.bloodGroup || '')
  const [allergies, setAllergies] = useState(patient?.medicalInfo?.allergies || '')
  const [conditions, setConditions] = useState(patient?.medicalInfo?.conditions || '')
  const [medications, setMedications] = useState(patient?.medicalInfo?.medications || '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaved(false)
    setError('')

    const result = await updateCurrentPatient({
      medicalInfo: { bloodGroup, allergies, conditions, medications },
    })

    if (!result.success) {
      setError(result.message || 'Could not save. Please try again.')
      return
    }

    setSaved(true)
  }

  return (
    <div className="page form-page">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Medical Information</h2>

        {saved && <p className="success-text">Saved successfully.</p>}
        {error && <p className="error-text">{error}</p>}

        <label>Blood Group</label>
        <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
          <option value="">Select</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <label>Allergies</label>
        <textarea
          rows={2}
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="e.g. Penicillin, peanuts"
        />

        <label>Existing Conditions</label>
        <textarea
          rows={2}
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder="e.g. Diabetes, asthma"
        />

        <label>Current Medications</label>
        <textarea rows={2} value={medications} onChange={(e) => setMedications(e.target.value)} />

        <button type="submit" className="btn btn-primary full-width">
          Save
        </button>

        <button type="button" className="link-btn" onClick={() => goTo('patientDashboard')}>
          ← Back to Dashboard
        </button>
      </form>
    </div>
  )
}

export default MedicalInfo
