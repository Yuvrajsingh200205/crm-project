import React from 'react';
import { MapPin, Users, Activity, AlertCircle } from 'lucide-react';

export default function SiteStats({ activeSites, manpower, healthySites, alerts }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 group hover:scale-[1.02] transition-all">
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Live Sites</span>
                </div>
                <h3 className="text-4xl font-black text-slate-800 mt-4 tracking-tighter">{activeSites}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Operational Projects</p>
            </div>

            <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 group hover:scale-[1.02] transition-all border-b-4 border-emerald-500">
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-4xl font-black text-slate-800 mt-4 tracking-tighter">{manpower}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Total On-Site Manpower</p>
            </div>

            <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 group hover:scale-[1.02] transition-all border-b-4 border-amber-500">
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Activity className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-4xl font-black text-slate-800 mt-4 tracking-tighter">{healthySites}%</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Site Health Index</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-rose-600 to-rose-700 rounded-3xl shadow-xl shadow-rose-900/20 group hover:scale-[1.02] transition-all text-white">
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/20 text-white rounded-2xl group-hover:bg-white group-hover:text-rose-600 transition-colors">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-white/50 bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Critical</span>
                </div>
                <h3 className="text-4xl font-black text-white mt-4 tracking-tighter">{alerts}</h3>
                <p className="text-rose-100 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Unresolved Site Safety Alerts</p>
            </div>
        </div>
    );
}
