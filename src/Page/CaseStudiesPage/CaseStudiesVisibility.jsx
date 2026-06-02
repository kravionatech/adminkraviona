// Case Studies → Visibility / Coming Soon toggle
import { FiToggleLeft } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  isComingSoon: true,
  showNotifyForm: true,
  comingSoonHeading: "Case Studies — Launching Soon",
  comingSoonBody: "We're polishing the first batch of case studies. Subscribe and we'll ping you the moment they go live.",
  expectedLaunchDate: "2026-08-01",
};

export default function CaseStudiesVisibility() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "caseStudiesVisibility" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Case Studies", "Visibility"]} title="Case Studies: Coming-Soon Toggle" icon={FiToggleLeft}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiToggleLeft}>Master switch for the <code className="bg-white/60 px-1 rounded">/case-studies</code> page. When ON, the page shows a teaser. When OFF, published case studies are listed.</InfoBanner>
      <PageBody>
        <Card title="Master Toggle">
          <Field label="Coming Soon Mode"><Toggle value={data.isComingSoon} onChange={set("isComingSoon")} label={data.isComingSoon ? "Page shows TEASER only" : "Page shows published studies"} /></Field>
        </Card>
        <Card title="Teaser Content" subtitle="Only shown while coming-soon mode is ON">
          <Field label="Heading"><Input value={data.comingSoonHeading} onChange={set("comingSoonHeading")} /></Field>
          <Field label="Body Copy"><Textarea value={data.comingSoonBody} onChange={set("comingSoonBody")} rows={3} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Expected Launch Date"><Input type="date" value={data.expectedLaunchDate} onChange={set("expectedLaunchDate")} /></Field>
            <Field label="Show Notify-Me Form"><Toggle value={data.showNotifyForm} onChange={set("showNotifyForm")} /></Field>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
