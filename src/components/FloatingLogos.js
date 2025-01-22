import React, { useEffect } from "react";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
// Add other logos as needed

const FloatingLogos = () => {
  useEffect(() => {
    const handleScroll = () => {
      const logos = document.querySelectorAll(".floating-logo");
      const scrollY = window.scrollY;

      logos.forEach((logo, index) => {
        const speed = index + 1; // Vary speed for each logo
        logo.style.transform = `translateY(${scrollY * speed * 0.1}px)`;
        logo.style.opacity = 1 - scrollY / 500; // Gradually fade out
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="logos-container">
        <img src={logo1} alt="Logo 1" className="logo floating-logo" />
        <img src={logo2} alt="Logo 2" className="logo floating-logo" />
        <img src={logo3} alt="Logo 3" className="logo floating-logo" />
        {/* Add more logos here */}
      </div>

      {/* Main Content */}
      <h2 className="absolute top-1/2 left-0 transform -translate-y-1/2 text-3xl sm:text-4xl md:text-5xl font-extrabold z-10">
        Because Even Developers Need Something to Read Besides Stack Overflow!
      </h2>
    </div>
  );
};

export default FloatingLogos;
