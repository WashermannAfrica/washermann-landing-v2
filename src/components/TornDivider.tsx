/* Torn-paper divider strips cropped pixel-for-pixel from the design.
   Each strip's top colour matches the section above, bottom matches the section below,
   so they stack seamlessly in normal flow. */
export default function TornDivider({
  src,
  flip = false,
  className = "",
}: {
  src: string;
  /** Mirror vertically — swaps which colour is on top, to reuse a strip for the reverse transition. */
  flip?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      className={`block w-full select-none pointer-events-none -mt-px -mb-px ${className}`}
    />
  );
}
