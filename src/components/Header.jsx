import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useWaitlistModal } from "../context/WaitlistModalContext";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/faqs", label: "FAQs" },
];

export default function Header() {
  const { open: openWaitlist } = useWaitlistModal();

  return (
    <header className="header">
      <div className="container header__inner">
        <NavLink to="/" className="header__logo-link" aria-label="Tova home">
          <Logo />
        </NavLink>

        <nav className="header__nav">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    isActive ? "header__link header__link--active" : "header__link"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button className="btn btn-primary header__cta" onClick={openWaitlist}>
          Join the Waitlist <span aria-hidden="true">→</span>
        </button>
      </div>
    </header>
  );
}