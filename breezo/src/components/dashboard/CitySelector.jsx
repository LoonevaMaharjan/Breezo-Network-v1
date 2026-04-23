import { CITIES } from '../../lib/aqi'
import { getActiveDeviceCityKeys } from '../../lib/tokenizationApi'
import styles from './CitySelector.module.css'

export default function CitySelector({ activeCity, onChange }) {
  const displayCities = getActiveDeviceCityKeys()

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Device City</span>
      <div className={styles.pills}>
        {displayCities.map((key) => (
          <button
            key={key}
            className={`${styles.pill} ${activeCity === key ? styles.active : ''}`}
            onClick={() => onChange(key)}
          >
            {CITIES[key].label}
          </button>
        ))}
      </div>
    </div>
  )
}
