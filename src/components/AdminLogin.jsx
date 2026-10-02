import { useState } from 'react'

function AdminLogin({ goTo, loginAdmin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const result = await loginAdmin(username, password)

    if (!result.success) {
      setError(result.message)
      return
    }

    goTo('adminDashboard')
  }

  return (
    <div className="page form-page">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        {error && <p className="error-text">{error}</p>}

        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="admin123"
        />

        <button type="submit" className="btn btn-primary full-width">
          Login
        </button>

        <p className="muted small">Demo credentials: admin / admin123</p>
      </form>
    </div>
  )
}

export default AdminLogin
