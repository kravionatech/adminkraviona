import { useState } from "react";
import {
  FiMap, FiSave, FiRefreshCw, FiExternalLink, FiPlus, FiTrash2,
  FiToggleLeft, FiToggleRight, FiChevronDown, FiChevronUp,
  FiFileText, FiGlobe, FiClock, FiAlertCircle, FiCheckCircle,
  FiDownload, FiEye,
} from "react-icons/fi";

// ─── Data ────────────────────────────────────────────────────────────────────

const DEFAULT_ROUTES = [
  { id: 1, path: "/",               label: "Home",          priority: "1.0", changefreq: "daily",   included: true  },
  { id: 2, path: "/blog",           label: "Blog",          priority: "0.9", changefreq: "daily",   included: true  },
  { id: 3, path: "/services",       label: "Services",      priority: "0.8", changefreq: "weekly",  included: true  },
  { id: 4, path: "/portfolio",      label: "Portfolio",     priority: "0.8", changefreq: "weekly",  included: true  },
  { id: 5, path: "/case-studies",   label: "Case Studies",  priority: "0.7", changefreq: "weekly",  included: true  },
  { id: 6, path: "/about",          label: "About",         priority: "0.6", changefreq: "monthly", included: true  },
  { id: 7, path: "/contact",        label: "Contact",       priority: "0.6", changefreq: "monthly", included: true  },
  { id: 8, path: "/pricing",        label: "Pricing",       priority: "0.7", changefreq: "weekly",  included: true  },
  { id: 9, path: "/admin",          label: "Admin Panel",   priority: "0.1", changefreq: "never",   included: false },
  { id: 10, path: "/login",         label: "Login",         priority: "0.1", changefreq: "never",   included: false },
];

const FREQ_OPTIONS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
const PRIORITY_OPTIONS = ["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`text-xl transition-colors ${value ? "text-[#E8622A]" : "text-gray-300"}`}
    >
      {value ? <FiToggleRight size={26} /> : <FiToggleLeft size={26} />}
    </button>
  );
}

