import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { WhySection } from "./components/WhySection";
import { CTASection } from "./components/CTASection";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import TeamPage from "./pages/TeamPage";
import ContactsPage from "./pages/ContactsPage";
import ChatbotPage from "./pages/ChatbotPage";

function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-8%] top-48 h-96 w-96 rounded-full bg-sky-100/5 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <WhySection />
      <CTASection />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/chat" element={<ChatbotPage />} />
        <Route path="/plan" element={<ChatbotPage />} />
      </Routes>
    </Router>
  );
}
