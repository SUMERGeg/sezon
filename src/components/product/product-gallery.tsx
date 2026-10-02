"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/data/schemas";
import { LinkArrow } from "@/components/ui/link-arrow";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [index, setIndex] = useState(0);
  const selected = images[index];
  const labels = ["Общий вид", "Деталь композиции", "Настроение коллекции"];
  return (
    <div className="product-gallery" aria-label="Галерея букета">
      <div className={`gallery-photo${selected.role === "detail" ? " gallery-detail" : ""}`}>
        <Image className="product-photo" src={selected.src} alt={selected.alt} width={selected.width} height={selected.height} sizes="(max-width: 767px) 90vw, 55vw" preload={index === 0} loading={index === 0 ? undefined : "eager"} />
      </div>
      <div className="gallery-controls"><button type="button" className="icon-button" aria-label="Предыдущее фото" onClick={() => setIndex((index + images.length - 1) % images.length)}><LinkArrow direction="left" /></button><p role="status" aria-label="Номер фотографии">{index + 1} / {images.length}</p><button type="button" className="icon-button" aria-label="Следующее фото" onClick={() => setIndex((index + 1) % images.length)}><LinkArrow direction="right" /></button></div>
      <div className="gallery-thumbnails">{images.map((image, number) => <button key={`${image.role}-${number}`} type="button" aria-label={`Фото ${number + 1}: ${labels[number] ?? "Букет"}`} aria-pressed={index === number} onClick={() => setIndex(number)}>
        <Image src={image.src} alt="" width={80} height={100} sizes="80px" /><span>{labels[number]}</span>
      </button>)}</div>
      <p className="demo-caption">Иллюстративные изображения концепта, созданные с помощью AI. Состав и масштаб могут отличаться.</p>
    </div>
  );
}
