// Services Page → "We Engineer Results" Edge Cards
import { FiZap } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  sectionTitle: "We Engineer Results",
  sectionSubtitle: "4 reasons companies hire Kraviona over a freelance contractor.",
  cards: [
    { icon: "🧠", title: "Senior Engineers Only",  description: "Every line of code is written by an engineer with 5+ years of experience." },
    { icon: "📈", title: "Performance First",      description: "We obsess over Core Web Vitals, p95 latency, and bundle size." },
    { icon: "🔒", title: "Security by Default",    description: "OWASP-aware, JWT-secured, encrypted at rest & in transit." },
    { icon: "🤝", title: "Transparent Process",    description: "Weekly demos, daily slack updates, full repo access from day one." },
  ],
};

export default function ServicesEdgeCards() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "servicesEdge" });
  const upd = (i, k, v) => { const cards = [...data.cards]; cards[i] = { ...cards[i], [k]: v }; setAll({ ...data, cards }); };
  const add = () => setAll({ ...data, cards: [...data.cards, { icon: "✨", title: "", description: "" }] });
  const rem = (i) => setAll({ ...data, cards: data.cards.filter((_, idx) => idx !== i) });

  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Services Page", "Edge Cards"]} title="Services Page: Edge Cards" icon={FiZap}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiZap}>Four "Why Kraviona" cards directly below the services list.</InfoBanner>
      <PageBody>
        <Card title="Section Heading">
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <Field label="Subtitle"><Input value={data.sectionSubtitle} onChange={set("sectionSubtitle")} /></Field>
        </Card>
        <Card title="Cards" subtitle={`${data.cards.length} cards`}>
          <div className="space-y-3">
            {data.cards.map((c, i) => (
              <div key={i} className="flex gap-3 bg-gray-50 rounded-xl p-4">
                <div className="w-14">
                  <Field label="Icon"><Input value={c.icon} onChange={(v) => upd(i, "icon", v)} /></Field>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Title"><Input value={c.title} onChange={(v) => upd(i, "title", v)} /></Field>
                  <Field label="Description"><Textarea rows={1} value={c.description} onChange={(v) => upd(i, "description", v)} /></Field>
                </div>
                <div className="pt-6"><DeleteIconBtn onClick={() => rem(i)} /></div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={add} label="Add Card" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
