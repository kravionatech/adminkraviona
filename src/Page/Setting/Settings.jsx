import { useState } from "react";
import {
  FiGlobe, FiImage, FiDollarSign, FiPhone, FiFileText,
  FiLayers, FiList, FiSearch, FiCode, FiMap, FiCheckSquare,
  FiSettings, FiChevronRight, FiExternalLink, FiShield,
  FiUsers, FiAlertTriangle, FiClock, FiServer, FiZap,
  FiActivity, FiToggleRight, FiCheck, FiArrowRight,
} from "react-icons/fi";
import {
  HiOutlineCog6Tooth, HiOutlineBuildingOffice2,
  HiOutlineWrenchScrewdriver, HiOutlineSparkles,
  HiOutlineCommandLine, HiOutlineShieldCheck,
} from "react-icons/hi2";

// ─── Settings Sections Data ───────────────────────────────────────────────────
const SETTING_GROUPS = [
  {
    group: "Page Settings",
    description: "Control content and layout for each public-facing page",
    icon: FiFileText,
    color: "#E8663D",
    items: [
      { id: "gallery",    label: "Gallery Page Settings",          desc: "Portfolio grid, filters, image layout",        href: "/dashboard/settings/gallery",    status: "configured", icon: FiImage },
      { id: "casestudies",label: "Case Studies Settings",          desc: "Case study cards, hero, featured toggle",      href: "/dashboard/settings/case-studies", status: "configured", icon: FiLayers },
      { id: "pricing",    label: "Pricing Page Settings",          desc: "Plans, billing toggle, coming-soon flag",      href: "/dashboard/settings/pricing",    status: "coming-soon", icon: FiDollarSign },
      { id: "contact",    label: "Contact Page Settings",          desc: "Form fields, map, office address display",     href: "/dashboard/settings/contact",    status: "configured", icon: FiPhone },
      { id: "blog",       label: "Blog Listing Page",              desc: "Posts per page, sidebar, featured layout",     href: "/dashboard/settings/blog",       status: "configured", icon: FiFileText },
      { id: "services",   label: "Individual Service Pages",       desc: "Hero, FAQs, features per service slug",        href: "/dashboard/settings/services",   status: "configured", icon: FiList },
    ],
  },
  {
    group: "Global Site Settings",
    description: "Site-wide content, identity and configuration — single SiteConfig document",
    icon: FiGlobe,
    color: "#3B82F6",
    items: [
      { id: "sitename",   label: "Site Name & Tagline",            desc: "Company name, tagline, meta description",      href: "/dashboard/settings/global#company",     status: "configured", icon: HiOutlineBuildingOffice2 },
      { id: "phone",      label: "Phone & Email",                  desc: "Contact details shown across the site",        href: "/dashboard/settings/global#company",     status: "configured", icon: FiPhone },
      { id: "address",    label: "Office Address",                 desc: "Address shown in footer and contact page",     href: "/dashboard/settings/global#company",     status: "configured", icon: FiMap },
      { id: "social",     label: "Social Links",                   desc: "FB, Twitter, LinkedIn, Instagram, YouTube",    href: "/dashboard/settings/global#social",      status: "configured", icon: FiExternalLink },
      { id: "footer",     label: "Footer Config",                  desc: "Footer description, links, copyright text",   href: "/dashboard/settings/global#footer",      status: "configured", icon: FiCode },
      { id: "navconf",    label: "Navigation Config",              desc: "Main nav links and their order",              href: "/dashboard/settings/global#navigation",  status: "configured", icon: FiList },
      { id: "newsletter", label: "Newsletter Section",             desc: "Title, subtitle, email placeholder",          href: "/dashboard/settings/global#newsletter",  status: "configured", icon: FiSettings },
      { id: "maintenance",label: "Maintenance Mode",               desc: "Toggle site-wide maintenance screen",         href: "/dashboard/settings/global#maintenance", status: "live",       icon: FiAlertTriangle },
    ],
  },
  {
    group: "SEO & Meta",
    description: "Search engine optimisation, meta tags, and tracking codes",
    icon: FiSearch,
    color: "#10B981",
    items: [
      { id: "metatags",   label: "Default Meta Tags",              desc: "Global fallback title and description",        href: "/dashboard/settings/seo#meta",      status: "configured", icon: FiSearch },
      { id: "ogimage",    label: "OG Image Default",               desc: "Default Open Graph social share image",        href: "/dashboard/settings/seo#og",        status: "configured", icon: FiImage },
      { id: "robots",     label: "Robots.txt Editor",              desc: "Control crawlers and indexing rules",          href: "/dashboard/settings/seo#robots",    status: "configured", icon: FiShield },
      { id: "schema",     label: "Schema / JSON-LD",               desc: "Structured data markup for rich results",      href: "/dashboard/settings/seo#schema",    status: "needs-review", icon: FiCode },
      { id: "sitemap",    label: "Sitemap Settings",               desc: "Auto-generate and submit sitemap.xml",         href: "/dashboard/settings/seo#sitemap",   status: "configured", icon: FiMap },
      { id: "gverify",    label: "Google Verification",            desc: "Search Console verification meta tag",         href: "/dashboard/settings/seo#verify",    status: "configured", icon: FiCheckSquare },
      { id: "canonical",  label: "Canonical Rules",                desc: "Canonical URL configuration per page",        href: "/dashboard/settings/seo#canonical", status: "configured", icon: FiGlobe },
      { id: "gtm",        label: "Google Analytics / GTM",         desc: "Tag Manager container ID setup",               href: "/dashboard/settings/seo#analytics", status: "live",       icon: FiActivity },
    ],
  },
];

