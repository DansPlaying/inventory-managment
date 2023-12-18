'use client'
import { Doughnut } from "react-chartjs-2";

export default function CustomDoughnutChart() {
    const data = {
        labels: ['Categoría 1', 'Categoría 2', 'Categoría 3', 'Categoría 4', 'Categoría 5'],
        datasets: [
            {
                data: [30, 10, 20, 15, 25],
                backgroundColor: ['red', 'blue', 'green', 'orange', 'purple'],
                hoverBackgroundColor: ['lightcoral', 'lightblue', 'lightgreen', 'lightsalmon', 'lightpurple'],
            },
        ],
    };

    const options = {
        cutout: '70%', // Porcentaje de recorte para hacerlo en forma de dona
    };

    return (
        <div className="bg-tertiary px-8 py-6 rounded-lg">
            <Doughnut data={data} options={options} />
        </div>
    );
}