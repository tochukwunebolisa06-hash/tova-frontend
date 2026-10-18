export default function CrossWatermark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 140"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="42" y="0" width="16" height="140" rx="4" fill="currentColor" />
      <rect x="0" y="34" width="100" height="16" rx="4" fill="currentColor" />
    </svg>
  );
}
