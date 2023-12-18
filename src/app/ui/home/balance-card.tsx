'use client'
import { useState } from "react";
import { FaHandHoldingUsd } from "react-icons/fa";
import clsx from "clsx";

export default function BalanceCard() {
	const [isIngress, setIsIngres] = useState(true)
	return (
		<div className="bg-tertiary px-8 py-6 rounded-lg h-min hover:scale-105" onClick={() => setIsIngres(!isIngress)}>
			<div>Lorem Ipsum</div>
			<div className="flex items-center justify-between pt-1">
				<div className=
					{
						clsx("text-green-700 text-2xl transition-colors", {
							'text-red-700': !isIngress,
						}
						)
					}
				>
					<FaHandHoldingUsd />
				</div>
				<div className="">
					30000
				</div>
			</div>
		</div>
	)
}
