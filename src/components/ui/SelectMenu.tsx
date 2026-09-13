"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
};

type Props = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  icon?: ReactNode;
  className?: string;
};

/**
 * Accessible listbox replacing a native <select>, which cannot be styled.
 * Keyboard: Arrow keys / Home / End to move, Enter or Space to pick,
 * Escape to close, Tab to leave.
 */
export function SelectMenu({ label, value, options, onChange, icon, className }: Props) {
  const id = useId();
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex];

  // Focus moves into the listbox once it is open; the active index is set by
  // whichever handler opened it (setting state in an effect cascades renders).
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function openList() {
    setActive(selectedIndex);
    setOpen(true);
  }

  function close(focusTrigger = true) {
    setOpen(false);
    if (focusTrigger) buttonRef.current?.focus();
  }

  function pick(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close();
  }

  function onListKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => (i - 1 + options.length) % options.length);
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        pick(active);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter") {
            event.preventDefault();
            openList();
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        className={cn(
          "group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition",
          open ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--sand)]",
        )}
      >
        {icon ? (
          <span
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition",
              open
                ? "bg-[var(--brand-deep)] text-white"
                : "bg-[var(--accent-soft)] text-[var(--brand-deep)]",
            )}
            aria-hidden
          >
            {icon}
          </span>
        ) : null}

        <span className="min-w-0 flex-1">
          <span
            id={`${id}-label`}
            className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]"
          >
            {label}
          </span>
          <span className="mt-0.5 block truncate text-[15px] font-bold text-[var(--brand-deep)]">
            {selected?.label}
          </span>
        </span>

        <FiChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--brand-deep)] transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul
              ref={listRef}
              role="listbox"
              tabIndex={-1}
              aria-labelledby={`${id}-label`}
              aria-activedescendant={`${id}-option-${active}`}
              onKeyDown={onListKeyDown}
              className="max-h-72 overflow-y-auto rounded-2xl border border-[var(--line)] bg-white p-1.5 shadow-[0_24px_60px_rgba(1,87,189,0.18)] outline-none"
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <li key={option.value || "all"}>
                    <button
                      id={`${id}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => pick(index)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition",
                        isSelected
                          ? "bg-[var(--brand-deep)] font-bold text-white"
                          : active === index
                            ? "bg-[var(--accent-soft)] text-[var(--brand-deep)]"
                            : "text-[var(--ink)]",
                      )}
                    >
                      {option.icon ? (
                        <span
                          className={cn(
                            "shrink-0",
                            isSelected ? "text-white" : "text-[var(--brand)]",
                          )}
                          aria-hidden
                        >
                          {option.icon}
                        </span>
                      ) : null}
                      <span className="min-w-0 flex-1 truncate">{option.label}</span>
                      {option.hint ? (
                        <span
                          className={cn(
                            "shrink-0 text-[11px] font-semibold uppercase tracking-[0.1em]",
                            isSelected ? "text-white/80" : "text-[var(--ink-muted)]",
                          )}
                        >
                          {option.hint}
                        </span>
                      ) : null}
                      {isSelected ? (
                        <FiCheck className="h-4 w-4 shrink-0" aria-hidden />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
