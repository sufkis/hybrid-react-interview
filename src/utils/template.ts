export function extractVariables(template: string): string[] {
  const re = /\{([^{}]+)\}/g;
  const seen = new Set<string>();
  const vars: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = re.exec(template)) !== null) {
    const raw = match[1] ?? "";
    const key = raw.trim();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    vars.push(key);
  }

  return vars;
}

export function buildPreview(template: string, values: Record<string, string>): string {
  return template.replace(/\{([^{}]+)\}/g, (_full, inner) => {
    const key = String(inner).trim();
    if (!key) return "";
    return values[key] ?? "";
  });
}
