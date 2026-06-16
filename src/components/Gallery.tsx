import React from 'react';
import { Download } from 'lucide-react';

interface GalleryProps {
  savedImages: any[];
  onClear?: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ savedImages, onClear }) => {
  return (
    <div>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-amber-100 mb-2">Your Cigar Journal</h2>
          <p className="text-amber-400/70">Memories from the lounge • {savedImages.length} entries</p>
        </div>

        {savedImages.length > 0 && onClear && (
          <button
            onClick={onClear}
            className="px-5 py-2 text-sm border border-red-800 hover:bg-red-950/50 text-red-400 rounded-2xl transition-colors"
          >
            Clear Journal
          </button>
        )}
      </div>

      {savedImages.length === 0 ? (
        <div className="bg-[#1a120b] rounded-3xl p-16 text-center border border-amber-900/50">
          <div className="mx-auto w-24 h-24 bg-amber-900/30 rounded-full flex items-center justify-center mb-6 text-4xl">
            📖
          </div>
          <h3 className="text-2xl font-medium mb-3 text-amber-100">No entries yet</h3>
          <p className="text-amber-400/70 max-w-md mx-auto">
            Go to the Editor tab and save some beautiful cigar shots to build your personal collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedImages.map((entry, index) => (
            <div
              key={entry.id || index}
              className="bg-[#1a120b] rounded-3xl overflow-hidden border border-amber-900/50 group"
            >
              <div className="aspect-square relative">
                <img
                  src={entry.imageUrl}
                  alt={`Cigar entry ${index}`}
                  className="mx-auto block"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-sm font-mono text-amber-300">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl text-amber-400">
                    {"★".repeat(entry.rating || 5)}
                  </div>
                  {entry.text && (
                    <div className="text-amber-400 text-sm font-medium text-right max-w-[140px]">
                      {entry.text}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = entry.imageUrl;
                    a.download = `cigarsnap-${entry.id || Date.now()}.png`;
                    a.click();
                  }}
                  className="text-xs w-full py-3 border border-amber-700 hover:bg-amber-950 rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;