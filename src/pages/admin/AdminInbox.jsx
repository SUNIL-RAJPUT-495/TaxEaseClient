import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Search, Send, CheckCheck, ShieldCheck } from "lucide-react";
import Axios from "../../utils/axios";
import SummaryApi from "../../common/SummerAPI";
import Pusher from 'pusher-js';

const AdminInbox = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef(null);

  // 1. Fetch Users List (Sidebar)
  const fetchChatUsers = async () => {
    try {
      const res = await Axios({
        url: SummaryApi.getChat.url,
        method: SummaryApi.getChat.method
      });
      console.log(res)
      if (res.data.success) setUsers(res.data.data || []);
    } catch (error) {
      console.error("Users load fail", error);
    }
  };

  // 2. Fetch Chat History (Active Window)
  const fetchUserChat = async (userId) => {
    try {
      const res = await Axios({
        url: SummaryApi.getChatHistory.url + "/" + userId,
        method: SummaryApi.getChatHistory.method
      });
      if (res.data.success) setMessages(res.data.data || []);
    } catch (error) {
      console.error("Chat load fail", error);
    }
  };

  // 3. Real-time Setup (Pusher)
  useEffect(() => {
    fetchChatUsers();
    const pusher = new Pusher('ae260e3a92e4368b2eed', { cluster: 'ap2' });
    const channel = pusher.subscribe('chat-channel');

    channel.bind('new-message', (data) => {
      const newMessage = data.message;
      
      // Update window only if it matches current chat
      if (selectedUser && (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id)) {
        setMessages((prev) => {
          if (prev.find(m => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }
      fetchChatUsers();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser?._id) fetchUserChat(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Reply Logic
  const handleSendReply = async () => {
    if (!input.trim() || !selectedUser) return;
    const currentInput = input;
    setInput(""); 

    try {
      const res = await Axios({
        url: SummaryApi.sendChat.url,
        method: SummaryApi.sendChat.method,
        data: {
          message: currentInput,
          receiver: selectedUser._id,
          role: 'admin' 
        }
      });
      
      if (res.data.success) {
        // Optimistic update for better speed
        setMessages((prev) => [...prev, res.data.data]);
      }
    } catch (error) {
      alert("Reply failed!");
    }
  };

  const filteredUsers = (users || []).filter(u => {
    const name = u?.name ? u.name.toLowerCase() : "";
    const email = u?.email ? u.email.toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Users --- */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b bg-white">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? filteredUsers.map((user) => (
            <div 
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-b border-slate-50 ${selectedUser?._id === user._id ? 'bg-blue-50 border-r-4 border-r-blue-600 shadow-sm' : 'hover:bg-slate-100'}`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 uppercase">
                {user?.name?.[0] || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{user.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {user.lastChatTime ? new Date(user.lastChatTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{user.lastMessage || "No messages yet"}</p>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-slate-400 text-xs font-medium">No users found</div>
          )}
        </div>
      </div>

      {/* --- Right Side: Chat Window --- */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border text-slate-600 font-bold uppercase">{selectedUser.name?.[0]}</div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedUser.name}</h3>
                  <p className="text-[11px] text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              <ShieldCheck className="text-blue-600" size={22} />
            </div>

            {/* Message History Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f1f5f9]">
              {messages.map((msg, i) => {
                // IMPORTANT: Admin message goes to RIGHT, User message to LEFT
                const isMeAdmin = msg.role === 'admin';
                return (
                  <div key={i} className={`flex w-full ${isMeAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      isMeAdmin 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      <p>{msg.message}</p>
                      <div className={`text-[9px] mt-1 flex items-center justify-end gap-1 font-medium ${isMeAdmin ? 'text-blue-100' : 'text-slate-400'}`}>
                         {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         {isMeAdmin && <CheckCheck size={11} />}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={scrollRef} />
            </div>

            {/* Reply Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-1 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:bg-white transition-all">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder={`Reply to ${selectedUser.name}...`} 
                  className="flex-1 bg-transparent outline-none text-sm py-3 text-slate-800"
                />
                <button 
                  onClick={handleSendReply} 
                  disabled={!input.trim()}
                  className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Mail className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Select a user from the sidebar to start</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInbox;