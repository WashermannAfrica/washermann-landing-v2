import WaitlistForm from "./WaitlistForm";

export default function FinalCTA() {
  return (
    <section id="cta" className="bg-wm-mint-soft">
      <div className="mx-auto max-w-4xl px-6 pb-4 pt-16 text-center md:pt-24">
        <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] tracking-tight text-wm-green">
          <span className="block">Your week/ends belong to you.</span>
          <span className="block">Not to laundry.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md font-body text-base leading-relaxed text-wm-green/70">
          Join the Washermann waitlist today. Be first. Get priority. Take your Saturdays back.
        </p>

        <div className="mt-8">
          <WaitlistForm source="final-cta" buttonLabel="Join the Waitlist" tone="onLight" showSegment={false} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/illustrations/cta.png" alt="" className="mx-auto w-full" />
      </div>
    </section>
  );
}
