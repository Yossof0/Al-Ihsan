import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

export default function TodoCard({ card, onDelete, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: isDragging ? 0.4 : 1, scale: isDragging ? 1.05 : 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`group rounded-xl p-3 bg-white dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 shadow-sm cursor-grab active:cursor-grabbing
        ${isDragging ? 'shadow-xl ring-2 ring-sakeenah-400 dark:ring-layl-400' : 'hover:shadow-md'}`}
    >
      <div className="flex justify-between items-start gap-2">
        <p
          className="text-sm font-medium text-sakeenah-800 dark:text-layl-100 cursor-text"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(card)}
        >
          {card.title}
        </p>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(card.id)}
          className="opacity-0 group-hover:opacity-100 text-sakeenah-300 dark:text-layl-500 hover:text-red-500 text-xs transition-opacity shrink-0"
        >
          ✕
        </button>
      </div>
      {card.description && (
        <p className="text-xs text-sakeenah-400 dark:text-layl-500 mt-1 line-clamp-2">{card.description}</p>
      )}
      {card.color && <div className={`h-1 rounded-full mt-2 ${card.color}`} />}
    </motion.div>
  );
}
