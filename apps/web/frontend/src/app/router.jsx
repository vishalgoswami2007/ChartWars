
import { createBrowserRouter } from "react-router-dom";
import { GuestRoute, ProtectedRoute } from "../pages/auth/AuthProvider";
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
import LiveMatch from "../pages/dashboard/rooms/online-mode/LiveMatch";
import FriendsRoom from "../pages/dashboard/rooms/friends/FriendsRoom";

import FriendsWaitingRoom from "../pages/dashboard/rooms/friends/FriendsWaitingRoom";
import FriendsLiveArena from "../pages/dashboard/rooms/friends/FriendsLiveArena";
import FriendsAnalytics from "../pages/dashboard/rooms/friends/FriendsAnalytics";

import BlindRoom from "../pages/dashboard/rooms/blind/BlindRoom";
import BlindLevelMap from "../pages/dashboard/rooms/blind/BlindLevelMap";
import BlindLevel from "../pages/dashboard/rooms/blind/BlindLevel";

import CoachLanding from "../pages/dashboard/rooms/coach/CoachLanding";
import CoachSetup from "../pages/dashboard/rooms/coach/CoachSetup";
import CoachBattle from "../pages/dashboard/rooms/coach/CoachBattle";
import CoachResults from "../pages/dashboard/rooms/coach/CoachResults";

import ProfilePage from "../pages/dashboard/ProfilePage";
import HistoryPage from "../pages/dashboard/HistoryPage";
import NotificationsPage from "../pages/dashboard/NotificationsPage";
import SettingsPage from "../pages/dashboard/SettingsPage";

const friendsElement = (
  <FriendsPage
    eyebrow="YOUR NETWORK"
    title="Friends"
    description="Discover traders, manage friend requests, and connect for practice sessions."
  />
);

export const router = createBrowserRouter([
  // Main website
    // Authentication
   {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/signup",
    element: <GuestRoute><Signup /></GuestRoute>,
  },
  {
    path: "/login",
    element: <GuestRoute><Login /></GuestRoute>,
  },
  {
    path: "/forgot-password",
    element: <GuestRoute><ForgotPassword /></GuestRoute>,
  },
  {
    path: "/verify-otp",
    element: <GuestRoute><VerifyOtp /></GuestRoute>,
  },

  // Dashboard and nested pages
    {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
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
         element: <MatchMaking />,
     },
      {
        path: "rooms/online/live",
        element: <LiveMatch />,
      },

      {
        path: "rooms/friends",
        element: <FriendsRoom />,
      },
      {
        path: "rooms/friends/room",
        element: <FriendsWaitingRoom />,
      },
      {
        path: "rooms/friends/live",
        element: <FriendsLiveArena />,
     },
     {
        path: "rooms/friends/analytics",
        element: <FriendsAnalytics />,
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

      { path: "rooms/blind", 
        element: <BlindRoom /> 
      },
      { path: "rooms/blind/levels", 
        element: <BlindLevelMap /> 
      },
      { path: "rooms/blind/level/:levelId", 
        element: <BlindLevel /> 
      },

      { path: "rooms/coach", 
        element: <CoachLanding /> 
      },
      { path: "rooms/coach/setup", 
        element: <CoachSetup />
      },
      { path: "rooms/coach/battle", 
        element: <CoachBattle />
      },
      { path: "rooms/coach/results",
        element: <CoachResults />
      },

      { path: "profile", 
        element: <ProfilePage /> 
      },
      { path: "history", 
        element: <HistoryPage />
      },
      { path: "notifications",
        element: <NotificationsPage />
        },
      { path: "settings", 
        element: <SettingsPage /> 
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
