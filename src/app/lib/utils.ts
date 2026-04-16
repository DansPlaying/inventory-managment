export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  date: Date,
  locale: string = 'en-US',
) => {
  // const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generatePagination = (currentPage: number, totalPages: number): (number | string)[] => {
  const current = Number(currentPage);
  const total = Number(totalPages);

  // If the total number of pages is 7 or less, display all pages
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Current page is near the start (1, 2, or 3)
  if (current <= 3) {
    return [1, 2, 3, '...', total - 1, total];
  }

  // Current page is near the end
  if (current >= total - 2) {
    return [1, 2, '...', total - 2, total - 1, total];
  }

  // Current page is in the middle
  return [
    1,
    '...',
    current - 1,
    current,
    current + 1,
    '...',
    total,
  ];
};
