// Case Studies CRUD — /dashboard/case-studies
import { useState, useEffect } from "react";
import { FiBriefcase, FiPlus, FiSearch, FiEdit3, FiTrash2, FiX, FiFileText } from "react-icons/fi";
import { caseStudiesApi } from "../../services/api";

const STATUS = {
  draft:     { label: "Draft",     bg: "#F1EFE8", color: "#444441" },
  published: { label: "Published", bg: "#E1F5EE", color: "#085041" },
  archived:  { label: "Archived",  bg: "#FAEEDA", color: "#633806" },
};

const SEED = [
  { _id: "cs1", title: "How FinScale scaled to 1M users in 90 days",     slug: "finscale-scale-1m",    client: "FinScale",   industry: "Fintech",       status: "draft",     readingTime: 12, publishedAt: "", before: "5k MAU", after: "1M MAU", improvement: "200×",   summary: "Treasury dashboard rebuild that took us from on-prem MySQL to multi-region MongoDB." },
  { _id: "cs2", title: "BoltCart: 18s → 1.4s page load on Black Friday", slug: "boltcart-perf",        client: "BoltCart",   industry: "E-commerce",    status: "draft",     readingTime: 8,  publishedAt: "", before: "18.2s",  after: "1.4s",   improvement: "92%",    summary: "Edge caching, image pipeline, code splitting — the trifecta that saved Black Friday." },
  { _id: "cs3", title: "Northwave's zero-downtime PHP → Node migration", slug: "northwave-migration", client: "Northwave",  industry: "Hospitality",   status: "draft",     readingTime: 15, publishedAt: "", before: "120 RPS", after: "8.5k RPS", improvement: "71×",   summary: "Dual-write strategy that took a hospitality booking platform off legacy PHP without a single second of downtime." },
];

const EMPTY = {
  title: "", slug: "", client: "", industry: "", status: "draft",
  readingTime: 5, publishedAt: "", before: "", after: "", improvement: "",
  summary: "", heroImage: "", challenge: "", solution: "", outcome: "",
  technologies: [""], metrics: [{ label: "", before: "", after: "", improvement: "" }],
};

export default function CaseStudiesCRUD() {
  const [items, setItems] = useState(SEED);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    caseStudiesApi.list({ limit: 200 }).then((d) => {
      const list = Array.isArray(d) ? d : (d?.data || []);
      if (list.length) setItems(list);
    }).catch(() => null);
  }, []);
  const [form, setForm] = useState(EMPTY);

  const filtered = items.filter((i) => {
    const ms = !search || i.title.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "all" || i.status === filter;
    return ms && mf;
  });

  const openCreate = () => { setForm(EMPTY); setEditing("new"); };
  const openEdit = (it) => { setForm({ ...it, technologies: it.technologies || [""], metrics: it.metrics || [{ label: "", before: "", after: "", improvement: "" }] }); setEditing(it._id); };
  const close = () => { setEditing(null); setForm(EMPTY); };

  const save = () => {
    if (editing === "new") setItems([...items, { ...form, _id: `cs${Date.now()}` }]);
    else setItems(items.map((i) => i._id === editing ? { ...form } : i));
    close();
  };
  const del = (id) => setItems(items.filter((i) => i._id !== id));

  return (
    <div className="min-h-screen bg-[#F7F8FA] -m-6 sm:-m-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Admin / Case Studies</div>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <FiBriefcase size={20} className="text-[#E8663D]" /> Case Studies
          </h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg" style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}>
          <FiPlus size={14} /> New Case Study
        </button>
      </div>

      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search case studies…"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#E8663D]/20" />
        </div>
        <div className="flex gap-1">
          <button onClick={() => setFilter("all")} className={`text-xs px-3 py-2 rounded-lg ${filter === "all" ? "bg-[#235056] text-white" : "bg-gray-100 text-gray-700"}`}>All ({items.length})</button>
          {Object.entries(STATUS).map(([k, s]) => (
            <button key={k} onClick={() => setFilter(k)} className={`text-xs px-3 py-2 rounded-lg ${filter === k ? "text-white" : "bg-gray-100 text-gray-700"}`}
              style={filter === k ? { background: s.color } : {}}>{s.label} ({items.filter(i => i.status === k).length})</button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 space-y-3">
        {filtered.map((c) => (
          <div key={c._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shrink-0">
              <FiFileText size={28} className="text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold" style={{ background: STATUS[c.status].bg, color: STATUS[c.status].color }}>{STATUS[c.status].label}</span>
                <span className="text-xs text-gray-500">{c.client} · {c.industry}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">{c.title}</h3>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">{c.summary}</p>
              <div className="flex gap-4 text-[11px] text-gray-500">
                <span><strong className="text-gray-800">Before:</strong> {c.before}</span>
                <span><strong className="text-gray-800">After:</strong> {c.after}</span>
                <span><strong className="text-emerald-600">↑ {c.improvement}</strong></span>
                <span>{c.readingTime} min read</span>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(c)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#E8663D]"><FiEdit3 size={14} /></button>
              <button onClick={() => del(c._id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"><FiTrash2 size={14} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <FiBriefcase size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No case studies — create the first one above.</p>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={close}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-800">{editing === "new" ? "New Case Study" : "Edit Case Study"}</h2>
              <button onClick={close} className="p-2 hover:bg-gray-100 rounded-lg"><FiX /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
                <SInput label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} mono />
                <SInput label="Client" value={form.client} onChange={(v) => setForm({ ...form, client: v })} />
                <SInput label="Industry" value={form.industry} onChange={(v) => setForm({ ...form, industry: v })} />
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                    <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                  </select>
                </div>
                <SInput label="Reading Time (min)" value={form.readingTime} onChange={(v) => setForm({ ...form, readingTime: v })} type="number" />
              </div>

              <STextarea label="Summary (1-2 sentences)" value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} rows={2} />
              <SInput label="Hero Image URL" value={form.heroImage} onChange={(v) => setForm({ ...form, heroImage: v })} mono />

              <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4">
                <SInput label="Before" value={form.before} onChange={(v) => setForm({ ...form, before: v })} />
                <SInput label="After"  value={form.after}  onChange={(v) => setForm({ ...form, after: v })} />
                <SInput label="Improvement" value={form.improvement} onChange={(v) => setForm({ ...form, improvement: v })} />
              </div>

              <STextarea label="The Challenge" value={form.challenge} onChange={(v) => setForm({ ...form, challenge: v })} rows={4} />
              <STextarea label="Our Solution" value={form.solution} onChange={(v) => setForm({ ...form, solution: v })} rows={4} />
              <STextarea label="The Outcome" value={form.outcome} onChange={(v) => setForm({ ...form, outcome: v })} rows={4} />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2 z-10">
              <button onClick={close} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl">Cancel</button>
              <button onClick={save} className="px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow" style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}>Save Case Study</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SInput({ label, value, onChange, type = "text", mono }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8663D] focus:ring-2 focus:ring-[#E8663D]/10 ${mono ? "font-mono text-xs" : ""}`} />
    </div>
  );
}
function STextarea({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-y focus:outline-none focus:border-[#E8663D] focus:ring-2 focus:ring-[#E8663D]/10" />
    </div>
  );
}
