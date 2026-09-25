export function retrieveRelevantChunks(
  query: string,
  chunks: string[],
  topK: number = 4
) {
  const queryWords = query
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

  const scoredChunks = chunks.map((chunk) => {
    const lowerChunk = chunk.toLowerCase();

    let score = 0;

    for (const word of queryWords) {
      if (lowerChunk.includes(word)) {
        score++;
      }
    }

    return {
      chunk,
      score,
    };
  });

  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.chunk);
}