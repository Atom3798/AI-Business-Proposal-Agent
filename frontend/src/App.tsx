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
    <div 
      className="bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/vertical-shot-curvy-road-down-hill-with-city-buildings-distance-blue-sky.jpg')"
      }}
    >
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

