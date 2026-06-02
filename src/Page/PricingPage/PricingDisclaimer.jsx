// Pricing Page → Disclaimer
import { FiFileText } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  showDisclaimer: true,
  disclaimerText: "All prices in USD. Taxes (GST/VAT) added at checkout where applicable. Cancel anytime with 30 days notice. Migration support included on annual plans.",
  smallPrintText: "Custom enterprise SLAs and dedicated team retainers are available — contact sales.",
  refundPolicyLink: "/refund-policy",
  termsLink: "/terms",
};

export default function PricingDisclaimer() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "pricingDisclaimer" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Pricing", "Disclaimer"]} title="Pricing: Disclaimer" icon={FiFileText}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiFileText}>Small-print disclaimer block at the bottom of the pricing cards.</InfoBanner>
      <PageBody>
        <Card title="Disclaimer">
          <Field label="Show Disclaimer"><Toggle value={data.showDisclaimer} onChange={set("showDisclaimer")} /></Field>
          <Field label="Main Disclaimer Text"><Textarea value={data.disclaimerText} onChange={set("disclaimerText")} rows={4} /></Field>
          <Field label="Small Print" hint="Extra fine print displayed below"><Textarea value={data.smallPrintText} onChange={set("smallPrintText")} rows={2} /></Field>
        </Card>
        <Card title="Policy Links">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Refund Policy Link"><Input value={data.refundPolicyLink} onChange={set("refundPolicyLink")} mono /></Field>
            <Field label="Terms of Service Link"><Input value={data.termsLink} onChange={set("termsLink")} mono /></Field>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
