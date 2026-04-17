import { useState } from 'react'
import { FaThLarge, FaListUl, FaHome, FaGraduationCap, FaChalkboardTeacher, FaBriefcase, FaArrowRight, FaCheck, FaPuzzlePiece, FaRocket } from 'react-icons/fa'

const ONBOARDING_KEY = 'right360_onboarding_done'

// Step 1: Choose webmix type
function StepChooseType({ onSelect }) {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-brand-red via-brand-purple to-brand-blue h-40 rounded-t-2xl -mx-6 -mt-6 mb-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-2">🧩</div>
          <p className="text-white/80 text-sm">Build your personalized dashboard</p>
        </div>
      </div>
      <h2 className="text-xl font-heading font-bold text-gray-800 mb-2">
        How would you like to start?
      </h2>
      <p className="text-sm text-gray-500 mb-8">Choose how to set up your Right360 dashboard</p>

      <div className="grid grid-cols-2 gap-4 px-2">
        <button
          onClick={() => onSelect('empty')}
          className="group p-6 rounded-xl border-2 border-gray-200 hover:border-brand-green transition-all hover:shadow-lg"
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-brand-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaThLarge className="text-brand-green" size={28} />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">Empty</h3>
          <p className="text-xs text-gray-500">
            Start fresh and add your own tiles. Import bookmarks or customize freely.
          </p>
          <span className="inline-block mt-3 px-4 py-2 bg-brand-green text-white text-xs font-bold rounded-full">
            Start empty
          </span>
        </button>

        <button
          onClick={() => onSelect('prefilled')}
          className="group p-6 rounded-xl border-2 border-gray-200 hover:border-brand-blue transition-all hover:shadow-lg"
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-brand-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaListUl className="text-brand-blue" size={28} />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">Prefilled</h3>
          <p className="text-xs text-gray-500">
            Get handy tiles right from the start. Edit, remove or modify anytime.
          </p>
          <span className="inline-block mt-3 px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-full">
            Start Prefilled
          </span>
        </button>
      </div>
    </div>
  )
}

// Step 2: Select webmix category (only if prefilled)
const webmixCategories = [
  { key: 'news', label: 'News', tags: ['Daily', 'News', 'World', 'Technology'] },
  { key: 'popular', label: 'Popular', tags: ['Shopping', 'Social', 'Gaming', 'Music'] },
  { key: 'education', label: 'Education', tags: ['School', 'Science', 'Learning'] },
  { key: 'technology', label: 'Technology', tags: ['Dev', 'AI', 'Software', 'Hardware'] },
  { key: 'entertainment', label: 'Entertainment', tags: ['Movies', 'Music', 'Streaming'] },
  { key: 'finance', label: 'Finance', tags: ['Stocks', 'Crypto', 'Banking'] },
]

