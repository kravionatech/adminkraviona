// Services Page → FAQs (shared across all service detail pages bottom)
import { FiHelpCircle } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  sectionTitle: "Common Engineering Questions",
  sectionSubtitle: "Frequently asked by founders and CTOs before kicking off a build.",
  faqs: [
    { question: "How do you scope a fixed-price project?",     answer: "We do a paid 1-week discovery, then deliver a Statement of Work with milestones and acceptance criteria." },
    { question: "Can you integrate with our existing CI/CD?",  answer: "Yes. We work natively with GitHub Actions, GitLab CI, CircleCI and Jenkins." },
    { question: "Do you offer code audits before engagement?", answer: "Absolutely — we offer a 2-day code & architecture audit for a fixed fee." },
    { question: "What ownership do we have post-launch?",      answer: "100% ownership of all code, designs, and assets. We sign IP-transfer agreements before kickoff." },
    { question: "How do you handle data migration?",           answer: "We script idempotent ETL pipelines and run them on a copy of production until 100% parity is verified." },
  ],
};

export default function ServicesFaqs() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "servicesFaqs" });
  const upd = (i, k, v) => { const faqs = [...data.faqs]; faqs[i] = { ...faqs[i], [k]: v }; setAll({ ...data, faqs }); };
  const add = () => setAll({ ...data, faqs: [...data.faqs, { question: "", answer: "" }] });
  const rem = (i) => setAll({ ...data, faqs: data.faqs.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Services Page", "FAQs"]} title="Services Page FAQs" icon={FiHelpCircle}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiHelpCircle}>{data.faqs.length} FAQs shown at the bottom of <code className="bg-white/60 px-1 rounded">/services</code>.</InfoBanner>
      <PageBody>
        <Card title="Heading">
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <Field label="Subtitle"><Input value={data.sectionSubtitle} onChange={set("sectionSubtitle")} /></Field>
        </Card>
        <Card title="FAQ Items">
          <div className="space-y-3">
            {data.faqs.map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-md bg-[#E8663D]/10 text-[#E8663D] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <Input value={f.question} onChange={(v) => upd(i, "question", v)} servicesFaqs="Question…" />
                  <DeleteIconBtn onClick={() => rem(i)} />
                </div>
                <div className="pl-9">
                  <Textarea value={f.answer} onChange={(v) => upd(i, "answer", v)} servicesFaqs="Answer…" rows={2} />
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
