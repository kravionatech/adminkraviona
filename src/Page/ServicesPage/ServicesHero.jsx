// Services Page → Hero
import { FiMonitor } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  badge: "Engineering Excellence",
  title: "Services Built to Scale",
  subtitle: "Full-stack engineering, technical SEO, and AI automation — under one roof.",
  bgImage: "",
  ctaText: "Talk to Engineering",
  ctaLink: "/contact",
};

export default function ServicesHero() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "servicesHero" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Services Page", "Hero"]} title="Services Page: Hero" icon={FiMonitor}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMonitor}>Top hero strip on <code className="bg-white/60 px-1 rounded">/services</code>.</InfoBanner>
      <PageBody>
        <Card title="Content">
          <Field label="Badge"><Input value={data.badge} onChange={set("badge")} /></Field>
          <Field label="Title" required><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle} onChange={set("subtitle")} rows={2} /></Field>
          <Field label="Background Image URL" hint="Optional"><Input value={data.bgImage} onChange={set("bgImage")} mono /></Field>
        </Card>
        <Card title="CTA Button">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Button Text"><Input value={data.ctaText} onChange={set("ctaText")} /></Field>
            <Field label="Button Link"><Input value={data.ctaLink} onChange={set("ctaLink")} /></Field>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
