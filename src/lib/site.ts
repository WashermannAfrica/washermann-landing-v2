// Central site constants. Swap the dummy WhatsApp number for the real one here.

export const SITE = {
  email: "hello@washermann.com",
  instagram: "https://instagram.com/washermann",
  twitter: "https://x.com/washermann",
  // TODO: replace with the real WhatsApp business number (international format, no +).
  whatsappNumber: "2348000000000",
};

/** Build a wa.me link with a pre-filled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_COMPANY_MESSAGE =
  "Hi Washermann, I'm interested in setting up Washermann for my team at [Company Name].";

// The 20 Local Government Areas of Lagos State.
export const LAGOS_AREAS = [
  "Agege",
  "Ajeromi-Ifelodun",
  "Alimosho",
  "Amuwo-Odofin",
  "Apapa",
  "Badagry",
  "Epe",
  "Eti-Osa",
  "Ibeju-Lekki",
  "Ifako-Ijaiye",
  "Ikeja",
  "Ikorodu",
  "Kosofe",
  "Lagos Island",
  "Lagos Mainland",
  "Mushin",
  "Ojo",
  "Oshodi-Isolo",
  "Shomolu",
  "Surulere",
  "Other",
];
