// ─── All endpoint paths used by the Kraviona admin panel ─────────────────
// Centralised so the rest of the codebase never hardcodes URL strings.
// Endpoint shapes follow API_GUIDE.md v2.0 (kraviona_dynamization_spec.docx).

const P = "/v1";   // dynamization-spec public routes
const A = "/admin"; // admin / super_admin protected routes
const V = "/v1";    // v1 admin writes

export const ENDPOINTS = {
  // ── Auth ───────────────────────────────────────────────────────────
  auth: {
    signUp:          "/auth/create-account",
    verify:          "/auth/verify-account",
    resendOtp:       "/auth/resend-otp",
    loginPassword:   "/auth/login-password",
    loginOtp:        "/auth/login-otp",
    refresh:         "/auth/refresh-token",
    logout:          "/auth/logout",
    me:              "/auth/me",
    editAccount:     "/auth/edit-account",
  },

  // ── Admin user management ──────────────────────────────────────────
  admin: {
    users:           `${A}/users`,
    userRole:        `${A}/user/role`,
    userBlock:       (id) => `${A}/user/${id}/block`,
    userDelete:      (id) => `${A}/user/${id}`,
  },

  // ── Site config (single document) ───────────────────────────────────
  siteConfig: {
    public:          `${P}/public/site-config`,
    update:          `${V}/site-config`,
  },

  // ── Services ────────────────────────────────────────────────────────
  services: {
    public:          `${P}/public/services`,
    publicNav:       `${P}/public/services/nav`,
    publicOne:       (slug) => `${P}/public/services/${slug}`,
    list:            (q={}) => `/services${toQs(q)}`,
    create:          `${V}/services`,
    update:          (id) => `${V}/services/${id}`,
    remove:          (id) => `${V}/services/${id}`,
    reorder:         `${V}/services/reorder`,
  },

  // ── Portfolio / Projects ────────────────────────────────────────────
  portfolio: {
    public:          `${P}/public/portfolio`,
    publicFeatured:  `${P}/public/portfolio/featured`,
    publicOne:       (slug) => `${P}/public/portfolio/${slug}`,
    create:          `${V}/portfolio`,
    update:          (id) => `${V}/portfolio/${id}`,
    remove:          (id) => `${V}/portfolio/${id}`,
  },

  // ── Team ────────────────────────────────────────────────────────────
  team: {
    public:          `${P}/public/team`,
    publicOne:       (slug) => `${P}/public/team/${slug}`,
    create:          `${V}/team`,
    update:          (id) => `${V}/team/${id}`,
    remove:          (id) => `${V}/team/${id}`,
    reorder:         `${V}/team/reorder`,
  },

  // ── Testimonials ────────────────────────────────────────────────────
  testimonials: {
    public:          `${P}/public/testimonials`,
    publicFeatured:  `${P}/public/testimonials/featured`,
    create:          `${V}/testimonials`,
    update:          (id) => `${V}/testimonials/${id}`,
    approve:         (id) => `${V}/testimonials/${id}/approve`,
    remove:          (id) => `${V}/testimonials/${id}`,
  },

  // ── Case studies ────────────────────────────────────────────────────
  caseStudies: {
    public:          `${P}/public/case-studies`,
    publicOne:       (slug) => `${P}/public/case-studies/${slug}`,
    create:          `${V}/case-studies`,
    update:          (id) => `${V}/case-studies/${id}`,
    remove:          (id) => `${V}/case-studies/${id}`,
  },

  // ── Pricing ─────────────────────────────────────────────────────────
  pricing: {
    public:          `${P}/public/pricing`,
    create:          `${V}/pricing`,
    update:          (id) => `${V}/pricing/${id}`,
    remove:          (id) => `${V}/pricing/${id}`,
  },

  // ── Public contact / newsletter ─────────────────────────────────────
  contact: {
    submit:          `${P}/public/contact`,
    subscribe:       `${P}/public/newsletter/subscribe`,
  },

  // ── Blog (existing CRM module — DO NOT MODIFY) ─────────────────────
  blog: {
    posts:           (q={}) => `/posts${toQs(q)}`,
    post:            (slug) => `/post/${slug}`,
    byCategory:      (slug) => `/posts/category/${slug}`,
    reaction:        (slug) => `/post/reaction/${slug}`,
    create:          "/post/create",
    update:          (slug) => `/post/${slug}`,
    remove:          (slug) => `/post/${slug}`,
    keywords:        (slug) => `/keywords/${slug}`,
  },

  // ── Blog categories (existing) ─────────────────────────────────────
  categories: {
    public:          "/categories/public",
    one:             (slug) => `/category/${slug}`,
    admin:           "/categories/admin",
    new:             "/category/new",
    update:          (id) => `/category/${id}`,
    remove:          (id) => `/category/${id}`,
  },

  // ── Comments ───────────────────────────────────────────────────────
  comments: {
    list:            `${A}/comments`,
    update:          (id) => `${A}/comment/${id}`,
    remove:          (id) => `${A}/comment/${id}`,
  },

  // ── Messages / leads (CRM) ─────────────────────────────────────────
  messages: {
    legacySend:      "/client/send-message",
    adminList:       (q={}) => `${A}/messages${toQs(q)}`,
    adminOne:        (id) => `${A}/messages/${id}`,
    adminUpdate:     (id) => `${A}/messages/${id}`,
    adminRemove:     (id) => `${A}/messages/${id}`,
    adminAssign:     (id) => `${A}/messages/${id}/assign`,
    adminNote:       (id) => `${A}/messages/${id}/note`,
    leadsStats:      `${A}/leads/stats`,
  },

  // ── Subscribers (newsletter) ───────────────────────────────────────
  subscribers: {
    legacyNew:       "/subscriber/new",
    list:            (q={}) => `/subscribers${toQs(q)}`,
    update:          (id) => `/subscriber/update/${id}`,
    remove:          (id) => `/subscriber/delete/${id}`,
  },

  // ── Campaigns ──────────────────────────────────────────────────────
  campaigns: {
    list:            `${A}/campaigns`,
    one:             (id) => `${A}/campaigns/${id}`,
    create:          `${A}/campaigns`,
    update:          (id) => `${A}/campaigns/${id}`,
    remove:          (id) => `${A}/campaigns/${id}`,
    send:            (id) => `${A}/campaigns/${id}/send`,
  },

  // ── Media library ──────────────────────────────────────────────────
  media: {
    list:            "/files",
    upload:          "/upload",
    update:          (id) => `/files/${id}`,
    remove:          (id) => `/files/${id}`,
  },

  // ── Notifications ──────────────────────────────────────────────────
  notifications: {
    list:            `${A}/notifications`,
    markRead:        (id) => `${A}/notifications/${id}/read`,
    markAllRead:     `${A}/notifications/read-all`,
    remove:          (id) => `${A}/notifications/${id}`,
  },

  // ── Analytics / audit / settings ───────────────────────────────────
  analytics: {
    pageviews:       `${A}/analytics/pageviews`,
    summary:         `${A}/analytics/summary`,
    track:           "/track/event",
  },
  audit: {
    list:            (q={}) => `${A}/audit${toQs(q)}`,
  },
  settings: {
    public:          "/settings/public",
    admin:           `${A}/settings`,
    byGroup:         (group) => `${A}/settings/${group}`,
    bulk:            `${A}/settings`,
    single:          (key) => `${A}/settings/${key}`,
  },
};

function toQs(obj) {
  const cleaned = Object.entries(obj || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => [encodeURIComponent(k), encodeURIComponent(v)].join("="));
  if (!cleaned.length) return "";
  return "?" + cleaned.join("&");
}

export default ENDPOINTS;
