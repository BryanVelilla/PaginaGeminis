import { UserMenu } from '../auth/UserMenu'

const navigation = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Semillero', href: '#semillero' },
  { label: 'Integrantes', href: '#integrantes' },
  { label: 'Investigaciones', href: '#investigaciones' },
  { label: 'Noticias', href: '#noticias' },
]

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
            <a href={item.href} key={item.label}>{item.label}</a>
          ))}
        </div>

        <div className="nav-right-actions">
          <UserMenu />
        </div>
      </nav>
    </header>
  )
}
