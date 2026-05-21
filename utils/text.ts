export function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function sanitizeInput(value: string, maxLength: number) {
  return normalizeText(value)
    .replace(/[<>]/g, "")
    .slice(0, maxLength);
}

export function slugifySubject(subject: string) {
  return encodeURIComponent(normalizeText(subject));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 KB";
  const units = ["Bytes", "KB", "MB"];
  const size = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** size).toFixed(size === 0 ? 0 : 1)} ${units[size]}`;
}
