export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

export const getVoicesForLanguage = (languageCode: string): SpeechSynthesisVoice[] => {
  if (!isSpeechSynthesisSupported()) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => voice.lang.startsWith(languageCode));
};

export const speakText = (
  text: string, 
  languageCode: string,
  onEnd?: () => void
): void => {
  if (!isSpeechSynthesisSupported() || !text) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = getVoicesForLanguage(languageCode);
  
  if (voices.length > 0) {
    utterance.voice = voices[0];
  }
  
  utterance.lang = languageCode;
  utterance.onend = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

export const pauseSpeaking = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeaking = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.resume();
  }
};
