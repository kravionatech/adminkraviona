// Blog Listing → Pagination & Layout
import { FiSliders } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, Select, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  postsPerPage: 9,
  layoutStyle: "grid",
  showAuthor: true,
  showDate: true,
  showCategory: true,
  showReadingTime: true,
  showShareButtons: true,
  enableInfiniteScroll: false,
  showSidebar: true,
  sidebarPosition: "right",
  sidebarWidgets: ["recent", "categories", "newsletter"],
};

export default function BlogPagination() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "blogPagination" });
  const widget = (key) => set("sidebarWidgets")(data.sidebarWidgets.includes(key) ? data.sidebarWidgets.filter(w => w !== key) : [...data.sidebarWidgets, key]);
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Blog Listing", "Pagination"]} title="Blog Listing: Layout & Pagination" icon={FiSliders}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiSliders}>Card layout, posts-per-page, and sidebar widgets for <code className="bg-white/60 px-1 rounded">/blog</code>.</InfoBanner>
      <PageBody>
        <Card title="Pagination">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Posts Per Page"><Input type="number" value={data.postsPerPage} onChange={set("postsPerPage")} /></Field>
            <Field label="Layout">
              <Select value={data.layoutStyle} onChange={set("layoutStyle")} options={[
                { value: "grid",    label: "Grid (3-column)" },
                { value: "list",    label: "List (1-column)" },
                { value: "masonry", label: "Masonry" },
              ]} />
            </Field>
          </div>
          <Field label="Use Infinite Scroll"><Toggle value={data.enableInfiniteScroll} onChange={set("enableInfiniteScroll")} label="Replaces page numbers with auto-load" /></Field>
        </Card>

        <Card title="Card Meta">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Field label="Show Author"><Toggle value={data.showAuthor} onChange={set("showAuthor")} /></Field>
            <Field label="Show Date"><Toggle value={data.showDate} onChange={set("showDate")} /></Field>
            <Field label="Show Category"><Toggle value={data.showCategory} onChange={set("showCategory")} /></Field>
            <Field label="Show Reading Time"><Toggle value={data.showReadingTime} onChange={set("showReadingTime")} /></Field>
            <Field label="Show Share Buttons"><Toggle value={data.showShareButtons} onChange={set("showShareButtons")} /></Field>
          </div>
        </Card>

        <Card title="Sidebar">
          <Field label="Show Sidebar"><Toggle value={data.showSidebar} onChange={set("showSidebar")} /></Field>
          <Field label="Position">
            <Select value={data.sidebarPosition} onChange={set("sidebarPosition")} options={[
              { value: "left",  label: "Left" }, { value: "right", label: "Right" },
            ]} />
          </Field>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Widgets</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { k: "recent",      l: "Recent Posts" },
                { k: "categories",  l: "Categories" },
                { k: "tags",        l: "Tag Cloud" },
                { k: "newsletter",  l: "Newsletter" },
                { k: "popular",     l: "Popular Posts" },
                { k: "archive",     l: "Monthly Archive" },
                { k: "authors",     l: "Authors" },
                { k: "ad",          l: "Ad Slot" },
              ].map(({ k, l }) => {
                const on = data.sidebarWidgets.includes(k);
                return (
                  <button key={k} onClick={() => widget(k)}
                    className={`text-xs py-2 px-3 rounded-lg border transition-all ${on ? "border-[#E8663D] bg-[#FFF4F0] text-[#E8663D] font-semibold" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                    {l}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
