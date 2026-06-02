// Home Page → Services Showcase picker
import { FiLayers, FiCheck } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const ALL_SERVICES = [
  { slug: "mern-stack-development", title: "MERN Stack Development", icon: "⚡" },
  { slug: "full-stack-development", title: "Full-Stack Development", icon: "💻" },
  { slug: "react-development", title: "React.js Development", icon: "⚛" },
  { slug: "nodejs-development", title: "Node.js Development", icon: "🟢" },
  { slug: "backend-development", title: "Backend Development", icon: "⚙️" },
  { slug: "api-development", title: "API Development", icon: "🔌" },
  { slug: "database-architecture", title: "Database Architecture", icon: "🗄️" },
  { slug: "saas-development", title: "SaaS Development", icon: "☁️" },
  { slug: "technical-seo", title: "Technical SEO", icon: "📈" },
  { slug: "web-performance-optimization", title: "Web Performance", icon: "🚀" },
  { slug: "ai-automation", title: "AI Automation", icon: "🤖" },
];

const INITIAL = {
  sectionTitle: "Our Core Services",
  sectionSubtitle: "5 powerhouse services to scale your business",
  showSlugs: [
    "mern-stack-development",
    "technical-seo",
    "web-performance-optimization",
    "saas-development",
    "ai-automation",
  ],
};

export default function HomeServicesShowcase() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "servicesShowcase" });

  const toggle = (slug) => {
    set("showSlugs")(
      data.showSlugs.includes(slug) ? data.showSlugs.filter((s) => s !== slug) : [...data.showSlugs, slug]
    );
  };

  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "Services Showcase"]} title="Home: Services Showcase" icon={FiLayers}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiLayers}>Pick which services appear in the homepage showcase section. Full service CRUD lives at <code className="bg-white/60 px-1 rounded">/dashboard/services</code>.</InfoBanner>
      <PageBody>
        <Card title="Section Heading">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Section Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
            <Field label="Section Subtitle"><Input value={data.sectionSubtitle} onChange={set("sectionSubtitle")} /></Field>
          </div>
        </Card>

        <Card title="Services to Display" subtitle={`${data.showSlugs.length} of ${ALL_SERVICES.length} selected`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ALL_SERVICES.map((s) => {
              const on = data.showSlugs.includes(s.slug);
              return (
                <button
                  key={s.slug}
                  onClick={() => toggle(s.slug)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${on ? "border-[#E8663D] bg-[#FFF4F0]" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">{s.title}</div>
                    <div className="text-[11px] text-gray-400 font-mono">/{s.slug}</div>
                  </div>
                  {on && <FiCheck size={16} className="text-[#E8663D]" />}
                </button>
              );
            })}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
