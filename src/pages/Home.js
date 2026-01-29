import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ParticleNetwork from "../components/ParticleNetwork";
import ScrollToTop from "../components/ScrollToTop";
import CategoryFilter from "../components/CategoryFilter";
import "./Home.css";
import ArticleList from "../components/ArticleList";

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Support URL parameters for deep linking
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, []);

    // Update URL when category changes
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url);
    };

    return (
        <div className="min-h-screen">
            <NavBar />
            <ScrollToTop />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Particle Background */}
                <ParticleNetwork />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-10"></div>

                {/* Hero Content */}
                <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-6 text-center pt-20">
                    <div className="animate-slideUp">
                        {/* Eyebrow Text */}
                        <p className="text-xs md:text-base font-medium mb-4 md:mb-6 tracking-wider uppercase" style={{ color: 'var(--color-accent-primary)' }}>
                            Welcome to SiliconFeed
                        </p>

                        {/* Main Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 leading-tight">
                            <span className="gradient-text">
                                Find News that
                            </span>
                            <br />
                            <span className="text-white">
                                Meet With Your Needs
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-base sm:text-lg md:text-xl mb-8 md:mb-12 max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                            Because Even Developers Need Something to Read Besides Stack Overflow
                        </p>

                        {/* CTA Button */}
                        <button
                            className="px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105 hover-glow inline-flex items-center gap-2 md:gap-3"
                            style={{
                                background: 'var(--gradient-primary)',
                                color: 'white'
                            }}
                            onClick={() => {
                                document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <span>Explore Stories</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                    <div className="w-5 h-8 md:w-6 md:h-10 border-2 rounded-full flex items-start justify-center p-1.5 md:p-2" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-accent-primary)' }}></div>
                    </div>
                </div>
            </section>

            {/* Category Filter Section */}
            <section className="relative z-10 bg-gradient-to-b from-black/60 to-transparent">
                <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />
            </section>

            {/* Articles Section */}
            <section id="articles-section" className="relative z-10">
                <ArticleList selectedCategory={selectedCategory} />
            </section>

            <Footer />
        </div>
    );
}

export default Home;