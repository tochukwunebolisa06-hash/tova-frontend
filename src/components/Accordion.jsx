import { useState } from "react";
import "./Accordion.css";

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div className={`accordion__item ${isOpen ? "accordion__item--open" : ""}`} key={item.q}>
            <button
              className="accordion__trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
            >
              <span>{item.q}</span>
              <span className="accordion__icon" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && <p className="accordion__answer">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
