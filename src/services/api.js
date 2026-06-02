// ─── Domain API helpers — use these from pages instead of hand-rolling ────
// All helpers return `data` from the standard envelope (or throw).
import { api, call } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

// ── Auth ─────────────────────────────────────────────────────────────────
export const authApi = {
  signUp:         (body) => call(api.post(ENDPOINTS.auth.signUp, body)),
  verify:         (body) => call(api.post(ENDPOINTS.auth.verify, body)),
  resendOtp:      (body) => call(api.post(ENDPOINTS.auth.resendOtp, body)),
  loginPassword:  (body) => call(api.post(ENDPOINTS.auth.loginPassword, body)),
  loginOtp:       (body) => call(api.post(ENDPOINTS.auth.loginOtp, body)),
  refresh:        (token) => call(api.post(ENDPOINTS.auth.refresh, { token })),
  logout:         (token) => call(api.post(ENDPOINTS.auth.logout, { token })),
  me:             ()     => call(api.get(ENDPOINTS.auth.me)),
  editAccount:    (body) => call(api.put(ENDPOINTS.auth.editAccount, body)),
};

// ── Site config ──────────────────────────────────────────────────────────
export const siteConfigApi = {
  get:    () => call(api.get(ENDPOINTS.siteConfig.public)),
  update: (body) => call(api.put(ENDPOINTS.siteConfig.update, body)),
};

// ── Services ─────────────────────────────────────────────────────────────
export const servicesApi = {
  list:      (q={})      => call(api.get(ENDPOINTS.services.list(q))),
  publicAll: (q={})      => call(api.get(ENDPOINTS.services.public + qs(q))),
  publicNav: ()          => call(api.get(ENDPOINTS.services.publicNav)),
  publicOne: (slug)      => call(api.get(ENDPOINTS.services.publicOne(slug))),
  create:    (body)      => call(api.post(ENDPOINTS.services.create, body)),
  update:    (id, body)  => call(api.put(ENDPOINTS.services.update(id), body)),
  remove:    (id)        => call(api.delete(ENDPOINTS.services.remove(id))),
  reorder:   (order)     => call(api.put(ENDPOINTS.services.reorder, { order })),
};

// ── Portfolio ────────────────────────────────────────────────────────────
export const portfolioApi = {
  list:      (q={})      => call(api.get(ENDPOINTS.portfolio.public + qs(q))),
  featured:  (q={})      => call(api.get(ENDPOINTS.portfolio.publicFeatured + qs(q))),
  publicOne: (slug)      => call(api.get(ENDPOINTS.portfolio.publicOne(slug))),
  create:    (body)      => call(api.post(ENDPOINTS.portfolio.create, body)),
  update:    (id, body)  => call(api.put(ENDPOINTS.portfolio.update(id), body)),
  remove:    (id)        => call(api.delete(ENDPOINTS.portfolio.remove(id))),
};

// ── Team ─────────────────────────────────────────────────────────────────
export const teamApi = {
  list:      (q={})      => call(api.get(ENDPOINTS.team.public + qs(q))),
  publicOne: (slug)      => call(api.get(ENDPOINTS.team.publicOne(slug))),
  create:    (body)      => call(api.post(ENDPOINTS.team.create, body)),
  update:    (id, body)  => call(api.put(ENDPOINTS.team.update(id), body)),
  remove:    (id)        => call(api.delete(ENDPOINTS.team.remove(id))),
  reorder:   (order)     => call(api.put(ENDPOINTS.team.reorder, { order })),
};

// ── Testimonials ─────────────────────────────────────────────────────────
export const testimonialsApi = {
  list:      (q={})      => call(api.get(ENDPOINTS.testimonials.public + qs(q))),
  featured:  (q={})      => call(api.get(ENDPOINTS.testimonials.publicFeatured + qs(q))),
  create:    (body)      => call(api.post(ENDPOINTS.testimonials.create, body)),
  update:    (id, body)  => call(api.put(ENDPOINTS.testimonials.update(id), body)),
  approve:   (id)        => call(api.put(ENDPOINTS.testimonials.approve(id))),
  remove:    (id)        => call(api.delete(ENDPOINTS.testimonials.remove(id))),
};

