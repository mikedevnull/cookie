import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useOptimistic, useState } from "react";
import type { Category } from "../db/schema";
import type { DragEndEvent } from "@dnd-kit/core";

interface CategoryEditorProps {
    categories: Category[];
    onReorder: (movedId: string, relativeToId: string) => void;
    onEdit: (id: string, newLabel: string) => void;
    onAdd: (newLabel: string) => void;
    onDelete: (id: string) => void
}

const DragIcon = (
    <svg viewBox="0 0 25 25" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" fill="#121923" />
    </svg>
);

const TrashIcon = (<svg xmlns="http://www.w3.org/2000/svg" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg >
)

function SortableItem({ id, label, onEdit, onDelete }: { id: string; label: string; onEdit: CategoryEditorProps['onEdit'], onDelete: CategoryEditorProps['onDelete'] }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, animateLayoutChanges: () => false });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li className="list-row items-center justify-between" style={style} ref={setNodeRef} {...attributes} role="list-item">
            <div>&nbsp;</div>
            <input
                className="input input-ghost w-full"
                defaultValue={label}
                onBlur={(e) => {
                    const newLabel = e.target.value.trim();
                    if (newLabel) {
                        onEdit(id, newLabel);
                    }
                }}
                onKeyDown={event => {
                    if (event.key === "Enter") {
                        event.currentTarget.blur()
                    }
                }}
            />
            <div onClick={(() => onDelete(id))} className="btn btn-square btn-ghost" role="button" aria-label="Delete category">
                {TrashIcon}
            </div>
            <div {...listeners} className="btn btn-square btn-ghost" role="button" style={{ cursor: "move" }} aria-label="Move category">
                {DragIcon}
            </div>
        </li>
    );
}

export function CategoryEditor({ categories, onReorder, onEdit, onAdd, onDelete }: CategoryEditorProps) {

    const [newCategory, setNewCategory] = useState("");
    const [optimisticCategories, setOptimisticCategories] = useOptimistic(categories, (_state, newState: Category[]) => { return newState; });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = categories.findIndex((item) => item.id === active.id);
            const newIndex = categories.findIndex((item) => item.id === over?.id);
            const updated = arrayMove(categories, oldIndex, newIndex);
            setOptimisticCategories(updated);
            onReorder(active.id as string, over.id as string);
        }
    }

    function handleAddCategory() {
        const trimmedLabel = newCategory.trim();
        if (trimmedLabel) {
            onAdd(trimmedLabel);
            setNewCategory("");
        }
    }

    function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            handleAddCategory();
        }
    }

    function handleInputBlur() {
        setNewCategory("");
    }

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={categories.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                    <ul className="list bg-base-100 rounded-box shadow-md">
                        {optimisticCategories.map((category) => (
                            <SortableItem
                                key={category.id}
                                id={category.id}
                                label={category.label}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            <div className="mt-4">
                <input
                    className="input input-bordered w-full"
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
                    aria-label="Add new category"
                />
            </div>
        </>
    );
}