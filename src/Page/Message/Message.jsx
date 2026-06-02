import { useState } from "react";
import {
  RiMailLine, RiSearchLine, RiFilterLine, RiUserLine,
  RiPhoneLine, RiGlobalLine, RiTimeLine, RiCheckDoubleLine,
  RiCheckLine, RiDeleteBinLine, RiStarLine, RiStarFill,
  RiMailOpenLine, RiArrowLeftLine, RiDownloadLine,
  RiRefreshLine, RiInboxLine, RiSendPlaneLine,
  RiCloseLine, RiExternalLinkLine, RiMoreLine,
} from "react-icons/ri";

const sampleMessages = [
  {
    id: 1, name: "Arjun Sharma", email: "arjun.sharma@gmail.com",
    phone: "+91 98765 43210", subject: "Web Design Project Inquiry",
    message: "Hi, I am looking for a professional website for my clothing brand. I need an ecommerce site with modern design. Can you share your pricing and timeline? We have around 50 products to list.",
    source: "kraviona.com/contact", date: "2025-06-01T09:15:00",
    status: "unread", starred: false, service: "Web Design", budget: "₹50,000 – ₹1,00,000",
  },
  {
    id: 2, name: "Priya Mehta", email: "priya@techstartup.in",
    phone: "+91 87654 32109", subject: "SEO Services Required",
    message: "Hello Kraviona team, we are a SaaS startup and need aggressive SEO strategy. Our current organic traffic is very low. We want to target keywords in fintech space. Please let us know your monthly packages.",
    source: "kraviona.com/contact", date: "2025-05-31T14:30:00",
    status: "read", starred: true, service: "SEO", budget: "₹20,000/month",
  },
  {
    id: 3, name: "Rahul Verma", email: "rahulverma@outlook.com",
    phone: "+91 76543 21098", subject: "Logo + Branding Package",
    message: "Need complete branding package for my new restaurant in Delhi. Logo, menu design, social media templates, and visiting cards. What all do you offer in branding? Please share portfolio as well.",
    source: "kraviona.com/contact", date: "2025-05-31T11:00:00",
    status: "replied", starred: false, service: "Branding", budget: "₹15,000 – ₹30,000",
  },
  {
    id: 4, name: "Sneha Kulkarni", email: "sneha.kulkarni@yahoo.com",
    phone: "+91 65432 10987", subject: "Mobile App Development",
    message: "We want to build a food delivery app similar to Swiggy for our city. Need both Android and iOS. What is your development timeline and cost estimate for an MVP? We have wireframes ready.",
    source: "kraviona.com/contact", date: "2025-05-30T16:45:00",
    status: "unread", starred: true, service: "App Dev", budget: "₹2,00,000+",
  },
  {
    id: 5, name: "Vikram Singh", email: "vikram.singh@business.com",
    phone: "+91 54321 09876", subject: "Social Media Management",
    message: "Looking for a team to handle Instagram and LinkedIn for my consulting firm. Currently posting inconsistently. Need content calendar, creatives, and monthly reporting.",
    source: "kraviona.com/contact", date: "2025-05-29T10:20:00",
    status: "read", starred: false, service: "Social Media", budget: "₹12,000/month",
  },
  {
    id: 6, name: "Anjali Patel", email: "anjali@anjaliarts.com",
    phone: "+91 43210 98765", subject: "Portfolio Website",
    message: "I am a photographer and need a beautiful portfolio website. Simple, clean and fast. Should have gallery sections and contact form. I already have domain and hosting.",
    source: "kraviona.com/contact", date: "2025-05-28T13:00:00",
    status: "replied", starred: false, service: "Web Design", budget: "₹10,000 – ₹20,000",
  },
];

const AVATAR_COLORS = [
  "#f97316","#10b981","#6366f1","#e11d48","#0ea5e9","#8b5cf6","#f59e0b","#14b8a6",
];
function getAvatarColor(name) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}
function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function Avatar({ name, size = 40 }) {
  const bg = getAvatarColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.3, flexShrink: 0,
      letterSpacing: 0.5,
    }}>
      {getInitials(name)}
    </div>
  );
}

