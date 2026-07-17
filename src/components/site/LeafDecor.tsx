export function LeafDecor({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M20 180 Q60 120 100 100 Q140 80 180 20" />
      <path d="M40 160 Q35 145 25 145 M55 145 Q50 130 40 130 M70 130 Q65 115 55 115 M90 115 Q85 100 75 100 M110 100 Q105 85 95 85 M130 85 Q125 70 115 70 M150 65 Q145 50 135 50" />
      <ellipse cx="45" cy="152" rx="8" ry="4" transform="rotate(-30 45 152)" />
      <ellipse cx="75" cy="122" rx="8" ry="4" transform="rotate(-30 75 122)" />
      <ellipse cx="105" cy="92" rx="8" ry="4" transform="rotate(-30 105 92)" />
      <ellipse cx="135" cy="62" rx="8" ry="4" transform="rotate(-30 135 62)" />
    </svg>
  );
}