const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

const testPdfParse = async () => {
    try {
        const filePath = 'c:\\Users\\rudop\\Documents\\GitHub\\ai-doc-qa\\ai-doc-qa-frontend\\public\\Document_Demo_DocuMind_AI.pdf';
        const buffer = fs.readFileSync(filePath);
        console.log("File buffer size:", buffer.length);
        const data = await pdfParse(buffer);
        console.log("Extracted text length:", data.text.length);
        console.log("Extracted text preview:", data.text.substring(0, 100));
    } catch (err) {
        console.error("Error parsing PDF:", err.message);
    }
};

testPdfParse();
