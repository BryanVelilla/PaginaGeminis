import { useState } from 'react'
import { CyberRadar } from '../visuals/CyberRadar'
import { TerminalSim } from '../visuals/TerminalSim'

interface Pillar {
  id: string
  num: string
  title: string
  tag: string
  desc: string
  tools: string[]
  icon: string
}

const pillars: Pillar[] = [
  {
    id: 'cybersec-offensive',
    num: '01',
    title: 'Ciberseguridad Ofensiva & Ethical Hacking',
    tag: 'RED TEAM / PENTESTING',
    desc: 'Simulaciones controladas de adversarios, análisis metódico de vulnerabilidades (OWASP Top 10, PTES), auditoría de aplicaciones web y explotación ética para anticipar y neutralizar brechas antes de que ocurran.',
    tools: ['Kali Linux', 'Burp Suite', 'Metasploit', 'Nmap', 'OWASP ZAP'],
    icon: '⚔️',
  },
  {
    id: 'network-defense',
    num: '02',
    title: 'Defensa de Redes & Arquitecturas Zero-Trust',
    tag: 'BLUE TEAM / HARDENING',
    desc: 'Diseño e implementación de perímetros de red blindados, inspección profunda de paquetes (DPI), configuración de firewalls de próxima generación, segmentación VLAN y túneles criptográficos WireGuard/IPsec.',
    tools: ['Wireshark', 'Suricata IDS', 'Zeek', 'pfSense', 'WireGuard'],
    icon: '🛡️',
  },
  {
    id: 'forensics',
    num: '03',
    title: 'Informática Forense & Respuesta a Incidentes (DFIR)',
    tag: 'FORENSIC INVESTIGATION',
    desc: 'Metodologías para la adquisición rigurosa de evidencias digitales, análisis de memoria RAM, inspección de registros de eventos en sistemas comprometidos y mantenimiento de la cadena de custodia probatoria.',
    tools: ['Autopsy', 'Volatility', 'FTK Imager', 'Sleuth Kit', 'YARA'],
    icon: '🔬',
  },
  {
    id: 'cloud-iot',
    num: '04',
    title: 'Criptografía, Cloud Security & Protección IoT',
    tag: 'APPLIED CRYPTO & IOT',
    desc: 'Investigación en algoritmos de cifrado simétrico y asimétrico, gestión segura de identidades y accesos (IAM), auditorías de posturas de seguridad en la nube y hardening de dispositivos IoT.',
    tools: ['OpenSSL', 'Docker Security', 'HashiCorp Vault', 'AWS IAM', 'MQTT Sec'],
    icon: '⚡',
  },
]

const roadmapSteps = [
  {
    step: '01',
    title: 'Fundamentación & Shell',
    desc: 'Inmersión en arquitectura Linux, modelo TCP/IP a bajo nivel, sockets y automatización de tareas con Python y Bash.',
    badge: 'Nivel Inicial',
  },
  {
    step: '02',
    title: 'Laboratorio & Desafíos CTF',
    desc: 'Entrenamiento intensivo en plataformas internacionales (Hack The Box, TryHackMe) y war rooms internas de ataque y defensa.',
    badge: 'Entrenamiento Activo',
  },
  {
    step: '03',
    title: 'Proyectos I+D & Herramientas',
    desc: 'Desarrollo de prototipos de seguridad, scripts de auditoría automática y formulación de proyectos para opción de grado.',
    badge: 'Investigación Aplicada',
  },
  {
    step: '04',
    title: 'Publicación & RedCOLSI',
    desc: 'Socialización de resultados en encuentros departamentales y nacionales de semilleros, conferencias académicas y ponencias.',
    badge: 'Impacto & Divulgación',
  },
]

