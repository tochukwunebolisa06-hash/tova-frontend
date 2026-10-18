import { useEffect, useState } from "react";
import { submitPartnershipInquiry } from "../api/client";
import "./PartnershipModal.css";

const EMPTY = { church_name: "", email: "", phone: "", message: "" };

/* Reuses the waitlist modal's look (those styles are already loaded
   globally via Layout), plus a little extra in PartnershipModal.css. */
export default function PartnershipModal({ isOpen, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Reset status each time the modal is reopened
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitPartnershipInquiry({
        church_name: form.church_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <div className="waitlist-modal__backdrop" onClick={onClose}>
      <div
        className="waitlist-modal partnership-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="partnership-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="waitlist-modal__close" aria-label="Close" onClick={onClose}>
          ×
        </button>

        {status === "success" ? (
          <div className="waitlist-modal__success">
            <h2 id="partnership-modal-title">Thank you!</h2>
            <p>We've received your request and our team will be in touch soon.</p>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id="partnership-modal-title">Join Our Ministry Partnership</h2>
            <p className="waitlist-modal__subtitle">
              Tell us about your church and we'll reach out.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="waitlist-modal__field">
                <span>Church or ministry name</span>
                <input
                  type="text"
                  value={form.church_name}
                  onChange={set("church_name")}
                  placeholder="e.g. City Church Lagos"
                  maxLength={150}
                  required
                />
              </label>

              <label className="waitlist-modal__field">
                <span>Email</span>
                <input
                  type="email"
                  inputMode="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@church.org"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="waitlist-modal__field">
                <span>Phone (optional)</span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+234 801 234 5678"
                  autoComplete="tel"
                  maxLength={30}
                />
              </label>

              <label className="waitlist-modal__field">
                <span>Message (optional)</span>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Anything you'd like us to know?"
                  rows={3}
                  maxLength={1000}
                />
              </label>

              {status === "error" && <p className="waitlist-modal__error">{message}</p>}

              <button
                type="submit"
                className="btn btn-primary waitlist-modal__submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending..." : "Send Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}