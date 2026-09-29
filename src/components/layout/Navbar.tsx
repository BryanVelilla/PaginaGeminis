const navigation = ['Inicio', 'Semillero', 'Noticias', 'Proyectos', 'Comunidad']

export function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav-wrap" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="Semillero Geminis, inicio">
          <span className="brand-mark" aria-hidden="true">G</span>
          <span>SEMILLERO<br />GEMINIS</span>
        </a>

        <div className="nav-links">
          {navigation.map((item) => (
            <a href={item === 'Inicio' ? '#inicio' : `#${item.toLowerCase()}`} key={item}>{item}</a>
          ))}
        </div>

        <a className="nav-cta" href="#comunidad">Unirme</a>
      </nav>
    </header>
  )
}
