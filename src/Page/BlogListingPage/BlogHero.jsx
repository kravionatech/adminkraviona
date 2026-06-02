// Blog Listing → Hero
import { FiMonitor } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  badge: "Engineering Blog",
  title: "Articles, tutorials, and teardowns.",
  subtitle: "Real-world MERN, SEO, and architecture insights from our engineering team.",
  searchblogHero: "Search articles…",
  bgImage: "",
};

export default function BlogHero() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "blogHero" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Blog Listing", "Hero"]} title="Blog Listing: Hero" icon={FiMonitor}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMonitor}>Top hero on <code className="bg-white/60 px-1 rounded">/blog</code>.</InfoBanner>
      <PageBody>
        <Card title="Hero">
          <Field label="Badge"><Input value={data.badge} onChange={set("badge")} /></Field>
          <Field label="Title" required><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle} onChange={set("subtitle")} rows={2} /></Field>
          <Field label="Search blogHero"><Input value={data.searchblogHero} onChange={set("searchblogHero")} /></Field>
          <Field label="Background Image URL"><Input value={data.bgImage} onChange={set("bgImage")} mono /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
