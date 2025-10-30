// types/speech.d.ts (or at top of your file)
// Type definitions for (a subset of) the Web Speech API used in this project
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number; // optional, supported in many implementations
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
    };
  }
}

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * createSpeechRecognition(language, opts?)
 * - language: BCP-47 language tag (e.g. "en-US" or "ar-SA")
 * - opts: optional configuration (continuous, interimResults, maxAlternatives)
 *
 * Returns a configured SpeechRecognition instance or null if not supported.
 */
type CreateOpts = {
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
};

export const createSpeechRecognition = (
  language: string,
  opts: CreateOpts = {}
): SpeechRecognition | null => {
  if (!isSpeechRecognitionSupported()) return null;
  if (typeof window === "undefined") return null;

  const Constructor =
    // prefer unprefixed if present, otherwise vendor prefixed
    (window.SpeechRecognition as any) || (window.webkitSpeechRecognition as any);

  if (!Constructor) return null;

  try {
    const recognition: SpeechRecognition = new Constructor();

    // Apply defaults with sensible values (you can override via opts)
    recognition.continuous = opts.continuous ?? false;
    recognition.interimResults = opts.interimResults ?? true;
    recognition.lang = language;
    if (typeof opts.maxAlternatives === "number") {
      // many browsers support this property
      (recognition as any).maxAlternatives = opts.maxAlternatives;
    }

    // ensure event handlers are null by default (clear state)
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;

    return recognition;
  } catch (err) {
    // If constructor throws for some unexpected reason, fail gracefully
    // (e.g., some browsers require secure context or user gesture)
    console.warn("createSpeechRecognition: failed to initialize", err);
    return null;
  }
};
