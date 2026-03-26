import React from 'react';
import './App.css';
import UploadDocument from './UploadDocument';
import ChatModule from './ChatModule';

const steps = [
  {
    num: '01',
    icon: '📄',
    title: 'Încarcă Documentul',
    desc: 'Adaugă orice fișier PDF — contracte, rapoarte, articole sau documentații tehnice.',
    tech: 'multer · pdf-parse',
  },
  {
    num: '02',
    icon: '🧩',
    title: 'Chunking & Embeddings',
    desc: 'Textul este împărțit în segmente, fiecare convertit în vectori 100% gratuit și local prin Transformers.js.',
    tech: 'all-MiniLM-L6-v2',
  },
  {
    num: '03',
    icon: '🗄️',
    title: 'Stocare Vectorială',
    desc: 'Vectorii sunt indexați în Pinecone pentru căutare semantică ultra-rapidă.',
    tech: 'Pinecone Vector DB',
  },
  {
    num: '04',
    icon: '💬',
    title: 'Răspunsuri Inteligente',
    desc: 'La fiecare întrebare, contextul relevant este extras și transmis către Gemini Pro pentru un răspuns precis.',
    tech: 'RAG · Gemini 2.5 Flash',
  },
];

const techs = [
  { label: 'React', color: '#61DAFB' },
  { label: 'Node.js', color: '#68D391' },
  { label: 'Express', color: '#94A3B8' },
  { label: 'Transformers.js', color: '#9F7AEA' },
  { label: 'Pinecone', color: '#63B3ED' },
  { label: 'Gemini Pro', color: '#FBD38D' },
];

const App = () => {
  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="navbar-logo-icon">🤖</div>
          DocuMind AI
        </div>
        <span className="navbar-badge">Beta</span>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-glow" />
        <div className="hero-bg-glow-2" />
        <div className="hero-chip">
          <span className="hero-chip-dot" />
          Powered by RAG &amp; Local Embeddings
        </div>
        <h1 className="hero-title">
          Întreabă orice despre<br />
          <span className="hero-title-gradient">documentele tale</span>
        </h1>
        <p className="hero-subtitle">
          Încarcă un PDF și obține răspunsuri instant bazate pe conținut.
          AI-ul analizează, indexează și înțelege documentele tale — în secunde.
        </p>
        <a href="#upload" className="hero-cta">
          Începe acum
          <span>↓</span>
        </a>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">~2s</span>
          <span className="stat-label">Timp procesare</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">384</span>
          <span className="stat-label">Dimensiuni vector</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">500</span>
          <span className="stat-label">Cuvinte / chunk</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">∞</span>
          <span className="stat-label">Documente suportate</span>
        </div>
      </div>

      <div className="divider" />

      {/* How it works */}
      <div className="section">
        <p className="section-label">Cum funcționează</p>
        <h2 className="section-title">De la PDF la răspuns <br />în 4 pași simpli</h2>
        <p className="section-desc">
          Arhitectura RAG (Retrieval-Augmented Generation) combină baze de date vectoriale
          cu modele de limbaj pentru a genera răspunsuri exacte din documentele tale.
        </p>
        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step-card" key={step.num}>
              <div className="step-number">Step {step.num}</div>
              <span className="step-icon">{step.icon}</span>
              <div className="step-title">{step.title}</div>
              <p className="step-desc">{step.desc}</p>
              <span className="step-tech">{step.tech}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech strip */}
      <div className="tech-strip">
        {techs.map((t) => (
          <div className="tech-pill" key={t.label}>
            <span className="tech-pill-dot" style={{ background: t.color }} />
            {t.label}
          </div>
        ))}
      </div>

      <div className="divider" />

      {/* Upload */}
      <div id="upload" className="upload-section" style={{ paddingTop: '80px' }}>
        <UploadDocument />
      </div>

      {/* Chat */}
      <div className="chat-section">
        <ChatModule />
      </div>

      {/* Footer */}
      <footer className="footer">
        <span>© 2025 DocuMind AI — Proiect de portofoliu</span>
        <div className="footer-links">
          <a href="https://github.com/rudopulos/ai-doc-qa-backend" className="footer-link" target="_blank" rel="noreferrer">Backend</a>
          <a href="https://github.com/rudopulos/ai-doc-qa-frontend" className="footer-link" target="_blank" rel="noreferrer">Frontend</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
