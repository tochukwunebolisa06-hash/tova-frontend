import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import Faqs from "./pages/Faqs";

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faqs" element={<Faqs />} />
      </Routes>
    </Layout>
  );
}