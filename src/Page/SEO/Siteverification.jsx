import { useState } from "react";
import {
  FiShield, FiSave, FiCheckCircle, FiAlertCircle, FiCopy,
  FiExternalLink, FiChevronDown, FiChevronUp, FiInfo,
  FiToggleLeft, FiToggleRight, FiRefreshCw, FiEye, FiEyeOff,
  FiPlus, FiTrash2,
} from "react-icons/fi";

// Google "G" icon as SVG
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// Bing icon
const BingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#008373" d="M5 2l4 1.3v14.1l5.3-3-2-1 .7-2.3 5 2v7.4L9 24l-4-2.3z"/>
  </svg>
);

// Yandex icon
const YandexIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FC3F1D" d="M14.341 21H17V3h-3.5C9.867 3 7.5 5.2 7.5 8.5c0 2.7 1.4 4.4 3.8 5.9L7 21h2.8l4.1-6.1-.6-.4c-1.9-1.2-2.8-2.4-2.8-4.2 0-2.1 1.3-3.5 3.5-3.5h.341V21z"/>
  </svg>
);

// ─── Verification methods data ────────────────────────────────────────────────

const PLATFORMS = [
  {
    id: "google",
    name: "Google Search Console",
    icon: <GoogleIcon />,
    color: "border-blue-200",
    accent: "text-blue-600",
    bg: "bg-blue-50",
    docsUrl: "https://search.google.com/search-console",
    methods: ["meta_tag", "html_file", "dns_txt"],
  },
  {
    id: "bing",
    name: "Bing Webmaster Tools",
    icon: <BingIcon />,
    color: "border-teal-200",
    accent: "text-teal-600",
    bg: "bg-teal-50",
    docsUrl: "https://www.bing.com/webmasters",
    methods: ["meta_tag", "xml_file"],
  },
  {
    id: "yandex",
    name: "Yandex Webmaster",
    icon: <YandexIcon />,
    color: "border-red-200",
    accent: "text-red-500",
    bg: "bg-red-50",
    docsUrl: "https://webmaster.yandex.com",
    methods: ["meta_tag", "html_file"],
  },
];

const METHOD_LABELS = {
  meta_tag:  "Meta Tag",
  html_file: "HTML File",
  dns_txt:   "DNS TXT Record",
  xml_file:  "XML File",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`transition-colors ${value ? "text-[#E8622A]" : "text-gray-300"}`}>
      {value ? <FiToggleRight size={26} /> : <FiToggleLeft size={26} />}
    </button>
  );
}

function SectionCard({ title, icon, children, defaultOpen = true, statusBadge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span className="text-[#E8622A]">{icon}</span>
          {title}
          {statusBadge}
        </div>
        {open ? <FiChevronUp size={15} className="text-gray-400" /> : <FiChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-5 py-5">{children}</div>}
    </div>
  );
}

function CopyField({ value, label }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const isLong = value.length > 40;
  const display = isLong && !show ? value.slice(0, 40) + "…" : value;

  return (
    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1">
      <code className="flex-1 text-xs text-gray-600 font-mono break-all">{display}</code>
      {isLong && (
        <button onClick={() => setShow(!show)} className="text-gray-400 hover:text-gray-600 shrink-0">
          {show ? <FiEyeOff size={13} /> : <FiEye size={13} />}
        </button>
      )}
      <button onClick={handleCopy} className="text-gray-400 hover:text-[#E8622A] shrink-0 transition-colors">
        {copied ? <FiCheckCircle size={13} className="text-green-500" /> : <FiCopy size={13} />}
      </button>
    </div>
  );
}

function VerificationStatus({ verified }) {
  return verified ? (
    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full font-medium">
      <FiCheckCircle size={11} /> Verified
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs text-orange-500 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full font-medium">
      <FiAlertCircle size={11} /> Not Verified
    </span>
  );
}

function PlatformCard({ platform }) {
  const [enabled, setEnabled]         = useState(platform.id === "google");
  const [method, setMethod]           = useState(platform.methods[0]);
  const [token, setToken]             = useState("");
  const [verified, setVerified]       = useState(platform.id === "google");
  const [verifying, setVerifying]     = useState(false);
  const [open, setOpen]               = useState(platform.id === "google");

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1800);
  };

  const snippets = {
    meta_tag:  token ? `<meta name="${platform.id === "google" ? "google-site-verification" : platform.id === "bing" ? "msvalidate.01" : "yandex-verification"}" content="${token}" />` : "",
    html_file: token ? `Create a file named: ${token}.html\nUpload to: https://kraviona.com/${token}.html` : "",
    dns_txt:   token ? `TXT record value: ${platform.id === "google" ? "google-site-verification=" : ""}${token}` : "",
    xml_file:  token ? `Download and upload BingSiteAuth.xml to: https://kraviona.com/BingSiteAuth.xml` : "",
  };

  return (
    <div className={`border ${platform.color} rounded-2xl overflow-hidden mb-4`}>
      {/* Card header */}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${platform.bg} flex items-center justify-center`}>
            {platform.icon}
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-800">{platform.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {enabled ? `Method: ${METHOD_LABELS[method]}` : "Disabled"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <VerificationStatus verified={verified} />
          <Toggle value={enabled} onChange={setEnabled} />
          <span className="text-gray-300 pointer-events-none">
            {open ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
          </span>
        </div>
      </button>

      {open && enabled && (
        <div className="border-t border-gray-100 bg-white px-5 py-5 space-y-4">

          {/* Method tabs */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Verification Method</div>
            <div className="flex flex-wrap gap-2">
              {platform.methods.map((m) => (
                <button key={m} onClick={() => setMethod(m)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                    method === m
                      ? "bg-[#E8622A] text-white border-[#E8622A]"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}>
                  {METHOD_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Token input */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              {method === "dns_txt" ? "TXT Record Value" : method === "html_file" ? "File Name / Token" : "Verification Token"}
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={
                method === "meta_tag" ? "Paste your verification token here…"
                : method === "html_file" ? "e.g. google1a2b3c4d5e6f7g8h"
                : method === "dns_txt" ? "e.g. google-site-verification=XXXX"
                : "Paste XML file token…"
              }
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 font-mono focus:outline-none focus:border-[#E8622A]"
            />
          </div>

          {/* Generated snippet */}
          {token && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {method === "meta_tag" ? "Add to <head> of your site:" : "Instructions:"}
              </div>
              <CopyField value={snippets[method]} label="Snippet" />
            </div>
          )}

          {/* Info tip per method */}
          <div className={`flex items-start gap-2 text-xs ${platform.accent} ${platform.bg} rounded-lg px-3 py-2`}>
            <FiInfo size={13} className="mt-0.5 shrink-0" />
            <span>
              {method === "meta_tag" && "Place this meta tag inside the <head> section before publishing. Then click Verify."}
              {method === "html_file" && "Upload the HTML file to your domain root, then click Verify."}
              {method === "dns_txt" && "Add this TXT record to your domain's DNS settings. DNS propagation may take up to 48 hours."}
              {method === "xml_file" && "Download the XML file from Bing Webmaster Tools and upload to your site root."}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button onClick={handleVerify}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-white transition-colors ${
                verifying ? "bg-gray-400 cursor-not-allowed" : "bg-[#E8622A] hover:bg-[#d0561f]"
              }`}
              disabled={verifying || !token}
            >
              {verifying
                ? <><FiRefreshCw size={13} className="animate-spin" /> Verifying…</>
                : <><FiCheckCircle size={13} /> Verify Now</>
              }
            </button>
            <a href={platform.docsUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#E8622A] transition-colors">
              <FiExternalLink size={13} /> Open Console
            </a>
          </div>
        </div>
      )}

      {open && !enabled && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 text-xs text-gray-400 text-center">
          Enable this platform to configure verification.
        </div>
      )}
    </div>
  );
}

