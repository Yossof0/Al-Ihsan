import { useEffect, useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { getAll, putItem, deleteItem } from '../../db';
import TodoColumn from './TodoColumn';
import TodoCard from './TodoCard';

const DEFAULT_COLUMNS = [
  { id: 'col-todo', name: 'To Do', order: 1 },
  { id: 'col-doing', name: 'Doing', order: 2 },
  { id: 'col-done', name: 'Done', order: 3 },
];

export default function TodoBoard() {
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const refresh = async () => {
    let cols = await getAll('todoColumns');
    if (cols.length === 0) {
      for (const c of DEFAULT_COLUMNS) await putItem('todoColumns', c);
      cols = DEFAULT_COLUMNS;
    }
    const allCards = await getAll('todoCards');
    setColumns(cols.sort((a, b) => a.order - b.order));
    setCards(allCards.sort((a, b) => a.order - b.order));
  };

  useEffect(() => { refresh(); }, []);

  const cardsFor = (colId) => cards.filter((c) => c.columnId === colId);

  const addColumn = async () => {
    const col = { id: `col-${Date.now()}`, name: 'New column', order: columns.length + 1 };
    await putItem('todoColumns', col);
    refresh();
  };

  const renameColumn = async (id, name) => {
    const col = columns.find((c) => c.id === id);
    await putItem('todoColumns', { ...col, name });
    refresh();
  };

  const deleteColumn = async (id) => {
    await deleteItem('todoColumns', id);
    await Promise.all(cardsFor(id).map((c) => deleteItem('todoCards', c.id)));
    refresh();
  };

  const addCard = async (columnId, title) => {
    const card = { id: `card-${Date.now()}`, columnId, title, description: '', order: cardsFor(columnId).length + 1 };
    await putItem('todoCards', card);
    refresh();
  };

  const deleteCard = async (id) => {
    await deleteItem('todoCards', id);
    refresh();
  };

  const editCard = async (card) => {
    const title = prompt('Edit card', card.title);
    if (title === null) return;
    await putItem('todoCards', { ...card, title: title.trim() || card.title });
    refresh();
  };

  const findCard = (id) => cards.find((c) => c.id === id);
  const findColumnOfCard = (id) => findCard(id)?.columnId;

  const handleDragStart = (event) => setActiveCard(findCard(event.active.id));

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeCol = findColumnOfCard(active.id);
    // `over.id` is either a card id (dropping among cards) or a column id (dropping into an empty column).
    const overCol = findColumnOfCard(over.id) || over.id;
    if (activeCol === overCol) return;

    setCards((prev) => {
      const moved = prev.map((c) => (c.id === active.id ? { ...c, columnId: overCol } : c));
      return moved;
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const activeCard = findCard(active.id);
    const overCol = findColumnOfCard(over.id) || over.id;
    const overCard = findCard(over.id);

    let reordered = [...cards];
    const fromIndex = reordered.findIndex((c) => c.id === active.id);
    let toIndex = overCard ? reordered.findIndex((c) => c.id === over.id) : reordered.length - 1;

    reordered[fromIndex] = { ...reordered[fromIndex], columnId: overCol };
    reordered = arrayMove(reordered, fromIndex, toIndex);

    // Recompute per-column order values.
    const byColumn = {};
    reordered.forEach((c) => {
      byColumn[c.columnId] = byColumn[c.columnId] || [];
      byColumn[c.columnId].push(c);
    });
    const final = [];
    Object.values(byColumn).forEach((list) => {
      list.forEach((c, i) => final.push({ ...c, order: i + 1 }));
    });

    setCards(final);
    await Promise.all(final.map((c) => putItem('todoCards', c)));
  };

  return (
    <div className="animate-fade-in">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => (
            <TodoColumn
              key={col.id}
              column={col}
              cards={cardsFor(col.id)}
              onRename={renameColumn}
              onDeleteColumn={deleteColumn}
              onAddCard={addCard}
              onDeleteCard={deleteCard}
              onEditCard={editCard}
            />
          ))}

          <button
            onClick={addColumn}
            className="w-72 shrink-0 h-fit rounded-2xl border-2 border-dashed border-sakeenah-300 dark:border-layl-700 text-sm font-semibold text-sakeenah-400 dark:text-layl-500 py-4 hover:bg-sakeenah-50 dark:hover:bg-layl-900/40 transition-colors"
          >
            + Add column
          </button>
        </div>

        <DragOverlay>
          {activeCard ? <TodoCard card={activeCard} onDelete={() => {}} onEdit={() => {}} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
