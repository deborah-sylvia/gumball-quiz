"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCcw, Download } from "lucide-react"
import { FaGithub } from 'react-icons/fa'
import { FiMessageSquare } from 'react-icons/fi'
import { downloadCardImage } from "@/components/ui/html2canvas"

interface Question {
  id: number
  question: string
  answers: {
    text: string
    character: string
    emoji: string
  }[]
}

interface Character {
  name: string
  description: string
  emoji: string
  color: string
  traits: string[]
  image: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your ideal way to spend a weekend?",
    answers: [
      { text: "Playing video games and eating snacks", character: "gumball", emoji: "🎮" },
      { text: "Swimming or being near water", character: "darwin", emoji: "🏊" },
      { text: "Reading books and studying", character: "anais", emoji: "📚" },
      { text: "Working out and staying active", character: "nicole", emoji: "💪" },
      { text: "Relaxing and watching TV", character: "richard", emoji: "📺" },
    ],
  },
  {
    id: 2,
    question: "How do you handle problems?",
    answers: [
      { text: "Jump in headfirst without thinking", character: "gumball", emoji: "🚀" },
      { text: "Try to help everyone get along", character: "darwin", emoji: "🤝" },
      { text: "Analyze the situation carefully", character: "anais", emoji: "🔍" },
      { text: "Take charge and fix it immediately", character: "nicole", emoji: "⚡" },
      { text: "Hope someone else handles it", character: "richard", emoji: "🤷" },
    ],
  },
  {
    id: 3,
    question: "What's your biggest strength?",
    answers: [
      { text: "My creativity and imagination", character: "gumball", emoji: "🎨" },
      { text: "My loyalty and kindness", character: "darwin", emoji: "❤️" },
      { text: "My intelligence and logic", character: "anais", emoji: "🧠" },
      { text: "My determination and strength", character: "nicole", emoji: "🔥" },
      { text: "My laid-back attitude", character: "richard", emoji: "😌" },
    ],
  },
  {
    id: 4,
    question: "What's your favorite type of food?",
    answers: [
      { text: "Junk food and candy", character: "gumball", emoji: "🍭" },
      { text: "Fish and seafood", character: "darwin", emoji: "🐟" },
      { text: "Healthy, balanced meals", character: "anais", emoji: "🥗" },
      { text: "Quick energy foods", character: "nicole", emoji: "⚡" },
      { text: "Anything delicious and filling", character: "richard", emoji: "🍔" },
    ],
  },
  {
    id: 5,
    question: "How do your friends see you?",
    answers: [
      { text: "The fun troublemaker", character: "gumball", emoji: "😈" },
      { text: "The supportive best friend", character: "darwin", emoji: "🤗" },
      { text: "The smart one with all the answers", character: "anais", emoji: "🤓" },
      { text: "The responsible leader", character: "nicole", emoji: "👑" },
      { text: "The easygoing comic relief", character: "richard", emoji: "😄" },
    ],
  },
]

const characters: Record<string, Character> = {
  gumball: {
    name: "Gumball Watterson",
    description:
      "You're creative, mischievous, and always ready for an adventure! Like Gumball, you have a wild imagination and aren't afraid to take risks, even if they sometimes get you into trouble.",
    emoji: "🐱",
    color: "bg-gradient-to-br from-blue-400 to-cyan-500",
    traits: ["Creative", "Adventurous", "Optimistic", "Impulsive"],
    image: "/characters/Gumball.png"
  },
  darwin: {
    name: "Darwin Watterson",
    description:
      "You're loyal, kind-hearted, and always there for your friends! Like Darwin, you believe in the good in everyone and try to keep the peace wherever you go.",
    emoji: "🐠",
    color: "bg-gradient-to-br from-orange-400 to-red-500",
    traits: ["Loyal", "Kind", "Optimistic", "Supportive"],
    image: "/characters/Darwin.png"
  },
  anais: {
    name: "Anais Watterson",
    description:
      "You're incredibly smart and mature beyond your years! Like Anais, you're the voice of reason and often have to clean up after others' mistakes.",
    emoji: "🐰",
    color: "bg-gradient-to-br from-pink-400 to-purple-500",
    traits: ["Intelligent", "Mature", "Logical", "Responsible"],
    image: "/characters/Anais.png"
  },
  nicole: {
    name: "Nicole Watterson",
    description:
      "You're strong, determined, and fiercely protective of those you love! Like Nicole, you're not afraid to take charge and get things done.",
    emoji: "🐱",
    color: "bg-gradient-to-br from-blue-600 to-indigo-700",
    traits: ["Strong", "Determined", "Protective", "Hardworking"],
    image: "/characters/Nicole.png"
  },
  richard: {
    name: "Richard Watterson",
    description:
      "You're laid-back, fun-loving, and know how to enjoy life's simple pleasures! Like Richard, you bring joy and laughter wherever you go.",
    emoji: "🐰",
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
    traits: ["Relaxed", "Fun-loving", "Cheerful", "Carefree"],
    image: "/characters/Richard.png"
  },
}

