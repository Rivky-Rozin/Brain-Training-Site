import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const PAGE_SIZE = 20;

export default function Forum() {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [file, setFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editFile, setEditFile] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const chatRef = useRef(null);
    const user = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        fetchMessages(1, true);
        // eslint-disable-next-line
    }, []);

    const fetchMessages = async (pageToLoad, initial = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get(`/api/messages?page=${pageToLoad}`,
                token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
            );
            const newMessages = res.data.reverse(); // הופך את הסדר לישן->חדש
            if (initial) {
                setMessages(newMessages);
            } else {
                setMessages((prev) => [...newMessages, ...prev]);
            }
            setHasMore(newMessages.length === PAGE_SIZE);
            setPage(pageToLoad);
        } catch (err) {
            // handle error
        }
        setLoading(false);
    };

    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && hasMore && !loading) {
            fetchMessages(page + 1);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!content.trim() && !file) || sending) return;
        setSending(true);
        let media_url = null;
        try {
            if (file) {
                const formData = new FormData();
                formData.append('image', file); // תמונה או וידאו
                const token = sessionStorage.getItem('token');
                const uploadRes = await axios.post('/api/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    },
                });
                media_url = uploadRes.data.imageUrl;
            }
            const token = sessionStorage.getItem('token');
            const res = await axios.post('/api/messages', {
                user_id: user?.id,
                content,
                media_url,
            },
            token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
            );
            setMessages((prev) => [...prev, res.data]);
            setContent('');
            setFile(null);
            setTimeout(() => {
                chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }, 100);
        } catch (err) {
            // handle error
        }
        setSending(false);
    };

    const handleEdit = (msg) => {
        setEditingId(msg.id);
        setEditContent(msg.content);
        setEditFile(null);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditContent('');
        setEditFile(null);
    };

    const handleEditSave = async (msg) => {
        setEditLoading(true);
        let media_url = msg.media_url;
        try {
            if (editFile) {
                const formData = new FormData();
                formData.append('image', editFile);
                const uploadRes = await axios.post('/api/upload-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                media_url = uploadRes.data.imageUrl;
            }
            const token = sessionStorage.getItem('token');
            const res = await axios.put(`/api/messages/${msg.id}`, {
                content: editContent,
                media_url,
            }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
            setMessages((prev) => prev.map(m => m.id === msg.id ? res.data : m));
            handleEditCancel();
        } catch (err) {
            // handle error
        }
        setEditLoading(false);
    };

    const handleDelete = async (msg) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`/api/messages/${msg.id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
            setMessages((prev) => prev.filter(m => m.id !== msg.id));
        } catch (err) {
            // handle error
        }
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages.length === PAGE_SIZE]);

    return (
        <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-50 to-blue-200 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-800 drop-shadow mt-8">Game Forum Chat</h2>
            <div
                ref={chatRef}
                className="flex-1 overflow-y-auto border rounded-lg mx-auto mb-4 bg-white shadow-lg p-6 w-full max-w-3xl"
                onScroll={handleScroll}
                style={{ direction: 'ltr', minHeight: '60vh' }}
            >
                {messages.map((msg) => {
                    const isMe = msg.user?.id === user?.id;
                    const profileImg = msg.user?.profile_image || '/default-profile.png';
                    return (
                        <div
                            key={msg.id}
                            className={`mb-4 flex items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* תמונת פרופיל */}
                            <img
                                src={profileImg}
                                alt="profile"
                                className="w-12 h-12 rounded-full border-2 border-blue-300 object-cover mx-3 shadow"
                            />
                            <div
                                className={`rounded-2xl px-4 py-3 max-w-[70%] break-words shadow-md ${
                                    isMe
                                        ? 'bg-blue-500 text-white ml-2 self-end'
                                        : 'bg-gray-100 text-gray-900 mr-2 self-end'
                                }`}
                                style={{ textAlign: isMe ? 'right' : 'left' }}
                            >
                                <div className="font-semibold mb-1 flex items-center gap-2">
                                    <span>{isMe ? 'Me' : msg.user?.username || 'User'}</span>
                                    {isMe && editingId !== msg.id && (
                                        <>
                                            <button onClick={() => handleEdit(msg)} className="ml-2 text-xs text-yellow-200 bg-yellow-600 rounded px-2 py-1 hover:bg-yellow-700">ערוך</button>
                                            <button onClick={() => handleDelete(msg)} className="ml-2 text-xs text-red-200 bg-red-600 rounded px-2 py-1 hover:bg-red-700">מחק</button>
                                        </>
                                    )}
                                </div>
                                {editingId === msg.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            className="w-full border rounded px-2 py-1 text-black mb-2"
                                            value={editContent}
                                            onChange={e => setEditContent(e.target.value)}
                                            disabled={editLoading}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={e => setEditFile(e.target.files[0])}
                                            disabled={editLoading}
                                            className="mb-2"
                                        />
                                        <button onClick={() => handleEditSave(msg)} disabled={editLoading || (!editContent.trim() && !editFile)} className="bg-green-600 text-white px-3 py-1 rounded mr-2">שמור</button>
                                        <button onClick={handleEditCancel} disabled={editLoading} className="bg-gray-400 text-white px-3 py-1 rounded">ביטול</button>
                                    </div>
                                ) : (
                                    <>
                                        <span>{msg.content}</span>
                                        {/* הצגת מדיה */}
                                        {msg.media_url && (
                                            msg.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                <video src={msg.media_url} controls className="mt-2 max-h-48 rounded-xl" />
                                            ) : (
                                                <img src={msg.media_url} alt="media" className="mt-2 max-h-48 rounded-xl" />
                                            )
                                        )}
                                    </>
                                )}
                                <div className="text-xs text-gray-300 mt-2 text-right">
                                    {msg.created_at?.slice(0, 19).replace('T', ' ')}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {loading && <div className="text-center text-gray-400">Loading...</div>}
            </div>
            <form onSubmit={handleSend} className="flex gap-3 justify-center items-center w-full max-w-3xl mx-auto mb-8">
                <input
                    type="text"
                    className="flex-1 border rounded-full px-4 py-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type your message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={sending}
                />
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={e => setFile(e.target.files[0])}
                    disabled={sending}
                    className="border rounded px-2 py-2 bg-white shadow"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow font-bold transition disabled:opacity-50"
                    disabled={sending || (!content.trim() && !file)}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
