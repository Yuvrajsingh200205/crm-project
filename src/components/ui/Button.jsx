import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/classNames';

const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-sm font-medium',
};

export default function Button({ children, className = '', variant = 'primary', isLoading = false, disabled = false, type = 'button', ...props }) {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={cn(variants[variant] || variants.primary, (disabled || isLoading) && 'opacity-60 cursor-not-allowed', className)}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
}
