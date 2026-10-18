import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTestimonials } from "../api/client";
import TestimonialModal from "./TestimonialModal";
import "./TestimonialsTabs.css";
import "./TestimonialExtras.css";

/* ---------------------------------------------------------------
   SAMPLE QUOTES (Students & Members only). These show while that
   column has no approved reviews in the database. As soon as one
   approved review exists (Testimonials → Testimonials in Django
   admin), the samples disappear. Set SHOW_SAMPLES_WITH_REAL to true
   to keep mixing them in.

   The Pastors & Church Leaders column has no samples: until a
   review with category "Pastor / Church leader" is approved, it
   shows an invitation card instead.
   Optional: add `photo: importedImage` to show a real photo.
---------------------------------------------------------------- */

const SHOW_SAMPLES_WITH_REAL = false;

const STUDENTS = [
  {
    name: "Precious A.",
    meta: "Student, Covenant University",
    quote: "Tova will make it so easy to stay connected with my church and also find like-minded people. I'm so excited for this!",
  },
  {
    name: "Daniel K.",
    meta: "Student, UniLag",
    quote: "I love that everything is in one place — sermons, community, giving and resources. It's exactly what we need.",
  },
  {
    name: "Ejiro O.",
    meta: "Student, Babcock University",
    quote: "The interface looks clean and simple. I can already tell this will be a blessing for the Christian community.",
  },
];

const MAX_PER_COLUMN = 50;
const AUTOPLAY_MS = 6500;
const AVATAR_COLORS = ["#7d9bc7", "#c96b8f", "#3f8f6d", "#a35ce0", "#d9724c", "#3d5a9c"];

function initialsFor(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Stars({ rating = 5 }) {
  return (
    <div className="tt-card__stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          width="14"
          height="14"
          fill={n <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" />
        </svg>
      ))}
    </div>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="9" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
    </svg>
  );
}

function ChevronIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

function Avatar({ item }) {
  if (item.photo) {
    return <img className="tt-card__avatar" src={item.photo} alt={item.name} />;
  }
  // Anyone posting as "Anonymous…" gets the silhouette avatar
  if (/^anonymous/i.test(item.name)) {
    return (
      <span className="tt-card__avatar tt-card__avatar--anon">
        <PersonIcon />
      </span>
    );
  }
  return (
    <span className="tt-card__avatar" style={{ background: colorFor(item.name) }}>
      {initialsFor(item.name)}
    </span>
  );
}

function Card({ item }) {
  return (
    <article className="tt-card">
      <div className="tt-card__head">
        <Avatar item={item} />
        <div>
          <p className="tt-card__name">{item.name}</p>
          <p className="tt-card__meta">{item.meta}</p>
          <Stars rating={item.rating ?? 5} />
        </div>
      </div>
      <p className="tt-card__quote">&ldquo;{item.quote}&rdquo;</p>
    </article>
  );
}

/* One review at a time. Native scroll-snap handles swiping; arrows,
   dots and autoplay just scroll the same track. */
