import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <span className="footer-brand">СЕЗОН</span>
          <p className="concept-note">Концептуальный проект интернет-магазина.<br />Заказы и оплата не выполняются.</p>
        </div>
        <nav className="footer-nav" aria-label="Навигация в подвале">
          <Link href="/shop">Букеты</Link>
          <Link href="/about">О проекте</Link>
          <Link href="/delivery-care">Доставка и уход</Link>
        </nav>
      </div>
    </footer>
  );
}
