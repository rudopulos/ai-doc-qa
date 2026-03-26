let extractor;

async function getEmbedding(text) {
  if (!extractor) {
      // Import dinamic pentru modulul ESM Transformers.js
      const { pipeline } = await import('@xenova/transformers');
      // Model foarte bun și ușor pentru local embeddings
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  
  // Generare vector 384 dimensiuni
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

module.exports = { getEmbedding };
