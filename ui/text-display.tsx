"use client"
import { useState, useEffect, useRef } from "react"

interface TextDisplayProps {
  text: string
}

export function TextDisplay({ text }: TextDisplayProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  // Split text by paragraphs
  const paragraphs = text.split("\n\n")

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("")
    setIsTyping(true)
    setIsComplete(false)

    let currentChar = 0
    const fullText = text

    const typingInterval = setInterval(() => {
      if (currentChar < fullText.length) {
        setDisplayedText(fullText.substring(0, currentChar + 1))
        currentChar++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
        setIsComplete(true)
      }
    }, 20) // Adjust typing speed here

    return () => clearInterval(typingInterval)
  }, [text])

  const handleSkip = () => {
    if (!isComplete) {
      setDisplayedText(text)
      setIsTyping(false)
      setIsComplete(true)
    }
  }

  // Split displayed text by paragraphs for rendering
  const displayedParagraphs = displayedText.split("\n\n")

  return (
    <div className="relative">
      <div ref={textRef} className="terminal-text prose prose-invert max-w-none" onClick={handleSkip}>
        {displayedParagraphs.map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed">
            {paragraph}
            {index === displayedParagraphs.length - 1 && isTyping && <span className="terminal-cursor"></span>}
          </p>
        ))}
      </div>

      {isTyping && (
        <div className="absolute bottom-0 right-0">
          <button
            className="text-xs text-gold/50 hover:text-gold bg-darker-gray px-2 py-1 border border-gold/30"
            onClick={handleSkip}
          >
            SKIP
          </button>
        </div>
      )}
    </div>
  )
}
