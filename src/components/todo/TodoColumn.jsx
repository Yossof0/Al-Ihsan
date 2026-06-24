import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import TodoCard from './TodoCard';

export default function TodoColumn({ column, cards, onRename, onDeleteColumn, onAddCard, onDeleteCard, onEditCard }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(column.name);

  const submitCard = () => {
    if (!newTitle.trim()) { setAdding(false); return; }
    onAddCard(column.id, newTitle.trim());
    setNewTitle('');
    setAdding(false);
  };

  const submitName = () => {
    setEditingName(false);
    if (name.trim() && name !== column.name) onRename(column.id, name.trim());
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 flex flex-col rounded-2xl p-3 transition-colors duration-200
        ${isOver ? 'bg-sakeenah-100 dark:bg-layl-800' : 'bg-sakeenah-50 dark:bg-layl-900/60'}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        {editingName ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={submitName}
            onKeyDown={(e) => e.key === 'Enter' && submitName()}
            className="text-sm font-bold bg-transparent outline-none border-b border-sakeenah-300 dark:border-layl-600 text-sakeenah-800 dark:text-layl-100"
          />
        ) : (
          <h3
            onClick={() => setEditingName(true)}
            className="text-sm font-bold text-sakeenah-800 dark:text-layl-100 cursor-text flex items-center gap-1.5"
          >
            {column.name}
            <span className="text-xs font-normal text-sakeenah-400 dark:text-layl-500">{cards.length}</span>
          </h3>
        )}
        <button
          onClick={() => onDeleteColumn(column.id)}
          className="text-sakeenah-300 dark:text-layl-500 hover:text-red-500 text-xs"
        >
          ✕
        </button>
      </div>

      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 min-h-[20px]">
          <AnimatePresence>
            {cards.map((card) => (
              <TodoCard key={card.id} card={card} onDelete={onDeleteCard} onEdit={onEditCard} />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      {adding ? (
        <div className="mt-2">
          <textarea
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitCard(); } }}
            placeholder="Card title…"
            rows={2}
            className="w-full px-2 py-1.5 rounded-lg text-sm bg-white dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 outline-none focus:ring-2 focus:ring-sakeenah-400"
          />
          <div className="flex gap-2 mt-1.5">
            <button onClick={submitCard} className="px-3 py-1 rounded-lg text-xs font-bold bg-sakeenah-500 dark:bg-layl-600 text-white">
              Add
            </button>
            <button onClick={() => setAdding(false)} className="px-3 py-1 rounded-lg text-xs text-sakeenah-500 dark:text-layl-400">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-2 text-left text-xs font-semibold text-sakeenah-400 dark:text-layl-500 hover:text-sakeenah-600 dark:hover:text-layl-300 px-1"
        >
          + Add card
        </button>
      )}
    </div>
  );
}
