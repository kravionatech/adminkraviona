import { useState, useRef, useEffect } from "react";
import {
  FiUpload, FiSearch, FiGrid, FiList, FiFilter,
  FiImage, FiVideo, FiFileText, FiFolder, FiTrash2,
  FiDownload, FiCopy, FiEye, FiMoreVertical, FiX,
  FiCheck, FiStar, FiLink, FiChevronDown
} from "react-icons/fi";
import { mediaApi } from "../../services/api";

// Mock files removed

const TYPE_COLORS = {
  image: { bg: "#EEF6FF", text: "#1D6FD8", icon: <FiImage size={13} /> },
  video: { bg: "#FFF0F3", text: "#C8203E", icon: <FiVideo size={13} /> },
  document: { bg: "#F0FAF4", text: "#1A7A4A", icon: <FiFileText size={13} /> },
};

const FOLDERS = ["All", "Marketing", "Team", "Products", "Brand", "Icons", "Blog", "Legal"];

export default function MediaLibrary() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterFolder, setFilterFolder] = useState("All");
  const [selected, setSelected] = useState([]);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    mediaApi.list({ limit: 200 }).then((d) => {
      const list = (Array.isArray(d) ? d : (d?.data || [])).map((f) => ({
        ...f, id: f._id, name: f.filename || f.originalname || f.name, url: f.url,
        type: (f.mimetype?.startsWith("video/") && "video") || (f.mimetype?.startsWith("image/") && "image") || "document",
        size: f.size ? `${(f.size / 1024).toFixed(0)} KB` : "",
        date: f.createdAt,
      }));
      if (list.length) {
        setFiles(list);
      } else {
        setFiles([]);
      }
    }).catch(() => setFiles([]));
  }, []);
  const [ctxMenu, setCtxMenu] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const fileInput = useRef();

  const filtered = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || f.type === filterType;
    const matchFolder = filterFolder === "All" || f.folder === filterFolder;
    return matchSearch && matchType && matchFolder;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "size") return parseFloat(b.size) - parseFloat(a.size);
    return 0;
  });

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const toggleStar = (id) => {
    setFiles(fs => fs.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
  };

  const deleteSelected = () => {
    setFiles(fs => fs.filter(f => !selected.includes(f.id)));
    setSelected([]);
  };

  const copyLink = (id) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const stats = {
    total: files.length,
    images: files.filter(f => f.type === "image").length,
    videos: files.filter(f => f.type === "video").length,
    docs: files.filter(f => f.type === "document").length,
  };

  const iconForType = (type) => {
    if (type === "image") return <FiImage size={32} color="#93B8E8" />;
    if (type === "video") return <FiVideo size={32} color="#E89393" />;
    return <FiFileText size={32} color="#93C8A6" />;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#1a1a2e", minHeight: "100vh", background: "#F7F8FC", padding: "0" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #EAEDF2", padding: "20px 28px 0", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#131626" }}>Media Library</h1>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "#7E8A9A" }}>{stats.total} files · {stats.images} images · {stats.videos} videos · {stats.docs} documents</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {selected.length > 0 && (
              <button onClick={deleteSelected} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#FFF0F2", color: "#C8203E", border: "1px solid #F5C0CC", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                <FiTrash2 size={14} /> Delete {selected.length}
              </button>
            )}
            <button onClick={() => fileInput.current.click()} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 18px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, letterSpacing: "0.01em" }}>
              <FiUpload size={14} /> Upload Files
            </button>
            <input ref={fileInput} type="file" multiple style={{ display: "none" }} />
          </div>
        </div>

        {/* Stat Pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
          {[
            { label: "All Files", count: stats.total, key: "all", color: "#2563EB" },
            { label: "Images", count: stats.images, key: "image", color: "#1D6FD8" },
            { label: "Videos", count: stats.videos, key: "video", color: "#C8203E" },
            { label: "Documents", count: stats.docs, key: "document", color: "#1A7A4A" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilterType(tab.key)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              borderRadius: 20, border: `1.5px solid ${filterType === tab.key ? tab.color : "#EAEDF2"}`,
              background: filterType === tab.key ? tab.color + "12" : "#fff",
              color: filterType === tab.key ? tab.color : "#6B7280",
              cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
              transition: "all 0.15s"
            }}>
              {tab.label} <span style={{ background: filterType === tab.key ? tab.color : "#F1F3F8", color: filterType === tab.key ? tab.color : "#9099A8", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 28px", background: "#fff", borderBottom: "1px solid #EAEDF2" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
          <FiSearch size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#A0AEC0" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files…" style={{ width: "100%", padding: "8px 12px 8px 34px", border: "1px solid #EAEDF2", borderRadius: 8, fontSize: 13, color: "#131626", background: "#F7F8FC", outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Folder filter */}
        <div style={{ position: "relative" }}>
          <select value={filterFolder} onChange={e => setFilterFolder(e.target.value)} style={{ padding: "8px 32px 8px 12px", border: "1px solid #EAEDF2", borderRadius: 8, fontSize: 13, color: "#4B5563", background: "#F7F8FC", outline: "none", cursor: "pointer", appearance: "none" }}>
            {FOLDERS.map(f => <option key={f}>{f}</option>)}
          </select>
          <FiChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#9099A8", pointerEvents: "none" }} />
        </div>

        {/* Sort */}
        <div style={{ position: "relative" }}>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "8px 32px 8px 12px", border: "1px solid #EAEDF2", borderRadius: 8, fontSize: 13, color: "#4B5563", background: "#F7F8FC", outline: "none", cursor: "pointer", appearance: "none" }}>
            <option value="date">Sort: Recent</option>
            <option value="name">Sort: Name</option>
            <option value="size">Sort: Size</option>
          </select>
          <FiChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#9099A8", pointerEvents: "none" }} />
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 2, background: "#F1F3F8", borderRadius: 8, padding: 3 }}>
          {[["grid", <FiGrid size={15} />], ["list", <FiList size={15} />]].map(([v, icon]) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: view === v ? "#fff" : "transparent", color: view === v ? "#2563EB" : "#9099A8", boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); }}
        style={{ margin: "16px 28px", border: `2px dashed ${dragging ? "#2563EB" : "#D1D8E8"}`, borderRadius: 12, padding: "18px", background: dragging ? "#EEF6FF" : "#F7F9FF", textAlign: "center", transition: "all 0.2s", cursor: "pointer" }}
        onClick={() => fileInput.current.click()}
      >
        <FiUpload size={20} color={dragging ? "#2563EB" : "#A0AEC0"} style={{ marginBottom: 6 }} />
        <p style={{ margin: 0, fontSize: 13, color: dragging ? "#2563EB" : "#9099A8", fontWeight: 500 }}>Drop files here or <span style={{ color: "#2563EB", textDecoration: "underline" }}>browse</span></p>
      </div>

      {/* Content */}
      <div style={{ padding: "0 28px 28px" }}>
        {files.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#A0AEC0" }}>
            <FiFolder size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Data not available</p>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#A0AEC0" }}>
            <FiFolder size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: 15 }}>No files found</p>
          </div>
        ) : view === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {sorted.map(file => (
              <div key={file.id} onClick={() => setPreview(file)} style={{ background: "#fff", borderRadius: 12, border: selected.includes(file.id) ? "2px solid #2563EB" : "1px solid #EAEDF2", overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.18s, border-color 0.18s", position: "relative" }}
                onMouseEnter={e => { if (!selected.includes(file.id)) e.currentTarget.style.boxShadow = "0 4px 18px rgba(37,99,235,0.10)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
                {/* Thumbnail */}
                <div style={{ height: 130, background: "#F1F4FB", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                  {file.url ? (
                    <img src={file.url} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    iconForType(file.type)
                  )}
                  {/* Overlay on hover */}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(19,22,38,0.45)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: 0, transition: "opacity 0.18s" }}
                    className="thumb-overlay"
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                    <button onClick={e => { e.stopPropagation(); setPreview(file); }} style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 7, padding: "6px 10px", color: "#fff", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><FiEye size={13} /> View</button>
                  </div>
                  {/* Select checkbox */}
                  <div onClick={e => toggleSelect(file.id, e)} style={{ position: "absolute", top: 8, left: 8, width: 20, height: 20, borderRadius: 5, border: `2px solid ${selected.includes(file.id) ? "#2563EB" : "rgba(255,255,255,0.7)"}`, background: selected.includes(file.id) ? "#2563EB" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(2px)" }}>
                    {selected.includes(file.id) && <FiCheck size={11} color="#fff" />}
                  </div>
                  {/* Star */}
                  <button onClick={e => { e.stopPropagation(); toggleStar(file.id); }} style={{ position: "absolute", top: 6, right: 6, background: "none", border: "none", cursor: "pointer", color: file.starred ? "#F59E0B" : "rgba(255,255,255,0.6)", padding: 3 }}>
                    <FiStar size={14} fill={file.starred ? "#F59E0B" : "none"} />
                  </button>
                </div>
                {/* Info */}
                <div style={{ padding: "10px 12px 11px" }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1E2535", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 11, background: TYPE_COLORS[file.type].bg, color: TYPE_COLORS[file.type].text, borderRadius: 5, padding: "2px 7px", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                      {TYPE_COLORS[file.type].icon} {file.type}
                    </span>
                    <span style={{ fontSize: 11, color: "#9099A8" }}>{file.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EAEDF2", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "40px 2fr 1fr 1fr 1fr 1fr 120px", padding: "10px 18px", borderBottom: "1px solid #F1F3F8", fontSize: 12, color: "#9099A8", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              <span></span>
              <span>Name</span>
              <span>Type</span>
              <span>Folder</span>
              <span>Size</span>
              <span>Uploaded</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>
            {sorted.map((file, idx) => (
              <div key={file.id} onClick={() => setPreview(file)} style={{ display: "grid", gridTemplateColumns: "40px 2fr 1fr 1fr 1fr 1fr 120px", padding: "12px 18px", borderBottom: idx < sorted.length - 1 ? "1px solid #F5F6FA" : "none", alignItems: "center", cursor: "pointer", background: selected.includes(file.id) ? "#EEF6FF" : "transparent", transition: "background 0.12s" }}
                onMouseEnter={e => { if (!selected.includes(file.id)) e.currentTarget.style.background = "#F7F9FF"; }}
                onMouseLeave={e => { if (!selected.includes(file.id)) e.currentTarget.style.background = "transparent"; }}>
                <div onClick={e => toggleSelect(file.id, e)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected.includes(file.id) ? "#2563EB" : "#D1D8E8"}`, background: selected.includes(file.id) ? "#2563EB" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  {selected.includes(file.id) && <FiCheck size={10} color="#fff" />}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F1F4FB", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    {file.url ? <img src={file.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : iconForType(file.type)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1E2535" }}>{file.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9099A8" }}>{file.dims}</p>
                  </div>
                </div>
                <span style={{ fontSize: 12, background: TYPE_COLORS[file.type].bg, color: TYPE_COLORS[file.type].text, borderRadius: 5, padding: "3px 8px", fontWeight: 600, width: "fit-content", display: "flex", alignItems: "center", gap: 4 }}>
                  {TYPE_COLORS[file.type].icon} {file.type}
                </span>
                <span style={{ fontSize: 13, color: "#4B5563" }}>{file.folder}</span>
                <span style={{ fontSize: 13, color: "#4B5563" }}>{file.size}</span>
                <span style={{ fontSize: 13, color: "#9099A8" }}>{file.date}</span>
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => copyLink(file.id)} title="Copy link" style={{ padding: "5px 8px", background: copiedId === file.id ? "#ECFDF5" : "#F7F8FC", border: `1px solid ${copiedId === file.id ? "#6EE7B7" : "#EAEDF2"}`, borderRadius: 7, cursor: "pointer", color: copiedId === file.id ? "#059669" : "#6B7280", display: "flex", alignItems: "center" }}>
                    {copiedId === file.id ? <FiCheck size={13} /> : <FiLink size={13} />}
                  </button>
                  <button onClick={() => {}} title="Download" style={{ padding: "5px 8px", background: "#F7F8FC", border: "1px solid #EAEDF2", borderRadius: 7, cursor: "pointer", color: "#6B7280", display: "flex", alignItems: "center" }}>
                    <FiDownload size={13} />
                  </button>
                  <button onClick={() => toggleStar(file.id)} title="Star" style={{ padding: "5px 8px", background: file.starred ? "#FFFBEB" : "#F7F8FC", border: `1px solid ${file.starred ? "#FDE68A" : "#EAEDF2"}`, borderRadius: 7, cursor: "pointer", color: file.starred ? "#F59E0B" : "#9099A8", display: "flex", alignItems: "center" }}>
                    <FiStar size={13} fill={file.starred ? "#F59E0B" : "none"} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div onClick={() => setPreview(null)} style={{ position: "fixed", inset: 0, background: "rgba(10,12,28,0.65)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "min(96vw, 820px)", maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 30px 80px rgba(0,0,0,0.3)" }}>
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #EAEDF2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F1F4FB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {iconForType(preview.type)}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#131626" }}>{preview.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9099A8" }}>{preview.folder} · {preview.size} · {preview.date}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => copyLink(preview.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 13px", background: "#F7F8FC", border: "1px solid #EAEDF2", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#4B5563", fontWeight: 600 }}>
                  {copiedId === preview.id ? <><FiCheck size={13} /> Copied!</> : <><FiLink size={13} /> Copy URL</>}
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 13px", background: "#2563EB", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#fff", fontWeight: 600 }}>
                  <FiDownload size={13} /> Download
                </button>
                <button onClick={() => setPreview(null)} style={{ padding: "7px", background: "#F7F8FC", border: "1px solid #EAEDF2", borderRadius: 8, cursor: "pointer", color: "#6B7280", display: "flex" }}>
                  <FiX size={15} />
                </button>
              </div>
            </div>
            {/* Preview Area */}
            <div style={{ flex: 1, overflow: "auto", background: "#F7F8FC", minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {preview.url ? (
                <img src={preview.url} alt={preview.name} style={{ maxWidth: "100%", maxHeight: 460, objectFit: "contain", display: "block" }} />
              ) : (
                <div style={{ textAlign: "center", padding: 60 }}>
                  {iconForType(preview.type)}
                  <p style={{ color: "#9099A8", marginTop: 12, fontSize: 14 }}>Preview not available for this file type</p>
                </div>
              )}
            </div>
            {/* Meta Footer */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderTop: "1px solid #EAEDF2", background: "#EAEDF2" }}>
              {[["Type", preview.type], ["Dimensions", preview.dims], ["Size", preview.size], ["Folder", preview.folder]].map(([label, val]) => (
                <div key={label} style={{ background: "#fff", padding: "12px 16px" }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#9099A8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 13, color: "#1E2535", fontWeight: 600 }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}