import React, { useState } from 'react';
import { ThumbsUp, Share2, Check, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface CardActionRowProps {
  contentId?: string;
  contentType?: 'vichar' | 'video' | 'audio' | 'photo' | 'document' | 'notice' | string;
  contentTitle?: string;
  initialLikesCount?: number;
  title?: string;
  text?: string;
  url?: string;
  onReadMore?: () => void;
  readMoreText?: string;
  className?: string;
}

export const CardActionRow: React.FC<CardActionRowProps> = ({
  contentId,
  contentType = 'vichar',
  contentTitle,
  initialLikesCount,
  title = 'अहिंसा शिक्षा मिशन',
  text = '',
  url,
  onReadMore,
  readMoreText = 'पूरा पढ़ें →',
  className = '',
}) => {
  const { isItemLiked, toggleLike, data } = useData();
  const [copied, setCopied] = useState(false);

  // Local fallback state if contentId is not provided
  const [localLiked, setLocalLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(initialLikesCount || 0);

  // Find exact current likesCount from context if contentId is provided
  let likesCount = localLikesCount;
  if (contentId) {
    const allItems = [
      ...(data.vichar || []),
      ...(data.videos || []),
      ...(data.audio || []),
      ...(data.photos || []),
      ...(data.documents || []),
      ...(data.notices || []),
    ];
    const item = allItems.find((i) => i.id === contentId);
    if (item && typeof item.likesCount === 'number') {
      likesCount = item.likesCount;
    }
  }

  const liked = contentId ? isItemLiked(contentId) : localLiked;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contentId) {
      toggleLike(contentId, contentType, contentTitle || title);
    } else {
      setLocalLiked((prev) => {
        const next = !prev;
        setLocalLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
        return next;
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    if (navigator.share) {
      try {
        await navigator.share({
          title: contentTitle || title,
          text: text || title,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text || title}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // noop
    }
  };

  return (
    <div
      className={`flex items-center justify-between pt-2.5 mt-auto border-t border-[#E8E5DF]/60 text-[12.5px] text-[#5C6773] ${className}`}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLike}
          aria-label={liked ? 'पसंद हटाया गया' : 'पसंद करें'}
          className={`inline-flex items-center gap-1.5 font-medium transition-colors tap-active text-[12.5px] ${
            liked ? 'text-[#1E5631] font-semibold' : 'text-[#5C6773] hover:text-[#16325C]'
          }`}
        >
          <ThumbsUp size={14} className={liked ? 'fill-[#1E5631]/20 text-[#1E5631] scale-105' : 'text-[#5C6773]'} />
          <span>पसंद {likesCount > 0 ? likesCount : ''}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="साझा करें"
          className="inline-flex items-center gap-1 font-medium text-[#5C6773] hover:text-[#16325C] transition-colors tap-active text-[12.5px]"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={13.5} />}
          <span>{copied ? 'कॉपी हो गया' : '↗ साझा करें'}</span>
        </button>
      </div>

      {onReadMore && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReadMore();
          }}
          className="inline-flex items-center gap-1 font-semibold text-[#16325C] hover:text-[#0F2342] transition-colors py-0.5 tap-active text-[12.5px]"
        >
          <span>{readMoreText}</span>
          {!readMoreText.includes('→') && <ArrowRight size={13} />}
        </button>
      )}
    </div>
  );
};
