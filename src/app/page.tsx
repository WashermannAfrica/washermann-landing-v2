import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyWashermann from "@/components/WhyWashermann";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import WhoItsFor from "@/components/WhoItsFor";
import FoundingUsers from "@/components/FoundingUsers";
import WaitlistCTA from "@/components/WaitlistCTA";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import TornDivider from "@/components/TornDivider";
import Reveal from "@/components/Reveal";
import BlindsReveal from "@/components/BlindsReveal";
import Bubbles from "@/components/Bubbles";

export default function Home() {
  return (
    <main className="relative flex flex-col">
      {/* Ambient soap bubbles behind everything */}
      <Bubbles />

      <Navbar />

      {/* Hero is above the fold — no reveal, it's the first thing seen */}
      <Hero />
      <TornDivider src="/illustrations/div-green-mint.png" />

      {/* Why + How It Works share the mint family, no divider between them */}
      {/* Blinds reveal — dark-green slats (from the Hero) open onto the mint section */}
      <BlindsReveal cover="#00281c">
        <WhyWashermann />
      </BlindsReveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <TornDivider src="/illustrations/div-pink-white.png" />

      <Reveal>
        <Features />
      </Reveal>
      {/* white → blush (flip of blush→white) */}
      <TornDivider src="/illustrations/div-blush-white.png" flip />

      {/* Blinds reveal — white slats (from Features) open onto the blush section */}
      <BlindsReveal cover="#ffffff">
        <WhoItsFor />
      </BlindsReveal>
      {/* blush → green (flip of green→blush) */}
      <TornDivider src="/illustrations/div-green-blush.png" flip />

      <Reveal>
        <FoundingUsers />
      </Reveal>
      <TornDivider src="/illustrations/div-green-mint.png" />

      <Reveal>
        <WaitlistCTA />
      </Reveal>
      {/* mint → white (flip of white→mint) */}
      <TornDivider src="/illustrations/div-white-mint.png" flip />

      <Reveal>
        <FAQ />
      </Reveal>
      <TornDivider src="/illustrations/div-white-mint.png" />

      {/* Blinds reveal — white slats (from FAQ) open onto the mint CTA */}
      <BlindsReveal cover="#ffffff">
        <FinalCTA />
      </BlindsReveal>
      <TornDivider src="/illustrations/div-mint-green.png" />

      <Footer />
    </main>
  );
}
