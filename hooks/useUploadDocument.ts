"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { MATERIAL_TYPES, type MaterialType } from "@/lib/types";
import { buildStoragePath, isPdf, MAX_PDF_SIZE, STORAGE_BUCKET } from "@/utils/files";
import { sanitizeInput } from "@/utils/text";

type UploadState = {
  loading: boolean;
  error: string | null;
  success: string | null;
};

type UploadPayload = {
  subject: string;
  professor: string;
  type: MaterialType;
  description: string;
  uploaderName: string;
  file: File | null;
};

export function useUploadDocument() {
  const [state, setState] = useState<UploadState>({
    loading: false,
    error: null,
    success: null
  });

  async function uploadDocument(payload: UploadPayload) {
    setState({ loading: true, error: null, success: null });
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setState({
        loading: false,
        error: "Faltan las variables de entorno de Supabase.",
        success: null
      });
      return false;
    }

    const subject = sanitizeInput(payload.subject, 90);
    const professor = sanitizeInput(payload.professor, 90);
    const description = sanitizeInput(payload.description, 600);
    const uploaderName = sanitizeInput(payload.uploaderName, 80);

    if (!subject) {
      setState({ loading: false, error: "Ingresá el nombre de la materia.", success: null });
      return false;
    }

    if (!MATERIAL_TYPES.includes(payload.type)) {
      setState({ loading: false, error: "Elegí un tipo de material válido.", success: null });
      return false;
    }

    if (!payload.file) {
      setState({ loading: false, error: "Seleccioná un archivo PDF.", success: null });
      return false;
    }

    if (!isPdf(payload.file)) {
      setState({ loading: false, error: "Solo se permiten archivos PDF.", success: null });
      return false;
    }

    if (payload.file.size > MAX_PDF_SIZE) {
      setState({
        loading: false,
        error: "El PDF no puede superar los 12 MB.",
        success: null
      });
      return false;
    }

    const path = buildStoragePath(payload.file);

    const upload = await supabase.storage.from(STORAGE_BUCKET).upload(path, payload.file, {
      cacheControl: "3600",
      contentType: "application/pdf",
      upsert: false
    });

    if (upload.error) {
      setState({
        loading: false,
        error: "No se pudo subir el PDF. Revisá la configuración de Storage.",
        success: null
      });
      return false;
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

    const insert = await supabase.from("documents").insert({
      subject,
      professor: professor || null,
      type: payload.type,
      description: description || null,
      pdf_url: publicUrl,
      original_filename: sanitizeInput(payload.file.name, 180),
      uploader_name: uploaderName || null,
      downloads: 0
    });

    if (insert.error) {
      await supabase.storage.from(STORAGE_BUCKET).remove([path]);
      setState({
        loading: false,
        error: "El PDF subió, pero no se pudo guardar el registro.",
        success: null
      });
      return false;
    }

    setState({
      loading: false,
      error: null,
      success: "Archivo subido correctamente."
    });

    return true;
  }

  return { ...state, uploadDocument };
}
