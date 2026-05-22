import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

export default function SearchableSelect({
    label,
    required = false,
    placeholder = 'Search...',
    options = [],
    value,
    displayLabel = '',
    onChange,
    isLoading = false,
    disabled = false,
    getOptionLabel = (o) => o.label ?? String(o.id ?? ''),
    getOptionValue = (o) => o.id,
}) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const openedByMouseRef = useRef(false);

    const selectedOption = useMemo(
        () => options.find((o) => String(getOptionValue(o)) === String(value)),
        [options, value, getOptionValue]
    );

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
        setQuery(selectedOption ? getOptionLabel(selectedOption) : displayLabel || '');
    }, [selectedOption, displayLabel, getOptionLabel]);

    useEffect(() => {
        if (!isOpen) {
            setQuery(selectedOption ? getOptionLabel(selectedOption) : displayLabel || '');
        }
    }, [selectedOption, isOpen, displayLabel, getOptionLabel]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeDropdown]);

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return options;
        return options.filter((o) =>
            getOptionLabel(o).toLowerCase().includes(q)
        );
    }, [options, query, getOptionLabel]);

    const handleSelect = (option) => {
        const id = getOptionValue(option);
        const labelText = getOptionLabel(option);
        onChange({ id, label: labelText });
        setQuery(labelText);
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setIsOpen(true);
        if (!e.target.value && value) {
            onChange({ id: '', label: '' });
        }
    };

    const handleMouseDown = (e) => {
        if (disabled) return;
        openedByMouseRef.current = true;
        if (isOpen) {
            e.preventDefault();
            closeDropdown();
        } else {
            setIsOpen(true);
        }
    };

    const handleFocus = () => {
        if (disabled) return;
        if (openedByMouseRef.current) {
            openedByMouseRef.current = false;
            return;
        }
        setIsOpen(true);
    };

    return (
        <div className="space-y-2" ref={wrapperRef}>
            {label && (
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    className={`input w-full h-12 pr-10 font-bold ${disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`}
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onMouseDown={handleMouseDown}
                    onFocus={handleFocus}
                    disabled={disabled}
                    autoComplete="off"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                </div>
                {isOpen && !disabled && (
                    <ul className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1">
                        {isLoading ? (
                            <li className="px-4 py-3 text-xs text-slate-400 font-medium flex items-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
                            </li>
                        ) : filtered.length === 0 ? (
                            <li className="px-4 py-3 text-xs text-slate-400 font-medium">
                                {options.length === 0 ? 'No records available' : 'No matches found'}
                            </li>
                        ) : (
                            filtered.map((option) => {
                                const optValue = getOptionValue(option);
                                const isSelected = String(optValue) === String(value);
                                return (
                                    <li key={optValue ?? getOptionLabel(option)}>
                                        <button
                                            type="button"
                                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50 ${
                                                isSelected ? 'bg-emerald-50 text-[#1e3a34]' : 'text-slate-700'
                                            }`}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleSelect(option)}
                                        >
                                            {getOptionLabel(option)}
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
