import React from "react";
import { User, Lock, Save, Smartphone, Mail, Camera } from "lucide-react";

const SettingsPage = ({ profile, onProfileChange, onSave }) => (
  <div className="max-w-4xl mx-auto space-y-8">
    {/* Profile Card */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <User className="text-blue-600" />
        <h3 className="font-bold text-slate-900 text-lg">Personal Information</h3>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
           <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                <User size={48} className="text-slate-300" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                <Camera size={14} />
              </button>
           </div>
           <div className="text-center md:text-left">
             <h4 className="font-bold text-slate-900 text-xl">{profile.name}</h4>
             <p className="text-sm text-slate-500 font-medium">Manage your public profile and contact info</p>
           </div>
        </div>

        <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input type="text" name="name" value={profile.name} onChange={onProfileChange} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input type="text" name="phone" value={profile.phone} onChange={onProfileChange} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input type="email" name="email" value={profile.email} onChange={onProfileChange} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium" />
            </div>
          </div>
          <div className="md:col-span-2 pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default SettingsPage;