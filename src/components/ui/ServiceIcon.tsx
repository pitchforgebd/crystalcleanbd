import type { Service } from "@/lib/types";

const paths: Record<Service["icon"], string> = {
  spark:
    "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zm7 10l.9 2.6L23 16.5l-2.6.9L19 20l-.9-2.6L15.5 16.5l2.6-.9L19 13zM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z",
  building:
    "M4 20V6a2 2 0 012-2h5v16H4zm9 0V9h5a2 2 0 012 2v9h-7zM7 8h2v2H7V8zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm9-4h2v2h-2v-2zm0 4h2v2h-2v-2z",
  home: "M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-8.5z",
  window:
    "M4 4h16v16H4V4zm8 0v16M4 12h16M8 7h2v2H8V7zm6 0h2v2h-2V7zM8 15h2v2H8v-2zm6 0h2v2h-2v-2z",
  carpet:
    "M3 7h18v10H3V7zm2 2v6h14V9H5zm3 1h2v4H8v-4zm6 0h2v4h-2v-4z",
  sanitize:
    "M12 2c1.5 2 2 3.5 2 5a2 2 0 11-4 0c0-1.5.5-3 2-5zm-6 9a6 6 0 1112 0c0 3.5-2.2 5.5-4 7.2V21H10v-2.8C8.2 16.5 6 14.5 6 11z",
};

type ServiceIconProps = {
  name: Service["icon"];
  className?: string;
};

export function ServiceIcon({ name, className = "h-6 w-6" }: ServiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}
