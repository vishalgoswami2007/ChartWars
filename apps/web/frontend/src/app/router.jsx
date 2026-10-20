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
}
]);