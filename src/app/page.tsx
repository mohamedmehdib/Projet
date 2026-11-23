import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import Hero from "./Hero";
import RoleShowcase from "./RoleShowcase";
import Testimonials from "./Testimonials";
import ContactSales from "./ContactSales";
import FaqRoadmap from "./Faq";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import ChatBot from "./ChatBot";
import ScrollScrubObserver from "@/components/ScrollScrubObserver";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-primary text-secondary selection:bg-accent/20 selection:text-accent">
      <ScrollScrubObserver />
      <LoadingScreen />
      <Navbar />
      <Hero />
      <RoleShowcase />
      <Testimonials />
      <ContactSales />
      <FaqRoadmap />
      <ContactForm />
      <Footer />
      <ChatBot />
    </main>
  );
}
