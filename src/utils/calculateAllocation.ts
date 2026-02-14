import type { FundAllocation, CategoryAllocation } from "@/types/allocation"

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

export function calculateFundAllocation(
    totalAmount: number
): FundAllocation[] {
    return FUND_STRUCTURE.map((fund) => ({
        ...fund,
        amount: (fund.percentage / 100) * totalAmount,
    }))
}

export function calculateCategoryAllocation(
    totalAmount: number
): CategoryAllocation[] {
    const categoryMap: Record<string, number> = {}

    FUND_STRUCTURE.forEach((fund) => {
        categoryMap[fund.category] =
            (categoryMap[fund.category] || 0) + fund.percentage
    })

    return Object.entries(categoryMap).map(([category, percentage]) => ({
        category,
        percentage,
        amount: (percentage / 100) * totalAmount,
    }))
}
