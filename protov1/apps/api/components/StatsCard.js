const toneStyles = {
  teal: {
    iconBg: 'linear-gradient(135deg, rgba(94, 234, 212, 0.18), rgba(96, 165, 250, 0.18))',
    iconBorder: '1px solid rgba(94, 234, 212, 0.35)',
    iconColor: 'rgba(94, 234, 212, 0.95)',
  },
  violet: {
    iconBg: 'linear-gradient(135deg, rgba(129, 140, 248, 0.2), rgba(236, 72, 153, 0.2))',
    iconBorder: '1px solid rgba(129, 140, 248, 0.35)',
    iconColor: 'rgba(196, 181, 253, 0.95)',
  },
  amber: {
    iconBg: 'linear-gradient(135deg, rgba(251, 191, 36, 0.18), rgba(249, 115, 22, 0.18))',
    iconBorder: '1px solid rgba(251, 191, 36, 0.32)',
    iconColor: 'rgba(252, 211, 77, 0.95)',
  },
  rose: {
    iconBg: 'linear-gradient(135deg, rgba(244, 114, 182, 0.2), rgba(236, 72, 153, 0.2))',
    iconBorder: '1px solid rgba(244, 114, 182, 0.3)',
    iconColor: 'rgba(251, 207, 232, 0.95)',
  },
  blue: {
    iconBg: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.2))',
    iconBorder: '1px solid rgba(96, 165, 250, 0.35)',
    iconColor: 'rgba(147, 197, 253, 0.95)',
  },
};

export default function StatsCard({ title, value, icon: Icon, tone = 'teal', delay = 0 }) {
  const toneStyle = toneStyles[tone] || toneStyles.teal;

  return (
    <div
      className="stat-card fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {Icon && (
        <div
          className="stat-icon"
          style={{
            background: toneStyle.iconBg,
            border: toneStyle.iconBorder,
            color: toneStyle.iconColor,
          }}
        >
          <Icon size={22} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}
