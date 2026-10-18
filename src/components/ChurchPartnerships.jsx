import { useEffect, useRef, useState } from "react";
import { fetchPartners } from "../api/client";
import PartnershipModal from "./PartnershipModal";
import "./ChurchPartnerships.css";

/* Partners come from the backend only (Django admin → Partners →
   Church partners). With none published, the carousel is hidden and
   just the heading + "Join Partnership" button show. */

function Monogram() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="butt" aria-hidden="true">
      <path d="M48 14a25 25 0 1 0 0 36" />
      <path d="M43 25a11 11 0 1 0 0 14" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20a7 7 0 0 1 14 0" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.5 13a5.5 5.5 0 0 1 6.5 5.4" />
    </svg>
  );
}

export default function ChurchPartnerships() {
  const [partners, setPartners] = useState([]);
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const touchStartX = useRef(null);
  const count = partners.length;

  // Load published partners from the backend
  useEffect(() => {
    let cancelled = false;
    fetchPartners()
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        setPartners(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            sub: p.subtitle,
            location: p.location,
            logo: p.logo_url,
            quote: p.quote,
            author: p.author,
            role: p.role,
            rating: p.rating,
          }))
        );
        setIndex(0);
      })
      .catch(() => {
        // Backend unreachable: no carousel, CTA still works.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-advance; timer restarts whenever the slide changes (including manual taps)
  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setIndex((n) => (n + 1) % count), 7000);
    return () => clearInterval(id);
  }, [index, count]);

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    setIndex((n) => (dx < 0 ? (n + 1) % count : (n - 1 + count) % count));
  }

  return (
    <section className="cp">
      <div className="container cp__inner">
        <p className="cp__eyebrow">Church partnerships</p>
        <h2 className="cp__title">
          Building stronger church communities together.
        </h2>
        <p className="cp__subtitle">
          We partner with churches that are passionate about reaching people,
          growing faith and making a lasting impact.
        </p>

        {count > 0 && (
          <div className="cp__carousel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="cp__track" style={{ transform: `translateX(-${index * 100}%)` }}>
              {partners.map((p, i) => (
                <article className="cp__slide" key={p.id ?? `${p.name}-${i}`} aria-roledescription="slide">
                  <div className="cp__slide-head">
                    {p.logo ? (
                      <img className="cp__logo" src={p.logo} alt={`${p.name} logo`} />
                    ) : (
                      <span className="cp__logo cp__logo--mono">
                        <Monogram />
                      </span>
                    )}
                    <div className="cp__slide-id">
                      <p className="cp__church">{p.name}</p>
                      {p.sub && <p className="cp__church-sub">{p.sub}</p>}
                      {p.location && (
                        <p className="cp__location">
                          <PinIcon />
                          {p.location}
                        </p>
                      )}
                      <span className="cp__tag">Church partnership</span>
                    </div>
                  </div>

                  <blockquote className="cp__quote">&ldquo;{p.quote}&rdquo;</blockquote>

                  <div className="cp__stars" aria-label={`${p.rating ?? 5} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <svg
                        key={n}
                        viewBox="0 0 20 20"
                        width="20"
                        height="20"
                        fill={n <= (p.rating ?? 5) ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" />
                      </svg>
                    ))}
                  </div>

                  <div className="cp__author">
                    <span className="cp__author-icon"><PeopleIcon /></span>
                    <div>
                      <p className="cp__author-name">{p.author}</p>
                      {p.role && <p className="cp__author-role">{p.role}</p>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {count > 1 && (
          <div className="cp__dots" role="tablist" aria-label="Choose partner">
            {partners.map((p, i) => (
              <button
                key={p.id ?? `${p.name}-dot-${i}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${p.name}`}
                className={`cp__dot ${i === index ? "cp__dot--active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}

        <div className="cp__cta">
          <span className="cp__cta-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 2v5M9.5 4.5h5" />
              <path d="M12 7 5 12v9h5v-5h4v5h5v-9z" />
            </svg>
          </span>
          <h3 className="cp__cta-title">Join Our Ministry Partnership</h3>
          <p className="cp__cta-body">
            Partner with Tova and help us reach more people with the hope of Christ.
          </p>
          <button
            type="button"
            className="btn btn-primary cp__cta-button"
            onClick={() => setModalOpen(true)}
          >
            Join Partnership <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <PartnershipModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}