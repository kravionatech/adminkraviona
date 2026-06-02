// Home Page → FAQs
import { FiHelpCircle } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  sectionTitle: "Frequently Asked Questions",
  sectionSubtitle: "Everything you wanted to know before working with us.",
  faqs: [
    { question: "How long does a MERN Stack project take?",       answer: "Typically 4–12 weeks depending on complexity.", order: 1 },
    { question: "Do you provide post-launch support?",            answer: "Yes, we offer 24/7 post-launch maintenance plans.", order: 2 },
    { question: "Can you migrate my existing app to MERN Stack?", answer: "Absolutely. We specialize in legacy system migrations.", order: 3 },
    { question: "Do you sign NDAs?",                              answer: "Yes — we'll sign a mutual NDA before any discovery call.", order: 4 },
    { question: "What's your typical team size?",                 answer: "2–4 senior engineers per project with a dedicated PM.", order: 5 },
    { question: "Do you build mobile apps too?",                  answer: "Yes — React Native & Flutter for cross-platform apps.", order: 6 },
    { question: "Can you take over an existing project?",         answer: "We do code audits + handoffs regularly. Send the repo & we'll scope it.", order: 7 },
    { question: "What about SEO maintenance after launch?",       answer: "We offer monthly SEO retainers with reporting included.", order: 8 },
  ],
};

export default function HomeFaqs() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "homeFaqs" });

  const upd = (i, k, v) => {
    const faqs = [...data.faqs]; faqs[i] = { ...faqs[i], [k]: v }; setAll({ ...data, faqs });
  };
  const add = () => setAll({ ...data, faqs: [...data.faqs, { question: "", answer: "", order: data.faqs.length + 1 }] });
  const rem = (i) => setAll({ ...data, faqs: data.faqs.filter((_, idx) => idx !== i) });

  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Home Page", "FAQs"]} title="Home: FAQs" icon={FiHelpCircle}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiHelpCircle}>{data.faqs.length} FAQ pairs shown in the homepage accordion.</InfoBanner>
      <PageBody>
        <Card title="Section Heading">
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <Field label="Subtitle"><Input value={data.sectionSubtitle} onChange={set("sectionSubtitle")} /></Field>
        </Card>

        <Card title="FAQ Items" subtitle="Drag-handle reorder coming soon — use Order field for now">
          <div className="space-y-3">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-md bg-[#E8663D]/10 text-[#E8663D] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <Input value={faq.question} onChange={(v) => upd(i, "question", v)} homeFaqs="Question…" />
                  <DeleteIconBtn onClick={() => rem(i)} />
                </div>
                <div className="pl-9">
                  <Textarea value={faq.answer} onChange={(v) => upd(i, "answer", v)} homeFaqs="Answer…" rows={2} />
                </div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={add} label="Add FAQ" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
