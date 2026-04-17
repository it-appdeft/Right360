import { useState } from 'react'
import { FaArrowRight, FaArrowLeft, FaTimes } from 'react-icons/fa'

const TOUR_KEY = 'right360_tour_done'

const tourSteps = [
  {
    title: 'Welcome to Right360!',
    description: 'Use Right360 to save, organize, and share your favorite links in one place!',
    bgGradient: 'from-brand-green to-brand-blue',
    emoji: '🎉',
    illustration: '🖥️',
  },
  {
    title: 'Save bookmarks with tiles',
    description: 'Use tiles to create one-click access to websites, Google docs, videos, and much more.',
    bgGradient: 'from-brand-red to-brand-orange',
    emoji: '🔖',
    illustration: '📌',
  },
  {
    title: 'Organize tiles in webmixes',
    description: 'Create the perfect homepage and organize tiles in different webmixes. Limited only by your imagination!',
    bgGradient: 'from-brand-purple to-brand-blue',
    emoji: '📋',
    illustration: '🗂️',
  },
  {
    title: 'Customize the look & feel',
    description: 'Make Right360 your own. Change colors, backgrounds, icons, and much more.',
    bgGradient: 'from-brand-orange to-accent',
    emoji: '🎨',
    illustration: '🖌️',
  },
  {
    title: 'Share with others',
    description: 'When you are ready, Right360 makes it easy to share your creations with others.',
    bgGradient: 'from-brand-orange to-brand-red',
    emoji: '🤝',
    illustration: '📢',
  },
]

function WelcomeTour({ onComplete }) {
  const [step, setStep] = useState(0)
  const current = tourSteps[step]
  const isLast = step === tourSteps.length - 1

  const finish = () => {
    localStorage.setItem(TOUR_KEY, 'true')
    onComplete()
  }

  const next = () => {
    if (isLast) {
      finish()
    } else {
      setStep(step + 1)
    }
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={finish} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Close button */}
        <button
          onClick={finish}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 text-gray-500 hover:text-gray-700 hover:bg-white transition-colors"
        >
          <FaTimes size={12} />
        </button>

        {/* Illustration area */}
        <div className={`bg-gradient-to-br ${current.bgGradient} px-8 pt-8 pb-12 text-center`}>
          <div className="text-6xl mb-2">{current.illustration}</div>
          <div className="text-4xl">{current.emoji}</div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 -mt-6">
          <div className="bg-white rounded-xl shadow-lg p-5 text-center">
            <h2 className="text-lg font-heading font-bold text-gray-800 mb-2">
              {current.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-5">
            {step > 0 ? (
              <button
                onClick={prev}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaArrowLeft size={10} /> Previous Slide
              </button>
            ) : (
              <button
                onClick={finish}
                className="text-xs text-brand-blue hover:underline"
              >
                Skip Tour
              </button>
            )}

            <button
              onClick={next}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-green text-white text-xs font-bold rounded-full hover:bg-brand-green/90 transition-colors"
            >
              {isLast ? 'Get started' : 'Next Slide'}
              {!isLast && <FaArrowRight size={10} />}
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {tourSteps.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === step ? 'w-4 bg-brand-green' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {step === 0 && (
            <p className="text-center text-[10px] text-gray-400 mt-3">
              Already have an account? <a href="/login" className="text-brand-blue hover:underline">Login</a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export { TOUR_KEY }
export default WelcomeTour
