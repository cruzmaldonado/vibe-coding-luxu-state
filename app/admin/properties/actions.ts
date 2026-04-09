'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProperty(propertyId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/properties')
  return { success: true }
}

export async function addProperty(formData: {
  title: string
  location: string
  price_formatted: string
  beds: number
  baths: number
  area: number
  featured: boolean
  is_new: boolean
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
    price_formatted: formData.price_formatted,
    beds: formData.beds,
    baths: formData.baths,
    area: formData.area,
    featured: formData.featured,
    is_new: formData.is_new,
    slug,
    images: [],
    tags: [],
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/properties')
  return { success: true }
}
