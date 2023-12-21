import BalanceCardList from "@/app/ui/home/balance-card-list";
import Statistics from "@/app/ui/home/stadistics";

export default function Home() {
  return (
    <main className="w-full pr-10">
      <BalanceCardList />
      <Statistics />
    </main>
  )
}