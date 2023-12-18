import BalanceCard from "./balance-card";


export default function BalanceCardList() {
  return (
    <div className="flex h-1/5 gap-4 items-center">
       <BalanceCard/>
       <BalanceCard/>
       <BalanceCard/>
       <BalanceCard/>
    </div>
  )
}
