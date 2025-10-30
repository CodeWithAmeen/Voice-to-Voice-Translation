import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LanguageSelector from "@/components/LanguageSelector";
import RecordButton from "@/components/RecordButton";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import PlaybackControls from "@/components/PlaybackControls";
import StatusBadge from "@/components/StatusBadge";
import { createSpeechRecognition, isSpeechRecognitionSupported } from "@/utils/speechRecognition";
import { speakText, stopSpeaking, isSpeechSynthesisSupported } from "@/utils/speechSynthesis";
import { translateText } from "@/utils/translation";
import { SUPPORTED_LANGUAGES, getTranslateCode } from "@/utils/languages";

const Index = () => {
  const [sourceLang, setSourceLang] = useState("en-US");
  const [targetLang, setTargetLang] = useState("es-ES");
  const [isRecording, setIsRecording] = useState(false);
  const [sourceTranscript, setSourceTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser support
    if (!isSpeechRecognitionSupported()) {
      toast.error("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
    }
    if (!isSpeechSynthesisSupported()) {
      toast.error("Speech synthesis is not supported in your browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopSpeaking();
    };
  }, []);

  const handleRecordToggle = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      const recognition = createSpeechRecognition(sourceLang);
      if (!recognition) {
        toast.error("Could not initialize speech recognition");
        return;
      }
      recognitionRef.current = recognition;

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        setSourceTranscript(prev => prev + finalTranscript || interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        toast.error("Error during recording. Please try again.");
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      try {
        recognition.start();
        setIsRecording(true);
        toast.success("Recording started");
      } catch (error) {
        toast.error("Failed to start recording");
        console.error(error);
      }
    }
  };

  const handleTranslate = async () => {
    if (!sourceTranscript.trim()) {
      toast.error("Please record or enter text to translate");
      return;
    }

    setIsTranslating(true);
    try {
      const sourceCode = getTranslateCode(sourceLang);
      const targetCode = getTranslateCode(targetLang);
      
      const translated = await translateText(sourceTranscript, sourceCode, targetCode);
      setTranslatedText(translated);
      toast.success("Translation complete!");
      
      if (autoPlay) {
        setTimeout(() => {
          speakText(translated, targetLang, () => setIsPlaying(false));
          setIsPlaying(true);
        }, 500);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePlayPause = () => {
    if (!translatedText) {
      toast.error("No translated text to play");
      return;
    }

    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      speakText(translatedText, targetLang, () => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!translatedText) {
      toast.error("No translated text to download");
      return;
    }

    const blob = new Blob([translatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Translation downloaded");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">VoiceBridge</h1>
              <p className="text-sm text-muted-foreground">Voice-to-voice & text translation</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-foreground">Auto-play voice</span>
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 shadow-xl">
          {/* Language Selectors */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <LanguageSelector
              label="Speak in"
              value={sourceLang}
              onChange={setSourceLang}
              languages={SUPPORTED_LANGUAGES.map(l => ({ code: l.code, name: l.name }))}
            />
            <div className="flex items-end justify-center pb-2">
              <ArrowRight className="w-6 h-6 text-accent" />
            </div>
            <LanguageSelector
              label="Translate to"
              value={targetLang}
              onChange={setTargetLang}
              languages={SUPPORTED_LANGUAGES.map(l => ({ code: l.code, name: l.name }))}
            />
          </div>

          {/* Recording Section */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <RecordButton
              isRecording={isRecording}
              onToggle={handleRecordToggle}
            />
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {isRecording ? "Recording... Click to stop" : "Click to start recording"}
              </p>
              <StatusBadge />
            </div>
          </div>

          {/* Transcripts */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <TranscriptDisplay
              label="Your Speech"
              transcript={sourceTranscript}
              onEdit={setSourceTranscript}
              placeholder="Start speaking or type here..."
            />
            <TranscriptDisplay
              label="Translation"
              transcript={translatedText}
              onEdit={() => {}}
              placeholder="Translation will appear here..."
              readonly
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceTranscript.trim()}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isTranslating ? "Translating..." : "Translate"}
            </Button>
            
            {translatedText && (
              <PlaybackControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onDownload={handleDownload}
              />
            )}
          </div>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-secondary/50 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">How it works:</strong> Speak into your microphone (voice input) 
            → See your words transcribed (text) → Get instant translation (text output) 
            → Hear it spoken back (voice output). Both text and voice translation work together seamlessly. 
            All processing happens securely in your browser.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          @Built by Muhammad Ameen 2025 - All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
