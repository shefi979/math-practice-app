import React from 'react';

export const MathExplanation = ({ num1, num2, operator, answer }) => {
  const isSmallNumber = Math.abs(num1) <= 10 && Math.abs(num2) <= 10;

  if (isSmallNumber && (operator === '+' || operator === '-')) {
    const points = Array.from({ length: 21 }, (_, i) => i - 10);
    return (
      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', marginTop: '12px', textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Ədəd Oxu ilə İzah:</h4>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', overflowX: 'auto', padding: '10px 0' }}>
          {points.map((pt) => {
            const isStart = pt === num1;
            const isEnd = pt === answer;
            return (
              <div key={pt} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '24px' }}>
                <span style={{ fontSize: '10px', fontWeight: pt === 0 ? 'bold' : 'normal', color: pt === 0 ? '#ef4444' : '#64748b' }}>{pt}</span>
                <div style={{ width: '2px', height: '10px', background: pt === 0 ? '#ef4444' : '#cbd5e1', margin: '4px 0' }} />
                {(isStart || isEnd) && (
                  <div style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: isEnd ? '#22c55e' : '#3b82f6',
                    border: '2px solid #fff', boxShadow: '0 0 4px rgba(0,0,0,0.2)'
                  }} title={isStart ? 'Başlanğıc' : 'Nəticə'} />
                )}
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: '14px', color: '#475569', marginTop: '8px' }}>
          📍 <b>{num1}</b> nöqtəsindən başla, <b>{num2}</b> qədər {operator === '+' ? 'sağa (artır)' : 'sola (azal)'} hərəkət et ➔ CAVAB: <b>{answer}</b>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', marginTop: '12px' }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Həlli Qaydası:</h4>
      <ul style={{ textAlign: 'left', paddingLeft: '20px', color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>
        <li><b>Mərhələ 1:</b> Ədədlərin mərtəbə vahidlərini (təklik, onluq, yüzlük) alt-alta düzgün hizala.</li>
        <li><b>Mərhələ 2:</b> {operator === '+' ? 'Təkliklərdən başlayaraq sağdan sola doğru topla.' : 'Sağdan sola doğru çıx (lazım gələrsə qonşu mərtəbədən pay götür).'}</li>
        <li><b>Dəqiq Hesablama:</b> {num1} {operator} {num2} = <b>{answer}</b></li>
      </ul>
    </div>
  );
};
