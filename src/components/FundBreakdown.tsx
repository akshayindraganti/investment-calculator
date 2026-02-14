import { useEffect, useRef } from "react"
import type { FundAllocation } from "@/types/allocation"
import gsap from "gsap"
import {
    TrendingUp,
    Landmark,
    Banknote,
    Coins,
} from "lucide-react"

type Props = {
    data: FundAllocation[]
}

// 🎨 Category color + icon mapping
const CATEGORY_STYLE = {
    "Large Cap": {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
    },
    "Mid Cap": {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        icon: <Landmark className="w-5 h-5 text-yellow-600" />,
    },
    "Small Cap": {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: <Banknote className="w-5 h-5 text-green-600" />,
    },
    "Gold & Silver": {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        icon: <Coins className="w-5 h-5 text-orange-600" />,
    },
}

// 🧠 Clean professional fund naming
function formatFundName(name: string) {
    const map: Record<string, string> = {
        "Nifty 50": "NIFTY 50 Index Fund",
        "Nifty Next 50": "NIFTY Next 50 Index Fund",
        "Nifty Bank": "NIFTY Bank ETF",
        "Nifty Midcap 150": "NIFTY Midcap 150 Index Fund",
        "Quant Small Cap": "Quant Small Cap Fund",
        "Nippon Small Cap": "Nippon India Small Cap Fund",
        Gold: "Gold ETF",
        Silver: "Silver ETF",
    }

    return map[name] || name
}

export default function FundBreakdown({ data }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    // ✨ Smooth entrance animation
    useEffect(() => {
        if (!containerRef.current) return

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".fund-card",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power3.out",
                }
            )
        }, containerRef)

        return () => ctx.revert()
    }, [data])

    // Group by category
    const grouped = data.reduce((acc, fund) => {
        if (!acc[fund.category]) {
            acc[fund.category] = []
        }
        acc[fund.category].push(fund)
        return acc
    }, {} as Record<string, FundAllocation[]>)

    return (
        <div ref={containerRef} className="space-y-16">
            {Object.entries(grouped).map(([category, funds]) => {
                const style =
                    CATEGORY_STYLE[
                    category as keyof typeof CATEGORY_STYLE
                    ]

                return (
                    <div key={category}>
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-xl bg-white shadow-sm">
                                {style.icon}
                            </div>
                            <h2
                                className={`text-2xl font-bold tracking-tight ${style.text}`}
                            >
                                {category} Portfolio
                            </h2>
                        </div>

                        {/* Fund Cards */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {funds.map((fund) => (
                                <div
                                    key={fund.fundName}
                                    className={`fund-card p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 ${style.bg} ${style.border}`}
                                >
                                    {/* Top Section */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-lg font-semibold leading-tight">
                                                {formatFundName(fund.fundName)}
                                            </p>
                                            <p className="text-xs uppercase tracking-wide opacity-60">
                                                {category}
                                            </p>
                                        </div>

                                        <span className="text-sm font-semibold bg-white/60 px-3 py-1 rounded-full">
                                            {fund.percentage}%
                                        </span>
                                    </div>

                                    {/* Bottom Section */}
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-bold">
                                            ₹ {fund.amount.toLocaleString()}
                                        </span>

                                        <span className="text-xs opacity-60">
                                            Allocated Capital
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
