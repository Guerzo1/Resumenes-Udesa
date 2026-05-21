"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { MATERIAL_TYPES } from "@/lib/types";

type SearchBoxProps = {
  defaultValue?: string;
  selectedType?: string;
  compact?: boolean;
};

export function SearchBox({ defaultValue = "", selectedType = "", compact = false }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [type, setType] = useState(selectedType);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (type) params.set("type", type);
    router.push(`/buscar${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`grid gap-2 rounded-xl border border-line bg-white p-2 shadow-soft sm:grid-cols-[1fr_190px_auto] ${
        compact ? "" : "mx-auto max-w-3xl"
      }`}
    >
      <label className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Materia, profesor o archivo"
          className="h-11 w-full rounded-md border border-transparent bg-white pl-10 pr-3 text-sm outline-none ring-brand/20 placeholder:text-muted focus:border-brand focus:ring-4"
        />
      </label>
      <select
        value={type}
        onChange={(event) => setType(event.target.value)}
        className="h-11 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none ring-brand/20 focus:border-brand focus:ring-4"
      >
        <option value="">Todos los tipos</option>
        {MATERIAL_TYPES.map((materialType) => (
          <option key={materialType} value={materialType}>
            {materialType}
          </option>
        ))}
      </select>
      <button className="h-11 rounded-md bg-brand px-5 text-sm font-medium text-white hover:bg-[#1d4b40]">
        Buscar
      </button>
    </form>
  );
}
