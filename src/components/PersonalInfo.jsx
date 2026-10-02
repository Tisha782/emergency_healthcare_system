import { useState } from 'react'

function PersonalInfo({ goTo, patient, updateCurrentPatient }) {
  const [age, setAge] = useState(patient?.personalInfo?.age || '')
  const [gender, setGender] = useState(patient?.personalInfo?.gender || '')
  const [address, setAddress] = useState(patient?.personalInfo?.address || '')
  const [emergencyContact, setEmergencyContact] = useState(
    patient?.personalInfo?.emergencyContact || ''
  )
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaved(false)
    setError('')

    const result = await updateCurrentPatient({
      personalInfo: { age, gender, address, emergencyContact },
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
        <h2>Personal Information</h2>

        {saved && <p className="success-text">Saved successfully.</p>}
        {error && <p className="error-text">{error}</p>}

        <label>Age</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />

        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>

        <label>Address</label>
        <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} />

        <label>Emergency Contact Number</label>
        <input
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          placeholder="Family member or friend's number"
        />

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

export default PersonalInfo
