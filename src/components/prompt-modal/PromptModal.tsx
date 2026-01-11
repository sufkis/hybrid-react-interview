import { useEffect, useMemo, useState } from "react";
import { Category, Prompt } from "../../contexts/PromptsContext";
import { buildPreview, extractVariables } from "../../utils/template";
import './PromptModal.css';

type FormState = {
  title: string;
  category: Category;
  template: string;
};

type Props = {
  isOpen: boolean;
  mode: "create" | "edit";
  initialPrompt?: Prompt | null;
  onClose: () => void;
  onSave: (data: FormState) => void;
};

export function PromptModal({ isOpen, mode, initialPrompt, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormState>({
    title: "",
    category: "Coding",
    template: "",
  });

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialPrompt) {
      setForm({
        title: initialPrompt.title,
        category: initialPrompt.category,
        template: initialPrompt.template,
      });
    } else {
      setForm({ title: "", category: "Coding", template: "" });
    }
  }, [isOpen, mode, initialPrompt]);

  const variables = useMemo(() => extractVariables(form.template), [form.template]);

  useEffect(() => {
    setValues((prev) => {
      const next: Record<string, string> = {};
      for (const v of variables) next[v] = prev[v] ?? "";
      return next;
    });
  }, [variables]);

  const finalPreview = useMemo(() => buildPreview(form.template, values), [form.template, values]);

  const missingVars = useMemo(() => {
    return variables.filter((v) => !values[v]?.trim());
  }, [variables, values]);

  const titleText = mode === "create" ? "Add Prompt" : "Edit Prompt";

  if (!isOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: form.title.trim(),
      category: form.category,
      template: form.template,
    });
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{titleText}</h2>
          <button type="button" className="close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="modal-body">
          <label className="field">
            <span className="label">Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g., Blog Post Writer"
            />
          </label>

          <label className="field">
            <span className="label">Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as Category }))}
            >
              <option value="Coding">Coding</option>
              <option value="Writing">Writing</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="field">
            <span className="label">Template</span>
            <textarea
              rows={3}
              value={form.template}
              onChange={(e) => setForm((p) => ({ ...p, template: e.target.value }))}
              placeholder="Write a blog post about {topic} in a {tone} style"
            />
          </label>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">
              Save
            </button>
          </div>

          {variables.length > 0 && (
            <>
              <div className="variable-section">
                <h3 className="section-title">Variables</h3>
                <div className="variable-list">
                  {variables.map((variable) => (
                    <label key={variable} className="field">
                      <span className="label">{variable}</span>
                      <input
                        value={values[variable] ?? ""}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [variable]: e.target.value }))
                        }
                        placeholder={`Enter ${variable}`}
                      />
                    </label>
                  ))}
                </div>
                {missingVars.length > 0 && (
                  <div className="warning">
                    Missing values: {missingVars.join(", ")}
                  </div>
                )}
              </div>

              <div className="preview-section">
                <h3 className="section-title">Final Prompt Preview</h3>
                <div className="preview">{finalPreview || <span className="hint">Preview will appear here.</span>}</div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}