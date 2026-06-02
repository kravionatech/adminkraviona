// Contact Page → Contact Info Cards
import { FiPhone } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  sectionTitle: "Ways to Reach Us",
  cards: [
    { icon: "📧", title: "Email",     value: "kravionatech@gmail.com",     href: "mailto:kravionatech@gmail.com",  subtext: "Replies in ≤ 4 business hours" },
    { icon: "📞", title: "Phone",     value: "+91 9608553167",             href: "tel:+919608553167",              subtext: "Mon–Fri · 10am – 7pm IST" },
    { icon: "💬", title: "WhatsApp",  value: "+91 9608553167",             href: "https://wa.me/919608553167",     subtext: "Fastest channel for quick questions" },
    { icon: "📍", title: "Office",    value: "East Delhi, India 110092",   href: "https://maps.google.com/?q=East+Delhi+110092", subtext: "By appointment only" },
  ],
  businessHours: "Mon – Fri · 10:00 AM – 7:00 PM IST",
};

export default function ContactInfo() {
  const {  data, dirty, saving, saved, set, save, setAll  } = useSiteConfigForm(INITIAL, { section: "contactInfo" });
  const upd = (i, k, v) => { const c = [...data.cards]; c[i] = { ...c[i], [k]: v }; setAll({ ...data, cards: c }); };
  const add = () => setAll({ ...data, cards: [...data.cards, { icon: "✨", title: "", value: "", href: "", subtext: "" }] });
  const rem = (i) => setAll({ ...data, cards: data.cards.filter((_, idx) => idx !== i) });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Contact Page", "Info"]} title="Contact: Information" icon={FiPhone}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiPhone}>Contact-method cards shown on the page (email, phone, WhatsApp, office, etc).</InfoBanner>
      <PageBody>
        <Card title="Section Heading">
          <Field label="Title"><Input value={data.sectionTitle} onChange={set("sectionTitle")} /></Field>
          <Field label="Business Hours" hint="Shown under the cards"><Input value={data.businessHours} onChange={set("businessHours")} /></Field>
        </Card>

        <Card title="Cards" subtitle={`${data.cards.length} cards`}>
          <div className="space-y-3">
            {data.cards.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 grid grid-cols-12 gap-3 items-start">
                <div className="col-span-1"><Field label="Icon"><Input value={c.icon} onChange={(v) => upd(i, "icon", v)} /></Field></div>
                <div className="col-span-3"><Field label="Title"><Input value={c.title} onChange={(v) => upd(i, "title", v)} /></Field></div>
                <div className="col-span-3"><Field label="Value"><Input value={c.value} onChange={(v) => upd(i, "value", v)} /></Field></div>
                <div className="col-span-4"><Field label="Link"><Input value={c.href} onChange={(v) => upd(i, "href", v)} mono /></Field></div>
                <div className="col-span-1 pt-6 text-right"><DeleteIconBtn onClick={() => rem(i)} /></div>
                <div className="col-span-12"><Field label="Subtext"><Input value={c.subtext} onChange={(v) => upd(i, "subtext", v)} /></Field></div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={add} label="Add Card" />
        </Card>
      </PageBody>
    </PageShell>
  );
}
