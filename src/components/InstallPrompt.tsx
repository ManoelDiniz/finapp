/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import type { BeforeInstallPromptEvent } from "../types/pwa";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [_isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone;

    setIsIOS(isIOSDevice);
    setIsStandalone(!!isInStandaloneMode);

    if (isIOSDevice && !isInStandaloneMode) {
      // Mostra banner custom pro iPhone
      setShowPrompt(true);
      return;
    }

    const dismissed = localStorage.getItem("finapp-install-dismissed");
    if (dismissed === "true") return;

    const handleBeforeInstall = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      e.preventDefault();
      setDeferredPrompt(event);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ Usuário instalou o app");
    } else {
      console.log("❌ Usuário recusou a instalação");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("finapp-install-dismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white shadow-xl border border-gray-200 rounded-2xl px-5 py-4 flex items-center space-x-3 animate-fadeIn z-50 w-[90%] sm:w-auto">
      <img
        src="/pwa-192x192.png"
        alt="FinApp"
        className="w-10 h-10 rounded-xl"
      />
      <div className="flex flex-col text-sm max-w-[180px]">
        {isIOS ? (
          <>
            <span className="font-semibold text-gray-800">
              Instale o FinApp
            </span>
            <span className="text-gray-500">
              Toque em <strong>compartilhar</strong> e selecione{" "}
              <strong>“Adicionar à Tela de Início”</strong>.
            </span>
          </>
        ) : (
          <>
            <span className="font-semibold text-gray-800">
              Instale o FinApp
            </span>
            <span className="text-gray-500">
              Acesse rápido, direto da tela inicial
            </span>
          </>
        )}
      </div>

      {!isIOS && (
        <button
          onClick={handleInstall}
          className="ml-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition"
        >
          Instalar
        </button>
      )}

      <button
        onClick={handleDismiss}
        className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2 transition"
        title="Fechar"
      >
        ✕
      </button>
    </div>
  );
}
