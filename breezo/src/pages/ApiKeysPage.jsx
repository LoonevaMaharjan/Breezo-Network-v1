import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { readTokenSession, TOKEN_SESSION_EVENT, TOKEN_SESSION_KEY } from '../lib/tokenization'
import {
  createOperatorApiKey,
  deleteOperatorApiKey,
  getApiKeyDashboard,
} from '../lib/tokenizationApi'
import styles from './ApiKeysPage.module.css'

function formatDate(value) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatToken(value) {
  return Number(value || 0).toFixed(3)
}

export default function ApiKeysPage() {
  const [session, setSession] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [flash, setFlash] = useState('')
  const [error, setError] = useState('')
  const [generatedKey, setGeneratedKey] = useState('')
  const [form, setForm] = useState({
    name: '',
    limit: '1000',
  })

  useEffect(() => {
    const sync = async () => {
      const stored = readTokenSession()
      setSession(stored)

      if (!stored) {
        setDashboard(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const next = await getApiKeyDashboard(stored)
        setDashboard(next)
      } catch {
        setDashboard(null)
      } finally {
        setLoading(false)
      }
    }

    const onSessionChange = (event) => {
      const next = event.detail ?? null
      setSession(next)
      if (!next) {
        setDashboard(null)
        setLoading(false)
        return
      }
      void sync()
    }

    const onStorage = (event) => {
      if (event.key === null || event.key === TOKEN_SESSION_KEY) {
        void sync()
      }
    }

    void sync()
    window.addEventListener(TOKEN_SESSION_EVENT, onSessionChange)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(TOKEN_SESSION_EVENT, onSessionChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  useEffect(() => {
    if (!copied) return undefined
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  const keys = dashboard?.apiKeys ?? []
  const usageSummary = dashboard?.usageSummary

  const workingFlow = useMemo(
    () => [
      'User logs in and opens the API Key page.',
      'User sees account details, token balance, and staked tokens.',
      'User creates an API key by entering a key name and usage limit.',
      'System generates a key and shows it once.',
      'Each request checks key validity, usage limit, balance, and minimum stake before processing.',
      'Usage rises and token cost is deducted at 0.001 token per request.',
    ],
    []
  )

  if (!loading && !session) {
    return <Navigate to="/login?redirect=%2Fapi-keys" replace />
  }

  async function refreshDashboard() {
    if (!session) return
    const next = await getApiKeyDashboard(session)
    setDashboard(next)
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleCreateKey(event) {
    event.preventDefault()
    if (!session) return

    setError('')
    setFlash('')

    try {
      setSubmitting(true)
      const result = await createOperatorApiKey(session, form)
      setGeneratedKey(result.generatedKey)
      setDashboard(result.dashboard)
      setForm({ name: '', limit: '1000' })
      setFlash('API key created. Copy it now because it is only shown once.')
    } catch (err) {
      setError(err.message || 'Failed to create API key.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCopyKey() {
    if (!generatedKey) return
    await navigator.clipboard.writeText(generatedKey)
    setCopied(true)
  }

  async function handleDeleteKey(keyId) {
    if (!session) return
    setError('')
    setFlash('')
    const next = await deleteOperatorApiKey(session, keyId)
    setDashboard(next)
    setFlash('API key deleted.')
    if (generatedKey) {
      setGeneratedKey('')
    }
  }

  if (loading || !dashboard) {
    return (
      <div className={styles.page}>
        <section className={styles.loadingCard}>
          <div className={styles.kicker}>API key management</div>
          <h1 className={styles.title}>Loading your API controls...</h1>
        </section>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <section className={styles.consoleShell}>
        <header className={styles.consoleHeader}>
          <div className={styles.consoleBar}>
            <span className={styles.consoleDotRed} />
            <span className={styles.consoleDotAmber} />
            <span className={styles.consoleDotGreen} />
            <span className={styles.consolePath}>breezo / developer / api-keys</span>
          </div>
          <div className={styles.heroRow}>
            <div>
              <div className={styles.kicker}>API key management</div>
              <h1 className={styles.title}>Issue access keys and meter every request.</h1>
              <p className={styles.subtitle}>
                Generate usage-limited API keys, inspect token-backed request economics, and control
                active integrations from a dedicated developer console.
              </p>
            </div>
            <div className={styles.summaryInline}>
              <div className={styles.summaryInlineItem}>
                <span>Total Requests</span>
                <strong>{usageSummary.totalRequests.toLocaleString('en-US')}</strong>
              </div>
              <div className={styles.summaryInlineItem}>
                <span>Total Cost</span>
                <strong>{formatToken(usageSummary.totalCost)} TOK</strong>
              </div>
              <div className={styles.summaryInlineItem}>
                <span>Cost / Request</span>
                <strong>{formatToken(usageSummary.costPerRequest)}</strong>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.accountStrip}>
          <article className={styles.accountItem}>
            <span>User Email</span>
            <strong>{dashboard.owner.email}</strong>
            <small>Primary operator identity for API access.</small>
          </article>
          <article className={styles.accountItem}>
            <span>Token Balance</span>
            <strong>{formatToken(dashboard.tokenBalance)} BREEZO</strong>
            <small>Used to cover metered API request costs.</small>
          </article>
          <article className={styles.accountItem}>
            <span>Staked Tokens</span>
            <strong>{formatToken(dashboard.stakedTokens)} BREEZO</strong>
            <small>Minimum stake signal for key-backed access.</small>
          </article>
        </section>

        <section className={styles.workspace}>
          <article className={styles.createPanel}>
            <div className={styles.cardLabel}>Create API key</div>
            <div className={styles.createTitle}>Provision a new access credential</div>
            <p className={styles.createNote}>
              Keys are shown exactly once after generation. Save them before leaving this screen.
            </p>
            <form className={styles.form} onSubmit={handleCreateKey}>
              <label className={styles.field}>
                <span>Key Name</span>
                <input
                  className={styles.input}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Production analytics key"
                  autoComplete="off"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Usage Limit</span>
                <input
                  className={styles.input}
                  type="number"
                  min="1"
                  step="1"
                  name="limit"
                  value={form.limit}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </label>

              {error && <div className={styles.errorBox}>{error}</div>}
              {flash && <div className={styles.flashBox}>{flash}</div>}

              <button className={styles.primaryBtn} type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create API Key'}
              </button>
            </form>

            {generatedKey && (
              <div className={styles.generatedCard}>
                <div className={styles.generatedLabel}>Generated API Key</div>
                <code className={styles.generatedKey}>{generatedKey}</code>
                <button className={styles.secondaryBtn} type="button" onClick={handleCopyKey}>
                  {copied ? 'Copied' : 'Copy API Key'}
                </button>
              </div>
            )}
          </article>

          <article className={styles.keysPanel}>
            <div className={styles.panelHeader}>
              <div>
                <div className={styles.cardLabel}>API keys list</div>
                <div className={styles.panelTitle}>Manage issued keys</div>
              </div>
            </div>

            {keys.length === 0 ? (
              <div className={styles.emptyState}>
                <strong>No API keys yet.</strong>
                <p>Create your first key to start protected API access for your integrations.</p>
              </div>
            ) : (
              <div className={styles.keysTable}>
                <div className={styles.tableHead}>
                  <span>Key Name</span>
                  <span>API Key</span>
                  <span>Created Date</span>
                  <span>Usage</span>
                  <span>Limit</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>

                {keys.map((key) => (
                  <div className={styles.tableRow} key={key.id}>
                    <span>{key.name}</span>
                    <code className={styles.maskedKey}>{key.maskedKey}</code>
                    <span>{formatDate(key.createdAt)}</span>
                    <span>{key.usage.toLocaleString('en-US')}</span>
                    <span>{key.limit.toLocaleString('en-US')}</span>
                    <span className={key.status === 'active' ? styles.statusActive : styles.statusRevoked}>
                      {key.status}
                    </span>
                    <button className={styles.deleteBtn} type="button" onClick={() => handleDeleteKey(key.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        <article className={styles.flowPanel}>
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.cardLabel}>Working flow</div>
              <div className={styles.panelTitle}>How the API key system behaves</div>
            </div>
          </div>

          <div className={styles.flowList}>
            {workingFlow.map((step, index) => (
              <div className={styles.flowItem} key={step}>
                <span className={styles.flowIndex}>{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
