import logoImg from "../assets/logo.png";
import "./Logo.css";

export default function Logo({ size = "md" }) {
  return (
    <img
      src={logoImg}
      alt="Tova"
      className={`logo logo--${size}`}
    />
  );
}