import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useResearch } from '../../context/ResearchContext';
import type { AssociatedDocente, AssociatedSemillerista } from '../../types/research';

export const ResearchDashboardModal: React.FC = () => {
  const { user, isDashboardOpen, closeDashboard } = useAuth();
  const { publications, members, docentes, addPublication, registerSemillerista } = useResearch();

  const [activeTab, setActiveTab] = useState<'publish' | 'my-pubs' | 'manage-members'>('publish');

  // Form states for new publication
  const [pubTitle, setPubTitle] = useState('');
  const [pubAbstract, setPubAbstract] = useState('');
  const [pubContent, setPubContent] = useState('');
  const [pubCategory, setPubCategory] = useState('Ciberseguridad Ofensiva');
  const [pubReadTime, setPubReadTime] = useState('8 min');
  const [pubTags, setPubTags] = useState('');
  const [pubLink, setPubLink] = useState('');
  const [pubDoi, setPubDoi] = useState('');
  const [selectedDocenteIds, setSelectedDocenteIds] = useState<string[]>([]);
  const [selectedSemilleristaIds, setSelectedSemilleristaIds] = useState<string[]>([]);
  const [pubSuccess, setPubSuccess] = useState<string | null>(null);
  const [pubError, setPubError] = useState<string | null>(null);

  // Form states for registering new semillerista (Docente only)
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberProgram, setNewMemberProgram] = useState('Ingeniería de Sistemas // CECAR');
  const [newMemberFocus, setNewMemberFocus] = useState('');
  const [newMemberBadge, setNewMemberBadge] = useState('');
  const [memberSuccess, setMemberSuccess] = useState<string | null>(null);
  const [memberError, setMemberError] = useState<string | null>(null);

  if (!isDashboardOpen || !user) return null;

  // Permissions check
  const isDocente = user.role === 'docente';
  const isSemillerista = user.role === 'semillerista';

  if (!isDocente && !isSemillerista) {
    return (
      <div className="auth-modal-overlay" onClick={closeDashboard}>
        <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="auth-alert-error">
            <span>Acceso Denegado: Tu rol de Visitante no tiene acceso a este panel de administración.</span>
          </div>
          <button type="button" className="auth-submit-btn" onClick={closeDashboard}>
            Entendido
          </button>
        </div>
      </div>
    );
  }

  // Toggle Docente association
  const toggleDocente = (docenteId: string) => {
    setSelectedDocenteIds((prev) =>
      prev.includes(docenteId) ? prev.filter((id) => id !== docenteId) : [...prev, docenteId]
    );
  };

  // Toggle Semillerista association
  const toggleSemillerista = (memberId: string) => {
    setSelectedSemilleristaIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  // Submit publication
  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPubSuccess(null);
    setPubError(null);

    const associatedDocentesList: AssociatedDocente[] = docentes.filter((d) =>
      selectedDocenteIds.includes(d.id)
    );

    const associatedSemilleristasList: AssociatedSemillerista[] = members
      .filter((m) => selectedSemilleristaIds.includes(m.id))
      .map((m) => ({
        id: m.id,
        name: m.fullName,
        program: m.program,
        focusArea: m.focusArea,
      }));

    const tagsArray = pubTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const res = addPublication({
      title: pubTitle,
      abstract: pubAbstract,
      content: pubContent || pubAbstract,
      category: pubCategory,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      readTime: pubReadTime || '5 min',
      tags: tagsArray.length > 0 ? tagsArray : ['Ciberseguridad', 'Investigación'],
      linkUrl: pubLink || undefined,
      doi: pubDoi || undefined,
      associatedDocentes: associatedDocentesList,
      associatedSemilleristas: associatedSemilleristasList,
    });

    if (res.success) {
      setPubSuccess('¡Artículo de investigación publicado exitosamente y disponible en la plataforma!');
      // Reset form
      setPubTitle('');
      setPubAbstract('');
      setPubContent('');
      setPubTags('');
      setPubLink('');
      setPubDoi('');
      setSelectedDocenteIds([]);
      setSelectedSemilleristaIds([]);
    } else {
      setPubError(res.message || 'Error al publicar artículo.');
    }
  };

  // Submit new semillerista registration (Docente only)
  const handleRegisterMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberSuccess(null);
    setMemberError(null);

    const res = registerSemillerista({
      fullName: newMemberName,
      email: newMemberEmail,
      program: newMemberProgram,
      focusArea: newMemberFocus || 'Investigación en Ciberseguridad',
      badge: newMemberBadge || 'Semillerista',
    });

    if (res.success) {
      setMemberSuccess(`¡Semillerista "${newMemberName}" registrado y asociado exitosamente al semillero!`);
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberFocus('');
      setNewMemberBadge('');
    } else {
      setMemberError(res.message || 'Error al registrar semillerista.');
    }
  };

  return (
    <div className="dashboard-overlay" onClick={closeDashboard} role="dialog" aria-modal="true">
      <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="dashboard-top-bar">
          <div className="dashboard-title-group">
            <span className="dashboard-kicker">
              <span className="dashboard-pulse-dot" />
              SISTEMA INTEGRADO DE INVESTIGACIÓN // GÉMINIS
            </span>
            <h2 className="dashboard-heading">PANEL DE GESTIÓN CIENTÍFICA</h2>
          </div>

          <div className="dashboard-user-badge">
            <span className="dashboard-user-name">{user.name}</span>
            <span className={`dashboard-badge-tag ${isDocente ? 'badge-docente' : 'badge-semillerista'}`}>
              {isDocente ? 'DOCENTE INVESTIGADOR' : 'SEMILLERISTA'}
            </span>
            <button className="dashboard-close-btn" onClick={closeDashboard} aria-label="Cerrar panel">
              ✕
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="dashboard-tabs">
          <button
            type="button"
            className={`dashboard-tab ${activeTab === 'publish' ? 'active' : ''}`}
            onClick={() => setActiveTab('publish')}
          >
            ✍️ Publicar Investigación
          </button>
          <button
            type="button"
            className={`dashboard-tab ${activeTab === 'my-pubs' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-pubs')}
          >
            📚 Repositorio ({publications.length})
          </button>
          {isDocente && (
            <button
              type="button"
              className={`dashboard-tab tab-admin ${activeTab === 'manage-members' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage-members')}
            >
              👥 Gestión de Semilleristas (Exclusivo Docente)
            </button>
          )}
        </div>

        {/* TAB 1: Publish Research Paper */}
        {activeTab === 'publish' && (
          <div className="dashboard-pane">
            <div className="pane-intro">
              <h3>Formular y Publicar Nueva Investigación</h3>
              <p>
                Como <strong>{isDocente ? 'Docente' : 'Semillerista'}</strong>, puedes dar a conocer los
                hallazgos de tus proyectos y asociar formalmente a los docentes y compañeros semilleristas que aportaron
                a su desarrollo.
              </p>
            </div>

            {pubSuccess && (
              <div className="auth-alert-success">
                <span>✅ {pubSuccess}</span>
              </div>
            )}

            {pubError && (
              <div className="auth-alert-error">
                <span>⚠️ {pubError}</span>
              </div>
            )}

            <form onSubmit={handlePublishSubmit} className="dashboard-form">
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="pub-title">Título del Artículo o Investigación *</label>
                  <input
                    id="pub-title"
                    type="text"
                    required
                    placeholder="ej: Detección de Inyecciones SQL con Modelos Transformer en Edge Devices"
                    value={pubTitle}
                    onChange={(e) => setPubTitle(e.target.value)}
                    className="dashboard-input"
                  />
                </div>
              </div>

              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="pub-cat">Línea Temática / Categoría *</label>
                  <select
                    id="pub-cat"
                    value={pubCategory}
                    onChange={(e) => setPubCategory(e.target.value)}
                    className="dashboard-select"
                  >
                    <option value="Ciberseguridad Ofensiva">Ciberseguridad Ofensiva & Red Team</option>
                    <option value="Defensa de Redes">Defensa de Redes & Hardening</option>
                    <option value="Forense & DFIR">Informática Forense & DFIR</option>
                    <option value="Cloud & Criptografía">Cloud Security & Criptografía</option>
                    <option value="Inteligencia de Amenazas">Threat Intel & Malware Analysis</option>
                    <option value="IoT Security">Seguridad en IoT & Sistemas Embebidos</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="pub-read">Tiempo de Lectura Estimado</label>
                  <input
                    id="pub-read"
                    type="text"
                    placeholder="ej: 8 min"
                    value={pubReadTime}
                    onChange={(e) => setPubReadTime(e.target.value)}
                    className="dashboard-input"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="pub-abstract">Resumen Ejecutivo / Abstract *</label>
                <textarea
                  id="pub-abstract"
                  required
                  rows={3}
                  placeholder="Síntesis de la problemática, objetivos del estudio, enfoque metodológico y conclusiones clave..."
                  value={pubAbstract}
                  onChange={(e) => setPubAbstract(e.target.value)}
                  className="dashboard-textarea"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="pub-content">Detalle Técnico & Metodología (Opcional)</label>
                <textarea
                  id="pub-content"
                  rows={4}
                  placeholder="Profundización en las pruebas de laboratorio, comandos ejecutados, datasets utilizados..."
                  value={pubContent}
                  onChange={(e) => setPubContent(e.target.value)}
                  className="dashboard-textarea"
                />
              </div>

              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="pub-tags">Etiquetas Técnicas (separadas por coma)</label>
                  <input
                    id="pub-tags"
                    type="text"
                    placeholder="ej: Red Team, Suricata, Docker, ISO 27001"
                    value={pubTags}
                    onChange={(e) => setPubTags(e.target.value)}
                    className="dashboard-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pub-link">Enlace al Repositorio o Documento Completo</label>
                  <input
                    id="pub-link"
                    type="url"
                    placeholder="https://github.com/ o https://cecar.edu.co/..."
                    value={pubLink}
                    onChange={(e) => setPubLink(e.target.value)}
                    className="dashboard-input"
                  />
                </div>
              </div>

              {/* ASOCIACIÓN DE DOCENTES */}
              <div className="association-section">
                <div className="association-header">
                  <div className="association-title">
                    <span className="assoc-icon">🎓</span>
                    <span>Asociar Docentes Asesores / Directores</span>
                  </div>
                  <span className="association-hint">
                    Indica los docentes que guiaron o aportaron a la formulación de esta investigación:
                  </span>
                </div>

                <div className="association-grid">
                  {docentes.map((docente) => {
                    const isSelected = selectedDocenteIds.includes(docente.id);
                    return (
                      <div
                        key={docente.id}
                        className={`assoc-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleDocente(docente.id)}
                      >
                        <div className="assoc-checkbox">
                          {isSelected ? '✓' : ''}
                        </div>
                        <div className="assoc-info">
                          <div className="assoc-name">{docente.name}</div>
                          <div className="assoc-role">{docente.roleTitle}</div>
                          <div className="assoc-sub">{docente.institution}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ASOCIACIÓN DE SEMILLERISTAS */}
              <div className="association-section">
                <div className="association-header">
                  <div className="association-title">
                    <span className="assoc-icon">👥</span>
                    <span>Asociar Semilleristas Colaboradores</span>
                  </div>
                  <span className="association-hint">
                    Selecciona los compañeros del semillero que aportaron o co-crearon este artículo:
                  </span>
                </div>

                <div className="association-grid">
                  {members.map((member) => {
                    const isSelected = selectedSemilleristaIds.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        className={`assoc-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSemillerista(member.id)}
                      >
                        <div className="assoc-checkbox">
                          {isSelected ? '✓' : ''}
                        </div>
                        <div className="assoc-info">
                          <div className="assoc-name">{member.fullName}</div>
                          <div className="assoc-role">{member.focusArea}</div>
                          <span className="assoc-badge">{member.badge}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="dashboard-actions-bar">
                <button type="submit" className="dashboard-submit-btn">
                  <span>Publicar Investigación Ahora</span>
                  <span aria-hidden="true">🚀</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: Repository list */}
        {activeTab === 'my-pubs' && (
          <div className="dashboard-pane">
            <div className="pane-intro">
              <h3>Artículos e Investigaciones Registradas ({publications.length})</h3>
              <p>Revisa el estado de las publicaciones y el feedback recibido por la comunidad académica y visitantes.</p>
            </div>

            <div className="repository-list">
              {publications.map((pub) => (
                <div key={pub.id} className="repo-pub-card">
                  <div className="repo-card-header">
                    <span className="repo-cat-tag">{pub.category}</span>
                    <span className="repo-date">{pub.createdAt}</span>
                  </div>
                  <h4 className="repo-title">{pub.title}</h4>
                  <p className="repo-abstract">{pub.abstract}</p>

                  <div className="repo-associations">
                    {pub.associatedDocentes.length > 0 && (
                      <div className="repo-assoc-group">
                        <span className="assoc-badge-title">🎓 Docentes:</span>
                        {pub.associatedDocentes.map((d) => (
                          <span key={d.id} className="assoc-chip docente">
                            {d.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {pub.associatedSemilleristas.length > 0 && (
                      <div className="repo-assoc-group">
                        <span className="assoc-badge-title">👥 Semilleristas:</span>
                        {pub.associatedSemilleristas.map((s) => (
                          <span key={s.id} className="assoc-chip semillerista">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="repo-footer">
                    <span className="repo-author">Por: {pub.authorName}</span>
                    <span className="repo-comments-count">
                      💬 {pub.comments.length} opiniones registradas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Manage Semilleristas (Docente only) */}
        {isDocente && activeTab === 'manage-members' && (
          <div className="dashboard-pane">
            <div className="pane-intro admin-intro">
              <div className="admin-flag">ADMINISTRACIÓN DOCENTE</div>
              <h3>Registro & Asociación de Nuevos Semilleristas</h3>
              <p>
                Como Docente Director, tienes la facultad de vincular formalmente a nuevos estudiantes
                investigadores al Semillero Géminis. Al registrarlos, quedan habilitados para asociarse en
                publicaciones y autenticarse en la plataforma.
              </p>
            </div>

            {memberSuccess && (
              <div className="auth-alert-success">
                <span>✅ {memberSuccess}</span>
              </div>
            )}

            {memberError && (
              <div className="auth-alert-error">
                <span>⚠️ {memberError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterMemberSubmit} className="dashboard-form admin-form">
              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="mem-name">Nombre y Apellidos del Estudiante *</label>
                  <input
                    id="mem-name"
                    type="text"
                    required
                    placeholder="ej: Sofía Alejandra Martínez"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="dashboard-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mem-email">Correo Institucional *</label>
                  <input
                    id="mem-email"
                    type="email"
                    required
                    placeholder="ej: sofia.martinez@cecar.edu.co"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="dashboard-input"
                  />
                </div>
              </div>

              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="mem-prog">Programa Académico & Universidad</label>
                  <input
                    id="mem-prog"
                    type="text"
                    value={newMemberProgram}
                    onChange={(e) => setNewMemberProgram(e.target.value)}
                    className="dashboard-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mem-focus">Línea de Enfoque Investigativo *</label>
                  <input
                    id="mem-focus"
                    type="text"
                    required
                    placeholder="ej: Pentesting Web, DFIR o Criptografía"
                    value={newMemberFocus}
                    onChange={(e) => setNewMemberFocus(e.target.value)}
                    className="dashboard-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="mem-badge">Insignia / Rol Especial dentro del Semillero</label>
                <input
                  id="mem-badge"
                  type="text"
                  placeholder="ej: Junior Pentester, Analista Blue Team, DevSecOps"
                  value={newMemberBadge}
                  onChange={(e) => setNewMemberBadge(e.target.value)}
                  className="dashboard-input"
                />
              </div>

              <button type="submit" className="dashboard-submit-btn admin-btn">
                <span>Registrar Semillerista Oficial</span>
                <span aria-hidden="true">+</span>
              </button>
            </form>

            {/* List of currently registered semilleristas */}
            <div className="registered-members-roster">
              <h4 className="roster-heading">
                Semilleristas Actualmente Vinculados ({members.length})
              </h4>
              <div className="roster-grid">
                {members.map((m) => (
                  <div key={m.id} className="roster-card">
                    <div className="roster-card-header">
                      <span className="roster-badge">{m.badge}</span>
                      <span className="roster-date">Desde: {m.createdAt}</span>
                    </div>
                    <div className="roster-name">{m.fullName}</div>
                    <div className="roster-email">{m.email}</div>
                    <div className="roster-focus">🎯 {m.focusArea}</div>
                    <div className="roster-program">{m.program}</div>
                    {m.registeredBy && (
                      <div className="roster-by">Vinculado por: {m.registeredBy}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
