import { useState } from 'react'

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const R = 6371

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function EmergencyRequest({ goTo, patient, hospitals, addRequest }) {
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [nearestHospital, setNearestHospital] = useState(null)

  function handleGetLocation() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }

    setLoadingLocation(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoadingLocation(false)
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? 'Location permission denied. Please allow location access and try again.'
            : 'Could not fetch your location. Please try again.'
        )
        setLoadingLocation(false)
      }
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!location) {
      setLocationError('Please share your location before sending the request.')
      return
    }

    const sorted = hospitals
      .map((h) => ({ ...h, distanceKm: getDistanceKm(location.lat, location.lng, h.lat, h.lng) }))
      .sort((a, b) => a.distanceKm - b.distanceKm)

    const best = sorted.find((h) => h.availableBeds > 0) || sorted[0]

    const result = await addRequest({
      patientId: patient?.id || null,
      patientName: patient?.name || 'Guest',
      notes,
      location,
      hospitalId: best.id,
      nearestHospital: best.name,
    })

    if (!result) {
      setLocationError('Could not send the request. Please try again.')
      return
    }

    setNearestHospital(best)
  }

  if (nearestHospital) {
    return (
      <div className="page">
        <div className="card alert-card">
          <h2>🚨 Emergency Request Sent</h2>
          <p>Based on your location, the nearest hospital with an available bed is:</p>

          <div className="hospital-highlight">
            <h3>{nearestHospital.name}</h3>
            <p>{nearestHospital.address}</p>
            <p>{nearestHospital.distanceKm.toFixed(1)} km away</p>
            <p>Available beds: {nearestHospital.availableBeds}</p>
            <p>Phone: {nearestHospital.phone}</p>
          </div>

          <button className="btn btn-primary" onClick={() => goTo('findHospital')}>
            View All Nearby Hospitals
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page form-page">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>🚨 Emergency Request</h2>
        <p className="muted">
          Share your current location so we can find the nearest hospital with an
          available bed.
        </p>

        <button
          type="button"
          className="btn btn-outline full-width"
          onClick={handleGetLocation}
          disabled={loadingLocation}
        >
          {loadingLocation
            ? 'Getting your location…'
            : location
            ? 'Location Captured ✓'
            : 'Use My Current Location'}
        </button>

        {location && (
          <p className="muted small">
            Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
          </p>
        )}
        {locationError && <p className="error-text">{locationError}</p>}

        <label>Describe the emergency (optional)</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Chest pain, accident, difficulty breathing…"
        />

        <button type="submit" className="btn btn-danger full-width">
          Send Emergency Request
        </button>

        <button type="button" className="link-btn" onClick={() => goTo('patientDashboard')}>
          ← Back to Dashboard
        </button>
      </form>
    </div>
  )
}

export default EmergencyRequest
