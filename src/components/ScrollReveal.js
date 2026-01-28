import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({
    children,
    animation = 'slideUp',
    delay = 0,
    threshold = 0.1,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Optionally unobserve after revealing
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: threshold,
                rootMargin: '0px'
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [threshold]);

    const animationClass = isVisible ? `animate-${animation}` : 'opacity-0';
    const delayStyle = delay > 0 ? { animationDelay: `${delay}s` } : {};

    return (
        <div
            ref={elementRef}
            className={`${animationClass} ${className}`}
            style={delayStyle}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
