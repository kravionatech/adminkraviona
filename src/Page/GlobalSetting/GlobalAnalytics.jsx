// Global → Analytics / Tag Manager scripts
import { FiBarChart2 } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  gtmId: "GTM-5LX2JWGD",
  gaId: "G-XXXXXXXXX",
  facebookPixelId: "",
  hotjarId: "",
  microsoftClarityId: "",
  enableConsentBanner: true,
  consentRequiredCountries: "EEA, UK, California",
  customHeadScript: "",
  customBodyScript: "",
  loadScriptsInDev: false,
};

export default function GlobalAnalytics() {
  const { data, dirty, saving, saved, set, save } = useSiteConfigForm(INITIAL, { section: "analytics" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Global", "Analytics"]} title="Global: Analytics Scripts" icon={FiBarChart2}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiBarChart2}>All tracking IDs and custom HTML head/body scripts. Loaded based on cookie consent.</InfoBanner>
      <PageBody>
        <Card title="Tracking IDs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="GTM Container ID" hint="GTM-XXXXXXX"><Input value={data.gtmId} onChange={set("gtmId")} mono /></Field>
            <Field label="Google Analytics 4 ID" hint="G-XXXXXXXXX"><Input value={data.gaId} onChange={set("gaId")} mono /></Field>
            <Field label="Facebook / Meta Pixel ID"><Input value={data.facebookPixelId} onChange={set("facebookPixelId")} mono /></Field>
            <Field label="Hotjar Site ID"><Input value={data.hotjarId} onChange={set("hotjarId")} mono /></Field>
            <Field label="Microsoft Clarity ID"><Input value={data.microsoftClarityId} onChange={set("microsoftClarityId")} mono /></Field>
          </div>
        </Card>

        <Card title="Cookie Consent">
          <Field label="Show Cookie Banner"><Toggle value={data.enableConsentBanner} onChange={set("enableConsentBanner")} /></Field>
          <Field label="Countries Requiring Consent" hint="Comma-separated"><Input value={data.consentRequiredCountries} onChange={set("consentRequiredCountries")} /></Field>
          <Field label="Load Scripts in Development"><Toggle value={data.loadScriptsInDev} onChange={set("loadScriptsInDev")} label="Off in dev = faster local builds" /></Field>
        </Card>

        <Card title="Custom Scripts">
          <Field label="Custom <head> Scripts" hint="HTML/JS injected before closing head tag"><Textarea value={data.customHeadScript} onChange={set("customHeadScript")} rows={6} mono /></Field>
          <Field label="Custom <body> Scripts" hint="Injected at the bottom of body"><Textarea value={data.customBodyScript} onChange={set("customBodyScript")} rows={6} mono /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
