// Case Studies → "Notify Me" form configuration
import { FiBell } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  formTitle: "Get notified the moment we launch",
  formSubtitle: "Drop your email and we'll send the first case study straight to your inbox.",
  caseStudiesNotify: "your@email.com",
  buttonText: "Notify Me",
  successMessage: "🎉 You're on the list. We'll be in touch.",
  duplicateMessage: "You're already on the list.",
  saveToNewsletter: true,
};

const DUMMY_SIGNUPS = [
  { email: "founder@finscale.io",  date: "2026-05-30" },
  { email: "ceo@boltcart.com",     date: "2026-05-28" },
  { email: "hello@northwave.app",  date: "2026-05-25" },
  { email: "info@lumen.ai",        date: "2026-05-21" },
];

export default function CaseStudiesNotify() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "caseStudiesNotify" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Case Studies", "Notify Form"]} title="Case Studies: Notify-Me Form" icon={FiBell}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiBell}>Form shown on the coming-soon page that collects emails to alert when case studies launch.</InfoBanner>
      <PageBody>
        <Card title="Copy">
          <Field label="Form Title"><Input value={data.formTitle} onChange={set("formTitle")} /></Field>
          <Field label="Subtitle"><Textarea value={data.formSubtitle} onChange={set("formSubtitle")} rows={2} /></Field>
          <Field label="caseStudiesNotify"><Input value={data.caseStudiesNotify} onChange={set("caseStudiesNotify")} /></Field>
          <Field label="Button Text"><Input value={data.buttonText} onChange={set("buttonText")} /></Field>
        </Card>
        <Card title="Confirmation Messages">
          <Field label="Success Message"><Input value={data.successMessage} onChange={set("successMessage")} /></Field>
          <Field label="Duplicate Message"><Input value={data.duplicateMessage} onChange={set("duplicateMessage")} /></Field>
          <Field label="Also Save to Newsletter List"><Toggle value={data.saveToNewsletter} onChange={set("saveToNewsletter")} /></Field>
        </Card>

        <Card title="Recent Notify-Me Signups" subtitle="Most recent 4 entries">
          <div className="bg-gray-50 rounded-xl divide-y divide-gray-200">
            {DUMMY_SIGNUPS.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-gray-800 font-mono">{s.email}</span>
                <span className="text-xs text-gray-400">{s.date}</span>
              </div>
            ))}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
