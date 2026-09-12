import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Pause,
  Play,
  Square,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface ExpandedTextEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  onChange: (newValue: string) => void;
}

export const ExpandedTextEditor: React.FC<ExpandedTextEditorProps> = ({
  isOpen,
  onClose,
  title,
  value,
  onChange,
}) => {
  const [localText, setLocalText] = useState(value);

  // Read Aloud (SpeechSynthesis) State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Synchronize localText with incoming value when opening
  useEffect(() => {
    if (isOpen) {
      setLocalText(value);
    } else {
      stopSpeech();
    }
  }, [isOpen, value]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  /* ---------------- SPEECH SYNTHESIS (READ ALOUD) ---------------- */

  const getBestVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return null;
    }
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Look for Hindi voice
    const hindiVoice = voices.find(
      (v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
    );
    if (hindiVoice) return hindiVoice;

    return voices[0] || null;
  };

  const startSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('इस ब्राउज़र में पढ़कर सुनाने की सुविधा उपलब्ध नहीं है।');
      return;
    }

    if (!localText || !localText.trim()) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(localText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95; // Clear natural pace

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking && !isPaused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  const resumeSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking && isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    }
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleClose = () => {
    stopSpeech();
    onChange(localText);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full sm:max-w-3xl h-[94vh] sm:h-[88vh] bg-white dark:bg-[#1E293B] sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-[#E8E5DF] dark:border-slate-700">
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-[#FAF8F5] dark:bg-[#0F172A] border-b border-[#E8E5DF] dark:border-slate-700 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={handleClose}
              className="h-9 px-3 bg-white dark:bg-slate-800 hover:bg-[#EEF3FA] dark:hover:bg-slate-700 text-[#16325C] dark:text-gray-100 border border-[#D2D8E0] dark:border-slate-700 rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-colors tap-active shrink-0 cursor-pointer shadow-2xs"
            >
              <ArrowLeft size={16} />
              <span>वापस</span>
            </button>
            <h2 className="text-[15px] font-bold text-[#16325C] dark:text-white truncate">
              {title}
            </h2>
          </div>

          {/* Quick Action: Read Aloud */}
          <div className="flex items-center gap-2">
            {!isSpeaking ? (
              <button
                type="button"
                onClick={startSpeech}
                disabled={!localText.trim()}
                className="h-9 px-3 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl text-[12.5px] font-bold flex items-center gap-1.5 transition-colors tap-active disabled:opacity-40 cursor-pointer shadow-2xs"
                title="बोलकर सुनाएँ"
              >
                <Volume2 size={15} />
                <span>पढ़कर सुनाएँ</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/70 p-1 rounded-xl border border-emerald-300 dark:border-emerald-800">
                {isPaused ? (
                  <button
                    type="button"
                    onClick={resumeSpeech}
                    className="p-1.5 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-200 rounded-lg text-[12px] font-bold flex items-center gap-1"
                    title="जारी रखें"
                  >
                    <Play size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={pauseSpeech}
                    className="p-1.5 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-200 rounded-lg text-[12px] font-bold flex items-center gap-1"
                    title="रोकें"
                  >
                    <Pause size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={stopSpeech}
                  className="p-1.5 hover:bg-rose-200 text-rose-700 dark:text-rose-400 rounded-lg text-[12px] font-bold flex items-center gap-1"
                  title="बंद करें"
                >
                  <Square size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Large Editor Content Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-[#1E293B]">
          <textarea
            value={localText}
            onChange={(e) => {
              setLocalText(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="यहाँ पूरा विवरण आराम से लिखें..."
            className="w-full h-full min-h-[300px] resize-none border-0 focus:outline-none text-[16px] sm:text-[17px] leading-relaxed text-[#1F2421] dark:text-white placeholder-[#8C96A3] bg-transparent font-normal"
          />
        </div>

        {/* Bottom Bar: Character count and Done button */}
        <div className="px-4 py-3 bg-[#FAF8F5] dark:bg-[#0F172A] border-t border-[#E8E5DF] dark:border-slate-700 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[12px] text-[#5C6773] dark:text-gray-400">
            {localText.length} अक्षर • {localText.split(/\s+/).filter(Boolean).length} शब्द
          </span>

          <button
            type="button"
            onClick={handleClose}
            className="h-10 px-6 bg-[#16325C] hover:bg-[#0F2342] text-white rounded-xl text-[14px] font-bold flex items-center gap-1.5 transition-colors tap-active cursor-pointer shadow-xs"
          >
            <Check size={16} />
            <span>हो गया (सहेजें)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ExpandButton: React.FC<{
  onClick: () => void;
  title?: string;
  className?: string;
}> = ({ onClick, title = 'बड़ा करके लिखें (विस्तृत दृश्य)', className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 bg-[#FAF8F5] dark:bg-slate-800 hover:bg-[#EEF3FA] dark:hover:bg-slate-700 text-[#16325C] dark:text-sky-300 border border-[#D2D8E0] dark:border-slate-700 rounded-xl transition-all duration-150 flex items-center justify-center tap-active shrink-0 cursor-pointer shadow-2xs ${className}`}
      title={title}
    >
      <Volume2 size={16} className="hidden" /> {/* keep lucide ref silent */}
      <span className="sr-only">Expand</span>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    </button>
  );
};
