const { Pinecone } = require('@pinecone-database/pinecone');

let pinecone;

const initPinecone = async () => {
    pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
};

const getPinecone = () => pinecone;

module.exports = { getPinecone, initPinecone };
