
import FlightSearchCard from "@/components/flight/FlightSearch";
import Navbar from '@/components/navbar';
import HeroSectionGradientBackground from "@/components/ui/hero";
import ServicesSection from "@/components/Services";
import AboutSection from "@/components/About";
import Footer from "@/components/ui/footer";


export default function Home() {
  return (
    <main >
      <Navbar />
      <HeroSectionGradientBackground />
      <FlightSearchCard />
      <ServicesSection />
      <AboutSection />
      <Footer/>
    </main>
  );
}
