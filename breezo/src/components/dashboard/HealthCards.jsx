import styles from './HealthCards.module.css'

const CARD_META = [
  { key: 'outdoor', title: 'Outdoor Activity' },
  { key: 'mask', title: 'Mask Usage' },
  { key: 'indoor', title: 'Stay Indoors' },
  { key: 'purifier', title: 'Air Purifier' },
]

export default function HealthCards({ data }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>Health Recommendations</div>
      <div className={styles.grid}>
        {CARD_META.map((card) => (
          <div className={`${styles.card} ${styles[card.key]}`} key={card.key}>
            <div className={styles.title}>{card.title}</div>
            <div className={styles.desc}>
              {data?.info?.recommendations?.[card.key] ?? 'Loading...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
