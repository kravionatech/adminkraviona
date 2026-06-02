// Portfolio / Gallery CRUD — /dashboard/portfolio
import { useState, useEffect } from "react";
import { portfolioApi } from "../../services/api";
import {
  FiGrid, FiPlus, FiSearch, FiEdit3, FiTrash2, FiStar,
  FiX, FiExternalLink, FiImage, FiCheck, FiUpload,
} from "react-icons/fi";

const PROJECT_TYPES = [
  { value: "web-app",     label: "Web App",     color: "#3B82F6" },
  { value: "mobile-app",  label: "Mobile App",  color: "#8B5CF6" },
  { value: "saas",        label: "SaaS",        color: "#10B981" },
  { value: "ecommerce",   label: "E-commerce",  color: "#F59E0B" },
  { value: "marketing",   label: "Marketing",   color: "#EC4899" },
];

const SEED = [
  { _id: "p1", title: "FinScale — Treasury Dashboard",     slug: "finscale-treasury",   client: "FinScale",    projectType: "saas",      year: 2025, thumbnail: "", isActive: true, featured: true, technologies: ["React", "Node.js", "MongoDB", "Stripe"], description: "Real-time treasury management dashboard for B2B fintech.",        liveUrl: "https://finscale.app", caseStudyUrl: "" },
  { _id: "p2", title: "BoltCart — Headless Storefront",    slug: "boltcart-headless",   client: "BoltCart",    projectType: "ecommerce", year: 2025, thumbnail: "", isActive: true, featured: true, technologies: ["Next.js", "Shopify", "GraphQL"],         description: "Sub-1s page loads for high-traffic retail brand.",                  liveUrl: "https://boltcart.com", caseStudyUrl: "" },
  { _id: "p3", title: "Northwave — Booking Platform",      slug: "northwave-booking",   client: "Northwave",   projectType: "web-app",   year: 2024, thumbnail: "", isActive: true, featured: false, technologies: ["MERN", "Twilio", "Stripe"],              description: "Multi-tenant booking platform for hospitality groups.",            liveUrl: "https://northwave.app", caseStudyUrl: "" },
  { _id: "p4", title: "Lumen — Marketing Site",            slug: "lumen-marketing",     client: "Lumen",       projectType: "marketing", year: 2024, thumbnail: "", isActive: true, featured: false, technologies: ["Next.js", "Sanity CMS", "Tailwind"],     description: "Lighthouse 100 marketing site for B2B analytics startup.",          liveUrl: "https://lumen.ai", caseStudyUrl: "" },
  { _id: "p5", title: "QuickServ — Workforce App",         slug: "quickserv-mobile",    client: "QuickServ",   projectType: "mobile-app", year: 2024, thumbnail: "", isActive: true, featured: false, technologies: ["React Native", "Node.js", "Redis"],     description: "Field-worker scheduling app for facility-management firms.",        liveUrl: "", caseStudyUrl: "" },
  { _id: "p6", title: "GreenLeaf — Subscription Engine",   slug: "greenleaf-saas",      client: "GreenLeaf",   projectType: "saas",      year: 2025, thumbnail: "", isActive: true, featured: true, technologies: ["MERN", "Stripe Billing", "RabbitMQ"],    description: "Subscription billing engine for D2C plant-care brand.",            liveUrl: "https://greenleaf.app", caseStudyUrl: "" },
];

const EMPTY = {
  title: "", slug: "", client: "", projectType: "web-app", year: 2026,
  thumbnail: "", isActive: true, featured: false, technologies: [""],
  description: "", liveUrl: "", caseStudyUrl: "",
};

