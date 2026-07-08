export default function FormField({ label, required = false, children, className = '' }) {
    return (
        <div className={className}>
            {label && (
                <label className="label">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            {children}
        </div>
    );
}
