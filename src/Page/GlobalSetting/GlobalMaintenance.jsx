// Global → Maintenance Mode
import { FiToggleLeft } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  maintenanceMode: false,
  title: "We'll be right back!",
  message: "We're upgrading our systems. Service should be restored within the next hour. Thanks for your patience.",
  showCountdown: false,
  expectedReturnTime: "2026-06-02T18:00",
  bypassToken: "kraviona-secret-bypass-2026",
  allowedIPs: "203.0.113.42, 198.51.100.10",
  redirectUrl: "",
  showContactLink: true,
  contactLinkText: "Get in touch",
  contactLinkHref: "mailto:kravionatech@gmail.com",
};

export default function GlobalMaintenance() {
  const { data, dirty, saving, saved, set, save } = useSiteConfigForm(INITIAL, { section: "maintenance" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Global", "Maintenance"]} title="Global: Maintenance Mode" icon={FiToggleLeft}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner color="#DC2626" icon={FiToggleLeft}>⚠️ Enabling this immediately replaces the public site with a maintenance screen. Use the bypass token to access the site as admin.</InfoBanner>
      <PageBody>
        <Card title="Master Toggle" accent="#DC2626">
          <Field label="Maintenance Mode"><Toggle value={data.maintenanceMode} onChange={set("maintenanceMode")} label={data.maintenanceMode ? "🔴 Site is DOWN for visitors" : "✅ Site is live"} /></Field>
        </Card>

        <Card title="Maintenance Screen Content">
          <Field label="Title"><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Message"><Textarea value={data.message} onChange={set("message")} rows={4} /></Field>
        </Card>

        <Card title="Countdown">
          <Field label="Show Countdown Timer"><Toggle value={data.showCountdown} onChange={set("showCountdown")} /></Field>
          <Field label="Expected Return Time"><Input type="datetime-local" value={data.expectedReturnTime} onChange={set("expectedReturnTime")} /></Field>
        </Card>

        <Card title="Bypass / Access Control">
          <Field label="Bypass Token" hint="Visit /any-page?bypass=TOKEN to skip maintenance"><Input value={data.bypassToken} onChange={set("bypassToken")} mono /></Field>
          <Field label="Allowed IPs" hint="Comma-separated whitelist — these bypass automatically"><Input value={data.allowedIPs} onChange={set("allowedIPs")} mono /></Field>
          <Field label="Redirect URL (optional)" hint="Send visitors here instead of showing the screen"><Input value={data.redirectUrl} onChange={set("redirectUrl")} mono /></Field>
        </Card>

        <Card title="Contact Link">
          <Field label="Show Contact Link"><Toggle value={data.showContactLink} onChange={set("showContactLink")} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Link Text"><Input value={data.contactLinkText} onChange={set("contactLinkText")} /></Field>
            <Field label="Link URL"><Input value={data.contactLinkHref} onChange={set("contactLinkHref")} mono /></Field>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
