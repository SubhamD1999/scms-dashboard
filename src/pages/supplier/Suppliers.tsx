import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { getSuppliersApi } from "../../services/apis";
import { ApiError } from "../../services/genericService";

/* Hardcoded for now — make dynamic later */
const TRAN_ID = 1;
const ORG_ID = 4;

/* ---------------- Types (matches the GET response) ---------------- */
 
interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierDescription: string | null;
  supplierAddress: string | null;
  supplierContactNo: string | null;
  supplierEmail: string | null;
  hospId: number;
  supplierLicenceNo: string | null;
  supplierLicenceDate: string | null;
  entBy: number | null;
  entDate: string | null;
  entUserMc: string | null;
}

interface SuppliersResponse {
  status: boolean;
  statusCode: number;
  response: string;
  data: Supplier[];
}

/* ---------------- Helpers ---------------- */

// Data has "", " ", "." and null as "empty" — normalize them
const clean = (v: string | null | undefined) => {
  const t = (v ?? "").trim();
  return t && t !== "." ? t : "";
};
const dash = (v: string | null | undefined) => clean(v) || "—";

const fmtDate = (v: string | null | undefined) => {
  const t = clean(v);
  if (!t) return "—";
  const d = new Date(t);
  return isNaN(d.getTime())
    ? t
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const PAGE_SIZES = [10, 25, 50, 100];

/* ---------------- Page ---------------- */

export default function Suppliers() {
  const [rows, setRows] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = (await getSuppliersApi(
          TRAN_ID,
          { orgId: ORG_ID },
          ac.signal
        )) as SuppliersResponse;
        if (!res.status) throw new Error(res.response || "Failed to load suppliers");
        setRows(res.data ?? []);
      } catch (err) {
        if (ac.signal.aborted) return;
        setError(
          err instanceof ApiError || err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [reloadKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? rows.filter((s) =>
          [
            s.supplierName,
            s.supplierDescription,
            s.supplierContactNo,
            s.supplierEmail,
            s.supplierLicenceNo,
            s.supplierAddress,
          ].some((v) => (v ?? "").toLowerCase().includes(q))
        )
      : rows;
    return [...list].sort((a, b) =>
      sortAsc
        ? a.supplierName.localeCompare(b.supplierName)
        : b.supplierName.localeCompare(a.supplierName)
    );
  }, [rows, search, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-500">
            {loading ? "Loading…" : `${rows.length} suppliers`} · Organisation {ORG_ID}
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Supplier
        </button>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, contact, email, licence…"
              className="h-9 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-80"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-500">
            Rows
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-9 rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-blue-500"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          /* Error state */
          <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
            <AlertCircle size={28} className="text-red-500" />
            <p className="text-sm text-gray-700">{error}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">ID</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      <button
                        onClick={() => setSortAsc((s) => !s)}
                        className="inline-flex items-center gap-1 uppercase hover:text-gray-800"
                      >
                        Supplier <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Contact</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Licence</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Address</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {[10, 44, 32, 24, 36, 16].map((w, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-3 animate-pulse rounded bg-gray-100" style={{ width: `${w * 4}px` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-14 text-center">
                        <Inbox size={28} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm text-gray-500">No suppliers found</p>
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((s) => (
                      <tr key={s.supplierId} className="transition-colors hover:bg-blue-50/40">
                        <td className="px-4 py-2.5 text-sm tabular-nums text-gray-400">{s.supplierId}</td>
                        <td className="px-4 py-2.5">
                          <p className="max-w-[260px] truncate text-sm font-medium text-gray-900" title={s.supplierName}>
                            {s.supplierName}
                          </p>
                          {clean(s.supplierDescription) && (
                            <p className="max-w-[260px] truncate text-xs text-gray-500" title={clean(s.supplierDescription)}>
                              {clean(s.supplierDescription)}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="text-sm text-gray-700">{dash(s.supplierContactNo)}</p>
                          {clean(s.supplierEmail) && (
                            <p className="max-w-[200px] truncate text-xs text-gray-500" title={clean(s.supplierEmail)}>
                              {clean(s.supplierEmail)}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="text-sm text-gray-700">{dash(s.supplierLicenceNo)}</p>
                          <p className="text-xs text-gray-500">{fmtDate(s.supplierLicenceDate)}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="max-w-[220px] truncate text-sm text-gray-600" title={clean(s.supplierAddress)}>
                            {dash(s.supplierAddress)}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-xs text-gray-500">{fmtDate(s.entDate)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer / pagination */}
            {!loading && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-700">{from}–{to}</span> of{" "}
                  <span className="font-medium text-gray-700">{filtered.length}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(safePage - 1)}
                    disabled={safePage <= 1}
                    aria-label="Previous page"
                    className="rounded-lg border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {safePage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(safePage + 1)}
                    disabled={safePage >= totalPages}
                    aria-label="Next page"
                    className="rounded-lg border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddSupplierModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

/* ---------------- Add Supplier modal ---------------- */

const emptyForm = {
  supplierName: "",
  supplierDescription: "",
  supplierAddress: "",
  supplierContactNo: "",
  supplierEmail: "",
  supplierLicenceNo: "",
  supplierLicenceDate: "",
};
type SupplierForm = typeof emptyForm;

const fieldCls =
  "w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function AddSupplierModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<SupplierForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setError("");
      setNotice("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const set =
    (key: keyof SupplierForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.supplierName.trim()) {
      setError("Supplier name is required");
      return;
    }
    setError("");
    const payload = { ...form, supplierName: form.supplierName.trim(), hospId: ORG_ID };

    try {
      setSaving(true);
      // TODO: POST endpoint pending — when shared, uncomment in apis.ts and call:
      // await addSupplierApi(TRAN_ID, payload);
      // then onClose() + refetch the list.
      console.log("[Add Supplier] payload ready:", payload);
      setNotice("POST endpoint not connected yet — payload logged to console.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Add Supplier</h2>
            <p className="text-xs text-gray-500">Fields marked * are required</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-gray-500 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Supplier Name *</label>
            <input
              autoFocus
              value={form.supplierName}
              onChange={set("supplierName")}
              placeholder="e.g. Acme Pharmaceuticals Pvt. Ltd."
              className={`${fieldCls} h-9`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
            <input
              value={form.supplierDescription}
              onChange={set("supplierDescription")}
              placeholder="e.g. Medicine Supplier"
              className={`${fieldCls} h-9`}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Contact No</label>
            <input
              value={form.supplierContactNo}
              onChange={set("supplierContactNo")}
              inputMode="tel"
              placeholder="98XXXXXXXX"
              className={`${fieldCls} h-9`}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={form.supplierEmail}
              onChange={set("supplierEmail")}
              placeholder="name@company.com"
              className={`${fieldCls} h-9`}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Licence No</label>
            <input
              value={form.supplierLicenceNo}
              onChange={set("supplierLicenceNo")}
              placeholder="e.g. 20B/3/28/2005"
              className={`${fieldCls} h-9`}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Licence Date</label>
            <input
              type="date"
              value={form.supplierLicenceDate}
              onChange={set("supplierLicenceDate")}
              className={`${fieldCls} h-9`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Address</label>
            <textarea
              rows={2}
              value={form.supplierAddress}
              onChange={set("supplierAddress")}
              placeholder="Full address"
              className={`${fieldCls} py-2`}
            />
          </div>

          {notice && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 sm:col-span-2">
              {notice}
            </p>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}