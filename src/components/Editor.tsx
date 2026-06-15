import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Save } from 'lucide-react';

interface EditorProps {
  onSave: (data: any) => void;
}

const Editor: React.FC<EditorProps> = ({ onSave }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [textOverlay, setTextOverlay] = useState('');
  const [rating, setRating] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setPreviewUrl(event.target?.result as string);
        // Reset filters
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setTextOverlay('');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.drawImage(image, 0, 0);

    // Add text overlay
    if (textOverlay) {
      ctx.filter = 'none';
      ctx.font = 'bold 48px serif';
      ctx.fillStyle = '#d4af37';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.strokeText(textOverlay, 50, canvas.height - 80);
      ctx.fillText(textOverlay, 50, canvas.height - 80);
    }

    // Add rating
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = '#fbbf24';
    const stars = '★'.repeat(rating);
    ctx.fillText(stars, 50, canvas.height - 30);
  }, [image, brightness, contrast, saturation, textOverlay, rating]);

  React.useEffect(() => {
    if (image) {
      applyFilters();
    }
  }, [applyFilters, image]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) {
      alert("Please upload an image first");
      return;
    }

    // Force re-apply filters to ensure canvas is up-to-date
    applyFilters();

    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      const link = document.createElement('a');
      link.download = `cigarsnap-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 0.95);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const saveToJournal = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) {
      alert("Please upload an image first");
      return;
    }

    // Ensure latest state is rendered
    applyFilters();

    // Use requestAnimationFrame
    requestAnimationFrame(() => {
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      const entry = {
        id: Date.now(),
        imageUrl: dataUrl,
        text: textOverlay,
        rating,
        timestamp: new Date().toISOString(),
        notes: '',
      };
      
      onSave(entry);
      alert('Saved to Journal! Switch to Journal tab to view.');
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-amber-100 mb-2">CigarSnap Editor</h2>
        <p className="text-amber-400/80">Upload a photo and give it that perfect lounge touch</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-5">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-amber-700 hover:border-amber-500 rounded-3xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#111] hover:bg-[#1a120b]"
          >
            <Upload className="w-16 h-16 text-amber-500 mb-4" />
            <p className="text-xl font-medium mb-1">Drop your cigar photo here</p>
            <p className="text-amber-400/70">or click to browse</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {previewUrl && (
            <div className="mt-6">
              <canvas
                ref={canvasRef}
                className="editor-canvas mx-auto block rounded-2xl shadow-2xl"
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="lg:col-span-7 space-y-8">
          {image ? (
            <>
              <div className="bg-[#1a120b] p-8 rounded-3xl border border-amber-900/50">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <span>✨</span> Adjustments
                </h3>
                
                <div className="space-y-8">
                  {/* Brightness */}
                  <div>
                    <label className="flex justify-between text-sm mb-2">
                      <span>Brightness</span>
                      <span>{brightness}%</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="flex justify-between text-sm mb-2">
                      <span>Contrast</span>
                      <span>{contrast}%</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <label className="flex justify-between text-sm mb-2">
                      <span>Saturation</span>
                      <span>{saturation}%</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Text & Rating */}
              <div className="bg-[#1a120b] p-8 rounded-3xl border border-amber-900/50">
                <h3 className="text-xl font-semibold mb-6">Add Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">Text Overlay (Brand / Notes)</label>
                    <input
                      type="text"
                      value={textOverlay}
                      onChange={(e) => setTextOverlay(e.target.value)}
                      placeholder="e.g. Padron 1964 • 92 points"
                      className="w-full bg-[#111] border border-amber-800 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-3">Rating</label>
                    <div className="flex gap-3">
                      {[1,2,3,4,5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-5xl transition-all ${rating >= star ? 'text-amber-400 scale-110' : 'text-amber-900'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={downloadImage}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 py-5 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.985]"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </button>
                
                <button
                  onClick={saveToJournal}
                  className="flex-1 border border-amber-600 hover:bg-amber-900 py-5 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all"
                >
                  <Save className="w-5 h-5" />
                  Save to Journal
                </button>
              </div>
            </>
          ) : (
            <div className="bg-[#1a120b] p-12 rounded-3xl text-center border border-amber-900/50">
              <p className="text-amber-400 text-lg">Upload an image to start editing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
