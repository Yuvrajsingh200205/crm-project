import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/classNames';

export default function Loader({ label = 'Loading', className = '' }) {
    return (
        <div className={cn('flex items-center justify-center gap-2 text-slate-500 text-sm', className)}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{label}</span>
        </div>
    );
}
