// Recent Invoices Component
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { invoiceService, formatCurrency, formatDate } from '../lib/api';

export default function RecentInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await invoiceService.list({ limit: 6 });
        setInvoices(response?.data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

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

  if (loading) {
    return (
      <div className="table-card empty-state" style={{ padding: '3.5rem 1.75rem' }}>
        <p className="section-subtitle" style={{ margin: 0 }}>Loading recent invoices…</p>
      </div>
    );
  }

  if (!invoices.length) {
    return (
      <div className="table-card empty-state">
        <div className="empty-icon">📄</div>
        <h3 className="section-title">No invoices yet</h3>
        <p className="section-subtitle">Create your first invoice to see it appear here instantly.</p>
  <Link href="/invoice/new" className="btn-primary" style={{ marginTop: '0.75rem' }}>
          Create Invoice
        </Link>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-header">
        <div className="section-heading">
          <h2 className="section-title">Recent Invoices</h2>
          <p className="section-subtitle">
            Track the latest documents and payment status at a glance.
          </p>
        </div>
  <Link href="/invoices" className="btn-primary">
          View All Invoices
        </Link>
      </div>

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
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="data-row">
                <td className="mono-highlight">{invoice.invoiceNumber}</td>
                <td>
                  <div className="stack-sm">
                    <span className="numeric-strong">{invoice.clientName || 'Unnamed client'}</span>
                    <span className="table-meta" style={{ fontSize: '0.82rem' }}>{invoice.clientEmail || '—'}</span>
                  </div>
                </td>
                <td className="numeric-strong">{invoice.total || invoice.total === 0 ? formatCurrency(invoice.total) : '—'}</td>
                <td className="table-meta">{invoice.dueDate ? formatDate(invoice.dueDate) : '—'}</td>
                <td>
                  <span className={badgeClass(invoice.status)} style={{ textTransform: 'capitalize' }}>
                    {invoice.status || 'draft'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link href={`/invoice/${invoice.id}`} className="btn-ghost" style={{ fontSize: '0.85rem' }}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
