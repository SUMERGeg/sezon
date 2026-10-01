import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import { CartLink } from "@/components/cart/cart-link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="СЕЗОН — на главную">
          <span className="brand-name">СЕЗОН</span>
          <span className="brand-caption">цветочная мастерская</span>
        </Link>
        <nav className="main-nav" aria-label="Основная навигация">
          <Link href="/shop">Букеты</Link>
          <Link href="/shop#collections">Коллекции</Link>
          <Link href="/about">О мастерской</Link>
          <Link href="/delivery-care">Доставка и уход</Link>
        </nav>
        <CartLink />
        <MobileMenu />
      </div>
    </header>
  );
}
