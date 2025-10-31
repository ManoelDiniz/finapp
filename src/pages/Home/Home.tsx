import { useState, useEffect } from "react";
import TransactionModal from "../../components/TransactionModal";
import { Storage } from "../../services/storage";

interface Transaction {
  id: number;
  type: "entrada" | "saida";
  amount: number;
  description: string;
  date: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Carrega as transações salvas ao abrir o app
  useEffect(() => {
    const saved = Storage.get<Transaction[]>("finapp_transactions");
    if (saved) {
      setTransactions(saved);
    } else {
      // Se não houver nada, cria um mock inicial (só 1x)
      const mock: Transaction[] = [
        {
          id: 1,
          type: "entrada",
          amount: 2500,
          description: "Salário",
          date: "2025-10-31",
        },
        {
          id: 2,
          type: "saida",
          amount: 120,
          description: "Supermercado",
          date: "2025-10-30",
        },
        {
          id: 3,
          type: "saida",
          amount: 75,
          description: "Transporte",
          date: "2025-10-30",
        },
        {
          id: 4,
          type: "entrada",
          amount: 300,
          description: "Freelance",
          date: "2025-10-29",
        },
      ];
      setTransactions(mock);
      Storage.set("finapp_transactions", mock);
    }
  }, []);

  // 🔹 Salva sempre que as transações mudarem
  useEffect(() => {
    if (transactions.length > 0) {
      Storage.set("finapp_transactions", transactions);
    }
  }, [transactions]);

  // 🔹 Cálculos
  const saldo = transactions.reduce(
    (acc, t) => acc + (t.type === "entrada" ? t.amount : -t.amount),
    0
  );
  const entrada = transactions
    .filter((t) => t.type === "entrada")
    .reduce((acc, t) => acc + t.amount, 0);
  const saida = transactions
    .filter((t) => t.type === "saida")
    .reduce((acc, t) => acc + t.amount, 0);

  // 🔹 Adiciona nova transação
  const handleAddTransaction = (
    newTransaction: Omit<Transaction, "id" | "date">
  ) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: transactions.length + 1,
      date: new Date().toISOString(),
    };
    setTransactions([transaction, ...transactions]);
  };

  return (
    <div className="p-6 pb-20 flex flex-col gap-6">
      {/* Cabeçalho */}
      <header className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">FinApp 💰</h1>
        <p className="text-gray-500 text-sm mt-1">
          Controle suas finanças facilmente
        </p>
      </header>

      {/* Card de saldo */}
      <section className="bg-green-600 text-white rounded-2xl p-6 shadow-md text-center">
        <p className="text-sm opacity-80">Saldo atual</p>
        <h2 className="text-4xl font-bold mt-1">
          R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </h2>

        <div className="flex justify-around mt-4">
          <div className="flex flex-col items-center">
            <span className="text-green-100 text-xs">Entradas</span>
            <span className="font-semibold text-green-50">
              + R${" "}
              {entrada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-green-100 text-xs">Saídas</span>
            <span className="font-semibold text-green-50">
              - R$ {saida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </section>

      {/* Lista de transações */}
      <section>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Últimas transações
        </h3>

        <div className="flex flex-col gap-3">
          {transactions.map((t) => (
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
              <span
                className={`font-semibold ${
                  t.type === "entrada" ? "text-green-600" : "text-red-500"
                }`}
              >
                {t.type === "entrada" ? "+" : "-"} R${" "}
                {t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Botão flutuante */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-5 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl w-14 h-14 flex items-center justify-center text-3xl transition-all duration-200 active:scale-95"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSave={handleAddTransaction}
        />
      )}
    </div>
  );
}
