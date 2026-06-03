import { useState, useEffect } from "react";
import { categoriesApi } from "../../services/api";
import {
  FiGrid,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiTag,
  FiFileText,
  FiTrendingUp,
  FiCheck,
  FiX,
  FiChevronDown,
  FiFilter,
  FiDownload,
  FiEye,
  FiLayers,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

// Mock categories removed

const COLOR_OPTIONS = ["#E8663D","#3B82F6","#10B981","#8B5CF6","#F59E0B","#06B6D4","#EC4899","#64748B","#EF4444","#84CC16"];

function Modal({ open, onClose, category, onSave }) {
  const [form, setForm] = useState(
    category || { name: "", slug: "", description: "", color: "#E8663D", status: "active", featured: false }
  );

  const handleNameChange = (val) => {
    setForm({ ...form, name: val, slug: val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: form.color + "20" }}>
              <FiTag size={16} style={{ color: form.color }} />
            </div>
            <h2 className="font-semibold text-gray-800 text-base">
              {category ? "Edit Category" : "Add New Category"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Category Name</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              placeholder="e.g. Web Development"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Slug</label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-r border-gray-200 select-none">/blog/</span>
              <input
                className="flex-1 px-3 py-2.5 text-sm text-gray-800 focus:outline-none"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
              placeholder="Short description of this category..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Color Label</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                  style={{ background: c, borderColor: form.color === c ? c : "transparent", outline: form.color === c ? `3px solid ${c}40` : "none" }}
                />
              ))}
            </div>
          </div>

          {/* Status + Featured */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Status</label>
              <div className="relative">
                <select
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 appearance-none transition-all"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
                <FiChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Featured</label>
              <button
                onClick={() => setForm({ ...form, featured: !form.featured })}
                className={`w-full flex items-center justify-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  form.featured ? "bg-orange-50 border-orange-300 text-orange-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <HiOutlineSparkles size={15} />
                {form.featured ? "Featured" : "Not Featured"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium">
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="px-5 py-2 text-sm text-white rounded-xl font-medium transition-all hover:shadow-lg active:scale-95"
            style={{ background: "linear-gradient(135deg, #E8663D, #d45a30)" }}
          >
            {category ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ open, onClose, onConfirm, name }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiTrash2 size={20} className="text-red-500" />
        </div>
        <h3 className="text-center text-gray-800 font-semibold mb-1">Delete Category</h3>
        <p className="text-center text-gray-500 text-sm mb-6">
          Are you sure you want to delete <span className="font-medium text-gray-700">"{name}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({ cat, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <tr className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors group">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: cat.color + "18" }}>
            <FiTag size={15} style={{ color: cat.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800 text-sm">{cat.name}</span>
              {cat.featured && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[10px] font-semibold">
                  <HiOutlineSparkles size={9} /> Featured
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">/blog/{cat.slug}</span>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 hidden md:table-cell">
        <span className="text-sm text-gray-500 line-clamp-1 max-w-[220px]">{cat.description}</span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          <FiFileText size={13} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{cat.posts}</span>
          <span className="text-xs text-gray-400">posts</span>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
          cat.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cat.status === "active" ? "bg-emerald-500" : "bg-gray-400"}`} />
          {cat.status === "active" ? "Active" : "Draft"}
        </span>
      </td>
      <td className="px-5 py-4 hidden lg:table-cell">
        <span className="text-xs text-gray-400">{cat.createdAt}</span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(cat)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-500">
            <FiEdit2 size={14} />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
            <FiEye size={14} />
          </button>
          <button onClick={() => onDelete(cat)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500">
            <FiTrash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.adminList();
      const list = (Array.isArray(data) ? data : (data?.data || [])).map((c) => ({
        ...c,
        id: c._id,
        posts: c.postsCount || c.posts || 0,
        createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      }));
      setCategories(list);
    } catch (e) {
      setCategories([]);
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchCats(); }, []);

  const filtered = categories.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || (c.slug || "").includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter || (filter === "featured" && c.featured);
    return matchSearch && matchFilter;
  });

  const totalPosts = categories.reduce((s, c) => s + c.posts, 0);
  const activeCount = categories.filter((c) => c.status === "active").length;
  const featuredCount = categories.filter((c) => c.featured).length;

  const handleSave = async (form) => {
    try {
      if (editTarget) {
        const updated = await categoriesApi.update(editTarget.id, form);
        setCategories(categories.map((c) => (c.id === editTarget.id ? { ...c, ...form, ...(updated || {}) } : c)));
      } else {
        const created = await categoriesApi.create(form);
        const nc = { ...form, id: created?._id || Date.now(), posts: 0, createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), ...(created || {}) };
        setCategories([...categories, nc]);
      }
    } catch (e) { console.error("save failed", e); }
    setEditTarget(null);
  };

  const handleDelete = async () => {
    const id = deleteTarget.id;
    setCategories(categories.filter((c) => c.id !== id));
    setDeleteTarget(null);
    try { await categoriesApi.remove(id); } catch (e) { console.error("delete failed", e); }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-sans">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-0.5">
            <span>Blog Engine</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Categories</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiLayers size={20} className="text-[#E8663D]" />
            Categories
          </h1>
        </div>
        <button
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-medium rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
          style={{ background: "linear-gradient(135deg, #E8663D, #d45a30)" }}
        >
          <FiPlus size={16} />
          Add Category
        </button>
      </div>

      <div className="px-6 py-6 max-w-[1200px] mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Categories", value: categories.length, icon: FiGrid, color: "#E8663D", bg: "#FFF4F0" },
            { label: "Total Posts", value: totalPosts, icon: FiFileText, color: "#3B82F6", bg: "#EFF6FF" },
            { label: "Active", value: activeCount, icon: FiCheck, color: "#10B981", bg: "#F0FDF4" },
            { label: "Featured", value: featuredCount, icon: HiOutlineSparkles, color: "#F59E0B", bg: "#FFFBEB" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <FiSearch size={14} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-300 focus:bg-white transition-all"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              {["all", "active", "draft", "featured"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    filter === f
                      ? "bg-[#E8663D] text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {f}
                </button>
              ))}
              <button className="ml-1 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <FiDownload size={14} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60">Category</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60 hidden md:table-cell">Description</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60">Posts</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60 hidden lg:table-cell">Created</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                      <FiTag size={32} className="mx-auto mb-3 text-gray-200" />
                      Data not available
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                      <FiTag size={32} className="mx-auto mb-3 text-gray-200" />
                      No categories found
                    </td>
                  </tr>
                ) : (
                  filtered.map((cat) => (
                    <CategoryRow
                      key={cat.id}
                      cat={cat}
                      onEdit={(c) => { setEditTarget(c); setModalOpen(true); }}
                      onDelete={(c) => setDeleteTarget(c)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Showing <span className="font-medium text-gray-600">{filtered.length}</span> of <span className="font-medium text-gray-600">{categories.length}</span> categories
            </span>
            <div className="flex items-center gap-1">
              {[1].map((p) => (
                <button key={p} className="w-7 h-7 rounded-lg text-xs font-medium bg-[#E8663D] text-white">1</button>
              ))}
            </div>
          </div>
        </div>

        {/* Color legend */}
        <div className="mt-5 flex flex-wrap gap-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
              {c.name}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        category={editTarget}
        onSave={handleSave}
      />
      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        name={deleteTarget?.name}
      />
    </div>
  );
}