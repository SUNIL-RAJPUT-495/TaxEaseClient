import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCheck, FileText, Upload, X, Eye, CheckCircle, XCircle, ShieldCheck, Loader2 } from 'lucide-react';
import Axios from '../../utils/axios';
import SummaryApi from '../../common/SummerAPI';
import Pusher from 'pusher-js';
import { toast } from 'react-hot-toast';

const hideScrollbarClass = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

// --- 1. CHAT SECTION ---
const ChatSection = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!user?._id) return;
        const fetchChat = async () => {
            try {
                const res = await Axios({
                    url: SummaryApi.getChatHistory.url + "/" + user._id,
                    method: SummaryApi.getChatHistory.method
                });
                if (res.data.success) setMessages(res.data.data || []);
            } catch (err) { console.error(err); }
        };
        fetchChat();
    }, [user]);

    useEffect(() => {
        const pusher = new Pusher('ae260e3a92e4368b2eed', { cluster: 'ap2' });
        const channel = pusher.subscribe('chat-channel');
        channel.bind('new-message', (data) => {
            const newMessage = data.message;
            const senderId = String(newMessage.sender?._id || newMessage.sender);
            const currentUserId = String(user._id);

            if (senderId === currentUserId || String(newMessage.receiver?._id || newMessage.receiver) === currentUserId) {
                setMessages(prev => {
                    if (prev.some(m => String(m._id) === String(newMessage._id))) return prev;
                    return [...prev, newMessage];
                });
            }
        });
        return () => { channel.unbind_all(); channel.unsubscribe(); pusher.disconnect(); };
    }, [user]);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        try {
            const res = await Axios({
                url: SummaryApi.sendChat.url,
                method: SummaryApi.sendChat.method,
                data: { message: input, receiver: user._id }
            });
            if (res.data.success) {
                setMessages(prev => [...prev, res.data.data]);
                setInput("");
            }
        } catch (err) { toast.error("Message failed"); }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b bg-slate-50 font-semibold text-slate-700 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" /> Live Chat with {user.name}
            </div>
            <div className={`flex-1 overflow-y-auto p-4 space-y-3 bg-[#f1f5f9] ${hideScrollbarClass}`}>
                {messages.map((msg, i) => {
                    const isMe = String(msg.sender?._id || msg.sender) !== String(user._id);
                    return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-800 rounded-tl-none'}`}>
                                <p>{msg.message}</p>
                                <div className={`text-[10px] mt-1 flex justify-end gap-1 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMe && <CheckCheck size={12} />}
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={scrollRef} />
            </div>
            <div className="p-3 border-t bg-white flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-full text-sm outline-none bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all" />
                <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-90 transition-all"><Send size={18} /></button>
            </div>
        </div>
    );
};

// --- 2. DOCUMENTS SECTION ---
const DocumentsSection = ({ user, documents = [], onStatusUpdate, onAdminUpload }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const safeDocuments = Array.isArray(documents) ? documents : [];

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", user._id);

        try {
            const res = await Axios({
                url: SummaryApi.adminUploadDoc.url,
                method: SummaryApi.adminUploadDoc.method,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" } 
            });

            if (res.data.success) {
                toast.success("Document dispatched to user!");
                onAdminUpload(res.data.data); 
                setFile(null);
            }
        } catch (err) {
            console.error(err);
            toast.error("Upload failed. Check API endpoint.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b bg-slate-50 font-semibold text-slate-700 flex justify-between items-center">
                <span>Documents Vault</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">{safeDocuments.length} Files</span>
            </div>

            <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${hideScrollbarClass}`}>
                {safeDocuments.length > 0 ? (
                    safeDocuments.map((doc, i) => {
                        const isAdminDoc = doc.uploadedBy === 'ADMIN';

                        return (
                            <div key={doc._id || i} className={`p-3 border rounded-xl transition-all flex justify-between items-center group shadow-sm ${isAdminDoc
                                ? 'bg-blue-600 text-white border-blue-500 shadow-blue-100'
                                : 'bg-slate-50 hover:bg-white border-slate-200'
                                }`}>
                                <div className="flex gap-3 overflow-hidden items-center">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${isAdminDoc ? 'bg-white/20 border-white/30 text-white' : 'bg-blue-100 text-blue-600 border-blue-200'}`}>
                                        <FileText size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-sm font-bold truncate ${isAdminDoc ? 'text-white' : 'text-slate-800'}`} title={doc.name}>{doc.name || `Document ${i + 1}`}</p>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isAdminDoc ? 'bg-white/20 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {isAdminDoc ? 'Sent by Admin' : (doc.status || 'PENDING')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <a href={doc.url} target="_blank" rel="noreferrer" className={`p-2 rounded-lg transition-colors ${isAdminDoc ? 'hover:bg-white/20 text-white' : 'hover:bg-blue-100 text-blue-600'}`}><Eye size={18} /></a>

                                    
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50 italic text-sm">
                        <FileText size={40} className="mb-2" />
                        <p>No documents found.</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-slate-50 space-y-3">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer relative hover:border-blue-400 hover:bg-white transition-all group">
                    <input type="file" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    {file ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-bold">
                            <CheckCircle size={16} /> {file.name}
                        </div>
                    ) : (
                        <div className="text-slate-400 text-xs flex flex-col items-center gap-1 group-hover:text-blue-500">
                            <Upload size={20} className="mb-1" />
                            <span className="font-semibold">Click to Upload & Send to User</span>
                        </div>
                    )}
                </div>
                {file && (
                    <button onClick={handleUpload} disabled={uploading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50">
                        {uploading ? "Uploading..." : "Dispatch Now"}
                    </button>
                )}
            </div>
        </div>
    )
};
const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await Axios({ url: SummaryApi.allOrders.url, method: SummaryApi.allOrders.method });
                if (res.data.success) {
                    const foundOrder = res.data.data.find(o => o._id === id);
                    setOrder(foundOrder);
                }
            } catch (error) { toast.error("Order error"); }
            finally { setLoading(false); }
        };
        fetchOrder();
    }, [id]);

    const handleDocStatusUpdate = async (userId, docId, status) => {
        try {
            const res = await Axios({
                url: SummaryApi.updateDocStatus.url,
                method: SummaryApi.updateDocStatus.method,
                data: { userId, docId, status }
            });
            if (res.data.success) {
                setOrder(prev => ({
                    ...prev,
                    userId: {
                        ...prev.userId,
                        documents: prev.userId.documents.map(d => d._id === docId ? { ...d, status } : d)
                    }
                }));
                toast.success(`Marked as ${status}`);
            }
        } catch (error) { toast.error("Update failed"); }
    };

    const handleAdminFileUpload = (updatedUser) => { setOrder(prev => ({ ...prev, userId: updatedUser })); };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    if (!order || !order.userId) return <div className="p-10 text-center text-slate-500">Not Found</div>;

    return (
        <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <button onClick={() => navigate('/admin/orders')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-all font-medium"><ArrowLeft size={20} /></button>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">Order #{order._id.slice(-6).toUpperCase()}</h2>
                    <p className="text-xs text-slate-500 font-medium">{order.service} • Client: {order.userId.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <ChatSection user={order.userId} />
                <DocumentsSection
                    user={order.userId}
                    documents={order.userId.documents || []}
                    onStatusUpdate={handleDocStatusUpdate}
                    onAdminUpload={handleAdminFileUpload}
                />
            </div>
        </div>
    );
};

export default OrderDetails;