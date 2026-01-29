import React from 'react';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
    const categories = [
        { id: 'all', name: 'All', icon: '📰', color: '#FF6B35' },
        { id: 'general_tech', name: 'General Tech', icon: '🚀', color: '#FF6B35' },
        { id: 'ai_ml', name: 'AI & ML', icon: '🤖', color: '#9C27B0' },
        { id: 'developer', name: 'Developer', icon: '💻', color: '#2196F3' },
        { id: 'security', name: 'Security', icon: '🔐', color: '#F44336' },
        { id: 'cloud_devops', name: 'Cloud', icon: '☁️', color: '#00BCD4' },
        { id: 'mobile', name: 'Mobile', icon: '📱', color: '#4CAF50' },
        { id: 'hardware', name: 'Hardware', icon: '⚡', color: '#607D8B' },
        { id: 'web3', name: 'Web3', icon: '🔗', color: '#FFC107' },
        { id: 'company_blogs', name: 'Companies', icon: '🏢', color: '#3F51B5' },
        { id: 'community', name: 'Community', icon: '👥', color: '#E91E63' }
    ];

    return (
        <div className="w-full overflow-hidden py-6">
            <div className="max-w-7xl mx-auto px-6">
                {/* Scrollable container */}
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 min-w-max pb-2">
                        {categories.map((category) => {
                            const isActive = selectedCategory === category.id;

                            return (
                                <button
                                    key={category.id}
                                    onClick={() => onCategoryChange(category.id)}
                                    className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-full
                                        font-semibold text-sm transition-all duration-300
                                        hover:scale-105 hover-lift
                                        ${isActive ? 'shadow-lg' : 'backdrop-blur-md'}
                                    `}
                                    style={{
                                        background: isActive
                                            ? category.color
                                            : `${category.color}15`,
                                        border: `2px solid ${isActive ? category.color : `${category.color}30`}`,
                                        color: isActive ? 'white' : category.color,
                                        boxShadow: isActive ? `0 4px 20px ${category.color}40` : 'none'
                                    }}
                                >
                                    <span className="text-lg">{category.icon}</span>
                                    <span>{category.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default CategoryFilter;
