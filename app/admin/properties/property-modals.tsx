'use client'

import { useState, useTransition } from 'react'
import { deactivateProperty, activateProperty } from './actions'

export function ToggleActiveButton({
  propertyId,
  propertyName,
  isActive,
}: {
  propertyId: string
  propertyName: string
  isActive: boolean
}) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const message = isActive
      ? `Desactivar "${propertyName}"? La propiedad dejará de aparecer en el sitio público.`
      : `Activar "${propertyName}"? La propiedad volverá a aparecer en el sitio público.`

    if (!confirm(message)) return

    startTransition(async () => {
      const result = isActive
        ? await deactivateProperty(propertyId)
        : await activateProperty(propertyId)

      if (!result.success) {
        alert(`Error: ${result.error}`)
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive
          ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
          : 'text-green-600 hover:text-green-700 hover:bg-green-50'
      }`}
      title={isActive ? 'Desactivar propiedad' : 'Activar propiedad'}
    >
      <span className="material-icons text-xl">
        {isPending ? 'hourglass_empty' : isActive ? 'visibility_off' : 'visibility'}
      </span>
    </button>
  )
}
