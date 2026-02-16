import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Search, Send, CheckCheck, ShieldCheck, Loader2 } from "lucide-react";
import Axios from "../../utils/axios";
import SummaryApi from "../../common/SummerAPI";
import Pusher from 'pusher-js';
import { useLocation } from "react-router-dom"; 

const AdminInbox = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const scrollRef = useRef(null);
  
  const location = useLocation(); 
  const preSelectedUserId = location.state?.userId;

  // 1. Sidebar Users Fetch
  const fetchChatUsers = async () => {
    try {
      const res = await Axios({
        url: SummaryApi.getChat.url, 
        method: SummaryApi.getChat.method
      });
      if (res.data.success) setUsers(res.data.data || []);
    } catch (error) {
      console.error("Users load fail", error);
    }
  };

  useEffect(() => {
    fetchChatUsers();
  }, []);

  // 2. Chat History & Real-time Subscription
  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchUserChat = async () => {
      setLoadingChat(true);
      try {
        const res = await Axios({
          url: `${SummaryApi.getChatHistory.url}/${selectedUser._id}`,
          method: SummaryApi.getChatHistory.method
        });
        if (res.data.success) setMessages(res.data.data || []);
      } catch (error) {
        console.error("Chat load fail", error);
      } finally {
        setLoadingChat(false);
      }
    };

    fetchUserChat();

    // 🔥 PUSHER REAL-TIME
    const pusher = new Pusher('ae260e3a92e4368b2eed', { cluster: 'ap2' });
    const channelName = `chat-${selectedUser._id}`;
    const channel = pusher.subscribe(channelName);

    channel.bind('new-message', (data) => {
      const newMessage = data.message;
      fetchChatUsers(); // Update sidebar preview

      setMessages((prev) => {
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
  }, [selectedUser?._id]);

  // 3. Auto Scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 4. Send Reply
  const handleSendReply = async () => {
    if (!input.trim() || !selectedUser) return;
    const msgText = input;
    setInput("");

    try {
      // Optimistic Update
      const tempMsg = { _id: Date.now(), sender: "admin", message: msgText, createdAt: new Date() };
      setMessages(prev => [...prev, tempMsg]);

      await Axios({
        url: SummaryApi.sendChat.url,
        method: SummaryApi.sendChat.method,
        data: { message: msgText, receiver: selectedUser._id }
      });
    } catch (error) {
      alert("Failed to send message");
    }
  };

  const filteredUsers = (users || []).filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col bg-slate-50">
        <div className="p-4 border-b bg-white">
          <h2 className="text-xl font-bold mb-4">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
                type="text" placeholder="Search..." value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map(user => (
            <div 
                key={user._id} onClick={() => setSelectedUser(user)}
                className={`p-4 flex items-center gap-3 cursor-pointer border-b ${selectedUser?._id === user._id ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-slate-100'}`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold">{user.name?.[0]}</div>
              <div className="flex-1 truncate">
                <h4 className="font-bold text-sm">{user.name}</h4>
                <p className="text-xs text-slate-500 truncate">{user.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex justify-between items-center shadow-sm">
              <h3 className="font-bold">{selectedUser.name}</h3>
              <ShieldCheck className="text-blue-600" />
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-4">
              {loadingChat && <Loader2 className="animate-spin mx-auto text-slate-400" />}
              {messages.map((msg, i) => {
                const isMe = String(msg.sender?._id || msg.sender) !== String(selectedUser._id);
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[70%] text-sm ${isMe ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                      {msg.message}
                    </div>
                  </div>
                )
              })}
              <div ref={scrollRef} />
            </div>
            <div className="p-4 bg-white border-t flex gap-2">
              <input 
                className="flex-1 bg-slate-100 p-3 rounded-xl outline-none" 
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                placeholder="Type a reply..."
              />
              <button onClick={handleSendReply} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700"><Send size={20}/></button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default AdminInbox;