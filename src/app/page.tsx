import Navbar      from "@/components/Navbar";
import PageWrapper  from "@/components/PageWrapper";
import Hero         from "@/components/Hero";
import HowItWorks   from "@/components/HowItWorks";
import Features     from "@/components/Features";
import Experiences  from "@/components/Experiences";
import SocialProof  from "@/components/SocialProof";
import Stats        from "@/components/Stats";
import FAQ          from "@/components/FAQ";
import FinalCTA     from "@/components/FinalCTA";
import Footer       from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <PageWrapper>
        <main>
          <Hero />
          <HowItWorks />
          <Features />
          <Experiences />
          <SocialProof />
          <Stats />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </PageWrapper>
    </>
  );
}
