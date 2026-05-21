import Link from "next/link";
import { MATERIAL_TYPES } from "@/lib/types";

type MaterialTypeFilterProps = {
  activeType?: string;
  query?: string;
};

function buildHref(type: string, query?: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (type) params.set("type", type);
  return `/buscar${params.toString() ? `?${params.toString()}` : ""}`;
}

export function MaterialTypeFilter({ activeType = "", query }: MaterialTypeFilterProps) {
  return (
    <div className="grid gap-1">
      <Link
        href={buildHref("", query)}
        className={`rounded-md px-3 py-2 text-sm ${
          !activeType ? "bg-brand-soft font-medium text-brand" : "text-muted hover:bg-paper hover:text-ink"
        }`}
      >
        Todos
      </Link>
      {MATERIAL_TYPES.map((type) => (
        <Link
          key={type}
          href={buildHref(type, query)}
          className={`rounded-md px-3 py-2 text-sm ${
            activeType === type ? "bg-brand-soft font-medium text-brand" : "text-muted hover:bg-paper hover:text-ink"
          }`}
        >
          {type}
        </Link>
      ))}
    </div>
  );
}
