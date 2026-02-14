import { useState, lazy, Suspense } from "react"
import InvestmentForm from "./components/InvestmentForm"

import {
  calculateFundAllocation,
  calculateCategoryAllocation,
} from "./utils/calculateAllocation"

import type {
  FundAllocation,
  CategoryAllocation,
} from "@/types/allocation"

// ✅ Lazy load heavy components (Fix large bundle issue)
const CategoryChart = lazy(
  () => import("./components/CategoryChart")
)

const FundBreakdown = lazy(
  () => import("./components/FundBreakdown")
)

function App() {
  const [funds, setFunds] = useState<FundAllocation[]>([])
  const [categories, setCategories] =
    useState<CategoryAllocation[]>([]

    )

  const handleCalculate = (amount: number) => {
    setFunds(calculateFundAllocation(amount))
    setCategories(calculateCategoryAllocation(amount))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Portfolio Architecture Planner
          </h1>
          <p className="text-sm text-gray-500">
            Smart Asset Allocation Dashboard
          </p>
        </div>

        {/* Investment Input */}
        <InvestmentForm onCalculate={handleCalculate} />

        {/* Results */}
        {funds.length > 0 && (
          <Suspense
            fallback={
              <div className="text-center text-gray-500">
                Loading Portfolio...
              </div>
            }
          >
            <div className="space-y-12">
              <CategoryChart data={categories} />
              <FundBreakdown data={funds} />
            </div>
          </Suspense>
        )}
      </div>
    </div>
  )
}

export default App
