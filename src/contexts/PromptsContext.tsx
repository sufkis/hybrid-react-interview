import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Category = "Coding" | "Writing" | "Marketing" | "Other";

export type Prompt = {
  id: string;
  title: string;
  category: Category;
  template: string;
};

type CreatePromptInput = {
  title: string;
  category: Category;
  template: string;
};

type UpdatePromptInput = Partial<Pick<Prompt, "title" | "category" | "template">>;

type PromptsContextValue = {
  prompts: Prompt[];
  isLoading: boolean;

  addPrompt: (input: CreatePromptInput) => void;
  updatePrompt: (id: string, patch: UpdatePromptInput) => void;
  deletePrompt: (id: string) => void;
};

const STORAGE_KEY = "prompts";

const PromptsContext = createContext<PromptsContextValue | null>(null);

function safeParsePrompts(raw: string | null): Prompt[] | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return null;

    return parsed.filter(isPrompt);
  } catch {
    return null;
  }
}

function isPrompt(value: unknown): value is Prompt {
  if (!value || typeof value !== "object") return false;

  const p = value as Prompt;

  return (
    typeof p.id === "string" &&
    typeof p.title === "string" &&
    typeof p.category === "string" &&
    typeof p.template === "string"
  );
}

export function PromptsProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const t = window.setTimeout(() => {
    const stored = safeParsePrompts(localStorage.getItem(STORAGE_KEY));
    setPrompts(stored ?? []);
    setIsLoading(false);
  }, 300);

  return () => clearTimeout(t);
}, []);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  }, [prompts, isLoading]);

  const addPrompt = (input: CreatePromptInput) => {
    const prompt: Prompt = {
      id: crypto.randomUUID(),
      title: input.title.trim() || "Untitled",
      category: input.category,
      template: input.template
    };
    setPrompts((prev) => [prompt, ...prev]);
  };

  const updatePrompt = (id: string, patch: UpdatePromptInput) => {
    setPrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? {
              ...prompt,
              ...patch,
              title: patch.title !== undefined ? (patch.title.trim() || "Untitled") : prompt.title,
            }
          : prompt
      )
    );
  };

  const deletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((prompt) => prompt.id !== id));
  };

  const value = useMemo<PromptsContextValue>(
    () => ({ prompts, isLoading, addPrompt, updatePrompt, deletePrompt, setPrompts }),
    [prompts, isLoading]
  );

  return <PromptsContext.Provider value={value}>{children}</PromptsContext.Provider>;
}

export function usePrompts() {
  const ctx = useContext(PromptsContext);
  if (!ctx) throw new Error("usePrompts must be used within PromptsProvider");
  return ctx;
}