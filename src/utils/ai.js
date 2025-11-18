export const pollinationsFetch = async (prompt) => {
  const response = await fetch(
    `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
  );
  if (!response.ok) {
    throw new Error("AI request failed");
  }
  const text = await response.text();
  return text.trim();
};

export const extractZodiac = (rawText) => {
  return rawText
    .split(/\s|,|\./)
    .filter(Boolean)[0]
    .replace(/[^a-z]/gi, "")
    .trim();
};

export const normalizeSentence = (text) => {
  let cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned.endsWith(".")) {
    cleaned = `${cleaned}.`;
  }
  return cleaned;
};

export const isConcise = (text, maxWords = 10) => text.split(/\s+/).length <= maxWords;

