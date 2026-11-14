import { LanguageProvider } from "@/lib/language";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import OurStory from "@/components/OurStory";
import EventInfo from "@/components/EventInfo";
import Gallery from "@/components/Gallery";
import GiftsTeaser from "@/components/GiftsTeaser";
import Rsvp from "@/components/Rsvp";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LanguageProvider>
      <div style={{ width: "100%", overflowX: "hidden", position: "relative" }}>
        <Nav />
        <Hero />
        <OurStory />
        <EventInfo />
        <Gallery />
        <GiftsTeaser />
        <Rsvp />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
