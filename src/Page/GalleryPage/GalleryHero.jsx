// Gallery Page → Hero
import { FiMonitor } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  badge: "Selected Work",
  title: "Real Projects. Real Impact.",
  subtitle: "A look at recent builds we shipped for SaaS founders, e-commerce brands, and enterprises.",
  bgImage: "",
  emptyStateText: "We're hand-picking projects to feature here. Check back soon.",
};

export default function GalleryHero() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "galleryHero" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Gallery Page", "Hero"]} title="Gallery: Page Hero" icon={FiMonitor}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMonitor}>Top hero on <code className="bg-white/60 px-1 rounded">/gallery</code>. Currently empty until Portfolio entries are populated.</InfoBanner>
      <PageBody>
        <Card title="Hero Content">
          <Field label="Badge"><Input value={data.badge} onChange={set("badge")} /></Field>
          <Field label="Title" required><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle} onChange={set("subtitle")} rows={2} /></Field>
          <Field label="Background Image URL"><Input value={data.bgImage} onChange={set("bgImage")} mono /></Field>
        </Card>
        <Card title="Empty State">
          <Field label="Empty State Message" hint="Shown when no projects are published"><Input value={data.emptyStateText} onChange={set("emptyStateText")} /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
