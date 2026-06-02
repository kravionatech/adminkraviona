import { useState } from "react";
import {
  FiGlobe, FiPhone, FiMail, FiMapPin, FiLink,
  FiHome, FiBarChart2, FiHelpCircle, FiSend,
  FiAlignLeft, FiLayers, FiCode, FiSearch,
  FiSave, FiCheck, FiPlus, FiTrash2, FiEdit2,
  FiX, FiChevronDown, FiChevronUp, FiEye,
  FiSettings, FiImage, FiToggleLeft, FiToggleRight,
  FiMenu,
} from "react-icons/fi";
import {
  HiOutlineBuildingOffice2, HiOutlineShare,
  HiOutlineSparkles, HiOutlineCog6Tooth,
} from "react-icons/hi2";

// ─── Initial State ───────────────────────────────────────────────────────────
const INITIAL = {
  company: {
    companyName: "Kraviona Tech Solutions",
    tagline: "We engineer digital ecosystems that scale.",
    description: "Kraviona is a MERN Stack development & Technical SEO agency based in East Delhi, India.",
    phone: "+91 9608553167",
    email: "kravionatech@gmail.com",
    address: "East Delhi, India 110092",
  },
  social: {
    facebook: "https://facebook.com/kraviona",
    twitter: "https://twitter.com/kraviona",
    linkedin: "https://linkedin.com/company/kraviona",
    instagram: "",
    youtube: "",
  },
  hero: {
    badge1: "⚡ SEO Optimized",
    badge2: "🚀 MERN Stack Experts",
    badge3: "✅ Fast Delivery",
    headline: "MERN Stack Development & Technical SEO Solutions",
    subheadline: "We build scalable, high-performance web applications tailored for your business growth.",
    ctaPrimary: { text: "Start a Project", link: "/contact" },
    ctaSecondary: { text: "View Our Work", link: "/gallery" },
    phone: "+91 9608553167",
  },
  stats: {
    projectsDelivered: "150+",
    clientRetention: "99%",
    yearsExperience: "5+",
    support: "24/7",
    projectsLabel: "Projects Delivered",
    retentionLabel: "Client Retention Rate",
    experienceLabel: "Years of Experience",
    supportLabel: "Post-Launch Support",
  },
  whyUs: {
    title: "Why Choose Kraviona?",
    subtitle: "We combine technical excellence with business acumen.",
    features: [
      { icon: "⚡", title: "Agile Delivery", description: "Sprint-based development with weekly demos and full transparency." },
      { icon: "📈", title: "Scalable Architecture", description: "Future-proof systems built to grow with your business." },
      { icon: "📊", title: "Data-Driven", description: "Every decision backed by analytics and performance metrics." },
    ],
  },
  whoWeAre: {
    title: "Who We Are",
    description: "We are a passionate team of engineers and strategists who believe in building software that makes a real difference. From startups to enterprises, we have helped 150+ clients achieve their digital goals.",
    ctaText: "About Us",
    ctaLink: "/about",
  },
  techStack: [
    { category: "Frontend", categoryTitle: "Frontend", description: "Modern UI libraries", tools: [{ name: "React.js" }, { name: "Next.js" }, { name: "TypeScript" }, { name: "Tailwind CSS" }] },
    { category: "Backend", categoryTitle: "Backend", description: "Server & API layer", tools: [{ name: "Node.js" }, { name: "Express.js" }, { name: "REST APIs" }, { name: "GraphQL" }] },
    { category: "Database", categoryTitle: "Database", description: "Data storage layer", tools: [{ name: "MongoDB" }, { name: "Redis" }, { name: "PostgreSQL" }, { name: "Mongoose" }] },
    { category: "Cloud", categoryTitle: "Cloud & DevOps", description: "Deployment & infra", tools: [{ name: "AWS" }, { name: "Vercel" }, { name: "Docker" }, { name: "Railway" }] },
  ],
  homeFaqs: [
    { question: "How long does a MERN Stack project take?", answer: "Typically 4–12 weeks depending on complexity.", order: 1 },
    { question: "Do you provide post-launch support?", answer: "Yes, we offer 24/7 post-launch maintenance plans.", order: 2 },
    { question: "Can you migrate my existing app?", answer: "Absolutely. We specialize in legacy system migrations.", order: 3 },
  ],
  newsletter: {
    title: "Stay in the Loop",
    subtitle: "Get the latest MERN tips, SEO strategies, and dev insights.",
    placeholder: "Enter your email address...",
  },
  footer: {
    description: "Building scalable MERN Stack applications and driving organic growth through Technical SEO.",
    copyrightText: "© 2026 Kraviona Tech Solutions. All rights reserved.",
    capabilitiesLinks: [
      { label: "MERN Stack Development", href: "/services/mern-stack-development" },
      { label: "Technical SEO", href: "/services/technical-seo" },
      { label: "Web Performance", href: "/services/web-performance-optimization" },
    ],
    companyLinks: [
      { label: "About Us", href: "/about" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Contact", href: "/contact" },
    ],
  },
  seo: {
    googleAnalyticsId: "GTM-5LX2JWGD",
    googleVerification: "",
    defaultMetaTitle: "Kraviona Tech Solutions | MERN Stack & Technical SEO",
    defaultMetaDescription: "Expert MERN Stack development and Technical SEO services in India.",
    defaultOgImage: "/og-image.jpg",
  },
  navigation: {
    mainLinks: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: "We're upgrading our systems. Back shortly!",
  },
};

// ─── Reusable Components ─────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {hint && <p className="text-[11px] text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", mono }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E8663D] focus:ring-2 focus:ring-[#E8663D]/10 transition-all ${mono ? "font-mono text-xs" : ""}`}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E8663D] focus:ring-2 focus:ring-[#E8663D]/10 transition-all resize-none"
    />
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${value ? "border-[#E8663D]/30 bg-[#FFF4F0]" : "border-gray-200 bg-gray-50"}`}
    >
      {value
        ? <FiToggleRight size={22} className="text-[#E8663D]" />
        : <FiToggleLeft size={22} className="text-gray-400" />}
      <span className={`text-sm font-semibold ${value ? "text-[#E8663D]" : "text-gray-500"}`}>
        {value ? "Enabled" : "Disabled"}
      </span>
      {label && <span className="text-xs text-gray-400 ml-1">— {label}</span>}
    </button>
  );
}

function SectionCard({ id, icon: Icon, title, subtitle, color = "#E8663D", children, activeSection, setActiveSection }) {
  const open = activeSection === id;
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${open ? "border-[#E8663D]/30 shadow-md" : "border-gray-100"}`}>
      <button
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors text-left"
        onClick={() => setActiveSection(open ? null : id)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + "15" }}>
            <Icon size={17} style={{ color }} />
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm">{title}</div>
            <div className="text-xs text-gray-400">{subtitle}</div>
          </div>
        </div>
        {open ? <FiChevronUp size={16} className="text-gray-400" /> : <FiChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-50">
          <div className="pt-5 space-y-5">{children}</div>
        </div>
      )}
    </div>
  );
}

