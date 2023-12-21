import BalanceCardList from "@/app/ui/home/balance-card-list";
import Statistics from "@/app/ui/home/stadistics";

export default function Home() {
  return (
    <main className="pt-4 w-full">
      <BalanceCardList />
      <Statistics/>
    </main>
  )
}