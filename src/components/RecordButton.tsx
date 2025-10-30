import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordButtonProps {
  isRecording: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const RecordButton = ({ isRecording, onToggle, disabled }: RecordButtonProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {isRecording && (
        <>
          <div className="absolute inset-0 rounded-full bg-success opacity-20 pulse-ring" />
          <div className="absolute inset-0 rounded-full bg-success opacity-10 pulse-ring" style={{ animationDelay: '0.5s' }} />
        </>
      )}
      <Button
        onClick={onToggle}
        disabled={disabled}
        size="lg"
        className={`
          relative w-24 h-24 rounded-full transition-all duration-300
          ${isRecording 
            ? 'bg-success hover:bg-success/90 shadow-lg shadow-success/50' 
            : 'bg-primary hover:bg-primary/90'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isRecording ? (
          <Square className="w-8 h-8" fill="currentColor" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </Button>
    </div>
  );
};

export default RecordButton;
