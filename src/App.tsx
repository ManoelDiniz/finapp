import { useState } from "react"
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import SplashScreen from "./components/SplashScreen"
import InstallPrompt from "./components/InstallPrompt"
import BottomNav from "./layouts/BottomNav"


export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}
      {!loading && (
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 text-gray-800 relative pb-16">
            <AppRoutes />
            <BottomNav />
            <InstallPrompt />
          </div>
        </BrowserRouter>
      )}
    </>
  )
}
