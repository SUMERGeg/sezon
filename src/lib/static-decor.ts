import type { CSSProperties } from "react";
import { staticImagePath } from "./deployment";

export function staticDecorStyle(): CSSProperties | undefined {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== "1") return undefined;
  const style: Record<string, string> = {};
  for (const [name, file, desktop, mobile] of [
    ["climber", "rose-climber", [256, 384, 640], [128, 256, 384]],
    ["shoot", "garden-shoot", [256, 384, 640], [128, 256, 384]],
    ["trail", "meadow-trail", [640, 1200, 1920], [384, 640, 1080]],
  ] as const) {
    for (const [mode, widths] of [["desktop", desktop], ["mobile", mobile]] as const) {
      style[`--decor-${name}-${mode}`] = `image-set(${widths.map((width, index) => `url("${staticImagePath(`/images/decor/${file}.webp`, width)}") ${index + 1}x`).join(", ")})`;
    }
  }
  return style as CSSProperties;
}
