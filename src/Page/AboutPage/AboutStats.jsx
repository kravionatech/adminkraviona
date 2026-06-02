// About Page → Stats
import { FiBarChart2 } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  sectionTitle: "By the Numbers",
  sectionSubtitle: "Some milestones from our journey so far.",
  stats: [
    { value: "50+",  label: "Projects Delivered" },
    { value: "99%",  label: "Client Retention" },
    { value: "05+",  label: "Years in Business" },
    { value: "24/7", label: "Post-Launch Support" },
  ],
};

export default function AboutStats() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "aboutStats" });
  const upd = (i, k, v) => { const s = [...data.stats]; s[i] = { ...s[i], [k]: v }; setAll({ ...data, stats: s }); };
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "About Page", "Stats"]} title="About: Stats" icon={FiBarChart2}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiBarChart2}>4 stat tiles on the About page. Different values from the homepage stats — adjust independently.</InfoBanner>
      <PageBody>
        <Card title="Heading">
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <Field label="Subtitle"><Input value={data.sectionSubtitle} onChange={set("sectionSubtitle")} /></Field>
        </Card>
        <Card title="Stat Tiles">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.stats.map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
                <Field label="Value"><Input value={s.value} onChange={(v) => upd(i, "value", v)} /></Field>
                <Field label="Label"><Input value={s.label} onChange={(v) => upd(i, "label", v)} /></Field>
              </div>
            ))}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
