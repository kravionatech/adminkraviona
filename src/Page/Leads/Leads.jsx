import { useState, useMemo } from "react";
import {
  RiUserStarLine, RiAddLine, RiSearchLine, RiFilterLine,
  RiCloseLine, RiEditLine, RiDeleteBinLine, RiPhoneLine,
  RiMailLine, RiMapPinLine, RiTimeLine, RiCheckLine,
  RiDownloadLine, RiRefreshLine, RiEyeLine, RiFilter3Line, 
  RiArrowUpLine, RiArrowDownLine, RiCalendarLine,
  RiWhatsappLine, RiBriefcaseLine, RiMoneyRupeeCircleLine,
  RiBarChartLine, RiArrowRightLine, RiStickyNoteLine,
} from "react-icons/ri";

// ─── Data ────────────────────────────────────────────────────────────
const STAGES   = ["New", "Contacted", "Qualified", "Proposal", "Closed Won", "Closed Lost"];
const SOURCES  = ["Website", "Referral", "Instagram", "Google Ads", "WhatsApp", "LinkedIn", "Cold Call"];
const SERVICES = ["Web Design", "SEO", "Branding", "App Dev", "Social Media", "Content", "Ads"];

const STAGE_CFG = {
  "New":          { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", dot: "#3b82f6" },
  "Contacted":    { bg: "#faf5ff", color: "#7c3aed", border: "#ddd6fe", dot: "#8b5cf6" },
  "Qualified":    { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa", dot: "#f97316" },
  "Proposal":     { bg: "#fefce8", color: "#a16207", border: "#fde68a", dot: "#eab308" },
  "Closed Won":   { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0", dot: "#10b981" },
  "Closed Lost":  { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", dot: "#ef4444" },
};

const SOURCE_ICONS = {
  Website: "🌐", Referral: "🤝", Instagram: "📸",
  "Google Ads": "🔍", WhatsApp: "💬", LinkedIn: "💼", "Cold Call": "📞",
};

const AV_COLORS = ["#f97316","#6366f1","#10b981","#e11d48","#0ea5e9","#8b5cf6","#f59e0b","#14b8a6","#ec4899","#3b82f6"];
const avColor = (n) => AV_COLORS[n.charCodeAt(0) % AV_COLORS.length];
const initials = (n) => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const fmtDate  = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const timeAgo  = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};
const fmtBudget = (v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}K`;

const SEED = [
  { id:1,  name:"Arjun Mehta",    email:"arjun@startup.in",      phone:"+91 98001 11111", city:"Mumbai",    stage:"Qualified",    source:"Website",    service:"Web Design",   budget:85000,  note:"Wants ecom site for clothing brand",  date:"2025-05-28", updated:"2025-06-01T08:10:00" },
  { id:2,  name:"Priya Nair",     email:"priya@fintech.io",      phone:"+91 87002 22222", city:"Bangalore", stage:"Proposal",     source:"LinkedIn",   service:"SEO",          budget:240000, note:"3-month SEO retainer, fintech keywords", date:"2025-05-25", updated:"2025-05-31T14:00:00" },
  { id:3,  name:"Rohan Sharma",   email:"rohan@eatout.com",      phone:"+91 76003 33333", city:"Delhi",     stage:"Contacted",    source:"Referral",   service:"Branding",     budget:30000,  note:"Restaurant branding — logo + menu",    date:"2025-05-30", updated:"2025-05-30T11:30:00" },
  { id:4,  name:"Sneha Kulkarni", email:"sneha@appideas.in",     phone:"+91 65004 44444", city:"Pune",      stage:"Closed Won",   source:"Instagram",  service:"App Dev",      budget:350000, note:"Food delivery MVP, wireframes ready",  date:"2025-05-20", updated:"2025-05-29T16:45:00" },
  { id:5,  name:"Vikram Joshi",   email:"vikram@consult.com",    phone:"+91 54005 55555", city:"Hyderabad", stage:"New",          source:"Google Ads", service:"Social Media", budget:15000,  note:"LinkedIn + Insta for consulting firm", date:"2025-06-01", updated:"2025-06-01T09:00:00" },
  { id:6,  name:"Anjali Patel",   email:"anjali@photo.art",      phone:"+91 43006 66666", city:"Ahmedabad", stage:"Closed Lost",  source:"WhatsApp",   service:"Web Design",   budget:12000,  note:"Portfolio site — budget too low",      date:"2025-05-15", updated:"2025-05-22T10:00:00" },
  { id:7,  name:"Deepak Verma",   email:"deepak@realestate.in",  phone:"+91 32007 77777", city:"Noida",     stage:"Qualified",    source:"Cold Call",  service:"Ads",          budget:50000,  note:"Meta ads for property listings",       date:"2025-05-27", updated:"2025-05-31T12:00:00" },
  { id:8,  name:"Kavitha Reddy",  email:"kavitha@edu.org",       phone:"+91 21008 88888", city:"Chennai",   stage:"Proposal",     source:"Referral",   service:"Content",      budget:40000,  note:"Blog + YouTube scripts for ed-tech",   date:"2025-05-22", updated:"2025-05-30T15:00:00" },
  { id:9,  name:"Manish Gupta",   email:"manish@saas.co",        phone:"+91 99009 99999", city:"Gurugram",  stage:"Contacted",    source:"LinkedIn",   service:"SEO",          budget:120000, note:"SaaS product — need 10 keywords page 1", date:"2025-05-29", updated:"2025-05-29T08:00:00" },
  { id:10, name:"Ritika Shah",    email:"ritika@fashion.in",     phone:"+91 88010 10101", city:"Surat",     stage:"New",          source:"Instagram",  service:"Branding",     budget:25000,  note:"Fashion brand rebranding",             date:"2025-06-01", updated:"2025-06-01T07:30:00" },
];

const EMPTY_FORM = { name:"", email:"", phone:"", city:"", stage:"New", source:"Website", service:"Web Design", budget:"", note:"", date: new Date().toISOString().split("T")[0] };

// ─── Sub-components ──────────────────────────────────────────────────
function Av({ name, size=36 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:avColor(name), color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:size*0.3, flexShrink:0 }}>
      {initials(name)}
    </div>
  );
}
function StagePill({ stage }) {
  const c = STAGE_CFG[stage] || STAGE_CFG["New"];
  return (
    <span style={{ background:c.bg, color:c.color, border:`1px solid ${c.border}`, fontSize:11, fontWeight:600, borderRadius:20, padding:"2px 9px", display:"inline-flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:c.dot }} />{stage}
    </span>
  );
}
function Input({ label, icon, ...props }) {
  return (
    <div>
      {label && <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>{label}</label>}
      <div style={{ display:"flex", alignItems:"center", gap:8, border:"1px solid #e2e8f0", borderRadius:9, padding:"8px 12px", background:"#fafafa" }}>
        {icon && <span style={{ color:"#94a3b8", flexShrink:0 }}>{icon}</span>}
        <input {...props} style={{ border:"none", outline:"none", fontSize:13, width:"100%", color:"#1e293b", background:"none" }} />
      </div>
    </div>
  );
}
function Sel({ label, children, ...props }) {
  return (
    <div>
      {label && <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>{label}</label>}
      <select {...props} style={{ width:"100%", border:"1px solid #e2e8f0", borderRadius:9, padding:"9px 12px", fontSize:13, color:"#1e293b", background:"#fafafa", outline:"none", cursor:"pointer" }}>
        {children}
      </select>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function LeadsPage() {
  const [leads,      setLeads]      = useState(SEED);
  const [search,     setSearch]     = useState("");
  const [stageF,     setStageF]     = useState("all");
  const [sourceF,    setSourceF]    = useState("all");
  const [serviceF,   setServiceF]   = useState("all");
  const [view,       setView]       = useState("table");   // "table" | "kanban"
  const [modal,      setModal]      = useState(false);
  const [editLead,   setEditLead]   = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [delConfirm, setDelConfirm] = useState(null);
  const [detailLead, setDetailLead] = useState(null);
  const [sortCol,    setSortCol]    = useState("updated");
  const [sortAsc,    setSortAsc]    = useState(false);
  const [selIds,     setSelIds]     = useState([]);

  const F = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const filtered = useMemo(() => {
    let r = leads.filter(l => {
      const q = search.toLowerCase();
      const mq = !q || [l.name,l.email,l.phone,l.city,l.service,l.note].some(v => v.toLowerCase().includes(q));
      return mq
        && (stageF   === "all" || l.stage   === stageF)
        && (sourceF  === "all" || l.source  === sourceF)
        && (serviceF === "all" || l.service === serviceF);
    });
    r = [...r].sort((a,b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (sortCol === "budget") { va = +va; vb = +vb; }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1  : -1;
      return 0;
    });
    return r;
  }, [leads, search, stageF, sourceF, serviceF, sortCol, sortAsc]);

  const openAdd  = () => { setEditLead(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (l, e) => { e.stopPropagation(); setEditLead(l); setForm({...l, budget: String(l.budget)}); setModal(true); };
  const closeModal = () => { setModal(false); setEditLead(null); };

  const saveLead = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const now = new Date().toISOString();
    if (editLead) {
      setLeads(p => p.map(l => l.id === editLead.id ? {...l, ...form, budget: +form.budget || 0, updated: now} : l));
    } else {
      setLeads(p => [...p, {...form, id: Date.now(), budget: +form.budget || 0, updated: now}]);
    }
    closeModal();
  };
  const delLead = (id) => { setLeads(p => p.filter(l => l.id !== id)); setDelConfirm(null); setDetailLead(null); };
  const bulkDel = () => { setLeads(p => p.filter(l => !selIds.includes(l.id))); setSelIds([]); };

  const sort = (col) => { if (sortCol === col) setSortAsc(p => !p); else { setSortCol(col); setSortAsc(true); } };
  const SortIcon = ({ col }) => sortCol !== col ? null : sortAsc ? <RiArrowUpLine size={11} /> : <RiArrowDownLine size={11} />;

  const allSel = filtered.length > 0 && filtered.every(l => selIds.includes(l.id));
  const toggleAll = () => setSelIds(allSel ? [] : filtered.map(l => l.id));
  const toggleSel = (id, e) => { e.stopPropagation(); setSelIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); };

  // Stats
  const totalBudget = leads.filter(l => l.stage === "Closed Won").reduce((s,l) => s + l.budget, 0);
  const pipeline    = leads.filter(l => !["Closed Won","Closed Lost"].includes(l.stage)).reduce((s,l) => s + l.budget, 0);

  const STATS = [
    { label:"Total Leads",    value: leads.length,                                                  color:"#6366f1", bg:"#eef2ff",  icon: <RiUserStarLine size={20} /> },
    { label:"Pipeline Value", value: fmtBudget(pipeline),                                           color:"#f97316", bg:"#fff7ed",  icon: <RiBarChartLine size={20} /> },
    { label:"Closed Won",     value: leads.filter(l => l.stage === "Closed Won").length,            color:"#10b981", bg:"#ecfdf5",  icon: <RiCheckLine size={20} /> },
    { label:"Won Revenue",    value: fmtBudget(totalBudget),                                        color:"#059669", bg:"#d1fae5",  icon: <RiMoneyRupeeCircleLine size={20} /> },
  ];

  // Kanban groups
  const kanbanGroups = STAGES.map(s => ({ stage: s, leads: filtered.filter(l => l.stage === s) }));

  const TH = ({ col, label, style={} }) => (
    <th onClick={() => sort(col)} style={{ padding:"10px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.5, whiteSpace:"nowrap", cursor:"pointer", userSelect:"none", ...style }}>
      <span style={{ display:"inline-flex", alignItems:"center", gap:3 }}>{label}<SortIcon col={col} /></span>
    </th>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:16, fontFamily:"'DM Sans', sans-serif" }}>

      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
        <div>
          <p style={{ fontSize:12, color:"#94a3b8", margin:"0 0 2px" }}>
            Dashboard / <span style={{ color:"#f97316" }}>Contact Leads</span>
          </p>
          <h1 style={{ margin:0, fontSize:22, fontWeight:700, color:"#1e293b", letterSpacing:"-0.3px" }}>Contact Leads</h1>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {/* View Toggle */}
          <div style={{ display:"flex", background:"#f1f5f9", borderRadius:8, padding:3, gap:2 }}>
            {[["table","Table"],["kanban","Kanban"]].map(([v,l]) => (
              <button key={v} onClick={() => setView(v)} style={{
                padding:"5px 12px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                background: view===v ? "#fff" : "none",
                color: view===v ? "#f97316" : "#64748b",
                boxShadow: view===v ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}>{l}</button>
            ))}
          </div>
          <button onClick={() => setLeads(SEED)} style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"1px solid #e2e8f0", borderRadius:8, padding:"7px 12px", cursor:"pointer", color:"#64748b", fontSize:12 }}>
            <RiRefreshLine size={13} /> Refresh
          </button>
          <button style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"1px solid #e2e8f0", borderRadius:8, padding:"7px 12px", cursor:"pointer", color:"#64748b", fontSize:12 }}>
            <RiDownloadLine size={13} /> Export
          </button>
          <button onClick={openAdd} style={{ display:"flex", alignItems:"center", gap:5, background:"#f97316", color:"#fff", border:"none", borderRadius:9, padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:700 }}>
            <RiAddLine size={15} /> Add Lead
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
              <p style={{ margin:0, fontSize:20, fontWeight:700, color:s.color, letterSpacing:"-0.5px" }}>{s.value}</p>
              <p style={{ margin:0, fontSize:12, color:"#94a3b8", fontWeight:500 }}>{s.label}</p>
            </div>
            {/* decorative stripe */}
            <div style={{ position:"absolute", right:0, top:0, bottom:0, width:4, background:s.color, borderRadius:"0 14px 14px 0", opacity:0.3 }} />
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ flex:1, minWidth:180, display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid #e2e8f0", borderRadius:9, padding:"8px 12px" }}>
          <RiSearchLine size={14} style={{ color:"#94a3b8", flexShrink:0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads — name, city, service…"
            style={{ border:"none", outline:"none", fontSize:13, color:"#374151", width:"100%", background:"none" }} />
          {search && <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", padding:0 }}><RiCloseLine size={14} /></button>}
        </div>
        <select value={stageF} onChange={e => setStageF(e.target.value)} style={{ border:"1px solid #e2e8f0", borderRadius:9, padding:"8px 12px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" }}>
          <option value="all">All Stages</option>
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={sourceF} onChange={e => setSourceF(e.target.value)} style={{ border:"1px solid #e2e8f0", borderRadius:9, padding:"8px 12px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" }}>
          <option value="all">All Sources</option>
          {SOURCES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={serviceF} onChange={e => setServiceF(e.target.value)} style={{ border:"1px solid #e2e8f0", borderRadius:9, padding:"8px 12px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" }}>
          <option value="all">All Services</option>
          {SERVICES.map(s => <option key={s}>{s}</option>)}
        </select>
        {selIds.length > 0 && (
          <button onClick={bulkDel} style={{ display:"flex", alignItems:"center", gap:4, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:9, padding:"8px 12px", cursor:"pointer", fontSize:12, fontWeight:700 }}>
            <RiDeleteBinLine size={13} /> Delete ({selIds.length})
          </button>
        )}
        <span style={{ fontSize:11, color:"#94a3b8", marginLeft:"auto", fontWeight:500 }}>{filtered.length} lead{filtered.length!==1?"s":""}</span>
      </div>

      {/* ── TABLE VIEW ── */}
      {view === "table" && (
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ flex:1, overflowY:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#f8fafc", position:"sticky", top:0, zIndex:1 }}>
                  <th style={{ width:40, padding:"10px 14px", textAlign:"center" }}>
                    <input type="checkbox" checked={allSel} onChange={toggleAll} style={{ cursor:"pointer" }} />
                  </th>
                  <TH col="name"    label="Lead" />
                  <TH col="service" label="Service" />
                  <TH col="stage"   label="Stage" />
                  <TH col="source"  label="Source" />
                  <TH col="budget"  label="Budget" />
                  <TH col="city"    label="City" />
                  <TH col="updated" label="Last Updated" />
                  <th style={{ padding:"10px 12px", fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.5 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign:"center", padding:52, color:"#cbd5e1" }}>
                    <RiUserStarLine size={40} style={{ display:"block", margin:"0 auto 8px" }} />
                    No leads found
                  </td></tr>
                ) : filtered.map((l, i) => (
                  <tr key={l.id}
                    onClick={() => setDetailLead(l)}
                    style={{ borderBottom:"1px solid #f8fafc", cursor:"pointer", background: selIds.includes(l.id) ? "#fff7ed" : i%2===0 ? "#fff" : "#fafafa", transition:"background 0.1s" }}
                    onMouseEnter={e => { if (!selIds.includes(l.id)) e.currentTarget.style.background="#f0f9ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = selIds.includes(l.id) ? "#fff7ed" : i%2===0 ? "#fff" : "#fafafa"; }}
                  >
                    <td style={{ padding:"11px 14px", textAlign:"center" }} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selIds.includes(l.id)} onChange={e => toggleSel(l.id, e)} style={{ cursor:"pointer" }} />
                    </td>
                    <td style={{ padding:"11px 12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Av name={l.name} size={34} />
                        <div>
                          <p style={{ margin:0, fontWeight:600, color:"#1e293b", fontSize:13 }}>{l.name}</p>
                          <p style={{ margin:0, fontSize:11, color:"#94a3b8" }}>{l.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"11px 12px" }}>
                      <span style={{ background:"#f1f5f9", color:"#475569", fontSize:11, fontWeight:600, borderRadius:6, padding:"3px 8px" }}>{l.service}</span>
                    </td>
                    <td style={{ padding:"11px 12px" }}><StagePill stage={l.stage} /></td>
                    <td style={{ padding:"11px 12px" }}>
                      <span style={{ fontSize:12, color:"#64748b" }}>{SOURCE_ICONS[l.source]} {l.source}</span>
                    </td>
                    <td style={{ padding:"11px 12px", fontWeight:700, color:"#1e293b" }}>{fmtBudget(l.budget)}</td>
                    <td style={{ padding:"11px 12px", color:"#64748b", fontSize:12 }}>📍 {l.city}</td>
                    <td style={{ padding:"11px 12px", color:"#94a3b8", fontSize:11, whiteSpace:"nowrap" }}>{timeAgo(l.updated)}</td>
                    <td style={{ padding:"11px 12px" }} onClick={e => e.stopPropagation()}>
                      <div style={{ display:"flex", gap:4 }}>
                        <button onClick={e => openEdit(l,e)} style={{ background:"#eff6ff", border:"none", borderRadius:7, padding:"5px 8px", cursor:"pointer", color:"#2563eb", display:"flex", alignItems:"center" }}><RiEditLine size={13} /></button>
                        <button onClick={e => { e.stopPropagation(); setDelConfirm(l); }} style={{ background:"#fef2f2", border:"none", borderRadius:7, padding:"5px 8px", cursor:"pointer", color:"#dc2626", display:"flex", alignItems:"center" }}><RiDeleteBinLine size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── KANBAN VIEW ── */}
      {view === "kanban" && (
        <div style={{ display:"flex", gap:12, flex:1, overflowX:"auto", paddingBottom:8 }}>
          {kanbanGroups.map(({ stage, leads: kLeads }) => {
            const cfg = STAGE_CFG[stage];
            return (
              <div key={stage} style={{ minWidth:240, maxWidth:260, flex:"0 0 240px", display:"flex", flexDirection:"column", background:"#f8fafc", borderRadius:14, border:"1px solid #f1f5f9", overflow:"hidden" }}>
                {/* Column Header */}
                <div style={{ padding:"12px 14px", borderBottom:"3px solid "+cfg.dot, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, fontWeight:700, color:cfg.color }}>{stage}</span>
                  <span style={{ fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.color, borderRadius:20, padding:"2px 8px" }}>{kLeads.length}</span>
                </div>
                {/* Cards */}
                <div style={{ flex:1, overflowY:"auto", padding:"10px 10px", display:"flex", flexDirection:"column", gap:8 }}>
                  {kLeads.length === 0 && (
                    <div style={{ textAlign:"center", color:"#cbd5e1", padding:"24px 0", fontSize:12 }}>No leads</div>
                  )}
                  {kLeads.map(l => (
                    <div key={l.id} onClick={() => setDetailLead(l)} style={{
                      background:"#fff", borderRadius:10, border:"1px solid #f1f5f9",
                      padding:"12px", cursor:"pointer", transition:"box-shadow 0.15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.07)"}
                      onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
                    >
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                        <Av name={l.name} size={30} />
                        <div style={{ minWidth:0 }}>
                          <p style={{ margin:0, fontWeight:700, color:"#1e293b", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.name}</p>
                          <p style={{ margin:0, fontSize:10, color:"#94a3b8" }}>{l.city}</p>
                        </div>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:10, background:"#f1f5f9", color:"#475569", borderRadius:5, padding:"2px 6px", fontWeight:600 }}>{l.service}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:"#f97316" }}>{fmtBudget(l.budget)}</span>
                      </div>
                      <p style={{ margin:"8px 0 0", fontSize:11, color:"#94a3b8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {SOURCE_ICONS[l.source]} {l.source} · {timeAgo(l.updated)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {detailLead && (
        <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.35)", zIndex:999 }} onClick={() => setDetailLead(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            position:"absolute", right:0, top:0, bottom:0, width:400, maxWidth:"95vw",
            background:"#fff", boxShadow:"-8px 0 40px rgba(0,0,0,0.12)",
            display:"flex", flexDirection:"column", overflowY:"auto",
          }}>
            {/* Drawer Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #f1f5f9", position:"sticky", top:0, background:"#fff", zIndex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Av name={detailLead.name} size={40} />
                <div>
                  <p style={{ margin:0, fontWeight:700, fontSize:15, color:"#1e293b" }}>{detailLead.name}</p>
                  <StagePill stage={detailLead.stage} />
                </div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={e => { openEdit(detailLead,e); setDetailLead(null); }} style={{ background:"#eff6ff", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer", color:"#2563eb", display:"flex" }}><RiEditLine size={15} /></button>
                <button onClick={() => setDetailLead(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex" }}><RiCloseLine size={20} /></button>
              </div>
            </div>

            {/* Drawer Body */}
            <div style={{ padding:"20px", flex:1 }}>
              {/* Contact Info */}
              <div style={{ background:"#f8fafc", borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
                <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.5 }}>Contact Info</p>
                {[
                  { icon:<RiMailLine size={13} />, val: detailLead.email,          href:`mailto:${detailLead.email}` },
                  { icon:<RiPhoneLine size={13} />, val: detailLead.phone,          href:`tel:${detailLead.phone}` },
                  { icon:<RiMapPinLine size={13}/>, val: detailLead.city,           href: null },
                  { icon:<RiCalendarLine size={13}/>,val:`Added ${fmtDate(detailLead.date)}`, href:null },
                ].map((row,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom: i<3 ? "1px solid #f1f5f9":"none" }}>
                    <span style={{ color:"#94a3b8" }}>{row.icon}</span>
                    {row.href
                      ? <a href={row.href} style={{ fontSize:13, color:"#6366f1", textDecoration:"none" }}>{row.val}</a>
                      : <span style={{ fontSize:13, color:"#475569" }}>{row.val}</span>
                    }
                  </div>
                ))}
              </div>

              {/* Lead Details */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                {[
                  { label:"Service",  value: detailLead.service, color:"#6366f1", bg:"#eef2ff" },
                  { label:"Budget",   value: fmtBudget(detailLead.budget), color:"#059669", bg:"#ecfdf5" },
                  { label:"Source",   value: `${SOURCE_ICONS[detailLead.source]} ${detailLead.source}`, color:"#d97706", bg:"#fffbeb" },
                  { label:"Updated",  value: timeAgo(detailLead.updated), color:"#64748b", bg:"#f1f5f9" },
                ].map(c => (
                  <div key={c.label} style={{ background:c.bg, borderRadius:10, padding:"10px 12px" }}>
                    <p style={{ margin:"0 0 2px", fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.5 }}>{c.label}</p>
                    <p style={{ margin:0, fontSize:13, fontWeight:700, color:c.color }}>{c.value}</p>
                  </div>
                ))}
              </div>

              {/* Note */}
              {detailLead.note && (
                <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:6 }}>
                    <RiStickyNoteLine size={13} style={{ color:"#d97706" }} />
                    <span style={{ fontSize:11, fontWeight:700, color:"#d97706", textTransform:"uppercase", letterSpacing:0.5 }}>Note</span>
                  </div>
                  <p style={{ margin:0, fontSize:13, color:"#92400e", lineHeight:1.6 }}>{detailLead.note}</p>
                </div>
              )}

              {/* Stage Progress */}
              <div>
                <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.5 }}>Stage Progress</p>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {STAGES.map((s,i) => {
                    const ci = STAGES.indexOf(detailLead.stage);
                    const active = i === ci;
                    const past   = i < ci;
                    return (
                      <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <button
                          onClick={() => { setLeads(p => p.map(l => l.id===detailLead.id ? {...l, stage:s, updated:new Date().toISOString()} : l)); setDetailLead(p => ({...p, stage:s})); }}
                          style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20, border:"none", cursor:"pointer",
                            background: active ? STAGE_CFG[s].dot : past ? "#e2e8f0" : "#f8fafc",
                            color: active ? "#fff" : past ? "#64748b" : "#94a3b8",
                          }}
                        >{s}</button>
                        {i < STAGES.length-1 && <RiArrowRightLine size={10} style={{ color:"#cbd5e1" }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div style={{ padding:"14px 20px", borderTop:"1px solid #f1f5f9", display:"flex", gap:8 }}>
              <a href={`mailto:${detailLead.email}`} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, background:"#eff6ff", color:"#2563eb", borderRadius:9, padding:"9px", fontSize:12, fontWeight:600, textDecoration:"none" }}>
                <RiMailLine size={14} /> Email
              </a>
              <a href={`tel:${detailLead.phone}`} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, background:"#ecfdf5", color:"#059669", borderRadius:9, padding:"9px", fontSize:12, fontWeight:600, textDecoration:"none" }}>
                <RiPhoneLine size={14} /> Call
              </a>
              <a href={`https://wa.me/${detailLead.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, background:"#f0fdf4", color:"#16a34a", borderRadius:9, padding:"9px", fontSize:12, fontWeight:600, textDecoration:"none" }}>
                <RiWhatsappLine size={14} /> WhatsApp
              </a>
              <button onClick={() => { setDelConfirm(detailLead); setDetailLead(null); }} style={{ background:"#fef2f2", color:"#dc2626", border:"none", borderRadius:9, padding:"9px 12px", cursor:"pointer", display:"flex", alignItems:"center" }}>
                <RiDeleteBinLine size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={closeModal}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:16, width:520, maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #f1f5f9", position:"sticky", top:0, background:"#fff", zIndex:1 }}>
              <span style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>{editLead ? "Edit Lead" : "Add New Lead"}</span>
              <button onClick={closeModal} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8" }}><RiCloseLine size={20} /></button>
            </div>
            <div style={{ padding:"20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={{ gridColumn:"1/-1" }}>
                <Input label="Full Name *" placeholder="Lead name" value={form.name} onChange={e => F("name",e.target.value)} icon={<RiUserStarLine size={14} />} />
              </div>
              <Input label="Email *" placeholder="email@example.com" value={form.email} onChange={e => F("email",e.target.value)} icon={<RiMailLine size={14} />} />
              <Input label="Phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => F("phone",e.target.value)} icon={<RiPhoneLine size={14} />} />
              <Input label="City" placeholder="City name" value={form.city} onChange={e => F("city",e.target.value)} icon={<RiMapPinLine size={14} />} />
              <Input label="Budget (₹)" placeholder="e.g. 50000" value={form.budget} onChange={e => F("budget",e.target.value)} icon={<RiMoneyRupeeCircleLine size={14} />} type="number" />
              <Sel label="Stage" value={form.stage} onChange={e => F("stage",e.target.value)}>
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </Sel>
              <Sel label="Source" value={form.source} onChange={e => F("source",e.target.value)}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </Sel>
              <div style={{ gridColumn:"1/-1" }}>
                <Sel label="Service" value={form.service} onChange={e => F("service",e.target.value)}>
                  {SERVICES.map(s => <option key={s}>{s}</option>)}
                </Sel>
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Note</label>
                <textarea value={form.note} onChange={e => F("note",e.target.value)} rows={2} placeholder="Any additional notes…"
                  style={{ width:"100%", border:"1px solid #e2e8f0", borderRadius:9, padding:"9px 12px", fontSize:13, color:"#1e293b", outline:"none", resize:"none", fontFamily:"inherit", background:"#fafafa", boxSizing:"border-box" }} />
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8, padding:"14px 20px", borderTop:"1px solid #f1f5f9" }}>
              <button onClick={closeModal} style={{ background:"none", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 18px", cursor:"pointer", fontSize:13, color:"#64748b" }}>Cancel</button>
              <button onClick={saveLead} style={{ display:"flex", alignItems:"center", gap:5, background:(!form.name.trim()||!form.email.trim())?"#fed7aa":"#f97316", color:"#fff", border:"none", borderRadius:9, padding:"8px 22px", cursor:"pointer", fontSize:13, fontWeight:700 }}>
                <RiCheckLine size={14} /> {editLead ? "Save Changes" : "Add Lead"}
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
              <RiDeleteBinLine size={24} style={{ color:"#dc2626" }} />
            </div>
            <h3 style={{ margin:"0 0 6px", fontSize:16, fontWeight:700, color:"#1e293b" }}>Delete Lead?</h3>
            <p style={{ margin:"0 0 22px", fontSize:13, color:"#64748b" }}>
              Remove <strong>{delConfirm.name}</strong> permanently? This cannot be undone.
            </p>
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              <button onClick={() => setDelConfirm(null)} style={{ background:"none", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 20px", cursor:"pointer", fontSize:13, color:"#64748b" }}>Cancel</button>
              <button onClick={() => delLead(delConfirm.id)} style={{ background:"#dc2626", color:"#fff", border:"none", borderRadius:8, padding:"8px 22px", cursor:"pointer", fontSize:13, fontWeight:700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}