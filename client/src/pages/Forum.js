import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Forum.css';
import editIcon from '../assets/styles/edit.png';
import deleteIcon from '../assets/styles/delete.png';
import sendIcon from '../assets/styles/send.svg';
import bgImg from '../assets/styles/beckground.png'; // אפשר להחליף לכל תמונה אחרת

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
    const [actionsOpenId, setActionsOpenId] = useState(null);
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
            const res = await axios.get(
                `/api/messages?page=${pageToLoad}`,
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
        <div className="forum-bg min-h-screen flex flex-col" style={{ alignItems:'center', minHeight:'100vh' }}>
            <h2 className="forum-title">Game Forum Chat</h2>
            <div
                ref={chatRef}
                className="forum-chat-box"
                style={{
                    width: '850px',
                    maxWidth: '98vw',
                    height: '420px',
                    minHeight: '420px',
                    maxHeight: '420px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    background: '#fff',
                    borderRadius: '1.2rem',
                    boxShadow: '0 2px 12px #7CC3B622',
                    padding: '1.1rem 0.5rem',
                    margin: '0 auto 1.5rem auto'
                }}
                onScroll={handleScroll}
            >
                {messages.map((msg) => {
                    const isMe = msg.user?.id === user?.id;
                    const profileImg = msg.user?.profile_image || '/default-profile.png';
                    return (
                        <div
                            key={msg.id}
                            className={`forum-message-row ${isMe ? 'forum-message-me' : 'forum-message-other'}`}
                            style={{marginBottom:'1.1rem'}}
                        >
                            {/* תמונת פרופיל */}
                            <img
                                src={profileImg}
                                alt="profile"
                                className="forum-profile-img"
                            />
                            {/* שם השולח + שעה באותה שורה, צמוד לפרופיל */}
                            {!isMe && (
                              <div className="forum-message-meta" style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'0.5rem',marginBottom:'0.2rem',marginRight:'0.1rem'}}>
                                <span className="forum-message-username" style={{color:'#444a55',fontWeight:600}}>{msg.user?.username || 'User'}</span>
                                <span className="forum-message-time">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                              </div>
                            )}
                            <div
                                className={`forum-bubble ${isMe ? 'forum-bubble-me' : 'forum-bubble-other'}`}
                                style={{marginLeft:isMe?0:6,marginRight:isMe?6:0,display:'flex',alignItems:'center',position:'relative',width:'fit-content',minWidth:0,maxWidth:'80vw',padding:'0.5rem 0.9rem',borderRadius:'1.2rem 1.2rem 1.2rem 0.5rem',boxShadow:'none',background:isMe?'#7CC3B6':'#f3f6fa',color:isMe?'#fff':'#222',border:'none',direction:isMe?'rtl':'ltr',justifyContent:isMe?'flex-end':'flex-start'}}
                            >
                                {/* תפריט אקשן - שלוש נקודות */}
                                {isMe && editingId !== msg.id && (
                                    <div style={{position:'absolute',top:'0.2rem',right:'0.3rem',display:'flex',alignItems:'center'}}>
                                        <button
                                            className="forum-actions-menu-btn"
                                            style={{marginRight:0,marginLeft:'0.7rem',color:'#fff',background:'none'}}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setActionsOpenId(actionsOpenId === msg.id ? null : msg.id);
                                            }}
                                            aria-label="Actions"
                                        >
                                            <span style={{fontSize:'1.3rem',color:'#fff',fontWeight:'bold',lineHeight:1}}>&#8942;</span>
                                        </button>
                                        {actionsOpenId === msg.id && (
                                            <div className="forum-actions-dropdown" style={{right:0,left:'unset',minWidth:'120px', whiteSpace: 'nowrap'}} onClick={e => e.stopPropagation()}>
                                                <button onClick={() => { setActionsOpenId(null); handleEdit(msg); }} className="forum-actions-dropdown-btn" style={{fontSize:'0.98rem',padding:'0.2rem 0.7rem',whiteSpace:'nowrap',display:'flex',alignItems:'center'}}>
                                                    <img src={editIcon} alt="EDIT" style={{width:18,height:18,marginLeft:'0.3rem'}} /> EDIT
                                                </button>
                                                <button onClick={() => { setActionsOpenId(null); handleDelete(msg); }} className="forum-actions-dropdown-btn" style={{fontSize:'0.98rem',padding:'0.2rem 0.7rem',whiteSpace:'nowrap',display:'flex',alignItems:'center'}}>
                                                    <img src={deleteIcon} alt="DELETE" style={{width:18,height:18,marginLeft:'0.3rem'}} /> DELETE
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* עריכת הודעה */}
                                {editingId === msg.id ? (
                                  <form onSubmit={e => {e.preventDefault(); handleEditSave(msg);}} style={{display:'flex',alignItems:'center',width:'100%'}}>
                                    <input
                                      type="text"
                                      value={editContent}
                                      onChange={e => setEditContent(e.target.value)}
                                      className="forum-edit-input"
                                      style={{flex:1,minWidth:0,padding:'0.3rem 0.6rem',borderRadius:'0.7rem',border:'1px solid #CDE1DB',fontSize:'1rem',marginLeft:'0.5rem'}}
                                      autoFocus
                                      disabled={editLoading}
                                      placeholder={msg.content}
                                    />
                                    <button type="submit" disabled={editLoading} style={{background:'#7CC3B6',color:'#fff',border:'none',borderRadius:'0.5rem',padding:'0.2rem 0.7rem',marginLeft:'0.2rem',fontWeight:600,cursor:'pointer'}}>Save</button>
                                    <button type="button" onClick={handleEditCancel} disabled={editLoading} style={{background:'#eee',color:'#222',border:'none',borderRadius:'0.5rem',padding:'0.2rem 0.7rem',marginLeft:'0.2rem',fontWeight:600,cursor:'pointer'}}>Cancel</button>
                                  </form>
                                ) : (
                                  <span className="forum-message-text" style={{flex:1,textAlign:isMe?'right':'left',fontSize:'1rem',fontWeight:500,marginRight:isMe?'.7rem':0}}>{msg.content}</span>
                                )}
                                {/* הצגת מדיה */}
                                {msg.media_url && (
                                    msg.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                                        <video src={msg.media_url} controls className="mt-2 max-h-32 rounded-xl" style={{maxWidth:'120px'}} />
                                    ) : (
                                        <img src={msg.media_url} alt="media" className="mt-2 max-h-32 rounded-xl" style={{maxWidth:'120px'}} />
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
                {loading && <div className="text-center text-gray-400">Loading...</div>}
            </div>
            <form onSubmit={handleSend} className="forum-send-form">
                <input
                    type="text"
                    className="forum-send-input"
                    placeholder="Type your message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={sending}
                />
                <label className="forum-send-file-label">
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={e => setFile(e.target.files[0])}
                        disabled={sending}
                    />
                    <img src={editIcon} alt="attach" />
                </label>
                <button
                    type="submit"
                    className="forum-send-btn"
                    disabled={sending || (!content.trim() && !file)}
                >
                    <img src={sendIcon} alt="send" />
                </button>
            </form>
        </div>
    );
}
