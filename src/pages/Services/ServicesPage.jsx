import { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import SolutionsSection from "./components/SolutionsSection";
import BlueprintSection from "./components/BlueprintSection";
import GlobalScaleSection from "./components/GlobalScaleSection";
import IndustriesSection from "./components/IndustriesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import FooterSection from "./components/FooterSection";
import "./services.css";

export default function ServicesPage() {
  useEffect(() => {
    document.body.className = "bg-background font-body text-on-surface selection:bg-tertiary-fixed-dim selection:text-on-tertiary-fixed";
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
      <FooterSection />
    </div>
  );
}
