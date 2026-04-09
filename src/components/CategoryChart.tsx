import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts"
import type { CategoryAllocation } from "@/types/allocation"
import { useEffect, useRef, useMemo } from "react"
import gsap from "gsap"

type Props = {
  data: CategoryAllocation[]
}

const CATEGORY_COLORS: Record<string, string> = {
  "Large Cap":     "#4f90f7",
  "Mid Cap":       "#fbbf24",
  "Small Cap":     "#34d399",
  "Gold & Silver": "#f59e0b",
}

// Fund structure used in tooltip & legend suggestions
const FUND_STRUCTURE = [
  { category: "Large Cap",     fundName: "Nifty 50",          percentage: 25  },
  { category: "Large Cap",     fundName: "Nifty Next 50",     percentage: 15  },
  { category: "Large Cap",     fundName: "Nifty Bank",        percentage: 10  },
  { category: "Mid Cap",       fundName: "Nifty Midcap 150",  percentage: 25  },
  { category: "Small Cap",     fundName: "Quant Small Cap",   percentage: 7.5 },
  { category: "Small Cap",     fundName: "Nippon Small Cap",  percentage: 7.5 },
  { category: "Gold & Silver", fundName: "Gold",              percentage: 7   },
  { category: "Gold & Silver", fundName: "Silver",            percentage: 3   },
]

const FUNDS_BY_CATEGORY = FUND_STRUCTURE.reduce<Record<string, typeof FUND_STRUCTURE>>(
  (acc, fund) => {
    if (!acc[fund.category]) acc[fund.category] = []
    acc[fund.category].push(fund)
    return acc
  },
  {}
)

// ─── Tooltip ──────────────────────────────────────────────────────────────────
type TooltipPayload = {
  name?: string | number
  value?: number | string
}

type ChartTooltipProps = {
  active?: boolean
  payload?: TooltipPayload[]
  totalAmount: number
}

function ChartTooltip({ active, payload, totalAmount }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const category     = String(payload[0].name ?? "")
  const categoryAmt  = Number(payload[0].value ?? 0)
  if (!category) return null

  const funds = FUNDS_BY_CATEGORY[category] ?? []
  const color = CATEGORY_COLORS[category] ?? "#ccc"

  return (
    <div
      className="rounded-xl p-3.5 text-xs min-w-[210px]"
      style={{
        background:  "var(--tooltip-bg)",
        border:      "1px solid var(--tooltip-border)",
        boxShadow:   "var(--tooltip-shadow)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
        <p className="font-semibold app-t1">{category}</p>
      </div>
      <p className="font-data app-t4 text-[11px] mb-3 pl-4">
        ₹{categoryAmt.toLocaleString("en-IN")}
      </p>

      {/* Suggested funds */}
      <p className="text-[9px] font-semibold tracking-[0.1em] app-t5 uppercase pl-4 mb-1.5">
        Suggested Funds
      </p>
      <div
        className="space-y-2 pt-2"
        style={{ borderTop: "1px solid var(--divider)" }}
      >
        {funds.map((fund) => (
          <div key={fund.fundName} className="flex justify-between items-center gap-4">
            <span className="app-t4">{fund.fundName}</span>
            <span className="font-data app-t2 font-medium">
              ₹{((fund.percentage / 100) * totalAmount).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────
export default function CategoryChart({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const total = useMemo(() => data.reduce((acc, item) => acc + item.amount, 0), [data])

  const chartData = useMemo(
    () => data.map((entry) => ({ ...entry, fill: CATEGORY_COLORS[entry.category] ?? "#ccc" })),
    [data]
  )

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [data])

  return (
    <div ref={containerRef} className="card-surface rounded-2xl p-5 h-full flex flex-col">
      <p className="text-[10px] app-t5 uppercase tracking-[0.14em] font-semibold mb-5">
        Allocation Breakdown
      </p>

      {/* Donut chart */}
      <div className="relative h-52">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={62}
              outerRadius={90}
              paddingAngle={3}
              animationDuration={700}
            />
            <Tooltip
              content={<ChartTooltip totalAmount={total} />}
              wrapperStyle={{ zIndex: 1000 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <p className="text-[9px] app-t5 font-semibold tracking-[0.12em] mb-0.5">TOTAL</p>
          <p className="text-base font-display app-t1">₹{total.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Category legend — with suggested fund names */}
      <div className="mt-5 space-y-4 flex-1">
        {data.map((item) => {
          const color     = CATEGORY_COLORS[item.category] ?? "#ccc"
          const fundNames = (FUNDS_BY_CATEGORY[item.category] ?? [])
            .map((f) => f.fundName)
            .join(" · ")

          return (
            <div key={item.category}>
              <div className="flex items-start justify-between text-xs mb-1.5 gap-2">
                {/* Category + fund names */}
                <div className="flex items-start gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 mt-1"
                    style={{ background: color }}
                  />
                  <div className="min-w-0">
                    <p className="app-t3 font-semibold leading-tight">{item.category}</p>
                    <p className="app-t5 text-[10px] mt-0.5 leading-tight truncate font-data">
                      {fundNames}
                    </p>
                  </div>
                </div>

                {/* Amount + percentage */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-data app-t4 text-[11px]">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </span>
                  <span
                    className="font-data font-semibold w-9 text-right text-[11px]"
                    style={{ color }}
                  >
                    {item.percentage}%
                  </span>
                </div>
              </div>

              <div className="alloc-track ml-4">
                <div
                  className="alloc-fill"
                  style={{ width: `${item.percentage}%`, background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
