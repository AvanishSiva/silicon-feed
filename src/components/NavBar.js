import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const categories = [
        { id: 'all', name: 'All Categories', icon: '📰', color: '#FF6B35' },
        { id: 'general_tech', name: 'General Tech', icon: '🚀', color: '#FF6B35' },
        { id: 'ai_ml', name: 'AI & Machine Learning', icon: '🤖', color: '#9C27B0' },
        { id: 'developer', name: 'Developer News', icon: '💻', color: '#2196F3' },
        { id: 'security', name: 'Cybersecurity', icon: '🔐', color: '#F44336' },
        { id: 'cloud_devops', name: 'Cloud & DevOps', icon: '☁️', color: '#00BCD4' },
        { id: 'mobile', name: 'Mobile Development', icon: '📱', color: '#4CAF50' },
        { id: 'hardware', name: 'Hardware & IoT', icon: '⚡', color: '#607D8B' },
        { id: 'web3', name: 'Web3 & Blockchain', icon: '🔗', color: '#FFC107' },
        { id: 'company_blogs', name: 'Company Blogs', icon: '🏢', color: '#3F51B5' },
        { id: 'community', name: 'Community', icon: '👥', color: '#E91E63' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
            setVisible(isVisible);
            setPrevScrollPos(currentScrollPos);
            setScrolled(currentScrollPos > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [menuOpen]);

    const handleCategoryClick = (categoryId) => {
        setMenuOpen(false);
        if (categoryId === 'all') {
            navigate('/');
        } else {
            navigate(`/?category=${categoryId}`);
        }
        // Scroll to articles section
        setTimeout(() => {
            document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSubscribeClick = () => {
        const newsletterSection = document.getElementById('newsletter-section');
        if (newsletterSection) {
            newsletterSection.scrollIntoView({ behavior: 'smooth' });
            setMenuOpen(false);
        } else {
            navigate('/');
            // Use a timeout to retry scrolling after navigation
            setTimeout(() => {
                const retrySection = document.getElementById('newsletter-section');
                retrySection?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    };

    return (
        <>
            <nav
                className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'
                    } ${scrolled ? 'glass-effect shadow-lg' : 'bg-transparent'}`}
                style={{
                    borderBottom: scrolled ? '1px solid var(--color-border)' : 'none'
                }}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4 relative">
                    {/* Left: Menu Icon */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-2xl transition-all duration-300 hover:scale-110 hover:text-orange-500 group z-50"
                        aria-label="Menu"
                    >
                        <div className="flex flex-col gap-1.5">
                            <span
                                className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : 'group-hover:w-8'}`}
                                style={{ background: 'var(--color-text-primary)' }}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`}
                                style={{ background: 'var(--color-text-primary)' }}
                            ></span>
                            <span
                                className={`block w-4 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2 w-6' : 'group-hover:w-8'}`}
                                style={{ background: 'var(--color-text-primary)' }}
                            ></span>
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
                            onClick={handleSubscribeClick}
                            className="px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover-glow hidden md:block"
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

            {/* Sliding Menu Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] glass-effect-dark z-40 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{
                    borderRight: '1px solid var(--color-border)',
                    boxShadow: menuOpen ? '4px 0 20px rgba(0,0,0,0.5)' : 'none'
                }}
            >
                <div className="h-full overflow-y-auto pt-24 pb-8 px-6">
                    {/* Menu Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold gradient-text mb-2">Categories</h2>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            Explore news by topic
                        </p>
                    </div>

                    {/* Category Links */}
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 group"
                                style={{
                                    background: `${category.color}15`,
                                    border: `1px solid ${category.color}30`
                                }}
                            >
                                <span className="text-2xl">{category.icon}</span>
                                <span
                                    className="font-semibold group-hover:translate-x-1 transition-transform"
                                    style={{ color: category.color }}
                                >
                                    {category.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Menu Footer */}
                    <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <button
                            onClick={handleSubscribeClick}
                            className="w-full px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover-glow"
                            style={{
                                background: 'var(--gradient-primary)',
                                color: 'white'
                            }}
                        >
                            Subscribe to Newsletter
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
                    onClick={() => setMenuOpen(false)}
                ></div>
            )}
        </>
    );
}

export default NavBar;
