import React, { useEffect, useRef } from "react";
import { User, Shield, Send } from "lucide-react";

const SupportChat = ({ userData, messages, setMessages, input, setInput, onSend }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_history_${userData?._id}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [userData?._id, setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_history_${userData?._id}`, JSON.stringify(messages));
    }
    
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, userData?._id]);

  return (
    <div className="h-[calc(100vh-180px)] min-h-[500px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">A</div>
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-slate-50/30 space-y-4 scroll-smooth">
        {/* Admin Welcome Message (Static) */}
        <div className="flex justify-start items-start gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center flex-shrink-0"><User size={14}/></div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-800">
            Hello {userData?.name?.split(" ")[0]}! Main TaxEase Admin hoon. Main aapki kaise help kar sakta hoon?
          </div>
        </div>

        {messages.map((msg, i) => {
          const isUser = msg.senderId === userData?._id || msg.role === 'user';
          
          return (
            <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                 <div className="w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center flex-shrink-0 mr-2"><User size={14}/></div>
              )}
              <div className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                isUser 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border text-slate-800 rounded-tl-none'
              }`}>
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>


      {/* Input Bar */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 focus-within:border-blue-300 transition-all">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder="Type your message here..." 
            className="flex-1 bg-transparent outline-none text-sm py-3" 
          />
          <button 
            onClick={onSend} 
            disabled={!input.trim()}
            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;