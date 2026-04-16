'use client'
import { Doughnut } from "react-chartjs-2";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type CategoryStat = {
  name: string;
  productCount: number;
  totalStock: number;
  totalValue: number;
}

type CustomDoughnutChartProps = {
  categoryStats: CategoryStat[];
}

const COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#f97316', // orange
  '#a855f7', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#eab308', // yellow
];

export default function CustomDoughnutChart({ categoryStats = [] }: CustomDoughnutChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const textColor = mounted && theme === 'light' ? '#0F172A' : '#FFFFFF';

  const data = {
    labels: categoryStats.map((cat) => cat.name),
    datasets: [
      {
        data: categoryStats.map((cat) => cat.totalValue),
        backgroundColor: COLORS.slice(0, categoryStats.length),
        hoverBackgroundColor: COLORS.slice(0, categoryStats.length).map(c => c + 'cc'),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
          usePointStyle: true,
          boxWidth: 8,
          padding: 10,
        },
      },
    },
  };

  return (
    <div
      className="relative w-full min-w-0 min-h-[350px] md:min-h-full p-6 flex flex-col rounded-lg shadow-sm overflow-hidden"
      style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px', borderStyle: 'solid' }}
    >
      <h4 className="mb-4" style={{ color: 'var(--color-foreground)' }}>Inventory Value by Category</h4>
      <div className="flex-1 relative min-h-[250px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}