import { fetchDashboardStats } from "@/app/lib/stock/data";
import BalanceCard from "./balance-card";

export default async function BalanceCardList() {
  const stats = await fetchDashboardStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <BalanceCard title="Total Sales" value={`$${stats.totalSales.toLocaleString()}`} type="sales" />
      <BalanceCard title="Products" value={stats.totalProducts} type="products" />
      <BalanceCard title="Total Stock" value={stats.totalStock} type="stock" />
      <BalanceCard title="Categories" value={stats.totalCategories} type="categories" />
    </div>
  )
}
