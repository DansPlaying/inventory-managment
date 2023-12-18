import BalanceCardList from "./ui/home/balance-card-list";
import Statistics from "./ui/home/stadistics";

export default function Home() {
  return (
    <div className="pt-4 w-full">
      <BalanceCardList />
      <Statistics/>
    </div>
  )
}
