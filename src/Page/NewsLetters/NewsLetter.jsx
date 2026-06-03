import { useState, useMemo, useEffect } from "react";
import { subscribersApi } from "../../services/api";
import {
  RiMailSendLine, RiAddLine, RiSearchLine, RiCloseLine,
  RiEditLine, RiDeleteBinLine, RiDownloadLine, RiRefreshLine,
  RiCheckLine, RiUserLine, RiMailLine, RiCalendarLine,
  RiArrowUpLine, RiArrowDownLine, RiGlobalLine,
  RiSpamLine, RiUserUnfollowLine, RiUserFollowLine,
  RiFileExcel2Line, RiFilter3Line,
} from "react-icons/ri";

// ─── Config ──────────────────────────────────────────────────────────
const STATUSES  = ["Subscribed", "Unsubscribed", "Bounced"];
const SOURCES   = ["Website Form", "Blog Popup", "Landing Page", "Manual", "Import"];
const TAGS      = ["General", "SEO Blog", "Design Tips", "Case Study", "Offers"];

const STATUS_CFG = {
  Subscribed:   { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0", dot: "#10b981" },
  Unsubscribed: { bg: "#f1f5f9", color: "#64748b", border: "#cbd5e1", dot: "#94a3b8" },
  Bounced:      { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", dot: "#ef4444" },
};

const SOURCE_ICON = {
  "Website Form": "🌐", "Blog Popup": "📝", "Landing Page": "🚀",
  "Manual": "✍️", "Import": "📥",
};

const AV_COLORS = ["#f97316","#6366f1","#10b981","#e11d48","#0ea5e9","#8b5cf6","#f59e0b","#14b8a6"];
const avColor  = (n) => AV_COLORS[n.charCodeAt(0) % AV_COLORS.length];
const initials = (n) => n.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
const fmtDate  = (d) => new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
const timeAgo  = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

const EMPTY_FORM = { name:"", email:"", status:"Subscribed", source:"Website Form", tag:"General", joined: new Date().toISOString().split("T")[0] };

function Av({ name, size=34 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:avColor(name), color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:size*0.3, flexShrink:0 }}>
      {initials(name)}
    </div>
  );
}