// ── Case studies ─────────────────────────────────────────────────────────
export const caseStudiesApi = {
  list:      (q={})      => call(api.get(ENDPOINTS.caseStudies.public + qs(q))),
  publicOne: (slug)      => call(api.get(ENDPOINTS.caseStudies.publicOne(slug))),
  create:    (body)      => call(api.post(ENDPOINTS.caseStudies.create, body)),
  update:    (id, body)  => call(api.put(ENDPOINTS.caseStudies.update(id), body)),
  remove:    (id)        => call(api.delete(ENDPOINTS.caseStudies.remove(id))),
};

// ── Pricing ──────────────────────────────────────────────────────────────
export const pricingApi = {
  list:      (q={})      => call(api.get(ENDPOINTS.pricing.public + qs(q))),
  create:    (body)      => call(api.post(ENDPOINTS.pricing.create, body)),
  update:    (id, body)  => call(api.put(ENDPOINTS.pricing.update(id), body)),
  remove:    (id)        => call(api.delete(ENDPOINTS.pricing.remove(id))),
};

// ── Contact / Newsletter ─────────────────────────────────────────────────
export const contactApi = {
  submit:    (body)      => call(api.post(ENDPOINTS.contact.submit, body)),
  subscribe: (body)      => call(api.post(ENDPOINTS.contact.subscribe, body)),
};

// ── Blog ─────────────────────────────────────────────────────────────────
export const blogApi = {
  list:        (q={})    => call(api.get(ENDPOINTS.blog.posts(q))),
  one:         (slug)    => call(api.get(ENDPOINTS.blog.post(slug))),
  byCategory:  (slug, q={}) => call(api.get(ENDPOINTS.blog.byCategory(slug) + qs(q))),
  reaction:    (slug, body) => call(api.put(ENDPOINTS.blog.reaction(slug), body)),
  create:      (body)    => call(api.post(ENDPOINTS.blog.create, body)),
  update:      (slug, body) => call(api.put(ENDPOINTS.blog.update(slug), body)),
  remove:      (slug)    => call(api.delete(ENDPOINTS.blog.remove(slug))),
  keywords:    (slug, body) => call(api.put(ENDPOINTS.blog.keywords(slug), body)),
};

// ── Categories ───────────────────────────────────────────────────────────
export const categoriesApi = {
  list:       ()         => call(api.get(ENDPOINTS.categories.public)),
  one:        (slug)     => call(api.get(ENDPOINTS.categories.one(slug))),
  adminList:  ()         => call(api.get(ENDPOINTS.categories.admin)),
  create:     (body)     => call(api.post(ENDPOINTS.categories.new, body)),
  update:     (id, body) => call(api.put(ENDPOINTS.categories.update(id), body)),
  remove:     (id)       => call(api.delete(ENDPOINTS.categories.remove(id))),
};

// ── Comments ─────────────────────────────────────────────────────────────
export const commentsApi = {
  list:    (q={})        => call(api.get(ENDPOINTS.comments.list + qs(q))),
  update:  (id, body)    => call(api.put(ENDPOINTS.comments.update(id), body)),
  remove:  (id)          => call(api.delete(ENDPOINTS.comments.remove(id))),
};

// ── Messages / Leads ─────────────────────────────────────────────────────
export const messagesApi = {
  send:         (body)     => call(api.post(ENDPOINTS.messages.legacySend, body)),
  list:         (q={})     => call(api.get(ENDPOINTS.messages.adminList(q))),
  one:          (id)       => call(api.get(ENDPOINTS.messages.adminOne(id))),
  update:       (id, body) => call(api.patch(ENDPOINTS.messages.adminUpdate(id), body)),
  remove:       (id)       => call(api.delete(ENDPOINTS.messages.adminRemove(id))),
  assign:       (id, body) => call(api.patch(ENDPOINTS.messages.adminAssign(id), body)),
  note:         (id, body) => call(api.post(ENDPOINTS.messages.adminNote(id), body)),
  leadsStats:   ()         => call(api.get(ENDPOINTS.messages.leadsStats)),
};

