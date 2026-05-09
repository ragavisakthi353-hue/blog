import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/posts');
                setPosts(res.data);
            } catch (error) {
                console.error('Error fetching posts', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div>Loading posts...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Latest Posts</h1>
            {posts.length === 0 ? (
                <p>No posts available. Be the first to create one!</p>
            ) : (
                posts.map(post => (
                    <div key={post._id} className="post-card">
                        <h2 className="post-title">
                            <Link to={`/posts/${post._id}`}>{post.title}</Link>
                        </h2>
                        <div className="post-meta">
                            By {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <p className="post-excerpt">
                            {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                        </p>
                        <Link to={`/posts/${post._id}`} className="btn btn-secondary">Read More</Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default Home;
