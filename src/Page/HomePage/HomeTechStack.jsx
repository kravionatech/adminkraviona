// Home Page → Tech Stack Section
import { FiCpu, FiPlus, FiX } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner, AddRowButton } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  sectionTitle: "Our Tech Stack",
  sectionSubtitle: "Battle-tested tools we use to ship products that scale.",
  categories: [
    { category: "Frontend", description: "Modern UI libraries",   tools: [{ name: "React.js", logo: "" }, { name: "Next.js", logo: "" }, { name: "TypeScript", logo: "" }, { name: "Tailwind CSS", logo: "" }] },
    { category: "Backend",  description: "Server & API layer",    tools: [{ name: "Node.js", logo: "" }, { name: "Express.js", logo: "" }, { name: "REST APIs", logo: "" }, { name: "GraphQL", logo: "" }] },
    { category: "Database", description: "Data storage layer",    tools: [{ name: "MongoDB", logo: "" }, { name: "Redis", logo: "" }, { name: "PostgreSQL", logo: "" }, { name: "Mongoose", logo: "" }] },
    { category: "Cloud",    description: "Deployment & infra",    tools: [{ name: "AWS", logo: "" }, { name: "Vercel", logo: "" }, { name: "Docker", logo: "" }, { name: "Railway", logo: "" }] },
  ],
};

export default function HomeTechStack() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "techStack" });

  const updCat = (i, k, v) => {
    const cats = [...data.categories]; cats[i] = { ...cats[i], [k]: v }; setAll({ ...data, categories: cats });
  };
  const updTool = (ci, ti, k, v) => {
    const cats = [...data.categories];
    const tools = [...cats[ci].tools]; tools[ti] = { ...tools[ti], [k]: v };
    cats[ci] = { ...cats[ci], tools }; setAll({ ...data, categories: cats });
  };
  const addTool = (ci) => {
    const cats = [...data.categories];
    cats[ci] = { ...cats[ci], tools: [...cats[ci].tools, { name: "", logo: "" }] };
    setAll({ ...data, categories: cats });
  };
  const remTool = (ci, ti) => {
    const cats = [...data.categories];
    cats[ci] = { ...cats[ci], tools: cats[ci].tools.filter((_, idx) => idx !== ti) };
    setAll({ ...data, categories: cats });
  };
  const addCat = () => setAll({ ...data, categories: [...data.categories, { category: "New Category", description: "", tools: [] }] });
  const remCat = (i) => setAll({ ...data, categories: data.categories.filter((_, idx) => idx !== i) });

  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "Tech Stack"]} title="Home: Tech Stack Section" icon={FiCpu}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiCpu}>Group your tooling by category. Each tool can carry an optional logo URL.</InfoBanner>
      <PageBody>
        <Card title="Section Heading">
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <Field label="Subtitle"><Textarea value={data.sectionSubtitle} onChange={set("sectionSubtitle")} rows={2} /></Field>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.categories.map((cat, ci) => (
            <Card key={ci} title={cat.category} subtitle={`${cat.tools.length} tools`}>
              <Field label="Category Name"><Input value={cat.category} onChange={(v) => updCat(ci, "category", v)} /></Field>
              <Field label="Description"><Input value={cat.description} onChange={(v) => updCat(ci, "description", v)} /></Field>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Tools</label>
                  <button onClick={() => addTool(ci)} className="text-[11px] text-[#E8663D] font-bold hover:underline flex items-center gap-0.5">
                    <FiPlus size={11} /> Add Tool
                  </button>
                </div>
                <div className="space-y-2">
                  {cat.tools.map((t, ti) => (
                    <div key={ti} className="flex gap-2 items-center">
                      <Input value={t.name} onChange={(v) => updTool(ci, ti, "name", v)} techStack="Tool name" />
                      <Input value={t.logo} onChange={(v) => updTool(ci, ti, "logo", v)} techStack="logo url (optional)" mono />
                      <button onClick={() => remTool(ci, ti)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400">
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => remCat(ci)} className="text-xs text-red-500 hover:underline">Remove this category</button>
            </Card>
          ))}
        </div>
        <AddRowButton onClick={addCat} label="Add Category" />
      </PageBody>
    </PageShell>
  );
}
