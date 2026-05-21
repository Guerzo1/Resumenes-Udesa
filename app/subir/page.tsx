import { UploadForm } from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-ink">Subir material</h1>
        <p className="mt-2 text-muted">Compartí un PDF para que otros estudiantes puedan encontrarlo.</p>
      </div>
      <UploadForm />
    </div>
  );
}
