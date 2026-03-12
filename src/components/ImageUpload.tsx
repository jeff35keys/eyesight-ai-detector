import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview: string | null;
  onClear: () => void;
}

export function ImageUpload({ onImageSelect, preview, onClear }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => onImageSelect(file, e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 shadow-medical">
        <img src={preview} alt="Fundus preview" className="w-full max-h-96 object-contain bg-black/5" />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-3 right-3 rounded-full"
          onClick={onClear}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-12 rounded-xl border-2 border-dashed cursor-pointer transition-all',
        dragOver ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
    >
      <div className="w-16 h-16 rounded-full gradient-medical flex items-center justify-center shadow-medical">
        <Upload className="w-7 h-7 text-primary-foreground" />
      </div>
      <div className="text-center">
        <p className="font-display font-semibold text-foreground">Upload Retina Fundus Image</p>
        <p className="text-sm text-muted-foreground mt-1">Drag & drop or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, TIFF</p>
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
    </label>
  );
}
