const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const checkStats = async () => {
    try {
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        const index = pc.index('document-embeddings');
        const stats = await index.describeIndexStats();
        console.log("Index Stats:", JSON.stringify(stats, null, 2));
    } catch (err) {
        console.error("Error checking stats:", err.message);
    }
};

checkStats();
