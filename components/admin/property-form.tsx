'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { addProperty, updateProperty } from '@/app/admin/properties/actions'
import Link from 'next/link'

export type PropertyFormData = {
  id?: string
  title: string
  location: string
  price: number
  price_formatted: string
  description: string
  status: string
  type: string
  beds: number
  baths: number
  area: number
  year_built: number
  parking: number
  featured: boolean
  is_new: boolean
  images: string[]
  tags: string[]
}

const AMENITIES_LIST = ['Swimming Pool', 'Garden', 'Air Conditioning', 'Smart Home']

export function PropertyForm({ initialData }: { initialData?: Partial<PropertyFormData> }) {
  const router = useRouter()
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: initialData?.title || '',
    location: initialData?.location || '',
    price: initialData?.price || 0,
    price_formatted: initialData?.price_formatted || '',
    description: initialData?.description || '',
    status: initialData?.status || 'for-sale',
    type: initialData?.type || 'apartment',
    beds: initialData?.beds || 0,
    baths: initialData?.baths || 0,
    area: initialData?.area || 0,
    year_built: initialData?.year_built || new Date().getFullYear(),
    parking: initialData?.parking || 0,
    featured: initialData?.featured || false,
    is_new: initialData?.is_new || false,
    images: initialData?.images || [],
    tags: initialData?.tags || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm(f => ({ ...f, [id]: checked }))
    } else if (type === 'number') {
      setForm(f => ({ ...f, [id]: value ? Number(value) : '' }))
    } else {
      setForm(f => ({ ...f, [id]: value }))
    }
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setForm(f => {
      const tags = new Set(f.tags)
      if (checked) tags.add(amenity)
      else tags.delete(amenity)
      return { ...f, tags: Array.from(tags) }
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError('')

    const uploadedUrls: string[] = []
    
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setError('One or more images exceed the 5MB limit.')
        continue
      }
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `property-images/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('properties')
        .upload(filePath, file)

      if (uploadError) {
        setError(`Failed to upload ${file.name}: ${uploadError.message}`)
        continue
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('properties')
          .getPublicUrl(data.path)
        
        uploadedUrls.push(publicUrlData.publicUrl)
      }
    }

    if (uploadedUrls.length > 0) {
      setForm(f => ({ ...f, images: [...f.images, ...uploadedUrls] }))
    }
    
    e.target.value = ''
    setIsUploading(false)
  }

  const handleRemoveImage = (index: number) => {
    setForm(f => {
      const newImages = [...f.images]
      newImages.splice(index, 1)
      return { ...f, images: newImages }
    })
  }

  const setNumberField = (field: 'beds' | 'baths' | 'parking', delta: number) => {
    setForm(f => ({ ...f, [field]: Math.max(0, f[field] + delta) }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(e.target.value)
    setForm(f => ({
      ...f,
      price: numericValue,
      price_formatted: numericValue > 0 ? `$${numericValue.toLocaleString()}` : ''
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.title || !form.price || !form.location) {
      setError('Please fill in all required fields marked with *.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    startTransition(async () => {
      let result
      
      const payload = {
        ...form,
        price: Number(form.price),
        beds: Number(form.beds),
        baths: Number(form.baths),
        area: Number(form.area),
        year_built: Number(form.year_built),
        parking: Number(form.parking),
      }

      if (initialData?.id) {
        result = await updateProperty(initialData.id, payload)
      } else {
        result = await addProperty(payload)
      }

      if (!result.success) {
        setError(result.error || 'Failed to save property.')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        router.push('/admin/properties')
      }
    })
  }

  return (
    <div className="font-sf-pro text-nordic selection:bg-hint-green selection:text-nordic">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
              <li><Link className="hover:text-mosque transition-colors" href="/admin/properties">Properties</Link></li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-nordic">{initialData?.id ? 'Edit Property' : 'Add New'}</li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic tracking-tight mb-2">
              {initialData?.id ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
              {initialData?.id ? 'Modify the property details below.' : 'Fill in the details below to create a new listing.'} Fields marked with <span className="text-red-500">*</span> are mandatory.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/properties" className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-nordic hover:bg-gray-50 transition-colors font-medium font-sf-pro text-sm inline-flex items-center justify-center">
            Cancel
          </Link>
          <button 
            type="submit" 
            form="propertyForm" 
            disabled={isPending || isUploading}
            className="px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-sf-pro text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-icons text-sm">{isPending ? 'hourglass_empty' : 'save'}</span>
            {isPending ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form id="propertyForm" onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">info</span>
              </div>
              <h2 className="text-xl font-bold text-nordic">Basic Information</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="title">Property Title <span className="text-red-500">*</span></label>
                <input 
                  id="title" 
                  value={form.title}
                  onChange={handleChange}
                  className="w-full text-base px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro" 
                  placeholder="e.g. Modern Penthouse with Ocean View" 
                  type="text" 
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="price">Price <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                    <input 
                      id="price" 
                      value={form.price || ''}
                      onChange={handlePriceChange}
                      className="w-full pl-7 pr-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium font-sf-pro" 
                      placeholder="0.00" 
                      type="number"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="status">Status</label>
                  <select 
                    id="status" 
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer"
                  >
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">For Rent</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="type">Property Type</label>
                  <select 
                    id="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">description</span>
              </div>
              <h2 className="text-xl font-bold text-nordic">Description</h2>
            </div>
            <div className="p-8">
              <div className="mb-3 flex gap-2 border-b border-gray-100 pb-2">
                <button className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors" type="button"><span className="material-icons text-lg">format_bold</span></button>
                <button className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors" type="button"><span className="material-icons text-lg">format_italic</span></button>
                <button className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors" type="button"><span className="material-icons text-lg">format_list_bulleted</span></button>
              </div>
              <textarea 
                id="description" 
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px]" 
                placeholder="Describe the property features, neighborhood, and unique selling points..."
              ></textarea>
              <div className="mt-2 text-right text-xs text-gray-400 font-sf-pro">
                {form.description?.length || 0} / 2000 characters
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-gradient-to-r from-hint-green/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">image</span>
                </div>
                <h2 className="text-xl font-bold text-nordic">Gallery</h2>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
            </div>
            <div className="p-8">
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-green/10 hover:border-mosque/40 transition-colors cursor-pointer group">
                <input 
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  multiple 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp"
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                    {isUploading ? (
                      <span className="material-icons text-2xl animate-spin">sync</span>
                    ) : (
                      <span className="material-icons text-2xl">cloud_upload</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-nordic font-sf-pro">Click or drag images here</p>
                    <p className="text-xs text-gray-400 font-sf-pro">Max file size 5MB per image</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {form.images.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm bg-gray-100">
                    <Image 
                      alt={`Gallery image ${i}`} 
                      className="w-full h-full object-cover" 
                      src={url}
                      fill
                    />
                    <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button 
                        onClick={() => handleRemoveImage(i)}
                        className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors" 
                        type="button"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Main</span>
                    )}
                  </div>
                ))}

                {form.images.length > 0 && (
                  <div className="relative aspect-square rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-mosque hover:border-mosque hover:bg-hint-green/20 transition-all group">
                    <input 
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      multiple 
                      type="file" 
                      accept="image/jpeg, image/png, image/webp"
                      disabled={isUploading}
                    />
                    <span className="material-icons group-hover:scale-110 transition-transform">add</span>
                    <span className="text-xs mt-1 font-medium font-sf-pro">Add More</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">place</span>
              </div>
              <h2 className="text-lg font-bold text-nordic">Location</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="location">Address <span className="text-red-500">*</span></label>
                <input 
                  id="location" 
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro" 
                  placeholder="Street Address, City, Zip" 
                  type="text" 
                  required
                />
              </div>
              <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Miami&zoom=13&size=400x400&sensor=false')] bg-cover bg-center opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-white/90 text-nordic px-3 py-1.5 rounded shadow-sm backdrop-blur-sm text-xs font-bold font-sf-pro flex items-center gap-1">
                    <span className="material-icons text-sm text-mosque">map</span> Preview
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">straighten</span>
              </div>
              <h2 className="text-lg font-bold text-nordic">Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="area">Area (m²)</label>
                  <input 
                    id="area" 
                    value={form.area || ''}
                    onChange={handleChange}
                    className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm" 
                    placeholder="0" 
                    type="number" 
                  />
                </div>
                <div className="group">
                  <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="year_built">Year Built</label>
                  <input 
                    id="year_built" 
                    value={form.year_built || ''}
                    onChange={handleChange}
                    className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm" 
                    placeholder="YYYY" 
                    type="number" 
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">bed</span> Bedrooms
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <button onClick={() => setNumberField('beds', -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                    <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={form.beds} />
                    <button onClick={() => setNumberField('beds', 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">shower</span> Bathrooms
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <button onClick={() => setNumberField('baths', -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                    <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={form.baths} />
                    <button onClick={() => setNumberField('baths', 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">directions_car</span> Parking
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <button onClick={() => setNumberField('parking', -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                    <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={form.parking} />
                    <button onClick={() => setNumberField('parking', 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <h3 className="text-sm font-bold text-nordic mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">Flags</h3>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input id="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" />
                    <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">Featured Property</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input id="is_new" type="checkbox" checked={form.is_new} onChange={handleChange} className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" />
                    <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">New Listing</span>
                  </label>
                </div>
                
                <h3 className="text-sm font-bold text-nordic mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">Amenities</h3>
                <div className="space-y-2">
                  {AMENITIES_LIST.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={form.tags.includes(amenity)}
                        onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                        className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" 
                      />
                      <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl lg:hidden z-40 flex gap-3">
          <Link href="/admin/properties" className="flex-1 py-3 text-center rounded-lg border border-gray-300 bg-white text-nordic font-medium font-sf-pro">
            Cancel
          </Link>
          <button type="submit" disabled={isPending || isUploading} className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium font-sf-pro flex justify-center items-center gap-2 disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
