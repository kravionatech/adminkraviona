import { useState, useEffect } from "react";
import { settingsApi } from "../../services/api";
import {
  FiCode, FiSave, FiPlus, FiTrash2, FiCopy, FiCheckCircle,
  FiChevronDown, FiChevronUp, FiAlertCircle, FiToggleLeft,
  FiToggleRight, FiInfo, FiGlobe, FiUser, FiBriefcase,
  FiFileText, FiStar, FiShoppingBag, FiEdit2,
} from "react-icons/fi";

// ─── Schema Templates ────────────────────────────────────────────────────────

const SCHEMA_TEMPLATES = {
  Organization: {
    icon: <FiBriefcase size={14} />,
    color: "bg-orange-100 text-orange-700",
    schema: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Kraviona",
      url: "https://kraviona.com",
      logo: "https://kraviona.com/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-XXXXXXXXXX",
        contactType: "customer support",
      },
      sameAs: [
        "https://twitter.com/kraviona",
        "https://linkedin.com/company/kraviona",
      ],
    },
  },
  WebSite: {
    icon: <FiGlobe size={14} />,
    color: "bg-blue-100 text-blue-700",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Kraviona",
      url: "https://kraviona.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://kraviona.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  },
  Person: {
    icon: <FiUser size={14} />,
    color: "bg-teal-100 text-teal-700",
    schema: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Admin Singh",
      url: "https://kraviona.com/about",
      jobTitle: "CEO & Founder",
      worksFor: { "@type": "Organization", name: "Kraviona" },
    },
  },
  Article: {
    icon: <FiFileText size={14} />,
    color: "bg-purple-100 text-purple-700",
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Article Title Here",
      author: { "@type": "Person", name: "Admin Singh" },
      publisher: {
        "@type": "Organization",
        name: "Kraviona",
        logo: { "@type": "ImageObject", url: "https://kraviona.com/logo.png" },
      },
      datePublished: "2026-06-02",
      dateModified: "2026-06-02",
    },
  },
  FAQPage: {
    icon: <FiInfo size={14} />,
    color: "bg-green-100 text-green-700",
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Kraviona?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kraviona is a full-service digital agency.",
          },
        },
      ],
    },
  },
  Review: {
    icon: <FiStar size={14} />,
    color: "bg-yellow-100 text-yellow-700",
    schema: {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: { "@type": "Organization", name: "Kraviona" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      author: { "@type": "Person", name: "Client Name" },
    },
  },
  Service: {
    icon: <FiShoppingBag size={14} />,
    color: "bg-pink-100 text-pink-700",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Web Development",
      provider: { "@type": "Organization", name: "Kraviona" },
      serviceType: "Web Development",
      areaServed: "Worldwide",
    },
  },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`text-xl transition-colors ${value ? "text-[#E8622A]" : "text-gray-300"}`}
    >
      {value ? <FiToggleRight size={26} /> : <FiToggleLeft size={26} />}
    </button>
  );
}

