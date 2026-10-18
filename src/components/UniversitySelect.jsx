import { useEffect, useMemo, useRef, useState } from "react";
import { UNIVERSITIES } from "../data/universities";
import "./UniversitySelect.css";

function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M2 9l10-5 10 5-10 5L2 9z" />
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
      <path d="M22 9v6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/**
 * Searchable university picker.
 *   value:    selected university string ("" when nothing is selected)
 *   onChange: (nextValue: string) => void
 */
export default function UniversitySelect({ value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return UNIVERSITIES;
    const matches = UNIVERSITIES.filter(
      (u) => u !== "Other" && u.toLowerCase().includes(q)
    );
    // "Other" is always available as the last choice.
    return [...matches, "Other"];
  }, [query]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Focus the search box when opening
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  // Keep the highlighted option visible while using arrow keys
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active];
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function openPanel() {
    const idx = value ? UNIVERSITIES.indexOf(value) : 0;
    setActive(Math.max(0, idx));
    setOpen(true);
  }

  function closePanel({ refocus = false } = {}) {
    setOpen(false);
    setQuery("");
    if (refocus) triggerRef.current?.focus();
  }

  function select(next) {
    onChange(next);
    closePanel({ refocus: true });
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault(); // don't submit the review form
      if (options[active]) select(options[active]);
    } else if (e.key === "Escape") {
      e.stopPropagation(); // close just the dropdown, not the whole modal
      closePanel({ refocus: true });
    }
  }

  return (
    <div className={`uni-select ${disabled ? "uni-select--disabled" : ""}`} ref={rootRef}>
      <div className={`uni-select__control ${open ? "uni-select__control--open" : ""}`}>
        <button
          type="button"
          ref={triggerRef}
          className="uni-select__trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => (open ? closePanel() : openPanel())}
        >
          <span className="uni-select__icon">
            <CapIcon />
          </span>
          <span className={`uni-select__value ${value ? "" : "uni-select__value--placeholder"}`}>
            {value || "Select your university"}
          </span>
        </button>

        {value && !disabled && (
          <button
            type="button"
            className="uni-select__clear"
            aria-label="Clear university"
            onClick={() => onChange("")}
          >
            ×
          </button>
        )}

        <span className={`uni-select__chevron ${open ? "uni-select__chevron--open" : ""}`}>
          <ChevronIcon />
        </span>
      </div>

      {open && (
        <div className="uni-select__panel">
          <div className="uni-select__search">
            <SearchIcon />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Search ${UNIVERSITIES.length - 1} universities…`}
              aria-label="Search universities"
              autoComplete="off"
            />
          </div>

          <ul className="uni-select__list" role="listbox" ref={listRef}>
            {options.map((u, i) => {
              const selected = u === value;
              return (
                <li
                  key={u}
                  role="option"
                  aria-selected={selected}
                  className={[
                    "uni-select__option",
                    i === active ? "uni-select__option--active" : "",
                    selected ? "uni-select__option--selected" : "",
                    u === "Other" ? "uni-select__option--other" : "",
                  ].join(" ")}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(u)}
                >
                  <span>{u}</span>
                  {selected && (
                    <span className="uni-select__check">
                      <CheckIcon />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}