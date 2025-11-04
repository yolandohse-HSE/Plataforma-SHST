"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import KPICard from "@/components/KPICard";
import AlertCard from "@/components/AlertCard";

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "critical" | "warning" | "info";
  actionUrl?: string;
  actionLabel?: string;
}

interface KPIData {
  label: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  details?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      title: "Requisitos em Atraso",
      message: "2 requisitos de conformidade venceram",
      severity: "critical",
      actionLabel: "Ver Requisitos",
      actionUrl: "/conformidade",
    },
    {
      id: "2",
      title: "PSS Incompleto",
      message: "Obra Kilamba: 3 capítulos pendentes de desenvolvimento",
      severity: "warning",
      actionLabel: "Continuar Desenvolvimento",
      actionUrl: "/pss",
    },
    {
      id: "3",
      title: "Documentação de Contratada",
      message: "Construtora ABC: Seguro de responsabilidade civil vence em 15 dias",
      severity: "warning",
      actionLabel: "Ver Contratada",
      actionUrl: "/contratadas",
    },
  ]);

  const [kpis] = useState<KPIData[]>([
    {
      label: "Taxa de Conformidade",
      value: 78,
      unit: "%",
      trend: "up",
      details: "Aumentou 5% este mês",
    },
    {
      label: "Requisitos Conformes",
      value: 23,
      unit: "de 29",
      trend: "up",
      details: "6 em progresso",
    },
    {
      label: "Acidentes Registados",
      value: 2,
      unit: "este mês",
      trend: "down",
      details: "Redução de 50% vs. mês anterior",
    },
    {
      label: "Taxa de Incidentes",
      value: 0.5,
      unit: "por 100 trabalhadores",
      trend: "stable",
      details: "Mantém-se estável",
    },
  ]);

  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [showKPIDetail, setShowKPIDetail] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-center py-10">A carregar...</div>;
  }

  const handleAlertAction = (actionUrl?: string) => {
    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  const handleKPIClick = (kpiLabel: string) => {
    setSelectedKPI(kpiLabel);
    setShowKPIDetail(true);
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Saudação */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {session?.user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Resumo de conformidade e alertas de segurança
        </p>
      </div>

      {/* Alertas Acionáveis */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Alertas Importantes</h2>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg p-4 border-l-4 flex items-start justify-between ${
                alert.severity === "critical"
                  ? "bg-red-50 border-red-500"
                  : alert.severity === "warning"
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-blue-50 border-blue-500"
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
              </div>
              <div className="flex gap-2 ml-4">
                {alert.actionUrl && (
                  <button
                    onClick={() => handleAlertAction(alert.actionUrl)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    {alert.actionLabel}
                  </button>
                )}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPIs com Drill-down */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Indicadores-Chave de Desempenho</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              onClick={() => handleKPIClick(kpi.label)}
              className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <p className="text-sm text-gray-600 font-medium">{kpi.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {kpi.value}
                <span className="text-lg text-gray-600 ml-1">{kpi.unit}</span>
              </p>
              <p className={`text-sm mt-2 ${kpi.trend === "up" ? "text-green-600" : kpi.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
                {kpi.trend === "up" ? "↑" : kpi.trend === "down" ? "↓" : "→"} {kpi.details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de Tendência Simulado */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendência de Conformidade (Últimos 30 dias)</h2>
        <div className="h-64 flex items-end gap-2">
          {[65, 68, 70, 72, 74, 75, 76, 77, 78].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                style={{ height: `${(value / 100) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-600 mt-2">Dia {index + 1}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4">
          A taxa de conformidade aumentou de 65% para 78% nos últimos 30 dias.
        </p>
      </div>

      {/* Resumo de Atividades Recentes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h2>
        <div className="space-y-3">
          {[
            { action: "PSS Elaborado", project: "Obra Kilamba - Reabilitação", date: "Hoje" },
            { action: "Requisito Atualizado", project: "Conformidade IGT", date: "Ontem" },
            { action: "Contratada Registada", project: "Construtora ABC", date: "2 dias atrás" },
            { action: "Documento Carregado", project: "Evidência de Seguro", date: "3 dias atrás" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-600">{activity.project}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalhes do KPI */}
      {showKPIDetail && selectedKPI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{selectedKPI}</h2>
              <button
                onClick={() => setShowKPIDetail(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Gráfico Temporal */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Últimos 90 dias</h3>
              <div className="h-40 flex items-end gap-1">
                {Array.from({ length: 30 }, (_, i) => Math.floor(Math.random() * 100)).map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                    style={{ height: `${value}%` }}
                    title={`Dia ${index + 1}: ${value}%`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Detalhes */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium">Valor Atual</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">78%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium">Variação Mensal</p>
                <p className="text-2xl font-bold text-green-600 mt-1">+5%</p>
              </div>
            </div>

            {/* Exportar */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowKPIDetail(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Fechar
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Exportar CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
