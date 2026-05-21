"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { MATERIAL_TYPES, type MaterialType } from "@/lib/types";
import {
  buildStoragePath,
  isPdf,
  isValidStoragePath,
  MAX_PDF_SIZE,
  STORAGE_BUCKET
} from "@/utils/files";
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
        error: "Missing Supabase environment variables.",
        success: null
      });
      return false;
    }

    const subject = sanitizeInput(payload.subject, 90);
    const professor = sanitizeInput(payload.professor, 90);
    const description = sanitizeInput(payload.description, 600);
    const uploaderName = sanitizeInput(payload.uploaderName, 80);

    if (!subject) {
      setState({ loading: false, error: "Enter the subject name.", success: null });
      return false;
    }

    if (!MATERIAL_TYPES.includes(payload.type)) {
      setState({ loading: false, error: "Choose a valid material type.", success: null });
      return false;
    }

    if (!payload.file) {
      setState({ loading: false, error: "Select a PDF file.", success: null });
      return false;
    }

    if (!isPdf(payload.file)) {
      setState({ loading: false, error: "Only PDF files are allowed.", success: null });
      return false;
    }

    if (payload.file.size > MAX_PDF_SIZE) {
      setState({
        loading: false,
        error: "The PDF cannot exceed 12 MB.",
        success: null
      });
      return false;
    }

    const fileExt = payload.file.name.split(".").pop();

    const path = `${crypto.randomUUID()}.${fileExt}`;

    const upload = await supabase.storage.from(STORAGE_BUCKET).upload("test.pdf", payload.file, {
      cacheControl: "3600",
      contentType: "application/pdf",
      upsert: false
    });

    if (upload.error) {
      console.error("Supabase Storage upload failed", {
        bucket: STORAGE_BUCKET,
        path,
        message: upload.error.message,
        statusCode: upload.error.statusCode,
        error: upload.error
      });
      setState({
        loading: false,
        error: `Upload failed: ${upload.error.message || "unknown error"}`,
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
      console.error("Supabase documents insert failed", insert.error);
      await supabase.storage.from(STORAGE_BUCKET).remove([path]);
      setState({
        loading: false,
        error: `Upload saved, but the record failed: ${insert.error.message || "unknown error"}`,
        success: null
      });
      return false;
    }

    setState({
      loading: false,
      error: null,
      success: "File uploaded successfully."
    });

    return true;
  }

  return { ...state, uploadDocument };
}
