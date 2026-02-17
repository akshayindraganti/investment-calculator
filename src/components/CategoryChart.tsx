import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts"

import type { CategoryAllocation } from "@/types/allocation"
import { useEffect, useRef, useMemo } from "react"
import gsap from "gsap"

type Props = {
    data: CategoryAllocation[]
}

/* -------------------- */
/* Category Colors */
/* -------------------- */

const CATEGORY_COLORS = {
    "Large Cap": "#3b82f6",
    "Mid Cap": "#facc15",
    "Small Cap": "#22c55e",
    "Gold & Silver": "#f97316",
}

/* -------------------- */
/* Fund Structure */
/* -------------------- */

const FUND_STRUCTURE = [
    { category: "Large Cap", fundName: "Nifty 50", percentage: 25 },
    { category: "Large Cap", fundName: "Nifty Next 50", percentage: 15 },
    { category: "Large Cap", fundName: "Nifty Bank", percentage: 10 },

    { category: "Mid Cap", fundName: "Nifty Midcap 150", percentage: 25 },

    { category: "Small Cap", fundName: "Quant Small Cap", percentage: 7.5 },
    { category: "Small Cap", fundName: "Nippon Small Cap", percentage: 7.5 },

    { category: "Gold & Silver", fundName: "Gold", percentage: 7 },
    { category: "Gold & Silver", fundName: "Silver", percentage: 3 },
]

/* -------------------- */
/* Custom Tooltip */
/* -------------------- */

type CustomTooltipProps = {
    active?: boolean
    payload?: {
        name?: string
        value?: number
    }[]
    totalAmount: number
}

const CustomTooltip = ({
    active,
    payload,
    totalAmount,
}: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null

    const category = payload[0].name
    const categoryAmount = payload[0].value ?? 0

    if (!category) return null

    const funds = FUND_STRUCTURE.filter(
        (fund) => fund.category === category
    )

    return (
        <div className="bg-white shadow-lg rounded-lg p-3 border text-xs min-w-[220px]">
            <p className="font-semibold mb-1">{category}</p>

            <p className="text-gray-500 mb-2">
                ₹ {Number(categoryAmount).toLocaleString()}
            </p>

            <div className="space-y-1">
                {funds.map((fund) => {
                    const fundAmount =
                        (fund.percentage / 100) * totalAmount

                    return (
                        <div
                            key={fund.fundName}
                            className="flex justify-between"
                        >
                            <span>{fund.fundName}</span>
                            <span>
                                ₹ {fundAmount.toLocaleString()}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* -------------------- */
/* Main Component */
/* -------------------- */

export default function CategoryChart({ data }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    // Dynamic total based on input
    const total = useMemo(
        () =>
            data.reduce(
                (acc, item) => acc + item.amount,
                0
            ),
        [data]
    )

    // Entrance animation
    useEffect(() => {
        if (!containerRef.current) return

        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, scale: 0.97 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "power3.out",
                }
            )
        }, containerRef)

        return () => ctx.revert()
    }, [data])

    return (
        <div
            ref={containerRef}
            className="bg-white shadow-xl rounded-2xl p-6 border"
        >
            <h2 className="text-lg font-semibold text-center mb-6">
                Category Allocation
            </h2>

            <div className="relative h-[380px]">
                <ResponsiveContainer>
                    <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <Pie
                            data={data}
                            dataKey="amount"
                            nameKey="category"
                            innerRadius={85}
                            outerRadius={130}
                            paddingAngle={3}
                            animationDuration={700}
                            activeShape={{
                                stroke: "#fff",
                                strokeWidth: 2,
                            }}
                        >
                            {data.map((entry) => (
                                <Cell
                                    key={entry.category}
                                    fill={
                                        CATEGORY_COLORS[
                                        entry.category as keyof typeof CATEGORY_COLORS
                                        ]
                                    }
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            content={
                                <CustomTooltip totalAmount={total} />
                            }
                            wrapperStyle={{ zIndex: 1000 }}
                            cursor={{ fill: "rgba(0,0,0,0.04)" }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Total */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                    <p className="text-xs text-gray-500">
                        Total
                    </p>
                    <h3 className="text-xl font-bold">
                        ₹ {total.toLocaleString()}
                    </h3>
                </div>
            </div>

            {/* Compact Custom Legend */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-700 text-center">
                {data.map((item) => (
                    <div
                        key={item.category}
                        className="flex items-center justify-center gap-1.5"
                    >
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{
                                backgroundColor:
                                    CATEGORY_COLORS[
                                    item.category as keyof typeof CATEGORY_COLORS
                                    ],
                            }}
                        />
                        <span>{item.category}</span>
                        <span className="text-gray-400">
                            {item.percentage}%
                        </span>
                    </div>
                ))}
            </div>

        </div>
    )
}
