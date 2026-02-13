// components/ChatWindow.jsx
import Pusher from 'pusher-js';

const ChatWindow = ({ adminId, userId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Purani chats load karein
        const fetchChats = async () => {
            const res = await Axios.get(`/api/chat/get/${adminId}`);
            setMessages(res.data);
        };
        fetchChats();

        // Pusher listen karein (Real-time updates)
        const pusher = new Pusher('YOUR_KEY', { cluster: 'ap2' });
        const channel = pusher.subscribe(`chat-${userId}`);
        
        channel.bind('new-message', (data) => {
            setMessages((prev) => [...prev, data.message]);
        });

        return () => pusher.unsubscribe(`chat-${userId}`);
    }, [userId]);

    // Send Message UI...
};