// ── Subscribers ──────────────────────────────────────────────────────────
export const subscribersApi = {
  legacyNew:    (body)     => call(api.post(ENDPOINTS.subscribers.legacyNew, body)),
  list:         (q={})     => call(api.get(ENDPOINTS.subscribers.list(q))),
  update:       (id, body) => call(api.put(ENDPOINTS.subscribers.update(id), body)),
  remove:       (id)       => call(api.delete(ENDPOINTS.subscribers.remove(id))),
};

// ── Campaigns ────────────────────────────────────────────────────────────
export const campaignsApi = {
  list:     (q={})        => call(api.get(ENDPOINTS.campaigns.list + qs(q))),
  one:      (id)          => call(api.get(ENDPOINTS.campaigns.one(id))),
  create:   (body)        => call(api.post(ENDPOINTS.campaigns.create, body)),
  update:   (id, body)    => call(api.put(ENDPOINTS.campaigns.update(id), body)),
  remove:   (id)          => call(api.delete(ENDPOINTS.campaigns.remove(id))),
  send:     (id)          => call(api.post(ENDPOINTS.campaigns.send(id))),
};

// ── Media library ────────────────────────────────────────────────────────
export const mediaApi = {
  list:   (q={})          => call(api.get(ENDPOINTS.media.list + qs(q))),
  upload: (formData, onProgress) =>
    call(api.post(ENDPOINTS.media.upload, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress,
    })),
  update: (id, body)      => call(api.put(ENDPOINTS.media.update(id), body)),
  remove: (id)            => call(api.delete(ENDPOINTS.media.remove(id))),
};

// ── Notifications ────────────────────────────────────────────────────────
export const notificationsApi = {
  list:        (q={})     => call(api.get(ENDPOINTS.notifications.list + qs(q))),
  markRead:    (id)       => call(api.patch(ENDPOINTS.notifications.markRead(id))),
  markAllRead: ()         => call(api.patch(ENDPOINTS.notifications.markAllRead)),
  remove:      (id)       => call(api.delete(ENDPOINTS.notifications.remove(id))),
};

// ── Analytics / Audit / Settings ─────────────────────────────────────────
export const analyticsApi = {
  pageviews:  (q={})      => call(api.get(ENDPOINTS.analytics.pageviews + qs(q))),
  summary:    ()          => call(api.get(ENDPOINTS.analytics.summary)),
  track:      (body)      => call(api.post(ENDPOINTS.analytics.track, body)),
};
export const auditApi = {
  list: (q={})            => call(api.get(ENDPOINTS.audit.list(q))),
};
export const settingsApi = {
  public:    ()           => call(api.get(ENDPOINTS.settings.public)),
  admin:     ()           => call(api.get(ENDPOINTS.settings.admin)),
  byGroup:   (group)      => call(api.get(ENDPOINTS.settings.byGroup(group))),
  bulk:      (body)       => call(api.put(ENDPOINTS.settings.bulk, body)),
  single:    (key, body)  => call(api.put(ENDPOINTS.settings.single(key), body)),
};

// ── Admin users ──────────────────────────────────────────────────────────
export const adminUsersApi = {
  list:    ()             => call(api.get(ENDPOINTS.admin.users)),
  role:    (body)         => call(api.patch(ENDPOINTS.admin.userRole, body)),
  block:   (id, body)     => call(api.patch(ENDPOINTS.admin.userBlock(id), body)),
  remove:  (id)           => call(api.delete(ENDPOINTS.admin.userDelete(id))),
};

// ─── helpers ─────────────────────────────────────────────────────────────
function qs(obj) {
  const cleaned = Object.entries(obj || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => [encodeURIComponent(k), encodeURIComponent(v)].join("="));
  return cleaned.length ? "?" + cleaned.join("&") : "";
}
