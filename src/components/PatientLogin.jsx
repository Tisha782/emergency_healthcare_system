import { useState } from 'react'

function PatientLogin({ goTo, loginPatient }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const result = await loginPatient(email, password)

    if (!result.success) {
      setError(result.message)
      return
    }

    goTo('patientDashboard')
  }

  return (
    <div className="page form-page">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Patient Login</h2>

        {error && <p className="error-text">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />

        <button type="submit" className="btn btn-primary full-width">
          Login
        </button>

        <p className="form-footer">
          New here?{' '}
          <button type="button" className="link-btn" onClick={() => goTo('patientRegister')}>
            Create an account
          </button>
        </p>
      </form>
    </div>
  )
}

export default PatientLogin
