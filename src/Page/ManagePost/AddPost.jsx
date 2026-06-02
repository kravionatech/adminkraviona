// src/pages/dashboard/blog/AddPost.jsx
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Youtube } from '@tiptap/extension-youtube';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import {
  FiBold, FiItalic, FiUnderline, FiLink, FiImage,
  FiList, FiSave, FiEye, FiSend, FiPlus, FiX,
  FiUpload, FiHelpCircle, FiSearch, FiFileText, FiChevronDown
} from 'react-icons/fi';
import axios from 'axios';

// ─── SERP PREVIEW ────────────────────────────────────────────────
const SerpPreview = ({ title, desc, slug }) => (
  <div className="bg-gray-50 rounded-lg p-3 mt-2">
    <div className="text-xs text-green-700 truncate mb-0.5">
      kraviona.com/blog/{slug || 'your-post-slug'}
    </div>
    <div className="text-sm text-blue-700 font-medium truncate mb-1">
      {title || 'Your post title will appear here'}
    </div>
    <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
      {desc || 'Your meta description will appear here. Keep it between 120–160 characters.'}
    </div>
  </div>
);

// ─── SEO SCORE ───────────────────────────────────────────────────
const seoScore = ({ metaTitle, metaDesc, category, focusKeywords, excerpt }) => {
  let score = 0;
  if (metaTitle.length >= 30 && metaTitle.length <= 60) score += 25;
  else if (metaTitle.length > 0) score += 10;
  if (metaDesc.length >= 100 && metaDesc.length <= 160) score += 25;
  else if (metaDesc.length > 0) score += 10;
  if (category) score += 15;
  if (focusKeywords.length > 0) score += 20;
  if (excerpt.length > 50) score += 15;
  return score;
};

// ─── TAG INPUT ───────────────────────────────────────────────────
const TagInput = ({ tags, onAdd, onRemove, placeholder }) => {
  const [val, setVal] = useState('');
  const handleKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && val.trim()) {
      e.preventDefault();
      onAdd(val.trim().replace(/,$/, ''));
      setVal('');
    }
    if (e.key === 'Backspace' && !val && tags.length) onRemove(tags[tags.length - 1]);
  };
  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-lg min-h-9 cursor-text focus-within:border-[#235056] focus-within:ring-2 focus-within:ring-[#235056]/10">
      {tags.map(t => (
        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-800 text-[11px] rounded-full">
          {t}
          <button onClick={() => onRemove(t)} className="hover:text-red-600"><FiX size={10} /></button>
        </span>
      ))}
      <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={handleKey}
        className="flex-1 min-w-[100px] text-xs outline-none bg-transparent text-gray-800 placeholder-gray-400"
        placeholder={placeholder} />
    </div>
  );
};

// ─── FAQ BUILDER ─────────────────────────────────────────────────
const FaqBuilder = ({ faqs, onChange }) => {
  const add = () => onChange([...faqs, { question: '', answer: '' }]);
  const update = (i, field, val) => {
    const next = [...faqs];
    next[i][field] = val;
    onChange(next);
  };
  const remove = (i) => onChange(faqs.filter((_, idx) => idx !== i));
  return (
    <div>
      <p className="text-xs text-gray-400 mb-3">FAQ entries are added as JSON-LD schema markup automatically.</p>
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 mb-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <input value={faq.question} onChange={e => update(i, 'question', e.target.value)}
              className="flex-1 text-xs font-medium border-none outline-none bg-transparent text-gray-900 placeholder-gray-400"
              placeholder={`Question ${i + 1}...`} />
            <button onClick={() => remove(i)} className="text-gray-300 hover:text-red-500"><FiX size={14} /></button>
          </div>
          <textarea value={faq.answer} onChange={e => update(i, 'answer', e.target.value)}
            className="w-full text-xs text-gray-500 border-none outline-none bg-transparent resize-none leading-relaxed placeholder-gray-400"
            placeholder="Answer..." rows={2} />
        </div>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-1.5 text-xs py-2 border border-dashed border-gray-300 rounded-lg hover:border-[#235056] hover:text-[#235056] text-gray-400 transition-colors">
        <FiPlus size={12} /> Add FAQ
      </button>
    </div>
  );
};

// ─── EDITOR TOOLBAR ──────────────────────────────────────────────
const ToolbarBtn = ({ onClick, active, title, children }) => (
  <button onClick={onClick} title={title}
    className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-colors ${active ? 'bg-[#235056] text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}>
    {children}
  </button>
);

const Toolbar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><FiBold size={13} /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><FiItalic size={13} /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><FiUnderline size={13} /></ToolbarBtn>
      <div className="w-px h-5 bg-gray-200 mx-1 self-center" />
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2"><span className="text-[11px] font-medium">H2</span></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3"><span className="text-[11px] font-medium">H3</span></ToolbarBtn>
      <div className="w-px h-5 bg-gray-200 mx-1 self-center" />
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><FiList size={13} /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list"><span className="text-[11px]">1.</span></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><span className="text-[11px]">"</span></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block"><span className="font-mono text-[11px]">{`<>`}</span></ToolbarBtn>
      <div className="w-px h-5 bg-gray-200 mx-1 self-center" />
      <ToolbarBtn onClick={() => { const url = prompt('URL:'); if (url) editor.chain().focus().setLink({ href: url, target: '_blank' }).run(); }} active={editor.isActive('link')} title="Link"><FiLink size={13} /></ToolbarBtn>
      <ToolbarBtn onClick={() => { const url = prompt('Image URL:'); if (url) editor.chain().focus().setImage({ src: url }).run(); }} title="Image"><FiImage size={13} /></ToolbarBtn>
    </div>
  );
};

