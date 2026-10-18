import { useEffect, useRef, useState } from "react";
import { fetchWaitlistCount } from "../api/client";
import "./LiveWaitlistCounter.css";

const POLL_INTERVAL = 25000;

/**
 * One rolling digit. A column of 0–9 sits inside a fixed-height, masked
 * window and translates into view — the CSS `transition` on transform
 * animates the roll whenever `digit` changes, no JS animation loop needed.
 */
function DigitReel({ digit }) {
  return (
    <span className="wl3-reel" aria-hidden="true">
      <span
        className="wl3-reel__col"
        style={{ transform: `translateY(-${digit * 10}%)` }}
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span className="wl3-reel__digit" key={n}>
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

function RollingNumber({ value }) {
  const chars = value.toLocaleString("en-US").split("");
  return (
    <span className="wl3-number" role="text" aria-label={value.toLocaleString("en-US")}>
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <DigitReel digit={Number(ch)} key={i} />
        ) : (
          <span className="wl3-number__sep" key={i}>
            {ch}
          </span>
        )
      )}
    </span>
  );
}

/**
 * Compact "N people on the waitlist" pill. Polls GET /api/waitlist/count/
 * every 25s. Starts at 0 so it's always visible immediately, and upgrades
 * to the real count the moment a successful response arrives, with each
 * digit rolling into place individually.
 */
export default function LiveWaitlistCounter({ variant = "hero" }) {
  const [count, setCount] = useState(0);
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(0);
  const flashTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    function load() {
      fetchWaitlistCount()
        .then((data) => {
          if (cancelled || typeof data?.count !== "number") return;
          if (data.count > prevRef.current) {
            setFlash(true);
            window.clearTimeout(flashTimeoutRef.current);
            flashTimeoutRef.current = window.setTimeout(() => setFlash(false), 700);
          }
          prevRef.current = data.count;
          setCount(data.count);
        })
        .catch(() => {
          // Not reachable — keep showing the last known count rather
          // than disappearing.
        });
    }

    load();
    const interval = setInterval(load, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  return (
    <span className={`wl3-pill wl3-pill--${variant} ${flash ? "wl3-pill--flash" : ""}`}>
      <span className="wl3-dot" aria-hidden="true" />
      <RollingNumber value={count} />
      <span className="wl3-label">people on the waitlist</span>
    </span>
  );
}