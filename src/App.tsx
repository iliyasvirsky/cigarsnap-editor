import { useState, useEffect } from 'react'
import { Image as ImageIcon, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Editor from './components/Editor'
import Gallery from './components/Gallery'
import './index.css'

type Tab = 'editor' | 'gallery'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('editor')
  const [savedImages, setSavedImages] = useState<any[]>([])

  // Load from localStorage when app starts
  useEffect(() => {
    const saved = localStorage.getItem('cigarsnap-journal')
    if (saved) {
      try {
        setSavedImages(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load journal')
      }
    }
  }, [])

  // Auto-save to localStorage whenever journal changes
  useEffect(() => {
    localStorage.setItem('cigarsnap-journal', JSON.stringify(savedImages))
  }, [savedImages])

  const handleSave = (imageData: any) => {
    setSavedImages(prev => [imageData, ...prev])
  }

  const clearJournal = () => {
    if (window.confirm('Clear entire journal? This cannot be undone.')) {
      setSavedImages([])
      localStorage.removeItem('cigarsnap-journal')
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] text-amber-100">
      {/* Header */}
      <header className="border-b border-amber-900/50 bg-[#1a120b] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🍂</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-amber-100">CigarSnap</h1>
              <p className="text-xs text-amber-400/70 -mt-1">Studio • Local Only (saved in your browser)</p>
            </div>
          </div>

          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-6 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'editor'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'hover:bg-amber-900/50 text-amber-300'
                }`}
            >
              <ImageIcon className="w-4 h-4" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'gallery'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'hover:bg-amber-900/50 text-amber-300'
                }`}
            >
              <BookOpen className="w-4 h-4" />
              Journal
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Editor onSave={handleSave} />
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Gallery
                savedImages={savedImages}
                onClear={clearJournal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-amber-900/30 py-8 text-center text-xs text-amber-500/60">
        Built with ❤️ for cigar lovers • Fully client-side • Data saved only in your browser •
        <a href="https://github.com/iliyasvirsky/cigarsnap-editor" target="_blank" className="hover:text-amber-400">GitHub</a>
      </footer>
    </div>
  )
}

export default App