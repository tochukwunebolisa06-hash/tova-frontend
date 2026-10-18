import { NavLink } from "react-router-dom";
import "./MobileTabBar.css";

const TABS = [
  {
    to: "/",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 11.5 12 4l8 7.5" />
        <path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" />
      </svg>
    ),
  },
  {
    to: "/about",
    label: "About",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </svg>
    ),
  },
  {
    to: "/features",
    label: "Features",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    to: "/faqs",
    label: "FAQs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .8-1 1.7" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
];

export default function MobileTabBar() {
  return (
    <nav className="mobile-tabbar" aria-label="Primary">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className={({ isActive }) =>
            isActive ? "mobile-tabbar__item mobile-tabbar__item--active" : "mobile-tabbar__item"
          }
        >
          <span className="mobile-tabbar__icon" aria-hidden="true">{tab.icon}</span>
          <span className="mobile-tabbar__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}