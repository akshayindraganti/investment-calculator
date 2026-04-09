import { useEffect, useRef, useState } from "react"
import { Wallet, ArrowRight } from "lucide-react"
import gsap from "gsap"

const PRESETS = [
  { label: "1L", value: 100000 },
  { label: "5L", value: 500000 },
  { label: "10L", value: 1000000 },
  { label: "25L", value: 2500000 },
  { label: "50L", value: 5000000 },
]

type Props = {
  onCalculate: (amount: number) => void
}

export default function InvestmentForm({ onCalculate }: Props) {
  const DEFAULT_AMOUNT = 10000
  const [amount, setAmount] = useState(DEFAULT_AMOUNT.toString())
  const [activePreset, setActivePreset] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    onCalculate(DEFAULT_AMOUNT)
  }, [onCalculate])

  const handlePreset = (value: number) => {
    setAmount(value.toString())
    setActivePreset(value)
    onCalculate(value)
  }

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const num = Number(amount)
    if (!num || num <= 0) return
    setActivePreset(null)
    onCalculate(num)
  }

  return (
    <div ref={containerRef} className="card-surface rounded-2xl px-6 py-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-5">

        {/* Brand label */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.18)" }}
          >
            <Wallet className="w-4 h-4 text-[#06d6a0]" />
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] app-t6">CAPITAL</p>
            <p className="text-sm font-semibold app-t2">Allocate Investment</p>
          </div>
        </div>

        {/* Vertical separator (desktop) */}
        <div className="sep-v hidden lg:block" />

        {/* Preset buttons */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => handlePreset(p.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${activePreset === p.value ? "preset-btn-active" : "preset-btn"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Amount input + submit */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 lg:ml-auto">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 app-t4 text-sm font-data select-none pointer-events-none">
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setActivePreset(null)
              }}
              className="input-teal font-data pl-8 pr-4 py-2.5 rounded-xl text-sm w-40"
            />
          </div>
          <button
            type="submit"
            className="btn-teal flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
          >
            Allocate
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  )
}
