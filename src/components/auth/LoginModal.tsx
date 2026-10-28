import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, loginAsRole, registerVisitante } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'demo' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = login(email, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Error al autenticar');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = registerVisitante(regName, regEmail);
    if (!res.success) {
      setErrorMessage(res.message || 'Error al registrar visitante');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
  };

  return (
    <div className="auth-modal-overlay" onClick={closeLoginModal} role="dialog" aria-modal="true">
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="auth-modal-close"
          onClick={closeLoginModal}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-brand-badge">
            <span className="auth-pulse-dot" />
            SISTEMA DE AUTENTICACIÓN // RBAC
          </div>
          <h2 className="auth-modal-title">ACCESO A LA PLATAFORMA</h2>
          <p className="auth-modal-subtitle">
            El sistema asigna permisos automáticamente según el rol de tus credenciales:
            <strong> Visitante</strong>, <strong>Semillerista</strong> o <strong>Docente</strong>.
          </p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
          >
            🔑 Iniciar Sesión
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => { setActiveTab('demo'); setErrorMessage(null); }}
          >
            ⚡ Roles Demo (1-Click)
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
          >
            📝 Registrar Visitante
          </button>
        </div>

        {errorMessage && (
          <div className="auth-alert-error">
            <span className="auth-alert-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: Credential Login */}
        {activeTab === 'login' && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="auth-form-group">
              <label htmlFor="auth-email">Correo Electrónico / Institucional</label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="ej: docente@cecar.edu.co o tu-correo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="auth-password">Contraseña</label>
              <input
                id="auth-password"
                type="password"
                required
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>

            <div className="auth-credentials-hint">
              <div className="hint-title">💡 Credenciales de prueba disponibles:</div>
              <div className="hint-item">
                <span className="role-tag tag-docente">Docente:</span> docente@cecar.edu.co / <code>docente123</code>
              </div>
              <div className="hint-item">
                <span className="role-tag tag-semillerista">Semillerista:</span> semillerista@cecar.edu.co / <code>geminis123</code>
              </div>
              <div className="hint-item">
                <span className="role-tag tag-visitante">Visitante:</span> visitante@gmail.com / <code>visitante123</code>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              <span>Ingresar al Sistema</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>
        )}

        {/* Tab 2: One-Click Demo Access */}
        {activeTab === 'demo' && (
          <div className="auth-demo-cards">
            <p className="demo-instruction">
              Haz clic en cualquiera de los roles para probar al instante sus privilegios:
            </p>

            {/* Docente Card */}
            <div className="auth-role-card role-docente" onClick={() => handleQuickLogin('docente')}>
              <div className="role-card-header">
                <div className="role-card-badge badge-docente">🟡 DOCENTE / DIRECTOR</div>
                <span className="role-card-arrow">Acceder →</span>
              </div>
              <div className="role-card-name">{DEMO_USERS.docente.name}</div>
              <div className="role-card-desc">{DEMO_USERS.docente.program}</div>
              <ul className="role-capabilities-list">
                <li>✓ Publicar opiniones en artículos</li>
                <li>✓ Publicar investigaciones y artículos propios</li>
                <li>✓ Asociar docentes y semilleristas colaboradores</li>
                <li>✓ <strong>Registrar y asociar nuevos semilleristas</strong></li>
              </ul>
            </div>

            {/* Semillerista Card */}
            <div className="auth-role-card role-semillerista" onClick={() => handleQuickLogin('semillerista')}>
              <div className="role-card-header">
                <div className="role-card-badge badge-semillerista">🔵 SEMILLERISTA</div>
                <span className="role-card-arrow">Acceder →</span>
              </div>
              <div className="role-card-name">{DEMO_USERS.semillerista.name}</div>
              <div className="role-card-desc">{DEMO_USERS.semillerista.program}</div>
              <ul className="role-capabilities-list">
                <li>✓ Publicar opiniones en artículos</li>
                <li>✓ <strong>Panel de publicación de artículos e investigaciones</strong></li>
                <li>✓ <strong>Asociar docentes y otros semilleristas que aportaron</strong></li>
                <li>✗ Registrar nuevos semilleristas (restringido a docentes)</li>
              </ul>
            </div>

            {/* Visitante Card */}
            <div className="auth-role-card role-visitante" onClick={() => handleQuickLogin('visitante')}>
              <div className="role-card-header">
                <div className="role-card-badge badge-visitante">🟢 VISITANTE</div>
                <span className="role-card-arrow">Acceder →</span>
              </div>
              <div className="role-card-name">{DEMO_USERS.visitante.name}</div>
              <div className="role-card-desc">Comunidad Académica Externa</div>
              <ul className="role-capabilities-list">
                <li>✓ <strong>Publicar opiniones y comentarios técnicos en artículos</strong></li>
                <li>✓ Explorar investigaciones, metodologías y autores</li>
                <li>✗ No tiene acceso al panel de publicación de artículos</li>
                <li>✗ No puede registrar semilleristas</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Register as Visitante */}
        {activeTab === 'register' && (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <p className="demo-instruction">
              Crea tu perfil de visitante para participar con opiniones en las investigaciones del semillero:
            </p>
            <div className="auth-form-group">
              <label htmlFor="reg-name">Nombre Completo</label>
              <input
                id="reg-name"
                type="text"
                required
                placeholder="ej: Andrés Martínez"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="auth-input"
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="reg-email">Correo Electrónico</label>
              <input
                id="reg-email"
                type="email"
                required
                placeholder="ej: andres.martinez@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="auth-input"
              />
            </div>
            <button type="submit" className="auth-submit-btn">
              <span>Registrarse y Acceder como Visitante</span>
              <span aria-hidden="true">✓</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
