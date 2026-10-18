import { useEffect, useState } from "react";
import { useWaitlistModal } from "../context/WaitlistModalContext";
import { joinWaitlist } from "../api/client";
import ContactMethodToggle from "./ContactMethodToggle";
import LiveWaitlistCounter from "./LiveWaitlistCounter";
import "./WaitlistModal.css";

const FIELD_CONFIG = {
  email: {
    label: "Email",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
    hint: null,
  },
  phone: {
    label: "Phone number",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    placeholder: "+234 801 234 5678",
    hint: "Include your country code, e.g. +234.",
  },
};

export default function WaitlistModal() {
  const { isOpen, close } = useWaitlistModal();
  const [name, setName] = useState("");
  const [method, setMethod] = useState("email"); // email | phone
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // Reset form state each time the modal is reopened
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const field = FIELD_CONFIG[method];

  function handleMethodChange(next) {
    if (next === method) return;
    setMethod(next);
    setContact("");
    setStatus("idle");
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await joinWaitlist({ [method]: contact.trim(), name: name.trim() });
      setStatus("success");
      setMessage(res?.detail || "You're on the waitlist!");
      setName("");
      setContact("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <div className="waitlist-modal__backdrop" onClick={close}>
      <div
        className="waitlist-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="waitlist-modal__close" aria-label="Close" onClick={close}>
          ×
        </button>

        {status === "success" ? (
          <div className="waitlist-modal__success">
            <h2 id="waitlist-modal-title">You're in.</h2>
            <p>{message}</p>
            <button className="btn btn-primary" onClick={close}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id="waitlist-modal-title">Join the Waitlist</h2>
            <p className="waitlist-modal__subtitle">
              Be first to know when Tova launches.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="waitlist-modal__field">
                <span>Name (optional)</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>

              <ContactMethodToggle
                variant="soft"
                value={method}
                onChange={handleMethodChange}
                disabled={status === "loading"}
              />

              <label className="waitlist-modal__field">
                <span>{field.label}</span>
                <input
                  key={method}
                  type={field.type}
                  inputMode={field.inputMode}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
                {field.hint && <span className="waitlist-modal__hint">{field.hint}</span>}
              </label>

              {status === "error" && <p className="waitlist-modal__error">{message}</p>}

              <div className="waitlist-modal__counter">
                <LiveWaitlistCounter variant="compact" />
              </div>

              <button type="submit" className="btn btn-primary waitlist-modal__submit" disabled={status === "loading"}>
                {status === "loading" ? "Joining..." : "Join the Waitlist"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}