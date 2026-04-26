import LiveMap from '../components/dashboard/LiveMap'
import styles from './MapPage.module.css'

export default function MapPage() {
  return (
    <div className={styles.page}>
      <section className={styles.workspace}>
        <LiveMap mode="page" />
      </section>
    </div>
  )
}
