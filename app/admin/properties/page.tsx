import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

function StatusBadge({ featured, isNew }: { featured: boolean; isNew: boolean }) {
  if (featured) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#D9ECC8] text-[#006655] border border-[#006655]/10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#006655] mr-1.5"></span>
        Featured
      </span>
    )
  }
  if (isNew) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
        New
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
      Active
    </span>
  )
}

export default async function AdminPropertiesPage() {
  const supabase = await createClient()

  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <h1 className="text-3xl font-bold text-[#19322F] mb-6">My Properties</h1>
        <div className="text-red-500 bg-red-50 p-4 border border-red-200 rounded-lg">
          Failed to load properties: {error.message}
        </div>
      </div>
    )
  }

  const totalCount = properties?.length || 0
  const featuredCount = properties?.filter(p => p.featured).length || 0
  const newCount = properties?.filter(p => p.is_new).length || 0

  return (
    <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#19322F] tracking-tight">My Properties</h1>
          <p className="text-gray-500 mt-1">Manage your portfolio and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 text-[#19322F] hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span>
            Filter
          </button>
          <button className="bg-[#006655] hover:bg-[#004d40] text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-[#006655]/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span>
            Add New Property
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Listings</p>
            <p className="text-2xl font-bold text-[#19322F] mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#006655]">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Featured Properties</p>
            <p className="text-2xl font-bold text-[#19322F] mt-1">{featuredCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#006655]">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">New Listings</p>
            <p className="text-2xl font-bold text-[#19322F] mt-1">{newCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-icons">pending</span>
          </div>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-6">Property Details</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Property Items */}
        {properties?.map((property) => (
          <div
            key={property.id}
            className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-[#EEF6F6] transition-colors items-center last:border-b-0"
          >
            {/* Property Details */}
            <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
              <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                {property.images?.[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={property.image_alt || property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="material-icons text-gray-400">apartment</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#19322F] group-hover:text-[#006655] transition-colors cursor-pointer">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-500">{property.location}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="material-icons text-[14px]">bed</span>
                    {property.beds} Beds
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1">
                    <span className="material-icons text-[14px]">bathtub</span>
                    {property.baths} Baths
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{property.area}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-6 md:col-span-2">
              <div className="text-base font-semibold text-[#19322F]">{property.price_formatted}</div>
              <div className="text-xs text-gray-400">View details</div>
            </div>

            {/* Status */}
            <div className="col-span-6 md:col-span-2">
              <StatusBadge featured={property.featured} isNew={property.is_new} />
            </div>

            {/* Actions */}
            <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
              <button
                className="p-2 rounded-lg text-gray-400 hover:text-[#006655] hover:bg-[#D9ECC8]/30 transition-all"
                title="Edit Property"
              >
                <span className="material-icons text-xl">edit</span>
              </button>
              <button
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                title="Delete Property"
              >
                <span className="material-icons text-xl">delete_outline</span>
              </button>
            </div>
          </div>
        ))}

        {properties?.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            No properties found.
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-[#19322F]">1</span> to{' '}
            <span className="font-medium text-[#19322F]">{Math.min(properties?.length || 0, 10)}</span> of{' '}
            <span className="font-medium text-[#19322F]">{properties?.length || 0}</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white">Next</button>
          </div>
        </div>
      </div>
    </main>
  )
}
