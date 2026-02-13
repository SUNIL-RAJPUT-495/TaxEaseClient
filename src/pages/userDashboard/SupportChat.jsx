import React, { useEffect, useRef } from "react";
import { User, Shield, Send, CheckCheck } from "lucide-react"; 
import Pusher from 'pusher-js'; 

// 🔥 FIX 1: Normal 'axios' hata kar aapka custom Axios import kiya hai (Jisme Token laga hota hai)
import Axios from "../../utils/axios"; 
import SummaryApi from "../../common/SummerAPI"; 

const SupportChat = ({ userData, messages, setMessages, input, setInput, onSend }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!userData?._id) return;

    // 1. History Fetch Logic
    const fetchChatHistory = async () => {
      try {
        // 🔥 FIX 2: Custom Axios use kar rahe hain, toh token apne aap chala jayega
        const res = await Axios({
          url: `${SummaryApi.getChatHistory.url}/admin`, 
          method: SummaryApi.getChatHistory.method
        });

        if (res.data.success) {
          setMessages(res.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error.response?.data || error.message);
      }
    };

    fetchChatHistory();

    // 2. Real-time Pusher setup
    const pusher = new Pusher('ae260e3a92e4368b2eed', { cluster: 'ap2' });
    const channel = pusher.subscribe('chat-channel');

    channel.bind('new-message', (data) => {
      const newMessage = data.message;
      const myId = userData._id.toString();
      
      const receiverId = newMessage.receiver?._id || newMessage.receiver;
      const senderId = newMessage.sender?._id || newMessage.sender;

      if (
          (receiverId && receiverId.toString() === myId) || 
          (senderId && senderId.toString() === myId)
      ) {
        setMessages((prev) => {
          if (prev.some(m => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userData?._id, setMessages]);

  // 3. Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-180px)] min-h-[500px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
              A
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Official Support</h3>
            <p className="text-[10px] text-green-600 font-bold uppercase animate-pulse">Online</p>
          </div>
        </div>
        <Shield size={20} className="text-blue-600" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#f1f5f9] space-y-4 scroll-smooth">
        {/* Admin Welcome Message */}
        <div className="flex justify-start items-start gap-3 w-full">
          <div className="w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center flex-shrink-0">
            <User size={14}/>
          </div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-sm text-slate-800 font-medium max-w-[80%]">
            Hello {userData?.name?.split(" ")[0] || "User"}! Main TaxEase Admin hoon. Main aapki kaise help kar sakta hoon?
          </div>
        </div>

        {/* Dynamic Messages Mapping */}
        {messages.map((msg, i) => {
          const senderId = msg.sender?._id || msg.sender;
          const isMe = senderId === userData?._id; 
          
          return (
            <div key={msg._id || i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
              
              {!isMe && (
                 <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 shadow-sm flex items-center justify-center flex-shrink-0 mr-2 text-blue-600 font-bold text-[10px]">
                   A
                 </div>
              )}

              <div className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm leading-relaxed ${
                isMe 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' 
              }`}>
                
                <p>{msg.message}</p>
                
                <div className={`text-[9px] mt-1 flex items-center gap-1 font-medium ${isMe ? 'justify-end text-blue-100' : 'justify-start text-slate-400'}`}>
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <CheckCheck size={11} className={msg.seen ? "text-blue-300" : "text-blue-100"} />}
                </div>

              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:bg-white transition-all">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && input.trim() && onSend()} 
            placeholder="Type your message here..." 
            className="flex-1 bg-transparent outline-none text-sm py-3 text-slate-800" 
          />
          <button 
            onClick={onSend} 
            disabled={!input.trim()}
            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;