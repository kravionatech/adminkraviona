// Gallery Page → Testimonials
import { FiMessageSquare, FiCheck } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const ALL = [
  { id: "t1", name: "Priya Sharma",   company: "FinScale",       project: "Treasury Dashboard",        quote: "Kraviona shipped our MERN backend in 5 weeks. Rock-solid team." },
  { id: "t2", name: "Marcus Reed",    company: "BoltCart",       project: "Headless Storefront",       quote: "Their SEO work doubled our organic traffic in 3 months." },
  { id: "t4", name: "James Okonkwo",  company: "GreenLeaf SaaS", project: "Subscription Engine",       quote: "Took our app from 18s to 1.4s load time. Magic." },
  { id: "t6", name: "Rohan Mehta",    company: "QuickServ",      project: "Workforce Mobile App",      quote: "Honestly the best DX I've ever seen from an outsourced team." },
];

const INITIAL = {
  showSection: true,
  sectionTitle: "What Our Clients Say",
  sectionSubtitle: "Words from the founders we've shipped for.",
  pickedIds: ["t1", "t4"],
};

export default function GalleryTestimonials() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "galleryTestimonials" });
  const toggle = (id) => set("pickedIds")(data.pickedIds.includes(id) ? data.pickedIds.filter((x) => x !== id) : [...data.pickedIds, id]);
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Gallery Page", "Testimonials"]} title="Gallery: Testimonials" icon={FiMessageSquare}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMessageSquare}>Select project-tied testimonials for the gallery page. Only testimonials with <code className="bg-white/60 px-1 rounded">showOn: gallery</code> appear here.</InfoBanner>
      <PageBody>
        <Card title="Section">
          <Field label="Show on Gallery Page"><Toggle value={data.showSection} onChange={set("showSection")} /></Field>
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <Field label="Subtitle"><Input value={data.sectionSubtitle} onChange={set("sectionSubtitle")} /></Field>
        </Card>
        <Card title="Pick Testimonials" subtitle={`${data.pickedIds.length} selected`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ALL.map((t) => {
              const on = data.pickedIds.includes(t.id);
              return (
                <button key={t.id} onClick={() => toggle(t.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${on ? "border-[#E8663D] bg-[#FFF4F0]" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">{t.name}</div>
                      <div className="text-[11px] text-gray-400">{t.company} · {t.project}</div>
                      <p className="text-xs text-gray-600 italic mt-2">“{t.quote}”</p>
                    </div>
                    {on && <FiCheck size={16} className="text-[#E8663D] mt-1" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
