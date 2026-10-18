import "./About.css";
import heroImg from "../assets/about-hero.jpg";
import quoteImg from "../assets/about-quote-bg.jpg";

/* ---------- Hero ---------- */

function AboutHero({ image = heroImg }) {
  return (
    <section className="about__hero">
      <div className="container about__hero-inner">
        <div className="about__hero-copy">
          <p className="about__eyebrow">About Tova</p>

          <h1 className="about__title">
            Built for a
            <br />
            Stronger Faith.
          </h1>

          <p className="about__subtitle">
            Tova is the all-in-one digital platform for the global Christian
            community — bringing together inspiring content, churches, giving,
            commerce and meaningful community.
          </p>
        </div>

        <div className="about__hero-visual">
          <div
            className="about__hero-image"
            style={
              image
                ? { backgroundImage: `url(${image})` }
                : undefined
            }
          >
            <p className="about__hero-caption">
              One body
              <br />
              in Christ.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Values ---------- */

const VALUES = [
  {
    title: "Faith First",
    body: "Everything we build is rooted in God's purpose.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M12 3v18M7.5 8.5h9" />
      </svg>
    ),
  },
  {
    title: "Community",
    body: "We believe in the power of people, together.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="9" cy="8" r="3" />
        <path d="M2 20a7 7 0 0 1 14 0" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M15.5 13a5.5 5.5 0 0 1 6.5 5.4" />
      </svg>
    ),
  },
  {
    title: "Integrity",
    body: "We create a safe and trustworthy space for all.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M12 3l7 3v6c0 5-3 7.5-7 9-4-1.5-7-4-7-9V6z" />
      </svg>
    ),
  },
  {
    title: "Excellence",
    body: "We strive for quality in everything we do.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M20.8 8.6a4 4 0 0 0-6.6-3 4 4 0 0 0-6.6 3c0 5 6.6 9 6.6 9s6.6-4 6.6-9z" />
      </svg>
    ),
  },
  {
    title: "Global Impact",
    body: "We're building for Christians everywhere.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
];

function ValuesSection() {
  return (
    <section className="about__values">
      <div className="container">
        <p className="about__eyebrow">Our Values</p>

        <h2 className="about__values-title">What We Stand For</h2>

        <div className="about__values-grid">
          {VALUES.map((v) => (
            <div className="about__value" key={v.title}>
              <span className="about__value-icon" aria-hidden="true">
                {v.icon}
              </span>

              <p className="about__value-name">{v.title}</p>

              <p className="about__value-body">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Mission / Vision ---------- */

function MissionVisionSection() {
  return (
    <section className="about__mv-wrap">
      <div className="container">
        <div className="about__mv">
          <div className="about__mv-col">
            <p className="about__eyebrow">Our Mission</p>

            <h2 className="about__mv-title">
              Connect. Equip. Empower.
            </h2>

            <p className="about__mv-body">
              To make it easier for every Christian, in every language, to
              grow in faith, belong to community and make a lasting impact.
            </p>
          </div>

          <div className="about__mv-col">
            <p className="about__eyebrow">Our Vision</p>

            <h2 className="about__mv-title">
              A Global Community.
              <br />
              One Body in Christ.
            </h2>

            <p className="about__mv-body">
              We believe in a world where every believer, in every language,
              has access to the tools, community and resources they need to
              grow, give and make an impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Quote ---------- */

function QuoteSection({ image = quoteImg }) {
  return (
    <section
      className="about__quote"
      style={
        image
          ? { backgroundImage: `url(${image})` }
          : undefined
      }
      aria-label="The Foundation: For where two or three gather in my name, there am I with them. Matthew 18:20."
    />
  );
}

/* ---------- About Page ---------- */

export default function About({ heroImage, quoteImage }) {
  return (
    <div className="about">
      <AboutHero image={heroImage} />

      <ValuesSection />

      <MissionVisionSection />

      <QuoteSection image={quoteImage} />
    </div>
  );
}