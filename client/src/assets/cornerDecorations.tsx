import React from "react";

// Decorative corner elements for the ancient mythology-themed design
export const GreekCornerDecoration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 64 64" width="64" height="64" {...props}>
    <path
      d="M2,2 L62,2 L62,12 L12,12 L12,62 L2,62 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M17,17 L47,17 L47,27 L27,27 L27,47 L17,47 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M32,32 L42,32 L42,42 L32,42 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M7,7 C7,7 17,7 22,12 C27,17 27,27 27,27"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2,2"
    />
    <path
      d="M37,37 C37,37 42,37 45,40 C48,43 48,48 48,48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2,2"
    />
  </svg>
);

export const MythologyCornerDecoration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 64 64" width="64" height="64" {...props}>
    <path
      d="M5,32 Q5,5 32,5 Q59,5 59,32 Q59,59 32,59 Q5,59 5,32 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M16,32 Q16,16 32,16 Q48,16 48,32 Q48,48 32,48 Q16,48 16,32 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M2,2 L15,15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M2,62 L15,49"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M62,2 L49,15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M62,62 L49,49"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <circle cx="32" cy="32" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const LaurelWreathCorner: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 64 64" width="64" height="64" {...props}>
    <path
      d="M10,10 Q20,5 30,20 Q40,35 50,20 Q60,5 60,15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M10,20 Q20,15 30,30 Q40,45 50,30 Q60,15 60,25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M20,5 Q15,15 30,15 Q45,15 45,30 Q45,45 35,50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M30,5 Q25,15 40,15 Q55,15 55,30 Q55,45 45,50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <circle cx="32" cy="32" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const AncientSymbolCorner: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 64 64" width="64" height="64" {...props}>
    <path
      d="M5,5 L59,5 L59,59 L5,59 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M15,15 L49,15 L49,49 L15,49 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M25,15 L25,49"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M39,15 L39,49"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M15,25 L49,25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M15,39 L49,39"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <circle cx="32" cy="32" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);