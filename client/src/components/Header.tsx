import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="mb-8 relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-32 h-32 bg-[url('/ancient-symbol.png')] bg-contain bg-no-repeat"></div>
      </div>
      <h1 className="text-4xl font-cinzel text-center text-earthy-dark relative z-10 py-4">
        <span className="bg-gradient-to-r from-sandy-gold via-accent-gold to-sandy-gold bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
      <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-sandy-gold to-transparent"></div>
    </header>
  );
};

export default Header;