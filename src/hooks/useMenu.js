import { useEffect, useState } from 'react'
import { menu as fallbackMenu } from '../data/site.js'

export default function useMenu(initialMenu) {
  const [menu, setMenu] = useState(() => Array.isArray(initialMenu) && initialMenu.length ? initialMenu : fallbackMenu)
  useEffect(() => {
    let current = true
    fetch('/api/menu').then((r) => r.ok ? r.json() : null).then((value) => {
      if (current && Array.isArray(value) && value.length) setMenu(value)
    }).catch(() => {})
    return () => { current = false }
  }, [])
  return menu
}
