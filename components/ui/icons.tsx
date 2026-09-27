type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export const PlusIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M5 12h14" /></svg>
);
export const CloseIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const SearchIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const BagIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M6 7h12l1 13H5L6 7Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
);
export const TrashIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
);
export const ArrowLeftIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);
export const PinIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
export const ClockIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const BikeIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><circle cx="5.5" cy="17" r="3" /><circle cx="18.5" cy="17" r="3" /><path d="M8.5 17h5l3-6h-4M5.5 17l3-7h4M15 7h3" /></svg>
);
export const BurgerIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 10c0-3.3 3.6-6 8-6s8 2.7 8 6H4Z" />
    <path d="M3 13.5h18" />
    <path d="M5 17h14c0 1.7-1.3 3-3 3H8c-1.7 0-3-1.3-3-3Z" />
  </svg>
);
export const ScooterIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="6" cy="17" r="2.5" />
    <circle cx="18" cy="17" r="2.5" />
    <path d="M8.5 17h6.5l2-7h-3M3.5 17V13h7l2 4" />
    <path d="M5 13V9h4" />
  </svg>
);
export const StoreIcon =({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M4 10v10h16V10M3 10l2-6h14l2 6H3ZM10 20v-5h4v5" /></svg>
);
export const CheckIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="m5 12 5 5 9-10" /></svg>
);
export const ArrowRightIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export const WhatsAppIcon = ({ size = 22, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01Zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
  </svg>
);

export const InstagramIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);
