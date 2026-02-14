import { useState } from "react"
import InvestmentForm from "./components/InvestmentForm"
import {
  calculateFundAllocation,
  calculateCategoryAllocation,
} from "./utils/calculateAllocation"
import type {
  FundAllocation,
  CategoryAllocation,
} from "@/types/allocation"
import CategoryChart from "./components/CategoryChart"
import FundBreakdown from "./components/FundBreakdown"

function App() {
  const [funds, setFunds] = useState<FundAllocation[]>([])
  const [categories, setCategories] =
    useState<CategoryAllocation[]>([])

  const handleCalculate = (amount: number) => {
    setFunds(calculateFundAllocation(amount))
    setCategories(calculateCategoryAllocation(amount))
  }

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold">
          Portfolio Architecture Planner
        </h1>

        <InvestmentForm onCalculate={handleCalculate} />

        {funds.length > 0 && (
          <>
            <CategoryChart data={categories} />
            <FundBreakdown data={funds} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
