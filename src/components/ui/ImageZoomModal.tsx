import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, X, Download } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  imageUrl: string;
  title?: string;
  caption?: string;
  onClose: () => void;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  imageUrl,
  title,
  caption,
  onClose,
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Reset controls when modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setScale((prev) => Math.min(prev + 0.3, 4));
      } else if (e.key === '-') {
        e.preventDefault();
        setScale((prev) => Math.max(prev - 0.3, 0.5));
      } else if (e.key === '0') {
        e.preventDefault();
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setRotation(0);
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setRotation((prev) => (prev + 90) % 360);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.3, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.3, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      handleReset();
    }
  };

  // Dragging support when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.2, 4));
    } else {
      setScale((prev) => Math.max(prev - 0.2, 0.5));
    }
  };

  if (!isOpen || !imageUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/92 backdrop-blur-md text-white p-3 sm:p-5 select-none"
        onClick={onClose}
      >
        {/* Top Header Controls Bar */}
        <div
          className="w-full max-w-5xl flex items-center justify-between gap-3 z-10 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title / Description */}
          <div className="min-w-0 flex-1">
            <h4 className="text-[14px] sm:text-[15px] font-bold text-white truncate">
              {title || 'फोटो पूर्वावलोकन (ज़ूम मोड)'}
            </h4>
            {caption && (
              <p className="text-[12px] text-slate-300 truncate hidden sm:block">
                {caption}
              </p>
            )}
          </div>

          {/* Zoom Level Indicator */}
          <span className="text-[12px] font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
            {Math.round(scale * 100)}%
          </span>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 transition-colors cursor-pointer tap-active"
              title="ज़ूम कम करें (-)"
            >
              <ZoomOut size={18} />
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 4}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 transition-colors cursor-pointer tap-active"
              title="ज़ूम बढ़ाएं (+)"
            >
              <ZoomIn size={18} />
            </button>

            <button
              type="button"
              onClick={handleRotate}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer tap-active"
              title="घुमाएं (R)"
            >
              <RotateCw size={18} />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer tap-active hidden sm:flex"
              title="रीसेट करें (0)"
            >
              <Maximize2 size={18} />
            </button>

            {/* Download Button if valid URL */}
            <a
              href={imageUrl}
              download="ahimsa_photo.jpg"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer tap-active flex items-center justify-center"
              title="डाउनलोड करें"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={18} />
            </a>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer tap-active ml-1"
              title="बंद करें (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Central Canvas View */}
        <div
          className="relative w-full flex-1 flex items-center justify-center overflow-hidden my-3 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <motion.img
            src={imageUrl}
            alt={title || 'Zoomed View'}
            onDoubleClick={handleDoubleClick}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl pointer-events-auto"
            draggable={false}
          />
        </div>

        {/* Bottom Hint */}
        <div
          className="z-10 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700/60 text-[12px] text-slate-300 shadow-md text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <span>
            💡 डबल-क्लिक करें या माउस व्हील घुमाएं ज़ूम करने के लिए | माउस से खींचकर फोटो सरकाएं
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
