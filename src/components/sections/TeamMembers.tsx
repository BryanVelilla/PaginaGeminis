import { useState, useRef } from 'react'

interface TeamMember {
  id: string
  firstName: string
  lastName: string
  fullName: string
  role: string
  program: string
  focusArea: string
  badge: string
  image: string
}

const MEMBERS: TeamMember[] = [
  {
    id: 'bryan-velilla',
    firstName: 'Bryan Esteban',
    lastName: 'Velilla Perez',
    fullName: 'Bryan Esteban Velilla Perez',
    role: 'Investigador & Coordinador Técnico',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Ciberseguridad Ofensiva & Red Team',
    badge: 'Red Team Lead',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'luis-acuna',
    firstName: 'Luis Felipe',
    lastName: 'Acuña Hoyos',
    fullName: 'Luis Felipe Acuña Hoyos',
    role: 'Investigador de Redes',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Arquitectura de Redes & Protocolos BGP/IPsec',
    badge: 'Network Defense',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'tomas-arias',
    firstName: 'Tomas Alberto',
    lastName: 'Arias Zabala',
    fullName: 'Tomas Alberto Arias Zabala',
    role: 'Investigador Blue Team',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Seguridad Perimetral & Firewalls NGFW',
    badge: 'Hardening',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'andres-torres',
    firstName: 'Andrés Alfonso',
    lastName: 'Torres Hernández',
    fullName: 'Andrés Alfonso Torres Hernández',
    role: 'Analista de Amenazas',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Análisis de Malware & Threat Hunting',
    badge: 'Threat Intel',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'albeiro-vergara',
    firstName: 'Albeiro José',
    lastName: 'Vergara Pérez',
    fullName: 'Albeiro José Vergara Pérez',
    role: 'Especialista DFIR',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Informática Forense & Custodia de Evidencias',
    badge: 'Digital Forensics',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rafael-montes',
    firstName: 'Rafael Esteban',
    lastName: 'Montes Paez',
    fullName: 'Rafael Esteban Montes Paez',
    role: 'Pentester Web',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Seguridad en Aplicaciones Web & OWASP Top 10',
    badge: 'AppSec',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'valentina-ayala',
    firstName: 'Valentina',
    lastName: 'Ayala Ruiz',
    fullName: 'Valentina Ayala Ruiz',
    role: 'Investigadora en Criptografía',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Criptografía Aplicada & Privacidad de Datos',
    badge: 'Cryptography',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'miguel-hernandez',
    firstName: 'Miguel Ángel',
    lastName: 'Hernández Gale',
    fullName: 'Miguel Ángel Hernández Gale',
    role: 'Auditor de Sistemas',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Hardening de Servidores Linux & Monitoreo IDS',
    badge: 'SysSec',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'juan-amaya',
    firstName: 'Juan David',
    lastName: 'Amaya Solano',
    fullName: 'Juan David Amaya Solano',
    role: 'Investigador Cloud',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Seguridad Cloud, Contenedores & DevSecOps',
    badge: 'Cloud Sec',
    image: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'jose-mendoza',
    firstName: 'Jose Rafael',
    lastName: 'Mendoza Banda',
    fullName: 'Jose Rafael Mendoza Banda',
    role: 'Investigador IoT',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Seguridad en Redes IoT & Sistemas Embebidos',
    badge: 'IoT Security',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&q=80',
  },
]

