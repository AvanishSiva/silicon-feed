import React, { useEffect, useState } from 'react';

const ReadingProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial calculation

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 w-full h-1 z-50"
            style={{
                background: 'var(--color-bg-secondary)'
            }}
        >
            <div
                className="h-full transition-all duration-150 ease-out"
                style={{
                    width: `${progress}%`,
                    background: 'var(--gradient-primary)'
                }}
            />
        </div>
    );
};

export default ReadingProgress;
