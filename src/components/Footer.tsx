import { SITE, whatsappLink } from "@/lib/site";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: whatsappLink("Hi Washermann!") },
    ],
  },
  {
    heading: "Product",
    links: [
      { label: "Why Washermann", href: "/#why" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Who it's for", href: "/#who" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "WhatsApp", href: whatsappLink("Hi Washermann!") },
      { label: SITE.email, href: `mailto:${SITE.email}` },
      { label: "Instagram", href: SITE.instagram },
      { label: "X / Twitter", href: SITE.twitter },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-wm-green">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        {/* Top: blurb + WhatsApp */}
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wordmark.png" alt="Washermann" className="mb-6 h-10 w-auto" />
            <p className="max-w-sm font-body text-sm leading-relaxed text-white/70">
              The laundry benefit platform connecting employees to trusted service providers, with
              full company controls and financial transparency.
            </p>
            <p className="mt-4 font-body text-sm text-wm-mint">Your week/ends, minus laundry.</p>
          </div>

          <div className="md:justify-self-end">
            <a href={whatsappLink("Hi Washermann!")} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/whatsapp-qr.png" alt="Chat with Washermann on WhatsApp" className="mb-5 h-20 w-20 rounded-lg bg-white p-1" />
            </a>
            <h3 className="font-display text-3xl leading-[1.05] tracking-tight text-white md:text-4xl">
              <span className="block">Shall we connect</span>
              <span className="block">on WhatsApp?</span>
            </h3>
            <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-white/70">
              We prefer real conversations. Scan the QR code or tap to chat with us directly — we
              reply fast.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-white/15" />

        {/* Nav columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="font-body text-sm font-semibold text-white">{col.heading}</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="font-body text-sm text-white/70 transition-colors hover:text-wm-mint">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Big wordmark */}
        <div className="mt-12 select-none overflow-hidden">
          <span className="block whitespace-nowrap font-display text-[clamp(4rem,16vw,12rem)] leading-none tracking-tight text-white">
            Washermann
          </span>
        </div>

        {/* Bottom row */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-body text-sm text-wm-mint">© 2026 Washermann. All rights reserved.</span>
          <div className="flex items-center gap-5 text-white">
            <a href={SITE.twitter} aria-label="X" className="transition-colors hover:text-wm-mint">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>
            </a>
            <a href={SITE.instagram} aria-label="Instagram" className="transition-colors hover:text-wm-mint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href={whatsappLink("Hi Washermann!")} aria-label="WhatsApp" className="transition-colors hover:text-wm-mint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24Zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.512 5.26l-.999 3.648 3.985-1.045Zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413Z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
