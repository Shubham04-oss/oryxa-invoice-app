import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Plus, FileText, Wallet, CheckCircle2, Timer } from 'lucide-react';
import Layout from '../components/Layout';
import { invoiceService, formatCurrency, formatDate, getStatusBadgeClass } from '../lib/api';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
  const response = await invoiceService.list({ limit: 100 });
  const invoices = response?.data || [];
      
      setRecentInvoices(invoices.slice(0, 5));
      
      const paidInvs = invoices.filter(inv => inv.status === 'paid');
      const pendingInvs = invoices.filter(inv => inv.status === 'sent' || inv.status === 'draft');

      setStats({
        totalInvoices: invoices.length,
  totalAmount: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
  paidAmount: paidInvs.reduce((sum, inv) => sum + (inv.total || 0), 0),
  pendingAmount: pendingInvs.reduce((sum, inv) => sum + (inv.total || 0), 0),
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="table-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <div className="animate-pulse" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Preparing your dashboard…
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-12">
        <header className="glass-panel dashboard-hero">
          <div className="dashboard-hero-lead">
            <span className="badge badge-sent dashboard-hero-tag">Control Center</span>
            <h1 className="dashboard-hero-title">
              Billing & Automation, <span className="text-gradient">refined</span>
            </h1>
            <p className="dashboard-hero-subtitle">
              Monitor pipeline health, track revenue, and activate automations—all from a single glass dashboard.
            </p>
          </div>

          <div className="dashboard-hero-actions">
            <button type="button" className="btn-primary" onClick={() => router.push('/invoice/new')}>
              <Plus size={18} />
              <span>Create Invoice</span>
            </button>
            <button type="button" className="btn-secondary" onClick={() => router.push('/automations')}>
              <Timer size={18} />
              <span>Automation Studio</span>
            </button>
          </div>
        </header>

        <section className="stat-grid">
          <StatsCard title="Total Invoices" value={stats.totalInvoices} icon={FileText} tone="blue" />
          <StatsCard title="Total Amount" value={formatCurrency(stats.totalAmount)} icon={Wallet} tone="teal" delay={80} />
          <StatsCard title="Paid" value={formatCurrency(stats.paidAmount)} icon={CheckCircle2} tone="violet" delay={120} />
          <StatsCard title="Pending" value={formatCurrency(stats.pendingAmount)} icon={Timer} tone="rose" delay={160} />
        </section>

        <section>
          <div className="table-card">
            <div className="table-header">
              <div className="section-heading">
                <h2 className="section-title">Latest Activity</h2>
                <p className="section-subtitle">Keep tabs on the freshest invoices your clients interacted with.</p>
              </div>
              <button type="button" className="btn-primary" onClick={() => router.push('/invoices')}>
                Browse Invoices
              </button>
            </div>

            {recentInvoices.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3 className="section-title">No invoices yet</h3>
                <p className="section-subtitle">
                  Create your first invoice to populate your live activity feed.
                </p>
                <button type="button" className="btn-secondary" onClick={() => router.push('/invoice/new')}>
                  New Invoice
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table-glass">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Client</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="data-row">
                        <td className="mono-highlight">{invoice.invoiceNumber}</td>
                        <td>
                          <div className="stack-sm">
                            <span className="numeric-strong">{invoice.clientName || 'Unnamed client'}</span>
                            <span className="table-meta" style={{ fontSize: '0.82rem' }}>{invoice.clientEmail || '—'}</span>
                          </div>
                        </td>
                        <td className="numeric-strong">{formatCurrency(invoice.total)}</td>
                        <td className="table-meta">{invoice.dueDate ? formatDate(invoice.dueDate) : 'N/A'}</td>
                        <td>
                          <span className={getStatusBadgeClass(invoice.status)} style={{ textTransform: 'capitalize' }}>
                            {invoice.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn-ghost"
                            onClick={() => router.push(`/invoice/${invoice.id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="section-heading" style={{ marginBottom: '1.5rem' }}>
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-subtitle">Move fast on the workflows you touch most.</p>
          </div>
          <div className="quick-actions">
            <div
              className="quick-action-card"
              onClick={() => router.push('/invoice/new')}
            >
              <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, rgba(94, 234, 212, 0.32), rgba(59, 130, 246, 0.32))' }}>
                <Plus size={20} />
              </div>
              <h3 className="quick-action-title">Draft invoice</h3>
              <p className="quick-action-text">Spin up a polished invoice in seconds, ready to share with clients.</p>
            </div>

            <div
              className="quick-action-card"
              onClick={() => router.push('/automations')}
            >
              <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.3), rgba(236, 72, 153, 0.3))' }}>
                ⚡
              </div>
              <h3 className="quick-action-title">Build automation</h3>
              <p className="quick-action-text">Automate reminders, payments, and follow-ups based on invoice status.</p>
            </div>

            <div
              className="quick-action-card"
              onClick={() => router.push('/settings')}
            >
              <div className="quick-action-icon" style={{ background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.28), rgba(37, 99, 235, 0.28))' }}>
                ⚙️
              </div>
              <h3 className="quick-action-title">Update branding</h3>
              <p className="quick-action-text">Keep your invoicing templates aligned with your latest identity.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
