// Tech Stack management page — /dashboard/tech-stack
// (Separate from the home-page tech stack section editor.)
// Manages every tool used in the company, taggable to services.
import { useState, useEffect } from "react";
import { siteConfigApi } from "../../services/api";
import { FiCpu, FiPlus, FiEdit3, FiTrash2, FiSearch, FiX, FiTag } from "react-icons/fi";

const CATEGORIES = ["Frontend", "Backend", "Database", "Cloud", "DevOps", "AI/ML", "Mobile", "Testing"];

const SEED = [
  { _id: "ts1",  name: "React.js",      category: "Frontend", description: "Component-based UI library",     logo: "", website: "https://react.dev",              proficiency: 95, yearsUsed: 7, isPrimary: true,  tags: ["mern-stack", "react"] },
  { _id: "ts2",  name: "Next.js",       category: "Frontend", description: "React framework with SSR",        logo: "", website: "https://nextjs.org",             proficiency: 95, yearsUsed: 5, isPrimary: true,  tags: ["mern-stack", "react"] },
  { _id: "ts3",  name: "TypeScript",    category: "Frontend", description: "Strongly-typed JavaScript",       logo: "", website: "https://typescriptlang.org",     proficiency: 90, yearsUsed: 6, isPrimary: true,  tags: ["frontend", "backend"] },
  { _id: "ts4",  name: "Tailwind CSS",  category: "Frontend", description: "Utility-first CSS framework",     logo: "", website: "https://tailwindcss.com",        proficiency: 95, yearsUsed: 4, isPrimary: true,  tags: ["ui"] },
  { _id: "ts5",  name: "Node.js",       category: "Backend",  description: "JavaScript server runtime",       logo: "", website: "https://nodejs.org",             proficiency: 95, yearsUsed: 8, isPrimary: true,  tags: ["mern-stack", "node"] },
  { _id: "ts6",  name: "Express.js",    category: "Backend",  description: "Minimal Node.js web framework",   logo: "", website: "https://expressjs.com",          proficiency: 95, yearsUsed: 7, isPrimary: true,  tags: ["mern-stack"] },
  { _id: "ts7",  name: "GraphQL",       category: "Backend",  description: "Query language for APIs",         logo: "", website: "https://graphql.org",            proficiency: 80, yearsUsed: 4, isPrimary: false, tags: ["api"] },
  { _id: "ts8",  name: "MongoDB",       category: "Database", description: "Document database",               logo: "", website: "https://mongodb.com",            proficiency: 95, yearsUsed: 7, isPrimary: true,  tags: ["mern-stack"] },
  { _id: "ts9",  name: "PostgreSQL",    category: "Database", description: "Relational database",             logo: "", website: "https://postgresql.org",         proficiency: 85, yearsUsed: 5, isPrimary: false, tags: ["db"] },
  { _id: "ts10", name: "Redis",         category: "Database", description: "In-memory data store",            logo: "", website: "https://redis.io",               proficiency: 85, yearsUsed: 5, isPrimary: true,  tags: ["caching"] },
  { _id: "ts11", name: "AWS",           category: "Cloud",    description: "Amazon Web Services",             logo: "", website: "https://aws.amazon.com",         proficiency: 80, yearsUsed: 6, isPrimary: true,  tags: ["infra"] },
  { _id: "ts12", name: "Vercel",        category: "Cloud",    description: "Frontend deployment platform",    logo: "", website: "https://vercel.com",             proficiency: 95, yearsUsed: 4, isPrimary: true,  tags: ["frontend", "infra"] },
  { _id: "ts13", name: "Docker",        category: "DevOps",   description: "Container runtime",               logo: "", website: "https://docker.com",             proficiency: 80, yearsUsed: 6, isPrimary: false, tags: ["infra"] },
  { _id: "ts14", name: "GitHub Actions",category: "DevOps",   description: "CI/CD pipelines",                 logo: "", website: "https://github.com/features/actions", proficiency: 90, yearsUsed: 4, isPrimary: true,  tags: ["ci/cd"] },
  { _id: "ts15", name: "OpenAI API",    category: "AI/ML",    description: "GPT models via API",              logo: "", website: "https://openai.com",             proficiency: 85, yearsUsed: 2, isPrimary: true,  tags: ["ai"] },
  { _id: "ts16", name: "LangChain",     category: "AI/ML",    description: "LLM orchestration framework",     logo: "", website: "https://langchain.com",          proficiency: 75, yearsUsed: 2, isPrimary: false, tags: ["ai"] },
  { _id: "ts17", name: "React Native",  category: "Mobile",   description: "Cross-platform mobile apps",       logo: "", website: "https://reactnative.dev",        proficiency: 80, yearsUsed: 3, isPrimary: false, tags: ["mobile"] },
  { _id: "ts18", name: "Vitest",        category: "Testing",  description: "Unit testing framework",          logo: "", website: "https://vitest.dev",             proficiency: 85, yearsUsed: 2, isPrimary: false, tags: ["testing"] },
];

