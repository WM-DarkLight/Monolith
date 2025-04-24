"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Radio, X, MessageSquare, HelpCircle, ChevronRight } from "lucide-react"
import Image from "next/image"
import { createPortal } from "react-dom"

interface PetrovQuestion {
  id: string
  question: string
  answer: string
  category: "gameplay" | "story" | "mechanics" | "technical" | "personal"
}

interface PetrovRandomEvent {
  id: string
  message: string
  type: "story" | "warning" | "tip" | "radio" | "humor"
}

const PETROV_QUESTIONS: PetrovQuestion[] = [
  {
    id: "q1",
    question: "How do I start a new campaign?",
    answer:
      "To start a new campaign, navigate to the Campaigns tab and select a campaign of your choice. Click the START button to begin your adventure. Campaigns offer a connected series of episodes with persistent progress.",
    category: "gameplay",
  },
  {
    id: "q2",
    question: "What are perks and how do I use them?",
    answer:
      "Perks are special abilities that provide unique bonuses to your character. You earn perk points as you progress through episodes. Access the perks menu during gameplay by clicking the trophy icon. Each perk has specific requirements and effects that can enhance your survival in the wasteland.",
    category: "mechanics",
  },
  {
    id: "q3",
    question: "How does the reputation system work?",
    answer:
      "The reputation system tracks how different factions in the wasteland view you. Your actions during episodes affect your standing with these groups. Higher reputation with a faction can unlock special dialogue options, better prices from vendors, and unique quest opportunities. Be careful though - helping one faction might anger another.",
    category: "mechanics",
  },
  {
    id: "q4",
    question: "What is The Monolith?",
    answer:
      "The Monolith is a mysterious ancient artifact of immense power hidden deep within the wasteland. Many have sought it, but few have returned. Legends say it can grant incredible abilities to those who find it, but at what cost? Your journey through the wasteland will gradually reveal more about its true nature and purpose.",
    category: "story",
  },
  {
    id: "q5",
    question: "How do I organize my episodes?",
    answer:
      "You can organize episodes using the Folders feature. Navigate to the Folders tab in the dashboard, create new folders with custom colors, and drag episodes into them. You can also pin important folders, add tags, and search within folders to keep your adventure library well-organized.",
    category: "technical",
  },
  {
    id: "q6",
    question: "How do skill checks work?",
    answer:
      "Skill checks test your character's abilities against challenges. When you encounter a skill check, the system compares your relevant skill value (like strength or intelligence) plus a random dice roll against the difficulty level. Higher skill values and good luck increase your chances of success. Failed skill checks may lead to different outcomes or consequences.",
    category: "mechanics",
  },
  {
    id: "q7",
    question: "Can I customize my character?",
    answer:
      "Yes! Many episodes and campaigns allow custom skills. When starting these adventures, you'll enter character creation where you can allocate skill points to attributes like Strength, Intelligence, Perception, Agility, Charisma, and Luck. Your skill choices will affect available options and success chances throughout your journey.",
    category: "gameplay",
  },
  {
    id: "q8",
    question: "How do I save my progress?",
    answer:
      "Your game auto-saves at key points, but you can manually save anytime by clicking the Save icon in the top right corner during gameplay. This creates a save file that you can return to later. Access your saved games from the Saved Games tab on the dashboard.",
    category: "technical",
  },
  {
    id: "q9",
    question: "What did you do before becoming an assistant?",
    answer:
      "Ah, those were the days. I was a signalman, bouncing transmissions across the sectors. Heard a lot of stories, some true, some... not so much. But it kept me warm, and mostly out of trouble.",
    category: "personal",
  },
  {
    id: "q10",
    question: "Do you ever miss the old world?",
    answer:
      "Miss it? Sometimes. The comforts, the music... But the old world is gone, and we have to build something new from the ashes. Still, a good cup of coffee would be nice.",
    category: "personal",
  },
  {
    id: "q11",
    question: "What's your favorite kind of music?",
    answer:
      "Static and the hum of vacuum tubes, mostly. But if I had to choose, I'd say pre-war jazz. Something about those saxophones gets the circuits humming, you know?",
    category: "personal",
  },
]

