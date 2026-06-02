// About Page → Company Story (rich content)
import { FiBook } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  sectionTitle: "Our Story",
  founderName: "Amar Kumar",
  founderTitle: "Founder & Lead Engineer",
  storyHtml: `<p>Kraviona started in 2020 in a 100-square-foot bedroom office in East Delhi. What began as a single-person freelance practice turned into a 12-person engineering team that ships software for clients across India, the US, the UK, and Germany.</p>

<p>We believe small senior teams ship better software than large junior ones. Every line of code at Kraviona is written by an engineer with at least five years of production experience. Every architecture decision is reviewed by a second senior. Every project is shipped behind feature flags with rollback paths.</p>

<p>We're not here to be the cheapest. We're here to be the team you wish you had hired the first time.</p>`,
  highlightYear: "2020",
  highlightLocation: "East Delhi, India",
};

export default function AboutStory() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "aboutStory" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "About Page", "Story"]} title="About: Company Story" icon={FiBook}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiBook}>Rich-content section on the About page. HTML is allowed inside the story body.</InfoBanner>
      <PageBody>
        <Card title="Heading">
          <Field label="Section Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Founder / Owner Name"><Input value={data.founderName} onChange={set("founderName")} /></Field>
            <Field label="Founder Title"><Input value={data.founderTitle} onChange={set("founderTitle")} /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Founding Year"><Input value={data.highlightYear} onChange={set("highlightYear")} /></Field>
            <Field label="Location"><Input value={data.highlightLocation} onChange={set("highlightLocation")} /></Field>
          </div>
        </Card>
        <Card title="Story Body" subtitle="Rich HTML — paragraphs, lists, links">
          <Field label="Story HTML"><Textarea value={data.storyHtml} onChange={set("storyHtml")} rows={14} mono /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
