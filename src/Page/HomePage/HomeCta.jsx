// Home Page → CTA / Consultation banner
import { FiZap } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  badge: "Free 30-min strategy call",
  title: "Ready to engineer your next breakthrough?",
  subtitle: "Book a free no-strings consultation. We will sketch the architecture, scope the milestones, and quote the build.",
  ctaPrimary: { text: "Book a Call",    link: "/contact" },
  ctaSecondary: { text: "View Pricing", link: "/pricing" },
  backgroundColor: "#235056",
  textColor: "#FFFFFF",
};

export default function HomeCta() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "homeCta" });
  const updCta = (key, k) => (v) => setAll({ ...data, [key]: { ...data[key], [k]: v } });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "CTA Section"]} title="Home: CTA / Consultation" icon={FiZap}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiZap}>Bottom-of-page conversion banner pushing visitors toward a consultation call.</InfoBanner>
      <PageBody>
        <Card title="Content">
          <Field label="Top Badge" hint="Small chip above the title"><Input value={data.badge} onChange={set("badge")} /></Field>
          <Field label="Title" required><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle} onChange={set("subtitle")} rows={3} /></Field>
        </Card>

        <Card title="Buttons">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Primary CTA — Text"><Input value={data.ctaPrimary.text} onChange={updCta("ctaPrimary", "text")} /></Field>
            <Field label="Primary CTA — Link"><Input value={data.ctaPrimary.link} onChange={updCta("ctaPrimary", "link")} /></Field>
            <Field label="Secondary CTA — Text"><Input value={data.ctaSecondary.text} onChange={updCta("ctaSecondary", "text")} /></Field>
            <Field label="Secondary CTA — Link"><Input value={data.ctaSecondary.link} onChange={updCta("ctaSecondary", "link")} /></Field>
          </div>
        </Card>

        <Card title="Styling">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Background Color">
              <div className="flex gap-2">
                <input type="color" value={data.backgroundColor} onChange={(e) => set("backgroundColor")(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer" />
                <Input value={data.backgroundColor} onChange={set("backgroundColor")} mono />
              </div>
            </Field>
            <Field label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={data.textColor} onChange={(e) => set("textColor")(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer" />
                <Input value={data.textColor} onChange={set("textColor")} mono />
              </div>
            </Field>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