// ─── CHAR COUNT HELPER ───────────────────────────────────────────
const CharCount = ({ current, max }) => {
  const cls = current > max ? 'text-red-500' : current > max * 0.85 ? 'text-amber-500' : 'text-gray-400';
  return <span className={`text-[10px] ${cls}`}>{current} / {max}</span>;
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────
 function AddPost() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('content');
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const imgRef = useRef();

  const [form, setForm] = useState({
    title: '', slug: '',
    excerpt: '',
    category: '', tags: [],
    metaTitle: '', metaDesc: '',
    ogTitle: '', twTitle: '',
    canonical: '',
    focusKeywords: [], semanticKeywords: [],
    noIndex: false, noFollow: false, isAccessibleForFree: true,
    isCommentEnabled: true,
    contentSourceType: 'Human',
    page: 'blog',
    faqs: [],
    relatedPosts: [],
    featuredImageAlt: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube,
      CharacterCount,
      Placeholder.configure({ placeholder: 'Start writing your post content here...' }),
    ],
    editorProps: {
      attributes: { class: 'prose prose-sm max-w-none min-h-[280px] px-4 py-3 focus:outline-none text-gray-800' },
    },
  });

  const wordCount = editor ? editor.storage.characterCount.words() : 0;
  const charCount = editor ? editor.storage.characterCount.characters() : 0;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const onTitleChange = (val) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
    set('title', val);
    set('slug', slug);
    if (!form.metaTitle) set('metaTitle', val);
  };

  const score = seoScore(form);
  const scoreColor = score >= 70 ? '#3B6D11' : score >= 40 ? '#854F0B' : '#A32D2D';
  const barColor = score >= 70 ? '#639922' : score >= 40 ? '#EF9F27' : '#E24B4A';

  const handleImgUpload = async (file) => {
    const preview = URL.createObjectURL(file);
    setImgPreview(preview);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await axios.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) set('featuredImage', data.data.url);
    } catch { }
  };

  const buildPayload = () => ({
    title: form.title,
    slug: form.slug,
    content: editor?.getHTML() || '',
    excerpt: form.excerpt,
    categoryID: form.category,
    tags: form.tags,
    metaTitle: form.metaTitle,
    metaDescription: form.metaDesc,
    keywords: form.focusKeywords,
    focusKeywords: form.focusKeywords,
    semanticKeywords: form.semanticKeywords,
    canonicalUrl: form.canonical || `https://kraviona.com/blog/${form.slug}`,
    ogTitle: form.ogTitle || form.metaTitle,
    ogDescription: form.metaDesc,
    twitterTitle: form.twTitle || form.metaTitle,
    twitterDescription: form.metaDesc,
    isNoIndex: form.noIndex,
    isNoFollow: form.noFollow,
    isAccessibleForFree: form.isAccessibleForFree,
    isCommentEnabled: form.isCommentEnabled,
    contentSourceType: form.contentSourceType,
    page: form.page,
    faqSchema: form.faqs.filter(f => f.question && f.answer),
    status,
    readingTimeMinutes: readTime,
  });

  const saveDraft = async () => {
    setSaving(true);
    try {
      await axios.post('/blog/posts', { ...buildPayload(), status: 'draft' });
    } catch { } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!form.title) return alert('Post title is required.');
    if (!form.category) return alert('Please select a category.');
    setPublishing(true);
    try {
      await axios.post('/blog/posts', { ...buildPayload(), status: 'published' });
      navigate('/dashboard/blog');
    } catch { setPublishing(false); }
  };

  const TABS = [
    { id: 'content', label: 'Content', icon: <FiFileText size={12} /> },
    { id: 'seo', label: 'SEO', icon: <FiSearch size={12} /> },
    { id: 'faq', label: 'FAQ schema', icon: <FiHelpCircle size={12} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Topbar */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-gray-700">Dashboard</span>
          <span>/</span>
          <span onClick={() => navigate('/dashboard/blog')} className="cursor-pointer hover:text-gray-700">Manage posts</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Add new post</span>
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 mr-1">
            {saving ? 'Saving...' : 'Draft auto-saved'}
          </span>
          <button onClick={saveDraft} disabled={saving}
            className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            <FiSave size={13} /> Save draft
          </button>
          <button onClick={() => window.open(`https://kraviona.com/blog/${form.slug}`, '_blank')}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100">
            <FiEye size={13} /> Preview
          </button>
          <button onClick={publish} disabled={publishing}
            className="flex items-center gap-1.5 text-xs px-4 py-2 bg-[#235056] text-white rounded-lg hover:opacity-90 disabled:opacity-50">
            <FiSend size={13} /> {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_260px] gap-4 p-5 items-start max-w-[1200px]">

        {/* ── Main column ── */}
        <div className="flex flex-col gap-4">

          {/* Title + Slug */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="p-4 pb-0">
              <input value={form.title} onChange={e => onTitleChange(e.target.value)}
                className="w-full text-base font-medium border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#235056] focus:ring-2 focus:ring-[#235056]/10 placeholder-gray-300"
                placeholder="Post title *" />
              <div className="flex items-center mt-2 mb-4 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <span className="px-3 py-2 text-[11px] text-gray-400 border-r border-gray-200 flex-shrink-0 whitespace-nowrap">kraviona.com/blog/</span>
                <input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="flex-1 px-3 py-2 text-xs bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  placeholder="auto-generated-slug" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 ${tab === t.id ? 'text-[#235056] border-[#235056] bg-white' : 'text-gray-400 border-transparent hover:text-gray-700'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Content tab */}
            {tab === 'content' && (
              <div>
                <Toolbar editor={editor} />
                <EditorContent editor={editor} />
                <div className="flex gap-4 px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400">
                  <span>{wordCount} words</span>
                  <span>{charCount.toLocaleString()} characters</span>
                  <span>{readTime} min read</span>
                </div>
              </div>
            )}

            {/* SEO tab */}
            {tab === 'seo' && (
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">SEO score</span>
                    <span className="text-xs font-medium" style={{ color: scoreColor }}>{score} / 100</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: score + '%', background: barColor }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-medium text-gray-500">Meta title *</label>
                    <CharCount current={form.metaTitle.length} max={60} />
                  </div>
                  <input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056]"
                    placeholder="SEO title (50–60 chars)" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-medium text-gray-500">Meta description *</label>
                    <CharCount current={form.metaDesc.length} max={160} />
                  </div>
                  <textarea value={form.metaDesc} onChange={e => set('metaDesc', e.target.value)} rows={3}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056] resize-none leading-relaxed"
                    placeholder="SEO description (120–160 chars)" />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">SERP preview</label>
                  <SerpPreview title={form.metaTitle} desc={form.metaDesc} slug={form.slug} />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Focus keywords</label>
                  <TagInput tags={form.focusKeywords} onAdd={t => set('focusKeywords', [...form.focusKeywords, t])} onRemove={t => set('focusKeywords', form.focusKeywords.filter(k => k !== t))} placeholder="Type + Enter" />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Semantic keywords</label>
                  <TagInput tags={form.semanticKeywords} onAdd={t => set('semanticKeywords', [...form.semanticKeywords, t])} onRemove={t => set('semanticKeywords', form.semanticKeywords.filter(k => k !== t))} placeholder="Type + Enter" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">OG title</label>
                    <input value={form.ogTitle} onChange={e => set('ogTitle', e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none" placeholder="Open Graph title" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">Twitter title</label>
                    <input value={form.twTitle} onChange={e => set('twTitle', e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none" placeholder="Twitter title" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Canonical URL</label>
                  <input type="url" value={form.canonical} onChange={e => set('canonical', e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none" placeholder="https://kraviona.com/blog/..." />
                </div>

                <div className="space-y-1">
                  {[
                    { key: 'noIndex', label: 'No-index', sub: 'Exclude from search engines' },
                    { key: 'noFollow', label: 'No-follow', sub: 'Add nofollow to all links' },
                    { key: 'isAccessibleForFree', label: 'Accessible for free', sub: 'For Google rich results' },
                  ].map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="text-xs text-gray-800">{label}</div>
                        <div className="text-[11px] text-gray-400">{sub}</div>
                      </div>
                      <button onClick={() => set(key, !form[key])}
                        className={`w-9 h-5 rounded-full relative transition-colors ${form[key] ? 'bg-[#235056]' : 'bg-gray-200'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form[key] ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ tab */}
            {tab === 'faq' && (
              <div className="p-4">
                <FaqBuilder faqs={form.faqs} onChange={val => set('faqs', val)} />
              </div>
            )}
          </div>

          {/* Featured image */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Featured image</span>
              <button onClick={() => imgRef.current?.click()} className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                <FiUpload size={12} /> Upload
              </button>
            </div>
            <div className="p-4">
              <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && handleImgUpload(e.target.files[0])} />
              {imgPreview ? (
                <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-100">
                  <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
                  <button onClick={() => setImgPreview(null)} className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black">
                    <FiX size={12} />
                  </button>
                </div>
              ) : (
                <div onClick={() => imgRef.current?.click()}
                  className="border border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#235056] hover:bg-teal-50/30 transition-colors">
                  <FiImage size={22} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Click or drag image here</p>
                  <p className="text-[11px] text-gray-400">JPG, PNG, WebP — max 5MB — 1200×800px recommended</p>
                </div>
              )}
              <div className="mt-3">
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Alt text</label>
                <input value={form.featuredImageAlt} onChange={e => set('featuredImageAlt', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056]"
                  placeholder="Describe image for SEO & accessibility" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-3">

          {/* Publish settings */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-900">Publish settings</span>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1.5">Status</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[['draft', '✏️', 'Draft'], ['published', '✅', 'Publish'], ['archived', '📦', 'Archive']].map(([s, icon, label]) => (
                    <button key={s} onClick={() => setStatus(s)}
                      className={`py-2 text-xs rounded-lg border transition-colors ${status === s ? 'border-[#235056] bg-teal-50/50 text-[#235056] font-medium' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      <span className="block text-base mb-0.5">{icon}</span>{label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Content source</label>
                <select value={form.contentSourceType} onChange={e => set('contentSourceType', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none">
                  <option value="Human">Human written</option>
                  <option value="AI">AI generated</option>
                  <option value="Mixed">Mixed (Human + AI)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Show on page</label>
                <select value={form.page} onChange={e => set('page', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none">
                  <option value="home">Home featured section</option>
                  <option value="blog">Blog listing only</option>
                  <option value="service">Service page</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs text-gray-800">Comments</div>
                  <div className="text-[11px] text-gray-400">Allow reader comments</div>
                </div>
                <button onClick={() => set('isCommentEnabled', !form.isCommentEnabled)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${form.isCommentEnabled ? 'bg-[#235056]' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.isCommentEnabled ? 'left-4' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-900">Category & tags</span>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Category *</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056]">
                  <option value="">Select category</option>
                  <option value="next-gen-web-development">Next gen web development</option>
                  <option value="ai-and-automation">AI and automation</option>
                  <option value="web-3-development">Web 3 development</option>
                  <option value="technical-seo">Technical SEO</option>
                  <option value="case-studies">Case studies</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Tags</label>
                <TagInput tags={form.tags} onAdd={t => set('tags', [...form.tags, t])} onRemove={t => set('tags', form.tags.filter(k => k !== t))} placeholder="Type tag + Enter" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-medium text-gray-500">Excerpt *</label>
                  <CharCount current={form.excerpt.length} max={160} />
                </div>
                <textarea value={form.excerpt} onChange={e => { set('excerpt', e.target.value); if (!form.metaDesc) set('metaDesc', e.target.value); }} rows={3}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#235056] resize-none leading-relaxed"
                  placeholder="Short description for blog listing..." />
              </div>
            </div>
          </div>

          {/* Related posts */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-900">Related posts</span>
            </div>
            <div className="p-4">
              <p className="text-[11px] text-gray-400 mb-2">Show as "Read next" suggestions.</p>
              <select className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none mb-2">
                <option>Search posts to add...</option>
                <option>What is MERN Stack? Complete 2026 Guide</option>
                <option>Ultimate MERN Stack Roadmap 2026</option>
                <option>10 Benefits of AI</option>
              </select>
              {form.relatedPosts.length === 0 && (
                <p className="text-[11px] text-gray-400 text-center py-2">No related posts added yet</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddPost;