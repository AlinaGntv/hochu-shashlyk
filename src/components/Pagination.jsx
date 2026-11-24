function pageItems(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const pages = new Set([1, totalPages, page, page - 1, page + 1])
  return [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b)
}

export default function Pagination({ page, totalPages, onChange, label = 'Страницы' }) {
  if (totalPages <= 1) return null
  const pages = pageItems(page, totalPages)
  let previous = 0

  return (
    <nav className="pagination" aria-label={label}>
      <button type="button" className="pagination__step" onClick={() => onChange(page - 1)} disabled={page === 1}>← Назад</button>
      <div className="pagination__pages">
        {pages.map((number) => {
          const gap = previous && number - previous > 1
          previous = number
          return <span className="pagination__item" key={number}>
            {gap && <span className="pagination__ellipsis" aria-hidden="true">…</span>}
            <button type="button" className={number === page ? 'is-current' : ''} aria-current={number === page ? 'page' : undefined} aria-label={`Страница ${number}`} onClick={() => onChange(number)}>{number}</button>
          </span>
        })}
      </div>
      <span className="pagination__status">{page} / {totalPages}</span>
      <button type="button" className="pagination__step" onClick={() => onChange(page + 1)} disabled={page === totalPages}>Вперёд →</button>
    </nav>
  )
}
