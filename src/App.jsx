import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Middlewares & Layout
import RouteProtector from "./Middleware/RouteProtector";
import PublicRoute from "./Middleware/PublicRoute";
import Layout from "./Components/Layout/Layout";

// ─── Existing Pages ───────────────────────────────────────────────
import Auth from "./Page/Auth/Auth";
import Dashboard from "./Page/DashBoard/Dashboard";
import ManagePost from "./Page/ManagePost/ManagePost";
import AddPost from "./Page/ManagePost/AddPost";
import KravionaMessages from "./Page/Message/Message";
import UsersPage from "./Page/Users/Users";
import LeadsPage from "./Page/Leads/Leads";
import TeamsPage from "./Page/Teams/Teams";
import CategoriesPage from "./Page/Categories/Categories";
import CommentsPage from "./Page/Comments/Comments";
import MediaLibrary from "./Page/MediaLibrary/MediaLibrary";
import Notifications from "./Page/Notifications/Notifications";
import NewsletterSection from "./Page/NewsLetters/NewsLetter";
import ContentDecay from "./Page/ManagePost/ContentDecay";
import Services from "./Page/Services/Services";
import CampaignsPage from "./Page/Campaigns/Campaigns";
import GlobalSettingsPage from "./Page/GlobalSetting/Globalsettingspage";
import SettingsPage from "./Page/Setting/Settings";

// ─── SEO ──────────────────────────────────────────────────────────
import RobotsPage from "./Page/SEO/RobotsPage";
import SitemapConfig from "./Page/SEO/Sitemapconfig";
import SchemaJsonLD from "./Page/SEO/Schemajsonld";
import SiteVerification from "./Page/SEO/Siteverification";
import CanonicalRules from "./Page/SEO/Canonicalrules";
import NoIndexPages from "./Page/SEO/Noindexpages";
import SeoDefaults from "./Page/SEO/SeoDefaults";
import SeoOgImage from "./Page/SEO/SeoOgImage";

// ─── HOME PAGE SETTINGS ───────────────────────────────────────────
import HomeHero from "./Page/HomePage/HomeHero";
import HomeStats from "./Page/HomePage/HomeStats";
import HomeServicesShowcase from "./Page/HomePage/HomeServicesShowcase";
import HomeWhyUs from "./Page/HomePage/HomeWhyUs";
import HomeWhoWeAre from "./Page/HomePage/HomeWhoWeAre";
import HomeTechStack from "./Page/HomePage/HomeTechStack";
import HomeFaqs from "./Page/HomePage/HomeFaqs";
import HomeBlogSection from "./Page/HomePage/HomeBlogSection";
import HomeCta from "./Page/HomePage/HomeCta";
import HomeTestimonials from "./Page/HomePage/HomeTestimonials";
import HomeNewsletter from "./Page/HomePage/HomeNewsletter";

// ─── SERVICES PAGE SETTINGS ───────────────────────────────────────
import ServicesHero from "./Page/ServicesPage/ServicesHero";
import ServicesEdgeCards from "./Page/ServicesPage/ServicesEdgeCards";
import ServicesNavConfig from "./Page/ServicesPage/ServicesNavConfig";
import ServicesFaqs from "./Page/ServicesPage/ServicesFaqs";
import ServicesContactForm from "./Page/ServicesPage/ServicesContactForm";

// ─── ABOUT PAGE SETTINGS ──────────────────────────────────────────
import AboutHero from "./Page/AboutPage/AboutHero";
import AboutStory from "./Page/AboutPage/AboutStory";
import AboutQuote from "./Page/AboutPage/AboutQuote";
import AboutStats from "./Page/AboutPage/AboutStats";
import AboutValues from "./Page/AboutPage/AboutValues";
import AboutCta from "./Page/AboutPage/AboutCta";

// ─── GALLERY PAGE SETTINGS ────────────────────────────────────────
import GalleryHero from "./Page/GalleryPage/GalleryHero";
import GalleryFilters from "./Page/GalleryPage/GalleryFilters";
import GalleryFeatured from "./Page/GalleryPage/GalleryFeatured";
import GalleryTestimonials from "./Page/GalleryPage/GalleryTestimonials";

