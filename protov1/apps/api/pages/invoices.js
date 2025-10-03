// Invoices list page
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { invoiceService, formatCurrency } from '../lib/api';

const FILTERS = ['all', 'draft', 'sent', 'paid', 'overdue'];

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await invoiceService.list({ limit: 100 });
        setInvoices(response?.data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    if (filter === 'all') return invoices;
    return invoices.filter((invoice) => invoice.status === filter);
  }, [invoices, filter]);

  const countByStatus = (status) => {
    if (status === 'all') return invoices.length;
    return invoices.filter((invoice) => invoice.status === status).length;
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const badgeClass = (status) => {
    const map = {
      draft: 'badge badge-draft',
      sent: 'badge badge-sent',
      paid: 'badge badge-paid',
      overdue: 'badge badge-overdue',
      cancelled: 'badge badge-cancelled',
    };
    return map[status] || map.draft;
  };

  return (
    <Layout>
      <div className="space-y-12">
        <header className="glass-panel dashboard-hero">
          <div className="dashboard-hero-lead">
            <span className="badge badge-sent dashboard-hero-tag">Invoice Hub</span>
            <h1 className="dashboard-hero-title">
              Manage every client touchpoint in one curated space
            </h1>
            <p className="dashboard-hero-subtitle" style={{ maxWidth: 560 }}>
              Filter, review, and ship invoices without leaving the glass dashboard. Your billing operations, simplified.
            </p>
          </div>

          <div className="dashboard-hero-actions">
            <Link href="/invoice/new" className="btn-primary">
              + New Invoice
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </header>

        <section>
          <div className="filter-group">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={`filter-chip${filter === item ? ' active' : ''}`}
                onClick={() => setFilter(item)}
              >
                {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)} ({countByStatus(item)})
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="table-card empty-state" style={{ padding: '3.75rem 1.75rem' }}>
            <div className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>
              Loading invoices…
            </div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="table-card empty-state">
            <div className="empty-icon">📄</div>
            <h3 className="section-title">No invoices match this filter</h3>
            <p className="section-subtitle">
              Try switching filters or create a fresh invoice to populate your list.
            </p>
            <Link href="/invoice/new" className="btn-primary">
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="invoice-grid">
            {filteredInvoices.map((invoice) => (
              <Link href={`/invoice/${invoice.id}`} key={invoice.id} className="invoice-card">
                <div className="invoice-card-header">
                  <span className="invoice-number">{invoice.invoiceNumber}</span>
                  <span className={badgeClass(invoice.status)} style={{ textTransform: 'capitalize' }}>
                    {invoice.status || 'draft'}
                  </span>
                </div>

                <div className="client-info">
                  <span className="client-name">{invoice.clientName || 'Unnamed client'}</span>
                  <span className="client-email">{invoice.clientEmail || '—'}</span>
                </div>

                <div className="invoice-details">
                  <div>
                    <p className="invoice-detail-label">Amount</p>
                    <p className="invoice-detail-value invoice-amount">{invoice.total || invoice.total === 0 ? formatCurrency(invoice.total) : '—'}</p>
                  </div>
                  <div>
                    <p className="invoice-detail-label">Due Date</p>
                    <p className="invoice-detail-value">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>

                <div className="invoice-footer">
                  <span>{invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}</span>
                  <span>View →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
