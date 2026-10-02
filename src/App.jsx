import { useState, useEffect } from 'react'
import { api } from './api'

import Navbar from './components/Navbar'
import Home from './components/Home'
import PatientRegister from './components/PatientRegister'
import PatientLogin from './components/PatientLogin'
import PatientDashboard from './components/PatientDashboard'
import PersonalInfo from './components/PersonalInfo'
import MedicalInfo from './components/MedicalInfo'
import EmergencyRequest from './components/EmergencyRequest'
import FindHospital from './components/FindHospital'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import ManagePatients from './components/ManagePatients'
import ManageHospitals from './components/ManageHospitals'
import AdminRequests from './components/AdminRequests'

function withId(doc) {
  if (!doc) return doc
  return { ...doc, id: doc._id }
}

function App() {
  const [page, setPage] = useState('home')

  const [patients, setPatients] = useState([])

  const [currentPatient, setCurrentPatient] = useState(null)
  const [patientToken, setPatientToken] = useState(null)

  const [isAdmin, setIsAdmin] = useState(false)
  const [adminToken, setAdminToken] = useState(null)

  const [hospitals, setHospitals] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const savedPatientAuth = localStorage.getItem('patientAuth')
    if (savedPatientAuth) {
      try {
        const { token, patient } = JSON.parse(savedPatientAuth)
        setPatientToken(token)
        setCurrentPatient(patient)
      } catch (err) {
        localStorage.removeItem('patientAuth')
      }
    }

    const savedAdminToken = localStorage.getItem('adminToken')
    if (savedAdminToken) {
      setAdminToken(savedAdminToken)
      setIsAdmin(true)
    }

    loadHospitals()
  }, [])

  useEffect(() => {
    if (isAdmin && adminToken) {
      loadPatients()
      loadRequests()
    }
  }, [isAdmin, adminToken])

  async function loadHospitals() {
    const result = await api.fetchHospitals()
    if (result.success) {
      setHospitals(result.hospitals.map(withId))
    }
  }

  async function loadPatients() {
    const result = await api.fetchPatients(adminToken)
    if (result.success) {
      setPatients(result.patients)
    }
  }

  async function loadRequests() {
    const result = await api.fetchRequests(adminToken)
    if (result.success) {
      setRequests(result.requests.map(withId))
    }
  }

  function goTo(pageName) {
    setPage(pageName)
  }

  async function registerPatient(newPatient) {
    return api.registerPatient(newPatient)
  }

  async function loginPatient(email, password) {
    const result = await api.loginPatient(email, password)

    if (result.success) {
      setPatientToken(result.token)
      setCurrentPatient(result.patient)
      localStorage.setItem(
        'patientAuth',
        JSON.stringify({ token: result.token, patient: result.patient })
      )
    }

    return result
  }

  function logoutPatient() {
    setCurrentPatient(null)
    setPatientToken(null)
    localStorage.removeItem('patientAuth')
    goTo('home')
  }

  async function updateCurrentPatient(updates) {
    if (!currentPatient) {
      return { success: false, message: 'You need to log in first.' }
    }

    const result = await api.updatePatient(currentPatient.id, updates, patientToken)

    if (result.success) {
      setCurrentPatient(result.patient)
      localStorage.setItem(
        'patientAuth',
        JSON.stringify({ token: patientToken, patient: result.patient })
      )
    }

    return result
  }

  async function deletePatient(id) {
    const result = await api.deletePatient(id, adminToken)

    if (result.success) {
      setPatients(patients.filter((p) => p.id !== id))
    }

    return result
  }

  async function loginAdmin(username, password) {
    const result = await api.loginAdmin(username, password)

    if (result.success) {
      setIsAdmin(true)
      setAdminToken(result.token)
      localStorage.setItem('adminToken', result.token)
    }

    return result
  }

  function logoutAdmin() {
    setIsAdmin(false)
    setAdminToken(null)
    setPatients([])
    setRequests([])
    localStorage.removeItem('adminToken')
    goTo('home')
  }

  async function updateHospitalBeds(id, availableBeds) {
    const result = await api.updateHospitalBeds(id, availableBeds, adminToken)

    if (result.success) {
      const updatedHospital = withId(result.hospital)
      setHospitals(hospitals.map((h) => (h.id === id ? updatedHospital : h)))
    }

    return result
  }

  async function addRequest(newRequest) {
    const result = await api.createRequest(newRequest)

    if (result.success) {
      const request = withId(result.request)
      setRequests([request, ...requests])
      return request
    }

    return null
  }

  async function resolveRequest(id) {
    const result = await api.resolveRequest(id, adminToken)

    if (result.success) {
      setRequests(requests.map((r) => (r.id === id ? withId(result.request) : r)))
    }

    return result
  }

  let pendingCount = 0
  for (let i = 0; i < requests.length; i++) {
    if (requests[i].status === 'Pending') {
      pendingCount = pendingCount + 1
    }
  }

  function renderPage() {
    if (page === 'home') {
      return <Home goTo={goTo} />
    }

    if (page === 'patientRegister') {
      return <PatientRegister goTo={goTo} registerPatient={registerPatient} />
    }

    if (page === 'patientLogin') {
      return <PatientLogin goTo={goTo} loginPatient={loginPatient} />
    }

    if (page === 'patientDashboard') {
      return <PatientDashboard goTo={goTo} patient={currentPatient} />
    }

    if (page === 'personalInfo') {
      return (
        <PersonalInfo
          goTo={goTo}
          patient={currentPatient}
          updateCurrentPatient={updateCurrentPatient}
        />
      )
    }

    if (page === 'medicalInfo') {
      return (
        <MedicalInfo
          goTo={goTo}
          patient={currentPatient}
          updateCurrentPatient={updateCurrentPatient}
        />
      )
    }

    if (page === 'emergencyRequest') {
      return (
        <EmergencyRequest
          goTo={goTo}
          patient={currentPatient}
          hospitals={hospitals}
          addRequest={addRequest}
        />
      )
    }

    if (page === 'findHospital') {
      return <FindHospital goTo={goTo} hospitals={hospitals} />
    }

    if (page === 'adminLogin') {
      return <AdminLogin goTo={goTo} loginAdmin={loginAdmin} />
    }

    if (page === 'adminDashboard') {
      return (
        <AdminDashboard
          goTo={goTo}
          patientCount={patients.length}
          pendingCount={pendingCount}
        />
      )
    }

    if (page === 'managePatients') {
      return <ManagePatients goTo={goTo} patients={patients} deletePatient={deletePatient} />
    }

    if (page === 'manageHospitals') {
      return (
        <ManageHospitals
          goTo={goTo}
          hospitals={hospitals}
          updateHospitalBeds={updateHospitalBeds}
        />
      )
    }

    if (page === 'adminRequests') {
      return <AdminRequests goTo={goTo} requests={requests} resolveRequest={resolveRequest} />
    }

    return <Home goTo={goTo} />
  }

  return (
    <>
      <Navbar
        goTo={goTo}
        patient={currentPatient}
        isAdmin={isAdmin}
        logoutPatient={logoutPatient}
        logoutAdmin={logoutAdmin}
      />
      <main>{renderPage()}</main>
    </>
  )
}

export default App
