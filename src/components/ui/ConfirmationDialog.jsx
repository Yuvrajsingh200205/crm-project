import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

export default function ConfirmationDialog({
    isOpen,
    title = 'Confirm action',
    message = 'Are you sure you want to continue?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isLoading = false,
    onConfirm,
    onClose,
}) {
    return (
        <Modal
            isOpen={isOpen}
            title={title}
            icon={AlertTriangle}
            onClose={onClose}
            className="max-w-md"
            footer={(
                <div className="flex items-center justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
                    <Button variant="danger" isLoading={isLoading} onClick={onConfirm}>{confirmLabel}</Button>
                </div>
            )}
        >
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </Modal>
    );
}
