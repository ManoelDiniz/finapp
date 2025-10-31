import { useState } from "react"

interface TransactionModalProps {
  onClose: () => void
  onSave: (transaction: {
    type: "entrada" | "saida"
    amount: number
    description: string
  }) => void
}

export default function TransactionModal({ onClose, onSave }: TransactionModalProps) {
  const [type, setType] = useState<"entrada" | "saida">("entrada")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description) return
    onSave({
      type,
      amount: parseFloat(amount),
      description,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 relative animate-fadeIn">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Nova Transação
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Tipo */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("entrada")}
              className={`flex-1 py-2 rounded-xl font-medium ${
                type === "entrada"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Entrada
            </button>
            <button
              type="button"
              onClick={() => setType("saida")}
              className={`flex-1 py-2 rounded-xl font-medium ${
                type === "saida"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Saída
            </button>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="0.00"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Ex: Supermercado"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 font-semibold transition-all"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  )
}
