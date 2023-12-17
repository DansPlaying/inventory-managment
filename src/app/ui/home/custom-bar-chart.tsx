'use client'
import { Bar } from "react-chartjs-2";
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);

export default function CustomBarChart() {
	const data = {
		labels: ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4', 'Categoria 5'],
		datasets: [
			{
				label: 'Datos de ejemplo',
				backgroundColor: 'rgba(75,192,192,0.2)',
				borderColor: 'rgba(75,192,192,1)',
				borderWidth: 1,
				hoverBackgroundColor: 'rgba(75,192,192,0.4)',
				hoverBorderColor: 'rgba(75,192,192,1)',
				data: [65, 59, 80, 81, 56],
			},
		],
	};

	const options = {
		type: 'bar',
		data: data,
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};


	return (
		<div className="bg-tertiary flex px-8 py-6 rounded-lg items-center">
			<Bar options={options} data={data} />
		</div>
	);
}