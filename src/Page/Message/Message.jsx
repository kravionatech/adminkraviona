// Messages — full CRM inbox wired to /api/admin/messages/*
import { useEffect, useState } from "react";
import {
  RiMailLine, RiSearchLine, RiFilterLine,
  RiPhoneLine, RiTimeLine, RiCheckLine, RiDeleteBinLine,
  RiStarLine, RiStarFill, RiMailOpenLine, RiArrowLeftLine,
  RiDownloadLine, RiRefreshLine, RiInboxLine, RiSendPlaneLine,
  RiCloseLine,
} from "react-icons/ri";
import { messagesApi } from "../../services/api";

const STATUS = {
  unread:  { label: "Unread",  bg: "#fff7ed", color: "#ea580c", dot: "#f97316" },
  read:    { label: "Read",    bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  replied: { label: "Replied", bg: "#ecfdf5", color: "#059669", dot: "#10b981" },
  spam:    { label: "Spam",    bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
  new:     { label: "New",     bg: "#fff7ed", color: "#ea580c", dot: "#f97316" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.unread;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, borderRadius: 20,
      padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

const AVATAR_COLORS = ["#f97316","#10b981","#6366f1","#e11d48","#0ea5e9","#8b5cf6","#f59e0b","#14b8a6"];
const getAvatarColor = (n) => AVATAR_COLORS[((n || "?").charCodeAt(0) || 0) % AVATAR_COLORS.length];
const getInitials = (n) => (n || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function Avatar({ name, size = 40 }) {
  const bg = getAvatarColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.3, flexShrink: 0, letterSpacing: 0.5,
    }}>
      {getInitials(name)}
    </div>
  );
}

const timeAgo = (d) => {
  if (!d) return "";
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};
const formatDate = (d) =>
  d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

export default function MessagesSection() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [replyText, setReplyText] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await messagesApi.list({ limit: 100, sort: "createdAt", order: "desc" });
      const list = Array.isArray(res) ? res : (res?.data || []);
      setMessages(list);
    } catch (e) {
      setMessages([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const unreadCount = messages.filter((m) => m.status === "unread" || m.status === "new").length;

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    const matchQ = !q || [m.name, m.firstName, m.email, m.subject, m.message, m.service, m.sourceService]
      .filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
    const matchF = filter === "all" || m.status === filter;
    return matchQ && matchF;
  });

  const openMsg = async (msg) => {
    setSelected(msg);
    setReplyText("");
    if (msg.status === "unread" || msg.status === "new") {
      try {
        await messagesApi.update(msg._id, { isRead: true, status: "read" });
        setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, isRead: true, status: "read" } : m));
      } catch {}
    }
  };

  const toggleStar = async (id, e) => {
    e?.stopPropagation?.();
    const m = messages.find((x) => x._id === id);
    if (!m) return;
    const starred = !m.starred;
    setMessages((prev) => prev.map((x) => x._id === id ? { ...x, starred } : x));
    if (selected?._id === id) setSelected((prev) => ({ ...prev, starred }));
    try { await messagesApi.update(id, { starred }); } catch {}
  };

  const deleteMsg = async (id, e) => {
    e?.stopPropagation?.();
    if (!window.confirm("Delete this message?")) return;
    setMessages((prev) => prev.filter((m) => m._id !== id));
    if (selected?._id === id) setSelected(null);
    try { await messagesApi.remove(id); } catch {}
  };

  const markReplied = async (id) => {
    setMessages((prev) => prev.map((m) => m._id === id ? { ...m, status: "replied" } : m));
    setSelected((prev) => ({ ...prev, status: "replied" }));
    try { await messagesApi.update(id, { status: "replied" }); } catch {}
  };

  const stats = [
    { label: "Total Messages", value: messages.length,                            color: "#6366f1", bg: "#eef2ff" },
    { label: "Unread",         value: messages.filter((m) => m.status === "unread" || m.status === "new").length, color: "#f97316", bg: "#fff7ed" },
    { label: "Replied",        value: messages.filter((m) => m.status === "replied").length, color: "#10b981", bg: "#ecfdf5" },
    { label: "Starred",        value: messages.filter((m) => m.starred).length,    color: "#f59e0b", bg: "#fffbeb" },
  ];

  const exportCSV = () => {
    const rows = [["Name", "Email", "Phone", "Subject", "Status", "Source", "Created"]];
    messages.forEach((m) => rows.push([
      m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim(),
      m.email, m.phone, m.subject, m.status, m.sourcePage || m.source, m.createdAt,
    ]));
    const csv = rows.map((r) => r.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "messages.csv"; a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 2px" }}>
            Dashboard / <span style={{ color: "#f97316" }}>Messages</span>
          </p>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1e293b" }}>Messages</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={fetchMessages} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#64748b", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
            <RiRefreshLine size={14} /> Refresh
          </button>
          <button onClick={exportCSV} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#64748b", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
            <RiDownloadLine size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>
              {s.value}
            </div>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
        <div style={{
          width: selected ? 360 : "100%",
          background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9",
          display: "flex", flexDirection: "column", overflow: "hidden",
          transition: "width 0.2s ease", flexShrink: 0,
        }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 8 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", borderRadius: 8, padding: "7px 12px", border: "1px solid #e2e8f0" }}>
              <RiSearchLine size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..."
                style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "#374151", width: "100%" }} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}><RiCloseLine size={14} /></button>}
            </div>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowFilter((v) => !v)}
                style={{ display: "flex", alignItems: "center", gap: 4, height: "100%", background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "0 12px", cursor: "pointer", fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                <RiFilterLine size={13} />{filter === "all" ? "All" : (STATUS[filter]?.label || filter)}
              </button>
              {showFilter && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 50, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", overflow: "hidden", width: 140 }}>
                  {["all", "unread", "read", "replied", "spam"].map((s) => (
                    <button key={s} onClick={() => { setFilter(s); setShowFilter(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: filter === s ? 700 : 400, background: filter === s ? "#fff7ed" : "none", color: filter === s ? "#f97316" : "#374151", textTransform: "capitalize" }}>
                      {s === "all" ? "All Messages" : (STATUS[s]?.label || s)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: "7px 14px", fontSize: 11, color: "#94a3b8", borderBottom: "1px solid #f8fafc", fontWeight: 500 }}>
            {loading ? "Loading…" : `${filtered.length} message${filtered.length !== 1 ? "s" : ""}`}
            {filter !== "all" && ` · ${STATUS[filter]?.label || filter}`}
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#cbd5e1", paddingTop: 60, gap: 8 }}>
                <RiInboxLine size={40} /><span style={{ fontSize: 13 }}>No messages found</span>
              </div>
            ) : filtered.map((msg) => {
              const name = msg.name || `${msg.firstName || ""} ${msg.lastName || ""}`.trim() || "Unknown";
              const isUnread = msg.status === "unread" || msg.status === "new";
              return (
                <div key={msg._id} onClick={() => openMsg(msg)}
                  style={{ display: "flex", gap: 10, padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid #f8fafc", background: selected?._id === msg._id ? "#fff7ed" : isUnread ? "#fffbf5" : "#fff", borderLeft: selected?._id === msg._id ? "3px solid #f97316" : "3px solid transparent" }}>
                  <Avatar name={name} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
                      <span style={{ fontWeight: isUnread ? 700 : 600, fontSize: 13, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0, marginLeft: 6 }}>{timeAgo(msg.createdAt)}</span>
                    </div>
                    <p style={{ margin: "0 0 2px", fontSize: 12, color: "#475569", fontWeight: isUnread ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.subject || "No subject"}</p>
                    <p style={{ margin: "0 0 6px", fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.message}</p>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <StatusBadge status={msg.status} />
                      {msg.sourceService && <span style={{ fontSize: 10, background: "#eef2ff", color: "#6366f1", borderRadius: 20, padding: "2px 7px", fontWeight: 600 }}>{msg.sourceService}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 4 }}>
                    <button onClick={(e) => toggleStar(msg._id, e)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: msg.starred ? "#f59e0b" : "#cbd5e1" }}>
                      {msg.starred ? <RiStarFill size={13} /> : <RiStarLine size={13} />}
                    </button>
                    <button onClick={(e) => deleteMsg(msg._id, e)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#fca5a5" }}>
                      <RiDeleteBinLine size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selected && (
          <div style={{ flex: 1, background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid #f1f5f9" }}>
              <button onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 12 }}>
                <RiArrowLeftLine size={14} /> Back
              </button>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={(e) => toggleStar(selected._id, e)} style={{ background: "none", border: "none", cursor: "pointer", color: selected.starred ? "#f59e0b" : "#cbd5e1" }}>
                  {selected.starred ? <RiStarFill size={16} /> : <RiStarLine size={16} />}
                </button>
                {selected.status !== "replied" && (
                  <button onClick={() => markReplied(selected._id)} style={{ display: "flex", alignItems: "center", gap: 5, background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                    <RiCheckLine size={13} /> Mark Replied
                  </button>
                )}
                <button onClick={() => deleteMsg(selected._id)} style={{ background: "none", border: "1px solid #fecaca", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#ef4444" }}>
                  <RiDeleteBinLine size={15} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
              <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <Avatar name={selected.name || `${selected.firstName || ""} ${selected.lastName || ""}`.trim()} size={46} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 17, color: "#1e293b" }}>{selected.name || `${selected.firstName || ""} ${selected.lastName || ""}`.trim()}</span>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 5 }}>
                    {selected.email && <a href={`mailto:${selected.email}`} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6366f1", textDecoration: "none" }}><RiMailLine size={12} /> {selected.email}</a>}
                    {selected.phone && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}><RiPhoneLine size={12} /> {selected.phone}</span>}
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}><RiTimeLine size={12} /> {formatDate(selected.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Service", value: selected.sourceService || "—", color: "#6366f1", bg: "#eef2ff" },
                  { label: "Source",  value: selected.sourcePage || selected.source || "—", color: "#f97316", bg: "#fff7ed" },
                  { label: "UTM",     value: selected.utmCampaign || selected.utmSource || "—", color: "#059669", bg: "#ecfdf5" },
                ].map((card) => (
                  <div key={card.label} style={{ background: card.bg, borderRadius: 10, padding: "10px 14px" }}>
                    <p style={{ margin: "0 0 3px", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{card.label}</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: card.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <p style={{ margin: "0 0 3px", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Subject</p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{selected.subject || "—"}</p>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <RiMailOpenLine size={14} style={{ color: "#f97316" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Message</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selected.message}</p>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <RiSendPlaneLine size={14} style={{ color: "#f97316" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Quick Reply</span>
                </div>
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3}
                  placeholder={`Write a reply to ${selected.name || "this contact"}...`}
                  style={{ width: "100%", boxSizing: "border-box", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#374151", outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <a href={`mailto:${selected.email || ""}?subject=Re: ${selected.subject || ""}&body=${encodeURIComponent(replyText)}`}
                    onClick={() => markReplied(selected._id)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f97316", color: "#fff", padding: "9px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    <RiSendPlaneLine size={14} /> Send Reply
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
