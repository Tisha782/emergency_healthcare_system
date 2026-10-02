// Thin wrapper around fetch for talking to the Express + MongoDB backend.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    })
  } catch (err) {
    return { success: false, message: 'Could not reach the server. Is the backend running?' }
  }

  let data = null
  try {
    data = await res.json()
  } catch (err) {
    data = null
  }

  if (!res.ok) {
    return { success: false, message: data?.message || 'Something went wrong. Please try again.' }
  }

  return data
}

export const api = {
  registerPatient: (payload) =>
    request('/patients/register', { method: 'POST', body: JSON.stringify(payload) }),

  loginPatient: (email, password) =>
    request('/patients/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  fetchPatients: (adminToken) => request('/patients', { headers: authHeader(adminToken) }),

  updatePatient: (id, updates, patientToken) =>
    request(`/patients/${id}`, {
      method: 'PUT',
      headers: authHeader(patientToken),
      body: JSON.stringify(updates),
    }),

  deletePatient: (id, adminToken) =>
    request(`/patients/${id}`, { method: 'DELETE', headers: authHeader(adminToken) }),

  loginAdmin: (username, password) =>
    request('/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  fetchHospitals: () => request('/hospitals'),

  updateHospitalBeds: (id, availableBeds, adminToken) =>
    request(`/hospitals/${id}`, {
      method: 'PUT',
      headers: authHeader(adminToken),
      body: JSON.stringify({ availableBeds }),
    }),

  createRequest: (payload) => request('/requests', { method: 'POST', body: JSON.stringify(payload) }),

  fetchRequests: (adminToken) => request('/requests', { headers: authHeader(adminToken) }),

  resolveRequest: (id, adminToken) =>
    request(`/requests/${id}/resolve`, { method: 'PUT', headers: authHeader(adminToken) }),
}
