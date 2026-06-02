import { useState } from "react";
import {
  FiMail, FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye,
  FiSend, FiPause, FiPlay, FiCopy, FiBarChart2,
  FiUsers, FiMousePointer, FiTrendingUp, FiCalendar,
  FiClock, FiCheckCircle, FiAlertCircle, FiX,
  FiChevronDown, FiZap, FiTarget, FiFilter, FiMoreVertical,
} from "react-icons/fi";
import { HiOutlineMegaphone, HiOutlineSparkles } from "react-icons/hi2";

const CAMPAIGNS = [
  {
    id: 1, name: "MERN Stack Launch Promo", type: "Newsletter", status: "active",
    subject: "🚀 Your MERN Stack Roadmap is here!",
    audience: "All Subscribers", sent: 174, opened: 98, clicked: 43, bounced: 3,
    scheduledAt: "Jun 1, 2026", createdAt: "May 28, 2026",
    color: "#E8663D", tag: "Product",
  },
  {
    id: 2, name: "AI Benefits Drip Series", type: "Drip", status: "active",
    subject: "How AI is changing web dev (Part 1 of 5)",
    audience: "Qualified Leads", sent: 89, opened: 61, clicked: 29, bounced: 1,
    scheduledAt: "Jun 3, 2026", createdAt: "May 20, 2026",
    color: "#3B82F6", tag: "Nurture",
  },
  {
    id: 3, name: "June Newsletter", type: "Newsletter", status: "draft",
    subject: "What's new at Kraviona — June Edition",
    audience: "All Subscribers", sent: 0, opened: 0, clicked: 0, bounced: 0,
    scheduledAt: "Jun 15, 2026", createdAt: "Jun 1, 2026",
    color: "#8B5CF6", tag: "Monthly",
  },
  {
    id: 4, name: "SEO Checklist Blast", type: "One-Time", status: "completed",
    subject: "📋 Free SEO Checklist for Developers",
    audience: "Tech Segment", sent: 142, opened: 109, clicked: 67, bounced: 5,
    scheduledAt: "May 10, 2026", createdAt: "May 8, 2026",
    color: "#10B981", tag: "Content",
  },
  {
    id: 5, name: "Re-engagement Flow", type: "Drip", status: "paused",
    subject: "We miss you! Here's something special 🎁",
    audience: "Inactive 60d", sent: 38, opened: 14, clicked: 6, bounced: 2,
    scheduledAt: "May 25, 2026", createdAt: "May 22, 2026",
    color: "#F59E0B", tag: "Retention",
  },
  {
    id: 6, name: "Freelance Tips Welcome", type: "Drip", status: "active",
    subject: "Welcome! Your freelance toolkit starts here",
    audience: "New Subscribers", sent: 56, opened: 49, clicked: 31, bounced: 0,
    scheduledAt: "Ongoing", createdAt: "Apr 10, 2026",
    color: "#EC4899", tag: "Onboarding",
  },
];

