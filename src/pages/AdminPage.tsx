import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/button'
import { adminService, type AdminBrandPayload } from '@/services/admin/admin.service'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { brandService } from '@/services/brand'
import type { Brand } from '@/services/brand/brand.types'

const emptyForm: AdminBrandPayload = {
  name: '',
  slug: '',
  logoUrl: '',
  description: '',
  category: 'streetwear',
  country: '',
  websiteUrl: '',
  rating: 4.0,
  reviewsCount: 0,
  popularity: 50,
  sustainabilityScore: 50,
  trustScore: 50,
  priceRange: 'mid',
  tags: [],
  featured: false,
}

export function AdminPage() {
 const user = useAuthStore((state) => state.user)
const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [brands, setBrands] = useState<Brand[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AdminBrandPayload>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tagInput, setTagInput] = useState('')

  // Redirect non-admins
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/')
    }
  }, [user, navigate])

  // Load brands once
  useEffect(() => {
    brandService.getBrands({ pageSize: 100 }).then((res) => {
      setBrands(res.items)
    })
  }, [])

  if (!user || user.role !== 'ADMIN') return null

  const handleField = (key: keyof AdminBrandPayload, value: any) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
  }

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id)
    setForm({
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl ?? '',
      description: brand.description ?? '',
      category: brand.category,
      country: brand.country ?? '',
      websiteUrl: brand.websiteUrl ?? '',
      rating: brand.rating,
      reviewsCount: brand.reviewsCount,
      popularity: brand.popularity,
      sustainabilityScore: brand.sustainabilityScore,
      trustScore: brand.trustScore,
      priceRange: brand.priceRange,
      tags: brand.tags ?? [],
      featured: brand.featured,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await adminService.deleteBrand(id)
      setBrands((prev) => prev.filter((b) => b.id !== id))
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      setSuccess(`"${name}" deleted.`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (e: any) {
      setError(e.message || 'Delete failed')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (editingId) {
        const updated = await adminService.updateBrand(editingId, form)
        setBrands((prev) =>
          prev.map((b) => (b.id === editingId ? updated : b))
        )
        setSuccess('Brand updated!')
      } else {
        const created = await adminService.createBrand(form)
        setBrands((prev) => [...prev, created])
        setSuccess('Brand created!')
      }
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage BrandVerse brands
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm((v) => !v)
            setEditingId(null)
            setForm(emptyForm)
          }}
        >
          <Plus className="size-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-green-500/10 text-green-600 rounded-lg px-4 py-3 mb-6 text-sm"
          >
            <Check className="size-4" /> {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-destructive/10 text-destructive rounded-lg px-4 py-3 mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border bg-card p-6 mb-8">
              <h2 className="font-display text-xl font-bold mb-6">
                {editingId ? 'Edit Brand' : 'Add New Brand'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name *</label>
                    <input className={inputClass} required value={form.name}
                      onChange={(e) => handleField('name', e.target.value)}
                      placeholder="Brand name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Slug *</label>
                    <input className={inputClass} required value={form.slug}
                      onChange={(e) => handleField('slug', e.target.value)}
                      placeholder="brand-slug" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category *</label>
                    <select className={inputClass} value={form.category}
                      onChange={(e) => handleField('category', e.target.value)}>
                      {['streetwear','minimalist','sustainable','athleisure','luxury','vintage'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price Range</label>
                    <select className={inputClass} value={form.priceRange}
                      onChange={(e) => handleField('priceRange', e.target.value)}>
                      {['budget','mid','premium','luxury'].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Country</label>
                    <input className={inputClass} value={form.country}
                      onChange={(e) => handleField('country', e.target.value)}
                      placeholder="India" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Website URL</label>
                    <input className={inputClass} value={form.websiteUrl}
                      onChange={(e) => handleField('websiteUrl', e.target.value)}
                      placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Logo URL</label>
                    <input className={inputClass} value={form.logoUrl}
                      onChange={(e) => handleField('logoUrl', e.target.value)}
                      placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Rating (0–5)</label>
                    <input className={inputClass} type="number" min={0} max={5} step={0.1}
                      value={form.rating}
                      onChange={(e) => handleField('rating', parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Popularity (0–100)</label>
                    <input className={inputClass} type="number" min={0} max={100}
                      value={form.popularity}
                      onChange={(e) => handleField('popularity', parseInt(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Sustainability (0–100)</label>
                    <input className={inputClass} type="number" min={0} max={100}
                      value={form.sustainabilityScore}
                      onChange={(e) => handleField('sustainabilityScore', parseInt(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Trust Score (0–100)</label>
                    <input className={inputClass} type="number" min={0} max={100}
                      value={form.trustScore}
                      onChange={(e) => handleField('trustScore', parseInt(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Reviews Count</label>
                    <input className={inputClass} type="number" min={0}
                      value={form.reviewsCount}
                      onChange={(e) => handleField('reviewsCount', parseInt(e.target.value))} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea className={inputClass} rows={3} value={form.description}
                    onChange={(e) => handleField('description', e.target.value)}
                    placeholder="Brand description..." />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input className={inputClass} value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                      placeholder="Type a tag and press Enter" />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag) => (
                      <span key={tag}
                        className="flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)}>
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured}
                    onChange={(e) => handleField('featured', e.target.checked)} />
                  <span className="text-sm font-medium">Featured brand</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : editingId ? 'Update Brand' : 'Create Brand'}
                  </Button>
                  <Button type="button" variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      setForm(emptyForm)
                    }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brands Table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Brand</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Price</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Rating</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, i) => (
              <motion.tr
                key={brand.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-t hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={brand.logoUrl} alt={brand.name}
                      className="size-8 rounded-lg bg-muted" />
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-muted-foreground text-xs">{brand.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell capitalize text-muted-foreground">
                  {brand.category}
                </td>
                <td className="px-4 py-3 hidden md:table-cell capitalize text-muted-foreground">
                  {brand.priceRange}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                  ⭐ {brand.rating}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon"
                      onClick={() => handleEdit(brand)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon"
                      onClick={() => handleDelete(brand.id, brand.name)}
                      className="hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  )
}