// ─── CASE STUDIES PAGE SETTINGS ───────────────────────────────────
import CaseStudiesHero from "./Page/CaseStudiesPage/CaseStudiesHero";
import CaseStudiesVisibility from "./Page/CaseStudiesPage/CaseStudiesVisibility";
import CaseStudiesNotify from "./Page/CaseStudiesPage/CaseStudiesNotify";

// ─── PRICING PAGE SETTINGS ────────────────────────────────────────
import PricingHero from "./Page/PricingPage/PricingHero";
import PricingVisibility from "./Page/PricingPage/PricingVisibility";
import PricingBilling from "./Page/PricingPage/PricingBilling";
import PricingDisclaimer from "./Page/PricingPage/PricingDisclaimer";
import PricingFaqs from "./Page/PricingPage/PricingFaqs";

// ─── CONTACT PAGE SETTINGS ────────────────────────────────────────
import ContactHero from "./Page/ContactPage/ContactHero";
import ContactInfo from "./Page/ContactPage/ContactInfo";
import ContactAddress from "./Page/ContactPage/ContactAddress";
import ContactFormConfig from "./Page/ContactPage/ContactFormConfig";
import ContactAutoReply from "./Page/ContactPage/ContactAutoReply";

// ─── BLOG LISTING SETTINGS ────────────────────────────────────────
import BlogHero from "./Page/BlogListingPage/BlogHero";
import BlogFeatured from "./Page/BlogListingPage/BlogFeatured";
import BlogPagination from "./Page/BlogListingPage/BlogPagination";

// ─── INDIVIDUAL SERVICE PAGES (11) ────────────────────────────────
import ServicePageMern from "./Page/ServicePages/ServicePageMern";
import ServicePageFullStack from "./Page/ServicePages/ServicePageFullStack";
import ServicePageReact from "./Page/ServicePages/ServicePageReact";
import ServicePageNode from "./Page/ServicePages/ServicePageNode";
import ServicePageBackend from "./Page/ServicePages/ServicePageBackend";
import ServicePageApi from "./Page/ServicePages/ServicePageApi";
import ServicePageDatabase from "./Page/ServicePages/ServicePageDatabase";
import ServicePageSaas from "./Page/ServicePages/ServicePageSaas";
import ServicePageSeo from "./Page/ServicePages/ServicePageSeo";
import ServicePagePerf from "./Page/ServicePages/ServicePagePerf";
import ServicePageAi from "./Page/ServicePages/ServicePageAi";

// ─── GLOBAL SITE SETTINGS DRILL-DOWNS ─────────────────────────────
import GlobalContactInfo from "./Page/GlobalSetting/GlobalContactInfo";
import GlobalAddress from "./Page/GlobalSetting/GlobalAddress";
import GlobalSocials from "./Page/GlobalSetting/GlobalSocials";
import GlobalFooter from "./Page/GlobalSetting/GlobalFooter";
import GlobalNav from "./Page/GlobalSetting/GlobalNav";
import GlobalNewsletter from "./Page/GlobalSetting/GlobalNewsletter";
import GlobalAnalytics from "./Page/GlobalSetting/GlobalAnalytics";
import GlobalMaintenance from "./Page/GlobalSetting/GlobalMaintenance";

