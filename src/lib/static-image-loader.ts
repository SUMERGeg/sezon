import { staticImagePath } from "./deployment";

export default function staticImageLoader({ src, width }: { src: string; width: number }) {
  return staticImagePath(src, width);
}
