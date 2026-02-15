import React, { useEffect, useState, useRef } from "react";
import { Send, CheckCheck, MessageSquare, Loader2, ArrowLeft, Headset, MoreVertical } from "lucide-react"; 
import Pusher from 'pusher-js'; 
import Axios from "../utils/axios"; 
import SummaryApi from "../common/SummerAPI";
import { useNavigate } from "react-router-dom";

// --- Date Helper ---
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const UserChatPage = () => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // 1. User Data Fetch
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await Axios({
          url: SummaryApi.userDetails.url, 
          method: SummaryApi.userDetails.method
        });
        if (res.data.success) setUserData(res.data.data);
      } catch (error) {
        console.error("User error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
     if (!userData?._id) return;

    const fetchChatHistory = async () => {
      try {
        const res = await Axios({
          url: `${SummaryApi.getChatHistory.url}/admin`, 
          method: SummaryApi.getChatHistory.method
        });

        if (res.data.success) {
          setMessages(res.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    const pusher = new Pusher('ae260e3a92e4368b2eed', { cluster: 'ap2' });
    const channel = pusher.subscribe('chat-channel');

    channel.bind('new-message', (data) => {
      const newMessage = data.message;
      const myId = String(userData._id);
      
      const isForMe = String(newMessage.receiver) === myId || String(newMessage.receiver?._id) === myId;
      const isFromMe = String(newMessage.sender) === myId || String(newMessage.sender?._id) === myId;

      if (isForMe || isFromMe) {
        setMessages((prev) => {
          if (prev.some(m => String(m._id) === String(newMessage._id))) return prev;
          return [...prev, newMessage];
        });
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userData?._id]);

  // 3. Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message (User -> Admin)
  const handleSendMessage = async () => {
    if (!input.trim() || isSending) return;

    const msgText = input;
    setInput(""); 
    setIsSending(true);

    try {
      // Optimistic UI
      const tempMsg = {
        _id: Date.now(),
        sender: userData._id,
        message: msgText,
        createdAt: new Date().toISOString(),
        seen: false,
      };
      setMessages(prev => [...prev, tempMsg]);

      await Axios({
        url: SummaryApi.sendChat.url,
        method: SummaryApi.sendChat.method,
        data: {
          message: msgText,
          receiver: "admin"
        }
      });
    } catch (error) {
      console.error("Send failed", error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  let lastDate = null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[600px] max-w-4xl mx-auto bg-white md:border border-slate-200 md:rounded-2xl md:shadow-xl md:mt-8 overflow-hidden font-sans">
      
      {/* --- 1. Header (User Perspective) --- */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="md:hidden text-slate-500"><ArrowLeft size={20}/></button>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white border-2 border-indigo-100">
              <Headset size={20} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          
          <div>
            <h3 className="font-bold text-slate-800 text-sm">TaxEase Support</h3>
            <p className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span> Online
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20}/></button>
      </div>

      {/* --- 2. Chat Area --- */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F2F6FC] space-y-2">
        
        {/* Security Note */}
        <div className="flex justify-center mb-6">
          <span className="text-[10px] bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200 flex items-center gap-1">
            <ShieldCheck size={10} /> End-to-end encrypted
          </span>
        </div>

        {/* Default Welcome Message */}
        <div className="flex justify-start gap-2 w-full max-w-[85%]">
           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
             TE
           </div>
           <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-sm text-slate-700">
              Hi {userData?.name?.split(" ")[0]}! 👋 <br/>
              How can we help you with your tax filing today?
           </div>
        </div>

        {/* Messages Loop */}
        {messages.map((msg, i) => {
          const isMe = String(msg.sender) === String(userData._id) || String(msg.sender?._id) === String(userData._id);
          const msgDate = formatDate(msg.createdAt);
          const showDate = lastDate !== msgDate;
          lastDate = msgDate;

          return (
            <div key={i}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-200 px-2 py-0.5 rounded text-center">{msgDate}</span>
                </div>
              )}

              <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative px-4 py-2 max-w-[80%] rounded-2xl text-sm shadow-sm leading-relaxed ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  <p>{msg.message}</p>
                  <div className={`text-[9px] flex justify-end items-center gap-1 mt-1 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && <CheckCheck size={12} className={msg.seen ? "text-blue-200" : "text-blue-300/50"} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* --- 3. Input Area --- */}
      <div className="p-3 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your query..."
            disabled={isSending}
            className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isSending}
            className={`p-2 rounded-full transition-all ${
              !input.trim() 
                ? "bg-slate-200 text-slate-400" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            }`}
          >
            {isSending ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} className="ml-0.5"/>}
          </button>
        </div>
      </div>

    </div>
  );
};

// Simple Shield Icon for Security
const ShieldCheck = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default UserChatPage;