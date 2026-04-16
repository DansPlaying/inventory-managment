'use client'
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

Chart.register(...registerables);

type CategoryStat = {
	name: string;
	productCount: number;
	totalStock: number;
	totalValue: number;
}

type CustomBarChartProps = {
	categoryStats: CategoryStat[];
}

export default function CustomBarChart({ categoryStats = [] }: CustomBarChartProps) {
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
				label: 'Stock by Category',
				backgroundColor: 'rgba(122, 35, 185, 0.6)',
				borderColor: 'rgba(122, 35, 185, 1)',
				borderWidth: 1,
				hoverBackgroundColor: 'rgba(122, 35, 185, 0.8)',
				hoverBorderColor: 'rgba(122, 35, 185, 1)',
				data: categoryStats.map((cat) => cat.totalStock),
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					color: textColor,
				},
				grid: {
					color: mounted && theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
				},
			},
			x: {
				ticks: {
					color: textColor,
					maxRotation: 45,
					minRotation: 45,
				},
				grid: {
					color: mounted && theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
				},
			},
		},
		plugins: {
			legend: {
				labels: {
					color: textColor,
				},
			},
		},
	};

	return (
		<div
			className="relative w-full min-w-0 min-h-[350px] md:min-h-full p-6 flex flex-col rounded-lg shadow-sm"
			style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px', borderStyle: 'solid' }}
		>
			<h4 className="mb-4" style={{ color: 'var(--color-foreground)' }}>Stock by Category</h4>
			<div className="flex-1 relative min-h-[250px]">
				<Bar options={options} data={data} />
			</div>
		</div>
	);
}