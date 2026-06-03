import { useState, useEffect } from "react";
import { teamApi } from "../../services/api";
import {
  FiUsers, FiShield, FiActivity, FiMail, FiPlus, FiDownload,
  FiSearch, FiGrid, FiList, FiMoreVertical, FiMessageSquare,
  FiEdit2, FiUserPlus, FiEye, FiBriefcase
} from "react-icons/fi";

// ─── Data ───────────────────────────────────────────────────────────────────

const MEMBERS = [];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const avatarColors = {
  orange: "bg-orange-100 text-orange-700",
  teal:   "bg-teal-100 text-teal-700",
  blue:   "bg-blue-100 text-blue-700",
  pink:   "bg-pink-100 text-pink-700",
  purple: "bg-purple-100 text-purple-700",
  green:  "bg-green-100 text-green-700",
};

const badgeStyles = {
  Admin:   "bg-orange-100 text-orange-700",
  Manager: "bg-purple-100 text-purple-700",
  Editor:  "bg-blue-100 text-blue-700",
  Viewer:  "bg-green-100 text-green-700",
};

const badgeIcons = {
  Admin:   <FiShield size={11} />,
  Manager: <FiBriefcase size={11} />,
  Editor:  <FiEdit2 size={11} />,
  Viewer:  <FiEye size={11} />,
};

const statusConfig = {
  online:  { dot: "bg-green-500",  label: "Online" },
  away:    { dot: "bg-yellow-400", label: "Away" },
  offline: { dot: "bg-gray-400",   label: "Offline" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-semibold text-gray-800">{value}</div>
      {sub && <div className="text-xs text-green-600 mt-1">{sub}</div>}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {children}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function MemberCard({ member, isAdmin }) {
  const { initials, name, role, email, badge, status, color } = member;
  const { dot, label } = statusConfig[status];

  return (
    <div
      className={`bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors relative
        ${isAdmin ? "border-t-2 border-t-[#E8622A]" : ""}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-base ${avatarColors[color]}`}
        >
          {initials}
        </div>
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <FiMoreVertical size={18} />
        </button>
      </div>

      {/* Info */}
      <div className="mb-3">
        <div className="text-sm font-semibold text-gray-800">{name}</div>
        <div className="text-xs text-gray-400 mt-0.5">{role}</div>
      </div>

      {/* Badge */}
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${badgeStyles[badge]}`}
      >
        {badgeIcons[badge]}
        {badge}
      </span>

      {/* Divider */}
      <div className="my-3 h-px bg-gray-100" />

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          {label}
        </div>
        <div className="flex items-center gap-1 truncate max-w-[140px]">
          <FiMail size={12} />
          <span className="truncate">{email}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:text-[#E8622A] hover:border-[#E8622A] transition-colors">
          <FiMessageSquare size={13} /> Message
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:text-[#E8622A] hover:border-[#E8622A] transition-colors">
          <FiEdit2 size={13} /> Edit
        </button>
      </div>
    </div>
  );
}

function InviteCard() {
  return (
    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[220px] cursor-pointer hover:border-[#E8622A] hover:bg-orange-50 transition-colors group gap-3">
      <div className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#E8622A] group-hover:border-[#E8622A] transition-colors">
        <FiUserPlus size={20} />
      </div>
      <div className="text-sm font-medium text-gray-400 group-hover:text-[#E8622A] transition-colors">
        Invite a member
      </div>
      <div className="text-xs text-gray-300">Send email invite</div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function TeamsPage() {
  const [teamList, setTeamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    teamApi.list({ limit: 100 })
      .then((data) => setTeamList(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => setTeamList([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = teamList.filter((m) => {
    const matchSearch =
      (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.role || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All Roles" || m.badge === roleFilter;
    const matchStatus = statusFilter === "All Status" || m.status === statusFilter.toLowerCase();
    return matchSearch && matchRole && matchStatus;
  });

  const admins  = filtered.filter((m) => m.group === "admin");
  const members = filtered.filter((m) => m.group === "member");

  const gridCls = viewMode === "grid"
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    : "grid grid-cols-1 gap-3";

  return (
    <div className="p-6 bg-white min-h-screen font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Team Members</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your team, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FiDownload size={14} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E8622A] rounded-lg hover:bg-[#d0561f] transition-colors">
            <FiPlus size={14} /> Invite Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<FiUsers size={14} />} label="Total Members" value={teamList.length} sub={`+0 this month`} />
        <StatCard icon={<FiShield size={14} />} label="Admins" value={teamList.filter(m => m.badge === "Admin").length} />
        <StatCard icon={<FiActivity size={14} />} label="Active Now" value={teamList.filter(m => m.status === "online").length} />
        <StatCard icon={<FiMail size={14} />} label="Pending Invites" value={0} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search members by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#E8622A]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:border-[#E8622A]"
        >
          {["All Roles", "Admin", "Manager", "Editor", "Viewer"].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:border-[#E8622A]"
        >
          {["All Status", "Online", "Away", "Offline"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg border text-sm transition-colors ${
              viewMode === "grid"
                ? "bg-[#E8622A] text-white border-[#E8622A]"
                : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <FiGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg border text-sm transition-colors ${
              viewMode === "list"
                ? "bg-[#E8622A] text-white border-[#E8622A]"
                : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <FiList size={15} />
          </button>
        </div>
      </div>

      {teamList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-400 gap-3">
          <FiUsers size={48} className="text-gray-300" />
          <div className="text-sm font-semibold">Data not available</div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E8622A] rounded-lg hover:bg-[#d0561f] transition-colors">
            <FiPlus size={14} /> Invite Member
          </button>
        </div>
      ) : (
        <>
          {/* Admins section */}
          {admins.length > 0 && (
            <div className="mb-8">
              <SectionLabel>Admins & Managers</SectionLabel>
              <div className={gridCls}>
                {admins.map((m) => (
                  <MemberCard key={m.id || m._id} member={m} isAdmin={true} />
                ))}
              </div>
            </div>
          )}

          {/* Members section */}
          <div className="mb-8">
            <SectionLabel>Editors & Viewers</SectionLabel>
            <div className={gridCls}>
              {members.map((m) => (
                <MemberCard key={m.id || m._id} member={m} isAdmin={false} />
              ))}
              <InviteCard />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
