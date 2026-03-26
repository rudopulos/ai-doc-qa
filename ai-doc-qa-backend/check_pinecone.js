const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const checkIndexes = async () => {
    try {
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        const indexes = await pc.listIndexes();
        console.log("Existing indexes:", JSON.stringify(indexes, null, 2));
        const indexExists = indexes.indexes.some(i => i.name === 'document-embeddings');
        console.log("Target index 'document-embeddings' exists:", indexExists);
    } catch (err) {
        console.error("Error checking indexes:", err.message);
    }
};

checkIndexes();
