// src/pages/dashboard/blog/ContentDecay.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiDownload, FiCheckSquare, FiSearch, FiRefreshCw,
  FiCheck, FiEdit3, FiExternalLink, FiInfo, FiAlertTriangle,
  FiActivity, FiBarChart2
} from 'react-icons/fi';
import axios from "axios";

// ─── HELPERS ─────────────────────────────────────────────────────
const TODAY = new Date();

function daysSince(dateStr) {
  return Math.floor((TODAY - new Date(dateStr)) / 86400000);
}

function decayStatus(days) {
  if (days < 30)  return 'Fresh';
  if (days < 90)  return 'Review';
  return 'Stale';
}

function barColor(days) {
  if (days < 30)  return '#639922';
  if (days < 90)  return '#EF9F27';
  return '#E24B4A';
}

function barWidth(days) {
  return Math.min(100, Math.round((days / 180) * 100));
}

// ─── MOCK DATA (fallback when API offline) ────────────────────────
const MOCK_POSTS = [
  { _id:'1', title:'Why Choosing a Top MERN Stack Development Company in India Changes the Game', category:{ name:'Next gen web' }, lastReviewedAt:'2026-05-31', views:3,   slug:'why-choosing-mern' },
  { _id:'2', title:'What is MERN Stack? The Complete 2026 Guide for Developer',                  category:{ name:'Next gen web' }, lastReviewedAt:'2026-05-20', views:68,  slug:'what-is-mern-stack' },
  { _id:'3', title:'Website Development Company in Delhi',                                       category:{ name:'Next gen web' }, lastReviewedAt:'2026-05-08', views:111, slug:'website-dev-delhi' },
  { _id:'4', title:'AI-Driven SEO: How Machine Learning is Redefining Organic Search in 2026',  category:{ name:'AI & automation' }, lastReviewedAt:'2026-04-15', views:131, slug:'ai-driven-seo' },
  { _id:'5', title:'How AI is Revolutionizing Full-Stack Web Development in 2026',               category:{ name:'AI & automation' }, lastReviewedAt:'2026-04-10', views:110, slug:'ai-full-stack' },
  { _id:'6', title:'The Rise of Autonomous AI Agents: Transforming Work in 2026',               category:{ name:'AI & automation' }, lastReviewedAt:'2026-04-01', views:121, slug:'ai-agents-2026' },
  { _id:'7', title:'The Ultimate MERN Stack Developer Roadmap 2026',                            category:{ name:'Next gen web' }, lastReviewedAt:'2026-03-20', views:267, slug:'mern-roadmap' },
  { _id:'8', title:'10 Game-Changing Benefits of Web 3.0: The Future of Ownership',             category:{ name:'Web 3' },        lastReviewedAt:'2026-02-10', views:138, slug:'web3-benefits' },
  { _id:'9', title:'10 Benefits of Artificial Intelligence: Transforming the Future',           category:{ name:'AI & automation' }, lastReviewedAt:'2026-01-28', views:177, slug:'10-benefits-ai' },
];

// ─── SMALL COMPONENTS ─────────────────────────────────────────────

const StatusPill = ({ status }) => {
  const styles = {
    Fresh:  'bg-green-50  text-green-800',
    Review: 'bg-amber-50  text-amber-800',
    Stale:  'bg-red-50    text-red-700',
  };
  const dots = {
    Fresh: '#639922', Review: '#EF9F27', Stale: '#E24B4A',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: dots[status] }} />
      {status}
    </span>
  );
};

const DecayBar = ({ days }) => (
  <div className="flex items-center gap-2">
    <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: barWidth(days) + '%', background: barColor(days) }}
      />
    </div>
  </div>
);

const StatCard = ({ icon: Icon, color, value, label }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={18} />
    </div>
    <div>
      <div className="text-xl font-medium text-gray-900">{value}</div>
      <div className="text-[11px] text-gray-400">{label}</div>
    </div>
  </div>
);

