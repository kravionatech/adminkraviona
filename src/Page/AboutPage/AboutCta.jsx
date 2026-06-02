// About Page → CTA Section
import { FiZap } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  title: "Let's build something brilliant together.",
  subtitle: "Tell us about the problem you're solving — we'll tell you how we'd ship it.",
  ctaPrimary: { text: "Start the Conversation", link: "/contact" },
  ctaSecondary: { text: "See Our Work",         link: "/gallery" },
  bgColor: "#235056",
  textColor: "#FFFFFF",
};

export default function AboutCta() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "aboutCta" });
  const updCta = (key, k) => (v) => setAll({ ...data, [key]: { ...data[key], [k]: v } });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "About Page", "CTA"]} title="About: CTA Section" icon={FiZap}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiZap}>Bottom banner pushing About visitors to a consultation call.</InfoBanner>
      <PageBody>
        <Card title="Content">
          <Field label="Title" required><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle} onChange={set("subtitle")} rows={2} /></Field>
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
            <Field label="Background"><div className="flex gap-2"><input type="color" value={data.bgColor} onChange={(e) => set("bgColor")(e.target.value)} className="w-12 h-10 rounded-lg" /><Input value={data.bgColor} onChange={set("bgColor")} mono /></div></Field>
            <Field label="Text Color"><div className="flex gap-2"><input type="color" value={data.textColor} onChange={(e) => set("textColor")(e.target.value)} className="w-12 h-10 rounded-lg" /><Input value={data.textColor} onChange={set("textColor")} mono /></div></Field>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