function SaveBar({ dirty, onSave, saving }) {
  if (!dirty) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl">
      <span className="text-sm font-medium">You have unsaved changes</span>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl transition-all active:scale-95"
        style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}
      >
        {saving ? <><FiSettings size={13} className="animate-spin" /> Saving…</> : <><FiSave size={13} /> Save Changes</>}
      </button>
    </div>
  );
}

// ─── Sub-section editors ─────────────────────────────────────────────────────

function CompanyInfo({ data, set }) {
  const u = (k) => (v) => set({ ...data, [k]: v });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Company Name"><Input value={data.companyName} onChange={u("companyName")} /></Field>
      <Field label="Tagline"><Input value={data.tagline} onChange={u("tagline")} /></Field>
      <Field label="Phone"><Input value={data.phone} onChange={u("phone")} /></Field>
      <Field label="Email"><Input value={data.email} onChange={u("email")} /></Field>
      <Field label="Office Address" ><Input value={data.address} onChange={u("address")} /></Field>
      <Field label="Meta Description" hint="Max 150 chars"><Input value={data.description} onChange={u("description")} /></Field>
    </div>
  );
}

function SocialLinks({ data, set }) {
  const u = (k) => (v) => set({ ...data, [k]: v });
  const socials = [
    { key: "facebook",  label: "Facebook",  placeholder: "https://facebook.com/kraviona" },
    { key: "twitter",   label: "Twitter / X", placeholder: "https://twitter.com/kraviona" },
    { key: "linkedin",  label: "LinkedIn",  placeholder: "https://linkedin.com/company/kraviona" },
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/kraviona" },
    { key: "youtube",   label: "YouTube",   placeholder: "https://youtube.com/@kraviona" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {socials.map(({ key, label, placeholder }) => (
        <Field key={key} label={label}>
          <Input value={data[key]} onChange={u(key)} placeholder={placeholder} />
        </Field>
      ))}
    </div>
  );
}

function HeroSection({ data, set }) {
  const u = (k) => (v) => set({ ...data, [k]: v });
  const ucta = (cta, k) => (v) => set({ ...data, [cta]: { ...data[cta], [k]: v } });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Badge 1"><Input value={data.badge1} onChange={u("badge1")} /></Field>
        <Field label="Badge 2"><Input value={data.badge2} onChange={u("badge2")} /></Field>
        <Field label="Badge 3"><Input value={data.badge3} onChange={u("badge3")} /></Field>
      </div>
      <Field label="Main Headline"><Input value={data.headline} onChange={u("headline")} /></Field>
      <Field label="Sub Headline"><Textarea value={data.subheadline} onChange={u("subheadline")} rows={2} /></Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="CTA Primary — Text"><Input value={data.ctaPrimary.text} onChange={ucta("ctaPrimary", "text")} /></Field>
        <Field label="CTA Primary — Link"><Input value={data.ctaPrimary.link} onChange={ucta("ctaPrimary", "link")} /></Field>
        <Field label="CTA Secondary — Text"><Input value={data.ctaSecondary.text} onChange={ucta("ctaSecondary", "text")} /></Field>
        <Field label="CTA Secondary — Link"><Input value={data.ctaSecondary.link} onChange={ucta("ctaSecondary", "link")} /></Field>
      </div>
      <Field label="Hero Phone Number"><Input value={data.phone} onChange={u("phone")} /></Field>
    </div>
  );
}

