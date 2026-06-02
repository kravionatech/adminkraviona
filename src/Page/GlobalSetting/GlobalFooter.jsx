// Global → Footer Config
import { FiLayout, FiPlus } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  logoText: "KRAVIONA",
  logoImageUrl: "/logo.avif",
  description: "Building scalable MERN Stack applications and driving organic growth through Technical SEO.",
  copyrightText: "© 2026 Kraviona Tech Solutions. All rights reserved.",
  showNewsletterBlock: true,
  showSocialIcons: true,
  backgroundColor: "#235056",
  textColor: "#FFFFFF",
  columns: [
    {
      title: "Capabilities",
      links: [
        { label: "MERN Stack Development", href: "/services/mern-stack-development" },
        { label: "Technical SEO",          href: "/services/technical-seo" },
        { label: "Web Performance",        href: "/services/web-performance-optimization" },
        { label: "AI Automation",          href: "/services/ai-automation" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us",       href: "/about" },
        { label: "Case Studies",   href: "/case-studies" },
        { label: "Blog",           href: "/blog" },
        { label: "Contact",        href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Refund Policy",  href: "/refund" },
        { label: "Cookies",        href: "/cookies" },
      ],
    },
  ],
};

export default function GlobalFooter() {
  const { data, dirty, saving, saved, set, save, setAll } = useSiteConfigForm(INITIAL, { section: "footer" });
  const updCol = (i, k, v) => { const c = [...data.columns]; c[i] = { ...c[i], [k]: v }; setAll({ ...data, columns: c }); };
  const updLink = (ci, li, k, v) => {
    const cols = [...data.columns];
    const links = [...cols[ci].links]; links[li] = { ...links[li], [k]: v };
    cols[ci] = { ...cols[ci], links }; setAll({ ...data, columns: cols });
  };
  const addLink = (ci) => {
    const cols = [...data.columns];
    cols[ci] = { ...cols[ci], links: [...cols[ci].links, { label: "", href: "" }] };
    setAll({ ...data, columns: cols });
  };
  const remLink = (ci, li) => {
    const cols = [...data.columns];
    cols[ci] = { ...cols[ci], links: cols[ci].links.filter((_, idx) => idx !== li) };
    setAll({ ...data, columns: cols });
  };
  const addCol = () => setAll({ ...data, columns: [...data.columns, { title: "New Column", links: [] }] });
  const remCol = (i) => setAll({ ...data, columns: data.columns.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Global", "Footer"]} title="Global: Footer Setup" icon={FiLayout}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiLayout}>Site-wide footer columns, copyright, brand info.</InfoBanner>
      <PageBody>
        <Card title="Brand & Description">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Logo Text"><Input value={data.logoText} onChange={set("logoText")} /></Field>
            <Field label="Logo Image URL"><Input value={data.logoImageUrl} onChange={set("logoImageUrl")} mono /></Field>
          </div>
          <Field label="Footer Description"><Textarea value={data.description} onChange={set("description")} rows={2} /></Field>
          <Field label="Copyright Text"><Input value={data.copyrightText} onChange={set("copyrightText")} /></Field>
        </Card>

        <Card title="Display Toggles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Show Newsletter Block"><Toggle value={data.showNewsletterBlock} onChange={set("showNewsletterBlock")} /></Field>
            <Field label="Show Social Icons"><Toggle value={data.showSocialIcons} onChange={set("showSocialIcons")} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Background Color"><div className="flex gap-2"><input type="color" value={data.backgroundColor} onChange={(e) => set("backgroundColor")(e.target.value)} className="w-12 h-10 rounded-lg" /><Input value={data.backgroundColor} onChange={set("backgroundColor")} mono /></div></Field>
            <Field label="Text Color"><div className="flex gap-2"><input type="color" value={data.textColor} onChange={(e) => set("textColor")(e.target.value)} className="w-12 h-10 rounded-lg" /><Input value={data.textColor} onChange={set("textColor")} mono /></div></Field>
          </div>
        </Card>

        <Card title="Footer Columns" subtitle={`${data.columns.length} columns`}>
          <div className="space-y-4">
            {data.columns.map((col, ci) => (
              <div key={ci} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <Input value={col.title} onChange={(v) => updCol(ci, "title", v)} placeholder="Column title" />
                  <button onClick={() => remCol(ci)} className="ml-3 text-xs text-red-500 hover:underline whitespace-nowrap">Remove Column</button>
                </div>
                <div className="space-y-2">
                  {col.links.map((lnk, li) => (
                    <div key={li} className="flex gap-2 items-center">
                      <Input value={lnk.label} onChange={(v) => updLink(ci, li, "label", v)} placeholder="Label" />
                      <Input value={lnk.href} onChange={(v) => updLink(ci, li, "href", v)} placeholder="/path or URL" mono />
                      <DeleteIconBtn onClick={() => remLink(ci, li)} />
                    </div>
                  ))}
                </div>
                <button onClick={() => addLink(ci)} className="mt-2 text-xs text-[#E8663D] font-bold hover:underline flex items-center gap-1">
                  <FiPlus size={11} /> Add Link
                </button>
              </div>
            ))}
          </div>
          <AddRowButton onClick={addCol} label="Add Column" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
