interface Props {
  size?: "sm" | "md";
  showWord?: boolean;
  onDark?: boolean;
}

/** Marchio Prindict: quadrato nero con "P" + caret blu, e wordmark con caret lampeggiante. */
export function Logo({ size = "md", showWord = true, onDark = false }: Props) {
  const box = size === "sm" ? "h-7 w-7 text-base" : "h-9 w-9 text-xl";
  const word = size === "sm" ? "text-lg" : "text-2xl";
  const ink = onDark ? "text-white" : "text-ink";
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`relative flex ${box} items-center justify-center bg-ink font-display font-black leading-none text-white`}
      >
        P
        <span className="absolute right-1 top-1 h-2 w-[3px] bg-accent" />
      </span>
      {showWord && (
        <span className={`font-display font-black tracking-tightest ${word} ${ink}`}>
          Prindict<span className="caret font-normal text-accent">▮</span>
        </span>
      )}
    </div>
  );
}
