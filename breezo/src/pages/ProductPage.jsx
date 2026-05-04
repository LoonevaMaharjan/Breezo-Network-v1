import { SectionLabel, SectionTitle, SectionSubtitle } from '../components/ui/UI'
import styles from './ProductPage.module.css'

const DEVICE_PRODUCTS = [
  {
    name: 'BREEZO Prototype Device',
    type: 'Prototype',
    image: '/device1.jpg',
    alt: 'BREEZO AQI device prototype',
    summary:
      'The early physical prototype used to validate the sensing stack, device enclosure direction, and field telemetry behavior.',
    specs: [
      ['Sensors', 'PM2.5, MQ135, DHT22'],
      ['Controller', 'ESP8266 prototype board'],
      ['Display', 'OLED local readout'],
      ['Stage', 'Field validation and enclosure testing'],
      ['Use case', 'Early AQI sensing and calibration trials'],
    ],
  },
  {
    name: 'BREEZO V1',
    type: 'Version 1 Device',
    image: '/device2.jpg',
    alt: 'BREEZO V1 Device',
    summary:
      'The refined device form intended for deployment, bringing the validated sensor stack into a cleaner and more production-ready package.',
    specs: [
      ['Sensors', 'PM2.5, MQ135, DHT22'],
      ['Controller', 'ESP8266 production controller'],
      ['Display', 'OLED live AQI screen'],
      ['Stage', 'Deployment-ready device direction'],
      ['Use case', 'Continuous live AQI monitoring'],
    ],
  },
]

const DEVICE_SPEC_ROWS = [
  { label: 'PM2.5 Range', value: '0-1000 ug/m3' },
  { label: 'MQ135 Gas Range', value: '10-1000 ppm' },
  { label: 'Temperature Range', value: '-40 to 80°C' },
  { label: 'Humidity Range', value: '0-100% RH' },
  { label: 'ESP8266 Connectivity', value: '2.4 GHz Wi-Fi (802.11 b/g/n)' },
  { label: 'OLED Display', value: '0.96" I2C, 128 × 64' },
  { label: 'Operating Voltage', value: '3.3V logic / 5V device input' },
]

const DASHBOARD_AUDIENCES = [
  {
    title: 'For Governments',
    copy:
      'AQI dashboards help governments identify pollution hotspots, guide policy, prioritize interventions, and create transparent public reporting for city air quality.',
    points: ['Ward-level pollution visibility', 'Evidence for policy action', 'Public health alerting'],
  },
  {
    title: 'For Business',
    copy:
      'Businesses need AQI visibility to protect workers, manage indoor-outdoor operations, assess site quality, and build trust through measurable environmental data.',
    points: ['Workplace safety insight', 'Location quality signals', 'ESG and reporting support'],
  },
  {
    title: 'For Individuals',
    copy:
      'Individuals need AQI data to decide when to go outside, use masks or purifiers, protect children and elders, and understand the real conditions around them.',
    points: ['Daily health decisions', 'Family protection', 'Hyperlocal air awareness'],
  },
]

const UPCOMING_ITEMS = [
  {
    title: 'Live node fleet expansion',
    detail: 'More deployed AQI devices across dense neighborhoods, institutions, and public roads.',
  },
  // {
  //   title: 'Government-grade reporting views',
  //   detail: 'Policy-oriented dashboards with trends, hotspot comparison, and intervention visibility.',
  // },
  // {
  //   title: 'Business environment modules',
  //   detail: 'Operational AQI reporting for campuses, offices, and facilities monitoring.',
  // },
  {
    title: 'AI 7 days AQI prediction',
    detail: 'Short-term AQI forecasting to help users anticipate and plan for air quality changes in their area.',
  },
]

function DevicePhoto({ src, alt, label }) {
  return (
    <div className={styles.deviceVisual}>
      <img className={styles.deviceImage} src={src} alt={alt} />
      <div className={styles.deviceLabel}>{label}</div>
    </div>
  )
}

