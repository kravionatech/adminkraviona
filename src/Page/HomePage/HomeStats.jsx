// Home Page → Stats Bar editor
import { FiBarChart2 } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const STATS = [
  { val: "projectsDelivered", lbl: "projectsLabel" },
  { val: "clientRetention",   lbl: "retentionLabel" },
  { val: "yearsExperience",   lbl: "experienceLabel" },
  { val: "support",           lbl: "supportLabel" },
];

const INITIAL = {
  projectsDelivered: "150+",
  clientRetention: "99%",
  yearsExperience: "5+",
  support: "24/7",
  projectsLabel: "Projects Delivered",
  retentionLabel: "Client Retention Rate",
  experienceLabel: "Years of Experience",
  supportLabel: "Post-Launch Support",
  showOnHome: true,
};

export default function HomeStats() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "stats" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "Stats Bar"]} title="Home: Stats Bar" icon={FiBarChart2}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiBarChart2}>4-cell stats strip shown directly under the hero on the homepage.</InfoBanner>
      <PageBody>
        <Card title="Stat Cells" subtitle="Edit values and labels for each cell">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STATS.map(({ val, lbl }, i) => (
              <div key={val} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Cell {i + 1}</div>
                <Field label="Value"><Input value={data[val]} onChange={set(val)} /></Field>
                <Field label="Label"><Input value={data[lbl]} onChange={set(lbl)} /></Field>
              </div>
            ))}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
