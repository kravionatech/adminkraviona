// src/pages/dashboard/index.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiFileText, FiMail, FiEye, FiMessageSquare,
  FiBriefcase, FiStar, FiBell, FiRefreshCw
} from 'react-icons/fi';
import {
  Line, Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Tooltip, Filler
} from 'chart.js';
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Filler);

// ─── API CALL LOG ─────────────────────────────────────────────────
let globalLog = [];
const subscribers = new Set();
function pushLog(entry) {
  globalLog = [entry, ...globalLog].slice(0, 50);
  subscribers.forEach(fn => fn([...globalLog]));
}
function useApiLog() {
  const [log, setLog] = useState([...globalLog]);
  useEffect(() => { subscribers.add(setLog); return () => subscribers.delete(setLog); }, []);
  return log;
}

// ─── MOCK DATA (fallback when API is down) ────────────────────────
const MOCK = {
  leads: { total: 247, new: 18, contacted: 41, qualified: 29, closed_won: 63, thisMonth: 18 },
  posts: { total: 9, published: 9, draft: 2, totalViews: 1125 },
  messages: { total: 34, unread: 7 },
  subscribers: { total: 182, active: 174, thisMonth: 14 },
  projects: { total: 8, featured: 3 },
  notifications: { unread: 5 },
  leadsChart: [12, 18, 24, 15, 31, 27, 19, 38, 42, 29, 35, 18],
  recentLeads: [
    { _id: '1', name: 'Rahul Sharma',  service: 'MERN Stack',     status: 'new',       createdAt: '2026-05-31' },
    { _id: '2', name: 'Priya Singh',   service: 'Technical SEO',  status: 'qualified', createdAt: '2026-05-30' },
    { _id: '3', name: 'Amit Verma',    service: 'React.js',       status: 'contacted', createdAt: '2026-05-29' },
    { _id: '4', name: 'Sanya Kapoor',  service: 'SaaS Dev',       status: 'closed_won',createdAt: '2026-05-28' },
    { _id: '5', name: 'Rohan Das',     service: 'Node.js',        status: 'new',       createdAt: '2026-05-27' },
  ],
  topPosts: [
    { _id: '1', title: 'Ultimate MERN Stack Roadmap 2026', views: 267, status: 'published' },
    { _id: '2', title: '10 Benefits of AI',                views: 177, status: 'published' },
    { _id: '3', title: '10 Web 3.0 Benefits',              views: 138, status: 'published' },
    { _id: '4', title: 'AI-Driven SEO 2026',               views: 131, status: 'published' },
    { _id: '5', title: 'AI Revolutionizing Dev',           views: 110, status: 'published' },
  ],
};

// ─── STATUS PILL ──────────────────────────────────────────────────
const STATUS_STYLES = {
  new:         'bg-blue-50   text-blue-800',
  contacted:   'bg-amber-50  text-amber-800',
  qualified:   'bg-purple-50 text-purple-800',
  closed_won:  'bg-green-50  text-green-800',
  closed_lost: 'bg-red-50    text-red-800',
  published:   'bg-green-50  text-green-800',
  draft:       'bg-gray-100  text-gray-600',
};
const StatusPill = ({ status }) => (
  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
    {status.replace('_', ' ')}
  </span>
);

