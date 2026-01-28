import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ReadingProgress from '../components/ReadingProgress';
import ScrollToTop from '../components/ScrollToTop';
import { useLocation } from 'react-router-dom';

const ArticlePage = () => {
  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
          Article not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <ReadingProgress />
      <ScrollToTop />

      {/* Hero Section with Parallax */}
      <section className="relative h-screen">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('${data.image}')`,
          }}
        >
          {/* Dark Overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.9) 100%)' }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-end pb-20 z-10">
          <div className="max-w-5xl mx-auto px-6 w-full">
            <div className="animate-slideUp">
              {/* Category Badge */}
              <div className="mb-6">
                <span
                  className="px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md inline-block"
                  style={{
                    background: 'rgba(255, 107, 53, 0.2)',
                    border: '1px solid rgba(255, 107, 53, 0.4)',
                    color: 'var(--color-accent-primary)'
                  }}
                >
                  Technology
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                {data.title}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl mb-8 max-w-3xl italic" style={{ color: 'var(--color-text-secondary)' }}>
                {data.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{data.author.name}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      {data.author.description}
                    </p>
                  </div>
                </div>
                <div className="h-8 w-px" style={{ background: 'var(--color-border)' }}></div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {new Date(data.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="h-8 w-px" style={{ background: 'var(--color-border)' }}></div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  5 min read
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="relative z-10 py-20" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-6">
          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-12 pb-8" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Share this article:
            </span>
            <div className="flex gap-3">
              {['Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
                <button
                  key={platform}
                  className="w-10 h-10 rounded-full glass-effect-light flex items-center justify-center transition-all duration-300 hover:scale-110 hover-glow"
                  aria-label={`Share on ${platform}`}
                >
                  <span className="text-xs font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                    {platform[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none animate-fadeIn"
            style={{
              color: 'var(--color-text-secondary)',
              lineHeight: '1.8'
            }}
          >
            <div className="text-lg leading-relaxed whitespace-pre-wrap">
              {data.summary}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-16 pt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex flex-wrap gap-3">
              {['AI', 'Technology', 'Innovation', 'Silicon Valley'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-sm font-medium glass-effect-light transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Card */}
          <div className="mt-16 p-8 rounded-2xl glass-effect-light" style={{ border: '1px solid var(--color-border)' }}>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white font-bold text-2xl">AI</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {data.author.name}
                </h3>
                <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {data.author.description}
                </p>
                <a
                  href={`mailto:${data.author.mail}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300"
                  style={{ color: 'var(--color-accent-primary)' }}
                >
                  <span>Contact Author</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticlePage;
