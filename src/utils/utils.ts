function escapeMarkdownV2(text: string) {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, (char) => `\\${char}`);
}

function splitText(text: string, chunkSize = 4096) {
  const result = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    result.push(text.slice(i, i + chunkSize));
  }
  return result;
}

export {
    escapeMarkdownV2,
    splitText
}