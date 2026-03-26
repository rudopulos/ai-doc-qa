const { getEmbedding } = require('./services/embeddings');

const testEmbedding = async () => {
    try {
        console.log("Testing embedding for 'Hello world'...");
        const embedding = await getEmbedding('Hello world');
        console.log("Embedding length:", embedding.length);
        console.log("Embedding type:", typeof embedding);
        console.log("Is array:", Array.isArray(embedding));
    } catch (err) {
        console.error("Error generating embedding:", err.message);
    }
};

testEmbedding();
