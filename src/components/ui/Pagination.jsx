import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({ page, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3">
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3">
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
}
