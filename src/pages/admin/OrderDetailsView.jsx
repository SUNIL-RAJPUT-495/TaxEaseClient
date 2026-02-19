import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCheck, FileText, Upload, X, Eye, FileCheck, XCircle, ShieldCheck, Loader2, AlertTriangle, Info, MessageSquareText } from 'lucide-react';
import Axios from '../../utils/axios';
import SummaryApi from '../../common/SummerAPI';
import Pusher from 'pusher-js';
import { toast } from 'react-hot-toast';

const hideScrollbarClass = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

// --- 1. CHAT SECTION (Pusher Integrated) ---
const ChatSection = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false); 
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
        if (!user?._id) return;

        const pusher = new Pusher('ae260e3a92e4368b2eed', { cluster: 'ap2' });
        const channelName = `chat-${user._id}`; 
        const channel = pusher.subscribe(channelName);
        
        console.log("🔗 Admin Connected to:", channelName);

        channel.bind('new-message', (data) => {
            console.log("🚀 Message Aaya:", data);
            const newMessage = data.message;

            setMessages(prev => {
                const exists = prev.some(m => String(m._id) === String(newMessage._id));
                if (exists) return prev;
                return [...prev, newMessage];
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [user?._id]); 

    useEffect(() => { 
        scrollRef.current?.scrollIntoView({ behavior: "smooth" }); 
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;
        
        const msgText = input;
        setInput("");      
        setSending(true);  

        try {
            await Axios({
                url: SummaryApi.sendChat.url,
                method: SummaryApi.sendChat.method,
                data: { message: msgText, receiver: user._id }
            });


        } catch (err) { 
            toast.error("Message failed");
            setInput(msgText);
        } finally {
            setSending(false); 
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b bg-slate-50 font-semibold text-slate-700 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" />
                Live Chat with {user?.name}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f1f5f9] [&::-webkit-scrollbar]:hidden">
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

            <div className="p-3 border-t bg-white flex gap-2 items-center">
                <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()} 
                    placeholder="Type a message..." 
                    disabled={sending}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-full text-sm outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:opacity-50" 
                />
                
                {/* 🔥 Styled Send Button */}
                <button 
                    onClick={handleSend} 
                    disabled={!input.trim() || sending}
                    className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center shadow-md ${
                        !input.trim() || sending
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                    }`}
                >
                    {sending ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Send size={20} className={input.trim() ? "ml-0.5" : ""} />
                    )}
                </button>
            </div>
        </div>
    );
};


const DocumentsSection = ({ user, activeService, onAdminUpload }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false); // 🔥 Modal State

    const documents = activeService?.documents || [];
    const isServiceRejected = activeService?.status === 'rejected';

    const handleUpload = async () => {
        if (!file || !activeService?._id) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", user._id);
        formData.append("activeServiceId", activeService._id); 
        
        try {
            const res = await Axios({
                url: SummaryApi.adminUploadDoc.url,
                method: SummaryApi.adminUploadDoc.method,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" } 
            });

            if (res.data.success) {
                toast.success("Document Dispatched!");
                onAdminUpload(res.data.data); 
                setFile(null);
            }
        } catch (err) { toast.error("Upload failed."); }
        finally { setUploading(false); }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
            
            {/* 🔥 REJECTION REASON MODAL */}
            {showReasonModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReasonModal(false)} />
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl relative z-10 p-8 text-center animate-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic tracking-tight">Client Feedback</h3>
                        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-sm text-red-800 font-bold italic leading-relaxed mb-6">
                            "{activeService?.serviceRejectionReason || 'No specific reason provided.'}"
                        </div>
                        <button 
                            onClick={() => setShowReasonModal(false)} 
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-all active:scale-95"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER WITH REASON BUTTON */}
            <div className={`p-4 border-b font-semibold flex justify-between items-center ${isServiceRejected ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-700'}`}>
                <div className="flex items-center gap-2">
                    <FileCheck size={18} className={isServiceRejected ? 'text-red-500' : 'text-blue-500'} />
                    <span>Documents Vault</span>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* 🔥 SHOW REASON BUTTON (Only if Rejected) */}
                    {isServiceRejected && (
                        <button 
                            onClick={() => setShowReasonModal(true)}
                            className="text-[10px] bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-all flex items-center gap-1 shadow-md uppercase font-black"
                        >
                            <Info size={12} /> View Reason
                        </button>
                    )}
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">{documents.length} Files</span>
                </div>
            </div>

            <div className={`flex-1 overflow-y-auto p-4 space-y-3`}>
                {documents.map((doc, i) => {
                    const isAdminDoc = doc.uploadedBy === 'ADMIN';
                    const isDocRejected = doc.docStatus === 'rejected';
                    const isDocApproved = doc.docStatus === 'approved';

                    return (
                        <div key={doc._id || i} className={`p-3 border rounded-xl transition-all flex justify-between items-center group shadow-sm ${
                            isDocRejected 
                                ? 'bg-red-50 border-red-200' 
                                : isDocApproved 
                                    ? 'bg-green-50 border-green-200'
                                    : isAdminDoc 
                                        ? 'bg-blue-600 text-white border-blue-500' 
                                        : 'bg-indigo-50 border-indigo-100'
                        }`}>
                            <div className="flex gap-3 items-center truncate">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                                    isDocRejected ? 'bg-red-100 text-red-600' : isDocApproved ? 'bg-green-100 text-green-600' : 'bg-white/10 text-white'
                                }`}>
                                    <FileText size={20} />
                                </div>
                                <div className="truncate">
                                    <p className={`text-sm font-bold truncate ${isAdminDoc && !isDocRejected && !isDocApproved ? 'text-white' : 'text-slate-800'}`}>
                                        {doc.name || `File ${i + 1}`}
                                    </p>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                        isDocRejected ? 'bg-red-200 text-red-700' : isDocApproved ? 'bg-green-200 text-green-700' : isAdminDoc ? 'bg-white/20 text-white' : 'bg-indigo-200 text-indigo-700'
                                    }`}>
                                        {isAdminDoc ? (isDocRejected ? 'Rejected' : isDocApproved ? 'Approved' : 'Draft') : 'Client Upload'}
                                    </span>
                                </div>
                            </div>
                            <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 hover:bg-black/10 rounded-lg"><Eye size={18} /></a>
                        </div>
                    )
                })}
            </div>

            {/* UPLOAD SECTION */}
            <div className="p-4 border-t bg-slate-50 space-y-3">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center relative group hover:border-blue-500 transition-all">
                    <input type="file" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload size={20} className="mx-auto mb-1 text-slate-400 group-hover:text-blue-500" />
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-600 uppercase">Upload Corrected Files</span>
                </div>
                {file && (
                    <button onClick={handleUpload} disabled={uploading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl">
                        {uploading ? "Dispatching..." : "Dispatch Corrected Draft"}
                    </button>
                )}
            </div>
        </div>
    )
};

// --- 3. MAIN ORDER DETAILS PAGE ---
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
            } catch (error) { toast.error("Fetch failed"); }
            finally { setLoading(false); }
        };
        fetchOrder();
    }, [id]);

    // 🔥 Find active service related to this order
    const activeService = order?.userId?.activeServices?.find(s => String(s.orderId) === String(order._id));

    const handleAdminFileUpload = (updatedUser) => { setOrder(prev => ({ ...prev, userId: updatedUser })); };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    if (!order || !order.userId) return <div className="p-10 text-center text-slate-500">Not Found</div>;

    return (
        <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-4 font-sans text-slate-900">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <button onClick={() => navigate('/admin/orders')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><ArrowLeft size={20} /></button>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 italic uppercase">ORDER MANAGEMENT</h2>
                    <p className="text-xs text-slate-500 font-medium italic uppercase">#{order._id.slice(-6)} • {order.userId.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Chat as usual */}
                <ChatSection user={order.userId} />
                
                {/* Updated Documents Section */}
                <DocumentsSection
                    user={order.userId}
                    activeService={activeService}
                    onAdminUpload={handleAdminFileUpload}
                />
            </div>
        </div>
    );
};

export default OrderDetails;