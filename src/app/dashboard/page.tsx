import BalanceCardList from "@/app/ui/home/balance-card-list";
import Statistics from "@/app/ui/home/stadistics";

export default function Home() {
  return (
    <main className="w-full max-w-full px-4 md:px-6 md:pr-10 py-6 md:py-4 pb-10 overflow-hidden">
      <BalanceCardList />
      <Statistics />
    </main>
  )
}