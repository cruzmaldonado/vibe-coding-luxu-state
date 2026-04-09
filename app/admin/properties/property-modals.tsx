'use client'

import { useState, useTransition } from 'react'
import { addProperty, deleteProperty } from './actions'



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
