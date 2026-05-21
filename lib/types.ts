export const MATERIAL_TYPES = [
  "Resumen teórico",
  "Parcial",
  "Parcialito",
  "Tutorial",
  "TP"
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number];

export type Document = {
  id: string;
  created_at: string;
  subject: string;
  professor: string | null;
  type: MaterialType;
  description: string | null;
  pdf_url: string;
  original_filename: string;
  uploader_name: string | null;
  downloads: number;
};

export type DocumentInsert = Omit<Document, "id" | "created_at" | "downloads"> & {
  downloads?: number;
};

export type SearchParams = {
  q?: string;
  type?: string;
  subject?: string;
};
