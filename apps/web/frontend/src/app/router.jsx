import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../pages/landing/LandingPage";
import NotFoundPage from "./NotFoundPage";

import PracticeModesPage from "../pages/practice/PracticeModesPage";
import PerformanceAnalyticsPage from "../pages/analytics/PerformanceAnalyticsPage";
import HowItWorksPage from "../pages/work/HowItsWork";
import MarketInsight from "../pages/Market/MarketInsight";
import KnowledgeVault from "../pages/Knowledge/KnowledgeVault";
import Roadmap from "../pages/roadmap/Roadmap";

import DeveloperSandbox from "../pages/developer/DeveloperSandbox";
import TechnicalCollaboration from "../pages/developer/TechnicalCollaboration";
import BusinessEnquiry from "../pages/developer/BusinessEnquiry";

import EnterpriseSolution from "../pages/business/EnterpriseSolutions";
import Strategic from "../pages/business/Strategic";
import BusinessContact from "../pages/business/BusinessContact";

import OurMission from "../pages/landing/footer/OurMission";
import Contact from "../pages/landing/footer/Contact";
import PrivacyPolicy from "../pages/landing/footer/PrivacyPolicy";
import CookieSettings from "../pages/landing/footer/CookieSettings";
import TermsOfUse from "../pages/landing/footer/TermsOfUse";
import Accessibility from "../pages/landing/footer/Accessibility";
import HelpCenter from "../pages/landing/footer/HelpCenter";
import Cookie from "../pages/landing/footer/CookiePolicy";
import Security from "../pages/landing/footer/Security";
import FAQ from "../pages/landing/FAQ";

import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";

import Dashboard from "../pages/Dashboard";
import MainHome from "../pages/dashboard/MainHome";
import DashboardPlaceholder from "../pages/dashboard/DashboardPlaceholder";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/practice-modes",
    element: <PracticeModesPage />,
  },
  {
    path: "/performance-Analytics",
    element: <PerformanceAnalyticsPage />,
  },
  {
    path: "/howItsWorkPage",
    element: <HowItWorksPage />,
  },
  {
    path: "/marketInsight",
    element: <MarketInsight />,
  },
  {
    path: "/knowledgeVault",
    element: <KnowledgeVault />,
  },
  {
    path: "/roadmap",
    element: <Roadmap />,
  },
  {
    path: "/developerSandbox",
    element: <DeveloperSandbox />,
  },
  {
    path: "/technicalCollaboration",
    element: <TechnicalCollaboration />,
  },
  {
    path: "/businessEnquiry",
    element: <BusinessEnquiry />,
  },
  {
    path: "/enterpriseSolution",
    element: <EnterpriseSolution />,
  },
  {
    path: "/strategic",
    element: <Strategic />,
  },
  {
    path: "/businessContact",
    element: <BusinessContact />,
  },
  {
    path: "/ourMission",
    element: <OurMission />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/privacyPolicy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/cookieSetting",
    element: <CookieSettings />,
  },
  {
    path: "/termsOfUse",
    element: <TermsOfUse />,
  },
  {
    path: "/accessibility",
    element: <Accessibility />,
  },
  {
    path: "/helpCenter",
    element: <HelpCenter />,
  },
  {
    path: "/cookies",
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
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path:"/forgetPassword",
    element:<ForgotPassword/>
  },
  {
    path:"/verifyOtp",
    element:<VerifyOtp/>
  },

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
      element: (
        <MarketInsight />
      ),
    },
    {
      path: "rooms",
      element: (
        <DashboardPlaceholder
          eyebrow="PRACTICE ARENA"
          title="Trading Rooms"
          description="Create a practice room, join a challenge, and compete in a simulated market environment."
        />
      ),
    },
    {
      path: "friends",
      element: (
        <DashboardPlaceholder
          eyebrow="YOUR NETWORK"
          title="Friends"
          description="Find friends, manage invitations, and get ready for your next trading challenge."
        />
      ),
    },
    {
      path: "learn",
      element: <KnowledgeVault />,
    },
    {
      path: "learn/roadmap",
      element: <Roadmap />,
    },
    {
      path: "news",
      element: (
        <DashboardPlaceholder
          eyebrow="MARKET INTELLIGENCE"
          title="Market News"
          description="A dedicated space for market headlines and educational insights. News integration will be added later."
        />
      ),
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
          title="Your Profile"
          description="Your public profile and trading practice details will appear here."
        />
      ),
    },
    {
      path: "settings",
      element: (
        <DashboardPlaceholder
          title="Settings"
          description="Manage your account preferences and dashboard settings."
        />
      ),
    },
  ],
},
]);
