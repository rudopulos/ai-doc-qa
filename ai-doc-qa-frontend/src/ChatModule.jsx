import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatModule = () => {
    const API_URL = ''; 

    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Salut! Sunt DocuMind AI. După ce încarci un document, mă poți întreba orice despre conținutul acestuia.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isInitialMount = useRef(true);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            scrollToBottom();
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userQuestion = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/chat`, { question: userQuestion });
            setMessages(prev => [...prev, { role: 'ai', content: response.data.answer }]);
        } catch (error) {
            console.error("Chat error:", error);
            const errMsg = error.response?.data?.error || "A apărut o eroare la conectarea cu serverul.";
            setMessages(prev => [...prev, { role: 'ai', content: `❌ ${errMsg}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container" id="chat">
            <div className="chat-header">
                <div className="chat-header-info">
                    <span className="chat-status-dot"></span>
                    <h3>Sesiune Q&A Activă</h3>
                </div>
                <button className="chat-clear" onClick={() => setMessages([messages[0]])}>Șterge Istoric</button>
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.role}`}>
                        <div className="message-avatar">
                            {msg.role === 'ai' ? '🤖' : '👤'}
                        </div>
                        <div className="message-bubble">
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message-wrapper ai">
                        <div className="message-avatar">🤖</div>
                        <div className="message-bubble loading">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Pune o întrebare despre document..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                />
                <button type="submit" disabled={!input.trim() || isLoading}>
                    {isLoading ? '...' : 'Întreabă'}
                </button>
            </form>
        </div>
    );
};

export default ChatModule;
