/** Public-file URLs need the prefix explicitly; Next Link adds it itself. */
export function assetPath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}

export function sitePath(path: string): string {
  const value = assetPath(path);
  return process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" && !path.split("/").pop()?.includes(".") && !value.endsWith("/") ? `${value}/` : value;
}

export function staticImagePath(src: string, width: number): string {
  return assetPath(src.replace(/^\/images\//, "/images/static/").replace(/\.webp$/, `-${width}.webp`));
}
