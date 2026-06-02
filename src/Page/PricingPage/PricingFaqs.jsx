// Pricing Page → FAQs
import { FiHelpCircle } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  sectionTitle: "Pricing FAQs",
  sectionSubtitle: "Common questions about how we charge.",
  faqs: [
    { question: "Are there any setup fees?",                  answer: "No setup fees on monthly retainers. Annual plans include free onboarding & migration." },
    { question: "Can I switch plans later?",                  answer: "Yes — upgrade or downgrade anytime. We pro-rate the difference automatically." },
    { question: "What does the discovery call include?",      answer: "30-min scope conversation + sketch of architecture. Free, no strings attached." },
    { question: "Do you offer refunds?",                      answer: "If you cancel within the first 14 days of the first month, we refund 100%. After that, retainers are non-refundable." },
    { question: "What if I exceed my plan's hours?",          answer: "We bill extra hours at the same blended rate, capped at 20% overage in any given month." },
    { question: "Do you charge for travel or on-site work?",  answer: "On-site work is available — travel + accommodation are reimbursed at cost." },
  ],
};

export default function PricingFaqs() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "pricingFaqs" });
  const upd = (i, k, v) => { const fs = [...data.faqs]; fs[i] = { ...fs[i], [k]: v }; setAll({ ...data, faqs: fs }); };
  const add = () => setAll({ ...data, faqs: [...data.faqs, { question: "", answer: "" }] });
  const rem = (i) => setAll({ ...data, faqs: data.faqs.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Pricing", "FAQs"]} title="Pricing: FAQs" icon={FiHelpCircle}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiHelpCircle}>{data.faqs.length} pricing-specific FAQs.</InfoBanner>
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
                  <Input value={f.question} onChange={(v) => upd(i, "question", v)} pricingFaqs="Question…" />
                  <DeleteIconBtn onClick={() => rem(i)} />
                </div>
                <div className="pl-9">
                  <Textarea value={f.answer} onChange={(v) => upd(i, "answer", v)} pricingFaqs="Answer…" rows={2} />
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