const STATUS_MAP = {
  active:    { label: "Active",     bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  draft:     { label: "Draft",      bg: "bg-gray-100",   text: "text-gray-500",   dot: "bg-gray-400",    border: "border-gray-200" },
  completed: { label: "Completed",  bg: "bg-blue-50",    text: "text-blue-600",   dot: "bg-blue-400",    border: "border-blue-200" },
  paused:    { label: "Paused",     bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400",   border: "border-amber-200" },
};

const TYPE_MAP = {
  Newsletter: { icon: FiMail,       color: "#E8663D" },
  Drip:       { icon: FiZap,        color: "#8B5CF6" },
  "One-Time": { icon: FiSend,       color: "#10B981" },
};

function pct(a, b) { return b === 0 ? 0 : Math.round((a / b) * 100); }

function MiniBar({ value, color }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${s.bg} ${s.text} border ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === "active" ? "animate-pulse" : ""}`} />
      {s.label}
    </span>
  );
}

function CampaignCard({ c, onEdit, onDelete, onDuplicate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const TypeIcon = TYPE_MAP[c.type]?.icon || FiMail;
  const openRate = pct(c.opened, c.sent);
  const clickRate = pct(c.clicked, c.sent);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
      {/* Top accent */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${c.color}, ${c.color}80)` }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.color + "18" }}>
              <TypeIcon size={17} style={{ color: c.color }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm leading-tight">{c.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-gray-400 font-medium">{c.type}</span>
                <span className="text-gray-200">·</span>
                <span className="inline-block px-1.5 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: c.color + "18", color: c.color }}>{c.tag}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={c.status} />
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <FiMoreVertical size={14} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-xl z-20 w-40 py-1 overflow-hidden">
                  {[
                    { icon: FiEdit2,    label: "Edit",      action: () => { onEdit(c); setMenuOpen(false); }, color: "text-gray-700" },
                    { icon: FiCopy,     label: "Duplicate", action: () => { onDuplicate(c); setMenuOpen(false); }, color: "text-gray-700" },
                    { icon: FiBarChart2,label: "Analytics", action: () => setMenuOpen(false), color: "text-blue-600" },
                    { icon: FiTrash2,   label: "Delete",    action: () => { onDelete(c.id); setMenuOpen(false); }, color: "text-red-500" },
                  ].map(({ icon: Icon, label, action, color }) => (
                    <button key={label} onClick={action} className={`flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors ${color}`}>
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject */}
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-4 font-mono truncate">
          {c.subject}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Sent",    value: c.sent,    icon: FiSend,         color: "#64748B" },
            { label: "Opened",  value: `${openRate}%`, icon: FiEye,     color: "#3B82F6" },
            { label: "Clicked", value: `${clickRate}%`, icon: FiMousePointer, color: c.color },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center bg-gray-50/70 rounded-xl py-2.5 px-1">
              <Icon size={13} className="mx-auto mb-1" style={{ color }} />
              <div className="text-sm font-bold text-gray-800">{value}</div>
              <div className="text-[10px] text-gray-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <div className="space-y-2 mb-4">
          <div>
            <div className="flex justify-between text-[11px] text-gray-400 mb-1">
              <span>Open rate</span><span className="font-semibold text-gray-600">{openRate}%</span>
            </div>
            <MiniBar value={openRate} color="#3B82F6" />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-gray-400 mb-1">
              <span>Click rate</span><span className="font-semibold text-gray-600">{clickRate}%</span>
            </div>
            <MiniBar value={clickRate} color={c.color} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <FiUsers size={11} />
            <span>{c.audience}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <FiCalendar size={11} />
            <span>{c.scheduledAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", type: "Newsletter", subject: "", audience: "All Subscribers", status: "draft", tag: "Content", color: "#E8663D" });

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFF4F0] flex items-center justify-center">
              <HiOutlineMegaphone size={16} className="text-[#E8663D]" />
            </div>
            <h2 className="font-bold text-gray-800">New Campaign</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {[
            { label: "Campaign Name", key: "name", placeholder: "e.g. Summer Newsletter 2026" },
            { label: "Email Subject", key: "subject", placeholder: "e.g. 🚀 Don't miss this!" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Type", key: "type", options: ["Newsletter", "Drip", "One-Time"] },
              { label: "Audience", key: "audience", options: ["All Subscribers", "Qualified Leads", "New Subscribers", "Inactive 60d", "Tech Segment"] },
              { label: "Tag", key: "tag", options: ["Product", "Nurture", "Monthly", "Content", "Retention", "Onboarding"] },
              { label: "Status", key: "status", options: ["draft", "active"] },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
                <div className="relative">
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-orange-400 appearance-none transition-all"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  >
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <FiChevronDown size={13} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Brand Color</label>
            <div className="flex gap-2">
              {["#E8663D","#3B82F6","#10B981","#8B5CF6","#F59E0B","#EC4899","#06B6D4","#EF4444"].map((c) => (
                <button key={c} onClick={() => setForm({ ...form, color: c })}
                  className="w-7 h-7 rounded-full transition-all hover:scale-110"
                  style={{ background: c, outline: form.color === c ? `3px solid ${c}` : "none", outlineOffset: "2px" }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium">Cancel</button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="px-5 py-2 text-sm text-white rounded-xl font-semibold transition-all hover:shadow-lg active:scale-95 flex items-center gap-2"
            style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}
          >
            <FiSend size={13} /> Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState("grid"); // grid | list

  const allSent    = campaigns.reduce((s, c) => s + c.sent, 0);
  const allOpened  = campaigns.reduce((s, c) => s + c.opened, 0);
  const allClicked = campaigns.reduce((s, c) => s + c.clicked, 0);
  const activeCount = campaigns.filter((c) => c.status === "active").length;

  const filtered = campaigns.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchType   = filterType === "all"   || c.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const handleSave = (form) => {
    setCampaigns([...campaigns, { ...form, id: Date.now(), sent: 0, opened: 0, clicked: 0, bounced: 0, scheduledAt: "TBD", createdAt: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) }]);
  };

  const handleDelete = (id) => setCampaigns(campaigns.filter((c) => c.id !== id));
  const handleDuplicate = (c) => setCampaigns([...campaigns, { ...c, id: Date.now(), name: c.name + " (Copy)", status: "draft", sent: 0, opened: 0, clicked: 0 }]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
            <span>Sales & Audience</span><span>/</span>
            <span className="text-gray-700 font-semibold">Campaigns</span>
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2 tracking-tight">
            <HiOutlineMegaphone size={22} className="text-[#E8663D]" />
            Campaigns
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
          style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}
        >
          <FiPlus size={16} /> New Campaign
        </button>
      </div>

      <div className="px-6 py-6 max-w-[1280px] mx-auto">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Campaigns", value: campaigns.length, icon: HiOutlineMegaphone, color: "#E8663D", bg: "#FFF4F0", sub: `${activeCount} active` },
            { label: "Total Sent",      value: allSent.toLocaleString(), icon: FiSend, color: "#3B82F6", bg: "#EFF6FF", sub: "all time" },
            { label: "Avg Open Rate",   value: `${pct(allOpened, allSent)}%`, icon: FiEye, color: "#10B981", bg: "#F0FDF4", sub: `${allOpened} opens` },
            { label: "Avg Click Rate",  value: `${pct(allClicked, allSent)}%`, icon: FiMousePointer, color: "#8B5CF6", bg: "#F5F3FF", sub: `${allClicked} clicks` },
          ].map(({ label, value, icon: Icon, color, bg, sub }) => (
            <div key={label} className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-50 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={19} style={{ color }} />
              </div>
              <div>
                <div className="text-xl font-extrabold text-gray-800 tracking-tight">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
                <div className="text-[11px] font-semibold mt-0.5" style={{ color }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col md:flex-row gap-3 mb-5 items-start md:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <FiSearch size={14} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1.5 flex-wrap">
            {["all","active","draft","paused","completed"].map((f) => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  filterStatus === f ? "bg-[#E8663D] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}>
                {f}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="relative">
            <select
              className="bg-white border border-gray-200 rounded-xl pl-3.5 pr-8 py-2 text-xs font-semibold text-gray-600 focus:outline-none appearance-none shadow-sm cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {["Newsletter","Drip","One-Time"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <FiChevronDown size={12} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-gray-400 mb-4 font-medium">
          Showing <span className="text-gray-700 font-bold">{filtered.length}</span> of {campaigns.length} campaigns
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 text-center">
            <HiOutlineMegaphone size={44} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">No campaigns found</p>
            <button onClick={() => setModalOpen(true)} className="mt-4 px-5 py-2 text-sm font-bold text-[#E8663D] border border-[#E8663D] rounded-xl hover:bg-[#FFF4F0] transition-colors">
              + Create one
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <CampaignCard
                key={c.id}
                c={c}
                onEdit={() => {}}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}
      </div>

      <CreateModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
}