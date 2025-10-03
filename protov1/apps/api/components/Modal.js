export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose} />

      {/* Modal Content */}
      <div className="modal-content relative z-50 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-primary" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: '600' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="btn-ghost text-2xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
