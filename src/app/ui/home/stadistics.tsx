import { fetchCategoryStats, fetchRecentProducts, fetchTopStockProducts } from "@/app/lib/stock/data";
import CustomBarChart from "./custom-bar-chart";
import CustomDoughnutChart from "./custom-doughnut-chart";

export default async function Statistics() {
	const [categoryStats, recentProducts, topStockProducts] = await Promise.all([
		fetchCategoryStats(),
		fetchRecentProducts(5),
		fetchTopStockProducts(5),
	]);

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<div className="grid gap-5 grid-cols-1 md:grid-cols-statistics-layout grid-rows-statistics-layout-mobile md:grid-rows-statistics-layout md:h-3/4 mt-6 mb-8 w-full min-w-0">
			<CustomBarChart categoryStats={categoryStats} />
			<CustomDoughnutChart categoryStats={categoryStats} />
			<div
				className="px-4 md:px-8 py-6 rounded-lg overflow-x-auto shadow-sm min-w-0"
				style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px', borderStyle: 'solid' }}
			>
				<h4 style={{ color: 'var(--color-foreground)' }}>Recent Products</h4>
				<table className="w-full mt-2">
					<thead>
						<tr>
							<th className="text-base text-left px-2 py-1 whitespace-nowrap">ID</th>
							<th className="text-base text-left px-2 py-1 whitespace-nowrap">Product</th>
							<th className="text-base text-left px-2 py-1 whitespace-nowrap">Category</th>
							<th className="text-base text-left px-2 py-1 whitespace-nowrap">Date</th>
							<th className="text-base text-right px-2 py-1 whitespace-nowrap">Stock</th>
						</tr>
					</thead>
					<tbody>
						{recentProducts.map((product) => (
							<tr key={product.id}>
								<td className="text-secondary text-sm px-2 py-1 whitespace-nowrap">{product.id}</td>
								<td className="text-secondary text-sm px-2 py-1 whitespace-nowrap">{product.name}</td>
								<td className="text-secondary text-sm px-2 py-1 whitespace-nowrap">{product.category?.name || 'N/A'}</td>
								<td className="text-secondary text-sm px-2 py-1 whitespace-nowrap">{formatDate(product.createdAt)}</td>
								<td className="text-secondary text-sm text-right px-2 py-1 whitespace-nowrap">{product.stock}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div
				className="px-4 md:px-8 py-6 rounded-lg overflow-x-auto shadow-sm min-w-0"
				style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px', borderStyle: 'solid' }}
			>
				<h4 style={{ color: 'var(--color-foreground)' }}>Top Stock Products</h4>
				<table className="w-full mt-2">
					<thead>
						<tr>
							<th className="text-base text-left px-2 py-1 whitespace-nowrap">ID</th>
							<th className="text-base text-left px-2 py-1 whitespace-nowrap">Product</th>
							<th className="text-base text-left px-2 py-1 whitespace-nowrap">Category</th>
							<th className="text-base text-left px-2 py-1 whitespace-nowrap">Date</th>
							<th className="text-base text-right px-2 py-1 whitespace-nowrap">Stock</th>
						</tr>
					</thead>
					<tbody>
						{topStockProducts.map((product) => (
							<tr key={product.id}>
								<td className="text-secondary text-sm px-2 py-1 whitespace-nowrap">{product.id}</td>
								<td className="text-secondary text-sm px-2 py-1 whitespace-nowrap">{product.name}</td>
								<td className="text-secondary text-sm px-2 py-1 whitespace-nowrap">{product.category?.name || 'N/A'}</td>
								<td className="text-secondary text-sm px-2 py-1 whitespace-nowrap">{formatDate(product.createdAt)}</td>
								<td className="text-secondary text-sm text-right px-2 py-1 whitespace-nowrap">{product.stock}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
