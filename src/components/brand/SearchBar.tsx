import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onSearch, placeholder = 'Search brands...', className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch?.('')
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn('relative', className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          'relative flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200',
          isFocused
            ? 'border-primary bg-background ring-2 ring-primary/20'
            : 'border-border bg-card hover:border-primary/50',
        )}
      >
        <Search className="size-5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          aria-label="Search brands"
        />
        {query && (
          <motion.button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Clear search"
          >
            <X className="size-5" />
          </motion.button>
        )}
      </div>
    </motion.form>
  )
}
