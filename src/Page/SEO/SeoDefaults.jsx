// SEO → Default Meta Tags
import { FiSearch } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  siteName: "Kraviona Tech Solutions",
  titleTemplate: "%s | Kraviona",
  defaultTitle: "Kraviona Tech Solutions — MERN Stack & Technical SEO",
  defaultDescription: "Expert MERN Stack development & Technical SEO services. We build scalable web applications and drive organic growth for ambitious businesses.",
  defaultKeywords: "MERN stack, Technical SEO, React.js, Node.js, MongoDB, web development, India",
  author: "Kraviona Tech Solutions",
  language: "en-IN",
  robots: "index, follow, max-image-preview:large",
  themeColor: "#235056",
  twitterHandle: "@kraviona",
  facebookAppId: "",
  twitterCard: "summary_large_image",
  ogType: "website",
  ogLocale: "en_IN",
  enableAutomaticOgImage: true,
};

export default function SeoDefaults() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "seoDefaults" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "SEO", "Defaults"]} title="SEO: Default Meta Tags" icon={FiSearch}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiSearch}>Fallback meta tags used when a page doesn't override them. Pages can override via their own SEO section.</InfoBanner>
      <PageBody>
        <Card title="Site Identity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Site Name"><Input value={data.siteName} onChange={set("siteName")} /></Field>
            <Field label="Title Template" hint="Use %s for the page title"><Input value={data.titleTemplate} onChange={set("titleTemplate")} mono /></Field>
          </div>
          <Field label="Default Page Title"><Input value={data.defaultTitle} onChange={set("defaultTitle")} /></Field>
          <Field label="Default Meta Description" hint="Max 155-160 characters"><Textarea value={data.defaultDescription} onChange={set("defaultDescription")} rows={2} /></Field>
          <Field label="Default Keywords" hint="Comma-separated (less impactful in 2026 but still indexed)"><Input value={data.defaultKeywords} onChange={set("defaultKeywords")} /></Field>
        </Card>

        <Card title="Locale & Author">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Author"><Input value={data.author} onChange={set("author")} /></Field>
            <Field label="Language"><Input value={data.language} onChange={set("language")} mono /></Field>
            <Field label="OG Locale"><Input value={data.ogLocale} onChange={set("ogLocale")} mono /></Field>
            <Field label="OG Type"><Input value={data.ogType} onChange={set("ogType")} mono /></Field>
          </div>
        </Card>

        <Card title="Crawl Behaviour">
          <Field label="Robots Directive" hint='e.g. "index, follow"'><Input value={data.robots} onChange={set("robots")} mono /></Field>
          <Field label="Theme Color" hint="Used by mobile browsers for the address bar">
            <div className="flex gap-2">
              <input type="color" value={data.themeColor} onChange={(e) => set("themeColor")(e.target.value)} className="w-12 h-10 rounded-lg" />
              <Input value={data.themeColor} onChange={set("themeColor")} mono />
            </div>
          </Field>
        </Card>

        <Card title="Social Sharing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Twitter Handle"><Input value={data.twitterHandle} onChange={set("twitterHandle")} mono /></Field>
            <Field label="Facebook App ID"><Input value={data.facebookAppId} onChange={set("facebookAppId")} mono /></Field>
            <Field label="Twitter Card Type">
              <select value={data.twitterCard} onChange={(e) => set("twitterCard")(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                <option value="summary">summary</option>
                <option value="summary_large_image">summary_large_image</option>
                <option value="app">app</option>
                <option value="player">player</option>
              </select>
            </Field>
          </div>
          <Field label="Auto-Generate OG Images Per Page"><Toggle value={data.enableAutomaticOgImage} onChange={set("enableAutomaticOgImage")} /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
