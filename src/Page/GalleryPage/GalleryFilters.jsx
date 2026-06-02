// Gallery Page → Filter Categories
import { FiSliders } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  showFilters: true,
  showAllTab: true,
  allLabel: "All Projects",
  categories: [
    { slug: "web-app",      label: "Web Apps",       isVisible: true, color: "#3B82F6" },
    { slug: "mobile-app",   label: "Mobile Apps",    isVisible: true, color: "#8B5CF6" },
    { slug: "saas",         label: "SaaS",           isVisible: true, color: "#10B981" },
    { slug: "ecommerce",    label: "E-commerce",     isVisible: true, color: "#F59E0B" },
    { slug: "marketing",    label: "Marketing Site", isVisible: true, color: "#EC4899" },
    { slug: "internal",     label: "Internal Tools", isVisible: false, color: "#64748B" },
  ],
};

export default function GalleryFilters() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "galleryFilters" });
  const upd = (i, k, v) => { const cats = [...data.categories]; cats[i] = { ...cats[i], [k]: v }; setAll({ ...data, categories: cats }); };
  const add = () => setAll({ ...data, categories: [...data.categories, { slug: "", label: "", isVisible: true, color: "#235056" }] });
  const rem = (i) => setAll({ ...data, categories: data.categories.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Gallery Page", "Filters"]} title="Gallery: Filter Categories" icon={FiSliders}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiSliders}>Filter tabs at the top of the projects grid. Each tab matches Portfolio item's <code className="bg-white/60 px-1 rounded">projectType</code>.</InfoBanner>
      <PageBody>
        <Card title="Filter Bar Options">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Show Filter Bar"><Toggle value={data.showFilters} onChange={set("showFilters")} /></Field>
            <Field label="Show 'All' Tab"><Toggle value={data.showAllTab} onChange={set("showAllTab")} /></Field>
            <Field label="'All' Label"><Input value={data.allLabel} onChange={set("allLabel")} /></Field>
          </div>
        </Card>

        <Card title="Categories" subtitle={`${data.categories.filter(c => c.isVisible).length} visible`}>
          <div className="space-y-2">
            {data.categories.map((c, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-3">
                <div className="col-span-3"><Input value={c.label} onChange={(v) => upd(i, "label", v)} galleryFilters="Display Label" /></div>
                <div className="col-span-3"><Input value={c.slug} onChange={(v) => upd(i, "slug", v)} galleryFilters="slug" mono /></div>
                <div className="col-span-3 flex gap-2 items-center">
                  <input type="color" value={c.color} onChange={(e) => upd(i, "color", e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer" />
                  <Input value={c.color} onChange={(v) => upd(i, "color", v)} mono />
                </div>
                <div className="col-span-2"><Toggle value={c.isVisible} onChange={(v) => upd(i, "isVisible", v)} /></div>
                <div className="col-span-1 text-right"><DeleteIconBtn onClick={() => rem(i)} /></div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={add} label="Add Category" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
