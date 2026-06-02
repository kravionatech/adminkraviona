// src/pages/dashboard/blog/ManagePost.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus, FiSearch, FiRefreshCw, FiDownload,
  FiEye, FiEdit3, FiTrash2, FiCheckSquare
} from 'react-icons/fi';
import axios from 'axios'

// ─── STATUS PILL ─────────────────────────────────────────────
const PILL = {
  published: 'bg-green-50 text-green-800',
  draft:     'bg-gray-100 text-gray-600',
  archived:  'bg-red-50   text-red-700',
};
const StatusPill = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${PILL[status] || PILL.draft}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {status}
  </span>
);

// ─── SEO INDICATOR ───────────────────────────────────────────
const SEO_DOT = { good: 'bg-green-500', warn: 'bg-amber-400', bad: 'bg-red-500' };
const SEO_LABEL = { good: 'SEO OK', warn: 'Missing fields', bad: 'Incomplete' };
const SeoStatus = ({ score }) => (
  <span className="flex items-center gap-1.5">
    <span className={`w-2 h-2 rounded-full ${SEO_DOT[score]}`} />
    <span className="text-[11px] text-gray-400">{SEO_LABEL[score]}</span>
  </span>
);

// ─── VIEWS BAR ───────────────────────────────────────────────
const ViewsBar = ({ views, max }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-medium text-gray-700 min-w-[28px]">{views}</span>
    <div className="h-1 rounded-full bg-[#235056]" style={{ width: `${Math.round((views / max) * 56)}px` }} />
  </div>
);