function StatsSection({ data, set }) {
  const u = (k) => (v) => set({ ...data, [k]: v });
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { val: "projectsDelivered", lbl: "projectsLabel", valLabel: "Projects Value", lblLabel: "Projects Label" },
        { val: "clientRetention",   lbl: "retentionLabel",   valLabel: "Retention Value",   lblLabel: "Retention Label" },
        { val: "yearsExperience",   lbl: "experienceLabel",  valLabel: "Experience Value",  lblLabel: "Experience Label" },
        { val: "support",           lbl: "supportLabel",     valLabel: "Support Value",     lblLabel: "Support Label" },
      ].map(({ val, lbl, valLabel, lblLabel }) => (
        <div key={val} className="bg-gray-50 rounded-xl p-4 space-y-2">
          <Field label={valLabel}><Input value={data[val]} onChange={u(val)} /></Field>
          <Field label={lblLabel}><Input value={data[lbl]} onChange={u(lbl)} /></Field>
        </div>
      ))}
    </div>
  );
}

function WhyUsSection({ data, set }) {
  const u = (k) => (v) => set({ ...data, [k]: v });
  const updateFeature = (i, k, v) => {
    const features = [...data.features];
    features[i] = { ...features[i], [k]: v };
    set({ ...data, features });
  };
  const addFeature = () => set({ ...data, features: [...data.features, { icon: "✨", title: "", description: "" }] });
  const removeFeature = (i) => set({ ...data, features: data.features.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Section Title"><Input value={data.title} onChange={u("title")} /></Field>
        <Field label="Section Subtitle"><Input value={data.subtitle} onChange={u("subtitle")} /></Field>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Feature Cards</label>
          <button onClick={addFeature} className="flex items-center gap-1 text-xs font-semibold text-[#E8663D] hover:underline">
            <FiPlus size={12} /> Add Card
          </button>
        </div>
        {data.features.map((f, i) => (
          <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-4">
            <div className="w-12">
              <Input value={f.icon} onChange={(v) => updateFeature(i, "icon", v)} placeholder="⚡" />
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input value={f.title} onChange={(v) => updateFeature(i, "title", v)} placeholder="Feature Title" />
              <Input value={f.description} onChange={(v) => updateFeature(i, "description", v)} placeholder="Short description..." />
            </div>
            <button onClick={() => removeFeature(i)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors shrink-0">
              <FiTrash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhoWeAreSection({ data, set }) {
  const u = (k) => (v) => set({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Section Title"><Input value={data.title} onChange={u("title")} /></Field>
      <Field label="Description" hint="Supports rich HTML"><Textarea value={data.description} onChange={u("description")} rows={4} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="CTA Button Text"><Input value={data.ctaText} onChange={u("ctaText")} /></Field>
        <Field label="CTA Button Link"><Input value={data.ctaLink} onChange={u("ctaLink")} /></Field>
      </div>
    </div>
  );
}

function TechStackSection({ data, set }) {
  const updateCat = (i, k, v) => {
    const t = [...data]; t[i] = { ...t[i], [k]: v }; set(t);
  };
  const updateTool = (ci, ti, v) => {
    const t = [...data];
    const tools = [...t[ci].tools];
    tools[ti] = { ...tools[ti], name: v };
    t[ci] = { ...t[ci], tools };
    set(t);
  };
  const addTool = (ci) => {
    const t = [...data];
    t[ci] = { ...t[ci], tools: [...t[ci].tools, { name: "" }] };
    set(t);
  };
  const removeTool = (ci, ti) => {
    const t = [...data];
    t[ci] = { ...t[ci], tools: t[ci].tools.filter((_, idx) => idx !== ti) };
    set(t);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((cat, ci) => (
        <div key={ci} className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Category Title"><Input value={cat.categoryTitle} onChange={(v) => updateCat(ci, "categoryTitle", v)} /></Field>
            <Field label="Description"><Input value={cat.description} onChange={(v) => updateCat(ci, "description", v)} /></Field>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Tools</label>
              <button onClick={() => addTool(ci)} className="text-[11px] text-[#E8663D] font-semibold hover:underline flex items-center gap-0.5"><FiPlus size={11} /> Add</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cat.tools.map((t, ti) => (
                <div key={ti} className="flex gap-1">
                  <Input value={t.name} onChange={(v) => updateTool(ci, ti, v)} placeholder="Tool name" />
                  <button onClick={() => removeTool(ci, ti)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition-colors">
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FaqSection({ data, set }) {
  const add = () => set([...data, { question: "", answer: "", order: data.length + 1 }]);
  const remove = (i) => set(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const d = [...data]; d[i] = { ...d[i], [k]: v }; set(d); };

  return (
    <div className="space-y-3">
      {data.map((faq, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#E8663D]/10 text-[#E8663D] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
            <Input value={faq.question} onChange={(v) => upd(i, "question", v)} placeholder="Question..." />
            <button onClick={() => remove(i)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition-colors shrink-0">
              <FiTrash2 size={13} />
            </button>
          </div>
          <div className="pl-8">
            <Textarea value={faq.answer} onChange={(v) => upd(i, "answer", v)} placeholder="Answer..." rows={2} />
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm font-semibold text-[#E8663D] hover:underline px-1">
        <FiPlus size={14} /> Add FAQ
      </button>
    </div>
  );
}

function NewsletterSection({ data, set }) {
  const u = (k) => (v) => set({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Section Title"><Input value={data.title} onChange={u("title")} /></Field>
      <Field label="Section Subtitle"><Input value={data.subtitle} onChange={u("subtitle")} /></Field>
      <Field label="Input Placeholder"><Input value={data.placeholder} onChange={u("placeholder")} /></Field>
    </div>
  );
}

function FooterSection({ data, set }) {
  const u = (k) => (v) => set({ ...data, [k]: v });
  const updLink = (arr, i, k, v) => {
    const links = [...data[arr]]; links[i] = { ...links[i], [k]: v }; set({ ...data, [arr]: links });
  };
  const addLink = (arr) => set({ ...data, [arr]: [...data[arr], { label: "", href: "" }] });
  const removeLink = (arr, i) => set({ ...data, [arr]: data[arr].filter((_, idx) => idx !== i) });

  const LinkGroup = ({ arrKey, title }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</label>
        <button onClick={() => addLink(arrKey)} className="text-xs text-[#E8663D] font-semibold hover:underline flex items-center gap-0.5"><FiPlus size={11} /> Add</button>
      </div>
      <div className="space-y-2">
        {data[arrKey].map((lnk, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input value={lnk.label} onChange={(v) => updLink(arrKey, i, "label", v)} placeholder="Label" />
            <Input value={lnk.href} onChange={(v) => updLink(arrKey, i, "href", v)} placeholder="/path" />
            <button onClick={() => removeLink(arrKey, i)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition-colors shrink-0">
              <FiX size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <Field label="Footer Description"><Textarea value={data.description} onChange={u("description")} rows={2} /></Field>
      <Field label="Copyright Text"><Input value={data.copyrightText} onChange={u("copyrightText")} /></Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LinkGroup arrKey="capabilitiesLinks" title="Capabilities Links" />
        <LinkGroup arrKey="companyLinks" title="Company Links" />
      </div>
    </div>
  );
}

function NavigationSection({ data, set }) {
  const upd = (i, k, v) => {
    const links = [...data.mainLinks]; links[i] = { ...links[i], [k]: v }; set({ ...data, mainLinks: links });
  };
  const add = () => set({ ...data, mainLinks: [...data.mainLinks, { label: "", href: "" }] });
  const remove = (i) => set({ ...data, mainLinks: data.mainLinks.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Main Navigation Links</label>
      {data.mainLinks.map((lnk, i) => (
        <div key={i} className="flex gap-3 items-center bg-gray-50 rounded-xl px-4 py-2.5">
          <span className="text-gray-300 cursor-move"><FiMenu size={14} /></span>
          <Input value={lnk.label} onChange={(v) => upd(i, "label", v)} placeholder="Label" />
          <Input value={lnk.href} onChange={(v) => upd(i, "href", v)} placeholder="/path" />
          <button onClick={() => remove(i)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition-colors shrink-0">
            <FiTrash2 size={13} />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm font-semibold text-[#E8663D] hover:underline px-1">
        <FiPlus size={14} /> Add Link
      </button>
    </div>
  );
}

function SeoSection({ data, set }) {
  const u = (k) => (v) => set({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Google Analytics / GTM ID" hint="e.g. GTM-5LX2JWGD"><Input value={data.googleAnalyticsId} onChange={u("googleAnalyticsId")} mono /></Field>
        <Field label="Google Verification Code"><Input value={data.googleVerification} onChange={u("googleVerification")} mono /></Field>
      </div>
      <Field label="Default Meta Title"><Input value={data.defaultMetaTitle} onChange={u("defaultMetaTitle")} /></Field>
      <Field label="Default Meta Description" hint="Fallback for all pages"><Textarea value={data.defaultMetaDescription} onChange={u("defaultMetaDescription")} rows={2} /></Field>
      <Field label="Default OG Image URL" hint="e.g. /og-image.jpg"><Input value={data.defaultOgImage} onChange={u("defaultOgImage")} mono /></Field>
    </div>
  );
}

function MaintenanceSection({ data, set }) {
  const u = (k) => (v) => set({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Maintenance Mode" hint="When enabled, site shows a maintenance message to visitors">
        <Toggle value={data.maintenanceMode} onChange={u("maintenanceMode")} label={data.maintenanceMode ? "Site is DOWN for visitors" : "Site is live"} />
      </Field>
      <Field label="Maintenance Message"><Textarea value={data.maintenanceMessage} onChange={u("maintenanceMessage")} rows={2} /></Field>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GlobalSettingsPage() {
  const [cfg, setCfg] = useState(INITIAL);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("company");

  const update = (key) => (val) => {
    setCfg((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SECTIONS = [
    { id: "company",     icon: HiOutlineBuildingOffice2, title: "Company Info",        subtitle: "Name, tagline, phone, email, address",             color: "#E8663D" },
    { id: "social",      icon: HiOutlineShare,           title: "Social Links",        subtitle: "Facebook, Twitter, LinkedIn, Instagram, YouTube",  color: "#3B82F6" },
    { id: "navigation",  icon: FiLink,                   title: "Navigation Config",   subtitle: "Main nav links & order",                           color: "#8B5CF6" },
    { id: "hero",        icon: FiHome,                   title: "Homepage Hero",       subtitle: "Badges, headline, CTAs, phone",                    color: "#10B981" },
    { id: "stats",       icon: FiBarChart2,              title: "Global Stats",        subtitle: "150+, 99%, 5+, 24/7 — values & labels",            color: "#F59E0B" },
    { id: "whyUs",       icon: HiOutlineSparkles,        title: "Why Choose Kraviona", subtitle: "Section title + 3 feature cards",                  color: "#EC4899" },
    { id: "whoWeAre",    icon: FiAlignLeft,              title: "Who We Are",          subtitle: "Description, CTA button",                          color: "#06B6D4" },
    { id: "techStack",   icon: FiLayers,                 title: "Tech Stack Section",  subtitle: "4 categories × tools",                             color: "#14B8A6" },
    { id: "homeFaqs",    icon: FiHelpCircle,             title: "Homepage FAQs",       subtitle: "Questions & answers accordion",                    color: "#F97316" },
    { id: "newsletter",  icon: FiSend,                   title: "Newsletter Section",  subtitle: "Title, subtitle, input placeholder",               color: "#A855F7" },
    { id: "footer",      icon: FiCode,                   title: "Footer Config",       subtitle: "Description, copyright, nav link groups",          color: "#64748B" },
    { id: "seo",         icon: FiSearch,                 title: "SEO & Analytics",     subtitle: "GTM ID, meta title, OG image, verification",       color: "#EF4444" },
    { id: "maintenance", icon: HiOutlineCog6Tooth,       title: "Maintenance Mode",    subtitle: "Toggle site maintenance screen",                   color: "#DC2626" },
  ];

  const editors = {
    company:     <CompanyInfo  data={cfg.company}      set={update("company")} />,
    social:      <SocialLinks  data={cfg.social}       set={update("social")} />,
    navigation:  <NavigationSection data={cfg.navigation} set={update("navigation")} />,
    hero:        <HeroSection  data={cfg.hero}         set={update("hero")} />,
    stats:       <StatsSection  data={cfg.stats}       set={update("stats")} />,
    whyUs:       <WhyUsSection  data={cfg.whyUs}       set={update("whyUs")} />,
    whoWeAre:    <WhoWeAreSection data={cfg.whoWeAre}  set={update("whoWeAre")} />,
    techStack:   <TechStackSection data={cfg.techStack} set={update("techStack")} />,
    homeFaqs:    <FaqSection    data={cfg.homeFaqs}    set={update("homeFaqs")} />,
    newsletter:  <NewsletterSection data={cfg.newsletter} set={update("newsletter")} />,
    footer:      <FooterSection data={cfg.footer}      set={update("footer")} />,
    seo:         <SeoSection    data={cfg.seo}         set={update("seo")} />,
    maintenance: <MaintenanceSection data={cfg.maintenance} set={update("maintenance")} />,
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
            <span>Admin</span><span>/</span>
            <span className="text-gray-700 font-semibold">Global Site Settings</span>
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2 tracking-tight">
            <FiGlobe size={20} className="text-[#E8663D]" />
            Global Site Settings
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold animate-pulse">
              <FiCheck size={15} /> Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
              dirty ? "text-white shadow-lg hover:-translate-y-0.5 active:scale-95" : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            style={dirty ? { background: "linear-gradient(135deg,#E8663D,#d45a30)" } : {}}
          >
            {saving ? <FiSettings size={14} className="animate-spin" /> : <FiSave size={14} />}
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-6 mt-5 mb-0 bg-[#FFF4F0] border border-[#E8663D]/20 rounded-xl px-5 py-3 flex items-start gap-3">
        <FiGlobe size={16} className="text-[#E8663D] mt-0.5 shrink-0" />
        <p className="text-sm text-[#c4501e]">
          <strong>Global Settings</strong> — Changes here update the live site via <code className="bg-white/60 px-1 rounded text-xs">PUT /api/v1/site-config</code>. All sections are backed by a single MongoDB SiteConfig document.
        </p>
      </div>

      {/* Sections */}
      <div className="px-6 py-6 max-w-[900px] mx-auto space-y-3">
        {SECTIONS.map((s) => (
          <SectionCard
            key={s.id}
            id={s.id}
            icon={s.icon}
            title={s.title}
            subtitle={s.subtitle}
            color={s.color}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          >
            {editors[s.id]}
          </SectionCard>
        ))}
      </div>

      {/* Sticky Save Bar */}
      <SaveBar dirty={dirty} onSave={handleSave} saving={saving} />
    </div>
  );
}