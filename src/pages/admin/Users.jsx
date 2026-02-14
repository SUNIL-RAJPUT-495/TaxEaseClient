import React, { useEffect, useState } from 'react';
import Axios from '../../utils/axios';
import SummaryApi from '../../common/SummerAPI';
import { Search, Loader2, User, Mail, Calendar, Trash2, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: SummaryApi.allUsers.url,
        method: SummaryApi.allUsers.method,
      });

      if (response.data.success) {
        setAllUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? All their orders and data will be permanently removed.`)) {
      try {
        const response = await Axios({
          url: SummaryApi.deletUser.url,
          method: SummaryApi.deletUser.method,
          data: { userId: userId } 
        });

        if (response.data.success) {
          toast.success("User and all related data deleted!");
          setAllUsers(prev => prev.filter(u => u._id !== userId));
        }
      } catch (error) {
        console.error("Delete Error:", error);
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  // 🔥 FILTER LOGIC: Search + HIDE ADMIN
  const filteredUsers = allUsers.filter((user) => {
    // 1. Pehle check karein ki user Admin toh nahi hai
    const isNotAdmin = user.role !== 'admin' && user.role !== 'ADMIN';

    // 2. Search matches
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    return isNotAdmin && matchesSearch; // Sirf wahi dikhao jo admin nahi hai aur search match karta hai
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm">Manage all registered normal users.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Name, Email or Phone..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Mobile Number</th> 
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id || index} className="hover:bg-slate-50 transition-colors">
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                           {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="font-medium text-slate-900">{user.name}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {user.email}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-slate-700">
                            {user.phone || user.mobile || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDeleteUser(user._id, user.name)} 
                          className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 transition-all active:scale-90" 
                          title="Delete User Permanently"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-500 font-medium">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 flex justify-between items-center font-bold uppercase tracking-wider">
            <span>Showing {filteredUsers.length} Users</span>
        </div>
      </div>
    </div>
  );
}

export default Users;