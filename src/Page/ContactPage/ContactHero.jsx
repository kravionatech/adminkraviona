// Contact Page → Hero
import { FiMonitor } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  badge: "Get in Touch",
  title: "Let's start a conversation.",
  subtitle: "Drop us a line — we usually reply in under 4 hours during business days.",
  bgImage: "",
};

export default function ContactHero() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "contactHero" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Contact Page", "Hero"]} title="Contact: Page Hero" icon={FiMonitor}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMonitor}>Top hero on <code className="bg-white/60 px-1 rounded">/contact</code>.</InfoBanner>
      <PageBody>
        <Card title="Hero">
          <Field label="Badge"><Input value={data.badge} onChange={set("badge")} /></Field>
          <Field label="Title" required><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle} onChange={set("subtitle")} rows={2} /></Field>
          <Field label="Background Image URL"><Input value={data.bgImage} onChange={set("bgImage")} mono /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
