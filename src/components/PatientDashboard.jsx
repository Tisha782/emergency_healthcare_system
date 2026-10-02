function PatientDashboard({ goTo, patient }) {
  if (!patient) {
    return (
      <div className="page">
        <p>You need to log in first.</p>
        <button className="btn btn-primary" onClick={() => goTo('patientLogin')}>
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <h2>Welcome, {patient.name}</h2>
      <p className="muted">What would you like to do?</p>

      <div className="dashboard-grid">
        <button className="dashboard-card" onClick={() => goTo('personalInfo')}>
          <h3>Personal Information</h3>
          <p>View or update your contact and address details.</p>
        </button>

        <button className="dashboard-card" onClick={() => goTo('medicalInfo')}>
          <h3>Medical Information</h3>
          <p>Blood group, allergies, existing conditions and more.</p>
        </button>

        <button className="dashboard-card emergency" onClick={() => goTo('emergencyRequest')}>
          <h3>🚨 Emergency Request</h3>
          <p>Send an urgent request using your current location.</p>
        </button>

        <button className="dashboard-card" onClick={() => goTo('findHospital')}>
          <h3>Find Nearest Hospital</h3>
          <p>Browse hospitals near you and check bed availability.</p>
        </button>
      </div>
    </div>
  )
}

export default PatientDashboard
