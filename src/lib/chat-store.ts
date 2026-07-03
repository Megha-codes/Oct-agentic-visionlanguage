// Client-side chat history persisted in localStorage. No backend/hardcoded data.
// Image data URLs are intentionally NOT persisted (they'd blow the ~5MB quota);
// only a `hasImage` flag is kept.

export interface StoredMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: string // ISO
  hasImage?: boolean
  findings?: unknown[]
  disclaimer?: string
}

export interface ChatSession {
  id: string
  title: string
  createdAt: string // ISO
  updatedAt: string // ISO
  isStarred: boolean
  messages: StoredMessage[]
}

const KEY = 'octina.chats.v1'

const isBrowser = () => typeof window !== 'undefined'

export function newId(): string {
  if (isBrowser() && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function loadSessions(): ChatSession[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as ChatSession[]) : []
  } catch {
    return []
  }
}

export function saveSessions(sessions: ChatSession[]): void {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(sessions))
  } catch {
    // quota exceeded or serialization error — fail silently, history is non-critical
  }
}

/** Insert or replace a session, keeping the list ordered by most recently updated. */
export function upsertSession(sessions: ChatSession[], session: ChatSession): ChatSession[] {
  const rest = sessions.filter((s) => s.id !== session.id)
  return [session, ...rest].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function deleteSession(sessions: ChatSession[], id: string): ChatSession[] {
  return sessions.filter((s) => s.id !== id)
}

export function toggleStar(sessions: ChatSession[], id: string): ChatSession[] {
  return sessions.map((s) => (s.id === id ? { ...s, isStarred: !s.isStarred } : s))
}

/** Derive a readable title from the first user message. */
export function deriveTitle(firstUserText: string | undefined): string {
  const t = (firstUserText || '').trim().replace(/\s+/g, ' ')
  if (!t) return 'New chat'
  return t.length > 40 ? `${t.slice(0, 40)}…` : t
}