const PETROV_RANDOM_EVENTS: PetrovRandomEvent[] = [
  {
    id: "event1",
    message:
      "**static** ...sector seven is overrun... repeat, sector seven is overrun! All units fall back to checkpoint delta! **static**",
    type: "radio",
  },
  {
    id: "event2",
    message:
      "Hmm? Oh, didn't see you there. Just calibrating this old transmitter. The northern signals have been strange lately...",
    type: "story",
  },
  {
    id: "event3",
    message:
      "Word of advice: never trust a trader who won't show you their hands. Old wasteland wisdom that's kept me alive.",
    type: "tip",
  },
  {
    id: "event4",
    message:
      "**static** ...anyone copy? We found something beneath the old hospital... it's... it's moving... **static**",
    type: "radio",
  },
  {
    id: "event5",
    message: "Radiation levels are spiking east of here. Might want to avoid that area for a few days. Just saying.",
    type: "warning",
  },
  {
    id: "event6",
    message: "You know what I miss most about the old world? Vending machines. Weird, right? Just... the convenience.",
    type: "humor",
  },
  {
    id: "event7",
    message: "**static** ...Monolith activity detected in sector... **static** ...requesting immediate... **static**",
    type: "radio",
  },
  {
    id: "event8",
    message: "Had a dream about the Monolith again last night. Same one. It was... calling to me. Probably nothing.",
    type: "story",
  },
  {
    id: "event9",
    message:
      "If you ever find yourself surrounded by mutants, just remember: they're usually slower when they're full.",
    type: "tip",
  },
  {
    id: "event10",
    message: "**adjusting radio** ...strange signals coming from the old military base again. Third time this week.",
    type: "radio",
  },
  {
    id: "event11",
    message:
      "Ever notice how the stars look different now? Brighter in some places. Missing in others. Probably just my eyes.",
    type: "story",
  },
  {
    id: "event12",
    message: "Ran into a Tech Brotherhood patrol yesterday. Twitchy bunch. Something's got them spooked.",
    type: "warning",
  },
  {
    id: "event13",
    message: "**static** ...they're coming through the walls... **static** ...not human anymore... **static**",
    type: "radio",
  },
  {
    id: "event14",
    message:
      "You know what's funny? I still carry around pre-war money. Force of habit, I guess. Worthless now, of course.",
    type: "humor",
  },
  {
    id: "event15",
    message: "Always boil unknown water sources for at least 10 minutes. Trust me on this one.",
    type: "tip",
  },
]

function getRandomEvent(): PetrovRandomEvent {
  const randomIndex = Math.floor(Math.random() * PETROV_RANDOM_EVENTS.length)
  return PETROV_RANDOM_EVENTS[randomIndex]
}

