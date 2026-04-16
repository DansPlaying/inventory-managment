'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { PAGE_SIZE_OPTIONS } from '@/app/lib/stock/data';

export default function PageSizeSelector({ currentPageSize }: { currentPageSize: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('pageSize', e.target.value);
    params.set('page', '1'); // Reset to first page when changing page size
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="pageSize" className="text-sm text-muted">
        Show
      </label>
      <select
        id="pageSize"
        value={currentPageSize}
        onChange={handleChange}
        className="bg-tertiary border border-border rounded-md px-3 py-1.5 text-sm focus:border-accentPrimary focus:outline-none cursor-pointer"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span className="text-sm text-muted">entries</span>
    </div>
  );
}