export function TeamMembers() {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : MEMBERS.length - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev < MEMBERS.length - 1 ? prev + 1 : 0))
  }

  const currentMember = MEMBERS[activeIndex]

  return (
    <section className="team-showcase-section" id="integrantes">
      {/* Luces de ambiente sutiles */}
      <div className="team-ambient-glow" aria-hidden="true" />

      <div className="team-showcase-container">
        {/* Columna Izquierda: Inspirada en el diseño de la Imagen 1 */}
        <div className="team-info-col">
          <div className="team-kicker-tag">
            <span className="kicker-pulse-dot" />
            (03) EQUIPO HUMANO & INVESTIGADORES
          </div>

          <h2 className="team-main-heading">
            INTEGRANTES DEL
            <span className="team-heading-accent">SEMILLERO GÉMINIS</span>
          </h2>

          {/* Línea de acento distintiva debajo del título (como en la Imagen 1) */}
          <div className="team-heading-accent-line" />

          <p className="team-lead-description">
            Estudiantes e investigadores de <strong>Ingeniería de Sistemas de CECAR</strong> que lideran proyectos formativos
            en ciberseguridad ofensiva, defensa perimetral de redes, informática forense e innovación tecnológica.
          </p>

          <div className="team-member-focus-badge">
            <span className="focus-label">LÍNEA DE ENFOQUE:</span>
            <span className="focus-value">{currentMember.focusArea}</span>
          </div>

          {/* Controles de navegación circular (como en la Imagen 1) */}
          <div className="team-nav-controls">
            <button
              type="button"
              className="team-circle-btn"
              onClick={handlePrev}
              aria-label="Integrante anterior"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              className="team-circle-btn active"
              onClick={handleNext}
              aria-label="Siguiente integrante"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className="team-counter-display">
              <span className="counter-current">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="counter-sep">/</span>
              <span className="counter-total">{String(MEMBERS.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha / Carrusel de Tarjetas Verticales (como en la Imagen 1) */}
        <div className="team-carousel-col">
          <div className="team-cards-track" ref={trackRef}>
            {MEMBERS.map((member, index) => {
              const isActive = index === activeIndex
              const isAdjacent = index === (activeIndex + 1) % MEMBERS.length
              const isPrev = index === (activeIndex - 1 + MEMBERS.length) % MEMBERS.length

              return (
                <div
                  key={member.id}
                  className={`team-portrait-card ${isActive ? 'is-active' : ''} ${isAdjacent ? 'is-next' : ''} ${isPrev ? 'is-prev' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveIndex(index)
                    }
                  }}
                  aria-label={`Ver perfil de ${member.fullName}`}
                  style={{
                    transform: `translateX(${(index - activeIndex) * 105}%) scale(${isActive ? 1 : 0.92})`,
                    opacity: isActive ? 1 : Math.abs(index - activeIndex) <= 1 ? 0.45 : 0,
                    pointerEvents: Math.abs(index - activeIndex) <= 1 ? 'auto' : 'none',
                    zIndex: isActive ? 5 : 2,
                  }}
                >
                  {/* Foto de retrato */}
                  <img
                    src={member.image}
                    alt={member.fullName}
                    className="member-portrait-img"
                    loading="lazy"
                  />

                  {/* Degradado cinematográfico oscuro inferior */}
                  <div className="portrait-dark-overlay" />

                  {/* Chip de especialización técnica */}
                  <div className="card-top-tag">
                    <span className="tag-dot" />
                    <span>{member.badge}</span>
                  </div>

                  {/* Contenido flotante inferior al estilo de la Imagen 1 */}
                  <div className="portrait-info-overlay">
                    {/* Botón circular interactivo de acción (como el play button de la Imagen 1) */}
                    <div className="portrait-action-circle" title="Perfil activo de investigación">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4" />
                      </svg>
                    </div>

                    {/* Nombre estructurado en dos líneas estilizadas */}
                    <div className="member-name-block">
                      <span className="member-first-name">{member.firstName}</span>
                      <strong className="member-last-name">{member.lastName}</strong>
                    </div>

                    {/* Línea sutil divisoria */}
                    <div className="member-underline-bar" />

                    {/* Programa académico y rol */}
                    <span className="member-program-text">{member.program}</span>
                    <span className="member-role-text">{member.role}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Indicadores de paginación inferiores en puntos */}
          <div className="team-dots-nav">
            {MEMBERS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`team-dot ${i === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ir al integrante ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
