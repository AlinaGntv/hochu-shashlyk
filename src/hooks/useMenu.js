import { useEffect, useState } from 'react'
import { menu as fallbackMenu } from '../data/site.js'

function withFallbackPhotos(source) {
  const fallbackGroups = new Map(fallbackMenu.map((group) => [group.id, group]))
  return source.map((group) => {
    const fallbackItems = new Map((fallbackGroups.get(group.id)?.items || []).map((item) => [item.id || item.name, item]))
    return {
      ...group,
      items: (group.items || []).map((item) => {
        const fallback = fallbackItems.get(item.id || item.name) || fallbackItems.get(item.name)
        const photo = item.photo || fallback?.photo || null
        return {
          ...fallback,
          ...item,
          photo,
          photos: [...new Set([photo, ...(Array.isArray(item.photos) ? item.photos : []), ...(fallback?.photos || [])].filter(Boolean))],
        }
      }),
    }
  })
}

export default function useMenu(initialMenu) {
  const [menu, setMenu] = useState(() => withFallbackPhotos(Array.isArray(initialMenu) && initialMenu.length ? initialMenu : fallbackMenu))
  useEffect(() => {
    let current = true
    fetch('/api/menu').then((r) => r.ok ? r.json() : null).then((value) => {
      if (current && Array.isArray(value) && value.length) setMenu(withFallbackPhotos(value))
    }).catch(() => {})
    return () => { current = false }
  }, [])
  return menu
}
