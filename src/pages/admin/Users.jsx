import React, { useEffect, useState } from 'react';
import Axios from '../../utils/axios';
import SummaryApi from '../../common/SummerAPI';
import { Search, Loader2, User, Mail, Shield, Calendar, Trash2, Edit } from 'lucide-react';

const RoleBadge = ({ role }) => {
  const isAdmin = role === 'ADMIN' || role === 'admin';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
      isAdmin 
        ? "bg-purple-100 text-purple-800 border-purple-200" 
        : "bg-slate-100 text-slate-600 border-slate-200"
    }`}>
      {isAdmin ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
      {role ? role.toUpperCase() : "USER"}
    </span>
  );
};

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

  const filteredUsers = allUsers.filter((user) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-6">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm">Manage all registered users and their roles.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Name or Email..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            
            {/* Table Head */}
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id || index} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Name & Avatar */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                           {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="font-medium text-slate-900">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {user.email}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Joined Date */}
                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actions (Edit/Delete) */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-blue-600 transition-colors" title="Edit User">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-full text-slate-500 hover:text-red-600 transition-colors" title="Delete User">
                            <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                        <User className="w-8 h-8 text-slate-300 mb-2" />
                        <p>No users found matching "{searchTerm}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer (Total Count) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 flex justify-between items-center">
            <span>Showing {filteredUsers.length} of {allUsers.length} users</span>
        </div>
      </div>

    </div>
  );
}

export default Users;