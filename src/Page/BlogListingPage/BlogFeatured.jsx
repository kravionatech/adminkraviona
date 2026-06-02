// Blog Listing → Featured Post Picker
import { FiStar, FiCheck } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const POSTS = [
  { id: "b1", title: "Scaling a MERN backend past 1M requests/day",            author: "Amar Kumar", date: "2026-05-21", category: "Engineering" },
  { id: "b2", title: "Core Web Vitals in 2026: what's still working",          author: "Priya Verma", date: "2026-05-18", category: "SEO" },
  { id: "b3", title: "MongoDB schema design for real-world SaaS apps",        author: "Amar Kumar", date: "2026-05-10", category: "Database" },
  { id: "b4", title: "Why we moved off Redux for Zustand",                     author: "Rohan Iyer",  date: "2026-04-29", category: "React" },
  { id: "b5", title: "A pragmatic guide to LLM integration for product teams", author: "Priya Verma", date: "2026-04-22", category: "AI" },
  { id: "b6", title: "Lighthouse 100 — yes, it's still possible",              author: "Amar Kumar",  date: "2026-04-10", category: "Performance" },
];

const INITIAL = {
  featuredId: "b1",
  showSecondaryFeatured: true,
  secondaryIds: ["b2", "b3"],
  sectionTitle: "Featured Read",
};

export default function BlogFeatured() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "blogFeatured" });
  const toggleSec = (id) => set("secondaryIds")(data.secondaryIds.includes(id) ? data.secondaryIds.filter((x) => x !== id) : [...data.secondaryIds, id]);
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Blog Listing", "Featured"]} title="Blog Listing: Featured Post Picker" icon={FiStar}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiStar}>Pick one hero post and 2-3 secondary featured posts shown above the chronological list.</InfoBanner>
      <PageBody>
        <Card title="Section Heading">
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
        </Card>

        <Card title="Hero Post" subtitle="Single large card at the top">
          <div className="space-y-2">
            {POSTS.map((p) => {
              const on = data.featuredId === p.id;
              return (
                <button key={p.id} onClick={() => set("featuredId")(p.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${on ? "border-[#E8663D] bg-[#FFF4F0]" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-800">{p.title}</div>
                    <div className="text-[11px] text-gray-400">{p.author} · {p.category} · {p.date}</div>
                  </div>
                  {on && <FiCheck size={16} className="text-[#E8663D]" />}
                </button>
              );
            })}
          </div>
        </Card>

        <Card title="Secondary Featured" subtitle={`${data.secondaryIds.length} selected · max 3 recommended`}>
          <Field label="Show Secondary Section"><Toggle value={data.showSecondaryFeatured} onChange={set("showSecondaryFeatured")} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            {POSTS.map((p) => {
              const on = data.secondaryIds.includes(p.id);
              const isHero = data.featuredId === p.id;
              return (
                <button key={p.id} onClick={() => !isHero && toggleSec(p.id)} disabled={isHero}
                  className={`text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${isHero ? "opacity-30 cursor-not-allowed border-gray-100" : on ? "border-[#E8663D] bg-[#FFF4F0]" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">{p.title}</div>
                    <div className="text-[11px] text-gray-400">{p.author} · {p.category}</div>
                  </div>
                  {on && <FiCheck size={14} className="text-[#E8663D]" />}
                  {isHero && <span className="text-[10px] text-gray-400">Already Hero</span>}
                </button>
              );
            })}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
