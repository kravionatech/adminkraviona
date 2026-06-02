import { useState, useEffect } from "react";
import { notificationsApi } from "../../services/api";
import {
  FiBell, FiCheck, FiTrash2, FiSettings, FiFilter,
  FiUser, FiMail, FiFileText, FiAlertCircle, FiStar,
  FiShoppingBag, FiActivity, FiCheckCircle, FiInfo,
  FiChevronDown, FiX, FiZap, FiMessageSquare, FiRefreshCw
} from "react-icons/fi";

const INITIAL = [
  { id: 1, type: "lead", title: "New lead from Rahul Sharma", desc: "Interested in MERN Stack service — submitted via contact form.", time: "2 min ago", read: false, pinned: true, avatar: "RS", avatarColor: "#EEF6FF", avatarText: "#1D6FD8" },
  { id: 2, type: "system", title: "Scheduled backup completed", desc: "Your weekly database backup was successful. 3.2 GB saved.", time: "18 min ago", read: false, pinned: false, avatar: null, avatarColor: null, avatarText: null },
  { id: 3, type: "message", title: "New message from Priya Singh", desc: "\"Hi, can we schedule a call this week to discuss the SEO proposal?\"", time: "1 hour ago", read: false, pinned: false, avatar: "PS", avatarColor: "#FFF0F6", avatarText: "#C8203E" },
  { id: 4, type: "alert", title: "High server CPU usage detected", desc: "CPU usage spiked to 89% on Production Server #2. Check now.", time: "2 hours ago", read: false, pinned: false, avatar: null, avatarColor: null, avatarText: null },
  { id: 5, type: "lead", title: "Lead status updated", desc: "Sanya Kapoor moved from Contacted → Closed Won on SaaS Dev.", time: "3 hours ago", read: true, pinned: false, avatar: "SK", avatarColor: "#F0FAF4", avatarText: "#1A7A4A" },
  { id: 6, type: "blog", title: "Blog post published", desc: "\"Ultimate MERN Stack Roadmap 2026\" is now live and indexed.", time: "5 hours ago", read: true, pinned: false, avatar: null, avatarColor: null, avatarText: null },
  { id: 7, type: "newsletter", title: "Newsletter sent successfully", desc: "Campaign \"AI Tools Weekly #12\" delivered to 1,248 subscribers.", time: "Yesterday", read: true, pinned: false, avatar: null, avatarColor: null, avatarText: null },
  { id: 8, type: "message", title: "New message from Amit Verma", desc: "\"Thanks for the proposal. I'll review and get back to you shortly.\"", time: "Yesterday", read: true, pinned: false, avatar: "AV", avatarColor: "#FFFBEB", avatarText: "#B45309" },
  { id: 9, type: "system", title: "SSL Certificate renewed", desc: "SSL for kraviona.com has been automatically renewed for 1 year.", time: "2 days ago", read: true, pinned: false, avatar: null, avatarColor: null, avatarText: null },
  { id: 10, type: "alert", title: "New admin login detected", desc: "Login from IP 192.168.1.104 · Chrome · Mumbai, India.", time: "2 days ago", read: true, pinned: false, avatar: null, avatarColor: null, avatarText: null },
  { id: 11, type: "lead", title: "New lead from Rohan Das", desc: "Interested in Node.js service — marked as New.", time: "3 days ago", read: true, pinned: false, avatar: "RD", avatarColor: "#F5F0FF", avatarText: "#6D28D9" },
  { id: 12, type: "blog", title: "Blog post hit 200+ views", desc: "\"10 Benefits of AI\" reached 200 views milestone today.", time: "4 days ago", read: true, pinned: false, avatar: null, avatarColor: null, avatarText: null },
];

const TYPE_META = {
  lead:       { label: "Lead",       icon: <FiUser size={14} />,         bg: "#EEF6FF", text: "#1D6FD8",  dot: "#2563EB" },
  message:    { label: "Message",    icon: <FiMessageSquare size={14} />, bg: "#FFF0F6", text: "#C8203E",  dot: "#E11D48" },
  alert:      { label: "Alert",      icon: <FiAlertCircle size={14} />,  bg: "#FFF7ED", text: "#C2410C",  dot: "#EA580C" },
  system:     { label: "System",     icon: <FiActivity size={14} />,     bg: "#F0FAF4", text: "#1A7A4A",  dot: "#16A34A" },
  blog:       { label: "Blog",       icon: <FiFileText size={14} />,     bg: "#F5F0FF", text: "#6D28D9",  dot: "#7C3AED" },
  newsletter: { label: "Newsletter", icon: <FiMail size={14} />,         bg: "#FFFBEB", text: "#B45309",  dot: "#D97706" },
};

const TABS = ["All", "Unread", "Leads", "Messages", "Alerts", "System"];

