import { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import SolutionsSection from "./components/SolutionsSection";
import BlueprintSection from "./components/BlueprintSection";
import GlobalScaleSection from "./components/GlobalScaleSection";
import IndustriesSection from "./components/IndustriesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import SiteFooter from "../../components/SiteFooter";
import "../Home/home.css";
import "./services.css";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("sr-visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-sr]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function ServicesPage() {
  useScrollReveal();
  useEffect(() => {
    document.title = "Services | InTechRoot";
    document.body.className = "bg-background font-body text-on-surface selection:bg-tertiary-fixed-dim selection:text-on-tertiary-fixed overflow-x-hidden";
  }, []);

  return (
    <div className="services-page">
      <HeroSection />
      <StatsSection />
      <SolutionsSection />
      <BlueprintSection />
      <GlobalScaleSection>
        <IndustriesSection />
      </GlobalScaleSection>
      <TestimonialsSection />
      <CTASection />
      <SiteFooter />
    </div>
  );
}
