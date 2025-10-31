import { useEffect, useState } from "react"

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000) // inicia fade após 2s
    const hideTimer = setTimeout(() => {
      setVisible(false)
      onFinish()
    }, 2500) // remove o splash após 2.5s

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [onFinish])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-green-600 text-white z-50 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src="/pwa-192x192.png"
        alt="FinApp"
        className={`w-24 h-24 mb-4 rounded-2xl shadow-lg transition-transform duration-700 ${
          fadeOut ? "scale-125 opacity-70" : "scale-100"
        }`}
      />
      <h1 className="text-3xl font-bold tracking-wide">FinApp</h1>

      {/* Texto com os 3 pontinhos animados */}
      <div className="mt-4 text-lg flex items-center space-x-1">
        <span>Carregando</span>
        <div className="flex space-x-1 ml-1">
          <span className="dot dot1"></span>
          <span className="dot dot2"></span>
          <span className="dot dot3"></span>
        </div>
      </div>
    </div>
  )
}
