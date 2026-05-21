export const MAX_PDF_SIZE = 12 * 1024 * 1024;
export const STORAGE_BUCKETS = ["documents", "DOCUMENTS"] as const;

export function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function buildStoragePath(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const rawPath = `${crypto.randomUUID()}-${safeName || "archivo"}.${extension}`;
  return rawPath
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

export function isValidStoragePath(path: string) {
  return (
    path.length > 0 &&
    path.length <= 255 &&
    !path.includes("..") &&
    !path.startsWith("/") &&
    !path.endsWith("/") &&
    /^[A-Za-z0-9._/-]+$/.test(path)
  );
}
