"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import type { ColumnDefinition, CellComponent, RowComponent } from "tabulator-tables";

type Code = { id: string; short_code: string; business_name: string | null; status: string; scan_events: { scanned_at: string }[] };

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
      { title: "Actions", formatter: () => '<button type="button" class="edit-action">Edit</button><button type="button" class="delete-action">Delete</button>', hozAlign: "right", width: 140 },
    ];
    table.current = new Tabulator(tableRef.current, { data: codes.map(code => ({ ...code, scan_count: code.scan_events?.length ?? 0, last_scanned: code.scan_events?.[0]?.scanned_at ?? "" })), columns, layout: "fitColumns", pagination: true, paginationSize: 15, placeholder: "No codes here yet. Generate your first batch." });
    table.current.on("rowClick", (event: Event, row: RowComponent) => { if ((event.target as HTMLElement).closest("button")) return; router.push(`/admin/codes/${row.getData().id}`); });
    table.current.on("cellClick", async (event: UIEvent, cell: CellComponent) => {
      const action = (event.target as HTMLElement).closest("button")?.textContent;
      if (action === "Edit") router.push(`/admin/codes/${cell.getRow().getData().id}`);
      if (action === "Delete") {
        const row = cell.getRow();
        const code = row.getData() as Code;
        if (!window.confirm(`Delete QR code ${code.short_code}? Its scan history will also be deleted.`)) return;
        const { error } = await (await import("@/lib/supabase/browser")).createClient().from("qr_codes").delete().eq("id", code.id);
        if (error) window.alert(error.message); else { onDeletedRef.current(code.id); await row.delete(); }
      }
    });
    return () => { table.current?.destroy(); table.current = null; };
  }, [codes, router]);
  return <div ref={tableRef} className="relay-table" />;
}
