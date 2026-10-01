"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <div className="mobile-menu">
      <button ref={trigger} type="button" className="icon-button menu-trigger" aria-label="Открыть меню" aria-expanded={open} onClick={() => setOpen(true)}><span aria-hidden="true">☰</span></button>
      <ModalDialog open={open} title="Навигация" onClose={() => setOpen(false)} returnFocusRef={trigger}>
        <nav className="drawer-nav" aria-label="Мобильная навигация">
          {[ ["/shop", "Букеты"], ["/shop#collections", "Коллекции"], ["/about", "О мастерской"], ["/delivery-care", "Доставка и уход"] ].map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        </nav>
        <p className="demo-caption">Концептуальный проект. Заказы и оплата не выполняются.</p>
      </ModalDialog>
    </div>
  );
}
