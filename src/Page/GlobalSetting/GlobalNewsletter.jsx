// Global → Newsletter (master config used by every newsletter form on the site)
import { FiMail } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  enabled: true,
  provider: "internal",
  mailchimpListId: "",
  apiKey: "",
  doubleOptIn: true,
  welcomeEmailEnabled: true,
  welcomeSubject: "Welcome to Kraviona 🌟",
  welcomeBody: "Hi {{name}},\n\nThanks for subscribing! You'll get our best MERN, SEO and performance content straight to your inbox — roughly twice a month.\n\n— The Kraviona Team",
  unsubscribePageUrl: "/unsubscribe",
};

export default function GlobalNewsletter() {
  const { data, dirty, saving, saved, set, save } = useSiteConfigForm(INITIAL, { section: "newsletter" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Global", "Newsletter"]} title="Global: Newsletter Setup" icon={FiMail}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMail}>Master newsletter configuration. Provider integration + welcome email + double opt-in.</InfoBanner>
      <PageBody>
        <Card title="Status">
          <Field label="Newsletter Enabled"><Toggle value={data.enabled} onChange={set("enabled")} label="Globally toggle subscribe forms" /></Field>
        </Card>

        <Card title="Provider">
          <Field label="Provider">
            <select value={data.provider} onChange={(e) => set("provider")(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white">
              <option value="internal">Internal (MongoDB collection)</option>
              <option value="mailchimp">Mailchimp</option>
              <option value="sendgrid">SendGrid</option>
              <option value="mailerlite">MailerLite</option>
              <option value="convertkit">ConvertKit</option>
            </select>
          </Field>
          {data.provider !== "internal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="List / Audience ID"><Input value={data.mailchimpListId} onChange={set("mailchimpListId")} mono /></Field>
              <Field label="API Key"><Input value={data.apiKey} onChange={set("apiKey")} mono type="password" /></Field>
            </div>
          )}
        </Card>

        <Card title="Subscription Flow">
          <Field label="Double Opt-In Required"><Toggle value={data.doubleOptIn} onChange={set("doubleOptIn")} label="GDPR-friendly confirmation email" /></Field>
          <Field label="Send Welcome Email"><Toggle value={data.welcomeEmailEnabled} onChange={set("welcomeEmailEnabled")} /></Field>
          <Field label="Welcome Subject"><Input value={data.welcomeSubject} onChange={set("welcomeSubject")} /></Field>
          <Field label="Welcome Body" hint="Supports {{name}} & {{email}} merge tags"><Textarea value={data.welcomeBody} onChange={set("welcomeBody")} rows={8} /></Field>
          <Field label="Unsubscribe Page URL"><Input value={data.unsubscribePageUrl} onChange={set("unsubscribePageUrl")} mono /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
