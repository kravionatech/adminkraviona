// SEO → Default OG Image
import { FiImage, FiUpload } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  defaultOgImage: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Kraviona Tech Solutions — MERN Stack & Technical SEO",
  fallbackBackgroundColor: "#235056",
  fallbackTextColor: "#FFFFFF",
  enableDynamicOgImage: true,
  templateOgImage: "/og-template.png",
};

const PAGE_PREVIEW = [
  { page: "Homepage",      url: "/og-image.jpg",        size: "1200×630" },
  { page: "Services",      url: "/og-services.jpg",     size: "1200×630" },
  { page: "About",         url: "/og-about.jpg",        size: "1200×630" },
  { page: "Blog",          url: "/og-blog.jpg",         size: "1200×630" },
  { page: "Contact",       url: "/og-contact.jpg",      size: "1200×630" },
];

export default function SeoOgImage() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "defaultOgImage" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "SEO", "OG Image"]} title="SEO: Default OG Image" icon={FiImage}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiImage}>Image used when a page is shared on Facebook, LinkedIn, Twitter, Slack, etc.</InfoBanner>
      <PageBody>
        <Card title="Default OG Image">
          <Field label="Image URL" required><Input value={data.defaultOgImage} onChange={set("defaultOgImage")} mono /></Field>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Width"><Input type="number" value={data.width} onChange={set("width")} /></Field>
            <Field label="Height"><Input type="number" value={data.height} onChange={set("height")} /></Field>
            <Field label="Alt Text"><Input value={data.alt} onChange={set("alt")} /></Field>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-[#E8663D] hover:underline">
            <FiUpload size={14} /> Upload New Image
          </button>
        </Card>

        <Card title="Dynamic OG Image" subtitle="Auto-generate page-specific OG images on the fly">
          <Field label="Enable Dynamic OG Generation"><Toggle value={data.enableDynamicOgImage} onChange={set("enableDynamicOgImage")} /></Field>
          <Field label="Template Image URL" hint="Background image — text is overlayed at runtime"><Input value={data.templateOgImage} onChange={set("templateOgImage")} mono /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fallback Background"><div className="flex gap-2"><input type="color" value={data.fallbackBackgroundColor} onChange={(e) => set("fallbackBackgroundColor")(e.target.value)} className="w-12 h-10 rounded-lg" /><Input value={data.fallbackBackgroundColor} onChange={set("fallbackBackgroundColor")} mono /></div></Field>
            <Field label="Fallback Text Color"><div className="flex gap-2"><input type="color" value={data.fallbackTextColor} onChange={(e) => set("fallbackTextColor")(e.target.value)} className="w-12 h-10 rounded-lg" /><Input value={data.fallbackTextColor} onChange={set("fallbackTextColor")} mono /></div></Field>
          </div>
        </Card>

        <Card title="Per-Page Overrides" subtitle="Each page can override the default">
          <div className="bg-gray-50 rounded-xl divide-y divide-gray-200">
            {PAGE_PREVIEW.map((p) => (
              <div key={p.page} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <div className="text-sm font-bold text-gray-800">{p.page}</div>
                  <div className="text-[11px] text-gray-400 font-mono">{p.url} · {p.size}</div>
                </div>
                <button className="text-xs text-[#E8663D] font-semibold hover:underline">Override</button>
              </div>
            ))}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
