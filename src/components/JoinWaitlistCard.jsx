import { useEffect, useState } from "react";
import { joinWaitlist, fetchWaitlistCount } from "../api/client";
import ContactMethodToggle, { MailIcon, PhoneIcon } from "./ContactMethodToggle";
import "./JoinWaitlistCard.css";

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

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20a7 7 0 0 1 14 0" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.5 13a5.5 5.5 0 0 1 6.5 5.4" />
    </svg>
  );
}

export default function JoinWaitlistCard() {
  const [method, setMethod] = useState("email"); // email | phone
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchWaitlistCount()
      .then((data) => {
        if (!cancelled && typeof data?.count === "number") setCount(data.count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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
      if (!res?.already_joined) setCount((c) => (c === null ? c : c + 1));
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <div className="join-card">
      <h2 className="join-card__title">Join Tova&rsquo;s Waitlist</h2>
      <p className="join-card__subtitle">Be the first to know when we launch.</p>

      {status === "success" ? (
        <div className="join-card__success" role="status">
          <span className="join-card__success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <p>{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <ContactMethodToggle
            value={method}
            onChange={handleMethodChange}
            disabled={status === "loading"}
          />

          <div className="join-card__field">
            <span className="join-card__field-icon" aria-hidden="true">
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
          </div>

          {status === "error" && <p className="join-card__error">{message}</p>}

          <button
            type="submit"
            className="btn btn-primary join-card__submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              "Joining..."
            ) : (
              <>
                Join Waitlist <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </form>
      )}

      {count !== null && count > 0 && (
        <p className="join-card__count">
          <UsersIcon />
          <span>
            <strong>{count.toLocaleString("en-US")}</strong> people are already waiting
          </span>
        </p>
      )}
    </div>
  );
}