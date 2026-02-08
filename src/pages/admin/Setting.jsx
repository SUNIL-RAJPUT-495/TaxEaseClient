import React, { useState } from 'react';
import { User, Lock, Bell, Save, Mail, Smartphone, Shield, Camera } from 'lucide-react';

const Setting = () => {
  // --- States ---
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@taxease.com",
    phone: "",
    role: "Administrator"
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    marketing: true
  });

  // --- Handlers ---
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Admin Profile Updated Successfully!");
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-6">
      
      {/* --- Header --- */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
        <p className="text-slate-500 text-sm">Manage admin profile, security, and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN: Profile & Security --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Admin Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Admin Profile
              </h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
                SUPER ADMIN
              </span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm">
                    <User className="w-10 h-10" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors border-2 border-white">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Admin Photo</h4>
                  <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2 flex justify-end mt-2">
                  <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 2. Security Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Security
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                   <label className="text-sm font-medium text-slate-700">Current Password</label>
                   <input type="password" placeholder="Enter current password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div className="space-y-1">
                   <label className="text-sm font-medium text-slate-700">New Password</label>
                   <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div className="space-y-1">
                   <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                   <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
                    Update Password
                  </button>
              </div>
            </div>
          </div>

        </div>

        


      </div>
    </div>
  );
};

export default Setting;