import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="mb-8 relative py-12 w-screen bg-wood-dark/80 border-y border-sandy-gold/30">
      <div className="absolute inset-0 bg-gradient-to-b from-sandy-gold/10 via-sandy-gold/5 to-transparent pointer-events-none"></div>
      <div className="w-full max-w-[100vw] px-4 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sandy-gold to-transparent opacity-50"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sandy-gold to-transparent opacity-50"></div>
        
        <div className="relative py-4">
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-center text-sandy-gold my-6 tracking-wider">
            {title}
          </h1>
          
          {/* Ornamental lines */}
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sandy-gold/50 to-transparent"></div>
          <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-sandy-gold/50 to-transparent"></div>
          
          {/* Side decorations */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-32 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiA3djEwbDEwIDVsMTAtNVY3TDEyIDJ6IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20 transform -rotate-90"></div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiA3djEwbDEwIDVsMTAtNVY3TDEyIDJ6IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20 transform rotate-90"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
