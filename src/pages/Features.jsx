import phonesImg from "../assets/phones.png";
import { useWaitlistModal } from "../context/WaitlistModalContext";
import "./Features.css";

const FEATURES = [
  {
    title: "Christian Media",
    body: "Watch sermons, videos, livestreams and faith-based programming from trusted ministries and creators.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 6.5l9 6.5 9-6.5" />
      </svg>
    ),
  },
  {
    title: "Church Tools",
    body: "Help your church stay connected, manage your community and engage your members — all in one place.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 11.5 12 4l8 7.5" />
        <path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" />
      </svg>
    ),
  },
  {
    title: "Giving",
    body: "Tithe, offerings, seeds and more. Support the work of God, securely and easily.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M20.8 8.6a4 4 0 0 0-6.6-3 4 4 0 0 0-6.6 3c0 5 6.6 9 6.6 9s6.6-4 6.6-9z" />
      </svg>
    ),
  },
  {
    title: "Christian Commerce",
    body: "Shop faith-based products, books, apparel and resources from trusted sellers.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 8h12l-1 12H7L6 8z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    ),
  },
  {
    title: "eBooks & Devotionals",
    body: "Grow deeper with spiritual resources, from daily devotionals to in-depth study materials.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 5.5A2 2 0 0 1 6 4h6v16H6a2 2 0 0 0-2 1.5V5.5z" />
        <path d="M20 5.5A2 2 0 0 0 18 4h-6v16h6a2 2 0 0 1 2 1.5V5.5z" />
      </svg>
    ),
  },
  {
    title: "Kids & Family",
    body: "Safe, faith-based entertainment and educational content for children of all ages.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="8" cy="9" r="3" />
        <circle cx="16" cy="9" r="3" />
        <path d="M3 20a5 5 0 0 1 10 0" />
        <path d="M11 20a5 5 0 0 1 10 0" />
      </svg>
    ),
  },
  {
    title: "Global Community",
    body: "Connect with believers across the world, across languages, cultures and churches.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="8" r="3" />
        <path d="M2 20a7 7 0 0 1 14 0" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M15.5 13a5.5 5.5 0 0 1 6.5 5.4" />
      </svg>
    ),
  },
  {
    title: "Multi-Language",
    body: "Experience Tova in your language. Because faith has no borders.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    title: "Safe & Trusted",
    body: "Verified content, vetted sellers and a secure platform designed for the Christian community.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3l7 3v6c0 5-3 7.5-7 9-4-1.5-7-4-7-9V6z" />
      </svg>
    ),
  },
];

function FeaturesHero() {
  return (
    <section className="features-hero">
      <div className="container features-hero__inner">
        <div className="features-hero__copy">
          <p className="features-hero__eyebrow">Features</p>
          <h1 className="features-hero__title">
            Everything You
            <br />
            Need in One Place.
          </h1>
          <p className="features-hero__subtitle">
            Tova brings together faith, community, resources and more — all
            in one powerful platform.
          </p>
        </div>

        <div className="features-hero__visual">
          <img src={phonesImg} alt="The Tova app showing Home and Giving screens" />
        </div>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  return (
    <section className="features-grid-section">
      <div className="container features-grid">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <span className="feature-card__icon" aria-hidden="true">{f.icon}</span>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__body">{f.body}</p>
            <span className="feature-card__arrow" aria-hidden="true">→</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesCta() {
  const { open: openWaitlist } = useWaitlistModal();

  return (
    <section className="features-cta">
      <div className="container features-cta__inner">
        <p className="features-cta__script">Faith. Community. Impact.</p>

        <span className="features-cta__divider" aria-hidden="true" />

        <p className="features-cta__tagline">
          More than an app.
          <br />
          It's a movement.
        </p>

        <button className="btn btn-primary features-cta__button" onClick={openWaitlist}>
          Join the Waitlist <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

export default function Features() {
  return (
    <div className="features">
      <FeaturesHero />
      <FeaturesGrid />
      <FeaturesCta />
    </div>
  );
}