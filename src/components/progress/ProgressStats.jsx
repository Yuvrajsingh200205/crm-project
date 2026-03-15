import React from 'react';
import { Target, CheckCircle2, Clock, CalendarDays, TrendingUp, ChevronRight } from 'lucide-react';

export default function ProgressStats({ overallCompletion, milstonesCount, delayTasks, upcomingDue }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Mega Main Stat - Compact Glassmorphism */}
            <div className="md:col-span-12 lg:col-span-5 bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/30 group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-[80px] -mr-24 -mt-24" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase text-emerald-400/60">System Velocity</span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-5xl font-black tracking-tighter tabular-nums flex items-baseline gap-1">
                            {overallCompletion}<span className="text-xl text-emerald-400/80">%</span>
                        </h3>
                        <p className="text-slate-400 text-xs font-medium max-w-[180px]">Average project lifecycle completion across sites.</p>
                    </div>
                    <div className="mt-8 space-y-3">
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                style={{ width: `${overallCompletion}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[9px] font-black text-slate-500 tracking-widest uppercase">
                            <span>Efficiency</span>
                            <span>Target</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub Stats - Refined Bento */}
            <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/30 border border-slate-50 group hover:-translate-y-1 transition-all">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{milstonesCount}</h4>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Verified</p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/30 border border-slate-50 group hover:-translate-y-1 transition-all">
                    <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-all">
                        <Clock className="w-5 h-5" />
                    </div>
                    <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{delayTasks}</h4>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Delayed</p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/30 border border-slate-50 group hover:-translate-y-1 transition-all relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                            <CalendarDays className="w-5 h-5" />
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{upcomingDue}</h4>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Upcoming</p>
                    </div>
                </div>

                {/* Compact Action Bar */}
                <div className="sm:col-span-3 bg-white/40 border border-slate-200/50 backdrop-blur-sm rounded-3xl p-5 flex items-center justify-between hover:bg-white hover:border-emerald-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="font-black text-slate-800 text-sm">Optimize Intelligence</h5>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Automated Reporting Triggers</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </div>
    );
}
