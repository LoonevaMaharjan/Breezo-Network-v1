import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts'
import { useMultiCityAQI } from '../../hooks/useAirQuality'
import { getActiveDeviceCityKeys } from '../../lib/tokenizationApi'
import { CITIES } from '../../lib/aqi'
import styles from './CityCompareChart.module.css'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className={styles.tooltip}>
      <div className={styles.ttCity}>{d.fullName}</div>
      <div className={styles.ttAqi} style={{ color: d.color }}>AQI {d.aqi}</div>
      <div className={styles.ttStatus} style={{ color: d.color }}>{d.status}</div>
    </div>
  )
}

export default function CityCompareChart() {
  const cityKeys = getActiveDeviceCityKeys()
  const cityData = useMultiCityAQI(cityKeys)

  const chartData = cityKeys.map((key) => {
    const d = cityData[key]
    return {
      city: CITIES[key].label.slice(0, 3).toUpperCase(),
      fullName: CITIES[key].label,
      aqi: d?.aqi ?? 0,
      color: d?.info?.color ?? '#475569',
      status: d?.info?.label ?? '—',
    }
  })

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Device City Comparison — Live AQI</h3>
        <span className={styles.badge}>{cityKeys.length} cities</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="city"
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'DM Mono' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.07)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'DM Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine
            y={100}
            stroke="rgba(252,211,77,0.35)"
            strokeDasharray="4 4"
            label={{ value: 'Moderate', fill: '#FCD34D', fontSize: 9, fontFamily: 'DM Mono', position: 'insideTopRight' }}
          />
          <ReferenceLine
            y={150}
            stroke="rgba(248,113,113,0.35)"
            strokeDasharray="4 4"
            label={{ value: 'Unhealthy', fill: '#F87171', fontSize: 9, fontFamily: 'DM Mono', position: 'insideTopRight' }}
          />
          <Bar dataKey="aqi" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
