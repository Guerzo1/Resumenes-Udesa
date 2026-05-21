import { DocumentCard } from "@/components/DocumentCard";
import { MaterialTypeFilter } from "@/components/MaterialTypeFilter";
import { SearchBox } from "@/components/SearchBox";
import { searchDocuments } from "@/lib/documents";
import type { SearchParams } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const documents = await searchDocuments(searchParams);
  const hasFilters = Boolean(searchParams.q || searchParams.type);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-ink">Buscar material</h1>
        <p className="mt-2 text-muted">Encontrá PDFs por materia, profesor, tipo o nombre de archivo.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-lg border border-line bg-white p-4 shadow-soft">
          <h2 className="text-sm font-medium text-ink">Filtros</h2>
          <div className="mt-4">
            <MaterialTypeFilter activeType={searchParams.type} query={searchParams.q} />
          </div>
        </aside>

        <section>
          <SearchBox defaultValue={searchParams.q ?? ""} selectedType={searchParams.type ?? ""} compact />
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-muted">
              {documents.length} {documents.length === 1 ? "resultado" : "resultados"}
            </p>
          </div>
          <div className="mt-4 grid gap-3">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
            {documents.length === 0 && (
              <div className="rounded-lg border border-dashed border-line bg-white p-10 text-center">
                <h2 className="font-medium text-ink">No encontramos archivos</h2>
                <p className="mt-2 text-sm text-muted">
                  {hasFilters
                    ? "Probá con otra materia, profesor o tipo de material."
                    : "Cuando se suban PDFs, van a aparecer en esta sección."}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
