export const WAITLIST_STORAGE_KEY = 'breezo-waitlist-signups'

const DEFAULT_WAITLIST = [
  { name: 'Aayush', email: 'aayush@example.com', location: 'Kathmandu', role: 'Operator' },
  { name: 'Sita', email: 'sita@example.com', location: 'Pokhara', role: 'Researcher' },
  { name: 'Rakesh', email: 'rakesh@example.com', location: 'Delhi', role: 'Community lead' },
  { name: 'Nima', email: 'nima@example.com', location: 'Lalitpur', role: 'Policy partner' },
  { name: 'Ishita', email: 'ishita@example.com', location: 'Bhaktapur', role: 'Volunteer' },
  { name: 'Kabir', email: 'kabir@example.com', location: 'Noida', role: 'Operator' },
  { name: 'Tsering', email: 'tsering@example.com', location: 'Pokhara', role: 'NGO partner' },
  { name: 'Mina', email: 'mina@example.com', location: 'Biratnagar', role: 'School network' },
  { name: 'Ujjwal', email: 'ujjwal@example.com', location: 'Kathmandu', role: 'Developer' },
  { name: 'Anushka', email: 'anushka@example.com', location: 'Delhi', role: 'Climate advocate' },
  { name: 'Rohit', email: 'rohit@example.com', location: 'Janakpur', role: 'Operator' },
  { name: 'Pema', email: 'pema@example.com', location: 'Thimphu', role: 'Observer' },
]

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function readWaitlist() {
  if (typeof window === 'undefined') return clone(DEFAULT_WAITLIST)

  try {
    const raw = window.localStorage.getItem(WAITLIST_STORAGE_KEY)
    if (!raw) {
      const seeded = clone(DEFAULT_WAITLIST)
      window.localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }

    return JSON.parse(raw)
  } catch {
    return clone(DEFAULT_WAITLIST)
  }
}

export function getWaitlistEntries() {
  return readWaitlist()
}

export function getWaitlistCount() {
  return readWaitlist().length
}

export function addWaitlistEntry(entry) {
  const current = readWaitlist()
  const next = [
    {
      ...entry,
      createdAt: new Date().toISOString(),
    },
    ...current,
  ]

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(next))
  }

  return next
}
