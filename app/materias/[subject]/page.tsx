import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DocumentCard } from "@/components/DocumentCard";
import { getDocumentsBySubject } from "@/lib/documents";

export const dynamic = "force-dynamic";

export default async function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = decodeURIComponent(params.subject);
  const documents = await getDocumentsBySubject(params.subject);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <Link href="/buscar" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        Volver a búsqueda
      </Link>
      <div className="mb-8">
        <p className="text-sm font-medium text-brand">Materia</p>
        <h1 className="mt-1 text-3xl font-semibold text-ink">{subject}</h1>
        <p className="mt-2 text-muted">Archivos ordenados por fecha de subida.</p>
      </div>

      <div className="grid gap-3">
        {documents.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
        {documents.length === 0 && (
          <div className="rounded-lg border border-dashed border-line bg-white p-10 text-center">
            <h2 className="font-medium text-ink">No hay PDFs para esta materia</h2>
            <p className="mt-2 text-sm text-muted">Podés subir el primer archivo desde el panel de carga.</p>
            <Link
              href="/subir"
              className="mt-5 inline-flex rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4b40]"
            >
              Subir material
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
