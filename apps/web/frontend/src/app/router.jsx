import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/landing/LandingPage";
import PlaceholderPage from "./PlaceholderPage";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <PlaceholderPage title="Welcome back" />,
  },
  {
    path: "/signup",
    element: <PlaceholderPage title="Create your account" />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
  path: "/practice-modes",
  element: <PracticeModesPage />,
},
{
  path: "/performance-Analytics",
  element: <PerformanceAnalyticsPage/>
},
{
  path: "/howItsWorkPage",
  element: <HowItWorksPage/>
},
{
  path: "/marketInsight",
  element: <MarketInsight/>
},
{
  path: "/knowledgeVault",
  element: <KnowledgeVault/>
},
{
  path: "/roadmap",
  element:<Roadmap/>
},
{
  path: "/developerSandbox",
  element:<DeveloperSandbox/>
},
{
  path: "/technicalCollaboration",
  element:<TechnicalCollaboration/>
},
{
  path: "/businessEnquiry",
  element:<BusinessEnquiry/>
},
{
path: "/enterpriseSolution",
element:<EnterpriseSolution/>
},
{
  path: "/strategic",
  element:<Strategic/>
},
{
  path: "/businessContact",
  element: <BusinessContact/>
},
{
  path: "/ourMission",
  element:<OurMission/>
},
{
  path: "/contact",
  element:<Contact/>
},
{
path: "/privacyPolicy",
element:<PrivacyPolicy/>
},
{
  path:"/cookieSetting",
  element:<CookieSettings/>
},
{
  path:"/termsOfUse",
  element:<TermsOfUse/>
},
{
  path:"/accessibility",
  element:<Accessibility/>
},
{
  path:"/helpCenter",
  element:<HelpCenter/>
},
{
  path:"/cookie",
  element:<Cookie/>
},
{
  path:"/security",
  element:<Security/>
}
]);