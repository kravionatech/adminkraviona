// Audit Logs — /dashboard/audit-logs
import { useState, useEffect } from "react";
import { auditApi } from "../../services/api";
import {
  FiClipboard, FiSearch, FiDownload, FiUser, FiFileText,
  FiEdit3, FiTrash2, FiPlus, FiLogIn, FiLogOut, FiSettings,
  FiAlertTriangle, FiShield, FiClock, FiFilter,
} from "react-icons/fi";

const ACTION_TYPES = {
  create:  { icon: FiPlus,       color: "#10B981", bg: "#ECFDF5", label: "Created" },
  update:  { icon: FiEdit3,      color: "#3B82F6", bg: "#EFF6FF", label: "Updated" },
  delete:  { icon: FiTrash2,     color: "#EF4444", bg: "#FEF2F2", label: "Deleted" },
  login:   { icon: FiLogIn,      color: "#8B5CF6", bg: "#F5F3FF", label: "Login" },
  logout:  { icon: FiLogOut,     color: "#64748B", bg: "#F8FAFC", label: "Logout" },
  settings:{ icon: FiSettings,   color: "#F59E0B", bg: "#FFFBEB", label: "Settings" },
  security:{ icon: FiShield,     color: "#DC2626", bg: "#FEF2F2", label: "Security" },
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    auditApi.list({ limit: 200 }).then((d) => {
      const list = (Array.isArray(d) ? d : (d?.data || [])).map((l) => ({
        ...l, id: l._id,
        ts: l.createdAt ? new Date(l.createdAt).toISOString().replace("T", " ").slice(0, 19) : "",
      }));
      setLogs(list);
    }).catch(() => {
      setLogs([]);
    });
  }, []);

  const filtered = logs.filter((l) => {
    const ms = !search || l.summary.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "all" || l.action === filter;
    return ms && mf;
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA] -m-6 sm:-m-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Admin / Logs & Security</div>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <FiClipboard size={20} className="text-[#E8663D]" /> Audit Logs
          </h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl">
          <FiDownload size={14} /> Export CSV
        </button>
      </div>

      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs…"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#E8663D]/20" />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setFilter("all")} className={`text-xs px-3 py-2 rounded-lg ${filter === "all" ? "bg-[#235056] text-white" : "bg-gray-100 text-gray-700"}`}>
            <FiFilter size={11} className="inline mr-1" /> All ({logs.length})
          </button>
          {Object.entries(ACTION_TYPES).map(([k, a]) => (
            <button key={k} onClick={() => setFilter(k)} className={`text-xs px-3 py-2 rounded-lg flex items-center gap-1 ${filter === k ? "text-white" : "bg-gray-100 text-gray-700"}`}
              style={filter === k ? { background: a.color } : {}}>
              <a.icon size={11} /> {a.label} ({logs.filter(l => l.action === k).length})
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filtered.map((l) => {
              const meta = ACTION_TYPES[l.action];
              return (
                <div key={l.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/50">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: meta.bg }}>
                    <meta.icon size={15} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                      <span className="text-xs text-gray-400 font-mono">{l.target}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400 font-mono">{l.targetId}</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-1">{l.summary}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><FiUser size={10} /> {l.user} <span className="text-gray-300">·</span> {l.email}</span>
                      <span className="flex items-center gap-1"><FiClock size={10} /> {l.ts}</span>
                      <span className="flex items-center gap-1 font-mono">{l.ip}</span>
                      <span>{l.device}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {logs.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <FiClipboard size={48} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Data not available</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <FiClipboard size={48} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No log entries match your filters.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
