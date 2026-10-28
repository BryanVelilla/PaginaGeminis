import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext';
import { useAuth } from '../../context/AuthContext';
import type { Publication } from '../../types/research';

export const ResearchPublications: React.FC = () => {
  const { publications, activePublication, setActivePublication, addComment } = useResearch();
  const { user, isAuthenticated, openLoginModal, openDashboard } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState<number>(5);
  const [commentFeedback, setCommentFeedback] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todas las Investigaciones' },
    { id: 'Ciberseguridad Ofensiva', label: 'Ciberseguridad Ofensiva' },
    { id: 'Defensa de Redes', label: 'Defensa de Redes' },
    { id: 'Forense & DFIR', label: 'Forense & DFIR' },
    { id: 'Cloud & Criptografía', label: 'Cloud & Criptografía' },
  ];

  const filteredPublications = publications.filter((pub) => {
    const matchesCat = selectedCategory === 'all' || pub.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleOpenPublication = (pub: Publication) => {
    setActivePublication(pub);
    setCommentFeedback(null);
    setCommentText('');
  };

  const handleCloseModal = () => {
    setActivePublication(null);
    setCommentFeedback(null);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePublication) return;

    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    const res = addComment(activePublication.id, commentText, commentRating);
    if (res.success) {
      setCommentText('');
      setCommentFeedback('¡Tu opinión técnica ha sido publicada con éxito!');
      setTimeout(() => setCommentFeedback(null), 4000);
    } else {
      setCommentFeedback(res.message || 'Error al enviar opinión.');
    }
  };

  const handlePublishClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (user?.role === 'visitante') {
      alert(
        'Como Visitante, tienes permiso para comentar y emitir opiniones técnicas en los artículos. Para publicar investigaciones originales, debes iniciar sesión con credenciales de Semillerista o Docente.'
      );
      return;
    }
    openDashboard();
  };

  return (
    <section className="research-section" id="investigaciones">
      {/* Background ambient lighting */}
      <div className="research-ambient-glow" aria-hidden="true" />

      <div className="research-container">
        {/* Section Header */}
        <div className="research-header-wrap">
          <div className="research-kicker">
            <span className="research-pulse-dot" />
            (04) PRODUCCIÓN CIENTÍFICA & ARTÍCULOS TÉCNICOS
          </div>

          <div className="research-title-row">
            <h2 className="research-main-title">
              INVESTIGACIONES DEL
              <span className="research-title-accent"> SEMILLERO GÉMINIS</span>
            </h2>

            <button
              type="button"
              className="research-publish-btn"
              onClick={handlePublishClick}
              id="btn-publicar-investigacion"
            >
              <span className="publish-plus-icon">+</span>
              <span>
                {isAuthenticated && user?.role !== 'visitante'
                  ? 'Publicar Investigación'
                  : 'Panel de Publicación'}
              </span>
            </button>
          </div>

          <p className="research-lead-desc">
            Artículos, pruebas de concepto y ponencias científicas desarrolladas por nuestros semilleristas
            con el asesoramiento directo de docentes investigadores. <strong>Los visitantes y miembros de la comunidad
            pueden dejar sus comentarios y análisis críticos.</strong>
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="research-toolbar">
          <div className="research-categories-pills">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`research-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="research-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por título, autor, etiqueta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="research-search-input"
            />
          </div>
        </div>

        {/* Publications Grid */}
        <div className="research-grid">
          {filteredPublications.map((pub) => (
            <article key={pub.id} className="research-card">
              <div className="research-card-top">
                <span className="research-card-category">{pub.category}</span>
                <span className="research-card-readtime">⏱️ {pub.readTime}</span>
              </div>

              <h3 className="research-card-title">{pub.title}</h3>

              <p className="research-card-abstract">{pub.abstract}</p>

              {/* Author Info */}
              <div className="research-card-author">
                <div className="author-avatar-wrap">
                  {pub.authorAvatar ? (
                    <img src={pub.authorAvatar} alt={pub.authorName} className="author-avatar" />
                  ) : (
                    <div className="author-avatar-fallback">{pub.authorName.charAt(0)}</div>
                  )}
                </div>
                <div className="author-meta">
                  <div className="author-name">{pub.authorName}</div>
                  <span className={`author-role-badge badge-${pub.authorRole}`}>
                    {pub.authorRole === 'docente' ? 'Docente Director' : 'Semillerista'}
                  </span>
                </div>
              </div>

              {/* Associated Contributors & Teachers */}
              <div className="research-card-associates">
                {pub.associatedDocentes.length > 0 && (
                  <div className="assoc-group-row">
                    <span className="assoc-group-label">🎓 Asesor:</span>
                    <span className="assoc-docente-name">
                      {pub.associatedDocentes.map((d) => d.name).join(', ')}
                    </span>
                  </div>
                )}

                {pub.associatedSemilleristas.length > 0 && (
                  <div className="assoc-group-row">
                    <span className="assoc-group-label">👥 Co-investigadores:</span>
                    <span className="assoc-semilleristas-names">
                      {pub.associatedSemilleristas.map((s) => s.name.split(' ')[0]).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="research-card-tags">
                {pub.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="research-tag">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Card Footer */}
              <div className="research-card-footer">
                <div className="research-comments-badge">
                  💬 {pub.comments.length} {pub.comments.length === 1 ? 'opinión' : 'opiniones'}
                </div>

                <button
                  type="button"
                  className="research-read-btn"
                  onClick={() => handleOpenPublication(pub)}
                >
                  <span>Ver & Opinar</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredPublications.length === 0 && (
          <div className="research-empty-state">
            <span className="empty-icon">📁</span>
            <h4>No se encontraron artículos con ese criterio</h4>
            <p>Prueba con otros términos de búsqueda o selecciona otra categoría.</p>
          </div>
        )}
      </div>

      {/* DETAILED PUBLICATION & OPINIONS MODAL */}
      {activePublication && (
        <div className="pub-modal-overlay" onClick={handleCloseModal} role="dialog" aria-modal="true">
          <div className="pub-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pub-modal-close"
              onClick={handleCloseModal}
              aria-label="Cerrar artículo"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="pub-modal-header">
              <div className="pub-modal-meta">
                <span className="pub-category-chip">{activePublication.category}</span>
                <span className="pub-date">Publicado: {activePublication.createdAt}</span>
                <span className="pub-readtime">Lectura: {activePublication.readTime}</span>
              </div>

              <h2 className="pub-modal-title">{activePublication.title}</h2>

              {/* Author banner */}
              <div className="pub-modal-author-box">
                <div className="author-avatar-lg">
                  {activePublication.authorAvatar ? (
                    <img src={activePublication.authorAvatar} alt={activePublication.authorName} />
                  ) : (
                    <span>{activePublication.authorName.charAt(0)}</span>
                  )}
                </div>
                <div className="author-details">
                  <div className="author-fullname">{activePublication.authorName}</div>
                  <div className="author-affiliation">
                    <span className={`role-badge-pill badge-${activePublication.authorRole}`}>
                      {activePublication.authorRole === 'docente' ? 'Docente Investigador' : 'Semillerista'}
                    </span>
                    <span>Semillero de Investigación Géminis // CECAR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="pub-modal-body">
              {/* Associated Teachers & Semilleristas Box */}
              <div className="pub-associates-box">
                <h4 className="associates-box-title">Créditos de Cooperación & Asesoría</h4>

                <div className="associates-box-grid">
                  <div className="assoc-column">
                    <div className="column-title">
                      <span className="col-icon">🎓</span>
                      <span>Docentes Asesores que aportaron:</span>
                    </div>
                    {activePublication.associatedDocentes.length > 0 ? (
                      <ul className="assoc-names-list">
                        {activePublication.associatedDocentes.map((d) => (
                          <li key={d.id} className="assoc-item-docente">
                            <strong>{d.name}</strong>
                            {d.roleTitle && <span className="assoc-title-sub"> — {d.roleTitle}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-assoc-text">Sin docentes asociados directamente.</p>
                    )}
                  </div>

                  <div className="assoc-column">
                    <div className="column-title">
                      <span className="col-icon">👥</span>
                      <span>Semilleristas que colaboraron:</span>
                    </div>
                    {activePublication.associatedSemilleristas.length > 0 ? (
                      <ul className="assoc-names-list">
                        {activePublication.associatedSemilleristas.map((s) => (
                          <li key={s.id} className="assoc-item-semillerista">
                            <strong>{s.name}</strong>
                            {s.focusArea && <span className="assoc-title-sub"> ({s.focusArea})</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-assoc-text">Investigación individual.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Research Content */}
              <div className="pub-text-content">
                <h4>Resumen Técnico</h4>
                <p>{activePublication.abstract}</p>

                {activePublication.content && activePublication.content !== activePublication.abstract && (
                  <>
                    <h4>Desarrollo Metodológico</h4>
                    <p>{activePublication.content}</p>
                  </>
                )}

                {activePublication.doi && (
                  <div className="pub-doi-box">
                    <span>Identificador DOI: </span>
                    <code>{activePublication.doi}</code>
                  </div>
                )}
              </div>

              {/* OPINIONS & COMMENTS SECTION */}
              <div className="pub-opinions-section">
                <div className="opinions-header">
                  <h3 className="opinions-heading">
                    Opiniones y Retroalimentación de la Comunidad ({activePublication.comments.length})
                  </h3>
                  <p className="opinions-sub">
                    Espacio abierto para que visitantes, semilleristas y docentes debatan técnicamente
                    sobre esta investigación.
                  </p>
                </div>

                {commentFeedback && (
                  <div className="auth-alert-success">
                    <span>{commentFeedback}</span>
                  </div>
                )}

                {/* Comment Submission Form */}
                {isAuthenticated ? (
                  <form onSubmit={handleCommentSubmit} className="opinion-form">
                    <div className="opinion-user-identity">
                      <span>Opinando como: <strong>{user?.name}</strong></span>
                      <span className={`opinion-role-tag badge-${user?.role}`}>
                        {user?.role.toUpperCase()}
                      </span>
                    </div>

                    <div className="opinion-rating-row">
                      <label htmlFor="opinion-rating">Calificación del Aporte:</label>
                      <div className="rating-stars-select">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${star <= commentRating ? 'active' : ''}`}
                            onClick={() => setCommentRating(star)}
                            aria-label={`${star} estrellas`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="rating-label-num">({commentRating}/5)</span>
                      </div>
                    </div>

                    <textarea
                      required
                      rows={3}
                      placeholder={
                        user?.role === 'visitante'
                          ? 'Escribe tu opinión, sugerencia o perspectiva técnica como visitante...'
                          : 'Aporta tu retroalimentación investigativa o hallazgo complementario...'
                      }
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="opinion-textarea"
                    />

                    <div className="opinion-actions">
                      <button type="submit" className="opinion-submit-btn">
                        <span>Publicar Opinión</span>
                        <span aria-hidden="true">💬</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="opinion-login-cta">
                    <span className="cta-icon">💬</span>
                    <div className="cta-text">
                      <strong>¿Quieres compartir tu opinión técnica sobre este artículo?</strong>
                      <p>Inicia sesión como <strong>Visitante</strong>, <strong>Semillerista</strong> o <strong>Docente</strong> para participar en la conversación.</p>
                    </div>
                    <button
                      type="button"
                      className="cta-login-btn"
                      onClick={openLoginModal}
                    >
                      Iniciar Sesión para Opinar
                    </button>
                  </div>
                )}

                {/* List of existing opinions */}
                <div className="opinions-list">
                  {activePublication.comments.length > 0 ? (
                    activePublication.comments.map((comment) => (
                      <div key={comment.id} className="opinion-card">
                        <div className="opinion-card-header">
                          <div className="opinion-author-col">
                            <span className="opinion-author-name">{comment.authorName}</span>
                            <span className={`opinion-role-chip badge-${comment.authorRole}`}>
                              {comment.authorRole.toUpperCase()}
                            </span>
                          </div>

                          <div className="opinion-meta-col">
                            {comment.rating && (
                              <span className="opinion-stars">
                                {'★'.repeat(comment.rating)}
                                {'☆'.repeat(5 - comment.rating)}
                              </span>
                            )}
                            <span className="opinion-date">
                              {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        <p className="opinion-content">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="no-opinions-msg">
                      Aún no hay opiniones registradas en este trabajo. ¡Sé el primero en aportar una perspectiva!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
