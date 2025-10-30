import { Button } from "@/components/ui/button";
import { Play, Pause, Download } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onDownload: () => void;
  disabled?: boolean;
}

const PlaybackControls = ({ isPlaying, onPlayPause, onDownload, disabled }: PlaybackControlsProps) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onPlayPause}
        disabled={disabled}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Play
          </>
        )}
      </Button>
      <Button
        onClick={onDownload}
        disabled={disabled}
        variant="outline"
        className="border-accent text-accent hover:bg-accent/10"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  );
};

export default PlaybackControls;