const PREF_ITEMS = [
  { key: "lead",       label: "New Leads",        desc: "When a new lead submits the contact form" },
  { key: "message",    label: "Messages",          desc: "New messages from leads or clients" },
  { key: "alert",      label: "System Alerts",     desc: "Server issues, high usage, security events" },
  { key: "system",     label: "System Events",     desc: "Backups, SSL, deployments" },
  { key: "blog",       label: "Blog Updates",      desc: "Published posts and milestones" },
  { key: "newsletter", label: "Newsletter Reports",desc: "Campaign delivery reports" },
];

function NotiIcon({ item }) {
  const meta = TYPE_META[item.type];
  if (item.avatar) {
    return (
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: item.avatarColor, color: item.avatarText, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, border: `1.5px solid ${item.avatarText}22` }}>
        {item.avatar}
      </div>
    );
  }
  return (
    <div style={{ width: 40, height: 40, borderRadius: "50%", background: meta.bg, color: meta.text, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {meta.icon}
    </div>
  );
}

export default function Notifications() {
  const [items, setItems] = useState(INITIAL);
  const [tab, setTab] = useState("All");
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState({ lead: true, message: true, alert: true, system: true, blog: false, newsletter: true });
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    notificationsApi.list({ limit: 100 }).then((d) => {
      const list = (Array.isArray(d) ? d : (d?.data || [])).map((n) => ({
        ...n, id: n._id, read: n.isRead,
        time: n.createdAt ? new Date(n.createdAt).toLocaleString() : "",
      }));
      if (list.length) setItems(list);
    }).catch(() => null);
  }, []);

  const unreadCount = items.filter(i => !i.read).length;

  const filtered = items.filter(i => {
    if (tab === "Unread") return !i.read;
    if (tab === "Leads") return i.type === "lead";
    if (tab === "Messages") return i.type === "message";
    if (tab === "Alerts") return i.type === "alert";
    if (tab === "System") return i.type === "system";
    return true;
  });

  const markRead = (id) => setItems(is => is.map(i => i.id === id ? { ...i, read: true } : i));
  const markAllRead = () => setItems(is => is.map(i => ({ ...i, read: true })));
  const deleteItem = (id) => setItems(is => is.filter(i => i.id !== id));
  const deleteSelected = () => { setItems(is => is.filter(i => !selected.includes(i.id))); setSelected([]); };
  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const togglePin = (id) => setItems(is => is.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i));

  const pinned = filtered.filter(i => i.pinned);
  const rest = filtered.filter(i => !i.pinned);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F7F8FC", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #EAEDF2", padding: "20px 28px 0", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <FiBell size={22} color="#131626" />
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: -5, right: -6, background: "#E11D48", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 5px", minWidth: 16, textAlign: "center", lineHeight: "16px" }}>{unreadCount}</span>
              )}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#131626" }}>Notifications</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#7E8A9A" }}>
                {unreadCount > 0 ? <><span style={{ color: "#2563EB", fontWeight: 600 }}>{unreadCount} unread</span> · {items.length} total</> : `All caught up · ${items.length} total`}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {selected.length > 0 && (
              <button onClick={deleteSelected} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#FFF0F2", color: "#C8203E", border: "1px solid #F5C0CC", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                <FiTrash2 size={13} /> Delete {selected.length}
              </button>
            )}
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#EEF6FF", color: "#2563EB", border: "1px solid #BFDBFE", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                <FiCheckCircle size={13} /> Mark all read
              </button>
            )}
            <button onClick={() => setShowPrefs(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#F7F8FC", color: "#4B5563", border: "1px solid #EAEDF2", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <FiSettings size={13} /> Preferences
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {TABS.map(t => {
            const cnt = t === "All" ? items.length
              : t === "Unread" ? unreadCount
              : items.filter(i => i.type === t.toLowerCase()).length;
            const active = tab === t;
            return (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 16px", background: "none", border: "none", borderBottom: `2.5px solid ${active ? "#2563EB" : "transparent"}`, cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#2563EB" : "#6B7280", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
                {t}
                {cnt > 0 && <span style={{ background: active ? "#2563EB" : "#F1F3F8", color: active ? "#fff" : "#9099A8", borderRadius: 10, padding: "1px 6px", fontSize: 11, fontWeight: 700 }}>{cnt}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 28px", maxWidth: 860 }}>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#A0AEC0" }}>
            <FiBell size={44} style={{ opacity: 0.25, marginBottom: 14 }} />
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#9099A8" }}>No notifications here</p>
            <p style={{ margin: "6px 0 0", fontSize: 13 }}>You're all caught up!</p>
          </div>
        ) : (
          <>
            {/* Pinned */}
            {pinned.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <FiStar size={12} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9099A8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pinned</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, background: "#fff", borderRadius: 12, border: "1px solid #FDE68A", overflow: "hidden" }}>
                  {pinned.map(item => <NotiRow key={item.id} item={item} selected={selected} toggleSelect={toggleSelect} markRead={markRead} deleteItem={deleteItem} togglePin={togglePin} />)}
                </div>
              </div>
            )}

            {/* Rest grouped by read status */}
            {rest.filter(i => !i.read).length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9099A8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Unread</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, background: "#fff", borderRadius: 12, border: "1px solid #EAEDF2", overflow: "hidden" }}>
                  {rest.filter(i => !i.read).map(item => <NotiRow key={item.id} item={item} selected={selected} toggleSelect={toggleSelect} markRead={markRead} deleteItem={deleteItem} togglePin={togglePin} />)}
                </div>
              </div>
            )}

            {rest.filter(i => i.read).length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <FiCheckCircle size={12} color="#9099A8" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9099A8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Earlier</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, background: "#fff", borderRadius: 12, border: "1px solid #EAEDF2", overflow: "hidden" }}>
                  {rest.filter(i => i.read).map(item => <NotiRow key={item.id} item={item} selected={selected} toggleSelect={toggleSelect} markRead={markRead} deleteItem={deleteItem} togglePin={togglePin} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Preferences Modal */}
      {showPrefs && (
        <div onClick={() => setShowPrefs(false)} style={{ position: "fixed", inset: 0, background: "rgba(10,12,28,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "min(94vw, 480px)", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.22)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #EAEDF2" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#131626" }}>Notification Preferences</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9099A8" }}>Choose which notifications you receive</p>
              </div>
              <button onClick={() => setShowPrefs(false)} style={{ padding: 6, background: "#F7F8FC", border: "1px solid #EAEDF2", borderRadius: 7, cursor: "pointer", color: "#6B7280", display: "flex" }}>
                <FiX size={15} />
              </button>
            </div>
            <div style={{ padding: "8px 0" }}>
              {PREF_ITEMS.map(p => (
                <div key={p.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px", borderBottom: "1px solid #F5F6FA" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: TYPE_META[p.key].bg, color: TYPE_META[p.key].text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {TYPE_META[p.key].icon}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1E2535" }}>{p.label}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#9099A8" }}>{p.desc}</p>
                    </div>
                  </div>
                  <Toggle on={prefs[p.key]} onChange={v => setPrefs(x => ({ ...x, [p.key]: v }))} />
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 22px", borderTop: "1px solid #EAEDF2", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setShowPrefs(false)} style={{ padding: "8px 20px", background: "#F7F8FC", border: "1px solid #EAEDF2", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#4B5563", fontWeight: 600 }}>Cancel</button>
              <button onClick={() => setShowPrefs(false)} style={{ padding: "8px 20px", background: "#2563EB", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#fff", fontWeight: 600 }}>Save preferences</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{ width: 40, height: 22, borderRadius: 11, background: on ? "#2563EB" : "#D1D5DB", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

function NotiRow({ item, selected, toggleSelect, markRead, deleteItem, togglePin }) {
  const [hovered, setHovered] = useState(false);
  const meta = TYPE_META[item.type];
  const isSelected = selected.includes(item.id);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !item.read && markRead(item.id)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 18px",
        background: isSelected ? "#EEF6FF" : !item.read ? "#FAFCFF" : "#fff",
        borderLeft: `3px solid ${!item.read ? meta.dot : "transparent"}`,
        cursor: item.read ? "default" : "pointer",
        transition: "background 0.12s",
        position: "relative",
      }}
    >
      {/* Checkbox */}
      <div
        onClick={e => { e.stopPropagation(); toggleSelect(item.id); }}
        style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${isSelected ? "#2563EB" : hovered ? "#C0C8D8" : "transparent"}`, background: isSelected ? "#2563EB" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 13, cursor: "pointer", transition: "all 0.12s" }}
      >
        {isSelected && <FiCheck size={10} color="#fff" />}
      </div>

      <NotiIcon item={item} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
              <span style={{ fontSize: 13, fontWeight: item.read ? 500 : 700, color: "#131626" }}>{item.title}</span>
              <span style={{ fontSize: 11, background: meta.bg, color: meta.text, borderRadius: 5, padding: "2px 7px", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                {meta.icon} {meta.label}
              </span>
              {!item.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.dot, display: "inline-block" }} />}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>{item.desc}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: "#9099A8", whiteSpace: "nowrap" }}>{item.time}</span>
            {hovered && (
              <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => togglePin(item.id)} title={item.pinned ? "Unpin" : "Pin"} style={{ padding: "4px 7px", background: item.pinned ? "#FFFBEB" : "#F7F8FC", border: `1px solid ${item.pinned ? "#FDE68A" : "#EAEDF2"}`, borderRadius: 6, cursor: "pointer", color: item.pinned ? "#F59E0B" : "#9099A8", display: "flex" }}>
                  <FiStar size={12} fill={item.pinned ? "#F59E0B" : "none"} />
                </button>
                {!item.read && (
                  <button onClick={() => markRead(item.id)} title="Mark read" style={{ padding: "4px 7px", background: "#F7F8FC", border: "1px solid #EAEDF2", borderRadius: 6, cursor: "pointer", color: "#9099A8", display: "flex" }}>
                    <FiCheck size={12} />
                  </button>
                )}
                <button onClick={() => deleteItem(item.id)} title="Delete" style={{ padding: "4px 7px", background: "#FFF0F2", border: "1px solid #F5C0CC", borderRadius: 6, cursor: "pointer", color: "#C8203E", display: "flex" }}>
                  <FiTrash2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}