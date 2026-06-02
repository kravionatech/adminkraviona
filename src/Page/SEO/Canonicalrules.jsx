import { useState } from "react";
import {
  FiLink, FiSave, FiPlus, FiTrash2, FiCheckCircle, FiAlertCircle,
  FiInfo, FiChevronDown, FiChevronUp, FiToggleLeft, FiToggleRight,
  FiEdit2, FiCopy, FiArrowRight, FiSearch, FiFilter,
} from "react-icons/fi";

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_RULES = [
  { id: 1, type: "redirect",  from: "/home",              to: "https://kraviona.com/",             label: "Home alias",          active: true,  scope: "exact"   },
  { id: 2, type: "canonical", from: "/blog?page=1",       to: "https://kraviona.com/blog",         label: "Blog pagination",     active: true,  scope: "pattern" },
  { id: 3, type: "canonical", from: "/services/?ref=*",   to: "https://kraviona.com/services",     label: "Services UTM strip",  active: true,  scope: "pattern" },
  { id: 4, type: "canonical", from: "/case-studies/*",    to: "https://kraviona.com/case-studies", label: "Case study wildcard", active: false, scope: "pattern" },
  { id: 5, type: "self",      from: "/portfolio",         to: "",                                  label: "Portfolio self-ref",  active: true,  scope: "exact"   },
  { id: 6, type: "redirect",  from: "/old-pricing",       to: "https://kraviona.com/pricing",      label: "Pricing old URL",     active: true,  scope: "exact"   },
];

const TYPE_CONFIG = {
  canonical: { label: "Canonical",    bg: "bg-blue-100",   text: "text-blue-700"   },
  redirect:  { label: "301 Redirect", bg: "bg-orange-100", text: "text-orange-700" },
  self:      { label: "Self Canon",   bg: "bg-green-100",  text: "text-green-700"  },
};

