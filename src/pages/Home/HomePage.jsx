import { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import FeaturesSection from "./components/FeaturesSection";
import ArchitectureSection from "./components/ArchitectureSection";
import CTASection from "./components/CTASection";
import FooterSection from "./components/FooterSection";
import "./home.css";

export default function HomePage() {
  useEffect(() => {
    document.body.className =
      "bg-background font-body text-on-surface selection:bg-tertiary-fixed-dim selection:text-on-tertiary-fixed overflow-x-hidden";
    const onScroll = () => {
      const scrolled = window.pageYOffset;
      const nav = document.querySelector("nav");
      if (!nav) return;

      const navAbsolute = nav.querySelector(".absolute");
      const navInner = nav.querySelector(".max-w-7xl");
      if (navAbsolute && navInner) {
        if (scrolled > 50) {
          navAbsolute.classList.add("bg-white/80", "dark:bg-[#000615]/80");
          navInner.classList.replace("py-6", "py-4");
        } else {
          navAbsolute.classList.remove("bg-white/80", "dark:bg-[#000615]/80");
          navInner.classList.replace("py-4", "py-6");
        }
      }

      document.querySelectorAll(".floating-element").forEach((el, index) => {
        const speed = 0.05 + index * 0.01;
        const yOffset = scrolled * speed;
        if (!el.matches(":hover")) el.style.transform = `translateY(${yOffset}px)`;
      });
    };

    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ArchitectureSection />
      <CTASection />
      <FooterSection />
    </>
  );
}
