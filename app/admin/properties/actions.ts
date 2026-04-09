'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deactivateProperty(propertyId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('properties')
    .update({ is_active: false })
    .eq('id', propertyId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/properties')
  revalidatePath('/')
  return { success: true }
}

export async function activateProperty(propertyId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('properties')
    .update({ is_active: true })
    .eq('id', propertyId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/properties')
  revalidatePath('/')
  return { success: true }
}

export async function addProperty(formData: {
  title: string
  location: string
  price: number
  price_formatted: string
  beds: number
  baths: number
  area: number
  featured: boolean
  is_new: boolean
  description?: string
  status?: string
  type?: string
  year_built?: number
  parking?: number
  images?: string[]
  tags?: string[]
}) {
  const supabase = await createClient()

  // Generate a slug from the title
  const slug = formData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now()

  const { error } = await supabase.from('properties').insert({
    title: formData.title,
    location: formData.location,
    price: formData.price,
    price_formatted: formData.price_formatted,
    beds: formData.beds,
    baths: formData.baths,
    area: formData.area,
    featured: formData.featured,
    is_new: formData.is_new,
    description: formData.description,
    status: formData.status,
    type: formData.type,
    year_built: formData.year_built,
    parking: formData.parking,
    image_alt: formData.title,
    slug,
    images: formData.images || [],
    tags: formData.tags || [],
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/properties')
  return { success: true }
}

export async function updateProperty(propertyId: string, formData: {
  title: string
  location: string
  price: number
  price_formatted: string
  beds: number
  baths: number
  area: number
  featured: boolean
  is_new: boolean
  description?: string
  status?: string
  type?: string
  year_built?: number
  parking?: number
  images?: string[]
  tags?: string[]
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('properties').update({
    title: formData.title,
    location: formData.location,
    price: formData.price,
    price_formatted: formData.price_formatted,
    beds: formData.beds,
    baths: formData.baths,
    area: formData.area,
    featured: formData.featured,
    is_new: formData.is_new,
    description: formData.description,
    status: formData.status,
    type: formData.type,
    year_built: formData.year_built,
    parking: formData.parking,
    image_alt: formData.title,
    images: formData.images || [],
    tags: formData.tags || [],
  }).eq('id', propertyId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/properties')
  revalidatePath(`/admin/properties/${propertyId}/edit`)
  return { success: true }
}