const STATUS = {
  unread:  { label: "Unread",  bg: "#fff7ed", color: "#ea580c", dot: "#f97316" },
  read:    { label: "Read",    bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  replied: { label: "Replied", bg: "#ecfdf5", color: "#059669", dot: "#10b981" },
};

function StatusBadge({ status }) {
  const s = STATUS[status];
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

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function MessagesSection() {
  const [messages, setMessages] = useState(sampleMessages);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [replyText, setReplyText] = useState("");

  const unreadCount = messages.filter(m => m.status === "unread").length;

  const filtered = messages.filter(m => {
    const q = search.toLowerCase();
    const matchQ = !q || [m.name, m.email, m.subject, m.message, m.service]
      .some(v => v.toLowerCase().includes(q));
    const matchF = filter === "all" || m.status === filter;
    return matchQ && matchF;
  });

  const openMsg = (msg) => {
    if (msg.status === "unread") {
      const updated = { ...msg, status: "read" };
      setMessages(prev => prev.map(m => m.id === msg.id ? updated : m));
      setSelected(updated);
    } else {
      setSelected(msg);
    }
    setReplyText("");
  };

  const toggleStar = (id, e) => {
    e?.stopPropagation();
    setMessages(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
    if (selected?.id === id) setSelected(prev => ({ ...prev, starred: !prev.starred }));
  };

  const deleteMsg = (id, e) => {
    e?.stopPropagation();
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const markReplied = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "replied" } : m));
    setSelected(prev => ({ ...prev, status: "replied" }));
  };

  // Stats
  const stats = [
    { label: "Total Messages", value: messages.length, color: "#6366f1", bg: "#eef2ff" },
    { label: "Unread",         value: messages.filter(m => m.status === "unread").length,  color: "#f97316", bg: "#fff7ed" },
    { label: "Replied",        value: messages.filter(m => m.status === "replied").length, color: "#10b981", bg: "#ecfdf5" },
    { label: "Starred",        value: messages.filter(m => m.starred).length,              color: "#f59e0b", bg: "#fffbeb" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>

      {/* ── Breadcrumb + Actions ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 2px" }}>
            Dashboard / <span style={{ color: "#f97316" }}>Messages</span>
          </p>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1e293b" }}>Messages</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setMessages(sampleMessages)}
            style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#64748b", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}
          >
            <RiRefreshLine size={14} /> Refresh
          </button>
          <button style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#64748b", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
            <RiDownloadLine size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #f1f5f9", padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: s.bg, color: s.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800,
            }}>
              {s.value}
            </div>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Messages Panel ── */}
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>

        {/* List */}
        <div style={{
          width: selected ? 360 : "100%",
          background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9",
          display: "flex", flexDirection: "column", overflow: "hidden",
          transition: "width 0.2s ease", flexShrink: 0,
        }}>
          {/* Search + Filter */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 8 }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8,
              background: "#f8fafc", borderRadius: 8, padding: "7px 12px",
              border: "1px solid #e2e8f0",
            }}>
              <RiSearchLine size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search messages..."
                style={{
                  background: "none", border: "none", outline: "none",
                  fontSize: 13, color: "#374151", width: "100%",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                  <RiCloseLine size={14} />
                </button>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowFilter(!showFilter)}
                style={{
                  display: "flex", alignItems: "center", gap: 4, height: "100%",
                  background: "none", border: "1px solid #e2e8f0", borderRadius: 8,
                  padding: "0 12px", cursor: "pointer", fontSize: 12, color: "#64748b",
                  fontWeight: 500,
                }}
              >
                <RiFilterLine size={13} />
                {filter === "all" ? "All" : STATUS[filter]?.label}
              </button>
              {showFilter && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 50,
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)", overflow: "hidden", width: 140,
                }}>
                  {["all", "unread", "read", "replied"].map(s => (
                    <button
                      key={s}
                      onClick={() => { setFilter(s); setShowFilter(false); }}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "9px 14px", border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: filter === s ? 700 : 400,
                        background: filter === s ? "#fff7ed" : "none",
                        color: filter === s ? "#f97316" : "#374151",
                        textTransform: "capitalize",
                      }}
                    >
                      {s === "all" ? "All Messages" : STATUS[s]?.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Count row */}
          <div style={{ padding: "7px 14px", fontSize: 11, color: "#94a3b8", borderBottom: "1px solid #f8fafc", fontWeight: 500 }}>
            {filtered.length} message{filtered.length !== 1 ? "s" : ""}
            {filter !== "all" && ` · ${STATUS[filter]?.label}`}
          </div>

          {/* List Items */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#cbd5e1", paddingTop: 60, gap: 8 }}>
                <RiInboxLine size={40} />
                <span style={{ fontSize: 13 }}>No messages found</span>
              </div>
            ) : filtered.map(msg => (
              <div
                key={msg.id}
                onClick={() => openMsg(msg)}
                style={{
                  display: "flex", gap: 10, padding: "12px 14px",
                  cursor: "pointer", borderBottom: "1px solid #f8fafc",
                  background: selected?.id === msg.id
                    ? "#fff7ed"
                    : msg.status === "unread" ? "#fffbf5" : "#fff",
                  borderLeft: selected?.id === msg.id ? "3px solid #f97316" : "3px solid transparent",
                  transition: "background 0.12s",
                  position: "relative",
                }}
                onMouseEnter={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => {
                  if (selected?.id === msg.id) e.currentTarget.style.background = "#fff7ed";
                  else if (msg.status === "unread") e.currentTarget.style.background = "#fffbf5";
                  else e.currentTarget.style.background = "#fff";
                }}
              >
                <Avatar name={msg.name} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
                    <span style={{ fontWeight: msg.status === "unread" ? 700 : 600, fontSize: 13, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {msg.name}
                    </span>
                    <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0, marginLeft: 6 }}>
                      {timeAgo(msg.date)}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 2px", fontSize: 12, color: "#475569", fontWeight: msg.status === "unread" ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.subject}
                  </p>
                  <p style={{ margin: "0 0 6px", fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.message}
                  </p>
                  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    <StatusBadge status={msg.status} />
                    <span style={{ fontSize: 10, background: "#eef2ff", color: "#6366f1", borderRadius: 20, padding: "2px 7px", fontWeight: 600 }}>
                      {msg.service}
                    </span>
                  </div>
                </div>
                {/* Hover Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 4 }}>
                  <button
                    onClick={e => toggleStar(msg.id, e)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: msg.starred ? "#f59e0b" : "#cbd5e1" }}
                  >
                    {msg.starred ? <RiStarFill size={13} /> : <RiStarLine size={13} />}
                  </button>
                  <button
                    onClick={e => deleteMsg(msg.id, e)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#fca5a5" }}
                  >
                    <RiDeleteBinLine size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{
            flex: 1, background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {/* Detail Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 18px", borderBottom: "1px solid #f1f5f9",
            }}>
              <button
                onClick={() => setSelected(null)}
                style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 12 }}
              >
                <RiArrowLeftLine size={14} /> Back
              </button>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={e => toggleStar(selected.id, e)} style={{ background: "none", border: "none", cursor: "pointer", color: selected.starred ? "#f59e0b" : "#cbd5e1" }}>
                  {selected.starred ? <RiStarFill size={16} /> : <RiStarLine size={16} />}
                </button>
                {selected.status !== "replied" && (
                  <button
                    onClick={() => markReplied(selected.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
                      borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    }}
                  >
                    <RiCheckLine size={13} /> Mark Replied
                  </button>
                )}
                <button
                  onClick={() => deleteMsg(selected.id)}
                  style={{ background: "none", border: "1px solid #fecaca", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#ef4444" }}
                >
                  <RiDeleteBinLine size={15} />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>

              {/* Sender */}
              <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <Avatar name={selected.name} size={46} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 17, color: "#1e293b" }}>{selected.name}</span>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 5 }}>
                    <a href={`mailto:${selected.email}`} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6366f1", textDecoration: "none" }}>
                      <RiMailLine size={12} /> {selected.email}
                    </a>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
                      <RiPhoneLine size={12} /> {selected.phone}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
                      <RiTimeLine size={12} /> {formatDate(selected.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Service", value: selected.service, color: "#6366f1", bg: "#eef2ff" },
                  { label: "Budget",  value: selected.budget,  color: "#059669", bg: "#ecfdf5" },
                  { label: "Source",  value: selected.source,  color: "#f97316", bg: "#fff7ed" },
                ].map(card => (
                  <div key={card.label} style={{ background: card.bg, borderRadius: 10, padding: "10px 14px" }}>
                    <p style={{ margin: "0 0 3px", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{card.label}</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: card.color }}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ margin: "0 0 3px", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Subject</p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{selected.subject}</p>
              </div>

              {/* Message Body */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <RiMailOpenLine size={14} style={{ color: "#f97316" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Message</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{selected.message}</p>
              </div>

              {/* Quick Reply */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <RiSendPlaneLine size={14} style={{ color: "#f97316" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Quick Reply</span>
                </div>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={3}
                  placeholder={`Write a reply to ${selected.name}...`}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    border: "1px solid #e2e8f0", borderRadius: 10,
                    padding: "10px 14px", fontSize: 13, color: "#374151",
                    outline: "none", resize: "none",
                    fontFamily: "inherit", lineHeight: 1.6,
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}&body=${encodeURIComponent(replyText)}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "#f97316", color: "#fff",
                      padding: "9px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600,
                      textDecoration: "none",
                    }}
                    onClick={() => markReplied(selected.id)}
                  >
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