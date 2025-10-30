// Using MyMemory Translation API (free, no API key required for basic usage)
export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  if (!text.trim()) {
    throw new Error('No text to translate');
  }

  try {
    const langPair = `${sourceLang}|${targetLang}`;
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
    );

    if (!response.ok) {
      throw new Error('Translation service unavailable');
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    } else {
      throw new Error('Translation failed');
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate. Please try again.');
  }
};
