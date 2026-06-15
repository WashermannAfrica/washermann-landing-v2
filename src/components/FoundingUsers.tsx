export default function FoundingUsers() {
  return (
    <section className="bg-wm-green">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-28">
        <span className="font-body text-sm font-semibold uppercase tracking-widest text-wm-mint/70">
          Real people. Real time back.
        </span>
        <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-wm-mint">
          <span className="block">Teams love it.</span>
          <span className="block">HR teams love it more.</span>
        </h2>

        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-white/10 bg-white/5 px-8 py-10">
          <p className="font-display text-2xl leading-snug tracking-tight text-white md:text-3xl">
            Be among our founding users and help shape how Washermann works for you.
          </p>
          <a
            href="#waitlist"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-wm-mint-btn px-7 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
