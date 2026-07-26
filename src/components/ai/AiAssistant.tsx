import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Loader2, Sparkles, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockBrands } from '@/services/brand/mock-data'

// ── Paste your Groq API key here ────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? ''
// ────────────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
}

const BRAND_CONTEXT = mockBrands
  .map((b) =>
    `${b.name} (${b.category}, ${b.country}, ${b.priceRange} price, rating: ${b.rating}, sustainability: ${b.sustainabilityScore})`
  )
  .join('\n')

const SYSTEM_PROMPT = `You are BrandVerse AI, a friendly fashion brand assistant.
You help users discover and compare fashion brands on BrandVerse.

Here are the brands available on BrandVerse:
${BRAND_CONTEXT}

Guidelines:
- Keep responses short and friendly (2-4 sentences max)
- Recommend specific brands from the list above when relevant
- Mention ratings, sustainability scores and price ranges when helpful
- If asked about a brand not in the list, say it is not on BrandVerse yet
- Use emojis occasionally to keep it fun
- Answer in the same language the user writes in`

const QUICK_SUGGESTIONS = [
  '🌿 Sustainable brands',
  '💰 Budget brands India',
  '✨ Best luxury brands',
  '⚡ Top athleisure',
]

function getTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi! I'm BrandVerse AI 👋✨\n\nI can help you discover brands, compare styles, find sustainable options, or answer anything about fashion. What are you looking for today?",
  time: getTime(),
}

export function AiAssistant() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content, time: getTime() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model:      'llama-3.1-8b-instant',
          max_tokens: 400,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...[...messages, userMsg].map((m) => ({
              role:    m.role,
              content: m.content,
            })),
          ],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Groq error:', data)
        setMessages((prev) => [...prev, {
          role:    'assistant',
          content: `❌ Error: ${data?.error?.message ?? 'API error'}`,
          time:    getTime(),
        }])
        return
      }

      const reply = data.choices?.[0]?.message?.content
        ?? "Sorry, I couldn't respond right now!"

      setMessages((prev) => [...prev, { role: 'assistant', content: reply, time: getTime() }])
    } catch (err) {
      console.error('Network error:', err)
      setMessages((prev) => [...prev, {
        role:    'assistant',
        content: '❌ Network error. Please check your connection!',
        time:    getTime(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const reset = () => setMessages([WELCOME_MESSAGE])

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="size-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sparkles className="size-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary"
            animate={{ scale: [1, 1.4, 1.4], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.92 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-90 sm:w-105 rounded-3xl border bg-card shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '560px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-linear-to-r from-primary to-violet-600 text-white shrink-0">
              <motion.div
                className="size-9 rounded-full bg-white/20 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Bot className="size-5" />
              </motion.div>
              <div className="flex-1">
                <p className="font-bold text-sm">BrandVerse AI</p>
                <div className="flex items-center gap-1.5">
                  <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs opacity-80">Online • Fashion Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={reset}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  whileTap={{ scale: 0.9 }}
                  title="Reset chat"
                >
                  <RotateCcw className="size-4" />
                </motion.button>
                <motion.button
                  onClick={() => setOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="size-4" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  <div className={cn(
                    'size-7 rounded-full flex items-center justify-center shrink-0 mt-1',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-linear-to-br from-primary to-violet-600 text-white',
                  )}>
                    {msg.role === 'user' ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                  </div>

                  <div className={cn('flex flex-col gap-1 max-w-[80%]', msg.role === 'user' ? 'items-end' : 'items-start')}>
                    <div className={cn(
                      'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted rounded-tl-sm',
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                  </div>
                </motion.div>
              ))}

              {/* Loading dots */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="size-7 rounded-full bg-linear-to-br from-primary to-violet-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="size-3.5" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="size-1.5 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions — only on first message */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2 shrink-0">
                <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <motion.button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1.5 hover:bg-primary/20 transition-colors border border-primary/20"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t bg-background/50 shrink-0">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) sendMessage() }}
                  placeholder="Ask about brands..."
                  className="flex-1 rounded-2xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  disabled={loading}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </motion.button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Powered by Groq AI • BrandVerse
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}