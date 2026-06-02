import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiLayers, FiGrid, FiBriefcase, FiDollarSign,
  FiUsers, FiMessageSquare, FiLogOut, FiMail, FiInbox,
  FiEdit3, FiLayout, FiCpu, FiHelpCircle, FiLink, FiSearch,
  FiInfo, FiStar, FiImage, FiBell, FiTag, FiSettings,
  FiClipboard, FiRadio, FiUserCheck, FiPhone, FiMap,
  FiGlobe, FiTwitter, FiLinkedin, FiFacebook, FiFileText,
  FiShield, FiToggleLeft, FiChevronDown, FiChevronRight,
  FiZap, FiTrendingUp, FiBook, FiAward, FiBarChart2,
  FiPackage, FiDatabase, FiCloud, FiCode, FiMonitor,
  FiRepeat, FiAlertCircle, FiCheckSquare, FiSliders
} from 'react-icons/fi';

const Sidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState({});

  const toggle = (title) =>
    setCollapsed(prev => ({ ...prev, [title]: !prev[title] }));

  const menuGroups = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> }
      ]
    },

    // ─── BLOG ENGINE ─────────────────────────────────────────────
    {
      title: 'Blog Engine',
      items: [
        { name: 'Manage Posts',    path: '/dashboard/blog',           icon: <FiEdit3 />,  badge: 'existing' },
        { name: 'Categories',      path: '/dashboard/categories',     icon: <FiTag />,    badge: 'existing' },
        { name: 'Comments',        path: '/dashboard/comments',       icon: <FiMessageSquare />, badge: 'existing' },
        { name: 'Content Decay',   path: '/dashboard/content-decay',  icon: <FiAlertCircle />,   badge: 'existing' },
      ]
    },

    // ─── CORE BUSINESS ───────────────────────────────────────────
    {
      title: 'Core Business',
      items: [
        { name: 'Services',        path: '/dashboard/services',       icon: <FiLayers /> },
        { name: 'Pricing Plans',   path: '/dashboard/pricing',        icon: <FiDollarSign /> },
        { name: 'Tech Stack',      path: '/dashboard/tech-stack',     icon: <FiCpu /> },
      ]
    },

    // ─── OUR WORK ────────────────────────────────────────────────
    {
      title: 'Our Work',
      items: [
        { name: 'Portfolio / Gallery', path: '/dashboard/portfolio',     icon: <FiGrid /> },
        { name: 'Case Studies',        path: '/dashboard/case-studies',  icon: <FiBriefcase /> },
        { name: 'Testimonials',        path: '/dashboard/testimonials',  icon: <FiStar />,      badge: 'existing' },
      ]
    },

    // ─── COMPANY & TEAM ──────────────────────────────────────────
    {
      title: 'Company & Team',
      items: [
        { name: 'Team Members',    path: '/dashboard/team',             icon: <FiUsers />,     badge: 'existing' },
        { name: 'Users & Admins',  path: '/dashboard/users',            icon: <FiUserCheck />, badge: 'existing' },
      ]
    },

    // ─── SALES & AUDIENCE ────────────────────────────────────────
    {
      title: 'Sales & Audience',
      items: [
        { name: 'Contact Leads',   path: '/dashboard/leads',            icon: <FiInbox />,         badge: 'existing' },
        { name: 'Messages',        path: '/dashboard/messages',         icon: <FiMessageSquare />, badge: 'existing' },
        { name: 'Newsletter Subs', path: '/dashboard/newsletters',      icon: <FiMail />,          badge: 'existing' },
        { name: 'Campaigns',       path: '/dashboard/campaigns',        icon: <FiRadio />,         badge: 'existing' },
      ]
    },

    // ─── MEDIA & NOTIFICATIONS ───────────────────────────────────
    {
      title: 'Media & Notifications',
      items: [
        { name: 'Media Library',   path: '/dashboard/media',            icon: <FiImage />, badge: 'existing' },
        { name: 'Notifications',   path: '/dashboard/notifications',    icon: <FiBell />,  badge: 'existing' },
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // PAGE-BY-PAGE SITE CONFIGURATION
    // ═══════════════════════════════════════════════════════════════

    // ── HOME PAGE ────────────────────────────────────────────────
    {
      title: 'Home Page Settings',
      collapsible: true,
      items: [
        { name: 'Hero Section',           path: '/dashboard/home/hero',          icon: <FiMonitor /> },
        { name: 'Stats Bar',              path: '/dashboard/home/stats',         icon: <FiBarChart2 /> },
        { name: 'Services Showcase',      path: '/dashboard/home/services',      icon: <FiLayers /> },
        { name: 'Why Kraviona Section',   path: '/dashboard/home/why-us',        icon: <FiCheckSquare /> },
        { name: 'Who We Are Section',     path: '/dashboard/home/who-we-are',    icon: <FiInfo /> },
        { name: 'Tech Stack Section',     path: '/dashboard/home/tech-stack',    icon: <FiCpu /> },
        { name: 'Home FAQs',              path: '/dashboard/home/faqs',          icon: <FiHelpCircle /> },
        { name: 'Latest Posts Section',   path: '/dashboard/home/blog-section',  icon: <FiEdit3 /> },
        { name: 'CTA / Consultation',     path: '/dashboard/home/cta',           icon: <FiZap /> },
        { name: 'Testimonials Section',   path: '/dashboard/home/testimonials',  icon: <FiStar /> },
        { name: 'Newsletter Section',     path: '/dashboard/home/newsletter',    icon: <FiMail /> },
      ]
    },

    // ── SERVICES PAGE ────────────────────────────────────────────
    {
      title: 'Services Page Settings',
      collapsible: true,
      items: [
        { name: 'Page Hero',              path: '/dashboard/services-page/hero',         icon: <FiMonitor /> },
        { name: 'Kraviona Edge Cards',    path: '/dashboard/services-page/edge-cards',   icon: <FiZap /> },
        { name: 'All 11 Services CRUD',   path: '/dashboard/services',                   icon: <FiLayers /> },
        { name: 'Services Nav Dropdown',  path: '/dashboard/services-page/nav-config',   icon: <FiSliders /> },
        { name: 'Service Page FAQs',      path: '/dashboard/services-page/faqs',         icon: <FiHelpCircle /> },
        { name: 'Contact Form (Services)',path: '/dashboard/services-page/contact-form', icon: <FiPhone /> },
      ]
    },

    // ── ABOUT PAGE ───────────────────────────────────────────────
    {
      title: 'About Page Settings',
      collapsible: true,
      items: [
        { name: 'Hero & Tagline',         path: '/dashboard/about/hero',         icon: <FiMonitor /> },
        { name: 'Company Story',          path: '/dashboard/about/story',        icon: <FiBook /> },
        { name: 'Story Quote',            path: '/dashboard/about/quote',        icon: <FiFileText /> },
        { name: 'About Stats',            path: '/dashboard/about/stats',        icon: <FiBarChart2 /> },
        { name: 'Core Values',            path: '/dashboard/about/values',       icon: <FiAward /> },
        { name: 'Team Section',           path: '/dashboard/team',               icon: <FiUsers />,      badge: 'existing' },
        { name: 'About CTA Section',      path: '/dashboard/about/cta',          icon: <FiZap /> },
      ]
    },

    // ── GALLERY / PORTFOLIO PAGE ─────────────────────────────────
    {
      title: 'Gallery Page Settings',
      collapsible: true,
      items: [
        { name: 'Page Hero',              path: '/dashboard/gallery/hero',       icon: <FiMonitor /> },
        { name: 'Projects CRUD',          path: '/dashboard/portfolio',          icon: <FiGrid /> },
        { name: 'Filter Categories',      path: '/dashboard/gallery/filters',    icon: <FiSliders /> },
        { name: 'Featured Projects',      path: '/dashboard/gallery/featured',   icon: <FiStar /> },
        { name: 'Gallery Testimonials',   path: '/dashboard/gallery/testimonials',icon: <FiMessageSquare /> },
      ]
    },

    // ── CASE STUDIES PAGE ────────────────────────────────────────
    {
      title: 'Case Studies Settings',
      collapsible: true,
      items: [
        { name: 'Page Hero',              path: '/dashboard/case-studies/hero',       icon: <FiMonitor /> },
        { name: 'Case Studies CRUD',      path: '/dashboard/case-studies',            icon: <FiBriefcase /> },
        { name: 'Coming Soon Toggle',     path: '/dashboard/case-studies/visibility', icon: <FiToggleLeft /> },
        { name: 'Notify Me Form',         path: '/dashboard/case-studies/notify',     icon: <FiBell /> },
      ]
    },

    // ── PRICING PAGE ─────────────────────────────────────────────
    {
      title: 'Pricing Page Settings',
      collapsible: true,
      items: [
        { name: 'Page Hero',              path: '/dashboard/pricing-page/hero',       icon: <FiMonitor /> },
        { name: 'Pricing Plans CRUD',     path: '/dashboard/pricing',                 icon: <FiDollarSign /> },
        { name: 'Coming Soon Toggle',     path: '/dashboard/pricing-page/visibility', icon: <FiToggleLeft /> },
        { name: 'Billing Toggle Config',  path: '/dashboard/pricing-page/billing',    icon: <FiRepeat /> },
        { name: 'Pricing Disclaimer',     path: '/dashboard/pricing-page/disclaimer', icon: <FiFileText /> },
        { name: 'Pricing FAQs',           path: '/dashboard/pricing-page/faqs',       icon: <FiHelpCircle /> },
      ]
    },

    // ── CONTACT PAGE ─────────────────────────────────────────────
    {
      title: 'Contact Page Settings',
      collapsible: true,
      items: [
        { name: 'Page Hero',              path: '/dashboard/contact/hero',            icon: <FiMonitor /> },
        { name: 'Contact Info',           path: '/dashboard/contact/info',            icon: <FiPhone /> },
        { name: 'Office Address',         path: '/dashboard/contact/address',         icon: <FiMap /> },
        { name: 'Contact Form Config',    path: '/dashboard/contact/form-config',     icon: <FiFileText /> },
        { name: 'All Submissions',        path: '/dashboard/leads',                   icon: <FiInbox />,      badge: 'existing' },
        { name: 'Auto-Reply Email',       path: '/dashboard/contact/auto-reply',      icon: <FiMail /> },
      ]
    },

    // ── BLOG LISTING PAGE ────────────────────────────────────────
    {
      title: 'Blog Listing Page',
      collapsible: true,
      items: [
        { name: 'Page Hero',              path: '/dashboard/blog-page/hero',          icon: <FiMonitor /> },
        { name: 'Blog Categories Config', path: '/dashboard/categories',              icon: <FiTag />,        badge: 'existing' },
        { name: 'Featured Post Picker',   path: '/dashboard/blog-page/featured',      icon: <FiStar /> },
        { name: 'Posts Per Page',         path: '/dashboard/blog-page/pagination',    icon: <FiSliders /> },
      ]
    },

    // ── INDIVIDUAL SERVICE PAGES ─────────────────────────────────
    {
      title: 'Individual Service Pages',
      collapsible: true,
      items: [
        { name: 'MERN Stack Page',        path: '/dashboard/service-pages/mern-stack-development',      icon: <FiCode /> },
        { name: 'Full-Stack Page',        path: '/dashboard/service-pages/full-stack-development',      icon: <FiCode /> },
        { name: 'React.js Page',          path: '/dashboard/service-pages/react-development',           icon: <FiCode /> },
        { name: 'Node.js Page',           path: '/dashboard/service-pages/nodejs-development',          icon: <FiCode /> },
        { name: 'Backend Dev Page',       path: '/dashboard/service-pages/backend-development',         icon: <FiCloud /> },
        { name: 'API Dev Page',           path: '/dashboard/service-pages/api-development',             icon: <FiCloud /> },
        { name: 'Database Arch Page',     path: '/dashboard/service-pages/database-architecture',       icon: <FiDatabase /> },
        { name: 'SaaS Dev Page',          path: '/dashboard/service-pages/saas-development',            icon: <FiPackage /> },
        { name: 'Technical SEO Page',     path: '/dashboard/service-pages/technical-seo',               icon: <FiTrendingUp /> },
        { name: 'Web Performance Page',   path: '/dashboard/service-pages/web-performance-optimization',icon: <FiZap /> },
        { name: 'AI Automation Page',     path: '/dashboard/service-pages/ai-automation',               icon: <FiCpu /> },
      ]
    },

    // ─── GLOBAL SITE SETTINGS ────────────────────────────────────
    {
      title: 'Global Site Settings',
      collapsible: true,
      items: [
        { name: 'Site Name & Tagline',    path: '/dashboard/global/brand',            icon: <FiGlobe /> },
        { name: 'Phone & Email',          path: '/dashboard/global/contact-info',      icon: <FiPhone /> },
        { name: 'Office Address',         path: '/dashboard/global/address',           icon: <FiMap /> },
        { name: 'Social Links',           path: '/dashboard/global/socials',           icon: <FiLink /> },
        { name: 'Footer Config',          path: '/dashboard/global/footer',            icon: <FiLayout /> },
        { name: 'Navigation Config',      path: '/dashboard/global/nav',               icon: <FiSliders /> },
        { name: 'Newsletter Section',     path: '/dashboard/global/newsletter',        icon: <FiMail /> },
        { name: 'Google Analytics / GTM', path: '/dashboard/global/analytics',         icon: <FiBarChart2 /> },
        { name: 'Maintenance Mode',       path: '/dashboard/global/maintenance',       icon: <FiToggleLeft /> },
      ]
    },

    // ─── SEO & META ──────────────────────────────────────────────
    {
      title: 'SEO & Meta',
      collapsible: true,
      items: [
        { name: 'Default Meta Tags',      path: '/dashboard/seo/defaults',            icon: <FiSearch /> },
        { name: 'OG Image Default',       path: '/dashboard/seo/og-image',            icon: <FiImage /> },
        { name: 'Robots.txt Editor',      path: '/dashboard/seo/robots',              icon: <FiFileText /> },
        { name: 'Schema / JSON-LD',       path: '/dashboard/seo/schema',              icon: <FiCode /> },
        { name: 'Sitemap Settings',       path: '/dashboard/seo/sitemap',             icon: <FiGlobe /> },
        { name: 'Google Verification',    path: '/dashboard/seo/verification',        icon: <FiCheckSquare /> },
        { name: 'Canonical Rules',        path: '/dashboard/seo/canonicals',          icon: <FiLink /> },
        { name: 'No-Index Pages',         path: '/dashboard/seo/noindex',             icon: <FiShield /> },
      ]
    },

    // ─── LOGS & SECURITY ─────────────────────────────────────────
    {
      title: 'Logs & Security',
      items: [
        { name: 'Audit Logs',             path: '/dashboard/audit-logs',              icon: <FiClipboard />,  badge: 'existing' },
        { name: 'Settings',               path: '/dashboard/settings',                icon: <FiSettings />,   badge: 'existing' },
      ]
    },
  ];

  return (
    <div className="h-screen w-64 bg-[#235056] text-white flex flex-col shadow-2xl flex-shrink-0">

      {/* Header */}
      <div className="p-5 flex items-center gap-3 border-b border-white/10 flex-shrink-0">
        <img
          src="/logo.avif"
          alt="Kraviona Logo"
          className="w-9 h-9 object-contain bg-white rounded-md p-1"
        />
        <h1 className="text-base font-medium uppercase tracking-widest text-[#f2c695]">
          Kraviona
        </h1>
      </div>

      {/* Scrollable Nav — scrollbar hidden */}
      <div
        className="flex-1 overflow-y-auto py-4 px-3 pb-24"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>

        {menuGroups.map((group, gi) => {
          const isCollapsible = group.collapsible;
          const isOpen = !isCollapsible || !collapsed[group.title];

          return (
            <div key={gi} className="mb-4">
              {gi > 0 && <div className="border-t border-white/[0.08] mb-3" />}

              {/* Group Header */}
              <div
                className={`flex items-center justify-between px-4 mb-1 ${isCollapsible ? 'cursor-pointer select-none' : ''}`}
                onClick={() => isCollapsible && toggle(group.title)}
              >
                <p className="text-[9px] font-medium text-[#f2c695] uppercase tracking-[0.18em] opacity-75">
                  {group.title}
                </p>
                {isCollapsible && (
                  <span className="text-[#f2c695] opacity-60">
                    {isOpen ? <FiChevronDown size={11} /> : <FiChevronRight size={11} />}
                  </span>
                )}
              </div>

              {/* Items */}
              {isOpen && (
                <div className="space-y-0.5">
                  {group.items.map((item, ii) => (
                    <NavLink
                      key={ii}
                      to={item.path}
                      end={item.path === '/dashboard'}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-4 py-1.5 rounded-lg transition-all duration-150 ${
                          isActive
                            ? 'bg-[#d26c51] text-white'
                            : 'text-gray-300 hover:bg-[#1a3d42] hover:text-white'
                        }`
                      }
                    >
                      <span className="text-sm opacity-85 flex-shrink-0">{item.icon}</span>
                      <span className="text-[12px] tracking-wide flex-1 leading-snug">{item.name}</span>
                      
                      {/* Only 'existing' checkmark badge is kept. 'New' badge has been removed. */}
                      {item.badge === 'existing' && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50 flex-shrink-0">
                          ✓
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 flex-shrink-0 bg-[#1a3d42]/80">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-red-500/80 hover:bg-red-500 transition-all duration-200 text-xs uppercase tracking-wider">
          <FiLogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;