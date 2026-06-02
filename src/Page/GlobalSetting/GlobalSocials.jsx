// Global → Social Links
import { FiLink } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const PLATFORMS = [
  { key: "facebook",  label: "Facebook",       placeholder: "https://facebook.com/kraviona",      color: "#1877F2" },
  { key: "twitter",   label: "Twitter / X",    placeholder: "https://twitter.com/kraviona",       color: "#1DA1F2" },
  { key: "linkedin",  label: "LinkedIn",       placeholder: "https://linkedin.com/company/kraviona", color: "#0A66C2" },
  { key: "instagram", label: "Instagram",      placeholder: "https://instagram.com/kraviona",     color: "#E4405F" },
  { key: "youtube",   label: "YouTube",        placeholder: "https://youtube.com/@kraviona",      color: "#FF0000" },
  { key: "github",    label: "GitHub",         placeholder: "https://github.com/kraviona",        color: "#181717" },
  { key: "discord",   label: "Discord",        placeholder: "https://discord.gg/kraviona",        color: "#5865F2" },
  { key: "telegram",  label: "Telegram",       placeholder: "https://t.me/kraviona",              color: "#26A5E4" },
  { key: "tiktok",    label: "TikTok",         placeholder: "https://tiktok.com/@kraviona",       color: "#000000" },
  { key: "pinterest", label: "Pinterest",      placeholder: "https://pinterest.com/kraviona",     color: "#BD081C" },
  { key: "medium",    label: "Medium",         placeholder: "https://medium.com/@kraviona",       color: "#12100E" },
  { key: "dribbble",  label: "Dribbble",       placeholder: "https://dribbble.com/kraviona",      color: "#EA4C89" },
];

const INITIAL = {
  facebook: "https://facebook.com/kraviona",
  twitter: "https://twitter.com/kraviona",
  linkedin: "https://linkedin.com/company/kraviona",
  instagram: "",
  youtube: "",
  github: "",
  discord: "",
  telegram: "",
  tiktok: "",
  pinterest: "",
  medium: "",
  dribbble: "",
  showInHeader: false,
  showInFooter: true,
  openInNewTab: true,
};

export default function GlobalSocials() {
  const { data, dirty, saving, saved, set, save } = useSiteConfigForm(INITIAL, { section: "social" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Global", "Socials"]} title="Global: Social Links" icon={FiLink}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiLink}>Social profile URLs displayed across the site. Empty fields are hidden automatically.</InfoBanner>
      <PageBody>
        <Card title="Display Options">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Show in Header"><Toggle value={data.showInHeader} onChange={set("showInHeader")} /></Field>
            <Field label="Show in Footer"><Toggle value={data.showInFooter} onChange={set("showInFooter")} /></Field>
            <Field label="Open in New Tab"><Toggle value={data.openInNewTab} onChange={set("openInNewTab")} /></Field>
          </div>
        </Card>
        <Card title="Social Profile URLs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PLATFORMS.map((p) => (
              <div key={p.key} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                <span className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: p.color }}>
                  {p.label.charAt(0)}
                </span>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase">{p.label}</div>
                  <Input value={data[p.key]} onChange={set(p.key)} placeholder={p.placeholder} mono />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
