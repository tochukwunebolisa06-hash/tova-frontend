import { useEffect, useState } from "react";
import { fetchTestimonials } from "../api/client";
import TestimonialModal from "./TestimonialModal";
import "./Testimonials.css";

const AVATAR_COLORS = ["#f0b429", "#3d5a9c", "#c96b8f", "#3f8f6d", "#a35ce0", "#d9724c"];

function initialsFor(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1"
      width="13"
      height="13"
    >
      <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 9l10-5 10 5-10 5L2 9z" />
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
      <path d="M22 9v6" />
    </svg>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchTestimonials()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      })
      .catch(() => {
        // Backend not reachable — testimonials stays empty, empty state shows below.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials__head">
          <div>
            <p className="testimonials__eyebrow">Real People. Real Impact.</p>
            <h2 className="testimonials__title">
              Loved by the Global
              <br />
              Christian Community
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-primary testimonials__cta"
            onClick={() => setModalOpen(true)}
          >
            Leave a Review
          </button>
        </div>

        {!loading && testimonials.length === 0 && (
          <div className="testimonials__empty">
            <span className="testimonials__empty-mark" aria-hidden="true">
              &ldquo;
            </span>
            <p className="testimonials__empty-title">No reviews yet</p>
            <p className="testimonials__empty-body">
              Be the first to share what Tova has meant to you.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setModalOpen(true)}
            >
              Leave the First Review
            </button>
          </div>
        )}

        {!loading && testimonials.length > 0 && (
          <div className="testimonials__grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.id ?? t.name}>
                <div className="testimonial-card__head">
                  <span className="testimonial-card__avatar" style={{ background: colorFor(t.name) }}>
                    {initialsFor(t.name)}
                  </span>
                  <div className="testimonial-card__name-col">
                    <p className="testimonial-card__name">{t.name}</p>
                    {t.university && (
                      <p className="testimonial-card__uni" title={t.university}>
                        <CapIcon />
                        <span>{t.university}</span>
                      </p>
                    )}
                    <div className="testimonial-card__stars" aria-label={`${t.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} filled={n <= t.rating} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="testimonial-card__quote-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <p className="testimonial-card__quote">{t.quote}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <TestimonialModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}