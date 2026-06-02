// Home Page → Testimonials picker
import { FiStar, FiCheck } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const ALL_TESTIMONIALS = [
  { id: "t1", name: "Priya Sharma",    company: "FinScale",       quote: "Kraviona shipped our MERN backend in 5 weeks. Rock-solid team.", rating: 5, isApproved: true,  isFeatured: true,  platform: "Google" },
  { id: "t2", name: "Marcus Reed",     company: "BoltCart",       quote: "Their SEO work doubled our organic traffic in 3 months.",        rating: 5, isApproved: true,  isFeatured: true,  platform: "Clutch" },
  { id: "t3", name: "Aanya Krishnan",  company: "Lumen Analytics",quote: "Easily the most communicative dev shop I've worked with.",        rating: 5, isApproved: true,  isFeatured: false, platform: "Trustpilot" },
  { id: "t4", name: "James Okonkwo",   company: "GreenLeaf SaaS", quote: "Took our app from 18s to 1.4s load time. Magic.",                rating: 5, isApproved: true,  isFeatured: true,  platform: "G2" },
  { id: "t5", name: "Sara Müller",     company: "Northwave",      quote: "Migrated us off PHP/MySQL onto Node + Mongo without downtime.",  rating: 5, isApproved: true,  isFeatured: false, platform: "LinkedIn" },
  { id: "t6", name: "Rohan Mehta",     company: "QuickServ",      quote: "Honestly the best DX I've ever seen from an outsourced team.",   rating: 5, isApproved: true,  isFeatured: true,  platform: "Google" },
];

const INITIAL = {
  sectionTitle: "What Our Clients Say",
  sectionSubtitle: "Don't take our word for it — hear from the people we've built with.",
  showSection: true,
  pickedIds: ["t1", "t2", "t4", "t6"],
  autoPlay: true,
};

export default function HomeTestimonials() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "homeTestimonials" });
  const toggleId = (id) => set("pickedIds")(data.pickedIds.includes(id) ? data.pickedIds.filter((x) => x !== id) : [...data.pickedIds, id]);
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "Testimonials"]} title="Home: Testimonials Selection" icon={FiStar}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiStar}>Pick which approved testimonials carousel on the homepage. Manage full reviews at <code className="bg-white/60 px-1 rounded">/dashboard/testimonials</code>.</InfoBanner>
      <PageBody>
        <Card title="Section Visibility">
          <Field label="Show Section"><Toggle value={data.showSection} onChange={set("showSection")} /></Field>
        </Card>

        <Card title="Heading">
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <Field label="Subtitle"><Input value={data.sectionSubtitle} onChange={set("sectionSubtitle")} /></Field>
          <Field label="Auto-play Carousel"><Toggle value={data.autoPlay} onChange={set("autoPlay")} label="Cycle every 6s" /></Field>
        </Card>

        <Card title="Pick Testimonials" subtitle={`${data.pickedIds.length} of ${ALL_TESTIMONIALS.length} selected`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ALL_TESTIMONIALS.map((t) => {
              const on = data.pickedIds.includes(t.id);
              return (
                <button key={t.id} onClick={() => toggleId(t.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${on ? "border-[#E8663D] bg-[#FFF4F0]" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">{t.name}</div>
                      <div className="text-[11px] text-gray-400">{t.company} · {t.platform}</div>
                      <div className="text-yellow-500 text-xs mt-1">{"★".repeat(t.rating)}</div>
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
