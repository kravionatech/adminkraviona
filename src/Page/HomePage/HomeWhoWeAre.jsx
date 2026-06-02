// Home Page → Who We Are
import { FiInfo } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  title: "Who We Are",
  description:
    "We are a passionate team of engineers and strategists who believe in building software that makes a real difference. From startups to enterprises, we have helped 150+ clients achieve their digital goals.",
  ctaText: "About Us",
  ctaLink: "/about",
  highlight1: "150+",
  highlight1Label: "Projects",
  highlight2: "99%",
  highlight2Label: "Retention",
  highlight3: "5+",
  highlight3Label: "Years",
  highlight4: "24/7",
  highlight4Label: "Support",
};

export default function HomeWhoWeAre() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "whoWeAre" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "Who We Are"]} title="Home: Who We Are Section" icon={FiInfo}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiInfo}>A short intro paragraph with 4 highlight stats and a CTA button.</InfoBanner>
      <PageBody>
        <Card title="Section Content">
          <Field label="Title" required><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Description" hint="Supports rich HTML"><Textarea value={data.description} onChange={set("description")} rows={5} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTA Text"><Input value={data.ctaText} onChange={set("ctaText")} /></Field>
            <Field label="CTA Link"><Input value={data.ctaLink} onChange={set("ctaLink")} /></Field>
          </div>
        </Card>

        <Card title="Highlight Stats" subtitle="4 quick numbers shown alongside text">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-50 rounded-xl p-4 space-y-2">
                <Field label={`Stat ${n} Value`}><Input value={data[`highlight${n}`]} onChange={set(`highlight${n}`)} /></Field>
                <Field label={`Stat ${n} Label`}><Input value={data[`highlight${n}Label`]} onChange={set(`highlight${n}Label`)} /></Field>
              </div>
            ))}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
