// Global → Phone & Email (Contact Info)
import { FiPhone } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  primaryPhone: "+91 9608553167",
  secondaryPhone: "",
  primaryEmail: "kravionatech@gmail.com",
  secondaryEmail: "hello@kraviona.com",
  supportEmail: "support@kraviona.com",
  whatsappNumber: "+91 9608553167",
  whatsappLink: "https://wa.me/919608553167",
  showWhatsappButton: true,
  additionalContacts: [
    { label: "Sales",      type: "email", value: "sales@kraviona.com" },
    { label: "Press",      type: "email", value: "press@kraviona.com" },
    { label: "Careers",    type: "email", value: "careers@kraviona.com" },
  ],
};

export default function GlobalContactInfo() {
  const { data, dirty, saving, saved, set, save, setAll } = useSiteConfigForm(INITIAL, { section: "contactInfo" });
  const upd = (i, k, v) => { const a = [...data.additionalContacts]; a[i] = { ...a[i], [k]: v }; setAll({ ...data, additionalContacts: a }); };
  const add = () => setAll({ ...data, additionalContacts: [...data.additionalContacts, { label: "", type: "email", value: "" }] });
  const rem = (i) => setAll({ ...data, additionalContacts: data.additionalContacts.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Global", "Phone & Email"]} title="Global: Phone & Email" icon={FiPhone}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiPhone}>Site-wide contact details — used in footer, contact page, and structured-data schema.</InfoBanner>
      <PageBody>
        <Card title="Primary Phones">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Primary Phone"><Input value={data.primaryPhone} onChange={set("primaryPhone")} /></Field>
            <Field label="Secondary Phone"><Input value={data.secondaryPhone} onChange={set("secondaryPhone")} /></Field>
          </div>
        </Card>
        <Card title="Email Addresses">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Primary Email"><Input value={data.primaryEmail} onChange={set("primaryEmail")} type="email" /></Field>
            <Field label="Secondary Email"><Input value={data.secondaryEmail} onChange={set("secondaryEmail")} type="email" /></Field>
            <Field label="Support Email"><Input value={data.supportEmail} onChange={set("supportEmail")} type="email" /></Field>
          </div>
        </Card>
        <Card title="WhatsApp">
          <Field label="Show WhatsApp Button"><Toggle value={data.showWhatsappButton} onChange={set("showWhatsappButton")} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Number"><Input value={data.whatsappNumber} onChange={set("whatsappNumber")} /></Field>
            <Field label="WhatsApp Link"><Input value={data.whatsappLink} onChange={set("whatsappLink")} mono /></Field>
          </div>
        </Card>

        <Card title="Department Contacts">
          <div className="space-y-2">
            {data.additionalContacts.map((c, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-3">
                <div className="col-span-3"><Input value={c.label} onChange={(v) => upd(i, "label", v)} placeholder="Label" /></div>
                <div className="col-span-2">
                  <select value={c.type} onChange={(e) => upd(i, "type", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                    <option value="email">Email</option><option value="phone">Phone</option>
                  </select>
                </div>
                <div className="col-span-6"><Input value={c.value} onChange={(v) => upd(i, "value", v)} placeholder="value" mono /></div>
                <div className="col-span-1 text-right"><DeleteIconBtn onClick={() => rem(i)} /></div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={add} label="Add Contact" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
