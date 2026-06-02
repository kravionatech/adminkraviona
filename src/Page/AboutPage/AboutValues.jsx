// About Page → Core Values
import { FiAward } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  sectionTitle: "Our Core Values",
  sectionSubtitle: "Non-negotiables we hold every team member to.",
  values: [
    { icon: "🏆", title: "Uncompromising Quality",  description: "We refuse to ship bad code. Code is reviewed, tested, and battle-hardened before release." },
    { icon: "🔍", title: "Absolute Transparency",   description: "No hidden fees, no tech jargon. You see the repo, the burndown, and the invoice." },
    { icon: "🚀", title: "Continuous Innovation",   description: "The tech world moves fast — we stay curious, ship often, and keep learning." },
  ],
};

export default function AboutValues() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "aboutValues" });
  const upd = (i, k, v) => { const vs = [...data.values]; vs[i] = { ...vs[i], [k]: v }; setAll({ ...data, values: vs }); };
  const add = () => setAll({ ...data, values: [...data.values, { icon: "✨", title: "", description: "" }] });
  const rem = (i) => setAll({ ...data, values: data.values.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "About Page", "Core Values"]} title="About: Core Values" icon={FiAward}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiAward}>3 (or more) values cards. Icon is emoji or short text.</InfoBanner>
      <PageBody>
        <Card title="Heading">
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <Field label="Subtitle"><Input value={data.sectionSubtitle} onChange={set("sectionSubtitle")} /></Field>
        </Card>
        <Card title="Values" subtitle={`${data.values.length} cards`}>
          <div className="space-y-3">
            {data.values.map((v, i) => (
              <div key={i} className="flex gap-3 bg-gray-50 rounded-xl p-4">
                <div className="w-14"><Field label="Icon"><Input value={v.icon} onChange={(val) => upd(i, "icon", val)} /></Field></div>
                <div className="flex-1 space-y-2">
                  <Field label="Title"><Input value={v.title} onChange={(val) => upd(i, "title", val)} /></Field>
                  <Field label="Description"><Textarea rows={2} value={v.description} onChange={(val) => upd(i, "description", val)} /></Field>
                </div>
                <div className="pt-6"><DeleteIconBtn onClick={() => rem(i)} /></div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={add} label="Add Value" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
