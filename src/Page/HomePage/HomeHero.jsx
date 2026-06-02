// Home Page → Hero Section editor
import { FiMonitor, FiPlus, FiTrash2 } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  badge1: "⚡ SEO Optimized",
  badge2: "🚀 MERN Stack Experts",
  badge3: "✅ Fast Delivery",
  headline: "MERN Stack Development & Technical SEO Solutions",
  subheadline: "We build scalable, high-performance web applications tailored for your business growth.",
  heroImage: "/hero-illustration.png",
  ctaPrimary: { text: "Start a Project", link: "/contact" },
  ctaSecondary: { text: "View Our Work", link: "/gallery" },
  phone: "+91 9608553167",
};

export default function HomeHero() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "hero" });
  const updCta = (key, k) => (v) => setAll({ ...data, [key]: { ...data[key], [k]: v } });

  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "Hero Section"]} title="Home: Hero Section" icon={FiMonitor}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMonitor}>Controls the top hero section on <code className="bg-white/60 px-1 rounded text-xs">kraviona.com</code> homepage.</InfoBanner>
      <PageBody>
        <Card title="Hero Badges" subtitle="3 pill-style badges shown above the headline">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Badge 1"><Input value={data.badge1} onChange={set("badge1")} /></Field>
            <Field label="Badge 2"><Input value={data.badge2} onChange={set("badge2")} /></Field>
            <Field label="Badge 3"><Input value={data.badge3} onChange={set("badge3")} /></Field>
          </div>
        </Card>

        <Card title="Headline & Description">
          <Field label="Main Headline" required><Input value={data.headline} onChange={set("headline")} /></Field>
          <Field label="Sub Headline" hint="Shown directly below the main headline">
            <Textarea value={data.subheadline} onChange={set("subheadline")} rows={3} />
          </Field>
          <Field label="Hero Illustration URL" hint="Optional supporting image">
            <Input value={data.heroImage} onChange={set("heroImage")} mono />
          </Field>
        </Card>

        <Card title="Call-to-Action Buttons">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Primary CTA — Text"><Input value={data.ctaPrimary.text} onChange={updCta("ctaPrimary", "text")} /></Field>
            <Field label="Primary CTA — Link"><Input value={data.ctaPrimary.link} onChange={updCta("ctaPrimary", "link")} /></Field>
            <Field label="Secondary CTA — Text"><Input value={data.ctaSecondary.text} onChange={updCta("ctaSecondary", "text")} /></Field>
            <Field label="Secondary CTA — Link"><Input value={data.ctaSecondary.link} onChange={updCta("ctaSecondary", "link")} /></Field>
          </div>
          <Field label="Hero Phone Number" hint="Click-to-call number shown on hero"><Input value={data.phone} onChange={set("phone")} /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
