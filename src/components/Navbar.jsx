
function Navbar({ goTo, patient, isAdmin, logoutPatient, logoutAdmin }) {
  return (
    <header className="navbar">
      <button className="navbar-brand" onClick={() => goTo('home')}>
        + Emergency Hospital Management System
      </button>

      <nav className="navbar-links">
        <button onClick={() => goTo('findHospital')}>Find Nearest Hospital</button>

        {patient ? (
          <>
            <button onClick={() => goTo('patientDashboard')}>{patient.name}</button>
            <button onClick={logoutPatient}>Logout</button>
          </>
        ) : isAdmin ? (
          <>
            <button onClick={() => goTo('adminDashboard')}>Admin</button>
            <button onClick={logoutAdmin}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => goTo('patientLogin')}>Patient Login</button>
            <button onClick={() => goTo('adminLogin')}>Admin Login</button>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