// ─── STAT CARD ────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, color, value, label, badge, up }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      {badge && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${up === true ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
          {badge}
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-medium text-gray-900">{value?.toLocaleString?.() ?? value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  </div>
);

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData]         = useState(null);
  const [apiStatus, setApiStatus] = useState('loading'); // 'ok' | 'error' | 'loading'
  const [lastUpdated, setLastUpdated] = useState('');
  const navigate = useNavigate();
  const apiLog = useApiLog();

  // Wrapped API call — logs every request
  const call = async (endpoint, method = 'GET', body = null) => {
    const start = Date.now();
    const time = new Date().toLocaleTimeString('en-IN');
    try {
      const res = method === 'GET'
        ? await axios.get(endpoint)
        : await axios.post(endpoint, body);
      pushLog({ time, method, endpoint, status: res.status, ms: Date.now() - start });
      return { ok: true, data: res.data };
    } catch (err) {
      const status = err.response?.status ?? 'ERR';
      pushLog({ time, method, endpoint, status, ms: Date.now() - start });
      return { ok: false, data: null, status };
    }
  };

  const fetchAll = async () => {
    setApiStatus('loading');
    const { ok, data: res } = await call('/dashboard/stats');

    if (ok && res?.success) {
      setData(res.data);
      setApiStatus('ok');
    } else {
      // Fallback: individual calls for log visibility
      await call('/auth/me');
      await call('/blog/posts?limit=5&sort=views&order=desc');
      await call('/leads?limit=6&sort=createdAt&order=desc');
      await call('/newsletter/stats');
      setData(MOCK);
      setApiStatus('error');
    }
    setLastUpdated(new Date().toLocaleTimeString('en-IN'));
  };

  useEffect(() => { fetchAll(); }, []);

  const d = data ?? MOCK;
  const months = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];

  const lineData = {
    labels: months,
    datasets: [{
      label: 'Leads',
      data: d.leadsChart,
      borderColor: '#235056',
      backgroundColor: 'rgba(35,80,86,0.08)',
      fill: true, tension: 0.4, pointRadius: 3,
    }],
  };

  const donutData = {
    labels: ['New', 'Contacted', 'Qualified', 'Won', 'Other'],
    datasets: [{
      data: [
        d.leads.new, d.leads.contacted, d.leads.qualified,
        d.leads.closed_won,
        d.leads.total - d.leads.new - d.leads.contacted - d.leads.qualified - d.leads.closed_won
      ],
      backgroundColor: ['#378ADD','#EF9F27','#7F77DD','#639922','#888780'],
      borderWidth: 0,
    }],
  };

  const statCards = [
    { icon: FiUsers,        color: 'bg-blue-50 text-blue-700',   value: d.leads.total,           label: 'Total leads',        badge: `+${d.leads.thisMonth} this month`, up: true  },
    { icon: FiFileText,     color: 'bg-green-50 text-green-700', value: d.posts.published,        label: 'Published posts',    badge: `${d.posts.total} total`                       },
    { icon: FiMail,         color: 'bg-amber-50 text-amber-700', value: d.subscribers.active,     label: 'Newsletter subs',    badge: `+${d.subscribers.thisMonth} this month`, up: true },
    { icon: FiEye,          color: 'bg-teal-50 text-teal-700',   value: d.posts.totalViews,       label: 'Total post views',   badge: 'all time'                                    },
    { icon: FiMessageSquare,color: 'bg-purple-50 text-purple-700',value: d.messages.unread,       label: 'Unread messages',    badge: `${d.messages.total} total`                   },
    { icon: FiBriefcase,    color: 'bg-orange-50 text-orange-700',value: d.projects.total,        label: 'Projects',           badge: `${d.projects.featured} featured`             },
    { icon: FiStar,         color: 'bg-green-50 text-green-700', value: d.leads.closed_won,       label: 'Closed won',         badge: `of ${d.leads.total} leads`, up: true         },
    { icon: FiBell,         color: 'bg-blue-50 text-blue-700',   value: d.notifications.unread,   label: 'Notifications',      badge: 'unread'                                      },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="text-base font-medium text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400">
            {apiStatus === 'loading' ? 'Fetching...' : `Updated ${lastUpdated}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500">
            <span className={`w-2 h-2 rounded-full ${apiStatus === 'ok' ? 'bg-green-500' : apiStatus === 'error' ? 'bg-red-400' : 'bg-amber-400'}`} />
            {apiStatus === 'ok' ? 'API connected' : apiStatus === 'error' ? 'API error — mock data' : 'Connecting...'}
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            <FiRefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-5">

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-3">
          {statCards.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 bg-white border border-gray-100 rounded-xl p-5">
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-900">Leads over 12 months</div>
              <div className="text-xs text-gray-400 font-mono">GET /api/v1/dashboard/stats → leadsChart</div>
            </div>
            <div className="h-48">
              <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } }, y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } } } }} />
            </div>
          </div>
          <div className="col-span-2 bg-white border border-gray-100 rounded-xl p-5">
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-900">Leads by status</div>
              <div className="text-xs text-gray-400 font-mono">GET /api/v1/dashboard/stats → leads</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 flex-shrink-0">
                <Doughnut data={donutData} options={{ cutout: '68%', plugins: { legend: { display: false } } }} />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                {[
                  ['New', d.leads.new, '#378ADD'],
                  ['Contacted', d.leads.contacted, '#EF9F27'],
                  ['Qualified', d.leads.qualified, '#7F77DD'],
                  ['Won', d.leads.closed_won, '#639922'],
                ].map(([label, val, color]) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                      {label}
                    </div>
                    <span className="font-medium text-gray-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Recent Leads */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-900">Recent leads</div>
              <button onClick={() => navigate('/dashboard/leads')} className="text-xs text-blue-600 hover:underline">View all →</button>
            </div>
            <table className="w-full text-xs" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-gray-400 font-medium pb-2 w-2/5">Name</th>
                  <th className="text-left text-gray-400 font-medium pb-2 w-1/4">Service</th>
                  <th className="text-left text-gray-400 font-medium pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {d.recentLeads.map(l => (
                  <tr key={l._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-medium text-gray-800 truncate">{l.name}</td>
                    <td className="py-2 text-gray-500 truncate">{l.service}</td>
                    <td className="py-2"><StatusPill status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Posts */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-900">Top blog posts</div>
              <button onClick={() => navigate('/dashboard/blog')} className="text-xs text-blue-600 hover:underline">View all →</button>
            </div>
            <table className="w-full text-xs" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-gray-400 font-medium pb-2 w-3/5">Title</th>
                  <th className="text-left text-gray-400 font-medium pb-2 w-1/5">Views</th>
                  <th className="text-left text-gray-400 font-medium pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {d.topPosts.map(p => (
                  <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-medium text-gray-800 truncate">{p.title}</td>
                    <td className="py-2 text-gray-700 font-medium">{p.views.toLocaleString()}</td>
                    <td className="py-2"><StatusPill status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Log */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium text-gray-900">Live API call log</div>
              <div className="text-xs text-gray-400">All requests made this session</div>
            </div>
          </div>
          <div className="font-mono text-[11px] bg-gray-50 rounded-lg p-3 flex flex-col gap-1.5 max-h-36 overflow-y-auto">
            {apiLog.length === 0 && <span className="text-gray-400">No calls yet...</span>}
            {apiLog.map((l, i) => (
              <div key={i} className="flex gap-3 items-center">
                <span className="text-gray-400 flex-shrink-0">{l.time}</span>
                <span className={`flex-shrink-0 font-medium ${l.method === 'GET' ? 'text-blue-600' : 'text-green-700'}`}>{l.method}</span>
                <span className="text-gray-500 flex-1 truncate">{l.endpoint}</span>
                <span className={`flex-shrink-0 font-medium ${String(l.status).startsWith('2') ? 'text-green-700' : 'text-red-600'}`}>{l.status}</span>
                <span className="text-gray-400 flex-shrink-0">{l.ms}ms</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}