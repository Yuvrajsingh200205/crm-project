import FormField from './FormField';
import { cn } from '../../utils/classNames';

export default function Select({ label, required = false, options = [], className = '', fieldClassName = '', children, ...props }) {
    return (
        <FormField label={label} required={required} className={fieldClassName}>
            <select required={required} className={cn('select', className)} {...props}>
                {children || options.map((option) => (
                    <option key={option.value ?? option} value={option.value ?? option}>
                        {option.label ?? option}
                    </option>
                ))}
            </select>
        </FormField>
    );
}
