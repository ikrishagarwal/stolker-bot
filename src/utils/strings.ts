export function splitIntoSentences(input: string, maxLength = 2000): string[] {
  const chunks: string[] = [];
  let current = "";

  const sentenceRegex = /.*?[.?!](?:\s+|$)/gs; // match full sentence with punctuation
  const sentences = input.match(sentenceRegex) || [input];

  for (const sentence of sentences) {
    // If sentence alone is larger than max, hard split
    if (sentence.length > maxLength) {
      const parts = sentence.match(new RegExp(`.{1,${maxLength}}`, "g")) || [];
      for (const part of parts) {
        if (current.length + part.length > maxLength) {
          chunks.push(current);
          current = "";
        }
        current += part;
      }
    } else {
      if (current.length + sentence.length > maxLength) {
        chunks.push(current);
        current = "";
      }
      current += sentence;
    }
  }

  if (current.trim().length > 0) {
    chunks.push(current);
  }

  return chunks;
}
