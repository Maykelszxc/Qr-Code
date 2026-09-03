"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import type { ColumnDefinition, CellComponent, RowComponent } from "tabulator-tables";

type Code = { id: string; short_code: string; business_name: string | null; status: string; scan_events: { scanned_at: string }[] };

const actionIcons = {
  view: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16.5-.8 3.8 3.8-.8L18.5 8a2.8 2.8 0 0 0-4-4L3.5 15.5Z"/><path d="m13.5 5.5 5 5"/></svg>',
  delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
};

export function CodeTable({ codes, onDeleted }: { codes: Code[]; onDeleted: (id: string) => void }) {
  const tableRef = useRef<HTMLDivElement>(null);
  const table = useRef<Tabulator | null>(null);
  const onDeletedRef = useRef(onDeleted);
  const router = useRouter();
  useEffect(() => { onDeletedRef.current = onDeleted; }, [onDeleted]);
  useEffect(() => {
    if (!tableRef.current) return;
    const columns: ColumnDefinition[] = [
      { title: "Code", field: "short_code", sorter: "string", formatter: (cell: CellComponent) => `<span class="mono-link">${cell.getValue()}</span>` },
      { title: "Business", field: "business_name", formatter: (cell: CellComponent) => cell.getValue() || '<span class="muted">Unassigned</span>' },
      { title: "Status", field: "status", formatter: (cell: CellComponent) => `<span class="status status-${cell.getValue()}">${cell.getValue()}</span>` },
      { title: "Scans", field: "scan_count", sorter: "number" },
      { title: "Last scanned", field: "last_scanned", sorter: "date", formatter: (cell: CellComponent) => cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : "-" },
      { title: "Actions", formatter: () => `<div class="table-actions"><button type="button" class="view-action" data-action="view" aria-label="View QR code" title="View QR code">${actionIcons.view}</button><button type="button" class="edit-action" data-action="edit" aria-label="Edit code" title="Edit code">${actionIcons.edit}</button><button type="button" class="delete-action" data-action="delete" aria-label="Delete code" title="Delete code">${actionIcons.delete}</button></div>`, hozAlign: "right", width: 140 },
    ];
    table.current = new Tabulator(tableRef.current, { data: codes.map(code => ({ ...code, scan_count: code.scan_events?.length ?? 0, last_scanned: code.scan_events?.[0]?.scanned_at ?? "" })), columns, layout: "fitColumns", pagination: true, paginationSize: 15, placeholder: "No codes here yet. Generate your first batch." });
    table.current.on("rowClick", (event: Event, row: RowComponent) => { if ((event.target as HTMLElement).closest("button")) return; router.push(`/admin/codes/${row.getData().id}`); });
    table.current.on("cellClick", async (event: UIEvent, cell: CellComponent) => {
      const action = (event.target as HTMLElement).closest("button")?.dataset.action;
      const code = cell.getRow().getData() as Code;
      if (action === "view") window.open(`/admin/codes/${code.id}/qr`, "_blank", "noopener,noreferrer");
      if (action === "edit") router.push(`/admin/codes/${code.id}`);
      if (action === "delete") {
        const row = cell.getRow();
        if (!window.confirm(`Delete QR code ${code.short_code}? Its scan history will also be deleted.`)) return;
        const { error } = await (await import("@/lib/supabase/browser")).createClient().from("qr_codes").delete().eq("id", code.id);
        if (error) window.alert(error.message); else { onDeletedRef.current(code.id); await row.delete(); }
      }
    });
    return () => { table.current?.destroy(); table.current = null; };
  }, [codes, router]);
  return <div ref={tableRef} className="relay-table" />;
}
