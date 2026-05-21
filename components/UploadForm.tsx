"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { CheckCircle, FileUp, Loader2, XCircle } from "lucide-react";
import { MATERIAL_TYPES, type MaterialType } from "@/lib/types";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import { formatBytes } from "@/utils/text";
import { MAX_PDF_SIZE } from "@/utils/files";

export function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { loading, error, success, uploadDocument } = useUploadDocument();

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ok = await uploadDocument({
      subject: String(formData.get("subject") ?? ""),
      professor: String(formData.get("professor") ?? ""),
      type: String(formData.get("type") ?? "Resumen teórico") as MaterialType,
      description: String(formData.get("description") ?? ""),
      uploaderName: String(formData.get("uploaderName") ?? ""),
      file
    });

    if (ok) {
      formRef.current?.reset();
      setFile(null);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Nombre de materia</span>
          <input
            name="subject"
            required
            maxLength={90}
            placeholder="Ej. Macroeconomía"
            className="h-11 rounded-md border border-line px-3 text-sm outline-none ring-brand/20 focus:border-brand focus:ring-4"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Profesor</span>
          <input
            name="professor"
            maxLength={90}
            placeholder="Ej. Pérez"
            className="h-11 rounded-md border border-line px-3 text-sm outline-none ring-brand/20 focus:border-brand focus:ring-4"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Tipo de material</span>
          <select
            name="type"
            className="h-11 rounded-md border border-line bg-white px-3 text-sm outline-none ring-brand/20 focus:border-brand focus:ring-4"
          >
            {MATERIAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Nombre opcional</span>
          <input
            name="uploaderName"
            maxLength={80}
            placeholder="Ej. Anónimo"
            className="h-11 rounded-md border border-line px-3 text-sm outline-none ring-brand/20 focus:border-brand focus:ring-4"
          />
        </label>
      </div>

      <label className="mt-5 grid gap-2">
        <span className="text-sm font-medium text-ink">Descripción</span>
        <textarea
          name="description"
          rows={4}
          maxLength={600}
          placeholder="Breve detalle del contenido, año o temas incluidos."
          className="resize-none rounded-md border border-line px-3 py-3 text-sm outline-none ring-brand/20 focus:border-brand focus:ring-4"
        />
      </label>

      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper px-4 py-8 text-center transition hover:border-brand hover:bg-brand-soft">
        <FileUp className="h-8 w-8 text-brand" />
        <span className="mt-3 text-sm font-medium text-ink">
          {file ? file.name : "Seleccionar PDF"}
        </span>
        <span className="mt-1 text-xs text-muted">
          {file ? formatBytes(file.size) : `Máximo ${formatBytes(MAX_PDF_SIZE)}`}
        </span>
        <input type="file" accept="application/pdf,.pdf" onChange={onFileChange} className="sr-only" />
      </label>

      {error && (
        <div className="mt-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mt-5 flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          disabled={loading}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 text-sm font-medium text-white hover:bg-[#1d4b40] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Subir PDF
        </button>
      </div>
    </form>
  );
}
