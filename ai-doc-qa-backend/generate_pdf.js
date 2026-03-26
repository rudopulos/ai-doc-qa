const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '..', 'ai-doc-qa-frontend', 'public', 'Document_Demo_DocuMind_AI.pdf');
const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream(outPath));

// Title
doc.fontSize(24).fillColor('#2d3748').text('DocuMind AI: Document de Test', { align: 'center' });
doc.moveDown(2);

// Introduction
doc.fontSize(14).fillColor('#4a5568').text('Acesta este un document demo generat special pentru a testa functionalitatea de Retrieval-Augmented Generation (RAG) a platformei DocuMind AI.', { align: 'justify' });
doc.moveDown(1.5);

// Section 1
doc.fontSize(18).fillColor('#2b6cb0').text('Ce este arhitectura RAG?');
doc.moveDown(0.5);
doc.fontSize(12).fillColor('#4a5568').text('RAG (Retrieval-Augmented Generation) este un proces care combina puterea modelelor de limbaj mari (Large Language Models) cu algoritmi de cautare pentru a raspunde la intrebari referitoare la un set specific de date, fara a fi nevoie de fine-tuning. Practic, sistemul nu "memoreaza" documentul, ci il citeste in timp real si extrage sectiunile relevante inainte de a formula raspunsul.', { align: 'justify' });
doc.moveDown(1.5);

// Section 2
doc.fontSize(18).fillColor('#2b6cb0').text('Cum functioneaza DocuMind?');
doc.moveDown(0.5);
doc.fontSize(12).fillColor('#4a5568').text('Cand incarcati acest document in platforma, se petrec urmatoarele lucruri in fundal:');
doc.moveDown(0.3);
doc.text('1. Backend-ul (Node.js) extrage textul brut folosind modulul pdf-parse.');
doc.text('2. Textul este impartit in "segmente semantice" (chunks) de cateva sute de cuvinte pentru a mentine contextul.');
doc.text('3. Sistemul apeleaza un model local (Transformers.js) pentru a converti fiecare fragment de text intr-un vector numeric de 384 de dimensiuni (Gratuit & Local).');
doc.text('4. Acest vector este salvat intr-o baza de date vectoriala (Pinecone).');
doc.text('5. La cautare, folosim Google Gemini Pro pentru a genera raspunsul final (Free Tier).');
doc.moveDown(1.5);

// Section 3
doc.fontSize(18).fillColor('#2b6cb0').text('Exemple de intrebari de test');
doc.moveDown(0.5);
doc.fontSize(12).fillColor('#4a5568').text('Dupa ce indexarea se termina, puteti intreba AI-ul urmatoarele lucruri pentru a vedea cum raspunde pe baza acestui fisier:');
doc.moveDown(0.3);
doc.text('- "Ce inseamna RAG si cum ajuta modelele de limbaj?"');
doc.text('- "Care sunt pasii prin care DocuMind proceseaza un PDF?"');
doc.text('- "Ce tehnologii foloseste acest proiect pentru embeddings?"');
doc.moveDown(2);

// Footer
doc.fontSize(10).fillColor('#a0aec0').text('Proiect de portofoliu dezvoltat pentru demonstrarea integrarii Transformers.js, Pinecone si Gemini.', { align: 'center' });

doc.end();
console.log('PDF generated at:', outPath);
