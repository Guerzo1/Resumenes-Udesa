import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("documents")
      .select("pdf_url")
      .eq("id", params.id)
      .single();

    if (error || !data?.pdf_url) {
      return NextResponse.json({ error: "Archivo no encontrado." }, { status: 404 });
    }

    await supabase.rpc("increment_document_downloads", { document_id: params.id });

    return NextResponse.redirect(data.pdf_url);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo procesar la descarga." }, { status: 500 });
  }
}
