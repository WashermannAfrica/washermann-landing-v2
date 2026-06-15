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

export default function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />

      <Hero />
      <TornDivider src="/illustrations/div-green-mint.png" />

      {/* Why + How It Works share the mint family, no divider between them */}
      <WhyWashermann />
      <HowItWorks />
      <TornDivider src="/illustrations/div-pink-white.png" />

      <Features />
      {/* white → blush (flip of blush→white) */}
      <TornDivider src="/illustrations/div-blush-white.png" flip />

      <WhoItsFor />
      {/* blush → green (flip of green→blush) */}
      <TornDivider src="/illustrations/div-green-blush.png" flip />

      <FoundingUsers />
      <TornDivider src="/illustrations/div-green-mint.png" />

      <WaitlistCTA />
      {/* mint → white (flip of white→mint) */}
      <TornDivider src="/illustrations/div-white-mint.png" flip />

      <FAQ />
      <TornDivider src="/illustrations/div-white-mint.png" />

      <FinalCTA />
      <TornDivider src="/illustrations/div-mint-green.png" />

      <Footer />
    </main>
  );
}
