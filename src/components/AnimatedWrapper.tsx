import { useEffect, useRef } from "react"
import gsap from "gsap"

type Direction = "up" | "down" | "left" | "right"

type AnimatedWrapperProps = {
    children: React.ReactNode
    direction?: Direction
    duration?: number
    stagger?: number
    delay?: number
    className?: string
}

export default function AnimatedWrapper({
    children,
    direction = "up",
    duration = 0.8,
    stagger = 0.1,
    delay = 0,
    className = "",
}: AnimatedWrapperProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const elements = containerRef.current.children

        const fromVars: gsap.TweenVars = {
            opacity: 0,
        }

        if (direction === "up") fromVars.y = 50
        if (direction === "down") fromVars.y = -50
        if (direction === "left") fromVars.x = 50
        if (direction === "right") fromVars.x = -50

        gsap.fromTo(
            elements,
            fromVars,
            {
                opacity: 1,
                x: 0,
                y: 0,
                duration,
                stagger,
                delay,
                ease: "power3.out",
            }
        )
    }, [children, direction, duration, stagger, delay])

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    )
}
