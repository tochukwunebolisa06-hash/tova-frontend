import { useState } from "react";
import { joinWaitlist } from "../api/client";
import ContactMethodToggle, { MailIcon, PhoneIcon } from "./ContactMethodToggle";
import "./HeroWaitlistForm.css";

const INPUT_PROPS = {
  email: {
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    placeholder: "Enter your email address",
    "aria-label": "Email address",
  },
  phone: {
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    placeholder: "Phone number with country code",
    "aria-label": "Phone number",
  },
};

export default function HeroWaitlistForm() {
  const [method, setMethod] = useState("email"); // email | phone
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  function handleMethodChange(next) {
    if (next === method) return;
    setMethod(next);
    setValue("");
    setStatus("idle");
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    setStatus("loading");
    try {
      const res = await joinWaitlist({ [method]: value.trim() });
      setStatus("success");
      setMessage(res?.detail || "You're on the waitlist!");
      setValue("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  if (status === "success") {
    return (
      <div className="hero-waitlist hero-waitlist--success">
        <span className="hero-waitlist__success-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="hero-waitlist-wrap">
      <ContactMethodToggle
        value={method}
        onChange={handleMethodChange}
        disabled={status === "loading"}
      />

      <form className="hero-waitlist" onSubmit={handleSubmit}>
        <span className="hero-waitlist__icon" aria-hidden="true">
          {method === "email" ? <MailIcon /> : <PhoneIcon />}
        </span>
        <input
          key={method}
          {...INPUT_PROPS[method]}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          required
        />
        <button type="submit" className="hero-waitlist__submit" disabled={status === "loading"}>
          {status === "loading" ? "Joining..." : (
            <>Join the Waitlist <span aria-hidden="true">→</span></>
          )}
        </button>
      </form>
      {status === "error" && <p className="hero-waitlist__error">{message}</p>}
    </div>
  );
}