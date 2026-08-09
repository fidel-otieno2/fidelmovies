import { useEffect, useState } from 'react'

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [showIOS, setShowIOS] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (sessionStorage.getItem('installDismissed')) return

    if (isIOS()) {
      setShowIOS(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShow(false)
    setShowIOS(false)
    sessionStorage.setItem('installDismissed', 'true')
  }

  if (showIOS) return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-4">
        <div className="flex items-center gap-4 mb-3">
          <img src="/icon-192.png" alt="CineVerse" className="w-14 h-14 rounded-xl flex-shrink-0" />
          <div>
            <p className="text-white font-bold text-sm">Install CineVerse</p>
            <p className="text-gray-400 text-xs mt-0.5">Add to your home screen</p>
          </div>
        </div>
        <p className="text-gray-300 text-xs leading-relaxed">
          Tap <span className="text-white font-semibold">Share</span> <span className="text-lg">⎙</span> then{' '}
          <span className="text-white font-semibold">"Add to Home Screen"</span>
        </p>
        <button onClick={handleDismiss} className="mt-3 text-gray-500 hover:text-gray-300 text-xs transition">
          Not now
        </button>
      </div>
    </div>
  )

  if (!show) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-4 flex items-center gap-4">
        <img src="/icon-192.png" alt="CineVerse" className="w-14 h-14 rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">Install CineVerse</p>
          <p className="text-gray-400 text-xs mt-0.5">Add to your home screen for the full app experience</p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-300 text-xs text-center transition"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
