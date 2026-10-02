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

function FindHospital({ goTo, hospitals }) {
  const [location, setLocation] = useState(null)
  const [sortedHospitals, setSortedHospitals] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleFindHospitals() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setLoading(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocation(loc)

        const sorted = hospitals
          .map((h) => ({ ...h, distanceKm: getDistanceKm(loc.lat, loc.lng, h.lat, h.lng) }))
          .sort((a, b) => a.distanceKm - b.distanceKm)

        setSortedHospitals(sorted)
        setLoading(false)
      },
      (err) => {
        setError(
          err.code === 1
            ? 'Location permission denied. Please allow location access and try again.'
            : 'Could not fetch your location. Please try again.'
        )
        setLoading(false)
      }
    )
  }

  return (
    <div className="page">
      <h2>Find Nearest Hospital</h2>
      <p className="muted">
        We use your device's current location to sort hospitals by distance.
      </p>

      <button className="btn btn-primary" onClick={handleFindHospitals} disabled={loading}>
        {loading ? 'Locating…' : 'Use My Current Location'}
      </button>

      {error && <p className="error-text">{error}</p>}

      {location && (
        <p className="muted small">
          Your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}

      {sortedHospitals.length > 0 && (
        <div className="hospital-list">
          {sortedHospitals.map((h) => (
            <div className="card hospital-card" key={h.id}>
              <div className="hospital-card-header">
                <h3>{h.name}</h3>
                <span className={h.availableBeds > 0 ? 'badge badge-green' : 'badge badge-red'}>
                  {h.availableBeds > 0 ? `${h.availableBeds} beds free` : 'Full'}
                </span>
              </div>
              <p>{h.address}</p>
              <p className="muted small">
                {h.distanceKm.toFixed(1)} km away · {h.phone}
              </p>
            </div>
          ))}
        </div>
      )}

      <button className="link-btn" onClick={() => goTo('home')}>
        ← Back to Home
      </button>
    </div>
  )
}

export default FindHospital
