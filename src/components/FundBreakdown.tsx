import { useEffect, useRef, type ReactElement } from "react"
import type { FundAllocation } from "@/types/allocation"
import gsap from "gsap"
import { TrendingUp, Landmark, Banknote, Coins } from "lucide-react"

type Props = {
  data: FundAllocation[]
}

type CategoryMeta = {
  hex:  string
  Icon: ReactElement
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  "Large Cap": {
    hex:  "#4f90f7",
    Icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
  },
  "Mid Cap": {
    hex:  "#fbbf24",
    Icon: <Landmark className="w-4 h-4 text-yellow-400" />,
  },
  "Small Cap": {
    hex:  "#34d399",
    Icon: <Banknote className="w-4 h-4 text-emerald-400" />,
  },
  "Gold & Silver": {
    hex:  "#f59e0b",
    Icon: <Coins className="w-4 h-4 text-amber-500" />,
  },
}

// Full display names shown in fund rows
const FUND_LABELS: Record<string, string> = {
  "Nifty 50":          "Nifty 50 Index",
  "Nifty Next 50":     "Nifty Next 50 Index",
  "Nifty Bank":        "Nifty Bank ETF",
  "Nifty Midcap 150":  "Nifty Midcap 150",
  "Quant Small Cap":   "Quant Small Cap Fund",
  "Nippon Small Cap":  "Nippon India Small Cap",
  "Gold":              "Gold ETF",
  "Silver":            "Silver ETF",
}

export default function FundBreakdown({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fund-row",
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.055, ease: "power3.out" }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [data])

  const grouped = data.reduce<Record<string, FundAllocation[]>>((acc, fund) => {
    if (!acc[fund.category]) acc[fund.category] = []
    acc[fund.category].push(fund)
    return acc
  }, {})

  return (
    <div ref={containerRef} className="card-surface rounded-2xl p-5 h-full flex flex-col gap-4">
      <p className="text-[10px] app-t5 uppercase tracking-[0.14em] font-semibold shrink-0">
        Fund Breakdown
      </p>

      <div className="space-y-4 flex-1">
        {Object.entries(grouped).map(([category, funds]) => {
          const meta = CATEGORY_META[category]
          if (!meta) return null

          const categoryTotal = funds.reduce((a, f) => a + f.amount, 0)
          const categoryPct   = funds.reduce((a, f) => a + f.percentage, 0)

          // Short fund names for the "Suggested" subtitle (e.g. "Nifty 50 · Next 50 · Bank")
          const suggestedNames = funds.map((f) => f.fundName).join(" · ")

          return (
            <div
              key={category}
              className="rounded-xl overflow-hidden"
              style={{ background: `${meta.hex}10`, border: `1px solid ${meta.hex}22` }}
            >
              {/* ── Category header ──────────────────────────── */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: `1px solid ${meta.hex}18` }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${meta.hex}18`, border: `1px solid ${meta.hex}30` }}
                  >
                    {meta.Icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold app-t2">{category}</p>
                    <p
                      className="text-[9px] font-semibold tracking-[0.1em]"
                      style={{ color: meta.hex }}
                    >
                      {categoryPct}% ALLOCATION
                    </p>
                    {/* Suggested fund names */}
                    <p className="text-[9px] app-t5 mt-0.5 font-data truncate">
                      {suggestedNames}
                    </p>
                  </div>
                </div>

                <p
                  className="font-data font-semibold text-[13px] shrink-0 ml-3"
                  style={{ color: meta.hex }}
                >
                  ₹{categoryTotal.toLocaleString("en-IN")}
                </p>
              </div>

              {/* ── Fund rows ────────────────────────────────── */}
              <div className="px-4 py-3 space-y-3.5">
                {funds.map((fund) => (
                  <div key={fund.fundName} className="fund-row">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[12px] font-medium app-t3">
                        {FUND_LABELS[fund.fundName] ?? fund.fundName}
                      </p>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className="text-[10px] font-data font-semibold"
                          style={{ color: meta.hex }}
                        >
                          {fund.percentage}%
                        </span>
                        <span className="font-data font-semibold text-[12px] app-t2 min-w-[88px] text-right">
                          ₹{fund.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <div className="alloc-track">
                      <div
                        className="alloc-fill"
                        style={{
                          width:      `${(fund.percentage / categoryPct) * 100}%`,
                          background: meta.hex,
                          opacity:    0.65,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
