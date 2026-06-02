// Home Page → Latest Posts Section
import { FiEdit3 } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  sectionTitle: "Latest from the Blog",
  sectionSubtitle: "Insights, tutorials and case studies from our team.",
  postsToShow: 3,
  showOnlyFeatured: false,
  ctaText: "Read More Articles",
  ctaLink: "/blog",
  showSection: true,
};

export default function HomeBlogSection() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "homeBlog" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "Blog Section"]} title="Home: Latest Posts Section" icon={FiEdit3}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiEdit3}>This is the only homepage section already wired to the Blog API. You can re-skin its heading and post count here.</InfoBanner>
      <PageBody>
        <Card title="Section Visibility">
          <Field label="Show on Homepage"><Toggle value={data.showSection} onChange={set("showSection")} label="Hide to remove from homepage entirely" /></Field>
        </Card>

        <Card title="Section Heading">
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <Field label="Subtitle"><Input value={data.sectionSubtitle} onChange={set("sectionSubtitle")} /></Field>
        </Card>

        <Card title="Content Rules">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Posts to Show" hint="Between 1 and 6"><Input value={data.postsToShow} onChange={set("postsToShow")} type="number" /></Field>
            <Field label="Featured Only?"><Toggle value={data.showOnlyFeatured} onChange={set("showOnlyFeatured")} label="Only posts marked Featured will appear" /></Field>
          </div>
        </Card>

        <Card title="CTA Button">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Button Text"><Input value={data.ctaText} onChange={set("ctaText")} /></Field>
            <Field label="Button Link"><Input value={data.ctaLink} onChange={set("ctaLink")} /></Field>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
