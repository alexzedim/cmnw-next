/**
 * Renders a preformatted volatility string ("σ 5 814 g") with a smaller
 * sigma glyph so it visually reads as a unit marker, not a digit.
 */
export function SigmaValue({ text }: { text: string }) {
  const rest = text.replace(/^σ\s*/, "");

  return (
    <span className="font-mono">
      <span className="text-[0.65em] text-foreground/70">σ</span> {rest}
    </span>
  );
}
