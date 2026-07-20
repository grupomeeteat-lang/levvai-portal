import React from 'react';
import { SECTORS } from './Sidebar';

/**
 * MobileNav — menu de navegação em tela cheia para viewports <= 900px
 * Reaproveita a mesma lista de setores/abas do Sidebar para não duplicar a navegação.
 *
 * Props:
 *  - open: boolean
 *  - activeTab, onTabChange, user, onLogout, badges — mesmas props do Sidebar
 *  - onClose: () => void
 */
export default function MobileNav({
  open,
  activeTab = 'visao-geral',
  onTabChange = () => {},
  user = { name: 'Ike Guimarães', role: 'CEO — Admin' },
  onLogout = () => {},
  badges = {},
  onClose = () => {},
}) {
  if (!open) return null;

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleSelect = (tabId) => {
    onTabChange(tabId);
    onClose();
    window.scrollTo(0, 0);
  };

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-user">
        <div className="mobile-nav-avatar">{initial}</div>
        <div className="mobile-nav-user-info">
          <div className="mobile-nav-user-name">{user?.name || 'Usuário'}</div>
          <div className="mobile-nav-user-role">{user?.role || '—'}</div>
        </div>
        <button type="button" className="mobile-nav-logout" onClick={onLogout}>Sair</button>
      </div>

      {SECTORS.map((sector) => (
        <div key={sector.name} className="mobile-nav-sector">
          <div className="mobile-nav-sector-header">{sector.name}</div>
          {sector.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`mobile-nav-link ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => handleSelect(tab.id)}
            >
              {tab.label}
              {badges[tab.id] ? (
                <span className="mobile-nav-badge">{badges[tab.id]}</span>
              ) : null}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}
