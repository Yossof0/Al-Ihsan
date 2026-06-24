import { useState } from 'react';

const RING_SIZE = 64;
const RING_STROKE = 6;
const RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ThikrCard({ item, onUpdate, showRewardAlways = true }) {
  const [showProof, setShowProof] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const target = item.count || 1;
  const progress = item.progress || 0; // persisted — survives tab switches / reloads
  const totalCompleted = item.totalCompleted || 0; // lifetime count of full rounds finished
  const displayMode = item.displayMode || 'rect';
  const done = progress >= target;
  const pct = progress / target;

  const handleTap = () => {
    if (done) {
      // Finishing a round: bank it into totalCompleted and reset the ring/rect for another round.
      onUpdate?.(item, { progress: 0, totalCompleted: totalCompleted + 1 });
      return;
    }
    onUpdate?.(item, { progress: progress + 1 });
  };

  const toggleDisplayMode = (e) => {
    e.stopPropagation();
    onUpdate?.(item, { displayMode: displayMode === 'ring' ? 'rect' : 'ring' });
  };

  const handleShare = async () => {
    const shareText = `${item.text}${item.transliteration ? ` (${item.transliteration})` : ''}\n\n${item.reward}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Thikr', text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1500);
      }
    } catch {
      /* user cancelled share sheet — no-op */
    }
  };

  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-layl-900/60 border border-sakeenah-200 dark:border-layl-800 flex items-center gap-4 animate-fade-in relative">
      <button onClick={handleTap} className="shrink-0 relative" aria-label="Tap to count">
        {displayMode === 'ring' ? (
          <RingCounter pct={pct} done={done} progress={progress} target={target} />
        ) : (
          <RectCounter done={done} progress={progress} target={target} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="font-arabic text-xl text-right text-sakeenah-800 dark:text-layl-100 leading-relaxed">
          {item.text}
        </p>
        {item.transliteration && (
          <p className="text-xs text-sakeenah-400 dark:text-layl-500 mt-0.5">{item.transliteration}</p>
        )}
        {(showRewardAlways || item.alwaysShowReward) && item.reward && (
          <p className="text-xs text-sakeenah-600 dark:text-layl-300 mt-1.5 italic">{item.reward}</p>
        )}
        {totalCompleted > 0 && (
          <p className="text-xs font-semibold text-gold-500 mt-1">
            ✓ Completed {totalCompleted} {totalCompleted === 1 ? 'time' : 'times'}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          onClick={toggleDisplayMode}
          className="w-7 h-7 rounded-full bg-sakeenah-50 dark:bg-layl-800 text-sakeenah-500 dark:text-layl-300 text-xs hover:scale-110 transition-transform"
          aria-label="Switch view"
          title={displayMode === 'ring' ? 'Switch to rectangle view' : 'Switch to ring view'}
        >
          {displayMode === 'ring' ? '▭' : '◯'}
        </button>
        <button
          onClick={() => setShowProof((s) => !s)}
          className="w-7 h-7 rounded-full bg-sakeenah-50 dark:bg-layl-800 text-sakeenah-500 dark:text-layl-300 text-xs font-bold hover:scale-110 transition-transform"
          aria-label="Show proof"
          title="Show proof / source"
        >
          ⓘ
        </button>
        <button
          onClick={handleShare}
          className="w-7 h-7 rounded-full bg-sakeenah-50 dark:bg-layl-800 text-sakeenah-500 dark:text-layl-300 text-xs hover:scale-110 transition-transform"
          aria-label="Share"
          title="Share"
        >
          {shareCopied ? '✓' : '↗'}
        </button>
      </div>

      {showProof && (
        <div className="absolute right-4 top-16 max-w-xs p-3 rounded-xl bg-sakeenah-800 dark:bg-layl-700 text-white text-xs shadow-lg z-10 animate-fade-in">
          <p className="font-bold mb-1">Proof / Source</p>
          <p>{item.proof || 'No source attached yet.'}</p>
        </div>
      )}
    </div>
  );
}

function RingCounter({ pct, done, progress, target }) {
  const offset = CIRCUMFERENCE * (1 - pct);
  return (
    <svg width={RING_SIZE} height={RING_SIZE} className="rotate-[-90deg]">
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        fill="none"
        strokeWidth={RING_STROKE}
        className="stroke-sakeenah-100 dark:stroke-layl-800"
      />
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        fill="none"
        strokeWidth={RING_STROKE}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={`transition-all duration-300 ${done ? 'stroke-gold-500' : 'stroke-sakeenah-500 dark:stroke-layl-400'}`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="rotate-90 fill-sakeenah-800 dark:fill-layl-100 text-[13px] font-bold"
        transform={`rotate(90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
      >
        {progress}/{target}
      </text>
    </svg>
  );
}

function RectCounter({ done, progress, target }) {
  return (
    <div
      className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-sm transition-colors
        ${done ? 'bg-gold-500 text-white' : 'bg-sakeenah-100 dark:bg-layl-800 text-sakeenah-700 dark:text-layl-200'}`}
    >
      {progress}/{target}
    </div>
  );
}
