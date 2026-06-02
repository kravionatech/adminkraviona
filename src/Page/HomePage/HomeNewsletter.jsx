// Home Page → Newsletter Section
import { FiMail } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  title: "Stay in the Loop",
  subtitle: "Get the latest MERN tips, SEO strategies, and dev insights — straight to your inbox.",
  homeNewsletter: "Enter your email address…",
  ctaText: "Subscribe",
  successMessage: "🎉 You're in. Check your inbox to confirm.",
  duplicateMessage: "You're already subscribed.",
  privacyNote: "We respect your inbox — unsubscribe anytime.",
  showOnHome: true,
};

export default function HomeNewsletter() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "homeNewsletter" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "Newsletter"]} title="Home: Newsletter Section" icon={FiMail}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMail}>Inline newsletter block on the homepage. POSTs to <code className="bg-white/60 px-1 rounded">/api/v1/public/newsletter/subscribe</code>.</InfoBanner>
      <PageBody>
        <Card title="Visibility">
          <Field label="Show Newsletter Block"><Toggle value={data.showOnHome} onChange={set("showOnHome")} /></Field>
        </Card>
        <Card title="Copy">
          <Field label="Title"><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle} onChange={set("subtitle")} rows={2} /></Field>
          <Field label="Input homeNewsletter"><Input value={data.homeNewsletter} onChange={set("homeNewsletter")} /></Field>
          <Field label="Button Text"><Input value={data.ctaText} onChange={set("ctaText")} /></Field>
        </Card>
        <Card title="Confirmation Messages">
          <Field label="Success Message"><Input value={data.successMessage} onChange={set("successMessage")} /></Field>
          <Field label="Duplicate Email Message"><Input value={data.duplicateMessage} onChange={set("duplicateMessage")} /></Field>
          <Field label="Privacy Note"><Input value={data.privacyNote} onChange={set("privacyNote")} /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