function StepSelectWebmix({ onSelect, selected, onNext }) {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-brand-purple to-brand-blue h-36 rounded-t-2xl -mx-6 -mt-6 mb-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📋</div>
          <p className="text-white/80 text-sm">Choose your starting collection</p>
        </div>
      </div>
      <h2 className="text-xl font-heading font-bold text-gray-800 mb-2">
        Select the Webmix you would like to start with
      </h2>
      <p className="text-sm text-gray-500 mb-6">You can always change this later</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {webmixCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selected === cat.key
                ? 'border-brand-green bg-brand-green/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <h4 className="font-bold text-gray-800 text-sm mb-1">{cat.label}</h4>
            <div className="flex flex-wrap gap-1">
              {cat.tags.map((tag) => (
                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="px-6 py-2.5 bg-brand-green text-white font-bold text-sm rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-green/90 transition-colors inline-flex items-center gap-2"
      >
        <FaCheck size={12} /> Save choice
      </button>
    </div>
  )
}

// Step 3: Choose use case
const useCases = [
  { key: 'home', label: 'Home', icon: FaHome, color: '#E8842A' },
  { key: 'student', label: 'Student', icon: FaGraduationCap, color: '#3F8ECF' },
  { key: 'classroom', label: 'Classroom', icon: FaChalkboardTeacher, color: '#7B5EA7' },
  { key: 'office', label: 'Office', icon: FaBriefcase, color: '#4CAF50' },
]

function StepUseCase({ onSelect, selected, onNext }) {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-brand-orange to-accent h-36 rounded-t-2xl -mx-6 -mt-6 mb-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">👤</div>
          <p className="text-white/80 text-sm">Help us personalize your experience</p>
        </div>
      </div>
      <h2 className="text-xl font-heading font-bold text-gray-800 mb-2">
        How would you like to use Right360?
      </h2>
      <p className="text-sm text-gray-500 mb-6">This helps us recommend the best content</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {useCases.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`p-5 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
              selected === key
                ? 'border-brand-green bg-brand-green/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: color + '20' }}
            >
              <Icon size={24} style={{ color }} />
            </div>
            <span className="text-sm font-semibold text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="px-6 py-2.5 bg-brand-green text-white font-bold text-sm rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-green/90 transition-colors inline-flex items-center gap-2"
      >
        <FaArrowRight size={12} /> Next step
      </button>
    </div>
  )
}

// Step 4: Congratulations
function StepCongrats({ onFinish }) {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-brand-orange to-accent h-36 rounded-t-2xl -mx-6 -mt-6 mb-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-white font-bold">You're all set!</p>
        </div>
      </div>

      <h2 className="text-xl font-heading font-bold text-gray-800 mb-2">
        Congratulations with setting up your Right360!
      </h2>
      <p className="text-sm text-gray-500 mb-6">What would you like to do next?</p>

      <div className="space-y-4 text-left mb-8">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
          <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center shrink-0">
            <FaPuzzlePiece className="text-brand-blue" size={18} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Customize your tiles</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Click "Edit" to add, remove, or rearrange tiles on your dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
          <div className="w-10 h-10 rounded-lg bg-brand-purple/10 flex items-center justify-center shrink-0">
            <FaRocket className="text-brand-purple" size={18} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Browse the Category Library</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Discover curated collections of tiles for every interest.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="px-6 py-2.5 bg-brand-green text-white font-bold text-sm rounded-full hover:bg-brand-green/90 transition-colors inline-flex items-center gap-2"
      >
        <FaCheck size={12} /> Continue to Right360
      </button>
    </div>
  )
}

// Main Wizard
function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1)
  const [webmixType, setWebmixType] = useState(null)
  const [selectedWebmix, setSelectedWebmix] = useState(null)
  const [useCase, setUseCase] = useState(null)

  const finish = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    localStorage.setItem('right360_useCase', useCase || 'home')
    localStorage.setItem('right360_webmixType', webmixType || 'prefilled')
    if (selectedWebmix) localStorage.setItem('right360_webmix', selectedWebmix)
    onComplete({
      webmixType,
      selectedWebmix,
      useCase,
    })
  }

  const handleTypeSelect = (type) => {
    setWebmixType(type)
    if (type === 'empty') {
      setStep(3) // skip webmix selection
    } else {
      setStep(2)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all ${
                  s === step ? 'w-6 bg-brand-green' : s < step ? 'bg-brand-green/50' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {step === 1 && <StepChooseType onSelect={handleTypeSelect} />}
          {step === 2 && (
            <StepSelectWebmix
              selected={selectedWebmix}
              onSelect={setSelectedWebmix}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <StepUseCase
              selected={useCase}
              onSelect={setUseCase}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && <StepCongrats onFinish={finish} />}

          {/* Skip link */}
          {step < 4 && (
            <p className="text-center mt-4">
              <button
                onClick={finish}
                className="text-xs text-brand-blue hover:underline"
              >
                I'll do this later
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export { ONBOARDING_KEY }
export default OnboardingWizard
