import Header from "./Header";
import Footer from "./Footer";
import WaitlistModal from "./WaitlistModal";
import MobileTabBar from "./MobileTabBar";
import { WaitlistModalProvider } from "../context/WaitlistModalContext";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <WaitlistModalProvider>
      <div className="page">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
      <WaitlistModal />
      <MobileTabBar />
    </WaitlistModalProvider>
  );
}