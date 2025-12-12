import { useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EarningsChartProps {
  transactions?: Array<{
    id: number;
    amount: number;
    type: string;
    createdAt: Date | string;
    description: string | null;
  }>;
  period?: "7days" | "30days";
}

export function EarningsChart({ transactions = [], period = "7days" }: EarningsChartProps) {
  const daysToShow = period === "7days" ? 7 : 30;

  const chartData = useMemo(() => {
    // Criar array de datas dos últimos N dias
    const dates: string[] = [];
    const today = new Date();
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" }));
    }

    // Agrupar transações por dia
    const dailyEarnings: { [key: string]: number } = {};
    const dailyExpenses: { [key: string]: number } = {};

    dates.forEach((date) => {
      dailyEarnings[date] = 0;
      dailyExpenses[date] = 0;
    });

    // Processar transações
    transactions.forEach((tx) => {
      const txDate = new Date(tx.createdAt);
      const dateKey = txDate.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });

      if (dates.includes(dateKey)) {
        const amountInReais = tx.amount / 100;
        if (tx.type === "call_earning" || tx.type === "credit") {
          dailyEarnings[dateKey] = (dailyEarnings[dateKey] || 0) + amountInReais;
        } else if (tx.type === "call_charge" || tx.type === "withdrawal") {
          dailyExpenses[dateKey] = (dailyExpenses[dateKey] || 0) + amountInReais;
        }
      }
    });

    const earningsData = dates.map((date) => dailyEarnings[date] || 0);
    const expensesData = dates.map((date) => dailyExpenses[date] || 0);

    return {
      labels: dates,
      datasets: [
        {
          label: "Ganhos",
          data: earningsData,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#10b981",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: "Gastos",
          data: expensesData,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#ef4444",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [transactions, daysToShow]);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 13, weight: 600 },
        bodyFont: { size: 12 },
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return `R$ ${value.toFixed(0)}`;
          },
          font: {
            size: 11,
            weight: "normal" as const,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: "normal" as const,
          },
        },
      },
    },
  };

  const totalEarnings = chartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  const totalExpenses = chartData.datasets[1].data.reduce((a: number, b: number) => a + b, 0);
  const netEarnings = totalEarnings - totalExpenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de Ganhos</CardTitle>
        <CardDescription>
          {period === "7days" ? "Últimos 7 dias" : "Últimos 30 dias"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Ganhos</p>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">
              R$ {totalEarnings.toFixed(2)}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">Gastos</p>
            <p className="text-xl font-bold text-red-700 dark:text-red-300">
              R$ {totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className={`${netEarnings >= 0 ? "bg-blue-50 dark:bg-blue-950" : "bg-orange-50 dark:bg-orange-950"} p-3 rounded-lg`}>
            <p className={`text-xs ${netEarnings >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"} font-semibold`}>
              Líquido
            </p>
            <p className={`text-xl font-bold ${netEarnings >= 0 ? "text-blue-700 dark:text-blue-300" : "text-orange-700 dark:text-orange-300"}`}>
              R$ {netEarnings.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="h-80 w-full">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