const SCOPE_OPTIONS = ["exact", "pattern", "prefix"];
const TYPE_OPTIONS  = ["canonical", "redirect", "self"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`transition-colors ${value ? "text-[#E8622A]" : "text-gray-300"}`}>
      {value ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
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

function TypeBadge({ type }) {
  const c = TYPE_CONFIG[type] || TYPE_CONFIG.canonical;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function RuleRow({ rule, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(rule);
  const [copied, setCopied]   = useState(false);

  const save   = () => { onUpdate(draft); setEditing(false); };
  const cancel = () => { setDraft(rule); setEditing(false); };

  const copySnippet = () => {
    const text = rule.type === "self"
      ? `<link rel="canonical" href="${rule.from}" />`
      : rule.type === "canonical"
      ? `<link rel="canonical" href="${rule.to}" />`
      : `301 ${rule.from} => ${rule.to}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      {!editing && (
        <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
          <td className="py-3 pr-3">
            <div className="text-xs font-medium text-gray-700">{rule.label}</div>
          </td>
          <td className="py-3 pr-3">
            <TypeBadge type={rule.type} />
          </td>
          <td className="py-3 pr-3 max-w-[150px]">
            <code className="text-xs text-gray-500 font-mono truncate block" title={rule.from}>{rule.from}</code>
          </td>
          <td className="py-3 pr-2 text-gray-300">
            {rule.type !== "self" && <FiArrowRight size={14} />}
          </td>
          <td className="py-3 pr-3 max-w-[180px]">
            {rule.type !== "self"
              ? <code className="text-xs text-[#E8622A] font-mono truncate block" title={rule.to}>{rule.to}</code>
              : <span className="text-xs text-gray-300 italic">self-referencing</span>
            }
          </td>
          <td className="py-3 pr-3">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{rule.scope}</span>
          </td>
          <td className="py-3 pr-3">
            <Toggle value={rule.active} onChange={(v) => onUpdate({ ...rule, active: v })} />
          </td>
          <td className="py-3">
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={copySnippet} className="text-gray-400 hover:text-[#E8622A] transition-colors">
                {copied ? <FiCheckCircle size={14} className="text-green-500" /> : <FiCopy size={14} />}
              </button>
              <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-[#E8622A] transition-colors">
                <FiEdit2 size={14} />
              </button>
              <button onClick={() => onDelete(rule.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                <FiTrash2 size={14} />
              </button>
            </div>
          </td>
        </tr>
      )}

      {editing && (
        <tr className="border-b border-orange-100 bg-orange-50">
          <td colSpan={8} className="py-3 px-2">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Label</label>
                <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#E8622A]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Type</label>
                <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#E8622A]">
                  {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">From</label>
                <input value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 font-mono bg-white focus:outline-none focus:border-[#E8622A]" />
              </div>
              {draft.type !== "self" && (
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">To</label>
                  <input value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 font-mono bg-white focus:outline-none focus:border-[#E8622A]" />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Scope</label>
                <select value={draft.scope} onChange={(e) => setDraft({ ...draft, scope: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#E8622A]">
                  {SCOPE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
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

function AddRuleForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: "", type: "canonical", from: "", to: "", scope: "exact" });

  const submit = () => {
    if (!form.from) return;
    onAdd({ ...form, id: Date.now(), active: true });
    setForm({ label: "", type: "canonical", from: "", to: "", scope: "exact" });
    setOpen(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl hover:text-[#E8622A] hover:border-[#E8622A] transition-colors mt-4">
        <FiPlus size={14} /> Add New Rule
      </button>
    );
  }

  return (
    <div className="mt-4 border border-orange-100 bg-orange-50 rounded-xl p-4">
      <div className="text-sm font-semibold text-gray-700 mb-3">New Canonical Rule</div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Label</label>
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="e.g. Blog UTM strip"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#E8622A]" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#E8622A]">
            {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">From (source path)</label>
          <input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })}
            placeholder="/old-url or /page?param=*"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 font-mono bg-white focus:outline-none focus:border-[#E8622A]" />
        </div>
        {form.type !== "self" && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">To (canonical / redirect target)</label>
            <input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}
              placeholder="https://kraviona.com/page"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 font-mono bg-white focus:outline-none focus:border-[#E8622A]" />
          </div>
        )}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Scope</label>
          <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#E8622A]">
            {SCOPE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={submit}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-[#E8622A] rounded-lg hover:bg-[#d0561f]">
          <FiPlus size={13} /> Add Rule
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

export default function CanonicalRules() {
  const [rules, setRules]                 = useState(DEFAULT_RULES);
  const [saved, setSaved]                 = useState(false);
  const [search, setSearch]               = useState("");
  const [typeFilter, setTypeFilter]       = useState("All");
  const [autoCanonical, setAutoCanonical] = useState(true);
  const [trailingSlash, setTrailingSlash] = useState(false);
  const [preferHttps, setPreferHttps]     = useState(true);
  const [preferWww, setPreferWww]         = useState(false);

  const updateRule = (updated) => setRules((p) => p.map((r) => (r.id === updated.id ? updated : r)));
  const deleteRule = (id)      => setRules((p) => p.filter((r) => r.id !== id));
  const addRule    = (rule)    => setRules((p) => [...p, rule]);

  const filtered = rules.filter((r) => {
    const matchSearch = r.label.toLowerCase().includes(search.toLowerCase()) ||
      r.from.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || r.type === typeFilter.toLowerCase();
    return matchSearch && matchType;
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const activeCount = rules.filter((r) => r.active).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">SEO: Canonical Rules</h1>
          <p className="text-sm text-gray-400 mt-0.5">Control canonical tags and 301 redirects to prevent duplicate content.</p>
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
          { label: "Total Rules",   value: rules.length,                                        color: "text-gray-800"   },
          { label: "Active",        value: activeCount,                                          color: "text-green-600"  },
          { label: "Canonical",     value: rules.filter((r) => r.type === "canonical").length,  color: "text-blue-600"   },
          { label: "301 Redirects", value: rules.filter((r) => r.type === "redirect").length,   color: "text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl px-4 py-3">
            <div className="text-xs text-gray-400 mb-1">{s.label}</div>
            <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Global settings */}
      <SectionCard title="Global Canonical Settings" icon={<FiLink size={15} />}>
        {[
          { label: "Auto-inject Canonical Tags", hint: "Add self-referencing canonical to all pages automatically", val: autoCanonical, set: setAutoCanonical },
          { label: "Prefer HTTPS",               hint: "Force all canonicals to use https://",                      val: preferHttps,   set: setPreferHttps   },
          { label: "Prefer non-www",             hint: "Strip www. from all canonical URLs",                        val: !preferWww,    set: (v) => setPreferWww(!v) },
          { label: "Trailing Slash",             hint: "Normalize URLs to always include a trailing slash",         val: trailingSlash, set: setTrailingSlash },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <div className="text-sm font-medium text-gray-700">{row.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{row.hint}</div>
            </div>
            <Toggle value={row.val} onChange={row.set} />
          </div>
        ))}
      </SectionCard>

      {/* Rules table */}
      <SectionCard title="Custom Rules" icon={<FiEdit2 size={15} />} badge={`${activeCount} active`}>

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
            {["All", "Canonical", "Redirect", "Self"].map((f) => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  typeFilter === f
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
                {["Label", "Type", "From", "", "To (Canonical)", "Scope", "Active", ""].map((h, i) => (
                  <th key={i} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 text-sm py-8">
                    No rules match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((rule) => (
                  <RuleRow key={rule.id} rule={rule} onUpdate={updateRule} onDelete={deleteRule} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <AddRuleForm onAdd={addRule} />
      </SectionCard>

      {/* Info tip */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600">
        <FiInfo size={14} className="mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">How rules apply:</span> Rules matched top-to-bottom.{" "}
          <strong>Canonical</strong> injects a{" "}
          <code className="bg-blue-100 px-1 rounded">&lt;link rel="canonical"&gt;</code> tag.{" "}
          <strong>301 Redirect</strong> sends HTTP redirects at server level.{" "}
          <strong>Self Canon</strong> injects a self-referencing canonical. Use <code className="bg-blue-100 px-1 rounded">*</code> as wildcard in patterns.
        </div>
      </div>
    </div>
  );
}