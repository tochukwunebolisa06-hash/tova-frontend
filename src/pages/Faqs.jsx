import { useEffect, useState } from "react";
import CrossWatermark from "../components/CrossWatermark";
import Accordion from "../components/Accordion";
import BrandSignature from "../components/BrandSignature";
import { fetchFaqs, askFaqQuestion } from "../api/client";
import "./Faqs.css";

// Shown if the API can't be reached (e.g. backend not running locally yet)
const FALLBACK_FAQ_ITEMS = [
  {
    q: "What is Tova?",
    a: "Tova is a platform that brings faith, community, resources and giving together in one place, so churches and believers no longer need a dozen different apps.",
  },
  {
    q: "Is Tova free to use?",
    a: "Yes. Tova is free for individuals. Churches and ministries can unlock additional tools on a paid plan once those features launch.",
  },
  {
    q: "Which churches or ministries are on Tova?",
    a: "We're onboarding churches and Christian creators ahead of launch. Join the waitlist and we'll let you know as your church or favorite ministry comes on board.",
  },
  {
    q: "When does Tova launch?",
    a: "We're finishing up testing now. Waitlist members get first access and will be the first to hear the exact date.",
  },
  {
    q: "Can I give and pay tithes through Tova?",
    a: "Yes. Tova supports secure giving, including tithes, offerings and seed giving, directly to the churches and ministries you support.",
  },
];

export default function Faqs() {
  const [question, setQuestion] = useState("");
  const [askStatus, setAskStatus] = useState("idle"); // idle | loading | success | error
  const [askError, setAskError] = useState("");

  const [faqItems, setFaqItems] = useState(FALLBACK_FAQ_ITEMS);
  const [faqsLoading, setFaqsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchFaqs()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setFaqItems(data.map((item) => ({ q: item.question, a: item.answer })));
        }
        // If the API returns an empty list, keep the fallback items rather
        // than showing an empty FAQ section.
      })
      .catch(() => {
        // Backend not reachable — fallback list already set as initial state.
      })
      .finally(() => {
        if (!cancelled) setFaqsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setAskStatus("loading");
    setAskError("");
    try {
      await askFaqQuestion({ question: question.trim() });
      setAskStatus("success");
      setQuestion("");
    } catch (err) {
      setAskStatus("error");
      setAskError(err.message);
    }
  }

  return (
    <div className="faqs">
      <section className="faqs__hero container">
        <CrossWatermark className="faqs__watermark" />

        <p className="faqs__eyebrow">FAQs</p>
        <h1 className="faqs__title">
          Have a Question?
          <br />
          Ask Us.
        </h1>
        <p className="faqs__subtitle">
          We're here to help. Ask anything about Tova — and we'll get back to you as soon as possible.
        </p>

        <form className="faqs__ask" onSubmit={handleSubmit}>
          <span className="faqs__ask-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M21 11.5a8.5 8.5 0 1 1-3.8-7.1" />
              <path d="M3 21l1.6-4.8A8.46 8.46 0 0 1 3 11.5 8.5 8.5 0 0 1 20.7 7" />
            </svg>
          </span>
          <input
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (askStatus !== "idle") setAskStatus("idle");
            }}
            placeholder="Type your question here..."
            aria-label="Type your question"
            disabled={askStatus === "loading"}
          />
          <button
            type="submit"
            className="faqs__ask-submit"
            aria-label="Send question"
            disabled={askStatus === "loading"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5" />
              <path d="M6 11l6-6 6 6" />
            </svg>
          </button>
        </form>

        {askStatus === "success" && (
          <p className="faqs__ask-confirm" role="status">
            Thanks — we've got your question and will get back to you soon.
          </p>
        )}
        {askStatus === "error" && (
          <p className="faqs__ask-confirm faqs__ask-confirm--error" role="alert">
            {askError}
          </p>
        )}

        <div className="faqs__divider">
          <span />
          <p>OR</p>
          <span />
        </div>

        <p className="faqs__email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 6.5l9 6.5 9-6.5" />
          </svg>
          Email us at <a href="mailto:support@tova.com">support@tova.com</a>
        </p>
      </section>

      <section className="faqs__list container">
        <h2 className="faqs__list-title">Frequently asked questions</h2>
        {!faqsLoading && <Accordion items={faqItems} />}
      </section>

      <BrandSignature />
    </div>
  );
}
