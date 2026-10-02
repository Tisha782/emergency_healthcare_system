function Home({ goTo }) {
  return (
    <div className="page">
      <section className="hero">
        <h1>Emergency Hospital Management System</h1>
        <p>
          Register, add your medical details, and raise an emergency request.
          We find the nearest hospital with an available bed using your
          current location.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => goTo('patientRegister')}>
            Patient Registration
          </button>
          <button className="btn btn-secondary" onClick={() => goTo('findHospital')}>
            Find Nearest Hospital
          </button>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <h3>1. Register / Login</h3>
          <p>Create a patient account and log in to access your dashboard.</p>
        </div>
        <div className="feature-card">
          <h3>2. Add Your Details</h3>
          <p>Save personal and medical information for faster emergency care.</p>
        </div>
        <div className="feature-card">
          <h3>3. Raise Emergency Request</h3>
          <p>Send a request using your live location so help finds you fast.</p>
        </div>
        <div className="feature-card">
          <h3>4. Get Matched</h3>
          <p>We check nearby hospitals and their bed availability instantly.</p>
        </div>
      </section>

      <section className="admin-cta">
        <p>Are you a hospital administrator?</p>
        <button className="btn btn-outline" onClick={() => goTo('adminLogin')}>
          Go to Admin Login
        </button>
      </section>
    </div>
  )
}

export default Home
