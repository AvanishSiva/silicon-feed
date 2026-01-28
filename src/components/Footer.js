import React from 'react';

const Footer = () => {
  return (
    <footer className="relative mt-20 py-16" style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              SiliconFeed
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Your daily dose of tech news, curated by AI for developers who need more than Stack Overflow.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {['Twitter', 'GitHub', 'LinkedIn'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-10 h-10 rounded-full glass-effect-light flex items-center justify-center transition-all duration-300 hover:scale-110 hover-glow"
                  aria-label={platform}
                >
                  <span className="text-xs font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                    {platform[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Contact', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="transition-colors duration-300 hover:text-orange-500"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Stay Updated
            </h4>
            <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Get the latest tech news delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-full glass-effect-light focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)'
                }}
              />
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
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            © {new Date().getFullYear()} SiliconFeed. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Contact: <a href="mailto:sivaavanishk@gmail.com" className="hover:text-orange-500 transition-colors duration-300">sivaavanishk@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
