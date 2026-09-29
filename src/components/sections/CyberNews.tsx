import { useState, useEffect, useMemo } from 'react'
import type { NewsFeedData, NewsItem, NewsCategory } from '../../types/news'

const CATEGORY_TABS: { id: NewsCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'Todas las Noticias', icon: '🌐' },
  { id: 'networking', label: 'Redes & Protocolos', icon: '📡' },
  { id: 'vulnerability', label: 'Vulnerabilidades & CVE', icon: '🛡️' },
  { id: 'cybersecurity', label: 'Ciberseguridad', icon: '⚔️' },
  { id: 'threat-intel', label: 'Threat Intel & Malware', icon: '☣️' },
  { id: 'advisory', label: 'Avisos Oficiales', icon: '🚨' },
]

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Hace unos minutos'
    if (diffHours === 1) return 'Hace 1 hora'
    if (diffHours < 24) return `Hace ${diffHours} horas`
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return 'Reciente'
  }
}

function getSourceColor(source: string): { bg: string; border: string; text: string } {
  const s = source.toLowerCase()
  if (s.includes('incibe')) {
    return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.45)', text: '#fca5a5' }
  }
  if (s.includes('cisa')) {
    return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.45)', text: '#fcd34d' }
  }
  if (s.includes('cloudflare')) {
    return { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.45)', text: '#fdba74' }
  }
  if (s.includes('cisco')) {
    return { bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.45)', text: '#67e8f9' }
  }
  if (s.includes('hacker news')) {
    return { bg: 'rgba(194, 0, 251, 0.15)', border: 'rgba(194, 0, 251, 0.45)', text: '#f0abfc' }
  }
  return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.45)', text: '#6ee7b7' }
}

