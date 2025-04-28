import React from "react";

export const ColumnGuttersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 6V4h16v2"></path>
    <path d="M4 10V8h16v2"></path>
    <path d="M4 14v-2h16v2"></path>
    <path d="M4 18v-2h16v2"></path>
    <path d="M4 22v-2h16v2"></path>
  </svg>
);

export const GreekPatternIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 20" width="100" height="20" {...props}>
    <path
      d="M0,10 h15 v-10 h5 v10 h5 v-10 h5 v10 h5 v-10 h5 v10 h5 v-10 h5 v10 h5 v-10 h5 v10 h5 v-10 h5 v10 h5 v-10 h5 v10 h5 v-10 h5 v10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

export const MythologyKnotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 50 50" width="50" height="50" {...props}>
    <path
      d="M25,5 C15,5 5,15 5,25 C5,35 15,45 25,45 C35,45 45,35 45,25 C45,15 35,5 25,5 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M25,5 C20,15 20,35 25,45 C30,35 30,15 25,5 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M5,25 C15,20 35,20 45,25 C35,30 15,30 5,25 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export const AncientCoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M12,5 L12,19" stroke="currentColor" strokeWidth="1" />
    <path d="M5,12 L19,12" stroke="currentColor" strokeWidth="1" />
  </svg>
);