const STATUS_CONFIG = {
  configured:   { label: "Configured",   bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500" },
  live:         { label: "Live",         bg: "bg-blue-50",     text: "text-blue-600",    dot: "bg-blue-500 animate-pulse" },
  "needs-review":{ label: "Review",     bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-500" },
  "coming-soon":{ label: "Coming Soon", bg: "bg-gray-100",    text: "text-gray-500",    dot: "bg-gray-400" },
};

const QUICK_ACTIONS = [
  { label: "Global Settings",    icon: FiGlobe,           href: "/dashboard/settings/global",   color: "#E8663D", bg: "#FFF4F0" },
  { label: "SEO & Meta",         icon: FiSearch,          href: "/dashboard/settings/seo",      color: "#10B981", bg: "#F0FDF4" },
  { label: "Maintenance Mode",   icon: FiAlertTriangle,   href: "/dashboard/settings/global#maintenance", color: "#F59E0B", bg: "#FFFBEB" },
  { label: "Sitemap",            icon: FiMap,             href: "/dashboard/settings/seo#sitemap", color: "#3B82F6", bg: "#EFF6FF" },
  { label: "Navigation",         icon: FiList,            href: "/dashboard/settings/global#navigation", color: "#8B5CF6", bg: "#F5F3FF" },
  { label: "Robots.txt",         icon: FiShield,          href: "/dashboard/settings/seo#robots", color: "#64748B", bg: "#F1F5F9" },
];

const SYSTEM_STATS = [
  { label: "Redis Cache",    value: "Connected", status: "ok",   icon: FiServer,  note: "10min TTL" },
  { label: "MongoDB",        value: "Connected", status: "ok",   icon: FiActivity,note: "SiteConfig synced" },
  { label: "API Health",     value: "Healthy",   status: "ok",   icon: FiZap,     note: "v1 endpoints live" },
  { label: "Last Deploy",    value: "2h ago",    status: "ok",   icon: FiClock,   note: "Production" },
];

// ─── Components ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.configured;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function SettingItem({ item }) {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      className="group flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-[#FFF4F0] border border-transparent hover:border-[#E8663D]/15 transition-all duration-150 cursor-pointer"
    >
      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#E8663D]/10 flex items-center justify-center shrink-0 transition-colors">
        <Icon size={14} className="text-gray-400 group-hover:text-[#E8663D] transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{item.label}</span>
          <StatusBadge status={item.status} />
        </div>
        <p className="text-xs text-gray-400 truncate mt-0.5">{item.desc}</p>
      </div>
      <FiChevronRight size={14} className="text-gray-300 group-hover:text-[#E8663D] group-hover:translate-x-0.5 transition-all shrink-0" />
    </a>
  );
}

