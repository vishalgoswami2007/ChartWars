import backgroundImage from "../../assets/background.png";
import Navbar from "./components/Navbar";
import DashboardPreview from "./sections/DashboardPreview";
import PracticeMode from "./sections/PracticeModes";
import HowItWorks from "./sections/HowItWorks";
import PerformanceAnalytics from "./sections/PerformanceAnalytics";
import LearnInsights from "./sections/LearnInsights";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Navbar + Hero share the same background */}
      <section
        className="relative isolate overflow-hidden bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Dark overlay for readable white text */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/10 via-black/20 to-[#050505]" />

        <Navbar />

      
    {/* Hero content */}
     <div className="mx-auto flex min-h-170 w-full max-w-360 items-center justify-center px-6 py-24 text-center sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-5xl">
      
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-orange-500">Trade</span> smarter.
            <br />
            Master your strategy.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            Practise with virtual funds, challenge your friends, and build better
            trading discipline — one decision at a time.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-orange-500 px-8 py-3 font-semibold text-black transition duration-200 hover:bg-orange-400">
              Get started <span aria-hidden="true">↗</span>
            </button>

            <a
              href="#features"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-8 py-3 font-semibold text-white transition duration-200 hover:border-white/60 hover:bg-white/5"
            >
              Learn more
            </a>
          </div>
        </div>
   </div>
      </section>
       
       <DashboardPreview />

      <div className="space-y-0">
           <PracticeMode />
           <HowItWorks />
           <PerformanceAnalytics />
           <LearnInsights/>
         </div>
      
    </main>
  );
}