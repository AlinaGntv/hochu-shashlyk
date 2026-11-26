import { useState } from 'react'
import { Photo } from './ui.jsx'

export default function PhotoGallery({ item, alt }) {
  const images = [...new Set([item?.photo, ...(Array.isArray(item?.photos) ? item.photos : [])].filter(Boolean))]
  const [index, setIndex] = useState(0)
  const active = images[index] || null
  const step = (direction) => setIndex((current) => (current + direction + images.length) % images.length)

  return (
    <>
      <Photo src={active} alt={alt} />
      {images.length > 1 && (
        <div className="photo-gallery" aria-label={`Фотографии: ${alt}`}>
          <button type="button" onClick={() => step(-1)} aria-label={`Предыдущее фото: ${alt}`}>‹</button>
          <span aria-live="polite">{index + 1} / {images.length}</span>
          <button type="button" onClick={() => step(1)} aria-label={`Следующее фото: ${alt}`}>›</button>
        </div>
      )}
    </>
  )
}
