import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export default async function AdminPropertiesPage() {
  const supabase = await createClient()

  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Properties</h1>
        <div className="text-red-500 bg-red-50 p-4 border border-red-200 rounded">
          Failed to load properties: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Properties Inventory</h1>
        <div className="text-sm text-slate-500">{properties?.length || 0} total properties</div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Property</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stats (B/B/A)</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties?.map((property) => (
              <tr key={property.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-14 relative rounded overflow-hidden bg-slate-100 flex-shrink-0">
                      {property.images && property.images[0] ? (
                        <Image 
                          src={property.images[0]} 
                          alt={property.image_alt || property.title} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200" />
                      )}
                    </div>
                    <div className="font-medium text-slate-900 truncate max-w-[200px]" title={property.title}>
                      {property.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{property.location}</td>
                <td className="px-6 py-4 font-medium">{property.price_formatted}</td>
                <td className="px-6 py-4 text-slate-500">
                  {property.beds} / {property.baths} / {property.area}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {property.featured && (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        Featured
                      </span>
                    )}
                    {property.is_new && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        New
                      </span>
                    )}
                    {(!property.featured && !property.is_new) && (
                      <span className="text-slate-400">-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {properties?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No properties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
