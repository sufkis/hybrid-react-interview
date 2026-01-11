import React from 'react';
import { Prompt } from '../../contexts/PromptsContext';
import './PromptList.css';

type Props = {
  prompts: Prompt[];
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
};

export function PromptList({ prompts, onEdit, onDelete }: Props) {
  if (prompts.length === 0) {
    return <div className="empty-list">No prompts found</div>;
  }

  return (
    <ul className="prompt-list">
      {prompts.map((p) => (
        <li
          key={p.id}
          className="prompt-item"
        >
          <div className="prompt-item-title">{p.title}</div>
          <div className="prompt-item-category">{p.category}</div>
          <div className="prompt-item-actions">
            <button type="button" onClick={() => onEdit(p)}>
              Edit
            </button>
            <button type="button" onClick={() => onDelete(p.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}