function GroupCard({ group }) {
  const GroupIcon = group.icon;
  const [expanded, setExpanded] = useState(true);
  const configured = group.items.filter(i => i.status === "configured" || i.status === "live").length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: group.color + "15" }}>
            <GroupIcon size={18} style={{ color: group.color }} />
          </div>
          <div>
            <h2 className="font-extrabold text-gray-800 text-sm tracking-tight">{group.group}</h2>
            <p className="text-xs text-gray-400">{group.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="hidden sm:block text-xs font-semibold text-gray-400">
            {configured}/{group.items.length} ready
          </span>
          {/* Mini progress bar */}
          <div className="hidden sm:block w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(configured / group.items.length) * 100}%`, background: group.color }}
            />
          </div>
          <FiChevronRight
            size={15}
            className="text-gray-400 transition-transform"
            style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>

      {/* Items */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-1">
            {group.items.map((item) => (
              <SettingItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const totalSettings = SETTING_GROUPS.reduce((s, g) => s + g.items.length, 0);
  const totalConfigured = SETTING_GROUPS.reduce(
    (s, g) => s + g.items.filter(i => i.status === "configured" || i.status === "live").length, 0
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim { animation: fadeSlideUp 0.35s ease both; }
        .anim-1 { animation-delay: 0.05s; }
        .anim-2 { animation-delay: 0.10s; }
        .anim-3 { animation-delay: 0.15s; }
        .anim-4 { animation-delay: 0.20s; }
      `}</style>

      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
              <span>Admin</span>
              <FiChevronRight size={11} />
              <span className="text-gray-700 font-semibold">Settings</span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2 tracking-tight">
              <HiOutlineCog6Tooth size={22} className="text-[#E8663D]" />
              Settings
            </h1>
          </div>
          <a
            href="/dashboard/settings/global"
            className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}
          >
            <FiGlobe size={14} />
            Global Settings
          </a>
        </div>
      </div>

      <div className="px-6 py-6 max-w-[1100px] mx-auto space-y-6">

        {/* ── Hero Stats Row ── */}
        <div className="anim grid grid-cols-2 md:grid-cols-4 gap-4">
          {SYSTEM_STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-gray-800">{s.value}</div>
                  <div className="text-[11px] text-gray-400">{s.label}</div>
                  <div className="text-[10px] text-emerald-500 font-semibold">{s.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Config Progress Banner ── */}
        <div className="anim anim-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-extrabold text-gray-800 text-sm">Configuration Progress</h2>
              <p className="text-xs text-gray-400 mt-0.5">{totalConfigured} of {totalSettings} settings sections are ready</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#E8663D]">{Math.round((totalConfigured / totalSettings) * 100)}%</span>
              <p className="text-[11px] text-gray-400">Complete</p>
            </div>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(totalConfigured / totalSettings) * 100}%`,
                background: "linear-gradient(90deg, #E8663D, #F59E0B)",
              }}
            />
          </div>
          <div className="flex items-center gap-4 mt-3">
            {[
              { dot: "bg-emerald-500", label: "Configured" },
              { dot: "bg-blue-500 animate-pulse", label: "Live / Active" },
              { dot: "bg-amber-500", label: "Needs Review" },
              { dot: "bg-gray-400", label: "Coming Soon" },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-[11px] text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="anim anim-2">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map(({ label, icon: Icon, color, bg, href }) => (
              <a
                key={label}
                href={href}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col items-center gap-2.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 text-center"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 leading-tight">{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Settings Groups ── */}
        <div className="anim anim-3 space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">All Settings</h2>
          {SETTING_GROUPS.map((group) => (
            <GroupCard key={group.group} group={group} />
          ))}
        </div>

        {/* ── Danger Zone ── */}
        <div className="anim anim-4 bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-red-50">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <FiAlertTriangle size={16} className="text-red-500" />
            </div>
            <div>
              <h2 className="font-extrabold text-gray-800 text-sm">Danger Zone</h2>
              <p className="text-xs text-gray-400">Irreversible actions — proceed with caution</p>
            </div>
          </div>
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: "Clear Redis Cache",   desc: "Force-refresh all cached API responses",    color: "text-amber-600", border: "border-amber-200", bg: "hover:bg-amber-50", icon: FiZap },
              { label: "Maintenance Mode",    desc: "Take site offline for all visitors",        color: "text-orange-600", border: "border-orange-200", bg: "hover:bg-orange-50", icon: FiAlertTriangle },
              { label: "Reset SiteConfig",    desc: "Restore all global settings to defaults",   color: "text-red-600", border: "border-red-200", bg: "hover:bg-red-50", icon: HiOutlineCog6Tooth },
            ].map(({ label, desc, color, border, bg, icon: Icon }) => (
              <button
                key={label}
                className={`flex items-start gap-3 p-4 rounded-xl border ${border} ${bg} transition-colors text-left group`}
              >
                <Icon size={16} className={`${color} mt-0.5 shrink-0`} />
                <div>
                  <div className={`text-sm font-bold ${color}`}>{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Footer note ── */}
        <div className="flex items-center gap-2 px-2 pb-4">
          <HiOutlineCommandLine size={13} className="text-gray-300" />
          <p className="text-xs text-gray-300">
            All changes via <code className="bg-gray-100 text-gray-500 px-1 py-0.5 rounded text-[10px]">PUT /api/v1/site-config</code> — single MongoDB SiteConfig document · Redis TTL 10min
          </p>
        </div>

      </div>
    </div>
  );
}