export function AboutGeminis() {
  const [activePillar, setActivePillar] = useState<string>(pillars[0].id)
  const currentPillar = pillars.find((p) => p.id === activePillar) || pillars[0]

  return (
    <section className="about-geminis-section" id="semillero">
      {/* Background ambient lighting effects */}
      <div className="section-ambient-orb orb-primary" aria-hidden="true" />
      <div className="section-ambient-orb orb-secondary" aria-hidden="true" />

      {/* Infinite scrolling stroke text inspired by Behance project showcase */}
      <div className="marquee-wrapper" aria-hidden="true">
        <div className="marquee-track">
          <span>SEMILLERO GÉMINIS // CORPORACIÓN UNIVERSITARIA DEL CARIBE (CECAR) // CIBERSEGURIDAD // REDES DE DATOS // I+D+i // ETHICAL HACKING // FORENSE DIGITAL // INVESTIGACIÓN APLICADA // SINCELEJO, SUCRE // </span>
          <span>SEMILLERO GÉMINIS // CORPORACIÓN UNIVERSITARIA DEL CARIBE (CECAR) // CIBERSEGURIDAD // REDES DE DATOS // I+D+i // ETHICAL HACKING // FORENSE DIGITAL // INVESTIGACIÓN APLICADA // SINCELEJO, SUCRE // </span>
        </div>
      </div>

      <div className="about-container">
        {/* Section Header & Academic Identity */}
        <header className="about-header">
          <div className="header-badges">
            <span className="glass-badge highlight">
              <span className="badge-glow-dot" />
              (01) SEMILLERO DE INVESTIGACIÓN CECAR
            </span>
            <span className="glass-badge">📍 Sincelejo, Sucre</span>
            <span className="glass-badge">🏛️ Fac. de Ciencias Básicas e Ingenierías</span>
            <span className="glass-badge accent">Ingeniería de Sistemas</span>
          </div>

          <h2 className="about-title">
            ¿QUÉ ES EL <span className="title-gradient">SEMILLERO GÉMINIS</span>?
          </h2>

          <p className="about-lead">
            <strong>Semillero Géminis</strong> es el núcleo de investigación formativa de la{' '}
            <strong>Corporación Universitaria del Caribe (CECAR)</strong> dedicado al estudio profundo, experimentación y
            desarrollo de soluciones de vanguardia en <strong>ciberseguridad, defensa de redes e infraestructura digital</strong>.
          </p>

          <p className="about-subtext">
            Nacimos con el propósito de cerrar la brecha entre la teoría académica y el panorama real de ciberamenazas.
            Formamos a los futuros ingenieros y especialistas con una rigurosa base ética, capacidad de análisis crítico y
            habilidades prácticas para proteger la soberanía y privacidad de la información en entornos locales, nacionales e internacionales.
          </p>
        </header>

        {/* Bento Grid: Core Technical Pillars & Radar Showcase */}
        <div className="about-bento-grid">
          {/* Card 1: Interactive Research Pillars */}
          <div className="bento-card bento-pillars">
            <div className="card-header-row">
              <div>
                <span className="card-kicker">LÍNEAS DE INVESTIGACIÓN I+D+i</span>
                <h3 className="card-heading">Áreas de Especialización Técnica</h3>
              </div>
              <span className="card-pill-counter">4 EJES ACTIVOS</span>
            </div>

            {/* Pillar tabs */}
            <div className="pillar-tabs" role="tablist">
              {pillars.map((pillar) => (
                <button
                  key={pillar.id}
                  type="button"
                  role="tab"
                  aria-selected={activePillar === pillar.id}
                  className={`pillar-tab-btn ${activePillar === pillar.id ? 'active' : ''}`}
                  onClick={() => setActivePillar(pillar.id)}
                >
                  <span className="tab-num">{pillar.num}</span>
                  <span className="tab-icon">{pillar.icon}</span>
                  <span className="tab-title">{pillar.title.split('&')[0]}</span>
                </button>
              ))}
            </div>

            {/* Active Pillar Details Display */}
            <div className="pillar-detail-view" key={currentPillar.id}>
              <div className="pillar-top">
                <span className="pillar-badge-tag">{currentPillar.tag}</span>
                <span className="pillar-index-id">LÍNEA {currentPillar.num}</span>
              </div>
              <h4 className="pillar-detail-title">{currentPillar.title}</h4>
              <p className="pillar-detail-desc">{currentPillar.desc}</p>

              <div className="pillar-tools-section">
                <span className="tools-label">TECNOLOGÍAS & HERRAMIENTAS EXPLORADAS:</span>
                <div className="tools-tags">
                  {currentPillar.tools.map((tool) => (
                    <span key={tool} className="tool-tag">
                      <code>$</code> {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: CyberRadar Component */}
          <div className="bento-card bento-radar-wrap">
            <CyberRadar />
          </div>

          {/* Card 3: Formative Roadmap (similar to Behance project process flow) */}
          <div className="bento-card bento-roadmap">
            <div className="card-header-row">
              <div>
                <span className="card-kicker">RUTA FORMATIVA DEL SEMILLERISTA</span>
                <h3 className="card-heading">Ciclo de Aprendizaje & Evolución en CECAR</h3>
              </div>
              <span className="glass-pill-tag">METODOLOGÍA I+D</span>
            </div>

            <div className="roadmap-grid">
              {roadmapSteps.map((step) => (
                <div key={step.step} className="roadmap-node">
                  <div className="node-head">
                    <span className="node-number">{step.step}</span>
                    <span className="node-badge">{step.badge}</span>
                  </div>
                  <h4 className="node-title">{step.title}</h4>
                  <p className="node-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Terminal Simulation & Academic Quick Stats */}
          <div className="bento-card bento-terminal-wrap">
            <div className="card-header-row">
              <div>
                <span className="card-kicker">CONSOLA DE INVESTIGACIÓN INTERACTIVA</span>
                <h3 className="card-heading">Laboratorio en Tiempo Real</h3>
              </div>
              <span className="glass-pill-tag green">TELEMETRÍA EN VIVO</span>
            </div>
            <TerminalSim />
          </div>
        </div>

        {/* Academic Proof & Value Metrics */}
        <div className="about-stats-strip">
          <div className="stat-box">
            <div className="stat-number">CECAR</div>
            <div className="stat-label">Institución Universitaria</div>
            <div className="stat-desc">Corporación Universitaria del Caribe, Sincelejo</div>
          </div>

          <div className="stat-box">
            <div className="stat-number">4+</div>
            <div className="stat-label">Líneas de Profundización</div>
            <div className="stat-desc">Redes, ethical hacking, forense y criptografía</div>
          </div>

          <div className="stat-box">
            <div className="stat-number">100%</div>
            <div className="stat-label">Laboratorio Práctico</div>
            <div className="stat-desc">Entornos CTF, war rooms y simulaciones reales</div>
          </div>

          <div className="stat-box">
            <div className="stat-number">I+D+i</div>
            <div className="stat-label">Investigación Formativa</div>
            <div className="stat-desc">Participación en RedCOLSI y semilleros nacionales</div>
          </div>
        </div>
      </div>
    </section>
  )
}
