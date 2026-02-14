import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wallet } from "lucide-react"
import gsap from "gsap"

type Props = {
    onCalculate: (amount: number) => void
}

export default function InvestmentForm({ onCalculate }: Props) {
    const defaultAmount = 300000
    const [amount, setAmount] = useState(
        defaultAmount.toString()
    )

    const containerRef = useRef<HTMLDivElement | null>(null)

    // Entrance animation
    useEffect(() => {
        if (!containerRef.current) return

        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { y: -30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "power3.out",
                }
            )
        }, containerRef)

        return () => ctx.revert()
    }, [])

    useEffect(() => {
        onCalculate(defaultAmount)
    }, [onCalculate])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const numeric = Number(amount)
        if (!numeric || numeric <= 0) return
        onCalculate(numeric)
    }

    return (
        <div
            ref={containerRef}
            className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl px-10 py-8 border border-gray-100"
        >
            <form
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row items-center justify-between gap-6"
            >
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                        <Wallet className="text-blue-600 w-6 h-6" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Investment Amount
                        </p>
                        <h2 className="text-xl font-semibold">
                            Allocate Your Capital
                        </h2>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            ₹
                        </span>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-8 h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-400 transition-all"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Allocate
                    </Button>
                </div>
            </form>
        </div>
    )
}
