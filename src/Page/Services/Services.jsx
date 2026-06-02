// src/pages/dashboard/Services.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus, FiSearch, FiDownload, FiGrid, FiList,
  FiEdit3, FiTrash2, FiExternalLink, FiX, FiSave,
  FiLayers, FiCheckCircle, FiTag, FiStar, FiMenu,
} from 'react-icons/fi';
import { BsGripVertical } from 'react-icons/bs';
import axios from 'axios';

// ─── CONSTANTS ────────────────────────────────────────────────────
const CAT_LABELS = {
  'web-development':     'Web development',
  'backend-architecture':'Backend architecture',
  'performance-ai':      'Performance & AI',
};
const CAT_COLORS = {
  'web-development':     { bg: '#E6F1FB', text: '#0C447C' },
  'backend-architecture':{ bg: '#EEEDFE', text: '#3C3489' },
  'performance-ai':      { bg: '#EAF3DE', text: '#27500A' },
};
const BADGE_COLORS = {
  'Top rated':    { bg: '#FAEEDA', text: '#633806' },
  'Most popular': { bg: '#E1F5EE', text: '#085041' },
  'New':          { bg: '#EEEDFE', text: '#3C3489' },
};

// ─── MOCK DATA ────────────────────────────────────────────────────
const MOCK = [
  { _id:'1', icon:'⚡', title:'MERN stack development',       slug:'mern-stack-development',       category:'web-development',      shortDesc:'MongoDB, Express, React & Node.js full-stack apps built for scale.', badge:'Top rated',    isActive:true,  order:1,  features:['MongoDB schema design','Express REST API','React.js frontend','Node.js backend','JWT auth','Cloud deployment'], technologies:['MongoDB','Express.js','React.js','Node.js'], faqs:[{question:'How long does it take?',answer:'4–8 weeks depending on scope.'}], seo:{metaTitle:'',metaDescription:'',canonicalUrl:''} },
  { _id:'2', icon:'💻', title:'Full-stack development',        slug:'full-stack-development',        category:'web-development',      shortDesc:'End-to-end web solutions from database to pixel-perfect UI.',           badge:'',             isActive:true,  order:2,  features:['Architecture planning','Frontend & backend','API design','Database setup','DevOps','Testing & QA'], technologies:['React','Node.js','PostgreSQL','Docker'], faqs:[], seo:{} },
  { _id:'3', icon:'⚛',  title:'React.js development',          slug:'react-development',             category:'web-development',      shortDesc:'High-performance SPAs and Next.js apps with SSR.',                      badge:'',             isActive:true,  order:3,  features:['Component library','State management','SSR/SSG','Performance','Testing','Accessibility'], technologies:['React','Next.js','TypeScript','Redux'], faqs:[], seo:{} },
  { _id:'4', icon:'🟢', title:'Node.js development',           slug:'nodejs-development',            category:'web-development',      shortDesc:'Scalable APIs and real-time backend systems.',                          badge:'',             isActive:true,  order:4,  features:['REST APIs','GraphQL','WebSockets','Microservices','Auth systems','Cloud deploy'], technologies:['Node.js','Express','Socket.io','Redis'], faqs:[], seo:{} },
  { _id:'5', icon:'⚙️', title:'Backend development',           slug:'backend-development',           category:'backend-architecture', shortDesc:'Robust, secure server-side logic and system design.',                   badge:'',             isActive:true,  order:5,  features:['System architecture','API design','Auth & RBAC','Caching','Queues','Monitoring'], technologies:['Node.js','PostgreSQL','Redis','RabbitMQ'], faqs:[], seo:{} },
  { _id:'6', icon:'🔌', title:'API development',               slug:'api-development',               category:'backend-architecture', shortDesc:'Custom RESTful and GraphQL APIs built for performance.',                badge:'',             isActive:true,  order:6,  features:['RESTful APIs','GraphQL','API docs','Versioning','Rate limiting','Testing'], technologies:['Express','GraphQL','Swagger','Jest'], faqs:[], seo:{} },
  { _id:'7', icon:'🗄️', title:'Database architecture',        slug:'database-architecture',         category:'backend-architecture', shortDesc:'Optimised MongoDB, PostgreSQL & Redis database structures.',            badge:'',             isActive:true,  order:7,  features:['Schema design','Indexing','Query optimisation','Replication','Backup','Migration'], technologies:['MongoDB','PostgreSQL','Redis','Mongoose'], faqs:[], seo:{} },
  { _id:'8', icon:'☁️', title:'SaaS development',              slug:'saas-development',              category:'backend-architecture', shortDesc:'Scalable multi-tenant SaaS platforms with billing & auth.',            badge:'',             isActive:true,  order:8,  features:['Multi-tenancy','Subscription billing','OAuth','Analytics','Admin panel','Scalability'], technologies:['Node.js','Stripe','Auth0','AWS'], faqs:[], seo:{} },
  { _id:'9', icon:'📈', title:'Technical SEO',                 slug:'technical-seo',                 category:'performance-ai',       shortDesc:'Core Web Vitals, crawlability, and structured data.',                  badge:'Most popular', isActive:true,  order:9,  features:['Site audit','Core Web Vitals','Schema markup','Sitemap','Robots.txt','Crawl fix'], technologies:['Screaming Frog','PageSpeed','Search Console','Ahrefs'], faqs:[{question:'How soon will I see results?',answer:'Typically 60–90 days for ranking improvements.'}], seo:{} },
  { _id:'10',icon:'🚀', title:'Web performance optimisation',  slug:'web-performance-optimization',  category:'performance-ai',       shortDesc:'Lighthouse 90+ scores and real-user speed improvements.',             badge:'',             isActive:true,  order:10, features:['Lighthouse audit','Image optimisation','Code splitting','CDN setup','Lazy loading','Caching'], technologies:['Webpack','Next.js','Cloudinary','Vercel'], faqs:[], seo:{} },
  { _id:'11',icon:'🤖', title:'AI automation',                 slug:'ai-automation',                 category:'performance-ai',       shortDesc:'LLM integration, AI workflows, and smart automation.',                 badge:'New',          isActive:true,  order:11, features:['LLM integration','Prompt engineering','AI pipelines','Data processing','Chatbots','Embeddings'], technologies:['OpenAI','LangChain','Pinecone','Python'], faqs:[], seo:{} },
];

