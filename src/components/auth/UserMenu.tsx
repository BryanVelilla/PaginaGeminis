import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout, openLoginModal, openDashboard } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="nav-auth-container">
        <button
          type="button"
          className="nav-login-btn"
          onClick={openLoginModal}
          id="nav-btn-login"
        >
          <span className="login-icon" aria-hidden="true">🔒</span>
          <span>Iniciar Sesión</span>
        </button>
      </div>
    );
  }

  const getRoleClass = () => {
    switch (user.role) {
      case 'docente':
        return 'role-badge-docente';
      case 'semillerista':
        return 'role-badge-semillerista';
      case 'visitante':
        return 'role-badge-visitante';
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case 'docente':
        return 'Docente';
      case 'semillerista':
        return 'Semillerista';
      case 'visitante':
        return 'Visitante';
    }
  };

  const canAccessDashboard = user.role === 'semillerista' || user.role === 'docente';

  return (
    <div className="nav-auth-container" ref={menuRef}>
      <button
        type="button"
        className="nav-user-pill"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-label="Menú de usuario"
      >
        <span className="user-avatar-dot">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="user-avatar-img" />
          ) : (
            user.name.charAt(0)
          )}
        </span>
        <span className="user-name-label">{user.name.split(' ')[0]}</span>
        <span className={`user-role-badge ${getRoleClass()}`}>
          {getRoleLabel()}
        </span>
        <span className="user-chevron">{dropdownOpen ? '▲' : '▼'}</span>
      </button>

      {dropdownOpen && (
        <div className="nav-user-dropdown">
          {/* User profile brief */}
          <div className="dropdown-user-header">
            <div className="dropdown-avatar-wrap">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="dropdown-avatar" />
              ) : (
                <div className="dropdown-avatar-fallback">{user.name.charAt(0)}</div>
              )}
            </div>
            <div className="dropdown-user-info">
              <div className="dropdown-user-name">{user.name}</div>
              <div className="dropdown-user-email">{user.email}</div>
              <div className="dropdown-user-program">{user.program || user.institution}</div>
            </div>
          </div>

          <div className="dropdown-role-banner">
            <span className={`role-badge ${getRoleClass()}`}>
              Rol: {getRoleLabel().toUpperCase()}
            </span>
            <p className="dropdown-role-desc">
              {user.role === 'docente' &&
                'Permisos completos: Publicar artículos, asociar investigadores y registrar nuevos semilleristas.'}
              {user.role === 'semillerista' &&
                'Permisos de investigación: Publicar artículos, asociar docentes y compañeros que colaboraron, y opinar.'}
              {user.role === 'visitante' &&
                'Permisos de comunidad: Habilitado para consultar publicaciones y publicar opiniones técnicas.'}
            </p>
          </div>

          {/* Action links */}
          <div className="dropdown-actions">
            {canAccessDashboard && (
              <button
                type="button"
                className="dropdown-action-btn primary"
                onClick={() => {
                  setDropdownOpen(false);
                  openDashboard();
                }}
              >
                <span>⚙️ Panel de Investigación</span>
                <span className="action-hint">
                  {user.role === 'docente' ? 'Publicar & Gestionar' : 'Publicar Artículos'}
                </span>
              </button>
            )}

            <button
              type="button"
              className="dropdown-action-btn"
              onClick={() => {
                setDropdownOpen(false);
                openLoginModal();
              }}
            >
              <span>🔄 Cambiar de Cuenta / Rol</span>
            </button>

            <button
              type="button"
              className="dropdown-action-btn danger"
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
            >
              <span>🚪 Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
