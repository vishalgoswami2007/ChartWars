import Navbar from "./components/Navbar";
import HeroSection from "./sections/HeroSection";
import MarketTicker from "./sections/MarketTicker";
import PracticeModes from "./sections/PracticeModes";
import HowItWorks from "./sections/HowItWorks";
import PerformanceSection from "./sections/PerformanceSection";
import LearnAndNews from "./sections/LearnAndNews";
import FAQSection from "./sections/FAQSection";
import FinalCTA from "./sections/FinalCTA";
import LandingFooter from "./footer/LandingFooter";

export default function LandingPage() {
  return (
    <div className="cw-page min-h-screen">
      <Navbar />

      <main>
        <HeroSection />
        <MarketTicker />
        <PracticeModes />
        <HowItWorks />
        <PerformanceSection />
        <LearnAndNews />
        <FAQSection />
        <FinalCTA />
      </main>

      <LandingFooter />
    </div>
  );
}