import { cn } from '../../utils/classNames';

export default function Table({ columns = [], rows = [], getRowKey, emptyMessage = 'No records found', className = '' }) {
    return (
        <div className={cn('overflow-x-auto', className)}>
            <table className="w-full text-sm">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className={cn('table-header', column.headerClassName)}>{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="table-cell text-center text-slate-500 py-10">{emptyMessage}</td>
                        </tr>
                    ) : rows.map((row, index) => (
                        <tr key={getRowKey ? getRowKey(row) : row.id ?? index} className="table-row">
                            {columns.map((column) => (
                                <td key={column.key} className={cn('table-cell', column.cellClassName)}>
                                    {column.render ? column.render(row, index) : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
