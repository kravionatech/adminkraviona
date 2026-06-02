// Global → Main Navigation
import { FiSliders, FiMenu, FiPlus } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  showCtaButton: true,
  ctaText: "Get a Quote",
  ctaLink: "/contact",
  stickyHeader: true,
  showSearchIcon: false,
  links: [
    { label: "Home",      href: "/",          isVisible: true, hasDropdown: false },
    { label: "Services",  href: "/services",  isVisible: true, hasDropdown: true  },
    { label: "About",     href: "/about",     isVisible: true, hasDropdown: false },
    { label: "Gallery",   href: "/gallery",   isVisible: true, hasDropdown: false },
    { label: "Blog",      href: "/blog",      isVisible: true, hasDropdown: false },
    { label: "Case Studies", href: "/case-studies", isVisible: false, hasDropdown: false },
    { label: "Pricing",   href: "/pricing",   isVisible: false, hasDropdown: false },
    { label: "Contact",   href: "/contact",   isVisible: true, hasDropdown: false },
  ],
};

export default function GlobalNav() {
  const { data, dirty, saving, saved, set, save, setAll } = useSiteConfigForm(INITIAL, { section: "nav" });
  const upd = (i, k, v) => { const l = [...data.links]; l[i] = { ...l[i], [k]: v }; setAll({ ...data, links: l }); };
  const add = () => setAll({ ...data, links: [...data.links, { label: "", href: "", isVisible: true, hasDropdown: false }] });
  const rem = (i) => setAll({ ...data, links: data.links.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Global", "Navigation"]} title="Global: Navigation Setup" icon={FiSliders}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiSliders}>Main top-bar nav. Drag rows to reorder (coming soon). Hide items without deleting.</InfoBanner>
      <PageBody>
        <Card title="Header Options">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Sticky Header"><Toggle value={data.stickyHeader} onChange={set("stickyHeader")} /></Field>
            <Field label="Show Search Icon"><Toggle value={data.showSearchIcon} onChange={set("showSearchIcon")} /></Field>
          </div>
        </Card>
        <Card title="CTA Button">
          <Field label="Show CTA Button"><Toggle value={data.showCtaButton} onChange={set("showCtaButton")} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Text"><Input value={data.ctaText} onChange={set("ctaText")} /></Field>
            <Field label="Link"><Input value={data.ctaLink} onChange={set("ctaLink")} /></Field>
          </div>
        </Card>

        <Card title="Nav Links" subtitle={`${data.links.filter(l => l.isVisible).length} visible · ${data.links.length} total`}>
          <div className="space-y-2">
            {data.links.map((lnk, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-3">
                <div className="col-span-1 text-center text-gray-300"><FiMenu size={14} className="cursor-move inline" /></div>
                <div className="col-span-3"><Input value={lnk.label} onChange={(v) => upd(i, "label", v)} placeholder="Label" /></div>
                <div className="col-span-4"><Input value={lnk.href} onChange={(v) => upd(i, "href", v)} placeholder="/path" mono /></div>
                <div className="col-span-2"><Toggle value={lnk.hasDropdown} onChange={(v) => upd(i, "hasDropdown", v)} label="dropdown" /></div>
                <div className="col-span-1"><Toggle value={lnk.isVisible} onChange={(v) => upd(i, "isVisible", v)} /></div>
                <div className="col-span-1 text-right"><DeleteIconBtn onClick={() => rem(i)} /></div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={add} label="Add Link" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
