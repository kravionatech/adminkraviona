import { useState, useEffect } from "react";
import { adminUsersApi } from "../../services/api";
import {
  RiUserLine, RiUserAddLine, RiSearchLine, RiFilterLine,
  RiEditLine, RiDeleteBinLine, RiShieldUserLine, RiCloseLine,
  RiCheckLine, RiMoreLine, RiMailLine, RiPhoneLine,
  RiCalendarLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine,
  RiAdminLine, RiUserSettingsLine, RiDownloadLine, RiRefreshLine,
} from "react-icons/ri";

const ROLES = ["Admin", "Editor", "Viewer", "Manager"];
const STATUSES = ["Active", "Inactive", "Suspended"];

const ROLE_STYLE = {
  Admin:   { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  Editor:  { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  Viewer:  { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Manager: { bg: "#faf5ff", color: "#7c3aed", border: "#ddd6fe" },
};

const STATUS_STYLE = {
  Active:    { bg: "#ecfdf5", color: "#059669", dot: "#10b981" },
  Inactive:  { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  Suspended: { bg: "#fff7ed", color: "#ea580c", dot: "#f97316" },
};

const AVATAR_COLORS = [
  "#f97316","#6366f1","#10b981","#e11d48","#0ea5e9","#8b5cf6","#f59e0b","#14b8a6","#ec4899","#3b82f6",
];
function avatarColor(name) { return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]; }
function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }
function fmtDate(d) { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

const SEED_USERS = [
  { id: 1, name: "Ravi Kumar",    email: "ravi@kraviona.com",    phone: "+91 98765 43210", role: "Admin",   status: "Active",    joined: "2024-01-15", lastActive: "2025-06-01T08:30:00", avatar: null },
  { id: 2, name: "Sneha Sharma",  email: "sneha@kraviona.com",   phone: "+91 87654 32109", role: "Editor",  status: "Active",    joined: "2024-03-10", lastActive: "2025-05-31T14:20:00", avatar: null },
  { id: 3, name: "Amit Verma",    email: "amit@kraviona.com",    phone: "+91 76543 21098", role: "Manager", status: "Active",    joined: "2024-05-22", lastActive: "2025-05-30T11:00:00", avatar: null },
  { id: 4, name: "Pooja Mehta",   email: "pooja@kraviona.com",   phone: "+91 65432 10987", role: "Editor",  status: "Inactive",  joined: "2024-06-01", lastActive: "2025-04-12T09:45:00", avatar: null },
  { id: 5, name: "Karan Singh",   email: "karan@kraviona.com",   phone: "+91 54321 09876", role: "Viewer",  status: "Active",    joined: "2024-08-14", lastActive: "2025-05-29T16:00:00", avatar: null },
  { id: 6, name: "Divya Patel",   email: "divya@kraviona.com",   phone: "+91 43210 98765", role: "Editor",  status: "Suspended", joined: "2024-09-05", lastActive: "2025-03-01T10:00:00", avatar: null },
  { id: 7, name: "Rohit Joshi",   email: "rohit@kraviona.com",   phone: "+91 32109 87654", role: "Viewer",  status: "Active",    joined: "2024-11-20", lastActive: "2025-05-28T08:00:00", avatar: null },
  { id: 8, name: "Neha Gupta",    email: "neha@kraviona.com",    phone: "+91 21098 76543", role: "Manager", status: "Active",    joined: "2025-01-08", lastActive: "2025-06-01T07:15:00", avatar: null },
];

function Avatar({ name, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: avatarColor(name), color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.31, flexShrink: 0, letterSpacing: 0.5,
    }}>
      {initials(name)}
    </div>
  );
}

function RoleBadge({ role }) {
  const s = ROLE_STYLE[role] || ROLE_STYLE.Viewer;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 600, borderRadius: 20, padding: "2px 9px",
    }}>{role}</span>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Inactive;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, borderRadius: 20, padding: "2px 9px",
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
}

