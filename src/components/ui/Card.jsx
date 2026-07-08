import { cn } from '../../utils/classNames';

export default function Card({ children, className = '', as = 'div', ...props }) {
    const Component = as;

    return (
        <Component className={cn('card', className)} {...props}>
            {children}
        </Component>
    );
}
