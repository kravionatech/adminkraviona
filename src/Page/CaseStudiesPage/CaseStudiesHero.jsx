// Case Studies Page → Hero
import { FiMonitor } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  badge: "Case Studies",
  title: "Deep dives into the work we've shipped.",
  subtitle: "Real engineering teardowns — architecture, trade-offs, and measurable outcomes.",
  comingSoonTitle: "Launching Soon",
  comingSoonSubtitle: "We're putting the finishing touches on detailed case studies. Drop your email below to be the first to know.",
};

export default function CaseStudiesHero() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "caseStudiesHero" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Case Studies", "Hero"]} title="Case Studies: Hero" icon={FiMonitor}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMonitor}>Top hero on <code className="bg-white/60 px-1 rounded">/case-studies</code>. Shows a "Coming Soon" state until published studies exist.</InfoBanner>
      <PageBody>
        <Card title="Live Hero (after launch)">
          <Field label="Badge"><Input value={data.badge} onChange={set("badge")} /></Field>
          <Field label="Title" required><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle} onChange={set("subtitle")} rows={2} /></Field>
        </Card>
        <Card title="Coming-Soon State">
          <Field label="Title"><Input value={data.comingSoonTitle} onChange={set("comingSoonTitle")} /></Field>
          <Field label="Subtitle"><Textarea value={data.comingSoonSubtitle} onChange={set("comingSoonSubtitle")} rows={2} /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
