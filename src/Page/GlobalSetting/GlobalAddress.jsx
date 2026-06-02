// Global → Office Address
import { FiMap } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  primary: {
    name: "Kraviona Tech Solutions HQ",
    addressLine1: "B-Block, Vivek Vihar",
    addressLine2: "",
    city: "East Delhi",
    state: "Delhi",
    postcode: "110092",
    country: "India",
    timezone: "Asia/Kolkata (UTC+05:30)",
  },
  showInFooter: true,
  showOnContactPage: true,
  additionalOffices: [
    { city: "Remote — Bengaluru",   description: "Engineering team distributed across India",     timezone: "Asia/Kolkata" },
  ],
};

export default function GlobalAddress() {
  const { data, dirty, saving, saved, set, save, setAll } = useSiteConfigForm(INITIAL, { section: "address" });
  const updPri = (k, v) => setAll({ ...data, primary: { ...data.primary, [k]: v } });
  const upd = (i, k, v) => { const a = [...data.additionalOffices]; a[i] = { ...a[i], [k]: v }; setAll({ ...data, additionalOffices: a }); };
  const add = () => setAll({ ...data, additionalOffices: [...data.additionalOffices, { city: "", description: "", timezone: "" }] });
  const rem = (i) => setAll({ ...data, additionalOffices: data.additionalOffices.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Global", "Address"]} title="Global: Office Address" icon={FiMap}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMap}>Primary headquarters + any satellite offices.</InfoBanner>
      <PageBody>
        <Card title="Headquarters">
          <Field label="Office Name"><Input value={data.primary.name} onChange={(v) => updPri("name", v)} /></Field>
          <Field label="Address Line 1"><Input value={data.primary.addressLine1} onChange={(v) => updPri("addressLine1", v)} /></Field>
          <Field label="Address Line 2"><Input value={data.primary.addressLine2} onChange={(v) => updPri("addressLine2", v)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City"><Input value={data.primary.city} onChange={(v) => updPri("city", v)} /></Field>
            <Field label="State"><Input value={data.primary.state} onChange={(v) => updPri("state", v)} /></Field>
            <Field label="Postcode"><Input value={data.primary.postcode} onChange={(v) => updPri("postcode", v)} /></Field>
            <Field label="Country"><Input value={data.primary.country} onChange={(v) => updPri("country", v)} /></Field>
          </div>
          <Field label="Timezone"><Input value={data.primary.timezone} onChange={(v) => updPri("timezone", v)} /></Field>
        </Card>

        <Card title="Display Options">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Show in Footer"><Toggle value={data.showInFooter} onChange={set("showInFooter")} /></Field>
            <Field label="Show on Contact Page"><Toggle value={data.showOnContactPage} onChange={set("showOnContactPage")} /></Field>
          </div>
        </Card>

        <Card title="Additional Offices">
          <div className="space-y-2">
            {data.additionalOffices.map((o, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start bg-gray-50 rounded-xl p-3">
                <div className="col-span-3"><Input value={o.city} onChange={(v) => upd(i, "city", v)} placeholder="City" /></div>
                <div className="col-span-5"><Input value={o.description} onChange={(v) => upd(i, "description", v)} placeholder="Description" /></div>
                <div className="col-span-3"><Input value={o.timezone} onChange={(v) => upd(i, "timezone", v)} placeholder="Timezone" /></div>
                <div className="col-span-1 text-right pt-2"><DeleteIconBtn onClick={() => rem(i)} /></div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={add} label="Add Office" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
