// Caesar cipher encoding
export const encodeSentence = (sentence) => {
  const shift = Math.floor(Math.random() * 25) + 1;
  const encoded = sentence
    .split("")
    .map((char) => {
      if (/[a-z]/i.test(char)) {
        const code = char.charCodeAt(0);
        const base = code >= 97 ? 97 : 65;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join("");
  return { encoded, shift };
};

