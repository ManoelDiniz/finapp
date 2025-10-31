import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Storage } from "../../services/storage";

interface Transaction {
  id: number;
  type: "entrada" | "saida";
  amount: number;
  description: string;
  date: string;
}

const COLORS = ["#16a34a", "#dc2626"];

export default function Statistics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const saved = Storage.get<Transaction[]>("finapp_transactions");
    if (saved) setTransactions(saved);
  }, []);

  const totalEntradas = transactions
    .filter((t) => t.type === "entrada")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSaidas = transactions
    .filter((t) => t.type === "saida")
    .reduce((acc, t) => acc + t.amount, 0);

  const saldo = totalEntradas - totalSaidas;

  const data = [
    { name: "Entradas", value: totalEntradas },
    { name: "Saídas", value: totalSaidas },
  ];

  return (
    <div className="p-6 pb-20">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📊 Estatísticas</h1>
        <p className="text-gray-500 text-sm mt-1">Resumo das suas finanças</p>
      </header>

      {/* Card de saldo */}
      <section className="bg-green-600 text-white rounded-2xl p-6 shadow-md text-center mb-6">
        <p className="text-sm opacity-80">Saldo atual</p>
        <h2 className="text-4xl font-bold mt-1">
          R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </h2>
      </section>

      {/* Gráfico */}
      <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Distribuição
        </h3>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhuma transação encontrada.
          </p>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={(props) => {
                    const { name, percent } = props as {
                      name: string;
                      percent?: number;
                    };
                    const percentValue = percent
                      ? (percent * 100).toFixed(0)
                      : "0";
                    return `${name}: ${percentValue}%`;
                  }}
                >
                  {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: number) =>
                    `R$ ${value.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Resumo numérico */}
      <section className="mt-6 flex justify-around text-center">
        <div>
          <p className="text-sm text-gray-500">Entradas</p>
          <p className="text-green-600 font-semibold text-lg">
            + R${" "}
            {totalEntradas.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Saídas</p>
          <p className="text-red-500 font-semibold text-lg">
            - R${" "}
            {totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </section>
    </div>
  );
}
