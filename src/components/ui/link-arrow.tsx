export function LinkArrow({ direction = "diagonal" }: { direction?: "diagonal" | "left" | "right" }) {
  const path = {
    diagonal: "M4.5 13.5 13.5 4.5M4.5 4.5h9v9",
    left: "M15 9H3M8 4 3 9l5 5",
    right: "M3 9h12M10 4l5 5-5 5",
  }[direction];
  return (
    <svg className="link-arrow" aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d={path} stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
