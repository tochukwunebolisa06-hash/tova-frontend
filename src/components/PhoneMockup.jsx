import "./PhoneMockup.css";

/**
 * Placeholder phone frame. Once you have the real app screenshot:
 *   import screenshot from "../assets/app-screenshot.png";
 *   <PhoneMockup screenshot={screenshot} />
 */
export default function PhoneMockup({ screenshot, label = "App preview" }) {
  return (
    <div className="phone">
      <div className="phone__notch" />
      {screenshot ? (
        <img src={screenshot} alt={label} className="phone__screen-img" />
      ) : (
        <div className="phone__screen phone__screen--placeholder">
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
