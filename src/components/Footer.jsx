import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import "./Footer.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/faqs", label: "FAQs" },
];

const SOCIALS = [
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "X", href: "#", icon: "x" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "Facebook", href: "#", icon: "facebook" },
];

function SocialIcon({ icon }) {
  switch (icon) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 3h3.6l4 5.4L15.9 3H19l-6 7.6L19.4 21h-3.6l-4.2-5.7L6.4 21H3l6.4-8.1L4 3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="6" width="18" height="12" rx="4" />
          <path d="M11 10l4 2-4 2v-4z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M14 21v-6.6h2.4l.4-2.8H14V9.7c0-.8.2-1.4 1.4-1.4h1.5V5.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.9H8.3v2.8h2.4V21" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo />

        <nav className="footer__links">
          <ul>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__right">
          <div className="footer__socials">
            {SOCIALS.map((s) => (
              <a key={s.icon} href={s.href} aria-label={s.label} className="footer__social">
                <SocialIcon icon={s.icon} />
              </a>
            ))}
          </div>
          <span className="footer__divider" aria-hidden="true" />
          <p className="footer__copy">© 2025 Tova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
