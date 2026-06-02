// Pricing Page → Visibility / Coming Soon Toggle
import { FiToggleLeft } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  isComingSoon: true,
  showRequestQuoteButton: true,
  requestQuoteText: "Request a Custom Quote",
  requestQuoteLink: "/contact",
  customMessage: "All current engagements are custom-scoped. Talk to us and we'll build a plan around your roadmap.",
};

export default function PricingVisibility() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "pricingVisibility" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Pricing", "Visibility"]} title="Pricing: Coming-Soon Toggle" icon={FiToggleLeft}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiToggleLeft}>Master toggle for <code className="bg-white/60 px-1 rounded">/pricing</code>. When ON, plans are hidden and a custom-quote CTA is shown.</InfoBanner>
      <PageBody>
        <Card title="Master Switch">
          <Field label="Coming Soon Mode"><Toggle value={data.isComingSoon} onChange={set("isComingSoon")} label={data.isComingSoon ? "Hiding pricing plans" : "Plans are LIVE"} /></Field>
        </Card>
        <Card title="Coming-Soon Content">
          <Field label="Custom Message"><Textarea value={data.customMessage} onChange={set("customMessage")} rows={3} /></Field>
          <Field label="Show 'Request a Quote' Button"><Toggle value={data.showRequestQuoteButton} onChange={set("showRequestQuoteButton")} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Button Text"><Input value={data.requestQuoteText} onChange={set("requestQuoteText")} /></Field>
            <Field label="Button Link"><Input value={data.requestQuoteLink} onChange={set("requestQuoteLink")} /></Field>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
