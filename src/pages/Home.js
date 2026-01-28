import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ParticleNetwork from "../components/ParticleNetwork";
import ScrollToTop from "../components/ScrollToTop";
import "./Home.css";
import ArticleList from "../components/ArticleList";

const Home = () => {
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
                <div className="relative z-20 max-w-6xl mx-auto px-6 text-center pt-20">
                    <div className="animate-slideUp">
                        {/* Eyebrow Text */}
                        <p className="text-sm md:text-base font-medium mb-6 tracking-wider uppercase" style={{ color: 'var(--color-accent-primary)' }}>
                            Welcome to SiliconFeed
                        </p>

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                            <span className="gradient-text">
                                Find News that
                            </span>
                            <br />
                            <span className="text-white">
                                Meet With Your Needs
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                            Because Even Developers Need Something to Read Besides Stack Overflow
                        </p>

                        {/* CTA Button */}
                        <button
                            className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover-glow inline-flex items-center gap-3"
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                    <div className="w-6 h-10 border-2 rounded-full flex items-start justify-center p-2" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-accent-primary)' }}></div>
                    </div>
                </div>
            </section>

            {/* Articles Section */}
            <section id="articles-section" className="relative z-10">
                <ArticleList />
            </section>

            <Footer />
        </div>
    );
}

export default Home;