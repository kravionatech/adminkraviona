// Pricing Page → Billing Toggle (Monthly / Annual)
import { FiRepeat } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  showBillingToggle: true,
  monthlyLabel: "Monthly",
  annualLabel: "Annual",
  annualDiscountText: "Save 20%",
  defaultBillingPeriod: "monthly",
  showSavingsPill: true,
  currency: "USD",
  showCurrencySwitcher: false,
};

export default function PricingBilling() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "pricingBilling" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Pricing", "Billing Toggle"]} title="Pricing: Billing Toggle" icon={FiRepeat}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiRepeat}>Controls the Monthly / Annual switcher above pricing cards.</InfoBanner>
      <PageBody>
        <Card title="Toggle">
          <Field label="Show Billing Toggle"><Toggle value={data.showBillingToggle} onChange={set("showBillingToggle")} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Monthly Label"><Input value={data.monthlyLabel} onChange={set("monthlyLabel")} /></Field>
            <Field label="Annual Label"><Input value={data.annualLabel} onChange={set("annualLabel")} /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Discount Text" hint="Tagline shown next to Annual"><Input value={data.annualDiscountText} onChange={set("annualDiscountText")} /></Field>
            <Field label="Default Period">
              <select value={data.defaultBillingPeriod} onChange={(e) => set("defaultBillingPeriod")(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                <option value="monthly">Monthly (default)</option>
                <option value="annual">Annual (default)</option>
              </select>
            </Field>
          </div>
          <Field label="Show Savings Pill"><Toggle value={data.showSavingsPill} onChange={set("showSavingsPill")} /></Field>
        </Card>
        <Card title="Currency">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Default Currency"><Input value={data.currency} onChange={set("currency")} /></Field>
            <Field label="Show Currency Switcher"><Toggle value={data.showCurrencySwitcher} onChange={set("showCurrencySwitcher")} /></Field>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
