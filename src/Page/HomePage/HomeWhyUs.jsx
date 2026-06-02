// Home Page → Why Kraviona Section
import { FiCheckSquare, FiPlus } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  title: "Why Choose Kraviona?",
  subtitle: "We combine technical excellence with business acumen to deliver software that truly performs.",
  features: [
    { icon: "⚡", title: "Agile Delivery",         description: "Sprint-based development with weekly demos and full transparency." },
    { icon: "📈", title: "Scalable Architecture",  description: "Future-proof systems built to grow with your business." },
    { icon: "📊", title: "Data-Driven",            description: "Every decision backed by analytics and performance metrics." },
  ],
};

export default function HomeWhyUs() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "whyUs" });

  const upd = (i, k, v) => {
    const features = [...data.features];
    features[i] = { ...features[i], [k]: v };
    setAll({ ...data, features });
  };
  const add = () => setAll({ ...data, features: [...data.features, { icon: "✨", title: "", description: "" }] });
  const rem = (i) => setAll({ ...data, features: data.features.filter((_, idx) => idx !== i) });

  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "Why Kraviona"]} title="Home: Why Kraviona Section" icon={FiCheckSquare}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiCheckSquare}>3 (or more) feature cards highlighting reasons clients choose Kraviona.</InfoBanner>
      <PageBody>
        <Card title="Section Heading">
          <Field label="Title"><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle} onChange={set("subtitle")} rows={2} /></Field>
        </Card>

        <Card title="Feature Cards" subtitle={`${data.features.length} cards`}>
          <div className="space-y-3">
            {data.features.map((f, i) => (
              <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-4">
                <div className="w-14">
                  <Field label="Icon"><Input value={f.icon} onChange={(v) => upd(i, "icon", v)} whyUs="⚡" /></Field>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Title"><Input value={f.title} onChange={(v) => upd(i, "title", v)} /></Field>
                  <Field label="Description"><Input value={f.description} onChange={(v) => upd(i, "description", v)} /></Field>
                </div>
                <div className="pt-6">
                  <DeleteIconBtn onClick={() => rem(i)} />
                </div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={add} label="Add Feature Card" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
