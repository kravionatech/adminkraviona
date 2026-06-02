import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Middlewares & Layout
import RouteProtector from "./Middleware/RouteProtector";
import PublicRoute from "./Middleware/PublicRoute";
import Layout from "./Components/Layout/Layout"; 

// Existing Pages
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

// ─── TEMPORARY PLACEHOLDER COMPONENT ──────────────────────────────
// Ye un routes ke liye hai jinke components abhi aane baaki hain.
// Jaise hi aap naya page banayein, isko actual component se replace kar dein.
const PlaceholderPage = ({ title }) => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500 mt-2">This page is under construction. Please create a component for this route.</p>
  </div>
);

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
            <Route path="/dashboard/services" element={<Services  />} />
            <Route path="/dashboard/pricing" element={<PlaceholderPage title="Pricing Plans" />} />
            <Route path="/dashboard/tech-stack" element={<PlaceholderPage title="Tech Stack" />} />

            {/* 3. Our Work */}
            <Route path="/dashboard/portfolio" element={<PlaceholderPage title="Portfolio / Gallery" />} />
            <Route path="/dashboard/case-studies" element={<PlaceholderPage title="Case Studies" />} />
            <Route path="/dashboard/testimonials" element={<PlaceholderPage title="Testimonials" />} />

            {/* 4. Company & Team */}
            <Route path="/dashboard/team" element={<TeamsPage />} />
            <Route path="/dashboard/users" element={<UsersPage />} />

            {/* 5. Sales & Audience */}
            <Route path="/dashboard/leads" element={<LeadsPage />} />
            <Route path="/dashboard/messages" element={<KravionaMessages />} />
            <Route path="/dashboard/newsletters" element={<NewsletterSection />} />
            <Route path="/dashboard/campaigns" element={<CampaignsPage/>} />

            {/* 6. Media & Notifications */}
            <Route path="/dashboard/media" element={<MediaLibrary />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />

            {/* 7. Home Page Settings */}
            <Route path="/dashboard/home/hero" element={<PlaceholderPage title="Home: Hero Section" />} />
            <Route path="/dashboard/home/stats" element={<PlaceholderPage title="Home: Stats Bar" />} />
            <Route path="/dashboard/home/services" element={<PlaceholderPage title="Home: Services Showcase" />} />
            <Route path="/dashboard/home/why-us" element={<PlaceholderPage title="Home: Why Kraviona" />} />
            <Route path="/dashboard/home/who-we-are" element={<PlaceholderPage title="Home: Who We Are" />} />
            <Route path="/dashboard/home/tech-stack" element={<PlaceholderPage title="Home: Tech Stack Setup" />} />
            <Route path="/dashboard/home/faqs" element={<PlaceholderPage title="Home: FAQs" />} />
            <Route path="/dashboard/home/blog-section" element={<PlaceholderPage title="Home: Latest Posts Section" />} />
            <Route path="/dashboard/home/cta" element={<PlaceholderPage title="Home: CTA / Consultation" />} />
            <Route path="/dashboard/home/testimonials" element={<PlaceholderPage title="Home: Testimonials Selection" />} />
            <Route path="/dashboard/home/newsletter" element={<PlaceholderPage title="Home: Newsletter Section" />} />

            {/* 8. Services Page Settings */}
            <Route path="/dashboard/services-page/hero" element={<PlaceholderPage title="Services Page: Hero" />} />
            <Route path="/dashboard/services-page/edge-cards" element={<PlaceholderPage title="Services Page: Edge Cards" />} />
            <Route path="/dashboard/services-page/nav-config" element={<PlaceholderPage title="Services Page: Nav Dropdown" />} />
            <Route path="/dashboard/services-page/faqs" element={<PlaceholderPage title="Services Page: FAQs" />} />
            <Route path="/dashboard/services-page/contact-form" element={<PlaceholderPage title="Services Page: Contact Form" />} />

            {/* 9. About Page Settings */}
            <Route path="/dashboard/about/hero" element={<PlaceholderPage title="About Page: Hero" />} />
            <Route path="/dashboard/about/story" element={<PlaceholderPage title="About Page: Company Story" />} />
            <Route path="/dashboard/about/quote" element={<PlaceholderPage title="About Page: Story Quote" />} />
            <Route path="/dashboard/about/stats" element={<PlaceholderPage title="About Page: Stats" />} />
            <Route path="/dashboard/about/values" element={<PlaceholderPage title="About Page: Core Values" />} />
            <Route path="/dashboard/about/cta" element={<PlaceholderPage title="About Page: CTA Section" />} />

            {/* 10. Gallery / Portfolio Page Settings */}
            <Route path="/dashboard/gallery/hero" element={<PlaceholderPage title="Gallery Page: Hero" />} />
            <Route path="/dashboard/gallery/filters" element={<PlaceholderPage title="Gallery Page: Category Filters" />} />
            <Route path="/dashboard/gallery/featured" element={<PlaceholderPage title="Gallery Page: Featured Projects" />} />
            <Route path="/dashboard/gallery/testimonials" element={<PlaceholderPage title="Gallery Page: Testimonials" />} />

            {/* 11. Case Studies Settings */}
            <Route path="/dashboard/case-studies/hero" element={<PlaceholderPage title="Case Studies: Hero" />} />
            <Route path="/dashboard/case-studies/visibility" element={<PlaceholderPage title="Case Studies: Visibility Toggle" />} />
            <Route path="/dashboard/case-studies/notify" element={<PlaceholderPage title="Case Studies: Notify Me Form" />} />

            {/* 12. Pricing Page Settings */}
            <Route path="/dashboard/pricing-page/hero" element={<PlaceholderPage title="Pricing Page: Hero" />} />
            <Route path="/dashboard/pricing-page/visibility" element={<PlaceholderPage title="Pricing Page: Visibility" />} />
            <Route path="/dashboard/pricing-page/billing" element={<PlaceholderPage title="Pricing Page: Billing Toggle" />} />
            <Route path="/dashboard/pricing-page/disclaimer" element={<PlaceholderPage title="Pricing Page: Disclaimer" />} />
            <Route path="/dashboard/pricing-page/faqs" element={<PlaceholderPage title="Pricing Page: FAQs" />} />

            {/* 13. Contact Page Settings */}
            <Route path="/dashboard/contact/hero" element={<PlaceholderPage title="Contact Page: Hero" />} />
            <Route path="/dashboard/contact/info" element={<PlaceholderPage title="Contact Page: Information" />} />
            <Route path="/dashboard/contact/address" element={<PlaceholderPage title="Contact Page: Address Map" />} />
            <Route path="/dashboard/contact/form-config" element={<PlaceholderPage title="Contact Page: Form Config" />} />
            <Route path="/dashboard/contact/auto-reply" element={<PlaceholderPage title="Contact Page: Auto-Reply Email" />} />

            {/* 14. Blog Listing Page Settings */}
            <Route path="/dashboard/blog-page/hero" element={<PlaceholderPage title="Blog Listing: Hero" />} />
            <Route path="/dashboard/blog-page/featured" element={<PlaceholderPage title="Blog Listing: Featured Picker" />} />
            <Route path="/dashboard/blog-page/pagination" element={<PlaceholderPage title="Blog Listing: Pagination Limit" />} />

            {/* 15. Individual Service Pages */}
            <Route path="/dashboard/service-pages/mern-stack-development" element={<PlaceholderPage title="Service: MERN Stack" />} />
            <Route path="/dashboard/service-pages/full-stack-development" element={<PlaceholderPage title="Service: Full Stack" />} />
            <Route path="/dashboard/service-pages/react-development" element={<PlaceholderPage title="Service: React.js" />} />
            <Route path="/dashboard/service-pages/nodejs-development" element={<PlaceholderPage title="Service: Node.js" />} />
            <Route path="/dashboard/service-pages/backend-development" element={<PlaceholderPage title="Service: Backend Dev" />} />
            <Route path="/dashboard/service-pages/api-development" element={<PlaceholderPage title="Service: API Dev" />} />
            <Route path="/dashboard/service-pages/database-architecture" element={<PlaceholderPage title="Service: Database Arch" />} />
            <Route path="/dashboard/service-pages/saas-development" element={<PlaceholderPage title="Service: SaaS Dev" />} />
            <Route path="/dashboard/service-pages/technical-seo" element={<PlaceholderPage title="Service: Technical SEO" />} />
            <Route path="/dashboard/service-pages/web-performance-optimization" element={<PlaceholderPage title="Service: Web Performance" />} />
            <Route path="/dashboard/service-pages/ai-automation" element={<PlaceholderPage title="Service: AI Automation" />} />

            {/* 16. Global Site Settings */}
            <Route path="/dashboard/global/brand" element={<GlobalSettingsPage/>} />
            <Route path="/dashboard/global/contact-info" element={<PlaceholderPage title="Global: Contact Info" />} />
            <Route path="/dashboard/global/address" element={<PlaceholderPage title="Global: Office Address" />} />
            <Route path="/dashboard/global/socials" element={<PlaceholderPage title="Global: Social Links" />} />
            <Route path="/dashboard/global/footer" element={<PlaceholderPage title="Global: Footer Setup" />} />
            <Route path="/dashboard/global/nav" element={<PlaceholderPage title="Global: Navigation Setup" />} />
            <Route path="/dashboard/global/newsletter" element={<PlaceholderPage title="Global: Newsletter Setup" />} />
            <Route path="/dashboard/global/analytics" element={<PlaceholderPage title="Global: Analytics Scripts" />} />
            <Route path="/dashboard/global/maintenance" element={<PlaceholderPage title="Global: Maintenance Mode" />} />

            {/* 17. SEO & Meta */}
            <Route path="/dashboard/seo/defaults" element={<PlaceholderPage title="SEO: Default Meta Tags" />} />
            <Route path="/dashboard/seo/og-image" element={<PlaceholderPage title="SEO: Default OG Image" />} />
            <Route path="/dashboard/seo/robots" element={<PlaceholderPage title="SEO: Robots.txt" />} />
            <Route path="/dashboard/seo/schema" element={<PlaceholderPage title="SEO: Schema JSON-LD" />} />
            <Route path="/dashboard/seo/sitemap" element={<PlaceholderPage title="SEO: Sitemap Config" />} />
            <Route path="/dashboard/seo/verification" element={<PlaceholderPage title="SEO: Site Verification" />} />
            <Route path="/dashboard/seo/canonicals" element={<PlaceholderPage title="SEO: Canonical Rules" />} />
            <Route path="/dashboard/seo/noindex" element={<PlaceholderPage title="SEO: No-Index Pages" />} />

            {/* 18. Logs & Security */}
            <Route path="/dashboard/audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
            <Route path="/dashboard/settings" element={<PlaceholderPage title="System Settings" />} />

          </Route>
        </Route>

        {/* ─── CATCH-ALL / FALLBACK ─── */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;