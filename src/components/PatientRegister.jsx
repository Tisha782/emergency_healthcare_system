import { useState } from 'react'

function PatientRegister({ goTo, registerPatient }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name || !email || !phone || !password) {
      setError('Please fill in every field.')
      return
    }

    const result = await registerPatient({ name, email, phone, password })

    if (!result.success) {
      setError(result.message)
      return
    }

    goTo('patientLogin')
  }

  return (
    <div className="page form-page">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Patient Registration</h2>

        {error && <p className="error-text">{error}</p>}

        <label>Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
        />

        <label>Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
        />

        <button type="submit" className="btn btn-primary full-width">
          Register
        </button>

        <p className="form-footer">
          Already have an account?{' '}
          <button type="button" className="link-btn" onClick={() => goTo('patientLogin')}>
            Login
          </button>
        </p>
      </form>
    </div>
  )
}

export default PatientRegister
