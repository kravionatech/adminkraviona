// Gallery Page → Featured Projects picker
import { FiStar, FiCheck } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const PROJECTS = [
  { id: "p1", title: "FinScale — Treasury Dashboard",     type: "saas",        client: "FinScale", year: 2025, thumb: "" },
  { id: "p2", title: "BoltCart — Headless Storefront",    type: "ecommerce",   client: "BoltCart", year: 2025, thumb: "" },
  { id: "p3", title: "Northwave — Booking Platform",      type: "web-app",     client: "Northwave", year: 2024, thumb: "" },
  { id: "p4", title: "Lumen — Marketing Site",            type: "marketing",   client: "Lumen Analytics", year: 2024, thumb: "" },
  { id: "p5", title: "QuickServ — Workforce Mobile App",  type: "mobile-app",  client: "QuickServ", year: 2024, thumb: "" },
  { id: "p6", title: "GreenLeaf — Subscription Engine",   type: "saas",        client: "GreenLeaf", year: 2025, thumb: "" },
];

const INITIAL = {
  sectionTitle: "Featured Projects",
  sectionSubtitle: "A small sample of work we're proud of.",
  showSection: true,
  featuredIds: ["p1", "p2", "p6"],
  layoutStyle: "grid",
};

export default function GalleryFeatured() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "galleryFeatured" });
  const toggleId = (id) => set("featuredIds")(data.featuredIds.includes(id) ? data.featuredIds.filter((x) => x !== id) : [...data.featuredIds, id]);
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Gallery Page", "Featured"]} title="Gallery: Featured Projects" icon={FiStar}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiStar}>Pick projects to surface at the top of <code className="bg-white/60 px-1 rounded">/gallery</code>. CRUD lives at <code className="bg-white/60 px-1 rounded">/dashboard/portfolio</code>.</InfoBanner>
      <PageBody>
        <Card title="Section Heading">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
            <Field label="Subtitle"><Input value={data.sectionSubtitle} onChange={set("sectionSubtitle")} /></Field>
          </div>
          <Field label="Show Section"><Toggle value={data.showSection} onChange={set("showSection")} /></Field>
        </Card>

        <Card title="Pick Featured Projects" subtitle={`${data.featuredIds.length} of ${PROJECTS.length} selected`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PROJECTS.map((p) => {
              const on = data.featuredIds.includes(p.id);
              return (
                <button key={p.id} onClick={() => toggleId(p.id)}
                  className={`text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${on ? "border-[#E8663D] bg-[#FFF4F0]" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
                  <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">{p.title.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-800">{p.title}</div>
                    <div className="text-[11px] text-gray-400">{p.client} · {p.year} · {p.type}</div>
                  </div>
                  {on && <FiCheck size={18} className="text-[#E8663D]" />}
                </button>
              );
            })}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
