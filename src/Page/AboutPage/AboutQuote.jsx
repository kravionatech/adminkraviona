// About Page → Pull Quote
import { FiFileText } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  quoteText: "Great software is not what you ship — it's what people are still using five years later.",
  authorName: "Amar Kumar",
  authorTitle: "Founder, Kraviona",
  authorImage: "",
  showQuote: true,
};

export default function AboutQuote() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "aboutQuote" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "About Page", "Quote"]} title="About: Story Pull Quote" icon={FiFileText}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiFileText}>Large pull quote that breaks up the story prose on the About page.</InfoBanner>
      <PageBody>
        <Card title="Quote">
          <Field label="Quote Text" hint="The quoted line — keep it punchy"><Textarea value={data.quoteText} onChange={set("quoteText")} rows={4} /></Field>
        </Card>
        <Card title="Attribution">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Author Name"><Input value={data.authorName} onChange={set("authorName")} /></Field>
            <Field label="Author Title"><Input value={data.authorTitle} onChange={set("authorTitle")} /></Field>
          </div>
          <Field label="Author Photo URL" hint="Optional avatar"><Input value={data.authorImage} onChange={set("authorImage")} mono /></Field>
        </Card>

        <Card title="Live Preview" accent="#235056">
          <div className="bg-[#235056] text-white rounded-xl p-8">
            <div className="text-3xl text-[#f2c695] mb-3">"</div>
            <p className="text-lg italic leading-relaxed">{data.quoteText}</p>
            <div className="mt-4 text-sm">
              <div className="font-bold text-[#f2c695]">{data.authorName}</div>
              <div className="text-white/60 text-xs">{data.authorTitle}</div>
            </div>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
