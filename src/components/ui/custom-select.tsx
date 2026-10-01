"use client";

import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

type Option = { value: string; label: string; disabled?: boolean };
type Props = {
  id?: string;
  name?: string;
  label: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

export function CustomSelect({ id, name, label, value, options, onChange, placeholder = "Выберите вариант", required, ...aria }: Props) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listId = `${triggerId}-options`;
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<CSSProperties>({});
  const selectedIndex = options.findIndex((option) => option.value === value);
  const enabled = options.flatMap((option, index) => option.disabled ? [] : [index]);

  function measure() {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(Math.max(rect.width, 240), window.innerWidth - 24);
    const below = window.innerHeight - rect.bottom - 16;
    const above = rect.top - 16;
    const up = below < Math.min(240, options.length * 44 + 16) && above > below;
    setPosition({ width, left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), maxHeight: Math.min(320, Math.max(44, up ? above : below)), ...(up ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }) });
  }

  function show(index = selectedIndex >= 0 && !options[selectedIndex].disabled ? selectedIndex : enabled[0]) {
    if (index === undefined) return;
    typeahead.current = { text: "", time: 0 };
    measure();
    setActive(index);
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target) && !popup.current?.contains(event.target)) setOpen(false);
    }
    const reposition = () => measure();
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
    // Position is measured on browser events; options only affect the space needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, options.length]);

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      if (open) { event.preventDefault(); event.stopPropagation(); setOpen(false); }
      return;
    }
    if (event.key === "Tab") { if (open) choose(active); return; }
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (open) choose(active); else show();
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (enabled.length === 0) return;
      if (event.key === "Home" || event.key === "End") {
        const index = event.key === "Home" ? enabled[0] : enabled[enabled.length - 1];
        if (open) setActive(index); else show(index);
      } else if (!open) show();
      else {
        const current = enabled.indexOf(active);
        const next = Math.max(0, Math.min(enabled.length - 1, current + (event.key === "ArrowDown" ? 1 : -1)));
        setActive(enabled[next]);
      }
      return;
    }
    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      const now = Date.now();
      const text = `${now - typeahead.current.time < 700 ? typeahead.current.text : ""}${event.key.toLocaleLowerCase("ru")}`;
      typeahead.current = { text, time: now };
      const prefix = [...text].every((letter) => letter === text[0]) ? text[0] : text;
      const current = open ? active : selectedIndex;
      const candidates = [...enabled.filter((index) => index > current), ...enabled.filter((index) => index <= current)];
      const match = candidates.find((index) => options[index].label.toLocaleLowerCase("ru").startsWith(prefix));
      if (match !== undefined) { if (open) setActive(match); else onChange(options[match].value); }
    }
  }

  return <div className="custom-select" ref={root}>
    {name && <input type="hidden" name={name} value={value} />}
    <button {...aria} id={triggerId} ref={trigger} type="button" className="custom-select-trigger" role="combobox" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-required={required || undefined} aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined} onKeyDown={keyDown} onClick={() => { if (open) setOpen(false); else show(); }} onBlur={(event) => { if (!popup.current?.contains(event.relatedTarget)) setOpen(false); }}>
      <span className={selectedIndex < 0 ? "select-placeholder" : undefined}>{options[selectedIndex]?.label ?? placeholder}</span><svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    {open && createPortal(<div ref={popup} id={listId} className="custom-select-popup" style={position} role="listbox" aria-label={label} onPointerDown={(event) => event.preventDefault()}>
      {options.map((option, index) => <div id={`${listId}-${index}`} key={option.value} className={`custom-select-option${active === index ? " is-active" : ""}`} role="option" aria-selected={option.value === value} aria-disabled={option.disabled || undefined} onPointerMove={() => { if (!option.disabled) setActive(index); }} onPointerUp={(event) => {
        // Safari suppresses the compatibility click after the focus-preserving pointerdown.
        if (event.pointerType === "touch") { event.preventDefault(); choose(index); }
      }} onClick={() => choose(index)}><span>{option.label}</span><span className="select-check" aria-hidden="true">{option.value === value ? "✓" : ""}</span></div>)}
    </div>, document.body)}
  </div>;
}
