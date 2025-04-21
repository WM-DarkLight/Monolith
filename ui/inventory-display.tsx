"use client"

import type { Item } from "@/types/game"
import { Package } from "lucide-react"
import { useState } from "react"

interface InventoryDisplayProps {
  inventory: Item[]
}

export function InventoryDisplay({ inventory }: InventoryDisplayProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div>
      <h3 className="terminal-header text-lg mb-3 flex items-center justify-between">
        <span>INVENTORY</span>
        <span className="text-xs text-white/50">{inventory.length} ITEMS</span>
      </h3>

      {inventory.length === 0 ? (
        <div className="py-4 text-center border border-dashed border-gold/20">
          <div className="flex justify-center mb-2">
            <Package className="w-8 h-8 text-gold/20" />
          </div>
          <p className="text-white/40 italic text-sm">INVENTORY EMPTY</p>
        </div>
      ) : (
        <>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {inventory.map((item) => (
              <li
                key={item.id}
                className={`flex justify-between items-center p-2 cursor-pointer transition-colors ${
                  selectedItem?.id === item.id
                    ? "bg-gold/20 border border-gold/30"
                    : "bg-dark-gray border border-transparent hover:border-gold/20"
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <span className="text-sm">{item.name}</span>
                {item.quantity > 1 && (
                  <span className="text-xs px-2 py-0.5 bg-darker-gray border border-gold/20 text-gold">
                    x{item.quantity}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {selectedItem && (
            <div className="mt-4 p-3 bg-dark-gray border border-gold/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-gold text-sm font-medium">{selectedItem.name}</h4>
                <button className="text-white/50 hover:text-white" onClick={() => setSelectedItem(null)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <p className="text-xs text-white/70 mb-2">{selectedItem.description}</p>
              <div className="flex justify-between text-xs text-white/50">
                <span>WEIGHT: 0.5 KG</span>
                <span>CONDITION: GOOD</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
