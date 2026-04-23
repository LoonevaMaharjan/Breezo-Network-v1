import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CITIES } from '../../lib/aqi'
import { buildDeviceAirSnapshot, getActiveDeviceCityKeys, getDeviceDemo } from '../../lib/deviceDemo'
import styles from './LiveMap.module.css'

const DEFAULT_CENTER = [27.7172, 85.324]

function getMarkerColor(aqi) {
  if (aqi <= 50) return '#4ADE80'
  if (aqi <= 100) return '#FCD34D'
  if (aqi <= 150) return '#FB923C'
  if (aqi <= 200) return '#F87171'
  if (aqi <= 300) return '#E879F9'
  return '#EF4444'
}

function createMarkerIcon(color, isActive) {
  const size = isActive ? 22 : 18
  const halo = isActive ? 10 : 6

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        border-radius:999px;
        background:${color};
        border:3px solid rgba(7,8,10,0.96);
        box-shadow:0 0 0 ${halo}px ${color}22, 0 10px 22px rgba(0,0,0,0.36);
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

export default function LiveMap({ activeCity }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const resizeObserverRef = useRef(null)
  const [mapError, setMapError] = useState('')
  const [mapReady, setMapReady] = useState(false)

  const devices = useMemo(() => {
    return getActiveDeviceCityKeys().map((cityKey) => {
      const city = CITIES[cityKey]
      const telemetry = getDeviceDemo(cityKey, city)
      const snapshot = buildDeviceAirSnapshot(cityKey)

      return {
        cityKey,
        cityLabel: city.label,
        coords: [telemetry.gps?.lat ?? city.lat, telemetry.gps?.lon ?? city.lon],
        aqi: snapshot.aqi,
        status: snapshot.info.label,
        color: getMarkerColor(snapshot.aqi),
      }
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    try {
      if (containerRef.current.offsetHeight === 0) {
        setMapError('Map container height is zero.')
        return
      }

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        boxZoom: true,
        keyboard: true,
      })

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)
      map.whenReady(() => {
        setMapReady(true)
      })
      mapRef.current = map

      resizeObserverRef.current = new ResizeObserver(() => {
        map.invalidateSize()
      })
      resizeObserverRef.current.observe(containerRef.current)

      requestAnimationFrame(() => map.invalidateSize())
      window.setTimeout(() => map.invalidateSize(), 120)
      window.setTimeout(() => map.invalidateSize(), 420)

      setMapError('')
      setMapReady(true)
    } catch (error) {
      setMapError(error.message || 'Unable to initialize map.')
      setMapReady(false)
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    try {
      map.invalidateSize()

      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []

      devices.forEach((device) => {
        const marker = L.marker(device.coords, {
          icon: createMarkerIcon(device.color, device.cityKey === activeCity),
        })

        marker.bindPopup(
          `<div class="breezo-popup">
            <div class="breezo-popup__city">${device.cityLabel}</div>
            <div class="breezo-popup__aqi">AQI ${device.aqi}</div>
          </div>`,
          { closeButton: false, offset: [0, -8] }
        )

        marker.addTo(map)
        markersRef.current.push(marker)
      })

      if (devices.length === 1) {
        map.setView(devices[0].coords, 11)
      } else if (devices.length > 1) {
        map.fitBounds(L.latLngBounds(devices.map((d) => d.coords)), {
          padding: [28, 28],
        })
      } else {
        map.setView(DEFAULT_CENTER, 9)
      }

      requestAnimationFrame(() => map.invalidateSize())
      window.setTimeout(() => map.invalidateSize(), 180)
    } catch (error) {
      setMapError(error.message || 'Unable to load map data.')
      setMapReady(false)
    }
  }, [activeCity, devices])

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      resizeObserverRef.current?.disconnect()
      resizeObserverRef.current = null
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <div className={styles.kicker}>Device network map</div>
          <h3 className={styles.title}>Live AQI device locations</h3>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}><i style={{ background: '#4ADE80' }} />Clean</span>
          <span className={styles.legendItem}><i style={{ background: '#FCD34D' }} />Moderate</span>
          <span className={styles.legendItem}><i style={{ background: '#EF4444' }} />Polluted</span>
        </div>
      </div>

      {mapError && (
        <div className={styles.errorState}>
          <div className={styles.errorTitle}>Leaflet map unavailable</div>
          <div className={styles.errorText}>{mapError}</div>
        </div>
      )}

      <div className={styles.mapShell}>
        <div
          ref={containerRef}
          className={styles.mapFrame}
          style={{ minHeight: '420px', height: '420px', width: '100%' }}
        />
        {!mapReady && !mapError && (
          <div className={styles.loadingState}>
            <div className={styles.loadingTitle}>Loading map...</div>
            <div className={styles.loadingText}>Preparing the Leaflet device view.</div>
          </div>
        )}
      </div>
    </section>
  )
}
