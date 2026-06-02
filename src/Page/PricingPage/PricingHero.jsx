// Pricing Page → Hero
import { FiMonitor } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  badge: "Transparent Pricing",
  title: "Pricing that scales with you.",
  subtitle: "Flat-rate engineering retainers. No hidden fees. Cancel anytime.",
  comingSoonTitle: "Pricing — Coming Soon",
  comingSoonSubtitle: "We're finalising our public pricing plans. Until then, all engagements are custom-scoped via a discovery call.",
};

export default function PricingHero() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "pricingHero" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Pricing", "Hero"]} title="Pricing: Hero" icon={FiMonitor}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMonitor}>Top hero on <code className="bg-white/60 px-1 rounded">/pricing</code>. Shows coming-soon when no plans are published.</InfoBanner>
      <PageBody>
        <Card title="Live Hero (after launch)">
          <Field label="Badge"><Input value={data.badge} onChange={set("badge")} /></Field>
          <Field label="Title"><Input value={data.title} onChange={set("title")} /></Field>
          <Field label="Subtitle"><Textarea value={data.subtitle} onChange={set("subtitle")} rows={2} /></Field>
        </Card>
        <Card title="Coming-Soon Hero">
          <Field label="Title"><Input value={data.comingSoonTitle} onChange={set("comingSoonTitle")} /></Field>
          <Field label="Subtitle"><Textarea value={data.comingSoonSubtitle} onChange={set("comingSoonSubtitle")} rows={3} /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
