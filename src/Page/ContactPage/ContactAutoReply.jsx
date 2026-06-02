// Contact Page → Auto-Reply Email Template
import { FiMail } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  enabled: true,
  fromName: "Kraviona Team",
  fromEmail: "no-reply@kraviona.com",
  replyTo: "kravionatech@gmail.com",
  subject: "We got your message ✨",
  bodyHtml: `<p>Hi {{name}},</p>

<p>Thanks for reaching out to Kraviona. We've received your message and one of our engineers will be in touch shortly — usually within 4 business hours.</p>

<p>In the meantime, here are some quick links you might find useful:</p>
<ul>
  <li><a href="https://kraviona.com/services">Our Services</a></li>
  <li><a href="https://kraviona.com/blog">Engineering Blog</a></li>
  <li><a href="https://kraviona.com/case-studies">Case Studies</a></li>
</ul>

<p>— The Kraviona Team<br/>
<a href="https://kraviona.com">kraviona.com</a></p>`,
  signatureImageUrl: "",
};

export default function ContactAutoReply() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "contactAutoReply" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Contact Page", "Auto-Reply"]} title="Contact: Auto-Reply Email" icon={FiMail}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMail}>HTML template sent to anyone who submits the contact form. Use <code className="bg-white/60 px-1 rounded">{`{{name}}`}</code> and <code className="bg-white/60 px-1 rounded">{`{{email}}`}</code> for dynamic values.</InfoBanner>
      <PageBody>
        <Card title="Settings">
          <Field label="Enabled"><Toggle value={data.enabled} onChange={set("enabled")} label="Auto-reply is sent on every form submission" /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="From Name"><Input value={data.fromName} onChange={set("fromName")} /></Field>
            <Field label="From Email"><Input value={data.fromEmail} onChange={set("fromEmail")} type="email" /></Field>
            <Field label="Reply-To Email"><Input value={data.replyTo} onChange={set("replyTo")} type="email" /></Field>
            <Field label="Subject Line"><Input value={data.subject} onChange={set("subject")} /></Field>
          </div>
        </Card>
        <Card title="Body (HTML)">
          <Field label="Email HTML"><Textarea value={data.bodyHtml} onChange={set("bodyHtml")} rows={16} mono /></Field>
          <Field label="Signature Image URL" hint="Optional brand sign-off"><Input value={data.signatureImageUrl} onChange={set("signatureImageUrl")} mono /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
