import { useEffect, useMemo, useState } from "react";
import { Category, Prompt, usePrompts } from "../../contexts/PromptsContext";
import { PromptList } from "../pormpt-list/PromptList";
import './Dashboard.css';
import { PromptModal } from "../prompt-modal/PromptModal";

export function Dashboard() {
  const { addPrompt, updatePrompt, deletePrompt, prompts, isLoading } = usePrompts();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [page, setPage] = useState(1);

  const filteredPrompts = useMemo(() => {
    const searchedValue = search.trim().toLowerCase();

    return prompts.filter((prompt) => {
      const matchesCategory = category === "All" || prompt.category === category;
      const matchesSearch =
        searchedValue === "" ||
        prompt.title.toLowerCase().includes(searchedValue) ||
        prompt.template.toLowerCase().includes(searchedValue);

      return matchesCategory && matchesSearch;
    });
  }, [prompts, search, category]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredPrompts.length / 5));
  }, [filteredPrompts.length]);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const pagedPrompts = useMemo(() => {
    const start = (page - 1) * 5;
    return filteredPrompts.slice(start, start + 5);
  }, [filteredPrompts, page]);

  const openCreate = () => {
    setEditingPrompt(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: Prompt) => {
    setEditingPrompt(p);
    setIsModalOpen(true);
  };

  const close = () => setIsModalOpen(false);

  return (
    <div>
      <div className="toolbar">
        <button type="button" onClick={openCreate}>+ Add Prompt</button>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
        >
          <option value="All">All</option>
          <option value="Coding">Coding</option>
          <option value="Writing">Writing</option>
          <option value="Marketing">Marketing</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {isLoading && <div className="loading">
        Loading......
      </div>}

      {!isLoading && <>
        <PromptList
          prompts={pagedPrompts}
          onEdit={openEdit}
          onDelete={deletePrompt}
        />

        {filteredPrompts.length > 5 && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", paddingBottom: 16 }}>
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>

            <span style={{ fontSize: 13, opacity: 0.8 }}>
              Page <b>{page}</b> / {totalPages}
            </span>

            <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        )}

        <PromptModal
          isOpen={isModalOpen}
          mode={editingPrompt ? "edit" : "create"}
          initialPrompt={editingPrompt}
          onClose={close}
          onSave={(data) => {
            if (editingPrompt) {
              updatePrompt(editingPrompt.id, data);
            } else {
              addPrompt(data);
            }
            close();
          }}
        />
      </>
      }


    </div>
  );
}