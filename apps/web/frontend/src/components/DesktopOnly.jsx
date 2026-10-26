
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import "./desktop-only.css";

function useMobileScreen() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function MobileComingSoon() {
  return (
    <main className="cw-mobile-gate">
      <div className="cw-gate-glow" />

      <section className="cw-gate-card">
        <img
          src={logo}
          alt="ChartWars"
          className="cw-gate-logo"
        />

        <div className="cw-gate-arc" />

        <h1>
          We're crafting the
          <br />
          ChartWars mobile
          <br />
          experience.
        </h1>

        <p className="cw-gate-description">
          For now, open ChartWars on a laptop or desktop
          to experience the full platform.
        </p>

        <div className="cw-gate-badge">
          MOBILE EXPERIENCE · COMING SOON
        </div>

        <p className="cw-gate-footer">
          Virtual practice only <span>·</span> Educational purposes
        </p>
      </section>
    </main>
  );
}

export default function DesktopOnly({ children }) {
  const isMobile = useMobileScreen();

  if (isMobile) {
    return <MobileComingSoon />;
  }

  return children;
}