// ─── CRUD PAGES ───────────────────────────────────────────────────
import Portfolio from "./Page/Portfolio/Portfolio";
import CaseStudiesCRUD from "./Page/CaseStudies/CaseStudies";
import PricingCRUD from "./Page/Pricing/Pricing";
import TechStack from "./Page/TechStack/TechStack";
import AuditLogs from "./Page/AuditLogs/AuditLogs";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── PUBLIC ROUTES ─── */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        {/* ─── PROTECTED ADMIN ROUTES ─── */}
        <Route element={<RouteProtector />}>
          <Route element={<Layout />}>

            {/* Main Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 1. Blog Engine */}
            <Route path="/dashboard/blog" element={<ManagePost />} />
            <Route path="/dashboard/blog/new" element={<AddPost />} />
            <Route path="/dashboard/categories" element={<CategoriesPage />} />
            <Route path="/dashboard/comments" element={<CommentsPage />} />
            <Route path="/dashboard/content-decay" element={<ContentDecay />} />

            {/* 2. Core Business */}
            <Route path="/dashboard/services" element={<Services />} />
            <Route path="/dashboard/pricing" element={<PricingCRUD />} />
            <Route path="/dashboard/tech-stack" element={<TechStack />} />

            {/* 3. Our Work */}
            <Route path="/dashboard/portfolio" element={<Portfolio />} />
            <Route path="/dashboard/case-studies" element={<CaseStudiesCRUD />} />
            <Route path="/dashboard/testimonials" element={<HomeTestimonials />} />

            {/* 4. Company & Team */}
            <Route path="/dashboard/team" element={<TeamsPage />} />
            <Route path="/dashboard/users" element={<UsersPage />} />

            {/* 5. Sales & Audience */}
            <Route path="/dashboard/leads" element={<LeadsPage />} />
            <Route path="/dashboard/messages" element={<KravionaMessages />} />
            <Route path="/dashboard/newsletters" element={<NewsletterSection />} />
            <Route path="/dashboard/campaigns" element={<CampaignsPage />} />

            {/* 6. Media & Notifications */}
            <Route path="/dashboard/media" element={<MediaLibrary />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />

            {/* 7. Home Page Settings */}
            <Route path="/dashboard/home/hero"          element={<HomeHero />} />
            <Route path="/dashboard/home/stats"         element={<HomeStats />} />
            <Route path="/dashboard/home/services"      element={<HomeServicesShowcase />} />
            <Route path="/dashboard/home/why-us"        element={<HomeWhyUs />} />
            <Route path="/dashboard/home/who-we-are"    element={<HomeWhoWeAre />} />
            <Route path="/dashboard/home/tech-stack"    element={<HomeTechStack />} />
            <Route path="/dashboard/home/faqs"          element={<HomeFaqs />} />
            <Route path="/dashboard/home/blog-section"  element={<HomeBlogSection />} />
            <Route path="/dashboard/home/cta"           element={<HomeCta />} />
            <Route path="/dashboard/home/testimonials"  element={<HomeTestimonials />} />
            <Route path="/dashboard/home/newsletter"    element={<HomeNewsletter />} />

            {/* 8. Services Page Settings */}
            <Route path="/dashboard/services-page/hero"         element={<ServicesHero />} />
            <Route path="/dashboard/services-page/edge-cards"   element={<ServicesEdgeCards />} />
            <Route path="/dashboard/services-page/nav-config"   element={<ServicesNavConfig />} />
            <Route path="/dashboard/services-page/faqs"         element={<ServicesFaqs />} />
            <Route path="/dashboard/services-page/contact-form" element={<ServicesContactForm />} />

            {/* 9. About Page Settings */}
            <Route path="/dashboard/about/hero"   element={<AboutHero />} />
            <Route path="/dashboard/about/story"  element={<AboutStory />} />
            <Route path="/dashboard/about/quote"  element={<AboutQuote />} />
            <Route path="/dashboard/about/stats"  element={<AboutStats />} />
            <Route path="/dashboard/about/values" element={<AboutValues />} />
            <Route path="/dashboard/about/cta"    element={<AboutCta />} />

            {/* 10. Gallery / Portfolio Page Settings */}
            <Route path="/dashboard/gallery/hero"         element={<GalleryHero />} />
            <Route path="/dashboard/gallery/filters"      element={<GalleryFilters />} />
            <Route path="/dashboard/gallery/featured"     element={<GalleryFeatured />} />
            <Route path="/dashboard/gallery/testimonials" element={<GalleryTestimonials />} />

            {/* 11. Case Studies Settings */}
            <Route path="/dashboard/case-studies/hero"       element={<CaseStudiesHero />} />
            <Route path="/dashboard/case-studies/visibility" element={<CaseStudiesVisibility />} />
            <Route path="/dashboard/case-studies/notify"     element={<CaseStudiesNotify />} />

            {/* 12. Pricing Page Settings */}
            <Route path="/dashboard/pricing-page/hero"       element={<PricingHero />} />
            <Route path="/dashboard/pricing-page/visibility" element={<PricingVisibility />} />
            <Route path="/dashboard/pricing-page/billing"    element={<PricingBilling />} />
            <Route path="/dashboard/pricing-page/disclaimer" element={<PricingDisclaimer />} />
            <Route path="/dashboard/pricing-page/faqs"       element={<PricingFaqs />} />

            {/* 13. Contact Page Settings */}
            <Route path="/dashboard/contact/hero"        element={<ContactHero />} />
            <Route path="/dashboard/contact/info"        element={<ContactInfo />} />
            <Route path="/dashboard/contact/address"     element={<ContactAddress />} />
            <Route path="/dashboard/contact/form-config" element={<ContactFormConfig />} />
            <Route path="/dashboard/contact/auto-reply"  element={<ContactAutoReply />} />

            {/* 14. Blog Listing Page Settings */}
            <Route path="/dashboard/blog-page/hero"       element={<BlogHero />} />
            <Route path="/dashboard/blog-page/featured"   element={<BlogFeatured />} />
            <Route path="/dashboard/blog-page/pagination" element={<BlogPagination />} />

            {/* 15. Individual Service Pages */}
            <Route path="/dashboard/service-pages/mern-stack-development"       element={<ServicePageMern />} />
            <Route path="/dashboard/service-pages/full-stack-development"       element={<ServicePageFullStack />} />
            <Route path="/dashboard/service-pages/react-development"            element={<ServicePageReact />} />
            <Route path="/dashboard/service-pages/nodejs-development"           element={<ServicePageNode />} />
            <Route path="/dashboard/service-pages/backend-development"          element={<ServicePageBackend />} />
            <Route path="/dashboard/service-pages/api-development"              element={<ServicePageApi />} />
            <Route path="/dashboard/service-pages/database-architecture"        element={<ServicePageDatabase />} />
            <Route path="/dashboard/service-pages/saas-development"             element={<ServicePageSaas />} />
            <Route path="/dashboard/service-pages/technical-seo"                element={<ServicePageSeo />} />
            <Route path="/dashboard/service-pages/web-performance-optimization" element={<ServicePagePerf />} />
            <Route path="/dashboard/service-pages/ai-automation"                element={<ServicePageAi />} />

            {/* 16. Global Site Settings */}
            <Route path="/dashboard/global/brand"        element={<GlobalSettingsPage />} />
            <Route path="/dashboard/global/contact-info" element={<GlobalContactInfo />} />
            <Route path="/dashboard/global/address"      element={<GlobalAddress />} />
            <Route path="/dashboard/global/socials"      element={<GlobalSocials />} />
            <Route path="/dashboard/global/footer"       element={<GlobalFooter />} />
            <Route path="/dashboard/global/nav"          element={<GlobalNav />} />
            <Route path="/dashboard/global/newsletter"   element={<GlobalNewsletter />} />
            <Route path="/dashboard/global/analytics"    element={<GlobalAnalytics />} />
            <Route path="/dashboard/global/maintenance"  element={<GlobalMaintenance />} />

            {/* 17. SEO & Meta */}
            <Route path="/dashboard/seo/defaults"     element={<SeoDefaults />} />
            <Route path="/dashboard/seo/og-image"     element={<SeoOgImage />} />
            <Route path="/dashboard/seo/robots"       element={<RobotsPage />} />
            <Route path="/dashboard/seo/schema"       element={<SchemaJsonLD />} />
            <Route path="/dashboard/seo/sitemap"      element={<SitemapConfig />} />
            <Route path="/dashboard/seo/verification" element={<SiteVerification />} />
            <Route path="/dashboard/seo/canonicals"   element={<CanonicalRules />} />
            <Route path="/dashboard/seo/noindex"      element={<NoIndexPages />} />

            {/* 18. Logs & Security */}
            <Route path="/dashboard/audit-logs" element={<AuditLogs />} />
            <Route path="/dashboard/settings"   element={<SettingsPage />} />

          </Route>
        </Route>

        {/* ─── CATCH-ALL / FALLBACK ─── */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
