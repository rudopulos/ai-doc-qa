const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const testUpsert = async () => {
    try {
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        const index = pc.index('document-embeddings');
        const record = {
            id: 'test-id-' + Date.now(),
            values: new Array(384).fill(0.1),
            metadata: { text: 'test text' }
        };
        console.log("Upserting record...");
        await index.upsert([record]);
        console.log("Upsert successful!");
    } catch (err) {
        console.error("Upsert failed:", err.message);
        if (err.stack) console.error(err.stack);
    }
};

testUpsert();
