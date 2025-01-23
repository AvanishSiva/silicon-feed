import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";


const ArticleList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get("http://localhost:5002/api/articles");
                setPosts(response.data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <Loading />;  // Show loading indicator only within this section
    }

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
            {posts.map((post, index) => (
                <Link
                    key={index}
                    to={`/articles/${post.title.replace(/\s+/g, "-").toLowerCase()}`}
                    className="rounded-lg overflow-hidden flex flex-col"
                    state={post}
                >
                    <div className="relative mt-10 mx-10 mb-2 pb-[100%] group">
                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        <img
                            src={post.image}
                            alt={post.title}
                            style={{
                                border: "1rem solid #CBCBCB",
                            }}
                            className="absolute top-0 left-0 w-full h-full object-cover filter grayscale transition-transform duration-300 group-hover:translate-x-[-15px] group-hover:translate-y-[-15px] z-20"
                        />
                        <div className="absolute top-0 left-0 transform translate-x-[10px] translate-y-[10px] z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div
                                className="text-black text-center p-4"
                                style={{
                                    backgroundColor: "#CBCBCB",
                                    transform: "translate3d(1rem, 1rem, 0) scale3d(1, 1, 1)",
                                }}
                            >
                                {post.description}
                            </div>
                        </div>
                    </div>
                    <div className="px-4 mx-10 font-sans">
                        <p className="text-gray-500">by {post.author.name}</p>
                        <h3 className="text-4xl font-bold">{post.title}</h3>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ArticleList;




