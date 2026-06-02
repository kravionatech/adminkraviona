// Contact Page → Form Config (similar to ServicesContactForm but for /contact)
import { FiFileText } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, Select, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  formTitle: "Send us a message",
  formSubtitle: "Use the form below or pick any of the contact methods on the right.",
  submitText: "Send Message",
  successMessage: "✅ Got it! We'll reply within 4 business hours.",
  errorMessage: "Couldn't send right now. Try again or email us directly.",
  notificationEmail: "kravionatech@gmail.com",
  saveAsLead: true,
  fields: [
    { name: "name",    label: "Full Name",    type: "text",     required: true,  contactFormConfig: "Jane Doe" },
    { name: "email",   label: "Email",        type: "email",    required: true,  contactFormConfig: "you@company.com" },
    { name: "subject", label: "Subject",      type: "text",     required: false, contactFormConfig: "What's this about?" },
    { name: "message", label: "Your Message", type: "textarea", required: true,  contactFormConfig: "Tell us a bit about it…" },
  ],
};

export default function ContactFormConfig() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "contactFormConfig" });
  const upd = (i, k, v) => { const fs = [...data.fields]; fs[i] = { ...fs[i], [k]: v }; setAll({ ...data, fields: fs }); };
  const add = () => setAll({ ...data, fields: [...data.fields, { name: "", label: "", type: "text", required: false, contactFormConfig: "" }] });
  const rem = (i) => setAll({ ...data, fields: data.fields.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Contact Page", "Form"]} title="Contact: Form Config" icon={FiFileText}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiFileText}>The main /contact form. Saves to ContactSubmission + (optional) Lead, fires admin + auto-reply emails.</InfoBanner>
      <PageBody>
        <Card title="Heading">
          <Field label="Form Title"><Input value={data.formTitle} onChange={set("formTitle")} /></Field>
          <Field label="Subtitle"><Textarea value={data.formSubtitle} onChange={set("formSubtitle")} rows={2} /></Field>
          <Field label="Submit Button Text"><Input value={data.submitText} onChange={set("submitText")} /></Field>
        </Card>
        <Card title="Messages">
          <Field label="Success Message"><Input value={data.successMessage} onChange={set("successMessage")} /></Field>
          <Field label="Error Message"><Input value={data.errorMessage} onChange={set("errorMessage")} /></Field>
        </Card>
        <Card title="Routing">
          <Field label="Admin Notification Email"><Input value={data.notificationEmail} onChange={set("notificationEmail")} type="email" /></Field>
          <Field label="Also Create CRM Lead"><Toggle value={data.saveAsLead} onChange={set("saveAsLead")} label="Pipe submissions into /dashboard/leads" /></Field>
        </Card>

        <Card title="Form Fields" subtitle={`${data.fields.length} fields`}>
          <div className="space-y-2">
            {data.fields.map((f, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-3">
                <div className="col-span-3"><Input value={f.label} onChange={(v) => upd(i, "label", v)} contactFormConfig="Label" /></div>
                <div className="col-span-2"><Input value={f.name} onChange={(v) => upd(i, "name", v)} contactFormConfig="field_name" mono /></div>
                <div className="col-span-2"><Select value={f.type} onChange={(v) => upd(i, "type", v)} options={[
                  { value: "text", label: "Text" }, { value: "email", label: "Email" }, { value: "tel", label: "Phone" },
                  { value: "textarea", label: "Textarea" }, { value: "select", label: "Select" },
                ]} /></div>
                <div className="col-span-3"><Input value={f.contactFormConfig} onChange={(v) => upd(i, "contactFormConfig", v)} contactFormConfig="contactFormConfig" /></div>
                <div className="col-span-1"><Toggle value={f.required} onChange={(v) => upd(i, "required", v)} /></div>
                <div className="col-span-1 text-right"><DeleteIconBtn onClick={() => rem(i)} /></div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={add} label="Add Field" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
