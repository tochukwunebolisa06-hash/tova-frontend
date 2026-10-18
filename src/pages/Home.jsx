import LiveWaitlistCounter from "../components/LiveWaitlistCounter";
import JoinWaitlistCard from "../components/JoinWaitlistCard";
import TestimonialsTabs from "../components/TestimonialsTabs";
import ChurchPartnerships from "../components/ChurchPartnerships";
import "./Home.css";

/* ---------- Hero scene (sunrise, mountains, cross) ----------
   To use a real photo instead: delete <HeroScene /> below and add
   background-image: url("/hero-bg.jpg") to .hero__scene in Home.css
   (put the photo in /public/hero-bg.jpg). */

function HeroScene() {
  return (
    <div className="hero__scene" aria-hidden="true">
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMaxYMin slice">
        <defs>
          <radialGradient id="tv-sun" cx="88%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffd9a8" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#f6c9a0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f6c9a0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#tv-sun)" />
        <path
          d="M0 360 C120 320 200 340 300 330 C420 318 480 290 580 310 C680 330 740 300 800 320 L800 600 L0 600Z"
          fill="#b9c8de"
          opacity="0.75"
        />
        <path d="M590 345 Q690 265 800 345Z" fill="#3a4a66" />
        <rect x="692" y="205" width="9" height="78" rx="2" fill="#3a4a66" />
        <rect x="675" y="224" width="43" height="8" rx="2" fill="#3a4a66" />
        <path
          d="M0 420 C100 390 220 410 330 395 C450 380 540 400 640 380 C720 365 770 380 800 372 L800 600 L0 600Z"
          fill="#8ea6c8"
          opacity="0.85"
        />
        <path
          d="M0 480 C140 450 260 470 380 455 C520 440 640 470 800 440 L800 600 L0 600Z"
          fill="#6482aa"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

/* ---------- Page ---------- */

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <HeroScene />
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              The Christian community, connected.
            </h1>
            <p className="hero__subtitle">
              Faith, community, giving and more, all in one place.
            </p>
            <LiveWaitlistCounter />
          </div>

          <JoinWaitlistCard />
        </div>
      </section>

      <TestimonialsTabs />
      <ChurchPartnerships />
    </div>
  );
}