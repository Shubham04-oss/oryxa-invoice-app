import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import { invoiceService, formatCurrency, formatDate } from '../../lib/api';

const STATUS_OPTIONS = ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'];

export default function InvoiceDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [sendState, setSendState] = useState({
    method: 'email',
    recipient: '',
    message: '',
  });
  const [sendLoading, setSendLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await invoiceService.get(id);
        setInvoice(data);
        setSendState((prev) => ({
          ...prev,
          recipient: data.clientEmail || data.clientPhone || '',
        }));
      } catch (err) {
        console.error('Failed to load invoice', err);
        setError(err.response?.data?.error || 'Unable to load invoice.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const totals = useMemo(() => {
    if (!invoice) {
      return {
        subtotal: 0,
        taxTotal: 0,
        discountTotal: 0,
        total: 0,
      };
    }

    return {
      subtotal: invoice.subtotal,
      taxTotal: invoice.taxTotal,
      discountTotal: invoice.discountTotal,
      total: invoice.total,
    };
  }, [invoice]);

  const badgeClass = (status) => {
    const map = {
      draft: 'badge badge-draft',
      sent: 'badge badge-sent',
      viewed: 'badge badge-sent',
      paid: 'badge badge-paid',
      overdue: 'badge badge-overdue',
      cancelled: 'badge badge-cancelled',
    };
    return map[status] || map.draft;
  };

  const handleStatusChange = async (nextStatus) => {
    if (!invoice || invoice.status === nextStatus) return;

    setStatusUpdating(true);
    setError('');
    try {
      const updated = await invoiceService.update(invoice.id, { status: nextStatus });
      setInvoice(updated);
    } catch (err) {
      console.error('Failed to update status', err);
      setError(err.response?.data?.error || 'Failed to update invoice status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSendInvoice = async (event) => {
    event.preventDefault();
    if (!invoice) return;

    setSendLoading(true);
    setSendSuccess('');
    setError('');

    try {
      const payload = {
        method: sendState.method,
        recipient: sendState.recipient,
      };

      if (sendState.method === 'whatsapp') {
        payload.message = sendState.message;
      }

      const response = await invoiceService.send(invoice.id, payload);
      setSendSuccess(response.message || 'Invoice queued for sending.');

      // Refresh invoice to get latest status / pdf flag
      const data = await invoiceService.get(invoice.id);
      setInvoice(data);
    } catch (err) {
      console.error('Failed to send invoice', err);
      setError(err.response?.data?.error || 'Failed to send invoice.');
    } finally {
      setSendLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!invoice) return;

    setPdfGenerating(true);
    setError('');
    setSendSuccess('');

    try {
      const response = await invoiceService.generatePDF(invoice.id);
      setSendSuccess(response.message || 'PDF generated successfully!');

      // Refresh invoice to get the pdfUrl
      const data = await invoiceService.get(invoice.id);
      setInvoice(data);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      setError(err.response?.data?.error || 'Failed to generate PDF.');
    } finally {
      setPdfGenerating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="table-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <div className="animate-pulse" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Loading invoice…
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !invoice) {
    return (
      <Layout>
        <div className="table-card empty-state">
          <div className="empty-icon">⚠️</div>
          <h3 className="section-title">Unable to fetch invoice</h3>
          <p className="section-subtitle">{error}</p>
          <button type="button" className="btn-secondary" onClick={() => router.push('/invoices')}>
            Back to Invoices
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-10">
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div className="section-heading" style={{ marginBottom: '0.75rem' }}>
                <span className="badge badge-sent" style={{ marginBottom: '0.75rem' }}>Invoice</span>
                <h1 className="section-title" style={{ fontSize: '2rem' }}>{invoice?.invoiceNumber}</h1>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-tertiary)' }}>
                <span>Issued {invoice?.issueDate ? formatDate(invoice.issueDate) : '—'}</span>
                <span>Due {invoice?.dueDate ? formatDate(invoice.dueDate) : '—'}</span>
                <span>{invoice?.currency} • {formatCurrency(invoice?.total || 0)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
              <span className={badgeClass(invoice?.status)} style={{ textTransform: 'capitalize' }}>
                {invoice?.status}
              </span>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {STATUS_OPTIONS.map((statusOption) => (
                  <button
                    key={statusOption}
                    type="button"
                    className={`btn-ghost${statusOption === invoice?.status ? ' active' : ''}`}
                    style={{ opacity: statusUpdating ? 0.5 : 1 }}
                    onClick={() => handleStatusChange(statusOption)}
                    disabled={statusUpdating}
                  >
                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </button>
                ))}
              </div>

              {invoice?.pdfUrl && (
                <a href={invoice.pdfUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                  Download PDF
                </a>
              )}
              
              {!invoice?.pdfUrl && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleGeneratePDF}
                  disabled={pdfGenerating}
                >
                  {pdfGenerating ? 'Generating PDF…' : 'Generate PDF'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2.25rem', display: 'grid', gap: '2rem' }}>
          <section>
            <div className="section-heading" style={{ marginBottom: '1rem' }}>
              <h2 className="section-title">Client</h2>
              <p className="section-subtitle">Who you are invoicing.</p>
            </div>
            <div style={{ display: 'grid', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{invoice?.clientName}</span>
              <span>{invoice?.clientEmail || '—'}</span>
              <span>{invoice?.clientPhone || '—'}</span>
              <span>{invoice?.clientAddress || '—'}</span>
            </div>
          </section>

          <section>
            <div className="section-heading" style={{ marginBottom: '1rem' }}>
              <h2 className="section-title">Line Items</h2>
              <p className="section-subtitle">Every service bundled in this invoice.</p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table-glass">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Tax</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice?.items?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{item.discount}%</td>
                      <td>{item.taxRate}%</td>
                      <td>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="section-heading" style={{ marginBottom: '1rem' }}>
              <h2 className="section-title">Totals</h2>
            </div>
            <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 360 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-tertiary">Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-tertiary">Discounts</span>
                <span>-{formatCurrency(totals.discountTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-tertiary">Tax</span>
                <span>{formatCurrency(totals.taxTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.05rem' }}>
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </section>

          {(invoice?.notes || invoice?.terms) && (
            <section>
              <div className="section-heading" style={{ marginBottom: '1rem' }}>
                <h2 className="section-title">Notes & Terms</h2>
              </div>
              <div style={{ display: 'grid', gap: '1rem', color: 'var(--text-secondary)' }}>
                {invoice?.notes && (
                  <div>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>
                      Notes
                    </h3>
                    <p>{invoice.notes}</p>
                  </div>
                )}
                {invoice?.terms && (
                  <div>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>
                      Terms
                    </h3>
                    <p>{invoice.terms}</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '2.25rem', display: 'grid', gap: '1.5rem' }}>
          <div className="section-heading" style={{ marginBottom: '0.25rem' }}>
            <h2 className="section-title">Send Invoice</h2>
            <p className="section-subtitle">Email or WhatsApp the invoice to your client.</p>
          </div>

          {sendSuccess && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.85rem',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                background: 'rgba(34, 197, 94, 0.16)',
                color: 'rgba(187, 247, 208, 0.95)',
              }}
            >
              {sendSuccess}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.85rem',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#fecaca',
              }}
            >
              {error}
            </div>
          )}

          <form className="send-form" onSubmit={handleSendInvoice} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <label>
                <input
                  type="radio"
                  name="method"
                  value="email"
                  checked={sendState.method === 'email'}
                  onChange={(e) => setSendState((prev) => ({ ...prev, method: e.target.value }))}
                />{' '}
                <span style={{ marginLeft: '0.35rem' }}>Email</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="method"
                  value="whatsapp"
                  checked={sendState.method === 'whatsapp'}
                  onChange={(e) => setSendState((prev) => ({ ...prev, method: e.target.value }))}
                />{' '}
                <span style={{ marginLeft: '0.35rem' }}>WhatsApp</span>
              </label>
            </div>

            <div>
              <label className="text-tertiary" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                Recipient
              </label>
              <input
                type="text"
                className="input-glass"
                value={sendState.recipient}
                onChange={(e) => setSendState((prev) => ({ ...prev, recipient: e.target.value }))}
                required
              />
            </div>

            {sendState.method === 'whatsapp' && (
              <div>
                <label className="text-tertiary" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  Message (optional)
                </label>
                <textarea
                  className="input-glass"
                  rows={3}
                  value={sendState.message}
                  onChange={(e) => setSendState((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn-ghost" onClick={() => router.push('/invoices')}>
                Back to invoices
              </button>
              <button type="submit" className="btn-primary" disabled={sendLoading}>
                {sendLoading ? 'Sending…' : `Send via ${sendState.method === 'email' ? 'Email' : 'WhatsApp'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
