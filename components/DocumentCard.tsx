import Link from "next/link";
import { Download, ExternalLink, FileText } from "lucide-react";
import type { Document } from "@/lib/types";
import { formatDate, slugifySubject } from "@/utils/text";

export function DocumentCard({ document }: { document: Document }) {
  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="rounded-full bg-brand-soft px-2.5 py-1 font-medium text-brand">{document.type}</span>
            <span>{formatDate(document.created_at)}</span>
            {document.downloads > 0 && <span>{document.downloads} descargas</span>}
          </div>
          <div className="mt-3 flex items-start gap-3">
            <FileText className="mt-1 h-5 w-5 shrink-0 text-brand" />
            <div className="min-w-0">
              <Link
                href={`/materias/${slugifySubject(document.subject)}`}
                className="text-lg font-semibold text-ink hover:underline"
              >
                {document.subject}
              </Link>
              <p className="mt-1 truncate text-sm text-muted">{document.original_filename}</p>
              <p className="mt-1 text-sm text-muted">
                Profesor: <span className="text-ink">{document.professor || "No indicado"}</span>
              </p>
              {document.description && (
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{document.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <a
            href={document.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink hover:border-brand hover:bg-brand-soft"
          >
            <ExternalLink className="h-4 w-4" />
            Ver PDF
          </a>
          <a
            href={`/api/documents/${document.id}/download`}
            download
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-3 text-sm font-medium text-white hover:bg-[#1d4b40]"
          >
            <Download className="h-4 w-4" />
            Descargar
          </a>
        </div>
      </div>
    </article>
  );
}