export function CyberNews() {
  const [data, setData] = useState<NewsFeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(8)

  useEffect(() => {
    let isMounted = true

    async function loadNews() {
      try {
        setLoading(true)
        setError(null)
        // Carga directa del archivo JSON estático generado automáticamente
        const res = await fetch('/data/news.json?t=' + Date.now())
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const json: NewsFeedData = await res.json()
        if (isMounted) {
          setData(json)
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error('Error al cargar noticias:', err)
          setError('No fue posible cargar el feed de noticias en este momento.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadNews()
    return () => {
      isMounted = false
    }
  }, [])

  const items = useMemo(() => data?.items || [], [data])

  const filteredItems = useMemo(() => {
    return items.filter((item: NewsItem) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [items, selectedCategory, searchQuery])

  // Contadores por categoría
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length }
    for (const item of items) {
      c[item.category] = (c[item.category] || 0) + 1
    }
    return c
  }, [items])

  return (
    <section className="cyber-news-section" id="noticias">
      {/* Luces de ambiente cyberpunk */}
      <div className="news-ambient-orb orb-left" aria-hidden="true" />
      <div className="news-ambient-orb orb-right" aria-hidden="true" />

      <div className="news-container">
        {/* Cabecera de la sección */}
        <header className="news-header">
          <div className="news-badges-row">
            <span className="glass-badge highlight">
              <span className="badge-glow-dot" />
              (02) THREAT INTEL & NEWS FEED
            </span>
            <span className="glass-badge">📡 Automatizado 24/7</span>
            <span className="glass-badge accent">Fuentes Verificadas</span>
          </div>

          <h2 className="news-title">
            RADAR DE NOTICIAS DE <span className="title-gradient">CIBERSEGURIDAD & REDES</span>
          </h2>

          <p className="news-lead">
            Monitorización continua y agregación automatizada de avisos gubernamentales, alertas críticas de día cero,
            arquitecturas de telecomunicaciones e investigaciones de malware en tiempo real.
          </p>

          {/* Barra de telemetría del feed */}
          <div className="news-telemetry-bar">
            <div className="telemetry-node">
              <span className="telemetry-ping" />
              <span className="telemetry-label">ESTADO DEL FEED:</span>
              <strong className="telemetry-val ok">SINCRONIZADO</strong>
            </div>

            <div className="telemetry-node">
              <span className="telemetry-icon">🕒</span>
              <span className="telemetry-label">ÚLTIMA SYNC:</span>
              <span className="telemetry-val">
                {data?.lastUpdated ? formatRelativeTime(data.lastUpdated) : 'Actualizado hoy'}
              </span>
            </div>

            <div className="telemetry-node">
              <span className="telemetry-icon">📑</span>
              <span className="telemetry-label">TOTAL INFORMES:</span>
              <span className="telemetry-val highlight">{items.length} activos</span>
            </div>

            <div className="telemetry-sources">
              <span className="telemetry-sources-label">FUENTES:</span>
              <div className="source-chips">
                {(data?.sources || ['INCIBE', 'The Hacker News', 'CISA', 'Cloudflare', 'Cisco', 'ESET']).map(
                  (src) => (
                    <span key={src} className="source-chip">
                      {src}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Controles: Tabs de categoría y barra de búsqueda */}
        <div className="news-controls-wrap">
          <div className="news-category-tabs" role="tablist">
            {CATEGORY_TABS.map((tab) => {
              const count = counts[tab.id] || 0
              const isActive = selectedCategory === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`news-tab ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(tab.id)
                    setVisibleCount(8)
                  }}
                >
                  <span className="tab-icon" aria-hidden="true">
                    {tab.icon}
                  </span>
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-counter">{count}</span>
                </button>
              )
            })}
          </div>

          <div className="news-search-box">
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar por CVE, malware, router, exploit..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setVisibleCount(8)
              }}
              className="news-search-input"
              aria-label="Buscar noticias"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="news-status-banner error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="news-grid-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="news-skeleton-card">
                <div className="skeleton-bar title-bar" />
                <div className="skeleton-bar text-bar" />
                <div className="skeleton-bar text-bar short" />
                <div className="skeleton-bar footer-bar" />
              </div>
            ))}
          </div>
        )}

        {/* Sin resultados de búsqueda */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="news-empty-state">
            <div className="empty-terminal-icon">_</div>
            <h4>NO SE ENCONTRARON COINCIDENCIAS</h4>
            <p>
              No hay alertas que coincidan con <strong>"{searchQuery}"</strong> en la categoría seleccionada.
            </p>
            <button
              type="button"
              className="button button-outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              Restablecer Filtros
            </button>
          </div>
        )}

        {/* Grid de Noticias */}
        {!loading && !error && filteredItems.length > 0 && (
          <>
            <div className="news-cards-grid">
              {filteredItems.slice(0, visibleCount).map((item) => {
                const sourceStyle = getSourceColor(item.source)
                return (
                  <article key={item.id} className="news-card">
                    {/* Borde superior sutil con acento */}
                    <div className="card-top-indicator" />

                    <div className="news-card-inner">
                      {/* Metadatos superiores */}
                      <div className="news-card-meta-row">
                        <span
                          className="news-source-tag"
                          style={{
                            backgroundColor: sourceStyle.bg,
                            borderColor: sourceStyle.border,
                            color: sourceStyle.text,
                          }}
                        >
                          {item.source}
                        </span>

                        <span className="news-category-tag">{item.categoryLabel}</span>

                        {item.badge && (
                          <span className="news-badge-alert">{item.badge}</span>
                        )}
                      </div>

                      {/* Título de la noticia */}
                      <h3 className="news-card-title">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir noticia original"
                        >
                          {item.title}
                        </a>
                      </h3>

                      {/* Resumen */}
                      <p className="news-card-summary">{item.summary}</p>

                      {/* Footer de la tarjeta con fecha y enlace */}
                      <div className="news-card-footer">
                        <span className="news-date">
                          <span className="clock-glyph">◷</span> {formatRelativeTime(item.pubDate)}
                        </span>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="news-link-btn"
                          aria-label={`Leer informe completo: ${item.title}`}
                        >
                          <span>Leer Informe</span>
                          <span className="arrow-glyph" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Botón para expandir más noticias */}
            {filteredItems.length > visibleCount && (
              <div className="news-load-more-wrap">
                <button
                  type="button"
                  className="button news-load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                >
                  CARGAR MÁS INFORMES ({filteredItems.length - visibleCount} RESTANTES)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
