'use client'

import { useState, useTransition } from 'react'
import { addProperty, deleteProperty } from './actions'

// ─── Add Property Modal ───────────────────────────────────────────────────────

export function AddPropertyModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    location: '',
    price_formatted: '',
    beds: '',
    baths: '',
    area: '',
    featured: false,
    is_new: true,
  })

  const set = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { title, location, price_formatted, beds, baths, area } = form
    if (!title || !location || !price_formatted || !beds || !baths || !area) {
      setError('Please fill in all required fields.')
      return
    }

    startTransition(async () => {
      const result = await addProperty({
        title,
        location,
        price_formatted,
        beds: Number(beds),
        baths: Number(baths),
        area: Number(area),
        featured: form.featured,
        is_new: form.is_new,
      })

      if (!result.success) {
        setError(result.error || 'Failed to add property.')
      } else {
        setForm({
          title: '',
          location: '',
          price_formatted: '',
          beds: '',
          baths: '',
          area: '',
          featured: false,
          is_new: true,
        })
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#006655] hover:bg-[#004d40] text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-[#006655]/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
      >
        <span className="material-icons text-base">add</span>
        Add New Property
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#19322F]/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#19322F]">Add New Property</h2>
                <p className="text-sm text-[#19322F]/60 mt-0.5">Fill in the details for the new listing.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-[#19322F]/40 hover:text-[#19322F] hover:bg-gray-100 transition-colors"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#19322F]/60 mb-1.5">
                  Property Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. The Nordic Villa"
                  className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EEF6F6]/60 text-[#19322F] placeholder-[#19322F]/30 focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent text-sm transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#19322F]/60 mb-1.5">
                  Location *
                </label>
                <input
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="e.g. 12 Willow Creek Ln, Miami"
                  className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EEF6F6]/60 text-[#19322F] placeholder-[#19322F]/30 focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent text-sm transition-all"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#19322F]/60 mb-1.5">
                  Price *
                </label>
                <input
                  value={form.price_formatted}
                  onChange={(e) => set('price_formatted', e.target.value)}
                  placeholder="e.g. $1,250,000"
                  className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EEF6F6]/60 text-[#19322F] placeholder-[#19322F]/30 focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent text-sm transition-all"
                />
              </div>

              {/* Beds / Baths / Area */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#19322F]/60 mb-1.5">
                    Beds *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.beds}
                    onChange={(e) => set('beds', e.target.value)}
                    placeholder="4"
                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EEF6F6]/60 text-[#19322F] placeholder-[#19322F]/30 focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#19322F]/60 mb-1.5">
                    Baths *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.baths}
                    onChange={(e) => set('baths', e.target.value)}
                    placeholder="3"
                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EEF6F6]/60 text-[#19322F] placeholder-[#19322F]/30 focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#19322F]/60 mb-1.5">
                    Area (sqft) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.area}
                    onChange={(e) => set('area', e.target.value)}
                    placeholder="2450"
                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EEF6F6]/60 text-[#19322F] placeholder-[#19322F]/30 focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => set('featured', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#006655] focus:ring-[#006655]"
                  />
                  <span className="text-sm text-[#19322F]">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_new}
                    onChange={(e) => set('is_new', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#006655] focus:ring-[#006655]"
                  />
                  <span className="text-sm text-[#19322F]">New Listing</span>
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-[#19322F]/60 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 bg-[#006655] text-white rounded-lg text-sm font-medium hover:bg-[#004d40] transition-colors shadow-md shadow-[#006655]/20 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-base">add_home</span>
                  {isPending ? 'Adding...' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Delete Property Button ───────────────────────────────────────────────────

export function DeletePropertyButton({ propertyId, propertyName }: { propertyId: string; propertyName: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm(`Delete "${propertyName}"? This action cannot be undone.`)) return

    startTransition(async () => {
      const result = await deleteProperty(propertyId)
      if (!result.success) {
        alert(`Failed to delete: ${result.error}`)
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete Property"
    >
      <span className="material-icons text-xl">
        {isPending ? 'hourglass_empty' : 'delete_outline'}
      </span>
    </button>
  )
}