export default function ProductPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <SectionLabel>Product</SectionLabel>
          <h1 className={styles.heroTitle}>Devices, dashboards, and the next layer of clean-air infrastructure.</h1>
          <p className={styles.heroDesc}>
            BREEZO combines AQI sensing devices, actionable dashboard intelligence, and an upcoming
            operator ecosystem into one environmental product stack.
          </p>
        </div>

        <nav className={styles.sectionNav} aria-label="Product sections">
          <a href="#devices" className={styles.sectionLink}>Devices</a>
          <a href="#dashboard" className={styles.sectionLink}>Dashboard</a>
          <a href="#upcoming" className={styles.sectionLink}>Upcoming</a>
        </nav>
      </section>

      <section id="devices" className={styles.section}>
        <SectionLabel>Devices</SectionLabel>
        <SectionTitle>AQI devices built for real deployment.</SectionTitle>
        <SectionSubtitle>
          BREEZO devices are designed around practical air quality sensing, reliable telemetry, and
          city-scale deployment needs.
        </SectionSubtitle>

        <div className={styles.deviceGrid}>
          {DEVICE_PRODUCTS.map((device) => (
            <article key={device.name} className={styles.deviceCard}>
              <DevicePhoto src={device.image} alt={device.alt} label={device.type} />
              <div className={styles.deviceInfo}>
                <div className={styles.deviceType}>{device.type}</div>
                <h3 className={styles.deviceName}>{device.name}</h3>
                <p className={styles.deviceSummary}>{device.summary}</p>
                <div className={styles.specList}>
                  {device.specs.map(([label, value]) => (
                    <div className={styles.specItem} key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.techPanel}>
          <div className={styles.techIntro}>
            <div className={styles.miniLabel}>Technical Specifications</div>
            <h3 className={styles.panelTitle}>Core hardware stack</h3>
            <p className={styles.techCopy}>
              The BREEZO device stack is designed around a practical low-cost air sensing setup that
              can capture particulate conditions, supporting gas trends, ambient environment data, and
              a live local display in one deployable unit.
            </p>
          </div>
          <div className={styles.techSpecSheet}>
            {DEVICE_SPEC_ROWS.map((row) => (
              <div className={styles.techSpecRow} key={row.label}>
                <span className={styles.techSpecLabel}>{row.label}</span>
                <strong className={styles.techSpecValue}>{row.value}</strong>
              </div>
            ))}
          </div>
          {/* <div className={styles.dataNeedCard}>
            <div className={styles.miniLabel}>AQI Data Requirement</div>
            <h3 className={styles.dataNeedTitle}>What data is required to show AQI?</h3>
            <p className={styles.dataNeedCopy}>
              To display AQI, the essential required reading is the PM2.5 value. With one valid PM2.5
              measurement from the sensor, BREEZO can calculate and show the AQI level. DHT22 and MQ135
              readings are not required for the AQI formula itself, but they help add environmental
              context and richer dashboard insights around the AQI reading.
            </p>
          </div> */}
        </div>
      </section>

      <section id="dashboard" className={`${styles.section} ${styles.altSection}`}>
        <SectionLabel>Dashboard</SectionLabel>
        <SectionTitle>Why AQI matters across every decision layer.</SectionTitle>
        <SectionSubtitle>
          AQI is not just a reading. It is a decision signal for governments, businesses, and
          individuals who need to act on air quality in real time.
        </SectionSubtitle>

        <div className={styles.audienceGrid}>
          {DASHBOARD_AUDIENCES.map((audience) => (
            <article className={styles.audienceCard} key={audience.title}>
              <div className={styles.audienceTitle}>{audience.title}</div>
              <p className={styles.audienceCopy}>{audience.copy}</p>
              <div className={styles.audiencePoints}>
                {audience.points.map((point) => (
                  <span key={point} className={styles.pointTag}>{point}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="upcoming" className={styles.section}>
        <SectionLabel>Upcoming</SectionLabel>
        <SectionTitle>What’s coming next in BREEZO.</SectionTitle>
        <SectionSubtitle>
          The next stage expands the device network, deepens AQI intelligence, and prepares the
          operator ecosystem for broader adoption.
        </SectionSubtitle>

        <div className={styles.upcomingList}>
          {UPCOMING_ITEMS.map((item, index) => (
            <article className={styles.upcomingCard} key={item.title}>
              <div className={styles.upcomingIndex}>{String(index + 1).padStart(2, '0')}</div>
              <div>
                <h3 className={styles.upcomingTitle}>{item.title}</h3>
                <p className={styles.upcomingDetail}>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
