import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const postRes = await axios.get(`https://blog-m5jh.onrender.com/api/posts/${id}`);
                setPost(postRes.data);
                
                const commentsRes = await axios.get(`https://blog-m5jh.onrender.com/api/comments/post/${id}`);
                setComments(commentsRes.data);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndComments();
    }, [id]);

    const handleDeletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`https://blog-m5jh.onrender.com/api/posts/${id}`, { withCredentials: true });
                navigate('/');
            } catch (error) {
                console.error('Error deleting post', error);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`https://blog-m5jh.onrender.com/api/comments/post/${id}`, { content: newComment }, { withCredentials: true });
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Delete comment?')) {
            try {
                await axios.delete(`https://blog-m5jh.onrender.com/api/comments/${commentId}`, { withCredentials: true });
                setComments(comments.filter(c => c._id !== commentId));
            } catch (error) {
                console.error('Error deleting comment', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div>
            <div className="post-detail">
                <h1 className="post-detail-title">{post.title}</h1>
                <div className="post-meta">
                    By {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="post-detail-content">
                    {post.content}
                </div>
                {user && user.id === post.author._id && (
                    <div className="post-actions">
                        <button onClick={handleDeletePost} className="btn btn-danger">Delete Post</button>
                    </div>
                )}
            </div>

            <div className="comments-section">
                <h2>Comments</h2>
                
                {user ? (
                    <form onSubmit={handleCommentSubmit} className="comment-form form-group">
                        <textarea 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder="Add a comment..." 
                            required
                            style={{ minHeight: '80px', marginBottom: '0.5rem' }}
                        ></textarea>
                        <button type="submit" className="btn btn-primary">Post Comment</button>
                    </form>
                ) : (
                    <p>Please <a href="/login">login</a> to leave a comment.</p>
                )}

                <div className="comments-list">
                    {comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        comments.map(comment => (
                            <div key={comment._id} className="comment-card">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.author.username}</span>
                                    <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="comment-content">{comment.content}</div>
                                {user && (user.id === comment.author._id || user.id === post.author._id) && (
                                    <button 
                                        onClick={() => handleDeleteComment(comment._id)} 
                                        className="btn btn-danger" 
                                        style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
