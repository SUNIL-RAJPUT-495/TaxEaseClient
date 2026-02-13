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

  // 1. Fetch Users List
  const fetchChatUsers = async () => {
    try {
      const res = await Axios({
        url: SummaryApi.getChat.url,
        method: SummaryApi.getChat.method
      });
      // Fallback to empty array if data is null
      if (res.data.success) setUsers(res.data.data || []);
      console.log(res.data)
    } catch (error) {
      console.error("Users load fail", error);
    }
  };

  // 2. Fetch Chat History
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

  // 3. Real-time setup
  useEffect(() => {
    fetchChatUsers();
    const pusher = new Pusher('ae260e3a92e4368b2eed', { cluster: 'ap2' });
    const channel = pusher.subscribe('chat-channel');

    channel.bind('new-message', (data) => {
      const newMessage = data.message;
      
      // Update message window if it's the current active chat
      if (selectedUser && (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id)) {
        setMessages((prev) => [...prev, newMessage]);
      }
      fetchChatUsers(); // Refresh list for last message update
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
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      
      {/* --- Sidebar: Users List --- */}
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
              className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-b border-slate-50 ${selectedUser?._id === user._id ? 'bg-blue-50 border-r-4 border-r-blue-600' : 'hover:bg-slate-100'}`}
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
                <p className="text-xs text-slate-500 truncate">{user.lastMessage || "Click to view chat"}</p>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-slate-400 text-xs">No users found</div>
          )}
        </div>
      </div>

      {/* --- Chat Window --- */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            <div className="px-6 py-4 border-b flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border text-slate-600 font-bold uppercase">{selectedUser.name?.[0]}</div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-[11px] text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              <ShieldCheck className="text-blue-600" size={24} />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${
                    msg.role === 'admin' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.message}
                    <div className={`text-[9px] mt-1 text-right ${msg.role === 'admin' ? 'text-blue-100' : 'text-slate-400'}`}>
                       {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-1.5 border border-slate-200">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder="Type a reply..." 
                  className="flex-1 bg-transparent outline-none text-sm py-3 text-slate-800"
                />
                <button onClick={handleSendReply} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <Mail className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-sm font-medium">Select a user to start conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInbox;