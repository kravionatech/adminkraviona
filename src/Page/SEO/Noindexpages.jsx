import { useState, useEffect } from "react";
import { settingsApi } from "../../services/api";
import {
  FiEyeOff, FiSave, FiPlus, FiTrash2, FiCheckCircle, FiInfo,
  FiChevronDown, FiChevronUp, FiToggleLeft, FiToggleRight,
  FiEdit2, FiSearch, FiFilter, FiAlertCircle, FiShield,
  FiGlobe, FiFileText, FiTag,
} from "react-icons/fi";

// ─── Default Data ─────────────────────────────────────────────────────────────



const CATEGORIES = ["system", "funnel", "dynamic", "blog", "legal", "custom"];

const CATEGORY_CONFIG = {
  system:  { bg: "bg-red-100",    text: "text-red-700"    },
  funnel:  { bg: "bg-orange-100", text: "text-orange-700" },
  dynamic: { bg: "bg-purple-100", text: "text-purple-700" },
  blog:    { bg: "bg-blue-100",   text: "text-blue-700"   },
  legal:   { bg: "bg-gray-100",   text: "text-gray-600"   },
  custom:  { bg: "bg-teal-100",   text: "text-teal-700"   },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ value, onChange, size = 24 }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`transition-colors ${value ? "text-[#E8622A]" : "text-gray-300"}`}>
      {value ? <FiToggleRight size={size} /> : <FiToggleLeft size={size} />}
    </button>
  );
}

function SectionCard({ title, icon, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span className="text-[#E8622A]">{icon}</span>
          {title}
          {badge && <span className="ml-1 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{badge}</span>}
        </div>
        {open ? <FiChevronUp size={15} className="text-gray-400" /> : <FiChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-5 py-5">{children}</div>}
    </div>
  );
}

function CategoryBadge({ cat }) {
  const c = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.custom;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${c.bg} ${c.text}`}>
      {cat}
    </span>
  );
}

function RobotsBadge({ noindex, nofollow }) {
  const parts = [];
  if (noindex)  parts.push("noindex");
  if (nofollow) parts.push("nofollow");
  if (!parts.length) return <span className="text-xs text-gray-300">index, follow</span>;
  return (
    <code className="text-xs bg-gray-900 text-green-400 px-2 py-0.5 rounded font-mono">
      {parts.join(", ")}
    </code>
  );
}

function PageRow({ page, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(page);

  const save   = () => { onUpdate(draft); setEditing(false); };
  const cancel = () => { setDraft(page);  setEditing(false); };

  return (
    <>
      {!editing && (
        <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
          <td className="py-3 pr-3">
            <div className="text-xs font-semibold text-gray-700">{page.label}</div>
            <code className="text-xs text-gray-400 font-mono">{page.path}</code>
          </td>
          <td className="py-3 pr-3">
            <CategoryBadge cat={page.category} />
          </td>
          <td className="py-3 pr-3 max-w-[160px]">
            <span className="text-xs text-gray-400 truncate block">{page.reason}</span>
          </td>
          <td className="py-3 pr-3 text-center">
            <Toggle value={page.noindex} onChange={(v) => onUpdate({ ...page, noindex: v })} size={22} />
          </td>
          <td className="py-3 pr-3 text-center">
            <Toggle value={page.nofollow} onChange={(v) => onUpdate({ ...page, nofollow: v })} size={22} />
          </td>
          <td className="py-3 pr-3">
            <RobotsBadge noindex={page.noindex} nofollow={page.nofollow} />
          </td>
          <td className="py-3">
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-[#E8622A] transition-colors">
                <FiEdit2 size={14} />
              </button>
              <button onClick={() => onDelete(page.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                <FiTrash2 size={14} />
              </button>
            </div>
          </td>
        </tr>
      )}

      {editing && (
        <tr className="border-b border-orange-100 bg-orange-50">
          <td colSpan={7} className="py-3 px-2">
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Label</label>
                <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#E8622A]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Path</label>
                <input value={draft.path} onChange={(e) => setDraft({ ...draft, path: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 font-mono bg-white focus:outline-none focus:border-[#E8622A]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Category</label>
                <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#E8622A]">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Reason / Note</label>
                <input value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#E8622A]" />
              </div>
              <div className="flex gap-6 items-center pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={draft.noindex} onChange={(e) => setDraft({ ...draft, noindex: e.target.checked })}
                    className="accent-[#E8622A] w-4 h-4" />
                  <span className="text-sm text-gray-600">noindex</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={draft.nofollow} onChange={(e) => setDraft({ ...draft, nofollow: e.target.checked })}
                    className="accent-[#E8622A] w-4 h-4" />
                  <span className="text-sm text-gray-600">nofollow</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={save}
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-white bg-[#E8622A] rounded-lg hover:bg-[#d0561f]">
                <FiCheckCircle size={13} /> Save
              </button>
              <button onClick={cancel}
                className="px-4 py-1.5 text-sm text-gray-500 border border-gray-200 bg-white rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function AddPageForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: "", path: "", category: "custom", reason: "", noindex: true, nofollow: false });

  const submit = () => {
    if (!form.path) return;
    onAdd({ ...form, id: Date.now() });
    setForm({ label: "", path: "", category: "custom", reason: "", noindex: true, nofollow: false });
    setOpen(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl hover:text-[#E8622A] hover:border-[#E8622A] transition-colors mt-4">
        <FiPlus size={14} /> Add Page / Pattern
      </button>
    );
  }

  return (
    <div className="mt-4 border border-orange-100 bg-orange-50 rounded-xl p-4">
      <div className="text-sm font-semibold text-gray-700 mb-3">Add No-Index Entry</div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Label</label>
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="e.g. Cart Page"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#E8622A]" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Path / Pattern</label>
          <input value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })}
            placeholder="/page or /section/*"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 font-mono bg-white focus:outline-none focus:border-[#E8622A]" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#E8622A]">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">Reason</label>
          <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="Why should this be excluded?"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#E8622A]" />
        </div>
        <div className="flex gap-5 items-center pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.noindex} onChange={(e) => setForm({ ...form, noindex: e.target.checked })}
              className="accent-[#E8622A] w-4 h-4" />
            <span className="text-sm text-gray-600">noindex</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.nofollow} onChange={(e) => setForm({ ...form, nofollow: e.target.checked })}
              className="accent-[#E8622A] w-4 h-4" />
            <span className="text-sm text-gray-600">nofollow</span>
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={submit}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-[#E8622A] rounded-lg hover:bg-[#d0561f]">
          <FiPlus size={13} /> Add Entry
        </button>
        <button onClick={() => setOpen(false)}
          className="px-4 py-2 text-sm text-gray-500 border border-gray-200 bg-white rounded-lg hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function NoIndexPages() {
  const [pages, setPages]             = useState([]);
  const [saved, setSaved]             = useState(false);
  const [search, setSearch]           = useState("");
  const [catFilter, setCatFilter]     = useState("All");

  useEffect(() => {
    settingsApi.public().then((s) => {
      if (s && Array.isArray(s.seo_noindex_pages)) {
        setPages(s.seo_noindex_pages);
      }
    }).catch(() => null);
  }, []);
  const [globalNoindex, setGlobalNoindex]   = useState(false);
  const [noindexPagination, setNoindexPagination] = useState(true);
  const [noindexSearch, setNoindexSearch]   = useState(true);
  const [noindexDrafts, setNoindexDrafts]   = useState(true);

  const updatePage = (updated) => setPages((p) => p.map((r) => (r.id === updated.id ? updated : r)));
  const deletePage = (id)      => setPages((p) => p.filter((r) => r.id !== id));
  const addPage    = (page)    => setPages((p) => [...p, page]);

  const filtered = pages.filter((p) => {
    const matchSearch = p.label.toLowerCase().includes(search.toLowerCase()) ||
      p.path.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const noindexCount = pages.filter((p) => p.noindex).length;

  const handleSave = async () => {
    try {
      await settingsApi.single("seo_noindex_pages", { value: pages });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">SEO: No-Index Pages</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Prevent specific pages from being indexed by search engines.
          </p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg transition-colors ${
            saved ? "bg-green-500" : "bg-[#E8622A] hover:bg-[#d0561f]"
          }`}>
          {saved ? <FiCheckCircle size={14} /> : <FiSave size={14} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Entries",  value: pages.length,                                         icon: <FiFileText size={14} />, color: "text-gray-800"   },
          { label: "No-Indexed",     value: noindexCount,                                          icon: <FiEyeOff size={14} />,   color: "text-orange-600" },
          { label: "No-Follow",      value: pages.filter((p) => p.nofollow).length,               icon: <FiShield size={14} />,   color: "text-red-500"    },
          { label: "Fully Indexed",  value: pages.filter((p) => !p.noindex && !p.nofollow).length, icon: <FiGlobe size={14} />,   color: "text-green-600"  },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              {s.icon} {s.label}
            </div>
            <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Warning if global noindex on */}
      {globalNoindex && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-600">
          <FiAlertCircle size={16} className="shrink-0" />
          <strong>Warning:</strong>&nbsp;Global no-index is ON — your entire site is hidden from search engines!
        </div>
      )}

      {/* Global Settings */}
      <SectionCard title="Global No-Index Rules" icon={<FiShield size={15} />}>
        {[
          { label: "Global No-Index (entire site)", hint: "Add noindex to ALL pages — use with extreme caution", val: globalNoindex,      set: setGlobalNoindex,      warn: true  },
          { label: "No-Index Paginated URLs",       hint: "Hide ?page=2, ?page=3 etc. from search engines",      val: noindexPagination,  set: setNoindexPagination,  warn: false },
          { label: "No-Index Search Result Pages",  hint: "Prevent /search?q=... from being indexed",            val: noindexSearch,      set: setNoindexSearch,      warn: false },
          { label: "No-Index Draft Posts",          hint: "Always exclude unpublished/draft content",            val: noindexDrafts,      set: setNoindexDrafts,      warn: false },
        ].map((row) => (
          <div key={row.label} className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-0 ${row.warn && globalNoindex ? "bg-red-50 -mx-5 px-5 rounded" : ""}`}>
            <div>
              <div className={`text-sm font-medium ${row.warn ? "text-red-600" : "text-gray-700"}`}>{row.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{row.hint}</div>
            </div>
            <Toggle value={row.val} onChange={row.set} />
          </div>
        ))}
      </SectionCard>

      {/* Pages table */}
      <SectionCard title="Page-Level Rules" icon={<FiTag size={15} />} badge={`${noindexCount} no-indexed`}>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by label or path…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#E8622A]" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <FiFilter size={13} className="text-gray-400" />
            {["All", ...CATEGORIES].map((f) => (
              <button key={f} onClick={() => setCatFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors capitalize ${
                  catFilter === f
                    ? "bg-[#E8622A] text-white border-[#E8622A]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Page / Path", "Category", "Reason", "noindex", "nofollow", "Robots Tag", ""].map((h, i) => (
                  <th key={i} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 text-sm py-8">
                    Data not available
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 text-sm py-8">
                    No entries match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((page) => (
                  <PageRow key={page.id} page={page} onUpdate={updatePage} onDelete={deletePage} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <AddPageForm onAdd={addPage} />
      </SectionCard>

      {/* Info */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600">
        <FiInfo size={14} className="mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">How it works:</span> Each entry injects{" "}
          <code className="bg-blue-100 px-1 rounded">&lt;meta name="robots" content="noindex, nofollow"&gt;</code>{" "}
          into the matching page's &lt;head&gt;. Use <code className="bg-blue-100 px-1 rounded">*</code> as wildcard (e.g. <code className="bg-blue-100 px-1 rounded">/tag/*</code>).
          This does NOT replace your robots.txt — use both together for full control.
        </div>
      </div>
    </div>
  );
}