import { FaHandHoldingUsd, FaBoxes, FaTags, FaShoppingCart } from "react-icons/fa";
import clsx from "clsx";

type BalanceCardProps = {
	title: string;
	value: number | string;
	type: 'sales' | 'products' | 'stock' | 'categories';
}

const iconMap = {
	sales: FaHandHoldingUsd,
	products: FaBoxes,
	stock: FaShoppingCart,
	categories: FaTags,
}

export default function BalanceCard({ title, value, type }: BalanceCardProps) {
	const Icon = iconMap[type];

	return (
		<div
			className="px-8 py-6 rounded-lg h-min hover:scale-105 transition-transform shadow-sm"
			style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px', borderStyle: 'solid' }}
		>
			<div>{title}</div>
			<div className="flex items-center justify-between pt-1">
				<div className={clsx("text-2xl", {
					'text-green-500': type === 'sales',
					'text-blue-500': type === 'products',
					'text-yellow-500': type === 'stock',
					'text-purple-500': type === 'categories',
				})}>
					<Icon />
				</div>
				<div className="text-xl font-semibold">
					{typeof value === 'number' ? value.toLocaleString() : value}
				</div>
			</div>
		</div>
	)
}
