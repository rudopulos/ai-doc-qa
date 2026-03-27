import React, { useState, useRef } from 'react';
import axios from 'axios';

const UploadDocument = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(''); // 'idle', 'uploading', 'success', 'error'
    const [isDragging, setIsDragging] = useState(false);
    
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setStatus('idle');
            setMessage('');
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
                setStatus('idle');
                setMessage('');
            } else {
                setStatus('error');
                setMessage('Vă rugăm să încărcați doar fișiere PDF.');
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return;

        setStatus('uploading');
        setMessage('');

        const formData = new FormData();
        formData.append('document', file);

        const API_URL = '';
        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStatus('success');
            setMessage(response.data.message || 'Document procesat și indexat cu succes!');
            setFile(null); // Resetăm după succes
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            setStatus('error');
            const errMsg = error.response?.data?.error || 'Eroare la procesarea documentului. Verificați dacă backend-ul rulează.';
            setMessage(errMsg);
            console.error('Error uploading document:', error);
        }
    };

    return (
        <div className="upload-card">
            <div className="upload-card-header">
                <div className="upload-card-icon">🧠</div>
                <div>
                    <h2 className="upload-card-title">Adaugă Document Nou</h2>
                    <p className="upload-card-subtitle">
                        Încarcă un PDF pentru a-l indexa în baza de cunoștințe AI.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div 
                    className={`file-drop-zone ${isDragging ? 'has-file' : ''} ${file ? 'has-file' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileChange} 
                        required={!file} 
                    />
                    
                    <span className="file-drop-icon">📑</span>
                    <div className="file-drop-text">
                        Trage fișierul aici sau apasă pentru a răsfoi
                    </div>
                    <div className="file-drop-hint">Suportă doar fișiere .PDF</div>

                    {file && (
                        <div className="file-name-display">
                            <span>✅</span> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <button 
                            type="button" 
                            className="upload-btn" 
                            style={{ width: '100%', background: 'rgba(99, 179, 237, 0.1)', border: '1px solid rgba(99, 179, 237, 0.4)', color: 'var(--text-primary)' }}
                            onClick={async () => {
                                try {
                                    const demoPath = (process.env.PUBLIC_URL || '') + '/Document_Demo_DocuMind_AI.pdf';
                                    console.log('Fetching demo PDF from:', demoPath);
                                    const response = await fetch(demoPath);
                                    if (!response.ok) throw new Error(`Fișierul demo nu a putut fi găsit (Status: ${response.status}).`);
                                    const blob = await response.blob();
                                    console.log('Demo PDF blob size:', blob.size);
                                    if (blob.size === 0) throw new Error('Fișierul demo este gol.');
                                    const demoFile = new File([blob], 'Document_Demo_DocuMind_AI.pdf', { type: 'application/pdf' });
                                    setFile(demoFile);
                                    setStatus('idle');
                                    setMessage('');
                                } catch (error) {
                                    console.error('Error loading demo PDF:', error);
                                    setStatus('error');
                                    setMessage(error.message || 'Eroare la încărcarea documentului demo.');
                                }
                            }}
                            disabled={status === 'uploading'}
                        >
                            📑 Folosește PDF Demo
                        </button>
                        <a 
                            href="/Document_Demo_DocuMind_AI.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="view-pdf-tag"
                            title="Vezi PDF-ul în filă nouă"
                        >
                            👁️ Vezi
                        </a>
                    </div>

                    <button 
                        type="submit" 
                        className={`upload-btn ${status === 'uploading' ? 'loading' : ''}`}
                        disabled={!file || status === 'uploading'}
                        style={{ flex: 1 }}
                    >
                        {status === 'uploading' ? (
                            <>
                                <div className="spinner"></div>
                                Procesăm...
                            </>
                        ) : (
                            <>
                                Încarcă & Indexează
                                <span>→</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {message && (
                <div className={`message-box ${status}`}>
                    {status === 'success' ? '🎉' : '❌'} {message}
                </div>
            )}
        </div>
    );
};

export default UploadDocument;