export default function Component() {
  const [gameState, setGameState] = useState<"start" | "playing" | "result">("start")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [result, setResult] = useState<string>("")
  const cardRef = useRef<HTMLDivElement>(null)

  // Audio refs, initialized as null
  const clickSound = useRef<HTMLAudioElement | null>(null)
  const downloadSound = useRef<HTMLAudioElement | null>(null)
  const backSound = useRef<HTMLAudioElement | null>(null)
  const successSound = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      clickSound.current = new Audio('/sounds/button.wav')
      clickSound.current.preload = 'auto'
      downloadSound.current = new Audio('/sounds/download.wav')
      downloadSound.current.preload = 'auto'
      backSound.current = new Audio('/sounds/back.wav')
      backSound.current.preload = 'auto'
      successSound.current = new Audio('/sounds/success.wav')
      successSound.current.preload = 'auto'
    }
  }, [])

  const calculateResult = (userAnswers: string[]) => {
    const scores: Record<string, number> = {}

    userAnswers.forEach((answer) => {
      scores[answer] = (scores[answer] || 0) + 1
    })

    return Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b))
  }

  const handleAnswer = (character: string) => {
    clickSound.current?.play()
    const newAnswers = [...answers, character]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const finalResult = calculateResult(newAnswers)
      setResult(finalResult)
      setGameState("result")
    }
  }

  const resetGame = () => {
    setGameState("start")
    setCurrentQuestion(0)
    setAnswers([])
    setResult("")
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  let content = null;
  if (gameState === "start") {
    content = (
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 text-center">
            <div className="text-6xl mb-4">🌟</div>
            <h1 className="text-3xl font-black text-white mb-2 drop-shadow-lg">Amazing World of</h1>
            <h2 className="gumball-title text-6xl font-black text-white mb-4 drop-shadow-lg font-gumball">GUMBALL</h2>
            <p className="text-xl font-bold text-white/90 drop-shadow">Character Quiz!</p>
          </div>
          <div className="p-8 bg-white">
            <p className="text-lg text-gray-700 mb-6 text-center font-medium">
              Discover which character from Elmore you're most like! 🏠
            </p>
            <Button
              onClick={() => {
                downloadSound.current?.play()
                setGameState("playing")
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Quiz! 🚀
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  } else if (gameState === "playing") {
    const question = questions[currentQuestion];
    content = (
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight">{question.question}</h3>
          </div>

          <div className="space-y-3 mb-4">
            {question.answers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(answer.character)}
                variant="outline"
                className="w-full p-4 text-left bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{answer.emoji}</span>
                  <span className="font-medium text-gray-700 flex-1">{answer.text}</span>
                </div>
              </Button>
            ))}
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => {
                backSound.current?.play()
                setCurrentQuestion((prev) => Math.max(prev - 1, 0))
              }}
              variant="outline"
              className="px-6 py-2 font-bold"
              disabled={currentQuestion === 0}
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  } else if (gameState === "result") {
    const character = characters[result];
    content = (
      <>
        {/* Dedicated download card (hidden) */}
        {/* <DownloadCard /> */}
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 overflow-hidden" ref={cardRef}>
          <CardContent className="p-0">
            <div className={`${character.color} p-8 text-center text-white`}>
              <img
                src={character.image}
                alt={character.name}
                className="mx-auto mb-2 w-128 sm:h-64 h-32 object-contain drop-shadow-lg"
              />
              <h2 className="text-2xl font-black mb-2 drop-shadow-lg">You are...</h2>
              <h1 className="text-3xl font-black mb-4 drop-shadow-lg">{character.name}!</h1>
            </div>

            <div className="p-8 bg-white">
              <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed font-medium">{character.description}</p>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Your traits:</h3>
                <div className="flex flex-wrap gap-2">
                  {character.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    downloadSound.current?.play()
                    resetGame()
                  }}
                  variant="outline"
                  className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-xl font-bold py-3"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button
                  onClick={async () => {
                    clickSound.current?.play()
                    successSound.current?.play()
                    if (cardRef.current) {
                      await downloadCardImage(
                        cardRef.current,
                        `gumball-quiz-result-${result.replace(/\s+/g, '-')}.png`
                      )
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl py-3"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {content}
      <div className="mt-6 flex items-center justify-center text-gray-400 text-sm gap-2">
        <FaGithub className="inline-block mr-1" size={18} />
        <a
          href="https://github.com/deborah-sylvia"
          target="_blank"
          rel="noopener noreferrer"
          className="sliding-underline"
        >
          @deborah-sylvia
        </a>
      </div>
      {/* Floating Feedback Button */}
      <a
        href="https://tally.so/r/nGE4e2"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Send Feedback"
        className="fixed z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center p-4 sm:bottom-6 sm:right-6 bottom-6 right-6 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{
          top: 'auto',
          right: '1.5rem',
          bottom: '1.5rem',
          left: 'auto',
        }}
      >
        <FiMessageSquare size={24} />
        {/* <span className="ml-2 font-bold hidden sm:inline">Feedback</span> */}
      </a>
      <style>{`
        @media (max-width: 640px) {
          a[aria-label='Send Feedback'] {
            top: 1.5rem !important;
            bottom: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
