import { useEffect, useState } from "react";
import { Storage } from "../../services/storage";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Verifica se o app está em modo standalone (PWA instalado)
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone === true;
    setIsInstalled(standalone);

    // Aplica tema salvo no localStorage
    const savedTheme = Storage.get<boolean>("finapp_darkmode");
    if (savedTheme) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Alternar tema
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    Storage.set("finapp_darkmode", newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Limpar dados
  const handleClearData = () => {
    if (
      confirm(
        "Tem certeza que deseja apagar todos os dados? Essa ação não pode ser desfeita."
      )
    ) {
      Storage.remove("finapp_transactions");
      location.reload();
    }
  };

  return (
    <div className="p-6 pb-20">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 ">⚙️ Configurações</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Personalize sua experiência no FinApp
        </p>
      </header>

      <section className="bg-white dark:bg-gray-800 dark:text-gray-100 p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
        {/* Tema */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Modo Escuro</span>
          <button
            onClick={toggleTheme}
            className={`w-14 h-8 rounded-full transition-all relative ${
              darkMode ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-all ${
                darkMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Limpar dados */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Limpar dados do app</span>
          <button
            onClick={handleClearData}
            className="text-red-500 font-semibold hover:underline"
          >
            Limpar
          </button>
        </div>

        {/* Status do app */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Versão:</strong> 1.0.0
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Status:</strong>{" "}
            {isInstalled ? "Instalado como PWA ✅" : "Rodando no navegador 🌐"}
          </p>
        </div>
      </section>
    </div>
  );
}
