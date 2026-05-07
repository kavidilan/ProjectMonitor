import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--panel)',
        color: 'var(--tx-1)',
        padding: '8px 12px',
        borderRadius: 8,
        fontSize: 12,
        border: '1px solid var(--bd)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 10px 20px rgba(3, 27, 47, 0.14)',
      }}>
        <p style={{ margin: 0, fontWeight: 500 }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: 4, color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
