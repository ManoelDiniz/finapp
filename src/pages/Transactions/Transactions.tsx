import { useEffect, useState } from "react";
import { Storage } from "../../services/storage";

interface Transaction {
  id: number;
  type: "entrada" | "saida";
  amount: number;
  description: string;
  date: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"todas" | "entrada" | "saida">("todas");

  useEffect(() => {
    const saved = Storage.get<Transaction[]>("finapp_transactions");
    if (saved) setTransactions(saved);
  }, []);

  const handleDelete = (id: number) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    Storage.set("finapp_transactions", updated);
  };

  const filteredTransactions =
    filter === "todas"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return (
    <div className="p-6 pb-20">
      {/* Cabeçalho */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">💸 Transações</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gerencie suas entradas e saídas
        </p>
      </header>

      {/* Filtros */}
      <div className="flex justify-around mb-6">
        {(["todas", "entrada", "saida"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
              filter === f
                ? f === "entrada"
                  ? "bg-green-600 text-white border-green-600"
                  : f === "saida"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-gray-800 text-white border-gray-800"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            {f === "todas" ? "Todas" : f === "entrada" ? "Entradas" : "Saídas"}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filteredTransactions.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Nenhuma transação encontrada.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTransactions.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100"
            >
              <div>
                <p className="font-medium text-gray-800">{t.description}</p>
                <span className="text-xs text-gray-500">
                  {new Date(t.date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold ${
                    t.type === "entrada" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {t.type === "entrada" ? "+" : "-"} R${" "}
                  {t.amount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>

                {/* Botão excluir */}
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
