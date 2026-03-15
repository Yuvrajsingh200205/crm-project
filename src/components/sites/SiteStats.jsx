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

            <div className="p-6 bg-emerald-950 rounded-3xl shadow-xl shadow-emerald-950/20 group hover:scale-[1.02] transition-all text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-emerald-400/30 transition-all" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="p-3 bg-white/10 text-emerald-300 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors border border-white/5">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-400/30">Attention</span>
                </div>
                <h3 className="text-4xl font-black text-white mt-4 tracking-tighter relative z-10">{alerts}</h3>
                <p className="text-emerald-100/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1 relative z-10">Active Site Incidents</p>
            </div>
        </div>
    );
}
