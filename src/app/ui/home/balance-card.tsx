import { FaHandHoldingUsd } from "react-icons/fa";

export default function BalanceCard() {
	return (
		<div className="bg-tertiary px-8 py-6 rounded-lg h-min">
			<div>Lorem Ipsum</div>
			<div className="flex items-center justify-between">
				<div className="text-white ">
					<FaHandHoldingUsd />
				</div>
        <div>
					30000
				</div>
			</div>
		</div>
	)
}