const EMPTY_FORM = { name: "", email: "", phone: "", role: "Viewer", status: "Active", password: "", joined: new Date().toISOString().split("T")[0] };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);   // null = add new
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPass, setShowPass] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminUsersApi.list();
      const list = (Array.isArray(data) ? data : (data?.data || [])).map((u) => ({
        ...u,
        id: u._id,
        name: u.name || u.username,
        role: u.role || "user",
        status: u.isBlocked ? "Suspended" : (u.status || "Active"),
        joined: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "",
      }));
      setUsers(list);
    } catch (e) {
      setUsers(SEED_USERS);
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const mq = !q || [u.name, u.email, u.phone, u.role].some(v => v.toLowerCase().includes(q));
    const mr = roleFilter === "all" || u.role === roleFilter;
    const ms = statusFilter === "all" || u.status === statusFilter;
    return mq && mr && ms;
  });

  const openAdd = () => { setEditUser(null); setForm(EMPTY_FORM); setShowModal(true); setShowPass(false); };
  const openEdit = (u) => { setEditUser(u); setForm({ ...u, password: "" }); setShowModal(true); setShowPass(false); };
  const closeModal = () => { setShowModal(false); setEditUser(null); };

  const saveUser = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form } : u));
      try {
        await adminUsersApi.role({ userId: editUser.id, role: form.role.toLowerCase() });
      } catch (e) { console.error("update failed", e); }
    } else {
      const tempId = `tmp-${Date.now()}`;
      setUsers(prev => [...prev, { ...form, id: tempId, lastActive: new Date().toISOString() }]);
      // Backend doesn't have a /admin/users POST in spec — role can be set once registered
      alert("To add a user, ask them to sign up via /auth/create-account, then update their role here.");
    }
    closeModal();
  };

  const deleteUser = async (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteConfirm(null);
    try { await adminUsersApi.remove(id); } catch (e) { console.error("delete failed", e); }
  };

  const toggleSelect = (id) => setSelectedIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
  const allSelected = filtered.length > 0 && filtered.every(u => selectedIds.includes(u.id));
  const toggleAll = () => setSelectedIds(allSelected ? [] : filtered.map(u => u.id));

  const bulkDelete = () => { setUsers(prev => prev.filter(u => !selectedIds.includes(u.id))); setSelectedIds([]); };

  // Stats
  const stats = [
    { label: "Total Users",   value: users.length,                                          color: "#6366f1", bg: "#eef2ff" },
    { label: "Active",        value: users.filter(u => u.status === "Active").length,        color: "#10b981", bg: "#ecfdf5" },
    { label: "Admins",        value: users.filter(u => u.role === "Admin").length,           color: "#f97316", bg: "#fff7ed" },
    { label: "Suspended",     value: users.filter(u => u.status === "Suspended").length,     color: "#ef4444", bg: "#fef2f2" },
  ];

  const F = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 2px" }}>
            Dashboard / <span style={{ color: "#f97316" }}>Users & Admins</span>
          </p>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1e293b" }}>Users & Admins</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={fetchUsers}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 12px", cursor: "pointer", color: "#64748b", fontSize: 12 }}
          >
            <RiRefreshLine size={14} /> Refresh
          </button>
          <button
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 12px", cursor: "pointer", color: "#64748b", fontSize: 12 }}
          >
            <RiDownloadLine size={14} /> Export
          </button>
          <button
            onClick={openAdd}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "#f97316", color: "#fff", border: "none", borderRadius: 9, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          >
            <RiUserAddLine size={15} /> Add User
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>
              {s.value}
            </div>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180, display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", borderRadius: 8, padding: "7px 12px", border: "1px solid #e2e8f0" }}>
            <RiSearchLine size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "#374151", width: "100%" }}
            />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}><RiCloseLine size={14} /></button>}
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 10px", fontSize: 12, color: "#374151", background: "#fff", cursor: "pointer", outline: "none" }}
          >
            <option value="all">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 10px", fontSize: 12, color: "#374151", background: "#fff", cursor: "pointer", outline: "none" }}
          >
            <option value="all">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {selectedIds.length > 0 && (
            <button
              onClick={bulkDelete}
              style={{ display: "flex", alignItems: "center", gap: 4, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
            >
              <RiDeleteBinLine size={13} /> Delete ({selectedIds.length})
            </button>
          )}

          <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto" }}>
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc", position: "sticky", top: 0, zIndex: 1 }}>
                <th style={{ width: 40, padding: "10px 14px", textAlign: "center" }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer" }} />
                </th>
                {["User", "Email", "Phone", "Role", "Status", "Joined", "Last Active", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 48, color: "#cbd5e1" }}>
                  <RiUserLine size={36} style={{ display: "block", margin: "0 auto 8px" }} />
                  No users found
                </td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id} style={{
                  borderBottom: "1px solid #f8fafc",
                  background: selectedIds.includes(u.id) ? "#fff7ed" : i % 2 === 0 ? "#fff" : "#fafafa",
                  transition: "background 0.1s",
                }}
                  onMouseEnter={e => { if (!selectedIds.includes(u.id)) e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = selectedIds.includes(u.id) ? "#fff7ed" : i % 2 === 0 ? "#fff" : "#fafafa"; }}
                >
                  <td style={{ padding: "10px 14px", textAlign: "center" }}>
                    <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggleSelect(u.id)} style={{ cursor: "pointer" }} />
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={u.name} size={34} />
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#475569" }}>
                    <a href={`mailto:${u.email}`} style={{ color: "#6366f1", textDecoration: "none" }}>{u.email}</a>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#64748b" }}>{u.phone}</td>
                  <td style={{ padding: "10px 12px" }}><RoleBadge role={u.role} /></td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge status={u.status} /></td>
                  <td style={{ padding: "10px 12px", color: "#64748b", whiteSpace: "nowrap" }}>{fmtDate(u.joined)}</td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8", whiteSpace: "nowrap" }}>{timeAgo(u.lastActive)}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        onClick={() => openEdit(u)}
                        title="Edit"
                        style={{ background: "#eff6ff", border: "none", borderRadius: 7, padding: "5px 8px", cursor: "pointer", color: "#2563eb", display: "flex", alignItems: "center" }}
                      >
                        <RiEditLine size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(u)}
                        title="Delete"
                        style={{ background: "#fef2f2", border: "none", borderRadius: 7, padding: "5px 8px", cursor: "pointer", color: "#dc2626", display: "flex", alignItems: "center" }}
                      >
                        <RiDeleteBinLine size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }} onClick={closeModal}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 16, width: 480, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden" }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {editUser ? <RiUserSettingsLine size={18} style={{ color: "#f97316" }} /> : <RiUserAddLine size={18} style={{ color: "#f97316" }} />}
                <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>
                  {editUser ? "Edit User" : "Add New User"}
                </span>
              </div>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Full Name *</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e2e8f0", borderRadius: 9, padding: "8px 12px" }}>
                  <RiUserLine size={14} style={{ color: "#94a3b8" }} />
                  <input value={form.name} onChange={e => F("name", e.target.value)} placeholder="Enter full name"
                    style={{ border: "none", outline: "none", fontSize: 13, width: "100%", color: "#1e293b" }} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Email Address *</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e2e8f0", borderRadius: 9, padding: "8px 12px" }}>
                  <RiMailLine size={14} style={{ color: "#94a3b8" }} />
                  <input value={form.email} onChange={e => F("email", e.target.value)} placeholder="user@kraviona.com"
                    style={{ border: "none", outline: "none", fontSize: 13, width: "100%", color: "#1e293b" }} />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Phone</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e2e8f0", borderRadius: 9, padding: "8px 12px" }}>
                  <RiPhoneLine size={14} style={{ color: "#94a3b8" }} />
                  <input value={form.phone} onChange={e => F("phone", e.target.value)} placeholder="+91 XXXXX XXXXX"
                    style={{ border: "none", outline: "none", fontSize: 13, width: "100%", color: "#1e293b" }} />
                </div>
              </div>

              {/* Role + Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Role</label>
                  <select value={form.role} onChange={e => F("role", e.target.value)}
                    style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 9, padding: "9px 12px", fontSize: 13, color: "#1e293b", outline: "none", background: "#fff", cursor: "pointer" }}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Status</label>
                  <select value={form.status} onChange={e => F("status", e.target.value)}
                    style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 9, padding: "9px 12px", fontSize: 13, color: "#1e293b", outline: "none", background: "#fff", cursor: "pointer" }}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Password (only on add) */}
              {!editUser && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Password</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e2e8f0", borderRadius: 9, padding: "8px 12px" }}>
                    <RiLockPasswordLine size={14} style={{ color: "#94a3b8" }} />
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password} onChange={e => F("password", e.target.value)}
                      placeholder="Set password"
                      style={{ border: "none", outline: "none", fontSize: 13, flex: 1, color: "#1e293b" }}
                    />
                    <button onClick={() => setShowPass(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                      {showPass ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 20px", borderTop: "1px solid #f1f5f9" }}>
              <button onClick={closeModal}
                style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 13, color: "#64748b" }}>
                Cancel
              </button>
              <button onClick={saveUser}
                style={{ display: "flex", alignItems: "center", gap: 5, background: (!form.name.trim() || !form.email.trim()) ? "#fed7aa" : "#f97316", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                <RiCheckLine size={14} /> {editUser ? "Save Changes" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => setDeleteConfirm(null)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 14, width: 360, padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <RiDeleteBinLine size={24} style={{ color: "#dc2626" }} />
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Delete User?</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13, color: "#64748b" }}>
                Cancel
              </button>
              <button onClick={() => deleteUser(deleteConfirm.id)}
                style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}