function Carousel({ items, visible }) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const [index, setIndex] = useState(0);
  const count = items.length;

  const goTo = useCallback(
    (i, behavior = "smooth") => {
      const el = trackRef.current;
      if (!el || el.clientWidth === 0 || count === 0) return; // 0 width = hidden tab
      const next = ((i % count) + count) % count;
      el.scrollTo({ left: next * el.clientWidth, behavior });
    },
    [count]
  );

  function handleScroll() {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  // When a hidden tab becomes visible again the browser resets its scroll
  // position, so jump back to where this carousel was.
  useEffect(() => {
    if (visible) goTo(index, "auto");
  }, [visible]); // eslint-disable-line

  // If the list shrinks (e.g. real reviews replace samples), snap back to the start
  useEffect(() => {
    if (index >= count) {
      setIndex(0);
      goTo(0, "auto");
    }
  }, [count]); // eslint-disable-line

  // Autoplay (restarts whenever the slide changes, paused while interacting)
  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => {
      if (!pausedRef.current) goTo(index + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [index, count, goTo]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      className="tt-carousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div className="tt-carousel__track" ref={trackRef} onScroll={handleScroll}>
        {items.map((item, i) => (
          <div className="tt-carousel__slide" key={`${item.id ?? item.name}-${i}`}>
            <Card item={item} />
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="tt-carousel__nav">
          <button
            type="button"
            className="tt-carousel__arrow"
            aria-label="Previous review"
            onClick={() => goTo(index - 1)}
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="tt-carousel__dots">
            {items.map((item, i) => (
              <button
                key={`${item.id ?? item.name}-dot-${i}`}
                type="button"
                aria-label={`Go to review ${i + 1}`}
                aria-current={i === index}
                className={`tt-carousel__dot ${i === index ? "tt-carousel__dot--active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="tt-carousel__arrow"
            aria-label="Next review"
            onClick={() => goTo(index + 1)}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}
    </div>
  );
}

/* Shown in a column that has no reviews yet */
function EmptyState({ icon, title, body, buttonLabel, onClick }) {
  return (
    <div className="tt-empty">
      <span className="tt-empty__icon" aria-hidden="true">{icon}</span>
      <p className="tt-empty__title">{title}</p>
      <p className="tt-empty__body">{body}</p>
      <button type="button" className="btn btn-primary tt-empty__button" onClick={onClick}>
        {buttonLabel}
      </button>
    </div>
  );
}

const PANELS = [
  {
    key: "students",
    category: "student",
    tab: "Students & Members",
    title: "Students & Members",
    sub: "Real people. Real experiences.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="3" />
        <circle cx="5.5" cy="10" r="2.2" />
        <circle cx="18.5" cy="10" r="2.2" />
        <path d="M7 20a5 5 0 0 1 10 0" />
        <path d="M1.5 19a4 4 0 0 1 4-4M22.5 19a4 4 0 0 0-4-4" />
      </svg>
    ),
    empty: {
      title: "No reviews yet",
      body: "Be the first to share what Tova has meant to you.",
      buttonLabel: "Share your story",
    },
  },
  {
    key: "leaders",
    category: "leader",
    tab: "Pastors & Church Leaders",
    title: "Pastors & Church Leaders",
    sub: "Anonymous and verified church leaders.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </svg>
    ),
    empty: {
      title: "Are you a pastor or church leader?",
      body: "Tell us what Tova could mean for your church. You can share anonymously.",
      buttonLabel: "Share as a church leader",
    },
  },
];

function buildList(real, samples) {
  if (real.length === 0) return samples;
  const merged = SHOW_SAMPLES_WITH_REAL ? [...real, ...samples] : real;
  return merged.slice(0, MAX_PER_COLUMN);
}

export default function TestimonialsTabs() {
  const [tab, setTab] = useState("students");
  const [apiItems, setApiItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState("student");

  function openModal(category) {
    setModalCategory(category);
    setModalOpen(true);
  }

  useEffect(() => {
    let cancelled = false;
    fetchTestimonials()
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        setApiItems(
          data.map((t) => ({
            id: t.id,
            name: t.name,
            meta:
              t.role ||
              t.university ||
              (t.category === "leader" ? "Church leader" : "Member"),
            quote: t.quote,
            rating: t.rating,
            category: t.category,
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const lists = {
    students: buildList(apiItems.filter((i) => i.category !== "leader"), STUDENTS),
    leaders: buildList(apiItems.filter((i) => i.category === "leader"), []),
  };

  return (
    <section className="tt">
      <div className="container">
        <p className="tt__eyebrow">Real people. Real experiences.</p>
        <h2 className="tt__title">What people are saying</h2>
        <p className="tt__subtitle">
          Hear from our community — from students and church members to pastors
          and church leaders.
        </p>

        <div className="tt__tabs" role="tablist">
          {PANELS.map((p) => (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={tab === p.key}
              className={`tt__tab ${tab === p.key ? "tt__tab--active" : ""}`}
              onClick={() => setTab(p.key)}
            >
              {p.tab}
            </button>
          ))}
        </div>

        <div className="tt__panels">
          {PANELS.map((p) => (
            <div
              key={p.key}
              role="tabpanel"
              className={`tt__panel ${tab === p.key ? "tt__panel--active" : ""}`}
            >
              <div className="tt__panel-head">
                <span className="tt__panel-icon" aria-hidden="true">{p.icon}</span>
                <div>
                  <h3 className="tt__panel-title">{p.title}</h3>
                  <p className="tt__panel-sub">{p.sub}</p>
                </div>
              </div>

              {lists[p.key].length > 0 ? (
                <Carousel items={lists[p.key]} visible={tab === p.key} />
              ) : (
                <EmptyState
                  icon={p.icon}
                  title={p.empty.title}
                  body={p.empty.body}
                  buttonLabel={p.empty.buttonLabel}
                  onClick={() => openModal(p.category)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="tt__cta">
          <button type="button" className="btn btn-primary" onClick={() => openModal("student")}>
            Leave a review <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <TestimonialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialCategory={modalCategory}
      />
    </section>
  );
}