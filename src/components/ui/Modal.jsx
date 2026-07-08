import { X } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/classNames';

export default function Modal({ isOpen, title, icon: Icon, children, footer, onClose, className = '', contentClassName = '' }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className={cn('bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden', className)} onClick={(event) => event.stopPropagation()}>
                {(title || onClose) && (
                    <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                        <div className="flex items-center gap-2">
                            {Icon && <Icon className="w-5 h-5" />}
                            {title && <h2 className="text-base font-semibold">{title}</h2>}
                        </div>
                        {onClose && (
                            <Button variant="ghost" onClick={onClose} className="p-1 hover:bg-white/10 text-white hover:text-white">
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                )}
                <div className={cn('p-6', contentClassName)}>{children}</div>
                {footer && <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">{footer}</div>}
            </div>
        </div>
    );
}