function SectionCard({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span className="text-[#E8622A]">{icon}</span>
          {title}
        </div>
        {open ? <FiChevronUp size={15} className="text-gray-400" /> : <FiChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-5 py-5">{children}</div>}
    </div>
  );
}

function FieldRow({ label, hint, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-gray-50 last:border-0">
      <div className="min-w-[200px]">
        <div className="text-sm text-gray-700 font-medium">{label}</div>
        {hint && <div className="text-xs text-gray-400 mt-0.5">{hint}</div>}
      </div>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
  );
}

function StatusBadge({ included }) {
  return included ? (
    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
      <FiCheckCircle size={11} /> Included
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
      <FiAlertCircle size={11} /> Excluded
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SitemapConfig() {
  const [routes, setRoutes] = useState(DEFAULT_ROUTES);
  const [saved, setSaved] = useState(false);

  // General settings state
  const [sitemapEnabled, setSitemapEnabled] = useState(true);
  const [autoRegen, setAutoRegen]           = useState(true);
  const [includeImages, setIncludeImages]   = useState(true);
  const [includePosts, setIncludePosts]     = useState(true);
  const [sitemapUrl, setSitemapUrl]         = useState("https://kraviona.com/sitemap.xml");
  const [lastBuilt]                         = useState("Jun 2, 2026 · 07:42 AM");

  const [newPath, setNewPath]   = useState("");
  const [newLabel, setNewLabel] = useState("");

  const updateRoute = (id, field, value) => {
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const deleteRoute = (id) => setRoutes((prev) => prev.filter((r) => r.id !== id));

  const addRoute = () => {
    if (!newPath.trim()) return;
    setRoutes((prev) => [
      ...prev,
      {
        id: Date.now(),
        path: newPath,
        label: newLabel || newPath,
        priority: "0.5",
        changefreq: "weekly",
        included: true,
      },
    ]);
    setNewPath("");
    setNewLabel("");
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const includedCount = routes.filter((r) => r.included).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">

      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">SEO: Sitemap Config</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Configure your sitemap.xml — control routes, priorities, and regeneration.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <FiEye size={14} /> Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <FiDownload size={14} /> Export XML
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg transition-colors ${
              saved ? "bg-green-500" : "bg-[#E8622A] hover:bg-[#d0561f]"
            }`}
          >
            {saved ? <FiCheckCircle size={14} /> : <FiSave size={14} />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm">
          <FiGlobe size={14} className="text-[#E8622A]" />
          <span className="text-gray-500">Sitemap URL:</span>
          <a href={sitemapUrl} target="_blank" rel="noreferrer"
            className="text-[#E8622A] font-medium flex items-center gap-1 hover:underline">
            {sitemapUrl} <FiExternalLink size={11} />
          </a>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500">
          <FiClock size={14} className="text-gray-400" />
          Last generated: <span className="text-gray-700 font-medium ml-1">{lastBuilt}</span>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500">
          <FiMap size={14} className="text-gray-400" />
          <span className="text-gray-700 font-medium">{includedCount}</span> / {routes.length} routes included
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 hover:text-[#E8622A] hover:border-[#E8622A] transition-colors ml-auto">
          <FiRefreshCw size={14} /> Regenerate Now
        </button>
      </div>

      {/* General Settings */}
      <SectionCard title="General Sitemap Settings" icon={<FiGlobe size={15} />}>
        <FieldRow label="Enable Sitemap" hint="Serve sitemap.xml to crawlers">
          <Toggle value={sitemapEnabled} onChange={setSitemapEnabled} />
        </FieldRow>
        <FieldRow label="Auto Regenerate" hint="Rebuild on content publish/update">
          <Toggle value={autoRegen} onChange={setAutoRegen} />
        </FieldRow>
        <FieldRow label="Include Blog Posts" hint="All published posts added automatically">
          <Toggle value={includePosts} onChange={setIncludePosts} />
        </FieldRow>
        <FieldRow label="Include Images" hint="Add image tags to post entries">
          <Toggle value={includeImages} onChange={setIncludeImages} />
        </FieldRow>
        <FieldRow label="Sitemap URL" hint="Public URL of your sitemap">
          <input
            type="text"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            className="w-full max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#E8622A]"
          />
        </FieldRow>
      </SectionCard>

      {/* Route Table */}
      <SectionCard title="Route Configuration" icon={<FiFileText size={15} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Route / Label</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Priority</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Change Freq</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Status</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Include</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-700">{r.label}</div>
                    <div className="text-xs text-gray-400 font-mono">{r.path}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={r.priority}
                      onChange={(e) => updateRoute(r.id, "priority", e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:border-[#E8622A]"
                    >
                      {PRIORITY_OPTIONS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={r.changefreq}
                      onChange={(e) => updateRoute(r.id, "changefreq", e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:border-[#E8622A]"
                    >
                      {FREQ_OPTIONS.map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <StatusBadge included={r.included} />
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <Toggle value={r.included} onChange={(v) => updateRoute(r.id, "included", v)} />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteRoute(r.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add new route */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Path</label>
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="/new-page"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#E8622A]"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Label (optional)</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Page label"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#E8622A]"
            />
          </div>
          <button
            onClick={addRoute}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E8622A] rounded-lg hover:bg-[#d0561f] transition-colors"
          >
            <FiPlus size={14} /> Add Route
          </button>
        </div>
      </SectionCard>

      {/* XML Preview */}
      <SectionCard title="Sitemap XML Preview" icon={<FiFileText size={15} />} defaultOpen={false}>
        <pre className="bg-gray-900 text-green-400 text-xs rounded-xl p-4 overflow-x-auto leading-6">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((r) => r.included)
  .map(
    (r) => `  <url>
    <loc>${sitemapUrl.replace("/sitemap.xml", "")}${r.path}</loc>
    <priority>${r.priority}</priority>
    <changefreq>${r.changefreq}</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>`}
        </pre>
      </SectionCard>

    </div>
  );
}