export default function Portfolio() {
  const [items, setItems] = useState(SEED);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    portfolioApi.list({ limit: 200 }).then((d) => {
      const list = Array.isArray(d) ? d : (d?.data || []);
      if (list.length) setItems(list);
    }).catch(() => null);
  }, []);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const filtered = items.filter((i) => {
    const matchesSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.client.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || i.projectType === filter;
    return matchesSearch && matchesFilter;
  });

  const openCreate = () => { setForm(EMPTY); setEditing("new"); };
  const openEdit   = (it)  => { setForm({ ...it }); setEditing(it._id); };
  const close      = ()    => { setEditing(null); setForm(EMPTY); };

  const save = () => {
    if (editing === "new") {
      setItems([...items, { ...form, _id: `p${Date.now()}` }]);
    } else {
      setItems(items.map((i) => i._id === editing ? { ...form } : i));
    }
    close();
  };
  const del = (id) => setItems(items.filter((i) => i._id !== id));
  const toggleFeatured = (id) => setItems(items.map((i) => i._id === id ? { ...i, featured: !i.featured } : i));

  const typeMeta = (t) => PROJECT_TYPES.find(p => p.value === t) || { color: "#888", label: t };

  return (
    <div className="min-h-screen bg-[#F7F8FA] -m-6 sm:-m-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Admin / Portfolio</div>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <FiGrid size={20} className="text-[#E8663D]" /> Portfolio / Gallery
          </h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg" style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}>
          <FiPlus size={14} /> New Project
        </button>
      </div>

      {/* Filters bar */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects…"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#E8663D]/20" />
        </div>
        <div className="flex gap-1">
          <button onClick={() => setFilter("all")} className={`text-xs px-3 py-2 rounded-lg ${filter === "all" ? "bg-[#235056] text-white" : "bg-gray-100 text-gray-700"}`}>All ({items.length})</button>
          {PROJECT_TYPES.map((t) => (
            <button key={t.value} onClick={() => setFilter(t.value)} className={`text-xs px-3 py-2 rounded-lg ${filter === t.value ? "text-white" : "bg-gray-100 text-gray-700"}`}
              style={filter === t.value ? { background: t.color } : {}}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
              <FiImage size={32} className="text-gray-300" />
              {p.featured && <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><FiStar size={10} /> Featured</span>}
              {!p.isActive && <span className="absolute top-2 left-2 bg-gray-700 text-white text-[10px] px-2 py-0.5 rounded-full">Inactive</span>}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-bold text-gray-800 leading-tight flex-1">{p.title}</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ background: typeMeta(p.projectType).color + "20", color: typeMeta(p.projectType).color }}>
                  {typeMeta(p.projectType).label}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{p.client} · {p.year}</p>
              <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="flex gap-1">
                  {p.technologies.slice(0, 3).map((t, i) => <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600">{t}</span>)}
                  {p.technologies.length > 3 && <span className="text-[10px] text-gray-400">+{p.technologies.length - 3}</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleFeatured(p._id)} className={`p-1.5 rounded-lg ${p.featured ? "text-yellow-500 bg-yellow-50" : "text-gray-400 hover:bg-gray-100"}`}><FiStar size={13} /></button>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><FiExternalLink size={13} /></a>}
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#E8663D]"><FiEdit3 size={13} /></button>
                  <button onClick={() => del(p._id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"><FiTrash2 size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <FiGrid size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No projects match your filters.</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={close}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">{editing === "new" ? "New Project" : "Edit Project"}</h2>
              <button onClick={close} className="p-2 hover:bg-gray-100 rounded-lg"><FiX /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Title" value={form.title}   onChange={(v) => setForm({ ...form, title: v })} />
                <Input label="Slug"  value={form.slug}    onChange={(v) => setForm({ ...form, slug: v })} mono />
                <Input label="Client" value={form.client} onChange={(v) => setForm({ ...form, client: v })} />
                <Input label="Year"  value={form.year}   onChange={(v) => setForm({ ...form, year: v })} type="number" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Project Type</label>
                  <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                    {PROJECT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <Input label="Thumbnail URL" value={form.thumbnail} onChange={(v) => setForm({ ...form, thumbnail: v })} mono />
              </div>
              <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
              <Input label="Live URL"        value={form.liveUrl} onChange={(v) => setForm({ ...form, liveUrl: v })} mono />
              <Input label="Case Study URL"  value={form.caseStudyUrl} onChange={(v) => setForm({ ...form, caseStudyUrl: v })} mono />

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Technologies</label>
                <div className="flex flex-wrap gap-2">
                  {form.technologies.map((t, i) => (
                    <div key={i} className="flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1">
                      <input value={t} onChange={(e) => { const tt = [...form.technologies]; tt[i] = e.target.value; setForm({ ...form, technologies: tt }); }}
                        className="bg-transparent border-0 outline-none w-28 text-sm" />
                      <button onClick={() => setForm({ ...form, technologies: form.technologies.filter((_, idx) => idx !== i) })} className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-xs hover:bg-red-100">×</button>
                    </div>
                  ))}
                  <button onClick={() => setForm({ ...form, technologies: [...form.technologies, ""] })} className="flex items-center gap-1 bg-[#E8663D]/10 text-[#E8663D] text-sm font-semibold px-3 py-1 rounded-full"><FiPlus size={12} /> Tech</button>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <CheckLabel label="Active" value={form.isActive}  onChange={(v) => setForm({ ...form, isActive: v })} />
                <CheckLabel label="Featured" value={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2">
              <button onClick={close} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl">Cancel</button>
              <button onClick={save} className="px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow" style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}>Save Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", mono }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8663D] focus:ring-2 focus:ring-[#E8663D]/10 ${mono ? "font-mono text-xs" : ""}`} />
    </div>
  );
}
function Textarea({ label, value, onChange, rows }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-y focus:outline-none focus:border-[#E8663D] focus:ring-2 focus:ring-[#E8663D]/10" />
    </div>
  );
}
function CheckLabel({ label, value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${value ? "bg-[#E8663D]/10 text-[#E8663D]" : "bg-gray-100 text-gray-500"}`}>
      {value ? <FiCheck size={14} /> : <span className="w-3.5 h-3.5 rounded border border-gray-300" />}
      {label}
    </button>
  );
}
