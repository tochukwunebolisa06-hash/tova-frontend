import { useEffect, useState } from "react";
import { submitTestimonial } from "../api/client";
import UniversitySelect from "./UniversitySelect";
import "./TestimonialModal.css";
import "./TestimonialExtras.css";

const STAR_LABELS = ["Poor", "Fair", "Good", "Great", "Excellent"];

const ROLE_OPTIONS = [
  { value: "student", label: "Student / Member" },
  { value: "leader", label: "Pastor / Church leader" },
];

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IncognitoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 13l1.5-5.5A3 3 0 0 1 7.4 5.3h9.2a3 3 0 0 1 2.9 2.2L21 13" />
      <circle cx="7" cy="15.5" r="2.5" />
      <circle cx="17" cy="15.5" r="2.5" />
      <path d="M9.5 15.5h5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* initialCategory: "student" | "leader" — which option is preselected
   each time the modal opens (the empty church-leader card passes "leader"). */
export default function TestimonialModal({ isOpen, onClose, initialCategory = "student" }) {
  const [category, setCategory] = useState(initialCategory);
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const isLeader = category === "leader";

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Reset state each time the modal is reopened
  useEffect(() => {
    if (isOpen) {
      setCategory(initialCategory);
      setStatus("idle");
      setMessage("");
    }
  }, [isOpen, initialCategory]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const anonymousName = isLeader ? "Anonymous Pastor" : "Anonymous";
      await submitTestimonial({
        name: isAnonymous ? anonymousName : name.trim(),
        quote: quote.trim(),
        rating,
        category,
        university: isLeader ? "" : university,
        role: isLeader ? role.trim() : "",
      });
      setStatus("success");
      setName("");
      setUniversity("");
      setRole("");
      setQuote("");
      setRating(5);
      setIsAnonymous(false);
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <div className="testimonial-modal__backdrop" onClick={onClose}>
      <div
        className="testimonial-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="testimonial-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="testimonial-modal__close" aria-label="Close" onClick={onClose}>
          ×
        </button>

        {status === "success" ? (
          <div className="testimonial-modal__success">
            <h2 id="testimonial-modal-title">Thank you!</h2>
            <p>Your review has been submitted and will appear on the site once it's approved.</p>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id="testimonial-modal-title">Share Your Story</h2>
            <p className="testimonial-modal__subtitle">
              {isLeader
                ? "Tell the community what Tova means for your church and ministry."
                : "Tell the community what Tova has meant to you."}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="testimonial-modal__field">
                <span>I am a…</span>
                <div className="tm-role" role="radiogroup" aria-label="I am a">
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={category === opt.value}
                      className={`tm-role__option ${
                        category === opt.value ? "tm-role__option--active" : ""
                      }`}
                      onClick={() => setCategory(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <label
                className={`testimonial-modal__field ${
                  isAnonymous ? "testimonial-modal__field--disabled" : ""
                }`}
              >
                <span>Your name</span>
                <input
                  type="text"
                  value={isAnonymous ? "" : name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAnonymous ? "Hidden — posting anonymously" : "Your name"}
                  autoComplete="name"
                  maxLength={120}
                  disabled={isAnonymous}
                  required={!isAnonymous}
                />
              </label>

              <div
                className={`testimonial-modal__anon ${
                  isAnonymous ? "testimonial-modal__anon--active" : ""
                }`}
              >
                <span className="testimonial-modal__anon-icon" aria-hidden="true">
                  {isAnonymous ? <IncognitoIcon /> : <EyeIcon />}
                </span>

                <span className="testimonial-modal__anon-text">
                  <span className="testimonial-modal__anon-title">Post anonymously</span>
                  <span className="testimonial-modal__anon-hint">
                    {isAnonymous
                      ? `Your review will show as \u201c${isLeader ? "Anonymous Pastor" : "Anonymous"}\u201d`
                      : "Your name will be shown"}
                  </span>
                </span>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isAnonymous}
                  aria-label="Post anonymously"
                  className="testimonial-modal__anon-switch"
                  onClick={() => setIsAnonymous((v) => !v)}
                >
                  <span className="testimonial-modal__anon-thumb">
                    <CheckIcon />
                  </span>
                </button>
              </div>

              {isLeader ? (
                <label className="testimonial-modal__field">
                  <span>
                    Your role &amp; church <em className="testimonial-modal__optional">(optional)</em>
                  </span>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Pastor, Lagos"
                    maxLength={150}
                  />
                </label>
              ) : (
                <div className="testimonial-modal__field">
                  <span>
                    University <em className="testimonial-modal__optional">(optional)</em>
                  </span>
                  <UniversitySelect
                    value={university}
                    onChange={setUniversity}
                    disabled={status === "loading"}
                  />
                </div>
              )}

              <label className="testimonial-modal__field">
                <span>Your review</span>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder={
                    isLeader
                      ? "What would Tova mean for your church?"
                      : "What's your experience with Tova been like?"
                  }
                  rows={4}
                  maxLength={600}
                  required
                />
              </label>

              <div className="testimonial-modal__field">
                <span>Rating</span>
                <div className="testimonial-modal__stars" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={`testimonial-modal__star ${
                        value <= (hoverRating || rating) ? "testimonial-modal__star--filled" : ""
                      }`}
                      role="radio"
                      aria-checked={value === rating}
                      aria-label={`${value} star${value > 1 ? "s" : ""} — ${STAR_LABELS[value - 1]}`}
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
                        <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {status === "error" && <p className="testimonial-modal__error">{message}</p>}

              <button
                type="submit"
                className="btn btn-primary testimonial-modal__submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Submitting..." : "Submit for Review"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}