function SectionCard({ title, icon, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span className="text-[#E8622A]">{icon}</span>
          {title}
          {badge && (
            <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        {open ? <FiChevronUp size={15} className="text-gray-400" /> : <FiChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-5 py-5">{children}</div>}
    </div>
  );
}

function SchemaBlock({ item, onUpdate, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [jsonError, setJsonError] = useState(null);
  const tpl = SCHEMA_TEMPLATES[item.type] || {};

  const handleCodeChange = (val) => {
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch {
      setJsonError("Invalid JSON");
    }
    onUpdate({ ...item, rawJson: val });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.rawJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
      {/* Block header */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${tpl.color || "bg-gray-100 text-gray-600"}`}>
            {tpl.icon} {item.type}
          </span>
          <input
            type="text"
            value={item.label}
            onChange={(e) => onUpdate({ ...item, label: e.target.value })}
            className="text-sm font-medium text-gray-700 bg-transparent border-none focus:outline-none focus:bg-white focus:border focus:border-gray-200 rounded px-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Toggle value={item.enabled} onChange={(v) => onUpdate({ ...item, enabled: v })} />
          <button onClick={handleCopy} className="text-gray-400 hover:text-[#E8622A] transition-colors">
            {copied ? <FiCheckCircle size={15} /> : <FiCopy size={15} />}
          </button>
          <button onClick={onDelete} className="text-gray-300 hover:text-red-400 transition-colors">
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>

      {/* Scope selector */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100 bg-white text-xs text-gray-500">
        <span className="font-medium text-gray-600">Apply to:</span>
        {["Global (all pages)", "Homepage only", "Blog posts", "Service pages", "Custom"].map((s) => (
          <label key={s} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={`scope-${item.id}`}
              checked={item.scope === s}
              onChange={() => onUpdate({ ...item, scope: s })}
              className="accent-[#E8622A]"
            />
            {s}
          </label>
        ))}
      </div>

      {/* JSON Editor */}
      <div className="relative">
        <textarea
          value={item.rawJson}
          onChange={(e) => handleCodeChange(e.target.value)}
          rows={12}
          spellCheck={false}
          className="w-full font-mono text-xs bg-gray-900 text-green-400 p-4 focus:outline-none resize-y leading-6"
        />
        {jsonError && (
          <div className="absolute bottom-2 right-3 flex items-center gap-1 text-xs text-red-400 bg-gray-900 px-2 py-1 rounded">
            <FiAlertCircle size={12} /> {jsonError}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SchemaJsonLD() {
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    settingsApi.public().then((s) => {
      if (s && Array.isArray(s.seo_schema_jsonld)) {
        setSchemas(s.seo_schema_jsonld);
      }
    }).catch(() => null);
  }, []);

  const [showTemplates, setShowTemplates] = useState(false);
  const [saved, setSaved] = useState(false);
  const [globalEnabled, setGlobalEnabled] = useState(true);

  const addSchema = (type) => {
    setSchemas((prev) => [
      ...prev,
      {
        id: Date.now(), type, label: `New ${type} Schema`,
        enabled: true, scope: "Global (all pages)",
        rawJson: JSON.stringify(SCHEMA_TEMPLATES[type].schema, null, 2),
      },
    ]);
    setShowTemplates(false);
  };

  const updateSchema = (id, updated) =>
    setSchemas((prev) => prev.map((s) => (s.id === id ? updated : s)));

  const deleteSchema = (id) =>
    setSchemas((prev) => prev.filter((s) => s.id !== id));

  const handleSave = async () => {
    try {
      await settingsApi.single("seo_schema_jsonld", { value: schemas });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">SEO: Schema JSON-LD</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Add structured data schemas to improve search engine rich results.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiPlus size={14} /> Add Schema
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg transition-colors ${
              saved ? "bg-green-500" : "bg-[#E8622A] hover:bg-[#d0561f]"
            }`}
          >
            {saved ? <FiCheckCircle size={14} /> : <FiSave size={14} />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Template picker */}
      {showTemplates && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5">
          <div className="text-sm font-semibold text-gray-700 mb-3">Choose a Schema Template</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            {Object.entries(SCHEMA_TEMPLATES).map(([type, tpl]) => (
              <button
                key={type}
                onClick={() => addSchema(type)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-[#E8622A] hover:shadow-sm transition-all text-xs font-medium ${tpl.color}`}
              >
                {tpl.icon}
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Global toggle */}
      <SectionCard title="Global Schema Settings" icon={<FiCode size={15} />}>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium text-gray-700">Enable JSON-LD Output</div>
            <div className="text-xs text-gray-400 mt-0.5">Inject all active schemas into page &lt;head&gt;</div>
          </div>
          <Toggle value={globalEnabled} onChange={setGlobalEnabled} />
        </div>
        {!globalEnabled && (
          <div className="flex items-center gap-2 mt-3 text-xs text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
            <FiAlertCircle size={13} /> JSON-LD is currently disabled. Search engines won't see structured data.
          </div>
        )}
      </SectionCard>

      {/* Schema blocks */}
      <SectionCard
        title="Active Schemas"
        icon={<FiEdit2 size={15} />}
        badge={`${schemas.filter((s) => s.enabled).length} active`}
      >
        {schemas.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-sm">
            Data not available
          </div>
        ) : (
          schemas.map((s) => (
            <SchemaBlock
              key={s.id}
              item={s}
              onUpdate={(updated) => updateSchema(s.id, updated)}
              onDelete={() => deleteSchema(s.id)}
            />
          ))
        )}

        <button
          onClick={() => setShowTemplates(true)}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl hover:text-[#E8622A] hover:border-[#E8622A] transition-colors"
        >
          <FiPlus size={14} /> Add another schema
        </button>
      </SectionCard>

      {/* Info tip */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600">
        <FiInfo size={14} className="mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">Tip:</span> Use Google's{" "}
          <a
            href="https://search.google.com/test/rich-results"
            target="_blank"
            rel="noreferrer"
            className="underline font-medium"
          >
            Rich Results Test
          </a>{" "}
          to validate your schemas after saving. JSON-LD is injected into every matching page's &lt;head&gt; tag automatically.
        </div>
      </div>
    </div>
  );
}