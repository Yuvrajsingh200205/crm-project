import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

export const confirmToast = (message, onConfirm) => {
    toast((t) => (
        <div className="flex flex-col gap-3 min-w-[250px]">
            <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-slate-800 text-sm">{message}</span>
            </div>
            <div className="flex justify-end gap-2 mt-1">
                <button 
                    onClick={() => toast.dismiss(t.id)} 
                    className="px-4 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={() => {
                        toast.dismiss(t.id);
                        onConfirm();
                    }} 
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm shadow-red-500/30"
                >
                    Confirm Action
                </button>
            </div>
        </div>
    ), {
        duration: Infinity,
        position: 'top-center'
    });
};
