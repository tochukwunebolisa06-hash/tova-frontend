import "./ContactMethodToggle.css";

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 6.5l9 6.5 9-6.5" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

const OPTIONS = [
  { value: "email", label: "Email", Icon: MailIcon },
  { value: "phone", label: "Phone", Icon: PhoneIcon },
];

/**
 * Segmented control for choosing how to join the waitlist.
 *   value:    "email" | "phone"
 *   onChange: (nextValue) => void
 *   variant:  "default" (white track, for tinted backgrounds) | "soft" (for white cards)
 */
export default function ContactMethodToggle({ value, onChange, disabled = false, variant = "default" }) {
  return (
    <div
      className={`contact-toggle ${variant === "soft" ? "contact-toggle--soft" : ""}`}
      role="radiogroup"
      aria-label="Join the waitlist with"
    >
      {OPTIONS.map(({ value: optionValue, label, Icon }) => {
        const active = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            className={`contact-toggle__option ${active ? "contact-toggle__option--active" : ""}`}
            onClick={() => onChange(optionValue)}
          >
            <Icon />
            {label}
          </button>
        );
      })}
    </div>
  );
}