// Reusable editor for one Service detail page (/services/[slug]).
// All 11 service-page wrappers below just call <ServicePageEditor data={...} />.

import { FiCode, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner, AddRowButton, DeleteIconBtn } from "../../Components/UI/FormPrimitives";
import { servicesApi } from "../../services/api";
import { useFormState } from "../../Components/UI/FormPrimitives";

export default function ServicePageEditor({ slug, initial, icon: Icon = FiCode, displayTitle }) {
  const ctl = useFormState(initial, {
    onSave: async (data) => {
      // Try slug-based update first, fallback to update by slug
      const found = await servicesApi.publicOne(slug).catch(() => null);
      if (found && found._id) {
        await servicesApi.update(found._id, data);
      } else {
        // No matching service yet — create it
        await servicesApi.create({ ...data, slug });
      }
    },
  });
  const { data, dirty, saving, saved, set, save, setAll } = ctl;

  useEffect(() => {
    servicesApi.publicOne(slug).then((s) => {
      if (s && s._id) ctl.setAll({ ...initial, ...s });
    }).catch(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Features helpers
  const updF = (i, k, v) => { const f = [...data.features]; f[i] = { ...f[i], [k]: v }; setAll({ ...data, features: f }); };
  const addF = () => setAll({ ...data, features: [...data.features, { title: "", description: "" }] });
  const remF = (i) => setAll({ ...data, features: data.features.filter((_, idx) => idx !== i) });

  // Why-choose bullets
  const updW = (i, v) => { const w = [...data.whyChoose]; w[i] = v; setAll({ ...data, whyChoose: w }); };
  const addW = () => setAll({ ...data, whyChoose: [...data.whyChoose, ""] });
  const remW = (i) => setAll({ ...data, whyChoose: data.whyChoose.filter((_, idx) => idx !== i) });

  // FAQs
  const updFq = (i, k, v) => { const f = [...data.faqs]; f[i] = { ...f[i], [k]: v }; setAll({ ...data, faqs: f }); };
  const addFq = () => setAll({ ...data, faqs: [...data.faqs, { question: "", answer: "" }] });
  const remFq = (i) => setAll({ ...data, faqs: data.faqs.filter((_, idx) => idx !== i) });

  // Technologies
  const updT = (i, v) => { const t = [...data.technologies]; t[i] = v; setAll({ ...data, technologies: t }); };
  const addT = () => setAll({ ...data, technologies: [...data.technologies, ""] });
  const remT = (i) => setAll({ ...data, technologies: data.technologies.filter((_, idx) => idx !== i) });

  // Related services
  const toggleRel = (rslug) => set("relatedServices")(
    data.relatedServices.includes(rslug) ? data.relatedServices.filter(x => x !== rslug) : [...data.relatedServices, rslug]
  );

  const RELATED_OPTIONS = [
    "mern-stack-development", "full-stack-development", "react-development", "nodejs-development",
    "backend-development", "api-development", "database-architecture", "saas-development",
    "technical-seo", "web-performance-optimization", "ai-automation",
  ].filter(s => s !== slug);

  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Service Pages", displayTitle]} title={`Service: ${displayTitle}`} icon={Icon}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={Icon}>Edits the public page at <code className="bg-white/60 px-1 rounded">/services/{slug}</code>.</InfoBanner>
      <PageBody>
        {/* ── Hero ── */}
        <Card title="Hero" subtitle="Top section of the service page">
          <Field label="Icon (emoji)"><Input value={data.icon} onChange={set("icon")} /></Field>
          <Field label="Page Title" required><Input value={data.heroTitle} onChange={set("heroTitle")} /></Field>
          <Field label="Hero Description"><Textarea value={data.heroDescription} onChange={set("heroDescription")} rows={3} /></Field>
          <Field label="Hero Image URL"><Input value={data.heroImage} onChange={set("heroImage")} mono /></Field>
          <Field label="Is Active"><Toggle value={data.isActive} onChange={set("isActive")} label="Show this page on the public site" /></Field>
        </Card>

        {/* ── Why Choose ── */}
        <Card title="Why Choose — Bullets">
          <div className="space-y-2">
            {data.whyChoose.map((b, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="w-6 h-6 rounded-md bg-[#E8663D]/10 text-[#E8663D] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <Input value={b} onChange={(v) => updW(i, v)} placeholder="Why choose us bullet…" />
                <DeleteIconBtn onClick={() => remW(i)} />
              </div>
            ))}
          </div>
          <AddRowButton onClick={addW} label="Add Bullet" />
        </Card>

        {/* ── What's Included Features ── */}
        <Card title="What's Included — Numbered Feature Cards">
          <div className="space-y-3">
            {data.features.map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 flex gap-3 items-start">
                <span className="w-8 h-8 rounded-md bg-[#E8663D] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="flex-1 space-y-2">
                  <Field label="Title"><Input value={f.title} onChange={(v) => updF(i, "title", v)} /></Field>
                  <Field label="Description"><Textarea value={f.description} onChange={(v) => updF(i, "description", v)} rows={2} /></Field>
                </div>
                <div className="pt-6"><DeleteIconBtn onClick={() => remF(i)} /></div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={addF} label="Add Feature" />
        </Card>

        {/* ── Technologies ── */}
        <Card title="Technologies Used">
          <div className="flex flex-wrap gap-2 mb-2">
            {data.technologies.map((t, i) => (
              <div key={i} className="flex items-center gap-1 bg-gray-100 rounded-full pl-3 pr-1 py-1">
                <input value={t} onChange={(e) => updT(i, e.target.value)} className="bg-transparent text-sm font-medium border-0 outline-none w-32" />
                <button onClick={() => remT(i)} className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-xs hover:bg-red-100 hover:text-red-500">×</button>
              </div>
            ))}
            <button onClick={addT} className="flex items-center gap-1 bg-[#E8663D]/10 text-[#E8663D] text-sm font-semibold px-3 py-1 rounded-full hover:bg-[#E8663D]/20">
              <FiPlus size={12} /> Tech
            </button>
          </div>
        </Card>

        {/* ── FAQs ── */}
        <Card title="FAQ Accordion (3+ per service)">
          <div className="space-y-3">
            {data.faqs.map((q, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-md bg-[#E8663D]/10 text-[#E8663D] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <Input value={q.question} onChange={(v) => updFq(i, "question", v)} placeholder="Question…" />
                  <DeleteIconBtn onClick={() => remFq(i)} />
                </div>
                <div className="pl-9">
                  <Textarea value={q.answer} onChange={(v) => updFq(i, "answer", v)} placeholder="Answer…" rows={2} />
                </div>
              </div>
            ))}
          </div>
          <AddRowButton onClick={addFq} label="Add FAQ" />
        </Card>

        {/* ── Related Services ── */}
        <Card title="Related Services" subtitle="Shown at the bottom of the page">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {RELATED_OPTIONS.map((s) => {
              const on = data.relatedServices.includes(s);
              return (
                <button key={s} onClick={() => toggleRel(s)}
                  className={`text-xs py-2 px-3 rounded-lg border transition-all text-left font-mono ${on ? "border-[#E8663D] bg-[#FFF4F0] text-[#E8663D] font-bold" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                  {s}
                </button>
              );
            })}
          </div>
        </Card>

        {/* ── SEO ── */}
        <Card title="SEO / Meta">
          <Field label="Meta Title" hint="Max ~60 chars"><Input value={data.seo.metaTitle} onChange={(v) => setAll({ ...data, seo: { ...data.seo, metaTitle: v } })} /></Field>
          <Field label="Meta Description" hint="Max ~155 chars"><Textarea value={data.seo.metaDescription} onChange={(v) => setAll({ ...data, seo: { ...data.seo, metaDescription: v } })} rows={2} /></Field>
          <Field label="Canonical URL"><Input value={data.seo.canonicalUrl} onChange={(v) => setAll({ ...data, seo: { ...data.seo, canonicalUrl: v } })} mono /></Field>
          <Field label="OG Image URL"><Input value={data.seo.ogImage} onChange={(v) => setAll({ ...data, seo: { ...data.seo, ogImage: v } })} mono /></Field>
        </Card>
      </PageBody>
    </PageShell>
  );
}
