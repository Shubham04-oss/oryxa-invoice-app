import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Receipt, Zap, Settings, Menu, X, LogOut } from 'lucide-react';
import { authService } from '../lib/api';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: Receipt },
    { name: 'Automations', href: '/automations', icon: Zap },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActivePath = (href) => {
    if (href === '/dashboard') {
      return router.pathname === href || router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  const MobileIcon = mobileOpen ? X : Menu;

  return (
    <div className="app-shell">
      <header className="nav-wrapper">
        <div className="glass-panel max-container">
          <div className="nav-inner">
            <Link href="/dashboard" className="brand text-gradient">
              Oryxa
            </Link>

            <nav className="nav-links">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`nav-link${active ? ' active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="nav-actions">
              <ThemeToggle id="topbar-theme-toggle" />

              {user && (
                <div className="profile-chip">
                  <div className="profile-avatar">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'OR'}
                  </div>
                  <div>
                    <p className="profile-name">{user.name}</p>
                    <p className="profile-email">{user.email}</p>
                  </div>
                </div>
              )}

              <button type="button" className="nav-logout" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>

              <button
                type="button"
                className="mobile-nav-toggle"
                aria-label="Toggle navigation"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                <MobileIcon size={21} />
              </button>
            </div>
          </div>

          <div className={`mobile-menu glass-panel${mobileOpen ? ' open' : ''}`}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`mobile-nav-link${active ? ' active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {user && (
              <div className="mobile-nav-link" style={{ marginTop: '0.5rem', cursor: 'default' }}>
                <div className="profile-avatar" style={{ width: 38, height: 38 }}>
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'OR'}
                </div>
                <div>
                  <p className="profile-name" style={{ fontSize: '0.85rem' }}>{user.name}</p>
                  <p className="profile-email" style={{ fontSize: '0.75rem' }}>{user.email}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              className="mobile-nav-link"
              style={{ justifyContent: 'space-between' }}
              onClick={handleLogout}
            >
              <span>Logout</span>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="app-content">
        <div className="max-container">
          {children}
        </div>
      </main>
    </div>
  );
}
