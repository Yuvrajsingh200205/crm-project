import { cn } from '../../utils/classNames';

const variants = {
    green: 'badge-green',
    red: 'badge-red',
    yellow: 'badge-yellow',
    blue: 'badge-blue',
    purple: 'badge-purple',
    orange: 'badge-orange',
    default: 'badge bg-slate-100 text-slate-700 border border-slate-200',
};

export default function Badge({ children, variant = 'default', className = '' }) {
    return <span className={cn(variants[variant] || variants.default, className)}>{children}</span>;
}
