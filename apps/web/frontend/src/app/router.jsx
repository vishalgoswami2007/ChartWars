
import { createBrowserRouter } from "react-router-dom";

// Landing
import LandingPage from "../pages/landing/LandingPage";
import NotFoundPage from "../pages/NotFoundPage";

// Public feature pages
import PracticeModesPage from "../pages/work/PracticeModesPage";
import PerformanceAnalyticsPage from "../pages/work/PerformanceAnalyticsPage";
import HowItWorksPage from "../pages/work/HowItsWork";
import MarketInsight from "../pages/Market/MarketInsight";
import KnowledgeVault from "../pages/learn/KnowledgeVault";
import Roadmap from "../pages/learn/Roadmap";

// Developer pages
import DeveloperSandbox from "../pages/developer/DeveloperSandbox";
import TechnicalCollaboration from "../pages/developer/TechnicalCollaboration";
import BusinessEnquiry from "../pages/developer/BusinessEnquiry";

// Business pages
import EnterpriseSolution from "../pages/business/EnterpriseSolution";
import Strategic from "../pages/business/Strategic";
import BusinessContact from "../pages/business/BusinessContact";

// Information pages
import OurMission from "../pages/info/OurMission";
import Contact from "../pages/info/Contact";
import PrivacyPolicy from "../pages/info/PrivacyPolicy";
import CookieSettings from "../pages/info/CookieSettings";
import TermsOfUse from "../pages/info/TermsOfUse";
import Accessibility from "../pages/info/Accessibility";
import HelpCenter from "../pages/info/HelpCenter";
import Cookie from "../pages/info/Cookie";
import Security from "../pages/info/Security";
import FAQ from "../pages/info/FAQ";

// Authentication
import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";

// Dashboard
import Dashboard from "../pages/dashboard/Dashboard";
import MainHome from "../pages/dashboard/MainHome";
import DashboardPlaceholder from "../pages/dashboard/DashboardPlaceholder";
import MarketsPage from "../pages/dashboard/MarketsPage";
import CoinChartPage from "../pages/dashboard/markets/CoinChartPage";
import RoomsPage from "../pages/dashboard/rooms/RoomsPage";
import NewsPage from "../pages/dashboard/NewsPage";
import LearnPage from "../pages/dashboard/LearnPage";

export const router = createBrowserRouter([
  // Main website
  {
    path: "/",
    element: <LandingPage />,
  },

  // Authentication
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },

  // Dashboard and nested pages
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <MainHome />,
      },
      {
        path: "markets",
        element: <MarketsPage />,
      },
      {
        path: "markets/:coinId",
        element: <CoinChartPage />,
      },
      {
        path: "rooms",
        element: <RoomsPage />,
      },
      {
        path: "friends",
        element: (
          <DashboardPlaceholder
            eyebrow="YOUR NETWORK"
            title="Friends"
            description="Connect with other traders and prepare for practice sessions."
          />
        ),
      },
      {
        path: "learn",
        element: <LearnPage />,
      },
      {
        path: "learn/roadmap",
        element: <Roadmap />,
      },
      {
        path: "news",
        element: <NewsPage />,
      },
      {
        path: "practice-modes",
        element: <PracticeModesPage />,
      },
      {
        path: "analytics",
        element: <PerformanceAnalyticsPage />,
      },
      {
        path: "profile",
        element: (
          <DashboardPlaceholder
            eyebrow="YOUR ACCOUNT"
            title="Profile"
            description="Your profile and trading-practice identity."
          />
        ),
      },
      {
        path: "settings",
        element: (
          <DashboardPlaceholder
            eyebrow="PREFERENCES"
            title="Settings"
            description="Manage your account preferences and experience."
          />
        ),
      },
    ],
  },

  // Public feature pages
  {
    path: "/practice-modes",
    element: <PracticeModesPage />,
  },
  {
    path: "/performance-analytics",
    element: <PerformanceAnalyticsPage />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorksPage />,
  },
  {
    path: "/market-insight",
    element: <MarketInsight />,
  },
  {
    path: "/knowledge-vault",
    element: <KnowledgeVault />,
  },
  {
    path: "/roadmap",
    element: <Roadmap />,
  },

  // Developer pages
  {
    path: "/developer-sandbox",
    element: <DeveloperSandbox />,
  },
  {
    path: "/technical-collaboration",
    element: <TechnicalCollaboration />,
  },
  {
    path: "/business-enquiry",
    element: <BusinessEnquiry />,
  },

  // Business pages
  {
    path: "/enterprise-solution",
    element: <EnterpriseSolution />,
  },
  {
    path: "/strategic",
    element: <Strategic />,
  },
  {
    path: "/business-contact",
    element: <BusinessContact />,
  },

  // Information pages
  {
    path: "/our-mission",
    element: <OurMission />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/cookie-settings",
    element: <CookieSettings />,
  },
  {
    path: "/terms-of-use",
    element: <TermsOfUse />,
  },
  {
    path: "/accessibility",
    element: <Accessibility />,
  },
  {
    path: "/help-center",
    element: <HelpCenter />,
  },
  {
    path: "/cookie",
    element: <Cookie />,
  },
  {
    path: "/security",
    element: <Security />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },

  // Fallback
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
