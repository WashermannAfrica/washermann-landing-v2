import WaitlistForm from "./WaitlistForm";

const PERKS = [
  { icon: "🎯", title: "Priority access", body: "First in when we launch in your area." },
  { icon: "🎁", title: "Exclusive WashPoints", body: "A bonus reward waiting for you on day one." },
  { icon: "📦", title: "Launch offer", body: "A first-order benefit for waitlist members only." },
];

export default function WaitlistCTA() {
  return (
    <section id="waitlist" className="bg-wm-mint-soft">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <span className="font-body text-sm font-semibold uppercase tracking-widest text-wm-green/50">
          Coming Soon to Lagos
        </span>
        <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] tracking-tight text-wm-green">
          Take laundry off your schedule. For good.
        </h2>
        <p className="mx-auto mt-4 max-w-md font-body text-base leading-relaxed text-wm-green/70">
          Washermann is launching soon. Join the waitlist and be among the first to get access.
        </p>

        <div className="mt-8">
          <WaitlistForm source="waitlist" buttonLabel="Secure My Spot" tone="onLight" />
          <p className="mt-3 font-body text-sm text-wm-green/55">
            No spam. No commitment. Just early access.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {PERKS.map((p) => (
            <div key={p.title} className="text-center">
              <div className="text-3xl">{p.icon}</div>
              <h3 className="mt-3 font-display text-xl tracking-tight text-wm-green">{p.title}</h3>
              <p className="mt-1 font-body text-sm leading-relaxed text-wm-green/65">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