const Toast = ({ msg }) => (
  <div className={`fixed bottom-5 right-5 z-50 bg-[#235056] text-white text-xs px-4 py-2.5 rounded-lg shadow-lg transition-all duration-300 ${msg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
    <FiCheck size={12} className="inline mr-1.5" />
    {msg}
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────
const PER_PAGE = 8;

export default function ContentDecay() {
  const navigate = useNavigate();
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilter] = useState('');
  const [sortKey, setSort]      = useState('days-desc');
  const [selected, setSelected] = useState(new Set());
  const [page, setPage]         = useState(1);
  const [toast, setToast]       = useState('');

  // ── Fetch from API ────────────────────────────────────────────
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/blog/posts/decay-report');
      if (data.success) {
        setPosts(normalize(data.data));
      } else {
        throw new Error();
      }
    } catch {
      // fallback to mock
      setPosts(normalize(MOCK_POSTS));
    } finally {
      setLoading(false);
    }
  };

  const normalize = (raw) =>
    raw.map(p => ({
      ...p,
      days:   daysSince(p.lastReviewedAt || p.createdAt),
      status: decayStatus(daysSince(p.lastReviewedAt || p.createdAt)),
    }));

  useEffect(() => { fetchPosts(); }, []);

  // ── Filter + sort ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    let arr = posts.filter(p =>
      (!search       || p.title.toLowerCase().includes(search.toLowerCase())) &&
      (!filterStatus || p.status === filterStatus)
    );
    if (sortKey === 'days-desc')  arr.sort((a, b) => b.days - a.days);
    if (sortKey === 'days-asc')   arr.sort((a, b) => a.days - b.days);
    if (sortKey === 'views-desc') arr.sort((a, b) => b.views - a.views);
    return arr;
  }, [posts, search, filterStatus, sortKey]);

  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  // ── Stats ─────────────────────────────────────────────────────
  const fresh  = posts.filter(p => p.status === 'Fresh').length;
  const review = posts.filter(p => p.status === 'Review').length;
  const stale  = posts.filter(p => p.status === 'Stale').length;
  const avgDays = posts.length
    ? Math.round(posts.reduce((a, p) => a + p.days, 0) / posts.length)
    : 0;

  // ── Priority list (stale + high views) ───────────────────────
  const priority = [...posts]
    .filter(p => p.status === 'Stale')
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  // ── Actions ───────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const markReviewed = async (id) => {
    try {
      await axios.put(`/blog/posts/${id}/reviewed`);
    } catch { }
    setPosts(prev =>
      prev.map(p => p._id === id
        ? { ...p, lastReviewedAt: new Date().toISOString(), days: 0, status: 'Fresh' }
        : p
      )
    );
    showToast('Post marked as reviewed');
  };

  const bulkMarkReviewed = async () => {
    if (!selected.size) { showToast('Select posts first'); return; }
    await Promise.allSettled(
      [...selected].map(id => axios.put(`/blog/posts/${id}/reviewed`))
    );
    const now = new Date().toISOString();
    setPosts(prev =>
      prev.map(p => selected.has(p._id)
        ? { ...p, lastReviewedAt: now, days: 0, status: 'Fresh' }
        : p
      )
    );
    showToast(`${selected.size} posts marked as reviewed`);
    setSelected(new Set());
  };

  const toggleOne = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const toggleAll = (checked) => {
    setSelected(checked ? new Set(paginated.map(p => p._id)) : new Set());
  };

  const exportCSV = () => {
    const rows = [
      ['Title', 'Category', 'Status', 'Last Reviewed', 'Days Ago', 'Views'],
      ...filtered.map(p => [
        p.title,
        p.category?.name,
        p.status,
        p.lastReviewedAt?.slice(0, 10),
        p.days,
        p.views,
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'content-decay-report.csv';
    a.click();
    showToast('Report downloaded');
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Topbar */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-gray-700">Dashboard</span>
          <span>/</span>
          <span className="cursor-pointer hover:text-gray-700">Blog engine</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Content decay</span>
        </nav>
        <div className="flex gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FiDownload size={13} /> Export report
          </button>
          <button onClick={bulkMarkReviewed}
            className="flex items-center gap-1.5 text-xs px-4 py-2 bg-[#235056] text-white rounded-lg hover:opacity-90">
            <FiCheckSquare size={13} /> Mark selected reviewed
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800">
          <FiInfo size={15} className="flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-medium">What is content decay? </span>
            Posts not reviewed in 90+ days are marked <strong>Stale</strong>. Google penalises outdated content —
            review and update stale posts to protect your rankings. Click the
            <FiCheck size={11} className="inline mx-1" />
            button on any row to mark it as reviewed today.
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard icon={FiActivity}   color="bg-green-50 text-green-700"  value={fresh}   label="Fresh (< 30 days)" />
          <StatCard icon={FiAlertTriangle} color="bg-amber-50 text-amber-700" value={review} label="Needs review (30–90d)" />
          <StatCard icon={FiAlertTriangle} color="bg-red-50   text-red-700"   value={stale}  label="Stale (> 90 days)" />
          <StatCard icon={FiBarChart2}  color="bg-blue-50  text-blue-700"  value={avgDays + 'd'} label="Avg days since review" />
        </div>

        {/* Main table card */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-sm font-medium text-gray-900">Post freshness report</div>
              <div className="text-[11px] text-gray-400 font-mono">GET /api/v1/blog/posts/decay-report</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <FiSearch size={12} className="text-gray-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="text-xs bg-transparent outline-none w-36 text-gray-700 placeholder-gray-400"
                  placeholder="Search posts..." />
              </div>
              <select value={filterStatus} onChange={e => { setFilter(e.target.value); setPage(1); }}
                className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white">
                <option value="">All statuses</option>
                <option value="Fresh">Fresh only</option>
                <option value="Review">Needs review</option>
                <option value="Stale">Stale only</option>
              </select>
              <select value={sortKey} onChange={e => setSort(e.target.value)}
                className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white">
                <option value="days-desc">Most overdue first</option>
                <option value="days-asc">Most recent first</option>
                <option value="views-desc">Most views first</option>
              </select>
              <button onClick={() => { setSearch(''); setFilter(''); setSort('days-desc'); setPage(1); fetchPosts(); }}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <FiRefreshCw size={13} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="w-9 px-3 py-2.5">
                  <input type="checkbox" onChange={e => toggleAll(e.target.checked)} />
                </th>
                <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[28%]">Post title</th>
                <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[14%]">Category</th>
                <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[10%]">Status</th>
                <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[12%]">Last reviewed</th>
                <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[9%]">Days ago</th>
                <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[10%]">Decay health</th>
                <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[7%]">Views</th>
                <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[9%]">Actions</th>
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
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-400 text-xs">
                    No posts match this filter
                  </td>
                </tr>
              ) : (
                paginated.map(p => {
                  const daysColor = p.days > 90
                    ? 'text-red-700 font-medium'
                    : p.days > 30
                    ? 'text-amber-700 font-medium'
                    : 'text-green-700 font-medium';

                  return (
                    <tr key={p._id}
                      className={`border-b border-gray-50 hover:bg-gray-50 ${selected.has(p._id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-3 py-2.5">
                        <input type="checkbox"
                          checked={selected.has(p._id)}
                          onChange={() => toggleOne(p._id)} />
                      </td>
                      <td className="px-3 py-2.5 font-medium text-gray-800 truncate" title={p.title}>
                        {p.title}
                      </td>
                      <td className="px-3 py-2.5 text-gray-500 text-xs truncate">
                        {p.category?.name}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusPill status={p.status} />
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-400">
                        {p.lastReviewedAt?.slice(0, 10) ?? '—'}
                      </td>
                      <td className={`px-3 py-2.5 text-xs ${daysColor}`}>
                        {p.days}d
                      </td>
                      <td className="px-3 py-2.5">
                        <DecayBar days={p.days} />
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">
                        {p.views?.toLocaleString()}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          {/* Mark reviewed */}
                          <button
                            onClick={() => markReviewed(p._id)}
                            title="Mark as reviewed today"
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors">
                            <FiCheck size={13} />
                          </button>
                          {/* Edit post */}
                          <button
                            onClick={() => navigate(`/dashboard/blog/${p._id}/edit`)}
                            title="Edit post"
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
                            <FiEdit3 size={13} />
                          </button>
                          {/* View on site */}
                          <button
                            onClick={() => window.open(`https://kraviona.com/blog/${p.slug}`, '_blank')}
                            title="View on site"
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-colors">
                            <FiExternalLink size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            <span>
              {filtered.length === 0
                ? 'No posts'
                : `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length} posts`}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${page === i + 1 ? 'bg-[#235056] text-white border-[#235056]' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-4">

          {/* Decay timeline bars */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-sm font-medium text-gray-900 mb-4">Decay timeline</div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Fresh (< 30d)',   count: fresh,  color: '#639922', bg: '#EAF3DE' },
                { label: 'Review (30–90d)', count: review, color: '#EF9F27', bg: '#FAEEDA' },
                { label: 'Stale (> 90d)',   count: stale,  color: '#E24B4A', bg: '#FCEBEB' },
              ].map(({ label, count, color, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-background-secondary)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${posts.length ? Math.round((count / posts.length) * 100) : 0}%`, background: bg, border: `0.5px solid ${color}` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority stale posts */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-900">High-priority stale posts</div>
              <div className="text-[11px] text-gray-400">Stale + most viewed — review first</div>
            </div>
            <div className="flex flex-col gap-2">
              {priority.length === 0 ? (
                <div className="text-center py-5 text-xs text-gray-400">
                  No stale posts — great work! 🎉
                </div>
              ) : (
                priority.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-3 p-2.5 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <span className="w-6 h-6 rounded-full bg-red-50 text-red-700 text-[10px] font-medium flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">{p.title}</div>
                      <div className="text-[11px] text-gray-400">{p.days}d old · {p.views?.toLocaleString()} views</div>
                    </div>
                    <button onClick={() => markReviewed(p._id)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:border-green-200 hover:text-green-700 flex-shrink-0">
                      <FiCheck size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Toast */}
      <Toast msg={toast} />
    </div>
  );
}