const EMPTY = { name: "", category: "Frontend", description: "", logo: "", website: "", proficiency: 80, yearsUsed: 1, isPrimary: false, tags: [] };

export default function TechStack() {
  const [items, setItems] = useState(SEED);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    siteConfigApi.get().then((cfg) => {
      if (Array.isArray(cfg?.techStack) && cfg.techStack.length) setItems(cfg.techStack);
    }).catch(() => null);
  }, []);
  const [form, setForm] = useState(EMPTY);

  const filtered = items.filter((i) => {
    const matchesSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || i.category === filter;
    return matchesSearch && matchesFilter;
  });

  const openCreate = () => { setForm(EMPTY); setEditing("new"); };
  const openEdit = (it) => { setForm({ ...it }); setEditing(it._id); };
  const close = () => { setEditing(null); };
  const save = () => {
    if (editing === "new") setItems([...items, { ...form, _id: `ts${Date.now()}` }]);
    else setItems(items.map((i) => i._id === editing ? { ...form } : i));
    close();
  };
  const del = (id) => setItems(items.filter((i) => i._id !== id));

  return (
    <div className="min-h-screen bg-[#F7F8FA] -m-6 sm:-m-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Admin / Tech Stack</div>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <FiCpu size={20} className="text-[#E8663D]" /> Tech Stack
          </h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg" style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}>
          <FiPlus size={14} /> Add Tool
        </button>
      </div>

      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools…"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#E8663D]/20" />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setFilter("all")} className={`text-xs px-3 py-2 rounded-lg ${filter === "all" ? "bg-[#235056] text-white" : "bg-gray-100 text-gray-700"}`}>All ({items.length})</button>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`text-xs px-3 py-2 rounded-lg ${filter === c ? "bg-[#235056] text-white" : "bg-gray-100 text-gray-700"}`}>
              {c} ({items.filter(i => i.category === c).length})
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((t) => (
          <div key={t._id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-bold text-gray-500">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">{t.name}</div>
                  <div className="text-[11px] text-gray-400">{t.category}</div>
                </div>
              </div>
              {t.isPrimary && <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#E8663D]/10 text-[#E8663D] font-bold">Primary</span>}
            </div>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{t.description}</p>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Proficiency</span>
                <span className="font-bold text-gray-700">{t.proficiency}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#E8663D] to-[#d45a30]" style={{ width: `${t.proficiency}%` }} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t.yearsUsed} {t.yearsUsed === 1 ? "year" : "years"} of use</span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-1 text-gray-400 hover:text-[#E8663D]"><FiEdit3 size={11} /></button>
                  <button onClick={() => del(t._id)} className="p-1 text-gray-400 hover:text-red-500"><FiTrash2 size={11} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={close}>
          <div className="bg-white rounded-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-800">{editing === "new" ? "Add Tool" : "Edit Tool"}</h2>
              <button onClick={close} className="p-2 hover:bg-gray-100 rounded-lg"><FiX /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <TInput label="Logo URL" value={form.logo} onChange={(v) => setForm({ ...form, logo: v })} mono />
                <TInput label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} mono />
                <TInput label="Proficiency %" type="number" value={form.proficiency} onChange={(v) => setForm({ ...form, proficiency: +v })} />
                <TInput label="Years Used" type="number" value={form.yearsUsed} onChange={(v) => setForm({ ...form, yearsUsed: +v })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-y" />
              </div>
              <button onClick={() => setForm({ ...form, isPrimary: !form.isPrimary })}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${form.isPrimary ? "bg-[#E8663D]/10 text-[#E8663D]" : "bg-gray-100 text-gray-500"}`}>
                <FiTag size={12} className="inline mr-1" /> {form.isPrimary ? "Primary Tool" : "Mark as Primary"}
              </button>
            </div>
            <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-2 rounded-b-2xl">
              <button onClick={close} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl">Cancel</button>
              <button onClick={save} className="px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow" style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TInput({ label, value, onChange, type = "text", mono }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm ${mono ? "font-mono text-xs" : ""}`} />
    </div>
  );
}
