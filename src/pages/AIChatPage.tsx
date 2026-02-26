import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Send, User, Key, Loader2, Trash2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const OPENAI_KEY_STORAGE = 'tripplanner_openai_key'

function getStoredKey(): string {
  return localStorage.getItem(OPENAI_KEY_STORAGE) ?? ''
}

async function chatWithOpenAI(
  apiKey: string,
  messages: Message[],
  systemPrompt: string
): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `Error ${res.status}`)
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[]
  }
  return data.choices[0].message.content
}

export function AIChatPage() {
  const { id: tripId } = useParams<{ id: string }>()
  const trips = useStore((s) => s.trips)
  const trip = trips.find((t) => t.id === tripId)

  const [apiKey, setApiKey] = useState(getStoredKey)
  const [keyInput, setKeyInput] = useState('')
  const [showKeyForm, setShowKeyForm] = useState(!getStoredKey())
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const systemPrompt = trip
    ? `You are a helpful travel assistant. The user is planning a trip to ${trip.destination} from ${trip.startDate} to ${trip.endDate}. Help them with itinerary ideas, restaurant recommendations, local tips, cultural info, packing advice, budget estimates, and anything else related to their trip. Be concise, friendly, and practical. Format lists with bullet points.`
    : `You are a helpful travel planning assistant. Help the user plan their trips with itinerary ideas, recommendations, and travel tips.`

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const saveKey = () => {
    if (!keyInput.trim()) return
    localStorage.setItem(OPENAI_KEY_STORAGE, keyInput.trim())
    setApiKey(keyInput.trim())
    setKeyInput('')
    setShowKeyForm(false)
  }

  const clearKey = () => {
    localStorage.removeItem(OPENAI_KEY_STORAGE)
    setApiKey('')
    setShowKeyForm(true)
    setMessages([])
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || !apiKey) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const reply = await chatWithOpenAI(apiKey, newMessages, systemPrompt)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestedPrompts = trip
    ? [
        `What are the top 5 things to do in ${trip.destination}?`,
        `Recommend local restaurants to try`,
        `What should I pack for this trip?`,
        `Give me a day-by-day itinerary`,
      ]
    : []

  if (showKeyForm) {
    return (
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 pb-24 flex flex-col items-center justify-center gap-6">
        <div className="text-center space-y-2">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-xl font-bold text-slate-100">AI Travel Assistant</h2>
          <p className="text-slate-400 text-sm max-w-xs">
            Enter your free OpenAI API key to chat with AI about your trip. Your key is stored locally on your device only.
          </p>
        </div>
        <Card className="w-full">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Key className="h-4 w-4" />
              <span>OpenAI API Key</span>
            </div>
            <Input
              type="password"
              placeholder="sk-..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveKey()}
            />
            <Button className="w-full" onClick={saveKey} disabled={!keyInput.trim()}>
              Save & Start Chatting
            </Button>
            <p className="text-xs text-slate-500 text-center">
              Get a free key at{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                platform.openai.com/api-keys
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col pb-16 max-w-2xl mx-auto w-full">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center text-sm">🤖</div>
          <div>
            <p className="text-sm font-medium text-slate-200">AI Travel Assistant</p>
            {trip && <p className="text-xs text-slate-500">{trip.destination}</p>}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={clearKey}>
          <Key className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
              <div className="bg-slate-800/70 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 max-w-[85%]">
                {trip
                  ? `Hi! I'm your AI travel assistant for your trip to ${trip.destination}. Ask me anything — itinerary ideas, local food, what to pack, budget tips, or hidden gems!`
                  : `Hi! I'm your AI travel assistant. Ask me anything about your trips!`}
              </div>
            </div>

            {suggestedPrompts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 pl-10">Try asking:</p>
                {suggestedPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => setInput(p)}
                    className="w-full text-left text-sm px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-blue-500/50 transition-all ml-10"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-500/20' : 'bg-green-500/20'
              }`}
            >
              {msg.role === 'user' ? <User className="h-3.5 w-3.5 text-blue-400" /> : '🤖'}
            </div>
            <div
              className={`rounded-2xl px-4 py-3 text-sm max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-500/20 text-slate-100 rounded-tr-sm'
                  : 'bg-slate-800/70 text-slate-200 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
            <div className="bg-slate-800/70 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 rounded-xl px-4 py-3">
            Error: {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Clear chat + Input */}
      <div className="px-4 py-3 border-t border-slate-700/50 space-y-2">
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            <Trash2 className="h-3 w-3" /> Clear chat
          </button>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your trip..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1"
          />
          <Button size="icon" onClick={sendMessage} disabled={!input.trim() || loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
