import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import { invoiceService } from '../../lib/api';

const EMPTY_ITEM = {
  description: '',
  quantity: 1,
  unitPrice: 0,
  taxRate: 0,
  discount: 0,
};

export default function NewInvoice() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    dueDate: new Date().toISOString().split('T')[0],
    currency: 'USD',
    notes: '',
    terms: '',
  });
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const cloned = [...prev];
      const parsedValue = ['description'].includes(field)
        ? value
        : Number(value || 0);
      cloned[index] = {
        ...cloned[index],
        [field]: parsedValue,
      };
      return cloned;
    });
  };

  const addItem = () => {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Add at least one line item.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        items: items.map((item) => ({
          ...item,
          quantity: Number(item.quantity || 0),
          unitPrice: Number(item.unitPrice || 0),
          taxRate: Number(item.taxRate || 0),
          discount: Number(item.discount || 0),
        })),
      };

      const invoice = await invoiceService.create(payload);

      router.push(`/invoice/${invoice.id}`);
    } catch (err) {
      console.error('Failed to create invoice', err);
      setError(err.response?.data?.error || 'Failed to create invoice. Please review the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-10">
        <header className="glass-panel dashboard-hero">
          <div className="dashboard-hero-lead">
            <span className="badge badge-sent dashboard-hero-tag">New Invoice</span>
            <h1 className="dashboard-hero-title">Craft a polished invoice with clarity</h1>
            <p className="dashboard-hero-subtitle" style={{ maxWidth: 540 }}>
              Capture client details, line items, and payment terms—then ship it instantly.
            </p>
          </div>
        </header>

        <form className="glass-panel" onSubmit={handleSubmit} style={{ padding: '2rem', display: 'grid', gap: '2rem' }}>
          {error && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '0.85rem',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#fecaca',
              }}
            >
              {error}
            </div>
          )}

          <section style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="section-heading" style={{ marginBottom: '1rem' }}>
              <h2 className="section-title">Client Details</h2>
              <p className="section-subtitle">Who is this invoice going to?</p>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Client Name *</span>
                <input
                  type="text"
                  className="input-glass"
                  value={formData.clientName}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                  required
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Client Email *</span>
                <input
                  type="email"
                  className="input-glass"
                  value={formData.clientEmail}
                  onChange={(e) => handleChange('clientEmail', e.target.value)}
                  required
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Client Phone</span>
                <input
                  type="tel"
                  className="input-glass"
                  value={formData.clientPhone}
                  onChange={(e) => handleChange('clientPhone', e.target.value)}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Due Date *</span>
                <input
                  type="date"
                  className="input-glass"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  required
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Currency</span>
                <select
                  className="input-glass"
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                >
                  {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CNY'].map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Billing Address</span>
                <textarea
                  className="input-glass"
                  rows={3}
                  value={formData.clientAddress}
                  onChange={(e) => handleChange('clientAddress', e.target.value)}
                />
              </label>
            </div>
          </section>

          <section style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="section-heading" style={{ marginBottom: '1rem' }}>
              <h2 className="section-title">Line Items</h2>
              <p className="section-subtitle">Describe your work and pricing.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    alignItems: 'flex-end',
                  }}
                >
                  <div style={{ flex: 2, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Description *</span>
                    <input
                      type="text"
                      className="input-glass"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Qty</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-glass"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    />
                  </div>

                  <div style={{ minWidth: '140px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Unit Price</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-glass"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    />
                  </div>

                  <div style={{ minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Tax %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="input-glass"
                      value={item.taxRate}
                      onChange={(e) => handleItemChange(index, 'taxRate', e.target.value)}
                    />
                  </div>

                  <div style={{ minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Discount %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="input-glass"
                      value={item.discount}
                      onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    style={{ alignSelf: 'flex-end' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button type="button" className="btn-secondary" onClick={addItem}>
              + Add Item
            </button>
          </section>

          <section style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="section-heading" style={{ marginBottom: '1rem' }}>
              <h2 className="section-title">Notes & Terms</h2>
              <p className="section-subtitle">Share any final context or payment expectations.</p>
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Notes</span>
              <textarea
                className="input-glass"
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Payment Terms</span>
              <textarea
                className="input-glass"
                rows={3}
                value={formData.terms}
                onChange={(e) => handleChange('terms', e.target.value)}
              />
            </label>
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn-ghost" onClick={() => router.push('/invoices')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
