import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="mb-8 relative">
      <div className="column-decor">
        <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-center text-earthy-brown my-6">
          {title}
        </h1>
      </div>
      
      {/* Decorative elements */}
      <div 
        className="absolute top-2 left-2 md:left-10 w-16 h-16 opacity-10 bg-contain bg-no-repeat bg-center"
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1559589289-0d3c74c8598e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80')"}}
      ></div>
      <div 
        className="absolute top-2 right-2 md:right-10 w-16 h-16 opacity-10 bg-contain bg-no-repeat bg-center transform rotate-180"
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1559589289-0d3c74c8598e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80')"}}
      ></div>
    </header>
  );
};

export default Header;
