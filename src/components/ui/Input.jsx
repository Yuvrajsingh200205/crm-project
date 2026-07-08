import FormField from './FormField';
import { cn } from '../../utils/classNames';

export default function Input({ label, required = false, className = '', fieldClassName = '', ...props }) {
    return (
        <FormField label={label} required={required} className={fieldClassName}>
            <input required={required} className={cn('input', className)} {...props} />
        </FormField>
    );
}
