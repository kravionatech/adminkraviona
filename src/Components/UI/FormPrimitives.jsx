// Shared form primitives used across admin pages.
// Wraps an optional onSave prop so callers can wire real API calls.

import { FiSave, FiCheck, FiSettings, FiPlus, FiTrash2, FiX } from "react-icons/fi";

export function PageHeader({ breadcrumb, title, icon: Icon, onSave, saving, saved, dirty }) {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
          {breadcrumb.map((b, i) => (
            <span key={i} className={i === breadcrumb.length - 1 ? "text-gray-700 font-semibold" : ""}>
              {b}{i < breadcrumb.length - 1 && <span className="mx-1">/</span>}
            </span>
          ))}
        </div>
        <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2 tracking-tight">
          {Icon && <Icon size={20} className="text-[#E8663D]" />}
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold animate-pulse">
            <FiCheck size={15} /> Saved!
          </span>
        )}
        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
            dirty ? "text-white shadow-lg hover:-translate-y-0.5 active:scale-95" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          style={dirty ? { background: "linear-gradient(135deg,#E8663D,#d45a30)" } : {}}
        >
          {saving ? <FiSettings size={14} className="animate-spin" /> : <FiSave size={14} />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] -m-6 sm:-m-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      {children}
    </div>
  );
}

export function Card({ title, subtitle, children, accent = "#E8663D" }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          {accent && <div className="w-1 h-8 rounded-full" style={{ background: accent }} />}
          <div>
            {title && <div className="font-bold text-gray-800 text-sm">{title}</div>}
            {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
          </div>
        </div>
      )}
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

export function Field({ label, hint, children, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}{required && <span className="text-[#E8663D] ml-0.5">*</span>}
      </label>
      {hint && <p className="text-[11px] text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type = "text", mono, disabled }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E8663D] focus:ring-2 focus:ring-[#E8663D]/10 transition-all ${mono ? "font-mono text-xs" : ""} ${disabled ? "bg-gray-50 text-gray-400" : ""}`}
    />
  );
}

export function Textarea({ value, onChange, placeholder, rows = 3, mono }) {
  return (
    <textarea
      rows={rows}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E8663D] focus:ring-2 focus:ring-[#E8663D]/10 transition-all resize-y ${mono ? "font-mono text-xs" : ""}`}
    />
  );
}

export function Select({ value, onChange, options }) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-[#E8663D] focus:ring-2 focus:ring-[#E8663D]/10 transition-all"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Toggle({ value, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!value)}
      className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${value ? "border-[#E8663D]/30 bg-[#FFF4F0]" : "border-gray-200 bg-gray-50"}`}
    >
      <span className={`w-9 h-5 rounded-full relative transition-colors ${value ? "bg-[#E8663D]" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${value ? "left-4" : "left-0.5"}`} />
      </span>
      <span className={`text-sm font-semibold ${value ? "text-[#E8663D]" : "text-gray-500"}`}>
        {value ? "Enabled" : "Disabled"}
      </span>
      {label && <span className="text-xs text-gray-400 ml-1">— {label}</span>}
    </button>
  );
}

export function InfoBanner({ children, color = "#E8663D", icon: Icon }) {
  return (
    <div className="mx-6 mt-5 mb-0 rounded-xl px-5 py-3 flex items-start gap-3 border" style={{ background: color + "10", borderColor: color + "33" }}>
      {Icon && <Icon size={16} className="mt-0.5 shrink-0" style={{ color }} />}
      <p className="text-sm" style={{ color }}>{children}</p>
    </div>
  );
}

export function PageBody({ children, maxWidth = "max-w-[1000px]" }) {
  return <div className={`px-6 py-6 ${maxWidth} mx-auto space-y-5`}>{children}</div>;
}

export function AddRowButton({ onClick, label }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-sm font-semibold text-[#E8663D] hover:underline px-1">
      <FiPlus size={14} /> {label}
    </button>
  );
}

export function DeleteIconBtn({ onClick }) {
  return (
    <button onClick={onClick} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition-colors shrink-0">
      <FiTrash2 size={13} />
    </button>
  );
}

export function CloseIconBtn({ onClick }) {
  return (
    <button onClick={onClick} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition-colors shrink-0">
      <FiX size={12} />
    </button>
  );
}

/**
 * Convenience hook-like state controller.
 * Usage:
 *   const ctl = useFormState(INITIAL, { onSave: async (data) => await siteConfigApi.update(data) })
 *   <Input value={ctl.data.title} onChange={ctl.set('title')} />
 */
import { useState } from "react";
export function useFormState(initial, options = {}) {
  const { onSave, onLoad } = options || {};
  const [data, setData] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (val) => {
    setData((p) => ({ ...p, [key]: val }));
    setDirty(true);
    setSaved(false);
  };

  const setAll = (val) => {
    setData(val);
    setDirty(true);
    setSaved(false);
  };

  const reset = (val = initial) => {
    setData(val);
    setDirty(false);
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      if (onSave) {
        await onSave(data);
      } else {
        await new Promise((r) => setTimeout(r, 800)); // default mock
      }
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e?.message || "Save failed");
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return { data, dirty, saving, saved, error, set, setAll, save, reset };
}
