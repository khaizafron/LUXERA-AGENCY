"use client"

import * as React from "react"

export default function TiltMiniCard({ children }: { children: React.ReactNode }) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [rot, setRot] = React.useState({ x: 0, y: 0 })

  const handleMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    setRot({
      x: -(y / rect.height) * 12,
      y: (x / rect.width) * 12,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      className="
        relative rounded-xl bg-white/5 p-4 shadow-xl
        transition-all duration-300 cursor-pointer
        [transform-style:preserve-3d]
      "
      style={{
        transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) translateZ(40px)`,
      }}
    >
      {children}
    </div>
  )
}
