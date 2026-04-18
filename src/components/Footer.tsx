import Image from "next/image";

const COL_LEFT = [
  { label: "How It Works",  href: "#how-it-works" },
  { label: "For Companies", href: "#experiences"  },
  { label: "Pricing",       href: "#cta"          },
  { label: "FAQ",           href: "#faq"          },
];

const COL_RIGHT = [
  { label: "About Us", href: "#" },
  { label: "Careers",  href: "#" },
  { label: "Blog",     href: "#" },
  { label: "Contact",  href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-wm-green">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16">

        {/* ── Left panel ── */}
        <div className="flex flex-col gap-10">

          {/* Logo — place footer-logo.png in /public */}
          <Image
            src="/footer-logo.png"
            alt="Washermann"
            width={180}
            height={52}
            className="object-contain object-left"
          />

          {/* Tagline */}
          <p className="text-white/55 text-sm leading-relaxed max-w-sm">
            The laundry benefit platform connecting employees to trusted service
            providers, with full company controls and financial transparency.
          </p>

          {/* Nav links — 2 columns */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-0">
            {/* Column 1 */}
            <div className="flex flex-col gap-5">
              {COL_LEFT.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-white/65 text-sm hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-5">
              {COL_RIGHT.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-white/65 text-sm hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel: WhatsApp ── */}
        <div className="flex flex-col gap-6">

          {/* QR code + headline side-by-side */}
          <div className="flex items-start gap-5">
            {/* QR code — place whatsapp-qr.png in /public */}
            <div className="flex-shrink-0 w-[88px] h-[88px] lg:w-[100px] lg:h-[100px] bg-white rounded-xl overflow-hidden">
              <Image
                src="/whatsapp-qr.png"
                alt="WhatsApp QR code"
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Headline */}
            <h2
              className="font-display text-white uppercase leading-none tracking-wide"
              style={{ fontSize: "clamp(2.8rem,6.5vw,7.5rem)" }}
            >
              Shall we connect on WhatsApp?
            </h2>
          </div>

          {/* Body */}
          <p className="text-white/55 text-sm leading-relaxed max-w-sm">
            Because we prefer genuine, quick, and straightforward exchanges.
            Scan the QR code, send your message, and we&apos;ll reply (very quickly).
          </p>

          {/* CTA */}
          <a
            href="https://wa.me/234800000000"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center justify-center bg-wm-mint text-wm-green font-bold text-sm uppercase tracking-widest px-8 py-5 rounded-2xl hover:bg-wm-mint/90 transition-colors"
          >
            Chat with Washermann
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10 px-6 lg:px-10 py-4">
        <p className="text-white/25 text-xs text-center">
          © {new Date().getFullYear()} Washermann. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
