import { useState, lazy, Suspense, useEffect, useRef, type ComponentType } from "react"
import InvestmentForm from "./components/InvestmentForm"
import { calculateFundAllocation, calculateCategoryAllocation } from "./utils/calculateAllocation"
import type { FundAllocation, CategoryAllocation } from "@/types/allocation"
import gsap from "gsap"
import { Activity, BarChart3, Layers, Moon, Sun, TrendingUp } from "lucide-react"

const CategoryChart = lazy(() => import("./components/CategoryChart"))
const FundBreakdown  = lazy(() => import("./components/FundBreakdown"))

// ─── Animated number counter stat card ───────────────────────────────────────
type StatProps = {
  label: string
  value: number
  prefix?: string
  Icon: ComponentType<{ className?: string }>
}

function AnimatedStat({ label, value, prefix = "", Icon }: StatProps) {
  const ref  = useRef<HTMLSpanElement>(null)
  const prev = useRef(0)

  useEffect(() => {
    if (!ref.current) return
    const from = prev.current
    prev.current = value
    const obj = { v: from }
    const tween = gsap.to(obj, {
      v: value,
      duration: 1.3,
      ease: "power3.out",
      onUpdate() {
        if (ref.current) {
          ref.current.textContent = prefix + Math.round(obj.v).toLocaleString("en-IN")
        }
      },
    })
    return () => { tween.kill() }
  }, [value, prefix])

  return (
    <div className="card-surface card-hover-effect rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] app-t5 uppercase tracking-[0.14em] font-semibold">
          {label}
        </p>
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.16)" }}
        >
          <Icon className="w-3 h-3 text-[#06d6a0]" />
        </div>
      </div>
      <span ref={ref} className="text-2xl font-display app-t1">
        {prefix}0
      </span>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [funds,       setFunds]       = useState<FundAllocation[]>([])
  const [categories,  setCategories]  = useState<CategoryAllocation[]>([])
  const [total,       setTotal]       = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [isDark,      setIsDark]      = useState(() =>
    localStorage.getItem("theme") !== "light"
  )
  const resultsRef = useRef<HTMLDivElement>(null)

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark])

  const handleCalculate = (amount: number) => {
    const newFunds      = calculateFundAllocation(amount)
    const newCategories = calculateCategoryAllocation(amount)
    setFunds(newFunds)
    setCategories(newCategories)
    setTotal(newFunds.reduce((acc, f) => acc + f.amount, 0))
    if (!showResults) setShowResults(true)
  }

  // Animate results section on first appearance
  useEffect(() => {
    if (!showResults || !resultsRef.current) return
    gsap.fromTo(
      resultsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }
    )
  }, [showResults])

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: "var(--app-bg)", color: "var(--t1)" }}
    >
      <div className="noise-overlay" />
      <div className="grid-bg" />

      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        className="relative z-10 border-b"
        style={{ borderColor: "var(--header-border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.2)" }}
              >
                <BarChart3 className="w-4 h-4 text-[#06d6a0]" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#06d6a0] animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-display tracking-wide app-t1">
                Portfolio Planner
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.14em] app-t6">
                SMART ASSET ALLOCATION
              </p>
            </div>
          </div>

          {/* Right side: label + theme toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[11px] app-t6">
              <Activity className="w-3 h-3 text-[#06d6a0]" />
              India Equity &amp; Commodities
            </div>

            <button
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="theme-toggle w-7 h-7 rounded-lg flex items-center justify-center"
            >
              {isDark
                ? <Sun  className="w-3.5 h-3.5 text-[#06d6a0]" />
                : <Moon className="w-3.5 h-3.5 text-[#06d6a0]" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-5">
        <InvestmentForm onCalculate={handleCalculate} />

        {showResults && (
          <div ref={resultsRef}>
            <Suspense
              fallback={
                <div className="text-center app-t6 py-16 text-sm tracking-wide">
                  Calculating allocation…
                </div>
              }
            >
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                <AnimatedStat label="Total Investment" value={total}            prefix="₹" Icon={TrendingUp} />
                <AnimatedStat label="Asset Classes"    value={categories.length}           Icon={Layers}    />
                <div className="col-span-2 sm:col-span-1">
                  <AnimatedStat label="Instruments"    value={funds.length}                Icon={BarChart3} />
                </div>
              </div>

              {/* Chart + Breakdown */}
              <div className="grid lg:grid-cols-5 gap-5">
                <div className="lg:col-span-2">
                  <CategoryChart data={categories} />
                </div>
                <div className="lg:col-span-3">
                  <FundBreakdown data={funds} />
                </div>
              </div>
            </Suspense>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
