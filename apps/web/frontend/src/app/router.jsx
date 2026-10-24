
import { createBrowserRouter } from "react-router-dom";

// Landing
import LandingPage from "../pages/landing/LandingPage";
import NotFoundPage from "../app/NotFoundPage";

// Public feature pages
import PracticeModesPage from "../pages/landing/sections/PracticeModes";
import PerformanceAnalyticsPage from "../pages/landing/sections/PerformanceAnalytics";
import HowItWorksPage from "../pages/landing/sections/HowItWorks";
import MarketInsight from "../pages/Market/MarketInsight";
import KnowledgeVault from "../pages/Knowledge/KnowledgeVault";
import Roadmap from "../pages/roadmap/Roadmap";

// Developer pages
import DeveloperSandbox from "../pages/developer/DeveloperSandbox";
import TechnicalCollaboration from "../pages/developer/TechnicalCollaboration";
import BusinessEnquiry from "../pages/developer/BusinessEnquiry";

// Business pages
import EnterpriseSolution from "../pages/business/EnterpriseSolutions";
import Strategic from "../pages/business/Strategic";
import BusinessContact from "../pages/business/BusinessContact";

// Information pages
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

// Authentication
import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";

// Dashboard
import Dashboard from "../pages/Dashboard";
import MainHome from "../pages/dashboard/MainHome";
import DashboardPlaceholder from "../pages/dashboard/DashboardPlaceholder";
import MarketsPage from "../pages/dashboard/MarketsPage";
import CoinChartPage from "../pages/dashboard/markets/CoinChartPage";
import RoomsPage from "../pages/dashboard/rooms/RoomPage";
import NewsPage from "../pages/dashboard/NewsPage";
import LearnPage from "../pages/dashboard/LearnPage";
import FriendsPage from "../pages/dashboard/FriendsPage";
import LeaderboardPage from "../pages/dashboard/LeaderboardPage";
import OnlineMode from "../pages/dashboard/rooms/online-mode/OnlineMode";
import MatchMaking from "../pages/dashboard/rooms/online-mode/MatchMaking";

const friendsElement = (
  <FriendsPage
    eyebrow="YOUR NETWORK"
    title="Friends"
    description="Discover traders, manage friend requests, and connect for practice sessions."
  />
);

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
        path: "rooms/online",
        element: <OnlineMode />,
      },
      {
        path: "rooms/online/searching",
        element: <OnlineMode />,
      },
      {
        path: "rooms/online/match-found",
        element: <OnlineMode />,
      },
      {
        path: "rooms/online/live",
        element: <OnlineMode />,
      },
      {
        path: "/dashboard/rooms/online/searching",
        element: <MatchMaking />,
       },

      // Friends workspace and friend requests
      {
        path: "friends",
        element: friendsElement,
      },

      // Legacy URL retained to avoid breaking existing links
      {
        path: "friendsPage",
        element: friendsElement,
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
        path: "leaderboard",
        element: <LeaderboardPage />,
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
