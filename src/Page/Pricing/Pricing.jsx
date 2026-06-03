// Pricing Plans CRUD — /dashboard/pricing
import { useState, useEffect } from "react";
import { FiDollarSign, FiPlus, FiEdit3, FiTrash2, FiX, FiCheck, FiStar, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { pricingApi, siteConfigApi } from "../../services/api";

const EMPTY = {
  name: "", tagline: "", priceMonthly: 0, priceAnnual: 0,
  isPopular: false, isHighlighted: false, isActive: true,
  ctaText: "Get Started", ctaLink: "/contact",
  features: [{ text: "", included: true }],
};

export default function PricingCRUD() {
  const [items, setItems] = useState([]);
  const [isComingSoon, setIsComingSoon] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    pricingApi.list({ limit: 200 }).then((d) => {
      const list = Array.isArray(d) ? d : (d?.data || []);
      setItems(list);
    }).catch(() => setItems([]));
    siteConfigApi.get().then((cfg) => {
      if (cfg?.pricing?.isComingSoon !== undefined) setIsComingSoon(cfg.pricing.isComingSoon);
    }).catch(() => null);
  }, []);

  const openCreate = () => { setForm(EMPTY); setEditing("new"); };
  const openEdit = (it) => { setForm({ ...it }); setEditing(it._id); };
  const close = () => { setEditing(null); setForm(EMPTY); };

  const save = async () => {
    try {
      if (editing === "new") {
        const added = await pricingApi.create(form);
        setItems([...items, added]);
      } else {
        const updated = await pricingApi.update(editing, form);
        setItems(items.map((i) => i._id === editing ? updated : i));
      }
      close();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await pricingApi.remove(id);
      setItems(items.filter((i) => i._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleComingSoon = async () => {
    const val = !isComingSoon;
    setIsComingSoon(val);
    try {
      await siteConfigApi.update({ pricing: { isComingSoon: val } });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] -m-6 sm:-m-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Admin / Pricing Plans</div>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <FiDollarSign size={20} className="text-[#E8663D]" /> Pricing Plans
          </h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg" style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}>
          <FiPlus size={14} /> New Plan
        </button>
      </div>

      {/* Coming Soon Banner */}
      <div className="mx-6 mt-5 mb-0 bg-[#FFF4F0] border border-[#E8663D]/20 rounded-xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-start gap-3">
          <FiDollarSign size={18} className="text-[#E8663D] mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#c4501e]">Pricing page status: {isComingSoon ? "Coming Soon" : "Live"}</p>
            <p className="text-xs text-[#c4501e]/80">{isComingSoon ? "Plans below are HIDDEN from the public site." : "Plans below are visible on /pricing."}</p>
          </div>
        </div>
        <button onClick={toggleComingSoon} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8663D]/30">
          {isComingSoon ? <FiToggleLeft size={20} className="text-gray-400" /> : <FiToggleRight size={20} className="text-[#E8663D]" />}
          <span className="text-sm font-bold text-[#c4501e]">{isComingSoon ? "Coming Soon" : "Live"}</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl mx-6 mt-6 text-gray-400 gap-3">
          <FiDollarSign size={48} className="text-gray-300" style={{ strokeWidth: 1.5 }} />
          <div className="text-sm font-semibold">Data not available</div>
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg" style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}>
            <FiPlus size={14} /> New Plan
          </button>
        </div>
      ) : (
        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p._id} className={`bg-white rounded-2xl border-2 p-6 relative ${p.isHighlighted ? "border-[#E8663D] shadow-lg" : "border-gray-100 shadow-sm"}`}>
              {p.isPopular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8663D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>}
              <div className="text-lg font-bold text-gray-800">{p.name}</div>
              <div className="text-xs text-gray-500 mb-3">{p.tagline}</div>
              <div className="mb-4">
                {p.priceMonthly > 0 ? (
                  <div>
                    <span className="text-3xl font-extrabold text-gray-800">₹{p.priceMonthly.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">/ month</span>
                  </div>
                ) : (
                  <div className="text-3xl font-extrabold text-gray-800">Custom</div>
                )}
                {p.priceAnnual > 0 && <div className="text-[11px] text-gray-400">or ₹{p.priceAnnual.toLocaleString()} / year</div>}
              </div>
              <ul className="space-y-2 mb-5 text-xs">
                {p.features.map((f, i) => (
                  <li key={i} className={`flex items-start gap-2 ${f.included ? "text-gray-700" : "text-gray-300 line-through"}`}>
                    {f.included ? <FiCheck size={13} className="text-emerald-500 mt-0.5 shrink-0" /> : <FiX size={13} className="text-gray-300 mt-0.5 shrink-0" />}
                    {f.text}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 mb-3">
                {p.isPopular && <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-bold flex items-center gap-1"><FiStar size={9} /> Popular</span>}
                {p.isHighlighted && <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#E8663D]/10 text-[#E8663D] font-bold">Highlighted</span>}
                {!p.isActive && <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-bold">Inactive</span>}
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"><FiEdit3 size={11} /> Edit</button>
                <button onClick={() => del(p._id)} className="px-3 py-2 rounded-lg text-red-500 hover:bg-red-50"><FiTrash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={close}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-800">{editing === "new" ? "New Plan" : "Edit Plan"}</h2>
              <button onClick={close} className="p-2 hover:bg-gray-100 rounded-lg"><FiX /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PInput label="Plan Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <PInput label="Tagline"  value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
                <PInput label="Price / Month (₹)" type="number" value={form.priceMonthly} onChange={(v) => setForm({ ...form, priceMonthly: +v })} />
                <PInput label="Price / Year (₹)"  type="number" value={form.priceAnnual}  onChange={(v) => setForm({ ...form, priceAnnual: +v })} />
                <PInput label="CTA Text" value={form.ctaText} onChange={(v) => setForm({ ...form, ctaText: v })} />
                <PInput label="CTA Link" value={form.ctaLink} onChange={(v) => setForm({ ...form, ctaLink: v })} mono />
              </div>

              <div className="flex flex-wrap gap-2">
                <PFlag label="Active" value={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} />
                <PFlag label="Popular" value={form.isPopular} onChange={(v) => setForm({ ...form, isPopular: v })} />
                <PFlag label="Highlighted" value={form.isHighlighted} onChange={(v) => setForm({ ...form, isHighlighted: v })} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Features</label>
                <div className="space-y-2">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex gap-2 items-center bg-gray-50 rounded-xl p-2">
                      <button onClick={() => { const ff = [...form.features]; ff[i] = { ...ff[i], included: !ff[i].included }; setForm({ ...form, features: ff }); }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${f.included ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-400"}`}>
                        {f.included ? <FiCheck size={13} /> : <FiX size={13} />}
                      </button>
                      <input value={f.text} onChange={(e) => { const ff = [...form.features]; ff[i] = { ...ff[i], text: e.target.value }; setForm({ ...form, features: ff }); }}
                        placeholder="Feature text…" className="flex-1 bg-transparent text-sm border-0 outline-none" />
                      <button onClick={() => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })}
                        className="p-1.5 text-gray-300 hover:text-red-500"><FiTrash2 size={13} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setForm({ ...form, features: [...form.features, { text: "", included: true }] })}
                  className="mt-2 flex items-center gap-2 text-sm font-bold text-[#E8663D]"><FiPlus size={13} /> Add Feature</button>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2 z-10">
              <button onClick={close} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl">Cancel</button>
              <button onClick={save} className="px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow" style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}>Save Plan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PInput({ label, value, onChange, type = "text", mono }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm ${mono ? "font-mono text-xs" : ""}`} />
    </div>
  );
}
function PFlag({ label, value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className={`px-4 py-2 rounded-xl text-sm font-semibold ${value ? "bg-[#E8663D]/10 text-[#E8663D]" : "bg-gray-100 text-gray-500"}`}>
      {value ? "✓ " : ""}{label}
    </button>
  );
}