// ─── EMPTY FORM ───────────────────────────────────────────────────
const EMPTY = {
  icon: '🔧', title: '', slug: '', category: 'web-development',
  shortDesc: '', longDesc: '', badge: '', isActive: true, order: 0,
  features: [''], technologies: [''],
  faqs: [{ question: '', answer: '' }],
  seo: { metaTitle: '', metaDescription: '', canonicalUrl: '' },
};

// ─── SMALL COMPONENTS ─────────────────────────────────────────────
const Toast = ({ msg }) => (
  <div className={`fixed bottom-5 right-5 z-50 bg-[#235056] text-white text-xs px-4 py-2.5 rounded-lg transition-all duration-300 ${msg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
    {msg}
  </div>
);

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)} aria-label="Toggle active"
    className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${value ? 'bg-[#235056]' : 'bg-gray-300'}`}>
    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-4' : 'left-0.5'}`} />
  </button>
);

const CatChip = ({ cat }) => {
  const c = CAT_COLORS[cat] || { bg: '#F1EFE8', text: '#444441' };
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{ background: c.bg, color: c.text }}>
      {CAT_LABELS[cat] || cat}
    </span>
  );
};

const BadgePill = ({ badge }) => {
  if (!badge) return null;
  const c = BADGE_COLORS[badge] || { bg: '#F1EFE8', text: '#444441' };
  return (
    <span className="text-[9px] font-medium px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text }}>
      {badge}
    </span>
  );
};

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

