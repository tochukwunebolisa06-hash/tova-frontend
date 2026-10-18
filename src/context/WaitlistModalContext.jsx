import { createContext, useContext, useState, useCallback } from "react";

const WaitlistModalContext = createContext(null);

export function WaitlistModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <WaitlistModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </WaitlistModalContext.Provider>
  );
}

export function useWaitlistModal() {
  const ctx = useContext(WaitlistModalContext);
  if (!ctx) {
    throw new Error("useWaitlistModal must be used inside a WaitlistModalProvider");
  }
  return ctx;
}
