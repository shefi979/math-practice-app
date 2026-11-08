import React, { useState } from 'react';

export const TeacherSpaceManager = () => {
  const [spaceName, setSpaceName] = useState('');
  const [createdSpaces, setCreatedSpaces] = useState([]);
  const [openQuestion, setOpenQuestion] = useState('');
  const [openAnswer, setOpenAnswer] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  const handleCreateSpace = (e) => {
    e.preventDefault();
    if (!spaceName.trim()) return;
    const newSpace = { id: Date.now(), name: spaceName, code: Math.random().toString(36).substring(2, 7).toUpperCase() };
    setCreatedSpaces([...createdSpaces, newSpace]);
    setSpaceName('');
  };

  const handleAddOpenQuestion = (e) => {
    e.preventDefault();
    if (!openQuestion.trim() || !openAnswer.trim()) return;
    setQuestionsList([...questionsList, { id: Date.now(), text: openQuestion, answer: openAnswer }]);
    setOpenQuestion('');
    setOpenAnswer('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '650px', margin: '0 auto', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h3>🏫 Müəllim Paneli: Space Yarat və Açıq Suallar</h3>
      
      {/* Space Creation */}
      <form onSubmit={handleCreateSpace} style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Sinif/Space adı daxil edin..."
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
        <button type="submit" style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Space Yarat</button>
      </form>

      {createdSpaces.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4>Yaradılmış Space-lər:</h4>
          {createdSpaces.map((s) => (
            <div key={s.id} style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: '6px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span><b>{s.name}</b></span>
              <span>Kodu: <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>{s.code}</code></span>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: '20px 0', borderColor: '#e2e8f0' }} />

      {/* Open Questions Creation */}
      <h4>📝 Açıq Sual Əlavə Et:</h4>
      <form onSubmit={handleAddOpenQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          placeholder="Açıq sualı yazın (məs: 15 alma var idi, 7-si yeyildi...)"
          value={openQuestion}
          onChange={(e) => setOpenQuestion(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '60px' }}
        />
        <input
          type="text"
          placeholder="Düzgün cavab"
          value={openAnswer}
          onChange={(e) => setOpenAnswer(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Sualı Saxla</button>
      </form>

      {questionsList.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Əlavə olunan Açıq Suallar:</h4>
          {questionsList.map((q, idx) => (
            <div key={q.id} style={{ padding: '8px 12px', background: '#f8fafc', borderLeft: '4px solid #16a34a', marginBottom: '6px' }}>
              <div><b>{idx + 1}. {q.text}</b></div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Cavab: {q.answer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
