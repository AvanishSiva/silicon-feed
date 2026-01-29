import React from 'react';

const CategoryBadge = ({ category, size = 'medium', showIcon = false }) => {
    const categoryConfig = {
        general_tech: { name: 'General Tech', color: '#FF6B35', icon: '🚀' },
        ai_ml: { name: 'AI & ML', color: '#9C27B0', icon: '🤖' },
        developer: { name: 'Developer', color: '#2196F3', icon: '💻' },
        security: { name: 'Security', color: '#F44336', icon: '🔐' },
        cloud_devops: { name: 'Cloud & DevOps', color: '#00BCD4', icon: '☁️' },
        mobile: { name: 'Mobile', color: '#4CAF50', icon: '📱' },
        hardware: { name: 'Hardware', color: '#607D8B', icon: '⚡' },
        web3: { name: 'Web3', color: '#FFC107', icon: '🔗' },
        company_blogs: { name: 'Company Blogs', color: '#3F51B5', icon: '🏢' },
        community: { name: 'Community', color: '#E91E63', icon: '👥' }
    };

    const config = categoryConfig[category] || categoryConfig.general_tech;

    const sizeClasses = {
        small: 'px-2 py-0.5 text-xs',
        medium: 'px-3 py-1 text-sm',
        large: 'px-4 py-1.5 text-base'
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold backdrop-blur-md ${sizeClasses[size]}`}
            style={{
                background: `${config.color}20`,
                border: `1px solid ${config.color}40`,
                color: config.color
            }}
        >
            {showIcon && <span>{config.icon}</span>}
            <span>{config.name}</span>
        </span>
    );
};

export default CategoryBadge;
