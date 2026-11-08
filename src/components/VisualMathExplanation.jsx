import React from 'react';

export const VisualMathExplanation = ({ num1, num2, operator, answer }) => {
  const n1 = Number(num1) || 0;
  const n2 = Number(num2) || 0;
  const ans = Number(answer) || 0;
  const isSmall = Math.abs(n1) <= 10 && Math.abs(n2) <= 10;

  if (isSmall && (operator === '+' || operator === '-')) {
    const points = Array.from({ length: 21 }, (_, i) => i - 10);
    return (
      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#334155', marginBottom: '8px' }}>📍 Ədəd Oxu İzahı:</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', overflowX: 'auto', padding: '6px 0' }}>
          {points.map((pt) => (
            <div key={pt} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '22px' }}>
              <span style={{ fontSize: '10px', color: pt === 0 ? '#ef4444' : '#64748b' }}>{pt}</span>
              <div style={{ width: '1px', height: '8px', background: pt === 0 ? '#ef4444' : '#cbd5e1', margin: '2px 0' }} />
              {(pt === n1 || pt === ans) && (
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: pt === ans ? '#22c55e' : '#3b82f6' }} />
              )}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#475569', margin: '6px 0 0 0', textAlign: 'center' }}>
          <b>{n1}</b> nöqtəsindən start ➔ <b>{n2}</b> qədər {operator === '+' ? 'sağa' : 'sola'} ➔ Cavab: <b>{ans}</b>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px', fontSize: '13px' }}>
      <b>💡 Qayda üzrə İzah:</b>
      <ol style={{ margin: '6px 0 0 0', paddingLeft: '18px', color: '#334155' }}>
        <li>Ədədlərin təklik və onluqlarını alt-alta hizalayın.</li>
        <li>{operator === '+' ? 'Təkliklərdən başlayaraq toplayın.' : 'Təkliklərdən başlayaraq çıxın.'}</li>
        <li>Yekun: {n1} {operator} {n2} = <b>{ans}</b></li>
      </ol>
    </div>
  );
};
