import { Volume2, FileText } from "lucide-react";

interface StatusBadgeProps {
  showVoice?: boolean;
  showText?: boolean;
}

const StatusBadge = ({ showVoice = true, showText = true }: StatusBadgeProps) => {
  if (!showVoice && !showText) return null;
  
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
      {showVoice && (
        <div className="flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-accent" />
          <span>Voice</span>
        </div>
      )}
      {showVoice && showText && (
        <span className="text-border">+</span>
      )}
      {showText && (
        <div className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-primary" />
          <span>Text</span>
        </div>
      )}
    </div>
  );
};

export default StatusBadge;
