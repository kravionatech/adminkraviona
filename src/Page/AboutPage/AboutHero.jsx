// About Page → Hero
import { FiMonitor } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  badge: "About Kraviona",
  title: "Engineering trust, one project at a time.",
  tagline: "We're a small senior team building world-class MERN apps for ambitious startups and enterprises.",
  heroImage: "/about-hero.jpg",
};

export default function AboutHero() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "aboutHero" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "About Page", "Hero"]} title="About: Hero & Tagline" icon={FiMonitor}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMonitor}>Top section of <code className="bg-white/60 px-1 rounded">/about</code>.</InfoBanner>
      <PageBody>
        <Card title="Hero Content">
          <Field label="Badge"><Input value={data.badge} onChange={set("badge")} /></Field>
          <Field label="Title" required><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Tagline" hint="One-line summary below the title"><Textarea value={data.tagline} onChange={set("tagline")} rows={2} /></Field>
          <Field label="Hero Image URL"><Input value={data.heroImage} onChange={set("heroImage")} mono /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
