import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MATERIAL_TYPES, type Document, type MaterialType } from "@/lib/types";
import { normalizeText } from "@/utils/text";

const SELECT_COLUMNS =
  "id, created_at, subject, professor, type, description, pdf_url, original_filename, uploader_name, downloads";

export async function getRecentDocuments(limit = 12) {
  const supabase = safeCreateClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("documents")
    .select(SELECT_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Document[];
}

export async function searchDocuments(params: {
  q?: string;
  type?: string;
  subject?: string;
}) {
  const supabase = safeCreateClient();
  if (!supabase) return [];

  const queryText = normalizeText(params.q ?? "");
  const subject = normalizeText(params.subject ?? "");
  const type = MATERIAL_TYPES.includes(params.type as MaterialType) ? params.type : "";

  let query = supabase
    .from("documents")
    .select(SELECT_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(80);

  if (queryText) {
    const escaped = queryText.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.or(
      `subject.ilike.%${escaped}%,professor.ilike.%${escaped}%,type.ilike.%${escaped}%,original_filename.ilike.%${escaped}%,description.ilike.%${escaped}%`
    );
  }

  if (subject) {
    query = query.ilike("subject", subject);
  }

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Document[];
}

export async function getDocumentsBySubject(subject: string) {
  const supabase = safeCreateClient();
  if (!supabase) return [];

  const decodedSubject = decodeURIComponent(subject);

  const { data, error } = await supabase
    .from("documents")
    .select(SELECT_COLUMNS)
    .ilike("subject", decodedSubject)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Document[];
}

export async function getPopularSubjects(limit = 8) {
  const documents = await getRecentDocuments(80);
  const counts = new Map<string, number>();

  documents.forEach((document) => {
    counts.set(document.subject, (counts.get(document.subject) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([subject, count]) => ({ subject, count }));
}

function safeCreateClient() {
  try {
    return createSupabaseServerClient();
  } catch (error) {
    console.error(error);
    return null;
  }
}
