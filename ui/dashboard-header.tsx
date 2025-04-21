"use client"

import { Clock, Radio, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [daysSurvived, setDaysSurvived] = useState(427)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  const formattedDate = currentTime.toLocaleDateString([], {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })

  return (
    <header className="dashboard-header border-b border-gold-dark bg-darker-gray">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-dark-gray border-2 border-gold flex items-center justify-center mr-3 relative">
            <span className="terminal-text font-bold text-lg">M</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-rust border border-gold rounded-full"></div>
          </div>
          <div>
            <h1 className="terminal-header text-xl tracking-widest">THE MONOLITH</h1>
            <div className="text-xs text-white/50 mt-1">WASTELAND CHRONICLES</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center text-gold border border-gold-dark bg-darker-gray px-3 py-1">
            <Radio className="w-4 h-4 mr-2" />
            <div>
              <div className="text-xs font-medium">
                DAYS SURVIVED: <span className="text-white">{daysSurvived}</span>
              </div>
              <div className="text-xs text-white/50">THREAT LEVEL: MODERATE</div>
            </div>
          </div>

          <div className="flex items-center text-gold border border-gold-dark bg-darker-gray px-3 py-1">
            <Clock className="w-4 h-4 mr-2" />
            <div>
              <div className="text-xs font-medium">{formattedTime}</div>
              <div className="text-xs text-white/50">{formattedDate}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-gold bg-dark-gray flex items-center justify-center text-gold font-bold">
              A
            </div>
          </div>
        </div>
      </div>

      <div className="bg-rust/20 border-t border-b border-rust/30 px-6 py-1 flex items-center">
        <AlertTriangle className="w-4 h-4 text-rust mr-2" />
        <span className="text-xs text-white/80">
          ALERT: Radiation levels increasing in the Northern Sectors. Proceed with caution.
        </span>
      </div>
    </header>
  )
}
