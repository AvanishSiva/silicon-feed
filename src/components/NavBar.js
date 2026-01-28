import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;

            // Determine if navbar should be visible
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

            setVisible(isVisible);
            setPrevScrollPos(currentScrollPos);
            setScrolled(currentScrollPos > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    return (
        <nav
            className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'
                } ${scrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
                }`}
            style={{
                borderBottom: scrolled ? '1px solid var(--color-border)' : 'none'
            }}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4 relative">
                {/* Left: Menu Icon */}
                <button
                    className="text-2xl transition-all duration-300 hover:scale-110 hover:text-orange-500 group"
                    aria-label="Menu"
                >
                    <div className="flex flex-col gap-1.5">
                        <span className="block w-6 h-0.5 bg-current transition-all group-hover:w-8" style={{ background: 'var(--color-text-primary)' }}></span>
                        <span className="block w-6 h-0.5 bg-current" style={{ background: 'var(--color-text-primary)' }}></span>
                        <span className="block w-4 h-0.5 bg-current transition-all group-hover:w-8" style={{ background: 'var(--color-text-primary)' }}></span>
                    </div>
                </button>

                {/* Center: Logo Image */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link to="/" className="block transition-transform duration-300 hover:scale-110">
                        <img
                            src={logo}
                            alt="SiliconFeed Logo"
                            className="h-12 w-auto filter brightness-0 invert"
                        />
                    </Link>
                </div>

                {/* Right: Theme Toggle & Subscribe Button */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        className="px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover-glow"
                        style={{
                            background: 'var(--gradient-primary)',
                            color: 'white'
                        }}
                    >
                        Subscribe
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;

