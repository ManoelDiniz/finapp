import { NavLink } from "react-router-dom"

export default function BottomNav() {
  const links = [
    { path: "/", label: "Início", icon: "🏠" },
    { path: "/transactions", label: "Transações", icon: "💸" },
    { path: "/statistics", label: "Estatísticas", icon: "📊" },
    { path: "/settings", label: "Configurações", icon: "⚙️" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 shadow-md z-50">
      {links.map(({ path, label, icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center text-sm ${
              isActive ? "text-green-600" : "text-gray-500"
            }`
          }
        >
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
