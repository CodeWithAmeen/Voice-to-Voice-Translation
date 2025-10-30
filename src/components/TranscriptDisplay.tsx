import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TranscriptDisplayProps {
  transcript: string;
  onEdit: (value: string) => void;
  placeholder?: string;
  label: string;
  readonly?: boolean;
}

const TranscriptDisplay = ({ 
  transcript, 
  onEdit, 
  placeholder = "Your transcript will appear here...",
  label,
  readonly = false
}: TranscriptDisplayProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      <Textarea
        value={transcript}
        onChange={(e) => onEdit(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] bg-card border-border resize-none"
        readOnly={readonly}
      />
    </div>
  );
};

export default TranscriptDisplay;
