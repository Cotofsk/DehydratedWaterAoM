import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="mb-8 relative py-8">
      <div className="absolute inset-0 bg-gradient-to-b from-sandy-gold/20 to-transparent pointer-events-none"></div>
      <div className="column-decor relative">
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-sandy-gold to-transparent"></div>
        <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-center text-earthy-brown my-6 tracking-wider">
          {title}
        </h1>
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-sandy-gold to-transparent"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiA3djEwbDEwIDVsMTAtNVY3TDEyIDJ6IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20 transform -rotate-90"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiA3djEwbDEwIDVsMTAtNVY3TDEyIDJ6IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20 transform rotate-90"></div>
    </header>
  );
};

export default Header;
