import { SecurityGlobe } from '../visuals/SecurityGlobe'

export function Hero() {
  return (
    <section className="hero-connected" id="inicio">
      <div className="hero-grid-container">
        {/* Left Column: Clean, editorial, human typography */}
        <div className="hero-typography-col">
          <h1 className="hero-title-connected">
            Ciberseguridad<br />
            Conectada.
          </h1>

          <p className="hero-description">
            Investigación formativa y desarrollo tecnológico en seguridad ofensiva, criptografía
            aplicada y defensa de redes globales. Blindando infraestructuras críticas e impulsando el
            talento desde CECAR para el mundo.
          </p>

          <div className="hero-cta-group">
            <a className="hero-btn-primary" href="#investigaciones">
              Explorar Investigaciones
            </a>
            <a className="hero-btn-ghost" href="#integrantes">
              Conocer Integrantes <span className="arrow-icon" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Right Column: 3D Rotating Security Globe */}
        <div className="hero-globe-col">
          <SecurityGlobe />
        </div>
      </div>
    </section>
  )
}
