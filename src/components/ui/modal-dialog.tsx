"use client";

import { useEffect, useId, useRef, type RefObject } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
};

export function ModalDialog({ open, title, onClose, returnFocusRef, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!open) { if (element.open) element.close(); return; }
    element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; if (element.open) element.close(); };
  }, [open]);

  return (
    <dialog ref={dialog} className="drawer" aria-labelledby={titleId} onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]'))
        .filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      // Keep the tab sequence inside the modal instead of moving into browser chrome.
      if (first && last && (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }} onClose={() => { onClose(); returnFocusRef.current?.focus(); }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
      <div className="drawer-heading"><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" aria-label={`Закрыть: ${title}`} onClick={onClose}>×</button></div>
      {children}
    </dialog>
  );
}
