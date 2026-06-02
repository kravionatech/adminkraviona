// Services Page → Contact Form configuration
import { FiPhone } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, Select, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  formTitle: "Let's build something great together",
  formSubtitle: "Tell us about your project — we usually reply within 4 hours during business days.",
  submitText: "Send Message",
  successMessage: "✅ Thanks — your message is in. We'll be in touch shortly.",
  errorMessage: "Something went wrong. Please try again or email us directly.",
  notificationEmail: "kravionatech@gmail.com",
  autoReplyEnabled: true,
  fields: [
    { name: "fullName", label: "Your Name",     type: "text",     required: true,  servicesContactForm: "Jane Doe" },
    { name: "email",    label: "Email",         type: "email",    required: true,  servicesContactForm: "you@company.com" },
    { name: "phone",    label: "Phone",         type: "tel",      required: false, servicesContactForm: "+91 9XXXXXXXXX" },
    { name: "company",  label: "Company",       type: "text",     required: false, servicesContactForm: "Your Company" },
    { name: "service",  label: "Service Interested In", type: "select", required: true,  servicesContactForm: "Select a service…" },
    { name: "budget",   label: "Budget Range",  type: "select",   required: false, servicesContactForm: "$5k – $50k+" },
    { name: "message",  label: "Project Details", type: "textarea", required: true, servicesContactForm: "Briefly describe your project…" },
  ],
};

export default function ServicesContactForm() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "servicesContactForm" });
  const updField = (i, k, v) => { const fs = [...data.fields]; fs[i] = { ...fs[i], [k]: v }; setAll({ ...data, fields: fs }); };
  const add = () => setAll({ ...data, fields: [...data.fields, { name: "", label: "", type: "text", required: false, servicesContactForm: "" }] });
  const rem = (i) => setAll({ ...data, fields: data.fields.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Services Page", "Contact Form"]} title="Services Page Contact Form" icon={FiPhone}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiPhone}>Submissions hit <code className="bg-white/60 px-1 rounded">/api/v1/public/contact</code> → ContactSubmission + Lead records, email to admin + auto-reply to submitter.</InfoBanner>
      <PageBody>
        <Card title="Heading & Copy">
          <Field label="Form Title"><Input value={data.formTitle} onChange={set("formTitle")} /></Field>
          <Field label="Form Subtitle"><Textarea value={data.formSubtitle} onChange={set("formSubtitle")} rows={2} /></Field>
          <Field label="Submit Button Text"><Input value={data.submitText} onChange={set("submitText")} /></Field>
        </Card>
        <Card title="Response Messages">
          <Field label="Success Message"><Input value={data.successMessage} onChange={set("successMessage")} /></Field>
          <Field label="Error Message"><Input value={data.errorMessage} onChange={set("errorMessage")} /></Field>
        </Card>
        <Card title="Notifications">
          <Field label="Admin Notification Email"><Input value={data.notificationEmail} onChange={set("notificationEmail")} type="email" /></Field>
          <Field label="Send Auto-Reply"><Toggle value={data.autoReplyEnabled} onChange={set("autoReplyEnabled")} label="A confirmation goes to whoever submits" /></Field>
        </Card>

        <Card title="Form Fields" subtitle={`${data.fields.length} fields`}>
          <div className="space-y-2">
            {data.fields.map((f, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-3">
                <div className="col-span-3"><Input value={f.label} onChange={(v) => updField(i, "label", v)} servicesContactForm="Label" /></div>
                <div className="col-span-2"><Input value={f.name} onChange={(v) => updField(i, "name", v)} servicesContactForm="field_name" mono /></div>
                <div className="col-span-2">
                  <Select value={f.type} onChange={(v) => updField(i, "type", v)} options={[
                    { value: "text", label: "Text" }, { value: "email", label: "Email" }, { value: "tel", label: "Phone" },
                    { value: "textarea", label: "Textarea" }, { value: "select", label: "Select" }, { value: "checkbox", label: "Checkbox" },
                  ]} />
                </div>
                <div className="col-span-3"><Input value={f.servicesContactForm} onChange={(v) => updField(i, "servicesContactForm", v)} servicesContactForm="servicesContactForm" /></div>
                <div className="col-span-1"><Toggle value={f.required} onChange={(v) => updField(i, "required", v)} /></div>
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
