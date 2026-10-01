import Image from "next/image";
import Link from "next/link";
import { catalog } from "@/data/catalog";
import imageAssets from "@/data/image-assets.json";
import { ProductList } from "@/components/catalog/product-list";
import { HomeMotion } from "@/components/ui/home-motion";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata("/");

export default function HomePage() {
  const hero = imageAssets.hero;
  const featured = catalog.products.filter((product) => product.featured).slice(0, 4);
  return (
    <>
      <HomeMotion />
      <section className="container home-intro">
        <div className="hero-copy">
          <p className="eyebrow">Цветочная мастерская · концепт</p>
          <h1>Цветы, собранные<br className="desktop-break" /> по сезону.</h1>
          <p className="page-description">Небольшие букеты и композиции в спокойных природных гаммах. Для подарка, дома и обычного хорошего дня.</p>
          <div className="hero-actions">
            <Link className="button" href="/shop">Все букеты</Link>
            <Link className="text-link" href="/collections/morning-garden">Смотреть коллекцию <span aria-hidden="true">↗</span></Link>
          </div>
          <p className="hero-footnote">Форма, цвет и немного воздуха.</p>
        </div>
        <figure className="hero-figure"><Image src={hero.src} alt="Светлая сезонная композиция на каменном столе, иллюстрация концепта" width={hero.width} height={hero.height} sizes="(max-width: 767px) 90vw, 55vw" preload /><figcaption>Утренний сад / иллюстрация концепта</figcaption></figure>
      </section>
      <section className="container home-featured" data-reveal=""><div className="section-heading"><div><p className="eyebrow">Выбор сезона</p><h2>Букеты с характером</h2></div><Link className="text-link" href="/shop">Весь каталог <span aria-hidden="true">↗</span></Link></div><ProductList products={featured} /></section>
      <section className="container home-collections" id="collections" data-reveal=""><div className="section-heading"><div><p className="eyebrow">По настроению</p><h2>Три взгляда на сезон</h2></div></div><ul className="editorial-collections">{catalog.collections.map((collection) => <li key={collection.id}><Link href={`/collections/${collection.slug}`}><div className="collection-photo"><Image src={collection.heroImage.src} alt="" width={collection.heroImage.width} height={collection.heroImage.height} sizes="(max-width: 767px) 90vw, 30vw" /></div><h3>{collection.name} <span aria-hidden="true">↗</span></h3><p>{collection.intro}</p></Link></li>)}</ul></section>
      <section className="season-story" data-reveal=""><div className="container story-inner"><div><p className="eyebrow">Собрано по сезону</p><h2>Цветы меняются.<br />Характер остаётся.</h2></div><div><p>Сезон задаёт форму и цвет. Отдельные сорта могут меняться — ориентиром остаются гамма, объём и общее настроение букета.</p><Link className="text-link" href="/about">О подходе к цветам <span aria-hidden="true">↗</span></Link></div></div></section>
      <section className="container home-details" aria-label="Практические детали" data-reveal="">
        <article><p className="eyebrow">01 / Доставка</p><h2>Понятные условия</h2><p>В демонстрации можно будет выбрать доставку или самовывоз. Реальные заказы не выполняются.</p></article>
        <article><p className="eyebrow">02 / Состав</p><h2>Живой сезон</h2><p>Состав может немного меняться. Сохраняется общий характер, гамма и размер композиции.</p></article>
        <article><p className="eyebrow">03 / Уход</p><h2>Простые привычки</h2><p>Чистая прохладная вода и свежий срез стеблей помогают сохранить букет.</p></article>
      </section>
      <section className="container final-cta" data-reveal=""><p className="eyebrow">Для подарка. Для дома. Для себя.</p><h2>Найдите свой букет.</h2><Link className="button" href="/shop">Перейти к букетам</Link><p className="demo-caption">Концептуальный магазин. Изображения созданы с помощью AI.</p></section>
    </>
  );
}