// Custom verification entries
function CustomVerification() {
  const [entries, setEntries] = useState([]);
  const [name, setName]       = useState("");
  const [tag, setTag]         = useState("");

  const add = () => {
    if (!name || !tag) return;
    setEntries((p) => [...p, { id: Date.now(), name, tag }]);
    setName(""); setTag("");
  };

  return (
    <div className="space-y-3">
      {entries.map((e) => (
        <div key={e.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex-1">
            <div className="text-xs font-semibold text-gray-600">{e.name}</div>
            <code className="text-xs text-gray-400 font-mono break-all">{e.tag}</code>
          </div>
          <button onClick={() => setEntries((p) => p.filter((x) => x.id !== e.id))}
            className="text-gray-300 hover:text-red-400 transition-colors">
            <FiTrash2 size={14} />
          </button>
        </div>
      ))}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Platform name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pinterest"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#E8622A]" />
        </div>
        <div className="flex-[2]">
          <label className="text-xs text-gray-400 mb-1 block">Meta tag or token</label>
          <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder='<meta name="p:domain_verify" content="xxx" />'
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 font-mono focus:outline-none focus:border-[#E8622A]" />
        </div>
        <button onClick={add}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-[#E8622A] rounded-lg hover:bg-[#d0561f] transition-colors">
          <FiPlus size={14} /> Add
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SiteVerification() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">SEO: Site Verification</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Verify your site with search engines and webmaster tools.
          </p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg transition-colors ${
            saved ? "bg-green-500" : "bg-[#E8622A] hover:bg-[#d0561f]"
          }`}>
          {saved ? <FiCheckCircle size={14} /> : <FiSave size={14} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Google Search Console", verified: true,  icon: <GoogleIcon /> },
          { label: "Bing Webmaster Tools",  verified: false, icon: <BingIcon />   },
          { label: "Yandex Webmaster",      verified: false, icon: <YandexIcon /> },
        ].map((p) => (
          <div key={p.label} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">{p.icon}</div>
            <div>
              <div className="text-xs font-medium text-gray-700">{p.label}</div>
              <VerificationStatus verified={p.verified} />
            </div>
          </div>
        ))}
      </div>

      {/* Platform cards */}
      <SectionCard title="Search Engine Verification" icon={<FiShield size={15} />}
        statusBadge={
          <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">1 verified</span>
        }>
        {PLATFORMS.map((p) => <PlatformCard key={p.id} platform={p} />)}
      </SectionCard>

      {/* Custom */}
      <SectionCard title="Custom Verification Tags" icon={<FiPlus size={15} />} defaultOpen={false}>
        <p className="text-xs text-gray-400 mb-4">
          Add meta verification tags for other platforms like Pinterest, Norton, etc.
        </p>
        <CustomVerification />
      </SectionCard>

      {/* Info */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600">
        <FiInfo size={14} className="mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">How it works:</span> Verification meta tags are injected into your site's
          &lt;head&gt; automatically. After saving, click "Verify Now" — or go to the respective console to confirm ownership.
        </div>
      </div>
    </div>
  );
}