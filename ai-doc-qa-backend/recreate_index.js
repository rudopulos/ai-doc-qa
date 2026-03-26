require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const INDEX_NAME = 'document-embeddings';

async function recreateIndex() {
  try {
    const list = await pinecone.listIndexes();
    console.log('Current indexes:', list);

    const exists = list.indexes.some(idx => idx.name === INDEX_NAME);
    if (exists) {
        console.log(`Deleting existing index: ${INDEX_NAME}`);
        await pinecone.deleteIndex(INDEX_NAME);
        console.log('Waiting for index deletion to propagate...');
        await new Promise(r => setTimeout(r, 10000));
    }

    console.log(`Creating new index: ${INDEX_NAME} with 384 dimensions`);
    await pinecone.createIndex({
      name: INDEX_NAME,
      dimension: 384,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1' // standard free tier region
        }
      }
    });

    console.log('Index created successfully!');
  } catch (err) {
    console.error('Error recreating index:', err);
  }
}

recreateIndex();
