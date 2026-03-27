const express = require('express');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { getPinecone, initPinecone } = require('./pinecone'); 
const { chunkText } = require('./utils/chunkText');
const { generateId } = require('./utils/generateId');
const { getEmbedding } = require('./services/embeddings');
require('dotenv').config();

console.log("PINECONE_API_KEY:", process.env.PINECONE_API_KEY);
console.log("PINECONE_ENVIRONMENT:", process.env.PINECONE_ENVIRONMENT);
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

const app = express();
const upload = multer();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Serve frontend static files
const frontendBuildPath = path.resolve(__dirname, '..', 'ai-doc-qa-frontend', 'build');
app.use(express.static(frontendBuildPath));
console.log("Serving static files from:", frontendBuildPath);


app.post('/upload', upload.single('document'), async (req, res) => {
    console.log("Request primit la /upload");
    try {
        const file = req.file;
        console.log("Fișier încărcat:", file);
        if (!file) return res.status(400).send('No file uploaded.');

        let text = '';
        if (file.mimetype === 'application/pdf') {
            try {
                const pdfData = await pdfParse(file.buffer);
                text = pdfData.text;
            } catch (parseErr) {
                console.error("Eroare la parsarea PDF-ului:", parseErr);
                return res.status(400).send({ error: "Fișierul PDF este invalid sau corupt." });
            }
        } else {
            text = file.buffer.toString();
            console.log("Text extras din fișier:", text);
        }

        if (!text || text.trim().length === 0) {
            console.error("Textul extras este gol.");
            return res.status(400).send({ error: "Documentul nu conține text procesabil." });
        }
   
        const chunks = chunkText(text, 500).filter(chunk => chunk.trim().length > 0);  
        console.log("Chunk-uri generate (non-empty):", chunks);

        if (chunks.length === 0) {
            return res.status(400).send({ error: "Nu s-au putut genera fragmente de text din acest document." });
        }

        const embeddings = await Promise.all(chunks.map(async (chunk) => {
            const embedding = await getEmbedding(chunk);
            console.log("Embedding generat pentru chunk:", chunk, embedding);
            return { chunk, embedding };
        }));

        const upsertPayload = embeddings
            .filter(e => e.embedding && e.embedding.length > 0)
            .map(e => ({
                id: generateId(),
                values: e.embedding,
                metadata: { text: e.chunk }
            }));

        console.log("Upserting to Pinecone. Record count:", upsertPayload.length);
        if (upsertPayload.length === 0) {
            console.error("Nu s-au putut genera embedding-uri valide.");
            return res.status(500).send({ error: "Eroare la generarea reprezentărilor vectoriale (embeddings)." });
        }
        
        console.log("Sample record dimensions:", upsertPayload[0].values.length);
        console.log("Sample record (first 100 chars metadata):", upsertPayload[0].metadata.text.substring(0, 100));

        const index = getPinecone().index('document-embeddings');
        
        try {
            console.log("Upserting to Pinecone. Record count:", upsertPayload.length);
            console.log("First record ID:", upsertPayload[0]?.id);
            // In SDK 7.1.0, the argument MUST be an object with 'records' property, 
            // even when calling on a namespace object.
            await index.namespace('').upsert({ records: upsertPayload });
            console.log("Upsert successful!");
        } catch (upsertErr) {
            console.error("Eroare la upsert în Pinecone (detalii):", upsertErr.message);
            if (upsertErr.stack) console.error(upsertErr.stack);
            throw upsertErr;
        }

        res.send({ message: 'Document procesat și indexat cu succes!' });
    } catch (err) {
        console.error("Eroare în procesarea documentului:", err.message);
        
        let errorMessage = 'Eroare la procesarea documentului.';
        if (err.response && err.response.status === 401) {
            errorMessage = 'Cheia API Pinecone este invalidă / expirată (401). Verificați .env!';
        } else if (err.message) {
            errorMessage = err.message;
        }

        res.status(500).send({ error: errorMessage });
    }
});

app.post('/chat', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).send({ error: 'Întrebarea este necesară.' });

    console.log("Întrebare primită:", question);

    try {
        // 1. Generăm embedding pentru întrebare folosind modelul local
        const questionEmbedding = await getEmbedding(question);

        // 2. Căutăm în Pinecone cele mai relevante fragmente
        const index = getPinecone().index('document-embeddings');
        const queryResponse = await index.namespace('').query({
            vector: questionEmbedding,
            topK: 5,
            includeMetadata: true,
        });

        // 3. Extragem textul din rezultate
        const context = queryResponse.matches
            .filter(match => match.score > 0.3) // Filtru minim de relevanță
            .map(match => match.metadata.text)
            .join('\n\n---\n\n');

        if (!context) {
            return res.send({ answer: "Îmi pare rău, dar nu am găsit informații suficient de relevante în documentele încărcate pentru a răspunde la această întrebare." });
        }

        // 4. Trimitem contextul și întrebarea la Google Gemini
        const prompt = `Ești DocuMind AI, un asistent util care răspunde la întrebări pe baza documentelor încărcate de utilizator. 
Folosește EXCLUSIV contextul oferit mai jos pentru a răspunde. 
Dacă informația nu se află în context, explică politicos că nu știi răspunsul bazat pe documentele actuale. 
Răspunde mereu în limba română, într-un mod profesional și concis.

CONTEXT EXTRAS DIN DOCUMENTE:
${context}

ÎNTREBARE UTILIZATOR: ${question}`;

        const result = await geminiModel.generateContent(prompt);
        const aiAnswer = result.response.text();
        
        console.log("Răspuns generat (Gemini):", aiAnswer);
        res.send({ answer: aiAnswer });

    } catch (err) {
        console.error("Eroare în fluxul de Chat (Gemini):", err.message);
        res.status(500).send({ error: 'Eroare la generarea răspunsului AI. Verificați cheia Gemini.' });
    }
});

// Always serve the index.html for any unknown route (React handles routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});


const startServer = async () => {
    // Start listening immediately so Render detects the open port
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    // Initialize Pinecone in the background
    try {
        console.log("Initializing Pinecone...");
        await initPinecone();
        console.log("Pinecone initialized successfully.");
    } catch (err) {
        console.error("Failed to initialize Pinecone:", err);
    }
};

startServer().catch(err => {
    console.error('Critical error in startServer:', err);
});