export function PetrovAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<PetrovQuestion | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedAnswer, setDisplayedAnswer] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [hasNewMessage, setHasNewMessage] = useState(true)
  const [showPetrov, setShowPetrov] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [randomEvent, setRandomEvent] = useState<PetrovRandomEvent | null>(null)
  const [showRandomEvent, setShowRandomEvent] = useState(false)
  // Add a new state variable to track clicks since last random event
  const [clicksSinceLastEvent, setClicksSinceLastEvent] = useState(3) // Start at 3 to allow an event on first click

  useEffect(() => {
    setMounted(true)
    // Check if this is the first visit
    const hasSeenPetrov = localStorage.getItem("hasSeenPetrov")
    if (!hasSeenPetrov) {
      // Show a welcome message after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
        setSelectedQuestion({
          id: "welcome",
          question: "Welcome to The Monolith",
          answer:
            "Greetings, traveler. I am Petrov, your guide to the wasteland. If you have questions about your journey, I can provide assistance. Click on any question to learn more, or dismiss this message to continue on your own. Remember, knowledge is as valuable as ammunition out here.",
          category: "story",
        })
        setIsTyping(true)
        localStorage.setItem("hasSeenPetrov", "true")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (selectedQuestion && isTyping) {
      setDisplayedAnswer("")
      let currentChar = 0
      const fullText = selectedQuestion.answer

      const typingInterval = setInterval(() => {
        if (currentChar < fullText.length) {
          setDisplayedAnswer(fullText.substring(0, currentChar + 1))
          currentChar++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
        }
      }, 20) // Adjust typing speed here

      return () => clearInterval(typingInterval)
    }
  }, [selectedQuestion, isTyping])

  const handleQuestionClick = (question: PetrovQuestion) => {
    setSelectedQuestion(question)
    setIsTyping(true)
    setHasNewMessage(false)
  }

  const handleSkip = () => {
    if (isTyping && selectedQuestion) {
      setIsTyping(false)
      setDisplayedAnswer(selectedQuestion.answer)
    }
  }

  // Modify the toggleOpen function to implement the spacing between random events
  const toggleOpen = () => {
    if (!isOpen) {
      // Only allow random events if at least 3 clicks have passed since the last one
      if (Math.random() < 0.4 && clicksSinceLastEvent >= 3) {
        const event = getRandomEvent()
        setRandomEvent(event)
        setShowRandomEvent(true)
        setHasNewMessage(false)
        setClicksSinceLastEvent(0) // Reset the counter

        // Auto-close the random event after 5 seconds
        setTimeout(() => {
          setShowRandomEvent(false)
        }, 5000)

        return
      } else {
        // Increment the counter when no random event occurs
        setClicksSinceLastEvent((prevCount) => prevCount + 1)
      }
    }

    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasNewMessage(false)
    }
  }

  const filteredQuestions = filter === "all" ? PETROV_QUESTIONS : PETROV_QUESTIONS.filter((q) => q.category === filter)

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        className="wasteland-container w-full max-w-4xl p-0 overflow-hidden animate-fadeIn m-4"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="bg-gold p-4 flex items-center justify-between">
          <h2 className="text-black font-bold flex items-center">
            <Radio className="w-5 h-5 mr-2" />
            PETROV COMMS
          </h2>
          <button onClick={toggleOpen} className="text-black/70 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Left sidebar with questions */}
          <div className="w-1/3 border-r border-gold-dark bg-darker-gray overflow-y-auto">
            <div className="p-3 border-b border-gold-dark">
              <div className="flex space-x-1">
                <button
                  className={`text-xs px-2 py-1 ${filter === "all" ? "bg-gold text-black" : "bg-dark-gray text-white/70"}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`text-xs px-2 py-1 ${filter === "gameplay" ? "bg-gold text-black" : "bg-dark-gray text-white/70"}`}
                  onClick={() => setFilter("gameplay")}
                >
                  Gameplay
                </button>
              </div>
              <div className="flex space-x-1 mt-1">
                <button
                  className={`text-xs px-2 py-1 ${filter === "mechanics" ? "bg-gold text-black" : "bg-dark-gray text-white/70"}`}
                  onClick={() => setFilter("mechanics")}
                >
                  Mechanics
                </button>
                <button
                  className={`text-xs px-2 py-1 ${filter === "technical" ? "bg-gold text-black" : "bg-dark-gray text-white/70"}`}
                  onClick={() => setFilter("technical")}
                >
                  Technical
                </button>
                <button
                  className={`text-xs px-2 py-1 ${filter === "personal" ? "bg-gold text-black" : "bg-dark-gray text-white/70"}`}
                  onClick={() => setFilter("personal")}
                >
                  Personal
                </button>
              </div>
            </div>

            <div className="space-y-1 p-2">
              {filteredQuestions.map((q) => (
                <button
                  key={q.id}
                  className={`p-2 text-left w-full text-sm border ${
                    selectedQuestion?.id === q.id
                      ? "border-gold bg-gold/10"
                      : "border-transparent hover:border-gold-dark"
                  } transition-colors`}
                  onClick={() => handleQuestionClick(q)}
                >
                  <div className="flex items-center">
                    <HelpCircle className="w-3 h-3 mr-1.5 text-gold/70" />
                    <span className="line-clamp-2">{q.question}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right content area */}
          <div className="w-2/3 flex flex-col bg-dark-gray">
            {selectedQuestion ? (
              <>
                <div className="p-4 border-b border-gold-dark">
                  <h3 className="text-gold font-bold">{selectedQuestion.question}</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto relative">
                  <div className="flex mb-4">
                    {showPetrov && (
                      <div className="w-32 h-32 mr-3 flex-shrink-0 relative">
                        <Image
                          src="/petrov-avatar.png"
                          alt="Petrov"
                          width={128}
                          height={128}
                          className="border border-gold-dark"
                        />
                      </div>
                    )}
                    <div className="wasteland-card p-3 relative">
                      <p className="terminal-text text-sm">
                        {displayedAnswer}
                        {isTyping && <span className="terminal-cursor"></span>}
                      </p>

                      {isTyping && (
                        <button
                          className="absolute bottom-1 right-1 text-xs text-gold/50 hover:text-gold bg-darker-gray px-2 py-0.5 border border-gold/30"
                          onClick={handleSkip}
                        >
                          SKIP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-gold-dark bg-darker-gray">
                  <div className="flex justify-between items-center">
                    <button className="text-xs text-gold/70 hover:text-gold" onClick={() => setShowPetrov(!showPetrov)}>
                      {showPetrov ? "HIDE AVATAR" : "SHOW AVATAR"}
                    </button>
                    <button
                      className="wasteland-button text-xs py-1 px-3 flex items-center"
                      onClick={() => setSelectedQuestion(null)}
                    >
                      ASK ANOTHER QUESTION
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gold/30 mb-4" />
                <h3 className="text-gold mb-2">Select a question</h3>
                <p className="text-white/60 text-sm">
                  Choose a topic from the list to get information from Petrov, your wasteland guide.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )

  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={toggleOpen}
          className="wasteland-button p-3 rounded-full relative flex items-center justify-center"
          style={{ width: "60px", height: "60px" }}
        >
          <Radio className="w-6 h-6" />
          {hasNewMessage && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-rust rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            />
          )}
        </button>
      </motion.div>

      {/* Render the modal using createPortal */}
      {isOpen && mounted ? createPortal(modalContent, document.body) : null}

      {/* Random event popup */}
      {showRandomEvent &&
        randomEvent &&
        mounted &&
        createPortal(
          <motion.div
            className="fixed bottom-20 right-6 z-50 max-w-xs"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="wasteland-card p-3 border-gold bg-darker-gray petrov-panel">
              <div className="flex items-start">
                <div className="w-10 h-10 mr-2 flex-shrink-0">
                  <div className="w-full h-full border border-gold-dark bg-dark-gray flex items-center justify-center">
                    <Radio
                      className={`w-6 h-6 ${randomEvent.type === "radio" ? "text-rust animate-pulse" : "text-gold"}`}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      randomEvent.type === "radio"
                        ? "text-rust"
                        : randomEvent.type === "warning"
                          ? "text-rust-light"
                          : randomEvent.type === "tip"
                            ? "text-gold"
                            : "text-white/80"
                    }`}
                  >
                    {randomEvent.message}
                  </p>
                  <div className="text-xs text-white/50 mt-1">
                    {randomEvent.type === "radio"
                      ? "RADIO INTERCEPT"
                      : randomEvent.type === "warning"
                        ? "PETROV WARNING"
                        : randomEvent.type === "tip"
                          ? "PETROV TIP"
                          : "PETROV"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>,
          document.body,
        )}
    </>
  )
}
