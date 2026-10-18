import phonesImg from "../assets/phones.png";
import "./AppPreviewStack.css";

export default function AppPreviewStack() {
  return (
    <div className="app-preview-stack">
      <img src={phonesImg} alt="Tova app preview on two phones" />
    </div>
  );
}