// ─── LIST BUILDER ─────────────────────────────────────────────────
const ListBuilder = ({ items, onChange, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    {items.map((item, i) => (
      <div key={i} className="flex items-center gap-2">
        <input value={item}
          onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
          className="flex-1 text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#235056]"
          placeholder={`${placeholder} ${i + 1}`} />
        <button onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          className="text-gray-300 hover:text-red-500"><FiX size={13} /></button>
      </div>
    ))}
    <button onClick={() => onChange([...items, ''])}
      className="text-[11px] text-blue-600 hover:underline text-left mt-0.5">
      + Add {placeholder.toLowerCase()}
    </button>
  </div>
);

// ─── FAQ BUILDER ──────────────────────────────────────────────────
const FaqBuilder = ({ faqs, onChange }) => (
  <div className="flex flex-col gap-2">
    {faqs.map((faq, i) => (
      <div key={i} className="border border-gray-100 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-medium text-gray-400">FAQ {i + 1}</span>
          <button onClick={() => onChange(faqs.filter((_, idx) => idx !== i))}
            className="text-gray-300 hover:text-red-500"><FiX size={13} /></button>
        </div>
        <input value={faq.question}
          onChange={e => { const n = [...faqs]; n[i] = { ...n[i], question: e.target.value }; onChange(n); }}
          className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#235056] mb-2"
          placeholder="Question..." />
        <textarea value={faq.answer}
          onChange={e => { const n = [...faqs]; n[i] = { ...n[i], answer: e.target.value }; onChange(n); }}
          className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#235056] resize-none"
          rows={2} placeholder="Answer..." />
      </div>
    ))}
    <button onClick={() => onChange([...faqs, { question: '', answer: '' }])}
      className="text-[11px] text-blue-600 hover:underline text-left">
      + Add FAQ
    </button>
  </div>
);

// ─── SERVICE MODAL ────────────────────────────────────────────────
const ServiceModal = ({ service, onClose, onSave }) => {
  const [form, setForm] = useState(service || EMPTY);
  const [tab, setTab]   = useState('basic');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setSeo = (key, val) => setForm(f => ({ ...f, seo: { ...f.seo, [key]: val } }));

  const autoSlug = (title) => {
    set('title', title);
    if (!form._id) set('slug', title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80));
  };

  const handleSave = () => {
    if (!form.title.trim()) return alert('Title is required');
    if (!form.category) return alert('Category is required');
    onSave(form);
  };

  const TABS = ['basic', 'seo', 'features', 'faqs'];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 px-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-2xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <span className="text-sm font-medium text-gray-900">
            {service?._id ? 'Edit service' : 'Add service'}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><FiX size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 bg-gray-50">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-[#235056] text-[#235056] bg-white' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">

          {tab === 'basic' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Icon (emoji) *</label>
                  <input value={form.icon} onChange={e => set('icon', e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056]"
                    placeholder="⚡" />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Badge</label>
                  <select value={form.badge} onChange={e => set('badge', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none">
                    <option value="">None</option>
                    <option>Top rated</option>
                    <option>Most popular</option>
                    <option>New</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Service title *</label>
                <input value={form.title} onChange={e => autoSlug(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056]"
                  placeholder="e.g. MERN Stack Development" />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Slug</label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <span className="px-3 py-2 text-[11px] text-gray-400 bg-gray-50 border-r border-gray-200 whitespace-nowrap">kraviona.com/services/</span>
                  <input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="flex-1 text-xs px-3 py-2 outline-none bg-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Category *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none">
                    <option value="web-development">Web development</option>
                    <option value="backend-architecture">Backend architecture</option>
                    <option value="performance-ai">Performance & AI</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => set('order', parseInt(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none" min={1} />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Short description * (for service cards)</label>
                <textarea value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} rows={2}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056] resize-none leading-relaxed"
                  placeholder="Brief description shown on the services listing page (~100 chars)" />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Long description (for service detail page)</label>
                <textarea value={form.longDesc} onChange={e => set('longDesc', e.target.value)} rows={4}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056] resize-none leading-relaxed"
                  placeholder="Detailed description shown on the individual service page..." />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-800">Active</div>
                  <div className="text-[11px] text-gray-400">Show this service on the website</div>
                </div>
                <Toggle value={form.isActive} onChange={val => set('isActive', val)} />
              </div>
            </div>
          )}

          {tab === 'seo' && (
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-medium text-gray-500">Meta title</label>
                  <span className={`text-[10px] ${form.seo.metaTitle?.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                    {form.seo.metaTitle?.length || 0} / 60
                  </span>
                </div>
                <input value={form.seo.metaTitle || ''} onChange={e => setSeo('metaTitle', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056]"
                  placeholder="SEO title (50–60 chars)" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-medium text-gray-500">Meta description</label>
                  <span className={`text-[10px] ${form.seo.metaDescription?.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                    {form.seo.metaDescription?.length || 0} / 160
                  </span>
                </div>
                <textarea value={form.seo.metaDescription || ''} onChange={e => setSeo('metaDescription', e.target.value)} rows={3}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056] resize-none leading-relaxed"
                  placeholder="SEO description (120–160 chars)" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Canonical URL</label>
                <input value={form.seo.canonicalUrl || ''} onChange={e => setSeo('canonicalUrl', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056]"
                  placeholder={`https://kraviona.com/services/${form.slug || 'service-slug'}`} />
              </div>
              {/* Live SERP preview */}
              {(form.seo.metaTitle || form.seo.metaDescription) && (
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-2">SERP preview</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-green-700 truncate mb-0.5">kraviona.com/services/{form.slug}</div>
                    <div className="text-sm text-blue-700 font-medium truncate mb-1">{form.seo.metaTitle || form.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{form.seo.metaDescription || form.shortDesc}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'features' && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-2">What's included (numbered feature cards)</label>
                <ListBuilder items={form.features} onChange={val => set('features', val)} placeholder="Feature" />
              </div>
              <div className="border-t border-gray-100 pt-4">
                <label className="text-[11px] font-medium text-gray-500 block mb-2">Technologies used</label>
                <ListBuilder items={form.technologies} onChange={val => set('technologies', val)} placeholder="Technology" />
              </div>
            </div>
          )}

          {tab === 'faqs' && (
            <div>
              <p className="text-[11px] text-gray-400 mb-3">FAQ entries shown on the service detail page.</p>
              <FaqBuilder faqs={form.faqs} onChange={val => set('faqs', val)} />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0 bg-white">
          <button onClick={onClose} className="text-xs px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave}
            className="flex items-center gap-1.5 text-xs px-4 py-2 bg-[#235056] text-white rounded-lg hover:opacity-90">
            <FiSave size={13} /> Save service
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── CONFIRM DIALOG ───────────────────────────────────────────────
const ConfirmDialog = ({ service, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center">
    <div className="bg-white rounded-xl border border-gray-200 p-6 w-80 shadow-lg">
      <h3 className="text-sm font-medium text-gray-900 mb-1">Delete service?</h3>
      <p className="text-xs text-gray-500 mb-5">"{service?.title}" will be permanently deleted.</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">
          <FiTrash2 size={12} className="inline mr-1" /> Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── SERVICE GRID CARD ────────────────────────────────────────────
const ServiceCard = ({ service, onEdit, onDelete, onToggle, onDragStart, onDragOver, onDrop }) => (
  <div
    draggable
    onDragStart={onDragStart}
    onDragOver={e => { e.preventDefault(); onDragOver(); }}
    onDrop={onDrop}
    className="border border-gray-100 rounded-xl p-4 bg-white hover:border-[#235056] transition-colors cursor-grab"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <BsGripVertical size={14} className="text-gray-300" />
        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-xl">
          {service.icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <BadgePill badge={service.badge} />
        <Toggle value={service.isActive} onChange={() => onToggle(service._id)} />
      </div>
    </div>
    <div className="text-sm font-medium text-gray-900 mb-1">{service.title}</div>
    <div className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">{service.shortDesc}</div>
    <div className="flex items-center justify-between">
      <CatChip cat={service.category} />
      <div className="flex gap-1">
        <button onClick={() => window.open(`https://kraviona.com/services/${service.slug}`, '_blank')}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:border-green-200 hover:text-green-700">
          <FiExternalLink size={12} />
        </button>
        <button onClick={() => onEdit(service)}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700">
          <FiEdit3 size={12} />
        </button>
        <button onClick={() => onDelete(service)}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-700">
          <FiTrash2 size={12} />
        </button>
      </div>
    </div>
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────
export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState('grid');
  const [search, setSearch]     = useState('');
  const [filterCat, setFilterCat]     = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [modal, setModal]       = useState(null); // null | 'add' | service object
  const [delTarget, setDelTarget] = useState(null);
  const [toast, setToast]       = useState('');
  const dragSrc = useRef(null);

  // ── Fetch ─────────────────────────────────────────────────────
  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/services?limit=50');
      if (data.success) setServices(data.data.sort((a, b) => a.order - b.order));
      else throw new Error();
    } catch {
      setServices(MOCK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ── Filter ────────────────────────────────────────────────────
  const filtered = services
    .filter(s =>
      (!search       || s.title.toLowerCase().includes(search.toLowerCase())) &&
      (!filterCat    || s.category === filterCat) &&
      (filterActive === '' || String(s.isActive) === filterActive)
    )
    .sort((a, b) => a.order - b.order);

  // ── Stats ─────────────────────────────────────────────────────
  const active   = services.filter(s => s.isActive).length;
  const cats     = new Set(services.map(s => s.category)).size;
  const badged   = services.filter(s => s.badge).length;

  // ── Toggle active ─────────────────────────────────────────────
  const toggleActive = async (id) => {
    const svc = services.find(s => s._id === id);
    try {
      await axios.put(`/services/${id}`, { isActive: !svc.isActive });
    } catch { }
    setServices(prev => prev.map(s => s._id === id ? { ...s, isActive: !s.isActive } : s));
    showToast(`Service ${svc.isActive ? 'deactivated' : 'activated'}`);
  };

  // ── Save (create or update) ───────────────────────────────────
  const handleSave = async (form) => {
    try {
      if (form._id) {
        await axios.put(`/services/${form._id}`, form);
        setServices(prev => prev.map(s => s._id === form._id ? { ...s, ...form } : s));
        showToast('Service updated');
      } else {
        const { data } = await axios.post('/services', { ...form, order: services.length + 1 });
        setServices(prev => [...prev, data.data || { ...form, _id: Date.now().toString() }]);
        showToast('Service created');
      }
    } catch {
      showToast('Error saving service');
    }
    setModal(null);
  };

  // ── Delete ────────────────────────────────────────────────────
  const confirmDelete = async () => {
    try {
      await axios.delete(`/services/${delTarget._id}`);
    } catch { }
    setServices(prev => prev.filter(s => s._id !== delTarget._id));
    showToast('Service deleted');
    setDelTarget(null);
  };

  // ── Drag & Drop reorder ───────────────────────────────────────
  const onDragStart = (id) => { dragSrc.current = id; };
  const onDrop = async (targetId) => {
    if (!dragSrc.current || dragSrc.current === targetId) return;
    const updated = [...services];
    const si = updated.findIndex(s => s._id === dragSrc.current);
    const ti = updated.findIndex(s => s._id === targetId);
    const [moved] = updated.splice(si, 1);
    updated.splice(ti, 0, moved);
    const reordered = updated.map((s, i) => ({ ...s, order: i + 1 }));
    setServices(reordered);
    dragSrc.current = null;
    try {
      await axios.put('/services/reorder', {
        order: reordered.map(s => ({ id: s._id, order: s.order }))
      });
      showToast('Order saved');
    } catch {
      showToast('Reorder saved locally');
    }
  };

  // ── Export CSV ────────────────────────────────────────────────
  const exportCSV = () => {
    const rows = [
      ['Title', 'Slug', 'Category', 'Badge', 'Active', 'Order'],
      ...services.map(s => [s.title, s.slug, s.category, s.badge, s.isActive, s.order]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'services.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Topbar */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-gray-700">Dashboard</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Services</span>
        </nav>
        <div className="flex gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FiDownload size={13} /> Export
          </button>
          <button onClick={() => setModal({})}
            className="flex items-center gap-1.5 text-xs px-4 py-2 bg-[#235056] text-white rounded-lg hover:opacity-90">
            <FiPlus size={14} /> Add service
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard icon={FiLayers}       color="bg-teal-50  text-teal-700"  value={services.length} label="Total services" />
          <StatCard icon={FiCheckCircle}  color="bg-green-50 text-green-700" value={active}          label="Active" />
          <StatCard icon={FiTag}          color="bg-blue-50  text-blue-700"  value={cats}            label="Categories" />
          <StatCard icon={FiStar}         color="bg-amber-50 text-amber-700" value={badged}          label="Highlighted" />
        </div>

        {/* Main card */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-sm font-medium text-gray-900">All services</div>
              <div className="text-[11px] text-gray-400">Drag cards to reorder · toggle to activate/deactivate</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <FiSearch size={12} className="text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  className="text-xs bg-transparent outline-none w-32 text-gray-700 placeholder-gray-400"
                  placeholder="Search services..." />
              </div>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white">
                <option value="">All categories</option>
                <option value="web-development">Web development</option>
                <option value="backend-architecture">Backend architecture</option>
                <option value="performance-ai">Performance & AI</option>
              </select>
              <select value={filterActive} onChange={e => setFilterActive(e.target.value)}
                className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white">
                <option value="">All status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              {/* View toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setView('grid')}
                  className={`p-2 text-sm ${view === 'grid' ? 'bg-[#235056] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                  title="Grid view" aria-label="Grid view">
                  <FiGrid size={14} />
                </button>
                <button onClick={() => setView('list')}
                  className={`p-2 text-sm ${view === 'list' ? 'bg-[#235056] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                  title="List view" aria-label="List view">
                  <FiList size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Grid view */}
          {view === 'grid' && (
            <div className="p-4 grid grid-cols-3 gap-3">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 animate-pulse">
                    <div className="flex gap-2 mb-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-lg" />
                    </div>
                    <div className="h-3 bg-gray-100 rounded mb-2 w-3/4" />
                    <div className="h-2 bg-gray-100 rounded mb-1" />
                    <div className="h-2 bg-gray-100 rounded w-2/3" />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="col-span-3 text-center py-10 text-xs text-gray-400">No services match this filter</div>
              ) : (
                filtered.map(s => (
                  <ServiceCard
                    key={s._id}
                    service={s}
                    onEdit={svc => setModal(svc)}
                    onDelete={svc => setDelTarget(svc)}
                    onToggle={toggleActive}
                    onDragStart={() => onDragStart(s._id)}
                    onDragOver={() => {}}
                    onDrop={() => onDrop(s._id)}
                  />
                ))
              )}
            </div>
          )}

          {/* List view */}
          {view === 'list' && (
            <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-8"></th>
                  <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-8">Icon</th>
                  <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[22%]">Title</th>
                  <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[18%]">Category</th>
                  <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[24%]">Short desc</th>
                  <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[9%]">Badge</th>
                  <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[8%]">Status</th>
                  <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-[6%]">Order</th>
                  <th className="text-left text-[11px] font-medium text-gray-400 px-3 py-2.5 w-24">Actions</th>
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
                ) : filtered.map(s => (
                  <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-3 py-2.5">
                      <BsGripVertical size={14} className="text-gray-300 cursor-grab" />
                    </td>
                    <td className="px-3 py-2.5 text-lg">{s.icon}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-800 truncate">{s.title}</td>
                    <td className="px-3 py-2.5"><CatChip cat={s.category} /></td>
                    <td className="px-3 py-2.5 text-xs text-gray-400 truncate">{s.shortDesc}</td>
                    <td className="px-3 py-2.5"><BadgePill badge={s.badge} /></td>
                    <td className="px-3 py-2.5">
                      <Toggle value={s.isActive} onChange={() => toggleActive(s._id)} />
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-400">{s.order}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1">
                        <button onClick={() => window.open(`https://kraviona.com/services/${s.slug}`, '_blank')}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-700">
                          <FiExternalLink size={12} />
                        </button>
                        <button onClick={() => setModal(s)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-700">
                          <FiEdit3 size={12} />
                        </button>
                        <button onClick={() => setDelTarget(s)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-700">
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal !== null && (
        <ServiceModal
          service={modal?._id ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {delTarget && (
        <ConfirmDialog
          service={delTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDelTarget(null)}
        />
      )}

      <Toast msg={toast} />
    </div>
  );
}