import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Upload } from "lucide-react";
import { DocumentCard } from "@/components/DocumentCard";
import { SearchBox } from "@/components/SearchBox";
import { getPopularSubjects, getRecentDocuments } from "@/lib/documents";
import { slugifySubject } from "@/utils/text";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [popularSubjects, recentDocuments] = await Promise.all([
    getPopularSubjects(),
    getRecentDocuments(6)
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-sm text-muted shadow-soft">
          <BookOpen className="h-4 w-4" />
          Material compartido por estudiantes
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-normal text-ink sm:text-5xl">
          Buscá resúmenes, parciales y material de estudio.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Una biblioteca simple para encontrar y compartir PDFs de materias de la Universidad de San Andrés.
        </p>
        <div className="mt-8 w-full">
          <SearchBox />
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {popularSubjects.length > 0 ? (
            popularSubjects.map(({ subject, count }) => (
              <Link
                key={subject}
                href={`/materias/${slugifySubject(subject)}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink shadow-soft transition hover:border-brand hover:bg-brand-soft"
              >
                {subject}
                <span className="ml-2 text-muted">{count}</span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted">Cuando haya archivos subidos, las materias populares van a aparecer acá.</p>
          )}
        </div>
      </section>

      <section className="mt-14 grid gap-4 border-y border-line py-6 sm:grid-cols-3">
        <div className="flex gap-3">
          <FileText className="mt-1 h-5 w-5 text-brand" />
          <div>
            <h2 className="font-medium text-ink">PDFs ordenados</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Filtrá por materia, profesor o tipo de material.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Upload className="mt-1 h-5 w-5 text-brand" />
          <div>
            <h2 className="font-medium text-ink">Subida rápida</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Cargá un PDF sin login y dejalo disponible para otros alumnos.</p>
          </div>
        </div>
        <Link
          href="/subir"
          className="flex items-center justify-between rounded-lg border border-line bg-white p-4 text-sm font-medium text-ink shadow-soft transition hover:border-brand hover:bg-brand-soft"
        >
          Subir material
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-ink">Últimos archivos</h2>
            <p className="mt-1 text-sm text-muted">Material publicado recientemente.</p>
          </div>
          <Link href="/buscar" className="text-sm font-medium text-brand hover:underline">
            Ver todo
          </Link>
        </div>
        <div className="grid gap-3">
          {recentDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
          {recentDocuments.length === 0 && (
            <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
              Todavía no hay PDFs cargados.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
