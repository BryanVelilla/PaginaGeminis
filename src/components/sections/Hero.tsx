import { CipherField } from '../visuals/CipherField'

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-content">
        <p className="kicker">Ciberseguridad en movimiento</p>
        <h1>Donde las ideas<br /><span>aprenden a proteger.</span></h1>
        <p className="hero-copy">Una comunidad para explorar, investigar y crear soluciones que hacen más seguro lo digital.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#semillero">Conocer el semillero</a>
          <a className="text-link" href="#semillero">Explorar investigación <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <CipherField />
    </section>
  )
}
