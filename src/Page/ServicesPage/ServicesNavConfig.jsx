// Services Page → Nav Dropdown configuration
import { FiSliders, FiMenu } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  groupByCategory: true,
  showIcons: true,
  showServiceCount: true,
  navItems: [
    { slug: "mern-stack-development", title: "MERN Stack Development",       icon: "⚡", category: "web-development",       isVisible: true },
    { slug: "full-stack-development", title: "Full-Stack Development",       icon: "💻", category: "web-development",       isVisible: true },
    { slug: "react-development",      title: "React.js Development",         icon: "⚛",  category: "web-development",       isVisible: true },
    { slug: "nodejs-development",     title: "Node.js Development",          icon: "🟢", category: "web-development",       isVisible: true },
    { slug: "backend-development",    title: "Backend Development",          icon: "⚙️", category: "backend-architecture",  isVisible: true },
    { slug: "api-development",        title: "API Development",              icon: "🔌", category: "backend-architecture",  isVisible: true },
    { slug: "database-architecture",  title: "Database Architecture",        icon: "🗄️", category: "backend-architecture",  isVisible: true },
    { slug: "saas-development",       title: "SaaS Development",             icon: "☁️", category: "backend-architecture",  isVisible: true },
    { slug: "technical-seo",          title: "Technical SEO",                icon: "📈", category: "performance-ai",        isVisible: true },
    { slug: "web-performance-optimization", title: "Web Performance",        icon: "🚀", category: "performance-ai",        isVisible: true },
    { slug: "ai-automation",          title: "AI Automation",                icon: "🤖", category: "performance-ai",        isVisible: true },
  ],
};

export default function ServicesNavConfig() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "servicesNav" });
  const upd = (i, k, v) => { const items = [...data.navItems]; items[i] = { ...items[i], [k]: v }; setAll({ ...data, navItems: items }); };
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Services Page", "Nav Dropdown"]} title="Services Nav Dropdown" icon={FiSliders}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiSliders}>Controls the megamenu under "Services" in the site header.</InfoBanner>
      <PageBody>
        <Card title="Display Options">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Group by Category"><Toggle value={data.groupByCategory} onChange={set("groupByCategory")} /></Field>
            <Field label="Show Icons"><Toggle value={data.showIcons} onChange={set("showIcons")} /></Field>
            <Field label="Show Service Count Chip"><Toggle value={data.showServiceCount} onChange={set("showServiceCount")} /></Field>
          </div>
        </Card>

        <Card title="Service Items" subtitle={`${data.navItems.filter(n => n.isVisible).length} visible · ${data.navItems.length} total`}>
          <div className="space-y-2">
            {data.navItems.map((n, i) => (
              <div key={n.slug} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                <FiMenu size={14} className="text-gray-300 cursor-move" />
                <span className="text-xl w-8 text-center">{n.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{n.title}</div>
                  <div className="text-[11px] text-gray-400 font-mono">/{n.slug}</div>
                </div>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">{n.category}</span>
                <Toggle value={n.isVisible} onChange={(v) => upd(i, "isVisible", v)} />
              </div>
            ))}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