// ─── CONFIRM DIALOG ──────────────────────────────────────────
const ConfirmDialog = ({ post, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl border border-gray-200 p-6 w-96 shadow-lg">
      <h3 className="text-sm font-medium text-gray-900 mb-1">Delete post?</h3>
      <p className="text-xs text-gray-500 mb-5">
        "{post?.title?.slice(0, 60)}..." will be permanently deleted.
      </p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function ManagePost() {
  const navigate = useNavigate();
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterStatus, setStatus] = useState('');
  const [filterCat, setCat]       = useState('');
  const [sortKey, setSortKey]     = useState('date-desc');
  const [selected, setSelected]   = useState(new Set());
  const [delTarget, setDelTarget] = useState(null);
  const [page, setPage]           = useState(1);
  const PAGE_SIZE = 10;

  // ── Fetch posts from API ──────────────────────────────────
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/blog/posts?limit=100&status=all');
      if (data.success) setPosts(data.data);
    } catch {
      // fallback: keep existing
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // ── Filter + sort ─────────────────────────────────────────
  const filtered = useMemo(() => {
    let arr = posts.filter(p =>
      (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
      (!filterStatus || p.status === filterStatus) &&
      (!filterCat || p.category?.slug === filterCat)
    );
    if (sortKey === 'date-desc')   arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortKey === 'date-asc')    arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortKey === 'views-desc')  arr.sort((a, b) => b.views - a.views);
    if (sortKey === 'views-asc')   arr.sort((a, b) => a.views - b.views);
    return arr;
  }, [posts, search, filterStatus, filterCat, sortKey]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const maxViews = Math.max(...posts.map(p => p.views), 1);

  // ── Stats ─────────────────────────────────────────────────
  const stats = {
    total:  posts.length,
    pub:    posts.filter(p => p.status === 'published').length,
    draft:  posts.filter(p => p.status === 'draft').length,
    views:  posts.reduce((a, p) => a + (p.views || 0), 0),
  };

  // ── SEO score helper ──────────────────────────────────────
  const seoScore = (p) => {
    const filled = [p.metaTitle, p.metaDescription, p.focusKeywords?.length].filter(Boolean).length;
    return filled === 3 ? 'good' : filled >= 1 ? 'warn' : 'bad';
  };

  // ── Selection ─────────────────────────────────────────────
  const toggleOne = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };
  const toggleAll = (checked) => {
    setSelected(checked ? new Set(paginated.map(p => p._id)) : new Set());
  };
  const clearSelection = () => setSelected(new Set());

  // ── Bulk actions ──────────────────────────────────────────
  const bulkStatus = async (status) => {
    await Promise.all([...selected].map(id =>
      axios.put(`/blog/posts/${id}`, { status })
    ));
    clearSelection();
    fetchPosts();
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} posts?`)) return;
    await Promise.all([...selected].map(id => axios.delete(`/blog/posts/${id}`)));
    clearSelection();
    fetchPosts();
  };

  // ── Single delete ─────────────────────────────────────────
  const confirmDelete = async () => {
    if (!delTarget) return;
    await axios.delete(`/blog/posts/${delTarget._id}`);
    setDelTarget(null);
    fetchPosts();
  };

  // ── Toggle publish ────────────────────────────────────────
  const togglePublish = async (post) => {
    const status = post.status === 'published' ? 'draft' : 'published';
    await axios.put(`/blog/posts/${post._id}`, { status });
    fetchPosts();
  };

  // ── Export CSV ────────────────────────────────────────────
  const exportCSV = () => {
    const rows = [
      ['Title', 'Category', 'Views', 'Status', 'Date'],
      ...filtered.map(p => [p.title, p.category?.name, p.views, p.status, p.createdAt?.slice(0, 10)])
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'posts.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Manage posts</h1>
          <p className="text-xs text-gray-400 mt-0.5">Create, edit, publish and monitor SEO</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FiDownload size={13} /> Export
          </button>
          <button onClick={() => navigate('/new-post')}
            className="flex items-center gap-1.5 text-sm px-4 py-2 bg-[#235056] text-white rounded-lg hover:opacity-90">
            <FiPlus size={15} /> Add new post
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { icon:'📄', color:'bg-blue-50 text-blue-700',   val: stats.total,             label: 'Total posts' },
          { icon:'✅', color:'bg-green-50 text-green-700', val: stats.pub,               label: 'Published' },
          { icon:'✏️', color:'bg-amber-50 text-amber-700', val: stats.draft,             label: 'Drafts' },
          { icon:'👁', color:'bg-purple-50 text-purple-700',val: stats.views.toLocaleString(), label: 'Total views' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${s.color}`}>{s.icon}</div>
            <div>
              <div className="text-xl font-medium text-gray-900">{s.val}</div>
              <div className="text-[11px] text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
          <FiSearch size={13} className="text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="text-sm bg-transparent outline-none w-full text-gray-800 placeholder-gray-400"
            placeholder="Search posts..." />
        </div>
        <select value={filterStatus} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white">
          <option value="">All status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select value={filterCat} onChange={e => { setCat(e.target.value); setPage(1); }}
          className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white">
          <option value="">All categories</option>
          <option value="next-gen-web-development">Next gen web</option>
          <option value="ai-and-automation">AI & automation</option>
          <option value="web-3-development">Web 3</option>
        </select>
        <select value={sortKey} onChange={e => setSortKey(e.target.value)}
          className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white">
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="views-desc">Most views</option>
          <option value="views-asc">Least views</option>
        </select>
        <button onClick={() => { setSearch(''); setStatus(''); setCat(''); setSortKey('date-desc'); setPage(1); }}
          className="flex items-center gap-1 text-xs px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <FiRefreshCw size={12} /> Reset
        </button>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-3 text-sm text-blue-700">
          <FiCheckSquare size={14} />
          <span>{selected.size} selected</span>
          <button onClick={() => bulkStatus('published')} className="px-3 py-1 border border-blue-200 bg-white rounded-md text-xs">Publish</button>
          <button onClick={() => bulkStatus('draft')} className="px-3 py-1 border border-blue-200 bg-white rounded-md text-xs">Draft</button>
          <button onClick={bulkDelete} className="px-3 py-1 border border-red-200 bg-red-50 text-red-700 rounded-md text-xs">Delete</button>
          <button onClick={clearSelection} className="ml-auto text-xs underline">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="w-9 px-3 py-2.5"><input type="checkbox" onChange={e => toggleAll(e.target.checked)} /></th>
              <th className="w-9 px-2 py-2.5"></th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-2.5 w-[30%]">Title</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-2.5 w-[17%]">Category</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-2.5 w-[11%]">Views</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-2.5 w-[10%]">SEO</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-2.5 w-[11%]">Status</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-2.5 w-[12%]">Date</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-2.5 w-[9%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-3 py-3">
                      <div className="h-3 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-10 text-gray-400 text-xs">No posts found</td></tr>
            ) : (
              paginated.map(p => (
                <tr key={p._id}
                  className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${selected.has(p._id) ? 'bg-blue-50' : ''}`}
                  onClick={() => toggleOne(p._id)}
                >
                  <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(p._id)} onChange={() => toggleOne(p._id)} />
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="w-9 h-6 rounded bg-gray-100 flex items-center justify-center">
                      <span className="text-[10px]">📄</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-medium text-gray-800 truncate" title={p.title}>{p.title}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{p.category?.name}</span>
                  </td>
                  <td className="px-3 py-2.5"><ViewsBar views={p.views || 0} max={maxViews} /></td>
                  <td className="px-3 py-2.5"><SeoStatus score={seoScore(p)} /></td>
                  <td className="px-3 py-2.5" onClick={e => { e.stopPropagation(); togglePublish(p); }}>
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-3 py-2.5 text-xs text-gray-400">{p.createdAt?.slice(0, 10)}</td>
                  <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => window.open(`https://kraviona.com/blog/${p.slug}`, '_blank')}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-green-50 hover:border-green-200 hover:text-green-700 text-gray-400">
                        <FiEye size={13} />
                      </button>
                      <button onClick={() => navigate(`/dashboard/blog/${p._id}/edit`)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-gray-400">
                        <FiEdit3 size={13} />
                      </button>
                      <button onClick={() => setDelTarget(p)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-gray-400">
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          <span>
            {filtered.length === 0 ? 'No posts' :
              `Showing ${(page-1)*PAGE_SIZE+1}–${Math.min(page*PAGE_SIZE, filtered.length)} of ${filtered.length} posts`}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`px-2.5 py-1 rounded-lg border text-xs ${page === i+1 ? 'bg-[#235056] text-white border-[#235056]' : 'border-gray-200 hover:bg-gray-50'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {delTarget && (
        <ConfirmDialog
          post={delTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDelTarget(null)}
        />
      )}
    </div>
  );
}