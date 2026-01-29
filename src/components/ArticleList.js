import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import ScrollReveal from "./ScrollReveal";
import CategoryBadge from "./CategoryBadge";

import defaultCover from "../assets/default-cover.png";

const ArticleList = ({ selectedCategory = 'all' }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                setError(null);
                const summariesRef = collection(db, 'summaries');

                let summaries = [];

                try {
                    // Try to query with category filter
                    let q = query(summariesRef, orderBy('created_at', 'desc'));

                    if (selectedCategory && selectedCategory !== 'all') {
                        q = query(summariesRef,
                            where('category', '==', selectedCategory),
                            orderBy('created_at', 'desc')
                        );
                    }

                    const querySnapshot = await getDocs(q);

                    summaries = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            title: data.title || 'Untitled',
                            summary: data.article || data.summary || '',
                            description: data.description || data.summary || '',
                            image: (data.image && data.image !== "No image") ? data.image : defaultCover,
                            created_at: data.created_at?.toDate?.() || new Date(),
                            category: data.category || 'general_tech',
                            author: {
                                name: 'SiliconFeed AI',
                                description: 'AI-generated content',
                                mail: 'ai@siliconfeed.com'
                            }
                        };
                    });
                } catch (indexError) {
                    // If index error, fall back to fetching all articles and filter client-side
                    if (indexError.message.includes('index')) {
                        console.warn('Firestore index not ready. Fetching all articles...');
                        const q = query(summariesRef, orderBy('created_at', 'desc'));
                        const querySnapshot = await getDocs(q);

                        let allSummaries = querySnapshot.docs.map(doc => {
                            const data = doc.data();
                            return {
                                id: doc.id,
                                title: data.title || 'Untitled',
                                summary: data.article || data.summary || '',
                                description: data.description || data.summary || '',
                                image: (data.image && data.image !== "No image") ? data.image : defaultCover,
                                created_at: data.created_at?.toDate?.() || new Date(),
                                category: data.category || 'general_tech',
                                author: {
                                    name: 'SiliconFeed AI',
                                    description: 'AI-generated content',
                                    mail: 'ai@siliconfeed.com'
                                }
                            };
                        });

                        // Filter client-side if category is selected
                        if (selectedCategory && selectedCategory !== 'all') {
                            summaries = allSummaries.filter(article => article.category === selectedCategory);
                        } else {
                            summaries = allSummaries;
                        }

                        // Show a warning message
                        setError('Note: Firestore index is building. Category filtering may be slow. Check console for setup instructions.');
                    } else {
                        throw indexError;
                    }
                }

                setPosts(summaries);
            } catch (err) {
                console.error('Error fetching from Firestore:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [selectedCategory]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 text-lg">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12" id="articles-section">
            {/* Section Header */}
            <ScrollReveal animation="slideUp">
                <div className="mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
                        Latest Stories
                    </h2>
                    <div className="w-16 md:w-24 h-1 rounded-full" style={{ background: 'var(--gradient-primary)' }}></div>
                </div>
            </ScrollReveal>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {posts.map((post, index) => (
                    <ScrollReveal
                        key={post.id}
                        animation="slideUp"
                        delay={index * 0.1}
                    >
                        <Link
                            to={`/articles/${post.title.replace(/\s+/g, "-").toLowerCase()}`}
                            state={post}
                            className="group block h-full"
                        >
                            <article className="h-full flex flex-col rounded-2xl overflow-hidden glass-effect-light hover-lift transition-all duration-500 border border-transparent hover:border-orange-500/30">
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div
                                        className="absolute inset-0 opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                                        style={{ background: 'var(--gradient-overlay)' }}
                                    ></div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <CategoryBadge category={post.category} size="small" showIcon={true} />
                                    </div>

                                    {/* Reading Time */}
                                    <div className="absolute bottom-4 right-4">
                                        <div
                                            className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md"
                                            style={{
                                                background: 'rgba(26, 26, 26, 0.6)',
                                                color: 'var(--color-text-secondary)'
                                            }}
                                        >
                                            5 min read
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6 flex flex-col">
                                    {/* Author Info */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                                            <span className="text-white font-bold text-sm">AI</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                                {post.author.name}
                                            </p>
                                            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors duration-300" style={{ color: 'var(--color-text-primary)' }}>
                                        {post.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm line-clamp-3 mb-4 flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                                        {post.description}
                                    </p>

                                    {/* Read More Link */}
                                    <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-4 transition-all duration-300" style={{ color: 'var(--color-accent-primary)' }}>
                                        <span>Read More</span>
                                        <svg
                                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>

            {/* Empty State */}
            {posts.length === 0 && !loading && (
                <div className="text-center py-20">
                    <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
                        No articles found. Check back soon!
                    </p>
                </div>
            )}
        </div>
    );
};

export default ArticleList;
