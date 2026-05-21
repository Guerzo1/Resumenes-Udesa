import Link from "next/link";
import { BookOpen, Upload } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
            <BookOpen className="h-4 w-4" />
          </span>
          UdeSA Resúmenes
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link className="rounded-md px-3 py-2 text-muted hover:bg-white hover:text-ink" href="/buscar">
            Buscar
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-brand px-3 py-2 font-medium text-white hover:bg-[#1d4b40]"
            href="/subir"
          >
            <Upload className="h-4 w-4" />
            Subir
          </Link>
        </nav>
      </div>
    </header>
  );
}