function StatusPill({ status }) {
  const c = STATUS_CFG[status];
  return (
    <span style={{ background:c.bg, color:c.color, border:`1px solid ${c.border}`, fontSize:11, fontWeight:600, borderRadius:20, padding:"2px 9px", display:"inline-flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot }} />{status}
    </span>
  );
}

function TagChip({ tag }) {
  return (
    <span style={{ background:"#f1f5f9", color:"#475569", fontSize:11, fontWeight:600, borderRadius:6, padding:"2px 8px" }}>{tag}</span>
  );
}

export default function NewsletterSection() {
  const [subs,       setSubs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [statusF,    setStatusF]    = useState("all");
  const [sourceF,    setSourceF]    = useState("all");
  const [tagF,       setTagF]       = useState("all");
  const [modal,      setModal]      = useState(false);
  const [editSub,    setEditSub]    = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [delConfirm, setDelConfirm] = useState(null);
  const [selIds,     setSelIds]     = useState([]);
  const [sortCol,    setSortCol]    = useState("updated");
  const [sortAsc,    setSortAsc]    = useState(false);

  const F = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const data = await subscribersApi.list({ limit: 200 });
      const list = (Array.isArray(data) ? data : (data?.data || [])).map((s) => ({
        ...s, id: s._id,
        name: s.name || s.email?.split("@")[0] || "Subscriber",
        updated: s.updatedAt || s.subscribedAt || s.createdAt,
      }));
      setSubs(list);
    } catch (e) { setSubs([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchSubs(); }, []);

  const filtered = useMemo(() => {
    let r = subs.filter(s => {
      const q = search.toLowerCase();
      const mq = !q || [s.name, s.email, s.tag, s.source].some(v => v.toLowerCase().includes(q));
      return mq
        && (statusF === "all" || s.status === statusF)
        && (sourceF === "all" || s.source === sourceF)
        && (tagF    === "all" || s.tag    === tagF);
    });
    r = [...r].sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1  : -1;
      return 0;
    });
    return r;
  }, [subs, search, statusF, sourceF, tagF, sortCol, sortAsc]);

  const openAdd  = () => { setEditSub(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (s, e) => { e.stopPropagation(); setEditSub(s); setForm({...s}); setModal(true); };
  const closeModal = () => { setModal(false); setEditSub(null); };

  const save = async () => {
    if (!form.email?.trim()) return;
    if (editSub) {
      setSubs(p => p.map(s => s.id === editSub.id ? { ...s, ...form } : s));
      try { await subscribersApi.update(editSub.id, form); } catch (e) { console.error(e); }
    } else {
      try {
        const created = await subscribersApi.legacyNew({ email: form.email, name: form.name, source: form.source, tag: form.tag });
        const nc = { ...form, id: created?._id || Date.now(), updated: new Date().toISOString(), ...(created || {}) };
        setSubs(p => [...p, nc]);
      } catch (e) { console.error(e); }
    }
    closeModal();
  };

  const del = async (id) => {
    setSubs(p => p.filter(s => s.id !== id));
    setDelConfirm(null);
    try { await subscribersApi.remove(id); } catch (e) { console.error(e); }
  };
  const bulkDel = async () => {
    const ids = [...selIds];
    setSubs(p => p.filter(s => !ids.includes(s.id)));
    setSelIds([]);
    for (const id of ids) { try { await subscribersApi.remove(id); } catch {} }
  };

  const allSel   = filtered.length > 0 && filtered.every(s => selIds.includes(s.id));
  const toggleAll = () => setSelIds(allSel ? [] : filtered.map(s => s.id));
  const toggleSel = (id, e) => { e.stopPropagation(); setSelIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); };

  const sort = (col) => { if (sortCol === col) setSortAsc(p => !p); else { setSortCol(col); setSortAsc(true); } };
  const SortIco = ({ col }) => sortCol !== col ? null : sortAsc ? <RiArrowUpLine size={10} /> : <RiArrowDownLine size={10} />;

  // Stats
  const total   = subs.length;
  const active  = subs.filter(s => s.status === "Subscribed").length;
  const unsub   = subs.filter(s => s.status === "Unsubscribed").length;
  const bounced = subs.filter(s => s.status === "Bounced").length;
  const rate    = total > 0 ? Math.round((active / total) * 100) : 0;

  const STATS = [
    { label:"Total Subscribers", value: total,            color:"#6366f1", bg:"#eef2ff",  icon: <RiMailSendLine size={20}/> },
    { label:"Active",            value: active,           color:"#10b981", bg:"#ecfdf5",  icon: <RiUserFollowLine size={20}/> },
    { label:"Unsubscribed",      value: unsub,            color:"#64748b", bg:"#f1f5f9",  icon: <RiUserUnfollowLine size={20}/> },
    { label:"Bounced",           value: bounced,          color:"#ef4444", bg:"#fef2f2",  icon: <RiSpamLine size={20}/> },
  ];

  const TH = ({ col, label }) => (
    <th onClick={() => sort(col)} style={{ padding:"10px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.5, whiteSpace:"nowrap", cursor:"pointer", userSelect:"none" }}>
      <span style={{ display:"inline-flex", alignItems:"center", gap:3 }}>{label}<SortIco col={col}/></span>
    </th>
  );

  const inputStyle = { border:"1px solid #e2e8f0", borderRadius:9, padding:"8px 12px", fontSize:13, color:"#1e293b", background:"#fafafa", outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" };
  const selStyle   = { ...inputStyle, cursor:"pointer" };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:16 }}>

      {/* ── Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
        <div>
          <p style={{ fontSize:12, color:"#94a3b8", margin:"0 0 2px" }}>
            Dashboard / <span style={{ color:"#f97316" }}>Newsletter Subs</span>
          </p>
          <h1 style={{ margin:0, fontSize:22, fontWeight:700, color:"#1e293b", letterSpacing:"-0.3px" }}>Newsletter Subscribers</h1>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={fetchSubs} style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"1px solid #e2e8f0", borderRadius:8, padding:"7px 12px", cursor:"pointer", color:"#64748b", fontSize:12 }}>
            <RiRefreshLine size={13}/> Refresh
          </button>
          <button style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"1px solid #e2e8f0", borderRadius:8, padding:"7px 12px", cursor:"pointer", color:"#64748b", fontSize:12 }}>
            <RiDownloadLine size={13}/> Export CSV
          </button>
          <button onClick={openAdd} style={{ display:"flex", alignItems:"center", gap:5, background:"#f97316", color:"#fff", border:"none", borderRadius:9, padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:700 }}>
            <RiAddLine size={15}/> Add Subscriber
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", padding:"16px 18px", display:"flex", alignItems:"center", gap:14, position:"relative", overflow:"hidden" }}>
            <div style={{ width:46, height:46, borderRadius:12, background:s.bg, color:s.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ margin:0, fontSize:22, fontWeight:800, color:s.color, letterSpacing:"-0.5px", lineHeight:1 }}>{s.value}</p>
              <p style={{ margin:"3px 0 0", fontSize:12, color:"#94a3b8", fontWeight:500 }}>{s.label}</p>
            </div>
            <div style={{ position:"absolute", right:0, top:0, bottom:0, width:4, background:s.color, opacity:0.25, borderRadius:"0 14px 14px 0" }}/>
          </div>
        ))}
      </div>

      {/* ── Health Bar ── */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #f1f5f9", padding:"14px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#475569" }}>List Health</span>
          <span style={{ fontSize:13, fontWeight:800, color: rate >= 70 ? "#059669" : rate >= 40 ? "#d97706" : "#dc2626" }}>{rate}% Active</span>
        </div>
        <div style={{ height:8, background:"#f1f5f9", borderRadius:99, overflow:"hidden", display:"flex" }}>
          <div style={{ width:`${rate}%`, background: rate >= 70 ? "#10b981" : rate >= 40 ? "#f59e0b" : "#ef4444", borderRadius:"99px 0 0 99px", transition:"width 0.4s" }}/>
          <div style={{ width:`${Math.round((unsub/total)*100)}%`, background:"#94a3b8" }}/>
          <div style={{ flex:1, background:"#fecaca" }}/>
        </div>
        <div style={{ display:"flex", gap:16, marginTop:8 }}>
          {[["#10b981","Subscribed",active],["#94a3b8","Unsubscribed",unsub],["#ef4444","Bounced",bounced]].map(([c,l,v]) => (
            <span key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#94a3b8" }}>
              <span style={{ width:8,height:8,borderRadius:"50%",background:c }}/>{l} ({v})
            </span>
          ))}
        </div>
      </div>

      {/* ── Filters + Table ── */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>

        {/* Toolbar */}
        <div style={{ display:"flex", gap:8, padding:"12px 16px", borderBottom:"1px solid #f1f5f9", flexWrap:"wrap", alignItems:"center" }}>
          {/* Search */}
          <div style={{ flex:1, minWidth:180, display:"flex", alignItems:"center", gap:8, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:9, padding:"7px 12px" }}>
            <RiSearchLine size={14} style={{ color:"#94a3b8", flexShrink:0 }}/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, tag…"
              style={{ border:"none", outline:"none", fontSize:13, color:"#374151", width:"100%", background:"none" }}/>
            {search && <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", padding:0 }}><RiCloseLine size={14}/></button>}
          </div>

          {/* Filters */}
          {[
            { val:statusF, set:setStatusF, opts:["all",...STATUSES],  placeholder:"All Status"  },
            { val:sourceF, set:setSourceF, opts:["all",...SOURCES],   placeholder:"All Sources" },
            { val:tagF,    set:setTagF,    opts:["all",...TAGS],      placeholder:"All Tags"    },
          ].map((f, i) => (
            <select key={i} value={f.val} onChange={e => f.set(e.target.value)}
              style={{ border:"1px solid #e2e8f0", borderRadius:9, padding:"8px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" }}>
              {f.opts.map(o => <option key={o} value={o}>{o === "all" ? f.placeholder : o}</option>)}
            </select>
          ))}

          {selIds.length > 0 && (
            <button onClick={bulkDel} style={{ display:"flex", alignItems:"center", gap:4, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:9, padding:"7px 12px", cursor:"pointer", fontSize:12, fontWeight:700 }}>
              <RiDeleteBinLine size={13}/> Delete ({selIds.length})
            </button>
          )}

          <span style={{ fontSize:11, color:"#94a3b8", marginLeft:"auto", fontWeight:500 }}>
            {filtered.length} subscriber{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div style={{ flex:1, overflowY:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"#f8fafc", position:"sticky", top:0, zIndex:1 }}>
                <th style={{ width:40, padding:"10px 14px", textAlign:"center" }}>
                  <input type="checkbox" checked={allSel} onChange={toggleAll} style={{ cursor:"pointer" }}/>
                </th>
                <TH col="name"    label="Subscriber"/>
                <TH col="status"  label="Status"/>
                <TH col="tag"     label="Tag"/>
                <TH col="source"  label="Source"/>
                <TH col="joined"  label="Joined"/>
                <TH col="updated" label="Last Activity"/>
                <th style={{ padding:"10px 12px", fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.5 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subs.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign:"center", padding:52, color:"#cbd5e1" }}>
                  <RiMailSendLine size={40} style={{ display:"block", margin:"0 auto 8px" }}/>
                  Data not available
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign:"center", padding:52, color:"#cbd5e1" }}>
                  <RiMailSendLine size={40} style={{ display:"block", margin:"0 auto 8px" }}/>
                  No subscribers found
                </td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id} style={{ borderBottom:"1px solid #f8fafc", background: selIds.includes(s.id) ? "#fff7ed" : i%2===0 ? "#fff" : "#fafafa", transition:"background 0.1s" }}
                  onMouseEnter={e => { if (!selIds.includes(s.id)) e.currentTarget.style.background="#f0f9ff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = selIds.includes(s.id) ? "#fff7ed" : i%2===0 ? "#fff" : "#fafafa"; }}
                >
                  <td style={{ padding:"10px 14px", textAlign:"center" }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selIds.includes(s.id)} onChange={e => toggleSel(s.id, e)} style={{ cursor:"pointer" }}/>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Av name={s.name} size={34}/>
                      <div>
                        <p style={{ margin:0, fontWeight:600, color:"#1e293b", fontSize:13 }}>{s.name}</p>
                        <a href={`mailto:${s.email}`} style={{ fontSize:11, color:"#6366f1", textDecoration:"none" }}>{s.email}</a>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"10px 12px" }}><StatusPill status={s.status}/></td>
                  <td style={{ padding:"10px 12px" }}><TagChip tag={s.tag}/></td>
                  <td style={{ padding:"10px 12px", fontSize:12, color:"#64748b" }}>{SOURCE_ICON[s.source]} {s.source}</td>
                  <td style={{ padding:"10px 12px", fontSize:12, color:"#64748b", whiteSpace:"nowrap" }}>{fmtDate(s.joined)}</td>
                  <td style={{ padding:"10px 12px", fontSize:11, color:"#94a3b8", whiteSpace:"nowrap" }}>{timeAgo(s.updated)}</td>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ display:"flex", gap:4 }}>
                      <button onClick={e => openEdit(s,e)} style={{ background:"#eff6ff", border:"none", borderRadius:7, padding:"5px 8px", cursor:"pointer", color:"#2563eb", display:"flex", alignItems:"center" }}><RiEditLine size={13}/></button>
                      <button onClick={e => { e.stopPropagation(); setDelConfirm(s); }} style={{ background:"#fef2f2", border:"none", borderRadius:7, padding:"5px 8px", cursor:"pointer", color:"#dc2626", display:"flex", alignItems:"center" }}><RiDeleteBinLine size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={closeModal}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:16, width:460, maxWidth:"95vw", boxShadow:"0 24px 64px rgba(0,0,0,0.18)", overflow:"hidden" }}>
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #f1f5f9" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <RiMailSendLine size={17} style={{ color:"#f97316" }}/>
                <span style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>{editSub ? "Edit Subscriber" : "Add Subscriber"}</span>
              </div>
              <button onClick={closeModal} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8" }}><RiCloseLine size={20}/></button>
            </div>

            {/* Body */}
            <div style={{ padding:"20px", display:"flex", flexDirection:"column", gap:13 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Full Name *</label>
                <input value={form.name} onChange={e => F("name",e.target.value)} placeholder="Enter name" style={inputStyle}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Email Address *</label>
                <input value={form.email} onChange={e => F("email",e.target.value)} placeholder="subscriber@example.com" style={inputStyle}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Status</label>
                  <select value={form.status} onChange={e => F("status",e.target.value)} style={selStyle}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Source</label>
                  <select value={form.source} onChange={e => F("source",e.target.value)} style={selStyle}>
                    {SOURCES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Tag</label>
                  <select value={form.tag} onChange={e => F("tag",e.target.value)} style={selStyle}>
                    {TAGS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Joined Date</label>
                  <input type="date" value={form.joined} onChange={e => F("joined",e.target.value)} style={inputStyle}/>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8, padding:"14px 20px", borderTop:"1px solid #f1f5f9" }}>
              <button onClick={closeModal} style={{ background:"none", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 18px", cursor:"pointer", fontSize:13, color:"#64748b" }}>Cancel</button>
              <button onClick={save} style={{ display:"flex", alignItems:"center", gap:5, background:(!form.name.trim()||!form.email.trim())?"#fed7aa":"#f97316", color:"#fff", border:"none", borderRadius:9, padding:"8px 22px", cursor:"pointer", fontSize:13, fontWeight:700 }}>
                <RiCheckLine size={14}/> {editSub ? "Save Changes" : "Add Subscriber"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {delConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={() => setDelConfirm(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:16, width:360, padding:"28px 24px", textAlign:"center", boxShadow:"0 24px 64px rgba(0,0,0,0.15)" }}>
            <div style={{ width:52, height:52, background:"#fef2f2", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <RiDeleteBinLine size={24} style={{ color:"#dc2626" }}/>
            </div>
            <h3 style={{ margin:"0 0 6px", fontSize:16, fontWeight:700, color:"#1e293b" }}>Remove Subscriber?</h3>
            <p style={{ margin:"0 0 22px", fontSize:13, color:"#64748b" }}>
              Remove <strong>{delConfirm.name}</strong> from your list? This cannot be undone.
            </p>
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              <button onClick={() => setDelConfirm(null)} style={{ background:"none", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 20px", cursor:"pointer", fontSize:13, color:"#64748b" }}>Cancel</button>
              <button onClick={() => del(delConfirm.id)} style={{ background:"#dc2626", color:"#fff", border:"none", borderRadius:8, padding:"8px 22px", cursor:"pointer", fontSize:13, fontWeight:700 }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}