import { ClipboardList, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function WorkOrderStats({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
                <div key={i} className="card p-5 group hover:shadow-xl hover:shadow-green-600/5 transition-all duration-300 border-slate-50">
                    <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl ${s.bg} ${s.color} transition-transform group-hover:scale-110`}>
                            <s.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-full">Work Analysis</span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</h3>
                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-tight">{s.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
