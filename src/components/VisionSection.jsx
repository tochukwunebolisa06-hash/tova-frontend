import "./VisionSection.css";

const STATS = [
  {
    title: "Global Reach",
    body: "Across countries, churches and languages.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    title: "Stronger Communities",
    body: "Real connection. Lasting impact.",
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
    title: "More Ways to Give",
    body: "Support what God is doing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M20.8 8.6a4 4 0 0 0-6.6-3 4 4 0 0 0-6.6 3c0 5 6.6 9 6.6 9s6.6-4 6.6-9z" />
      </svg>
    ),
  },
  {
    title: "Sustainable Growth",
    body: "For people, ministries and future generations.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </svg>
    ),
  },
];

export default function VisionSection() {
  return (
    <section className="vision">
      <div className="container vision__inner">
        <div className="vision__copy">
          <p className="vision__eyebrow">Our Vision</p>
          <h2 className="vision__title">
            A Global Community.
            <br />
            One Body in Christ.
          </h2>
          <p className="vision__body">
            We believe in a world where every believer, in every language, has access to
            the tools, community and resources they need to grow, give and make an impact.
          </p>
        </div>

        <div className="vision__stats">
          {STATS.map((s) => (
            <div className="vision__stat" key={s.title}>
              <span className="vision__stat-icon" aria-hidden="true">{s.icon}</span>
              <p className="vision__stat-title">{s.title}</p>
              <p className="vision__stat-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}